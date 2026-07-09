---
surface: notebook
route: "#notebook"
render_fn: renderNotebook (views.js:1754)
ground: dark
in_nav: yes
state: untouched
rounds: 0
---

## State

`#notebook` (+ empty/unknown catch-all) → `renderNotebook` (views.js:1754); dark ground; in top-nav (notebook). Notebook spread.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: CRITICAL] NB1 — Notebook primary writeline text is invisible (~1.1:1): dark-ground `--ink` text on a non-repointed `--page` composer (components.css:9754-9755; markup views.js:2536). The placeholder shows (looks fine) until you type, then your own writing is unreadable — the core action of a writing app.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] NB2 — Register `.seg`/crow `.chip` are dark-brown controls inside a bright cream card — collision + AA fail; composer chrome unreadable (components.css:9761-9764,9674-9680).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] NB3 — paste/import, dictate, and Talk-to-Yumi are 11.5px run-in prose with no button chrome (components.css:11241-11246; views.js:1982-2011) — the "hidden buttons" friction.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] NB4 — The composer never states its destination (which book / Inbox / Journal) (views.js:1965-1977) — the "unclear book context" friction.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] WL1 — Three capmode buttons all open `ImportCapture.open()`; "talk it through with Yumi" delivers a file panel (views.js:1989,1998,2008; import-capture.js:400) — a copy-is-a-contract break.
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

## Next
