# LC1 — the colours: canon amendment 1.5 (tokens only) — v3.323

Built 16 Nov 2026 against `50d419d` (praxis-v3.322). Model: Opus 5.5 (ruled work). Source: the v19 carry from the 14 Nov
design chat (`~/Downloads/praxis-p2-carry-v19.tgz`, extracted to a scratch folder, **30 / 30 files MATCH** its MANIFEST.txt);
the build prompt was refreshed 16 Nov and supersedes the carry's `LC1-OPENING-PROMPT.md` (not landed). Preston's go carried
"run fix-red-team on this", which lifted the session's agent bar for the round. Normative: `docs/studio/v1-canon-delta-amend-1.5.md`.

## What changed (65 lines, every one byte-neutral)
- **assets/theme.css — 35 token values.** Night `:root` (15): `--page #24180C→#1F140C`, `--page-2 #4A2E18→#33241A`,
  `--page-3 #63401F→#46321F`, `--ink #F5E8C4→#FBF4E6`, `--ink-2 #CDB894→#CDBBA5`, `--ink-3 #BAA48C→#BFAB94`,
  `--gold #E8B23A→#F2B72E`, `--gold-ink #E8B23A→#E3B88A`, `--gold-star #E8B23A→#F2B72E`, `--on-gold #1C120A→#2B1B10`,
  `--umber #4A2E18→#33241A`, `--umber-2 #63401F→#46321F`, `--on-night #F5E8C4→#FBF4E6`, `--on-night-2 #CDB894→#CDBBA5`,
  `--on-night-3 #BAA48C→#BFAB94`. Day block and auto block (10 each, bodies byte-identical): `--page #EDD79E→#FBF8F1`,
  `--page-2 #FBF3D9→#FFFFFF`, `--page-3 #E2C98C→#EFE9DC`, `--ink #2A1E10→#2B1B10`, `--ink-2 #6F5A34→#6A5646`,
  `--ink-3 #6B5936→#6A5646`, `--line rgba(42,30,16,.16)→rgba(43,27,16,.14)`, `--gold #D9931A→#F2B72E`,
  `--gold-ink #835508→#7A4520`, `--on-gold #2A1E10→#2B1B10`. Applied by token NAME inside each block's line range (never
  by hex: night `--sky #1C120A` stays; day `--ink` and `--on-gold`, both `#2A1E10`, both move).
- **The generator's two sources — 25 values:** `docs/checkpoints/l1-tools/l1-core.css` (the 15 night) and
  `l1-day-body.css` (the 10 day).
- **Five literals:** index.html `<meta name="theme-color" content="#1F140C">` and the pre-paint mood script's `'#FBF8F1'`;
  manifest.json `background_color` and `theme_color` `"#1F140C"`; js/views.js praxisSetMood `'#FBF8F1' : '#1F140C'`.
- Untouched (non-goals): every other token (incl. `--sky`, `--yumi`, every gradient, `--grain-*`, `--bl-*`), components.css,
  praxis-kit.css, lumen-amber.css, marks.js, hand.js, the lens engine (LENS_GEN_SYSTEM still 2,639), the ?sky switch.

## Stage 0 — pre-flight: PASS
HEAD `50d419d` == origin/main; CACHE_VERSION `praxis-v3.322`; tracked tree clean; foundations lumen-amber `631bc2aa…`,
marks `772886c0…`, hand.js `fd51ca7e…`. Pre-images (committed blob md5): **6 / 6 MATCH** → EXACT mode for all six. Anchors:
night `:root {` :22–105, day `html[data-mood="day"],` :377–410, auto `html[data-mood="auto"] {` :412–443; **35 / 35 rows
MATCH** (one declaration each, old value). Literals: the five lines plus theme.css :24 / :380 / :413 — no unknown hit.
Generator: `perl build-theme.pl …` on the current theme.css exits **255**, `unparsed :root text: color-scheme: dark;` (it
transformed the pre-L1 file once); the rule kept is that the two sources carry theme.css's values by hand. Consumers
(components.css, declarations split on `;{}`): `color: var(--gold)` 49 · `background(-color): var(--gold)` 69 · `border*`
with `var(--gold)` 76 (+25 `outline`) · occurrences `var(--gold)` 244, `var(--gold-ink)` 54, `var(--gold-star)` 19. No
harness asserts a changed value. Nothing reserved v3.323.

