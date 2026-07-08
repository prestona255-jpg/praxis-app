/* ============================================================================
   PRAXIS — WAVE 9 · THE INTRO SYSTEM  (Part A: single-source INTROS + journey)
   ES3 only (var/function, string concat). Exposes window.Intros.

   PART A ships:
     - INTROS : the single-source 12-entry array (per-page panels + About in
                Part B read from THIS symbol; nothing else duplicates it).
     - the first-run guided journey (7 steps) as a BODY-LEVEL .lum-amber overlay
       (body-level so the real writes' renderShelf/renderNotebook rebuilds of
       #app never destroy the running journey).

   REAL WRITES (auth-guarded; teach-only sim when signed out):
     - shelve : replicated from the openShelfEditor save path (views.js ~5471),
                using the real primitives genBookId/ensureBookFields/ensureUser/
                markBookPending/markBooksDirty/saveState. (No standalone shelve
                accessor exists; renderShelf + cover-fetch are intentionally not
                called — the overlay is what's visible.)
     - note   : the real captureNote(register, body, activeKey, images). Safe re:
                "no generative Yumi" — captureNote -> maybeDrawOut -> considerMove
                returns quiet at the panel-closed gate (yumi-brain.js:1715) before
                any generateMove/LLM call, because the Yumi panel is closed here.
     - consent: setProfile(uid,{yumiReaderModel}) + saveProfileToFirestore
                (the flipConsent pattern, views.js ~14596).

   Marks: PraxisMarks (marks.js) for idea-marks; yumiGlyph mono in --lum-cyan for
   Yumi — never hand-rolled. Yumi voice = --lum-cyan only.

   Trigger: UNWIRED in Part A (Part B wires renderRoute gating on onboardingSeen
   and neutralizes the yumi-ui chat greeting). Test via window.Intros.startJourney().
   ============================================================================ */
