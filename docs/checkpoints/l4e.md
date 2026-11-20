# L4e — the drifting sky: every orb named and in motion, the flower in your categories' colours, a thread from each orb

L4e STARTED 19 Nov 2026 (Opus 5.5, executing the written patch). Base dc2b797 / v3.334.

19 Nov 2026 · Opus 5.5 executing an already-written, already-measured patch (the motion was designed and written by Fable in
the review chat and approved by Preston from a 60-frames-a-second clip), applied byte for byte on main at `dc2b797` (v3.334) ==
origin/main. Preston's go-ahead included "run fix-red-team on this". **Status: pushed at `e9119d5` (v3.335); Preston's phone
check PASSED on every step (20 Nov 2026, L4f R1, `docs/checkpoints/l4f.md`).**
CACHE_VERSION `praxis-v3.335`. **js/hand.js is locked again at `dc6a021e5b89652cf5e6c0a84ae249cd` (53,596 B).**

## Rulings, worded as given (19 Nov 2026)

- **R1** My phone check of L4d at v3.334: the still sky works and every category has its name. But I want the orbs to still
  move, and all of this to still affect the colour of the flower and the overall flow and connection.
- **R2** js/hand.js is UNLOCKED for this one build, from 1674586b3645239d832c7b63832268d2, for the drifting sky. After this
  build it is locked again at its new md5. Every later check that names hand.js 1674586b… as a foundation uses the new md5 from
  this build on; the old records stay as history and are not rewritten.
- **R3** The motion. Every orb shows its name AND moves. It is not an orbit and not a track: "it should just be smoothly
  flowing throughout, beautifully, not some generic circle." The orbs are in more motion, not necessarily faster, at the
  quality of an Apple app. I approved the review chat's clip of this build's motion on 19 Nov ("Yes, build it").
- **R4** The same treatment in all three You modes: Lenses, Categories and Marks. Home's sky does not change.
  *(Its last sentence is superseded by L4f R2, 20 Nov 2026: Home's sky follows You's Lenses rule — a thread from each orb, and a
  full sky drifts with every name; `docs/checkpoints/l4f.md`.)*
- **R5** With few lenses the short turning sky stays as it is. The drifting sky with every name is used only where names
  would otherwise hide: a full sky (the engine's own "many" or "tight"). In Categories, By the orbs always shows every name and
  drifts; the List keeps the turning sky above it.
- **R6** In Categories the flower is coloured by my categories, more petals for the fuller ones. In Lenses and Marks it keeps
  the colours of my kept lenses.
- **R7** A stronger current around the category and book orbs, and a fine thread from each orb to the flower, in all three
  You modes. Keep the threads, with a way to switch them off: the Threads switch in the sky's sheet (hold the flower) turns
  them off and on.
- **R8** Folded in from L4d's ledger: the sky lays itself out again when the phone is turned or the window resized (S-2, F6);
  the stars fill the whole of a tall sky (F7).

## Found on the way (live at v3.334, fixed by this build)

With Reduce Motion on, By the orbs lays its rows about the wrong middle and the top rows sit off the top of the sky. Cause:
L1.2b's reduced-motion rule gives every property a 0.01 ms transition (`transition-duration` with the default
`transition-property: all`), the field's height included, so the height `fixedRows` reads back in the same breath as writing
it is still the old one (300 or 360), and `G.H` and `G.cy` are wrong. This build sets `G.H` and `G.cy` from the height just
written, and stops the field's own transition under reduced motion. Measured BEFORE and AFTER in § 2.9.

## What was built

The review chat's diff, applied exactly: 276 lines, 26,744 B, md5 `de55b074c025bbf753c5ec93b3afa9df`.

