---
surface: home
route: "#home"
render_fn: renderHome (views.js:1440)
mockup: docs/studio/mockups/home.html
ground: dark
in_nav: yes
state: closed
rounds: 1
mobile: native
---

## State

`#home` → `renderHome` (views.js:1440); dark ground; in top-nav (home). Landing / field of arcs.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: VERIFIED-CLOSED 2026-07-09] [sev: HIGH] OG1 — Signed-out Home shows a "Welcome back." headline to a first-time visitor (views.js:1429) — a false premise at peak attention. [verified: already fixed in live code pre-round — renderHome early-returns `buildSignedOutPrompt('Welcome to Praxis', …)` (views.js:1454-1460); 0 R3 diff lines; confirmed by Preston's signed-out felt pass on v3.187.]
- [source: fable-audit-combined.md 2026-07-07] [status: VERIFIED-CLOSED 2026-07-09] [sev: HIGH] OG2 — No obvious sign-in; signed-out nav shows a fabricated "P" avatar + "Your account" (views.js:436-461) — reads "already logged in," with no start. [verified: live signed-out nav renders a person-silhouette + "Sign in" (views.js:436-461); 0 R3 diff; Preston's signed-out felt pass on v3.187.]
- [source: fable-audit-combined.md 2026-07-07] [status: VERIFIED-CLOSED 2026-07-09] [sev: HIGH] OG4 — Signed-out Home renders dead/negative personal-dashboard widgets ("No arcs yet", "Nothing open") (views.js:1481-1545) — showing a new person their empty account. [verified: renderHome early-return exits BEFORE the dashboard block (views.js:1454-1460) — a signed-out visitor never reaches those paths; 0 R3 diff; Preston's signed-out felt pass.]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.187 c3e869d] [sev: HIGH] H1 — Still-Reading spines are text-only (no covers) while the shelf shows covers (views.js:1398-1411; c11653) — two book surfaces contradict. [fix: homeReadingSpine now uses the Shelf's `buildSelfHealingCover` at 52×78 — real cover → "cover pending" placeholder, no broken img (views.js:1425); `.home-mspine` cover treatment, `.home-mspine-edge` retired.]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.187 c3e869d] [sev: HIGH] H2 — `.home-mspine-title` is 10px with no clamp in a 52×78 box → long titles overflow (components.css:11656). [fix: `.home-mspine-title` `-webkit-line-clamp:3` + `overflow:hidden`; family/weight/size/color unchanged.]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.187 c3e869d] [sev: HIGH] H3 — `.home-wfcap` (explains the whole-field interaction) is 9.5px `--lum-ink-4` ~3.4:1 (components.css:11630) — lowest contrast on the copy that most needs reading. [fix: `.home-wfcap` → 11px + `--lum-ink-3` (components.css:11639).]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.187 c3e869d] [sev: MEDIUM] H4 — The whole-field variant has no section label; its purpose is unnamed (views.js:1456-1486) — the "field purpose unclear" friction. [fix: `.home-sectlabel` "How your arcs connect" added to the field variant (views.js:1520-1523), mirroring the left variant's label.]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.187 c3e869d] [sev: LOW] H5 — `.home-altnote` (explains the field/left-off toggle) is 13px `--lum-ink-4` ~3.4:1 (components.css:11616). [fix: `.home-altnote` → `--lum-ink-3` (components.css:11624); copy also corrected (auto-alternation language removed per D3).]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: CLOSED v3.187 c3e869d] [sev: Hygiene] Home Hygiene → sweep — dead landing CSS and a stale comment. [fix: swept dead landing CSS at 2 sites (the `.home-hero*`/`.home-cta*`/`.home-preview*` block + a mobile `@media` sub-block) + corrected the now-stale `home-cta-*` canon comment; residual dead-class grep = 0.]

- [source: R3 close 2026-07-09] [status: NAMED DEBT — Preston-accepted 2026-07-09] [sev: MEDIUM] Constellation opacity AA on the light field — the LOCKED `renderSubTheoryConstellation` draws opacity-reduced italic text via the global `--ink-2`/`--ink-3` tokens (the R3 skin re-points these to `#645940`, clearing the always-drawn full-opacity "Yumi" label to 5.1–5.6:1); but three opacity-composited instances stay sub-AA on the light field panels: the seed-field question label (18px @0.82, ~3.6–3.8:1, reachable when a signed-in user has 0 own arcs), the empty-arc hint (13px @0.7, ~2.9:1), and the book-square `--ink-4` stroke (~2.5:1, non-text). Not fixable without touching the out-of-scope renderer's opacity or deepening `--ink-2` at cost to the quiet-hint hierarchy. Preston ruled ACCEPT AS DEBT (no token change, no renderer follow-up now). Anchors: arc-constellation.js:784/793/1041/1147. See docs/checkpoints/r3-home.md.
- [source: mockup-agent 2026-07-09] [status: NAMED DEBT — future round] [sev: LOW] Signed-out `.empty-state` has no scoped CSS (no `.home-page .empty-state` rule) — the door's crest/h2/p fall to bare UA-default (left-aligned, no italic serif, no reading measure), unlike Shelf/Notebook. Pre-existing; surfaced by the mockup agent while rendering faithfully. R3 gilds the Sign-in CTA but leaves the surrounding prompt unscoped. Future round: add a scoped `.home-page .empty-state` rule.

## Round history

### MW-1 mobile pass — SHIPPED-LOCAL (2026-07-10, commit e5ab754; chip → mobile: native)

Second half of the MW-1 mobile wave. Home conforms to `praxis-mobile-canon.md` at ≤759.
**Chip ruling: `mobile: native`** — the applicable patterns verified on both layers; evidence in
`docs/studio/reports/mw1-2026-07-10.md`.

- **P3 — applied:** Home's tappables were sub-44px (`.seg-opt` ~31, `.home-arcbtn` ~34,
  `.home-gl-link` tiny). Added `min-height:44px` (+ inline-flex) at ≤759. Live @390: seg-opt **h44**,
  gl-link **h45** (`.home-arcbtn` structurally a hard floor — no colliding override, base already
  `inline-flex`; not live-sampled because the layout seed didn't render a left-off card — a
  follow-up at the felt pass). Desktop @1265: seg-opt `min-height:auto` (mobile-only).
