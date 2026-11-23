window.T = {
  uid: function () { var u = getCurrentUser(); return u ? u.uid : null; },
  bookIds: function () { var u = T.uid(); return (state.userBooks[u] && state.userBooks[u].bookIds) ? state.userBooks[u].bookIds.slice() : []; },
  // the Add-a-book write site (views.js, openShelfEditor's save), statement for statement
  addBook: function (title) {
    var user = getCurrentUser(), id = 'bk_' + title.replace(/[^a-z0-9]/gi, '_');
    state.books[id] = { id: id, title: title, author: 'A. Author', isbn: '', addedAt: Date.now(), status: 'reading', genre: '', coverUrl: null };
    ensureBookFields(state.books[id]);
    ensureUser(user.uid);
    state.userBooks[user.uid].bookIds.push(id);
    markBookPending(user.uid, id);
    markBooksDirty();
    saveState();
    return id;
  },
  // a status edit, as the book page's sites do it
  editBook: function (id, status) { state.books[id].status = status; markBooksDirty(); saveState(); },
  note: function (body) { captureNote('marginalia', body, 'inbox', [], true); return nbJustSavedId; },   // the real writer
  editNote: function (id, body) { return updateNotebookEntryBody(id, body); },                        // the real accessor
  delNote: function (id) { var ok = deleteEntry(id); saveState(); return ok; },                        // the real delete + its caller's save
  notes: function () { var u = T.uid(), out = {}, k; for (k in state.notebookEntries) { if (state.notebookEntries[k] && state.notebookEntries[k].userId === u) { out[k] = state.notebookEntries[k].body; } } return out; },
  arc: function (title) { var a = createArc(title, '', T.uid(), null); markArcsDirty(); saveState(); return a ? a.id : null; },
  editArc: function (id, title) { state.arcs[id].title = title; state.arcs[id].updatedAt = Date.now(); markArcsDirty(); saveState(); },
  arcs: function () { var u = T.uid(), out = {}, k; for (k in state.arcs) { if (state.arcs[k] && state.arcs[k].userId === u) { out[k] = state.arcs[k].title; } } return out; },
  latches: function () { return { books: booksLoaded, arcs: arcsLoaded, subTheories: subTheoriesLoaded, themes: themesLoaded, artifacts: artifactsLoaded, notebook: notebookLoaded }; },
  pending: function (kind) { return (typeof getPendingSync === 'function') ? getPendingSync(kind, T.uid()).slice() : []; },
  pendingDel: function (kind) { return (typeof getPendingDeletes === 'function') ? getPendingDeletes(kind, T.uid()).slice() : []; },
  toast: function () { var t = document.querySelector('.praxis-toast'); return t ? t.textContent : null; },
  online: function () { window.dispatchEvent(new Event('online')); },
  // does FB-1a's print of a book name exactly the fields the repo's own mergeBookFingerprint names?
  printsAgree: function () { var ids = T.bookIds(), i, bad = []; for (i = 0; i < ids.length; i++) { if (fb1aPrint('books', state.books[ids[i]]) !== mergeBookFingerprint(state.books[ids[i]])) { bad.push(ids[i]); } } return bad; },
  // what the app writes by itself, statement for statement as its own code leaves a record:
  stampUncategorized: function () { var ids = T.bookIds(), i, n = 0; for (i = 0; i < ids.length; i++) { if (!state.books[ids[i]].category) { state.books[ids[i]].category = CATEGORY_UNCATEGORIZED; n = n + 1; } } markBooksDirty(); saveState(); return n; },   // applyClassifyBatch on a failed call
  coverBackfill: function (id) { var b = state.books[id]; b.coverUrl = 'http://127.0.0.1:1/c.jpg'; b.coverCandidates = ['http://127.0.0.1:1/c.jpg']; b.publisher = 'A Press'; b.pageCount = 321; markBooksDirty(); saveState(); },   // the cover backfill landing
  lens: function (name) { var t = createUserTheme(name); if (typeof markThemesDirty === 'function') { markThemesDirty(); } saveState(); return t ? t.id : null; },
  artifact: function (bookId, body) { var u = T.uid(), now = Date.now(); ensureOneArtifact(u, bookId, { userId: u, bookId: bookId, title: 'An artifact', body: body, createdAt: now, updatedAt: now, yumiMayRead: false, yumiMayReadAt: 0 }); markArtifactsDirty(); saveState(); return artifactKey(u, bookId); },
  lenses: function () { var u = T.uid(), out = {}, k; for (k in state.userThemes) { if (state.userThemes[k] && state.userThemes[k].userId === u) { out[k] = state.userThemes[k].name; } } return out; },
  del: function () { return new Promise(function (res) { deleteAccount(function (r) {
    res({ status: r.status, phase: r.phase || null, recoverable: !!r.recoverable, msg: (r.error && r.error.message) || null }); }, function () {}); }); }
};
