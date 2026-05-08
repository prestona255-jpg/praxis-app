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
// auth (via integrations.js getCurrentUser) is the primary source. If
// no signed-in user, fall back to state.users contents: 0 keys -> null,
// 1 key -> that key, 2+ keys -> first alphabetically with a deferred-#6
// warning (multi-user is not yet supported).
function resolveActiveUid() {
  var current = getCurrentUser();
  if (current && current.uid) {
    return current.uid;
  }
  var keys = [];
  var k;
  for (k in state.users) {
    if (Object.prototype.hasOwnProperty.call(state.users, k)) {
      keys.push(k);
    }
  }
  if (keys.length === 0) return null;
  if (keys.length === 1) return keys[0];
  keys.sort();
  console.warn('yumi-brain: multiple users in state.users (deferred #6); using first alphabetically: ' + keys[0]);
  return keys[0];
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
    model:      'claude-sonnet-4-20250514',
    max_tokens: 512,
    system:     YUMI_VOICE_TEXT,
    messages: [
      { role: 'user', content: promptBody }
    ]
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

// Render the conversation summary line for buildContext. Empty when
// there is no active uid, no user record, no yumiMemory, or summary
// is the empty string. When present, prefixed to make explicit to
// Claude that this is OLDER memory than recentTurns.
function renderConversationSummary(activeUid) {
  if (!activeUid || !state.users[activeUid] ||
      !state.users[activeUid].yumiMemory) {
    return '';
  }
  var summary = state.users[activeUid].yumiMemory.summary;
  if (!summary) return '';
  return 'EARLIER IN OUR CONVERSATION (summary): ' + summary + '\n';
}

// Render the recentTurns labeled-prose block for buildContext. The
// current user turn (which messages[] carries directly) is excluded --
// recentTurns is appended pre-fetch and its last entry IS the live
// message, so we slice it off here to avoid double-counting it in the
// system prompt. Empty cases (no active uid, no user record, no
// yumiMemory, no recentTurns, or only the live entry) all collapse to
// "recentTurns: none yet".
function renderRecentTurns(activeUid) {
  if (!activeUid || !state.users[activeUid] ||
      !state.users[activeUid].yumiMemory ||
      !state.users[activeUid].yumiMemory.recentTurns) {
    return 'recentTurns: none yet';
  }
  var allTurns = state.users[activeUid].yumiMemory.recentTurns;
  var priorTurns = allTurns.slice(0, allTurns.length - 1);
  if (priorTurns.length === 0) {
    return 'recentTurns: none yet';
  }
  var turnLines = ['recentTurns:'];
  var t;
  for (t = 0; t < priorTurns.length; t++) {
    var label;
    if (priorTurns[t].role === 'assistant') {
      label = 'Yumi: ';
    } else {
      label = 'User: ';
    }
    turnLines.push(label + priorTurns[t].content);
  }
  return turnLines.join('\n');
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

  var activeUid = resolveActiveUid();
  var summaryLine = renderConversationSummary(activeUid);
  var turnsLine = renderRecentTurns(activeUid);

  return 'currentBook: ' + bookLine + '\n' +
         'recentEntries: ' + entriesLine + '\n' +
         'currentArc: ' + arcLine + '\n' +
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
    appendTurn('assistant', text);
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
