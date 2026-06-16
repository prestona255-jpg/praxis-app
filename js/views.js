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
// The "What Yumi sees" affordance in the Notebook header opens an
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

// Stage 3 (chrome-fidelity): shelf view-mode persistence. Mirrors the arc
// view-mode pattern above -- localStorage, one global preference, default
// 'covers'. The allow-list coerces any corrupt/hand-edited value back to
// the safe default in both the getter and setter.
function getShelfView() {
  var v = ls('praxis_shelf_view', 'covers');
  if (v !== 'covers' && v !== 'list') {
    return 'covers';
  }
  return v;
}

function setShelfView(v) {
  if (v !== 'covers' && v !== 'list') {
    return;
  }
  sv('praxis_shelf_view', v);
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
  if (parts[0] === 'arc' || parts[0] === 'arcs' || parts[0] === 'subtheory') {
    activeRoute = 'arcs';
  } else if (parts[0] === 'book' || parts[0] === 'artifact' ||
      parts[0] === 'books') {
    activeRoute = 'books';
  } else if (parts[0] === 'home') {
    // Batch 4A: Home is its own top-nav surface (landing route).
    activeRoute = 'home';
  } else if (parts[0] === 'account') {
    // Stage 14.3 Stage 4: the Account page is its own top-nav surface.
    activeRoute = 'account';
  } else if (parts[0] === 'yumi-sees') {
    // 6.2c: the 'What Yumi sees' page is reached from Yumi's panel, not
    // the top nav -- this value matches no data-route so no link highlights.
    activeRoute = 'yumi-sees';
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

  // Batch 1: populate the gradient avatar's initial from the cached
  // user (getCurrentUser -> .displayName, then .email), falling back
  // to 'P' when signed out or nameless. Plain var/string-concat.
  var initialEl = document.querySelector('.app-nav-profile-initial');
  if (initialEl) {
    var navUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    var initial = 'P';
    if (navUser && typeof navUser.displayName === 'string' && navUser.displayName.length > 0) {
      initial = navUser.displayName.charAt(0).toUpperCase();
    } else if (navUser && typeof navUser.email === 'string' && navUser.email.length > 0) {
      initial = navUser.email.charAt(0).toUpperCase();
    }
    initialEl.textContent = initial;

    // Canon §4-D: populate the mobile-menu profile-row name. Mirrors the
    // avatar derivation (displayName -> email) so the row matches the
    // avatar initial; the account-page display-name override is an
    // account-surface concern, not the nav's. Hidden on desktop via CSS.
    var navNameEl = document.querySelector('.app-nav-profile-name');
    if (navNameEl) {
      var navName = 'Your account';
      if (navUser && typeof navUser.displayName === 'string' && navUser.displayName.length > 0) {
        navName = navUser.displayName;
      } else if (navUser && typeof navUser.email === 'string' && navUser.email.length > 0) {
        navName = navUser.email;
      }
      navNameEl.textContent = navName;
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
    state.currentSubTheoryId = null;
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
    state.currentSubTheoryId = null;
    saveState();
    renderArtifact(parts[1]);
    return;
  }
  // 9.2: sub-theory creation. The hash 'arc/<arcId>/new-subtheory'
  // mints a fresh draft under the arc and redirects to its stable
  // detail route. Must come BEFORE the 'arc && parts[1]' block below:
  // 'arc/<id>/new-subtheory' has parts[1] truthy, so the arc-detail
  // block would otherwise swallow it. location.replace (not assign)
  // keeps the create-hash out of history so a Back press does not
  // re-mint a second empty draft, and a refresh on the resulting
  // #subtheory/<id> is stable. A bad/absent arc yields null from
  // createSubTheory -> fall back to the Arcs page.
  if (parts[0] === 'arc' && parts[2] === 'new-subtheory') {
    var draft = createSubTheory(parts[1], {});
    if (draft) {
      location.replace('#subtheory/' + draft.id);
    } else {
      location.replace('#arcs');
    }
    return;
  }
  // 9.2: sub-theory detail / writing surface. Setting currentSubTheoryId
  // drives yumi-brain's currentSubTheory lens; currentArcId is set to
  // the parent arc so the arc lens stays coherent (the sub-theory lives
  // inside that arc), and currentBookId clears. A dangling id still sets
  // the pointer -- renderSubTheoryPage owns the not-found render.
  if (parts[0] === 'subtheory' && parts[1]) {
    var stRec = state.subTheories[parts[1]];
    state.currentSubTheoryId = parts[1];
    state.currentArcId  = stRec ? stRec.arcId : null;
    state.currentBookId = null;
    saveState();
    renderSubTheoryPage(parts[1]);
    return;
  }
  if (parts[0] === 'arc' && parts[1]) {
    // 3.9: arc detail. Setting currentArcId keeps yumi-brain's
    // currentArc context lens accurate; clearing currentBookId is the
    // symmetric half (entering an arc is leaving any book).
    state.currentArcId  = parts[1];
    state.currentBookId = null;
    state.currentSubTheoryId = null;
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
    state.currentSubTheoryId = null;
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
    state.currentSubTheoryId = null;
    saveState();
    renderArcsPage();
    return;
  }
  // Stage 14.3 Stage 4: Account page (#account). Symmetric clear of the
  // three pointer fields, mirroring the books / arcs / notebook branches
  // -- entering the Account page is leaving any book, arc, and sub-theory.
  // Placed BEFORE the notebook fallthrough so #account is caught here, not
  // swallowed by the catch-all below.
  if (parts[0] === 'account') {
    state.currentBookId = null;
    state.currentArcId  = null;
    state.currentSubTheoryId = null;
    saveState();
    renderAccountPage();
    return;
  }
  // Batch 4A: Home landing surface (#home). Symmetric clear of the three
  // pointer fields, mirroring the books / arcs / account branches --
  // entering Home is leaving any book, arc, and sub-theory. Placed BEFORE
  // the notebook fallthrough so #home is caught here, not swallowed by the
  // catch-all (which is left as-is for empty / unknown hashes).
  if (parts[0] === 'home') {
    state.currentBookId = null;
    state.currentArcId  = null;
    state.currentSubTheoryId = null;
    saveState();
    renderHome();
    return;
  }
  // 6.2c: 'What Yumi sees' transparency page (#yumi-sees). Reached from
  // Yumi's panel affordance, not the top nav. Symmetric pointer clear
  // mirroring the account / home branches. Placed BEFORE the notebook
  // fallthrough so the route is caught here, not swallowed by the catch-all.
  if (parts[0] === 'yumi-sees') {
    state.currentBookId = null;
    state.currentArcId  = null;
    state.currentSubTheoryId = null;
    saveState();
    renderWhatYumiSeesPage();
    return;
  }
  // Notebook (explicit), empty hash, and any unknown route all
  // converge on the unified Notebook view. currentBookId clears
  // symmetrically on the way in so yumi-brain's retrieval path
  // does not carry a stale book reference.
  state.currentBookId = null;
  state.currentArcId  = null;
  state.currentSubTheoryId = null;
  saveState();
  renderNotebook();
}

// Batch 4A: Home landing surface, reconciled from the mockup's Home
// section (a centered hero + a static preview frame). Presentational
// only -- no marks, no constellation canvas, no data read. The CTA
// anchors reuse the established gradient-primary / outline-secondary
// button variants (scoped under .home-cta-* so book-detail grid rules do
// not leak in) and navigate via the hash router like every other link.
function renderHome() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'home-page';

  // ----- Hero -----
  var hero = document.createElement('div');
  hero.className = 'home-hero';

  var h1 = document.createElement('h1');
  h1.className = 'home-hero-title';
  h1.appendChild(document.createTextNode('Your reading becomes '));
  var accent = document.createElement('span');
  accent.className = 'home-hero-accent';
  accent.textContent = 'theory.';
  h1.appendChild(accent);
  hero.appendChild(h1);

  var sub = document.createElement('p');
  sub.className = 'home-hero-sub';
  sub.textContent = 'Read, gather evidence, and build a living ' +
    'constellation of your own thinking \u2014 in practice, with Yumi.';
  hero.appendChild(sub);

  var cta = document.createElement('div');
  cta.className = 'home-cta';

  var ctaPrimary = document.createElement('a');
  ctaPrimary.className = 'home-cta-primary';
  ctaPrimary.href = '#arcs';
  ctaPrimary.textContent = 'Open the constellation';
  cta.appendChild(ctaPrimary);

  var ctaSecondary = document.createElement('a');
  ctaSecondary.className = 'home-cta-secondary';
  ctaSecondary.href = '#books';
  ctaSecondary.textContent = 'Browse your shelf';
  cta.appendChild(ctaSecondary);

  hero.appendChild(cta);
  wrap.appendChild(hero);

  // ----- Preview frame: a live, INERT mini-constellation of the seed arc
  // when it resolves with sub-theories; otherwise the static copy. -----
  var preview = document.createElement('div');
  preview.className = 'home-preview';

  var pvEyebrow = document.createElement('p');
  pvEyebrow.className = 'eyebrow';
  pvEyebrow.textContent = 'A living constellation';
  preview.appendChild(pvEyebrow);

  // FINALE (chrome-fidelity): embed the seed arc's constellation READ-ONLY.
  // Resolve the globally-viewable sentinel-owned seed arc, build the same data
  // contract the arc-detail web view uses, and render it into an <svg> with NO
  // interaction layers (no _stConstellationAttachInteractions, no
  // attachSubTheoryDrag) -- inert by construction. The whole svg is wrapped in
  // a link to the full seed arc. Falls back to the static copy when the seed
  // arc is absent or has zero sub-theories (never a blank canvas; no faked
  // data). arc-constellation.js is only CALLED here, never edited.
  var homeSeedArcId = (state.seeds && state.seeds.pedagogyOfDesire)
    ? state.seeds.pedagogyOfDesire.arcId : null;
  var homeSeedArc = (homeSeedArcId && state.arcs)
    ? state.arcs[homeSeedArcId] : null;
  var homeArcData = (homeSeedArc &&
    typeof _arcDetailBuildSubTheoryData === 'function')
    ? _arcDetailBuildSubTheoryData(homeSeedArc) : null;

  if (homeArcData && homeArcData.subTheories &&
      homeArcData.subTheories.length &&
      typeof window.renderSubTheoryConstellation === 'function') {
    var pvLink = document.createElement('a');
    pvLink.className = 'home-preview-embed';
    pvLink.href = '#arc/' + homeSeedArcId;
    var HOME_SVG_NS = 'http://www.w3.org/2000/svg';
    var pvSvg = document.createElementNS(HOME_SVG_NS, 'svg');
    // 9a: wide-banner viewBox (was 600x500). Set ONLY here -- arc-detail keeps
    // its own 0 0 600 500 independently, so this is embed-scoped by construction.
    pvSvg.setAttribute('viewBox', '0 0 940 340');
    pvSvg.setAttribute('xmlns', HOME_SVG_NS);
    pvLink.appendChild(pvSvg);
    preview.appendChild(pvLink);
    // Read-only: render the field only. NO interaction layers attached, so
    // there is no per-mark drag / connect / tap / hover-card anywhere. The arc's
    // off-center question (= arc.title, via _stRenderQuestion) already serves as
    // the banner's title, so no separate title overlay is added (would duplicate
    // it). markScale sizes the embed marks independently of the wide viewBox
    // (arc-detail passes no markScale -> unchanged).
    window.renderSubTheoryConstellation(homeArcData, pvSvg,
      { showLegend: false, markScale: 1.15 });
  } else {
    var pvLine = document.createElement('p');
    pvLine.className = 'home-preview-line';
    pvLine.textContent =
      'Your arcs and the ideas between them, drawn as you read.';
    preview.appendChild(pvLine);
  }

  wrap.appendChild(preview);

  host.appendChild(wrap);
}

// N1: the active spread tab persists across re-renders (tab clicks call
// renderNotebook). Keys: 'inbox', 'journal', or a bookId. Resolved against the
// live tab model each render, falling back to the first tab if it went stale.
var notebookActiveTab = 'inbox';
// N3 gather -> sub-theory: the gathered entry set + the chosen arc + the typed
// name, persisted across re-renders (gather toggles re-render the spread).
var notebookGathered = {};
var notebookGatherArc = null;
var notebookGatherName = '';

function renderNotebook() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'notebook';

  // Header: title + auth-aware affordance.
  var header = document.createElement('header');
  header.className = 'notebook-header';

  // Batch 3 F1: eyebrow + title in a left block (mockup notebook header).
  var titleBlock = document.createElement('div');
  titleBlock.className = 'notebook-title-block';

  var eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Structurally private';
  titleBlock.appendChild(eyebrow);

  var title = document.createElement('h1');
  title.className = 'notebook-title';
  title.textContent = 'Notebook';
  titleBlock.appendChild(title);

  header.appendChild(titleBlock);

  var user = getCurrentUser();
  if (user) {
    // N1 spread header-right: the master consent switch (DISPLAY-ONLY in N1 --
    // wired interactive in N2) + the existing "What Yumi sees" transparency
    // link (reused verbatim -> openTransparencyView). The old +New entry /
    // +New arc / Settings buttons are superseded by the spread: inline capture
    // (N2 writeline) and the master switch replace them. (openJournalEditor /
    // openArcEditor / openNotebookSettings remain defined but unreferenced --
    // cleanup deferred to N5.)
    var hright = document.createElement('div');
    hright.className = 'notebook-hright';

    hright.appendChild(buildNotebookMasterSwitch(user));

    var transparencyBtn = document.createElement('button');
    transparencyBtn.type = 'button';
    transparencyBtn.className = 'notebook-transparency-toggle notebook-hright-link';
    transparencyBtn.textContent = 'What Yumi sees';
    transparencyBtn.addEventListener('click', function() {
      openTransparencyView();
    });
    hright.appendChild(transparencyBtn);

    header.appendChild(hright);
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

  // Transparency host -- "What Yumi sees" (openTransparencyView) mounts here.
  var transparencyHost = document.createElement('div');
  transparencyHost.id = 'notebook-transparency-host';
  wrap.appendChild(transparencyHost);

  // Editor host -- the N2 inline writeline will mount its editor here. Empty in N1.
  var editorHost = document.createElement('div');
  editorHost.id = 'notebook-editor-host';
  wrap.appendChild(editorHost);

  // Signed out: the header already carries the sign-in prompt; the spread is
  // per-user, so render a quiet note instead of reading a null user's uid.
  if (!user) {
    var signedOut = document.createElement('p');
    signedOut.className = 'notebook-empty-body';
    signedOut.textContent = 'Sign in to open your notebook.';
    wrap.appendChild(signedOut);
    host.appendChild(wrap);
    return;
  }

  // N1: one pass over the signed-in user's entries -> tab membership + counts,
  // then the tab row and the two-leaf spread. READ-ONLY: no capture/gather/writes.
  // (Artifacts are out of the spread for N1; they remain reachable via book detail.)
  var entries = [];
  var emap = state.notebookEntries || {};
  var ekey;
  for (ekey in emap) {
    if (Object.prototype.hasOwnProperty.call(emap, ekey)) {
      var ent = emap[ekey];
      if (ent && ent.userId === user.uid) { entries.push(ent); }
    }
  }
  entries.sort(function(a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });

  var tabs = buildNotebookTabModel(user, entries);
  var activeKey = notebookActiveTab;
  var foundActive = false;
  var ti;
  for (ti = 0; ti < tabs.length; ti = ti + 1) {
    if (tabs[ti].key === activeKey) { foundActive = true; break; }
  }
  if (!foundActive) {
    activeKey = tabs.length ? tabs[0].key : 'inbox';
    notebookActiveTab = activeKey;
  }

  wrap.appendChild(buildNotebookTabRow(tabs, activeKey));

  var spread = document.createElement('div');
  spread.className = 'notebook-spread';
  spread.appendChild(buildNotebookLeftLeaf(activeKey, tabs, entries));
  spread.appendChild(buildNotebookRightLeaf(user));
  wrap.appendChild(spread);

  host.appendChild(wrap);
}

// ===== N1 spread helpers. Display / aggregation only -- no writes. =====

// Membership predicate shared by the counts AND the left-leaf render, so a
// tab's count and its rendered entries can never disagree. Routing (locked F3):
//   journal : register === 'journal'
//   inbox   : register !== 'journal' && filed === false
//   <bookId>: register !== 'journal' && filed === true && bookId in bookIds
function notebookEntryMatchesTab(entry, tabKey) {
  if (tabKey === 'journal') { return entry.register === 'journal'; }
  if (tabKey === 'inbox') {
    return entry.register !== 'journal' && entry.filed === false;
  }
  if (entry.register === 'journal' || entry.filed !== true || !entry.bookIds) {
    return false;
  }
  var i;
  for (i = 0; i < entry.bookIds.length; i = i + 1) {
    if (entry.bookIds[i] === tabKey) { return true; }
  }
  return false;
}

// Build the ordered tab model [{key,label,count}]: Inbox, Journal, then one tab
// per book that has >=1 placed note (shelf order first, orphan books appended
// so no placed note is ever tab-less).
function buildNotebookTabModel(user, entries) {
  var model = [];
  var inboxCount = 0;
  var journalCount = 0;
  var bookCounts = {};
  var i;
  for (i = 0; i < entries.length; i = i + 1) {
    var e = entries[i];
    if (e.register === 'journal') {
      journalCount = journalCount + 1;
    } else if (e.filed === false) {
      inboxCount = inboxCount + 1;
    } else if (e.filed === true && e.bookIds) {
      var bi;
      for (bi = 0; bi < e.bookIds.length; bi = bi + 1) {
        var bid = e.bookIds[bi];
        bookCounts[bid] = (bookCounts[bid] || 0) + 1;
      }
    }
  }
  model.push({ key: 'inbox', label: 'Inbox', count: inboxCount });
  model.push({ key: 'journal', label: 'Journal', count: journalCount });

  var shelf = (state.userBooks && state.userBooks[user.uid] &&
               state.userBooks[user.uid].bookIds)
    ? state.userBooks[user.uid].bookIds : [];
  var ordered = [];
  var seen = {};
  var s;
  for (s = 0; s < shelf.length; s = s + 1) {
    if (bookCounts[shelf[s]] && !seen[shelf[s]]) {
      ordered.push(shelf[s]); seen[shelf[s]] = true;
    }
  }
  var bk;
  for (bk in bookCounts) {
    if (Object.prototype.hasOwnProperty.call(bookCounts, bk) && !seen[bk]) {
      ordered.push(bk); seen[bk] = true;
    }
  }
  var j;
  for (j = 0; j < ordered.length; j = j + 1) {
    var bookId = ordered[j];
    var title = (state.books && state.books[bookId] && state.books[bookId].title)
      ? state.books[bookId].title : '(unknown book)';
    model.push({ key: bookId, label: title, count: bookCounts[bookId] });
  }
  return model;
}

// The tab row. Each tab re-renders the notebook on click (sets the module-level
// notebookActiveTab). Closure-per-tab via appendNotebookTab (a var-in-for-loop
// would bind every handler to the last tab).
function buildNotebookTabRow(tabs, activeKey) {
  var row = document.createElement('div');
  row.className = 'notebook-tabs';
  var i;
  for (i = 0; i < tabs.length; i = i + 1) {
    appendNotebookTab(row, tabs[i], activeKey);
  }
  return row;
}

function appendNotebookTab(row, tab, activeKey) {
  var el = document.createElement('button');
  el.type = 'button';
  el.className = 'notebook-tab' + (tab.key === activeKey ? ' notebook-tab-on' : '');
  el.appendChild(document.createTextNode(tab.label + ' '));
  var ct = document.createElement('span');
  ct.className = 'notebook-tab-count';
  ct.textContent = String(tab.count);
  el.appendChild(ct);
  el.addEventListener('click', function() {
    notebookActiveTab = tab.key;
    renderNotebook();
  });
  row.appendChild(el);
}

// Left leaf: section header (label + note count) then the tab's entries
// (createdAt-desc), rendered via renderNotebookEntry (no per-entry toggle).
function buildNotebookLeftLeaf(activeKey, tabs, entries) {
  var leaf = document.createElement('div');
  leaf.className = 'notebook-leaf notebook-leaf-left';

  var activeTab = null;
  var t;
  for (t = 0; t < tabs.length; t = t + 1) {
    if (tabs[t].key === activeKey) { activeTab = tabs[t]; break; }
  }

  var sechead = document.createElement('div');
  sechead.className = 'notebook-secthead';
  var secTitle = document.createElement('div');
  secTitle.className = 'notebook-secthead-title';
  secTitle.textContent = activeTab ? activeTab.label : 'Inbox';
  sechead.appendChild(secTitle);
  var secMeta = document.createElement('div');
  secMeta.className = 'notebook-secthead-meta';
  var n = activeTab ? activeTab.count : 0;
  secMeta.textContent = n + (n === 1 ? ' note' : ' notes');
  sechead.appendChild(secMeta);
  leaf.appendChild(sechead);

  // N2: inline capture (writeline) at the top of the left leaf.
  leaf.appendChild(buildNotebookWriteline(activeKey));

  var shown = 0;
  var i;
  for (i = 0; i < entries.length; i = i + 1) {
    if (notebookEntryMatchesTab(entries[i], activeKey)) {
      leaf.appendChild(renderNotebookEntry(entries[i], true));
      shown = shown + 1;
    }
  }
  if (shown === 0) {
    var empty = document.createElement('p');
    empty.className = 'notebook-empty-body';
    if (activeKey === 'inbox') {
      empty.textContent = 'Nothing in your inbox. Quick captures land here, awaiting a home.';
    } else if (activeKey === 'journal') {
      empty.textContent = 'No journal entries yet.';
    } else {
      empty.textContent = 'No notes on this book yet.';
    }
    leaf.appendChild(empty);
  }
  return leaf;
}

// Right leaf: the working page. Empty until notes are gathered; then it shows
// the gathered notes + an editable name + arc selection (F6) + Create. Create
// REUSES createSubTheory + addEvidenceToSubTheory (no new data path).
function buildNotebookRightLeaf(user) {
  var leaf = document.createElement('div');
  leaf.className = 'notebook-leaf notebook-leaf-right';

  var ids = notebookGatheredIds();

  if (!ids.length) {
    var tag0 = document.createElement('div');
    tag0.className = 'notebook-leaftag';
    tag0.textContent = 'Working page';
    leaf.appendChild(tag0);
    var hint = document.createElement('p');
    hint.className = 'notebook-working-hint';
    hint.textContent = 'Gather a selection of notes from the left to form a sub-theory here.';
    leaf.appendChild(hint);
    return leaf;
  }

  var tag = document.createElement('div');
  tag.className = 'notebook-leaftag';
  tag.textContent = 'Working page · forming a sub-theory';
  leaf.appendChild(tag);

  var nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'notebook-working-name';
  nameInput.setAttribute('placeholder', 'Name this sub-theory');
  nameInput.value = notebookGatherName || '';
  leaf.appendChild(nameInput);

  var i;
  for (i = 0; i < ids.length; i = i + 1) {
    var e = state.notebookEntries[ids[i]];
    var w = document.createElement('div');
    w.className = 'notebook-wnote';
    var wt = document.createElement('span');
    wt.className = 'notebook-wnote-tag';
    wt.textContent = notebookRegisterLabel(e.register);
    w.appendChild(wt);
    var wb = (e && typeof e.body === 'string') ? e.body : '';
    if (wb.length > 140) { wb = wb.substring(0, 137) + '…'; }
    w.appendChild(document.createTextNode(wb));
    leaf.appendChild(w);
  }

  // Arc selection (F6): default to the arc shared by all gathered notes' arcIds,
  // else let the user pick an existing arc (reuses buildArcPickerPanel). If the
  // user has no arcs, guide them to make one first.
  var arcId = notebookGatherArc || notebookSharedArc(ids);
  var hasArcs = notebookUserHasArcs(user);
  var arcRow = document.createElement('div');
  arcRow.className = 'notebook-working-arc';
  if (!hasArcs) {
    arcRow.textContent = 'Create an arc first — sub-theories live inside an arc.';
  } else {
    var arcLabel = document.createElement('span');
    arcLabel.className = 'notebook-working-arc-label';
    if (arcId && state.arcs[arcId]) {
      arcLabel.textContent = 'Into arc: ' + (state.arcs[arcId].title || '(untitled arc)');
    } else {
      arcLabel.textContent = 'No arc chosen';
    }
    arcRow.appendChild(arcLabel);
    var changeLink = document.createElement('a');
    changeLink.href = '#';
    changeLink.className = 'notebook-working-arc-change';
    changeLink.textContent = (arcId && state.arcs[arcId]) ? 'Change' : 'Choose an arc';
    changeLink.addEventListener('click', function(ev) {
      ev.preventDefault();
      var host = arcRow.querySelector('.notebook-working-arc-picker-host');
      if (!host) {
        host = document.createElement('div');
        host.className = 'notebook-working-arc-picker-host';
        arcRow.appendChild(host);
      }
      openGatherArcPicker(host);
    });
    arcRow.appendChild(changeLink);
  }
  leaf.appendChild(arcRow);

  // Static line -- NOT a Yumi generative call (N4). Plain UI copy.
  var gline = document.createElement('p');
  gline.className = 'notebook-working-gather-line';
  gline.textContent = ids.length + ' gathered — name it and I’ll carry them into your arc.';
  leaf.appendChild(gline);

  var acts = document.createElement('div');
  acts.className = 'notebook-working-acts';
  var createBtn = document.createElement('button');
  createBtn.type = 'button';
  createBtn.className = 'notebook-working-create';
  createBtn.textContent = 'Create';
  function canCreate() {
    var nm = (notebookGatherName || '').replace(/^\s+|\s+$/g, '');
    return !!(nm && (notebookGatherArc || notebookSharedArc(ids)) && hasArcs);
  }
  createBtn.disabled = !canCreate();
  createBtn.addEventListener('click', function() { notebookCreateSubTheory(); });
  nameInput.addEventListener('input', function() {
    notebookGatherName = nameInput.value;
    createBtn.disabled = !canCreate();
  });
  acts.appendChild(createBtn);

  var clearLink = document.createElement('a');
  clearLink.href = '#';
  clearLink.className = 'notebook-working-clear';
  clearLink.textContent = 'Clear';
  clearLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    notebookGathered = {};
    notebookGatherArc = null;
    notebookGatherName = '';
    renderNotebook();
  });
  acts.appendChild(clearLink);
  leaf.appendChild(acts);

  return leaf;
}

// ===== N3 gather helpers =====

function notebookRegisterLabel(reg) {
  if (reg === 'marginalia') { return 'Marginalia'; }
  if (reg === 'question') { return 'Question'; }
  return 'Journal';
}

function arrHas(arr, val) {
  var i;
  for (i = 0; i < arr.length; i = i + 1) { if (arr[i] === val) { return true; } }
  return false;
}

// The gathered entry ids that still exist (a deleted entry drops out).
function notebookGatheredIds() {
  var out = [];
  var k;
  for (k in notebookGathered) {
    if (Object.prototype.hasOwnProperty.call(notebookGathered, k) &&
        notebookGathered[k] === true &&
        state.notebookEntries && state.notebookEntries[k]) {
      out.push(k);
    }
  }
  return out;
}

function toggleGather(entryId) {
  if (notebookGathered[entryId] === true) { delete notebookGathered[entryId]; }
  else { notebookGathered[entryId] = true; }
  renderNotebook();
}

// F6: the arc common to ALL gathered entries' arcIds (intersection), or null.
function notebookSharedArc(ids) {
  if (!ids.length) { return null; }
  var first = state.notebookEntries[ids[0]];
  var candidate = (first && first.arcIds) ? first.arcIds.slice(0) : [];
  var i, j, next;
  for (i = 1; i < ids.length; i = i + 1) {
    var e = state.notebookEntries[ids[i]];
    var eArcs = (e && e.arcIds) ? e.arcIds : [];
    next = [];
    for (j = 0; j < candidate.length; j = j + 1) {
      if (arrHas(eArcs, candidate[j])) { next.push(candidate[j]); }
    }
    candidate = next;
    if (!candidate.length) { return null; }
  }
  return candidate.length ? candidate[0] : null;
}

function notebookUserHasArcs(user) {
  if (!user || !state.arcs) { return false; }
  var k;
  for (k in state.arcs) {
    if (Object.prototype.hasOwnProperty.call(state.arcs, k) && state.arcs[k] &&
        (state.arcs[k].userId === user.uid || state.arcs[k].userId === '__praxis_seed__')) {
      return true;
    }
  }
  return false;
}

function openGatherArcPicker(mountEl) {
  if (!mountEl) { return; }
  var user = getCurrentUser();
  if (!user) { return; }
  mountEl.innerHTML = '';
  mountEl.appendChild(buildArcPickerPanel({
    user: user,
    label: 'Choose an arc for this sub-theory',
    onPick: function(arcId) {
      notebookGatherArc = arcId;
      renderNotebook();
    },
    onDone: function() {}
  }));
}

// N3: gather -> sub-theory. REUSES createSubTheory + addEvidenceToSubTheory
// (the same path "Send to sub-theory" uses, kind 'entry', quote = body). On
// success, clears the gather and routes to the new sub-theory page.
function notebookCreateSubTheory() {
  var user = getCurrentUser();
  if (!user) { return; }
  var ids = notebookGatheredIds();
  var name = (notebookGatherName || '').replace(/^\s+|\s+$/g, '');
  var arcId = notebookGatherArc || notebookSharedArc(ids);
  if (!ids.length || !name || !arcId || !state.arcs[arcId]) { return; }
  var st = createSubTheory(arcId, { header: name });
  if (!st) { return; }
  var i;
  for (i = 0; i < ids.length; i = i + 1) {
    var e = state.notebookEntries[ids[i]];
    var quote = (e && typeof e.body === 'string') ? e.body : '';
    addEvidenceToSubTheory(st.id, { kind: 'entry', refId: ids[i], quote: quote });
  }
  notebookGathered = {};
  notebookGatherArc = null;
  notebookGatherName = '';
  location.hash = 'subtheory/' + st.id;
}

// N2: master consent switch -- interactive. Reflects profile.yumiReadsAlong
// (default true), toggles it, persists via setProfile + the /userProfiles
// mirror (saveProfileToFirestore), and re-renders. assembleContextData reads
// the same field as its single consent gate (OFF -> Yumi sees no writing).
function buildNotebookMasterSwitch(user) {
  var reads = true;
  if (typeof getProfile === 'function' && user && user.uid) {
    var prof = getProfile(user.uid);
    if (prof && prof.yumiReadsAlong === false) { reads = false; }
  }
  var tog = document.createElement('span');
  tog.className = 'notebook-mtog' + (reads ? ' notebook-mtog-on' : '');
  tog.setAttribute('role', 'button');
  tog.setAttribute('tabindex', '0');
  tog.setAttribute('aria-pressed', reads ? 'true' : 'false');
  var sw = document.createElement('span');
  sw.className = 'notebook-sw';
  tog.appendChild(sw);
  tog.appendChild(document.createTextNode('Yumi reads along'));
  function flip() {
    if (!user || !user.uid) { return; }
    setProfile(user.uid, { yumiReadsAlong: !reads });
    if (typeof saveProfileToFirestore === 'function') {
      saveProfileToFirestore(user.uid, getProfile(user.uid), function() {});
    }
    renderNotebook();
  }
  tog.addEventListener('click', function() { flip(); });
  tog.addEventListener('keydown', function(ev) {
    if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
      ev.preventDefault(); flip();
    }
  });
  return tog;
}

// N2: inline capture (the writeline). A text input + MARG/JRNL/QUES register
// chips (the mic is DEFERRED to N2b; camera is out of scope). The selected
// register is closure-local so a chip click never loses typed text. Enter (no
// shift) commits via captureNote. Mounted at the top of the left leaf.
function buildNotebookWriteline(activeKey) {
  var line = document.createElement('div');
  line.className = 'notebook-writeline';

  // FIX A: auto-growing textarea (was a single-line <input>, which clipped any
  // note past the visible width / height). Grows to fit content; Enter commits,
  // Shift+Enter inserts a newline (the keydown handler below).
  var input = document.createElement('textarea');
  input.className = 'notebook-writeline-input';
  input.setAttribute('rows', '1');
  input.setAttribute('placeholder', 'Write a note…');
  function autogrowWriteline() {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
  }
  input.addEventListener('input', autogrowWriteline);

  // Default register by context: Journal tab -> journal, else marginalia.
  var selected = (activeKey === 'journal') ? 'journal' : 'marginalia';

  var chips = document.createElement('div');
  chips.className = 'notebook-writeline-chips';
  var defs = [
    { r: 'marginalia', l: 'Marg' },
    { r: 'journal', l: 'Jrnl' },
    { r: 'question', l: 'Ques' }
  ];
  var chipEls = {};
  function paint() {
    var r;
    for (r in chipEls) {
      if (Object.prototype.hasOwnProperty.call(chipEls, r)) {
        chipEls[r].className = 'notebook-writeline-chip'
          + (r === selected ? ' notebook-writeline-chip-on' : '');
      }
    }
  }
  var d;
  for (d = 0; d < defs.length; d = d + 1) {
    appendWritelineChip(chips, defs[d], chipEls, function(reg) {
      selected = reg; paint(); input.focus();
    });
  }
  paint();

  function commit() {
    var body = (input.value || '').replace(/^\s+|\s+$/g, '');
    if (!body) { return; }
    captureNote(selected, body, activeKey);
  }
  input.addEventListener('keydown', function(ev) {
    if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); commit(); }
  });

  line.appendChild(input);
  line.appendChild(chips);
  return line;
}

// One writeline chip, closure-scoped per register (a var-in-for-loop would bind
// every chip to the last register).
function appendWritelineChip(chips, def, chipEls, onPick) {
  var c = document.createElement('span');
  c.className = 'notebook-writeline-chip';
  c.setAttribute('role', 'button');
  c.setAttribute('tabindex', '0');
  c.textContent = def.l;
  c.addEventListener('click', function() { onPick(def.r); });
  c.addEventListener('keydown', function(ev) {
    if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
      ev.preventDefault(); onPick(def.r);
    }
  });
  chipEls[def.r] = c;
  chips.appendChild(c);
}

// N2: create an entry from the writeline. register = chip; isPrivate = by-kind
// default (journal private; marginalia + question visible). Placement:
//   journal           -> filed true, no book (Journal tab)
//   marg/ques on book  -> filed true, bookIds = [activeKey] (that book's bank)
//   marg/ques elsewhere-> filed false, no book (Inbox, awaiting triage)
// Then "follow the note" to the tab it routed into, and re-render.
function captureNote(register, body, activeKey) {
  var user = getCurrentUser();
  if (!user) { return; }
  var now = Date.now();
  var id = genEntryId();
  var bookIds = [];
  var filed;
  if (register === 'journal') {
    filed = true;
  } else if (activeKey !== 'inbox' && activeKey !== 'journal') {
    filed = true; bookIds = [activeKey];
  } else {
    filed = false;
  }
  state.notebookEntries[id] = {
    id:        id,
    userId:    user.uid,
    register:  register,
    isPrivate: getRegisterDefault(register),
    body:      body,
    bookIds:   bookIds,
    arcIds:    [],
    filed:     filed,
    createdAt: now,
    updatedAt: now
  };
  markNotebookDirty();
  saveState();
  if (register === 'journal') { notebookActiveTab = 'journal'; }
  else if (filed) { notebookActiveTab = bookIds[0]; }
  else { notebookActiveTab = 'inbox'; }
  renderNotebook();
}

