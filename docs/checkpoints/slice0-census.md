# R-POLISH SLICE 0 — STAGE 0 CENSUS (the exit numbers)

Docs-only. HEAD f0e1642 (1 ahead of origin/main 2c286b5 = the unpushed docs commit,
known/intended). Tree clean. Live sw.js = local = v3.230. Method: rg over `js/` (14 UI files,
views.js = 1.03 MB) + `assets/components.css` + `theme.css`. Counts are render-site / class
counts, locations cited. **Findings only — no fixes (per SYS-1).**

## THE EIGHT EXIT COUNTS

### 1 · Native `<select>` — **5** (all `js/views.js`, all `createElement('select')`)
The 3 literal `<select` hits are COMMENTS; real selects are DOM-built:
- `:6480` genreInput · `:9204` tradSelect · `:9235` catSelect · `:11751` bookSel · `:20216` targetSel.
CC-1 targets: custom listbox ≥760 / styled-native <760. **Exit target: 5 → 1 dialect.**

### 2 · Default/unstyled text inputs + textareas — **inputs 43 · textareas 10** (53 total)
- `<input>`: `createElement('input')` = **38** + HTML-string (classed) = **5** (profile ×3 `pf-field`,
  intros ×2 `ij-typein`). Of the 38 DOM inputs, a chunk are `type=file` (camera/scan/library/cover
  upload) and the nav search (`spotlight.js:306`, `views.js:4649`) — the true *text* inputs (title,
  author, gather-name, chat, genre-free, portrait) are the CC-2 carve targets. Most `createElement`
  inputs receive **no shared control class** → the "unstyled/default" fracture.
- `<textarea>`: `createElement('textarea')` = **8** (views.js 2863/3503/6708/9418/14843/16541/16874/20231)
  + HTML-string = **2** (intros `ij-noteta`, profile `statement`) = **10**.
- **EXIT NUMBER = 58** (5 select + 43 input + 10 textarea) — all owed the CC-2 carved grammar
  (Preston ruled 2026-07-18: total-owed is the honest target; a styled-default input still isn't the
  carved grammar, so no unstyled-subset audit). Batches convert their own controls; residual sweep closes 58 → 0.

