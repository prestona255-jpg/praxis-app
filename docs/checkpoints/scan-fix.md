SCAN-FIX STARTED

# SCAN-FIX — Stage 0 recon (read-only), 2026-10-18

Model: Opus 5.5 executes; gate agents Sonnet (frontmatter). Lift granted in the brief ("run fix-red-team on this").
Evidence: Preston's iPhone, live praxis-v3.302, 18 Oct, Book mode (l7a.md Stage 4, R17).

## 0.1 Ground truth

- HEAD `60ce6b5` (L7a close-out), == the required base. `sh tools/ground-truth`: hook gate ARMED (core.hooksPath = hooks),
  FIX-PROTOCOL v1.3, 7 agents present.
- CACHE_VERSION `'praxis-v3.302'` (sw.js:12) — as expected.
- Tracked changes: **none**. Untracked: **111** before this file (pre-L7a set, untouched); 112 with `docs/checkpoints/scan-fix.md`.
- Read this session: CLAUDE.md · PROTOCOL.md (v1.2) · docs/FIX-PROTOCOL.md (v1.3) · all 7 of .claude/agents/ ·
  docs/studio/sequence.md (header, Re-plan log head, ## Now) · docs/checkpoints/l7a.md. **Missing: none.**
- Baselines (LF-normalized == worktree; every file CR=0, `git ls-files --eol` i/lf w/lf):
  js/integrations.js **194,862 B** · js/views.js **1,251,752 B** · sw.js **6,391 B**.

## 0.2 The lookup

**Trace (barcode → verdict):**
1. zxing callback `onZx` → `scanOnBarcode(text)` — views.js:9855 → :9907.
2. `scanOnBarcode`: book-code gate :9910, read-twice gate :9911 (`scanLastDecode`), then `scanStopBookDecode()` :9913,
   `scanLockOnSnap(...)` :9914 (420 ms hold, :9760), then `resolveBook({kind:'isbn', isbn})` :9915.
3. `resolveBook` ISBN branch — integrations.js:2544–2559 → `googleBooksSearch('isbn:'+isbn)` :2547.
4. `googleBooksSearch` — integrations.js:2485: `fetch(GOOGLE_BOOKS_PROXY_URL, POST {q})` :2503
   (`GOOGLE_BOOKS_PROXY_URL` = `PRAXIS_API_BASE + '/.netlify/functions/google-books-proxy'`, integrations.js:13).
5. Proxy — netlify/functions/google-books-proxy.js: appends `&key=` only if `GOOGLE_BOOKS_API_KEY` is set (:82–87),
   passes the upstream status through (:93–121).
6. Callback → `scanShowVerdict(result, isbn)` views.js:9946.

**What the Book verdict shows, from code** (`scanShowVerdict` reads only `book.title`/`book.author`, never `lookupFailed`):

| Google outcome | googleBooksSearch | resolveBook | verdict |
|---|---|---|---|
| (a) 200, zero items | `finish([], null)` :2511 | `manualStub(isbn, null)` :2548 → status 'none' | **"Not found"** / "ISBN 978…" (:9953–9954) |
| (b) HTTP error / 429 | :2509 → `retryOrFail`; 429/503 retried at +400 ms and +1200 ms (:2479, :2492), then `finish([], err)`; other codes fail at once | `manualStub(isbn, err)` → 'none', `lookupFailed:true` | **"Not found"** / "ISBN 978…" — identical to (a) |
| (c) timeout | **no timeout exists** in googleBooksSearch. A hang shows NO verdict (lock-on snap, then nothing). Only when the browser itself fails the fetch does the reject arm run (:2514, status 0, not retried) | 'none', `lookupFailed:true` | "Not found", but only after the browser gives up |

**Which one produced Preston's "Not found": UNKNOWN.** Code alone cannot separate (a), (b), or a (c) that ended in a browser
network error; all three render the same card. Measurements that do NOT decide it (recorded, not used as proof):
- This machine → googleapis.com keyless: **HTTP 429**, quota_limit_value "0" (project 624717413613). That is the keyless
  project, not necessarily the proxy (which uses `GOOGLE_BOOKS_API_KEY` if Netlify has it set — unknown from here).
- Preston's Stage 4 title search through the same proxy returned results that day (l7a.md:249).
- Live origin from this machine: curl `000`, exit 56 (unchanged).

**Open Library has the book** — measured from this machine, 2026-10-18:
`GET openlibrary.org/api/books?bibkeys=ISBN:9781324004615&format=json&jscmd=data` → 200, title "The Selected Works of Audre
Lorde", authors[0] "Audre Lorde" (authors[1] Roxane Gay), publish_date "Sep 08, 2020", cover.large
`https://covers.openlibrary.org/b/id/10323742-L.jpg`. `access-control-allow-origin: *` on it and on `/isbn/….json`
(302 → `/books/OL28428726M.json`, also `*`; works[0] `/works/OL20996961W`). An unknown ISBN returns `{}`.
The SW passes openlibrary.org through untouched (sw.js:50 `isApiRequest`; the fetch handler returns early for it). No CSP in index.html / netlify.toml / _headers.

**Every existing Open Library code path:**

| function | file:line | returns | cover source | callers |
|---|---|---|---|---|
| `fetchOpenLibrary(isbn, cb)` | integrations.js:1899 | `{isbn,title,author(first only),coverUrl,publishYear,openLibraryWorkId}` or `null` (no entry / any error). Two sequential GETs: /api/books (:1913), then /isbn/….json for the work id (:1933; its failure still returns the record with workId null) | `entry.cover.large` (covers.openlibrary.org/b/id/…-L.jpg) or null | `fetchBookByIsbn` :1877 only |
| `fetchBookByIsbn(isbn, cb)` | integrations.js:1859 | OL record only if ALL SIX fields are present (`isComplete` :1866–1875, incl. cover + workId); otherwise calls **Google again** (`fetchGoogleBooks` :1883) and returns that or `null` | OL cover, else GB thumbnail | `fetchAndApplyCover` views.js:5851 |
| `openLibraryIsbnCover(isbn)` | integrations.js:2162 | a URL string, no fetch | covers.openlibrary.org/b/isbn/…-L.jpg?default=false | `volumeToBook` :2296 |

**Proposed: reuse `fetchOpenLibrary`, not `fetchBookByIsbn`.** `fetchBookByIsbn` is the wrong reuse: (1) on any OL record
missing a cover or work id it re-asks Google — the source that just failed — and (2) if that second Google call fails it
returns `null`, **discarding the Open Library record** and showing "Not found" for a book OL has. `fetchOpenLibrary` is the
OL client itself. Mapping into resolveBook's book shape: `title, author, year ← publishYear, isbn ← the scanned isbn,
coverUrl ← its coverUrl, coverCandidates ← [coverUrl] or []`, the rest at the manualStub/volumeToBook blanks
(`pageCount null, publisher '', description '', rawCategories []`). A record with no title counts as a miss.

## 0.3 The black frame — mechanism PROVEN from source

Order of calls, confirming read → sheet (iPhone Safari = zxing path: Safari has no BarcodeDetector; Stage 4 on his iPhone decoded via the vendored zxing, l7a.md:252):
1. zxing `onZx` → `scanOnBarcode` — views.js:9855/9907; second matching read passes :9911.
2. `scanStopBookDecode()` — views.js:9913 → `scanZxingReader.reset()` :9870.
3. zxing 0.20.0 `reset()` (vendor/zxing/0.20.0/index.min.js) = `stopStreams()` (stops its stream's video tracks) +
   `_destroyVideoElement()` → `cleanVideoSource(t){ t.srcObject = null … removeAttribute("src") }`.
   On iOS the video element shows **zxing's own stream** (it was attached by `decodeFromConstraints`, views.js:9857;
   FX-G's note at :9654–9659 records the same fact). So reset() empties `#scan-cam-video` → black.
4. `scanLockOnSnap` (420 ms) → `resolveBook` → `scanShowVerdict` → `.is-up` (:9985–9986) over a black video.
`scanFreezeFrame` (views.js:9764) is never called on this path (grep: definition + :10275 + :11185 only).

**Fix, one sentence:** call `scanFreezeFrame()` in `scanOnBarcode` immediately BEFORE `scanStopBookDecode()`, and drop the
freeze in `scanHideVerdict()` — the one function every verdict close runs through — so "Keep scanning" (and Add, mode
switch, leave) returns to the live camera.

Correction to the brief's model: the photo paths do NOT keep a frame behind the verdict. Both freeze only for the vision
call and `scanUnfreeze()` BEFORE the verdict (views.js:10302; :11193). The freeze canvas is already styled to sit over the
video (`#scan-cam-freeze` components.css:16888, same `inset:0; object-fit:cover` as `#scan-cam-video` :16887).
Why `scanHideVerdict` and not the Keep-scanning handler: the verdict closes on five paths (Keep scanning :11565, Add
:10001 → rapid-scan restart :10027, mode switch :9744, enter :9783, leave :9810), all through `scanHideVerdict` (:10128);
putting the unfreeze in one of them alone would leave a frozen frame over a live camera after Add or a mode switch
(HOIST, NEVER COPY HALF). The photo paths call `scanHideVerdict()` BEFORE their own `scanFreezeFrame()` (:10274→10275,
:11184→11185), so their freeze is unaffected.

## 0.4 Detection speed — live Book-mode settings

| setting | value | file:line |
|---|---|---|
| our stream (Book) | `{video:{facingMode:{ideal:'environment'}}, audio:false}` — no width/height (Shelf alone gets 2560×1440) | views.js:9620–9623 |
| zxing's stream | zxing opens a **second** getUserMedia: `{video:{facingMode:{ideal:'environment'}}}` — no resolution, so Safari's default (640×480) | views.js:9857 |
| focusMode / zoom | none anywhere | — |
| zxing reader | `new BrowserMultiFormatReader()` → hints **null** → readers = all 1D formats + QR + Data Matrix + Aztec + PDF417, every frame (vendor setHints, `0===n.length&&(…)`) | views.js:9854 |
| TRY_HARDER | off → the 1D reader samples 15 rows around the frame's vertical centre, spaced height/32 apart (~±22% of height), no rotation | vendor `doDecode` |
| decode region / crop | none — the full video frame is drawn to zxing's capture canvas (`scanShelfCropRect` is Shelf only) | — |
| decode loop | zxing `decodeContinuously`: failed frame → retry after `_timeBetweenDecodingAttempts` = **0 ms**; success → next attempt after `timeBetweenScansMillis` = **500 ms** (constructor default) | vendor class F |
| time between the two confirming reads | **≥ 500 ms + one decode** (the success wait above). Any non-book decode in between (e.g. another barcode on the cover) resets the confirm (`scanLastDecode = null`, :9910) | views.js:9910–9912 |
| native path (not iPhone) | BarcodeDetector `['ean_13','ean_8','upc_a','upc_e']`, 300 ms tick | views.js:9837–9848 |

**Proposed tuning — at most three; approve each by name; unapproved ones are not built:**

- **T1 — decode only the book formats in zxing.** Pass hints `POSSIBLE_FORMATS = [EAN_13, EAN_8, UPC_A, UPC_E]` (the native
  list at :9837) to the constructor. Effect: each frame runs the UPC/EAN reader only, instead of every 1D reader plus four 2D
  detectors → more frames decoded per second, and fewer stray reads of other codes resetting the two-read confirm.
  Risk: low. Battery lower. False reads lower. Older iPhones gain the most. Cost (corrected at the recon gate): a
  printed ISBN barcode is EAN-13, but `scanIsBookBarcode` (:9898–9903) also accepts a checksum-valid 10-digit ISBN-10,
  which only a Code 39 / Code 128 label (a library or shop sticker, not the publisher's barcode) can carry. Those decode
  today and would stop decoding under T1. Rare. Note: zxing's hints API is a `Map`, so this adds the first
  `new Map()` in app code — ES3 *syntax* is unaffected and parse-check passes, wrapped in try → `null` (today's behavior).
- **T2 — 150 ms between a successful read and the next attempt** (constructor's second argument; default 500). Effect: the
  confirming read arrives ~350 ms sooner. The second read stays (grep `scanLastDecode !== isbn` stays 1). Risk: low — it only
  applies after a success; at 30 fps 150 ms is ≥ 4 frames, so the confirm still comes from a different frame. Battery
  negligible. False reads: unchanged in kind (still two identical, check-digit-valid reads).
- **T3 — ask zxing's stream for 1280×720** (`width:{ideal:1280}, height:{ideal:720}`, ideal never exact) at :9857.
  Effect: about 2× pixels per bar on a hand-held barcode, the likeliest cause of misses at normal holding distance.
  Risk: **medium** — about 3× the pixels per frame for zxing to binarize (slower per frame; partly offset by T1), more
  battery, and on iOS the second stream asking a different size from our hidden 640×480 stream may re-configure the
  camera; untestable here (no camera on the rig). Recommend T1 + T2; T3 only if you want to trade risk for range.

Considered, not proposed: TRY_HARDER (much slower per frame); reusing our stream via `decodeFromStream` (would put our
stream under zxing's `reset()`, which stops tracks — collides with FX-A/FX-G teardown).

## 0.5 Expected greps and byte deltas (drafted against current blobs, LF bytes; method `tr -d '\r' | wc -c` vs `git show HEAD:`)

**Stage 1 — js/integrations.js** (helper inside `resolveBook` after `manualStub`; the call at :2548 swapped)
- code **+565** (helper) + **0** (the call line: `finish(manualStub(isbn, err))` → `isbnViaOpenLibrary(isbn, err)`, equal
  length) · comment **+340** · total **+905**. sw.js **+0** (v3.302 → v3.303).
- greps: `isbnViaOpenLibrary(` 0 → **2** · `fetchOpenLibrary(` 2 → **3** · `finish(manualStub(isbn, err))` 1 → **0** ·
  `openlibrary.org/api/books` stays **1** (no second client) · `fetchOpenLibrary` outside integrations.js stays **0 files**.
- Google-hit lines :2549–2557 unchanged (shown by the diff).

**Stage 2 — js/views.js**
- `scanFreezeFrame();` before :9913: code **+21**, comment **+186** · `scanUnfreeze();` in `scanHideVerdict` :10128: code
  **+16**, comment **+238** · total **+461** (code +37). sw.js **+0** (→ v3.304).
- greps: `scanFreezeFrame()` 3 → **4** · `scanUnfreeze()` 7 → **8**.

**Stage 3 — js/views.js** (only what is approved; each isolated)
- T1: code **+334** (hints block) + **+7** (constructor arg) · comment **+189**.
- T2: constructor arg **+9** alone (or **+12** with T1's `(zxHints, 150)`) · comment **+190**.
- T3: code **+48** · comment **+154**.
- All three: code **+394**, comment **+533**, total **+927**. sw.js **+0** (→ v3.305).
- greps: `scanLastDecode !== isbn` stays **1** · `POSSIBLE_FORMATS` 0 → 1 (T1) · `new Map(` 0 → 1 (T1) · `ideal: 1280` 0 → 1 (T3).
- ES3 line-regex baseline (noisy: comments/strings) integrations.js 19 · views.js 125 — must not rise.

Byte figures are floors in the FIX-PROTOCOL §3 sense (two-figure band: code hard ceiling, comment soft).

## Planned proofs (for Stages 1–3)

- **Stage 1** — local rig (static server, Browser pane), the app's own `resolveBook` with `window.fetch` stubbed in the page:
  Google 200-empty → OL book; Google 429 → OL book; Google network reject → OL book; Google empty + OL `{}` → today's stub
  exactly; Google hit → result identical to HEAD and **zero** openlibrary requests. Run on HEAD bytes first to reproduce
  'none'. OL served both from the recorded body above and live.
- **Stage 2** — the instrument: a fake camera (`getUserMedia` → `canvas.captureStream()` of a drawn EAN-13 for
  9781324004615). The pane's Chromium on Windows has no BarcodeDetector (to be confirmed; else removed), so this is the
  iPhone's zxing path, decoding for real. Before: verdict up, `video.srcObject === null`, freeze hidden (black). After:
  freeze `display:block` with non-black sampled pixels. Keep scanning: freeze hidden, a live stream re-attached, reader
  running again. Lock-on times measured on the synthetic feed before/after Stage 3 — corroboration only, not the phone.

## Stated before build (FIX-PROTOCOL #10, #11)

- **Ordering dependency:** Stage 2's freeze and unfreeze ride ONE commit — a freeze without the unfreeze would leave a
  still frame over the live camera after Keep scanning. Stages 1 and 3 are independent.
- **Owner-visible delta (Stage 2 only):** 390 (iPhone Safari): behind the verdict sheet, the last camera frame instead of
  black. Then "Keep scanning": a dark gap of a few hundred ms before zxing's new stream attaches (see G2 below) — the
  same dark the reader sees today, but now only after Keep scanning rather than behind the whole verdict. 1360 desktop (corrected at the
  recon gate): only zxing browsers (e.g. Windows Chrome) change — black today, frozen after. BarcodeDetector browsers
  (macOS Chrome) never reach a verdict today at all (D1); with D1 ruled in (SCAN-FIX.4) they reach the verdict over the
  frozen frame. Reference surface: `#scan-verdict` over
  `#scan-cam-freeze`. Stage 1 delta: the card reads the book's title instead of "Not found". Stage 3: no visual delta
  (speed only). **No copy changes in any stage.**
- Tier: novel, non-data-loss → commit gate HALTs for "commit and push" (§5 B).

## 0.6 Pre-existing drift (flagged, not fixed)

- **D1 — the native BarcodeDetector loop dies after its first read** (views.js:9844: `scanOnBarcode(...); return;` with no
  re-arm). Correct in S3 (`6103937`, single read acted at once); FX-B (`67d35dc`) added the read-twice gate and the first
  read now returns without scheduling the next tick, so the confirming read never comes. Affects Android / macOS Chrome
  only, not the iPhone. One-line fix; not in this slice unless ruled in.
- **D2 — the iOS cover shot probably captures an empty frame** (suspected, unproven on device): `scanFireCoverShot` calls
  `scanStopBookDecode()` BEFORE `scanFreezeFrame()`/`scanCaptureBase64()` (views.js:11184–11186), so on iOS zxing's reset
  has already set `srcObject = null`; `scanCaptureBase64` returns '' when `videoWidth` is 0 (:10253) → "scan-ov-failed".
  Cover shot is the shelf-vision path — a NON-GOAL here.
- **D3 — `docs/studio/sequence.md` ## Now L7 entry is stale** (:1332–1336 still "Awaits commit and push"; L7a shipped and
  closed per l7a.md). Docs ride with this slice's commit → corrected in the SCAN-FIX.3 (or last) commit, since this slice
  edits sequence.md anyway.
- **D4 — neither lookup has a timeout** (googleBooksSearch, fetchOpenLibrary): a hung request shows no verdict until the
  browser fails it. Not introduced here; the fallback inherits it.

## Forks named by this recon (FORK-VERBATIM)

- **F1 — which Open Library function.** The brief names `fetchBookByIsbn` as a known fact; recon proposes
  **`fetchOpenLibrary`** (reasons in 0.2: `fetchBookByIsbn` re-asks Google and can discard the OL record).
- **F2 — reach of the fallback.** Inside `resolveBook` it reaches every ISBN-kind caller, not only the scanner:
  scanner :9915 · scan ISBN door :10171 (commits at once, no review, no checksum) · manual add :7323 (review sheet) ·
  `reResolveCover` :8847 (fills blanks, replaces the cover; "Resolve all covers") · **"Fix this book" :12291, which
  OVERWRITES title/author/cover on any status ≠ 'none'** — when Google fails today it does nothing; after Stage 1 it writes
  Open Library's record. That is the brief's stated intent ("any caller holding an ISBN"). Measured caveat: OL keys junk
  records to some invalid ISBNs (`ISBN:0000000000000` → a 1973 French novel); the scanner is checksum-gated, the two typed
  doors are not — a typed wrong ISBN can now resolve where it used to stub (Google can do the same).
- **F3 — author shape.** `fetchOpenLibrary` keeps the first author only; Google's path joins all authors
  (`volumeToBook` :2293). The same book can be stored as "Audre Lorde" from OL vs "Audre Lorde, Roxane Gay" from Google,
  which feeds the shelf identity key. Recon carries "use the function as-is" (the brief forbids a second client).
- **F4 — T1's `new Map()`**, named above.

## Recon gate (FIX-PROTOCOL §1#8) — fix-red-team, Sonnet, 2026-10-18

Re-derived and confirmed: all three baselines; every grep baseline; the small byte figures (+21, +16, +48, +7/+12); the
zxing mechanism (reset → `srcObject = null`), the constructor-hints flow, null-hints reader set, 0 ms / 500 ms loop, the
15-row sampling; `scanHideVerdict` as the single verdict close (one `is-up` add :9986, one remove :10128); both photo
paths hide-then-freeze and unfreeze before their verdict; the ISBN-caller list complete (`resolveBatch` has no callers;
:10344/:11196 are title-kind; bulk add uses `fetchAndApplyCover`); `fetchBookByIsbn` the wrong reuse; "UNKNOWN" honest.
No anchor of substance failed. Its findings, and what this recon does with each:

- **G1 (held the build until ruled) — the fallback adds a hang where today ends at once.** When Google fails, the card
  shows "Not found" promptly; after Stage 1 it waits on `fetchOpenLibrary`, which has no timeout and makes TWO sequential
  GETs — the second (`/isbn/….json`, a 302) only fetches `openLibraryWorkId`, which resolveBook never uses. With Stage 2, a
  hung OL call leaves a frozen frame and no verdict (Back is the only exit). After a 429, Google's retries already cost
  1.6 s first. → **F5** below.
- **G2 — Keep scanning flashes dark.** `scanHideVerdict` (+unfreeze) then `scanStartBookDecode`: zxing already nulled
  `srcObject`, so the video is dark until `decodeFromConstraints`' async getUserMedia attaches a new stream (hundreds of ms
  on iOS) while the sheet slides out over .34 s (components.css:17008–17010). Stated in the felt delta above. → **F6**.
- **G3 — the overwrite consequence, stated (F2/F3 sharpened).** With Google down, "Fix this book" (:12291) would replace a
  correct "Audre Lorde, Roxane Gay" with OL's first-author-only "Audre Lorde" (integrations.js:1925–1927) — irreversible,
  one tap. ~~"Resolve all covers" (:8983 → `reResolveCover`) would bulk-apply OL covers across missing AND wrong covers,
  unreviewed, whenever Google is down (keyless quota measured 0).~~ **Corrected at Preston's ruling (overstated):**
  "Resolve all covers" walks only `missingCovers` + `wrongCovers` (views.js:8977–8978, built by
  `scanLibraryForCleanup` :8174–8175 — no cover, or a cover that failed to load), and `reResolveCover` writes a cover
  only when one was found and otherwise fills blank fields only (:8852–8866). The fallback fills missing or broken
  covers; it never replaces a good cover anywhere on the shelf. Also: the hand-built `coverCandidates ← [coverUrl]` is a
  second shape beside `volumeToBook` (:2290), which puts `openLibraryIsbnCover(isbn)` first. → **F7**.
- **G4 — T1 cost reworded** (ISBN-10 on Code 39/128 labels). Done above.
- **G5 — stale-bitmap path.** `scanFreezeFrame` redraws only if `scanCamReady && v.videoWidth` but shows the canvas
  regardless, so a skipped draw would show the previous freeze. At the new call site zxing has just decoded from the
  video, so `videoWidth` > 0; `scanCamReady` is false only after `scanStopStream`, which also stops decode — so no
  decode, no call. One narrow window: a Shelf→Book switch re-warms our stream async while zxing starts at once; a
  two-read confirm takes ≥ 500 ms, the re-warm normally less. **R1** (residual, documented, not guarded).
- **G6 — desktop delta contradicted D1.** Corrected above. **D1 is put to you explicitly** (the one-line re-arm at
  :9844): without it, no BarcodeDetector browser (Android Chrome, macOS Chrome) can finish a barcode scan at all.
- **G7 — shelf-vision side effect.** A mode switch mid-shot (`scanSetMode` → `scanHideVerdict`, :9744; the seg handlers
  :11545–11546 have no `scanShotBusy` guard) now drops a shelf-shot freeze early while the shimmer is still on; the vision
  call itself continues as before. Behavior change on a non-goal path, benign as far as traced. **R2**.
- **G8 — protocol items.** Prior-fix regression check (§1 #2), written here: Stage 1 edits one line inside T14's
  machinery (integrations.js:2548); the OL-miss branch calls the same `manualStub(isbn, err)`, so `lookupFailed` /
  `lookupHttpStatus` are preserved byte-for-byte on every miss; Google-hit lines untouched. Stage 2 sits beside FX-A
  (`scanStopStream`), FX-G (`scanEnsureDisplay`), FX-B (`scanLastDecode`) — none of their lines change, no shared name.
  Device click-path: drafted in the brief's "After the push" and written into this file at the commit stop. Also: a
  Google item with no title renders "Not found" today and is NOT a fallback trigger (items.length > 0) — **R3**.
- **G9 — anchors.** Fixed in place (:10027; sw.js:50 only; the iPhone-Safari evidence is l7a.md Stage 4, not the
  simulator line).
- **G10 — (d) a 200 with an unparseable body** → `finish([], {kind:'parse'})` (:2513), same card; the fallback covers it
  too (empty items). The ISBN goes into the OL URL unencoded (:1913); the scanner sends digits only, the typed doors strip
  spaces/dashes only — **R4**.

## Forks added by the recon gate

- **F5 — a bound on the Open Library wait.** (A, recommended) an overall timer inside the new helper: if OL has not
  answered in **6 s**, return today's stub (Google's err) — the existing `done` guard makes a late answer a no-op; the OL
  client itself is untouched. (B) no timer; document the hang as a residual. (The second GET stays either way — the brief
  forbids changing or duplicating the client.)
- **F6 — the dark gap after Keep scanning.** (A, recommended) accept and state it: it is today's dark, shortened. (B) in
  the two restart sites (Keep scanning :11565, rapid-scan after Add :10027) re-attach our still-live stream first via
  FX-G's `scanEnsureDisplay()` (:9665) so the video is live at once — touches FX-G's machinery from a new caller.
- **F7 — what the fallback may write.** (A, recommended — the brief's intent) the fallback answers every ISBN caller,
  with G3's consequences accepted. (B) the fallback answers every caller, but mark its result (e.g. `source:'openlibrary'`)
  and have "Fix this book" not overwrite a non-blank title/author from it — a change to a caller outside the scanner.
  Cover shape: (A) the brief's `[coverUrl]` from `fetchOpenLibrary`; (B) build through `volumeToBook` so the ISBN cover
  leads and OL's cover follows — one shape, but not literally "the cover URL that function produces".
- **D1** — rule in (one-line re-arm) or leave for a later slice.

HALT — awaiting go-ahead for Stages 1–3.

---

# Preston's rulings (go-ahead, 2026-10-18)

1. Reuse `fetchOpenLibrary`, not `fetchBookByIsbn` — approved.
2. **F5-A** — a 6-second limit on the Open Library call; on timeout, today's "Not found" exactly.
3. **F6-A** — accept the brief dark moment after "Keep scanning"; no camera-restart rework.
4. **F7 SPLIT** — covers: accepted, and G3's risk sentence was overstated (corrected in place above).
   **"Fix this book": OPT OUT.** It overwrites title, author, year and publisher from any non-'none' result
   (views.js:12318–12325), and `fetchOpenLibrary` keeps only the first author (integrations.js:1925–1927), so one tap
   in a Google outage could drop a co-author with no undo. The opt-out is `noFallback: true` on the query, set ONLY at
   that call site (views.js:12313); resolveBook skips the fallback when it is set, so Fix-this-book behaves exactly as
   today. This overrides the brief's "any caller holding an ISBN" for this one caller, **until its preview (r22) is
   built**. Every other ISBN-capable caller gets the fallback.
5. Tuning: **T1 + T2, not T3.** T1 uses the same four formats as the native path (views.js:9837), so Safari and Chrome
   read the same codes — ISBN-10 on Code 39/128 stickers already can't scan on Chrome, so this is parity, not a new loss
   (residual R5). T2 = 150 ms. Both through the constructor.
6. **D1 IN**, as its own commit after the three stages: "SCAN-FIX.4 — Chrome barcode loop keeps reading for the
   confirming read", CACHE_VERSION 'praxis-v3.306'.

No ruling contradicted code read this session: the covers correction matches views.js:8977–8978 / :8174–8175 /
:8852–8866; the Fix-this-book overwrite matches :12318–12325; the vendored constructor supports `(hints, ms)` (below).

# SCAN-FIX — build record (Stages 1–4), 2026-10-18

Byte method: LF bytes, `tr -d '\r' < f | wc -c` (every touched code file is LF in index and worktree, CR=0), each
stage measured against a snapshot of the previous stage; code/comment split by classifying added/removed diff lines
(a line whose trimmed text starts `//` is comment).

## Stage 1 — Open Library fallback (commit SCAN-FIX.1, → praxis-v3.303)

| file | expected | measured |
|---|---|---|
| js/integrations.js | code +565 / comment +340 (recon) + the ruled 6 s timer and opt-out | **+1,206** = code **+765** / comment **+441**. The +200 code over the recon figure is exactly the three ruled lines: the `noFallback` guard (79 B), the timer (94 B), `clearTimeout` (34 B). |
| js/views.js | (opt-out, ruled) | **+293** = code **+18** (`, noFallback: true`) / comment **+275** |
| sw.js | +0 | **+0** (v3.302 → v3.303) |

- The helper: `isbnViaOpenLibrary` integrations.js:2547–2566, inside `resolveBook`; the ONE call site :2571 (the ISBN
  branch's no-items line, which was `finish(manualStub(isbn, err))`). The title branch (:2585 on) is untouched.
- Greps: `isbnViaOpenLibrary(` **2** (def + one call) · `fetchOpenLibrary(` 2 → **3** · `finish(manualStub(isbn, err))`
  1 → **0** · `openlibrary.org/api/books` **1** (no second client) · files containing `fetchOpenLibrary` = **1**
  (integrations.js) · `noFallback` integrations **2** / views **2** (one comment + the query flag at :12313).
- Google-hit lines: `git diff` shows the ISBN branch's only changed line is :2571; the lines after it (vi0 →
  `finish({ status: 'strong', … })`) are context, unchanged.
- **ISBN-capable resolveBook callers that get the fallback** (current line numbers):
  manual add `doLookup` views.js:7315/7323 (→ review sheet) · `reResolveCover` :8845/8847 (cleanup "Resolve all covers"
  + per-book) · scanner barcode `scanOnBarcode` :9933 · scan ISBN door `scanWireIsbnDoor` :10192.
  **Opted out:** "Fix this book" `buildBookEditPanel` :12313/12315.
  Not ISBN-capable: `scanResolveAndFill` :10365 and `scanFireCoverShot` :11217 (`scanQueryForBook` is title-kind) ·
  `resolveBatch` integrations.js:2634 (no callers) · bulk add uses `fetchAndApplyCover`/`fetchBookByIsbn`, not resolveBook.

**Proof — the app's own `resolveBook`, local rig** (`.claude/static-server.ps1` :8772, Browser pane, fresh port, served
CACHE_VERSION confirmed `praxis-v3.306` in the page; `window.fetch` stubbed in the page for the Google proxy; Open
Library from a body recorded live from openlibrary.org at run time, plus a fully live run). HEAD's `resolveBook` was
first evaluated in the same page from the HEAD blob (`.claude/scanfix-head/integrations.js`, gitignored) to reproduce:

| Google | Open Library | HEAD | fixed |
|---|---|---|---|
| 200, 0 items | recorded hit | 'none', "" | **'strong'**, "The Selected Works of Audre Lorde" / "Audre Lorde" / 2020 / cover `covers.openlibrary.org/b/id/10323742-L.jpg`; calls GB → OL /api/books → OL /isbn |
| 429 (×3, 1.6 s backoff) | recorded hit | 'none', lookupFailed, 429 | **'strong'**, same book, 1,605 ms |
| network reject | recorded hit | 'none', lookupFailed | **'strong'**, same book |
| 200, 0 items | **live** openlibrary.org | — | **'strong'**, same book, 530 ms |
| 200, 0 items | `{}` (miss) | — | 'none' — result JSON **identical to HEAD's** |
| 429 | `{}` (miss) | — | 'none', lookupFailed true, 429 — JSON **identical to HEAD's** |
| 200, 0 items | never answers | — | 'none' at **6,003 ms** — JSON **identical to HEAD's** |
| hit (fixture item) | — | 'strong' | 'strong', JSON **identical to HEAD's**, **zero** Open Library requests |
| 200, 0 items + `noFallback` | — | — | 'none', JSON identical to HEAD's (modulo the query echo), **zero** OL requests |
| title query, 0 items | — | — | 'none', **zero** OL requests |

Parse: integrations.js, views.js — PARSE OK, exit 0. Regression harnesses over the new integrations.js:
`tools/delete-test` 58/58 · `export-test` 58/58 · `fx1c-sim` 60/60 · `ceiling-core-test` 36/36 — exit 0 ×4.
Not verifiable here: the cover IMAGE — covers.openlibrary.org 302s to archive.org, which this machine's network blocks
(curl exit 56; the pane shows the typographic placeholder). The app already uses that cover host for every Google
match (`openLibraryIsbnCover`), so it is not new; the device check covers it.

## Stage 2 — the last frame behind the verdict (commit SCAN-FIX.2, → praxis-v3.304)

| file | expected | measured |
|---|---|---|
| js/views.js | code +37 / comment +424 = +461 | **+461** = code **+37** / comment **+424** — exact |
| sw.js | +0 | **+0** (→ v3.304) |

Call order, confirming read → sheet. **Before** (HEAD :9911–9915): read-twice gate → `scanStopBookDecode()` (zxing
`reset()` → `srcObject = null`) → `scanLockOnSnap` → `resolveBook` → `scanShowVerdict` over a black video.
**After** (:9926–9934): read-twice gate → **`scanFreezeFrame()` :9930** → `scanStopBookDecode()` :9931 → snap → resolve →
verdict over the frozen frame. Close: `scanHideVerdict()` :10149 now ends with `scanUnfreeze()`; "Keep scanning"
(:11586 handler) = `scanHideVerdict()` → `scanStartBookDecode()` — decoding restarts exactly as before.
Greps: `scanFreezeFrame()` 3 → **4** · `scanUnfreeze()` 7 → **8**.

**Proof — the instrument** (`.claude/scanfix-head/instrument.js`, gitignored): `getUserMedia` returns
`canvas.captureStream(30)` of a drawn EAN-13 for 9781324004615 on a paper ground with a brown "cover" block. This
Chromium has no BarcodeDetector (`typeof window.BarcodeDetector` = "undefined"), so it runs the iPhone's path and the
vendored zxing decodes it for real. Steady state (verdict → Keep scanning → next lock), `document.visibilityState`
"visible" throughout:

| probe at the verdict | HEAD functions | fixed |
|---|---|---|
| `video.srcObject` | null (`videoWidth` 0) | null (`videoWidth` 0) — same mechanism underneath |
| `#scan-cam-freeze` | `display:''` (hidden), 300 px wide (never drawn) | **`display:block`, 1280 px wide** |
| sampled freeze pixel | [0,0,0] | **[122,74,42]** = the fake frame's `#7a4a2a` cover block |
| what the reader sees | black | the last camera frame |

After "Keep scanning" (fixed): freeze `display:none` at once; reader running; `srcObject` null at the click, live by
60 ms on the fake camera (the F6-A dark moment; on iOS it is the real getUserMedia time). Next lock comes normally.
Capture: 390×844, dpr 2, 2026-10-18T19:52:29Z — frozen barcode frame behind the verdict reading "The Selected Works of
Audre Lorde / Audre Lorde" (Google answered 404 on the rig's static server → Open Library); freeze rect 0,0,390,844;
verdict rect y 630, h 214. Transitions forced settled before capture. Rig capture, not a device capture.

## Stage 3 — zxing tuning, T1 + T2 (commit SCAN-FIX.3, → praxis-v3.305)

| file | expected | measured |
|---|---|---|
| js/views.js | code +346 (T1 +334 + ctor +12) / comment +379 | **+883** = code **+346** — exact / comment **+537** (+158 over: the comment also records the Safari/Chrome parity and the Map → null fallback; comment allowance, soft) |
| sw.js | +0 | **+0** (→ v3.305) |

Vendored signature relied on (vendor/zxing/0.20.0/index.min.js):
`t.BrowserMultiFormatReader=class extends F{constructor(t=null,e=500){const r=new cr;r.setHints(t),super(r,e)}decodeBitmap(t){return this.reader.decodeWithState(t)}}`
and `class F{constructor(t,e=500,r){this.reader=t,this.timeBetweenScansMillis=e,…}` — so arg 1 = hints (applied to the
MultiFormatReader that `decodeWithState` uses on every frame), arg 2 = `timeBetweenScansMillis` (the wait after a
successful read, in `decodeContinuously`). `ZXing.DecodeHintType` and `ZXing.BarcodeFormat` are exported (1 each).
Built: views.js:9857–9869, `new window.ZXing.BrowserMultiFormatReader(zxHints, 150)` with POSSIBLE_FORMATS =
EAN_13, EAN_8, UPC_A, UPC_E (the native list at :9837).
Greps: `scanLastDecode !== isbn` **1** (the two-read confirm stays) · `POSSIBLE_FORMATS` **1** · `new Map(` **1** ·
`BrowserMultiFormatReader(zxHints, 150)` **1** · `ideal: 1280` **0** (T3 not built).

Timing on the synthetic feed (4 runs each, from the "Keep scanning" tap; lock = the `resolveBook` call, which follows
the 420 ms lock-on snap). **Corroboration only — a perfect printed barcode on a desktop CPU, not the phone:**

| variant | read-to-confirm gap | lock |
|---|---|---|
| HEAD-like (no hints, 500) | 535–598 ms | 1,059–1,118 ms |
| T1 only (hints, 500) | 530–536 ms | 1,005–1,054 ms |
| T2 only (no hints, 150) | 191–222 ms | 717–751 ms |
| **T1 + T2 (built)** | **181–190 ms** | **682–736 ms** |

T2 carries the measurable win here (~350 ms off every scan). T1's benefit (less work per frame, fewer stray reads
resetting the confirm) cannot show on a clean synthetic barcode on a fast CPU; it is unmeasured, and only the device can
say. Parse: views.js PARSE OK, exit 0.

## Stage 4 — D1, the native loop (commit SCAN-FIX.4, → praxis-v3.306)

| file | expected | measured |
|---|---|---|
| js/views.js | one guarded reschedule | **+312** = code **+58** / comment **+254** |
| sw.js | +0 | **+0** (→ v3.306) |

The change (views.js:9847): after `scanOnBarcode(codes[0].rawValue)`, `if (scanNativeDecoding) { window.setTimeout(tick, 300); }`.
**Why it cannot fire after the confirming read:** `scanOnBarcode` runs synchronously inside the same `.then` callback.
On the confirming read it calls `scanStopBookDecode()` (:9931), which sets `scanNativeDecoding = false` (:9884) before
returning; the guard then reads false and schedules nothing. On a first read or a rejected code, `scanOnBarcode` returns
without stopping, the flag is still true, and the loop keeps reading. (`tick` itself also returns at once when the flag
is false, :9843.) Greps: `if (scanNativeDecoding) { window.setTimeout(tick, 300); }` 1 → **2** (the error arm already had it).

**Proof on the rig — a fake BarcodeDetector** (detect returns a scripted sequence, then nothing), same page, 4 s each:

| loop | sequence | detect calls at 2.5 s / 4 s | reads | verdict |
|---|---|---|---|---|
| HEAD | isbn, isbn | **1 / 1** | 1 | **never** (loop dead, flag still true) |
| SCAN-FIX.4 | isbn, isbn | **2 / 2** | 2 | up; `scanNativeDecoding` false — nothing after the confirm |
| SCAN-FIX.4 | junk EAN, isbn, isbn | 3 / 3 | 3 | up (junk resets, loop continues) |
| SCAN-FIX.4 | isbn, then nothing | 8 / 13 | 1 | none — still reading, as it should |

**Code-proven and rig-proven with a stub; device-unverified.** No real BarcodeDetector exists on Windows Chrome or on
the iPhone. Real device: Android Chrome or Chrome on a Mac.

## Whole slice

- `git diff --stat` (HEAD..worktree, code): integrations.js 25 lines, views.js 32 ±, sw.js 1 ±. LF bytes:
  integrations.js 194,862 → **196,068 (+1,206)** · views.js 1,251,752 → **1,253,701 (+1,949)** · sw.js 6,391 → **6,391 (+0)**.
- EOL: `git ls-files --eol` js/integrations.js, js/views.js, sw.js = **i/lf w/lf** (unchanged); CR count 0 in all three.
- Parse: every intermediate tree's views.js (s1–s4) and sw.js (v3.303–v3.306) — PARSE OK, exit 0. Harness self-check:
  views.js + an appended arrow function → PARSE ERROR, **exit 1**.
- ES3 line-regex (noisy baseline) integrations.js 19 → 19, views.js 125 → 125.
- Foundations: lumen-amber.css and marks.js untouched (not in the diff).
- Console on the rig: only 404s — the Google proxy (no functions on a static server) and the archive.org cover
  redirects (network filter). No script exceptions.

## Residuals

- **R1** (G5) a skipped freeze draw would show an older bitmap; at the new call site zxing has just decoded from a live
  video, so the draw runs. The one narrow window is a Shelf→Book switch whose re-warm is slower than a two-read
  confirm. Not guarded. (Seen once on the rig ONLY by forcing zxing and the native path in the same session — impossible
  on a device, where a browser has one or the other.)
- **R2** (G7) a mode switch mid-shelf-shot now drops that shot's freeze early; the vision call itself is unchanged.
- **R3** a Google item with no title still renders "Not found" and is not a fallback trigger (items.length > 0).
- **R4** the ISBN is concatenated into the Open Library URL unencoded (integrations.js:1913) — the scanner sends digits;
  the typed doors strip spaces/dashes only. Pre-existing client, not changed (the brief forbids a second client).
- **R5** T1 parity: an ISBN-10 on a Code 39 / Code 128 sticker no longer decodes on Safari — it never decoded on Chrome.
- **R6** the fallback's second Open Library GET (`/isbn/….json`, work id only) is unused by resolveBook — latency only,
  inside the 6 s limit.
- **R7** Open Library keys junk records to some invalid ISBNs (`ISBN:0000000000000` → a 1973 French novel). The scanner
  is checksum-gated; the manual and scan-door typed ISBNs are not.
- **R8** first author only from Open Library (F3); "Fix this book" is opted out for exactly this reason.
- **R9** D1 device-unverified (above). T1's effect device-unmeasured. Which Google outcome caused the original "Not
  found" stays UNKNOWN.
- **R10** observed on the rig, unproven on device: on entry to #scan the camera is requested before the primer
  (`scanEnter` :9785 → `scanSetMode` → `scanEnsureDisplay` re-warms at :9676–9677 with no overlay open yet), and a decode session started
  then can survive into the granted session. Pre-existing (FX-G), not touched; filed for the scan surface.
- **R11** the cover IMAGE could not be loaded from this machine (archive.org blocked) — device check step 1.
- **R12** (red-team, carries D4 forward) `googleBooksSearch` still has no timeout (integrations.js:~2503); F5 bounds
  only the Open Library leg. A Google request that never answers now leaves a frozen frame with no verdict (before:
  black, no verdict); Back is the only exit. A 429 still costs its 1.6 s backoff before Open Library is asked.
- **R13** (red-team) T2 narrows FX-B's separation between the two confirming reads from ≥ 500 ms to ~150 ms (measured
  gap 181–190 ms on the rig). At a low frame rate (~15 fps in poor light) that is about two frames, so a persistent
  smudge could decode identically twice. The 978/979 prefix + check-digit gate still applies; ruled at T2.
- **R14** (red-team nit) no generation token on the native loop: a `scanStartBookDecode` within ~300 ms of a stop, while
  a tick timer or a `detect()` is in flight, could run two tick chains. Pre-existing in the no-camera and error arms;
  SCAN-FIX.4 extends the window to the post-first-read arm. No overlapping path found in practice.
- **R15** (process) `tools/parse-check` exits 0 on an empty file, so "PARSE OK" is only as strong as the file size
  behind it. Every parse above was on a file whose size matches the record (red-team re-ran with sizes confirmed).
- D2 (iOS cover shot probably captures an empty frame) stays open, non-goal.

## What Preston runs — device check (live origin unreachable from this machine: curl 000, exit 56)

On your iPhone, Safari, praxis-reading.netlify.app, after "commit and push" and the Netlify build:
1. **Version.** Open the site. When "A new version of Praxis is ready." appears, tap **Reload** (again if it reappears).
   Open `/#diag`. PASS: the bundle line reads **praxis-v3.306**.
2. **The book that failed.** Scan → Book. Hold *The Selected Works of Audre Lorde* (ISBN 978-1-324-00461-5).
   PASS: the verdict reads **The Selected Works of Audre Lorde**, a real author line, and a cover (or the typeset
   placeholder if the image is slow). Do NOT tap Add if you already own it — "Keep scanning" is enough.
3. **The frame.** On that same verdict: PASS = behind the sheet you see the frozen picture of the barcode/book, **not
   black**. Then tap **Keep scanning**: PASS = the live camera returns within about a second (a brief dark moment is the
   accepted F6-A behavior).
4. **Speed.** Start a timer when you point the camera at the barcode and stop it when the brackets flare gold. Do it
   three times. Report the seconds (before this slice: "several seconds").
5. **No regression.** Scan one other book that scanned fine before. PASS: it is found as before.
6. **Fix this book is unchanged.** Not required — it is opted out and its behavior is byte-identical; skip unless curious.
7. **Optional, if you have an Android phone or a Mac with Chrome:** Scan → Book → a barcode. PASS: a verdict appears
   (before SCAN-FIX.4 it never could), with the frozen frame behind it, and "Keep scanning" returns the live camera.
   This is D1's only device proof. (With D1 in, Chrome now reaches the verdict too, so it also gets Stage 2's freeze —
   the felt delta at 1360 on Chrome/macOS is "no verdict ever" → "verdict over the frozen frame".)
Report each as PASS/FAIL with what you saw.

## Commit staging plan (explicit-file; never `add -A`; real index only — the working tree is never touched)

The working tree holds the FINAL state (SCAN-FIX.4). Intermediate content is pinned as blobs
(`git hash-object -w --path=<f> <snapshot>`, LF, 2026-10-18) and placed with
`git update-index --cacheinfo 100644,<blob>,<path>`; a file whose final content IS that commit's content is staged
with `git add <path>`. Every intermediate views.js and sw.js parses (exit 0).

**SCAN-FIX.1 — ISBN lookup falls back to Open Library** → praxis-v3.303
| path | how | blob |
|---|---|---|
| js/integrations.js | add (final == stage 1) | 9de2a9c76ee115cfa197b221d44efe7fd0858d23 |
| js/views.js | cacheinfo (stage 1: the Fix-this-book opt-out only) | 3f8b7d672dfba727813a13bfb7e539e89825daf7 |
| sw.js | cacheinfo (v3.303) | 2b6791668761529f1c32488fc981e247ff24f12b |

**SCAN-FIX.2 — keep the last frame behind the verdict** → praxis-v3.304
| path | how | blob |
|---|---|---|
| js/views.js | cacheinfo (stage 2) | d696de41e994439f3dcf1f67cc65876bc22b3b6e |
| sw.js | cacheinfo (v3.304) | 48ac2bd34cd64204e591ec2e0c46e22e5e582057 |

**SCAN-FIX.3 — barcode decode tuning (approved items only)** → praxis-v3.305
| path | how | blob |
|---|---|---|
| js/views.js | cacheinfo (stage 3: T1 + T2) | ac4003fedbdca7ab469cde9b13562959eef67603 |
| sw.js | cacheinfo (v3.305) | 0a07fb866b99a43841855cb0e928abc2544ac8e9 |

**SCAN-FIX.4 — Chrome barcode loop keeps reading for the confirming read** → praxis-v3.306
| path | how | blob |
|---|---|---|
| js/views.js | add (final) | 8bf9b5752dbcc75d9e623ec85af27ae36ef85b59 |
| sw.js | add (final, v3.306) | 9388fda6e87916c1484576f15bdb407e98d57962 |
| docs/checkpoints/scan-fix.md · docs/studio/sequence.md · docs/Checklist and Roadmap/BUILD_STATE.md · docs/studio/builder.html | add | — |

Docs ride SCAN-FIX.4 — the record describes all four commits and the four are pushed together (Builder regen rides
this final local commit, the push point). After each commit: `git show --stat HEAD` = exactly the files above; after
SCAN-FIX.4, `git diff HEAD --stat` over the slice files is empty. Subjects use the em-dash; each body ends with the
Co-Authored-By line.

**Rehearsal (2026-10-18, scratch clone, real `hooks/pre-commit`):** the four commits above, in order — hook exit 0 ×4,
no hook output; each `git show --stat` = exactly the planned files; sw.js per commit v3.303 / v3.304 / v3.305 / v3.306;
the rehearsed final tree equals the working tree for js/integrations.js, js/views.js and sw.js. Builder regenerated by
`tools/studio-build`: warnings 0, `SCAN-FIX` renders in builder.html (3 hits, L21 grep).

## Final gates (Sonnet, frontmatter-pinned), 2026-10-18 — on the frozen code tree

- **praxis-reviewer — CLEARED TO COMMIT.** All gates PASS: ES3 (0 const/let/=>/class/backtick in added lines) ·
  foundations untouched (lumen-amber.css 14,966 B, marks.js 10,255 B) · every stage's byte delta re-derived from the
  blobs, matching · EOL i/lf w/lf on the code · sw.js one line per commit, 302→306 · `git diff --check` clean · each
  pinned blob holds exactly its stage · no Firestore writes · covenant untouched · every ruling implemented exactly.
  One cosmetic note taken: the sequence.md tag `touches: [scan, integrations]` → `[scan]` (`integrations` is not a
  surface slug); Builder regenerated after it.
- **fix-red-team — no blocks-commit finding.** Re-derived blobs, stage hunks, bytes, greps, vendor signature, every
  Stage-1 branch and every `scanHideVerdict` caller; did not re-run the rig's runtime proofs (traced statically).
  Taken: residuals R12 (Google leg has no timeout) and R13 (T2 narrows FX-B's separation); nit R14 (no generation token
  on the native loop); process note R15 (parse-check passes an empty file); nit 3 — device step 7 and the felt delta now
  say Chrome reaches the verdict over a frozen frame (the recon's "BarcodeDetector browsers never reach a verdict" was
  true before SCAN-FIX.4, not after).

STOP — awaiting "commit and push".

## SHIPPED — 2026-10-18 (on Preston's "Commit and push")

`bb29310` SCAN-FIX.1 (v3.303) · `c9925df` SCAN-FIX.2 (v3.304) · `479b51d` SCAN-FIX.3 (v3.305) · `d245283` SCAN-FIX.4
(v3.306) — pushed `60ce6b5..d245283`; HEAD == origin/main == d245283cb9dca0485810b5917ed213b9faa08607.
Each commit's `git show --stat` = exactly its planned files; hook silent ×4; HEAD tree == working tree for
js/integrations.js, js/views.js, sw.js. Foundations re-md5: lumen-amber.css `070679b0…` 14,966 B · marks.js
`772886c0…` 10,255 B — unchanged.
Netlify deploy 6ad529d38b356a3a019372d4: commit_ref d245283, state ready, published 2026-10-18T20:19:41Z,
deploy_time 9 s, 5 functions deployed (no function source changed in this slice).
Live origin from this machine: curl `000`, exit 56 — the device check above is Preston's (PROTOCOL §9).
This SHIPPED note rides the SCAN-FIX.5 commit, with the device-check results below.

## Device check of SCAN-FIX.1–4 — Preston, iPhone Safari, live praxis-v3.306, 2026-10-18 ~3:20–3:25 pm CT

| step | result | what Preston saw |
|---|---|---|
| The Lorde book (9781324004615) | **PASS** | resolved with its title, author "Audre Lorde", a cover and "On your shelf" |
| Frozen frame behind the verdict | **PASS** | the frame showed behind the verdict |
| Rescan with "Keep scanning", several times | **PASS** | passed each time |
| Lock-on speed | felt fast | not timed in seconds |
| A DIFFERENT book after "Keep scanning" (a pink Routledge paperback, barcode far away and out of focus) | **FAIL** | the verdict appeared INSTANTLY reading "Not found · ISBN 9781324004615" — the PREVIOUS book's ISBN — over a frozen frame of the pink book; no chance to scan the new book |

The FAIL opens **SCAN-FIX.5** below.

---

# SCAN-FIX.5 — Stage 0 recon + instrument, 2026-10-18

Ground truth: HEAD `d245283` (SCAN-FIX.4), CACHE_VERSION `'praxis-v3.306'`, hook ARMED, FIX-PROTOCOL v1.3.
Tracked changes: only `docs/checkpoints/scan-fix.md` (the uncommitted SHIPPED note, +12 lines). Untracked: 111.
Re-read: CLAUDE.md · PROTOCOL.md · docs/FIX-PROTOCOL.md · .claude/agents/ (7) · this file — all present, none missing;
no commit has touched the protocol docs since they were read this session (`git log 60ce6b5..HEAD` on them: 0).

## The brief's code facts, checked against vendor/zxing/0.20.0/index.min.js

- ⚠ **PREMISE CORRECTED: `reset()` DOES reach `stopContinuousDecode()`** — `reset(){this.stopStreams(),…}` and
  `stopStreams(){…,!1===this._stopAsyncDecode&&this.stopAsyncDecode(),!1===this._stopContinuousDecode&&this.stopContinuousDecode()}`.
  A RUNNING loop (flag `false`) is stopped by reset().
- The real hole is the START. The constructor sets `_stopContinuousDecode=!1`; `decodeFromConstraints` awaits
  `getUserMedia`, then `decodeFromStream` → `this.reset()` → awaits `attachStreamToVideo` (which waits for the video
  to play) → `decodeContinuously(t,e){this._stopContinuousDecode=!1;…}`. A `reset()` that lands while a reader is
  still starting sets the flag to `true`, and `decodeContinuously` then **overwrites it with `false`**. The reader
  decodes forever, and `scanStopBookDecode` has already set `scanZxingReader = null`, so nothing can stop it. **An orphan.**
- Confirmed: `decodeContinuously` reschedules after a success (`timeBetweenScansMillis`, 150 ms since T2) and after
  NotFound/Checksum/Format (0 ms), always on the element it was given (`#scan-cam-video`). Every "Keep scanning" makes a
  new reader. `decodeFromConstraints` returns a promise that resolves right after the loop's first pass.
- Where orphans are born: (1) **entry** — `scanEnter` → `scanSetMode` → `scanStartBookDecode` creates a reader, and
  `scanEnter` then calls `scanStopBookDecode()` (:9786) while it is still awaiting getUserMedia → an orphan before the
  primer is tapped; (2) **every restart** — an orphan's confirm calls `scanStopBookDecode()` during the NEW reader's
  start (~300 ms on iOS) → that reader is orphaned too. Orphans multiply.

## The instrument (`.claude/scanfix-head/instrument2.js` + `harness5.js`, gitignored)

Fake camera via `getUserMedia` → `canvas.captureStream`: ISBN A (9781324004615, paper ground) until "Keep scanning",
then B (9780415389556, pink ground), alternating; 300 ms getUserMedia latency (iOS-like). Variant `stale`: each new
stream shows the PREVIOUS book for a set window. Counters: decode calls per zxing reader instance (prototype wrap on
`BrowserMultiFormatReader.prototype.decode`), every `scanOnBarcode` with its source reader, every `resolveBook`, every
`scanShowVerdict`. Google proxy = the rig's real 404; Open Library stubbed (A found, B a miss) with device-like latency.
Rig caveat found and fixed mid-run: the app's SW serves same-origin rig files cache-first (`cache:'no-store'` does not
bypass it), so the first two stale runs used an old instrument and are DISCARDED; every later fetch is `?v=`-busted. A
third stale run is also discarded: its F-d-on half inherited a chain already misaligned by its F-d-off half.

