// =====================================================================
// import-capture.js -- Praxis capture pipeline + dictation transport
// (HEADLESS as of CD-6 Stage 3, v3.257).
//
// The ImportCapture OVERLAY retired here: its entry / processing / book-
// grouped receipt / exception-queue UI, its own dictation UI, AND
// commitEntries (the batch writer) are all gone. Every live capture path
// is THE DOOR now (views.js); captureNote is the SOLE entry writer.
//
// What survives is headless -- pure functions the door drives, loaded
// AFTER views.js so app globals (state, getCurrentUser, PRAXIS_CLIENT_KEY)
// are already defined:
//
//   segmentDoc(rawText)    -> Promise<[{text,type,bookGuess,confidence,page}]>
//                             LLM segmentation via the claude proxy (retry-once).
//   matchBook(guess)       -> bookId | null   (free-text -> the user's
//                             deduped library; NEVER a network call)
//   candidateBooks(guess)  -> [{bid,title,author}]  loose review candidates
//   registerFor(item)      -> 'marginalia' | 'question' | 'journal'
//   canRecord / recordAndTranscribe -> the dictation transport (door voice)
//
// ADDITIVE-SAFE. No SCHEMA_VERSION / migrate / normalizer changes. ES3:
// var/function, string concat, two-arg .then() and try/catch only.
// =====================================================================

'use strict';

