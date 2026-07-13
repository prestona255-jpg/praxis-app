# R9b Lane G — build checkpoint

Rails: `js/views.js` + `assets/components.css` + `assets/theme.css`. Target v3.201 (bump at the
FINAL commit only). Slices commit `--no-verify` (no sw.js). Live evidence = D0 rig (static-server
:8762, `getCurrentUser` stub, FIXTURE-R 130/3/4/16 + FIXTURE-S 3/5/1, direct `renderProfilePage()`,
`getBoundingClientRect`/computed-style; screenshots hang).

---

## STAGE 1 — DESKTOP COMPOSITION RIDER · PASS (own commit)

### Edits (2 rails)
- **components.css** (+885 B LF, 17 ins / 7 del): (a) `.pf-below max-width 1280→1400` @≥1200;
  (b) `.pf-hero-dock` centered to the same 1400 column (`max-width:1400; margin:0 auto; padding
  0 34px 16px` — 34px matches `.pf-below` so CONTENT edges align); (c) `.pf-grid` regrid to
  `"values numbers" "arcs arcs" "questions questions" "now now"` (+ visitor `"values numbers"
  "arcs arcs"`); (d) `.pf-strip-more` two rules removed → comment; (e) `.pf-journey-cont` rule added.
- **views.js** (+456 B LF, 11 ins / 2 del): (a) `_pfBuildPage` drops the `<span class="pf-strip-more">›`
  span (views.js:17427); (b) `_pfJourneySection` month-label dedup loop (views.js:17664-…).

### DECISION RECORDS (amendment: question · choice · evidence · revert)

- **D1 — widen value.** Q: exact stage width (~1400 ±40). **Chose 1400 (content).** Evidence:
  occupancy @1920 70.2%→**76.5%**, @1440 93.6%→**97.8%**, @1280 97.6% (parent-filled); no h-scroll
  any width; composes under the full-bleed sky. Revert: `max-width:1400`→`1280` (one value).
- **D2 — hero-dock alignment mechanism.** Q: how to align strip/caption to the body column. **Chose
  identical `max-width:1400 + margin:0 auto` on `.pf-hero-dock` with padding 30→34 to match `.pf-below`
  (both content-box → content edges align in centered AND parent-filled regimes; sky SVG left
  full-bleed).** Evidence: **stripVsBody = 0, countsVsBody = 0 at 1280/1440/1920** (the 274px
  misalignment closed; gate ±4px met with 0px). Revert: drop hero-dock max-width/margin, padding→30.
- **D3 — 8px `<body>` margin.** Q: reset app-wide vs scope-flag (amendment: "evidence decides").
  **SCOPE-FLAG to the DW Desktop Wave; NOT reset in this rider.** Evidence: on #profile the margin
  causes **hScroll = 0** at 390/1024/1280/1440/1920, and `.pf-hero-dock` + `.pf-below` share the same
  8px-offset `.pf-root` so alignment is margin-independent (stripVsBody 0). App-wide removal is a
  whole-app blast radius whose per-surface FELT impact is unverifiable inside a galaxy rider → belongs
  to DW (which felt-passes every surface; morning-report Discovery 2 already tagged it DW). Revert: n/a
  (no change made). **Carried to DW ledger.**
- **D4 — "›" orphan fix.** Q: remove vs restyle (Preston: verify the fade still communicates scroll).
  **Dropped the chevron span + its 2 CSS rules; kept the `.pf-strip-wrap.overflow::after` edge-fade.**
  Evidence @390 (overflow true): fade renders a **44px gradient to the opaque `--br-deep`** at the
  right edge (`fadeDisplayed:true`, background `linear-gradient(90deg, rgba(0,0,0,0), rgb(28,18,9) 88%)`)
  — **communicates scroll, not dead**; `.pf-strip-more` count 0 at every width. Revert: restore the
  span (views.js) + the 2 CSS rules.
- **D5 — journey dedup formatting.** Q: how to present same-month continuation beats. **Bold "Month
  YYYY" printed once per group; continuation rows get `.pf-journey-cont` (no top border, tightened top,
  16px indent).** Evidence (synthetic 2×"March 2026" + 1×"April 2026"): **marchLabelCount 1**, row 2
  `cont:true / hasBold:false`, April label prints once. Revert: restore the single-loop `<b>when</b> —`
  emit. Dedup in `_pfJourneySection` ONLY (not the shared `_portraitJourneyData`, used by the retired
  `renderAccountPage`).
- **D6 — regrid shape.** Q: how "full-width sections + keep Values|Numbers two-up" maps to the grid.
  **Row 1 = values|numbers (1.5fr/1fr); arcs/questions/now span both columns.** Evidence @1440:
  valuesW 786 / numbersW 524 (two-up), **arcsW 1341 of belowW 1409 (spans full)**; AM51 DOM order
  unchanged. Revert: restore old `"… numbers" ×4` template-areas.

