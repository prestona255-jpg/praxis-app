# COVERS-DIAGNOSIS — Stage 0 recon (R-FIRSTSHELF)

COVERS-DIAGNOSIS STARTED

Date: 2026-08-29 · HEAD 1fe7cfc · CACHE_VERSION praxis-v3.281

## 1. Base correction

The prompt states base = 2fef2f1 / v3.279. **HEAD is 1fe7cfc / v3.281** — two
commits later (fbc947b v3.280, 1fe7cfc v3.281). Neither touched the cover
pipeline: `git diff --stat 2fef2f1..HEAD` = components.css, index.html,
js/intros.js, sw.js, one checkpoint doc. **js/views.js and js/integrations.js are
byte-identical to 2fef2f1**, so Preston's v3.279 device scan exercised the cover
code that is live now.

## 2. Protocol docs

READ: CLAUDE.md · PROTOCOL.md · docs/FIX-PROTOCOL.md (v1.2) · `sh tools/ground-truth`
(hook ARMED, 7 agents present).
LOOKED FOR, NOT FOUND: docs/LAUNCH-STATUS.md (FIX-PROTOCOL §1 Stage 2 names it as
the status ledger). The live ledgers are BOARD.md (root) +
docs/Checklist and Roadmap/BUILD_STATE.md + docs/studio/sequence.md.

## 3. THE DEFECT (found at recon, proven by grep + git log)

`scanResolveAndFill` (views.js:8809) is the ONLY live scan resolve path
(sole caller views.js:8799). Its item literal (views.js:8830-8835) sets
`cover` but **never sets `coverCandidates`**:

    var item = {
      title:…, author:…, spineText:…,
      confidence:…, resolved: rz,
      cover: (rz && rz.book && rz.book.coverUrl) ? rz.book.coverUrl : null,
      alternates:…, exception: isExc
    };

Four `scanCoverNode(…, item.coverCandidates)` call sites therefore receive
`undefined`: 8858 (tray), 8903 (review confident grid), 8916 (exceptions),
9008 (walker). `scanCoverNode` (8092) then falls back to `list = [coverUrl]`
— ONE url — and `coverUrl` is `coverCandidates[0]`, which `volumeToBook`
(integrations.js:2160-2183) sets to the **OpenLibrary** url whenever an ISBN
exists. Google Books art sits in `coverCandidates[1]` and is never tried.