- `js/hand.js` — `S.toggles` accepts `auto`, `drift`, `stems`; `S.build` makes a sky fixed when `fixed` is on OR when `auto`
  is on and the sky is full (many or tight), and drifting (`S.fl`, class `flow`) when it is fixed, `drift` is on and Reduce
  Motion is off; the signature carries the stems and drift flags; the flower redraws when its looks' colours change
  (`data-n` carries each look's first colour); a drifting sky keeps every orb's place and speed across a rebuild only when
  the width and count are the same and every orb finds its old self by name, else all start from their cells with the class
  `rise`; with stems on, one `g[data-s]` path per orb in `[data-threads]`; the stars are strewn over the field's real height,
  again when it changes (a turning sky's stars as before). `fixedRows`: a drifting sky under 460 px caps an orb at 66 px and a
  name at 76 px; a drifting sky is at least 360 px tall and tall enough that its orbs and names fill no more than 36% of it;
  each orb starts at its cell; `G.H` / `G.cy` set from the height just written. New `drift(dt)`, called from `S.place` on each
  ordinary frame of a drifting sky; `S.place` moves a drifting orb by `translate3d` (left/top 0 once), draws the stems, and
  gives category and book orbs the flow canvas's .42 pull; `S.tick` keeps `S.dt` and `S.tm`; one debounced listener on
  `resize` and `orientationchange` rebuilds a sky whose width changed; `VERSION` → `'hand.js L4e · 2026-11-19 · Fable 5.2'`.
- `js/views.js` — You → Lenses: `toggles({auto:true, drift:true, stems})`; Categories and Marks: `auto` (not in Categories),
  `drift`, `stems`; in Categories the flower's looks are the categories' own (one petal each, then extra petals by share of
  books, up to 30); the sky sheet's Threads switch also sets stems on the You sky, with the small print "A thread from each orb
  to your flower, and between lenses that share a book" on You; `lxFillCatNames`'s one comment.
- `assets/components.css` — the L4e block after the hotfix 2 block: names showing in any fixed sky, `will-change` on drifting
  orbs, the rise, the stem's stroke, the You host's height cap lifted while its sky is fixed, the field's transition off under
  reduced motion.
- `sw.js` — `praxis-v3.334` → `praxis-v3.335`.

## Felt delta (owner-visible, at Preston's viewports)

- **390 (phone), You → Categories → By the orbs.** Before: every category named, sitting still in rows about the flower, sky
  ~690 px. After: every category named and drifting slowly through a taller sky (~870 px with 17 categories), never on each
  other; a fine thread from each to the flower; the flower in the categories' colours, more petals for the fuller ones; the
  forms a little smaller under 460 px (≤ 66 px).
- **390, You → Lenses with a full sky (7 or more lenses under 560 px) and Marks (7–8 books).** Before: a turning ring, most names hidden. After:
  every name showing and drifting, threads to the flower. With 3–6 lenses: the same short turning sky, now with threads.
- **1360 (desktop), You → By the orbs.** Before: still rows, 484 px. After: the same height, drifting, threads, the
  categories' flower. Lenses and Marks at 1360 keep the turning sky (not full there), now with threads; List keeps turning.
- **Home, both widths:** no change. **Reduce Motion:** the still rows, now correctly placed (they sat off the top before).

## Stage 0 — pre-flight: PASS

HEAD `dc2b797` == origin/main (after `git fetch`), CACHE_VERSION `praxis-v3.334`, tracked tree clean, hook gate ARMED
(FIX-PROTOCOL v1.3). All eleven protocol documents and the seven agent files found; `l4e.md` did not exist. The four
before-numbers (hand.js 46,181 `1674586b…`, views.js 1,407,007 `2db9653d…`, components.css 951,830 `41dda363…`, sw.js 6,894
`cbe2f579…`) and the five unchanged files MATCH. The diff extracted at 276 lines, 26,744 B, md5 `de55b074…`; `git apply
--check` passed and the dry apply on scratch copies of the HEAD blobs gave the four after-md5s exactly.

- **The lock (0.6).** Nothing enforces hand.js's md5 in code: `hooks/pre-commit` checks lumen-amber.css's md5 (against
  FIX-PROTOCOL §2) and marks.js by name only; no tool or test reads hand.js's bytes (tools/lens-data-test loads it for
  `contrast` / `gardenColour` / `SKY_NIGHT` / `SKY_DAY`). The standing-rule text: BOARD.md, BUILD_STATE.md, sequence.md,
  l4.md, l4d.md — **and `docs/studio/l4-lens-engine-contract.md` §8**, which the review chat's list missed (and the generated
  `docs/studio/builder.html`).
- **Names (0.7).** Outside hand.js only views.js touches the sky (`rec.S.set` / `toggles` / `build` / `sig`); nothing reads
  `S.orbs`, `PraxisHand.skies` or an orb's fields. None of the new names existed (sky: auto, dri, stems, fl, dt, tm, fxW, fxN,
  fxWas; orb: px, py, vx, vy, ux, uy, bw, bh, oy, tf; CSS `.rise`, `.stem`, `lxOrbRise`; `.flow` appears once, in a comment at
  components.css:4627).
- **Marks holds at most 8 orbs** (`list.slice(0, 8)`, views.js): "Marks with 9 and 20 marked books" both draw 8. Eight is
  `tight` (a full sky, so it drifts) only under 560 px; from 560 up it is a short turning sky under R5.

## Stage 1 — apply: PASS

`git apply` on the working tree, the four files staged by name. Staged blobs (`git cat-file -p :<path>`), all CR 0:

| file | bytes | md5 | expected |
|---|---|---|---|
| js/hand.js | 53,596 | `dc6a021e5b89652cf5e6c0a84ae249cd` | MATCH |
| js/views.js | 1,407,990 | `186524e50973a9c42bf25e963169d05e` | MATCH |
| assets/components.css | 952,708 | `2e058502e74eb2f3e49119a031fc71b9` | MATCH |
| sw.js | 6,894 | `6f9955893dfe5041ef82770483e504bb` | MATCH |

numstat `59 14` js/hand.js · `12 3` js/views.js · `13 0` assets/components.css · `1 1` sw.js (as expected).
`tools/parse-check`: PARSE OK, exit 0, on all 20 JS files (19 under js/ and sw.js); a broken copy of hand.js exits 1. Added
lines in the two JS files: `const ` 0, `let ` 0, `=>` 0, `class ` 0, backtick 0; hex in the added CSS 0. The five unchanged
files at their numbers (state.js `b8cdafb5…`, integrations.js `2d86b859…`, theme.css `571e0ccc…`, lumen-amber.css
`631bc2aa…`, marks.js `772886c0…`). (`git apply` wrote hand.js CRLF in the working tree; it was rewritten from the staged
blob so the working copy stays LF as before — the blob is unchanged either way.)

## Stage 2 — measure, test and look (headless Chrome over CDP, CSS animations ON, 19 Nov 2026)

