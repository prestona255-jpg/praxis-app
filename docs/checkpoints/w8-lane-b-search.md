# Wave 8 · Lane B — Global Search — STAGE 1 BUILD

New `#search` surface indexing books/arcs/sub-theories/notes. **Dirty set (tracked):**
`js/views.js` (+481/−1), `assets/components.css` (+79/−0), `js/spotlight.js` (+5/−1) — the
locked 3-file set. (`test-arc-constellation.html` pre-existing deletion — NOT staged.)
Foundations byte-locked & UNCHANGED: `lumen-amber.css` `9879ddb83a7e68e8378c621e473b0a57`
(14,681 B), `marks.js` `772886c049d0d6d03d341507e602d88a` (10,255 B). CACHE_VERSION still
`praxis-v3.171` (bump at Stage 2). arc-constellation.js / state.js / yumi-brain.js /
integrations.js / firestore.rules UNTOUCHED; no new dependency.

## Build-fresh determination (pre-index gate, resolved before wiring)
Characterized `spotlightSearch` (spotlight.js:47–186): scans all 4 kinds but is nav-overlay-coupled
(hard-capped at 5/group, returns presentation-shaped `{label,type,route}`, different grouping +
haystacks). Reuse is infeasible without rebuilding spotlight (out of scope). So `#search` builds its
own **uncapped flatten-once index**. **DEBT logged** (per Preston, see recon checkpoint): the
per-kind haystack enumeration is now duplicated across spotlight.js and views.js — consolidate into a
shared corpus builder when spotlight is next touched; note the real divergence (spotlight = book
title-only + separate Authors group; #search = title+author) means the overlay and page can return
different book results for the same query.

## What was built (views.js `renderSearch` + helpers, ~697–1158)
- **Flatten-once index** `_searchBuildIndex()`: books/arcs/sub-theories/notes → per-item `{kind,
  title, sub, snip, crumb, hay, route, +glyph}`. User-scoped (own `userId` OR `__praxis_seed__`;
  notes own-only; books via `userBooks[uid].bookIds` signed-in else full catalog). In-memory
  substring filter per keystroke, **~100ms debounce**.
- **Real-signal binds** (no fabrication): arc crumb → `_arcMaturityWord`; arc sub/thread counts →
  `_arcCardCounts` + `_arcDetailBuildSubTheoryData(arc).edges.length`; sub crumb →
  nascent/developing/established from `_stComputeMaturity`; book crumb → `statusText`; note title →
  `_stEntryPreview(body)`, register → `notebookRegisterLabel`, source → bookIds[0]/arcIds[0] title
  else "in Notebook"; **page-ref omitted**; **no arc glow color** (arcs have none).
- **Glyphs (Verdict B):** sub-theory → `_stPickerMarkSvg(sub.id, shape, color, pal, false)` — the
  FIELD `_stRenderShapes` vocabulary, NOT marks.js (no arc-constellation.js edit); book → cover
  `<img>` else typeset cloth fallback; arc → neutral **gold** constellation glyph (no per-arc color);
  note → **non-cyan** document icon (`--lum-ink-3`; cyan reserved for the seam).
- **Chips** (All/Books/Arcs/Sub-theories/Notes) with live counts that respect the query but ignore
  the active-kind filter; chip narrows, All resets.
- **Grouped results** Arcs→Sub-theories→Books→Notes, each headed with a count; match highlight via
  `_searchHighlight` (escapes all text, injects only `<mark>` — XSS-safe).
- **Cross-cut SEAM** `_searchYumiCrosscutSeam(container, eligible)` — named no-op; gate (≥3 kinds AND
  ≥4 hits) computed and passed in, but renders NOTHING. Container `:empty` hidden.
- **Honest states:** initial invitation (no query) + "Nothing matches "<q>" yet." (query via
  textContent — safe).
- **Route wiring:** `#search` branch (reads state only, no write/publish), `umberGroundDark search:1`
  (dark ground), `activeRoute 'search'` (no nav link → nothing lights).
- **spotlight.js:** the `.app-nav-search` pill click → `location.hash = '#search'`; the ⌘K overlay
  (onSpotlightKeydown) is untouched — coexisting quick-overlay + full-page search.

## Static gate
- **Parse:** cscript on the isolated renderSearch block (451 lines) → exit **0**; spotlight handler → exit **0**.
- **Foundation MD5s unchanged.** Zero `#hex` in the new `.search` CSS. Zero forbidden umber literals
  in all 3 files.
- **Byte deltas (reconcile vs Stage-0 prediction):**
  | File | Predicted | Actual | Note |
  |---|---|---|---|
  | views.js | +10–15KB | **+19,503 B** (481 lines) | **OVER by ~4.5KB** — my Stage-0 estimate was low; the full surface (8 helpers + renderSearch w/ index/chips/grouping/glyphs/states + 3 route edits) is ~481 lines. All added lines are the specified search surface — no scope creep (verify: the diff is entirely the renderSearch block + the 3 named route edits). Honest prediction-under, not a defect. |
  | components.css | +3–5KB | **+7,324 B** (79 lines) | OVER by ~2.3KB — same under-estimate; all intended search CSS. |
  | spotlight.js | +150–300B | **+317 B** | ~in band. |
- **Dirty set** = the locked 3 files only.

## Live verification (deferral path — screenshots DOWN this session)
`preview_screenshot` timed out on `#home` (2×, third consecutive wave). Per protocol: DOM/
computed-style battery, final visual PASS deferred to Preston on the live deploy. Seeded 3 books
(1 cover-less), 2 arcs, 4 sub-theories (threads), 3 notes (marginalia/journal/question).

| Check | Result |
|---|---|
| Surface + dark ground | `.search.lum-amber` present; `body[data-ground]=dark`; nav unlit (activeRoute='search') ✓ |
| Chip counts (no query) | All **12** = 3+2+4+3; Books3/Arcs2/Subs4/Notes3 ✓ |
| Query "hooks" → grouped/ordered | Arcs→Sub-theories→Books→Notes, each count 1 ✓ |
| Chip counts respect query, IGNORE active kind | filter to Sub-theories → only that group renders, counts unchanged (All4/Books1/Arcs1/Sub1/Notes1) ✓ |
| Real sub-theory glyph | `.search-row-mark svg` present (field `_stPickerMarkSvg`) ✓ |
| Match highlight | `<mark>hooks</mark>` ×3 ✓ |
| Route targets resolve | `#arc/arc1`, `#subtheory/st3`, `#book/bk1`, `#notebook` ✓ |
| Book cover / note glyph | cover-less → typeset fallback; note glyph `rgb(182,168,136)` = `--lum-ink-3` (**non-cyan**) ✓ |
| Cross-cut seam | eligible (4 kinds/4 hits) but **empty** — no visible text ✓ |
| Honest empty | "Nothing matches "zqxnomatchhere" yet." + counts 0 ✓ |
| 390 reflow (same-selector overrides) | input 24→**20px**, pad 52→**46px**, icon 20→**16px**, page 26→**16px**, res-title 19→**17px**; **no horizontal scroll** ✓ |
| Nav pill → #search | from #home, pill click → hash `#search` → surface renders ✓ |
| ⌘K overlay preserved | Ctrl+K opens the spotlight overlay (untouched) ✓ |

## Independent review (praxis-reviewer, pre-HOLD): CLEARED TO COMMIT
All 10 gates PASS. Confirmed: ES3-clean; foundations byte-locked; **XSS-safe** (every innerHTML
accounted for — `_searchHighlight` escapes all text + injects only `<mark>`; static SVGs;
`_stPickerMarkSvg` int/id args; empty-state query via textContent); **Verdict B** glyph (no
arc-constellation.js edit); seam is a genuine no-op; spotlight ⌘K binding outside the diff
(preserved); `kindCount` independent of `activeKind`; grouping order correct; note→#notebook;
real-signal accessors all exist; no `.set/.update/.delete`, `saveState` is the sibling pointer-clear
only. Byte-delta reconciled as CRLF accounting (LF-normalized ≈ builder numbers, no missing content).

## Logged-out sign-in prompt (added post-review, per Preston)
**Logged-out messaging was OUT of the original wave scope** (the prompt did not specify logged-out;
recon/build did not flag it). The reviewer surfaced it as a house-pattern gap; Preston asked to add
it as a **consistency fix**, reusing the sibling pattern (not a new treatment). Added
(`_searchEmptyEl(isInitial, q, loggedOut)` + `renderSearch` computes `loggedOut`):
- **Logged-out INITIAL:** copy → "Sign in to search everything you've gathered." (no longer implies
  gathered content) + sub "your books, arcs, sub-theories, and notes / are yours to search once you
  sign in" + a quiet **`.btn btn-primary` "Sign in"** button → `signInWithGoogle()` (the exact
  affordance from `buildNotebookSignedOut` / the shelf sign-in prompt). +1 CSS line (`.search-signin`
  margin) — no new visual treatment.
- **Logged-out EMPTY:** "Nothing matches "<q>" yet." + sub "…or sign in to search everything you've
  gathered" + the same Sign in button.
- **Logged-IN unchanged:** original "Everything you've gathered is searchable here." copy, NO button;
  results/chips/seam identical.

**Re-verified (live):** logged-out (real `getCurrentUser()===null`) initial → prompt + button ✓;
logged-out empty → nudge + button ✓; logged-in initial → original copy, no button ✓; logged-in query
→ groups/glyph/highlight/seam intact, no sign-in button ✓. Parse exit 0; delta +1,243 B views.js /
+68 B components.css; dirty set unchanged (3 files); foundations byte-locked.

## STAGE 1 CLOSE
All battery checks green (1280 + 390); reviewer CLEARED; logged-out prompt added + re-verified. Final
visual PASS is Preston's on the live deploy. Proceeding to Stage 2 commit (v3.172).
