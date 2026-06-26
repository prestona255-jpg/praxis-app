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
//         register:   string,    // 'journal' | 'marginalia' | 'question'
//         isPrivate:  boolean,   // register default; toggle UI in 3.4
//         body:       string,    // raw text / markdown
//         bookIds:    array of string,   // foreign keys into state.books
//         arcIds:     array of string,   // foreign keys into state.arcs
//         filed:      boolean,   // false = Inbox (untriaged); true = placed (N-epic)
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
//   currentSubTheoryId: string | null // foreign key into
//                                  // state.subTheories, or null if no
//                                  // sub-theory is open
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
//   registerDefaults: { journal: boolean, marginalia: boolean, question: boolean }
//
// Initial values are { journal: true, marginalia: false }. journal is
// private-by-default as of 6.2c-pre (schema 1.15.0; it was false --
// fail-open -- through 1.14.0, until the honesty fix made the code match
// Yumi's promise); marginalia stays fail-open (visible), as the
// notes-attached-to-a-book Yumi is meant to see. The 1.7.0 -> 1.8.0
// migration seeds the field on every user record and backfills
// entry.isPrivate (per-register) for any entry where the field is not a
// boolean; the 1.14.0 -> 1.15.0 step flips journal to private retroactively. The toggle UI and
// the register-default settings affordance ship in 3.4b; the
// filter that consumes isPrivate ships in 3.4a inside
// yumi-brain.js buildContext(), enforcing principle #5
// (no asymmetric knowledge -- anything captured is visible and
// correctable to the user).
//
// Schema 1.9.0 adds two user-facing fields to state.books records:
//
//   status: string   // stored: legacy 'want'|'reading'|'finished' OR canonical
//                    // 'will-read'|'reading'|'read'. Read THROUGH normalizeStatus
//                    // (Phase 1): finished===read, want===will-read. Stored
//                    // values are never rewritten; new/changed records write canonical.
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
  currentSubTheoryId: null,
  users:           {},
  books:           {},
  userBooks:       {},
  notebooks:       {},
  notebookEntries: {},
  bookArtifacts:   {},
  arcs:            {},
  subTheories:     {},
  userThemes:      {}
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
  // Phase 1: extended bibliographic fields. null / '' defaults, never undefined.
  // Idempotent (only stamps when missing/wrong-typed). NOT status -- read-status
  // is normalized on read (normalizeStatus), never rewritten here.
  if (typeof book.pageCount === 'undefined') { book.pageCount = null; changed = true; }
  if (typeof book.publisher !== 'string')    { book.publisher = '';   changed = true; }
  if (typeof book.year === 'undefined')      { book.year = null;      changed = true; }
  if (typeof book.description !== 'string')   { book.description = ''; changed = true; }
  if (typeof book.rating === 'undefined')    { book.rating = null;    changed = true; }
  if (typeof book.dateRead === 'undefined')  { book.dateRead = null;  changed = true; }
  // Stage 2 (shelf categories): cached classification label (one of
  // SHELF_CATEGORIES / CATEGORY_UNCATEGORIZED, or '' until classified) plus the
  // raw subject strings from the metadata source (input to the deterministic
  // classifier). '' / [] defaults, never undefined; idempotent like the above.
  if (typeof book.category !== 'string')      { book.category = '';      changed = true; }
  if (!(book.rawCategories instanceof Array)) { book.rawCategories = []; changed = true; }
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

// =====================================================================
// Phase 1 -- read-status normalization.
//
// Stored vocabulary is the legacy {want, reading, finished}; the canonical
// display vocabulary is {will-read, reading, read} (mockup: Will read /
// Currently reading / Have read). normalizeStatus maps ANY stored value
// (legacy OR canonical) onto the canonical set so reads and comparisons are
// uniform, WITHOUT rewriting stored values -- existing books' stored status
// is preserved (build non-goal). New and user-changed records WRITE the
// canonical vocabulary; legacy values normalize on read.
//   legacy 'finished'  ===  canonical 'read'       (done reading)
//   legacy 'want'      ===  canonical 'will-read'
//   'reading' unchanged. Unknown/falsy -> 'reading'.
// =====================================================================
function normalizeStatus(s) {
  if (s === 'finished' || s === 'read') { return 'read'; }
  if (s === 'want' || s === 'will-read') { return 'will-read'; }
  if (s === 'reading') { return 'reading'; }
  return 'reading';
}

// Canonical status -> human label (mockup vocabulary).
var STATUS_LABELS = {
  'reading':   'Currently reading',
  'read':      'Have read',
  'will-read': 'Will read'
};

// statusText(stored) -> display label for any stored value. Named statusText
// (not statusLabel) to avoid shadowing a local DOM var in the book-detail
// status selector.
function statusText(s) {
  var c = normalizeStatus(s);
  return STATUS_LABELS[c] || STATUS_LABELS.reading;
}

// Canonical vocabulary in mockup display order (Currently reading / Have
// read / Will read) -- used by the status selectors and the review control.
var STATUS_VOCAB = ['reading', 'read', 'will-read'];

// =====================================================================
// Stage 2 (shelf categories): the fixed curated taxonomy + the PURE local
// classifier. The shelf's Categories grouping sorts each book into ONE of
// SHELF_CATEGORIES (or CATEGORY_UNCATEGORIZED). Web/LLM classification maps
// INTO this set -- it never invents a free-form category. Only populated
// categories render (views.js); CATEGORY_UNCATEGORIZED sinks to the bottom.
// classifyBookLocal is the cheap, pure, offline resolver (cached -> seed ->
// keyword -> null); a null return is the explicit "needs the LLM" signal the
// 2C orchestrator consumes (null -> batch classifier -> CATEGORY_UNCATEGORIZED),
// so the caller/UI never sees null or a blank label.
// =====================================================================
var SHELF_CATEGORIES = [
  'Literary Fiction',
  'Genre Fiction',
  'Theory & Philosophy',
  'Social & Political Thought',
  'Race & Identity',
  'Education',
  'History',
  'Memoir & Biography',
  'Psychology & Mind',
  'Science & Nature',
  'Technology & Society',
  'Religion & Spirituality',
  'Poetry',
  'Essays & Criticism',
  'Arts & Culture',
  'Business & Economics',
  'Health & Living'
];
var CATEGORY_UNCATEGORIZED = 'Uncategorized';

// True iff label is one of the 17 curated categories (NOT Uncategorized).
function isShelfCategory(label) {
  if (typeof label !== 'string' || label === '') { return false; }
  var i;
  for (i = 0; i < SHELF_CATEGORIES.length; i = i + 1) {
    if (SHELF_CATEGORIES[i] === label) { return true; }
  }
  return false;
}

// True iff label is a valid RESOLVED category (the 17 OR Uncategorized) -- the
// gate every cached value and every LLM answer passes through.
function isValidCategoryLabel(label) {
  return label === CATEGORY_UNCATEGORIZED || isShelfCategory(label);
}

// Ordered, identity-first keyword map over raw BISAC subject strings. First
// match wins (lowercased substring), so order is load-bearing: identity before
// fiction; "literary criticism" before "literary"/"fiction"; the "literary" ->
// Literary Fiction entry before the generic "fiction" -> Genre Fiction entry
// (so "Fiction / Literary" splits correctly and "Science Fiction" lands in
// Genre Fiction, NOT Science & Nature); topical subjects last, broad "history"
// at the very bottom.
var RAW_CATEGORY_MAP = [
  ['ethnic',             'Race & Identity'],
  ['african american',   'Race & Identity'],
  ['feminism',           'Race & Identity'],
  ['feminist',           'Race & Identity'],
  ['gender',             'Race & Identity'],
  ['lgbt',               'Race & Identity'],
  ['queer',              'Race & Identity'],
  ['literary criticism', 'Essays & Criticism'],
  ['criticism',          'Essays & Criticism'],
  ['essays',             'Essays & Criticism'],
  ['poetry',             'Poetry'],
  ['literary',           'Literary Fiction'],
  ['fiction',            'Genre Fiction'],
  ['biography',          'Memoir & Biography'],
  ['autobiography',      'Memoir & Biography'],
  ['memoir',             'Memoir & Biography'],
  ['philosophy',         'Theory & Philosophy'],
  ['political',          'Social & Political Thought'],
  ['social science',     'Social & Political Thought'],
  ['sociology',          'Social & Political Thought'],
  ['anthropology',       'Social & Political Thought'],
  ['psychology',         'Psychology & Mind'],
  ['religion',           'Religion & Spirituality'],
  ['spirit',             'Religion & Spirituality'],
  ['theology',           'Religion & Spirituality'],
  ['education',          'Education'],
  ['teaching',           'Education'],
  ['business',           'Business & Economics'],
  ['economic',           'Business & Economics'],
  ['technology',         'Technology & Society'],
  ['computer',           'Technology & Society'],
  ['internet',           'Technology & Society'],
  ['science',            'Science & Nature'],
  ['nature',             'Science & Nature'],
  ['biology',            'Science & Nature'],
  ['physics',            'Science & Nature'],
  ['mathematics',        'Science & Nature'],
  ['health',             'Health & Living'],
  ['fitness',            'Health & Living'],
  ['self-help',          'Health & Living'],
  ['wellness',           'Health & Living'],
  ['cooking',            'Health & Living'],
  ['art',                'Arts & Culture'],
  ['music',              'Arts & Culture'],
  ['photography',        'Arts & Culture'],
  ['design',             'Arts & Culture'],
  ['film',               'Arts & Culture'],
  ['performing arts',    'Arts & Culture'],
  ['history',            'History']
];

// Map ONE raw subject string to a taxonomy category, or null if nothing in the
// ordered map matches. Lowercased substring, first match wins.
function rawCategoryToShelf(raw) {
  var s = (typeof raw === 'string') ? raw.toLowerCase() : '';
  if (s === '') { return null; }
  var i;
  for (i = 0; i < RAW_CATEGORY_MAP.length; i = i + 1) {
    if (s.indexOf(RAW_CATEGORY_MAP[i][0]) !== -1) {
      return RAW_CATEGORY_MAP[i][1];
    }
  }
  return null;
}

