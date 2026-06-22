// =====================================================================
// yumi-ui.js -- Yumi chat panel UI
// Stage 2.3: chat panel scaffold. Empty state with rotating greeting,
// message list area, input field + send (logs only), inert voice
// button, Cmd/Ctrl+J toggle, persistent floating toggle button.
// No brain wiring, no proxy call, no real voice input -- those land
// in 2.4 and beyond.
// =====================================================================

'use strict';

var YUMI_GREETINGS = [
  'Good to see you again. Nice to be here with you.',
  'It is nice to be in your presence today.',
  'What theory have you made since our last talk?',
  'It is nice to be in your presence today. What theory have you made since our last talk?',
  'It is nice to be in your presence today. What are you reading right now — not what you should be, what is actually open?'
];

var YUMI_PANEL_ID  = 'yumi-panel';
var YUMI_BLOOM_ID  = 'yumi-bloom';
var YUMI_PANEL_BLOOM_ID = 'yumi-panel-bloom';
var YUMI_INPUT_ID  = 'yumi-input';
var YUMI_BODY_ID   = 'yumi-panel-body';

var yumiPanelEl    = null;
var yumiBloomEl    = null;
var yumiPanelBloomEl = null;
var yumiBloomLineEl = null;
var yumiInputEl    = null;
var yumiBodyEl     = null;
var yumiSendBtnEl  = null;
var yumiMicBtnEl   = null;
var yumi_request_in_flight = false;

function isYumiPanelOpen() {
  return ls('praxis_yumi_open', false) === true;
}

// 6.2c: the Yumi panel is a fixed bottom-right overlay (z-9998). On an arc's
// constellation Web view it parks over the sub-theory marks and swallows
// Connect clicks (a click resolves to the panel, handleConnectClick disarms).
// Onboarding parked it two ways -- auto-open and the persisted praxis_yumi_open
// flag it sets. Rule: never PARK the panel over the constellation. While an arc
// route is active the panel stays closed; the toggle is untouched, so the user
// can still open Yumi there deliberately -- this only suppresses a panel carried
// in from a prior page / the persisted flag / onboarding.
function isArcRoute() {
  return location.hash.indexOf('#arc/') === 0;
}

function suppressYumiOnArc() {
  if (isArcRoute() && yumiPanelEl) {
    yumiPanelEl.classList.remove('yumi-panel-open');
  }
}

function pickYumiGreeting() {
  if (YUMI_GREETINGS.length <= 1) {
    return YUMI_GREETINGS[0] || '';
  }
  var last = ls('praxis_yumi_last_greeting_idx', -1);
  var next = Math.floor(Math.random() * YUMI_GREETINGS.length);
  while (next === last) {
    next = Math.floor(Math.random() * YUMI_GREETINGS.length);
  }
  sv('praxis_yumi_last_greeting_idx', next);
  return YUMI_GREETINGS[next];
}

// =====================================================================
// THE Yumi GLYPH (Umebloom crest) -- the ONE static Yumi mark, shared by
// every surface the animated nav Bloom cannot reach: the favicon
// (assets/icon.svg, a literal-hex twin kept in sync), the lens-panel
// header, the in-flight "thinking" line, proposed-lens cards, adopted-
// lens cards, and the chat empty-state greeting. Design-locked geometry
// (viewBox 0 0 100 100): a --br-deep ring, five --gold petals at 72-deg
// steps, a --gold-light core. Token rule: NO literal hex -- colours are
// var(--token), or currentColor when mono is true so the surface owns
// the colour. size is the rendered px (width == height; default 28).
// This function is the single in-app source of the glyph markup -- no
// other surface inlines its own copy.
// =====================================================================
var YUMI_GLYPH_PETAL =
  'M50,38 C40,34 36,18 43,10 Q47,7 50,12 Q53,7 57,10 C64,18 60,34 50,38 Z';
var YUMI_GLYPH_ROT = [0, 72, 144, 216, 288];

function yumiGlyph(size, mono) {
  var px = (size && size > 0) ? size : 28;
  var ringFill  = mono ? 'currentColor' : 'var(--br-deep)';
  var petalFill = mono ? 'currentColor' : 'var(--gold)';
  var coreFill  = mono ? 'currentColor' : 'var(--gold-light)';
  var petals = '';
  var i;
  for (i = 0; i < YUMI_GLYPH_ROT.length; i++) {
    petals = petals +
      '<path d="' + YUMI_GLYPH_PETAL + '" fill="' + petalFill +
      '" transform="rotate(' + YUMI_GLYPH_ROT[i] + ' 50 50)"/>';
  }
  return '<svg class="yumi-glyph" viewBox="0 0 100 100" width="' + px +
    '" height="' + px + '" focusable="false" aria-hidden="true">' +
    '<circle cx="50" cy="50" r="46" fill="none" stroke="' + ringFill +
    '" stroke-width="2.4"/>' + petals +
    '<circle cx="50" cy="50" r="11" fill="' + coreFill + '"/>' +
    '</svg>';
}

// One-time stylesheet for the shared glyph -- injected from JS (not
// components.css) to hold this build's blast radius to yumi-ui.js +
// assets/icon.svg + sw.js. Colour stays in the SVG token fills; this only
// carries layout helpers + a reduced-motion-safe "thinking" pulse (under
// prefers-reduced-motion: reduce the keyframes rule is absent, so the crest
// stays static). No hex.
var yumiGlyphStyleDone = false;
function ensureGlyphStyle() {
  if (yumiGlyphStyleDone || document.getElementById('praxis-yumi-glyph-style')) {
    yumiGlyphStyleDone = true;
    return;
  }
  var st = document.createElement('style');
  st.id = 'praxis-yumi-glyph-style';
  // .yumi-empty is flex (row by default); the 5th-surface crest must stack
  // ABOVE the greeting, so this flips that one container to a column (its
  // only children are the crest block + the greeting). Runtime-appended, so
  // it wins over the linked components.css at equal specificity.
  st.textContent =
    '.yumi-glyph-host{display:inline-flex;vertical-align:middle;line-height:0}' +
    '.yumi-glyph-lead{margin-right:.5em}' +
    '.yumi-glyph-block{display:flex;justify-content:center;margin-bottom:.55em}' +
    '.yumi-empty{flex-direction:column}' +
    '@media (prefers-reduced-motion: no-preference){' +
    '@keyframes praxisGlyphPulse{0%,100%{opacity:1}50%{opacity:.55}}' +
    '.yumi-glyph-pulse{animation:praxisGlyphPulse 1.6s ease-in-out infinite}}';
  (document.head || document.documentElement).appendChild(st);
  yumiGlyphStyleDone = true;
}

// DOM convenience: a host span carrying the shared glyph at the given size,
// plus any extra classes. Every in-app surface builds its mark through this
// so the glyph markup has exactly one source. Decorative: aria-hidden host.
function yumiGlyphNode(size, extraClass) {
  ensureGlyphStyle();
  var host = document.createElement('span');
  host.className = extraClass ? ('yumi-glyph-host ' + extraClass) : 'yumi-glyph-host';
  host.setAttribute('aria-hidden', 'true');
  host.innerHTML = yumiGlyph(size, false);
  return host;
}

function renderYumiEmptyState() {
  if (!yumiBodyEl) { return; }
  var greeting = pickYumiGreeting();
  yumiBodyEl.innerHTML = '';
  var wrap = document.createElement('div');
  wrap.className = 'yumi-empty';
  // 5th surface: the shared crest sits above the rotating greeting -- the
  // static Yumi mark for the chat empty state (Bloom is the nav FAB, which
  // cannot reach inside the panel body).
  wrap.appendChild(yumiGlyphNode(32, 'yumi-glyph-block'));
  var line = document.createElement('div');
  line.className = 'yumi-greeting';
  line.textContent = greeting;
  wrap.appendChild(line);
  yumiBodyEl.appendChild(wrap);
}

function renderUserMessage(text) {
  if (!yumiBodyEl) { return; }
  var msg = document.createElement('div');
  msg.className = 'yumi-msg yumi-msg-user';
  msg.textContent = text;
  yumiBodyEl.appendChild(msg);
  yumiBodyEl.scrollTop = yumiBodyEl.scrollHeight;
}

