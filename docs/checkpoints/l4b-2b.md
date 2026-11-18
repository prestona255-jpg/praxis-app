# L4b-2b — the category page (`#category/<label>`) — v3.331

17 Nov 2026 · Opus 5.5 executing an already-written, already-tested patch (the review chat's, on a clean clone of main at
096269a). Base: HEAD `096269a` (L4b-2a hotfix 1, v3.330) == origin/main. Ruling r96 (the Praxis Style Study's "a category"),
lane L4b-2 (`p2-eighteenth-sitting-rulings.md` §C), fifteenth r47. Preston's go-ahead included "run fix-red-team on this",
which lifted the agent bar for this round.

**Status: built and committed locally (not pushed).** fix-red-team: no BLOCK, no MAJOR. praxis-reviewer: CLEARED TO COMMIT
(re-checked after the R1 fold). Preston, 17 Nov: "Fold in R1 first … If everything still passes, commit … Do not push."

## What was built

A new route, `#category/<label>`: one Shelf category as a read-only page. The `<label>` is the category's own name,
URI-encoded (a category has no other id).

- **The head:** Back (to the room it was opened from), "Category", the category's name, one counts line: books · read
  (read + finished only) · notes · "in N lenses" (left off when no kept lens holds any of its books).
- **Books:** a grid of covers, two rows (three across on a phone, four from 1000px), then "+ N more", which shows the rest
  in place. A cover opens the book.
- **Lenses through these books:** one row per kept lens holding at least one of them, most shared first, then by name. The
  small line is that lens's own book count. A row opens the lens page, whose Back then reads "Category".
- **Notes on these books:** the four newest, "See all N" shows the rest in place. Never the Journal, never another reader's.
  A row opens the note.
- **Doors:** a category band's NAME on the Shelf (a lens band's name still opens its lens page; any other band, and a key that
  is not a category, keeps the focused view), and a category orb in the You sky (Home's sky has no category orbs).
- **Writes:** nothing of its own (no new field, no storage key, no model call). Like every lens surface it calls
  `ensureLensLooks`, which stores a kept lens's look once if it has none (and saves only once this session's themes load has
  succeeded). The route branch calls `saveState()` as its sibling routes do; no data changes.

views.js: `tabbarTabFor` gains the category line · renderRoute bookkeeping (`cpFrom` set from a room, kept when coming back
from a lens / book / note; `cpSt.fresh` on arrival) · `umberGroundDark` gains `category` · the top nav treats `category` as a
Shelf surface · the `category` route branch (bare `#category` → `location.replace('#books')`) · two module vars `cpFrom` /
`cpSt` · `lxAfterLensWrite` re-renders on `#category` · the band-name door in `buildShelfBandHeader` · `lxOrbOpen`'s cat
branch · new functions `cpRoomRoute`, `cpFromLabel`, `cpHash`, `cpLabelOf`, `cpBooks`, `cpLenses`, `cpBar`,
`renderCategoryPage`. components.css: one block "L4b-2b THE CATEGORY PAGE", every rule under `.lx.ol.cp`, no hex.
sw.js: `praxis-v3.330` → `praxis-v3.331`.

### Three folds on Preston's rulings (departures from the patch)

1. **The You sky's two category-orb phrases** ("Yes, fix the copy"; wording approved as proposed):
   ```
   -        aria: ... + ' on your shelf. Opens the shelf, filtered.', src: { kind: 'cat', label: order[i] } });
   +        aria: ... + ' on your shelf. Opens the category.', src: { kind: 'cat', label: order[i] } });
   -    hint.textContent = ... ' around your flower · sized by books · tap one to open the shelf there';
   +    hint.textContent = ... ' around your flower · sized by books · tap one to open its page';
   ```