Rig (untracked, never staged): `.claude/rig/captures/l4e/` — `l4e-rig.js` (probes, `window.L4E`), `l4e-run.ps1` (CDP phases;
head copied from `../l4d/l4d-run.ps1`), logs `log-*.txt`. Served by `../l4b2bhf1/serve-root.ps1`: **8872 the working tree
(AFTER)**, **8873 a `git archive` of dc2b797 + the rig files (BEFORE; its four files re-md5'd to the dc2b797 blobs)**. Fixture:
the l4 fixture + hf1 + **a realistic shelf seeded in memory by `L4E.seed()`: 17 categories holding 67, 37, 26, 21, 18, 14, 11,
9, 7, 6, 5, 4, 4, 3, 3, 2, 2 books (239 books; the fixture's own books ride in the fullest)**; `L4E.cats(n)` keeps the n
fullest; kept lenses by `l4Show(n)` (35 extra lens records added in memory for 20 / 30 kept); Marks seeded by `L4E.marks(n)`
with real-length titles ("Braiding Sweetgrass: Indigenous Wisdom, Scientific Knowledge and the Teachings of Plants" and 19
others). 320–430 = phone emulation (dpr 2, mobile); 560 and up dpr 1. Nothing reaches Firestore. The rig's `#__rig_settle`
keeps transitions off but animations ON (`HF.motionOn`); for the Reduce Motion runs it carries no transition rule at all, so
L1.2b's 0.01 ms transitions apply as on a phone.

### 2.1 Suites at their dc2b797 counts — PASS
lens-eval 68/68 · lens-data 101/101 · export 58/58 · delete 58/58 · ceiling-core 36/36 · fx1c-sim 60/60 · L4b-1 hotfix 46/46 ·
L4b-2a unit 71/71 · L4b-2a hotfix 1 unit 74/74 · L4b-2b unit 120/120 · L4b-2b hotfix 1 unit 74/74 — each read by its own
printed total, all exit 0.

### 2.2 The engine's time — PASS on a quiet host (a first run on a loaded host failed; both recorded)
`S.place` wrapped, every ordinary call timed with `performance.now()`, 20 s per case per throttle, 17 categories. **The run
that counts (`log-perf2.txt`, 17:47–18:12, no other rig running, host CPU ~13 % by `Win32_Processor.LoadPercentage` read by hand just before — not logged; 1× gives 35–60.1 fps BEFORE (35 only at 1360 Lenses 12) and 57.6–60.1 AFTER, in the log):**

| case (kept) | BEFORE CPU 4× mean / p95 | AFTER CPU 4× mean / p95 | BEFORE 1× mean / p95 | AFTER 1× mean / p95 |
|---|---|---|---|---|
| 390 Home (3) | 0.45 / 1.2 | 0.29 / 0.8 | 0.08 / 0.2 | 0.08 / 0.2 |
| 390 Lenses (3, turning) | 0.25 / 0.6 | 1.01 / 3.6 | 0.07 / 0.2 | 0.14 / 0.3 |
| 390 Lenses (12; AFTER drifting) | 0.98 / 2.9 | 1.41 / 4.0 | 0.18 / 0.3 | 0.24 / 0.4 |
| 390 Categories List (turning) | 0.49 / 1.1 | 1.49 / 3.9 | 0.08 / 0.2 | 0.23 / 0.4 |
| 390 By the orbs (BEFORE still, AFTER drifting) | 0.37 / 0.9 | 1.58 / 4.1 | 0.07 / 0.2 | 0.22 / 0.4 |
| 390 Marks (8; AFTER drifting) | 0.35 / 0.8 | 0.85 / 1.9 | 0.08 / 0.2 | 0.17 / 0.3 |
| 1360 Home (3) | 0.25 / 0.5 | 0.28 / 0.6 | 0.07 / 0.2 | 0.07 / 0.2 |
| 1360 Lenses (3) | 0.23 / 0.4 | 0.38 / 0.8 | 0.07 / 0.2 | 0.11 / 0.2 |
| 1360 Lenses (12, turning) | 3.12 / 8.9 | 1.45 / 4.2 | 0.41 / 0.7 | 0.23 / 0.4 |
| 1360 Categories List | 0.49 / 1.0 | 1.21 / 3.9 | 0.09 / 0.2 | 0.18 / 0.3 |
| 1360 By the orbs | 0.42 / 1.2 | 1.68 / 4.4 | 0.07 / 0.2 | 0.26 / 0.4 |
| 1360 Marks (8, turning) | 0.33 / 0.6 | 0.61 / 1.4 | 0.08 / 0.2 | 0.13 / 0.2 |

**AFTER: mean < 2 ms (max 1.68) and p95 < 5 ms (max 4.4) in all 12.** AFTER is above BEFORE in most You cases — the drift itself,
and in the turning You skies the stems (one path `d` per orb per frame) — and below it in 1360 Lenses 12. Hand-stepped cost of
the drift alone (the same drifting sky with `S.fl` switched off in memory, `log-attr2.txt`): 390 By the orbs 1× 0.15 against 0.07
ms; 4× 2.0–2.7 against 1.2; 1360 4× 0.66–0.76 against 0.52. **The first run (`log-perf.txt`, 16:39–17:01, host CPU ~36 % from
other applications by the same hand reading, not logged; 1× only 16.3–51 fps BEFORE in the log) failed the bar** — AFTER 4× means 1.4–15.4 ms, p95 up to 43 ms; BEFORE's
own 4× means reached 9.8 ms there (1360 Lenses 12) — so it measured the host, not the engine; recorded, not used for the verdict.

### 2.3 Frame rate (fps · worst 1 s, own rAF counter over the same 20 s windows) — reported; headless Chrome on this machine is not an iPhone
CPU 1× (quiet run): BEFORE 35–60.1 fps (35 only at 1360 Lenses 12), worst 1 s 25–60; **AFTER 57.6–60.1 fps, worst 1 s 34–60** —
the two under the contract's 45 are 390 Categories List (AFTER 34, BEFORE 31) and 1360 By the orbs (AFTER 40, BEFORE 58). CPU 4×:
BEFORE 6.5–38.8 fps, AFTER 12.7–36.0; neither build reaches the §6 gate (≥ 55, no second under 45) at 4× in headless Chrome.
`PraxisHand.stats()` deltas agree with the rAF counter within 0.3 fps. **The contract §6 gate stays owed on the iPhone before the
beta;** these are the engine's own before/after on this machine.

### 2.4 No layout reads while it moves — PASS
~600 ordinary frames per case (real loop, `S.place` wrapped): **getBoundingClientRect 0 · getComputedStyle 0** in every case;
offsetWidth / offsetHeight 102/102 (390 By the orbs), 119/119 (1360 By the orbs), 84/84 (390 Lenses 12), 48/48 (390 Marks),
120/120 (390 List), 21/21 (390 Home) — **every one from `readDims`** (stack-checked). **Writes:** in a drifting sky no orb's
`style.left` / `style.top` changed in 390 (390 px) and 449 (1360 px) ordinary frames, while `transform` changed 6,630 / 7,621
times (17 orbs a frame); the turning List writes left/top every frame as before and no transform.

### 2.5 The drifting sky against the real DOM — PASS
10 widths (320, 360, 390, 430, 560, 760, 900, 1024, 1200, 1360) × Night and Day × Categories (By the orbs) 2, 3, 5, 7, 9, 12, 17 ·
Lenses 7, 9, 12, 13, 20, 30 · Marks with 9 and 20 marked books · Lenses 12 with one 40-character name ("Technologies of
liberation and oppression") = **320 cases**, each 90 simulated seconds at dt 1/60 sampled 120 times against each name's own
rectangle, each form's drifting rectangle (the `.art` box, CSS sway included), the field's edges and the flower's middle (0.54 ×
its width). **248 drifting skies: every name showing in every sample; 0 names on names (> 1 px), 0 names > 5 px into another
form, 0 forms > 5 px into each other, 0 outside the field, 0 on the flower's middle — and every maximum depth 0.** The other 72
stayed turning skies as R5 says: Lenses 7, 9 and 12 (and 12 with the long name) and Marks (8 orbs — Marks holds at most 8)
from 560 up. Field heights (Night; Day identical in all 160 pairs):

| case | 320 | 360 | 390 | 430 | 560 | 760 | 900 | 1024 | 1200 | 1360 |
|---|---|---|---|---|---|---|---|---|---|---|
| Categories 2 | 360 | 360 | 360 | 360 | 360 | 360 | 360 | 360 | 360 | 360 |
| Categories 3 | 360 | 374 | 380 | 380 | 484 | 360 | 360 | 360 | 360 | 360 |
| Categories 5 | 429 | 430 | 410 | 410 | 484 | 560 | 516 | 552 | 360 | 360 |
| Categories 7 | 517 | 480 | 443 | 402 | 525 | 560 | 516 | 552 | 560 | 560 |
| Categories 9 | 584 | 546 | 504 | 457 | 588 | 544 | 516 | 544 | 544 | 544 |
| Categories 12 | 749 | 710 | 655 | 612 | 734 | 586 | 516 | 544 | 544 | 544 |
| Categories 17 | 995 | 942 | 870 | 789 | 804 | 798 | 508 | 484 | 484 | 484 |
| Lenses 7 / 9 / 12 | 487 / 563 / 730 | 477 / 549 / 716 | 440 / 506 / 661 | 399 / 459 / 599 | turning 300 | → | → | → | → | → |
| Lenses 12 + 40-char name | 747 | 724 | 669 | 606 | turning 300 | → | → | → | → | → |
| Lenses 13 | 791 | 777 | 717 | 650 | 635 | 498 | 418 | 376 | 376 | 376 |
| Lenses 20 | 1,174 | 1,161 | 1,072 | 972 | 954 | 727 | 610 | 539 | 460 | 406 |
| Lenses 30 | 1,724 | 1,666 | 1,538 | 1,395 | 1,356 | 1,030 | 866 | 765 | 652 | 582 |
| Marks 9 and 20 (8 orbs) | 895 | 851 | 785 | 712 | turning 300 | → | → | → | → | → |

Below the sky, every case: the caption sits 34 px (Categories) / 6 px (Lenses, Marks) under the field, the You host never clips
(`scrollHeight` ≤ `clientHeight`), the next block on the page starts at the host's bottom (gap 0, no overlap). **The 600 px cap at
≥ 1200:** the drifting Lenses skies that would have crossed it are Lenses 20 at 1200 (host 623.5 px) and Lenses 30 at 1200 and
1360 (815.5 / 745.5 px) — the L4e CSS lifts it while the sky is fixed (`max-height: none` measured) and nothing was clipped;
Categories' host (617.5–817.5 px) was already uncapped by L4b-2b hotfix 1's rule while the List / By the orbs switch shows. Our heights differ a little
from the review chat's (390 / 17: 870 against 884; 320: 995 against 1,011; 760 and 1360 equal) — the fonts.

### 2.5b How it moves — PASS (engine state only; boxes from centre, size and the name's measured size)

| case | dt · span | mean px/s | fastest | < 3 px/s | max Δv px/s² | closest boxes | overlaps · outside | travel least / most | path span of H |
|---|---|---|---|---|---|---|---|---|---|
| 320 · 17 cats (H 995) | 1/60 · 5 min | 10.7 | 26 | 20.1 % | 58 | 4.3 px | 0 · 0 | 2,582 / 4,017 | 52–88 % |
| 390 · 17 cats (H 870) | 1/60 · 5 min | 10.8 | 26 | 19.7 % | 78 | 3.1 px | 0 · 0 | 2,273 / 4,258 | 30–91 % |
| 760 · 17 cats (H 798) | 1/60 · 5 min | 14.9 | 26 | 7.9 % | 110 | 3.8 px | 0 · 0 | 3,468 / 5,923 | 53–88 % |
| 1360 · 17 cats (H 484) | 1/60 · 5 min | 13.3 | 26 | 8.7 % | 110 | 6.9 px | 0 · 0 | 3,286 / 4,829 | 52–82 % |
| 390 · 12 lenses (H 661) | 1/60 · 5 min | 10.7 | 26 | 21.6 % | 384 | 2.8 px | 0 · 0 | 2,181 / 4,199 | 43–84 % |
| the same five | 0.05 · 2 min | 10.6–15.4 | 26 | 8.9–22.6 % | 60–110 | 1.9–7.7 px | **0 · 0** | 637–1,046 / 1,761–2,321 | — |

Every bar holds: fastest ≤ 26.5, mean 8–20, slow share < 30 %, 0 overlapping boxes, every orb ≥ 1,200 px in five minutes (least
2,181). The 384 px/s² at 390 / 12 lenses is one orb held at an edge (one velocity component zeroed in one frame: at ≤ 26 px/s
that is under half a pixel). **Hidden page:** the real loop ran, the page was frozen 30 s (`Page.setWebLifecycleState`; the gap
seen by the loop was 117 s) and returned: the first frame back had dt 0.05 and **moved no orb more than 1.3 px** (≤ 1.5).

### 2.5c Taps — PASS
Form centre and name centre of every orb hit that orb's own button at three moments 4 s apart: **17/17 at 1360; 17/17 at 390**
(each orb scrolled into the 844 px viewport first — a first pass without scrolling read 14/17 because the three lowest orbs of
the 870 px sky were below the viewport, where `elementFromPoint` returns nothing); 0 buttons under 44 px. **Touch** at 390 on
Literary Fiction's moving form → `#category/Literary%20Fiction`; Back → `#profile`, the sky still drifting, the orbs where they
were (0 rise). **Click** at 1360 → the same; Back the same. **Keyboard:** Tab reached 17/17 orbs at 390 and at 1360, each with
the `:focus-visible` ring (2 px solid) while moving; Enter on a focused drifting orb → `#category/Genre%20Fiction` (and the same
at dc2b797); 0 page errors.

### 2.6 Nothing else moved — PASS on orbs; markup as described
28 cases (Home 3 and 12 at 390 and 1360; You Lenses 3 and 6 at 390, 3/7/12 at 760 and 1360; You Categories List 2/5/9/17 at 320,
390, 760, 1360), six fixed points of the turn (`S.tick` stubbed, `S.th` set, `S.place(true)` twice): **every orb's style.left,
style.top, class list, name classes and name transform identical BEFORE and AFTER in all 28 (0 differing rows; `log-same-cmp.txt`)** Home: stars,
threads and flower identical (the flower once its SVG gradient ids — a page-global counter that L4e advances more often because
it redraws the flower on mode switches — are normalised); the only other differences `data-h` on `[data-stars]` and the
flower's `data-n`; 0 stems. You turning skies: shared-book threads identical (path `d` aside), the stems added (3 / 6 / 7 / 12 /
17), Lenses' flower identical (ids normalised), Categories' flower different by R6. **The You stars** differed in this sweep — but
not from the patch: both builds keep the stars of the long-lived You sky from whichever size it was first built at, and the
sweep's history differed between them. On a sky first built at the case's own size they are **byte-identical** (390 Lenses,
390 List, 1360 Lenses, 1360 List: same 14 / 22 stars, same hash, BEFORE and AFTER).

### 2.7 Going in and out — PASS
List → By the orbs → List → Lenses → Categories → Marks → Categories → By the orbs, twice round, with 3, 12 and 20 kept, at 390
and 1360: the class `flow`, transforms (17 / 12 / 20 / 8), left/top 0, inline height (870 / 661 / 1,072 / 785 at 390; 484 at
1360), button widths and name max-widths **only** while fixed (By the orbs; Marks at 390; Lenses 12 and 20 at 390) and 0 in every
turning state; one loop (0.98 engine ticks a frame); 2 skies throughout; no growing orb count; the stars re-strewn with each new
height (34 at 870, 31 at 785, 26 at 661, 42 at 1,072; back to 14 / 22 in a turning sky). **Forced rebuild** of a drifting sky:
0.0 px moved, 0 rise (390 and 1360). **17 → 16 categories:** all 16 restart from their cells with `rise` (16/16), 0 overlaps.
**Threads off** in the sky sheet: By the orbs 17 → 0 stems, Lenses 3 → 0, Marks 8 → 0, Lenses 12: 12 stems + 13 shared-book
threads → 0 + 0; on again: all return; the small print on You reads "A thread from each orb to your flower, and between lenses
that share a book"; Home's switch still reads "Join lenses that share a book" and Home has no stems (as measured at v3.335;
superseded at L4f, v3.336: Home now reads the same line and draws a stem per orb). **Names off:** a turning
sky, no names, no inline height, no transform (By the orbs and Lenses 12). Storage: the only keys added in the session are
`praxis_mood`, `praxis_you_catnames`, `praxis_sky_threads` — all set by the rig or the switch, all existing keys; nothing new.