// N2: file an Inbox entry to a book -- set filed true + add the bookId (deduped).
function fileEntryToBook(entryId, bookId) {
  var entry = state.notebookEntries && state.notebookEntries[entryId];
  if (!entry || !bookId) { return false; }
  entry.filed = true;
  if (!entry.bookIds) { entry.bookIds = []; }
  var present = false;
  var i;
  for (i = 0; i < entry.bookIds.length; i = i + 1) {
    if (entry.bookIds[i] === bookId) { present = true; break; }
  }
  if (!present) { entry.bookIds.push(bookId); }
  entry.updatedAt = Date.now();
  markNotebookDirty();
  saveState();
  return true;
}

// N2: a book picker (mirrors buildArcPickerPanel). Lists the user's shelf
// books; onPick(bookId). Self-closing (Esc / Done).
function buildBookPickerPanel(opts) {
  var panel = document.createElement('div');
  panel.className = 'arc-picker-panel book-picker-panel';
  var labelEl = document.createElement('div');
  labelEl.className = 'arc-picker-label';
  labelEl.textContent = opts.label || 'File to a book';
  panel.appendChild(labelEl);
  function closePanel() {
    document.removeEventListener('keydown', onKeydown);
    if (panel.parentNode) { panel.parentNode.removeChild(panel); }
  }
  function onKeydown(ev) { if (ev.keyCode === 27) { closePanel(); } }
  document.addEventListener('keydown', onKeydown);
  var uid = (opts.user && opts.user.uid) ? opts.user.uid : null;
  var bookIds = (uid && state.userBooks && state.userBooks[uid] &&
                 state.userBooks[uid].bookIds) ? state.userBooks[uid].bookIds : [];
  if (!bookIds.length) {
    var empty = document.createElement('p');
    empty.className = 'arc-picker-empty';
    empty.textContent = 'No books on your shelf yet — add a book first.';
    panel.appendChild(empty);
  } else {
    var i;
    for (i = 0; i < bookIds.length; i = i + 1) {
      appendBookPickerRow(panel, bookIds[i], opts.onPick);
    }
  }
  var done = document.createElement('a');
  done.href = '#';
  done.className = 'arc-picker-done';
  done.textContent = 'Done';
  done.addEventListener('click', function(ev) { ev.preventDefault(); closePanel(); });
  panel.appendChild(done);
  return panel;
}

function appendBookPickerRow(panel, bookId, onPick) {
  var book = (state.books && state.books[bookId]) || null;
  var row = document.createElement('a');
  row.href = '#';
  row.className = 'arc-picker-row';
  row.textContent = (book && book.title) ? book.title : '(untitled book)';
  row.addEventListener('click', function(ev) {
    ev.preventDefault();
    onPick(bookId);
  });
  panel.appendChild(row);
}

function openFileToBookPicker(entryId, mountEl) {
  if (!mountEl) { return; }
  var user = getCurrentUser();
  if (!user) { return; }
  mountEl.innerHTML = '';
  mountEl.appendChild(buildBookPickerPanel({
    user: user,
    label: 'File this note to a book',
    onPick: function(bookId) {
      if (fileEntryToBook(entryId, bookId)) {
        notebookActiveTab = bookId;
        renderNotebook();
      }
    }
  }));
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
        filed:      true,
        createdAt:  now,
        updatedAt:  now
      };
      state.notebookEntries[id] = entry;
      markNotebookDirty();
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
// Canon §4-G: per-arc computed counts (display-only; no data-model change).
// books = arc.bookIds; sub-theories = sub-theories whose arcId matches;
// marginalia = attached entries (arc.entryIds) whose register is marginalia.
function _arcCardCounts(arcId, arcRec) {
  var c = { books: 0, subTheories: 0, marginalia: 0 };
  if (arcRec && arcRec.bookIds && arcRec.bookIds.length) {
    c.books = arcRec.bookIds.length;
  }
  var k;
  if (state.subTheories) {
    for (k in state.subTheories) {
      if (Object.prototype.hasOwnProperty.call(state.subTheories, k) &&
          state.subTheories[k] && state.subTheories[k].arcId === arcId) {
        c.subTheories = c.subTheories + 1;
      }
    }
  }
  if (arcRec && arcRec.entryIds && arcRec.entryIds.length &&
      state.notebookEntries) {
    var i;
    for (i = 0; i < arcRec.entryIds.length; i = i + 1) {
      var eid = arcRec.entryIds[i] && arcRec.entryIds[i].id;
      var entry = eid ? state.notebookEntries[eid] : null;
      if (entry && entry.register === 'marginalia') {
        c.marginalia = c.marginalia + 1;
      }
    }
  }
  return c;
}

// Canon §4-G: the mono meta line. Always books + sub-theories; marginalia
// only when present (the mockup omits a zero marginalia count).
function _arcCardMetaText(counts) {
  var parts = [];
  parts.push(counts.books + (counts.books === 1 ? ' book' : ' books'));
  parts.push(counts.subTheories +
    (counts.subTheories === 1 ? ' sub-theory' : ' sub-theories'));
  if (counts.marginalia > 0) {
    parts.push(counts.marginalia + ' marginalia');
  }
  return parts.join(' · ');
}

// Canon §4-G: the constellation thumb -- a luminous banner with a small
// spark glyph (CSS supplies the radial glow + token fill). Inline SVG so it
// scales; aria-hidden (decorative).
function _arcCardThumb() {
  var thumb = document.createElement('div');
  thumb.className = 'arc-card-thumb';
  thumb.setAttribute('aria-hidden', 'true');
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'arc-card-thumb-spark');
  var path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M12 0L14 10 24 12 14 14 12 24 10 14 0 12 10 10Z');
  svg.appendChild(path);
  thumb.appendChild(svg);
  return thumb;
}

function renderArcsPage() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'arcs-page';

  var header = document.createElement('header');
  header.className = 'arcs-page-header';

  // Stage 3 (mockup-fidelity): header is the mockup .pagehd -- "Your arcs" h1
  // + teaching on the left, a "+ Create an arc" button top-right (mockup lines
  // 168-171). The page h1 now carries "Your arcs", so the former lower h2 of
  // the same text is dropped below, and the 1/2/3 explainer is removed.
  var headline = document.createElement('div');
  headline.className = 'arcs-headline';

  var title = document.createElement('h1');
  title.className = 'arcs-page-title';
  title.textContent = 'Your arcs';
  headline.appendChild(title);

  // C2 teaching paragraph (mockup .sub role). Em dashes are U+2014, not "--".
  var teaching = document.createElement('p');
  teaching.className = 'arcs-teaching';
  teaching.textContent =
    'An arc is a path you build through your reading — ' +
    'books from any tradition, set side by side, so they speak ' +
    'to each other.';
  headline.appendChild(teaching);

  header.appendChild(headline);

  var createBtn = document.createElement('button');
  createBtn.type = 'button';
  createBtn.className = 'arcs-create-btn';
  createBtn.textContent = '+ Create an arc';
  createBtn.addEventListener('click', function() {
    openArcEditor();
  });
  header.appendChild(createBtn);

  wrap.appendChild(header);

  // Editor mount point. openArcEditor mounts into #notebook-arc-editor-host;
  // it stays in the DOM (now below the header, above the grids) so the lookup
  // still resolves after the old two-column create section was removed.
  var arcEditorHost = document.createElement('div');
  arcEditorHost.id = 'notebook-arc-editor-host';
  wrap.appendChild(arcEditorHost);

  // Your arcs: the signed-in user's own arcs (userId === uid), newest
  // first. Excludes the __praxis_seed__ example (it renders in the
  // examples section below). Rendered only when the user has at least one
  // arc; with none, the teaching + examples below stand alone (the cold-
  // start view). Fixes the bug where a user's arcs were counted by the
  // account stat but had no surface on this page.
  var arcsUser = getCurrentUser();
  if (arcsUser) {
    var ownArcs = [];
    var ownArcId;
    for (ownArcId in state.arcs) {
      if (Object.prototype.hasOwnProperty.call(state.arcs, ownArcId)) {
        var ownArcRec = state.arcs[ownArcId];
        if (ownArcRec && ownArcRec.userId === arcsUser.uid) {
          ownArcs.push({ id: ownArcId, rec: ownArcRec });
        }
      }
    }
    ownArcs.sort(function(a, b) {
      return (b.rec.createdAt || 0) - (a.rec.createdAt || 0);
    });
    // Stage 3 (mockup-fidelity): render the "Your arcs" grid for any signed-in
    // user (even with zero arcs) so the dashed "Start another arc" tile always
    // has a home. The page <h1> already says "Your arcs"; the former section
    // h2 of the same text is dropped.
    var yoursSec = document.createElement('section');
    yoursSec.className = 'arcs-yours';

    var yi;
    for (yi = 0; yi < ownArcs.length; yi++) {
      var yCard = document.createElement('a');
      yCard.className = 'arc-card arc-card-live';
      yCard.href = '#arc/' + ownArcs[yi].id;

      yCard.appendChild(_arcCardThumb());

      var yText = document.createElement('div');
      yText.className = 'arc-card-text';

      var yTitle = document.createElement('h3');
      yTitle.className = 'arc-card-title';
      yTitle.textContent = ownArcs[yi].rec.title || 'Untitled arc';
      yText.appendChild(yTitle);

      if (ownArcs[yi].rec.description) {
        var yDesc = document.createElement('p');
        yDesc.className = 'arc-card-description';
        yDesc.textContent = ownArcs[yi].rec.description;
        yText.appendChild(yDesc);
      }

      yCard.appendChild(yText);

      var yMeta = document.createElement('p');
      yMeta.className = 'arc-card-meta';
      yMeta.textContent = _arcCardMetaText(
        _arcCardCounts(ownArcs[yi].id, ownArcs[yi].rec));
      yCard.appendChild(yMeta);

      yoursSec.appendChild(yCard);
    }

    // Dashed "Start another arc" create tile as a grid cell (mockup line 175).
    var startTile = document.createElement('button');
    startTile.type = 'button';
    startTile.className = 'arc-card arc-card-start';
    startTile.addEventListener('click', function() {
      openArcEditor();
    });
    var startIcon = document.createElement('span');
    startIcon.className = 'arc-card-start-icon';
    startIcon.setAttribute('aria-hidden', 'true');
    startIcon.innerHTML =
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.5">' +
      '<circle cx="12" cy="12" r="10"></circle>' +
      '<path d="M12 8v8M8 12h8"></path></svg>';
    startTile.appendChild(startIcon);
    var startLabel = document.createElement('span');
    startLabel.className = 'arc-card-start-label';
    startLabel.textContent = 'Start another arc';
    startTile.appendChild(startLabel);
    yoursSec.appendChild(startTile);

    wrap.appendChild(yoursSec);
  }

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

    desireCard.appendChild(_arcCardThumb());

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

    // Canon §4-G: computed-count meta line replaces the 5 cover thumbnails.
    var desireMeta = document.createElement('p');
    desireMeta.className = 'arc-card-meta';
    desireMeta.textContent = _arcCardMetaText(
      _arcCardCounts(seedInfo.arcId, seedArc));
    desireCard.appendChild(desireMeta);

    examplesSec.appendChild(desireCard);
  }

  var flowCard = document.createElement('div');
  flowCard.className = 'arc-card arc-card-illustrated';

  flowCard.appendChild(_arcCardThumb());

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

  // Stage 2 (mockup-fidelity): per design/praxis-desktop-mockup.html:147 the
  // header is a left block of "Your shelf" h1 + an "N books" count .sub, with
  // the actions cluster to its right (.pagehd flex). The former "Your library"
  // eyebrow shared the header grid's top row with the actions and overlapped
  // the tall Covers|List seg; dropping it fixes the overlap by removal.
  var headline = document.createElement('div');
  headline.className = 'shelf-headline';

  var title = document.createElement('h1');
  title.className = 'shelf-title';
  title.textContent = 'Your shelf';
  headline.appendChild(title);

  var shelfBookCount = 0;
  var sbcId;
  var sbcMap = state.books || {};
  for (sbcId in sbcMap) {
    if (Object.prototype.hasOwnProperty.call(sbcMap, sbcId) && sbcMap[sbcId]) {
      shelfBookCount++;
    }
  }
  var countEl = document.createElement('div');
  countEl.className = 'shelf-count';
  countEl.textContent = shelfBookCount
    + (shelfBookCount === 1 ? ' book' : ' books');
  headline.appendChild(countEl);

  header.appendChild(headline);

  // Auth-aware add affordance. Mirrors renderBookDetail at
  // views.js:358-377: signed-in user gets a button that opens the
  // inline editor; signed-out user gets a sign-in prompt routed
  // through signInWithGoogle (the same path used by the Notebook
  // and book-detail surfaces).
  // Stage 3 (chrome-fidelity): right-side controls grouped in a flex
  // .shelf-actions, with the Covers|List segmented toggle as its first child
  // (mockup header layout). VIEW-NEUTRAL for Covers -- eyebrow/title are
  // untouched and Add/Bulk/Resolve keep their classes, order, and handlers;
  // only their container changed (header child -> actions child).
  var actions = document.createElement('div');
  actions.className = 'shelf-actions';

  var shelfViewMode = getShelfView();
  var seg = document.createElement('div');
  seg.className = 'shelf-seg';
  var segCovers = document.createElement('button');
  segCovers.type = 'button';
  segCovers.className = 'shelf-seg-option'
    + (shelfViewMode === 'covers' ? ' is-active' : '');
  segCovers.textContent = 'Covers';
  segCovers.addEventListener('click', function() {
    setShelfView('covers');
    renderShelf();
  });
  seg.appendChild(segCovers);
  var segList = document.createElement('button');
  segList.type = 'button';
  segList.className = 'shelf-seg-option'
    + (shelfViewMode === 'list' ? ' is-active' : '');
  segList.textContent = 'List';
  segList.addEventListener('click', function() {
    setShelfView('list');
    renderShelf();
  });
  seg.appendChild(segList);
  actions.appendChild(seg);

  // Stage 2 (mockup-fidelity): the live grid-filter search moves inline into
  // the header actions, between the seg and the add button (mockup .search at
  // design/praxis-desktop-mockup.html:148). Still a LIVE GRID FILTER (title OR
  // author substring via onShelfSearchInput) -- functional, not a dead pill.
  var searchWell = document.createElement('div');
  searchWell.className = 'shelf-search-well';
  var searchGlyph = document.createElement('span');
  searchGlyph.className = 'shelf-search-glyph';
  searchGlyph.textContent = '⌕';
  searchWell.appendChild(searchGlyph);
  var searchInput = document.createElement('input');
  searchInput.id = 'shelf-search-input';
  searchInput.className = 'shelf-search-input';
  searchInput.type = 'text';
  searchInput.setAttribute('placeholder', 'Search books, authors, ideas…');
  searchInput.value = shelfSearchRaw;
  searchInput.addEventListener('input', onShelfSearchInput);
  searchWell.appendChild(searchInput);
  actions.appendChild(searchWell);

  // Canon §4-E: secondary actions (Scan / Bulk / Resolve) move into a quiet
  // chip row appended below the header; only the primary "+ Add book" stays
  // in the header actions cluster. Built always (empty + unappended when
  // signed out).
  var shelfChips = document.createElement('div');
  shelfChips.className = 'shelf-chips';

  var user = getCurrentUser();
  if (user) {
    // 3.10d: resolve missing covers (title-imported books). The 109-
    // book bulk-import wrote coverUrl: null for every title-form line
    // and never fired a cover fetch (fetchAndApplyCover is ISBN-only).
    // Label + disabled state read from coverResolveState, which lives
    // outside the DOM so progress survives the per-settle renderShelf.
    // Stage 4a: cluster order conformed to spec B.5 -- seg | Resolve
    // covers | + Bulk add | + Add book (primary sits last).
    var resolveBtn = document.createElement('button');
    resolveBtn.type = 'button';
    resolveBtn.className = 'shelf-resolve-covers-btn';
    if (coverResolveState.running) {
      resolveBtn.textContent = 'Resolving ' +
        coverResolveState.completed + ' of ' + coverResolveState.total;
      resolveBtn.disabled = true;
    } else {
      resolveBtn.textContent = 'Resolve covers';
    }
    resolveBtn.addEventListener('click', function() {
      startCoverBackfill();
    });
    shelfChips.appendChild(resolveBtn);

    // 6.1b: shelf-photo scan. A secondary button forwards its click to
    // an offscreen-clipped file input (capture="environment" opens the
    // mobile camera). On a chosen file: downscale on a canvas, POST bare
    // base64 to vision-proxy, console-log the returned titles. No UI
    // consumes the titles yet -- the bulk-add hand-off is 6.1c.
    var scanBtn = document.createElement('button');
    scanBtn.type = 'button';
    scanBtn.className = 'shelf-scan-btn';
    scanBtn.textContent = 'Scan shelf';
    scanBtn.title = 'Photograph one shelf at a time, filling the frame';
    var scanInput = document.createElement('input');
    scanInput.type = 'file';
    scanInput.accept = 'image/*';
    scanInput.setAttribute('capture', 'environment');
    scanInput.className = 'shelf-scan-input';
    scanBtn.addEventListener('click', function() {
      scanInput.click();
    });
    scanInput.addEventListener('change', function() {
      handleShelfScanFile(scanInput, scanBtn);
    });
    shelfChips.appendChild(scanBtn);
    shelfChips.appendChild(scanInput);

    var bulkBtn = document.createElement('button');
    bulkBtn.type = 'button';
    bulkBtn.className = 'shelf-new-book-bulk';
    bulkBtn.textContent = '+ Bulk add';
    bulkBtn.addEventListener('click', function() {
      openBulkAddEditor();
    });
    shelfChips.appendChild(bulkBtn);

    var newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'shelf-new-book';
    newBtn.textContent = '+ Add a book';
    newBtn.addEventListener('click', function() {
      openShelfEditor();
    });
    actions.appendChild(newBtn);
  } else {
    var signinBtn = document.createElement('button');
    signinBtn.type = 'button';
    signinBtn.className = 'shelf-signin-prompt';
    signinBtn.textContent = 'Sign in to add books';
    signinBtn.addEventListener('click', function() {
      signInWithGoogle();
    });
    actions.appendChild(signinBtn);
  }

  header.appendChild(actions);

  // 6.1c: visible scan status line (empty/error messaging). Lives under
  // the header actions; collapsed when empty (:empty in CSS). Filled and
  // auto-cleared by showScanStatus/clearScanStatus.
  var scanStatus = document.createElement('div');
  scanStatus.className = 'shelf-scan-status';
  scanStatus.id = 'shelf-scan-status';
  header.appendChild(scanStatus);

  wrap.appendChild(header);

  // Canon §4-E: the chip row sits below the header, above the search.
  if (shelfChips.childNodes.length > 0) {
    wrap.appendChild(shelfChips);
  }

  // Stage 2 (mockup-fidelity): the in-page shelf search (a LIVE GRID FILTER,
  // title OR author substring) now lives inline in the header actions cluster
  // above -- it is no longer a separate well below the header.

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
  // Phase 3.1: per-value book-match tally for the author filter counts.
  // DISPLAY ONLY -- a count over state.books, not a filter. Rows with
  // zero matches still show (count 0); no row is hidden.
  var authorCounts = {};
  var tcid;
  var tcb;
  for (tcid in booksMap) {
    if (Object.prototype.hasOwnProperty.call(booksMap, tcid)) {
      tcb = booksMap[tcid];
      if (!tcb) continue;
      if (typeof tcb.author === 'string' && tcb.author.length > 0) {
        authorCounts[tcb.author] = (authorCounts[tcb.author] || 0) + 1;
      }
    }
  }

  // Stage 4d: rank authors by book count (desc), case-insensitive
  // alpha tiebreak, and collapse the rail to the top 12 unless the
  // user expanded it (shelfAuthorRailExpanded). The toggle row at the
  // bottom of the list flips the flag and re-renders.
  authors.sort(function (a, b) {
    var ca = authorCounts[a] || 0;
    var cb = authorCounts[b] || 0;
    if (cb !== ca) { return cb - ca; }
    var la = a.toLowerCase();
    var lb = b.toLowerCase();
    if (la < lb) { return -1; }
    if (la > lb) { return 1; }
    return 0;
  });
  var totalAuthorCount = authors.length;
  var visibleAuthors = shelfAuthorRailExpanded
    ? authors
    : authors.slice(0, 12);

  // Stage 4c: per-genre tally for the theme rail counts, mirroring
  // authorCounts. book.genre holds one of the 5 canonical theme
  // strings verbatim (4b backfill, 112/112 coverage).
  var genreCounts = {};
  var gcid;
  var gcb;
  for (gcid in booksMap) {
    if (Object.prototype.hasOwnProperty.call(booksMap, gcid)) {
      gcb = booksMap[gcid];
      if (!gcb) continue;
      if (typeof gcb.genre === 'string' && gcb.genre.length > 0) {
        genreCounts[gcb.genre] = (genreCounts[gcb.genre] || 0) + 1;
      }
    }
  }

  var layout = document.createElement('div');
  // Stage 2: shelfRailOpen drives the desktop inline rail reveal (>=760).
  layout.className = shelfRailOpen
    ? 'shelf-layout shelf-rail-open'
    : 'shelf-layout';

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

  // Stage 7 (manual themes): the user-created THEME overlay rail, ABOVE the
  // Genre rail. Filter rows read shelfFilter.theme (a theme id); membership is
  // state.userThemes[id].bookIds (off the book record). Counts are the theme's
  // member count. Empty -> a quiet hint row (themes are created from a book).
  var utUser = getCurrentUser();
  var userThemeList = [];
  var uttk;
  if (utUser && utUser.uid && state.userThemes) {
    for (uttk in state.userThemes) {
      if (Object.prototype.hasOwnProperty.call(state.userThemes, uttk) &&
          state.userThemes[uttk] && state.userThemes[uttk].userId === utUser.uid) {
        userThemeList.push(state.userThemes[uttk]);
      }
    }
  }
  userThemeList.sort(function(a, b) {
    return (a.name || '').localeCompare(b.name || '');
  });
  var utSection = document.createElement('div');
  utSection.className = 'shelf-filter-section';
  var utLabel = document.createElement('h3');
  utLabel.className = 'shelf-filter-label';
  utLabel.textContent = 'Theme';
  utSection.appendChild(utLabel);
  var utListEl = document.createElement('ul');
  utListEl.className = 'shelf-filter-list shelf-filter-list-usertheme';
  if (userThemeList.length === 0) {
    var utEmpty = document.createElement('li');
    utEmpty.className = 'shelf-filter-row shelf-filter-row-toggle';
    utEmpty.textContent = 'No themes yet — add one from a book';
    utListEl.appendChild(utEmpty);
  } else {
    var uti;
    var utRow;
    var utRowCount;
    for (uti = 0; uti < userThemeList.length; uti++) {
      utRow = document.createElement('li');
      utRow.className = shelfFilter.theme === userThemeList[uti].id
        ? 'shelf-filter-row shelf-filter-row-selected'
        : 'shelf-filter-row';
      utRow.setAttribute('role', 'button');
      utRow.setAttribute('tabindex', '0');
      utRow.setAttribute('data-filter-section', 'theme');
      utRow.setAttribute('data-filter-value', userThemeList[uti].id);
      utRow.textContent = userThemeList[uti].name;
      utRowCount = document.createElement('span');
      utRowCount.className = 'shelf-filter-count';
      utRowCount.textContent = '' + (Array.isArray(userThemeList[uti].bookIds)
        ? userThemeList[uti].bookIds.length : 0);
      utRow.appendChild(utRowCount);
      utRow.addEventListener('click', onShelfFilterRowClick);
      utRow.addEventListener('keydown', onShelfFilterRowKeydown);
      utListEl.appendChild(utRow);
    }
  }
  utSection.appendChild(utListEl);
  sidebar.appendChild(utSection);

  // Stage 4c (relabeled at Stage 7): the GENRE rail -- the 5 canonical genre
  // values, filtering books by their book.genre field. The former 'theme'
  // slot was freed for the user-theme overlay above; this rail now reads
  // shelfFilter.genre. Rows reuse the author-row mechanism (data-filter-
  // section/-value + shared handlers). Counts come from genreCounts above.
  var genreRail = [
    'Critical theory & pedagogy',
    'Power & systems',
    'Liberation',
    'Love & connection',
    'History & memory'
  ];
  var genreSection = document.createElement('div');
  genreSection.className = 'shelf-filter-section';
  var genreLabel = document.createElement('h3');
  genreLabel.className = 'shelf-filter-label';
  genreLabel.textContent = 'Genre';
  genreSection.appendChild(genreLabel);
  var genreListEl = document.createElement('ul');
  genreListEl.className = 'shelf-filter-list shelf-filter-list-genre';
  var gi;
  var genreRow;
  var genreRowCount;
  for (gi = 0; gi < genreRail.length; gi++) {
    genreRow = document.createElement('li');
    genreRow.className = shelfFilter.genre === genreRail[gi]
      ? 'shelf-filter-row shelf-filter-row-selected'
      : 'shelf-filter-row';
    genreRow.setAttribute('role', 'button');
    genreRow.setAttribute('tabindex', '0');
    genreRow.setAttribute('data-filter-section', 'genre');
    genreRow.setAttribute('data-filter-value', genreRail[gi]);
    genreRow.textContent = genreRail[gi];
    genreRowCount = document.createElement('span');
    genreRowCount.className = 'shelf-filter-count';
    genreRowCount.textContent = '' + (genreCounts[genreRail[gi]] || 0);
    genreRow.appendChild(genreRowCount);
    genreRow.addEventListener('click', onShelfFilterRowClick);
    genreRow.addEventListener('keydown', onShelfFilterRowKeydown);
    genreListEl.appendChild(genreRow);
  }
  genreSection.appendChild(genreListEl);
  sidebar.appendChild(genreSection);

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
  for (ai = 0; ai < visibleAuthors.length; ai++) {
    authorRow = document.createElement('li');
    // 3.10b Stage 3: role, tabindex, data-* for section + value,
    // selected class on render, click + keydown handlers. The handler
    // reads the 'author' section + value directly off the activated
    // element's data-filter-section attribute.
    authorRow.className = shelfFilter.author === visibleAuthors[ai]
      ? 'shelf-filter-row shelf-filter-row-selected'
      : 'shelf-filter-row';
    authorRow.setAttribute('role', 'button');
    authorRow.setAttribute('tabindex', '0');
    authorRow.setAttribute('data-filter-section', 'author');
    authorRow.setAttribute('data-filter-value', visibleAuthors[ai]);
    authorRow.textContent = visibleAuthors[ai];
    // Phase 3.1: per-value book-match count (display only). data-filter-
    // value carries the clean author name; the count span is cosmetic.
    var authorRowCount = document.createElement('span');
    authorRowCount.className = 'shelf-filter-count';
    authorRowCount.textContent = '' + (authorCounts[visibleAuthors[ai]] || 0);
    authorRow.appendChild(authorRowCount);
    authorRow.addEventListener('click', onShelfFilterRowClick);
    authorRow.addEventListener('keydown', onShelfFilterRowKeydown);
    authorListEl.appendChild(authorRow);
  }
  // Stage 4d: expand/collapse toggle row, rendered only when the full
  // list exceeds the collapsed cap. Quiet row -- no count, no gold
  // bar, no data-filter attributes (it is not a filter).
  if (totalAuthorCount > 12) {
    var authorToggleRow = document.createElement('li');
    authorToggleRow.className = 'shelf-filter-row shelf-filter-row-toggle';
    authorToggleRow.setAttribute('role', 'button');
    authorToggleRow.setAttribute('tabindex', '0');
    authorToggleRow.textContent = shelfAuthorRailExpanded
      ? 'Show fewer'
      : 'Show all (' + totalAuthorCount + ')';
    authorToggleRow.addEventListener('click', onShelfAuthorToggleClick);
    authorToggleRow.addEventListener('keydown', onShelfAuthorToggleKeydown);
    authorListEl.appendChild(authorToggleRow);
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

  // Filter affordance. Stage 2 (mockup-fidelity): the rail is folded behind
  // this button at all widths. Stage 2 fix: the button is appended ABOVE
  // .shelf-layout (to wrap, outside the columns) so it holds a stable position
  // when the rail toggles, instead of riding the right column.
  // Reuses .shelf-new-book-bulk visual treatment per Stage 0 decision
  // (no new button class authored).
  var filterBtn = document.createElement('button');
  filterBtn.type = 'button';
  filterBtn.className = 'shelf-filter-button shelf-new-book-bulk';
  filterBtn.textContent = 'Filter';
  // 3.10b-i: routes through openShelfFilterPanel / dismissShelfFilter-
  // Panel so the backdrop and Escape handler move in lockstep with
  // .shelf-sidebar-mobile-open. The 3.10a-era class-flip-only handler
  // would leave the backdrop in whatever state was last seen.
  // Stage 2 (mockup-fidelity): the rail is folded behind this button at all
  // widths. Desktop (>=760) toggles an inline collapse -- shelfRailOpen drives
  // the .shelf-rail-open class on .shelf-layout (2-col rail+grid when open),
  // persisted across re-renders so a filter-row click does not snap it shut.
  // Mobile keeps the existing fixed overlay panel (openShelfFilterPanel).
  filterBtn.addEventListener('click', function() {
    if (window.matchMedia('(min-width: 760px)').matches) {
      shelfRailOpen = !shelfRailOpen;
      renderShelf();
    } else if (sidebar.classList.contains('shelf-sidebar-mobile-open')) {
      dismissShelfFilterPanel();
    } else {
      openShelfFilterPanel();
    }
  });
  wrap.appendChild(filterBtn);

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
  var authorOk;
  var genreOk;
  var themeOk;
  var searchOk;
  // Stage 7 (manual themes): precompute the selected user-theme's membership
  // set (book ids) once, so the per-book themeOk test is an O(1) lookup. Null
  // when no theme filter is active or the selected theme no longer exists.
  var selectedThemeBookIds = null;
  if (shelfFilter.theme !== null && state.userThemes &&
      state.userThemes[shelfFilter.theme]) {
    selectedThemeBookIds = {};
    var stbArr = state.userThemes[shelfFilter.theme].bookIds || [];
    var stbI;
    for (stbI = 0; stbI < stbArr.length; stbI++) {
      selectedThemeBookIds[stbArr[stbI]] = true;
    }
  }
  for (fi = 0; fi < books.length; fi++) {
    fb = books[fi];
    authorOk = shelfFilter.author === null ||
      (typeof fb.author === 'string' && fb.author.length > 0 &&
       fb.author === shelfFilter.author);
    // Genre rail: strict equality against book.genre (the former 'theme' slot).
    genreOk = shelfFilter.genre === null ||
      (typeof fb.genre === 'string' && fb.genre.length > 0 &&
       fb.genre === shelfFilter.genre);
    // Theme rail: the user-created overlay -- book is a member of the selected
    // theme (membership lives in state.userThemes, never on the book record).
    themeOk = shelfFilter.theme === null ||
      (selectedThemeBookIds !== null && selectedThemeBookIds[fb.id] === true);
    // Stage 4d: live search -- case-insensitive substring over title
    // OR author, AND-composed with the rail filters.
    searchOk = shelfSearchQuery === '' ||
      ((fb.title || '').toLowerCase().indexOf(shelfSearchQuery) !== -1 ||
       (fb.author || '').toLowerCase().indexOf(shelfSearchQuery) !== -1);
    if (authorOk && genreOk && themeOk && searchOk) {
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
    var filterActive = shelfFilter.author !== null ||
      shelfFilter.genre !== null ||
      shelfFilter.theme !== null ||
      shelfSearchQuery !== '';
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
      emptyAddBtn.textContent = '+ Add a book';
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
    // Stage 3: branch on the persisted shelf view. Both consume the SAME
    // post-sort/post-filter `books` array, so sort/filter/search work
    // identically in either view. 'covers' = the existing grid via
    // renderShelfBook (untouched); 'list' = compact rows via the new
    // renderShelfBookRow.
    if (getShelfView() === 'list') {
      var rows = document.createElement('div');
      rows.className = 'shelf-rows';
      var ri;
      for (ri = 0; ri < books.length; ri++) {
        rows.appendChild(renderShelfBookRow(books[ri]));
      }
      main.appendChild(rows);
    } else {
      var list = document.createElement('div');
      list.className = 'shelf-list';
      var i;
      for (i = 0; i < books.length; i++) {
        list.appendChild(renderShelfBook(books[i]));
      }
      main.appendChild(list);
    }
  }

  layout.appendChild(main);
  wrap.appendChild(layout);

  host.appendChild(wrap);

  // Stage 4d: the render above rebuilt the search input; when the
  // render was triggered by typing, restore focus + caret-to-end so
  // the user keeps typing uninterrupted.
  if (shelfSearchRefocus) {
    shelfSearchRefocus = false;
    var refocusInput = document.getElementById('shelf-search-input');
    if (refocusInput) {
      refocusInput.focus();
      var caretEnd = refocusInput.value.length;
      if (typeof refocusInput.setSelectionRange === 'function') {
        refocusInput.setSelectionRange(caretEnd, caretEnd);
      }
    }
  }
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
    // Phase 3.1: graceful "COVER PENDING" label as a real <span> (not a
    // CSS ::after) so the text is in the DOM for assistive tech. The
    // async cover fetch may still resolve, so the framing reads as
    // pending, not permanently absent.
    var pendingTitle = document.createElement('span');
    pendingTitle.className = 'shelf-book-cover-pending-title';
    pendingTitle.textContent = book.title || '';
    coverPlaceholder.appendChild(pendingTitle);
    var pendingLabel = document.createElement('span');
    pendingLabel.className = 'shelf-book-cover-pending';
    pendingLabel.textContent = 'cover pending';
    coverPlaceholder.appendChild(pendingLabel);
    coverArea.appendChild(coverPlaceholder);
  }

  // Tradition resolution for the spine tick below: traditionOverride
  // wins if set (user choice from the edit-book modal, 5.6 sub-step
  // 5), else the genre-derived tradition. Stage 4d removed the 5.6
  // sub-step 4 corner glyph from shelf covers (mockup parity, D4);
  // renderRegisterGlyph stays intact for other surfaces -- re-adding
  // one call site here reverses this.
  var glyphTradition = book.traditionOverride || book.tradition;

  card.appendChild(coverArea);

  // Phase 3.1: register tick -- left-edge accent bar colored by the
  // book's tradition. Data-driven token only: set --tick to
  // var(--register-<tradition>); CSS paints background: var(--tick).
  // 'unassigned' (and any tradition without a register token) gets NO
  // tick, mirroring renderRegisterGlyph's empty-corner signal. Uses the
  // same glyphTradition resolved above (traditionOverride || tradition).
  if (glyphTradition && glyphTradition !== 'unassigned' &&
      typeof REGISTER_SHAPE_PATHS[glyphTradition] === 'string' &&
      REGISTER_SHAPE_PATHS[glyphTradition] !== '') {
    var tick = document.createElement('span');
    tick.className = 'shelf-book-tick';
    tick.setAttribute('aria-hidden', 'true');
    tick.style.setProperty('--tick', 'var(--register-' + glyphTradition + ')');
    coverArea.appendChild(tick);
  }

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

  card.appendChild(meta);
  return card;
}

