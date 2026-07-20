---
surface: book-detail
route: "#book/<id>"
render_fn: renderBookDetail (views.js:8929)
ground: light
in_nav: no
state: closed
rounds: 1
mobile: native
desktop: native
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
gates: PASS — D1 occ 44.1%→63% @1920 (94.9/84.2% @1280/1440), a two-region content|rail grid at ≥1200 (canon §4-I intent): the book (hero + `.bk-cols`, held at its natural ~816 reading width) in col 1, a meta/actions rail (value-card + actions-stacked + edit/find, 340px) in col 2; rail items clustered beside the tall content via `grid-auto-rows:min-content` (~~verified — no spread, `vrOverflow:0`~~ — **CORRECTED 2026-07-15 by DW-POLISH, Preston ratified: this claim was FALSE for the rail as a whole.** Live measurement found a **195px HOLE** between `.vr-card` and `.bk-actions` at 1280/1440/1920 — `rig.hollow`: "maxGap 195px vs median 14px". `vrOverflow:0` measured **overflow**, not the **gap**: a horizontal instrument, blind to a vertical void — the same failure class as DW-4's 270px hole. `min-content` DID cluster rows 7-9, but could never govern row 2, where `.vr-card` shared a track with the 266px `.bk-hero` under `align-items:start`. Worst in the DEFAULT case: `valueMarks` starts empty on every book → 93px card → 195px hole; 2 marks → 191px card → 96px hole). D2 widest `.bk-main` prose 70.9ch (≤72; `.bk-main` width unchanged so no cap needed). **D3 hScroll 0 at 1280/1440/1920 — ON-7 RESOLVED at ≥1200 (Preston's DW-3 ruling, `424545c`): `.bk-surface{box-sizing:border-box}` scoped to the book-detail ≥1200 block, so width:100%+padding no longer overflows (surface 1945→1905); the 760-1199 band keeps the residual (1024 hScroll STILL 40, box-sizing content-box, matchMedia false); 0 @390.** D4 22/22 cursor:pointer. D5 body 16px unchanged. D6 focus-visible rings (backlink/actionbtn/rs-opt/moved/vr-add/arcchip/edit/find). ≤1199 provably inert — matchMedia(min-width:1200)=false, `.bk-shell` computed block/840 @1024 + block/none @390, node-count (117) match baseline. Signed-out both surfaces render no-crash/no-overlap @1920 (book-detail signinrow→col1, `bk-find` alone in the rail; console clean).
defects-found: 2, both self-caught (live smoke + fix-red-team R1) and fixed before ship — (1) `8ce5a16` the primary-CTA on-demand pickers (marginalia editor / arc / send-to-sub) auto-placed to the PAGE BOTTOM (y2031) when opened at ≥1200, far from their trigger — the idle-only live table missed it; (2) `70a26ab` the Edit/more panel (a 4th on-demand child) had the same gap + could co-exist with an open picker. Fix: each on-demand panel gets its OWN full-width collapsible row (r3–r6), `.bk-cols`→r7; opened panels appear as a band below the hero, stack without overlap.
lessons: An idle-only occupancy table is NOT sufficient for a surface with on-demand mount hosts — you MUST open each panel (primary CTAs first) and re-measure at every composed width; a grid's `> *{grid-column:1}` default drops an opened panel to the page bottom (auto-row after a tall spanning column). Give EACH on-demand panel an explicit collapsible full-width row so it appears prominently AND can never overlap a sibling. A block-stack whose content wants a reading width but must fill ≥1145 (D1@1920) composes as content|rail, NOT a widen (a widen leaves the meta bands sparse); `grid-auto-rows:min-content` keeps a multi-item rail clustered beside a tall spanning content column.
evidence: docs/checkpoints/dw-3.md (Stage 2 + fix-slices) · dw-3-recon.md · praxis-reviewer + fix-red-team verdicts. Chip stretched → composed (all six D-gates now pass on live evidence — D3 included, ON-7 resolved ≥1200 per Preston's ruling; the 760-1199 ON-7 residual is re-scoped to its own overnight item; native awaits the deployed felt pass).

## Round record — DW-POLISH (2026-07-15)

commits: <first>..<last> (n)
gates: PASS — the polish tier's premise proved: DW-3 passed EVERY D-gate and the page still read as three stacks, because every D-gate is horizontal and the defects were vertical + structural. **`rig.hollow` rail 195/14/14 (suspect:true) → 16/16/16 (suspect:false)** at 1280/1440/1920, on DEFAULT data (empty `valueMarks` — the baseline's worst case; 2 marks → 96px hole). **"In your thinking" 542px/28.5% → 816px/42.8% @1920** (64.5% @1280, 57.3% @1440). Edges now relate: hero.left==main.left==backlink.left, rail.right==backlink.right, hero.right==main.right — the "one composition" claim measured, not asserted. D1 63.0/84.2/94.9% (UNCHANGED at 1920 — D1 was never the failing gate; the 1200 shell cap is untouched. This pass bought the hole and the hierarchy, not occupancy). D2 72.0ch all widths. D3 h-scroll **0/0/0**. D4 18/18 (23/23 rich). D5 16px. D6 all 8 probed controls `fv:true`, tokens ring 2px rgba(255,206,74,.5) offset 2px, radii undeformed (star 0px, pills 999px) — via the real Tab-armed `rig.ringProbe`, not a CSSOM match test. **All 4 on-demand panels opened and re-measured** (DW-3's lesson): zero rail collisions, zero panel-panel collisions, all stack as a band between hero and main. **Signed-out**: signin-row in the rail, all owner-gated pieces correctly absent, 3 seed marginalia surface, no overlap, hollow uniform. **Not-found**: clean early return. ≤1199 re-gated (DOM changed, so fingerprints legitimately differ): like-for-like **-9 nodes** at both 390 and 1024, **content-complete** (every baseline element still present, rating included), no h-scroll, no truncation, order preserved; **ON-7's 760-1199 residual measured intact and untouched** (hscroll exactly 40, content-box, mq1200 false).
defects-found: 7 — **(0) BLOCKING, caught by fix-red-team and NOT by me: the Edit/more panel was orphaned at ≤1199.** The toggle moved into the rail while the panel stayed appended after `.bk-main`; ≥1200's `grid-row:6` hid it, but below 1200 `.bk-shell` is display:block so DOM order IS visual order — tapping Edit/more flipped the label to "Close edit" and put the panel ~1500-2500px below, under the whole thinking block: a shipped control, dead at every width <1200, no scrollIntoView. Missed because `_bookDetailEditOpen` defaults false, so my ≤1199 re-gate rendered with the panel ABSENT while my delta list claimed to enumerate every change. Fixed `insertBefore(panel, editorHost)` → 14px from its toggle at 390, ≥1200 unchanged. (0b) **my "the hole cannot exist by construction, at any data shape" was an OVER-CLAIM** — also the red-team's; then reproduced: DWP-RAIL-INVERT, a 220px hero→main void at 10 value-marks + empty main, which `rig.hollow` cannot even flag (one gap ⇒ max==median). (0c) `.bk-margmeta` carried its stacked-layout divider (margin-top:13px + border-top) into the side-by-side grid — reset. (0d) `.bk-about` was an inert hook (class emitted, zero CSS) — removed. Then the three I self-caught: (1) **D3 REGRESSION at 1280**: the rail's `width:100%` made `.vr-card` 382px (this surface has NO global border-box reset — the MW3-BKBOX quirk), an 8.7px h-scroll INVISIBLE at 1920 and INVISIBLE in the mockup (mockups carry `*{box-sizing:border-box}`) — fixed by deleting `width:100%` and letting flex `align-items:stretch` size them. (2) **D2 FAIL on the signed-out path**: `.lum-yumi p` at 85.1ch, uncapped, pre-existing and unseeable signed-in (`rootedSubTheories` is owner-filtered, so the stub renders no whisper) — capped ≤72ch, scoped to `.bk-surface` since `.lum-yumi` is shared chrome. (3) **my own proposal was wrong**: `grid-row:2 / -1` renders the rail in ROW 1 (above the hero) — `-1` names the last line of the EXPLICIT grid and there is none; the prototype had the same bug and its uniform gaps hid it (a flex column gives uniform gaps in any row). Fixed to `2 / 8`.
lessons: composed ≠ designed — widen-within ceilings on content-rich detail pages; the polish tier exists for them.
lessons: A DOM move splits a control from its panel: ≥1200 grid placement hid an orphaned Edit panel that was DEAD at every width below 1200. Open every on-demand panel AT MOBILE too.
lessons: "cannot exist by construction, at any data shape" is a claim one fixture can never earn — the rail fix INVERTED the void mode rather than killing it (DWP-RAIL-INVERT).
lessons: rig.hollow cannot flag a SINGLE gap (max==median ⇒ suspect:false). It sees rhythm breaks between ≥3 items, not one void between two.
lessons: The decorative ✎ read as an EDIT CONTROL to the app's own author — a false affordance fails a felt pass even though it was never a regression (never wired, one commit, Wave 4). Affordance is a promise; a pen beside a note promises editing however it is styled.
lessons: Every D-gate is horizontal; `rig.hollow` is the only instrument that sees a void. A surface can pass all six and be undesigned.
lessons: A mockup's `*{box-sizing:border-box}` HIDES bugs the real app shows — this surface has no global reset. Never trust a mockup as a layout proof.
lessons: Measure the SIGNED-OUT path for D2, not just crash/overlap: owner-filtered data means signed-in can render strictly LESS prose than signed-out.
lessons: A defect's size can be a function of DATA — the hole was 195px on default (empty valueMarks) and 96px when populated. Measure the default, not your fixture.
evidence: docs/checkpoints/dwp-book-detail-recon.md (Stage 0 + baseline + proposal) · docs/checkpoints/dwp-book-detail.md (build + gates) · docs/studio/mockups/dwp-book-detail.html (the felt-passed composition contract).

## Next

- **MARG-EDIT — ✅ CLOSED, R-POLISH B3 (v3.234).** Built exactly to the narrowed scope this row
  itself derived: `openMarginaliaEditor(bookId, editEntryId)` seeds `entryId` + `initialValue`
  (the closure var that "reset to `null` on every open" is now seedable), and `buildMargCard`
  gains the wired `.bk-margedit` pencil — **the glyph returns to the seat DWF-1 kept for it**,
  wired this time. Owner-gated twice (render gate + a seed re-check in the editor, so no caller
  reaches another user's entry by passing an id). The update goes through
  **`updateNotebookEntryBody` (state.js:2455) — the SAME accessor ROOM-2's `#note/<id>` door
  uses**, so the two doors onto a note body converge on one write path rather than double-owning
  it (the charter's warning, applied to the write and not just the affordance); this also
  inherits ROOM-2's N3 no-touch-write guard. Two silent-failure guards were fixed with it
  (`!user`, and the vanished-entry case): `flushSave` cues "Saving…" *before* `onSave`, so a bare
  return stranded the cue while discarding the edit — both now resolve to "Couldn't save".
  Live evidence: 4 cards / exactly 1 pencil (0 when signed out) · opens pre-filled · 17→17
  entries on save · only `body`+`updatedAt` change · no-edit blur does **not** bump `updatedAt` ·
  44×44 at 390. Record: `docs/checkpoints/r-polish-b3.md`.
  *Historical scoping below retained — it is what made the build cheap.*
- **~~MARG-EDIT — re-open existing marginalia for editing, from Book Detail. Bucket: ROUND GAP —
  Book Detail~~** (~~PROGRAM~~ — **re-tiered 2026-07-15 at the DW wave close, Preston's ruling**).
  The downgrade is a direct consequence of the correction below: PROGRAM was ruled on the false
  "APP-WIDE gap" framing, and once delete and same-session update were shown to already exist via
  Notebook, the true scope — prefill re-entry into `openMarginaliaEditor` + a wired card affordance
  — is round-sized, not a dedicated supervised session. **The flag line I wrote stands as the
  honest record**: I raised the tier question rather than downgrade silently, and this is the answer.
  Named DWF-1, 2026-07-15, on Preston's ruling.
  ⚠ **This row was FIRST WRITTEN FALSE and corrected by `fix-red-team` before commit.** The
  original claimed "no edit-existing path anywhere in the repo… a reader can never correct or
  remove it" — that was asserted from a narrow grep (`editMarginalia|editEntry|…`), not proven.
  Two of its four scope items **already exist**:
  - **DELETE EXISTS** — `renderNotebookEntry` (views.js:14097, marginalia-aware via `isMarg`:14103)
    appends Delete → `confirm delete` → `deleteEntry(capturedId)` (state.js:1974) **unconditionally**
    (views.js:14304-14348; only gather/drawOut are register-gated). Route: **Notebook → the
    marginalia card → Delete**. It even re-renders Book Detail if that is the open route.
  - **AN UPDATE PATH EXISTS** — `openMarginaliaEditor`'s `onSave` else-branch sets
    `entry.body = body; entry.updatedAt = now` + persists (views.js:13643-13650). So it is
    create-**then-update-within-the-open-session**, not "create-only".
  **THE REAL GAP, narrowed:** (1) **no re-entry with prefill** — `entryId` is a closure var reset to
  `null` on every open, so once the editor closes a note can never be re-opened to correct;
  (2) **no edit/delete affordance on Book Detail's marg cards** — delete lives only on the Notebook
  surface. Scope is therefore `entryId` param + prefill + surfacing the affordance here — **cheaper
  than first written, and NOT "build an update path + build delete"**.
  **TIER FLAGGED FOR PRESTON:** PROGRAM was ruled on the false "APP-WIDE gap" framing. The corrected
  scope may not warrant a dedicated supervised session. Left at PROGRAM — a re-tier is his call, not
  a silent downgrade.
  **Why it surfaced now:** the decorative ✎ was the only thing on the page that looked like the
  missing capability. DWF-1 removed the glyph (it promised what this surface does not deliver); a
  real, wired pencil returns here when MARG-EDIT ships — `.bk-annot` keeps its `gap:10px` as its seat.
- **Mobile pass DONE (MW-3), `mobile: native`.** Nothing outstanding on the mobile axis. The only
  carried item is the desktop residual **MW3-BKBOX** (own felt-gated pass, out of the mobile wave).
- **`desktop: native` — GRANTED 2026-07-15** by Preston on the **deployed felt pass of v3.210**
  (`d3a96df`), after DWF-1 resolved the marginalia ✎ that the v3.209 pass caught. The chip was
  **held at `composed` through both builds** under the under-claim law and raised only by his word,
  never by assertion. **Book Detail is the first surface in the program to reach `native` through
  the polish tier** — the tier's whole premise (composed ≠ designed) earned on its first surface.
  DWP-RAIL-INVERT stays open beneath it (ruled OPTION A: ship as built, residual named and measured)
  — a known, accepted edge, not an unknown.
- **DWP-RAIL-INVERT — RULED: OPTION A (Preston, 2026-07-15, "11 files, option A — push").**
  Ship as built; the residual is named, measured and carried. **This is a known, accepted void
  mode, not an unknown.** The rail is a SPANNING grid item and col 1 is **not** one object, so the
  void mode **inverts** instead of dying: when the rail out-grows the col-1 stack, its excess
  inflates rows 2-7 and a void opens under the hero. **Reproduced @1920**: 10 value-marks-with-
  lineage + no marginalia/roots/description → rail 1033px vs col-1 1033px → **220px hero→main
  void**, idle picker rows blown 0→49.5px each. Trigger ≈ **9+ value marks on an otherwise-empty
  book**. `rig.hollow` **cannot** flag it (one gap ⇒ max==median) — any future check must measure
  `main.y - hero.bottom` directly.
  **The deferred cure (option B, NOT taken):** col 1 becomes ONE object (a `.bk-content` wrapper).
  Cost: hero and main both live in col 1 while mobile needs `hero → rail → main`, so any col-1
  wrapper forces the rail above the hero or below the thinking on mobile — i.e. B buys the desktop
  edge case with a felt-passed mobile order. Its own pass if the shape ever proves real.
- **DWP-D2-SELECT** (rig artifact, named) — with the Edit panel open, `rig.widestProse` reports
  76.3ch on `.bk-edit-select`, a `<select>`: the rig counts it as a prose leaf because a closed
  select's options have zero-size rects. Real prose is ≤72ch panel-open and panel-closed. Improved
  by this pass anyway (full-width ~1150px → col-1 678px).
- **DWP-DEADCODE** (named, carried) — the fold + the dissolve left provably-dead code: the
  `.bk-cols` / `.bk-aside` / `.bk-reading` / `.bk-rrow` CSS rules and the now-unused
  `bkReadingRow()` helper (views.js:8708). **All verified inert at every width** (no DOM element
  carries those classes any more). `statusText()` is **NOT** in this set — it is still live at
  views.js:879 and :1769.
  **Where they actually live (corrected by praxis-reviewer — my first rationale was wrong):** they
  are NOT all in the ≤759 blocks. `.bk-cols`/`.bk-aside` (components.css:10828-10834),
  `.bk-rrow` + `.bk-reading .bk-rrow:first-of-type` (:10848-10849) and `.bk-surface .bk-rrow`
  (:11077) are **unscoped base declarations that run at every width**; only some sit in
  `@media(max-width:759px)`. So the honest reason to defer is simply that dead-code removal is a
  separate concern from the composition and carries its own regression surface — not that the
  rules are mobile-only. Its own dead-sweep pass.
- **DWP-D6-UA** (named, carried) — `.vr-mark-name` / `.vr-mark-x` / `.bk-becamelink` /
  `.bk-artifact-open` fall back to the UA default outline (visible, but not the tokens-only DW
  ring). Pre-existing, not introduced here. `.bk-star` WAS added to the ring list because the
  fold moved it into the hero — this pass made it prominent, so this pass owned it.
- **DWP-NO-H1** (named, carried) — the page has no `<h1>`; the title is `div.bk-bt`. Pre-existing
  a11y gap, out of this pass's scope.
- **DWP-FOCUS-ORDER** (recorded, ruled) — the rail precedes `.bk-main` in the DOM, so Tab visits
  the rail before the content column (one 168px upward step at the hero→rail turn). Ruled
  acceptable on measurement: it is the column-to-column turn a two-column layout implies, and the
  alternative (main DOM-first) jumps ~2000px up at the end. `tabOrderEqualsDomOrder: true` (no
  positive tabindex anywhere on the surface).
- **DWP-RIG-RINGS** (rig defect, named) — `rig.rings()` HANGS the renderer on components.css: its
  inner `walk()` shares the loop counter `k` across recursion into `@media` blocks. Cost this
  session one hung tab. Use `rig.ringProbe` (which the rig's own header says supersedes it).
- **DWP-RIG-TAB** (rig fact, named) — the pane's synthetic Tab **arms** `:focus-visible` (trusted
  input) but does **not** advance focus. A literal Tab-walk is not possible; prove traversal via
  no-positive-tabindex + DOM order + geometry, and rings via `ringProbe`.
