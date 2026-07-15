# DW-POLISH · Book Detail — Stage 1 build record

**Date:** 2026-07-15. **Base:** `5cb60e4` (v3.208). **Contract:** the felt-passed mockup
`docs/studio/mockups/dwp-book-detail.html` ("build to match, no corrections").
**Recon + baseline:** `docs/checkpoints/dwp-book-detail-recon.md`.

Preston's rulings folded: **R1** felt-diagnosis spec governs, CLAUDE.md:298 §4-I desktop clause
marked stale · **R2** fold `.bk-reading` · **R3** width buys structure, cap all prose ≤72ch ·
DW-3's false round-record claim corrected · full mobile re-gate + delta list · Tab-walk condition.

---

## 1 · What was built

`.bk-shell` at ≥1200 is now ONE grid whose every column is ONE object:

```
backlink  1/-1  row 1
hero      col 1 row 2        |   THE RAIL  col 2  rows 2..7   (grid-row:2 / 8)
panels    col 1 rows 3-6     |   (rail continues beside them)
main      col 1 row 7        |
```

- **`.bk-rail`** — new wrapper (views.js), flex column `gap:16px`, emitted BEFORE `.bk-main`.
  Holds: values → actions (or the signed-out signin-row) → Edit/more → Find this book.
- **`.bk-cols` + `.bk-aside` — DISSOLVED** (removed from the DOM). They were the reason the three
  stacks shared a page but not a grid.
- **THE FOLD** — `.bk-reading` is gone as a card. Rating **and Finished** → the hero's meta line;
  Status + Passages-marked **dropped** (they restated the read-status control and `.bk-tcount`).
- **Hierarchy** — `.bk-meta` ("The book") + `.bk-about` recede to the FOOT of `.bk-main`;
  at ≥1200 `.bk-meta` renders as a rule-topped footer row, not a peer card.
- **Width buys structure** — `.bk-marg` becomes `[annotation | meta]` at ≥1200 (CSS-only:
  `buildMargCard` already emitted `.bk-annot` + `.bk-margmeta`). All prose ≤72ch.

**Files:** `js/views.js`, `assets/components.css`, `sw.js` (cache), + docs. **ES3 held**
(`var`/`function`, string concat, no template literals) — `tools/parse-check` PASS.

---

## 2 · Gates — all widths, all paths

| Gate | 1280 | 1440 | 1920 | Threshold |
|---|---|---|---|---|
| D1 occupancy | 94.9% | 84.2% | **63.0%** | ≥60% @1920 — PASS |
| D2 widest prose | 72.0ch | 72.0ch | 72.0ch | ≤72ch — PASS |
| D3 h-scroll | **0** | **0** | **0** | 0 — PASS |
| D4 pointer | 18/18 | 18/18 | 18/18 (23/23 rich) | PASS |
| D5 body | 16px | 16px | 16px | unchanged — PASS |

**D1 is UNCHANGED at 1920 (63.0% → 63.0%) and that is the point.** D1 was never the failing gate;
the 1200 shell cap is untouched. This pass bought the hole and the hierarchy, not occupancy.
(An earlier prototype read 64.2% — from a run whose rail was mis-placed into row 1. Discarded, not
quoted.)

### The vertical instrument — the actual headline

On **DEFAULT data** (empty `valueMarks` — the baseline's *worst* case, and what almost every book
shows, since `valueMarks` starts empty):

| `rig.hollow('.bk-rail > *')` | Baseline | Built |
|---|---|---|
| gaps | **195 / 14 / 14** | **16 / 16 / 16** |
| maxGap / medianGap | 195 / 14 | 16 / 16 |
| `suspect` | **true** | **false** |
| verdict | "HOLE: a track is sized by a sibling" | "uniform rhythm" |

`hollow_main` uniform (26/26) · `hollow_marg` uniform (13/13).

### "One composition" — measured, not asserted
`hero.left == main.left == backlink.left` ✓ · `rail.right == backlink.right` ✓ ·
`hero.right == main.right` ✓ · `railStartsWithHero: true` ✓ · `heroAboveMain: true` ✓

