# DW-1 recon — Desktop Wave batch 1: ABOUT + ARCS + body-margin

STARTED. Read-only Stage 0. HEAD `10e0a27` (== origin/main; the docs-only
F-PX1 probe-evidence commit sitting on `3e488d4` Builder 1d — the sanctioned
"descendant is fine" case). No app file touched this stage.

## 0a — Gates (ALL PASS)

| Gate | Result |
|---|---|
| `HEAD == origin/main` | ✅ both `10e0a27393abb994742de1896ca933c3786ef6ad` |
| HEAD is `3e488d4` or descendant | ✅ `10e0a27` = F-PX1 probe-evidence on top of `3e488d4` Builder 1d |
| Tree clean (tracked) | ✅ zero modified/staged tracked files (only pre-existing untracked scratch — the D0 porcelain-guard case) |
| builder.html Round Records | ✅ grep `round record` = 6 |
| builder.html NOW banner | ✅ grep `NOW` = 84 |
| ground-truth | ✅ hook ARMED, FIX-PROTOCOL v1.2, 7 agents present |
| local sw.js | `praxis-v3.203` |
| LIVE sw.js ×2 cache-busted | ✅ `praxis-v3.203` on both `?dwprobe=1` and `?dwprobe=2` (praxis-reading.netlify.app) |

## 0b — Rig

- Python unavailable on this box (Windows Store stub only). Static server =
  PowerShell `System.Net.HttpListener` on **http://localhost:8763/** (fresh port;
  8760 OS-reserved), no-store headers, localhost bind (no urlacl needed).
  Script: scratchpad `serve.ps1`, background task `bq1ognuj1`.
- Browser pane (mcp__Claude_Browser__*) at the local rig. **SW-CLEAR done**
  (1 registration unregistered, cache `praxis-v3.203` deleted), then reload.
- Transition/animation kill injected (`*{transition:none!important;animation:none!important}`,
  persists in `<head>` across renderRoute).
