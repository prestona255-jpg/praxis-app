# CD6-SPLIT-POP-FIX (v3.258) — flip-up + CDSEG-NIT1/2 riders
STARTED · base fee3c72 · Option A ruled · recon: cd6-split-chip-desktop-recon.md

## BUILD + VERIFY (v3.258) — all real hit-tested clicks (elementFromPoint-verified, force-settled)
EDITS: state var capSplitPopOutside · capSplitCloseChipPop() helper · chip handler rewrite (flip-up + outside-listener) ·
listener-drop at capRenderSplitReview top · listener-drop in auth teardown · CSS open-up rule (scoped) + NIT1 selector fix.
GATES: parse views.js OK · ES3 clean (the lone 'let' grep hit is the English word in a pre-existing capCommit comment) ·
sole-writer unchanged (captureNote 3086 LIVE; 14577 dead) · foundations MD5 unchanged · door-core NOT in diff (grep) ·
sw.js -> v3.258. Bytes: views.js +2364 B (code +1316 / comment +1156) — over the flip-up-core prediction (+450-650)
because the bundled CDSEG-NIT2 listener rider (helper + handler-listener + 3 drop-sites) wasn't in that estimate;
components.css +485 B (2 rules + verbose NIT1/open-up comments). Comment overage clears by classification.

LIVE (rig, d0tester, synchronous-stub + microtask flush — pane-hidden/setTimeout-throttle-immune):
- 1360 FLIP: bottom-fold chip 659-691 (was pop_vis 0 pre-fix) -> open_up UP, pop 557-653 ABOVE chip, VISIBLE 95px.
  top/mid chip 413-446 -> DOWN, pop below, VISIBLE 95px. open_up false after close.
- 390 FLIP: low-hittable chip 703-736 (room-below 40<95) -> open_up UP, pop 602-697 above, VISIBLE 95px.
  top chip -> DOWN VISIBLE 95px. (block:'end' exact-fold pixel = chip not hittable/click misses — pre-existing edge,
  not a fix regression; user scrolls a comfortably-visible chip.)
- CDSEG-NIT2: open -> is-open true, pop display:block, listener +1 · inside-click(option) selects -> re-render, listener
  dropped (net 0) · outside-click(head) -> closed, open-up cleared, listener dropped · OPEN/CLOSE x10 -> net listeners 0
  (NO LEAK) · door capClose with pop open -> listener dropped (net 0).
- Door paths unaffected: Escape closes the sheet · door-core top-level #capContext chip still opens (7 opts) · accept/cancel intact.
- NIT1: first .capdoor-split-row border-top 0px, row1 0.67px; old `.capdoor-split-row:first-of-type` GONE, new
  `.capdoor-split-head + .capdoor-split-row` present.

## RED-TEAM (Sonnet) — CLEAN, no BLOCK
All 5 targets BLOCK-CLEARED with independently re-derived evidence: (1a) the `+8` buffer exceeds the real 6px
gap requirement → flips slightly early, never clips at the boundary; (1b) is-open is added BEFORE the
`pop.offsetHeight` read (candidateBooks synchronous) → real reflow, and the orchestrator's stray `is-open:false`
was an await-gap harness artifact, not a toggle bug; (2) `.open-up` added in one place, cleared by
capSplitCloseChipPop + every re-render's full `innerHTML=''` — register/accept/cancel buttons are OUTSIDE `wrap`
so the outside-listener closes first; (3) all 4 `capSplitPopOutside` sites use the identical capture flag `true`
(no deregister mismatch), every exit path drops it, single-open invariant provable via capture-before-target
ordering; (4) door-core `#capContext` bubble-listener disjoint from the split capture-listener, inside-pop clicks
are `wrap.contains`→no-op, NIT1 adjacent-sibling scoped to the first row only; (5) door-core untouched, ES3 clean,
sole-writer unchanged (0 new writers in diff), MD5 recomputed unchanged, sw.js v3.258.

## RESIDUAL (named per red-team + FIX-PROTOCOL absorbed-residuals discipline)
- **R1 — SPLIT-POP-DOUBLE-CLIP (degenerate).** The flip-up condition (views.js) checks only room BELOW the chip
  before flipping up; it never verifies room ABOVE exists. In a narrow degenerate case (a very short `.capdoor-body`
  where a chip near the top of a tall review has room neither below nor above), flipping up could render the pop
  above `scrollTop:0`, unreachable by scrolling — a mirror of the bug this fix repairs, for a narrower geometry.
  NO data loss (worst case: an unreachable picker for that one child, same as pre-fix). The pop is `max-height:240px`
  bounded, so it needs a body < ~2×pop to trigger. Not observed at 1360 or 390 in verification. Follow-on (direction-
  by-more-room, or scroll-into-view) — NOT folded into this ruled Option-A fix.
