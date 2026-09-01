# R-FIRSTSHELF RENDER ROUND — v3.287

**Base** `53e7cf4` / v3.286 · **Ships** v3.287 · **Files** `js/views.js` · `assets/components.css` · `sw.js`
**Rig** localhost static server, 390×844 + 390×664, dpr 2. All figures below are MEASURED on the
post-edit bytes (liveness asserted per load before measuring), not carried from Stage 0.

## Verdict per defect

| | defect | verdict |
|---|---|---|
| D1 | placeholder double title | FIXED — caption dropped for placeholders only |
| D2 | caption breaks mid-word | FIXED — word boundaries + real ellipsis |
| D3 | card text cut mid-glyph, unmarked | FIXED — same law, same mechanism |
| D4 | ragged rows | FIXED — one cell height per band |
| D5 | content under the action bar | **NOT REPRODUCED** — left alone per ruling |
| D6 | "needs a look" in disabled gray | FIXED — inversion completed at both ends |
| D7 | FAB collision | lift PARTLY — derived, proven; cover overlap STRUCTURAL, reported |
| D8 | draft-bar / frame-prompt collision | guide FIXED 6/6; bar fixed at safe-area-top 0 only |
| D9 | duplicated strings | FIXED — 5 "need a look" → 1; count line de-duplicated |
| D10 | bulk-add modal register | FIXED — contrast 1.3:1 → 15.18:1 |
| Rider | T12 single-word titles | FIXED — 30/31 regression set held; 1 named residual |

## 1 · D1 + D4 — the load-bearing measurement

19-book fixture, covers and placeholders interleaved in every row.

- **distinct cell heights across 14 confident cells: `["137"]`** — one value.
- **distinct caption baselines: 4, for 4 rows** — one per row, so every caption in a row shares a baseline.
- Row 1 composition `[COVER, PLACEHOLDER, COVER, PLACEHOLDER]`; all four `cellTop 251.4 / cellBottom 388.4`.
- Cover cell: `covH 96` + caption. Placeholder cell: `covH 137`, no caption. Same total.
- Exception band: 5 cells, distinct heights `["128"]`, 2 rows.

### The async trap (Ruling: prove it, or stop)

Same DOM node, single candidate pointed at a URL that really 404s:

| | cell height | cover height | `is-typeset` | caption |
|---|---|---|---|---|
| BEFORE the 404 | **137** | 96 | false | visible |
| AFTER the 404 | **137** | 137 | true | `display:none` |

`cellHeightMoved: false`. The grid does not reflow when covers fail.

## 2 · D2 / D3 — one law, and an honest mechanism change

`hyphens:auto` was wired first and then **measured inert** in the verification engine: a controlled
probe of "Counternarratives" at the same font and 54px measure returned byte-identical output with
hyphens on and off (this Chrome ships no hyphenation dictionary). Shipping on it would have been a
claim that could not be shown to work, so a deterministic floor was added in JS (`scanFitReviewText`)
and the CSS kept as the preferred instrument where dictionaries exist.

| path | before | after |
|---|---|---|
| caption "Counternarratives" | `["Counternarrat", "ives"]` — mid-word, no mark | `"Counternarr…"` |
| card "Counternarratives" | clipped mid-glyph, no mark | `"Counternar…"` |
| card "Education for Critical Consciousness" | `[…, "Consciousness"]` cut mid-glyph | `["Education ", "for Critical ", "Consciousn…"]` |
| caption "Education for Critical Consciousness" | 3 lines into a 2-line box | `["Education for ", "Critical Con…"]`, 0 hidden |

**Across all 33 text elements on the review face: `overflowCount = 0`.** Every truncation carries an ellipsis.

## 3 · D6 — the inversion, both ends (Ruling 2)

| | before | after |
|---|---|---|
| `is-lean` ("needs a look") art | `grayscale(1) brightness(0.86)` | `filter: none` |
| `is-lean` tilt | `rotate(-6deg)` | `rotate(-6deg)` — kept |
| `is-lean` edge | none | `outline 1px solid rgb(168,118,26)` (`--gold`) |
| `is-lean` label | `"needs a look"` @ `rgb(151,139,109)` | cut (D9) |
| `is-unlooked` label | `"couldn't look up"` @ `rgb(133,84,16)` (`--gold-deep`) | `rgb(151,139,109)` (`--ink-3`) |

## 4 · D9 — strings cut

| | before | after |
|---|---|---|
| count line | `"19 found · 13 confident"` | `"19 found"` |
| spine-flag tally | `needs a look ×4, couldn't look up ×2, already shelved ×1` | `couldn't look up ×2` |
| band headers | `"Ready to shelve N"` / `"Need a look N"` | unchanged |
| aria-label | `"Needs a look: <title>. Open to fix."` | unchanged — nothing lost to screen readers |

## 5 · D7 — the derived lift (Ruling 3), and the half it cannot reach