2. **`ensureLensLooks(uid)` in `renderCategoryPage`** (the recon gate's MINOR 1), the same line `renderOpenLens` uses, after
   the signed-out return and before the books are read; and the header comment's "writes nothing" sentence adjusted to say so:
   ```
   +  if (typeof ensureLensLooks === 'function') { ensureLensLooks(uid); }   // as renderOpenLens: a lens mark is never blank on a cold load
   -// It WRITES NOTHING: no state change, no storage key, no model call. The id in the
   -// hash is the category's own label, URI-encoded. Reached from a category band's
   +// It writes nothing of its own: no new field, no storage key, no model call; like
   +// every lens surface it stores a kept lens's look once, if that lens has none yet
   +// (ensureLensLooks). The id in the hash is the category's own label, URI-encoded. Reached from a category band's
   ```
3. **The cover fallback** (red-team R1; Preston: "Fold in R1 first"), one line before `cv.appendChild(im);`:
   ```
   +        im.onerror = function () { if (im.parentNode) { cv.removeChild(im); } cv.appendChild(lxEl('b', '', b.title || '')); cv.appendChild(lxEl('small', '', b.author || '')); };   // R1: a cover that fails shows its title, never a blank card
   ```

## Stage 0 — pre-flight (read-only): PASS

- Ground truth: HEAD `096269a`, `git ls-remote` origin main `096269a`, CACHE_VERSION `praxis-v3.330`, 0 dirty tracked files,
  hook ARMED, FIX-PROTOCOL v1.3, 7 agents. All ten protocol docs found.
- Before (LF blobs): views.js 1,393,985 `728c3b39…` · components.css 946,306 `b363292f…` · sw.js 6,894 `e3db767c…` — MATCH.
- The patch: 327 lines, 18,806 B, md5 `8ab23991139f09cd88f2dc9e4c74dca2`, CR 0, no BOM — MATCH.
- Anchors: nine found once at the stated lines. `parts[0] === 'books') {` occurs 6× bare (:645, 851, 7130, 7168, 7579, 7609);
  the hunk's preceding line makes it unique at :645.
- Dry apply: `git apply --check` passes (worktree and `--cached`); after-md5s `7e3be0bc…` / `651142b7…` / `541fd172…` — MATCH.
- v3.331 is reserved for this build on every line that states it; nothing still says v3.330 for it.
- Rulings: r47 (fifteenth) added an "Ask Yumi about these books" button and "See all" as a door; both are superseded by later
  rulings (the Style Study's drawing, r96, has no Yumi button; Preston's 17 Nov ruling 4 names only the band heading and the orb).

## §1#8 recon gate (fix-red-team, Sonnet): no BLOCK, no MAJOR

MINOR 1 `ensureLensLooks` not called (**folded in**, above). MINOR 2 the "+ N more" cut is read once from `matchMedia`.
NITs: desktop nav vs phone tab; the CSS comment cites this file; a hand-typed `#category/Uncategorized` counts only books
cached as Uncategorized; rig script `l4-sweep4.js:76` asserts the old orb behaviour.

## Stage 1 — apply: PASS

| File (LF, staged form) | Expected | Patch alone | Final (with both folds) |
|---|---|---|---|
| js/views.js | 1,404,097 `7e3be0bc…` | 1,404,097 `7e3be0bc86a399c2f7f7cf8c08496fc1` | **1,404,577 (+480) `372c16f0c7d2313bca52e71a77e60f1a`** |
| assets/components.css | 948,638 `651142b7…` | 948,638 `651142b7dda2620387aa3d078ceeb7c0` | unchanged |
| sw.js | 6,894 `541fd172…` | 6,894 `541fd1723547eb56499f5b1abd89487b` | unchanged |

The +480 B: the orb phrases −14, the `ensureLensLooks` line +135, the comment +117 (1,404,335 `ab90c1d6…` at that point),
then the R1 line +242. numstat (final): views.js 209 / 6 · components.css 25 / 0 · sw.js 1 / 1. EOL `i/lf w/crlf` on all
three; worktree CR count = line count (views.js 28,668).
Parse: all 19 `js/*.js` and sw.js `PARSE OK`, exit 0; a broken copy fails (exit 1). Added lines: `const ` / `let ` / `=>` /
`class ` / backtick 0, hex 0, `ls(` / `sv(` / localStorage / Firestore 0. Unchanged, byte for byte: state.js `b8cdafb5…`
220,174, yumi-brain `5241349a`, yumi-ui `ab4d4160`, app `76112a87`, hand.js `fd51ca7e`, theme.css `571e0ccc`,
lumen-amber `631bc2aa` 11,953, marks.js `772886c0` 10,255, index.html `addda80d`, manifest.json `36c362d9`.

## Stage 2 — test and look: PASS

### 2.1 The existing suites (cscript, all exit 0)

lens-eval **68/68** · lens-data **101/101** · export **58/58** · delete **58/58** · ceiling-core **36/36** · fx1c-sim
**60/60** · L4b-1 hotfix **46/46** · L4b-2a unit **71/71** · L4b-2a hotfix 1 unit **74/74**.

The first run stopped here: the two L4b-2a harnesses crashed (their sealed scopes did not know the new names) and, with the
names supplied, each failed exactly one case — the case pinning the old behaviour. Per the prompt the three files were
reverted (before-md5s confirmed), and Preston ruled: "update the two old harnesses and continue … change ONLY the two cases".
Their diff: each harness gains the missing names in its scope; U5's "from category … falls through → notebook" now asserts
"a lens opened from a category opened from You → you"; H4's "category band → openShelfFocusedBand" now asserts
"→ #category/History". Every other case is byte-identical. The hotfix 1 harness's header comment for H4 was updated to match.
Both now refuse to run against 096269a (exit 2), because they read the category page's names.

### 2.2 New unit harness — `docs/checkpoints/l4b-2b-shots/unit-harness` — **120/120**, exit 0

(114/114 before the R1 fold; C13 adds six cases for a cover whose image fails: the image is removed and the title and author
drawn as text, a cover that loads keeps its image only, no markup, no write. Without the R1 line it fails 118/120, exit 1.
Found on the way: **cscript exits 0 on a JScript runtime error**, so a harness that throws reads as a pass by exit code —
the call in C13 is guarded so a missing fallback fails as a case, not as a throw. Separate task S-1.)

Extracts `cpRoomRoute` … `renderCategoryPage`, the route branch, `tabbarTabFor`, renderRoute's bookkeeping, `olRoomRoute` …
`olSect`, the `lx*` helpers, `notebookRegisterLabel`, the band-name handler and `lxOrbOpen` (views.js), and `SHELF_CATEGORIES`
… `isValidCategoryLabel`, `normalizeStatus`, `classifyBookLocal`, `lensKeptThemes` (state.js), by text from the live bytes,
and runs them against a small fake DOM. Against 096269a it refuses to load (exit 2). It can fail: four mutants each fail it
(no `ensureLensLooks` → 112/114; the cut off by one → 108/114; a lens name through innerHTML → 111/114; "read" counting every
status → 112/114). C1 routes / labels / every category round-trips through the hash; "&", "/", "%", space encode with no "/"
and decode back; unknown, script-bearing and malformed labels refused · C2 the counts line on read / finished / reading /
want / will-read / no status ("6 books · 2 read · 3 notes · in 3 lenses"); lens rows Alpha (2) · Beta (2) · Gamma (1), own
book counts, another reader's and a none-shared lens never listed; notes newest first, Journal / other reader / other
category never; a stale id and a duplicate id; D5 (no lens → no "in N lenses", no section) · C3 six → 6; seven → 5 + "+ 2
more"; at 1000+ eight → 8, twelve → 7 + "+ 5 more" · C4 tile and "See all" open in place and survive a same-route re-render
· C5 reset on arrival from another route, after a lens, after another category · C6 HTML in a title, author, lens name and
note body shown as text; no innerHTML but the Back chevron · C7 unknown / script-bearing / malformed / spaces-only label and a
category with none of mine → "No books here yet." + "See your shelf" (→ #books); D7 Uncategorized gets a page · C8 bare
#category → `location.replace('#books')`, nothing rendered; a label renders once and clears the current ids · C9 Back + tab
from the Shelf, You, Home, Search; a lens from the page says "Category" and keeps the category's tab; Back from a lens, a book,
a note keeps the origin; page → lens → book → lens → page, no loop · C10 band name: category → page, "&" encoded, a non-category
key → focused view, a kept lens → its page, a gone lens → focused view, the Reading band → focused view; orb: category → page,
a non-category label → the filtered shelf, book and lens unchanged; the two orb phrases present, the old ones gone · C11 signed
out: the Shelf's own words (2 call sites, identical arguments), Back present, no `ensureLensLooks` · C12 the four data maps
byte-identical after every step, no `ls` / `sv` call, `ensureLensLooks` once per signed-in render.

### 2.3 Captures — `docs/checkpoints/l4b-2b-shots/`, 34 JPGs, 3.7 MB, all taken fresh 17 Nov 2026 against the applied bytes

Rig: `.claude/rig/serve.ps1` on localhost:8861 (served `sw.js` reads `praxis-v3.331`); headless Chrome over CDP, fresh profile
(`.claude/rig/captures/l4b2b/l4b2b-shots.ps1`, untracked); the l4 fixture + `l4b1-rig.js` (signed-out d0tester stub,
transitions off, proxy stubbed) + **`.claude/rig/captures/l4b2b/l4b2b-rig.js`** (untracked): "Psychology & Mind" with 12
books (read 4, finished 1, reading 4, want 1, will-read 1, none 1), three kept lenses through them (sharing 5, 3, 1) and six
notes (+ a Journal entry that must never show); "Genre Fiction" with three books, no lens, no notes. Every capture is gated on
a DOM readout printed beside it.

| State | 390 (dpr 2) | 1360 (dpr 1) | Readout (both widths, both moods) |
|---|---|---|---|
| `cat12` | 780×3322 px, full page | 1360×1097 px, full page | Back "Shelf"; "12 books · 5 read · 6 notes · in 3 lenses"; 5 covers + "+ 7 more" (390) / 7 + "+ 5 more" (1360); lenses Attention as care (6 books) · Minds in rooms (3 books) · The weight of rest (3 books); 4 notes, "See all 6"; Journal not shown; tab shelf |
| `cat12-open` | 780×4460 px, full page | 1360×1284 px, full page | 12 covers, no tile; 6 notes, no link |
| `cat3` | 780×1688 px, full page | 1360×900 px, full page | "3 books · 1 read · 0 notes"; 3 covers; no lens section; "No notes on these books yet…" |
| `empty` (`#category/Nope`) | 780×1688 px, full page | 1360×900 px, full page | "No books here yet." + "See your shelf" |
| `signed-out` | 780×1688 px, full page | 1360×900 px, full page | "Your shelf is private" (the Shelf's own words), Sign in filled |
| `shelf` | 780×1688 px, viewport at the band | 1360×900 px, viewport at the band | the Shelf in Categories, the "Psychology & Mind" band (390 keeps its "See all 12" tile) |
| `lens-from-cat` | 780×3698 px, full page | 1360×1247 px, full page | `#lens/th_cp_a`, its Back "Category", tab shelf |

Plus `end-390-day.jpg` / `end-390-night.jpg` (780×1688 px viewport frames scrolled to the end WITH the tab bar), and, after
the R1 fold, `cover-fail-<390|1360>-<day|night>.jpg` (780×3322 / 1360×1097 px, full page): book 1's cover URL 404s → "The
Body Keeps the Score / Bessel van der Kolk" drawn as text; book 3's cover loads → image 180×180; 0 errors. 34 JPGs in all. Full-page
frames hide the position:fixed chrome below the nav (tab bar, flower, Capture +), as at L4b-2a, because a full-page capture
paints it at the viewport line mid-page. Console errors: 0.

### 2.4 Measurements

| Measure | 390 | 1360 |
|---|---|---|
| sideways scroll (`scrollWidth`) | 390 = 390 on all five states, Day and Night | 1360 = 1360 on all five |
| controls ≥ 44 px both ways | yes on every state (15 / 22 / 4 / 2 controls) except the signed-out "Sign in" `.btn-primary` 80×38 — `buildSignedOutPrompt`'s own size, the same on `#books` and `#lens` (l4b-2a ledger L-11), not from this patch | same |
| anything past the viewport | none | none |
| last row clears the tab bar | last note row bottom 551, tab bar top 778: clears by 227 (Day and Night, all notes open) | no tab bar at this width |

Contrast, measured on the rendered pixels (each element's text hidden, its own text box captured, the worst ratio of its colour
against every ground pixel). Floors: 4.5:1, 3:1 for text ≥ 24px:

| Element | Day (390 / 1360) | Night (390 / 1360) |
|---|---|---|
| kicker "Category" (`--ink-2`, 13.5px) | 6.53 / 6.53 | 9.67 / 9.67 |
| the name (`--ink`, 36px) | 15.63 / 15.63 | 16.49 / 16.49 |
| the counts line (`--ink-2`, 15px) | 6.53 / 6.53 | 9.67 / 9.67 |
| "+ N more" (`--gold-ink` on `--card-1`) | 7.78 / 7.78 | 8.16 / 8.16 |
| "See all N" (`--gold-ink`, 16px) | 7.33 / 7.33 | 9.87 / 9.87 |

(The first pass mis-measured the tile and "See all": the rig clipped in viewport coordinates after a scroll. Fixed in the rig and
re-measured; the table is the re-measure.)

Writes, in the rig (the four data maps + every localStorage key and value, before arriving and after each step): arrive,
"+ N more", "See all", a re-render (kept open: 12 covers, 6 notes), the 3-book category, the empty state, signed out — **all
identical**. The fold: a kept lens with `look: null` reached cold → with `ensureLensLooks` stubbed off its mark is EMPTY; with
the fold its look is made (`#E67E3A`) and the mark draws (svg, 14,920 chars); `themesLoadOk` is false in the rig, so the look
was kept in memory only.

### 2.5 The walk (390, Night, real hit-tested CDP clicks — `elementFromPoint` on the target, then press + release)

| # | Walk | Result | Evidence |
|---|---|---|---|
| 1 | Shelf → a category's name → the page → a cover → Back | **PASS** | band name → `#category/Psychology%20%26%20Mind`, 12 books, Back "Shelf", tab shelf; cover → `#book/bk_cp_01`; browser Back → the page, same counts, Back "Shelf" |
| 2 | the page → a lens row → Open Lens → Back → the page → Back → Shelf | **PASS** | row → `#lens/th_cp_a`, its Back "Category" (aria "Back to Category"), tab shelf; its Back → the page, Back still "Shelf"; the page's Back → `#books`, tab shelf |
| 3 | You → a category orb → the page → Back → You | **PASS** | Categories mode: 12 orbs; the orb's label "Psychology & Mind. 12 books on your shelf. Opens the category."; the hint "… tap one to open its page"; orb → the page, Back "You", tab you; Back → `#profile`, tab you |
| 4 | the page → a note row → Back | **PASS** | row → `#note/nb_cp_6` rendered; browser Back → the page |
| 5 | the page → the Shelf tab | **PASS** | → `#books`, tab shelf |
| 6 | reload on the page | **PASS, with the rig's limit** | after a reload the rig's stub user does not survive (the app's own auth runs: uid null), so the page shows its signed-out state ("Your shelf is private"), 0 errors — as `#lens/<id>` does in the same rig ("Your lenses are private"). On a device the page re-renders once the library merges: `loadBooksFromFirestore` calls `renderRoute()` (integrations.js :225) |

Console errors through the walk: 0.

**What the rig cannot show.** It is signed out with a fixture: no real auth, no Firestore, no real shelf. Preston's own shelf
(its size, its real covers, his notes and lenses), the reload with a real sign-in, iOS Safari's handling of `%26` / `%20` in
the hash, and the phone's notch are owed to his phone. `ensureLensLooks`'s save path (when `themesLoadOk`) is not exercised here.

## Stage 3 — the red-team and the reviewer

### fix-red-team (Sonnet), on the frozen built tree: no BLOCK, no MAJOR

It re-ran the three harnesses (71/71, 74/74, 114/114) and parse-check. Its verdicts on the questions asked, in short:

1. innerHTML from a book, note, lens name or the hash — **safe**: every string goes through `lxEl` (`textContent`) or
   `aria-label`; the only innerHTML is the fixed Back chevron; the head shows the VALIDATED label, never the raw hash.
2. a late callback painting over another route — **safe**: `rerender()` is synchronous and hash-gated; nothing async.
3. a Back loop between the page, a lens and a book — **none**: lens, book and note are never rooms for the page.
4. "&", "/", "%", space through the hash — **no defect found**: the 18 labels hold only space and "&" (`%20`, `%26`);
   `raw` and the re-render check read the same engine's `location.hash`. **Unproven on iOS Safari** (finding 7).
5. the Shelf band's way to its full view — **yes on phones** (the band's "See all N" tile still opens the focused view);
   on desktop a band already shows every book, but the focused view is no longer reachable for category bands (finding 3).
6. Select mode — **unchanged** (the door sits inside the not-selecting branch).
7. a category orb on Home vs You — **identical**: category orbs exist only in the You sky.
8. anything written or sent — **none of its own**: `ensureLensLooks` (fails closed on `themesLoadOk`) and the route's
   sibling `saveState()`; no `ls` / `sv`, no proxy or model call.
9. CSS — **scoped and token-only**; the `.lx.ol button` reset loses to the page's own cover / tile rules; "See your shelf" and
   "Sign in" keep their fill and border (the L4b-2a F1 lines).
10. tab / nav — the tab is right on arrival with no flash; desktop nav and phone tab can disagree (finding 2).
11. the two edited harnesses — **only the intended cases changed**.

| # | Sev | Finding | Status |
|---|---|---|---|
| R1 | MINOR | A cover whose `coverUrl` fails shows a **blank card with no title** (the page has no onerror and ignores `coverCandidates`; the Shelf's `buildCoverNode` handles both) | **Reproduced in the rig** (a 404 cover → img 0×0, no title), then **FIXED in this commit on Preston's ruling** ("Fold in R1 first"; harness C13, the `cover-fail-*` captures): before `cv.appendChild(im);` add `im.onerror = function () { if (im.parentNode) { cv.removeChild(im); } cv.appendChild(lxEl('b', '', b.title \|\| '')); cv.appendChild(lxEl('small', '', b.author \|\| '')); };` → the 404 cover shows its title and author, a good cover still shows its image, 0 errors. A book with only `coverCandidates` already gets a readable text card; the candidates themselves are not tried (ledger L-1) |
| R2 | MINOR | Desktop nav lights Shelf for every category while the phone tab follows the origin (from a You orb, Back says You, nav says Shelf). Open Lens has the same split | ledger L-2 |
| R3 | MINOR | On desktop, a category band's focused view is no longer reachable (the name opens the page; a band shows every book). `lxOpenShelfCategory` is now only the fallback for a non-category orb label, which `classifyBookLocal` never produces | ledger L-3 |
| R4 | MINOR | A book with no title, author or cover renders a cover button with an empty `aria-label` and no text | ledger L-4 |
| R5 | MINOR | The "+ N more" cut is fixed at render from `matchMedia`; crossing 1000px leaves 5 covers + the tile in four columns until the next render (also the recon gate's MINOR 2) | ledger L-5 |
| R6 | MINOR | A cold load before the cloud library arrives could show "No books here yet." | **answered**: the books merge calls `renderRoute()` (integrations.js :225), and the same-route re-render keeps the page state. Not a defect |
| R7 | MINOR | Nothing proves the hash round trip on a real iOS Safari | owed to Preston's phone (the click-path below opens `Psychology & Mind`-style labels with "&") |
| R8 | NIT | The comment above `buildShelfBandHeader` still says the label opens the focused view "on ALL widths" (false since hotfix 1) | ledger L-6 |
| R9 | NIT | The `nRead` test is redundant (`normalizeStatus(x)==='read'` already means read or finished) | ledger L-7 |
| R10 | NIT | "writes nothing of its own" — the route's `saveState()` is the sibling pattern | none |

None is a BLOCK (data loss, consent breach, crash, painting over another route). The red-team changed no line itself; R1's fix
was folded in afterwards on Preston's ruling.

### praxis-reviewer (Sonnet), the commit gate

**CLEARED TO COMMIT — "no blocking gates".** What it measured itself:

- The three numbers, and sw.js's one-line diff.
- The patch re-applied onto LF copies of the HEAD blobs reproduces `7e3be0bc…`. The final views.js differs from it in exactly
  four hunks: the comment, the `ensureLensLooks` line, and the two orb strings.
- The ten must-not-change files show no diff.
- Parse is OK on all 19 js files and sw.js.
- The added lines contain no const / let / `=>` / class / backtick, no hex, and no `ls` / `sv` / storage call.
- EOL is `i/lf w/crlf` on the code files; `git diff --check` is clean; `core.hooksPath` is `hooks`.
- All ten harnesses pass at the expected counts, exit 0.
- In the two L4b-2a harnesses, only the scope additions and one case each changed (plus the H4 header comment).
- The docs agree with each other and with the code, and builder.html carries the L4b-2b lines.
- There are 30 JPGs, and the tracked changes are exactly the ten intended files.

Noted, not blocking: one `rgba(0,0,0,…)` shadow on `.cp-cv` repeats an existing shadow string. Not re-run by it: the rig
captures, the 390 / 1360 measurements and the walk (this record's evidence), and the Builder's currency beyond its L4b-2b lines.
This paragraph was added to this file after the review.

## For Preston's ruling

- **The orb wording** — APPROVED (17 Nov): "Opens the category." / "tap one to open its page".
- **D1** The empty state's words, new copy: "No books here yet." with a "See your shelf" button — for a category with no
  books of the reader's and for an unknown label.
- **D2** "+ N more" and "See all N" open in place on the page; neither leaves for the Shelf or the Notebook.
- **D3** A lens row's small line is that lens's own book count ("4 books"), as drawn; not how many it shares with the category.
- **D4** "read" in the counts line counts the statuses read and finished only.
- **D5** The "in N lenses" part is left off when no kept lens holds any of the books, and the "Lenses through these books"
  section is left out with it.
- **D6** Signed out, the page shows the Shelf's own existing signed-out words.
- **D7** Uncategorized is a category and gets a page like any other — but no door leads there (the Shelf puts those books in
  its pile, not a named band; the You sky skips Uncategorized), so it opens only from a typed address.
- **R1** the cover fallback — RULED (17 Nov): folded in.

## Ledger (recorded, not fixed here)

- **L-1** (R1) `coverCandidates` are not tried on this page (the Shelf's `buildCoverNode` tries them); a book with only
  candidates shows its text card. The blank-card half of R1 is fixed in this commit.
- **L-2** (R2) desktop nav says Shelf on every category page; the phone tab follows the origin.
- **L-3** (R3) desktop has no way to a category band's focused view; `lxOpenShelfCategory` is effectively a dead fallback.
- **L-4** (R4) a book with no title, author or cover: an empty cover button with an empty label.
- **L-5** (R5) the "+ N more" cut does not follow a resize across 1000px.
- **L-6** (R8) the stale "on ALL widths" comment above `buildShelfBandHeader`.
- **L-7** (R9) the redundant `nRead` clause.
- **L-8** Two differences from the Style Study drawing, kept on Preston's ruling ("Keep four covers across on desktop and the
  head on the plain page"): the drawing has **five** covers across at 1360, the page has **four** from 1000px; the drawing sets
  the head on the warm sand block (`.bhead`, `--field`), the page puts it on the plain page (the live theme has no plain
  `--field` token).
- **L-9** A hand-typed `#category/Uncategorized` counts only books cached as Uncategorized, not the pile's unclassified books.
- **L-10** The untracked rig script `.claude/rig/captures/l4-sweep4.js:76` asserts the old orb behaviour ("category orb → the
  Shelf, filtered"); update it if it is re-run.
- **L-11** (pre-existing) `buildSignedOutPrompt`'s "Sign in" is 80×38 — under 44 (l4b-2a L-11).
- **L-12** The two L4b-2a harnesses now refuse to run against 096269a (they read the category page's names).

## Separate tasks (pre-existing, not this build's)

- **S-1** cscript exits 0 on a JScript runtime error, so any harness that throws mid-run reports success by exit code (seen
  here: the two L4b-2a harnesses crashed against the new bytes and still exited 0). Each harness should wrap its body and
  `WScript.Quit(1)` on an exception, or the runners should require the "N/N passed" line.
- **S-2** `buildSignedOutPrompt`'s "Sign in" is 80×38, under 44 (l4b-2a L-11).

## Owed after the push

On Preston's phone at v3.331: Shelf, switch to Categories, tap a category's name: its page should open with the right book
count. Tap "+ N more" and "See all". Tap a lens row, then Back. Tap a note row, then Back. From You, switch the sky to
Categories and tap an orb. Say PASS, or name what is wrong. (This machine cannot reach the live origin; confirm v3.331 on the
About version line or `#diag` first.)
