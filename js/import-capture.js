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
  // question; otherwise journal. An explicit item.register overrides
  // (used by the Stage-3 queue when the reader picks).
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
    return 'journal';
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

  // ---- public API (Stage 1: engine only; UI wires in Stage 2-3) -------
  window.ImportCapture = {
    segmentDoc:    segmentDoc,
    matchBook:     matchBook,
    commitEntries: commitEntries,
    // exposed for the dev harness / Stage-3 reuse:
    _normTitle:    normTitle,
    _registerFor:  registerFor
  };

})();

console.log('import-capture.js loaded');