### 2.8 Turning and resizing — PASS
One page session each: 390 → 844 → 390 and 1360 → 700 → 1360, for By the orbs (drifting), List and Lenses (turning) on You and
for Home: every width change gave **exactly one build**, and within 0.5 s `G.W` equalled the field's width (844 / 390 / 700 /
1360 on You; 796 / 342 / 652 / 600 on Home); the drifting sky had **0 overlaps and 0 outside over the next 10 s**; 0 errors. A
height-only change (−120 px, the address bar) gave **0 builds** in all eight.

### 2.9 Reduce Motion (emulated before load) — the bug BEFORE, fixed AFTER — PASS
**BEFORE (dc2b797), By the orbs, 17 categories:** at 390 **`S.G.H` 300 against a field 690 px tall; the first row's tops −187,
−187, −182.5, −180 px; 12 names or forms outside the field** (and 1 on the flower) — the review chat's finding, reproduced
exactly; at 1360 `G.H` 300 against 484, first row −84 px, 6 outside. **AFTER:** 390 `G.H` 690 = the field's 690; first row at
8 px; 17/17 names; 0 outside; 0 on the flower; 0 overlaps; no orb moved in 2 s; no `flow`, no `rise`; 17 stems drawn. 1360: `G.H`
484 = 484, first row 8, the same zeros. Lenses 12 at 390: a still fixed sky 544 tall, `G.H` = 544, 12/12 names, 0 outside, 12
stems; at 1360 Lenses 12 is a turning sky (R5). Captures `l4e-byorbs-390-night-reduce-{before,after}.jpg`.

