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
// the two never touch. profile/readerModel got the same OUTGOING latch in
// F-DL3/F-DL4 (shipped, 9914dd9/cfd168f). FX-1 now adds the INCOMING guard
// (pendingSync family, state.js) to arcs/subTheories/themes/artifacts — the R1
// residual this block's own history named; notebook's incoming guard is the
// named follow-up FX-1b (its creation sites span views.js/import-capture.js).
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

// F-DL4: reset ALL ten cloud-sync latches on a same-tab account switch. On an
// A->B switch clearUserState() (state.js) wipes state.* but these module-global
// latches survive, so B would inherit A's "already loaded / write-pending" state
// and B's first outgoing .set() could clobber B's not-yet-loaded remote data (or
// re-fire A's deferred single-doc write). clearUserState (loaded BEFORE this file)
// calls this via a typeof guard -- a runtime-only cross-file reference, so the vars
// stay in this file's scope. NOTE: this closes the common switch case; a stale
// in-flight A-read callback re-setting a latch after the reset is a narrower
// PRE-EXISTING race (the load callbacks carry no uid-guard) -- tracked as F-DL5,
// not introduced here.
function resetSyncLatches() {
  arcsLoaded              = false;
  notebookLoaded          = false;
  subTheoriesLoaded       = false;
  themesLoaded            = false;
  artifactsLoaded         = false;
  booksLoaded             = false;
  profileLoaded           = false;
  readerModelLoaded       = false;
  profileWritePending     = false;
  readerModelWritePending = false;
}

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
        // FX-1: the remote id set, computed BEFORE the clear-loop so the guard
        // can distinguish "absent from remote because created locally and not
        // yet synced" (KEEP) from "absent because deleted server-side" (DROP).
        // FX-1c splat-begin:arcs
        var remoteArcs = (arcResult.data && arcResult.data.arcs)
          ? arcResult.data.arcs
          : {};
        var arcRemoteHas = {};
        var rhaid;
        for (rhaid in remoteArcs) {
          if (Object.prototype.hasOwnProperty.call(remoteArcs, rhaid)) { arcRemoteHas[rhaid] = true; }
        }
        // FX-1c: ids the user DELETED whose remote removal may still be in
        // flight. A stale remote doc still lists them -- never copy them back
        // (resurrect). Absent from remote = removal confirmed -> clear the mark.
        // Mirrors mergeRemoteBookDoc's delSet for books.
        var arcDelPend = (typeof getPendingDeletes === 'function') ? getPendingDeletes('arcs', u.uid) : [];
        var arcDelSet = {}, arcDk, arcConfirmed = [];
        for (arcDk = 0; arcDk < arcDelPend.length; arcDk++) {
          arcDelSet[arcDelPend[arcDk]] = true;
          if (!arcRemoteHas[arcDelPend[arcDk]]) { arcConfirmed.push(arcDelPend[arcDk]); }
        }
        var aid;
        if (state.arcs) {
          for (aid in state.arcs) {
            if (Object.prototype.hasOwnProperty.call(state.arcs, aid) &&
                state.arcs[aid] && state.arcs[aid].userId === u.uid &&
                !arcRemoteHas[aid] && !isPendingSync('arcs', u.uid, aid)) {
              delete state.arcs[aid];
            }
          }
        }
        var raid;
        for (raid in remoteArcs) {
          if (Object.prototype.hasOwnProperty.call(remoteArcs, raid)) {
            if (arcDelSet[raid]) { if (state.arcs[raid]) { delete state.arcs[raid]; } continue; }   // FX-1c: pending delete, never resurrected
            state.arcs[raid] = remoteArcs[raid];
          }
        }
        if (arcConfirmed.length > 0 && typeof clearPendingDelete === 'function') { clearPendingDelete('arcs', u.uid, arcConfirmed); }   // FX-1c: confirmed
        // FX-1c splat-end:arcs
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
        // P1 Item 4b: retry any deleted-arc unpublish the network refused.
        if (typeof drainArcUnpublishRetries === 'function') { drainArcUnpublishRetries(u.uid); }
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
          // FX-1: remote id set before the clear-loop (see the arcs guard).
          // subTheories are the required pair to arcs — both guards ship in this
          // same commit, so a sub-theory preserved here never points at an arc
          // the (now also guarded) arcs merge wiped.
          // FX-1c splat-begin:subTheories
          var remoteSubs = (stResult.data && stResult.data.subTheories)
            ? stResult.data.subTheories
            : {};
          var stRemoteHas = {};
          var rhsid;
          for (rhsid in remoteSubs) {
            if (Object.prototype.hasOwnProperty.call(remoteSubs, rhsid)) { stRemoteHas[rhsid] = true; }
          }
          // FX-1c: pending-DELETE set (see the arcs splat).
          var stDelPend = (typeof getPendingDeletes === 'function') ? getPendingDeletes('subTheories', u.uid) : [];
          var stDelSet = {}, stDk, stConfirmed = [];
          for (stDk = 0; stDk < stDelPend.length; stDk++) {
            stDelSet[stDelPend[stDk]] = true;
            if (!stRemoteHas[stDelPend[stDk]]) { stConfirmed.push(stDelPend[stDk]); }
          }
          var sid;
          if (state.subTheories) {
            for (sid in state.subTheories) {
              if (Object.prototype.hasOwnProperty.call(state.subTheories, sid)) {
                var lst = state.subTheories[sid];
                if (lst && lst.userId === u.uid &&
                    !stRemoteHas[sid] && !isPendingSync('subTheories', u.uid, sid)) {
                  delete state.subTheories[sid];
                }
              }
            }
          }
          var rsid;
          for (rsid in remoteSubs) {
            if (Object.prototype.hasOwnProperty.call(remoteSubs, rsid)) {
              if (stDelSet[rsid]) { if (state.subTheories[rsid]) { delete state.subTheories[rsid]; } continue; }   // FX-1c
              state.subTheories[rsid] = remoteSubs[rsid];
            }
          }
          if (stConfirmed.length > 0 && typeof clearPendingDelete === 'function') { clearPendingDelete('subTheories', u.uid, stConfirmed); }   // FX-1c
          // FX-1c splat-end:subTheories
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
          // FINISH-CHOREO S1 (B) — CO-GATED (red-team + Preston, 2026-07-21): the frozen-leak
          // sanitize runs ONLY when BOTH loads are authoritative — arcs 'found' AND
          // sub-theories 'found'. `arcResult` is the enclosing arcs-load result (this callback
          // is nested inside it). state.subTheories (which the dual-uniqueness keep-predicate
          // joins against) merged here; state.arcs (which SELECTS which arcs to sanitize)
          // merged in the arcs branch. It must NEVER run when either load is 'absent'/'error':
          // stale/incomplete local state + _sanitizeOneFrozenArc's OWN publishedArcs read
          // succeeding on that same window could remove a legitimately-published entry or
          // auto-unpublish the arc from a transient failure. A destructive op runs on
          // DEFINITIVE data or not at all; it safely retries on the next clean load (ls
          // idempotence marks nothing until a definitive outcome), which strands no one.
          if (arcResult.status === 'found' && typeof sanitizeFrozenPublishedArcs === 'function') {
            sanitizeFrozenPublishedArcs(u.uid);
          }
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
        if (!state.userThemes) { state.userThemes = {}; }
        // FX-1: remote id set before the clear-loop (see the arcs guard).
        // FX-1c splat-begin:themes
        var remoteThemes = (themeResult.data && themeResult.data.userThemes)
          ? themeResult.data.userThemes
          : {};
        var themeRemoteHas = {};
        var rhtid;
        for (rhtid in remoteThemes) {
          if (Object.prototype.hasOwnProperty.call(remoteThemes, rhtid)) { themeRemoteHas[rhtid] = true; }
        }
        // FX-1c: pending-DELETE set (see the arcs splat).
        var thDelPend = (typeof getPendingDeletes === 'function') ? getPendingDeletes('themes', u.uid) : [];
        var thDelSet = {}, thDk, thConfirmed = [];
        for (thDk = 0; thDk < thDelPend.length; thDk++) {
          thDelSet[thDelPend[thDk]] = true;
          if (!themeRemoteHas[thDelPend[thDk]]) { thConfirmed.push(thDelPend[thDk]); }
        }
        var tid;
        if (state.userThemes) {
          for (tid in state.userThemes) {
            if (Object.prototype.hasOwnProperty.call(state.userThemes, tid) &&
                state.userThemes[tid] && state.userThemes[tid].userId === u.uid &&
                !themeRemoteHas[tid] && !isPendingSync('themes', u.uid, tid)) {
              delete state.userThemes[tid];
            }
          }
        }
        var rtid;
        for (rtid in remoteThemes) {
          if (Object.prototype.hasOwnProperty.call(remoteThemes, rtid)) {
            if (thDelSet[rtid]) { if (state.userThemes[rtid]) { delete state.userThemes[rtid]; } continue; }   // FX-1c
            state.userThemes[rtid] = remoteThemes[rtid];
          }
        }
        if (thConfirmed.length > 0 && typeof clearPendingDelete === 'function') { clearPendingDelete('themes', u.uid, thConfirmed); }   // FX-1c
        // FX-1c splat-end:themes
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
        if (!state.bookArtifacts) { state.bookArtifacts = {}; }
        // FX-1: remote key set before the clear-loop. artifacts key by the
        // composite artifactKey(uid,bookId); the pending set stores the same
        // composite string, so the keep-predicate transplants unchanged.
        // FX-1c splat-begin:artifacts
        var remoteArts = (artResult.data && artResult.data.bookArtifacts)
          ? artResult.data.bookArtifacts
          : {};
        var artRemoteHas = {};
        var rhaki;
        for (rhaki in remoteArts) {
          if (Object.prototype.hasOwnProperty.call(remoteArts, rhaki)) { artRemoteHas[rhaki] = true; }
        }
        // FX-1c: pending-DELETE set, keyed by the composite artifactKey (see arcs).
        var artDelPend = (typeof getPendingDeletes === 'function') ? getPendingDeletes('artifacts', u.uid) : [];
        var artDelSet = {}, artDk, artConfirmed = [];
        for (artDk = 0; artDk < artDelPend.length; artDk++) {
          artDelSet[artDelPend[artDk]] = true;
          if (!artRemoteHas[artDelPend[artDk]]) { artConfirmed.push(artDelPend[artDk]); }
        }
        var aki;
        if (state.bookArtifacts) {
          for (aki in state.bookArtifacts) {
            if (Object.prototype.hasOwnProperty.call(state.bookArtifacts, aki) &&
                state.bookArtifacts[aki] && state.bookArtifacts[aki].userId === u.uid &&
                !artRemoteHas[aki] && !isPendingSync('artifacts', u.uid, aki)) {
              delete state.bookArtifacts[aki];
            }
          }
        }
        var raki;
        for (raki in remoteArts) {
          if (Object.prototype.hasOwnProperty.call(remoteArts, raki)) {
            if (artDelSet[raki]) { if (state.bookArtifacts[raki]) { delete state.bookArtifacts[raki]; } continue; }   // FX-1c
            state.bookArtifacts[raki] = remoteArts[raki];
          }
        }
        if (artConfirmed.length > 0 && typeof clearPendingDelete === 'function') { clearPendingDelete('artifacts', u.uid, artConfirmed); }   // FX-1c
        // FX-1c splat-end:artifacts
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
          values:              (rd.values instanceof Array) ? rd.values : [],
          // R9a (AM8): the values-statement prose. Symmetric with the .set() write
          // list (the Firestore-merge gotcha: a sign-in doc bypasses migrate(), so
          // read AND write must both carry it or a second device silently wipes it).
          // Default '' when absent on the remote doc.
          statement:           (typeof rd.statement === 'string') ? rd.statement : '',
          // R-CAPTURE CA-1: the desk's carrying question. Symmetric with the
          // .set() write list (the Firestore-merge gotcha: a sign-in doc bypasses
          // migrate(), so read AND write must both carry it or a second device
          // silently wipes it). Default '' when absent on the remote doc.
          carryingQuestion:    (typeof rd.carryingQuestion === 'string') ? rd.carryingQuestion : ''
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
      .set(buildUserProfileDoc(uid, profile, _fsServerStamp))   // P1 Item 3: the ONE profile payload (export uses it too)
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
  try {
    firebase.firestore()
      .collection('userReaderModel')
      .doc(uid)
      .set(buildUserReaderModelDoc(uid, model, _fsServerStamp))   // P1 Item 3: the ONE reader-model payload (export uses it too)
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

// P1 Item 2 (2026-09-03): ACCOUNT DELETION, END TO END. Replaces the Stage 14.3
// definition that deleted the data FIRST and then tried the auth record — on
// `auth/requires-recent-login` it signed out with a live login and no data,
// the exact outcome the brief forbids — and that omitted userArtifacts and every
// social projection. Ruled order (P1 R2.3, go-ahead):
//
//   0. the caller has ALREADY offered the export (Item 3) — this function does
//      not know or care whether it was taken;
//   1. RE-AUTHENTICATE FIRST (reauthenticateWithPopup, Google — the only wired
//      provider). Abort cleanly on any refusal: data intact, session live,
//      { status:'error', phase:'reauth' };
//   2. capture the uid to a LOCAL var (never re-read praxis_user mid-flow);
//   3. ONE ATOMIC BATCH over everything under the uid — the 8 private docs
//      (userBooks, userArcs, userNotebook, userSubTheories, userProfiles,
//      userThemes, userReaderModel, userArtifacts), aiUsage/{uid} (the AI
//      ceiling counter, owner-DELETE only by rule), publicProfiles/{uid},
//      publishedArcs where authorUid == uid, follows where followerUid == uid
//      AND where targetUid == uid, buildOns where fromUid == uid. Firestore
//      batches cap at 500 writes; a real account is 10 fixed docs + a few
//      dozen edges/arcs, so one batch holds it; the batch is CHUNKED at 400
//      anyway (each chunk atomic, the whole run idempotent — a re-run finds
//      nothing and completes). Any failure here → { status:'error',
//      phase:'firestore' }: nothing local is touched, the session stays live,
//      the reader can retry.
//   4. DELETE THE AUTH USER. If THIS fails after the batch succeeded, the
//      LOCAL data is deliberately left intact AND is re-uploaded at once and
//      AWAITED (restoreCloudFromLocal: the eight save functions called directly,
//      each its own job, the callback of every one waited for before the panel
//      hears the result — the load-side 'absent' branches never push on their
//      own, so recovery is an explicit, settled push, not a hope) —
//      and the reader is told exactly that: { status:'error', phase:'auth',
//      recoverable:true }. Local wipe comes AFTER a successful auth delete,
//      never before.
//   5. WIPE LOCAL: every localStorage key that carries this uid (a suffix /
//      infix sweep — praxis_state_<uid>, every praxis_pending_*_<uid>,
//      praxis_merge_tombstones_<uid>, praxis_nb_gather_<uid>,
//      praxis_nb_draft_<uid>_*, praxis_scan_draft_<uid>,
//      praxis_firstshelf_offer_<uid>, and any key a later build adds with the
//      uid in its name), this uid's entry in praxis_yumi_noticed, the global
//      per-device caches / budgets / cooldowns (wiped whole: they hold no
//      prose), and the notebook photos this uid's entries reference — deleted
//      PER RECORD from IndexedDB (never deleteDatabase: another account on a
//      shared device keeps its photos). Then praxis_user and the in-memory
//      maps.
//   6. sign out (the observer sees no user) → callback({ status:'deleted' });
//      the caller lands on #deleted.
//
// progress(phase) is called with 'reauth' | 'cloud' | 'login' | 'local' as each
// phase begins, so the surface can show honest progress.
function deleteAccount(callback, progress) {
  var done = false;
  function finish(r) { if (done) { return; } done = true; if (typeof callback === 'function') { callback(r); } }
  function phase(p) { if (typeof progress === 'function') { try { progress(p); } catch (e) {} } }
  var u = getCurrentUser();
  if (!u || !u.uid) { finish({ status: 'error', phase: 'reauth', error: new Error('no signed-in user') }); return; }
  var uid = u.uid;                                   // captured ONCE
  var authUser = firebase.auth().currentUser;
  if (!authUser || authUser.uid !== uid) { finish({ status: 'error', phase: 'reauth', error: new Error('auth user missing or mismatched') }); return; }

  // 1. re-auth FIRST.
  phase('reauth');
  var provider = new firebase.auth.GoogleAuthProvider();
  authUser.reauthenticateWithPopup(provider).then(function () {
    // 2+3. the atomic batch.
    phase('cloud');
    return deleteAccountCloudData(uid);
  }, function (err) {
    throw { phase: 'reauth', error: err };
  }).then(function () {
    // 4. the auth record.
    phase('login');
    return authUser.delete().then(function () {}, function (err) {
      // The cloud record is gone but the login (and this device's copy) remain:
      // RE-UPLOAD the local record NOW, while the fresh re-auth token is valid,
      // so "recoverable" is a thing that happened, not a hope (red-team: the
      // load-side 'absent' branches never push on their own -- only a dirty
      // flag does, so mark every collection dirty and save).
      // AWAITED (red-team pass 2): the panel must not invite a retry while the
      // re-upload is still in flight, or a second run could delete the docs and
      // then have the first run's late writes land under a dead uid.
      return restoreCloudFromLocal(uid).then(function () {
        throw { phase: 'auth', error: err, recoverable: true };
      });
    });
  }).then(function () {
    // 5. local, only now.
    phase('local');
    return wipeAccountLocal(uid);
  }).then(function () {
    // 6. the observer will see no user; make the cache agree immediately.
    sv('praxis_user', null);
    return firebase.auth().signOut().then(function () {}, function () {});
  }).then(function () {
    finish({ status: 'deleted', uid: uid });
  }, function (fail) {
    var f = (fail && fail.phase) ? fail : { phase: 'firestore', error: fail };
    finish({ status: 'error', phase: f.phase, error: f.error, recoverable: !!f.recoverable,
             partial: (typeof f.committed === 'number') ? f.committed : 0 });   // docs already removed before a mid-way failure
  });
}

// Every Firestore document under uid, in chunked atomic batches. Resolves when
// all chunks commit; rejects on the first failure (nothing local touched).
function deleteAccountCloudData(uid) {
  var db = firebase.firestore();
  var refs = [];
  var privateCollections = ['userBooks', 'userArcs', 'userNotebook', 'userSubTheories',
                            'userProfiles', 'userThemes', 'userReaderModel', 'userArtifacts'];
  var i;
  for (i = 0; i < privateCollections.length; i++) { refs.push(db.collection(privateCollections[i]).doc(uid)); }
  refs.push(db.collection('aiUsage').doc(uid));
  refs.push(db.collection('publicProfiles').doc(uid));
  function collect(q) {
    return q.get().then(function (snap) { snap.forEach(function (d) { refs.push(d.ref); }); });
  }
  return collect(db.collection('publishedArcs').where('authorUid', '==', uid))
    .then(function () { return collect(db.collection('follows').where('followerUid', '==', uid)); })
    .then(function () { return collect(db.collection('follows').where('targetUid', '==', uid)); })
    .then(function () { return collect(db.collection('buildOns').where('fromUid', '==', uid)); })
    .then(function () {
      // chunked atomic batches (Firestore caps a batch at 500 writes).
      var chunks = [], c = [], k;
      for (k = 0; k < refs.length; k++) { c.push(refs[k]); if (c.length === 400) { chunks.push(c); c = []; } }
      if (c.length) { chunks.push(c); }
      // Each chunk is atomic; ACROSS chunks it is not -- a failure after an earlier
      // chunk committed reports how many docs are already gone (`committed`), so
      // the surface never says "nothing was deleted" when something was. A re-run
      // finishes the rest (idempotent).
      var p = Promise.resolve(), committed = 0;
      for (k = 0; k < chunks.length; k++) {
        (function (chunk) {
          p = p.then(function () {
            var batch = db.batch(), j;
            for (j = 0; j < chunk.length; j++) { batch['delete'](chunk[j]); }
            return batch.commit().then(function () { committed = committed + chunk.length; });
          });
        })(chunks[k]);
      }
      return p.then(function () { return refs.length; }, function (err) {
        throw { phase: 'firestore', error: err, committed: committed };
      });
    });
}

// After the cloud record was removed but the Auth delete FAILED: push the local
// record straight back up. Every collection's outgoing write is dirty-flag
// driven and latch-gated on its load having settled (F-DL1), which in a live
// signed-in session it has; the re-auth that just succeeded means the token is
// fresh. Profile + reader model have no dirty flag and are saved directly.
function restoreCloudFromLocal(uid) {
  var jobs = [];
  // Each collection is its own job with its own try -- one builder throwing
  // cannot stop the others (red-team pass 2, note 5) -- and each resolves when
  // its save callback fires (ok / deferred / error alike), so the caller can
  // WAIT for every write to settle before it reports.
  function job(fn, payloadFn) {
    jobs.push(new Promise(function (resolve) {
      var settled = false;
      function done() { if (!settled) { settled = true; resolve(true); } }
      try {
        if (typeof fn !== 'function') { done(); return; }
        fn(uid, payloadFn(), done);
      } catch (e) { console.warn('restoreCloudFromLocal: ', e && e.message); done(); }
    }));
  }
  job(typeof saveBooksToFirestore === 'function' ? saveBooksToFirestore : null,             function () { return buildUserBookDoc(uid); });
  job(typeof saveArcsToFirestore === 'function' ? saveArcsToFirestore : null,               function () { return buildUserArcsDoc(uid); });
  job(typeof saveNotebookToFirestore === 'function' ? saveNotebookToFirestore : null,       function () { return buildUserNotebookDoc(uid); });
  job(typeof saveSubTheoriesToFirestore === 'function' ? saveSubTheoriesToFirestore : null, function () { return buildUserSubTheoriesDoc(uid); });
  job(typeof saveThemesToFirestore === 'function' ? saveThemesToFirestore : null,           function () { return buildUserThemesDoc(uid); });
  job(typeof saveArtifactsToFirestore === 'function' ? saveArtifactsToFirestore : null,     function () { return buildUserArtifactsDoc(uid); });
  job(typeof saveProfileToFirestore === 'function' ? saveProfileToFirestore : null,         function () { return getProfile(uid); });
  job(typeof saveReaderModelToFirestore === 'function' ? saveReaderModelToFirestore : null, function () { return (typeof getReaderModel === 'function') ? getReaderModel(uid) : null; });
  return Promise.all(jobs);
}

// The list of localStorage keys this uid owns, by INSPECTION of the store —
// never a hand-kept list, so a key a later build introduces with the uid in its
// name is swept too. Global per-device keys (caches / budgets / cooldowns / view
// prefs) are listed explicitly; they hold no prose.
var ACCOUNT_GLOBAL_KEYS = [
  'praxis_yumi_gate_budget', 'praxis_yumi_router_budget', 'praxis_yumi_web_budget',
  'praxis_yumi_profile_budget', 'praxis_tts_budget', 'praxis_scan_shelf_budget',
  'praxis_yumi_web_cache', 'praxis_yumi_web_cooldown', 'praxis_yumi_scan_cooldown',
  'praxis_yumi_profile_cooldown', 'praxis_yumi_last_greeting_idx', 'praxis_yumi_open',
  'praxis_publish_identity', 'praxis_sanitized_arcs', 'praxis_arc_tidy', 'praxis_commons_exits',
  'praxis_lens_ai_suggestions', 'praxis_constellation_palette', 'praxis_shelf_view',
  'praxis_shelf_grouping', 'praxis_arcs_sort', 'praxis_arc_view_mode', 'praxis_st_marginalia_on',
  'praxis_st_faint_on', 'praxis_state',
  // red-team-found globals with no uid in their name: account-linked dismissals,
  // the Yumi hand flag, the measure.js first-seen/activated stamps
  'praxis_portrait_dismissed', 'praxis_yumi_hand', 'praxis_m_first_seen', 'praxis_m_activated', 'praxis_m_counts', 'praxis_m_errors'
];
function accountLocalKeysFor(uid) {
  var keys = [], i, k;
  try {
    for (i = 0; i < localStorage.length; i++) {
      k = localStorage.key(i);
      if (typeof k === 'string' && k.indexOf('_' + uid) !== -1) { keys.push(k); }
    }
  } catch (e) {}
  return keys;
}
// Resolves when every local trace is gone. Photos: the ids this uid's entries
// reference are read from state BEFORE the maps are cleared, then deleted one
// record at a time.
function wipeAccountLocal(uid) {
  var imageIds = [], em = state.notebookEntries || {}, k, e, i;
  for (k in em) {
    if (!Object.prototype.hasOwnProperty.call(em, k) || !em[k]) { continue; }
    e = em[k];
    if (e.userId === uid && e.images instanceof Array) {
      for (i = 0; i < e.images.length; i++) { if (e.images[i] && (e.images[i].idbKey || e.images[i].id)) { imageIds.push(e.images[i].idbKey || e.images[i].id); } }
    }
  }
  return new Promise(function (resolve) {
    function afterPhotos() {
      var keys = accountLocalKeysFor(uid);
      for (i = 0; i < keys.length; i++) { try { localStorage.removeItem(keys[i]); } catch (e1) {} }
      for (i = 0; i < ACCOUNT_GLOBAL_KEYS.length; i++) { try { localStorage.removeItem(ACCOUNT_GLOBAL_KEYS[i]); } catch (e2) {} }
      var noticed = ls('praxis_yumi_noticed', null);
      if (noticed && typeof noticed === 'object' && Object.prototype.hasOwnProperty.call(noticed, uid)) { delete noticed[uid]; sv('praxis_yumi_noticed', noticed); }
      clearUserState();
      resolve(true);
    }
    if (imageIds.length === 0 || typeof nbPhotoIdbDelete !== 'function') { afterPhotos(); return; }
    var n = 0;
    function next() {
      if (n >= imageIds.length) { afterPhotos(); return; }
      var id = imageIds[n]; n++;
      nbPhotoIdbDelete(id, next, next);
    }
    next();
  });
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
        // AES-5a · THE DOG-EAR. Google Books' thumbnail URLs ship `&edge=curl`,
        // which bakes a page-fold into the IMAGE ITSELF -- that is the curl on
        // the Goodreads-looking covers, and it is ours, not the asset's.
        // googleBooksLargestCover() below already strips it; this read site (and
        // its twin in the recommend path) took `imageLinks.thumbnail` raw and
        // only normalised the protocol, so the curl survived here. Same strip,
        // applied at the same place as the https fix.
        coverUrl = coverUrl.replace('&edge=curl', '').replace('?edge=curl', '');
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
        // AES-5a · THE DOG-EAR — the twin of the strip in fetchGoogleBooks above.
        rCoverUrl = rCoverUrl.replace('&edge=curl', '').replace('?edge=curl', '');
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

// FX-J (F7): the periodical / scanned-artifact test. Widened past scoreVolume's
// original list, which MISSED "review", "reports", "lectures", "commissioner",
// "cases" — every one a real F7 junk candidate a generic partial read pulled from
// Google Books ("The Fortnightly Review", "The Texas Criminal Reports", "Lectures
// Introductory to…", "Report of the Commissioner of Agriculture", "Cases Argued…").
// Word-boundary anchored; also catches bound-volume markers (vol. N / no. N).
function candidateIsPeriodical(text) {
  var hay = ('' + (text || '')).toLowerCase();
  return /\b(index|proceedings|transactions|periodical|magazine|bulletin|gazette|catalogue|catalog|annual report|review|reviews|reports|lectures|commissioner|cases)\b/.test(hay)
      || /\bvol\.?\s*\d/.test(hay) || /\bno\.\s*\d/.test(hay);
}

// FX-J (F7): the plausibility FLOOR for a "did you mean" candidate the walker SHOWS.
// A partial/generic spine read returns Google Books' public-domain-scan mass;
// scoreVolume down-ranks it but the walker still surfaced the top-5, so junk showed.
// A candidate is worth showing only if it looks like the book actually on the shelf:
// a real ISBN (modern trade books carry one; the pre-1900 scans do not), not a
// periodical/scan artifact, not implausibly old, and a real title overlap with what
// we read. The book arg is a normalized volumeToBook record (title/author/year/isbn). When
// NONE clear the floor the walker shows the honest no-match + Search (Law 3).
function candidateIsPlausible(detectedTitle, book) {
  if (!book || typeof book.title !== 'string' || book.title.length === 0) { return false; }
  if (!book.isbn) { return false; }
  if (candidateIsPeriodical(book.title)) { return false; }
  var digits = ('' + (book.year || '')).replace(/[^0-9]/g, '').substring(0, 4);
  var yr = digits.length === 4 ? parseInt(digits, 10) : 0;
  if (yr && yr < 1900) { return false; }
  return titleCloseness(detectedTitle || '', book.title) >= 0.5;
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
  // FX-J (F7): shares candidateIsPeriodical (widened list) with the walker floor.
  if (candidateIsPeriodical((vi.title || '') + ' ' + (vi.subtitle || ''))) {
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
    // P1 FIX ROUND 2 (D1): this was the ONE proxy call site the Item 1 hoist missed
    // -- it reaches claude-proxy through the CLAUDE_PROXY_URL constant, which the
    // hoist's grep patterns did not match (and which two recon docs wrongly recorded
    // as dead). Unhoisted it would carry no Authorization header, so the v3.295
    // ceiling answers 401 and shelf classification fails silently while spending
    // nothing against the counter. Routed through the same door as the other 14.
    // The door is defined in yumi-brain.js, which loads AFTER this file; the call
    // happens at runtime (from renderShelf), never at parse/define time -- the
    // established cross-file pattern. A missing door is treated as a failed batch,
    // exactly like any other failure below.
    if (typeof aiProxyFetch !== 'function') {
      applyClassifyBatch(batch, null, result);
      processBatch(start + CLASSIFY_BATCH);
      return;
    }
    // Error-shape equivalence with the old fetch: aiProxyFetch THROWS on non-2xx
    // (where the old code returned null via `res.ok ? ... : null`) and rejects when
    // signed out (where the old code would have called the proxy anonymously), so
    // the rejection arm maps every failure back to the same `null` the caller has
    // always seen. Success returns the parsed JSON, as before.
    aiProxyFetch(payload).then(function (data) {
      return data;
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

// T14 (R-STALEDRAFT, 2026-08-30) — A LOOKUP HAS THREE OUTCOMES, NOT TWO.
// The old googleBooksSearch never checked res.ok. It called res.json() on ANY
// status, and because a Google Books error body IS valid JSON with no `items`
// key, a 429 fell through the `!data.items` guard and returned [] -- byte-for-byte
// the same answer as "this book does not exist." The proxy passes the upstream
// status through untouched (google-books-proxy.js:89-118), so the information was
// present at this hop and thrown away here. Measured against the REAL upstream
// body: res.ok false, JSON.parse succeeds, data.items undefined -> [] -> a
// correctly-read book is shown to the reader as "needs a look."
// The outcomes now: items (a match) · [] with err===null (a genuine no-match) ·
// [] with err (transport/quota -- we do not KNOW whether the book exists).
var GB_RETRY_BACKOFF = [400, 1200];   // ms; two retries, then give up honestly
var GB_BREAKER_MS    = 20000;         // after a retryable failure sticks, stop paying
var gbBreakerUntil   = 0;             // the backoff on every later book in the same run
// 429 = quota/rate; 503 = upstream unavailable. Everything else (401 key mismatch,
// 400 bad q, 413 oversize) is DETERMINISTIC -- retrying it is pure latency.
function gbStatusIsRetryable(s) { return s === 429 || s === 503; }
function googleBooksSearch(q, callback) {
  var done = false;
  function finish(items, err) { if (done) { return; } done = true; if (typeof callback === 'function') { callback(items, err || null); } }
  var attempt = 0;
  function retryOrFail(err) {
    // The breaker is what keeps a dead quota from costing 19 books x 1.6s of
    // sleeping: the FIRST book in a run pays the backoff, the rest fail fast.
    if (gbStatusIsRetryable(err.status) && attempt < GB_RETRY_BACKOFF.length && Date.now() >= gbBreakerUntil) {
      var wait = GB_RETRY_BACKOFF[attempt];
      attempt = attempt + 1;
      window.setTimeout(go, wait);
      return;
    }
    if (gbStatusIsRetryable(err.status)) { gbBreakerUntil = Date.now() + GB_BREAKER_MS; }
    finish([], err);
  }
  function go() {
    try {
      fetch(GOOGLE_BOOKS_PROXY_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
        body:    JSON.stringify({ q: q })
      }).then(function (res) {
        var st = res.status;
        if (!res.ok) { retryOrFail({ kind: 'http', status: st }); return; }
        res.json().then(function (data) {
          if (!data || !data.items || data.items.length === 0) { finish([], null); return; }  // a TRUE no-match
          finish(data.items, null);
        }, function () { finish([], { kind: 'parse', status: st }); });
      }, function () { retryOrFail({ kind: 'network', status: 0 }); });
    } catch (e) { finish([], { kind: 'network', status: 0 }); }
  }
  go();
}

function resolveBook(query, callback) {
  var done = false;
  function finish(result) { if (done) { return; } done = true; if (typeof callback === 'function') { callback(result); } }
  // T14: `err` (from googleBooksSearch) means the lookup never COMPLETED. status
  // stays 'none' -- every existing reader of it (views.js 7121/7163/7801/8125/10500)
  // is byte-untouched -- and the two new fields ride ALONGSIDE it, so callers that
  // want to tell "no such book" from "could not ask" now can.
  function manualStub(stubIsbn, err) {
    return {
      status: 'none',
      lookupFailed:     !!err,
      lookupHttpStatus: err ? (err.status || 0) : 0,
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
    googleBooksSearch('isbn:' + isbn, function (items, err) {
      if (!items || items.length === 0) { finish(manualStub(isbn, err)); return; }
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
  googleBooksSearch(q, function (items, err) {
    if (!items || items.length === 0) { finish(manualStub('', err)); return; }
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
// P1 Item 3 — EXPORT. A reader gets ALL their data out, in a form they can use:
// ONE archive (praxis-export-<date>.zip, STORE-only, hand-written, no library)
// holding praxis.json (CANONICAL — built from the SAME eight Firestore payload
// builders the sync writes, so it equals the cloud record by construction) and a
// Markdown bundle a human can read without a parser: one file per book (marks,
// notes, rating, artifact), one per arc (sub-theories + evidence), notebook.md,
// profile.md, README.md, and the notebook photos as images/<id>.<ext>. PROSE
// INVARIANT: every valueMarks[].why, entry body, artifact body, sub-theory body
// appears VERBATIM in both formats. Reachable from the Profile's Settings card
// (Your data) and offered first in the account-deletion flow (Item 2).
// Delivery: navigator.share with a File when navigator.canShare says so (the
// installed iOS PWA — Files / AirDrop / Mail), else an <a download>. The share
// must run inside a user gesture, so the flow is two-step: PREPARE (async:
// Firestore projections + IndexedDB photos) then a second tap SAVES.
// ES3: var/function, string concat, two-arg .then. Typed arrays / Blob / File
// are runtime objects, not syntax.
// ═══════════════════════════════════════════════════════════════════════

var EXPORT_FORMAT_VERSION = 1;

// The two payloads that were inline in their save functions are hoisted here so
// the export and the sync write the SAME fields (the HOIST lesson).
function buildUserProfileDoc(uid, profile, stampFn) {
  return {
    displayNameOverride: (profile && profile.displayNameOverride) ? profile.displayNameOverride : '',
    penName:             (profile && profile.penName) ? profile.penName : '',
    tagline:             (profile && profile.tagline) ? profile.tagline : '',
    onboardingSeen:      (profile && profile.onboardingSeen === true),
    yumiReadsAlong:      !(profile && profile.yumiReadsAlong === false),
    yumiReaderModel:     !!(profile && profile.yumiReaderModel === true),
    yumiWebGrounding:    !!(profile && profile.yumiWebGrounding === true),
    voiceOn:             !!(profile && profile.voiceOn === true),
    talkMode:            (profile && profile.talkMode === 'hands-free') ? 'hands-free' : 'push-to-talk',
    values:              (profile && profile.values instanceof Array) ? profile.values : [],
    statement:           (profile && typeof profile.statement === 'string') ? profile.statement : '',
    carryingQuestion:    (profile && typeof profile.carryingQuestion === 'string') ? profile.carryingQuestion : '',
    updatedAt:           stampFn()
  };
}
function buildUserReaderModelDoc(uid, model, stampFn) {
  var m = (model && typeof model === 'object') ? model : {};
  var threads = (m.threads instanceof Array) ? m.threads : [];
  var prof = (m.profile && typeof m.profile === 'object') ? m.profile : {};
  return {
    threads:   threads,
    profile: {
      summary:   (typeof prof.summary === 'string') ? prof.summary : '',
      updatedAt: (typeof prof.updatedAt === 'number') ? prof.updatedAt : 0,
      source:    (prof.source === 'edited') ? 'edited' : 'auto'
    },
    updatedAt: (typeof m.updatedAt === 'number') ? m.updatedAt : 0,
    syncedAt:  stampFn()
  };
}
function _fsServerStamp() { return firebase.firestore.FieldValue.serverTimestamp(); }

// The six map builders stamp updatedAt with a Firestore sentinel; in the export
// that field becomes the export instant (the ONLY transformation applied — every
// record object is carried by reference, untouched).
function _exportStampDoc(doc, exportedAt) {
  if (doc && typeof doc === 'object') {
    if (Object.prototype.hasOwnProperty.call(doc, 'updatedAt')) { doc.updatedAt = exportedAt; }
    if (Object.prototype.hasOwnProperty.call(doc, 'syncedAt'))  { doc.syncedAt  = exportedAt; }
  }
  return doc;
}

// The canonical record. `published` = [{id, data}] from publishedArcs where
// authorUid == uid; `publicProfile` = publicProfiles/{uid} data or null.
function buildExportBundle(uid, email, published, publicProfile, exportedAt) {
  var stamp = function () { return exportedAt; };
  var rm = (typeof getReaderModel === 'function') ? getReaderModel(uid) : null;
  return {
    format:        'praxis-export',
    version:       EXPORT_FORMAT_VERSION,
    schemaVersion: state.SCHEMA_VERSION,
    exportedAt:    exportedAt,
    exportedAtIso: new Date(exportedAt).toISOString(),
    uid:           uid,
    email:         email || '',
    collections: {
      userBooks:       _exportStampDoc(buildUserBookDoc(uid), exportedAt),
      userArcs:        _exportStampDoc(buildUserArcsDoc(uid), exportedAt),
      userNotebook:    _exportStampDoc(buildUserNotebookDoc(uid), exportedAt),
      userSubTheories: _exportStampDoc(buildUserSubTheoriesDoc(uid), exportedAt),
      userThemes:      _exportStampDoc(buildUserThemesDoc(uid), exportedAt),
      userArtifacts:   _exportStampDoc(buildUserArtifactsDoc(uid), exportedAt),
      userProfiles:    buildUserProfileDoc(uid, getProfile(uid), stamp),
      userReaderModel: buildUserReaderModelDoc(uid, rm, stamp)
    },
    published:     published || [],
    publicProfile: publicProfile || null
  };
}

// ── Markdown ───────────────────────────────────────────────────────────
function _mdDate(ms) {
  if (typeof ms !== 'number' || !(ms > 0)) { return ''; }
  var d = new Date(ms);
  var m = d.getMonth() + 1, day = d.getDate();
  return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
}
function _mdSlug(s, fallback) {
  var t = (typeof s === 'string') ? s : '';
  t = t.replace(/[\\\/:*?"<>|#%&{}$!'@+`=\[\]]/g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
  if (t.length > 80) { t = t.slice(0, 80).replace(/\s+$/, ''); }
  return t.length ? t : fallback;
}
function _mdMarks(marks, indent) {
  var out = '', i, m;
  if (!(marks instanceof Array) || marks.length === 0) { return ''; }
  for (i = 0; i < marks.length; i++) {
    m = marks[i];
    if (!m) { continue; }
    out += indent + '- **' + (m.value || '') + '**';
    if (typeof m.why === 'string' && m.why.length) { out += ' — ' + m.why; }
    out += '\n';
  }
  return out;
}
function _mdImages(entry, rel) {
  var out = '', i, im;
  if (!entry || !(entry.images instanceof Array)) { return ''; }
  for (i = 0; i < entry.images.length; i++) {
    im = entry.images[i];
    if (!im || !im.id) { continue; }
    out += '\n![' + (im.caption || '') + '](' + rel + 'images/' + im.id + ')\n';
  }
  return out;
}
function _mdEntry(entry, heading, rel) {
  var out = heading + ' ' + ((typeof notebookRegisterLabel === 'function') ? notebookRegisterLabel(entry.register) : (entry.register || 'Note'));
  var when = _mdDate(entry.createdAt);
  if (when) { out += ' · ' + when; }
  if (entry.isPrivate) { out += ' · private'; }
  out += '\n\n' + (typeof entry.body === 'string' ? entry.body : '') + '\n';
  out += _mdImages(entry, rel);
  return out + '\n';
}
function _bookLine(b) { return (b && b.title ? b.title : 'Untitled') + (b && b.author ? ' — ' + b.author : ''); }

function _exportEntriesFor(bundle, predicate) {
  var em = bundle.collections.userNotebook.notebookEntries || {}, k, e, list = [];
  for (k in em) { if (Object.prototype.hasOwnProperty.call(em, k) && em[k] && predicate(em[k])) { list.push(em[k]); } }
  list.sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); });
  return list;
}

function exportBookMarkdown(bundle, bookId) {
  var b = bundle.collections.userBooks.books[bookId];
  if (!b) { return ''; }
  var md = '# ' + (b.title || 'Untitled') + '\n';
  if (b.author) { md += '*' + b.author + '*\n'; }
  md += '\n';
  md += '- Status: ' + (b.status || '') + '\n';
  if (b.rating !== null && typeof b.rating !== 'undefined') { md += '- Rating: ' + b.rating + '\n'; }
  if (b.dateRead) { md += '- Read: ' + b.dateRead + '\n'; }
  if (b.finishedAt) { md += '- Finished: ' + _mdDate(b.finishedAt) + '\n'; }
  if (b.addedAt) { md += '- Added: ' + _mdDate(b.addedAt) + '\n'; }
  if (b.isbn) { md += '- ISBN: ' + b.isbn + '\n'; }
  if (b.movedMe) { md += '- Moved me: yes\n'; }
  if (b.category || b.categoryOverride) { md += '- Category: ' + (b.categoryOverride || b.category) + '\n'; }
  if (b.description) { md += '\n' + b.description + '\n'; }
  var marks = _mdMarks(b.valueMarks, '');
  if (marks) { md += '\n## Value marks\n\n' + marks; }
  var entries = _exportEntriesFor(bundle, function (e) { return e.bookIds instanceof Array && e.bookIds.indexOf(bookId) !== -1; });
  var i;
  if (entries.length) {
    md += '\n## Notes\n\n';
    for (i = 0; i < entries.length; i++) { md += _mdEntry(entries[i], '###', '../'); }
  }
  var arts = bundle.collections.userArtifacts.bookArtifacts || {}, ak, art = null;
  for (ak in arts) { if (Object.prototype.hasOwnProperty.call(arts, ak) && arts[ak] && arts[ak].bookId === bookId) { art = arts[ak]; break; } }
  if (art && (art.title || art.body)) {
    md += '\n## Artifact\n\n';
    if (art.title) { md += '### ' + art.title + '\n\n'; }
    if (art.body) { md += art.body + '\n'; }
  }
  return md;
}

function _exportSubMarkdown(bundle, st, rel) {
  var md = '### ' + (st.header || '(unnamed)') + (st.status ? ' · ' + st.status : '') + '\n\n';
  if (st.bodyPublic) { md += '**Public**\n\n' + st.bodyPublic + '\n\n'; }
  if (st.bodyIntellectual) { md += '**Working**\n\n' + st.bodyIntellectual + '\n\n'; }
  var marks = _mdMarks(st.valueMarks, '');
  if (marks) { md += 'Value marks:\n\n' + marks + '\n'; }
  var ev = st.evidence, i, e, line, ref;
  if (ev instanceof Array && ev.length) {
    md += 'Evidence:\n\n';
    for (i = 0; i < ev.length; i++) {
      e = ev[i]; if (!e) { continue; }
      if (e.kind === 'book') { ref = bundle.collections.userBooks.books[e.refId]; line = '- (book) ' + (ref ? _bookLine(ref) : e.refId); }
      else if (e.kind === 'entry') { ref = (bundle.collections.userNotebook.notebookEntries || {})[e.refId]; line = '- (note) ' + (ref && typeof ref.body === 'string' ? ref.body : e.refId); }
      else if (e.kind === 'external') { line = '- (external) ' + ((e.external && e.external.title) || '') + ((e.external && e.external.author) ? ' — ' + e.external.author : ''); }
      else { line = '- (' + (e.kind || 'evidence') + ') ' + (e.refId || ''); }
      if (e.quote) { line += '\n  > ' + e.quote; }
      if (e.annotation) { line += '\n  ' + e.annotation; }
      md += line + '\n';
    }
    md += '\n';
  }
  return md;
}

function exportArcMarkdown(bundle, arcId) {
  var a = bundle.collections.userArcs.arcs[arcId];
  if (!a) { return ''; }
  var md = '# ' + (a.title || 'Untitled arc') + '\n\n';
  if (a.description) { md += a.description + '\n\n'; }
  if (a.status) { md += '- Status: ' + a.status + '\n'; }
  if (a.createdAt) { md += '- Created: ' + _mdDate(a.createdAt) + '\n'; }
  var marks = _mdMarks(a.valueMarks, '');
  if (marks) { md += '\n## Value marks\n\n' + marks; }
  var i, ent, id, b;
  if (a.bookIds instanceof Array && a.bookIds.length) {
    md += '\n## Books\n\n';
    for (i = 0; i < a.bookIds.length; i++) {
      ent = a.bookIds[i]; id = (ent && ent.id) ? ent.id : ent; b = bundle.collections.userBooks.books[id];
      md += '- ' + (b ? _bookLine(b) : id) + '\n';
    }
  }
  var subs = bundle.collections.userSubTheories.subTheories || {}, k, list = [];
  for (k in subs) { if (Object.prototype.hasOwnProperty.call(subs, k) && subs[k] && subs[k].arcId === arcId) { list.push(subs[k]); } }
  list.sort(function (x, y) { return (x.createdAt || 0) - (y.createdAt || 0); });
  if (list.length) {
    md += '\n## Sub-theories\n\n';
    for (i = 0; i < list.length; i++) { md += _exportSubMarkdown(bundle, list[i], '../'); }
  }
  var entries = _exportEntriesFor(bundle, function (e) { return e.arcIds instanceof Array && e.arcIds.indexOf(arcId) !== -1; });
  if (entries.length) {
    md += '\n## Entries\n\n';
    for (i = 0; i < entries.length; i++) { md += _mdEntry(entries[i], '###', '../'); }
  }
  return md;
}

function exportUnrootedMarkdown(bundle) {
  var subs = bundle.collections.userSubTheories.subTheories || {}, k, list = [], i;
  for (k in subs) {
    if (!Object.prototype.hasOwnProperty.call(subs, k) || !subs[k]) { continue; }
    if (!subs[k].arcId || !bundle.collections.userArcs.arcs[subs[k].arcId]) { list.push(subs[k]); }
  }
  if (!list.length) { return ''; }
  list.sort(function (x, y) { return (x.createdAt || 0) - (y.createdAt || 0); });
  var md = '# Sub-theories without an arc\n\n';
  for (i = 0; i < list.length; i++) { md += _exportSubMarkdown(bundle, list[i], '../'); }
  return md;
}

function exportNotebookMarkdown(bundle) {
  var entries = _exportEntriesFor(bundle, function () { return true; }), i, e, md = '# Notebook\n\n', ctx, j, b, a;
  for (i = 0; i < entries.length; i++) {
    e = entries[i];
    ctx = [];
    if (e.bookIds instanceof Array) { for (j = 0; j < e.bookIds.length; j++) { b = bundle.collections.userBooks.books[e.bookIds[j]]; if (b) { ctx.push(_bookLine(b)); } } }
    if (e.arcIds instanceof Array) { for (j = 0; j < e.arcIds.length; j++) { a = bundle.collections.userArcs.arcs[e.arcIds[j]]; if (a) { ctx.push('arc: ' + (a.title || '')); } } }
    md += _mdEntry(e, '##', '');
    if (ctx.length) { md += '_' + ctx.join(' · ') + '_\n\n'; }
  }
  return md;
}

function exportProfileMarkdown(bundle) {
  var p = bundle.collections.userProfiles, rm = bundle.collections.userReaderModel, md = '# Profile\n\n', i, v, t;
  if (p.displayNameOverride) { md += '- Display name: ' + p.displayNameOverride + '\n'; }
  if (p.penName) { md += '- Pen name: ' + p.penName + '\n'; }
  if (p.tagline) { md += '- Reading life: ' + p.tagline + '\n'; }
  if (p.carryingQuestion) { md += '- Carrying question: ' + p.carryingQuestion + '\n'; }
  if (p.statement) { md += '\n## Values statement\n\n' + p.statement + '\n'; }
  if (p.values instanceof Array && p.values.length) {
    md += '\n## Values\n\n';
    for (i = 0; i < p.values.length; i++) {
      v = p.values[i]; if (!v) { continue; }
      md += '### ' + (v.name || v.id || '') + '\n\n';
      if (v.statement) { md += v.statement + '\n\n'; }
    }
  }
  if (rm && rm.profile && rm.profile.summary) { md += '\n## Reading profile (Yumi\'s reader model)\n\n' + rm.profile.summary + '\n'; }
  if (rm && rm.threads instanceof Array && rm.threads.length) {
    md += '\n## Threads\n\n';
    for (i = 0; i < rm.threads.length; i++) { t = rm.threads[i]; if (t && t.label) { md += '- ' + t.label + (t.status ? ' (' + t.status + ')' : '') + '\n'; } }
  }
  if (bundle.publicProfile) { md += '\n## Public profile\n\n- Public name: ' + (bundle.publicProfile.publicName || '') + '\n' + (bundle.publicProfile.tagline ? '- Tagline: ' + bundle.publicProfile.tagline + '\n' : ''); }
  return md;
}

function exportReadme(bundle, counts) {
  return '# Praxis export\n\n' +
    'Exported ' + bundle.exportedAtIso + ' for ' + (bundle.email || bundle.uid) + '.\n\n' +
    '- `praxis.json` — the complete record (schema ' + bundle.schemaVersion + ', export format ' + bundle.version + '): every collection under your account with ids intact, so another tool can rebuild it losslessly.\n' +
    '- `books/` — one file per book: details, value marks, notes, artifact. (' + counts.books + ')\n' +
    '- `arcs/` — one file per arc: books, sub-theories with evidence, entries. (' + counts.arcs + ')\n' +
    '- `notebook.md` — every notebook entry in order.\n' +
    '- `profile.md` — your profile, values and reading profile.\n' +
    '- `images/` — the photos attached to notebook entries. (' + counts.images + ')\n\n' +
    'Everything you wrote appears verbatim in both the JSON and the Markdown.\n';
}

// ── UTF-8 + ZIP (STORE only, real CRC32) ──────────────────────────────
function _u8FromString(str) {
  var out = [], i, c, c2;
  for (i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < str.length) {
      c2 = str.charCodeAt(i + 1);
      if (c2 >= 0xDC00 && c2 <= 0xDFFF) { c = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00); i++; }
    }
    if (c < 0x80) { out.push(c); }
    else if (c < 0x800) { out.push(0xC0 | (c >> 6), 0x80 | (c & 63)); }
    else if (c < 0x10000) { out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
    else { out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
  }
  return new Uint8Array(out);
}
var _zipCrcTable = null;
function zipCrc32(bytes) {
  var c, n, k;
  if (!_zipCrcTable) {
    _zipCrcTable = [];
    for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) { c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); } _zipCrcTable[n] = c >>> 0; }
  }
  c = 0xFFFFFFFF;
  for (n = 0; n < bytes.length; n++) { c = _zipCrcTable[(c ^ bytes[n]) & 0xFF] ^ (c >>> 8); }
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function _zipDosTime(ms) {
  var d = new Date(ms), y = d.getFullYear();
  if (y < 1980) { return { time: 0, date: 0x21 }; }
  return {
    time: ((d.getHours() & 31) << 11) | ((d.getMinutes() & 63) << 5) | ((d.getSeconds() >> 1) & 31),
    date: (((y - 1980) & 127) << 9) | (((d.getMonth() + 1) & 15) << 5) | (d.getDate() & 31)
  };
}
function _zipPut16(arr, v) { arr.push(v & 0xFF, (v >>> 8) & 0xFF); }
function _zipPut32(arr, v) { arr.push(v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF); }
// entries: [{ name: 'dir/file.ext', bytes: Uint8Array }]. Returns a Blob.
function buildZipBlob(entries, nowMs) {
  var parts = [], central = [], offset = 0, i, e, name, crc, dt = _zipDosTime(nowMs), head, cen, total = 0;
  for (i = 0; i < entries.length; i++) {
    e = entries[i]; name = _u8FromString(e.name); crc = zipCrc32(e.bytes);
    head = [];
    _zipPut32(head, 0x04034b50); _zipPut16(head, 20); _zipPut16(head, 0x0800); _zipPut16(head, 0);
    _zipPut16(head, dt.time); _zipPut16(head, dt.date); _zipPut32(head, crc);
    _zipPut32(head, e.bytes.length); _zipPut32(head, e.bytes.length); _zipPut16(head, name.length); _zipPut16(head, 0);
    cen = [];
    _zipPut32(cen, 0x02014b50); _zipPut16(cen, 20); _zipPut16(cen, 20); _zipPut16(cen, 0x0800); _zipPut16(cen, 0);
    _zipPut16(cen, dt.time); _zipPut16(cen, dt.date); _zipPut32(cen, crc);
    _zipPut32(cen, e.bytes.length); _zipPut32(cen, e.bytes.length); _zipPut16(cen, name.length); _zipPut16(cen, 0);
    _zipPut16(cen, 0); _zipPut16(cen, 0); _zipPut16(cen, 0); _zipPut32(cen, 0); _zipPut32(cen, offset);
    parts.push(new Uint8Array(head), name, e.bytes);
    central.push(new Uint8Array(cen), name);
    total = 30 + name.length + e.bytes.length;
    offset += total;
  }
  var cdSize = 0;
  for (i = 0; i < central.length; i++) { cdSize += central[i].length; }
  var eocd = [];
  _zipPut32(eocd, 0x06054b50); _zipPut16(eocd, 0); _zipPut16(eocd, 0); _zipPut16(eocd, entries.length); _zipPut16(eocd, entries.length);
  _zipPut32(eocd, cdSize); _zipPut32(eocd, offset); _zipPut16(eocd, 0);
  var all = parts.concat(central); all.push(new Uint8Array(eocd));
  return new Blob(all, { type: 'application/zip' });
}

// ── The archive ────────────────────────────────────────────────────────
function _exportImageExt(blob) {
  var t = (blob && typeof blob.type === 'string') ? blob.type : '';
  if (t === 'image/png') { return '.png'; }
  if (t === 'image/webp') { return '.webp'; }
  if (t === 'image/gif') { return '.gif'; }
  return '.jpg';
}
// Collect the photos the bundle references from IndexedDB. cb(images) where
// images = [{ id, bytes, ext }]; missing blobs are skipped (cross-device refs).
function _exportCollectImages(bundle, cb) {
  var em = bundle.collections.userNotebook.notebookEntries || {}, ids = [], seen = {}, k, e, i;
  for (k in em) {
    if (!Object.prototype.hasOwnProperty.call(em, k) || !em[k] || !(em[k].images instanceof Array)) { continue; }
    e = em[k];
    for (i = 0; i < e.images.length; i++) { if (e.images[i] && e.images[i].id && !seen[e.images[i].id]) { seen[e.images[i].id] = true; ids.push(e.images[i].idbKey || e.images[i].id); } }
  }
  var out = [], n = 0;
  if (ids.length === 0 || typeof nbPhotoIdbGet !== 'function') { cb(out); return; }
  function next() {
    if (n >= ids.length) { cb(out); return; }
    var id = ids[n]; n++;
    nbPhotoIdbGet(id, function (blob) {
      if (!blob) { next(); return; }
      var fr = new FileReader();
      fr.onload = function () { out.push({ id: id, bytes: new Uint8Array(fr.result), ext: _exportImageExt(blob) }); next(); };
      fr.onerror = function () { next(); };
      fr.readAsArrayBuffer(blob);
    }, function () { next(); });
  }
  next();
}
// Rewrite the Markdown image links to carry the real extension once known.
function _exportImageNames(images) { var m = {}, i; for (i = 0; i < images.length; i++) { m[images[i].id] = images[i].id + images[i].ext; } return m; }
function _exportFixImageLinks(md, names) {
  return md.replace(/\]\((\.\.\/)?images\/([^)]+)\)/g, function (all, rel, id) { return '](' + (rel || '') + 'images/' + (names[id] || id) + ')'; });
}

// prepareExport(uid, cb) -> cb({ status:'ok', blob, filename, counts, json }) or
// { status:'error', error }. Async: Firestore projections + IndexedDB photos.
function prepareExport(uid, cb) {
  var done = false;
  function finish(r) { if (done) { return; } done = true; if (typeof cb === 'function') { cb(r); } }
  var user = getCurrentUser();
  if (!user || !user.uid || user.uid !== uid) { finish({ status: 'error', error: new Error('prepareExport: uid mismatch or signed out') }); return; }
  var exportedAt = Date.now();
  var db = firebase.firestore();
  var published = [], publicProfile = null;
  db.collection('publishedArcs').where('authorUid', '==', uid).get().then(function (snap) {
    snap.forEach(function (d) { published.push({ id: d.id, data: d.data() }); });
    return db.collection('publicProfiles').doc(uid).get();
  }).then(function (doc) {
    if (doc && doc.exists) { publicProfile = doc.data(); }
  }, function () { /* projections unreachable: the private record still exports */ }).then(function () {
    var bundle, entries = [], counts = { books: 0, arcs: 0, images: 0 }, k, md, b, a;
    try {
      bundle = buildExportBundle(uid, user.email, published, publicProfile, exportedAt);
    } catch (e) { finish({ status: 'error', error: e }); return; }
    _exportCollectImages(bundle, function (images) {
      var names = _exportImageNames(images), i;
      var json = JSON.stringify(bundle, function (key, value) {
        // Firestore Timestamps in the projections -> ISO strings; everything else verbatim.
        if (value && typeof value === 'object' && typeof value.toDate === 'function') { return value.toDate().toISOString(); }
        return value;
      }, 2);
      entries.push({ name: 'praxis.json', bytes: _u8FromString(json) });
      var books = bundle.collections.userBooks.books || {}, arcs = bundle.collections.userArcs.arcs || {}, used = {};
      for (k in books) {
        if (!Object.prototype.hasOwnProperty.call(books, k)) { continue; }
        b = books[k]; md = exportBookMarkdown(bundle, k); if (!md) { continue; }
        var bn = _mdSlug(b.title, k); if (used['b:' + bn]) { bn = bn + ' (' + k + ')'; } used['b:' + bn] = true;
        entries.push({ name: 'books/' + bn + '.md', bytes: _u8FromString(_exportFixImageLinks(md, names)) }); counts.books++;
      }
      for (k in arcs) {
        if (!Object.prototype.hasOwnProperty.call(arcs, k)) { continue; }
        a = arcs[k]; md = exportArcMarkdown(bundle, k); if (!md) { continue; }
        var an = _mdSlug(a.title, k); if (used['a:' + an]) { an = an + ' (' + k + ')'; } used['a:' + an] = true;
        entries.push({ name: 'arcs/' + an + '.md', bytes: _u8FromString(_exportFixImageLinks(md, names)) }); counts.arcs++;
      }
      md = exportUnrootedMarkdown(bundle);
      if (md) { entries.push({ name: 'arcs/_unrooted.md', bytes: _u8FromString(md) }); }
      entries.push({ name: 'notebook.md', bytes: _u8FromString(_exportFixImageLinks(exportNotebookMarkdown(bundle), names)) });
      entries.push({ name: 'profile.md', bytes: _u8FromString(exportProfileMarkdown(bundle)) });
      for (i = 0; i < images.length; i++) { entries.push({ name: 'images/' + images[i].id + images[i].ext, bytes: images[i].bytes }); counts.images++; }
      entries.push({ name: 'README.md', bytes: _u8FromString(exportReadme(bundle, counts)) });
      var blob;
      try { blob = buildZipBlob(entries, exportedAt); } catch (e2) { finish({ status: 'error', error: e2 }); return; }
      finish({ status: 'ok', uid: uid, blob: blob, filename: 'praxis-export-' + exportDateStamp() + '.zip', counts: counts, json: json, entries: entries.length });   // uid-stamped: SAVE re-checks it
    });
  }, function (err) { finish({ status: 'error', error: err }); });
}

// deliverExport(prepared, cb): MUST be called inside a user gesture. Share sheet
// with a File when the platform supports files (iOS 15+ standalone PWA), else an
// anchor download. cb('shared' | 'downloaded' | 'cancelled' | 'failed').
function deliverExport(prepared, cb) {
  var file = null;
  function report(s) { if (typeof cb === 'function') { cb(s); } }
  function download() {
    try {
      var url = URL.createObjectURL(prepared.blob);
      var a = document.createElement('a');
      a.href = url; a.download = prepared.filename; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      report('downloaded');
    } catch (e) { report('failed'); }
  }
  try { file = new File([prepared.blob], prepared.filename, { type: 'application/zip' }); } catch (e0) { file = null; }
  if (file && navigator.share && navigator.canShare) {
    var can = false;
    try { can = navigator.canShare({ files: [file] }); } catch (e1) { can = false; }
    if (can) {
      navigator.share({ files: [file], title: prepared.filename }).then(function () { report('shared'); }, function (err) {
        if (err && err.name === 'AbortError') { report('cancelled'); return; }
        download();
      });
      return;
    }
  }
  download();
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
        // FINISH-CHOREO S1 (the status filter): the commons projection carries
        // ONLY finished (status==='published') sub-theories. A named DRAFT's
        // bodyPublic never travels. This is the future half of beta-gate #5;
        // the frozen sanitize below closes the data-at-rest half for legacy docs.
        if (st && st.arcId === arcId &&
            st.status === 'published' &&
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
    // R5 S5: carry each sub-theory's RESOLVED mark identity (markShape/markColor,
    // 0-15) so the walk shows the SAME marks the author sees — not the old
    // arcId:index hash. Resolution mirrors bookSubMarkHTML: the stored indices if
    // valid, else the deterministic hash of the real sub id (window.stHashIndices).
    var _msh = (typeof list[i].markShape === 'number' && list[i].markShape >= 0 && list[i].markShape <= 15) ? list[i].markShape : null;
    var _mco = (typeof list[i].markColor === 'number' && list[i].markColor >= 0 && list[i].markColor <= 15) ? list[i].markColor : null;
    if ((_msh === null || _mco === null) && typeof window !== 'undefined' && typeof window.stHashIndices === 'function' && list[i].id) {
      var _hx = window.stHashIndices(list[i].id);
      if (_msh === null) { _msh = _hx.shapeIdx; }
      if (_mco === null) { _mco = _hx.colorIdx; }
    }
    // ARC STANDARD S1-FIX (red-team BLOCK): carry the COMPOSED identity too.
    // markShape/markColor above are a hash-fallback CACHE, not a user choice --
    // but _stMarkIdentity cannot tell those apart, so on the walk it took the
    // "chosen" branch and collapsed every mark onto four pigments while the
    // author's field showed ten (and gave every walked mark the SAME treatment,
    // because the payload carries no sub id to hash). The payload carries no id
    // deliberately, so the walk cannot re-derive: it must be TOLD. Resolving
    // from the real record here keeps R5 S5's own invariant honest -- "the walk
    // shows the SAME marks the author sees" -- and it is display-only: no user
    // record gains a field.
    var _mid = (typeof window !== 'undefined' && typeof window.stMarkIdentity === 'function')
      ? window.stMarkIdentity(list[i]) : null;
    subs.push({
      header:    list[i].header || '',
      body:      (typeof list[i].bodyPublic === 'string') ? list[i].bodyPublic : '',
      markShape: (typeof _msh === 'number') ? _msh : 0,
      markColor: (typeof _mco === 'number') ? _mco : 0,
      markSilhouette: _mid ? _mid.sil : null,
      markTreatment:  _mid ? _mid.treat : null,
      markPigment:    _mid ? _mid.pig : null,
      markCount: (list[i].evidence && list[i].evidence.length) ? list[i].evidence.length : 0
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
  // FINISH-CHOREO S1 (D — block-empty-at-write): after the status filter, a
  // projection can be empty (a republish once every sub was reopened to draft).
  // NEVER write an empty public doc. If the arc was already published, this
  // republish unpublishes it with a notice; a first publish simply refuses
  // without writing (the ceremony's >=1-finished gate is the UX layer, this is
  // the write-level invariant). arc.published is still the PRE-publish value here.
  if (!doc.subTheories || doc.subTheories.length === 0) {
    if (arc.published === true) {
      _commonsQueueExit(arcId);
      arc.published = false;
      if (typeof markArcsDirty === 'function') { markArcsDirty(); }
      if (typeof saveState === 'function') { saveState(); }
      try {
        firebase.firestore().collection('publishedArcs').doc(arcId)
          .delete().then(function () {}, function () {});
        firebase.firestore().collection('publicProfiles').doc(uid).set({
          publishedArcIds: firebase.firestore.FieldValue.arrayRemove(arcId),
          updatedAt:       firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(function () {});
      } catch (eEmpty) {}
      finish({ status: 'unpublished-empty' });
    } else {
      finish({ status: 'empty' });
    }
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
        // R5 S5: cache the publish time locally (client clock) so the arc head can
        // compute snapshot staleness (edited-since-published) without a Firestore read.
        arc.publishedAtLocal = Date.now();
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
        // FINISH-CHOREO S1 (D): a live arc that now projects zero finished
        // sub-theories must not be re-written as an empty public doc — unpublish
        // it with a notice instead. No saveState here (this runs INSIDE saveState's
        // flush; the flag persists on the next save, the projection delete is
        // immediate). markArcsDirty re-arms the flag for that next save.
        if (!doc.subTheories || doc.subTheories.length === 0) {
          _commonsQueueExit(aid);
          arc.published = false;
          if (typeof markArcsDirty === 'function') { markArcsDirty(); }
          try {
            firebase.firestore().collection('publishedArcs').doc(aid)
              .delete().then(function () {}, function () {});
            firebase.firestore().collection('publicProfiles').doc(uid).set({
              publishedArcIds: firebase.firestore.FieldValue.arrayRemove(aid),
              updatedAt:       firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }).catch(function () {});
          } catch (eLive) {}
          continue;
        }
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

// ── FINISH-CHOREO S1 helpers ────────────────────────────────────────────────
// _trimH: trim a header string for the sanitize's header-join (null-safe).
function _trimH(s) { return (typeof s === 'string') ? s.replace(/^\s+|\s+$/g, '') : ''; }

// _commonsQueueExit: record a quiet, deduped, ls-backed per-arc notice that an
// arc left the commons because nothing in it is finished. Drained + shown once
// by views.js (drainCommonsExits -> showToast) on the next render, so it survives
// the reload between a live-edit unpublish and the next paint.
function _commonsQueueExit(arcId, reason) {
  var arc = (state.arcs && state.arcs[arcId]) ? state.arcs[arcId] : null;
  var nm = (arc && typeof arc.title === 'string' && arc.title.replace(/^\s+|\s+$/g, '') !== '')
    ? arc.title : 'An arc';
  var q = ls('praxis_commons_exits', []);
  if (!(q instanceof Array)) { q = []; }
  var i;
  for (i = 0; i < q.length; i = i + 1) { if (q[i] && q[i].arcId === arcId) { return; } }
  // P1 Item 4b: reason 'deleted' = the arc was deleted locally and the unpublish
  // could not reach Firestore; the drain words that case honestly.
  q.push({ arcId: arcId, name: nm, reason: (typeof reason === 'string') ? reason : 'sanitize' });
  sv('praxis_commons_exits', q);
}

// P1 Item 4b: a DELETED arc's unpublish that the network refused is retried on
// the next arcs load (durable per-uid list, so it survives a reload; the key
// carries the uid and is swept by account deletion). unpublishArc tolerates the
// local record being gone -- it deletes publishedArcs/{arcId} and removes the id
// from publicProfiles.publishedArcIds, both owner-authorized by rule.
function _arcUnpublishRetryKey(uid) { return 'praxis_pending_unpublish_' + (uid || 'anon'); }
function queueArcUnpublishRetry(arcId) {
  var u = getCurrentUser();
  if (!u || !u.uid || !arcId) { return; }
  var q = ls(_arcUnpublishRetryKey(u.uid), []);
  if (!(q instanceof Array)) { q = []; }
  var i;
  for (i = 0; i < q.length; i = i + 1) { if (q[i] === arcId) { return; } }
  q.push(arcId);
  sv(_arcUnpublishRetryKey(u.uid), q);
}
function drainArcUnpublishRetries(uid) {
  var q = ls(_arcUnpublishRetryKey(uid), []);
  if (!(q instanceof Array) || q.length === 0) { return; }
  var i;
  for (i = 0; i < q.length; i = i + 1) {
    (function (arcId) {
      unpublishArc(arcId, function (r) {
        if (!(r && r.status === 'ok')) { return; }            // stays queued for the next load
        var cur = ls(_arcUnpublishRetryKey(uid), []), next = [], j;
        if (!(cur instanceof Array)) { cur = []; }
        for (j = 0; j < cur.length; j = j + 1) { if (cur[j] !== arcId) { next.push(cur[j]); } }
        sv(_arcUnpublishRetryKey(uid), next);
      });
    })(q[i]);
  }
}

// sanitizeFrozenPublishedArcs (B — the frozen sanitize, ruled 2026-07-21). A
// one-time-per-device legacy cleanup of the draft-body leak. For each of this
// uid's published FROZEN arcs, read the STORED publishedArcs doc and surgically
// remove any sub-theory entry that cannot be POSITIVELY verified as a currently-
// published local sub-theory. Stored entries are anonymous ({header,body,mark*} —
// no id, no status), so the join is by trimmed header under DUAL-SIDE UNIQUENESS:
//   keep entry E iff (i) exactly ONE local sub S in this arc with
//   trim(S.header)===trim(E.header); (ii) S.status==='published'; AND
//   (iii) exactly ONE stored entry in the doc carries that trimmed header.
// Anything else is removed (remove-on-doubt, both sides). KEPT entries retain
// their FROZEN bytes verbatim (never rebuilt from current content — freshness is
// a contract). Empty result -> unpublish + notice. Idempotence is CLIENT-SIDE
// (praxis_sanitized_arcs via ls/sv, per device) because firestore.rules'
// publishedArcKeys allow-list forbids a doc stamp; a re-run on another device
// re-checks the already-clean doc and no-ops. Two named privacy-safe residuals
// (a: renamed-after-freeze published subs dropped; b: the deleted-draft unique-
// header edge) + one S2 open question (post-sanitize reopen) — see
// finish-choreo-s1-recon.md. Live arcs need no sanitize (the filter + D handle them).
function sanitizeFrozenPublishedArcs(uid) {
  if (!uid || !state.arcs || typeof firebase === 'undefined' || !firebase.firestore) { return; }
  var done = ls('praxis_sanitized_arcs', []);
  if (!(done instanceof Array)) { done = []; }
  var aid;
  for (aid in state.arcs) {
    if (!Object.prototype.hasOwnProperty.call(state.arcs, aid)) { continue; }
    var arc = state.arcs[aid];
    if (!arc || arc.userId !== uid || arc.published !== true || arc.freshness === 'live') { continue; }
    var seen = false;
    var di;
    for (di = 0; di < done.length; di = di + 1) { if (done[di] === aid) { seen = true; break; } }
    if (seen) { continue; }
    _sanitizeOneFrozenArc(uid, aid);
  }
}

function _sanitizeMarkDone(arcId) {
  var done = ls('praxis_sanitized_arcs', []);
  if (!(done instanceof Array)) { done = []; }
  var i;
  for (i = 0; i < done.length; i = i + 1) { if (done[i] === arcId) { return; } }
  done.push(arcId);
  sv('praxis_sanitized_arcs', done);
}

function _sanitizeOneFrozenArc(uid, arcId) {
  var ref = firebase.firestore().collection('publishedArcs').doc(arcId);
  ref.get().then(function (snap) {
    if (!snap || !snap.exists) { _sanitizeMarkDone(arcId); return; }
    var doc = snap.data() || {};
    var stored = (doc.subTheories instanceof Array) ? doc.subTheories : [];
    // (iii) stored-side trimmed-header counts.
    var storedCount = {};
    var si;
    for (si = 0; si < stored.length; si = si + 1) {
      var sh = _trimH(stored[si] && stored[si].header);
      storedCount[sh] = (storedCount[sh] || 0) + 1;
    }
    // (i)+(ii) local subs of THIS arc, grouped by trimmed header.
    var localByHeader = {};
    var k;
    for (k in state.subTheories) {
      if (!Object.prototype.hasOwnProperty.call(state.subTheories, k)) { continue; }
      var lsub = state.subTheories[k];
      if (!lsub || lsub.arcId !== arcId) { continue; }
      var lh = _trimH(lsub.header);
      if (!localByHeader[lh]) { localByHeader[lh] = []; }
      localByHeader[lh].push(lsub);
    }
    // Keep-predicate: dual-side uniqueness + published. Remove-on-doubt.
    var kept = [];
    var ei;
    for (ei = 0; ei < stored.length; ei = ei + 1) {
      var e = stored[ei];
      var h = _trimH(e && e.header);
      if (h === '') { continue; }                          // empty header -> remove
      if (storedCount[h] !== 1) { continue; }              // (iii) stored-side ambiguity
      var locals = localByHeader[h];
      if (!locals || locals.length !== 1) { continue; }    // (i) local no-match / ambiguity
      if (locals[0].status !== 'published') { continue; }  // (ii) not finished
      kept.push(e);                                        // KEEP the frozen bytes verbatim
    }
    if (kept.length === stored.length) {
      _sanitizeMarkDone(arcId);                            // nothing removed -> mark, no write
      return;
    }
    if (kept.length === 0) {
      _commonsQueueExit(arcId);                            // sanitize emptied it -> unpublish
      var arcE = (state.arcs && state.arcs[arcId]) ? state.arcs[arcId] : null;
      if (arcE) {
        arcE.published = false;
        if (typeof markArcsDirty === 'function') { markArcsDirty(); }
        if (typeof saveState === 'function') { saveState(); }
      }
      ref.delete().then(function () {}, function () {});
      try {
        firebase.firestore().collection('publicProfiles').doc(uid).set({
          publishedArcIds: firebase.firestore.FieldValue.arrayRemove(arcId),
          updatedAt:       firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(function () {});
      } catch (e2) {}
      _sanitizeMarkDone(arcId);
      if (window.views && typeof window.views.drainCommonsExits === 'function') {
        window.views.drainCommonsExits();
      }
      return;
    }
    // Partial removal: write back the FILTERED STORED array (rules-legal — only
    // subTheories changes, still within publishedArcKeys; NO stamp field).
    ref.set({ subTheories: kept }, { merge: true }).then(function () {
      _sanitizeMarkDone(arcId);
      if (window.views && typeof window.views.drainCommonsExits === 'function') {
        window.views.drainCommonsExits();
      }
    }, function () { /* write failed: leave unmarked, retried on the next load */ });
  }, function () { /* read failed: leave unmarked, retried on the next load */ });
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
