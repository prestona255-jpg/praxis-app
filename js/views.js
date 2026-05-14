// =====================================================================
// views.js -- Page render functions for every Praxis view
//
// Stage 3.1 wiring: renderRoute() is the entry point called by app.js
// on DOMContentLoaded and on every 'hashchange'. It reads
// location.hash and dispatches to a per-route renderer. For 3.1 the
// only route is #notebook -- empty hash and unknown hashes both fall
// through to renderNotebook. Later stages will add #book/:id and
// #arc/:id by extending renderRoute's dispatch.
//
// renderNotebook paints the Notebook empty state into #app: a
// section title plus a single paragraph of instructional copy in
// the app literary register. No "I" pronouns, no Yumi voice -- the
// surface speaks about itself, declaratively.
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
  // Unknown-route fallback for 3.1; later stages will add explicit
  // cases (#book/:id, #arc/:id) above this line before the default.
  renderNotebook();
}

function renderNotebook() {
  var host = document.getElementById(APP_EL_ID);
  if (!host) return;
  host.innerHTML = '';

  var wrap = document.createElement('section');
  wrap.className = 'notebook-empty';

  var title = document.createElement('h1');
  title.className = 'notebook-empty-title';
  title.textContent = 'Notebook';

  var body = document.createElement('p');
  body.className = 'notebook-empty-body';
  body.textContent =
    'A notebook holds two kinds of writing: marginalia kept close ' +
    'to particular books, and journal entries that range further. ' +
    'Both live here. Nothing has been written yet.';

  wrap.appendChild(title);
  wrap.appendChild(body);
  host.appendChild(wrap);
}

window.views = {
  renderRoute:    renderRoute,
  renderNotebook: renderNotebook
};

console.log('views.js loaded');