// Stage 3 (chrome-fidelity): compact List-view row. Whole-row anchor to
// #book/<id> (browser hashchange handles nav). Title + muted author byline,
// right-aligned status pill (OMITTED when status is falsy -- no invented
// default, unlike the covers card). NO cover thumbnail. The register tick is
// CARRIED from renderShelfBook using the SAME data-driven mechanism + the
// existing .shelf-book-tick class (no new tick CSS authored); omitted for
// unassigned / tokenless traditions, same guard as the covers card.
function renderShelfBookRow(book) {
  var row = document.createElement('a');
  row.className = 'shelf-book-row';
  row.href = '#book/' + book.id;

  var rowTradition = book.traditionOverride || book.tradition;
  if (rowTradition && rowTradition !== 'unassigned' &&
      typeof REGISTER_SHAPE_PATHS[rowTradition] === 'string' &&
      REGISTER_SHAPE_PATHS[rowTradition] !== '') {
    var tick = document.createElement('span');
    tick.className = 'shelf-book-tick';
    tick.setAttribute('aria-hidden', 'true');
    tick.style.setProperty('--tick', 'var(--register-' + rowTradition + ')');
    row.appendChild(tick);
  }

  var titleEl = document.createElement('span');
  titleEl.className = 'shelf-book-row-title';
  titleEl.textContent = book.title || '';
  row.appendChild(titleEl);

  if (book.author) {
    var authorEl = document.createElement('span');
    authorEl.className = 'shelf-book-row-author';
    authorEl.textContent = book.author;
    row.appendChild(authorEl);
  }

  // Reuse the covers card's status-pill classes; omit entirely when falsy.
  if (book.status) {
    var statusEl = document.createElement('span');
    statusEl.className = 'shelf-book-status shelf-book-status-' + book.status;
    statusEl.textContent = book.status;
    row.appendChild(statusEl);
  }

  return row;
}

// Stage 5.6 sub-step 3: renderRegisterGlyph primitive.
//
// Pure function. Returns an SVG string for the tradition's glyph
// at the requested engagement band, or empty string if the inputs
// don't resolve to a valid glyph. Empty string is a real signal —
// the §2.6 "empty space is a real signal" principle from
// docs/knowledge-arcs/knowledge-arcs-visual-system.md.
//
// Inputs:
//   tradition       - one of the 10 TRADITIONS values (see state.js).
//                     'unassigned' deliberately returns empty string.
//   engagementBand  - integer 0, 1, or 2.
//                     0 = light (0 notes), 1 = mid (1-4 notes),
//                     2 = deep (5+ notes). Out-of-range returns empty.
//
// Output:
//   SVG string for valid inputs, ready to drop into the DOM via
//   innerHTML (sub-step 4 wires the shelf integration).
//   Empty string for invalid tradition or band, OR for 'unassigned'.
//
// Reads REGISTER_SHAPE_PATHS (defined in state.js, available at top
// level via the vanilla-JS no-strict-mode pattern). CSS variables
// (--register-X-light/-mid/-deep) are referenced by name in the
// fill attribute; the browser resolves them at paint time.
//
// Pure: same inputs always produce the same output. No state reads
// beyond REGISTER_SHAPE_PATHS, no side effects, no DOM access.
function renderRegisterGlyph(tradition, engagementBand) {
  // Validate band first — cheap integer check.
  if (engagementBand !== 0 && engagementBand !== 1 && engagementBand !== 2) {
    return '';
  }
  // Validate tradition + look up path.
  if (typeof tradition !== 'string') {
    return '';
  }
  var path = REGISTER_SHAPE_PATHS[tradition];
  if (typeof path !== 'string' || path === '') {
    // Catches both unknown traditions (undefined) and 'unassigned' (''empty string).
    return '';
  }
  // Map band to CSS variable suffix.
  var bandSuffix;
  if (engagementBand === 0) {
    bandSuffix = 'light';
  } else if (engagementBand === 1) {
    bandSuffix = 'mid';
  } else {
    bandSuffix = 'deep';
  }
  var fillVar = 'var(--register-' + tradition + '-' + bandSuffix + ')';
  return '<svg viewBox="0 0 24 24" class="register-glyph" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="' + path + '" fill="' + fillVar + '"></path>' +
    '</svg>';
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
// Theme match is STRICT EQUALITY against book.genre, which the 4b
// backfill wrote from the 5 canonical theme strings verbatim
// (112/112 coverage) -- exact match is correct by construction.
// Author values come from state.books so they match the same way.
// Stage 4c: sections are EXCLUSIVE single-select -- setting a value
// in one section clears the other (see toggleShelfFilter).
var shelfFilter = { author: null, genre: null, theme: null };

// Stage 4d: author-rail collapse + in-page search state. Memory-only,
// same lifetime contract as shelfFilter above. shelfSearchRaw keeps
// the user's exact text for the re-render's input restore;
// shelfSearchQuery is its trimmed lowercase form, the filter key.
var shelfAuthorRailExpanded = false;
var shelfSearchRaw = '';
var shelfSearchQuery = '';
var shelfSearchTimer = null;
var shelfSearchRefocus = false;

// Stage 2 (mockup-fidelity): desktop inline filter-rail collapse state.
// Memory-only, same lifetime as shelfFilter. On desktop (>=760) the
// theme+author rail is folded behind the Filter button; this flag keeps
// it expanded across re-renders (e.g. a filter-row click) so picking a
// filter does not snap the rail shut. Mobile ignores it and keeps the
// existing overlay panel (shelf-sidebar-mobile-open).
var shelfRailOpen = false;

// 3.10b-i: module-scope reference to the document-level Escape
// listener bound when the mobile filter panel is open. Tracked here
// (not inside renderShelf's closure) so a re-render can purge a
// stale handler that closed over the previous render's detached
// sidebar. Null when no handler is bound. The open/close path in
// renderShelf rotates this slot: open() removes any prior + adds a
// fresh one, dismiss() removes and clears it.
var shelfSidebarEscapeHandler = null;

// 9.2: module-scope Escape handler slot for the sub-theory evidence
// rail's mobile bottom sheet, mirroring shelfSidebarEscapeHandler.
// Parked here (not in renderSubTheoryPage's closure) so a re-render
// can purge a stale handler closed over a detached rail. Null when no
// handler is bound.
var subTheoryRailEscapeHandler = null;

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
    // Stage 4c: exclusive select -- a new pick in one section clears
    // every other section (generic loop, no hardcoded names).
    var sk;
    for (sk in shelfFilter) {
      if (Object.prototype.hasOwnProperty.call(shelfFilter, sk) &&
          sk !== section) {
        shelfFilter[sk] = null;
      }
    }
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

// Stage 4d: author-rail expand/collapse toggle. Shared by the click
// and keydown handlers on the .shelf-filter-row-toggle row.
function onShelfAuthorToggleClick() {
  shelfAuthorRailExpanded = !shelfAuthorRailExpanded;
  renderShelf();
}

function onShelfAuthorToggleKeydown(ev) {
  if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
    ev.preventDefault();
    shelfAuthorRailExpanded = !shelfAuthorRailExpanded;
    renderShelf();
  }
}

// Stage 4d: debounced search input handler (250ms). Stores the raw
// text for the input restore (casing/spacing preserved) and the
// trimmed lowercase form for the filter predicate; empty input
// clears the filter. Plain function callback -- no arrow.
function onShelfSearchInput() {
  var raw = this.value;
  if (shelfSearchTimer !== null) {
    clearTimeout(shelfSearchTimer);
  }
  shelfSearchTimer = setTimeout(function () {
    shelfSearchTimer = null;
    shelfSearchRaw = raw;
    shelfSearchQuery = raw.toLowerCase().replace(/^\s+|\s+$/g, '');
    shelfSearchRefocus = true;
    renderShelf();
  }, 250);
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
    // 5.6 sub-step 1: chokepoint call — see js/state.js ensureBookFields.
    // Stamps tradition + traditionOverride on the new book so it carries
    // the 5.6 schema regardless of which write path it entered through.
    ensureBookFields(state.books[id]);

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
function openBulkAddEditor(prefillText) {
  var hostEl = document.getElementById('shelf-editor-host');
  if (!hostEl) return;

  hostEl.innerHTML = '';

  var editor = document.createElement('div');
  editor.className = 'shelf-bulk-editor';

  var textarea = document.createElement('textarea');
  textarea.className = 'shelf-bulk-editor-textarea';
  textarea.placeholder = 'One ISBN or title per line';
  textarea.rows = 8;
  // 6.1c: optional prefill (scan hand-off passes the extracted titles,
  // one per line). Zero-arg callers leave prefillText undefined -> empty.
  if (typeof prefillText === 'string' && prefillText.length > 0) {
    textarea.value = prefillText;
  }

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

// 6.2a: scan review editor. Mounts inline into #shelf-editor-host (same
// idiom as openBulkAddEditor) and shows one editable row per extracted
// title, plus add/remove controls. Confirm collects the row values and
// hands the joined list to processBulkLines -- byte-for-byte the same
// write path the bulk textarea uses; this editor never writes directly.
// Reuses the .shelf-bulk-editor container chrome + the submit/cancel
// button family; only the rows/heading/remove/add carry new classes.
function openScanReviewEditor(titles) {
  var hostEl = document.getElementById('shelf-editor-host');
  if (!hostEl) return;

  hostEl.innerHTML = '';

  var editor = document.createElement('div');
  editor.className = 'shelf-bulk-editor shelf-scan-review';

  var heading = document.createElement('div');
  heading.className = 'shelf-scan-review-heading';
  heading.textContent = 'Review scanned titles';

  var rowsWrap = document.createElement('div');
  rowsWrap.className = 'shelf-scan-review-rows';

  // Build one editable row. The row element is closure-captured so the
  // remove button targets the right node regardless of add/remove order.
  // Enter inside a row input is absorbed (preventDefault) so a stray
  // keystroke never commits the list -- Confirm is the only commit path.
  function addRow(value, focusIt) {
    var row = document.createElement('div');
    row.className = 'shelf-scan-review-row';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'shelf-scan-review-input';
    if (typeof value === 'string') {
      input.value = value;
    }
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
      }
    });

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'shelf-scan-review-remove';
    removeBtn.setAttribute('aria-label', 'Remove title');
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', function() {
      if (row.parentNode) {
        row.parentNode.removeChild(row);
      }
    });

    row.appendChild(input);
    row.appendChild(removeBtn);
    rowsWrap.appendChild(row);
    if (focusIt) {
      input.focus();
    }
    return input;
  }

  var i;
  for (i = 0; i < titles.length; i++) {
    var t = titles[i];
    if (typeof t !== 'string') {
      t = String(t);
    }
    addRow(t, false);
  }

  var addCtl = document.createElement('button');
  addCtl.type = 'button';
  addCtl.className = 'shelf-scan-review-add';
  addCtl.textContent = '+ Add a title';
  addCtl.addEventListener('click', function() {
    addRow('', true);
  });

  var actions = document.createElement('div');
  actions.className = 'shelf-bulk-editor-actions';

  var confirmBtn = document.createElement('button');
  confirmBtn.type = 'button';
  confirmBtn.className = 'shelf-bulk-editor-submit';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.addEventListener('click', function() {
    var inputs = rowsWrap.querySelectorAll('.shelf-scan-review-input');
    var lines = [];
    var k;
    for (k = 0; k < inputs.length; k++) {
      var v = inputs[k].value.replace(/^\s+|\s+$/g, '');
      if (v.length > 0) {
        lines.push(v);
      }
    }
    // Zero non-empty rows on Confirm behaves like Cancel -- no write.
    if (lines.length === 0) {
      renderShelf();
      return;
    }
    processBulkLines(lines.join('\n'));
  });

  var cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'shelf-bulk-editor-cancel';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', function() {
    renderShelf();
  });

  // Esc anywhere in the editor cancels (cheap; matches the picker idiom).
  editor.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      renderShelf();
    }
  });

  actions.appendChild(confirmBtn);
  actions.appendChild(cancelBtn);
  editor.appendChild(heading);
  editor.appendChild(rowsWrap);
  editor.appendChild(addCtl);
  editor.appendChild(actions);
  hostEl.appendChild(editor);
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
      ensureBookFields(state.books[id]);    // 5.6 sub-step 1 chokepoint
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
      ensureBookFields(state.books[id]);    // 5.6 sub-step 1 chokepoint
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

// 6.1b: downscale a chosen photo on a canvas before upload. The longest
// edge is clamped to 1600px (never upscaled; aspect preserved); the
// canvas re-encodes to JPEG quality 0.85, so the output mediaType is
// always image/jpeg regardless of the input format. cb(err) on failure,
// cb(null, bareBase64, outW, outH) on success -- the data: prefix is
// stripped so the bare base64 matches vision-proxy's contract. The
// object URL is revoked on both the load and error paths.
function downscaleShelfPhoto(file, cb) {
  var url = URL.createObjectURL(file);
  var img = new Image();
  img.onload = function() {
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    var scale = Math.min(1, 1600 / Math.max(w, h));
    var outW = Math.max(1, Math.round(w * scale));
    var outH = Math.max(1, Math.round(h * scale));
    var canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, outW, outH);
    var dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    URL.revokeObjectURL(url);
    var base64 = dataUrl.replace(/^data:[^;]*;base64,/, '');
    cb(null, base64, outW, outH);
  };
  img.onerror = function() {
    URL.revokeObjectURL(url);
    cb(new Error('image decode failed'));
  };
  img.src = url;
}

// 6.1b: scan handler. Runs only once a file is actually chosen (the
// cancel path leaves the picker with no files, so the busy state never
// engages). Downscales, logs the payload size, POSTs bare base64 to
// vision-proxy, and console-logs the returned titles. Two-arg
// .then(onOk, onErr) throughout -- never .catch (ES3 parse harness).
// restore() clears the busy label and resets input.value in every
// terminal path so re-selecting the same photo re-fires the change event.
function handleShelfScanFile(input, btn) {
  if (!input.files || !input.files.length) return;
  var file = input.files[0];
  var originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Scanning' + '…';
  clearScanStatus();
  function restore() {
    btn.disabled = false;
    btn.textContent = originalLabel;
    input.value = '';
  }
  downscaleShelfPhoto(file, function(err, base64, w, h) {
    if (err) {
      console.warn('[scan] error downscale', err);
      restore();
      showScanStatus('Scan failed — please try again.');
      return;
    }
    console.log('[scan] ' + w + 'x' + h + ' → ' +
      Math.round(base64.length / 1024) + 'KB base64');
    fetch('/.netlify/functions/vision-proxy', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ image: base64, mediaType: 'image/jpeg' })
    }).then(function(res) {
      if (res.status === 200) {
        res.json().then(function(json) {
          console.log('[scan] titles:', json.titles);
          restore();
          // 6.2a: open the review editor (one editable row per title)
          // for the user to review and Confirm -- never auto-write.
          // Confirm routes through processBulkLines, the same hand-off
          // the bulk textarea makes. Empty result gets framing guidance.
          if (json &&
              Object.prototype.toString.call(json.titles) === '[object Array]' &&
              json.titles.length > 0) {
            openScanReviewEditor(json.titles);
          } else {
            showScanStatus('No readable titles found. Try photographing one shelf at a time, filling the frame.');
          }
        }, function(parseErr) {
          console.warn('[scan] error parse', parseErr);
          restore();
          showScanStatus('Scan failed — please try again.');
        });
      } else {
        res.text().then(function(body) {
          console.warn('[scan] error ' + res.status, body);
          restore();
          showScanStatus('Scan failed — please try again.');
        }, function(readErr) {
          console.warn('[scan] error ' + res.status, readErr);
          restore();
          showScanStatus('Scan failed — please try again.');
        });
      }
    }, function(netErr) {
      console.warn('[scan] error network', netErr);
      restore();
      showScanStatus('Scan failed — please try again.');
    });
  });
}

// 6.1c: scan status line plumbing. One shared auto-clear timer (module-
// scoped, mirrors the _stLayersOpen idiom) so a new message replaces any
// pending clear. The element is created per-render in renderShelf with a
// stable id, so these helpers find it by id regardless of closure scope.
var _scanStatusTimer = null;
function clearScanStatus() {
  if (_scanStatusTimer) {
    clearTimeout(_scanStatusTimer);
    _scanStatusTimer = null;
  }
  var el = document.getElementById('shelf-scan-status');
  if (el) el.textContent = '';
}
function showScanStatus(msg) {
  var el = document.getElementById('shelf-scan-status');
  if (!el) return;
  if (_scanStatusTimer) {
    clearTimeout(_scanStatusTimer);
    _scanStatusTimer = null;
  }
  el.textContent = msg;
  _scanStatusTimer = setTimeout(function() {
    var e2 = document.getElementById('shelf-scan-status');
    if (e2) e2.textContent = '';
    _scanStatusTimer = null;
  }, 6000);
}

// Stage 4 (chrome-fidelity): book-detail Edit-panel collapse state. Module-
// scoped (mirrors _stLayersOpen) so it survives the in-panel re-renders that
// editing a field triggers (status / ISBN blur / tradition each re-enter
// renderBookDetail) -- otherwise the panel would snap shut mid-edit. Resets
// to collapsed on a fresh page load (reading-first view); NOT persisted to ls.
var _bookDetailEditOpen = false;

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
  // Stage 4 (chrome-fidelity): the cover and the action buttons share a
  // left-column wrapper so the buttons sit UNDER the cover (mockup layout).
  // The cover/placeholder mounts here; .book-detail-actions (the buttons) is
  // appended below it. title/author/meta/artifact-card + Find-this-book live in
  // the right column's single .book-detail-content cell (S5.2).
  var coverCol = document.createElement('div');
  coverCol.className = 'book-detail-cover-col';
  if (book.coverUrl) {
    var cover = document.createElement('img');
    cover.className = 'book-detail-cover';
    cover.src = book.coverUrl;
    cover.alt = '';
    coverCol.appendChild(cover);
  } else {
    var coverPlaceholder = document.createElement('div');
    coverPlaceholder.className = 'book-detail-cover-placeholder';
    coverCol.appendChild(coverPlaceholder);
  }
  header.appendChild(coverCol);

  // S5.2: the right column is ONE grid cell (.book-detail-content) so the
  // cover's height no longer inflates per-element grid rows -- the content's
  // vertical rhythm is pure margin flow inside this cell. The S5.1 reg-tag
  // ("THEORY" register pill) is removed here per owner decision (overrides
  // the mockup, which keeps it); the global TRADITION_LABELS map is untouched.
  var contentCell = document.createElement('div');
  contentCell.className = 'book-detail-content';
  header.appendChild(contentCell);

  var title = document.createElement('h1');
  title.className = 'book-detail-title';
  title.textContent = book.title || '';
  contentCell.appendChild(title);

  if (book.author) {
    var author = document.createElement('p');
    author.className = 'book-detail-author';
    author.textContent = book.author;
    contentCell.appendChild(author);
  }

  // Batch 3: meta line -- status + derived (read-only) arc + marginalia
  // counts. Arc membership = arc.bookIds entries whose id === bookId;
  // marginalia = marginalia-register entries naming this book.
  var bdArcCount = 0;
  var bdArcMap = state.arcs || {};
  var bdAmk;
  for (bdAmk in bdArcMap) {
    if (Object.prototype.hasOwnProperty.call(bdArcMap, bdAmk)) {
      var bdArc = bdArcMap[bdAmk];
      if (bdArc && bdArc.bookIds) {
        var bdBi;
        for (bdBi = 0; bdBi < bdArc.bookIds.length; bdBi++) {
          var bdEntry = bdArc.bookIds[bdBi];
          var bdId = (bdEntry && bdEntry.id) ? bdEntry.id : bdEntry;
          if (bdId === bookId) { bdArcCount = bdArcCount + 1; break; }
        }
      }
    }
  }
  var bdMargCount = 0;
  var bdEmap = state.notebookEntries || {};
  var bdEmk;
  for (bdEmk in bdEmap) {
    if (Object.prototype.hasOwnProperty.call(bdEmap, bdEmk)) {
      var bdE = bdEmap[bdEmk];
      if (bdE && bdE.register === 'marginalia' && bdE.bookIds &&
          bdE.bookIds.indexOf(bookId) !== -1) {
        bdMargCount = bdMargCount + 1;
      }
    }
  }
  var metaLine = document.createElement('p');
  metaLine.className = 'book-detail-meta';
  metaLine.textContent = (book.status || 'reading') + ' · in ' +
    bdArcCount + (bdArcCount === 1 ? ' arc' : ' arcs') +
    ' · ' + bdMargCount + ' marginalia';
  contentCell.appendChild(metaLine);

  var user = getCurrentUser();

  // Batch 3: "Your Book Artifact" card -- OPAQUE --surface. Shows the
  // real artifact body when one exists (the "Open Artifact" link below
  // opens the full view); otherwise the teaser copy.
  var artCard = document.createElement('div');
  artCard.className = 'book-detail-artifact-card';
  var artEyebrow = document.createElement('p');
  artEyebrow.className = 'eyebrow';
  artEyebrow.textContent = 'Your Book Artifact';
  artCard.appendChild(artEyebrow);
  var artBody = document.createElement('p');
  artBody.className = 'book-detail-artifact-body';
  var bdArtRec = null;
  if (user && state.bookArtifacts) {
    var bdArtKey = artifactKey(user.uid, bookId);
    if (state.bookArtifacts[bdArtKey]) bdArtRec = state.bookArtifacts[bdArtKey];
  }
  if (bdArtRec && typeof bdArtRec.body === 'string' && bdArtRec.body.length > 0) {
    artBody.textContent = bdArtRec.body;
  } else {
    artBody.textContent =
      'A standing place for what this book is doing in your thinking — ' +
      'written once, yours, and visible to Yumi only when you choose.';
  }
  artCard.appendChild(artBody);

  // Stage 5 (mockup-fidelity): fold the standalone "Create Artifact" button
  // into the card as a gold "Write your artifact →" link (mockup line 233),
  // for the no-artifact state (finished + no artifact == the old Create-
  // Artifact branch). The has-artifact state keeps "Open Artifact" below.
  if (user && book.status === 'finished' && !bdArtRec) {
    var writeArtLink = document.createElement('button');
    writeArtLink.type = 'button';
    writeArtLink.className = 'book-detail-write-artifact';
    writeArtLink.textContent = 'Write your artifact →';
    writeArtLink.addEventListener('click', function() {
      openArtifactEditor(bookId);
    });
    artCard.appendChild(writeArtLink);
  }
  contentCell.appendChild(artCard);

  // S5: pull-quote (mockup B.6 .q-pull), render-when-exists against
  // book.quote. No live record carries a quote field today (0/112), so
  // this renders nothing -- it lights up only if a future book.quote is
  // populated. NOT faked from marginalia; textContent (not innerHTML).
  var bq = book.quote ? ('' + book.quote) : '';
  if (bq.replace(/^\s+|\s+$/g, '') !== '') {
    var quoteEl = document.createElement('div');
    quoteEl.className = 'book-detail-quote';
    quoteEl.textContent = bq;
    contentCell.appendChild(quoteEl);
  }

  // Stage 4: the action buttons live UNDER the cover -- they append into
  // .book-detail-actions inside the cover column, not the right column.
  var actions = document.createElement('div');
  actions.className = 'book-detail-actions';
  coverCol.appendChild(actions);

  if (user) {
    var newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'book-detail-new-entry';
    newBtn.textContent = 'Add Marginalia';
    newBtn.addEventListener('click', function() {
      openMarginaliaEditor(bookId);
    });

    var addToArcBtn = document.createElement('button');
    addToArcBtn.type = 'button';
    addToArcBtn.className = 'book-detail-add-to-arc';
    addToArcBtn.textContent = 'Add to arc…';
    addToArcBtn.addEventListener('click', function() {
      openBookArcPicker(bookId);
    });

    // 10.1: Send to sub-theory — attaches this book as evidence (kind
    // 'book', no quote). Sits beside "Add to arc…" in the same row.
    var sendToSubBtn = document.createElement('button');
    sendToSubBtn.type = 'button';
    sendToSubBtn.className = 'book-detail-add-to-arc book-detail-send-to-subtheory';
    sendToSubBtn.textContent = 'Send to sub-theory…';
    sendToSubBtn.addEventListener('click', function() {
      openBookSendToSubTheory(bookId);
    });

    // Canon §4-I: Add-to-an-arc is the standalone primary on its own
    // full-width line in .book-detail-actions; the secondary PAIR
    // [Send-to-sub | Add-marginalia] shares .book-detail-actions-row
    // (stacked full-width on desktop, side-by-side on mobile). The
    // status-branch button below appends to .book-detail-actions as its
    // own line.
    actions.appendChild(addToArcBtn);
    var actionsRow = document.createElement('div');
    actionsRow.className = 'book-detail-actions-row';
    actionsRow.appendChild(sendToSubBtn);
    actionsRow.appendChild(newBtn);
    actions.appendChild(actionsRow);

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
      actions.appendChild(finishedBtn);
    } else if (book.status === 'finished' && !hasArtifact) {
      // Branch 3 -- (finished, no-artifact): Stage 5 folded the former
      // standalone "Create Artifact" button into the artifact card as the gold
      // "Write your artifact →" link (built above), so no actions-row button
      // renders in this branch now.
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
      actions.appendChild(openArtLink);
    } else if (book.status === 'finished' && hasArtifact) {
      // Branch 5 -- (finished, has-artifact): canonical post-Artifact
      // state. Both creation CTAs are gone; the link is the only
      // book-detail surface that references the Artifact.
      var openArtLink = document.createElement('a');
      openArtLink.className = 'book-detail-open-artifact';
      openArtLink.href = '#artifact/' + bookId;
      openArtLink.textContent = 'Open Artifact';
      actions.appendChild(openArtLink);
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
      actions.appendChild(openArtLink);
    }

    // Stage 7 (manual themes): assign this book to the reader's themes, or
    // create a new theme and add it. Membership lives in state.userThemes
    // (off the book record). Chips toggle membership; the inline field creates
    // a theme and adds this book. Reuses existing input / button classes; chip
    // styling is a small token-based block in components.css.
    var themesWrap = document.createElement('div');
    themesWrap.className = 'book-detail-themes';
    var themesLabel = document.createElement('div');
    themesLabel.className = 'book-detail-themes-label';
    themesLabel.textContent = 'Themes';
    themesWrap.appendChild(themesLabel);

    var bdThemes = [];
    var bdtk;
    if (state.userThemes) {
      for (bdtk in state.userThemes) {
        if (Object.prototype.hasOwnProperty.call(state.userThemes, bdtk) &&
            state.userThemes[bdtk] && state.userThemes[bdtk].userId === user.uid) {
          bdThemes.push(state.userThemes[bdtk]);
        }
      }
    }
    bdThemes.sort(function(a, b) { return (a.name || '').localeCompare(b.name || ''); });
    var bdChipRow = document.createElement('div');
    bdChipRow.className = 'book-detail-theme-chips';
    var bdi;
    for (bdi = 0; bdi < bdThemes.length; bdi++) {
      (function(theme) {
        var member = Array.isArray(theme.bookIds) &&
          theme.bookIds.indexOf(bookId) !== -1;
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = member
          ? 'book-detail-theme-chip book-detail-theme-chip-on'
          : 'book-detail-theme-chip';
        chip.textContent = (member ? '✓ ' : '+ ') + theme.name;
        chip.addEventListener('click', function() {
          if (member) { unassignBookFromTheme(theme.id, bookId); }
          else { assignBookToTheme(theme.id, bookId); }
          renderBookDetail(bookId);
        });
        bdChipRow.appendChild(chip);
      })(bdThemes[bdi]);
    }
    themesWrap.appendChild(bdChipRow);

    var bdNewRow = document.createElement('div');
    bdNewRow.className = 'book-detail-theme-new';
    var bdNewInput = document.createElement('input');
    bdNewInput.type = 'text';
    bdNewInput.className = 'account-field-input book-detail-theme-input';
    bdNewInput.setAttribute('placeholder', 'New theme name');
    bdNewRow.appendChild(bdNewInput);
    var bdNewBtn = document.createElement('button');
    bdNewBtn.type = 'button';
    bdNewBtn.className = 'notebook-new-entry account-secondary-btn';
    bdNewBtn.textContent = 'Create & add';
    bdNewBtn.addEventListener('click', function() {
      var theme = createUserTheme(bdNewInput.value);
      if (theme) {
        assignBookToTheme(theme.id, bookId);
        renderBookDetail(bookId);
      }
    });
    bdNewRow.appendChild(bdNewBtn);
    themesWrap.appendChild(bdNewRow);
    actions.appendChild(themesWrap);
  } else {
    var signinBtn = document.createElement('button');
    signinBtn.type = 'button';
    signinBtn.className = 'book-detail-signin-prompt';
    signinBtn.textContent = 'Sign in to write';
    signinBtn.addEventListener('click', function() {
      signInWithGoogle();
    });
    actions.appendChild(signinBtn);
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
    // S5.2: find-this-book seats inside the content cell, last, so it
    // hugs the card instead of floating down beside the tall cover.
    contentCell.appendChild(bdFindLink);
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
  // Batch 3: edit fields (status / ISBN / tradition) grouped into a
  // styled details section below the reading-view chrome. Function
  // unchanged; no edit-mode toggle.
  // Stage 4: the Edit panel collapses behind this toggle (default collapsed).
  // Flipping _bookDetailEditOpen + re-rendering shows/hides the panel; the
  // flag is module-level so an in-panel field edit (which re-renders) leaves
  // it open. The editSection build below is byte-unchanged -- only its final
  // append is gated on the flag.
  var editToggle = document.createElement('button');
  editToggle.type = 'button';
  editToggle.className = 'book-detail-edit-toggle';
  editToggle.textContent = 'Edit';
  editToggle.setAttribute('aria-expanded', _bookDetailEditOpen ? 'true' : 'false');
  editToggle.addEventListener('click', function() {
    _bookDetailEditOpen = !_bookDetailEditOpen;
    renderBookDetail(bookId);
  });
  wrap.appendChild(editToggle);

  var editSection = document.createElement('div');
  editSection.className = 'book-detail-edit-section';
  var editEyebrow = document.createElement('p');
  editEyebrow.className = 'eyebrow';
  editEyebrow.textContent = 'Edit details';
  editSection.appendChild(editEyebrow);

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
    editSection.appendChild(statusWrap);
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
  editSection.appendChild(isbnRow);

  // Stage 5.6 sub-step 5a: tradition dropdown.
  // Always rendered, no host, no toggle. Mirrors status-radio pattern:
  // change-on-flip writes traditionOverride and re-renders. Dropdown
  // DISPLAYS effective tradition (override || base), WRITES only override.
  var traditionRow = document.createElement('div');
  traditionRow.className = 'book-detail-tradition-row';

  var traditionLabel = document.createElement('label');
  traditionLabel.className = 'book-detail-tradition-label';
  traditionLabel.textContent = 'Tradition';
  traditionRow.appendChild(traditionLabel);

  var traditionSelect = document.createElement('select');
  traditionSelect.className = 'book-detail-tradition-select';

  var effectiveTradition = state.books[bookId].traditionOverride || state.books[bookId].tradition;
  var ti;
  var topt;
  for (ti = 0; ti < TRADITIONS.length; ti++) {
    topt = document.createElement('option');
    topt.value = TRADITIONS[ti];
    topt.textContent = TRADITION_LABELS[TRADITIONS[ti]];
    if (TRADITIONS[ti] === effectiveTradition) {
      topt.selected = true;
    }
    traditionSelect.appendChild(topt);
  }

  traditionSelect.onchange = function (ev) {
    state.books[bookId].traditionOverride = ev.target.value;
    ensureBookFields(state.books[bookId]);
    markBooksDirty();
    saveState();
    renderBookDetail(bookId);
  };

  traditionRow.appendChild(traditionSelect);
  editSection.appendChild(traditionRow);
  // Stage 4: only mount the panel when expanded (default collapsed).
  if (_bookDetailEditOpen) {
    wrap.appendChild(editSection);
  }

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

  // 10.1: dedicated host for the Send-to-sub-theory picker, one host per
  // concern (same precedent as the arc picker host above) so the two
  // pickers never collide in a shared slot.
  var subPickerHost = document.createElement('div');
  subPickerHost.id = 'book-detail-subtheory-picker-host';
  wrap.appendChild(subPickerHost);

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
    // Batch 3: wrap book-detail marginalia in the opaque entries panel.
    list.className = 'notebook-entry-list notebook-entries-panel';
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
// 9.2 sub-theory writing surface. Renders into #app: a header field, a
// public body, and an optional intellectual-register body revealed by a
// toggle (shown immediately if the field already carries text). Header
// and bodies persist on blur through updateSubTheory (the field-only
// writer; status/arrays/timestamps are owned elsewhere). The two-column
// shell mounts an empty evidence rail (#subtheory-rail) that Checkpoint
// C populates. Italics are authored inline via *asterisks*; the raw
// text is stored verbatim (in-prose rendering is deferred to Stage 10).
// 9b-iii (R54): the symbol picker modal. Hosted here (the renderer stays
// state-pure). Opens for a sub-theory; the preview renders through the LIVE
// path (window.stRenderMarkMarkup -> _stRenderShapes), so it is byte-identical
// to a constellation mark. Save writes 0-based markShape/markColor (R52) or
// DELETES them for Auto, then saveState + re-renders the current view in place.
// Canonical names (sheet, ruling 49); shapes for the detail line.
var ST_MARK_NAMES = ['the beacon', 'the wellspring', 'the compass', 'the keystone',
  'the river', 'the lantern', 'the facet', 'the bloom', 'the summit', 'the chamber',
  'the seed', 'the kite', 'the harbor', 'the spark', 'the dune', 'the gate'];
var ST_MARK_SHAPES = ['hexagon', 'teardrop', 'four-point star', 'pentagon',
  'lens (vesica)', 'arch', 'rhombus', 'rosette', 'triangle', 'octagon', 'egg',
  'kite', 'semicircle', 'six-point star', 'mound', 'squircle'];

function _stPickerMarkSvg(subId, shapeIdx, colorIdx, pal, neutral) {
  if (typeof window.stRenderMarkMarkup !== 'function') { return ''; }
  var inner = window.stRenderMarkMarkup(shapeIdx, colorIdx,
    { id: subId, palette: pal, maturity: 1, neutral: neutral });
  var defs = neutral ? '' :
    ((typeof window.stMarkPreviewDefs === 'function') ? window.stMarkPreviewDefs() : '');
  return '<svg viewBox="-60 -60 120 120" xmlns="http://www.w3.org/2000/svg" '
    + 'aria-hidden="true" style="width:100%;height:100%;display:block;overflow:visible">'
    + defs + inner + '</svg>';
}

function openSymbolPicker(subId) {
  var rec = state.subTheories && state.subTheories[subId];
  if (!rec) { return; }
  var opener = document.activeElement;
  var pal = (ls('praxis_constellation_palette', 'colorful') === 'muted') ? 'muted' : 'colorful';
  var hash = (typeof window.stHashIndices === 'function')
    ? window.stHashIndices(subId) : { shapeIdx: 0, colorIdx: 0 };
  // working state -- null = Auto (no override)
  var pick = {
    shape: (typeof rec.markShape === 'number' && rec.markShape >= 0 && rec.markShape <= 15) ? rec.markShape : null,
    color: (typeof rec.markColor === 'number' && rec.markColor >= 0 && rec.markColor <= 15) ? rec.markColor : null
  };
  function effShape() { return (pick.shape === null) ? hash.shapeIdx : pick.shape; }
  function effColor() { return (pick.color === null) ? hash.colorIdx : pick.color; }

  var backdrop = document.createElement('div');
  backdrop.className = 'st-picker-backdrop';
  backdrop.addEventListener('click', cancel);

  var dialog = document.createElement('div');
  dialog.className = 'st-picker';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Choose a mark');
  dialog.addEventListener('click', function(e) { e.stopPropagation(); });

  // ---- header ----
  var head = document.createElement('div');
  head.className = 'st-picker-head';
  var headText = document.createElement('div');
  var eyebrow = document.createElement('div');
  eyebrow.className = 'st-picker-eyebrow';
  eyebrow.textContent = 'Mark';
  var subName = document.createElement('div');
  subName.className = 'st-picker-sub';
  subName.textContent = (rec.header && rec.header.length) ? rec.header : 'Untitled sub-theory';
  headText.appendChild(eyebrow);
  headText.appendChild(subName);
  head.appendChild(headText);
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'st-picker-close';
  closeBtn.textContent = 'esc';
  closeBtn.setAttribute('aria-label', 'Cancel');
  closeBtn.addEventListener('click', cancel);
  head.appendChild(closeBtn);
  dialog.appendChild(head);

  // ---- preview ----
  var preview = document.createElement('div');
  preview.className = 'st-picker-preview';
  var previewMark = document.createElement('div');
  previewMark.className = 'st-picker-preview-mark';
  var previewMeta = document.createElement('div');
  var previewName = document.createElement('div');
  previewName.className = 'st-picker-preview-name';
  var previewDetail = document.createElement('div');
  previewDetail.className = 'st-picker-preview-detail';
  var badge = document.createElement('span');
  badge.className = 'st-picker-badge';
  badge.textContent = 'auto — from its id';
  previewMeta.appendChild(previewName);
  previewMeta.appendChild(previewDetail);
  previewMeta.appendChild(badge);
  preview.appendChild(previewMark);
  preview.appendChild(previewMeta);
  dialog.appendChild(preview);

  // ---- shape grid ----
  dialog.appendChild(_stPickerRowLabel('Shape', 'independent of color'));
  var shapeGrid = document.createElement('div');
  shapeGrid.className = 'st-picker-grid st-picker-grid-shapes';
  dialog.appendChild(shapeGrid);

  // ---- color grid (always colorful swatches) ----
  dialog.appendChild(_stPickerRowLabel('Color', 'identity hues · muted follows the palette'));
  var colorGrid = document.createElement('div');
  colorGrid.className = 'st-picker-grid st-picker-grid-colors';
  colorGrid.setAttribute('data-st-palette', 'colorful');
  dialog.appendChild(colorGrid);

  // ---- footer ----
  var foot = document.createElement('div');
  foot.className = 'st-picker-foot';
  var resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'st-picker-btn st-picker-btn-text';
  resetBtn.textContent = 'Reset to auto';
  resetBtn.addEventListener('click', function() { pick.shape = null; pick.color = null; renderPicker(); });
  var footRight = document.createElement('div');
  footRight.className = 'st-picker-foot-right';
  var cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'st-picker-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', cancel);
  var saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'st-picker-btn st-picker-btn-primary';
  saveBtn.textContent = 'Save mark';
  saveBtn.addEventListener('click', save);
  footRight.appendChild(cancelBtn);
  footRight.appendChild(saveBtn);
  foot.appendChild(resetBtn);
  foot.appendChild(footRight);
  dialog.appendChild(foot);

  // ---- build grids once ----
  var shapeCells = [];
  var colorCells = [];
  shapeGrid.appendChild(_stPickerAutoCell('shape', function() { pick.shape = null; renderPicker(); }, shapeCells));
  var gi;
  for (gi = 0; gi < 16; gi = gi + 1) {
    shapeGrid.appendChild(_stPickerShapeCell(subId, gi, pal, function(idx) {
      pick.shape = idx; renderPicker();
    }, shapeCells));
  }
  colorGrid.appendChild(_stPickerAutoCell('color', function() { pick.color = null; renderPicker(); }, colorCells));
  for (gi = 0; gi < 16; gi = gi + 1) {
    colorGrid.appendChild(_stPickerColorCell(gi, function(idx) {
      pick.color = idx; renderPicker();
    }, colorCells));
  }

  function renderPicker() {
    var s = effShape(), c = effColor();
    previewMark.innerHTML = _stPickerMarkSvg(subId, s, c, pal, false);
    previewName.textContent = ST_MARK_NAMES[s];
    previewDetail.textContent = ST_MARK_SHAPES[s] + ' · hue ' + (c + 1) + ' of 16';
    badge.style.display = (pick.shape === null && pick.color === null) ? '' : 'none';
    // shape cells reflect the live color; selection state
    var k;
    for (k = 0; k < shapeCells.length; k = k + 1) {
      var sv = shapeCells[k].getAttribute('data-val');
      _stPickerSel(shapeCells[k], (sv === 'auto') ? (pick.shape === null) : (parseInt(sv, 10) === pick.shape));
    }
    for (k = 0; k < colorCells.length; k = k + 1) {
      var cv = colorCells[k].getAttribute('data-val');
      _stPickerSel(colorCells[k], (cv === 'auto') ? (pick.color === null) : (parseInt(cv, 10) === pick.color));
    }
  }

  function save() {
    if (pick.shape === null) { delete rec.markShape; } else { rec.markShape = pick.shape; }
    if (pick.color === null) { delete rec.markColor; } else { rec.markColor = pick.color; }
    saveState();
    close();
    if (typeof renderRoute === 'function') { renderRoute(); }
  }
  function cancel() { close(); }
  function close() {
    document.removeEventListener('keydown', onKey);
    if (backdrop.parentNode) { backdrop.parentNode.removeChild(backdrop); }
    if (dialog.parentNode) { dialog.parentNode.removeChild(dialog); }
    if (opener && opener.focus) { try { opener.focus(); } catch (e) {} }
  }
  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); cancel(); }
  }

  document.body.appendChild(backdrop);
  document.body.appendChild(dialog);
  document.addEventListener('keydown', onKey);
  renderPicker();
  if (dialog.focus) { try { dialog.setAttribute('tabindex', '-1'); dialog.focus(); } catch (e) {} }
}

