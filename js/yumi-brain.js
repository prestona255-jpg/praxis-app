// =====================================================================
// yumi-brain.js -- Yumi persona, context assembly, prompt construction
// Stage 2.1: voice-doc preload + system-prompt assembly skeleton.
// No Anthropic call, no conversation memory, placeholder context only.
// =====================================================================

'use strict';

// Module-scope cache for the voice document. Populated by loadYumiVoice
// at script-load time; read by buildYumiSystem on each call.
var YUMI_VOICE_URL = '/docs/yumi-voice.md';
var YUMI_VOICE_TEXT = '';
var YUMI_VOICE_LOADED = false;

function loadYumiVoice() {
  if (YUMI_VOICE_LOADED) { return; }
  fetch(YUMI_VOICE_URL).then(function(res) {
    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }
    return res.text();
  }).then(function(text) {
    YUMI_VOICE_TEXT = text;
    YUMI_VOICE_LOADED = true;
    console.log('yumi-brain: voice doc loaded (' + text.length + ' chars)');
  }).catch(function(err) {
    console.error('yumi-brain: failed to load voice doc from ' + YUMI_VOICE_URL, err);
    YUMI_VOICE_TEXT = 'YUMI VOICE DOCUMENT FAILED TO LOAD';
    YUMI_VOICE_LOADED = true;
  });
}

function getYumiContext() {
  return {
    currentBook: null,
    recentEntries: [],
    currentArc: null
  };
}

// Resolve the uid of the user this conversation belongs to. Firebase
// auth (via integrations.js getCurrentUser) is the sole source of
// truth: return the signed-in user's uid, or null when no one is
// signed in. No in-memory user-map fallback -- isolation is enforced
// at the data layer (state cleared on sign-out / account switch).
function resolveActiveUid() {
  var current = getCurrentUser();
  if (current && current.uid) {
    return current.uid;
  }
  return null;
}

// Summarize a single dropped turn into yumiMemory.summary via a
// rewrite-to-unify proxy call. Reuses YUMI_VOICE_TEXT as system so
// the summary lands in Yumi's voice. Returns Promise<string|null>:
// string is the new summary; null means summarizer unavailable or
// failed (caller drops oldest unsummarized, leaves summary intact).
// Never throws into the caller -- voice-doc-unavailable and any
// proxy/parse error degrade to null with a console.warn.
function summarizeAndRoll(uid, droppedTurn) {
  if (!YUMI_VOICE_LOADED ||
      YUMI_VOICE_TEXT === 'YUMI VOICE DOCUMENT FAILED TO LOAD') {
    console.warn('summarizeAndRoll: voice doc unavailable; dropping oldest turn unsummarized');
    return Promise.resolve(null);
  }

  var priorSummary = state.users[uid].yumiMemory.summary;

  var promptBody =
    'A turn from earlier is about to slip past. Gather it into '
    + 'your memory of this reader before it goes.\n\n'
    + 'What you remember so far:\n'
    + (priorSummary || '(this is the first turn -- there is no prior memory yet)') + '\n\n'
    + 'The turn slipping past:\n'
    + droppedTurn.role + ': ' + droppedTurn.content + '\n\n'
    + 'Write a new memory that replaces the old one. You may '
    + 'drop earlier details to make room for what matters now. '
    + 'Maximum 60 words. Two sentences. Output only the memory '
    + 'itself -- no labels, no headers, no preamble, no '
    + 'quotation marks. Keep it warm.';

  var payload = {
    model:      'claude-sonnet-4-6',
    max_tokens: 512,
    system:     YUMI_VOICE_TEXT,
    messages: [
      { role: 'user', content: promptBody }
    ]
  };

  return fetch('/.netlify/functions/claude-proxy', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
    body:    JSON.stringify(payload)
  }).then(function (res) {
    if (!res.ok) {
      return res.text().then(function (body) {
        throw new Error('proxy ' + res.status + ': ' + body);
      });
    }
    return res.json();
  }).then(function (data) {
    var blocks = data && data.content;
    if (!blocks || !blocks.length) {
      throw new Error('summarizeAndRoll: no text content in response');
    }
    var text = '';
    var i;
    for (i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block && block.type === 'text' && typeof block.text === 'string') {
        text = text + block.text;
      }
    }
    if (text === '') {
      throw new Error('summarizeAndRoll: empty text in response');
    }
    if (text.length > 2000) {
      text = text.substring(0, 1997) + '...';
    }
    return text;
  }).catch(function (err) {
    console.warn('summarizeAndRoll: failed; dropping oldest turn unsummarized', err);
    return null;
  });
}

