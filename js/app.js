// =====================================================================
// app.js -- Praxis startup, navigation, init
//
// Stage 3.1: DOMContentLoaded loads + saves state, defaults the URL
// hash to #notebook on cold open, then hands off to views.renderRoute.
// A hashchange listener re-routes on every nav-bar click.
// =====================================================================

'use strict';

document.addEventListener('DOMContentLoaded', function() {
  console.log('App init');
  loadState();
  saveState();
  if (location.hash === '') {
    location.hash = '#notebook';
  }
  window.views.renderRoute();
  window.addEventListener('hashchange', function() {
    window.views.renderRoute();
  });

  // Stage 5.3 Stage 3a: async cover backfill for the seeded "Pedagogy
  // of Desire" books. The migration step (state.js 1.9.3 -> 1.10.0)
  // writes book records with coverUrl: null; the existing
  // fetchAndApplyCover helper (views.js) handles OL primary +
  // Google Books fallback and patches state.books[id].coverUrl on
  // settle. Null-as-retry-trigger: any seed book whose coverUrl is
  // still null on a future load gets re-attempted automatically,
  // which makes transient OL outages self-healing without extra
  // state. Fail-soft: if OL is permanently down, the books render
  // via the existing cover-placeholder branch in renderShelfBook /
  // renderBookDetail. Re-render on settle is intentionally NOT
  // wired here -- Stage 3b owns the Arcs-page render path; this
  // function only mutates state so the NEXT render (Stage 3b card,
  // arc detail navigation, etc.) sees the resolved cover URL.
  if (state.seeds &&
      state.seeds.pedagogyOfDesire &&
      state.seeds.pedagogyOfDesire.bookIds &&
      typeof fetchAndApplyCover === 'function') {
    var seedIds = state.seeds.pedagogyOfDesire.bookIds;
    var bi;
    for (bi = 0; bi < seedIds.length; bi++) {
      var sbid = seedIds[bi];
      var sbook = state.books && state.books[sbid];
      if (sbook &&
          sbook.coverUrl === null &&
          typeof sbook.isbn === 'string' &&
          sbook.isbn.length > 0) {
        // No onComplete callback -- the settle path inside
        // fetchAndApplyCover already calls markBooksDirty + saveState.
        fetchAndApplyCover(sbid, sbook.isbn, function() {});
      }
    }
  }
});
