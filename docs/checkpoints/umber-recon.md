# Umber LIVE re-skin — STAGE 0 RECON (read-only)

Status: **RECON COMPLETE — nothing changed. Awaiting go-ahead for the build prompt.**
Date: 2026-06-21 · Branch base examined: local `main` @ `9c87857` and `origin/main` @ `c59f4da`.

---

## (a) PRECONDITIONS — **1 FAIL (blocking), rest PASS**

| Check | Result | Evidence |
|---|---|---|
| On `main` | PASS | `git rev-parse --abbrev-ref HEAD` → `main` |
| Working tree clean (tracked) | PASS | `git status --porcelain` shows **only untracked** (`design/`, `docs/checkpoints/*`, PDFs). No tracked file is dirty. |
| **Local `main` is current** | **FAIL** | local HEAD `9c87857` is **0 ahead / 2 behind** `origin/main` `c59f4da`. |
| Yumi-intelligence II + III merged | PASS *on origin*, **not pulled locally** | Stage III = `5d4e81d` (v3.132→**v3.133**) + smoke addendum `c59f4da`, both on `origin/main`, **absent** from local HEAD (Stage II). |
| Nothing pending | PASS | No open lane work for this; the 2 behind-commits are the already-shipped Stage III. |
| Current SW cache version | **v3.133** on the build base | local `sw.js` = `praxis-v3.132`; `origin/main:sw.js` = `praxis-v3.133`. **Umber bumps v3.133 → v3.134.** |

**Action required before the build:** fast-forward local `main` to `origin/main` (`git pull` / `git merge --ff-only origin/main`). The build MUST start from `c59f4da`, not `9c87857` — Stage III touched `yumi-brain.js (+404)`, `state.js (+42)`, `views.js (+63)`, `integrations.js`, `yumi-ui.js (+58)`, `components.css (+60)`, `sw.js`. Recon below is computed against the build base where it differs from local HEAD (noted inline).

`git diff --stat HEAD..origin/main`: components.css `+60`, integrations.js, state.js, views.js `+63`, yumi-brain.js `+404`, yumi-ui.js `+58`, sw.js, + 2 stage-3 checkpoint .md. **theme.css and arc-constellation.js are NOT in the diff** — identical on both refs (safe to map from local).

---

## (b) PARSE HARNESS + real paths

**Files do NOT live at repo root** — they are under `assets/` and `js/`:

| Logical name | Real path | Lines | Parse-checkable? |
|---|---|---|---|
| theme.css | `assets/theme.css` | 431 | CSS — not parsed |
| components.css | `assets/components.css` | 8581 | CSS — not parsed |
| views.js | `js/views.js` | 12742 | **yes** → `parse-check-views.js` |
| arc-constellation.js | `js/arc-constellation.js` | 1849 | (invariant — not edited) |
| yumi-brain.js | `js/yumi-brain.js` | 2267 (origin) | (untouched) |
| state.js | `js/state.js` | 2659 (origin) | (untouched) |
| sw.js | `sw.js` (root) | 131 | promise-free → cscript ok |
| index.html | `index.html` (root) | 145 | — |

**Parse-check command (ES3 JScript via cscript, from repo root):**
```
cscript //nologo .claude\parse-check-views.js     # reads js\views.js, new Function(src) → PASS/FAIL
cscript //nologo .claude\parse-check.js           # reads js\yumi-brain.js (untouched this build)
```
Each harness `OpenTextFile`s the hard-coded path, `new Function(src)` to parse-only, echoes `PARSE: PASS (<n> chars)` or `FAIL — <msg> @ line`. **The Umber build only edits `views.js` among parse-checkable JS** (the `data-ground` setter in `renderRoute`), so `parse-check-views.js` is the one gate. theme.css / components.css / index.html / sw.js are CSS/HTML/promise-free — verified by diff-stat + live, per CLAUDE.md.

---

## (c) TOKEN MAPPING TABLE

Cross-checked live `assets/theme.css :root` ↔ mockup `:root` (`git show claude/praxis-umber-mockup:design/praxis-umber-mockup.html`, lines 40–145 + the inline `--gold-ink` at 566). **Rule honored:** re-point existing VALUES, ADD new tokens, never RENAME/DELETE.