// yumi-intelligence Stage III: the live-web grounding indicator. Builds the two
// quiet chips (web source + optional reader-model theme) + an honest source line
// that sits ABOVE Yumi's reply. DOM-safe by construction: all text via
// textContent / createTextNode; the source link's href is validated to http(s)
// only (rel noopener/nofollow) -- web-derived strings are NEVER innerHTML'd. The
// chip shows ONLY when web actually ran (grounding.web present). Returns a node.
function buildGroundingChips(grounding) {
  var wrap = document.createElement('div');
  var chips = document.createElement('div');
  chips.className = 'ground-chips';
  var webChip = document.createElement('span');
  webChip.className = 'ground-chip web';
  var wdot = document.createElement('span');
  wdot.className = 'gdot';
  webChip.appendChild(wdot);
  webChip.appendChild(document.createTextNode(' informed by a current source'));
  chips.appendChild(webChip);
  if (grounding && grounding.theme) {
    var themeChip = document.createElement('span');
    themeChip.className = 'ground-chip theme';
    var tdot = document.createElement('span');
    tdot.className = 'gdot';
    themeChip.appendChild(tdot);
    themeChip.appendChild(document.createTextNode(' drawn from a theme you keep returning to'));
    chips.appendChild(themeChip);
  }
  wrap.appendChild(chips);
  var src = document.createElement('p');
  src.className = 'ground-source';
  var web = (grounding && grounding.web) ? grounding.web : {};
  var title = (typeof web.title === 'string' && web.title.replace(/^\s+|\s+$/g, '') !== '')
    ? web.title : 'a current source';
  src.appendChild(document.createTextNode('Source — '));
  var url = (typeof web.url === 'string' && /^https?:\/\//i.test(web.url)) ? web.url : '';
  if (url !== '') {
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer nofollow';
    a.textContent = title;
    src.appendChild(a);
  } else {
    var em = document.createElement('em');
    em.textContent = title;
    src.appendChild(em);
  }
  src.appendChild(document.createTextNode('. Yumi referenced it to angle the question, not to answer it.'));
  wrap.appendChild(src);
  return wrap;
}

function renderYumiMessage(text, grounding) {
  if (!yumiBodyEl) { return; }
  // Stage III: prepend the grounding chip ONLY when web actually informed this
  // move (grounding.web present). All other render paths pass no grounding.
  if (grounding && grounding.web) {
    yumiBodyEl.appendChild(buildGroundingChips(grounding));
  }
  var msg = document.createElement('div');
  msg.className = 'yumi-msg yumi-msg-yumi';
  msg.textContent = text;
  yumiBodyEl.appendChild(msg);
  yumiBodyEl.scrollTop = yumiBodyEl.scrollHeight;
}

function renderTypingIndicator() {
  if (!yumiBodyEl) { return; }
  removeTypingIndicator();
  var msg = document.createElement('div');
  msg.className = 'yumi-msg yumi-msg-typing';
  msg.textContent = '...';
  yumiBodyEl.appendChild(msg);
  yumiBodyEl.scrollTop = yumiBodyEl.scrollHeight;
  // Bloom reflects the in-flight request: thinking while a reply is pending.
  setBloomState('thinking');
}

function removeTypingIndicator() {
  if (!yumiBodyEl) { return; }
  var el = yumiBodyEl.querySelector('.yumi-msg-typing');
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
  // Request settled (resolve or error): Bloom returns to rest. A later voice
  // stage may move it on to speaking when audio begins.
  setBloomState('resting');
}

function renderError(customText) {
  if (!yumiBodyEl) { return; }
  var text;
  if (typeof customText === 'string' && customText.length > 0) {
    text = customText;
  } else {
    text = 'Something went wrong reaching Yumi. Try again.';
  }
  var msg = document.createElement('div');
  msg.className = 'yumi-msg yumi-msg-error';
  msg.textContent = text;
  yumiBodyEl.appendChild(msg);
  yumiBodyEl.scrollTop = yumiBodyEl.scrollHeight;
}

// Stage B-2.2: ZERO-LLM co-write guard (string check only, no model call). A
// reply is woven into the pending complicate note ONLY when it reads as
// substantive engagement. It FALLS THROUGH to normal chat (no weave) when the
// reply is too short to be a reflection (< 3 words), a short
// clarifying-question-back (ends with '?' and <= 8 words, e.g. "what do you
// mean?"), or an explicit refusal. Bias: when unsure, do NOT weave.
function isSubstantiveReflection(reply) {
  var t = (typeof reply === 'string') ? reply.replace(/^\s+|\s+$/g, '') : '';
  if (t === '') { return false; }
  var words = t.split(/\s+/);
  if (words.length < 3) { return false; }
  if (t.charAt(t.length - 1) === '?' && words.length <= 8) { return false; }
  var low = t.toLowerCase().replace(/[.!?,;:]+$/, '');
  var refusals = ['no', 'nope', 'not now', 'not really', 'nevermind',
    'never mind', 'skip', 'skip it', 'stop', 'pass', 'leave it', 'idk',
    'i don\'t know', 'i dont know', 'dunno', 'no thanks', 'not sure'];
  var i;
  for (i = 0; i < refusals.length; i = i + 1) {
    if (low === refusals[i]) { return false; }
  }
  return true;
}

// Stage B-3: the inline NAME-proposal control -- an editable name field +
// Accept / Reject, rendered into the panel beneath the NAME utterance. INERT
// until Accept (nothing is written before that). Styled with existing theme
// tokens via inline CSS-var references -- no new design system, no CSS file.
function mountNameProposal(proposal) {
  if (!yumiBodyEl || !proposal || !proposal.memberIds) { return; }
  var wrap = document.createElement('div');
  wrap.className = 'yumi-name-proposal';
  wrap.style.cssText = 'margin:6px 0 10px; padding:10px; border:1px solid var(--border); ' +
    'border-radius:var(--radius-md); background:var(--surface-2);';
  var field = document.createElement('input');
  field.type = 'text';
  field.value = proposal.name || '';
  field.setAttribute('aria-label', 'Sub-theory name');
  field.style.cssText = 'width:100%; box-sizing:border-box; padding:7px 9px; ' +
    'font-family:var(--font-serif); font-size:15px; color:var(--ink); ' +
    'background:var(--glass-2); border:1px solid var(--line-2); border-radius:var(--radius-sm);';
  var row = document.createElement('div');
  row.style.cssText = 'display:flex; gap:8px; margin-top:8px;';
  var accept = document.createElement('button');
  accept.type = 'button';
  accept.textContent = 'Accept';
  accept.style.cssText = 'flex:0 0 auto; padding:6px 14px; border:none; cursor:pointer; ' +
    'font-family:var(--font-body); font-size:13px; color:var(--text-on-dark); ' +
    'background:var(--grad); border-radius:var(--radius-pill);';
  var reject = document.createElement('button');
  reject.type = 'button';
  reject.textContent = 'Reject';
  reject.style.cssText = 'flex:0 0 auto; padding:6px 14px; cursor:pointer; ' +
    'font-family:var(--font-body); font-size:13px; color:var(--ink-2); ' +
    'background:transparent; border:1px solid var(--line-2); border-radius:var(--radius-pill);';
  accept.addEventListener('click', function () {
    var finalName = (field.value || '').replace(/^\s+|\s+$/g, '');
    if (finalName === '') { finalName = proposal.name || ''; }
    if (wrap.parentNode) { wrap.parentNode.removeChild(wrap); }
    var st = (typeof nameSubTheoryFromThread === 'function')
      ? nameSubTheoryFromThread(finalName, proposal.memberIds, proposal.thread, proposal.oneLineRead) : null;
    renderYumiMessage(st
      ? ('Done — I\'ve started a sub-theory, "' + finalName + '", from those notes.')
      : 'I could not start that sub-theory just now.');
  });
  reject.addEventListener('click', function () {
    if (wrap.parentNode) { wrap.parentNode.removeChild(wrap); }
    if (window.YumiBrain && YumiBrain.recordThreadDismissed) {
      YumiBrain.recordThreadDismissed(proposal.memberIds);
    }
  });
  row.appendChild(accept);
  row.appendChild(reject);
  wrap.appendChild(field);
  wrap.appendChild(row);
  yumiBodyEl.appendChild(wrap);
  yumiBodyEl.scrollTop = yumiBodyEl.scrollHeight;
}

function handleVoiceTranscript(text) {
  if (!yumiInputEl || typeof text !== 'string') { return; }
  var current = yumiInputEl.value || '';
  var trimmed = current.replace(/\s+$/, '');
  var next;
  if (trimmed === '') {
    next = text;
  } else {
    next = trimmed + ' ' + text;
  }
  yumiInputEl.value = next;
  yumiInputEl.focus();
}

function handleVoiceError(reason) {
  if (reason === 'unsupported') {
    renderError('Voice input is not available in this browser. Try Chrome or Safari.');
  } else if (reason === 'denied') {
    renderError('Microphone access blocked. Enable it in your browser settings to use voice input.');
  } else {
    renderError('Could not catch that. Try again.');
  }
}

// =====================================================================
// 6.2b: first-run Yumi greeting -- six scripted beats, NO LLM calls.
// Copy is FROZEN (comp spec); reproduced character-for-character below.
// The state machine intercepts the send handler when active: the user's
// text routes here (rendered as a user bubble) instead of YumiBrain, and
// Yumi's lines are painted client-side via renderYumiMessage. Only the
// three Q&A pairs are appended to memory (6 turns -- under the >10
// summarizer trigger). The flag is set at Beat F completion.
// =====================================================================
var ONB_A       = 'Hello. I\'m Yumi — I\'ll be reading alongside you here. Before we put anything on a shelf, I\'d like to know a little about how you read. Three questions, and there\'s no right answer to any of them.';
var ONB_Q1      = 'First — are you usually in the middle of one book at a time, or a few at once?';
var ONB_ACK     = 'Good — that tells me the shape your shelf is likely to take.';
var ONB_Q2      = 'When a line or an idea stops you mid-page — do you mark it, write it down somewhere, or let it go and keep reading?';
var ONB_FOLLOW  = 'Here, the things that stop you have a place — the notebook. Only if you want them there.';
var ONB_Q3      = 'And — what are you reading for, right now? Whatever comes to mind.';
var ONB_RECEIVE = 'Thank you. I\'ll hold onto that.';
var ONB_E1      = 'One thing before we start. Your notebook here is yours. I can see the notes you choose to attach to a book — that\'s how I stay useful — and you can check exactly what I can see whenever you like. Anything you keep in your journal stays private unless you decide otherwise.';
var ONB_E2      = 'Now — tell me one book. Something you\'re reading now, or one you mean to start.';

// Module onboarding state. beat = which input the next Send maps to:
// 'q1'|'q2'|'q3' = the three stance answers, 'book' = the Beat-E title.
// transcript holds rendered bubbles so a close/reopen resumes in place.
// onboardingStartedThisSession is the idempotency guard for the dual
// trigger (profile + books callbacks); it resets on reload, so a reload
// before completion correctly restarts at Beat A.
var onb = { active: false, beat: '', transcript: [], lastTitle: '' };
var onboardingStartedThisSession = false;

function onbYumi(text) {
  renderYumiMessage(text);
  onb.transcript.push({ who: 'yumi', text: text });
}

function onbUser(text) {
  renderUserMessage(text);
  onb.transcript.push({ who: 'user', text: text });
}

function renderOnboardingTranscript() {
  if (!yumiBodyEl) { return; }
  yumiBodyEl.innerHTML = '';
  var i;
  for (i = 0; i < onb.transcript.length; i++) {
    var t = onb.transcript[i];
    if (t.who === 'user') {
      renderUserMessage(t.text);
    } else {
      renderYumiMessage(t.text);
    }
  }
  yumiBodyEl.scrollTop = yumiBodyEl.scrollHeight;
}

// Open the panel into Beat A WITHOUT the rotating empty-state line. Also
// the exported test entry point (ungated); maybeStartOnboarding calls it
// after the gate passes.
function startOnboarding() {
  onboardingStartedThisSession = true;
  onb.active = true;
  onb.beat = 'q1';
  onb.transcript = [];
  onb.lastTitle = '';
  if (!yumiPanelEl) { renderYumiPanel(); }
  sv('praxis_yumi_open', true);
  if (yumiPanelEl) { yumiPanelEl.classList.add('yumi-panel-open'); }
  if (yumiBodyEl) { yumiBodyEl.innerHTML = ''; }
  onbYumi(ONB_A);
  onbYumi(ONB_Q1);
  if (yumiInputEl) { yumiInputEl.focus(); }
}

// Advance on a trimmed, non-empty answer. appendTurn ONLY the three Q&A
// pairs so Yumi's memory carries the reading stance; the greeting, acks,
// transparency, and close are never appended.
function advanceOnboarding(text) {
  if (onb.beat === 'q1') {
    if (typeof appendTurn === 'function') {
      appendTurn('assistant', ONB_Q1);
      appendTurn('user', text);
    }
    onbYumi(ONB_ACK);
    onbYumi(ONB_Q2);
    onb.beat = 'q2';
  } else if (onb.beat === 'q2') {
    if (typeof appendTurn === 'function') {
      appendTurn('assistant', ONB_Q2);
      appendTurn('user', text);
    }
    onbYumi(ONB_FOLLOW);
    onbYumi(ONB_Q3);
    onb.beat = 'q3';
  } else if (onb.beat === 'q3') {
    if (typeof appendTurn === 'function') {
      appendTurn('assistant', ONB_Q3);
      appendTurn('user', text);
    }
    onbYumi(ONB_RECEIVE);
    onbYumi(ONB_E1);
    onbYumi(ONB_E2);
    onb.beat = 'book';
  } else if (onb.beat === 'book') {
    finishOnboarding(text);
  }
}

// Beat E placement + Beat F close. Route to #books FIRST so the existing
// bulk path's trailing renderShelf paints the correct surface (the shelf
// host is #app; rendering it while on #home would clobber home). The Yumi
// panel is body-level, so it survives the route render. Title echoes the
// user's trimmed input (plain -- the renderer is textContent-only, so the
// frozen *italics* render plain with the asterisks dropped). Flag is set
// and persisted only here, at completion.
function finishOnboarding(title) {
  onb.lastTitle = title;
  if (location.hash !== '#books') {
    location.hash = '#books';
  }
  if (typeof processBulkLines === 'function') {
    processBulkLines(title);
  }
  onbYumi(title + ' is on your Reading shelf.');
  onbYumi('Then I\'ll leave you to it — ' + title + ' is waiting whenever you are.');
  var u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  if (u && u.uid && typeof setProfile === 'function') {
    setProfile(u.uid, { onboardingSeen: true });
    if (typeof saveProfileToFirestore === 'function') {
      saveProfileToFirestore(u.uid, getProfile(u.uid), function () {});
    }
  }
  onb.active = false;
  onb.beat = 'done';
}

// Gated entry, called by the profile + books auth callbacks. Idempotent
// (the session guard + the active check), so the dual trigger fires the
// greeting at most once. Gate: signed-in AND empty shelf AND flag unset.
function maybeStartOnboarding(uid) {
  if (onboardingStartedThisSession || onb.active) { return; }
  var u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  if (!u || !u.uid || u.uid !== uid) { return; }
  if (!state.userBooks[uid] || state.userBooks[uid].bookIds.length !== 0) { return; }
  if (getProfile(uid).onboardingSeen === true) { return; }
  // 6.2c: do not auto-open the greeting onto an arc surface (it would park the
  // panel over the constellation -- see isArcRoute / suppressYumiOnArc above).
  if (isArcRoute()) { return; }
  startOnboarding();
}

// 6.2b.1: repaint the body-level Yumi panel on an auth change. A route
// repaint never touches the panel, so without this a stale onboarding
// transcript can survive an in-app re-auth. force=true (sign-out) is a
// definitive end-of-session: abandon any in-progress onboarding and reset
// the session-start guard so a half-finished transcript never survives
// for the next user and a later sign-in begins clean. Without force
// (sign-in) it is a no-op while onboarding is active, so a freshly-started
// Beat A is not stomped. Either way the panel resets to idle (empty-state
// when open, cleared when closed).
function refreshYumiPanelForAuthChange(force) {
  if (force) {
    onb.active = false;
    onb.beat = '';
    onboardingStartedThisSession = false;
  } else if (onb.active) {
    return;
  }
  if (!yumiBodyEl) { return; }
  if (isYumiPanelOpen()) {
    renderYumiEmptyState();
  } else {
    yumiBodyEl.innerHTML = '';
  }
}

// S2: the contextual line under Bloom, keyed off parts[0] of the hash.
// Copy is in Yumi's voice and inside the covenant -- it never implies she
// reads private notes or summarizes a book. PLACEHOLDERS -- Preston finalizes.
var YUMI_BLOOM_LINES = {
  home:      'tap to see what I\'m noticing',
  books:     'tap to find lenses in your library',
  book:      'tap to sit with this book together',
  artifact:  'tap to sit with this book together',
  arcs:      'tap to trace threads between your arcs',
  arc:       'tap to think this through with me',
  subtheory: 'tap to think this through with me',
  notebook:  'I\'m here when you want to talk it through'
};
var YUMI_BLOOM_LINE_DEFAULT = 'tap to talk';

function yumiBloomLineFor(route) {
  if (route && Object.prototype.hasOwnProperty.call(YUMI_BLOOM_LINES, route)) {
    return YUMI_BLOOM_LINES[route];
  }
  return YUMI_BLOOM_LINE_DEFAULT;
}

// Read parts[0] of the hash (the route family, e.g. 'book' for #book/<id>)
// and paint the matching line. Account / yumi-sees / empty / unknown fall
// through to the safe default.
function updateYumiBloomLine() {
  if (!yumiBloomLineEl) { return; }
  var rest = location.hash.replace(/^#/, '');
  var route = rest.split('/')[0];
  yumiBloomLineEl.textContent = yumiBloomLineFor(route);
}

// Build a Bloom. Default = the global FAB launcher (body-level, z-9999). When
// inPanel is true, build the stateful in-chat presence that lives in the panel
// head (decorative -- no launcher line, no toggle click); setBloomState drives
// it. Both share this one SVG so the mark stays identical; a per-instance
// gradient-id prefix (the FAB keeps the original ids) avoids duplicate element
// ids. The hidden overlay layers (pulse/ripple/swirl/comet) stay inert until a
// yumi-bloom--<state> class activates them; resting = the base motion.
function buildYumiBloom(inPanel) {
  var btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  if (inPanel) {
    btn.id = YUMI_PANEL_BLOOM_ID;
    btn.className = 'yumi-bloom yumi-bloom--in-panel';
    btn.setAttribute('aria-hidden', 'true');
    btn.setAttribute('tabindex', '-1');
  } else {
    btn.id = YUMI_BLOOM_ID;
    btn.className = 'yumi-bloom';
    btn.setAttribute('aria-label', 'Talk to Yumi');
  }
  // Petal-rays: eight amber ellipses radiating from Bloom's centre (32,32),
  // each rotated around it. CSS spins the group slowly (yumi-bloom-spin).
  var petals = '';
  var pa;
  for (pa = 0; pa < 360; pa = pa + 45) {
    petals = petals +
      '<ellipse cx="32" cy="15" rx="3.4" ry="9.6" transform="rotate(' + pa + ' 32 32)"/>';
  }
  // Bloom sits on the warm surface -- NO dark vessel. Legibility comes from
  // her internal range (white-hot core -> amber petals) + warm halo + motion.
  // Token colours go straight into fill/stop-color attributes, matching the
  // constellation's SVG pattern (arc-constellation.js:597-601, 938-942).
  var pfx = inPanel ? 'yumi-bloom-p' : 'yumi-bloom';
  var svg =
    '<svg viewBox="0 0 64 64" width="56" height="56" role="img" focusable="false">' +
    '<defs>' +
    '<radialGradient id="' + pfx + '-core" cx="50%" cy="50%" r="50%">' +
    '<stop offset="0%" stop-color="var(--text-on-dark)"/>' +
    '<stop offset="42%" stop-color="var(--gold-light)"/>' +
    '<stop offset="100%" stop-color="var(--gold)"/>' +
    '</radialGradient>' +
    '<radialGradient id="' + pfx + '-petal" cx="50%" cy="28%" r="72%">' +
    '<stop offset="0%" stop-color="var(--tradition-wisdom-halo)"/>' +
    '<stop offset="58%" stop-color="var(--gold-light)"/>' +
    '<stop offset="100%" stop-color="var(--gold)"/>' +
    '</radialGradient>' +
    '<radialGradient id="' + pfx + '-halo" cx="50%" cy="50%" r="50%">' +
    '<stop offset="0%" stop-color="var(--tradition-theory-halo)" stop-opacity="0.55"/>' +
    '<stop offset="55%" stop-color="var(--tradition-empirical-halo)" stop-opacity="0.20"/>' +
    '<stop offset="100%" stop-color="var(--tradition-empirical-halo)" stop-opacity="0"/>' +
    '</radialGradient>' +
    '</defs>' +
    '<circle class="yumi-bloom-halo" cx="32" cy="32" r="31" fill="url(#' + pfx + '-halo)"/>' +
    // alive: outward pulse rings (speaking)
    '<g class="bloom-pulse" fill="none" stroke="var(--gold-light)" stroke-width="1.4">' +
    '<circle cx="32" cy="32" r="13"/><circle cx="32" cy="32" r="13"/></g>' +
    // alive: inward ripple rings (listening)
    '<g class="bloom-ripple" fill="none" stroke="var(--marginalia-color)" stroke-width="1.3" opacity="0.9">' +
    '<circle cx="32" cy="32" r="14"/><circle cx="32" cy="32" r="14"/><circle cx="32" cy="32" r="14"/></g>' +
    // alive: swirl arc (thinking)
    '<g class="bloom-swirl"><circle cx="32" cy="32" r="20" fill="none" stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="10 86" stroke-linecap="round" opacity="0.85"/></g>' +
    '<g class="yumi-bloom-petals" fill="url(#' + pfx + '-petal)" opacity="0.9">' +
    petals +
    '</g>' +
    '<g class="yumi-bloom-core">' +
    '<circle cx="32" cy="32" r="9" fill="url(#' + pfx + '-core)"/>' +
    '<circle cx="32" cy="32" r="3.4" fill="var(--text-on-dark)" opacity="0.92"/>' +
    '</g>' +
    // alive: directed comet (acting)
    '<g class="bloom-comet"><circle cx="40" cy="24" r="2.4" fill="var(--text-on-dark)"/>' +
    '<ellipse cx="35" cy="29" rx="6" ry="1.6" fill="var(--gold-light)" opacity="0.7" transform="rotate(-45 35 29)"/></g>' +
    '<circle class="yumi-bloom-ember yumi-bloom-ember-a" cx="49" cy="17" r="1.7" fill="var(--gold-light)"/>' +
    '<circle class="yumi-bloom-ember yumi-bloom-ember-b" cx="15" cy="47" r="1.4" fill="var(--gold-light)"/>' +
    '</svg>';
  btn.innerHTML =
    '<span class="yumi-bloom-orb" aria-hidden="true">' + svg + '</span>' +
    (inPanel ? '' : '<span class="yumi-bloom-line">tap to talk</span>');
  if (!inPanel) {
    yumiBloomLineEl = btn.querySelector('.yumi-bloom-line');
    updateYumiBloomLine();
    btn.addEventListener('click', function() {
      toggleYumiPanel();
    });
  }
  return btn;
}

// Bloom presence state. Toggles a single yumi-bloom--<state> class on the
// in-chat Bloom (the body FAB stays at rest). 'resting' clears the class (base
// motion). thinking couples to the in-flight request (the typing-indicator
// signal); listening/speaking are driven by the voice stages; acting is fired
// by the command lane (Prompt 3). CSS owns every state's motion.
var YUMI_BLOOM_STATES = ['listening', 'thinking', 'speaking', 'acting'];
function setBloomState(state) {
  if (!yumiPanelBloomEl) { return; }
  var i;
  for (i = 0; i < YUMI_BLOOM_STATES.length; i++) {
    yumiPanelBloomEl.classList.remove('yumi-bloom--' + YUMI_BLOOM_STATES[i]);
  }
  if (state && state !== 'resting') {
    yumiPanelBloomEl.classList.add('yumi-bloom--' + state);
  }
}

function buildYumiPanel() {
  var panel = document.createElement('div');
  panel.id = YUMI_PANEL_ID;
  panel.className = 'yumi-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Yumi');

  var header = document.createElement('div');
  header.className = 'yumi-panel-head';

  // The crest slot now hosts the stateful in-chat Bloom (the living presence),
  // subsuming the former static glyph. setBloomState drives it; resting is the
  // default. Sized to the crest in CSS (.yumi-panel-head #panel-crest .yumi-bloom).
  var crest = document.createElement('span');
  crest.id = 'panel-crest';
  crest.setAttribute('aria-hidden', 'true');
  yumiPanelBloomEl = buildYumiBloom(true);
  crest.appendChild(yumiPanelBloomEl);
  header.appendChild(crest);

  var titleBlock = document.createElement('div');
  var title = document.createElement('div');
  title.className = 'yumi-panel-title';
  title.textContent = 'Yumi';
  titleBlock.appendChild(title);
  var sub = document.createElement('div');
  sub.className = 'yumi-panel-sub';
  sub.textContent = '由美 · reasoned beauty';
  titleBlock.appendChild(sub);
  header.appendChild(titleBlock);

  // "What Yumi sees" -- folds the shared transparency view INTO the panel
  // (mock), shown OVER the body so the conversation is preserved underneath;
  // falls back to the #yumi-sees page if the builder is unavailable. (Decision
  // logged in the forensic block.) Wiring lives after the body is built.
  var sightBtn = document.createElement('button');
  sightBtn.type = 'button';
  sightBtn.className = 'yumi-panel-sight';
  sightBtn.textContent = 'What Yumi sees';
  header.appendChild(sightBtn);

  var closeBtn = document.createElement('button');
  closeBtn.className = 'yumi-panel-close';
  closeBtn.setAttribute('type', 'button');
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', function() {
    closeYumiPanel();
  });
  header.appendChild(closeBtn);
  panel.appendChild(header);

  var body = document.createElement('div');
  body.id = YUMI_BODY_ID;
  body.className = 'yumi-panel-body';
  panel.appendChild(body);
  yumiBodyEl = body;

  // In-panel "What Yumi sees" view (the mock fold): an overlay built from the
  // SAME buildTransparencyContent the #yumi-sees page uses, shown OVER the body
  // so the conversation is PRESERVED (hidden, not cleared). Back returns to chat.
  var sightView = document.createElement('div');
  sightView.className = 'yumi-panel-sight-view';
  sightView.style.display = 'none';
  panel.appendChild(sightView);
  function closeSightView() {
    sightView.style.display = 'none';
    sightView.innerHTML = '';
    body.style.display = '';
  }
  sightBtn.addEventListener('click', function() {
    if (typeof buildTransparencyContent !== 'function' ||
        !(window.YumiBrain && YumiBrain.getContextSnapshot)) {
      location.hash = 'yumi-sees';
      return;
    }
    sightView.innerHTML = '';
    var sightBack = document.createElement('button');
    sightBack.type = 'button';
    sightBack.className = 'yumi-panel-sight-back';
    sightBack.textContent = '← Back to chat';
    sightBack.addEventListener('click', closeSightView);
    sightView.appendChild(sightBack);
    sightView.appendChild(buildTransparencyContent(YumiBrain.getContextSnapshot(), 'panel'));
    body.style.display = 'none';
    sightView.style.display = '';
  });

  var row = document.createElement('div');
  row.className = 'yumi-panel-input';

  var label = document.createElement('label');
  label.setAttribute('for', YUMI_INPUT_ID);
  label.className = 'yumi-visually-hidden';
  label.textContent = 'Message Yumi';
  row.appendChild(label);

  var input = document.createElement('input');
  input.id = YUMI_INPUT_ID;
  input.type = 'text';
  input.className = 'yumi-input';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('placeholder', 'Say something to Yumi…');
  row.appendChild(input);
  yumiInputEl = input;

  var micBtn = document.createElement('button');
  micBtn.className = 'yumi-mic-btn yumi-icon-btn';
  micBtn.setAttribute('type', 'button');
  micBtn.setAttribute('aria-label', 'Voice input');
  micBtn.innerHTML =
    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">' +
    '<path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/>' +
    '</svg>';
  yumiMicBtnEl = micBtn;
  row.appendChild(micBtn);
  if (window.VoiceInput) {
    window.VoiceInput.attachMicButton(micBtn, {
      onTranscript: handleVoiceTranscript,
      onError:      handleVoiceError
    });
  }

  var sendBtn = document.createElement('button');
  sendBtn.className = 'yumi-send-btn yumi-icon-btn yumi-send';
  sendBtn.setAttribute('type', 'button');
  sendBtn.setAttribute('aria-label', 'Send message');
  sendBtn.textContent = '↑';
  yumiSendBtnEl = sendBtn;
  sendBtn.addEventListener('click', function () {
    if (yumi_request_in_flight) { return; }
    var raw = yumiInputEl ? yumiInputEl.value : '';
    var trimmed = raw.replace(/^\s+|\s+$/g, '');
    if (trimmed === '') { return; }

    if (yumiBodyEl) {
      var emptyEl = yumiBodyEl.querySelector('.yumi-empty');
      if (emptyEl && emptyEl.parentNode) {
        emptyEl.parentNode.removeChild(emptyEl);
      }
    }

    // 6.2b: when onboarding is active, the answer drives the scripted
    // state machine instead of YumiBrain -- no fetch, no typing indicator.
    // Empty input is already filtered above, so it never advances a beat.
    if (onb.active) {
      if (yumiInputEl) { yumiInputEl.value = ''; }
      onbUser(trimmed);
      advanceOnboarding(trimmed);
      return;
    }

    renderUserMessage(trimmed);
    if (yumiInputEl) { yumiInputEl.value = ''; }

    // Stage B-2.2: co-write interception, BEFORE sendMessage. If a complicate
    // is pending, the next panel reply is consumed EITHER WAY. Substantive
    // engagement weaves into THAT note (+ a fixed claim-free ack, no LLM) and
    // does NOT call sendMessage; a short question-back / refusal falls through
    // to the normal chat path below (no weave, no ack). Pending is cleared
    // either way (consumed). The onboarding branch above is the precedent.
    if (window.YumiBrain && YumiBrain.pendingComplicate) {
      var _pc = YumiBrain.pendingComplicate();
      if (_pc && _pc.entryId) {
        YumiBrain.clearPendingComplicate();
        if (isSubstantiveReflection(trimmed)) {
          if (typeof integrateReflection === 'function') {
            integrateReflection(_pc.entryId, trimmed);
          }
          renderYumiMessage('Thank you — I\'ve folded that into your note.');
          return;
        }
      }
    }

    // Stage B-3: NAME interception, also BEFORE sendMessage (mutually exclusive
    // with the co-write -- only one pending slot is ever set). If a NOTICE is
    // pending, the reply runs NAME (async, 2 proxy calls). A gated proposal
    // surfaces with the inline editable Accept/Reject control and does NOT call
    // sendMessage; a rejection/deflection dismisses the thread (recorded in
    // considerName) and FALLS THROUGH to a normal chat reply. Consumed either way.
    if (window.YumiBrain && YumiBrain.pendingNotice) {
      var _pn = YumiBrain.pendingNotice();
      if (_pn && _pn.memberIds) {
        YumiBrain.clearPendingNotice();
        yumi_request_in_flight = true;
        if (yumiSendBtnEl) { yumiSendBtnEl.disabled = true; }
        renderTypingIndicator();
        YumiBrain.considerName(_pn, trimmed).then(function (r) {
          if (r && r.surface) {
            removeTypingIndicator();
            renderYumiMessage(r.text);
            mountNameProposal(r.proposal);
            yumi_request_in_flight = false;
            if (yumiSendBtnEl) { yumiSendBtnEl.disabled = false; }
            return;
          }
          // none / gate-fail -> normal chat (the dismissal is recorded in considerName)
          return window.YumiBrain.sendMessage(trimmed).then(function (result) {
            removeTypingIndicator();
            if (!(result && result.silent)) { renderYumiMessage(result.text); }
            yumi_request_in_flight = false;
            if (yumiSendBtnEl) { yumiSendBtnEl.disabled = false; }
          });
        }).then(null, function (err) {
          console.error('[yumi] considerName failed', err);
          removeTypingIndicator();
          renderError();
          yumi_request_in_flight = false;
          if (yumiSendBtnEl) { yumiSendBtnEl.disabled = false; }
        });
        return;
      }
    }

    yumi_request_in_flight = true;
    if (yumiSendBtnEl) { yumiSendBtnEl.disabled = true; }
    renderTypingIndicator();

    window.YumiBrain.sendMessage(trimmed).then(function (result) {
      removeTypingIndicator();
      // Fail-closed gate: a suppressed utterance renders nothing -- no
      // error, no fallback line, no chrome. Yumi simply stays silent.
      if (result && result.silent) { return; }
      renderYumiMessage(result.text);
    }).catch(function (err) {
      console.error('[yumi] sendMessage failed', err);
      removeTypingIndicator();
      renderError();
    }).finally(function () {
      yumi_request_in_flight = false;
      if (yumiSendBtnEl) { yumiSendBtnEl.disabled = false; }
    });
  });
  row.appendChild(sendBtn);

  // R#3: Enter sends, mirroring the Send button. Single-line <input>, so no
  // newline to preserve; .click() reuses the button's in-flight/empty/onboarding guards.
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (yumiSendBtnEl) { yumiSendBtnEl.click(); }
    }
  });

  panel.appendChild(row);
  return panel;
}