- **P8 — applied (fixed a PRE-EXISTING overflow):** at 390 Home carried a standing ~23px h-scroll
  (scrollWidth 413) from the `.home-welcome::before` lamplight (`inset:-16% -8%`) spilling ~8% past
  the viewport. Constrained its horizontal inset to 0 at ≤759 (vertical `-16%` wash kept — felt
  glow preserved), placed AFTER the base `::before` rule so source order wins. Live @390:
  **scrollWidth 390 = clientWidth, welcome overflow 0**. (My P3 `inline-flex` was NOT the cause —
  reverting it left 413.)
- **P6 — already satisfied** (existing): the field/left variant toggle is a display-switch on
  persistent panes (`homeShowVariant`, views.js:1354 → `.home-variant-hidden{display:none}`), not a
  re-render — meets P6 "panes hide, not destroyed."
- **P1/P2/P4/P5/P7/P9 — n/a** (no management cluster; no single primary-verb button; no new bottom
  chrome; the greeting is not an orientation title; no inputs; no new motion). Sizing/inset only —
  0 tokens, 0 hex, no JS; every rule `@media (max-width:759px)` so desktop is byte-unchanged.
- Gate: praxis-reviewer CLEARED (cascade placement + inline-display trap independently retraced).
  **Felt pass remains Preston's.**

### R3 CLOSED — felt pass PASSED IN FULL (2026-07-09, deployed v3.187, commit c3e869d)

