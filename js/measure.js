// ============================================================================
// ME-1 · THE MEASUREMENT COVENANT  (R-POLISH B4)
//
// "We count, we never watch."
//
// This module is the whole of Praxis's instrumentation. Read it — it is short on
// purpose, so the covenant in About can be CHECKED rather than trusted.
//
// WHAT IT DOES
//   · counts a handful of anonymous AGGREGATE totals (how many times a thing
//     happened, never which thing, never when, never in what order)
//   · counts client errors by a coarse signature, so breakage is visible
//   · derives ACTIVATION from state that already exists (>=1 book AND
//     >=1 marginalia in the first session) — a number, so onboarding is testable
//
// WHAT IT REFUSES, STRUCTURALLY AND FOREVER
//   · NO per-user behavioral profile. Nothing here records a sequence of actions,
//     a dwell time, a path through the app, or anything that could reconstruct a
//     session. Counters are integers. An integer cannot be replayed.
//   · NO third-party anything. This file loads nothing and imports nothing.
//   · NO session replay. Ever.
//   · NO NETWORK — and this is the enforcement, not a promise: there is no code
//     in this file capable of sending anything, so nothing measured here CAN
//     leave the device. Verify it yourself with a code-only grep for the usual
//     send primitives, e.g.
//         grep -v '^\s*//' js/measure.js | grep -E 'fetch\(|XMLHttpRequest|sendBeacon|new Image\(|new WebSocket'
//     which returns nothing. The `-v` matters: the names appear in THIS comment
//     block (they have to, to name what is absent), so a naive grep hits these
//     lines and looks like a contradiction. Preston's B4 ruling: local-only.
//   · NO new schema, NO Firestore field, NO sync path. Storage is localStorage
//     via the house ls()/sv() wrappers only, so this never enters the data model.
//   · NO streaks, NO engagement mechanics, NO dark patterns. RETENTION PHILOSOPHY
//     (ruled): the return hook is the reading practice itself. Home's quiet
//     "pick it back up?" is the ceiling, and nothing here exists to raise it.
//
// ES3 house style: var/function only, string concat, no template literals.
// Loads AFTER state.js because it uses ls()/sv(); the one honest consequence is
// that an exception thrown by state.js itself lands before the handler is armed.
// ============================================================================

var PRAXIS_M_COUNTS = 'praxis_m_counts';
var PRAXIS_M_ERRORS = 'praxis_m_errors';
var PRAXIS_M_FIRST  = 'praxis_m_first_seen';
var PRAXIS_M_ACTIVE = 'praxis_m_activated';

// Cap on DISTINCT error signatures kept. A cap matters: without one, a hot loop
// throwing unique messages would grow localStorage without bound.
var PRAXIS_M_ERR_CAP = 40;
// Same reasoning for the aggregate counters (see count()).
var PRAXIS_M_COUNT_CAP = 40;

