# F-DL4 — shared-tab account-switch latch race — RECON

F-DL4 STARTED @ HEAD e861d59. Data-loss / state tier. Source-derived map via repo-mapper this
session (fix touches the F-DL1/2/3 files → mapper run per FIX-PROTOCOL §1 "map first").

## Premise (CONFIRMED against source)
On a same-tab account switch A→B (sign out of A, sign in as B, no reload), the per-collection cloud-sync
latches are NOT reset, so account B inherits A's "already loaded / write-pending" state and B's first
outgoing `.set()` can clobber B's not-yet-loaded remote data (or strand A's deferred write).

## The reset hook
`clearUserState()` — **js/state.js:1704-1742**. Runs on every switch/sign-out (integrations.js:84 A→B,
:581 observer sign-out, :622/:626 signOut helper). Resets `state.*` maps only. Resets **none** of the latches.

## The latches — REAL COUNT = 10 (not 8), all module-global `var`s in js/integrations.js:50-62
**`*Loaded` (8):** `arcsLoaded`:50 · `notebookLoaded`:51 · `subTheoriesLoaded`:52 · `themesLoaded`:53 ·
`artifactsLoaded`:54 · `booksLoaded`:55 · `profileLoaded`:59 · `readerModelLoaded`:60. Each set true at its
load-cb tail; each gates its `saveXToFirestore` (returns + marks dirty if still false). **Zero reset sites
anywhere** (grep-confirmed).
**`*WritePending` (2):** `profileWritePending`:61 · `readerModelWritePending`:62. Set in the gated write;
cleared ONLY on their own load-cb re-fire (:540, :576), never on switch.

→ The queue said "8 *Loaded + *WritePending"; the accurate set to reset is **all 10**. (Mechanical count
correction, carried per THE FORK RULE — not a scope expansion.)

## Architecture constraint — the fix MUST span TWO files
`clearUserState` lives in state.js, which loads BEFORE integrations.js (CLAUDE.md load order). It cannot
name the integrations.js latch vars at define time (ReferenceError). Clean shape (mirrors the existing
runtime-only cross-file pattern at state.js:1660-1663 exportWorkspace/getCurrentUser):
- **integrations.js:50-62** — add `function resetSyncLatches()` beside the declarations, setting all 10 → false.
- **state.js clearUserState** — add `if (typeof resetSyncLatches === 'function') { resetSyncLatches(); }`
  (runtime-guarded; called at runtime never parse time).

## Residual (PRE-EXISTING, not introduced by this fix) — FLAG, do not silently absorb or silently fix
Resetting the latches is necessary but not sufficient: the load callbacks capture the OLD uid in closure and
have NO uid-guard, so an A read still in flight at switch time can later resolve and re-set its `*Loaded`
latch (integrations.js:114/171/…) — reopening the gate before B's read resolves, and splatting A's remote
records into B's freshly-cleared state (`found` REPLACE branch). This is a narrower, pre-existing race the
latch-reset does NOT make worse (strict improvement for the common case). Proper close = an auth-generation
token compared in each callback tail, OR a per-callback `getCurrentUser().uid === capturedUid` guard. OUT OF
F-DL4's stated scope ("reset the latches in clearUserState"). Documented here + in the final report as the
open follow-up (candidate F-DL5).

**F-DL5 also covers the WRITE-SIDE sibling (red-team-added):** if A edits its profile/reader-model while A's
own load is still in flight (`profileWritePending=true`), then switches to B before A's load settles, A's
cloud write is abandoned and A's local edit is later overwritten by A's stale remote on A's next sign-in
(REPLACE-on-found, integrations.js:509-549). This is PRE-EXISTING and NOT worsened by F-DL4 (pre-fix the
pending flag re-fired under B's uid with getProfile(B), never delivering A's edit either — F-DL4 merely
suppresses that spurious B-write). Same F-DL5 ledger entry as the read-race; on the record, not swallowed.

## Do NOT touch (correct as-is)
`pendingBookSync` / `pendingBookDeletes` are per-uid localStorage (`praxis_pending_books_<uid>`,
state.js:912-914), naturally isolated across accounts — resetting them would be a bug.

## Planned edit + byte floors
- integrations.js: +~250 B (`resetSyncLatches` fn, 10 assignments + comment).
- state.js: +~120 B (guarded call + comment in clearUserState).
- sw.js: +0 (version string). CACHE_VERSION → v3.184 (after OG's v3.183 ships).

## §1 #3 — Named live-smoke click-path (shared-tab A→B, needs a SECOND account)
Prereq: TWO throwaway/test accounts, call them A and B, in the SAME browser tab. NEVER the real account.
1. Sign in as A. Seed a distinguishable record for A (shelve a book / write an arc). Confirm it persists
   (reload once, still there).
2. In the SAME tab, sign OUT then sign IN as B (no full reload of the app between — the observer-driven
   switch is the code path under test).
3. Immediately on B, fire a write (shelve a book as B) while B's remote read may still be resolving.
4. Hard-refresh. **PASS** = B's write survived AND A's data is intact under A (switch back to A, reload):
   no cross-account clobber, no strand. **FAIL** = B's record lost, or A's record overwritten/merged into B.
If only ONE test account is provisioned: run the red-team, and FLAG the smoke as needing a 2nd account
(do not fake it). Red-team-clean + flagged-smoke is the fallback gate per the queue.