// Append a single conversation turn to the active user's recentTurns
// log, persist, and (if push pushed us over cap=10) trigger
// summarization rollover via summarizeAndRoll on each dropped turn.
// Synchronous outer for the push+save, async tail for the rollover.
// Called by sendMessage pre-fetch (user) and post-response (assistant).
function appendTurn(role, content) {
  var uid = resolveActiveUid();
  if (!uid) {
    console.warn('yumi-brain: appendTurn called with no active uid; skipping');
    return;
  }
  ensureUser(uid);
  var mem = state.users[uid].yumiMemory;
  mem.recentTurns.push({ role: role, content: content });
  saveState();

  if (mem.recentTurns.length <= 10) {
    return;
  }

  // Rollover: async tail. Each pass summarizes oldest into mem.summary
  // (or drops unsummarized on degradation), shifts, then recurses.
  // While-loop semantics preserved against future imports starting
  // above cap.
  function shiftLoop() {
    if (mem.recentTurns.length <= 10) {
      saveState();
      return;
    }
    var dropped = mem.recentTurns[0];
    summarizeAndRoll(uid, dropped).then(function (newSummary) {
      if (newSummary) {
        mem.summary = newSummary;
        mem.updatedAt = Date.now();
      }
      mem.recentTurns.shift();
      shiftLoop();
    });
  }
  shiftLoop();
}

