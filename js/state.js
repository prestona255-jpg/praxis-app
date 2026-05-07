// =====================================================================
// state.js -- Praxis state + storage primitives
//
// Owns: ls() / sv() localStorage wrappers, the Praxis 'state' object,
// and the loadState / saveState / migrate trio. SCHEMA_VERSION lives
// on the state object as a string semver; HQ uses an integer inside
// HQ_CONFIG -- divergence is intentional and locked.
//
// Schema 1.1.0 adds the user-data maps:
//
//   books: keyed by bookId. The global, user-agnostic catalog of book
//     metadata. One entry per ISBN-distinct book. Shape (skeleton):
//       {
//         id:      string,    // bookId, also the map key
//         title:   string,
//         author:  string,
//         isbn:    string,
//         addedAt: number     // ms epoch, first time this book entered
//                             // the catalog (NOT per-user "added to my
//                             // shelf" -- see userBooks for that)
//       }
//
//   userBooks: keyed by userId. A user's personal shelf -- the set of
//     book ids the user has added. Shape (skeleton):
//       {
//         bookIds: array of string   // foreign keys into state.books
//       }
//
//   notebookEntries: keyed by entryId. Each entry is the atomic unit
//     of writing -- a single timestamped piece of prose attached to a
//     notebook. Shape (skeleton):
//       {
//         id:         string,
//         userId:     string,
//         notebookId: string,   // foreign key into state.notebooks
//         createdAt:  number,   // ms epoch
//         updatedAt:  number,
//         body:       string    // raw text / markdown
//       }
//
//   bookArtifacts: keyed by artifactKey(userId, bookId). At most one
//     artifact per user+book pair -- this is the user's evolving
//     summary / synthesis of a book. Shape (skeleton):
//       {
//         userId:    string,
//         bookId:    string,
//         createdAt: number,
//         updatedAt: number,
//         body:      string
//       }
//
//   arcs: keyed by arcId. An arc groups books and notebook entries
//     into a directed reading thread. Shape (skeleton):
//       {
//         id:        string,
//         userId:    string,
//         title:     string,
//         bookIds:   array of string,
//         entryIds:  array of string,
//         createdAt: number,
//         updatedAt: number
//       }
//
// Schema 1.2.0 adds two top-level pointer fields tracking which book
// and which arc the user currently has open. Both are scalar id refs
// (or null), stored alongside SCHEMA_VERSION rather than inside any
// map:
//
//   currentBookId: string | null   // foreign key into state.books,
//                                  // or null if no book is open
//
//   currentArcId:  string | null   // foreign key into state.arcs,
//                                  // or null if no arc is active
//
// var/function only -- no const, let, arrow, class, or template
// literals anywhere.
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
  SCHEMA_VERSION:  '1.2.0',
  currentBookId:   null,
  currentArcId:    null,
  users:           {},
  books:           {},
  userBooks:       {},
  notebooks:       {},
  notebookEntries: {},
  bookArtifacts:   {},
  arcs:            {}
};
window.state = state;

// Composite key for the bookArtifacts map. Kept as a function so the
// format is changed in one place if it ever needs to change. The ':'
// separator is safe because neither id is allowed to contain one.
function artifactKey(userId, bookId) {
  return userId + ':' + bookId;
}

// Enforce the at-most-one-artifact-per-user-per-book invariant. If an
// artifact already exists for the pair, return it untouched. Otherwise
// store the supplied artifact and return it. Callers that want to
// overwrite should write to state.bookArtifacts directly.
function ensureOneArtifact(userId, bookId, artifact) {
  var key = artifactKey(userId, bookId);
  var existing = state.bookArtifacts[key];
  if (existing) return existing;
  state.bookArtifacts[key] = artifact;
  return artifact;
}

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

// Migration hook. Reads stored.SCHEMA_VERSION and applies forward
// transforms in order before loadState merges into the live state
// object. Each step mutates 'stored' in place and bumps its version
// stamp. Unknown / future versions are passed through untouched so a
// newer client's data does not get clobbered by an older client.
function migrate(stored) {
  if (!stored.SCHEMA_VERSION) {
    stored.SCHEMA_VERSION = '1.0.0';
  }
  if (stored.SCHEMA_VERSION === '1.0.0') {
    if (!stored.notebookEntries) stored.notebookEntries = {};
    if (!stored.bookArtifacts)   stored.bookArtifacts   = {};
    if (!stored.arcs)            stored.arcs            = {};
    stored.SCHEMA_VERSION = '1.1.0';
  }
  if (stored.SCHEMA_VERSION === '1.1.0') {
    stored.SCHEMA_VERSION = '1.2.0';
  }
  return stored;
}

console.log('state.js loaded');