// PURE local classifier: cached -> rawCategories keyword -> null (needs the
// LLM). A non-null return is ALWAYS a valid label (one of the
// 17, or Uncategorized when that was the cached value); null means "send to the
// LLM". It never returns a blank or invalid string. The 2C orchestrator turns
// a null into an LLM call, and any book the LLM also can't place becomes
// CATEGORY_UNCATEGORIZED -- so the caller/UI never sees null.
function classifyBookLocal(book) {
  if (!book || typeof book !== 'object') { return null; }
  // (1) cached label from a prior classification (incl. a cached Uncategorized,
  //     so already-classified books never re-hit the LLM)
  if (typeof book.category === 'string' && isValidCategoryLabel(book.category)) {
    return book.category;
  }
  // (2) keyword map over the raw BISAC strings, first match wins
  if (book.rawCategories instanceof Array) {
    var i, hit;
    for (i = 0; i < book.rawCategories.length; i = i + 1) {
      hit = rawCategoryToShelf(book.rawCategories[i]);
      if (hit) { return hit; }
    }
  }
  // (3) unresolved locally -> needs the LLM
  return null;
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
  // 10.5.7: citationPins maps a lowercased citation phrase -> the chosen
  // evidence id, persisting the author's disambiguation so a pinned
  // ambiguous citation survives reload and routes the read-only render.
  if (!st.citationPins || typeof st.citationPins !== 'object') {
    st.citationPins = {};
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
  if (typeof st.x !== 'number' && st.x !== null) {
    st.x = null;
    changed = true;
  }
  if (typeof st.y !== 'number' && st.y !== null) {
    st.y = null;
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

// Stage 14.1c-fix (workspace sync): backfill sub-theory userId from the
// parent arc's owner. Sub-theories created before this stage carry no
// userId (ownership was transitive); this stamps a direct owner so the
// sync filter can match on st.userId. Used by migrate() over stored
// records AND by the Firestore merge over remote records (which bypass
// migrate). Orphans (parent arc missing) are left unset -- they were not
// syncing under the transitive model either. Idempotent: a record that
// already carries a string userId is skipped. New records get their
// userId from the creating user in createSubTheory, not from here.
function backfillSubTheoryUserId(stMap, arcsMap) {
  if (!stMap || typeof stMap !== 'object') { return false; }
  var changed = false;
  var sid;
  for (sid in stMap) {
    if (Object.prototype.hasOwnProperty.call(stMap, sid)) {
      var st = stMap[sid];
      if (st && typeof st.userId !== 'string' && st.arcId &&
          arcsMap && arcsMap[st.arcId] &&
          typeof arcsMap[st.arcId].userId === 'string') {
        st.userId = arcsMap[st.arcId].userId;
        changed = true;
      }
    }
  }
  return changed;
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

// =====================================================================
// Phase 0 -- pendingBookSync guard.
//
// A per-user persisted set of locally-written book ids whose Firestore
// write has NOT yet been confirmed. The REPLACE merge in integrations.js
// (onAuthStateChanged 'found' branch) deletes any local book id absent
// from the just-read remote doc; a book added by scan/bulk that has not
// finished syncing is therefore wiped on the next auth event / reload.
// This set lets that merge tell "added locally, not yet synced" (KEEP)
// apart from "genuinely deleted on the server" (DROP).
//
// Stored in a dedicated per-uid localStorage key via ls/sv -- NOT inside
// the big state blob -- so it is namespaced by uid in a shared browser
// and is untouched by the REPLACE merge over state.books. Marked at every
// shelf write site; cleared for exactly the payload snapshot ids on a
// confirmed saveBooksToFirestore success. Promise-free (cscript-parseable).
// =====================================================================
function pendingBooksKey(uid) {
  return 'praxis_pending_books_' + (uid || 'anon');
}

function getPendingBookSync(uid) {
  var arr = ls(pendingBooksKey(uid), []);
  if (!arr || typeof arr.length !== 'number') return [];
  return arr;
}

function markBookPending(uid, bookId) {
  if (!uid || !bookId) return;
  var arr = getPendingBookSync(uid);
  var i;
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === bookId) return;
  }
  arr.push(bookId);
  sv(pendingBooksKey(uid), arr);
}

function isBookPending(uid, bookId) {
  if (!uid || !bookId) return false;
  var arr = getPendingBookSync(uid);
  var i;
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === bookId) return true;
  }
  return false;
}

// Clear exactly the ids in `ids` (the payload snapshot from a confirmed
// save) from the pending set, leaving any id marked AFTER that snapshot
// still pending. No-op for ids that were never pending.
function clearPendingBookSync(uid, ids) {
  if (!uid || !ids || typeof ids.length !== 'number' || ids.length === 0) return;
  var arr = getPendingBookSync(uid);
  if (arr.length === 0) return;
  var remove = {};
  var i;
  for (i = 0; i < ids.length; i++) { remove[ids[i]] = true; }
  var next = [];
  for (i = 0; i < arr.length; i++) {
    if (!remove[arr[i]]) next.push(arr[i]);
  }
  sv(pendingBooksKey(uid), next);
}

// =====================================================================
// Stage 6 -- pendingBookDeletes guard (symmetric to pendingBookSync).
//
// A per-user persisted set of locally-DELETED book ids whose Firestore
// removal has NOT yet been confirmed by a remote read. The REPLACE merge
// (mergeRemoteBookDoc) rebuilds the index from the remote doc; a delete whose
// write has not yet propagated would otherwise be RESURRECTED from a stale
// remote read. This set lets the merge SKIP such ids (never copy them back)
// until the remote no longer lists them, at which point the merge clears the
// mark. Same dedicated per-uid localStorage key pattern as pendingBookSync;
// promise-free (cscript-parseable).
// =====================================================================
function pendingBookDeletesKey(uid) {
  return 'praxis_pending_book_deletes_' + (uid || 'anon');
}

function getPendingBookDeletes(uid) {
  var arr = ls(pendingBookDeletesKey(uid), []);
  if (!arr || typeof arr.length !== 'number') return [];
  return arr;
}

function markBookDeletePending(uid, bookId) {
  if (!uid || !bookId) return;
  var arr = getPendingBookDeletes(uid);
  var i;
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === bookId) return;
  }
  arr.push(bookId);
  sv(pendingBookDeletesKey(uid), arr);
}

function isBookDeletePending(uid, bookId) {
  if (!uid || !bookId) return false;
  var arr = getPendingBookDeletes(uid);
  var i;
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === bookId) return true;
  }
  return false;
}

// Clear exactly the ids in `ids` (confirmed-removed on the server) from the
// delete-pending set. No-op for ids that were never pending.
function clearPendingBookDelete(uid, ids) {
  if (!uid || !ids || typeof ids.length !== 'number' || ids.length === 0) return;
  var arr = getPendingBookDeletes(uid);
  if (arr.length === 0) return;
  var remove = {};
  var i;
  for (i = 0; i < ids.length; i++) { remove[ids[i]] = true; }
  var next = [];
  for (i = 0; i < arr.length; i++) {
    if (!remove[arr[i]]) next.push(arr[i]);
  }
  sv(pendingBookDeletesKey(uid), next);
}

// Phase 0 (Stage 3): best-effort flush of any unsynced book adds. Called on
// page-hide (visibilitychange hidden / pagehide) so a scan/bulk add gets one
// more push to Firestore before the tab backgrounds or closes. No-op when
// nothing is pending. The push goes through saveState's existing booksDirty
// -> saveBooksToFirestore chokepoint (clears pending on success, re-dirties
// on failure). Forward refs (getCurrentUser/saveState) resolve at call time.
function flushPendingBooks() {
  var fpUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  if (!fpUser || !fpUser.uid) return;
  var fpPend = getPendingBookSync(fpUser.uid);
  // Stage 6: a pending DELETE also needs the doc re-pushed so the removal lands.
  var fpDel = getPendingBookDeletes(fpUser.uid);
  if ((!fpPend || fpPend.length === 0) && (!fpDel || fpDel.length === 0)) return;
  markBooksDirty();
  saveState();
}

// Stage 14.1a (workspace sync): dirty flag for the per-user arc doc,
// mirroring booksDirty. The arc mutators mark it; saveState() consumes
// it and fires a fire-and-forget /userArcs/{uid} write. Saves touching
// no arc leave it unset and incur no arc round-trip.
var arcsDirty = false;

function markArcsDirty() {
  arcsDirty = true;
}

// Stage 14.1b (workspace sync): dirty flag for the per-user notebook doc,
// mirroring booksDirty / arcsDirty. The entry mutators (in views.js for
// create + privacy toggle, in state.js for addEntryToArc + deleteEntry)
// mark it; saveState() consumes it and fires a fire-and-forget
// /userNotebook/{uid} write.
var notebookDirty = false;

function markNotebookDirty() {
  notebookDirty = true;
}

// Stage 14.1c (workspace sync): dirty flag for the per-user sub-theory doc.
// The six sub-theory mutators (which already call saveState themselves) mark
// it; saveState() consumes it and fires a fire-and-forget
// /userSubTheories/{uid} write.
var subTheoriesDirty = false;

function markSubTheoriesDirty() {
  subTheoriesDirty = true;
}

// Stage 7 (manual themes): dirty flag for the per-user theme-overlay doc,
// mirroring subTheoriesDirty. createUserTheme / assignBookToTheme /
// unassignBookFromTheme mark it; saveState() consumes it and fires a
// fire-and-forget /userThemes/{uid} write.
var themesDirty = false;