### 2.10 The flower — PASS
Categories, 17 / 9 / 3: 28 / 30 / 30 looks, 30 petals; **every category's colour on at least one petal; the fuller more**
(17: 5, 3, 2, 2, 2, 2, 2, 1 … 1; 9: 8, 5, 4, 3, 3, 2, 2, 2, 1; 3: 15, 9, 6). Categories → Lenses → Marks → Categories: `data-n`
different each time, so the flower is redrawn each time (Categories 28 looks, Lenses / Marks the 3 kept looks); Lenses' and
Marks' flower markup the same length as dc2b797's (86,848 chars) and identical in 2.6 once ids are normalised; **Home's flower
byte-identical to dc2b797** (same hash). (With 17 categories the extra-petal rounding gives 28 looks, so petals 29 and 30 repeat
the two smallest categories — `bloom` takes `looks[k % n]`.)

### 2.11 The stems and the current — PASS
Every stem starts at 0.6 of the flower's radius (`G.g × .3`, inside its edge) and ends 0.42 × its orb's size from its own orb's
centre — in each of 120 samples over 90 simulated seconds at 390 and 1360 By the orbs, 390 Lenses 12 and 390 Marks (0 drawn to
a missing orb); stroke = its orb's colour mixed .4 toward gold (17/17, 12/12, 8/8, 3/3), opacity .3. The flow canvas's pull for
category and book orbs: **.42 AFTER, .2 BEFORE**. Contrast of a name over a stem (the name's ink against the sky blended with
the stem at .3): **at least 7.61:1**.

