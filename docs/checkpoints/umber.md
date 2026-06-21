# Umber LIVE re-skin — BUILD checkpoint log

Base: `origin/main` @ `c59f4da` (fast-forwarded). Rollback tag: `pre-umber` @ `c59f4da`.
Local preview: PowerShell static server (`.claude/static-server.ps1`, `buildstatus` config) on `http://localhost:8753/` — Node/Python both unavailable on this box; HttpListener works without admin.

Invariant md5 baseline (working tree, post-FF):
- arc-constellation.js `4d476499f91a321408c8947d917a23d7`
- tradition-forms-arc.js `e80dbb9cf514b7d68c19cc4faee6efbe`
- yumi-brain.js `d336b1e69f21cc68cb6af552e8363af0`
- state.js `6dfe2377213039f2987d0ddbe87e4f9a`

Edit-target byte baselines: theme.css 20743 · components.css 278645 · views.js 554560 · sw.js 4788 · index.html 6215.

---

## Stage 0 — fast-forward — PASS
- `HEAD == origin/main == c59f4da`; branch `main`; tracked tree clean.
- `pre-umber` tag at `c59f4da`. Base cache `praxis-v3.133`.

## Stage 1 — theme.css — PASS

**Edits:** re-pointed shared tokens to BRIGHT base + ADDED all Umber tokens (ground/page/dark surfaces, teal/thread/gold-soft/gold-ink, glass-bar/pill/border, border-2/line-page(-2)/wash-page, shadow-d/page) + `--scrim` (fixed `rgba(15,9,4,.6)`) + the `[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel` override block (flips ~15 ground-sensitive tokens) + made `body::before` ground-aware (bright = `--page`; `body[data-ground="dark"]::before` = `--ground-grad`,`--ground`). Retired the wheat-radial literals.

**Mechanical gates:**
- Self-validated stale-hex: control `#2f1c0e` = 1 (grep works). Must-be-0 set in theme.css = **0** (all 26 old values incl. `#d8bd80/#e6cb8e/#c4a35a/#27566a/#1d8f68/#7e7bc0/#854f0b/#9c3f1c`…). Excluded/kept legit: `#9a7e4e` (now `--meta`), `#fff8e7`/`#faeeda` (tradition feed), `#fdfaf3`/`#06241a`. Dead-comment `#1d9e75`/`#ffffff` removed.
- New tokens present: `--ground --page --teal --scrim --surface-d --text-d` all ≥1; `[data-ground="dark"]` selector present (4 lines).
- 4 invariants md5 **UNCHANGED** (match baseline exactly).
- Brace balance 7 `{` / 7 `}`. Only `assets/theme.css` modified (git status).
- **Byte delta: 20743 → 22891 = +2148.**

**Live (localhost:8753):**
- Boots: `readyState=complete`, `#app` rendered (622 chars), stylesheets = theme.css + components.css. **Console errors: 0.**
- Body BRIGHT base (no data-ground yet, correct for Stage 1): `--ink` `#241710`, `--surface` `#fcf6e8`, color `rgb(36,23,16)`.
- Nav PINNED dark via class override (no JS): `.app-nav --ink` `#f0e3c8`, `--surface` `#3e2814`, bg `rgb(62,40,20)`. Nav text light + readable: wordmark `#e7c46a` (gold-soft), links `#f0e3c8` (text-d), search `#c2a87f` (muted).
- Home renders bright base (title `#241710`) — will flip dark when Stage 2 wires data-ground.

PROCEED → Stage 2.

## Stage 2 — dual-ground wiring — PASS

**Edits:**
- `js/views.js` (ONE edit): in `renderRoute`, after `parts = rest.split('/')`, `document.body.setAttribute('data-ground', umberGroundDark[parts[0]] ? 'dark':'bright')`; `umberGroundDark = {home,books,arcs,arc,account}`. Keyed off RAW `parts[0]` (bright sub-surfaces book/subtheory/artifact live under dark parents).
- `assets/components.css`: re-keyed **5** fixed full-screen scrims to `var(--scrim)` (not just the named 3 — also `.shelf-sidebar-backdrop` and `.subtheory-rail-backdrop`, both genuine `--ink`-flip scrims that would break on dark); guarded **both** wheat-field mounts (`.shelf::before`, `.arc-detail-web-view::before` → `background-image:none`, asset kept); removed **both** remaining blurs (`.spotlight-panel` blur(14px), `.account-card` blur(8px)) per canon §4-A.

