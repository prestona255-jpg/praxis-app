# Wave 8 · Lane B — Global Search — STAGE 0 RECON (read-only)

**Repo:** HEAD `48d4fcb` == origin/main. `sw.js` CACHE_VERSION `praxis-v3.171`. Foundations
byte-locked & UNCHANGED: `lumen-amber.css` `9879ddb83a7e68e8378c621e473b0a57` (14,681 B),
`marks.js` `772886c049d0d6d03d341507e602d88a` (10,255 B). Render rig up (:8760, CDP 390
matchMedia=true, app renders). Evidence: 4-agent recon workflow + adversarial verify (HIGH),
plus my own reads.

## Screenshot tool (Protocol #1)
`preview_screenshot` **FAILS this session** — two 30s timeouts on `#home` (third consecutive
wave). → Deferral path: DOM/computed-style battery at Stage 1; final visual PASS deferred to
Preston on the live deploy.

## 1. Route
`renderRoute()` (views.js:343–677) is a linear `if (parts[0]===… ) { …; return; }` chain ending
in an unguarded catch-all → `renderNotebook()` (views.js:668–676). **`#search` is unclaimed**
(grep-clean repo-wide). A `#search` branch inserts **before line 668** (copy the `#profile`
pattern at 634–641). Two more views.js edits for full parity: (a) add `search:1` to
`umberGroundDark` (views.js:373) so `#search` gets the dark ground; (b) add a `'search'` clause to
the `activeRoute` nav-highlight chain (389–417) — else it defaults to lighting "Notebook".

**Row route targets (all confirmed):** arc → `#arc/<id>` (views.js:545) · sub-theory →
`#subtheory/<id>` (views.js:536 — the plain page, **not** `/build`) · book → `#book/<id>`
(views.js:477) · **note → NO standalone route** → falls back to `#notebook` (the shipped
spotlight.js:176 precedent). Search note rows route to `#notebook`.

## 2. Nav search entry — THE ONE OPEN DECISION
The nav pill (index.html:22–25, `.app-nav-search` + `.app-nav-search-input` + ⌘K) is **inert
markup**; `spotlight.js:432–440` wires its **click → opens the ⌘K modal overlay** (not a route).
Overlay rows already hash-navigate (`spotlightSelectRoute`, spotlight.js:374) but only to existing
surfaces. **Routing the nav entry to `#search` requires editing `js/spotlight.js`** — a 3rd file
beyond the declared dirty set (views.js + components.css). This is the HALT question (below).

## 3. Data accessors + NO-BACKING (bind real signal, never fabricate)
| Kind | Read path | Real fields (crumb source) | Mockup field with NO backing → substitution |
|---|---|---|---|
| **Book** | `state.userBooks[uid].bookIds` → `state.books` (views.js:3190); signed-out = full `state.books` | title, author, `coverUrl` (else `bookAmberCover` typeset fallback), `statusText(status)` → "Currently reading/Have read/Will read" (state.js:464) | — (crumb "Library · read" → real `statusText`) |
| **Arc** | `state.arcs` (state.js:1765) | title; sub-count `_arcCardCounts`/`_arcSubsOf` (views.js:2665/2709); thread count = `_arcDetailBuildSubTheoryData(arc).edges.length` (no reusable helper — compute inline) | ⛔ **"glowing/gathering" status + glow color DO NOT EXIST** → use real `_arcMaturityWord` (seed/forming/warming/mature/bright, views.js:2737); **arc glyph = neutral gold** (no per-arc color) |
| **Sub-theory** | `state.subTheories` (state.js:1910) | `header`; `arcId`→`arc.title`; `{markShape,markColor}` real optional 0–15 ints else `stHashIndices` (views.js:6748); maturity `_stComputeMaturity` (views.js:10528) | ⛔ **"rooted/gathering/new" vocabulary DOESN'T EXIST** → use the real sub-detail band (nascent/developing/established, views.js:8702) |
| **Note** | `state.notebookEntries` (state.js:29) | `body` (snippet, CSS 2-line clamp); `register` → `notebookRegisterLabel` (Marginalia/Journal/Question, views.js:1706); source book `bookIds[0]`→`state.books.title` | ⛔ **NO title field** → derive from `body` (`_stEntryPreview`-style truncate, views.js:10587); ⛔ **NO page-ref ("p.61")** → omit entirely; `arcIds`→arc.title is never rendered today → build fresh; bookless/arcless → "in Notebook" |

**Yumi-cyan covenant note (I caught):** the mockup tints the **note** kind's chip dot + note icon
cyan `#7fd0f0`, but cyan (`--lum-cyan`) is Yumi-reserved. The Yumi **cross-cut** correctly uses
cyan (it *is* Yumi); the **note** dot/icon must use a **non-cyan** token (e.g. `--lum-ink-3`). I'll
bind it that way — flagged, not fabricated.

