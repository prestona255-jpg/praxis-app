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
//         shelf-book-meta, shelf-book-status, shelf-book-genre,
//         shelf-new-book, shelf-signin-prompt, shelf-editor,
//         shelf-editor-title-input, shelf-editor-author-input,
//         shelf-editor-status, shelf-editor-status-option,
//         shelf-editor-genre-input, shelf-editor-isbn-input,
//         shelf-editor-actions, shelf-editor-save, shelf-editor-cancel
//   3.5b: shelf-book-cover, shelf-book-cover-placeholder,
//         book-detail-cover-placeholder, book-detail-isbn-row,
//         book-detail-isbn-label, book-detail-isbn-input
//   3.8:  notebook-new-arc, notebook-arc-list-block,
//         notebook-arc-list-title, notebook-arc-empty-body,
//         notebook-arc-list, notebook-arc-row, notebook-arc-title,
//         notebook-arc-description
//   3.8 2b-i: book-detail-add-to-arc, arc-picker-panel,
//         arc-picker-label, arc-picker-status, arc-picker-empty,
//         arc-picker-row, arc-picker-done
//   3.8 2b-ii: notebook-entry-add-to-arc,
//         notebook-entry-arc-picker-host
//   3.9-a: arc-detail, arc-detail-header, arc-detail-title,
//         arc-detail-description, arc-detail-delete,
//         arc-detail-empty-body, arc-detail-member-list,
//         arc-detail-missing-member, arc-detail-not-found
//   3.9-b: arc-confirm-panel, arc-confirm-copy, arc-confirm-actions,
//         arc-confirm-confirm, arc-confirm-cancel,
//         arc-confirm-stale-note, arc-confirm-stale-back
//   Editor host ids: #notebook-editor-host (3.2),
//                    #book-detail-editor-host (3.3),
//                    #shelf-editor-host (3.5a),
//                    #notebook-arc-editor-host (3.8)
//   Picker host ids: #book-detail-arc-picker-host (3.8 2b-i),
//                    .notebook-entry-arc-picker-host (3.8 2b-ii,
//                    per-card inline mount, not an id)
//   Confirm host id: #arc-detail-confirm-host (3.9-a, 3.9-b wires)
//   Settings host id:     #notebook-settings-host (3.4b)
//   Transparency host id: #notebook-transparency-host (3.6)
//
// Stage 3.5a: renderShelf paints the Books surface -- header (title
// + auth-aware add affordance: "+ Add book" if signed in,
// "Sign in to add books" otherwise) + editor host (#shelf-editor-host)
// + book list (or empty-state paragraph). The list reads from
// state.books (not state.userBooks) so book_test_1 from 3.3 console
// seeding stays visible despite never being written to userBooks --
// the pre-existing drift documented in the 3.5a brief. Filter pills
// are deferred; this sub-stage renders every record in state.books,
// newest first by addedAt. Each row is an anchor to #book/<id> so
// click-through hits the existing book-detail surface.
// renderShelfBook is the single row renderer.
//
// openShelfEditor mounts an inline title/author/status/genre/isbn
// form into #shelf-editor-host. Save (disabled until trimmed title
// is non-empty) calls genBookId, writes a complete books record
// with id, title, author, isbn (trimmed; may be ''), addedAt,
// status, genre, coverUrl (null at write time), then ensureUser
// + push to state.userBooks[uid].bookIds, persists via saveState,
// re-renders via renderShelf. Cancel re-renders the shelf without
// writing -- state.books and state.userBooks are untouched. Auth
// gate mirrors renderBookDetail header: when getCurrentUser() is
// null, the affordance becomes "Sign in to add books" and click
// routes to signInWithGoogle(), not openShelfEditor.
//
// Stage 3.5b: when isbn is non-empty after trim, the save handler
// fires fetchAndApplyCover(id, isbn, onComplete) in the background
// AFTER the synchronous write+saveState+renderShelf path completes.
// The cover arrives asynchronously and patches state.books[id]
// .coverUrl when the integrations callback fires; renderShelf is
// re-called only if the user is still on #books at that moment
// (route check, not currentBookId check -- both #books and
// #notebook clear currentBookId, so route inspection is the
// faithful signal). The fail-soft contract is enforced in
// fetchAndApplyCover: null returns, throws, empty/null coverUrl
// fields, and OL "id=0" / "/id/0-" placeholder URLs all resolve
// to state.books[id].coverUrl === null. The book record itself
// is written regardless of fetch outcome.
//
// Stage 3.5b Stage 3: fetchAndApplyCover's onComplete signature
// extends to (url, result). The save handler's callback uses
// result.title and result.author to backfill state.books[id]
// .title and .author -- but only when the user's typed form
// fields (titleTrimmed / authorTrimmed, closure-captured at save
// time) were blank. The user's typed values are authoritative;
// we only fill the gaps. Same typeof-string + length>0 guard as
// coverUrl: any missing/null/empty API value leaves the record
// field as-is. The blur handler on book detail also receives the
// (url, result) signature but ignores result -- per 3.5b Stage 3
// brief Non-Goal: ISBN edits on book detail do not backfill
// metadata, since the user's existing title and author there
// are authoritative.
//
// Stage 3.5b Stage 2: renderShelfBook prepends a cover thumbnail
// (img.shelf-book-cover) when book.coverUrl is a non-empty string,
// otherwise a placeholder div (shelf-book-cover-placeholder) so
// the row layout stays stable. renderBookDetail mirrors this on
// the full-cover element. A new ISBN row mounts between the
// book-detail header and the editor host with an addEventListener
// 'blur' handler implementing the re-fetch contract:
//   - trimmed === priorIsbn (closure-cached at render time): no-op
//   - trimmed === '': clear state.books[bookId].isbn and coverUrl,
//                     saveState, renderBookDetail. No fetch.
//   - trimmed non-empty and changed: persist new isbn, saveState,
//                     fetchAndApplyCover(bookId, trimmed, cb). cb
//                     re-renders only if the user is still on
//                     #book/<bookId> when the fetch completes.
// First onblur-driven handler in the codebase; no prior pattern
// to mirror.
//
// var/function only -- no const, let, arrow, class, or template
// literals anywhere. String concatenation only.
// =====================================================================

'use strict';

var APP_EL_ID = 'app';

// Stage 5.3 Stage 4: Bookshop.org affiliate configuration for the
// "Find this book" line that renders on arc-detail member books and
// the book-detail header. C5 spec: honest availability framing, never
// "BUY NOW", one restrained line, no store styling. The affiliate ID
// is a hardcoded constant rather than a config file because it's a
// single value with one consumer; future affiliate config (Amazon
// fallback, etc.) can earn its own file when a second value lands.
//
// When BOOKSHOP_AFFILIATE_ID is the empty string (today's value --
// Preston has not yet completed the Bookshop affiliate application,
// per README.md:26), buildBookshopUrl returns the keyword-search URL
// so the link still works and points at Bookshop, just without
// affiliate revenue. Preston edits the one constant below + bumps
// CACHE_VERSION when his ID arrives; no other code changes needed.
var BOOKSHOP_AFFILIATE_ID = '';

// Returns the Bookshop.org URL for a given ISBN, or null if the ISBN
// is missing / empty. Strips dashes and whitespace before insertion
// so a user-entered "978-0061-120060" formats correctly. Callers MUST
// check for null and skip rendering the link in that case -- a book
// with no ISBN gets no "Find this book" line (the line is honest
// availability, not a fallback search).
//
// Affiliate path:  https://bookshop.org/a/<id>/<isbn>
// Fallback path:   https://bookshop.org/search?keywords=<isbn>
//                  (live-probed at Stage 4 commit time: this URL
//                  302-redirects to Bookshop's /beta-search results
//                  page with the ISBN preserved. The plausible-looking
//                  /books?keywords=<isbn> form was probed too but
//                  302-redirects to the homepage with a dangling
//                  query, not a real search result. The /search form
//                  is the working endpoint.)
// Both surfaces are real Bookshop URLs; the fallback just lacks the
// affiliate kickback attribution.
function buildBookshopUrl(isbn) {
  if (typeof isbn !== 'string') return null;
  var normalized = isbn.replace(/[-\s]/g, '');
  if (normalized.length === 0) return null;
  if (BOOKSHOP_AFFILIATE_ID && BOOKSHOP_AFFILIATE_ID.length > 0) {
    return 'https://bookshop.org/a/' +
           encodeURIComponent(BOOKSHOP_AFFILIATE_ID) +
           '/' + encodeURIComponent(normalized);
  }
  return 'https://bookshop.org/search?keywords=' +
         encodeURIComponent(normalized);
}

// Stage 5.4 Stage 1b: arc-detail view-mode persistence. localStorage,
// global key (one preference across all arcs), default 'list'. The
// unknown-value branch in getArcViewMode coerces any corrupt /
// hand-edited ls value back to the safe default rather than letting
// it propagate into the renderArcDetail branch. setArcViewMode
// mirrors the same allow-list so a bad call site (future caller
// passing a typo) cannot poison the stored value.
function getArcViewMode() {
  var mode = ls('praxis_arc_view_mode', 'list');
  if (mode !== 'list' && mode !== 'web') {
    return 'list';
  }
  return mode;
}

function setArcViewMode(mode) {
  if (mode !== 'list' && mode !== 'web') {
    return;
  }
  sv('praxis_arc_view_mode', mode);
}

// 3.10a Stage 4: guards initNavMobileToggle so the hamburger
// listener binds exactly once across the session. Module-level so
// the flag persists across renderRoute calls.
var navMobileToggleInitialized = false;

// 3.10a Stage 4: bind the mobile hamburger toggle. Called by
// renderRoute on first invocation only (guarded by
// navMobileToggleInitialized). The hamburger click toggles
// .app-nav-mobile-open on the nav; one addEventListener, no per-
// link close handlers (the panel closes when a link is tapped via
// renderRoute, which runs on every hashchange and removes the open
// class -- see the renderRoute body). The nav lives in static
// index.html so this can run any time after DOMContentLoaded;
// renderRoute is dispatched by app.js immediately after, so first-
// call binding is safe.
function initNavMobileToggle() {
  var navEl = document.querySelector('.app-nav');
  var ham = document.querySelector('.app-nav-hamburger');
  if (!navEl || !ham) return;
  ham.addEventListener('click', function() {
    if (navEl.classList.contains('app-nav-mobile-open')) {
      navEl.classList.remove('app-nav-mobile-open');
    } else {
      navEl.classList.add('app-nav-mobile-open');
    }
  });
}

