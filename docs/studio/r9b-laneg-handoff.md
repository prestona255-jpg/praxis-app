# R9b — LANE G (the galaxy) · HANDOFF (memory-blind, self-contained)

**You are building R9b Lane G in a FRESH session. Lane P (the page) has SHIPPED. This file is canonical
and self-contained.** Lane G is its OWN full five-beat: scan → forks → mockup → felt pass → staged build →
close. Session rituals still bind: `sh tools/ground-truth`, `docs/studio/sequence.md` at session start,
PROTOCOL.md + FIX-PROTOCOL.md, both gates (fix-red-team + praxis-reviewer) before commit, COMMIT-NO-PUSH
(Preston's exact words push). Predecessors: R9a merged Profile (v3.198 `e25ac6f` + v3.199 `6e96d5b`); **Lane P
shipped v3.200** (see ship facts below). Read `docs/studio/profile.md` (surface ledger),
`docs/checkpoints/r9b-handoff.md` (the parent round handoff), `docs/checkpoints/r9b-laneP-recon.md` +
`docs/checkpoints/r9b-laneP.md` (Lane-P recon + build), and the Lane-P mockup
`docs/studio/mockups/profile-laneP.html`.

## 0. LANE-P SHIP FACTS (what's live going into Lane G)
- **Version:** sw.js `CACHE_VERSION = praxis-v3.200` (Lane P; was v3.199). **Commit:** the R9b Lane-P commit on
  `origin/main` (subject: "R9b Lane P — profile arcs · lineage · quality pack · faint-default web · DNA re-slot
  · intro (v3.200)"; look it up with `git log --oneline` — this handoff ships IN that commit so it cannot name
  its own hash). Rails touched: `js/views.js` + `assets/components.css` + `js/intros.js` + `sw.js` (+ docs).
  Display-only; ZERO data-model change; `state.js`/`integrations.js` UNTOUCHED; `buildReaderModelSection`
  BYTE-UNCHANGED (its `#pf-yumi-mount` moved Settings-adjacent).
- **Gates:** fix-red-team = **NO-BLOCK**; praxis-reviewer = **CLEARED TO COMMIT** (both re-derived every invariant).
- **What Lane P added (now live for Lane G to build on):** question-led ARCS section (visitor-fenced to arcs
  with ≥1 published sub) · public LINEAGE band (deduped `why` lines, load-ordered) · Now richness
  (latest-published cross-link) · Published quality pack (never "Uncategorized"; untitled→excerpt-led;
  2-up@n=2/centered@n=1) · DNA re-slot (threads reflection after Now via new `_pfThreadsSection`; consent
  instrument Settings-adjacent) · profile W9 intro beat (`ROUTE_INTRO['profile']`) · **faint-default value web**
  (`.pf-vline` opacity .34 rest / .78 on tap — SHIPPED behavior, felt-passed).

## 1. CONFIRM-PASS STATUS — ⚠ STILL OWED (Lane G is GATED on it)
The live-R9a confirm pass was **requested at the Lane-P mockup checkpoint but NOT yet given**. Before Lane G's
mockup/build proceeds, get Preston's confirm on the deployed R9a: **(1) split-tap feel** (preview-as-visitor ↔
return) · **(2) sheet-over-hero at true 390** · **(3) strip + counts caption stay visible with a panel/overlay
open.** These three feed Lane G's selection-scoped PANEL (P1 inheritance). Do not lock the panel interaction
model until they're confirmed.

## 2. LANE-G LOCKS (verbatim from `docs/checkpoints/r9b-handoff.md` §2 — decided, design within)
- **Central identity orb** — gilded avatar ring; the largest glint but **smaller than any planet**; tap
  scrolls to the thesis; the value-constellation lines route THROUGH it.
- **Motion layer — CSS-only keyframes:** planet drift 60–120s · stars orbit their parent planet · speck
  twinkle. **Zero per-frame JS.** Freezes under `prefers-reduced-motion` (the reduced-motion rig).
- **Presence pass** — planet radius floor + ceiling raised (size still = books); cluster spread scales with
  viewport; star orbit radii tightened; hero stays ~60vh.
- **Sky LENS-MODE** — planets switch **categories ⇄ lenses** with the Numbers toggle (ONE meaning at a time);
  **mode-scoped lens HUES** (the AM22 deterministic mapping extends to lens slugs, active only in lens mode);
  lens surfaces stay **owner-only** (AM46).
- **Published-arc CONSTELLATIONS** — persistent quiet named lines connecting an arc's published-sub stars, a
  small arc-name label, collision-engine covered, **visitor-visible**, faint vs the bright value-lighting
  layer. Display-only over existing arc-publish state.
- **The selection-scoped PANEL** (P1 inheritance from the mobile canon): bottom sheet ≤759 (the Manage
  reference), anchored side panel ≥1200; strip + caption stay visible. Content = the tapped category's
  deep-hue header, scoped counts, a reading sparkline (**recon-verify dated events; honest fallback =
  marginalia-rhythm sparkline, LABELED truthfully**), most-annotated + most-revisited (**recon-verify the
  returns signal**), its sub-theory stars as links, and "view these books on the shelf →". Visitor panel
  fenced to published stars, no lenses, no marginalia. Panel sparse states incl. a third-person variant.
  **Ships the P1 sheet FOCUS-TRAP correctly, ideally fixing the reference impl.**
