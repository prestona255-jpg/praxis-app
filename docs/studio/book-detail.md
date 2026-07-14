---
surface: book-detail
route: "#book/<id>"
render_fn: renderBookDetail (views.js:8929)
ground: light
in_nav: no
state: closed
rounds: 1
mobile: native
desktop: composed
---

## State

`#book/<id>` → `renderBookDetail` (views.js:8781); **light** working ground (§7 ground
spectrum — you work in the light, superseding the pre-§7 "dark" note); ONE page, lineage-leads.
The `#book/<id>/marks` route is retired — it redirects to `#book/<id>` (router views.js:504;
`renderBookView` views.js:8568 is a thin redirect). Sub of books. **mobile pass = MW-3 DONE**
(v3.194, 2026-07-11, `mobile: native`) — R7 shipped the BD2 4-I `order` reorder; MW-3 completed the
full mobile-canon P1–P9 sweep.

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
- **MW3-BKBOX (desktop, from MW-3)** — the base `.bk-surface` rule (components.css:10505) lacks
  `box-sizing:border-box` (the ONE surface that omits it; no global reset), so book detail also
  h-scrolls ~40px at **desktop** (scrollWidth 1297 vs 1265). MW-3 fixed **mobile** (≤759 border-box);
  the desktop fix edits the base rule (a desktop layout change) and wants its own felt-gated pass.
  Pre-existing since R7, not introduced by MW-3.

## Round history

- **R8 — value-mark register (the values thread) — SHIPPED v3.195 (`37ea1f0`), 2026-07-11.** `renderBookDetail`
  gained the quiet **value-mark register** (`buildValueMarkRegister('book', …)`, `.vr-*`) after the hero,
  BESIDE the shipped `movedMe` (untouched): "Values this carries" — mark from the reader's declared
  `profile.values` (Model A), each mark `{value, why}` with an optional lineage line + inline editor. Persists
  on `state.books[id].valueMarks` via `markBooksDirty`+`saveState` (rides the userBooks doc; NO new
  collection). Self-contained `--vr-*` palette (opaque light card + dark ink) → deterministic AA (praxis-
  reviewer HOLD fixed). Live smoke: Liberation + lineage survived the Firestore sign-out/in round-trip.

- **R7 — DEEP — CLOSED 2026-07-10** (SHIPPED v3.191, `bff5d82`; Preston deployed felt pass = PASS).
  8 commits `25c7987` (mockup) → `bff5d82` (S6 cache): S1 fields+migration `ec474b4` · S2 the page
  `f2e5e0a` · S3 marks retire `be2f61f` · S4 category+moved-me `9874831` · S5 light re-ground + BD2
  `05e653a` · fixes (reviewer HOLD cleared) `d5041ee` · S6 cache `bff5d82`. Both gate reviewers cleared
  (praxis-reviewer PASS, fix-red-team NO-BLOCK); Live Forensic Smoke Test PASS. Records:
  `docs/checkpoints/r7-book-detail-recon.md`, `docs/studio/mockups/book-detail.html`.

## Round history (mobile)

