---
name: v1-recon
kind: recon
date: 2026-09-19
head: 6c1c0a2
version: praxis-v3.299
mode: read-only (no app file touched)
viewports: [1360x900 dpr1, 390x844 dpr2]
rig: .claude/rig/serve.ps1 :8793 + seed/auth stub (uid d0tester) + measure.js; captures via headless Chrome 153 over CDP
---

# V-1 — Look-and-feel recon: token + surface census

> **Captures are LOCAL-ONLY.** The 31 PNGs under `.claude/rig/captures/v1/` total
> **18,497,589 B (17.6 MB)**, above the 8 MB threshold set for this task, so they are not
> staged with this report. Paths are cited throughout; the files exist on the build machine.

Read-only census of the Praxis design system as it stands at HEAD `6c1c0a2` /
`praxis-v3.299`. No application file was edited, no token added, renamed or removed. This
report measures what IS; it contains no recommendations. Numbers are computed counts and
computed styles, each with the command or instrument that produced it (§5).

---

## 0 · Pre-flight

### 0.0 Protocol docs — 12 requested, 12 FOUND, 0 MISSING

| Doc | Found | Note |
|---|---|---|
| `CLAUDE.md` | ✅ | 50,791 B |
| `PROTOCOL.md` | ✅ | v1.2 |
| `docs/FIX-PROTOCOL.md` | ✅ | v1.3 |
| `CRAFT.md` | ✅ | §4 sets raw-hex target **0** |
| `.claude/agents/praxis-recon.md` | ✅ | carries a stale byte-lock figure — drift D3 |
| `.claude/agents/repo-mapper.md` | ✅ | |
| `.claude/rig/README.md` | ✅ | two stale claims — drift D1, D2 |
| `.claude/rig/seed.js` | ✅ | |
| `.claude/rig/measure.js` | ✅ | |
| `docs/studio/praxis-universal-token-sheet.md` | ✅ | v1.2 |
| `docs/studio/desktop-recon.md` | ✅ | D0, 2026-07-11 |
| `docs/studio/home.md` | ✅ | |

No protocol doc conflicted with this task's prompt except on captures (`.claude/rig/README.md`
declares screenshots impossible in the pane — see D1); that was raised at the Stage-0 halt and
ruled by Preston, not resolved unilaterally.

Session rituals: `sh tools/ground-truth` → exit 0, HEAD `6c1c0a2`, hook gate **ARMED**,
FIX-PROTOCOL v1.3, 7 agents. `docs/studio/sequence.md` `## Now` read.

### 0.1 Tree

| Check | Result |
|---|---|
| branch | `main` |
| HEAD | `6c1c0a2880169faf7b2bc25f3e9b26f59cff0e08` |
| `git status --porcelain` filtered to tracked changes | **empty** |
| `git diff --stat` | **empty** |
| untracked | 110 entries, all pre-existing scratch from the session-start snapshot |
| `git rev-list --left-right --count origin/main...HEAD` | `0  0` — HEAD == `origin/main` |

Ahead/behind is measured against the **local** `origin/main` ref; no fetch was performed.

### 0.2 Version stamp

`sw.js:10` — `var CACHE_VERSION = 'praxis-v3.299';`. `index.html` carries **no** version
stamp (0 matches); `sw.js` is the sole stamp in the repo.

### 0.3 The five stylesheets

Every file matches its expected figure exactly at the git-blob (LF) level.

| File | blob B | worktree B | lines | expected | verdict |
|---|---|---|---|---|---|
| `assets/theme.css` | **46,047** | 46,902 | 855 | ≈46,047 / 855 | exact (worktree +855 = CRLF) |
| `assets/lumen-amber.css` | **14,966** | 14,966 | 265 | ≈14,966 / 265 | exact |
| `assets/praxis-kit.css` | **16,661** | 16,661 | 191 | ≈16,661 / 191 | exact |
| `assets/components.css` | **909,487** | 909,487 | 17,450 | ≈909,487 / 17,450 | exact |
| `docs/studio/universal-depth.css` | **9,699** | 9,699 | 149 | ≈9,699 | exact |

The theme.css difference is not a content delta: `git ls-files --eol` reports `i/lf w/crlf`
for `theme.css` and `i/lf w/lf` for the other four; the +855 B equals its 855 line count.

**Foundations byte-lock (FIX-PROTOCOL §2) — both hold:** `lumen-amber.css` md5
`070679b03453ca0d8405cb6f92ec5ad2`, 14,966 B · `marks.js` md5
`772886c049d0d6d03d341507e602d88a`, 10,255 B.

### 0.4 Stylesheet load order

Actual, in document order — matches the expected order exactly:

| # | line | file |
|---|---|---|
| 1 | `index.html:13` | `/assets/lumen-amber.css` |
| 2 | `index.html:15` | `/assets/theme.css` |
| 3 | `index.html:16` | `/assets/components.css` |
| 4 | `index.html:21` | `/assets/praxis-kit.css` |
| 5 | `index.html:28` | `/docs/studio/universal-depth.css` |

A Google Fonts `<link>` precedes them at `index.html:12` (Cormorant Garamond 400/500/600 +
italics, DM Mono 400/500, DM Sans 400/500/600/700). **`index.html` contains 0 inline
`<style>` blocks.** Two stylesheets are injected at runtime by JS — `praxis-yumi-glyph-style`
(5 rules) and, during measurement only, the rig's own `__rig_settle` (1 rule, excluded from
every count in this report).

### 0.5 Rig

Started per `.claude/rig/README.md`: `serve.ps1` on `:8793`, origin clean (0 service workers,
0 caches). Seeded uid **`d0tester`**. Workspace present after reload — **5 books · 1 arc ·
4 sub-theories · 16 notebook entries · 1 bookArtifact** — matching the set `seed.js` documents
as self-seeding. Every seeded arc and sub-theory is owned by `__praxis_seed__`, not by
`d0tester`, so signed-in surfaces render the *worked-example* state, not a populated personal
one (this is why `#home` shows "You haven't begun an arc yet" beside a seeded field).

Viewports: **1360** → `innerWidth 1360`, `clientWidth 1345`, dpr 1, `(min-width:1600px)` does
**not** match · **390** → `innerWidth 390`, `clientWidth 390`, dpr 2, all mobile breakpoints
(759/720/639/499) match, `rig.hscroll()` overflow 0.

### 0.6 Captures directory

`.claude/rig/captures/` did not exist; `captures/v1/` created. `git check-ignore` confirms it
is **not** ignored — `.gitignore:42-44` ignores `.claude/*` then negates `!.claude/agents/`
and `!.claude/rig/`.

Pre-flight capture: `.claude/rig/captures/v1/_preflight-home-1360.png` (674KB) — `#home` at
1360, signed in, viewport-height, taken through the same harness as every other capture.

---
## 1 · Token census (source)

### 1.0 Headline totals

| Measure | Count |
|---|---|
| custom-property **definitions** (declaration sites) across the 5 files | **872** |
| **distinct** token names defined | **458** |
| defined exactly once | 337 |
| defined **more than once** (re-pointed) | **121** |
| consumer hits, specified corpus, raw | **6,398** |
| consumer hits, specified corpus, comments stripped | **6,375** |
| consumer hits, + `universal-depth.css` as consumer | **6,422** |
| distinct names consumed (code only) | 304 |
| **true dead** (0 consumers, not a concat family) | **37** |
| zero literal consumers but **concat-consumed** (not dead) | 125 |
| consumed but never defined in the 5 files | 19 |
| literal hex **outside** token definitions (the bypass) | **182** |
| literal hex **inside** token definitions (the sanctioned place) | 467 |
| hard-coded `font-family` stacks in the 5 files | **0** |

**6 of the 872 definitions never reach the browser.** `components.css:5396` opens a comment
whose prose contains `--ink*/--gold-*`; the `*/` closes the comment early, and the remaining
prose corrupts the selector of the next rule. That rule —
`.lum-amber-deep .arc-picker-panel` at `:5401`, re-pointing `--surface-2`, `--ink`, `--ink-2`,
`--ink-3`, `--ink-4`, `--border` — is **absent from the live CSSOM** (verified: a sweep of all
4,326 loaded rules finds `.arc-picker-panel` and a shared multi-selector rule, but no
`.lum-amber-deep .arc-picker-panel`). Its sibling at `:5402`,
`.lum-amber-deep .arc-picker-row:hover`, **does** survive. This is one instance, the only one
in the five files.

### 1.1 Every defined custom property

The complete table — name · value · file:line · scope — is §7 below (872 rows). Definitions
by file:

| File | definitions |
|---|---|
| `assets/theme.css` | 395 |
| `assets/components.css` | 328 |
| `docs/studio/universal-depth.css` | 61 |
| `assets/lumen-amber.css` | 50 |
| `assets/praxis-kit.css` | 38 |

Scopes, by frequency (top 12 of 60):

| Scope | definitions |
|---|---|
| `:root` | 383 |
| `.shelf.lum-amber-deep` | 43 |
| `.notebook.lum-amber-deep` | 42 |
| `[data-st-palette="muted"]` | 32 |
| `[data-st-palette="colorful"]` | 32 |
| `.home-page.lum-amber-deep` | 31 |
| `.pf-root` | 30 |
| `.bk-surface.lum-amber-deep` | 30 |
| `.arcs.lum-amber-deep` | 23 |
| `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` | 19 |
| `.account.lum-amber-ember` | 17 |
| `.lit-page` | 14 |

**383 of 872 definitions (43.9%) sit on `:root`.** The single largest non-`:root` scope group
is the `.lum-amber-deep` per-surface remap family. The `[data-ground="dark"]` remap is one
rule carrying 19 definitions, and it names `.app-nav`, `.yumi-bloom`, `.yumi-panel` and
`.spotlight-panel` as independent selectors so that chrome keeps its fill over any ground.

### 1.2 Consumers

Anchored so a token cannot match a longer name by prefix — the terminator must be `,` or `)`:

```
grep -ohE 'var\(--[A-Za-z0-9_-]+[,)]' assets/*.css js/*.js index.html
```

The space form `var( --x` occurs **0** times in the corpus, so the no-space anchor is
complete. Raw count **6,398** hits over 310 distinct names. Stripping comments (CSS block
comments; JS block and line comments, protecting `://` and quoted strings) gives **6,375**
hits over 304 names — i.e. **23 hits (0.36%) were prose inside comments**, affecting 6 names
(`--color-surface-2`, `--field-N`, `--subtheory-N`, `--subtheory-6`, `--subtheory-16`,
`--token`). Adding `docs/studio/universal-depth.css` — a loaded stylesheet the specified
corpus omits — raises the total to **6,422** over 321 names.

Top consumed tokens: `--ink` 348 · `--ink-3` 309 · `--font-mono` 287 · `--gold` 272 ·
`--font-serif` 253 · `--font-body` 247 · `--ink-2` 193 · `--lum-ink` 167 · `--border` 167 ·
`--lum-ink-2` 145 · `--lum-mono` 144 · `--lum-ink-3` 142 · `--lum-serif` 140 · `--lum-sans` 123.

**19 names are consumed but never defined in the five files.** 13 are runtime seams — values
written by `element.style.setProperty()` in JS (`--arc`, `--dot`, `--rail`, `--railtext`,
`--barfill`, `--bk-ch`, `--bk-cw`, `--tick`, `--lit`, `--reg`, `--cd`) — and 6 are
comment-prose artifacts. Three are consumed **with a fallback** and so degrade silently:
`var(--dark-ink, …)` (`components.css:16553`), `var(--lum-grad, …)` (`:14730`),
`var(--lum-line, …)` (`:16454`).

**Seven concat-built families exist** — a literal `var(--name)` grep scores every member
zero. The construction sites:

| Family | sites |
|---|---|
| `--subtheory-<n>` | `arc-constellation.js:506, 725, 1213, 1261, 1887` |
| `--register-<tradition>` and `--register-<tradition>-<band>` | `views.js:5039, 5728, 5815` |
| `--field-<n>` | `views.js:4793` |
| `--pig-<p>` and `--pig-<p>-edge` | `arc-constellation.js:640, 641`; `views.js:11699` |
| `--pf-hue-<n>` | `views.js:21363, 21364` |
| `--bk-field-<x>` | `views.js:12091` |

**125 tokens** that read as dead to a literal grep belong to these families and are live.

### 1.3 By namespace group

Consumers counted code-only, including `universal-depth.css`.

| Group | tokens | definitions | consumers | 0-consumer | re-defined |
|---|---|---|---|---|---|
| `--lum-*` | 25 | 111 | 1,582 | 0 | 18 |
| `--font-*` | 4 | 4 | 787 | 1 | 0 |
| `--gold*` | 12 | 42 | 560 | 0 | 5 |
| `--field-*` | 21 | 62 | 32 | 11 | 10 |
| `--ink*` | 4 | 52 | 934 | 0 | 4 |
| `--page*` | 2 | 2 | 49 | 0 | 0 |
| `--ground*` | 5 | 5 | 6 | 3 | 0 |
| `--surface*` | 4 | 17 | 132 | 0 | 3 |
| `--hour-*` | 7 | 7 | 13 | 0 | 0 |
| `--subtheory-*` | 32 | 104 | 4 | 29 | 32 |
| `--register-*` | 39 | 39 | 40 | 27 | 0 |
| `--tradition-*` | 11 | 11 | 4 | 8 | 0 |
| `--radius*` | 6 | 6 | 249 | 0 | 0 |
| `--shadow*` | 7 | 9 | 60 | 0 | 2 |
| `--glass*` | 6 | 8 | 24 | 1 | 2 |
| `--line*` | 4 | 9 | 145 | 0 | 1 |
| other | 269 | 384 | 1,760 | 73 | 44 |
| **TOTAL** | **458** | **872** | **6,381** | **153** | **121** |

(The consumer total here is 6,381, not 6,422: the 41 hits landing on the 19
consumed-but-undefined names have no row in this table.)

**Four tokens carry 52 definitions between them** — `--ink` 14, `--ink-3` 13, `--ink-2` 13,
`--ink-4` 12 — and `--gold` has 11, `--lum-gold` 9, `--border` 9. Re-pointing the ink family
per surface is the single most repeated move in the stylesheet.

**The 37 true-dead tokens**, none of which is concat-consumed:

`--arc-web-node-gap` · `--arc-web-spine-width` · `--dots` · `--field-presence` · `--font-script` ·
`--glass-bar` · `--grad-soft` · `--grid-cols` · `--ground-base` · `--ground-center` ·
`--ground-edge` · `--gutter` · `--margin-rule` · `--measure` · `--nav-blur` · `--nav-frost` ·
`--space-2xl` · `--space-2xs` · `--space-3xl` · `--space-3xs` · `--space-md` · `--space-sm` ·
`--space-xs` · `--thread-color-faint` · `--tradition-ground` · `--tradition-history-halo` ·
`--tradition-inner-light` · `--tradition-memoir-halo` · `--tradition-novel-halo` ·
`--tradition-place-halo` · `--tradition-poetry-halo` · `--tradition-practice-halo` ·
`--u-ground-2` · `--u-shot-1` · `--u-shot-2` · `--window-bg` · `--window-line`

Seven of the eight `--space-*` scale steps are unconsumed; `--nav-blur` and `--nav-frost`
survive as tokens after the canon §4-A no-blur ruling.

### 1.4 Literal-hex drift

A hex is counted as a **bypass** when it appears in a declaration whose property is *not* a
custom property — i.e. colour written straight into a rule rather than through a token.

| File | bypass hexes | hexes inside token definitions |
|---|---|---|
| `assets/components.css` | **102** | 206 |
| `assets/praxis-kit.css` | **64** | 0 |
| `assets/lumen-amber.css` | **9** | 40 |
| `docs/studio/universal-depth.css` | **7** | 24 |
| `assets/theme.css` | **0** | 197 |
| **TOTAL** | **182** | **467** |

`theme.css` has perfect token discipline — all 197 of its hexes are token values. CRAFT.md §4
sets the bypass target at **0**; the measured figure is **182**, across 58 distinct hexes.

Top 15 most-repeated bypass hexes:

| hex | count | token whose value this is |
|---|---|---|
| `#3d2807` | 14 | `--lum-gold-ink` |
| `#a8761a` | 13 | `--gold` |
| `#efe7d6` | 10 | `--card-2` |
| `#e3d8c1` | 10 | `--line` |
| `#978b6d` | 9 | `--ink-3` |
| `#855410` | 9 | `--gold-deep` |
| `#f2c25a` | 8 | `--field-1` |
| `#fff` | 7 | — |
| `#f4efe4` | 7 | `--paper` |
| `#c2603a` | 7 | `--danger` |
| `#fff4d6` | 6 | — |
| `#fffdf8` | 5 | `--card` |
| `#d9a441` | 5 | `--gold-hi` |
| `#645940` | 5 | `--ink-2` |
| `#f4e6c4` | 4 | — |

**12 of these 15 are the literal values of named Universal tokens.** The drift is
predominantly re-typing a token's value, not introducing new colour.

### 1.5 Font-family census

**1,204** `font-family` declarations across the five files. **Zero hard-coded family strings.**

| Value | declarations |
|---|---|
| `var(--font-mono)` | 286 |
| `var(--font-serif)` | 248 |
| `var(--font-body)` | 243 |
| `var(--lum-mono)` | 142 |
| `var(--lum-serif)` | 139 |
| `var(--lum-sans)` | 123 |
| other `var()` (`--ff-*` kit aliases ×19, `--mono` ×1) | 20 |
| `inherit`/`unset` | 3 |

By file: `components.css` 1,169 · `praxis-kit.css` 20 · `lumen-amber.css` 13 · `theme.css` 1 ·
`universal-depth.css` 1.

**Two parallel font systems are defined, with different stacks:**

| Role | theme.css | lumen-amber.css |
|---|---|---|
| serif | `--font-serif` = `Cormorant Garamond, Georgia, Times New Roman, serif` (`:14`) | `--lum-serif` = `Cormorant Garamond, Georgia, serif` (`:52`) |
| sans | `--font-body` = `-apple-system, BlinkMacSystemFont, SF Pro Text, Segoe UI, DM Sans, sans-serif` (`:15`) | `--lum-sans` = `DM Sans, system-ui, sans-serif` (`:53`) |
| mono | `--font-mono` = `DM Mono, SF Mono, Menlo, Consolas, monospace` (`:16`) | `--lum-mono` = `DM Mono, ui-monospace, monospace` (`:54`) |

**`--font-body` places DM Sans FIFTH**, behind four system faces, so every element using it
resolves to the platform UI font (Segoe UI on this machine), never to DM Sans. `--lum-sans`
places DM Sans first. The two sans tokens therefore render different typefaces from the same
loaded webfont set — confirmed computed in §2 and §3.1. `CLAUDE.md`'s design canon §1 states
`--font-body` = `'DM Sans', -apple-system, …` and asserts "These three stacks DO match live
`theme.css`"; that assertion does not hold at this HEAD (drift D4).

`--font-script` is defined once (`components.css:9742`, a CJK-capable Cormorant stack) and has
**0** consumers.

**Hard-coded stacks in JS:** `js/arc-constellation.js` emits 12 `font-family=` attributes into
SVG, from 7 literal Cormorant strings — the canonical one at `:1364`, where a local `serif`
variable is assigned the literal stack `Cormorant Garamond, Georgia, serif`. The constellation
renderer's type does not read the font tokens. No other JS file emits a `font-family`.

### 1.6 Radius census

**683** `border-radius` declarations, **61** distinct values. **324 via `var()` / 359 literal
(52.6% literal).**

| Value | count | | Value | count |
|---|---|---|---|---|
| `50%` | 109 | | `8px` | 18 |
| `var(--radius-pill)` | 89 | | `0` | 16 |
| `var(--radius-md)` | 59 | | `3px` | 11 |
| `var(--lum-r-pill)` | 45 | | `14px` | 9 |
| `999px` | 41 | | `16px` | 8 |
| `var(--radius-sm)` | 35 | | `18px` | 7 |
| `var(--radius-lg)` | 35 | | `4px` | 6 |
| `var(--lum-r-pill,999px)` | 32 | | `11px` | 6 |
| `10px` | 26 | | `var(--lum-r-card)` | 5 |
| `12px` | 25 | | `var(--card-radius)` | 4 |
| `2px` | 20 | | `3px 6px 6px 3px` | 4 |

By file: `components.css` 648 · `lumen-amber.css` 16 · `praxis-kit.css` 14 ·
`universal-depth.css` 5 · `theme.css` 0. The pill radius is expressed four ways —
`var(--radius-pill)`, `var(--lum-r-pill)`, `var(--lum-r-pill,999px)` and bare `999px` —
totalling 207 declarations.

---
## 2 · Surface census (computed, in the running app)

Every figure below is `getComputedStyle` / DOM geometry read from the running app, not a
source grep. Screenshots corroborate; they are not the measurement. All 15 routes were
**reached** — 0 unreachable. 30 route captures + 1 preflight = **31 PNGs**, 18,497,589 B.