// picker cell/label helpers (module scope so the closure above stays lean).
function _stPickerRowLabel(text, hint) {
  var row = document.createElement('div');
  row.className = 'st-picker-row-label';
  var a = document.createElement('span');
  a.textContent = text;
  var b = document.createElement('span');
  b.className = 'st-picker-hint';
  b.textContent = hint;
  row.appendChild(a);
  row.appendChild(b);
  return row;
}
function _stPickerSel(cell, on) {
  cell.className = cell.className.replace(/\s*is-sel/g, '') + (on ? ' is-sel' : '');
}
function _stPickerAutoCell(kind, onPick, store) {
  var cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'st-picker-cell st-picker-cell-auto';
  cell.setAttribute('data-val', 'auto');
  cell.setAttribute('title', 'Hashed from its id');
  cell.textContent = 'Auto';
  cell.addEventListener('click', onPick);
  store.push(cell);
  return cell;
}
function _stPickerShapeCell(subId, idx, pal, onPick, store) {
  var cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'st-picker-cell st-picker-cell-shape';
  cell.setAttribute('data-val', '' + idx);
  cell.setAttribute('title', ST_MARK_NAMES[idx] + ' · ' + ST_MARK_SHAPES[idx]);
  cell.innerHTML = _stPickerMarkSvg(subId, idx, 0, pal, true);
  cell.addEventListener('click', function() { onPick(idx); });
  store.push(cell);
  return cell;
}
function _stPickerColorCell(idx, onPick, store) {
  var cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'st-picker-cell st-picker-cell-color';
  cell.setAttribute('data-val', '' + idx);
  cell.setAttribute('title', ST_MARK_NAMES[idx]);
  var sw = document.createElement('span');
  sw.className = 'st-picker-swatch';
  sw.setAttribute('style', 'background:var(--subtheory-' + (idx + 1)
    + ');box-shadow:0 0 0 2px var(--subtheory-' + (idx + 1) + '-edge) inset');
  cell.appendChild(sw);
  cell.addEventListener('click', function() { onPick(idx); });
  store.push(cell);
  return cell;
}

// 9b-iii: expose the picker so the constellation hover card (in
// arc-constellation.js) can open it without reaching across layers.
window.openSymbolPicker = openSymbolPicker;

// Fix (v3.81): a small reusable danger-confirm modal for deleting a sub-theory,
// callable from any surface (the Web-view hover card is transient, so a
// from-anywhere modal beats a host-mounted panel). On confirm it runs
// deleteSubTheory(id) -- which cascades the resonance links + clears the current
// pointer (state.js) -- then the caller's afterDelete (writing page -> route to
// the arc; hover card -> re-render in place). esc + backdrop = cancel.
function confirmDeleteSubTheory(id, afterDelete) {
  var rec = state.subTheories && state.subTheories[id];
  if (!rec) { return; }
  var opener = document.activeElement;
  var title = (rec.header && rec.header.length) ? rec.header : 'this sub-theory';

  var backdrop = document.createElement('div');
  backdrop.className = 'st-confirm-backdrop';
  backdrop.addEventListener('click', close);

  var panel = document.createElement('div');
  panel.className = 'st-confirm';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Delete sub-theory');
  panel.addEventListener('click', function(e) { e.stopPropagation(); });

  var copy = document.createElement('p');
  copy.className = 'st-confirm-copy';
  copy.textContent = 'Delete “' + title + '”? Its evidence and any '
    + 'resonance links are removed. This can’t be undone.';
  panel.appendChild(copy);

  var actions = document.createElement('div');
  actions.className = 'st-confirm-actions';
  var cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'st-confirm-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', close);
  var delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'st-confirm-btn st-confirm-btn-danger';
  delBtn.textContent = 'Delete sub-theory';
  delBtn.addEventListener('click', function() {
    var ok = deleteSubTheory(id);
    close();
    if (ok && typeof afterDelete === 'function') { afterDelete(); }
  });
  actions.appendChild(cancelBtn);
  actions.appendChild(delBtn);
  panel.appendChild(actions);

  function close() {
    document.removeEventListener('keydown', onKey);
    if (backdrop.parentNode) { backdrop.parentNode.removeChild(backdrop); }
    if (panel.parentNode) { panel.parentNode.removeChild(panel); }
    if (opener && opener.focus) { try { opener.focus(); } catch (e) {} }
  }
  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); }
  }

  document.body.appendChild(backdrop);
  document.body.appendChild(panel);
  document.addEventListener('keydown', onKey);
  if (panel.focus) { try { panel.setAttribute('tabindex', '-1'); panel.focus(); } catch (e) {} }
}
// Exposed so the constellation hover card (arc-constellation.js) can open it.
window.confirmDeleteSubTheory = confirmDeleteSubTheory;

// Stage R #4: a deliberate-act confirm for removing a resonance link between
// two sub-theories. Sibling of confirmDeleteSubTheory -- same .st-confirm
// chrome, callable from the transient Web-view hover card. Lists this
// sub-theory's CURRENT connections; each row carries its own Unlink button
// (per-connection -- never a bulk wipe). Each removal reuses the existing
// unlinkSubTheories(id, partnerId) state fn (symmetric splice + persist),
// drops its row in place, and fires afterUnlink so the constellation behind
// the modal re-renders without the gone edge. Emptying the list closes the
// modal. esc + backdrop = cancel.
function confirmUnlinkSubTheory(id, afterUnlink) {
  var rec = state.subTheories && state.subTheories[id];
  if (!rec) { return; }
  var raw = Array.isArray(rec.linkedSubTheories) ? rec.linkedSubTheories : [];
  var partners = [];
  var pi;
  for (pi = 0; pi < raw.length; pi = pi + 1) {
    if (state.subTheories[raw[pi]]) { partners.push(raw[pi]); }
  }
  if (partners.length === 0) { return; }
  var opener = document.activeElement;
  var title = (rec.header && rec.header.length) ? rec.header : 'this sub-theory';

  var backdrop = document.createElement('div');
  backdrop.className = 'st-confirm-backdrop';
  backdrop.addEventListener('click', close);

  var panel = document.createElement('div');
  panel.className = 'st-confirm';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Remove a connection');
  panel.addEventListener('click', function(e) { e.stopPropagation(); });

  var copy = document.createElement('p');
  copy.className = 'st-confirm-copy';
  copy.textContent = 'Remove a connection from “' + title + '”? Both '
    + 'sub-theories stay; only the link between them is removed.';
  panel.appendChild(copy);

  var list = document.createElement('div');
  list.className = 'st-confirm-unlink-list';
  panel.appendChild(list);

  function addRow(partnerId) {
    var partner = state.subTheories[partnerId];
    var pHeader = (partner && partner.header && partner.header.length)
      ? partner.header : 'Untitled sub-theory';
    var row = document.createElement('div');
    row.className = 'st-confirm-unlink-row';
    var name = document.createElement('span');
    name.className = 'st-confirm-unlink-name';
    name.textContent = pHeader;
    row.appendChild(name);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'st-confirm-btn st-confirm-btn-danger';
    btn.textContent = 'Unlink';
    btn.addEventListener('click', function() {
      var ok = unlinkSubTheories(id, partnerId);
      if (row.parentNode) { row.parentNode.removeChild(row); }
      if (ok && typeof afterUnlink === 'function') { afterUnlink(); }
      if (!list.firstChild) { close(); }
    });
    row.appendChild(btn);
    list.appendChild(row);
  }
  var ri;
  for (ri = 0; ri < partners.length; ri = ri + 1) {
    addRow(partners[ri]);
  }

  var actions = document.createElement('div');
  actions.className = 'st-confirm-actions';
  var doneBtn = document.createElement('button');
  doneBtn.type = 'button';
  doneBtn.className = 'st-confirm-btn';
  doneBtn.textContent = 'Done';
  doneBtn.addEventListener('click', close);
  actions.appendChild(doneBtn);
  panel.appendChild(actions);

  function close() {
    document.removeEventListener('keydown', onKey);
    if (backdrop.parentNode) { backdrop.parentNode.removeChild(backdrop); }
    if (panel.parentNode) { panel.parentNode.removeChild(panel); }
    if (opener && opener.focus) { try { opener.focus(); } catch (e) {} }
  }
  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); }
  }

  document.body.appendChild(backdrop);
  document.body.appendChild(panel);
  document.addEventListener('keydown', onKey);
  if (panel.focus) { try { panel.setAttribute('tabindex', '-1'); panel.focus(); } catch (e) {} }
}
// Exposed so the constellation hover card (arc-constellation.js) can open it.
window.confirmUnlinkSubTheory = confirmUnlinkSubTheory;

// 10.2: pure citation parser. Splits bodyText into ordered segments,
// detecting *asterisk*-wrapped italic spans (the markdown-light convention
// from 9.2). Each italic span is matched, case-insensitively, against the
// supplied evidence titles; a span carrying one or more matches is a
// citation (ids array; length > 1 means ambiguous). Returns an ordered
// array of segments, each one of:
//   { text: '...' }                              plain (non-italic) run
//   { text: '...', italic: true }                italic, no citation match
//   { text: '...', italic: true, ids: [..] }     italic citation (1+ ids)
// evidenceTitles is [{ id, title }] resolved by the CALLER (book title /
// entry label / external title via its 10.3 refId) -- title resolution
// touches state, so it stays out of here and this function remains pure:
// no state reads, no DOM, no writes. Matching is bidirectional substring
// (the span text contains a title, or a title contains the span text) so a
// writer can italicize either a full title or a recognizable fragment.
// A '*' with no closing partner is not a span: from that '*' onward the
// literal text (asterisk included) is emitted as plain. An empty span
// ('**') collapses to literal plain text as well.
function parseCitations(bodyText, evidenceTitles) {
  var segments = [];
  var text = (typeof bodyText === 'string') ? bodyText : '';
  var titles = Array.isArray(evidenceTitles) ? evidenceTitles : [];
  var n = text.length;
  var i = 0;
  var plainStart = 0;

  function flushPlain(end) {
    if (end > plainStart) {
      segments.push({ text: text.substring(plainStart, end) });
    }
  }

  while (i < n) {
    if (text.charAt(i) !== '*') {
      i = i + 1;
      continue;
    }
    var close = text.indexOf('*', i + 1);
    if (close === -1) {
      // Unclosed asterisk -- the remainder is literal plain text.
      break;
    }
    var inner = text.substring(i + 1, close);
    if (inner.length === 0) {
      // '**' -- leave both asterisks for the next flushPlain as literal.
      i = close + 1;
      continue;
    }
    flushPlain(i);
    var ids = [];
    var lc = inner.toLowerCase();
    var ti;
    for (ti = 0; ti < titles.length; ti = ti + 1) {
      var t = titles[ti];
      if (t && typeof t.title === 'string' && t.title.length) {
        var tl = t.title.toLowerCase();
        if (lc.indexOf(tl) !== -1 || tl.indexOf(lc) !== -1) {
          ids.push(t.id);
        }
      }
    }
    var seg = { text: inner, italic: true };
    if (ids.length) { seg.ids = ids; }
    segments.push(seg);
    i = close + 1;
    plainStart = i;
  }
  flushPlain(n);
  return segments;
}

// 10.4: read-only render of a sub-theory, returned as a DOM node. mode
// 'published' marks citations with superscript numbers (first-appearance
// order); 'draft' uses the 10.2 underline-dot. Builds a numbered evidence
// block (cited items in appearance order, then uncited in attachment order)
// and a "see also" list of linked sub-theories. Empty arrays suppress their
// sections. Reads state for resolution; writes nothing.
// PRIVACY (Preston, A): published mode EXCLUDES evidence referencing a private
// or missing journal entry -- no marker, no count; its inline citations fall
// back to plain italics. Draft mode keeps those rows with a muted
// "private -- excluded when published" tag so the author sees what will drop.
// Body renders the PUBLIC register (bodyPublic). Reuses parseCitations.
// 10.5.7: ES3 array membership (no Array.indexOf), shared by the editor's pin
// resolution and the read-only render's pin routing.
function citeIdIn(ids, x) {
  var i;
  for (i = 0; i < ids.length; i = i + 1) {
    if (ids[i] === x) { return true; }
  }
  return false;
}

function renderSubTheoryReadOnly(subTheory, mode) {
  var published = (mode === 'published');
  var root = document.createElement('div');
  root.className = 'subtheory-readonly ' +
    (published ? 'subtheory-readonly-published' : 'subtheory-readonly-draft');

  var head = document.createElement('h2');
  head.className = 'subtheory-readonly-header';
  head.textContent = subTheory.header || 'Untitled sub-theory';
  root.appendChild(head);

  var evidence = Array.isArray(subTheory.evidence) ? subTheory.evidence : [];

  // A kind:'entry' evidence whose live entry is private or missing. Books and
  // external sources are never private.
  function evidencePrivate(el) {
    if (!el || el.kind !== 'entry') { return false; }
    var en = state.notebookEntries && state.notebookEntries[el.refId];
    return (!en) || en.isPrivate === true;
  }

  // Evidence this render shows: published drops private; draft keeps all.
  var visible = [];
  var k;
  for (k = 0; k < evidence.length; k = k + 1) {
    if (published && evidencePrivate(evidence[k])) { continue; }
    visible.push(evidence[k]);
  }

  // Bare match-title (book.title / external title / titled entry); only visible
  // evidence is a citation target, so a published phrase that named a private
  // entry no longer resolves (-> plain italics).
  function citeTitle(el) {
    if (el.kind === 'book') {
      var bk = state.books && state.books[el.refId];
      return (bk && bk.title) ? bk.title : '';
    }
    if (el.kind === 'entry') {
      var en = state.notebookEntries && state.notebookEntries[el.refId];
      return (en && en.title) ? en.title : '';
    }
    var ext = el.external || {};
    return ext.title || '';
  }
  // Full citation line: "Author, Title" for books, label for entries,
  // "Title -- Author" for external.
  function citeLine(el) {
    if (el.kind === 'book') {
      var bk = state.books && state.books[el.refId];
      if (bk) {
        return bk.author ? (bk.author + ', ' + bk.title) : (bk.title || 'Book');
      }
      return 'Book';
    }
    if (el.kind === 'entry') {
      var en = state.notebookEntries && state.notebookEntries[el.refId];
      if (en) {
        if (en.title) { return en.title; }
        if (en.body) {
          return en.body.length > 60 ? en.body.substring(0, 57) + '...' : en.body;
        }
      }
      return 'Note';
    }
    var ext = el.external || {};
    if (ext.title && ext.author) { return ext.title + ' — ' + ext.author; }
    if (ext.title) { return ext.title; }
    return 'External source';
  }
  function findById(list, eid) {
    var i;
    for (i = 0; i < list.length; i = i + 1) {
      if (list[i] && list[i].id === eid) { return list[i]; }
    }
    return null;
  }

  var titles = [];
  var ti;
  for (ti = 0; ti < visible.length; ti = ti + 1) {
    var mt = citeTitle(visible[ti]);
    if (mt) { titles.push({ id: visible[ti].id, title: mt }); }
  }

  // Body: parse the public register, number citations by first appearance.
  // 10.5.7: an ambiguous phrase resolves through the author's persisted pin
  // when one is set among the candidates; otherwise the first candidate.
  var pins = (subTheory.citationPins && typeof subTheory.citationPins === 'object')
    ? subTheory.citationPins : {};
  var segs = parseCitations(subTheory.bodyPublic || '', titles);
  var order = [];
  var numberOf = {};
  var bodyEl = document.createElement('div');
  bodyEl.className = 'subtheory-readonly-body';
  var si;
  for (si = 0; si < segs.length; si = si + 1) {
    var s = segs[si];
    if (s.ids && s.ids.length) {
      var eid = s.ids[0];
      var rpin = pins[s.text.toLowerCase()];
      if (rpin && citeIdIn(s.ids, rpin)) { eid = rpin; }
      if (!numberOf[eid]) { order.push(eid); numberOf[eid] = order.length; }
      var span = document.createElement('span');
      span.className = 'subtheory-cite';
      span.textContent = s.text;
      bodyEl.appendChild(span);
      if (published) {
        var sup = document.createElement('sup');
        sup.className = 'subtheory-cite-num';
        sup.textContent = String(numberOf[eid]);
        bodyEl.appendChild(sup);
      }
    } else if (s.italic) {
      var em = document.createElement('em');
      em.textContent = s.text;
      bodyEl.appendChild(em);
    } else {
      bodyEl.appendChild(document.createTextNode(s.text));
    }
  }
  root.appendChild(bodyEl);

  // Evidence block: cited (appearance order) then uncited (attachment order).
  // No visible evidence -> no block.
  if (visible.length) {
    var ordered = [];
    var oi;
    for (oi = 0; oi < order.length; oi = oi + 1) {
      var found = findById(visible, order[oi]);
      if (found) { ordered.push(found); }
    }
    for (oi = 0; oi < visible.length; oi = oi + 1) {
      if (!numberOf[visible[oi].id]) { ordered.push(visible[oi]); }
    }
    var block = document.createElement('ol');
    block.className = 'subtheory-readonly-evidence';
    var bi;
    for (bi = 0; bi < ordered.length; bi = bi + 1) {
      var el = ordered[bi];
      var li = document.createElement('li');
      li.className = 'subtheory-readonly-evidence-item';
      var cl = document.createElement('div');
      cl.className = 'subtheory-readonly-cite-line';
      cl.textContent = citeLine(el);
      li.appendChild(cl);
      if (el.quote) {
        var q = document.createElement('blockquote');
        q.className = 'subtheory-readonly-quote';
        q.textContent = el.quote;
        li.appendChild(q);
      }
      if (el.annotation) {
        var an = document.createElement('div');
        an.className = 'subtheory-readonly-annotation';
        an.textContent = el.annotation;
        li.appendChild(an);
      }
      block.appendChild(li);
    }
    root.appendChild(block);
  }

  // See-also: linked sub-theories by header. Empty -> no block.
  var links = Array.isArray(subTheory.linkedSubTheories) ? subTheory.linkedSubTheories : [];
  if (links.length) {
    var see = document.createElement('div');
    see.className = 'subtheory-readonly-seealso';
    var li2;
    for (li2 = 0; li2 < links.length; li2 = li2 + 1) {
      var partner = state.subTheories && state.subTheories[links[li2]];
      if (!partner) { continue; }
      var row = document.createElement('div');
      row.className = 'subtheory-readonly-seealso-item';
      row.textContent = partner.header || 'Untitled sub-theory';
      see.appendChild(row);
    }
    if (see.firstChild) { root.appendChild(see); }
  }

  return root;
}

