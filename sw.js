// =====================================================================
// sw.js -- Praxis Service Worker
//
// STAGE 1.1 STUB: install handler is a no-op. Real cache-first shell
// + network-first API logic lands in Sub-stage 1.5. CACHE_VERSION
// pattern mirrors HQ (var, string literal, bumped on each deploy).
// =====================================================================

var CACHE_VERSION = 'praxis-v1';

self.addEventListener('install', function(event) {
  // No-op at 1.1 -- caching strategy lives in Sub-stage 1.5.
});
