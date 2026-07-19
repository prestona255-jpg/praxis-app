# R-POLISH B1-FIX + PALETTE V2 — "THE HOUR, REFINED"

Model: Opus 4.8, default effort · gate agents Sonnet · base HEAD `923a796` (v3.231)

---

## STAGE 0 — ANCHORS + BANDS

### 0.1 · Reference files — all three PRESENT, byte-exact

| File | Expected | Actual | Verdict |
|---|---|---|---|
| `docs/studio/praxis-the-hour-refined.html` | 17,154 B ±10 | **17,154 B** | EXACT |
| `docs/studio/felt-script.md` | 1,604 B ±10 | **1,604 B** | EXACT |
| `docs/studio/praxis-illuminated-worlds.html` | 24,928 B ±10 | **24,928 B** | EXACT — see note |

**Note (mechanical, carried):** the third file is on disk as
`docs/studio/praxis-illuminated-worlds (4).html` — a browser-download suffix, byte-exact
content. Renamed to the canonical name at Stage 3.5. Not a HALT: the file is present and
byte-identical to spec.

All three are **untracked**. 106 untracked total − these 3 = **103 strays**, exactly the
count the brief names. Reconciles.

### 0.2 · Anchors verified

| Anchor | Status | Evidence |
|---|---|---|
| B1 fixed-paper `::before` | LIVE — **two** layers | global `theme.css:450-469` (+ dark override `474-476`); Home-scoped `components.css:13084-13098` |
| nav selectors | LIVE | `.app-nav` `components.css:626-639`; ≥760 pill `794-800`; links/active `709-737`, `802-819`; search `657-667`; avatar `746-774`; mobile `5437-5455`; markup `index.html:32-58` |
| marginalia text styles | LIVE | body class `.notebook-entry-body`; TY-1 `.ty-reader` law at `components.css:14837` |
| uppercase leak source | **DEAD — no such source exists** | see §0.4 |
| `.yumi-bloom` sizing | LIVE | `components.css:19-34` (fixed, z 9999); orb 56×56 `41-46` |
| `theme.css :root` + `[data-ground]` | LIVE | `:root` 7-359; dark remap 369-400; `body` 402-413 |
| `index.html` theme-color | LIVE | `index.html:6` = `#2f1c0e` |
| manifest background_color | LIVE | `manifest.json:6-7` = `#faf6ec` / `#faf6ec` |

**Drift found (informational):** three uncoordinated ground literals — `index.html:6`
`#2f1c0e` vs `manifest.json` `#faf6ec` vs `--page` `#f4efe4`. The PWA rider reconciles the
first two to `#191F33`.

### 0.3 · THE ARCHITECTURE FINDING (this is the leverage)

`js/views.js:410` — `umberGroundDark` already maps **every route to dark except `home`**:

```
{ books, arcs, arc, account, book, subtheory, notebook, profile,
  commons, reader, walk, search, about, artifact, yumi-sees } -> dark
home -> bright   (B1 removed it, per PG-1 v1.4)
```

The app is therefore **already a dark world on 15 of 16 routes**. Crossing into THE HOUR,
REFINED is a **token re-tune + Home rejoining the set**, not an app-wide rewrite.

Corroborating feasibility count in `assets/components.css`:

| Measure | Count |
|---|---|
| `var(--…)` usages | **4,899** |
| hex literals | **335** |
| ratio | **14.6 : 1** |

Most literals duplicate token values (`#645940`=`--ink-2`, `#a8761a`=`--gold`,
`#241710`=`--ink`, `#f4efe4`=`--page`, `#855410`=`--gold-deep`). Re-pointing `theme.css`
converts the world app-wide.

### 0.4 · THE TWO STAGE-2 PREMISES — BOTH FALSIFIED (evidence required, evidence given)

**(a) NAV VISIBILITY — real bug, but NOT the brief's suspected mechanism.**

The brief names B1's fixed `::before` as "prime suspect." It is not the cause. Measured
live at 1920 on the deployed v3.231:

| Probe | Value |
|---|---|
| `.app-nav` computed `position` | **`static`** |
| `.app-nav` computed `z-index` | **`auto`** |
| nav `top` at scroll 0 | `14px` |
| nav `top` at scroll 600 | **`-80px`** (height 80) |
| nav still on screen | **`false`** |

