# R-SHELF BUILD — Stage 0 Recon

STARTED. Model: Opus 4.8, default effort. Base HEAD: `4a3c2e3` (main == origin/main).
Mockup parity source: `docs/studio/mockups/r-shelf.html` @ `rshelf-mockup` `d3bfb59` (blob `74d9a9a`).
CACHE_VERSION on main: `praxis-v3.241` → next **v3.242**.
Brief: `docs/studio/r-shelf-brief.md` (v4). North star: `docs/studio/shelf-look.md`.
Byte-locks intact: `marks.js` 10,255 B (matches); `lumen-amber.css` 14,966 B (standing drift since `124fe99`, not new).
Recon method: full mockup read + 2 read-only census agents (code + data/timestamp) + independent verification of load-bearing seams.

---

## 1. VERDICT ON THE HALT CONDITIONS

- **HARD RULE #2 (order-by-life signal) — NO HALT.** Usable per-book, render-derived, zero-schema timestamps exist (§3 signal table). Composite carried per the prompt's pinned priority.
- **HARD RULE #3 (real covers) — buildable.** Cover-less is derived at render (`buildSelfHealingCover`, no stored flag); spines render for the cover-less. No HALT.
- Two brief presuppositions do NOT exist in live code and become **decisions** (§6): the g0–g3 book density grammar, and a per-book "carrying-question" field.

---

## 2. CODE CENSUS — the live Shelf (agent-verified, anchors independently confirmed)

- **Route:** `#books` → `renderShelf()` at `renderRoute()` [views.js:686-696]; `umberGroundDark` includes `books` (dark route ground). **Router-level shelf cleanup** at [views.js:427-442] (MW-1: releases Manage-sheet scroll-lock + purges `shelfManageEscapeHandler`/`shelfHeadScrollHandler` on EVERY route change — must survive).
- **`renderShelf()`** = [views.js:4501-6030] (1,530 lines). Structure:
  - Top cleanup 4506-4531 (purges 3 stale handlers).
  - **Signed-out HARD GATE** 4540-4548 (`buildSignedOutPrompt('Your shelf is private', …)`, return). *New since standing memory; the mockup never shows it — MUST be preserved.*
  - Head 4553-4606 (`.shelf-head` h1 "Your shelf" + mono count).
  - Sticky-head scroll listener 4608-4617.
  - Yumi reading-line 4619-5103 (deterministic "Most-shelved lens" line).
  - Toolbar 4634-4959: Manage container (4655-4732), primary Add (4738-4745), **Covers|List seg** (4748-4772, appended INTO manageBody), **Sort dropdown** (4775-4825, added/status), Select (into manageBody), Filters btn (4840-4859), 5 secondary chips (Scan/Bulk/Resolve/Tidy, into manageBody), local **search well** (4941-4957 → `onShelfSearchInput` 6634, 250ms debounce).
  - **Sidebar** `.shelf-side` 4986-5647: status rail, **Lenses⇄Categories seg `groupSeg`** (5327-5356 — *lives in the SIDEBAR today, moves to the header*), lens OR category rail (5369-5520), **R8 Values rail** (5525-5592), author rail (5594-5645).
  - Grid assembly 5688-5813 (8-predicate AND filter, strict `===`), display-only sets `shelfAlight`/`shelfArcsByBook` (5815-5880, function-local), empty state 5882-5937, grid/rows branch 5938-5977 (`getShelfView()` covers→`renderShelfBook`, list→`renderShelfBookRow`), editor host `#shelf-editor-host`.
  - Tail 5982-6029: arc-picker host + `#shelf-selectbar` (Move to an arc).
- **Row renderers:** `renderShelfBook(book,isAlight,arcs)` [6049-6211] (covers card: cover-area/`buildSelfHealingCover`, rmark, tick `--register-<tradition>`, arcthread `arcFieldHue`, check, title/author, status pill, arc-reveal panel, one click router). `renderShelfBookRow(...)` [6220-6289] (list row: arcthread, rmark, tick, title/author, status, no cover, no reveal). Both share `arcFieldHue` (6037) + `normalizeStatus`.
- **Persistence of view state:** `getShelfView/setShelfView` (281-294, key `praxis_shelf_view`), `getShelfGrouping/setShelfGrouping` (300-313, key `praxis_shelf_grouping`) — localStorage, not module vars. Module vars: `shelfFilter`, `shelfSort`, `shelfSelecting`, `shelfPicked`, `shelfCategorizing`/`shelfClassifyGen` (lazy classify guard), `shelfSearch*`, handler handles (all ~6432-6496).

