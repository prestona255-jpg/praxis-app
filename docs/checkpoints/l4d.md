# L4d — the sky engine: smooth motion, and a still sky with every name

L4d STARTED 19 Nov 2026 (Opus 5.5, executing the written patch). Base b0005cb / v3.333.

19 Nov 2026 · Opus 5.5 executing an already-written, already-measured patch (the engine change was designed and written by
Fable in the review chat), applied byte for byte on main at `b0005cb` (v3.333) == origin/main. Preston's go-ahead included
"run fix-red-team on this". **Status: PUSHED at `dc2b797` (== origin/main, v3.334); Preston's phone check PASSED (L4e R1, 19
Nov 2026: "the still sky works and every category has its name").** (Was: committed locally, not pushed.) The round halted once at Stage 3 on a red-team BLOCK (F1);
Preston ruled the tested F1–F3 fix folded in ("Yes, fold in the tested F1–F3 fix to js/hand.js and finish the round"), and the
round finished. CACHE_VERSION `praxis-v3.334`. **js/hand.js is locked again at `1674586b3645239d832c7b63832268d2` (46,181 B).**
(History since L4e: hand.js was unlocked by ruling for L4e and is locked at `dc6a021e5b89652cf5e6c0a84ae249cd`, 53,596 B —
`docs/checkpoints/l4e.md`.)

## Rulings, worded as given (19 Nov 2026)

- **R1** My phone check of L4b-2b hotfix 2 at v3.333 is a PASS: the flower holds, the You page does not slide sideways, no name
  sits on the caption, and the Undo bar and Undo work.
- **R2** js/hand.js is UNLOCKED for this one build, to stop the sky reading layout while it moves. After this build it is locked
  again at its new md5. Every later check that names hand.js fd51ca7e… as a foundation uses the new md5 from this build on; the
  old records stay as history and are not rewritten.
- **R3** The sky must move smoothly in every mode, By the orbs most of all. Proved by numbers: the time the engine spends placing
  the sky each frame, before and after, and frames per second, before and after.
- **R4** By the orbs is a STILL sky. In that mode the orbs stop circling and sit in fixed rows about the flower, the fullest
  categories first, each with its name under it. Every category's name shows, all the time. The sky grows as tall as the rows
  need, in that mode only. I approved this from the review chat's captures at 390 and 1360 on 19 Nov.
  **SUPERSEDED by L4e's R3 (19 Nov 2026, `docs/checkpoints/l4e.md`): every orb shows its name AND moves; the still rows are
  kept as each orb's starting cell and as the sky under Reduce Motion.**
- **R5** Everywhere else the sky still turns: Home, and You in Lenses, Marks and Categories with the List. In a full turning sky
  a name may sit above or below its orb, beside it, or above or below it shifted to one side; it never sits on another orb, on
  another name, or on the flower's middle; a name with nowhere to go still steps back.
- **R6** The unfinished edits in the praxis-sky-perf worktree are superseded by this build and are not used. Do not merge, stage
  or read from them. After this build is pushed I will decide when that worktree is removed.

## What was built

The review chat's diff, applied exactly (181 lines, 16,633 B, md5 `70c301d8d96b1cd47facd985375cbc2d`; blob ids
`8671bdb..e30b85d` hand.js, `12915ee..679deb9` views.js, `0ea6e7c..800d5fa` sw.js — all three matched by `git hash-object`).

- `js/hand.js` — `S.place` rewritten with five helpers beside it (`fixedRows`, `dimOf`, `labRect`, `readDims`, `solve`);
  `S.build` gains the still sky's set-up; `S.toggles` accepts `fixed`; `VERSION` → `'hand.js L4d · 2026-11-19 · Fable 5.2'`.
  The sky reads no layout while it moves: a name's box is worked out from its orb's centre and size and the name's own measured
  width and height, read only at the top of a frame, before any write, and only for a name whose side changed on the last frame
  (all of them every 90 frames, and three times on a snap).
- `js/views.js` — `lxFillCatNames` tells the sky when it is still: `rec.S.toggles({ fixed: false })` on the empty path and
  `rec.S.toggles({ fixed: mode === 'orbs' })` after the mode is read (numstat 2 1).
- `sw.js` — `praxis-v3.333` → `praxis-v3.334`.
- No CSS. Kept on purpose: the 16 px lift of an upper orb whose name is not displayed (`o.y - sz/2 - 16`).

