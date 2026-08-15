# R-FIRSTSHELF — STAGE 0 RECON

R-FIRSTSHELF STARTED — report-first session, zero app-file edits, zero version bump.
Model: Opus 4.8 default effort. Gate/red-team subagents: Sonnet, frontmatter-pinned.

**Round shape:** SWEEP (recon → rulings → build; no mockup beat). shelf-look.md governs the visual
grammar. The missing thing is COMPOSITION AT LOW BOOK COUNTS — application of existing law, not new design.
**NEW ROUND LAW (recorded, not re-derived):** the small library is a first-class design case, not a skew case.

---

## STAGE 0.0 — GROUND TRUTH — PASS

- **HEAD** = `2e99b2f5000ecad84ce34193e2a5d07a94d5bb5f` · **origin/main** = same · **ahead/behind 0/0** (in sync).
- **CACHE_VERSION** = `praxis-v3.276` (`sw.js:10`).
- **`sh tools/ground-truth`**: hook gate ARMED (`core.hooksPath = hooks`), FIX-PROTOCOL v1.2, 7 agents present.
- **Tree status (`git status --porcelain`)**: exactly ONE modified tracked file — `M docs/checkpoints/r10-s1.md`
  (the S1 post-push status note; the expected dirt — rides this session's commit). Its diff is the push-hash
  fill-in + FELT CARD + the LIVE-verify-BLOCKED note (verified benign). No other tracked modification → no HALT.
  All other `??` entries are untracked (checkpoints, design zips, mockups) — reported, not touched.
- **Anchor liveness:** every reading-list file resolves EXCEPT `docs/studio/launch-runway.md` (the prompt's
  path) — the real file is `docs/launch-runway.md` (no `studio/` segment). Read at the real path; not a dead
  build anchor, a path typo in the reading list. All other anchors live.
- **Reported, NOT touched (per prompt):** the detached worktree `.claude/worktrees/zealous-bose-8a1e6a @ 13548b4`
  (two unmerged WRITING-CORE lane commits) and the untracked checkpoint docs.

## STAGE 0.1 — R10 PARK RECORD — LANDED

Wrote the park record into two files (docs-only, rides this commit):
- `docs/checkpoints/r10-s1.md` → new `## R10 PARK RECORD` section (S1 shipped v3.276 `2e99b2f`, felt-passed
  2026-08-09, PARKED AT S1 = statement-only, no dead affordance) recording the three survivals: (a) the open
  S2-0 HALT-1 sub+arc mark census; (b) the S2 "GATHERING" DoR/prompt hardened across two passes, UNSENT;
  (c) S1's un-walked legs — desktop keyboard door (rig-verified only) + the DevTools v3.276 read (ISD-blocked).
- `docs/studio/sequence.md` → a dated Re-plan log entry (2026-08-15) + a `## Next` R10-bullet annotation.
  No spine change / no retirement / no contradiction of a Preston decision → **no `PROPOSED:` flag** (correct
  per the guardrail). Source basis: `r10-s2-recon.md` (S2-0 recon complete, 18 anchors resolve, sole writer
  proven at views.js:10397, one HALT-1 question).

---

## STAGE 0.2 — THE PATH CENSUS (Shelve N → rendered shelf)

**The live call chain, file:line at every step:**

1. **Press "Shelve N".** `#scan` Shelf-mode review screen. The button is `#scan-rv-shelve`
   (`views.js:9286`, label `Shelve <span id="scan-rv-shelve-n">`), wired at `views.js:9304`
   (`rvShelve.addEventListener('click', scanShelve)`).
2. **`scanShelve()`** (`views.js:8915`): loops `scanResult.confident`, calls **`scanCommitBook({title, author,
   isbn, coverUrl, status:'reading'})`** (`views.js:8921`) per book → collects `createdIds`; sets
   `scanResult.confident = []`; `scanSaveDraft()` + `scanUpdateNavBadge()`; then **`scanShelveFlight(cb)`**.
3. **`scanCommitBook(spec)`** (`views.js:8508`): builds `state.books[id]` (`8514`), **`ensureBookFields`**
   (`8524` — the classification-fields chokepoint; sets `category=''`, `rawCategories=[]`), pushes to
   `state.userBooks[uid].bookIds` (`8525`), `markBookPending` P0 guard (`8526`), `markBooksDirty` + `saveState`
   (`8527-8528`), background `fetchAndApplyCover` if isbn present (`8529`). Returns the id. **No classification
   fires here** — only field-stamping.
4. **`scanShelveFlight(after)`** (`views.js:8934`): FELT SIGNATURE 3 — up to 12 covers fly to the glyph; on
   done → `after()` = **`scanShowReceipt(n)`**.
5. **`scanShowReceipt(n)`** (`views.js:8961`): shows the `#scan-receipt` banner ("Shelved **N**" + Undo, `9169`),
   auto-hides after **9 s** (`8966`), and calls **`scanRenderReview()`** — re-renders the review with the
   confident set gone (exceptions persist as the draft).

**WHERE THE USER LANDS:** **`#scan`. They do not move.** There is no `location.hash` change, no route to
`#books`, no navigation of any kind in the entire shelve path. The tray/review simply empties of the confident
set (they fly to the glyph), the receipt appears for 9 s, and any exceptions remain as a draft. The books were
written to `state` but **the user is never shown their new shelf.**

**WHAT FIRES CLASSIFICATION, AND WHEN:** nothing at shelve-time. `scanCommitBook` only stamps
`category=''`/`rawCategories=[]` via `ensureBookFields`. Classification fires **later and elsewhere** — the
FIRST time the user opens `#books` in **Categories mode** (the default; see §0.6): `renderShelfCase`
(`views.js:5483-5500`) calls `classifyBookLocal(b)` per book, collects the null-returns into `pending`, and
fires **`shelfMaybeClassify(pending)`** (`views.js:5378`) → the Sonnet batch. So classification is deferred to
the next shelf-open, and only in Categories mode.

**THE GAPS (where nothing happens):**
- **G-PATH-1 · no transition after shelve.** The tray empties; there is no designed hand-off to the shelf, no
  "view your shelf" affordance, no route change. The receipt is a dead-end banner (Undo only). *(The
  scan-round-brief SEAMS §Onboarding explicitly LEFT this: "the first successful scan's receipt links to the
  book on the Shelf — the hook is left; the teaching beat belongs to Onboarding." So this is a known,
  deliberately-deferred seam, not a regression.)*
- **G-PATH-2 · classification is invisible + deferred.** The newly-shelved books carry no category until the
  user (a) navigates to `#books` themselves AND (b) is in Categories mode. Until then they render in the
  **Unshelved pile** (`classifyBookLocal`→null→`pileBooks`, `views.js:5488`). The first Categories open silently
  fires a Sonnet batch.
- **G-PATH-3 · no lens hook.** No post-shelve path touches the lens machinery (see §0.5). An auto-offer has
  nothing to attach to today.

---

## STAGE 0.3 — SMALL-N SHELF

### PART A — STATIC: every composition rule with a count dependency (source-proven)

| Rule | Site | Count dependency |
|---|---|---|
| **Signed-out gate** | `renderShelf` `views.js:4324` | no user → `buildSignedOutPrompt`, return (never reaches composition) |
| **Zero-books empty** | `renderShelfCase` `views.js:5459-5476` | `books.length===0` → one line "Your shelf is open — add your first book: scan a spine, search a title, or paste a whole list." + "＋ Add a book"; **case returns early — no desk, no bands, no pile**; horizon + header still render |
| **Desk = reading only** | `renderShelfDesk` `views.js:5100-5104` | filters `normalizeStatus(b.status)==='reading'` |
| **Desk empty vs whole-lib empty** | `views.js:5105-5114` | `reading.length===0` AND `books.length===0` → return (no double-empty); else "Nothing in hand right now." |
| **Desk cap = 6** | `views.js:5119-5124` | `cap=6`; `shown=min(reading.length,6)`; renders `shown` `{now:true}` covers |
| **Desk "+N more" door** | `views.js:5125-5132` | `reading.length > shown` → `+<reading−shown> more reading →` → `openShelfFocusedBand('desk-reading',…)` |
| **Wall columns** | `shelfWallColumns` `views.js:5240-5245` | `window.innerWidth`: **≥1920→4 · ≥1280→3 · else→2** |
| **Mobile↔desktop divide** | `isMobileShelf` `views.js:5204` | `matchMedia('(max-width:759px)')` — mobile = single column (no `.wall`); desktop = THE WALL |
| **Mobile band cap (A1)** | `buildShelfShelfline` `views.js:5285-5301` | at <760: `perRow=max(2, floor((innerWidth−56+16)/92))`; `maxCells=perRow*2`; if `books.length>maxCells` → `maxCells−1` covers + a **"See all N"** tile |
| **Desktop / focused band** | `views.js:5279-5283` | focused OR ≥760 → ALL books, wrapped rows (no See-all) |
| **Category banding** | `renderShelfCase` `views.js:5483-5499` | per book `classifyBookLocal`: null→`pending`+`pile`; ''/Uncategorized→`pile`; else→`catMap[cat]`; bands built in `SHELF_CATEGORIES` order, life-sorted |
| **Lens banding** | `views.js:5501-5524` | groups by `state.userThemes` (userId-owned); a guest has none → 0 bands |
| **Band order = life** | `views.js:5528` | `bands.sort(life desc)` = masonry fill order |
| **THE WALL masonry** | `views.js:5534-5548` | `ncols` columns; each band → currently-shortest column (`offsetHeight` live measure); **a band never splits** |
| **Tails** | `views.js:5551-5556` | categories → `shelfBuildPile(pileBooks)` (if any); lenses → `shelfBuildLensRow(bandCount)` |

**Static gap the round names:** every count-dependent rule assumes the *books-and-bands exist to fill the
structure it draws.* The WALL always renders `shelfWallColumns()` columns **regardless of how many bands
exist** — nothing caps columns to `min(bandCount, wallCols)`. That is the low-count composition hole, proven
below.

### PART B — MEASURED (rig, localhost:8793, uid `d0tester` synthetic, force-settled, L19 visible-rects)

**Provenance (CAPTURE PROVENANCE law):** fresh renders taken 2026-08-15 on the committed rig
(`.claude/rig/serve.ps1`), synthetic books seeded with a ~70%-reading skew (L15) and category labels pre-set so
bands form **without firing the classifier** (zero model calls). Not prestona255 (unreachable behind the ISD
block; a synthetic fixture is honest for *composition*, per L11 — count-scale here; distribution-scale is
Preston's felt pass). Category spread per N: ncats=`ceil(N/4)` (N=5→2 bands, N=13→4, N=40→10).

**Desk (all widths — desk is width-independent):**

| N | reading | desk covers | "+N more" door |
|---|---|---|---|
| 0 | 0 | 0 (desk absent — whole-lib-empty early return) | — |
| 5 | 5 | 5 | none (5 ≤ 6) |
| 13 | 10 | 6 | **"+4 more reading →"** (10−6) ✓ sum-proven |
| 40 | 28 | 6 | **"+22 more reading →"** (28−6) ✓ sum-proven |

**THE WALL (desktop) — columns vs bands (the core finding):**

| N | bands | @1360 (3 cols) | @1920 (4 cols) | empty columns |
|---|---|---|---|---|
| 0 | 0 | empty-zero line, no wall | empty-zero line, no wall | — |
| 5 | 2 | cols `[1,1,0]` → **1 empty col** | cols `[1,1,0,0]` → **2 empty cols** | wall > bands |
| 13 | 4 | cols `[1,2,1]` (masonry) | cols `[1,1,1,1]` | 0 |
| 40 | 10 | cols `[4,3,3]` | cols `[3,3,2,2]` | 0 |

> **FINDING FS-1 (the round's core).** THE WALL renders `shelfWallColumns()` columns unconditionally, so any
> library with **fewer bands than columns** leaves visibly empty columns (measured: N=5 → 1 empty col @1360,
> 2 empty cols @1920). The masonry also leaves structural unevenness at small N (N=13 @1360: col heights
> 573/654/327). This is exactly "composition at low book counts" — application of the existing wall law, not
> new design. Empty columns = `max(0, wallCols − bandCount)`.

**Mobile (390) — the desk dominates the first screen:**

| N | horizon | header | desk row | case top | bands below fold |
|---|---|---|---|---|---|
| 0 | 64px | — | absent | 520 | 0 (empty-zero line) |
| 5 | 64px | 270px | **796px** | **1314** (below 844 fold) | 2/2 |
| 13 | 64px | — | ~800px | 1380 | 4/4 |
| 40 | 64px | — | ~800px | 1380 | 10/10 |

> **FINDING FS-2 (mobile small-N).** At 390 the "what you're carrying" desk covers render **92×250px each,
> 2-per-row** (measured), so 5 reading books make a **796px desk**; combined with the 64px horizon + 270px slim
> header, the **entire bookcase sits below the 844px fold at N=5** (case top = 1314px). A guest who shelves a
> first handful sees horizon + a big desk and must scroll ~1300px to reach any *shelved* band. The desk caps at
> 6 covers (~3 rows ≈ 800px), so this is the mobile ceiling, not unbounded — but at small N the desk *is* the
> first screen.

**Mobile See-all (A1 rule) — probe (N=13, all in ONE category):** the 13-book band rendered **5 covers + 1
"See all" tile** (`covers:5, seeall:1`) — confirms `maxCells=6` (perRow 3 × 2 rows) → `maxCells−1`=5 covers +
See-all when a band exceeds 2 rows. Evenly-spread libraries (≤6 per band) never trigger it.

**Horizon:** 64px @390, **104px @1360/1920** (matches shelf-look.md's 64/104). No horizontal overflow at any
N × width (`docScrollW ≤ vw` throughout).

---

## STAGE 0.4 — THE LENS FLOOR

**Grounding rule CONFIRMED** — `evalLensResponse(rawText, libraryTitles, valueNames)` (`yumi-brain.js:1085`):
1. `parseValueRetrofitArray(rawText)` null → return `[]` (unparseable/truncated rejected; `generateLenses`
   itself also throws on an unparseable reply, `976`/`1012`, so silence is impossible).
2. per lens: string `name` + string `why` + array `books`, else skip (`1094`).
3. trim name; empty skip (`1098`).
4. **`isBlockedLensName`** skip — `LENS_GEN_BLOCKLIST` = `fiction, nonfiction, non-fiction, self-help, general,
   miscellaneous, uncategorized, other` (`1020-1023`). This is the fit-guard.
5. **`nameCollidesWith(name, valueNames)`** skip + `[VL-1]` log — whole-word containment vs declared VALUES
   (`1101`).
6. **each `books[j]` must be a 1-based in-bounds index** into `libraryTitles`; out-of-bounds / non-numeric
   **dropped**; dedupe by index (`1110-1119`). → maps to canonical titles.
7. **`if (kept.length < 2) continue`** — a lens grounded in fewer than 2 in-library books is dropped (`1120`).
8. **cap 5** — `if (out.length >= 5) break` (`1127`). *(No per-lens book cap — the adopt path links every book.)*

**EVAL vs canned responses (real shipped `window.YumiBrain.evalLensResponse`, ZERO live model calls).**
Fixtures = real published titles in the library's critical-pedagogy domain (Freire/hooks/Lorde/Fanon/Foucault
…) — representative, **not scraped from prestona255** (unreachable behind the ISD block); privacy pin holds
(titles only). 5-book lib and 13-book lib. Survivor counts:

| Fixture · canned response | Survivors | What it proves |
|---|---|---|
| **5** · healthy (3 lenses, ≥2 books each, overlapping cites) | **3** | small lib CAN yield lenses if the model cites ≥2 books |
| **5** · 2 of 3 lenses cite only 1 book | **1** | `<2` drop bites |
| **5** · out-of-bounds indices (cite 8,12 of 5) | **1** | non-library indices dropped; lens falls under 2 → dropped |
| **5** · names "Nonfiction"/"Self-Help" + 1 real | **1** | blocklist bites |
| **5** · lens "Liberation" w/ declared value "Liberation" | **1** | value-collision drop bites |
| **13** · healthy (5 lenses, ≥2 books) | **5** | comfortably fills the cap |
| **13** · 7 lenses proposed | **5** | cap-5 bites (F, G dropped) |
| **13** · mixed junk (1-book, dup-index, OOB, 2 valid) | **2** | dedupe + `<2` + OOB all bite together |
| **13** · unparseable prose | **0** | parse-reject → `[]` |

> **FINDING FS-3 (the floor).** The eval is a *filter, never a generator* — it can only drop, never manufacture.
> So the real floor is the MODEL's, not the eval's: a 5-book library survives the plumbing (1–3 lenses,
> depending on whether the model cites ≥2 books per lens and avoids blocked/colliding names); a 13-book library
> comfortably fills the cap of 5. The mechanical floor per lens is **≥2 in-library books**. Whether a first
> shelf of ~5–13 books actually *yields* honest lenses is a live-Sonnet question the `LENS_GEN_SYSTEM` prompt
> self-limits ("if the library is too small or scattered … propose fewer") — deliberately NOT tested here (cost
> rail; it was not required to locate the floor).

**Dedupe source + payload covenant CONFIRMED:**
- `gatherLensLibraryMetadata` (`yumi-brain.js:882`) reads the **deduped `state.userBooks[uid].bookIds` index**
  when signed in (`886-901`), falls back to raw `state.books` signed-out; `pushBook` skips empty-title books
  (`891`). Caps annotated-first via `prioritizeValueBooks(…, VALUE_RETROFIT_MAX)` (`942`) — never binds at
  N≤13.
- **Outgoing payload is title/author/genre ONLY** — `buildLensGenUserMessage` (`949-971`) serializes
  `(i+1). "title" by author [genre]` + existing lens names + declared value names (the reader's own labels,
  not book contents). **`titleToId` is never serialized** (`946-948`, confirmed by read). Covenant intact: no
  notes, no marginalia, no book bodies.

---

## STAGE 0.5 — THE LENS TRIGGER

**Every call site:**
- **`generateLenses`** (`yumi-brain.js:976`, exported `3149`) — invoked from exactly ONE place:
  `startLensSuggest` (`yumi-ui.js:1623-1636`), which then runs `evalLensResponse`.
- **`PraxisLensPanel.open`** = `openLensPanel` (`yumi-ui.js:2066`, exposed `2103`) — invoked from exactly ONE
  place: **the shelf lens-row button** `shelfBuildLensRow` "Ask Yumi for more lenses" (`views.js:5432-5436`).

**Where the affordance lives / what route hosts it / gating:** the lens row is a **tail of `renderShelfCase` in
LENSES mode** (`views.js:5555`, `shelfBuildLensRow(bands.length)`), and doubles as the lens-empty state
("no lenses yet — Yumi can suggest some…", `5429-5431`). It lives on **`#books`, Lenses mode only.** Signed-in
gating is at the ROUTE level: `renderShelf` hard-gates signed-out (`views.js:4324`), so the button never
renders for a guest-without-account. `openLensPanel` builds the panel lazily and calls `renderLensPanelBody`,
which fires `startLensSuggest` **exactly once per session** when `status==='idle'` (the CO-1 STORED-ONCE law,
`yumi-ui.js:2072-2082`) — a re-open re-renders stored proposals without re-billing.

**Post-shelve hook for an auto-offer:** **NONE exists.** `scanShelve`→`scanShelveFlight`→`scanShowReceipt`→
`scanRenderReview` touches no lens code; `renderShelf` does not auto-open the panel. An auto-offer-after-first-
shelve would need a **new** hook (there is nothing to attach to today) — reported, not a defect.

**B1 per-identity cache reset INTACT** — `refreshYumiPanelForAuthChange` (`yumi-ui.js:890`): the CO-1 identity
reset `lensSuggestStatus='idle'` + `lensSuggestLenses=[]` sits at lines **906-907**, **ABOVE both early
returns** (the `if(force){…} else if(onb.active){return;}` at 912-918 and `if(!yumiBodyEl){return;}` at 919).
Confirmed by read: an onboarding-active session or a never-built panel cannot skip the wipe. This is the exact
cross-account lens-leak fix (user B seeing/adopting A's proposals); an auto-offer (more calls) does not weaken
it. Fires on both sign-in (`integrations.js:124`) and sign-out (`:626`, force) per the comment.

---

## STAGE 0.6 — CLASSIFICATION AT GUEST SCALE

**Do scan-added books carry `rawCategories`? NO — dropped at the scan seam.**
- `volumeToBook` (`integrations.js:2159`) DOES capture `rawCategories: vi.categories` (the Google Books BISAC
  strings) on its return object (`2182`).
- But **`scanCommitBook`** (`views.js:8508`) builds `state.books[id]` as a hand literal with only
  `{id,title,author,isbn,addedAt,status,genre,coverUrl}` (`8514-8523`) — **it never copies `rawCategories`**
  from `it.resolved.book`. Then `ensureBookFields` defaults `rawCategories=[]` (`state.js:412`). Scan shelve
  (`8921`) pulls only `it.author`/`it.cover`/`isbn` from the tray item, never the BISAC.

**The bigger finding — the keyword path is dead for ALL app-created books.** Full-corpus grep for
`rawCategories` (all `js/`): the ONLY sites are `volumeToBook`'s return (`2182`), `ensureBookFields`'s `[]`
default (`state.js:412`), and the two READERS (`classifyBooksViaLLM` subject builder `integrations.js:2252`;
`classifyBookLocal` keyword loop `state.js:626-629`). **No write path copies `rawCategories` onto a persisted
`state.books` record** — verified across every book-creation literal (manual `views.js:6245`, ISBN-bulk `6649`,
title-bulk `6662`, scan `8514`) and every resolution backfill (`7623-7636`, `10037-10044` copy
cover/isbn/year/pageCount/publisher/description/title/author — **never `rawCategories`**). So every app-added
book has `rawCategories=[]`.

**Which path a scanned book takes, and what it means:** `classifyBookLocal` (`state.js:613`) precedence =
`categoryOverride → cached category → rawCategories keyword → null`. A scanned (or any app-added) book has no
override, empty `category`, empty `rawCategories` → **returns null → `pending` → the Sonnet batch**
(`classifyBooksViaLLM`, `claude-sonnet-4-6`, `integrations.js:2197`, batch 20). The **keyword path (step 3) can
never fire** for an app-created book. The prompt's hypothesis ("if scanned books carry rawCategories they may
hit the keyword path first") is **falsified**: they don't carry it, and neither does any other add path, so
**Sonnet is the sole classifier for every new book.**

**A guest's first Categories open:** default grouping is **`categories`** (`getShelfGrouping` →
`ls('praxis_shelf_grouping','categories')`, `views.js:303`). So a fresh guest who scans a shelf and opens
`#books` lands in Categories mode with every book `category=''` → **all go to `pending`** → one Sonnet batch of
`ceil(N/20)` calls fires, caches `book.category`, re-renders into bands. Until that resolves they sit in the
**Unshelved pile**. *(prestona255's real category fields — noted in memory — got there via this same Sonnet
cache on prior opens, not the keyword path, which is consistent with the keyword path being dead for app
adds.)*

---

## STAGE 0.7 — GUEST COST

**Per-action cost picture (a guest's first session):**

| Action | Endpoint | Model | Per-request cap | Count cap |
|---|---|---|---|---|
| **1 shelf shot** | `shelf-vision.js` | **claude-opus-4-8** (client requests it; S5 comment `views.js:9043`; server allows `{sonnet-4-6, opus-4-8}`, default sonnet) | `MAX_TOKENS 4096` + model allow-list | **client 30/day counter only** |
| **Classification** | `claude-proxy.js` | claude-sonnet-4-6 (`integrations.js:2197`), batch 20, `max_tokens 1024`, temp 0 | proxy clamp `MAX_OUTPUT_TOKENS 4096` + `MAX_BODY_BYTES 1MiB` + allow-list = **sonnet-4-6 only** | **NONE** |
| **1 lens generation** | `claude-proxy.js` | claude-sonnet-4-6, `max_tokens 1024` (`yumi-brain.js:978`) | same proxy caps | **NONE** |

So a guest's first flow costs: **1 Opus shelf shot per shelf photo** + **1 Sonnet classify batch** (fires on
the first Categories open — the default mode — because every scanned book needs Sonnet, §0.6; `ceil(N/20)`
calls) + **1 Sonnet lens generation** if they tap "Ask Yumi for more lenses." Cover fetches ride the free
`google-books-proxy`.

**The 30/day counter:** `SCAN_SHELF_DAILY_CAP = 30` (`views.js:9046`), stored **client-side in localStorage**
as `praxis_scan_shelf_budget` = `{day, count}` (`scanShelfBudgetSpend` `9047-9056`; the yumi-budget idiom, no
schema). It counts **paid SHOTS only** (shelf + cover); barcode is free + uncounted; a CALL-FAILED refunds
(`scanShelfBudgetRefund` `9058`). It is **per-device, per-browser, and trivially reset** (clear localStorage /
switch device / new browser).

**Server-side ceiling — stated plainly: THERE IS NONE.** No endpoint carries a daily / per-user / rate / volume
limit (grep for daily|rate-limit|ceiling|per-day|429 across `claude-proxy.js` + `shelf-vision.js` = only the
per-request token cap). The only server controls are **per-request** (`max_tokens` clamp 4096, `MAX_BODY_BYTES`
1 MiB, model allow-list) plus the **`PRAXIS_CLIENT_KEY` gate — which is INERT when the env var is unset/empty**
(`claude-proxy.js:38-42`: "When the env var is UNSET/empty the request is [allowed]"; memory: still inert
pending the Netlify env var). Consequences: **classification (Sonnet) and lens generation (Sonnet) are uncapped
by count** — only shelf/cover shots are throttled, and only client-side. Per SC9 + `launch-runway.md`, the
**daily-ceiling server build + the Stage-2 JWT auth are named DEFERRED beta-gate items** — this recon confirms
they are still absent.

---

## STAGE 0.8 — THE THREE NITS (mechanism-report only, not fixed)

**NIT-1 · FAB overlaps "Review N" at 390 — mechanism contested.**
- The two elements: the review foot bar `.scan-rv-foot` holding **"Review N"** (`#scan-rv-walk`) + "Shelve N"
  (`#scan-rv-shelve`) is an **in-flow** bar (`views.js:9284-9286`); the global Yumi FAB `.yumi-bloom` is
  `position:fixed; bottom:calc(--sp-5 + safe-area); right:--sp-5; z-index:9999` (`components.css:19-29`).
- **But** `body.scan-active .yumi-bloom { display:none !important }` (`components.css:16955`), and `renderScan`
  sets `body.scan-active` (`views.js:9110`, removed by the router on exit). **So on `#scan` — including the
  review sub-screen — the global FAB is provably hidden.** The ledgered "Yumi FAB overlaps Review N" (from the
  felt-round-4 screenshot, `launch-runway.md`) therefore **cannot be the global `.yumi-bloom` on `#scan`**: it
  is hidden there. Most plausible mechanisms instead: (a) the overlapper is the scan surface's OWN bottom
  element (the `#scan-receipt` banner or `#scan-shelf-glyph` flight target), not the global FAB; or (b) the
  screenshot caught a frame where `scan-active` was momentarily absent (route-transition). **Recommendation:
  re-examine the actual screenshot state before scoping a fix — the ledger's "move the FAB" premise is
  contradicted by the CSS.** *(This is a recon delta beyond the ledger, surfaced under L2/claiming-absence.)*

**NIT-2 · Cihaar-class — an OCR author misspell ships CONFIDENT.**
- **Where confidence is assigned:** the shelf-vision MODEL returns a per-book `confidence`; `scanIsException`
  (`views.js:7942`) = `vb.confidence==='low' OR scanGbNoMatch(vb, resolved)`. A book with a correct title +
  Google-Books corroboration → **not an exception** → confident → shelves with the batch.
- **Where the author string is trusted:** `scanShelve` commits **`author: it.author`** (`views.js:8921`) — the
  tray item's author = `vb.author`, **the model's raw OCR read** (`scanClassify` `views.js:7959`). It does
  **not** use `it.resolved.book.author` (the canonical Google-Books author, which is present on the corroborating
  match). So the confidence gate validates the (title/identity) MATCH, but the committed **author string is
  never reconciled against the GB record** — an OCR author misspell (specimen "Cihaar" vs "Chaar") rides into a
  confidently-shelved book because GB corroborated the *book*, not the *author spelling*. The fix locus (not
  applied): prefer `it.resolved.book.author` over `it.author` on a strong match. *(Ledgered in
  `launch-runway.md` as a post-beta scan-accuracy pass.)*

**NIT-3 · Hallucinated author on hard spines — record-only.**
- On a hard/ambiguous spine the model can invent a plausible author (specimen "Nick Fentin, PhD" on
  Strangelove). Mechanism: such spines typically come back **low-confidence OR GB-no-match**, so `scanIsException`
  (`views.js:7942`) flags them → they land in **"Need a look"** → the exception walker (`scanResolveStep`
  `views.js:8885`), never auto-committed (Law 4 EXCEPTIONS NEVER AUTO-COMMIT). This is the SC6 compound
  threshold working as designed; the walker + GB anchor is the cure. **Record-only** (known model behavior, no
  fix owed) — distinct from NIT-2, whose failure mode is a *solid* identity carrying a subtly-wrong author that
  the exception gate does NOT catch.

---

## STAGE 0.9 — COMMIT + HALT

**Commit (docs-only, path-explicit, LOCAL — no push, no sw.js bump, no Builder regen):**
- `docs/checkpoints/firstshelf-recon.md` (this file — the recon)
- `docs/checkpoints/r10-s1.md` (the 0.1 park record + the pre-existing post-push rider)
- `docs/studio/sequence.md` (the 0.1 Re-plan entry + Next annotation)

**Proofs:** `sw.js` is **byte-identical** — never touched this session (`git status --porcelain sw.js` = empty).
`git diff --stat` (tracked) = only `r10-s1.md` + `sequence.md`; new file = only `firstshelf-recon.md`. No
foundations file, no `test-arc`, no source staged → the pre-commit hook passes a docs-only commit with no cache
bump (FIX-PROTOCOL §11). Checkpoint line count: **362 lines** (this file). Zero app-file edits, zero version
bump, zero Builder regen (NON-GOALS honored). Zero prestona255 reads/writes (unreachable behind the ISD block;
all measured evidence is the localhost rig, uid `d0tester` synthetic + canned lens inputs). Zero live model
calls.

---

# FORK CARD — R-FIRSTSHELF (HALT; each question carries my recommendation)

**Q1 · FS-1 (the round's core) — empty wall columns at low band-count.** THE WALL always renders
`shelfWallColumns()` columns (3 @1360 / 4 @1920) regardless of band count, so a small library leaves empty
columns (measured N=5: 1 empty @1360, 2 empty @1920). **Do we cap columns to `min(bandCount, wallCols)` (and/or
center a lone band) below a threshold?** → *Rec: YES — cap/center below the column count; pure application of
the wall law, the round's whole point (small library = first-class case).*

**Q2 · FS-2 — the mobile desk owns the first screen at small N.** At 390 the "in-hand" desk covers render
92×250px, 2-per-row, so 5 reading books = a 796px desk that pushes the entire bookcase below the fold (case
top 1314 > 844). **Do we shrink the mobile desk cover / lower the mobile desk cap / tighten the header so a
first-shelf guest sees shelved bands without a ~1300px scroll?** → *Rec: YES — smaller mobile "now" covers or a
lower mobile desk cap; the case should reach the first screen at small N.*

**Q3 · the first-shelf FLOW — post-shelve transition + lens auto-offer hook.** After "Shelve N" the user stays
on `#scan` with no route change and no hand-off (G-PATH-1); no post-shelve hook exists for the lens auto-offer
(§0.5). **Does R-FIRSTSHELF build (a) a designed transition from shelve → the shelf, and (b) the hook the lens
beat auto-offers from — and should the offer AUTO-FIRE `generateLenses` (a billed Sonnet call) or present a
button?** → *Rec: build the transition + an OFFER hook (a button, not an auto-fire — honors the CO-1 stored-once
law + cost), gated on a library-size floor; the receipt→book teaching copy stays Onboarding's per the brief
seam.*

**Q4 · SCOPE — the dead keyword-classification path (every new book costs Sonnet).** No app add path persists
`rawCategories`, so `classifyBookLocal`'s free keyword path is dead and **every scanned/added book always hits
the Sonnet classifier** on the first Categories open (§0.6). **Is re-wiring the add/scan paths to persist
`rawCategories` (restoring free keyword placement + cutting guest cost) in scope for R-FIRSTSHELF, or a separate
classification/cost task?** → *Rec: SEPARATE task — flag it now (it's a real cost + guest-scale finding) but
it's data-plumbing, out of a pure-composition round.*

**Q5 · SCOPE — the three nits.** NIT-1 (FAB-overlap) is **mis-attributed** — the global FAB is `display:none`
on `#scan`, so the ledger's premise is contradicted; it needs a screenshot re-check, not a FAB move. NIT-2
(Cihaar author) is a scan-owned 1-line locus (prefer GB author on strong match). NIT-3 is record-only. **Do any
of these enter R-FIRSTSHELF, or stay on their ledgered tracks (overnight / post-beta scan-accuracy)?** → *Rec:
keep all three on their existing tracks; re-examine NIT-1's screenshot before scoping any fix (do not move the
FAB).*

**HALT.** Report-first session complete. Zero app-file edits, zero sw.js bump, zero Builder regen, zero R10 S2
work, zero worktree cleanup, zero push. Awaiting Preston's rulings on Q1–Q5 (and the push word for the local
docs commit) before any build.

