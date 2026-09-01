# R-FIRSTSHELF — CORRECTION PASS — v3.288

**Base** `3ea577d` / v3.287 · **Ships** v3.288 · **Files** `js/views.js` · `assets/components.css` · `sw.js`
A reopen of v3.287, not a new round. Presentation only — no data writes, no state mutation, no deletion.
Rig: localhost:8889, 390×844, dpr 2. New bytes asserted live before every measurement.

| | item | verdict |
|---|---|---|
| C1 | flag placement | **FIXED** — ratio met; 169/137 placeholder split closed |
| C2 | mid-word hyphenation | **FIXED** — `hyphens:auto` removed from both paths |
| C3 | FAB over an open sheet | **FIXED** — all three sheets + the scan regression check |
| C4 | header/tray disagreement | **FIXED** — one stored value, both surfaces |
| C5 | the unflagged card | **RULING REPORTED, not acted on** |

## 1 · C1 — the mechanism was the reserved caption box

Preston's correction was right: ~20px on device, ~18px here, same defect. The cause was that
`.scan-dc .cap` reserved a fixed `height:34px` while the clamped text inside rendered 24.2px, and
`.spine-flag`'s margin was measured from the BOX bottom. The reader saw the unfilled remainder plus
the margin.

**Fix: `.cap{ height:auto }`** — the box bottom becomes the text bottom, so the flag is anchored to
what is actually visible — plus `margin-top:3px` on the confident band's flag.

Measured, "Ready to shelve" band, all real covers, **every caption two lines** ("Marriage, a History",
"Pedagogy of Freedom", "Black Skin, White Masks", "A Thousand Plateaus"):

| | before (v3.287) | after |
|---|---|---|
| caption box slack (reserved − rendered) | 9.8px | **0.1px** |
| **gap: flag → its own caption** | 17.8px effective | **3.1px** (ruled ≤ 4) ✔ |
| **gap: flag → next row's covers** | ~25px | **31.8px** |
| **ratio** | ~1.4× | **10.26×** (ruled ≥ 3×) ✔ |
| caption lines on a flagged card | 2 | **2** — kept ✔ |
| flag inside its own cell | yes | yes ✔ |

**Cell uniformity, has-flags band, 8 cards mixed cover/placeholder/flagged/unflagged:**
`distinctCellHeights: ["164"]` — one value. 169 → 164 because the status row is 27px (3 + 24), not 32.

**The 169/137 placeholder split is CLOSED.** `distinctPlaceholderCoverHeights: ["137"]`. The typeset
cover was `flex:1 1 auto`, so it grew to "whatever is left" — 169px unflagged, 137px flagged, in the
same band. It is now a fixed `137px`, which is the same number from both directions (the unflagged
cell height, and 164 minus the status row), so the two bands agree by construction.

### Async flip — the stop condition, re-proven

Same node, single candidate pointed at a URL that really 404s:

| | cell height | cover height | `is-typeset` | caption |
|---|---|---|---|---|
| BEFORE | **164** | 96 | false | visible |
| AFTER | **164** | 137 | true | hidden |

`cellHeightMoved: false`. ✔

## 2 · C2 — the mechanism I could not verify was actively wrong

`hyphens:auto` removed from `.scan-dc .cap .t` and `.scan-cov .cov-t`. Computed value is now
`manual` (the CSS default) on both paths; zero hyphens rendered anywhere on the face.

Why it failed: at the 64px caption measure, 11px serif — "Artificial" 39.7px and "Intelligence"
50.1px each fit alone, so a clean two-line space-wrap existed. But **"Artificial In-" is 55.1px,
which also fits**, and a greedy line-breaker with a dictionary takes it. Same greedy-packing failure
as the original `overflow-wrap:break-word`, wearing a hyphen.

| title | caption path | card path |
|---|---|---|
| **Artificial Intelligence** | `["Artificial ", "Intelligence"]` — wraps at the space, full text | `["Artificial ", "Intelligence"]` |
| **Counternarratives** (78.6px, over-measure) | `"Counternarr…"` | `"Counternar…"` |
| **Education for Critical Consciousness** | `["Education for ", "Critical Con…"]` | `["Education ", "for Critical ", "Consciousn…"]` |

`overflowCount: 0` of 12 text elements. `hyphenPresentAnywhere: false`.

## 3 · C3 — the FAB yields to any sheet

One `:has()` rule added beside the shipped `body.scan-active` hide.

| case | `display` | visible |
|---|---|---|
| CONTROL — no sheet | `flex` | **yes** |
| 1. Manage sheet open | `none` | no ✔ |
| 1b. Manage closed | `flex` | yes ✔ |
| 2. Catch a thought open | `none` | no ✔ |
| 2b. Catch a thought closed | `flex` | yes ✔ |
| 3. Bulk editor open | `none` | no ✔ |
| 3b. Bulk editor closed | `flex` | yes ✔ |
| 4. `body.scan-active` (v3.287 regression check) | `none` | no ✔ |
| 4b. scan-active removed | `flex` | yes ✔ |

