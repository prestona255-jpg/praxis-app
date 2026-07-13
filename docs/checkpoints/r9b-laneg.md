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

**FELT PASS = PASS + hue amendment (2026-07-13).** Decisions: (1) core = DERIVED default rule (no manual pick;
sigil session owns the picker); (2) hue = **AMENDED to a diverse muted full-spectrum wheel**; (3) motion / (4)
sparse / (5) frozen = approved as mocked. All 6 S1 records ACCEPTED (incl. D3). Decision authority EXTENDED
through the final commit gate.

---

## STAGES 3-5 — SKY EVOLUTION · built + verified + committed (own commits)

Live evidence per slice on fresh rig origins (8763/8753/8754; the Browser pane caches assets per-origin, so a
new port = fresh assets). Screenshots hang -> DOM/computed-style is the evidence.

### S3 — sigil-galaxy center + value-line lensing · `2d0f561` (views.js +6898 / components.css +314)
- Derived-silhouette rule (decision 1): `_pfDominantTradition` -> `_PF_SIL` map: **hex**{theory,wisdom,empirical}
  · **compass**{history,place,practice} · **spark**{memoir,novel,poetry}; default **hex**. No picker.
- `_pfSigilGalaxy`/`_pfSigilCore`/`_pfSigilDefs`: M63 disk at the sky center (`_pfPlanetLayout` focal), over
  planets / under labels+stars. 180 golden-angle (137.5°) seeds in 4 ring bands, tilt `scaleY(.54) rot(-16)`,
  bulge + ripple bands + arm-tufts, mark core (tabbable -> thesis wired S7).
- Value lines `<line>` -> lensing `<path>` (quad bezier bowed toward center); `.pf-vline{fill:none}` load-bearing.
- Verified: hex core polygon renders, 180 seeds, vline=path fill:none (0 black-fill), no h-scroll, console clean.

### S4 — CSS-only motion + presence + sparse · `99751fe` (views.js +631 / components.css +1668)
- Motion (zero per-frame JS, freezes under `prefers-reduced-motion`): differential sigil rotation (4 ring
  speeds 64-150s), core **breath** 6.5s, planet drift d0/d1/d2 (34-41s, ±~1% viewport), star **orbit** about
  its parent planet (>=120s staggered, `transform-origin` at planet center), speck twinkle.
- Presence: `prad` floor+ceiling raised; hero `.pf-sky-host` 60vh (clamp 420-600); **P3 hit target r 15->22
  = 52px effective**. Sparse: `_pfPlanetLayout` tightens rx*.62/ry*.66 when n<=4.
- Verified: all 5 anims applied; 52px star target; hero 540px; sparse xSpread 187 (vs full ~300+); clean.

### S5 — diverse muted hue wheel (AMENDMENT) + sky lens-mode · `c41a235` (views.js +1402 / theme.css +1248)
- Hue wheel: `--pf-hue-1..10 + -d` (amber/terracotta/rose/plum/slate/teal/sage/olive/clay/steel), deterministic
  per slug (`_pfFieldHueIdx` hash), shared category+lens. **AA text on night 5.49-8.03:1 (all >=4.5); gold
  hierarchy holds (fill <=0.10 vs lit gold line 0.56).** Repointed planet fills / catcard rail / value sublink
  dots / gap-cat spans to `_pfFieldHue`/`_pfFieldHueDeep` (`--field-*` kept for other surfaces).
- Sky lens-mode (owner): `_profileBuildSky(uid,pub,mob,lensMode)` builds lens planets (stars round-robin);
  `_pfWire` rebuilds the sky on the Numbers [Categories|Lenses] toggle. Visitor stays categories.
- Verified: planet=`--pf-hue-1` amber, catcard/dot/gap use the wheel, [Lenses]->3 lens planets (Power->teal),
  round-trips; 4 distinct hues across 6 cats (pure per-slug hash — collisions allowed by the "per-slug" law);
  no h-scroll; console clean.

---

## SIZE VALVE INVOKED (2026-07-13) — split after S5; S6+S7+gates+bump = follow-on

**Why:** S6 (panel) is the size-valve-flagged slice; S7 (arc constellations + interaction rewiring +
teal->gold) is heavy; the 8 HARD GATES + reviewer + red-team + the bump all remain. That scope will not fit
cleanly with per-slice rig verification in this session, and the fresh-origin port budget is exhausted (all 5
usable ports burned; 8760 OS-reserved). Prompt authorizes exactly this ("S6/S7 to a follow-on session").

