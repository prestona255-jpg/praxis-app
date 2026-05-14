// =====================================================================
// views.js -- Page render functions for every Praxis view
//
// renderRoute() is the entry point. app.js calls it on
// DOMContentLoaded and on every 'hashchange'. It parses location.hash
// by stripping the leading '#' and splitting on '/', then dispatches
// on parts[0]:
//   ''            -> renderNotebook()
//   'notebook'    -> renderNotebook()
//   'book' + id   -> renderBookDetail(id)   (id from parts[1])
//   otherwise     -> renderNotebook()       (default fallback)
// Each notebook-bound dispatch clears state.currentBookId to null;
// the book-detail dispatch sets it to the route id. Both paths call
// saveState() after the mutation so yumi-brain (which reads
// currentBookId) sees a consistent live state.
//
// Stage 3.1: renderNotebook paints the unified Notebook surface --
// header (title + auth-aware affordance) + editor host + entry list
// (or empty-state paragraph). The unified list shows all of the
// active user's entries across both registers, newest first by
// createdAt.
//
// Stage 3.2: openJournalEditor mounts an inline textarea + Save /
// Cancel block into #notebook-editor-host. Save creates a
// notebookEntry with register 'journal', isPrivate false (the
// register default; toggle UI lands in 3.4), persists via saveState,
// and re-renders via renderNotebook.
//
// Stage 3.3: renderBookDetail paints the per-book surface -- header
// (cover if present, title, author byline if present, auth-aware
// affordance) + editor host (#book-detail-editor-host) + filtered
// entry list (this user's entries on this book, newest first), or an
// empty-state paragraph in the app literary register.
// openMarginaliaEditor mirrors openJournalEditor structurally but
// writes register 'marginalia', bookIds [bookId], and re-renders via
// renderBookDetail. renderNotebookEntry is the single register-aware
// entry renderer used by both surfaces: marginalia entries get a
// second meta line "from <title>" resolved through entry.bookIds[0]
// -> state.books; missing books fail soft as "from (unknown book)".
//
// All user-derived text goes in via textContent. innerHTML = '' is
// acceptable for clearing. No markdown rendering in 3.3.
//
// CSS classes (all unstyled; styling pass to follow):
//   3.1: notebook-empty, notebook-empty-title, notebook-empty-body
//   3.2: notebook, notebook-title, notebook-header,
//        notebook-new-entry, notebook-signin-prompt, notebook-editor,
//        notebook-editor-body, notebook-editor-actions,
//        notebook-editor-save, notebook-editor-cancel,
//        notebook-entry-list, notebook-entry, notebook-entry-meta,
//        notebook-entry-register, notebook-entry-body
//   3.3: book-detail, book-detail-header, book-detail-title,
//        book-detail-author, book-detail-cover, book-detail-new-entry,
//        book-detail-signin-prompt, book-detail-empty-body,
//        book-detail-not-found, notebook-entry-book-meta
//   Editor host ids: #notebook-editor-host (3.2),
//                    #book-detail-editor-host (3.3)
//
// var/function only -- no const, let, arrow, class, or template
// literals anywhere. String concatenation only.
// =====================================================================

'use strict';

var APP_EL_ID = 'app';

