# R-SHELF — MOCKUP STAGE CLOSE

Date: 2026-07-21 · Model: Opus 4.8 (default effort) · Worktree `rshelf-mockup`,
mockup HEAD `af32ac8` (elevation pass 2) · docs-only close-out, no app code.

This checkpoint records the felt-pass ruling that CLOSES the R-SHELF **mockup stage**.
It is not the round close — the build round still runs and will consume this branch.

---

## THE FELT-PASS RULING (July 21, 2026 — recorded verbatim)

> **Preston's dual felt read (390 phone + desktop) = PASS — the mockup stage is CLOSED.
> The five pass-2 dials are RATIFIED AT THEIR DEFAULTS: cover variance 5.5% nominal ·
> desktop strip 104px · masonry balance as life-bound · order-by-life touch signal =
> named build-time seam · desk baseline undrawn (chrome-free). §5-vs-§3 ratification
> stands (§3 governs).**

This satisfies the VISUAL GATE and OWNER-VIEWPORT PRIMACY: the owner walked the settled
mockup at his own viewports (390 phone + desktop) and passed the STATED felt deltas. The
pass-2 score (18/18) was floors-cleared; this ruling is the felt verdict that outranks it.

---

## THE FIVE DIALS — ratified at their defaults

Each was carried to Preston as a flagged dial at pass-2 (see
`docs/checkpoints/r-shelf-elevation-pass-2.md`, "5 flags"). All five are now RATIFIED at
the default the mockup shipped:

| # | Dial | Ratified default | Where it lives |
|---|---|---|---|
| 1 | Cover variance (UNIFORM COVERS) | **5.5% nominal** seeded uniform scale (aspect held 2:3, top-edge only) | `buildCoverNode` scale = `1 − hash%56/1000` |
| 2 | Desktop wheat strip height | **104px** (the midpoint of the ruled 96–120 breathe range) | `.horizon-strip{height:104px}` |
| 3 | Masonry column balance | **as life-bound** — greedy shortest-column fill in LIFE order; the 638–795px delta is accepted as structural (life-order binds placement; not bin-packed) | `renderCase` masonry loop |
| 4 | Order-by-life "touch" signal | **named build-time seam** — the mockup seeds a deterministic pseudo-date; the real signal (marks / status / opens / arc activity) is decided at BUILD time, not here | `touchDays = |hash(id+'\|touch')|%184` |
| 5 | Desk baseline | **undrawn / chrome-free** — bottom-alignment only, NO drawn board, honoring §3.4's chrome-less desk | `.desk-row{align-items:flex-end}`, no board |

## §5-vs-§3 ratification — stands

The three §5 SHAPE-B mandate lines that textually collided with v3's later, more specific
§3 Law-8 rulings (board gradient vs §3.1 CARVED flat tones · ~150px strip vs §3.5 slim
strip · NOW card vs §3.4 chrome-less desk) resolve with **§3 governing**. Ratified. The
brief-v4 amendment (main COMMIT 2) fixes those three §5 lines to defer to §3 explicitly.

---

## TRIAL-EVIDENCE NOTE (record, NOT a verdict)

The two acceptance-card TRIAL instruments ran across the R-SHELF mockup stage. Their
ratify/drop verdicts remain **OPEN until the R-SHELF round close (post-build)**, per their
own terms ("⚠ TRIAL — ratify or drop at R-SHELF close"). Recorded, not verdicted:

- **The elevation loop** drove the mockup **10 → 18 in two passes** (pass 1: 10→17,
  dot-only/desk-line/embers/chip-counts + 2 prerequisite bug fixes; pass 2: 17→18,
  gravity/uniform-covers/THE WALL/order-by-life/wheat-containment/chrome-clearance). It
  also **surfaced two blocking pre-existing bugs** at pass 1 — the leading-comment `-->`
  leak (dumped ~40 lines into the body) and the `renderCase`↔`applyIllumination` infinite
  recursion (hung every filter) — both of which a rule-only card would not have caught.
- **The completeness inventory** ran **once, clean** at pass 2 (8 rows × both acceptance
  surfaces, zero MISSING; the mobile-only / desktop-only cells are N/A-OWNED by design).

Signal so far: the loop earned its keep (two real blockers found, measurable elevation);
the inventory added no findings on its single run. Neither is verdicted here — the round
close decides.

---

## STATE AT CLOSE

- Mockup: `docs/studio/mockups/r-shelf.html` @ `af32ac8` (pass-2, felt-PASSED).
- Canon: `docs/studio/shelf-look.md` (north-star prose) + brief v4 (main) hold the ruled look.
- Evidence: `docs/checkpoints/r-shelf-elevation-pass-2.md` (rect tables, completeness
  inventory, verbatim-law acceptance card).
- The **build round** is next; it consumes this branch. Do NOT merge `rshelf-mockup` —
  the build will branch/build from the ratified mockup.