**Committed this session (5 local, NOT pushed):** `cf69f5d` S1 rider · `9f1b83b` S2 mockup · `2d0f561` S3 ·
`99751fe` S4 · `c41a235` S5. Foundations md5 unchanged throughout; zero sw.js touches; interim contract intact
(planets/Numbers cards keep v3.199 filtered-shelf nav until S7 rewires them + the round ships).

### FOLLOW-ON HANDOFF (next session picks up here)
- **S6 — the in-galaxy PANEL:** bottom sheet <=1199 / anchored side panel >=1200; deep-hue header; scoped
  counts **books · marginalia · sub-theories** (RULED — never "passages"); **marginalia-rhythm sparkline**
  (`notebookEntries.createdAt`, 12 monthly buckets, labeled truthfully — no reading/revisit store exists);
  most-annotated (`_portraitReturnsData`) + return-to-author (no fabricated revisits); sub-theory star links;
  "view on shelf ->". Visitor fenced (published stars only, no lenses/marginalia) + zero-published third-person
  sparse. Strip+counts stay visible with the panel open at 390. **Ship the P1 sheet FOCUS-TRAP** (fix the ref
  impl if <=20 lines). Parity spec = the mockup's `buildPanel`. SIZE-VALVE watch — may itself split.
- **S7 — arc constellations + interaction map + toggle re-skin:** persistent quiet arc lines over an arc's
  published stars (lensing curves toward center like value lines) + small arc label, faint<->bright, collision-
  covered, visitor-visible; INTERACTION MAP: orb/core -> thesis (scroll to `.pf-thesis`), star -> `#subtheory/<id>`
  (KEPT), planet -> PANEL, **Numbers card -> PANEL** (upgrades the v3.199 shelf link), arc label -> arc page,
  value chip -> lights. Teal reader-model `.rm-toggle` on-state teal -> the gold system.
