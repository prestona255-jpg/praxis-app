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

// =====================================================================
// F-DL1 -- load-resolved sync latches (OUTGOING clobber guard).
//
// Each collection whose sign-in load does a REPLACE-splat + full-doc
// .set() can, on a stale/empty-cache device, race a mutation-triggered
// write ahead of the load: the write builds its payload from the
// pre-load LOCAL subset and .set() overwrites the fuller remote doc,
// destroying remote-only records (F-DL1). These per-collection latches
// gate the OUTGOING write: false until that collection's load has
// SETTLED (found / absent / error all count as settled). While a latch
// is false, saveXToFirestore does NOT write -- it re-marks the dirty
// flag (markXDirty) and returns, so the existing saveState retry re-runs
// once the latch opens and the payload is built from POST-merge state.
// Set true at the top of each load callback; the callback's tail (found
// already has a saveState; absent/error get one added) flushes any write
// deferred during the window. Books ALSO carries this outgoing latch
// (F-DL2) BESIDE its pendingBookSync guard -- orthogonal: the latch gates
// the OUTGOING .set, pendingBookSync guards the INCOMING 3-way merge, so
// the two never touch. profile/readerModel are deferred to F-DL3.
// =====================================================================
var arcsLoaded         = false;
var notebookLoaded     = false;
var subTheoriesLoaded  = false;
var themesLoaded       = false;
var artifactsLoaded    = false;
var booksLoaded        = false;   // F-DL2: books' outgoing latch (beside pendingBookSync).
// F-DL3: profile + readerModel are single-doc writes fired DIRECTLY (no dirty flag), so
// besides the load-settled latch they need a WRITE-PENDING flag + a tail re-fire in the
// load callback -- the F-DL1 dirty-flag retry does not exist for them.
var profileLoaded            = false;
var readerModelLoaded        = false;
var profileWritePending      = false;
var readerModelWritePending  = false;

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
      booksLoaded = true;   // F-DL2: load settled -> open the outgoing-write latch.
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
        // F-DL2: no remote doc -> flush any write deferred during the load
        // window (nothing remote to clobber). Found already re-fires via saveState.
        saveState();
      } else {
        // Network / permission / other failure. Keep cache, log
        // and continue; the cached shelf stays visible.
        console.warn('loadBooksFromFirestore: fetch failed, keeping cache', result.error);
        // F-DL2 (R2): errored load -> latch open; flush any deferred write.
        saveState();
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
      arcsLoaded = true;   // F-DL1: load settled -> open the outgoing-write latch.
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
        // 2.0 hardening (batch 2a): the REPLACE-splat above bypasses migrate()
        // and (unlike books / subTheories) had no field backfill, so a remote
        // arc from an older schema landed missing bookIds / entryIds -- the
        // TypeError that white-screened the arc page (batch 1 guarded it at the
        // render layer; this is the load-side root fix). Mirrors the
        // ensureSubTheoryFieldsAll call on the sub-theory merge below.
        if (typeof ensureArcFieldsAll === 'function') {
          ensureArcFieldsAll(state.arcs);
        }
        saveState();
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadArcsFromFirestore: merged remote arc doc');
      } else if (arcResult.status === 'absent') {
        console.log('loadArcsFromFirestore: no remote arc doc for uid, keeping cache');
        // F-DL1: no remote doc -> flush any write deferred during the load
        // window (nothing remote to clobber). The found branch already saves.
        saveState();
      } else {
        console.warn('loadArcsFromFirestore: fetch failed, keeping cache', arcResult.error);
        // F-DL1 (R2): load errored -> latch is open; flush any deferred write.
        // localStorage stayed durable; this pushes the local set.
        saveState();
      }

      // Stage 14.1c: NESTED here so arcs are reconciled (merged, absent, or
      // kept-on-error) BEFORE this runs -- sub-theory ownership is transitive
      // (subTheories[id].arcId -> arcs[arcId].userId), so both the clear-
      // predicate and buildUserSubTheoriesDoc need arcs present. Fires once
      // per sign-in regardless of the arc branch above.
      loadSubTheoriesFromFirestore(u.uid, function (stResult) {
        subTheoriesLoaded = true;   // F-DL1: load settled -> open the latch.
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
          saveState();   // F-DL1: flush any write deferred during the load window.
        } else {
          console.warn('loadSubTheoriesFromFirestore: fetch failed, keeping cache', stResult.error);
          saveState();   // F-DL1 (R2): errored load; latch open; flush deferred write.
        }
      });
    });

    // Stage 7 (manual themes): fetch this user's theme overlay from
    // /userThemes/{uid} and REPLACE-merge into state.userThemes. Independent
    // of the other docs. REPLACE: clear THIS uid's locally-known themes before
    // splatting the remote set, so a delete on another device does not
    // resurrect from cache. Ownership is theme.userId (direct).
    loadThemesFromFirestore(u.uid, function (themeResult) {
      themesLoaded = true;   // F-DL1: load settled -> open the latch.
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
        // 2.0 hardening (batch 2a): the REPLACE-splat above bypasses migrate()
        // and had no field backfill, so a remote theme from an older schema
        // landed missing name / bookIds. Backfill on the merge path, mirroring
        // the ensureSubTheoryFieldsAll call on the sub-theory merge.
        if (typeof ensureThemeFieldsAll === 'function') {
          ensureThemeFieldsAll(state.userThemes);
        }
        saveState();
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadThemesFromFirestore: merged remote theme doc');
      } else if (themeResult.status === 'absent') {
        console.log('loadThemesFromFirestore: no remote theme doc for uid, keeping cache');
        saveState();   // F-DL1: flush any write deferred during the load window.
      } else {
        console.warn('loadThemesFromFirestore: fetch failed, keeping cache', themeResult.error);
        saveState();   // F-DL1 (R2): errored load; latch open; flush deferred write.
      }
    });

    // 2.0 hardening (batch 2b): fetch this user's artifact-doc from
    // /userArtifacts/{uid} and REPLACE-merge into state.bookArtifacts. Mirrors
    // the theme handler (owner-keyed flat map; ownership is artifact.userId).
    // On 'absent' WITH local artifacts present, SEED them (markArtifactsDirty +
    // saveState) -- the one-time migration that pushes a user's pre-existing
    // localStorage artifacts to the cloud so they appear on a fresh device
    // (artifacts were localStorage-only before this batch; audit CRIT #2).
    loadArtifactsFromFirestore(u.uid, function (artResult) {
      artifactsLoaded = true;   // F-DL1: load settled -> open the latch.
      if (artResult.status === 'found') {
        var aki;
        if (state.bookArtifacts) {
          for (aki in state.bookArtifacts) {
            if (Object.prototype.hasOwnProperty.call(state.bookArtifacts, aki) &&
                state.bookArtifacts[aki] && state.bookArtifacts[aki].userId === u.uid) {
              delete state.bookArtifacts[aki];
            }
          }
        }
        if (!state.bookArtifacts) { state.bookArtifacts = {}; }
        var remoteArts = (artResult.data && artResult.data.bookArtifacts)
          ? artResult.data.bookArtifacts
          : {};
        var raki;
        for (raki in remoteArts) {
          if (Object.prototype.hasOwnProperty.call(remoteArts, raki)) {
            state.bookArtifacts[raki] = remoteArts[raki];
          }
        }
        if (typeof ensureArtifactFieldsAll === 'function') {
          ensureArtifactFieldsAll(state.bookArtifacts);
        }
        saveState();
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadArtifactsFromFirestore: merged remote artifact doc');
      } else if (artResult.status === 'absent') {
        // One-time seed: no remote artifact doc yet. If this user has local
        // artifacts (created before sync existed), push them so a fresh device
        // gets them. A user with none writes nothing. Once seeded, later
        // sign-ins return 'found' and this branch no longer fires.
        var hasLocalArt = false;
        var lak;
        if (state.bookArtifacts) {
          for (lak in state.bookArtifacts) {
            if (Object.prototype.hasOwnProperty.call(state.bookArtifacts, lak) &&
                state.bookArtifacts[lak] && state.bookArtifacts[lak].userId === u.uid) {
              hasLocalArt = true;
              break;
            }
          }
        }
        if (hasLocalArt && typeof markArtifactsDirty === 'function') {
          markArtifactsDirty();
          saveState();   // seeds local artifacts AND flushes any F-DL1-deferred write.
          console.log('loadArtifactsFromFirestore: no remote doc, seeded local artifacts');
        } else {
          console.log('loadArtifactsFromFirestore: no remote artifact doc for uid, keeping cache');
          saveState();   // F-DL1: flush any write deferred during the load window.
        }
      } else {
        console.warn('loadArtifactsFromFirestore: fetch failed, keeping cache', artResult.error);
        saveState();   // F-DL1 (R2): errored load; latch open; flush deferred write.
      }
    });

    // Stage 14.1b: fetch this user's notebook-doc from /userNotebook/{uid}
    // and REPLACE-merge into state.notebookEntries. Independent of the
    // book/arc fetches (separate docs). REPLACE: clear THIS uid's locally-
    // known entries before splatting the remote set, so a delete on another
    // device does not resurrect from cache. Ownership is entry.userId
    // (direct), so clear-predicate and remote-set share the key.
    loadNotebookFromFirestore(u.uid, function (nbResult) {
      notebookLoaded = true;   // F-DL1: load settled -> open the latch.
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
        // 2.0 hardening (batch 2a): the REPLACE-splat + inline backfill above
        // cover filed / images / journal-isPrivate but NOT the structural fields
        // body / bookIds / arcIds, so a remote entry from an older schema could
        // render wrong or throw on a .length read. Backfill those remaining
        // fields here (the inline-owned fields are left untouched), mirroring
        // the ensureSubTheoryFieldsAll call on the sub-theory merge.
        if (typeof ensureNotebookEntryFieldsAll === 'function') {
          ensureNotebookEntryFieldsAll(state.notebookEntries);
        }
        saveState();
        if (window.views && window.views.renderRoute) {
          window.views.renderRoute();
        }
        console.log('loadNotebookFromFirestore: merged remote notebook doc');
      } else if (nbResult.status === 'absent') {
        console.log('loadNotebookFromFirestore: no remote notebook doc for uid, keeping cache');
        saveState();   // F-DL1: flush any write deferred during the load window.
      } else {
        console.warn('loadNotebookFromFirestore: fetch failed, keeping cache', nbResult.error);
        saveState();   // F-DL1 (R2): errored load; latch open; flush deferred write.
      }
    });

    // Stage 14.3 Stage 1: fetch this user's profile doc from
    // /userProfiles/{uid}. REPLACE-on-found into the ensureUser-seeded
    // profile slot; 'absent' (fresh account, no remote doc) KEEPS the
    // local cache -- do NOT clear, a brand-new user simply has empty
    // override fields. setProfile is reused so the write also persists
    // the merged profile into the per-uid localStorage bucket.
    loadProfileFromFirestore(u.uid, function (profResult) {
      profileLoaded = true;   // F-DL3: load settled -> open the outgoing-write latch (all branches).
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
          yumiReaderModel:     (typeof rd.yumiReaderModel === 'boolean') ? rd.yumiReaderModel : false,
          // yumi-intelligence Stage III: live-web grounding opt-in. Absent in a
          // remote doc written before this field existed -> default FALSE (a
          // SEPARATE opt-in consent; never enroll a legacy profile). Symmetric
          // with the .set() write list (the Firestore-merge gotcha: a doc from
          // sign-in bypasses migrate(), so read AND write must both carry it).
          yumiWebGrounding:    (typeof rd.yumiWebGrounding === 'boolean') ? rd.yumiWebGrounding : false,
          // Alive Yumi: voice prefs. Symmetric with the .set() write list (the
          // Firestore-merge gotcha: a sign-in doc bypasses migrate(), so read
          // AND write must both carry these or a second device silently wipes
          // them). voiceOn default FALSE (opt-in); talkMode default push-to-talk.
          voiceOn:             (typeof rd.voiceOn === 'boolean') ? rd.voiceOn : false,
          talkMode:            (rd.talkMode === 'hands-free') ? 'hands-free' : 'push-to-talk',
          // Portrait Stage 1: declared values (the "stones"). Symmetric with the
          // .set() write list (the Firestore-merge gotcha: a sign-in doc bypasses
          // migrate(), so read AND write must both carry it or a second device
          // silently wipes it). Default [] when absent on the remote doc.
          values:              (rd.values instanceof Array) ? rd.values : []
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
      // F-DL3: flush a write deferred during the load window. Re-reads getProfile(u.uid)
      // (the post-merge profile on found; the local edit on absent/error) and re-fires now
      // that the latch is open -- mirrors the F-DL1/F-DL2 re-fire (re-read current local state).
      if (profileWritePending && typeof getProfile === 'function') {
        profileWritePending = false;
        saveProfileToFirestore(u.uid, getProfile(u.uid), function () {});
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
      readerModelLoaded = true;   // F-DL3: load settled -> open the outgoing-write latch (all branches).
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
      // F-DL3: flush a write deferred during the load window (post-merge on found; the local
      // model on absent/error). Mirrors the profile tail re-fire.
      if (readerModelWritePending && typeof getReaderModel === 'function') {
        readerModelWritePending = false;
        saveReaderModelToFirestore(u.uid, getReaderModel(u.uid), function () {});
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
  // F-DL2: block the OUTGOING write until the books load has settled (see the
  // latch block up top). Writing now would .set()-overwrite the remote doc with
  // a pre-load LOCAL subset, destroying remote-only books. Re-mark dirty so the
  // existing saveState retry re-runs post-merge; return WITHOUT writing or firing
  // the callback. Orthogonal to pendingBookSync (which guards the incoming merge).
  if (!booksLoaded) {
    if (typeof markBooksDirty === 'function') { markBooksDirty(); }
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
  // F-DL3: block the OUTGOING write until the profile load has settled (see the latch block
  // up top). A premature write of the fresh-device default profile would .set()-overwrite
  // remote penName/tagline/values. THE VARIANT (vs the 6 dirty-flag latches): there is no
  // dirty flag to re-fire this, so mark a write-pending flag and FIRE the callback with
  // {status:'deferred'} -- the 2 r-inspecting callers fall to their "Saved locally -- sync
  // will retry" else branch; the load-cb tail re-fires post-merge.
  if (!profileLoaded) {
    profileWritePending = true;
    finish({ status: 'deferred' });
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
        // yumi-intelligence Stage III: live-web grounding opt-in. Full-doc
        // .set() -> must be listed or it would be wiped. Default-FALSE-preserving
        // (opt-in): writes true ONLY when the local value is explicitly true.
        yumiWebGrounding:    !!(profile && profile.yumiWebGrounding === true),
        // Alive Yumi: voice prefs. Full-doc .set() -> must be listed or wiped.
        // Default-preserving: voiceOn writes true only when explicitly true;
        // talkMode writes hands-free only when explicitly hands-free.
        voiceOn:             !!(profile && profile.voiceOn === true),
        talkMode:            (profile && profile.talkMode === 'hands-free') ? 'hands-free' : 'push-to-talk',
        // Portrait Stage 1: the reader's DECLARED values (the "stones"). Full-doc
        // .set() -> must be listed or it would be wiped on every Account-page
        // save. Default [] when absent.
        values:              (profile && profile.values instanceof Array) ? profile.values : [],
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
  // F-DL3: block the outgoing write until the reader-model load has settled (see the latch
  // block up top). Same variant as profile: no dirty flag, so mark write-pending + FIRE
  // {status:'deferred'} (this fn's callers are no-op, so firing it is harmless) + return;
  // the load-cb tail re-fires post-merge.
  if (!readerModelLoaded) {
    readerModelWritePending = true;
    finish({ status: 'deferred' });
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
          updatedAt: (typeof prof.updatedAt === 'number') ? prof.updatedAt : 0,
          // yumi-intelligence Stage II: persist provenance so a hand-edit lock
          // ('edited') survives the round-trip and is honored on another device.
          // Full-doc .set() -> must be listed or it would be wiped. Default 'auto'.
          source:    (prof.source === 'edited') ? 'edited' : 'auto'
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
  // F-DL1: block the OUTGOING write until this collection's sign-in load has
  // settled (see the latch block up top). Writing now would .set()-overwrite
  // the remote doc with a pre-load LOCAL subset, destroying remote-only records.
  // Re-mark dirty so the existing saveState retry re-runs post-merge; return
  // WITHOUT writing or firing the callback (keeps saveState's clean-console path).
  if (!arcsLoaded) {
    if (typeof markArcsDirty === 'function') { markArcsDirty(); }
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
  // F-DL1: block the outgoing write until the notebook load has settled (see
  // the latch block up top). Re-mark dirty so saveState retries post-merge.
  if (!notebookLoaded) {
    if (typeof markNotebookDirty === 'function') { markNotebookDirty(); }
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
  // F-DL1: block the outgoing write until the sub-theory load has settled (see
  // the latch block up top). Re-mark dirty so saveState retries post-merge.
  if (!subTheoriesLoaded) {
    if (typeof markSubTheoriesDirty === 'function') { markSubTheoriesDirty(); }
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
  // F-DL1: block the outgoing write until the theme load has settled (see the
  // latch block up top). Re-mark dirty so saveState retries post-merge.
  if (!themesLoaded) {
    if (typeof markThemesDirty === 'function') { markThemesDirty(); }
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

// 2.0 hardening (batch 2b): per-user artifact-doc read from /userArtifacts/{uid}.
// Same typed-callback contract as the theme / arc loaders -- found / absent /
// error, idempotent fire-once.
function loadArtifactsFromFirestore(uid, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('loadArtifactsFromFirestore: missing uid') });
    return;
  }
  try {
    firebase.firestore()
      .collection('userArtifacts')
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

// 2.0 hardening (batch 2b): build the per-user artifact-doc payload.
// Denormalized single-doc model: { schemaVersion, bookArtifacts: { key: {...} },
// updatedAt }. Ownership is DIRECT (artifact.userId === uid), mirroring
// buildUserThemesDoc / buildUserArcsDoc. The map key is artifactKey(uid, bookId).
function buildUserArtifactsDoc(uid) {
  var bookArtifacts = {};
  var akey;
  if (state.bookArtifacts) {
    for (akey in state.bookArtifacts) {
      if (Object.prototype.hasOwnProperty.call(state.bookArtifacts, akey)) {
        var art = state.bookArtifacts[akey];
        if (art && art.userId === uid) {
          bookArtifacts[akey] = art;
        }
      }
    }
  }
  return {
    schemaVersion: state.SCHEMA_VERSION,
    bookArtifacts: bookArtifacts,
    updatedAt:     firebase.firestore.FieldValue.serverTimestamp()
  };
}

// 2.0 hardening (batch 2b): per-user artifact-doc write to /userArtifacts/{uid}.
// .set() full-doc overwrite, fire-and-forget, typed callback, idempotent
// fire-once -- identical contract to saveThemesToFirestore.
function saveArtifactsToFirestore(uid, payload, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  if (!uid) {
    finish({ status: 'error', error: new Error('saveArtifactsToFirestore: missing uid') });
    return;
  }
  // F-DL1: block the outgoing write until the artifact load has settled (see the
  // latch block up top). Re-mark dirty so saveState retries post-merge.
  if (!artifactsLoaded) {
    if (typeof markArtifactsDirty === 'function') { markArtifactsDirty(); }
    return;
  }
  try {
    firebase.firestore()
      .collection('userArtifacts')
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
    coverCandidates: candidates,
    // Stage 2 (shelf categories): raw BISAC subject strings from Google Books,
    // captured for NEW adds (existing books backfill to [] via ensureBookFields).
    rawCategories:   (vi && vi.categories instanceof Array) ? vi.categories : []
  };
}

// =====================================================================
// Stage 2 (shelf categories): the LLM batch classifier. Only books the pure
// classifyBookLocal() could not place (it returned null) reach here. Mirrors
// the segmentDoc proxy call (import-capture.js): same claude-proxy path +
// x-praxis-key, strict-JSON contract, tolerant parse. Sequential throttle --
// one batch of CLASSIFY_BATCH titles per request, the next firing only after
// the previous resolves -- so a full-library first run is a handful of calls,
// never a storm. Every input book ends up in the result map: a label from the
// model (validated against the 17), or CATEGORY_UNCATEGORIZED on any miss,
// transport failure, or parse failure. Never null, never blank.
// =====================================================================
var CLASSIFY_MODEL = 'claude-sonnet-4-6';
var CLASSIFY_BATCH = 20;
// Built from the single source of truth (SHELF_CATEGORIES, state.js) so the
// prompt's allowed list never drifts from the validator.
var CLASSIFY_SYSTEM =
  'You are a librarian assigning each book to EXACTLY ONE shelf category from '
  + 'this fixed list (choose the single closest):\n- '
  + SHELF_CATEGORIES.join('\n- ') + '\n\n'
  + 'Rules:\n'
  + '- Use the EXACT category text above. Never invent a category outside the list.\n'
  + '- If a "subjects:" hint is given for a book, weigh it heavily.\n'
  + '- If you genuinely cannot tell, use "' + CATEGORY_UNCATEGORIZED + '".\n\n'
  + 'Output ONLY a JSON object, NO prose, NO markdown fences, exactly:\n'
  + '{"classifications":[{"index":1,"category":"History"}]}\n'
  + 'One object per input book, echoing its 1-based index. Output every book.';

// Collect the text blocks from an Anthropic Messages response (mirror segmentDoc).
function collectClaudeText(data) {
  var blocks = data && data.content;
  var text = '';
  var i;
  if (blocks && blocks.length) {
    for (i = 0; i < blocks.length; i = i + 1) {
      var b = blocks[i];
      if (b && b.type === 'text' && typeof b.text === 'string') { text = text + b.text; }
    }
  }
  return text;
}

// Tolerant JSON parse: direct, then brace-substring fallback (mirror segmentDoc).
function parseLooseJSON(text) {
  if (text === '') { return null; }
  try { return JSON.parse(text); }
  catch (e) {
    var st = text.indexOf('{');
    var en = text.lastIndexOf('}');
    if (st !== -1 && en !== -1 && en > st) {
      try { return JSON.parse(text.substring(st, en + 1)); }
      catch (e2) { return null; }
    }
    return null;
  }
}

// Build the user prompt for one batch: a 1-based numbered list of
// "N. Title -- Author" with an optional "[subjects: ...]" hint for books that
// carry rawCategories (the BISAC strings the keyword map could not place).
function buildClassifyPrompt(batch) {
  var lines = 'Classify these books. Reply with one classification per index.\n\n';
  var i, b, line, subj;
  for (i = 0; i < batch.length; i = i + 1) {
    b = batch[i] || {};
    line = (i + 1) + '. ' + (b.title || '(untitled)');
    if (b.author) { line = line + ' — ' + b.author; }
    if (b.rawCategories instanceof Array && b.rawCategories.length > 0) {
      subj = b.rawCategories.join('; ');
      line = line + ' [subjects: ' + subj + ']';
    }
    lines = lines + line + '\n';
  }
  return lines;
}

// Apply one batch's parsed response into result{bookId:category}. Validates
// each category against the 17+Uncategorized (unknown -> Uncategorized) and
// maps back by 1-based index. Any batch book the model omitted, plus the whole
// batch on a null/garbled response, default to CATEGORY_UNCATEGORIZED.
function applyClassifyBatch(batch, data, result) {
  var i, b;
  var parsed = data ? parseLooseJSON(collectClaudeText(data)) : null;
  var arr = (parsed && parsed.classifications instanceof Array) ? parsed.classifications : [];
  // seed every batch book to Uncategorized; valid model answers overwrite below
  for (i = 0; i < batch.length; i = i + 1) {
    if (batch[i] && batch[i].id) { result[batch[i].id] = CATEGORY_UNCATEGORIZED; }
  }
  for (i = 0; i < arr.length; i = i + 1) {
    var item = arr[i];
    if (!item || typeof item !== 'object') { continue; }
    var idx = (typeof item.index === 'number') ? (item.index - 1) : -1;
    if (idx < 0 || idx >= batch.length) { continue; }
    b = batch[idx];
    if (!b || !b.id) { continue; }
    result[b.id] = isValidCategoryLabel(item.category) ? item.category : CATEGORY_UNCATEGORIZED;
  }
}

// Classify an array of books via the proxy in sequential batches. Calls back
// with a map { bookId: category } covering EVERY input book (a label or
// Uncategorized -- never null). Caching/persisting is the caller's job (2C).
// Empty input -> empty map, no network call.
function classifyBooksViaLLM(books, callback) {
  var result = {};
  var list = (books instanceof Array) ? books : [];
  function finish() { if (typeof callback === 'function') { callback(result); } }
  if (list.length === 0) { finish(); return; }
  function processBatch(start) {
    if (start >= list.length) { finish(); return; }
    var batch = list.slice(start, start + CLASSIFY_BATCH);
    var payload = {
      model:       CLASSIFY_MODEL,
      max_tokens:  1024,
      temperature: 0,
      system:      CLASSIFY_SYSTEM,
      messages:    [ { role: 'user', content: buildClassifyPrompt(batch) } ]
    };
    fetch(CLAUDE_PROXY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
      body:    JSON.stringify(payload)
    }).then(function (res) {
      return res.ok ? res.json() : null;
    }, function () { return null; })
      .then(function (data) {
        applyClassifyBatch(batch, data, result);
        processBatch(start + CLASSIFY_BATCH);
      }, function () {
        applyClassifyBatch(batch, null, result);
        processBatch(start + CLASSIFY_BATCH);
      });
  }
  processBatch(0);
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

// =====================================================================
// Alive Yumi -- voice-out (TTS playback). playLine(text, onStart, onEnd)
// speaks a gate-PASSED line via the ElevenLabs proxy (x-praxis-key gated).
// Per-utterance in-memory cache reuses an object URL on replay (no re-fetch,
// no budget spend). A soft daily budget (ls-backed, resets per day, mirrors
// the gate's _yumiGateBudgetSpend) caps cost; over budget -> skip audio
// silently (render-only, no error). onStart fires when audio begins, onEnd
// when it ends/fails, so the caller drives Bloom. The voiceOn pref is checked
// by the caller (yumi-ui.js isVoiceOn); playLine assumes voice is wanted.
// =====================================================================
var ELEVENLABS_PROXY_URL = '/.netlify/functions/elevenlabs-proxy';
var TTS_DAILY_CAP = 120;
var _ttsCache = {};      // text -> object URL (session-lived)
var _ttsAudio = null;    // the single active Audio element

function _ttsBudgetSpend() {
  var rec = ls('praxis_tts_budget', { day: '', count: 0 });
  var now = new Date();
  var day = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  if (!rec || rec.day !== day) { rec = { day: day, count: 0 }; }
  if (rec.count >= TTS_DAILY_CAP) { sv('praxis_tts_budget', rec); return false; }
  rec.count = rec.count + 1;
  sv('praxis_tts_budget', rec);
  return true;
}

function _ttsPlayUrl(url, onStart, onEnd) {
  // Stop any line currently speaking before starting the next.
  if (_ttsAudio) {
    try { _ttsAudio.pause(); } catch (e) {}
    _ttsAudio = null;
  }
  var audio = new Audio(url);
  _ttsAudio = audio;
  var settled = false;
  function done() {
    if (settled) { return; }
    settled = true;
    if (_ttsAudio === audio) { _ttsAudio = null; }
    if (typeof onEnd === 'function') { onEnd(); }
  }
  audio.addEventListener('playing', function () {
    if (typeof onStart === 'function') { onStart(); }
  });
  audio.addEventListener('ended', done);
  audio.addEventListener('error', done);
  var p = audio.play();
  if (p && typeof p.then === 'function') {
    p.then(null, function () { done(); });   // autoplay blocked / decode error
  }
}

function playLine(text, onStart, onEnd) {
  var t = (typeof text === 'string') ? text.replace(/^\s+|\s+$/g, '') : '';
  if (t === '') { if (typeof onEnd === 'function') { onEnd(); } return; }

  // Cache hit -> replay without a fetch or a budget spend.
  if (_ttsCache[t]) {
    _ttsPlayUrl(_ttsCache[t], onStart, onEnd);
    return;
  }

  // Over the soft daily budget -> render-only, skip audio silently.
  if (!_ttsBudgetSpend()) {
    if (typeof onEnd === 'function') { onEnd(); }
    return;
  }

  fetch(ELEVENLABS_PROXY_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
    body:    JSON.stringify({ text: t })
  }).then(function (res) {
    if (!res || !res.ok) { return null; }
    return res.blob();
  }).then(function (blob) {
    if (!blob) { if (typeof onEnd === 'function') { onEnd(); } return; }
    var url = URL.createObjectURL(blob);
    _ttsCache[t] = url;
    _ttsPlayUrl(url, onStart, onEnd);
  }, function () {
    // network / proxy / decode error -> stay silent, no chrome.
    if (typeof onEnd === 'function') { onEnd(); }
  });
}

// ═══════════════════════════════════════════════════════════════════════
// W6.5 — SOCIAL DATA LAYER (publish projections + write-through + seeds).
// v8-compat Firestore throughout, matching the loaders above. Cross-user
// READ paths (discovery / other-profile / interact loaders) land in Stage 2;
// this block is publish/unpublish, the freshness:"live" write-through, and
// the console-only seed fixtures. No cloud functions, no new infrastructure.
// ═══════════════════════════════════════════════════════════════════════

// Resolve the public name a reader publishes under. The first-publish identity
// question (pen name vs display name) is rendered in Stage 2; it persists the
// answer via sv('praxis_publish_identity', 'pen'|'display'). Here we read that
// stored choice and map it against the profile. Absent a stored choice we
// prefer the pen name when one exists, else the display override / auth name.
// Never invents a name: falls back to the generic 'A reader' only if the reader
// truly has none set (real publish flow forces a name first).
function praxisResolvePublicName(uid) {
  var prof = (typeof getProfile === 'function') ? getProfile(uid) : null;
  var user = getCurrentUser();
  var choice = ls('praxis_publish_identity', '');
  var pen = (prof && prof.penName) ? prof.penName : '';
  var disp = (prof && prof.displayNameOverride)
    ? prof.displayNameOverride
    : ((user && user.displayName) ? user.displayName : '');
  if (choice === 'pen' && pen) { return pen; }
  if (choice === 'display' && (disp || pen)) { return disp || pen; }
  return pen || disp || 'A reader';
}

// Build the public projection for an arc from the REAL render-path content:
// gather this arc's sub-theories exactly as renderArcDetail does (iterate
// state.subTheories, filter by arcId), order by createdAt for a stable public
// sequence, and project ONLY the public register (bodyPublic). bodyIntellectual
// and every private register are never read here. Sub-theories with an empty
// header are skipped so the commons never shows a blank stub. Returns null when
// the arc is absent. Timestamps + walkedBy are stamped by the writer, not here.
function buildPublishedArcDoc(uid, arcId, opts) {
  var arc = (state.arcs && state.arcs[arcId]) ? state.arcs[arcId] : null;
  if (!arc) { return null; }
  var o = opts || {};
  var list = [];
  var k;
  if (state.subTheories) {
    for (k in state.subTheories) {
      if (Object.prototype.hasOwnProperty.call(state.subTheories, k)) {
        var st = state.subTheories[k];
        if (st && st.arcId === arcId &&
            typeof st.header === 'string' &&
            st.header.replace(/^\s+|\s+$/g, '') !== '') {
          list.push(st);
        }
      }
    }
  }
  list.sort(function (a, b) {
    var ac = (typeof a.createdAt === 'number') ? a.createdAt : 0;
    var bc = (typeof b.createdAt === 'number') ? b.createdAt : 0;
    if (ac !== bc) { return ac - bc; }
    return ('' + a.id).localeCompare('' + b.id);
  });
  var subs = [];
  var i;
  for (i = 0; i < list.length; i = i + 1) {
    subs.push({
      header: list[i].header || '',
      body:   (typeof list[i].bodyPublic === 'string') ? list[i].bodyPublic : ''
    });
  }
  return {
    title:            (typeof arc.title === 'string') ? arc.title : '',
    subTheories:      subs,
    tags:             (o.tags instanceof Array) ? o.tags : [],
    authorUid:        uid,
    authorPublicName: praxisResolvePublicName(uid),
    freshness:        (o.freshness === 'live') ? 'live' : 'frozen',
    seed:             (o.seed === true)
  };
}

// publishArc: explicit opt-in publish. Writes publishedArcs/{arcId} (merge, so
// walkedBy + the original publishedAt survive a re-publish) and upserts the
// author's publicProfiles doc (arrayUnion adds the arc id). Flips the LOCAL arc
// flags (published / freshness / publishTags) so the write-through guard and the
// own-profile UI see the published state, and persists them via the existing
// userArcs sync. opts: { freshness:'frozen'|'live', tags:[...], identity:'pen'|'display' }.
function publishArc(arcId, opts, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  var o = opts || {};
  var user = getCurrentUser();
  if (!user || !user.uid) {
    finish({ status: 'error', error: new Error('publishArc: not signed in') });
    return;
  }
  var uid = user.uid;
  var arc = (state.arcs && state.arcs[arcId]) ? state.arcs[arcId] : null;
  if (!arc || arc.userId !== uid) {
    finish({ status: 'error', error: new Error('publishArc: arc not found or not owned') });
    return;
  }
  // First publish stores the identity choice so we never re-ask.
  if (o.identity === 'pen' || o.identity === 'display') {
    sv('praxis_publish_identity', o.identity);
  }
  var freshness = (o.freshness === 'live') ? 'live' : 'frozen';
  var tags = (o.tags instanceof Array) ? o.tags : [];
  var doc = buildPublishedArcDoc(uid, arcId, { freshness: freshness, tags: tags, seed: false });
  if (!doc) {
    finish({ status: 'error', error: new Error('publishArc: projection build failed') });
    return;
  }
  var firstPublish = (arc.published !== true);
  doc.revisedAt = firebase.firestore.FieldValue.serverTimestamp();
  if (firstPublish) {
    // Stamp original publish time + seed the counter ONLY on first publish; a
    // merge write on re-publish preserves both (walkedBy is never rewritten).
    doc.publishedAt = firebase.firestore.FieldValue.serverTimestamp();
    doc.walkedBy    = 0;
  }
  try {
    firebase.firestore()
      .collection('publishedArcs')
      .doc(arcId)
      .set(doc, { merge: true })
      .then(function () {
        // WRITE 1 committed -> the arc is PUBLIC. loadCommonsFeed reads
        // publishedArcs directly, so the publish is DONE here: persist the local
        // published flags and report success NOW, independent of WRITE 2 below.
        // Nothing after this point may roll the publish back.
        arc.published   = true;
        arc.freshness   = freshness;
        arc.publishTags = tags;
        if (typeof markArcsDirty === 'function') { markArcsDirty(); }
        if (typeof saveState === 'function') { saveState(); }
        finish({ status: 'ok' });

        // WRITE 2 (best-effort follow-on): the public-profile projection powers
        // #reader, NOT the commons feed. It has its OWN .catch so a failure never
        // touches the publish result, the flag, or the button; publicProfiles
        // re-derives on the next publish/edit. Logged, never silent.
        var prof = (typeof getProfile === 'function') ? getProfile(uid) : null;
        firebase.firestore()
          .collection('publicProfiles')
          .doc(uid)
          .set({
            publicName:      praxisResolvePublicName(uid),
            tagline:         (prof && prof.tagline) ? prof.tagline : '',
            publishedArcIds: firebase.firestore.FieldValue.arrayUnion(arcId),
            updatedAt:       firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true })
          .catch(function (perr) {
            console.error('publishArc: publicProfiles follow-on failed (publish still succeeded)', perr);
          });
      })
      .catch(function (err) {
        // WRITE 1 failed -> the real publish failure (the arc did NOT reach the
        // commons). Surface it AND log it so a future failure is visible.
        console.error('publishArc: publishedArcs write failed', err);
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// unpublishArc: deletes the projection and drops the arc id from the author's
// publicProfiles list (arrayRemove). Clears the LOCAL published flag so the
// write-through guard skips it thereafter. freshness/publishTags are left as-is
// (harmless — the guard checks published first).
function unpublishArc(arcId, callback) {
  var done = false;
  function finish(result) {
    if (done) return;
    done = true;
    if (typeof callback === 'function') callback(result);
  }
  var user = getCurrentUser();
  if (!user || !user.uid) {
    finish({ status: 'error', error: new Error('unpublishArc: not signed in') });
    return;
  }
  var uid = user.uid;
  var arc = (state.arcs && state.arcs[arcId]) ? state.arcs[arcId] : null;
  try {
    firebase.firestore()
      .collection('publishedArcs')
      .doc(arcId)
      .delete()
      .then(function () {
        return firebase.firestore()
          .collection('publicProfiles')
          .doc(uid)
          .set({
            publishedArcIds: firebase.firestore.FieldValue.arrayRemove(arcId),
            updatedAt:       firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
      })
      .then(function () {
        if (arc) {
          arc.published = false;
          if (typeof markArcsDirty === 'function') { markArcsDirty(); }
          if (typeof saveState === 'function') { saveState(); }
        }
        finish({ status: 'ok' });
      })
      .catch(function (err) {
        finish({ status: 'error', error: err });
      });
  } catch (e) {
    finish({ status: 'error', error: e });
  }
}

// republishLiveArcs: the freshness:"live" write-through, called from saveState's
// arcsDirty flush. THE GUARD IS CHEAP-FIRST: this only iterates the in-memory
// arc map and issues a Firestore write for arcs flagged published===true &&
// freshness==="live". Unpublished or frozen arcs incur ZERO reads and ZERO
// writes. Each live arc is re-projected and merge-written (preserving walkedBy +
// publishedAt); revisedAt is bumped. Fire-and-forget: never calls saveState (no
// recursion), never re-renders. A failed push simply retries on the next save.
function republishLiveArcs(uid) {
  if (!uid || !state.arcs) { return; }
  var aid;
  for (aid in state.arcs) {
    if (Object.prototype.hasOwnProperty.call(state.arcs, aid)) {
      var arc = state.arcs[aid];
      if (arc && arc.userId === uid &&
          arc.published === true && arc.freshness === 'live') {
        var doc = buildPublishedArcDoc(uid, aid, {
          freshness: 'live',
          tags: (arc.publishTags instanceof Array) ? arc.publishTags : [],
          seed: false
        });
        if (!doc) { continue; }
        doc.revisedAt = firebase.firestore.FieldValue.serverTimestamp();
        try {
          firebase.firestore()
            .collection('publishedArcs')
            .doc(aid)
            .set(doc, { merge: true })
            .then(function () {}, function () {});
        } catch (e) { /* fire-and-forget; retried on the next save */ }
      }
    }
  }
}

// ── Console-only dev seeds (attached to window, NO UI). Every seeded doc
// carries seed:true and renders with an "Example" badge in Stage 2. Fixed doc
// ids make both directions idempotent: re-seed after clear works; double-seed
// overwrites in place (no duplication). Seeds are authored under the signed-in
// uid (rules require authorUid==caller) but labelled authorPublicName "Praxis".
window.praxisSeedCommons = function () {
  var user = getCurrentUser();
  if (!user || !user.uid) {
    console.warn('praxisSeedCommons: sign in first');
    return;
  }
  var uid = user.uid;
  var ts = firebase.firestore.FieldValue.serverTimestamp;
  var db = firebase.firestore();

  var seedArcs = [
    {
      id: 'seed-arc-1',
      title: 'The Hidden Curriculum of the Bell Schedule',
      freshness: 'frozen',
      tags: ['critical pedagogy', 'schooling'],
      subTheories: [
        {
          header: 'Time discipline is the first lesson',
          body: 'Before a student learns a single fact, they learn to move when a bell says move. The schedule teaches obedience to abstract time more reliably than any syllabus teaches its subject.'
        },
        {
          header: 'The forty-seven-minute idea',
          body: 'Any thought that takes longer than one period to develop is structurally discouraged. Depth becomes a scheduling error.'
        }
      ]
    },
    {
      id: 'seed-arc-2',
      title: 'Reading as Rehearsal',
      freshness: 'live',
      tags: ['reading', 'practice'],
      subTheories: [
        {
          header: 'Annotation is rehearsal for a conversation',
          body: 'A margin note is half of a dialogue waiting for its other half. Reading alone is rehearsal; the commons is the performance.'
        },
        {
          header: 'Books answer each other',
          body: 'No text is finished until another reader builds on it. A library is not a warehouse; it is an argument conducted slowly.'
        }
      ]
    },
    {
      id: 'seed-arc-3',
      title: 'What a Question Is For',
      freshness: 'frozen',
      tags: ['dialogue', 'pedagogy'],
      subTheories: [
        {
          header: 'A real question transfers power',
          body: 'Asking a genuine question hands the other person the authority to change your mind. Most classroom questions are tests wearing a question’s clothing.'
        },
        {
          header: 'The answerable prompt',
          body: 'One good question a person can actually answer beats five that merely display the asker.'
        }
      ]
    }
  ];

  var seedArcIds = [];
  var pending = 0;
  var i;

  function afterArcs() {
    // Add the seed arc ids to this uid's public profile (non-destructive: does
    // NOT overwrite publicName — discovery/interact read authorPublicName off
    // each arc doc). Then write the seed build-on + question.
    db.collection('publicProfiles').doc(uid).set({
      publishedArcIds: firebase.firestore.FieldValue.arrayUnion(
        'seed-arc-1', 'seed-arc-2', 'seed-arc-3'
      ),
      updatedAt: ts()
    }, { merge: true }).then(function () {
      return db.collection('buildOns').doc('seed-buildon-1').set({
        fromUid:       uid,
        fromPublicName: 'Praxis',
        targetArcId:   'seed-arc-1',
        targetAnchor:  '0',
        type:          'build-on',
        body:          'This extends past school: the workday inherits the bell schedule’s logic. The hidden curriculum graduates with us.',
        createdAt:     ts(),
        seed:          true
      });
    }).then(function () {
      return db.collection('buildOns').doc('seed-question-1').set({
        fromUid:       uid,
        fromPublicName: 'Praxis',
        targetArcId:   'seed-arc-1',
        targetAnchor:  '',
        type:          'question',
        body:          'Where did the bell-schedule model originally come from — factory shifts, or something older?',
        createdAt:     ts(),
        seed:          true
      });
    }).then(function () {
      console.log('praxisSeedCommons: done — 3 arcs, 1 build-on, 1 question seeded under ' + uid);
    }).catch(function (err) {
      console.warn('praxisSeedCommons: profile/buildOn write failed', err);
    });
  }

  for (i = 0; i < seedArcs.length; i = i + 1) {
    (function (sa) {
      seedArcIds.push(sa.id);
      pending = pending + 1;
      db.collection('publishedArcs').doc(sa.id).set({
        title:            sa.title,
        subTheories:      sa.subTheories,
        tags:             sa.tags,
        authorUid:        uid,
        authorPublicName: 'Praxis',
        freshness:        sa.freshness,
        seed:             true,
        walkedBy:         0,
        publishedAt:      ts(),
        revisedAt:        ts()
      }).then(function () {
        pending = pending - 1;
        if (pending === 0) { afterArcs(); }
      }).catch(function (err) {
        pending = pending - 1;
        console.warn('praxisSeedCommons: arc ' + sa.id + ' write failed', err);
        if (pending === 0) { afterArcs(); }
      });
    })(seedArcs[i]);
  }
};

// praxisClearSeeds: deletes this uid's seed docs (seed==true) across
// publishedArcs + buildOns and removes the seed arc ids from publicProfiles.
// Queries are constrained to the caller's own docs (authorUid/fromUid == uid)
// so deletes stay rules-compliant. Idempotent: safe to run when nothing exists.
window.praxisClearSeeds = function () {
  var user = getCurrentUser();
  if (!user || !user.uid) {
    console.warn('praxisClearSeeds: sign in first');
    return;
  }
  var uid = user.uid;
  var db = firebase.firestore();

  db.collection('publishedArcs')
    .where('authorUid', '==', uid)
    .where('seed', '==', true)
    .get()
    .then(function (snap) {
      var jobs = [];
      snap.forEach(function (d) { jobs.push(d.ref.delete()); });
      return Promise.all(jobs);
    })
    .then(function () {
      return db.collection('buildOns')
        .where('fromUid', '==', uid)
        .where('seed', '==', true)
        .get();
    })
    .then(function (snap) {
      var jobs = [];
      snap.forEach(function (d) { jobs.push(d.ref.delete()); });
      return Promise.all(jobs);
    })
    .then(function () {
      return db.collection('publicProfiles').doc(uid).set({
        publishedArcIds: firebase.firestore.FieldValue.arrayRemove(
          'seed-arc-1', 'seed-arc-2', 'seed-arc-3'
        ),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    })
    .then(function () {
      console.log('praxisClearSeeds: done — seed docs removed for ' + uid);
    })
    .catch(function (err) {
      console.warn('praxisClearSeeds: failed', err);
    });
};

// ═══════════════════════════════════════════════════════════════════════
// W6.5 STAGE 2 — SOCIAL READ/INTERACT LOADERS (discovery / other-profile /
// interact). All v8-compat, typed-callback (found/absent/error or ok/error).
// Query shapes are RULES-CONSTRAINED so a query never asks for a doc the
// caller cannot read: public build-ons via type filter; own questions via
// fromUid; owner reads all buildOns on an arc it authored. Equality-only
// filters (+ one single-field orderBy on the feed) — no composite indexes.
// Every path fails safe via .catch -> {status:'error'}; views degrade to a
// quiet message, never a crash.
// ═══════════════════════════════════════════════════════════════════════

// Firestore Timestamp | {seconds} | epoch-ms -> epoch-ms (0 when absent).
function praxisTsMillis(v) {
  if (v && typeof v.toMillis === 'function') { return v.toMillis(); }
  if (v && typeof v.seconds === 'number') { return v.seconds * 1000; }
  if (typeof v === 'number') { return v; }
  return 0;
}

function genBuildOnId() {
  return 'buildon_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// Discovery feed: the newest published arcs, capped at 12. Single-field
// orderBy (auto-indexed). Returns { status:'ok', arcs:[{id,data}] } or error.
function loadCommonsFeed(callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  try {
    firebase.firestore()
      .collection('publishedArcs')
      .orderBy('publishedAt', 'desc')
      .limit(12)
      .get()
      .then(function (snap) {
        var arr = [];
        snap.forEach(function (d) { arr.push({ id: d.id, data: d.data() }); });
        finish({ status: 'ok', arcs: arr });
      })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// One published-arc projection by id. found/absent/error.
function loadPublishedArc(arcId, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  if (!arcId) { finish({ status: 'error', error: new Error('loadPublishedArc: missing arcId') }); return; }
  try {
    firebase.firestore()
      .collection('publishedArcs')
      .doc(arcId)
      .get()
      .then(function (doc) {
        if (doc && doc.exists) { finish({ status: 'found', data: doc.data() }); }
        else { finish({ status: 'absent' }); }
      })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// A reader's public profile projection. found/absent/error.
function loadPublicProfile(uid, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  if (!uid) { finish({ status: 'error', error: new Error('loadPublicProfile: missing uid') }); return; }
  try {
    firebase.firestore()
      .collection('publicProfiles')
      .doc(uid)
      .get()
      .then(function (doc) {
        if (doc && doc.exists) { finish({ status: 'found', data: doc.data() }); }
        else { finish({ status: 'absent' }); }
      })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// All published arcs authored by uid, client-sorted newest-first (avoids a
// where+orderBy composite index). { status:'ok', arcs:[{id,data}] } or error.
function loadArcsForAuthor(uid, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  if (!uid) { finish({ status: 'error', error: new Error('loadArcsForAuthor: missing uid') }); return; }
  try {
    firebase.firestore()
      .collection('publishedArcs')
      .where('authorUid', '==', uid)
      .get()
      .then(function (snap) {
        var arr = [];
        snap.forEach(function (d) { arr.push({ id: d.id, data: d.data() }); });
        arr.sort(function (a, b) {
          return praxisTsMillis(b.data && b.data.publishedAt) - praxisTsMillis(a.data && a.data.publishedAt);
        });
        finish({ status: 'ok', arcs: arr });
      })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// Build-ons + visible questions for an arc, via RULES-CONSTRAINED queries.
// isAuthor === true (the signed-in viewer authored the arc): one arc-scoped
// query returns everything the author may read (public build-ons + all
// questions on their arc). Otherwise: public build-ons (type filter) + the
// viewer's OWN questions on this arc (fromUid). Returns
// { status:'ok', buildOns:[{id,data}], questions:[{id,data}] } or error.
function loadBuildOnsForArc(arcId, isAuthor, uid, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  if (!arcId) { finish({ status: 'error', error: new Error('loadBuildOnsForArc: missing arcId') }); return; }
  var db = firebase.firestore();

  function split(snap, out) {
    snap.forEach(function (d) {
      var data = d.data();
      if (data && data.type === 'question') { out.questions.push({ id: d.id, data: data }); }
      else { out.buildOns.push({ id: d.id, data: data }); }
    });
  }
  function bySeq(a, b) { return praxisTsMillis(a.data && a.data.createdAt) - praxisTsMillis(b.data && b.data.createdAt); }

  try {
    if (isAuthor === true) {
      // Author reads everything on their own arc in one arc-scoped query.
      db.collection('buildOns').where('targetArcId', '==', arcId).get()
        .then(function (snap) {
          var out = { buildOns: [], questions: [] };
          split(snap, out);
          out.buildOns.sort(bySeq); out.questions.sort(bySeq);
          finish({ status: 'ok', buildOns: out.buildOns, questions: out.questions });
        })
        .catch(function (err) { finish({ status: 'error', error: err }); });
    } else {
      // Non-author: public build-ons + own questions on this arc, two queries.
      var out2 = { buildOns: [], questions: [] };
      var pending = 2;
      var failed = null;
      function step() {
        pending = pending - 1;
        if (pending === 0) {
          if (failed) { finish({ status: 'error', error: failed }); return; }
          out2.buildOns.sort(bySeq); out2.questions.sort(bySeq);
          finish({ status: 'ok', buildOns: out2.buildOns, questions: out2.questions });
        }
      }
      db.collection('buildOns')
        .where('targetArcId', '==', arcId).where('type', '==', 'build-on').get()
        .then(function (snap) { snap.forEach(function (d) { out2.buildOns.push({ id: d.id, data: d.data() }); }); step(); })
        .catch(function (err) { failed = err; step(); });
      if (uid) {
        db.collection('buildOns')
          .where('targetArcId', '==', arcId).where('fromUid', '==', uid).get()
          .then(function (snap) {
            snap.forEach(function (d) { var dd = d.data(); if (dd && dd.type === 'question') { out2.questions.push({ id: d.id, data: dd }); } });
            step();
          })
          .catch(function (err) { failed = err; step(); });
      } else { step(); }
    }
  } catch (e) { finish({ status: 'error', error: e }); }
}

// Post a build-on or a question. fields: { targetArcId, targetAnchor, type,
// body }. Stamps fromUid + the resolved public identity. Owner-gated by rules
// (fromUid == caller). type coerced to the two legal values.
function postBuildOn(fields, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  var f = fields || {};
  var user = getCurrentUser();
  if (!user || !user.uid) { finish({ status: 'error', error: new Error('postBuildOn: not signed in') }); return; }
  if (!f.targetArcId) { finish({ status: 'error', error: new Error('postBuildOn: missing targetArcId') }); return; }
  var body = (typeof f.body === 'string') ? f.body.replace(/^\s+|\s+$/g, '') : '';
  if (body === '') { finish({ status: 'error', error: new Error('postBuildOn: empty body') }); return; }
  var type = (f.type === 'question') ? 'question' : 'build-on';
  var id = genBuildOnId();
  try {
    firebase.firestore()
      .collection('buildOns')
      .doc(id)
      .set({
        fromUid:        user.uid,
        fromPublicName: praxisResolvePublicName(user.uid),
        targetArcId:    f.targetArcId,
        targetAnchor:   (typeof f.targetAnchor === 'string') ? f.targetAnchor : '',
        type:           type,
        body:           body,
        createdAt:      firebase.firestore.FieldValue.serverTimestamp(),
        seed:           false
      })
      .then(function () { finish({ status: 'ok', id: id }); })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// Anonymous walk: raise walkedBy by exactly 1 (merge, touching ONLY walkedBy —
// the one field any authed user may change, per the rules). Fire-and-forget.
function incrementWalkedBy(arcId, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  if (!arcId) { finish({ status: 'error', error: new Error('incrementWalkedBy: missing arcId') }); return; }
  try {
    firebase.firestore()
      .collection('publishedArcs')
      .doc(arcId)
      .set({ walkedBy: firebase.firestore.FieldValue.increment(1) }, { merge: true })
      .then(function () { finish({ status: 'ok' }); })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// Follow edge id is deterministic: followerUid_targetUid (one edge per pair).
function followEdgeId(followerUid, targetUid) { return followerUid + '_' + targetUid; }

function followReader(targetUid, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  var user = getCurrentUser();
  if (!user || !user.uid) { finish({ status: 'error', error: new Error('followReader: not signed in') }); return; }
  if (!targetUid || targetUid === user.uid) { finish({ status: 'error', error: new Error('followReader: bad target') }); return; }
  try {
    firebase.firestore()
      .collection('follows')
      .doc(followEdgeId(user.uid, targetUid))
      .set({
        followerUid: user.uid,
        targetUid:   targetUid,
        createdAt:   firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(function () { finish({ status: 'ok' }); })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

function unfollowReader(targetUid, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  var user = getCurrentUser();
  if (!user || !user.uid) { finish({ status: 'error', error: new Error('unfollowReader: not signed in') }); return; }
  if (!targetUid) { finish({ status: 'error', error: new Error('unfollowReader: bad target') }); return; }
  try {
    firebase.firestore()
      .collection('follows')
      .doc(followEdgeId(user.uid, targetUid))
      .delete()
      .then(function () { finish({ status: 'ok' }); })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// Am I following targetUid? { status:'ok', following:bool } or error.
function loadFollowEdge(targetUid, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  var user = getCurrentUser();
  if (!user || !user.uid || !targetUid) { finish({ status: 'ok', following: false }); return; }
  try {
    firebase.firestore()
      .collection('follows')
      .doc(followEdgeId(user.uid, targetUid))
      .get()
      .then(function (doc) { finish({ status: 'ok', following: !!(doc && doc.exists) }); })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// Readers who follow uid (edges targeting you — readable by the target per the
// rules). { status:'ok', followerUids:[...] } or error.
function loadFollowers(uid, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  if (!uid) { finish({ status: 'error', error: new Error('loadFollowers: missing uid') }); return; }
  try {
    firebase.firestore()
      .collection('follows')
      .where('targetUid', '==', uid)
      .get()
      .then(function (snap) {
        var arr = [];
        snap.forEach(function (d) { var dd = d.data(); if (dd && dd.followerUid) { arr.push(dd.followerUid); } });
        finish({ status: 'ok', followerUids: arr });
      })
      .catch(function (err) { finish({ status: 'error', error: err }); });
  } catch (e) { finish({ status: 'error', error: e }); }
}

// Aggregate the own-profile social counters from real data:
//   walkedByTotal  = sum of walkedBy across your published arcs
//   buildOnTotal   = build-ons (type=='build-on') across your published arcs
//   followers      = [{uid, name}] of readers who follow you (name resolved
//                    from their public profile; falls back to a short id)
// Follower COUNT is intentionally NOT surfaced as primary UI — the list is.
function loadOwnProfileSocial(uid, callback) {
  var done = false;
  function finish(result) { if (done) return; done = true; if (typeof callback === 'function') callback(result); }
  if (!uid) { finish({ status: 'error', error: new Error('loadOwnProfileSocial: missing uid') }); return; }
  var out = { status: 'ok', walkedByTotal: 0, buildOnTotal: 0, followers: [] };

  loadArcsForAuthor(uid, function (arcRes) {
    var arcIds = [];
    if (arcRes && arcRes.status === 'ok') {
      var i;
      for (i = 0; i < arcRes.arcs.length; i = i + 1) {
        arcIds.push(arcRes.arcs[i].id);
        var wb = arcRes.arcs[i].data && arcRes.arcs[i].data.walkedBy;
        out.walkedByTotal = out.walkedByTotal + ((typeof wb === 'number') ? wb : 0);
      }
    }
    // Count build-ons per arc, then resolve followers. Fire the build-on counts
    // and the follower load; assemble when all return.
    var pending = arcIds.length + 1;
    function step() { pending = pending - 1; if (pending === 0) { finish(out); } }
    if (arcIds.length === 0) { pending = 1; }
    var j;
    for (j = 0; j < arcIds.length; j = j + 1) {
      (function (aid) {
        firebase.firestore()
          .collection('buildOns')
          .where('targetArcId', '==', aid).where('type', '==', 'build-on').get()
          .then(function (snap) { out.buildOnTotal = out.buildOnTotal + snap.size; step(); })
          .catch(function () { step(); });
      })(arcIds[j]);
    }
    loadFollowers(uid, function (fRes) {
      if (fRes && fRes.status === 'ok' && fRes.followerUids.length) {
        var fp = fRes.followerUids.length;
        var k;
        for (k = 0; k < fRes.followerUids.length; k = k + 1) {
          (function (fuid) {
            loadPublicProfile(fuid, function (pRes) {
              var nm = (pRes && pRes.status === 'found' && pRes.data && pRes.data.publicName)
                ? pRes.data.publicName : ('reader ' + fuid.slice(0, 6));
              out.followers.push({ uid: fuid, name: nm });
              fp = fp - 1;
              if (fp === 0) { step(); }
            });
          })(fRes.followerUids[k]);
        }
      } else { step(); }
    });
  });
}

console.log('integrations.js loaded');