function renderYumiPanel() {
  if (!yumiBloomEl) {
    yumiBloomEl = buildYumiBloom();
    document.body.appendChild(yumiBloomEl);
  }
  if (!yumiPanelEl) {
    yumiPanelEl = buildYumiPanel();
    document.body.appendChild(yumiPanelEl);
  }
  if (isYumiPanelOpen() && !isArcRoute()) {
    yumiPanelEl.classList.add('yumi-panel-open');
    renderYumiEmptyState();
  } else {
    yumiPanelEl.classList.remove('yumi-panel-open');
  }
}

function openYumiPanel() {
  if (!yumiPanelEl) { renderYumiPanel(); }
  sv('praxis_yumi_open', true);
  yumiPanelEl.classList.add('yumi-panel-open');
  // 6.2b: if onboarding is mid-flow, resume by re-rendering its transcript
  // instead of the rotating empty-state line (which would wipe the beats).
  if (onb.active) {
    renderOnboardingTranscript();
  } else {
    renderYumiEmptyState();
  }
  if (yumiInputEl) {
    yumiInputEl.focus();
  }
}

function closeYumiPanel() {
  sv('praxis_yumi_open', false);
  if (yumiPanelEl) {
    yumiPanelEl.classList.remove('yumi-panel-open');
  }
}