### GATE EVIDENCE (FIXTURE-R unless noted)
| gate | result |
|---|---|
| occupancy ≥60% @1280/1440/1920 | 97.6% / 97.8% / **76.5%** — PASS |
| **alignment ±4px @1440 & 1920 (added gate)** | strip & counts vs body = **0px** at 1280/1440/1920 — PASS |
| no h-scroll (D3) @390/1024/1280/1440/1920 | 0 / 0 / 0 / 0 / 0 — PASS |
| AM51 DOM order unchanged | values·numbers·arcs·questions·now·returns·journey·threads·lineage·published·consent·settings — PASS |
| BAND INTEGRITY (no leak <1200) @1024 | `.pf-below max-width:none`, grid `none` — desktop widening scoped to ≥1200 — PASS |
| BAND INTEGRITY @390 | untouched layout; only intended cross-width changes ("›" gone, dedup) — PASS |
| P8 journey empty rows | empty data → invite line, 0 rows — PASS |
| P9 visitor + empty statement | thesis omitted (`thesisPresent:false`), no h-scroll — PASS |
| value web faint-default @390 | `.pf-vline` opacity 0.34 (tap-brighten intact) — PASS |
| edge-fade communicates scroll @390 | 44px gradient rendered, `.pf-strip-more` gone — PASS |
| visitor regrid @1440 | values|numbers two-up + arcs full-width, no h-scroll — PASS |
| console (owner + visitor) | no errors — PASS |
| parse-check views.js | PARSE OK (cscript JScript) — PASS |
| ES3 | var/function/concat only; parse-gate authoritative — PASS |
| bytes (LF) | components.css +885 · views.js +456 · no EOL flip (17/7, 11/2 numstat) |
| dirty tree | ONLY the 2 rails (+ the docs) — PASS |
| sw.js | UNTOUCHED (bump at final commit only) — PASS |
| foundations md5 | lumen-amber.css + marks.js unchanged — PASS |

Pre-existing drift not introduced here: none observed on #profile.

---

## STAGE 2 — LANE-G MOCKUP · built (own commit) → HALT for felt pass

**File:** `design/profile-galaxy-laneG.html` (self-running, Universal v1.2 tokens; night ground is the
galaxy's home). Location per the prompt ("one mockup file in design/"). Verified live via the static
server (frame census + interaction + console) — screenshots hang, so DOM/computed evidence stands.

### Coverage (all Stage-2 requirements present + live-verified)
| # | feature | evidence |
|---|---|---|
| 1 | **Sigil-galaxy core** (Mechanic C) | M63 disk: **180 golden-angle (137.5°) seeds** in 4 differential-rotation rings (`sg-r1..r4`, 64–150s), tilt `scaleY(.54) rotate(-16°)`, bulge + ripple bands + 5 arm-tufts; **mark core** (`.sg-core`, `role=button`→thesis) carries the **breath** (6.5s pulse, the only living treatment); 3 silhouette candidates toggle (hex/compass/spark) |
| 2 | **Reduced-motion freeze** | Motion toggle → `[data-frozen=1]` → `animationPlayState:paused` on planets/stars/rings/core/specks (verified paused↔running); `@media(prefers-reduced-motion)` also freezes |
| 3 | **Lensing** | value + arc lines are quad-beziers whose control point pulls toward center (`lensPath`) |
| 4 | **Motion** | planet drift (34–41s, ±~1-2%), star orbit groups (≥120s, 44px `.shit` halos), speck twinkle — **zero per-frame JS** |
| 5 | **Presence** | radius floor/ceiling (16–34 desktop), spread scales w/ viewport, hero `60vh` @≥1200 |
| 6 | **Sparse-sky rule** | Density→Sparse → **3 planets**, tightened spread, centered, invite shown |
| 7 | **Unique hues + AA** | warm wheel `--hue-1..10`, deterministic `slugHue()` hash, shared cat+lens; **all 10 pass AA *text* on night (5.62–9.29:1)** — table printed with ratios |
| 8 | **Sky lens-mode** | owner-only Categories⇄Lenses → planets switch to 3 lenses (first label "Power"); visitor forced to categories |
| 9 | **Arc constellations** | `.pf-aline` faint (`.2`) → bright (`.6`) under value-lighting + `.pf-alabel`; both states shown |
| 10 | **In-galaxy panel** | side panel @≥1200 (`position:absolute`, top-anchored) / bottom sheet @390; scoped counts **books·marginalia·sub-theories** (sparse `[2,1,0]` — never "passages"); **marginalia-rhythm sparkline** (12 monthly buckets, honestly labeled); most-annotated + return-to-author (no fabricated revisits); star links; shelf link; **visitor fenced** + **zero-published third-person sparse** (`.pf-psparse`); strip+counts stay visible |
| 11 | **Teal→gold re-skin** | `.rm-toggle` before/after demo (teal on-state → gold gradient) |
| 12 | **Intro + whisper** | owner-only intro card (top-right gutter, suppressed on mobile) + whisper (bottom-left) — placed clear of planets/labels |

Plus: interaction-map table (7 rows), the hue table, and the 5 felt-pass decisions listed in-page.

### Bug found + fixed during live-verify (recorded)
- FS (sparse) lacked a `panel`/`spark` → `buildPanel` threw → sparse frame kept stale FR content (6 planets).
  Fixed: added `FS.panel` (History, 0 subs — demonstrates owner-thin + visitor zero-published third-person)
  + `FS.spark`; guarded the panel's returns rows + stars section for empty data. Re-verified: sparse=3 planets,
  panel counts `[2,1,0]`, visitor→third-person sparse. First chip no longer pre-`on` (matches app faint-default).
- Console clean across every toggle (owner/visitor · cat/lens · full/sparse · live/frozen · all 3 silhouettes).

### The 5 felt-pass decisions this mockup asks for
1. core silhouette (hex / compass / spark) · 2. default hue (wheel slot 1 = amber) · 3. motion feel
(drift 34–41s, rings 64–150s, orbits ≥120s, breath 6.5s) · 4. sparse-variant approval · 5. frozen state approval.

**HALT — awaiting Preston's felt pass + the 5 decisions. Decision authority ends at this commit.**

