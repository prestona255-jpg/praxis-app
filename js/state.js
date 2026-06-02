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
//         title:     string,    // editable; pre-filled with book title
//                               // at creation (3.7). Distinct from
//                               // state.books[bookId].title so the
//                               // Artifact's name can drift from the
//                               // catalog title (retrospective framing).
//         createdAt: number,
//         updatedAt: number,
//         body:      string
//       }
//
//   arcs: keyed by arcId. An arc groups books and notebook entries
//     into a directed reading thread. Shape (skeleton):
//       {
//         id:          string,
//         userId:      string,
//         title:       string,
//         description: string,    // optional, '' allowed
//         bookIds:     array of { id: string, addedAt: number },
//         entryIds:    array of { id: string, addedAt: number },
//         createdAt:   number,
//         updatedAt:   number
//       }
//
//     bookIds / entryIds carry an addedAt timestamp PER MEMBERSHIP --
//     when that book or entry was attached to THIS arc, not the
//     member's own creation time. 3.9 renders an arc as a
//     chronological path through the Notebook keyed on these
//     timestamps. entry.arcIds (the entry-side back-reference) stays
//     `array of plain string` -- the arc side is authoritative for
//     chronology; the entry side is a denormalized lookup index.
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
// Schema 1.9.0 adds two user-facing fields to state.books records:
//
//   status: string   // 'want' | 'reading' | 'finished'
//   genre:  string   // free-form singular tag, empty string allowed
//
// status is not just metadata -- it is the state-machine field
// 3.7 reads as a gate for Artifact creation (Mark Finished ->
// Artifact). genre is a single free-form string; multi-genre is
// out of scope for 3.5a. The 1.8.0 -> 1.9.0 migration backfills
// every existing books record with status: 'reading' and
// genre: '' (empty string) -- safe defaults that align with the
// add-book radio default in the shelf surface (3.5a).
//
// 1.9.0 also lazily seeds per-user shelves in state.userBooks.
// The userBooks map has existed as a top-level field since
// schema 1.1.0, but no code path initialized per-user records.
// ensureUser(uid) now writes state.userBooks[uid] = { bookIds: [] }
// when missing, so the add-book flow can append to a guaranteed
// array. The 3.5a shelf reads from state.books (not userBooks)
// to preserve book_test_1 visibility despite its pre-existing
// drift (seeded into state.books in 3.3 console testing but
// never into userBooks). userBooks is half-wired in 3.5a: writes
// happen on new-book creation, reads do not filter the shelf.
// User-scoping the shelf is a future seam.
//
// Schema 1.9.1 adds two fields tied to Stage 3.7 (Mark Finished +
// Book Artifact creation):
//
//   state.books[bookId].finishedAt: number | null
//                              // ms epoch at which the user marked
//                              // the book finished. null until the
//                              // mark-finished path stamps it.
//
//   state.bookArtifacts[key].title: string
//                              // Artifact display title. Pre-filled
//                              // with the book title at creation, but
//                              // editable thereafter so the Artifact
//                              // can drift from the catalog name.
//
// The 1.9.0 -> 1.9.1 migration stamps finishedAt: null on every
// existing state.books record so downstream readers can rely on
// the field being present (null) rather than undefined. No backfill
// for bookArtifacts.title: no real Artifacts existed before 3.7,
// so any pre-existing entries are test fixtures only and tolerate
// a missing title.
//
// Schema 1.11.0 adds two fields to state.books records:
//
//   tradition:          string  // one of nine values from TRADITIONS,
//                               // plus 'unassigned' as a tenth case.
//                               // Derived from book.genre via the
//                               // THEME_TO_TRADITION map. The shelf
//                               // glyph (5.6 sub-step 4) reads this
//                               // field to pick its shape.
//
//   traditionOverride:  string | null
//                               // User-set override from the edit-
//                               // book modal (5.6 sub-step 5). When
//                               // present, the renderer uses this
//                               // instead of the genre-derived
//                               // default. null until the user
//                               // explicitly overrides.
//
// Schema 1.11.0 was introduced for Stage 5.6 sub-step 1 (shelf
// register vocabulary). Field is named 'tradition' rather than
// 'register' because 'register' is already in use on notebookEntries
// (values 'journal' | 'marginalia'). Backfill is delegated to the
// ensureBookFieldsAll chokepoint which is also called from the
// Firestore merge path (integrations.js) and new-book creation
// (views.js). All write paths into state.books call ensureBookFields
// before or after the write so the schema is honored regardless of
// which path the book entered through.
//
// Status-editing on book detail (status-selector flip, un-finish
// render) is NOT in 3.7; it ships in 3.7c. Stage 3.7's only path
// to status === 'finished' is the "I've finished this" button in
// book detail.
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
  SCHEMA_VERSION:  '1.9.3',
  currentBookId:   null,
  currentArcId:    null,
  users:           {},
  books:           {},
  userBooks:       {},
  notebooks:       {},
  notebookEntries: {},
  bookArtifacts:   {},
  arcs:            {},
  subTheories:     {}
};
window.state = state;