### C.1 — RE-POINT (existing token, value → Umber). Mockup-confirmed unless flagged.
| Token | Live value | Umber value | Note |
|---|---|---|---|
| `--ink` | `#2a1810` | `#241710` | **dual-use hazard — see (d).** Text + scrim + border-tint. |
| `--ink-2` | `#5c3e26` | `#4d3b2a` | |
| `--ink-3` | `#7a5c34` | `var(--meta)` `#9a7e4e` | mockup maps ink-3→meta |
| `--ink-4` | `#9a7e4e` | `var(--meta)` `#9a7e4e` | mockup maps ink-4→meta (no change in value, but semantics) |
| `--gold` | `#a8741a` | `#d2a23e` | lighter — **AA risk on bright, see (d)** |
| `--gold-light` | `#c5912b` | ~`#e7c46a` (`--gold-soft`) | mockup has no `--gold-light`; KEEP token, re-point toward gold-soft |
| `--gold-text` | `#6b4516` | ~`#855410` (`--gold-ink`) | KEEP token, re-point toward the AA-safe gold-ink |
| `--br-deep` | `#4a2810` | `#1c1209` | **ground-sensitive (gutter shadows invert — see h)** |
| `--bg` | `#d8bd80` | dark ground (e.g. `var(--ground)` / `#2f1c0e`) on dark; page on bright | ground-sensitive |
| `--surface` | `#ecdcae` | `var(--surface-d)` `#3e2814` dark / `--page-2` bright | ground-sensitive |
| `--surface-2` | `#f2e6c2` | `var(--surface-d2)` `#4a3119` dark / `--page-2` bright | ground-sensitive |
| `--color-surface` | `var(--surface)` | follows --surface | ground-sensitive |
| `--ground-center` | `#e6cb8e` | dark grad stop | body::before literal twin |
| `--bg-2` | `#e3c98c` | dark | |
| `--sunk` | `#c9a85f` | `#6b4a23` | mockup `--sunk` |
| `--border` | `rgba(58,40,16,.2)` | `rgba(210,162,62,.18)` dark / `rgba(36,23,16,.16)` bright | ground-sensitive |
| `--line-2` | `rgba(58,40,16,.32)` | `rgba(210,162,62,.30)` (`--border-2`) dark / `--line-page-2` bright | ground-sensitive |
| `--wash` | `rgba(58,40,16,.1)` | `rgba(210,162,62,.08)` dark / `rgba(36,23,16,.05)` bright | ground-sensitive |
| `--glass` | `rgba(245,233,200,.5)` | brown glass (`var(--glass-pill)` `rgba(64,40,20,.74)`) | nav/search well — SOLID feel |
| `--glass-2` | `rgba(245,233,200,.82)` | brown glass tier-2 | secondary buttons |
| `--glass-spotlight` | `rgba(245,233,200,.94)` | `rgba(48,30,16,.94)` | spotlight panel → **opaque, de-blur (see h)** |
| `--grad` | `linear-gradient(92deg,#b8841f,#27566a)` | `linear-gradient(92deg,#d2a23e,#2e8a93)` | gold→teal |
| `--wordmark` | `#8a5e15` | `var(--gold-soft)` `#e7c46a` | mockup nav-wordmark uses gold-soft |
| `--river` | `#27566a` | `#3a5a8a` (Umber indigo = `--register-question`) | **DECISION:** river→indigo? feeds `--question-color` + `--register-memoir` |
| `--river-l` | `#3f7d92` | lighter indigo | follows river |
| `--marginalia-color` | `#1d8f68` | `var(--teal)` `#2e8a93` | the teal through-line |
| `--journal-color` | `#7E7BC0` | `#7d6db0` (`--register-journal`) | |
| `--question-color` | `var(--river)` | follows --river | |
| `--thread-color` | `#B89A62` | `#c2a463` (`--thread`) | resonance tan |
| `--thread-color-faint` | `#C9B68A` | lighter thread | |
| `--arc-question-glow` | `#854F0B` | `var(--gold)` `#d2a23e` | |
| `--danger` | `#9c3f1c` | `#c2603a` | |
| `--danger-line` | `rgba(150,50,24,.45)` | `rgba(194,96,58,.46)` | |
| `--text-on-dark` | `#fdfaf3` | `~var(--text-d)` `#f0e3c8` | warm cream stays |
| `--shadow-cover` | `0 24px 50px -20px #000` | `0 24px 50px -20px rgba(0,0,0,.6)` | **#000→rgba; see (h) A3.1 conflict** |
| `--tradition-ground` | `#FAEEDA` | dark-readable ground | **feeds the LOCKED renderer — re-point carefully** |
| `--tradition-inner-light` | `#FFF8E7` | KEEP (cream shine, in mockup) | |
| `--tradition-*-halo` (×9) | 9 wheat hexes | bumped halos on dark | feeds locked renderer |