function renderRoute() {
  var rest = location.hash.replace(/^#/, '');
  var parts = rest.split('/');
  if (parts[0] === 'book' && parts[1]) {
    state.currentBookId = parts[1];
    saveState();
    renderBookDetail(parts[1]);
    return;
  }
  // Notebook (explicit), empty hash, and any unknown route all
  // converge on the unified Notebook view. currentBookId clears
  // symmetrically on the way in so yumi-brain's retrieval path
  // does not carry a stale book reference.
  state.currentBookId = null;
  saveState();
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
      list.appendChild(renderNotebookEntry(entries[i]));
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

function renderBookDetail(bookId) {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var book = (state.books && state.books[bookId]) || null;

  if (!book) {
    var nf = document.createElement('section');
    nf.className = 'book-detail-not-found';
    var nfMsg = document.createElement('p');
    nfMsg.textContent = 'Book not found.';
    var nfLink = document.createElement('a');
    nfLink.href = '#notebook';
    nfLink.textContent = 'Back to Notebook';
    nf.appendChild(nfMsg);
    nf.appendChild(nfLink);
    host.appendChild(nf);
    return;
  }

  var wrap = document.createElement('section');
  wrap.className = 'book-detail';

  // Header: optional cover, title, optional author byline, auth-
  // aware affordance.
  var header = document.createElement('header');
  header.className = 'book-detail-header';

  if (book.coverUrl) {
    var cover = document.createElement('img');
    cover.className = 'book-detail-cover';
    cover.src = book.coverUrl;
    cover.alt = '';
    header.appendChild(cover);
  }

  var title = document.createElement('h1');
  title.className = 'book-detail-title';
  title.textContent = book.title || '';
  header.appendChild(title);

  if (book.author) {
    var author = document.createElement('p');
    author.className = 'book-detail-author';
    author.textContent = book.author;
    header.appendChild(author);
  }

  var user = getCurrentUser();
  if (user) {
    var newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'book-detail-new-entry';
    newBtn.textContent = 'Add Marginalia';
    newBtn.addEventListener('click', function() {
      openMarginaliaEditor(bookId);
    });
    header.appendChild(newBtn);
  } else {
    var signinBtn = document.createElement('button');
    signinBtn.type = 'button';
    signinBtn.className = 'book-detail-signin-prompt';
    signinBtn.textContent = 'Sign in to write';
    signinBtn.addEventListener('click', function() {
      signInWithGoogle();
    });
    header.appendChild(signinBtn);
  }

  wrap.appendChild(header);

  // Editor host -- empty on every render; openMarginaliaEditor
  // mounts its block here on demand.
  var editorHost = document.createElement('div');
  editorHost.id = 'book-detail-editor-host';
  wrap.appendChild(editorHost);

  // Filtered entry list: this user's entries that name this book in
  // bookIds, newest first.
  var entries = [];
  var entryMap = state.notebookEntries || {};
  var key;
  for (key in entryMap) {
    if (Object.prototype.hasOwnProperty.call(entryMap, key)) {
      var e = entryMap[key];
      if (e && user && e.userId === user.uid &&
          e.bookIds && e.bookIds.indexOf(bookId) !== -1) {
        entries.push(e);
      }
    }
  }
  entries.sort(function(a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  if (entries.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'book-detail-empty-body';
    empty.textContent =
      'Marginalia for this book will appear here. ' +
      'Nothing has been written yet.';
    wrap.appendChild(empty);
  } else {
    var list = document.createElement('div');
    list.className = 'notebook-entry-list';
    var i;
    for (i = 0; i < entries.length; i++) {
      list.appendChild(renderNotebookEntry(entries[i]));
    }
    wrap.appendChild(list);
  }

  host.appendChild(wrap);
}

function openMarginaliaEditor(bookId) {
  var hostEl = document.getElementById('book-detail-editor-host');
  if (!hostEl) return;

  // Hide the empty-state paragraph if present so the editor sits
  // alone below the header.
  var emptyEl = document.querySelector('.book-detail-empty-body');
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
      register:   'marginalia',
      isPrivate:  false,
      body:       trimmed,
      bookIds:    [bookId],
      arcIds:     [],
      createdAt:  now,
      updatedAt:  now
    };
    state.notebookEntries[id] = entry;
    saveState();
    renderBookDetail(bookId);
  });

  cancelBtn.addEventListener('click', function() {
    renderBookDetail(bookId);
  });

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  editor.appendChild(bodyInput);
  editor.appendChild(actions);
  hostEl.appendChild(editor);

  bodyInput.focus();
}

function renderNotebookEntry(entry) {
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

  // For marginalia entries, add a second meta line naming the book.
  // Fail soft if state.books does not know the referenced book.
  if (entry.register === 'marginalia') {
    var bookMeta = document.createElement('div');
    bookMeta.className = 'notebook-entry-book-meta';
    var bookId = (entry.bookIds && entry.bookIds[0]) || null;
    var book = (bookId && state.books && state.books[bookId]) || null;
    var bookTitle = (book && book.title) || '(unknown book)';
    bookMeta.textContent = 'from ' + bookTitle;
    meta.appendChild(bookMeta);
  }

  var bodyEl = document.createElement('div');
  bodyEl.className = 'notebook-entry-body';
  bodyEl.textContent = entry.body || '';

  card.appendChild(meta);
  card.appendChild(bodyEl);
  return card;
}

window.views = {
  renderRoute:          renderRoute,
  renderNotebook:       renderNotebook,
  renderBookDetail:     renderBookDetail,
  openJournalEditor:    openJournalEditor,
  openMarginaliaEditor: openMarginaliaEditor
};

console.log('views.js loaded');