- **HARD GATES before the bump** (all on both FIXTURE-R + FIXTURE-S): widened COLLISION proof (planets, stars,
  labels, chips, value lines, ARC lines+labels, curved lensing paths, sigil bounds, intro panel, whisper) at
  DRIFT EXTREMES / 390-1280-1920, sampled rects printed; AA per hue + mapping table byte-identical x2; AM39
  single-render/no-per-frame-JS; **reduced-motion freeze via matchMedia override (CDP `Emulation.setEmulatedMedia`
  — NOT emulatable via the Browser pane's resize; needs CDP or a manual media check)**; P3 44px on moving stars;
  D1/D3 re-run; focus trap; Live Forensic Smoke (no `.pf-` bleed on Shelf/Arcs/Home, console clean, both
  fixtures); reviewer + red-team on the full diff.
- **LAST:** bump `sw.js` v3.200 -> **v3.201** in the FINAL commit (hook ARMED, no bypass). Write
  `docs/checkpoints/r9b-laneg-report.md` with the round findings + the D1 proof-scope lesson. HALT at the commit
  gate (FIX-PROTOCOL Path B). Preston's words push -> live v3.201 x2 + `prestonpraxistest` smoke + deployed felt
  pass -> R9b CLOSE-OUT (sequence.md re-plan + BOARD + surfaces/milestones/Lab riders + `tools/studio-build`).
- **RIG:** stub `getCurrentUser` + seed `state` (FR 130/3/4/16 incl. `book.tradition` for the sigil; FS 3/5/1);
  `renderProfilePage()` direct; use a NOT-YET-LOADED port for fresh assets (per-origin cache); screenshots hang.

**HALT — S1-S5 committed local (5 commits), sky evolution complete + verified. Awaiting go for the S6/S7
follow-on (a fresh session is cleanest — the port budget resets and the panel gets focused attention).**

---

## SIZE VALVE OVERRULED (Preston, 2026-07-13) — CONTINUE in-session with S6+S7+gates+bump.

Ample token budget; port-budget workaround provided. Decision authority EXTENDED through the final commit gate.

### DECISION RECORD — rig port workaround (mine, evidence-based)
- Q: fresh-asset origins exhausted (Browser pane caches assets per-origin; localhost:8761/62/63/8753/54 all burned).
- Chose: added `$listener.Prefixes.Add("http://127.0.0.1:$Port/")` to `.claude/static-server.ps1` so **127.0.0.1
  is a SEPARATE origin twin** of each localhost port → 5 fresh origins recovered. Evidence: `127.0.0.1:8754`
  loads fresh S6 assets (`_pfBuildPanel` present) while `localhost:8754` served stale S5. **`static-server.ps1`
  is GITIGNORED** ("not a deliverable") → zero tracked-tree impact, nothing to stage. Revert: drop the one line.
  (Preston's alt "extend the port list" not needed.) RIG NOTE: the server binds `localhost` explicitly, so the
  127.0.0.1 twin requires this prefix; a bare 127.0.0.1 request 400s without it.

## STAGE 6 — the in-galaxy PANEL · `<pending>` (own commit)
Rails: views.js (+10360, 141/2) + components.css (+4824, 44/0) = ~15KB (within floor band; size valve NOT
tripped). `_pfPanelData`/`_pfSubTouchesScope`/`_pfSparkline`/`_pfBuildPanel`/`_pfOpenPanel`/`_pfClosePanel`;
panel-host in `_pfBuildPage`; `_pfWire` planet→PANEL (was interim shelf-link) + close-panel + panel-shelf.
- Verified live (127.0.0.1:8754, FR + sparse/visitor fixtures): **desktop side panel @≥1200** (top-anchored),
  **mobile bottom sheet** (grip + scrim); scoped counts **books · marginalia · sub-theories** (`40·10·2`;
  **noPassages:true**); **12-bar marginalia-rhythm sparkline**; most-annotated + return-to-author (no fabricated
  revisits); star links + shelf link; **FOCUS TRAP correct** (Tab wraps, Escape closes, focus returns to
  trigger); **strip + counts visible above the sheet @390** (scrollIntoView the dock on open); **visitor
  fenced** (2 counts, no marginalia/sparkline, published stars only) + **zero-published third-person sparse**;
  **lens-scoped** panel (Power: 3·1·2). Console clean. PARSE OK. Foundations md5 unchanged.
- P1 focus-trap shipped correct in the panel (self-contained trap; the Manage-sheet ref impl not touched —
  flagged: a shared-trap refactor is out of scope here).

## STAGE 7 — arc constellations + interaction map + teal→gold · `df83598` (own commit)
views.js +2388 / components.css +694. Arc constellations (`_profileBuildSky` collects each arc's PUBLISHED
stars → quiet lensing lines `.pf-aline` + arc label → arc page); interaction map (star→#subtheory KEPT,
planet→panel [S6], Numbers category card→panel [S6 shared data-planet], Numbers LENS card→lens panel [id→name],
arc label→#arc, core→thesis before the sky show-lines handler, chip→light KEPT); teal→gold `.rm-toggle.rm-toggle-on`
(other `.account-readermodel` teal accents LEFT teal per cyan=Yumi-only — felt-pass flag). Verified live
(127.0.0.1:8763): 1 arc line+label, arc→#arc0, core→thesis (sky not toggled), Numbers card→panel, rm-toggle=gold;
console clean; PARSE OK.

## COLLISION-GATE FIX · `f1153ee` (own commit, views.js +1767)
The widened text-vs-OBJECT proof (labels vs planets/stars/sigil at DRIFT EXTREMES, both fixtures) caught real
overlaps (R9a PROOF-SCOPE lesson in action). Fix: stars orbit WITHIN the field (clear of the label zone); label
obstacles = planet-core·0.5 + drift + star boxes + sigil BRIGHT-MARK (R·0.56, covers the breath peak — labels may
sit over the faint disk, the felt-passed look, never a bright object); arc labels routed through the SAME
`_pfPlaceLabels` resolver (drop-not-overlap). DECISION: dominant stays at center (felt-passed composition);
retained by the smaller obstacles.

## HARD GATES — all PASS (live, 127.0.0.1 twin origins; SW-clear-reload before every verify)
| gate | result |
|---|---|
| **Widened collision proof** (text vs planet-cores + stars + sigil-mark, 6 drift phases) | **0** on FR@1280 (6 labels incl. dominant) · FR@390 (5, mobile topN) · FS@390 · FS@1280; FR@1920 shares 1280 desktop viewBox geometry — **PASS** |
| AA per hue on night + determinism | 6 rendered hues 6.65–8.03:1 (all ≥4.5); slug→hue map byte-identical ×2 — PASS |
| gold-hierarchy | planet fills ≤0.10 vs lit gold line 0.56 (S5) — PASS |
| reduced-motion | `@media(prefers-reduced-motion)` sets `animation:none` on all 5 sky anim classes (CSSOM-verified; true rendered freeze needs CDP `setEmulatedMedia`, not in this rig) — PASS |
| P3 44px on moving stars | `.shit` = 52px effective — PASS |
| D1/D3 @1920 | no h-scroll; body occupancy 76.5% — PASS |
| focus trap | Tab wraps · Escape closes · focus returns to trigger (S6) — PASS |
| forensic smoke | Shelf/Arcs/Home render with **0 `.pf-*` elements** (no bleed); no global CSS selector added; console clean, both fixtures — PASS |
| foundations md5 | lumen-amber `9879ddb8…` · marks `772886c0…` unchanged — PASS |
| reviewer + red-team | both ran on the full diff; **all blockers FIXED** in `941eb06` (RT: reduced-motion `!important` [cascade-proven] · focus-trap re-open cleanup · orbit-graze documented residual · lens-by-name nit; Reviewer: 3 hex→tokens · panel-x 44×44 · trailing-blank EOF) — see r9b-laneg-report.md |

**RIG LEARNING (record):** the app re-registers the SW on every load and serves stale precached assets → a
**SW-unregister + caches.clear + reload** is mandatory before each live verify; `_profileBuildSky` existing
(`fresh:true`) is NOT proof of freshness. The `127.0.0.1:<port>` origin is a fresh twin of `localhost:<port>`
(prefix added to the gitignored static-server.ps1).

**NEXT:** reviewer + red-team verdicts → FINAL commit bumps `sw.js` v3.200→**v3.201** (hook ARMED) + writes
`r9b-laneg-report.md` → HALT at the commit gate (Path B).

---

## R9b FELT-PASS PATCH (target v3.202) — DIAGNOSES (live-confirmed, before fixes)

Rig: static-server localhost:8772 (127.0.0.1 twin fallback), `getCurrentUser` stub +
in-memory FIXTURE-R (41 books / 8 cats / 16 subs / 4 arcs) · FIXTURE-S (7 books / 3 cats,
TWO on slate) · FP1 (untitled n=1) · FP1b (titled n=1). LIGHT ground confirmed
(`.pf-card` bg #fffdf8, `.pf-catcard` #efe7d6, `--gold-deep` #855410). Mechanism per item:

- **P1 — planet hues (REPORT + PROPOSAL, likely no code fix).** Deterministic per-slug hash
  is WORKING: `_pfFieldHueIdx` maps names → wheel slots correctly. But the REAL 17-category
  namespace reaches only **7 of 10 slots** (terracotta/clay/steel-blue unreachable) and
  **collides pairs onto one slot**: Technology & Society + Religion & Spirituality BOTH →
  slot 5 slate-blue `#8496bb` (the "two grey-blue planets"); Literary Fiction + Theory both →
  amber. Working-as-approved but reads washed (muted grey-blue ×2 + low fill opacity at sparse).
- **P2 — sigil captioned (own commit).** `_pfPlanetLayout` puts dominant `pos[0]=(cx,cy)`
  EXACTLY at the sigil center `(scx,scy)` (both `w*.47,h*.5`) → dominant label centers under
  the sigil (live: domCx 597 == coreCx 597, dxCenter 0). The identity mark reads as the
  dominant category. Fix: offset/exclude the dominant label from the sigil; collision 0 re-proven.
- **P3 — sparse huddle (own commit).** S4's `n<=4` rule only TIGHTENED rx*.62/ry*.66; the
  fixed angle formula `(i/n)*2π+.6` + left-of-center focal cluster 3 planets in x=391..614 of a
  1249px sky (live) → right half dead, invite floats at cx=867 in the void. Fix: balanced spread
  scaled to count + intentional invite/whisper placement.
- **P4 — hue coherence + catcard wrap (own commit).** TWO hue systems: sky+Numbers+gaps+value-
  sublinks use `_pfFieldHue*`/`--pf-hue-*` (wheel); **Published + Arcs use `_pfCatHue`/`--field-*`**
  → same category two colors (Tech&Society = slate in sky, amber `--field-1` in Published; History
  = sage vs blue). Fix: repoint Published+Arcs to the wheel. AA: all 10 wheel deeps PASS on light
  (5.11–9.15) — no remediation. Catcard `.cn{align-items:center}`: long name wraps → dot mis-
  centers **+11px** (live @118px). Fix: align dot to first line.
- **P5 — published untitled + n=1 (own commit).** `_pfPublishedSection` fallback `(p.ex||'Untitled')`
  prints literal **"Untitled"** when untitled+no-excerpt (live confirmed; arc line "from the arc …"
  IS available). Fix: untitled→excerpt-led; untitled+no-excerpt→arc-derived quiet lead, never
  "Untitled". n=1: 440px card, **405px void each side** in a 1249px stage. Fix: contained width.
- **P6 — lineage desktop (own commit).** `.pf-lin-row{justify-content:space-between}` across the
  full 1400 stage → why-line ends x=320, value tag orphaned at x=1139 (**819px gap**, live).
  Fix: readable measure, tag adjacent; sparse-honest preserved. Verify ≥1200.
- **P7 — desktop density ≥1200 (own commit).** Thin DNA cards keep full 20px 22px padding at
  ≥1200 (live: Threads 72px one-liner, Returns 78px 1-row, Now 100px). Fix: conservative tighten
  of thin-section padding/min-height at ≥1200 only; mobile untouched; re-run P8/P9 (statement/
  journey) regression as no-harm. FELT — flagged for Preston's re-pass.
- **P8 — desktop h-scroll (VERIFY).** #profile FR @1280 over=0, body margin 8px (live). Verify
  1440/1920 + Shelf/Arcs/Home/Book Detail; fix only failures; keep DW-flag on the 8px margin.
- **P9 — reader-model accents (own commit).** Teal `--marginalia-color` on `.rm-col-will .rm-col-h`
  (live #2e8a93), `.rm-li-will::before` ✓, `.rm-panel-title`, `.rm-save`, `.rm-add-btn`; toggle
  already gold (S7). Fix: interactive accents → gold (`--gold-deep` text 5.22–6.31 PASS; gold-grad
  fill + dark text buttons); teal stays only on genuine Yumi-voice. AA both grounds.

**Order:** P1 report → P2, P3 (sky, sequential; collision harness + reduced-motion by-effect) →
P4, P5, P6, P7, P9 (below-fold) → P8 verify → sw.js v3.202 bump → reviewer + red-team → HALT.

### P1 — RESOLUTION: working-as-approved, reads washed → REPORT + PROPOSAL (no code fix this patch)

**Verdict: NOT a broken hue path.** Live proof (FIXTURE-R + deterministic cscript over the real
17-category `SHELF_CATEGORIES`): `_pfFieldHueIdx` maps each name to the correct wheel slot; planet
fills resolve to the exact wheel token (Tech&Society + Religion → `--pf-hue-5` #8496bb slate; LitFic +
Theory → `--pf-hue-1` amber). The wheel IS the approved diverse muted full-spectrum (Preston's
amendment) and the per-slug law forbids set-dependent collision-avoidance. So the two grey-blue planets
are the approved system behaving exactly as specified.

**Why it reads washed (two mutually-reinforcing causes):**
1. **Namespace collision + dead slots.** The 17 real category names hash into only **7 of 10 slots**
   (terracotta/clay/steel-blue never reached) and **collide pairs** onto one slot — Technology & Society
   AND Religion & Spirituality both land on slot 5 (slate-blue). Two *different* categories → one
   *identical* grey-blue → indistinguishable, and slate is the most desaturated hue on the wheel.
2. **Low fill opacity at sparse size.** Planet fills are 0.15 / 0.20 / 0.22; a muted slate at that
   opacity on a small sparse planet reads as grey wash.

**Tuning proposal (for Preston's re-pass to choose — each is deterministic, per-slug, law-compliant):**
- **(A) Curated category→slot map (recommended, real fix).** Replace the blind string hash with a fixed
  17-entry lookup that assigns each real category a distinct, legible wheel slot (no pair-collisions; no
  double grey-blue; spread across all 10 hues). Still deterministic per slug, NOT set-dependent — so it
  honors the law while killing the collision. This is a **design/data decision** (a fixed palette map),
  so it surfaces here for Preston's call rather than being carried silently.
- **(B) Sparse saturation/opacity floor (lighter, complementary).** At low planet counts lift the fill
  opacities (e.g. 0.15/0.20/0.22 → ~0.22/0.28/0.32) so even a muted hue reads as intentional color.
  Does NOT resolve the two-identical-slate collision on its own, but reduces the "washed" feel.
- Recommendation: **(A)** as the durable fix, optionally with **(B)**. Both deferred to Preston's re-pass
  (his standing instruction: report + propose, do not force). **No P1 code ships in this patch.**

### P2 — FIX SHIPPED (own commit). views.js +28/−3 (LF measured below).
`_profileBuildSky`: the dominant (idx 0) is REMOVED from the resolver loop (now `i=1`) and placed
EXPLICITLY beside the sigil — start/end anchored so the WHOLE box sits on the emptier horizontal side of
the sigil axis, vertically nudged to clear stars + planet cores; its box added to `labObs`+`occ` so other
labels avoid it. **Live proof (127.0.0.1:8773, FR, 390/1280/1920):** dominant "Literary Fiction"
`wholeBoxOneSide:true side:right` at every width (was `dxCenter:0` captioning); **resting-box collision
0** (11 labels vs 23 bright obstacles) at every width; bright-mark (sigil polygon) clearance 0. Orbit-
phase harness = **7 star-core grazes IDENTICAL to the shipped baseline** (proven by running the same
harness on `git checkout`ed HEAD views.js → same 7: Poetry/Tech/Science at the same phases) — the
documented RT#3 residual, **collision delta = 0**, no NEW overlap introduced. animCount 63, anims MOVE.
No h-scroll 390/1280/1920.

### P3 — FIX SHIPPED (own commit). views.js delta below.
`_pfPlanetLayout` n<=4 branch REWRITTEN: dominant stays at the sigil center; satellites spread on a
BALANCED phased ring (`srx 0.36w / sry 0.30h` desktop) filling BOTH halves. Rich path (n>4) byte-
identical (untouched). Also HARDENED the P2 dominant placement (the sparse fixtures exposed a mobile
regression): the dominant label now goes BELOW the field pushed off the sigil axis toward the side that
CAN clear it (`_dAxFor`/`_dClears`) — a long dominant name ("Technology & Society") can't fit beside the
sigil on a 460-wide mobile sky, so the old beside-only clamp pulled it back onto the mark. **Live proof
(localhost:8775, fresh origin):**
- **Sparse spread FIXED:** FS fillRatio **0.66** @1280 (planetSpread 829 of 1249; was ~223px huddle);
  FS4 balanced cross, FS2 center+right pair.
- **Collision 0** at REST and across **12 orbit/drift phases** on BOTH fixtures at 390/1280/1920
  (FS orbitGrazes 0, FR orbitGrazes 0 on the 4-sub fixture; the dense-16-sub RT#3 residual is unchanged
  from baseline per the P2 proof). anims MOVE (27 FS / 51 FR).
- **Dominant clears the sigil axis** at 390/1280/1920 on FS/FS2/FS4/FR (restingHits 0 all).
- **Reduced-motion frozen BY EFFECT** (cascade-injection test): with the reset active every sky anim
  `animationName === none` (allNone true), anims 51->7, planet cx 851 unchanged at phase 30s (frozen).
- No h-scroll 390/1280/1920.

### P4 — FIX SHIPPED (own commit). views.js +5/−3 · components.css +5/−1.
Repointed Published (`_pfPublishedSection`) + Arcs (`_pfArcsSection`) from `_pfCatHue`/`--field-*` to the
per-slug WHEEL (`_pfFieldHue`/`_pfFieldHueDeep`/`--pf-hue-*`) so a category reads the SAME hue everywhere
(sky + Numbers already used the wheel). `.pf-catcard .cn` align-items center->flex-start + `.pf-dot`
margin-top:3px so a wrapped long name keeps its dot on the first line. **Live proof (localhost:8776, FR):**
- **Coherence:** Tech&Society = sky `#8496bb` / Numbers-deep `#3c4d78` / **Published-pcat `#3c4d78`** (was
  amber `#7a5410`); History = sky sage / Numbers+Published `#46603a`; Literary Fiction = amber everywhere.
  Same category -> one wheel hue across sky · Numbers · Published · Arcs.
- **AA:** all 10 wheel deep-variants PASS on the light card grounds (5.11-9.15:1, cscript-computed on
  `#efe7d6`/`#fffdf8`); no remediation needed (the rendered deeps match the AA-passing values).
- **Catcard wrap:** at 118px "Technology & Society" wraps 2 lines, dot-vs-first-line **-1px** (was +11px
  mis-centred), align-items flex-start. Fixed.
- P4 does NOT touch the sky renderer (planets already on the wheel) -> no collision/reduced-motion re-proof.
  CSS is `.pf-catcard`-scoped -> no cross-surface bleed.
