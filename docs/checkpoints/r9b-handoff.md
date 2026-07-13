# R9b — Profile arc layer + galaxy depth · HANDOFF (memory-blind, self-contained)

**You are building R9b in a FRESH session. This file is canonical and self-contained.**
Predecessor: R9a shipped the MERGED Profile at `#profile` (v3.198 `e25ac6f` + patch v3.199 `6e96d5b`,
deployed felt pass = STRONG PASS 2026-07-12). Read `docs/studio/profile.md` for the live surface,
`docs/checkpoints/r9a-shape-a.md` for the AM decision stack, and the v5 mockup
`docs/studio/mockups/profile.html` for the built contract. Session rituals still bind: `sh tools/ground-truth`,
`docs/studio/sequence.md` at session start, PROTOCOL.md + FIX-PROTOCOL.md, both gates before commit,
COMMIT-NO-PUSH (Preston's exact words push).

## 0. ROUND SHAPE
- **R9b = TWO LANES, ONE ROUND, FULLY DISPLAY-ONLY.** No data-model change, no migration, no new synced
  collection. **Any persisted need = HALT fork** (surface it; do not carry it silently). Aggregation +
  presentation over EXISTING data only (arcs, subs, `valueMarks`, `profile.values`, `userThemes`,
  notebookEntries, arc-publish state).
- The R9a locks are **confirmed by the deployed felt pass** — do not re-litigate. Lane G's mockup re-tests
  *feel* only (motion, orb, panel), never the shipped ontology.
- **Lane P (the page) ships FIRST.** **Lane G (the galaxy) opens ONLY after Lane P ships**, as its OWN full
  five-beat (scan → forks → mockup → felt pass → staged build → close) with its own mockup.
- RAILS (unchanged from R9a): strict ES3 in views.js (var/function, for-loops, string concat, two-arg
  `.then`); tokens-only Universal v1.2 + the `--field-*-deep` ramp; **no `--lum-*` in NEW CSS** (use
  `--star-gold` / `--gold-hi` / the field ramp); `.pf-*`-scoped, no bleed; new CSS in `@media(min-width:1200px)`
  blocks after base rules, 759/760 tier untouched; the locked `renderSubTheoryConstellation` /
  `renderArcConstellation` (arc-constellation.js, F-D4) stay OFF-LIMITS — the PORTRAIT galaxy
  (`_profileBuildSky`) is R9b's to evolve; `prestona255` READ-ONLY always, `prestonpraxistest` for behavior
  tests; path-explicit staging; cache bump once at the final commit.

## 1. LANE P — the page (SHIPS FIRST)
- **Arc cards.** Visitor: arcs with **≥1 published sub**, listing published subs only. Owner: all arcs with
  draft counts. **Question-LED cards** (the arc's question leads; Published stays piece-led — do not make arc
  cards look like Published cards).
- **Lineage row** — DERIVED from the R8 mark-lineage lines (the `why` strings on `valueMarks`), deduped,
  most-cited first. Recon-check the data richness first; **sparse-honest if thin** (invitation, never fake).
- **Now richness** — a progress line + a latest-published cross-link + the owner-only whisper.
- **Cross-links pass** — wire the standing dead/absent cross-links between Profile sections and arcs/subs/shelf.
- **Profile intro beat** — via the existing W9 intro system (`js/intros.js` = `window.Intros`; the per-page
  panel pattern). One profile orientation panel.
- **Sparse states** — every section carries owner/visitor voice variants (owner-voice where owner-only,
  third-person where public). Extends the R9a invitation lines.
- **PUBLISHED QUALITY PACK:** omit-when-unknown category (**never print "Uncategorized"** — drop the dot/label);
  a sparse card variant + excerpt-led when untitled; **excerpt = the first CLEAN PROSE sentence of
  `bodyPublic`, quote blocks skipped** (extend the R9a `_pfExcerpt` leading-marker strip); grid **2-up at
  n=2, centered at n=1**.
- **DNA RE-SLOT** (Preston-directed): threads / journey / returns stay in the portrait flow **after Now**; the
  reader-model **CONSENT panel moves Settings-adjacent**; **Published regains the closing band directly before
  Settings**.
- **PAGE-ORDER REC for the mockup felt pass:** Statement → Values → Numbers → **ARCS** → Questions → Now →
  **LINEAGE** → Published → Settings. **DOM order re-issued to match** (CSS places any rail; keyboard/SR
  traversal follows the sequence — the AM51 discipline).
- **VISITOR render at BOTH viewports = a REQUIRED mockup artifact** (390 + 1280), same as R9a.

## 2. LANE G — the galaxy (opens AFTER Lane P ships; its OWN five-beat + mockup)
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

## 3. DEFERRED / OUT OF SCOPE
- **DEFERRED BY NAME:** curated published ordering (a future data session).
- **NOT IN SCOPE:** any share-profile affordance (the Lane-2 / R11 commons-open security fence).

## 4. VERIFICATION INHERITANCE (every R9a gate class carries)
Widened collision proofs (full object set, three widths) · D1/D2/D3 (occupancy ≥60% @1920, prose ≤72ch, no
h-scroll) · P1–P9 at true 390 · AA per deep hue on light · AM51 DOM-order traversal · visitor-fencing
element-checks · Live Forensic Smoke (no `.pf-` bleed on Shelf/Arcs/Notebook + console scan) · **live-shaped
fixtures for ANY carried builder** (the R9a FIXTURE-SHAPE lesson: a builder that reads a live shape must be
verified against a fixture carrying that exact shape). Both gates (fix-red-team + praxis-reviewer) before
commit. Deployed felt pass + `prestonpraxistest` live smoke close the round.