### 2.12 Captures — `docs/checkpoints/l4e-shots/` (taken 19 Nov 2026, fresh on these bytes; hidden: the first-run intro panel only)
You → Categories → By the orbs, the whole You host (sky, caption, switch), at 320 and 390 (viewport 1,900 tall so the sky fits;
dpr 2), 760 and 1360 (dpr 1), Night and Day, BEFORE and AFTER: `l4e-byorbs-<w>-<night|day>-<before|after>.jpg`; three frames
ten seconds apart at 390, AFTER: `l4e-byorbs-390-night-t{0,10,20}s-after.jpg`; Lenses with 12 kept at 390:
`l4e-lenses12-390-night-*.jpg`; Marks (8 of 9 marked books, real titles) at 390: `l4e-marks-390-night-*.jpg`; Reduce Motion at
390: `l4e-byorbs-390-night-reduce-{before,after}.jpg` (BEFORE shows the top row pressed up under the Lenses · Categories · Marks
control and the rest of the rows off the top); Home at 390 (whole viewport): `l4e-home-390-night-*.jpg`. 27 files, 4.7 MB.

### 2.13 Walk at 390 — PASS
Real hit-tested clicks, motion on: Home orb → its lens sheet ("Who gets to deposit"). You → Lenses → "Freedom as practice" → its
lens sheet; Escape → `#profile`. Categories (List) → "Theory & Philosophy" (the first two orbs tried sat under a neighbour's
button in the turning full sky — L4d's S-4, older than this build) → `#category/Theory%20%26%20Philosophy` → Back → `#profile`.
By the orbs → "Theory & Philosophy" (moving) → its category page → Back → `#profile`, still drifting. Marks → "Braiding
Sweetgrass: Indigenous Wisdom, Scientific Knowledge and the Teachings of Plants" → `#book/bk_e4_105` → Back → `#profile`, still
drifting. **0 page errors.**

### What the rig cannot show
iPhone Safari: its frame rate, heat and battery (contract §6 stays owed before the beta), a real iPhone's 60/120 Hz frame cadence,
WebKit text metrics (names may break onto a different number of lines, so the drifting sky's height and boxes will differ a
little), compositor-layer cost of `will-change` on an old iPhone, VoiceOver's reading of moving orbs, and the real font swap on a
cold PWA start. The stems' look and the motion's quality are Preston's felt call on the phone.

## Stage 3 — the red-team and the reviewer

**fix-red-team (Sonnet, frontmatter-pinned), on the staged tree:** `RED-TEAM: findings (0 BLOCK, 1 MAJOR, 5 MINOR, 2 NIT)`. It
re-derived the four staged md5s (MATCH), the diff's scope (exactly the four files) and parse OK; it ran no browser.

| id | sev | finding (red-team's words, condensed) | checked in the rig / disposition |
|---|---|---|---|
| RT1 | **MAJOR (document, not code)** | At dc2b797 By the orbs was the one still sky; now every You sky that shows all names drifts, and the OS's Reduce Motion is the only way to stop motion — WCAG 2.2.2 (moving content that starts by itself, lasts > 5 s, no pause). The turning sky already had no in-app stop; the still option was the escape hatch. Smallest fix: record it as a residual; optionally a Motion switch in the sky sheet | **Residual R-1, recorded here** (no code). True at dc2b797 for the turning sky (Home, List, Lenses, Marks); L4e removes the one in-app still view (R3 asked for exactly that). A Motion switch would be new scope — Preston's call |
| RT2 | MINOR | "No layout reads while it moves" holds for getBoundingClientRect / getComputedStyle; `readDims` still reads every name's offsetWidth/Height every 90 frames (inherited from L4d), now after the frame's transforms and stem writes | Matches 2.4 (every offset read from `readDims`, ~1 refresh per 90 frames). Ledger E-L1 |
| RT3 | MINOR | The density rule can make a sky very tall: ~1,796 px estimated for 30 three-line names at 320 | **Measured: 30 lenses with 40-character names (4–5 lines) — 2,419 px at 320, 1,752 at 390**, all 30 names in all 120 samples, 0 overlaps of any kind, host never clips. A felt call; ledger E-L2 |
| RT4 | MINOR | The flower's push is a box of 0.4 g (eased to ~0.44 g), so a form could touch petal tips; the rig checked only the middle square | **Measured: 0 forms and 0 names inside the flower's full circle (radius ½ its drawn width) in 120 samples × 4 cases** (390 / 1360 By the orbs, 390 Lenses 12, 320 Lenses 30). Not reproduced; ledger E-L3 |
| RT5 | MINOR | A desktop page scrollbar that appears when a tall drifting sky grows narrows the field with no resize event: G.W stale until the next resize of any kind, which then rebuilds once (no loop) | Not reproducible headless (`--hide-scrollbars`); on Preston's desktop the You page already scrolls. Ledger E-L4 |
| RT6 | MINOR | Stems repaint the bg SVG every frame; `will-change` makes one compositor layer per orb (30 at 30 lenses) — paint/compositing, not layout, unproven on an old iPhone | = the rig's own limit; contract §6 stays owed. Ledger E-L5 |
| RT7 | NIT | Under 460 px a drifting orb's art drops from ≤ 76 to ≤ 66 px (by design; the still sky under Reduce Motion is unchanged — `S.fl` false) | Confirmed in 2.9 (still rows unchanged). Stated in the felt delta |
| RT8 | NIT | Stems pass behind other orbs' names without a backing; fractional translate3d with `will-change` can shimmer text on 1× screens; `REDUCE` is read once at load (older than L4e) | Name over stem ≥ 7.61:1 (2.11). Ledger E-L6 |

Sound, per the red-team (each traced in the code): NaN / Infinity guarded (coincident orbs `d<.001`, `gl||1`, dt 0, `o.dc||[0,0]`,
`W>0`); frame-rate independent (dt capped .05, two half-steps above .02, 26 px/s cap); no jump on return from the background or
from scrolling away (first frame dt .05, ≤ 1.3 px — 2.5b measured 1.3); a rebuild mid-drift keeps places by name or resets all
with `rise` (`old[name]=null` prevents reuse); the Reduce Motion fix is right and `fixedRows` cannot read a stale label height
(the orb and label rules transition opacity only); `S.sig` carries the flow and stems flags, so leaving the mode recreates every
orb (no transform residue); stems are keyed by item index, so a reorder is safe; stars re-strewn only when `data-h` changes;
the Categories looks are built only for a non-empty list, capped at 30, every look from `makeLook` (has `c`; `bloom` already
required `c[0]`); without `:has()` the 600 px cap simply stays; nothing outside hand.js depends on By the orbs being still;
focus ring moves with the button, art ≥ 44 px, DOM order unchanged.

**praxis-reviewer (Sonnet), on the staged code and the working-tree docs: CLEARED WITH NOTES — no code defect.** It re-derived the
four staged sizes and md5s (MATCH), numstat 59 14 · 12 3 · 13 0 · 1 1 and nothing else staged, `git diff --cached --check` clean,
CR 0 on the blobs, the five foundations unchanged; parse OK on the staged hand.js and views.js and PARSE ERROR on a truncated
copy; 0 `const` / `let` / `=>` / `class` / backtick and 0 `.map` / `.filter` / `.forEach` in added lines; 0 hex in added CSS; all
eleven suites at their printed totals; the 2.2, 2.5 and 2.9 figures against their logs; the 2.2 framing judged honest (the first
run's BEFORE was itself inflated by the host). Notes, all taken: (N1) 2.6 is 28 cases, not 30 — corrected, and the comparison's
output is now logged (`log-same-cmp.txt`); (N2) the host-load percentages were hand readings, not logged — now said so; (N3)
l4d.md's header and the contract's L4d amendment still read `1674586b…` as a standing lock — a "history since L4e" pointer added
to both; (N4) this block was a placeholder. Noted, not changed: three added hand.js lines carry `#rrggbb` literals (`#E2B954`,
`#F5E8C4` / `#F3D98B`, `#4A3220`) — the engine's existing convention for its SVG content (24 such literals at dc2b797; the
tokens-only rule is a CSS rule; canon 1.5 §4's R2 exemption covers the engine's colours as content); hand.js shows `MM` in `git
status` only because the working copy is LF, with no content drift.

## Residual

- **R-1 (RT1, MAJOR-as-document).** Every You sky that shows all its names now moves; only the operating system's Reduce Motion
  stops it (and stops every sky). At dc2b797 the turning skies (Home, List, Lenses, Marks) were already in that position, and By
  the orbs was the one view a reader could choose to be still. WCAG 2.2.2 asks for a way to pause motion that starts by itself and
  lasts more than five seconds. An in-app "Motion" switch in the sky's sheet (hold the flower) would answer it — new scope,
  Preston's call. **Carried forward under L4f R4 (20 Nov 2026):** ship as it is; the Motion switch is its own later build,
  before the beta. Since L4f, a full Home sky drifts too.

## Ledger (recorded, not fixed here)

- **E-L1** (RT2) `readDims` still reads each name's size every 90 frames in a drifting sky, where the size cannot change between
  builds; it could be skipped when `S.fl`.
- **E-L2** (RT3) A drifting sky with many long names is very tall on a phone: 30 lenses × 40-character names → 2,419 px at 320,
  1,752 at 390 (1,724 / 1,538 with ordinary names). The 36 % rule is right for keeping names apart; whether it is right as a look
  is Preston's felt call.
- **E-L3** (RT4) The flower's clearance is a 0.4 g box eased to ~0.44 g; measured 0 entries into the flower's circle, but the
  margin to the petal tips is not a hard guarantee.
- **E-L4** (RT5) A page scrollbar that appears without a resize event leaves a drifting sky built for the wider field until the
  next resize (desktop with a short page only).
- **E-L5** (RT6) Stems repaint the background SVG every frame and `will-change` adds one layer per drifting orb; paint and
  compositing cost on an old iPhone are unmeasured (contract §6).
- **E-L6** (RT8) Stems run behind other names without a backing (contrast ≥ 7.61:1 measured); `REDUCE` is read once at load,
  so changing Reduce Motion mid-session needs a reload (older than L4e).
- **E-L7** A turning sky's stars are re-strewn only when it leaves a fixed sky or its height changes there, not when the sky
  is rebuilt at a new width (R8's resize rebuild) or moves between 300 and 360 px in turning modes — stars can sit where an
  old size put them (at dc2b797 they were never re-strewn at all).
- **E-L8** With 17 categories the extra-petal rounding gives 28 looks, so petals 29–30 repeat the two smallest categories
  (`bloom` takes `looks[k % n]`); the fuller categories still carry more petals.
- **E-L9** Under Reduce Motion at 1360, a turning sky with 12 lenses (not full, so not drifting by R5) shows 2 name/name and 4
  form/form overlaps at the still turn position; at dc2b797 the same view measured a stale 360 px field and 1 / 2 overlaps.
  This is L4d's S-3 (names beside orbs at ≥ 900 px) and the turning sky's crowding, not L4e's code.

## Separate tasks (older than L4e; not this build's)

- **S-1, S-3, S-4, D-L1, D-L2** (L4d) — still open, not touched (S-4 seen again in the 2.13 walk: in the turning List the first
  two orbs tried at 390 sat under a neighbour's button).
- **S-5** The headless rig's 4× timings swing with host load (first 2.2 run on a ~36 %-loaded host: BEFORE 3× its L4d values,
  AFTER over the bar). Future sky rounds should record host load and run timing alone.

## Files changed

js/hand.js · js/views.js · assets/components.css · sw.js · docs/checkpoints/l4e.md (new) · docs/checkpoints/l4e-shots/ (27 new
captures) · docs/checkpoints/l4.md · docs/checkpoints/l4d.md · docs/studio/l4-lens-engine-contract.md · BOARD.md ·
docs/Checklist and Roadmap/BUILD_STATE.md · docs/studio/sequence.md · docs/studio/builder.html (regenerated). Rig files
(`.claude/rig/captures/l4e/`) are not staged.

## Owed after the push

On my phone at v3.335, close the app fully and reopen it. You → Categories → By the orbs: every category has its name, and the
orbs drift slowly through the whole sky without ever sitting on each other; a thin thread runs from each to the flower; the
flower carries the categories' colours. Tap a moving orb: its page opens; Back returns. Tap List: the sky turns as before. Hold
the flower → Threads off: the threads go; on: they return. Turn the phone sideways and back: the sky re-lays itself. Home: the
sky looks as it did. Say PASS, or name what is wrong. The About page has no version line; the sign of the new build is the
drifting sky in By the orbs, or check #diag. (This machine cannot reach the live origin; the review chat checks it.)