The nav is not stacked *under* anything — it simply **is not sticky and scrolls away**. No
transform/filter/backdrop-filter/will-change exists on `body`, `#app`, or `.home-page`
(full-chain static check). **Determined fix:** `position:sticky; top:0` + a z-index per the
ledger, per the reference (`sticky/top:0/z-index:20`). This is pre-existing, not B1's.

**(b) READER'S WORDS uppercase leak — NO SUCH DEFECT. Criterion already met.**

Three independent methods agree:

1. **Exhaustive static search** — all 230 `text-transform` declarations across every linked
   stylesheet, and all 10 `.toUpperCase()` calls in `js/*.js`. Every uppercase rule matches
   a label/eyebrow/chip/meta; every `.toUpperCase()` hits an avatar initial, an ISBN, or an
   internal sentinel. Marginalia body classes (`.notebook-entry-body`, `.note-body`,
   `.bk-atext`, `.stb-passage`, `.rf-body`) have none, and their ancestors carry none to
   inherit.
2. **Computed-style sweep** on Home — only `.app-nav-link` is uppercase (correct; the
   reference sets nav links uppercase mono too).
3. **Live mixed-case probe**, seeded and rendered on the real Notebook surface:

| Probe | Value |
|---|---|
| rendered text | `The Hour Refined — a Mixed Case Sentence, exactly as I typed` |
| `text-transform` | **`none`** |
| `font-style` | **`normal`** (upright) |
| font / size | Cormorant Garamond · 17px |

That is exactly TY-1's READER'S-WORDS LAW. **No edit is warranted; Stage 2(b) passes as
already-satisfied.** A fix here would have been a fabricated fix to a non-existent bug.