- Measurement = live DOM geometry (getBoundingClientRect / getComputedStyle /
  scrollingElement.scrollWidth) + canvas-based ch (content-box width ÷ width('0')
  in the element's computed font). Console clean on both surfaces.
- Auth stub = `sv('praxis_user', {uid:'d0tester',…})` (getCurrentUser = ls('praxis_user'),
  integrations.js:660). Arcs fixture injected in-memory: 3 owned arcs (`dw_arc_1..3`) +
  4 subs (`dw_sub_1..4`) → the signed-in "Your arcs" grid renders (3 cards + Start tile).
  renderRoute() called directly to dodge the same-hash no-op.

## Re-anchored live line numbers (ledger frontmatter is drifted)

- `renderAbout` → **js/views.js:20563** (about.md frontmatter says 18330 — stale).
- `renderArcsPage` → **js/views.js:3680** (arcs.md frontmatter says 3581; State says 3458;
  R5 mockup-eval said 3544 — all drifted). `.arcs-teach` set at **views.js:3714**.
- `renderRoute` → js/views.js:350.
- About root: `<section class="about">` (single class, DARK ground). Governor
  `.about{max-width:640px; padding:64px 24px 90px}` **components.css:9307–9312**.
  Prose already ch-capped: `.about .sect p` **56ch** (:9335), `.about .model-cap` 56ch (:9368).
  **No min-width block touches About.** Mobile: `@media(max-width:759px)` **:9437–9441**
  (+ reduced-motion :9431).
- Arcs root: `<section class="arcs lum-amber-deep">` (LIGHT skin — re-points tokens to a
  parchment set, components.css:1707–1718). Governor `.arcs.lum-amber-deep > *{max-width:1080px;
  margin:auto}` **components.css:1721** (root itself is `max-width:none` full-bleed, :1705–1720).
  Grid `.arcs.lum-amber-deep .arcs-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  grid-auto-rows:1fr}` **:1734**. **`.arcs-teach` is UNCAPPED** (:1653 / :1724 — no max-width/ch).
  `.arcs-head{max-width:680px}` (:1651) does NOT win (out-specified by `> *` :1721 → head spans 1080).
  **No min-width block touches Arcs.** Mobile: `@media(max-width:759px)` grid→1fr **:1749**;
  `@media(max-width:720px)` arc-card padding **:1599–1610**; inert legacy `.arcs-yours,.arcs-examples`
  at :5565 (class≠id, doesn't match).
- **No global box-sizing:border-box reset exists** — box-sizing is `content-box` everywhere
  (confirmed live on body / .arcs). So `.about` renders at 640+48padding = **688px** border box.
  (Corroborates the ON-7 root cause: `.bk-surface` width:100%+padding with no border-box.)

## 0c — LIVE RE-BASELINE (before-evidence table)

clientWidth runs ~15px under nominal (vertical scrollbar). Occupancy = column ÷ clientWidth.

### ABOUT (`#about`, static — no auth/data)
| Width | clientWidth | column (`.about` box) | occupancy | widest prose | widest text (any) | hScroll |
|---|---|---|---|---|---|---|
| 1280 | 1265 | 688 | **54.4%** | 56ch (`.about .sect p`) | 106.7ch `.colo .line` (10px mono colophon) | 0 |
| 1440 | 1425 | 688 | **48.3%** | 56ch | 106.7ch colophon | 0 |
| 1920 | 1905 | 688 | **36.1%** | **56ch (D2-clean)** | 106.7ch colophon | 0 |

- Column is a fixed 688px (640 max-width + 48 padding), constant across widths → the whole
  +640px from 1280→1920 becomes dead gutter. At 1920 = ~608px empty **per side** (~64% empty) →
  **D1 FAIL** (36.1% ≪ 60%). Matches D0's "About 66% empty gutter."
- Genuine prose stays 56ch at every width → **D2 PASS for prose.** The only >72ch text is the
  footer colophon (`.colo .line`, 10px DM Mono, 106.7ch) — a small-font meta line at full column
  width, low-priority tidy, not primary prose.
- Interactive census: 7 elements, 7 cursor:pointer, 7 focusable (the model stations + 3 toggle
  pills). D6 focus-visible presence to be element-checked in build.

### ARCS (`#arcs`, signed-in fixture: 3 own arcs + Start tile)
| Width | clientWidth | column (`> *`) | occupancy | `.arcs-teach` | grid cols | card px | hScroll |
|---|---|---|---|---|---|---|---|
| 1280 | 1265 | 1080 | 85.4% | **137ch** | 4 | — | 0 |
| 1440 | 1425 | 1080 | 75.8% | **137ch** | 4 | — | 0 |
| 1920 | 1905 | 1080 | **56.7%** | **137ch** | 4 | 258 | 0 |

- Column fixed 1080px → at 1920 occupancy **56.7%** — **D1 FAIL by a hair** (<60%); ~412px dead
  per side. At 1280/1440 it's fine (85/76%); the defect is width-dependent.
- **`.arcs-teach` = 137ch at ALL widths** (18px Cormorant italic, full 1080 column, uncapped) —
  **D2 FAIL**, the named target. Confirmed reproduced.
- Grid holds 4 cards/row at every width (auto-fit minmax(240px) never gets past 4 in an 1080 column;
  cards ~258px at 1920). Widening the column would let auto-fit add a 5th column for free.
- Interactive census: 8 (3 sort-seg buttons + 3 arc cards + Start tile + …), 8 pointer, 8 focusable.

## 0d — 8px UA BODY MARGIN + 768 nav h-scroll

- **Reproduced.** `body{}` (theme.css:389) sets background/color/font-family but **no `margin:0`**
  → UA default **8px** left/right (confirmed 8px/8px at every width).
- At **768** (desktop-pill nav band, ≥760): **hScroll = 15px** (scrollWidth 768 vs clientWidth 753).
  Culprit: `.app-nav-list` overflows its parent `.app-nav` to x=768 (right:768 vs nav right:745 =
  **23px child overflow**). The desktop horizontal nav (wordmark + ⌘K search + 7 links + profile)
  doesn't fit the narrow ~737px.
- **Live experiment — does `body{margin:0}` fix it?** Set inline, re-measured, reverted:
  - before (margin 8): hScroll **15**, list-overflows-parent **23**, listRight 768.
  - after (margin 0): hScroll **7**, list-overflows-parent **7**, listRight 760, navWidth 753.
  - reverted: back to 15.
  → **`body{margin:0}` reduces the 768 h-scroll 15→7 but does NOT close it.** A residual **7px**
  remains: the desktop nav content is genuinely ~7px too wide at 768, independent of the margin.
- **Blast radius of a global `body{margin:0}`:** every surface's body box widens 16px. Centered
  columns (all page surfaces use margin:auto) **do not visibly move** — they re-center on the
  viewport either way; they simply gain 8px gutter/side. The **≤759 mobile nav bar** (full-width)
  and any edge-anchored element **shift 8px to the true edge** → a real ≤759 change. At the desktop
  widths (1280/1440/1920) the 16px margin is harmless (hScroll already 0; it just pads the gutter).
- **The 7px residual (desktop nav too wide at 768) is a SEPARATE nav-fit defect** — nav is sensitive
  chrome (canon §2 "nav stays solid"; the 760 desktop breakpoint is load-bearing) and is OUT of
  DW-1's About+Arcs scope. Flag as a named task regardless of the margin disposition.

## 0e — Composition proposals (two per surface, grounded in 0c)

### ABOUT (reading surface; D2 caps prose ≤72ch regardless — canon note)
- **A — Reading column + orientation spine (RECOMMEND).** At ≥1200, compose `.about` as a
  ~1180–1240 frame: a left margin apparatus (a scroll-tracked section index built from the existing
  6 `.sect` headings — the canon's literal "margin apparatus") + the 56ch reading column; the wide
  FIGURES (5 models, 15-item lexicon → 3-col, refuse → 2×2, featrows → 3-across) break out to span
  the frame. Frame occupancy ~62–65% ✓; prose stays 56ch. Adds a small ES3 rail in renderAbout
  (derived from existing headings — layout/nav, not new copy) + D6 focus-visible. Highest
  composition value; the canon's named pattern. Borderline vs "no section restructuring" → Preston
  confirms the rail is in-bounds.
- **B — Widened interior, pure-CSS (figures fill, prose centered).** At ≥1200, widen the `.about`
  frame to ~1200; every prose block stays 56ch centered; only the FIGURES span the wider frame
  (models side-by-side, lexicon 3-col, refuse 2×2). Frame occupancy 63% ✓. Zero new DOM/JS, lowest
  risk, mobile trivially untouched. Cost: prose reads as a centered island inside a wide frame in the
  reading-heavy stretches (the "two widths stacked" look).
- (C — ledger exemption for a governed single column: the canon technically allows it, but names
  About as THE reference D1 violation to fix → disfavored here. Noted, not recommended.)

### ARCS (card-grid surface; not reading)
- **A — Widen the column + cap the teaching line (RECOMMEND).** At ≥1200, raise
  `.arcs.lum-amber-deep > *` 1080 → ~1360 (or fluid `min(1360px, …)`); auto-fit fills ~5 cards/row
  for free (occupancy 1360/1905 = **71%** ✓). Separately cap `.arcs-teach` (+ the head block) at
  ≤66ch so the teaching line reads at a comfortable measure while the grid uses the width — **kills
  both the 137ch D2 defect and the D1 occupancy defect**, nearly pure CSS, no DOM change. Decide head
  alignment (left-align the capped head to the grid edge vs centered).
- **B — Keep 1080 + compose a second region.** Add a persistent left rail (sort/legend/orientation)
  beside the grid at ≥1200. Cons: Arcs has thin rail content (only the 3-button sort seg + count) → a
  rail would be padding, not substance; more DOM/JS; weaker fit. Not recommended.

## Named tasks (out of DW-1 scope; not auto-fixed)
- **DW-NAV768** — desktop nav content ~7px too wide at 768 (list overflows `.app-nav` by 7px even
  after a body-margin reset). Sensitive chrome; own nav-fit pass.
- **About colophon 106.7ch** — the `.colo .line` footer meta at full column width (10px). Low
  priority; fold into About build only if trivial, else name it.

## HALT — awaiting Preston: (1) About fork A/B · (2) Arcs fork A/B · (3) body-margin disposition
(global-reset-with-cross-surface-proof vs scoped `@media(min-width:760px)` reset vs defer). One
question max beyond the forks.
