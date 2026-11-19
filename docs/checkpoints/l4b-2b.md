# L4b-2b — the category page (`#category/<label>`) — v3.331

17 Nov 2026 · Opus 5.5 executing an already-written, already-tested patch (the review chat's, on a clean clone of main at
096269a). Base: HEAD `096269a` (L4b-2a hotfix 1, v3.330) == origin/main. Ruling r96 (the Praxis Style Study's "a category"),
lane L4b-2 (`p2-eighteenth-sitting-rulings.md` §C), fifteenth r47. Preston's go-ahead included "run fix-red-team on this",
which lifted the agent bar for this round.

**Status: pushed at `84d0c64` (v3.331); Preston's phone check PASS on every step, 17 Nov (Hotfix 1's R1, below).** Built and committed locally first: fix-red-team: no BLOCK, no MAJOR. praxis-reviewer: CLEARED TO COMMIT
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

## Hotfix 1, 17 Nov 2026 (the category names under the You sky, v3.332)

18 Nov 2026 · Opus 5.5 executing the review chat's written patch on main at `84d0c64` (v3.331) == origin/main, plus two
lines on Preston's rulings (R6, and the ≥1200 un-cap). Preston's go-ahead included "run fix-red-team on this".
**Status: pushed at `3ecdc38` (v3.332); Preston's phone check PASS, 18 Nov (Hotfix 2's R1, below).** fix-red-team: no BLOCK, no MAJOR (3 MINOR, 5 NIT, 1 residual). praxis-reviewer: CLEARED WITH NOTES.

### Rulings, worded as given

- **R1** My phone check of L4b-2b at v3.331 is a PASS on every step. One finding, older than that build: in the You sky's
  Categories mode only one of my 17 category orbs shows its name on a phone, so I cannot tell which category I am tapping.
- **R2** Under the You sky, in Categories mode only, a switch with two choices: "List" and "By the orbs". List is the default.
- **R3** List: every category in the sky, in the sky's own order, each row carrying that category's own mark, its name and its
  book count. A row opens the category's page.
- **R4** By the orbs: every category orb may show its name, small. The sky's own rule still hides a name that would run over
  another orb or another name, so on a phone about half show at a time and they change as the sky turns. I have seen this and
  accept it. The sky's own "names" setting, when off, still hides them all.
- **R5** The choice is remembered on this device.
- **R6** (18 Nov 2026) Account delete also clears praxis_you_catnames from this device, the same way it clears the sky's own
  keys. Sign-out and export stay as they are.
- **The ≥1200 un-cap** (18 Nov 2026, Preston: "Yes, fold it in"): the rig found the list clipped at 1360 (Stage 2.4); the one
  line `.pf-sky-host.lx-you-host:has(> .lx-catnames:not([hidden])){max-height:none}` is folded in before the block's end marker.

### What was built

- `js/views.js` (+46): `lxCatNamesMode()` reads `praxis_you_catnames` ('orbs', else 'list'); `lxFillCatNames(rec, items)`
  builds `rec.below`, a `div.lx.lx-catnames` — hidden (and `lx-orbnames` removed from the sky host) unless Categories mode has
  categories; else the switch (`role=group`, "Where the category names show", two `aria-pressed` buttons) and, in List mode,
  one button row per sky item in `rec.S.items` order: `lxMark(look)`, the name, `lxPlural(books, 'book')`, a chevron, the orb's
  own `aria-label`; a row calls `lxOrbOpen(it.src)`, the door an orb calls. A switch press stores the choice (only if it
  changes), refills, and re-lays the sky (`sig=''`, `build()`). Called from `lxFillYouSky` (Lenses → null; Categories → its
  items; Marks → null); `renderProfilePage` mounts `lxYou.below` after the sky host.
- `assets/components.css` (+20): the block "L4b-2b HOTFIX 1" — every rule under `.lx.lx-catnames`, plus
  `.sky.lx-orbnames .field.many:not(.nonames) .orb .l` / `.tight` (names shown, 11px / 13px line, max 96px) and the un-cap line.
  Tokens only, no hex.
- `js/integrations.js` (1/1, R6): `'praxis_you_catnames'` joins `ACCOUNT_GLOBAL_KEYS` beside the sky's keys.
- `sw.js`: `praxis-v3.331` → `praxis-v3.332`.

### Stage 0 — pre-flight: PASS (after one STOP)

The prompt's pasted diff arrived mangled (the `+` prefixes and `*` characters lost in the paste): STOPPED, no hand repair. The
file `Downloads\L4B-2B-HF1.diff`: 111 lines, 6,273 B, md5 `106217a7ca780f07881fc584b2d45df4`, CR 0, no BOM — MATCH.
HEAD `84d0c64` == origin/main, CACHE_VERSION v3.331, tracked tree clean, hook ARMED, FIX-PROTOCOL v1.3, 7 agents, all ten
protocol docs found. Before-numbers MATCH (below). Anchors once each: views.js :23926 / :28525 / :28585, components.css :17952,
integrations.js :1521. `git apply --check` passes; scratch after-md5s MATCH. v3.332 and every new name: 0 hits at HEAD.
Export reads no device preference; sign-out clears only the user; account delete clears `ACCOUNT_GLOBAL_KEYS`, where the sky's
keys were and the new key was not → R6. Another worktree, `praxis-sky-perf` (sky-perf-lane at 84d0c64), holds uncommitted
edits to `js/hand.js` and a comment in `js/views.js` (:28349); left untouched (separate task H-S3).
(This machine's system gitconfig sets `core.autocrlf=true`, so `git apply` OUTSIDE a repo writes CRLF; the scratch dry apply
needs `-c core.autocrlf=false` to reproduce the LF md5s.)