function renderRoute() {
  // 3.10a Stage 4: bind the hamburger toggle once on first call,
  // then close any open mobile nav panel on every route change.
  // app.js's existing hashchange listener calls renderRoute on
  // every URL change, so tapping a nav link inside the open panel
  // -> URL changes -> renderRoute fires -> classList.remove
  // closes the panel. No per-link addEventListener required.
  if (!navMobileToggleInitialized) {
    initNavMobileToggle();
    navMobileToggleInitialized = true;
  }
  var navOpen = document.querySelector('.app-nav');
  if (navOpen) {
    navOpen.classList.remove('app-nav-mobile-open');
  }

  var rest = location.hash.replace(/^#/, '');
  var parts = rest.split('/');

  // Stage 3.10a Stage A: toggle .app-nav-link-active on the top-nav
  // link that matches the current route. Book detail and Artifact
  // are sub-surfaces of the shelf so they keep Books highlighted.
  // Empty / unknown hashes converge on Notebook downstream, so the
  // active-link signal matches that convergence here.
  //
  // Stage 5.3 Stage 2: arc detail (#arc/<id>) is the sub-surface of
  // the Arcs page in the same way book detail is the sub-surface of
  // the shelf -- both keep Arcs highlighted. #arcs (plural, the
  // teaching page) is the canonical Arcs route. Order matters: the
  // 'arc' / 'arcs' branch must come BEFORE the books branch so a hash
  // like 'arc/abc' (parts[0] === 'arc') is caught here, not later.
  var activeRoute;
  if (parts[0] === 'arc' || parts[0] === 'arcs') {
    activeRoute = 'arcs';
  } else if (parts[0] === 'book' || parts[0] === 'artifact' ||
      parts[0] === 'books') {
    activeRoute = 'books';
  } else {
    activeRoute = 'notebook';
  }
  var links = document.querySelectorAll('.app-nav-link');
  var i;
  for (i = 0; i < links.length; i++) {
    if (links[i].getAttribute('data-route') === activeRoute) {
      links[i].classList.add('app-nav-link-active');
    } else {
      links[i].classList.remove('app-nav-link-active');
    }
  }

  // 3.9: every route block leaves exactly one of {currentBookId,
  // currentArcId} set (or both null), never a stale pairing. Entering a
  // book leaves any arc; entering an arc leaves any book; the shelf and
  // notebook clear both. yumi-brain reads both slots ([yumi-brain.js
  // currentArc lens]) so a stale value in either is a stale-context
  // bug. The symmetric-clear pattern below is the prevention.
  if (parts[0] === 'book' && parts[1]) {
    state.currentBookId = parts[1];
    state.currentArcId  = null;
    saveState();
    renderBookDetail(parts[1]);
    return;
  }
  if (parts[0] === 'artifact' && parts[1]) {
    // Artifact view sets currentBookId so yumi-brain's current-book
    // lens stays coherent across the workshop / finished-room boundary
    // -- the user is still engaged with this book, just on its
    // retrospective surface rather than the in-progress one.
    state.currentBookId = parts[1];
    state.currentArcId  = null;
    saveState();
    renderArtifact(parts[1]);
    return;
  }
  if (parts[0] === 'arc' && parts[1]) {
    // 3.9: arc detail. Setting currentArcId keeps yumi-brain's
    // currentArc context lens accurate; clearing currentBookId is the
    // symmetric half (entering an arc is leaving any book).
    state.currentArcId  = parts[1];
    state.currentBookId = null;
    saveState();
    renderArcDetail(parts[1]);
    return;
  }
  if (parts[0] === 'books') {
    // Shelf surface (3.5a). currentBookId clears symmetrically with
    // the notebook path so yumi-brain does not carry a stale book
    // reference into a shelf-scoped session.
    state.currentBookId = null;
    state.currentArcId  = null;
    saveState();
    renderShelf();
    return;
  }
  if (parts[0] === 'arcs') {
    // Stage 5.3 Stage 1: Arcs page (singular hash, no parameter).
    // The teaching surface; distinct from #arc/<id> (arc detail).
    // Symmetric clear of both pointer fields, mirroring the books
    // and notebook branches -- entering the Arcs page is leaving
    // both any book and any specific arc.
    state.currentBookId = null;
    state.currentArcId  = null;
    saveState();
    renderArcsPage();
    return;
  }
  // Notebook (explicit), empty hash, and any unknown route all
  // converge on the unified Notebook view. currentBookId clears
  // symmetrically on the way in so yumi-brain's retrieval path
  // does not carry a stale book reference.
  state.currentBookId = null;
  state.currentArcId  = null;
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

    var newArcBtn = document.createElement('button');
    newArcBtn.type = 'button';
    newArcBtn.className = 'notebook-new-arc';
    newArcBtn.textContent = '+ New arc';
    newArcBtn.addEventListener('click', function() {
      openArcEditor();
    });
    header.appendChild(newArcBtn);

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

  // Stage 3.8: arc editor host -- empty on every render; openArcEditor
  // mounts the title + description form here on demand. Placed
  // adjacent to the entry editor host so the arc affordance and the
  // entry affordance share the same mount-region of the surface.
  var arcEditorHost = document.createElement('div');
  arcEditorHost.id = 'notebook-arc-editor-host';
  wrap.appendChild(arcEditorHost);

  // Stage 3.8: arc-list block. Always renders (the heading is the
  // durable cue that arcs exist, surviving past first-create when the
  // empty-state line goes away). Filter by current user, newest-first
  // by createdAt -- mirrors the chronological stream's ordering
  // convention. Rows are inert this stage; arc detail navigation is
  // 3.9. Block lives ABOVE the chronological item stream and BELOW
  // the header / editor hosts.
  var arcBlock = document.createElement('section');
  arcBlock.className = 'notebook-arc-list-block';

  var arcHeading = document.createElement('h2');
  arcHeading.className = 'notebook-arc-list-title';
  arcHeading.textContent = 'Arcs';
  arcBlock.appendChild(arcHeading);

  var arcItems = [];
  var arcMap = state.arcs || {};
  var arcKey;
  for (arcKey in arcMap) {
    if (Object.prototype.hasOwnProperty.call(arcMap, arcKey)) {
      var arc = arcMap[arcKey];
      if (arc && user && arc.userId === user.uid) {
        arcItems.push(arc);
      }
    }
  }
  arcItems.sort(function(x, y) {
    return (y.createdAt || 0) - (x.createdAt || 0);
  });

  if (arcItems.length === 0) {
    var arcEmpty = document.createElement('p');
    arcEmpty.className = 'notebook-arc-empty-body';
    arcEmpty.textContent =
      'No arcs yet. Use + New arc to start one.';
    arcBlock.appendChild(arcEmpty);
  } else {
    var arcList = document.createElement('div');
    arcList.className = 'notebook-arc-list';
    var ai;
    for (ai = 0; ai < arcItems.length; ai++) {
      arcList.appendChild(renderArcRow(arcItems[ai]));
    }
    arcBlock.appendChild(arcList);
  }

  wrap.appendChild(arcBlock);

  var entryHeading = document.createElement('h2');
  entryHeading.className = 'notebook-entry-list-title';
  entryHeading.textContent = 'Entries';
  wrap.appendChild(entryHeading);

  // Stage 3.7: /notebook unifies notebookEntries + bookArtifacts as
  // distinct card kinds in one chronological stream owned by the
  // current user. Interleaved by createdAt, newest first. Each item
  // is tagged with its kind so the render loop can dispatch to the
  // right card renderer -- entry cards keep their existing affordances
  // (privacy toggle, register marker, book attribution); Artifact
  // cards are click-through navigation to #artifact/<bookId>.
  var items = [];
  var entryMap = state.notebookEntries || {};
  var key;
  for (key in entryMap) {
    if (Object.prototype.hasOwnProperty.call(entryMap, key)) {
      var e = entryMap[key];
      if (e && user && e.userId === user.uid) {
        items.push({ kind: 'entry', createdAt: e.createdAt || 0, data: e });
      }
    }
  }
  var artifactMap = state.bookArtifacts || {};
  var aKey;
  for (aKey in artifactMap) {
    if (Object.prototype.hasOwnProperty.call(artifactMap, aKey)) {
      var a = artifactMap[aKey];
      if (a && user && a.userId === user.uid) {
        items.push({ kind: 'artifact', createdAt: a.createdAt || 0, data: a });
      }
    }
  }
  items.sort(function(x, y) {
    return y.createdAt - x.createdAt;
  });

  if (items.length === 0) {
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
    for (i = 0; i < items.length; i++) {
      if (items[i].kind === 'artifact') {
        list.appendChild(renderArtifactCard(items[i].data));
      } else {
        list.appendChild(renderNotebookEntry(items[i].data));
      }
    }
    wrap.appendChild(list);
  }

  host.appendChild(wrap);
}

// Stage 3.7: shared editor shell. Mounts a title (optional) + body
// textarea + Save/Cancel block into the host element identified by
// opts.hostId. Three callers as of 3.7: openJournalEditor and
// openMarginaliaEditor (body-only entries into state.notebookEntries)
// and openArtifactEditor (title + body, write into state.bookArtifacts
// via ensureOneArtifact).
//
// opts shape:
//   hostId:         string         // DOM id of the mount point.
//   emptySelector:  string | null  // CSS selector for an empty-state
//                                  // element to hide on mount. null
//                                  // if none.
//   showTitleField: boolean        // render a title input above body.
//   titlePrefill:   string         // initial value when showTitleField
//                                  // is true; ignored otherwise.
//   onSave(title, body):           // both trimmed strings; only the
//                                  // gated field is guaranteed non-empty.
//   onCancel():
//
// Save-enabled gate is field-driven, not caller-driven: title-bearing
// editors enable Save when the title trims non-empty (body optional --
// the Artifact's body is genuinely optional per 3.7 brief), body-only
// editors enable Save when the body trims non-empty (existing journal /
// marginalia behavior, unchanged).
function openEditor(opts) {
  var hostEl = document.getElementById(opts.hostId);
  if (!hostEl) return;

  if (opts.emptySelector) {
    var emptyEl = document.querySelector(opts.emptySelector);
    if (emptyEl) emptyEl.style.display = 'none';
  }

  hostEl.innerHTML = '';

  var editor = document.createElement('div');
  editor.className = 'notebook-editor';

  var titleInput = null;
  if (opts.showTitleField) {
    titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'notebook-editor-title-input';
    titleInput.value = (typeof opts.titlePrefill === 'string')
      ? opts.titlePrefill : '';
  }

  var bodyInput = document.createElement('textarea');
  bodyInput.className = 'notebook-editor-body';
  bodyInput.rows = 8;

  var actions = document.createElement('div');
  actions.className = 'notebook-editor-actions';

  var saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'notebook-editor-save';
  saveBtn.textContent = 'Save';

  var cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'notebook-editor-cancel';
  cancelBtn.textContent = 'Cancel';

  function trimVal(el) {
    return el.value.replace(/^\s+|\s+$/g, '');
  }

  function refreshSaveEnabled() {
    var ok;
    if (opts.showTitleField) {
      ok = trimVal(titleInput).length > 0;
    } else {
      ok = trimVal(bodyInput).length > 0;
    }
    saveBtn.disabled = !ok;
  }
  refreshSaveEnabled();

  bodyInput.addEventListener('input', refreshSaveEnabled);
  if (titleInput) {
    titleInput.addEventListener('input', refreshSaveEnabled);
  }

  saveBtn.addEventListener('click', function() {
    var titleVal = titleInput ? trimVal(titleInput) : '';
    var bodyVal  = trimVal(bodyInput);
    if (opts.showTitleField) {
      if (titleVal.length === 0) return;
    } else {
      if (bodyVal.length === 0) return;
    }
    opts.onSave(titleVal, bodyVal);
  });

  cancelBtn.addEventListener('click', function() {
    opts.onCancel();
  });

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  if (titleInput) editor.appendChild(titleInput);
  editor.appendChild(bodyInput);
  editor.appendChild(actions);
  hostEl.appendChild(editor);

  if (titleInput) {
    titleInput.focus();
    titleInput.select();
  } else {
    bodyInput.focus();
  }
}

function openJournalEditor() {
  openEditor({
    hostId:         'notebook-editor-host',
    emptySelector:  '.notebook-empty-body',
    showTitleField: false,
    onSave: function(_titleVal, bodyVal) {
      var user = getCurrentUser();
      if (!user) return;
      var now = Date.now();
      var id  = genEntryId();
      var entry = {
        id:         id,
        userId:     user.uid,
        register:   'journal',
        isPrivate:  getRegisterDefault('journal'),
        body:       bodyVal,
        bookIds:    [],
        arcIds:     [],
        createdAt:  now,
        updatedAt:  now
      };
      state.notebookEntries[id] = entry;
      saveState();
      renderNotebook();
    },
    onCancel: function() {
      renderNotebook();
    }
  });
}

// Stage 3.8: arc creation editor. Thin wrapper around openEditor --
// title field is required (Save auto-disabled while empty; onSave does
// not fire on empty input), body field carries the optional
// description. onSave resolves the user via getCurrentUser, no-ops if
// absent (mirrors openJournalEditor), then calls createArc with
// (title, description, user.uid). createArc returns null only on
// empty-title (already gated by the openEditor disabled-Save
// validation, so this is belt-and-suspenders); on success the
// saveState + renderNotebook sequence matches the entry-creation path
// exactly. Cancel just re-renders, which clears the editor host as
// part of the full tree rebuild.
function openArcEditor() {
  openEditor({
    hostId:         'notebook-arc-editor-host',
    showTitleField: true,
    onSave: function(titleVal, bodyVal) {
      var user = getCurrentUser();
      if (!user) return;
      var arc = createArc(titleVal, bodyVal, user.uid);
      if (!arc) return;
      saveState();
      renderNotebook();
    },
    onCancel: function() {
      renderNotebook();
    }
  });
}

// Stage 5.3 Stage 2: the Arcs page. Renders the locked C2 teaching
// paragraph (design-system v2 Part C) and the C4 Create-an-arc CTA
// alongside three steps from living-doc Section 10. Worked examples
// (Stage 3) and Find-this-book (Stage 4) land in subsequent sub-
// stages. Routes from the #arcs hash via renderRoute. Distinct from
// the existing #arc/<id> arc-detail surface (renderArcDetail) -- this
// is the plural list/teaching surface that lives in the top nav.
//
// CTA wiring: the "Create an arc" button calls the existing
// openArcEditor() unchanged. openArcEditor mounts into the hostId
// 'notebook-arc-editor-host', so this page renders that div NESTED
// inside the spec-named #arcs-create-host wrapper -- the wrapper is
// the Arcs-page CSS scope; the inner div is the openArcEditor mount
// point. On save / cancel openArcEditor calls renderNotebook(), so
// the user lands on the Notebook surface after creating from here.
// (Stage 2 question for Preston: is that the intended post-create
// landing, or should the CTA path return to the Arcs page or the new
// arc's detail page? Implementation today preserves openArcEditor
// strictly.)
function renderArcsPage() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'arcs-page';

  var header = document.createElement('header');
  header.className = 'arcs-page-header';

  var title = document.createElement('h1');
  title.className = 'arcs-page-title';
  title.textContent = 'Arcs';
  header.appendChild(title);

  // C2 teaching paragraph, verbatim from docs/praxis-design-system.md
  // Part C. Em dashes are U+2014 (real), not "--". One paragraph, in
  // Yumi's voice -- the paragraph IS the teaching panel.
  var teaching = document.createElement('p');
  teaching.className = 'arcs-teaching';
  teaching.textContent =
    'An arc is a path you build through your reading — ' +
    'books from any tradition, set side by side, so they speak ' +
    'to each other.';
  header.appendChild(teaching);

  wrap.appendChild(header);

  // C4 Create-an-arc section. Two-part layout: button on the left,
  // three-step numbered list on the right (collapses to stacked on
  // mobile via components.css). Button mount: arcs-create-host is the
  // page-scoped wrapper; the nested notebook-arc-editor-host is the
  // mount point openArcEditor looks up by id. Hosting both means
  // openArcEditor's hard-coded hostId still resolves.
  var createSec = document.createElement('section');
  createSec.className = 'arcs-create';

  var createHost = document.createElement('div');
  createHost.id = 'arcs-create-host';
  createHost.className = 'arcs-create-host';

  var createBtn = document.createElement('button');
  createBtn.type = 'button';
  createBtn.className = 'arcs-create-btn';
  createBtn.textContent = 'Create an arc';
  createBtn.addEventListener('click', function() {
    openArcEditor();
  });
  createHost.appendChild(createBtn);

  // Editor mount point. openArcEditor (views.js openArcEditor) calls
  // openEditor({ hostId: 'notebook-arc-editor-host', ... }) -- this
  // div provides the lookup target on the Arcs page.
  var arcEditorHost = document.createElement('div');
  arcEditorHost.id = 'notebook-arc-editor-host';
  createHost.appendChild(arcEditorHost);

  createSec.appendChild(createHost);

  // Three steps from living-doc Section 10, compressed to fit beside
  // the CTA without losing substance. Real <ol>; default numbering
  // styled by .arcs-create-steps in components.css.
  var steps = document.createElement('ol');
  steps.className = 'arcs-create-steps';

  var step1 = document.createElement('li');
  step1.textContent =
    'Name the question. The arc\'s title is the question ' +
    'you\'re following, in your words.';
  steps.appendChild(step1);

  var step2 = document.createElement('li');
  step2.textContent =
    'Link your books. Add books from your shelf that speak to ' +
    'the question.';
  steps.appendChild(step2);

  var step3 = document.createElement('li');
  step3.textContent =
    'Tag your notes. Pull marginalia and journal entries from ' +
    'those books into the arc.';
  steps.appendChild(step3);

  createSec.appendChild(steps);
  wrap.appendChild(createSec);

  // Stage 5.3 Stage 3b: worked-example cards. Two cards in one section,
  // no parent heading -- the visual contrast (live opaque card with
  // five book covers vs. illustrated muted card with an "Illustrated
  // example" label) does the orienting work that an h2 would. Adding
  // a heading here would compete with the page <h1>Arcs</h1> for
  // attention and break the read-flow: teaching paragraph -> CTA ->
  // examples should feel like one cascading lesson, not three
  // separately-titled sections.
  //
  // The Pedagogy of Desire card reads from state.seeds.pedagogyOfDesire
  // at render time -- never hardcoded ids. Triple guard: missing seeds
  // map, missing pedagogyOfDesire entry, OR missing arc record all
  // skip the card cleanly rather than render a broken element. The
  // arc record can be legitimately absent if a signed-in user deletes
  // the seed via the arc-detail Delete button (Stage 0 design: stays
  // deleted; the page is intentionally degraded after delete).
  //
  // The Pedagogy of Flow card has NO seeded data -- it's an illustrated
  // example, deliberately not a real arc (design-system v2 Part C3:
  // "One live, one illustrated: shows the range of what an arc can
  // be without seeding two."). Rendered as <div>, not <a>, so it
  // carries no click target. The "Illustrated example" label and
  // the lighter CSS treatment carry the meaning.
  var examplesSec = document.createElement('section');
  examplesSec.className = 'arcs-examples';

  var seedInfo = state.seeds && state.seeds.pedagogyOfDesire;
  var seedArc = seedInfo &&
                seedInfo.arcId &&
                state.arcs &&
                state.arcs[seedInfo.arcId];
  if (seedArc) {
    var desireCard = document.createElement('a');
    desireCard.className = 'arc-card arc-card-live';
    desireCard.href = '#arc/' + seedInfo.arcId;

    var desireText = document.createElement('div');
    desireText.className = 'arc-card-text';

    var desireTitle = document.createElement('h3');
    desireTitle.className = 'arc-card-title';
    desireTitle.textContent = seedArc.title || 'A Pedagogy of Desire';
    desireText.appendChild(desireTitle);

    var desireDesc = document.createElement('p');
    desireDesc.className = 'arc-card-description';
    desireDesc.textContent = seedArc.description || '';
    desireText.appendChild(desireDesc);

    desireCard.appendChild(desireText);

    // Five cover thumbnails read from state.books at render time. Null
    // coverUrl falls back to a placeholder block matching the shelf
    // pattern -- covers may still be backfilling on first load (the
    // app.js async fetchAndApplyCover loop hasn't settled yet) and
    // again on later loads if Open Library / Google Books couldn't
    // resolve a particular ISBN. The card stays well-formed either way.
    var covers = document.createElement('div');
    covers.className = 'arc-card-covers';
    var bookIds = (seedInfo.bookIds && seedInfo.bookIds.length)
      ? seedInfo.bookIds : [];
    var ci;
    for (ci = 0; ci < bookIds.length; ci++) {
      var coverBook = state.books && state.books[bookIds[ci]];
      if (coverBook && coverBook.coverUrl) {
        var coverImg = document.createElement('img');
        coverImg.className = 'arc-card-cover';
        coverImg.src = coverBook.coverUrl;
        coverImg.alt = '';
        covers.appendChild(coverImg);
      } else {
        var coverPh = document.createElement('div');
        coverPh.className = 'arc-card-cover-placeholder';
        covers.appendChild(coverPh);
      }
    }
    desireCard.appendChild(covers);

    examplesSec.appendChild(desireCard);
  }

  var flowCard = document.createElement('div');
  flowCard.className = 'arc-card arc-card-illustrated';

  var flowLabel = document.createElement('span');
  flowLabel.className = 'arc-card-label';
  flowLabel.textContent = 'Illustrated example';
  flowCard.appendChild(flowLabel);

  var flowText = document.createElement('div');
  flowText.className = 'arc-card-text';

  var flowTitle = document.createElement('h3');
  flowTitle.className = 'arc-card-title';
  flowTitle.textContent = 'A Pedagogy of Flow';
  flowText.appendChild(flowTitle);

  var flowDesc = document.createElement('p');
  flowDesc.className = 'arc-card-description';
  flowDesc.textContent =
    'Five books on intersectionality as connective tissue — ' +
    'sound studies, relationships, psychoanalysis, systems, ' +
    'and environment, read as one weather.';
  flowText.appendChild(flowDesc);

  flowCard.appendChild(flowText);
  examplesSec.appendChild(flowCard);

  wrap.appendChild(examplesSec);

  host.appendChild(wrap);
}