// Assemble the structured context Yumi sees. Single source of truth
// for both buildContext (prose blob for the model call) and
// getContextSnapshot (structured object for the transparency view).
// Enforces principle #5: the notebookEntries loop skips any entry
// the user has flagged private so private writing never enters
// Yumi's context. Top 3 newest visible entries, each body truncated
// to 200 chars -- both consumers see the same set, byte for byte.
function assembleContextData() {
  var currentBook = null;
  if (state.currentBookId !== null) {
    var book = state.books[state.currentBookId];
    if (!book) {
      console.warn('yumi-brain: dangling currentBookId ' + state.currentBookId);
    } else {
      var author = '';
      if (typeof book.author === 'string') {
        author = book.author;
      }
      currentBook = { title: book.title, author: author };
    }
  }

  var currentArc = null;
  if (state.currentArcId !== null) {
    var arc = state.arcs[state.currentArcId];
    if (!arc) {
      console.warn('yumi-brain: dangling currentArcId ' + state.currentArcId);
    } else {
      currentArc = { title: arc.title };
    }
  }

  var currentSubTheory = null;
  if (state.currentSubTheoryId !== null) {
    var subTheory = state.subTheories[state.currentSubTheoryId];
    if (!subTheory) {
      console.warn('yumi-brain: dangling currentSubTheoryId ' + state.currentSubTheoryId);
    } else {
      currentSubTheory = { header: subTheory.header };
    }
  }

  var collected = [];
  var key;
  for (key in state.notebookEntries) {
    if (Object.prototype.hasOwnProperty.call(state.notebookEntries, key)) {
      if (state.notebookEntries[key] &&
          state.notebookEntries[key].isPrivate === true) {
        continue;
      }
      collected.push(state.notebookEntries[key]);
    }
  }
  collected.sort(function (a, b) {
    return b.createdAt - a.createdAt;
  });
  var top = collected.slice(0, 3);

  var recentEntries = [];
  var i;
  for (i = 0; i < top.length; i++) {
    var src = top[i];
    var body = src.body;
    if (body.length > 200) {
      body = body.substring(0, 197) + '...';
    }
    var bookTitle = null;
    if (src.bookIds && src.bookIds.length > 0) {
      var bId = src.bookIds[0];
      if (state.books && state.books[bId]) {
        bookTitle = state.books[bId].title;
      }
    }
    recentEntries.push({
      body:      body,
      register:  src.register || 'journal',
      bookTitle: bookTitle,
      createdAt: src.createdAt
    });
  }

  // Stage 3.7: bookArtifacts join Yumi's substrate subject to the
  // same isPrivate filter pattern applied to notebookEntries above.
  // Artifacts do not carry an isPrivate field today (no UI toggle
  // yet); the filter is the contract -- principle #5, anything
  // captured is visible and correctable to the user. When artifacts
  // gain isPrivate, this loop already enforces it. Same shape as
  // recentEntries (top 3 newest, body truncated to 200 chars) so
  // both consumers -- buildContext (prose for the model) and the
  // transparency view (UI for the user) -- see identical substrate.
  var collectedArtifacts = [];
  var aKey;
  for (aKey in state.bookArtifacts) {
    if (Object.prototype.hasOwnProperty.call(state.bookArtifacts, aKey)) {
      var artRec = state.bookArtifacts[aKey];
      if (artRec && artRec.isPrivate === true) {
        continue;
      }
      if (artRec) collectedArtifacts.push(artRec);
    }
  }
  collectedArtifacts.sort(function (a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
  var topArtifacts = collectedArtifacts.slice(0, 3);

  var recentArtifacts = [];
  var ai;
  for (ai = 0; ai < topArtifacts.length; ai++) {
    var artSrc = topArtifacts[ai];
    var artBody = artSrc.body || '';
    if (artBody.length > 200) {
      artBody = artBody.substring(0, 197) + '...';
    }
    var artBookTitle = null;
    if (artSrc.bookId && state.books && state.books[artSrc.bookId]) {
      artBookTitle = state.books[artSrc.bookId].title;
    }
    recentArtifacts.push({
      title:     artSrc.title || '',
      body:      artBody,
      bookTitle: artBookTitle,
      createdAt: artSrc.createdAt
    });
  }

  var activeUid = resolveActiveUid();

  var summary = '';
  if (activeUid && state.users[activeUid] &&
      state.users[activeUid].yumiMemory &&
      state.users[activeUid].yumiMemory.summary) {
    summary = state.users[activeUid].yumiMemory.summary;
  }

  var recentTurns = [];
  if (activeUid && state.users[activeUid] &&
      state.users[activeUid].yumiMemory &&
      state.users[activeUid].yumiMemory.recentTurns) {
    var allTurns = state.users[activeUid].yumiMemory.recentTurns;
    var priorTurns = allTurns.slice(0, allTurns.length - 1);
    var t;
    for (t = 0; t < priorTurns.length; t++) {
      recentTurns.push({
        role:    priorTurns[t].role,
        content: priorTurns[t].content
      });
    }
  }

  // N-epic: master "Yumi reads along" switch. OFF -> none of the user's
  // notebook writing crosses to Yumi (entries + artifacts emptied). Default ON
  // (absent profile / absent field reads as on). Navigation context, summary,
  // and conversation memory are unaffected; the by-kind isPrivate filter above
  // still applies when ON. Single consent gate.
  if (activeUid && state.users[activeUid] && state.users[activeUid].profile &&
      state.users[activeUid].profile.yumiReadsAlong === false) {
    recentEntries = [];
    recentArtifacts = [];
  }

  return {
    currentBook:      currentBook,
    currentArc:       currentArc,
    currentSubTheory: currentSubTheory,
    recentEntries:   recentEntries,
    recentArtifacts: recentArtifacts,
    summary:         summary,
    recentTurns:     recentTurns
  };
}

// Stage 11 (transparency): aggregate activity counts for the account
// disclosure surface. Counts ONLY -- never content. Books / arcs /
// sub-theories are structural (no privacy dimension). Notebook and marginalia
// entries are split visible/private through the SAME `isPrivate === true`
// predicate assembleContextData applies above (principle #5) -- so the
// "visible to Yumi" figures the surface shows are exactly what crosses to
// Yumi, and private writing is only ever counted, never surfaced. uid-scoped
// so the figures are the signed-in reader's own.
function getAggregateCounts(uid) {
  var out = {
    books: 0, arcs: 0, subTheories: 0,
    notebookVisible: 0, notebookPrivate: 0,
    marginaliaVisible: 0, marginaliaPrivate: 0,
    questionVisible: 0, questionPrivate: 0
  };
  if (!uid) { return out; }
  if (state.userBooks && state.userBooks[uid] &&
      state.userBooks[uid].bookIds) {
    out.books = state.userBooks[uid].bookIds.length;
  }
  var k;
  if (state.arcs) {
    for (k in state.arcs) {
      if (Object.prototype.hasOwnProperty.call(state.arcs, k) &&
          state.arcs[k] && state.arcs[k].userId === uid) {
        out.arcs = out.arcs + 1;
      }
    }
  }
  if (state.subTheories) {
    for (k in state.subTheories) {
      if (Object.prototype.hasOwnProperty.call(state.subTheories, k) &&
          state.subTheories[k] && state.subTheories[k].userId === uid) {
        out.subTheories = out.subTheories + 1;
      }
    }
  }
  if (state.notebookEntries) {
    var e, priv;
    for (k in state.notebookEntries) {
      if (!Object.prototype.hasOwnProperty.call(state.notebookEntries, k)) { continue; }
      e = state.notebookEntries[k];
      if (!e || e.userId !== uid) { continue; }
      priv = e.isPrivate === true;
      if (e.register === 'marginalia') {
        if (priv) { out.marginaliaPrivate = out.marginaliaPrivate + 1; }
        else { out.marginaliaVisible = out.marginaliaVisible + 1; }
      } else if (e.register === 'question') {
        // N-epic: questions are their own visible-by-default register.
        if (priv) { out.questionPrivate = out.questionPrivate + 1; }
        else { out.questionVisible = out.questionVisible + 1; }
      } else {
        if (priv) { out.notebookPrivate = out.notebookPrivate + 1; }
        else { out.notebookVisible = out.notebookVisible + 1; }
      }
    }
  }
  return out;
}

// Format the structured snapshot into the labeled-prose blob Yumi's
// model call expects. Pre-3.6 prose was load-bearing: any drift in
// the existing slots changes what Yumi sees. Stage 3.7 adds one new
// slot (recentArtifacts) carrying the user's finished-room writing
// -- principle #5 (no asymmetric knowledge) requires Yumi see
// Artifacts subject to the same isPrivate filter as notebookEntries.
// Existing slot ordering and formatting are preserved verbatim.
function buildContext() {
  var data = assembleContextData();

  var bookLine;
  if (data.currentBook === null) {
    bookLine = 'none yet';
  } else if (data.currentBook.author && data.currentBook.author.length > 0) {
    bookLine = data.currentBook.title + ' by ' + data.currentBook.author;
  } else {
    bookLine = data.currentBook.title;
  }

  var arcLine;
  if (data.currentArc === null) {
    arcLine = 'none';
  } else {
    arcLine = data.currentArc.title;
  }

  var subTheoryLine;
  if (data.currentSubTheory === null) {
    subTheoryLine = 'none';
  } else {
    subTheoryLine = data.currentSubTheory.header;
  }

  var entriesLine;
  if (data.recentEntries.length === 0) {
    entriesLine = 'none yet';
  } else {
    var parts = [];
    var i;
    for (i = 0; i < data.recentEntries.length; i++) {
      parts.push(data.recentEntries[i].body);
    }
    entriesLine = parts.join('; ');
  }

  var artifactsLine;
  if (data.recentArtifacts.length === 0) {
    artifactsLine = 'none yet';
  } else {
    var artParts = [];
    var ap;
    for (ap = 0; ap < data.recentArtifacts.length; ap++) {
      var art = data.recentArtifacts[ap];
      if (art.body && art.body.length > 0) {
        artParts.push(art.title + ': ' + art.body);
      } else {
        artParts.push(art.title);
      }
    }
    artifactsLine = artParts.join('; ');
  }

  var summaryLine = '';
  if (data.summary) {
    summaryLine = 'EARLIER IN OUR CONVERSATION (summary): ' + data.summary + '\n';
  }

  var turnsLine;
  if (data.recentTurns.length === 0) {
    turnsLine = 'recentTurns: none yet';
  } else {
    var turnLines = ['recentTurns:'];
    var t;
    for (t = 0; t < data.recentTurns.length; t++) {
      var label;
      if (data.recentTurns[t].role === 'assistant') {
        label = 'Yumi: ';
      } else {
        label = 'User: ';
      }
      turnLines.push(label + data.recentTurns[t].content);
    }
    turnsLine = turnLines.join('\n');
  }

  return 'currentBook: ' + bookLine + '\n' +
         'recentEntries: ' + entriesLine + '\n' +
         'recentArtifacts: ' + artifactsLine + '\n' +
         'currentArc: ' + arcLine + '\n' +
         'currentSubTheory: ' + subTheoryLine + '\n' +
         summaryLine +
         turnsLine;
}

function buildYumiSystem() {
  var voiceSection;
  if (!YUMI_VOICE_LOADED) {
    console.warn('yumi-brain: buildYumiSystem called before voice doc loaded');
    voiceSection = 'YUMI VOICE DOCUMENT NOT YET LOADED';
  } else {
    voiceSection = YUMI_VOICE_TEXT;
  }

  var contextSection = buildContext();

  var prompt =
    '===== YUMI VOICE =====\n\n' +
    voiceSection + '\n\n' +
    '===== READING THE SECTIONS =====\n\n' +
    'The YUMI VOICE section above includes example dialogue ' +
    'illustrating your register. Those examples are NOT ' +
    'memories of past conversations with this reader. They ' +
    'show how you sound, not what has been said.\n\n' +
    'The CONTEXT section below has structured slots ' +
    '(currentBook, recentEntries, recentArtifacts, currentArc, ' +
    'currentSubTheory) ' +
    'and a conversation log (recentTurns, and EARLIER IN OUR ' +
    'CONVERSATION when summary exists). Treat structured ' +
    'slots as facts about the reader\'s current state, not ' +
    'as things you discussed. recentArtifacts are retrospective ' +
    'syntheses the reader has written about books they marked ' +
    'finished -- treat them as the reader\'s own framings, not ' +
    'as conversations you had with them. Treat recentTurns and ' +
    'the summary as your actual memory of this conversation. ' +
    'If recentTurns is "none yet" and summary is absent, ' +
    'this is a fresh conversation — do not reference prior ' +
    'talks.\n\n' +
    '===== CONTEXT =====\n\n' +
    contextSection + '\n';

  return prompt;
}

function sendMessage(userText) {
  // Known limitation (2.7b-ii-a): if the proxy call below fails between
  // these two appendTurn calls, the user turn persists without a matching
  // assistant turn -- left as-is, addressed in a follow-up sub-stage.
  appendTurn('user', userText);

  var payload = {
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    system:     buildYumiSystem(),
    messages: [
      { role: 'user', content: userText }
    ]
    // stream parameter intentionally omitted — non-streaming for 2.4
  };

  return fetch('/.netlify/functions/claude-proxy', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
    body:    JSON.stringify(payload)
  }).then(function (res) {
    if (!res.ok) {
      return res.text().then(function (body) {
        throw new Error('proxy ' + res.status + ': ' + body);
      });
    }
    return res.json();
  }).then(function (data) {
    var blocks = data && data.content;
    if (!blocks || !blocks.length) {
      throw new Error('no text content in response');
    }
    var text = '';
    var i;
    for (i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block && block.type === 'text' && typeof block.text === 'string') {
        text = text + block.text;
      }
    }
    if (text === '') {
      throw new Error('no text content in response');
    }
    appendTurn('assistant', text);
    return { ok: true, text: text };
  });
}