### Stage 1 — apply: PASS

| file (LF, staged blob) | before (84d0c64) | the patch alone (expected) | final (with the un-cap) | numstat |
|---|---|---|---|---|
| js/views.js | 1,404,577 `372c16f0…` | 1,406,872 `5b17578bd5c5cc0cd1a3470bde22265f` | same | 46 / 0 |
| assets/components.css | 948,638 `651142b7…` | 950,832 `df6ed0296defc44ab793eb91fa05baa3` | **950,908 (+76) `7311ec5b0244470fad63befaffab8911`** | 20 / 0 |
| sw.js | 6,894 `541fd172…` | 6,894 `902e8692427e01b14985e1322349ea2e` | same | 1 / 1 |
| js/integrations.js | 221,755 `ce40d6e0…` | 221,778 `2d86b8593f83cc5ad2cd679a6c02e757` (R6) | same | 1 / 1 |

EOL `i/lf w/crlf` on all four. Parse: all 19 `js/*.js`, sw.js and assets/marks.js PARSE OK. Added lines (68): `const ` /
`let ` / `=>` / `class ` / backtick 0, hex 0. Unchanged: hand.js `fd51ca7e`, state.js `b8cdafb5`, theme.css `571e0ccc`,
lumen-amber `631bc2aa`, marks.js `772886c0`.

### Stage 2 — test and look: PASS (after one FAIL, fixed on Preston's ruling)

**2.1 suites** (each must print its own total — S-1): lens-eval 68/68 · lens-data 101/101 · export 58/58 · delete 58/58 (no
case counts `ACCOUNT_GLOBAL_KEYS`) · ceiling-core 36/36 · fx1c-sim 60/60 · L4b-1 hotfix 46/46 · L4b-2a unit 71/71 · L4b-2a
hotfix 1 74/74 · L4b-2b unit 120/120. Re-run after the un-cap: identical.

