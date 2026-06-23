// =====================================================================
// import-capture.js -- Praxis unified capture engine (Stage 1)
//
// Brings a reader's existing book notes into the notebook with minimal
// manual input. Three pure-ish functions, loaded AFTER views.js so all
// app globals (state, getCurrentUser, genEntryId, getRegisterDefault,
// markNotebookDirty, saveState, renderNotebook, PRAXIS_CLIENT_KEY,
// deleteEntry) are already defined:
//
//   segmentDoc(rawText)   -> Promise<[{text,type,bookGuess,confidence,page}]>
//                            LLM segmentation via the claude proxy. Strict
//                            JSON only, parsed with the canonical pattern.
//   matchBook(guess)      -> bookId | null   (free-text -> the user's
//                            deduped library; NEVER a network call)
//   commitEntries(items)  -> [entryId,...]   BATCHED write of the locked
//                            11-field entry shape. De-dupes on body+book.
//
// ADDITIVE ONLY. Never re-normalizes or rewrites an existing entry (the
// N0 F5 rule). No SCHEMA_VERSION / migrate / normalizer changes -- every
// field written already exists in the locked shape. ES3: var/function,
// string concat, two-arg .then() and try/catch only (no promise sugar).
// =====================================================================

'use strict';

(function () {

  var PROXY_URL = '/.netlify/functions/claude-proxy';
  var TRANSCRIBE_PROXY_URL = '/.netlify/functions/transcribe-proxy';
  var SEG_MODEL = 'claude-sonnet-4-6';

  // ---- segmentation system prompt -------------------------------------
  // Strict-JSON contract. Built by concatenation so it can be read and
  // tuned in one place; the model + prompt never drift from the parser.
  var SEG_SYSTEM =
    'You are a careful archivist helping a reader bring their existing book '
    + 'notes into a notebook. Segment the reader\'s raw text into individual '
    + 'notes. For EACH note output one object.\n\n'
    + 'Rules:\n'
    + '- "text": the note\'s exact words, VERBATIM. Never paraphrase, summarize, '
    + 'correct, translate, or invent. Copy the reader\'s characters as written.\n'
    + '- "type": "quote" if the text is a passage quoted FROM a book (often in '
    + 'quotation marks, often with a page number); "note" if it is the reader\'s '
    + 'OWN remark, reaction, question, or connection.\n'
    + '- "bookGuess": the title of the book the note belongs to. Notes are often '
    + 'grouped under a book-title header line with that book\'s notes beneath it '
    + '-- attach that title to each note under it. If a note plainly names or is '
    + 'unmistakably about a book, use that title. Use the title text as written. '
    + 'If you cannot tell which book, use null.\n'
    + '- "confidence": "high" when the book is clear (a title header directly '
    + 'above, or named in the note); "low" when you are guessing or unsure. If '
    + 'bookGuess is null, confidence MUST be "low".\n'
    + '- "page": the page number if the note cites one (e.g. "p.34" -> "34"); '
    + 'otherwise null.\n'
    + '- A book-title header line is NOT itself a note -- never output it as its '
    + 'own item.\n'
    + '- Do not merge distinct notes; do not split a single note. Keep the '
    + 'reader\'s order. Output every note you find -- omitting a note is an error.\n\n'
    + 'Output ONLY a JSON object, with NO prose and NO markdown code fences, in '
    + 'exactly this shape:\n'
    + '{"segments":[{"text":"...","type":"quote","bookGuess":"...","confidence":"high","page":"34"}]}\n'
    + 'Use null (not an empty string) for an unknown bookGuess or page; never '
    + 'omit a field. If there are no notes, output {"segments":[]}.';

  // ---- response helpers (mirror yumi-brain.js:669-693) -----------------
  // Collect the text blocks from an Anthropic Messages response.
  function collectText(data) {
    var blocks = data && data.content;
    var text = '';
    var i;
    if (blocks && blocks.length) {
      for (i = 0; i < blocks.length; i = i + 1) {
        var b = blocks[i];
        if (b && b.type === 'text' && typeof b.text === 'string') {
          text = text + b.text;
        }
      }
    }
    return text;
  }

  // Tolerant JSON parse: direct, then brace-substring fallback. Returns
  // the parsed value or null (the caller decides how to surface failure).
  function parseJSON(text) {
    if (text === '') { return null; }
    try {
      return JSON.parse(text);
    } catch (e) {
      var st = text.indexOf('{');
      var en = text.lastIndexOf('}');
      if (st !== -1 && en !== -1 && en > st) {
        try { return JSON.parse(text.substring(st, en + 1)); }
        catch (e2) { return null; }
      }
      return null;
    }
  }

  // Validate + coerce the parsed payload into the segment contract. Drops
  // items with empty text; never invents. Returns an array (possibly []).
  function coerceSegments(parsed) {
    var out = [];
    if (!parsed || Object.prototype.toString.call(parsed.segments) !== '[object Array]') {
      return null; // shape failure -- distinct from "zero notes"
    }
    var list = parsed.segments;
    var i;
    for (i = 0; i < list.length; i = i + 1) {
      var raw = list[i];
      if (!raw || typeof raw !== 'object') { continue; }
      var text = (typeof raw.text === 'string') ? raw.text.replace(/^\s+|\s+$/g, '') : '';
      if (text === '') { continue; }
      var type = (raw.type === 'quote') ? 'quote' : 'note';
      var bookGuess = (typeof raw.bookGuess === 'string' && raw.bookGuess.replace(/^\s+|\s+$/g, '') !== '')
        ? raw.bookGuess.replace(/^\s+|\s+$/g, '') : null;
      var confidence = (raw.confidence === 'high' && bookGuess) ? 'high' : 'low';
      var page = (typeof raw.page === 'string' && raw.page.replace(/^\s+|\s+$/g, '') !== '')
        ? raw.page.replace(/^\s+|\s+$/g, '') : null;
      out.push({ text: text, type: type, bookGuess: bookGuess, confidence: confidence, page: page });
    }
    return out;
  }

  // ---- segmentDoc -----------------------------------------------------
  // Returns a Promise resolving to the segment array. Rejects (throws into
  // the chain) on transport failure or unparseable output -- NEVER resolves
  // to a silent partial drop. Empty input resolves to [] without a call.
  function segmentDoc(rawText) {
    var src = (typeof rawText === 'string') ? rawText.replace(/^\s+|\s+$/g, '') : '';
    if (src === '') {
      return new Promise(function (resolve) { resolve([]); });
    }
    var payload = {
      model: SEG_MODEL,
      max_tokens: 4096,
      temperature: 0,
      system: SEG_SYSTEM,
      messages: [ { role: 'user', content: src } ]
    };
    return fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (body) {
          throw new Error('segmentDoc: proxy ' + res.status + ': ' + body);
        });
      }
      return res.json();
    }).then(function (data) {
      var segs = coerceSegments(parseJSON(collectText(data)));
      if (segs === null) {
        throw new Error('segmentDoc: could not parse a {"segments":[...]} object from the model response');
      }
      return segs;
    });
  }

  // ---- matchBook ------------------------------------------------------
  // Normalize a title: lowercase, strip punctuation, collapse whitespace,
  // trim. Mirrors the titleToId normalization in gatherLensLibraryMetadata
  // (yumi-brain.js:866) plus a punctuation strip so "Pedagogy of the
  // Oppressed," resolves to "pedagogy of the oppressed".
  function normTitle(s) {
    if (typeof s !== 'string') { return ''; }
    return s.toLowerCase()
      .replace(/[^\w\s]/g, ' ')        // punctuation -> space
      .replace(/\s+/g, ' ')            // collapse runs
      .replace(/^\s+|\s+$/g, '');      // trim
  }

  // Resolve a free-text book name to a bookId in the CURRENT user's deduped
  // library (state.userBooks[uid].bookIds -> state.books[bid]). Exact
  // normalized match first; if none, a UNIQUE containment match (guess is a
  // substring of exactly one title, or one title is a substring of guess) --
  // covers edition suffixes without mis-filing. Null on no/ambiguous match.
  // No network: this is library resolution, not metadata fetch.
  function matchBook(guess) {
    var g = normTitle(guess);
    if (g === '') { return null; }
    var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!user || !user.uid) { return null; }
    var ids = (state.userBooks && state.userBooks[user.uid] && state.userBooks[user.uid].bookIds)
      ? state.userBooks[user.uid].bookIds : null;
    if (!ids || !ids.length) { return null; }
    var i;
    var containId = null;
    var containCount = 0;
    for (i = 0; i < ids.length; i = i + 1) {
      var bid = ids[i];
      var book = state.books ? state.books[bid] : null;
      if (!book) { continue; }
      var t = normTitle(book.title);
      if (t === '') { continue; }
      if (t === g) { return bid; }                                  // exact -> done
      if (t.indexOf(g) !== -1 || g.indexOf(t) !== -1) {             // candidate containment
        containId = bid;
        containCount = containCount + 1;
      }
    }
    return (containCount === 1) ? containId : null;                 // unique containment only
  }

  // ---- commitEntries --------------------------------------------------
  // Decide the register for an item from its type. Quote -> marginalia;
  // an own-note that reads as an explicit question (ends with '?') ->
  // question; otherwise marginalia. (Journal is no longer a commit-time
  // default -- it is an opt-in flip in the Stage-3 review, which clears
  // bookIds when chosen.) An explicit item.register overrides (used by
  // the Stage-3 queue when the reader picks).
  function looksLikeQuestion(t) {
    var s = String(t).replace(/\s+$/, '');
    return s.charAt(s.length - 1) === '?';
  }
  function registerFor(item) {
    if (item.register === 'marginalia' || item.register === 'journal' || item.register === 'question') {
      return item.register;
    }
    if (item.type === 'quote') { return 'marginalia'; }
    if (looksLikeQuestion(item.text)) { return 'question'; }
    return 'marginalia';
  }

  // Dedupe key: collapsed body + the (single) bookId, or empty for Inbox.
  function bodyKey(body, bid) {
    var b = String(body).replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    return b + '|' + (bid ? bid : '');
  }

  // BATCH write. For each kept item build the locked 11-field entry, insert
  // into state.notebookEntries, then ONE markNotebookDirty + ONE saveState +
  // ONE render. Skips an item whose (body, bookId) already exists on one of
  // this user's entries OR earlier in this same batch (re-import = zero adds).
  // Returns the array of created entryIds (Stage-3 undo consumes it). Never
  // touches an existing entry. Does NOT call captureNote (which re-renders +
  // fires Yumi per call).
  function commitEntries(items) {
    var created = [];
    if (!items || !items.length) { return created; }
    var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!user || !user.uid) { return created; }
    var uid = user.uid;
    if (!state.notebookEntries) { state.notebookEntries = {}; }

    // Seed the seen-set from this user's existing entries (additive dedupe).
    var seen = {};
    var k;
    for (k in state.notebookEntries) {
      if (Object.prototype.hasOwnProperty.call(state.notebookEntries, k)) {
        var ex = state.notebookEntries[k];
        if (ex && ex.userId === uid) {
          var exBid = (ex.bookIds && ex.bookIds.length) ? ex.bookIds[0] : '';
          seen[bodyKey(ex.body, exBid)] = true;
        }
      }
    }

    var now = Date.now();
    var i;
    for (i = 0; i < items.length; i = i + 1) {
      var item = items[i];
      if (!item || typeof item.text !== 'string' || item.text.replace(/^\s+|\s+$/g, '') === '') {
        continue;
      }
      var bid = item.bookId ? item.bookId : (item.bookGuess ? matchBook(item.bookGuess) : null);
      var key = bodyKey(item.text, bid ? bid : '');
      if (seen[key]) { continue; }   // duplicate -> skip (existing or in-batch)
      seen[key] = true;

      var register = registerFor(item);
      var id = genEntryId();
      state.notebookEntries[id] = {
        id:        id,
        userId:    uid,
        register:  register,
        isPrivate: getRegisterDefault(register),
        body:      item.text,
        bookIds:   bid ? [bid] : [],
        arcIds:    [],
        images:    [],
        filed:     bid ? true : false,   // matched -> book tab; unmatched -> Inbox
        createdAt: now,
        updatedAt: now
      };
      created.push(id);
    }

    if (created.length) {
      markNotebookDirty();
      saveState();
      renderNotebookIfMounted();
    }
    return created;
  }

  // Render the notebook only when its surface is on screen, so a headless /
  // off-route commit never crashes on a missing host. (Stage 2/3 mount the
  // capture surface inside the notebook route, so this repaints in place.)
  function renderNotebookIfMounted() {
    if (typeof renderNotebook !== 'function') { return; }
    try {
      if (document.getElementById('notebook-editor-host') ||
          (typeof currentRoute !== 'undefined' && currentRoute === 'notebook') ||
          (window.location && window.location.hash &&
           window.location.hash.indexOf('notebook') !== -1)) {
        renderNotebook();
      }
    } catch (e) { /* a repaint must never break a successful write */ }
  }

  // =====================================================================
  // Stage 2: capture overlay -- entry surface (paste + upload) -> the
  // "Yumi's reading" beat -> commit -> a filed confirmation. Dictation is
  // Prompt 3 (no mic here). The whole flow mounts as a FIXED overlay over
  // the notebook, so routing is untouched. Every selector is ic-* so it cannot
  // collide with or bleed into any existing surface; new colors live in
  // theme.css, never inline. The rich receipt + exception queue + undo are
  // Stage 3 -- this stage lands a minimal filed-confirmation handoff.
  // =====================================================================

  var OVERLAY_ID = 'ic-overlay';
  // Holds the most recent import for the receipt + undo. createdIds is the
  // stable list of THIS import's entry ids (undo consumes it, and it is the
  // ONLY set the queue / flip / undo may touch). meta is a display-only
  // side-map keyed by entry id carrying page / type / bookGuess / confidence
  // -- none of which live on the entry. Everything the receipt also shows
  // (body, register, visibility, book) is read LIVE from state.notebookEntries
  // so a re-file / flip / undo re-render reflects the real entry, not a stale
  // snapshot.
  //   { createdIds:[id], meta:{ id:{page,type,bookGuess,confidence} },
  //     total:Number, skipped:Number }
  var lastImport = null;
  // The most recent dictated note (Stage 4), a 1-entry import: { id, kept }. Its
  // id is also lastImport.createdIds[0], so ownsEntry / undo guard it identically.
  var lastDictation = null;

  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'
    + '<polyline points="20 6 9 17 4 12"></polyline></svg>';
  var CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<polyline points="9 18 15 12 9 6"></polyline></svg>';
  var MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>'
    + '<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>'
    + '<line x1="12" y1="19" x2="12" y2="22"></line></svg>';

  // Tiny DOM helper (createElement + className + text). Keeps the builders terse
  // without any innerHTML of user text (so a pasted note can never inject).
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (txt !== null && txt !== undefined) { n.textContent = txt; }
    return n;
  }

  function closeBtn(onClick) {
    var b = el('button', 'ic-close', '×');
    b.type = 'button';
    b.setAttribute('aria-label', 'Close');
    b.addEventListener('click', onClick);
    return b;
  }

  function close() {
    var o = document.getElementById(OVERLAY_ID);
    if (o && o.parentNode) { o.parentNode.removeChild(o); }
  }

  // Close the overlay AND repaint the notebook so freshly-filed entries show.
  function done() {
    close();
    renderNotebookIfMounted();
  }

  function open() {
    close(); // never stack two overlays
    var ov = el('div', 'ic-overlay');
    ov.id = OVERLAY_ID;
    var panel = el('div', 'ic-panel');
    ov.appendChild(panel);
    // Scrim click (outside the panel) closes; panel clicks do not.
    ov.addEventListener('click', function (e) { if (e.target === ov) { close(); } });
    document.body.appendChild(ov);
    renderEntry(panel);
  }

  // ---- entry screen: paste + upload -----------------------------------
  function renderEntry(panel) {
    panel.innerHTML = '';
    panel.appendChild(closeBtn(close));
    panel.appendChild(el('div', 'ic-eyebrow', 'Add to notebook'));
    var h = el('h2', 'ic-h1');
    h.appendChild(document.createTextNode('Bring in your '));
    h.appendChild(el('em', null, 'notes'));
    panel.appendChild(h);
    panel.appendChild(el('p', 'ic-sub',
      'Dictate, paste, or drop in a file. Yumi files each note to the right book '
      + '— you only weigh in when she’s unsure.'));

    // Dictation hero: the mic when SpeechRecognition is supported, else a
    // single-note textarea on the SAME engine path -- never a dead mic.
    if (window.VoiceInput && VoiceInput.isSupported()) {
      panel.appendChild(buildMicHero(panel));
    } else {
      panel.appendChild(buildTypeNoteHero(panel));
    }
    panel.appendChild(el('div', 'ic-or-row', 'or'));

    var ins = el('div', 'ic-ins');
    var pasteToggle = el('button', 'ic-pill', 'Paste notes'); pasteToggle.type = 'button';
    var uploadBtn = el('button', 'ic-pill', 'Upload a file'); uploadBtn.type = 'button';
    ins.appendChild(pasteToggle);
    ins.appendChild(uploadBtn);
    panel.appendChild(ins);

    var file = el('input', 'ic-file');
    file.type = 'file';
    file.accept = '.txt,.md,text/plain';
    panel.appendChild(file);

    var pasteArea = el('div', 'ic-paste');
    var ta = el('textarea', 'ic-textarea');
    ta.setAttribute('placeholder', 'Paste notes here — Yumi will sort them to your books…');
    pasteArea.appendChild(ta);
    var goWrap = el('div', 'ic-cta-wrap');
    var go = el('button', 'ic-cta', 'Hand to Yumi'); go.type = 'button';
    goWrap.appendChild(go);
    pasteArea.appendChild(goWrap);
    panel.appendChild(pasteArea);

    pasteToggle.addEventListener('click', function () {
      var showing = pasteArea.className.indexOf('ic-show') > -1;
      pasteArea.className = showing ? 'ic-paste' : 'ic-paste ic-show';
      if (!showing) { ta.focus(); }
    });
    uploadBtn.addEventListener('click', function () { file.click(); });
    file.addEventListener('change', function () {
      if (!file.files || !file.files.length) { return; }
      var f = file.files[0];
      var reader = new FileReader();
      reader.onload = function () { runImport(panel, String(reader.result || ''), f.name); };
      reader.onerror = function () { renderError(panel, 'Could not read that file.'); };
      reader.readAsText(f);
    });
    go.addEventListener('click', function () {
      if ((ta.value || '').replace(/^\s+|\s+$/g, '') === '') { ta.focus(); return; }
      runImport(panel, ta.value, 'pasted notes');
    });
  }

  // ---- processing beat ------------------------------------------------
  function renderProcessing(panel, label) {
    panel.innerHTML = '';
    var proc = el('div', 'ic-proc');
    proc.appendChild(el('div', 'ic-orb', 'Y'));
    proc.appendChild(el('div', 'ic-proc-txt', 'Reading your notes…'));
    proc.appendChild(el('div', 'ic-proc-sub', label));
    panel.appendChild(proc);
  }

  // ---- orchestration: segment -> commit -> confirm --------------------
  function runImport(panel, rawText, label) {
    renderProcessing(panel, label);
    segmentDoc(rawText).then(function (segs) {
      var items = [];
      var i;
      for (i = 0; i < segs.length; i = i + 1) {
        items.push({
          text: segs[i].text, type: segs[i].type, bookGuess: segs[i].bookGuess,
          confidence: segs[i].confidence, page: segs[i].page
        });
      }
      var createdIds = commitEntries(items);
      // Index the inputs by the SAME (body|bookId) key + book resolution
      // commitEntries uses, so each created entry maps back to its source
      // segment's display-only data (page / type / guess / confidence -- none
      // of which live on the entry). First occurrence wins, mirroring dedupe.
      var idx = {};
      for (i = 0; i < items.length; i = i + 1) {
        var it = items[i];
        var ibid = it.bookId ? it.bookId : (it.bookGuess ? matchBook(it.bookGuess) : null);
        var ikey = bodyKey(it.text, ibid ? ibid : '');
        if (!Object.prototype.hasOwnProperty.call(idx, ikey)) {
          idx[ikey] = { page: it.page, type: it.type, bookGuess: it.bookGuess, confidence: it.confidence };
        }
      }
      var meta = {};
      for (i = 0; i < createdIds.length; i = i + 1) {
        var e = state.notebookEntries[createdIds[i]];
        if (!e) { continue; }
        var ekey = bodyKey(e.body, (e.bookIds && e.bookIds.length) ? e.bookIds[0] : '');
        var m = idx[ekey] || {};
        meta[e.id] = {
          page:       (m.page ? m.page : null),
          type:       (m.type ? m.type : 'note'),
          bookGuess:  (m.bookGuess ? m.bookGuess : null),
          confidence: (m.confidence ? m.confidence : 'low')
        };
      }
      lastImport = {
        createdIds: createdIds, meta: meta,
        total: segs.length, skipped: segs.length - createdIds.length
      };
      renderReceipt(panel);
    }, function (err) {
      if (window.console && console.warn) { console.warn('import: ' + (err && err.message ? err.message : err)); }
      renderError(panel, 'Yumi couldn’t read those notes. Please try again.');
    });
  }

  // ---- receipt: book-grouped, progressively disclosed -----------------
  // Reads LIVE entries from state.notebookEntries (so a re-file / flip / undo
  // re-render shows the real entry) plus lastImport.meta for the display-only
  // fields that never live on an entry (page / type / bookGuess). Created
  // entries bucket three ways: booked (under their book), bookless-journal (a
  // private journal note -> the "kept private" group), and bookless-other
  // (marginalia/question, no book -> the Inbox needbar). At import there are no
  // journal notes; they arise only from the per-note flip below.
  function renderReceipt(panel) {
    panel.innerHTML = '';
    panel.appendChild(closeBtn(done));

    var ids = (lastImport && lastImport.createdIds) ? lastImport.createdIds : [];
    var metaOf = (lastImport && lastImport.meta) ? lastImport.meta : {};
    var groups = [];
    var gIndex = {};
    var inbox = [];
    var journals = [];
    // savedCount = distinct created entries (the headline total; a multi-book
    // entry is ONE note even though it shows under each book), counted live so
    // it equals the stored count and reconciles with the Inbox needbar.
    var savedCount = 0;
    var i, j, e;
    for (i = 0; i < ids.length; i = i + 1) {
      e = state.notebookEntries ? state.notebookEntries[ids[i]] : null;
      if (!e) { continue; }
      savedCount = savedCount + 1;
      // Bucket on the SAME fields notebookEntryMatchesTab (views.js) routes on
      // -- register, filed, and EVERY bookId -- so the receipt can never
      // structurally diverge from the notebook: journal by register; a filed,
      // booked note under EACH of its books; everything else to the Inbox.
      // (Imports write 0/1 book today, but iterating all bookIds keeps this
      // honest if a multi-book entry ever reaches here.)
      if (e.register === 'journal') { journals.push(e); continue; }
      if (e.filed === true && e.bookIds && e.bookIds.length) {
        for (j = 0; j < e.bookIds.length; j = j + 1) {
          var bid = e.bookIds[j];
          if (!bid) { continue; }
          if (!Object.prototype.hasOwnProperty.call(gIndex, bid)) {
            var book = state.books ? state.books[bid] : null;
            gIndex[bid] = groups.length;
            groups.push({
              title:  (book && typeof book.title === 'string' && book.title) ? book.title : 'Untitled',
              author: (book && typeof book.author === 'string') ? book.author : '',
              journal: false,
              entries: []
            });
          }
          groups[gIndex[bid]].entries.push(e);
        }
      } else {
        inbox.push(e);
      }
    }

    // head: seal + "Filed" + count
    var head = el('div', 'ic-r-head');
    var seal = el('span', 'ic-seal');
    seal.innerHTML = CHECK_SVG; // static markup only -- never user text
    head.appendChild(seal);
    var hb = el('div');
    hb.appendChild(el('div', 'ic-eyebrow', 'Filed'));
    var titleTxt;
    if (groups.length > 0) {
      titleTxt = savedCount + (savedCount === 1 ? ' note, ' : ' notes, ')
        + groups.length + (groups.length === 1 ? ' book' : ' books');
    } else {
      titleTxt = savedCount + (savedCount === 1 ? ' note saved' : ' notes saved');
    }
    hb.appendChild(el('h2', 'ic-h1', titleTxt));
    head.appendChild(hb);
    panel.appendChild(head);

    // Honest default-visibility copy + the flip-to-private hint (the control
    // lives in each note's ··· detail). Replaces the false Stage-2 "kept
    // private" line -- own-notes file as PUBLIC marginalia by default now.
    var subTxt = 'Quotes and your notes are filed as marginalia Yumi can read — '
      + 'open any note’s ··· to make it private. Nothing added that you didn’t write.';
    if (lastImport && lastImport.skipped) {
      // skipped counts BOTH already-in-notebook and in-batch duplicates, so
      // "duplicate" is the honest word -- not "already in your notebook".
      subTxt = subTxt + ' ' + lastImport.skipped
        + (lastImport.skipped === 1 ? ' duplicate was skipped.' : ' duplicates were skipped.');
    }
    panel.appendChild(el('p', 'ic-sub', subTxt));

    // book-grouped list (+ a "kept private" group for any flipped journal notes)
    if (groups.length || journals.length) {
      var list = el('div', 'ic-books');
      for (i = 0; i < groups.length; i = i + 1) {
        list.appendChild(buildBookRow(panel, groups[i], metaOf));
      }
      if (journals.length) {
        list.appendChild(buildBookRow(panel, {
          title: 'Kept private', author: 'journal — only you', journal: true, entries: journals
        }, metaOf));
      }
      panel.appendChild(list);
    }

    // Inbox needbar: bookless, non-journal entries. Click -> the queue.
    var needbar = buildNeedBar(inbox.length);
    if (inbox.length > 0) {
      needbar.addEventListener('click', function () { openQueue(panel); });
    }
    panel.appendChild(needbar);

    // foot: Undo import (deletes this import's entries) + Done
    var foot = el('div', 'ic-r-foot');
    var undo = el('button', 'ic-linkbtn', '↩ Undo import'); undo.type = 'button';
    undo.addEventListener('click', function () { undoImport(panel); });
    var doneBtn = el('button', 'ic-cta', 'Done'); doneBtn.type = 'button';
    doneBtn.addEventListener('click', done);
    foot.appendChild(undo);
    foot.appendChild(doneBtn);
    panel.appendChild(foot);
  }

  // One group row: a clickable header (chevron + title + author + count) over a
  // hidden notes list the header toggles open. Used for books and for the
  // "kept private" journal group (group.journal -> a muted label).
  function buildBookRow(panel, group, metaOf) {
    var base = group.journal ? 'ic-brow ic-brow-journal' : 'ic-brow';
    var row = el('div', base);
    var main = el('div', 'ic-brow-main');
    var chev = el('span', 'ic-chev');
    chev.innerHTML = CHEV_SVG; // static
    main.appendChild(chev);
    main.appendChild(el('span', 'ic-bk', group.title));
    if (group.author) { main.appendChild(el('span', 'ic-au', group.author)); }
    main.appendChild(el('span', 'ic-n', String(group.entries.length)));
    main.addEventListener('click', function () {
      row.className = (row.className.indexOf('ic-open') > -1) ? base : (base + ' ic-open');
    });
    row.appendChild(main);
    var notes = el('div', 'ic-notes');
    var j;
    for (j = 0; j < group.entries.length; j = j + 1) {
      notes.appendChild(buildNoteRow(panel, group.entries[j], metaOf));
    }
    row.appendChild(notes);
    return row;
  }

  // One note row: the text (quote-styled if it was a quote) + a ··· toggle to a
  // mono detail line (register / visibility / kind / page) AND the register-flip
  // control. User text reaches the DOM only via textContent -- no injection.
  function buildNoteRow(panel, entry, metaOf) {
    var m = metaOf[entry.id] || {};
    var isQuote = (m.type === 'quote');
    var nrow = el('div', 'ic-nrow');
    nrow.appendChild(el(
      'div', isQuote ? 'ic-ntext ic-q' : 'ic-ntext',
      isQuote ? ('“' + entry.body + '”') : entry.body
    ));
    var bar = el('div', 'ic-nrow-bar');
    var dots = el('button', 'ic-dots', '···'); dots.type = 'button';
    var detail = el('div', 'ic-detail');
    var line = el('div', 'ic-detail-line');
    line.appendChild(el('span', entry.isPrivate ? 'ic-pv' : 'ic-v', entry.register));
    line.appendChild(document.createTextNode(
      ' · ' + (entry.isPrivate ? 'private' : 'Yumi sees')
      + (m.type ? (' · ' + m.type) : '')
      + (m.page ? (' · p.' + m.page) : '')
    ));
    detail.appendChild(line);
    detail.appendChild(buildFlip(panel, entry));
    dots.addEventListener('click', function () {
      detail.className = (detail.className.indexOf('ic-show') > -1) ? 'ic-detail' : 'ic-detail ic-show';
    });
    bar.appendChild(dots);
    nrow.appendChild(bar);
    nrow.appendChild(detail);
    return nrow;
  }

  // The register-flip control inside a note's detail: three pills (marginalia /
  // journal / question), the current one marked + inert. Flipping mutates ONLY
  // this entry (it is in createdIds) -- see flipRegister.
  function buildFlip(panel, entry) {
    var flip = el('div', 'ic-flip');
    flip.appendChild(el('span', 'ic-flip-label', 'file as'));
    var regs = ['marginalia', 'journal', 'question'];
    var fi;
    for (fi = 0; fi < regs.length; fi = fi + 1) {
      (function (r) {
        var on = (entry.register === r);
        var pill = el('button', on ? 'ic-flip-pill ic-on' : 'ic-flip-pill', r);
        pill.type = 'button';
        if (!on) {
          pill.addEventListener('click', function () { flipRegister(panel, entry.id, r); });
        }
        flip.appendChild(pill);
      })(regs[fi]);
    }
    return flip;
  }

  // The Inbox needbar: a count + an honest "sitting in your Inbox" line when
  // some notes are unmatched, or a calm "all filed" state when none are.
  function buildNeedBar(count) {
    var bar = el('div', count > 0 ? 'ic-needbar' : 'ic-needbar ic-clear');
    var ico = el('span', 'ic-need-ico');
    if (count > 0) { ico.textContent = String(count); }
    else { ico.innerHTML = CHECK_SVG; } // static
    bar.appendChild(ico);
    var txt = el('span', 'ic-need-txt');
    if (count > 0) {
      txt.appendChild(document.createTextNode(
        count + (count === 1 ? ' note ' : ' notes ') + 'sitting in your Inbox'));
      txt.appendChild(el('span', 'ic-lo',
        'Yumi wasn’t sure which book — tap to sort, or leave them in your Inbox.'));
    } else {
      txt.appendChild(document.createTextNode('All filed'));
      txt.appendChild(el('span', 'ic-lo', 'Every note landed in its book.'));
    }
    bar.appendChild(txt);
    if (count > 0) { bar.appendChild(el('span', 'ic-need-arrow', '→')); }
    return bar;
  }

  // =====================================================================
  // Stage 3b-2: interactive mutate / delete layer (queue + flip + undo).
  // EVERY path here may read-modify-write or delete ONLY an entry whose id is
  // in THIS import's createdIds. ownsEntry is the single guard; each mutator
  // calls it first. One markNotebookDirty + saveState + render per action.
  // =====================================================================
  function ownsEntry(id) {
    var ids = (lastImport && lastImport.createdIds) ? lastImport.createdIds : [];
    var i;
    for (i = 0; i < ids.length; i = i + 1) { if (ids[i] === id) { return true; } }
    return false;
  }

  // Loose book candidates for an unmatched note: library books whose normalized
  // title overlaps the guess (containment, or a shared word of >=4 chars).
  // Capped at 4. Empty guess or no overlap -> [] (Inbox only). No network.
  function candidateBooks(guess) {
    var out = [];
    var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!user || !user.uid) { return out; }
    var ids = (state.userBooks && state.userBooks[user.uid] && state.userBooks[user.uid].bookIds)
      ? state.userBooks[user.uid].bookIds : null;
    if (!ids || !ids.length) { return out; }
    var g = normTitle(guess || '');
    var gtok = g ? g.split(' ') : [];
    var i, j;
    for (i = 0; i < ids.length && out.length < 4; i = i + 1) {
      var bid = ids[i];
      var book = state.books ? state.books[bid] : null;
      if (!book || typeof book.title !== 'string') { continue; }
      var t = normTitle(book.title);
      if (t === '') { continue; }
      var hit = false;
      if (g && (t.indexOf(g) !== -1 || g.indexOf(t) !== -1)) { hit = true; }
      else {
        for (j = 0; j < gtok.length; j = j + 1) {
          if (gtok[j].length >= 4 && (' ' + t + ' ').indexOf(' ' + gtok[j] + ' ') !== -1) { hit = true; break; }
        }
      }
      if (hit) { out.push({ bid: bid, title: book.title, author: (typeof book.author === 'string') ? book.author : '' }); }
    }
    return out;
  }

  // Flip a note's register. -> journal: detach from the book (bookIds:[]) and
  // filed:true (journal routes by register, matching captureNote); -> marginalia
  // / question: keep bookIds as-is (NO auto-restore), and filed then tracks
  // whether a book remains. isPrivate always follows the new register's default.
  function flipRegister(panel, entryId, newRegister) {
    if (!ownsEntry(entryId)) { return; }
    if (newRegister !== 'marginalia' && newRegister !== 'journal' && newRegister !== 'question') { return; }
    var e = state.notebookEntries ? state.notebookEntries[entryId] : null;
    if (!e) { return; }
    e.register = newRegister;
    if (newRegister === 'journal') {
      e.bookIds = [];
      e.filed = true;
    } else {
      e.filed = (e.bookIds && e.bookIds.length) ? true : false;
    }
    e.isPrivate = getRegisterDefault(newRegister);
    e.updatedAt = Date.now();
    markNotebookDirty();
    saveState();
    renderReceipt(panel);
  }

  // Re-file an Inbox note to a book IN PLACE (register unchanged). Re-renders
  // the queue; the note drops out (it now has a book) and an empty queue
  // returns to the receipt.
  function fileToBook(panel, dismissed, entryId, bid) {
    if (!ownsEntry(entryId) || !bid) { return; }
    var e = state.notebookEntries ? state.notebookEntries[entryId] : null;
    if (!e) { return; }
    e.bookIds = [bid];
    e.filed = true;
    e.updatedAt = Date.now();
    markNotebookDirty();
    saveState();
    renderQueue(panel, dismissed);
  }

  // Leave a note in the Inbox: a no-op on the entry (already filed:false); just
  // dismiss its card from THIS queue pass so the reader can finish the rest.
  function leaveInInbox(panel, dismissed, entryId) {
    dismissed[entryId] = true;
    renderQueue(panel, dismissed);
  }

  // Open a fresh queue pass over the current Inbox notes.
  function openQueue(panel) {
    renderQueue(panel, {});
  }

  // Render the exception queue: a card per Inbox note (createdIds, no book, not
  // journal, not dismissed this pass). Empty -> back to the receipt.
  function renderQueue(panel, dismissed) {
    var ids = (lastImport && lastImport.createdIds) ? lastImport.createdIds : [];
    var metaOf = (lastImport && lastImport.meta) ? lastImport.meta : {};
    var pending = [];
    var i, e;
    for (i = 0; i < ids.length; i = i + 1) {
      e = state.notebookEntries ? state.notebookEntries[ids[i]] : null;
      if (!e) { continue; }
      // pending == the Inbox routing predicate (notebookEntryMatchesTab):
      // non-journal AND filed === false. filed is the canonical signal (no
      // bookIds[0] check); a re-file sets filed:true and drops it from here.
      if (e.register === 'journal') { continue; }
      if (e.filed !== false) { continue; }
      if (dismissed[e.id]) { continue; }
      pending.push(e);
    }
    if (!pending.length) { renderReceipt(panel); return; }

    panel.innerHTML = '';
    panel.appendChild(closeBtn(done));
    panel.appendChild(el('div', 'ic-eyebrow', 'Needs a moment'));
    panel.appendChild(el('h2', 'ic-h1',
      (pending.length === 1) ? 'One I wasn’t sure about' : (pending.length + ' I wasn’t sure about')));
    var ywrap = el('div', 'ic-q-yumi');
    ywrap.appendChild(el('span', 'ic-q-yorb', 'Y'));
    ywrap.appendChild(el('p', 'ic-q-ytxt',
      'I’d rather ask than guess wrong. Which book is each from?'));
    panel.appendChild(ywrap);
    for (i = 0; i < pending.length; i = i + 1) {
      panel.appendChild(buildQueueCard(panel, dismissed, pending[i], metaOf));
    }
    panel.appendChild(el('div', 'ic-qprog', pending.length + ' left'));
  }

  // One queue card: the note + Yumi's guess as one-tap chips + "Leave in Inbox".
  function buildQueueCard(panel, dismissed, entry, metaOf) {
    var m = metaOf[entry.id] || {};
    var isQuote = (m.type === 'quote');
    var card = el('div', 'ic-qcard');
    card.appendChild(el('div', isQuote ? 'ic-qtext ic-q' : 'ic-qtext',
      isQuote ? ('“' + entry.body + '”') : entry.body));
    card.appendChild(el('div', 'ic-qask', 'Which book?'));
    var chips = el('div', 'ic-guesses');
    var cands = candidateBooks(m.bookGuess);
    var i;
    for (i = 0; i < cands.length; i = i + 1) {
      (function (c) {
        var chip = el('button', 'ic-guess'); chip.type = 'button';
        chip.appendChild(document.createTextNode(c.title));
        if (c.author) { chip.appendChild(el('span', 'ic-guess-au', c.author)); }
        chip.addEventListener('click', function () { fileToBook(panel, dismissed, entry.id, c.bid); });
        chips.appendChild(chip);
      })(cands[i]);
    }
    var leave = el('button', 'ic-guess ic-alt', 'Leave in Inbox'); leave.type = 'button';
    leave.addEventListener('click', function () { leaveInInbox(panel, dismissed, entry.id); });
    chips.appendChild(leave);
    card.appendChild(chips);
    return card;
  }

  // Undo the whole import: delete exactly this import's entries (each is in
  // createdIds, arcIds:[] so deleteEntry's arc-cascade is a no-op), persist
  // once, close, and repaint the notebook to its pre-import state.
  function undoImport(panel) {
    var ids = (lastImport && lastImport.createdIds) ? lastImport.createdIds : [];
    var removed = 0;
    var i;
    for (i = 0; i < ids.length; i = i + 1) {
      if (typeof deleteEntry === 'function' && deleteEntry(ids[i])) { removed = removed + 1; }
    }
    if (removed) { saveState(); }
    lastImport = null;
    close();
    renderNotebookIfMounted();
  }

  // =====================================================================
  // Stage 4: dictation -- "Talk to Yumi". VoiceInput (SpeechRecognition,
  // single-utterance, final-only) -> segmentDoc parses the transcript (NO new
  // parser) -> commitEntries writes ONE note -> a light confirmation. An
  // unsupported browser falls back to a single-note textarea on the SAME path
  // (never a dead mic). The dictated note is its own 1-item import
  // (lastImport.createdIds=[id]), so ownsEntry / deleteEntry guard it exactly
  // like the bulk path -- F5: only this id is ever read-modify-written/deleted.
  // =====================================================================

  // ---------------------------------------------------------------------
  // Dictation v2 transport: record-and-transcribe (MediaRecorder + a gated
  // server STT proxy). Replaces the Web Speech / VoiceInput dependency with a
  // path that works consistently on every HTTPS browser. These helpers yield
  // a transcript STRING and call back; they NEVER read or write state -- the
  // sole entry mutator stays processDictation. Wired into the UI in Stage 2;
  // dormant (uncalled) until then.
  // ---------------------------------------------------------------------

  // True when this browser can capture + record mic audio (HTTPS-only APIs).
  // When false the dictation UI keeps the textarea fallback (never a dead mic).
  function canRecord() {
    return !!(navigator.mediaDevices &&
              navigator.mediaDevices.getUserMedia &&
              typeof MediaRecorder !== 'undefined');
  }

  // Negotiate a container the running browser can actually record, in
  // preference order: Chrome/Firefox -> audio/webm;codecs=opus; Safari/iOS ->
  // audio/mp4. '' means MediaRecorder picks (read rec.mimeType after).
  function pickAudioMimeType() {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) { return ''; }
    var candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
    var i;
    for (i = 0; i < candidates.length; i = i + 1) {
      if (MediaRecorder.isTypeSupported(candidates[i])) { return candidates[i]; }
    }
    return '';
  }

  // Read the recorded blob as base64 and POST it to the gated transcribe proxy.
  // Hands the transcript STRING to cbs.onResult. Touches no state; never logs
  // the audio or the key. Two-arg .then(ok, err) handlers throughout (ES3).
  function transcribeBlob(blob, mimeType, cbs) {
    var reader = new FileReader();
    reader.onload = function () {
      var b64 = String(reader.result || '').replace(/^data:[^;]*;base64,/, '');
      if (!b64) { if (cbs.onError) { cbs.onError('failed'); } return; }
      fetch(TRANSCRIBE_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
        body: JSON.stringify({ audio: b64, mimeType: mimeType })
      }).then(function (res) {
        if (!res.ok) { if (cbs.onError) { cbs.onError('failed'); } return; }
        res.json().then(function (data) {
          var text = (data && typeof data.transcript === 'string') ? data.transcript : '';
          if (cbs.onResult) { cbs.onResult(text); }
        }, function () { if (cbs.onError) { cbs.onError('failed'); } });
      }, function () { if (cbs.onError) { cbs.onError('failed'); } });
    };
    reader.onerror = function () { if (cbs.onError) { cbs.onError('failed'); } };
    reader.readAsDataURL(blob);
  }

  // Start recording mic audio; return a session handle { stop: fn } so the UI
  // can tap-to-stop. On stop: release the mic (clears the iOS indicator),
  // assemble ONE blob, then transcribe. Callbacks:
  //   onStart()        recording began
  //   onTranscribing() recording stopped, awaiting the transcript
  //   onResult(text)   transcript ready (a string; may be '')
  //   onError(reason)  'unsupported' | 'denied' | 'failed' -> textarea fallback
  // Must be called inside a user-gesture handler (iOS requirement).
  function recordAndTranscribe(cbs) {
    cbs = cbs || {};
    if (!canRecord()) { if (cbs.onError) { cbs.onError('unsupported'); } return null; }
    var session = { stop: function () {}, stopped: false };
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var releaseTracks = function () {
        try {
          var tr = stream.getTracks(); var j;
          for (j = 0; j < tr.length; j = j + 1) { tr[j].stop(); }
        } catch (e1) {}
      };
      var mt = pickAudioMimeType();
      var rec = mt ? new MediaRecorder(stream, { mimeType: mt }) : new MediaRecorder(stream);
      var chunks = [];
      rec.ondataavailable = function (e) { if (e.data && e.data.size) { chunks.push(e.data); } };
      rec.onstop = function () {
        releaseTracks();
        var type = rec.mimeType || mt || (chunks.length ? chunks[0].type : '') || 'audio/webm';
        var blob = new Blob(chunks, { type: type });
        if (!blob.size) { if (cbs.onError) { cbs.onError('failed'); } return; }
        if (cbs.onTranscribing) { cbs.onTranscribing(); }
        transcribeBlob(blob, type, cbs);
      };
      rec.onerror = function () { releaseTracks(); if (cbs.onError) { cbs.onError('failed'); } };
      session.stop = function () {
        if (session.stopped) { return; }
        session.stopped = true;
        try {
          if (rec.state !== 'inactive') { rec.stop(); } else { releaseTracks(); }
        } catch (e2) { releaseTracks(); if (cbs.onError) { cbs.onError('failed'); } }
      };
      try { rec.start(); } catch (e3) { releaseTracks(); if (cbs.onError) { cbs.onError('failed'); } return; }
      if (cbs.onStart) { cbs.onStart(); }
    }, function (err) {
      var n = err && err.name;
      var reason = (n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError') ? 'denied' : 'failed';
      if (cbs.onError) { cbs.onError(reason); }
    });
    return session;
  }

  // Mic hero (shown when SpeechRecognition is supported).
  function buildMicHero(panel) {
    var hero = el('div', 'ic-mic-hero');
    var mic = el('button', 'ic-mic'); mic.type = 'button';
    mic.setAttribute('aria-label', 'Dictate a note');
    mic.innerHTML = MIC_SVG; // static markup only -- never user text
    mic.addEventListener('click', function () { startDictation(panel); });
    hero.appendChild(mic);
    hero.appendChild(el('div', 'ic-mic-label', 'Talk to Yumi'));
    hero.appendChild(el('div', 'ic-mic-hint',
      '“Note on Freire — the banking metaphor keeps showing up…”'));
    return hero;
  }

  // The textarea composer that feeds the single-note path -- shared by the
  // unsupported-browser hero and the mic-error fallback screen.
  function buildNoteComposer(panel) {
    var box = el('div', 'ic-compose');
    var ta = el('textarea', 'ic-textarea');
    ta.setAttribute('placeholder', 'A note on a book — Yumi will file it…');
    box.appendChild(ta);
    var wrap = el('div', 'ic-cta-wrap');
    var go = el('button', 'ic-cta', 'Hand to Yumi'); go.type = 'button';
    go.addEventListener('click', function () {
      var v = (ta.value || '').replace(/^\s+|\s+$/g, '');
      if (v === '') { ta.focus(); return; }
      processDictation(panel, v);
    });
    wrap.appendChild(go);
    box.appendChild(wrap);
    return box;
  }

  // Unsupported-browser hero: a labelled single-note composer in place of the mic.
  function buildTypeNoteHero(panel) {
    var hero = el('div', 'ic-typenote');
    hero.appendChild(el('div', 'ic-mic-label', 'Type a quick note'));
    hero.appendChild(buildNoteComposer(panel));
    return hero;
  }

  // Mic-error fallback screen: the composer with an explanatory line.
  function renderTypeNote(panel, msg) {
    panel.innerHTML = '';
    panel.appendChild(closeBtn(close));
    panel.appendChild(el('div', 'ic-eyebrow', 'Type a note'));
    panel.appendChild(el('h2', 'ic-h1', 'Type your note'));
    if (msg) { panel.appendChild(el('p', 'ic-sub', msg)); }
    panel.appendChild(buildNoteComposer(panel));
  }

  // The listening screen: equalizer bars + a state label + the final transcript.
  function renderListening(panel) {
    panel.innerHTML = '';
    panel.appendChild(closeBtn(close));
    var wrap = el('div', 'ic-listen');
    var bars = el('div', 'ic-bars');
    var k;
    for (k = 0; k < 5; k = k + 1) { bars.appendChild(el('span')); }
    wrap.appendChild(bars);
    var st = el('div', 'ic-listen-state', 'Listening');
    wrap.appendChild(st);
    var tx = el('div', 'ic-transcript');
    wrap.appendChild(tx);
    panel.appendChild(wrap);
    return { state: st, transcript: tx };
  }

  // Start one single-utterance recognition. onTranscript (final only) parses +
  // commits; errors fall back gracefully (no-speech -> retry; denied/unavailable
  // -> the type-a-note screen). VoiceInput is the SOLE SpeechRecognition site.
  function startDictation(panel) {
    if (!(window.VoiceInput && VoiceInput.isSupported())) { renderTypeNote(panel, null); return; }
    var ui = renderListening(panel);
    VoiceInput.listen({
      onStart: function () { ui.state.textContent = 'Listening'; },
      onTranscript: function (text) {
        ui.state.textContent = 'Yumi heard you';
        ui.transcript.textContent = text;
        processDictation(panel, text);
      },
      onError: function (reason) {
        if (reason === 'no-speech') {
          renderError(panel, 'I didn’t catch that. Tap “Try again” and speak after the chime.');
        } else if (reason === 'denied') {
          renderTypeNote(panel, 'Microphone access is blocked. Allow it in your browser, or type the note here.');
        } else {
          renderTypeNote(panel, 'Voice isn’t available here — type the note instead.');
        }
      },
      onEnd: function () {}
    });
  }

  // Parse the transcript with the SAME engine the bulk path uses (segmentDoc),
  // commit the ONE note, stash it as a 1-item import, show the light confirm.
  // An empty/unstructured transcript becomes a plain own-note (never dropped).
  function processDictation(panel, transcript) {
    renderProcessing(panel, 'sorting your note…');
    segmentDoc(transcript).then(function (segs) {
      var item;
      if (segs && segs.length) {
        item = { text: segs[0].text, type: segs[0].type, bookGuess: segs[0].bookGuess,
                 confidence: segs[0].confidence, page: segs[0].page };
      } else {
        item = { text: transcript, type: 'note', bookGuess: null, confidence: 'low', page: null };
      }
      var createdIds = commitEntries([item]);
      if (!createdIds.length) { renderError(panel, 'You already have that note in your notebook.'); return; }
      var id = createdIds[0];
      lastDictation = { id: id, kept: false };
      lastImport = { createdIds: [id], meta: {}, total: 1, skipped: 0 };
      lastImport.meta[id] = { page: item.page, type: item.type, bookGuess: item.bookGuess, confidence: item.confidence };
      renderDictated(panel);
    }, function (err) {
      if (window.console && console.warn) { console.warn('dictation: ' + (err && err.message ? err.message : err)); }
      renderError(panel, 'Yumi couldn’t read that. Tap “Try again”.');
    });
  }

  // Light dictation confirmation. Reads the ONE created entry LIVE. Filed to a
  // book -> "Filed as <register> to <book>". No book -> the inline confirm (the
  // queue chip pattern, NOT the full queue): tap a candidate to re-file, or keep
  // it in the Inbox. Undo deletes only this note; Another note re-opens entry.
  function renderDictated(panel) {
    panel.innerHTML = '';
    panel.appendChild(closeBtn(done));
    var e = (lastDictation && state.notebookEntries) ? state.notebookEntries[lastDictation.id] : null;
    if (!e) { renderEntry(panel); return; }
    var meta = (lastImport && lastImport.meta && lastImport.meta[e.id]) ? lastImport.meta[e.id] : {};
    var isQuote = (meta.type === 'quote');
    var bid = (e.bookIds && e.bookIds.length) ? e.bookIds[0] : null;
    var kept = !!(lastDictation && lastDictation.kept);

    panel.appendChild(el('div', 'ic-eyebrow', 'Captured'));
    panel.appendChild(el('h2', 'ic-h1',
      bid ? 'Got it.' : (kept ? 'Saved to your Inbox.' : 'Saved — one question.')));

    var card = el('div', 'ic-filed-card');
    var top = el('div', 'ic-filed-top');
    var seal = el('span', 'ic-seal-sm'); seal.innerHTML = CHECK_SVG; // static
    top.appendChild(seal);
    if (bid) {
      var book = state.books ? state.books[bid] : null;
      var ft = el('span', 'ic-filed-to');
      ft.appendChild(document.createTextNode('Filed as ' + e.register + ' to'));
      ft.appendChild(el('span', 'ic-filed-bk',
        (book && typeof book.title === 'string' && book.title) ? book.title : 'your book'));
      top.appendChild(ft);
    } else {
      top.appendChild(el('span', 'ic-filed-to', 'Saved to your Inbox'));
    }
    card.appendChild(top);

    card.appendChild(el('div', isQuote ? 'ic-quoted ic-q' : 'ic-quoted',
      isQuote ? ('“' + e.body + '”') : e.body));

    // Inline confirm for an unmatched note (skip once the reader keeps it / files it).
    if (!bid && !kept) {
      card.appendChild(el('div', 'ic-qask', 'Which book is it from?'));
      var chips = el('div', 'ic-guesses');
      var cands = candidateBooks(meta.bookGuess);
      var i;
      for (i = 0; i < cands.length; i = i + 1) {
        (function (c) {
          var chip = el('button', 'ic-guess'); chip.type = 'button';
          chip.appendChild(document.createTextNode(c.title));
          if (c.author) { chip.appendChild(el('span', 'ic-guess-au', c.author)); }
          chip.addEventListener('click', function () { fileDictationToBook(panel, e.id, c.bid); });
          chips.appendChild(chip);
        })(cands[i]);
      }
      var keep = el('button', 'ic-guess ic-alt', 'Keep in Inbox'); keep.type = 'button';
      keep.addEventListener('click', function () {
        if (lastDictation) { lastDictation.kept = true; }
        renderDictated(panel);
      });
      chips.appendChild(keep);
      card.appendChild(chips);
    }

    var acts = el('div', 'ic-filed-acts');
    var doneBtn = el('button', 'ic-cta', 'Done'); doneBtn.type = 'button';
    doneBtn.addEventListener('click', done);
    var undo = el('button', 'ic-linkbtn', '↩ Undo'); undo.type = 'button';
    undo.addEventListener('click', function () { undoDictation(panel); });
    var another = el('button', 'ic-linkbtn', '+ Another note'); another.type = 'button';
    another.addEventListener('click', function () { renderEntry(panel); });
    acts.appendChild(doneBtn);
    acts.appendChild(undo);
    acts.appendChild(another);
    card.appendChild(acts);

    panel.appendChild(card);
  }

  // Inline confirm: re-file the dictated note to a book IN PLACE (F5: it is in
  // createdIds; ownsEntry guards). Register unchanged. Re-renders as "filed".
  function fileDictationToBook(panel, entryId, bid) {
    if (!ownsEntry(entryId) || !bid) { return; }
    var e = state.notebookEntries ? state.notebookEntries[entryId] : null;
    if (!e) { return; }
    e.bookIds = [bid];
    e.filed = true;
    e.updatedAt = Date.now();
    markNotebookDirty();
    saveState();
    renderDictated(panel);
  }

  // Undo a dictated note: delete ONLY this note (in createdIds; arcIds:[] so the
  // arc-cascade is a no-op), persist, and return to entry so the reader can redo.
  // Never touches a pre-existing entry.
  function undoDictation(panel) {
    var id = (lastDictation && lastDictation.id) ? lastDictation.id : null;
    if (id && ownsEntry(id) && typeof deleteEntry === 'function' && deleteEntry(id)) {
      saveState();
    }
    lastDictation = null;
    lastImport = null;
    renderEntry(panel);
  }

  function renderError(panel, msg) {
    panel.innerHTML = '';
    panel.appendChild(closeBtn(close));
    panel.appendChild(el('div', 'ic-eyebrow', 'Hm'));
    panel.appendChild(el('h2', 'ic-h1', 'Couldn’t read that'));
    panel.appendChild(el('p', 'ic-sub', msg));
    var foot = el('div', 'ic-r-foot');
    var retry = el('button', 'ic-cta', 'Try again'); retry.type = 'button';
    retry.addEventListener('click', function () { open(); });
    foot.appendChild(retry);
    panel.appendChild(foot);
  }

  // ---- public API -----------------------------------------------------
  window.ImportCapture = {
    open:          open,
    close:         close,
    segmentDoc:    segmentDoc,
    matchBook:     matchBook,
    commitEntries: commitEntries,
    // exposed for the dev harness / Stage-3 reuse:
    _lastImport:   function () { return lastImport; },
    _normTitle:    normTitle,
    _registerFor:  registerFor
  };

})();

console.log('import-capture.js loaded');
