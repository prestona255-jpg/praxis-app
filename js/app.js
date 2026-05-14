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
});
