---
surface: book-detail
route: "#book/<id>"
render_fn: renderBookDetail (views.js:8124)
ground: dark
in_nav: no
state: untouched
rounds: 0
---

## State

`#book/<id>` → `renderBookDetail` (views.js:8124); dark ground; sub of books. Book detail.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] BD1 — Book-detail actions split across two zones with no single ranked primary move (views.js:8120-8194) — hierarchy broken; nothing reads as THE move.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] BD2 — Canon 4-I mobile reorder unimplemented (only stacks columns, no `order`) (components.css:10798-10805) — mobile spec unmet.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] BD3 — Desktop two-column intent (4-I) not held; actions render full-width below the hero (views.js:8164-8272) — layout divergence from canon.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Hygiene] Book detail Hygiene → sweep — a duplicate rule.

## Round history

## Next