// Theme taxonomy mirror of docs/themes.md (locked 2026-05-15).
// COUNT = 15. File order is authoritative -- DO NOT alphabetize or
// reorder. If docs/themes.md ever changes, this array changes with
// it (same number of entries, same labels, same order). The sidebar
// filter list in renderShelf reads exclusively from this array;
// docs/themes.md cannot be loaded at runtime in the browser, so this
// is the in-code mirror of that authoritative source. Stage 3.10a
// Stage 2 surfaces these as inert text rows; filter behavior is
// 3.10b.
var SHELF_THEMES = [
  'Philosophy & wisdom',
  'Critical theory & pedagogy',
  'Power & systems',
  'Political economy & society',
  'Mind & behavior',
  'History & memory',
  'Liberation',
  'Love & connection',
  'Grief & witness',
  'Joy & wonder',
  'Faith & meaning',
  'Place & belonging',
  'Nature & ecology',
  'Story & imagination',
  'Craft & practice'
];

// Stage 3.5a: the Books shelf surface. Reads from state.books and
// renders one row per record, newest first by addedAt. No filtering,
// no add-book affordance, no editor in this sub-stage -- those land
// in later 3.5a sub-stages. Each row links to #book/<id> via an
// anchor so click-through hits renderBookDetail through the router.
function renderShelf() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  // 3.10b-i: purge any stale Escape handler from a previous render.
  // The fresh render replaces the sidebar; the old handler closed
  // over the now-detached old sidebar/backdrop pair. Without this,
  // an Escape press between an auto-close (filter-click re-render)
  // and the next open would no-op on the detached old sidebar and
  // leak a listener. The open/dismiss path below rebinds cleanly.
  if (shelfSidebarEscapeHandler) {
    document.removeEventListener('keydown', shelfSidebarEscapeHandler);
    shelfSidebarEscapeHandler = null;
  }

  var wrap = document.createElement('section');
  wrap.className = 'shelf';

  var header = document.createElement('header');
  header.className = 'shelf-header';

  var title = document.createElement('h1');
  title.className = 'shelf-title';
  title.textContent = 'Your shelf';
  header.appendChild(title);

  // Auth-aware add affordance. Mirrors renderBookDetail at
  // views.js:358-377: signed-in user gets a button that opens the
  // inline editor; signed-out user gets a sign-in prompt routed
  // through signInWithGoogle (the same path used by the Notebook
  // and book-detail surfaces).
  var user = getCurrentUser();
  if (user) {
    // Stage 3.10a Stage 1: book-count subtitle. Signed-in branch
    // only -- signed-out users have no uid and therefore no
    // userBooks bucket to count against (Q1 resolution 2026-05-15).
    // Singular case is "1 BOOK", plural "N BOOKS"; both uppercase
    // because the .shelf-subtitle rule applies text-transform but
    // we keep the source string uppercase too so the DOM matches
    // what the user sees and assistive tech reads.
    var subtitle = document.createElement('p');
    subtitle.className = 'shelf-subtitle';
    var bookCount = (state.userBooks && state.userBooks[user.uid] &&
                     state.userBooks[user.uid].bookIds &&
                     state.userBooks[user.uid].bookIds.length) || 0;
    var bookNoun = bookCount === 1 ? 'BOOK' : 'BOOKS';
    subtitle.textContent = bookCount + ' ' + bookNoun;
    header.appendChild(subtitle);

    var newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'shelf-new-book';
    newBtn.textContent = '+ Add book';
    newBtn.addEventListener('click', function() {
      openShelfEditor();
    });
    header.appendChild(newBtn);

    var bulkBtn = document.createElement('button');
    bulkBtn.type = 'button';
    bulkBtn.className = 'shelf-new-book-bulk';
    bulkBtn.textContent = '+ Bulk add';
    bulkBtn.addEventListener('click', function() {
      openBulkAddEditor();
    });
    header.appendChild(bulkBtn);

    // 3.10d: resolve missing covers (title-imported books). The 109-
    // book bulk-import wrote coverUrl: null for every title-form line
    // and never fired a cover fetch (fetchAndApplyCover is ISBN-only).
    // Label + disabled state read from coverResolveState, which lives
    // outside the DOM so progress survives the per-settle renderShelf.
    var resolveBtn = document.createElement('button');
    resolveBtn.type = 'button';
    resolveBtn.className = 'shelf-resolve-covers-btn';
    if (coverResolveState.running) {
      resolveBtn.textContent = 'Resolving ' +
        coverResolveState.completed + ' of ' + coverResolveState.total;
      resolveBtn.disabled = true;
    } else {
      resolveBtn.textContent = 'Resolve missing covers';
    }
    resolveBtn.addEventListener('click', function() {
      startCoverBackfill();
    });
    header.appendChild(resolveBtn);
  } else {
    var signinBtn = document.createElement('button');
    signinBtn.type = 'button';
    signinBtn.className = 'shelf-signin-prompt';
    signinBtn.textContent = 'Sign in to add books';
    signinBtn.addEventListener('click', function() {
      signInWithGoogle();
    });
    header.appendChild(signinBtn);
  }

  wrap.appendChild(header);

  // 3.10a Stage 2: two-column layout below the full-width header.
  // .shelf-layout holds .shelf-sidebar (left, 220px, transparent --
  // dissolves into the page, not a card) and .shelf-main (right,
  // flex-fills). The editor host moves inside .shelf-main so it sits
  // above the grid in the right column; getElementById lookups in
  // openShelfEditor / processBulkLines are position-independent
  // (Q1 grep 2026-05-16 confirmed zero dependencies on the previous
  // direct-child-of-.shelf position).
  //
  // SIDEBAR IS INERT IN STAGE 2. The theme + author rows render but
  // do nothing on click; filter behavior is 3.10b. No event listeners
  // are attached anywhere in this block, no checkboxes wired to
  // anything, no selected-state field on state.*.

  var booksMap = state.books || {};

  // Author dedupe + alphabetic sort for the sidebar's "Filter by
  // author" section. Object-as-set for dedupe; default lexicographic
  // sort (no comparator means no arrow callback). Vanilla.
  var authorSeen = {};
  var authors = [];
  var abid;
  var abk;
  for (abid in booksMap) {
    if (Object.prototype.hasOwnProperty.call(booksMap, abid)) {
      abk = booksMap[abid];
      if (abk && abk.author &&
          !Object.prototype.hasOwnProperty.call(authorSeen, abk.author)) {
        authorSeen[abk.author] = true;
        authors.push(abk.author);
      }
    }
  }
  authors.sort();

  var layout = document.createElement('div');
  layout.className = 'shelf-layout';

  var sidebar = document.createElement('aside');
  sidebar.className = 'shelf-sidebar';

  // 3.10b-i: backdrop — sibling of sidebar inside .shelf-layout
  // (appended below after both are populated). Class .shelf-sidebar-
  // backdrop; default-hidden by CSS, revealed by toggling .shelf-
  // sidebar-backdrop-open in lockstep with .shelf-sidebar-mobile-open.
  var backdrop = document.createElement('div');
  backdrop.className = 'shelf-sidebar-backdrop';

  // 3.10b-i: close affordance. First child of the sidebar so source-
  // order tab focus lands on it when the panel opens — gives keyboard
  // users an immediate dismiss path. Mobile-only via CSS display
  // gate (the desktop sidebar has no panel chrome). The aria-label
  // carries semantics for screen readers; the visible glyph is ×
  // (U+00D7 multiplication sign).
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'shelf-sidebar-close';
  closeBtn.setAttribute('aria-label', 'Close filters');
  closeBtn.textContent = '×';
  sidebar.appendChild(closeBtn);

  // Theme section -- 15 rows, file order from docs/themes.md mirror.
  var themeSection = document.createElement('div');
  themeSection.className = 'shelf-filter-section';
  var themeLabel = document.createElement('h3');
  themeLabel.className = 'shelf-filter-label';
  themeLabel.textContent = 'Filter by theme';
  themeSection.appendChild(themeLabel);
  var themeList = document.createElement('ul');
  themeList.className = 'shelf-filter-list';
  var ti;
  var themeRow;
  for (ti = 0; ti < SHELF_THEMES.length; ti++) {
    themeRow = document.createElement('li');
    // 3.10b Stage 3: bare <li> -> real interactive control. role +
    // tabindex make the row focusable and screen-reader-announced as
    // a button; data-* carries the filter section + value so the
    // handlers can read directly from the element (avoids the
    // var-loop closure trap). Selected class is applied on render
    // by re-reading shelfFilter -- the single source of truth.
    themeRow.className = shelfFilter.theme === SHELF_THEMES[ti]
      ? 'shelf-filter-row shelf-filter-row-selected'
      : 'shelf-filter-row';
    themeRow.setAttribute('role', 'button');
    themeRow.setAttribute('tabindex', '0');
    themeRow.setAttribute('data-filter-section', 'theme');
    themeRow.setAttribute('data-filter-value', SHELF_THEMES[ti]);
    themeRow.textContent = SHELF_THEMES[ti];
    themeRow.addEventListener('click', onShelfFilterRowClick);
    themeRow.addEventListener('keydown', onShelfFilterRowKeydown);
    themeList.appendChild(themeRow);
  }
  themeSection.appendChild(themeList);
  sidebar.appendChild(themeSection);

  // Author section -- dedup'd alphabetical list from state.books.
  var authorSection = document.createElement('div');
  authorSection.className = 'shelf-filter-section';
  var authorLabel = document.createElement('h3');
  authorLabel.className = 'shelf-filter-label';
  authorLabel.textContent = 'Filter by author';
  authorSection.appendChild(authorLabel);
  var authorListEl = document.createElement('ul');
  authorListEl.className = 'shelf-filter-list shelf-filter-list-author';
  var ai;
  var authorRow;
  for (ai = 0; ai < authors.length; ai++) {
    authorRow = document.createElement('li');
    // 3.10b Stage 3: same treatment as theme rows -- role, tabindex,
    // data-* for section + value, selected class on render, click +
    // keydown handlers. Both row types share the handler pair via
    // the data-filter-section attribute, so the handler reads
    // 'theme' or 'author' directly off the activated element.
    authorRow.className = shelfFilter.author === authors[ai]
      ? 'shelf-filter-row shelf-filter-row-selected'
      : 'shelf-filter-row';
    authorRow.setAttribute('role', 'button');
    authorRow.setAttribute('tabindex', '0');
    authorRow.setAttribute('data-filter-section', 'author');
    authorRow.setAttribute('data-filter-value', authors[ai]);
    authorRow.textContent = authors[ai];
    authorRow.addEventListener('click', onShelfFilterRowClick);
    authorRow.addEventListener('keydown', onShelfFilterRowKeydown);
    authorListEl.appendChild(authorRow);
  }
  authorSection.appendChild(authorListEl);
  sidebar.appendChild(authorSection);

  layout.appendChild(sidebar);
  // 3.10b-i: backdrop appended as a sibling of the sidebar inside
  // .shelf-layout. Order after the sidebar so the close-button focus
  // ring (Stage 1 :focus-visible) renders cleanly above the backdrop
  // dim. CSS z-index keeps the sidebar (100) above the backdrop (99).
  layout.appendChild(backdrop);

  // 3.10b-i: mobile filter panel open/close. Backdrop and sidebar
  // always toggle together via add/remove of paired classes. dismiss
  // is the single source of truth — wired to four triggers below:
  // the close × button, a click on the backdrop, an Escape keydown
  // at document scope, and the .shelf-filter-button when the panel
  // is already open. The Escape handler is parked at module scope
  // (shelfSidebarEscapeHandler) so a re-render can purge a stale
  // one; see the cleanup at the top of renderShelf.
  function openShelfFilterPanel() {
    sidebar.classList.add('shelf-sidebar-mobile-open');
    backdrop.classList.add('shelf-sidebar-backdrop-open');
    if (shelfSidebarEscapeHandler) {
      document.removeEventListener('keydown', shelfSidebarEscapeHandler);
    }
    shelfSidebarEscapeHandler = function(ev) {
      if (ev.key === 'Escape' || ev.key === 'Esc') {
        dismissShelfFilterPanel();
      }
    };
    document.addEventListener('keydown', shelfSidebarEscapeHandler);
  }

  function dismissShelfFilterPanel() {
    sidebar.classList.remove('shelf-sidebar-mobile-open');
    backdrop.classList.remove('shelf-sidebar-backdrop-open');
    if (shelfSidebarEscapeHandler) {
      document.removeEventListener('keydown', shelfSidebarEscapeHandler);
      shelfSidebarEscapeHandler = null;
    }
  }

  closeBtn.addEventListener('click', dismissShelfFilterPanel);
  backdrop.addEventListener('click', dismissShelfFilterPanel);

  // Right column: editor host above the grid/empty.
  var main = document.createElement('div');
  main.className = 'shelf-main';

  // 3.10a Stage 4: mobile filter-panel toggle. Button is hidden on
  // desktop (CSS display:none default; mobile media query reveals
  // it). On mobile it sits at the top of the main column and
  // toggles .shelf-sidebar-mobile-open on the sidebar element above.
  // One addEventListener; open/close only. The sidebar's theme +
  // author rows remain inert -- 3.10b owns filter behavior. The
  // panel OPENS and CLOSES; its contents do not act.
  // Reuses .shelf-new-book-bulk visual treatment per Stage 0
  // decision (no new button class authored).
  var filterBtn = document.createElement('button');
  filterBtn.type = 'button';
  filterBtn.className = 'shelf-filter-button shelf-new-book-bulk';
  filterBtn.textContent = 'Filter';
  // 3.10b-i: routes through openShelfFilterPanel / dismissShelfFilter-
  // Panel so the backdrop and Escape handler move in lockstep with
  // .shelf-sidebar-mobile-open. The 3.10a-era class-flip-only handler
  // would leave the backdrop in whatever state was last seen.
  filterBtn.addEventListener('click', function() {
    if (sidebar.classList.contains('shelf-sidebar-mobile-open')) {
      dismissShelfFilterPanel();
    } else {
      openShelfFilterPanel();
    }
  });
  main.appendChild(filterBtn);

  // Editor host -- empty on every render; openShelfEditor mounts
  // its block here on demand. Lives above the book list so the
  // editor sits visually above existing rows.
  var editorHost = document.createElement('div');
  editorHost.id = 'shelf-editor-host';
  main.appendChild(editorHost);

  // Collect books for the grid. Read site is state.books, not
  // state.userBooks -- see 3.5a brief: userBooks is write-but-not-
  // read in 3.5a so book_test_1 (seeded into state.books in 3.3
  // console testing but never into userBooks) stays visible.
  // User-scoping the shelf is a future seam.
  var books = [];
  var bid;
  for (bid in booksMap) {
    if (Object.prototype.hasOwnProperty.call(booksMap, bid)) {
      if (booksMap[bid]) books.push(booksMap[bid]);
    }
  }
  books.sort(function(a, b) {
    return (b.addedAt || 0) - (a.addedAt || 0);
  });

  // 3.10b Stage 3: filter pass. Sits AFTER the addedAt sort and
  // BEFORE the empty-state branch -- the empty-state branch consumes
  // the post-filter length, which is what drives the filter-empty
  // copy switch below. STRICT === only: no toLowerCase, no indexOf,
  // no normalization. An active filter excludes any book whose
  // corresponding field is empty/missing or whose value is not ===
  // the selection. A null filter for a section is a no-op for that
  // section. AND across sections: a book passes only if both
  // predicates pass.
  var filtered = [];
  var fi;
  var fb;
  var themeOk;
  var authorOk;
  for (fi = 0; fi < books.length; fi++) {
    fb = books[fi];
    themeOk = shelfFilter.theme === null ||
      (typeof fb.genre === 'string' && fb.genre.length > 0 &&
       fb.genre === shelfFilter.theme);
    authorOk = shelfFilter.author === null ||
      (typeof fb.author === 'string' && fb.author.length > 0 &&
       fb.author === shelfFilter.author);
    if (themeOk && authorOk) {
      filtered.push(fb);
    }
  }
  books = filtered;

  if (books.length === 0) {
    // 3.10a Stage 4: empty state. Structure supports both copy
    // variants (zero-books and zero-filter-results); 3.10a wired
    // only zero-books, 3.10b adds the filter-empty switch below.
    // The button is auth-conditional per Q1 resolution (2026-05-16):
    // signed-in shows Add book primary, signed-out shows the sign-in
    // prompt. Both reuse existing button classes (.shelf-new-book /
    // .shelf-signin-prompt) and existing handlers (openShelfEditor
    // / signInWithGoogle) -- zero new behavior, just reuse-wiring a
    // second button instance to a pre-existing handler. The unused
    // .shelf-empty-body class from earlier stages is discarded; no
    // rule consumed it.
    //
    // 3.10b Stage 3: copy switch. If any filter is active, the
    // empty list is the result of filtering rather than an unstocked
    // shelf; the headline + subtitle change accordingly. The auth-
    // conditional action button stays identical in BOTH branches per
    // the brief -- signed-out users still get the sign-in prompt
    // even when their filter yields zero.
    var filterActive = shelfFilter.theme !== null ||
                       shelfFilter.author !== null;
    var empty = document.createElement('div');
    empty.className = 'shelf-empty';
    var emptyHeadline = document.createElement('h2');
    emptyHeadline.className = 'shelf-empty-headline';
    emptyHeadline.textContent = filterActive
      ? 'Nothing on the shelf matches.'
      : 'Your shelf is empty.';
    empty.appendChild(emptyHeadline);
    var emptySubtitle = document.createElement('p');
    emptySubtitle.className = 'shelf-empty-subtitle';
    emptySubtitle.textContent = filterActive
      ? 'Clear your filters or add a new book.'
      : 'Add a book to begin.';
    empty.appendChild(emptySubtitle);
    var emptyUser = getCurrentUser();
    if (emptyUser) {
      var emptyAddBtn = document.createElement('button');
      emptyAddBtn.type = 'button';
      emptyAddBtn.className = 'shelf-new-book';
      emptyAddBtn.textContent = '+ Add book';
      emptyAddBtn.addEventListener('click', function() {
        openShelfEditor();
      });
      empty.appendChild(emptyAddBtn);
    } else {
      var emptySigninBtn = document.createElement('button');
      emptySigninBtn.type = 'button';
      emptySigninBtn.className = 'shelf-signin-prompt';
      emptySigninBtn.textContent = 'Sign in to add books';
      emptySigninBtn.addEventListener('click', function() {
        signInWithGoogle();
      });
      empty.appendChild(emptySigninBtn);
    }
    main.appendChild(empty);
  } else {
    var list = document.createElement('div');
    list.className = 'shelf-list';
    var i;
    for (i = 0; i < books.length; i++) {
      list.appendChild(renderShelfBook(books[i]));
    }
    main.appendChild(list);
  }

  layout.appendChild(main);
  wrap.appendChild(layout);

  host.appendChild(wrap);
}