**Floor check — and a gap.** The repo states **no supported-browser floor anywhere**: no
`package.json`, no `.browserslistrc`, no support doc. **Reported as its own gap (T26).** Empirically
the floor is already well above `:has()`: the shipped CSS uses `color-mix()` **153 times** across
`components.css` + `theme.css`, and `color-mix()` is Safari 16.2+ / Chrome 111+, while `:has()` is
Safari 15.4+ / Chrome 105+. `:has()` cannot raise a floor `color-mix()` has already set above it.

## 4 · C4 — one stored value, both surfaces

`onShelf` (EXACT tier only) is accumulated in the classify loop, stored on `scanResult.rec`, and
rendered through one shared builder `scanReviewCountLine()`.

"confident" dropped from both. EXACT tier only, because that is precisely what Shelve N excludes
(`scanCommitBook` folds an exact match; a probable one still adds).

### The outage clause — RULED AND RESTORED (Preston, 2026-09-01)

The first C4 shape had no slot for T14's outage clause, which left the tray silent about a catalogue
failure. Ruled: the tray reads `"<N> found · <M> couldn't look up"`, and **an outage OUTRANKS
"already on your shelf" when both apply** — a failed lookup is what the reader must know *before*
deciding to shelve.

**Which kind of change:** a **small code change, not docs-only.** The count already existed —
`unlooked` is accumulated in the classify loop, passed to `scanFinishFill`, and stored on
`scanResult.rec` — but the shared builder never took the parameter. The tail is now factored into
`scanReviewCountTail(onShelf, unlooked)` so the tray (which splits the sentence across two spans) and
the review header read from one place and cannot drift.

| case | tray count | tray sub | tray composed | review header | match |
|---|---|---|---|---|---|
| A · outage only (3 failed) | `19 found` | `3 couldn’t look up` | `19 found · 3 couldn’t look up` | `19 found · 3 couldn’t look up` | ✔ |
| B · already-shelved only | `19 found` | `2 already on your shelf` | `19 found · 2 already on your shelf` | `19 found · 2 already on your shelf` | ✔ |
| **C · BOTH — outage wins** | `19 found` | `3 couldn’t look up` | **`19 found · 3 couldn’t look up`** | **`19 found · 3 couldn’t look up`** | ✔ |
| D · neither | `19 found` | *(empty)* | `19 found` | `19 found` | ✔ |
| E · single failure | `19 found` | `1 couldn’t look up` | `19 found · 1 couldn’t look up` | `19 found · 1 couldn’t look up` | ✔ |

`allMatch: true`. The review face's `#scan-rv-lookupnote` and `scanAnnounce` keep their fuller
sentences on top of this.

## 5 · C5 — the unflagged card (ruling reported, not acted on)

**Judgment, not measurement.** With the flag now 3.1px under its own caption and 31.8px from the next
row, absence reads as absence: a card that ends at its caption is visibly a card that ends, and the
flagged ones carry a mark tight against the title. I do not think a "NEW" label is needed, and adding
one would reintroduce D9. My reservation: in a band where only one or two cards are flagged, the
common case is the unmarked one, so "unmarked" is carrying meaning by being the majority — which works
until a scan is mostly duplicates. Worth watching on a re-scan of an already-shelved shelf; not worth
acting on now.

## 6 · Gates

- **Parse:** `PARSE OK: js/views.js` exit 0.
- **Foundations byte-locked:** `lumen-amber.css` `070679b0…` · `marks.js` `772886c0…` — unchanged.
- **Byte deltas (LF-normalised):** `views.js` **+1,750** (code **+320** / comment +1,430) ·
  `components.css` **+3,597** · `sw.js` **+0**.
- **Blob CR = 0** on all three; diffstat 95 insertions / 26 deletions across 3 files — no EOL flip.
- **Cross-surface smoke:** `#home` 303 · `#books` 166 · `#arcs` 123 · `#notebook` 46 · `#account` 418 ·
  `#about` 397 — all render. **Console errors: 0.** Shelf counts == data (6/6).
- **§9 fix-red-team:** not required (stated in the correction brief; presentation only).

## 7 · Appearance judgments — NOT measurements

1. **3px is tight enough to bind the flag to its title without crowding it.** The ratio is measured;
   whether 3px *looks* attached rather than cramped is judgment.
2. **The flag now sits higher in the cell than it did**, with ~10px of slack below it before the cell
   ends. Measured; whether that reads as deliberate or as a stray gap is judgment.
3. **`"Counternarr…"` versus the hyphenated form.** On device you will now see truncation where you
   saw "Artificial In- / telligence". Both lose characters; the ellipsis is honest about it.
4. **The FAB vanishing when a sheet opens** — correct in principle, but it disappears without
   animation. If that reads as a glitch rather than a yield, it is a one-line transition.
5. **`"19 found · 2 already on your shelf"`** — whether that sentence explains the Shelve button at a
   glance is exactly the thing a measurement cannot answer.

## 8 · Not live-verified

Nothing ran on `praxis-reading.netlify.app`; egress is blocked from this box and nothing is pushed.
The two device-only questions this pass turns on — iOS Cormorant's two-line caption height, and
whether `hyphens:manual` restores the space-wrap you saw broken — are open until the felt pass.