'use strict';
var Intros = (function () {

  /* ==========================================================================
     SINGLE-SOURCE INTROS — 12 entries, verbatim from the signed-off mockup.
     Part B (per-page panels + About Orientation) reads this array; no other
     content copy of it may exist.
     ========================================================================== */
  var INTROS = [
    { id: 'home', ground: 'dark', title: 'Where today gathers',
      body: 'Home holds what is alive right now — the book you are inside, the last note you left, the thread you were following. It is a desk, not a feed.',
      eg: 'Yesterday you marked Freire on “banking education.” Home remembers so you don’t have to.' },
    { id: 'shelf', ground: 'dark', title: 'The shelf is the spine',
      body: 'Every book you gather lives here — reading, read, still waiting. Group them by lens or by category; the shelf bends to how you actually think.',
      eg: 'Pedagogy of the Oppressed sits beside Teaching to Transgress — as it should.' },
    { id: 'notebook', ground: 'bright', title: 'Margins, kept', tag: 'photo · dictation · paste',
      body: 'Photograph a page, speak a thought, or paste a passage — every note keeps its register: marginalia beside the text, journal beside your life.',
      eg: 'Your two-highlighter method survives here: the passage in gold, your objection in teal.' },
    { id: 'yumi', ground: 'dark', title: 'A second mind, on request',
      body: 'Yumi — 由美, “reasoned beauty” — reads along only where you allow it. She asks before she answers, and she never writes your thoughts for you.',
      eg: '“You underlined this twice — what is it defending you from?”' },
    { id: 'sees', ground: 'bright', title: 'What Yumi sees',
      body: 'The covenant, kept visible: this page lists exactly what Yumi can read — nothing more. Change it here and it changes everywhere, immediately.',
      eg: 'Nothing here is hidden from you.' },
    { id: 'memory', ground: 'bright', title: 'Memory is yours to grant',
      body: 'If you choose, Yumi keeps a reader’s model — the questions you circle, the thinkers you return to — so her questions grow with you. Off by default. Yours to end.',
      eg: 'Consent is a setting, not a speech.' },
    { id: 'lenses', ground: 'dark', title: 'Lenses',
      body: 'A lens regroups your whole shelf around an idea — care, power, method — so the same books answer a different question.',
      eg: 'Under the lens “love as practice,” bell hooks moves to the center.' },
    { id: 'account', ground: 'dark', title: 'A portrait, not a scoreboard',
      body: 'Your account is an instrument: where your reading has been, what it keeps reaching for. It measures nothing and ranks no one.',
      eg: '(Copy provisional — finalized against the shipped portrait.)' },
    { id: 'about', ground: 'bright', title: 'The long version',
      body: 'What Praxis is, what it refuses to become, and this orientation — every room’s introduction, re-readable forever.',
      eg: 'You are reading its example right now.' },
    { id: 'field', ground: 'dark', title: 'The living field', isnew: true,
      body: 'Inside an arc, every sub-theory is a lit mark you arrange by hand. Threads carry the flow between them; tap one to concentrate. The shape is yours — Praxis never tidies uninvited.',
      eg: 'Maturity shows as glow, never as a percentage.' },
    { id: 'search', ground: 'dark', title: 'Search everything you’ve gathered', isnew: true,
      body: 'One search across books, arcs, sub-theories, and notes — your own thought, findable. Chips narrow by kind; results carry their real marks.',
      eg: '“banking” finds Freire’s passage and the night you argued with it.' },
    { id: 'commons', ground: 'dark', title: 'The commons', isnew: true,
      body: 'Publish an arc when it is ready to be walked. Walk other readers’ arcs; build on what holds. Thought travels here by consequence, not by applause.',
      eg: 'No likes. No counts that flatter. Only what your thinking set in motion.' }
  ];

  /* ==========================================================================
     JOURNEY — 7 steps. Apple composition: one idea per screen, one primary,
     one quiet secondary, staggered reveals, a back chevron, step dots.
     ========================================================================== */
  var JOURNEY = [
    { kind: 'welcome' }, { kind: 'covenant' }, { kind: 'stance' },
    { kind: 'act-shelf' }, { kind: 'act-margin' }, { kind: 'act-sees' },
    { kind: 'release' }
  ];

  var picked, step, rootEl, stageEl, dotsEl, nextEl, skipEl, backEl, keyHandler;

  function resetPicked() {
    picked = { book: null, why: null, stance: null, register: 'm', note: null, memory: 'off', bookId: null };
  }

  /* ---- helpers into the real app (all globals; called only at runtime) ---- */
  function currentUid() {
    var u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    return (u && u.uid) ? u.uid : null;
  }
  function esc(s) {
    s = '' + s;
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---- Yumi (never redrawn): mono crest tinted to --lum-cyan via CSS color -- */
  function yumiMark(sz) {
    if (typeof yumiGlyph === 'function') { return yumiGlyph(sz || 15, true); }
    return '';
  }

  /* ---- welcome/release hero: a constellation of REAL marks (PraxisMarks) with
     a cyan Yumi node; threads are decorative geometry, not marks. ---------- */
  function heroCluster() {
    var marks = '';
    if (typeof PraxisMarks !== 'undefined' && PraxisMarks.render) {
      marks =
        '<span class="ij-n ij-n-a">' + PraxisMarks.render('03', 3, 24) + '</span>' +
        '<span class="ij-n ij-n-b">' + PraxisMarks.render('09', 14, 22) + '</span>' +
        '<span class="ij-n ij-n-c">' + PraxisMarks.render('08', 2, 22) + '</span>';
    }
    var threads =
      '<svg class="ij-threads" viewBox="0 0 96 96" width="96" height="96" aria-hidden="true">' +
        '<line x1="48" y1="26" x2="26" y2="62"/>' +
        '<line x1="48" y1="26" x2="70" y2="56"/>' +
        '<line class="ij-thread-y" x1="48" y1="26" x2="50" y2="72"/>' +
      '</svg>';
    return '<div class="ij-cluster ij-breathe">' + threads + marks +
      '<span class="ij-n ij-n-y">' + yumiMark(20) + '</span></div>';
  }

  /* covenant feature-row icons — plain UI line-glyphs (not idea-marks) */
  var ICO = {
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></svg>',
    key: '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    quote: '<svg viewBox="0 0 24 24"><path d="M5 7h6v6H7a4 4 0 0 0 4 4"/><path d="M13 7h6v6h-4a4 4 0 0 0 4 4"/></svg>'
  };

  /* ------------------------------- STEP BUILDERS ------------------------- */
  function buildWelcome() {
    return '<div class="ij-appmark ij-a ij-a1">' + heroCluster() + '</div>' +
      '<h1 class="ij-h1 ij-a ij-a2">Welcome to <em>Praxis</em>.</h1>' +
      '<p class="ij-lede ij-a ij-a3">Reading that stays with you — books, margins, and the theories they grow into.</p>' +
      '<div class="ij-yumi-line ij-a ij-a4"><span class="ij-crest">' + yumiMark(15) + '</span>' +
      'I’m Yumi. In a moment we’ll take your first steps together — doing, not touring.</div>';
  }
  function buildCovenant() {
    return '<h1 class="ij-h1 ij-a ij-a1">Nothing <em>hidden</em>.</h1>' +
      '<p class="ij-lede ij-a ij-a2">Three terms, before anything else.</p>' +
      '<div class="ij-featrows">' +
      '<div class="ij-featrow ij-a ij-a2"><div class="ij-fico">' + ICO.eye + '</div><div><div class="ij-ft">Yumi sees only what you allow</div><div class="ij-fd">Listed plainly on <i>What Yumi Sees</i> — always current. You’ll read it yourself in a minute.</div></div></div>' +
      '<div class="ij-featrow ij-a ij-a3"><div class="ij-fico">' + ICO.key + '</div><div><div class="ij-ft">Memory is yours to grant</div><div class="ij-fd">Off until you turn it on. Readable, correctable, endable.</div></div></div>' +
      '<div class="ij-featrow ij-a ij-a4"><div class="ij-fico">' + ICO.quote + '</div><div><div class="ij-ft">Your words stay yours</div><div class="ij-fd">Yumi quotes you; she never replaces you.</div></div></div>' +
      '</div>';
  }
  function buildStance() {
    return '<h1 class="ij-h1 ij-a ij-a1">How should <em>Yumi</em> begin?</h1>' +
      '<p class="ij-lede ij-a ij-a2">You can change this any time.</p>' +
      '<div class="ij-stances ij-a ij-a3">' +
      '<button type="button" class="ij-stance' + (picked.stance === 'press' ? ' is-picked' : '') + '" data-v="press"><span class="ij-ring"></span><span><b>Press me</b>Question my readings. Find what I’m avoiding.</span></button>' +
      '<button type="button" class="ij-stance' + (picked.stance === 'company' ? ' is-picked' : '') + '" data-v="company"><span class="ij-ring"></span><span><b>Keep me company</b>Notice with me. Think alongside, not against.</span></button>' +
      '<button type="button" class="ij-stance' + (picked.stance === 'quiet' ? ' is-picked' : '') + '" data-v="quiet"><span class="ij-ring"></span><span><b>Stay out unless asked</b>I’ll summon you when I want you.</span></button>' +
      '</div>';
  }
  function buildActShelf() {
    var h = '<div class="ij-actkick ij-a ij-a1">Act one · your shelf</div><h1 class="ij-acttitle ij-a ij-a1">Bring your first book.</h1>';
    h += '<div class="ij-sim is-dark ij-a ij-a2"><div class="ij-sim-bar"><span class="t">Your shelf</span><span class="live">the real surface</span></div><div class="ij-sim-body">';
    if (picked.book) {
      h += '<div class="ij-bookrow"><div class="ij-spine"><i>' + esc(picked.book) + '</i></div></div>';
    } else {
      h += '<div class="ij-shelf-empty"><span class="big">Nothing gathered yet.</span>Your first book arrives the moment you answer her.</div>';
    }
    h += '</div></div>';
    return h;
  }
  function dockActShelf() {
    if (!picked.book) {
      return { words: 'What are you reading right now — or what’s been waiting for you?',
        sub: 'Her question is the act — answering it shelves the book.',
        chips: [{ t: 'Pedagogy of the Oppressed', v: 'Pedagogy of the Oppressed' },
                { t: 'Teaching to Transgress', v: 'Teaching to Transgress' },
                { t: 'Empire of AI', v: 'Empire of AI' }],
        input: { ph: '…or type any title', btn: 'Shelve it' }, on: 'book' };
    }
    if (!picked.why) {
      return { words: '“' + esc(picked.book) + '.” Good. What pulled you to it?',
        sub: 'A personal thread, woven in.',
        chips: [{ t: 'It was recommended', v: 'rec' }, { t: 'I’m returning to it', v: 'return' },
                { t: 'For work or study', v: 'study' }, { t: 'I can’t say yet', v: 'unsaid' }], on: 'why' };
    }
    return { words: picked.why === 'return'
        ? 'Returning is its own kind of reading — you’re not the same person who left it.'
        : 'Noted — not filed, just heard.',
      sub: 'Continue when ready — its margin is waiting.', chips: [] };
  }
  function buildActMargin() {
    var h = '<div class="ij-actkick ij-a ij-a1">Act two · the margin</div><h1 class="ij-acttitle ij-a ij-a1">Leave one honest note.</h1>';
    h += '<div class="ij-sim is-bright ij-a ij-a2"><div class="ij-sim-bar"><span class="t">' + esc(picked.book || 'Your first book') + ' · margins</span><span class="live">the real surface</span></div><div class="ij-sim-body">';
    h += '<div class="ij-margin-wrap"><div class="ij-margin-page"><div class="bt">the page</div>Open anywhere — the passage that made you stop, the sentence you argued with.</div>';
    h += '<div class="ij-margin-side">';
    if (picked.note) {
      h += '<div class="ij-notecard' + (picked.register === 'j' ? ' is-j' : '') + '"><div class="nr">' + (picked.register === 'j' ? 'Journal' : 'Marginalia') + '</div>' + esc(picked.note) + '</div>';
    } else {
      h += '<div class="ij-regs"><button type="button" class="ij-reg is-m' + (picked.register === 'm' ? ' is-on' : '') + '" data-r="m">Marginalia</button><button type="button" class="ij-reg is-j' + (picked.register === 'j' ? ' is-on' : '') + '" data-r="j">Journal</button></div>';
      h += '<textarea id="ij-noteta" placeholder="one honest sentence…"></textarea>';
      h += '<button type="button" class="ij-keepnote" id="ij-keepnote">Keep this note</button>';
    }
    h += '</div></div></div></div>';
    return h;
  }
  function dockActMargin() {
    if (!picked.note) {
      return { words: 'A sentence is plenty. Why this book — why now?',
        sub: 'Marginalia sits beside the text · Journal sits beside your life.', chips: [] };
    }
    return { words: 'Kept — and it stays yours in every sense. Which brings us to the terms.',
      sub: 'Continue to see exactly what she can see.', chips: [] };
  }
  function buildActSees() {
    var h = '<div class="ij-actkick ij-a ij-a1">Act three · what she sees</div><h1 class="ij-acttitle ij-a ij-a1">Read the covenant yourself.</h1>';
    h += '<div class="ij-sim is-bright ij-a ij-a2"><div class="ij-sim-bar"><span class="t">What Yumi sees</span><span class="live">the real surface</span></div><div class="ij-sim-body">';
    h += '<div class="ij-sees-list">';
    h += '<div class="ij-sees-row"><div class="l"><b>Your shelf</b>' + (picked.book ? ('1 book · ' + esc(picked.book)) : 'your gathered books') + '</div><span class="ij-pill is-vis">visible</span></div>';
    h += '<div class="ij-sees-row"><div class="l"><b>Your margins</b>' + (picked.note ? '1 note · the one you just kept' : 'your notes, by register') + '</div><span class="ij-pill is-vis">visible</span></div>';
    h += '<div class="ij-sees-row"><div class="l"><b>Reading activity</b>what’s open, what’s finished</div><span class="ij-pill is-vis">visible</span></div>';
    h += '<div class="ij-sees-row"><div class="l"><b>Memory — the reader’s model</b>the questions you circle, the thinkers you return to</div>' +
      '<div class="ij-memchips"><button type="button" class="ij-memchip' + (picked.memory === 'off' ? ' is-on' : '') + '" data-m="off">leave off</button><button type="button" class="ij-memchip' + (picked.memory === 'on' ? ' is-on' : '') + '" data-m="on">turn on</button></div></div>';
    h += '</div></div></div>';
    return h;
  }
  function dockActSees() {
    var w = picked.memory === 'on'
      ? 'Then I’ll remember with you — and everything I keep stays readable, correctable, endable.'
      : 'What I can read is exactly this list, nothing more. Memory stays off until you say otherwise.';
    return { words: w, sub: 'A setting, not a speech — change it here any time.', chips: [] };
  }
  function buildRelease() {
    return '<div class="ij-appmark ij-a ij-a1">' + heroCluster() + '</div>' +
      '<h1 class="ij-h1 ij-a ij-a2">The rest, you’ll find by <em>walking</em>.</h1>' +
      '<p class="ij-lede ij-a ij-a3">Your shelf has its first book. Its margin has your first thought. Every other room introduces itself when you first enter — and every introduction lives in About, forever.</p>' +
      '<div class="ij-yumi-line ij-a ij-a4"><span class="ij-crest">' + yumiMark(15) + '</span>' +
      'I’m in the corner when you want me' + (picked.stance === 'press' ? ' — and you asked me to press, so I will.' : '.') + '</div>';
  }

  /* ------------------------------- REAL WRITES --------------------------- */
  /* Shelve — replicate the openShelfEditor save (views.js ~5471) with the real
     primitives; no renderShelf / cover-fetch. Returns the new book id or null. */
  function doShelve(title) {
    var uid = currentUid();
    if (!uid) { return null; }
    if (typeof genBookId !== 'function' || typeof state === 'undefined' || !state.books) { return null; }
    var now = Date.now();
    var id = genBookId();
    state.books[id] = { id: id, title: title, author: '', isbn: '', addedAt: now, status: 'reading', genre: '', coverUrl: null };
    if (typeof ensureBookFields === 'function') { ensureBookFields(state.books[id]); }
    if (typeof ensureUser === 'function') { ensureUser(uid); }
    if (state.userBooks && state.userBooks[uid] && state.userBooks[uid].bookIds) { state.userBooks[uid].bookIds.push(id); }
    if (typeof markBookPending === 'function') { markBookPending(uid, id); }
    if (typeof markBooksDirty === 'function') { markBooksDirty(); }
    if (typeof saveState === 'function') { saveState(); }
    return id;
  }
  /* Note — the real captureNote. Panel is closed here, so maybeDrawOut ->
     considerMove returns quiet at the panel-closed gate before any LLM call. */
  function doNote(mockReg, body) {
    if (typeof captureNote !== 'function') { return; }
    if (!currentUid()) { return; }
    var realReg = (mockReg === 'j') ? 'journal' : 'marginalia';
    var activeKey = picked.bookId ? picked.bookId : 'inbox';
    captureNote(realReg, body, activeKey, []);
  }
  /* Consent — the flipConsent pattern (views.js ~14596). */
  function doConsent(on) {
    var uid = currentUid();
    if (!uid) { return; }
    if (typeof setProfile === 'function') { setProfile(uid, { yumiReaderModel: on === true }); }
    if (typeof saveProfileToFirestore === 'function' && typeof getProfile === 'function') {
      saveProfileToFirestore(uid, getProfile(uid), function () {});
    }
  }
  function markSeenAndClose() {
    var uid = currentUid();
    if (uid && typeof setProfile === 'function') {
      setProfile(uid, { onboardingSeen: true });
      if (typeof saveProfileToFirestore === 'function' && typeof getProfile === 'function') {
        saveProfileToFirestore(uid, getProfile(uid), function () {});
      }
    }
    closeJourney();
  }

  /* ------------------------------- RENDER + WIRE ------------------------- */
  function renderStep() {
    if (!stageEl) { return; }
    var b = JOURNEY[step], h = '';
    if (b.kind === 'welcome') { h = buildWelcome(); }
    else if (b.kind === 'covenant') { h = buildCovenant(); }
    else if (b.kind === 'stance') { h = buildStance(); }
    else if (b.kind === 'act-shelf') { h = buildActShelf(); }
    else if (b.kind === 'act-margin') { h = buildActMargin(); }
    else if (b.kind === 'act-sees') { h = buildActSees(); }
    else if (b.kind === 'release') { h = buildRelease(); }

    var d = null;
    if (b.kind === 'act-shelf') { d = dockActShelf(); }
    else if (b.kind === 'act-margin') { d = dockActMargin(); }
    else if (b.kind === 'act-sees') { d = dockActSees(); }
    if (d) {
      h += '<div class="ij-dock ij-a ij-a3"><div class="ij-dock-line"><span class="ij-crest">' + yumiMark(15) + '</span><div class="ij-dock-words">' + d.words + '</div></div>';
      if (d.sub) { h += '<div class="ij-dock-sub">' + d.sub + '</div>'; }
      if (d.chips && d.chips.length) {
        h += '<div class="ij-dock-chips">';
        var i;
        for (i = 0; i < d.chips.length; i++) {
          h += '<button type="button" class="ij-dchip" data-on="' + d.on + '" data-v="' + esc(d.chips[i].v) + '">' + esc(d.chips[i].t) + '</button>';
        }
        h += '</div>';
      }
      if (d.input) {
        h += '<div class="ij-typein"><input id="ij-bookin" type="text" placeholder="' + esc(d.input.ph) + '"><button type="button" id="ij-bookgo">' + esc(d.input.btn) + '</button></div>';
      }
      h += '</div>';
    }
    stageEl.innerHTML = h;

    var dots = '', j;
    for (j = 0; j < JOURNEY.length; j++) {
      dots += '<button type="button" class="ij-dot' + (j === step ? ' is-on' : '') + '" data-i="' + j + '" aria-label="Step ' + (j + 1) + '"></button>';
    }
    dotsEl.innerHTML = dots;
    backEl.disabled = (step === 0);

    nextEl.className = 'ij-primary';
    skipEl.textContent = '';
    if (b.kind === 'welcome') { nextEl.textContent = 'Continue'; skipEl.textContent = 'I’ll explore on my own'; }
    else if (b.kind === 'stance') { nextEl.textContent = picked.stance ? 'Continue' : 'Decide later'; }
    else if (b.kind === 'act-shelf') { nextEl.textContent = picked.book ? 'Continue' : 'Skip this act'; }
    else if (b.kind === 'act-margin') { nextEl.textContent = picked.note ? 'Continue' : 'Skip this act'; }
    else if (b.kind === 'release') { nextEl.textContent = 'Enter Praxis'; nextEl.className = 'ij-primary is-enter'; skipEl.textContent = 'Retake the walk'; }
    else { nextEl.textContent = 'Continue'; }
    wireStage();
  }

  function wireStage() {
    var i;
    var st = stageEl.querySelectorAll('.ij-stance');
    for (i = 0; i < st.length; i++) {
      st[i].onclick = function () { picked.stance = this.getAttribute('data-v'); renderStep(); };
    }
    var dc = stageEl.querySelectorAll('.ij-dchip');
    for (i = 0; i < dc.length; i++) {
      dc[i].onclick = function () {
        var on = this.getAttribute('data-on'), v = this.getAttribute('data-v');
        picked[on] = v;
        if (on === 'book') { picked.bookId = doShelve(v); }
        renderStep();
      };
    }
    var bg = stageEl.querySelector('#ij-bookgo');
    if (bg) {
      bg.onclick = function () {
        var el = stageEl.querySelector('#ij-bookin'), v = el ? el.value : '';
        if (v && v.replace(/^\s+|\s+$/g, '') !== '') { picked.book = v; picked.bookId = doShelve(v); renderStep(); }
      };
    }
    var regs = stageEl.querySelectorAll('.ij-reg');
    for (i = 0; i < regs.length; i++) {
      regs[i].onclick = function () { picked.register = this.getAttribute('data-r'); renderStep(); };
    }
    var kn = stageEl.querySelector('#ij-keepnote');
    if (kn) {
      kn.onclick = function () {
        var el = stageEl.querySelector('#ij-noteta'), v = el ? el.value : '';
        if (v && v.replace(/^\s+|\s+$/g, '') !== '') { picked.note = v; doNote(picked.register, v); renderStep(); }
      };
    }
    var mem = stageEl.querySelectorAll('.ij-memchip');
    for (i = 0; i < mem.length; i++) {
      mem[i].onclick = function () { picked.memory = this.getAttribute('data-m'); doConsent(picked.memory === 'on'); renderStep(); };
    }
    var dd = dotsEl.querySelectorAll('.ij-dot');
    for (i = 0; i < dd.length; i++) {
      dd[i].onclick = function () { step = parseInt(this.getAttribute('data-i'), 10); renderStep(); };
    }
  }

  /* ------------------------------- OPEN / CLOSE -------------------------- */
  function onNext() {
    if (JOURNEY[step].kind === 'release') {
      markSeenAndClose();
      // IA4: hand the finished new reader INTO the writing loop, not back onto
      // Home. Prefer the book they shelved during the walk; else the notebook.
      var dest = (picked && picked.bookId) ? '#book/' + picked.bookId : '#notebook';
      if (location.hash === dest) {
        if (typeof renderRoute === 'function') { renderRoute(); }
      } else {
        location.hash = dest;
      }
      return;
    }
    step++;
    renderStep();
  }
  function onSkip() {
    var kind = JOURNEY[step].kind;
    if (kind === 'welcome') { markSeenAndClose(); return; }   // the global "explore on my own" off-switch
    if (kind === 'release') { resetPicked(); step = 0; renderStep(); return; }  // retake the walk
  }
  function onBack() { if (step > 0) { step--; renderStep(); } }

  function startJourney() {
    if (rootEl) { return; }   // already open
    removePanel();            // the journey takes over from any per-page panel
    if (summonEl) { summonEl.style.display = 'none'; }
    resetPicked();
    step = 0;
    rootEl = document.createElement('div');
    rootEl.className = 'intro-journey lum-amber';
    rootEl.setAttribute('role', 'dialog');
    rootEl.setAttribute('aria-label', 'Welcome to Praxis');
    rootEl.innerHTML =
      '<button type="button" class="ij-backchev" id="ij-back" aria-label="Back">‹</button>' +
      '<div class="ij-stage" id="ij-stage" aria-live="polite"></div>' +
      '<div class="ij-actionbar">' +
        '<div class="ij-dots" id="ij-dots" role="tablist" aria-label="Journey steps"></div>' +
        '<button type="button" class="ij-primary" id="ij-next">Continue</button>' +
        '<button type="button" class="ij-secondary" id="ij-skip"></button>' +
      '</div>';
    document.body.appendChild(rootEl);
    stageEl = rootEl.querySelector('#ij-stage');
    dotsEl = rootEl.querySelector('#ij-dots');
    nextEl = rootEl.querySelector('#ij-next');
    skipEl = rootEl.querySelector('#ij-skip');
    backEl = rootEl.querySelector('#ij-back');
    nextEl.onclick = onNext;
    skipEl.onclick = onSkip;
    backEl.onclick = onBack;
    keyHandler = function (e) {
      var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea') { return; }
      if (e.key === 'ArrowRight') { step = Math.min(step + 1, JOURNEY.length - 1); renderStep(); }
      else if (e.key === 'ArrowLeft') { step = Math.max(step - 1, 0); renderStep(); }
    };
    document.addEventListener('keydown', keyHandler);
    renderStep();
  }

  function closeJourney() {
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
    if (rootEl && rootEl.parentNode) { rootEl.parentNode.removeChild(rootEl); }
    rootEl = stageEl = dotsEl = nextEl = skipEl = backEl = null;
    panelForHash();           // resume per-page panels for the revealed surface
  }

  /* ==========================================================================
     PART B — PER-PAGE PANELS (single-sourced from INTROS)
     Each panel-bearing surface shows its INTRO once (ls/sv seen-flag), then a
     quiet re-summon appears. Body-level dismissible card, dark/bright per
     INTROS[i].ground. Panels use the same INTROS array as About Orientation.
     ========================================================================== */
  var INTRO_BY_ID = (function () { var m = {}, i; for (i = 0; i < INTROS.length; i++) { m[INTROS[i].id] = INTROS[i]; } return m; })();

  // hash head -> INTRO id, for the surfaces that own a dedicated route. The
  // orphans (yumi/memory/lenses) have no surface, and About is the host itself;
  // all four live in About Orientation (all 12) and are re-readable there.
  var ROUTE_INTRO = { '': 'notebook', 'notebook': 'notebook', 'home': 'home', 'books': 'shelf', 'arc': 'field', 'search': 'search', 'commons': 'commons', 'account': 'account', 'yumi-sees': 'sees' };

  function introForHash(hash) {
    var h = ('' + (hash || '')).replace(/^#/, '');
    var head = h.split('/')[0];
    return ROUTE_INTRO.hasOwnProperty(head) ? ROUTE_INTRO[head] : null;
  }
  function seenKey(id) { return 'praxis_intro_' + id; }
  function panelSeen(id) { return (typeof ls === 'function') ? (ls(seenKey(id), false) === true) : false; }
  function markPanelSeen(id) { if (typeof sv === 'function') { sv(seenKey(id), true); } }

  var panelEl = null, summonEl = null;

  function removePanel() { if (panelEl && panelEl.parentNode) { panelEl.parentNode.removeChild(panelEl); } panelEl = null; }

  function buildPanelInner(p) {
    var newFlag = p.isnew ? '<span class="intro-new">new</span>' : '';
    var tag = p.tag ? ' <span class="intro-tag">[' + p.tag + ']</span>' : '';
    return '<div class="intro-panel is-' + p.ground + '">' +
      '<button type="button" class="intro-panel-x" aria-label="Dismiss">&times;</button>' +
      '<div class="intro-panel-top"><span class="intro-panel-name">' + p.id + newFlag + '</span>' +
      '<span class="intro-panel-badge">' + p.ground + ' ground</span></div>' +
      '<div class="intro-panel-title">' + p.title + '</div>' +
      '<div class="intro-panel-body">' + p.body + tag + '</div>' +
      '<div class="intro-panel-eg">' + p.eg + '</div>' +
      '<div class="intro-panel-foot">lives permanently in About &rarr; Orientation</div>' +
      '</div>';
  }

  function showPanel(id) {
    if (rootEl) { return; }            // never over the first-run journey
    var p = INTRO_BY_ID[id];
    if (!p) { return; }
    removePanel();
    panelEl = document.createElement('div');
    panelEl.className = 'intro-panel-wrap';
    panelEl.innerHTML = buildPanelInner(p);
    document.body.appendChild(panelEl);
    var x = panelEl.querySelector('.intro-panel-x');
    if (x) { x.onclick = function () { markPanelSeen(id); removePanel(); updateSummon(id); }; }
  }

  function maybeShowPanel(id) {
    if (!id || rootEl) { return; }
    if (panelSeen(id)) { return; }
    markPanelSeen(id);           // auto-show-once: showing counts as seen
    showPanel(id);
  }

  // re-summon: a quiet fixed control that appears only AFTER a surface's intro
  // has been dismissed; re-opens it regardless of the seen-flag.
  function updateSummon(id) {
    if (!summonEl) {
      summonEl = document.createElement('button');
      summonEl.type = 'button';
      summonEl.className = 'intro-summon';
      summonEl.setAttribute('aria-label', 'About this page');
      summonEl.innerHTML = '<span aria-hidden="true">i</span>';
      document.body.appendChild(summonEl);
    }
    if (id && INTRO_BY_ID[id] && panelSeen(id) && !panelEl && !rootEl) {
      summonEl.style.display = 'flex';
      summonEl.onclick = function () { showPanel(id); };
    } else {
      summonEl.style.display = 'none';
    }
  }

  function panelForHash() {
    removePanel();               // clear the previous surface's panel on nav
    var id = introForHash(location.hash);
    maybeShowPanel(id);
    updateSummon(id);
  }

  function initPanels() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', panelForHash);
    } else {
      panelForHash();
    }
    window.addEventListener('hashchange', panelForHash);
  }

  /* ==========================================================================
     PART B — ABOUT ORIENTATION. renderAbout routes its "Re-enter a page"
     section through this; it reads the SAME INTROS (single source) + prepends
     the retakeable first walk. Emits the existing About accordion markup so it
     inherits About's styles; the retake button is wired in renderAbout.
     ========================================================================== */
  function buildAboutOrientation() {
    var h = '';
    h += '<div class="about-section">';
    h += '<p class="about-section-no">Re-enter a page</p>';
    h += '<h2 class="about-h2">Learn any room again.</h2>';
    h += '<hr class="about-rule">';
    h += '<p class="about-body">Everything the app told you on first visit lives here permanently — including the guided first walk, retakeable any time.</p>';
    h += '<details class="about-accordion" open><summary>The first walk<span class="intro-new">retake</span></summary>' +
      '<div class="ac-body">The three-act guided walk from day one — shelf, margin, covenant — retakeable in full, any time.' +
      '<div class="intro-eg">Doing, not touring.</div>' +
      '<button type="button" class="intro-retake" id="about-retake-walk">Retake the walk</button></div></details>';
    var i;
    for (i = 0; i < INTROS.length; i++) {
      var p = INTROS[i];
      var newFlag = p.isnew ? '<span class="intro-new">new</span>' : '';
      var tag = p.tag ? ' <span class="intro-tag">[' + p.tag + ']</span>' : '';
      h += '<details class="about-accordion"><summary>' + p.title + newFlag + '</summary>' +
        '<div class="ac-body">' + p.body + tag + '<div class="intro-eg">' + p.eg + '</div></div></details>';
    }
    h += '</div>';
    return h;
  }

  return {
    INTROS: INTROS,
    startJourney: startJourney,
    closeJourney: closeJourney,
    buildAboutOrientation: buildAboutOrientation,
    maybeShowPanel: maybeShowPanel,
    showPanel: showPanel,
    initPanels: initPanels
  };
})();
window.Intros = Intros;
Intros.initPanels();
