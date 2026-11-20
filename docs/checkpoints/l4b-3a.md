# L4b-3a — the Shelf redrawn: search, the Lenses | Categories switch, status chips, and each lens or category as a band of large covers

L4b-3a STARTED 20 Nov 2026 (Opus 5.5, executing the written patch). Base 249cae1 / v3.336.

20 Nov 2026 · Opus 5.5 executing an already-written, already-measured patch (written and tested by the review chat in Chrome
through Playwright against `249cae1`), applied byte for byte on main at `249cae1` (v3.336) == origin/main. The prompt was read
from disk (`L4b-3a-SHELF-PROMPT-v3.337.md`, 69,203 B, LF, md5 `105c7c50…`); the patch was taken from its bytes. Preston's
go-ahead included "run fix-red-team on this". **Status: built, local until committed and pushed.** CACHE_VERSION `praxis-v3.337`.
**js/hand.js is NOT touched and stays locked at `dc6a021e5b89652cf5e6c0a84ae249cd` (53,596 B).**

## Rulings, worded as given (19 Nov 2026)

- **S1** Manage's tools: "••• in the header". A three-dot button beside Add a book opens today's Manage sheet unchanged, minus
  Covers / Compact.
- **S2** The Now desk: "Remove it". The Reading chip does its job; the carrying question stays saved with no door on the Shelf.
- **S3** Chips and search: "Both hide". Chips and typing hide the books that do not match, and bands left empty.
- **S4** A long band: "Row on phone, wrap on desktop". One sideways row with every book on a phone; from 760 the same large covers
  wrap into rows.
- **S5** "Form opens at the top". Add a book (and every panel that mounts in the same host) opens under the head, not below the
  last band.
- **S6** "Titles stay whole". A title on a cover card must not split a normal word.
- **S7** "Lenses first". A reader with lenses who has never used the switch lands on Lenses.

He was shown captures of the patched Shelf on 19 Nov. He has not yet seen it on his phone; that check is owed after the push.

## Choices the chat made — each Preston's to overrule

- **C1** Add a book and the three dots sit on the "Shelf" title's row. The drawing puts Add a book beside a "praxis" wordmark, but
  the live top bar already carries the wordmark and the Search pill.
- **C2** On the Shelf a lens's mark no longer opens the lens sheet. The whole band header is one door to the lens page (as drawn);
  a category band's header is one door to its category page. The L4b-2a and L4b-2b doors are kept.
- **C3** New words: the count line "N books · N lenses" (lenses that hold at least one shelved book; no lens part at zero); the
  search placeholder "Search your shelf"; the no-match line "No books match. Try another title or author, or choose All."; the chip
  labels All, Reading, Will read, Have read; "Open"; the button label "Add a book" (was "＋ Add a book"); aria-labels "Manage
  shelf", "Open the lens X", "Open the category X", "Books in X".
- **C4** An empty shelf shows no search bar, switch or chips. It keeps today's empty-state words and button (the redrawn empty
  rooms are L4b-5; their words are not ruled).
- **C5** Two phone bugs found at v3.333 and still present at 249cae1 are fixed here because the three dots are now the only door to
  that sheet: the tab bar covers "Tidy library" in the Manage sheet, and covers the whole Select bar ("Move to an arc", "Cancel").
  Cause: the Shelf's wrap has isolation:isolate, so its z-indexes never rise above the tab bar. Fix: both stand on the tab bar's
  top edge (CSS only, phones only, only while the tab bar is on).
- **C6** The signed-out gate is not touched. The redraw's class (sh3) is added to the wrap only past the gate, so "Your shelf is
  private" keeps its card exactly.
- **C7** The title on a cover card is 13 px. Measured: "Undercommons" is 98.4 px wide against a 100 px text box. A word longer than
  about 12 letters can still break.

## What was built

- **js/views.js** — `renderShelf`: the wheat strip, the old slim header, the value chips and the Now desk are no longer built. The
  head is the title row (h1 "Shelf", the three dots, Add a book), the count, the search field, the Lenses | Categories switch
  (Lenses on the left), the status chips, the no-match line. The Manage sheet's code is unchanged except its button (three dots,
  aria-label "Manage shelf") and the removal of Covers | Compact. Add a book is a plain `.sh3-add`; nothing carries
  `.shelf-add-primary`. `#shelf-editor-host` sits directly after the head. The resize handler only calls
  `capUpdateCreateDoorPos`. `renderShelfCase`: a chip or a search filters before banding; the classifier is still offered every
  unsorted book; one list of bands at every width; no Yumi lens row under a chip or a search. `buildShelfBandHeader`: new classes,
  a still lens mark, "Open", the name button stretched over the row in CSS (click handler text unchanged). New `sh3Row`,
  `sh3Cover`, `sh3LensCount`, `sh3HasLens`. `shelfFiltersActive` / `shelfBookMatchesFilter` know `shelfFilter.status`;
  `shelfUpdateSearchEmpty` reads the case. `getShelfGrouping`: with nothing stored, `'lenses'` when `sh3HasLens()`, else
  `'categories'`. The focused band view's head selector is `.sh3-top`.