**Fold-in (19 Nov 2026, from the review chat; Preston's go-ahead to change js/hand.js for it and nothing else).** The still
sky's flower shrank on every rebuild when all categories sat in the middle row (the field's height fed back into `geo()`'s g),
and at 760/1360 with 5–6 categories it overlapped the orbs beside it. Four replacements: `gFix(W)` (the still sky's flower sized
by width alone) after both `geo()` calls in the still sky, and the middle-row slots pushed out from the flower. Applied exactly:
js/hand.js **45,835 B, md5 `036b414a789a8443609311eb34820a44`**, numstat against b0005cb **78 27**; views.js and sw.js unchanged.

**Fold-in 2 — the red-team's F1–F3 (19 Nov 2026, Preston's ruling).** Four exact replacements against the `036b414a…` file, each
OLD string found exactly once (the fourth anchors on two lines because `SKIES.push(S);` also appears in `YumiSky`):
1. OLD `cw=Math.min(W/cols,150),cm=cols-((cols%2)?1:2),mid=Math.min(n,cm),M=n-mid,R=Math.ceil(M/(2*cols)),cnt=[]`
   NEW `cw=Math.min(W/cols,150),cm,mid,M,R,cnt=[]`
2. OLD (one line) `      S.hw=Math.min(140,cw)/2; for(i=0;i<n;i++){ o=S.orbs[i]; o.lab.style.maxWidth=f(cw-14)+'px'; o.el.style.width=f(S.hw*2)+'px'; }`
   NEW (three lines) the middle-row slots worked out first and kept only if the whole cell fits; the middle row's count from
   them; and each orb capped to its cell less 14 px (see the consolidated report for the full text).
3. OLD (one whole line, with its newline) the old slot loop `      for(k=0;k<cols;k++){ … sl.push(G.cx+x+((x<0)?-y:y)); } }` — NEW nothing.
4. OLD `    SKIES.push(S);` + newline + `    return S;` — NEW the same two lines with
   `    if(document.fonts&&document.fonts.addEventListener){ document.fonts.addEventListener('loadingdone',function(){ if(S.fx&&S.ready){ S.sig=''; S.build(); } }); }`
   on its own line before them.
Result: **js/hand.js 46,181 B, md5 `1674586b3645239d832c7b63832268d2`**, LF, CR 0, numstat against b0005cb **80 27**; byte-identical
(`cmp`) to the candidate tested in the rig; parse-check exit 0; 83 added lines across the three files (80 in hand.js, 2 views.js, 1 sw.js) with 0
`const ` / `let ` / `=>` / `class ` / backtick; views.js and sw.js unchanged.

Which build each number below was taken on: Stage 2's 2.1–2.4, 2.5c, 2.6, 2.3 and the metrics on `036b414a…` (the turning sky and
the per-frame code are the same in the final file — fold-in 2 touches only `fixedRows`, which runs at build, and adds one listener);
2.5, 2.5b, 2.7, 2.8, 2.9, the flower check, the By-the-orbs timings and reads, and the build cost were re-run on the final
`1674586b…` (§ Stage 3, after the fold).

## Stage 0 — pre-flight: PASS

HEAD `b0005cb` == origin/main, CACHE_VERSION praxis-v3.333, tracked tree clean, hook gate ARMED. Every protocol doc found.
Before-numbers MATCH (hand.js 40,981 `fd51ca7e…`, views.js 1,406,872 `5b17578b…`, sw.js 6,894 `042099e3…`) and the six
unchanged files MATCH. The diff extracted at 181 lines, 16,633 B, md5 `70c301d8…`; the dry apply gave the three after-md5s.
Nothing enforces hand.js's md5 in code (no hook, tool or test); the standing-rule text is the engine contract §8 ("unchanged
except: nothing"), amended under R2/R4. Nothing outside hand.js reads `S.orbs`, `S.place`, `PraxisHand.skies` or any orb field;
none of the new names existed. 4× CPU throttling works on the rig (a 200 ms busy loop: 1,085,890 → 226,868 iterations).

## Stage 1 — apply: PASS

Staged blobs (`git cat-file -p :<path>`): hand.js 45,436 `ecf3bea9…` (pre-fold, as expected) → after the fold 45,835
`036b414a…`; views.js 1,407,007 `2db9653d5d591df4dbb5fd051b1acfb9`; sw.js 6,894 `cbe2f5790b54c1544b1410cffe382079`; all CR=0.
numstat 78 27 · 2 1 · 1 1. tools/parse-check PARSE OK, exit 0, on all 21 JS files (exit 1 on a broken copy). Added lines:
`const ` 0, `let ` 0, `=>` 0, `class ` 0, backtick 0. components.css, integrations.js, state.js, theme.css, lumen-amber.css,
marks.js unchanged.

## Stage 2 — measure, test and look (headless Chrome 157 over CDP, CSS animations ON)

Rig (untracked, never staged): `.claude/rig/captures/l4d/` — `l4d-rig.js` (probes), `l4d-run.ps1` + `l4d-extra*.ps1` (CDP
phases), served by `../l4b2bhf1/serve-root.ps1`: 8862 the working tree (AFTER), 8863 a `git archive` of b0005cb (BEFORE),
8864 the pre-fold patch, 8865 a candidate fix (scratch, never applied). Fixture: l4 fixture + hf1 (38 books, 17 categories of
1–5 books; kept lenses via `l4Show(n)`). 390 = phone emulation (dpr 2, mobile); 1360 = dpr 1.

