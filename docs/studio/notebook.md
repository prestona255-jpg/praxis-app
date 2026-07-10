---
surface: notebook
route: "#notebook"
render_fn: renderNotebook (views.js:1755)
mockup: docs/studio/mockups/notebook.html
ground: dark
in_nav: yes
state: closed
rounds: 1
---

## State

`#notebook` (+ empty/unknown catch-all) → `renderNotebook` (views.js:1755); dark ground; in top-nav (notebook). Notebook spread.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.188 8cec854] [sev: CRITICAL] NB1 — Notebook primary writeline text is invisible (~1.1:1): dark-ground `--ink` text on a non-repointed `--page` composer (components.css:9754-9755; markup views.js:2536). The placeholder shows (looks fine) until you type, then your own writing is unreadable — the core action of a writing app. [fix: composer class-name seam CLOSED (R4 S1) — the live `.notebook.lum-amber-deep .nb-composer`/`.nb-ce` light rules (0,3,0 / 0,4,0) beat the legacy cream `.notebook .nb-composer` (~9576), so writeline body renders dark ink on a light sheet (components.css ~11828 re-point block; seam-close rules ~11932). Universal-light ships as the sole skin; the dark-pole border residual is moot.]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.188 8cec854] [sev: HIGH] NB2 — Register `.seg`/crow `.chip` are dark-brown controls inside a bright cream card — collision + AA fail; composer chrome unreadable (components.css:9761-9764,9674-9680). [fix: the R4 seam-close block styles `.notebook.lum-amber-deep .seg`/`.seg-opt`/`.btn-primary` on the light sheet (components.css ~11828+) — the dark-brown-on-cream collision is gone and composer chrome is AA-legible on the Universal-light skin.]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.188 8cec854] [sev: HIGH] NB3 — paste/import, dictate, and Talk-to-Yumi are 11.5px run-in prose with no button chrome (components.css:11241-11246; views.js:1982-2011) — the "hidden buttons" friction. [fix: the run-in `.nb-capmodes` prose is replaced by a unified labeled `.nb-modes` chip row (helper `buildNotebookModeChip`) in the composer — inline photo/library vs ↗ hand-off paste/import/dictate; talk-to-Yumi dropped (views.js buildNotebookLeftLeaf ~2031; components.css `.nb-modes*`). The "hidden buttons" friction is gone.]
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] NB4 — The composer never states its destination (which book / Inbox / Journal) (views.js:1965-1977) — the "unclear book context" friction.
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.188 8cec854] [sev: HIGH] WL1 — Three capmode buttons all open `ImportCapture.open()`; "talk it through with Yumi" delivers a file panel (views.js:1989,1998,2008; import-capture.js:400) — a copy-is-a-contract break. [fix: the "talk it through with Yumi" mode is DROPPED entirely (R4 S2); the copy-is-a-contract break is removed. The remaining modes are honestly labeled — inline photo/library vs hand-off paste/import/dictate — each wired to what it says.]
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] NB5 — Gather→sub-theory Create is disabled with no visible reason when no arc exists (views.js:2137-2141,2171-2184) — the payoff dead-ends silently.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] WL2 — Per-note "ask Yumi" is a dead click with no feedback when the Yumi panel is closed (views.js:13496-13506, 2812-2823; yumi-brain.js:1715) — a deliberate action silently no-ops (runtime INFERRED).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] WL5 — Journal notes are shown as inviolably private yet keep a one-click "Send to sub-theory" (publishable) (views.js:13475-13480 vs :13549-13557; state.js:2268) — a covenant call → OQ2.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] CR2 — Notebook notes are equally uneditable (Delete only, no Edit); marginalia/question notes ARE Yumi-visible (views.js:13508-13611, Delete :13565) — same P-5 gap as VC3, generalized to notes.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] NB6 — The "What Yumi sees" consent panel is cyan italic 14px — least-legible on privacy-critical copy (components.css:11172,11230).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: open-question] OQ2 — Journal privacy vs "Send to sub-theory" (WL5): Should journal-register notes — presented as inviolably private, Gather-locked — be attachable as publishable sub-theory evidence at all? Withhold the affordance, or add an explicit "this makes it shareable" confirmation? A covenant call.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: ADD] Notebook ADD — note search / filter / sort as lightweight controls, NOT a filter-pill dashboard; inline read-more that expands in place rather than opening a modal.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: BUILD] Notebook BUILD (flagship) — the confirmed Yumi pedagogy layer: the five-move generative engine (draw out, notice, name, complicate, stay quiet), eval-gated, reading only your marginalia and questions. The security key-gate blocking this has landed, so it's cleared to build.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] Notebook FIX now — multi-book source handling.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: REWORK] Notebook REWORK — note body upright (form follows the layout work); the focus and scroll panels stay INLINE, not overlays — deliberately overrides the brief (which suggested modals) because the notebook's north star rejects modals.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Hygiene] Notebook Hygiene → sweep — tag color literals.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: BUILD/Held] Notebook — the Yumi asymmetry: build the Yumi pedagogy layer in the notebook NOW; in the sub-theory it stays intent-only with form held.
- [source: pass3-writing-loop.md 2026-07-07] [status: unverified] [sev: low (INFERRED, not filed)] Residual (INFERRED, not filed) — Gather name lost-work: the forming sub-theory NAME flows only through createWritingCanvas onSave (views.js:2116-2121); if a click on Create doesn't blur-then-save the canvas first, a typed name could be dropped. Name is optional (createSubTheory accepts an empty header), so impact is low; writing-canvas.js was not opened to confirm blur-before-click ordering.