var PraxisMeasure = (function () {

  // Is this the first session this browser has ever seen? Resolved ONCE at load
  // and held in memory, because "first session" must not drift as the tab lives.
  var isFirstSession = false;

  function readObj(key) {
    var v = (typeof ls === 'function') ? ls(key, null) : null;
    if (!v || typeof v !== 'object') { return {}; }
    return v;
  }

  function writeObj(key, obj) {
    if (typeof sv === 'function') { sv(key, obj); }
  }

  // ---- aggregate counters -------------------------------------------------
  // count('book_added') -> counts.book_added += 1. That is the entire data model:
  // a name and an integer. No timestamp, no payload, no ordering.
  function count(name) {
    if (typeof name !== 'string' || name === '') { return; }
    var c = readObj(PRAXIS_M_COUNTS);
    // Capped for the same reason errors are. Today count() is only ever called
    // with two hardcoded literals, so this cannot trip — but an uncapped
    // localStorage-backed map is a growth bug waiting for its first dynamic
    // caller, and ERRORS having a cap while COUNTS did not was an asymmetry
    // with no reason behind it. Existing names keep incrementing forever; only
    // NEW distinct names are refused past the cap.
    if (typeof c[name] !== 'number') {
      var n = 0, k;
      for (k in c) { if (Object.prototype.hasOwnProperty.call(c, k)) { n = n + 1; } }
      if (n >= PRAXIS_M_COUNT_CAP) { return; }
      c[name] = 0;
    }
    c[name] = c[name] + 1;
    writeObj(PRAXIS_M_COUNTS, c);
  }

  function counts() {
    return readObj(PRAXIS_M_COUNTS);
  }

  // ---- error counting -----------------------------------------------------
  // A coarse SIGNATURE, never a stack trace and never a captured value: an error
  // message can echo user content, a stack cannot be sanitised reliably, and
  // neither is needed to know that something is broken and how often.
  function signature(msg, src, line) {
    var m = (typeof msg === 'string') ? msg : 'error';
    m = m.replace(/\s+/g, ' ');
    if (m.length > 80) { m = m.slice(0, 80); }
    var f = (typeof src === 'string' && src) ? src.split('/').pop() : '?';
    if (f.length > 40) { f = f.slice(0, 40); }
    var l = (typeof line === 'number') ? line : 0;
    return m + ' @' + f + ':' + l;
  }

  function noteError(msg, src, line) {
    var e = readObj(PRAXIS_M_ERRORS);
    var key = signature(msg, src, line);
    if (typeof e[key] !== 'number') {
      var n = 0, k;
      for (k in e) { if (Object.prototype.hasOwnProperty.call(e, k)) { n = n + 1; } }
      if (n >= PRAXIS_M_ERR_CAP) { return; }   // capped, never unbounded
      e[key] = 0;
    }
    e[key] = e[key] + 1;
    writeObj(PRAXIS_M_ERRORS, e);
  }

  function errors() {
    return readObj(PRAXIS_M_ERRORS);
  }

  // ---- activation ---------------------------------------------------------
  // ACTIVATED (ruled) = >=1 book added AND >=1 marginalia captured in the FIRST
  // session. DERIVED from state that already exists rather than tracked as a
  // behavioural event — which is exactly why this needs no profile: the answer is
  // already in the library and the notebook, so nothing has to be watched to get
  // it. Latches once; a later session can never set it, which is the point.
  function libraryCounts() {
    var books = 0, margs = 0, k, en;
    if (typeof state === 'undefined' || !state) { return { books: 0, margs: 0 }; }
    if (state.books) {
      for (k in state.books) {
        if (Object.prototype.hasOwnProperty.call(state.books, k)) { books = books + 1; }
      }
    }
    if (state.notebookEntries) {
      for (k in state.notebookEntries) {
        if (Object.prototype.hasOwnProperty.call(state.notebookEntries, k)) {
          en = state.notebookEntries[k];
          if (en && en.register === 'marginalia') { margs = margs + 1; }
        }
      }
    }
    return { books: books, margs: margs };
  }

  // Memoised so checkActivation() can be called from the render heartbeat without
  // an ls() read every time.
  var activatedMemo = null;

  function isActivated() {
    if (activatedMemo !== null) { return activatedMemo; }
    var v = (typeof ls === 'function') ? ls(PRAXIS_M_ACTIVE, null) : null;
    activatedMemo = !!v;
    return activatedMemo;
  }

  // CALLED FROM THE RENDER HEARTBEAT, NOT ONLY AT BOOT — and that is load-bearing.
  // Checking once at boot makes the latch UNREACHABLE: session 1 begins with an
  // empty library, so the boot check fails; by boot 2 isFirstSession is already
  // false and the branch can never be entered again. The qualifying moment lands
  // mid-session, so the check has to be able to run mid-session too.
  // Cost when it cannot fire: one memo comparison (activated) or one boolean
  // (later sessions). The O(n) scan only runs while genuinely undecided.
  function checkActivation() {
    if (isActivated()) { return true; }
    if (!isFirstSession) { return false; }
    var n = libraryCounts();
    if (n.books >= 1 && n.margs >= 1) {
      if (typeof sv === 'function') { sv(PRAXIS_M_ACTIVE, 1); }
      activatedMemo = true;
      count('activated');
      return true;
    }
    return false;
  }

  // ---- install ------------------------------------------------------------
  function install() {
    var first = (typeof ls === 'function') ? ls(PRAXIS_M_FIRST, null) : null;
    if (!first) {
      isFirstSession = true;
      if (typeof sv === 'function') { sv(PRAXIS_M_FIRST, 1); }
    }
    count('boot');

    if (typeof window === 'undefined') { return; }
    var prior = window.onerror;
    window.onerror = function (msg, src, line) {
      try { noteError(msg, src, line); } catch (e1) {}
      // Guarded for the same reason noteError above is: this runs ON the error
      // path, and an exception thrown from inside window.onerror is about the
      // worst place in the app to have one. No prior handler exists in the repo
      // today, so this is defensive rather than load-bearing — but the
      // asymmetry of guarding one call and not its neighbour is the kind of
      // thing that stops being inert the moment someone adds a handler.
      if (typeof prior === 'function') {
        try { return prior.apply(this, arguments); } catch (e3) { return false; }
      }
      return false;   // never swallow: the console still shows the real error
    };
    if (window.addEventListener) {
      window.addEventListener('unhandledrejection', function (ev) {
        var r = ev && ev.reason;
        var m = (r && r.message) ? r.message : String(r);
        try { noteError('unhandledrejection: ' + m, '', 0); } catch (e2) {}
      });
    }
  }

  return {
    install:         install,
    count:           count,
    counts:          counts,
    errors:          errors,
    checkActivation: checkActivation,
    isActivated:     isActivated,
    libraryCounts:   libraryCounts,
    isFirstSession:  function () { return isFirstSession; }
  };
})();

if (typeof window !== 'undefined') { window.PraxisMeasure = PraxisMeasure; }