**Mechanical gates:**
- `cscript parse-check-views.js` → **PARSE: PASS (555268 chars)**. Added block ES3-clean (no const/let/=>/backtick/class).
- components.css greps: `wheat-field.svg` = **0**; `backdrop-filter: blur(` = **0**; `background: var(--scrim);` = **5**; leftover `color-mix(var(--ink) 38/40%)` scrims = **0**.
- 4 invariants md5 **UNCHANGED**. Files modified: theme.css, components.css, views.js only.
- **Byte deltas:** views.js 554560 → 555268 = **+708**; components.css 278645 → 278490 = **−155**.

**Live (localhost:8753, SW unregistered + caches cleared to defeat stale v3.133 bundle):**
- **#home → data-ground="dark"**: body `--ink` `#f0e3c8`, `--surface` `#3e2814`, color `rgb(240,227,200)`, `body::before` = `--ground-grad` (radial rgb(64,40,18)…), home title light.
- **#about → data-ground="bright"**: body `--ink` `#241710`, `--surface` `#fcf6e8`, color `rgb(36,23,16)`, `body::before` = page grain.
- **#books → data-ground="dark"**: body `--ink` `#f0e3c8`; `.shelf::before` background-image = **"none"** (wheat gone, dark ground shows through); shelf rendered.
- Ground flips correctly on hashchange (home→about→books) with no reload. `--scrim` resolves `rgba(15,9,4,.6)`; 5 scrim rules reference it (live scrim-on-open render deferred to Stage 3 modal pass). **Console errors: 0.**

NOTE residual for Stage 3/4: components.css 4 drift literals (`#f5ead0 #ecdcae #cfb06a #cba85f`) + index.html `#faf6ec` (theme-color) not yet cleared — they belong to the Stage 3 surfaces / index.html and are cleared there; full stale-hex=0 verified at Stage 4.

PROCEED → Stage 3.

## Stage 3 — bright-surface passes + states + mobile — PASS