### C.2 — KEEP unchanged (invariant)
`--font-serif/-body/-mono`; `--sp-1..6`; `--radius-sm/-md/-lg/-xl/-pill`; `--ease`; `--motion-base`; `--fs-*`; `--arc-web-*`; the **frozen 16 `--subtheory-1..16` + `-edge` + `[data-st-palette=muted/colorful]` variants** (32+ hexes — explicitly protected, marks stay); `--tradition-inner-light` `#FFF8E7`; `--on-teal` `#06241a` (text on teal, teal kept); `--field-presence`; `--register-theory..practice` (+ light/mid/deep, derived — auto-shift); `--dots`/`--margin-rule` (notebook leaf, re-derive when bases re-point — see d).

### C.3 — ADD (new Umber tokens the dual-ground needs)
`--ground` `#2f1c0e`; `--ground-grad` `radial-gradient(120% 90% at 26% 12%,#402812,#311d0e 42%,#281609 78%,#1f1107)`; `--surface-d` `#3e2814`; `--surface-d2` `#4a3119`; `--sunk-d` `#241406`; `--dark-2` `#2a1a0c`; `--page` `#f8f1e1`; `--page-2` `#fcf6e8`; `--meta` `#9a7e4e`; `--text-d` `#f0e3c8`; `--muted` `#c2a87f`; `--gold-soft` `#e7c46a`; `--teal` `#2e8a93`; `--thread` `#c2a463`; `--register-marginalia/-journal/-question`; `--grad-soft` `linear-gradient(92deg,#e7c46a,#3aa0a9)`; `--glass-bar` `linear-gradient(180deg,rgba(64,40,20,.86),rgba(48,28,14,.74))`; `--glass-pill` `rgba(64,40,20,.74)`; `--glass-border` `rgba(210,162,62,.22)`; `--border-2` `rgba(210,162,62,.30)`; `--line-page` `rgba(36,23,16,.16)`; `--line-page-2` `rgba(36,23,16,.30)`; `--wash-page` `rgba(36,23,16,.05)`; `--shadow-d` `0 3px 10px rgba(0,0,0,.34),0 14px 38px rgba(0,0,0,.32)`; `--shadow-page` `3px 5px 12px rgba(28,18,9,.10),8px 16px 32px rgba(28,18,9,.08)`; `--gold-ink` `#855410`.

### C.4 — Mockup ↔ spec mismatches flagged
- Spec prose says `--gold-ink (AA-safe on page)` — mockup defines it as `#855410` (inline `:root` at line 566). Confirmed; ADD.
- Spec lists `--surface-d2 #4a3119`, `--dark-2 #2a1a0c` — both present in mockup. ✓
- Mockup ADDS tokens the spec prose omits: `--sunk-d`, `--grad-soft`, `--glass-pill`, `--glass-border`, `--border-2`, `--line-page(-2)`, `--wash-page`, `--shadow-d`, `--shadow-page`, `--muted`, `--gold-soft`. All needed for dual-ground → included above.
- **Renderer-swap note:** the mockup’s comment "single documented swap `#966E28 → var(--thread)`" applies to the mockup’s *inlined copy* of the renderer. **Live `arc-constellation.js` stays byte-identical** — `#966e28` is NOT swapped there (see f/h).

---

## (d) DUAL-GROUND PLAN

### D.1 — Mechanism (least-invasive): **per-ground TOKEN-OVERRIDE block + ONE views.js line**
There is **no existing per-route CSS hook**: `renderRoute()` (views.js 324) computes a collapsed `activeRoute` that drives only `.app-nav-link-active`; render fns mount into `#app` (`APP_EL_ID='app'`). So pure-CSS-only is impossible — a minimal JS add is required.