- **MW-3 — Book Detail mobile pass — SHIPPED-LOCAL v3.194 (2026-07-11), `mobile: native`.** Commit
  `5dd7cee` — CSS-only, one @media(max-width:759px) block. **P8 (substantive, 410→390):** (a)
  `box-sizing:border-box` on `.bk-surface` at ≤759 (the base rule was content-box — the only surface
  missing it; siblings all set border-box, no global reset) fixes the `width:100%`+28px-padding
  overflow; (b) the read-status control's 3 nowrap segments (~372px) wrap to 3 equal shrinkable
  segments (the app's own `.rrow-right` idiom). **P7:** edit-panel category select + text inputs
  13→16px. **P3:** backlink/find/moved/arcchip/edit-toggle/edit-btn/edit-remove/secondary-action/edit
  fields → 44px; the 5 rating stars `.bk-star` → a genuine 44×44 hit box (glyph stays 15px). BD2's
  primary `order:-1` (P2) untouched. Live-390 rig; praxis-reviewer HOLD on `.bk-star` → fixed 44×44 →
  re-confirmed PASS. Desktop residual MW3-BKBOX carried. Record: `docs/studio/reports/mw3-2026-07-11.md`.

## Round record — DW-3 (2026-07-14)

commits: 03ecb9d..424545c (4, the Book-detail slice + 3 fix-slices; DW-3 batch 939eb73..cache-bump)
gates: PASS — D1 occ 44.1%→63% @1920 (94.9/84.2% @1280/1440), a two-region content|rail grid at ≥1200 (canon §4-I intent): the book (hero + `.bk-cols`, held at its natural ~816 reading width) in col 1, a meta/actions rail (value-card + actions-stacked + edit/find, 340px) in col 2; rail items clustered beside the tall content via `grid-auto-rows:min-content` (verified — no spread, `vrOverflow:0`). D2 widest `.bk-main` prose 70.9ch (≤72; `.bk-main` width unchanged so no cap needed). **D3 hScroll 0 at 1280/1440/1920 — ON-7 RESOLVED at ≥1200 (Preston's DW-3 ruling, `424545c`): `.bk-surface{box-sizing:border-box}` scoped to the book-detail ≥1200 block, so width:100%+padding no longer overflows (surface 1945→1905); the 760-1199 band keeps the residual (1024 hScroll STILL 40, box-sizing content-box, matchMedia false); 0 @390.** D4 22/22 cursor:pointer. D5 body 16px unchanged. D6 focus-visible rings (backlink/actionbtn/rs-opt/moved/vr-add/arcchip/edit/find). ≤1199 provably inert — matchMedia(min-width:1200)=false, `.bk-shell` computed block/840 @1024 + block/none @390, node-count (117) match baseline. Signed-out both surfaces render no-crash/no-overlap @1920 (book-detail signinrow→col1, `bk-find` alone in the rail; console clean).
defects-found: 2, both self-caught (live smoke + fix-red-team R1) and fixed before ship — (1) `8ce5a16` the primary-CTA on-demand pickers (marginalia editor / arc / send-to-sub) auto-placed to the PAGE BOTTOM (y2031) when opened at ≥1200, far from their trigger — the idle-only live table missed it; (2) `70a26ab` the Edit/more panel (a 4th on-demand child) had the same gap + could co-exist with an open picker. Fix: each on-demand panel gets its OWN full-width collapsible row (r3–r6), `.bk-cols`→r7; opened panels appear as a band below the hero, stack without overlap.
lessons: An idle-only occupancy table is NOT sufficient for a surface with on-demand mount hosts — you MUST open each panel (primary CTAs first) and re-measure at every composed width; a grid's `> *{grid-column:1}` default drops an opened panel to the page bottom (auto-row after a tall spanning column). Give EACH on-demand panel an explicit collapsible full-width row so it appears prominently AND can never overlap a sibling. A block-stack whose content wants a reading width but must fill ≥1145 (D1@1920) composes as content|rail, NOT a widen (a widen leaves the meta bands sparse); `grid-auto-rows:min-content` keeps a multi-item rail clustered beside a tall spanning content column.
evidence: docs/checkpoints/dw-3.md (Stage 2 + fix-slices) · dw-3-recon.md · praxis-reviewer + fix-red-team verdicts. Chip stretched → composed (all six D-gates now pass on live evidence — D3 included, ON-7 resolved ≥1200 per Preston's ruling; the 760-1199 ON-7 residual is re-scoped to its own overnight item; native awaits the deployed felt pass).

## Next

- **Mobile pass DONE (MW-3), `mobile: native`.** Nothing outstanding on the mobile axis. The only
  carried item is the desktop residual **MW3-BKBOX** (own felt-gated pass, out of the mobile wave).