// Single shelf row. Anchor element so the browser's hashchange path
// handles navigation -- no addEventListener needed.
function renderShelfBook(book) {
  var card = document.createElement('a');
  card.className = 'shelf-book';
  card.href = '#book/' + book.id;

  // 3.5b: cover thumbnail or placeholder block. The truthy check
  // correctly treats null, undefined, and '' as missing-cover.
  // 3.10a Stage 3: both branches now mount inside a shared
  // .shelf-book-cover-area wrapper so the fixed 200px cover-area
  // height applies uniformly whether the card has an image or a
  // placeholder. Wrapper is purely structural -- no behavior, no
  // event listeners. Future surfaces (Stage 4 mobile 160px, overlay
  // affordances) hang off this container.
  var coverArea = document.createElement('div');
  coverArea.className = 'shelf-book-cover-area';
  if (book.coverUrl) {
    var cover = document.createElement('img');
    cover.className = 'shelf-book-cover';
    cover.src = book.coverUrl;
    cover.alt = '';
    coverArea.appendChild(cover);
  } else {
    var coverPlaceholder = document.createElement('div');
    coverPlaceholder.className = 'shelf-book-cover-placeholder';
    coverArea.appendChild(coverPlaceholder);
  }
  card.appendChild(coverArea);

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

  // 3.10a Stage 3: status-modifier class hook for the three pill
  // variants (reading / finished / want). statusValue is reused for
  // class and textContent so the fallback 'reading' applies to both
  // without recomputing book.status || 'reading' twice.
  var statusEl = document.createElement('span');
  var statusValue = book.status || 'reading';
  statusEl.className = 'shelf-book-status shelf-book-status-' + statusValue;
  statusEl.textContent = statusValue;
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

// Stage 3.5b fail-soft cover fetch wrapper. Used by both the add-book
// save path (background fetch after sync save completes) and the
// book detail page ISBN re-fetch path (3.5b Stage 2). Contract:
//   - bookId   : the books map key whose coverUrl we patch
//   - isbn     : trimmed, non-empty (caller responsibility)
//   - onComplete(url, result): fires after the patch is durable.
//     url is the final coverUrl value (string or null) after the
//     placeholder filter. result is the raw fetchBookByIsbn return
//     object (or null on null-return / throw). Callers that want
//     to consume metadata fields (title, author, etc.) read them
//     off result; the helper itself only writes coverUrl. Caller
//     decides whether to re-render based on the current route --
//     the helper does NOT touch the DOM.
// Returns coverUrl === null on any of: fetchBookByIsbn returns null,
// throws (defensive -- integrations.js cannot throw to caller today
// but the guard is forward-safe), returns an object whose coverUrl
// is null or empty string, or returns an Open Library "no cover"
// placeholder URL (matched by 'id=0' or '/id/0-' substring).
// Otherwise patches state.books[bookId].coverUrl to the returned URL.
// In all cases calls saveState() before firing onComplete.
function fetchAndApplyCover(bookId, isbn, onComplete) {
  function settle(url, result) {
    if (state.books[bookId]) {
      state.books[bookId].coverUrl = url;
      markBooksDirty();
      saveState();
    }
    if (typeof onComplete === 'function') onComplete(url, result);
  }
  try {
    fetchBookByIsbn(isbn, function(result) {
      var url = null;
      if (result &&
          typeof result.coverUrl === 'string' &&
          result.coverUrl.length > 0 &&
          result.coverUrl.indexOf('id=0') === -1 &&
          result.coverUrl.indexOf('/id/0-') === -1) {
        url = result.coverUrl;
      }
      settle(url, result);
    });
  } catch (e) {
    settle(null, null);
  }
}

// 3.10d: sibling of fetchAndApplyCover for title-imported books.
// Same settle() shape, same placeholder-URL filter (the id=0 / /id/0-
// patterns are OpenLibrary-shaped and won't appear on Google Books
// URLs, but we mirror exactly so future routing changes stay safe).
// markBooksDirty() + saveState() at settle() is the Firestore
// chokepoint; no separate persistence code is added here.
function fetchAndApplyCoverByTitle(bookId, title, author, onComplete) {
  function settle(url, result) {
    if (state.books[bookId]) {
      state.books[bookId].coverUrl = url;
      markBooksDirty();
      saveState();
    }
    if (typeof onComplete === 'function') onComplete(url, result);
  }
  try {
    fetchBookByTitle(title, author, function(result) {
      var url = null;
      if (result &&
          typeof result.coverUrl === 'string' &&
          result.coverUrl.length > 0 &&
          result.coverUrl.indexOf('id=0') === -1 &&
          result.coverUrl.indexOf('/id/0-') === -1) {
        url = result.coverUrl;
      }
      settle(url, result);
    });
  } catch (e) {
    settle(null, null);
  }
}

// 3.10d: progressive missing-cover backfill state. Lives outside
// the DOM because renderShelf() rebuilds the button on every settle
// to populate covers progressively -- state in the DOM would reset
// each tick. renderShelf reads this to decide idle vs running label.
// running === true is the concurrency gate: a second click while a
// backfill is in flight is an immediate no-op (the disabled attr is
// belt-and-suspenders).
var coverResolveState = { running: false, completed: 0, total: 0 };

// 3.10b: shelf filter state. Two nullable strings -- one theme, one
// author -- enforcing single-select per section and AND across
// sections. Memory-only; no localStorage, no URL routing; closing the
// tab clears it. Same shape precedent as coverResolveState above: a
// single object var at file scope, named fields, direct read/write
// from renderShelf and the row click handlers (3.10b Stage 3).
// Theme match is STRICT EQUALITY against the locked 15-theme
// taxonomy (SHELF_THEMES); book.genre is free-text today, so the
// theme filter matches ~zero books on current data -- expected and
// correct, the genre-dropdown retrofit is 3.10c. Author values come
// from state.books so they match by construction.
var shelfFilter = { theme: null, author: null };

// 3.10b-i: module-scope reference to the document-level Escape
// listener bound when the mobile filter panel is open. Tracked here
// (not inside renderShelf's closure) so a re-render can purge a
// stale handler that closed over the previous render's detached
// sidebar. Null when no handler is bound. The open/close path in
// renderShelf rotates this slot: open() removes any prior + adds a
// fresh one, dismiss() removes and clears it.
var shelfSidebarEscapeHandler = null;

// 3.10b Stage 3: single-select toggle. Called by both the click and
// keydown handlers on every .shelf-filter-row. If the section's
// current value === the clicked row's value, clear it (toggle off);
// else replace it (single-select replacement of any prior choice in
// that section). renderShelf is the one re-render entry point -- it
// re-reads shelfFilter to apply the selected class and the match
// predicate in a single pass.
function toggleShelfFilter(section, value) {
  if (shelfFilter[section] === value) {
    shelfFilter[section] = null;
  } else {
    shelfFilter[section] = value;
  }
  renderShelf();
}

// 3.10b Stage 3: shared click handler for every .shelf-filter-row
// (theme + author). Reads section + value from the activated
// element's data-* attributes -- single source of truth, immune to
// the var-loop closure trap.
function onShelfFilterRowClick() {
  toggleShelfFilter(
    this.getAttribute('data-filter-section'),
    this.getAttribute('data-filter-value')
  );
}

// 3.10b Stage 3: keyboard activation for the same rows. Enter and
// Space both fire toggle, matching native <button> behavior so
// role="button" is honest. preventDefault on Space stops page
// scroll when the focused row is an <li>. Spacebar value is the
// legacy IE key name -- defensive, harmless on modern browsers.
function onShelfFilterRowKeydown(ev) {
  if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
    ev.preventDefault();
    toggleShelfFilter(
      this.getAttribute('data-filter-section'),
      this.getAttribute('data-filter-value')
    );
  }
}

