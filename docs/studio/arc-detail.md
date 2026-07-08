---
surface: arc-detail
route: "#arc/<id>"
render_fn: renderArcDetail (views.js:12060)
ground: dark
in_nav: no
state: untouched
rounds: 0
---

## State

`#arc/<id>` → `renderArcDetail` (views.js:12060); dark ground; sub of arcs. Arc detail / constellation.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] OG3 — The one shareable payoff dead-ends: a signed-out visitor exploring the seed arc reaches an impressive interior (and the Arcs examples) with no "sign in to build your own" CTA (views.js:12040-12065, 3546-3641) — the best conversion moment asks nothing.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] F-MA1 — A signed-out viewer can drag/connect (mutate) the "read-only" seed arc locally (views.js:12460; arc-constellation.js:1292; state.js:1991,2129) — read-only contract violation (non-persisting).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] AF6 — Duplicate "+ Sub-theory" affordances (header + control-bar + Page-face) (views.js:12148,12277,12648).
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Program-decision] Part I.4 (Tier 0) — Dead constellation code (~1,200 lines) is split, not bulk-deleted: CUT NOW the genuinely dead (orphaned halo/grain definitions, dead focus-ring CSS, three superseded mark helpers); PARK for Phase 3 (~750–1,160 lines) the book-era substrate and book-constellation renderer for the Layers redesign to decide. The core renderer is a protected, byte-frozen invariant from the Umber port — not touched speculatively. Every deletion grep-verified for membership.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: ADD] Arc interior ADD — a List view with sub-theory rows.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] Arc interior FIX now — the arc-voice request rejection path.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: REWORK] Arc interior REWORK — exit-returns-to-origin (verified against the shipped route-fix).
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Held-Phase-3] Arc interior Held for Phase 3 — ALL field-feature enhancements: the spine chip, tooltips and keyboard focus, labeled books, tap-preview, the mobile touch model. The field is the redesign's centerpiece and invariant-protected, so building features on it now risks throwing them away. Safeguard: a mobile-usable arc field is a non-negotiable Phase 3 requirement (revisit a mobile stopgap if Phase 3 slips). The hold covers FEATURES only, never contrast or a11y bugs.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Cut-now+park] Arc field / constellation — Cut now + park per the Tier 0 split.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] Arc field / constellation FIX now (dual-ground a11y root-fix, CSS and tokens only, verified NOT to touch the protected renderer) — the constellation's dual-ground text response; a focus ring on marks; the thread color promoted to a token.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Fix-or-fold] Arc field / constellation Fix or fold — center-label wrap.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Held-Phase-3] Arc field / constellation Held for Phase 3 — the Layers rebuild.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Held-Phase-3] Part V Held for Phase 3 — the arc-interior 'living field' redesign: the held field features, the Layers system, and the non-negotiable mobile-usable mandate.
- [source: fable-audit-charter.md §4 2026-07-06] [status: unverified] [sev: P1/P2-friction] §3c — "Tidy" and other buttons whose function isn't self-evident.

## Round history

## Next
