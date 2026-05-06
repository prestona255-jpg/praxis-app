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
  renderYumiEmptyState();
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
  render:    renderYumiPanel,
  open:      openYumiPanel,
  close:     closeYumiPanel,
  toggle:    toggleYumiPanel,
  isOpen:    isYumiPanelOpen,
  greetings: YUMI_GREETINGS
};

console.log('yumi-ui.js loaded');
