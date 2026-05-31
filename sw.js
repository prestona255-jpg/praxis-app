// =====================================================================
// sw.js -- Praxis Service Worker
//
// 1.5 ships the real shell: cache-first for the app shell, network-only
// for API + third-party CDNs. CACHE_VERSION is bumped on each shipping
// stage to invalidate stale caches. var/function only -- no const,
// let, arrow, class, or template literals anywhere.
// =====================================================================

var CACHE_VERSION = 'praxis-v3.13-b';

var APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/theme.css',
  '/assets/components.css',
  '/assets/icon.svg',
  '/assets/wheat-field.svg',
  '/js/state.js',
  '/js/tradition-forms-arc.js',
  '/js/arc-constellation.js',
  '/js/integrations.js',
  '/js/yumi-brain.js',
  '/js/arcs.js',
  '/js/voice-input.js',
  '/js/yumi-ui.js',
  '/js/views.js',
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
  self.skipWaiting();
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
  if (isApiRequest(event.request.url)) {
    event.respondWith(fetch(event.request));
    return;
  }
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
