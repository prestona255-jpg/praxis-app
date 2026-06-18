# Books #6 — Stage 0 recon + live-vs-mockup diff

Live baseline: **CACHE_VERSION v3.119**. Spec: `books-mockup.html` (1337 lines, repo root).

## Baseline stats (measured before any edit)
| file | bytes | lines | parse |
|---|---|---|---|
| js/views.js | 465407 | 11134 | PASS (`new Function`) |
| js/state.js | 92426 | 2220 | PASS |
| js/integrations.js | 64574 | 1646 | live-boot (has `.then`) |
| js/yumi-ui.js | 46209 | 1188 | — |
| assets/components.css | 235259 | 7775 | — |
| assets/theme.css | 20267 | 424 | — |
| sw.js | 4788 | 131 | CACHE_VERSION praxis-v3.119 |

## Anchor map (file:line)
- **Shelf card cover** — `renderShelfBook` views.js:2786; img branch 2801–2806 (**no onerror** ← bug); placeholder branch 2807–2822 (`.shelf-book-cover-placeholder` + pending-title + "cover pending").
- **Shelf list row** — `renderShelfBookRow` views.js:2888 (no cover thumb; not in scope).
- **Review-row cover** — `makeReviewCover` views.js:4188 (ALREADY walks `coverCandidates` on `<img>` error → `.cover-pending`; no-match → `.cover-unknown` "?"). cp-lab text = "no cover".
- **Read-status control** — `makeReadStatusControl` views.js:4228 (defaults Have read).
- **Review screen** — `openBookReview` views.js:4265; rows render ~4311–4460; `.rrow`/`.rrow-main`/`.rrow-meta`/`.rrow-flags`.
- **Confirm/write** — `confirmReviewBooks` views.js:4470; writes record 4495–4500 — saves `coverUrl = rs.book.coverUrl || null` but **NOT coverCandidates** ← persistence bug.
- **Book detail** — `renderBookDetail` views.js:4867; cover branch 4906–4916 (img **no onerror**; placeholder is an EMPTY div ← bug); actions block starts 5163; status branches 5224–5285; themes 5292–5353; `if(user){…}else{signin}` ends 5363.
- **Cleanup scan** — `scanLibraryForCleanup` views.js:4517 (missing-cover = null/empty coverUrl ONLY ← undercount); dup key = title+author (4531).
- **Merge dupes** — `mergeBookDuplicates` views.js:4547.
- **Cleanup UI** — `openLibraryCleanup` views.js:4640 (summary 2 stats + dup items + missing-cover items; **no hero, no wrong-cover type, no 3rd "total" stat styled `warn`-less**).
- **Barcode scanner** — `openBarcodeScanner` views.js:3963 (native `BarcodeDetector` + getUserMedia 4081; ISBN type-in fallback 4024; **no lib for browsers lacking BarcodeDetector** ← iPhone Safari falls to type-in).
- **Resolver** — `resolveBook` integrations.js:1560; `scoreVolume` 1496; `titleCloseness` 1479; `volumeToBook` 1518 (builds `coverCandidates` [OL-by-isbn, google]); strong gate 1618 (`score>=55 && closeness>=0.6`).
- **Merge / durability** — `mergeRemoteBookDoc` integrations.js:474 (deletes local id if `!remoteHas && !isBookPending`; resurrects remote ids into nextIds + books — **no pendingBookDeletes guard** ← Stage 6).
- **Pending-sync helpers** — state.js:633–694 (`pendingBooksKey`/get/mark/is/clear/`flushPendingBooks`). Flush registered in index.html:119–133 (visibilitychange hidden + pagehide → flushPendingBooks → saveState booksDirty chokepoint).
- **Book schema** — `ensureBookFields` state.js:387 (tradition, traditionOverride, pageCount, publisher, year, description, rating, dateRead). `genBookId` state.js:768. `normalizeStatus` state.js:441 (legacy want/finished → will-read/read).
- **Bloom hint (FAB)** — `buildYumiBloom` yumi-ui.js:362; per-route line `YUMI_BLOOM_LINES` yumi-ui.js:334–342 ("tap to find lenses in your library" books / "tap to sit with this book together" book+artifact). CSS `.yumi-bloom` components.css:14 (`position:fixed; bottom/right:var(--sp-5); z-index:9999`); `.yumi-bloom-line` max-width 184px. SHARED across every surface.
- **Safe-area** — `viewport-fit=cover` IS set (index.html:5); **zero `env(safe-area-inset-*)` in CSS** ← Stage 4(ii).
- **Cover CSS** — `.cover-img`/`.cover-pending` components.css:7700–7703 (matches mockup). `.shelf-book-cover-placeholder` components.css:2101 — **hardcoded hex** `linear-gradient(160deg,#ecdcae,#cfb06a)` (2109) ← pre-existing token violation; mockup uses var(--surface),var(--sunk).

