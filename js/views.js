// =====================================================================
// views.js -- Page render functions for every Praxis view
//
// renderRoute() is the entry point. app.js calls it on
// DOMContentLoaded and on every 'hashchange'. It parses location.hash
// by stripping the leading '#' and splitting on '/', then dispatches
// on parts[0]:
//   ''            -> renderNotebook()
//   'notebook'    -> renderNotebook()
//   'books'       -> renderShelf()         (3.5a)
//   'book' + id   -> renderBookDetail(id)  (id from parts[1])
//   otherwise     -> renderNotebook()      (default fallback)
// The notebook-bound dispatch and the shelf-bound dispatch both
// clear state.currentBookId to null; the book-detail dispatch sets
// it to the route id. All paths call saveState() after the mutation
// so yumi-brain (which reads currentBookId) sees a consistent live
// state. The 'books' branch is distinct from the 'book' + id branch
// by parts[0] alone -- no collision with a hypothetical bookId of
// 'all' or similar reserved value.
//
// Stage 3.1: renderNotebook paints the unified Notebook surface --
// header (title + auth-aware affordance) + editor host + entry list
// (or empty-state paragraph). The unified list shows all of the
// active user's entries across both registers, newest first by
// createdAt.
//
// Stage 3.2: openJournalEditor mounts an inline textarea + Save /
// Cancel block into #notebook-editor-host. Save creates a
// notebookEntry with register 'journal', isPrivate sourced from
// the per-user Journal register default (3.4b), persists via
// saveState, and re-renders via renderNotebook.
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
// Stage 3.4b: per-entry visibility toggle on every rendered entry
// (notebook-entry-privacy + notebook-entry-privacy-toggle) plus a
// register-default settings affordance in the Notebook header
// (notebook-settings-toggle opens an inline panel at
// #notebook-settings-host). Per-entry flip is the primary
// correctable surface for principle #5; the filter that consumes
// isPrivate lives in yumi-brain.js buildContext (3.4a). New entry
// creation reads state.users[uid].registerDefaults[register]
// instead of hardcoding false. Existing entries are never
// retroactively flipped when a register default changes.
//
// Stage 3.6: principle #5's third leg -- the transparency view.
// "What does Yumi see?" affordance in the Notebook header opens an
// inline panel at #notebook-transparency-host (between settings
// host and editor host). The panel reads
// window.YumiBrain.getContextSnapshot() at mount time -- fresh on
// every open, no live updates, close clears. Five sections:
// Current book, Current arc, Recent notebook entries, conversation
// summary, recent turns. Diagnostic surface, not primary surface;
// styling differentiation deferred to the styling pass.
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
//   3.4b: notebook-entry-privacy, notebook-entry-privacy-toggle,
//         notebook-settings-toggle, notebook-settings-panel,
//         notebook-settings-section, notebook-settings-label,
//         notebook-settings-current, notebook-settings-toggle-link,
//         notebook-settings-explanation, notebook-settings-done
//   3.6:  notebook-transparency-toggle, transparency-panel,
//         transparency-header, transparency-title, transparency-close,
//         transparency-framing, transparency-section,
//         transparency-section-label, transparency-section-body,
//         transparency-entry, transparency-entry-body,
//         transparency-entry-meta, transparency-turn,
//         transparency-turn-role, transparency-turn-body
//   3.5a: shelf, shelf-header, shelf-title, shelf-empty-body,
//         shelf-list, shelf-book, shelf-book-title, shelf-book-author,
//         shelf-book-meta, shelf-book-status, shelf-book-genre
//   Editor host ids: #notebook-editor-host (3.2),
//                    #book-detail-editor-host (3.3)
//   Settings host id:     #notebook-settings-host (3.4b)
//   Transparency host id: #notebook-transparency-host (3.6)
//
// Stage 3.5a: renderShelf paints the Books surface -- header (title
// only in this sub-stage; auth-aware add affordance lands with the
// add-book editor) + book list (or empty-state paragraph). The list
// reads from state.books (not state.userBooks) so book_test_1 from
// 3.3 console seeding stays visible despite never being written to
// userBooks -- the pre-existing drift documented in the 3.5a brief.
// Filter pills are deferred; this sub-stage renders every record in
// state.books, newest first by addedAt. Each row is an anchor to
// #book/<id> so click-through hits the existing book-detail surface.
// renderShelfBook is the single row renderer.
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
  if (parts[0] === 'books') {
    // Shelf surface (3.5a). currentBookId clears symmetrically with
    // the notebook path so yumi-brain does not carry a stale book
    // reference into a shelf-scoped session.
    state.currentBookId = null;
    saveState();
    renderShelf();
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

    var settingsBtn = document.createElement('button');
    settingsBtn.type = 'button';
    settingsBtn.className = 'notebook-settings-toggle';
    settingsBtn.textContent = 'Settings';
    settingsBtn.addEventListener('click', function() {
      openNotebookSettings();
    });
    header.appendChild(settingsBtn);

    var transparencyBtn = document.createElement('button');
    transparencyBtn.type = 'button';
    transparencyBtn.className = 'notebook-transparency-toggle';
    transparencyBtn.textContent = 'What does Yumi see?';
    transparencyBtn.addEventListener('click', function() {
      openTransparencyView();
    });
    header.appendChild(transparencyBtn);
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

  // Settings host -- empty on every render; openNotebookSettings
  // mounts the register-default panel here on demand.
  var settingsHost = document.createElement('div');
  settingsHost.id = 'notebook-settings-host';
  wrap.appendChild(settingsHost);

  // Transparency host -- empty on every render; openTransparencyView
  // mounts the "What Yumi sees" panel here on demand. Created
  // unconditionally; gating happens at the header button level.
  var transparencyHost = document.createElement('div');
  transparencyHost.id = 'notebook-transparency-host';
  wrap.appendChild(transparencyHost);

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
      isPrivate:  getRegisterDefault('journal'),
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

// Stage 3.5a: the Books shelf surface. Reads from state.books and
// renders one row per record, newest first by addedAt. No filtering,
// no add-book affordance, no editor in this sub-stage -- those land
// in later 3.5a sub-stages. Each row links to #book/<id> via an
// anchor so click-through hits renderBookDetail through the router.
function renderShelf() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'shelf';

  var header = document.createElement('header');
  header.className = 'shelf-header';

  var title = document.createElement('h1');
  title.className = 'shelf-title';
  title.textContent = 'Books';
  header.appendChild(title);

  wrap.appendChild(header);

  // Collect books. Read site is state.books, not state.userBooks --
  // see brief: userBooks is write-but-not-read in 3.5a so book_test_1
  // (seeded into state.books in 3.3 console testing but never into
  // userBooks) stays visible. User-scoping the shelf is a future
  // seam.
  var books = [];
  var booksMap = state.books || {};
  var bid;
  for (bid in booksMap) {
    if (Object.prototype.hasOwnProperty.call(booksMap, bid)) {
      if (booksMap[bid]) books.push(booksMap[bid]);
    }
  }
  books.sort(function(a, b) {
    return (b.addedAt || 0) - (a.addedAt || 0);
  });

  if (books.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'shelf-empty-body';
    empty.textContent =
      'Books you add will appear here. ' +
      'Nothing has been added yet.';
    wrap.appendChild(empty);
  } else {
    var list = document.createElement('div');
    list.className = 'shelf-list';
    var i;
    for (i = 0; i < books.length; i++) {
      list.appendChild(renderShelfBook(books[i]));
    }
    wrap.appendChild(list);
  }

  host.appendChild(wrap);
}

