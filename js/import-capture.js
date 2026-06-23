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

  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'
    + '<polyline points="20 6 9 17 4 12"></polyline></svg>';
  var CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<polyline points="9 18 15 12 9 6"></polyline></svg>';

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
      'Paste your notes or drop in a file. Yumi files each to the right book '
      + '— you only weigh in when she’s unsure.'));

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

  // ---- receipt: book-grouped, progressively disclosed (Stage 3b-1) -----
  // Display only. Reads LIVE entries from state.notebookEntries (so a 3b-2
  // re-file / flip / undo re-render shows the real entry) plus lastImport.meta
  // for the display-only fields that never live on an entry (page / type).
  // Created entries with no book (filed:false) feed the Inbox needbar.
  function renderReceipt(panel) {
    panel.innerHTML = '';
    panel.appendChild(closeBtn(done));

    var ids = (lastImport && lastImport.createdIds) ? lastImport.createdIds : [];
    var metaOf = (lastImport && lastImport.meta) ? lastImport.meta : {};
    var groups = [];
    var gIndex = {};
    var inbox = [];
    var i, e, bid;
    for (i = 0; i < ids.length; i = i + 1) {
      e = state.notebookEntries ? state.notebookEntries[ids[i]] : null;
      if (!e) { continue; }
      bid = (e.bookIds && e.bookIds.length) ? e.bookIds[0] : null;
      if (!bid) { inbox.push(e); continue; }
      if (!Object.prototype.hasOwnProperty.call(gIndex, bid)) {
        var book = state.books ? state.books[bid] : null;
        gIndex[bid] = groups.length;
        groups.push({
          title:  (book && typeof book.title === 'string' && book.title) ? book.title : 'Untitled',
          author: (book && typeof book.author === 'string') ? book.author : '',
          entries: []
        });
      }
      groups[gIndex[bid]].entries.push(e);
    }
    var bookedCount = ids.length - inbox.length;

    // head: seal + "Filed" + count
    var head = el('div', 'ic-r-head');
    var seal = el('span', 'ic-seal');
    seal.innerHTML = CHECK_SVG; // static markup only -- never user text
    head.appendChild(seal);
    var hb = el('div');
    hb.appendChild(el('div', 'ic-eyebrow', 'Filed'));
    var titleTxt;
    if (groups.length > 0) {
      titleTxt = bookedCount + (bookedCount === 1 ? ' note, ' : ' notes, ')
        + groups.length + (groups.length === 1 ? ' book' : ' books');
    } else {
      titleTxt = ids.length + (ids.length === 1 ? ' note saved' : ' notes saved');
    }
    hb.appendChild(el('h2', 'ic-h1', titleTxt));
    head.appendChild(hb);
    panel.appendChild(head);

    // Honest default-visibility copy. Replaces the Stage-2 "kept private" line,
    // which is false now that own-notes file as PUBLIC marginalia. (3b-2 adds
    // the per-note flip-to-private hint once that control is wired.)
    var subTxt = 'Quotes and your notes are filed as marginalia Yumi can read. '
      + 'Nothing added that you didn’t write.';
    if (lastImport && lastImport.skipped) {
      subTxt = subTxt + ' ' + lastImport.skipped
        + (lastImport.skipped === 1 ? ' was already in your notebook.' : ' were already in your notebook.');
    }
    panel.appendChild(el('p', 'ic-sub', subTxt));

    // book-grouped list
    if (groups.length) {
      var list = el('div', 'ic-books');
      for (i = 0; i < groups.length; i = i + 1) {
        list.appendChild(buildBookRow(groups[i], metaOf));
      }
      panel.appendChild(list);
    }

    // Inbox needbar (display). Its click -> queue is wired in 3b-2.
    panel.appendChild(buildNeedBar(inbox.length));

    // foot: Undo import (wired in 3b-2) + Done
    var foot = el('div', 'ic-r-foot');
    var undo = el('button', 'ic-linkbtn', '↩ Undo import'); undo.type = 'button';
    var doneBtn = el('button', 'ic-cta', 'Done'); doneBtn.type = 'button';
    doneBtn.addEventListener('click', done);
    foot.appendChild(undo);
    foot.appendChild(doneBtn);
    panel.appendChild(foot);
  }

  // One book row: a clickable header (chevron + title + author + count) over a
  // hidden notes list that the header toggles open.
  function buildBookRow(group, metaOf) {
    var row = el('div', 'ic-brow');
    var main = el('div', 'ic-brow-main');
    var chev = el('span', 'ic-chev');
    chev.innerHTML = CHEV_SVG; // static
    main.appendChild(chev);
    main.appendChild(el('span', 'ic-bk', group.title));
    if (group.author) { main.appendChild(el('span', 'ic-au', group.author)); }
    main.appendChild(el('span', 'ic-n', String(group.entries.length)));
    main.addEventListener('click', function () {
      row.className = (row.className.indexOf('ic-open') > -1) ? 'ic-brow' : 'ic-brow ic-open';
    });
    row.appendChild(main);
    var notes = el('div', 'ic-notes');
    var j;
    for (j = 0; j < group.entries.length; j = j + 1) {
      notes.appendChild(buildNoteRow(group.entries[j], metaOf));
    }
    row.appendChild(notes);
    return row;
  }

  // One note row: the text (quote-styled if it was a quote) + a ··· toggle to a
  // read-only mono detail line (register / visibility / kind / page). User text
  // reaches the DOM only via textContent (el / createTextNode) -- no injection.
  function buildNoteRow(entry, metaOf) {
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
    detail.appendChild(el('span', entry.isPrivate ? 'ic-pv' : 'ic-v', entry.register));
    detail.appendChild(document.createTextNode(
      ' · ' + (entry.isPrivate ? 'private' : 'Yumi sees')
      + (m.type ? (' · ' + m.type) : '')
      + (m.page ? (' · p.' + m.page) : '')
    ));
    dots.addEventListener('click', function () {
      detail.className = (detail.className.indexOf('ic-show') > -1) ? 'ic-detail' : 'ic-detail ic-show';
    });
    bar.appendChild(dots);
    nrow.appendChild(bar);
    nrow.appendChild(detail);
    return nrow;
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