## CHECKPOINT 1 — the tokens: PASS
- numstat: theme.css **35 35** · l1-core.css **15 15** · l1-day-body.css **10 10**; no other file changed.
- Blob bytes (`git cat-file -p :<path> | wc -c`): **41,369 · 4,602 · 961** — delta 0 each.
- EXACT: blob md5 theme.css **`25c4081ad62d132c12256b42b69fe1a6`** · l1-core.css **`d3e86edaf7dec4cb1637e46ddba0c43a`** ·
  l1-day-body.css **`2b3ecf5028304a1a2b95ae4a8af440a4`** — all MATCH.
- P3: the day body (:380–409) and the auto body (:413–442) are byte-identical (md5 `2b3ecf50…` both — the same md5 as the
  edited `l1-day-body.css`).
- 1.4 the generator: still exits **255** on the edited tree with the same line; not run, not edited (as ruled).

## CHECKPOINT 2 — the five literals: PASS
- numstat: index.html **2 2** · manifest.json **2 2** · js/views.js **1 1**. Blob bytes **10,628 · 584 · 1,355,472** (delta 0).
- EXACT blob md5: index.html **`163d65fe3d42d3abb3f365b4b58eb3ce`** · manifest.json **`36c362d9adb87494c6db45287d70534a`** ·
  js/views.js **`68eeccaf4b0ee9035946a5f043a7b96e`** — all MATCH. parse-check **20 / 20** OK.
- `24180C` / `EDD79E`: **0** hits in the tracked tree outside docs/, design/, proposals/, vendor/. EOL kept (index.html and
  manifest.json CRLF; views.js LF).

## CHECKPOINT 3 — measure (report only): PASS
**Method.** L1's P4 (the `l1rig.js` contrast walk and floors: 4.5, 3 for large text and glyphs) in a rig-only script
(`.claude/rig/captures/lc1/lc1-measure.js`, untracked) over the twelve L1 routes PLUS #lenses with an offer open, a lens
sheet, the say-back panel, #arcs, one #arc/<id> and #about — both moods, true 390 and 1360, the sky key UNSET (the sky on, as a
reader sees it), the l4 fixture (20 books, 3 kept lenses, 2 open offers) plus the seed arc. Baseline and after were taken in ONE
page session: the edited theme.css was swapped in (cache-busted) without a reload, so the same data was compared row by row.
Rows: **1,604** at 390 · **1,892** at 1360 (before = after; 2 rows per width differ only by a time-of-day string).

