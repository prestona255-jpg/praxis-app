// =====================================================================
// sw.js -- Praxis Service Worker
//
// 1.5 ships the real shell: cache-first for the app shell, network-only
// for API + third-party CDNs. CACHE_VERSION is bumped on each shipping
// stage to invalidate stale caches. var/function only -- no const,
// let, arrow, class, or template literals anywhere.
// =====================================================================

var CACHE_VERSION = 'praxis-v2.10-a';

var APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/theme.css',
  '/assets/icon.svg',
  '/js/state.js',
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

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(APP_SHELL);
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