Token used: **`--sp-4` = 16px** (`assets/theme.css:336`), the nearest existing spacing token. No
variable added. Expression: `calc(var(--sp-5) + env(safe-area-inset-bottom, 0px) + <measured Add height + --sp-4>px)`.

| Add button height | derived lift | gap | gap under the OLD 62px constant |
|---|---|---|---|
| 44px (shipped label) | 60px | **16.0** | 18.0 |
| 55px (label wraps) | 71px | **16.0** | 7.0 |
| 137px (wraps + 22px font) | 153px | **16.0** | **−75.0 → overlap** |

**Cover-art overlap: NOT FIXED, and not fixable by lift geometry.** Measured across six scroll
positions, the door covers a `.cavity-cover` at 4 of them (worst 30×42px at rest) and is clear at
600/max. A side-by-side un-stack was built and measured as an experiment: **also 4 covered instances**
— so the stack is not the cause. Any fixed bottom-left affordance overlaps a scrolling cover grid;
`--floating-stack-h:160px` only guarantees clearance at the END of the scroll.

**The two affordances do different things:** `#capCreateDoor` (aria "Capture a thought") opens the
capture sheet — a NOTE. `.shelf-add-primary` ("＋ Add a book") calls `openShelfEditor()` — a BOOK
record. Different objects; neither removed. Awaiting ruling.

## 6 · D8 — layout only, at 390×664

Guide reparented into `.scan-vf-bottom` at `bottom:100%`. Draft bar compacted under
`@media (max-height:720px)` (107.4 → 88.2px).

| safe-top | safe-bottom | bar vs top brackets | guide covered by control block |
|---|---|---|---|
| 0 | 0 | **+11.2 clear** (was −8) | **no** (was 0.6px flush) |
| 0 | 34 | **+11.2 clear** | **no** (was 390×26 fully covered) |
| 47 | 0 | −35.8 over | no |
| 47 | 34 | −35.8 over | no |
| 59 | 0 | −47.8 over | no |
| 59 | 34 | −47.8 over | no |

**Guide half: fixed in 6/6.** Bar half: fixed at safe-area-top 0, unchanged from shipped at 47/59.
The reticle cannot yield — `scanShelfCropRect()` (`views.js` ~9003) reads its rect to build the
capture crop, so it is capture geometry, not decoration, and the non-goals bar touching it. At 664 the
reticle occupies 300px (45% of the viewport); 88.2px of bar does not fit in the 40.4px left above it
at a 59px inset. `.scan-vf-top` was checked for a double-counted inset — it is correct, not the cause.

**Reachability (INFERENCE, not measurement):** iOS Safari portrait reports safe-area-top 0 and gives
~664px; standalone PWA reports 47/59 and gives the full 844px, where the bar clears by 15.8px. The two
failing cells combine a short viewport with a large top inset, which I could not produce in the rig and
believe does not occur. Labelled as belief because the device cannot be tested from here.

**One regression introduced:** at safe-area-bottom 34 the guide's text ink (33.3–356.7) crosses the
lower bracket corners by 30×26px. Before, it was invisible there. Visible-but-crossing is better than
covered, and the alternative was compacting the shutter block. On the appearance list.

## 7 · D5 — NOT REPRODUCED (ruled: leave alone)

| viewport | foot h | foot top | deepest content | clearance | sliced text nodes |
|---|---|---|---|---|---|
| 390×844 | 74.0 | 770 | 684.4 | **+85.6** | **0** |
| 320×568 | 74.0 | 494 | 408.4 | **+85.6** | **0** |

Scroll maxed both times. `.scan-rv-wrap` padding-bottom was **120px at v3.279** and 160px from v3.280
(`fbc947b`), against a 74px bar — so the stated cause was never true anywhere in the observation window.
The foot is genuinely viewport-fixed (no transform/filter ancestor). **Open observation: Preston saw
something and neither of us knows what.**

## 8 · D10 — register + contrast

| | before | after |
|---|---|---|
| panel background | `rgb(43,48,66)` (`--surface-2`, dark-ground token) | `rgb(246,239,220)` (`--card-2`) |
| body/field ink | `rgb(36,23,16)` | `rgb(36,23,16)` |
| **contrast** | **1.3:1** | **15.18:1** |
| Submit | dark ink slab | gold gradient — same as `.shelf-editor-save` |
| Cancel | navy slab | transparent + `--ink-3` + `--line-page-2` |
| page ground (context) | `rgb(253,249,238)` | unchanged |

Fixed by adding `.shelf-bulk-editor` to the **existing** F5 reskin block (`components.css:12866`) that
already carried `.shelf-editor`. `.notebook-editor`, the third member of the shared grouped rule, cannot
match — every rule touched is scoped under `.shelf.lum-amber-deep`. **T22 logged; the FLOW is untouched.**

## 9 · Rider — T12 single-word titles (Ruling 1: take A)