## Per-screen divergence (live vs mockup)
**Shelf grid (mockup C top):** broken coverUrl → broken `<img>` ("?"/blank), never falls to placeholder (no onerror). Null → placeholder OK. Placeholder gradient hardcoded-hex (token drift). N/M covers ✗ on broken.

**A — Review & Confirm:** structure matches (rrow, rstatus default read, conf flags, no-cover .cover-pending, no-match .cover-unknown, "not this one?"). makeReviewCover already correct. Gaps: (1) cp-lab says "no cover" not "cover pending" (minor). (2) confirm doesn't persist coverCandidates → shown≠saved.

**B — Edition picker:** present (need live confirm of `.edition-picker`/`.ep-grid`/`.edition-card`). Verify-only.

**C — Add & barcode:** add entry points present (Resolve covers/Scan shelf/Scan barcode/Tidy/Bulk/+Add). Barcode view present but **camera dead on iPhone Safari** (no BarcodeDetector, no lib). ISBN fallback present.

**D — Book detail:** matches mockup actions (Add to arc primary / Send-to-sub + Add-marginalia pair / status branch / Fix this book / artifact). Gaps: (1) cover img no onerror; placeholder is an EMPTY div (no typographic title/label) ← bug. (2) no Remove/Delete action ← Stage 6.

**E — Library cleanup:** summary present but **missing: the before→after hero ("We found the missing covers"), the wrong-cover item type, and the 3rd "112 total" stat tile**. Detection **undercounts** missing covers (null-only, not broken).

## Stage plan (decisions)
1. **Cover integrity** — extract shared `makeBookCover(book)` (candidate-walk + onerror → `.cover-pending` typographic title+label; null → placeholder). Adopt in shelf card + book detail (review already uses its own). Persist `coverCandidates` in `confirmReviewBooks` + add to `ensureBookFields` + `mergeRemoteBookDoc` carries it (Firestore-merge footgun). Align shelf placeholder gradient to tokens.
2. **Matcher** — `scoreVolume`: penalize no-ISBN (−12), no-image (−10), periodical/index/proceedings title markers (−20), implausibly-old year (<1900, −12). Strong gate: require `score>=60 && closeness>=0.6 && volumeIsbn(top)` else 'weak' (flagged). ISBN-query stays strong. Pure-logic cscript harness verify.
3. **Cleanup** — runtime broken-cover registry populated by `makeBookCover` when candidates exhaust → `scanLibraryForCleanup` counts null/empty OR registry-broken. Add hero + 3rd stat + wrong-cover type rendering (honest residual: auto wrong-cover detection is heuristic-limited).
4. **Mobile** — bloom: add bottom scroll-gutter on the page bodies (mobile) so content clears the FAB; verify notebook unaffected. Safe-area: `padding-top: max(<existing>, env(safe-area-inset-top))` on nav / top toolbars.
5. **Barcode** — when `!hasDetector`, lazy-load @zxing/library (CDN ESM, on-demand `import()` or script tag) and decode from the video stream; route ISBN to resolver; keep type-in fallback + messaging. Lib NEVER in core bundle.
6. **Delete** — `pendingBookDeletes` set in state.js (symmetric to pendingBookSync); `deleteBook(uid,id)` removes from books + bookIds + cleans arc/sub-theory/marginalia/theme refs + markBookDeletePending + markBooksDirty + saveState; mergeRemoteBookDoc skips ids in pendingBookDeletes (no resurrect) + clears on confirmed remote removal. UI: confirm-gated `.btn-danger` "Remove from shelf" on detail + a shelf-reachable path. flush already covers the push.
7. **Sweep** — re-diff, bump v3.119→v3.120, smoke, parse/token/diff, re-confirm P0 + delete guard. STOP at ship gate.

## ES3 / hazards
- var/function, two-arg `.then(ok,err)`, no .catch/.finally/const/let/arrow/class/backtick. zxing lib (Stage 5) = exempt external module; loader code is ES3.
- CSS = theme.css tokens only (flag the pre-existing #ecdcae/#cfb06a placeholder hex).
- localhost Google sign-in broken → localhost = logic + DOM fidelity (preview/sim); destructive + real-network = live Charles at ship. NEVER destructive-test prestona255.
- Firestore-merge bypasses migrate() — any new persisted book field must be carried by mergeRemoteBookDoc/ensureBookFieldsAll.

No plan-changing ambiguity surfaced → continue to Stage 1.
