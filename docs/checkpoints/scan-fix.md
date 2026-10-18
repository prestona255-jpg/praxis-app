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