The v3.279 S1 fix that was supposed to close this landed on **dead code**:
`scanClassify` (views.js:8016) carries the line
`coverCandidates: (rz && rz.book && rz.book.coverCandidates) ? … : []`
with the comment "carry the full OL->GB candidate list so the review cover +
the shelved record can self-heal". `grep -n "scanClassify" js/views.js` = 2
occurrences: the definition + a stale comment at 6873 ("#scan uses scanClassify
(S1)"). **Zero callers.** `git log -S "scanClassify("` = one commit (71c0bcf,
v3.260) where the single occurrence appeared — the count has never risen, so it
has had no caller since birth. `resolveBatch(` likewise has zero callers in
views.js now (it had one at 71c0bcf:8043).

Predicted consequence, matching Preston's field result exactly: a confident
match resolves iff OpenLibrary happens to hold a cover for that exact ISBN —
which is uncorrelated with obscurity. 8/20 = 40%.

## 4. Anchors (file:line, HEAD 1fe7cfc)

| # | anchor | site |
|---|---|---|
| A1 | GB volume response parsed into a book record | `volumeToBook` js/integrations.js:2160 |
| A2 | cover URL read off the response | `googleBooksLargestCover` js/integrations.js:2038 (ladder extraLarge→smallThumbnail, https rewrite, edge=curl strip) |
| A3 | OpenLibrary cover builder | `openLibraryIsbnCover` js/integrations.js:2031 (`-L.jpg?default=false`) |
| A4 | candidate array assembled, OL-first | js/integrations.js:2174-2177 |
| A5 | field names on the record | `coverUrl` (= candidates[0]) + `coverCandidates` (array) js/integrations.js:2180-2181 |
| A6 | resolver + ranking | `resolveBook` js/integrations.js:2339 · `scoreVolume` js/integrations.js:2123 (imageLinks +8 / −6; ISBN +10 / −10) |
| A7 | GB transport | `googleBooksSearch` js/integrations.js:2323 → `GOOGLE_BOOKS_PROXY_URL` js/integrations.js:13 → netlify/functions/google-books-proxy.js:80 |
| B1 | art-vs-placeholder decision — SHELF | `buildCoverNode` js/views.js:4967 (`hasCover` 4978) → `buildSelfHealingCover` js/views.js:7015 |
| B2 | art-vs-placeholder decision — REVIEW ROW | `makeReviewCover` js/views.js:7048 → `buildSelfHealingCover` |
| B3 | art-vs-placeholder decision — SCAN | `scanCoverNode` js/views.js:8092 (own inline walk, `img.style.display='none'` on exhaustion) |
| C1 | live scan item builder (DEFECT) | `scanResolveAndFill` js/views.js:8809, literal 8830-8835 |
| C2 | dead item builder carrying the S1 fix | `scanClassify` js/views.js:8016, line 8032 |
| C3 | shelve-commit path (already compensates) | js/views.js:9115-9118 falls back to `it.resolved.book.coverCandidates` |
| D1 | image onerror — shelf/detail | js/views.js:7025 (`addEventListener('error')`) |
| D2 | image onerror — scan | js/views.js:8113 (`img.onerror` property) |

Unrelated `onerror` sites confirmed NOT in the cover path: views.js:3010 +
6860 (canvas downscale decode), 6913 (zxing CDN script), 2952/2964/2978 (IndexedDB).

## 5. Baselines

    js/views.js         1,118,579 B   LF-norm 1,118,579   working-tree CR 0   blob CR 0
    js/integrations.js    156,487 B   LF-norm   152,974   working-tree CR 3,513   blob CR 0
    sw.js                   6,041 B   LF-norm     6,041   CR 0

Parse gate baseline: `tools/parse-check js/views.js` → PARSE OK, exit 0;
`js/integrations.js` → PARSE OK, exit 0.
Foundations: assets/lumen-amber.css 14,966 B · assets/marks.js 10,255 B (untouched).

Tree: clean on tracked files. 106 untracked (left alone per non-goals).
Pre-existing, NOT mine: detached-HEAD worktree `.claude/worktrees/zealous-bose-8a1e6a`
@13548b4, and `stash@{0}: On (no branch): wip before switching to main`.

## 6. Egress from this machine (measured 2026-08-29)

    https://www.googleapis.com/books/v1/volumes?q=…  → HTTP 429  (keyless quota zero from this IP)
    https://covers.openlibrary.org/b/isbn/…-L.jpg?default=false → 404 for a miss (13-byte text/html);
        302 → archive.org/download/…zip/…jpg for a hit
    https://praxis-reading.netlify.app/sw.js → 000 (egress to the live site BLOCKED)

Whether GOOGLE_BOOKS_API_KEY is set on Netlify is NOT determinable from here
(no repo record; proxy falls through keyless when unset,
netlify/functions/google-books-proxy.js:84-88). INFERENCE, not observation:
it was working during Preston's scan — a 429 from the proxy would make
`googleBooksSearch` finish([]) and `resolveBook` return manualStub with
`coverCandidates: []`, which would have produced 0 confident, not 20.

## 7. Constraint on Stage 1 as written

Stage 1 asks for three cold device scans + per-request HTTP status codes. This
machine cannot reach the live site, has no camera, and GB keyless is 429 here.
Stage 1 as specified is a DEVICE task. See the Stage 0 report for the two
executable substitutes offered.