// Single shelf row. Anchor element so the browser's hashchange path
// handles navigation -- no addEventListener needed.
function renderShelfBook(book) {
  var card = document.createElement('a');
  card.className = 'shelf-book';
  card.href = '#book/' + book.id;

  var titleEl = document.createElement('h2');
  titleEl.className = 'shelf-book-title';
  titleEl.textContent = book.title || '';
  card.appendChild(titleEl);

  if (book.author) {
    var authorEl = document.createElement('p');
    authorEl.className = 'shelf-book-author';
    authorEl.textContent = book.author;
    card.appendChild(authorEl);
  }

  var meta = document.createElement('div');
  meta.className = 'shelf-book-meta';

  var statusEl = document.createElement('span');
  statusEl.className = 'shelf-book-status';
  statusEl.textContent = book.status || 'reading';
  meta.appendChild(statusEl);

  if (book.genre) {
    var genreEl = document.createElement('span');
    genreEl.className = 'shelf-book-genre';
    genreEl.textContent = book.genre;
    meta.appendChild(genreEl);
  }

  card.appendChild(meta);
  return card;
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
      isPrivate:  getRegisterDefault('marginalia'),
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

  // Privacy indicator + flip affordance. The text reflects the
  // current value; the link inverts it. Principle #5: anything
  // captured is visible and correctable to the user.
  var privacyEl = document.createElement('span');
  privacyEl.className = 'notebook-entry-privacy';
  privacyEl.appendChild(document.createTextNode(
    entry.isPrivate === true ? 'private ' : 'visible to Yumi '
  ));
  var privacyToggle = document.createElement('a');
  privacyToggle.href = '#';
  privacyToggle.className = 'notebook-entry-privacy-toggle';
  privacyToggle.textContent =
    entry.isPrivate === true ? 'make visible' : 'make private';
  var capturedId = entry.id;
  privacyToggle.addEventListener('click', function(ev) {
    ev.preventDefault();
    togglePrivacy(capturedId);
  });
  privacyEl.appendChild(privacyToggle);
  meta.appendChild(privacyEl);

  var bodyEl = document.createElement('div');
  bodyEl.className = 'notebook-entry-body';
  bodyEl.textContent = entry.body || '';

  card.appendChild(meta);
  card.appendChild(bodyEl);
  return card;
}

