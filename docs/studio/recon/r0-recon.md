# Praxis — Studio R0 Recon: Token Inventory + Surface Census (read-only)

**Date:** 2026-07-08 · **HEAD:** `4cf3ae6` · **Branch:** main
**STATUS: PASSED** (Stages 1, 2, 3 all cleared their self-verify gates)
**Scope:** read-only inventory. No file was modified, staged, or committed except the creation of this report. No reconciliation, recommendation, or "winner" pick is made here — that fusion happens with Preston in the design chat. Drift, dead tokens, and doc/live contradictions are **recorded, not repaired**.

---

## Stage 0 — Pre-flight drift re-check (anchors held)

Re-derived at the top of this run before any inventory work:

| Anchor | Stage-0 value | This run | Verdict |
|---|---|---|---|
| HEAD | `4cf3ae6` | `4cf3ae6` | ✓ |
| `docs/studio/recon/` | absent | absent (created only to hold this file) | ✓ |
| `theme.css` def-lines | 227 | 227 | ✓ |
| `lumen-amber.css` def-lines | 35 | 35 | ✓ |
| `components.css` def-lines | 55 | 55 | ✓ |
| Canon file `design/praxis-design-canon.html` | (new) | PRESENT, 47,086 B | ✓ |
| Canon file `design/praxis-profile-galaxy-mockup.html` | (new) | PRESENT, 53,157 B | ✓ |

No drift → Stages 1–3 ran unattended.

### Per-stage gate evidence (summary — details in each section)

- **Stage 1 gate — PASS.** Def-line counts re-derived by **three** independent methods (grep pattern 1 `--[a-zA-Z][a-zA-Z0-9-]*[[:space:]]*:`, grep pattern 2 `--[[:alpha:]][-[:alnum:]]*:`, and an awk line-matcher) — all three return **227 / 35 / 55** for theme / lumen-amber / components, matching Stage 0. Both canon files parsed (comment-stripped, string-aware brace-scope parser; parse method in §1.0). Collision map = **12 rows**, every row has both a live and a canon cell filled.
- **Stage 2 gate — PASS.** Census cross-checked two ways: **19 router route-patterns** (of which 1 is a transient mint-and-redirect → **18 rendered surfaces**) vs **18 router-dispatched render functions** in `views.js`. 18 == 18. The one discrepancy (19th pattern) is explained line-by-line in §2.
- **Stage 3 gate — PASS.** Every factual claim in the context pack traces to a table or file:line in Stages 1–2; all section headers present; parses as valid markdown.

---

## Stage 1 — Token Inventory (both sides)

### 1.0 Method (parse provenance)

- **Def-LINE counts** (the Stage-0 gate metric): `grep -c` of a custom-property pattern over the raw file. A *line* may carry more than one declaration, so this is a line count, not a declaration count.
- **Declaration-level parse** (used for the token tables below): each CSS file was comment-stripped with a line-count-preserving Perl pass (`s{/\*…\*/}{…newlines…}ges`), then run through a hand-written awk brace/`;`/string-aware scanner that emits `file | line | selector-scope | name | value` per real declaration. Validation: the declaration parser and the three line-counters agree on which files carry defs, and the parser's name set reconciles with the raw grep set to within the 2 comment-only mentions noted in §1.2.
- **Canon files** parsed with the same custom-property grep for tokens, plus raw-hex / `font-family` / `font-size` greps for the non-tokenized style facts (§1.3). Both are single-page HTML with one `<style>` block each; all custom properties live in one compressed `:root{…}` rule per file (hence 4 def-*lines* but 13 distinct props — multiple declarations per line).

### 1.1 Per-file stats

| Source | Side | Bytes | Def-lines (grep) | Real declarations (parsed) | Distinct names |
|---|---|---:|---:|---:|---:|
| `assets/theme.css` | live | 23,158 | **227** | 259 | 177¹ |
| `assets/lumen-amber.css` | live | 14,681 | **35** | 50 | 28¹ |
| `assets/components.css` | live | 544,410 | **55** | 69 | 3¹ |
| **live subtotal** | | | **317** | **378** | **208** (distinct across all three) |
| `design/praxis-design-canon.html` | canon | 47,086 | 4 | 13 | 13 |
| `design/praxis-profile-galaxy-mockup.html` | canon | 53,157 | 4 | 13 | 13 (identical set) |
| **canon subtotal** | | | | | **13** (same 13 in both files) |

¹ "Distinct names" here = names **first-defined** in that file (grouping key for §1.2). A name first-defined in theme.css but redefined in components.css counts under theme. Sum 177 + 28 + 3 = **208** distinct live tokens. Live def-lines **317** reproduced by 3 independent methods (Stage-1 gate).

**Two headline totals, both correct at different granularity:** **317 def-lines** (grep, the Stage-0 gate) vs **378 real declarations** (parsed) — the gap is compressed multi-declaration lines (e.g. [`components.css:1857`](../../../assets/components.css) sets `--ink`/`--ink-2`/`--ink-3`/`--ink-4` on one line inside `.arcs.lum-amber`). **208 distinct** names underlie those 378 declarations (140 defined once, 68 redefined 2–8×; redefinition histogram: 140×1, 17×2, 37×3, 1×5, 7×6, 2×7, 4×8).

### 1.2 Live token table (208 distinct, grouped by first-defining file)

Two names appearing in a raw grep are **excluded** as real tokens: `--cd` and `--mk-glow`. They occur only inside documentation comments in `lumen-amber.css` ([138](../../../assets/lumen-amber.css), [167](../../../assets/lumen-amber.css), [169](../../../assets/lumen-amber.css)) illustrating the mark renderer's output; they are **element-scoped inline props set at runtime by [`marks.js:96`](../../../assets/marks.js)** (`style="--cd:…;--mk-glow:…"`), never palette tokens. Raw-grep distinct = 210; real defined tokens = **208**.

_First-defining file determines grouping. `Defs`=number of definition sites (a token redefined under `[data-ground=dark]`, a `.lum-amber` scope, or a media query counts each site). For redefined tokens **every** definition site is shown inline as `file:line[selector] = value` — the deepest redefinition in this tree is 8 sites, so no site is elided. Long gradient/multi-stop values are truncated to ~75 chars with `…`; the `file:line` recovers the full value._

#### Namespace A — Lumen luminous set (`--lum-*`, first-defined in lumen-amber.css)

