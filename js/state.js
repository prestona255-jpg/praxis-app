// =====================================================================
// state.js -- Praxis state + storage primitives
//
// Owns: ls() / sv() localStorage wrappers, the Praxis 'state' object
// (v1 schema: users, books, userBooks, notebooks), and the
// loadState / saveState / migrate trio. SCHEMA_VERSION lives on the
// state object as a string semver; HQ uses an integer inside
// HQ_CONFIG -- divergence is intentional and locked.
// =====================================================================

'use strict';

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

var state = {
  SCHEMA_VERSION: '1.0.0',
  users:     {},
  books:     {},
  userBooks: {},
  notebooks: {}
};
window.state = state;

function loadState() {
  var stored = ls('praxis_state', null);
  if (stored === null) return state;
  var migrated = migrate(stored);
  for (var k in migrated) {
    if (Object.prototype.hasOwnProperty.call(migrated, k)) {
      state[k] = migrated[k];
    }
  }
  return state;
}

function saveState() {
  return sv('praxis_state', state);
}

// Migration hook. No-op at SCHEMA_VERSION 1.0.0. When the schema
// bumps, read stored.SCHEMA_VERSION and apply transforms here before
// loadState merges into the live state object.
function migrate(stored) {
  return stored;
}

console.log('state.js loaded');