// =====================================================================
// LENS GENERATION (gated AI suggestions). A ONE-SHOT proxy call that
// proposes personalized lenses from the library METADATA ONLY -- never
// the chat transcript, never notebook/marginalia/artifact text. Reuses
// the same claude-proxy call path as summarizeAndRoll/sendMessage.
// =====================================================================

// EDITABLE system prompt for lens generation.
var LENS_GEN_SYSTEM =
  'You are Yumi, a reading companion inside Praxis. You are grounded in '
  + 'critical pedagogy -- Freire, hooks, Lorde -- and you hold that a reader '
  + 'naming their own intellectual world is itself an act of freedom. You are '
  + 'not a recommender engine, and you do not sort books into market genres.\n\n'
  + 'You are given a reader\'s library as METADATA ONLY: a list of books '
  + '(title, author, and the reader\'s own genre tag), plus any lenses they '
  + 'have already made. You are NOT given their private notes or marginalia, '
  + 'and you never ask for them.\n\n'
  + 'Your task: read across the whole library, notice the throughlines the '
  + 'reader keeps returning to, and propose 3-5 LENSES -- ways of seeing their '
  + 'shelf that are personal to them and named in the language of ideas, not '
  + 'the language of bookstores. A lens is "Technologies of Liberation and '
  + 'Oppression," not "Technology." It is "Selfhood," not "Self-Help." It names '
  + 'a preoccupation -- a question the reader seems to be living inside.\n\n'
  + 'For each lens give: name (a few words, evocative and precise, in the '
  + 'spirit of critical pedagogy); why (one or two sentences, spoken to the '
  + 'reader -- "you keep circling..." -- naming what you see WITHOUT '
  + 'summarizing any single book); books (the titles from their library this '
  + 'lens gathers; only titles actually present).\n\n'
  + 'Rules: work only from titles, authors, genre tags -- never summarize, '
  + 'review, or describe a book\'s contents. Propose, never impose -- these are '
  + 'offerings the reader keeps, renames, or waves away. Invent nothing; every '
  + 'book named is already on their shelf. Don\'t diagnose, flatter, or '
  + 'over-claim about the reader. A lens gathers at least two books; if the '
  + 'library is too small or scattered to name honest lenses, propose fewer '
  + 'rather than forcing them. Warmth over cleverness.\n\n'
  + 'Return ONLY a JSON array, nothing around it:\n'
  + '[{"name":"...","why":"...","books":["title","title"]}]';

