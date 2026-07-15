// ── PRAXIS DW RIG · seed + auth stub + force-settle ──────────────────────────
// Paste-able IIFE for the Browser pane's javascript_tool. Returns a JSON string.
//
// Extracted at DW batch 4 (2026-07-14) under the rig-efficiency law.
//
// What it does, in order:
//   1. Unregisters every service worker and deletes every cache. THE SW
//      PRECACHES index.html + components.css — skip this and you measure a
//      STALE bundle and your gates are fiction.
//   2. Force-settles transitions/animations. Reveal animations otherwise leave
//      rects mid-flight and a settled surface reads as a bug (W9 lesson).
//   3. Stubs auth by seeding `praxis_user` — getCurrentUser() is
//      ls('praxis_user') (integrations.js:660), so this is the whole seam.
//      uid `d0tester` matches the D0 recon rig so measurements are comparable.
//
// The __praxis_seed__ "Pedagogy of Desire" workspace SELF-SEEDS on a fresh
// origin (5 books, 1 arc, 4 sub-theories, 16 notebook entries, 1 bookArtifact
// keyed `__praxis_seed__:<bookId>`). You do NOT need to inject it.
//
// CALL WITH: seedRig({signedIn: true|false})  — then RELOAD, then measure.
// Signing OUT is `signedIn:false`: it REMOVES praxis_user. Every DW batch must
// gate the signed-out path too (two batches leaked a desktop cap onto one).
// ─────────────────────────────────────────────────────────────────────────────
function seedRig(opts) {
  opts = opts || {};
  var signedIn = (opts.signedIn !== false);
  var out = { steps: [] };

  // 1. kill the service worker + caches
  var chain = Promise.resolve();
  if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
    chain = navigator.serviceWorker.getRegistrations().then(function (rs) {
      var i, ps = [];
      for (i = 0; i < rs.length; i++) { ps.push(rs[i].unregister()); }
      out.steps.push('sw:unregistered:' + rs.length);
      return Promise.all(ps);
    });
  }
  chain = chain.then(function () {
    if (!window.caches || !caches.keys) { return null; }
    return caches.keys().then(function (ks) {
      var i, ps = [];
      for (i = 0; i < ks.length; i++) { ps.push(caches.delete(ks[i])); }
      out.steps.push('caches:deleted:' + ks.length);
      return Promise.all(ps);
    });
  });

  // 2. force-settle every transition/animation
  var st = document.getElementById('__rig_settle');
  if (!st) {
    st = document.createElement('style');
    st.id = '__rig_settle';
    st.textContent = '*,*::before,*::after{transition:none!important;animation:none!important;}';
    document.head.appendChild(st);
  }
  out.steps.push('settle:installed');

  // 3. auth stub — getCurrentUser() reads ls('praxis_user')
  if (signedIn) {
    localStorage.setItem('praxis_user', JSON.stringify({
      uid: 'd0tester',
      email: 'd0tester@praxis.local',
      displayName: 'D0 Tester'
    }));
    out.steps.push('auth:stubbed:d0tester');
  } else {
    localStorage.removeItem('praxis_user');
    out.steps.push('auth:signed-out');
  }

  out.note = 'RELOAD now, then measure.';
  return chain.then(function () { return JSON.stringify(out); },
                    function (e) { out.err = String(e); return JSON.stringify(out); });
}

// ── rigIds() — DISCOVER the seed ids. NEVER hardcode them. ───────────────────
// The seeder mints ids from Date.now()+random (state.js "the arc's id is
// non-deterministic"), and each PORT is a separate browser origin with its own
// localStorage — so the seed re-runs and the ids DIFFER PER PORT. A hardcoded
// id silently renders the not-found path and you measure the wrong surface
// (cost: one confused gate at DW-4). Always resolve ids through this.
function rigIds() {
  var out = { artifactBookId: null, seedSubId: null, seedArcId: null, subIds: [], bookIds: [] };
  var k, ks, i;
  ks = Object.keys(state.bookArtifacts || {});
  for (i = 0; i < ks.length; i++) {
    if (ks[i].indexOf('__praxis_seed__:') === 0) { out.artifactBookId = ks[i].split(':')[1]; break; }
  }
  ks = Object.keys(state.subTheories || {});
  out.subIds = ks;
  for (i = 0; i < ks.length; i++) {
    if (state.subTheories[ks[i]].userId === '__praxis_seed__') { out.seedSubId = ks[i]; break; }
  }
  ks = Object.keys(state.arcs || {});
  for (i = 0; i < ks.length; i++) {
    if (state.arcs[ks[i]].userId === '__praxis_seed__') { out.seedArcId = ks[i]; break; }
  }
  out.bookIds = Object.keys(state.books || {});
  return out;
}