- **assets/components.css** — one labelled block after L4f's, "L4b-3a THE SHELF REDRAWN": every rule under `.shelf.sh3` (the four
  tab-bar rules under `body:not(.l3-gated):not(.tabbar-off) .shelf.sh3`). Tokens only; rgba() shadows; no hex.
- **sw.js** — `praxis-v3.336` → `praxis-v3.337`.

## Stage 0 — pre-flight: PASS

- HEAD `249cae1` == origin/main (fetched); CACHE_VERSION `praxis-v3.336`; tracked tree clean; hook gate ARMED
  (`core.hooksPath = hooks`); FIX-PROTOCOL v1.3 (`tools/ground-truth`).
- Protocol documents found (11): CLAUDE.md, PROTOCOL.md (v1.2), docs/FIX-PROTOCOL.md (v1.3), CRAFT.md, and the seven
  `.claude/agents/` files (fix-implementer, fix-red-team, praxis-recon, praxis-reviewer, repo-mapper, studio-mockup, studio-scan).
  Missing: none. Old drift noted, not touched: praxis-recon.md and praxis-reviewer.md still expect `lumen-amber.css` at 14,681 B
  (the canon and the file: 11,953 B).
- Before-numbers (HEAD blobs): views.js 1,408,106 `d40e7a23…`, components.css 953,259 `c77cf65b…`, sw.js 6,894 `b03bd430…` —
  MATCH. Unchanged files: hand.js `dc6a021e…` (53,596), state.js `b8cdafb5…` (220,174), integrations.js `2d86b859…` (221,778),
  theme.css `571e0ccc…` (41,369), lumen-amber.css `631bc2aa…` (11,953), marks.js `772886c0…` (10,255), index.html `addda80d…`
  (12,113) — MATCH.
- The patch, lines 287–1068 of the prompt file cut by `head`/`tail` (the file had 0 CR, so nothing was dropped): **782 lines,
  43,841 B, md5 `f2ab78d85030b210cba43d01cd3f7350`**, no BOM, LF only, ends in one newline, 0 tabs, 24 hunks in 3 files, 35
  one-space context lines, 50 non-ASCII (— ×21, · ×20, § ×4, … ×3, ⌕ ×1, ＋ ×1) — MATCH. Neither marker inside it.
- `git apply --check` on a scratch index (`GIT_INDEX_FILE`, never stash): exit 0. Applied there: views.js 1,409,422
  `cc0e044a…` (207/219), components.css 962,279 `577e3d54…` (76/0), sw.js 6,894 `9059e79d…` (1/1) — exact.
- Nothing reserved v3.337 (its three mentions — BUILD_STATE.md, sequence.md, builder.html — reserve it for this build);
  `l4b-3a.md` and `l4b-3a-shots/` did not exist.
- **Code read (line numbers in the patched views.js):**
  - a) Harness anchors: all **23** views.js cuts the five harnesses make are byte-identical before/after, each start anchor once
    (incl. `labelEl.addEventListener('click', function () {`, cut by L4b-2a hotfix 1 and L4b-2b); a script self-check caught a
    mutated copy. The six tool suites cut nothing from views.js.
  - b) `getShelfGrouping` callers 4834, 4894, 4903, 5093, 6035 and the classifier callbacks 5916 / 5928; `setShelfGrouping` only
    4904. **Two writers outside the Shelf store the key directly** (older than this build): "See on the shelf" on a lens page
    (27844 → `'lenses'`) and `lxOpenShelfCategory` (28416 → `'categories'`), so "nothing is stored until the reader taps the
    switch" holds except after those two. The new default changes nothing outside the Shelf.
  - c) Leftover lookups of removed elements are null-guarded or dead (5356, 5520, 5580, 5847, 5885); no intro, spotlight, walk or
    first-run beat reads them; the CSS `:has()` rules name only elements still built. `capUpdateCreateDoorPos` (26462) finds no
    `.shelf-add-primary` and clears its inline lift — right at both widths: at ≤759 `#capCreateDoor{display:none}`
    (components.css:17768), and the 62 px `.cap-on-shelf` lift is ≤759 only.
  - d) **Copy finding (R-2 below):** the Notebook's "Carry on the desk" / "Carried on the desk" (19971, 19989, 19996).
  - e) The wrap is built only at 4793; `sh3` appears nowhere at HEAD; every new rule is under `.shelf.sh3`; the Manage sheet and
    `#shelf-selectbar` mount inside the wrap.
  - f) Orphans: see Separate tasks. **The prompt's list is wrong about one item: the focused band view is still reachable** (R-1).