- **A. NEW FAILURES — none.** 0 at 390, 0 at 1360.
- **B. Already below floor in the baseline (pre-existing; not this lane's):** `.search-chip-n` counts 3.12 → 3.40 night /
  2.55 → 2.73 day (both widths) · `.bk-unwoven-note` "not yet woven" day 3.83 → 4.26 · `.yumi-sees-closing` day 1.36 → 1.76 ·
  About `.intro-tag` day 3.12 → 3.40 · About `.about-spine-eyebrow` / `.about-spine-link` day (1360 only) **1.82 → 1.71**
  (the one row that moved DOWN; it stays in B — see C1).
- **C. Improved across the floor:** the L1 ruled residuals on `--page-3` — `.transparency-entry-meta` 3.84 → 5.45 night /
  4.17 → 5.72 day (19 rows each) and the search bar's `.app-nav-search-input` / `.app-nav-search-kbd` 3.84 → 5.45 / 4.17 →
  5.72 on every route at 1360 · the lens cards' cover authors (`small`) day 4.07 → 5.72 (lenses, lens sheet) · About
  `.intro-tag` night 3.98 → 4.69 · `.pf-taphint` day 4.35 → 4.71.

**The four named risks.**
- **C1 — gold as text on day paper: YES, one consumer.** Scanning every text element whose computed colour is the new gold
  (`rgb(242,183,46)`) in day on the measured routes: About's spine, `.about-spine-eyebrow` "On this page" and
  `.about-spine-link` "What Praxis is", **1.71 on `#FBF8F1`** (1.82 before). Every other gold text found sits on dark ground:
  the toast's "Undo" 8.93 on `#2b1e12`, the scan glyph 10.22, the counts over You's sky 8.93. Per the amendment, `--gold` is a
  fill and `--gold-ink` is the ink; this row is the input to a later lane, not patched here.
- **C2 — the day `--lamp` glow: NO stain from it.** `--lamp` feeds only `--sky-a` / `--sky-b` (and two unused `--hour-*`
  aliases), consumed once: `.sky{background-image:var(--sky-a),var(--sky-b)}` (components.css:17450) — it paints inside the
  lens sky's own brown ground, never on page paper. The top of #books, #notebook, #lenses and Home below the sky show no glow.
  **A different finding, recorded, not fixed (non-goal tokens):** the day grain, `body::after` (an SVG noise, `--grain-op .32`,
  `--grain-blend multiply`), multiplied over the near-white paper reads as a **grey wash** where the page ground shows (About;
  Home below the sky; the gutters of the Shelf and the Notebook). On the old wheat it read as warm texture. The computed ground
  is clean `#FBF8F1`; the cast is the grain. See SEPARATE TASKS.
- **C3 — the Arcs list and an arc: NO new failure.** #arcs + #arc/<id>: 390 night/day min 4.96 → **5.67**, 0 under; 1360 night
  min 3.84 → **5.45** (4 under → 0), day 4.17 → **5.67** (4 → 0).
- **C4 — the L4 surfaces: NO new failure.** Lenses + lens sheet + say-back: 390 night min 4.76 → **6.48**; day 4.07 → **5.72**
  (5 under → 0); 1360 night 3.84 → **5.45** (2 → 0); day 4.07 → **5.72** (7 → 0). **The text over the sky reads more clearly on
  its unchanged brown ground:** the greeting 11.00 → 12.25, the date / counts / hint 5.60 → 6.04, You's mode buttons 6.95 →
  7.18 and 7.43 → 8.08. The lens NAMES on the sky are drawn on canvas by hand.js in its own colours (unchanged) — not DOM text, so
  not in the sweep.

**VISUAL GATE.** Settled captures (animations off), sky key unset, before (the untouched tree) and after (the edited
theme.css): #home (the sky, and the body below it), #books, `#book/bk_l4_01`, #notebook, #profile, #lenses, a lens sheet,
#about — true 390 and 1360, Night and Day: **72 files** under `docs/checkpoints/lc1-shots/` (`before-<width>-<mood>-<room>.jpg`,
`after-…`), 884 KB. Computed styles are not proof of a look; Preston's side-by-side closes this lane.

## CHECKPOINT 4 — the red-team (fix-red-team, Sonnet): PASS-WITH-CONDITIONS — no blockers
Verbatim summary of its findings: theme.css's staged blob equals the carry's `theme.after.css` exactly and its hunks match
`theme.diff.txt` row for row; the traps held (night `--sky #1C120A` unchanged while `--on-gold` moved; day `--ink` and
`--on-gold` both moved); day == auto; the two sources equal the carry's `.after` files; the literal files changed only the
listed lines, CRLF intact, the JS a string swap inside the existing ternary (PARSE OK). Its conditions, all met or recorded:
- **R1 (residual, pre-existing, non-goal):** old-gold `rgba(232,178,58,…)` in `--lamp-foot`, `--spill`, `--star-glow`
  (theme.css :51, :55, :56) and hand.js:334's `#F5E8C4` star halo now sit slightly off the new `--gold` / `--ink`.