- **INTERACTION MAP:** orb → thesis · star → sub-theory page (KEPT) · planet → panel · **Numbers card → panel**
  (upgrades the v3.199 shelf-link interim) · arc-constellation label → arc page · value chip → lights.
  **Intermediate contract:** planets keep the v3.199 filtered-shelf navigation UNTIL Lane G ships.
- **teal → gold DNA re-skin** rides Lane G (the reader-model `.rm-toggle` teal on-state → the gold system).
- **AM39 sky budget carries** (single SVG render, no per-frame JS after draw-in, reduced-motion path). The
  **widened collision proofs** (full object set: text vs text + stars + planets, at 390/1280/1920) **re-run
  whenever the sky gains elements.**

**DEFERRED / OUT OF SCOPE (verbatim §3):** curated published ordering (a future data session); any
share-profile affordance (the Lane-2 / R11 commons-open security fence).

## 3. INTERIM CONTRACT NOW IN FORCE (from Lane-P non-goals)
Until Lane G ships: **planets AND the Numbers cards keep their v3.199 FILTERED-SHELF navigation**
(`_pfShelfTo('category', …)` for planets/`data-planet`; the Numbers stat/cat cards navigate to shelf/arcs).
Lane G upgrades planet→PANEL and Numbers-card→PANEL per the interaction map above. Do not remove the interim
shelf-links until the panel ships.

## 4. LANE-G STAGE-0 RULING TASK — the scoped-counts "passages" contradiction
The Lane-G selection-PANEL lock says its content includes "scoped counts." **"passages" has NO distinct data
store** — R9a's deliberate reversal replaced the mockup's "passages" By-the-numbers stat with **"arcs"** (no
passages collection exists; `_profileOverview` counts books · marginalia · arcs · sub-theories · published,
views.js). **Lane G Stage 0 MUST rule what the panel's scoped counts show** (e.g. books · marginalia ·
sub-theories for the tapped category/lens) and must NOT reintroduce "passages." Record the ruling before the
Lane-G mockup.

## 5. INHERITED FINDINGS from the Lane-P build (carry these — Preston's riders)

### 5a. LIVE FINDING — R9a value-lines read line-less at 390 (fixed in Lane P; recorded for the round close)
`_profileBuildSky` (views.js:~17130) emits value constellation lines **width-agnostically** at 390, but two
limits made them read as absent on the deployed R9a: (1) `.pf-vline` was `opacity:0` until a value was tapped,
at BOTH widths; (2) **same-category value pairs collapse** — geometry trace (owner fixture): Doubt ≈ 9px,
Praxis ≈ 22px at 390 (both subs cluster around one planet, hidden behind the star glows), while the
cross-category Liberation line is 143px @390 / 280px @desktop. Lane P **fixed** this by making the value web
faint-by-default (`.pf-vline` opacity .34 rest / .78 on tap, felt-passed) — cross-category lines now read at
both widths without a tap. Lane G's motion/presence work inherits the faint-default web; re-run the widened
collision proofs whenever the sky gains elements.

### 5b. NAMED DEBT — commons `#reader` DRAFT-SUB-BODY exposure (two-axis coherence; NOT Lane P's / NOT Lane G's to fix)
The profile fences a visitor's arc visibility by **≥1 published sub** (Lane P), but the commons/`#reader`/
`#walk` path fences by **`arc.published`** and its projection `buildPublishedArcDoc` (integrations.js:2456-2467)
filters child subs by `st.arcId` + non-blank header **but NOT by `st.status`** — so a commons-published arc
projects the `bodyPublic` of ALL its non-blank subs, **including DRAFT-status subs**. A reader walking a
published arc can therefore see the public body of a sub-theory the author still holds as a draft — content
the profile's own fencing would hide. **A data/commons concern (integrations.js is READ-ONLY this round);
R11 / FX-1 adjacent.** Carried here per Preston's rider so the round close-out inherits it.

## 6. VERIFICATION INHERITANCE (every R9a/Lane-P gate class carries into Lane G)
Widened collision proofs (full object set, three widths 390/1280/1920) · D1/D2/D3 (occupancy ≥60% @1920,
prose ≤72ch, no h-scroll) · P1–P9 at true 390 · AA per deep hue on light · AM51 DOM-order traversal ·
visitor-fencing element-checks (owner vs visitor, presence AND absence) · Live Forensic Smoke (no `.pf-` bleed
on Shelf/Arcs/Home/Notebook + console scan) · live-shaped fixtures for any carried builder · the FAINT-DEFAULT
named gate (value web reads at 390 AND 1280; tap-to-brighten) · AM39 single-render/no-per-frame-JS budget +
reduced-motion path. Both gates before commit; deployed felt pass + `prestonpraxistest` live smoke close.
`prestona255` READ-ONLY always; `prestonpraxistest` for behavior tests.

## 7. STILL-OPEN AT LANE-P SHIP (close before the ROUND closes — Lane G's session owns the close-out)
- The Lane-P **FAINT-DEFAULT + AM52 named gates need recorded LIVE-DOM evidence** (both gate reviewers noted
  the checkpoint holds source values + static traces only; a rendered 390/1280 readout must be captured on the
  deploy — do this in the Lane-P live smoke and record it).
- Round close-out (sequence.md re-plan, BOARD, `tools/studio-build` Builder regen, the shelf/books nit) is
  Lane G's session, NOT done in Lane P.
