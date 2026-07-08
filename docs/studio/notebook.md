---
surface: notebook
route: "#notebook"
render_fn: renderNotebook (views.js:1737)
ground: dark
in_nav: yes
state: untouched
rounds: 0
---

## State

`#notebook` (+ empty/unknown catch-all) → `renderNotebook` (views.js:1737); dark ground; in top-nav (notebook). Notebook spread.

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

## Round history

## Next