### 3 · Yumi caption family — **7 distinct strings** across 8 route-keys + 1 inline dup (`js/yumi-ui.js:910-920,1015`)
`YUMI_BLOOM_LINES` map:
1. home — "see what I'm noticing"
2. books — "tap to find lenses in your library"
3. book / artifact — "tap to sit with this book together" (2 keys, 1 string)
4. arcs — "tap to trace threads between your arcs"
5. arc / subtheory — "tap to think this through with me" (2 keys, 1 string)
6. notebook — "I'm here when you want to talk it through"
7. DEFAULT — "tap to talk"  (+ hardcoded dup at `:1015` inside the bloom markup)
Adjacent (panel greeting, not the bloom line): "Sign in to think with Yumi." (`:186`).
AMB-1 / L5: **all captions retire** (RD-6's chip is the affordance). **Exit target: 7 → 0.**

### 4 · Candy-glyph render sites — **5 spatial grammars** (P-H confirmed) for the SAME object
- Arcs-index arc-card thumbnails: `_arcCardConstellation()` (`views.js:3822`; called `:4017` own arcs,
  `:4111` desire-seed card, `:4135` flow card) — constellation dot-lines.
- Commons/social cluster: `_socialMarkCluster()` (`views.js:19549`, called `:19571`) — candy circle.
- Home arc thumbnails (renderHome thumb renderer — **B1 leaves untouched; B2 converts**).
- Field candy circle (arc Field / `room-field.js`).
- Profile orbs (profile galaxy) · workshop paper notes (writing-canvas).
GR-1 collapses ALL to the one living-miniature. **Exit target: 5 grammars → 1.**

### 5 · Segmented-control / chip style variants — **segmented 6 · chip ~30**
- Segmented families (distinct roots, components.css): **`.seg` · `.shelf-seg` · `.arcs-seg` ·
  `.portrait-seg` · `.pf-seg` · `.px-seg`** = **6** (brief estimated 4; recount = **6**).
- Chip families: **~30 distinct roots / 50 raw selectors** (`.chip`, `.ground-chip`, `.portrait-chip`,
  `.pf-vchip`, `.ij-vchip`, `.st-mark-chip`, `.search-chip*`, `.notebook-writeline-chip*`, `.bk-arcchip`,
  `.arc-chip`, `.nb-chip-cover*`, `.subtheory-delete-chip`, `.stb-return-chip`, `.yumi-cmd-chip` …).
CC-1/CC-3: ONE segmented style, chip role law. **Exit target: 6 seg → 1; chip families → the role kit.**

### 6 · Floating-ⓘ instances — **1** (`.intro-summon`)
`components.css:14071` (fixed 36px circle, left/bottom 18px, z-9990, **italic-serif "i"** in `--lum-gold`,
`display:none` default) · created `js/intros.js:613`. The literal ⓘ glyph = 0 occurrences (it's a styled
letter-i, not the unicode char — why a naïve ⓘ grep reads 0). AMB-1 **retires it**. **Exit target: 1 → 0.**

### 7 · Icon-dialect instances in chrome — **≥8 glyph dialects** (named offenders = 4)
| glyph | js | css | role |
|---|---|---|---|
| ✎ pencil | 6 | 1 | edit affordance |
| ↗ up-right | 2 | 0 | external/expand |
| ⌘ (⌘K badge) | 7 | 1 | shortcut |
| ⚠ warning | 0 | 2 | alert |
| × close | 14 | 9 | dismiss |
| ✓ check | 5 | 3 | confirm/selected |
| ⋯ ellipsis | 3 | 3 | more |
| ＋ plus | 5 | 0 | add |
(→ arrows: 44 js / 29 css — mixed prose + UI.) Brief's named 4 = **⚠ ✎ ↗ ⌘K**; total mixed dialects
in chrome = **~8**. SYS-1 ICON LAW: one stroke family. **Exit target: ~8 dialects → 1.**

### 8 · Mono-caps whisper headers — **16 distinct classes / ~23+ render sites**
Distinct classes (components.css): `.eyebrow` · `.sk` · `.whisper` + 13 per-surface variants
(`.about-spine-eyebrow`, `.account-panel-eyebrow`, `.account-values-eyebrow`, `.book-review-eyebrow`,
`.ic-eyebrow`, `.nb-newborn-eyebrow`, `.note-eyebrow`, `.pf-eyebrow`, `.pf-peyebrow`,
`.portrait-cap-eyebrow`, `.st-picker-eyebrow`, `.st-tb-kicker`, `.stb-kicker`).
Render sites: `class="eyebrow"` = **17** · `class="sk"` = **6** + per-surface variants = **~23+**.
TY-1: the single 10-11px mono-caps whisper → the 5-role ramp. **Exit target: 16 whisper classes → the ramp.**

## THE AUTOMATED CONTRAST GATE (WCAG AA, ≥4.5:1 normal text)
Computed via WCAG relative-luminance over resolved token hexes (harness: `scratchpad/contrast.js`,
cscript/ES3). **11 of 24 text-on-ground pairs fail ≥4.5:1 — every failure is on a LIGHT ground;
the dark study passes cleanly.**

### Real text-on-ground failures (the fix targets)
| pair | ratio | note |
|---|---|---|
| `--ink-3`/`--meta` #9a7e4e / `--page` #f8f1e1 (GLOBAL) | **3.41** | the mono-caps meta labels — brief's flagged offender |
| `--ink-3`/`--meta` #9a7e4e / `--surface` #fcf6e8 | **3.56** | same, on cards |
| `--ink-3` #978b6d / `--surface` #fffdf8 (SCOPED light skin) | **3.32** | v1.1 tertiary ink, R3-R7 surfaces |
| `--ink-3` #978b6d / `--paper` #f4efe4 | **2.94** | " |
| `--gold` #a8761a / `--surface` #fffdf8 (SCOPED) | **3.92** | v1.1 light gold as small text (passes as ≥18px large) |
| `--gold` #a8761a / `--paper` #f4efe4 | **3.47** | " |
| `--teal` #2e8a93 / `--page` #f8f1e1 | **3.61** | marginalia teal on light (Book Detail is now light) |

### Decorative / gilding-exempt fails (flag, not text-fix — the law already forbids them as text)
| pair | ratio | why exempt |
|---|---|---|
| `--gold-soft` #e7c46a / `--page` | **1.49** | wordmark/gild; 9.67 PASS on its real (dark) ground |
| `--muted` #c2a87f / `--page` | **2.03** | dark-ground ink token; a light-ground use = a bug to find |
| `--thread` #c2a463 / `--page` | **2.12** | constellation line, never text |
| `--gold-hi` #d9a441 / `--surface` #fffdf8 | **2.21** | gilding = edge+glow ONLY, never text (§8) |

### Passing (for the record)
Light: `--ink` 15.49 · `--ink-2` 9.45 · `--gold`/`--gold-deep` #855410 5.7-5.95 · `--river` 6.2.
Dark ground (ALL pass): text-d 12.78 · muted 7.11/6.06 · gold #d2a23e 6.94/5.91 · gold-soft 9.67 · text-on-dark 15.58.

## DRIFT FLAGGED (finding, not a fix)
**The v1.1 token-sheet values are NOT in live `theme.css :root`.** Live global carries the PRE-v1.1 set:
`--ink-2 #4d3b2a` (sheet: #645940), `--ink-3/--meta #9a7e4e` (sheet: #978b6d), `--gold #855410` (sheet:
#a8761a), `--surface #fcf6e8` (sheet: #fffdf8), `--page #f8f1e1` (sheet: #f4efe4). The v1.1 values live
ONLY in per-surface scoped blocks (`.shelf.lum-amber-deep`, `.pf-root`, etc.). So a given label's contrast
depends on WHICH surface renders it — the gate table above computes BOTH the global and the scoped-light
baselines, and both fail on light. This decides the fix mechanism (global adopt vs per-surface), which is
why it is surfaced here.

## RESIDUALS FOR STAGE 1 RECON (not decided here)
- Field pastels hardcoded vs mispointed (Stage-1 item; decides GR-1's mechanism).
- Whether the light-ground contrast fix adopts v1.1 globally or keeps per-surface scoping (drift above).
- (Form-control unstyled-subset split — RULED out; exit number is the total 58.)

**HARD STOP — awaiting GO for Stage 1. One question in chat.**