## 0.3 — reproduced on HEAD bytes (v3.306)

Entry, before "Allow" is tapped: **1 loop alive, 4–5 reads**, and a confirm + lookup + verdict before Allow.
`scanZxingReader` is `null` from then on. Five A→B cycles, Open Library at 2.5 s:

| cycle | camera | verdicts that landed (in order) | wrong-book | lookups | reads during the verdict | loops alive during the verdict |
|---|---|---|---|---|---|---|
| 1 | B | A, A, A, A — first at 598 ms after the tap | **4** | 10 | 15 | 3 |
| 2 | A | A,A,A,A,A,B(nf),A,B(nf),A,B(nf) | **3** | 8 | 17 | 4 |
| 3 | B | A,B(nf),B(nf),A,B(nf),B(nf),A,A,B(nf),B(nf),A,B(nf),A,B(nf) | **6** | 9 | 16 | 5 |
| 4 | A | A | 0 | 11 | 19 | 6 |
| 5 | B | B(nf)×5, A, B(nf), A, B(nf), A, B(nf), A, B(nf), A, A | **6** | 8 | 19 | 7 |

(nf = not found.) An earlier 4-cycle run: 25–45 lookups per 4 s window, 328 Open Library calls in four cycles.
**H1 REPRODUCES** — loops from earlier readers survive (orphans), keep reading during every verdict and after every
restart, and each of their confirms launches a lookup whose verdict lands whenever it lands. Cycle 1 is the device
FAIL exactly: camera on the new book, verdicts for the old ISBN arriving "instantly" (598 ms) over a frozen frame of
the new book (each orphan confirm calls `scanFreezeFrame()`, which draws the live video — the new book).
**H2** — with the orphans removed (the draft fix below), a camera whose new stream shows the previous book for 1 s
DOES re-confirm the previous book: **6/6 wrong** without F-d. So H2 is real ON THE RIG for a ≥ ~1 s stale window (a
300 ms window was not enough, because zxing's first decode waits for the new stream to play). Whether an iPhone delivers
stale frames that long is **device-only**.

## Why "Not found" for an ISBN that resolved minutes earlier — from code; the device cause stays UNKNOWN

A "Not found" barcode card means BOTH legs failed: `googleBooksSearch` returned no items or an err (integrations.js
:2511 / :2509 / :2514 — including a 429 after its 1.6 s backoff, or a fast fail while its 20 s breaker is open), AND
`isbnViaOpenLibrary` got no titled record: `fetchOpenLibrary` returns null on ANY fetch/JSON error (no `res.ok` check,
:1914–1961 — a 429/503 HTML body fails `res.json()`), or the 6 s limit fired. On HEAD the orphans fire **dozens of
lookups per verdict** (above), every one a Google proxy call (+2 retries on 429) and 1–2 Open Library calls for the same
ISBN — the load that trips Google's quota/breaker and makes Open Library slow or refuse. Which of these produced the
device's "Not found" is **UNKNOWN** (no egress to the live proxy, no device log). One measured data point, not a proof:
openlibrary.org timed out from this machine twice today at ~20:45 UTC (curl exit 28; the pane's fetch "Failed to
fetch"). And the verdict was "instant" because it was not the new scan's lookup at all — an older lookup landed after
the tap.

## 0.4 — the fix, as four parts (drafted on a scratch copy and run in the rig page; app code untouched)

- **F-a (as written: "stopContinuousDecode() before reset()") — REDUNDANT, and does not reach the bug.** reset()
  already calls it for a running loop, and during a start the flag it sets is overwritten by `decodeContinuously`.
  **Proposed F-a′ instead:** capture each reader (`zxReader`) and chain on its start promise
  (`decodeFromConstraints(...).then(onZxStarted)`); if that reader is no longer current when its loop starts, call
  `zxReader.stopContinuousDecode()` — which sticks now, because the loop is running — and stop its camera stream
  unless it is the one on screen (then `scanRegisterStream`, so FX-A's teardown owns it).
- **F-b — generation guard.** zxing: `onZx` drops a read unless `zxReader === scanZxingReader`. Native: each start
  takes `nGen = ++scanNativeGen`; a tick or an in-flight `detect()` with a stale gen ends. **Closes R14.**
- **F-c — one lookup at a time.** `scanAwaitingVerdict` from the confirming read until the verdict closes (reads
  ignored), plus a `scanLookupGen` token bumped on every close, so a lookup that lands after a mode switch / leave is
  dropped instead of popping a verdict. With F-a′+F-b the read gate is belt-and-braces (the confirm already stops the
  current reader); the lookup token is not redundant (it covers a close DURING a lookup, which nothing else does).
- **F-d — the last book is quiet for 1.5 s.** `scanShowVerdict` records the barcode ISBN shown; every close
  (`scanHideVerdict`, the one close path) quiets it for 1.5 s; `scanOnBarcode` ignores it in that window without
  counting it as a first read. The same book again works after 1.5 s. Shown necessary on the rig against a 1 s stale
  window (above). **Limit:** a stale window longer than 1.5 s would still misfire (R16).

**Draft results on the rig** (same harness, 300 ms getUserMedia, Open Library 2.5 s):
- Plain A↔B, 10 cycles: **10/10 correct**, **1 lookup per confirm**, **1 loop alive while scanning, 0 during the
  verdict, 0 reads during the verdict**; nothing reads before Allow.
- Stale 1 s, fresh session, F-d on: **8/8 correct** (verdict 2.4–2.9 s after the tap, once the stale frames pass).
  Stale 1 s, F-d off (fresh session): **6/6 wrong**.

**Bytes (measured on the draft, LF, views.js only):** **+3,043** = code **+1,956** / comment **+1,087**
(51 insertions, 7 deletions). Approximate code split by part: F-a′ + F-b zxing ~+700 (they share the capture line),
F-b native ~+310, F-c ~+550, F-d ~+480. sw.js **+0** (v3.306 → v3.307). Parse: the draft — PARSE OK, exit 0.
**Greps (HEAD → draft):** `stopContinuousDecode` 0 → 1 (in `onZxStarted`, NOT in `scanStopBookDecode`) ·
`onZxStarted` 0 → 2 · `zxReader !== scanZxingReader` 0 → 1 · `scanNativeGen` 0 → 4 · `scanAwaitingVerdict` 0 → 4 ·
`scanLookupGen` 0 → 5 · `scanQuietIsbn` 0 → 3 · `scanLastDecode !== isbn` **1 → 1** · the T2 constructor line and both
T1 hint lines **unchanged (1 → 1 each)**.

**Prior-fix regression check (§1 #2):** beside FX-A (`scanRegisterStream` reused, unchanged), FX-B (the read-twice gate,
unchanged), FX-G (`scanEnsureDisplay`, untouched), SCAN-FIX.2 (freeze/unfreeze lines unchanged; `scanHideVerdict` gains
lines AFTER `scanUnfreeze()`), SCAN-FIX.3 (T1/T2 lines unchanged), SCAN-FIX.4 (its reschedule line unchanged; F-b adds
the gen check above it). No shared names.

**Residuals named now:** R16 F-d covers stale frames up to 1.5 s only · R17 the pre-primer camera request at entry (R10)
is not removed — its reader is now stopped once started, but the request still happens · R18 the device "Not found"
cause stays UNKNOWN (above) · R12 (Google has no timeout) unchanged.

**Owner-visible delta (not a visual slice; no felt pass queued):** after "Keep scanning", a new book shows its own title
(or its own ISBN if not found), never the previous book's. No layout or copy change.

## Recon gate (§1#8) — fix-red-team, Sonnet, 2026-10-18 — and what changed

Static re-derivation (it did not re-run the rig). CONFIRMED: the premise correction against the vendor source; F-a as
written is redundant; F-a′ is the right mechanism (the start promise resolves microtasks after the loop's first pass, so
`stopContinuousDecode` sticks; the identity guard drops that first pass's read; `reader.stream` is a real field);
stopping a stale stream cannot black out the current display (only when `v.srcObject !== st`); F-b cannot drop the
current reader's reads; F-d cannot eat a first read and leaves FX-B's `scanLastDecode` alone; `scanHideVerdict` is the
only `is-up` remover; the cover shot passes `''`; Add/Open/Manual all pass through `scanHideVerdict`; no shared names
with FX-A/FX-B/FX-G or SCAN-FIX.2/3/4; +3,043 B and the T1/T2/`scanLastDecode` greps re-derived; parse OK and the
harness fails a broken copy. Findings, and what this recon did:

- **F1 (blocks-build as drafted) — TAKEN.** A reader whose start completes AFTER the user left (`scanLeave`, hashchange,
  pagehide) attaches to the detached `v`; the draft kept and registered that stream ("FX-A owns it") although FX-A's
  teardown had already run → camera light on until the next route change. HEAD leaks the same way via its orphan, but
  the draft's claim was false for this case. **Revised:** keep/register ONLY when
  `v.srcObject === st && scanEl('scan-cam-video') === v && scanOnScanRoute()`; otherwise stop the tracks.
- **F4 (hardening) — TAKEN.** The visibility re-warm restarts decode without closing the verdict; a hung lookup (R12)
  would have left `scanAwaitingVerdict` true and every read ignored. **Revised:** `scanStartBookDecode` also clears
  `scanAwaitingVerdict` and bumps `scanLookupGen` — a fresh decode session supersedes any lookup in flight.
- **F5 — TAKEN (rig runs added, revised draft):** 4 plain A↔B cycles all correct (1 lookup, 1 loop scanning, 0 during
  the verdict, 0 reads during it). **Mode switch to Shelf while a lookup is in flight:** the lookup lands, **0 verdicts**,
  no verdict up, gate clear, 0 loops; back to Book → the camera's book confirms normally (verdict B over camera B,
  2.75 s). **Leave (Back) while a lookup is in flight:** route `#books`, **0 verdicts**, **0 live camera tracks**, 0 loops.
- **F6 — TAKEN (bytes restated).** 529 B of trailing `//` comments had been counted as code.
- **F7 — TAKEN (wording).** "The verdict was instant because it was an older lookup landing after the tap" is a
  rig-consistent INFERENCE (cycle 1, 598 ms), not device-proven. The openlibrary.org timeouts from this machine are not
  evidence about the device and are withdrawn from the explanation.
- **F2, F3, F8 — residuals, named below.**

**Revised draft — bytes (LF, views.js, measured):** **+3,414** = code **+1,550** / comment **+1,864** (whole-line
+1,335, trailing +529); 56 insertions, 7 deletions. sw.js **+0** (→ v3.307). PARSE OK, exit 0.
**Greps, HEAD → revised draft (occurrences):** `stopContinuousDecode` 0 → 1 (in `onZxStarted`) · `onZxStarted` 0 → 2 ·
`zxReader !== scanZxingReader` 0 → 1 · `scanNativeGen` 0 → 4 · `scanAwaitingVerdict` 0 → 5 · `scanLookupGen` 0 → 7 ·
`scanQuietIsbn` 0 → 3 · `scanLastDecode !== isbn` **1 → 1** · T2 constructor line and the T1 hint lines **1 → 1**.

**Residuals (added by the gate):**
- **R19** (F2) the reader stopped during entry (pre-primer, R10/R17) attaches late; F-a′ keeps its stream because it is
  on screen, so the camera stays live behind the primer and Allow then opens a second stream (as on HEAD). A late attach
  during a Book→Shelf switch can put a book-mode stream on `v` over Shelf's hi-res stream (as on HEAD). Stale readers
  leave inert `ended`/`playing`/`canplay` listeners on `v`.
- **R20** (F3) if a stale reader's start never resolves (`play()` never fires `playing`; zxing swallows the failure),
  `onZxStarted` never runs and a stale stream that is not on screen is never stopped; only FX-A's 500 ms registration
  catches it, and only if it is displayed. getUserMedia rejection is safe (no stream).
- **R21** (F8) other orphan birthplaces, covered by F-a′ + F-b: two `scanStartBookDecode` calls queued on
  `loadZxingLibrary` before it is ready (entry, then Allow) make two readers, the second overwriting the first; a
  library-load callback landing while backgrounded (the re-warm then resets it).

## The one question

**F-a as written is a no-op** — `reset()` already calls `stopContinuousDecode()` for a running loop, and during a start
the flag it sets is overwritten by `decodeContinuously`, which is the actual bug. So the Stage 1 PASS grep
"stopContinuousDecode inside scanStopBookDecode" would test a line that does nothing. **Build F-a′ in its place** (stop a
replaced reader when its start completes; the grep becomes `stopContinuousDecode` inside `onZxStarted`), with F-b, F-c
and F-d as drafted including the two gate revisions?

HALT — awaiting go-ahead for SCAN-FIX.5 Stages 1–2.

**Preston's go-ahead (2026-10-18), verbatim:** "build F-a′ in place of F-a, plus F-b, F-c and F-d as drafted with the
two gate revisions. The Stage 1 grep is stopContinuousDecode inside onZxStarted."

# SCAN-FIX.5 — build record (Stages 1–2), 2026-10-18

## Stage 1 — build (js/views.js only; commit SCAN-FIX.5, → praxis-v3.307)

The approved draft (`.claude/scanfix-head/views-draft.js`, incl. the F1 and F4 gate revisions) was copied over
js/views.js after confirming js/views.js was byte-identical to HEAD (`git hash-object` == `HEAD:js/views.js`).

| file | expected | measured |
|---|---|---|
| js/views.js | +3,414 (code +1,550 / comment +1,864, revised draft) | **+3,414** = code **+1,550** / comment **+1,864** (whole-line +1,335, trailing +529); 56 insertions, 7 deletions |
| sw.js | +0 | **+0** (`praxis-v3.306` → `praxis-v3.307`) |

- Parse: js/views.js **PARSE OK, exit 0** · sw.js **PARSE OK, exit 0** (the harness fails a broken copy, exit 1 — shown
  at SCAN-FIX.1–4 and again by the recon gate).
- `stopContinuousDecode` **inside `onZxStarted`** (views.js:9892 `var onZxStarted = function () {` → :9894
  `try { zxReader.stopContinuousDecode(); } catch (eS) {}` → :9900 `};`); inside `scanStopBookDecode`: **0**.
- `scanLastDecode !== isbn` **1** · the T2 line `BrowserMultiFormatReader(zxHints, 150);` **1** and the T1 hint lines are
  **not in the diff** (grep of the `-U0` diff for them: 0).
- ES3 on added lines (`const`/`let`/`=>`/backtick): **0**. `git diff --check`: clean. EOL: js/views.js, sw.js
  **i/lf w/lf**, CR = 0.
- Where each part lives: globals after `scanCurrentVerdict` (:9824–9833) · F-c/F-d reset at the top of
  `scanStartBookDecode` · F-b native gen (`nGen`) in the BarcodeDetector branch · F-a′/F-b zxing (`zxReader`, `onZx`
  guard, `onZxStarted`, `zxStart.then`) after the unchanged T2 line · F-c/F-d gates in `scanOnBarcode` and the lookup
  token in its `resolveBook` callback · F-d record in `scanShowVerdict` · F-c/F-d close in `scanHideVerdict` (after
  the unchanged `scanUnfreeze()`).

## Stage 2 — proof on the rig (the REAL served bytes)

Fresh origin `http://localhost:8773` (new port, so no service worker holds the old views.js). Served `sw.js` reads
**praxis-v3.307**; the page's `scanStartBookDecode` contains `onZxStarted` and `scanHideVerdict` sets `scanQuietUntil`.
No BarcodeDetector (the iPhone's zxing path). Instrument as in Stage 0: 300 ms getUserMedia; Open Library stub.

**10 cycles A → Keep scanning → B → Keep scanning → A … (Open Library 2.5 s):**

| cycle | camera | verdict | wrong | lookups per confirm | loops alive while scanning (max) | loops alive during the verdict | reads during the verdict |
|---|---|---|---|---|---|---|---|
| 1 | B | B (not found) | 0 | 1 | 1 | 0 | 0 |
| 2 | A | A | 0 | 1 | 1 | 0 | 0 |
| 3 | B | B (not found) | 0 | 1 | 1 | 0 | 0 |
| 4 | A | A | 0 | 1 | 1 | 0 | 0 |
| 5 | B | B (not found) | 0 | 1 | 1 | 0 | 0 |
| 6 | A | A | 0 | 1 | 1 | 0 | 0 |
| 7 | B | B (not found) | 0 | 1 | 1 | 0 | 0 |
| 8 | A | A | 0 | 1 | 1 | 0 | 0 |
| 9 | B | B (not found) | 0 | 1 | 1 | 0 | 0 |
| 10 | A | A | 0 | 1 | 1 | 0 | 0 |

**10/10 on spec** — every verdict is the ISBN on camera; exactly 1 loop while scanning and 0 during a verdict; 1 lookup
per confirm. Entry: 0 loops and 0 reads before Allow. (B is "not found" by the stub's design: Open Library has no
record for it in the rig. A's verdicts take ~6 s because the stub delays each of Open Library's two requests 2.5 s.)

**Stale-frame variant** (each new stream shows the previous book for 1 s; fresh session): **6/6 correct** — B's verdict
never shows A and vice versa (verdict 2.57–2.90 s after the tap, once the stale frames pass).

**The same book twice** (camera stays on A): **3/3** confirm A again; the lookup starts 2.27–2.41 s after the tap
(after F-d's 1.5 s quiet window), verdict at 2.53–2.75 s.

**Regression — SCAN-FIX.1–4, same page:**
- SCAN-FIX.1: `resolveBook({kind:'isbn', isbn: A})` with Google failing (the rig's 404) → **'strong'**, "The Selected
  Works of Audre Lorde", 2 Open Library calls; with `noFallback: true` → **'none'**, **0** Open Library calls.
- SCAN-FIX.2: at a verdict, `#scan-cam-freeze` **display:block**, 1280 px wide, sampled pixel **[232,224,208]** (the fake
  frame's paper ground — not black).
- SCAN-FIX.4 + F-b: a fake BarcodeDetector returning B, B; `scanStartBookDecode()` called **twice 50 ms apart** → detect
  calls **2 at 2.5 s and still 2 at 4 s** (one chain: the first start's chain ended on the gen check), 2 reads,
  **1 lookup**, verdict up, `scanNativeDecoding` false.
- Mode switch to Shelf while a lookup is in flight (revised draft, Stage 0): 0 verdicts; back to Book confirms
  normally. Leave while a lookup is in flight: 0 verdicts, 0 live camera tracks, 0 loops.

Console on the rig: only 404s from the Google proxy (no functions on a static server). No script errors.

**Not provable here:** an iPhone's real stale-frame window (H2's length — F-d covers ≤ 1.5 s, R16); the device's
"Not found" cause (R18). Persistence is not touched by this slice.

## Gates on the built tree (Sonnet), 2026-10-18

**fix-red-team — no blocks-commit finding.** Re-derived: `git hash-object js/views.js` == the reviewed draft
(`e32a77c6…`), so the applied code IS the draft + the two revisions (F1 at :9897–9898, F4 at :9843–9844, as of that
review; after the F4 repair line below, the file is `e32a77c6…` + one line = `427f32f8…`, F4's reset at :9844–9845) — which also
makes the Stage-0 mode-switch / leave runs (made on the draft) runs of these exact bytes; bytes, greps, parse (two broken
copies fail, exit 1), EOL, close paths, the F1 route/element check, the native gen chain; no wrong-ISBN verdict after a
close or restart; FX-A/B/G and the two-read confirm untouched. Its findings:
1. **F4 leaves the freeze up on the visibility re-warm path — CONFIRMED ON THE RIG, a regression F4 introduced.**
   Confirm → lookup in flight → background/return (`visibilitychange` → `scanStopStream` → `scanStartStream` →
   `scanStartBookDecode`) with nothing readable on camera: the old lookup lands and is dropped by the gen token
   (correct), but nothing calls `scanUnfreeze()` → **freeze `display:block`, no verdict, gate clear, a reader running
   underneath (1 loop)** — a frozen frame with no buttons over a live scanner. (On HEAD the old verdict would have
   landed.) With the barcode still readable the restarted reader re-confirms and a verdict appears (rig: lookup 2 →
   verdict A), so the stuck case needs nothing readable on return. One-line repair offered:
   `if (scanAwaitingVerdict) { scanUnfreeze(); }` at the top of F4's reset in `scanStartBookDecode` (the cover-shot
   freeze never sets the gate, so it stays safe). Held for Preston's call (beyond the approved scope) → **APPLIED on
   his ruling; see "F4 repair" below (rig re-run: closed; fix-red-team: "F4 closed").**
2. **Residual R22** — a re-warm while a verdict is UP reopens the one-lookup gate on the zxing path (native is still held
   by `scanIsViewfinderLive`), so a new confirm can replace a shown verdict after a re-warm; the same ISBN can
   re-confirm (it is quieted only on close). Same as HEAD; the F-c comment's "until the verdict closes" overstates it.
   **Amended after the F4 repair (red-team):** the gate is still true while a barcode verdict is up, so a re-warm in that
   state also runs the repair line and removes the frozen frame from behind the SHOWN verdict — the card stays, its
   buttons work, the live camera shows behind it. Not stuck, but a visible inconsistency (a cover-shot verdict keeps its
   frame, because the cover shot never sets the gate). Testing `#scan-verdict.is-up` instead of the gate would make it
   exact; not done (beyond the ruled line).
3. **Nit** — F1's late-attach branches and F4's re-warm path were proven by code reading only (until finding 1's rig run
   above, for F4); the "0 live tracks after leave" run exercises a reset current reader, not the `onZxStarted` stop.
4. **Nit** — F-d's window uses `Date.now()`; a wall-clock jump could stretch or shrink it (R16 already bounds it).

## F4 repair — Preston's ruling ("Apply the one-line unfreeze fix for F4"), 2026-10-18

**What F4 was:** if the app was backgrounded while a scan was being looked up and the camera saw nothing readable on
return, the restarted scanner dropped that old lookup but left its frozen picture on screen — a still frame with no
verdict and no buttons, over a camera that was in fact scanning again. **What the one line changes:** when a fresh scan
session starts while a lookup was still pending, it now removes that frozen picture too, so the reader sees the live
camera instead of a frame that will never get a verdict.

The line (js/views.js:9843, inside `scanStartBookDecode`, before F4's `scanAwaitingVerdict = false;`):
`if (scanAwaitingVerdict) { scanUnfreeze(); }   // its frozen frame goes with it (else a frame with no verdict)`

| file | measured |
|---|---|
| js/views.js — the line | **+113** = code **+49** / trailing comment **+64** |
| js/views.js — the slice vs HEAD | **+3,527** = code **+1,599** / comment **+1,928** (whole-line +1,335, trailing +593) |
| sw.js | **+0** (still `praxis-v3.306` → `praxis-v3.307`) |

PARSE OK, exit 0 · CR 0 · `git diff --check` clean · `scanUnfreeze()` 8 → 9 · `scanLastDecode !== isbn` 1 ·
`stopContinuousDecode` only in `onZxStarted` (:9895).

**Rig, re-run on the fixed bytes** — fresh origin `http://localhost:8774`, served sw.js `praxis-v3.307`, the page's
`scanStartBookDecode` contains the line; no BarcodeDetector; 300 ms getUserMedia; Open Library 2.5 s:
- **The F4 case** (confirm → lookup in flight → the re-warm sequence `scanStopStream` → `scanStartStream` →
  `scanStartBookDecode`, nothing readable on camera): at the lookup freeze `block`, gate true → **right after the
  re-warm: freeze `none`**, gate false, no verdict → **7 s later: freeze `none`, no verdict, the old lookup landed and
  was dropped, 1 loop scanning the live camera.** Then pointing at a real book: it confirms (verdict A over camera A,
  4.9 s). (Before the line, the same run left freeze `block` with no verdict — recorded above.)
- **Control** — the same re-warm with the barcode still readable: verdict A over camera A (2 lookups landed, the old one
  dropped, the new one shown).
- **10 cycles A → Keep scanning → B → …: 10/10 on spec** — every verdict the book on camera; 1 lookup per confirm;
  1 loop while scanning, 0 during a verdict, 0 reads during a verdict; 0 loops and 0 reads before Allow.
- **Mode switch to Shelf mid-lookup:** 0 verdicts, freeze `none`, gate false, 0 loops; back to Book → verdict B over
  camera B (3.0 s).
- **Leave (Back) mid-lookup:** route `#books`, 0 verdicts, 0 loops, **0 live camera tracks**.

**Re-gates on the repaired tree (Sonnet), 2026-10-18:**
- **praxis-reviewer — gate (A) CLEARED, the one-line fix CLEARED.** Deleting line 9843 from a scratch copy hashes to
  the reviewed `e32a77c6…` (the line is the only change); sw.js 306 → 307 only; parse exit 0; ES3 clean on the 57 added
  lines; i/lf w/lf, CR 0; +3,527 and the line's 113 B (49 code / 64 trailing comment) measured; foundations 14,966 B /
  10,255 B; `git diff --check` clean; the line is a no-op for the cover-shot, shelf-shot, mode-switch, grant, dismiss and
  Add callers and acts only on the re-warm. builder.html: the generator reads `docs/studio/` + `docs/launch-runway.md`
  only — its one changed input, sequence.md (16:16), predates its finished output (16:23, warnings 0), so it is current.
- **fix-red-team — "F4 closed"; no blocks-commit finding.** Traced all five callers of `scanStartBookDecode`; the line
  cannot unfreeze the cover-shot or shelf-shot freeze (both hide the verdict — gate false — before freezing). Its one
  residual is folded into R22 above (a re-warm while a barcode verdict is up now also removes the frame behind the shown
  card). Its "needs a rig re-run" nit is answered by the F4 run above.

Final tree (2026-10-18): `git diff HEAD --stat` — BUILD_STATE.md 2 ± · scan-fix.md +357 · builder.html 8 ± ·
sequence.md 15 ± · js/views.js 64 ± · sw.js 2 ± (6 files, 433+ / 15−). js/views.js `427f32f8…`, +3,527 LF; sw.js +0.
Foundations md5 `070679b0…` / `772886c0…` unchanged. `stash@{0}` predates this slice and is untouched.

**Commit plan (ONE commit, explicit files, real index):** `git add js/views.js sw.js docs/checkpoints/scan-fix.md
docs/studio/sequence.md "docs/Checklist and Roadmap/BUILD_STATE.md" docs/studio/builder.html` → subject
"SCAN-FIX.5 — one decode loop at a time; a new scan can't re-read the last book", CACHE_VERSION `praxis-v3.307`.

STOP — awaiting "commit and push".

## What Preston runs — device check (live origin unreachable from this machine: curl 000, exit 56)

iPhone, Safari, praxis-reading.netlify.app, after "commit and push", the Netlify build and the "new version" banner
(tap **Reload**; again if it reappears). Optional: `/#diag` → the bundle line reads **praxis-v3.307**.
1. **The Lorde book → Keep scanning → a different book.** Scan → Book → the Lorde book; when its verdict shows, tap
   **Keep scanning** and point at a different book (the pink Routledge paperback is ideal). PASS: the verdict shows THAT
   book's title — or "Not found" with ITS OWN ISBN — never "ISBN 9781324004615". Also try it with the camera far away
   and out of focus, as before: PASS = no verdict appears until the barcode is actually readable.
2. **Three different books in a row**, "Keep scanning" between them. PASS: each verdict names the book on camera.
3. **The same book twice in a row**: verdict → Keep scanning → the same book. PASS: it confirms again (after about a
   second and a half).
4. **Optional — leave mid-lookup (the F4 path):** point at a barcode and, the instant the gold brackets flare, press the
   Home button (or switch apps); come back with the camera pointed at a blank wall. PASS: the live camera shows — not a
   frozen picture with no card — and pointing back at a book scans it.
Report each as PASS/FAIL with what you saw (and the ISBN line if any verdict looks wrong).

## SCAN-FIX.5 SHIPPED — 2026-10-18 (on Preston's "commit and push")

`1e6e026` SCAN-FIX.5 (praxis-v3.307) — pushed `d245283..1e6e026`; HEAD == origin/main ==
1e6e0262869be6c6a4d7c5791ae395bcb5f605e1; hook silent; exactly the six planned files. Foundations md5 unchanged
(`070679b0…` / `772886c0…`). Netlify deploy 6ad5408af682b72b45ff4fb6: commit_ref 1e6e026, state ready, published
2026-10-18T21:56:37Z, deploy_time 9 s, 5 functions (unchanged digests). `stash@{0}` untouched.

## Device check of SCAN-FIX.5 — Preston, iPhone Safari, live praxis-v3.307, 2026-10-18 ~5:10–5:20 pm CT (close-out)

Preston: "It works significantly better now and I did every test."

| step | result |
|---|---|
| 1 · The Lorde book → Keep scanning → a different book | **PASS** — the right book |
| 2 · Three different books in a row | **PASS** |
| 3 · The same book twice in a row | **PASS** |
| Leaving the scan screen | **PASS** |
| 4 · Switching apps mid-lookup (the F4 path) | **PASS** |

**SCAN-FIX.5 CLOSED** on the device. New issue from the same session → **SCAN-FIX.6** below.

---

# SCAN-FIX.6 — Stage 0 recon + instrument, 2026-10-18

**The issue (Preston, device, 5:19 pm):** every entry to Scan shows "Turn on the camera to scan" and needs "Turn on
camera" again — and his screenshot of that card shows iOS's green camera dot: the camera is already running behind a
card that asks to turn it on.

Ground truth: HEAD `1e6e026`, CACHE_VERSION `'praxis-v3.307'`, hook ARMED, FIX-PROTOCOL v1.3. Tracked changes: none
before this file. Untracked: 111. Re-read: CLAUDE.md · PROTOCOL.md · docs/FIX-PROTOCOL.md · .claude/agents/ (7) · this
file — all present, none missing; no commit has touched the protocol docs since they were read this session.

## 0.2 — every camera start from `scanEnter` (js/views.js @ 1e6e026)

`renderScan` (:11357) → `scanMode` from the preselect (:11373) → `scanEnter()` (:11386). `scanEnter` (:9780–9789):
`scanGoScreen` → `scanCloseAllOverlays` (:9782) → `scanHideVerdict` → **`scanSetMode(scanMode||'book')` (:9785)** →
`scanStopBookDecode` (:9786) → offline? → `scanOpenOverlay('scan-ov-offline')` (:9787) : `scanOpenOverlay('scan-ov-primer')` (:9788).
Inside `scanSetMode` (:9719): `scanCamReady` is false on entry (route teardown ran `scanStopStream`), so the else
branch runs **`scanEnsureDisplay()` (:9741)** — its overlay guard (:9675) cannot hold, because `scanEnter` closed every
overlay at :9782 and opens the primer only at :9788 — so it calls **`scanStartStream` → getUserMedia (:9628)**; then
in Book mode **`scanStartBookDecode()` (:9745)** → zxing **`decodeFromConstraints` → its own getUserMedia (:9903)**
(at once when zxing is loaded; after the lazy load on a first visit).

| path | camera starts, in order | primer/card up? |
|---|---|---|
| (a) first entry | ours (:9741 → :9628), then zxing (:9745 → :9903, after the library loads) | primer opens at :9788 — both requests precede the reader's tap |
| (b) re-entry | ours, then zxing (synchronously; `scanEnter`'s stop at :9786 then resets that reader mid-start — SCAN-FIX.5's F-a′ stops it once started) | the same |
| (c) offline | ours, then zxing — BEFORE the offline check | offline card over a live camera |
| (d) denied card → "Try the camera again" (:11621) | none — it only reopens the primer | — |
| (e) Book↔Shelf after a grant (`scanCamReady` true) | Shelf: `scanAcquireShelf` (:9738); Book: `scanStopStream` + `scanEnsureDisplay` (:9739) then zxing (:9745) | no card |
| "Turn on camera" (`scanGrantAndWarm` :9791) | ours (:9794), then zxing after 850 ms (:9798); failure → denied card (:9802) | — |

The primer covers the mode switch and Back (z-index 50; `elementFromPoint` at both returns `scan-ov-primer`), so entry
is the only path that lights the camera behind a card.

## 0.3 — instrument on HEAD (`.claude/scanfix-head/instrument3.js`, gitignored)

Fresh origin `http://localhost:8775`, served `praxis-v3.307`; `getUserMedia` counted with who called it (zxing tagged by
wrapping its `decodeFromConstraints` when the lazy library lands) and which card was up; 300 ms getUserMedia latency.

| path | getUserMedia before "Turn on camera" | live camera tracks behind the card |
|---|---|---|
| (a) first entry | **2** (ours + zxing) | (zxing's arrived while the primer was up) |
| (b) re-entry | **2** | **1** — the green dot in Preston's screenshot |
| (c) offline | **2** | **1** behind the offline card |
| (d) denied-card retry | 0 | — |
| (e) Shelf / Book switch after a grant | Shelf **1**, Book **2** — the reference for "unchanged" | — |

**R10 reproduced on the rig.**

## 0.4 — the Permissions API, as far as this machine can show

- The vendored code (`vendor/`) never uses `navigator.permissions`.
- The rig's Chromium: `navigator.permissions.query({name:'camera'})` works and returns **`'denied'`** (this machine's real,
  absent camera; the rig's fake getUserMedia does not change it) — so every rig proof stubs the API.
- **iOS Safari: UNKNOWN** — whether `query({name:'camera'})` is supported, what it returns under Safari's per-site
  "Ask / Allow / Deny" setting, and whether a grant persists across visits. Not guessed. The design treats every answer
  safely: `'granted'` → straight to the camera; `'denied'` → the denied card (its "Try the camera again" still reaches the
  primer, so a wrong 'denied' is recoverable in one tap); `'prompt'`, a throw, a missing API, or no answer within 1 s →
  the remembered flag decides.
- Safari's own permission prompt is the browser's and may still appear after the card is skipped (Preston's note).

## 0.5 — the proposed change (drafted on a scratch copy, run in the rig page; app code untouched)

**B — no camera before the reader says yes:** `scanSetMode(m, entry)` gains an `entry` flag; with it, the mode chrome is
set and decode stopped but NO camera starts (neither `scanEnsureDisplay` nor `scanStartBookDecode`). `scanEnter` passes
`true`. Every other caller (the mode switch, Book after a grant) is unchanged — FX-G and FX-I keep their behavior there.
Consequence (stated): the offline card no longer sits over a live camera.
**A — the primer shows once:** after the offline check (SCE-3 still first, unchanged), `scanEnter` asks
`scanCameraDecision`: `'go'` → `scanGrantAndWarm()` (the exact path "Turn on camera" uses); `'denied'` → forget the flag,
denied card; `'ask'` → `scanOpenOverlay('scan-ov-primer')`. The flag `praxis_scan_camera_ok` is set (`sv`) when
`scanGrantAndWarm`'s stream starts and cleared (`sv`) when it fails; read once through `ls`. A decision that lands after
a leave or re-entry is dropped (`scanEntryGen`, `scanOnScanRoute()`, the primer element present).
**Seeing the first-time card again:** a Safari private tab does NOT work signed-out — `#scan` signed out renders "Sign in
to scan" (:11361), never the primer; signed in, a private tab would likely show it but that depends on Safari's
permission state there (UNKNOWN). **Proposed: `#scan/primer`** — `renderScan` reads the preselect, and that entry forgets
the flag and shows the primer once (Book mode), whatever the Permissions API says. No new UI, no copy.

**Rig, the draft (fake camera, Permissions API stubbed per row):**

| case | card | getUserMedia | flag | result |
|---|---|---|---|---|
| T1 first entry, no flag, no API | **PRIMER** | **0** while up | — | Allow → 2 calls (ours + zxing), a scan confirms, flag set |
| T2 re-entry, flag set | **none** | 2 | kept | the camera comes straight up; a scan confirms |
| T3 flag set, camera denied | **DENIED** | 1 (rejected) | **cleared** | |
| T4 offline | **OFFLINE** | **0** | kept | |
| T5 API 'granted', no flag | none | 2 | set | |
| T6 API 'denied', flag set | **DENIED** | **0** | **cleared** | |
| T7 API throws, flag set | none | 2 | kept | falls back to the flag |
| T7b API 'prompt', no flag | **PRIMER** | **0** | — | |
| T8 `#scan/primer`, flag set + 'granted' | **PRIMER** | **0** | cleared | Allow → flag set; the next entry skips the card |

**Bytes (measured on the draft, LF, views.js only):** **+2,521** = code **+1,469** / comment **+1,052** (whole-line
+654, trailing +398); 41 insertions, 3 deletions. sw.js **+0** (→ `praxis-v3.308`). PARSE OK, exit 0.
**Greps (HEAD → draft):** `praxis_scan_camera_ok` 0 → 1 (the constant) · `ls(SCAN_CAM_OK_KEY` 0 → 1 ·
`sv(SCAN_CAM_OK_KEY` 0 → 4 · raw `localStorage` in views.js 10 → 10 (unchanged — the key never touches it directly) ·
`scanOpenOverlay('scan-ov-primer')` 2 → 3 (the first-time path is still there) · `navigator.permissions` 0 → 3 ·
`scanSetMode(scanMode || 'book', true)` 0 → 1.

**Prior-fix regression check (§1 #2):** beside FX-G (`scanEnsureDisplay` untouched; its entry call is what B skips),
FX-I (`scanAcquireShelf` and the live-switch branch untouched), SCE-3 (offline first, unchanged line), SCAN-FIX.5
(`scanStartBookDecode` and its guards untouched). No shared names.

**Pre-existing drift (flagged, not fixed):** `renderScan`'s comment (:11375) says a pending draft makes "the primer
offer Review" — stale since the 2026-08-30 ruling that the draft bar supersedes the primer's resume button (:11512–11522).

**Residuals named now:**
- **R23 → L3** the primer copy "nothing is stored, on your device or ours" overclaims for images sent to the
  identification AI; L3's consent/honest-copy work owns it (not edited here, per the non-goals).
- **R24** with the card skipped, a returning reader no longer sees the primer's "Add without the camera" button; the
  manual add doors stay on the denied/offline cards and the Shelf's add.
- **R25** iOS Safari's Permissions API behavior is UNKNOWN (0.4); every answer is handled.
- R10 → **closed by B** (on build).

**Owner-visible delta (not a visual slice; no felt pass queued):** on a later entry, the camera comes straight up with no
card; on a first entry (or `#scan/primer`), the card shows with the camera OFF until "Turn on camera". No layout or copy
change.

## Recon gate (§1#8) — fix-red-team, Sonnet, 2026-10-18 — and what changed

No blocks-build finding. Re-derived: bytes, greps (`navigator.permissions` is 3 occurrences on 2 lines), ES3, parse (and
two broken copies fail, exit 1), every 0.2 cite (`scanMode`'s assignment is :11374, not :11373), the FX-G guard claim,
`scanEnter`'s only callers (renderScan, the offline retry), the seg buttons' non-entry `scanSetMode`, the router sending
`#scan/primer` to `renderScan('primer')` with Book mode, the Shelf preselect getting the hi-res stream, the decision's
settled/timeout/throw handling, and the denied → retry → primer → Allow recovery. Findings and what the draft did:
1. **`scanEntryGen` was bumped after the offline return** — an older pending decision could survive a leave + OFFLINE
   re-entry and replace the offline card (breaking SCE-3). **Fixed:** the bump moves above the offline check. Rig N3.
2. **The decision window (≤ 1 s) left the mode switch live** — a tap there ran the non-entry `scanSetMode` and lit the
   camera before the card. **Fixed:** `scanDeciding` makes such a tap set the chrome only (the decision then starts the
   camera in the tapped mode, or opens the primer). Rig N5.
3. **Residual R26** (pre-existing, rare): nothing is made inert behind an overlay, so keyboard / VoiceOver focus can still
   reach the seg buttons behind the primer (from `#scan/shelf`, a Book switch there runs `scanStartBookDecode`, which has
   no overlay guard); and `scanGrantAndWarm`'s 850 ms timer is not entry-gated (a re-entry within 850 ms of a previous
   grant could start decode under a new primer).
4. **Ruling needed — the account-delete wipe.** `praxis_scan_camera_ok` is a per-DEVICE camera flag, not account data;
   it is not in `ACCOUNT_GLOBAL_KEYS` (integrations.js:1325), so deleting the account leaves it. **Proposed: leave it** —
   it holds no prose or identity, it describes this device's camera permission (which deleting an account does not
   revoke), and it self-heals on a failed start. integrations.js stays out of scope.
5. **Residual (part of R25):** the flag is cleared only on a `scanGrantAndWarm` failure (transient errors included —
   conservative). A Shelf re-acquire failure (:9690), the visibility re-warm, or a later revoke don't clear it; the next
   entry auto-starts, fails, clears it and shows the denied card (after a brief warm-up glow) — not the primer; "Try the
   camera again" recovers.
6. **`#scan/primer` stayed in the URL** (a reload / PWA restore / bookmark re-forced it). **Fixed:** `renderScan` rewrites
   it to `#scan` (`history.replaceState`, no route re-render). Stated: if that entry is offline, the force stays armed and
   applies at the "I'm back online" retry; the flag is cleared when the card shows (leaving without Allow means the next
   entry asks again — that is the point of the check).
7. **Stale comments in `scanSetMode`** (the FX-I note "leave FX-G's scanEnsureDisplay exactly as shipped" on entry, the
   FX-G "fresh-entry setup" note) — **corrected** in the draft.
8. **The stale `renderScan` comment** ("the primer offers Review") — **corrected** in the draft (it rides with the diff,
   since this slice edits `renderScan`).

**Revised draft — bytes (LF, views.js, measured vs HEAD):** **+3,118** = code **+1,694** / comment **+1,424**
(whole-line +779, trailing +645). sw.js +0 (→ v3.308). PARSE OK, exit 0. Greps unchanged in kind: the key only through
`ls` (1) / `sv` (4); raw `localStorage` 10 → 10; `scanOpenOverlay('scan-ov-primer')` 2 → 3.

**Rig, revised draft** (fresh page; T1–T8 as above, re-run — identical results, plus T8's URL now reads `#scan`):

| case | result |
|---|---|
| N1 API never answers, flag set | 0 getUserMedia at 0.6 s; the camera starts by 2 s (the 1 s fallback) |
| N1 API never answers, no flag | 0 getUserMedia; the primer opens after ~1 s |
| N2 leave mid-decision (flag set, API hangs) | the late 'go' is dropped: 0 getUserMedia, 0 live tracks on `#books` |
| N3 online entry → leave → offline re-entry inside the window | the offline card stays; 0 getUserMedia (finding 1) |
| N5 a mode tap during the decision (no flag) | mode → Shelf, 0 getUserMedia; the primer then opens; still 0 (finding 2) |
| N4 `#scan/shelf` with the flag (API absent) | no card; 1 getUserMedia with `{width:{ideal:2560},height:{ideal:1440}}` — the hi-res Shelf stream; no decode |

## The one question

Approve A + B as revised — with **`#scan/primer`** as the way to see the first-time card again, and the camera flag
**left out of the account-delete wipe** (finding 4)?

HALT — awaiting go-ahead for SCAN-FIX.6 Stages 1–2.

**Preston's go-ahead (2026-10-18), verbatim:** "Go-ahead for SCAN-FIX.6 Stages 1–2: build A + B as revised, with
#scan/primer to see the first-time card again, and leave the camera flag out of the account-delete wipe."
→ Finding 4 RULED: `praxis_scan_camera_ok` stays out of `ACCOUNT_GLOBAL_KEYS`; deleting an account leaves this device's
camera flag (R27, by ruling).

# SCAN-FIX.6 — build record (Stages 1–2), 2026-10-18

## Stage 1 — build (js/views.js only; commit SCAN-FIX.6, → praxis-v3.308)

The revised draft (`.claude/scanfix-head/views6-draft.js`) was copied over js/views.js after confirming js/views.js was
byte-identical to HEAD.

| file | expected | measured |
|---|---|---|
| js/views.js | +3,118 (code +1,694 / comment +1,424) | **+3,118** = code **+1,694** / comment **+1,424** (whole-line +779, trailing +645) |
| sw.js | +0 | **+0** (`praxis-v3.307` → `praxis-v3.308`) |

- Parse: js/views.js and sw.js **PARSE OK, exit 0**. ES3 on added lines: **0**. `git diff --check`: clean. EOL: both
  **i/lf w/lf**, CR 0. Hunks touch only `scanSetMode`, the new block before `scanEnter`, `scanEnter`,
  `scanGrantAndWarm`, `renderScan`.
- Greps (HEAD → now): `praxis_scan_camera_ok` 0 → 1 (the constant) · `ls(SCAN_CAM_OK_KEY` 0 → 1 ·
  `sv(SCAN_CAM_OK_KEY` 0 → 4 · `SCAN_CAM_OK_KEY` used anywhere other than its definition, `ls(` or `sv(`: **0** · raw
  `localStorage` **10 → 10** · `scanOpenOverlay('scan-ov-primer')` **2 → 3** (the first-time path present) ·
  `scanSetMode(scanMode || 'book', true)` 0 → 1. SCAN-FIX.1–5 lines unchanged: `scanLastDecode !== isbn` 1 → 1 ·
  `if (scanAwaitingVerdict) { scanUnfreeze(); }` 1 → 1 · `BrowserMultiFormatReader(zxHints, 150);` 1 → 1.

## Stage 2 — proof on the rig (the served bytes)

Fresh origin `http://localhost:8776`; served `sw.js` reads **praxis-v3.308**; the page's `scanEnter` calls
`scanCameraDecision`. No BarcodeDetector. Fake camera (an EAN-13 for A); getUserMedia counted per caller; 300 ms latency;
Permissions API stubbed per row (the rig's real Chromium answers 'denied').

| case | card | getUserMedia | flag | result |
|---|---|---|---|---|
| T1 first entry, no flag, no API (zxing not yet loaded) | **PRIMER** | **0** while it is up | — | "Turn on camera" → ours + zxing; the Lorde book confirms **3.1 s** after the tap; **flag set** |
| T2 re-entry, flag set | **none** | 2 (ours + zxing) | kept | the camera comes straight up; **a scan confirms** |
| T3 flag set, camera denied | **DENIED** | 1 (rejected) | **cleared** | |
| T4 offline, flag set | **OFFLINE** first | **0** | kept | |
| T5 API 'granted', no flag | none | 2 | set | |
| T6 API 'denied', flag set | **DENIED** | **0** | **cleared** | |
| T7 API throws, flag set | none | 2 | kept | falls back to the flag |
| T7b API 'prompt', no flag | **PRIMER** | **0** | — | |
| T8 `#scan/primer`, flag set + 'granted' | **PRIMER** | **0** | cleared | URL now `#scan`; Allow → flag set; the next entry skips the card |
| N1 API never answers, flag set | none | 0 at 0.6 s → the camera by 2 s | kept | the 1 s fallback |
| N1 API never answers, no flag | PRIMER after ~1 s | **0** | — | |
| N2 leave mid-decision (flag, API hangs) | — | **0**, 0 live tracks on `#books` | | the late 'go' dropped |
| N3 online entry → leave → offline re-entry inside the window | **OFFLINE** stays | **0** | | (gate finding 1) |
| N5 mode tap during the decision (no flag) | PRIMER then opens | **0** throughout | | mode → Shelf (gate finding 2) |
| N4 `#scan/shelf`, flag set | none | 1 — `{width:{ideal:2560},height:{ideal:1440}}` | kept | the hi-res Shelf stream; no decode |

**Regression — SCAN-FIX.5 (fresh page, no flag, so the first entry goes through the primer):** 10 cycles A → Keep
scanning → B → …: **10/10 on spec** — every verdict the book on camera, 1 lookup per confirm, 1 loop while scanning,
0 during a verdict, 0 reads during a verdict; 0 loops and 0 reads before Allow. **Leave mid-lookup:** `#books`,
0 verdicts, 0 loops, **0 live camera tracks**.
Console: no script errors (only the rig's Google-proxy 404s).

**R10 — CLOSED ON THE ENTRY PATH** (no camera before "Turn on camera" on any entry: 0 getUserMedia while the primer or
the offline card is up in rows T1, T4, T6, T7b, T8, N1, N3, N5 — true for the rows driven). Late completions from an
EARLIER session are not gated and are carried as the widened **R26** below. **R23 → L3** (primer copy) handed off, not edited.
**Not provable here:** iOS Safari's Permissions API answers (R25) and whether Safari asks its own prompt again on a
remembered entry (the browser's, not ours).

## What Preston runs — device check (live origin unreachable from this machine)

iPhone, Safari, praxis-reading.netlify.app, after "commit and push", the Netlify build and the "new version" banner
(tap **Reload**; again if it reappears). Optional: `/#diag` → **praxis-v3.308**.
1. **Open Scan normally.** PASS: no "Turn on the camera" card — the camera comes straight up. (Safari may still show its
   OWN small permission prompt; that one is Safari's and is expected.) The first time after this update the card may
   appear once (no grant remembered yet): tap "Turn on camera"; from then on it should not.
2. **See the first-time card again — in a SAFARI TAB, signed in** (the installed home-screen app has no address bar, and
   a Safari tab keeps its own storage, so this exercises the Safari tab's remembered grant, not the app's): open
   `praxis-reading.netlify.app/#scan/primer`. PASS: the card shows **and there is NO green camera dot while it is up**;
   the address then reads `#scan`; tapping "Turn on camera" starts the camera (the dot appears only then). In the
   installed app there is no in-app way to re-show the card: it returns only if a camera start fails (the remembered
   grant is then forgotten, the denied card shows, and its "Try the camera again" opens the first-time card). Which iOS
   setting would force that failure for an installed app is UNKNOWN here — not given as a step.
3. **One Lorde scan** (978-1-324-00461-5). PASS: "The Selected Works of Audre Lorde", as before.
Report each as PASS/FAIL.

**Residuals (this slice):** R23 → L3 (primer copy "nothing is stored, on your device or ours" overclaims for
identification images) · R24 a returning reader no longer sees the primer's "Add without the camera" button · R25 iOS
Permissions API behavior UNKNOWN, and the flag self-heals rather than clearing on non-grant-path failures (gate finding 5)
· **R26 (widened at the build red-team)** getUserMedia can still fire under a primer through paths this slice did not
gate, all from an EARLIER session's work completing late: (a) `scanStartBookDecode` (no overlay or entry guard) from
`scanGrantAndWarm`'s 850 ms timer, which runs from the tap through the stream resolving (≥ 300 ms; seconds on iOS) plus
850 ms; (b) zxing's queued `loadZxingLibrary` callback on a first visit (checks mode and the video only); (c) a late
`scanStartStream` completion from an older entry (it also writes the flag true and `scanCamReady` from a stale shell).
`renderRoute` re-runs WITHOUT a hashchange on auth / Firestore merges (integrations.js:161, :252, :332 …), so a PWA cold
start onto `#scan` can re-enter `scanEnter` while such work is in flight; not driven on the rig. Plus the original gate
finding 3: focus (keyboard / VoiceOver) can reach the seg buttons behind an overlay · R27 the camera flag survives an
account delete (ruled) · **R28** during the decision window (≤ 1 s, only when the Permissions API is slow) the capture
view is live with no overlay: the draft bar's Resume and Back are tappable, and a 'go' landing after Resume would start
the camera behind the review screen (the callback checks route, gen and shell, not the active screen); a 'go' while
`document.hidden` may be refused and clear the flag (harmless: the next entry shows the card).

## Gates on the built tree (Sonnet), 2026-10-18

- **fix-red-team — no blocks-commit finding.** Re-derived: applied js/views.js md5 `2f7c5263…` == the reviewed draft;
  its earlier findings 1, 2, 6, 7, 8 present in the code (:9817, :9821/:9734, :11418, :9730–9747, :11420); +3,118 B; the
  key only via `ls`/`sv` (6 uses: definition + 1 + 4); raw `localStorage` 10 → 10; primer opener 2 → 3; parse OK and two
  broken copies fail (exit 1); five hunks only; SCAN-FIX.1–5 anchors untouched; no copy changed; no
  `ACCOUNT_GLOBAL_KEYS` edit; `scanDeciding` cannot stick (every `scanEnter` resets it; a stale callback cannot clear a
  newer entry's flag); `history.replaceState` fires no hashchange, nothing reads `history.state`, `activeRoute` stays
  `scan`, later `renderRoute` re-runs see `#scan` (the force cannot re-fire); the leftover 1 s timer is inert; the
  visibility re-warm writes no flag; the shutters are guarded by `scanCamReady`. Findings taken: (1) R10's closure scoped
  to the entry path and **R26 widened** (above); (2) device step 2 made runnable — a signed-in Safari tab, with the PWA
  limitation stated (above); (3) **R28** (above); (4) **BOARD.md row 19 + `docs/studio/scan.md`** now record SCAN-FIX.1–6
  (they had recorded none of it) — ride this commit; (5) the code/comment split is a classification the agent did not
  reproduce exactly (the total +3,118 it confirmed).
- **praxis-reviewer — code CLEARED; HOLD on the staging plan only.** Every code gate PASS: ES3 (0 of 53 added lines) ·
  foundations 14,966 / 10,255 B · +3,118 LF re-derived, and the code +1,694 / comment +1,424 split reproduced exactly
  (trailing comments counted with their line's LF) · sw.js 307 → 308 only · EOL · `git diff --check` · parse · the key
  only via `ls` (:9794) / `sv` (:9820, :9826, :9836, :9842), raw `localStorage` 10 → 10 · primer opener 2 → 3 · every
  ruling at its line · SCAN-FIX.1–5 untouched · no copy change · both stale comments corrected · logged-out / offline /
  denied states honest · integrations.js unchanged (the wipe ruling). The HOLD: the plan named 6 files while BOARD.md
  and `docs/studio/scan.md` were also modified (written mid-review, after the red-team's finding 4). **Answered:** the
  commit stages all 8 (below); `git status` re-checked immediately before the commit.

**Commit plan (ONE commit, explicit files, real index):** `git add js/views.js sw.js BOARD.md docs/studio/scan.md
docs/checkpoints/scan-fix.md docs/studio/sequence.md "docs/Checklist and Roadmap/BUILD_STATE.md"
docs/studio/builder.html` → subject "SCAN-FIX.6 — the camera primer shows once, and never over a live camera",
CACHE_VERSION `praxis-v3.308`. builder.html is regenerated AFTER the last studio-markdown edit (scan.md) so it matches
its source. `stash@{0}` predates this slice and is not touched.

STOP — awaiting "commit and push".

## SCAN-FIX.6 SHIPPED — 2026-10-19 (on Preston's "commit and push")

`ba7b289` SCAN-FIX.6 (praxis-v3.308) — pushed `1e6e026..ba7b289`; HEAD == origin/main ==
ba7b289fedfa9b37fccbff4692098d3349767765; hook silent; exactly the eight planned files. Before the commit, as Preston asked:
`tail -c 20 docs/studio/builder.html` ended `</body>\n</html>`, and that run's summary read
`studio-build: wrote … (HEAD 1e6e026, praxis-v3.308, 2026-10-19 00:01 UTC; … warnings 0)`. Foundations md5 unchanged
(`070679b0…` / `772886c0…`). Netlify deploy 6ad63c38e5b57197be1b37d1: commit_ref ba7b289, state ready, published
2026-10-19T15:50:30Z, deploy_time 12 s, 5 functions (unchanged digests). `stash@{0}` untouched.

## Device check of SCAN-FIX.6 — Preston, iPhone, live praxis-v3.308 (reported 2026-10-25)

| step | result |
|---|---|
| 1 · Open Scan normally — no card, the camera comes straight up | **PASS** |
| 2 · The first-time card again (`#scan/primer`) — no camera dot while it is up; "Turn on camera" starts it | **PASS** |
| 3 · One Lorde scan | **PASS** |

**SCAN-FIX.6 CLOSED. The SCAN-FIX lane (SCAN-FIX.1–6, v3.303–v3.308) is CLOSED** — every slice shipped; .1–.4's one
device failure opened .5, and .5 and .6 passed every device test.

**Handed on, still open:** R23 the primer copy's "nothing is stored" overclaim → L3 (consent / honest copy) · R26
camera starts from an earlier session's late completions (the 850 ms grant timer, a queued zxing load, a late stream) ·
R18 / R25 device-only unknowns (the cause of the original "Not found"; iOS's Permissions API answers) · R12 Google
Books has no timeout · R16 F-d covers stale frames ≤ 1.5 s · R24 returning readers no longer see "Add without the
camera" · R27 the camera flag survives an account delete (ruled) · R28 the decision-window taps · D2 the iOS cover shot
probably captures an empty frame (non-goal) · the native scanner is L7b.