function toggleYumiPanel() {
  // 6.2c: key off the VISIBLE state, not the persisted flag. On an arc the
  // panel is suppressed (class stripped) while the flag may still read open;
  // a flag-based toggle would "close" an already-hidden panel (a dead first
  // click). The class is the source of truth for what the user actually sees.
  var visiblyOpen = !!(yumiPanelEl && yumiPanelEl.classList.contains('yumi-panel-open'));
  if (visiblyOpen) {
    closeYumiPanel();
  } else {
    openYumiPanel();
  }
}

// Stage B-1: the VISIBLE open state -- the panel's open marker, not the
// persisted praxis_yumi_open flag (which reads open even when the marker is
// stripped on an arc route). The Yumi-moves orchestrator surfaces only when
// this is true.
function isYumiPanelVisiblyOpen() {
  return !!(yumiPanelEl && yumiPanelEl.classList &&
            yumiPanelEl.classList.contains('yumi-panel-open'));
}

function isYumiKeyboardEventEligible(e) {
  // Allow shortcut from inside the Yumi panel (so the user can close
  // it while focused in its own input). Block when focus is in any
  // other text input, textarea, select, or contenteditable surface
  // outside the panel -- those should keep their typing semantics.
  var target = e.target;
  if (!target) { return true; }
  if (yumiPanelEl && yumiPanelEl.contains(target)) { return true; }
  var tag = target.tagName ? target.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    return false;
  }
  if (target.isContentEditable) { return false; }
  return true;
}

