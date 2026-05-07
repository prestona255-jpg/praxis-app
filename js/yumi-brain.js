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

function buildContext() {
  var bookLine;
  if (state.currentBookId === null) {
    bookLine = 'none yet';
  } else {
    var book = state.books[state.currentBookId];
    if (!book) {
      console.warn('yumi-brain: dangling currentBookId ' + state.currentBookId);
      bookLine = 'none yet';
    } else {
      var hasAuthor = (typeof book.author === 'string') && book.author.length > 0;
      if (hasAuthor) {
        bookLine = book.title + ' by ' + book.author;
      } else {
        bookLine = book.title;
      }
    }
  }

  var arcLine;
  if (state.currentArcId === null) {
    arcLine = 'none';
  } else {
    var arc = state.arcs[state.currentArcId];
    if (!arc) {
      console.warn('yumi-brain: dangling currentArcId ' + state.currentArcId);
      arcLine = 'none';
    } else {
      arcLine = arc.title;
    }
  }

  var entries = [];
  var key;
  for (key in state.notebookEntries) {
    if (Object.prototype.hasOwnProperty.call(state.notebookEntries, key)) {
      entries.push(state.notebookEntries[key]);
    }
  }
  entries.sort(function (a, b) {
    return b.createdAt - a.createdAt;
  });
  var top = entries.slice(0, 3);

  var entriesLine;
  if (top.length === 0) {
    entriesLine = 'none yet';
  } else {
    var parts = [];
    var i;
    for (i = 0; i < top.length; i++) {
      var body = top[i].body;
      if (body.length > 200) {
        body = body.substring(0, 197) + '...';
      }
      parts.push(body);
    }
    entriesLine = parts.join('; ');
  }

  return 'currentBook: ' + bookLine + '\n' +
         'recentEntries: ' + entriesLine + '\n' +
         'currentArc: ' + arcLine;
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
    '===== CONTEXT =====\n\n' +
    contextSection + '\n';

  return prompt;
}

function sendMessage(userText) {
  var payload = {
    model:      'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system:     buildYumiSystem(),
    messages: [
      { role: 'user', content: userText }
    ]
    // stream parameter intentionally omitted — non-streaming for 2.4
  };

  return fetch('/.netlify/functions/claude-proxy', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
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
    return { ok: true, text: text };
  });
}

window.YumiBrain = {
  loadVoice:    loadYumiVoice,
  buildSystem:  buildYumiSystem,
  buildContext: buildContext,
  getContext:   getYumiContext,
  sendMessage:  sendMessage
};

// Kick off preload at script-load time so buildYumiSystem can return
// synchronously by the time anything calls it.
loadYumiVoice();

console.log('yumi-brain.js loaded');
