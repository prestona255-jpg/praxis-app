---
surface: book-detail
route: "#book/<id>"
render_fn: renderBookDetail (views.js:8781)
ground: light
in_nav: no
state: closed
rounds: 1
---

## State

`#book/<id>` → `renderBookDetail` (views.js:8781); **light** working ground (§7 ground
spectrum — you work in the light, superseding the pre-§7 "dark" note); ONE page, lineage-leads.
The `#book/<id>/marks` route is retired — it redirects to `#book/<id>` (router views.js:504;
`renderBookView` views.js:8420 is a thin redirect). Sub of books. mobile pass = MW-3 (R7 shipped
the BD2 4-I `order` reorder; the full mobile-canon P1–P9 pass is MW-3's job — no `mobile:` chip
claimed).

## Decisions

R7 SHIPPED v3.191 (`bff5d82`; Preston deployed felt pass = PASS 2026-07-10). Spec = mockup
`docs/studio/mockups/book-detail.html` (`25c7987`).

- **F1 — light ground.** `#book/<id>` works in the light (Universal v1.2), not the pre-§7 dark
  amber. Scoped `.bk-surface` re-ground (Shelf-R2 / Home-R3 precedent), no bleed to other surfaces.
- **F2 — marks folded in, route redirects.** The marks/lineage material (marginalia cards + grew
  rows) folds INTO detail; `#book/<id>/marks` redirects via `location.replace` (router views.js:504
  + `renderBookView` views.js:8420) — no back-button trap. The "Open your marks & lineage" door is gone.
- **F3 — lineage leads.** Below the hero the spine is the book's life in your thinking (marginalia
  + grew-into first; preview 3 + "Show all N"); About / The book / Your reading recede to the aside.
- **F4 — arc chips at the hero.** One chip per arc holding the book (`arcsHoldingBook` views.js:8347),
  field-spectrum hue by arc id-hash (`buildBookArcChips` views.js:8392 → `--bk-field-1..10`).
- **F5 — movedMe persisted field.** "This moved me" is a real per-book field (`ensureBookFields`
  state.js:419), persisted on click (markBooksDirty + saveState), and to the cloud.
- **F6 — category picker + categoryOverride landed.** The edit panel's category select
  (views.js:8720) writes `book.categoryOverride` (state.js:418), which wins first in
  `classifyBookLocal` and survives Re-classify.
- **LENS — "+ Add to a lens" drop ACCEPTED as a decision.** The manual book→lens panel is dropped
  per the felt-passed mockup; `buildBookLensPanel` / `_bdLensOpen` are intentionally inert (one-move
  restore). Shelf's empty-lenses copy corrected to point at the live `openLensPanel`. NOT a debt row.

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: closed] [fix: views.js:8904 — the ONE ranked action row, PRIMARY = ✎ Add marginalia (SUB-CALL accepted), then Add-to-arc / Send-to-sub-theory] [sev: HIGH] BD1 — Book-detail actions split across two zones with no single ranked primary move — CLOSED.
- [source: fable-audit-combined.md 2026-07-07] [status: closed] [fix: components.css:10863 — `.bk-surface .bk-main{order:1}` / `.bk-aside{order:2}` + primary `order:-1` (components.css:10861); canon 4-I via `order`, not just column stacking] [sev: HIGH] BD2 — Canon 4-I mobile reorder — CLOSED (order-based). Full mobile-canon P1–P9 pass = MW-3.
- [source: fable-audit-combined.md 2026-07-07] [status: closed] [fix: components.css:10580 — `.bk-cols` two-column base held at desktop; mobile collapses via `order` only] [sev: MEDIUM] BD3 — Desktop two-column intent (4-I) not held — CLOSED.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: closed] [fix: views.js:8454 `buildGlanceItem` removed + components.css:10653 marks-page header rules removed (praxis-reviewer finding C sweep)] [sev: Hygiene] Book detail Hygiene → sweep — CLOSED.

## Residuals (named, non-blocking — carried)

- **R7-BYTES** — S2 diffstat +173 vs the ~+80–160 recon band (+13 over); explained (full lineage fold + 3 new helpers), not scope creep.
- **R7-F6AUTO** — F6's category select adds an "Auto (Praxis decides)" option + moves Uncategorized to the end (mechanical necessity to un-pin an override); the mockup showed neither. Open fidelity divergence.
- **R7-INK4** — the scoped `--lum-ink-4:#7c7052` deviates from the canonical `#978b6d` (kept — better AA on light); undocumented divergence.
- **R7-LENS** — `buildBookLensPanel` + `_bdLensOpen` retained inert (the accepted LENS decision; one-move restore if Preston reverses).

## Round history

- **R7 — DEEP — CLOSED 2026-07-10** (SHIPPED v3.191, `bff5d82`; Preston deployed felt pass = PASS).
  8 commits `25c7987` (mockup) → `bff5d82` (S6 cache): S1 fields+migration `ec474b4` · S2 the page
  `f2e5e0a` · S3 marks retire `be2f61f` · S4 category+moved-me `9874831` · S5 light re-ground + BD2
  `05e653a` · fixes (reviewer HOLD cleared) `d5041ee` · S6 cache `bff5d82`. Both gate reviewers cleared
  (praxis-reviewer PASS, fix-red-team NO-BLOCK); Live Forensic Smoke Test PASS. Records:
  `docs/checkpoints/r7-book-detail-recon.md`, `docs/studio/mockups/book-detail.html`.

## Next

- **MW-3 — Book Detail mobile pass** — the full mobile-canon P1–P9 sweep (part of the mobile wave).
  R7 shipped the BD2 4-I `order` reorder; the comprehensive mobile pass lands with MW-3.