function onYumiKeydown(e) {
  if (!(e.metaKey || e.ctrlKey)) { return; }
  var key = (e.key || '').toLowerCase();
  if (key !== 'j') { return; }
  if (!isYumiKeyboardEventEligible(e)) { return; }
  e.preventDefault();
  toggleYumiPanel();
}

function initYumiUI() {
  renderYumiPanel();
  document.addEventListener('keydown', onYumiKeydown);
  // 6.2c: close the panel when navigating into an arc, so an open Yumi carried
  // in from a prior page never parks over the constellation.
  window.addEventListener('hashchange', suppressYumiOnArc);
  // S2: keep Bloom's contextual line in sync with the active route.
  window.addEventListener('hashchange', updateYumiBloomLine);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initYumiUI);
} else {
  initYumiUI();
}

window.YumiUI = {
  render:               renderYumiPanel,
  open:                 openYumiPanel,
  close:                closeYumiPanel,
  toggle:               toggleYumiPanel,
  isOpen:               isYumiPanelOpen,
  visiblyOpen:          isYumiPanelVisiblyOpen,
  greetings:            YUMI_GREETINGS,
  // 6.2b: maybeStartOnboarding is the gated entry called by the auth
  // callbacks; startOnboarding is the ungated beginner (also the Phase C
  // verification entry point).
  maybeStartOnboarding: maybeStartOnboarding,
  startOnboarding:      startOnboarding,
  // 6.2b.1: called by the auth callbacks to keep the body-level panel from
  // showing a stale onboarding transcript across an in-app re-auth.
  refreshPanelForAuth:  refreshYumiPanelForAuthChange
};

