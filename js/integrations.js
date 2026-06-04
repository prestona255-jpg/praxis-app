// =====================================================================
// integrations.js -- Praxis external integrations layer
//
// At 1.1: holds the Claude proxy URL constant only. Praxis routes
// Claude calls through a Netlify Function (HQ uses a Cloudflare
// Worker -- divergence is intentional). ISBN, Firebase, and other
// adapters land in later sub-stages.
// =====================================================================

'use strict';

var CLAUDE_PROXY_URL       = '/.netlify/functions/claude-proxy';
var GOOGLE_BOOKS_PROXY_URL = '/.netlify/functions/google-books-proxy';

var firebaseConfig = {
  apiKey:            "AIzaSyDegS-mT0hrBVuptm-I-ByrogeLmJis6rE",
  authDomain:        "praxis-b25d6.firebaseapp.com",
  projectId:         "praxis-b25d6",
  storageBucket:     "praxis-b25d6.firebasestorage.app",
  messagingSenderId: "1013316338014",
  appId:             "1:1013316338014:web:19e7e7673f94f6fcca8fcf"
};
firebase.initializeApp(firebaseConfig);

// Auth state is persisted to localStorage via sv()/ls() so
// getCurrentUser() works synchronously across reloads. The Firebase
// auth observer below keeps the cache in sync with the source of
// truth: any sign-in (popup, redirect, restored session, multi-tab)
// or sign-out is reflected into 'praxis_user' without the explicit
// signInWithGoogle / signOut helpers having to do it themselves.
firebase.auth().onAuthStateChanged(function (u) {
  if (u) {
    var userObj = {
      uid:         u.uid,
      displayName: u.displayName,
      email:       u.email,
      photoURL:    u.photoURL
    };
    sv('praxis_user', userObj);
    console.log('onAuthStateChanged: signed in', userObj);

    // Firestore Stage 1: fetch this user's book-doc from
    // /userBooks/{uid}. Optimistic-UI contract -- the first render
    // already painted from the localStorage cache by the time this
    // listener fires; this fetch either confirms the cache (no-op)
    // or replaces it (re-render). Stage 1 has no WRITE path yet,
    // so every user's doc is absent today; the absent branch is
    // the expected hit. The found branch must still be correct now
    // because Stage 2 will start writing the doc and Stage 3 will
    // migrate existing localStorage shelves into it.
    loadBooksFromFirestore(u.uid, function (result) {
      if (result.status === 'found') {
        // REPLACE merge -- Firestore is the source of truth. Clear
        // this uid's previously-known bookIds from state.books
        // BEFORE writing the remote set so deleted-on-the-server
        // entries don't resurrect from the cache. ensureUser keeps
        // state.users[uid] and state.userBooks[uid] coherent in
        // case this device has never seen this uid before.
        ensureUser(u.uid);
        var prevIds = state.userBooks[u.uid].bookIds.slice();
        var p;
        for (p = 0; p < prevIds.length; p++) {
          if (state.books[prevIds[p]]) {
            delete state.books[prevIds[p]];
          }
        }
        var remoteIds = (result.data && result.data.bookIds)
          ? result.data.bookIds
          : [];
        var remoteBooks = (result.data && result.data.books)
          ? result.data.books
          : {};
        // 3.10i: rewrite leading-http:// coverUrls on the remote
        // payload BEFORE the replace-merge below. The Firestore doc
        // may still hold pre-3.10i http:// URLs from past Google
        // Books fetches; without this, the replace-merge would undo
        // the local migrate() step within seconds of every signed-in
        // boot. Capture the boolean to drive a one-shot conditional
        // flush-back AFTER the existing saveState() below: the helper
        // returns true exactly once (the first post-deploy boot,
        // while Firestore still holds http:// data); every later boot
        // it returns false and no extra Firestore write fires. Self-
        // terminating, not a write-every-boot.
        var coversNormalized = normalizeCoverUrlsToHttps(remoteBooks);
        // 5.6 sub-step 1: backfill tradition + traditionOverride on
        // remote books before the merge loop assigns them into
        // state.books. Without this call, Firestore-synced books
        // bypass migrate() and arrive without 5.6 schema fields. The
        // chokepoint mirrors the normalizeCoverUrlsToHttps pattern
        // above; ensureBookFieldsAll lives in state.js (globally
        // accessible via the no-strict-mode discipline).
        ensureBookFieldsAll(remoteBooks);
        state.userBooks[u.uid].bookIds = remoteIds.slice();
        var r;
        for (r = 0; r < remoteIds.length; r++) {
          var rbid = remoteIds[r];
          if (remoteBooks[rbid]) {
            state.books[rbid] = remoteBooks[rbid];
          }
        }
        saveState();
        // 3.10i: conditional flush-back. ONLY when the helper above
        // rewrote at least one coverUrl: mark dirty + saveState so the
        // corrected payload flushes to Firestore via the existing
        // saveBooksToFirestore chokepoint in state.js's saveState. If
        // coversNormalized is false, the existing saveState() above
        // stands and no second write fires.
        if (coversNormalized) {
          markBooksDirty();
          saveState();
        }
        // Re-render the current route. Defensive guard for the
        // edge case where Firebase persistence resolves auth
        // synchronously before views.js sets window.views; in
        // normal cold-load timing window.views is set well before
        // this listener fires.
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadBooksFromFirestore: merged remote doc, '
          + remoteIds.length + ' books');
      } else if (result.status === 'absent') {
        // Stage 1 expected path. No remote doc exists for this
        // user yet; keep the localStorage cache intact, no
        // re-render needed (nothing changed).
        console.log('loadBooksFromFirestore: no remote doc for uid, keeping cache');
      } else {
        // Network / permission / other failure. Keep cache, log
        // and continue; the cached shelf stays visible.
        console.warn('loadBooksFromFirestore: fetch failed, keeping cache', result.error);
      }
    });

    // Stage 14.1a: fetch this user's arc-doc from /userArcs/{uid} and
    // REPLACE-merge into state.arcs. Independent of the book fetch above
    // (separate docs). REPLACE: clear THIS uid's locally-known arcs
    // before splatting the remote set, so a delete on another device
    // does not resurrect from cache. Ownership is arc.userId (direct),
    // so clear-predicate and remote-set share the key. Cold open still
    // runs migrate(); this listener fires post-first-render.
    loadArcsFromFirestore(u.uid, function (arcResult) {
      if (arcResult.status === 'found') {
        var aid;
        if (state.arcs) {
          for (aid in state.arcs) {
            if (Object.prototype.hasOwnProperty.call(state.arcs, aid) &&
                state.arcs[aid] && state.arcs[aid].userId === u.uid) {
              delete state.arcs[aid];
            }
          }
        }
        var remoteArcs = (arcResult.data && arcResult.data.arcs)
          ? arcResult.data.arcs
          : {};
        var raid;
        for (raid in remoteArcs) {
          if (Object.prototype.hasOwnProperty.call(remoteArcs, raid)) {
            state.arcs[raid] = remoteArcs[raid];
          }
        }
        saveState();
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadArcsFromFirestore: merged remote arc doc');
      } else if (arcResult.status === 'absent') {
        console.log('loadArcsFromFirestore: no remote arc doc for uid, keeping cache');
      } else {
        console.warn('loadArcsFromFirestore: fetch failed, keeping cache', arcResult.error);
      }
    });

    // Stage 14.1b: fetch this user's notebook-doc from /userNotebook/{uid}
    // and REPLACE-merge into state.notebookEntries. Independent of the
    // book/arc fetches (separate docs). REPLACE: clear THIS uid's locally-
    // known entries before splatting the remote set, so a delete on another
    // device does not resurrect from cache. Ownership is entry.userId
    // (direct), so clear-predicate and remote-set share the key.
    loadNotebookFromFirestore(u.uid, function (nbResult) {
      if (nbResult.status === 'found') {
        var eid;
        if (state.notebookEntries) {
          for (eid in state.notebookEntries) {
            if (Object.prototype.hasOwnProperty.call(state.notebookEntries, eid) &&
                state.notebookEntries[eid] && state.notebookEntries[eid].userId === u.uid) {
              delete state.notebookEntries[eid];
            }
          }
        }
        var remoteEntries = (nbResult.data && nbResult.data.notebookEntries)
          ? nbResult.data.notebookEntries
          : {};
        var reid;
        for (reid in remoteEntries) {
          if (Object.prototype.hasOwnProperty.call(remoteEntries, reid)) {
            state.notebookEntries[reid] = remoteEntries[reid];
          }
        }
        saveState();
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadNotebookFromFirestore: merged remote notebook doc');
      } else if (nbResult.status === 'absent') {
        console.log('loadNotebookFromFirestore: no remote notebook doc for uid, keeping cache');
      } else {
        console.warn('loadNotebookFromFirestore: fetch failed, keeping cache', nbResult.error);
      }
    });
  } else {
    sv('praxis_user', null);
    console.log('onAuthStateChanged: signed out');
  }
});

function signInWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var u = result.user;
    var userObj = {
      uid:         u.uid,
      displayName: u.displayName,
      email:       u.email,
      photoURL:    u.photoURL
    };
    sv('praxis_user', userObj);
    console.log('signInWithGoogle: success', userObj);
  }).catch(function (err) {
    console.warn('signInWithGoogle: error', err);
  });
}

function signOut() {
  firebase.auth().signOut().then(function () {
    sv('praxis_user', null);
    console.log('signOut: success');
  }).catch(function (err) {
    sv('praxis_user', null);
    console.warn('signOut: error', err);
  });
}

function getCurrentUser() {
  return ls('praxis_user', null);
}

// Firestore Stage 1: per-user book-doc read from /userBooks/{uid}.
// Single-arg callback in the fetchBookByIsbn house style; the
// result is a typed object distinguishing three outcomes:
//   { status: 'found',  data: <doc data> }   doc exists
//   { status: 'absent' }                     doc does not exist
//   { status: 'error',  error: <err> }       fetch failed
// The caller branches on result.status. Idempotent fire-once is
// guarded by a local 'done' flag, mirroring fetchBookByIsbn.
// firebase.firestore() is called per-use, matching the per-call
// firebase.auth() pattern elsewhere in this file; the compat SDK
// memoizes the handle internally so per-call has no perf cost.
function loadBooksFromFirestore(uid, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('loadBooksFromFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userBooks')
      .doc(uid)
      .get()
      .then(function (doc) {
        if (doc && doc.exists) {
          finish({ status: 'found', data: doc.data() });
        } else {
          finish({ status: 'absent' });
        }
      })
      .catch(function (err) {
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// Firestore Stage 2: build the per-user book-doc payload from
// current state. Mirrors the denormalized single-doc model the
// Stage 1 read already consumes:
//   { schemaVersion, bookIds: [...], books: { bookId: {...} },
//     updatedAt: <serverTimestamp> }
// The books map is FILTERED to only this uid's bookIds, NOT the
// whole global state.books -- the doc is per-user. ensureUser is
// not called here because the caller (saveState) only fires when
// a book mutation has occurred, which itself ran through code
// that already seeded state.userBooks[uid] via ensureUser.
// updatedAt uses firebase.firestore.FieldValue.serverTimestamp()
// so the server stamps the write time -- robust against client
// clock skew.
function buildUserBookDoc(uid) {
  var bookIds = (state.userBooks &&
                 state.userBooks[uid] &&
                 state.userBooks[uid].bookIds)
    ? state.userBooks[uid].bookIds.slice()
    : [];
  var books = {};
  var i;
  for (i = 0; i < bookIds.length; i++) {
    var bid = bookIds[i];
    if (state.books && state.books[bid]) {
      books[bid] = state.books[bid];
    }
  }
  return {
    schemaVersion: state.SCHEMA_VERSION,
    bookIds:       bookIds,
    books:         books,
    updatedAt:     firebase.firestore.FieldValue.serverTimestamp()
  };
}

// Firestore Stage 2: per-user book-doc write to /userBooks/{uid}.
// .set() is a full-doc overwrite -- matches the denormalized
// single-doc model and the REPLACE read semantics from Stage 1.
// Fire-and-forget by contract: the caller (saveState) does NOT
// block on this, does NOT mutate state in the callback, does NOT
// trigger a re-render. localStorage is the synchronous durability
// guarantee; this is a best-effort remote mirror.
// Single-arg typed callback in the house style:
//   { status: 'ok' }                         success
//   { status: 'error', error: <err> }        failure
// Idempotent fire-once via a local done flag, same as
// loadBooksFromFirestore and fetchBookByIsbn.
function saveBooksToFirestore(uid, payload, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('saveBooksToFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userBooks')
      .doc(uid)
      .set(payload)
      .then(function () {
        finish({ status: 'ok' });
      })
      .catch(function (err) {
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// Stage 14.1a (workspace sync): per-user arc-doc read from
// /userArcs/{uid}. Typed callback in the loadBooksFromFirestore house
// style -- found / absent / error. Idempotent fire-once via a local
// done flag. firebase.firestore() per-use, matching firebase.auth().
function loadArcsFromFirestore(uid, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('loadArcsFromFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userArcs')
      .doc(uid)
      .get()
      .then(function (doc) {
        if (doc && doc.exists) {
          finish({ status: 'found', data: doc.data() });
        } else {
          finish({ status: 'absent' });
        }
      })
      .catch(function (err) {
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// Stage 14.1a: build the per-user arc-doc payload. Denormalized
// single-doc model: { schemaVersion, arcs: { arcId: {...} }, updatedAt }.
// FILTERED to records whose arc.userId === uid -- arcs carry their owner
// directly (state.js createArc), so unlike books there is no separate
// per-uid index to consult. serverTimestamp() stamps server write time.
function buildUserArcsDoc(uid) {
  var arcs = {};
  var aid;
  if (state.arcs) {
    for (aid in state.arcs) {
      if (Object.prototype.hasOwnProperty.call(state.arcs, aid)) {
        var arc = state.arcs[aid];
        if (arc && arc.userId === uid) {
          arcs[aid] = arc;
        }
      }
    }
  }
  return {
    schemaVersion: state.SCHEMA_VERSION,
    arcs:          arcs,
    updatedAt:     firebase.firestore.FieldValue.serverTimestamp()
  };
}

// Stage 14.1a: per-user arc-doc write to /userArcs/{uid}. .set() is a
// full-doc overwrite -- matches the denormalized model and REPLACE read
// semantics. Fire-and-forget: caller (saveState) does not block, does
// not mutate state in the callback, does not re-render. Typed callback,
// idempotent fire-once.
function saveArcsToFirestore(uid, payload, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('saveArcsToFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userArcs')
      .doc(uid)
      .set(payload)
      .then(function () {
        finish({ status: 'ok' });
      })
      .catch(function (err) {
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// Stage 14.1b (workspace sync): per-user notebook-doc read from
// /userNotebook/{uid}. Same typed-callback contract as the arc/book
// loaders -- found / absent / error, idempotent fire-once.
function loadNotebookFromFirestore(uid, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('loadNotebookFromFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userNotebook')
      .doc(uid)
      .get()
      .then(function (doc) {
        if (doc && doc.exists) {
          finish({ status: 'found', data: doc.data() });
        } else {
          finish({ status: 'absent' });
        }
      })
      .catch(function (err) {
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// Stage 14.1b: build the per-user notebook-doc payload. Denormalized
// single-doc model: { schemaVersion, notebookEntries: { entryId: {...} },
// updatedAt }. FILTERED to entries whose entry.userId === uid -- entries
// carry their owner directly (both creators set userId), so like arcs
// there is no separate per-uid index. serverTimestamp() stamps write time.
function buildUserNotebookDoc(uid) {
  var entries = {};
  var eid;
  if (state.notebookEntries) {
    for (eid in state.notebookEntries) {
      if (Object.prototype.hasOwnProperty.call(state.notebookEntries, eid)) {
        var entry = state.notebookEntries[eid];
        if (entry && entry.userId === uid) {
          entries[eid] = entry;
        }
      }
    }
  }
  return {
    schemaVersion:  state.SCHEMA_VERSION,
    notebookEntries: entries,
    updatedAt:      firebase.firestore.FieldValue.serverTimestamp()
  };
}

// Stage 14.1b: per-user notebook-doc write to /userNotebook/{uid}.
// .set() full-doc overwrite, fire-and-forget, typed callback,
// idempotent fire-once -- identical contract to saveArcsToFirestore.
function saveNotebookToFirestore(uid, payload, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('saveNotebookToFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userNotebook')
      .doc(uid)
      .set(payload)
      .then(function () {
        finish({ status: 'ok' });
      })
      .catch(function (err) {
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// ISBN lookup: Open Library is primary, Google Books is fallback.
// Public API is callback-only; internal Promise chains stay inside.
// Normalized shape: { isbn, title, author, coverUrl, publishYear,
// openLibraryWorkId }. Google Books fallback yields openLibraryWorkId
// = null, which is acceptable.
function fetchBookByIsbn(isbn, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  function isComplete(b) {
    if (!b) return false;
    if (!b.isbn) return false;
    if (!b.title) return false;
    if (!b.author) return false;
    if (!b.coverUrl) return false;
    if (!b.publishYear) return false;
    if (!b.openLibraryWorkId) return false;
    return true;
  }
  try {
    fetchOpenLibrary(isbn, function (book) {
      if (isComplete(book)) {
        finish(book);
        return;
      }
      try {
        fetchGoogleBooks(isbn, function (book2) {
          if (book2) {
            finish(book2);
          } else {
            finish(null);
          }
        });
      } catch (e2) {
        finish(null);
      }
    });
  } catch (e) {
    finish(null);
  }
}

function fetchOpenLibrary(isbn, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  function extractYear(s) {
    if (!s) return null;
    var m = s.match(/(\d{4})/);
    if (m) return m[1];
    return null;
  }
  try {
    var url1 = 'https://openlibrary.org/api/books?bibkeys=ISBN:' + isbn + '&format=json&jscmd=data';
    fetch(url1).then(function (res) {
      return res.json();
    }).then(function (data) {
      var key = 'ISBN:' + isbn;
      var entry = data[key];
      if (!entry) {
        finish(null);
        return;
      }
      var title = entry.title || null;
      var author = null;
      if (entry.authors && entry.authors.length > 0) {
        author = entry.authors[0].name || null;
      }
      var coverUrl = null;
      if (entry.cover && entry.cover.large) {
        coverUrl = entry.cover.large;
      }
      var publishYear = extractYear(entry.publish_date);
      var url2 = 'https://openlibrary.org/isbn/' + isbn + '.json';
      fetch(url2).then(function (res2) {
        return res2.json();
      }).then(function (data2) {
        var workId = null;
        if (data2.works && data2.works.length > 0 && data2.works[0].key) {
          workId = data2.works[0].key.replace('/works/', '');
        }
        finish({
          isbn:              isbn,
          title:             title,
          author:            author,
          coverUrl:          coverUrl,
          publishYear:       publishYear,
          openLibraryWorkId: workId
        });
      }).catch(function () {
        finish({
          isbn:              isbn,
          title:             title,
          author:            author,
          coverUrl:          coverUrl,
          publishYear:       publishYear,
          openLibraryWorkId: null
        });
      });
    }).catch(function () {
      finish(null);
    });
  } catch (e) {
    finish(null);
  }
}

function fetchGoogleBooks(isbn, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  function extractYear(s) {
    if (!s) return null;
    var m = s.match(/(\d{4})/);
    if (m) return m[1];
    return null;
  }
  try {
    fetch(GOOGLE_BOOKS_PROXY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ q: 'isbn:' + isbn })
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (!data.totalItems || data.totalItems === 0) {
        finish(null);
        return;
      }
      if (!data.items || data.items.length === 0) {
        finish(null);
        return;
      }
      var v = data.items[0].volumeInfo || {};
      var title = v.title || null;
      var author = null;
      if (v.authors && v.authors.length > 0) {
        author = v.authors[0] || null;
      }
      var coverUrl = null;
      if (v.imageLinks && v.imageLinks.thumbnail) {
        coverUrl = v.imageLinks.thumbnail;
        // 3.10i: normalize http:// -> https:// at the read site so
        // newly-stored covers never trip Mixed Content on the HTTPS
        // app. Same anchored leading-position guard as
        // normalizeCoverUrlsToHttps in state.js -- a URL containing
        // 'http://' deeper in the string is untouched.
        if (coverUrl.indexOf('http://') === 0) {
          coverUrl = 'https://' + coverUrl.slice(7);
        }
      }
      var publishYear = extractYear(v.publishedDate);
      finish({
        isbn:              isbn,
        title:             title,
        author:            author,
        coverUrl:          coverUrl,
        publishYear:       publishYear,
        openLibraryWorkId: null
      });
    }).catch(function () {
      finish(null);
    });
  } catch (e) {
    finish(null);
  }
}

// Title lookup: Google Books only. Open Library has no equivalent
// title-search endpoint with matching fidelity, so there is no
// primary/fallback pair -- Google Books is the single source. Takes
// the first result; no ranking. Normalized shape matches
// fetchBookByIsbn:
//   { isbn, title, author, coverUrl, publishYear, openLibraryWorkId }
// openLibraryWorkId is always null. isbn is picked from
// industryIdentifiers (ISBN_13 preferred, ISBN_10 fallback) and may
// be null when Google returns no identifiers. Fail-soft: any error,
// missing totalItems, empty items, or missing volumeInfo yields
// callback(null), matching the fetchGoogleBooks contract.
function fetchBookByTitle(title, author, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  function extractYear(s) {
    if (!s) return null;
    var m = s.match(/(\d{4})/);
    if (m) return m[1];
    return null;
  }
  try {
    var q = 'intitle:' + title;
    if (typeof author === 'string' && author.length > 0) {
      q = q + '+inauthor:' + author;
    }
    fetch(GOOGLE_BOOKS_PROXY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ q: q })
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (!data.totalItems || data.totalItems === 0) {
        finish(null);
        return;
      }
      if (!data.items || data.items.length === 0) {
        finish(null);
        return;
      }
      var v = data.items[0].volumeInfo;
      if (!v) {
        finish(null);
        return;
      }
      var rTitle = v.title || null;
      var rAuthor = null;
      if (v.authors && v.authors.length > 0) {
        rAuthor = v.authors[0] || null;
      }
      var rIsbn = null;
      if (v.industryIdentifiers && v.industryIdentifiers.length > 0) {
        var ii;
        for (ii = 0; ii < v.industryIdentifiers.length; ii++) {
          if (v.industryIdentifiers[ii].type === 'ISBN_13') {
            rIsbn = v.industryIdentifiers[ii].identifier;
            break;
          }
        }
        if (!rIsbn) {
          for (ii = 0; ii < v.industryIdentifiers.length; ii++) {
            if (v.industryIdentifiers[ii].type === 'ISBN_10') {
              rIsbn = v.industryIdentifiers[ii].identifier;
              break;
            }
          }
        }
      }
      var rCoverUrl = null;
      if (v.imageLinks && v.imageLinks.thumbnail) {
        rCoverUrl = v.imageLinks.thumbnail;
        // 3.10i: mirror of the read-site normalization in
        // fetchGoogleBooks above. Same anchored guard, same
        // transform, no shared helper -- the two-line transform is
        // local to each Google Books read site for readability.
        if (rCoverUrl.indexOf('http://') === 0) {
          rCoverUrl = 'https://' + rCoverUrl.slice(7);
        }
      }
      var rPublishYear = extractYear(v.publishedDate);
      finish({
        isbn:              rIsbn,
        title:             rTitle,
        author:            rAuthor,
        coverUrl:          rCoverUrl,
        publishYear:       rPublishYear,
        openLibraryWorkId: null
      });
    }).catch(function () {
      finish(null);
    });
  } catch (e) {
    finish(null);
  }
}

console.log('integrations.js loaded');