### 2.1 Suites at their b0005cb counts — PASS
lens-eval 68/68 · lens-data 101/101 · export 58/58 · delete 58/58 · ceiling-core 36/36 · fx1c-sim 60/60 · L4b-1 hotfix 46/46 ·
L4b-2a unit 71/71 · L4b-2a hotfix 1 unit 74/74 · L4b-2b unit 120/120 · L4b-2b hotfix 1 unit 74/74 (each read by its printed total).

### 2.2 The engine's own time — PASS (S.place per ordinary frame, ms; 20 s per case; By the orbs = still AFTER, turning BEFORE)

| kept · width · mode | CPU 4×: BEFORE mean / p95 / worst | AFTER mean / p95 / worst | CPU 1×: BEFORE mean / p95 | AFTER mean / p95 |
|---|---|---|---|---|
| 3 · 390 · Home (3 orbs) | 4.15 / 10.2 / 19.6 | 0.31 / 0.8 / 2.5 | 0.44 / 1.0 | 0.07 / 0.2 |
| 3 · 390 · Lenses (3) | 1.76 / 5.3 / 14.9 | 0.39 / 1.1 / 7.6 | 0.45 / 1.0 | 0.08 / 0.2 |
| 3 · 390 · Categories List (17) | 21.86 / 56.4 / 67.6 | 1.14 / 2.9 / 11.4 | 1.26 / 2.9 | 0.12 / 0.2 |
| 3 · 390 · By the orbs (17) | 58.81 / 151.2 / 213.2 | 0.83 / 2.3 / 5.8 | 5.19 / 11.3 | 0.11 / 0.2 |
| 3 · 390 · Marks (5) | 6.17 / 23.4 / 41.0 | 0.63 / 1.8 / 11.8 | 1.48 / 3.1 | 0.10 / 0.2 |
| 3 · 1360 · Home (3) | 7.78 / 16.3 / 44.3 | 0.66 / 1.8 / 7.2 | 0.88 / 1.6 | 0.12 / 0.2 |
| 3 · 1360 · Lenses (3) | 6.13 / 12.9 / 27.2 | 0.58 / 1.5 / 4.9 | 0.67 / 1.3 | 0.10 / 0.2 |
| 3 · 1360 · Categories List (17) | 29.53 / 60.4 / 89.1 | 0.89 / 2.2 / 7.2 | 4.02 / 8.9 | 0.12 / 0.2 |
| 3 · 1360 · By the orbs (17) | 68.96 / 136.5 / 195.5 | 0.64 / 1.5 / 6.2 | 5.13 / 9.9 | 0.15 / 0.3 |
| 3 · 1360 · Marks (5) | 10.24 / 28.0 / 68.9 | 0.52 / 1.4 / 3.8 | 0.98 / 2.1 | 0.10 / 0.2 |
| 9 · 390 · Home (9) | 13.15 / 31.8 / 64.7 | 0.67 / 1.6 / 4.3 | 1.24 / 2.6 | 0.14 / 0.3 |
| 9 · 390 · Lenses (9) | 15.21 / 43.9 / 79.4 | 0.76 / 2.1 / 5.8 | 1.23 / 2.9 | 0.14 / 0.3 |
| 9 · 390 · Categories List | 29.82 / 63.7 / 98.1 | 0.58 / 1.8 / 3.4 | 1.95 / 4.0 | 0.09 / 0.2 |
| 9 · 390 · By the orbs | 87.03 / 152.7 / 220.8 | 0.41 / 1.1 / 3.5 | 6.90 / 12.3 | 0.08 / 0.2 |
| 9 · 390 · Marks | 19.43 / 49.3 / 81.9 | 0.31 / 0.7 / 2.9 | 1.46 / 3.4 | 0.08 / 0.2 |
| 9 · 1360 · Home (9) | 36.30 / 87.4 / 126.3 | 0.73 / 2.0 / 4.1 | 2.69 / 5.8 | 0.17 / 0.3 |
| 9 · 1360 · Lenses (9) | 12.16 / 32.2 / 51.0 | 0.75 / 1.8 / 4.2 | 1.41 / 2.7 | 0.15 / 0.3 |
| 9 · 1360 · Categories List | 16.29 / 43.7 / 70.0 | 0.58 / 1.9 / 6.6 | 1.44 / 3.2 | 0.09 / 0.2 |
| 9 · 1360 · By the orbs | 53.85 / 114.4 / 152.2 | 0.49 / 1.5 / 4.5 | 3.78 / 7.3 | 0.07 / 0.2 |
| 9 · 1360 · Marks | 5.00 / 15.1 / 22.7 | 0.29 / 0.5 / 1.5 | 0.54 / 1.0 | 0.08 / 0.2 |

AFTER mean < 2 ms (max 1.14) and p95 < 5 ms (max 2.9) in all 20; AFTER below BEFORE in all 20. Pre-fold dry run (not in the
table): By the orbs 0.41–1.07 ms at 4×.