// Per-register default lookup. Fail-safe to false (visible) on any
// missing chain link, mirroring the filter's fail-open posture in
// yumi-brain.js. Editor save handlers call this when stamping
// isPrivate on a new entry.
function getRegisterDefault(register) {
  var user = getCurrentUser();
  if (!user) return false;
  var rec = state.users && state.users[user.uid];
  if (!rec) return false;
  var defaults = rec.registerDefaults;
  if (!defaults) return false;
  if (typeof defaults[register] !== 'boolean') return false;
  return defaults[register];
}

// Flip an entry's isPrivate flag in place, persist, and re-render
// the surface the user is currently looking at. Reads location.hash
// at call time so per-entry toggles fired from #book/... stay on
// the book-detail page instead of bouncing to the Notebook.
function togglePrivacy(entryId) {
  var entry = state.notebookEntries && state.notebookEntries[entryId];
  if (!entry) return;
  entry.isPrivate = !(entry.isPrivate === true);
  saveState();
  if (location.hash.indexOf('#book/') === 0) {
    renderBookDetail(state.currentBookId);
  } else {
    renderNotebook();
  }
}

// Mount the register-default settings panel into
// #notebook-settings-host. Called from the header Settings button
// to open the panel, and from setRegisterDefault to re-paint after
// a flip (so the current/toggle labels stay in sync). Plain prose
// in the app literary register -- no Yumi voice.
function openNotebookSettings() {
  var host = document.getElementById('notebook-settings-host');
  if (!host) return;
  var user = getCurrentUser();
  if (!user) return;
  if (typeof ensureUser === 'function') {
    ensureUser(user.uid);
  }

  host.innerHTML = '';

  var panel = document.createElement('div');
  panel.className = 'notebook-settings-panel';

  // Journal section.
  var jSec = document.createElement('div');
  jSec.className = 'notebook-settings-section';

  var jLabel = document.createElement('div');
  jLabel.className = 'notebook-settings-label';
  jLabel.textContent = 'Journal default';
  jSec.appendChild(jLabel);

  var jCurrent = document.createElement('span');
  jCurrent.className = 'notebook-settings-current';
  var jPrivate = getRegisterDefault('journal');
  jCurrent.textContent = jPrivate ? 'private' : 'visible';
  jSec.appendChild(jCurrent);

  var jToggle = document.createElement('a');
  jToggle.href = '#';
  jToggle.className = 'notebook-settings-toggle-link';
  jToggle.textContent = jPrivate ? 'Set to visible' : 'Set to private';
  jToggle.addEventListener('click', function(ev) {
    ev.preventDefault();
    setRegisterDefault('journal', !getRegisterDefault('journal'));
  });
  jSec.appendChild(jToggle);

  var jExp = document.createElement('p');
  jExp.className = 'notebook-settings-explanation';
  jExp.textContent =
    'New Journal entries inherit this visibility on creation. ' +
    'Existing entries keep whatever they were last set to.';
  jSec.appendChild(jExp);

  panel.appendChild(jSec);

  // Marginalia section.
  var mSec = document.createElement('div');
  mSec.className = 'notebook-settings-section';

  var mLabel = document.createElement('div');
  mLabel.className = 'notebook-settings-label';
  mLabel.textContent = 'Marginalia default';
  mSec.appendChild(mLabel);

  var mCurrent = document.createElement('span');
  mCurrent.className = 'notebook-settings-current';
  var mPrivate = getRegisterDefault('marginalia');
  mCurrent.textContent = mPrivate ? 'private' : 'visible';
  mSec.appendChild(mCurrent);

  var mToggle = document.createElement('a');
  mToggle.href = '#';
  mToggle.className = 'notebook-settings-toggle-link';
  mToggle.textContent = mPrivate ? 'Set to visible' : 'Set to private';
  mToggle.addEventListener('click', function(ev) {
    ev.preventDefault();
    setRegisterDefault('marginalia', !getRegisterDefault('marginalia'));
  });
  mSec.appendChild(mToggle);

  var mExp = document.createElement('p');
  mExp.className = 'notebook-settings-explanation';
  mExp.textContent =
    'New Marginalia inherit this visibility on creation. ' +
    'Existing entries keep whatever they were last set to.';
  mSec.appendChild(mExp);

  panel.appendChild(mSec);

  // Done link clears the panel without re-rendering the whole
  // Notebook. The settings host stays mounted; only its contents
  // are emptied.
  var done = document.createElement('a');
  done.href = '#';
  done.className = 'notebook-settings-done';
  done.textContent = 'Done';
  done.addEventListener('click', function(ev) {
    ev.preventDefault();
    var h = document.getElementById('notebook-settings-host');
    if (h) h.innerHTML = '';
  });
  panel.appendChild(done);

  host.appendChild(panel);
}