## Mockup evaluation

**Round:** R4 Notebook (shape beat). **Felt pass:** FULL PASS — Preston, 2026-07-09. **Ships LIGHT ONLY** — the mockup's dark "Reading room" pole was comparison chrome for the felt pass; the live BUILD renders Universal v1.2 light only (dark-pole residuals, e.g. the composer-border repoint, are moot). **Mockup:** `docs/studio/mockups/notebook.html` (81,579 B; do-not-merge, self-contained; open by double-click). Built at HEAD `271cbe2`, against deployed `praxis-v3.187`. Stage-0 recon: `docs/studio/notebook-recon.md` (untracked).

**Current-surface structure (what the mockup evolves):** `#notebook` → `renderNotebook` (views.js:1754); `section.notebook.lum-amber-deep > .notebook-spread` (bound chrome: radius 18px + warm shadow) > `.nb-bookband` (book-tab only) + `.notebook-leaves` > `.leaf.leaf-left` (composer + capmodes + entries) + `.leaf.leaf-right` (State-5 working page). Fonts: Cormorant italic body 17px, DM-Mono eyebrows/labels, Cormorant names. Registers marginalia/question/journal (`--reg` spine + tag colors). Dark ground live (`umberGroundDark`, views.js:373); `.leaf{background:none}` kills the legacy dot-grid.

**Locked decisions → mockup implementation (evolve = additive, `<!-- EVOLVED -->`-tagged):**

| # | Decision | State in live | Mockup delta |
|---|---|---|---|
| 1 | Unified composer, labeled modes (paste/import/dictate/photo; drop talk-to-Yumi) | partial — capmodes were run-in prose (NB3/WL1); photo real chips | NEW `.nb-modes` labeled chip row; honest inline (photo/add-image) vs ↗ hand-off (paste/import/dictate); talk-to-Yumi DROPPED |
| 2 | Cormorant-italic body + 3-tier hierarchy | exists — italic 17px shipped (components.css:11023) | refinement only (contrast + DM-Mono eyebrow ≠ italic body ≠ italic name); NO DM-Sans/upright |
| 3a | Cover-forward book header, book tabs only | exists — 92×138 band (components.css:10978) | Universal-light restyle; dead 34×48 `.bc` stays retired |
| 3b | Per-note cover chip, Inbox+Journal, all 3 registers, suppressed on book tabs | partial — text-only "from {title}", marginalia only (views.js:13995) | NEW `.nb-entry-bookchip` (cover thumb); all 3 registers; suppressed on book tab |
| skin | Universal v1.2 light DEFAULT (dark = comparison alt); NO dot-grid either pole; bound chrome = radius + warm shadow only | live dark-glass | NEW `.skin-universal` light pole; composer seam CLOSED both poles (fixes NB1/NB2 `.nb-ce` vs `.nb-capfield` mismatch) |
| states | 8 states incl. NEW empty-state + depicted composing/paste-receipt/dictation | 6 built; composing CSS dead | all 8 switchable; composing recede DEPICTED (live CSS repair = app-code residual) |