Preston's felt pass passed in full on the live deploy, **signed out AND signed
in**: the Universal v1.2 light skin, the still-reading covers, the mechanical
alternator + the new field label, and the craft contrast lifts all read true; the
honest signed-out front door (the OG1–OG4 + IA4 cluster, verified-closed — see the
Gap ledger and the signed-out cluster table below, 0 R3 diff lines) confirmed live.
His ruling on the flagged **constellation-opacity AA residuals: ACCEPT AS NAMED
DEBT** — no token change, no renderer follow-up now (recorded in the Gap ledger).
The one D1 mechanism judgment call — Home STAYS in `umberGroundDark`; a scoped
`.home-page.lum-amber-deep` light override (the Shelf-exact R2 mechanism), NOT the
build prompt's "flip out of the map" phrasing — is ratified by the live pass. Round
closed.

### R3 — Home: Universal v1.2 light skin + covers + alternator/craft (v3.187, felt-passed)

The live Home ships the Universal v1.2 light-ground skin + the four locked decisions,
built against the felt-passed light side of `docs/studio/mockups/home.html`. One
commit (`c3e869d`); `docs/checkpoints/r3-home.md` is the full record.

- **D1 SKIN** — scoped `.home-page.lum-amber-deep` Universal-light override (token
  re-points + recipes 6/4/3/5/2 + literal rescues), byte-faithful to the mockup's
  `.skin-universal` and the R2 Shelf `.shelf.lum-amber-deep` precedent. Home stays in
  `umberGroundDark` (map byte-identical) and paints a light surface over the dark
  body — the Shelf-exact mechanism, nav-consistent. Also re-points
  `--ink-2/-3/-4/--sunk` scoped to home so the LOCKED constellation renderer reads
  dark-on-light (no renderer edit); the always-drawn full-opacity "Yumi" label
  cleared AA (5.1–5.6:1) — the reviewer's FAIL, fixed and re-verified before ship.
- **D2 COVERS** (H1) — `homeReadingSpine` adopts the Shelf's `buildSelfHealingCover`
  at 52×78 (real cover → self-healing → "cover pending"; no broken img possible);
  `.home-mspine-edge` retired.
- **D3 ALTERNATOR** (H4) — per-visit auto-flip removed; mechanical default
  (`haveArcs ? 'left' : 'field'`); `praxis_home_variant` key retired; field section
  label "How your arcs connect" added; `.home-altnote` copy corrected.
- **D4 CRAFT** (H2/H3/H5) — `.home-mspine-title` 3-line clamp; `.home-wfcap` 11px +
  `--lum-ink-3`; `.home-altnote` `--lum-ink-3`.
- **HYGIENE** — swept dead landing CSS (two sites) + a stale `home-cta-*` canon
  comment; residual dead-class grep = 0.

Reviews: fix-red-team clean; praxis-reviewer FAIL (locked renderer's Yumi label pale
on light) → fixed via the scoped `--ink-*` re-point → re-review CLEARED. Scope:
`js/views.js` + `assets/components.css` + `sw.js` v3.186→v3.187 ONLY; foundations
byte-locked; parse OK.

## Next

## Mockup evaluation

Mockup: `docs/studio/mockups/home.html` (self-contained, standalone; open directly
in a browser — no build step, no app-code import). Skin toggle (top-right, fixed) —
`Universal dark` (default) / `Universal v1.2` (light). State toggle (top-left,
fixed) — `Established` / `Fresh` / `Signed out`. Both are mockup-only chrome,
clearly labeled so neither reads as Home's own UI.

### Current-surface structure (as lifted)

- **Route/render:** `#home` → `renderHome` (views.js:1440), dark ground, in-nav
  (`home`), early-returns to `buildSignedOutPrompt` when signed out
  (views.js:1454-1460).
- **Layout:** one `<section class="home-page lum-amber-deep">`, children centered
  via `> *{max-width:1080px;margin:auto;padding:0 24px}` (components.css:11796-97).
  No sidebar. Order: welcome+alternator → variant A (whole field) or B (left-off,
  both always in the DOM, toggled via `.home-variant-hidden`) → still-reading
  glimpse.