// =====================================================================
// LENS PANEL (S4) -- opened by the shelf's "Ask Yumi for more lenses".
// Yumi at the head, the user's hand-made lenses as cards (Rename / Not
// this), an "or name one yourself" input (reuses createUserTheme), and the
// covenant line. AI-PROPOSED lenses are a feature-flagged STUB (default
// off) -- live generation is the gated SEC follow-on. Esc / backdrop /
// close dismiss; focus is saved on open and restored on close.
// =====================================================================
var LENS_PANEL_ID    = 'lens-panel';
var lensPanelEl      = null;
var lensPanelBodyEl  = null;
var lensPanelLastFocus = null;

// Feature flag for Yumi's AI lens suggestions. Default OFF -- the live
// model proposing lenses is the gated follow-on (needs Stage SEC + authored
// prompts + an eval rubric), out of scope here.
// S3 lens-gen suggestion state machine. status drives the suggested-lens
// area; lenses are the surviving proposals (each tagged _pid for dispose/
// adopt); meta carries titleToId for matching adopted titles to book ids.
var lensSuggestStatus = 'idle';   // 'idle' | 'loading' | 'done' | 'error'
var lensSuggestLenses = [];
var lensSuggestMeta = null;

function lensAiSuggestionsEnabled() {
  // S3 (lens-gen ship): default ON. A user can still disable it by storing
  // praxis_lens_ai_suggestions = false.
  return ls('praxis_lens_ai_suggestions', true) === true;
}

// Fire the one-shot generation: gather metadata, call YumiBrain.generateLenses,
// run survivors through YumiBrain.evalLensResponse, store them. Re-renders the
// panel body on resolve. Never throws into the UI -- a proxy/parse failure
// lands in the 'error' state, which renders a graceful retry.
function startLensSuggest() {
  if (!window.YumiBrain || typeof window.YumiBrain.generateLenses !== 'function' ||
      typeof window.YumiBrain.evalLensResponse !== 'function') {
    lensSuggestStatus = 'error';
    return;
  }
  lensSuggestStatus = 'loading';
  var meta = window.YumiBrain.gatherLensMetadata();
  lensSuggestMeta = meta;
  var titles = [];
  var i;
  for (i = 0; i < meta.books.length; i++) { titles.push(meta.books[i].title); }
  window.YumiBrain.generateLenses(meta).then(function (raw) {
    var lenses = window.YumiBrain.evalLensResponse(raw, titles);
    var k;
    for (k = 0; k < lenses.length; k++) { lenses[k]._pid = 'plens_' + k; }
    lensSuggestLenses = lenses;
    lensSuggestStatus = 'done';
    renderLensPanelBody();
  }, function (err) {
    lensSuggestStatus = 'error';
    renderLensPanelBody();
  });
}

function lensSuggestFindByPid(pid) {
  var i;
  for (i = 0; i < lensSuggestLenses.length; i++) {
    if (lensSuggestLenses[i]._pid === pid) { return i; }
  }
  return -1;
}