// Stage 5.6 sub-step 1: tradition data model.
//
// 'tradition' is what the visual system spec
// (docs/knowledge-arcs/knowledge-arcs-visual-system.md) calls
// 'register'. Renamed in code to avoid collision with
// notebookEntries[id].register (values 'journal' | 'marginalia').
// See docs/knowledge-arcs/shelf-and-field-decisions.md.
//
// THEME_TO_TRADITION maps the 15 SHELF_THEMES values (from views.js)
// onto 8 of the 9 traditions. Poetry is theme-less and reachable only
// via user override (sub-step 5). Empty or non-canonical genre lands
// on 'unassigned' (the 10th case, renders as no glyph).
var THEME_TO_TRADITION = {
  'Philosophy & wisdom':         'wisdom',
  'Critical theory & pedagogy':  'theory',
  'Power & systems':             'theory',
  'Political economy & society': 'theory',
  'Mind & behavior':             'empirical',
  'History & memory':            'history',
  'Liberation':                  'history',
  'Love & connection':           'memoir',
  'Grief & witness':             'memoir',
  'Joy & wonder':                'memoir',
  'Faith & meaning':             'wisdom',
  'Place & belonging':           'place',
  'Nature & ecology':            'place',
  'Story & imagination':         'novel',
  'Craft & practice':            'practice'
};

// Canonical tradition values. The renderer (sub-step 3+) reads
// book.tradition against this list. 'unassigned' is the 10th value
// and renders as no glyph (deliberate empty-corner signal).
var TRADITIONS = [
  'theory',
  'wisdom',
  'empirical',
  'history',
  'memoir',
  'novel',
  'poetry',
  'place',
  'practice',
  'unassigned'
];

// Human-readable labels for the tradition dropdown (sub-step 5a).
// Keys match TRADITIONS exactly. 'unassigned' gets a prose label so the
// dropdown reads as natural language rather than typographic shorthand.
var TRADITION_LABELS = {
  theory: 'Theory',
  wisdom: 'Wisdom',
  empirical: 'Empirical',
  history: 'History',
  memoir: 'Memoir',
  novel: 'Novel',
  poetry: 'Poetry',
  place: 'Place',
  practice: 'Practice',
  unassigned: 'No tradition assigned'
};

function deriveTraditionFromGenre(genre) {
  if (typeof genre !== 'string' || genre === '') {
    return 'unassigned';
  }
  if (typeof THEME_TO_TRADITION[genre] === 'string') {
    return THEME_TO_TRADITION[genre];
  }
  return 'unassigned';
}

// Stage 5.6 sub-step 2: SVG path strings for the 9 tradition glyphs.
// Each path is drawn within a 24x24 viewBox and rendered as a single
// filled shape (sub-step 3's renderRegisterGlyph wraps these in an
// <svg> element with viewBox="0 0 24 24" and applies the register
// color via fill). 'unassigned' deliberately maps to empty string —
// books with tradition === 'unassigned' render no glyph at all,
// per the §2.6 "empty space is a real signal" principle from
// docs/knowledge-arcs/knowledge-arcs-visual-system.md.
var REGISTER_SHAPE_PATHS = {
  'theory':     'M4 4 L20 4 L20 20 L4 20 Z',
  'wisdom':     'M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z',
  'empirical':  'M12 2 L22 9 L18 21 L6 21 L2 9 Z',
  'history':    'M12 2 L22 12 L12 22 L2 12 Z',
  'memoir':     'M12 2 A10 10 0 1 1 12 22 A10 10 0 1 1 12 2 Z',
  'novel':      'M12 4 A10 7 0 1 1 12 18 A10 7 0 1 1 12 4 Z',
  'poetry':     'M12 3 L22 21 L2 21 Z',
  'place':      'M19 12 A8 8 0 1 1 8 4 A6 6 0 1 0 19 12 Z',
  'practice':   'M7 4 L17 4 L21 20 L3 20 Z',
  'unassigned': ''
};

