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
var YUMI_TOGGLE_ID = 'yumi-toggle';
var YUMI_INPUT_ID  = 'yumi-input';
var YUMI_BODY_ID   = 'yumi-panel-body';

var yumiPanelEl    = null;
var yumiToggleEl   = null;
var yumiInputEl    = null;
var yumiBodyEl     = null;
var yumiSendBtnEl  = null;
var yumiMicBtnEl   = null;
var yumi_request_in_flight = false;

function isYumiPanelOpen() {
  return ls('praxis_yumi_open', false) === true;
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

function renderYumiEmptyState() {
  if (!yumiBodyEl) { return; }
  var greeting = pickYumiGreeting();
  yumiBodyEl.innerHTML = '';
  var wrap = document.createElement('div');
  wrap.className = 'yumi-empty';
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

function renderYumiMessage(text) {
  if (!yumiBodyEl) { return; }
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
}

function removeTypingIndicator() {
  if (!yumiBodyEl) { return; }
  var el = yumiBodyEl.querySelector('.yumi-msg-typing');
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
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
  // 6.2c: never auto-open the greeting onto an arc-detail surface. The Yumi
  // panel is a fixed bottom-right overlay (z-9998); on the constellation Web
  // view it parks over the sub-theory marks and swallows Connect clicks --
  // handleConnectClick's hit-test resolves to the panel, then disarm() fires
  // and the pick silently cancels. The empty-shelf gate above means a genuine
  // first-run user is on #home, so this skips nothing in practice; manual
  // Yumi-open (the toggle) is unaffected -- this gates AUTO-open only.
  if (location.hash.indexOf('#arc/') === 0) { return; }
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

function buildYumiToggle() {
  var btn = document.createElement('button');
  btn.id = YUMI_TOGGLE_ID;
  btn.className = 'yumi-toggle';
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', 'Toggle Yumi');
  btn.textContent = 'Y';
  btn.addEventListener('click', function() {
    toggleYumiPanel();
  });
  return btn;
}

function buildYumiPanel() {
  var panel = document.createElement('div');
  panel.id = YUMI_PANEL_ID;
  panel.className = 'yumi-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Yumi');

  var header = document.createElement('div');
  header.className = 'yumi-panel-header';
  var title = document.createElement('span');
  title.className = 'yumi-panel-title';
  title.textContent = 'Yumi';
  header.appendChild(title);
  // 6.2c: quiet affordance to the 'What Yumi sees' transparency page.
  // A native hash anchor -- the panel is body-mounted and survives the
  // route change, so it stays open. Sits between the title and the close.
  var sightLink = document.createElement('a');
  sightLink.className = 'yumi-panel-sight-link';
  sightLink.href = '#yumi-sees';
  sightLink.textContent = 'What I can see';
  header.appendChild(sightLink);
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
  row.appendChild(input);
  yumiInputEl = input;

  var micBtn = document.createElement('button');
  micBtn.className = 'yumi-mic-btn';
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
  sendBtn.className = 'yumi-send-btn';
  sendBtn.setAttribute('type', 'button');
  sendBtn.setAttribute('aria-label', 'Send message');
  sendBtn.textContent = 'Send';
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

    yumi_request_in_flight = true;
    if (yumiSendBtnEl) { yumiSendBtnEl.disabled = true; }
    renderTypingIndicator();

    window.YumiBrain.sendMessage(trimmed).then(function (result) {
      removeTypingIndicator();
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

  panel.appendChild(row);
  return panel;
}

function renderYumiPanel() {
  if (!yumiToggleEl) {
    yumiToggleEl = buildYumiToggle();
    document.body.appendChild(yumiToggleEl);
  }
  if (!yumiPanelEl) {
    yumiPanelEl = buildYumiPanel();
    document.body.appendChild(yumiPanelEl);
  }
  if (isYumiPanelOpen()) {
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
  if (isYumiPanelOpen()) {
    closeYumiPanel();
  } else {
    openYumiPanel();
  }
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

console.log('yumi-ui.js loaded');
