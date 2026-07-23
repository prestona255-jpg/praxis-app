# THE ARC STANDARD — S-FELT · S2 · S3 · S4 (continuous run)

**Date:** 2026-07-23 · **Base (last pushed):** `591c702` (v3.245)
**Status:** BUILT + VERIFIED, committed LOCAL across 4 commits. Gates running.
Awaiting: reviewer + red-team → real-account snapshot (final composition check) →
push word + Preston's felt pass on the whole vision. NO push yet.

Preston's S1 felt verdict: **foundation ratified, composition FAILED — fix-forward
from his words, no revert** (R-SHELF S5 precedent). This run is that fix-forward
plus S2–S4 of the standing plan.

| commit | slice | sw.js |
|---|---|---|
| `53c406d` | S-FELT — composed fit · presence · kill the ghost | v3.246 |
| `a7f8e73` | S2 — approach · zoom · clearing | v3.247 |
| `3876924` | S3 — unrooted seat · soil-reach · weave | v3.248 |
| `7ec7ff3` | S4 — the mark composer | v3.249 |

---

## S-FELT — the felt findings

- **F1 COMPOSED FIT** — the ruled fix for the 1360 void. `_stComposeFit` normalizes
  the marks' bounding box into a target region (0.14–0.86 W × 0.20–0.82 H) and the
  viewBox height is re-declared to the mockup band (~470 CSS px at any desktop
  width). Per-axis normalization (the mockup's own xBand move) — relative
  positions preserved, nothing reordered. DISPLAY-ONLY: mutates the render-pass
  positions, never stored x/y. Desktop-only; mobile keeps its felt-passed path.
  **Verified:** viewBox `0 0 600 260` at 1280; xspread **84→516** (= 0.14–0.86×600),
  yspread 52→213; **holds at density** (12 marks → same one-screen viewBox, same
  normalized spread, scrollWidth 1265 ≤ 1280).
- **F2 PRESENCE** — derive re-weights toward SOLID (50/25/25); at density this reads
  as the mockup's distribution (12 marks → **7 solid / 3 hatched / 2 outline**).
  markScale 1.15; threads non-scaling hairline; sky dissolves into the sheet.
- **F3 KILL THE GHOST** — the hover context card retired; jobs re-seat (Open → tap;
  Change mark → composer; Unlink → workshop connections; Delete → workshop foot).
  **Verified:** mouseenter on a shape → **no card**.

## S2 — the approach

- Tap 1 concentrates (mark lights + threads + whisper card with the "Open →" door);
  tapping the LIT mark ARRIVES. **The zoom** flies the camera (a CSS transform on
  #arc-field toward the mark) on MO-1 timing, then routes to the clearing;
  reduced-motion skips the flight. **LAW 7 proven:** mark positions IDENTICAL
  before/during/after a scale(2.8) camera. **The clearing** = the workshop reframed:
  breadcrumb (‹ field · this one thing) + one faint horizon + D3 return; court
  preserved. **Verified:** tap1 focal+whisper+door; law7 ×3 identical; focal tap2 →
  af-zooming → route to …/build; clearing mounts with breadcrumb + horizon + court.

## S3 — unrooted seat · soil-reach · weave

- **Unrooted seat** (ruling 5a): orphans surface on the Arcs index with an
  adopt-into-an-arc repair (`adoptSubTheoryIntoArc` — guarded write). Sparse-honest.
  **Verified:** 3 synthetic orphans → seat + adopt (3→2) + **seed-lock refusal**.
- **Soil-reach** (G4): the native `<select>` retired by replacement; book accordions
  (tap → passages rise) + corpus search stay. **Verified:** no `.stb-pull-book-sel`;
  search + 5 accordions present.
- **Weave** (G5): drag a field card across the edge → weave at the drop point
  (`caretRangeFromPoint` → shipped `insertAtCaret`; no anchor system built).
  A11y twin: a lifted card reveals "Weave into prose". room-field.js gains an
  optional `onDropAt`. **Verified:** lift → twin inserts a cite; a real drag over
  the prose wove at the caret (1654→1672 chars).

## S4 — the mark composer

- Form-first grid (9 sil × 3 treat × 10 pig), each cell previewing the whole mark.
  **Uniqueness law in-arc:** a sibling's triple is shown closed and Plant refused.
  **Offered, never applied (G3):** opening on an existing mark pre-selects and
  writes nothing until Save; `setMarkIdentity` is the only writer; Reset-to-auto
  clears. Replaces every "Change mark" path (openSymbolPicker → fallback).
  **Verified:** 9/3/10 grid; recompose pre-selects; sibling beacon/solid/madder
  closes the madder cell; olive enables Plant; save writes; workshop hero opens the
  composer (not the old picker); Reset clears; **seed write refused**.

---

## Fidelity sweep — §3 laws, computed-style (seed arc, 1280)

| law | evidence | result |
|---|---|---|
| 1 one ground | `.af-field` bg `rgba(0,0,0,0)` · border `0px` · shadow `none`; sheet `rgb(253,249,238)` on transparent-body twilight | PASS — no panel, no seam |
| 2 one world | S2 distances: field → clearing (brighter) → page; camera flight not a ground flip | PASS (S2 verified) |
| 3 horizon speaks | question on `.af-sky`; answer joins from newest finished sub | PASS |
| 4 sparse-honest | 0-value → no embers; 0-book → one soil line; ember → no door | PASS (S1 + here) |
| 5 one gate | **0** controls on `.af-field`; all chrome in gate row + ⋯ | PASS |
| 6 form first | seed 4 marks: 4 distinct silhouettes; at density 12 marks: 7 sil / 6 pig / solid-majority treatments | PASS + uniqueness enforced at the mint |
| 7 approach never teleport | law-7 positions IDENTICAL ×3 under scale(2.8) | PASS |
| 8 honest doors | ember→Graduate / graduated→Publish / published→Published; zero-marks→none | PASS (S1) |
| 9 soil below sky above | 5 soil books, **0** canvas book-squares (`data-st-book-id`) | PASS |
| 10 threads gold | 3 edges, non-scaling gold gradient lines | PASS |
| 11 the pull is physical | soil-reach (tap→rise) + drag-across-edge weave, no dropdown | PASS |
| 12 writing has a body | (S1 canvas dress + kit sweep) | carried from S1 |
| RD-2 | scrollWidth 1265 ≤ 1280 at 4 AND 12 marks | PASS |

Shots (rig, fresh, gitignored): `.claude/rigcap/shots/sfinal-field-{1360,390}.png`
(the integrated field, both widths), `sfelt-field-{1360,390}.png` (S-FELT).
Each headless run re-seeds new ids, so mark identities differ per shot (disclosed
per-profile-seed behavior) — the composition, presence and distinctness are the
constants to read, not the specific marks.

## Full stack byte delta (LF-normalised, vs `591c702`)

| file | delta |
|---|---|
| js/views.js | +24,571 |
| js/arc-constellation.js | −3,261 (hover card excised) |
| js/state.js | +2,720 |
| js/room-field.js | +1,221 |
| assets/components.css | +8,480 |
| **net** | **+33,731** |

Byte-locks unchanged throughout (`lumen-amber.css` 070679b0…, `marks.js` 772886c0…).

## Residuals / owed at the halt

- **The real-account composition check is NOT yet run** — the ruling requires a
  1360 full-page shot of the DENSEST REAL arc showing a composed single-screen
  field, judged against the mockup side by side. It needs a fresh snapshot (the S1
  one was deleted). Requesting it at the halt, per the ruling ("ask Preston for a
  fresh snapshot export when you reach final verification"). Composed-fit is proven
  to hold at 12 synthetic marks; the real densest arc is 5 marks (from the S1
  snapshot), well within that.
- Reviewer + red-team gates: **running** (results appended before the halt).

---

## Red-team gate (fix-red-team, Sonnet) — 3 BLOCK / 1 HOLD / 3 NOTE — all addressed

Aimed at the covenant/drift, the zoom guard, the weave, and composer uniqueness.

- **BLOCK 1 — compose-fit + drag was not idempotent (drag snapped back).** Real and
  serious: the first cut bbox-NORMALIZED a MIXED set (a dragged mark in composed
  space + undragged siblings in raw radial space), so the just-dropped mark, now an
  extremum, was pulled back toward the margin on the next render — a visible
  snap-back that broke "the arrangement never moves." **FIXED:** `_stComposeFit`'s
  normalization is replaced by `_stComposedLayout` — authored positions are used
  VERBATIM (clamped to the viewport), defaults get a composed screen slot (grid +
  hash jitter, stable per id). **Verified live on an owned arc:** dropped (300,132)
  → renders (300,132), identical across a double render, and dragging one mark
  leaves the others still. The covenant is now honored more strictly than before
  (authored coords verbatim, not transformed).
- **BLOCK 3 — the weave a11y acts row never retracted on un-lift.** Real: Open/Weave
  floated under a collapsed card. **FIXED:** the acts node is removed on un-lift AND
  a `.rf-card:not(.rf-lifted) .stb-fc-acts{display:none}` rule scopes it to the
  lifted state. **Verified live:** lift → acts visible; un-lift → node gone.
- **HOLD 4 — a throw in `onDropAt` could strand the card.** **FIXED:** the call is
  wrapped in try/catch in room-field.js; a throw falls through to a normal arrange.
- **NOTE 6 — `setMarkIdentity` validation fail-OPEN.** **FIXED:** now fail-CLOSED —
  a missing axis vocabulary refuses the write.
- **NOTE 7 — a stale arrive flight could force navigation.** **FIXED:** the 300ms
  timeout only sets the hash if the route hasn't changed since the flight launched.

**BLOCK 2 — uniqueness "guaranteed" overstated — CLAIM CORRECTED (not a code bug).**
The S4 commit said uniqueness is "guaranteed, not hoped for." The code enforces it
at the COMPOSER (the mint and every recomposition): opening the composer reads every
sibling's identity — derived or chosen — and closes any taken triple, refusing Plant
on a collision. What it does NOT prevent is two marks BOTH left on their derived
(hash-only) identity colliding silently — a birthday-paradox risk at ~19+ never-
composed marks in one arc. **The honest, ruled-correct position:** uniqueness is
**guaranteed at the composer**; for pre-existing derived marks it is best-effort and
the composer is where a collision is surfaced and resolved. This is G3-as-built —
**offered, never applied** — because forcing a derived mark's identity would make it
arc-dependent and non-stable-across-reloads, violating the covenant and the "pure
function of the id" law. Recorded as a **named residual**, not a ratified absolute.

**Red-team confirmed clean:** mobile genuinely bypasses compose-fit; adopt +
setMarkIdentity refuse seed-locked subs and non-owned targets; `_stbWeave` scopes to
the sub's own editor; byte-locks intact; sw.js bumps sequential; the arrive guard
can't double-fire or deadlock.

sw.js v3.249 → v3.250 (the fix commit).