**Scope guards held:** no generative Yumi (resting slot reads "never a verdict"); name eyebrow "yours to set"; no data-model/edit; WL5/OQ2 journal gating untouched; notebook-only; app code read-only (git: only the mockup added).

**Build-time stand-ins (name for live-wiring):** CSS-drawn cloth covers replace `buildSelfHealingCover` `<img>` (band + chips); `--chip-cloth` per-book tint depicts the multi-book Inbox (live: real cover art is the differentiator, not a color field).

**Verify evidence:** cscript parse OK (extracted inline script); 0 banned ES tokens; light-pole rule bodies token-only (313 `var()`, 0 rule-body hex; only the 3 documented `--chip-cloth` stand-ins carry inline hex); CSSOM confirmed BOTH poles (light body Cormorant-italic 17px `rgb(36,23,16)` on cream `rgb(244,239,228)`; dark composer fill → `rgba(255,255,255,.05)` glass = seam closed); band 92×138, chip 22×32; mobile 375 reflow clean.

**Residuals → the BUILD round:**
- NB1/NB2 live fix = repoint `.nb-ce`/`.nb-composer`/`.seg` (the `.nb-capfield` class mismatch); the mockup shows the target.
- Composing-state live CSS is dead (stale selectors; spread `display:block` not grid) — app-code repair.
- Light-field AA debt (`--lum-ink-4` 9px labels) carried from Shelf/Home.
- FORK 3b depicted on Inbox; the Journal-tab chip case is not separately shown (the rule extends by the same logic).

**Deferred bookkeeping (per Preston — the BUILD is a fresh session):** the frontmatter `state: shaped` + `mockup:` pointer, the `sequence.md` re-plan (R4 shape → build), and the `tools/studio-build` Builder regen are left for the BUILD session's open, so the surface markdown, `sequence.md`, and the Builder move together (no interim currency drift).

## Round history

### R4 CLOSED — felt pass PASSED IN FULL (2026-07-09, deployed v3.188, commit 8cec854)

Preston's felt pass passed in full on the live deploy: the Universal v1.2 light skin,
the unified labeled composer, the per-note cover chips, the closed composer seam, and
the deep-teal Yumi resting slot all read true. The round **ships LIGHT ONLY** — the
mockup's dark "reading room" pole was comparison chrome for the felt pass; the live
build renders Universal-light only. The route STAYS in `umberGroundDark`; a scoped
`.notebook.lum-amber-deep` light re-point paints a light surface over the dark body —
the R2 Shelf / R3 Home mechanism, nav-consistent (no map-flip).

Forks decided (at the shape beat, ratified by the live pass): **unified composer**
(labeled modes; talk-to-Yumi dropped) · **italic body KEPT** (Cormorant-italic 17px
stays the entry-body tier — a refinement, not a DM-Sans/upright swap) · **both book
contexts** (band book-tab + per-note cover chip on Inbox/Journal) · **Universal-light
only** (the dark pole retired). Round closed.

### R4 — Notebook: Universal v1.2 light skin + unified composer + per-note chips (v3.188, felt-passed)

The live Notebook ships the Universal v1.2 light-ground skin + the locked decisions,
built against the felt-passed light pole of `docs/studio/mockups/notebook.html`. One
commit (`8cec854`); `docs/checkpoints/r4-notebook.md` is the full record. Five stage
gates, all PASS:

