---
surface: books
route: "#books"
render_fn: renderShelf (views.js:3730)
ground: dark
in_nav: yes
state: untouched
rounds: 0
---

## State

`#books` → `renderShelf` (views.js:3730); dark ground; in top-nav (books). Shelf (Covers / List).

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] SH1 — The shelf toolbar has 6 near-equal controls (declutter overshot canon 4-E) (views.js:3858-3923) — toolbar clutter.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] SH2 — Shelf toolbar `.btn` uses `backdrop-filter:blur(10px)` — confirm vs the no-blur-on-chrome canon (components.css:11302).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] SH3 — Shelf cover-grid status label is 9.5px mono (below the small-type floor) (components.css:11352).
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Decided] Shelf / categories — Taxonomy authority DECIDED: a fixed curated taxonomy (17 categories plus Uncategorized) with a per-book manual override. Curated coherence beats Goodreads tag-sprawl; the override handles misfiles without opening the door to chaos.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] Shelf / categories FIX now — capture raw categories on the manual and by-title add paths and in the fetch paths; scope the re-classify and lazy passes to the shelf index, not all books; a duplicate-add guard; batch progress on the long first-run classify; re-classify must PRESERVE a manual override.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: ADD] Shelf / categories ADD — the manual override plus a book-detail category picker; the lineage shelf extension (value→category/lens mapping, same consent and one-noticing).
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Hygiene] Shelf / categories Hygiene → sweep — dead shelf-button rules and a stray segment option.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Gate] Shelf / categories Gate — the deeper accuracy pass (backfilling raw categories across the legacy library plus a tighter classification rubric) is folded into 2.0 but shaped by Preston's pending eyeball of the live library's real accuracy (a to-do on his side, not a blocker).

## Round history

## Next