// Write a register's default isPrivate value on the current user
// record, persist, and re-paint the settings panel in place. Does
// NOT touch existing entries -- per-entry isPrivate is independent
// of the register default after creation.
function setRegisterDefault(register, isPrivate) {
  var user = getCurrentUser();
  if (!user) return;
  if (typeof ensureUser === 'function') {
    ensureUser(user.uid);
  }
  state.users[user.uid].registerDefaults[register] = (isPrivate === true);
  saveState();
  openNotebookSettings();
}

// Mount the "What Yumi sees" panel into #notebook-transparency-host.
// Fresh snapshot from window.YumiBrain.getContextSnapshot() on every
// open -- no live updates while open. Each section renders its
// empty-state copy when its source data is absent. All dynamic text
// goes in via textContent; innerHTML only clears the host.
function openTransparencyView() {
  var host = document.getElementById('notebook-transparency-host');
  if (!host) return;

  var snap = window.YumiBrain.getContextSnapshot();

  host.innerHTML = '';

  var panel = document.createElement('section');
  panel.className = 'transparency-panel';

  // Header: title + close button.
  var header = document.createElement('header');
  header.className = 'transparency-header';

  var title = document.createElement('h2');
  title.className = 'transparency-title';
  title.textContent = 'What Yumi sees';
  header.appendChild(title);

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'transparency-close';
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', function() {
    closeTransparencyView();
  });
  header.appendChild(closeBtn);

  panel.appendChild(header);

  // Framing copy: two paragraphs, verbatim from the Stage 3.6 brief.
  var framing = document.createElement('div');
  framing.className = 'transparency-framing';

  var p1 = document.createElement('p');
  p1.textContent =
    'This is everything Yumi sees right now: the book you are ' +
    'reading, the arc you are following, recent notebook entries ' +
    'that are marked visible, and the conversation you and Yumi ' +
    'have been having. Yumi does not see anything else.';
  framing.appendChild(p1);

  var p2 = document.createElement('p');
  p2.textContent =
    'Entries marked private do not appear here. They stay in the ' +
    'Notebook for the reader and are excluded from what Yumi ' +
    'receives. Yumi sees the three most recent visible entries, ' +
    'trimmed; older or longer writing lives in the Notebook but ' +
    'not in this view. Closing this panel returns to the Notebook.';
  framing.appendChild(p2);

  panel.appendChild(framing);

  // Section: Current book.
  var bookSec = renderTransparencySection('Current book');
  var bookBody = bookSec.querySelector('.transparency-section-body');
  if (snap.currentBook === null) {
    bookBody.textContent = 'No book is open right now.';
  } else {
    var bookText = snap.currentBook.title;
    if (snap.currentBook.author && snap.currentBook.author.length > 0) {
      bookText = bookText + ' by ' + snap.currentBook.author;
    }
    bookBody.textContent = bookText;
  }
  panel.appendChild(bookSec);

  // Section: Current arc.
  var arcSec = renderTransparencySection('Current arc');
  var arcBody = arcSec.querySelector('.transparency-section-body');
  if (snap.currentArc === null) {
    arcBody.textContent = 'No arc is active right now.';
  } else {
    arcBody.textContent = snap.currentArc.title;
  }
  panel.appendChild(arcSec);

  // Section: Recent notebook entries. Bodies are already truncated
  // to 200 chars by assembleContextData -- this is exactly the form
  // Yumi receives.
  var entriesSec = renderTransparencySection('Recent notebook entries');
  var entriesBody = entriesSec.querySelector('.transparency-section-body');
  if (snap.recentEntries.length === 0) {
    entriesBody.textContent =
      'No notebook entries are visible to Yumi right now. New ' +
      'entries or entries marked visible will appear here.';
  } else {
    var i;
    for (i = 0; i < snap.recentEntries.length; i++) {
      entriesBody.appendChild(renderTransparencyEntry(snap.recentEntries[i]));
    }
  }
  panel.appendChild(entriesSec);

  // Section: Conversation summary.
  var summarySec = renderTransparencySection(
    'What Yumi remembers from this conversation'
  );
  var summaryBody = summarySec.querySelector('.transparency-section-body');
  if (!snap.summary) {
    summaryBody.textContent =
      'Nothing has been summarized yet — this happens after a ' +
      'conversation grows past its short-term memory.';
  } else {
    summaryBody.textContent = snap.summary;
  }
  panel.appendChild(summarySec);

  // Section: Recent turns in this conversation.
  var turnsSec = renderTransparencySection(
    'Recent turns in this conversation'
  );
  var turnsBody = turnsSec.querySelector('.transparency-section-body');
  if (snap.recentTurns.length === 0) {
    turnsBody.textContent =
      'No conversation has happened yet in this session.';
  } else {
    var t;
    for (t = 0; t < snap.recentTurns.length; t++) {
      turnsBody.appendChild(renderTransparencyTurn(snap.recentTurns[t]));
    }
  }
  panel.appendChild(turnsSec);

  host.appendChild(panel);
}