### 2.3 Frame rate on this rig (fps · worst 1 s; contract §6 asks ≥ 55 and no second under 45, on the iPhone)
Same 20 s windows (own rAF counter; `PraxisHand.stats()` deltas agree within 1 fps). CPU 4×: BEFORE 5.0–39.2 fps (worst 1 s
4–24), AFTER 8.2–30.4 (5–21) — the gate is not reachable at 4× in headless Chrome for either build. CPU 1×: Home, Lenses, Marks
55–60 fps in both builds; Categories List and By the orbs BEFORE 26.8–57.2, AFTER 28.6–60.1 over three runs — the run-to-run
spread for one build (±15 fps) is larger than the difference, so fps does not rank the engines on this machine.
**What the main thread does instead (CDP `Performance.getMetrics`, 15 s, CPU 1×, 9 kept; BEFORE two runs → AFTER two runs).**
Layouts per second: 390 Home 400–404 → 78–99 · Lenses 394–416 → 90–115 · List 452–514 → 73–100 · By the orbs 1,403–1,489 →
46–53; 1360 Home 488–491 → 96–111 · Lenses 402–416 → 68–103 · List 438–511 → 72–77 · By the orbs 921–1,207 → 37–43. Layout
time: By the orbs 171–172 → 43–45 ms/s (390), 115–124 → 35 ms/s (1360); the other cases 59–88 → 35–56 ms/s. Style recalc
(105–199 ms/s, the CSS animations, the same in both) is now what bounds a headless frame.
**Headless Chrome on this Windows machine is not an iPhone; the contract §6 gate stays owed before the beta.**

### 2.4 No layout reads while moving — PASS (counted inside ordinary S.place calls, ~600 frames, prototypes wrapped)
BEFORE: getBoundingClientRect 7,200–58,306 · getComputedStyle 3,600–20,400 · offsetParent 3,600–20,400 · offsetWidth 842–10,202.
AFTER: getBoundingClientRect **0** · getComputedStyle **0** · offsetParent 0 · offsetWidth / offsetHeight 21–121 each, **every
one from `readDims`** (stack-checked) — e.g. 17 orbs × 7 refreshes (one per 90 frames) = 119.

### The fold-in's flower check — PASS
2, 3, 5, 6, 9, 17 categories at 390, 760, 1360; four `S.sig='';S.build()`, then List → By the orbs: field height, G.g and the
drawn width identical before and after in all 18; drawn width = G.g; 0 px of anything into the flower. Heights: 390
156/378/378/360/306/536 (flower 136; 108 at 9 and 17) · 760 196/196/420/398/376/522 (176; 150 at 17) · 1360 196/196/196/196/376/346
(176; 150 at 17). The pre-fold patch reproduces the fault: 390/2 drawn 136 → 56 after four builds; 760/3 and 1360/5 56; 1360/6 51.