function markThemesDirty() {
  themesDirty = true;
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

// Canonical evidence id generator (9.2). Shaped identically to
// genSubTheoryId; the 'evidence_' prefix keeps an evidence element's
// id from colliding with any sub-theory, arc, book, or notebook entry.
function genEvidenceId() {
  return 'evidence_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// yumi-intelligence Stage I: reader-model thread id generator. Shaped
// identically to genEvidenceId / genSubTheoryId; the 'thread_' prefix keeps a
// reader-model thread id from colliding with any entry, book, arc, sub-theory,
// or evidence element. NEVER an array index -- threads are addressed by this
// stable id for manual edit/delete (and Stage II's NOTICE->NAME write).
function genThreadId() {
  return 'thread_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// Lazy initializer for per-user records. The schema-versioned shape of
// a user record is owned here so that future writers (notebook entries,
// artifacts, arcs, etc.) can call ensureUser(uid) instead of duplicating
// the default shape. Called by the first writer to state.users[uid].
function ensureUser(uid) {
  if (!state.users[uid]) {
    state.users[uid] = {
      yumiMemory:       { summary: '', recentTurns: [], updatedAt: 0 },
      registerDefaults: { journal: true, marginalia: false, question: false },
      profile:          { displayNameOverride: '', penName: '', onboardingSeen: false, tagline: '', yumiReadsAlong: true, yumiReaderModel: false, yumiWebGrounding: false, voiceOn: false, talkMode: 'push-to-talk', values: [] },
      readerModel:      { threads: [], profile: { summary: '', updatedAt: 0 }, updatedAt: 0 }
    };
  }
  if (!state.users[uid].yumiMemory) {
    state.users[uid].yumiMemory = {
      summary: '', recentTurns: [], updatedAt: 0
    };
  }
  if (!state.users[uid].registerDefaults) {
    state.users[uid].registerDefaults = {
      journal: true, marginalia: false, question: false
    };
  }
  // N-epic: question register default (visible, like marginalia). Additive
  // field guard for a user record seeded before the N-epic.
  if (state.users[uid].registerDefaults &&
      typeof state.users[uid].registerDefaults.question !== 'boolean') {
    state.users[uid].registerDefaults.question = false;
  }
  // Stage 14.3 Stage 1: profile override layer (display-name override +
  // optional pen name). Additive guard for users seeded before 14.3 so
  // an existing in-memory user gains the slot without disturbing
  // yumiMemory / registerDefaults.
  if (!state.users[uid].profile) {
    state.users[uid].profile = { displayNameOverride: '', penName: '', onboardingSeen: false, tagline: '', yumiReadsAlong: true, yumiReaderModel: false, yumiWebGrounding: false, voiceOn: false, talkMode: 'push-to-talk', values: [] };
  }
  // N-epic: yumiReadsAlong master consent switch, default true (the pre-epic
  // behavior). Lives in profile{} so it mirrors via /userProfiles. Additive
  // field guard for a profile seeded before the N-epic.
  if (state.users[uid].profile &&
      typeof state.users[uid].profile.yumiReadsAlong !== 'boolean') {
    state.users[uid].profile.yumiReadsAlong = true;
  }
  // yumi-intelligence Stage I: reader-model opt-in, default FALSE (strictly
  // opt-in -- a pre-build profile is NOT enrolled). Lives in profile{} so it
  // mirrors via /userProfiles next to yumiReadsAlong. Additive field guard.
  if (state.users[uid].profile &&
      typeof state.users[uid].profile.yumiReaderModel !== 'boolean') {
    state.users[uid].profile.yumiReaderModel = false;
  }
  // yumi-intelligence Stage III: live-web grounding opt-in, default FALSE
  // (reaching outside the app is a SEPARATE consent -- a pre-build profile is
  // NOT enrolled). Lives in profile{} so it mirrors via /userProfiles next to
  // yumiReaderModel. Additive field guard.
  if (state.users[uid].profile &&
      typeof state.users[uid].profile.yumiWebGrounding !== 'boolean') {
    state.users[uid].profile.yumiWebGrounding = false;
  }
  // Alive Yumi: voice-out opt-in, default FALSE (strictly opt-in -- a pre-build
  // profile never speaks). Lives in profile{} so it mirrors via /userProfiles.
  if (state.users[uid].profile &&
      typeof state.users[uid].profile.voiceOn !== 'boolean') {
    state.users[uid].profile.voiceOn = false;
  }
  // Alive Yumi: talk-mode, default 'push-to-talk'. Constrained to the two valid
  // values; any other (or absent) backfills to push-to-talk.
  if (state.users[uid].profile &&
      state.users[uid].profile.talkMode !== 'push-to-talk' &&
      state.users[uid].profile.talkMode !== 'hands-free') {
    state.users[uid].profile.talkMode = 'push-to-talk';
  }
  // Portrait Stage 1: declared values list (the "stones"). Additive guard so a
  // profile seeded before this build gains the slot. Default [] -- DECLARED by
  // the reader, never inferred (Yumi does not write here).
  if (state.users[uid].profile &&
      !(state.users[uid].profile.values instanceof Array)) {
    state.users[uid].profile.values = [];
  }
  // yumi-intelligence Stage I: the reader-model store (named threads + a prose
  // reading profile), mirrored via its own /userReaderModel/{uid} doc. Additive
  // guards backfill the default shape + each sub-field for a record seeded
  // before this build, without disturbing yumiMemory / profile / registerDefaults.
  if (!state.users[uid].readerModel ||
      typeof state.users[uid].readerModel !== 'object') {
    state.users[uid].readerModel = { threads: [], profile: { summary: '', updatedAt: 0 }, updatedAt: 0 };
  }
  if (!(state.users[uid].readerModel.threads instanceof Array)) {
    state.users[uid].readerModel.threads = [];
  }
  if (!state.users[uid].readerModel.profile ||
      typeof state.users[uid].readerModel.profile !== 'object') {
    state.users[uid].readerModel.profile = { summary: '', updatedAt: 0 };
  }
  if (typeof state.users[uid].readerModel.profile.summary !== 'string') {
    state.users[uid].readerModel.profile.summary = '';
  }
  if (typeof state.users[uid].readerModel.profile.updatedAt !== 'number') {
    state.users[uid].readerModel.profile.updatedAt = 0;
  }
  if (typeof state.users[uid].readerModel.updatedAt !== 'number') {
    state.users[uid].readerModel.updatedAt = 0;
  }
  if (!state.userBooks[uid]) {
    state.userBooks[uid] = { bookIds: [] };
  }
}

// Stage 14.3 Stage 1: profile reader. Returns the uid's profile object
// (ensureUser-seeded { displayNameOverride, penName }). Tolerates a
// never-seeded uid by returning a fresh empty-fields object rather than
// undefined, so callers can read .displayNameOverride / .penName
// unconditionally.
function getProfile(uid) {
  if (uid && state.users[uid] && state.users[uid].profile) {
    return state.users[uid].profile;
  }
  return { displayNameOverride: '', penName: '', onboardingSeen: false, tagline: '', yumiReadsAlong: true, yumiReaderModel: false, yumiWebGrounding: false, voiceOn: false, talkMode: 'push-to-talk', values: [] };
}

// Stage 14.3 Stage 1: profile mutator. Writes the two string fields
// (only when present in fields) and persists via saveState. ensureUser
// guarantees the slot exists before assignment. String-coerced via
// concatenation to keep the stored shape strictly { string, string }.
function setProfile(uid, fields) {
  if (!uid) return;
  ensureUser(uid);
  var p = state.users[uid].profile;
  if (fields && typeof fields.displayNameOverride !== 'undefined') {
    p.displayNameOverride = '' + fields.displayNameOverride;
  }
  if (fields && typeof fields.penName !== 'undefined') {
    p.penName = '' + fields.penName;
  }
  // #8 Stage 4b: additive one-line self-description (tagline). String-coerced
  // like the others; default-on-read handles records saved before this field.
  if (fields && typeof fields.tagline !== 'undefined') {
    p.tagline = '' + fields.tagline;
  }
  // 6.2b: first-run greeting flag. Boolean-coerced so the stored shape
  // stays strict; set true only at onboarding (Beat F) completion.
  if (fields && typeof fields.onboardingSeen !== 'undefined') {
    p.onboardingSeen = fields.onboardingSeen === true;
  }
  // N-epic: master consent switch. Boolean-coerced; default-true is handled
  // on read (getProfile / ensureUser), so only an explicit value writes here.
  if (fields && typeof fields.yumiReadsAlong !== 'undefined') {
    p.yumiReadsAlong = fields.yumiReadsAlong === true;
  }
  // yumi-intelligence Stage I: reader-model opt-in. Boolean-coerced; default-
  // false is handled on read (getProfile / ensureUser), so only an explicit
  // value writes here.
  if (fields && typeof fields.yumiReaderModel !== 'undefined') {
    p.yumiReaderModel = fields.yumiReaderModel === true;
  }
  // yumi-intelligence Stage III: live-web grounding opt-in. Boolean-coerced;
  // default-false is handled on read (getProfile / ensureUser), so only an
  // explicit value writes here.
  if (fields && typeof fields.yumiWebGrounding !== 'undefined') {
    p.yumiWebGrounding = fields.yumiWebGrounding === true;
  }
  // Alive Yumi: voice-out opt-in. Boolean-coerced; default-false on read.
  if (fields && typeof fields.voiceOn !== 'undefined') {
    p.voiceOn = fields.voiceOn === true;
  }
  // Alive Yumi: talk-mode. Validated to the two values; anything else -> the
  // push-to-talk default.
  if (fields && typeof fields.talkMode !== 'undefined') {
    p.talkMode = (fields.talkMode === 'hands-free') ? 'hands-free' : 'push-to-talk';
  }
  // Portrait Stage 1: declared values (the "stones"). Sanitized to an array of
  // trimmed, non-empty strings; DECLARED by the reader, never inferred. Only an
  // explicit array writes (absent -> the default-on-read [] stands).
  if (fields && fields.values instanceof Array) {
    var vv = [], vi;
    for (vi = 0; vi < fields.values.length; vi = vi + 1) {
      var vs = ('' + fields.values[vi]).trim();
      if (vs) { vv.push(vs); }
    }
    p.values = vv;
  }
  saveState();
}

// =====================================================================
// yumi-intelligence Stage I: reader-model accessors + MANUAL CRUD.
// The reader-model is { threads:[...], profile:{summary,updatedAt}, updatedAt }
// nested per-user under state.users[uid].readerModel (mirrors yumiMemory).
// Stage I writers are the panel's manual CRUD ONLY -- NOTICE->NAME auto-write
// and the profile auto-refresh are Stage II. Every mutator persists locally via
// saveState; the /userReaderModel Firestore mirror is driven by the UI caller
// (views.js), exactly as the master switch calls saveProfileToFirestore after
// setProfile. A thread row matches the locked schema: id (genThreadId, never an
// index), label, oneLine, status ('noticed'|'named'|'dismissed'), memberNoteIds,
// arcId (single derived arc, null until named), subTheoryId (null until named),
// createdAt, updatedAt.
// =====================================================================

// Reader-model reader. Returns the uid's readerModel object (ensureUser-seeded).
// Tolerates a never-seeded uid by returning a fresh default shape rather than
// undefined, so callers can read .threads / .profile unconditionally.
function getReaderModel(uid) {
  if (uid && state.users[uid] && state.users[uid].readerModel) {
    return state.users[uid].readerModel;
  }
  return { threads: [], profile: { summary: '', updatedAt: 0 }, updatedAt: 0 };
}

// Manual thread add (panel "Add a theme"). status 'named' (a manual add is
// reader-affirmed by construction); memberNoteIds [] (no NOTICE cluster behind
// a manual add); arcId / subTheoryId null (Stage II links those). Returns the
// new thread, or null on an empty label. Persists via saveState.
function addReaderThread(uid, label) {
  if (!uid) { return null; }
  var clean = (typeof label === 'string') ? label.replace(/^\s+|\s+$/g, '') : '';
  if (clean === '') { return null; }
  ensureUser(uid);
  var now = Date.now();
  var thread = {
    id:            genThreadId(),
    label:         clean,
    oneLine:       '',
    status:        'named',
    memberNoteIds: [],
    arcId:         null,
    subTheoryId:   null,
    createdAt:     now,
    updatedAt:     now
  };
  state.users[uid].readerModel.threads.push(thread);
  state.users[uid].readerModel.updatedAt = now;
  saveState();
  return thread;
}

// Manual thread label edit. Writes the trimmed label when non-empty; an empty
// edit is rejected (the caller reverts to the original). Returns true on commit.
function editReaderThread(uid, threadId, label) {
  if (!uid || !threadId) { return false; }
  var clean = (typeof label === 'string') ? label.replace(/^\s+|\s+$/g, '') : '';
  if (clean === '') { return false; }
  ensureUser(uid);
  var threads = state.users[uid].readerModel.threads;
  var i;
  for (i = 0; i < threads.length; i = i + 1) {
    if (threads[i] && threads[i].id === threadId) {
      threads[i].label = clean;
      threads[i].updatedAt = Date.now();
      state.users[uid].readerModel.updatedAt = threads[i].updatedAt;
      saveState();
      return true;
    }
  }
  return false;
}

// Manual thread delete. Removes the thread with the given id. Returns true if a
// thread was removed. Persists via saveState. Available even when consent is OFF
// (the reader always controls their own data).
function deleteReaderThread(uid, threadId) {
  if (!uid || !threadId) { return false; }
  ensureUser(uid);
  var threads = state.users[uid].readerModel.threads;
  var kept = [];
  var removed = false;
  var i;
  for (i = 0; i < threads.length; i = i + 1) {
    if (threads[i] && threads[i].id === threadId) { removed = true; }
    else { kept.push(threads[i]); }
  }
  if (removed) {
    state.users[uid].readerModel.threads = kept;
    state.users[uid].readerModel.updatedAt = Date.now();
    saveState();
  }
  return removed;
}

// Reading-profile prose setter (the "arc you're building" block). String-
// coerced + trimmed; persists via saveState. An empty string clears it. This
// is the ONLY writer of profile.summary in Stage I (the auto-refresh is II).
function setReaderProfile(uid, summary) {
  if (!uid) { return; }
  ensureUser(uid);
  var clean = (typeof summary === 'string') ? summary.replace(/^\s+|\s+$/g, '') : '';
  var now = Date.now();
  state.users[uid].readerModel.profile.summary = clean;
  state.users[uid].readerModel.profile.updatedAt = now;
  // yumi-intelligence Stage II: a hand-edit flips provenance to 'edited' so the
  // auto-refresh STOPS touching the prose -- a refresh must never silently
  // clobber a hand-edit. Reset to 'auto' only on clearReaderModel (forget).
  state.users[uid].readerModel.profile.source = 'edited';
  state.users[uid].readerModel.updatedAt = now;
  saveState();
}

// "Forget everything": wipe the reader-model DATA (threads + profile prose)
// locally. Leaves the consent flag to the caller -- the covenant is a data
// clear, not a forced opt-out. The /userReaderModel Firestore wipe is driven by
// the UI caller (it re-saves the now-empty model). Persists via saveState.
function clearReaderModel(uid) {
  if (!uid) { return; }
  ensureUser(uid);
  var now = Date.now();
  state.users[uid].readerModel.threads = [];
  // Stage II: forget resets provenance to 'auto' so the auto-refresh may
  // repopulate the cleared prose (a wipe clears the hand-edit lock too).
  state.users[uid].readerModel.profile = { summary: '', updatedAt: now, source: 'auto' };
  state.users[uid].readerModel.updatedAt = now;
  saveState();
}

// REPLACE-on-found setter for the Firestore loader (integrations.js). Sanitizes
// a remote readerModel doc into the locked shape -- defensive against a doc
// written by a newer/older client -- then assigns + persists. KEEP-on-absent is
// the caller's job (it simply does not call this on 'absent'/'error').
function replaceReaderModel(uid, remote) {
  if (!uid) { return; }
  ensureUser(uid);
  var src = (remote && typeof remote === 'object') ? remote : {};
  var rawThreads = (src.threads instanceof Array) ? src.threads : [];
  var threads = [];
  var i;
  for (i = 0; i < rawThreads.length; i = i + 1) {
    var t = rawThreads[i];
    if (!t || typeof t !== 'object') { continue; }
    threads.push({
      id:            (typeof t.id === 'string' && t.id) ? t.id : genThreadId(),
      label:         (typeof t.label === 'string') ? t.label : '',
      oneLine:       (typeof t.oneLine === 'string') ? t.oneLine : '',
      status:        (t.status === 'noticed' || t.status === 'named' || t.status === 'dismissed') ? t.status : 'named',
      memberNoteIds: (t.memberNoteIds instanceof Array) ? t.memberNoteIds : [],
      arcId:         (typeof t.arcId === 'string') ? t.arcId : null,
      subTheoryId:   (typeof t.subTheoryId === 'string') ? t.subTheoryId : null,
      createdAt:     (typeof t.createdAt === 'number') ? t.createdAt : 0,
      updatedAt:     (typeof t.updatedAt === 'number') ? t.updatedAt : 0
    });
  }
  var prof = (src.profile && typeof src.profile === 'object') ? src.profile : {};
  state.users[uid].readerModel = {
    threads: threads,
    profile: {
      summary:   (typeof prof.summary === 'string') ? prof.summary : '',
      updatedAt: (typeof prof.updatedAt === 'number') ? prof.updatedAt : 0,
      // Stage II: provenance survives the round-trip so a hand-edit lock made on
      // one device is honored on another (default 'auto' on absence).
      source:    (prof.source === 'edited') ? 'edited' : 'auto'
    },
    updatedAt: (typeof src.updatedAt === 'number') ? src.updatedAt : 0
  };
  saveState();
}

// yumi-intelligence Stage II HARDENING: the SINGLE content-aware provenance
// resolver. An explicit source field wins; else a NON-EMPTY summary resolves to
// 'edited' (a profile hand-authored in Stage I predates the source field --
// protect it; never let the auto-refresh silently clobber it); else (empty
// summary) 'auto' (nothing to clobber). The refresh write-guard routes through
// this -- do NOT scatter the content-aware comparison across call sites.
function readerProfileSource(profile) {
  var s = (profile && profile.summary) ? profile.summary : '';
  s = s.replace(/^\s+|\s+$/g, '');
  return (profile && profile.source) ? profile.source : (s ? 'edited' : 'auto');
}

// yumi-intelligence Stage II: the auto-refresh's profile writer. WRITE-GUARDED:
// writes the summary + stamps 'auto' ONLY when the effective provenance (via
// readerProfileSource) is 'auto'. A hand-authored profile -- explicit 'edited',
// OR a non-empty Stage I summary with no source field -- is left UNTOUCHED, so a
// refresh never silently clobbers a hand-typed read. Persists via saveState.
function setReaderProfileAuto(uid, summary) {
  if (!uid) { return; }
  ensureUser(uid);
  if (readerProfileSource(state.users[uid].readerModel.profile) !== 'auto') { return; }
  var clean = (typeof summary === 'string') ? summary.replace(/^\s+|\s+$/g, '') : '';
  var now = Date.now();
  state.users[uid].readerModel.profile.summary = clean;
  state.users[uid].readerModel.profile.updatedAt = now;
  state.users[uid].readerModel.profile.source = 'auto';
  state.users[uid].readerModel.updatedAt = now;
  saveState();
}

// yumi-intelligence Stage II: minimum shared member ids for two clusters to be
// "the same thread" (matches NOTICE_OVERLAP_MIN). Used by the auto-write below.
var READER_THREAD_OVERLAP_MIN = 2;

// yumi-intelligence Stage II: the NOTICE->NAME auto-write. On a CONFIRMED name,
// write the thread into the reader-model: status 'named', the member note ids
// from the NOTICE cluster, the derived arcId, and the produced subTheoryId.
// IDEMPOTENT -- if a thread already shares >= READER_THREAD_OVERLAP_MIN member
// ids (a re-confirmation of the same cluster), UPDATE it in place rather than
// duplicate. The CALLER gates on consent (yumiReaderModel && yumiReadsAlong);
// the Firestore mirror is the UI caller's job. Returns the written thread, or
// null on bad input. Persists via saveState.
function addReaderThreadFromName(uid, fields) {
  if (!uid || !fields) { return null; }
  var label = (typeof fields.label === 'string') ? fields.label.replace(/^\s+|\s+$/g, '') : '';
  if (label === '') { return null; }
  var members = (fields.memberNoteIds instanceof Array) ? fields.memberNoteIds : [];
  var oneLine = (typeof fields.oneLine === 'string') ? fields.oneLine.replace(/^\s+|\s+$/g, '') : '';
  var arcId = (typeof fields.arcId === 'string') ? fields.arcId : null;
  var subTheoryId = (typeof fields.subTheoryId === 'string') ? fields.subTheoryId : null;
  ensureUser(uid);
  var now = Date.now();
  var threads = state.users[uid].readerModel.threads;
  var i, a, b;
  for (i = 0; i < threads.length; i = i + 1) {
    var ex = threads[i];
    if (!ex || !(ex.memberNoteIds instanceof Array)) { continue; }
    var shared = 0;
    for (a = 0; a < members.length; a = a + 1) {
      for (b = 0; b < ex.memberNoteIds.length; b = b + 1) {
        if (members[a] === ex.memberNoteIds[b]) { shared = shared + 1; break; }
      }
    }
    if (shared >= READER_THREAD_OVERLAP_MIN) {
      // idempotent update-in-place: same cluster re-confirmed, never duplicate.
      ex.label = label;
      ex.oneLine = oneLine;
      ex.status = 'named';
      ex.memberNoteIds = members.slice(0);
      ex.arcId = arcId;
      ex.subTheoryId = subTheoryId;
      ex.updatedAt = now;
      state.users[uid].readerModel.updatedAt = now;
      saveState();
      return ex;
    }
  }
  var thread = {
    id:            genThreadId(),
    label:         label,
    oneLine:       oneLine,
    status:        'named',
    memberNoteIds: members.slice(0),
    arcId:         arcId,
    subTheoryId:   subTheoryId,
    createdAt:     now,
    updatedAt:     now
  };
  threads.push(thread);
  state.users[uid].readerModel.updatedAt = now;
  saveState();
  return thread;
}

// yumi-intelligence Stage II: the profile-refresh budget -- its OWN small daily
// counter + a cooldown, SEPARATE from the gate budget (praxis_yumi_gate_budget)
// so a refresh can never starve the gate. ls-backed + date-stamped (resets
// daily). PROFILE_REFRESH_* are EDITABLE tunables.
var PROFILE_REFRESH_DAILY_CAP   = 4;
var PROFILE_REFRESH_COOLDOWN_MS = 1800000;  // >= 30 min between refreshes
function _yumiProfileBudgetSpend() {
  var rec = ls('praxis_yumi_profile_budget', { day: '', count: 0 });
  var now = new Date();
  var day = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  if (!rec || rec.day !== day) { rec = { day: day, count: 0 }; }
  if (rec.count >= PROFILE_REFRESH_DAILY_CAP) { sv('praxis_yumi_profile_budget', rec); return false; }
  rec.count = rec.count + 1;
  sv('praxis_yumi_profile_budget', rec);
  return true;
}
function _yumiProfileCooldownOk() {
  var last = ls('praxis_yumi_profile_cooldown', 0);
  return (Date.now() - (typeof last === 'number' ? last : 0)) >= PROFILE_REFRESH_COOLDOWN_MS;
}
function _markProfileRefresh() { sv('praxis_yumi_profile_cooldown', Date.now()); }

// Stage 14.3 Stage 2: serialize the ACTIVE user's workspace into a single
// JSON-serializable object. No download trigger here -- Stage 4 (views)
// owns the Blob/anchor. uid is resolved at CALL time via getCurrentUser
// (defined in integrations.js, which loads AFTER state.js; referencing it
// only inside this function body is safe because the call happens at
// runtime, never at parse/define time). Null user -> null return.
//
// Scoping asymmetry is intentional (locked Stage 2 decision):
//   - books: walk state.userBooks[uid].bookIds and map each id to its
//     state.books record, SKIPPING any id with no matching record. The
//     ownership list makes export immune to a stale cross-uid book ever
//     present in the flat state.books map.
//   - arcs / subTheories / notebookEntries: serialized DIRECTLY from
//     their flat maps. They have no per-uid ownership list and ride the
//     clearUserState single-user wipe guarantee; a userId filter would
//     wrongly drop the shared __praxis_seed__ "A Pedagogy of Desire" arc.
function exportWorkspace() {
  var u = getCurrentUser();
  if (!u || !u.uid) {
    return null;
  }
  var uid = u.uid;
  var books = {};
  var bookIds = (state.userBooks &&
                 state.userBooks[uid] &&
                 state.userBooks[uid].bookIds)
    ? state.userBooks[uid].bookIds
    : [];
  var i;
  for (i = 0; i < bookIds.length; i++) {
    var bid = bookIds[i];
    if (state.books && state.books[bid]) {
      books[bid] = state.books[bid];
    }
  }
  return {
    schemaVersion:   state.SCHEMA_VERSION,
    exportedAt:      Date.now(),
    profile:         getProfile(uid),
    books:           books,
    arcs:            state.arcs ? state.arcs : {},
    subTheories:     state.subTheories ? state.subTheories : {},
    notebookEntries: state.notebookEntries ? state.notebookEntries : {}
  };
}

function clearUserState() {
  state.currentBookId = null;
  state.currentArcId = null;
  state.currentSubTheoryId = null;
  state.users = {};
  state.books = {};
  state.userBooks = {};
  state.notebooks = {};
  state.notebookEntries = {};
  state.bookArtifacts = {};
  state.arcs = {};
  state.subTheories = {};
  state.SCHEMA_VERSION = '1.9.3';
}

// Stage 14.3 Stage 3: account-deletion local wipe. Captures the per-uid
// bucket key WHILE praxis_user still holds the uid (stateKey() derives
// from praxis_user), empties that bucket, then wipes the in-memory maps
// and pointers via clearUserState. Deliberately does NOT touch
// praxis_user -- the caller (deleteAccount in integrations.js) owns the
// auth-record removal / sign-out that finally clears praxis_user, so the
// two responsibilities stay separated. Promise-free -> cscript-parseable.
function wipeActiveUserLocal() {
  var key = stateKey();
  sv(key, null);
  clearUserState();
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
  markArcsDirty();
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
  markArcsDirty();
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
  markArcsDirty();
  markNotebookDirty();
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
  markArcsDirty();
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
  markArcsDirty();
  markNotebookDirty();
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
  var creator = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  var subTheory = {
    id:                 id,
    arcId:              arcId,
    userId:             (creator && creator.uid) ? creator.uid : null,
    header:             (typeof src.header === 'string') ? src.header : '',
    bodyPublic:         (typeof src.bodyPublic === 'string') ? src.bodyPublic : '',
    bodyIntellectual:   (typeof src.bodyIntellectual === 'string') ? src.bodyIntellectual : '',
    evidence:           [],
    attachedMarginalia: [],
    linkedSubTheories:  [],
    citationPins:       {},
    status:             'draft',
    format:             '',
    publishedAt:        null,
    x:                  null,
    y:                  null,
    createdAt:          now,
    updatedAt:          now
  };
  state.subTheories[id] = subTheory;
  markSubTheoriesDirty();
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
  markSubTheoriesDirty();
  saveState();
  return subTheory;
}

// 9.6c.2: position writer for the workspace drag layer. Writes the
// existing 9.6a x/y fields and self-persists, mirroring createSubTheory/
// deleteSubTheory. Deliberately separate from updateSubTheory, which owns
// only the three text fields and ignores x/y. A finite number is stored
// as-is; anything else (including null, NaN, Infinity) coerces to null,
// which restores the radial default in _stRadialLayout -- so Reset passes
// null to clear a placement. Bumps updatedAt so the Firestore by-reference
// copy picks the move up. No new schema. Returns the record, or null if
// the sub-theory is absent.
function setSubTheoryPosition(id, x, y) {
  var subTheory = state.subTheories[id];
  if (!subTheory) return null;
  subTheory.x = (typeof x === 'number' && isFinite(x)) ? x : null;
  subTheory.y = (typeof y === 'number' && isFinite(y)) ? y : null;
  subTheory.updatedAt = Date.now();
  markSubTheoriesDirty();
  saveState();
  return subTheory;
}

// Hard-delete WITH cascade. Resonance links exist since 9.5, so a delete must
// drop this id from every partner's linkedSubTheories or a dangling half-edge
// survives (the old "no cascade" note was stale). Reuses unlinkSubTheories for
// the symmetric removal -- it needs BOTH subs to exist, so it runs BEFORE the
// record is removed, over a SNAPSHOT of the partner ids (unlinkSubTheories
// splices the array we'd otherwise be iterating). Also clears a dangling
// currentSubTheoryId pointer. Returns true on success, false if absent.
function deleteSubTheory(id) {
  var subTheory = state.subTheories[id];
  if (!subTheory) return false;
  var partners = Array.isArray(subTheory.linkedSubTheories)
    ? subTheory.linkedSubTheories.slice() : [];
  var i;
  for (i = 0; i < partners.length; i = i + 1) {
    unlinkSubTheories(id, partners[i]);
  }
  delete state.subTheories[id];
  if (state.currentSubTheoryId === id) { state.currentSubTheoryId = null; }
  markSubTheoriesDirty();
  saveState();
  return true;
}

// Stage 7 (manual themes): id generator for the user-theme overlay, shaped
// like genArcId / genSubTheoryId; the 'theme_' prefix avoids cross-collection
// id collisions.
function genThemeId() {
  return 'theme_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// Stage 7 (manual themes): a user-owned overlay of named book collections,
// kept OFF the book record (membership lives here as bookIds) so themes never
// entangle the seed-books-in-state split or force a book-schema migration.
// Private to the user by design (userId-scoped; never read into Yumi's
// context). localStorage-first via saveState; mirrored to /userThemes/{uid}
// on the markThemesDirty chokepoint, like the arc / sub-theory collections.
// MANUAL only -- no Yumi naming or noticing.
function createUserTheme(name) {
  var trimmed = (typeof name === 'string') ? name.trim() : '';
  if (trimmed === '') { return null; }
  var creator = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  var now = Date.now();
  var id = genThemeId();
  var theme = {
    id:        id,
    userId:    (creator && creator.uid) ? creator.uid : null,
    name:      trimmed,
    bookIds:   [],
    createdAt: now,
    updatedAt: now
  };
  if (!state.userThemes) { state.userThemes = {}; }
  state.userThemes[id] = theme;
  markThemesDirty();
  saveState();
  return theme;
}

// Add a book to a theme (idempotent; a no-op call writes nothing). Membership
// is the book's id, never a field on the book.
function assignBookToTheme(themeId, bookId) {
  if (typeof themeId !== 'string' || typeof bookId !== 'string') { return false; }
  var theme = state.userThemes && state.userThemes[themeId];
  if (!theme) { return false; }
  if (!Array.isArray(theme.bookIds)) { theme.bookIds = []; }
  if (theme.bookIds.indexOf(bookId) !== -1) { return false; }
  theme.bookIds.push(bookId);
  theme.updatedAt = Date.now();
  markThemesDirty();
  saveState();
  return true;
}

// Remove a book from a theme (idempotent). The theme persists when emptied.
function unassignBookFromTheme(themeId, bookId) {
  if (typeof themeId !== 'string' || typeof bookId !== 'string') { return false; }
  var theme = state.userThemes && state.userThemes[themeId];
  if (!theme || !Array.isArray(theme.bookIds)) { return false; }
  var ix = theme.bookIds.indexOf(bookId);
  if (ix === -1) { return false; }
  theme.bookIds.splice(ix, 1);
  theme.updatedAt = Date.now();
  markThemesDirty();
  saveState();
  return true;
}

// Rename a theme/lens (S4 lens panel). Trims; rejects empty; no-op (no write)
// when unchanged. Bumps updatedAt and persists on a real change.
function renameUserTheme(themeId, name) {
  if (typeof themeId !== 'string') { return false; }
  var theme = state.userThemes && state.userThemes[themeId];
  if (!theme) { return false; }
  var trimmed = (typeof name === 'string') ? name.trim() : '';
  if (trimmed === '') { return false; }
  if (theme.name === trimmed) { return false; }
  theme.name = trimmed;
  theme.updatedAt = Date.now();
  markThemesDirty();
  saveState();
  return true;
}

// Delete a theme/lens entirely (S4 lens panel "Not this"). Membership lives
// on the theme record, so removing it removes the lens and its bookIds; no
// book record is touched.
function deleteUserTheme(themeId) {
  if (typeof themeId !== 'string') { return false; }
  if (!state.userThemes || !state.userThemes[themeId]) { return false; }
  delete state.userThemes[themeId];
  markThemesDirty();
  saveState();
  return true;
}

// 9.5 Stage 1: resonance links between two sub-theories. linkSubTheories
// records a symmetric edge — each id is added to the other's
// linkedSubTheories array — and bumps updatedAt on both; unlinkSubTheories
// reverses it. Both guard that BOTH sub-theories exist (return false
// otherwise) so a dangling half-edge can never be written, and a self-link
// (aId === bId) is rejected. Membership is deduped on a linear indexOf
// scan, matching addBookToArc's idempotency style — link arrays are short
// by design. A call that changes nothing (already linked / already
// unlinked) returns false WITHOUT a write, so the no-op path stays cheap;
// the mutating path bumps updatedAt on both and persists. localStorage-
// only, mirroring the rest of the 9.x sub-theory CRUD — no Firestore path,
// no booksDirty.
function linkSubTheories(aId, bId) {
  if (typeof aId !== 'string' || typeof bId !== 'string') return false;
  if (aId === bId) return false;
  var a = state.subTheories[aId];
  var b = state.subTheories[bId];
  if (!a || !b) return false;
  if (!Array.isArray(a.linkedSubTheories)) a.linkedSubTheories = [];
  if (!Array.isArray(b.linkedSubTheories)) b.linkedSubTheories = [];
  var changed = false;
  if (a.linkedSubTheories.indexOf(bId) === -1) {
    a.linkedSubTheories.push(bId);
    changed = true;
  }
  if (b.linkedSubTheories.indexOf(aId) === -1) {
    b.linkedSubTheories.push(aId);
    changed = true;
  }
  if (!changed) return false;
  var now = Date.now();
  a.updatedAt = now;
  b.updatedAt = now;
  markSubTheoriesDirty();
  saveState();
  return true;
}

function unlinkSubTheories(aId, bId) {
  if (typeof aId !== 'string' || typeof bId !== 'string') return false;
  var a = state.subTheories[aId];
  var b = state.subTheories[bId];
  if (!a || !b) return false;
  var changed = false;
  if (Array.isArray(a.linkedSubTheories)) {
    var ia = a.linkedSubTheories.indexOf(bId);
    if (ia !== -1) {
      a.linkedSubTheories.splice(ia, 1);
      changed = true;
    }
  }
  if (Array.isArray(b.linkedSubTheories)) {
    var ib = b.linkedSubTheories.indexOf(aId);
    if (ib !== -1) {
      b.linkedSubTheories.splice(ib, 1);
      changed = true;
    }
  }
  if (!changed) return false;
  var now = Date.now();
  a.updatedAt = now;
  b.updatedAt = now;
  markSubTheoriesDirty();
  saveState();
  return true;
}

// 9.2 evidence layer. Appends one well-formed evidence element to a
// sub-theory's evidence[] array. kind is validated to the three legal
// values ('book' | 'entry' | 'external'); anything else is rejected
// with a null return. refId is the bookId (book) or entryId (entry),
// and null for external. external is the {title, author} pair for an
// external source, and null otherwise. quote and annotation are
// optional free text, normalized to strings. Bumps updatedAt and
// persists (localStorage-only, mirroring the sub-theory CRUD above --
// no Firestore path, no booksDirty). Returns the new element, or null
// on a bad/absent record or invalid kind. proseAnchor / in-prose
// citation is deferred to Stage 10; evidence stays un-cited-in-prose.
function addEvidence(subTheoryId, fields) {
  var subTheory = state.subTheories[subTheoryId];
  if (!subTheory) return null;
  var src = fields || {};
  if (src.kind !== 'book' && src.kind !== 'entry' && src.kind !== 'external') {
    return null;
  }
  var refId = null;
  if (src.kind === 'book' || src.kind === 'entry') {
    refId = (typeof src.refId === 'string') ? src.refId : null;
  } else if (src.kind === 'external') {
    // 10.3: external evidence gets a stable id of its own so 10.2 can link
    // an italicized external title back to this element. The refId is
    // generated here, never supplied by the caller.
    refId = genEvidenceId();
  }
  var external = null;
  if (src.kind === 'external') {
    var extSrc = src.external || {};
    external = {
      title:  (typeof extSrc.title === 'string') ? extSrc.title : '',
      author: (typeof extSrc.author === 'string') ? extSrc.author : ''
    };
  }
  if (!Array.isArray(subTheory.evidence)) {
    subTheory.evidence = [];
  }
  var element = {
    id:         genEvidenceId(),
    kind:       src.kind,
    refId:      refId,
    external:   external,
    quote:      (typeof src.quote === 'string') ? src.quote : '',
    annotation: (typeof src.annotation === 'string') ? src.annotation : '',
    addedAt:    Date.now()
  };
  subTheory.evidence.push(element);
  subTheory.updatedAt = Date.now();
  markSubTheoriesDirty();
  saveState();
  return element;
}

// 10.1 read helper. True if the sub-theory already carries an evidence
// element of this kind + refId. Used to power the picker's checkmark
// and the dedupe guard in addEvidenceToSubTheory. Tolerant of a
// missing/absent record or a non-array evidence field (returns false).
// kind/refId are compared exactly; refId for 'book'/'entry' is the
// bookId/entryId string. external evidence (refId null) is not a
// dedupe target here -- 10.3 owns external attachment.
function isEvidenceAttached(subTheoryId, kind, refId) {
  var subTheory = state.subTheories[subTheoryId];
  if (!subTheory || !Array.isArray(subTheory.evidence)) return false;
  if (typeof refId !== 'string' || refId.length === 0) return false;
  var i;
  for (i = 0; i < subTheory.evidence.length; i = i + 1) {
    var el = subTheory.evidence[i];
    if (el && el.kind === kind && el.refId === refId) {
      return true;
    }
  }
  return false;
}

// 10.1 attach path. Thin dedupe wrapper over addEvidence -- the single
// canonical append. Validates kind to the two attachable values
// ('book' | 'entry'; 'external' is 10.3's modal, not this picker) and a
// non-empty refId. On a kind+refId already present, returns
// {status:'already-attached'} WITHOUT appending or persisting (so the
// picker can show a checkmark with no second write). Otherwise delegates
// to addEvidence -- which owns id-gen, push, markSubTheoriesDirty, and
// saveState -- and returns {status:'added', element}. A delegate that
// returns null (bad/absent record) surfaces as {status:'error'}.
function addEvidenceToSubTheory(subTheoryId, item) {
  var src = item || {};
  if (src.kind !== 'book' && src.kind !== 'entry') {
    return { status: 'error' };
  }
  if (typeof src.refId !== 'string' || src.refId.length === 0) {
    return { status: 'error' };
  }
  if (isEvidenceAttached(subTheoryId, src.kind, src.refId)) {
    return { status: 'already-attached' };
  }
  var element = addEvidence(subTheoryId, {
    kind:  src.kind,
    refId: src.refId,
    quote: (typeof src.quote === 'string') ? src.quote : ''
  });
  if (!element) {
    return { status: 'error' };
  }
  return { status: 'added', element: element };
}

function stateKey() {
  var u = ls('praxis_user', null);
  if (u && u.uid) {
    return 'praxis_state_' + u.uid;
  }
  return 'praxis_state_anon';
}

function loadState() {
  var stored = ls(stateKey(), null);
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
    //
    // 14.2.2: per-uid keying. stateKey() now buckets the blob by uid.
    // On a signed-in user's FIRST cold-open under the new scheme, adopt
    // the legacy shared praxis_state blob into this uid's bucket, then
    // consume (null) it so a second user on the same browser can't adopt
    // the first user's data. The for-in copy intentionally inherits the
    // legacy SCHEMA_VERSION stamp (no anchor reset here) so the seed
    // ladder does NOT re-run and duplicate seeded arcs.
    var legacy = ls('praxis_state', null);
    if (legacy !== null && stateKey() !== 'praxis_state_anon') {
      var migratedLegacy = migrate(legacy);
      for (var lk in migratedLegacy) {
        if (Object.prototype.hasOwnProperty.call(migratedLegacy, lk)) {
          state[lk] = migratedLegacy[lk];
        }
      }
      sv(stateKey(), state);
      sv('praxis_state', null);
      return state;
    }
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
  var ok = sv(stateKey(), state);
  // 2.0 hardening (batch 1): localStorage is the durability guarantee, but
  // sv() returns false on a failed write (quota exceeded, or setItem throwing
  // in private mode) and every caller invokes saveState() without checking the
  // result -- so a failed local save was fully silent. Surface it through the
  // app's existing toast idiom, guarded by typeof (mirroring the getCurrentUser
  // cross-file pattern below; a no-op until views.js has defined showToast).
  // The success path is unchanged.
  if (!ok && typeof showToast === 'function') {
    showToast('Could not save your change. Your browser storage may be full or unavailable.');
  }
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
          // P0: this snapshot is now durable on the server -- clear exactly
          // its ids from the pending-sync set (ids added AFTER the snapshot
          // stay pending so a later add is still protected).
          if (typeof clearPendingBookSync === 'function') {
            clearPendingBookSync(user.uid, payload.bookIds);
          }
        } else {
          console.warn(
            'saveBooksToFirestore: failed',
            result ? result.error : null
          );
          // P0 (Stage 3): the push failed -- re-dirty so the NEXT saveState
          // (a later mutation, or the page-hide flush) retries. pendingBookSync
          // is intentionally NOT cleared (clear only on success), so the books
          // stay protected from the REPLACE merge until they confirm.
          booksDirty = true;
        }
      });
    }
  }
  if (arcsDirty) {
    arcsDirty = false;
    var arcUser = (typeof getCurrentUser === 'function')
      ? getCurrentUser()
      : null;
    if (arcUser && arcUser.uid &&
        typeof saveArcsToFirestore === 'function' &&
        typeof buildUserArcsDoc === 'function') {
      var arcPayload = buildUserArcsDoc(arcUser.uid);
      saveArcsToFirestore(arcUser.uid, arcPayload, function (result) {
        if (result && result.status === 'ok') {
          console.log('saveArcsToFirestore: ok');
        } else {
          console.warn(
            'saveArcsToFirestore: failed',
            result ? result.error : null
          );
          // 2.0 hardening (batch 1): mirror the books failure handler -- re-dirty
          // so the next saveState retries instead of silently dropping the write.
          arcsDirty = true;
        }
      });
    }
  }
  if (notebookDirty) {
    notebookDirty = false;
    var nbUser = (typeof getCurrentUser === 'function')
      ? getCurrentUser()
      : null;
    if (nbUser && nbUser.uid &&
        typeof saveNotebookToFirestore === 'function' &&
        typeof buildUserNotebookDoc === 'function') {
      var nbPayload = buildUserNotebookDoc(nbUser.uid);
      saveNotebookToFirestore(nbUser.uid, nbPayload, function (result) {
        if (result && result.status === 'ok') {
          console.log('saveNotebookToFirestore: ok');
        } else {
          console.warn(
            'saveNotebookToFirestore: failed',
            result ? result.error : null
          );
          // 2.0 hardening (batch 1): mirror the books failure handler -- re-dirty
          // so the next saveState retries instead of silently dropping the write.
          notebookDirty = true;
        }
      });
    }
  }
  if (subTheoriesDirty) {
    subTheoriesDirty = false;
    var stUser = (typeof getCurrentUser === 'function')
      ? getCurrentUser()
      : null;
    if (stUser && stUser.uid &&
        typeof saveSubTheoriesToFirestore === 'function' &&
        typeof buildUserSubTheoriesDoc === 'function') {
      var stPayload = buildUserSubTheoriesDoc(stUser.uid);
      saveSubTheoriesToFirestore(stUser.uid, stPayload, function (result) {
        if (result && result.status === 'ok') {
          console.log('saveSubTheoriesToFirestore: ok');
        } else {
          console.warn(
            'saveSubTheoriesToFirestore: failed',
            result ? result.error : null
          );
          // 2.0 hardening (batch 1): mirror the books failure handler -- re-dirty
          // so the next saveState retries instead of silently dropping the write.
          subTheoriesDirty = true;
        }
      });
    }
  }
  if (themesDirty) {
    themesDirty = false;
    var thUser = (typeof getCurrentUser === 'function')
      ? getCurrentUser()
      : null;
    if (thUser && thUser.uid &&
        typeof saveThemesToFirestore === 'function' &&
        typeof buildUserThemesDoc === 'function') {
      var thPayload = buildUserThemesDoc(thUser.uid);
      saveThemesToFirestore(thUser.uid, thPayload, function (result) {
        if (result && result.status === 'ok') {
          console.log('saveThemesToFirestore: ok');
        } else {
          console.warn(
            'saveThemesToFirestore: failed',
            result ? result.error : null
          );
          // 2.0 hardening (batch 1): mirror the books failure handler -- re-dirty
          // so the next saveState retries instead of silently dropping the write.
          themesDirty = true;
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
  // 14.1c-fix: sub-theory ownership moves from transitive (via parent arc)
  // to a direct userId field. Backfill existing records from their parent
  // arc's owner so the new st.userId filter does not regress already-synced
  // sub-theories. Orphans left unset (were not syncing). Default literal
  // (1.9.3) is unchanged -- new users still walk the whole chain.
  if (stored.SCHEMA_VERSION === '1.12.0') {
    if (!stored.subTheories) stored.subTheories = {};
    backfillSubTheoryUserId(stored.subTheories, stored.arcs);
    stored.SCHEMA_VERSION = '1.13.0';
  }
  // 9.6a: sub-theories gain persisted x/y (number|null) for the
  // workspace layout. null = unset; renderer falls back to the radial
  // slot until a drag (9.6c) stamps a real position. Delegated to the
  // ensureSubTheoryFieldsAll chokepoint, mirroring the 1.11.0 -> 1.12.0
  // step; idempotent, so re-running is a no-op. Default literal (1.9.3)
  // unchanged -- new users still walk the whole chain.
  if (stored.SCHEMA_VERSION === '1.13.0') {
    if (!stored.subTheories) stored.subTheories = {};
    ensureSubTheoryFieldsAll(stored.subTheories);
    stored.SCHEMA_VERSION = '1.14.0';
  }
  if (stored.SCHEMA_VERSION === '1.14.0') {
    // 6.2c-pre: journal becomes private-by-default (honesty fix -- Yumi's
    // Beat E promise that the journal stays private). Two retroactive
    // moves, both touching ONLY isPrivate / the journal registerDefault:
    //   (1) flip every existing user's journal registerDefault to true so
    //       NEW journal entries are born private (ensureUser only seeds
    //       defaults when ABSENT, so an existing false would otherwise
    //       stick);
    //   (2) set isPrivate=true on every existing journal-register entry.
    // Marginalia is deliberately untouched -- it is the notes-attached-to-
    // a-book Yumi is meant to see. Idempotent via the version stamp; the
    // merge-boundary normalizer in integrations.js closes the Firestore-
    // bypass gap for remote entries that never walk migrate().
    if (stored.users) {
      var pjuid;
      for (pjuid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, pjuid) &&
            stored.users[pjuid] && stored.users[pjuid].registerDefaults) {
          stored.users[pjuid].registerDefaults.journal = true;
        }
      }
    }
    if (stored.notebookEntries) {
      var pjeid;
      for (pjeid in stored.notebookEntries) {
        if (Object.prototype.hasOwnProperty.call(stored.notebookEntries, pjeid)) {
          var pjent = stored.notebookEntries[pjeid];
          if (pjent && pjent.register === 'journal') {
            pjent.isPrivate = true;
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.15.0';
  }
  if (stored.SCHEMA_VERSION === '1.15.0') {
    // 10.3: external evidence items gain a stable refId (a fresh id) so
    // inline citation (10.2) can link an italicized external title to its
    // evidence element. Pre-10.3 externals were created with refId null;
    // backfill assigns each one an id. Idempotent two ways -- the version
    // stamp AND a null-guard, so only null/absent refIds are filled and a
    // re-run touches nothing. Books/entries are untouched: their refId is
    // the bookId/entryId and was never null.
    if (stored.subTheories) {
      var exstk;
      for (exstk in stored.subTheories) {
        if (Object.prototype.hasOwnProperty.call(stored.subTheories, exstk)) {
          var exst = stored.subTheories[exstk];
          if (exst && Array.isArray(exst.evidence)) {
            var exi;
            for (exi = 0; exi < exst.evidence.length; exi = exi + 1) {
              var exel = exst.evidence[exi];
              if (exel && exel.kind === 'external' &&
                  (typeof exel.refId !== 'string' || exel.refId.length === 0)) {
                exel.refId = genEvidenceId();
              }
            }
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.16.0';
  }
  if (stored.SCHEMA_VERSION === '1.16.0') {
    // 10.5.7: every sub-theory gains a citationPins map (lowercased phrase ->
    // evidence id) so author pin choices persist and route the read-only
    // render. Backfill {} where absent; idempotent (only sets when missing).
    // ensureSubTheoryFields also guarantees the field on every write path.
    if (stored.subTheories) {
      var cpstk;
      for (cpstk in stored.subTheories) {
        if (Object.prototype.hasOwnProperty.call(stored.subTheories, cpstk)) {
          var cpst = stored.subTheories[cpstk];
          if (cpst && (!cpst.citationPins || typeof cpst.citationPins !== 'object')) {
            cpst.citationPins = {};
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.17.0';
  }
  if (stored.SCHEMA_VERSION === '1.17.0') {
    // Stage 7 (manual themes): the user-theme overlay collection. Backfill {}
    // where absent; records are flat (id / name / userId / bookIds / stamps),
    // so no per-record field ensure is needed.
    if (!stored.userThemes) { stored.userThemes = {}; }
    stored.SCHEMA_VERSION = '1.18.0';
  }
  if (stored.SCHEMA_VERSION === '1.18.0') {
    // Notebook N-epic: three additive fields. NONE reads or writes isPrivate
    // (F5 -- the migration must not change any existing entry's visibility).
    //   (1) entry.filed (boolean): false = Inbox (untriaged capture), true =
    //       placed (a book bank, or the Journal section). Backfilled TRUE on
    //       every existing entry -- Inbox did not exist pre-epic, so no legacy
    //       entry is an untriaged capture; true keeps book-attached marginalia
    //       in its book bank and leaves Inbox empty for legacy data. (A flat
    //       false-backfill would dump every existing marginalia into Inbox.)
    //   (2) registerDefaults.question (boolean): the new third register's
    //       visibility default -- false (visible to Yumi, like marginalia).
    //   (3) profile.yumiReadsAlong (boolean): the master consent switch,
    //       default true (the pre-epic behavior -- Yumi reads visible writing).
    if (stored.notebookEntries) {
      var nfeid;
      for (nfeid in stored.notebookEntries) {
        if (Object.prototype.hasOwnProperty.call(stored.notebookEntries, nfeid)) {
          var nfent = stored.notebookEntries[nfeid];
          if (nfent && typeof nfent.filed !== 'boolean') {
            // Book-aware: journal is always placed (routes by register); a
            // non-journal note is placed (true) only if it has a book, else it
            // lands in Inbox (false). A flat true would make a bookless
            // non-journal note match NO tab (invisible). isPrivate untouched.
            nfent.filed = (nfent.register === 'journal') ? true
              : !!(nfent.bookIds && nfent.bookIds.length > 0);
          }
        }
      }
    }
    if (stored.users) {
      var nuuid;
      for (nuuid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, nuuid)) {
          var nurec = stored.users[nuuid];
          if (nurec) {
            if (nurec.registerDefaults &&
                typeof nurec.registerDefaults.question !== 'boolean') {
              nurec.registerDefaults.question = false;
            }
            if (nurec.profile &&
                typeof nurec.profile.yumiReadsAlong !== 'boolean') {
              nurec.profile.yumiReadsAlong = true;
            }
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.19.0';
  }
  if (stored.SCHEMA_VERSION === '1.19.0') {
    // Phase 1: additive bibliographic fields (pageCount, publisher, year,
    // description, rating, dateRead) backfilled onto every existing book via
    // ensureBookFieldsAll. ADDITIVE ONLY -- does NOT touch read-status
    // (existing statuses preserved per the build non-goal; status normalizes
    // on read). Idempotent (ensureBookFields only stamps missing fields).
    if (stored.books) {
      ensureBookFieldsAll(stored.books);
    }
    stored.SCHEMA_VERSION = '1.20.0';
  }
  if (stored.SCHEMA_VERSION === '1.20.0') {
    // N2b photo capture: every notebook entry gains images:[] -- an array of
    // {id, idbKey, w, h, caption} REFS only (the photo blobs live in IndexedDB,
    // never in state or the /userNotebook Firestore doc). ADDITIVE ONLY: never
    // touches isPrivate (F5) or any existing field. Idempotent -- only stamps a
    // missing / non-array images.
    if (stored.notebookEntries) {
      var nbeId;
      for (nbeId in stored.notebookEntries) {
        if (Object.prototype.hasOwnProperty.call(stored.notebookEntries, nbeId)) {
          var nbe = stored.notebookEntries[nbeId];
          if (nbe && !(nbe.images instanceof Array)) { nbe.images = []; }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.21.0';
  }
  if (stored.SCHEMA_VERSION === '1.21.0') {
    // yumi-intelligence Stage I: two additive per-user fields, both default-on-
    // absence so legacy data is never broken or silently opted in.
    //   (1) profile.yumiReaderModel (boolean): the reader-model opt-in, default
    //       FALSE -- the reader-model is strictly opt-in, so a pre-build user is
    //       NOT enrolled by the migration.
    //   (2) users[*].readerModel (object): the reader-model store, backfilled to
    //       the empty default shape { threads:[], profile:{summary,updatedAt},
    //       updatedAt }. ADDITIVE ONLY -- never touches isPrivate (F5), the
    //       profile's other fields, yumiMemory, or any existing field.
    if (stored.users) {
      var rmuid;
      for (rmuid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, rmuid)) {
          var rmrec = stored.users[rmuid];
          if (rmrec) {
            if (rmrec.profile &&
                typeof rmrec.profile.yumiReaderModel !== 'boolean') {
              rmrec.profile.yumiReaderModel = false;
            }
            if (!rmrec.readerModel || typeof rmrec.readerModel !== 'object') {
              rmrec.readerModel = { threads: [], profile: { summary: '', updatedAt: 0 }, updatedAt: 0 };
            }
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.22.0';
  }
  if (stored.SCHEMA_VERSION === '1.22.0') {
    // yumi-intelligence Stage III: one additive per-user field, default-on-
    // absence so legacy data is never broken or silently opted in.
    //   profile.yumiWebGrounding (boolean): the live-web grounding opt-in,
    //   default FALSE -- reaching outside the app is a distinct consent, so a
    //   pre-build user is NOT enrolled by the migration. Lives in profile{} so
    //   it mirrors via /userProfiles next to yumiReaderModel. ADDITIVE ONLY --
    //   never touches isPrivate (F5), readerModel, or any existing field.
    if (stored.users) {
      var wguid;
      for (wguid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, wguid)) {
          var wgrec = stored.users[wguid];
          if (wgrec && wgrec.profile &&
              typeof wgrec.profile.yumiWebGrounding !== 'boolean') {
            wgrec.profile.yumiWebGrounding = false;
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.23.0';
  }
  if (stored.SCHEMA_VERSION === '1.23.0') {
    // Alive Yumi: two additive per-user voice prefs, default-on-absence so
    // legacy data is never broken or silently opted in.
    //   profile.voiceOn (boolean): TTS read-aloud opt-in, default FALSE.
    //   profile.talkMode (string): 'push-to-talk' (default) | 'hands-free'.
    // Live in profile{} so they mirror via /userProfiles next to
    // yumiWebGrounding. ADDITIVE ONLY -- never touches any existing field.
    if (stored.users) {
      var vouid;
      for (vouid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, vouid)) {
          var vorec = stored.users[vouid];
          if (vorec && vorec.profile) {
            if (typeof vorec.profile.voiceOn !== 'boolean') {
              vorec.profile.voiceOn = false;
            }
            if (vorec.profile.talkMode !== 'push-to-talk' &&
                vorec.profile.talkMode !== 'hands-free') {
              vorec.profile.talkMode = 'push-to-talk';
            }
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.24.0';
  }
  if (stored.SCHEMA_VERSION === '1.24.0') {
    // Portrait Stage 1: one additive per-user field, default-on-absence so
    // legacy data is never broken or silently populated.
    //   profile.values (array of strings): the reader's DECLARED values (the
    //   account "stones"), default []. Declared, never inferred -- Yumi does not
    //   write here. Lives in profile{} so it mirrors via /userProfiles next to
    //   talkMode. ADDITIVE ONLY -- never touches any existing field.
    if (stored.users) {
      var pvuid;
      for (pvuid in stored.users) {
        if (Object.prototype.hasOwnProperty.call(stored.users, pvuid)) {
          var pvrec = stored.users[pvuid];
          if (pvrec && pvrec.profile &&
              !(pvrec.profile.values instanceof Array)) {
            pvrec.profile.values = [];
          }
        }
      }
    }
    stored.SCHEMA_VERSION = '1.25.0';
  }
  // Stage 2 (shelf categories): state.books gains category + rawCategories.
  // Delegated to the ensureBookFieldsAll chokepoint -- the same single source
  // of truth the Firestore merge and new-book creation use -- so the migration
  // and runtime write paths never drift. Idempotent: a re-run is a no-op.
  if (stored.SCHEMA_VERSION === '1.25.0') {
    if (stored.books) {
      ensureBookFieldsAll(stored.books);
    }
    stored.SCHEMA_VERSION = '1.26.0';
  }
  return stored;
}

console.log('state.js loaded');