## 4. Glyph (Verdict B) — reuse, NO arc-constellation.js edit
`_stPickerMarkSvg(subId, shapeIdx, colorIdx, pal, neutral)` (views.js:7862–7871) wraps
`window.stRenderMarkMarkup` (arc-constellation.js:1812, the **exact `_stRenderShapes` field
vocabulary** via `_ST_MARK_TABLE`) into a self-contained `<svg viewBox="-60 -60 120 120"
style="width:100%;height:100%">` + the shared `tfa-shine` def. It's **already** used at
`_accountSubTheoryRow` (views.js:13804–13818) as a colorful ~26px list-row glyph
(`.account-row-mark` 26×26, components.css:7246). **Search reuses it verbatim** → a new
`.search-row-mark` 30×30 host box + `_stPickerMarkSvg(sub.id, shape, color, pal, false)`. **No
arc-constellation.js edit; no marks.js.** (`bookSubMarkHTML` uses PraxisMarks → WRONG per Verdict
B; not used.)

## 5. Index verdict — build once on entry + in-memory filter
`notebookEntries` is the only unbounded, continuously-growing collection (plausibly 500–2000+ for a
heavy user; books ~100–300, arcs ~10–40, subs ~50–150; no caps anywhere). Shipped `spotlight.js`
re-scans raw state per keystroke with **zero debounce** — tolerated at current scale. For `#search`:
**flatten all 4 kinds into a per-item haystack index ONCE on route-entry, then substring-filter the
in-memory array per keystroke** — cheaper than re-deriving arc edges/counts per keystroke. Given
notes' scale I'll add a **light input debounce (~90–120ms)** as defense.

## 6. Screenshot tool: FAILS (see §Protocol). Render rig otherwise green.

## 7. PLANNED EDIT LIST + predicted byte deltas
- **js/views.js** — `renderSearch()` (input + scope + chips w/ live counts + gated cross-cut seam +
  grouped results Arcs→Subs→Books→Notes + highlight + honest states + index-build + filter + chip
  handler + row routes), a small `_searchSubMarkHTML` glyph wrapper, the `#search` route branch,
  `umberGroundDark search:1`, and the `activeRoute 'search'` clause. Predicted **+10,000…+15,000 B**.
- **assets/components.css** — `.lum-amber` search block (shell/input/focus-ring, scope line, chips,
  cross-cut, groups, rows, `.search-row-mark`, empty states, `mark` highlight) + the 759 media
  block. Tokens only. Predicted **+3,000…+5,000 B**.
- **js/spotlight.js** — ONLY if the nav-entry wiring (below) is approved: ~1–3 lines. **+150…+300 B**.

**Predicted dirty set (LOCKED):** `js/views.js` + `assets/components.css` + `js/spotlight.js`.
Anything beyond halts.

## DECISION (Preston, Stage-0 HALT): nav pill CLICK → route to `#search`
Wire the `.app-nav-search` pill click (spotlight.js:434–439) to `location.hash = '#search'` (the
full search page) instead of `openSpotlight(...)`. **⌘K keeps opening the quick overlay** (separate
global keydown, spotlight.js:411–427 — untouched). Honors canon §4-C "keep the ⌘K search."
`js/spotlight.js` is now in the dirty set (~1–3 lines, +150…+300 B). index.html untouched.

## SPOTLIGHT REUSE DETERMINATION (Stage 1 pre-index gate): BUILD FRESH
`spotlightSearch` (spotlight.js:47–186) scans all 4 kinds but is nav-overlay-coupled: hard-capped
at 5/group (`SPOTLIGHT_GROUP_CAP`), returns presentation-shaped `{label,type,route}` (discards the
per-record fields #search rows need — marks, covers, statuses, counts, snippets, highlights), and
uses a different grouping (Authors group; arcs+notes merged) + haystacks (books title-only). Reuse
would cap #search at 5/group and preclude the rich rows; exposing an uncapped field-rich index
means rebuilding spotlight = out of scope (canon §4-C). **One-line rationale:** spotlight's search
is hard-capped at 5/group and presentation-shaped, so #search builds its own uncapped flatten-once
index — the only overlap (case-insensitive `indexOf`) is ~2 trivial lines, not a reusable engine, and
consolidation would require the out-of-scope spotlight refactor. NOT the mark-renderer duplication
class (different data contracts, not the same contract implemented twice).

## DEBT (logged per Preston — NOT fixed this wave)
**Per-kind haystack enumeration is now duplicated** across `spotlight.js` (`spotlightSearch`,
:47–186) and views.js (`#search` flatten-once index). Adding a kind, or changing note/entry
structure, requires updating BOTH. **Consolidation path (for whenever spotlight is next touched):**
a single shared corpus builder — e.g. `buildSearchCorpus()` returning `[{kind, id, title, sub, hay,
route, …}]` — that both surfaces consume (spotlight groups+caps it for the overlay; #search filters
it uncapped for the page). **Second reason to consolidate — a real divergence today:** spotlight
matches **book title only** + a **separate Authors group**, while #search matches **title + author**
in one Books group — so the ⌘K overlay and the #search page can return **different book results for
the same query**. Not the mark-renderer duplication class (different data contracts), but genuine
maintenance debt to retire when spotlight is reworked.

## STAGE 0 CLOSE — HALT
Scope locked (3-file dirty set). Real-signal substitutions, non-cyan notes, glyph reuse,
index-once, build-fresh determination, and the duplication debt all recorded. No edits/stages/
commits made.