// "Name it": adopt a proposal as a real lens via the existing write path --
// createUserTheme(name) + assignBookToTheme for each gathered title that maps
// to a real book id. Removes the proposal, refreshes panel + rail.
function lensSuggestAdopt(pid) {
  var ix = lensSuggestFindByPid(pid);
  if (ix === -1) { return; }
  var lens = lensSuggestLenses[ix];
  if (typeof createUserTheme !== 'function') { return; }
  var theme = createUserTheme(lens.name);
  if (theme && typeof assignBookToTheme === 'function' &&
      lensSuggestMeta && lensSuggestMeta.titleToId) {
    var i;
    for (i = 0; i < lens.books.length; i++) {
      var norm = lens.books[i].toLowerCase().replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
      var bid = lensSuggestMeta.titleToId[norm];
      if (bid) { assignBookToTheme(theme.id, bid); }
    }
  }
  lensSuggestLenses.splice(ix, 1);
  lensPanelRefresh();
}

function lensSuggestDismiss(pid) {
  var ix = lensSuggestFindByPid(pid);
  if (ix === -1) { return; }
  lensSuggestLenses.splice(ix, 1);
  renderLensPanelBody();
}

// "Rename": inline-edit a proposal's name before adopting it.
function lensSuggestRename(pid) {
  if (!lensPanelBodyEl) { return; }
  var ix = lensSuggestFindByPid(pid);
  if (ix === -1) { return; }
  var card = lensPanelBodyEl.querySelector('[data-pid="' + pid + '"]');
  if (!card) { return; }
  var nameEl = card.querySelector('.lens-card-name');
  if (!nameEl) { return; }
  nameEl.innerHTML = '';
  var inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'lens-card-rename-input';
  inp.value = lensSuggestLenses[ix].name;
  inp.setAttribute('autocomplete', 'off');
  nameEl.appendChild(inp);
  function commit() {
    var v = inp.value.replace(/^\s+|\s+$/g, '');
    if (v !== '') { lensSuggestLenses[ix].name = v; }
    renderLensPanelBody();
  }
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { e.stopPropagation(); renderLensPanelBody(); }
  });
  inp.addEventListener('blur', commit);
  inp.focus();
  inp.select();
}

function buildLensSuggestRetry() {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'shelf-lens-ask lens-suggest-retry';
  btn.textContent = 'Ask Yumi again';
  btn.addEventListener('click', function () {
    lensSuggestStatus = 'idle';
    lensSuggestLenses = [];
    renderLensPanelBody();
  });
  return btn;
}

function buildProposedLensCard(lens) {
  var card = document.createElement('div');
  card.className = 'lens-card lens-card-proposed';
  card.setAttribute('data-pid', lens._pid);

  var main = document.createElement('div');
  main.className = 'lens-card-main';
  var name = document.createElement('span');
  name.className = 'lens-card-name';
  // S4: the shared crest marks this card as proposed by Yumi (one source).
  name.appendChild(yumiGlyphNode(16, 'yumi-glyph-lead'));
  name.appendChild(document.createTextNode(lens.name));
  main.appendChild(name);
  var why = document.createElement('span');
  why.className = 'lens-card-why';
  why.textContent = lens.why;
  main.appendChild(why);
  var books = document.createElement('span');
  books.className = 'lens-card-books';
  books.textContent = lens.books.join(' · ');
  main.appendChild(books);
  card.appendChild(main);

  var actions = document.createElement('div');
  actions.className = 'lens-card-actions lens-card-actions-proposed';
  var nameIt = document.createElement('button');
  nameIt.type = 'button';
  nameIt.className = 'lens-card-action lens-card-action-adopt';
  nameIt.textContent = 'Name it';
  nameIt.addEventListener('click', function () { lensSuggestAdopt(lens._pid); });
  actions.appendChild(nameIt);
  var renameIt = document.createElement('button');
  renameIt.type = 'button';
  renameIt.className = 'lens-card-action';
  renameIt.textContent = 'Rename';
  renameIt.addEventListener('click', function () { lensSuggestRename(lens._pid); });
  actions.appendChild(renameIt);
  var notThis = document.createElement('button');
  notThis.type = 'button';
  notThis.className = 'lens-card-action lens-card-action-drop';
  notThis.textContent = 'Not this';
  notThis.addEventListener('click', function () { lensSuggestDismiss(lens._pid); });
  actions.appendChild(notThis);
  card.appendChild(actions);
  return card;
}

// The signed-in user's hand-made lenses (userThemes), name-sorted.
function lensPanelUserThemes() {
  var u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  var out = [];
  if (u && u.uid && state.userThemes) {
    var k;
    for (k in state.userThemes) {
      if (Object.prototype.hasOwnProperty.call(state.userThemes, k) &&
          state.userThemes[k] && state.userThemes[k].userId === u.uid) {
        out.push(state.userThemes[k]);
      }
    }
  }
  out.sort(function (a, b) { return (a.name || '').localeCompare(b.name || ''); });
  return out;
}

function buildLensCard(theme) {
  var card = document.createElement('div');
  card.className = 'lens-card';
  card.setAttribute('data-lens-id', theme.id);

  var main = document.createElement('div');
  main.className = 'lens-card-main';
  var name = document.createElement('span');
  name.className = 'lens-card-name';
  // S5: the shared crest sits in the kept-lens icon slot (one source).
  name.appendChild(yumiGlyphNode(16, 'yumi-glyph-lead'));
  name.appendChild(document.createTextNode(theme.name));
  main.appendChild(name);
  var meta = document.createElement('span');
  meta.className = 'lens-card-meta';
  var n = Array.isArray(theme.bookIds) ? theme.bookIds.length : 0;
  meta.textContent = n + (n === 1 ? ' book' : ' books');
  main.appendChild(meta);
  card.appendChild(main);

  var actions = document.createElement('div');
  actions.className = 'lens-card-actions';
  var renameBtn = document.createElement('button');
  renameBtn.type = 'button';
  renameBtn.className = 'lens-card-action';
  renameBtn.textContent = 'Rename';
  renameBtn.addEventListener('click', function () { lensCardRename(theme.id); });
  actions.appendChild(renameBtn);
  var dropBtn = document.createElement('button');
  dropBtn.type = 'button';
  dropBtn.className = 'lens-card-action lens-card-action-drop';
  dropBtn.textContent = 'Not this';
  dropBtn.addEventListener('click', function () {
    if (typeof deleteUserTheme === 'function' && deleteUserTheme(theme.id)) {
      lensPanelRefresh();
    }
  });
  actions.appendChild(dropBtn);
  card.appendChild(actions);
  return card;
}

// Inline rename: swap the card for an input + Save. Enter commits, Escape
// cancels (and is stopped from bubbling to the panel's Escape-to-close).
function lensCardRename(themeId) {
  if (!lensPanelBodyEl) { return; }
  var card = lensPanelBodyEl.querySelector('[data-lens-id="' + themeId + '"]');
  var theme = state.userThemes && state.userThemes[themeId];
  if (!card || !theme) { return; }
  card.innerHTML = '';
  var inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'lens-card-rename-input';
  inp.value = theme.name;
  inp.setAttribute('autocomplete', 'off');
  card.appendChild(inp);
  var save = document.createElement('button');
  save.type = 'button';
  save.className = 'lens-card-action';
  save.textContent = 'Save';
  function commit() {
    if (typeof renameUserTheme === 'function') { renameUserTheme(themeId, inp.value); }
    lensPanelRefresh();
  }
  save.addEventListener('click', commit);
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { e.stopPropagation(); lensPanelRefresh(); }
  });
  card.appendChild(save);
  inp.focus();
  inp.select();
}