### 2.5 The still sky (the fixture's sizes) — PASS on the fixture; with real-sized categories see Stage 3 F1/F2
320, 360, 390, 430, 560, 760, 900, 1200, 1360, Night and Day, 17 categories, 20 samples ⅓ s apart: 17/17 names in every sample;
0 name/name, 0 name on another orb, 0 past the side, 0 orbs moved; 34/34 hits (form and name centres land on their own button);
no button under 44 px; caption ≥ 43.5 px under the lowest name; field 536 (320–390) · 484 (430) · 574 (560) · 522 (760) · 372
(900) · 346 (1200, 1360); longest name 3 lines at ≤ 390 ("Social & Political Thought"). 2, 3, 5, 8, 9, 12 categories at 390 and
1360: all names, 0 overlaps, all hits. One category falls back to the turning sky (no inline height, `field one`). A 40-character
name: 4 lines, field 588, 0 overlaps, 34/34 hits. Names into the flower's box: 0 px except 460–600 px wide, where one middle-row
name's box reaches 5 px (3.3 at 600) into the flower SVG's square — inside the fold's 6 px line; the close-ups
`l4d-flower-touch-500/560-after.jpg` show sky between the text and the petals. With 3 categories at 390 the rows are 1 / 2 / 0,
so an empty row (~178 px) sits under the flower (the review chat's 434 px is the same shape).

### 2.5b Going in and out — PASS
List → By the orbs → List → Lenses → Categories → Marks → Categories, twice, at 390 and 1360: inline height, 17 button widths and
17 max-widths only By the orbs, 0 everywhere else; field back to its CSS 360 / 300; 0.91–0.98 engine ticks per frame (one loop);
2 skies throughout; `praxis_you_catnames` as chosen. Names off + By the orbs: it turns, 0 names, no inline height. Reduced motion
By the orbs: drawn the same. Resize: nothing in the app rebuilds the sky on a window resize — true at b0005cb in every mode
(separate task S-2); re-rowing across 460 and 900 is shown by the per-width renders above, in one page session, 0 errors.

### 2.5c The turning sky's names (60 samples, ⅓ s apart; least / median / most shown · overlapping pairs)
390 List (17): BEFORE 2/2/3 · 0 → AFTER 2/2/3 · 0 (and 1 sample of a name > 4 px on a drifting neighbour's form — F5a).
390 Lenses 9: 2/2/3 → 2/3/3, 0 both. 390 Lenses 12: 1/2/3 → 2/3/3, 0 both. 1360 List: 3/3/3 → 3/3/3, 0 both.
1360 Lenses 9 (not a full sky; names beside their orbs): 9/9/9 both; 17 → 12 overlapping pairs, 79 → 72 on an orb.
1360 Lenses 12: 11/11/12 → 11/12/12; 36 → 62 pairs, 234 → 259 on an orb.
Medians never below BEFORE; 0 past the side; 0 on the flower's middle in a full sky. Every 1360 overlap comes from names placed
BESIDE their orbs (the ≥ 900 px wide layout with 5–12 lenses): 96 / 98 and 308 / 322 hits over 40 samples, 0 from names above or
below. Neither engine checks a side name (b0005cb: `if(!rects[i].l||o.side){continue;}`) — separate task S-3. Flicker: AFTER
never more than 2 changes in a second (BEFORE once 3, once 5).

### 2.6 Nothing else moved
Identical (left, top, classes, name position) at six fixed points: 3 lenses at 390/760/1360 (Lenses and Home), 5 and 7 at 760 and
1360, 9 Lenses at 760 and 1360, 1360 List. Different: 390 Home 5 (6 rows), 390 Lenses 5 (4), 390 Lenses 7 (1), 760 Home 9 (1),
1360 Home 9 (1), 390 List (2). The discriminator — the same points with the new engine's place-memory cleared (`o.pos=null`) —
makes 390 Lenses 5, 390 Lenses 7 and 1360 Home 9 identical: those came only from the patch's deliberate "a name keeps the place
it has while that place is free". What remains (390 Home 5, 760 Home 9, 760 Lenses 9, 390 List) are all points where the OLD
engine stepped a name back; on real rects neither engine's final choice collides (0 / 0), and AFTER shows more names (390 Home 5:
26 against 24). No orb whose name is not displayed moved. **Against the prompt's literal "PASS needs them identical", 390 / 5 and
Home 9 at 760 / 1360 differ**: on this fixture those are colliding cases (the review chat's fixture had none there).

### 2.7 Still works
Names off: 0 names in Lenses, List, Marks, By the orbs. 1360 hover and keyboard focus on an orb whose name was not displayed:
`display:block`, opacity 1, `:focus-visible` true. Threads: 8 drawn, 0 ending away from their orbs. The "3-second hold" does not
still the sky in either engine: a hold opens "Your sky" at 500 ms (`lxWireSky`) and S.th kept advancing (0.168 → 0.228 in 3 s).
Reduced motion: 0 `S.place` calls from the loop in 3 s on Home, Lenses, List, By the orbs. 20 rounds Lenses → Categories → Marks
→ Lenses: skies 2 → 2, 9 orbs, one loop. Build cost (25 `S.build()` each, mean ms, BEFORE → AFTER): 390 Home 41.5 → 32.6 ·
Lenses 35.2 → 32.7 · List 78.3 → 64.9 · By the orbs 82.2 → 64.9; 1360 Home 27.5 → 28.1 · Lenses 27.5 → 20.7 · List 41.0 → 46.8 ·
By the orbs 54.7 → 52.6.

### 2.8 Captures — `docs/checkpoints/l4d-shots/` (taken 19 Nov 2026; hidden: the first-run intro panel only)
By the orbs at 320 and 390 (viewport 1,900 tall so the fixed tab bar sits below the sky), 760 and 1360, Night and Day, BEFORE and
AFTER (`l4d-byorbs-<w>-<mood>-<before|after>.jpg`); Lenses with 7 lenses at 390 (`l4d-lenses7-390-night-*.jpg`); Home at 390
(`l4d-home-390-night-*.jpg`); the flower-touch close-ups at 500 and 560 (`l4d-flower-touch-*-after.jpg`).

### 2.9 Walk at 390 (real hit-tested clicks; reduced motion so a turning orb holds still) — PASS
Home orb → its lens sheet. You → Lenses → orb → its lens sheet. Categories List → "Psychology & Mind" →
`#category/Psychology%20%26%20Mind` → Back → `#profile`. By the orbs → "Science & Nature" → `#category/Science%20%26%20Nature` →
Back → `#profile`, the still sky again. Marks → a book → `#book/bk_l4_03` → Back → `#profile`. 0 page errors. In the turning full
sky 16/17 (List) and 8/9 (Lenses 9) orbs are hittable at their form centre in BOTH engines (one orb under a neighbour's 140 px
button) — older than this build.

### What the rig cannot show
iPhone Safari: its frame rate, heat and battery (contract §6 stays owed); WebKit text metrics (row heights may differ by a line);
the real font swap on a cold PWA start; Preston's real library (the fixture has 1–5 books per category — Stage 3 F1).

## Stage 3 — the red-team: 1 BLOCK, 2 MAJOR → the tested fix folded in on Preston's ruling

**fix-red-team (Sonnet), on the frozen staged tree:** `RED-TEAM: findings (1 BLOCK, 2 MAJOR, 3 MINOR, 3 NIT)`. It re-derived the
staged md5 and size (MATCH), parse exit 0 (and exit 1 on a broken copy), and found clean: no outside reader of `o.flip`/`o.lh`/`o.w`
(Q15); no state shared between skies (Q14); the 16 px lift kept (Q16); no read after a write inside an ordinary frame (Q9); the
flower square only in a full sky (Q13); the 44 px floor (Q5); reading order = view order (Q6); the inline styles cleared on leaving
(Q2); `o.pos` only kept when it is a candidate (Q10); the hero's ≥ 1200 un-cap still applies (Q4).

| id | sev | finding (red-team's words, condensed) | reproduced in the rig (staged build) |
|---|---|---|---|
| F1 | **BLOCK** | In the still sky an orb's size (`36 + 13·√books` × density) is never capped to its cell `cw`, so a full category overlaps its neighbours and the flower | **YES.** With a realistic shelf (48/26/16/12/9/7/6/5/4/3/3/2/2/2/2/1/1 books) 47 of 140 cases (14 widths × 4/5/6/9/17 categories × fixture/real sizes) fail: orbs on orbs up to 36.4 px, orbs into the flower up to 12.9 px, orbs past the field up to 47 px. The fixture (1–5 books) never reaches it. |
| F2 | MAJOR | The fold's push-out sends the outer middle-row slots off the field at mid widths (5 columns, ~460–800; 7 columns 900–1050) | **YES.** Art past the field up to 20 px and name/name up to 27.5 px at 460–600 even with the fixture's sizes. |
| F3 | MAJOR | A late web font never re-rows the still sky (rows are fixed at build; no font or resize hook) | **Mechanism YES.** A late face (size-adjust 170 %) grows a name to 4 lines at 390: the field stays 536, the lowest name drops 13 px, the caption gap falls 56.5 → 43.5 (no overlap at this size). |
| F4 | MINOR | 3 middle-row orbs on a 5-column row sit lopsided (two left, one right) | not measured |
| F5 | MINOR | Turning sky: name boxes are nominal (no CSS drift / sway); `o.pos` is sticky; a side name's width is estimated for one frame | (a) 1 sample in 60 at 390 List; (b) = 2.6's discriminator |
| F6 | MINOR | The still sky never rebuilds on resize/rotation (cells frozen at the old width) | = separate task S-2 (true of every mode at b0005cb) — **closed at L4e (R8)** |
| F7 | MINOR | Stars are generated once, before the still sky grows, so they fill only the top ~300 px | visible in the captures (sparser lower half) — **closed at L4e (R8)** |
| F8 | NIT | (a) a still sky still runs place/solve each frame; (b) `.l` has no `overflow-wrap`; (c) hovering a hidden name in a full sky uses stale `[0,0]` dims up to 90 frames | — |

**The smallest fix, tested in the rig and NOT applied** (scratch `fixtest/js/hand.js`, 46,181 B, md5
`1674586b3645239d832c7b63832268d2`, numstat against b0005cb 80 27, parse-check exit 0) — three changes to `js/hand.js` only:
- **F1** in `fixedRows`, where each orb's button width is set: `if(o.sz>cw-14){ o.sz=Math.max(44,Math.floor(cw-14));
  o.el.firstChild.style.width=o.sz+'px'; o.el.firstChild.style.height=o.sz+'px'; }` (cw − 14 leaves room for two neighbours'
  ±6 px CSS drift; the turning sky's sizes are untouched because `S.build` recomputes `o.sz` on every build).
- **F2** the middle-row slots are worked out first and kept only if the whole cell fits in the field
  (`if(x-cw/2>=-.5&&x+cw/2<=W+.5){ sl.push(x); }`), and the middle row's count follows them (`cm=sl.length; mid=Math.min(n,cm);
  M=n-mid; R=Math.ceil(M/(2*cols));`) — the orbs that no longer fit go to the rows above and below.
- **F3** in `Sky`, beside `SKIES.push(S)`: `if(document.fonts&&document.fonts.addEventListener){
  document.fonts.addEventListener('loadingdone',function(){ if(S.fx&&S.ready){ S.sig=''; S.build(); } }); }`.
Measured on the candidate: the same 140 cases → **0 of 140** flagged (0 orb/orb, 0 orb into the flower over 6 px, 0 art past the
field, 0 name/name, 0 name on an orb), 0 page errors; the late face → the field re-rows (536 → 588) and the caption gap returns
to 56.5. Re-run of 2.5 and the flower check on the candidate (the fixture's sizes): identical to the staged build — 17/17 names in
every sample at all nine widths, Night and Day; 34/34 hits; the same heights; the flower stable through four builds and List → By
the orbs in all 18 cases, 0 px into it; 0 page errors. The fixes engage only where the staged build breaks.

**Ruling (Preston, 19 Nov 2026):** "Yes, fold in the tested F1–F3 fix to js/hand.js and finish the round", with two additions —
the fold pasted as exact replacements (above, and in full in the report), and the F3 listener counted.

### After the fold (all on the final `1674586b…`, 19 Nov 2026)
- **F3's listener — where it lives.** Added once per sky, in `Sky()` (js/hand.js:469, beside `SKIES.push(S)`); never removed,
  because a sky is never discarded: views.js makes skies only in `lxSkyHost(key)`, which returns the cached `lxSkies[key]` after
  the first call, and there are two keys, `'home'` and `'you'`. Counted by CDP `DOMDebugger.getEventListeners(document.fonts)`:
  after boot (Home) **1** [line 469]; You opened **2** [469, 469]; after 1, 10 and 20 × Lenses → Categories → By the orbs → List
  **2**; after leaving You and coming back 1–5 × **2**; Sky objects 2 throughout; no other listener on `document.fonts`. **PASS**
  (one per live sky; no sky is ever gone). Its effect: one font load rebuilt the still You sky once and the turning Home sky 0 ×.
  Seen on the way: a resize into the desktop layout loads another font weight, so a still sky also re-rows on that resize (560);
  a resize that loads nothing does not (S-2 stands).
- **The realistic shelf (F1/F2):** 140 cases (14 widths × 4/5/6/9/17 categories × fixture and real sizes) → **0 flagged**: 0
  orb on orb, at most 1 px of an orb into the flower's box, 0 art past the field, 0 name on name, 0 name on an orb. Captures
  `l4d-byorbs-realshelf-{390,1360}-night-{before,after}.jpg` (books 48/26/16/12/9/7/6/5/4/3/3/2/2/2/2/1/1): AFTER 390 field 690,
  biggest orb 83, 0 overlaps; AFTER 1360 field 454, biggest 113, 0 overlaps; BEFORE (b0005cb, turning) at the same moment: an orb
  16.8 px (390) and 37 px (1360) into the flower, orbs on orbs 9.3 / 7.7 px, 4 buttons past the field at 390.
- **Late font (F3):** a late face (size-adjust 170 %) at 390: the still sky re-rows 536 → 588, caption gap 56.5 kept, 17/17.
- **2.5 re-run:** identical to the numbers in § 2.5 (17/17 at every width, Night and Day, 34/34 hits, the same heights, caption ≥
  43.5, 0 errors; 1 category falls back; a 40-character name 4 lines, 34/34). Names into the flower's box: the same 5 px at
  460–560 and 2.7–3.3 at 600 (inside the 6 px line), 0 elsewhere. Flower check: 18/18 stable, drawn = G.g, 0 px into it.
- **2.5b, 2.7, 2.9 re-run:** the same as above — inline styles only By the orbs, one loop, 2 skies, names off 0, hover/focus,
  threads 8/0, reduced motion 0 loop calls and the still sky drawn the same, 20 mode rounds steady, the walk to the same pages,
  0 page errors.
- **By the orbs, timings and reads re-run:** CPU 4× mean 0.57 / 0.70 (kept 3, 390 / 1360) and 0.63 / 0.79 (kept 9), p95 ≤ 2.7;
  CPU 1× 0.09–0.11; ~600 frames: 0 getBoundingClientRect, 0 getComputedStyle, every offsetWidth/Height from `readDims` (all ten
  cases). Build cost (25 builds, mean ms): 390 Home 43.3 · Lenses 30.5 · List 71.8 · By the orbs 64.6; 1360 24.4 · 34.5 · 60.4 ·
  45.1 — the same range as BEFORE (27.5–82.2).
- **2.8 captures** re-taken on the final bytes (the AFTER set, the flower close-ups, and the real-shelf pair).

**praxis-reviewer (Sonnet), on the final tree: CLEARED WITH NOTES — no blocking finding.** It re-derived every staged size and md5
(hand.js 46,181 `1674586b…`, views.js 1,407,007 `2db9653d…`, sw.js 6,894 `cbe2f579…`, all CR 0, numstat 80 27 · 2 1 · 1 1), the six
unchanged files, `git diff --cached --check` clean, the hook gate, parse exit 0 on all three, the ES3 sweep (0, and 0 `.filter(` /
`.map(`), all eleven suites at their counts by printed total, every NEW string of the fold present once and every OLD string gone,
the docs agreeing with the code and with each other, builder.html carrying the L4d lines, and l4d.md's framing of 2.6 and the
flower box as stated rather than absorbed. Notes: (N1) `cand.indexOf(o.pos)` in `solve` is hand.js's first `Array.prototype.indexOf`
(ES5 method, not syntax; views.js uses it freely; the parse gate cannot see it); (N2) this record said "83 added lines" for
hand.js — 83 is the three files together, 80 in hand.js (corrected above); (N3) `docs/studio/v1-canon-delta-amend-1.5-sky.md:5`
and `DESIGN-HANDOFF-14nov.md:28` still name `fd51ca7e…` — history of those records (R2: old records are not rewritten), left as
they are; (N4) builder.html is mixed EOL in the working tree, LF in the index (generator output, immaterial to the commit).

## Separate tasks (older than L4d; not this build's)

- **S-1** At 760 px the page scrolls sideways: scrollWidth 861 against 760 (and 945 against 900), the widest element
  `ul.app-nav-list` — the top navigation list runs past the edge. Same at b0005cb.
- **S-2** Nothing rebuilds the sky on a window resize or a phone rotation; every mode keeps the layout of the width it was built at
  until the next render. **CLOSED at L4e (R8, v3.335):** one debounced resize / orientationchange listener rebuilds a sky whose
  width changed (F6 closed with it).
- **S-3** At ≥ 900 px with 5–12 lenses (the wide side layout, not a full sky), names placed beside their orbs are never
  collision-checked in either engine; at 1360 with 9 and 12 lenses they overlap other names and orbs.
- **S-4** In a full turning sky one orb can sit under a neighbour's 140 px button (16/17 hittable at 390 List in both engines).

## Ledger (recorded, not fixed here)

- **D-L1** (F4) With three orbs in a 5-column middle row they sit two on one side, one on the other. After fold-in 2 this happens
  only from about 670–800 px up, where the outer slots fit.
- **D-L2** (F5a) The turning sky works out name boxes from each orb's nominal size; the forms' CSS drift (up to ±6 px across,
  4–8 px down) and sway are not in them, so a name can graze a drifting neighbour for a moment (1 sample in 60 at 390 List,
  more than 4 px).
- **D-L3** (F5b) A name keeps its place while it is free (the patch's rule), so the turning sky does not always return a name to
  its natural side — the source of three of 2.6's differences (shown by clearing the memory).
- **D-L4** (F5c) Before a side name has been measured its width is estimated (`min(width,104)`), so its orb can shift for one
  frame at ≥ 900 px.
- **D-L5** (F7) The stars are made once, before the still sky grows taller, so they fill only its top ~300–360 px. **CLOSED at
  L4e (R8, v3.335):** the stars are strewn over the field's real height, and again when it changes.
- **D-L6** (F8a) A still sky still runs `place` and `solve` each frame (0.09–0.11 ms unthrottled); it could stop after the snap.
- **D-L7** (F8b) A name has no `overflow-wrap`: one unbroken word longer than its cell (none of the 17 categories) would run past
  it.
- **D-L8** (F8c) Hovering an orb whose name is `display:none` in a full sky shows the name unchecked until the next 90-frame
  refresh (≤ 1.5 s).
- **D-L9** With 3 categories at 390 the rows are 1 / 2 / 0, leaving an empty row (~178 px) under the flower.
- **D-L10** Between 460 and 600 px one middle-row name's box reaches up to 5 px into the flower SVG's square (inside the fold's
  6 px line; the text and petals stay apart in the close-ups).
- **D-L11** 2.6's literal "identical" fails at 390 / 5 lenses and Home 9 at 760 / 1360 on this fixture: those are colliding cases
  where the old engine stepped a name back (see § 2.6).
- **D-L12** "Hold (the 3-second hold) still stills the sky" (the prompt's 2.7) describes no behaviour in either engine: the hold
  opens "Your sky" at 500 ms and the sky keeps turning.
- **D-L13** `o.lh` is still written in `S.build` (hand.js:368) and no longer read.
- **D-L14** Headless frame rate on this machine is too noisy to rank the engines (±15 fps run to run); the main thread's layout
  count is the clean measure. The contract §6 iPhone gate stays owed.

## Files changed

js/hand.js · js/views.js · sw.js · docs/checkpoints/l4d.md (new) · docs/checkpoints/l4d-shots/ (new captures) ·
docs/checkpoints/l4.md · docs/checkpoints/l4b-2b.md · docs/studio/l4-lens-engine-contract.md · BOARD.md ·
docs/Checklist and Roadmap/BUILD_STATE.md · docs/studio/sequence.md · docs/studio/builder.html (regenerated). Rig files
(`.claude/rig/captures/l4d/`) are not staged.

## Owed after the push

On my phone at v3.334, close the app fully and reopen it. You → Categories → By the orbs: the orbs should sit still in rows
around the flower, and all 17 categories should have a name under them, none on top of another. Tap one: its page opens; Back
returns to the still sky. Tap List: the sky should turn again, and glide without stutter. Scroll the You page up and down while
it turns; it should scroll smoothly. Home: the sky should look as it did. Say PASS, or name what is wrong. The About page has no
version line; the sign of the new build is the still sky in By the orbs, or check #diag. (This machine cannot reach the live
origin; the review chat checks it.) Your real shelf is the first real-sized test of the still sky: if a big category's orb
looks squeezed or anything sits on the flower, say which width.