### Hierarchy
"In your thinking" **542px / 28.5% → 816px / 42.8%** @1920 (64.5% @1280, 57.3% @1440).
ISBN demoted from a 250px peer card to a footer row.

### D6 — the real instrument
One real Tab arms the modality, then `rig.ringProbe` on 8 controls: **all `fv:true`**, outline
`2px rgba(255,206,74,.5)` offset `2px`, radii undeformed (star `0px`, pills `999px` — no
DW-RING-RADIUS bleed). `.bk-star` added to the ring list because the fold moved it into the hero.

### On-demand panels (DW-3's lesson — an idle table is not sufficient)
All 4 opened (3 pickers simultaneously, then the edit panel): **RAIL_COLLISIONS: []** ·
**PANEL_COLLISIONS: []** · `panelsBelowHero: true` · `panelsAboveMain: true` · h-scroll 0.
Panels moved from DW-3's `1 / -1` to **col 1** — full-width would now collide with the rail
spanning rows 2-7 in col 2. They are 816px instead of 1200px; still a prominent band below the hero.

### Paths
- **Signed-out** — signin-row in the rail; `.bk-actions`/`.vr-card`/`.bk-controls`/`.bk-rate`/
  artifact/edit-toggle correctly absent; `Find this book` in the rail; `.bk-meta` in main;
  head forks to "In this reading"; 3 seed marginalia surface (W12 S10); no rail/main overlap;
  hollow uniform; D1 64.1%; D3 0.
- **Not found** — "Book not found." + backlink, no rail, no main, no crash, h-scroll 0.
- **Console** — clean (0 errors) across every path driven.

---

## 3 · The mobile re-gate (owed: DOM changed ⇒ fingerprints legitimately differ)

Measured **like-for-like** — the fixture stripped back to exactly the baseline's data (no
valueMarks, no artifact, no finishedAt), because a fixture-vs-baseline comparison would be fiction.

| | 390 | 1024 |
|---|---|---|
| nodes | 126 → **117 (-9)** | 143 → **134 (-9)** |
| h-scroll | 0 → **0** | 40 → **40** (ON-7, pre-existing) |
| truncation | none | none |
| `.bk-shell` | `block` (grid is ≥1200-only) | `block` |
| `.bk-marg` cols | `none` (structure is ≥1200-only) | `none` |
| `.bk-meta` | still a card (footer is ≥1200-only) | still a card |

**ON-7's 760-1199 residual measured INTACT and untouched**: h-scroll exactly 40, `.bk-surface`
`content-box`, `mq1200:false`, sole overflower = the pre-existing surface. Not mine to fix.

### THE DELTA LIST (≤1199) — every change, enumerated
1. **`.bk-reading` card removed** (the fold). Rating → hero meta line. Finished → hero meta line
   (only renders when the book carries a date). Status + Passages-marked **dropped** as
   restatements. Net **-9 nodes**.
2. **`.bk-edit-toggle` + `.bk-find` hoisted** from page-last to just after the actions (they became
   rail children, and the rail precedes main).
3. **Hero's controls line now carries Rating (+ Finished)**.
4. **`.bk-edit-panel` re-inserted before the picker hosts** (`insertBefore`, not `appendChild`) so
   it stays adjacent to its toggle. **This item was MISSING from the first version of this list,
   and the list claimed to be exhaustive — see Defect 4 below.**

**Content-complete** — every element the baseline rendered is still present: backlink, hero, cover,
title, author, tags, rstatus, **rating**, moved-me, values, 3 actions, thinking, 3 marginalia,
artifact, The book, Edit/more, Find. Only `readingCard: false` — the intended fold.
**Order preserved**: values → actions → thinking → artifact → The book.
**Flagged for Preston's mobile felt glance.**