### SHARED-RENDERER PROTECTION (the top risk — resolved)
| renderer | call sites | verdict |
|---|---|---|
| `renderShelfBook` | **ONLY** [views.js:5958] (inside renderShelf) | **SHELF-ONLY — safe to rewrite** |
| `renderShelfBookRow` | [5949] (renderShelf, live) + [16695] (`_accountBuildCategoryPanel`) | live site shelf-only; **16695 is in the DEAD `renderAccountPage` tree** (`#account`→`location.replace('#profile')` [views.js:721]; slated for S-B deletion, sequence.md:686-687) |

→ **FORK-VERBATIM item (F7 below):** the 16695 call cannot execute today, but a signature change to `renderShelfBookRow` leaves dead source out of sync.

### CSS census (components.css)
- **DEAD legacy generation** ~1125-2606 + 4119-4238 (`.shelf-header`, `.shelf-seg`, `.shelf-filter-row`, bare `.shelf-empty`, `.shelf-layout.shelf-rail-open`) — 0 live DOM matches; do not depend on / reintroduce.
- **LIVE dark base** 10266-10338 (`.shelf`, `.shelf-head/-title/-count`, `.shelf-toolbar/.seg`, `.nav-search`, `.shelf-layout/-side/-filter*`, `.shelf-main/-grid/-rows`, `.empty-state`; @media 760 / 759).
- **LIVE `.lum-amber-deep` overlay** 12555-13051 (card/row/rmark/status-dot/select/manage; @media 760 / 759 ×2 incl. mobile Manage bottom-sheet 12935-12987 which already uses `--page-2`/`--line-page-2`/`--scrim`/`--paper`). **No XL (≥1600) shelf tier exists.**
- **Editor/bulk-editor** blocks live (~3707+, 9045-9096).
- Token tier: base dark-Umber + `.lum-amber-deep` amber skin (the `lumen-amber.css` "reading room" tier). R-SHELF light-repoints per Law 6.

---

## 3. DATA CENSUS + ORDER-BY-LIFE SIGNAL

- **Book shape** (chokepoint `ensureBookFields` state.js:387-427; also on the Firestore merge integrations.js:845): `id, title, author, isbn, addedAt(ms), status(normalizeStatus→will-read/reading/read), genre, coverUrl|null, coverCandidates?, finishedAt(ms|null), tradition/traditionOverride, pageCount/publisher/year/description/rating/dateRead(DEAD), category(str, exclusive)/rawCategories/categoryOverride, movedMe, valueMarks[{value,why}]`.
- **Categories:** `SHELF_CATEGORIES` state.js:497-515 = **17**, + `Uncategorized` (516). `book.category` single string, exclusive; `categoryOverride` wins when set.
- **Lenses:** `state.userThemes[id]` = `{id,userId,name,bookIds[],createdAt,updatedAt}` (state.js:2337-2357). Membership on `theme.bookIds` (plain id array, no per-membership timestamp). **Multi-membership real** (`buildBookLensPanel` views.js:9376-9437). Baseline shelf "lenses" also union `book.genre` (5169+).
- **Value counts:** dedup-within-book then `valueCounts[val]+=1` once per book across the deduped shelf set (views.js:5532-5551) — the count==data proof to preserve when the rail→chips.

### THE ORDER-BY-LIFE SIGNAL TABLE (independently verified)
| priority | signal | field / accessor | write site | format | queryable @render? | coverage |
|---|---|---|---|---|---|---|
| 1 | latest marginalia | `marginaliaForBook(bookId)` last `.updatedAt`\|`.createdAt` | captureNote 3446 / marg editor 14607 / updateNotebookEntryBody state.js:2541 | ms | **YES** (9016-9039) | minority (authored) |
| 2 | book finished | `book.finishedAt` | views.js:9925 (once, first →read) | ms | YES (direct) | books ever read once |
| 3 | book added (FLOOR) | `book.addedAt` | all creation sites | ms | YES; precedent `(b.addedAt||0)` 5732/16691 | ~100% |
| — | status change (non-read) | — | none | — | **NO** | 0% |
| — | book.updatedAt / lastOpened / dateRead | — | none (dead/absent) | — | NO | 0% |
| — | artifact.updatedAt | `bookArtifacts[k].updatedAt` | write-once (ensureOneArtifact no-ops 2nd save) | ms | useless (create==update) | low |