// ensureBookFields — the chokepoint. Backfills any 5.6 sub-step 1
// schema fields that are missing on a book record. Idempotent: if
// the field is already present, no-op. Returns true if anything
// was changed, false otherwise (mirrors normalizeCoverUrlsToHttps
// pattern). EVERY write path into state.books must call this — see
// integrations.js Firestore merge and views.js new-book sites.
function ensureBookFields(book) {
  if (!book || typeof book !== 'object') { return false; }
  var changed = false;
  if (typeof book.tradition !== 'string') {
    book.tradition = deriveTraditionFromGenre(book.genre);
    changed = true;
  }
  if (typeof book.traditionOverride === 'undefined') {
    book.traditionOverride = null;
    changed = true;
  }
  return changed;
}

// ensureBookFieldsAll — convenience for backfilling an entire books
// map (migration, Firestore merge). Returns true if any single book
// was changed, false if all books were already complete.
function ensureBookFieldsAll(booksMap) {
  if (!booksMap || typeof booksMap !== 'object') { return false; }
  var anyChanged = false;
  var bk;
  for (bk in booksMap) {
    if (booksMap.hasOwnProperty(bk)) {
      if (ensureBookFields(booksMap[bk])) {
        anyChanged = true;
      }
    }
  }
  return anyChanged;
}

// ensureSubTheoryFields — the 9.1 chokepoint, mirroring ensureBookFields.
// Backfills any sub-theory schema field that is missing or the wrong
// type on a record. Idempotent: a field already the correct type is a
// no-op. Returns true if anything was changed, false otherwise. id and
// arcId are deliberately left untouched — a record missing either is
// malformed and is not repaired here. EVERY write path into
// state.subTheories must call this.
function ensureSubTheoryFields(st) {
  if (!st || typeof st !== 'object') { return false; }
  var changed = false;
  if (typeof st.header !== 'string') {
    st.header = '';
    changed = true;
  }
  if (typeof st.bodyPublic !== 'string') {
    st.bodyPublic = '';
    changed = true;
  }
  if (typeof st.bodyIntellectual !== 'string') {
    st.bodyIntellectual = '';
    changed = true;
  }
  if (!Array.isArray(st.evidence)) {
    st.evidence = [];
    changed = true;
  }
  if (!Array.isArray(st.attachedMarginalia)) {
    st.attachedMarginalia = [];
    changed = true;
  }
  if (!Array.isArray(st.linkedSubTheories)) {
    st.linkedSubTheories = [];
    changed = true;
  }
  if (st.status !== 'draft' && st.status !== 'published') {
    st.status = 'draft';
    changed = true;
  }
  if (typeof st.format !== 'string') {
    st.format = '';
    changed = true;
  }
  if (typeof st.publishedAt === 'undefined') {
    st.publishedAt = null;
    changed = true;
  }
  return changed;
}

// ensureSubTheoryFieldsAll — convenience for backfilling an entire
// subTheories map (migration). Returns true if any single record was
// changed, false if all were already complete. Mirrors
// ensureBookFieldsAll.
function ensureSubTheoryFieldsAll(map) {
  if (!map || typeof map !== 'object') { return false; }
  var anyChanged = false;
  var stk;
  for (stk in map) {
    if (map.hasOwnProperty(stk)) {
      if (ensureSubTheoryFields(map[stk])) {
        anyChanged = true;
      }
    }
  }
  return anyChanged;
}

// Stage 5.6 sub-step 5b: engagement band derivation for shelf glyph
// saturation. Counts notebook entries that link to a given book and
// returns band 0/1/2. Read-only — no writes, no caching. Re-runs per
// shelf render. Multi-book entries count once toward each linked book.
// Thresholds tunable here; deliberately low to avoid gamification.
var BAND_1_MIN = 1;
var BAND_2_MIN = 3;

function getEngagementBand(bookId) {
  if (!bookId) return 0;
  if (!state.notebookEntries) return 0;
  var count = 0;
  var key;
  var entry;
  for (key in state.notebookEntries) {
    if (!state.notebookEntries.hasOwnProperty(key)) continue;
    entry = state.notebookEntries[key];
    if (entry && entry.bookIds && entry.bookIds.indexOf(bookId) !== -1) {
      count = count + 1;
    }
  }
  if (count >= BAND_2_MIN) return 2;
  if (count >= BAND_1_MIN) return 1;
  return 0;
}

// Firestore Stage 2: dirty flag for the per-user book doc. The 10
// book-mutation sites in views.js call markBooksDirty() after
// mutating state.books / state.userBooks; saveState() consumes the
// flag below and fires a fire-and-forget Firestore write for THIS
// user's denormalized doc. Non-book saveState callers (Notebook,
// Artifacts, arcs, Yumi memory) leave the flag unset and do NOT
// trigger a Firestore write -- so unrelated saves don't waste
// round-trips on the book doc.
var booksDirty = false;

