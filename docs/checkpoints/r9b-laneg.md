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