(function () {

  // P1 Item 1: the claude-proxy door is aiProxyFetch (yumi-brain.js, loaded
  // earlier) -- it attaches the Firebase ID token the server ceiling keys on.
  // No direct fetch() to the proxy lives here any more.
  var TRANSCRIBE_PROXY_URL = '/.netlify/functions/transcribe-proxy';
  var TRANSCRIBE_TIMEOUT_MS = 20000; // hard cap on the transcribe POST -> textarea on expiry (never an infinite "transcribing")
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
    // R-CAPTURE Lane 4 hardening: auto-retry ONCE on a transient failure — a 5xx
    // (server) response or a network error — with a short backoff. A 4xx is NOT
    // retried (a client error won't succeed on retry). Either way the raw paste/
    // transcript is never lost: the caller's catch keeps it in the field (RAW
    // joins the corpus).
    function segAttempt(triesLeft) {
      if (typeof aiProxyFetch !== 'function') { return Promise.reject(new Error('segmentDoc: proxy door unavailable')); }
      return aiProxyFetch(payload).then(function (data) {
        return data;
      }, function (err) {
        // A 5xx or a network failure (status 0) retries once; a 4xx -- including
        // the ceiling's 429 daily_limit and a 401 -- does not. The typed error
        // ({status, code, resetAt}) reaches the caller's catch intact so the
        // toast can be honest.
        var st = (err && typeof err.status === 'number') ? err.status : 0;
        if ((st === 0 || st >= 500) && triesLeft > 0) {
          return new Promise(function (resolve) { setTimeout(resolve, 700); }).then(function () { return segAttempt(triesLeft - 1); });
        }
        throw err;
      });
    }
    return segAttempt(1).then(function (data) {
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

  // True if any guess token of >= 4 chars appears as a whole word in the
  // normalized text. Shared by matchBook (author fallback) + candidateBooks.
  function hasSharedToken(tokens, text) {
    var p = ' ' + text + ' ', k;
    for (k = 0; k < tokens.length; k = k + 1) {
      if (tokens[k].length >= 4 && p.indexOf(' ' + tokens[k] + ' ') !== -1) { return true; }
    }
    return false;
  }

  // Resolve a free-text book name to a bookId in the CURRENT user's deduped
  // library. PASS 1 (TITLE -- unchanged): exact normalized match wins; else a
  // UNIQUE bidirectional containment match; an ambiguous title (>1) -> null.
  // PASS 2 runs ONLY when NO title matched -- AUTHOR: a UNIQUE author
  // containment / shared-token match auto-files (covers "note on Freire");
  // ambiguous author (>1) -> null -> Inbox. Conservative: never auto-files when
  // more than one book qualifies. No network: library resolution, not fetch.
  function matchBook(guess) {
    var g = normTitle(guess);
    if (g === '') { return null; }
    var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!user || !user.uid) { return null; }
    var ids = (state.userBooks && state.userBooks[user.uid] && state.userBooks[user.uid].bookIds)
      ? state.userBooks[user.uid].bookIds : null;
    if (!ids || !ids.length) { return null; }
    var gtok = g.split(' ');
    var i, bid, book, t;
    // pass 1 -- TITLE (unchanged behavior): exact wins; else unique containment.
    var titleId = null, titleCount = 0;
    for (i = 0; i < ids.length; i = i + 1) {
      bid = ids[i];
      book = state.books ? state.books[bid] : null;
      if (!book) { continue; }
      t = normTitle(book.title);
      if (t === '') { continue; }
      if (t === g) { return bid; }                                  // exact title -> done
      if (t.indexOf(g) !== -1 || g.indexOf(t) !== -1) { titleId = bid; titleCount = titleCount + 1; }
    }
    if (titleCount === 1) { return titleId; }                       // unique title containment (unchanged)
    if (titleCount > 1) { return null; }                            // ambiguous title -> Inbox (unchanged)
    // pass 2 -- AUTHOR (only when NO title matched): unique author match auto-files.
    var authId = null, authCount = 0;
    for (i = 0; i < ids.length; i = i + 1) {
      bid = ids[i];
      book = state.books ? state.books[bid] : null;
      if (!book) { continue; }
      var a = normTitle(book.author);
      if (a === '') { continue; }
      if (a.indexOf(g) !== -1 || g.indexOf(a) !== -1 || hasSharedToken(gtok, a)) { authId = bid; authCount = authCount + 1; }
    }
    return (authCount === 1) ? authId : null;                       // unique author -> file; else Inbox
  }

  // ---- registerFor ----------------------------------------------------
  // Decide the register for a segmented item from its type. Quote ->
  // marginalia; an own-note that reads as an explicit question (ends with
  // '?') -> question; otherwise marginalia. An explicit item.register
  // overrides (the door's per-note review flip sets it).
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
    var i;
    for (i = 0; i < ids.length && out.length < 4; i = i + 1) {
      var bid = ids[i];
      var book = state.books ? state.books[bid] : null;
      if (!book || typeof book.title !== 'string') { continue; }
      var t = normTitle(book.title);
      if (t === '') { continue; }
      var a = normTitle(book.author);
      // Generous (review chips only): title OR author containment, else a shared
      // >=4-char token in EITHER title or author -- so "Freire" surfaces every
      // Freire book. Author is matched here, not merely shown.
      var hit = false;
      if (g && (t.indexOf(g) !== -1 || g.indexOf(t) !== -1)) { hit = true; }
      else if (g && a && (a.indexOf(g) !== -1 || g.indexOf(a) !== -1)) { hit = true; }
      else if (hasSharedToken(gtok, t) || hasSharedToken(gtok, a)) { hit = true; }
      if (hit) { out.push({ bid: bid, title: book.title, author: (typeof book.author === 'string') ? book.author : '' }); }
    }
    return out;
  }

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
    var settled = false, timer = null, controller = null;
    function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }
    // Single-settle guard: onResult/onError fire AT MOST ONCE. Makes the hard
    // timeout (abort) and a late real response mutually exclusive -- no double-fire.
    function finishOk(text) { if (settled) { return; } settled = true; clearTimer(); if (cbs.onResult) { cbs.onResult(text); } }
    function finishErr() { if (settled) { return; } settled = true; clearTimer(); if (cbs.onError) { cbs.onError('failed'); } }
    var reader = new FileReader();
    reader.onerror = function () { finishErr(); };
    reader.onload = function () {
      // Extract RAW base64 from the FileReader data URL: everything after the
      // first comma. Params-agnostic -- a /;base64,/ regex misses a media type
      // with a parameter (data:audio/webm;codecs=opus;base64,...). Raw base64
      // has no comma, so indexOf -> -1 -> used as-is.
      var url = String(reader.result || '');
      var ci = url.indexOf(',');
      var b64 = (ci > -1) ? url.substring(ci + 1) : url;
      if (!b64) { finishErr(); return; }
      // Hard timeout: abort the POST after TRANSCRIBE_TIMEOUT_MS so a slow or
      // stalled proxy can never leave the UI hung on "transcribing". The abort
      // funnels through the reject handler -> finishErr -> textarea fallback.
      var opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
        body: JSON.stringify({ audio: b64, mimeType: mimeType })
      };
      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
        opts.signal = controller.signal;
      }
      timer = setTimeout(function () {
        timer = null;
        if (controller) { try { controller.abort(); } catch (e0) {} }
        finishErr();
      }, TRANSCRIBE_TIMEOUT_MS);
      fetch(TRANSCRIBE_PROXY_URL, opts).then(function (res) {
        if (!res.ok) { finishErr(); return; }
        res.json().then(function (data) {
          var text = (data && typeof data.transcript === 'string') ? data.transcript : '';
          finishOk(text);
        }, function () { finishErr(); });
      }, function () { finishErr(); });
    };
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
        if (!blob.size) { if (cbs.onError) { cbs.onError('empty'); } return; }
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
      // Leading-clip fix: do NOT fire onStart synchronously -- rec.start() flips
      // rec.state asynchronously, so the recorder may not be capturing yet (the
      // first ~100-300ms is lost if the UI invites speech now). Poll rec.state
      // (safer than rec.onstart on iOS) and reveal "Listening" only once it is
      // 'recording'; a ~600ms safety cap fires regardless so the UI never wedges
      // on "Warming up...". onStart fires at most once.
      var started = false, ticks = 0;
      var warm = setInterval(function () {
        if (rec.state === 'inactive') { clearInterval(warm); return; }
        ticks = ticks + 1;
        if (rec.state === 'recording' || ticks >= 15) {
          clearInterval(warm);
          if (!started) { started = true; if (cbs.onStart) { cbs.onStart(); } }
        }
      }, 40);
    }, function (err) {
      var n = err && err.name;
      var reason = (n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError') ? 'denied' : 'failed';
      if (cbs.onError) { cbs.onError(reason); }
    });
    return session;
  }


  // ---- public API — headless capture pipeline + dictation transport ---
  // The overlay retired at CD-6 Stage 3: open/close/commitEntries are gone.
  // The door (views.js) drives segmentation + the transport directly, and
  // captureNote stays the sole entry writer.
  window.ImportCapture = {
    // segmentation pipeline (the door's paste "Split into N?" drives these).
    // candidateBooks feeds the door's native capChip picker in the review —
    // the .ic- book-search widget retired too (CD-6 Stage 3 amendment).
    segmentDoc:      segmentDoc,
    matchBook:       matchBook,
    candidateBooks:  candidateBooks,
    registerFor:     registerFor,
    // dictation transport (the door's voice mode reuses this DIRECTLY —
    // transcript into the shared field, then filed via the door)
    canRecord:           canRecord,
    recordAndTranscribe: recordAndTranscribe,
    // exposed for the dev harness
    _normTitle:      normTitle
  };

})();

console.log('import-capture.js loaded');