function markBooksDirty() {
  booksDirty = true;
}

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

// Canonical book id generator. Shaped identically to genEntryId so
// id collisions across the two maps are impossible (different prefix)
// and the timestamp-ordered suffix preserves insertion order for
// shelf rendering when sort keys are missing.
function genBookId() {
  return 'book_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// Canonical arc id generator (3.8). Shaped identically to genEntryId
// and genBookId; the 'arc_' prefix differentiates the maps so a single
// id cannot collide across notebookEntries, books, and arcs.
function genArcId() {
  return 'arc_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// Canonical sub-theory id generator (9.1). Shaped identically to
// genEntryId / genBookId / genArcId; the 'subtheory_' prefix keeps a
// single id from colliding across notebookEntries, books, arcs, and
// subTheories.
function genSubTheoryId() {
  return 'subtheory_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
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
  if (!state.userBooks[uid]) {
    state.userBooks[uid] = { bookIds: [] };
  }
}

// 3.8 arc data layer. createArc / addBookToArc / addEntryToArc are
// pure in-memory mutators: they write into state.arcs (and, for
// addEntryToArc, into the entry-side back-reference state.notebook-
// Entries[eid].arcIds). They do NOT call saveState() -- callers
// (Stage 2 views.js) own persistence and re-render, matching the
// established state.js pattern (ensureUser / ensureOneArtifact / the
// migrate steps are all caller-persisted). The userId arg matches the
// in-file mutator precedent (ensureUser/ensureOneArtifact take uid);
// state.js stays a pure data layer and does not reach into
// integrations.js for getCurrentUser().
//
// Membership shape from 3.8 onward: arc.bookIds and arc.entryIds are
// arrays of { id: string, addedAt: number }. addedAt is when the
// member was attached to THIS arc, not the member's own creation
// time. Idempotency is gated on a linear .id scan -- arc memberships
// are short by design, so an O(n) duplicate check is the right cost
// for the simplest code. entry.arcIds (entry-side back-reference)
// stays `array of plain string`.
//
// 3.9 adds deleteArc(arcId): removes the arc AND cleans the entry-
// side back-references (every member entry's arcIds array gets the
// arcId spliced out). Books carry no back-reference (no book.arcIds
// exists by design), so the book side needs no cleanup. Tolerates a
// missing entry mid-iteration -- the arc deletion is still authoritative
// even when the back-reference cleanup is partial. No saveState() --
// caller owns persistence, matching the rest of this data layer.

function createArc(title, description, userId) {
  var trimmedTitle = (typeof title === 'string') ? title.trim() : '';
  if (trimmedTitle === '') return null;
  var trimmedDesc = (typeof description === 'string') ? description.trim() : '';
  var now = Date.now();
  var id = genArcId();
  var arc = {
    id:          id,
    userId:      userId,
    title:       trimmedTitle,
    description: trimmedDesc,
    bookIds:     [],
    entryIds:    [],
    createdAt:   now,
    updatedAt:   now
  };
  state.arcs[id] = arc;
  return arc;
}

function addBookToArc(arcId, bookId) {
  var arc = state.arcs[arcId];
  if (!arc) return false;
  var i;
  for (i = 0; i < arc.bookIds.length; i++) {
    if (arc.bookIds[i] && arc.bookIds[i].id === bookId) {
      return false;
    }
  }
  var now = Date.now();
  arc.bookIds.push({ id: bookId, addedAt: now });
  arc.updatedAt = now;
  return true;
}

// Maintains the membership on the arc side (arc.entryIds carries
// {id, addedAt}) AND the back-reference on the entry side
// (entry.arcIds carries plain arcId strings). Idempotent on both
// sides: a duplicate arc-side membership returns false without
// touching the entry; an entry that already names the arcId in its
// arcIds is not pushed again. If the entry is missing from
// state.notebookEntries the arc side is still updated and the miss
// is logged -- the arc remains internally consistent even if the
// entry was deleted out from under the caller.
function addEntryToArc(arcId, entryId) {
  var arc = state.arcs[arcId];
  if (!arc) return false;
  var i;
  for (i = 0; i < arc.entryIds.length; i++) {
    if (arc.entryIds[i] && arc.entryIds[i].id === entryId) {
      return false;
    }
  }
  var now = Date.now();
  arc.entryIds.push({ id: entryId, addedAt: now });
  arc.updatedAt = now;
  var entry = state.notebookEntries[entryId];
  if (!entry) {
    console.warn('addEntryToArc: entry not found ' + entryId
      + ' (arc side updated, entry back-ref skipped)');
    return true;
  }
  if (!entry.arcIds) entry.arcIds = [];
  var j;
  var present = false;
  for (j = 0; j < entry.arcIds.length; j++) {
    if (entry.arcIds[j] === arcId) {
      present = true;
      break;
    }
  }
  if (!present) {
    entry.arcIds.push(arcId);
  }
  return true;
}

function deleteArc(arcId) {
  var arc = state.arcs[arcId];
  if (!arc) return false;
  // Back-reference cleanup: for every entry member, splice this arcId
  // out of the entry's arcIds back-reference array. Tolerate a missing
  // entry, a missing/empty arcIds field, and duplicate arcId strings
  // (defensive -- addEntryToArc dedupes on write, but state can be
  // console-edited). Reverse iteration so splicing does not skip
  // indices. Books carry no back-reference; no book-side cleanup.
  var i;
  for (i = 0; i < arc.entryIds.length; i++) {
    var m = arc.entryIds[i];
    if (!m || !m.id) continue;
    var entry = state.notebookEntries[m.id];
    if (!entry) continue;
    if (!entry.arcIds || entry.arcIds.length === 0) continue;
    var j;
    for (j = entry.arcIds.length - 1; j >= 0; j--) {
      if (entry.arcIds[j] === arcId) {
        entry.arcIds.splice(j, 1);
      }
    }
  }
  delete state.arcs[arcId];
  return true;
}

// Stage 5.7 sub-step 1: hard-delete a notebook entry.
// Walks entry.arcIds back-reference to clean up only the arcs this
// entry belongs to (O(entry-arc-count), not O(all-arcs)). For each
// such arc, splice this entryId out of arc.entryIds. Reverse iter
// so splicing doesn't skip indices. Then delete the entry itself.
// Returns true on success, false if entry missing. Caller persists
// (matches deleteArc convention).
function deleteEntry(entryId) {
  var entry = state.notebookEntries[entryId];
  if (!entry) return false;
  var i;
  var j;
  var arcIds = entry.arcIds || [];
  for (i = 0; i < arcIds.length; i++) {
    var arcId = arcIds[i];
    if (!arcId) continue;
    var arc = state.arcs[arcId];
    if (!arc || !arc.entryIds || !arc.entryIds.length) continue;
    for (j = arc.entryIds.length - 1; j >= 0; j--) {
      if (arc.entryIds[j] && arc.entryIds[j].id === entryId) {
        arc.entryIds.splice(j, 1);
      }
    }
  }
  delete state.notebookEntries[entryId];
  return true;
}

// 9.1B sub-theory CRUD. createSubTheory mirrors createArc's guard +
// return shape (null on a bad/absent parent, otherwise the new record),
// but unlike the arc data layer these three DO call saveState() — the
// 9.1 stage design owns persistence here rather than deferring it to a
// views.js caller. No Firestore path: 9.1 is localStorage-only, so none
// of the three touch booksDirty.
function createSubTheory(arcId, fields) {
  if (typeof arcId !== 'string' || !state.arcs[arcId]) return null;
  var src = fields || {};
  var now = Date.now();
  var id = genSubTheoryId();
  var subTheory = {
    id:                 id,
    arcId:              arcId,
    header:             (typeof src.header === 'string') ? src.header : '',
    bodyPublic:         (typeof src.bodyPublic === 'string') ? src.bodyPublic : '',
    bodyIntellectual:   (typeof src.bodyIntellectual === 'string') ? src.bodyIntellectual : '',
    evidence:           [],
    attachedMarginalia: [],
    linkedSubTheories:  [],
    status:             'draft',
    format:             '',
    publishedAt:        null,
    createdAt:          now,
    updatedAt:          now
  };
  state.subTheories[id] = subTheory;
  saveState();
  return subTheory;
}

// Edits only the three text fields, and only when a string is supplied
// for that field. status, the three arrays, publishedAt, and createdAt
// are deliberately left alone — later stages own those transitions.
// updatedAt is always bumped. Returns the record, or null if absent.
function updateSubTheory(id, fields) {
  var subTheory = state.subTheories[id];
  if (!subTheory) return null;
  var src = fields || {};
  if (typeof src.header === 'string') subTheory.header = src.header;
  if (typeof src.bodyPublic === 'string') subTheory.bodyPublic = src.bodyPublic;
  if (typeof src.bodyIntellectual === 'string') subTheory.bodyIntellectual = src.bodyIntellectual;
  subTheory.updatedAt = Date.now();
  saveState();
  return subTheory;
}

// Hard-delete. No cascade: no links or published docs reference a
// sub-theory yet (those seams arrive in later stages). Returns true on
// success, false if the record was already absent.
function deleteSubTheory(id) {
  var subTheory = state.subTheories[id];
  if (!subTheory) return false;
  delete state.subTheories[id];
  saveState();
  return true;
}

function loadState() {
  var stored = ls('praxis_state', null);
  if (stored === null) {
    // Stage 5.3 Stage 3a: cold-open path now runs migrate(state) too,
    // so the Pedagogy of Desire seed migration step (1.9.3 -> 1.10.0)
    // fires on first load for new users. The pre-3a behavior returned
    // the default state untouched, which would leave a brand-new user
    // without the worked example until a saveState + reload cycle
    // promoted the default state into localStorage and a second
    // loadState ran migrate. Calling migrate on the default `state`
    // object is safe: it walks the same version chain a stored state
    // does (1.9.3 is the default), and migrate steps that are
    // version-stamp no-ops (e.g. 1.4.0 -> 1.5.0) are skipped because
    // the default SCHEMA_VERSION default literal is the ANCHOR for
    // fresh state, intentionally pinned at the earliest documented
    // schema (1.9.3) so a brand-new user walks through EVERY
    // migration step including the seed migration (e.g., the
    // Pedagogy of Desire seed at 1.9.3 → 1.10.0). Do NOT bump this
    // default literal when adding a new schema version. New
    // migration steps land in the migrate() chain only. The chain
    // does the work; the default literal stays the anchor.
    state = migrate(state);
    return state;
  }
  var migrated = migrate(stored);
  for (var k in migrated) {
    if (Object.prototype.hasOwnProperty.call(migrated, k)) {
      state[k] = migrated[k];
    }
  }
  return state;
}

function saveState() {
  // Synchronous localStorage write -- the durability guarantee.
  // Unchanged from the pre-Firestore behavior; bulk-add's per-entry
  // saveState crash-consistency contract is preserved (a mid-import
  // tab close leaves localStorage consistent).
  var ok = sv('praxis_state', state);
  // Firestore Stage 2: if a book mutation marked the flag, fire a
  // fire-and-forget per-user-doc write. localStorage is already
  // durable; the Firestore write is a best-effort remote mirror.
  // The forward references (getCurrentUser / buildUserBookDoc /
  // saveBooksToFirestore live in integrations.js, loaded after
  // state.js) resolve at call time -- saveState only runs post-
  // DOMContentLoaded, by which time integrations.js has evaluated.
  // The typeof guards mirror the existing `typeof ensureUser`
  // idiom in views.js: if integrations.js failed to load for any
  // reason, saveState still does its localStorage write and does
  // not throw.
  if (booksDirty) {
    booksDirty = false;
    var user = (typeof getCurrentUser === 'function')
      ? getCurrentUser()
      : null;
    if (user && user.uid &&
        typeof saveBooksToFirestore === 'function' &&
        typeof buildUserBookDoc === 'function') {
      var payload = buildUserBookDoc(user.uid);
      saveBooksToFirestore(user.uid, payload, function (result) {
        if (result && result.status === 'ok') {
          console.log('saveBooksToFirestore: ok');
        } else {
          console.warn(
            'saveBooksToFirestore: failed',
            result ? result.error : null
          );
        }
      });
    }
  }
  return ok;
}

// 3.10i: rewrite leading-http:// coverUrls in a books map to https://.
// Shared by migrate()'s 1.9.1 -> 1.9.2 step (over stored.books) and
// by loadBooksFromFirestore's 'found' branch (over the remote payload
// before replace-merge into state.books). Anchored leading-position
// test via the codebase's .indexOf(prefix) === 0 idiom -- a URL that
// merely contains 'http://' deeper in the string (e.g. inside a query
// param) is left untouched. Returns true ONLY when at least one
// record was rewritten; false when the map is empty/missing, when
// every coverUrl is already https://, when coverUrl is null/empty/not
// a string, or when http:// appears at non-zero position. The boolean
// is set inside the rewrite branch -- callers use it to decide
// whether to trigger a Firestore write-back, so it must reflect
// actual changes, not loop execution. Plain function declaration (no
// strict mode in this file) makes it globally accessible to
// integrations.js, matching the markBooksDirty / ensureUser / etc.
// cross-file exposure pattern.
function normalizeCoverUrlsToHttps(booksMap) {
  var changed = false;
  if (!booksMap) return changed;
  var bid;
  for (bid in booksMap) {
    if (Object.prototype.hasOwnProperty.call(booksMap, bid)) {
      var book = booksMap[bid];
      if (book && typeof book.coverUrl === 'string' &&
          book.coverUrl.indexOf('http://') === 0) {
        book.coverUrl = 'https://' + book.coverUrl.slice(7);
        changed = true;
      }
    }
  }
  return changed;
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
  if (stored.SCHEMA_VERSION === '1.8.0') {
    // 3.5a: state.books gains status + genre. Backfill every existing
    // record with safe defaults aligned to the add-book radio default
    // ('reading') and an empty genre string. Books created post-1.9.0
    // carry these fields from creation; the loop is a no-op on them
    // because both fields will already be the correct type.
    if (stored.books) {
      var bid;
      for (bid in stored.books) {
        if (Object.prototype.hasOwnProperty.call(stored.books, bid)) {
          var book = stored.books[bid];
          if (book) {
            if (typeof book.status !== 'string') {
              book.status = 'reading';
            }
            if (typeof book.genre !== 'string') {
              book.genre = '';
            }
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.9.0';
  }
  if (stored.SCHEMA_VERSION === '1.9.0') {
    // 3.7: state.books gains finishedAt. Stamp null on every existing
    // record so downstream readers see a present-but-null field rather
    // than undefined. The mark-finished button writes Date.now() on
    // click; everything else leaves it as null. No backfill for
    // bookArtifacts.title -- pre-3.7 there were no real Artifacts.
    if (stored.books) {
      var bid2;
      for (bid2 in stored.books) {
        if (Object.prototype.hasOwnProperty.call(stored.books, bid2)) {
          var book2 = stored.books[bid2];
          if (book2 && typeof book2.finishedAt === 'undefined') {
            book2.finishedAt = null;
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.9.1';
  }
  if (stored.SCHEMA_VERSION === '1.9.1') {
    // 3.10i: rewrite any leading-http:// coverUrl in stored.books to
    // https://. Mirrors the read-path fix at both Google Books read
    // sites in integrations.js. The helper's return value is ignored
    // here -- migrate() must not touch booksDirty (consistent with
    // every other migrate step); persistence to localStorage happens
    // via the boot loadState -> saveState pair in app.js. The
    // Firestore replace-merge replay-undo is handled separately in
    // loadBooksFromFirestore's 'found' branch (Stage 2B), which calls
    // the same helper on the remote payload and conditionally flushes
    // back when the helper returns true.
    normalizeCoverUrlsToHttps(stored.books);
    stored.SCHEMA_VERSION = '1.9.2';
  }
  if (stored.SCHEMA_VERSION === '1.9.2') {
    // 3.8: arc.bookIds / arc.entryIds move from id-string arrays to
    // {id, addedAt} object arrays. No arcs exist in any code-created
    // state (Stage 0 verified zero write sites), so this is a
    // version-bump no-op. New shape applies to writes from 3.8 forward.
    stored.SCHEMA_VERSION = '1.9.3';
  }
  if (stored.SCHEMA_VERSION === '1.9.3') {
    // Stage 5.3 Stage 3a: seed the "A Pedagogy of Desire" worked-
    // example arc + five book records. Idempotent on two layers:
    // (1) this migration step only fires when stored is exactly at
    // 1.9.3, after which the version stamp bumps to 1.10.0 and the
    // step is skipped on every subsequent load; and (2) the
    // belt-and-braces early-return checks stored.seeds.pedagogyOfDesire
    // .attempted -- protects against accidental version regression
    // (e.g. a future migration that re-writes 1.10.0 -> 1.9.3 for
    // some reason). The 'attempted' marker survives a user deleting
    // the seeded arc, so deleteArc on the seed is permanent --
    // re-seeding requires clearing localStorage entirely.
    //
    // Books go into stored.books only (NOT stored.userBooks) -- the
    // example must not pollute any user's shelf. coverUrl: null on
    // every seeded book; app.js fires fetchAndApplyCover asynchronously
    // after loadState. Null-as-retry: any future load whose seed-book
    // coverUrl is still null re-attempts the OL fetch automatically.
    //
    // The arc is owned by the sentinel userId '__praxis_seed__' so
    // it is global, not per-user. Stage 3b patches renderArcDetail's
    // user-filter check to allow seed-owned arcs through; until that
    // patch ships, the seeded arc is reachable in state but not
    // rendered by #arc/<id>. The arc's id is non-deterministic
    // (genArcId uses Date.now + random) so Stage 3b reads it from
    // stored.seeds.pedagogyOfDesire.arcId rather than hardcoding.
    //
    // Inline writes against stored.books / stored.arcs because
    // createArc / addBookToArc operate on the live `state` object,
    // not the migration-local `stored` arg. The arc shape mirrors
    // createArc's output (state.js:362-371) byte-for-byte.
    if (!stored.seeds) stored.seeds = {};
    if (!stored.seeds.pedagogyOfDesire ||
        !stored.seeds.pedagogyOfDesire.attempted) {
      if (!stored.books) stored.books = {};
      if (!stored.arcs)  stored.arcs  = {};

      var seedNow = Date.now();
      // Cleanup post-7.1B: tradition baked into seed literal so the
      // constellation renders 5 visible glyphs on fresh state without
      // a per-book user override. ensureBookFields' string-guard
      // (state.js:373-385) sees `tradition` already set and skips the
      // derive-from-genre fallback, so genre stays '' (no false
      // shelf-theme assignment) while tradition carries the intended
      // intrinsic value. Existing accounts already have tradition
      // 'unassigned' persisted -- they're unaffected by this change.
      var seedBooks = [
        { title:     'Zombie Politics and Culture in the Age of Casino ' +
                     'Capitalism',
          author:    'Henry Giroux',
          isbn:      '9781433127199',
          tradition: 'theory' },
        { title:     'Yearning: Race, Gender, and Cultural Politics',
          author:    'bell hooks',
          isbn:      '9781138821750',
          tradition: 'memoir' },
        { title:     'Hidden Potential',
          author:    'Adam Grant',
          isbn:      '9780593653142',
          tradition: 'empirical' },
        { title:     'Range: Why Generalists Triumph in a Specialized World',
          author:    'David Epstein',
          isbn:      '9780735214507',
          tradition: 'empirical' },
        { title:     'Their Eyes Were Watching God',
          author:    'Zora Neale Hurston',
          isbn:      '9780061120060',
          tradition: 'novel' }
      ];

      var seedBookIds = [];
      var si;
      for (si = 0; si < seedBooks.length; si++) {
        var sb = seedBooks[si];
        var sbid = genBookId();
        stored.books[sbid] = {
          id:         sbid,
          title:      sb.title,
          author:     sb.author,
          isbn:       sb.isbn,
          addedAt:    seedNow,
          status:     'reading',
          genre:      '',
          tradition:  sb.tradition,
          finishedAt: null,
          coverUrl:   null
        };
        seedBookIds.push(sbid);
      }

      var seedArcId = genArcId();
      var seedArc = {
        id:          seedArcId,
        userId:      '__praxis_seed__',
        title:       'A Pedagogy of Desire',
        description: 'Five books on desire as a pedagogical force — ' +
                     'what it shapes us toward when we follow it, ' +
                     'and who we become when we don\'t.',
        bookIds:     [],
        entryIds:    [],
        createdAt:   seedNow,
        updatedAt:   seedNow
      };
      var sj;
      for (sj = 0; sj < seedBookIds.length; sj++) {
        seedArc.bookIds.push({
          id:      seedBookIds[sj],
          addedAt: seedNow
        });
      }
      stored.arcs[seedArcId] = seedArc;

      stored.seeds.pedagogyOfDesire = {
        attempted: true,
        arcId:     seedArcId,
        bookIds:   seedBookIds,
        seededAt:  seedNow
      };
    }
    stored.SCHEMA_VERSION = '1.10.0';
  }
  // 5.6 sub-step 1: state.books gains tradition + traditionOverride.
  // Delegated to the ensureBookFieldsAll chokepoint so the migration
  // logic and the runtime write-path logic (Firestore merge in
  // integrations.js, new-book creation in views.js) share a single
  // source of truth. ensureBookFieldsAll is idempotent — re-running
  // it on already-migrated state is a no-op.
  if (stored.SCHEMA_VERSION === '1.10.0') {
    if (stored.books) {
      ensureBookFieldsAll(stored.books);
    }
    stored.SCHEMA_VERSION = '1.11.0';
  }
  // 9.1A: introduce the subTheories map and its schema fields.
  // Delegated to the ensureSubTheoryFieldsAll chokepoint so the
  // migration logic and future runtime write paths share a single
  // source of truth, mirroring the 1.10.0 -> 1.11.0 step.
  // ensureSubTheoryFieldsAll is idempotent — re-running on already-
  // migrated state is a no-op.
  if (stored.SCHEMA_VERSION === '1.11.0') {
    if (!stored.subTheories) stored.subTheories = {};
    ensureSubTheoryFieldsAll(stored.subTheories);
    stored.SCHEMA_VERSION = '1.12.0';
  }
  return stored;
}

console.log('state.js loaded');