| Token | Defs | Scope(s) & value(s) |
|---|---|---|
| `--h` | 6 | lumen-amber:154[.lg] = #ffce4a<br>lumen-amber:155[.lam] = #ffab4a<br>lumen-amber:156[.lcr] = #ffe6a0<br>lumen-amber:157[.lco] = #ff9a6e<br>lumen-amber:158[.lc] = #6fd0ec<br>lumen-amber:159[.le] = #46d08e |
| `--hd` | 6 | lumen-amber:154[.lg] = #bd8a1e<br>lumen-amber:155[.lam] = #c47a1e<br>lumen-amber:156[.lcr] = #c0a24a<br>lumen-amber:157[.lco] = #c45a36<br>lumen-amber:158[.lc] = #2f8fb4<br>lumen-amber:159[.le] = #1d8a5a |
| `--hg` | 6 | lumen-amber:154[.lg] = rgba(255,206,74,.62)<br>lumen-amber:155[.lam] = rgba(255,171,74,.55)<br>lumen-amber:156[.lcr] = rgba(255,230,160,.50)<br>lumen-amber:157[.lco] = rgba(255,154,110,.55)<br>lumen-amber:158[.lc] = rgba(111,208,236,.58)<br>lumen-amber:159[.le] = rgba(70,208,142,.52) |
| `--hl` | 6 | lumen-amber:154[.lg] = #ffeeb0<br>lumen-amber:155[.lam] = #ffd9a0<br>lumen-amber:156[.lcr] = #fff6d8<br>lumen-amber:157[.lco] = #ffd2bc<br>lumen-amber:158[.lc] = #c4f1ff<br>lumen-amber:159[.le] = #b6f4d6 |
| `--lum-base` | 1 | lumen-amber:28[:root] = #231708 |
| `--lum-bg` | 3 | lumen-amber:79[.lum-amber] = radial-gradient(70% 55% at 14% 2%, rgba(255,202,92,.50) 0%, rgba(255,202,92…<br>lumen-amber:87[.lum-amber-deep] = radial-gradient(72% 56% at 16% 4%, rgba(255,190,80,.42) 0%, rgba(255,190,80…<br>lumen-amber:95[.lum-amber-ember] = radial-gradient(70% 55% at 14% 4%, rgba(255,200,90,.40) 0%, rgba(255,200,90… |
| `--lum-cloth` | 1 | lumen-amber:49[:root] = #5a4632 |
| `--lum-coral` | 1 | lumen-amber:47[:root] = #ff9a6e |
| `--lum-cyan` | 1 | lumen-amber:46[:root] = #7fd0f0 |
| `--lum-glass-bd-2` | 1 | lumen-amber:38[:root] = rgba(255,236,200,.16) |
| `--lum-glass-bd` | 1 | lumen-amber:37[:root] = rgba(255,236,200,.28) |
| `--lum-glass-blur` | 1 | lumen-amber:39[:root] = 16px |
| `--lum-glass-raised` | 1 | lumen-amber:36[:root] = linear-gradient(157deg, rgba(255,255,255,.20) 0%, rgba(255,255,255,.06) 100%) |
| `--lum-glass` | 1 | lumen-amber:35[:root] = linear-gradient(157deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,.04) 100%) |
| `--lum-gold-d` | 1 | lumen-amber:44[:root] = #cf9c2a |
| `--lum-gold-ink` | 1 | lumen-amber:45[:root] = #241a02 |
| `--lum-gold-l` | 1 | lumen-amber:43[:root] = #ffe79a |
| `--lum-gold` | 1 | lumen-amber:42[:root] = #ffce4a |
| `--lum-ink-2` | 1 | lumen-amber:30[:root] = #e8dcc4 |
| `--lum-ink-3` | 1 | lumen-amber:31[:root] = #b6a888 |
| `--lum-ink-4` | 1 | lumen-amber:32[:root] = #867a5e |
| `--lum-ink` | 1 | lumen-amber:29[:root] = #fdf8ec |
| `--lum-mono` | 1 | lumen-amber:54[:root] = "DM Mono", ui-monospace, monospace |
| `--lum-r-card` | 1 | lumen-amber:57[:root] = 16px |
| `--lum-r-pill` | 1 | lumen-amber:58[:root] = 999px |
| `--lum-rose` | 1 | lumen-amber:48[:root] = #ff8e8e |
| `--lum-sans` | 1 | lumen-amber:53[:root] = "DM Sans", system-ui, sans-serif |
| `--lum-serif` | 1 | lumen-amber:52[:root] = "Cormorant Garamond", Georgia, serif |

#### Namespace B — Amber system (primitives + semantic tokens, first-defined in theme.css)

| Token | Defs | Scope(s) & value(s) |
|---|---|---|
| `--arc-question-glow` | 1 | theme:175[:root] = var(--gold) |
| `--arc-web-node-cover-height` | 1 | theme:92[:root] = 100px |
| `--arc-web-node-gap` | 1 | theme:93[:root] = var(--sp-5) |
| `--arc-web-spine-width` | 1 | theme:91[:root] = 2px |
| `--bg-2` | 2 | theme:291[:root] = var(--page-2)<br>theme:349[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--surface-d2) |
| `--bg` | 2 | theme:65[:root] = var(--page)<br>theme:348[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--ground) |
| `--border-2` | 2 | theme:49[:root] = rgba(210,162,62,.30)<br>components:10510[.ic-overlay.lum-amber-deep] = var(--lum-glass-bd-2) |
| `--border` | 7 | theme:67[:root] = var(--line-page)<br>theme:350[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = rgba(210,162,62,.18)<br>components:1861[.arcs.lum-amber] = var(--lum-glass-bd-2)<br>components:3493[.yumi-sees-page .transparency-panel] = var(--line-page)<br>components:9543[.about .orientation] = var(--line-page)<br>components:10509[.ic-overlay.lum-amber-deep] = var(--lum-glass-bd)<br>components:11683[.account.lum-amber-ember] = var(--lum-glass-bd-2) |
| `--br-deep` | 1 | theme:68[:root] = #1c1209 |
| `--color-surface` | 2 | theme:73[:root] = var(--page)<br>theme:347[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--dark-2) |
| `--danger-line` | 1 | theme:318[:root] = rgba(194,96,58,.46) |
| `--danger` | 2 | theme:317[:root] = #c2603a<br>components:11684[.account.lum-amber-ember] = var(--lum-coral) |
| `--dark-2` | 1 | theme:29[:root] = #2a1a0c |
| `--dots` | 1 | theme:323[:root] = radial-gradient(circle, color-mix(in srgb, var(--ink-4) 26%, transparent) 1… |
| `--ease` | 1 | theme:278[:root] = cubic-bezier(0.22, 1, 0.36, 1) |
| `--field-presence` | 1 | theme:287[:root] = 0.22 |
| `--font-body` | 1 | theme:10[:root] = 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif |
| `--font-mono` | 1 | theme:11[:root] = 'DM Mono', 'SF Mono', Menlo, Consolas, monospace |
| `--font-serif` | 1 | theme:9[:root] = 'Cormorant Garamond', Georgia, 'Times New Roman', serif |
| `--fs-body` | 1 | theme:87[:root] = 0.9375rem |
| `--fs-display` | 1 | theme:88[:root] = 1.5rem |
| `--fs-sm` | 1 | theme:86[:root] = 0.8125rem |
| `--glass-2` | 2 | theme:294[:root] = rgba(252,246,232,.82)<br>theme:354[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = rgba(64,40,20,.86) |
| `--glass-bar` | 1 | theme:46[:root] = linear-gradient(180deg, rgba(64,40,20,.86), rgba(48,28,14,.74)) |
| `--glass-border` | 1 | theme:48[:root] = rgba(210,162,62,.22) |
| `--glass-pill` | 1 | theme:47[:root] = rgba(64,40,20,.74) |
| `--glass-spotlight` | 1 | theme:295[:root] = rgba(48,30,16,.94) |
| `--glass` | 2 | theme:293[:root] = rgba(248,241,225,.5)<br>theme:353[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--glass-pill) |
| `--gold-ink` | 1 | theme:40[:root] = #855410 |
| `--gold-light` | 5 | theme:70[:root] = var(--gold-ink)<br>theme:359[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--gold-soft)<br>components:1858[.arcs.lum-amber] = var(--lum-gold-l)<br>components:9546[.about .orientation] = var(--gold-ink)<br>components:11682[.account.lum-amber-ember] = var(--lum-gold-l) |
| `--gold-soft` | 2 | theme:39[:root] = #e7c46a<br>components:10507[.ic-overlay.lum-amber-deep] = color-mix(in srgb, var(--lum-gold) 55%, transparent) |
| `--gold-text` | 3 | theme:71[:root] = var(--gold-ink)<br>theme:360[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--gold-soft)<br>components:9547[.about .orientation] = var(--gold-ink) |
| `--gold` | 6 | theme:64[:root] = var(--gold-ink)<br>theme:358[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = #d2a23e<br>components:1858[.arcs.lum-amber] = var(--lum-gold)<br>components:9545[.about .orientation] = var(--gold-ink)<br>components:10506[.ic-overlay.lum-amber-deep] = var(--lum-gold)<br>components:11682[.account.lum-amber-ember] = var(--lum-gold) |
| `--grad-soft` | 1 | theme:44[:root] = linear-gradient(92deg, #e7c46a, #3aa0a9) |
| `--grad` | 3 | theme:298[:root] = linear-gradient(92deg,#d2a23e,#2e8a93)<br>components:10512[.ic-overlay.lum-amber-deep] = linear-gradient(180deg, var(--lum-gold-l), var(--lum-gold))<br>components:11690[.account.lum-amber-ember] = linear-gradient(150deg, var(--lum-gold-l), var(--lum-coral)) |
| `--ground-base` | 1 | theme:305[:root] = var(--bg-2) |
| `--ground-center` | 1 | theme:290[:root] = var(--page) |
| `--ground-edge` | 1 | theme:306[:root] = var(--bg-2) |
| `--ground-grad` | 1 | theme:25[:root] = radial-gradient(120% 90% at 26% 12%, #402812 0%, #311d0e 42%, #281609 78%, … |
| `--ground` | 1 | theme:24[:root] = #2f1c0e |
| `--highlight-edge` | 1 | theme:267[:root] = color-mix(in srgb, var(--text-on-dark) 55%, transparent) |
| `--ink-2` | 8 | theme:61[:root] = #4d3b2a<br>theme:342[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--muted)<br>components:1857[.arcs.lum-amber] = var(--lum-ink-2)<br>components:3489[.yumi-sees-page .transparency-panel] = var(--br-deep)<br>components:9538[.about .orientation] = var(--br-deep)<br>components:10126[.account-hero .account-slot] = var(--text-d)<br>components:10503[.ic-overlay.lum-amber-deep] = var(--lum-ink-2)<br>components:11679[.account.lum-amber-ember] = var(--lum-ink-2) |
| `--ink-3` | 8 | theme:62[:root] = var(--meta)<br>theme:343[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--muted)<br>components:1857[.arcs.lum-amber] = var(--lum-ink-3)<br>components:3490[.yumi-sees-page .transparency-panel] = var(--meta)<br>components:9539[.about .orientation] = var(--meta)<br>components:10126[.account-hero .account-slot] = var(--muted)<br>components:10504[.ic-overlay.lum-amber-deep] = var(--lum-ink-3)<br>components:11680[.account.lum-amber-ember] = var(--lum-ink-3) |
| `--ink-4` | 8 | theme:63[:root] = var(--meta)<br>theme:344[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--muted)<br>components:1857[.arcs.lum-amber] = var(--lum-ink-4)<br>components:3491[.yumi-sees-page .transparency-panel] = var(--meta)<br>components:9540[.about .orientation] = var(--meta)<br>components:10126[.account-hero .account-slot] = var(--muted)<br>components:10505[.ic-overlay.lum-amber-deep] = var(--lum-ink-4)<br>components:11680[.account.lum-amber-ember] = var(--lum-ink-4) |
| `--ink` | 8 | theme:60[:root] = #241710<br>theme:341[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--text-d)<br>components:1857[.arcs.lum-amber] = var(--lum-ink)<br>components:3488[.yumi-sees-page .transparency-panel] = var(--br-deep)<br>components:9537[.about .orientation] = var(--br-deep)<br>components:10126[.account-hero .account-slot] = var(--text-d)<br>components:10502[.ic-overlay.lum-amber-deep] = var(--lum-ink)<br>components:11679[.account.lum-amber-ember] = var(--lum-ink) |
| `--journal-color` | 1 | theme:173[:root] = #7d6db0 |
| `--line-2` | 6 | theme:296[:root] = var(--line-page-2)<br>theme:351[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--border-2)<br>components:1861[.arcs.lum-amber] = var(--lum-glass-bd)<br>components:3494[.yumi-sees-page .transparency-panel] = var(--line-page-2)<br>components:9544[.about .orientation] = var(--line-page-2)<br>components:10511[.ic-overlay.lum-amber-deep] = var(--lum-glass-bd) |
| `--line-page-2` | 1 | theme:51[:root] = rgba(36,23,16,.30) |
| `--line-page` | 1 | theme:50[:root] = rgba(36,23,16,.16) |
| `--margin-rule` | 1 | theme:325[:root] = color-mix(in srgb, var(--danger) 30%, transparent) |
| `--marginalia-color` | 2 | theme:172[:root] = var(--teal)<br>components:10515[.ic-overlay.lum-amber-deep] = var(--lum-ink-3) |
| `--meta` | 1 | theme:33[:root] = #9a7e4e |
| `--motion-base` | 1 | theme:279[:root] = 350ms |
| `--muted` | 2 | theme:35[:root] = #c2a87f<br>components:11681[.account.lum-amber-ember] = var(--lum-ink-3) |
| `--on-teal` | 1 | theme:312[:root] = #06241a |
| `--page-2` | 1 | theme:32[:root] = #fcf6e8 |
| `--page` | 1 | theme:31[:root] = #f8f1e1 |
| `--panel-yumi` | 1 | theme:313[:root] = color-mix(in srgb, var(--surface) 93%, var(--marginalia-color) 7%) |
| `--question-color` | 1 | theme:174[:root] = var(--river) |
| `--radius-lg` | 1 | theme:85[:root] = 16px |
| `--radius-md` | 1 | theme:272[:root] = 10px |
| `--radius-pill` | 1 | theme:309[:root] = 999px |
| `--radius-sm` | 1 | theme:84[:root] = 6px |
| `--radius-xl` | 1 | theme:299[:root] = 22px |
| `--register-empirical-deep` | 1 | theme:159[:root] = var(--register-empirical) |
| `--register-empirical-light` | 1 | theme:137[:root] = color-mix(in srgb, var(--register-empirical) 30%, var(--bg) 70%) |
| `--register-empirical-mid` | 1 | theme:148[:root] = color-mix(in srgb, var(--register-empirical) 65%, var(--bg) 35%) |
| `--register-empirical` | 1 | theme:128[:root] = color-mix(in srgb, var(--gold-text) 50%, var(--br-deep) 50%) |
| `--register-history-deep` | 1 | theme:160[:root] = var(--register-history) |
| `--register-history-light` | 1 | theme:138[:root] = color-mix(in srgb, var(--register-history) 30%, var(--bg) 70%) |
| `--register-history-mid` | 1 | theme:149[:root] = color-mix(in srgb, var(--register-history) 65%, var(--bg) 35%) |
| `--register-history` | 1 | theme:127[:root] = color-mix(in srgb, var(--gold) 60%, var(--br-deep) 40%) |
| `--register-journal` | 1 | theme:42[:root] = #7d6db0 |
| `--register-marginalia` | 1 | theme:41[:root] = var(--teal) |
| `--register-memoir-deep` | 1 | theme:161[:root] = var(--register-memoir) |
| `--register-memoir-light` | 1 | theme:139[:root] = color-mix(in srgb, var(--register-memoir) 30%, var(--bg) 70%) |
| `--register-memoir-mid` | 1 | theme:150[:root] = color-mix(in srgb, var(--register-memoir) 65%, var(--bg) 35%) |
| `--register-memoir` | 1 | theme:126[:root] = var(--river) |
| `--register-novel-deep` | 1 | theme:162[:root] = var(--register-novel) |
| `--register-novel-light` | 1 | theme:140[:root] = color-mix(in srgb, var(--register-novel) 30%, var(--bg) 70%) |
| `--register-novel-mid` | 1 | theme:151[:root] = color-mix(in srgb, var(--register-novel) 65%, var(--bg) 35%) |
| `--register-novel` | 1 | theme:130[:root] = #c9a85a |
| `--register-place-deep` | 1 | theme:164[:root] = var(--register-place) |
| `--register-place-light` | 1 | theme:142[:root] = color-mix(in srgb, var(--register-place) 30%, var(--bg) 70%) |
| `--register-place-mid` | 1 | theme:153[:root] = color-mix(in srgb, var(--register-place) 65%, var(--bg) 35%) |
| `--register-place` | 1 | theme:132[:root] = #5a6b3a |
| `--register-poetry-deep` | 1 | theme:163[:root] = var(--register-poetry) |
| `--register-poetry-light` | 1 | theme:141[:root] = color-mix(in srgb, var(--register-poetry) 30%, var(--bg) 70%) |
| `--register-poetry-mid` | 1 | theme:152[:root] = color-mix(in srgb, var(--register-poetry) 65%, var(--bg) 35%) |
| `--register-poetry` | 1 | theme:131[:root] = #3a3573 |
| `--register-practice-deep` | 1 | theme:165[:root] = var(--register-practice) |
| `--register-practice-light` | 1 | theme:143[:root] = color-mix(in srgb, var(--register-practice) 30%, var(--bg) 70%) |
| `--register-practice-mid` | 1 | theme:154[:root] = color-mix(in srgb, var(--register-practice) 65%, var(--bg) 35%) |
| `--register-practice` | 1 | theme:129[:root] = color-mix(in srgb, var(--ink-2) 60%, var(--ink-4) 40%) |
| `--register-question` | 1 | theme:43[:root] = #3a5a8a |
| `--register-theory-deep` | 1 | theme:157[:root] = var(--register-theory) |
| `--register-theory-light` | 1 | theme:135[:root] = color-mix(in srgb, var(--register-theory) 30%, var(--bg) 70%) |
| `--register-theory-mid` | 1 | theme:146[:root] = color-mix(in srgb, var(--register-theory) 65%, var(--bg) 35%) |
| `--register-theory` | 1 | theme:124[:root] = var(--br-deep) |
| `--register-wisdom-deep` | 1 | theme:158[:root] = var(--register-wisdom) |
| `--register-wisdom-light` | 1 | theme:136[:root] = color-mix(in srgb, var(--register-wisdom) 30%, var(--bg) 70%) |
| `--register-wisdom-mid` | 1 | theme:147[:root] = color-mix(in srgb, var(--register-wisdom) 65%, var(--bg) 35%) |
| `--register-wisdom` | 1 | theme:125[:root] = var(--gold) |
| `--river-l` | 1 | theme:297[:root] = #5a7ab0 |
| `--river` | 1 | theme:72[:root] = #3a5a8a |
| `--scrim` | 2 | theme:57[:root] = rgba(15,9,4,.6)<br>components:10499[.ic-overlay.lum-amber-deep] = color-mix(in srgb, var(--lum-base) 82%, transparent) |
| `--shadow-1` | 2 | theme:250[:root] = 2px 3px 6px color-mix(in srgb, var(--br-deep) 8%, transparent), 4px 8px 18p…<br>components:11688[.account.lum-amber-ember] = 0 18px 40px -30px rgba(0,0,0,.6) |
| `--shadow-2` | 1 | theme:253[:root] = 3px 5px 12px color-mix(in srgb, var(--br-deep) 10%, transparent), 8px 16px … |
| `--shadow-cover` | 1 | theme:262[:root] = 0 24px 50px -20px #000 |
| `--shadow-d` | 2 | theme:53[:root] = 0 3px 10px rgba(0,0,0,.34), 0 14px 38px rgba(0,0,0,.32)<br>components:11689[.account.lum-amber-ember] = 0 18px 44px -28px rgba(0,0,0,.6) |
| `--shadow-page` | 1 | theme:54[:root] = 3px 5px 12px rgba(28,18,9,.10), 8px 16px 32px rgba(28,18,9,.08) |
| `--shadow-spotlight` | 1 | theme:254[:root] = 0 40px 100px -34px rgba(58,40,16,.5) |
| `--shadow-yumi` | 1 | theme:257[:root] = 3px 4px 10px color-mix(in srgb, var(--br-deep) 9%, transparent), 6px 12px 2… |
| `--sp-1` | 1 | theme:77[:root] = 4px |
| `--sp-2` | 1 | theme:78[:root] = 8px |
| `--sp-3` | 1 | theme:79[:root] = 12px |
| `--sp-4` | 1 | theme:80[:root] = 16px |
| `--sp-5` | 1 | theme:81[:root] = 24px |
| `--sp-6` | 1 | theme:82[:root] = 32px |
| `--subtheory-1-edge` | 3 | theme:210[:root] = #37968A<br>theme:445[[data-st-palette="muted"]] = #4f9389<br>theme:468[[data-st-palette="colorful"]] = #37968A |
| `--subtheory-10-edge` | 3 | theme:219[:root] = #7A66C2<br>theme:454[[data-st-palette="muted"]] = #7e69ad<br>theme:477[[data-st-palette="colorful"]] = #7A66C2 |
| `--subtheory-10` | 3 | theme:199[:root] = #AC9DE2<br>theme:454[[data-st-palette="muted"]] = #b9a8dc<br>theme:477[[data-st-palette="colorful"]] = #AC9DE2 |
| `--subtheory-11-edge` | 3 | theme:220[:root] = #8E6EC0<br>theme:455[[data-st-palette="muted"]] = #8a76b8<br>theme:478[[data-st-palette="colorful"]] = #8E6EC0 |
| `--subtheory-11` | 3 | theme:200[:root] = #C0A8E0<br>theme:455[[data-st-palette="muted"]] = #c4b2e0<br>theme:478[[data-st-palette="colorful"]] = #C0A8E0 |
| `--subtheory-12-edge` | 3 | theme:221[:root] = #94A33E<br>theme:456[[data-st-palette="muted"]] = #9aa35e<br>theme:479[[data-st-palette="colorful"]] = #94A33E |
| `--subtheory-12` | 3 | theme:201[:root] = #C9D67E<br>theme:456[[data-st-palette="muted"]] = #d2d89e<br>theme:479[[data-st-palette="colorful"]] = #C9D67E |
| `--subtheory-13-edge` | 3 | theme:222[:root] = #4AA582<br>theme:457[[data-st-palette="muted"]] = #62a386<br>theme:480[[data-st-palette="colorful"]] = #4AA582 |
| `--subtheory-13` | 3 | theme:202[:root] = #8FD4B8<br>theme:457[[data-st-palette="muted"]] = #a5d2bc<br>theme:480[[data-st-palette="colorful"]] = #8FD4B8 |
| `--subtheory-14-edge` | 3 | theme:223[:root] = #C25E84<br>theme:458[[data-st-palette="muted"]] = #b87490<br>theme:481[[data-st-palette="colorful"]] = #C25E84 |
| `--subtheory-14` | 3 | theme:203[:root] = #E89BB4<br>theme:458[[data-st-palette="muted"]] = #e2aabb<br>theme:481[[data-st-palette="colorful"]] = #E89BB4 |
| `--subtheory-15-edge` | 3 | theme:224[:root] = #AE8C46<br>theme:459[[data-st-palette="muted"]] = #a68f5e<br>theme:482[[data-st-palette="colorful"]] = #AE8C46 |
| `--subtheory-15` | 3 | theme:204[:root] = #DFC089<br>theme:459[[data-st-palette="muted"]] = #ddc9a0<br>theme:482[[data-st-palette="colorful"]] = #DFC089 |
| `--subtheory-16-edge` | 3 | theme:225[:root] = #CC6E5C<br>theme:460[[data-st-palette="muted"]] = #bb7e6e<br>theme:483[[data-st-palette="colorful"]] = #CC6E5C |
| `--subtheory-16` | 3 | theme:205[:root] = #EFA89A<br>theme:460[[data-st-palette="muted"]] = #e7b3a8<br>theme:483[[data-st-palette="colorful"]] = #EFA89A |
| `--subtheory-1` | 3 | theme:190[:root] = #6FC9BC<br>theme:445[[data-st-palette="muted"]] = #8fcdc3<br>theme:468[[data-st-palette="colorful"]] = #6FC9BC |
| `--subtheory-2-edge` | 3 | theme:211[:root] = #5580C2<br>theme:446[[data-st-palette="muted"]] = #5d76a8<br>theme:469[[data-st-palette="colorful"]] = #5580C2 |
| `--subtheory-2` | 3 | theme:191[:root] = #8FB8E8<br>theme:446[[data-st-palette="muted"]] = #a9bfe3<br>theme:469[[data-st-palette="colorful"]] = #8FB8E8 |
| `--subtheory-3-edge` | 3 | theme:212[:root] = #C4685B<br>theme:447[[data-st-palette="muted"]] = #b2625a<br>theme:470[[data-st-palette="colorful"]] = #C4685B |
| `--subtheory-3` | 3 | theme:192[:root] = #E8998D<br>theme:447[[data-st-palette="muted"]] = #e0a099<br>theme:470[[data-st-palette="colorful"]] = #E8998D |
| `--subtheory-4-edge` | 3 | theme:213[:root] = #C08A28<br>theme:448[[data-st-palette="muted"]] = #a8781f<br>theme:471[[data-st-palette="colorful"]] = #C08A28 |
| `--subtheory-4` | 3 | theme:193[:root] = #E8B45C<br>theme:448[[data-st-palette="muted"]] = #e3b964<br>theme:471[[data-st-palette="colorful"]] = #E8B45C |
| `--subtheory-5-edge` | 3 | theme:214[:root] = #3D93AC<br>theme:449[[data-st-palette="muted"]] = #5d99a8<br>theme:472[[data-st-palette="colorful"]] = #3D93AC |
| `--subtheory-5` | 3 | theme:194[:root] = #7CC6DA<br>theme:449[[data-st-palette="muted"]] = #9accd6<br>theme:472[[data-st-palette="colorful"]] = #7CC6DA |
| `--subtheory-6-edge` | 3 | theme:215[:root] = #C4A22E<br>theme:450[[data-st-palette="muted"]] = #b09238<br>theme:473[[data-st-palette="colorful"]] = #C4A22E |
| `--subtheory-6` | 3 | theme:195[:root] = #F0D468<br>theme:450[[data-st-palette="muted"]] = #ecd494<br>theme:473[[data-st-palette="colorful"]] = #F0D468 |
| `--subtheory-7-edge` | 3 | theme:216[:root] = #5F6AC4<br>theme:451[[data-st-palette="muted"]] = #6d74b8<br>theme:474[[data-st-palette="colorful"]] = #5F6AC4 |
| `--subtheory-7` | 3 | theme:196[:root] = #9BA4E8<br>theme:451[[data-st-palette="muted"]] = #b0b5e0<br>theme:474[[data-st-palette="colorful"]] = #9BA4E8 |
| `--subtheory-8-edge` | 3 | theme:217[:root] = #CC6E9A<br>theme:452[[data-st-palette="muted"]] = #c97f9b<br>theme:475[[data-st-palette="colorful"]] = #CC6E9A |
| `--subtheory-8` | 3 | theme:197[:root] = #F2A8C6<br>theme:452[[data-st-palette="muted"]] = #f2b8cc<br>theme:475[[data-st-palette="colorful"]] = #F2A8C6 |
| `--subtheory-9-edge` | 3 | theme:218[:root] = #6FA052<br>theme:453[[data-st-palette="muted"]] = #74955c<br>theme:476[[data-st-palette="colorful"]] = #6FA052 |
| `--subtheory-9` | 3 | theme:198[:root] = #A8CD8E<br>theme:453[[data-st-palette="muted"]] = #b5cf9e<br>theme:476[[data-st-palette="colorful"]] = #A8CD8E |
| `--sunk-d` | 1 | theme:28[:root] = #241406 |
| `--sunk` | 2 | theme:292[:root] = #e3d4b0<br>theme:355[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = #6b4a23 |
| `--surface-2` | 7 | theme:69[:root] = var(--page-2)<br>theme:346[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--surface-d2)<br>components:1860[.arcs.lum-amber] = color-mix(in srgb, var(--lum-ink) 7%, transparent)<br>components:3492[.yumi-sees-page .transparency-panel] = var(--page-2)<br>components:9542[.about .orientation] = var(--page)<br>components:10501[.ic-overlay.lum-amber-deep] = color-mix(in srgb, var(--lum-ink) 6%, transparent)<br>components:11686[.account.lum-amber-ember] = color-mix(in srgb, var(--lum-ink) 6%, transparent) |
| `--surface-d2` | 1 | theme:27[:root] = #4a3119 |
| `--surface-d` | 2 | theme:26[:root] = #3e2814<br>components:11687[.account.lum-amber-ember] = color-mix(in srgb, var(--lum-ink) 6%, transparent) |
| `--surface` | 6 | theme:66[:root] = var(--page-2)<br>theme:345[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = var(--surface-d)<br>components:1859[.arcs.lum-amber] = color-mix(in srgb, var(--lum-ink) 5%, transparent)<br>components:9541[.about .orientation] = var(--page-2)<br>components:10500[.ic-overlay.lum-amber-deep] = color-mix(in srgb, var(--lum-ink) 4%, transparent)<br>components:11685[.account.lum-amber-ember] = color-mix(in srgb, var(--lum-ink) 4%, transparent) |
| `--teal` | 2 | theme:37[:root] = #2e8a93<br>components:10508[.ic-overlay.lum-amber-deep] = var(--lum-cyan) |
| `--text-d` | 2 | theme:34[:root] = #f0e3c8<br>components:11681[.account.lum-amber-ember] = var(--lum-ink) |
| `--text-on-dark` | 3 | theme:74[:root] = #fdfaf3<br>components:10513[.ic-overlay.lum-amber-deep] = var(--lum-gold-ink)<br>components:11683[.account.lum-amber-ember] = var(--lum-gold-ink) |
| `--thread-color-faint` | 1 | theme:171[:root] = color-mix(in srgb, var(--thread) 65%, transparent) |
| `--thread-color` | 1 | theme:170[:root] = var(--thread) |
| `--thread` | 1 | theme:38[:root] = #c2a463 |
| `--tradition-empirical-halo` | 1 | theme:178[:root] = #F8C8AA |
| `--tradition-ground` | 1 | theme:168[:root] = #FAEEDA |
| `--tradition-history-halo` | 1 | theme:179[:root] = #E8B068 |
| `--tradition-inner-light` | 1 | theme:169[:root] = #FFF8E7 |
| `--tradition-memoir-halo` | 1 | theme:180[:root] = #C5D080 |
| `--tradition-novel-halo` | 1 | theme:181[:root] = #F5BACE |
| `--tradition-place-halo` | 1 | theme:183[:root] = #98D4B0 |
| `--tradition-poetry-halo` | 1 | theme:182[:root] = #8590D8 |
| `--tradition-practice-halo` | 1 | theme:184[:root] = #B8896C |
| `--tradition-theory-halo` | 1 | theme:176[:root] = #F0A88A |
| `--tradition-wisdom-halo` | 1 | theme:177[:root] = #F8E078 |
| `--wash-page` | 1 | theme:52[:root] = rgba(36,23,16,.05) |
| `--wash` | 3 | theme:308[:root] = var(--wash-page)<br>theme:352[[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel] = rgba(210,162,62,.08)<br>components:10514[.ic-overlay.lum-amber-deep] = color-mix(in srgb, var(--lum-ink) 8%, transparent) |
| `--wordmark` | 1 | theme:307[:root] = var(--gold-soft) |

#### Namespace C — component/surface-scoped tokens (first-defined in components.css)

| Token | Defs | Scope(s) & value(s) |
|---|---|---|
| `--bk-ch` | 1 | components:10816[.bk-bookhead .bk-cover] = 200px |
| `--bk-cw` | 1 | components:10816[.bk-bookhead .bk-cover] = 134px |
| `--font-script` | 1 | components:9444[.about] = 'Cormorant Garamond', 'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif CJK … |


### 1.3 Canon token table + non-tokenized style facts

Both canon files (`design/praxis-design-canon.html`, `design/praxis-profile-galaxy-mockup.html`) declare the **same 13 custom properties**, byte-identical, in one compressed `:root{…}` rule each. The canon side is **flat**: direct hex on semantic tokens, no primitive-indirection layer, no `[data-ground]` remap.

| Canon token | Value | Role (as used) |
|---|---|---|
| `--paper` | `#f4efe4` | page ground ("paper") |
| `--surface` | `#fffdf8` | card fill (near-white) |
| `--surface-2` | `#efe7d6` | secondary card fill |
| `--ink` | `#241d10` | primary text |
| `--ink-2` | `#645940` | secondary text |
| `--ink-3` | `#978b6d` | tertiary / meta text |
| `--line` | `#e3d8c1` | hairline (opaque) |
| `--gold` | `#a8761a` | primary gold |
| `--gold-deep` | `#8c5c10` | deep gold |
| `--gold-hi` | `#d9a441` | **gilding highlight** (confirmed present, 5 uses; the value the brief expected) |
| `--ember` | `#c0492a` | warm-red accent |
| `--night-line` | `#3a2c15` | hairline on the dark ("night") side |
| `--radius` | `16px` | corner radius |

**Non-tokenized style facts (the drift the tokens do NOT capture).** The canon leans on raw hex far more than on its 13 tokens:

- **Hex color set:** `design-canon.html` = **43 distinct / 119 total** occurrences; `profile-galaxy-mockup.html` = **59 distinct / 79 total**. Combined **top-20** deduped (count · hex):
  `8 #f2c25a` · `6 #fffdf8` · `6 #fff6df` · `6 #fff4d6` · `6 #e9b24a` · `6 #a9b98c` · `6 #8c5c10` · `5 #ffe6ac` · `5 #d9a441` · `5 #a8761a` · `5 #2a1e10` · `5 #1a1410` · `5 #0b0d16` · `4 #fff6e2` · `4 #f4efe4` · `4 #f3c266` · `4 #efe7d6` · `4 #e9d6a8` · `4 #e8cf88` · `4 #e8a94a`.
  - **Families visible in the set:** creams/papers (`#fffdf8 #fff6df #fff4d6 #fff6e2 #f4efe4 #efe7d6 #e9d6a8`), amber/gold (`#f2c25a #e9b24a #d9a441 #a8761a #8c5c10 #f3c266 #e8cf88 #e8a94a`), a **sage-green accent** (`#a9b98c`, 6×), warm darks (`#2a1e10 #1a1410`), and a **blue-black "night" ground** unique to the galaxy mockup (`#0b0d16`, `#101019`) — the literal "night" of paper-and-night.
- **Font-family declarations (distinct stacks · counts):** `'DM Mono', monospace` (52) · `'Cormorant Garamond', serif` (33) · `'DM Sans', system-ui, sans-serif` (2) · `'DM Sans', sans-serif` (2), plus a handful of SVG `font-family="DM Mono, monospace"` attributes. **Same three families as live** (`--font-mono` DM Mono, `--font-serif` Cormorant Garamond, `--font-body` DM Sans) — the type system already agrees across sides; the divergence is color/ground, not type.
- **Type scale actually used (distinct font-size · count), top values:** `11px`(21) · `10px`(13) · `12px`(9) · `10.5px`(9) · `19px`(6) · `13px`(5) · `34px`(4) · `13.5px`(4) · `24/22/18/17/16px`(3 each) · `52/40px`(2) · `86/78/70px`(1 each). Dominated by small mono labels (10–12px) with a wide display range up to 86px.
- **Gilding values found:** `#d9a441` (5×, = `--gold-hi`) and a secondary `#b5851f` (3×). The brief's expected `#d9a441` is present.

### 1.4 Collision map (roles/tokens on both sides — values side by side, no verdict)

Live values shown as resolved through the primitive layer (see §3). Where live redefines under `[data-ground="dark"]`, both the `:root` (bright) and dark value are given. **Row count = 12** (6 same-name collisions + 6 same-role/different-name); every row has both a live and a canon cell.

**Group A — same NAME defined on both sides (6):**

| Token | Live `:root` (bright) | Live `[data-ground=dark]` | Canon | 
|---|---|---|---|
| `--surface` | `var(--page-2)` = `#fcf6e8` ([theme:66](../../../assets/theme.css)) | `var(--surface-d)` = `#3e2814` ([theme:345](../../../assets/theme.css)) | `#fffdf8` |
| `--surface-2` | `var(--page-2)` = `#fcf6e8` ([theme:69](../../../assets/theme.css)) | (redefined, 7 sites) | `#efe7d6` |
| `--ink` | `#241710` ([theme:60](../../../assets/theme.css)) | `var(--text-d)` = `#f0e3c8` ([theme:341](../../../assets/theme.css)) | `#241d10` |
| `--ink-2` | `#4d3b2a` ([theme:61](../../../assets/theme.css)) | (redefined, 8 sites) | `#645940` |
| `--ink-3` | `var(--meta)` ([theme:62](../../../assets/theme.css)) | (redefined, 8 sites) | `#978b6d` |
| `--gold` | `var(--gold-ink)` = `#855410` ([theme:64](../../../assets/theme.css)) | `#d2a23e` ([theme:358](../../../assets/theme.css)) | `#a8761a` |

**Group B — same ROLE, different name (6):**

| Role | Live token · value | Canon token · value |
|---|---|---|
| page ground | `--page` `#f8f1e1` ([theme:31](../../../assets/theme.css)) | `--paper` `#f4efe4` |
| hairline | `--border` `rgba(36,23,16,.16)` ([theme:67](../../../assets/theme.css)) / `--line-2` | `--line` `#e3d8c1` (opaque) |
| deep gold | `--gold-ink` `#855410` ([theme:40](../../../assets/theme.css)) | `--gold-deep` `#8c5c10` |
| warm-red accent | `--danger` `#c2603a` ([theme:317](../../../assets/theme.css)) | `--ember` `#c0492a` |
| corner radius | `--radius-lg` `16px` ([theme:85](../../../assets/theme.css)) | `--radius` `16px` (same value) |
| bright gold accent | `--gold-soft` `#e7c46a` ([theme:39](../../../assets/theme.css)) · `--lum-gold` `#ffce4a` ([lumen-amber:42](../../../assets/lumen-amber.css)) | `--gold-hi` `#d9a441` |

**Recorded observations (facts, not verdicts):**
- Three distinct "gold" values are in play across the two systems: live `--gold`→`#855410` (deep), live `--lum-gold` `#ffce4a` (Lumen accent), canon `--gold-hi` `#d9a441` (gilding). Canon `--gold` `#a8761a` and live `--gold` differ.
- Canon's exact hexes are **new to the live tree**: `#a8761a` (canon `--gold`), `#0b0d16` (canon night) both return **0** occurrences across all three live CSS files.
- Canon has no `--ink-4`; live defines `--ink-4` (8 sites). Canon `--night-line` has no same-name live counterpart (its role — dark-side hairline — lives in live under the `[data-ground=dark]` `--border`/`--line-2` redefinitions).

### 1.5 Orphan lists

**Live orphans — operational definition (per brief): tokens defined but with 0 literal `var(--name)` consumers** across the live app corpus (29 files: 3 CSS + `marks.js` + `sw.js` + 4 app HTML + `js/*.js` + `netlify/functions/*.js`). **75 tokens** meet this bar. But the naive grep cannot see **runtime string-concatenation** consumption, so the 75 partition into:

- **Dynamically consumed via concat — NOT dead (57):**
  - `--register-{tradition}-{deep|light|mid}` — **27** (9 traditions × 3 bands). Assembled at [`views.js:5122`](../../../js/views.js) `'var(--register-'+tradition+'-'+bandSuffix+')'` and set via `setProperty` at [`views.js:4981`](../../../js/views.js)/[`5044`](../../../js/views.js).
  - `--subtheory-{1..16}` / `--subtheory-N-edge` — **30**. Assembled at [`arc-constellation.js:506`](../../../js/arc-constellation.js) / `528` / `844-845` / `914` / `962` / `1731` and [`views.js:8667-8668`](../../../js/views.js) `'var(--subtheory-'+(idx+1)+')'`.
- **Family-partial — sibling tokens of the same family ARE consumed, these specific ones have no found consumer (8):**
  - `--tradition-{history,memoir,novel,place,poetry,practice}-halo` — **6**. Their siblings `--tradition-{wisdom,theory,empirical}-halo` are literally referenced at [`yumi-ui.js:955-962`](../../../js/yumi-ui.js); these six are not.
  - `--arc-web-node-gap`, `--arc-web-spine-width` — **2**. Family sibling `--arc-web-node-cover-height` is consumed ([components.css:6226](../../../assets/components.css)); these two are not.
- **True-dead — 0 literal + 0 dynamic + 0 sibling consumer (10):** each appears **only at its own definition line** (verified by exact-name search minus defs = 0; the two with a residual hit are comment mentions only):
  `--dots` ([theme:323](../../../assets/theme.css)) · `--field-presence` ([theme](../../../assets/theme.css); only mention outside def is a comment [components.css:2045](../../../assets/components.css)) · `--font-script` ([theme:169](../../../assets/theme.css); only other mention a comment [components.css:9440](../../../assets/components.css)) · `--glass-bar` ([theme:46](../../../assets/theme.css)) · `--grad-soft` ([theme:44](../../../assets/theme.css)) · `--ground-base` ([theme:305](../../../assets/theme.css)) · `--ground-edge` ([theme:306](../../../assets/theme.css)) · `--margin-rule` ([theme:325](../../../assets/theme.css)) · `--thread-color-faint` ([theme:171](../../../assets/theme.css)) · `--tradition-inner-light` ([theme:169](../../../assets/theme.css)).

Consumption headline: **170** distinct tokens are consumed via literal `var()`; most-referenced: `--ink` (313), `--ink-3` (251), `--font-mono` (223), `--font-serif` (208), `--font-body` (186), `--border` (175), `--gold` (173), `--lum-ink` (145), `--ink-2` (141), `--lum-serif` (129).

**Canon values with no live counterpart** (canon hex/role absent from live by value): the blue-black **night ground** `#0b0d16` / `#101019` (galaxy only; live has no blue-black — its darks are warm umbers `#2f1c0e`/`#3e2814`/`#2a1a0c`); the **sage-green accent** `#a9b98c` (live has no green in the sampled palette — its non-amber accents are `--teal`/`--river` blues and `--marginalia-color`); canon `--gold` `#a8761a`, `--gold-hi` `#d9a441`, `--ember` `#c0492a`, `--night-line` `#3a2c15` all absent from live by exact value.

---

## Stage 2 — Surface Census

**Router:** `views.renderRoute()` ([views.js:343-721](../../../js/views.js)), dispatched by [`app.js:18`](../../../js/app.js) on load and on every `hashchange`. It parses `location.hash` → `parts = rest.split('/')` and branches on `parts[0]` (with `parts[1]`/`parts[2]` sub-discriminators). Cold-open default = `#home` ([app.js:15-16](../../../js/app.js)); empty/unknown hashes converge on Notebook.

### 2.1 Router-dispatched surfaces (18 rendered + 1 transient)

| # | Route pattern | `parts[0]` | Entry function | views.js line | In top-nav? | Ground | Description |
|---|---|---|---|---:|---|---|---|
| 1 | `#home` | home | `renderHome` | 1440 | **yes** (`home`) | dark | Landing / field of arcs |
| 2 | `#books` | books | `renderShelf` | 3730 | **yes** (`books`) | dark | Shelf (Covers/List) |
| 3 | `#book/<id>` | book | `renderBookDetail` | 8124 | no (sub of books) | dark | Book detail |
| 4 | `#book/<id>/marks` | book | `renderBookView` | 7645 | no (sub of books) | dark | Marks & lineage |
| 5 | `#artifact/<id>` | artifact | `renderArtifact` | 10939 | no (sub of books) | bright | Finished-book artifact |
| 6 | `#arcs` | arcs | `renderArcsPage` | 3458 | **yes** (`arcs`) | dark | Arcs teaching page |
| 7 | `#arc/<id>` | arc | `renderArcDetail` | 12060 | no (sub of arcs) | dark | Arc detail / constellation |
| 8 | `#subtheory/<id>` | subtheory | `renderSubTheoryPage` | 9119 | no (sub of arcs) | dark | Sub-theory detail (the Page) |
| 9 | `#subtheory/<id>/build` | subtheory | `renderSubTheoryBuild` | 10576 | no (sub of arcs) | dark | Sub-theory Build/compose |
| 10 | `#notebook` (+ empty/unknown) | notebook | `renderNotebook` | 1737 | **yes** (`notebook`) | dark | Notebook spread (catch-all) |
| 11 | `#account` | account | `renderAccountPage` | 17109 | **yes** (`account`) | dark | Account hub |
| 12 | `#about` | about | `renderAbout` | 18330 | **yes** (`about`) | dark | About / orientation |
| 13 | `#profile` | profile | `renderOwnProfile` | 16003 | no (from Account) | dark | Own reader profile |
| 14 | `#commons` | commons | `renderCommons` | 16599 | no (from Account) | dark | Social commons/discovery |
| 15 | `#reader/<uid>` | reader | `renderOtherProfile` | 16684 | no (from commons) | dark | Other reader's profile |
| 16 | `#walk/<arcId>` | walk | `renderInteract` | 16803 | no (from profile/arc) | dark | Interact / walk an arc |
| 17 | `#search` | search | `renderSearch` | 1026 | no (nav pill / ⌘K) | dark | Global search |
| 18 | `#yumi-sees` | yumi-sees | `renderWhatYumiSeesPage` | 14128 | no (from Yumi panel) | bright | "What Yumi sees" transparency |
| — | `#arc/<id>/new-subtheory` | arc | *(transient)* `createSubTheory` → `location.replace('#subtheory/<id>/build')` | 538 | — | — | Mints a draft, redirects to #9. No surface render. |

Ground column = whether `parts[0]` is in the `umberGroundDark` map at [views.js:373](../../../js/views.js) (dark) or falls through to bright.

### 2.2 Census reconciliation (the Stage-2 gate)

- **Method A — route-patterns registered by the router:** 19 distinct patterns (rows 1–18 + the transient new-subtheory). Distinct `parts[0]` hash-heads = **16** (`home, books, book, artifact, arcs, arc, subtheory, notebook, account, about, profile, commons, reader, walk, search, yumi-sees`); three heads (`book`, `subtheory`, `arc`) fork on `parts[2]` into 2 patterns each, so 16 heads → 19 patterns. Of the 19, **one** (`arc/<id>/new-subtheory`) is a mint-and-redirect that renders no surface → **18 rendered surfaces**.
- **Method B — router-dispatched render functions in `views.js`:** exactly **18** distinct `renderX` calls inside `renderRoute` (grep of the body): `renderHome, renderShelf, renderBookDetail, renderBookView, renderArtifact, renderArcsPage, renderArcDetail, renderSubTheoryPage, renderSubTheoryBuild, renderNotebook, renderAccountPage, renderAbout, renderOwnProfile, renderCommons, renderOtherProfile, renderInteract, renderSearch, renderWhatYumiSeesPage`.
- **18 (A) == 18 (B). Reconciled.** The single A/B numeric gap (19 patterns vs 18 functions) is the transient `new-subtheory` redirect — itemized above, not hand-waved.

**Full render-function inventory in `views.js` = 31** (`grep -nE '^function render'`): 1 `renderRoute` + the 18 surfaces above + **12 helper/sub-renderers** — `renderShelfBook` (1 caller), `renderShelfBookRow` (2), `renderRegisterGlyph` (0 direct), `renderSubTheoryReadOnly` (2), `renderArcMissingMember` (0 direct), `renderNotebookEntry` (1), `renderArtifactCard` (0 direct), `renderArcRow` (0 direct), `renderTransparencySection` (7), `renderTransparencyEntry` (1), `renderTransparencyArtifact` (1), `renderTransparencyTurn` (1). 1 + 18 + 12 = 31, fully accounted. (The earlier Stage-0 figure of 41 counted `render[A-Z]` mentions anywhere, incl. comments; **31** is the line-anchored definition count. The four "0 direct caller" helpers are recorded as-found — this is an inventory, not a dead-code audit.)

### 2.3 Overlay surfaces that function as pages (4)

Reached by affordance, not the router — tagged `overlay`:

| Overlay | Module | Entry | Note |
|---|---|---|---|
| Yumi panel / Bloom | `js/yumi-ui.js` | `buildYumiPanel` (1027), `.yumi-panel-open` toggle; Bloom FAB `buildYumiBloom` (920) | Body-level, present on every surface |
| Onboarding journey + per-page intro panels | `js/intros.js` | `window.Intros` (IIFE module); `window.Intros.startJourney()` | First-run body-level `.lum-amber` overlay + 12 per-page bottom-sheets |
| Import / Capture | `js/import-capture.js` | `window.ImportCapture` (IIFE); invoked from [views.js:2025-2053](../../../js/views.js) | Upload/paste/dictation capture |
| Spotlight ⌘K | `js/spotlight.js` | `openSpotlight` (341), `toggleSpotlight` (366) | Command-palette search overlay |

### 2.4 Nav ↔ surface flags

- **Nav `data-route` set (6):** `home, books, arcs, notebook, about, account` ([index.html](../../../index.html), `.app-nav-link`). **All 6 map to a reachable surface** — no dead nav item.
- **Surfaces reachable in code but not in top-nav (12):** rows 3–5, 7–9, 13–18 above. This is **by design** — they are sub-surfaces (book/arc/sub-theory detail), social surfaces reached from Account/Commons, or overlay-reached (`search` from the nav pill/⌘K, `yumi-sees` from the Yumi panel). Documented in the `renderRoute` comments ([views.js:377-419](../../../js/views.js)). Recorded, not flagged as a defect.

---

## Stage 3 — Context Pack (for a design-chat Claude with no repo access)

**What the live token system is.** Three stylesheets, loaded in this order in [`index.html:13-16`](../../../index.html) (later = higher cascade precedence at equal specificity):
1. `lumen-amber.css` (first) — the **`--lum-*` luminous set** (28 names first-defined here; `--lum-gold #ffce4a` is the lead accent). Consumed heavily by the constellation/field/mark surfaces.
2. `theme.css` — the **Amber system**: a *primitive palette* (`--page #f8f1e1`, `--page-2 #fcf6e8`, `--ground #2f1c0e`, `--surface-d #3e2814`, `--text-d #f0e3c8`, `--gold-ink #855410`, `--gold-soft #e7c46a`, `--line-page rgba(36,23,16,.16)`, …) → *semantic tokens* that resolve through it (`--surface: var(--page-2)`, `--gold: var(--gold-ink)`, `--ink: #241710`). It also carries **6 `[data-ground="dark"]` blocks** that **remap the semantic layer** for dark surfaces (`--ink → var(--text-d)` cream, `--surface → var(--surface-d)` umber, `--gold → #d2a23e`).
3. `components.css` (last) — **703 `.lum-amber`-scoped selectors** that redefine tokens per surface; the top of the redefinition stack.

So a live token is **two-tier and ground-aware**: primitive → semantic → per-route override. The active ground is set once per route by `document.body[data-ground]` from the `umberGroundDark` map at [`views.js:373`](../../../js/views.js) (dark: home, books, arcs, arc, account, book, subtheory, notebook, profile, commons, reader, walk, search, about, + bright fall-through for artifact, yumi-sees).

**What the canon system is.** Each canon file is one HTML page with **13 flat semantic tokens** (direct hex, no primitives, no `[data-ground]`), and it relies on **raw hex far more than on tokens** (43–59 distinct hexes per file vs 13 tokens). Its "night" is a literal **blue-black ground** (`#0b0d16`/`#101019`, galaxy only), distinct from live's *warm-umber* darks. Type and font families already match live (DM Mono / Cormorant / DM Sans).

**The two-namespace situation, plainly.** Live carries **two parallel palettes**: the Amber semantic set (`--surface/--ink/--gold/--border/…`, ground-remapped) and the Lumen luminous set (`--lum-*`, used by the field/marks). Canon adds a **third** vocabulary — a flat paper-and-night set (`--paper/--surface/--ink/--gold/--gold-hi/--ember/--night-line`) that **name-collides on 6 tokens** (`surface, surface-2, ink, ink-2, ink-3, gold`) with different values, and **role-collides on 6 more** under different names (paper↔page, line↔border, gold-deep↔gold-ink, ember↔danger, radius↔radius-lg, gold-hi↔gold-soft/lum-gold). See §1.4.

**Where runtime JS sets custom properties** (carried forward from Stage 0; the reconciliation must preserve these seams):
- [`views.js:4981`](../../../js/views.js), [`5044`](../../../js/views.js) — `setProperty('--tick', 'var(--register-'+tradition+')')`
- [`views.js:9519`](../../../js/views.js), [`10706`](../../../js/views.js) — `setProperty('--lit', <0..1>)` (luminance)
- [`views.js:13453`](../../../js/views.js) — `setProperty('--reg', …)` (register spine color)
- [`marks.js:96`](../../../assets/marks.js) — inline `style="--cd:<size>px;--mk-glow:<hex>"` on each mark span.
- These, plus the `--register-*` (27) and `--subtheory-*` (30) families, are consumed by **string concatenation** — a value-only find/replace during reconciliation that misses concatenated names will silently break the constellation/register coloring (see §1.5).

**State of the ground (factual).** The live app is one unified, ground-aware Amber/Lumen system across all 18 surfaces + 4 overlays; every surface mounts the `.lum-amber` skin (book surfaces via the shared `bookAmberSurface` helper; About via `.about`-scoped Amber tokens). 208 distinct live tokens, 170 consumed literally, 57 more consumed by concat, 10 truly dead. The canon side is two flat mockups sharing 13 tokens and a hex-heavy paper-and-night palette that overlaps the live system by role but not by value.

**RECORDED for the commit-time fix (doc/live contradictions — not repaired here):**
1. **CLAUDE.md canon-reference filename mismatch.** The "Design canon" section of `CLAUDE.md` names `design/praxis-full-app-mockup.html` (mobile) and `design/praxis-desktop-mockup.html` (desktop) as the reference mockups. **Neither exists in the tree.** The actual canon files are `design/praxis-design-canon.html` and `design/praxis-profile-galaxy-mockup.html` (the two placed for this run).
2. **CLAUDE.md §Design-canon §1 token hexes are stale.** The section lists `--surface #ecdcae`, `--surface-2 #f2e6c2`, `--bg #d8bd80`, `--ink #2a1810`, `--gold #a8741a`, `--bg-2 #e3c98c`, `--sunk #c9a85f` as live `theme.css` values. **All seven return 0 occurrences across all three live CSS files.** The live `:root` resolves `--surface → #fcf6e8`, `--ink → #241710`, `--gold → #855410` via the primitive layer (§3, §1.4). This is a "DOC = POINTER, LIVE FILE = SOURCE" drift; the live file is the source.

*(These two are recorded facts for Preston's commit-time decision — this read-only run does not edit CLAUDE.md.)*