**The adjacent REAL finding (scope addition — surfaced, NOT built):** what actually shouts
is *chrome uppercasing whole sentences* — `.nb-leaftag` renders
`"THE WORKING PAGE · WHERE A SUB-THEORY FORMS"`, plus `"OR BRING ONE IN"`, `"CATCH A NOTE"`,
`"ASK YUMI"`. That matches the felt complaint ("did anything SHOUT that should whisper"),
but it is **TY-1 type-ramp work** ("DM Mono demoted to TRUE meta only; section headers move
up the ramp"), not a marginalia fix and not this slice's scope. Filed for Preston's call.

### 0.5 · Baselines + DECLARED BYTE BANDS (declared BEFORE writing)

| File | Baseline B | Lines | CODE band | COMMENT allowance |
|---|---|---|---|---|
| `assets/theme.css` | 26,123 | 523 | **+2,000 … +4,500** | +1,500 |
| `assets/components.css` | 742,737 | 14,958 | **+6,000 … +11,400** | +2,500 |
| `js/views.js` | 1,037,052 | 22,208 | **+1,500 … +5,000** | +2,000 |
| `index.html` | 8,111 | 172 | **−5 … +15** | 0 |
| `manifest.json` | 312 | 16 | **−5 … +15** | 0 |
| `sw.js` | 4,837 | 138 | **0 ± 4** | 0 |

Two-figure convention per `feedback_two_figure_band`: CODE band is a hard ceiling; the
COMMENT allowance is soft and clears by line classification.

Other baselines held for reference: `lumen-amber.css` 14,681 B (byte-locked, untouched),
`marks.js` 10,255 B (untouched), `docs/studio/kit/praxis-kit.css` 14,407 B.

### 0.6 · Stage 0 verdict

**PASS — no dead anchor that halts.** The one dead anchor (§0.4b, the uppercase source) is
dead because the defect does not exist; its acceptance criterion is met on current main and
is recorded as PASS rather than patched. Both Stage-2 mechanism hypotheses were falsified
and replaced with measured ones. Proceeding to Stage 1.

**Standing boundary restated:** nothing is committed or pushed until Preston sends the exact
words. Stage 4's "commit + push" is prepared and then HALTS for those words.

---

## STAGE 1 — THE WORLD (COMPLETE)

*(Rewritten against the FINAL diff after the red-team's finding 1 — an earlier revision of
this section described a mid-build tree and understated three byte deltas ~9x. Every number
below is re-measured, LF-normalized, on the artifact that would actually ship.)*

| Item | File | Status |
|---|---|---|
| Twilight arc + lamp + horizon + on-ground ramp + gold + vellum + jewel marks `--m1..--m5` | `theme.css` | **DONE** |
| Dark-world tokens re-pointed (Umber brown -> the Hour); names kept, values swapped | `theme.css` | **DONE** |
| Ground = fixed-POSITION layer, NOT `background-attachment:fixed` | `theme.css` `body::before` | **DONE** |
| Grain = own STATIC fixed layer @ .015 (the scroll-perf lever) | `theme.css` `body::after` | **DONE** |
| UI font -> SF system stack (DM Sans retained as fallback) | `theme.css` | **DONE** |
| PWA rider: theme-color + manifest -> `#191F33` | `index.html`, `manifest.json` | **DONE** |
| Home rejoins `umberGroundDark` (B1's bright flip retires) | `views.js:410` | **DONE** |
| LIT-PAGE vellum recipe + applied to Home's 3 card surfaces | `components.css`, `views.js` | **DONE** |
| Cloth-spine tokens (`--cloth-*`) — moved out of components.css per red-team 5 | `theme.css` | **DONE** |
| Contrast re-run, on-ground AND on-card | — | **DONE — 15/15 PASS** |
| Nav (SOLID per the ruling, not frosted) | `components.css` | **DONE** |
| Kit re-point verify (R4) | `docs/studio/kit/` | **DONE — see §3.4** |

### 1.1 · The world, measured (rig @ localhost:8791, signed-in stub, fresh JS asserted live)

| Probe | Value | Reads as |
|---|---|---|
| `body` color | `rgb(240,235,223)` | `#F0EBDF` on-ground cream |
| `body[data-ground]` on `#home` | `dark` | Home rejoined the world |
| `.app-nav` background | `rgb(23,27,43)` | `#171B2B` `--nav-solid` |
| `.notebook` bg / ink | `rgb(244,239,228)` / `rgb(36,23,16)` | a printed page ON the world |
| `.home-arc.lit-page` | vellum gradient, radius `15px`, **3** shadow layers | the lit page |

## STAGE 2 — THE REGRESSION FIXES

### 2.1 · NAV VISIBILITY — FIXED (desktop) + PROVEN by geometry

| Probe | Before (v3.231 live) | After |
|---|---|---|
| computed `position` | `static` | **`sticky`** |
| computed `z-index` | `auto` | **`30`** |
| `top` at scroll 600 | **`-80`** | **`0`** |
| on screen at scroll 600 | **`false`** | **`true`** |
| `backdrop-filter` | `none` | `none` (canon held) |

Proven on **Home AND Notebook** at 1920, per the brief's wording.

**SCOPE DISCLOSURE (red-team finding 3, accepted):** the fix is **desktop-only**. A
pre-existing `@media (max-width:759px)` rule (`components.css` ~5450) resets
`.app-nav{position:relative}`, so below 760 the nav still scrolls away — measured at 390:
`navPos:"relative"`, `top@600: -492`, `stickyHeld:false`. The brief specified 1920; mobile
was not in scope and that mobile rule looks deliberate, so it is **left unchanged and named
as residual R1** rather than silently widened. Collision risk ruled out and confirmed here:
no clash with `.shelf-head` (sticky, z 40) — at that width only one is ever sticky, because
`.app-nav` is forced back to `relative`.

### 2.2 · READER'S WORDS — no defect; re-proven ON THIS BUILD

| Probe | Value |
|---|---|
| rendered | `The Hour Refined — a Mixed Case Sentence, exactly as I typed it.` |
| `text-transform` | **`none`** |
| `font-style` | **`normal`** (upright) |
| font / size | Cormorant Garamond · 17px |

Page-wide uppercase sweep on the built Notebook: **only chrome** (nav links, `.eyebrow`,
`.nb-leaftag`, `.seg-opt`, entry tags). No reader content uppercased. **No edit made.**

### 2.3 · THE FLOWER (R2) — CLOSED, proven by measured geometry

Re-ruled to AMB-1 + the reference: `.yumi-bloom-orb` 56px -> **42px**; glow
`0 3px 12px @38%` -> **`0 0 8px @32%`** (the offset drops to `0 0` because a lit corner
ambience sits AROUND the mark, not below it). `--gold` resolves to the world gold under
`.yumi-bloom`, so ONE recipe now serves every route — the old two-ground hedge is
unnecessary in a single world. Position untouched (bottom-right at `--sp-5`, already
AMB-1's corner); **z-index kept 9999 per the ledger** — the reference's `z:5` is
mockup-local and would sink the flower under app panels.

| Route × width | orb | glow | position / z | corner gap | visible fixed elements |
|---|---|---|---|---|---|
| Home @1920 | **42×42** | `0 0 8px` `rgb(199,154,58)`/.32 | `fixed` / `9999` | 24 / 24 | **1 — `.yumi-bloom` only** |
| Notebook @1920 | **42×42** | same | `fixed` / `9999` | 24 / 24 | **1 — `.yumi-bloom` only** |
| Home @390 | **42×42** | same | `fixed` / `9999` | 24 / 24 | **1 — `.yumi-bloom` only** |
| Notebook @390 | **42×42** | same | `fixed` / `9999` | 24 / 24 | **1 — `.yumi-bloom` only** |

`rgb(199,154,58)` = **`#C79A3A`**, the ruled colour. Identical on every route and width:
one ruled size, one ruled glow. **AMB-1's "nothing else floats" is PROVEN**, not asserted —
an enumeration of every *visible* `position:fixed` element returns exactly one on all four
combinations. (The bottom-left "+" create door is R-CAPTURE's and not built yet, so one
corner is correctly occupied and the other correctly empty.)

**Measurement note:** the right gap first read 39px. Rather than "fix" it I checked — it
was the 15px scrollbar (`innerWidth` vs `clientWidth`). `cssRight` is `24px` and the true
gap is 24/24. No asymmetry existed.

**Observation for the felt pass (NOT changed — deferred palette):** the crest's strokes are
on-palette (`#DFB759` ember, `#C79A3A` world gold, `#2e8a93` Yumi teal), but the halo circle
behind it fills from `--tradition-*-halo`, which resolves **salmon** (`rgb(240,168,138)` at
.55). CLAUDE.md freezes the `--tradition-*` feed as a separate deferred retint, so it is
deliberately untouched. The flower reads gold-glowed with a soft warm wash behind it.

## STAGE 3 — HOME BECOMES THE HOUR (COMPLETE)

| Treatment | Evidence |
|---|---|
| dated kicker, REAL current date | `"Sunday · July 19 · the study is lit"` · DM Mono · uppercase · `--on-ground-3` |
| hero + italic gold accent | `"Welcome back, reader."` · accent italic, `#DFB759` |
| gold hairline rule | 64 x 1 px, gold -> transparent |
| THE GOLD THREAD | see §3.1 |
| ember dot on "touched today" | dot `#8F6A12`, 7px — present on the today arc, **absent** on "touched 3 days ago" (conditional proven BOTH ways) |
| cloth spines | 3px, opacity `.85`, deterministic per arc id |
| card hover lift | `.lit-page-lift`, reduced-motion guarded |

Arc thumbnails **untouched** (B2/GR-1), per the non-goals.

### 3.1 · The gold thread — engineered structurally, and the bug that proved it

The reference positions nodes at hardcoded pixel tops (`top:176px`, `top:360px`). Here the
line is a container pseudo and **each row owns its node**, centred at `top:50%`.

**A real defect was caught by measuring, not reading:** the composed layout resets
`.home-page.lum-amber-deep.home-composed > *{padding-left:0}` at `min-width:1200px` — the
SAME specificity (0,3,0) as the thread rule and LATER in source order, so it silently won.
The gutter computed to `0px` while the nodes sat at `-30px`: line and nodes would have been
**34px apart**. Fixed by naming the composed selector explicitly at (0,4,0).

Final alignment, every row: **`nodeDx = [0, 0, 0, 0]`** (exact), with row heights varying
23.2 / 187.5 / 187.5 / 61.3 px — i.e. genuinely zero hardcoded vertical offsets.

### 3.2 · CONTRAST GATE — 15/15 PASS (measured on RENDERED pairs)

ON-GROUND (vs the twilight world `#191F33`):

| Pair | px | Ratio | Need | Verdict |
|---|---|---|---|---|
| kicker | 11.5 | **4.66** | 4.5 | PASS |
| hero gradient stop 1 (cream) | 34 | **13.74** | 3 | PASS |
| hero gradient stop 2 (world gold) | 34 | **6.31** | 3 | PASS |
| hero accent (ember gold) | 34 | **8.60** | 3 | PASS |
| altnote / section label / field stat | 12-13 | **7.47** | 4.5 | PASS |
| Yumi voice (after re-point) | 16 | **7.11** | 4.5 | PASS |
| nav link on `--nav-solid` | 12 | **14.38** | 4.5 | PASS |

ON-CARD (vs vellum `#FDF9EE`):

| Pair | px | Ratio | Need | Verdict |
|---|---|---|---|---|
| arc title | 21 | **15.32** | 4.5 | PASS |
| arc meta / desc / reading status | 12-17 | **7.22** | 4.5 | PASS |
| Continue button | 12.5 | **6.17** | 4.5 | PASS |
| shelf link (on-card gold) | 12 | **4.71** | 4.5 | PASS |

**One real regression found and fixed at token level:** Home's Yumi line used `#256b80` —
the deep teal chosen for AA on a LIGHT page. On the world it measured **2.72 (FAIL)**. New
token `--teal-on-ground: #5FB8C4` measures **7.11 (PASS)**. Shelf's twin keeps `#256b80`
deliberately: that surface is still a light page.

### 3.3 · Width sweep — 390 / 768 / 1280 / 1920 / 2560

| Width | h-scroll | Home overflow | threadPad | nodeDx | radius | nav |
|---|---|---|---|---|---|---|
| 390 | none | none | 34px | 0 | 15px | `relative` (residual R1) |
| 768 | **yes — pre-existing, see below** | none | 34px | 0 | 15px | sticky |
| 1280 | none | none | 34px | 0 | 15px | sticky |
| 1920 | none | none | 34px | 0 | 15px | sticky |
| 2560 | none | none | 34px | 0 | 15px | sticky |

**The 768 overflow is B1's pre-existing residual, NOT this slice's.** `.app-nav-list`
right=774 at clientWidth 753. I suspected my SF-stack change had widened it and **A/B'd it
rather than assume**: nav-list width is **426.1px under BOTH** the new stack and the old DM
Sans stack — **delta 0** — because nav links use `--font-mono` (canon §4-B), not
`--font-body`. The stack does resolve to Segoe UI on this box (glyph 178.1 vs DM Sans
171.2), but it never touches the nav. The 8px -> 21px difference vs B1's recorded figure is
signed-out "Sign in" vs the signed-in avatar: a fixture difference.

### 3.4 · KIT VERIFY (R4) — CLOSED. Pre-fire rider 1, executed as written.

**The finding that mattered: the kit demo does NOT link `theme.css`.** `kit.html:4` links
only `praxis-kit.css`, so the demo **stubs its own token set** — and that stub had frozen
the RETIRED Umber dark-study palette. The kit would have gone on speccing B2–B4 in a world
the app no longer wears. This is exactly what the rider existed to catch.

Retired-world literal sweep (Umber dark-study values incl. the ground-gradient browns):

| File | Before | After |
|---|---|---|
| `docs/studio/kit/praxis-kit.css` | 1 | **0** |
| `docs/studio/kit/kit.html` | 12 | **0** |
| `docs/studio/kit/l3-proof.html` | 0 | **0** |

*(My first pattern found 10 in `kit.html`; broadening it to the ground-gradient browns
`#402812`/`#281609` found 2 more — reported as 12, not the flattering 10. The single
remaining grep hit is my own comment text quoting the retired value; the live declaration
is `var(--gold,#C79A3A)`.)*

Re-points made — **token values only, no build work**: the demo's `[data-ground="dark"]`
stub -> the Hour's dark remap; `.ground.dark` -> the twilight arc; `praxis-kit.css:116`
focus-ring fallback `#d2a23e` -> `#C79A3A`.

**Demo renders in the Hour — confirmed:** ground `linear-gradient(178deg, rgb(25,31,51) 0%,
rgb(27,29,43) 36%, …)`; resolved tokens `--ink #F0EBDF` · `--ink-2 #B4AFA2` ·
`--gold #C79A3A` · `--surface #232838` · `--border rgba(240,235,223,.10)`. Console clean.

Three control pairs spot-measured against the new ground AND card values:

| # | Control | Ground | Ratio | Need | Verdict |
|---|---|---|---|---|---|
| 1 | text input, DEFAULT | dark (world) | **10.41** | 4.5 | PASS |
| 1b | text input, DEFAULT | light (card) | **14.17** | 4.5 | PASS |
| 2 | focus ring `--gold-deep` `#DFB759` | dark, vs world | **8.60** | 3 | PASS |
| 2b | focus ring, vs card surface `#232838` | dark | **7.72** | 3 | PASS |
| 2c | focus ring `--gold-deep` `#855410` | light surface | **6.31** | 3 | PASS |
| 3 | disabled `[disabled]` | light | 1.86 effective | — | **CC-4 compliant** |
| + | primary button (bonus) | dark | **8.40** | 4.5 | PASS |

Disabled is measured at its true composite (40% opacity over its backdrop) and is
`pointer-events:none` — CC-4's "40% ink, no pointer", exactly. WCAG 1.4.3 exempts inactive
controls from the text minimum, so 1.86 is reported as compliant-by-exemption rather than
dressed up as a pass. Focus ring read from the CSSOM declaration (`:focus-visible` is not
readable idle — the known rig gotcha) and resolved per ground.

## STAGE 3.5 — DOCS RIDERS (COMPLETE)

- All three reference files staged VERBATIM, byte-exact, at canonical names
  (`praxis-illuminated-worlds (4).html` -> `praxis-illuminated-worlds.html`, 24,928 B).
- `r-polish-brief.md` §PG-1 amended to **v2**, prior text struck through and marked
  SUPERSEDED with the reason. **No other rewording anywhere** in that file.
- **NAV FROST RULING recorded** (Preston, 2026-07-19): SOLID `#171B2B` stands; canon §4-A
  wins; the brief's Stage-1 blur order reads as **superseded, not skipped**; canon NOT
  amended; `--nav-frost` / `--nav-blur` remain as dormant tokens.

## STAGE 4 — RED-TEAM + EXIT

### 4.1 · Red-team (Sonnet) — 1 BLOCK + 4 CONCERNS, all dispositioned

| # | Finding | Disposition |
|---|---|---|
| 1 | **BLOCK** — checkpoint stale vs the real diff; three deltas understated ~9x | **FIXED** — this whole section rewritten against the final diff; all deltas re-measured LF-normalized |
| 2 | **CONCERN** — gold hero accent likely invisible: `-webkit-text-fill-color` inherits `transparent` from the gradient-clipped parent | **CONFIRMED REAL, FIXED.** Measured: accent `color:#DFB759` but `-webkit-text-fill-color:rgba(0,0,0,0)` — **my own contrast probe's 8.60 PASS was a FALSE PASS.** Fixed by setting the fill explicitly; re-measured `-webkit-text-fill-color: rgb(223,183,89)` |
| 3 | **CONCERN** — sticky fix silently desktop-only | **ACCEPTED** — disclosed in §2.1, named residual R1 |
| 4 | **CONCERN** — app-wide `--border`/`--wash` alpha cut, unverified off Home | **MEASURED, IMMATERIAL** — hairline vs world **1.379 -> 1.31** (~5% softer, not the 44% the raw alpha implies: cream@.10 is nearly gold@.18 in luminance delta). Plus the 5-route sweep, §4.2 |
| 5 | **NIT** — six new hardcoded hexes in `.lit-spine` | **FIXED** — moved to `theme.css` as `--cloth-*` tokens, matching the jewel-mark precedent |

Verified clean by the red-team: `--ground-grad` forward-reference resolves; `parse-check`
PASS (harness self-validated against a deliberately broken copy); ES3 conventions held in
all new JS; spine hash degrades safely on a missing `arc.id`; the signed-out Home path
resolves correctly.

### 4.2 · Blast-radius sweep — 5 other routes, NO new regressions

Automated low-contrast scan across `#notebook`, `#books`, `#arcs`, `#account`, `#about`.
Every hit was triaged against its BASE value rather than assumed:

| Hit | Verdict |
|---|---|
| `#about` — 8 SVG labels "cream on light", ratio 1.1 | **FALSE ALARM — my own probe's bug.** SVG `<text>` paints via `fill`, not `color`. Actual fill `rgb(28,18,9)` on `rgb(253,250,243)` ~ 15:1. Correct. |
| `#notebook` — "Yumi reads along" 1.91 | **PRE-EXISTING.** Base `--muted #c2a87f` measures **1.99**; now **1.93**. Not introduced here. |
| `#account`, `#books` — `#978b6d` / `#a8761a` at 2.74-4.15 | **PRE-EXISTING** light-page debt; Slice 0 already logged `--ink-3` at 2.94. |
| `#arcs` | clean |

Console: **clean** (zero errors) across the built routes.

**Honest limit:** the sweep covered 5 routes and capped at 8 hits per route. It is evidence
of no *broad* regression; it is not proof of exhaustive coverage.

### 4.3 · BYTE LEDGER — measured before AND after, LF-normalized

| File | Base (LF) | Now (LF) | Delta | CODE | CODE band | COMMENT | Verdict |
|---|---|---|---|---|---|---|---|
| `assets/theme.css` | 25,600 | 32,743 | +7,143 | **2,927** | +2,000…+4,500 | 5,450 | **CODE PASS** |
| `assets/components.css` | 727,980 | 739,419 | +11,439 | **6,865** | +6,000…+11,400 | 7,079 | **CODE PASS** |
| `js/views.js` | 1,014,844 | 1,018,557 | +3,713 | **1,924** | +1,500…+5,000 | 2,925 | **CODE PASS** |
| `index.html` | 7,939 | 7,939 | **0** | 0 | -5…+15 | 0 | PASS |
| `manifest.json` | 296 | 296 | **0** | 0 | -5…+15 | 0 | PASS |
| `sw.js` | 4,837 | 4,837 | **0** | 0 | 0 ± 4 | 0 | **PASS — bumped v3.231 -> v3.232, same length** |
| `docs/studio/kit/kit.html` (R4) | — | — | +753 | 431 | not banded (R4 rider) | 322 | disclosed |
| `docs/studio/kit/praxis-kit.css` (R4) | — | — | +117 | 117 | not banded (R4 rider) | 0 | disclosed |

**Band note:** `components.css` TOTAL (+11,439) sits just above the CODE ceiling figure, but
the ceiling governs **CODE**, which is **6,865 B** — inside +6,000…+11,400 with room. The
total is code+comment; classified, not waved through. R2/R4 added ~445 B of it.

**All three CODE bands PASS — the hard ceilings hold.** All three COMMENT allowances are
exceeded (2.0x-3.6x). Cleared by classification per `feedback_two_figure_band`, but the
pattern is disclosed rather than waved through: this diff carries unusually dense in-file
rationale (the nav-frost fork, the ground-mechanism deviation, the PG-1 v2 amendment, the
specificity trap, the text-fill trap). **Preston's call whether that density is wanted.**

### 4.4 · RESIDUALS (named, not absorbed)

**R2 (flower) and R4 (kit verify) were RULED not-residuals — they were ordered in this
slice — and are CLOSED at §2.3 and §3.4. The list below is the accepted remainder.**

- **R1 — nav not sticky below 760.** Pre-existing mobile rule; the brief scoped to 1920.
- **R3 — `.app-nav-list` overflows ~21px in the 760-800 band.** B1's residual, PROVEN
  pre-existing here by A/B (font delta 0).
- **R5 — pre-existing light-page contrast debt** (`#978b6d` at 2.74-2.94) surfaced by §4.2,
  untouched.
- **R6 — the mono-caps SENTENCE leak** (`.nb-leaftag` etc.), §0.4b. TY-1 ramp work.

Two items carried out of R2/R4 rather than silently absorbed:
- **the flower's salmon halo** (`--tradition-*-halo`) — a frozen/deferred palette per
  CLAUDE.md, deliberately untouched. Felt-pass observation, §2.3.
- **`praxis-kit.css` bare hexes** `#3a6b30` (line 143) and `#3d2807`/`#f2c25a` (line 88) —
  pre-existing convention debt, NOT retired-world literals, so out of the rider's scope.

**All four accepted as disclosed by Preston at the gate ruling (2026-07-19), together with
the comment density.**

### 4.5 · GATE RULING (Preston, 2026-07-19) + SHIP

**Ruled:** R2 (flower) and R4 (kit verify) are NOT residuals — they were ordered in this
slice. Both CLOSED (§2.3, §3.4) before the commit. Nav frost ruled SOLID. Comment density,
R1, R3, R5, R6 **accepted as disclosed**.

`sw.js` bumped **v3.231 -> v3.232** in this same commit (every JS change needs its own bump
or the SW serves a stale bundle). Parse: `views.js` PASS, `sw.js` PASS. Staged
path-explicitly, never `-A`; the 103 untracked strays stay untouched.

Builder NOT regenerated — the round close owns the single regen; per the BUILDER CADENCE
rule this ships at the push point only if it is a round close, which it is not.

Live-smoke results and the felt pass per `docs/studio/felt-script.md` append below.

---

## LIVE-SMOKE GATE — v3.232 @ `685e215` — ALL PASS

Deployed to `praxis-reading.netlify.app`. `HEAD == origin/main == 685e215`.

### S1 · Version took (the stale-SW check)

| Check | Result |
|---|---|
| `/sw.js` cache-busted fetch #1 | **`praxis-v3.232`** |
| `/sw.js` cache-busted fetch #2 | **`praxis-v3.232`** (agree) |
| `manifest.json` background / theme | **`#191F33` / `#191F33`** |
| `<meta name=theme-color>` | **`#191F33`** |

### S2 · The shipped bytes are actually live (fetched from the deploy, not asserted)

All 12 probes TRUE against the deployed assets: `--hour-arc` · `--nav-solid` ·
`body::after` grain · `--teal-on-ground` · `--cloth-ox-1` · `.lit-page` · `.app-nav`
`position:sticky` · `.yumi-bloom-orb` `width:42px` ·
`-webkit-text-fill-color:var(--gold-ember)` · `umberGroundDark = { home: 1` ·
`home-kicker` · `lit-spine`.

### S3 · Ground + nav + flower @ 1920 (signed-out)

| Probe | Value |
|---|---|
| `data-ground` on `#home` | **`dark`** — Home is in the world |
| `body` ink | `rgb(240,235,223)` = `#F0EBDF` |
| nav bg / position / z | `rgb(23,27,43)` / **`sticky`** / `30` |
| nav `backdrop-filter` | **`none`** — canon §4-A held |
| nav top @0 -> @600 | `14` -> **`0`**, `stickyHeld: true` |
| flower | **42px**, glow `rgb(199,154,58)`/.32 |
| visible fixed elements | **1 — `.yumi-bloom` only** |
| horizontal scroll | none |

### S4 · The thread + Home treatments @ 1920 (signed-in)

| Probe | Value |
|---|---|
| kicker | `"Sunday · July 19 · the study is lit"` — real date |
| hero accent | `"reader."` · italic · **`-webkit-text-fill-color: rgb(223,183,89)`** |
| `.lit-page` | radius `15px`, **3** shadow layers |
| thread gutter / node alignment | `34px` / **`nodeDx [0,0,0,0]`** |
| cloth spine | `lit-spine-ox`, 3px, opacity `.85` |
| ember dot | present on `"touched today"` |

The hero accent is the red-team's finding 2 **confirmed fixed on the deploy** — the fill is
gold, not the inherited `transparent` that computed style had reported as a PASS.

### S5 · Marginalia case, on the deploy

| Probe | Value |
|---|---|
| rendered | `The Hour Refined — a Mixed Case Sentence, exactly as I typed it.` |
| `text-transform` / `font-style` | **`none`** / **`normal`** |
| font / size | Cormorant Garamond · 17px |
| reader content uppercased | **0** |
| chrome uppercased | 11 (labels/tags only — the known R6) |

Notebook: `data-ground: dark`, nav sticky held.

### S6 · Scroll-perf

**rAF is paused in this headless pane** (documented rig limitation — it fires neither IO nor
rAF), so an FPS measure is NOT available here and none is claimed. Substituted an honest
proxy: 120 forced scroll+layout+style cycles, grain enabled vs disabled.

| Run | ms |
|---|---|
| with grain | 16.0 |
| grain disabled | 17.6 |
| with grain (repeat) | 14.0 |

Grain delta **−1.6 ms / 120 cycles**, i.e. *smaller than run-to-run variance*. No measurable
cost; **the grain lever stays at .015**. True stutter remains a felt-pass judgement.

### S7 · Fresh-visitor pass

All praxis localStorage keys removed, service worker unregistered, caches deleted, reloaded
cold: ground `dark`, ink `#F0EBDF`, nav `#171B2B` sticky, flower 42px, signed-out surface
renders, no horizontal scroll. **Console: clean (zero errors)** — on the signed-out, the
signed-in, and the fresh-visitor passes.

The auth stub used for S4/S5 is localStorage-only and cannot mint a Firebase token, so
Firestore writes fail closed — no production data was written. All stub keys were removed
afterwards; `remaining: []`.

### VERDICT

**Live-smoke: ALL PASS.** Held for Preston's felt pass per `docs/studio/felt-script.md`
(the 1920 monitor, the phone, and the installed PWA window — the PWA is worth one launch
this ship, since `theme-color` and `background_color` both moved).
