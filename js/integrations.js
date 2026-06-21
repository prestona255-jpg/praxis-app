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

// Soft shared gate for the three Netlify proxies -- ships in the public
// client bundle by design (NOT a secret; deters casual abuse). Proxies
// enforce it only when the Netlify env var PRAXIS_CLIENT_KEY is set.
var PRAXIS_CLIENT_KEY      = '25a123effd6138469e8ca7a1103528338b94fc6c6466c8c34f283da9779bcdd5';

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
        // P0: the REPLACE merge now lives in mergeRemoteBookDoc, which
        // preserves locally-added-but-unsynced books (pendingBookSync)
        // instead of deleting them -- the scan/bulk data-loss fix. When
        // nothing is pending it behaves exactly as the prior inline merge.
        // saveState persists the merged shelf; the 3.10i conditional
        // flush-back is unchanged (fires only when a coverUrl was rewritten).
        var coversNormalized = mergeRemoteBookDoc(u.uid, result.data);
        saveState();
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
          + state.userBooks[u.uid].bookIds.length + ' books');
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
          // 10.5.9: the wholesale remote copy above bypasses migrate() and
          // ensureSubTheoryFields, so a record synced from a client on an older
          // schema lands missing newer fields (e.g. citationPins). Backfill the
          // FULL field set here -- the standing pattern for every future schema
          // field, mirroring the userId backfill above -- so synced records match
          // the local schema before they are saved and rendered.
          if (typeof ensureSubTheoryFieldsAll === 'function') {
            ensureSubTheoryFieldsAll(state.subTheories);
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

    // Stage 7 (manual themes): fetch this user's theme overlay from
    // /userThemes/{uid} and REPLACE-merge into state.userThemes. Independent
    // of the other docs. REPLACE: clear THIS uid's locally-known themes before
    // splatting the remote set, so a delete on another device does not
    // resurrect from cache. Ownership is theme.userId (direct).
    loadThemesFromFirestore(u.uid, function (themeResult) {
      if (themeResult.status === 'found') {
        var tid;
        if (state.userThemes) {
          for (tid in state.userThemes) {
            if (Object.prototype.hasOwnProperty.call(state.userThemes, tid) &&
                state.userThemes[tid] && state.userThemes[tid].userId === u.uid) {
              delete state.userThemes[tid];
            }
          }
        }
        if (!state.userThemes) { state.userThemes = {}; }
        var remoteThemes = (themeResult.data && themeResult.data.userThemes)
          ? themeResult.data.userThemes
          : {};
        var rtid;
        for (rtid in remoteThemes) {
          if (Object.prototype.hasOwnProperty.call(remoteThemes, rtid)) {
            state.userThemes[rtid] = remoteThemes[rtid];
          }
        }
        saveState();
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadThemesFromFirestore: merged remote theme doc');
      } else if (themeResult.status === 'absent') {
        console.log('loadThemesFromFirestore: no remote theme doc for uid, keeping cache');
      } else {
        console.warn('loadThemesFromFirestore: fetch failed, keeping cache', themeResult.error);
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
        var journalPrivacyChanged = false;
        for (reid in remoteEntries) {
          if (Object.prototype.hasOwnProperty.call(remoteEntries, reid)) {
            state.notebookEntries[reid] = remoteEntries[reid];
            // N-epic: merge-boundary 'filed' default. The REPLACE-splat
            // bypasses migrate(), so a remote entry lacking 'filed' (a device
            // on an older build) gains it here, BOOK-AWARE (matching migrate):
            // journal -> placed; a non-journal note -> placed only if it has a
            // book, else Inbox. A flat true would make a bookless non-journal
            // note match no tab. Never touches isPrivate.
            if (state.notebookEntries[reid] &&
                typeof state.notebookEntries[reid].filed !== 'boolean') {
              var rne = state.notebookEntries[reid];
              rne.filed = (rne.register === 'journal') ? true
                : !!(rne.bookIds && rne.bookIds.length > 0);
            }
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
            // N2b: merge-boundary images default. The REPLACE-splat bypasses
            // migrate(), so a remote entry from a pre-N2b device gains images:[]
            // as it lands (refs only; the photo blobs are device-local in
            // IndexedDB). Non-dirtying -- a missing array is just defaulted, not
            // a real change, so it never churns a write back to Firestore.
            if (state.notebookEntries[reid] &&
                !(state.notebookEntries[reid].images instanceof Array)) {
              state.notebookEntries[reid].images = [];
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
          // Fix: the merge omitted tagline, so saveProfileToFirestore persisted
          // it but a second device never pulled it back (silently wiped on a
          // cross-device sign-in). Read/write now symmetric with the .set() list.
          tagline:             rd.tagline ? rd.tagline : '',
          onboardingSeen:      rd.onboardingSeen === true,
          // N-epic: master consent switch. Absent in a remote doc written
          // before this field existed -> default TRUE (never silently flip
          // Yumi OFF on a legacy profile). Only an explicit stored false
          // turns it off.
          yumiReadsAlong:      (typeof rd.yumiReadsAlong === 'boolean') ? rd.yumiReadsAlong : true,
          // yumi-intelligence Stage I: reader-model opt-in. Absent in a remote
          // doc written before this field existed -> default FALSE (the model is
          // strictly opt-in; never enroll a legacy profile). Symmetric with the
          // .set() write list in saveProfileToFirestore (the Firestore-merge
          // gotcha: a doc from sign-in bypasses migrate(), so read AND write
          // must both carry this field or a second device silently wipes it).
          yumiReaderModel:     (typeof rd.yumiReaderModel === 'boolean') ? rd.yumiReaderModel : false
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

    // yumi-intelligence Stage I: hydrate this user's reader-model doc from
    // /userReaderModel/{uid}. REPLACE-on-found into the ensureUser-seeded slot
    // via replaceReaderModel; 'absent' (no remote doc yet) KEEPS the local seed;
    // 'error' keeps the cache. Mirrors loadProfileFromFirestore's contract.
    loadReaderModelFromFirestore(u.uid, function (rmResult) {
      if (rmResult.status === 'found') {
        ensureUser(u.uid);
        replaceReaderModel(u.uid, rmResult.data || {});
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadReaderModelFromFirestore: merged remote reader-model doc');
      } else if (rmResult.status === 'absent') {
        console.log('loadReaderModelFromFirestore: no remote reader-model doc for uid, keeping cache');
      } else {
        console.warn('loadReaderModelFromFirestore: fetch failed, keeping cache', rmResult.error);
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

// Phase 0: apply a remote /userBooks doc onto local state -- the REPLACE
// merge formerly inline in the onAuthStateChanged 'found' branch, extracted
// so it is testable and so the pendingBookSync guard has one home. Returns
// true iff at least one coverUrl was rewritten (caller flushes back).
//
// GUARD (the data-loss fix): a local book id is deleted ONLY when it is BOTH
// absent from the remote doc AND not in pendingBookSync (= a genuine server-
// side delete of a previously-synced book). A pending id -- added locally by
// scan/bulk, not yet confirmed in Firestore -- is PRESERVED: its state.books
// record is kept and its id is unioned back into bookIds. When nothing is
// pending this is byte-for-byte the original REPLACE.
function mergeRemoteBookDoc(uid, data) {
  ensureUser(uid);
  var prevIds = state.userBooks[uid].bookIds.slice();
  var remoteIds = (data && data.bookIds) ? data.bookIds : [];
  var remoteBooks = (data && data.books) ? data.books : {};

  var remoteHas = {};
  var ri;
  for (ri = 0; ri < remoteIds.length; ri++) { remoteHas[remoteIds[ri]] = true; }

  // Stage 6: ids the user DELETED whose remote removal may still be in flight.
  // A remote doc read BEFORE the deletion propagated still lists them -- they
  // must NOT be copied back (resurrected). When the remote no longer lists a
  // pending-delete id, the removal is confirmed -> clear the pending mark.
  var delPend = (typeof getPendingBookDeletes === 'function') ? getPendingBookDeletes(uid) : [];
  var delSet = {}, dk, confirmedDeletes = [];
  for (dk = 0; dk < delPend.length; dk++) {
    delSet[delPend[dk]] = true;
    if (!remoteHas[delPend[dk]]) { confirmedDeletes.push(delPend[dk]); }
  }

  // Delete a previously-known local id ONLY if absent from remote AND not
  // pending-sync. Pending ids (unsynced local adds) are kept.
  var p;
  for (p = 0; p < prevIds.length; p++) {
    var pid = prevIds[p];
    if (state.books[pid] && !remoteHas[pid] && !isBookPending(uid, pid)) {
      delete state.books[pid];
    }
  }

  // 3.10i cover normalization stays on the remote payload, pre-copy.
  var coversNormalized = normalizeCoverUrlsToHttps(remoteBooks);

  // New index = remote set MINUS pending-deletes, then any still-pending local
  // add not already in remote -- preserving the unsynced book's shelf position.
  var nextIds = [];
  for (ri = 0; ri < remoteIds.length; ri++) {
    if (!delSet[remoteIds[ri]]) { nextIds.push(remoteIds[ri]); }
  }
  var pend = getPendingBookSync(uid);
  var pk;
  for (pk = 0; pk < pend.length; pk++) {
    var pendId = pend[pk];
    if (!remoteHas[pendId] && !delSet[pendId] && state.books[pendId]) {
      nextIds.push(pendId);
    }
  }
  state.userBooks[uid].bookIds = nextIds;

  // Remote wins for synced ids; a pending-delete id is SKIPPED (not resurrected)
  // and any stray local copy of it is dropped; pending-add ids keep their local
  // record.
  var r;
  for (r = 0; r < remoteIds.length; r++) {
    var rbid = remoteIds[r];
    if (delSet[rbid]) {
      if (state.books[rbid]) { delete state.books[rbid]; }
      continue;
    }
    if (remoteBooks[rbid]) {
      state.books[rbid] = remoteBooks[rbid];
    }
  }

  // Stage 6: removals the remote has now dropped are confirmed -> stop guarding.
  if (confirmedDeletes.length > 0 && typeof clearPendingBookDelete === 'function') {
    clearPendingBookDelete(uid, confirmedDeletes);
  }
  // Phase 1 footgun fix: backfill schema fields AFTER the wholesale remote
  // copy, on the MERGED state.books -- so a remote record arriving without the
  // Phase-1 fields (pageCount/publisher/year/description/rating/dateRead, plus
  // tradition/traditionOverride) is completed in place, and a remote payload
  // that lacks a field cannot strip it post-copy. Also covers the pending-only
  // local records preserved above. (Was ensureBookFieldsAll(remoteBooks) pre-copy.)
  ensureBookFieldsAll(state.books);
  return coversNormalized;
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
        // #8 Stage 4b: persist the additive tagline. .set() is a full-doc
        // overwrite, so this MUST be listed or it would be wiped on every save.
        tagline:             (profile && profile.tagline) ? profile.tagline : '',
        // 6.2b: persist the first-run greeting flag. .set() is a full-doc
        // overwrite, so this field must be present or it would be wiped on
        // every Account-page save. Callers pass getProfile(uid), which now
        // carries onboardingSeen.
        onboardingSeen:      (profile && profile.onboardingSeen === true),
        // N-epic: master consent switch. Full-doc .set() -> must be listed or
        // it would be wiped. Default-true-preserving: writes true unless the
        // local value is explicitly false.
        yumiReadsAlong:      !(profile && profile.yumiReadsAlong === false),
        // yumi-intelligence Stage I: reader-model opt-in. Full-doc .set() -> must
        // be listed or it would be wiped. Default-FALSE-preserving (opt-in):
        // writes true ONLY when the local value is explicitly true.
        yumiReaderModel:     !!(profile && profile.yumiReaderModel === true),
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

// yumi-intelligence Stage I: per-user reader-model doc read from
// /userReaderModel/{uid}. Same typed found/absent/error contract + REPLACE-on-
// found / KEEP-on-absent semantics as loadProfileFromFirestore. The reader-model
// data (named threads + a prose reading profile) is the reader's, fully
// visible/editable; this loader hydrates it on sign-in. Idempotent fire-once.
function loadReaderModelFromFirestore(uid, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('loadReaderModelFromFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userReaderModel')
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

// yumi-intelligence Stage I: per-user reader-model doc write to
// /userReaderModel/{uid}. .set() is a full-doc overwrite, matching the single-
// doc model + the REPLACE read above. Stores the locked shape (threads + prose
// profile + the model's own numeric updatedAt) plus a server-stamped syncedAt
// marker. Single-arg typed callback in the house style. Idempotent fire-once.
function saveReaderModelToFirestore(uid, model, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('saveReaderModelToFirestore: missing uid') });
    return;
  }
  var m = (model && typeof model === 'object') ? model : {};
  var threads = (m.threads instanceof Array) ? m.threads : [];
  var prof = (m.profile && typeof m.profile === 'object') ? m.profile : {};
  try {
    firebase.firestore()
      .collection('userReaderModel')
      .doc(uid)
      .set({
        threads:   threads,
        profile: {
          summary:   (typeof prof.summary === 'string') ? prof.summary : '',
          updatedAt: (typeof prof.updatedAt === 'number') ? prof.updatedAt : 0
        },
        updatedAt: (typeof m.updatedAt === 'number') ? m.updatedAt : 0,
        syncedAt:  firebase.firestore.FieldValue.serverTimestamp()
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
                     'userSubTheories', 'userProfiles', 'userThemes',
                     'userReaderModel'];
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

// Stage 7 (manual themes): per-user theme-overlay doc at /userThemes/{uid}.
// Same typed-callback contract as the other loaders -- found / absent /
// error, idempotent fire-once.
function loadThemesFromFirestore(uid, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('loadThemesFromFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userThemes')
      .doc(uid)
      .get()
      .then(function (doc) {
        if (doc && doc.exists) {
          finish({ status: 'found', data: doc.data() });
        } else {
          finish({ status: 'absent' });
        }
      }, function (err) {
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// Stage 7: build the per-user theme-overlay payload. Denormalized single-doc
// model: { schemaVersion, userThemes: { id: {...} }, updatedAt }. Ownership is
// DIRECT (theme.userId === uid), mirroring userArcs.
function buildUserThemesDoc(uid) {
  var userThemes = {};
  var tid;
  if (state.userThemes) {
    for (tid in state.userThemes) {
      if (Object.prototype.hasOwnProperty.call(state.userThemes, tid)) {
        var th = state.userThemes[tid];
        if (th && th.userId === uid) {
          userThemes[tid] = th;
        }
      }
    }
  }
  return {
    schemaVersion: state.SCHEMA_VERSION,
    userThemes:    userThemes,
    updatedAt:     firebase.firestore.FieldValue.serverTimestamp()
  };
}

// Stage 7: per-user theme-doc write to /userThemes/{uid}. .set() full-doc
// overwrite, fire-and-forget, typed callback, idempotent fire-once --
// identical contract to saveSubTheoriesToFirestore.
function saveThemesToFirestore(uid, payload, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('saveThemesToFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userThemes')
      .doc(uid)
      .set(payload)
      .then(function () {
        finish({ status: 'ok' });
      }, function (err) {
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
      headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
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
      headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
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

// =====================================================================
// Phase 2 -- the accuracy engine (shared resolver).
//
// resolveBook(query, callback): the single book-matching path that the inputs
// (ISBN/barcode/title/manual) AND the cleanup pass call. Returns a typed result
// describing the auto-picked match, its confidence tier, and ranked alternates
// for the edition picker. NEVER drops: no match yields a manual-entry stub
// flagged 'none'; no cover yields coverUrl null (the UI renders a typographic
// placeholder). ES3, two-arg .then(ok, err), fail-soft (never throws).
//
//   query:    { kind:'isbn'|'title', isbn?, title?, author? }
//   callback(result):
//     { status:'strong'|'weak'|'none',
//       book:{ title,author,year,pageCount,publisher,description,isbn,coverUrl,coverCandidates },
//       alternates:[ <book>, ... ],   // ranked editions for the picker (excl. picked)
//       query }
// =====================================================================

// High-res OpenLibrary cover by ISBN. ?default=false makes OL 404 (instead of
// returning a 1x1 blank) when it has no cover, so an <img> onerror can fall
// through to the Google Books image (coverCandidates[1]).
function openLibraryIsbnCover(isbn) {
  if (typeof isbn !== 'string' || isbn.length === 0) { return null; }
  return 'https://covers.openlibrary.org/b/isbn/' + encodeURIComponent(isbn) + '-L.jpg?default=false';
}

// Largest Google Books image from volumeInfo.imageLinks, https-normalized,
// page-curl artifact stripped. Order: extraLarge..smallThumbnail. null if none.
function googleBooksLargestCover(imageLinks) {
  if (!imageLinks) { return null; }
  var order = ['extraLarge', 'large', 'medium', 'small', 'thumbnail', 'smallThumbnail'];
  var i, u;
  for (i = 0; i < order.length; i++) {
    u = imageLinks[order[i]];
    if (typeof u === 'string' && u.length > 0) {
      if (u.indexOf('http://') === 0) { u = 'https://' + u.slice(7); }
      u = u.replace('&edge=curl', '').replace('?edge=curl', '');
      return u;
    }
  }
  return null;
}

// ISBN-13 (preferred) or ISBN-10 from a volumeInfo.industryIdentifiers.
function volumeIsbn(vi) {
  if (!vi || !vi.industryIdentifiers) { return null; }
  var ids = vi.industryIdentifiers, i;
  for (i = 0; i < ids.length; i++) { if (ids[i].type === 'ISBN_13') { return ids[i].identifier; } }
  for (i = 0; i < ids.length; i++) { if (ids[i].type === 'ISBN_10') { return ids[i].identifier; } }
  return null;
}

// Comparison normalize: lowercase, strip punctuation, collapse whitespace.
function resolverNormalize(s) {
  if (typeof s !== 'string') { return ''; }
  var t = s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ');
  return t.replace(/^\s+|\s+$/g, '');
}

// Token-overlap closeness 0..1 between two strings, with a containment bonus.
function titleCloseness(a, b) {
  var na = resolverNormalize(a), nb = resolverNormalize(b);
  if (na.length === 0 || nb.length === 0) { return 0; }
  if (na === nb) { return 1; }
  var ta = na.split(' '), tb = nb.split(' ');
  var setb = {}, i;
  for (i = 0; i < tb.length; i++) { setb[tb[i]] = true; }
  var hits = 0;
  for (i = 0; i < ta.length; i++) { if (setb[ta[i]]) { hits++; } }
  var denom = Math.max(ta.length, tb.length);
  var ratio = denom > 0 ? hits / denom : 0;
  if (na.indexOf(nb) !== -1 || nb.indexOf(na) !== -1) { ratio = Math.max(ratio, 0.85); }
  return ratio;
}

// Score a volumeInfo against the query (higher = better). vi._printType is the
// item-level printType set by the caller.
function scoreVolume(query, vi) {
  if (!vi) { return -1; }
  var score = titleCloseness((query && query.title) || '', vi.title || '') * 50;
  if (query && query.author && vi.authors && vi.authors.length > 0) {
    var qa = resolverNormalize(query.author), joined = '', ai;
    for (ai = 0; ai < vi.authors.length; ai++) { joined += ' ' + resolverNormalize(vi.authors[ai]); }
    if (qa.length > 0) {
      var qaToks = qa.split(' '), matched = 0, qi;
      for (qi = 0; qi < qaToks.length; qi++) { if (joined.indexOf(qaToks[qi]) !== -1) { matched++; } }
      if (qaToks.length > 0) { score += (matched / qaToks.length) * 25; }
    }
  }
  // ISBN is a strong confidence signal; its ABSENCE is a real down-rank (a
  // confident modern match almost always carries an ISBN-13).
  if (volumeIsbn(vi)) { score += 10; } else { score -= 10; }
  // A real cover is a positive; absence is a SOFT down-rank only -- some legit
  // editions lack a cover (e.g. The Fire Next Time), so this never alone flags.
  if (vi.imageLinks) { score += 8; } else { score -= 6; }
  if (vi.language === 'en') { score += 4; }
  if (vi._printType === 'BOOK') { score += 5; } else if (vi._printType) { score -= 12; }
  // Stage 2: implausibly-old editions for a modern shelf scan are almost always
  // Google Books scanned-periodical / first-edition artifacts (the "The Builder"
  // 1890 case). Down-rank pre-1900 hard, pre-1950 lightly, so the modern reprint
  // (with its cover + ISBN) ranks above the scan.
  var ym = ('' + (vi.publishedDate || '')).match(/(\d{4})/);
  if (ym) {
    var yr = parseInt(ym[1], 10);
    if (yr < 1900) { score -= 30; }
    else if (yr < 1950) { score -= 6; }
  }
  // Stage 2: periodical / index / proceedings artifacts -- a bound journal
  // volume or a scanned index page is never the book a reader photographed.
  var hay = (((vi.title || '') + ' ' + (vi.subtitle || '')) + '').toLowerCase();
  if (/\b(index|proceedings|transactions|periodical|magazine|bulletin|gazette|catalogue|catalog|annual report)\b/.test(hay) ||
      /\bvol\.?\s*\d/.test(hay) || /\bno\.\s*\d/.test(hay)) {
    score -= 25;
  }
  return score;
}

// Build a normalized book record from a volumeInfo (+ a known isbn override).
// Cover preference: OpenLibrary-by-ISBN first (when isbn known), Google image
// second; coverUrl is the first candidate (null when neither exists).
function volumeToBook(vi, knownIsbn) {
  var isbn = knownIsbn || volumeIsbn(vi) || '';
  var author = '';
  if (vi && vi.authors && vi.authors.length > 0) { author = vi.authors.join(', '); }
  var year = null;
  if (vi && vi.publishedDate) { var m = ('' + vi.publishedDate).match(/(\d{4})/); if (m) { year = m[1]; } }
  var olCover = openLibraryIsbnCover(isbn);
  var gCover = googleBooksLargestCover(vi ? vi.imageLinks : null);
  var candidates = [];
  if (olCover) { candidates.push(olCover); }
  if (gCover) { candidates.push(gCover); }
  return {
    title:           (vi && vi.title) ? vi.title : '',
    author:          author,
    year:            year,
    pageCount:       (vi && typeof vi.pageCount === 'number') ? vi.pageCount : null,
    publisher:       (vi && typeof vi.publisher === 'string') ? vi.publisher : '',
    description:     (vi && typeof vi.description === 'string') ? vi.description : '',
    isbn:            isbn,
    coverUrl:        candidates.length > 0 ? candidates[0] : null,
    coverCandidates: candidates
  };
}

// Low-level Google Books search via the proxy. callback(itemsArray | []).
// Two-arg .then on every hop -> fail-soft to [] (never throws/drops).
function googleBooksSearch(q, callback) {
  var done = false;
  function finish(items) { if (done) { return; } done = true; if (typeof callback === 'function') { callback(items); } }
  try {
    fetch(GOOGLE_BOOKS_PROXY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
      body:    JSON.stringify({ q: q })
    }).then(function (res) { return res.json(); }, function () { finish([]); })
      .then(function (data) {
        if (!data || !data.items || data.items.length === 0) { finish([]); return; }
        finish(data.items);
      }, function () { finish([]); });
  } catch (e) { finish([]); }
}

function resolveBook(query, callback) {
  var done = false;
  function finish(result) { if (done) { return; } done = true; if (typeof callback === 'function') { callback(result); } }
  function manualStub(stubIsbn) {
    return {
      status: 'none',
      book: {
        title:   (query && query.title) ? query.title : '',
        author:  (query && query.author) ? query.author : '',
        year: null, pageCount: null, publisher: '', description: '',
        isbn:    stubIsbn || (query && query.isbn) || '',
        coverUrl: null, coverCandidates: []
      },
      alternates: [], query: query
    };
  }
  if (!query || (query.kind !== 'isbn' && query.kind !== 'title')) { finish(manualStub('')); return; }

  if (query.kind === 'isbn') {
    var isbn = ('' + (query.isbn || '')).replace(/[\s-]/g, '');
    if (isbn.length === 0) { finish(manualStub('')); return; }
    googleBooksSearch('isbn:' + isbn, function (items) {
      if (!items || items.length === 0) { finish(manualStub(isbn)); return; }
      var vi0 = items[0].volumeInfo || {};
      vi0._printType = items[0].printType;
      var book = volumeToBook(vi0, isbn);
      var alts = [], k;
      for (k = 1; k < items.length && alts.length < 5; k++) {
        var viK = items[k].volumeInfo || {};
        alts.push(volumeToBook(viK, volumeIsbn(viK)));
      }
      finish({ status: 'strong', book: book, alternates: alts, query: query });
    });
    return;
  }

  var qTitle = ('' + (query.title || '')).replace(/^\s+|\s+$/g, '');
  if (qTitle.length === 0) { finish(manualStub('')); return; }
  var q = 'intitle:' + qTitle;
  if (typeof query.author === 'string' && query.author.length > 0) { q = q + '+inauthor:' + query.author; }
  googleBooksSearch(q, function (items) {
    if (!items || items.length === 0) { finish(manualStub('')); return; }
    var scored = [], i;
    for (i = 0; i < items.length; i++) {
      var vi = items[i].volumeInfo || {};
      vi._printType = items[i].printType;
      scored.push({ vi: vi, score: scoreVolume(query, vi) });
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    var top = scored[0];
    var book = volumeToBook(top.vi, volumeIsbn(top.vi));
    var alts = [], k;
    for (k = 1; k < scored.length && alts.length < 5; k++) {
      alts.push(volumeToBook(scored[k].vi, volumeIsbn(scored[k].vi)));
    }
    // Stage 2: a confident auto-pick now requires a strong score AND a close
    // title match AND an ISBN on the top result. A junk/weak top (no ISBN,
    // periodical, implausibly old, low score) falls to 'weak' -> the review row
    // flags "check this" rather than silently auto-confirming. (ISBN-kind
    // queries above stay 'strong' -- an exact ISBN match is authoritative.)
    var topClose = titleCloseness((query && query.title) || '', top.vi.title || '');
    var topHasIsbn = !!volumeIsbn(top.vi);
    var status = (top.score >= 60 && topClose >= 0.65 && topHasIsbn) ? 'strong' : 'weak';
    finish({ status: status, book: book, alternates: alts, query: query });
  });
}

// resolveBatch(queries, callback): run resolveBook over each query
// SEQUENTIALLY (one proxy round-trip in flight at a time -- gentle on the
// rate limit) and callback(resultsArray) once all settle. Every query yields
// a result (resolveBook never drops), so results.length === queries.length.
function resolveBatch(queries, callback) {
  if (!queries || queries.length === 0) {
    if (typeof callback === 'function') { callback([]); }
    return;
  }
  var results = [];
  var idx = 0;
  function next() {
    if (idx >= queries.length) {
      if (typeof callback === 'function') { callback(results); }
      return;
    }
    var q = queries[idx];
    idx = idx + 1;
    resolveBook(q, function (r) { results.push(r); next(); });
  }
  next();
}

console.log('integrations.js loaded');