- **31-title regression set: 30 unchanged, 1 changed** — `Death by Black Hole` splits to
  title "Death" / author "Black Hole".
- **Must-split set: 12/12 pass** (incl. `Fooled by Randomness by Nassim Nicholas Taleb`, `de Beauvoir`, `van Gogh`).
- **Rider set: 7/7 pass** — Overstory · Beloved · Educated · Charm · Persuasion · Middlemarch · The Overstory.
- **Locative guard holds:** `Cottage by the Sea` refuses (rule 5); `Sapiens by Harari` refuses (rule 3).

Residuals R-A (`The Cottage by Lake Michigan`) and R-B (`Death by Black Hole`) are recorded together in
the function header with **T21 as the shared retirement condition**, plus the record that no structural
discriminator exists (a participle test fails on "Beloved" and "Educated" — the very titles the change
exists to fix) and that a given-name dictionary was **declined** because it would pass common Anglophone
names and fail silently on everything else.

## 10 · Consumer inventory (Stage 1 gate)

`scanCoverNode` has **five** call sites; `.scan-cov` has a sixth synthetic consumer.

| # | consumer | size | verdict |
|---|---|---|---|
| 1 | Book-mode verdict card `#scan-vd-cov` (`views.js:8719`) | 64×96 | **untouched** — text rules scoped to `.scan-dc` |
| 2 | Tray strip `.scan-tray-cov` (`views.js:9176`) | 44×66 | **untouched** — same scoping |
| 3 | Review confident band (`views.js:9252`) | 64×96 | TARGET |
| 4 | Review exception band (`views.js:9278`) | 64×96 | TARGET |
| 5 | Walker row `.scan-wk-row` (`views.js:9392`) | 70×105 | **untouched** |
| 6 | Shelve-flight clone `.scan-flight-cov` (`views.js:9541`) | 44×66 | **unaffected** — empty div, no `.cov-t` |

The D2/D3 rules are deliberately scoped `.scan-dc …` rather than the bare `.scan-cov .cov-t` for exactly
this reason. **REPORTED, NOT EDITED:** consumers 1 and 5 print the title inside the card AND again
below it — the same shape as D1, on surfaces this round does not name.

## 11 · Gates

- **Parse:** `PARSE OK: js/views.js` (exit 0), re-run after every edit.
- **ES3:** no `const`/`let`/`class`/arrow/backtick in code — backtick grep hits are inside comments;
  the `new Function()` harness would reject a real template literal.
- **Foundations byte-locked:** `lumen-amber.css` `070679b0…` · `marks.js` `772886c0…` — both unchanged.
- **Blob CR = 0** on all three files; diffstat 281 insertions / 29 deletions across 3 files — no EOL flip.
- **Byte deltas (LF-normalised):** `views.js` +10,476 (**code +1,936** / comment +8,540) ·
  `components.css` +7,081 (**code +2,406** / comment +4,675) · `sw.js` **+0** (equal-length version string).
- **Cross-surface smoke** (required for any `views.js` / shared-CSS change): `#home` 303 nodes ·
  `#books` 166 · `#arcs` 123 · `#notebook` 46 · `#account` 418 · `#about` 397 — all render.
  **Console errors: 0.** Shelf counts == data (6 stored, 6 distinct titles painted; the two repeats are
  the desk "Now" band re-showing currently-reading books, pre-existing and by design).
- **§9 fix-red-team: NOT RUN** — the round brief states it is neither authorised nor required
  (presentation only; no data writes, no state mutation, no deletion in this diff).

## 12 · Appearance judgments — NOT measurements

Preston's felt pass decides these; the rig cannot.

1. **The gold hairline on "needs a look" reads as more inviting than the quieted "couldn't look up".**
   The colours and the filter removal are measured; which one the eye lands on first is judgment.
2. **A placeholder card at 137px tall reads as a book, not as a stretched box.** The ruling asked for one
   text block at full cell height; whether a 64×137 typeset slot sits well beside a 64×96 cover with a
   caption is a look question.
3. **`"Counternarr…"` is better than `"Counternarrat / ives"`.** Both show less than the whole title;
   the ellipsis is honest, the break showed more characters. Judgment, and reversible in one line.
4. **The guide's text crossing the lower bracket corners at safe-area-bottom 34** (see §6).
5. **Cutting the per-card "needs a look" leaves those cards wordless.** The band header, the tilt, the
   gold edge and the aria-label all still name the state — but whether the card alone communicates
   "open me" is a look question.
6. **The bulk-add panel now matches "Manage shelf".** Contrast is measured; register fit is judgment.

## 13 · Not live-verified

Nothing here ran on `praxis-reading.netlify.app`. Egress to the live site is blocked from this machine
and nothing is pushed. Device-only questions — iOS hyphenation (where the CSS instrument would take
over from the JS floor), real safe-area values, and every item in §12 — are open until the felt pass.