### Focus order (Preston's condition)
`POSITIVE_TABINDEX: []` → **`tabOrderEqualsDomOrder: true`**, so DOM order IS the traversal order.
Region sequence: **shell → HERO → RAIL → MAIN → shell**. `focusVisibleFailures: []` across 25 stops.
Two upward steps: (a) **hero → rail, 168px up** — the column-to-column turn a two-column layout
implies (the alternative, main-DOM-first, jumps **~2000px** up at the end); (b) the Yumi FAB
(`position:fixed` chrome, last on every surface — not a jump).
**HONEST LIMIT:** the pane's synthetic Tab **arms** `:focus-visible` but does **not** advance focus
(`tabDidMove:false`), so a literal 26-keystroke walk is impossible here. Order proven by
no-positive-tabindex + DOM order + geometry; rings by `ringProbe`. Named **DWP-RIG-TAB**.

---

## 4 · Defects found and fixed (self-caught)

1. **D3 REGRESSION @1280 (h-scroll 9px).** The rail's `width:100%` made `.vr-card` 382px — this
   surface has **no global border-box reset** (the MW3-BKBOX quirk), so it is `content-box`:
   340 + 40 padding + 2 border. **Invisible at 1920** (the centred shell had room) and **invisible
   in the mockup** (mockups carry `*{box-sizing:border-box}`). Fixed: delete `width:100%`; the flex
   column's `align-items:stretch` sizes them correctly at any box-sizing. Re-verified 0 at
   1280/1440/1920, and 390's fingerprint identical pre/post (the rule is ≥1200-only).
2. **D2 FAIL on the signed-out path (85.1ch).** `.lum-yumi p` — the hero whisper — uncapped.
   Unseeable signed-in: `rootedSubTheories` is owner-filtered, so the stub renders no whisper while
   signed-out renders it (seed roots surface, W12 S10). Pre-existing (the hero was already 816
   wide), but D2 is measured live and must pass on every path. Capped ≤72ch, **scoped to
   `.bk-surface`** — `.lum-yumi` is shared chrome and an unscoped cap would bleed. 85.1 → 72.0ch.
3. **My own proposal was wrong.** `grid-row:2 / -1` put the rail in **row 1, above the hero**
   (rail y192 vs hero y636): `-1` names the last line of the EXPLICIT grid and this grid declares
   no `grid-template-rows`, so the range inverts. The Stage-0 prototype had the same bug and its
   *uniform gaps hid it* — a flex column gives uniform gaps whatever row it sits in. Fixed to
   `2 / 8`; `railStartsWithHero: true` verified.

4. **BLOCKING, caught by `fix-red-team`, NOT by me — the Edit/more panel was orphaned at ≤1199.**
   The toggle moved into the rail (near the page top) while the panel stayed `appendChild`-ed to
   the shell **after `.bk-main`**. At ≥1200 `grid-row:6` hid the mistake. Below 1200 `.bk-shell` is
   `display:block`, so DOM order IS visual order: tapping **Edit / more** re-rendered, flipped the
   label to "Close edit" and `aria-expanded=true`, and put the panel **~1500-2500px below**, under
   the entire thinking block — **nothing visible happens**, with no `scrollIntoView` on the toggle.
   A shipped control, dead at every width below 1200. **Why I missed it:** `_bookDetailEditOpen`
   defaults to `false`, so my ≤1199 re-gate rendered with the panel *absent*; my "all 4 panels
   opened" evidence was a ≥1200-only measurement. My delta list then claimed to enumerate *every*
   change while missing this one. This is the exact class CLAUDE.md's Live Forensic Smoke Test
   exists for ("if a human can't see it or click it, it isn't done"). **Fixed:**
   `surf.shell.insertBefore(panel, editorHost)` — adjacent at every width; ≥1200 unaffected
   (grid placement ignores DOM order).
5. **My "the hole cannot exist by construction, at any data shape" was an OVER-CLAIM** — also the
   red-team's catch, then reproduced by measurement. See DWP-RAIL-INVERT in §5. The claim is now
   narrowed in views.js, components.css, this record and BOARD.md.
