# F-DL4 — deep §9 fix-red-team verdict (data-loss tier)

**RED-TEAM: clean** — one residual-to-document note, NOT block-commit.

## Independently re-derived
1. **Reset set exact (10/10)** — decls integrations.js:50-62 = 8 *Loaded + 2 *WritePending; `resetSyncLatches` sets exactly those 10. No other cloud-sync scalar leaks on a switch (`_ttsAudio` is playback state; `pendingBookSync`/`pendingBookDeletes` are uid-keyed localStorage — correctly excluded).
2. **§3 part-4 — no NEW silent-loss** — CONFIRMED. Dropping *WritePending on a switch loses A's deferred write no more than pre-fix (pre-fix re-fired under B's uid with getProfile(B), never delivering A's edit + fired a spurious B-write; post-fix suppresses that spurious write). Strictly equal-or-better. The 8 *Loaded reopen via the same load callbacks — proven by cold-load equivalence (the switch branch is byte-identical to cold-load except latches return to their init value false).
3. **Reachability** — integrations.js NOT IIFE-wrapped; `resetSyncLatches` is a true global closing over the 10 vars; `typeof` guard correct for state.js-before-integrations.js load order.
4. **All 4 call sites correct** — A→B switch (loads follow, reopen); sign-out observer + signOut helper (no loads follow, latches stay false = SAFE, reopened next sign-in).
5. **F-DL5 read-race** — genuinely pre-existing, not worsened; strict improvement for the common case.
6. **No permanent block** — every signed-in resolution runs the 8 loads; leaked *Dirty flags benign (payload always current user → current user's own doc).
7. **Mechanical** — parse exit 0 both; harness self-validates; only 3 tracked files dirty; deltas additive LF-norm (integrations +23, state +8, sw +1/-1 same-length); cache v3.183→v3.184; ES3-clean.

## Note (residual → F-DL5 ledger, NOT block-commit)
Write-side sibling of F-DL5: a deferred single-doc write dropped on a mid-load switch (integrations.js:562-564, :598-600) — pre-existing, not worsened. FOLDED into f-dl4-recon.md's residual.

## Disposition
Gate PASSED. Ships on red-team-clean per the queue + STAGE 1 autonomous authorization + the F-DL1/F-DL3
code-first precedent. **Live smoke = PENDING (needs a provisioned 2-account test session; the only connected
browser is the real account, not signed out).**