- **R2 (residual, pre-existing, non-goal):** old-ink `rgba(42,30,16,…)` in `--shadow-cover`, `--card-hi`, `--bl-edge`
  (:71, :397, :406, :430, :439) — about one channel unit off the new ink; imperceptible.
- The contrast re-measure (done: Checkpoint 3) and the CACHE_VERSION bump (done: Stage 5).

## CHECKPOINT 5 — docs and the version
- Landed from the carry, byte for byte, each **MATCH** against MANIFEST.txt: `docs/studio/v1-canon-delta-amend-1.5.md`
  (2,618 B, `ec51215c…`) · `docs/checkpoints/p2-eighteenth-sitting-rulings.md` (10,766 B, `6d5c102d…`) ·
  `docs/studio/rooms-census.md` (6,347 B, `b79059f6…`, a dated record) · `docs/studio/DESIGN-HANDOFF-14nov.md` (4,151 B,
  `022b3c05…`, a dated record).
- BOARD.md: one dated note at the head; no cell's structure changed.
- sequence.md: LC1 marked built at v3.323, kept `[~]` until the felt pass (the Builder drops `[x]` items from Now) → this file; the single L4b entry replaced by the §C lane table (LC1 → L4b-1 →
  L4b-2 → L4b-3 → L4b-4 → LC2 → L4b-5) with its original text beneath as history; L4c stays the next build after LC1 (R1, 15
  Nov); a dated re-plan entry. No other lane moved.
- `docs/studio/praxis-universal-token-sheet.md`: states **none** of the 25 changed values (0 hits for any old hex) — left as is
  (it records July R1-era values, already superseded by canon 1.4; see SEPARATE TASKS).
- sw.js CACHE_VERSION `praxis-v3.322` → **`praxis-v3.323`** (the only place the code carries it). BUILD_STATE.md header and
  ladder. The Builder regenerated: `praxis-v3.323`, **warnings 0**, LC1 rendered under Now (3 hits for "THE COLOURS").
- Re-verified at the close: the six staged blob md5s and byte counts unchanged from Checkpoints 1–2; foundations lumen-amber
  `631bc2aa…`, marks `772886c0…`, hand.js `fd51ca7e…` (working tree == HEAD); components.css and praxis-kit.css untouched;
  lens-eval **40/40**, lens-data **101/101**, export **58/58**, delete **58/58**, ceiling-core **36/36**, fx1c-sim **60/60**,
  parse-check **21/21** OK (js/*.js + sw.js + assets/marks.js); hook gate **ARMED**; the four landed docs MATCH.

## SEPARATE TASKS (pre-existing, flagged — not fixed here)
1. **The day grain on near-white paper** reads as a grey wash (`--grain-op .32` × `multiply`), most visibly on About and in the
   page gutters. `--grain-*` is a non-goal token for LC1.
2. **Gold as text on day paper:** About's spine (`.about-spine-eyebrow`, `.about-spine-link`) at 1.71 — the C1 list; the
   amendment's fill/ink split says these want `--gold-ink`.
3. **R1 / R2** (above): old-gold and old-ink rgba literals in non-goal tokens and hand.js.
4. **Two documents both titled "amendment 1.5":** `v1-canon-delta-amend-1.5-sky.md` (L4, the sky) and
   `v1-canon-delta-amend-1.5.md` (LC1, the colours, r88). Different files, nothing overwritten; the numbering wants a ruling.
5. **The universal token sheet** (v1.2, July) lists `--page #f4efe4`, `--page-2 #fffdf8`, `--gold-ink #855410` — values superseded
   by canon 1.4 and now 1.5.
6. **The generator** (`build-theme.pl`) cannot run on any post-L1 theme.css (exit 255); the sources are kept in step by hand.

## NOT proven
The look on Preston's own devices (his side-by-side felt pass closes the lane), and the live site (served version and
theme.css), which waits for the push.
