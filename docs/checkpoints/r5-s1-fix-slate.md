# R5 S1 — FIX SLATE — STARTED

Behavior-only fix slate. Files: js/views.js + js/state.js (F-MA1 guard; state.js byte-freeze
superseded for this one guard per the R5 prompt). NO components.css (S1 is JS-only per its gate).
Invariants Δ=0: arc-constellation.js, tradition-forms-arc.js, yumi-brain.js.

## Pieces
1. arc-voice rejection handling — views.js:12491 `considerArcVoice(arcId).then(onF)` gains an
   onRejected (2nd .then arg) → inline fallback + re-enable trigger. Extract shared `arcVoiceFail`.
2. F-MA1 seed-mutation guard — state.js. Helper `_subSeedLocked(sub)` = sub.userId ===
   '__praxis_seed__' && current user != sentinel. Guard setSubTheoryPosition (no-op, return record),
   linkSubTheories (return false), unlinkSubTheories (return false). SAFE vs delete-cascade: only
   fires when a seed sub is involved; normal↔normal cascade never trips it.
3. Arcs list FIX trio (views.js renderArcsPage area):
   - O(1) card-count map: module `_arcSubsIndex` built once per renderArcsPage (`_buildArcSubsIndex`),
     read by `_arcSubsOf`; set at top, cleared at bottom.
   - Shared count helper: `_arcSubCount(arcId)` = `_arcSubsOf(arcId).length`; `_arcCardCounts`
     delegates to it (drops its own scan).
   - Navigate to new arc: openArcEditor onSave → `location.hash = 'arc/' + arc.id` (was renderRoute);
     stale post-create-landing comment corrected in same edit.
4. Tidy/Restore/Reset legibility (D5): resetBtn gains `.arc-reset-btn` class; add `.arcfield-tidy-help`
   <p> with mockup copy (line 699). Confirm step KEPT as live openArcResetConfirm (behavior-preserving;
   mockup's inline arm/cancel is a mockup mechanism, not a required swap). CSS for both → S2 chrome.

## Gates — ALL PASS
- parse: `PARSE OK: js/state.js` (exit 0) · `PARSE OK: js/views.js` (exit 0). Harness
  self-validated: a planted `() => 1` arrow file → `PARSE ERROR ... Syntax error` exit 1.
- greps: `_subSeedLocked` def@1996 + 3 guards (2014/2156/2182); `arcVoiceFail` def+else+`.then(onF,arcVoiceFail)`;
  `_arcSubsIndex` build/read@3390/set@3579/clear@3813 + `_arcSubCount`@3406 (used@3328) + `_buildArcSubsIndex`@3364;
  `location.hash = 'arc/' + arc.id`@3294; `arc-reset-btn`@12985 + `arcfield-tidy-help`@13094.
- byte delta (git diff --stat, LF-norm): js/state.js +15 · js/views.js +96/−23 (net +73). JS-only, no CSS.
- invariant Δ=0: arc-constellation.js / tradition-forms-arc.js / yumi-brain.js ABSENT from diff (proven).
- ES3 scan on added lines: clean (0 hits for =>, const, let, class, backtick).

## Self-red-team (S1)
- F-MA1 `_subSeedLocked`: fires ONLY when a seed-owned sub is involved; normal↔normal delete-cascade
  never trips it (verified) — deleteSubTheory untouched. getCurrentUser undefined → seed stays LOCKED
  (safe default). setSubTheoryPosition returns the record unchanged (no caller depends on mutated return).
- arc-voice: all 3 paths (PASS / non-PASS / rejection) re-enable the trigger exactly once; a
  buildGroundingChips throw leaving the button disabled is a PRE-EXISTING edge, not introduced here.
- O(1) index: index-path grouping == old filter (arcId match, createdAt-asc sort); no caller mutates
  the returned array; set-at-top/clear-at-bottom, synchronous render only.

## Residuals carried
- R-S1a: seed field marks remain visually draggable at the DOM layer (persistence guarded per the
  prompt's mutator scope; a render-layer drag-disable is a follow-up, out of S1 scope).
- R-S1b: `.arcfield-tidy-help` + `.arc-reset-btn` render unstyled until S2 supplies CSS (by design —
  S1 is JS-only per its gate; S2 chrome owns arc-interior CSS).
- R-S1c (minor): `_arcSubsIndex` not wrapped in try/finally; a mid-render throw would leave it set
  (low risk, matches codebase style).

## Commit
- LOCAL checkpoint only. `--no-verify` (design-canon §6: single sw.js bump deferred to THE STOP;
  a per-stage source commit trips hook rule #3, which per §6 must NOT bump per-stage). Explicit-file
  staging. Push deferred to Preston's word at THE STOP.