function renderSubTheoryPage(id) {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var subTheory = state.subTheories && state.subTheories[id];
  if (!subTheory) {
    var nf = document.createElement('section');
    nf.className = 'arc-detail-not-found';
    var nfMsg = document.createElement('p');
    nfMsg.textContent = 'That sub-theory could not be found.';
    var nfLink = document.createElement('a');
    nfLink.href = '#arcs';
    nfLink.textContent = 'Back to Arcs';
    nf.appendChild(nfMsg);
    nf.appendChild(nfLink);
    host.appendChild(nf);
    return;
  }

  var wrap = document.createElement('section');
  wrap.className = 'subtheory-page';

  var layout = document.createElement('div');
  layout.className = 'subtheory-layout';

  var main = document.createElement('div');
  main.className = 'subtheory-main';

  // Batch 3: eyebrow "<arc title> · sub-theory" (mockup). Fail-soft to a
  // generic label when the parent arc can't be resolved. (Register
  // PUBLIC|INTELLECTUAL toggle + read view are deferred to Batch 3B --
  // the additive register model below is untouched here.)
  var stArc = (subTheory.arcId && state.arcs) ? state.arcs[subTheory.arcId] : null;
  var stEyebrow = document.createElement('p');
  stEyebrow.className = 'eyebrow';
  stEyebrow.textContent = ((stArc && stArc.title) ? stArc.title : 'Arc') + ' · sub-theory';
  main.appendChild(stEyebrow);

  // 9b-iii (entry A): a "Mark" chip sitting with the title -- a live mini render
  // of this sub's current mark that opens the symbol picker. The mini-mark
  // re-renders on each page render, so it always reflects the saved override.
  var markChip = document.createElement('button');
  markChip.type = 'button';
  markChip.className = 'st-mark-chip';
  var chipMark = document.createElement('span');
  chipMark.className = 'st-mark-chip-mark';
  var chipPal = (ls('praxis_constellation_palette', 'colorful') === 'muted') ? 'muted' : 'colorful';
  var chipHash = (typeof window.stHashIndices === 'function')
    ? window.stHashIndices(id) : { shapeIdx: 0, colorIdx: 0 };
  var chipShape = (typeof subTheory.markShape === 'number' && subTheory.markShape >= 0 && subTheory.markShape <= 15)
    ? subTheory.markShape : chipHash.shapeIdx;
  var chipColor = (typeof subTheory.markColor === 'number' && subTheory.markColor >= 0 && subTheory.markColor <= 15)
    ? subTheory.markColor : chipHash.colorIdx;
  chipMark.innerHTML = _stPickerMarkSvg(id, chipShape, chipColor, chipPal, false);
  markChip.appendChild(chipMark);
  markChip.appendChild(document.createTextNode('Mark'));
  markChip.addEventListener('click', function() { openSymbolPicker(id); });
  main.appendChild(markChip);

  // Fix (v3.81): a reachable Delete on the writing page (the sub's own surface).
  // Subordinate danger chip beside the Mark chip; on confirm, route to the
  // parent arc (R69 -- can't stay on a deleted page).
  var stDeleteBtn = document.createElement('button');
  stDeleteBtn.type = 'button';
  stDeleteBtn.className = 'st-mark-chip subtheory-delete-chip';
  stDeleteBtn.textContent = 'Delete';
  stDeleteBtn.addEventListener('click', function() {
    confirmDeleteSubTheory(id, function() {
      location.hash = subTheory.arcId ? ('arc/' + subTheory.arcId) : '#arcs';
    });
  });
  main.appendChild(stDeleteBtn);

  var headerInput = document.createElement('input');
  headerInput.type = 'text';
  headerInput.className = 'subtheory-header-input';
  headerInput.setAttribute('placeholder', 'Untitled sub-theory');
  headerInput.value = subTheory.header || '';
  headerInput.addEventListener('blur', function() {
    updateSubTheory(id, { header: headerInput.value });
  });
  main.appendChild(headerInput);

  // Batch 3B: segmented PUBLIC | INTELLECTUAL register toggle. One
  // register's textarea is visible at a time; Public is the default on
  // load. Both bodies stay in the DOM bound to their fields with the
  // blur->updateSubTheory save -- the tabs only swap visibility, so this
  // is view-state only (nothing persisted about which register shows).
  // Replaces the prior additive model (always-on Public + a button that
  // revealed Intellectual); the Intellectual tab now reveals its textarea
  // on demand even when empty.
  var regToggle = document.createElement('div');
  regToggle.className = 'subtheory-register-toggle';

  var publicBody = document.createElement('textarea');
  publicBody.className = 'notebook-editor-body subtheory-register-body';
  publicBody.setAttribute('placeholder', 'Write the public register…');
  publicBody.value = subTheory.bodyPublic || '';
  publicBody.addEventListener('blur', function() {
    updateSubTheory(id, { bodyPublic: publicBody.value });
  });

  var intelBody = document.createElement('textarea');
  intelBody.className = 'notebook-editor-body subtheory-register-body';
  intelBody.setAttribute('placeholder', 'Write the intellectual register…');
  intelBody.value = subTheory.bodyIntellectual || '';
  intelBody.addEventListener('blur', function() {
    updateSubTheory(id, { bodyIntellectual: intelBody.value });
  });

  // 10.5.2: Cite-from-the-rail. Track which register body last held focus
  // so the rail's Cite action can insert *Title* at that caret; a surface
  // never focused falls back to appending at the end of the visible
  // register. The insert writes the textarea value directly and focuses
  // the target -- the blur-save contract is untouched (the eventual blur
  // persists the new text) -- then repaints the citation previews so the
  // dot appears without waiting for the debounce.
  var lastFocusedBody = null;
  publicBody.addEventListener('focus', function() { lastFocusedBody = publicBody; });
  intelBody.addEventListener('focus', function() { lastFocusedBody = intelBody; });
  function insertCitationAtCursor(text) {
    var target = lastFocusedBody;
    var caret;
    if (target) {
      caret = (typeof target.selectionStart === 'number')
        ? target.selectionStart : target.value.length;
      target.value = target.value.substring(0, caret) + text +
        target.value.substring(caret);
    } else {
      target = activeRegisterPublic ? publicBody : intelBody;
      target.value = target.value + text;
      caret = target.value.length - text.length;
    }
    target.focus();
    if (typeof target.setSelectionRange === 'function') {
      target.setSelectionRange(caret + text.length, caret + text.length);
    }
    refreshCitationPreviews();
  }

  var publicTab = document.createElement('button');
  publicTab.type = 'button';
  publicTab.className = 'subtheory-register-tab';
  publicTab.textContent = 'Public register';

  var intelTab = document.createElement('button');
  intelTab.type = 'button';
  intelTab.className = 'subtheory-register-tab';
  intelTab.textContent = 'Intellectual register';

  var activeRegisterPublic = true;
  var draftPreview = false;

  // 10.5.6: per-register Write | Preview toggle, a sibling pill to the right of
  // the register toggle. Write shows the textarea; Preview shows THAT register's
  // live citation preview in the editor slot (the always-stacked pane is gone).
  // Distinct from the Published toggle below, which renders the whole sub-theory
  // read-only ("what readers see").
  var wpToggle = document.createElement('div');
  wpToggle.className = 'subtheory-register-toggle subtheory-wp-toggle';
  var writeTab = document.createElement('button');
  writeTab.type = 'button';
  writeTab.className = 'subtheory-register-tab';
  writeTab.textContent = 'Write';
  var previewTab = document.createElement('button');
  previewTab.type = 'button';
  previewTab.className = 'subtheory-register-tab';
  previewTab.textContent = 'Preview';
  wpToggle.appendChild(writeTab);
  wpToggle.appendChild(previewTab);

  // Single source of truth for the editor's visible surface, given the active
  // register and the Write/Preview state. Textareas show only in Write; the
  // matching preview pane shows only in Preview; tab actives reflect both axes.
  function applyEditorView() {
    var pub = activeRegisterPublic;
    publicBody.style.display = (!draftPreview && pub) ? '' : 'none';
    intelBody.style.display = (!draftPreview && !pub) ? '' : 'none';
    if (publicPreview) { publicPreview.style.display = (draftPreview && pub) ? '' : 'none'; }
    if (intelPreview) { intelPreview.style.display = (draftPreview && !pub) ? '' : 'none'; }
    publicTab.className = 'subtheory-register-tab' +
      (pub ? ' subtheory-register-tab-active' : '');
    intelTab.className = 'subtheory-register-tab' +
      (pub ? '' : ' subtheory-register-tab-active');
    writeTab.className = 'subtheory-register-tab' +
      (!draftPreview ? ' subtheory-register-tab-active' : '');
    previewTab.className = 'subtheory-register-tab' +
      (draftPreview ? ' subtheory-register-tab-active' : '');
  }
  function showRegister(showPublic) {
    activeRegisterPublic = showPublic;
    applyEditorView();
  }
  function setDraftPreview(on) {
    draftPreview = on;
    applyEditorView();
  }
  publicTab.addEventListener('click', function() { showRegister(true); });
  intelTab.addEventListener('click', function() { showRegister(false); });
  writeTab.addEventListener('click', function() { setDraftPreview(false); });
  previewTab.addEventListener('click', function() { setDraftPreview(true); });

  regToggle.appendChild(publicTab);
  regToggle.appendChild(intelTab);

  main.appendChild(publicBody);
  main.appendChild(intelBody);

  // ===== 10.2 citation preview (Option A), slice 2: panes + parser + dots =====
  // A read-only pane under each register mirrors that register's prose with
  // *asterisk* italics resolved against attached evidence (parseCitations):
  // matched book/external titles get a .subtheory-cite underline-dot span;
  // unmatched italics render as plain <em>. Only book/external titles (and a
  // titled entry) contribute match titles -- untitled marginalia/journal do
  // not (honors "only book titles" linking). Panes sync on input (debounced)
  // and on evidence change (via refreshAttached). The hover card is slice 2b.
  var publicPreview = document.createElement('div');
  publicPreview.className = 'subtheory-cite-preview';
  var intelPreview = document.createElement('div');
  intelPreview.className = 'subtheory-cite-preview';
  main.appendChild(publicPreview);
  main.appendChild(intelPreview);

  // 10.4 SLICE 2: Preview toggle -- swap the editor for the PUBLISHED read-only
  // render ("what readers see": private evidence excluded, superscript cites)
  // and back. 10.5.6 upgrades this to the polished Write|Preview tabs.
  var previewHost = document.createElement('div');
  previewHost.className = 'subtheory-preview-host';
  previewHost.style.display = 'none';
  main.appendChild(previewHost);

  var previewBtn = document.createElement('button');
  previewBtn.type = 'button';
  previewBtn.className = 'subtheory-preview-toggle';
  previewBtn.textContent = 'Published';
  var previewing = false;
  function setPreview(on) {
    previewing = on;
    headerInput.style.display = on ? 'none' : '';
    regToggle.style.display = on ? 'none' : '';
    wpToggle.style.display = on ? 'none' : '';
    if (on) {
      publicBody.style.display = 'none';
      intelBody.style.display = 'none';
      publicPreview.style.display = 'none';
      intelPreview.style.display = 'none';
      previewHost.innerHTML = '';
      previewHost.appendChild(
        renderSubTheoryReadOnly(state.subTheories[id], 'published'));
      previewHost.style.display = '';
      previewBtn.textContent = 'Edit';
    } else {
      previewHost.style.display = 'none';
      applyEditorView();
      previewBtn.textContent = 'Published';
    }
  }
  previewBtn.addEventListener('click', function() { setPreview(!previewing); });

  // 10.5.6: register pill + Write|Preview toggle + Published toggle on one row.
  var togglesRow = document.createElement('div');
  togglesRow.className = 'subtheory-toggles-row';
  togglesRow.appendChild(regToggle);
  togglesRow.appendChild(wpToggle);
  togglesRow.appendChild(previewBtn);
  main.insertBefore(togglesRow, publicBody);

  // Bare match-title per evidence item: book.title / external title / a
  // titled entry; untitled entries return '' (skipped by the matcher).
  function citationMatchTitle(el) {
    if (el.kind === 'book') {
      var bk = state.books && state.books[el.refId];
      return (bk && bk.title) ? bk.title : '';
    }
    if (el.kind === 'entry') {
      var en = state.notebookEntries && state.notebookEntries[el.refId];
      return (en && en.title) ? en.title : '';
    }
    var ext = el.external || {};
    return ext.title || '';
  }

  // Live evidence -> the matcher's title list [{id,title}]. Read fresh each
  // call so attach/detach/rename reflect immediately.
  function buildCitationTitles() {
    var rec = state.subTheories[id];
    var ev = (rec && Array.isArray(rec.evidence)) ? rec.evidence : [];
    var titles = [];
    var k;
    for (k = 0; k < ev.length; k = k + 1) {
      var el = ev[k];
      if (!el || !el.id) { continue; }
      var mt = citationMatchTitle(el);
      if (mt) { titles.push({ id: el.id, title: mt }); }
    }
    return titles;
  }

  // 10.2 slice 2b: per-id info (display label + quote) for the hover card.
  function buildCitationInfo() {
    var rec = state.subTheories[id];
    var ev = (rec && Array.isArray(rec.evidence)) ? rec.evidence : [];
    var info = {};
    var k;
    for (k = 0; k < ev.length; k = k + 1) {
      var el = ev[k];
      if (!el || !el.id) { continue; }
      info[el.id] = {
        label: evidenceLabel(el),
        quote: (typeof el.quote === 'string') ? el.quote : ''
      };
    }
    return info;
  }

  // Slice 2b: shared hover card -- the house .arc-tooltip, one element on
  // <body>, positioned in page coords to the hovered span (pointer-events:none).
  var citeTip = null;
  var citeTapTimer = null;
  // Shared positioner: place a body-mounted element just below a span, in
  // page coords, clamped to viewport width. Used by the 2b hover card AND
  // the slice-3 chooser (one positioning implementation, not two).
  function positionToSpan(el, spanEl) {
    var sr = spanEl.getBoundingClientRect();
    var px = window.pageXOffset || 0;
    var py = window.pageYOffset || 0;
    var left = sr.left + px;
    var maxLeft = px + document.documentElement.clientWidth - el.offsetWidth - 8;
    if (left > maxLeft) { left = maxLeft; }
    if (left < px + 8) { left = px + 8; }
    el.style.left = left + 'px';
    el.style.top = (sr.bottom + py + 6) + 'px';
  }
  function showCiteTip(spanEl, lines) {
    if (!citeTip) {
      citeTip = document.createElement('div');
      citeTip.className = 'arc-tooltip';
      document.body.appendChild(citeTip);
    }
    citeTip.textContent = '';
    var li;
    for (li = 0; li < lines.length; li = li + 1) {
      if (!lines[li] || !lines[li].text) { continue; }
      var ln = document.createElement('div');
      ln.className = lines[li].cls;
      ln.textContent = lines[li].text;
      citeTip.appendChild(ln);
    }
    citeTip.classList.add('arc-tooltip--visible');
    positionToSpan(citeTip, spanEl);
  }
  function hideCiteTip() {
    if (citeTip) { citeTip.classList.remove('arc-tooltip--visible'); }
  }
  function citeLines(infoItem) {
    var lines = [{ cls: 'arc-tooltip-title', text: infoItem.label }];
    if (infoItem.quote) {
      lines.push({ cls: 'arc-tooltip-meta', text: '“' + infoItem.quote + '”' });
    }
    return lines;
  }
  function bindCiteHover(span, infoItem) {
    if (!infoItem) { return; }
    span.addEventListener('mouseenter', function() {
      showCiteTip(span, citeLines(infoItem));
    });
    span.addEventListener('mouseleave', hideCiteTip);
    // 10.5.5: touch has no hover -- a tap shows the same card, auto-dismissed
    // after a few seconds (tapping another citation just repositions it). The
    // long-press chooser on ambiguous spans is unaffected.
    span.addEventListener('click', function(ev) {
      ev.preventDefault();
      showCiteTip(span, citeLines(infoItem));
      if (citeTapTimer) { clearTimeout(citeTapTimer); }
      citeTapTimer = setTimeout(hideCiteTip, 3200);
    });
  }

  // ===== 10.2 slice 3 + 10.5.7: disambiguation chooser (persisted pins) =====
  // An ambiguous citation (>1 candidate) can be pinned to one source via
  // right-click (desktop) or long-press (touch). The pin is keyed by the
  // lowercased phrase. 10.5.7: citePins references the sub-theory record's
  // persisted citationPins map, so a choice survives reload and routes the
  // read-only render. Membership uses the shared top-level citeIdIn.
  var citePinsRec = state.subTheories[id];
  if (citePinsRec && (!citePinsRec.citationPins ||
      typeof citePinsRec.citationPins !== 'object')) {
    citePinsRec.citationPins = {};
  }
  var citePins = citePinsRec ? citePinsRec.citationPins : {};
  var citeChooser = null;
  function closeCiteChooser() {
    if (citeChooser && citeChooser.parentNode) {
      citeChooser.parentNode.removeChild(citeChooser);
    }
    citeChooser = null;
    document.removeEventListener('click', onCiteChooserOutside);
    document.removeEventListener('keydown', onCiteChooserKey);
  }
  function onCiteChooserOutside(ev) {
    if (citeChooser && !citeChooser.contains(ev.target)) { closeCiteChooser(); }
  }
  function onCiteChooserKey(ev) {
    if (ev.keyCode === 27) { closeCiteChooser(); }
  }
  function appendCiteChooserRow(panel, cid, phraseLower, info) {
    var row = document.createElement('a');
    row.href = '#';
    row.className = 'arc-picker-row subtheory-picker-row';
    row.textContent = (info && info[cid]) ? info[cid].label : 'Source';
    row.addEventListener('click', function(ev) {
      ev.preventDefault();
      // 10.5.7: citePins references the record's citationPins; persist the
      // choice so it survives reload and routes the read-only render.
      citePins[phraseLower] = cid;
      if (typeof markSubTheoriesDirty === 'function') { markSubTheoriesDirty(); }
      saveState();
      closeCiteChooser();
      refreshCitationPreviews();
    });
    panel.appendChild(row);
  }
  function openCiteChooser(spanEl, phraseLower, ids, info) {
    closeCiteChooser();
    var panel = document.createElement('div');
    panel.className = 'arc-picker-panel subtheory-cite-chooser';
    var label = document.createElement('div');
    label.className = 'arc-picker-label';
    label.textContent = 'Which source?';
    panel.appendChild(label);
    var ci;
    for (ci = 0; ci < ids.length; ci = ci + 1) {
      appendCiteChooserRow(panel, ids[ci], phraseLower, info);
    }
    document.body.appendChild(panel);
    citeChooser = panel;
    panel.style.position = 'absolute';
    panel.style.zIndex = '60';
    positionToSpan(panel, spanEl);
    setTimeout(function() {
      document.addEventListener('click', onCiteChooserOutside);
    }, 0);
    document.addEventListener('keydown', onCiteChooserKey);
  }
  function bindCiteChooser(span, phraseLower, ids, info) {
    span.addEventListener('contextmenu', function(ev) {
      ev.preventDefault();
      openCiteChooser(span, phraseLower, ids, info);
    });
    var lpTimer = null;
    span.addEventListener('touchstart', function() {
      lpTimer = setTimeout(function() {
        openCiteChooser(span, phraseLower, ids, info);
      }, 500);
    });
    function cancelLongPress() {
      if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
    }
    span.addEventListener('touchend', cancelLongPress);
    span.addEventListener('touchmove', cancelLongPress);
  }

  // ===== 10.5.3: citation autocomplete =====
  // Typing '*' in a register body opens a small picker of attached evidence
  // titles; choosing one writes plain '<Title>*' at the caret, completing the
  // '*Title*' the writer just started. Plain text only -- no rendering change,
  // blur-save contract untouched. Mounts/dismisses like the chooser and
  // positions via the shared positionToSpan, anchored to the active textarea.
  var citeAutocomplete = null;
  function closeAutocomplete() {
    if (citeAutocomplete && citeAutocomplete.parentNode) {
      citeAutocomplete.parentNode.removeChild(citeAutocomplete);
    }
    citeAutocomplete = null;
    document.removeEventListener('click', onAutocompleteOutside);
    document.removeEventListener('keydown', onAutocompleteKey);
  }
  function onAutocompleteOutside(ev) {
    if (citeAutocomplete && !citeAutocomplete.contains(ev.target)) { closeAutocomplete(); }
  }
  function onAutocompleteKey(ev) {
    if (ev.keyCode === 27) { closeAutocomplete(); }
  }
  function appendAutocompleteRow(panel, title) {
    var row = document.createElement('a');
    row.href = '#';
    row.className = 'arc-picker-row subtheory-picker-row';
    row.textContent = title;
    row.addEventListener('click', function(ev) {
      ev.preventDefault();
      closeAutocomplete();
      insertCitationAtCursor(title + '*');
    });
    panel.appendChild(row);
  }
  function openAutocomplete(body) {
    closeAutocomplete();
    var titles = buildCitationTitles();
    var seen = {};
    var panel = document.createElement('div');
    panel.className = 'arc-picker-panel subtheory-cite-autocomplete';
    var label = document.createElement('div');
    label.className = 'arc-picker-label';
    label.textContent = 'Cite a source';
    panel.appendChild(label);
    var ti, n = 0;
    for (ti = 0; ti < titles.length; ti = ti + 1) {
      var t = titles[ti].title;
      var key = t.toLowerCase();
      if (seen[key]) { continue; }
      seen[key] = true;
      appendAutocompleteRow(panel, t);
      n = n + 1;
    }
    if (n === 0) { return; }
    document.body.appendChild(panel);
    citeAutocomplete = panel;
    panel.style.position = 'absolute';
    panel.style.zIndex = '60';
    positionToSpan(panel, body);
    setTimeout(function() {
      document.addEventListener('click', onAutocompleteOutside);
    }, 0);
    document.addEventListener('keydown', onAutocompleteKey);
  }
  function maybeAutocomplete(body) {
    var caret = (typeof body.selectionStart === 'number')
      ? body.selectionStart : body.value.length;
    if (caret > 0 && body.value.charAt(caret - 1) === '*') {
      openAutocomplete(body);
    } else if (citeAutocomplete) {
      closeAutocomplete();
    }
  }

  // Paint one pane from parsed segments. textContent/createElement only --
  // never innerHTML with body text. A citation span resolves to one source
  // (ids[0], or a session pin among candidates); >1 unpinned candidate stays
  // .subtheory-cite-ambiguous and carries the slice-3 right-click/long-press
  // chooser. Plain italics render as <em>.
  function renderCitationPreview(paneEl, bodyText, titles, info) {
    paneEl.textContent = '';
    var segs = parseCitations(bodyText, titles);
    var hasCitation = false;
    var si;
    for (si = 0; si < segs.length; si = si + 1) {
      var s = segs[si];
      if (s.ids && s.ids.length) {
        hasCitation = true;
        var span = document.createElement('span');
        var effId = s.ids[0];
        var ambiguous = s.ids.length > 1;
        if (ambiguous) {
          var pinned = citePins[s.text.toLowerCase()];
          if (pinned && citeIdIn(s.ids, pinned)) {
            effId = pinned;
            ambiguous = false;
          }
        }
        span.className = 'subtheory-cite' +
          (ambiguous ? ' subtheory-cite-ambiguous' : '');
        span.textContent = s.text;
        if (info) { bindCiteHover(span, info[effId]); }
        if (ambiguous) {
          bindCiteChooser(span, s.text.toLowerCase(), s.ids, info);
        }
        paneEl.appendChild(span);
      } else if (s.italic) {
        var em = document.createElement('em');
        em.textContent = s.text;
        paneEl.appendChild(em);
      } else {
        paneEl.appendChild(document.createTextNode(s.text));
      }
    }
    // 10.5.4: coach line — teach the asterisk convention while the pane
    // carries no resolved citation; it disappears the moment one exists.
    if (!hasCitation) {
      var coach = document.createElement('p');
      coach.className = 'subtheory-cite-coach';
      coach.textContent = 'Wrap a source title in *asterisks* to cite it.';
      paneEl.appendChild(coach);
    }
  }

  function refreshCitationPreviews() {
    var titles = buildCitationTitles();
    var info = buildCitationInfo();
    renderCitationPreview(publicPreview, publicBody.value, titles, info);
    renderCitationPreview(intelPreview, intelBody.value, titles, info);
  }

  var citeDebounce = null;
  function onCiteBodyInput() {
    if (citeDebounce) { clearTimeout(citeDebounce); }
    citeDebounce = setTimeout(refreshCitationPreviews, 200);
  }
  publicBody.addEventListener('input', onCiteBodyInput);
  intelBody.addEventListener('input', onCiteBodyInput);
  publicBody.addEventListener('input', function() { maybeAutocomplete(publicBody); });
  intelBody.addEventListener('input', function() { maybeAutocomplete(intelBody); });
  refreshCitationPreviews();

  // Public default on load.
  showRegister(true);

  // ===== Evidence rail (Checkpoint C) =====
  var rail = document.createElement('aside');
  rail.className = 'subtheory-rail';
  rail.id = 'subtheory-rail';

  // Backdrop sibling for the mobile bottom sheet. Default-hidden by CSS;
  // toggled in lockstep with the rail's open class.
  var backdrop = document.createElement('div');
  backdrop.className = 'subtheory-rail-backdrop';

  // Mobile open/close, mirroring the shelf filter-panel pattern: the
  // rail is the desktop second column; at <=720px it hides and reopens
  // as a fixed bottom sheet toggled by the Evidence button, with a
  // backdrop and an Escape / close-x / backdrop-click dismiss. The
  // Escape handler is parked at module scope so this render can purge a
  // stale one bound by a previous render.
  if (subTheoryRailEscapeHandler) {
    document.removeEventListener('keydown', subTheoryRailEscapeHandler);
    subTheoryRailEscapeHandler = null;
  }
  function openRail() {
    rail.classList.add('subtheory-rail-mobile-open');
    backdrop.classList.add('subtheory-rail-backdrop-open');
    if (subTheoryRailEscapeHandler) {
      document.removeEventListener('keydown', subTheoryRailEscapeHandler);
    }
    subTheoryRailEscapeHandler = function(ev) {
      if (ev.key === 'Escape' || ev.key === 'Esc') {
        dismissRail();
      }
    };
    document.addEventListener('keydown', subTheoryRailEscapeHandler);
  }
  function dismissRail() {
    rail.classList.remove('subtheory-rail-mobile-open');
    backdrop.classList.remove('subtheory-rail-backdrop-open');
    if (subTheoryRailEscapeHandler) {
      document.removeEventListener('keydown', subTheoryRailEscapeHandler);
      subTheoryRailEscapeHandler = null;
    }
  }
  backdrop.addEventListener('click', dismissRail);

  var railToggle = document.createElement('button');
  railToggle.type = 'button';
  railToggle.className = 'subtheory-rail-toggle';
  railToggle.textContent = 'Evidence';
  railToggle.addEventListener('click', openRail);

  // Close-x first in source order so panel-open tab focus lands on the
  // dismiss path. Mobile-only via CSS.
  var railClose = document.createElement('button');
  railClose.type = 'button';
  railClose.className = 'subtheory-rail-close';
  railClose.setAttribute('aria-label', 'Close evidence');
  railClose.textContent = '×';
  railClose.addEventListener('click', dismissRail);
  rail.appendChild(railClose);

  var railTitle = document.createElement('h2');
  railTitle.className = 'subtheory-rail-title';
  railTitle.textContent = 'Evidence';
  rail.appendChild(railTitle);

  var arc = state.arcs && state.arcs[subTheory.arcId];

  // Resolve a display label for one attached evidence element. Book and
  // entry labels are read live off state (so a renamed book updates on
  // next render); external reads the stored {title, author} pair.
  function evidenceLabel(el) {
    if (el.kind === 'book') {
      var bk = state.books && state.books[el.refId];
      if (bk) {
        return bk.author ? (bk.title + ' — ' + bk.author) : bk.title;
      }
      return 'Book';
    }
    if (el.kind === 'entry') {
      var en = state.notebookEntries && state.notebookEntries[el.refId];
      if (en) {
        if (en.title) { return en.title; }
        if (en.body) {
          return en.body.length > 60
            ? en.body.substring(0, 57) + '...' : en.body;
        }
      }
      return 'Note';
    }
    var ext = el.external || {};
    if (ext.title && ext.author) { return ext.title + ' — ' + ext.author; }
    if (ext.title) { return ext.title; }
    return 'External source';
  }

  function buildAttachedRow(el) {
    var row = document.createElement('div');
    row.className = 'subtheory-attached-row';
    // S6: hollow teal ring = gathered (every attached element is gathered;
    // the filled "incorporated" state has no data until Stage 10's prose
    // anchors, so no filled variant renders). Mockup .rail-it .ring.
    var ring = document.createElement('span');
    ring.className = 'subtheory-attached-ring';
    ring.setAttribute('aria-hidden', 'true');
    row.appendChild(ring);
    var body = document.createElement('div');
    body.className = 'subtheory-attached-body';
    var label = document.createElement('div');
    label.className = 'subtheory-attached-label';
    label.textContent = evidenceLabel(el);
    body.appendChild(label);
    // 10.5.2: Cite — inserts *Title* at the caret of the last-focused
    // register (insertCitationAtCursor owns the fallback). Only rendered
    // when the element HAS a citable title (citationMatchTitle returns ''
    // for an untitled marginalia/journal entry -- nothing to italicize).
    var citeTitle = citationMatchTitle(el);
    if (citeTitle) {
      var citeBtn = document.createElement('a');
      citeBtn.href = '#';
      citeBtn.className = 'subtheory-attached-cite';
      citeBtn.textContent = 'Cite';
      citeBtn.addEventListener('click', function(ev) {
        ev.preventDefault();
        insertCitationAtCursor('*' + citeTitle + '*');
      });
      body.appendChild(citeBtn);
    }
    // 10.4: a private (or missing) journal entry is excluded when published.
    // Tag the row here in the editing rail so the owner sees it at manage time
    // (the read-only published render simply drops it, with no marker).
    if (el.kind === 'entry') {
      var ren = state.notebookEntries && state.notebookEntries[el.refId];
      if (!ren || ren.isPrivate === true) {
        var ptag = document.createElement('span');
        ptag.className = 'subtheory-attached-private-tag';
        ptag.textContent = 'private — excluded when published';
        body.appendChild(ptag);
      }
    }
    if (el.quote) {
      var q = document.createElement('p');
      q.className = 'subtheory-attached-quote';
      q.textContent = '“' + el.quote + '”';
      body.appendChild(q);
    }
    if (el.annotation) {
      var a = document.createElement('p');
      a.className = 'subtheory-attached-annotation';
      a.textContent = el.annotation;
      body.appendChild(a);
    }
    row.appendChild(body);
    return row;
  }

  // Attached-evidence list owns its own container so attaching an item
  // repopulates only this list -- a full renderSubTheoryPage re-render
  // would drop un-blurred prose-column text. refreshAttached re-reads
  // the live evidence[] each call.
  var attachedSection = document.createElement('div');
  attachedSection.className = 'subtheory-rail-section';
  var attachedLabel = document.createElement('h3');
  attachedLabel.className = 'book-detail-tradition-label';
  attachedLabel.textContent = 'Attached';
  attachedSection.appendChild(attachedLabel);
  var attachedList = document.createElement('div');
  attachedList.className = 'subtheory-attached-list';
  attachedSection.appendChild(attachedList);

  function refreshAttached() {
    attachedList.innerHTML = '';
    // 10.2: evidence changed -> re-resolve citations in both preview panes.
    refreshCitationPreviews();
    var rec = state.subTheories[id];
    var ev = (rec && Array.isArray(rec.evidence)) ? rec.evidence : [];
    if (ev.length === 0) {
      var none = document.createElement('p');
      none.className = 'subtheory-attached-empty';
      none.textContent = 'No evidence attached yet.';
      attachedList.appendChild(none);
      return;
    }
    var ei;
    for (ei = 0; ei < ev.length; ei++) {
      attachedList.appendChild(buildAttachedRow(ev[ei]));
    }
  }

  // Inline attach editor (mirrors openEditor's structure): optional
  // quote + annotation, Attach / Cancel. onSave receives the two raw
  // string values; both are optional per addEvidence.
  function buildInlineEvidenceEditor(onSave, onCancel) {
    var editor = document.createElement('div');
    editor.className = 'notebook-editor subtheory-attach-editor';
    var quoteInput = document.createElement('textarea');
    quoteInput.className = 'notebook-editor-body';
    quoteInput.setAttribute('placeholder', 'Quote (optional)');
    quoteInput.rows = 2;
    var annInput = document.createElement('textarea');
    annInput.className = 'notebook-editor-body';
    annInput.setAttribute('placeholder', 'Annotation (optional)');
    annInput.rows = 2;
    var actions = document.createElement('div');
    actions.className = 'notebook-editor-actions';
    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'notebook-editor-save';
    saveBtn.textContent = 'Attach';
    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'notebook-editor-cancel';
    cancelBtn.textContent = 'Cancel';
    saveBtn.addEventListener('click', function() {
      onSave(quoteInput.value, annInput.value);
    });
    cancelBtn.addEventListener('click', function() {
      onCancel();
    });
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    editor.appendChild(quoteInput);
    editor.appendChild(annInput);
    editor.appendChild(actions);
    return editor;
  }

  // One source row (a book or a visible notebook entry). The attach
  // button toggles an inline editor; saving routes through addEvidence
  // with this row's kind + refId, then refreshes the attached list. The
  // kind/refId close over buildSourceRow's params -- fresh per call, so
  // no var-loop closure trap.
  function buildSourceRow(kind, refId, labelText) {
    var row = document.createElement('div');
    row.className = 'subtheory-source-row';
    var head = document.createElement('div');
    head.className = 'subtheory-source-head';
    var label = document.createElement('span');
    label.className = 'subtheory-source-label';
    label.textContent = labelText;
    head.appendChild(label);
    var attachBtn = document.createElement('button');
    attachBtn.type = 'button';
    attachBtn.className = 'subtheory-source-attach';
    attachBtn.textContent = 'Attach as evidence';
    head.appendChild(attachBtn);
    row.appendChild(head);
    var editorHost = document.createElement('div');
    editorHost.className = 'subtheory-source-editor-host';
    row.appendChild(editorHost);
    attachBtn.addEventListener('click', function() {
      if (editorHost.firstChild) {
        editorHost.innerHTML = '';
        return;
      }
      editorHost.appendChild(buildInlineEvidenceEditor(
        function(quote, annotation) {
          addEvidence(id, { kind: kind, refId: refId,
            quote: quote, annotation: annotation });
          editorHost.innerHTML = '';
          refreshAttached();
        },
        function() {
          editorHost.innerHTML = '';
        }));
    });
    return row;
  }

  // Source list: books from arc.bookIds + visible entries from
  // arc.entryIds. Private entries are skipped (principle #5 -- private
  // writing never becomes citable substrate). Scrollable via CSS.
  var sourceSection = document.createElement('div');
  sourceSection.className = 'subtheory-rail-section';
  var sourceLabel = document.createElement('h3');
  sourceLabel.className = 'book-detail-tradition-label';
  sourceLabel.textContent = 'From this arc';
  sourceSection.appendChild(sourceLabel);
  var sourceList = document.createElement('div');
  sourceList.className = 'subtheory-source-list';
  sourceSection.appendChild(sourceList);

  var bookMembers = (arc && Array.isArray(arc.bookIds)) ? arc.bookIds : [];
  var bmi;
  for (bmi = 0; bmi < bookMembers.length; bmi++) {
    var bm = bookMembers[bmi];
    var bk = state.books && state.books[bm.id];
    if (!bk) { continue; }
    var bkLabel = bk.author ? (bk.title + ' — ' + bk.author) : bk.title;
    sourceList.appendChild(buildSourceRow('book', bm.id, bkLabel));
  }

  var entryMembers = (arc && Array.isArray(arc.entryIds)) ? arc.entryIds : [];
  var eli;
  for (eli = 0; eli < entryMembers.length; eli++) {
    var elm = entryMembers[eli];
    var en = state.notebookEntries && state.notebookEntries[elm.id];
    if (!en) { continue; }
    if (en.isPrivate === true) { continue; }
    var enLabel;
    if (en.title) {
      enLabel = en.title;
    } else if (en.body) {
      enLabel = en.body.length > 60
        ? en.body.substring(0, 57) + '...' : en.body;
    } else {
      enLabel = 'Note';
    }
    sourceList.appendChild(buildSourceRow('entry', elm.id, enLabel));
  }

  if (!sourceList.firstChild) {
    var emptySrc = document.createElement('p');
    emptySrc.className = 'subtheory-source-empty';
    emptySrc.textContent = 'No books or notes in this arc yet.';
    sourceList.appendChild(emptySrc);
  }

  // External-source affordance: a toggle revealing a {title, author,
  // quote, annotation} form. Saving routes through addEvidence with
  // kind 'external'.
  var externalSection = document.createElement('div');
  externalSection.className = 'subtheory-rail-section';
  var externalToggle = document.createElement('button');
  externalToggle.type = 'button';
  externalToggle.className = 'notebook-editor-cancel subtheory-external-toggle';
  externalToggle.textContent = 'Add external source';
  externalSection.appendChild(externalToggle);
  var externalHost = document.createElement('div');
  externalHost.className = 'subtheory-external-host';
  externalSection.appendChild(externalHost);

  function buildExternalForm() {
    var editor = document.createElement('div');
    editor.className = 'notebook-editor subtheory-external-form';
    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'notebook-editor-title-input';
    titleInput.setAttribute('placeholder', 'Title');
    var authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.className = 'notebook-editor-title-input';
    authorInput.setAttribute('placeholder', 'Author');
    var quoteInput = document.createElement('textarea');
    quoteInput.className = 'notebook-editor-body';
    quoteInput.setAttribute('placeholder', 'Quote (optional)');
    quoteInput.rows = 2;
    var annInput = document.createElement('textarea');
    annInput.className = 'notebook-editor-body';
    annInput.setAttribute('placeholder', 'Annotation (optional)');
    annInput.rows = 2;
    var actions = document.createElement('div');
    actions.className = 'notebook-editor-actions';
    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'notebook-editor-save';
    saveBtn.textContent = 'Attach';
    // 10.3: title is required. Mirror the house required-field pattern (the
    // createX inline editor): Attach stays disabled until the title trims
    // non-empty, re-evaluated on input, with a defensive guard on save.
    function externalTitleOk() {
      return titleInput.value.replace(/^\s+|\s+$/g, '').length > 0;
    }
    function refreshExternalSave() {
      saveBtn.disabled = !externalTitleOk();
    }
    titleInput.addEventListener('input', refreshExternalSave);
    refreshExternalSave();
    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'notebook-editor-cancel';
    cancelBtn.textContent = 'Cancel';
    saveBtn.addEventListener('click', function() {
      if (!externalTitleOk()) { return; }
      addEvidence(id, { kind: 'external',
        external: { title: titleInput.value, author: authorInput.value },
        quote: quoteInput.value, annotation: annInput.value });
      externalHost.innerHTML = '';
      refreshAttached();
    });
    cancelBtn.addEventListener('click', function() {
      externalHost.innerHTML = '';
    });
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    editor.appendChild(titleInput);
    editor.appendChild(authorInput);
    editor.appendChild(quoteInput);
    editor.appendChild(annInput);
    editor.appendChild(actions);
    return editor;
  }

  externalToggle.addEventListener('click', function() {
    if (externalHost.firstChild) {
      externalHost.innerHTML = '';
      return;
    }
    externalHost.appendChild(buildExternalForm());
  });

  // S6.3: default rail = attached list + a full-width disclosure button;
  // the picker collapses behind it. Disclosure is a LOCAL classList flip
  // on pickerWrap -- NO renderSubTheoryPage re-render, so un-blurred prose
  // survives (the same contract refreshAttached protects). Attaching does
  // NOT close the picker (multi-attach); refreshAttached repaints the
  // attached list. 10.5.1: label is "+ Attach evidence" (books are not the
  // only evidence), single literal via attachLabel; the external-source
  // section mounts FIRST so it reads at the same disclosure level as the
  // book list instead of buried beneath every from-this-arc row.
  var pickerWrap = document.createElement('div');
  pickerWrap.className = 'subtheory-picker-wrap';
  pickerWrap.appendChild(externalSection);
  pickerWrap.appendChild(sourceSection);

  var attachLabel = '+ Attach evidence';
  var attachBtn = document.createElement('button');
  attachBtn.type = 'button';
  attachBtn.className = 'subtheory-attach-book';
  attachBtn.textContent = attachLabel;
  attachBtn.addEventListener('click', function() {
    if (pickerWrap.classList.contains('open')) {
      pickerWrap.classList.remove('open');
      attachBtn.textContent = attachLabel;
    } else {
      pickerWrap.classList.add('open');
      attachBtn.textContent = 'Done';
    }
  });

  rail.appendChild(attachedSection);
  rail.appendChild(attachBtn);
  rail.appendChild(pickerWrap);
  refreshAttached();

  // Mobile-only Evidence toggle sits at the top of the prose column.
  main.insertBefore(railToggle, main.firstChild);

  layout.appendChild(main);
  layout.appendChild(rail);
  layout.appendChild(backdrop);
  wrap.appendChild(layout);
  host.appendChild(wrap);
}

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

// Stage 7.1A: adapter from real arc shape (state.arcs[id]) to the
// constellation renderer's expected input. Renderer contract is set
// by js/arc-constellation.js:renderArcConstellation -- top-level
// question, books array of {id, tradition, band[, noteCount]}, plus
// optional threads + yumiNoticing. Stubs threads + yumiNoticing
// empty for v1 (later stages wire them). noteCount intentionally
// omitted -- renderer defaults missing to 0, so no marginalia dots
// render until that wiring lands. Effective tradition inlines the
// override pattern (book.traditionOverride || book.tradition) used
// everywhere else in the file -- no helper exists. bookIds element
// shape is {id, addedAt} per state.js:71-72; the .id || el fallback
// is defensive against any legacy plain-string entry.
function _arcDetailBuildConstellationData(arc) {
  var books = [];
  var i, bookId, book, effectiveTradition, band;
  var bookIdsArr = (arc && arc.bookIds) ? arc.bookIds : [];
  for (i = 0; i < bookIdsArr.length; i++) {
    bookId = bookIdsArr[i].id || bookIdsArr[i];
    book = state.books && state.books[bookId];
    if (!book) { continue; }
    effectiveTradition = book.traditionOverride || book.tradition;
    band = getEngagementBand(bookId);
    books.push({
      id:        bookId,
      title:     book.title,
      author:    book.author,
      tradition: effectiveTradition,
      band:      band
    });
  }
  return {
    question:     (arc && arc.title) ? arc.title : '',
    books:        books,
    threads:      [],
    yumiNoticing: []
  };
}