Sequence per capture, at both widths (see §5 for why this order and not the rig README's):
reload → stub auth + intro seen-flags + force-settle → `renderRoute()` → measure → capture.
`Page.captureScreenshot` with `captureBeyondViewport:false`, so every capture is
**viewport-height**, dated 2026-09-19 against HEAD `6c1c0a2`.

Two notes that apply to every row:

- **`body` is transparent on every route.** The page ground is painted by a
  `position:fixed` `body::before` (a colour plus a repeating-linear-gradient) with a
  `body::after` SVG data-URI grain over it. A reading of `body { background-color }` alone
  returns `rgba(0, 0, 0, 0)` and says nothing about the ground; the pseudo-element is the
  ground mechanism.
- **The seeded workspace belongs to `__praxis_seed__`, not to `d0tester`**, so "your own"
  collections read empty while the worked example renders.

### 2.1 Route reachability

| Route | Reached | Resolved hash |
|---|---|---|
| `#home` | ✅ | `#home` |
| `#books` | ✅ | `#books` |
| `#arcs` | ✅ | `#arcs` |
| `#notebook` | ✅ | `#notebook` (no `parts[0]` branch — the router's default fall-through) |
| `#scan` | ✅ | `#scan` |
| `#profile` | ✅ | `#profile` |
| `#commons` | ✅ | `#commons` |
| `#yumi-sees` | ✅ | `#yumi-sees` |
| `#about` | ✅ | `#about` |
| arc detail | ✅ | `#arc/arc_1789849535248_309553` (resolved at runtime via `rigIds()`) |
| sub-theory | ✅ | `#subtheory/subtheory_1789849535249_526163` |
| book detail | ✅ | `#book/book_1789849535248_945454` |
| Yumi panel on `#home` | ✅ | `#home` + `.yumi-panel-open` |
| `#home` signed-out | ✅ | `#home` |
| `#about` signed-out | ✅ | `#about` |

**Opening the Yumi panel fires 0 network requests and 0 proxy calls.** Measured by diffing
`performance.getEntriesByType('resource')` across the open, at both widths:
`{"panelOpen":true,"newRequests":0,"proxyCalls":[]}`. No message was sent to Yumi.

Seed ids are per-origin. Chrome ran on a fresh profile and re-seeded with ids different from
the Browser pane's, which is why all three detail routes resolve their hash at runtime through
`rigIds()` rather than from a constant.

### 2.2 Per-route measurements

### home — `#home`

Captures: `.claude/rig/captures/v1/home-1360.png` (674KB) · `.claude/rig/captures/v1/home-390.png` (762KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `home-page lum-amber-deep home-composed` | `home-page lum-amber-deep home-composed` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h2 `.home-welcome-title` — "Cormorant Garamond", Georgia, serif / 34px / 500 | 28px |
| paragraph | "Cormorant Garamond", Georgia, serif / 16px | 16px |
| meta/label | p `.home-sectlabel` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 13px | 13px |
| primary button | button `.seg-opt is-on` — "DM Sans", system-ui, sans-serif / 12.5px | 12.5px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 11 | loaded / 10 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(242, 194, 90), rgb(224, 168, 56))` | — |
| button color | `rgb(61, 40, 7)` | `rgb(61, 40, 7)` |
| top background-colors (≥24×24px) | `rgb(239, 231, 214)`×5 · `rgb(253, 249, 238)`×2 · `rgba(255, 255, 255, 0.06)`×1 | (3 distinct) |
| **e. radius** distinct computed | `3px 6px 6px 3px`×5 · `999px`×3 · `15px`×2 · `12px`×1 | (4 distinct) |
| **f. width** widest prose (rig.ch) | 61.1ch | — |
| container max-width | `1560px` (rendered 1345px) | `1080px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### books — `#books`

Captures: `.claude/rig/captures/v1/books-1360.png` (264KB) · `.claude/rig/captures/v1/books-390.png` (333KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `shelf lum-amber-deep` | `shelf lum-amber-deep` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgb(253, 249, 238)` | `rgb(253, 249, 238)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h1 `.` — "Cormorant Garamond", Georgia, "Times New Roman", serif / 38px / 500 | 32px |
| paragraph | "DM Mono", "SF Mono", Menlo, Consolas, monospace / 10.5px | 10.5px |
| meta/label | span `.shelf-book-meta` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 16px | 16px |
| primary button | button `.is-on` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 13px | 13px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 11 | loaded / 10 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(242, 194, 90) 0%, rgb(217, 164, 65) 60%, rgb(168, 118, 26) 100%)` | — |
| button color | `rgb(61, 40, 7)` | `rgb(61, 40, 7)` |
| top background-colors (≥24×24px) | `rgb(74, 63, 77)`×10 · `rgb(239, 231, 214)`×3 · `rgb(253, 249, 238)`×1 · `rgb(255, 253, 248)`×1 | (7 distinct) |
| **e. radius** distinct computed | `2px 4px 4px 2px`×10 · `999px`×7 · `15px`×1 · `15px 15px 0px 0px`×1 | (5 distinct) |
| **f. width** widest prose (rig.ch) | no prose leaf >= 60 chars | — |
| container max-width | `1920px` (rendered 1309px) | `1080px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### arcs — `#arcs`

Captures: `.claude/rig/captures/v1/arcs-1360.png` (453KB) · `.claude/rig/captures/v1/arcs-390.png` (499KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `arcs lum-amber-deep` | `arcs lum-amber-deep` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgb(244, 239, 228)` | `rgb(244, 239, 228)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h1 `.arcs-title` — "Cormorant Garamond", Georgia, "Times New Roman", serif / 46px / 700 | 30px |
| paragraph | "Cormorant Garamond", Georgia, "Times New Roman", serif / 18px | 18px |
| meta/label | div `.eyebrow` — "DM Mono", "SF Mono", Menlo, Consolas, monospace / 11px | 11px |
| primary button | button `.arcs-seg-btn is-on` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 12px | 12px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 10 | loaded / 8 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(242, 194, 90), rgb(168, 118, 26))` | — |
| button color | `rgb(61, 40, 7)` | `rgb(61, 40, 7)` |
| top background-colors (≥24×24px) | `rgb(255, 253, 248)`×2 · `rgb(244, 239, 228)`×1 · `rgb(239, 231, 214)`×1 | (3 distinct) |
| **e. radius** distinct computed | `999px`×4 · `16px`×3 · `12px`×2 | (3 distinct) |
| **f. width** widest prose (rig.ch) | 66ch | — |
| container max-width | `1360px` (rendered 1297px) | `1080px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### notebook — `#notebook`

Captures: `.claude/rig/captures/v1/notebook-1360.png` (234KB) · `.claude/rig/captures/v1/notebook-390.png` (385KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `notebook lum-amber-deep` | `notebook lum-amber-deep` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgb(253, 249, 238)` | `rgb(253, 249, 238)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h1 `.notebook-title` — "Cormorant Garamond", Georgia, serif / 30px / 500 | 30px |
| paragraph | "DM Sans", system-ui, sans-serif / 14px | 14px |
| meta/label | p `.eyebrow` — "DM Mono", ui-monospace, monospace / 12px | 12px |
| primary button | button `.nb-tab is-on` — "DM Sans", system-ui, sans-serif / 12.5px | 12.5px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 8 | loaded / 8 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(242, 194, 90), rgb(224, 168, 56))` | — |
| button color | `rgb(61, 40, 7)` | `rgb(61, 40, 7)` |
| top background-colors (≥24×24px) | `rgb(253, 249, 238)`×1 · `rgb(244, 236, 219)`×1 | (2 distinct) |
| **e. radius** distinct computed | `999px`×3 · `15px`×1 · `18px`×1 · `14px`×1 · `50%`×1 | (5 distinct) |
| **f. width** widest prose (rig.ch) | 71ch | — |
| container max-width | `1360px` (rendered 1309px) | `900px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### scan — `#scan`

Captures: `.claude/rig/captures/v1/scan-1360.png` (107KB) · `.claude/rig/captures/v1/scan-390.png` (114KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1360 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `bright` | `bright` |
| route root | `scan-surface` | `scan-surface` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgb(12, 10, 7)` | `rgb(12, 10, 7)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h2 `.` — "Cormorant Garamond", Georgia, "Times New Roman", serif / 23px / 600 | 23px |
| paragraph | -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 14px | 14px |
| meta/label | div `.scan-vd-meta` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 16px | 16px |
| primary button | button `.scan-vf-back` — Arial / 18px | 18px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 8 | loaded / 7 |
| **d. color** button background-color | `rgba(20, 14, 7, 0.62)` | `rgba(20, 14, 7, 0.62)` |
| button background-image | `none` | — |
| button color | `rgb(246, 239, 224)` | `rgb(246, 239, 224)` |
| top background-colors (≥24×24px) | `rgb(12, 10, 7)`×3 · `rgba(20, 14, 7, 0.62)`×2 · `rgb(253, 249, 238)`×2 · `rgba(246, 239, 224, 0.16)`×1 · `rgb(246, 239, 224)`×1 · `rgba(36, 23, 16, 0.05)`×1 · `rgba(28, 20, 10, 0.82)`×1 | (7 distinct) |
| **e. radius** distinct computed | `50%`×5 · `10px`×4 · `999px`×3 · `8px 0px 0px`×1 · `0px 8px 0px 0px`×1 · `0px 0px 0px 8px`×1 · `0px 0px 8px`×1 · `22px 22px 0px 0px`×1 · `2px 5px 5px 2px`×1 · `22px`×1 · `14px`×1 · `12px`×1 | (12 distinct) |
| **f. width** widest prose (rig.ch) | 41.9ch | — |
| container max-width | `520px` (rendered 520px) | `520px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### profile — `#profile`

Captures: `.claude/rig/captures/v1/profile-1360.png` (266KB) · `.claude/rig/captures/v1/profile-390.png` (328KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `pf-root` | `pf-root` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgb(244, 239, 228)` | `rgb(244, 239, 228)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h2 `.rm-title` — "Cormorant Garamond", Georgia, "Times New Roman", serif / 24px / 600 | 24px |
| paragraph | "Cormorant Garamond", Georgia, "Times New Roman", serif / 24px | 22px |
| meta/label | div `.pf-eyebrow` — "DM Mono", "SF Mono", Menlo, Consolas, monospace / 11px | 11px |
| primary button | button `.pf-btn ghost` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 12px | 12px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 7 | loaded / 7 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `none` | — |
| button color | `rgb(151, 139, 109)` | `rgb(151, 139, 109)` |
| top background-colors (≥24×24px) | `rgb(255, 253, 248)`×18 · `rgb(239, 231, 214)`×5 · `rgb(46, 52, 70)`×4 · `rgb(244, 239, 228)`×1 · `rgba(0, 0, 0, 0.16)`×1 | (5 distinct) |
| **e. radius** distinct computed | `16px`×13 · `8px`×9 · `999px`×8 · `10px`×5 · `50%`×1 | (5 distinct) |
| **f. width** widest prose (rig.ch) | 222.6ch | — |
| container max-width | `1400px` (rendered 1345px) | `603.75px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### commons — `#commons`

Captures: `.claude/rig/captures/v1/commons-1360.png` (780KB) · `.claude/rig/captures/v1/commons-390.png` (810KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1360 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `dsc-root lum-amber-ember` | `dsc-root lum-amber-ember` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h1 `.dsc-h1` — "Cormorant Garamond", Georgia, serif / 34px / 600 | 28px |
| paragraph | "DM Sans", system-ui, sans-serif / 14px | 14px |
| meta/label | p `.eyebrow` — "DM Mono", ui-monospace, monospace / 10px | 10px |
| primary button | button `.dsc-turn` — "DM Sans", system-ui, sans-serif / 12.5px | 12.5px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 7 | loaded / 7 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(255, 231, 154), rgb(255, 206, 74))` | — |
| button color | `rgb(36, 26, 2)` | `rgb(36, 26, 2)` |
| top background-colors (≥24×24px) |  | (0 distinct) |
| **e. radius** distinct computed | `999px`×1 | (1 distinct) |
| **f. width** widest prose (rig.ch) | 58.5ch | — |
| container max-width | `900px` (rendered 940px) | `900px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### yumi-sees — `#yumi-sees`

Captures: `.claude/rig/captures/v1/yumi-sees-1360.png` (333KB) · `.claude/rig/captures/v1/yumi-sees-390.png` (361KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `yumi-sees-page` | `yumi-sees-page` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h2 `.transparency-title` — "DM Mono", "SF Mono", Menlo, Consolas, monospace / 10.5px / 500 | 10.5px |
| paragraph | "Cormorant Garamond", Georgia, "Times New Roman", serif / 17px | 17px |
| meta/label | h3 `.transparency-section-label` — "DM Mono", "SF Mono", Menlo, Consolas, monospace / 9.5px | 9.5px |
| primary button |  `.` —  /  |  |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 7 | loaded / 7 |
| **d. color** button background-color | `` | `` |
| button background-image | `` | — |
| button color | `` | `` |
| top background-colors (≥24×24px) | `rgb(252, 246, 232)`×4 · `color(srgb 0.942627 0.960588 0.944824)`×1 | (2 distinct) |
| **e. radius** distinct computed | `16px`×5 | (1 distinct) |
| **f. width** widest prose (rig.ch) | 77.2ch | — |
| container max-width | `1208px` (rendered 1272px) | `1080px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### about — `#about`

Captures: `.claude/rig/captures/v1/about-1360.png` (793KB) · `.claude/rig/captures/v1/about-390.png` (896KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `about` | `about` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h1 `.about-reveal about-reveal-2` — "Cormorant Garamond", Georgia, "Times New Roman", serif / 52px / 600 | 38px |
| paragraph | -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 15px | 15px |
| meta/label | div `.about-spine-eyebrow` — "DM Mono", "SF Mono", Menlo, Consolas, monospace / 10px | 16px |
| primary button | button `.about-spine-link is-on` — "DM Mono", "SF Mono", Menlo, Consolas, monospace / 11px | 10px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 8 | loaded / 8 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgb(244, 239, 228)` |
| button background-image | `none` | — |
| button color | `rgb(199, 154, 58)` | `rgb(28, 18, 9)` |
| top background-colors (≥24×24px) | `rgb(252, 246, 232)`×13 · `rgb(244, 239, 228)`×3 | (2 distinct) |
| **e. radius** distinct computed | `14px`×20 · `10px`×13 · `999px`×10 · `20px`×5 · `12px`×4 · `22px`×2 | (6 distinct) |
| **f. width** widest prose (rig.ch) | 140ch | — |
| container max-width | `1160px` (rendered 1208px) | `640px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### arc-detail — `#arc/arc_1789849535248_309553`

Captures: `.claude/rig/captures/v1/arc-detail-1360.png` (313KB) · `.claude/rig/captures/v1/arc-detail-390.png` (498KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `arcfield af-world` | `arcfield af-world` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h1 `.af-q` — "Cormorant Garamond", Georgia, "Times New Roman", serif / 37px / 500 | 26px |
| paragraph | "DM Mono", "SF Mono", Menlo, Consolas, monospace / 10px | 10px |
| meta/label | text `.[object SVGAnimatedString]` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 6.92px | 22.73px |
| primary button | button `.af-btn af-btn-primary` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 13.5px | 13.5px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 10 | loaded / 10 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(217, 164, 65), rgb(223, 183, 89))` | — |
| button color | `rgb(61, 40, 7)` | `rgb(61, 40, 7)` |
| top background-colors (≥24×24px) | `rgb(253, 249, 238)`×1 · `rgba(255, 255, 255, 0.5)`×1 | (2 distinct) |
| **e. radius** distinct computed | `2px 3px 3px 2px`×5 · `999px`×2 · `15px`×1 · `16px`×1 | (4 distinct) |
| **f. width** widest prose (rig.ch) | no prose leaf >= 60 chars | — |
| container max-width | `1180px` (rendered 1180px) | `1180px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### subtheory — `#subtheory/subtheory_1789849535249_526163`

Captures: `.claude/rig/captures/v1/subtheory-1360.png` (785KB) · `.claude/rig/captures/v1/subtheory-390.png` (1064KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `st-page lum-amber-deep` | `st-page lum-amber-deep` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h2 `.subtheory-readonly-header` — "Cormorant Garamond", Georgia, "Times New Roman", serif / 30px / 500 | 30px |
| paragraph | "Cormorant Garamond", Georgia, "Times New Roman", serif / 20px | 20px |
| meta/label |  `.` —  /  |  |
| primary button |  `.` —  /  |  |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 10 | loaded / 10 |
| **d. color** button background-color | `` | `` |
| button background-image | `` | — |
| button color | `` | `` |
| top background-colors (≥24×24px) |  | (0 distinct) |
| **e. radius** distinct computed |  | (0 distinct) |
| **f. width** widest prose (rig.ch) | 88.1ch | — |
| container max-width | `747px` (rendered 747px) | `` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### book-detail — `#book/book_1789849535248_945454`

Captures: `.claude/rig/captures/v1/book-detail-1360.png` (509KB) · `.claude/rig/captures/v1/book-detail-390.png` (584KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `bk-surface lum-amber-deep` | `bk-surface lum-amber-deep` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgb(244, 239, 228)` | `rgb(244, 239, 228)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h2 `.bk-sechead` — "Cormorant Garamond", Georgia, serif / 23px / 500 | 23px |
| paragraph | "Cormorant Garamond", Georgia, serif / 16px | 16px |
| meta/label | div `.bk-controls bk-meta-line` — "DM Sans", system-ui, sans-serif / 16px | 16px |
| primary button | button `.rs-opt on` — "DM Sans", system-ui, sans-serif / 12.5px | 12.5px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 10 | loaded / 10 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(242, 194, 90), rgb(224, 168, 56))` | — |
| button color | `rgb(61, 40, 7)` | `rgb(61, 40, 7)` |
| top background-colors (≥24×24px) | `rgb(239, 231, 214)`×3 · `rgb(244, 239, 228)`×1 · `rgb(252, 246, 232)`×1 | (3 distinct) |
| **e. radius** distinct computed | `999px`×12 · `16px`×5 · `3px 7px 7px 3px`×2 · `14px`×1 | (4 distinct) |
| **f. width** widest prose (rig.ch) | 72ch | — |
| container max-width | `1200px` (rendered 1200px) | `` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### yumi-panel — `#home`

Captures: `.claude/rig/captures/v1/yumi-panel-1360.png` (749KB) · `.claude/rig/captures/v1/yumi-panel-390.png` (908KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `home-page lum-amber-deep home-composed` | `home-page lum-amber-deep home-composed` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h2 `.home-welcome-title` — "Cormorant Garamond", Georgia, serif / 34px / 500 | 28px |
| paragraph | "Cormorant Garamond", Georgia, serif / 16px | 16px |
| meta/label | p `.home-sectlabel` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 13px | 13px |
| primary button | button `.seg-opt is-on` — "DM Sans", system-ui, sans-serif / 12.5px | 12.5px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 10 | loaded / 10 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(242, 194, 90), rgb(224, 168, 56))` | — |
| button color | `rgb(61, 40, 7)` | `rgb(61, 40, 7)` |
| top background-colors (≥24×24px) | `rgb(239, 231, 214)`×5 · `rgb(253, 249, 238)`×2 · `rgba(255, 255, 255, 0.06)`×1 | (3 distinct) |
| **e. radius** distinct computed | `3px 6px 6px 3px`×5 · `999px`×3 · `15px`×2 · `12px`×1 | (4 distinct) |
| **f. width** widest prose (rig.ch) | 61.1ch | — |
| container max-width | `1560px` (rendered 1345px) | `1080px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### home-signedout — `#home`

Captures: `.claude/rig/captures/v1/home-signedout-1360.png` (933KB) · `.claude/rig/captures/v1/home-signedout-390.png` (880KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `home-page lum-amber-deep` | `home-page lum-amber-deep` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h2 `.` — "DM Sans", system-ui, sans-serif / 24px / 700 | 24px |
| paragraph | "DM Sans", system-ui, sans-serif / 16px | 16px |
| meta/label |  `.` —  /  |  |
| primary button | button `.btn btn-primary` — -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 14px | 14px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 11 | loaded / 8 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| button background-image | `linear-gradient(rgb(242, 194, 90) 0%, rgb(217, 164, 65) 40%, rgb(199, 154, 58) 100%)` | — |
| button color | `rgb(61, 40, 7)` | `rgb(61, 40, 7)` |
| top background-colors (≥24×24px) |  | (0 distinct) |
| **e. radius** distinct computed | `999px`×1 | (1 distinct) |
| **f. width** widest prose (rig.ch) | 94.3ch | — |
| container max-width | `1080px` (rendered 1080px) | `1080px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |

### about-signedout — `#about`

Captures: `.claude/rig/captures/v1/about-signedout-1360.png` (883KB) · `.claude/rig/captures/v1/about-signedout-390.png` (892KB)

| | 1360 | 390 |
|---|---|---|
| viewport (iw / clientWidth / dpr) | 1360 / 1345 / 1 | 390 / 390 / 2 |
| **b. ground** — body[data-ground] | `dark` | `dark` |
| route root | `about` | `about` |
| body background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| route-root background-color | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `.lum-amber-deep` present / `.galaxy-night` | True / False | True / False |
| **c. type** heading | h1 `.about-reveal about-reveal-2` — "Cormorant Garamond", Georgia, "Times New Roman", serif / 52px / 600 | 38px |
| paragraph | -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif / 15px | 15px |
| meta/label | div `.about-spine-eyebrow` — "DM Mono", "SF Mono", Menlo, Consolas, monospace / 10px | 16px |
| primary button | button `.about-spine-link is-on` — "DM Mono", "SF Mono", Menlo, Consolas, monospace / 11px | 10px |
| **c2. fonts** `document.fonts.check()` | Cormorant=True · DM Sans=True · DM Mono=True | same |
| `document.fonts` status / loaded entries | loaded / 9 | loaded / 8 |
| **d. color** button background-color | `rgba(0, 0, 0, 0)` | `rgb(244, 239, 228)` |
| button background-image | `none` | — |
| button color | `rgb(199, 154, 58)` | `rgb(28, 18, 9)` |
| top background-colors (≥24×24px) | `rgb(252, 246, 232)`×13 · `rgb(244, 239, 228)`×3 | (2 distinct) |
| **e. radius** distinct computed | `14px`×20 · `10px`×13 · `999px`×10 · `20px`×5 · `12px`×4 · `22px`×2 | (6 distinct) |
| **f. width** widest prose (rig.ch) | 140ch | — |
| container max-width | `1160px` (rendered 1208px) | `640px` |
| rig.hscroll() overflow | 0 | 0 |
| intro panel present | False | False |


### 2.3 Yumi census

`--lum-cyan` is defined **twice, with different values**:

| Definition | Value | Scope |
|---|---|---|
| `assets/lumen-amber.css:46` | `#7fd0f0` | `:root` — commented "Yumi — always" |
| `assets/components.css:14205` | `#256b80` | `.notebook.lum-amber-deep` — commented "registers deepened so the spine + pill text hold AA on paper" |

`components.css` loads after `lumen-amber.css`, so on the Notebook surface Yumi's cyan
resolves to the deeper `#256b80`; everywhere else `getComputedStyle(document.documentElement)`
returns `#7fd0f0`. The sweep below matched both values.

`var(--lum-cyan)` consumers: `components.css` 41 · `lumen-amber.css` 1 · `views.js` 1.

**Sweep — every element whose computed `color`, `background-color`, `border-*-color`, `fill`
or `stroke` equals either value:**

`#home` with the Yumi panel open — **6 elements**, all Yumi affordances:

| Element | Property |
|---|---|
| `span.home-yumi-dot` (×2) | `background-color` = `#7fd0f0` |
| `button.yumi-panel-sight` ("What Yumi sees") | `color` = `#7fd0f0` |
| `button.yumi-mic-btn.yumi-icon-btn` | `color` = `#7fd0f0` |
| `svg` (the glyph) | `color` + all four `border-*-color` = `#7fd0f0` |
| `path` (the glyph) | `color`, `border-*-color`, **`fill`** = `#7fd0f0` |

`#yumi-sees` — **4 elements**, all of them the persistent panel chrome (`yumi-panel-sight`,
`yumi-mic-btn`, and the glyph `svg`/`path`). **The `#yumi-sees` page body itself contributes
zero cyan-bearing elements.**

No element outside Yumi's own affordances carried either value on either surface.

**`yumiGlyph()` / `yumiGlyphNode()` call sites** — definitions at `js/yumi-ui.js:89` and
`:142`; 12 call sites:

| File:line | Call |
|---|---|
| `js/intros.js:133` | `yumiGlyph(sz \|\| 15, true)` |
| `js/views.js:2244` | `yumiGlyphNode(56)` |
| `js/views.js:2270` | `yumiGlyphNode(56)` |
| `js/views.js:5505` | `yumiGlyphNode(22, 'firstshelf-offer-orb')` |
| `js/views.js:10730` | `yumiGlyphNode(26, 'scan-wk-orb')` |
| `js/yumi-ui.js:147` | `yumiGlyph(size, false)` |
| `js/yumi-ui.js:160` | `yumiGlyphNode(32, 'yumi-glyph-block')` |
| `js/yumi-ui.js:1750` | `yumiGlyphNode(16, 'yumi-glyph-lead')` |
| `js/yumi-ui.js:1814` | `yumiGlyphNode(16, 'yumi-glyph-lead')` |
| `js/yumi-ui.js:1913` | `yumiGlyphNode(20, 'yumi-glyph-lead yumi-glyph-pulse')` |
| `js/yumi-ui.js:2043` | `yumiGlyph(40, false)` |

**Yumi panel container**, computed at 1360 with the panel open:

| Property | Value |
|---|---|
| `background-color` | `rgba(0, 0, 0, 0)` |
| `background-image` | `radial-gradient(72% 56% at 16% 4%, rgba(255, 190, 80, 0.42) 0%, …)` |
| `backdrop-filter` | **`none`** — canon §4-A (no blur on panel chrome) holds |
| `border` | `1px solid rgba(255, 236, 200, 0.28)` |
| `border-radius` | `10px` |

**Yumi greeting** — `.yumi-greeting`, text "It is nice to be in your presence today. What
theory have you made sin…":

| Property | Value |
|---|---|
| `font-family` | `"Cormorant Garamond", Georgia, serif` (= `--lum-serif`) |
| `font-size` | `46px` |
| `font-weight` | `400` |
| `font-style` | `normal` |
| `color` | `rgb(232, 220, 196)` |

---

## 3 · Cross-reference

### 3.1 Route × ground × type × button × radius (1360; 390 noted where different)

| Route | ground | route root | display family | body family | primary button bg | button family | radii (n) | widest prose |
|---|---|---|---|---|---|---|---|---|
| `#home` | dark | `.home-page.lum-amber-deep.home-composed` | Cormorant (`--lum-serif`) | Cormorant (`--lum-serif`) | gradient `rgb(242,194,90)→rgb(224,168,56)` | DM Sans (`--lum-sans`) | 4 | 61.1ch |
| `#books` | dark | `.shelf.lum-amber-deep` | Cormorant (`--font-serif`) | DM Mono (`--font-mono`) | gradient | SYSTEM (`--font-body`) | 4 | no leaf ≥60ch |
| `#arcs` | dark | `.arcs.lum-amber-deep` | Cormorant (`--font-serif`) | Cormorant (`--font-serif`) | gradient | SYSTEM (`--font-body`) | 3 | 66.0ch |
| `#notebook` | dark | `.notebook.lum-amber-deep` | Cormorant (`--lum-serif`) | DM Sans (`--lum-sans`) | gradient | DM Sans (`--lum-sans`) | 5 | 71.0ch |
| `#scan` | **bright** | `.scan-surface` | Cormorant (`--font-serif`) | SYSTEM (`--font-body`) | `rgba(20,14,7,0.62)` (no gradient) | **Arial (UA default)** | 12 | 41.9ch |
| `#profile` | dark | `.pf-root` | Cormorant (`--font-serif`) | Cormorant (`--font-serif`) | none found | SYSTEM (`--font-body`) | 5 | **222.6ch** |
| `#commons` | dark | `.dsc-root.lum-amber-ember` | Cormorant (`--lum-serif`) | DM Sans (`--lum-sans`) | gradient | DM Sans (`--lum-sans`) | 1 | 58.5ch |
| `#yumi-sees` | dark | `.yumi-sees-page` | **DM Mono** (`--font-mono`) | Cormorant (`--font-serif`) | none found | — | 1 | 77.2ch |
| `#about` | dark | `.about` | Cormorant (`--font-serif`) | SYSTEM (`--font-body`) | none (no gradient) | DM Mono (`--font-mono`) | 6 | **140.0ch** |
| arc detail | dark | `.arcfield.af-world` | Cormorant (`--font-serif`) | DM Mono (`--font-mono`) | gradient | SYSTEM (`--font-body`) | 4 | no leaf ≥60ch |
| sub-theory | dark | `.st-page.lum-amber-deep` | Cormorant (`--font-serif`) | Cormorant (`--font-serif`) | none found | — | **0** | **88.1ch** |
| book detail | dark | `.bk-surface.lum-amber-deep` | Cormorant (`--lum-serif`) | Cormorant (`--lum-serif`) | gradient | DM Sans (`--lum-sans`) | 4 | 72.0ch |
| Yumi panel | dark | `.home-page.lum-amber-deep.home-composed` | Cormorant (`--lum-serif`) | Cormorant (`--lum-serif`) | gradient | DM Sans (`--lum-sans`) | 4 | 61.1ch |
| `#home` signed-out | dark | `.home-page.lum-amber-deep` | **DM Sans** (`--lum-sans`) | DM Sans (`--lum-sans`) | gradient | SYSTEM (`--font-body`) | 1 | **94.3ch** |
| `#about` signed-out | dark | `.about` | Cormorant (`--font-serif`) | SYSTEM (`--font-body`) | none | DM Mono (`--font-mono`) | 6 | **140.0ch** |

At 390 the ground, root class, family assignments and button treatments are **identical on
every route**; what changes is font-size and the radius/background counts (fewer elements
meet the ≥24×24px sampling floor). `rig.hscroll()` overflow is **0 on all 15 routes at both
widths**. `document.fonts.check()` returns **true for all three families on all 15 routes at
both widths**, with 11 loaded faces (`document.fonts.status` = `loaded`): Cormorant Garamond
italic 400/500 and normal 400/500/600, DM Mono normal 400/500, DM Sans normal 400/500/600/700.

"SYSTEM (`--font-body`)" means the computed stack was
`-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "DM Sans", sans-serif` — the
DM Sans webfont is loaded and available but sits fifth, so it does not paint.

### 3.2 Token-group consumption per surface

Method: for every declaration in the five stylesheets, the enclosing selector is tested for
the surface's root class; matching declarations have their values classified by token
namespace, plus literal hexes. **Limits, stated:** this sees only rules whose selector text
names the root class. Rules that style a surface's descendants through a generic class
(`.card`, `.seg-opt`, `.empty-state`), inherited values, and `:root` tokens reaching the
surface through the cascade are **not** counted. It is a measure of surface-scoped authorship,
not of everything that paints the surface.

| Surface | rules | `--lum-*` | `--page`/`--ink` | `--gold*` | `--font-*` | structural | other | literal hex |
|---|---|---|---|---|---|---|---|---|
| `#home` | 487 | 70 | 3 | 28 | 2 | 0 | 34 | 32 |
| `#books` | 2,086 | 127 | 145 | 62 | 79 | 77 | 172 | 42 |
| `#arcs` | 350 | 0 | 25 | 14 | 22 | 24 | 20 | 29 |
| `#notebook` | 2,091 | 198 | 113 | 44 | 94 | 92 | 180 | 53 |
| `#scan` | 10 | 0 | 0 | 0 | 1 | 0 | 2 | 0 |
| `#profile` | 56 | 0 | 1 | 1 | 0 | 3 | 0 | 31 |
| `#commons` | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `#yumi-sees` | 25 | 0 | 1 | 0 | 0 | 2 | 5 | 0 |
| `#about` | 391 | 8 | 29 | 25 | 21 | 14 | 11 | 0 |
| arc detail | 896 | 153 | 30 | 14 | 25 | 16 | 50 | 25 |
| sub-theory | 506 | 73 | 10 | 3 | 8 | 10 | 13 | 13 |
| book detail | 376 | 78 | 0 | 0 | 0 | 0 | 53 | 46 |
| Yumi panel | 247 | 64 | 6 | 11 | 6 | 15 | 37 | 1 |

`#books` and `#notebook` carry 2,086 and 2,091 surface-scoped declarations — together **40.9%
of all 10,216** counted here. `#commons` (4) and `#scan` (10) are authored almost entirely
through shared classes rather than surface-scoped rules.

### 3.3 Two systems on one surface

**By authorship — 7 of 13 surfaces carry both a `--lum-*` consumer and a `--page`/`--ink`
consumer in their own scoped rules:** `#home`, `#books`, `#notebook`, arc detail, sub-theory,
book detail, Yumi panel. Not both: `#arcs` (page/ink only), `#profile`, `#yumi-sees`
(page/ink only), `#scan`, `#commons` (neither), book detail (`--lum-*` only).

**By what actually paints — the stronger test.** The two font systems declare *different
fallback stacks*, so a computed `font-family` string names which token resolved. Across the
four sampled elements per surface (heading, paragraph, meta, primary button):

| Surface | heading | paragraph | meta | button | mixes systems? |
|---|---|---|---|---|---|
| `#home` | lumen | lumen | **theme** | lumen | **YES** (theme ×1 / lumen ×3) |
| `#books` | theme | theme | theme | theme | no |
| `#arcs` | theme | theme | theme | theme | no |
| `#notebook` | lumen | lumen | lumen | lumen | no |
| `#scan` | theme | theme | theme | **UA Arial** | no |
| `#profile` | theme | theme | theme | theme | no |
| `#commons` | lumen | lumen | lumen | lumen | no |
| `#yumi-sees` | theme | theme | theme | — | no |
| `#about` | theme | theme | theme | theme | no |
| arc detail | theme | theme | theme | theme | no |
| sub-theory | theme | theme | — | — | no |
| book detail | lumen | lumen | lumen | lumen | no |
| Yumi panel | lumen | lumen | **theme** | lumen | **YES** (theme ×1 / lumen ×3) |
| `#home` signed-out | lumen | lumen | — | **theme** | **YES** (theme ×1 / lumen ×2) |
| `#about` signed-out | theme | theme | theme | theme | no |

**3 of 15 measured route-states mix the two font systems within one surface**, and they are
two distinct surfaces: `#home` signed-in (the `.home-sectlabel` meta element resolves
`--font-body` while its heading, prose and buttons resolve the Lumen set — the Yumi-panel row
is the same surface with the panel open) and `#home` signed-out (button on `--font-body`,
heading and prose on `--lum-sans`). Elsewhere each surface commits to one system: **4
lumen-only** (`#notebook`, `#commons`, book detail, and `#home`'s non-meta elements), **8
theme-only**. Caveat: four sampled elements per surface, not an exhaustive DOM sweep.

---
## 4 · What a canon delta must address (facts only)

- 458 distinct custom properties are defined across 872 declaration sites in the five
  stylesheets.
- 121 tokens are defined more than once; 337 are defined exactly once.
- `--ink` is defined 14 times, `--ink-3` 13, `--ink-2` 13, `--ink-4` 12, `--gold` 11,
  `--lum-gold` 9, `--border` 9.
- 383 of 872 definitions sit on `:root`; the remaining 489 sit on 59 other scopes.
- 6 token definitions in `components.css:5401` never reach the CSSOM, because the comment at
  `components.css:5396` closes early on a `*/` inside its prose.
- 37 tokens have zero consumers. 125 further tokens have zero literal consumers and are
  consumed by string concatenation in 7 families across `views.js` and `arc-constellation.js`.
- 19 token names are consumed but never defined in the five stylesheets; 13 of those are
  written at runtime by `setProperty`, and 3 are consumed with a fallback value.
- `--lum-*` tokens are consumed 1,582 times; `--ink*` 934; `--font-*` 787; `--gold*` 560;
  `--radius*` 249.
- 182 literal hexes appear outside token definitions: 102 in `components.css`, 64 in
  `praxis-kit.css`, 9 in `lumen-amber.css`, 7 in `universal-depth.css`, 0 in `theme.css`.
- 12 of the 15 most-repeated bypass hexes are the literal values of named tokens.
- 1,204 `font-family` declarations exist in the five files and 0 of them hard-code a family
  stack; `js/arc-constellation.js` hard-codes a Cormorant stack in 7 places and emits 12
  `font-family` attributes into SVG.
- Two sans tokens resolve to different typefaces: `--font-body` places DM Sans fifth behind
  four system faces, `--lum-sans` places it first.
- `document.fonts.check()` returns true for Cormorant Garamond, DM Sans and DM Mono on 15 of
  15 routes at both widths; 11 faces report status `loaded`.
- 13 of 15 measured route-states resolve display type to Cormorant Garamond; `#yumi-sees`
  resolves it to DM Mono and `#home` signed-out resolves it to DM Sans.
- 6 of 15 route-states resolve their sampled body text to a Cormorant serif; 3 to DM Sans,
  3 to the system UI stack, 2 to DM Mono, 1 has no qualifying leaf.
- 5 of 15 route-states resolve their primary button to the system UI stack, 4 to DM Sans, 2 to
  DM Mono, 1 to UA-default Arial, and 3 expose no qualifying button.
- `.scan-vf-back` (`components.css:16905`) declares no `font-family`; its sibling
  `.scan-vf-title` (`:16907`) declares `var(--font-mono)`.
- 14 of 15 route-states resolve `body[data-ground]` to `dark`; `#scan` is the only `bright`
  one, and `umberGroundDark` (`js/views.js:494`) lists 16 route keys.
- `body` computes `background-color: rgba(0, 0, 0, 0)` on 15 of 15 route-states; the ground is
  painted by a `position:fixed` `body::before` plus a `body::after` SVG-grain layer.
- 7 of 13 surfaces carry both a `--lum-*` and a `--page`/`--ink` consumer in their own scoped
  rules.
- 3 of 15 measured route-states resolve both font systems within one surface; they are 2
  distinct surfaces, both `#home`.
- 5 surfaces carry `.lum-amber-deep` on their route root, 1 carries `.lum-amber-ember`, and 5
  carry no `lum-*` root class.
- `#books` and `#notebook` carry 2,086 and 2,091 surface-scoped declarations, 40.9% of the
  10,216 counted; `#commons` carries 4 and `#scan` 10.
- 683 `border-radius` declarations use 61 distinct values; 359 are literal and 324 use a token.
- The pill radius is written 4 ways across 207 declarations.
- Distinct computed radii per surface range from 0 (sub-theory) to 12 (`#scan`).
- Widest prose measures 222.6ch on `#profile`, 140.0ch on `#about`, 94.3ch on `#home`
  signed-out, 88.1ch on sub-theory, 77.2ch on `#yumi-sees`; 5 surfaces measure at or under
  72ch; 2 expose no prose leaf of 60 characters or more.
- `rig.hscroll()` reports 0 overflow on 15 of 15 routes at both 1360 and 390.
- `--lum-cyan` holds 2 values: `#7fd0f0` at `:root` and `#256b80` scoped to
  `.notebook.lum-amber-deep`.
- 6 elements on `#home` with the Yumi panel open carry a cyan value, and all 6 are Yumi
  affordances; 4 on `#yumi-sees`, all 4 being persistent panel chrome; 0 non-Yumi elements
  carry cyan on either surface.
- `yumiGlyph()` / `yumiGlyphNode()` have 12 call sites across 3 files.
- The Yumi panel computes `backdrop-filter: none`, `border-radius: 10px`, and a radial-gradient
  background image over a transparent background colour.
- Opening the Yumi panel fires 0 network requests and 0 proxy calls.
- `#notebook` has 0 `parts[0] === 'notebook'` dispatch branches in `renderRoute()` and is
  reached as the router's default fall-through.

---

## 5 · Method and limits

### 5.1 Instruments

| Stage | Instrument |
|---|---|
| §1 token/declaration extraction | GNU Awk 5.3.2 state-machine parser (scratchpad). Strips comments the way a CSS parser does, tracks nested block scope, handles multi-line values and declarations terminated by `}`. Self-tested against a fixture covering all four cases plus a negative control before it was run on the real files; its all-declarations variant independently re-derives exactly the same 872 custom-property rows. |
| §1.2 comment stripping | Second Awk pass; CSS block comments, JS block and line comments, with `://` and quote-parity protection. Self-tested on five cases. |
| §2 / §3 measurement + capture | Headless Chrome **153.0.8010.52** driven over the DevTools Protocol by a PowerShell WebSocket client (scratchpad only). `Emulation.setDeviceMetricsOverride` for viewports, `Runtime.evaluate` for seeding and measurement, `Page.captureScreenshot` for PNGs. |
| §2 rig instruments | `.claude/rig/measure.js` loaded per page load for `rig.ch` / `rig.widestProse` / `rig.hscroll`; `.claude/rig/seed.js` loaded for `rigIds()`. Neither file was modified. |
| §1 CSSOM verification | `document.styleSheets` sweep of all 4,326 loaded rules in the Browser pane. |
| Server | `.claude/rig/serve.ps1` on `:8793`, unmodified. |

Python is unavailable on this machine (the `python` on PATH is a Microsoft Store stub);
Node is blocked by policy. Awk and PowerShell were used accordingly.

### 5.2 The signed-in sequence

**Working method, used for every capture and measurement in this report:**

> **reload → stub `praxis_user` → `loadState()` → `renderRoute()`**

**The rig README's documented sequence is `seedRig({signedIn:true})` → RELOAD → measure.**
That sequence **does not sign in as of v3.299 — `integrations.js:717`**: on every load,
Firebase's `onAuthStateChanged` fires with a null user, takes the else branch, and runs
`clearUserState(); sv('praxis_user', null)`, clearing any stub written before the reload. The
stub must therefore be written *after* the load settles, and the surface re-rendered through
the app's own router rather than by reloading again. Verified stable: the stub survives at
t+3000ms once applied post-load.

### 5.3 Intro seen-flags

`js/intros.js:568` defines `seenKey(id)` as `'praxis_intro_' + id`. Before each measurement
this report set **12** keys to `"true"` in `localStorage`, one per registered panel id
(`js/intros.js:40–73`):

```
praxis_intro_home      praxis_intro_shelf     praxis_intro_notebook  praxis_intro_yumi
praxis_intro_sees      praxis_intro_memory    praxis_intro_lenses    praxis_intro_profile
praxis_intro_about     praxis_intro_field     praxis_intro_search    praxis_intro_commons
```

Set in `localStorage` only, in a throwaway Chrome profile, at measurement time. `intros.js`
was not modified and nothing was deleted. Every capture reports
`introPanelPresent: false`. Confirmation that this was needed: the first Browser-pane capture
of `#home`, taken before the flags were set, carried the "Where today gathers" panel over the
field.

### 5.4 What could not be measured, and what to distrust

- **Captures are local-only.** 31 PNGs, 18,497,589 B, above the 8 MB threshold for staging.
  They exist at `.claude/rig/captures/v1/` on the build machine.
- **§3.2 is surface-scoped authorship, not everything that paints a surface.** It cannot see
  generic descendant classes, inheritance, or `:root` tokens arriving by cascade.
- **§3.3's computed test samples four elements per surface** — heading, paragraph, meta,
  primary button — chosen by selector heuristics, not an exhaustive DOM sweep. A surface
  marked "no" may still mix systems in an element not sampled.
- **Element selection is heuristic.** "Primary button" is the first visible
  `button`/`.btn`/`[class*=primary]`; on 3 surfaces no element qualified, which is recorded as
  "none found", not as an absence of buttons.
- **The seeded workspace is owned by `__praxis_seed__`.** Personal-collection surfaces render
  their worked-example or empty state, so counts and layouts here are not those of a populated
  account. `#profile`'s 222.6ch measure comes from a long unbroken text leaf in that state.
- **This is one browser on one platform.** Font resolution is Windows-specific: everything
  reading `--font-body` resolves to Segoe UI here and would resolve to SF Pro Text / system-ui
  on macOS or iOS. The finding that `--font-body` never reaches DM Sans is
  platform-independent (DM Sans is fifth in the stack on every platform that has any of the
  four ahead of it); the *particular face* named is not.
- **`rig.occ()`, `rig.hollow()`, `rig.pointer()`, `rig.rings()` were not run** — composition,
  vertical-void, pointer and focus gates are outside this census's scope.
- **No live-origin check.** Everything is measured against the local server at HEAD
  `6c1c0a2`; nothing here is a claim about the deployed bundle.
- **Capture provenance:** all 31 PNGs were taken fresh on 2026-09-19 against the bytes at
  HEAD `6c1c0a2`, at the stated viewports. None is reused from an earlier round.
- **The Browser pane reports `innerWidth: 0` while the pane is hidden**, which silently
  zeroes every geometry read. Explicit viewport emulation is what makes the measurement real;
  a hidden-pane reading is not.

### 5.5 Every command and expression used

Token/declaration extraction, per file:

```
awk -f tokdef.awk <file>          # 872 custom-property definitions
awk -f decl.awk   <file>          # 19,540 declarations (cross-check: 872 custom props)
```

Consumers (the specified corpus, verbatim):

```
grep -ohE 'var\(--[A-Za-z0-9_-]+[,)]' assets/*.css js/*.js index.html
```

Space-form check, comment-stripped recount, and the `universal-depth.css` variant:

```
grep -coE 'var\([ ]+--' assets/*.css js/*.js index.html docs/studio/universal-depth.css
awk -v MODE=css -f strip.awk <css>   |  awk -v MODE=js -f strip.awk <js>
```

Sizes, EOL and byte-locks:

```
git show HEAD:<file> | wc -c ;  wc -c <file> ;  tr -cd '\r' < <file> | wc -c
git ls-files --eol assets/theme.css assets/lumen-amber.css assets/praxis-kit.css \
                   assets/components.css docs/studio/universal-depth.css
md5sum assets/lumen-amber.css assets/marks.js
git status --porcelain | grep -v '^??' ;  git diff --stat
git rev-list --left-right --count origin/main...HEAD
```

Router census:

```
grep -oE "parts\[0\] === '[a-z-]+'" js/views.js | sort -u
```

In-page measurement: `measure-surface.js` (scratchpad), evaluated per route per width; the
Yumi sweep and the CSSOM rule sweep were evaluated in the Browser pane. Both are reproduced in
full in the run's scratchpad and their outputs are what §2 and §3 tabulate.

---

## 6 · Pre-existing drift (not touched)

Found while measuring, introduced by nothing in this task, and **not acted on here**.

| # | Drift | Evidence |
|---|---|---|
| **D1** | `.claude/rig/README.md` and `measure.js`'s header both state "Screenshots are proven dead here (30s timeout). Geometry is the evidence. Do not try." Screenshots render first-try in the current Browser pane, and 31 were captured over CDP for this report. The claim dates to DW-4 (2026-07-14) and a different pane generation. **S-B sweep item.** | `.claude/rig/README.md` (final bullet); `.claude/rig/measure.js:33` |
| **D2** | The rig's documented seeding sequence (`seedRig` → RELOAD → measure) no longer produces a signed-in surface: the load-time auth callback clears the stub. Working order is reload → stub → `renderRoute()`. **S-B sweep item.** | `js/integrations.js:717`; §5.2 |
| **D3** | `.claude/agents/praxis-recon.md` instructs the agent to expect `assets/lumen-amber.css` at **14,681 B**. The file is byte-locked at **14,966 B** since the R-POLISH B3 re-baseline, per `PROTOCOL.md` §6.1 and `FIX-PROTOCOL.md` §2. The agent will flag a correct file as deviant. | `.claude/agents/praxis-recon.md` (Always-report bullet) |
| **D4** | `CLAUDE.md`'s design canon §1 gives `--font-body` as `'DM Sans', -apple-system, …` and asserts "These three stacks DO match live `theme.css:9-11`". Live `theme.css:15` places DM Sans **fifth**, behind `-apple-system`, `BlinkMacSystemFont`, `'SF Pro Text'` and `'Segoe UI'`. The serif and mono claims do hold. | `CLAUDE.md:444`; `assets/theme.css:14-16` |
| **D5** | A comment at `components.css:5396` contains `--ink*/--gold-*`; the embedded `*/` closes it early and the trailing prose corrupts the next selector, so the rule at `:5401` — six token re-pointings for `.lum-amber-deep .arc-picker-panel` — is dropped by the browser. Verified absent from the live CSSOM. The sibling rule at `:5402` survives. This is the known "`*/` inside a CSS comment drops the next rule" hazard, live. | `assets/components.css:5396, 5401`; CSSOM sweep of 4,326 rules |
| **D6** | `.scan-vf-back` declares no `font-family` and resolves to UA-default Arial, while its sibling `.scan-vf-title` declares `var(--font-mono)`. Same rule block also carries a literal `rgba(246,239,224,.14)` border. | `assets/components.css:16905-16907` |
| **D7** | `index.html:28` loads `/docs/studio/universal-depth.css` — a `docs/` path serving as a production stylesheet, and one omitted from the token corpus this task specified. | `index.html:28` |
| **D8** | `#notebook` has zero `parts[0] === 'notebook'` dispatch branches; it is reached as `renderRoute()`'s default fall-through while still being listed in `umberGroundDark`. | `js/views.js:494`, router dispatch |
| **D9** | `assets/theme.css` is the only one of the five stylesheets stored CRLF in the working tree (`i/lf w/crlf`). Immaterial to what commits — the blob is LF — but it makes a naive `wc -c` read 855 B high. | `git ls-files --eol` |

D1 and D2 are `.claude/rig/` documentation drift and belong to the S-B sweep. D3 and D4 are
doc-vs-code drift in instruction files. D5 and D6 are live CSS defects. D7–D9 are structural
facts recorded for completeness.

---

## 7 · The complete token table (872 definitions)

| # | token | value | file:line | scope |
|---|---|---|---|---|
| 1 | `--lum-base` | `#231708` | `assets/lumen-amber.css:28` | `:root` |
| 2 | `--lum-ink` | `#fdf8ec` | `assets/lumen-amber.css:29` | `:root` |
| 3 | `--lum-ink-2` | `#e8dcc4` | `assets/lumen-amber.css:30` | `:root` |
| 4 | `--lum-ink-3` | `#b6a888` | `assets/lumen-amber.css:31` | `:root` |
| 5 | `--lum-ink-4` | `#867a5e` | `assets/lumen-amber.css:32` | `:root` |
| 6 | `--lum-glass` | `linear-gradient(157deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,.04) 100%)` | `assets/lumen-amber.css:35` | `:root` |
| 7 | `--lum-glass-raised` | `linear-gradient(157deg, rgba(255,255,255,.20) 0%, rgba(255,255,255,.06) 100%)` | `assets/lumen-amber.css:36` | `:root` |
| 8 | `--lum-glass-bd` | `rgba(255,236,200,.28)` | `assets/lumen-amber.css:37` | `:root` |
| 9 | `--lum-glass-bd-2` | `rgba(255,236,200,.16)` | `assets/lumen-amber.css:38` | `:root` |
| 10 | `--lum-glass-blur` | `16px` | `assets/lumen-amber.css:39` | `:root` |
| 11 | `--lum-gold` | `#ffce4a` | `assets/lumen-amber.css:42` | `:root` |
| 12 | `--lum-gold-l` | `#ffe79a` | `assets/lumen-amber.css:43` | `:root` |
| 13 | `--lum-gold-d` | `#cf9c2a` | `assets/lumen-amber.css:44` | `:root` |
| 14 | `--lum-gold-ink` | `#241a02` | `assets/lumen-amber.css:45` | `:root` |
| 15 | `--lum-cyan` | `#7fd0f0` | `assets/lumen-amber.css:46` | `:root` |
| 16 | `--lum-coral` | `#ff9a6e` | `assets/lumen-amber.css:47` | `:root` |
| 17 | `--lum-rose` | `#ff8e8e` | `assets/lumen-amber.css:48` | `:root` |
| 18 | `--lum-cloth` | `#5a4632` | `assets/lumen-amber.css:49` | `:root` |
| 19 | `--lum-serif` | `"Cormorant Garamond", Georgia, serif` | `assets/lumen-amber.css:52` | `:root` |
| 20 | `--lum-sans` | `"DM Sans", system-ui, sans-serif` | `assets/lumen-amber.css:53` | `:root` |
| 21 | `--lum-mono` | `"DM Mono", ui-monospace, monospace` | `assets/lumen-amber.css:54` | `:root` |
| 22 | `--lum-r-card` | `16px` | `assets/lumen-amber.css:57` | `:root` |
| 23 | `--lum-r-pill` | `999px` | `assets/lumen-amber.css:58` | `:root` |
| 24 | `--lum-bg` | `radial-gradient(70% 55% at 14% 2%, rgba(255,202,92,.50) 0%, rgba(255,202,92,0) 60%), rad…` | `assets/lumen-amber.css:74` | `.lum-amber` |
| 25 | `--lum-bg` | `radial-gradient(72% 56% at 16% 4%, rgba(255,190,80,.42) 0%, rgba(255,190,80,0) 60%), rad…` | `assets/lumen-amber.css:83` | `.lum-amber-deep` |
| 26 | `--lum-bg` | `radial-gradient(70% 55% at 14% 4%, rgba(255,200,90,.40) 0%, rgba(255,200,90,0) 60%), rad…` | `assets/lumen-amber.css:91` | `.lum-amber-ember` |
| 27 | `--h` | `#ffce4a` | `assets/lumen-amber.css:154` | `.lg` |
| 28 | `--hl` | `#ffeeb0` | `assets/lumen-amber.css:154` | `.lg` |
| 29 | `--hd` | `#bd8a1e` | `assets/lumen-amber.css:154` | `.lg` |
| 30 | `--hg` | `rgba(255,206,74,.62)` | `assets/lumen-amber.css:154` | `.lg` |
| 31 | `--h` | `#ffab4a` | `assets/lumen-amber.css:155` | `.lam` |
| 32 | `--hl` | `#ffd9a0` | `assets/lumen-amber.css:155` | `.lam` |
| 33 | `--hd` | `#c47a1e` | `assets/lumen-amber.css:155` | `.lam` |
| 34 | `--hg` | `rgba(255,171,74,.55)` | `assets/lumen-amber.css:155` | `.lam` |
| 35 | `--h` | `#ffe6a0` | `assets/lumen-amber.css:156` | `.lcr` |
| 36 | `--hl` | `#fff6d8` | `assets/lumen-amber.css:156` | `.lcr` |
| 37 | `--hd` | `#c0a24a` | `assets/lumen-amber.css:156` | `.lcr` |
| 38 | `--hg` | `rgba(255,230,160,.50)` | `assets/lumen-amber.css:156` | `.lcr` |
| 39 | `--h` | `#ff9a6e` | `assets/lumen-amber.css:157` | `.lco` |
| 40 | `--hl` | `#ffd2bc` | `assets/lumen-amber.css:157` | `.lco` |
| 41 | `--hd` | `#c45a36` | `assets/lumen-amber.css:157` | `.lco` |
| 42 | `--hg` | `rgba(255,154,110,.55)` | `assets/lumen-amber.css:157` | `.lco` |
| 43 | `--h` | `#6fd0ec` | `assets/lumen-amber.css:158` | `.lc` |
| 44 | `--hl` | `#c4f1ff` | `assets/lumen-amber.css:158` | `.lc` |
| 45 | `--hd` | `#2f8fb4` | `assets/lumen-amber.css:158` | `.lc` |
| 46 | `--hg` | `rgba(111,208,236,.58)` | `assets/lumen-amber.css:158` | `.lc` |
| 47 | `--h` | `#46d08e` | `assets/lumen-amber.css:159` | `.le` |
| 48 | `--hl` | `#b6f4d6` | `assets/lumen-amber.css:159` | `.le` |
| 49 | `--hd` | `#1d8a5a` | `assets/lumen-amber.css:159` | `.le` |
| 50 | `--hg` | `rgba(70,208,142,.52)` | `assets/lumen-amber.css:159` | `.le` |
| 51 | `--font-serif` | `'Cormorant Garamond', Georgia, 'Times New Roman', serif` | `assets/theme.css:14` | `:root` |
| 52 | `--font-body` | `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', 'DM Sans', sans-serif` | `assets/theme.css:15` | `:root` |
| 53 | `--font-mono` | `'DM Mono', 'SF Mono', Menlo, Consolas, monospace` | `assets/theme.css:16` | `:root` |
| 54 | `--ground` | `#191F33` | `assets/theme.css:38` | `:root` |
| 55 | `--ground-grad` | `var(--hour-lamp), var(--hour-horizon), var(--hour-arc)` | `assets/theme.css:39` | `:root` |
| 56 | `--surface-d` | `#232838` | `assets/theme.css:40` | `:root` |
| 57 | `--surface-d2` | `#2B3042` | `assets/theme.css:41` | `:root` |
| 58 | `--sunk-d` | `#12151F` | `assets/theme.css:42` | `:root` |
| 59 | `--dark-2` | `#1B1F2D` | `assets/theme.css:43` | `:root` |
| 60 | `--page` | `#f4efe4` | `assets/theme.css:45` | `:root` |
| 61 | `--page-2` | `#fcf6e8` | `assets/theme.css:46` | `:root` |
| 62 | `--meta` | `#9a7e4e` | `assets/theme.css:47` | `:root` |
| 63 | `--text-d` | `var(--on-ground)` | `assets/theme.css:49` | `:root` |
| 64 | `--muted` | `var(--on-ground-2)` | `assets/theme.css:50` | `:root` |
| 65 | `--teal` | `#2e8a93` | `assets/theme.css:52` | `:root` |
| 66 | `--thread` | `#c2a463` | `assets/theme.css:53` | `:root` |
| 67 | `--gold-soft` | `var(--gold-ember)` | `assets/theme.css:54` | `:root` |
| 68 | `--gold-ink` | `#855410` | `assets/theme.css:55` | `:root` |
| 69 | `--register-marginalia` | `var(--teal)` | `assets/theme.css:56` | `:root` |
| 70 | `--register-journal` | `#7d6db0` | `assets/theme.css:57` | `:root` |
| 71 | `--register-question` | `#3a5a8a` | `assets/theme.css:58` | `:root` |
| 72 | `--grad-soft` | `linear-gradient(92deg, #e7c46a, #3aa0a9)` | `assets/theme.css:59` | `:root` |
| 73 | `--glass-bar` | `linear-gradient(180deg, rgba(21,24,38,.88), rgba(16,19,30,.78))` | `assets/theme.css:65` | `:root` |
| 74 | `--glass-pill` | `rgba(21,24,38,.78)` | `assets/theme.css:66` | `:root` |
| 75 | `--glass-border` | `var(--hairline)` | `assets/theme.css:67` | `:root` |
| 76 | `--border-2` | `rgba(240,235,223,.16)` | `assets/theme.css:68` | `:root` |
| 77 | `--line-page` | `rgba(36,23,16,.16)` | `assets/theme.css:69` | `:root` |
| 78 | `--line-page-2` | `rgba(36,23,16,.30)` | `assets/theme.css:70` | `:root` |
| 79 | `--wash-page` | `rgba(36,23,16,.05)` | `assets/theme.css:71` | `:root` |
| 80 | `--shadow-d` | `0 3px 10px rgba(0,0,0,.34), 0 14px 38px rgba(0,0,0,.32)` | `assets/theme.css:72` | `:root` |
| 81 | `--shadow-page` | `3px 5px 12px rgba(28,18,9,.10), 8px 16px 32px rgba(28,18,9,.08)` | `assets/theme.css:73` | `:root` |
| 82 | `--scrim` | `rgba(15,9,4,.6)` | `assets/theme.css:76` | `:root` |
| 83 | `--hour-1` | `#191F33` | `assets/theme.css:94` | `:root` |
| 84 | `--hour-2` | `#1B1D2B` | `assets/theme.css:95` | `:root` |
| 85 | `--hour-3` | `#241C14` | `assets/theme.css:96` | `:root` |
| 86 | `--hour-4` | `#29200F` | `assets/theme.css:97` | `:root` |
| 87 | `--hour-lamp` | `radial-gradient(1200px 640px at 50% -12%, rgba(255,214,150,.08), transparent 60%)` | `assets/theme.css:98` | `:root` |
| 88 | `--hour-horizon` | `radial-gradient(1000px 460px at 50% 112%, rgba(255,175,100,.06), transparent 62%)` | `assets/theme.css:99` | `:root` |
| 89 | `--hour-arc` | `linear-gradient(178deg, var(--hour-1) 0%, var(--hour-2) 36%, var(--hour-3) 70%, var(--ho…` | `assets/theme.css:100` | `:root` |
| 90 | `--on-ground` | `#F0EBDF` | `assets/theme.css:103` | `:root` |
| 91 | `--on-ground-2` | `#B4AFA2` | `assets/theme.css:104` | `:root` |
| 92 | `--on-ground-3` | `#8C897E` | `assets/theme.css:105` | `:root` |
| 93 | `--hairline` | `rgba(240,235,223,.10)` | `assets/theme.css:106` | `:root` |
| 94 | `--gold-world` | `#C79A3A` | `assets/theme.css:109` | `:root` |
| 95 | `--gold-ember` | `#DFB759` | `assets/theme.css:110` | `:root` |
| 96 | `--gold-on-card` | `#8F6A12` | `assets/theme.css:111` | `:root` |
| 97 | `--card-1` | `#FDF9EE` | `assets/theme.css:114` | `:root` |
| 98 | `--card-2` | `#F6EFDC` | `assets/theme.css:115` | `:root` |
| 99 | `--card-ink` | `#262019` | `assets/theme.css:116` | `:root` |
| 100 | `--card-ink-2` | `#5C5340` | `assets/theme.css:117` | `:root` |
| 101 | `--card-meta` | `#8A7F5F` | `assets/theme.css:118` | `:root` |
| 102 | `--card-radius` | `15px` | `assets/theme.css:119` | `:root` |
| 103 | `--card-shadow` | `0 0 0 1px rgba(0,0,0,.18), 0 1px 2px rgba(0,0,0,.28), 0 10px 30px rgba(0,0,0,.26)` | `assets/theme.css:121` | `:root` |
| 104 | `--card-shadow-h` | `0 0 0 1px rgba(0,0,0,.2), 0 2px 4px rgba(0,0,0,.3), 0 14px 38px rgba(0,0,0,.3)` | `assets/theme.css:122` | `:root` |
| 105 | `--teal-on-ground` | `#5FB8C4` | `assets/theme.css:130` | `:root` |
| 106 | `--window-bg` | `#0D1424` | `assets/theme.css:133` | `:root` |
| 107 | `--window-line` | `rgba(199,154,58,.16)` | `assets/theme.css:134` | `:root` |
| 108 | `--mark-glow` | `var(--gold-world)` | `assets/theme.css:152` | `:root` |
| 109 | `--sheet-gap` | `18px` | `assets/theme.css:156` | `:root` |
| 110 | `--shelf-cavity` | `#efe7d6` | `assets/theme.css:163` | `:root` |
| 111 | `--board-face` | `#e3d8c1` | `assets/theme.css:166` | `:root` |
| 112 | `--board-under` | `#b9a97e` | `assets/theme.css:167` | `:root` |
| 113 | `--spine-cloth` | `#4a3f4d` | `assets/theme.css:168` | `:root` |
| 114 | `--gold-ink-on-gold` | `#3d2807` | `assets/theme.css:169` | `:root` |
| 115 | `--wheat-sky-1` | `#fbf4e0` | `assets/theme.css:172` | `:root` |
| 116 | `--wheat-sky-2` | `#f5eccb` | `assets/theme.css:173` | `:root` |
| 117 | `--wheat-sky-3` | `#ecdcac` | `assets/theme.css:174` | `:root` |
| 118 | `--wheat-glow` | `rgba(217,164,65,.28)` | `assets/theme.css:175` | `:root` |
| 119 | `--wheat-near-1` | `#c9a95e` | `assets/theme.css:176` | `:root` |
| 120 | `--wheat-near-2` | `#a98d4e` | `assets/theme.css:177` | `:root` |
| 121 | `--wheat-ear-1` | `#e3bd6b` | `assets/theme.css:178` | `:root` |
| 122 | `--wheat-ear-2` | `#c39a4a` | `assets/theme.css:179` | `:root` |
| 123 | `--wheat-far-1` | `#a48a52` | `assets/theme.css:180` | `:root` |
| 124 | `--wheat-far-2` | `#8a7040` | `assets/theme.css:181` | `:root` |
| 125 | `--wheat-ear-far-1` | `#c2a05e` | `assets/theme.css:182` | `:root` |
| 126 | `--wheat-ear-far-2` | `#a5813a` | `assets/theme.css:183` | `:root` |
| 127 | `--wheat-soil-1` | `rgba(122,95,44,0)` | `assets/theme.css:184` | `:root` |
| 128 | `--wheat-soil-2` | `rgba(122,95,44,.22)` | `assets/theme.css:185` | `:root` |
| 129 | `--m1-on-ground` | `#9D7A20` | `assets/theme.css:205` | `:root` |
| 130 | `--m1-edge-on-ground` | `#725814` | `assets/theme.css:206` | `:root` |
| 131 | `--m1` | `#D9B24A` | `assets/theme.css:208` | `:root` |
| 132 | `--m1-edge` | `#A67F1E` | `assets/theme.css:208` | `:root` |
| 133 | `--m2` | `#C75434` | `assets/theme.css:209` | `:root` |
| 134 | `--m2-edge` | `#94371F` | `assets/theme.css:209` | `:root` |
| 135 | `--m3` | `#7C8B4F` | `assets/theme.css:210` | `:root` |
| 136 | `--m3-edge` | `#556032` | `assets/theme.css:210` | `:root` |
| 137 | `--m4` | `#3E8A83` | `assets/theme.css:211` | `:root` |
| 138 | `--m4-edge` | `#266059` | `assets/theme.css:211` | `:root` |
| 139 | `--m5` | `#B07514` | `assets/theme.css:212` | `:root` |
| 140 | `--m5-edge` | `#7D5109` | `assets/theme.css:212` | `:root` |
| 141 | `--pig-madder` | `#B8425A` | `assets/theme.css:250` | `:root` |
| 142 | `--pig-madder-edge` | `#85293D` | `assets/theme.css:250` | `:root` |
| 143 | `--pig-terracotta` | `#C75434` | `assets/theme.css:251` | `:root` |
| 144 | `--pig-terracotta-edge` | `#94371F` | `assets/theme.css:251` | `:root` |
| 145 | `--pig-ochre` | `#A65F10` | `assets/theme.css:252` | `:root` |
| 146 | `--pig-ochre-edge` | `#74400A` | `assets/theme.css:252` | `:root` |
| 147 | `--pig-olive` | `#7C8B4F` | `assets/theme.css:253` | `:root` |
| 148 | `--pig-olive-edge` | `#556032` | `assets/theme.css:253` | `:root` |
| 149 | `--pig-moss` | `#55913F` | `assets/theme.css:254` | `:root` |
| 150 | `--pig-moss-edge` | `#3B682B` | `assets/theme.css:254` | `:root` |
| 151 | `--pig-verdigris` | `#3C9257` | `assets/theme.css:255` | `:root` |
| 152 | `--pig-verdigris-edge` | `#1F6334` | `assets/theme.css:255` | `:root` |
| 153 | `--pig-teal` | `#3E8A83` | `assets/theme.css:256` | `:root` |
| 154 | `--pig-teal-edge` | `#266059` | `assets/theme.css:256` | `:root` |
| 155 | `--pig-lapis` | `#4A7BB8` | `assets/theme.css:257` | `:root` |
| 156 | `--pig-lapis-edge` | `#2F5484` | `assets/theme.css:257` | `:root` |
| 157 | `--pig-iris` | `#7A6BB8` | `assets/theme.css:258` | `:root` |
| 158 | `--pig-iris-edge` | `#55447E` | `assets/theme.css:258` | `:root` |
| 159 | `--pig-plum` | `#A85A8E` | `assets/theme.css:259` | `:root` |
| 160 | `--pig-plum-edge` | `#7A3D64` | `assets/theme.css:259` | `:root` |
| 161 | `--harvest-1` | `#FEF7E4` | `assets/theme.css:283` | `:root` |
| 162 | `--harvest-2` | `#F6E8C8` | `assets/theme.css:283` | `:root` |
| 163 | `--card-ink-warm` | `#4A4030` | `assets/theme.css:284` | `:root` |
| 164 | `--ember-ink` | `#7A6636` | `assets/theme.css:285` | `:root` |
| 165 | `--gold-hi` | `#F0D79A` | `assets/theme.css:286` | `:root` |
| 166 | `--gold-ink-door` | `#6b5a24` | `assets/theme.css:287` | `:root` |
| 167 | `--cloth-page-1` | `#FBF4E2` | `assets/theme.css:288` | `:root` |
| 168 | `--cloth-page-2` | `#EFE3C7` | `assets/theme.css:288` | `:root` |
| 169 | `--cloth-ox-1` | `#8E4434` | `assets/theme.css:293` | `:root` |
| 170 | `--cloth-ox-2` | `#6E3226` | `assets/theme.css:293` | `:root` |
| 171 | `--cloth-olive-1` | `#7A8A4E` | `assets/theme.css:294` | `:root` |
| 172 | `--cloth-olive-2` | `#5E6C3B` | `assets/theme.css:294` | `:root` |
| 173 | `--cloth-teal-1` | `#357B75` | `assets/theme.css:295` | `:root` |
| 174 | `--cloth-teal-2` | `#265A55` | `assets/theme.css:295` | `:root` |
| 175 | `--nav-frost` | `rgba(21,24,38,.60)` | `assets/theme.css:304` | `:root` |
| 176 | `--nav-blur` | `22px` | `assets/theme.css:305` | `:root` |
| 177 | `--nav-solid` | `#171B2B` | `assets/theme.css:306` | `:root` |
| 178 | `--ink` | `#241710` | `assets/theme.css:315` | `:root` |
| 179 | `--ink-2` | `#645940` | `assets/theme.css:316` | `:root` |
| 180 | `--ink-3` | `#978b6d` | `assets/theme.css:317` | `:root` |
| 181 | `--ink-4` | `#978b6d` | `assets/theme.css:318` | `:root` |
| 182 | `--gold` | `#a8761a` | `assets/theme.css:319` | `:root` |
| 183 | `--gold-deep` | `#855410` | `assets/theme.css:320` | `:root` |
| 184 | `--bg` | `var(--page)` | `assets/theme.css:321` | `:root` |
| 185 | `--surface` | `#fffdf8` | `assets/theme.css:322` | `:root` |
| 186 | `--border` | `var(--line-page)` | `assets/theme.css:323` | `:root` |
| 187 | `--br-deep` | `#1c1209` | `assets/theme.css:324` | `:root` |
| 188 | `--surface-2` | `#efe7d6` | `assets/theme.css:325` | `:root` |
| 189 | `--gold-light` | `var(--gold-ink)` | `assets/theme.css:326` | `:root` |
| 190 | `--gold-text` | `var(--gold-ink)` | `assets/theme.css:327` | `:root` |
| 191 | `--river` | `#3a5a8a` | `assets/theme.css:328` | `:root` |
| 192 | `--color-surface` | `var(--page)` | `assets/theme.css:329` | `:root` |
| 193 | `--text-on-dark` | `#fdfaf3` | `assets/theme.css:330` | `:root` |
| 194 | `--sp-1` | `4px` | `assets/theme.css:333` | `:root` |
| 195 | `--sp-2` | `8px` | `assets/theme.css:334` | `:root` |
| 196 | `--sp-3` | `12px` | `assets/theme.css:335` | `:root` |
| 197 | `--sp-4` | `16px` | `assets/theme.css:336` | `:root` |
| 198 | `--sp-5` | `24px` | `assets/theme.css:337` | `:root` |
| 199 | `--sp-6` | `32px` | `assets/theme.css:338` | `:root` |
| 200 | `--radius-sm` | `6px` | `assets/theme.css:340` | `:root` |
| 201 | `--radius-lg` | `16px` | `assets/theme.css:341` | `:root` |
| 202 | `--fs-sm` | `0.8125rem` | `assets/theme.css:342` | `:root` |
| 203 | `--fs-body` | `0.9375rem` | `assets/theme.css:343` | `:root` |
| 204 | `--fs-display` | `1.5rem` | `assets/theme.css:344` | `:root` |
| 205 | `--arc-web-spine-width` | `2px` | `assets/theme.css:347` | `:root` |
| 206 | `--arc-web-node-cover-height` | `100px` | `assets/theme.css:348` | `:root` |
| 207 | `--arc-web-node-gap` | `var(--sp-5)` | `assets/theme.css:349` | `:root` |
| 208 | `--register-theory` | `var(--br-deep)` | `assets/theme.css:380` | `:root` |
| 209 | `--register-wisdom` | `var(--gold)` | `assets/theme.css:381` | `:root` |
| 210 | `--register-memoir` | `var(--river)` | `assets/theme.css:382` | `:root` |
| 211 | `--register-history` | `color-mix(in srgb, var(--gold) 60%, var(--br-deep) 40%)` | `assets/theme.css:383` | `:root` |
| 212 | `--register-empirical` | `color-mix(in srgb, var(--gold-text) 50%, var(--br-deep) 50%)` | `assets/theme.css:384` | `:root` |
| 213 | `--register-practice` | `color-mix(in srgb, var(--ink-2) 60%, var(--ink-4) 40%)` | `assets/theme.css:385` | `:root` |
| 214 | `--register-novel` | `#c9a85a` | `assets/theme.css:386` | `:root` |
| 215 | `--register-poetry` | `#3a3573` | `assets/theme.css:387` | `:root` |
| 216 | `--register-place` | `#5a6b3a` | `assets/theme.css:388` | `:root` |
| 217 | `--register-theory-light` | `color-mix(in srgb, var(--register-theory) 30%, var(--bg) 70%)` | `assets/theme.css:391` | `:root` |
| 218 | `--register-wisdom-light` | `color-mix(in srgb, var(--register-wisdom) 30%, var(--bg) 70%)` | `assets/theme.css:392` | `:root` |
| 219 | `--register-empirical-light` | `color-mix(in srgb, var(--register-empirical) 30%, var(--bg) 70%)` | `assets/theme.css:393` | `:root` |
| 220 | `--register-history-light` | `color-mix(in srgb, var(--register-history) 30%, var(--bg) 70%)` | `assets/theme.css:394` | `:root` |
| 221 | `--register-memoir-light` | `color-mix(in srgb, var(--register-memoir) 30%, var(--bg) 70%)` | `assets/theme.css:395` | `:root` |
| 222 | `--register-novel-light` | `color-mix(in srgb, var(--register-novel) 30%, var(--bg) 70%)` | `assets/theme.css:396` | `:root` |
| 223 | `--register-poetry-light` | `color-mix(in srgb, var(--register-poetry) 30%, var(--bg) 70%)` | `assets/theme.css:397` | `:root` |
| 224 | `--register-place-light` | `color-mix(in srgb, var(--register-place) 30%, var(--bg) 70%)` | `assets/theme.css:398` | `:root` |
| 225 | `--register-practice-light` | `color-mix(in srgb, var(--register-practice) 30%, var(--bg) 70%)` | `assets/theme.css:399` | `:root` |
| 226 | `--register-theory-mid` | `color-mix(in srgb, var(--register-theory) 65%, var(--bg) 35%)` | `assets/theme.css:402` | `:root` |
| 227 | `--register-wisdom-mid` | `color-mix(in srgb, var(--register-wisdom) 65%, var(--bg) 35%)` | `assets/theme.css:403` | `:root` |
| 228 | `--register-empirical-mid` | `color-mix(in srgb, var(--register-empirical) 65%, var(--bg) 35%)` | `assets/theme.css:404` | `:root` |
| 229 | `--register-history-mid` | `color-mix(in srgb, var(--register-history) 65%, var(--bg) 35%)` | `assets/theme.css:405` | `:root` |
| 230 | `--register-memoir-mid` | `color-mix(in srgb, var(--register-memoir) 65%, var(--bg) 35%)` | `assets/theme.css:406` | `:root` |
| 231 | `--register-novel-mid` | `color-mix(in srgb, var(--register-novel) 65%, var(--bg) 35%)` | `assets/theme.css:407` | `:root` |
| 232 | `--register-poetry-mid` | `color-mix(in srgb, var(--register-poetry) 65%, var(--bg) 35%)` | `assets/theme.css:408` | `:root` |
| 233 | `--register-place-mid` | `color-mix(in srgb, var(--register-place) 65%, var(--bg) 35%)` | `assets/theme.css:409` | `:root` |
| 234 | `--register-practice-mid` | `color-mix(in srgb, var(--register-practice) 65%, var(--bg) 35%)` | `assets/theme.css:410` | `:root` |
| 235 | `--register-theory-deep` | `var(--register-theory)` | `assets/theme.css:413` | `:root` |
| 236 | `--register-wisdom-deep` | `var(--register-wisdom)` | `assets/theme.css:414` | `:root` |
| 237 | `--register-empirical-deep` | `var(--register-empirical)` | `assets/theme.css:415` | `:root` |
| 238 | `--register-history-deep` | `var(--register-history)` | `assets/theme.css:416` | `:root` |
| 239 | `--register-memoir-deep` | `var(--register-memoir)` | `assets/theme.css:417` | `:root` |
| 240 | `--register-novel-deep` | `var(--register-novel)` | `assets/theme.css:418` | `:root` |
| 241 | `--register-poetry-deep` | `var(--register-poetry)` | `assets/theme.css:419` | `:root` |
| 242 | `--register-place-deep` | `var(--register-place)` | `assets/theme.css:420` | `:root` |
| 243 | `--register-practice-deep` | `var(--register-practice)` | `assets/theme.css:421` | `:root` |
| 244 | `--tradition-ground` | `#FAEEDA` | `assets/theme.css:424` | `:root` |
| 245 | `--tradition-inner-light` | `#FFF8E7` | `assets/theme.css:425` | `:root` |
| 246 | `--thread-color` | `var(--thread)` | `assets/theme.css:426` | `:root` |
| 247 | `--thread-color-faint` | `color-mix(in srgb, var(--thread) 65%, transparent)` | `assets/theme.css:427` | `:root` |
| 248 | `--marginalia-color` | `var(--teal)` | `assets/theme.css:428` | `:root` |
| 249 | `--journal-color` | `#7d6db0` | `assets/theme.css:429` | `:root` |
| 250 | `--question-color` | `var(--river)` | `assets/theme.css:430` | `:root` |
| 251 | `--arc-question-glow` | `var(--gold)` | `assets/theme.css:431` | `:root` |
| 252 | `--tradition-theory-halo` | `#F0A88A` | `assets/theme.css:432` | `:root` |
| 253 | `--tradition-wisdom-halo` | `#F8E078` | `assets/theme.css:433` | `:root` |
| 254 | `--tradition-empirical-halo` | `#F8C8AA` | `assets/theme.css:434` | `:root` |
| 255 | `--tradition-history-halo` | `#E8B068` | `assets/theme.css:435` | `:root` |
| 256 | `--tradition-memoir-halo` | `#C5D080` | `assets/theme.css:436` | `:root` |
| 257 | `--tradition-novel-halo` | `#F5BACE` | `assets/theme.css:437` | `:root` |
| 258 | `--tradition-poetry-halo` | `#8590D8` | `assets/theme.css:438` | `:root` |
| 259 | `--tradition-place-halo` | `#98D4B0` | `assets/theme.css:439` | `:root` |
| 260 | `--tradition-practice-halo` | `#B8896C` | `assets/theme.css:440` | `:root` |
| 261 | `--subtheory-1` | `var(--m1)` | `assets/theme.css:473` | `:root` |
| 262 | `--subtheory-2` | `var(--m2)` | `assets/theme.css:474` | `:root` |
| 263 | `--subtheory-3` | `var(--m3)` | `assets/theme.css:475` | `:root` |
| 264 | `--subtheory-4` | `var(--m4)` | `assets/theme.css:476` | `:root` |
| 265 | `--subtheory-5` | `var(--m5)` | `assets/theme.css:477` | `:root` |
| 266 | `--subtheory-6` | `var(--m1)` | `assets/theme.css:478` | `:root` |
| 267 | `--subtheory-7` | `var(--m2)` | `assets/theme.css:479` | `:root` |
| 268 | `--subtheory-8` | `var(--m3)` | `assets/theme.css:480` | `:root` |
| 269 | `--subtheory-9` | `var(--m4)` | `assets/theme.css:481` | `:root` |
| 270 | `--subtheory-10` | `var(--m5)` | `assets/theme.css:482` | `:root` |
| 271 | `--subtheory-11` | `var(--m1)` | `assets/theme.css:483` | `:root` |
| 272 | `--subtheory-12` | `var(--m2)` | `assets/theme.css:484` | `:root` |
| 273 | `--subtheory-13` | `var(--m3)` | `assets/theme.css:485` | `:root` |
| 274 | `--subtheory-14` | `var(--m4)` | `assets/theme.css:486` | `:root` |
| 275 | `--subtheory-15` | `var(--m5)` | `assets/theme.css:487` | `:root` |
| 276 | `--subtheory-16` | `var(--m1)` | `assets/theme.css:488` | `:root` |
| 277 | `--subtheory-1-edge` | `var(--m1-edge)` | `assets/theme.css:494` | `:root` |
| 278 | `--subtheory-2-edge` | `var(--m2-edge)` | `assets/theme.css:495` | `:root` |
| 279 | `--subtheory-3-edge` | `var(--m3-edge)` | `assets/theme.css:496` | `:root` |
| 280 | `--subtheory-4-edge` | `var(--m4-edge)` | `assets/theme.css:497` | `:root` |
| 281 | `--subtheory-5-edge` | `var(--m5-edge)` | `assets/theme.css:498` | `:root` |
| 282 | `--subtheory-6-edge` | `var(--m1-edge)` | `assets/theme.css:499` | `:root` |
| 283 | `--subtheory-7-edge` | `var(--m2-edge)` | `assets/theme.css:500` | `:root` |
| 284 | `--subtheory-8-edge` | `var(--m3-edge)` | `assets/theme.css:501` | `:root` |
| 285 | `--subtheory-9-edge` | `var(--m4-edge)` | `assets/theme.css:502` | `:root` |
| 286 | `--subtheory-10-edge` | `var(--m5-edge)` | `assets/theme.css:503` | `:root` |
| 287 | `--subtheory-11-edge` | `var(--m1-edge)` | `assets/theme.css:504` | `:root` |
| 288 | `--subtheory-12-edge` | `var(--m2-edge)` | `assets/theme.css:505` | `:root` |
| 289 | `--subtheory-13-edge` | `var(--m3-edge)` | `assets/theme.css:506` | `:root` |
| 290 | `--subtheory-14-edge` | `var(--m4-edge)` | `assets/theme.css:507` | `:root` |
| 291 | `--subtheory-15-edge` | `var(--m5-edge)` | `assets/theme.css:508` | `:root` |
| 292 | `--subtheory-16-edge` | `var(--m1-edge)` | `assets/theme.css:509` | `:root` |
| 293 | `--shadow-1` | `2px 3px 6px color-mix(in srgb, var(--br-deep) 8%, transparent), 4px 8px 18px color-mix(i…` | `assets/theme.css:532` | `:root` |
| 294 | `--shadow-2` | `3px 5px 12px color-mix(in srgb, var(--br-deep) 10%, transparent), 8px 16px 32px color-mi…` | `assets/theme.css:535` | `:root` |
| 295 | `--shadow-spotlight` | `0 40px 100px -34px rgba(58,40,16,.5)` | `assets/theme.css:538` | `:root` |
| 296 | `--shadow-yumi` | `3px 4px 10px color-mix(in srgb, var(--br-deep) 9%, transparent), 6px 12px 24px color-mix…` | `assets/theme.css:539` | `:root` |
| 297 | `--shadow-cover` | `0 24px 50px -20px #000` | `assets/theme.css:546` | `:root` |
| 298 | `--highlight-edge` | `color-mix(in srgb, var(--text-on-dark) 55%, transparent)` | `assets/theme.css:551` | `:root` |
| 299 | `--radius-md` | `10px` | `assets/theme.css:556` | `:root` |
| 300 | `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | `assets/theme.css:562` | `:root` |
| 301 | `--motion-base` | `350ms` | `assets/theme.css:563` | `:root` |
| 302 | `--field-presence` | `0.22` | `assets/theme.css:571` | `:root` |
| 303 | `--ground-center` | `var(--page)` | `assets/theme.css:574` | `:root` |
| 304 | `--bg-2` | `var(--page-2)` | `assets/theme.css:575` | `:root` |
| 305 | `--sunk` | `#e3d4b0` | `assets/theme.css:576` | `:root` |
| 306 | `--glass` | `rgba(248,241,225,.5)` | `assets/theme.css:577` | `:root` |
| 307 | `--glass-2` | `rgba(252,246,232,.82)` | `assets/theme.css:578` | `:root` |
| 308 | `--glass-spotlight` | `rgba(48,30,16,.94)` | `assets/theme.css:579` | `:root` |
| 309 | `--line-2` | `var(--line-page-2)` | `assets/theme.css:580` | `:root` |
| 310 | `--river-l` | `#5a7ab0` | `assets/theme.css:581` | `:root` |
| 311 | `--grad` | `linear-gradient(92deg,#d2a23e,#2e8a93)` | `assets/theme.css:582` | `:root` |
| 312 | `--radius-xl` | `22px` | `assets/theme.css:583` | `:root` |
| 313 | `--ground-base` | `var(--bg-2)` | `assets/theme.css:589` | `:root` |
| 314 | `--ground-edge` | `var(--bg-2)` | `assets/theme.css:590` | `:root` |
| 315 | `--wordmark` | `var(--gold-soft)` | `assets/theme.css:591` | `:root` |
| 316 | `--wash` | `var(--wash-page)` | `assets/theme.css:592` | `:root` |
| 317 | `--radius-pill` | `999px` | `assets/theme.css:593` | `:root` |
| 318 | `--on-teal` | `#06241a` | `assets/theme.css:596` | `:root` |
| 319 | `--panel-yumi` | `color-mix(in srgb, var(--surface) 93%, var(--marginalia-color) 7%)` | `assets/theme.css:597` | `:root` |
| 320 | `--danger` | `#c2603a` | `assets/theme.css:601` | `:root` |
| 321 | `--danger-line` | `rgba(194,96,58,.46)` | `assets/theme.css:602` | `:root` |
| 322 | `--scan-cam-bg` | `#0c0a07` | `assets/theme.css:609` | `:root` |
| 323 | `--scan-glass` | `rgba(20,14,7,.62)` | `assets/theme.css:610` | `:root` |
| 324 | `--scan-glass-2` | `rgba(28,20,10,.82)` | `assets/theme.css:611` | `:root` |
| 325 | `--scan-on-dark` | `#f6efe0` | `assets/theme.css:612` | `:root` |
| 326 | `--scan-on-dark-2` | `rgba(246,239,224,.62)` | `assets/theme.css:613` | `:root` |
| 327 | `--scan-cloth-1` | `#e3d8c1` | `assets/theme.css:615` | `:root` |
| 328 | `--scan-cloth-2` | `#d3c4a6` | `assets/theme.css:616` | `:root` |
| 329 | `--scan-cover-ink` | `#3a2c17` | `assets/theme.css:617` | `:root` |
| 330 | `--scan-cover-meta` | `#6b5b3c` | `assets/theme.css:618` | `:root` |
| 331 | `--dots` | `radial-gradient(circle, color-mix(in srgb, var(--ink-4) 26%, transparent) 1.3px, transpa…` | `assets/theme.css:623` | `:root` |
| 332 | `--margin-rule` | `color-mix(in srgb, var(--danger) 30%, transparent)` | `assets/theme.css:625` | `:root` |
| 333 | `--field-1-deep` | `#7a5410` | `assets/theme.css:633` | `:root` |
| 334 | `--field-2-deep` | `#9c3f1e` | `assets/theme.css:633` | `:root` |
| 335 | `--field-3-deep` | `#97423c` | `assets/theme.css:633` | `:root` |
| 336 | `--field-4-deep` | `#a53a62` | `assets/theme.css:633` | `:root` |
| 337 | `--field-5-deep` | `#4d6333` | `assets/theme.css:633` | `:root` |
| 338 | `--field-6-deep` | `#2b6f4f` | `assets/theme.css:634` | `:root` |
| 339 | `--field-7-deep` | `#3a4590` | `assets/theme.css:634` | `:root` |
| 340 | `--field-8-deep` | `#726010` | `assets/theme.css:634` | `:root` |
| 341 | `--field-9-deep` | `#7f5514` | `assets/theme.css:634` | `:root` |
| 342 | `--field-10-deep` | `#68412c` | `assets/theme.css:634` | `:root` |
| 343 | `--pf-hue-1` | `#d3a35a` | `assets/theme.css:642` | `:root` |
| 344 | `--pf-hue-1d` | `#7a5a1e` | `assets/theme.css:642` | `:root` |
| 345 | `--pf-hue-2` | `#cf8560` | `assets/theme.css:643` | `:root` |
| 346 | `--pf-hue-2d` | `#83421f` | `assets/theme.css:643` | `:root` |
| 347 | `--pf-hue-3` | `#cc8a94` | `assets/theme.css:644` | `:root` |
| 348 | `--pf-hue-3d` | `#8a4650` | `assets/theme.css:644` | `:root` |
| 349 | `--pf-hue-4` | `#a880a0` | `assets/theme.css:645` | `:root` |
| 350 | `--pf-hue-4d` | `#63385e` | `assets/theme.css:645` | `:root` |
| 351 | `--pf-hue-5` | `#8496bb` | `assets/theme.css:646` | `:root` |
| 352 | `--pf-hue-5d` | `#3c4d78` | `assets/theme.css:646` | `:root` |
| 353 | `--pf-hue-6` | `#5fa89e` | `assets/theme.css:647` | `:root` |
| 354 | `--pf-hue-6d` | `#2c6a60` | `assets/theme.css:647` | `:root` |
| 355 | `--pf-hue-7` | `#90ac7e` | `assets/theme.css:648` | `:root` |
| 356 | `--pf-hue-7d` | `#46603a` | `assets/theme.css:648` | `:root` |
| 357 | `--pf-hue-8` | `#a9a45e` | `assets/theme.css:649` | `:root` |
| 358 | `--pf-hue-8d` | `#5f5b1e` | `assets/theme.css:649` | `:root` |
| 359 | `--pf-hue-9` | `#c08f6e` | `assets/theme.css:650` | `:root` |
| 360 | `--pf-hue-9d` | `#6e4a2c` | `assets/theme.css:650` | `:root` |
| 361 | `--pf-hue-10` | `#7fa4c2` | `assets/theme.css:651` | `:root` |
| 362 | `--pf-hue-10d` | `#3e5a78` | `assets/theme.css:651` | `:root` |
| 363 | `--ink` | `var(--text-d)` | `assets/theme.css:667` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 364 | `--ink-2` | `var(--muted)` | `assets/theme.css:668` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 365 | `--ink-3` | `var(--muted)` | `assets/theme.css:669` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 366 | `--ink-4` | `var(--muted)` | `assets/theme.css:670` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 367 | `--surface` | `var(--surface-d)` | `assets/theme.css:671` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 368 | `--surface-2` | `var(--surface-d2)` | `assets/theme.css:672` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 369 | `--color-surface` | `var(--dark-2)` | `assets/theme.css:673` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 370 | `--bg` | `var(--ground)` | `assets/theme.css:674` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 371 | `--bg-2` | `var(--surface-d2)` | `assets/theme.css:675` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 372 | `--border` | `var(--hairline)` | `assets/theme.css:676` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 373 | `--line-2` | `var(--border-2)` | `assets/theme.css:677` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 374 | `--wash` | `rgba(240,235,223,.06)` | `assets/theme.css:678` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 375 | `--glass` | `var(--glass-pill)` | `assets/theme.css:679` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 376 | `--glass-2` | `rgba(21,24,38,.88)` | `assets/theme.css:680` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 377 | `--sunk` | `#2E3446` | `assets/theme.css:681` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 378 | `--gold` | `var(--gold-world)` | `assets/theme.css:685` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 379 | `--gold-light` | `var(--gold-soft)` | `assets/theme.css:686` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 380 | `--gold-text` | `var(--gold-soft)` | `assets/theme.css:687` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 381 | `--gold-deep` | `var(--gold-soft)` | `assets/theme.css:693` | `[data-ground="dark"],.app-nav,.yumi-bloom,.yumi-panel,.spotlight-panel` |
| 382 | `--subtheory-1` | `#8fcdc3` | `assets/theme.css:804` | `[data-st-palette="muted"]` |
| 383 | `--subtheory-1-edge` | `#4f9389` | `assets/theme.css:804` | `[data-st-palette="muted"]` |
| 384 | `--subtheory-2` | `#a9bfe3` | `assets/theme.css:805` | `[data-st-palette="muted"]` |
| 385 | `--subtheory-2-edge` | `#5d76a8` | `assets/theme.css:805` | `[data-st-palette="muted"]` |
| 386 | `--subtheory-3` | `#e0a099` | `assets/theme.css:806` | `[data-st-palette="muted"]` |
| 387 | `--subtheory-3-edge` | `#b2625a` | `assets/theme.css:806` | `[data-st-palette="muted"]` |
| 388 | `--subtheory-4` | `#e3b964` | `assets/theme.css:807` | `[data-st-palette="muted"]` |
| 389 | `--subtheory-4-edge` | `#a8781f` | `assets/theme.css:807` | `[data-st-palette="muted"]` |
| 390 | `--subtheory-5` | `#9accd6` | `assets/theme.css:808` | `[data-st-palette="muted"]` |
| 391 | `--subtheory-5-edge` | `#5d99a8` | `assets/theme.css:808` | `[data-st-palette="muted"]` |
| 392 | `--subtheory-6` | `#ecd494` | `assets/theme.css:809` | `[data-st-palette="muted"]` |
| 393 | `--subtheory-6-edge` | `#b09238` | `assets/theme.css:809` | `[data-st-palette="muted"]` |
| 394 | `--subtheory-7` | `#b0b5e0` | `assets/theme.css:810` | `[data-st-palette="muted"]` |
| 395 | `--subtheory-7-edge` | `#6d74b8` | `assets/theme.css:810` | `[data-st-palette="muted"]` |
| 396 | `--subtheory-8` | `#f2b8cc` | `assets/theme.css:811` | `[data-st-palette="muted"]` |
| 397 | `--subtheory-8-edge` | `#c97f9b` | `assets/theme.css:811` | `[data-st-palette="muted"]` |
| 398 | `--subtheory-9` | `#b5cf9e` | `assets/theme.css:812` | `[data-st-palette="muted"]` |
| 399 | `--subtheory-9-edge` | `#74955c` | `assets/theme.css:812` | `[data-st-palette="muted"]` |
| 400 | `--subtheory-10` | `#b9a8dc` | `assets/theme.css:813` | `[data-st-palette="muted"]` |
| 401 | `--subtheory-10-edge` | `#7e69ad` | `assets/theme.css:813` | `[data-st-palette="muted"]` |
| 402 | `--subtheory-11` | `#c4b2e0` | `assets/theme.css:814` | `[data-st-palette="muted"]` |
| 403 | `--subtheory-11-edge` | `#8a76b8` | `assets/theme.css:814` | `[data-st-palette="muted"]` |
| 404 | `--subtheory-12` | `#d2d89e` | `assets/theme.css:815` | `[data-st-palette="muted"]` |
| 405 | `--subtheory-12-edge` | `#9aa35e` | `assets/theme.css:815` | `[data-st-palette="muted"]` |
| 406 | `--subtheory-13` | `#a5d2bc` | `assets/theme.css:816` | `[data-st-palette="muted"]` |
| 407 | `--subtheory-13-edge` | `#62a386` | `assets/theme.css:816` | `[data-st-palette="muted"]` |
| 408 | `--subtheory-14` | `#e2aabb` | `assets/theme.css:817` | `[data-st-palette="muted"]` |
| 409 | `--subtheory-14-edge` | `#b87490` | `assets/theme.css:817` | `[data-st-palette="muted"]` |
| 410 | `--subtheory-15` | `#ddc9a0` | `assets/theme.css:818` | `[data-st-palette="muted"]` |
| 411 | `--subtheory-15-edge` | `#a68f5e` | `assets/theme.css:818` | `[data-st-palette="muted"]` |
| 412 | `--subtheory-16` | `#e7b3a8` | `assets/theme.css:819` | `[data-st-palette="muted"]` |
| 413 | `--subtheory-16-edge` | `#bb7e6e` | `assets/theme.css:819` | `[data-st-palette="muted"]` |
| 414 | `--subtheory-1` | `var(--m1)` | `assets/theme.css:839` | `[data-st-palette="colorful"]` |
| 415 | `--subtheory-1-edge` | `var(--m1-edge)` | `assets/theme.css:839` | `[data-st-palette="colorful"]` |
| 416 | `--subtheory-2` | `var(--m2)` | `assets/theme.css:840` | `[data-st-palette="colorful"]` |
| 417 | `--subtheory-2-edge` | `var(--m2-edge)` | `assets/theme.css:840` | `[data-st-palette="colorful"]` |
| 418 | `--subtheory-3` | `var(--m3)` | `assets/theme.css:841` | `[data-st-palette="colorful"]` |
| 419 | `--subtheory-3-edge` | `var(--m3-edge)` | `assets/theme.css:841` | `[data-st-palette="colorful"]` |
| 420 | `--subtheory-4` | `var(--m4)` | `assets/theme.css:842` | `[data-st-palette="colorful"]` |
| 421 | `--subtheory-4-edge` | `var(--m4-edge)` | `assets/theme.css:842` | `[data-st-palette="colorful"]` |
| 422 | `--subtheory-5` | `var(--m5)` | `assets/theme.css:843` | `[data-st-palette="colorful"]` |
| 423 | `--subtheory-5-edge` | `var(--m5-edge)` | `assets/theme.css:843` | `[data-st-palette="colorful"]` |
| 424 | `--subtheory-6` | `var(--m1)` | `assets/theme.css:844` | `[data-st-palette="colorful"]` |
| 425 | `--subtheory-6-edge` | `var(--m1-edge)` | `assets/theme.css:844` | `[data-st-palette="colorful"]` |
| 426 | `--subtheory-7` | `var(--m2)` | `assets/theme.css:845` | `[data-st-palette="colorful"]` |
| 427 | `--subtheory-7-edge` | `var(--m2-edge)` | `assets/theme.css:845` | `[data-st-palette="colorful"]` |
| 428 | `--subtheory-8` | `var(--m3)` | `assets/theme.css:846` | `[data-st-palette="colorful"]` |
| 429 | `--subtheory-8-edge` | `var(--m3-edge)` | `assets/theme.css:846` | `[data-st-palette="colorful"]` |
| 430 | `--subtheory-9` | `var(--m4)` | `assets/theme.css:847` | `[data-st-palette="colorful"]` |
| 431 | `--subtheory-9-edge` | `var(--m4-edge)` | `assets/theme.css:847` | `[data-st-palette="colorful"]` |
| 432 | `--subtheory-10` | `var(--m5)` | `assets/theme.css:848` | `[data-st-palette="colorful"]` |
| 433 | `--subtheory-10-edge` | `var(--m5-edge)` | `assets/theme.css:848` | `[data-st-palette="colorful"]` |
| 434 | `--subtheory-11` | `var(--m1)` | `assets/theme.css:849` | `[data-st-palette="colorful"]` |
| 435 | `--subtheory-11-edge` | `var(--m1-edge)` | `assets/theme.css:849` | `[data-st-palette="colorful"]` |
| 436 | `--subtheory-12` | `var(--m2)` | `assets/theme.css:850` | `[data-st-palette="colorful"]` |
| 437 | `--subtheory-12-edge` | `var(--m2-edge)` | `assets/theme.css:850` | `[data-st-palette="colorful"]` |
| 438 | `--subtheory-13` | `var(--m3)` | `assets/theme.css:851` | `[data-st-palette="colorful"]` |
| 439 | `--subtheory-13-edge` | `var(--m3-edge)` | `assets/theme.css:851` | `[data-st-palette="colorful"]` |
| 440 | `--subtheory-14` | `var(--m4)` | `assets/theme.css:852` | `[data-st-palette="colorful"]` |
| 441 | `--subtheory-14-edge` | `var(--m4-edge)` | `assets/theme.css:852` | `[data-st-palette="colorful"]` |
| 442 | `--subtheory-15` | `var(--m5)` | `assets/theme.css:853` | `[data-st-palette="colorful"]` |
| 443 | `--subtheory-15-edge` | `var(--m5-edge)` | `assets/theme.css:853` | `[data-st-palette="colorful"]` |
| 444 | `--subtheory-16` | `var(--m1)` | `assets/theme.css:854` | `[data-st-palette="colorful"]` |
| 445 | `--subtheory-16-edge` | `var(--m1-edge)` | `assets/theme.css:854` | `[data-st-palette="colorful"]` |
| 446 | `--gold` | `var(--gold-hi)` | `assets/components.css:130` | `.yumi-bloom--raised` |
| 447 | `--ink` | `#241710` | `assets/components.css:1858` | `.arcs.lum-amber-deep` |
| 448 | `--ink-2` | `#645940` | `assets/components.css:1858` | `.arcs.lum-amber-deep` |
| 449 | `--ink-3` | `#645940` | `assets/components.css:1858` | `.arcs.lum-amber-deep` |
| 450 | `--ink-4` | `#978b6d` | `assets/components.css:1858` | `.arcs.lum-amber-deep` |
| 451 | `--surface` | `#fffdf8` | `assets/components.css:1859` | `.arcs.lum-amber-deep` |
| 452 | `--surface-2` | `#efe7d6` | `assets/components.css:1859` | `.arcs.lum-amber-deep` |
| 453 | `--border` | `#e3d8c1` | `assets/components.css:1859` | `.arcs.lum-amber-deep` |
| 454 | `--line-2` | `#e3d8c1` | `assets/components.css:1859` | `.arcs.lum-amber-deep` |
| 455 | `--gold` | `#a8761a` | `assets/components.css:1860` | `.arcs.lum-amber-deep` |
| 456 | `--gold-deep` | `#855410` | `assets/components.css:1860` | `.arcs.lum-amber-deep` |
| 457 | `--gold-hi` | `#d9a441` | `assets/components.css:1860` | `.arcs.lum-amber-deep` |
| 458 | `--gold-light` | `#d9a441` | `assets/components.css:1860` | `.arcs.lum-amber-deep` |
| 459 | `--thread` | `#c2a463` | `assets/components.css:1861` | `.arcs.lum-amber-deep` |
| 460 | `--field-1` | `#f2c25a` | `assets/components.css:1862` | `.arcs.lum-amber-deep` |
| 461 | `--field-2` | `#e07a52` | `assets/components.css:1862` | `.arcs.lum-amber-deep` |
| 462 | `--field-3` | `#d98f8a` | `assets/components.css:1862` | `.arcs.lum-amber-deep` |
| 463 | `--field-4` | `#f5bace` | `assets/components.css:1862` | `.arcs.lum-amber-deep` |
| 464 | `--field-5` | `#a9b98c` | `assets/components.css:1862` | `.arcs.lum-amber-deep` |
| 465 | `--field-6` | `#98d4b0` | `assets/components.css:1863` | `.arcs.lum-amber-deep` |
| 466 | `--field-7` | `#8590d8` | `assets/components.css:1863` | `.arcs.lum-amber-deep` |
| 467 | `--field-8` | `#f8e078` | `assets/components.css:1863` | `.arcs.lum-amber-deep` |
| 468 | `--field-9` | `#e8b068` | `assets/components.css:1863` | `.arcs.lum-amber-deep` |
| 469 | `--field-10` | `#b8896c` | `assets/components.css:1863` | `.arcs.lum-amber-deep` |
| 470 | `--ink` | `var(--br-deep)` | `assets/components.css:3592` | `.yumi-sees-page .transparency-panel` |
| 471 | `--ink-2` | `var(--br-deep)` | `assets/components.css:3593` | `.yumi-sees-page .transparency-panel` |
| 472 | `--ink-3` | `var(--meta)` | `assets/components.css:3594` | `.yumi-sees-page .transparency-panel` |
| 473 | `--ink-4` | `var(--meta)` | `assets/components.css:3595` | `.yumi-sees-page .transparency-panel` |
| 474 | `--surface-2` | `var(--page-2)` | `assets/components.css:3596` | `.yumi-sees-page .transparency-panel` |
| 475 | `--border` | `var(--line-page)` | `assets/components.css:3597` | `.yumi-sees-page .transparency-panel` |
| 476 | `--line-2` | `var(--line-page-2)` | `assets/components.css:3598` | `.yumi-sees-page .transparency-panel` |
| 477 | `--surface-2` | `var(--page-2)` | `assets/components.css:5401` | `it never mounts on genuinely-dark chrome. */.lum-amber-deep .arc-pic…` |
| 478 | `--ink` | `var(--lum-ink)` | `assets/components.css:5401` | `it never mounts on genuinely-dark chrome. */.lum-amber-deep .arc-pic…` |
| 479 | `--ink-2` | `var(--lum-ink-2)` | `assets/components.css:5401` | `it never mounts on genuinely-dark chrome. */.lum-amber-deep .arc-pic…` |
| 480 | `--ink-3` | `var(--lum-ink-3)` | `assets/components.css:5401` | `it never mounts on genuinely-dark chrome. */.lum-amber-deep .arc-pic…` |
| 481 | `--ink-4` | `var(--lum-glass-bd-2)` | `assets/components.css:5401` | `it never mounts on genuinely-dark chrome. */.lum-amber-deep .arc-pic…` |
| 482 | `--border` | `var(--lum-glass-bd-2)` | `assets/components.css:5401` | `it never mounts on genuinely-dark chrome. */.lum-amber-deep .arc-pic…` |
| 483 | `--font-script` | `'Cormorant Garamond', 'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif CJK JP', 'Noto Sa…` | `assets/components.css:9742` | `.about` |
| 484 | `--ink` | `var(--br-deep)` | `assets/components.css:9849` | `.about .orientation` |
| 485 | `--ink-2` | `var(--br-deep)` | `assets/components.css:9850` | `.about .orientation` |
| 486 | `--ink-3` | `var(--meta)` | `assets/components.css:9851` | `.about .orientation` |
| 487 | `--ink-4` | `var(--meta)` | `assets/components.css:9852` | `.about .orientation` |
| 488 | `--surface` | `var(--page-2)` | `assets/components.css:9853` | `.about .orientation` |
| 489 | `--surface-2` | `var(--page)` | `assets/components.css:9854` | `.about .orientation` |
| 490 | `--border` | `var(--line-page)` | `assets/components.css:9855` | `.about .orientation` |
| 491 | `--line-2` | `var(--line-page-2)` | `assets/components.css:9856` | `.about .orientation` |
| 492 | `--gold` | `var(--gold-ink)` | `assets/components.css:9857` | `.about .orientation` |
| 493 | `--gold-light` | `var(--gold-ink)` | `assets/components.css:9858` | `.about .orientation` |
| 494 | `--gold-text` | `var(--gold-ink)` | `assets/components.css:9859` | `.about .orientation` |
| 495 | `--ink` | `var(--text-d)` | `assets/components.css:10617` | `.account-hero .account-slot` |
| 496 | `--ink-2` | `var(--text-d)` | `assets/components.css:10617` | `.account-hero .account-slot` |
| 497 | `--ink-3` | `var(--muted)` | `assets/components.css:10617` | `.account-hero .account-slot` |
| 498 | `--ink-4` | `var(--muted)` | `assets/components.css:10617` | `.account-hero .account-slot` |
| 499 | `--lum-ink` | `#241710` | `assets/components.css:11064` | `.bk-surface.lum-amber-deep` |
| 500 | `--lum-ink-2` | `#645940` | `assets/components.css:11064` | `.bk-surface.lum-amber-deep` |
| 501 | `--lum-ink-3` | `#645940` | `assets/components.css:11064` | `.bk-surface.lum-amber-deep` |
| 502 | `--lum-ink-4` | `#7c7052` | `assets/components.css:11064` | `.bk-surface.lum-amber-deep` |
| 503 | `--lum-base` | `#fffdf8` | `assets/components.css:11065` | `.bk-surface.lum-amber-deep` |
| 504 | `--lum-cloth` | `#e3d8c1` | `assets/components.css:11065` | `.bk-surface.lum-amber-deep` |
| 505 | `--lum-rose` | `#b8563f` | `assets/components.css:11065` | `.bk-surface.lum-amber-deep` |
| 506 | `--lum-gold` | `#a8761a` | `assets/components.css:11066` | `.bk-surface.lum-amber-deep` |
| 507 | `--lum-gold-l` | `#d9a441` | `assets/components.css:11066` | `.bk-surface.lum-amber-deep` |
| 508 | `--lum-gold-d` | `#855410` | `assets/components.css:11066` | `.bk-surface.lum-amber-deep` |
| 509 | `--lum-gold-ink` | `#3d2807` | `assets/components.css:11066` | `.bk-surface.lum-amber-deep` |
| 510 | `--lum-glass` | `linear-gradient(180deg,#fffdf8,#fdf8ea)` | `assets/components.css:11067` | `.bk-surface.lum-amber-deep` |
| 511 | `--lum-glass-bd` | `#e3d8c1` | `assets/components.css:11068` | `.bk-surface.lum-amber-deep` |
| 512 | `--lum-glass-bd-2` | `#e3d8c1` | `assets/components.css:11068` | `.bk-surface.lum-amber-deep` |
| 513 | `--bk-line` | `#e3d8c1` | `assets/components.css:11069` | `.bk-surface.lum-amber-deep` |
| 514 | `--bk-surface-2` | `#efe7d6` | `assets/components.css:11069` | `.bk-surface.lum-amber-deep` |
| 515 | `--bk-gold-deep` | `#855410` | `assets/components.css:11069` | `.bk-surface.lum-amber-deep` |
| 516 | `--bk-gold-hi` | `#d9a441` | `assets/components.css:11069` | `.bk-surface.lum-amber-deep` |
| 517 | `--bk-star` | `#ffce4a` | `assets/components.css:11070` | `.bk-surface.lum-amber-deep` |
| 518 | `--bk-cyan-text` | `#256b80` | `assets/components.css:11070` | `.bk-surface.lum-amber-deep` |
| 519 | `--bk-field-1` | `#f2c25a` | `assets/components.css:11071` | `.bk-surface.lum-amber-deep` |
| 520 | `--bk-field-2` | `#e07a52` | `assets/components.css:11071` | `.bk-surface.lum-amber-deep` |
| 521 | `--bk-field-3` | `#d98f8a` | `assets/components.css:11071` | `.bk-surface.lum-amber-deep` |
| 522 | `--bk-field-4` | `#f5bace` | `assets/components.css:11071` | `.bk-surface.lum-amber-deep` |
| 523 | `--bk-field-5` | `#a9b98c` | `assets/components.css:11071` | `.bk-surface.lum-amber-deep` |
| 524 | `--bk-field-6` | `#98d4b0` | `assets/components.css:11072` | `.bk-surface.lum-amber-deep` |
| 525 | `--bk-field-7` | `#8590d8` | `assets/components.css:11072` | `.bk-surface.lum-amber-deep` |
| 526 | `--bk-field-8` | `#f8e078` | `assets/components.css:11072` | `.bk-surface.lum-amber-deep` |
| 527 | `--bk-field-9` | `#e8b068` | `assets/components.css:11072` | `.bk-surface.lum-amber-deep` |
| 528 | `--bk-field-10` | `#b8896c` | `assets/components.css:11072` | `.bk-surface.lum-amber-deep` |
| 529 | `--lum-ink` | `#241710` | `assets/components.css:11622` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 530 | `--lum-ink-2` | `#645940` | `assets/components.css:11623` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 531 | `--lum-ink-3` | `#978b6d` | `assets/components.css:11624` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 532 | `--lum-ink-4` | `#b3a480` | `assets/components.css:11625` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 533 | `--lum-glass` | `linear-gradient(157deg, rgba(255,255,255,.66) 0%, rgba(255,246,222,.50) 100%)` | `assets/components.css:11626` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 534 | `--lum-glass-raised` | `linear-gradient(157deg, rgba(255,255,255,.82) 0%, rgba(255,248,230,.66) 100%)` | `assets/components.css:11627` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 535 | `--lum-glass-bd` | `#ddc794` | `assets/components.css:11628` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 536 | `--lum-glass-bd-2` | `#e9d9b4` | `assets/components.css:11629` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 537 | `--lum-gold` | `#c79433` | `assets/components.css:11630` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 538 | `--lum-gold-l` | `#d9a441` | `assets/components.css:11631` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 539 | `--lum-gold-d` | `#855410` | `assets/components.css:11632` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 540 | `--lum-gold-ink` | `#3d2807` | `assets/components.css:11633` | `.st-page.lum-amber-deep.stb-warm-dim,.st-build.lum-amber-deep.stb-wa…` |
| 541 | `--paper` | `#f4efe4` | `assets/components.css:12464` | `.shelf.lum-amber-deep` |
| 542 | `--ink` | `#241710` | `assets/components.css:12465` | `.shelf.lum-amber-deep` |
| 543 | `--gold` | `#a8761a` | `assets/components.css:12466` | `.shelf.lum-amber-deep` |
| 544 | `--gold-deep` | `#855410` | `assets/components.css:12467` | `.shelf.lum-amber-deep` |
| 545 | `--gold-hi` | `#d9a441` | `assets/components.css:12468` | `.shelf.lum-amber-deep` |
| 546 | `--lum-star` | `#ffce4a` | `assets/components.css:12469` | `.shelf.lum-amber-deep` |
| 547 | `--field-1` | `#f2c25a` | `assets/components.css:12473` | `.shelf.lum-amber-deep` |
| 548 | `--field-2` | `#e07a52` | `assets/components.css:12473` | `.shelf.lum-amber-deep` |
| 549 | `--field-3` | `#d98f8a` | `assets/components.css:12473` | `.shelf.lum-amber-deep` |
| 550 | `--field-4` | `#f5bace` | `assets/components.css:12473` | `.shelf.lum-amber-deep` |
| 551 | `--field-5` | `#a9b98c` | `assets/components.css:12473` | `.shelf.lum-amber-deep` |
| 552 | `--field-6` | `#98d4b0` | `assets/components.css:12474` | `.shelf.lum-amber-deep` |
| 553 | `--field-7` | `#8590d8` | `assets/components.css:12474` | `.shelf.lum-amber-deep` |
| 554 | `--field-8` | `#f8e078` | `assets/components.css:12474` | `.shelf.lum-amber-deep` |
| 555 | `--field-9` | `#e8b068` | `assets/components.css:12474` | `.shelf.lum-amber-deep` |
| 556 | `--field-10` | `#b8896c` | `assets/components.css:12474` | `.shelf.lum-amber-deep` |
| 557 | `--lum-base` | `#fffdf8` | `assets/components.css:12475` | `.shelf.lum-amber-deep` |
| 558 | `--lum-glass` | `#efe7d6` | `assets/components.css:12476` | `.shelf.lum-amber-deep` |
| 559 | `--lum-glass-bd` | `#e3d8c1` | `assets/components.css:12477` | `.shelf.lum-amber-deep` |
| 560 | `--lum-glass-bd-2` | `#e3d8c1` | `assets/components.css:12478` | `.shelf.lum-amber-deep` |
| 561 | `--lum-cloth` | `#e3d8c1` | `assets/components.css:12479` | `.shelf.lum-amber-deep` |
| 562 | `--lum-ink` | `#241710` | `assets/components.css:12480` | `.shelf.lum-amber-deep` |
| 563 | `--lum-ink-2` | `#645940` | `assets/components.css:12481` | `.shelf.lum-amber-deep` |
| 564 | `--lum-ink-3` | `#645940` | `assets/components.css:12482` | `.shelf.lum-amber-deep` |
| 565 | `--lum-ink-4` | `#978b6d` | `assets/components.css:12483` | `.shelf.lum-amber-deep` |
| 566 | `--lum-gold` | `#a8761a` | `assets/components.css:12484` | `.shelf.lum-amber-deep` |
| 567 | `--lum-gold-ink` | `#3d2807` | `assets/components.css:12485` | `.shelf.lum-amber-deep` |
| 568 | `--status-reading` | `var(--lum-star)` | `assets/components.css:12486` | `.shelf.lum-amber-deep` |
| 569 | `--status-read` | `#7bbf7b` | `assets/components.css:12644` | `.shelf.lum-amber-deep` |
| 570 | `--status-will` | `transparent` | `assets/components.css:12644` | `.shelf.lum-amber-deep` |
| 571 | `--ink-2` | `var(--card-ink-2)` | `assets/components.css:12795` | `.shelf.lum-amber-deep` |
| 572 | `--ink-3` | `var(--card-ink-2)` | `assets/components.css:12795` | `.shelf.lum-amber-deep` |
| 573 | `--ink-4` | `var(--card-meta)` | `assets/components.css:12795` | `.shelf.lum-amber-deep` |
| 574 | `--cap-h` | `var(--cap-h-now)` | `assets/components.css:12851` | `.shelf.lum-amber-deep .desk` |
| 575 | `--cover-w` | `96px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 576 | `--cover-h` | `144px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 577 | `--cover-w-now` | `114px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 578 | `--cover-h-now` | `170px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 579 | `--spine-w` | `28px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 580 | `--cap-h` | `72px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 581 | `--cap-h-lens` | `94px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 582 | `--cap-h-now` | `110px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 583 | `--row-gap` | `22px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 584 | `--col-gap` | `16px` | `assets/components.css:12864` | `.shelf.lum-amber-deep` |
| 585 | `--cap-h` | `var(--cap-h-lens)` | `assets/components.css:12869` | `.shelf.lum-amber-deep .focused-view` |
| 586 | `--cover-w` | `var(--cover-w-now)` | `assets/components.css:12904` | `.shelf.lum-amber-deep .cavity-cover.is-now` |
| 587 | `--cover-h` | `var(--cover-h-now)` | `assets/components.css:12904` | `.shelf.lum-amber-deep .cavity-cover.is-now` |
| 588 | `--cover-w` | `76px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 589 | `--cover-h` | `114px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 590 | `--spine-w` | `24px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 591 | `--cover-w-now` | `92px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 592 | `--cover-h-now` | `138px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 593 | `--cap-h` | `60px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 594 | `--cap-h-lens` | `80px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 595 | `--cap-h-now` | `104px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 596 | `--row-gap` | `18px` | `assets/components.css:13033` | `@media (max-width:759px) > .shelf.lum-amber-deep` |
| 597 | `--m1` | `var(--m1-on-ground)` | `assets/components.css:13137` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 598 | `--m1-edge` | `var(--m1-edge-on-ground)` | `assets/components.css:13141` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 599 | `--subtheory-1` | `var(--m1-on-ground)` | `assets/components.css:13155` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 600 | `--subtheory-1-edge` | `var(--m1-edge-on-ground)` | `assets/components.css:13155` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 601 | `--subtheory-6` | `var(--m1-on-ground)` | `assets/components.css:13156` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 602 | `--subtheory-6-edge` | `var(--m1-edge-on-ground)` | `assets/components.css:13156` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 603 | `--subtheory-11` | `var(--m1-on-ground)` | `assets/components.css:13157` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 604 | `--subtheory-11-edge` | `var(--m1-edge-on-ground)` | `assets/components.css:13157` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 605 | `--subtheory-16` | `var(--m1-on-ground)` | `assets/components.css:13158` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 606 | `--subtheory-16-edge` | `var(--m1-edge-on-ground)` | `assets/components.css:13158` | `.arcfield .arc-detail-web-view,.home-arc-ff,.home-wf` |
| 607 | `--lum-base` | `#f6ecd4` | `assets/components.css:13349` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 608 | `--lum-glass` | `#f6ecd4` | `assets/components.css:13349` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 609 | `--lum-cloth` | `#e3d8c1` | `assets/components.css:13349` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 610 | `--lum-glass-bd` | `#d9c391` | `assets/components.css:13350` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 611 | `--lum-glass-bd-2` | `#d9c391` | `assets/components.css:13350` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 612 | `--lum-ink` | `#241710` | `assets/components.css:13351` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 613 | `--lum-ink-2` | `#645940` | `assets/components.css:13351` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 614 | `--lum-ink-3` | `#645940` | `assets/components.css:13351` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 615 | `--lum-ink-4` | `#978b6d` | `assets/components.css:13351` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 616 | `--lum-gold` | `#a8761a` | `assets/components.css:13352` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 617 | `--lum-gold-l` | `#c79433` | `assets/components.css:13352` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 618 | `--lum-gold-d` | `#855410` | `assets/components.css:13352` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 619 | `--lum-gold-ink` | `#3d2807` | `assets/components.css:13352` | `.arcfield.arcfield-warm .arcfield-head,.arcfield.arcfield-warm .arcf…` |
| 620 | `--paper` | `transparent` | `assets/components.css:13754` | `.home-page.lum-amber-deep` |
| 621 | `--ink` | `var(--on-ground)` | `assets/components.css:13755` | `.home-page.lum-amber-deep` |
| 622 | `--gold` | `var(--gold-world)` | `assets/components.css:13756` | `.home-page.lum-amber-deep` |
| 623 | `--gold-deep` | `var(--gold-ember)` | `assets/components.css:13757` | `.home-page.lum-amber-deep` |
| 624 | `--gold-hi` | `#d9a441` | `assets/components.css:13759` | `.home-page.lum-amber-deep` |
| 625 | `--lum-star` | `#ffce4a` | `assets/components.css:13760` | `.home-page.lum-amber-deep` |
| 626 | `--field-1` | `#f2c25a` | `assets/components.css:13761` | `.home-page.lum-amber-deep` |
| 627 | `--field-2` | `#e07a52` | `assets/components.css:13761` | `.home-page.lum-amber-deep` |
| 628 | `--field-3` | `#d98f8a` | `assets/components.css:13761` | `.home-page.lum-amber-deep` |
| 629 | `--field-4` | `#f5bace` | `assets/components.css:13761` | `.home-page.lum-amber-deep` |
| 630 | `--field-5` | `#a9b98c` | `assets/components.css:13761` | `.home-page.lum-amber-deep` |
| 631 | `--field-6` | `#98d4b0` | `assets/components.css:13762` | `.home-page.lum-amber-deep` |
| 632 | `--field-7` | `#8590d8` | `assets/components.css:13762` | `.home-page.lum-amber-deep` |
| 633 | `--field-8` | `#f8e078` | `assets/components.css:13762` | `.home-page.lum-amber-deep` |
| 634 | `--field-9` | `#e8b068` | `assets/components.css:13762` | `.home-page.lum-amber-deep` |
| 635 | `--field-10` | `#b8896c` | `assets/components.css:13762` | `.home-page.lum-amber-deep` |
| 636 | `--lum-base` | `#fffdf8` | `assets/components.css:13763` | `.home-page.lum-amber-deep` |
| 637 | `--lum-glass` | `#efe7d6` | `assets/components.css:13764` | `.home-page.lum-amber-deep` |
| 638 | `--lum-glass-bd` | `#e3d8c1` | `assets/components.css:13765` | `.home-page.lum-amber-deep` |
| 639 | `--lum-glass-bd-2` | `#e3d8c1` | `assets/components.css:13766` | `.home-page.lum-amber-deep` |
| 640 | `--lum-cloth` | `#e3d8c1` | `assets/components.css:13767` | `.home-page.lum-amber-deep` |
| 641 | `--lum-ink` | `var(--on-ground)` | `assets/components.css:13770` | `.home-page.lum-amber-deep` |
| 642 | `--lum-ink-2` | `var(--on-ground-2)` | `assets/components.css:13771` | `.home-page.lum-amber-deep` |
| 643 | `--lum-ink-3` | `var(--on-ground-2)` | `assets/components.css:13772` | `.home-page.lum-amber-deep` |
| 644 | `--lum-ink-4` | `var(--on-ground-3)` | `assets/components.css:13773` | `.home-page.lum-amber-deep` |
| 645 | `--lum-gold` | `var(--gold-world)` | `assets/components.css:13774` | `.home-page.lum-amber-deep` |
| 646 | `--lum-gold-ink` | `#3d2807` | `assets/components.css:13775` | `.home-page.lum-amber-deep` |
| 647 | `--ink-2` | `var(--on-ground-2)` | `assets/components.css:13795` | `.home-page.lum-amber-deep` |
| 648 | `--ink-3` | `var(--on-ground-2)` | `assets/components.css:13796` | `.home-page.lum-amber-deep` |
| 649 | `--ink-4` | `var(--on-ground-3)` | `assets/components.css:13797` | `.home-page.lum-amber-deep` |
| 650 | `--sunk` | `#2E3446` | `assets/components.css:13798` | `.home-page.lum-amber-deep` |
| 651 | `--ink` | `var(--card-ink)` | `assets/components.css:13853` | `.lit-page` |
| 652 | `--ink-2` | `var(--card-ink-2)` | `assets/components.css:13854` | `.lit-page` |
| 653 | `--ink-3` | `var(--card-meta)` | `assets/components.css:13855` | `.lit-page` |
| 654 | `--ink-4` | `var(--card-meta)` | `assets/components.css:13856` | `.lit-page` |
| 655 | `--lum-ink` | `var(--card-ink)` | `assets/components.css:13857` | `.lit-page` |
| 656 | `--lum-ink-2` | `var(--card-ink-2)` | `assets/components.css:13858` | `.lit-page` |
| 657 | `--lum-ink-3` | `var(--card-meta)` | `assets/components.css:13859` | `.lit-page` |
| 658 | `--lum-ink-4` | `var(--card-meta)` | `assets/components.css:13860` | `.lit-page` |
| 659 | `--paper` | `var(--card-1)` | `assets/components.css:13861` | `.lit-page` |
| 660 | `--sunk` | `#e3d4b0` | `assets/components.css:13862` | `.lit-page` |
| 661 | `--gold` | `var(--gold-on-card)` | `assets/components.css:13864` | `.lit-page` |
| 662 | `--gold-deep` | `var(--gold-on-card)` | `assets/components.css:13865` | `.lit-page` |
| 663 | `--lum-gold` | `var(--gold-on-card)` | `assets/components.css:13866` | `.lit-page` |
| 664 | `--border` | `rgba(38,32,25,.14)` | `assets/components.css:13867` | `.lit-page` |
| 665 | `--thread-x` | `8px` | `assets/components.css:13936` | `.home-page.lum-amber-deep .home-variant,.home-page.lum-amber-deep.ho…` |
| 666 | `--thread-w` | `1px` | `assets/components.css:13937` | `.home-page.lum-amber-deep .home-variant,.home-page.lum-amber-deep.ho…` |
| 667 | `--thread-pad` | `34px` | `assets/components.css:13938` | `.home-page.lum-amber-deep .home-variant,.home-page.lum-amber-deep.ho…` |
| 668 | `--thread-r` | `4px` | `assets/components.css:13939` | `.home-page.lum-amber-deep .home-variant,.home-page.lum-amber-deep.ho…` |
| 669 | `--paper` | `#f4efe4` | `assets/components.css:14179` | `.notebook.lum-amber-deep` |
| 670 | `--ink` | `#241710` | `assets/components.css:14180` | `.notebook.lum-amber-deep` |
| 671 | `--gold` | `#a8761a` | `assets/components.css:14181` | `.notebook.lum-amber-deep` |
| 672 | `--gold-deep` | `#855410` | `assets/components.css:14182` | `.notebook.lum-amber-deep` |
| 673 | `--gold-hi` | `#d9a441` | `assets/components.css:14183` | `.notebook.lum-amber-deep` |
| 674 | `--lum-star` | `#ffce4a` | `assets/components.css:14184` | `.notebook.lum-amber-deep` |
| 675 | `--field-1` | `#f2c25a` | `assets/components.css:14185` | `.notebook.lum-amber-deep` |
| 676 | `--lum-base` | `#fffdf8` | `assets/components.css:14187` | `.notebook.lum-amber-deep` |
| 677 | `--lum-glass` | `#efe7d6` | `assets/components.css:14188` | `.notebook.lum-amber-deep` |
| 678 | `--lum-glass-bd` | `#e3d8c1` | `assets/components.css:14189` | `.notebook.lum-amber-deep` |
| 679 | `--lum-glass-bd-2` | `#e3d8c1` | `assets/components.css:14190` | `.notebook.lum-amber-deep` |
| 680 | `--lum-cloth` | `#c9b7a0` | `assets/components.css:14191` | `.notebook.lum-amber-deep` |
| 681 | `--lum-ink` | `#241710` | `assets/components.css:14193` | `.notebook.lum-amber-deep` |
| 682 | `--lum-ink-2` | `#645940` | `assets/components.css:14194` | `.notebook.lum-amber-deep` |
| 683 | `--lum-ink-3` | `#645940` | `assets/components.css:14195` | `.notebook.lum-amber-deep` |
| 684 | `--lum-ink-4` | `#978b6d` | `assets/components.css:14196` | `.notebook.lum-amber-deep` |
| 685 | `--lum-gold` | `#a8761a` | `assets/components.css:14197` | `.notebook.lum-amber-deep` |
| 686 | `--lum-gold-l` | `#d9a441` | `assets/components.css:14198` | `.notebook.lum-amber-deep` |
| 687 | `--lum-gold-d` | `#855410` | `assets/components.css:14199` | `.notebook.lum-amber-deep` |
| 688 | `--lum-gold-ink` | `#3d2807` | `assets/components.css:14200` | `.notebook.lum-amber-deep` |
| 689 | `--marginalia-color` | `#2f7d73` | `assets/components.css:14202` | `.notebook.lum-amber-deep` |
| 690 | `--question-color` | `#2f4a75` | `assets/components.css:14203` | `.notebook.lum-amber-deep` |
| 691 | `--journal-color` | `#5f4f96` | `assets/components.css:14204` | `.notebook.lum-amber-deep` |
| 692 | `--lum-cyan` | `#256b80` | `assets/components.css:14205` | `.notebook.lum-amber-deep` |
| 693 | `--lum-rose` | `#b8563f` | `assets/components.css:14206` | `.notebook.lum-amber-deep` |
| 694 | `--u-ground-2` | `#eee4cd` | `assets/components.css:14209` | `.notebook.lum-amber-deep` |
| 695 | `--u-sheet-1` | `#fffdf6` | `assets/components.css:14210` | `.notebook.lum-amber-deep` |
| 696 | `--u-sheet-2` | `#fdf8ea` | `assets/components.css:14211` | `.notebook.lum-amber-deep` |
| 697 | `--u-spread-2` | `#fbf4e5` | `assets/components.css:14212` | `.notebook.lum-amber-deep` |
| 698 | `--u-chip` | `#f4ecdb` | `assets/components.css:14213` | `.notebook.lum-amber-deep` |
| 699 | `--u-panel-1` | `#f6ead0` | `assets/components.css:14214` | `.notebook.lum-amber-deep` |
| 700 | `--u-panel-2` | `#efe1c2` | `assets/components.css:14215` | `.notebook.lum-amber-deep` |
| 701 | `--u-gathered` | `#fbefcf` | `assets/components.css:14216` | `.notebook.lum-amber-deep` |
| 702 | `--u-toggle-off` | `#e7ddc9` | `assets/components.css:14217` | `.notebook.lum-amber-deep` |
| 703 | `--u-seg-2` | `#e0a838` | `assets/components.css:14218` | `.notebook.lum-amber-deep` |
| 704 | `--u-cloth-2` | `#6f5a3c` | `assets/components.css:14219` | `.notebook.lum-amber-deep` |
| 705 | `--u-shot-1` | `#d8c9b0` | `assets/components.css:14220` | `.notebook.lum-amber-deep` |
| 706 | `--u-shot-2` | `#b09a7c` | `assets/components.css:14221` | `.notebook.lum-amber-deep` |
| 707 | `--u-teal-deep` | `#1f5a6b` | `assets/components.css:14222` | `.notebook.lum-amber-deep` |
| 708 | `--u-teal-mid` | `#4a9fb8` | `assets/components.css:14223` | `.notebook.lum-amber-deep` |
| 709 | `--u-orb-hi` | `#fff4d6` | `assets/components.css:14224` | `.notebook.lum-amber-deep` |
| 710 | `--u-white` | `#fff` | `assets/components.css:14225` | `.notebook.lum-amber-deep` |
| 711 | `--ink` | `var(--lum-ink)` | `assets/components.css:14446` | `.account.lum-amber-ember` |
| 712 | `--ink-2` | `var(--lum-ink-2)` | `assets/components.css:14446` | `.account.lum-amber-ember` |
| 713 | `--ink-3` | `var(--lum-ink-3)` | `assets/components.css:14447` | `.account.lum-amber-ember` |
| 714 | `--ink-4` | `var(--lum-ink-4)` | `assets/components.css:14447` | `.account.lum-amber-ember` |
| 715 | `--text-d` | `var(--lum-ink)` | `assets/components.css:14448` | `.account.lum-amber-ember` |
| 716 | `--muted` | `var(--lum-ink-3)` | `assets/components.css:14448` | `.account.lum-amber-ember` |
| 717 | `--gold` | `var(--lum-gold)` | `assets/components.css:14449` | `.account.lum-amber-ember` |
| 718 | `--gold-light` | `var(--lum-gold-l)` | `assets/components.css:14449` | `.account.lum-amber-ember` |
| 719 | `--text-on-dark` | `var(--lum-gold-ink)` | `assets/components.css:14450` | `.account.lum-amber-ember` |
| 720 | `--border` | `var(--lum-glass-bd-2)` | `assets/components.css:14450` | `.account.lum-amber-ember` |
| 721 | `--danger` | `var(--lum-coral)` | `assets/components.css:14451` | `.account.lum-amber-ember` |
| 722 | `--surface` | `color-mix(in srgb, var(--lum-ink) 4%, transparent)` | `assets/components.css:14452` | `.account.lum-amber-ember` |
| 723 | `--surface-2` | `color-mix(in srgb, var(--lum-ink) 6%, transparent)` | `assets/components.css:14453` | `.account.lum-amber-ember` |
| 724 | `--surface-d` | `color-mix(in srgb, var(--lum-ink) 6%, transparent)` | `assets/components.css:14454` | `.account.lum-amber-ember` |
| 725 | `--shadow-1` | `0 18px 40px -30px rgba(0,0,0,.6)` | `assets/components.css:14455` | `.account.lum-amber-ember` |
| 726 | `--shadow-d` | `0 18px 44px -28px rgba(0,0,0,.6)` | `assets/components.css:14456` | `.account.lum-amber-ember` |
| 727 | `--grad` | `linear-gradient(150deg, var(--lum-gold-l), var(--lum-coral))` | `assets/components.css:14457` | `.account.lum-amber-ember` |
| 728 | `--vr-ink` | `#241710` | `assets/components.css:15203` | `.vr-card` |
| 729 | `--vr-ink-2` | `#645940` | `assets/components.css:15203` | `.vr-card` |
| 730 | `--vr-ink-3` | `#7c7052` | `assets/components.css:15203` | `.vr-card` |
| 731 | `--vr-card` | `#fcf6e8` | `assets/components.css:15204` | `.vr-card` |
| 732 | `--vr-field` | `#fffdf8` | `assets/components.css:15204` | `.vr-card` |
| 733 | `--vr-line` | `rgba(36,23,16,.16)` | `assets/components.css:15205` | `.vr-card` |
| 734 | `--vr-gold` | `#a8761a` | `assets/components.css:15206` | `.vr-card` |
| 735 | `--vr-gold-d` | `#855410` | `assets/components.css:15206` | `.vr-card` |
| 736 | `--vr-gold-hi` | `#d9a441` | `assets/components.css:15206` | `.vr-card` |
| 737 | `--vr-gold-ink` | `#3d2807` | `assets/components.css:15206` | `.vr-card` |
| 738 | `--vr-orb-hi` | `#fff4d6` | `assets/components.css:15206` | `.vr-card` |
| 739 | `--vr-rose` | `#b8563f` | `assets/components.css:15207` | `.vr-card` |
| 740 | `--ink` | `#241710` | `assets/components.css:15321` | `.pf-root` |
| 741 | `--ink-2` | `#645940` | `assets/components.css:15321` | `.pf-root` |
| 742 | `--ink-3` | `#978b6d` | `assets/components.css:15321` | `.pf-root` |
| 743 | `--ink-4` | `#978b6d` | `assets/components.css:15321` | `.pf-root` |
| 744 | `--surface` | `#fffdf8` | `assets/components.css:15322` | `.pf-root` |
| 745 | `--surface-2` | `#efe7d6` | `assets/components.css:15322` | `.pf-root` |
| 746 | `--border` | `#e3d8c1` | `assets/components.css:15322` | `.pf-root` |
| 747 | `--line` | `#e3d8c1` | `assets/components.css:15322` | `.pf-root` |
| 748 | `--line-2` | `#e3d8c1` | `assets/components.css:15322` | `.pf-root` |
| 749 | `--gold` | `#a8761a` | `assets/components.css:15323` | `.pf-root` |
| 750 | `--gold-deep` | `#855410` | `assets/components.css:15323` | `.pf-root` |
| 751 | `--gold-hi` | `#d9a441` | `assets/components.css:15323` | `.pf-root` |
| 752 | `--gold-light` | `#d9a441` | `assets/components.css:15323` | `.pf-root` |
| 753 | `--star-gold` | `#ffce4a` | `assets/components.css:15323` | `.pf-root` |
| 754 | `--thread` | `#c2a463` | `assets/components.css:15324` | `.pf-root` |
| 755 | `--field-1` | `#f2c25a` | `assets/components.css:15326` | `.pf-root` |
| 756 | `--field-2` | `#e07a52` | `assets/components.css:15326` | `.pf-root` |
| 757 | `--field-3` | `#d98f8a` | `assets/components.css:15326` | `.pf-root` |
| 758 | `--field-4` | `#f5bace` | `assets/components.css:15326` | `.pf-root` |
| 759 | `--field-5` | `#a9b98c` | `assets/components.css:15326` | `.pf-root` |
| 760 | `--field-6` | `#98d4b0` | `assets/components.css:15327` | `.pf-root` |
| 761 | `--field-7` | `#8590d8` | `assets/components.css:15327` | `.pf-root` |
| 762 | `--field-8` | `#f8e078` | `assets/components.css:15327` | `.pf-root` |
| 763 | `--field-9` | `#e8b068` | `assets/components.css:15327` | `.pf-root` |
| 764 | `--field-10` | `#b8896c` | `assets/components.css:15327` | `.pf-root` |
| 765 | `--br-deep` | `#1c1209` | `assets/components.css:15329` | `.pf-root` |
| 766 | `--sunk-d` | `#241406` | `assets/components.css:15329` | `.pf-root` |
| 767 | `--scrim` | `rgba(15,9,4,.6)` | `assets/components.css:15329` | `.pf-root` |
| 768 | `--text-on-dark` | `#f0e3c8` | `assets/components.css:15329` | `.pf-root` |
| 769 | `--radius` | `16px` | `assets/components.css:15330` | `.pf-root` |
| 770 | `--ink` | `var(--card-ink)` | `assets/components.css:16109` | `.arcfield.af-world` |
| 771 | `--ink-2` | `var(--card-ink-2)` | `assets/components.css:16109` | `.arcfield.af-world` |
| 772 | `--ink-3` | `var(--card-meta)` | `assets/components.css:16109` | `.arcfield.af-world` |
| 773 | `--floating-stack-h` | `160px` | `assets/components.css:16522` | `:root` |
| 774 | `--space-3xs` | `2px` | `assets/praxis-kit.css:24` | `:root` |
| 775 | `--space-2xs` | `4px` | `assets/praxis-kit.css:24` | `:root` |
| 776 | `--space-xs` | `8px` | `assets/praxis-kit.css:24` | `:root` |
| 777 | `--space-sm` | `12px` | `assets/praxis-kit.css:24` | `:root` |
| 778 | `--space-md` | `16px` | `assets/praxis-kit.css:25` | `:root` |
| 779 | `--space-lg` | `24px` | `assets/praxis-kit.css:25` | `:root` |
| 780 | `--space-xl` | `32px` | `assets/praxis-kit.css:25` | `:root` |
| 781 | `--space-2xl` | `48px` | `assets/praxis-kit.css:25` | `:root` |
| 782 | `--space-3xl` | `64px` | `assets/praxis-kit.css:25` | `:root` |
| 783 | `--grid-cols` | `4` | `assets/praxis-kit.css:27` | `:root` |
| 784 | `--measure` | `66ch` | `assets/praxis-kit.css:27` | `:root` |
| 785 | `--gutter` | `var(--space-lg)` | `assets/praxis-kit.css:27` | `:root` |
| 786 | `--fs-display` | `clamp(30px,4.2vw,46px)` | `assets/praxis-kit.css:29` | `:root` |
| 787 | `--lh-display` | `1.04` | `assets/praxis-kit.css:29` | `:root` |
| 788 | `--ff-display` | `var(--font-serif,'Cormorant Garamond',serif)` | `assets/praxis-kit.css:29` | `:root` |
| 789 | `--fs-title` | `26px` | `assets/praxis-kit.css:30` | `:root` |
| 790 | `--lh-title` | `1.12` | `assets/praxis-kit.css:30` | `:root` |
| 791 | `--ff-title` | `var(--font-serif,'Cormorant Garamond',serif)` | `assets/praxis-kit.css:30` | `:root` |
| 792 | `--fs-heading` | `18px` | `assets/praxis-kit.css:31` | `:root` |
| 793 | `--lh-heading` | `1.3` | `assets/praxis-kit.css:31` | `:root` |
| 794 | `--ff-heading` | `var(--font-body,'DM Sans',sans-serif)` | `assets/praxis-kit.css:31` | `:root` |
| 795 | `--fs-body` | `15px` | `assets/praxis-kit.css:32` | `:root` |
| 796 | `--lh-body` | `1.55` | `assets/praxis-kit.css:32` | `:root` |
| 797 | `--ff-body` | `var(--font-body,'DM Sans',sans-serif)` | `assets/praxis-kit.css:32` | `:root` |
| 798 | `--fs-meta` | `12px` | `assets/praxis-kit.css:33` | `:root` |
| 799 | `--lh-meta` | `1.3` | `assets/praxis-kit.css:33` | `:root` |
| 800 | `--ff-meta` | `var(--font-mono,'DM Mono',monospace)` | `assets/praxis-kit.css:33` | `:root` |
| 801 | `--fs-reader` | `17px` | `assets/praxis-kit.css:34` | `:root` |
| 802 | `--lh-reader` | `1.5` | `assets/praxis-kit.css:34` | `:root` |
| 803 | `--ff-reader` | `var(--font-serif,'Cormorant Garamond',serif)` | `assets/praxis-kit.css:34` | `:root` |
| 804 | `--dur-fast` | `150ms` | `assets/praxis-kit.css:36` | `:root` |
| 805 | `--dur-gentle` | `300ms` | `assets/praxis-kit.css:36` | `:root` |
| 806 | `--ease-standard` | `cubic-bezier(.22,1,.36,1)` | `assets/praxis-kit.css:37` | `:root` |
| 807 | `--ease-emphasis` | `cubic-bezier(.34,1.2,.5,1)` | `assets/praxis-kit.css:37` | `:root` |
| 808 | `--grid-cols` | `8` | `assets/praxis-kit.css:39` | `@media (min-width:760px) > :root` |
| 809 | `--measure` | `70ch` | `assets/praxis-kit.css:39` | `@media (min-width:760px) > :root` |
| 810 | `--grid-cols` | `12` | `assets/praxis-kit.css:40` | `@media (min-width:1600px) > :root` |
| 811 | `--measure` | `72ch` | `assets/praxis-kit.css:40` | `@media (min-width:1600px) > :root` |
| 812 | `--gold-hi` | `#d9a441` | `docs/studio/universal-depth.css:38` | `:root` |
| 813 | `--lum-gold` | `#ffce4a` | `docs/studio/universal-depth.css:39` | `:root` |
| 814 | `--thread` | `#c2a463` | `docs/studio/universal-depth.css:40` | `:root` |
| 815 | `--field-1` | `#f2c25a` | `docs/studio/universal-depth.css:42` | `:root` |
| 816 | `--field-2` | `#e07a52` | `docs/studio/universal-depth.css:42` | `:root` |
| 817 | `--field-3` | `#d98f8a` | `docs/studio/universal-depth.css:42` | `:root` |
| 818 | `--field-4` | `#f5bace` | `docs/studio/universal-depth.css:42` | `:root` |
| 819 | `--field-5` | `#a9b98c` | `docs/studio/universal-depth.css:42` | `:root` |
| 820 | `--field-6` | `#98d4b0` | `docs/studio/universal-depth.css:43` | `:root` |
| 821 | `--field-7` | `#8590d8` | `docs/studio/universal-depth.css:43` | `:root` |
| 822 | `--field-8` | `#f8e078` | `docs/studio/universal-depth.css:43` | `:root` |
| 823 | `--field-9` | `#e8b068` | `docs/studio/universal-depth.css:43` | `:root` |
| 824 | `--field-10` | `#b8896c` | `docs/studio/universal-depth.css:43` | `:root` |
| 825 | `--orb-hi` | `#fff4d6` | `docs/studio/universal-depth.css:58` | `.u-orb` |
| 826 | `--orb-hue` | `var(--field-1)` | `docs/studio/universal-depth.css:59` | `.u-orb` |
| 827 | `--orb-deep` | `var(--gold-deep)` | `docs/studio/universal-depth.css:60` | `.u-orb` |
| 828 | `--orb-glow` | `rgba(242,194,90,.55)` | `docs/studio/universal-depth.css:61` | `.u-orb` |
| 829 | `--orb-r` | `10px` | `docs/studio/universal-depth.css:62` | `.u-orb` |
| 830 | `--orb-s` | `2px` | `docs/studio/universal-depth.css:63` | `.u-orb` |
| 831 | `--orb-r` | `13px` | `docs/studio/universal-depth.css:67` | `.u-orb--lit` |
| 832 | `--orb-s` | `3px` | `docs/studio/universal-depth.css:67` | `.u-orb--lit` |
| 833 | `--orb-r` | `6px` | `docs/studio/universal-depth.css:68` | `.u-orb--soft` |
| 834 | `--orb-s` | `1px` | `docs/studio/universal-depth.css:68` | `.u-orb--soft` |
| 835 | `--orb-hue` | `var(--field-1)` | `docs/studio/universal-depth.css:71` | `.u-orb--amber` |
| 836 | `--orb-deep` | `#8a5a12` | `docs/studio/universal-depth.css:71` | `.u-orb--amber` |
| 837 | `--orb-glow` | `rgba(242,194,90,.55)` | `docs/studio/universal-depth.css:71` | `.u-orb--amber` |
| 838 | `--orb-hue` | `var(--field-2)` | `docs/studio/universal-depth.css:72` | `.u-orb--coral` |
| 839 | `--orb-deep` | `#8f3f22` | `docs/studio/universal-depth.css:72` | `.u-orb--coral` |
| 840 | `--orb-glow` | `rgba(224,122,82,.5)` | `docs/studio/universal-depth.css:72` | `.u-orb--coral` |
| 841 | `--orb-hue` | `var(--field-3)` | `docs/studio/universal-depth.css:73` | `.u-orb--rose` |
| 842 | `--orb-deep` | `#7d4642` | `docs/studio/universal-depth.css:73` | `.u-orb--rose` |
| 843 | `--orb-glow` | `rgba(217,143,138,.5)` | `docs/studio/universal-depth.css:73` | `.u-orb--rose` |
| 844 | `--orb-hue` | `var(--field-4)` | `docs/studio/universal-depth.css:74` | `.u-orb--pink` |
| 845 | `--orb-deep` | `#9a5f70` | `docs/studio/universal-depth.css:74` | `.u-orb--pink` |
| 846 | `--orb-glow` | `rgba(245,186,206,.5)` | `docs/studio/universal-depth.css:74` | `.u-orb--pink` |
| 847 | `--orb-hue` | `var(--field-5)` | `docs/studio/universal-depth.css:75` | `.u-orb--sage` |
| 848 | `--orb-deep` | `#5f6d45` | `docs/studio/universal-depth.css:75` | `.u-orb--sage` |
| 849 | `--orb-glow` | `rgba(169,185,140,.5)` | `docs/studio/universal-depth.css:75` | `.u-orb--sage` |
| 850 | `--orb-hue` | `var(--field-6)` | `docs/studio/universal-depth.css:76` | `.u-orb--mint` |
| 851 | `--orb-deep` | `#3f7a5c` | `docs/studio/universal-depth.css:76` | `.u-orb--mint` |
| 852 | `--orb-glow` | `rgba(152,212,176,.5)` | `docs/studio/universal-depth.css:76` | `.u-orb--mint` |
| 853 | `--orb-hue` | `var(--field-7)` | `docs/studio/universal-depth.css:77` | `.u-orb--periwinkle` |
| 854 | `--orb-deep` | `#3f477e` | `docs/studio/universal-depth.css:77` | `.u-orb--periwinkle` |
| 855 | `--orb-glow` | `rgba(133,144,216,.5)` | `docs/studio/universal-depth.css:77` | `.u-orb--periwinkle` |
| 856 | `--orb-hue` | `var(--field-8)` | `docs/studio/universal-depth.css:78` | `.u-orb--palegold` |
| 857 | `--orb-deep` | `#8a7a20` | `docs/studio/universal-depth.css:78` | `.u-orb--palegold` |
| 858 | `--orb-glow` | `rgba(248,224,120,.5)` | `docs/studio/universal-depth.css:78` | `.u-orb--palegold` |
| 859 | `--orb-hue` | `var(--field-9)` | `docs/studio/universal-depth.css:79` | `.u-orb--honey` |
| 860 | `--orb-deep` | `#8a5f28` | `docs/studio/universal-depth.css:79` | `.u-orb--honey` |
| 861 | `--orb-glow` | `rgba(232,176,104,.5)` | `docs/studio/universal-depth.css:79` | `.u-orb--honey` |
| 862 | `--orb-hue` | `var(--field-10)` | `docs/studio/universal-depth.css:80` | `.u-orb--russet` |
| 863 | `--orb-deep` | `#6d4a34` | `docs/studio/universal-depth.css:80` | `.u-orb--russet` |
| 864 | `--orb-glow` | `rgba(184,137,108,.5)` | `docs/studio/universal-depth.css:80` | `.u-orb--russet` |
| 865 | `--glyph-hue` | `var(--field-5)` | `docs/studio/universal-depth.css:138` | `.u-glyph-margin` |
| 866 | `--glyph-hue` | `var(--field-3)` | `docs/studio/universal-depth.css:139` | `.u-glyph-seam` |
| 867 | `--glyph-hue` | `var(--field-7)` | `docs/studio/universal-depth.css:140` | `.u-glyph-seam-drop` |
| 868 | `--glyph-hue` | `var(--field-7)` | `docs/studio/universal-depth.css:141` | `.u-glyph-question` |
| 869 | `--glyph-hue` | `var(--field-9)` | `docs/studio/universal-depth.css:142` | `.u-glyph-journal` |
| 870 | `--glyph-hue` | `var(--field-1)` | `docs/studio/universal-depth.css:143` | `.u-glyph-subtheory` |
| 871 | `--glyph-hue` | `var(--field-10)` | `docs/studio/universal-depth.css:144` | `.u-glyph-book` |
| 872 | `--glyph-hue` | `var(--gold-hi)` | `docs/studio/universal-depth.css:145` | `.u-glyph-value` |