Because live components reference the *old token names indiscriminately* (e.g. `var(--ink)` **554×**, `var(--surface)` 94×, `var(--border)` 119× — see D.3), **selector rewrites are infeasible**. The mechanism is to flip token VALUES by ground:

1. **`:root` = one base palette**, then a single override block re-points the ~15 ground-sensitive tokens for the other ground. Components keep `var(--ink)` etc. unchanged — values cascade.
2. **`body::before`** (theme.css 341–384, the page-light/grain pseudo, baked with literals `#e6cb8e/#d8bd80/#c4a35a`) is made ground-aware: `body[data-ground="dark"]::before{ dark grain + var(--ground-grad) }`. **Primary edit site.**
3. **One views.js edit:** in `renderRoute()`, after `parts = location.hash.split('/')`, `document.body.setAttribute('data-ground', GROUND_FOR(parts[0]))` where GROUND_FOR maps the raw hash head (NOT the collapsed `activeRoute`, because sub-surfaces split: `book/*`→bright but parent `books`→dark; `subtheory/*`→bright but parent `arcs`→dark).

**Base-palette DECISION (build-prompt gate):** the 7 surface-mappers assumed *base=dark, `body[data-ground="bright"]` override*. The mockup’s own `:root` comment says the opposite — *"Globals = bright-page defaults; the dark field re-scopes the inks to light."* **Recommendation: base = bright-page defaults, `body[data-ground="dark"]` override** — it matches the mockup globals, the legacy renderers, and the scrim assumptions (D.4), and makes `data-ground` absence fall back to readable bright. Either is one block; what matters is the block exists + the attribute is wired. **Flagging for your call.**

### D.2 — Ground assignment by route (keyed off `parts[0]`)
| Hash head | Surface | Ground |
|---|---|---|
| `home` | Home | **dark** |
| `books`, `` (empty→notebook) … | Shelf | **dark** |
| `book/*` | Book detail | **bright** |
| `artifact/*` | Artifact | **bright** (DECISION: book-family → bright) |
| `arcs` | Arcs page | **dark** |
| `arc/*` | Arc field (constellation) | **dark** |
| `arc/*/new-subtheory` | Sub-theory create | **bright** (DECISION) |
| `subtheory/*` | Sub-theory writing | **bright** |
| `account` | Account | **dark** |
| `about` | About | **bright** |
| `notebook` | Notebook spread | **bright** (but leaf is photoreal — D.5) |
| `yumi-sees` | What Yumi Sees | **DECISION** — Yumi surface (spec=dark) but panel embeds in notebook (bright) |
| (overlay) Spotlight, Yumi panel/Bloom, editor/picker/confirm modals | over-current; chrome SOLID | dark glass / scrim |

### D.3 — Ground-sensitive token blast-radius (drives the override block)
`var(--token)` counts (components.css / views.js):
`--ink` 540/14 · `--ink-3` 200/4 · `--border` 118/1 · `--gold` 100/15 · `--ink-2` 79/0 · `--ink-4` 59/8 · `--surface` 92/1 · `--surface-2` 51/1 · `--marginalia-color` 46/6 · `--danger` 43/0 · `--line-2` 41/4 · `--text-on-dark` 33/0 · `--gold-text` 28/1 · `--river` 26/1 · `--glass` 20/0 · `--glass-2` 18/0 · `--color-surface` 17/1 · `--gold-light` 16/1 · `--br-deep` 14/1 · `--wash` 14/0 · `--sunk` 7/0 · `--question-color` 5/1 · `--bg` 4/0 · `--wordmark` 4/0 · `--journal-color` 3/1 · `--thread-color` 3/0 · `--bg-2` 1/0 · `--glass-spotlight` 1/0.
**Override block (the ground-flip set):** `--ink, --ink-2, --ink-3, --ink-4, --surface, --surface-2, --color-surface, --bg, --bg-2, --border, --line-2, --wash, --glass, --glass-2, --glass-spotlight, --sunk, --br-deep, --text-on-dark`. Ground-INVARIANT (single value): `--gold(+-light/-text/-ink), --teal/--marginalia-color, --thread(-color), --river/--question-color, --journal-color, --grad, --danger(-line), --subtheory-*`.