**Composite (CARRIED, matches prompt's pin + shipped `_arcTouchedWord` views.js:3969-3987):**
`lastTouched(book) = max( addedAt||0, finishedAt||0, max over marginaliaForBook(book.id) of (e.updatedAt||0, e.createdAt||0) )`.
Books with no signal → floor is `addedAt` (~100%); truly signal-less (legacy, no addedAt) → 0 → sort LAST within band. **No invented signal. No HALT.**

### Marks display sources
- **Under-glow g0–g3 (annotation density):** the "existing maturity grammar" the brief cites **does not exist for books** (grep 0 hits). Real density source = `marginaliaForBook(bookId).length` (`margCount`, views.js:9872). → tier thresholds are UNRULED (Decision D1).
- **Ember (value marks, single coal, 2 steps):** `book.valueMarks.length` → marked / heavily-marked. Threshold minor (Decision D2).
- **Register tick:** live `var(--register-<tradition>)` (already wired 6116/6254).
- **Status dot:** live `--status-reading/read/will` (shelf-scoped 12869-12872).
- **Cover-less → spine:** derived (`buildSelfHealingCover` 7776; no stored flag; real ratio needs live query).

---

## 4. HEX → TOKEN MAP (HARD RULE #1: zero new hex outside theme.css)

The mockup inlined resolved literals for a self-contained file. The build wires LIVE tokens:

| mockup literal(s) | → build token | home |
|---|---|---|
| `#f4efe4 #fcf6e8 #fffdf8 #efe7d6` + line/scrim/ink/gold/radii/fonts | `--page --page-2 --surface --surface-2 --line-page(-2) --scrim --ink(-2/3/4) --gold(-deep/-hi) --radius-* --font-*` | theme.css (EXIST) |
| `--field-1..10` (arc-thread hue) | `--field-1..10` | universal-depth.css `:root` (global) — EXIST |
| `--card-1/2 --card-radius --sheet-gap` (the sheet) | same | theme.css (EXIST) |
| `--hour-*` twilight world | same | theme.css (EXIST, route ground) |
| `--reg-*` flattened tick hex | **`--register-<tradition>`** (NOT the mockup's flattened `--reg-*`) | theme.css (EXIST, live-wired) |
| `--status-*` renamed off `--lum-` | live `--status-reading/read/will` | components.css shelf scope (EXIST) |
| `--cavity-fill` | `var(--surface-2)` (no new token) | reference EXIST |
| `--board-face:#e3d8c1 --board-under:#b9a97e` | **NEW tokens** | → **theme.css (add, commented)** |
| `--wheat-sky-1/2/3 --wheat-glow --wheat-near-1/2 --wheat-ear-1/2 --wheat-far-1/2 --wheat-ear-far-1/2 --wheat-soil-1/2` | **NEW tokens** (honey/gold family; glow = `--gold-hi` @alpha) | → **theme.css (add, commented)** |
| cover/cap/row/col sizing vars (not hex) | scoped layout custom props | components.css shelf block (OK) |
| shadow rgba (`rgba(36,23,16,.x)`) | follow existing shelf-shadow convention (ink-derived) | components.css (OK, matches live) |

→ **Only genuinely-new hex = board (2) + wheat (~13) families → theme.css.** No new hex in components.css or views.js.

---

## 5. MOCKUP → LIVE DIFF MAP

| region | converts (live → mockup) | preserved (carried) | net-new |
|---|---|---|---|
| Ground | `.shelf.lum-amber-deep` sheet-on-twilight kept; interior recomposed | sheet mechanism (`--card-*`, sheet-gap, twilight route) | horizon strip + wheat |
| Header | toolbar+sidebar → **slim header** (search + mode-seg **moved from sidebar** + Manage + Add + value chips) | Manage sheet contents, local search, Add, Select→Move-to-arc | value chips (from rail), search-empty line |
| Sidebar | **dissolved** (F4); rails removed | classify/lens/value DATA computation (feeds grouping+chips) | — |
| NOW | — | still-reading source (`status==='reading'`) | **the desk** (F2/§3.4) |
| Body | flat filtered grid/rows → **bookcase bands** (carved cavities, gravity shelf-lines) → **THE WALL masonry** ≥760 | `renderShelfBook` DOM class names (carried into cover node), arc-thread/tick/status/select | cavity/board/gravity, `buildCoverNode`, `renderCase`, masonry, order-by-life, spines, ember/glow-from-real-data |
| Focused | — | — | focused view (F5/§3.7, mobile), See-all (A1), pile, yumi-lens-row (F7) |
| Illumination | filter-rebuild → **light/dim cover-opacity-only** (Law-1 rider) | value-count==data | applyIllumination |
| Ordering | Sort dropdown (added/status) → **order-by-life** | — | lifeSort/bandLifeKey |
| Chrome | — | Add FAB, Bloom, selectbar (untouched) | — |

**Files in scope:** `js/views.js` · `assets/components.css` · `assets/theme.css` (new tokens only) · `sw.js` (v3.242). **Out:** `state.js`/`integrations.js` (display-only round — confirmed no schema/write need). Byte-locks untouched.

---

## 6. FORKS + DECISIONS (for Preston — THE FORK RULE / FORK-VERBATIM)

**Genuine forks (need a ruling before/at build):**
- **D1 — g0–g3 density tiers.** No book density grammar exists. Build must map `marginaliaForBook().length` → g0/g1/g2/g3. UNRULED. *Proposed default:* 0→g0, 1–2→g1, 3–5→g2, 6+→g3 (g0=absence, §3.3).
- **D2 — ember steps.** `valueMarks.length` → marked / heavily-marked cutoff. *Proposed default (mockup mapping):* ≥1 marks → marked; ≥2 → heavy.
- **D4 — desk carrying-question source.** No per-book question field. *Proposed default:* ship NOW = still-reading only (sparse-honest, brief recon-item-3 fallback); the carrying-question line renders only if a source is chosen (option: books with a `question`-register notebook entry). Preston's call.
- **D5 — Covers|List vs Covers|Compact.** Live has a real List view (`renderShelfBookRow`); the felt-passed mockup replaced it with a cosmetic **Covers|Compact** density seg. NON-GOAL says "preserve Manage contents." Collision → Preston. *Proposed:* follow the felt-passed mockup (Covers|Compact); retire List (the whole composition is covers-on-shelves) — OR preserve List as band-grouped rows (net-new).
- **F7 — dead 16695 `renderShelfBookRow` call.** *Proposed:* keep the row renderer's `(book,isAlight,arcs)` signature stable so dead source stays parse-valid; flag the tree for S-B deletion. (Ignore is safe today; naming it per FORK-VERBATIM.)

**Carried (mechanical / prompt-pinned — stated, not asked):**
- Order-by-life composite (§3) — pinned by prompt + census.
- Sort dropdown removed (order-by-life supersedes it; mockup has none) — a visible control disappears; flagged for awareness.
- Signed-out hard gate preserved (mockup is signed-in only).
- Lens-ask copy: live is "Ask Yumi for more lenses" (brief's "Ask Yumi to see your shelf" is not in the repo) — keep live copy unless ruled otherwise.

---

## 7. PROPOSED SLICE PLAN (staged, each gated; NO push till Preston's word)

Vertical slices (CSS+JS+tokens together per region so each commit is coherent-ish; nothing ships until the end).

- **S1 — THE SHELL.** theme.css tokens (board + wheat) · new shelf CSS for horizon/slim-header/desk · rewrite `renderShelf` shell (strip node, slim header with mode-seg moved from sidebar + carried Manage/search/Add/value-chips, desk, empty `#caseRoot`), `buildWheat`, `renderDesk` (still-reading), sidebar dissolved. **Preserve:** signed-out hard gate, router cleanup 427-442, Manage sheet, search wiring, classify/lens/value DATA compute.
  *Gate:* parse (cscript views.js); byte delta; **no CSS bleed** on Home/Arcs/Notebook/Book-detail (render each); wheat containment (64@390 / 104@≥760, heads clear ≥2px); desk renders + empty-state line; console clean; signed-out preserved.
- **S2 — THE CASE + GRAVITY + ORDER-BY-LIFE + THE WALL.** cavity/board/wall/cover-node CSS · `renderCase`, `buildBandElement`, `buildCavityShelfline`, `buildCoverNode` (re-composed `renderShelfBook`, REAL data: real covers, spines, tick, arcthread, ember from valueMarks [D2], glow from marginalia count [D1]) · `lifeSort`/`bandLifeKey` · `wallColumns` masonry.
  *Gate:* gravity bottom-spread ≤1px + zero stagger (per row, all bands, ×widths); aspect 2:3 ±6% on REAL covers; wall cols 2/1279·3/1919·4/≥1920; zero band splits; zero h-scroll ≥760; order-by-life within-band + band order; real spines for cover-less; console clean.
- **S3 — FOCUSED VIEW + SEE-ALL + PILE + ILLUMINATION.** focused-view/seeall/pile/yumi-lens-row CSS+JS · `applyIllumination` (value chips + search light/dim) · select-mode integration · search-empty line.
  *Gate:* focused view opens/closes (mobile), strip+desk absent; See-all cap = 2 rows @390; pile renders (categories) / yumi-lens-row (lenses); **illumination = cover-opacity only, cavity ground unchanged** (Law-1 rider, sample cavity bg before==lit==after); chip counts sum == real deduped value counts; select→Move-to-arc round-trips.
- **S4 — CLOSE.** Full pass-2 verification suite re-run against the LIVE build at real scale (L3): gravity tables · aspect on real covers · wall col counts + zero splits + zero h-scroll ≥760 · wheat containment · chrome clearance ×3 scroll ×3 width · illumination rider · chip sums · console · byte deltas pre-stated vs actual. Acceptance card (CLOSE) verbatim law sentences @390+1280/1920. Completeness inventory (8 rows × both surfaces). Cache bump v3.242. Builder regen rides final commit. sequence.md + BOARD update. Commit(s) — **NO PUSH**.

**Byte ballpark (FLOORS, measured before/after — not predictions, L2):** theme.css +~1KB (15 tokens). components.css: shelf overlay replace + bookcase/wall/wheat/gravity → est. **+6–12KB**. views.js: renderShelf rewrite removes sidebar/rail machinery, adds bookcase/wall/wheat/masonry/life-sort → est. **net −2KB to +8KB** (genuinely uncertain; sidebar dissolution offsets the new engine). sw.js +0 (version string). Real bands stated per-slice at build.

---

## 8. RISK REGISTER

1. **Shared renderers** — RESOLVED: renderShelfBook shelf-only; renderShelfBookRow's 2nd site is dead (F7). Low risk with signature stability.
2. **Real-cover variability** — the aspect/gravity laws must hold on REAL covers (varied dimensions) + real cover-less ratio → real spines. Verify at scale on prestonpraxistest, not the fixture. (L3.)
3. **CSS bleed (global stylesheet)** — replacing the shelf overlay is scoped to `.shelf.lum-amber-deep` + shelf-only class names, but S1/S2 must render Home/Arcs/Notebook/Book-detail to prove zero bleed (L8, the notebook-broke-arcs precedent).
4. **Order-by-life at scale** — the composite touches `notebookEntries` per book each render; verify perf acceptable at ~130 books (mirrors existing full-rerender-per-filter pattern).
5. **Masonry `offsetHeight` reflow** — the wall's greedy shortest-column fill forces layout per band; watch cost at 17 bands × 3 widths. Life-order binds fill → residual column-delta is structural (flagged in the mockup pass, felt-call).
6. **Lazy classify orchestration** — category bands depend on `classifyBookLocal` + the lazy Sonnet batch (`shelfCategorizing`/`shelfClassifyGen`); it must survive re-grouping untouched (recon item 6). Preserve.
7. **Stale docs** — `docs/studio/books.md` (170 commits behind) + memory `surface_books_shelf.md` (logged-out gate wrong) — build against LIVE, not them; correct docs at close.
8. **OWNER-VIEWPORT** — verify at 1360 (Preston's real CSS px) FIRST, then 1280/1920 corroborate; felt pass outranks all metrics.

---

## 9. RESIDUAL DOC-CURRENCY NOTES (correct at close, ride the diff)
- `sequence.md` `## Now` checklist still lists FINISH-CHOREO item 1 unchecked though S2 closed in `4a3c2e3` — re-order at close.
- `books.md` anchors stale (render_fn line numbers 170 commits off) — refresh at close.
- `BUILD_STATE.md` stamped v3.172 (~69 versions behind) — pre-existing, note only.
- memory `surface_books_shelf.md` — logged-out gate now HARD; update.

HALT — awaiting Preston's go for the build (and rulings on D1/D2/D4/D5/F7).
