// =====================================================================
// views.js -- Page render functions for every Praxis view
//
// Stage 3.1 wiring: renderRoute() is the entry point called by app.js
// on DOMContentLoaded and on every 'hashchange'. It reads
// location.hash and dispatches to a per-route renderer. For 3.2 the
// only route is still #notebook -- empty hash and unknown hashes
// both fall through to renderNotebook. Later stages will add
// #book/:id and #arc/:id by extending renderRoute's dispatch.
//
// Stage 3.2 extends the Notebook surface from an empty placeholder
// into a working Journal creation flow. renderNotebook paints:
//   header (title + auth-aware affordance)
//     signed in:  "+ New entry" button -> openJournalEditor()
//     signed out: "Sign in to write"   -> signInWithGoogle()
//   editor host (empty until openJournalEditor mounts the editor)
//   entry list (newest first by createdAt) OR empty-state paragraph
//
// openJournalEditor mounts an inline textarea + Save/Cancel block
// into the editor host. Save creates a notebookEntry with
// register: 'journal' and isPrivate: false (the safe default; the
// per-user toggle UI lands in 3.4), persists via saveState, and
// re-renders. Cancel discards and re-renders.
//
// renderJournalEntry builds a single entry card: register marker,
// createdAt timestamp, and body. All user-derived strings go in via
// textContent -- no innerHTML with dynamic content. No markdown
// rendering in 3.2; that lands later.
//
// New CSS classes introduced in 3.2 (all unstyled; styling pass to
// follow): notebook, notebook-title, notebook-header,
// notebook-new-entry, notebook-signin-prompt, notebook-editor,
// notebook-editor-body, notebook-editor-actions,
// notebook-editor-save, notebook-editor-cancel, notebook-entry-list,
// notebook-entry, notebook-entry-meta, notebook-entry-register,
// notebook-entry-body. The editor host is located by id
// #notebook-editor-host.
//
// var/function only -- no const, let, arrow, class, or template
// literals anywhere. String concatenation only.
// =====================================================================

'use strict';

var APP_EL_ID = 'app';

function renderRoute() {
  var hash = location.hash;
  if (hash === '' || hash === '#notebook') {
    renderNotebook();
    return;
  }
  // Unknown-route fallback for 3.2; later stages will add explicit
  // cases (#book/:id, #arc/:id) above this line before the default.
  renderNotebook();
}

function renderNotebook() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'notebook';

  // Header: title + auth-aware affordance.
  var header = document.createElement('header');
  header.className = 'notebook-header';

  var title = document.createElement('h1');
  title.className = 'notebook-title';
  title.textContent = 'Notebook';
  header.appendChild(title);

  var user = getCurrentUser();
  if (user) {
    var newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'notebook-new-entry';
    newBtn.textContent = '+ New entry';
    newBtn.addEventListener('click', function() {
      openJournalEditor();
    });
    header.appendChild(newBtn);
  } else {
    var signinBtn = document.createElement('button');
    signinBtn.type = 'button';
    signinBtn.className = 'notebook-signin-prompt';
    signinBtn.textContent = 'Sign in to write';
    signinBtn.addEventListener('click', function() {
      signInWithGoogle();
    });
    header.appendChild(signinBtn);
  }

  wrap.appendChild(header);

  // Editor host -- empty on every render; openJournalEditor mounts
  // its block here on demand.
  var editorHost = document.createElement('div');
  editorHost.id = 'notebook-editor-host';
  wrap.appendChild(editorHost);

  // Collect entries owned by the current user; newest first.
  var entries = [];
  var entryMap = state.notebookEntries || {};
  var key;
  for (key in entryMap) {
    if (Object.prototype.hasOwnProperty.call(entryMap, key)) {
      var e = entryMap[key];
      if (e && user && e.userId === user.uid) {
        entries.push(e);
      }
    }
  }
  entries.sort(function(a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  if (entries.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'notebook-empty-body';
    empty.textContent =
      'A notebook holds two kinds of writing: marginalia kept close ' +
      'to particular books, and journal entries that range further. ' +
      'Both live here. Nothing has been written yet.';
    wrap.appendChild(empty);
  } else {
    var list = document.createElement('div');
    list.className = 'notebook-entry-list';
    var i;
    for (i = 0; i < entries.length; i++) {
      list.appendChild(renderJournalEntry(entries[i]));
    }
    wrap.appendChild(list);
  }

  host.appendChild(wrap);
}

function openJournalEditor() {
  var hostEl = document.getElementById('notebook-editor-host');
  if (!hostEl) return;

  // Hide the empty-state paragraph if present so the editor sits
  // alone below the header.
  var emptyEl = document.querySelector('.notebook-empty-body');
  if (emptyEl) {
    emptyEl.style.display = 'none';
  }

  hostEl.innerHTML = '';

  var editor = document.createElement('div');
  editor.className = 'notebook-editor';

  var bodyInput = document.createElement('textarea');
  bodyInput.className = 'notebook-editor-body';
  bodyInput.rows = 8;

  var actions = document.createElement('div');
  actions.className = 'notebook-editor-actions';

  var saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'notebook-editor-save';
  saveBtn.textContent = 'Save';
  saveBtn.disabled = true;

  var cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'notebook-editor-cancel';
  cancelBtn.textContent = 'Cancel';

  bodyInput.addEventListener('input', function() {
    var trimmed = bodyInput.value.replace(/^\s+|\s+$/g, '');
    saveBtn.disabled = (trimmed.length === 0);
  });

  saveBtn.addEventListener('click', function() {
    var trimmed = bodyInput.value.replace(/^\s+|\s+$/g, '');
    if (trimmed.length === 0) return;
    var user = getCurrentUser();
    if (!user) return;
    var now = Date.now();
    var id = genEntryId();
    var entry = {
      id:         id,
      userId:     user.uid,
      register:   'journal',
      isPrivate:  false,
      body:       trimmed,
      bookIds:    [],
      arcIds:     [],
      createdAt:  now,
      updatedAt:  now
    };
    state.notebookEntries[id] = entry;
    saveState();
    renderNotebook();
  });

  cancelBtn.addEventListener('click', function() {
    renderNotebook();
  });

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  editor.appendChild(bodyInput);
  editor.appendChild(actions);
  hostEl.appendChild(editor);

  bodyInput.focus();
}

function renderJournalEntry(entry) {
  var card = document.createElement('article');
  card.className = 'notebook-entry';

  var meta = document.createElement('div');
  meta.className = 'notebook-entry-meta';

  var registerEl = document.createElement('span');
  registerEl.className = 'notebook-entry-register';
  registerEl.textContent = entry.register || 'journal';

  var timeEl = document.createElement('time');
  var ts = new Date(entry.createdAt || 0);
  timeEl.textContent = ts.toLocaleString();
  if (entry.createdAt) {
    timeEl.setAttribute('datetime', ts.toISOString());
  }

  meta.appendChild(registerEl);
  meta.appendChild(timeEl);

  var bodyEl = document.createElement('div');
  bodyEl.className = 'notebook-entry-body';
  bodyEl.textContent = entry.body || '';

  card.appendChild(meta);
  card.appendChild(bodyEl);
  return card;
}

window.views = {
  renderRoute:       renderRoute,
  renderNotebook:    renderNotebook,
  openJournalEditor: openJournalEditor
};

console.log('views.js loaded');
