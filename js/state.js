// =====================================================================
// state.js -- Praxis state + storage primitives
//
// Owns: SCHEMA_VERSION, ls() / sv() localStorage wrappers, and (in
// later sub-stages) the Praxis state object. SCHEMA_VERSION is a
// string semver here; HQ uses an integer inside HQ_CONFIG -- this
// divergence is intentional and locked.
// =====================================================================

'use strict';

var SCHEMA_VERSION = '1.0.0';

function ls(k, d) {
  try {
    var raw = localStorage.getItem(k);
    if (raw === null) return d;
    return JSON.parse(raw);
  } catch (e) {
    return d;
  }
}

function sv(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
    return true;
  } catch (e) {
    return false;
  }
}

console.log('state.js loaded');
