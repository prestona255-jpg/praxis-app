// ceiling-core.js -- P1 Item 1: the DECISION CORE of the server-side AI cost
// ceiling. PURE and ES3-CLEAN on purpose: no async, no fetch, no process, no
// Date.now() of its own -- every function takes the clock as an argument, so
// the 00:00 UTC reset and the N-vs-N+1 boundary are provable under the repo's
// cscript JScript harness (tools/ceiling-core-test) on a machine where Node is
// blocked. The Node glue (token verification, Firestore REST) lives in
// ./ceiling.js and is proven live per docs/checkpoints/p1-safety-build.md R1.10.
//
// The core NEVER sees a request body. The uid it is given comes from the
// verified Firebase ID token's `sub` (ceiling.js) and nothing else -- a uid in
// the client body cannot reach these functions by construction (grep: no
// `body` reference in this file).
//
// var/function only, string concat, no reserved-word method names.

// 'YYYY-MM-DD' of the UTC calendar day containing nowMs. The window is a UTC
// calendar day; the clock source is the Netlify host's Date.now() (UTC), passed
// in by the caller.
function ceilingUtcDayKey(nowMs) {
  var d = new Date(nowMs);
  var y = d.getUTCFullYear();
  var m = d.getUTCMonth() + 1;
  var day = d.getUTCDate();
  return y + '-' + (m < 10 ? '0' + m : '' + m) + '-' + (day < 10 ? '0' + day : '' + day);
}

// ISO timestamp of the next 00:00:00 UTC strictly after nowMs -- the reset the
// client renders in the reader's local time.
function ceilingNextResetIso(nowMs) {
  var d = new Date(nowMs);
  var next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0));
  // Hand-built ISO (toISOString is ES5; this core stays ES3 for the harness).
  var y = next.getUTCFullYear();
  var m = next.getUTCMonth() + 1;
  var day = next.getUTCDate();
  return y + '-' + (m < 10 ? '0' + m : '' + m) + '-' + (day < 10 ? '0' + day : '' + day) + 'T00:00:00.000Z';
}

// Parse PRAXIS_AI_CAP_OVERRIDES: "uid:cap,uid2:cap2". Whitespace tolerated,
// malformed entries skipped, non-positive caps skipped. Returns { uid: cap }.
function ceilingParseOverrides(str) {
  var out = {};
  if (typeof str !== 'string' || str.length === 0) { return out; }
  var parts = str.split(',');
  var i, p, idx, uid, cap;
  for (i = 0; i < parts.length; i++) {
    p = parts[i].replace(/^\s+|\s+$/g, '');
    if (p.length === 0) { continue; }
    idx = p.lastIndexOf(':');
    if (idx <= 0 || idx === p.length - 1) { continue; }
    uid = p.slice(0, idx).replace(/^\s+|\s+$/g, '');
    cap = parseInt(p.slice(idx + 1), 10);
    if (uid.length === 0 || isNaN(cap) || cap <= 0) { continue; }
    out[uid] = cap;
  }
  return out;
}

// The cap that applies to uid: an override if one is configured, else the
// default. A higher cap for the owner is a per-uid CONFIG VALUE visible here,
// never a bypass -- there is no uid the ceiling does not count.
function ceilingCapFor(uid, defaultCap, overridesStr) {
  var ov = ceilingParseOverrides(overridesStr);
  if (Object.prototype.hasOwnProperty.call(ov, uid)) { return ov[uid]; }
  return defaultCap;
}

// Parse PRAXIS_AI_DAILY_CAP; falls back to 300 (the Stage-0 arithmetic:
// ~3 proxy calls per Yumi turn x 30-turn heavy session x 2 sessions x 1.5).
function ceilingDefaultCap(envValue) {
  var n = parseInt(envValue, 10);
  if (isNaN(n) || n <= 0) { return 300; }
  return n;
}

// THE DECISION. `doc` is the stored usage record { day, count } or null when
// no document exists. Returns:
//   { allowed: false, day, used, cap, resetAt }         -> answer 429
//   { allowed: true,  day, rolled, nextCount, cap }      -> count then forward
// `rolled` is true when the stored day is not today (or no doc): the store must
// write { day: today, count: 1 } instead of incrementing. Count-before-forward
// (R1.9): the attempt is what is counted, so nextCount is the value the store
// should hold AFTER this request is admitted.
function ceilingDecide(doc, nowMs, cap) {
  var today = ceilingUtcDayKey(nowMs);
  var storedDay = (doc && typeof doc.day === 'string') ? doc.day : '';
  var storedCount = (doc && typeof doc.count === 'number' && doc.count >= 0) ? doc.count : 0;
  if (storedDay === today) {
    if (storedCount >= cap) {
      return { allowed: false, day: today, used: storedCount, cap: cap, resetAt: ceilingNextResetIso(nowMs) };
    }
    return { allowed: true, day: today, rolled: false, nextCount: storedCount + 1, cap: cap };
  }
  return { allowed: true, day: today, rolled: true, nextCount: 1, cap: cap };
}

if (typeof module === 'object' && module && module.exports) {
  module.exports = {
    utcDayKey:      ceilingUtcDayKey,
    nextResetIso:   ceilingNextResetIso,
    parseOverrides: ceilingParseOverrides,
    capFor:         ceilingCapFor,
    defaultCap:     ceilingDefaultCap,
    decide:         ceilingDecide
  };
}
