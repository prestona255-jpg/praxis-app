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
    // 14.2 account switch in a shared browser: read the prior cached
    // user BEFORE overwriting praxis_user. If a different uid was
    // signed in, wipe all in-memory maps so A's data cannot leak into
    // B's session before the Firestore loads fire.
    var prevUser = getCurrentUser();
    if (prevUser && prevUser.uid && prevUser.uid !== u.uid) {
      clearUserState();
    }
    sv('praxis_user', userObj);
    ensureUser(u.uid);
    // 14.2.2: praxis_user is now the new uid, so loadState hydrates
    // THIS user's per-uid localStorage bucket (via stateKey()) before
    // the Firestore book load fires. Firestore is the source of truth
    // and REPLACE-wins over any stale localStorage book cache below.
    loadState();
    console.log('onAuthStateChanged: signed in', userObj);

    // 6.2b.1: clear any stale onboarding transcript left in the body-level
    // panel from a prior session's flow (the route repaint below never
    // touches the panel). No-op while onboarding is mid-flow (guarded
    // inside refreshPanelForAuth); a passing gate re-renders Beat A over
    // the idle state via the load callbacks below.
    if (window.YumiUI && typeof window.YumiUI.refreshPanelForAuth === 'function') {
      window.YumiUI.refreshPanelForAuth();
    }

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
      // 6.2b: second (idempotent) first-run greeting trigger. The shelf-
      // empty gate is only accurate once books have merged; calling here
      // closes the race where the profile callback resolves first and sees
      // a falsely-empty shelf. Skipped on 'error' (book set unknown).
      if (result.status !== 'error' &&
          window.YumiUI && typeof window.YumiUI.maybeStartOnboarding === 'function') {
        window.YumiUI.maybeStartOnboarding(u.uid);
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

      // Stage 14.1c: NESTED here so arcs are reconciled (merged, absent, or
      // kept-on-error) BEFORE this runs -- sub-theory ownership is transitive
      // (subTheories[id].arcId -> arcs[arcId].userId), so both the clear-
      // predicate and buildUserSubTheoriesDoc need arcs present. Fires once
      // per sign-in regardless of the arc branch above.
      loadSubTheoriesFromFirestore(u.uid, function (stResult) {
        if (stResult.status === 'found') {
          var sid;
          if (state.subTheories) {
            for (sid in state.subTheories) {
              if (Object.prototype.hasOwnProperty.call(state.subTheories, sid)) {
                var lst = state.subTheories[sid];
                if (lst && lst.userId === u.uid) {
                  delete state.subTheories[sid];
                }
              }
            }
          }
          var remoteSubs = (stResult.data && stResult.data.subTheories)
            ? stResult.data.subTheories
            : {};
          var rsid;
          for (rsid in remoteSubs) {
            if (Object.prototype.hasOwnProperty.call(remoteSubs, rsid)) {
              state.subTheories[rsid] = remoteSubs[rsid];
            }
          }
          if (typeof backfillSubTheoryUserId === 'function') {
            backfillSubTheoryUserId(state.subTheories, state.arcs);
          }
          saveState();
          if (window.views && window.views.renderRoute) {
            window.views.renderRoute();
          }
          console.log('loadSubTheoriesFromFirestore: merged remote sub-theory doc');
        } else if (stResult.status === 'absent') {
          console.log('loadSubTheoriesFromFirestore: no remote sub-theory doc for uid, keeping cache');
        } else {
          console.warn('loadSubTheoriesFromFirestore: fetch failed, keeping cache', stResult.error);
        }
      });
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
        var journalPrivacyChanged = false;
        for (reid in remoteEntries) {
          if (Object.prototype.hasOwnProperty.call(remoteEntries, reid)) {
            state.notebookEntries[reid] = remoteEntries[reid];
            // 6.2c-pre: merge-boundary normalizer. The Firestore REPLACE-
            // splat bypasses migrate(), so force journal entries private as
            // they land -- an unmigrated remote entry (another device, or a
            // pre-flip backup) must not re-enter VISIBLE on a later sign-in
            // after the one-time migrate has already stamped-and-skipped.
            // Marginalia is NOT normalized (correctly visible-by-default).
            // The isPrivate !== true guard makes this write back to
            // Firestore (markNotebookDirty below) ONLY when something
            // actually changed -- bringing the remote source-of-truth to
            // rest private without churning a write on every all-private load.
            if (state.notebookEntries[reid] &&
                state.notebookEntries[reid].register === 'journal' &&
                state.notebookEntries[reid].isPrivate !== true) {
              state.notebookEntries[reid].isPrivate = true;
              journalPrivacyChanged = true;
            }
          }
        }
        if (journalPrivacyChanged && typeof markNotebookDirty === 'function') {
          markNotebookDirty();
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

    // Stage 14.3 Stage 1: fetch this user's profile doc from
    // /userProfiles/{uid}. REPLACE-on-found into the ensureUser-seeded
    // profile slot; 'absent' (fresh account, no remote doc) KEEPS the
    // local cache -- do NOT clear, a brand-new user simply has empty
    // override fields. setProfile is reused so the write also persists
    // the merged profile into the per-uid localStorage bucket.
    loadProfileFromFirestore(u.uid, function (profResult) {
      if (profResult.status === 'found') {
        ensureUser(u.uid);
        var rd = profResult.data || {};
        setProfile(u.uid, {
          displayNameOverride: rd.displayNameOverride ? rd.displayNameOverride : '',
          penName:             rd.penName ? rd.penName : '',
          onboardingSeen:      rd.onboardingSeen === true
        });
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadProfileFromFirestore: merged remote profile doc');
      } else if (profResult.status === 'absent') {
        console.log('loadProfileFromFirestore: no remote profile doc for uid, keeping cache');
      } else {
        console.warn('loadProfileFromFirestore: fetch failed, keeping cache', profResult.error);
      }
      // 6.2b: first-run greeting trigger. Evaluated only after the remote
      // profile is known (found = merged flag; absent = definitively fresh)
      // -- never on 'error', where the remote onboardingSeen is unknown and
      // firing could replay the greeting on a device that already saw it.
      // maybeStartOnboarding is idempotent + re-checks the empty-shelf gate,
      // so the dual call (here + the books callback) is race-safe.
      if (profResult.status !== 'error' &&
          window.YumiUI && typeof window.YumiUI.maybeStartOnboarding === 'function') {
        window.YumiUI.maybeStartOnboarding(u.uid);
      }
    });
  } else {
    clearUserState();
    sv('praxis_user', null);
    console.log('onAuthStateChanged: signed out');
    // Stage 14.3 Stage 4.2: repaint the current route so the UI reflects
    // the signed-out state immediately (e.g. the Account page falls back
    // to its sign-in prompt). typeof-guarded because renderRoute lives in
    // views.js, which loads AFTER integrations.js; the guard is belt-and-
    // suspenders since this callback only fires at runtime, by which point
    // views.js is loaded. Signed-IN branch deliberately left untouched --
    // its loader callbacks already drive the render; a repaint here would
    // risk a double-paint.
    if (typeof renderRoute === 'function') { renderRoute(); }
    // 6.2b.1: sign-out is a definitive end-of-session -- wipe the panel
    // body UNCONDITIONALLY (force=true) so a half-finished onboarding
    // transcript never survives for the next user, and reset the onboarding
    // session state so a later sign-in starts clean.
    if (window.YumiUI && typeof window.YumiUI.refreshPanelForAuth === 'function') {
      window.YumiUI.refreshPanelForAuth(true);
    }
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
    clearUserState();
    sv('praxis_user', null);
    console.log('signOut: success');
  }).catch(function (err) {
    clearUserState();
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

// Stage 14.3 Stage 1: per-user profile-doc read from /userProfiles/{uid}.
// Typed callback in the loadBooksFromFirestore house style -- found /
// absent / error. REPLACE-on-read contract: the caller overwrites the
// local profile cache with the remote doc on 'found'; on 'absent' (a
// fresh account with no remote doc yet) the local cache is KEPT, not
// cleared. Idempotent fire-once via a local done flag.
function loadProfileFromFirestore(uid, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('loadProfileFromFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userProfiles')
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

// Stage 14.3 Stage 1: per-user profile-doc write to /userProfiles/{uid}.
// .set() is a full-doc overwrite, matching the single-doc model and the
// REPLACE read semantics above. Single-arg typed callback in the house
// style: { status: 'ok' } / { status: 'error', error }. Idempotent
// fire-once via a local done flag.
function saveProfileToFirestore(uid, profile, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('saveProfileToFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userProfiles')
      .doc(uid)
      .set({
        displayNameOverride: (profile && profile.displayNameOverride) ? profile.displayNameOverride : '',
        penName:             (profile && profile.penName) ? profile.penName : '',
        // 6.2b: persist the first-run greeting flag. .set() is a full-doc
        // overwrite, so this field must be present or it would be wiped on
        // every Account-page save. Callers pass getProfile(uid), which now
        // carries onboardingSeen.
        onboardingSeen:      (profile && profile.onboardingSeen === true),
        updatedAt:           firebase.firestore.FieldValue.serverTimestamp()
      })
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

// Stage 14.3 Stage 3: account deletion. Irreversible. Definition only --
// no UI trigger (Stage 4) and no console call this stage. Contract:
//   - No signed-in user -> callback({status:'error', error:'no signed-in
//     user'}) and do nothing.
//   STEP 1: delete all five per-user Firestore docs (doc id = uid) via a
//     counted-callback fan-out -- userBooks, userArcs, userNotebook,
//     userSubTheories, userProfiles. Firestore .delete() RESOLVES for a
//     missing doc, so not-found naturally counts as success; only a real
//     reject is a hard error. Any hard error -> callback({status:'error',
//     phase:'firestore', error}) and ABORT with NO local changes (retry-
//     able). The aborted flag guards against a second done() once any
//     delete has rejected.
//   STEP 2: only after all five settle -> wipeActiveUserLocal() (empties
//     the per-uid localStorage bucket + wipes in-memory maps).
//   STEP 3: attempt firebase.auth().currentUser.delete().
//     - success -> sv('praxis_user', null); callback({status:'deleted'}).
//     - 'auth/requires-recent-login' OR any other error -> the DATA IS
//       ALREADY GONE (steps 1+2 done). Sign out anyway (the observer
//       clears praxis_user) and surface a soft note via
//       {status:'deleted-data-only'}. Do NOT resurrect data, do NOT abort.
//   INVARIANT: once the five docs are deleted, local is wiped and the user
//   is signed out regardless of whether currentUser.delete() succeeds.
//   Data deletion never blocks on auth-record deletion.
function deleteAccount(callback) {
  function done(result) {
    if (typeof callback === 'function') callback(result);
  }
  var u = getCurrentUser();
  if (!u || !u.uid) {
    done({ status: 'error', error: 'no signed-in user' });
    return;
  }
  var uid = u.uid;
  var collections = ['userBooks', 'userArcs', 'userNotebook',
                     'userSubTheories', 'userProfiles'];
  var total = collections.length;
  var settled = 0;
  var aborted = false;

  function afterFirestore() {
    // STEP 2: wipe local (per-uid bucket + in-memory maps). praxis_user
    // is intentionally left for STEP 3 / sign-out to clear.
    wipeActiveUserLocal();
    // STEP 3: attempt the auth-record deletion.
    var authUser = firebase.auth().currentUser;
    if (!authUser) {
      // No live auth record -- data already wiped; clear the cache and
      // report a clean delete.
      sv('praxis_user', null);
      done({ status: 'deleted' });
      return;
    }
    authUser.delete().then(function () {
      sv('praxis_user', null);
      done({ status: 'deleted' });
    }).catch(function (err) {
      // 'auth/requires-recent-login' or any other error: data is already
      // gone, so sign out (observer clears praxis_user) and surface the
      // soft note rather than aborting or resurrecting data.
      firebase.auth().signOut();
      done({
        status: 'deleted-data-only',
        note:   'Account data removed. Sign in again to finish removing the login.'
      });
    });
  }

  function onSettle(err, isHardError) {
    if (aborted) return;
    if (isHardError) {
      aborted = true;
      done({ status: 'error', phase: 'firestore', error: err });
      return;
    }
    settled++;
    if (settled === total) {
      afterFirestore();
    }
  }

  var i;
  for (i = 0; i < collections.length; i++) {
    try {
      firebase.firestore()
        .collection(collections[i])
        .doc(uid)
        .delete()
        .then(function () {
          onSettle(null, false);
        })
        .catch(function (err) {
          onSettle(err, true);
        });
    } catch (e) {
      onSettle(e, true);
    }
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

// Stage 14.1c (workspace sync): per-user sub-theory-doc read from
// /userSubTheories/{uid}. Same typed-callback contract as the other
// loaders -- found / absent / error, idempotent fire-once.
function loadSubTheoriesFromFirestore(uid, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('loadSubTheoriesFromFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userSubTheories')
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

// Stage 14.1c: build the per-user sub-theory-doc payload. Denormalized
// single-doc model: { schemaVersion, subTheories: { id: {...} }, updatedAt }.
// Ownership is TRANSITIVE -- sub-theories carry no userId, only arcId, so a
// record is "this user's" iff its parent arc exists AND that arc.userId ===
// uid. An orphaned sub-theory (parent arc deleted) resolves to no owner and
// is intentionally dropped from the doc (deferred: cascade-delete).
function buildUserSubTheoriesDoc(uid) {
  var subTheories = {};
  var sid;
  if (state.subTheories) {
    for (sid in state.subTheories) {
      if (Object.prototype.hasOwnProperty.call(state.subTheories, sid)) {
        var st = state.subTheories[sid];
        if (st && st.userId === uid) {
          subTheories[sid] = st;
        }
      }
    }
  }
  return {
    schemaVersion: state.SCHEMA_VERSION,
    subTheories:   subTheories,
    updatedAt:     firebase.firestore.FieldValue.serverTimestamp()
  };
}

// Stage 14.1c: per-user sub-theory-doc write to /userSubTheories/{uid}.
// .set() full-doc overwrite, fire-and-forget, typed callback, idempotent
// fire-once -- identical contract to saveArcsToFirestore.
function saveSubTheoriesToFirestore(uid, payload, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('saveSubTheoriesToFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userSubTheories')
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