**Edits:**
- `assets/components.css`: re-tokenized `.home-preview` radial (`#f5ead0`/`#cba85f` → `var(--surface)`/`var(--bg)`, matching the rule's own comment intent, flips dark on home); cleaned the dead-comment hexes `#ecdcae`/`#cfb06a` at the cover-pending well.
- `index.html`: `<meta theme-color>` `#faf6ec` → `#2f1c0e` (Umber ground).
- `assets/theme.css`: made the **gold family ground-sensitive** to fix gold-on-bright AA. Base (bright) `--gold`/`--gold-light`/`--gold-text` → `var(--gold-ink)` (#855410); dark override adds `--gold:#d2a23e`, `--gold-light/--gold-text:var(--gold-soft)`.

**Mechanical gates:**
- **FULL stale-hex sweep across all editable files = 0** (self-validated, control `#2f1c0e`=1). Old golds `#a8741a/#c5912b/#6b4516` = 0 (not reintroduced). Invariant renderers untouched (`#966e28`×5, `#ba7517`×5 intact).
- theme.css brace balance 7/7. theme.css 22891 → **23158** (gold override).
- 4 invariants md5 **UNCHANGED**.

**Live (localhost:8753) — computed styles + AA:**
- **AA contrast (key pairs PASS):** body text on dark ground **12.78**, prose on page **15.49**, ink-2/page 9.45, muted/surface-d 6.06, muted/ground 7.11. **Gold fixed: gold/page now 5.7** (gold-ink) vs 2.08 before; gold/dark-ground 6.94. (Tertiary `--meta`/page = 3.41 — eyebrow/label tier, matches the mockup's ink-3→meta mapping; ≥AA-large, noted.)
- **Gold flip resolves per ground:** bright `--gold`=`#855410`, `--gold-text`=`#855410`; dark `--gold`=`#d2a23e`, `--gold-light`=`#e7c46a`.
- **Ground map (all 13 routes) correct:** dark = home/books/arcs/arc/account; bright = book/subtheory/notebook/about/yumi-sees/artifact/(empty→notebook). (Edge: `arc/x/new-subtheory`→dark, parts[0]=arc; transient creation route that redirects to #subtheory — acceptable.)
- **Bright surfaces render:** about (appLen 23381), yumi-sees (2542); notebook ground=bright, `--br-deep`=`#1c1209` constant (leaf gutter stays a dark spine-shadow, no inversion). Register spines resolve: marginalia `#2e8a93`, journal `#7d6db0`, question `#3a5a8a`.
- **Mobile (390×844):** no horizontal overflow on dark (#home) AND bright (#about); hamburger shown, desktop links hidden; **mobile menu SOLID dark `#2a1a0c`, `backdrop-filter:none`**, links readable (muted). Nav stays dark/brown on the bright route.
- **Modal/scrim LIVE:** spotlight panel solid `rgba(48,30,16,.94)`, `backdrop-filter:none`; **backdrop = `var(--scrim)` `rgba(15,9,4,.6)`** on the DARK #home (proves the scrim no longer follows `--ink` — would have been light otherwise). Panel `--ink` light.
- **Console errors: 0** (every surface + mobile + modal).
- Screenshots captured (corroborate): dark #home (umber radial, cream serif, gold→teal "theory.", gold wordmark, bloom glyph) and bright #about (cream page, dark serif + gold-ink "Praxis", constant brown nav over bright page).

**Deferred to POST-PUSH live smoke (require the test account / seeded data — cannot render logged-out):** notebook bound-leaf spread + register spines on real entries + gather→Create-subtheory; book-detail page; sub-theory writing page. All confirmed ground=bright via the route map; token foundation (leaf/gutter/spines/gold) verified. Per CLAUDE.md doctrine, data-bearing surfaces are live-verified post-deploy.

PROCEED → Stage 4.

## Stage 4 — full verify gate + cache bump + local commit — PASS

- **Parse:** `cscript parse-check-views.js` → **PARSE: PASS (555268 chars)**.
- **Stale-hex (self-validated, control `#2f1c0e`=1):** prompt-named 9 all **0** (incl. `#d4972a`); FULL must-be-0 set total **0** across all editable files. Invariant renderers still hold their palettes (excluded).
- **Umber tokens present:** `--ground --page --teal --scrim --gold-ink` each ≥1; `[data-ground="dark"]` selector present.
- **Feature anchors (all present):** generateLenses 6, evalLensResponse 6, LENS_GEN_SYSTEM 2, gatherLensLibraryMetadata 2, buildProposedLensCard 2, renderArcDetail 22, sendMessage 11, renderYumiPanel 5, openYumiPanel 3, renderWhatYumiSeesPage 3, notebook-entry-privacy-toggle 2, DISTILLER_SYSTEM 4, yumiWebGrounding 17.
- **4 INVARIANTS — delta 0:** working-tree md5 unchanged (arc-constellation `4d476499`, tradition-forms `e80dbb9c`, yumi-brain `d336b1e6`, state `6dfe2377`); `git diff` for all four = empty.
- **Deps unchanged:** index.html diff vs origin = only `theme-color` `#faf6ec`→`#2f1c0e`; no new `<script>`/`<link>` (Google Fonts only).
- **Cache bump:** `sw.js` `praxis-v3.133` → **`praxis-v3.134`**.
- **BYTE DELTAS:** theme.css 20743→23158 (**+2415**) · components.css 278645→278467 (**−178**) · views.js 554560→555268 (**+708**) · sw.js 4788→4788 (**0**) · index.html 6215→6215 (**0**). Invariants: **0 / 0 / 0 / 0**.
- **git status:** exactly 5 source files modified (theme.css, components.css, views.js, sw.js, index.html).
- AA + mobile: see Stage 3 (key pairs pass; 390px no-overflow; modal scrim live).

COMMIT (local, no push) — hash reported in Stage 5.

## Stage 5 — pre-push HALT
Committed locally; **NOT pushed.** Awaiting Preston's explicit push-word. Rollback: `git reset --hard pre-umber`. On push-go: push → Netlify auto-deploy (v3.134) → live smoke (every surface on correct ground, 0 console errors, protected features: generate a lens / gather a note / confirm notebook private) + the data-bearing bright surfaces deferred from Stage 3 (notebook leaf/spread, book detail, sub-theory writing) on the test account.
