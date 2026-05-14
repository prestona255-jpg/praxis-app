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
//     of writing -- a single timestamped piece of prose. From 1.7.0
//     each entry carries a register tag ('journal' for free-form
//     reflective entries from the Notebook surface; 'marginalia' for
//     entries bound to a specific book context) and an isPrivate
//     flag whose default tracks the register (toggle UI in 3.4).
//     Shape (skeleton):
//       {
//         id:         string,
//         userId:     string,
//         register:   string,    // 'journal' | 'marginalia'
//         isPrivate:  boolean,   // register default; toggle UI in 3.4
//         body:       string,    // raw text / markdown
//         bookIds:    array of string,   // foreign keys into state.books
//         arcIds:     array of string,   // foreign keys into state.arcs
//         createdAt:  number,    // ms epoch
//         updatedAt:  number
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
// Schema 1.3.0 adds a per-user yumiMemory field carrying a rolling
// conversation summary that survives across sessions. Lives on each
// user record under state.users[uid]. Shape:
//
//   yumiMemory: {
//     summary:   string,    // rolling natural-language summary,
//                           // empty string until first write
//     updatedAt: number     // ms epoch of last summary update,
//                           // 0 until first write
//   }
//
// 2.7a seeds the field via migration; 2.7b-ii-b writes summaries
// into it on each rollover via the summarizeAndRoll path in
// yumi-brain.js.
//
// Schema 1.4.0 extends yumiMemory with recentTurns -- the last few raw
// conversation exchanges, kept alongside the rolling summary so Yumi
// can recall verbatim phrasing. Shape addition:
//
//   recentTurns: array of { role: 'user'|'assistant', content: string }
//                // capped at 10 entries by 2.7b-ii write logic
//
// Schema 1.5.0 marks the point where summarization rollover
// operationalizes (see 2.7b-ii-b). The yumiMemory shape is unchanged
// from 1.4.0 -- summary already existed from 1.3.0 and recentTurns
// from 1.4.0. The 1.4.0 -> 1.5.0 migration is a pure version stamp,
// preserving any existing summary content verbatim. yumi-brain.js
// now writes into yumiMemory.summary on each rollover via
// summarizeAndRoll, replacing the prior summary with a rewrite-to-
// unify pass through Claude in Yumi's voice.
//
// Schema 1.6.0 reshapes notebookEntries for Stage 3.1: the
// notebookId field is dropped (one Notebook per user under Cluster
// 1 means there is nothing to foreign-key into), replaced by two
// array fields -- bookIds and arcIds, zero or more foreign keys
// each. The 1.5.0 -> 1.6.0 migration deletes any stray notebookId
// on existing entries; new array fields are populated lazily by
// Stage 3.2 (Journal) and 3.3 (Marginalia) writers.
//
// Schema 1.7.0 adds register ('journal' | 'marginalia') and
// isPrivate (boolean, register-default) to notebookEntries. The
// 1.6.0 -> 1.7.0 migration backfills both on any pre-existing
// entries -- journal/false as the safe default. Toggle UI in 3.4.
//
// Schema 1.8.0 adds a per-user registerDefaults map carrying the
// default isPrivate value for each register a user writes in.
// Lives on each user record under state.users[uid]. Shape:
//
//   registerDefaults: { journal: boolean, marginalia: boolean }
//
// Initial values are { journal: false, marginalia: false } -- the
// same fail-open default Stage 3.2/3.3 writers stamp on each new
// entry. The 1.7.0 -> 1.8.0 migration seeds the field on every
// user record and backfills entry.isPrivate (per-register) for
// any entry where the field is not a boolean. The toggle UI and
// the register-default settings affordance ship in 3.4b; the
// filter that consumes isPrivate ships in 3.4a inside
// yumi-brain.js buildContext(), enforcing principle #5
// (no asymmetric knowledge -- anything captured is visible and
// correctable to the user).
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
  SCHEMA_VERSION:  '1.8.0',
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