- **Recon gate (FIX-PROTOCOL §1#8), fix-red-team (Sonnet) on the recon before the apply:** no block; it re-derived claims 1, 3, 4,
  6 and probes (a)–(d), confirmed R-1 and R-2, added that the focused view leaves `#shelf-editor-host` and the first-shelf offer
  showing, and noted the stale `.shelf-head` lookup in `revealShelfPanel` (dead at HEAD too).

## Stage 1 — apply: PASS

Applied with `git apply --cached` (exit 0), then the three files checked out from the index (the working tree keeps CRLF; the
blobs are LF). Staged blobs (`git cat-file -p :<path>`), and the working tree LF-stripped, both:

| file | bytes | md5 | expected |
|---|---|---|---|
| js/views.js | 1,409,422 (+1,316) | `cc0e044a9533bdb7506aa0af12de6617` | exact |
| assets/components.css | 962,279 (+9,020) | `577e3d546106b608fcfded477925e43b` | exact |
| sw.js | 6,894 (+0) | `9059e79ddb7a9c69eeafe7d9bde79fad` | exact |

numstat `207 219` · `76 0` · `1 1`. `tools/parse-check` on all 19 js/*.js files and sw.js: PARSE OK, every exit 0 (re-taken by
PowerShell `$LASTEXITCODE`; a deliberately broken copy exits 1). Added views.js lines: `const ` 0, `let ` 0, `=>` 0, backtick 0,
**`class ` 1 — the comment "the redraw's class goes on only here…", as Preston corrected check 1.3 to expect**. `git ls-files
--eol`: i/lf w/crlf on all three, as before. The seven unchanged files at their numbers.

## Stage 2 — measure, test and look (headless Chrome over CDP, 20 Nov 2026)

**Rig** (untracked, never staged): `.claude/rig/captures/l4b3a/` — `l4b3a-rig.js` (`window.L3A`: the `praxis_user` sign-in stub,
libraries seeded through the shelf editor's own steps, every probe), `l4b3a-run.ps1` (CDP head copied from `../l4e/l4e-head.ps1`),
`l4b3a-phases.ps1`, logs `log-*.txt`. Served by `../l4b2bhf1/serve-root.ps1`: **8892 the working tree (AFTER)**, **8893 a `git
archive` of 249cae1 + the rig (BEFORE; its views.js, components.css, sw.js and hand.js re-md5'd to the 249cae1 blobs)**. Served
sw.js reads `praxis-v3.337` / `praxis-v3.336`. 320 / 360 / 390 = phone emulation (dpr 2, touch, 844 high); 760 / 1360 dpr 1, 900
high. Libraries (`L3A.lib`): **b0**; **b1** (1 book, no lens); **b5** (2 categories, 1 lens); **b14** (6 categories, 2 lenses, a
pile); **b60** (all 17 SHELF_CATEGORIES, 5 lenses, a pile); **b150** (17 categories, 6 lenses, one holding 40); **b60 before the
yes**; plus **b14 with no lens**, **b14 whose only lens holds no shelved book**, a **cold store** and **signed out**. Statuses cycle
reading / read / finished / want / will-read / none; a third of the books carry a cover that loads (rig images), one in eleven a
cover that 404s, the rest none; "The Undercommons", a 113-character title and a lens name that runs three lines on a phone.
Nothing reaches Firestore. Transitions settled (`*{transition:none;animation:none}`) unless said.

### 2.1 The eleven suites — PASS
lens-eval **68/68** · lens-data **101/101** · export **58/58** · delete **58/58** · ceiling-core **36/36** · fx1c-sim **60/60** ·
L4b-1 hotfix **46/46** · L4b-2a unit **71/71** · L4b-2a hotfix 1 unit **74/74** · L4b-2b unit **120/120** · L4b-2b hotfix 1 unit
**74/74** — each read by its own printed total, all exit 0; the one "FAIL" line in nine of them is each harness's "self-check
(expected to FAIL)". (The first run here of lens-eval, lens-data and ceiling-core on the patched tree.)

### 2.2 Sideways scroll — PASS
`log-geom-*.txt`: 7 libraries × Night/Day × Lenses/Categories = 28 cases per width. **AFTER: `scrollWidth == clientWidth` at
320, 360, 390 and 1360 in all 112.** At 760: **861 against 760 in all 28 — and 861 against 760 in all 28 at 249cae1**; nothing
inside `#app` passes 760 (its widest right edge 760.0, `section.shelf`). (The chat read 866; this rig reads 861 in both builds —
the top navigation list, S-1.)

### 2.3 Targets — PASS
140 cases: **smallest control 44 × 44** (`.sh3-add`, `.sh3-more`, every `.sh3-seg button`, `.sh3-chip`, `.sh3-find`,
`.sh3-yrow button`); **every `.sh3-bandh` 52 px high**; **every `.sh3-cv` 116 × 174** (0 off).

### 2.4 Contrast — PASS
`log-contrast-after.txt`: the text made transparent, its box captured as PNG, the painted pixels' luminance against the computed
text colour; the worst of the 5th / 50th / 95th percentile. 20 elements × Night/Day × 390/1360 = **80 readings, all ≥ 4.5:1;
lowest 5.72:1** (`.sh3-tt small`, Day — the chat's lowest too). Night: the dimmest is `.sh3-tt small` 6.48; Day: `.sh3-tt small`
5.72, `.sh3-bcount` / `.sh3-chip` / `.sh3-count` / `.sh3-none` / `.sh3-note` 6.13–6.25, `.sh3-open` 6.90.

### 2.5 Each control hit by its own tap — PASS
`document.elementFromPoint` at the centre of every 2.3 control, scrolled into view (rows and chips scrolled sideways too), and on
every band header at its middle, its mark, its count and "Open": **3,730 points, 0 misses** — each header point lands on that
header's name button. The Manage items and Select-bar buttons: § 2.9.

### 2.6 Nothing clipped or blank — PASS, one note
- Every `.sh3-cv` holds an image or a title (blank 0 in 140 cases). **Every cover that 404s shows its title** (1/1 in b14, 9/9 in
  b150, at every width, after forcing every image to load). **"Undercommons" on one line: 98.4 px in a 100 px box** (100 cases).
- Phone: every overflowing row scrolls to its last cover (0 failures); from 760 no row scrolls and every cover sits inside
  `.sh3-inner` (0 outside).
- The title row's three items never overlap (0 in 140). **Note (N-1):** at 320 only the flex row squeezes the h1's box to 98.4
  px while "Shelf" paints 102 px — the ink runs 3.7 px past its own box into the 12 px gap and ends **8.4 px before the dots**
  (`l4b3a-320-title-row.jpg`); nothing is cut or touched. Every other single-line label fits its box.

### 2.7 Behaviour (390 and 1360) — PASS
`log-behave-after.txt`, b60 unless said; chips, switch, dots, covers and headers clicked with real CDP mouse events at their own
centres.
- **Count and chips:** "60 books · 5 lenses"; "All 60 · Reading 20 · Will read 20 · Have read 20" — the library's
  `normalizeStatus` counts (20 + 20 + 20 = 60; none counts as Reading). b14: "14 books · 2 lenses", 5 + 4 + 5 = 14.
- **Each chip** is the only one pressed; in Categories the covers on screen equal its number exactly (20 / 20 / 20, then 60 for
  All), every shown book of that status, 0 empty bands. (At 390 "Have read" sits past the edge of the sideways chip row, 337..460
  of 390; scrolled into view it behaves the same.) Lenses + Reading: 9 covers, all reading.
- **Typing** "the" under Reading: 4 covers, 0 non-matching, all reading; the field keeps focus. "zzqx": 0 bands, the no-match line
  shown, focus kept. Cleared: Reading's 20 back, line hidden; All: 60.
- **The switch:** key removed, a lens reader → `lenses`, key still null. Tap Categories → stored `"categories"`, the case
  regroups, focus on the Categories button; tap Lenses → `"lenses"`, focus kept. No lens → `categories`, null; only lens holds no
  shelved book → `categories`, null, count "14 books".
- **Doors:** a lens header at its mark, count, "Open" and name → `#lens/th_3a_1` (each point answered by the name button); a
  category header at count, "Open", name → `#category/Literary%20Fiction`; a cover → `#book/bk_3a_012`. Lens bands draw their
  mark (2/2). The Yumi row shows in Lenses after the yes and not under a chip.
- **The dots** open the sheet with exactly Select, Scan shelf, Scan barcode, Bulk add, Resolve covers, Tidy library. Escape closes
  it, `aria-expanded` false, focus back on the dots.
- **Select:** headers are not buttons (0 name buttons, 0 "Open"); a cover tap picks it and stays on `#books`; the count reads 1,
  then 2, then 1 on un-pick; Cancel leaves the mode, 6 header buttons back.
- **Add a book** mounts `.shelf-editor` directly after the head and before the case, the title field focused; **Bulk add** and
  **Tidy library** mount in the same place with the sheet closed. The panel's top lands **8 px from the top of the screen**, a tap
  there hits the panel, the nav tucked (`log-addcheck-*.txt`; 249cae1 scrolled the page ~7,300 px to the bottom to show it).
  **Note (N-2):** `revealShelfPanel` still scrolls the page (381 px at 390) to put the panel at the top, though it opened in view;
  the head scrolls up out of view.
- **A row keeps its place:** a real touch swipe (12 CDP `touchMove`s) scrolled a row to its end (150 px) with no navigation; the
  viewport then 844 → 760 high (the address bar folding): still 150. (b60, a row scrolled to 150 then 844 → 700 high: still 150.)
- **Signed out** (`log-signedout-*.txt`): the gate, wrap class exactly `shelf lum-amber-deep`, child `.empty-state` "Your shelf is
  private"; **the frame is pixel-identical to 249cae1** (PNG md5 equal at 390 and 1360, Night and Day).
- **Cold store** (`log-cold-after.txt`): the self-seeded workspace reads "5 books", All 5 / Reading 5, one band, no lens part;
  no sideways scroll, targets 44, nothing clipped.
- **0 page errors and 0 console errors in every run** (each log's last line).

### 2.8 The fixed "+ Add a book" over the first band — PASS
`log-bugs-*.txt`, 390, b14. **249cae1:** "＋ Add a book" `position:fixed` at 24,710 121 × 44, over a cover
(`l4b3a-28-add-390-before.jpg`). **AFTER:** no fixed control from the Shelf on screen; "Add a book" is static in the title row at
252,79 118 × 44 and overlaps 0 covers (`l4b3a-28-add-390-after.jpg`).

### 2.9 The sheet and the Select bar above the tab bar (C5) — PASS
390, the tab bar on (top at 778). **249cae1 reproduces both bugs:** "Tidy library" (780..824) is answered by the tab bar's svg;
"Move to an arc…" and "Cancel" (795..830) are answered by `a.tabbar-tab`, and a real touch on Cancel lands on the tab bar.
**AFTER:** every item (Select 444..488 … Tidy library 714..758, the × 396..440) and both bar buttons (696..731, 745..764) are
answered by themselves and sit wholly above 778; a real touch on Cancel leaves Select, and a real touch on Tidy library mounts
it. Closed, the sheet's top is 844 (the screen's bottom) and the bar's 854; their shadow (0 10px 30px) reaches about 20 px up,
under the opaque tab bar — no sliver above it. The Yumi flower does not answer for Cancel (it is answered by itself). At 1360 the
sheet is the popover it was (absolute, 288 × 309, inside the viewport). Captures `l4b3a-29-*-{before,after}.jpg`. **Note (N-3):**
with 92 px held for the flower, the bar sets Cancel on its own second line (`l4b3a-29-selectbar-390-after.jpg`).

### 2.10 Nothing else moved — PASS
`log-rooms-*.txt`, b14, Reduce Motion emulated + settle, then 1.2 s. `#app`'s markup with the sky's elements removed and gradient /
arc ids normalised, BEFORE vs AFTER at 390 and 1360: **#lens/th_3a_0, #category/Literary Fiction, #book/bk_3a_001, #notebook,
#search, #profile (You): identical.** **#home** differed — inside the seeded arc field (sub-theory ids and edge order, random per
load) and in the cover of Home's example spines (Open Library images that loaded in one run and showed "cover pending" in the
other); with those two normalised: **0 differing lines BEFORE vs AFTER, and 0 between two AFTER runs**. Still captures (PNG,
pixel diff): book, notebook, search identical; Home, You and the lens page differ in the sky's box — and by as much between two
AFTER runs (the control); the category page differs only inside one rig cover image (max channel delta 18–23, mostly 1–2) with
identical markup and identical between AFTER runs: JPEG decode noise, not the build.

### 2.11 Captures — `docs/checkpoints/l4b-3a-shots/` (46 files, 5.7 MB)
390 Night/Day × Lenses/Categories (`l4b3a-390-{lenses,categories}-{night,day}.jpg`, full frame); 320; 760; 1360 Night/Day ×
Lenses/Categories; the sheet open at 390 and 1360; Select with two picked (390); a search; no match; the Reading chip; the editor
open (and its top, BEFORE/AFTER); 0, 1 and 5 books; the pile; signed out BEFORE/AFTER (390, 1360); 2.8 and 2.9 BEFORE/AFTER; the
focused view from "See on the shelf" BEFORE/AFTER; the cold store; the walk; the chip focus ring. **Reading the full frames:** a
full-page capture also paints what sits just past the 900 px screen — the white "0 selected · Move to an arc… · Cancel" strip at
1360 (y ≈ 906–970) is the closed Select bar below the screen, as at 249cae1; the yellow "+" and the flower sit at the screen's
foot in the same way.

### 2.12 The walk (390, b60, real touches) — PASS
`log-walk-after.txt`.
- Landed on `#books` with no stored choice: Lenses (5 bands, 25 covers); a touch swipe carried the first row to its end and it held
  when the screen got shorter.
- Reading chip → 9 covers in 5 lens bands; typed "love" → no Reading book matches (the one "love" title is Will read), so no bands
  and the no-match line, focus kept in the field; All → 25 again.
- Categories (18 bands, 60) and back; tapping a lens mark opened `#lens/th_3a_4`; the tab bar's Shelf brought it back on Lenses.
- The dots → Select → two covers picked ("2", still on `#books`) → Cancel; Add a book → the editor at the top, title focused.

### 2.13 What the rig cannot show
Real covers (the rig's are flat images); hyphenation as Safari renders it; momentum and snap on a real touch screen (CDP touch
moves scroll the row, but not with a finger's inertia); the safe area under the tab bar on an iPhone; lazy cover loading in a
sideways row on iOS Safari. These are Preston's phone check.

## Stage 3 — the red-team and the reviewer

**fix-red-team (Sonnet, frontmatter-pinned), on the staged tree:** "1 residual-to-document that matters, plus nits. I found
nothing that blocks the commit." Read from the staged blobs; it did not run the rig. Each finding, then what the rig showed:

| id | sev | finding (condensed) | checked in the rig / disposition |
|---|---|---|---|
| F1 | residual | `loading=lazy` is set after `buildSelfHealingCover` sets `src`, so covers may load eagerly. | **Refuted by measurement** (`log-rtcheck-after.txt`, unique URL per book): an image 1,370 px below the fold had not been fetched until the page scrolled (it was a 404 cover, and it became its title only then; eager, it would have swapped at render). Chrome loads the rest because they sit inside its own lazy-load margin. No action. |
| F2 | residual | Select mode can move books the reader cannot see: picks survive a chip or search (only the case re-renders). | **Confirmed:** three "Have read" picks, then Reading → the bar says "3 selected" with 0 picked covers on screen; "Move to an arc…" would add all three. Hiding (S3) made a hidden pick possible. → **R-3.** |
| F3 | residual | `revealShelfPanel` reads a `.shelf-head` that no longer exists; the nav may cover the panel's top; the head scrolls away. | The nav is tucked and a tap at the panel's top hits the panel (§ 2.7). The scroll itself → **N-2**, Preston's eye under S5. |
| F4 | residual | The capture door keeps its 62 px `.cap-on-shelf` lift for a button that is gone. | At 390 the door is `display:none` (tab bar on); at 1360 it sits at its plain 24 px, no lift. Dead CSS and two stale comments → Separate tasks. |
| F5 | nit→residual | The chip focus ring and the picked outline are clipped by the phone scrollers. | **Confirmed for the chips:** the row is 44 px high with `overflow:auto` and no vertical padding; a focused chip's ring is cut top and bottom (`l4b3a-rt5-chip-focus-390.jpg`). The picked outline reads whole in `l4b3a-29-selectbar-390-after.jpg`. → **R-4.** |
| F6 | nit | The unstored default can flip against a tap on the already-pressed default (nothing is stored). | As designed (S7, nothing stored until a choice); recorded with R-5. |
| F7 | nit | Under a chip in Lenses the count still says "N lenses" while some lens bands vanish; "All 150" can sit over fewer covers in Lenses (books in no lens never show there). | True; S3 ruled for Categories' equality. → **R-6.** |
| F8 | nit | With "Have read" on, a newly saved book (Reading by default) is hidden with no feedback. | Reasoned; the filter persists in memory for the session. → **R-6.** |

Claims-outliving-code it found (comments the patch leaves false; the patch may not be edited): views.js 4804 ("Illumination
dims, never removes"), 5221–5223 ("illumination only — never removal"), 6027–6030 (the wall's masonry), 6128–6130 ("covers rebuild
lit/dimmed"), 5677–5679 and 5734–5735 (the old header and "See-all tile"), 6666 and 6685–6687 ("#shelf-editor-host … sits at
the END"; "relocating it … a candidate, not done"), 6903–6912 (the `.shelf-head` sticky-head rationale), 5157–5161 and
components.css 16333–16337 (the Add FAB) → Separate tasks. Items it could not fault: no `.shelf.sh3` rule reaches another surface;
the four tab-bar rules win on specificity (≈0,5,1 against 0,3,0–0,4,0) and stay out under `tabbar-off` (set only on `#deleted`)
and `l3-gated`; the stretched button's focus ring, name and tap order; no double push or lost book in the classifier; S7 makes the
blank Lenses view less reachable, not more; no ES3 token in the added lines (the one `class ` is the comment).

**praxis-reviewer (Sonnet, frontmatter-pinned): HOLD on one gate only — `docs/studio/builder.html` was mid-regeneration when
it looked; every other gate PASS.** Re-measured: the three staged blobs (bytes, md5, numstat) and the seven locked files — exact;
ES3 on the added lines (`class ` 1, the comment) and no hex in the added CSS; `tools/parse-check` on the staged views.js exit 0;
`git diff --cached --check` and `git diff --check` exit 0; i/lf w/crlf on the three; sw.js changed by the version line only. Call
sites: `sh3Row` ← `buildShelfBand` / `shelfBuildPile` ← `renderShelfCase` ← `renderShelf` (5144) ← the route table; `sh3Cover` ←
`sh3Row`; `sh3HasLens` ← `getShelfGrouping`; `sh3LensCount` ← `renderShelf` (4859). Spot-checked §§ 2.2, 2.3, 2.4, 2.5, 2.7, 2.9
against the logs — no claim contradicted (§§ 2.1 and 2.10 read from the logs' totals, not re-derived). The docs accurate; L4f's
"pushed 249cae1; phone check owed" claims no PASS. R-1 reachability confirmed. **The blocker cleared after it reported:**
`tools/studio-build` finished (exit 0, "warnings 0"; HEAD 249cae1, praxis-v3.337), `builder.html` 723,117 B (721,947 at HEAD),
ends `</html>`, carries the L4b-3a line twice ("BUILT at v3.337, local until pushed"); its diff is 3 lines. Note: the edit tool
wrote BOARD.md's working copy LF (`w/lf`); the blob is LF either way, so nothing that commits changes.

## Residual

- **R-1 (recon, confirmed in the rig) — the focused band view is still live and still drawn the old way.** "See on the shelf" on a
  lens page (views.js:27847), a category orb whose label is not a valid category (28417) and the band-name fallback (5697) open
  `openShelfFocusedBand`, which draws the old cavity shelf (spines, the shelf line, status dots) inside the redrawn Shelf, with
  "‹ back to the shelf" (`l4b3a-focused-see-on-shelf-{390,1360}-after.jpg`); it hides the new head and the case, not the editor
  host or the first-shelf offer. Back restores the bands. The prompt listed this view as orphaned; it is not. Its redraw (or a
  re-point of "See on the shelf" to the lens page) is a decision for Preston.
- **R-2 (copy is a contract) — the Notebook still offers "Carry on the desk"** and toasts "Carried on the desk" (views.js:19971,
  19989, 19996). After S2 the carried question is saved and shown nowhere in the app (only in the export), and its only clear button
  sat on the desk. The words, or a new home for the question, are Preston's call.
- **R-3 (red-team F2) — a pick hidden by a chip or a search still counts and still moves.**
- **R-4 (red-team F5) — on a phone the focused chip's ring is clipped** by the chip row's own scroller.
- **R-5 — the unstored default.** A reader who never chose follows `sh3HasLens()` each time: Lenses while a lens holds a shelved
  book, Categories otherwise; the view can change under them when their only such lens loses or gains its last shelved book, and a
  tap on the already-pressed default stores nothing. "See on the shelf" and the category-orb fallback store a choice (b).
- **R-6 (red-team F7, F8) — what the counts say under a filter.** In Lenses under a chip the head still counts every lens; "All N"
  counts the whole shelf while Lenses shows only books in a lens; a chip stays on for the session, so a book saved under "Have read"
  is hidden at once.
- **N-1** "Shelf" overruns its own box by 3.7 px at 320 (8.4 px clear of the dots). **N-2** the editor's reveal scroll (381 px at
  390). **N-3** Cancel on its own line in the Select bar. For Preston's eye.
- **N-4** In the Select bar at 390, Cancel is 19 px tall and "Move to an arc…" is 35 px tall (both under 44), measured by the
  review chat; older styling, reachable on phones for the first time in this build; a separate small task.

## Preston's ruling on the residuals (20 Nov 2026)

R-1 to R-6 and N-1 to N-3 are accepted as residuals and logged as separate tasks. **R-2** (the Notebook's "Carry on the desk")
needs his ruling before the Notebook build, L4b-3c. **The focused band view is NOT an orphan** and comes off the orphan list (it
is live through R-1; see "Not orphaned" below).

## Separate tasks

- **The residuals, as ruled:** R-1 to R-6, N-1 to N-4 above, each its own small task (R-2's ruling owed before L4b-3c).

- **The orphans (do not delete in this build; re-grep before any deletion — the CSS counts include look-alikes):**
  - js/views.js (staged lines): `buildShelfWheat` 5355 (0 callers) · `shelfWallColumns` 5670 (0 callers) · `renderShelfDesk` 5519
    (called by `applyShelfIllumination` 6133, returns at once) and the desk's "Reading" door 5560 · `renderDeskQuestion` 5579
    (callers only inside the desk) · `isMobileShelf` 5634 (callers 5549, dead, and 5739, short-circuited) · `buildShelfShelfline`'s
    phone branch and See-all tile 5744–5761 (the focused view always passes `focused:true`) · `shelfDensity` 6438 (no writer; read
    4794) · the value-chip path: `shelfFilter.value` (no writer but a reset, 23497), its branch 5226–5230, `shelfComputeValueCounts`
    5326 (still computed every render at 4832, unread) · `capUpdateCreateDoorPos`'s FAB measurement 26472–26479 ·
    `revealShelfPanel`'s `.shelf-head` lookup 6913 (dead at 249cae1 too) · `toggleShelfFilter` / `onShelfFilterRow*` 6531–6605
    (dead at 249cae1 too). **Not orphaned (off the orphan list by Preston's ruling):** `openShelfFocusedBand` /
    `closeShelfFocusedBand`, `buildCoverNode` and the cavity markup — live through R-1.
  - assets/components.css (staged lines, first..last match): `.horizon-strip` 12711..12960 · `.desk` 12755..16659 · `.shelf-slim-*`
    12730..12950 · `.shelf-inner` 12707..12947 · the Shelf's `.mode-seg` 12740..12951 · `.value-chips` / `.vchip` 12745..12951 · `.wall`
    12775..12782 · `.seeall-tile` 12861..12952 · `.pile-row` / `.pile-note` / `.pile-band` 12865..12873 · `.yumi-lens-row` 12919..12952 ·
    `.search-empty-line` 12751..12752 · `.shelf-search` / `.s-glyph` (the Shelf's) · `.shelf-add-primary` 12640–12645, 17179–17181,
    17790 · `.lx-band-lens` 17688–17690 · `.cap-create-door.cap-on-shelf` 16338 (a lift for nothing). **Still live:** `.cavity*`,
    `.focused-view`, `.focused-back` (R-1).
  - The stale comments listed under Stage 3.
- **Already logged, not this build:** the 760 px sideways scroll from the top navigation list (S-1; 861 against 760 here, in both
  builds); Empire of AI's cover; the Yumi flower over text at the right edge (at 390 the flower sits at 324,712 42 × 42 and may sit
  over "Open" on a band as the page scrolls — recorded, not fixed; 0 under it at scroll 0 in b60 Lenses); colour on coverless
  cards (held for Preston's phone); a blank Lenses view for a reader with no lenses before the yes (older than this build; S7 does
  not land such a reader on Lenses).
- **Noticed on the way (older):** You's "view these books on the shelf" (`_pfShelfTo`) sets `shelfFilter.category` / `.theme`,
  which the Shelf has never read, so it lands on the whole shelf.
- Agent docs: praxis-recon.md and praxis-reviewer.md still expect `lumen-amber.css` at 14,681 B (the canon is 11,953 B).

## Files changed

- js/views.js (+1,316 B, 207/219) · assets/components.css (+9,020 B, 76/0) · sw.js (v3.337, +0 B)
- docs/checkpoints/l4b-3a.md (this record) · docs/checkpoints/l4b-3a-shots/ (46 captures)
- BOARD.md · docs/Checklist and Roadmap/BUILD_STATE.md · docs/studio/sequence.md · docs/studio/builder.html (regenerated)

## Proposed commit

`L4b-3a — the Shelf redrawn: search, the Lenses | Categories switch, status chips, and each lens or category as a band of large covers — v3.337`

## Owed after the push

Preston's phone check of the Shelf against the Style Study (v12, "Blue sky, warm ground"), on the installed app after the "new
version ready — Reload" banner (CACHE_VERSION `praxis-v3.337`): the title row (Shelf · ••• · Add a book); a band — its header, the
mark, "Open", one door; the covers, a long word on a cover card; a row swiped sideways; the sheet (•••) and the Select bar standing
above the tab bar ("Tidy library", "Move to an arc…", "Cancel" each answer a tap); Add a book opening at the top; and, by eye,
R-1 ("See on the shelf" from a lens page), N-1 to N-3 and colour on coverless cards.