- **S1 SKIN** — a scoped `.notebook.lum-amber-deep` Universal-light re-point + §8 depth
  recipes + literal rescues (components.css ~11828), appended after the R3 home block;
  route stays in `umberGroundDark` (map byte-identical). The composer **class-name seam
  is CLOSED** (NB1/NB2): live emits `.nb-ce`/`.nb-composer` but the dark block styled the
  never-emitted `.nb-capfield`, so the composer fell to legacy cream — the new light
  rules (0,3,0 / 0,4,0) beat it (~11932). The **dead composing CSS** (stale
  `.notebook-header`/`.notebook-tabs` + a grid-collapse on a `display:block` spread) is
  repointed to the live classes (~4381–4396).
- **S2 COMPOSER** — the run-in `.nb-capmodes` prose becomes a unified labeled `.nb-modes`
  chip row (`buildNotebookModeChip`): honest inline (photo/library) vs ↗ hand-off
  (paste/import/dictate); **talk-to-Yumi DROPPED** (NB3 + WL1). Handlers byte-identical;
  `import-capture.js` untouched.
- **S3 BAND + PER-NOTE CHIPS** — the band cover routes through `buildSelfHealingCover`
  (ONE cover path — the "never a second cover path" precedent; band second-cover-path
  resolved); `renderNotebookEntry(entry, gatherable, showBookChip)` (views.js:14012) adds
  a per-note `.nb-entry-bookchip` (22×32 self-healing thumb) on Inbox + Journal, all 3
  registers, suppressed on `<book>` tabs — the per-note book context, shipped;
  presentation-only (reads bookIds, writes nothing).
- **S4 HIERARCHY + EMPTY + YUMI RESTING** — a rich `buildNotebookInboxEmpty`
  (mark + title + 3 steps) on empty Inbox (empty states, shipped); Journal/book keep quiet
  one-line empties; the Yumi resting slot recolored to a coherent deep-teal; copy verbatim
  ("yours to set", "never a verdict").
- **S5 SHIP GATE** — fix-red-team: no block-commit finding (4 doc/proof-hygiene items
  addressed); whole-file parse OK; 0 banned ES tokens; byte deltas views.js +4,648 LF /
  components.css +17,039 LF; SW `v3.187→v3.188`; live smoke sweep (bleed proof: the
  re-point is strictly scoped to `.notebook.lum-amber-deep`, ZERO leak to Home / Shelf /
  Arcs; console clean). Shipped on Preston's deployed felt pass.

Resolved this round: **NB1 / NB2** (composer seam) · **NB3** (capmodes scatter → labeled
chips) · **WL1** (talk-capmode copy-contract break) · the **dead composing CSS** · the
**band second-cover-path** · **per-note book context** (decision 3b) · **empty states**.

**Residuals carried** (verbatim from the ship gate — recorded, not actioned here):

- **R1** — vis-indicator held at live: the "Visible to Yumi" badge stays hidden (only
  "Private" shows); a one-line flip if wanted — not a locked decision, so live won.
- **R3** — shared in-session `coverBrokenIds` registry (non-persisted): band + per-note
  chip covers both route through `buildSelfHealingCover`, so a coverless/broken cover joins
  the in-session runtime registry Shelf cleanup counts — intended unification, no
  data-model touch.
- **R4** — global `.empty-state` = carried craft-pass debt: the signed-out `.empty-state p`
  rescue is notebook-scoped only; the global rule stays the R3 craft-pass debt.
- **R5** — Yumi voice deep-teal `#1f5a6b` on light (felt-passed).

Still open / carried to the program: **NB4** (composer destination), **NB5**, **NB6**,
**WL2**, **WL5** (→ **OQ2**), **CR2**, and the Notebook ADD / BUILD (flagship generative
Yumi) / FIX / REWORK / Hygiene / Held ledger items — none in this round's scope.

Reviews: fix-red-team CLEARED (no block-commit). Scope: `js/views.js` +
`assets/components.css` + `sw.js` v3.187→v3.188 ONLY; foundations byte-locked; parse OK.

## Next
