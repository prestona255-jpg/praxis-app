// =====================================================================
// sw.js -- Praxis Service Worker
//
// 1.5 ships the real shell: cache-first for the app shell, network-only
// for API + third-party CDNs. CACHE_VERSION is bumped on each shipping
// stage to invalidate stale caches. var/function only -- no const,
// let, arrow, class, or template literals anywhere.
// =====================================================================

var CACHE_VERSION = 'praxis-v3.258';

var APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/theme.css',
  '/assets/components.css',
  '/assets/praxis-kit.css',
  '/assets/lumen-amber.css',
  '/assets/marks.js',
  '/assets/icon.svg',
  '/assets/icon-maskable.svg',
  '/assets/wheat-field.svg',
  '/js/state.js',
  '/js/measure.js',
  '/js/recognition.js',
  '/js/room-field.js',
  '/js/tradition-forms-arc.js',
  '/js/arc-constellation.js',
  '/js/integrations.js',
  '/js/yumi-brain.js',
  '/js/arcs.js',
  '/js/voice-input.js',
  '/js/yumi-ui.js',
  '/js/spotlight.js',
  '/js/writing-canvas.js',
  '/js/views.js',
  '/js/import-capture.js',
  '/js/app.js'
];

function isApiRequest(url) {
  if (url.indexOf('/.netlify/functions/') !== -1) return true;
  if (url.indexOf('openlibrary.org') !== -1) return true;
  if (url.indexOf('googleapis.com') !== -1) return true;
  if (url.indexOf('gstatic.com') !== -1) return true;
  if (url.indexOf('firebaseio.com') !== -1) return true;
  if (url.indexOf('firebaseapp.com') !== -1) return true;
  return false;
}

// 3.10b-i SW-FIX: install-time precache that defeats the active-SW
// interception pattern. cache.addAll() routes its internal fetches
// through the still-active OLD SW's fetch handler -- which is cache-
// first, so the new cache gets poisoned with stale bytes from the
// old cache. Fix: fetch each APP_SHELL url with a cache-busted query
// string (?sw_v=<CACHE_VERSION>), {cache: 'reload'} to bypass the
// browser HTTP cache too. The old SW's caches.match() misses on the
// busted URL (its cache only holds canonical URLs), falls through to
// network, returns fresh bytes. We then cache.put() under the
// CANONICAL url so page-level fetches hit the precache normally.
// Builds the busted URL with a ?-vs-& check so a future APP_SHELL
// entry carrying a query string still works.
function precacheFresh(cache, url) {
  var bustedUrl = url +
    (url.indexOf('?') === -1 ? '?' : '&') +
    'sw_v=' + encodeURIComponent(CACHE_VERSION);
  var req = new Request(bustedUrl, { cache: 'reload' });
  return fetch(req).then(function (response) {
    if (response && response.ok) {
      return cache.put(url, response);
    }
    return null;
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      var puts = [];
      var i;
      for (i = 0; i < APP_SHELL.length; i++) {
        puts.push(precacheFresh(cache, APP_SHELL[i]));
      }
      return Promise.all(puts);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      var deletions = [];
      var i;
      for (i = 0; i < keys.length; i++) {
        if (keys[i] !== CACHE_VERSION) {
          deletions.push(caches.delete(keys[i]));
        }
      }
      return Promise.all(deletions);
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  // SCHEME GUARD (R-POLISH B4-FIX). The Cache API accepts http/https ONLY, so an
  // extension-origin request (chrome-extension://, moz-extension://, and the
  // Firefox/Safari equivalents) reaches cache.put below and throws
  //   "Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension'
  //    is unsupported"
  // which surfaces in the console as an unhandled rejection, because the
  // caches.open() chain has no .catch().
  // FILTERED AT THE REQUEST, NOT THE RESPONSE — that distinction is the whole
  // fix. The existing guard below tests `response.type === 'basic'`, which does
  // NOT exclude these; by the time it runs the request has already been fetched
  // and is on its way to a put() that cannot succeed. Returning here means such
  // requests never enter the handler at all: no wasted fetch, no doomed put, and
  // the browser handles them exactly as it would with no service worker.
  // Deliberately NOT a .catch() on the put — that silences the symptom and
  // leaves the pointless fetch in place.
  if (event.request.url.indexOf('http:') !== 0 &&
      event.request.url.indexOf('https:') !== 0) return;
  // API + streaming requests (incl. Firestore Listen channels) pass through
  // untouched. respondWith() on a continuously re-opening stream pins the
  // active worker as busy, which blocks waiting-worker promotion -- the
  // Reload banner stalls until every client closes (3 deploys observed).
  if (isApiRequest(event.request.url)) return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var copy = response.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return response;
      }).catch(function () {
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// 14.4(INF-4): controlled skip-waiting. install() no longer calls
// skipWaiting() unconditionally; a new SW now parks in 'waiting' until
// the page tells it to take over (after the user clicks Reload on the
// update banner). This stops a surprise activation from reloading a tab
// mid-session and eating unsaved Notebook/Yumi text.
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