// Stage 9.5: adapter from real sub-theory records (state.subTheories) to
// the sub-theory constellation renderer's DATA CONTRACT (set by
// js/arc-constellation.js:renderSubTheoryConstellation):
//   { id, question,
//     subTheories: [ { id, header, shapeKey, color, maturity /*0..1*/,
//       marks: [ {state:'gathered', kind, label, quote, annotation} ] } ],
//     edges: [], yumiNoticing: [] }
// _arcDetailBuildConstellationData (the books adapter) is left in place,
// dead, so the books-constellation is a one-line revert away.
//
// header is carried beyond the contract's original field list so the
// shape hover/tooltip has something to show (the contract omitted it).
// shapeKey/color come from _stIdentity (the renderer's fixed-pairing hash)
// so the builder is the single producer of identity; the renderer keeps
// _stIdentity only as a defensive fallback. maturity is derived here via
// _stComputeMaturity because the raw fields (bodyPublic/bodyIntellectual/
// evidence) live on state.subTheories, not in the contract; the renderer
// maps that 0..1 to luminosity. edges are [] this stage (the dormant
// linkedSubTheories->edges wiring is deferred to the linking-UI stage),
// and yumiNoticing is [] (renderer/tooltip shows "Quiet today").
function _arcDetailBuildSubTheoryData(arc) {
  var arcId = (arc && arc.id) ? arc.id : null;
  var records = [];
  var key, sub;
  if (arcId && state.subTheories) {
    for (key in state.subTheories) {
      if (!state.subTheories.hasOwnProperty(key)) { continue; }
      sub = state.subTheories[key];
      if (sub && sub.arcId === arcId) { records.push(sub); }
    }
  }
  // Stable radial slot assignment: oldest-first by createdAt, id as the
  // tie-break, so a sub-theory keeps its orbit position across renders.
  records.sort(function(a, b) {
    var ca = (a && typeof a.createdAt === 'number') ? a.createdAt : 0;
    var cb = (b && typeof b.createdAt === 'number') ? b.createdAt : 0;
    if (ca !== cb) { return ca - cb; }
    return (a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
  });
  var subTheories = [];
  var i, rec, ident;
  for (i = 0; i < records.length; i = i + 1) {
    rec = records[i];
    ident = (typeof _stIdentity === 'function')
      ? _stIdentity(rec.id)
      : { shapeKey: undefined, color: undefined };
    subTheories.push({
      id:       rec.id,
      header:   (typeof rec.header === 'string') ? rec.header : '',
      shapeKey: ident.shapeKey,
      color:    ident.color,
      maturity: _stComputeMaturity(rec),
      marks:    _stBuildMarks(rec),
      x:        (typeof rec.x === 'number') ? rec.x : null,
      y:        (typeof rec.y === 'number') ? rec.y : null,
      // 9b-ii: per-sub mark overrides ride through on the data object so the
      // renderer never reads global state. Absent today (no picker UI yet) --
      // null => the renderer falls back to the id-hash shape/color.
      markShape: (typeof rec.markShape === 'number') ? rec.markShape : null,
      markColor: (typeof rec.markColor === 'number') ? rec.markColor : null
    });
  }
  // 9.6c.4: derive resonance edges from each record's linkedSubTheories (bare
  // reciprocal id pairs). Keep only pairs where BOTH endpoints belong to this
  // arc, and dedupe the symmetric a<->b duplicate. No strength field -- the
  // renderer's bare-link branch draws these solid tan. Empty until 9.6c.4's
  // Connect path writes the first link.
  var inArc = {};
  for (i = 0; i < records.length; i = i + 1) { inArc[records[i].id] = true; }
  var edges = [];
  var seenEdge = {};
  var ei, links, lj, otherId, pairKey;
  for (ei = 0; ei < records.length; ei = ei + 1) {
    links = records[ei].linkedSubTheories;
    if (!links || !links.length) { continue; }
    for (lj = 0; lj < links.length; lj = lj + 1) {
      otherId = links[lj];
      if (!inArc[otherId]) { continue; }
      pairKey = (records[ei].id < otherId)
        ? records[ei].id + '|' + otherId
        : otherId + '|' + records[ei].id;
      if (seenEdge[pairKey]) { continue; }
      seenEdge[pairKey] = true;
      edges.push({ aId: records[ei].id, bId: otherId });
    }
  }
  // Hybrid Stage B: pass the arc's attached books through as inert field
  // squares (id only -- the renderer derives a deterministic position and
  // draws a neutral square; books are NOT draggable/connectable). Built from
  // arc.bookIds, the same source the list view reads.
  var books = [];
  var bk;
  if (arc && arc.bookIds && arc.bookIds.length) {
    for (bk = 0; bk < arc.bookIds.length; bk = bk + 1) {
      if (arc.bookIds[bk] && arc.bookIds[bk].id) {
        books.push({ id: arc.bookIds[bk].id });
      }
    }
  }
  return {
    id:           arcId,
    question:     (arc && arc.title) ? arc.title : '',
    subTheories:  subTheories,
    edges:        edges,
    books:        books,
    yumiNoticing: []
  };
}

// v1 maturity proxy (builder-side, where the raw fields live). Normalizes
// bodyPublic.length + bodyIntellectual.length + a per-evidence weight into
// [0,1]; the renderer maps this to luminosity. Final formula deferred --
// this is the single isolated derivation point, swap it here later.
function _stComputeMaturity(sub) {
  var pub = (sub && typeof sub.bodyPublic === 'string') ? sub.bodyPublic.length : 0;
  var intel = (sub && typeof sub.bodyIntellectual === 'string') ? sub.bodyIntellectual.length : 0;
  var evCount = (sub && Array.isArray(sub.evidence)) ? sub.evidence.length : 0;
  var EVIDENCE_WEIGHT = 80; // chars-equivalent per gathered evidence item
  var CAP = 1500;           // raw signal at which maturity saturates
  var raw = pub + intel + EVIDENCE_WEIGHT * evCount;
  var m = raw / CAP;
  if (m < 0) { m = 0; }
  if (m > 1) { m = 1; }
  return m;
}

// Synthesize gathered marks from a sub-theory's evidence[]. state is the
// constant 'gathered' in 9.5 (incorporation is Stage 10); label is derived
// per evidence kind via _stEvidenceLabel.
function _stBuildMarks(sub) {
  var marks = [];
  var evidence = (sub && Array.isArray(sub.evidence)) ? sub.evidence : [];
  var i, ev;
  for (i = 0; i < evidence.length; i = i + 1) {
    ev = evidence[i] || {};
    marks.push({
      state:      'gathered',
      kind:       (typeof ev.kind === 'string') ? ev.kind : '',
      // 9b-iii: carry the source id so the dot's click can channel to it
      // (book -> #book/<refId>; entry -> #notebook interim). Previously dropped.
      refId:      (typeof ev.refId === 'string') ? ev.refId : '',
      label:      _stEvidenceLabel(ev),
      quote:      (typeof ev.quote === 'string') ? ev.quote : '',
      annotation: (typeof ev.annotation === 'string') ? ev.annotation : ''
    });
  }
  return marks;
}

// Human label for one evidence element: book title for 'book', a short
// body preview for 'entry' (notebook entries have no title field), and the
// external source's title/author for 'external'. Defensive defaults so a
// dangling refId never produces a blank mark.
function _stEvidenceLabel(ev) {
  if (!ev) { return 'Evidence'; }
  if (ev.kind === 'book') {
    var book = (ev.refId && state.books) ? state.books[ev.refId] : null;
    return (book && book.title) ? book.title : 'Book';
  }
  if (ev.kind === 'entry') {
    var entry = (ev.refId && state.notebookEntries) ? state.notebookEntries[ev.refId] : null;
    return _stEntryPreview(entry);
  }
  if (ev.kind === 'external') {
    var ext = ev.external || {};
    if (ext.title) { return ext.title; }
    if (ext.author) { return ext.author; }
    return 'External source';
  }
  return 'Evidence';
}

function _stEntryPreview(entry) {
  if (!entry || typeof entry.body !== 'string') { return 'Note'; }
  var t = entry.body.replace(/\s+/g, ' ').trim();
  if (!t) { return 'Note'; }
  if (t.length > 48) { t = t.slice(0, 48) + '…'; }
  return t;
}

// Stage 9.5: interaction layer for the sub-theory constellation. Sibling
// of _arcConstellationAttachInteractions -- the book interaction layer is
// NOT mutated. svgEl is the inner <svg> the renderer filled; arc is the
// DATA object built by _arcDetailBuildSubTheoryData (subTheories carry
// header + marks). Shape click navigates to #subtheory/<id>; gathered-mark
// click surfaces that mark's evidence content (label/quote/annotation) in
// the shared .arc-tooltip; hover mirrors the book layer (shape, mark, and
// Yumi tooltips). Shapes are selected as [data-st-sub-id]:not([data-st-
// mark]) so mark groups -- which carry both attributes -- are excluded.
// Each render builds a fresh svg, so listeners + the lazily-created tooltip
// are scoped per render and cannot leak across List<->Web toggles.
function _stConstellationAttachInteractions(svgEl, arc) {
  if (!svgEl || !arc) { return; }

  var subById = {};
  var subs = (arc && arc.subTheories) ? arc.subTheories : [];
  var i;
  for (i = 0; i < subs.length; i = i + 1) { subById[subs[i].id] = subs[i]; }

  var isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  var prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var container = svgEl.parentNode;
  var tip = { el: null };

  function ensureTip() {
    if (tip.el) { return tip.el; }
    if (!container) { return null; }
    var el = document.createElement('div');
    el.className = 'arc-tooltip'
      + (prefersReducedMotion ? ' arc-tooltip--reduced-motion' : '');
    container.appendChild(el);
    tip.el = el;
    return el;
  }

  // Structured lines via textContent only -- never innerHTML with sub-theory
  // data (headers, quotes, annotations are user-entered: an XSS surface).
  function renderLines(el, lines) {
    el.textContent = '';
    var j, line;
    for (j = 0; j < lines.length; j = j + 1) {
      if (!lines[j] || !lines[j].text) { continue; }
      line = document.createElement('div');
      line.className = lines[j].cls;
      line.textContent = lines[j].text;
      el.appendChild(line);
    }
  }

  function positionTip(el, evt) {
    if (!container) { return; }
    var rect = container.getBoundingClientRect();
    var x = evt.clientX - rect.left + 12;
    var y = evt.clientY - rect.top + 12;
    var tw = el.offsetWidth;
    var th = el.offsetHeight;
    if (x + tw + 12 > container.clientWidth) { x = evt.clientX - rect.left - tw - 12; }
    if (y + th + 12 > container.clientHeight) { y = evt.clientY - rect.top - th - 12; }
    if (x < 0) { x = 0; }
    if (y < 0) { y = 0; }
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function hasText(lines) {
    var k;
    for (k = 0; k < lines.length; k = k + 1) {
      if (lines[k] && lines[k].text) { return true; }
    }
    return false;
  }

  function showTip(lines, evt) {
    if (!hasText(lines)) { return; }
    var el = ensureTip();
    if (!el) { return; }
    renderLines(el, lines);
    el.classList.add('arc-tooltip--visible');
    positionTip(el, evt);
  }

  function hideTip() {
    if (tip.el) { tip.el.classList.remove('arc-tooltip--visible'); }
  }

  function shapeLines(el) {
    var sub = subById[el.getAttribute('data-st-sub-id')];
    var lines = [];
    if (!sub) { return lines; }
    lines.push({ cls: 'arc-tooltip-title', text: sub.header || 'Untitled sub-theory' });
    lines.push({ cls: 'arc-tooltip-affordance', text: 'Open sub-theory' });
    return lines;
  }

  function markLines(el) {
    var sub = subById[el.getAttribute('data-st-sub-id')];
    var idx = parseInt(el.getAttribute('data-st-mark-index'), 10);
    var lines = [];
    if (!sub || !sub.marks || isNaN(idx) || !sub.marks[idx]) { return lines; }
    var mark = sub.marks[idx];
    lines.push({ cls: 'arc-tooltip-title', text: mark.label || 'Evidence' });
    if (mark.quote) { lines.push({ cls: 'arc-tooltip-meta', text: '“' + mark.quote + '”' }); }
    if (mark.annotation) { lines.push({ cls: 'arc-tooltip-meta', text: mark.annotation }); }
    return lines;
  }

  function yumiLines() {
    var noticing = (arc && arc.yumiNoticing) ? arc.yumiNoticing : [];
    if (!noticing.length) {
      return [{ cls: 'arc-tooltip-meta', text: 'Quiet today.' }];
    }
    var lines = [];
    var k;
    for (k = 0; k < noticing.length; k = k + 1) {
      lines.push({ cls: 'arc-tooltip-meta', text: String(noticing[k]) });
    }
    return lines;
  }

  function bindShapeClick(el) {
    el.addEventListener('click', function() {
      var id = el.getAttribute('data-st-sub-id');
      if (id) { location.hash = 'subtheory/' + id; }
    });
  }

  function bindMarkClick(el) {
    el.addEventListener('click', function(evt) {
      // 9b-iii: the dot now lives INSIDE the shape group, so stop the click
      // bubbling to the shape's #subtheory navigation. Channel by kind: book
      // evidence -> the book page; entry -> the notebook (interim, ruling 40).
      // No routable target -> fall back to the evidence tooltip.
      evt.stopPropagation();
      var kind = el.getAttribute('data-st-kind');
      var ref = el.getAttribute('data-st-ref');
      if (kind === 'book' && ref) { location.hash = 'book/' + ref; return; }
      if (kind === 'entry') { location.hash = 'notebook'; return; }
      showTip(markLines(el), evt);
    });
  }

  // 9b-iii: arc-level book squares (data-st-book-id) -> the book page. Inert
  // until now; a plain click handler (squares never start a drag, so no
  // drag-guard is needed).
  function bindBookSquareClick(el) {
    el.addEventListener('click', function() {
      var id = el.getAttribute('data-st-book-id');
      if (id) { location.hash = 'book/' + id; }
    });
  }

  function bindHover(el, linesFn) {
    el.addEventListener('mouseenter', function(evt) {
      showTip(linesFn(el), evt);
    });
    el.addEventListener('mousemove', function(evt) {
      if (tip.el && tip.el.classList.contains('arc-tooltip--visible')) {
        positionTip(tip.el, evt);
      }
    });
    el.addEventListener('mouseleave', function() {
      hideTip();
    });
  }

  var shapeEls = svgEl.querySelectorAll('[data-st-sub-id]:not([data-st-mark])');
  var markEls = svgEl.querySelectorAll('[data-st-mark]');
  var yumiEls = svgEl.querySelectorAll('[data-st-yumi]');
  var bookSquareEls = svgEl.querySelectorAll('[data-st-book-id]');

  // Click: shapes navigate, marks channel to their source, book squares open
  // the book page. Bound on every device (touch taps + desktop clicks;
  // keyboard re-fires via synthetic click below).
  for (i = 0; i < shapeEls.length; i = i + 1) { bindShapeClick(shapeEls[i]); }
  for (i = 0; i < markEls.length; i = i + 1) { bindMarkClick(markEls[i]); }
  for (i = 0; i < bookSquareEls.length; i = i + 1) { bindBookSquareClick(bookSquareEls[i]); }

  // Hover tooltips: desktop only (mirrors the book layer's touch guard).
  // 9.6c.3: the SHAPE hover is superseded by the richer hover card in
  // attachSubTheoryDrag (which adds maturity + gathered count and suppresses
  // during a drag), so its binding is intentionally dropped here. The
  // evidence-mark and Yumi tooltips stay -- the card does not cover them.
  // (shapeLines is left defined but now unused -- harmless; not removed to
  // keep this diff to the single binding line.)
  if (!isTouch) {
    for (i = 0; i < markEls.length; i = i + 1) { bindHover(markEls[i], markLines); }
    for (i = 0; i < yumiEls.length; i = i + 1) { bindHover(yumiEls[i], yumiLines); }
  }

  // Keyboard parity: reuse the book layer's _arcMakeFocusable (generic --
  // sets tabindex/role/aria-label and re-fires our click via synthetic
  // click). Not a mutation of the book interaction path.
  for (i = 0; i < shapeEls.length; i = i + 1) {
    var s = subById[shapeEls[i].getAttribute('data-st-sub-id')];
    _arcMakeFocusable(shapeEls[i], (s && s.header) ? s.header : 'Sub-theory');
  }
  for (i = 0; i < markEls.length; i = i + 1) {
    _arcMakeFocusable(markEls[i], 'Evidence mark');
  }
}

// Stage 8.1B: read-only interaction layer over the rendered
// constellation. svgEl is the inner <svg> the renderer filled; arc is
// the constellation DATA object built by _arcDetailBuildConstellationData
// (fields: question, books[{id,title,author,band}], threads,
// yumiNoticing) -- NOT the raw state.arcs record. Pure reads, no
// mutation. Touch devices (detected once via matchMedia) skip the whole
// hover/tooltip layer and get tap-to-navigate only. Hover devices get
// tooltips + click + (Stage 8.1C) keyboard. Each renderArcDetail pass
// builds a fresh container + svg, so listeners and the lazily-created
// tooltip are scoped per render -- toggling List<->Web cannot leak
// duplicate or stuck tooltips.
function _arcConstellationAttachInteractions(svgEl, arc) {
  if (!svgEl || !arc) { return; }

  var isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouch) {
    // Touch: no hover layer. Click + keyboard still bind so taps and
    // (Stage 8.1C) Enter/Space navigate.
    _arcAttachClickHandlers(svgEl, arc);
    _arcAttachKeyboardHandlers(svgEl, arc);
    return;
  }

  var prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  _arcAttachClickHandlers(svgEl, arc);
  _arcAttachTooltipHandlers(svgEl, arc, prefersReducedMotion);
  _arcAttachKeyboardHandlers(svgEl, arc);
}

// Plain-language engagement-band label (Stage 0 item 10: getEngagementBand
// returns 0/1/2, no existing label producer).
function _arcEngagementLabel(band) {
  if (band === 2) { return 'Worked through'; }
  if (band === 1) { return 'Read with notes'; }
  return 'Lightly read';
}

// {bookId -> book} index off the constellation data so hover/click
// handlers resolve title/author/band without re-scanning the array.
function _arcBuildBookIndex(arc) {
  var index = {};
  var books = (arc && arc.books) ? arc.books : [];
  var i;
  for (i = 0; i < books.length; i = i + 1) {
    index[books[i].id] = books[i];
  }
  return index;
}

// Find the thread joining two book ids regardless of endpoint order.
// Seed arc has no threads (adapter stubs threads: []), so this returns
// null there -- the hover path is written for when real threads land.
function _arcFindThread(arc, aId, bId) {
  var threads = (arc && arc.threads) ? arc.threads : [];
  var i, t;
  for (i = 0; i < threads.length; i = i + 1) {
    t = threads[i];
    if ((t.bookAId === aId && t.bookBId === bId) ||
        (t.bookAId === bId && t.bookBId === aId)) {
      return t;
    }
  }
  return null;
}

// Click handlers. Bound on both touch and hover paths. Each binder takes
// the element as a parameter so the closure captures the right node (no
// loop-variable capture bug). Book glyph -> book detail. Marginalia
// cluster -> notebook (plain #notebook; no book-filter URL exists per
// Stage 0 item 5 -- filtering is a follow-up). No click on threads (no
// destination), Yumi cluster (deferred), or question (deferred to 8.2).
function _arcAttachClickHandlers(svgEl, arc) {
  var bookEls = svgEl.querySelectorAll('[data-book-id]');
  var margEls = svgEl.querySelectorAll('[data-marginalia-book-id]');
  var i;
  for (i = 0; i < bookEls.length; i = i + 1) {
    _arcBindBookClick(bookEls[i]);
  }
  for (i = 0; i < margEls.length; i = i + 1) {
    _arcBindMarginaliaClick(margEls[i]);
  }
}

function _arcBindBookClick(el) {
  el.addEventListener('click', function() {
    var bookId = el.getAttribute('data-book-id');
    if (bookId) { location.hash = '#book/' + bookId; }
  });
}

function _arcBindMarginaliaClick(el) {
  el.addEventListener('click', function() {
    location.hash = '#notebook';
  });
}

// Hover tooltips (desktop only). One shared tooltip node, created lazily
// on first hover and appended to the web-view container (svgEl.parentNode,
// which is position:relative). Reused across all targets. Reduced-motion
// adds a modifier that kills the fade.
function _arcAttachTooltipHandlers(svgEl, arc, prefersReducedMotion) {
  var container = svgEl.parentNode;
  if (!container) { return; }
  var bookIndex = _arcBuildBookIndex(arc);
  var tip = { el: null };

  function ensureTip() {
    if (tip.el) { return tip.el; }
    var el = document.createElement('div');
    el.className = 'arc-tooltip'
      + (prefersReducedMotion ? ' arc-tooltip--reduced-motion' : '');
    container.appendChild(el);
    tip.el = el;
    return el;
  }

  // Render structured lines as child <div>s via textContent -- never
  // innerHTML with book data, which would be an XSS surface (titles +
  // authors are user-entered).
  function renderLines(el, lines) {
    el.textContent = '';
    var j, line;
    for (j = 0; j < lines.length; j = j + 1) {
      line = document.createElement('div');
      line.className = lines[j].cls;
      line.textContent = lines[j].text;
      el.appendChild(line);
    }
  }

  function positionTip(el, evt) {
    var rect = container.getBoundingClientRect();
    var x = evt.clientX - rect.left + 12;
    var y = evt.clientY - rect.top + 12;
    var tw = el.offsetWidth;
    var th = el.offsetHeight;
    // Flip to the cursor's other side if the tooltip would clip the
    // container's right / bottom edge.
    if (x + tw + 12 > container.clientWidth) {
      x = evt.clientX - rect.left - tw - 12;
    }
    if (y + th + 12 > container.clientHeight) {
      y = evt.clientY - rect.top - th - 12;
    }
    if (x < 0) { x = 0; }
    if (y < 0) { y = 0; }
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function showTip(lines, evt) {
    if (!lines || !lines.length) { return; }
    var el = ensureTip();
    renderLines(el, lines);
    el.classList.add('arc-tooltip--visible');
    positionTip(el, evt);
  }

  function hideTip() {
    if (tip.el) {
      tip.el.classList.remove('arc-tooltip--visible');
    }
  }

  function bindHover(el, linesFn) {
    el.addEventListener('mouseenter', function(evt) {
      showTip(linesFn(el), evt);
    });
    el.addEventListener('mousemove', function(evt) {
      if (tip.el && tip.el.classList.contains('arc-tooltip--visible')) {
        positionTip(tip.el, evt);
      }
    });
    el.addEventListener('mouseleave', function() {
      hideTip();
    });
  }

  function bookLines(el) {
    var book = bookIndex[el.getAttribute('data-book-id')];
    var lines = [];
    if (!book) { return lines; }
    lines.push({ cls: 'arc-tooltip-title', text: book.title || 'Untitled' });
    if (book.author) {
      lines.push({ cls: 'arc-tooltip-meta', text: book.author });
    }
    lines.push({ cls: 'arc-tooltip-meta', text: _arcEngagementLabel(book.band) });
    if (typeof book.noteCount === 'number' && book.noteCount > 0) {
      lines.push({
        cls: 'arc-tooltip-meta',
        text: book.noteCount + (book.noteCount === 1 ? ' note' : ' notes')
      });
    }
    return lines;
  }

  function threadLines(el) {
    var thread = _arcFindThread(
      arc, el.getAttribute('data-thread-a'), el.getAttribute('data-thread-b'));
    var lines = [];
    if (!thread) { return lines; }
    var strength = (typeof thread.strength === 'number') ? thread.strength : 0;
    var days = (typeof thread.daysSinceLastTouch === 'number')
      ? thread.daysSinceLastTouch : 0;
    lines.push({
      cls: 'arc-tooltip-meta',
      text: strength + ' linked notes, last touched ' + days + ' days ago'
    });
    return lines;
  }

  function marginaliaLines(el) {
    var book = bookIndex[el.getAttribute('data-marginalia-book-id')];
    var nc = (book && typeof book.noteCount === 'number') ? book.noteCount : 0;
    var lines = [];
    lines.push({
      cls: 'arc-tooltip-meta',
      text: nc + (nc === 1 ? ' note' : ' notes')
    });
    lines.push({ cls: 'arc-tooltip-affordance', text: 'Open notebook' });
    return lines;
  }

  function yumiLines() {
    var noticing = (arc && arc.yumiNoticing) ? arc.yumiNoticing : [];
    var lines = [];
    if (!noticing.length) {
      lines.push({ cls: 'arc-tooltip-meta', text: 'Quiet today.' });
      return lines;
    }
    var k, b, title;
    for (k = 0; k < noticing.length; k = k + 1) {
      b = state.books && state.books[noticing[k]];
      title = (b && b.title) ? b.title : 'Untitled';
      lines.push({ cls: 'arc-tooltip-meta', text: title });
    }
    return lines;
  }

  var bookEls = svgEl.querySelectorAll('[data-book-id]');
  var threadEls = svgEl.querySelectorAll('[data-thread-a]');
  var margEls = svgEl.querySelectorAll('[data-marginalia-book-id]');
  var yumiEls = svgEl.querySelectorAll('[data-yumi-cluster]');
  var i;
  for (i = 0; i < bookEls.length; i = i + 1) {
    bindHover(bookEls[i], bookLines);
  }
  for (i = 0; i < threadEls.length; i = i + 1) {
    bindHover(threadEls[i], threadLines);
  }
  for (i = 0; i < margEls.length; i = i + 1) {
    bindHover(margEls[i], marginaliaLines);
  }
  for (i = 0; i < yumiEls.length; i = i + 1) {
    bindHover(yumiEls[i], yumiLines);
  }
}

// Stage 8.1C: keyboard focus + activation. Runs on every device (touch
// users with keyboards get it too). Makes each interactive element a
// focusable role=button with an aria-label, and binds Enter/Space to
// re-fire the click handler 8.1B bound (via a synthetic click, so the
// single source of navigation logic stays in the click binders).
// Question text is focusable + labeled but has NO click handler, so its
// Enter/Space is a no-op -- the edit flow lands in Stage 8.2. Tab order
// follows DOM emit order (no positive tabindex): question -> threads ->
// books -> marginalia -> Yumi, since the renderer paints the question
// first for z-order. See checkpoint note -- this differs from a
// books-first reading order.
function _arcAttachKeyboardHandlers(svgEl, arc) {
  var bookIndex = _arcBuildBookIndex(arc);
  var bookEls = svgEl.querySelectorAll('[data-book-id]');
  var threadEls = svgEl.querySelectorAll('[data-thread-a]');
  var margEls = svgEl.querySelectorAll('[data-marginalia-book-id]');
  var yumiEls = svgEl.querySelectorAll('[data-yumi-cluster]');
  var questionEls = svgEl.querySelectorAll('[data-question]');
  var i, el, book, title, label;

  for (i = 0; i < bookEls.length; i = i + 1) {
    el = bookEls[i];
    book = bookIndex[el.getAttribute('data-book-id')];
    title = (book && book.title) ? book.title : 'Untitled';
    label = (book && book.author) ? title + ' by ' + book.author : title;
    _arcMakeFocusable(el, label);
  }
  for (i = 0; i < threadEls.length; i = i + 1) {
    _arcMakeFocusable(threadEls[i], 'Thread between two books');
  }
  for (i = 0; i < margEls.length; i = i + 1) {
    el = margEls[i];
    book = bookIndex[el.getAttribute('data-marginalia-book-id')];
    title = (book && book.title) ? book.title : 'Untitled';
    _arcMakeFocusable(el, 'Notes on ' + title);
  }
  for (i = 0; i < yumiEls.length; i = i + 1) {
    _arcMakeFocusable(yumiEls[i], 'Yumi noticing');
  }
  for (i = 0; i < questionEls.length; i = i + 1) {
    _arcMakeFocusable(questionEls[i], 'Arc question');
  }
}

function _arcMakeFocusable(el, label) {
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', label);
  el.addEventListener('keydown', function(evt) {
    if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  });
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
// Hybrid Stage C: Layers popover open-state, module-scoped so it survives the
// renderArcDetail re-render a layer-switch toggle triggers (a per-render local
// would reset to closed on every rebuild). Resets to closed on a full reload.
var _stLayersOpen = false;

function renderArcDetail(arcId) {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var arc = state.arcs && state.arcs[arcId];
  var user = getCurrentUser();

  // Stage 5.3 Stage 3b + post-7.1 bugfix: seed-owned arcs
  // (userId === '__praxis_seed__') are globally viewable, INCLUDING
  // signed-out. The Pedagogy of Desire worked example was authored
  // under the sentinel so it could live globally rather than per-
  // user-cloned; the gate below honors that by requiring only that
  // the arc record exist, then bypassing the auth/ownership check
  // entirely when the sentinel matches. User-authored arcs still
  // require a signed-in user whose uid matches arc.userId. Pre-bugfix
  // the gate conflated "arc missing" and "user missing" into a single
  // !arc || !user check, which short-circuited the sentinel bypass on
  // mobile devices that had never signed in -- the seed arc was in
  // state.arcs but the not-found render fired anyway. Any future seed
  // arcs reuse the same sentinel and inherit the same access pass.
  if (!arc) {
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
  if (arc.userId !== '__praxis_seed__' && (!user || arc.userId !== user.uid)) {
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

  // Stage 5.4 Stage 1c: read the persisted view mode once at the top
  // of the render. Both the toolbar (active-button highlight) and --
  // from Stage 1d onward -- the member-rendering branch consume this
  // value, so a single read up here is the single source of truth
  // for this render pass. Re-renders triggered by the toggle click
  // handler re-enter renderArcDetail and re-read fresh.
  var viewMode = getArcViewMode();

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

  // 9.2 Checkpoint E: launch a new sub-theory under this arc. Gated on a
  // signed-in user exactly like the notebook "+ New entry" / "+ New arc"
  // affordances. onClick routes to the new-subtheory hash; renderRoute
  // mints the draft and redirects to #subtheory/<id>. Reuses the
  // notebook create-button class -- no new CSS this stage.
  //
  // Stage 9.6c.1: suppressed in web view -- the constellation control bar
  // below carries its own + Sub-theory button, so showing this header one
  // too would duplicate the affordance. List view keeps it.
  if (user && viewMode !== 'web') {
    var newSubTheoryBtn = document.createElement('button');
    newSubTheoryBtn.type = 'button';
    newSubTheoryBtn.className = 'notebook-new-arc arc-detail-addsub';
    newSubTheoryBtn.textContent = '+ Sub-theory';
    newSubTheoryBtn.addEventListener('click', function() {
      location.hash = 'arc/' + arcId + '/new-subtheory';
    });
    header.appendChild(newSubTheoryBtn);
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
  // Suppress the destructive button for signed-out seed viewers: the
  // click handler (openArcDeleteConfirm -> getCurrentUser) no-ops
  // without a user, so a visible button would dead-click. Signed-in
  // users always see it (Hide on the seed, Delete on their own arcs);
  // signed-out viewers only ever reach the seed-arc render path (the
  // gate above blocks signed-out access to user-authored arcs), so
  // this collapses to "hide it when there is no user."
  if (user || !isSeedArc) {
    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'arc-detail-delete';
    deleteBtn.textContent = isSeedArc ? 'Hide arc' : 'Delete arc';
    deleteBtn.addEventListener('click', function() {
      openArcDeleteConfirm(arcId);
    });
    header.appendChild(deleteBtn);
  }

  wrap.appendChild(header);

  // Confirm panel mount -- empty in 3.9-a; 3.9-b populates on demand.
  var confirmHost = document.createElement('div');
  confirmHost.id = 'arc-detail-confirm-host';
  wrap.appendChild(confirmHost);

  // Stage 5.4 Stage 1c: list/web view toggle row. Sits between the
  // header (identity + destructive) and the member content so it
  // reads as a view-control, not a destructive sibling. Active button
  // gets .is-active; click writes the new mode through
  // setArcViewMode() and re-enters renderArcDetail in place (the
  // function clears host.innerHTML at its top, so the rebuild is
  // idempotent). Stage 1c is scaffolding only -- viewMode is read
  // and the toggle UI is live, but BOTH branches still render the
  // existing list view. The web-vs-list rendering split lands in
  // Stage 1d.
  var toolbar = document.createElement('div');
  toolbar.className = 'arc-detail-toolbar';

  var listBtn = document.createElement('button');
  listBtn.type = 'button';
  listBtn.className = 'arc-detail-toggle-btn'
    + (viewMode === 'list' ? ' is-active' : '');
  listBtn.setAttribute('data-mode', 'list');
  listBtn.textContent = 'List';
  listBtn.addEventListener('click', function() {
    setArcViewMode('list');
    renderArcDetail(arcId);
  });
  toolbar.appendChild(listBtn);

  var webBtn = document.createElement('button');
  webBtn.type = 'button';
  webBtn.className = 'arc-detail-toggle-btn'
    + (viewMode === 'web' ? ' is-active' : '');
  webBtn.setAttribute('data-mode', 'web');
  webBtn.textContent = 'Web';
  webBtn.addEventListener('click', function() {
    setArcViewMode('web');
    renderArcDetail(arcId);
  });
  toolbar.appendChild(webBtn);

  wrap.appendChild(toolbar);

  // Stage 5.4 Stage 1d: branch on viewMode. Web mounts an empty
  // container (1f fills it, Stage 2 draws the spine). List wraps the
  // Stage 5.3 baseline render below in else; the brace moves, the
  // iteration logic is byte-for-byte unchanged (kept at its existing
  // indent on purpose -- minimum-scope diff).
  if (viewMode === 'web') {
    var webContainer = document.createElement('div');
    webContainer.className = 'arc-detail-web-view';
    // Stage 7.1B: wire the constellation renderer in place of the
    // Stage 5.4 Stage 2a single-book temp. Container stays a <div>
    // (keeps the wheat-field ::before backdrop intact); the renderer
    // gets an inner <svg viewBox="0 0 600 500"> created via the SVG
    // namespace (document.createElement('svg') would produce an HTML
    // element with no SVG semantics). Defensive guard fails soft to a
    // text notice if either script tag failed to load -- both files
    // are now in APP_SHELL (sw.js 'praxis-v3.12-a') so this branch
    // should be unreachable in steady state, but the SW can serve
    // mid-deploy mixed states.
    if (typeof window.renderSubTheoryConstellation !== 'function') {
      var unavailable = document.createElement('p');
      unavailable.className = 'arc-detail-web-placeholder';
      unavailable.textContent = 'Constellation renderer unavailable.';
      webContainer.appendChild(unavailable);
    } else {
      // Stage 9.6c.1: the constellation control bar -- one chrome row
      // above the SVG. + Sub-theory navigates to the new-subtheory route
      // (it replaces the header button, which is suppressed in web view
      // above). Reset (9.6c.2) and Connect (9.6c.4) are now both wired via
      // their data-st-control hooks: Reset clears placements below, Connect
      // is handed to attachSubTheoryDrag, which toggles the resonance-edge
      // arming layer. The marginalia toggle is folded in from 9.6b
      // unchanged: reads the persisted flag via ls() (default ON, strict
      // boolean), flips through sv(), and re-enters renderArcDetail in
      // place (idempotent -- host.innerHTML is cleared at the top, so the
      // rebuild re-reads the fresh value). That flag feeds the renderer's
      // showMarginalia option below.
      var stControlBar = document.createElement('div');
      stControlBar.className = 'st-control-bar';

      var addSubBtn = document.createElement('button');
      addSubBtn.type = 'button';
      addSubBtn.className = 'arc-detail-toggle-btn arc-detail-addsub';
      addSubBtn.setAttribute('data-st-control', 'add');
      addSubBtn.textContent = '+ Sub-theory';
      addSubBtn.addEventListener('click', function() {
        location.hash = 'arc/' + arcId + '/new-subtheory';
      });
      stControlBar.appendChild(addSubBtn);

      // Stage 4 (mockup-fidelity): Connect / Reset / Layers move to a bottom
      // control bar AFTER the constellation (mockup line 202, bottom-right).
      // The + Sub-theory control stays in the top bar. The connectBtn / resetBtn
      // / layersWrap NODES are MOVED into this bar (re-pointed appendChild),
      // never re-created -- connectBtn stays the same reference handed to
      // attachSubTheoryDrag and keeps its data-st-control='connect' hook.
      var stControlBarBottom = document.createElement('div');
      stControlBarBottom.className = 'st-control-bar st-control-bar-bottom';

      var connectBtn = document.createElement('button');
      connectBtn.type = 'button';
      connectBtn.className = 'arc-detail-toggle-btn';
      connectBtn.setAttribute('data-st-control', 'connect');
      connectBtn.textContent = 'Connect';
      stControlBarBottom.appendChild(connectBtn);

      var resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'arc-detail-toggle-btn';
      resetBtn.setAttribute('data-st-control', 'reset');
      resetBtn.textContent = 'Reset';
      // Stage 9.6c.2: Reset is the explicit "give me the default back"
      // affordance -- it clears every placement in this arc to null
      // (persisting), so _stRadialLayout falls back to the composed radial
      // slots. Locked semantics: persisted, not session-only.
      resetBtn.addEventListener('click', function() {
        var k, s;
        for (k in state.subTheories) {
          if (!state.subTheories.hasOwnProperty(k)) { continue; }
          s = state.subTheories[k];
          if (s && s.arcId === arcId) {
            setSubTheoryPosition(k, null, null);
          }
        }
        renderArcDetail(arcId);
      });
      stControlBarBottom.appendChild(resetBtn);

      // Hybrid Stage C: all visibility layers consolidate into ONE "Layers"
      // popover -- Books / Marginalia / Faint links, each an independent
      // persisted switch (ls/sv, default ON). Resonance is NOT a switch (it
      // always renders -- the spine). The popover open-state lives in the
      // module-level _stLayersOpen so a switch toggle (which re-enters
      // renderArcDetail) leaves the popover open across the rebuild.
      var stShowMarginalia = ls('praxis_st_marginalia_on', true) === true;
      var stShowBooks = ls('praxis_st_books_on', true) === true;
      var stShowFaint = ls('praxis_st_faint_on', true) === true;
      // 9b-iii: the global palette. Set the document-root attribute now so the
      // hue remap is live for both the constellation and the spotlight chips.
      var stPalette = (ls('praxis_constellation_palette', 'colorful') === 'muted')
        ? 'muted' : 'colorful';
      document.documentElement.setAttribute('data-st-palette', stPalette);

      var layersWrap = document.createElement('div');
      layersWrap.className = 'st-layers';

      var layersBtn = document.createElement('button');
      layersBtn.type = 'button';
      layersBtn.className = 'arc-detail-toggle-btn';
      layersBtn.setAttribute('data-st-control', 'layers');
      layersBtn.textContent = 'Layers';
      layersWrap.appendChild(layersBtn);

      var layersPopover = document.createElement('div');
      layersPopover.className = 'st-layers-popover'
        + (_stLayersOpen ? ' st-layers-popover--open' : '');

      // 9b-iii (R56): each layer switch flips its ls flag AND the matching root
      // attribute on the LIVE svg -- the CSS in components.css fades the
      // filter-free descendant group. No re-render, so node identity is
      // preserved; the popover stays put. (webContainer is in closure scope.)
      var stLayerSwitch = function(labelText, flagKey, attrName, isOn) {
        var sw = document.createElement('button');
        sw.type = 'button';
        sw.className = 'arc-detail-toggle-btn st-layers-switch'
          + (isOn ? ' is-active' : '');
        sw.setAttribute('data-st-layer', flagKey);
        sw.textContent = labelText;
        sw.addEventListener('click', function() {
          var nowOn = !(ls(flagKey, true) === true);
          sv(flagKey, nowOn);
          var svgEl = webContainer.querySelector('svg');
          if (svgEl) { svgEl.setAttribute(attrName, nowOn ? 'on' : 'off'); }
          sw.className = 'arc-detail-toggle-btn st-layers-switch'
            + (nowOn ? ' is-active' : '');
        });
        return sw;
      };

      layersPopover.appendChild(
        stLayerSwitch('Books', 'praxis_st_books_on', 'data-st-books', stShowBooks));
      layersPopover.appendChild(
        stLayerSwitch('Marginalia', 'praxis_st_marginalia_on', 'data-st-marginalia', stShowMarginalia));
      layersPopover.appendChild(
        stLayerSwitch('Faint links', 'praxis_st_faint_on', 'data-st-faint', stShowFaint));

      // 9b-iii: palette toggle. Unlike the layer fades, switching palette
      // changes the mark ANATOMY markup (muted body radial / no shine), so it
      // re-enters renderArcDetail. The hue itself follows the root attribute set
      // above; spotlight chips inherit it automatically.
      var paletteSwitch = document.createElement('button');
      paletteSwitch.type = 'button';
      paletteSwitch.className = 'arc-detail-toggle-btn st-layers-switch'
        + (stPalette === 'muted' ? ' is-active' : '');
      paletteSwitch.setAttribute('data-st-layer', 'palette');
      paletteSwitch.textContent = 'Muted palette';
      paletteSwitch.addEventListener('click', function() {
        var next = (ls('praxis_constellation_palette', 'colorful') === 'muted')
          ? 'colorful' : 'muted';
        sv('praxis_constellation_palette', next);
        document.documentElement.setAttribute('data-st-palette', next);
        _stLayersOpen = true;
        renderArcDetail(arcId);
      });
      layersPopover.appendChild(paletteSwitch);

      layersWrap.appendChild(layersPopover);

      // The Layers button just opens/closes the popover in place (no re-render
      // needed); the module flag carries the state across switch rebuilds.
      layersBtn.addEventListener('click', function() {
        _stLayersOpen = !_stLayersOpen;
        layersPopover.className = 'st-layers-popover'
          + (_stLayersOpen ? ' st-layers-popover--open' : '');
      });

      stControlBarBottom.appendChild(layersWrap);

      webContainer.appendChild(stControlBar);

      var SVG_NS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 600 500');
      svg.setAttribute('xmlns', SVG_NS);
      webContainer.appendChild(svg);
      // Stage 4: the Connect/Reset/Layers bar sits AFTER the svg (bottom).
      webContainer.appendChild(stControlBarBottom);
      var arcData = _arcDetailBuildSubTheoryData(arc);
      window.renderSubTheoryConstellation(arcData, svg,
        { showMarginalia: stShowMarginalia,
          showBooks: stShowBooks,
          showFaint: stShowFaint,
          palette: stPalette });
      // Stage 9.5: bind the sub-theory interaction layer. Pass arcData
      // (resolved subTheories/marks), not the raw arc record -- the
      // tooltip needs header/label/quote already resolved.
      _stConstellationAttachInteractions(svg, arcData);
      // Stage 9.6c.2: bind the drag-to-arrange layer on the freshly-built
      // svg. onCommit persists the dropped position via setSubTheoryPosition
      // then re-enters renderArcDetail, which rebuilds the svg and re-binds
      // both layers -- no teardown needed (the old svg + its listeners are
      // GC'd). Runs on initial render and every drag-commit/Reset re-render.
      if (typeof window.attachSubTheoryDrag === 'function') {
        window.attachSubTheoryDrag(svg, {
          arc: arcData,
          connectBtn: connectBtn,
          // Stage 9.6c.4: Connect arming lives in attachSubTheoryDrag; on a
          // confirmed pick-two it calls onLink. Re-render ONLY on a real new
          // link (linkSubTheories returns false for a dup/self/missing pair).
          onLink: function(aId, bId) {
            if (linkSubTheories(aId, bId)) { renderArcDetail(arcId); }
          },
          onCommit: function(id, x, y) {
            setSubTheoryPosition(id, x, y);
            renderArcDetail(arcId);
          }
        });
      }
    }
    wrap.appendChild(webContainer);
  } else {

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

  } // <-- Stage 5.4 Stage 1d: close the viewMode === 'web' else branch.

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
        filed:      true,
        createdAt:  now,
        updatedAt:  now
      };
      state.notebookEntries[id] = entry;
      markNotebookDirty();
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
      if (arc && (arc.userId === opts.user.uid || arc.userId === '__praxis_seed__')) {
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
  // Bring the picker into view: its host sits below the book-detail
  // header, so on a tall mobile page the panel would open off-screen and
  // the tap would read as a no-op. Mirrors _accountOpenMark's reveal.
  if (typeof host.scrollIntoView === 'function') {
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Entry arc picker (2b-ii). Mounts the shared panel into a per-card
// inline element (no global host -- per-card scope can't live on a
// shared host). On a true return from addEntryToArc, saveState then a
// route-aware re-render: #book/<id> stays on book detail (entries
// render in the marginalia list there too), anything else returns to
// the Notebook. Same route-aware re-render shape used elsewhere. On false
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

// 10.1 minimal toast. No toast/snackbar utility existed before this; this
// is the first. Appends a transient message to <body> and auto-dismisses
// after ~2.6s. Styled inline with CSS-variable references only (no
// stylesheet edit this slice; no hardcoded colors). A new toast removes
// any prior one so rapid taps do not stack. Reused for both the confirm
// ("Attached to ...") and the already-attached notice.
var praxisToastEl = null;
var praxisToastTimer = null;
function showToast(message) {
  if (praxisToastEl && praxisToastEl.parentNode) {
    praxisToastEl.parentNode.removeChild(praxisToastEl);
  }
  if (praxisToastTimer) {
    clearTimeout(praxisToastTimer);
    praxisToastTimer = null;
  }
  var t = document.createElement('div');
  t.className = 'praxis-toast';
  t.setAttribute('role', 'status');
  t.textContent = message || '';
  t.style.cssText =
    'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);' +
    'max-width:90%;z-index:1000;padding:10px 16px;' +
    'border-radius:var(--radius-md);' +
    'background:var(--ink);color:var(--color-surface);' +
    'border:1px solid var(--border);box-shadow:var(--shadow-2);' +
    'font-size:14px;line-height:1.3;';
  document.body.appendChild(t);
  praxisToastEl = t;
  praxisToastTimer = setTimeout(function() {
    if (t.parentNode) { t.parentNode.removeChild(t); }
    if (praxisToastEl === t) { praxisToastEl = null; }
    praxisToastTimer = null;
  }, 2600);
}

// 10.1 send-to-sub-theory picker. Mirrors buildArcPickerPanel's INLINE
// panel (no centered overlay): reuses the arc-picker-* chrome classes for
// the shared look, adds subtheory-picker-* hooks for the grouped rows and
// checkmarks a later styling ticket will own. Lists DRAFT sub-theories
// (status === 'draft') the user owns (or the seed), grouped by parent
// arc (group header = arc title, rows = sub-theory headers). Self-closing:
// Done and Esc remove the panel from its mount and drop the key listener.
// sourceKind is 'book' | 'entry'; refId is the bookId/entryId; quoteText
// is the optional quote (notes pass their body, books pass '').
function buildSubTheoryPickerPanel(sourceKind, refId, quoteText) {
  var panel = document.createElement('div');
  panel.className = 'arc-picker-panel subtheory-picker-panel';

  var labelEl = document.createElement('div');
  labelEl.className = 'arc-picker-label';
  labelEl.textContent = 'Send to a sub-theory';
  panel.appendChild(labelEl);

  function closePanel() {
    document.removeEventListener('keydown', onKeydown);
    if (panel.parentNode) { panel.parentNode.removeChild(panel); }
  }
  function onKeydown(ev) {
    if (ev.keyCode === 27) { closePanel(); }
  }
  document.addEventListener('keydown', onKeydown);

  // Gather draft, owned sub-theories grouped by arc, arcs in first-seen
  // order (mirrors the arc picker's createdAt-agnostic listing -- grouping
  // is by parent arc, not a global sort).
  var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  var uid = (user && user.uid) ? user.uid : null;
  var stMap = state.subTheories || {};
  var byArc = {};
  var arcOrder = [];
  var stk;
  for (stk in stMap) {
    if (Object.prototype.hasOwnProperty.call(stMap, stk)) {
      var st = stMap[stk];
      if (!st || st.status !== 'draft') { continue; }
      if (!(st.userId === uid || st.userId === '__praxis_seed__')) { continue; }
      var aId = st.arcId || '__no_arc__';
      if (!byArc[aId]) { byArc[aId] = []; arcOrder.push(aId); }
      byArc[aId].push(st);
    }
  }

  if (arcOrder.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'arc-picker-empty';
    empty.textContent =
      'No draft sub-theories yet — start one from an arc to collect evidence.';
    panel.appendChild(empty);
  } else {
    var i, j;
    for (i = 0; i < arcOrder.length; i = i + 1) {
      var arcId = arcOrder[i];
      var arc = (state.arcs && state.arcs[arcId]) || null;
      var head = document.createElement('div');
      head.className = 'subtheory-picker-arc';
      head.textContent = (arc && arc.title) ? arc.title : 'Unfiled';
      panel.appendChild(head);
      var list = byArc[arcId];
      for (j = 0; j < list.length; j = j + 1) {
        appendSubTheoryPickerRow(panel, list[j], sourceKind, refId, quoteText);
      }
    }
  }

  var done = document.createElement('a');
  done.href = '#';
  done.className = 'arc-picker-done';
  done.textContent = 'Done';
  done.addEventListener('click', function(ev) {
    ev.preventDefault();
    closePanel();
  });
  panel.appendChild(done);

  return panel;
}

// 10.1 polish: a readable row label even when a draft has no header yet.
// Falls back to the first line (~40 chars) of bodyPublic, then
// bodyIntellectual, then the generic placeholder. Display only -- never
// writes back to the record.
function subTheoryRowLabel(st) {
  if (st.header && st.header.length) { return st.header; }
  var body = '';
  if (st.bodyPublic && st.bodyPublic.length) {
    body = st.bodyPublic;
  } else if (st.bodyIntellectual && st.bodyIntellectual.length) {
    body = st.bodyIntellectual;
  }
  if (body.length) {
    var firstLine = body.split('\n')[0].replace(/\s+/g, ' ').trim();
    if (firstLine.length > 40) {
      firstLine = firstLine.substring(0, 40) + '…';
    }
    if (firstLine.length) { return firstLine; }
  }
  return '(untitled sub-theory)';
}

// One picker row, closure-scoped per sub-theory (a var-in-for-loop would
// bind every row to the last -- same reason appendArcPickerRow exists).
// An already-attached row renders a checkmark and is inert on tap (an
// 'Already attached' toast, no re-add). An unattached tap attaches via
// addEvidenceToSubTheory and flips THIS row to a checkmark in place
// without closing the panel -- multi-attach.
function appendSubTheoryPickerRow(panel, subTheory, sourceKind, refId, quoteText) {
  var stId = subTheory.id;
  var row = document.createElement('a');
  row.href = '#';
  row.className = 'arc-picker-row subtheory-picker-row';

  var labelSpan = document.createElement('span');
  labelSpan.className = 'subtheory-picker-row-label';
  labelSpan.textContent = subTheoryRowLabel(subTheory);
  row.appendChild(labelSpan);

  function markAttached() {
    if (row.className.indexOf('subtheory-picker-row-attached') === -1) {
      row.className = row.className + ' subtheory-picker-row-attached';
    }
    if (!row.querySelector('.subtheory-picker-check')) {
      var check = document.createElement('span');
      check.className = 'subtheory-picker-check';
      check.textContent = '✓';
      row.appendChild(check);
    }
  }

  if (isEvidenceAttached(stId, sourceKind, refId)) {
    markAttached();
  }

  row.addEventListener('click', function(ev) {
    ev.preventDefault();
    var name = subTheory.header || 'sub-theory';
    if (isEvidenceAttached(stId, sourceKind, refId)) {
      showToast('Already attached to "' + name + '"');
      return;
    }
    var res = addEvidenceToSubTheory(stId,
      { kind: sourceKind, refId: refId, quote: quoteText });
    if (res.status === 'added') {
      markAttached();
      showToast('Attached to "' + name + '"');
    } else if (res.status === 'already-attached') {
      markAttached();
      showToast('Already attached to "' + name + '"');
    }
    // status 'error' -> silent no-op; no state change, no toast.
  });

  panel.appendChild(row);
}

// 10.1 mount wrappers, mirroring openEntryArcPicker / openBookArcPicker.
// The Stage-2 panel self-closes (Esc/Done) and manages its own teardown,
// so these only clear the host and mount a fresh panel. The entry quote
// is the entry body (the evidence quote field); a book attaches with no
// quote per the 10.1 scope.
function openEntrySendToSubTheory(entryId, mountEl) {
  if (!mountEl) { return; }
  var user = getCurrentUser();
  if (!user) { return; }
  var entry = state.notebookEntries ? state.notebookEntries[entryId] : null;
  var quote = (entry && typeof entry.body === 'string') ? entry.body : '';
  mountEl.innerHTML = '';
  mountEl.appendChild(buildSubTheoryPickerPanel('entry', entryId, quote));
}

function openBookSendToSubTheory(bookId) {
  var host = document.getElementById('book-detail-subtheory-picker-host');
  if (!host) { return; }
  var user = getCurrentUser();
  if (!user) { return; }
  host.innerHTML = '';
  host.appendChild(buildSubTheoryPickerPanel('book', bookId, ''));
  // Bring the picker into view (see openBookArcPicker): the host sits
  // below the book-detail header, so on a tall mobile page the panel
  // would open off-screen and the tap would read as a no-op.
  if (typeof host.scrollIntoView === 'function') {
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderNotebookEntry(entry, gatherable) {
  // Left register spine via ::before reads --reg: marginalia = teal
  // (--marginalia-color), question = --question-color (blue), journal =
  // --journal-color. N1: the per-entry privacy toggle is removed (see the
  // actions row); openEntryArcPicker / openEntrySendToSubTheory / deleteEntry
  // wiring is preserved.
  var isMarg = entry.register === 'marginalia';
  var isQues = entry.register === 'question';
  var priv = entry.isPrivate === true;
  var capturedId = entry.id;
  var gathered = gatherable && notebookGathered[entry.id] === true;

  var card = document.createElement('article');
  card.className = 'notebook-entry' + (gathered ? ' notebook-entry-gathered' : '');
  card.style.setProperty('--reg',
    isMarg ? 'var(--marginalia-color)'
           : (isQues ? 'var(--question-color)' : 'var(--journal-color)'));

  // Entry head: register pill + timestamp + visibility indicator.
  var eh = document.createElement('div');
  eh.className = 'notebook-entry-head';

  var registerEl = document.createElement('span');
  registerEl.className = 'notebook-entry-tag ' +
    (isMarg ? 'notebook-entry-tag-m'
            : (isQues ? 'notebook-entry-tag-q' : 'notebook-entry-tag-j'));
  registerEl.textContent = isMarg ? 'Marginalia' : (isQues ? 'Question' : 'Journal');
  eh.appendChild(registerEl);

  var timeEl = document.createElement('time');
  timeEl.className = 'notebook-entry-ts';
  var ts = new Date(entry.createdAt || 0);
  timeEl.textContent = ts.toLocaleString();
  if (entry.createdAt) {
    timeEl.setAttribute('datetime', ts.toISOString());
  }
  eh.appendChild(timeEl);

  // Visibility indicator -- reads the EXISTING isPrivate field (no new
  // data). Teal when visible to Yumi; muted when private.
  var visEl = document.createElement('span');
  visEl.className = 'notebook-entry-vis ' +
    (priv ? 'notebook-entry-vis-off' : 'notebook-entry-vis-on');
  var visDot = document.createElement('span');
  visDot.className = 'notebook-entry-vis-dot';
  visEl.appendChild(visDot);
  visEl.appendChild(document.createTextNode(priv ? 'Private' : 'Visible to Yumi'));
  eh.appendChild(visEl);

  card.appendChild(eh);

  // Marginalia source line. Fail soft if the book is unknown.
  if (isMarg) {
    var src = document.createElement('div');
    src.className = 'notebook-entry-src';
    var bookId = (entry.bookIds && entry.bookIds[0]) || null;
    var book = (bookId && state.books && state.books[bookId]) || null;
    var bookTitle = (book && book.title) || '(unknown book)';
    src.textContent = 'from ' + bookTitle;
    card.appendChild(src);
  }

  var bodyEl = document.createElement('div');
  bodyEl.className = 'notebook-entry-body';
  bodyEl.textContent = entry.body || '';
  card.appendChild(bodyEl);

  // Actions row. Add to arc (openEntryArcPicker, inline lazy mount), send to
  // sub-theory, delete (click-to-confirm via deleteEntry, same location.hash
  // re-render branch). N1: the per-entry privacy toggle is REMOVED -- visibility
  // is governed by the by-kind default + the master "Yumi reads along" switch,
  // never a per-entry flip. The read-only visibility indicator above remains.
  var acts = document.createElement('div');
  acts.className = 'notebook-entry-acts';

  // N3: gather toggle -- only on the notebook spread (gatherable). Adds/removes
  // this entry from the gathered set that forms a sub-theory on the right leaf.
  if (gatherable) {
    var gatherLink = document.createElement('a');
    gatherLink.href = '#';
    gatherLink.className = 'notebook-entry-add-to-arc notebook-entry-gather';
    gatherLink.textContent = gathered ? 'Gathered ✓' : 'Gather';
    gatherLink.addEventListener('click', function(ev) {
      ev.preventDefault();
      toggleGather(capturedId);
    });
    acts.appendChild(gatherLink);
  }

  var addToArcLink = document.createElement('a');
  addToArcLink.href = '#';
  addToArcLink.className = 'notebook-entry-add-to-arc';
  addToArcLink.textContent = 'Add to arc';
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
  acts.appendChild(addToArcLink);

  // N2: File to book -- only for an Inbox item (filed === false). Sets
  // filed = true + the bookId, routing it from Inbox into that book's bank.
  if (entry.filed === false) {
    var fileLink = document.createElement('a');
    fileLink.href = '#';
    fileLink.className = 'notebook-entry-add-to-arc notebook-entry-file-to-book';
    fileLink.textContent = 'File to book';
    fileLink.addEventListener('click', function(ev) {
      ev.preventDefault();
      var fmount = card.querySelector('.notebook-entry-book-picker-host');
      if (!fmount) {
        fmount = document.createElement('div');
        fmount.className = 'notebook-entry-book-picker-host';
        card.appendChild(fmount);
      }
      openFileToBookPicker(capturedId, fmount);
    });
    acts.appendChild(fileLink);
  }

  // 10.1: Send to sub-theory — attaches this entry as evidence (kind
  // 'entry', quote = the entry body). Present on EVERY entry regardless
  // of register or privacy: attaching is the user's own deliberate act,
  // so a private journal entry carries the affordance just like a
  // marginalia entry does. Per-card lazy mount mirrors "Add to arc".
  var sendToSubLink = document.createElement('a');
  sendToSubLink.href = '#';
  sendToSubLink.className = 'notebook-entry-add-to-arc notebook-entry-send-to-subtheory';
  sendToSubLink.textContent = 'Send to sub-theory';
  sendToSubLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    var subMount = card.querySelector('.notebook-entry-subtheory-picker-host');
    if (!subMount) {
      subMount = document.createElement('div');
      subMount.className = 'notebook-entry-subtheory-picker-host';
      card.appendChild(subMount);
    }
    openEntrySendToSubTheory(capturedId, subMount);
  });
  acts.appendChild(sendToSubLink);

  var deleteLink = document.createElement('a');
  deleteLink.href = '#';
  deleteLink.className = 'notebook-entry-delete';
  deleteLink.textContent = 'Delete';

  var confirmLink = document.createElement('a');
  confirmLink.href = '#';
  confirmLink.className = 'notebook-entry-delete-confirm';
  confirmLink.textContent = 'confirm delete';
  confirmLink.style.display = 'none';

  var cancelLink = document.createElement('a');
  cancelLink.href = '#';
  cancelLink.className = 'notebook-entry-delete-cancel';
  cancelLink.textContent = 'cancel';
  cancelLink.style.display = 'none';

  deleteLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    deleteLink.style.display = 'none';
    confirmLink.style.display = '';
    cancelLink.style.display = '';
  });

  cancelLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    confirmLink.style.display = 'none';
    cancelLink.style.display = 'none';
    deleteLink.style.display = '';
  });

  confirmLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    var ok = deleteEntry(capturedId);
    if (ok) {
      saveState();
      if (location.hash.indexOf('#book/') === 0) {
        renderBookDetail(state.currentBookId);
      } else {
        renderNotebook();
      }
    }
  });

  acts.appendChild(deleteLink);
  acts.appendChild(confirmLink);
  acts.appendChild(cancelLink);

  card.appendChild(acts);
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

// N1: togglePrivacy (the per-entry visibility flip) was REMOVED. Visibility is
// now the by-kind default (journal private; marginalia + question visible) plus
// the master "Yumi reads along" switch -- never a per-entry flip.

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

  // Batch 2: segmented Visible|Private pill (mockup .tog) replacing the
  // underline-link toggle. Reads/writes the EXISTING register default via
  // getRegisterDefault/setRegisterDefault (wiring unchanged); clicking the
  // already-active option is a no-op. role=button + keydown preserve the
  // keyboard access the prior <a> had. setRegisterDefault re-paints the
  // panel, so the pill restyles after a flip.
  function buildTog(register) {
    var isPriv = getRegisterDefault(register);
    var tog = document.createElement('div');
    tog.className = 'notebook-settings-tog';
    tog.setAttribute('role', 'group');
    function makeOpt(label, wantPrivate, active) {
      var opt = document.createElement('span');
      opt.className = 'notebook-settings-tog-opt' +
        (active ? ' notebook-settings-tog-opt-on' : '');
      opt.textContent = label;
      opt.setAttribute('role', 'button');
      opt.setAttribute('tabindex', '0');
      function activate() {
        if (getRegisterDefault(register) !== wantPrivate) {
          setRegisterDefault(register, wantPrivate);
        }
      }
      opt.addEventListener('click', function(ev) {
        ev.preventDefault();
        activate();
      });
      opt.addEventListener('keydown', function(ev) {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
          ev.preventDefault();
          activate();
        }
      });
      return opt;
    }
    tog.appendChild(makeOpt('Visible', false, !isPriv));
    tog.appendChild(makeOpt('Private', true, isPriv));
    return tog;
  }

  // Journal section.
  var jSec = document.createElement('div');
  jSec.className = 'notebook-settings-section';

  var jLabel = document.createElement('div');
  jLabel.className = 'notebook-settings-label';
  jLabel.textContent = 'Journal default';
  jSec.appendChild(jLabel);

  jSec.appendChild(buildTog('journal'));

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

  mSec.appendChild(buildTog('marginalia'));

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
  var panel = buildTransparencyContent(snap, 'panel');
  // The Notebook panel keeps its Close affordance; the routed page
  // navigates away instead. Re-append after the builder so the header
  // order stays title -> close, byte-equivalent to the pre-extraction panel.
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'transparency-close';
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', function() {
    closeTransparencyView();
  });
  var hdr = panel.querySelector('.transparency-header');
  if (hdr) { hdr.appendChild(closeBtn); }
  host.appendChild(panel);
}