// Re-render the panel body and, if the shelf is the current route, refresh
// its Lenses rail so a create/rename/delete shows immediately.
function lensPanelRefresh() {
  renderLensPanelBody();
  var route = location.hash.replace(/^#/, '').split('/')[0];
  if (route === 'books' && typeof renderShelf === 'function') {
    renderShelf();
  }
}

function renderLensPanelBody() {
  if (!lensPanelBodyEl) { return; }
  lensPanelBodyEl.innerHTML = '';

  // Suggested (AI) lenses -- live when the flag is on (default on, S3). The
  // first render of an open kicks off the one-shot generation; the body
  // re-renders on resolve. Adopt/rename/dismiss operate on the survivors.
  var sug = document.createElement('div');
  sug.className = 'lens-panel-section';
  var sugLabel = document.createElement('div');
  sugLabel.className = 'lens-panel-section-label';
  sugLabel.textContent = 'Yumi’s suggestions';
  sug.appendChild(sugLabel);
  if (!lensAiSuggestionsEnabled()) {
    var off = document.createElement('p');
    off.className = 'lens-panel-stub';
    off.textContent = 'Yumi’s lens suggestions are off. Name your own below.';
    sug.appendChild(off);
  } else {
    if (lensSuggestStatus === 'idle') { startLensSuggest(); }
    if (lensSuggestStatus === 'loading') {
      var loading = document.createElement('p');
      loading.className = 'lens-panel-stub lens-suggest-loading';
      // S3: the shared crest pulses (reduced-motion-safe) beside the line
      // while generateLenses is in flight; the resolve re-render drops it.
      loading.appendChild(yumiGlyphNode(20, 'yumi-glyph-lead yumi-glyph-pulse'));
      loading.appendChild(document.createTextNode('Reading across your shelf…'));
      sug.appendChild(loading);
    } else if (lensSuggestStatus === 'error') {
      var errp = document.createElement('p');
      errp.className = 'lens-panel-stub';
      errp.textContent = 'Yumi couldn’t reach for lenses just now.';
      sug.appendChild(errp);
      sug.appendChild(buildLensSuggestRetry());
    } else if (lensSuggestStatus === 'done') {
      if (lensSuggestLenses.length === 0) {
        var emptyp = document.createElement('p');
        emptyp.className = 'lens-panel-stub';
        emptyp.textContent = 'Yumi didn’t find clear lenses this time — your shelf may be small or wide-ranging. Name your own below.';
        sug.appendChild(emptyp);
        sug.appendChild(buildLensSuggestRetry());
      } else {
        var si;
        for (si = 0; si < lensSuggestLenses.length; si++) {
          sug.appendChild(buildProposedLensCard(lensSuggestLenses[si]));
        }
      }
    }
    var sugCov = document.createElement('p');
    sugCov.className = 'lens-panel-covenant lens-suggest-covenant';
    sugCov.textContent = 'Yumi proposes these from your titles, authors, and genres only — never from inside your books.';
    sug.appendChild(sugCov);
  }
  lensPanelBodyEl.appendChild(sug);

  // Your hand-made lenses.
  var mine = document.createElement('div');
  mine.className = 'lens-panel-section';
  var mineLabel = document.createElement('div');
  mineLabel.className = 'lens-panel-section-label';
  mineLabel.textContent = 'Your lenses';
  mine.appendChild(mineLabel);
  var list = lensPanelUserThemes();
  if (list.length === 0) {
    var none = document.createElement('p');
    none.className = 'lens-panel-stub';
    none.textContent = 'No hand-made lenses yet — name one below.';
    mine.appendChild(none);
  } else {
    var i;
    for (i = 0; i < list.length; i++) {
      mine.appendChild(buildLensCard(list[i]));
    }
  }
  lensPanelBodyEl.appendChild(mine);

  // Name your own -- reuses the existing createUserTheme write path.
  var make = document.createElement('div');
  make.className = 'lens-panel-make';
  var makeLabel = document.createElement('label');
  makeLabel.className = 'lens-panel-make-label';
  makeLabel.setAttribute('for', 'lens-panel-make-input');
  makeLabel.textContent = 'or name one yourself';
  make.appendChild(makeLabel);
  var row = document.createElement('div');
  row.className = 'lens-panel-make-row';
  var input = document.createElement('input');
  input.type = 'text';
  input.id = 'lens-panel-make-input';
  input.className = 'lens-panel-make-input';
  input.setAttribute('placeholder', 'e.g. Books that changed my mind');
  input.setAttribute('autocomplete', 'off');
  row.appendChild(input);
  var addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'lens-panel-make-btn';
  addBtn.textContent = 'Create lens';
  function doCreate() {
    var v = input.value.replace(/^\s+|\s+$/g, '');
    if (v === '') { return; }
    if (typeof createUserTheme === 'function' && createUserTheme(v)) {
      input.value = '';
      lensPanelRefresh();
      var again = lensPanelEl ? lensPanelEl.querySelector('#lens-panel-make-input') : null;
      if (again) { again.focus(); }
    }
  }
  addBtn.addEventListener('click', doCreate);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); doCreate(); }
  });
  row.appendChild(addBtn);
  make.appendChild(row);
  lensPanelBodyEl.appendChild(make);

  // Covenant.
  var cov = document.createElement('p');
  cov.className = 'lens-panel-covenant';
  cov.textContent = 'Yumi works only from what your books are — never from what’s inside them, and never from your private notes.';
  lensPanelBodyEl.appendChild(cov);
}

function buildLensPanel() {
  var overlay = document.createElement('div');
  overlay.id = LENS_PANEL_ID;
  overlay.className = 'lens-panel-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Lenses');

  var backdrop = document.createElement('div');
  backdrop.className = 'lens-panel-backdrop';
  backdrop.addEventListener('click', function () { closeLensPanel(); });
  overlay.appendChild(backdrop);

  var panel = document.createElement('div');
  panel.className = 'lens-panel';

  var header = document.createElement('div');
  header.className = 'lens-panel-header';
  var glyph = document.createElement('span');
  glyph.className = 'lens-panel-glyph';
  glyph.setAttribute('aria-hidden', 'true');
  // S6: the panel-head crest routes through the single shared source so
  // there is ONE glyph geometry app-wide (the .lens-panel-glyph CSS sizes it).
  glyph.innerHTML = yumiGlyph(40, false);
  header.appendChild(glyph);
  var headtext = document.createElement('div');
  headtext.className = 'lens-panel-headtext';
  var title = document.createElement('h2');
  title.className = 'lens-panel-title';
  title.textContent = 'Lenses';
  var sub = document.createElement('p');
  sub.className = 'lens-panel-sub';
  sub.textContent = 'Ways of reading across your shelf.';
  headtext.appendChild(title);
  headtext.appendChild(sub);
  header.appendChild(headtext);
  var close = document.createElement('button');
  close.type = 'button';
  close.className = 'lens-panel-close';
  close.setAttribute('aria-label', 'Close');
  close.textContent = '×';
  close.addEventListener('click', function () { closeLensPanel(); });
  header.appendChild(close);
  panel.appendChild(header);

  var body = document.createElement('div');
  body.className = 'lens-panel-body';
  body.id = 'lens-panel-body';
  panel.appendChild(body);
  lensPanelBodyEl = body;

  overlay.appendChild(panel);
  return overlay;
}

function onLensPanelKeydown(e) {
  if (e.key === 'Escape') { e.preventDefault(); closeLensPanel(); return; }
  if (e.key === 'Tab' && lensPanelEl) {
    var f = lensPanelEl.querySelectorAll('button, input, [tabindex]');
    if (f.length) {
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
}

function openLensPanel() {
  if (!lensPanelEl) {
    lensPanelEl = buildLensPanel();
    document.body.appendChild(lensPanelEl);
  }
  lensPanelLastFocus = document.activeElement;
  // S3: each open re-asks Yumi for fresh proposals.
  lensSuggestStatus = 'idle';
  lensSuggestLenses = [];
  renderLensPanelBody();
  lensPanelEl.classList.add('lens-panel-open');
  document.addEventListener('keydown', onLensPanelKeydown);
  var inp = lensPanelEl.querySelector('#lens-panel-make-input');
  if (inp) { inp.focus(); }
}

function closeLensPanel() {
  if (lensPanelEl) { lensPanelEl.classList.remove('lens-panel-open'); }
  document.removeEventListener('keydown', onLensPanelKeydown);
  // Restore focus to the opener. A create/rename/delete re-renders the shelf
  // rail, which detaches the original "Ask Yumi" button; fall back to the
  // live one (or leave focus alone) so close never throws into a dead node.
  var restore = lensPanelLastFocus;
  if (!restore || !document.body.contains(restore)) {
    restore = document.querySelector('.shelf-lens-ask');
  }
  if (restore && restore.focus) { restore.focus(); }
  lensPanelLastFocus = null;
}

window.PraxisLensPanel = {
  open:  openLensPanel,
  close: closeLensPanel
};

console.log('yumi-ui.js loaded');