**2.2 `docs/checkpoints/l4b-2b-shots/hotfix1-unit-harness` — 74/74**, exit 0; against 84d0c64 it refuses (exit 2). It extracts
`lxEl`…`lxMark`, `cpHash`, `lxOrbOpen`, `lxFillYouSky`…`lxFillCatNames`, `lxYouSky` and the mount block of `renderProfilePage`
(views.js), `SHELF_CATEGORIES`…`isValidCategoryLabel` and `classifyBookLocal` (state.js), and `ACCOUNT_GLOBAL_KEYS`,
`accountLocalKeysFor`, `wipeAccountLocal` and `signOut` (integrations.js; `.catch(` neutralized as tools/parse-check does) by
text from the live bytes. H1 hidden in Lenses, in Marks, and with no categories · H2 the switch, "List" pressed by default ·
H3 17 rows in `rec.S.items` order, each with its own drawn mark, name, "N books" / "1 book", chevron and the orb's aria-label ·
H4 a row calls `lxOrbOpen` with the orb's own src object; "Theory & Philosophy" → `#category/Theory%20%26%20Philosophy` · H5
"By the orbs" stores 'orbs', adds `lx-orbnames`, removes the list, one build after `sig=''`; "List" reverses it · H6 the
pressed choice writes and builds nothing · H7 the stored choice read on the next render; 'banana' and `true` → list · H8
leaving Categories removes `lx-orbnames` · H9 a name carrying HTML shown as text · H10 three re-renders → one box in the live
host, none in the old, one listener per button, `rec.below` reused; the visitor preview mounts nothing · H11 no key but
`praxis_you_catnames` written · H12 R6: the key once in `ACCOUNT_GLOBAL_KEYS`; the account-delete wipe removes it (and another
reader's uid key stays); sign-out leaves it. It can fail — five one-line mutants: no pressed-guard 71/74 · the key out of the
list 72/74 · the name through innerHTML 68/74 · `lx-orbnames` kept on leaving 72/74 · no `sig` reset 73/74.

**2.3 captures** — `docs/checkpoints/l4b-2b-shots/hotfix1-<state>-<390|1360>-<night|day>.jpg`, states `cats-list`, `cats-orbs`,
`lenses`, `marks`, `orbs-nonames`: 20 JPGs (≈15 MB; the You page is ~8,000 css px tall at 390), every one a FULL FRAME (390 →
780 px wide at dpr 2, e.g. 780×16180; 1360 → 1360 px wide at dpr 1, e.g. 1360×6156), re-taken fresh 18 Nov 2026 14:23 against
the final bytes (served sw `praxis-v3.332`), 0 page errors. Rig (untracked): `.claude/rig/captures/l4b2bhf1/` — `serve-root.ps1`
(a no-store server; 8862 the working tree, 8863 a `git archive` of 84d0c64), `hf1-rig.js` (the l4 fixture + books in the seven
missing categories → 38 books, 17 categories, 3 kept lenses), `hf1-shots.ps1` (headless Chrome over CDP, fresh profile).
Full-page frames hide the position:fixed chrome below the nav, as at L4b-2b.

**2.4 measurements**

- **The FAIL, and its fix.** At ≥1200 `.pf-sky-host{max-height:600px}` (components.css:15440) still applied under
  `.pf-sky-host.lx-you-host{height:auto}` (:17716), and `.pf-hero{overflow:hidden}` (:15143) clipped the host: with the 962 px
  list, **4 of 19 controls were visible at 1360** (both buttons + 2 rows; the rest under `.pf-counts` / `.pf-thesis` or clipped;
  hit-tested with the hero unscrolled). The review chat's "no row past the viewport" was true sideways only. With the un-cap:
  **19/19 visible at 390 and 1360, Night and Day**; host 1486 px at 1360 (List), 590 px (By the orbs, unchanged), 464 px in
  Lenses and Marks with the 600 px cap kept; 390 unchanged (host 1503 / 607 / 481).
- Switch buttons 96×44 and 106–108×44; every row ≥ 44 (smallest 44); nothing past the viewport (390: x 20..370; 1360: the box
  340..1020, 680 wide).
- Contrast (worst ground pixel, the L4b-2b method; Night / Day, the same at 390 and 1360): row name 13.63 / 16.57 · count 7.99
  / 6.93 · chevron 7.99 / 6.93 · switch pressed 11.05 / 13.70 · unpressed 7.99 / 6.93. Floor 4.5.
- By the orbs, names showing at once (8 samples 0.7 s apart): **9–11 of 17 at 390, 13–15 at 1360** (11 px); names off → 0 of 17
  (`.field.nonames`); List → the sky's own 3 "named". The smallest names' contrast on the sky, worst pixel: 1.39–13.3:1; at 390,
  4 of 11 fall under 4.5 where a gold streak or a bright orb passes behind; at 1360 every one ≥ 5.88. The sky's OWN 12.5 px names
  in Lenses and Marks fail the same test (1.27–2.32:1 at 390) under 84d0c64's rules — pre-existing (H-S1).
- Scroll width on You: 390 = 390 and 1360 = 1360, before (84d0c64 tree) and after, Lenses and Categories. The review chat's 394
  at 84d0c64 was NOT reproduced on this fixture (H-S2).

**2.5 the walk** (real hit-tested CDP clicks, prefers-reduced-motion emulated so an orb holds still under the pointer) — **PASS
at 390 and at 1360**, Night: You → Categories (17 rows, 17 marks) → a row → `#category/Science%20%26%20Nature`, Back "You", tab
you → Back → the list still shown → By the orbs → reload → still By the orbs (stored "orbs"; the rig's seed is re-applied after
the reload without touching the choice) → Lenses → Categories → kept → a category orb → `#category/Psychology%20%26%20Mind`,
Back "You" → Back → List → the same orb → its page. 0 page errors.

**What the rig cannot show:** a real iPhone (WebKit, the notch, touch), signed-in persistence (the rig is signed out with a
stub user; the one write is a device preference), 760–1199 px (not measured; the cap exists only ≥1200), a browser without
`:has()`.

### Stage 3 — the red-team and the reviewer

**fix-red-team (Sonnet): no BLOCK, no MAJOR.** Its answers: (1) the box cannot outlive the sky, duplicate, or show under the
visitor preview or another reader — `rec.below` is one node on the cached 'you' record, mounted only under `!vis && lxSkyOn()`,
rebuilt from the current uid's items on every render. (2) Re-render leaves one box and one listener per button; the sky's
delegated listeners are bound once and rows sit outside the sky host. (3) The `:not(.nonames)` guard keeps a names-off sky
off; `.l.hid` (opacity) still wins; the collision pass measures the new labels because the class lands before every build.
(4) `sig=''; build()` is the mode switch's own pattern; it does not touch the rAF loop; `build()` returns early when unlaid.
(5) The one write is `sv('praxis_you_catnames', m)`, only on a change. (6) The list reads as a group of pressed buttons and
rows whose labels start with the visible name. (7) R6 runs only at the delete flow's `phase('local')`, after reauth, the cloud
delete and `authUser.delete()`; sign-out and export never touch the key. (8) The `:has()` line un-caps only while the box
shows. Findings:

| # | Sev | Finding | Disposition |
|---|---|---|---|
| T1 | MINOR | A row's focus ring is clipped: rows sit in `.lx-cn-list{overflow:hidden}` and the shared `:focus-visible` outline has `outline-offset:2px` | its smallest fix `.lx.lx-catnames .lx-cn-row:focus-visible{outline-offset:-2px}` — not applied, not rig-tested; ledger H-L1 |
| T2 | MINOR | A switch press rebuilds the switch (`innerHTML=''`), so keyboard focus drops to the body; the existing Lenses · Categories · Marks buttons do the same | ledger H-L2 |
| T3 | MINOR | With the sky's Names off, "By the orbs" visibly does nothing (no hint) — as R4 rules | ledger H-L3 |
| T4 | residual | Without `:has()` (iOS < 15.4, Chrome < 105) at ≥1200 the list clips as before the fold; the repo already relies on `:has()` (components.css:17718) | ledger H-L4 |
| T5 | NIT | The block comment says "Scoped under .lx.lx-catnames and .sky.lx-orbnames"; the un-cap line is scoped to `.pf-sky-host.lx-you-host` | ledger H-L5 |
| T6 | NIT | integrations.js:1520's comment ("the sky's per-device keys (the switch, its two toggles, the gate readout)") does not name the new key | ledger H-L5 |
| T7 | NIT | Each category is announced twice to a screen reader (the orb and the row) — inherent to a list beside the orbs | recorded |
| T8 | NIT | With 7–12 orbs at ≥560 px nothing is `.many` / `.tight`, so "By the orbs" changes nothing there (names already show) | recorded |
| T9 | NIT | `docs/checkpoints/l4b-2b.md` was modified but unstaged at review time | staged with the commit (docs ride with the diff) |

**praxis-reviewer (Sonnet): CLEARED WITH NOTES — no blocking finding.** It re-derived every staged size and md5, numstat 46/0 · 20/0 · 1/1 · 1/1, EOL `i/lf w/crlf`, the locked files, `git diff --cached --check` clean, the ES3 sweep (0), the two `*/` in the CSS block (its own comment ends only), the `ls` / `sv` calls (one key, no Firestore, no schema), the call chain (renderProfilePage → lxYouSky → lxFillYouSky → lxFillCatNames, mounted at :23926; the mode switch :28405 re-fills; a row calls lxOrbOpen :28419), the empty and signed-out states, the 20 captures' full-frame sizes, and the docs against the code. It re-ran all eleven suites (each printed its total, the counts above) and the new harness's exit 2 against `git archive HEAD js`. Notes: N1 this placeholder (replaced here); N2 stage by name, never `.claude/rig/**`; N3 = H-L5; N4 the red-team's T1–T4 accepted. Not verified by it: the pixel measures (it checked the image sizes only), WebKit, signed-in persistence, 760–1199 px, the live deploy, builder.html mid-regen.

### Ledger (recorded, not fixed here)

- **H-L1** (T1) the row focus ring is clipped by the list's `overflow:hidden`. **FIXED in Hotfix 2 (v3.333), R5.**
- **H-L2** (T2) focus drops to the body after a switch press (shared with the sky's mode buttons).
- **H-L3** (T3) "By the orbs" with Names off shows nothing new.
- **H-L4** (T4) no `:has()` → the ≥1200 clip returns.
- **H-L5** (T5, T6) two comments no longer cover the new rule / key.
- **H-L6** The harness reads the box through a fake DOM; the real-DOM proof is the rig walk and the hit-tested visibility probe.

### Separate tasks (pre-existing, not this build's)

- **H-S1** Sky names (12.5 px, `--on-night`) fall under 4.5:1 on the worst pixel where the sky's gold streaks or a bright orb
  pass behind them — Lenses and Marks at 84d0c64 already (1.27–2.32:1 at 390); By the orbs inherits it at 11 px.
- **H-S2** The review chat measured You's scroll width 394 vs 390 at 84d0c64 (`.pf-field` reaches 394); this rig's fixture
  shows 390 = 390 before and after. Unconfirmed here; worth one check on the real library. **FIXED in Hotfix 2 (v3.333), R6** —
  confirmed by the review chat's measurement (394/390, `.pf-field` 40–394) and by this rig's (`.pf-field` 40–364 past its grid's 350).
- **H-S3** The `praxis-sky-perf` worktree holds uncommitted edits to the byte-locked `js/hand.js` (label measurement every 6th
  frame) and a comment in `js/views.js`. Not touched. If it ever lands, re-check By the orbs: it changes how often the names'
  collision pass runs.
- **H-S4** S-1 still stands: cscript exits 0 on a runtime error; every suite here was read by its printed total.

### Owed after the push

On Preston's phone at v3.332: You → Categories. A switch and a list should sit under the sky. Tap a row: its category page
opens, and Back returns to You. Tap "By the orbs": small names appear beside about half the orbs. Close and reopen the app: it
should still be on "By the orbs". Say PASS, or name what is wrong. (This machine cannot reach the live origin; confirm v3.332
on the About version line or `#diag` first.)

## Hotfix 2, 18 Nov 2026 (the small fixes and the still flower, v3.333)

18 Nov 2026 · Opus 5.5 executing the review chat's written and tested patch, unchanged, on main at `3ecdc38` (v3.332) ==
origin/main. Preston's go-ahead included "run fix-red-team on this". **Status: PUSHED at `b0005cb` (v3.333); Preston's
phone check PASSED (19 Nov 2026, `docs/checkpoints/l4d.md` R1: the flower holds, the You page does not slide sideways, no name
sits on the caption, the Undo bar and Undo work).** (Corrected at L4d: this line said "built, staged, NOT committed", written
before the commit and never updated.)
fix-red-team: no BLOCK, no MAJOR (2 MINOR, 1 NIT). praxis-reviewer: see § Stage 3.

### Rulings, worded as given (18 Nov 2026)

- **R1** My phone check of L4b-2b hotfix 1 at v3.332 is a PASS: the list works, a row opens its category page and Back returns
  to You, and the choice survives closing the app.
- **R2** "By the orbs" shows about half the names on my phone. I keep it as built. Showing all 17 by the orbs waits for the new
  sky engine in LC2.
- **R3** The flower holds still. Its 64-second wind into a spiral and back is off in the sky, on Home and on You. The orbs, the
  streaks and the flower's slow turn keep moving.
- **R4** In By-the-orbs mode an orb's name must not run into the caption line under the sky.
- **R5** A list row's keyboard focus ring sits inside the row.
- **R6** The You page must not scroll sideways on a phone.
- **R7** The Undo toast must stand off a Night page.
- **R8** The sky's choppiness in Categories mode is its own build, next, with js/hand.js unlocked for it and frame rates
  measured before and after. Nothing from it is in this build.

### What was built

One block appended after `/* === L4b-2b HOTFIX 1 — end === */` in `assets/components.css` (:17973–17984), five rules, and
`sw.js` `praxis-v3.332` → `praxis-v3.333`. No JS change but sw.js. Tokens only, no hex.

- :17979 `.sky .pt,.sky .tiltg{animation:none}` — R3. Equal specificity to :17544–17545 and later, so it wins; :17544's
  `transform:var(--tf)` still applies, so every petal rests at its own `--tf` (the cycle's 0 % / 14 % / 100 % frame, the pose
  reduced motion shows) and `.tiltg` at identity. The Open Lens band's rules (:17837–17838, 0,4,0) are untouched.
- :17980 `.sky.lx-orbnames .field{margin-bottom:28px}` — R4. `lx-orbnames` is set only by `lxFillCatNames` (You, Categories,
  By the orbs).
- :17981 `.lx.lx-catnames .lx-cn-row:focus-visible{outline-offset:-2px}` — R5 (hotfix 1's T1 / H-L1, the red-team's own fix).
- :17982 `.pf-field,.pf-field input,.pf-field textarea{min-width:0}` — R6. The settings grid's one `1fr` track was sized by its
  fields' min-content.
- :17983 `.lx.lx-toast{background:var(--umber-2);box-shadow:var(--card-hi),inset 0 0 0 1px var(--line-night)}` — R7. Both
  tokens exist only in theme.css's `:root` (`--umber-2` #46321F :40, `--line-night` rgba(255,255,255,.14) :44), so every mood
  gets the same fill and ring.

### Stage 0 — pre-flight: PASS (read-only)

HEAD `3ecdc38` == origin/main, CACHE_VERSION v3.332, tracked tree clean, hook ARMED, FIX-PROTOCOL v1.3, 7 agents; all ten
protocol docs found (the ledgers live inside this file). Before-numbers MATCH: components.css 950,908 `7311ec5b…`, sw.js 6,894
`902e8692…`, and views.js `5b17578b…`, integrations.js `2d86b859…`, hand.js `fd51ca7e…`, state.js `b8cdafb5…`, theme.css
`571e0ccc…`, lumen-amber `631bc2aa…`, marks.js `772886c0…`. The diff extracted from the prompt: 33 lines, 1,817 B, md5
`dec3a8e4b6938371bb1bb9bd77d6e9c8`, CR 0 — MATCH. The anchor once, as a whole line, at :17972, the file's last line. `git apply
--check` passes; the scratch dry apply (`-c core.autocrlf=false`) gives both after-md5s. No JS reads an animation event or
`getAnimations` (0 hits in js/ and sw.js). `v3.333` and "HOTFIX 2": 0 hits at HEAD. The praxis-sky-perf worktree (sky-perf-lane at
84d0c64) still holds uncommitted edits to `js/hand.js` and `js/views.js` (names listed only, contents not read; H-S3).
One disagreement recorded: FIX-PROTOCOL §1 opens a checkpoint file at Stage 0; the prompt kept Stage 0 read-only, so this record
was written at Stage 4, as hotfix 1's was.

### Stage 1 — apply: PASS

| file (LF, staged blob) | before (3ecdc38) | after (expected) | after (measured) | numstat |
|---|---|---|---|---|
| assets/components.css | 950,908 `7311ec5b…` | 951,830 (+922) `41dda36377d68637a42b7d51170a546b` | **951,830 `41dda36377d68637a42b7d51170a546b`** | 12 / 0 |
| sw.js | 6,894 `902e8692…` | 6,894 (+0) `042099e3f61c4da54de7d48e0ce75802` | **6,894 `042099e3f61c4da54de7d48e0ce75802`** | 1 / 1 |

EOL `i/lf w/crlf` on both (worktree CR count = line count, 17,984 and 172). `git diff --cached --check` clean. parse-check: all 19
`js/*.js`, sw.js and assets/marks.js PARSE OK, and the harness FAILS a broken copy (exit 1). Added lines (13): hex 0, `const` /
`let` / `=>` / `class` / backtick 0. Unchanged files at their numbers.

### Stage 2 — test and look: PASS

**2.1 suites** (each printed its own total — S-1): lens-eval 68/68 · lens-data 101/101 · export 58/58 · delete 58/58 · ceiling-core
36/36 · fx1c-sim 60/60 · L4b-1 hotfix 46/46 · L4b-2a unit 71/71 · L4b-2a hotfix 1 74/74 · L4b-2b unit 120/120 · L4b-2b hotfix 1
74/74.

**The rig** (untracked): `.claude/rig/captures/l4b2bhf2/` — `hf2-rig.js` (probes, on top of the l4 fixture + `l4b1-rig.js` +
`../l4b2bhf1/hf1-rig.js`: 38 books, 17 categories, 3 kept lenses) and `hf2-shots.ps1` (headless Chrome over CDP, fresh profile,
phases anims · petals · gap · ring · toast · fields · drag · walk); served by `../l4b2bhf1/serve-root.ps1` — 8862 the working tree
(AFTER, sw `praxis-v3.333`, the HOTFIX 2 block present), 8863 a `git archive` of 3ecdc38 (BEFORE, sw `praxis-v3.332`). 390 is
`mobile:true`, dpr 2, 390×844; 1360 is dpr 1. All captures fresh, 18 Nov 2026 15:36–18:55. **One rig trap found and fixed:**
`l4b1-rig.js`'s `R.stub` injects `#__rig_settle`, which sets `animation:none!important` on every element — the first animation pass
read `none` on BEFORE too. `HF.motionOn()` keeps transitions off but lets CSS animations run (a test div then computes `drift`);
every motion figure below was taken with it (ledger H2-L7).

**2.2a — the You page sideways.** `.pf-set-fields` and the `.pf-field` right edge, Night and Day, Lenses and Categories (identical):

| width | BEFORE (3ecdc38) | AFTER |
|---|---|---|
| 320 | grid 40..280 · fields 40..**364** (+84 past the grid) · page 364/320 | grid 40..280 · fields 40..280 · 320/320 |
| 360 | grid 40..320 · fields 40..**364** (+44) · 364/360 | 40..320 · 40..320 · 360/360 |
| 390 | grid 40..350 · fields 40..**364** (+14) · 390/390 | 40..350 · 40..350 · 390/390 |
| 1360 | grid 56..1304 · two columns 56..669 / 691..1304 · 1360/1360 | the same |

The rig still shows 390/390 before the patch at 390, as in hotfix 1, but measured directly the field overruns its grid by 14 px at
390 and the page overruns the viewport at 320 and 360. The rig is a phone-emulated context (`mobile:true`, dpr 2, the page's
`width=device-width, initial-scale=1, viewport-fit=cover` meta, scrollbars hidden). The field is label 120 + gap 10 + the input's
intrinsic width: 194 here (to 364); the review chat's 40–394 implies 224. The input's intrinsic width follows its font's metrics, so a
font difference between the two rigs is the likeliest cause — not proven. **The drag:** a sideways touch drag never moves `scrollX`
under phone emulation; an overwide page widens the layout viewport (BEFORE at 320: `innerWidth` 364) and the drag pans the visual
viewport. Fresh load, settings in view, 200 px touch drag: BEFORE at 320 → `visualViewport.pageLeft` **44**; AFTER at 320, 360 and
390 → **0** (BEFORE at 360 and 390 carried the 320 step's zoom and are not counted).

**2.2b — what moves.** Computed `animation-name`, 390 and 1360 alike, BEFORE → AFTER:

| | Home | You · Lenses | You · Categories | You · Marks |
|---|---|---|---|---|
| `.sky .pt` | morph ×19 → **none ×19** | morph ×19 → **none ×19** | morph ×19 → **none ×19** | morph ×19 → **none ×19** |
| `.sky .tiltg` | tilt → **none** | tilt → **none** | tilt → **none** | tilt → **none** |
| `.sky .sping` | turn → turn | turn → turn | turn → turn | turn → turn |
| `.sky .orb .art` | drift ×3 → ×3 | drift ×3 → ×3 | drift ×17 → ×17 | drift ×5 → ×5 |
| `.sky .pu` / `.sky .sw` | pulse ×23, sway ×28 both | 23 / 28 both | 54 / 81 both | 26 / 33 both |

Over 1.5 s, BEFORE and AFTER on all eight views: the streak canvas's pixels change, the orbs' `.art` transforms change, `.sping`'s
transform changes. Open Lens (`#lens/th_l4_01`): `.lx.ol .ol-band .pt` 0 and `.tiltg` 0 elements in both builds (the band's mark is
`PraxisHand.formSvg`, which draws no petals); its `.tn` turns in both — unchanged.

**2.2c — the petals** (You, Lenses, 390 Night, a fresh load; three petals — first, middle, last of 18 — and the spiral-arms group):

| | BEFORE t0 (morph at 1.6 s) | BEFORE t0 + 32 s (33.6 s) | AFTER t0 | AFTER t0 + 32 s |
|---|---|---|---|---|
| petal 1 | `matrix(-0.160,-0.987,0.987,-0.160,-0.64,-3.95)` = its `--tf` | `matrix(-0.102,-0.844,0.357,-0.043,58.19,-21.41)` ≠ `--tf` | the same matrix, = `--tf` | **identical, = `--tf`** |
| petal 2 | = `--tf` | ≠ `--tf` | = `--tf` | **identical, = `--tf`** |
| petal 3 | = `--tf` | ≠ `--tf` | = `--tf` | **identical, = `--tf`** |
| arms | `matrix(0.1,0,0,0.1,0,0)` = `--tf` | `matrix(1,0,0,1,0,0)` | `scale(.1)` = `--tf` | **identical** |

Captures (whole viewport frames 780×1688, and a 2× crop of the flower): `hotfix2-flower-{t0,t32}-390-{before,after}.jpg` and
`hotfix2-flower-{t0,t32}-zoom-390-{before,after}.png`.

**2.2d — By the orbs, the lowest name vs the caption's first text line** (20 samples, 1 s apart; animations running):

| | BEFORE smallest gap | AFTER smallest gap | field margin-bottom · sky host |
|---|---|---|---|
| 390 Night | 8.5 px (Social & Political Thought, 2 lines) | **36.3 px** | 0 → 28 px · 541 → 569 |
| 390 Day | 12.2 px (Theory & Philosophy, 2 lines) | **40.5 px** | 0 → 28 px · 541 → 569 |
| 1360 Night | 3.5 px (Theory & Philosophy, 2 lines) | **31.5 px** | 0 → 28 px · 523.5 → 551.5 |

Never below 0 AFTER. This fixture does NOT reproduce a BEFORE overlap (closest 3.5 px at 1360); Preston's phone did, with a two-line
"Memoir & Biography". The margin applies only By the orbs: Lenses, List and Marks keep host 481 / 541 / 481 (390) and 463.5 / 523.5 /
463.5 (1360), field 300 / 360 / 300, hero 724.4 / 1746.4 / 724.4 — identical BEFORE and AFTER; the canvas follows the host. Captures
`hotfix2-orbs-gap-390-night-{before,after}.jpg`.

**2.2e — the focus ring** (focus the element before, then a real Tab key over CDP; `:focus-visible` true every time): BEFORE 2px
solid, offset **2px**, ring box 16..374 against the list's 20..370 — outside on rows 1 and 17, at 390 and 1360, Night
(`rgb(227,184,138)`) and Day (`rgb(122,69,32)`); the capture shows only the ring's bottom edge, over the next row. AFTER offset
**-2px**, the ring box inside the list's box on rows 1 and 17 at both widths and both moods. On the first row's top corners and the
last row's bottom corners the ring's square corners are trimmed by the list's 14 px radius; the line stays continuous (H2-L5).
Captures `hotfix2-ring-{first,last}-390-night-{before,after}.{png,jpg}` (PNG: a 3× crop of the row; JPG: the whole frame).

**2.2f — the toast** (`lxToast` with an Undo; shown, opacity 1, 64 px tall, hit-tested on itself; 390 and 1360 alike):

| | BEFORE | AFTER |
|---|---|---|
| fill | `rgb(51, 36, 26)` (`--umber`) | `rgb(70, 50, 31)` (`--umber-2`) |
| text on the fill | 13.63:1 | 11.05:1 |
| "Undo" on the fill | 8.23:1 | 6.67:1 |
| hairline | none | `--line-night` 1 px, composites to rgb(96, 79, 62) |
| fill vs the page behind it, Night (You, Home, Shelf, Open Lens alike) | median 1.21:1 | median **1.49:1** |
| the hairline vs that page, Night | — | median **2.31:1** |
| fill vs the page behind it, Day | median 14.06:1 | median 11.40:1 (hairline 7.37:1) |

(The page behind is measured with the toast hidden, in its band + 10 px; the worst pixel there is ~1.0:1 on every page because the
band takes in the nav bar's own dark fill.) The text floors (4.5) hold. The Night edge is lighter and ringed but stays under 3:1 —
whether it plainly stands off the page is Preston's eye (H2-L9). In Day `--card-hi` adds a brighter top line (.55), as before this
build. Captures `hotfix2-toast-{you,home,books,lens}-390-{night,day}-{before,after}.jpg` and `hotfix2-toast-*-1360-*-after.jpg`,
each taken while the toast showed.

**2.2g — the settings fields.** No input under 120 px at 390 (180) or 1360 (483); no label clipped (0 of 4) at any width. A 77-character
display name typed by CDP: at 390 the input keeps its width (180), scrolls inside itself (scrollWidth 566 > 160, scrollLeft 406), the
page stays 390/390; at 1360 the text fits the 483 px field. Captures `hotfix2-fields-typed-{390,1360}-{before,after}.jpg`. At 320 (not
asked) the inputs are 110 px — H2-L8.

**2.3 the walk, 390, Night** (real hit-tested CDP clicks, a real Tab key, a raw touch drag) — **PASS**: (1) Home: petals and arms
identical over 8 s (`none`), the orbs drifted (`hotfix2-walk-home-390-after.jpg`). (2) You → Lenses, Categories, Marks: each the same
over 6 s. (3) Categories → By the orbs: the smallest name-to-caption gap over 10 s 47 px, 10 of 17 names showing, stored "orbs".
(4) List → Tab ×3: rows 1, 2, 3 each `:focus-visible`, 2px solid, offset -2px, inside the list. (5) Open Lens (`#lens/th_l4_03`, 4
books; a lens of two disables its minus buttons by design) → Edit → "Leave Weapons of Math Destruction out of this lens": `leftOuts`
[] → ["bk_l4_07"], the toast shown and hit-tested (`hotfix2-walk-toast-390-after.jpg`) → Undo (a real click at 351,46): `leftOuts`
[], the toast hidden. (6) You dragged sideways: no movement (and 2.2a's drag). 0 page errors.

**What the rig cannot show:** a real iPhone (WebKit, the notch, touch, Preston's fonts — the likely source of 394 vs 364); a BEFORE
overlap of a name on the caption (not reproduced here); signed-in data (the rig is signed out with a stub user; this build writes
nothing); whether the Night toast reads as plainly visible (a felt call); frame rate (R8's build).

### Stage 3 — the red-team and the reviewer

**fix-red-team (Sonnet), on the frozen staged diff: RED-TEAM clean — no BLOCK, no MAJOR.** Its answers: (1) every petal's `--tf` is
the morph's 0 / 14 / 100 % frame, so none is mid-morph; `.tiltg` with no transform is the tilt's 0 % state. (2) The only producer of
`.pt` / `.tiltg` in a sky is `bloom()` (hand.js:330); the other `.pt` classes (`.pf-pub`, `.pf-panel-hd`) are text outside any sky;
marks.js has none; the band's (0,4,0) rules cannot be reached. (3) The reduced-motion block (:17555, `!important`) still wins and is
now partly redundant. (4) `.pf-field` has two users, the four settings fields and the account-delete field (`.pf-del-field`, margin
and label font only) — the same shrink, harmless; ≥760's `1fr 1fr` grid only benefits. (5) `lx-orbnames` is toggled only in
`lxFillCatNames`; the host is `height:auto` and un-capped by hotfix 1's `:has()` line; orb positions do not move. (6) Both toast
tokens are `:root`-only and the toast hangs off `body`, so fill and ring are the same on every ground; Day's `--card-hi` top line
predates this build. (7) The focus rule (0,4,0) beats `.lx.lx-catnames button:focus-visible` (0,3,1) on the offset only. No `*/`
inside the new comment, no hex, the version correct by one.

| # | Sev | Finding | Disposition |
|---|---|---|---|
| T1 | MINOR | The spiral-arms group is also a `g.pt`, `--tf:scale(.1)`: it now stays at 10 % for good, so the spiral never shows | as R3 rules ("its wind into a spiral … is off"); ledger H2-L3 |
| T2 | MINOR | Each petal's inner sway (`.sky .sw`, ±2.5–6°, 5–11 s) still runs, so the petals still wobble | R3 names only the 64 s wind; ledger H2-L4 |
| T3 | NIT | The ring's square corners meet the list's 14 px rounded clip on the first and last rows | seen in the captures (a few px trimmed, line continuous); ledger H2-L5 |

**praxis-reviewer (Sonnet), on the full set (staged code + the six docs + the captures): CLEARED TO COMMIT — no blocking finding.**
It re-derived both staged blobs (951,830 `41dda363…`, 6,894 `042099e3…`) and HEAD's, numstat 12/0 · 1/1, EOL `i/lf w/crlf`, the hunk
line for line against the prompt, hex 0, the only `*/` the comment's own, `--check` clean; the seven locked/unchanged md5s; hook
ARMED; parse-check sw.js OK; re-ran export 58/58, lens-data 101/101, hotfix-1 unit 74/74, L4b-2b unit 120/120 (read by printed
total); R1–R8 worded as given; every line reference (:17973–17984, :17979, :17544–17545, :17555, :17532–17533, :17837–17838,
hand.js:215, theme.css:40/:44); the ledger closures and additions; BOARD / BUILD_STATE / sequence / l4.md; builder.html carrying the
new text; 48 captures, none empty, 6,734,242 B (30 at 780×1688, 10 at 1360×900, 4 ring crops 2196×480, 4 flower crops 704×704).
Notes: N1 stage by name — the two code files, the six docs and `docs/checkpoints/l4b-2b-shots/hotfix2-*`, never `.claude/rig/**`;
N2 builder.html grepped, not regenerated by it; N3 = H2-L2 (hotfix 1's owed lines still name the About version line). Not verified
by it: the rig's pixel and computed-style measures, WebKit, the live deploy, the Night toast's felt read.

### For Preston (nothing changed for these)

- The Open Lens band: its flower rules (:17837–17838) match no element — the band draws the lens's own mark (`formSvg`), not a
  flower — so whether it follows changes nothing visible today. My view: leave it; if a later build puts a flower in the band, it
  should hold still too, by the same rule.
- The Night toast is lighter and ringed, but its edge on a Night page is 1.49:1 (fill) / 2.31:1 (ring). If it still does not stand
  off on the phone, the next step is a stronger ring — a new token value, a ruling, not part of this patch.

### Ledger (recorded, not fixed here)

- **H2-L1** (R2) all 17 category names by the orbs waits for LC2's sky engine. **CLOSED at L4d (v3.334, 19 Nov 2026),
  by its R4:** By the orbs is a still sky, every category's name under its orb, all the time (`docs/checkpoints/l4d.md`).
- **R8 (the sky's frame rate in Categories mode) — CLOSED at L4d (v3.334, 19 Nov 2026):** js/hand.js unlocked by ruling, the
  sky reads no layout while it moves; the engine's time per frame and the frame rate before and after are in
  `docs/checkpoints/l4d.md`.
- **H2-L2** The About page has no version number (its footer reads "version stamped at build"), so phone checks confirm a build by
  its new feature or by `#diag`, never by "the About version line" — the Owed-after-the-push lines above that say so are wrong.
- **H2-L3** (T1) the spiral arms never show now (they rested at `scale(.1)` and grew only mid-morph).
- **H2-L4** (T2) the petals still sway (`.sky .sw`).
- **H2-L5** (T3) the first and last rows' ring corners are trimmed by the list's radius.
- **H2-L6** `.lx.ol .ol-band .pt` / `.tiltg` (:17837–17838) are dead rules at 3ecdc38 (no element matches).
- **H2-L7** `l4b1-rig.js`'s `#__rig_settle` stills every CSS animation; motion-dependent samples taken under it (hotfix 1's
  names-at-once over 8 samples) were on a still sky. `hf2-rig.js` `HF.motionOn()` is the fix for rig use.
- **H2-L8** At 320 the settings inputs are 110 px (field 240 − label 120 − gap 10); before this build they were 194 and the page
  panned 44 px.
- **H2-L9** The Night toast's edge stays under 3:1 (above).
- **H-L5 stays open:** hotfix 1's block comment still says "Scoped under .lx.lx-catnames and .sky.lx-orbnames"; correcting it
  would change this build's expected numbers.

### Separate tasks (pre-existing, not this build's)

- **H-S1, H-S3, H-S4** stand as written under Hotfix 1.
- **H2-S1** The l4b1 rig's settle style should leave animations on, or each motion probe must opt in (H2-L7).

### Owed after the push

On my phone at v3.333, close the app fully and reopen it. Home: watch the flower for a minute; it should keep its shape while the
orbs drift. You: drag the page sideways; it should not move. You → Categories → By the orbs: no name should sit on the caption line
under the sky. Open a lens, leave a book out: the Undo bar at the top should be easy to see; tap Undo. Say PASS, or name what is
wrong. (This machine cannot reach the live origin; confirm v3.333 by the still flower or `#diag`, not the About page — H2-L2.)