function startCoverBackfill() {
  if (coverResolveState.running) return;
  var user = getCurrentUser();
  if (!user) return;
  var userBookIds = (state.userBooks &&
                     state.userBooks[user.uid] &&
                     state.userBooks[user.uid].bookIds)
    ? state.userBooks[user.uid].bookIds
    : [];
  var queue = [];
  var i;
  for (i = 0; i < userBookIds.length; i++) {
    var bid = userBookIds[i];
    var b = state.books[bid];
    if (b && b.coverUrl === null) {
      queue.push(bid);
    }
  }
  if (queue.length === 0) return;
  coverResolveState.running = true;
  coverResolveState.completed = 0;
  coverResolveState.total = queue.length;
  // Initial render so the button shows "Resolving 0 of N" disabled
  // before the first fetch resolves.
  var partsStart = location.hash.replace(/^#/, '').split('/');
  if (partsStart[0] === 'books') renderShelf();
  var qi = 0;
  function processNextCover() {
    if (qi >= queue.length) {
      // Full reset BEFORE the terminal render so the button renders
      // clean-idle and a second backfill starts from zero.
      coverResolveState.running = false;
      coverResolveState.completed = 0;
      coverResolveState.total = 0;
      var partsDone = location.hash.replace(/^#/, '').split('/');
      if (partsDone[0] === 'books') renderShelf();
      return;
    }
    var nextId = queue[qi];
    qi++;
    var book = state.books[nextId];
    var t = (book && typeof book.title === 'string') ? book.title : '';
    var a = (book && typeof book.author === 'string') ? book.author : '';
    fetchAndApplyCoverByTitle(nextId, t, a, function() {
      coverResolveState.completed = qi;
      var parts = location.hash.replace(/^#/, '').split('/');
      if (parts[0] === 'books') renderShelf();
      processNextCover();
    });
  }
  processNextCover();
}

// Inline add-book editor mounted into #shelf-editor-host. Structurally
// mirrors openMarginaliaEditor: title input + author input (optional)
// + status radio (default 'reading') + genre input (optional) + ISBN
// input + Save/Cancel. Save is disabled when BOTH title AND ISBN are
// empty after trim -- either one alone enables Save. The ISBN-only
// path is the gate that makes the 3.5b Stage 3 metadata backfill
// reachable (and the same gate 3.5c bulk import will use). On Save:
// genBookId, write a complete books record (all 1.9.0 fields plus
// coverUrl:null), ensureUser(uid) + push to userBooks[uid].bookIds,
// saveState, renderShelf. If ISBN non-empty, fire background
// fetchAndApplyCover after the sync render. Cancel re-renders the
// shelf with no writes.
function openShelfEditor() {
  var hostEl = document.getElementById('shelf-editor-host');
  if (!hostEl) return;

  hostEl.innerHTML = '';

  var editor = document.createElement('div');
  editor.className = 'shelf-editor';

  var titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'shelf-editor-title-input';
  titleInput.placeholder = 'Title';

  var authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.className = 'shelf-editor-author-input';
  authorInput.placeholder = 'Author (optional)';

  // Status radios: want | reading | finished. Default 'reading' --
  // same default the migration backfills onto pre-existing records
  // and the same default 3.7 will treat as the pre-Artifact state.
  var statusWrap = document.createElement('div');
  statusWrap.className = 'shelf-editor-status';
  var statuses = ['want', 'reading', 'finished'];
  var statusRadios = [];
  var s;
  for (s = 0; s < statuses.length; s++) {
    var label = document.createElement('label');
    label.className = 'shelf-editor-status-option';
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'shelf-editor-status';
    radio.value = statuses[s];
    if (statuses[s] === 'reading') radio.checked = true;
    statusRadios.push(radio);
    label.appendChild(radio);
    label.appendChild(document.createTextNode(' ' + statuses[s]));
    statusWrap.appendChild(label);
  }

  // 3.10c Stage 4: free-text <input> swapped for a <select> populated
  // from SHELF_THEMES. First option carries value '' for "no theme
  // selected" — books with empty or legacy non-SHELF_THEMES genre
  // values land on this option without rewriting their stored
  // string. The variable name 'genreInput' is preserved so the
  // save-handler read at genreInput.value below is byte-unchanged
  // (.value contract is identical across <input> and <select>).
  // .placeholder is dropped — <select> does not honor placeholder;
  // the 'No theme' option replaces its semantics.
  var genreInput = document.createElement('select');
  genreInput.className = 'shelf-editor-genre-input';
  var emptyOpt = document.createElement('option');
  emptyOpt.value = '';
  emptyOpt.textContent = 'No theme';
  genreInput.appendChild(emptyOpt);
  var gi;
  var opt;
  for (gi = 0; gi < SHELF_THEMES.length; gi++) {
    opt = document.createElement('option');
    opt.value = SHELF_THEMES[gi];
    opt.textContent = SHELF_THEMES[gi];
    genreInput.appendChild(opt);
  }

  var isbnInput = document.createElement('input');
  isbnInput.type = 'text';
  isbnInput.className = 'shelf-editor-isbn-input';
  isbnInput.placeholder = 'ISBN (optional)';

  var actions = document.createElement('div');
  actions.className = 'shelf-editor-actions';

  var saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'shelf-editor-save';
  saveBtn.textContent = 'Save';
  saveBtn.disabled = true;

  var cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'shelf-editor-cancel';
  cancelBtn.textContent = 'Cancel';

  // Shared toggle: Save enabled when at least one of title or ISBN
  // is non-empty after trim. Attached to both inputs so either
  // field driving non-empty enables the button. Author and genre
  // play no validation role; status always has a default selection.
  function updateSaveDisabledState() {
    var titleHas = titleInput.value.replace(/^\s+|\s+$/g, '').length > 0;
    var isbnHas  = isbnInput.value.replace(/^\s+|\s+$/g, '').length > 0;
    saveBtn.disabled = !(titleHas || isbnHas);
  }
  titleInput.addEventListener('input', updateSaveDisabledState);
  isbnInput.addEventListener('input', updateSaveDisabledState);

  saveBtn.addEventListener('click', function() {
    var titleTrimmed = titleInput.value.replace(/^\s+|\s+$/g, '');
    var isbnTrimmed  = isbnInput.value.replace(/^\s+|\s+$/g, '');
    // Defensive gate mirrors the Save-disabled toggle: bail if BOTH
    // are empty. The toggle keeps the button disabled in that state,
    // so this is belt-and-suspenders against future drift.
    if (titleTrimmed.length === 0 && isbnTrimmed.length === 0) return;
    var user = getCurrentUser();
    if (!user) return;

    var authorTrimmed = authorInput.value.replace(/^\s+|\s+$/g, '');
    var genreTrimmed  = genreInput.value.replace(/^\s+|\s+$/g, '');

    var statusValue = 'reading';
    var i;
    for (i = 0; i < statusRadios.length; i++) {
      if (statusRadios[i].checked) {
        statusValue = statusRadios[i].value;
        break;
      }
    }

    var now = Date.now();
    var id  = genBookId();

    state.books[id] = {
      id:       id,
      title:    titleTrimmed,
      author:   authorTrimmed,
      isbn:     isbnTrimmed,
      addedAt:  now,
      status:   statusValue,
      genre:    genreTrimmed,
      coverUrl: null
    };

    // ensureUser is defensive against fresh accounts whose state.users
    // and state.userBooks records have not been seeded yet. After this
    // call, state.userBooks[uid].bookIds is guaranteed to be an array.
    if (typeof ensureUser === 'function') {
      ensureUser(user.uid);
    }
    state.userBooks[user.uid].bookIds.push(id);

    markBooksDirty();
    saveState();
    renderShelf();

    // 3.5b: background cover fetch. The user-visible save path is
    // already complete -- editor closed, row painted, state durable.
    // When the callback eventually fires (or fails soft), we patch
    // state.books[id].coverUrl and re-render only if the user is
    // still looking at the shelf. Route inspection rather than
    // state.currentBookId === null because #notebook also clears
    // currentBookId, and re-rendering the shelf from a notebook
    // route would clobber the Notebook surface.
    if (isbnTrimmed.length > 0) {
      fetchAndApplyCover(id, isbnTrimmed, function(url, result) {
        // 3.5b Stage 3: conditionally backfill title and author
        // from the fetch result -- only when the user's form fields
        // were blank at save time (titleTrimmed/authorTrimmed
        // closure-captured from the save handler scope). The user's
        // typed values are authoritative; we only fill the gaps.
        // Same fail-soft contract as coverUrl: typeof-string +
        // length>0 guard treats null/empty/undefined as missing
        // metadata and leaves the existing record value alone.
        if (state.books[id]) {
          var metaChanged = false;
          if (titleTrimmed === '' &&
              result &&
              typeof result.title === 'string' &&
              result.title.length > 0) {
            state.books[id].title = result.title;
            metaChanged = true;
          }
          if (authorTrimmed === '' &&
              result &&
              typeof result.author === 'string' &&
              result.author.length > 0) {
            state.books[id].author = result.author;
            metaChanged = true;
          }
          if (metaChanged) {
            markBooksDirty();
            saveState();
          }
        }
        var parts = location.hash.replace(/^#/, '').split('/');
        if (parts[0] === 'books') {
          renderShelf();
        }
      });
    } else if (titleTrimmed.length > 0) {
      // 3.10e: mirror of the ISBN background-fetch above, but on the
      // title path. Fires fetchAndApplyCoverByTitle on save; on
      // settle, conditionally backfills isbn + author when those
      // user-form fields were blank at save time. Title is never
      // backfilled -- it is the query input, and writing Google's
      // normalized echo over the user's typed title would be a
      // silent mutation. publishYear is intentionally NOT written:
      // no existing book record carries it, opportunistic property-
      // writes would produce a sparse schema, and proper adoption
      // is its own future stage.
      fetchAndApplyCoverByTitle(id, titleTrimmed, authorTrimmed, function(url, result) {
        if (state.books[id]) {
          var metaChanged = false;
          if (isbnTrimmed === '' &&
              result &&
              typeof result.isbn === 'string' &&
              result.isbn.length > 0) {
            state.books[id].isbn = result.isbn;
            metaChanged = true;
          }
          if (authorTrimmed === '' &&
              result &&
              typeof result.author === 'string' &&
              result.author.length > 0) {
            state.books[id].author = result.author;
            metaChanged = true;
          }
          if (metaChanged) {
            markBooksDirty();
            saveState();
          }
        }
        var parts = location.hash.replace(/^#/, '').split('/');
        if (parts[0] === 'books') {
          renderShelf();
        }
      });
    }
  });

  cancelBtn.addEventListener('click', function() {
    renderShelf();
  });

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  editor.appendChild(titleInput);
  editor.appendChild(authorInput);
  editor.appendChild(statusWrap);
  editor.appendChild(genreInput);
  editor.appendChild(isbnInput);
  editor.appendChild(actions);
  hostEl.appendChild(editor);

  titleInput.focus();
}

// Stage 3.5c bulk add: multi-line text editor mounted into the same
// #shelf-editor-host openShelfEditor uses. On Submit, processBulkLines
// parses + dedupes + writes per-entry, then drains a sequential ISBN
// fetch queue (sequential callback chain, per Praxis conventions).
// The save-path mirror is intentionally inlined rather than factored
// into a shared writer: at one-and-a-maybe callers (3.5d/3.5e may or
// may not want the same writer), the abstraction does not yet earn
// its keep. Extract when a second real caller arrives.
function openBulkAddEditor() {
  var hostEl = document.getElementById('shelf-editor-host');
  if (!hostEl) return;

  hostEl.innerHTML = '';

  var editor = document.createElement('div');
  editor.className = 'shelf-bulk-editor';

  var textarea = document.createElement('textarea');
  textarea.className = 'shelf-bulk-editor-textarea';
  textarea.placeholder = 'One ISBN or title per line';
  textarea.rows = 8;

  var actions = document.createElement('div');
  actions.className = 'shelf-bulk-editor-actions';

  var submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'shelf-bulk-editor-submit';
  submitBtn.textContent = 'Submit';

  var cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'shelf-bulk-editor-cancel';
  cancelBtn.textContent = 'Cancel';

  submitBtn.addEventListener('click', function() {
    processBulkLines(textarea.value);
  });

  cancelBtn.addEventListener('click', function() {
    renderShelf();
  });

  actions.appendChild(submitBtn);
  actions.appendChild(cancelBtn);
  editor.appendChild(textarea);
  editor.appendChild(actions);
  hostEl.appendChild(editor);

  textarea.focus();
}

// Parse a pasted blob into entries, write each entry to state, then
// drain a sequential ISBN fetch queue. Per-entry write mirrors the
// openShelfEditor save path (state.books record + userBooks push +
// saveState + renderShelf). ISBN detection: strip hyphens/spaces,
// uppercase, then match either 13 digits or 9-digits-plus-(digit|X)
// for ISBN-10. Within-list dedupe on normalized ISBN only -- titles
// can legitimately repeat across editions and the user can sort
// that out. Title lines write a title-only record with isbn:''; the
// 3.5b save path already accepts title-OR-ISBN, so no schema work.
function processBulkLines(raw) {
  var user = getCurrentUser();
  if (!user) return;

  var lines = raw.split('\n');
  var entries = [];
  var seenIsbns = {};
  var i;
  for (i = 0; i < lines.length; i++) {
    var line = lines[i].replace(/^\s+|\s+$/g, '');
    if (line.length === 0) continue;

    var normalized = line.replace(/[\s-]/g, '').toUpperCase();
    var isIsbn = false;
    if (/^[0-9]{13}$/.test(normalized)) isIsbn = true;
    else if (/^[0-9]{9}[0-9X]$/.test(normalized)) isIsbn = true;

    if (isIsbn) {
      if (seenIsbns[normalized]) continue;
      seenIsbns[normalized] = true;
      entries.push({ kind: 'isbn', value: normalized });
    } else {
      entries.push({ kind: 'title', value: line });
    }
  }

  if (entries.length === 0) {
    renderShelf();
    return;
  }

  if (typeof ensureUser === 'function') {
    ensureUser(user.uid);
  }

  // Per-entry write loop. Single saveState per entry (not batched at
  // end) so a mid-import tab close leaves localStorage consistent.
  // renderShelf is called per entry as the spec prescribes; at
  // synchronous loop pace only the final render paints, which is
  // fine -- all rows appear in one tick. Subsequent renderShelf
  // calls happen from the fetch queue as covers resolve.
  var isbnQueue = [];
  var j;
  for (j = 0; j < entries.length; j++) {
    var entry = entries[j];
    var now = Date.now();
    var id = genBookId();
    if (entry.kind === 'isbn') {
      state.books[id] = {
        id:       id,
        title:    '',
        author:   '',
        isbn:     entry.value,
        addedAt:  now,
        status:   'reading',
        genre:    '',
        coverUrl: null
      };
      isbnQueue.push({ kind: 'isbn', bookId: id, isbn: entry.value });
    } else {
      state.books[id] = {
        id:       id,
        title:    entry.value,
        author:   '',
        isbn:     '',
        addedAt:  now,
        status:   'reading',
        genre:    '',
        coverUrl: null
      };
      // 3.10e: title-form bulk lines now queue for background
      // resolution alongside ISBN-form lines. Same sequential queue,
      // discriminated by the kind field.
      isbnQueue.push({ kind: 'title', bookId: id, title: entry.value });
    }
    state.userBooks[user.uid].bookIds.push(id);
    markBooksDirty();
    saveState();
    renderShelf();
  }

  // Sequential fetch queue. Callback chain -- one fetch in flight at
  // a time, advance on settle (success or fail). 3.10e: queue now
  // carries both ISBN-form items (kind: 'isbn', resolved via
  // fetchAndApplyCover) and title-form items (kind: 'title', resolved
  // via fetchAndApplyCoverByTitle). Per-resolve metadata backfill
  // mirrors the openShelfEditor 3.5b / 3.10e paths: only patch when
  // the current record value is still blank (the user could in theory
  // have edited the row between submit and resolve; the freshness
  // check protects that). Re-render only when the user is still on
  // #books so we don't clobber other surfaces.
  var qi = 0;
  function processNext() {
    if (qi >= isbnQueue.length) return;
    var item = isbnQueue[qi];
    qi++;
    if (item.kind === 'title') {
      // 3.10e: title-form path. Author is sent as '' because bulk-
      // import title-form lines carry no author -- fetchBookByTitle
      // skips the +inauthor: qualifier when author is empty. Backfill
      // patches isbn + author when blank; title is the query input
      // and never backfilled. publishYear intentionally not written
      // (see Stage 1 single-add comment for rationale).
      fetchAndApplyCoverByTitle(item.bookId, item.title, '', function(url, result) {
        if (state.books[item.bookId]) {
          var metaChanged = false;
          if (state.books[item.bookId].isbn === '' &&
              result &&
              typeof result.isbn === 'string' &&
              result.isbn.length > 0) {
            state.books[item.bookId].isbn = result.isbn;
            metaChanged = true;
          }
          if (state.books[item.bookId].author === '' &&
              result &&
              typeof result.author === 'string' &&
              result.author.length > 0) {
            state.books[item.bookId].author = result.author;
            metaChanged = true;
          }
          if (metaChanged) {
            markBooksDirty();
            saveState();
          }
        }
        var parts = location.hash.replace(/^#/, '').split('/');
        if (parts[0] === 'books') {
          renderShelf();
        }
        processNext();
      });
      return;
    }
    fetchAndApplyCover(item.bookId, item.isbn, function(url, result) {
      if (state.books[item.bookId]) {
        var metaChanged = false;
        if (state.books[item.bookId].title === '' &&
            result &&
            typeof result.title === 'string' &&
            result.title.length > 0) {
          state.books[item.bookId].title = result.title;
          metaChanged = true;
        }
        if (state.books[item.bookId].author === '' &&
            result &&
            typeof result.author === 'string' &&
            result.author.length > 0) {
          state.books[item.bookId].author = result.author;
          metaChanged = true;
        }
        if (metaChanged) {
          markBooksDirty();
          saveState();
        }
      }
      var parts = location.hash.replace(/^#/, '').split('/');
      if (parts[0] === 'books') {
        renderShelf();
      }
      processNext();
    });
  }
  processNext();
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

  // 3.5b: cover image or placeholder block. Truthy guard treats
  // null, undefined, and '' as missing -- same shape as the shelf
  // row. CSS constrains max-width on both elements (styling pass).
  if (book.coverUrl) {
    var cover = document.createElement('img');
    cover.className = 'book-detail-cover';
    cover.src = book.coverUrl;
    cover.alt = '';
    header.appendChild(cover);
  } else {
    var coverPlaceholder = document.createElement('div');
    coverPlaceholder.className = 'book-detail-cover-placeholder';
    header.appendChild(coverPlaceholder);
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

    var addToArcBtn = document.createElement('button');
    addToArcBtn.type = 'button';
    addToArcBtn.className = 'book-detail-add-to-arc';
    addToArcBtn.textContent = 'Add to arc…';
    addToArcBtn.addEventListener('click', function() {
      openBookArcPicker(bookId);
    });
    header.appendChild(addToArcBtn);

    // Stage 3.7c stage 2: explicit six-branch (status, hasArtifact)
    // render matrix. Each branch handled standalone -- no shared tails
    // and no collapsed conditionals like (status === 'finished' ||
    // status === 'want'). Branches that render identical markup
    // duplicate the call site by design: the spec matrix is the audit
    // surface, and 3.10 may diverge visual treatment per branch.
    // "I've finished this" stays first-finish-only (the ceremonial
    // path that creates an Artifact); the status selector above is
    // the path for subsequent flips, including un-finish.
    var hasArtifact = false;
    if (state.bookArtifacts) {
      var artKey = artifactKey(user.uid, bookId);
      if (state.bookArtifacts[artKey]) hasArtifact = true;
    }
    if (book.status === 'want' && !hasArtifact) {
      // Branch 1 -- (want, no-artifact): no header Artifact-affordance.
      // User has not begun reading; no finish or Artifact paths apply.
    } else if (book.status === 'reading' && !hasArtifact) {
      // Branch 2 -- (reading, no-artifact): first-finish ceremonial
      // path. Click stamps status + finishedAt and chains the Artifact
      // editor open. Mirrors 3.7 stage 1+2 behavior; unchanged in 3.7c.
      var finishedBtn = document.createElement('button');
      finishedBtn.type = 'button';
      finishedBtn.className = 'book-detail-mark-finished';
      finishedBtn.textContent = 'I\'ve finished this';
      finishedBtn.addEventListener('click', function() {
        if (!state.books[bookId]) return;
        state.books[bookId].status     = 'finished';
        state.books[bookId].finishedAt = Date.now();
        markBooksDirty();
        saveState();
        renderBookDetail(bookId);
        openArtifactEditor(bookId);
      });
      header.appendChild(finishedBtn);
    } else if (book.status === 'finished' && !hasArtifact) {
      // Branch 3 -- (finished, no-artifact): reachable when the user
      // cancelled the auto-opened Artifact editor after marking
      // finished, OR via 3.7c selector flip 'reading'/'want' ->
      // 'finished' on a book that never had an Artifact. Persistent
      // CTA gets the user back into the editor without re-flipping
      // status. The !hasArtifact gate prevents a second creation path.
      var createBtn = document.createElement('button');
      createBtn.type = 'button';
      createBtn.className = 'book-detail-create-artifact';
      createBtn.textContent = 'Create Artifact';
      createBtn.addEventListener('click', function() {
        openArtifactEditor(bookId);
      });
      header.appendChild(createBtn);
    } else if (book.status === 'reading' && hasArtifact) {
      // Branch 4 -- (reading, has-artifact): un-finish state, reached
      // via 3.7c selector flip 'finished' -> 'reading' on a book whose
      // Artifact already exists. "I've finished this" does NOT render
      // here -- first-finish stays ceremonial; the selector handles
      // subsequent flips. "Open Artifact" link remains because the
      // Artifact still represents the user's prior closure (the
      // selector handler in 3.7c stage 1 deliberately retains the
      // finish timestamp across un-flip for the same reason).
      var openArtLink = document.createElement('a');
      openArtLink.className = 'book-detail-open-artifact';
      openArtLink.href = '#artifact/' + bookId;
      openArtLink.textContent = 'Open Artifact';
      header.appendChild(openArtLink);
    } else if (book.status === 'finished' && hasArtifact) {
      // Branch 5 -- (finished, has-artifact): canonical post-Artifact
      // state. Both creation CTAs are gone; the link is the only
      // book-detail surface that references the Artifact.
      var openArtLink = document.createElement('a');
      openArtLink.className = 'book-detail-open-artifact';
      openArtLink.href = '#artifact/' + bookId;
      openArtLink.textContent = 'Open Artifact';
      header.appendChild(openArtLink);
    } else if (book.status === 'want' && hasArtifact) {
      // Branch 6 -- (want, has-artifact): defensive, only reachable
      // via 3.7c selector flip 'finished' -> 'want' on a book whose
      // Artifact already exists. User expectation is undefined for
      // this combination; the Artifact represents real reading work
      // regardless of the user's intent to re-shelf as 'want', so
      // the link stays visible.
      var openArtLink = document.createElement('a');
      openArtLink.className = 'book-detail-open-artifact';
      openArtLink.href = '#artifact/' + bookId;
      openArtLink.textContent = 'Open Artifact';
      header.appendChild(openArtLink);
    }
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

  // Stage 5.3 Stage 4: "Find this book" line in the header region.
  // Appended after all status-aware affordances and CTAs (Add
  // Marginalia / Add to arc / status-branch buttons / Sign in to
  // write) so it lives as the final header element -- typographic,
  // not button-cluster. Same skip-if-no-ISBN rule as the arc-detail
  // member rendering; books without an ISBN get no line. Renders for
  // every viewer (signed-in or not) since availability is the same
  // regardless of auth. target="_blank" so the user keeps their
  // current Praxis context; rel="noopener noreferrer" is the
  // standard cross-origin security pair.
  var bdFindUrl = buildBookshopUrl(book.isbn);
  if (bdFindUrl) {
    var bdFindLink = document.createElement('a');
    bdFindLink.className = 'find-this-book';
    bdFindLink.href = bdFindUrl;
    bdFindLink.target = '_blank';
    bdFindLink.rel = 'noopener noreferrer';
    bdFindLink.textContent = 'Find this book';
    header.appendChild(bdFindLink);
  }

  wrap.appendChild(header);

  // Stage 3.7c: status selector. Editable on book detail; sibling to
  // ISBN editing below. DOM shape mirrors the shelf-editor 3.5a radio
  // pattern at views.js:727-744 (div wrapper > one label per status,
  // each label > radio + space + text node). Class names differ from
  // 3.5a so 3.10 can style book-detail and shelf-editor independently.
  // Auth-gated: editing user-owned state requires sign-in. onChange
  // mirrors the finish-flip handler at views.js (status write,
  // saveState, re-render); deliberately does NOT touch the finish
  // timestamp -- the Artifact reflects the moment of finishing and
  // un-flipping does not erase that. The (status, hasArtifact) matrix in
  // the header above is unchanged in Stage 1; Stage 2 ships the
  // (reading, hasArtifact) un-finish branch, and between the two
  // commits that state will render incoherently. Expected.
  if (user) {
    var currentStatus = book.status || 'reading';
    var statusWrap = document.createElement('div');
    statusWrap.className = 'book-detail-status';
    var statuses = ['want', 'reading', 'finished'];
    var s;
    for (s = 0; s < statuses.length; s++) {
      var statusLabel = document.createElement('label');
      statusLabel.className = 'book-detail-status-option';
      var statusRadio = document.createElement('input');
      statusRadio.type = 'radio';
      statusRadio.name = 'book-detail-status';
      statusRadio.value = statuses[s];
      if (statuses[s] === currentStatus) statusRadio.checked = true;
      statusRadio.addEventListener('change', function(ev) {
        if (!state.books[bookId]) return;
        state.books[bookId].status = ev.target.value;
        markBooksDirty();
        saveState();
        renderBookDetail(bookId);
      });
      statusLabel.appendChild(statusRadio);
      statusLabel.appendChild(document.createTextNode(' ' + statuses[s]));
      statusWrap.appendChild(statusLabel);
    }
    wrap.appendChild(statusWrap);
  }

  // 3.5b: editable ISBN row with onblur re-fetch. priorIsbn is the
  // closure-cached value the handler compares against on each blur
  // so we never re-fetch when the user blurs without changing the
  // field. The cache is local to this renderBookDetail invocation;
  // a re-render rebuilds the closure with the new persisted value.
  var priorIsbn = (typeof book.isbn === 'string' ? book.isbn : '')
                    .replace(/^\s+|\s+$/g, '');
  var isbnRow = document.createElement('div');
  isbnRow.className = 'book-detail-isbn-row';
  var isbnLabel = document.createElement('label');
  isbnLabel.className = 'book-detail-isbn-label';
  isbnLabel.textContent = 'ISBN';
  var isbnField = document.createElement('input');
  isbnField.type = 'text';
  isbnField.className = 'book-detail-isbn-input';
  isbnField.value = priorIsbn;
  isbnField.placeholder = 'ISBN (optional)';

  isbnField.addEventListener('blur', function() {
    var trimmed = isbnField.value.replace(/^\s+|\s+$/g, '');
    if (trimmed.length === 0) {
      // Empty: clear isbn + coverUrl, persist, re-render. No fetch.
      if (state.books[bookId]) {
        state.books[bookId].isbn     = '';
        state.books[bookId].coverUrl = null;
        markBooksDirty();
        saveState();
      }
      priorIsbn = '';
      renderBookDetail(bookId);
      return;
    }
    if (trimmed === priorIsbn) {
      return;  // No-op.
    }
    // Changed, non-empty: persist new isbn, fire background fetch,
    // re-render only after fetch settles if user is still here.
    if (state.books[bookId]) {
      state.books[bookId].isbn = trimmed;
      markBooksDirty();
      saveState();
    }
    priorIsbn = trimmed;
    fetchAndApplyCover(bookId, trimmed, function() {
      var parts = location.hash.replace(/^#/, '').split('/');
      if (parts[0] === 'book' && parts[1] === bookId) {
        renderBookDetail(bookId);
      }
    });
  });

  isbnRow.appendChild(isbnLabel);
  isbnRow.appendChild(isbnField);
  wrap.appendChild(isbnRow);

  // Editor host -- empty on every render; openMarginaliaEditor
  // mounts its block here on demand.
  var editorHost = document.createElement('div');
  editorHost.id = 'book-detail-editor-host';
  wrap.appendChild(editorHost);

  // Stage 3.8 sub-stage 2b-i: arc picker host -- empty on every render;
  // openBookArcPicker mounts the arc list here when the user clicks
  // "Add to arc…". One host per concern (mirrors the 2a precedent of
  // #notebook-arc-editor-host parallel to #notebook-editor-host) so the
  // picker never collides with the marginalia / artifact editors.
  var arcPickerHost = document.createElement('div');
  arcPickerHost.id = 'book-detail-arc-picker-host';
  wrap.appendChild(arcPickerHost);

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

// Stage 3.7: Artifact view at #artifact/<bookId>. Paints the
// Artifact's title, body, and a substrate link back to book detail
// ("Marginalia and journal for this book ->"). The retrospective
// surface lives separately from book detail by design -- workshop
// floor vs finished room. Defensive empty states cover hand-typed
// hashes: the only in-app entry point is the "Open Artifact" link
// gated on hasArtifact, so (no book) and (book exists, no artifact)
// are reachable only via direct URL entry. textContent (not
// innerHTML) for body keeps writing un-rendered as plain text;
// markdown rendering and visual treatment are 3.10 territory.
function renderArtifact(bookId) {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'artifact-view';

  var book = state.books[bookId];
  if (!book) {
    var notFoundMsg = document.createElement('p');
    notFoundMsg.className = 'artifact-not-found';
    notFoundMsg.textContent = 'Book not found.';
    wrap.appendChild(notFoundMsg);
    var notFoundLink = document.createElement('a');
    notFoundLink.className = 'artifact-back-link';
    notFoundLink.href = '#books';
    notFoundLink.textContent = 'Back to shelf →';
    wrap.appendChild(notFoundLink);
    host.appendChild(wrap);
    return;
  }

  var user = getCurrentUser();
  var artifact = null;
  if (user && state.bookArtifacts) {
    var key = artifactKey(user.uid, bookId);
    if (state.bookArtifacts[key]) {
      artifact = state.bookArtifacts[key];
    }
  }

  if (!artifact) {
    var emptyMsg = document.createElement('p');
    emptyMsg.className = 'artifact-empty';
    emptyMsg.textContent = 'No Artifact yet for this book.';
    wrap.appendChild(emptyMsg);
    var emptyLink = document.createElement('a');
    emptyLink.className = 'artifact-back-link';
    emptyLink.href = '#book/' + bookId;
    emptyLink.textContent = 'Back to book →';
    wrap.appendChild(emptyLink);
    host.appendChild(wrap);
    return;
  }

  var titleEl = document.createElement('h1');
  titleEl.className = 'artifact-title';
  titleEl.textContent = artifact.title || '';
  wrap.appendChild(titleEl);

  var bodyEl = document.createElement('div');
  bodyEl.className = 'artifact-body';
  bodyEl.textContent = artifact.body || '';
  wrap.appendChild(bodyEl);

  var substrateLink = document.createElement('a');
  substrateLink.className = 'artifact-substrate-link';
  substrateLink.href = '#book/' + bookId;
  substrateLink.textContent = 'Marginalia and journal for this book →';
  wrap.appendChild(substrateLink);

  host.appendChild(wrap);
}

// Stage 3.9-a: arc detail view at #arc/<arcId>. Renders the arc's
// members as ONE chronological stream merged from bookIds + entryIds,
// sorted ASCENDING by addedAt (oldest-first: first -> then -> now;
// Cluster 6 -- arcs are intersectional, no sectioning by member type).
// Members are looked up defensively: a missing book or entry renders
// a placeholder rather than crashing, because Firestore replace-merge
// on sign-in can drop a local book that a local-only arc still names
// (Stage 0 finding). Reuses renderShelfBook / renderNotebookEntry
// as-is for member rendering -- no parallel renderers (styling-pass
// scope). Not-found-or-not-yours collapses to a quiet placeholder
// view; user filter mirrors the 2a arc-list filter exactly.
//
// Header carries a 'Delete arc' button. In 3.9-a the button is wired
// to NO handler -- 3.9-b adds the confirm-panel handler. The
// arc-detail-confirm-host div is mounted now so 3.9-b's panel has a
// stable mount point without re-rendering the header.
function renderArcDetail(arcId) {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var arc = state.arcs && state.arcs[arcId];
  var user = getCurrentUser();

  // Stage 5.3 Stage 3b: seed-owned arcs (userId === '__praxis_seed__')
  // are visible to any signed-in user. The sentinel was written by the
  // Stage 3a migration step so the Pedagogy of Desire worked example
  // could live globally rather than per-user-cloned. The user-filter
  // still requires a signed-in user (no unauthenticated arc viewing)
  // and still isolates user-authored arcs to their owner -- the only
  // relaxation is that arc.userId may equal the sentinel without
  // matching user.uid. Any future seed arcs reuse the same sentinel
  // and inherit the same access pass.
  if (!arc || !user) {
    var nf = document.createElement('section');
    nf.className = 'arc-detail-not-found';
    var nfMsg = document.createElement('p');
    nfMsg.textContent = 'That arc could not be found.';
    var nfLink = document.createElement('a');
    nfLink.href = '#notebook';
    nfLink.textContent = 'Back to Notebook';
    nf.appendChild(nfMsg);
    nf.appendChild(nfLink);
    host.appendChild(nf);
    return;
  }
  if (arc.userId !== user.uid && arc.userId !== '__praxis_seed__') {
    var nf = document.createElement('section');
    nf.className = 'arc-detail-not-found';
    var nfMsg = document.createElement('p');
    nfMsg.textContent = 'That arc could not be found.';
    var nfLink = document.createElement('a');
    nfLink.href = '#notebook';
    nfLink.textContent = 'Back to Notebook';
    nf.appendChild(nfMsg);
    nf.appendChild(nfLink);
    host.appendChild(nf);
    return;
  }

  var wrap = document.createElement('section');
  wrap.className = 'arc-detail';

  var header = document.createElement('header');
  header.className = 'arc-detail-header';

  var title = document.createElement('h1');
  title.className = 'arc-detail-title';
  title.textContent = arc.title || '';
  header.appendChild(title);

  if (arc.description) {
    var desc = document.createElement('p');
    desc.className = 'arc-detail-description';
    desc.textContent = arc.description;
    header.appendChild(desc);
  }

  // 3.9-b: delete button opens the in-DOM confirm panel mounted in
  // #arc-detail-confirm-host. arcId captured in the click closure.
  //
  // Stage 5.3 Stage 3b: button label flips to "Hide arc" for seed-owned
  // arcs (userId === '__praxis_seed__'). The action against a seed arc
  // is conceptually a hide (the books in it belong to the global
  // catalog, not the user; the only thing removed is the path through
  // them on this user's Arcs page). The user-authored branch keeps the
  // pre-3b "Delete arc" label intact. openArcDeleteConfirm reads
  // arc.userId off state.arcs[arcId] internally to mirror this branch
  // in the confirm-panel copy + the confirm-action link label.
  var isSeedArc = (arc.userId === '__praxis_seed__');
  var deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'arc-detail-delete';
  deleteBtn.textContent = isSeedArc ? 'Hide arc' : 'Delete arc';
  deleteBtn.addEventListener('click', function() {
    openArcDeleteConfirm(arcId);
  });
  header.appendChild(deleteBtn);

  wrap.appendChild(header);

  // Confirm panel mount -- empty in 3.9-a; 3.9-b populates on demand.
  var confirmHost = document.createElement('div');
  confirmHost.id = 'arc-detail-confirm-host';
  wrap.appendChild(confirmHost);

  // Merge books + entries into one stream, oldest-first by addedAt.
  // The 3.8 attach mutators guarantee every push is well-formed
  // {id, addedAt} (Stage 0 verified by code reading), so no shape
  // check is needed. Defensive id checks protect against console-
  // injected legacy data only.
  var members = [];
  var i;
  for (i = 0; i < arc.bookIds.length; i++) {
    var bm = arc.bookIds[i];
    if (bm && bm.id) {
      members.push({
        kind:    'book',
        id:      bm.id,
        addedAt: bm.addedAt || 0
      });
    }
  }
  for (i = 0; i < arc.entryIds.length; i++) {
    var em = arc.entryIds[i];
    if (em && em.id) {
      members.push({
        kind:    'entry',
        id:      em.id,
        addedAt: em.addedAt || 0
      });
    }
  }
  members.sort(function(x, y) {
    return (x.addedAt || 0) - (y.addedAt || 0);
  });

  if (members.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'arc-detail-empty-body';
    empty.textContent =
      'No books or entries in this arc yet. Open a book or an ' +
      'entry and use "Add to arc…" to attach it here.';
    wrap.appendChild(empty);
  } else {
    var list = document.createElement('div');
    list.className = 'arc-detail-member-list';
    var m;
    for (m = 0; m < members.length; m++) {
      var member = members[m];
      if (member.kind === 'book') {
        var book = state.books && state.books[member.id];
        if (!book) {
          list.appendChild(renderArcMissingMember('book'));
        } else {
          // Stage 5.3 Stage 4: each arc-member book gets a "Find this
          // book" line beneath the shelf-book card. The shelf-book card
          // itself is an <a> (whole-card link to #book/<id>), so the
          // Bookshop link CANNOT nest inside it -- nested anchors are
          // invalid HTML. Wrap the card + the find link in a
          // .arc-detail-book-member container so the pair reads as one
          // unit; the find link's CSS attaches it visually to the card
          // above. buildBookshopUrl returns null for books without an
          // ISBN -- in that case we skip the link entirely (no
          // title-search fallback per the locked spec).
          var memberWrap = document.createElement('div');
          memberWrap.className = 'arc-detail-book-member';
          memberWrap.appendChild(renderShelfBook(book));
          var arcFindUrl = buildBookshopUrl(book.isbn);
          if (arcFindUrl) {
            var arcFindLink = document.createElement('a');
            arcFindLink.className = 'find-this-book';
            arcFindLink.href = arcFindUrl;
            arcFindLink.target = '_blank';
            arcFindLink.rel = 'noopener noreferrer';
            arcFindLink.textContent = 'Find this book';
            memberWrap.appendChild(arcFindLink);
          }
          list.appendChild(memberWrap);
        }
      } else {
        var entry = state.notebookEntries
          && state.notebookEntries[member.id];
        if (!entry) {
          list.appendChild(renderArcMissingMember('entry'));
        } else {
          list.appendChild(renderNotebookEntry(entry));
        }
      }
    }
    wrap.appendChild(list);
  }

  host.appendChild(wrap);
}

// Placeholder row for an arc member whose underlying book or entry
// can no longer be resolved. Two reachable causes (Stage 0): Firestore
// REPLACE-merge on sign-in dropping a local book (book case), or
// console-side state manipulation (either case). Quiet copy, no
// affordances -- this is information, not an action surface. A future
// stage may add a "remove from arc" repair affordance; out of 3.9 scope.
function renderArcMissingMember(kind) {
  var node = document.createElement('div');
  node.className = 'arc-detail-missing-member';
  node.textContent = (kind === 'book')
    ? 'A book that was in this arc is no longer in your library.'
    : 'An entry that was in this arc is no longer in your notebook.';
  return node;
}

// Stage 3.9-b: in-DOM delete-arc confirmation. Mounts into
// #arc-detail-confirm-host. Native confirm() is avoided -- the
// codebase's prior precedent (openNotebookSettings + the arc pickers)
// is in-DOM panels built from createElement primitives, and this is
// the first destructive-action confirmation in the file. The copy
// MUST explicitly state member books and entries are NOT deleted,
// only the arc -- removing a path through the graph, not its waypoints.
//
// Cancel clears the host innerHTML; the arc detail view underneath is
// untouched. Confirm calls deleteArc(arcId); on TRUE saveState then
// navigate to #notebook via location.hash assignment (the hashchange
// path fires renderRoute -> renderNotebook, and the deleted arc is
// gone from the arc-list). On FALSE the arc was already gone (race
// across tabs, or console-side delete) -- replace the panel contents
// with a quiet stale-note and a back-to-Notebook link rather than
// crashing or re-opening the same confirm panel.
function openArcDeleteConfirm(arcId) {
  var host = document.getElementById('arc-detail-confirm-host');
  if (!host) return;
  host.innerHTML = '';

  // Stage 5.3 Stage 3b: branch copy + action-link label by arc
  // ownership. Seed-owned arcs (userId === '__praxis_seed__') get
  // "Hide" framing -- the books in them are part of the global
  // catalog, not the user's library, and shouldn't be described as
  // "staying in your library" (truth-telling: the user never had
  // them there). User-authored arcs keep the pre-3b "Delete" framing
  // verbatim. The post-action redirect also branches: hiding a seed
  // arc lands on #arcs (where the seed-arc card lived), while
  // deleting a user-authored arc lands on #notebook (where the
  // Notebook arc-list lives) -- each return surface matches where
  // the affordance came from. arcOwned is read from state.arcs at
  // panel-open time; if the arc was already deleted between Delete-
  // button click and confirm, we fall back to the seed-side label
  // safely (because the action's deleteArc call will return false
  // and trip the stale-note branch below anyway).
  var arcRecord = state.arcs && state.arcs[arcId];
  var isSeedArc = !!(arcRecord &&
                     arcRecord.userId === '__praxis_seed__');

  var panel = document.createElement('div');
  panel.className = 'arc-confirm-panel';

  var copy = document.createElement('p');
  copy.className = 'arc-confirm-copy';
  if (isSeedArc) {
    copy.textContent =
      'Hide this example arc? The books in it are part of the ' +
      'global catalog and stay where they are. This arc won\'t ' +
      'reappear on your Arcs page.';
  } else {
    copy.textContent =
      'Delete this arc? The books and entries in it stay in your ' +
      'library and notebook — only the arc is removed.';
  }
  panel.appendChild(copy);

  var actions = document.createElement('div');
  actions.className = 'arc-confirm-actions';

  var confirmLink = document.createElement('a');
  confirmLink.href = '#';
  confirmLink.className = 'arc-confirm-confirm';
  confirmLink.textContent = isSeedArc ? 'Hide arc' : 'Delete arc';
  confirmLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    var ok = deleteArc(arcId);
    if (ok) {
      saveState();
      // Stage 5.3 Stage 3b: seed-arc hide returns the user to the
      // Arcs page (the surface they came from); user-authored delete
      // returns to the Notebook (where their other arcs live). Both
      // are safe destinations -- the seed-arc card guard in
      // renderArcsPage will skip-render after delete, and the
      // Notebook arc-list filter excludes the sentinel-owned arc
      // anyway.
      location.hash = isSeedArc ? '#arcs' : '#notebook';
    } else {
      // Arc already gone (race / console-side delete). Quiet stale-
      // note in place of the panel; user can step back to the
      // Notebook from here without a crash or a redundant re-confirm.
      var h = document.getElementById('arc-detail-confirm-host');
      if (!h) return;
      h.innerHTML = '';
      var staleNote = document.createElement('p');
      staleNote.className = 'arc-confirm-stale-note';
      staleNote.textContent = 'That arc has already been removed.';
      var backLink = document.createElement('a');
      backLink.href = '#notebook';
      backLink.className = 'arc-confirm-stale-back';
      backLink.textContent = 'Back to Notebook';
      h.appendChild(staleNote);
      h.appendChild(backLink);
    }
  });
  actions.appendChild(confirmLink);

  var cancelLink = document.createElement('a');
  cancelLink.href = '#';
  cancelLink.className = 'arc-confirm-cancel';
  cancelLink.textContent = 'Cancel';
  cancelLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    var h = document.getElementById('arc-detail-confirm-host');
    if (h) h.innerHTML = '';
  });
  actions.appendChild(cancelLink);

  panel.appendChild(actions);
  host.appendChild(panel);
}

function openMarginaliaEditor(bookId) {
  openEditor({
    hostId:         'book-detail-editor-host',
    emptySelector:  '.book-detail-empty-body',
    showTitleField: false,
    onSave: function(_titleVal, bodyVal) {
      var user = getCurrentUser();
      if (!user) return;
      var now = Date.now();
      var id  = genEntryId();
      var entry = {
        id:         id,
        userId:     user.uid,
        register:   'marginalia',
        isPrivate:  getRegisterDefault('marginalia'),
        body:       bodyVal,
        bookIds:    [bookId],
        arcIds:     [],
        createdAt:  now,
        updatedAt:  now
      };
      state.notebookEntries[id] = entry;
      saveState();
      renderBookDetail(bookId);
    },
    onCancel: function() {
      renderBookDetail(bookId);
    }
  });
}

// Stage 3.7: Artifact draft editor. Mounted into the book-detail
// editor host (shared with marginalia -- only one editor lives there
// at a time). Title pre-fills from book.title; user may edit before
// save. Save is gated on title-non-empty; body is optional. Write
// goes through ensureOneArtifact so a second invocation for the same
// (uid, bookId) is a no-op (constitutional principle #3). Reached
// from two entry points, both gated on !hasArtifact: the "I've
// finished this" button (auto-opens after status flip) and the
// "Create Artifact" CTA on book detail (when status === 'finished'
// && !hasArtifact, e.g. after the user cancelled the auto-opened
// editor).
function openArtifactEditor(bookId) {
  var book = state.books[bookId];
  if (!book) return;
  openEditor({
    hostId:         'book-detail-editor-host',
    emptySelector:  '.book-detail-empty-body',
    showTitleField: true,
    titlePrefill:   book.title || '',
    onSave: function(titleVal, bodyVal) {
      var user = getCurrentUser();
      if (!user) return;
      var now = Date.now();
      var artifact = {
        userId:    user.uid,
        bookId:    bookId,
        title:     titleVal,
        body:      bodyVal,
        createdAt: now,
        updatedAt: now
      };
      ensureOneArtifact(user.uid, bookId, artifact);
      saveState();
      renderBookDetail(bookId);
    },
    onCancel: function() {
      renderBookDetail(bookId);
    }
  });
}

// Stage 3.8 sub-stage 2b: arc picker, shared shape. Two callers --
// openBookArcPicker (2b-i) attaches the current book; openEntryArcPicker
// (2b-ii) attaches the current entry. The panel-building, arc-filtering,
// row-binding, status-note, and Done-link logic are all identical
// between them; only the click-side mutator (addBookToArc vs
// addEntryToArc), the re-render target, and the close-shape (host
// innerHTML clear vs inline mount removal) differ. buildArcPickerPanel
// expresses the shared shape; the two openX wrappers carry the
// caller-specific bits via onPick / onDone callbacks.
//
// Per-row click handlers use appendArcPickerRow so each arc.id is
// captured in its own closure scope -- var-in-for-loop would share the
// loop variable, binding every row to the last arc.
function buildArcPickerPanel(opts) {
  // opts: { user, label, statusMsg, onPick(arcId), onDone() }
  var panel = document.createElement('div');
  panel.className = 'arc-picker-panel';

  var labelEl = document.createElement('div');
  labelEl.className = 'arc-picker-label';
  labelEl.textContent = opts.label;
  panel.appendChild(labelEl);

  if (typeof opts.statusMsg === 'string' && opts.statusMsg.length > 0) {
    var status = document.createElement('p');
    status.className = 'arc-picker-status';
    status.textContent = opts.statusMsg;
    panel.appendChild(status);
  }

  var arcItems = [];
  var arcMap = state.arcs || {};
  var arcKey;
  for (arcKey in arcMap) {
    if (Object.prototype.hasOwnProperty.call(arcMap, arcKey)) {
      var arc = arcMap[arcKey];
      if (arc && arc.userId === opts.user.uid) {
        arcItems.push(arc);
      }
    }
  }
  arcItems.sort(function(x, y) {
    return (y.createdAt || 0) - (x.createdAt || 0);
  });

  if (arcItems.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'arc-picker-empty';
    empty.textContent =
      'No arcs yet — create one from the Notebook.';
    panel.appendChild(empty);
  } else {
    var i;
    for (i = 0; i < arcItems.length; i++) {
      appendArcPickerRow(panel, arcItems[i], opts.onPick);
    }
  }

  var done = document.createElement('a');
  done.href = '#';
  done.className = 'arc-picker-done';
  done.textContent = 'Done';
  done.addEventListener('click', function(ev) {
    ev.preventDefault();
    opts.onDone();
  });
  panel.appendChild(done);

  return panel;
}

function appendArcPickerRow(panel, arc, onPick) {
  var row = document.createElement('a');
  row.href = '#';
  row.className = 'arc-picker-row';
  row.textContent = arc.title || '';
  row.addEventListener('click', function(ev) {
    ev.preventDefault();
    onPick(arc.id);
  });
  panel.appendChild(row);
}

// Book arc picker (2b-i). Mounts the shared panel into
// #book-detail-arc-picker-host. On a true return from addBookToArc,
// saveState + renderBookDetail -- the re-render rebuilds the wrap and
// the picker host gets re-created empty as a side effect. On false
// (already attached), re-open the picker in place with a quiet inline
// status note. Done clears host.innerHTML.
function openBookArcPicker(bookId, statusMsg) {
  var host = document.getElementById('book-detail-arc-picker-host');
  if (!host) return;
  var user = getCurrentUser();
  if (!user) return;

  host.innerHTML = '';
  host.appendChild(buildArcPickerPanel({
    user:      user,
    label:     'Add this book to an arc',
    statusMsg: statusMsg,
    onPick: function(arcId) {
      var ok = addBookToArc(arcId, bookId);
      if (ok) {
        saveState();
        renderBookDetail(bookId);
      } else {
        openBookArcPicker(bookId, 'Already in that arc.');
      }
    },
    onDone: function() {
      var h = document.getElementById('book-detail-arc-picker-host');
      if (h) h.innerHTML = '';
    }
  }));
}

// Entry arc picker (2b-ii). Mounts the shared panel into a per-card
// inline element (no global host -- per-card scope can't live on a
// shared host). On a true return from addEntryToArc, saveState then a
// route-aware re-render: #book/<id> stays on book detail (entries
// render in the marginalia list there too), anything else returns to
// the Notebook. Same route-check shape as togglePrivacy. On false
// (already attached), re-open the picker in place with a quiet inline
// status note. Done clears mountEl.innerHTML; the inline mount element
// itself is left in the DOM, but its empty state is visually inert
// (the styling pass will hide empty picker mounts).
function openEntryArcPicker(entryId, mountEl, statusMsg) {
  if (!mountEl) return;
  var user = getCurrentUser();
  if (!user) return;

  mountEl.innerHTML = '';
  mountEl.appendChild(buildArcPickerPanel({
    user:      user,
    label:     'Add this entry to an arc',
    statusMsg: statusMsg,
    onPick: function(arcId) {
      var ok = addEntryToArc(arcId, entryId);
      if (ok) {
        saveState();
        if (location.hash.indexOf('#book/') === 0) {
          renderBookDetail(state.currentBookId);
        } else {
          renderNotebook();
        }
      } else {
        openEntryArcPicker(entryId, mountEl, 'Already in that arc.');
      }
    },
    onDone: function() {
      mountEl.innerHTML = '';
    }
  }));
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

  // Stage 3.8 sub-stage 2b-ii: per-card "add to arc" link. Mirrors the
  // privacy-toggle link shape inside the meta row -- <a href="#"> with
  // capturedId in closure. The picker mounts inline inside this card,
  // not in a global host: per-card scope can't live on a shared host
  // because the click attribution would be ambiguous. The inline mount
  // element is created lazily on first click and reused on subsequent
  // clicks (the picker's mountEl.innerHTML = '' resets the contents
  // each time it opens).
  var addToArcLink = document.createElement('a');
  addToArcLink.href = '#';
  addToArcLink.className = 'notebook-entry-add-to-arc';
  addToArcLink.textContent = 'add to arc';
  addToArcLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    var mount = card.querySelector('.notebook-entry-arc-picker-host');
    if (!mount) {
      mount = document.createElement('div');
      mount.className = 'notebook-entry-arc-picker-host';
      card.appendChild(mount);
    }
    openEntryArcPicker(capturedId, mount);
  });
  meta.appendChild(addToArcLink);

  var bodyEl = document.createElement('div');
  bodyEl.className = 'notebook-entry-body';
  bodyEl.textContent = entry.body || '';

  card.appendChild(meta);
  card.appendChild(bodyEl);
  return card;
}

// Stage 3.7: render a bookArtifact as a card in the /notebook stream.
// Distinct className (notebook-artifact-card vs notebook-entry) so
// styling can diverge in 3.10 -- minimum-distinguishable for 3.7.
// "Artifact" marker replaces the entry register marker. No inline
// privacy toggle (artifacts do not carry isPrivate today; if/when
// they do, this card will mirror the entry card's affordance).
// Click anywhere on the card navigates to the Artifact view.
function renderArtifactCard(artifact) {
  var card = document.createElement('article');
  card.className = 'notebook-artifact-card';
  card.addEventListener('click', function() {
    if (artifact.bookId) {
      location.hash = '#artifact/' + artifact.bookId;
    }
  });

  var meta = document.createElement('div');
  meta.className = 'notebook-artifact-meta';

  var markerEl = document.createElement('span');
  markerEl.className = 'notebook-artifact-marker';
  markerEl.textContent = 'Artifact';
  meta.appendChild(markerEl);

  var timeEl = document.createElement('time');
  var ts = new Date(artifact.createdAt || 0);
  timeEl.textContent = ts.toLocaleString();
  if (artifact.createdAt) {
    timeEl.setAttribute('datetime', ts.toISOString());
  }
  meta.appendChild(timeEl);

  var bookMeta = document.createElement('div');
  bookMeta.className = 'notebook-artifact-book-meta';
  var book = (artifact.bookId && state.books && state.books[artifact.bookId])
    || null;
  var bookTitleText = (book && book.title) || '(unknown book)';
  bookMeta.textContent = 'from ' + bookTitleText;
  meta.appendChild(bookMeta);

  card.appendChild(meta);

  var titleEl = document.createElement('div');
  titleEl.className = 'notebook-artifact-title';
  titleEl.textContent = artifact.title || '';
  card.appendChild(titleEl);

  var bodyText = artifact.body || '';
  if (bodyText.length > 0) {
    var bodyEl = document.createElement('div');
    bodyEl.className = 'notebook-artifact-body';
    if (bodyText.length > 200) {
      bodyEl.textContent = bodyText.substring(0, 197) + '...';
    } else {
      bodyEl.textContent = bodyText;
    }
    card.appendChild(bodyEl);
  }

  return card;
}

// Stage 3.8: render a single arc as an inert row in the arc-list
// block. Title is always present (createArc rejects empty titles after
// trim); description renders only when non-empty so an arc without a
// description does not leave an empty subordinate line. Rows are inert
// this stage -- arc detail navigation is 3.9. Mirrors the entry card's
// <article>-based structure for visual consistency with the post-3.8
// styling pass; no event handlers wired.
function renderArcRow(arc) {
  // 3.9: row navigates to #arc/<id>. Anchor-element pattern mirrors
  // renderShelfBook -- the browser's hashchange path fires renderRoute,
  // which dispatches to renderArcDetail. className is preserved from
  // 2a so styling-pass selectors do not break; only the tag changes
  // (inert <article> -> clickable <a>).
  var row = document.createElement('a');
  row.className = 'notebook-arc-row';
  row.href = '#arc/' + arc.id;

  var titleEl = document.createElement('div');
  titleEl.className = 'notebook-arc-title';
  titleEl.textContent = arc.title || '';
  row.appendChild(titleEl);

  if (arc.description) {
    var descEl = document.createElement('div');
    descEl.className = 'notebook-arc-description';
    descEl.textContent = arc.description;
    row.appendChild(descEl);
  }

  return row;
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

  // Stage 3.7: Recent book Artifacts. Same provenance and truncation
  // rules as recentEntries -- this is what Yumi sees of the user's
  // finished-room writing, subject to the same privacy filter the
  // entries loop uses (artifacts do not carry isPrivate today; the
  // filter is the contract). Principle #5 -- anything captured is
  // visible and correctable to the user, including via this surface.
  var artifactsSec = renderTransparencySection('Recent book Artifacts');
  var artifactsBody = artifactsSec.querySelector('.transparency-section-body');
  if (snap.recentArtifacts.length === 0) {
    artifactsBody.textContent =
      'No Artifacts are visible to Yumi right now. Marking a book ' +
      'finished and writing its Artifact will surface it here.';
  } else {
    var ai;
    for (ai = 0; ai < snap.recentArtifacts.length; ai++) {
      artifactsBody.appendChild(
        renderTransparencyArtifact(snap.recentArtifacts[ai])
      );
    }
  }
  panel.appendChild(artifactsSec);

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

// Stage 3.7: render one recentArtifacts snapshot item as a card.
// Mirrors renderTransparencyEntry structurally; title and book
// attribution replace the register marker since artifacts do not
// carry the journal/marginalia register distinction.
function renderTransparencyArtifact(item) {
  var card = document.createElement('article');
  card.className = 'transparency-artifact';

  var titleEl = document.createElement('div');
  titleEl.className = 'transparency-artifact-title';
  titleEl.textContent = item.title || '';
  card.appendChild(titleEl);

  if (item.body && item.body.length > 0) {
    var bodyEl = document.createElement('div');
    bodyEl.className = 'transparency-artifact-body';
    bodyEl.textContent = item.body;
    card.appendChild(bodyEl);
  }

  var meta = document.createElement('div');
  meta.className = 'transparency-artifact-meta';
  var metaText = 'Artifact';
  if (item.bookTitle) {
    metaText = metaText + ' from ' + item.bookTitle;
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
  renderArtifact:        renderArtifact,
  openJournalEditor:     openJournalEditor,
  openMarginaliaEditor:  openMarginaliaEditor,
  openShelfEditor:       openShelfEditor,
  openNotebookSettings:  openNotebookSettings,
  togglePrivacy:         togglePrivacy,
  setRegisterDefault:    setRegisterDefault,
  openTransparencyView:  openTransparencyView,
  closeTransparencyView: closeTransparencyView
};

console.log('views.js loaded');
