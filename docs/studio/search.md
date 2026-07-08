---
surface: search
route: "#search"
render_fn: renderSearch (views.js:1026)
ground: dark
in_nav: no
state: untouched
rounds: 0
---

## State

`#search` → `renderSearch` (views.js:1026); dark ground; reached from the nav pill / ⌘K. Global search.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] IA1 — Global Search is unreachable on mobile: its only entries are the desktop-only nav pill (display:none <760px) and ⌘K; the hamburger has no Search (components.css:5400; index.html:26-38; spotlight.js:432-444) — a whole render surface orphaned on the launch device.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] IA5 — Partial search index — omits artifacts + marginalia; a note hit routes to the whole Notebook (no deep-link) (views.js:742-875, note route :870) — findability gap.

## Round history

## Next