// Build the shell of a transparency-section (label + empty body
// div). Callers fill the body. Saves repetition across the five
// sections in openTransparencyView.
function renderTransparencySection(labelText) {
  var sec = document.createElement('section');
  sec.className = 'transparency-section';

  var label = document.createElement('h3');
  label.className = 'transparency-section-label';
  label.textContent = labelText;
  sec.appendChild(label);

  var body = document.createElement('div');
  body.className = 'transparency-section-body';
  sec.appendChild(body);

  return sec;
}

// Render one recentEntries snapshot item as a card: body line plus
// a meta line (register, optional book attribution for marginalia,
// timestamp).
function renderTransparencyEntry(item) {
  var card = document.createElement('article');
  card.className = 'transparency-entry';

  var bodyEl = document.createElement('div');
  bodyEl.className = 'transparency-entry-body';
  bodyEl.textContent = item.body || '';
  card.appendChild(bodyEl);

  var meta = document.createElement('div');
  meta.className = 'transparency-entry-meta';
  var metaText = item.register || 'journal';
  if (item.register === 'marginalia') {
    var bookLabel = item.bookTitle || '(unknown book)';
    metaText = metaText + ' from ' + bookLabel;
  }
  if (item.createdAt) {
    metaText = metaText + ' · ' + new Date(item.createdAt).toLocaleString();
  }
  meta.textContent = metaText;
  card.appendChild(meta);

  return card;
}

// Render one recentTurns snapshot item as role + content.
function renderTransparencyTurn(turn) {
  var line = document.createElement('div');
  line.className = 'transparency-turn';

  var role = document.createElement('span');
  role.className = 'transparency-turn-role';
  if (turn.role === 'assistant') {
    role.textContent = 'Yumi: ';
  } else {
    role.textContent = 'User: ';
  }
  line.appendChild(role);

  var body = document.createElement('span');
  body.className = 'transparency-turn-body';
  body.textContent = turn.content || '';
  line.appendChild(body);

  return line;
}

// Clear the transparency host. Does not re-render the Notebook --
// the host stays mounted, only its contents are emptied. Mirrors
// the Settings panel's "Done" semantics.
function closeTransparencyView() {
  var host = document.getElementById('notebook-transparency-host');
  if (!host) return;
  host.innerHTML = '';
}

window.views = {
  renderRoute:           renderRoute,
  renderNotebook:        renderNotebook,
  renderShelf:           renderShelf,
  renderBookDetail:      renderBookDetail,
  openJournalEditor:     openJournalEditor,
  openMarginaliaEditor:  openMarginaliaEditor,
  openNotebookSettings:  openNotebookSettings,
  togglePrivacy:         togglePrivacy,
  setRegisterDefault:    setRegisterDefault,
  openTransparencyView:  openTransparencyView,
  closeTransparencyView: closeTransparencyView
};

console.log('views.js loaded');