- **Card anatomy:** a left-off "arc card" (`homeLeftOffCard`, views.js:1356-1406) =
  `.home-arc.lum-glass` → `.home-arcfield` (mini constellation host) +
  `.home-arcbody` (title, mono meta, one primary "Continue →" action). A
  still-reading item (`homeReadingSpine`, views.js:1425-1438) was, pre-mockup, just
  an edge-bar + bare title span — no cover (this is exactly H1).
- **Fonts/tokens:** `--lum-serif` (Cormorant, titles/Yumi voice) / `--lum-sans` (DM
  Sans, body/buttons) / `--lum-mono` (DM Mono, eyebrows/meta/captions) — all
  `--lum-*` (lumen-amber.css), atmosphere = `.lum-amber-deep` live (the D1 orphan).
- **Responsive:** ONE real breakpoint, `@media (max-width:759px)`
  (components.css:11843-11847) — arc cards stack column, `.home-arcfield` goes
  full-width, glimpse goes full-width. `.home-page > *` padding stays 24px at every
  width (no mobile reduction, unlike Shelf's 16px step) — preserved as-is.

### Decisions — exists / partial / new

| # | Decision | Status | Live DOM anchor | Mockup treatment |
|---|---|---|---|---|
| D1 | Skin: Universal-dark (correct atmosphere) + Universal v1.2 light toggle | **NEW** (mockup-only; live has no skin variance) | `.home-page.lum-amber-deep` (views.js:1446; recipe at lumen-amber.css:82-89) | Default ground swapped to the `.lum-amber` recipe (lumen-amber.css:73-81) — Home's own documented atmosphere (lumen-amber.css:14-17), not the reading-room `-deep` recipe Shelf/Book/Notebook/Build use. Every `--lum-*` VALUE unchanged. `.skin-universal` light alternate re-points tokens verbatim from `docs/studio/mockups/shelf.html:284-391` + applies depth recipes 3/4/5/6 (universal-depth.css). **Delta flagged** (not a fork — see below): the brief cites "the Universal §4 scoped-night derivation"; §4 is written for the galaxy/starfield container only and states elsewhere that non-galaxy dark stays the unchanged warm-umber Lumen set — so "Universal dark" for Home is read as *the existing lum-* dark values, correctly atmosphere-assigned*, not a literal blue-black galaxy remap. |
| D2 | Still-reading covers (closes H1) | **PARTIAL → evolved** | `homeReadingSpine` (views.js:1425-1438); `.home-mspine`/`.home-mspine-edge`/`.home-mspine-title` (components.css:11838-11841) | `.home-mspine` restructured to carry the Shelf's exact cover-area/cover-placeholder look (2:3 cloth-gradient face + "cover pending" caption) at the SAME 52×78 footprint (already 2:3 — no size/layout change). `.home-mspine-edge` retired (a face-on cover has no spine edge). 4 sample covers incl. one deliberately long title (Kimmerer, real subtitle) exercising D4a's clamp. |
| D3 | Stop auto-alternation; mechanical default; name the field variant | **PARTIAL → evolved** | `renderHome`'s ls-alternator (views.js:1596-1603); `.home-altnote` copy (views.js:1494-1497); field variant has no section label (views.js:1501-1519) | Both variants + the `.seg` toggle KEPT. Auto-alternation removed; default is now mechanical — `left` when left-off cards exist (progress), else `field` (fallback) — read straight off the rendered DOM in JS (`hasLeftCards`), not forked. New `.home-sectlabel` ("How your arcs connect") added to the field variant, mirroring the left variant's existing "Where your thinking stands." `.home-altnote` copy corrected (the old text describes the now-removed auto-alternation — a direct copy-is-a-contract consequence of D3, not a separate decision). |
| D4a | H2 — `.home-mspine-title` line-clamp | **NEW (surgical)** | components.css:11841 | Added `-webkit-line-clamp:3` + `overflow:hidden`; font-family/weight/size/color untouched. Exercised by the long Kimmerer title. |
| D4b | H3 — `.home-wfcap` contrast/size | **NEW** | components.css:11815 (9.5px `--lum-ink-4`, ~3.4:1) | Bumped to 11px (matches sibling `.home-fieldstat`) + `--lum-ink-3` (~7.5:1 on `--lum-base`, computed via WCAG relative-luminance). Both live instances of this class (the wholefield caption AND homeRenderField's own quiet-line fallback) inherit the fix, since both share the one class. |
| D4c | H5 — `.home-altnote` contrast | **NEW** | components.css:11801 (13px `--lum-ink-4`, ~3.4:1) | Color only, to `--lum-ink-3`, per the locked text (size unchanged). |
| — | Hygiene — dead landing CSS + stale comment | **RECORDED, not rendered** (app-code cleanup, no visual) | components.css:814-976 (`.home-hero`/`.home-title`/`.home-cta`/`.home-preview`, an earlier `.home-page{max-width:1080px;margin:0 auto;padding:0 32px}` at 823-827) + the stale comment at 819 ("the app has no generic .btn class" — now false; `.btn`/`.btn-primary` exist at 9660-9673 and are used by `buildSignedOutPrompt`) | Confirmed dead by grep: zero JS references to `.home-hero`/`.home-cta`/`.home-title`/`.home-preview`/`.home-eyebrow`/`.home-sub` anywhere in views.js. The old unscoped `.home-page` rule (823-827) is fully shadowed by the later, more-specific `.home-page.lum-amber-deep` rule (11796) for every property they share — dead in effect, not just orphaned. Not touched (app code, read-only); flagged for a future live cleanup round. |

### Data-source findings / build-time stand-ins

- **Per-arc constellation node color** (whole-field + left-off mini-fields): no
  `arc.color` field exists live — `buildHomeFieldData` sets `marks:[]` on every node
  (views.js:1260), so live nodes render via `renderSubTheoryConstellation`'s default/
  no-mark treatment, not a per-arc hue. **Stand-in:** the Universal field spectrum
  (`--field-1..10`, universal-depth.css:42-43), reusing shelf.html's exact
  `--arc-education/-self/-liberation/-craft/-grief` variables verbatim for
  cross-mockup continuity. **Live-wiring path:** add an `arc.color` field to the arc
  record (state.js schema) and thread it through `buildHomeFieldData` /
  `_arcDetailBuildSubTheoryData` into whatever `renderSubTheoryConstellation` accepts
  as a per-node override.
- **The constellation SVGs themselves** are a hand-drawn stand-in (recipe 2 luminous
  orb + recipe 7 constellation thread, universal-depth.css) for
  `window.renderSubTheoryConstellation` (arc-constellation.js + praxis-marks.js) —
  that renderer is app code and cannot be invoked from a standalone file. This is a
  baseline rendering constraint, not a decision, so it carries no EVOLVED tag.
- **The "fresh" state's seed arc** ("A Pedagogy of Desire," state.js:2860-2887) is
  real live seed data (title/description lifted verbatim); its sub-theory content
  is not reproduced in depth (out of scope for D1-D4) — the mockup faithfully
  represents that a fresh seed arc has 0 sub-theories pre-interaction, so
  `homeRenderField` falls to its own quiet-line fallback (views.js:1333-1336),
  which is exactly what exercises D4b in the sparsest real state.

### Signed-out cluster: live-code confirmation (baseline, NOT evolved)

Per the brief, these are confirmed against real source, not designed. All five
CONFIRMED present as described; none raised a fork.

| Item | Claim | Status | Anchor |
|---|---|---|---|
| OG1 | Signed-out Home shows an honest "Welcome to Praxis" door, not "Welcome back" | **CONFIRMED** — matches the payload's description (the gap-ledger's own OG1 row, dated 2026-07-07, describes the pre-fix state; live code already carries the fix) | `renderHome` early-return, views.js:1454-1460 — `buildSignedOutPrompt('Welcome to Praxis', ...)` |
| OG2 | Signed-out nav shows a person-silhouette glyph + "Sign in", no fabricated "P" avatar | **CONFIRMED** | views.js:436-461 (`if (!navUser \|\| !navUser.uid)` branch — inline SVG silhouette, `navAcctEl.textContent = 'Sign in'`) — nav is shared app-shell chrome, outside `renderHome`'s own output, so it is not re-rendered inside this surface-scoped mockup (same convention as `docs/studio/mockups/shelf.html`, which also omits the nav) |
| OG3 | "Build your own arc" sign-in CTA reachable from the public examples | **CONFIRMED** | views.js:3690-3693 (Arcs page examples section) and views.js:13073-13075 (a second surface) — both `buildSignedOutPrompt('Build your own arc', ...)`; this CTA lives on the Arcs surface, not Home, but is part of the named cluster |
| OG4 | Signed-out Home renders no dead/negative personal-dashboard widgets | **CONFIRMED** | `renderHome`'s early return (views.js:1454-1460) exits BEFORE the welcome/alternator/variants/glimpse block — a signed-out visitor never reaches the "No arcs yet"/"Nothing open" code paths at all |
| IA4 | First-run onboarding lands on `#book/<id>` or `#notebook`, never Home | **CONFIRMED** | intros.js:391 — `var dest = (picked && picked.bookId) ? '#book/' + picked.bookId : '#notebook';` (journey's `onNext` final step, intros.js:388-397) |

**Additional live finding (adjacent to the cluster, not one of OG1-4/IA4, surfaced
because the mockup had to render it faithfully):** Home's `.empty-state` (the
signed-out door's own markup) has **no scoped CSS at all** — `.notebook
.empty-state` (components.css:9790-9795) and `.shelf .empty-state` /
`.shelf.lum-amber-deep .empty-state` (9856-9861 / 11364-11365) exist; `.home-page
.empty-state` does not. Live consequence: the crest/h2/p inherit only color +
font-family from `.home-page`, and fall back to the bare UA-default box model —
left-aligned (`.home-page.lum-amber-deep` sets `text-align:left` explicitly, unlike
Shelf/Notebook's explicit center), an oversized bold sans h2 (no italic serif), no
narrowed reading measure, no inter-element rhythm. The mockup reproduces this
faithfully (see the CSS comment above `.empty-state h2/p`) rather than silently
fixing it, since it is not named by D1-D4. Recommend a future round add a scoped
`.home-page .empty-state` rule (mirroring Shelf/Notebook's treatment) — this is the
one screen where a first-time, unauthenticated visitor actually lands.

### Forks

None. One delta was flagged (D1's "§4" citation vs. §4's literal galaxy-only scope
— see the D1 row above) and resolved per the mockup-wright's own rule ("live source
wins, flag the delta") rather than written up as a FORK, since it is not two locked
decisions colliding over the same slot — it is a mismatch between the brief's
prose and the cited source document, with a clear, defensible reading available.
Preston should confirm this reading holds before the round closes.

### Self-verify evidence

- **Renders clean:** structural tag balance checked — `section` 3/3, `div` 70/70,
  `span` 33/33, `svg` 1/1 (template), `html`/`head`/`body`/`style`/`script` 1/1 each;
  CSS brace balance 92/92; paired HTML tags `a` 11/11, `p` 6/6, `h2` 3/3, `button`
  10/10. The embedded `<script>` was extracted and run through the sanctioned
  `tools/parse-check` (`cscript //nologo //E:jscript`) — **PARSE OK** (exit 0).
- **Byte size:** 47,902 bytes / 795 lines.
- **EVOLVED markers:** 13 real instances (excluding the one legend line in the
  provenance comment that spells out the convention with a literal placeholder
  `Dn`, not a real decision number) — `grep -oE "EVOLVED: D[0-9][a-c]?"` →
  D1×2, D2×2, D3×5, D4a×2, D4b×1, D4c×1. Every marker maps to exactly one of the
  four locked decisions; nothing unmapped.
- **`git status` (app code):** `js/`, `assets/`, `index.html`, `sw.js` show no
  changes. `design/` shows only the same pre-existing untracked files present at
  session start (not touched this round). Only `docs/studio/mockups/home.html` is
  new under `docs/studio/`.