// Gather the deduped library as METADATA ONLY (title/author/genre per book)
// plus the names of lenses the reader already has (distinct present genres +
// their userThemes). titleToId is carried for the caller's adoption step and
// is NEVER serialized into the model payload. Signed out falls back to raw
// state.books (no bookIds index available).
function gatherLensLibraryMetadata() {
  var u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  var books = [];
  var titleToId = {};
  var ids = (u && u.uid && state.userBooks && state.userBooks[u.uid] &&
             state.userBooks[u.uid].bookIds) ? state.userBooks[u.uid].bookIds : null;
  function pushBook(b) {
    if (!b) { return; }
    var title = (typeof b.title === 'string') ? b.title : '';
    if (title === '') { return; }
    books.push({
      title:  title,
      author: (typeof b.author === 'string') ? b.author : '',
      genre:  (typeof b.genre === 'string') ? b.genre : ''
    });
    if (b.id) { titleToId[title.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')] = b.id; }
  }
  var i;
  if (ids) {
    for (i = 0; i < ids.length; i++) { pushBook(state.books[ids[i]]); }
  } else {
    var k;
    for (k in state.books) {
      if (Object.prototype.hasOwnProperty.call(state.books, k)) { pushBook(state.books[k]); }
    }
  }
  var lensNames = [];
  var genreSeen = {};
  for (i = 0; i < books.length; i++) {
    var g = books[i].genre;
    if (g && !Object.prototype.hasOwnProperty.call(genreSeen, g)) { genreSeen[g] = true; lensNames.push(g); }
  }
  if (u && u.uid && state.userThemes) {
    var tk;
    for (tk in state.userThemes) {
      if (Object.prototype.hasOwnProperty.call(state.userThemes, tk) &&
          state.userThemes[tk] && state.userThemes[tk].userId === u.uid) {
        lensNames.push(state.userThemes[tk].name);
      }
    }
  }
  return { books: books, lensNames: lensNames, titleToId: titleToId };
}

// Serialize ONLY title/author/genre + existing lens names into the user
// message. titleToId and any other state are never touched here, so the
// outgoing payload is provably metadata-only.
function buildLensGenUserMessage(meta) {
  var s = 'Here is the reader\'s library (metadata only):\n\n';
  var i;
  for (i = 0; i < meta.books.length; i++) {
    var b = meta.books[i];
    s = s + '- "' + b.title + '"'
      + (b.author ? ' by ' + b.author : '')
      + (b.genre ? ' [' + b.genre + ']' : '') + '\n';
  }
  if (meta.lensNames && meta.lensNames.length) {
    s = s + '\nLenses they already have: ' + meta.lensNames.join(', ') + '\n';
  }
  s = s + '\nPropose 3-5 lenses as specified. Return ONLY the JSON array.';
  return s;
}

// ONE-SHOT lens generation. Returns a Promise of the raw model text; the
// caller runs evalLensResponse before showing anything. Does NOT append to
// the chat transcript. Reuses the claude-proxy call path verbatim.
function generateLenses(meta) {
  var payload = {
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    system:     LENS_GEN_SYSTEM,
    messages: [
      { role: 'user', content: buildLensGenUserMessage(meta) }
    ]
  };
  return fetch('/.netlify/functions/claude-proxy', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
    body:    JSON.stringify(payload)
  }).then(function (res) {
    if (!res.ok) {
      return res.text().then(function (body) {
        throw new Error('proxy ' + res.status + ': ' + body);
      });
    }
    return res.json();
  }).then(function (data) {
    var blocks = data && data.content;
    var text = '';
    var i;
    if (blocks && blocks.length) {
      for (i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        if (block && block.type === 'text' && typeof block.text === 'string') {
          text = text + block.text;
        }
      }
    }
    return text;
  });
}

// EDITABLE blocklist: lens names that are bare market genres, not lenses.
var LENS_GEN_BLOCKLIST = [
  'fiction', 'nonfiction', 'non-fiction', 'self-help',
  'general', 'miscellaneous', 'uncategorized', 'other'
];

function normalizeLensTitle(t) {
  return (typeof t === 'string')
    ? t.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')
    : '';
}

function isBlockedLensName(name) {
  var n = (typeof name === 'string') ? name.toLowerCase().replace(/^\s+|\s+$/g, '') : '';
  var i;
  for (i = 0; i < LENS_GEN_BLOCKLIST.length; i++) {
    if (n === LENS_GEN_BLOCKLIST[i]) { return true; }
  }
  return false;
}

// Client-side eval (v1): structural + grounding validation before any lens
// reaches the user. Tolerant parse (handles a JSON array wrapped in prose),
// then per-lens: GROUNDED (every book must exist in the library; >=2 real,
// distinct books or the lens is dropped), STRUCTURE (name + why + books;
// malformed dropped; cap 5), FIT GUARD (drop bare generic-genre names).
// Returns surviving lenses with canonical library titles, or [] (the caller
// shows a graceful empty state). Never throws.
function evalLensResponse(rawText, libraryTitles) {
  var titleSet = {};
  var i;
  if (libraryTitles) {
    for (i = 0; i < libraryTitles.length; i++) {
      titleSet[normalizeLensTitle(libraryTitles[i])] = libraryTitles[i];
    }
  }
  var parsed = null;
  if (typeof rawText === 'string') {
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      var start = rawText.indexOf('[');
      var end = rawText.lastIndexOf(']');
      if (start !== -1 && end !== -1 && end > start) {
        try { parsed = JSON.parse(rawText.substring(start, end + 1)); }
        catch (e2) { parsed = null; }
      }
    }
  }
  if (!parsed || Object.prototype.toString.call(parsed) !== '[object Array]') {
    return [];
  }
  var out = [];
  for (i = 0; i < parsed.length; i++) {
    var lens = parsed[i];
    if (!lens || typeof lens.name !== 'string' || typeof lens.why !== 'string' ||
        Object.prototype.toString.call(lens.books) !== '[object Array]') {
      continue;
    }
    var name = lens.name.replace(/^\s+|\s+$/g, '');
    if (name === '') { continue; }
    if (isBlockedLensName(name)) { continue; }
    var kept = [];
    var seen = {};
    var j;
    for (j = 0; j < lens.books.length; j++) {
      var norm = normalizeLensTitle(lens.books[j]);
      if (norm !== '' &&
          Object.prototype.hasOwnProperty.call(titleSet, norm) &&
          !Object.prototype.hasOwnProperty.call(seen, norm)) {
        seen[norm] = true;
        kept.push(titleSet[norm]);
      }
    }
    if (kept.length < 2) { continue; }
    out.push({ name: name, why: lens.why.replace(/^\s+|\s+$/g, ''), books: kept });
    if (out.length >= 5) { break; }
  }
  return out;
}

window.YumiBrain = {
  loadVoice:          loadYumiVoice,
  buildSystem:        buildYumiSystem,
  buildContext:       buildContext,
  getContext:         getYumiContext,
  getContextSnapshot: assembleContextData,
  getAggregateCounts: getAggregateCounts,
  sendMessage:        sendMessage,
  gatherLensMetadata: gatherLensLibraryMetadata,
  generateLenses:     generateLenses,
  evalLensResponse:   evalLensResponse
};

// Kick off preload at script-load time so buildYumiSystem can return
// synchronously by the time anything calls it.
loadYumiVoice();

console.log('yumi-brain.js loaded');