### D.4 — **#1 BUILD RISK: `--ink` is overloaded (text + scrim + border-tint).**
`--ink` is used as foreground text (must flip light↔dark per ground) **and** as a non-text tint via `color-mix(in srgb, var(--ink) NN%, transparent)`:
- `.spotlight-backdrop-open` scrim `color-mix(--ink 40%)` (components.css ~729)
- `.st-picker-backdrop` scrim `color-mix(--ink 38%)` (7170)
- `.st-confirm-backdrop` scrim `color-mix(--ink 38%)` (7395)
These scrims assume **--ink is dark** to render a darkening overlay. If the override block flips `--ink` to light on the dark ground, these scrims compute *light* = broken. **Build-prep audit:** enumerate every `color-mix(... var(--ink)` site and re-key the scrims to a dedicated fixed `--scrim` token (or `--br-deep`) rather than `--ink`. This is orthogonal to the base-palette choice and must be handled either way.

### D.5 — Per-surface render-fn ↔ selector ↔ ground map (from the 7-agent sweep)
| Surface | Ground | Render fn (views.js) | components.css cluster | Key dual-ground edit sites |
|---|---|---|---|---|
| Top nav | brown glass (SOLID) | `renderRoute` 324 | 345–559 | already token-driven + SOLID (canon §4-A comment @361 — nav de-blur shipped). Re-point token values only. |
| Spotlight | dark scrim | spotlight.js | 722–866 | **de-blur** `.spotlight-panel` 756–757 → opaque `--glass-spotlight` |
| Mobile nav/menu | dark SOLID | `renderRoute`/`initNavMobileToggle` | 3553–3582 + 5082–5216 | `backdrop-filter:none` already correct (5101); token re-point |
| Editor/picker/confirm modals | dark over-current | open*Editor / JS | 3136–3523, 7170–7391, 7394–7528 | scrims (D.4); modal fills stay dark |
| Home | dark | `renderHome` 576 | 575–721, empty 2207–2247 | `.home-preview` radial (literals #f5ead0/#cba85f), `--grad` clip, hardcoded box-shadow (h) |
| Shelf | dark | `renderShelf` 2458 (+3278/3376) | 867–1158, 1638–2203 | **`.shelf::before` wheat-field @1720**, cover-area shadow literal @2059 (h) |
| Arcs page | dark | `renderArcsPage` 2190 | 1232–1554 | `.arc-card` etc. token re-point |
| Arc field / constellation | dark | `renderArcDetail` 9057 | 5496–6549 | **`.arc-detail-web-view::before` wheat-field @~5679**; chrome restyle-only (renderer locked, f) |
| Book detail / artifact | bright | `renderBookDetail` 5628 / `renderArtifact` 8182 | 2251–2696 | `--shadow-cover`; **gold-on-bright** (quote 2424, cite 6131/6185, write-link 2447) → `--gold-ink`; artifact-card shadow literal @2415 (h) |
| Sub-theory writing | bright | `renderSubTheoryPage` 7132 / `…ReadOnly` 6950 | 5981–6547 | `--river` teal links 6313/6334; `--wash` tab 6056 |
| Notebook spread | bright (**leaf = high-risk D.6**) | `renderNotebook` 692 (+10137) | 1159–1228, 2755–2904, 3699–5067 | leaf `--dots`/`--margin-rule`/`--surface-2`; **gutter `color-mix(--br-deep)` inverts** 4045/4057 (h) |
| What Yumi Sees | **DECISION** | `renderWhatYumiSeesPage` 10794 | 2908–3133 | `--panel-yumi` recompute; teal spine; ground unclear |
| Account | dark | `renderAccountPage` 11953 | 6550–7164 | **`.account-card` blur(8px)** 6990 (h); `--surface-2` cards |
| Yumi panel / Bloom | dark | `renderYumiPanel` (yumi-ui 780) | 9–342 | SOLID (no blur); `--shadow-yumi`, `--panel-yumi` |
| About | bright | `renderAbout` 12401 | 8299–8510 | scoped `.about-page`; `--surface-2` card 8390 flips |

### D.6 — Notebook bound-leaf = a real sub-decision
The leaf is a photoreal wheat-paper metaphor: `.notebook-leaf` fill `--surface-2` + `--dots` (22px graphite stipple via `--ink-4 26%`) + `--margin-rule` (brick via `--danger 30%`) + gutter shadows `color-mix(--br-deep 30%)` (4045/4057). Going "bright Umber page," the leaf maps to `--page`/`--page-2` and the dots/rule/gutter tokens must be re-parameterized so they remain visible (the gutter shadow **inverts** if `--br-deep` flips). Not a blocker, but the leaf needs its own deliberate token pass — flagged so it isn’t mechanically swept.

---

## (e) STALE-HEX SET — the must-be-0 grep target

**Scope of the grep:** `assets/theme.css`, `assets/components.css`, `index.html`, and the non-renderer JS (`views.js`, `yumi-ui.js`, `spotlight.js`, `app.js`, `integrations.js`, `state.js`, `yumi-brain.js` — all currently hex-clean except spotlight `#fff8e7` cream).
**EXCLUDED from must-be-0 (protected):** `js/arc-constellation.js` (invariant renderer: `#966e28 #633806 #412402 #2a2018 #7a5c34 #fff8e7`), `js/tradition-forms-arc.js` (~50 mark hexes — invariant CANDIDATE, see f), the frozen `--subtheory-*`/`-edge` + muted-palette (32+), `#fff8e7` cream shine, dead-comment refs `#1d9e75`/`#ffffff` in theme.css, and the new Umber target hexes.

**Must-be-0 literals (old values being re-pointed / re-tokenized):**
- Surfaces/ground: `#d8bd80 #ecdcae #f2e6c2 #e6cb8e #e3c98c #c9a85f #c4a35a #FAEEDA`
- Inks: `#2a1810 #5c3e26 #7a5c34 #9a7e4e`
- Gold/accent: `#a8741a #c5912b #6b4516 #8a5e15 #854F0B #b8841f`
- River/teal/journal: `#27566a #3f7d92 #1d8f68 #7E7BC0`
- Thread/halos: `#B89A62 #C9B68A #F0A88A #F8E078 #F8C8AA #E8B068 #C5D080 #F5BACE #8590D8 #98D4B0 #B8896C`
- Dark/misc: `#4a2810 #fdfaf3 #9c3f1c`
- **components.css hardcoded drift** (re-tokenize): `#f5ead0 #cba85f #cfb06a #ecdcae`
- **index.html**: `#faf6ec` (`<meta name="theme-color">` line 6 → Umber dark)

**Prompt-list status:** `#d8bd80 #ecdcae #f2e6c2 #a8741a #1d8f68 #7E7BC0 #27566a #faf6ec` all confirmed live. **`#d4972a` is NOT in any core file** — it lives only in `assets/wheat-field.svg` (10+ fills). Include in must-be-0 **only if** wheat-field.svg is retired/re-skinned (see h); otherwise it’s an asset-level decision, excluded.

---

## (f) INVARIANTS

| File | md5 (origin/main blob = build base) | Build touches? | Proof method |
|---|---|---|---|
| `js/arc-constellation.js` | `4d476499f91a321408c8947d917a23d7` (= working-tree LF) | **NO** — renderer byte-identical | `git diff --stat origin/main -- js/arc-constellation.js` empty |
| `js/yumi-brain.js` | `723152e952d69e83242f5b7673af8a99` | **NO** | git diff empty |
| `js/state.js` | `2e71973ebe8d701398a05f9400bfe389` | **NO** | git diff empty |
| `js/tradition-forms-arc.js` | `e80dbb9cf514b7d68c19cc4faee6efbe` | **DECISION (recommend NO)** | git diff empty if locked |

`arc-constellation.js`, `yumi-brain.js`, `state.js` confirmed Δ=0. **`tradition-forms-arc.js`** is a second mark/glyph renderer (~50 hardcoded hexes, loads before views) the prompt’s invariant list did not name — recommend treating it as an invariant alongside arc-constellation.js (the Umber marks read off the kept `--subtheory-*` palette + the renderer’s own frozen hues), unless the build explicitly re-skins tradition glyphs. **Decision gate.**

---

## (g) FEATURE-PRESENCE ANCHORS (end-of-build grep targets) — all confirmed

| Anchor | Location | Note |
|---|---|---|
| `generateLenses` | yumi-brain.js:917 (+ export :2230) | ✓ |
| `evalLensResponse` | yumi-brain.js:981 (+ export :2231) | ✓ |
| `LENS_GEN_SYSTEM` | yumi-brain.js:816 | ✓ |
| `gatherLensMetadata` | yumi-brain.js:2229 (export key for **`gatherLensLibraryMetadata`**) | grep BOTH names |
| `buildProposedLensCard` | yumi-ui.js:1039 (+:1231) | ✓ |
| gather/distill entry | **notebook gather**: `toggleGather`/`notebookGatheredIds`/`openGatherArcPicker` views.js 1199–1255 → `createSubTheory`; **web distiller** (origin only): `DISTILLER_SYSTEM`/`yumiWebGrounding` yumi-brain.js ~1192–1220 | both behaviors the re-skin must not disturb |
| arc-field render fn | `renderArcDetail` views.js:9057 | ✓ |
| Yumi chat | `sendMessage` yumi-brain.js:754 · `renderYumiPanel` yumi-ui.js:780 · `openYumiPanel` :797 | ✓ |
| `renderWhatYumiSeesPage` | views.js:10794 | ✓ |
| notebook privacy toggle | `notebook-entry-privacy-toggle` + master "Yumi reads along" switch, views.js ~710–722 ("Structurally private") | ✓ |

**NB:** the Stage III web-distiller anchors exist **only on `origin/main`** — the end-grep must run on the post-FF tree, else they false-negative.

---

## (h) PRE-EXISTING DRIFT — **separate task, do NOT fold into the build**

1. **Hardcoded literal hexes in components.css** (violate "CSS variables only"): `#f5ead0` + `#cba85f` (.home-preview radial @677), `#ecdcae`, `#cfb06a`. The re-skin re-tokenizes them incidentally, but they predate Umber.
2. **Non-tokenized rgba shadows** (Stage 5.1 left these un-migrated): `.home-preview` `rgba(58,40,16,.55)` @675; `.shelf-book-cover-area` `rgba(58,40,16,.5)` @2059; `.book-detail-artifact-card` `rgba(255,250,230,.5)`+`rgba(58,40,16,.5)` @2415; `.account-field-input` `rgba(58,40,16,.06)` @~2640/6640; `.transparency-panel` border `rgba(29,143,104,.35)` @2925.
3. **`--br-deep` gutter-shadow ground hazard** (notebook leaf 4045/4057) — predates re-skin; surfaces under dual-ground.
4. **`tradition-forms-arc.js`** ~50 hardcoded hexes — a renderer with an un-tokenized palette (drift relative to the CSS-vars rule), separate from this build’s scope.
5. **`#1d9e75` / `#ffffff` dead-comment refs** in theme.css (retired teal + off-palette note).
6. **`assets/wheat-field.svg`** (`#d4972a` ×10+) — bright-page asset referenced by `.shelf::before` (1720) and `.arc-detail-web-view::before` (~5685), both now-dark surfaces. The SVG becomes orphaned on dark unless retained for a bright surface — asset-disposition decision.
7. **A3.1 shadow doctrine vs Umber black shadows:** CLAUDE.md forbids `rgba(0,0,0,…)` (warm `--br-deep` family only). The Umber mockup deliberately uses `--shadow-d`/`--shadow-cover` with `rgba(0,0,0,…)` on the dark ground. This is a doctrine **supersession** for dark surfaces — flag for explicit sign-off (consistent with the canon’s pattern of superseding design-spec points).

---

## STOP — recon complete, nothing changed.
Open decision gates for the build prompt: **base-palette direction (D.1)**, the **`--ink`/scrim audit (D.4)**, wheat-field disposition (e/h.6), notebook-leaf token pass (D.6), What-Yumi-Sees ground (D.2), `tradition-forms-arc.js` lock (f), `--river`→indigo (C.1), and the A3.1/black-shadow supersession (h.7). And the **blocking precondition: fast-forward local `main` to `origin/main` first (a).**