// 6.2c (R90): shared transparency-content builder. Takes a
// getContextSnapshot() result and returns the .transparency-panel element
// (header + title + framing + all sections). The Notebook panel
// (openTransparencyView) and the routed page (renderWhatYumiSeesPage) both
// render from this ONE builder so they never drift. The close button is
// panel-only and added by openTransparencyView, not here.
function buildTransparencyContent(snap, context) {
  var panel = document.createElement('section');
  panel.className = 'transparency-panel';

  // Header: title only. The close button is panel-only and re-appended
  // by openTransparencyView after this builder returns.
  var header = document.createElement('header');
  header.className = 'transparency-header';

  var title = document.createElement('h2');
  title.className = 'transparency-title';
  title.textContent = 'What Yumi sees';
  header.appendChild(title);

  panel.appendChild(header);

  // Framing copy: two paragraphs, verbatim from the Stage 3.6 brief.
  var framing = document.createElement('div');
  framing.className = 'transparency-framing';

  var p1 = document.createElement('p');
  p1.textContent =
    'This is everything Yumi sees right now: the book you are ' +
    'reading, the arc you are following, the sub-theory you are ' +
    'writing, recent notebook entries that are marked visible, ' +
    'and the conversation you and Yumi have been having. Yumi ' +
    'does not see anything else.';
  framing.appendChild(p1);

  // 6.2-polish: the panel-return clause is true only for the Notebook
  // panel. The shared prefix is identical; only the trailing sentence
  // differs by context ('page' drops it, the page has no Close). Panel
  // branch is byte-identical to the pre-split literal.
  var p2Base =
    'Entries marked private do not appear here. They stay in the ' +
    'Notebook for the reader and are excluded from what Yumi ' +
    'receives. Yumi sees the three most recent visible entries, ' +
    'trimmed; older or longer writing lives in the Notebook but ' +
    'not in this view.';
  var p2 = document.createElement('p');
  if (context === 'page') {
    p2.textContent = p2Base;
  } else {
    p2.textContent = p2Base + ' Closing this panel returns to the Notebook.';
  }
  framing.appendChild(p2);

  panel.appendChild(framing);

  // Section: Current book.
  var bookSec = renderTransparencySection('Current book');
  var bookBody = bookSec.querySelector('.transparency-section-body');
  if (snap.currentBook === null) {
    bookBody.textContent = 'No book is open right now.';
    bookBody.className = 'transparency-section-body transparency-empty';
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
    arcBody.className = 'transparency-section-body transparency-empty';
  } else {
    arcBody.textContent = snap.currentArc.title;
  }
  panel.appendChild(arcSec);

  // Section: Current sub-theory. Render-only -- assembleContextData
  // already carries currentSubTheory.header and buildContext sends it
  // to Yumi, so the surface must show it for the framing's "Yumi does
  // not see anything else" to stay true. Placed in the current-* group.
  var subTheorySec = renderTransparencySection('Current sub-theory');
  var subTheoryBody = subTheorySec.querySelector('.transparency-section-body');
  if (snap.currentSubTheory === null) {
    subTheoryBody.textContent = 'No sub-theory is open right now.';
    subTheoryBody.className = 'transparency-section-body transparency-empty';
  } else {
    subTheoryBody.textContent = snap.currentSubTheory.header;
  }
  panel.appendChild(subTheorySec);

  // Section: Recent notebook entries. Bodies are already truncated
  // to 200 chars by assembleContextData -- this is exactly the form
  // Yumi receives.
  var entriesSec = renderTransparencySection('Recent notebook entries');
  var entriesBody = entriesSec.querySelector('.transparency-section-body');
  if (snap.recentEntries.length === 0) {
    entriesBody.textContent =
      'No notebook entries are visible to Yumi right now. New ' +
      'entries or entries marked visible will appear here.';
    entriesBody.className = 'transparency-section-body transparency-empty';
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
    artifactsBody.className = 'transparency-section-body transparency-empty';
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
    summaryBody.className = 'transparency-section-body transparency-empty';
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
    turnsBody.className = 'transparency-section-body transparency-empty';
  } else {
    var t;
    for (t = 0; t < snap.recentTurns.length; t++) {
      turnsBody.appendChild(renderTransparencyTurn(snap.recentTurns[t]));
    }
  }
  panel.appendChild(turnsSec);

  return panel;
}

// 6.2c: 'What Yumi sees' as a standalone routed page. renderHome shell
// idiom (clear #app, section wrapper, append). Fed by a FRESH
// getContextSnapshot() through the SAME buildTransparencyContent builder
// the Notebook panel uses (R90) -- so the page can never claim Yumi sees
// something she doesn't. Panel chrome is kept intentionally (visual
// identity with the Notebook panel). The closing line is page-only.
function renderWhatYumiSeesPage() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'yumi-sees-page';

  var snap = window.YumiBrain.getContextSnapshot();
  wrap.appendChild(buildTransparencyContent(snap, 'page'));

  var closing = document.createElement('p');
  closing.className = 'yumi-sees-closing';
  closing.textContent = 'This page is always here — one tap away in Yumi\'s panel.';
  wrap.appendChild(closing);

  host.appendChild(wrap);
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

// Stage 14.3 Stage 4: yyyy-mm-dd stamp for the export filename. Uses the
// browser Date (runtime only -- this never runs under the cscript parse
// harness, which only PARSES the file). Zero-pads month/day via string
// concat to keep the var/function-only, no-template-literal house style.
function exportDateStamp() {
  var d = new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  var mm = (m < 10) ? ('0' + m) : ('' + m);
  var dd = (day < 10) ? ('0' + day) : ('' + day);
  return y + '-' + mm + '-' + dd;
}

// Stage 14.3 Stage 4: in-DOM delete-account confirmation. Mirrors
// openArcDeleteConfirm -- mounts into #account-delete-host, explicit
// irreversible wording, no native confirm(). Confirm calls deleteAccount
// (definition in integrations.js); on status:'error' the data is
// untouched (retryable) so the panel stays open with an inline error and
// the confirm link is reset. On 'deleted' OR 'deleted-data-only' the data
// is gone and the user is signed out -- location.reload() gives a clean
// signed-out slate (the soft note for 'deleted-data-only' is discarded by
// the reload, which is acceptable per the Stage 4 brief). Cancel clears
// the host; the account page underneath is untouched.
function openAccountDeleteConfirm(uid) {
  var host = document.getElementById('account-delete-host');
  if (!host) return;
  host.innerHTML = '';

  var panel = document.createElement('div');
  panel.className = 'arc-confirm-panel account-confirm-panel';

  var copy = document.createElement('p');
  copy.className = 'arc-confirm-copy';
  copy.textContent =
    'Delete your account? This permanently removes your books, arcs, ' +
    'sub-theories, notebook, and profile from Praxis. This cannot be ' +
    'undone.';
  panel.appendChild(copy);

  var actions = document.createElement('div');
  actions.className = 'arc-confirm-actions';

  var confirmLink = document.createElement('a');
  confirmLink.href = '#';
  confirmLink.className = 'arc-confirm-confirm';
  confirmLink.textContent = 'Delete my account';
  confirmLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    confirmLink.textContent = 'Deleting...';
    deleteAccount(function(r) {
      if (r && r.status === 'error') {
        confirmLink.textContent = 'Delete my account';
        var errNote = document.createElement('p');
        errNote.className = 'arc-confirm-stale-note';
        errNote.textContent = 'Could not delete the account: ' +
          (r.error ? ('' + r.error) : 'unknown error') +
          '. Nothing was removed -- please try again.';
        host.appendChild(errNote);
        return;
      }
      // 'deleted' or 'deleted-data-only': data is gone, user signed out.
      location.reload();
    });
  });
  actions.appendChild(confirmLink);

  var cancelLink = document.createElement('a');
  cancelLink.href = '#';
  cancelLink.className = 'arc-confirm-cancel';
  cancelLink.textContent = 'Cancel';
  cancelLink.addEventListener('click', function(ev) {
    ev.preventDefault();
    var h = document.getElementById('account-delete-host');
    if (h) h.innerHTML = '';
  });
  actions.appendChild(cancelLink);

  panel.appendChild(actions);
  host.appendChild(panel);
}

// #8 Stage 1 (hub frame): per-uid live counts for the stat cards, seed
// excluded by ownership (userId !== '__praxis_seed__'). Books read from the
// per-user shelf (state.userBooks[uid].bookIds), which never holds the
// sentinel seed books; arcs / sub-theories / marginalia are own-records
// only. Promise-free, hasOwnProperty-guarded -> ES3 / cscript-parseable.
function _accountCounts(uid) {
  var out = { books: 0, arcs: 0, subTheories: 0, marginalia: 0 };
  if (!uid) { return out; }
  if (state.userBooks && state.userBooks[uid] &&
      state.userBooks[uid].bookIds) {
    out.books = state.userBooks[uid].bookIds.length;
  }
  var k;
  if (state.arcs) {
    for (k in state.arcs) {
      if (state.arcs.hasOwnProperty(k) && state.arcs[k] &&
          state.arcs[k].userId === uid) {
        out.arcs = out.arcs + 1;
      }
    }
  }
  if (state.subTheories) {
    for (k in state.subTheories) {
      if (state.subTheories.hasOwnProperty(k) && state.subTheories[k] &&
          state.subTheories[k].userId === uid) {
        out.subTheories = out.subTheories + 1;
      }
    }
  }
  if (state.notebookEntries) {
    for (k in state.notebookEntries) {
      if (state.notebookEntries.hasOwnProperty(k) &&
          state.notebookEntries[k] &&
          state.notebookEntries[k].register === 'marginalia' &&
          state.notebookEntries[k].userId === uid) {
        out.marginalia = out.marginalia + 1;
      }
    }
  }
  return out;
}

// #8 Stage 1/2: one stat card -- a token-built surface (no .card class
// exists). Stage 2: each card carries its category key and a click that
// toggles the one inline panel via _accountToggleCategory. A zero count
// renders as "0" via string coercion.
function _accountStatCard(label, value, key) {
  var card = document.createElement('div');
  card.className = 'account-stat';
  card.setAttribute('data-account-cat', key);
  var v = document.createElement('div');
  v.className = 'account-stat-value';
  v.textContent = '' + value;
  card.appendChild(v);
  // Stage 6 (mockup-fidelity): label + caret share one flex row, justified
  // apart (mockup .stat .l), instead of two stacked blocks.
  var labelRow = document.createElement('div');
  labelRow.className = 'account-stat-labelrow';
  var l = document.createElement('div');
  l.className = 'account-stat-label';
  l.textContent = label;
  labelRow.appendChild(l);
  // #8 Stage 4c: quiet tap-affordance caret (token color via CSS).
  var caret = document.createElement('span');
  caret.className = 'account-stat-caret';
  caret.setAttribute('aria-hidden', 'true');
  caret.textContent = '▾';
  labelRow.appendChild(caret);
  card.appendChild(labelRow);
  card.addEventListener('click', function() {
    _accountToggleCategory(key, card);
  });
  return card;
}

// #8 Stage 2/4c: the ONE inline panel under the stat cards. PURE DOM -- never
// touches location.hash. A single open-state lives on the host's data-open
// attribute ('cat:<key>' for a stat category, 'sub:<id>' for a tapped mark),
// so the category path and the mark path MUTUALLY REPLACE and a same-item click
// collapses. _accountHostReset clears the panel, the marker, and every stat-card
// active state.
function _accountHostReset() {
  var host = document.querySelector('.account-expand-host');
  if (host) { host.innerHTML = ''; host.removeAttribute('data-open'); }
  var cards = document.querySelectorAll('.account-stat');
  var i;
  for (i = 0; i < cards.length; i = i + 1) { cards[i].className = 'account-stat'; }
}

function _accountToggleCategory(key, cardEl) {
  var host = document.querySelector('.account-expand-host');
  if (!host) { return; }
  var was = host.getAttribute('data-open');
  _accountHostReset();
  if (was === 'cat:' + key) { return; }
  host.appendChild(_accountBuildCategoryPanel(key));
  host.setAttribute('data-open', 'cat:' + key);
  if (cardEl) { cardEl.className = 'account-stat account-stat-active'; }
}