// Canonical entry id generator. Shared by 3.2 (Journal writes) and
// 3.3 (Marginalia writes) so both registers produce ids with the
// same prefix and timestamp ordering. Format is opaque to callers;
// only the entryId map key contract matters.
function genEntryId() {
  return 'entry_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// Lazy initializer for per-user records. The schema-versioned shape of
// a user record is owned here so that future writers (notebook entries,
// artifacts, arcs, etc.) can call ensureUser(uid) instead of duplicating
// the default shape. Called by the first writer to state.users[uid].
function ensureUser(uid) {
  if (!state.users[uid]) {
    state.users[uid] = {
      yumiMemory:       { summary: '', recentTurns: [], updatedAt: 0 },
      registerDefaults: { journal: false, marginalia: false }
    };
  }
  if (!state.users[uid].yumiMemory) {
    state.users[uid].yumiMemory = {
      summary: '', recentTurns: [], updatedAt: 0
    };
  }
  if (!state.users[uid].registerDefaults) {
    state.users[uid].registerDefaults = {
      journal: false, marginalia: false
    };
  }
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
  if (stored.SCHEMA_VERSION === '1.2.0') {
    if (stored.users) {
      var uid;
      for (uid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, uid)) {
          if (!stored.users[uid].yumiMemory) {
            stored.users[uid].yumiMemory = { summary: '', updatedAt: 0 };
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.3.0';
  }
  if (stored.SCHEMA_VERSION === '1.3.0') {
    if (stored.users) {
      var uid;
      for (uid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, uid)) {
          if (stored.users[uid].yumiMemory) {
            if (!stored.users[uid].yumiMemory.recentTurns) {
              stored.users[uid].yumiMemory.recentTurns = [];
            }
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.4.0';
  }
  if (stored.SCHEMA_VERSION === '1.4.0') {
    // No-op on shape: yumiMemory.summary already exists from 1.3.0;
    // 1.5.0 marks the point where summarization rollover
    // operationalizes in yumi-brain.js (2.7b-ii-b). Existing summary
    // content preserved verbatim; only the version marker changes.
    stored.SCHEMA_VERSION = '1.5.0';
  }
  if (stored.SCHEMA_VERSION === '1.5.0') {
    var eid;
    if (stored.notebookEntries) {
      for (eid in stored.notebookEntries) {
        if (Object.prototype.hasOwnProperty.call(stored.notebookEntries, eid)) {
          if (stored.notebookEntries[eid] &&
              Object.prototype.hasOwnProperty.call(stored.notebookEntries[eid], 'notebookId')) {
            delete stored.notebookEntries[eid].notebookId;
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.6.0';
  }
  if (stored.SCHEMA_VERSION === '1.6.0') {
    var eid;
    if (stored.notebookEntries) {
      for (eid in stored.notebookEntries) {
        if (Object.prototype.hasOwnProperty.call(stored.notebookEntries, eid)) {
          var entry = stored.notebookEntries[eid];
          if (entry) {
            if (typeof entry.register !== 'string') {
              entry.register = 'journal';
            }
            if (typeof entry.isPrivate !== 'boolean') {
              entry.isPrivate = false;
            }
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.7.0';
  }
  if (stored.SCHEMA_VERSION === '1.7.0') {
    if (stored.users) {
      var uid;
      for (uid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, uid)) {
          if (!stored.users[uid].registerDefaults) {
            stored.users[uid].registerDefaults = {
              journal:    false,
              marginalia: false
            };
          }
        }
      }
    }
    if (stored.notebookEntries) {
      var eid2;
      for (eid2 in stored.notebookEntries) {
        if (Object.prototype.hasOwnProperty.call(stored.notebookEntries, eid2)) {
          var entry2 = stored.notebookEntries[eid2];
          if (entry2 && typeof entry2.isPrivate !== 'boolean') {
            var ownerUid = entry2.userId;
            var reg = entry2.register;
            var def = false;
            if (ownerUid &&
                stored.users &&
                stored.users[ownerUid] &&
                stored.users[ownerUid].registerDefaults &&
                typeof stored.users[ownerUid].registerDefaults[reg] === 'boolean') {
              def = stored.users[ownerUid].registerDefaults[reg];
            }
            entry2.isPrivate = def;
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.8.0';
  }
  return stored;
}

console.log('state.js loaded');