6. **`.bk-margmeta` carried its stacked-layout divider into the side-by-side grid** — base
   `margin-top:13px` + `border-top` (components.css:10918, re-pinned :11048) drew a rule *above* a
   column that now sits *beside* the text. Reset at ≥1200.
7. **`.bk-about` was an inert hook** — the class was emitted with zero CSS rules. Removed.

**Two corrections to my own Stage-0 report, both surfaced by reading the code:**
- I told Preston **"Rating is `.bk-reading`'s only unique payload." That was wrong** — there is a
  4th row, **`Finished`** (views.js), conditional on `dateRead`/`finishedAt`; the seed book has
  neither, so it never rendered. By the ruling's own logic (only restatements die) it **survives**
  and folds to the hero. Carried as a determination, flagged for veto.
- `.bk-aside` also held **"What it's about"** (`.bk-synopsis`), invisible on the seed (empty
  description). Receded to the main column's foot with `.bk-meta`, and capped ≤72ch.

---

## 5 · Residuals (named, carried)

### DWP-RAIL-INVERT — **an OPEN FORK for Preston, not a silent residual**
The rail is a **spanning** grid item (`grid-row:2 / 8`), and col 1 is **not** one object (hero,
panels, main are separate rows). A spanning item contributes to the intrinsic sizing of every track
it spans, so the DW-3 failure mode **inverts** instead of dying: when the rail out-grows the whole
col-1 stack, its excess inflates rows 2-7 and a void opens **under the hero**.

**Reproduced @1920** — 10 value-marks-with-lineage on a book with no marginalia, no roots, no
description: rail **1033px** vs col-1 **1033px** → **220px hero→main void**; `grid-template-rows`
showed the idle picker rows blown from **0 → 49.5px each**. `rig.hollow` scored it *"uniform rhythm
(max 220 / median 220)"* — **the instrument cannot flag a single gap** (max == median). Trigger
needs roughly **9+ value marks** on an otherwise-empty book.

**The cure and its cost:** col 1 must become ONE object too (a `.bk-content` wrapper). But hero and
main both live in col 1 while mobile needs `hero → rail → main` — so any col-1 wrapper forces the
rail either above the hero or below the thinking on mobile. **That is an architecture fork; it is
Preston's call and is NOT carried silently.** Options: (A) ship as built, residual named and
measured (the shape is unusual); (B) col-1 wrapper + a re-specified mobile order.

### DWP-D2-SELECT — a rig artifact, named so it is not mistaken for a gate failure
With the **Edit/more panel open** at ≥1200, `rig.widestProse` reports **76.3ch** — but the element
is `.bk-edit-select`, a `<select>` **form control**, not a prose block. The rig's `leaves()` counts
it because a closed select's `<option>`s have zero-size rects, so its concatenated option labels
read as a single text leaf. An independent scan excluding element-child-bearing nodes returns
**`over72: []`** — no real prose block exceeds 72ch on this surface, panel open or closed. The
select also *improved* here: DW-3's full-width (1/-1) panel rendered it ~1150px; at col 1 it is
678px. Not fixed (capping a form control is out of this pass's scope); named.

### Also carried
**DWP-DEADCODE** · **DWP-D6-UA** · **DWP-NO-H1** · **DWP-FOCUS-ORDER** · **DWP-RIG-RINGS** ·
**DWP-RIG-TAB** · **DWP-RIG-README** · **DWP-STATUS-DUP** (closed by the fold) — see
`docs/studio/book-detail.md` § Next for each. Note `statusText()` is **not** orphaned (still used
at views.js:879 / :1769) — it is excluded from DWP-DEADCODE.

**Untouched by rule:** ON-7 @760-1199 · on-demand rows 3-6 semantics · `.bk-star` 44×44 (MW-3) ·
R7 decisions F1-F6 · the 1200 shell cap.

**Chip: `desktop: composed` HELD, not raised** — under-claim law. `native` awaits the deployed
felt pass.