// #8 Stage 4c: open a tapped mark's "standing place" panel in the shared host.
// Mutually replaces any open category (and clears its active card); clicking the
// same mark again collapses.
function _accountOpenMark(subId) {
  var host = document.querySelector('.account-expand-host');
  if (!host) { return; }
  var was = host.getAttribute('data-open');
  _accountHostReset();
  if (was === 'sub:' + subId) { return; }
  host.appendChild(_accountBuildMarkPanel(subId));
  host.setAttribute('data-open', 'sub:' + subId);
  if (typeof host.scrollIntoView === 'function') {
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// #8 Stage 4c: the "standing place" panel for one sub-theory (mark-click target).
// Reads the live record: title + context line ("in <arc>" ONLY when the arc is
// the user's OWN -- hidden for the sentinel seed -- plus N evidence / N
// marginalia) + "open in full ->" (#subtheory/<id>) + a reflection footer. The
// close (x) resets the host.
function _accountBuildMarkPanel(subId) {
  var panel = document.createElement('div');
  panel.className = 'account-expand-panel account-mark-panel';
  var sub = (state.subTheories && state.subTheories[subId]) ? state.subTheories[subId] : null;
  if (!sub) {
    panel.appendChild(_accountEmptyRow('That idea is no longer here.'));
    return panel;
  }
  var user = getCurrentUser();
  var uid = user && user.uid;

  // #8 v3.105: reuse the shared header (adds the STILL ON YOUR ACCOUNT eyebrow
  // to match the category panels). Title = the sub-theory label.
  panel.appendChild(_accountBuildPanelHead(subTheoryRowLabel(sub), 'account-panel-title'));

  var arc = (sub.arcId && state.arcs) ? state.arcs[sub.arcId] : null;
  var parts = [];
  if (arc && arc.userId === uid && arc.title) { parts.push('in ' + arc.title); }
  var evCount = (sub.evidence && sub.evidence.length) ? sub.evidence.length : 0;
  var margCount = (sub.attachedMarginalia && sub.attachedMarginalia.length)
    ? sub.attachedMarginalia.length : 0;
  parts.push(evCount + ' evidence');
  parts.push(margCount + ' marginalia');
  var ctx = document.createElement('p');
  ctx.className = 'account-mark-context';
  ctx.textContent = parts.join(' · ');
  panel.appendChild(ctx);

  var open = document.createElement('a');
  open.className = 'account-expand-more account-mark-open';
  open.href = '#subtheory/' + sub.id;
  open.textContent = 'open in full →';
  panel.appendChild(open);

  var foot = document.createElement('p');
  foot.className = 'account-mark-foot';
  foot.textContent = 'A standing place for what this idea is doing in your thinking.';
  panel.appendChild(foot);
  return panel;
}

// #8 Stage 2: one quiet empty-state line for a category with no items.
function _accountEmptyRow(msg) {
  var d = document.createElement('div');
  d.className = 'account-expand-empty';
  d.textContent = msg;
  return d;
}

// #8 Stage 2: a quiet "more ->" / "see all ->" tail link to a list surface.
function _accountMoreLink(label, hash) {
  var a = document.createElement('a');
  a.className = 'account-expand-more';
  a.href = hash;
  a.textContent = label;
  return a;
}

// #8 v3.105: shared panel header (category + mark panels). A mono "STILL ON
// YOUR ACCOUNT" eyebrow over a serif title, plus a close (x) wired to collapse
// the host (_accountHostReset clears the panel, the marker, and active cards).
function _accountBuildPanelHead(titleText, titleClass) {
  var head = document.createElement('div');
  head.className = 'account-panel-head';
  var col = document.createElement('div');
  col.className = 'account-panel-head-text';
  var eb = document.createElement('p');
  eb.className = 'account-panel-eyebrow';
  eb.textContent = 'STILL ON YOUR ACCOUNT';
  col.appendChild(eb);
  var title = document.createElement('h3');
  title.className = titleClass;
  title.textContent = titleText;
  col.appendChild(title);
  head.appendChild(col);
  var close = document.createElement('button');
  close.type = 'button';
  close.className = 'account-mark-close';
  close.setAttribute('aria-label', 'Close');
  close.textContent = '✕';
  close.addEventListener('click', function() { _accountHostReset(); });
  head.appendChild(close);
  return head;
}

// #8 Stage 2: composed sub-theory row (no row renderer exists). Reuses the
// glyph primitive _stPickerMarkSvg (NOT reimplemented), honoring
// sub.markShape / sub.markColor with stHashIndices(id) as the default, plus
// subTheoryRowLabel for the label; the whole row links to #subtheory/<id>.
function _accountSubTheoryRow(sub) {
  var row = document.createElement('a');
  row.className = 'account-row';
  row.href = '#subtheory/' + sub.id;
  var pal = (ls('praxis_constellation_palette', 'colorful') === 'muted') ? 'muted' : 'colorful';
  var hash = (typeof window.stHashIndices === 'function')
    ? window.stHashIndices(sub.id) : { shapeIdx: 0, colorIdx: 0 };
  var shape = (typeof sub.markShape === 'number' && sub.markShape >= 0 && sub.markShape <= 15)
    ? sub.markShape : hash.shapeIdx;
  var color = (typeof sub.markColor === 'number' && sub.markColor >= 0 && sub.markColor <= 15)
    ? sub.markColor : hash.colorIdx;
  var glyph = document.createElement('span');
  glyph.className = 'account-row-mark';
  glyph.innerHTML = _stPickerMarkSvg(sub.id, shape, color, pal, false);
  row.appendChild(glyph);
  var txt = document.createElement('span');
  txt.className = 'account-row-text';
  var title = document.createElement('span');
  title.className = 'account-row-title';
  title.textContent = subTheoryRowLabel(sub);
  txt.appendChild(title);
  // Subtitle: "in <arc> · N evidence". The "in <arc>" clause appears ONLY when
  // the arc is the user's OWN (seed-attached subs hide it), mirroring the mark
  // panel's context line.
  var meta = document.createElement('span');
  meta.className = 'account-row-sub';
  var arc = (sub.arcId && state.arcs) ? state.arcs[sub.arcId] : null;
  var u = getCurrentUser();
  var uid = u && u.uid;
  var parts = [];
  if (arc && arc.userId === uid && arc.title) { parts.push('in ' + arc.title); }
  var evCount = (sub.evidence && sub.evidence.length) ? sub.evidence.length : 0;
  parts.push(evCount + ' evidence');
  meta.textContent = parts.join(' · ');
  txt.appendChild(meta);
  row.appendChild(txt);
  var open = document.createElement('span');
  open.className = 'account-row-open';
  open.textContent = 'open →';
  row.appendChild(open);
  return row;
}

// #8 v3.105: account-only arc row (the SHARED renderArcRow is left untouched).
// Arc title (italic-serif) + "N sub-theories" meta (the user's OWN subs in this
// arc) + a teal "open ->" to #arc/<id>.
function _accountCountSubsInArc(arcId, uid) {
  var n = 0, k;
  if (state.subTheories) {
    for (k in state.subTheories) {
      if (state.subTheories.hasOwnProperty(k) && state.subTheories[k] &&
          state.subTheories[k].arcId === arcId && state.subTheories[k].userId === uid) {
        n = n + 1;
      }
    }
  }
  return n;
}

function _accountArcRow(arc) {
  var row = document.createElement('a');
  row.className = 'account-row';
  row.href = '#arc/' + arc.id;
  var txt = document.createElement('span');
  txt.className = 'account-row-text';
  var title = document.createElement('span');
  title.className = 'account-row-title';
  title.textContent = arc.title || '';
  txt.appendChild(title);
  var u = getCurrentUser();
  var n = _accountCountSubsInArc(arc.id, u && u.uid);
  var meta = document.createElement('span');
  meta.className = 'account-row-sub';
  meta.textContent = n + (n === 1 ? ' sub-theory' : ' sub-theories');
  txt.appendChild(meta);
  row.appendChild(txt);
  var open = document.createElement('span');
  open.className = 'account-row-open';
  open.textContent = 'open →';
  row.appendChild(open);
  return row;
}

// #8 Stage 2: lightweight READ-ONLY marginalia row for the hub panel. The
// shared renderNotebookEntry carries live privacy/delete/add-to-arc
// affordances and is reused in ~4 places, so it is NOT modified here; this
// row shows only the source + a one-line snippet (full text + actions live
// behind the panel's "See all in Notebook ->" deep path). No per-item route.
function _accountMarginaliaRow(entry) {
  // #8 v3.105: snippet (italic-serif title) over a "from <book>" subtitle.
  // READ-ONLY -- emitted as a <div>, so the a.account-row:hover never applies
  // and there is no per-row open-> (full text lives behind "See all in
  // Notebook ->").
  var row = document.createElement('div');
  row.className = 'account-row account-marg-row';
  var txt = document.createElement('span');
  txt.className = 'account-row-text';
  var snip = document.createElement('span');
  snip.className = 'account-row-title';
  snip.textContent = (typeof entry.body === 'string') ? entry.body : '';
  txt.appendChild(snip);
  var bookId = (entry.bookIds && entry.bookIds[0]) || null;
  var book = (bookId && state.books && state.books[bookId]) || null;
  var bookTitle = (book && book.title) || '(unknown book)';
  var src = document.createElement('span');
  src.className = 'account-row-sub';
  src.textContent = 'from ' + bookTitle;
  txt.appendChild(src);
  row.appendChild(txt);
  return row;
}

// #8 Stage 2: build the inline panel for one category, reusing the located
// row renderers and reading FRESH seed-excluded (userId===uid) state on each
// open. Books cap at 8 most-recent (+ "more ->"); arcs / sub-theories (incl.
// drafts) / marginalia list all. Marginalia rows (_accountMarginaliaRow,
// read-only) carry no per-item route, so the panel tail routes to #notebook.
function _accountBuildCategoryPanel(key) {
  var panel = document.createElement('div');
  panel.className = 'account-expand-panel';
  var user = getCurrentUser();
  if (!user || !user.uid) {
    panel.appendChild(_accountEmptyRow('Sign in to see this.'));
    return panel;
  }
  var uid = user.uid;
  // #8 v3.105: panel header -- "Your <cat>" serif title + STILL ON YOUR ACCOUNT
  // eyebrow + a close (x). Sits above the reused rows; close collapses the host.
  var catLabels = { books: 'Books', arcs: 'Arcs', subtheories: 'Sub-theories', marginalia: 'Marginalia' };
  panel.appendChild(_accountBuildPanelHead('Your ' + (catLabels[key] || key), 'account-panel-title'));
  var k, i;

  if (key === 'books') {
    var ids = (state.userBooks && state.userBooks[uid] && state.userBooks[uid].bookIds)
      ? state.userBooks[uid].bookIds : [];
    var books = [];
    for (i = 0; i < ids.length; i = i + 1) {
      if (state.books && state.books[ids[i]]) { books.push(state.books[ids[i]]); }
    }
    books.sort(function(a, b) { return (b.addedAt || 0) - (a.addedAt || 0); });
    if (!books.length) { panel.appendChild(_accountEmptyRow('No books on your shelf yet.')); return panel; }
    var cap = 8;
    var shown = (books.length > cap) ? cap : books.length;
    for (i = 0; i < shown; i = i + 1) { panel.appendChild(renderShelfBookRow(books[i])); }
    if (books.length > cap) {
      panel.appendChild(_accountMoreLink('+' + (books.length - cap) + ' more →', '#books'));
    }
    return panel;
  }

  if (key === 'arcs') {
    var arcs = [];
    if (state.arcs) {
      for (k in state.arcs) {
        if (state.arcs.hasOwnProperty(k) && state.arcs[k] && state.arcs[k].userId === uid) {
          arcs.push(state.arcs[k]);
        }
      }
    }
    arcs.sort(function(a, b) { return (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0); });
    if (!arcs.length) { panel.appendChild(_accountEmptyRow('No arcs yet.')); return panel; }
    for (i = 0; i < arcs.length; i = i + 1) { panel.appendChild(_accountArcRow(arcs[i])); }
    return panel;
  }

  if (key === 'subtheories') {
    var subs = [];
    if (state.subTheories) {
      for (k in state.subTheories) {
        if (state.subTheories.hasOwnProperty(k) && state.subTheories[k] && state.subTheories[k].userId === uid) {
          subs.push(state.subTheories[k]);
        }
      }
    }
    subs.sort(function(a, b) { return (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0); });
    if (!subs.length) { panel.appendChild(_accountEmptyRow('No sub-theories yet.')); return panel; }
    for (i = 0; i < subs.length; i = i + 1) { panel.appendChild(_accountSubTheoryRow(subs[i])); }
    return panel;
  }

  if (key === 'marginalia') {
    var ents = [];
    if (state.notebookEntries) {
      for (k in state.notebookEntries) {
        if (state.notebookEntries.hasOwnProperty(k) && state.notebookEntries[k] &&
            state.notebookEntries[k].register === 'marginalia' &&
            state.notebookEntries[k].userId === uid) {
          ents.push(state.notebookEntries[k]);
        }
      }
    }
    ents.sort(function(a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
    if (!ents.length) { panel.appendChild(_accountEmptyRow('No marginalia yet.')); return panel; }
    for (i = 0; i < ents.length; i = i + 1) { panel.appendChild(_accountMarginaliaRow(ents[i])); }
    panel.appendChild(_accountMoreLink('See all in Notebook →', '#notebook'));
    return panel;
  }

  return panel;
}

// #8 Stage 3 (constellation): OWNER-KEYED aggregator -> ONE synthetic contract
// in renderSubTheoryConstellation's shape, from the user's OWN sub-theories
// only (userId === uid -- auto-excludes the '__praxis_seed__' sentinel). Marks
// are built by REUSE: for each distinct arc the user's subs sit in, call
// _arcDetailBuildSubTheoryData(arc) and keep only entries that map back to a
// userId===uid record -- so a user sub attached to the seed arc still renders,
// while the seed's own example subs are dropped, and the seed arc is never
// rendered AS an arc (no seed question, no seed books). arcId is scalar so the
// per-arc sets are disjoint (no dedup). A user sub whose arc record is missing
// is excluded (no position to render). Edges are recomputed from
// linkedSubTheories among the RENDERED set only ({aId,bId}, symmetric-deduped)
// so both endpoints always resolve. question is '' -- _stRenderQuestion returns
// '' for an empty string (verified), so the center stays clean. ES3, sync.
function _accountBuildConstellationData() {
  var out = {
    id:           '__account_constellation__',
    question:     '',
    subTheories:  [],
    edges:        [],
    books:        [],
    yumiNoticing: []
  };
  var user = getCurrentUser();
  if (!user || !user.uid) { return out; }
  var uid = user.uid;

  // 1. The user's own sub-theory ids (excludes the sentinel by construction).
  var ownIds = {};
  var k, s;
  if (state.subTheories) {
    for (k in state.subTheories) {
      if (!state.subTheories.hasOwnProperty(k)) { continue; }
      s = state.subTheories[k];
      if (s && s.userId === uid && s.id) { ownIds[s.id] = true; }
    }
  }

  // 2. Distinct arcIds those subs sit in.
  var arcIdList = [];
  var arcSeen = {};
  if (state.subTheories) {
    for (k in state.subTheories) {
      if (!state.subTheories.hasOwnProperty(k)) { continue; }
      s = state.subTheories[k];
      if (s && s.userId === uid && s.arcId && !arcSeen[s.arcId]) {
        arcSeen[s.arcId] = true;
        arcIdList.push(s.arcId);
      }
    }
  }

  // 3. Per existing arc, reuse the shipped builder and keep only the user's
  //    entries -> pixel-identical marks via the same mapping.
  var kept = [];
  var keptIds = {};
  var i, arcRec, contract, j, entry;
  for (i = 0; i < arcIdList.length; i = i + 1) {
    arcRec = state.arcs ? state.arcs[arcIdList[i]] : null;
    if (!arcRec) { continue; }
    contract = _arcDetailBuildSubTheoryData(arcRec);
    for (j = 0; j < contract.subTheories.length; j = j + 1) {
      entry = contract.subTheories[j];
      if (entry && ownIds[entry.id] && !keptIds[entry.id]) {
        kept.push(entry);
        keptIds[entry.id] = true;
      }
    }
  }
  out.subTheories = kept;

  // 4. Edges among the RENDERED set only (both endpoints guaranteed present).
  var edges = [];
  var seenEdge = {};
  var links, lj, bId, pairKey;
  if (state.subTheories) {
    for (k in state.subTheories) {
      if (!state.subTheories.hasOwnProperty(k)) { continue; }
      s = state.subTheories[k];
      if (!s || s.userId !== uid || !keptIds[s.id]) { continue; }
      links = s.linkedSubTheories;
      if (!links || !links.length) { continue; }
      for (lj = 0; lj < links.length; lj = lj + 1) {
        bId = links[lj];
        if (!keptIds[bId]) { continue; }
        pairKey = (s.id < bId) ? (s.id + '|' + bId) : (bId + '|' + s.id);
        if (seenEdge[pairKey]) { continue; }
        seenEdge[pairKey] = true;
        edges.push({ aId: s.id, bId: bId });
      }
    }
  }
  out.edges = edges;

  return out;
}

// #8 Stage 4a: schema-free "reading since" label from the LIVE Firebase auth
// creation time (firebase.auth().currentUser.metadata.creationTime -- a built-in
// auth field, no stored field / no migration). Returns "Month YYYY", or '' when
// unavailable (cold pre-auth load / offline) so the caller drops the line rather
// than printing "undefined". ES3 month-name array; try/catch, no promises.
function _accountReadingSince() {
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var ct = null;
  try {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      var au = firebase.auth().currentUser;
      if (au && au.metadata && au.metadata.creationTime) {
        ct = au.metadata.creationTime;
      }
    }
  } catch (e) {
    ct = null;
  }
  if (!ct) { return ''; }
  var d = new Date(ct);
  if (!d || isNaN(d.getTime())) { return ''; }
  return MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

// #8 Stage 4a revision: pure-DOM toggle for the hero's hidden edit form (the
// DISPLAY NAME / PEN NAME / Save-profile block). classList toggle only -- never
// touches location.hash, so the form survives. Mirrors the Stage-2 toggle
// pattern; the button carries an active state, and a reveal scrolls the form
// into view (the "Edit profile" button lives in the data card at the foot). No
// modal, no new view -- it only gates the existing form's visibility.
function _accountToggleEditForm(formEl, btnEl) {
  if (!formEl) { return; }
  var nowOpen = formEl.classList.toggle('account-edit-form-open');
  if (btnEl) {
    if (nowOpen) {
      btnEl.classList.add('account-edit-active');
    } else {
      btnEl.classList.remove('account-edit-active');
    }
  }
  if (nowOpen && typeof formEl.scrollIntoView === 'function') {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// #8 Stage 1 (hub FRAME): the Account page deepened into the "your standing
// place" hub. Top->bottom: hero (eyebrow + display name + pen sub-line +
// email + the wired profile editor), an empty constellation slot (Stage 3),
// four live stat cards (Books / Arcs / Sub-theories / Marginalia, seed
// excluded, clickable-but-inert), an empty expand-panel host (Stage 2), and
// the data block (export / sign out / delete) reused verbatim at the foot.
// getCurrentUser-gated: a signed-out visitor gets a sign-in prompt. All
// colour from CSS variables; Cormorant via --font-serif on .account-hero-name.
function renderAccountPage() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'account';

  // ----- HERO -----
  var hero = document.createElement('header');
  hero.className = 'account-hero';
  var acctEyebrow = document.createElement('p');
  acctEyebrow.className = 'eyebrow';
  acctEyebrow.textContent = 'your standing place';

  var user = getCurrentUser();
  if (!user || !user.uid) {
    hero.appendChild(acctEyebrow);
    var soName = document.createElement('h1');
    soName.className = 'account-hero-name';
    soName.textContent = 'Account';
    hero.appendChild(soName);
    wrap.appendChild(hero);

    var signinCopy = document.createElement('p');
    signinCopy.className = 'account-signin-copy';
    signinCopy.textContent = 'Sign in to manage your account.';
    wrap.appendChild(signinCopy);

    var signinBtn = document.createElement('button');
    signinBtn.type = 'button';
    signinBtn.className = 'shelf-signin-prompt';
    signinBtn.textContent = 'Sign in';
    signinBtn.addEventListener('click', function() {
      signInWithGoogle();
    });
    wrap.appendChild(signinBtn);

    host.appendChild(wrap);
    return;
  }

  var uid = user.uid;
  var profile = getProfile(uid);

  // #8 Stage 4a: the hero is now a card -- a gradient avatar beside a text
  // column (eyebrow + name + pen + email). Signed-out keeps the plain stack.
  hero.className = 'account-hero account-card';

  // Avatar: hero-sized gradient circle holding the initial. The initial recipe
  // REPLICATES renderRoute's avatar derivation: displayName -> email -> 'P',
  // uppercased. Token-only (--grad / --text-on-dark via .account-hero-avatar).
  var heroInitial = 'P';
  if (typeof user.displayName === 'string' && user.displayName.length > 0) {
    heroInitial = user.displayName.charAt(0).toUpperCase();
  } else if (typeof user.email === 'string' && user.email.length > 0) {
    heroInitial = user.email.charAt(0).toUpperCase();
  }
  var avatar = document.createElement('div');
  avatar.className = 'account-hero-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = heroInitial;
  hero.appendChild(avatar);

  var heroText = document.createElement('div');
  heroText.className = 'account-hero-text';

  // #8 Stage 4a: append "reading since <Month YYYY>" to the eyebrow when the
  // live Firebase creation time resolves; otherwise leave the base eyebrow.
  var sinceLabel = _accountReadingSince();
  if (sinceLabel) {
    acctEyebrow.textContent = 'your standing place · reading since ' + sinceLabel;
  }
  heroText.appendChild(acctEyebrow);

  // Display name (Cormorant via .account-hero-name) -- the override, else the
  // auth display name, else a neutral fallback.
  var heroName = document.createElement('h1');
  heroName.className = 'account-hero-name';
  heroName.textContent = profile.displayNameOverride
    ? profile.displayNameOverride
    : (user.displayName ? user.displayName : 'Your account');
  heroText.appendChild(heroName);

  // #8 Stage 4b: one-line self-description under the name (italic-serif),
  // rendered ONLY when set (additive profile.tagline, default-on-read '').
  if (profile.tagline) {
    var heroTagline = document.createElement('p');
    heroTagline.className = 'account-hero-tagline';
    heroTagline.textContent = profile.tagline;
    heroText.appendChild(heroTagline);
  }

  // Pen name as the existing italic sub-line (.account-field-hint), shown
  // only when a pen name is set.
  if (profile.penName) {
    var heroPen = document.createElement('p');
    heroPen.className = 'account-field-hint';
    heroPen.textContent = 'Publishing as ' + profile.penName;
    heroText.appendChild(heroPen);
  }

  // Read-only "Signed in as <email>" line (mono), preserved from S7d.
  var emailLine = document.createElement('p');
  emailLine.className = 'account-signin-copy account-email-line';
  emailLine.textContent = 'Signed in as ' +
    (user.email ? user.email : '(no email on file)');
  heroText.appendChild(emailLine);

  hero.appendChild(heroText);
  wrap.appendChild(hero);

  // Profile editor (DISPLAY NAME / PEN NAME + Save). #8 Stage 4a revision:
  // wrapped as .account-edit-form, HIDDEN by default so the hero reads as a
  // clean identity card; the "Edit profile" action toggles it open. The form
  // markup + its Save-profile handler below are UNCHANGED -- only visibility.
  var profileBlock = document.createElement('div');
  profileBlock.className = 'account-block account-edit-form';

  var dnLabel = document.createElement('label');
  dnLabel.className = 'account-field-label';
  dnLabel.textContent = 'Display name';
  profileBlock.appendChild(dnLabel);

  var dnInput = document.createElement('input');
  dnInput.type = 'text';
  dnInput.className = 'account-field-input';
  dnInput.value = profile.displayNameOverride
    ? profile.displayNameOverride
    : (user.displayName ? user.displayName : '');
  profileBlock.appendChild(dnInput);

  var pnLabel = document.createElement('label');
  pnLabel.className = 'account-field-label';
  pnLabel.textContent = 'Pen name';
  profileBlock.appendChild(pnLabel);

  var pnHint = document.createElement('p');
  pnHint.className = 'account-field-hint';
  pnHint.textContent = 'Publish as -- e.g. Roland Blair';
  profileBlock.appendChild(pnHint);

  var pnInput = document.createElement('input');
  pnInput.type = 'text';
  pnInput.className = 'account-field-input';
  pnInput.value = profile.penName ? profile.penName : '';
  profileBlock.appendChild(pnInput);

  // #8 Stage 4b: self-description (tagline) -- additive profile field, default ''.
  var sdLabel = document.createElement('label');
  sdLabel.className = 'account-field-label';
  sdLabel.textContent = 'Self-description';
  profileBlock.appendChild(sdLabel);

  var sdInput = document.createElement('input');
  sdInput.type = 'text';
  sdInput.className = 'account-field-input';
  sdInput.setAttribute('placeholder', 'A one-line description of your reading life');
  sdInput.value = profile.tagline ? profile.tagline : '';
  profileBlock.appendChild(sdInput);

  var saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'notebook-new-entry account-save-btn';
  saveBtn.textContent = 'Save profile';
  profileBlock.appendChild(saveBtn);

  var saveNote = document.createElement('span');
  saveNote.className = 'account-save-note';
  profileBlock.appendChild(saveNote);

  saveBtn.addEventListener('click', function() {
    setProfile(uid, {
      displayNameOverride: dnInput.value.trim(),
      penName:             pnInput.value.trim(),
      tagline:             sdInput.value.trim()
    });
    saveNote.textContent = 'Saving...';
    saveProfileToFirestore(uid, getProfile(uid), function(r) {
      if (r && r.status === 'ok') {
        saveNote.textContent = 'Saved';
      } else {
        saveNote.textContent = 'Saved locally -- sync will retry on reload.';
      }
    });
  });

  wrap.appendChild(profileBlock);

  // ----- SECTION EYEBROW (#8 Stage 4a) -----
  var slotEyebrow = document.createElement('p');
  slotEyebrow.className = 'eyebrow';
  slotEyebrow.textContent = 'the shape of your thinking — tap a mark';
  wrap.appendChild(slotEyebrow);

  // ----- CONSTELLATION SLOT (Stage 3: inert owner-keyed constellation) -----
  // Render-then-attach-NOTHING, exactly like Home's embed (views.js Home path):
  // call renderSubTheoryConstellation, then attach no interaction layers (no
  // _stConstellationAttachInteractions, no attachSubTheoryDrag) -- so there is
  // no drag / connect / tap / hover anywhere. Marks only (showBooks:false,
  // showMarginalia:false, showFaint:false, showLegend:false); empty drafts read
  // faint via low maturity glow. When populated, the slot sheds its dashed
  // placeholder chrome (the renderer draws its own cream stage). Empty -> the
  // dashed placeholder stays.
  var constSlot = document.createElement('div');
  constSlot.className = 'account-constellation-slot';
  var constData = _accountBuildConstellationData();
  if (constData.subTheories.length > 0 &&
      typeof window.renderSubTheoryConstellation === 'function') {
    var ACCT_SVG_NS = 'http://www.w3.org/2000/svg';
    var constSvg = document.createElementNS(ACCT_SVG_NS, 'svg');
    constSvg.setAttribute('viewBox', '0 0 940 340');
    constSvg.setAttribute('xmlns', ACCT_SVG_NS);
    constSlot.appendChild(constSvg);
    constSlot.className = 'account-constellation-slot account-constellation-slot-filled';
    window.renderSubTheoryConstellation(constData, constSvg, {
      showBooks:      false,
      showMarginalia: false,
      showFaint:      false,
      showLegend:     false
    });
    // #8 Stage 4c: delegated mark-click -> open the sub-theory's standing-place
    // panel in the shared host (no navigation, no tooltip, no drag). Marks are
    // <g data-st-sub-id> shape groups; evidence dots carry data-st-mark and are
    // excluded so a dot-click resolves to its parent mark.
    constSvg.style.cursor = 'pointer';
    constSvg.addEventListener('click', function(ev) {
      var g = (ev.target && ev.target.closest)
        ? ev.target.closest('[data-st-sub-id]:not([data-st-mark])') : null;
      if (!g) { return; }
      var sid = g.getAttribute('data-st-sub-id');
      if (sid) { _accountOpenMark(sid); }
    });
  }
  wrap.appendChild(constSlot);

  // ----- SECTION EYEBROW + STAT CARDS (#8 Stage 4a eyebrow) -----
  var counts = _accountCounts(uid);
  var statsEyebrow = document.createElement('p');
  statsEyebrow.className = 'eyebrow';
  statsEyebrow.textContent = 'your reading life — tap to open it here';
  wrap.appendChild(statsEyebrow);
  var stats = document.createElement('div');
  stats.className = 'account-stats';
  stats.appendChild(_accountStatCard('Books', counts.books, 'books'));
  stats.appendChild(_accountStatCard('Arcs', counts.arcs, 'arcs'));
  stats.appendChild(_accountStatCard('Sub-theories', counts.subTheories, 'subtheories'));
  stats.appendChild(_accountStatCard('Marginalia', counts.marginalia, 'marginalia'));
  wrap.appendChild(stats);

  // ----- EXPAND-PANEL HOST (empty container; Stage 2 wires) -----
  var expandHost = document.createElement('div');
  expandHost.className = 'account-expand-host';
  wrap.appendChild(expandHost);

  // ----- STAGE 11: TRANSPARENCY ("what Praxis records / what Yumi sees") -----
  // Plain disclosure of what Praxis records (aggregate counts only, never
  // content) and the boundary on what Yumi can and cannot see, plus the
  // covenant figures themselves. The content-bearing figures come from
  // window.YumiBrain.getAggregateCounts(uid), which splits visible/private
  // through the SAME isPrivate filter Yumi reads through -- so private writing
  // is counted but never crosses to Yumi. Reuses existing card / copy / button
  // classes (no new styling -- logic only). Disclosure copy is accurate to the
  // live filter (journal private by default, marginalia visible by default,
  // Yumi sees any non-private entry); final wording set at the gate.
  var transCard = document.createElement('section');
  transCard.className = 'account-card account-data-card';

  var transEyebrow = document.createElement('p');
  transEyebrow.className = 'eyebrow';
  transEyebrow.textContent = 'what praxis records — and what yumi sees';
  transCard.appendChild(transEyebrow);

  var discRecords = document.createElement('p');
  discRecords.className = 'account-covenant';
  discRecords.textContent = 'What Praxis records: aggregate counts of your '
    + 'activity and which features you use. We never read the content of your '
    + 'notebook entries or marginalia for analytics.';
  transCard.appendChild(discRecords);

  var discYumiSees = document.createElement('p');
  discYumiSees.className = 'account-covenant';
  discYumiSees.textContent = 'What Yumi can see: your notebook entries, '
    + 'marginalia, and questions that are not private — she reads through the '
    + 'same privacy filter you control. Journal entries are private by default; '
    + 'marginalia and questions are visible by default. The "Yumi reads along" '
    + 'switch in your notebook turns all of it on or off.';
  transCard.appendChild(discYumiSees);

  var discYumiCannot = document.createElement('p');
  discYumiCannot.className = 'account-covenant';
  discYumiCannot.textContent = 'What Yumi cannot see: your private writing — '
    + 'journal entries by default, and everything when "Yumi reads along" is '
    + 'off. Your themes and collections are private to you.';
  transCard.appendChild(discYumiCannot);

  var discCovenant = document.createElement('p');
  discCovenant.className = 'account-covenant';
  discCovenant.textContent = 'The covenant: no asymmetric knowledge — the '
    + 'same boundary holds for the people who build Praxis.';
  transCard.appendChild(discCovenant);

  // The covenant figures, computed client-side through the isPrivate filter.
  var agg = (window.YumiBrain &&
    typeof window.YumiBrain.getAggregateCounts === 'function')
    ? window.YumiBrain.getAggregateCounts(uid) : null;
  if (agg) {
    var figures = document.createElement('p');
    figures.className = 'account-covenant';
    figures.textContent = 'Visible to Yumi right now: '
      + (agg.notebookVisible + agg.marginaliaVisible + agg.questionVisible)
      + ' entries (' + agg.notebookVisible + ' notebook, '
      + agg.marginaliaVisible + ' marginalia, ' + agg.questionVisible
      + ' questions). Private to you, never sent to Yumi: '
      + (agg.notebookPrivate + agg.marginaliaPrivate + agg.questionPrivate)
      + '. Across your work: ' + agg.books + ' books, ' + agg.arcs + ' arcs, '
      + agg.subTheories + ' sub-theories.';
    transCard.appendChild(figures);
  }

  var seesBtn = document.createElement('button');
  seesBtn.type = 'button';
  seesBtn.className = 'notebook-new-entry account-secondary-btn';
  seesBtn.textContent = 'See what Yumi sees right now';
  seesBtn.addEventListener('click', function() {
    location.hash = 'yumi-sees';
  });
  transCard.appendChild(seesBtn);

  wrap.appendChild(transCard);

  // ----- DATA BLOCK -> "YOUR DATA" CARD (#8 Stage 4a) -----
  var dataCard = document.createElement('section');
  dataCard.className = 'account-card account-data-card';

  var dataEyebrow = document.createElement('p');
  dataEyebrow.className = 'eyebrow';
  dataEyebrow.textContent = 'your data';
  dataCard.appendChild(dataEyebrow);

  var covenant = document.createElement('p');
  covenant.className = 'account-covenant';
  covenant.textContent = 'Your library, your arcs, your notebook — they ' +
    'live in your account, and they\'re yours. Take a copy or remove them ' +
    'whenever you like.';
  dataCard.appendChild(covenant);

  // Workspace actions: edit profile (toggles the hero form) + export + sign out.
  var actionsBlock = document.createElement('div');
  actionsBlock.className = 'account-block account-actions';

  // #8 Stage 4a revision: Edit profile is the FIRST action -- it toggles the
  // hidden DISPLAY NAME / PEN NAME form (pure DOM, no hash). No Theme button.
  var editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'notebook-new-entry account-secondary-btn';
  editBtn.textContent = 'Edit profile';
  editBtn.addEventListener('click', function() {
    _accountToggleEditForm(profileBlock, editBtn);
  });
  actionsBlock.appendChild(editBtn);

  var exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.className = 'notebook-new-entry account-secondary-btn';
  exportBtn.textContent = 'Export to JSON';
  exportBtn.addEventListener('click', function() {
    var data = exportWorkspace();
    if (!data) return;
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'praxis-workspace-' + uid.slice(0, 6) + '-' +
                 exportDateStamp() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
  actionsBlock.appendChild(exportBtn);

  var signoutBtn = document.createElement('button');
  signoutBtn.type = 'button';
  signoutBtn.className = 'notebook-new-entry account-secondary-btn';
  signoutBtn.textContent = 'Sign out';
  signoutBtn.addEventListener('click', function() {
    signOut();
  });
  actionsBlock.appendChild(signoutBtn);

  wrap.appendChild(dataCard);

  // #8 Stage 4c: the actions row lives in its OWN card below the covenant card.
  var actionsCard = document.createElement('section');
  actionsCard.className = 'account-card account-actions-card';
  actionsCard.appendChild(actionsBlock);
  wrap.appendChild(actionsCard);

  // Danger zone: irreversible account deletion behind an in-DOM confirm.
  var dangerBlock = document.createElement('div');
  dangerBlock.className = 'account-card account-danger';

  var dangerLabel = document.createElement('p');
  dangerLabel.className = 'account-danger-label';
  dangerLabel.textContent = 'Delete account';
  dangerBlock.appendChild(dangerLabel);

  var dangerDesc = document.createElement('p');
  dangerDesc.className = 'account-danger-desc';
  dangerDesc.textContent = 'Permanently removes your account and everything ' +
    'in it. This can\'t be undone.';
  dangerBlock.appendChild(dangerDesc);

  var deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'notebook-new-entry account-delete-btn';
  deleteBtn.textContent = 'Delete account';
  deleteBtn.addEventListener('click', function() {
    openAccountDeleteConfirm(uid);
  });
  dangerBlock.appendChild(deleteBtn);

  var deleteHost = document.createElement('div');
  deleteHost.id = 'account-delete-host';
  dangerBlock.appendChild(deleteHost);

  wrap.appendChild(dangerBlock);

  host.appendChild(wrap);
}

window.views = {
  renderRoute:           renderRoute,
  renderAccountPage:     renderAccountPage,
  renderNotebook:        renderNotebook,
  renderShelf:           renderShelf,
  renderBookDetail:      renderBookDetail,
  renderArtifact:        renderArtifact,
  openJournalEditor:     openJournalEditor,
  openMarginaliaEditor:  openMarginaliaEditor,
  openShelfEditor:       openShelfEditor,
  openNotebookSettings:  openNotebookSettings,
  setRegisterDefault:    setRegisterDefault,
  openTransparencyView:  openTransparencyView,
  closeTransparencyView: closeTransparencyView
};

console.log('views.js loaded');
