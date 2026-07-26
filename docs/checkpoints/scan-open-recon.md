# SCAN ROUND — STAGE-0 RECON (read-only)

**Ground:** HEAD `6e10c41` (Stage-1 brief commit); app source **byte-identical** to
`576c358` — `git diff --stat 576c358 HEAD` = only `docs/studio/scan-round-brief.md`
(+147). CACHE_VERSION `praxis-v3.259` (`sw.js:10`). Model: Opus 4.8, default effort.
Evidence standard: every claim carries file:line / grep-count / hash. Tags:
**[SOURCE-PROVEN]** vs **[DEVICE-OWED]** (only Preston's phone can settle) per L19.

---

## 1 — Ground state · [SOURCE-PROVEN]

- **Router / cleanup idiom:** `renderRoute()` @ `js/views.js:396`; parses
  `location.hash` @ `:446`. Dispatched by `js/app.js` on DOMContentLoaded + every
  `hashchange`. renderRoute IS the **global per-route-change cleanup site**: nav-close
  `:424–427`; Shelf Manage-sheet scroll-lock release + listener purge `:429–444`
  (`document.body.style.overflow=''`, removes `shelfManageEscapeHandler` /
  `shelfHeadScrollHandler`). **This is the SCE-1 stream-teardown mount point.**
- **Nav:** static markup in `index.html:32–61` (`<nav class="app-nav">`); active-link
  toggle in `js/views.js:530–534` (`.app-nav-link` → `.app-nav-link-active`). Nav is
  NOT a render function — it is static HTML re-decorated per route.
- **Lane ownership:** main working tree on `main @ 6e10c41`. `git worktree list` shows
  7 worktrees incl. `praxis-scan-derisk [scan-derisk-lane]` and
  `.claude/worktrees/…[claude/suspicious-cohen-b55561]`. **None is actively editing
  `js/views.js` on `main`** (this session edits no app source). Build round MUST
  re-confirm at its open — worktrees can change (THE FORK RULE).

## 2 — The create-door hook (CD-6) · [SOURCE-PROVEN] — key finding

- **Shared component = the `capdoor` family.** Entry `capOpen(opts)` @
  `js/views.js:23110`; `initCaptureDoor()`/`openCaptureDoor(opts)` @ `:24009`.
  Segmented modes via `capSetMode(mode)` @ `:23057`; sheet class
  `capdoor-sheet … cap-mode-<mode>` @ `:23064–23065`.
- **FIVE built modes** (`index.html`-less; markup @ `js/views.js:23746–23750`):
  `note` · `voice` · `paste` · `photo` · **`scan`**.
- **The Scan mode is ALREADY BUILT as an inert socket.** `js/views.js:23344`:
  `if (capMode === 'scan') { return; } // scan stays SCAN's inert socket — nothing to
  file`. CD-6 shipped the Scan mode's *shell*; SCAN fills it. Confirms SCD-1 exactly
  ("SCAN builds no door … builds the surface the create door's Scan mode opens into").
- **Tap → surface handoff:** all `.capdoor-mode` buttons wired `capSetMode(data-mode)`
  @ `:23873`. Selecting scan today = no-op. Every external `capOpen` caller passes
  `{mode:'note'}` (`:23893, :23895, :23928, :24043`) — nothing opens directly to scan
  yet. SCAN wires the `capMode==='scan'` branch to open the viewfinder.
- **Warm-up transition mount:** the `capMode==='scan'` activation branch (adjacent to
  the `:23344` socket / `capSetMode` scan case) — SCD-1's designed viewfinder fade-in.
- **SCE-1 teardown mounts (two, both idioms EXIST):** (a) `renderRoute` cleanup block
  `js/views.js:424–444` (stop stream on route exit); (b) the capdoor's EXISTING
  `visibilitychange`/`pagehide` handler `js/views.js:24003–24006` (today calls
  `capSaveDraftNow` on `hidden`) — extend it with a camera stop.
- Safe-area: `.cap-create-door`/`.capdoor-foot`/`.capdoor-toast` already use
  `env(safe-area-inset-*)` (`assets/components.css:16334, :16393, :16403, :16625`).
- **[DEVICE-OWED]** real camera warm-up time (getUserMedia→first frame) — phone only.

## 3 — SC12 calibration
Run card issued Stage 2; see `docs/checkpoints/scan-open-calibration.md`.
Harness: `https://praxis-reading.netlify.app/scan-derisk.html`, model `claude-opus-4-8`.

## 4 — Barcode frame acquisition (v3.120) · [SOURCE-PROVEN] — GO/NO-GO answer

**Live `getUserMedia` video, NOT photo-input capture.** `openBarcodeScanner()` @
`js/views.js:6849`:
- `getUserMedia({ video:{ facingMode:'environment' } })` @ `:6974` → `<video
  class="scan-cam-video" playsinline muted>` @ `:6891–6894`.
- Native **BarcodeDetector** (`ean_13/ean_8/upc_a/upc_e`) @ `:6980`, rAF decode loop
  `:6981–6994`; **zxing** fallback when no native detector (iPhone Safari) `:6998–7003`.
- Always-present ISBN type-in fallback `:6916–6936`.
- `stopCamera()` @ `:6859–6870` stops all tracks + resets zxing. **Bound only to
  Cancel (`:6963`), Escape (`:6965`), successful lookup (`:6952`) — NOT to route
  change or `visibilitychange`.** ← the exact SCE-1 gap the brief predicts.
- **NOTE — distinct idiom for whole-shelf:** the Shelf "Scan shelf" is a **file
  input** `<input type=file accept=image/* capture=environment>` @ `js/views.js:4506–
  4512` → `handleShelfScanFile`. So Praxis has TWO capture idioms today: live
  getUserMedia (barcode) + file-input capture (shelf photo).
- **[DEVICE-OWED]** iOS-standalone (installed PWA) live-camera behavior. Test steps in
  the felt card below.

## 5 — Safe-area env() census · [SOURCE-PROVEN] + [DEVICE-OWED]
21 `env(safe-area-inset-*)` occurrences, all in `assets/components.css` (grep count
= 21; e.g. `:27, :5601, :5623, :12473, :16334, :16393, :16403`). Full-bleed camera is
the most inset-exposed surface in the app (top+bottom+left+right). **[DEVICE-OWED]**
the rig resolves `env()=0`; verify in BOTH installed PWA and plain-Safari tab (B-M).

## 6 — Nav census at 390 · [SOURCE-PROVEN]
`.app-nav-list` (`index.html:46–58`) = **7 entries**: Home `#home` (:47) · Shelf
`#books` (:48) · Arcs `#arcs` (:49) · Notebook `#notebook` (:50) · **Capture**
`.cap-nav-entry` (:53, R-CAPTURE's entry, already present) · About `#about` (:54) ·
Account avatar `.app-nav-profile` (:55). Plus wordmark (:33) + ⌘K search well (:34–45).
At 390 all collapse into `.app-nav-hamburger` (:60) — mobile absorbs an 8th (Scan)
slot trivially in the panel. **Badge pattern fits:** nav entries already carry state
attrs (`aria-current` on `.cap-nav-entry`) and nested state spans
(`.app-nav-profile-initial`), so a draft-count badge on the Scan entry follows an
existing pattern. Desktop pill width-fit at 1360 = a build-time measure (not device-
owed), untaken this session.

## 7 — zxing · [SOURCE-PROVEN] — brief-wording nuance
- `loadZxingLibrary(cb)` @ `js/views.js:6823`; `zxingReady()` @ `:6815`.
- **Source = CDN, NOT vendored:** `s.src =
  'https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/umd/index.min.js'` @ `:6830`.
  `git ls-files | grep zxing` = EMPTY (nothing on disk). Version **0.20.0**.
- **Continuous decode available:** `ZXing.BrowserMultiFormatReader` @ `:7011` via
  `decodeFromConstraints({video:{facingMode:{ideal:'environment'}}}, video, cb)` @
  `:7018–7019`, else `decodeFromVideoDevice` @ `:7020–7021`.
- **Bears on SCE-3:** because zxing is CDN-lazy-loaded, first offline use fails unless
  the SW precaches that CDN URL (unverified this session — build must check `sw.js`
  precache list). The brief's "zxing decodes barcodes offline" holds only after the
  script is cached.

## 8 — shelf-vision.js contract · [SOURCE-PROVEN] — key finding
`netlify/functions/shelf-vision.js` (15,482 B, tracked). Contract:
- Per book (`:314, :323`): `{ title, author, spineText, confidence }`,
  confidence ∈ {high,medium,low}; response `{ books:[…], model }`.
- **NO `legibility` field.** Header comment `:11–13`: shelf-vision uses
  `spineText`+`confidence`; **`vision-proxy` uses `clear|partial` "legibility" and no
  spineText.** ← SC6 impact below.
- stop_reason guard `:247–265`: non-`end_turn` → ERROR; `max_tokens` →
  `vision-truncated` (the SC8 TRUNCATED reference).
- Models `:34`: allow-list `{claude-sonnet-4-6, claude-opus-4-8}`, default sonnet;
  `temperature` omitted for opus (`:208–213`).
- **UNWIRED IN THE APP:** `grep shelf-vision js/*.js` = EMPTY. Only the de-risk
  harness (`scan-derisk.html`) calls it. **The live app's "Scan shelf" calls
  `vision-proxy`** (`js/views.js:8020`, returns `{books:[{title,author,legibility}]}`
  per `:8028`). ⇒ Wiring shelf-vision into the app is a SCAN BUILD task, and it
  resolves the legibility-vs-confidence duality: the live path today = `legibility`;
  shelf-vision (SC6's `spineText`) = `confidence`. SC6 "I read: '<spineText>'"
  REQUIRES shelf-vision — so the switch is a prerequisite of SC6.

## 9 — Add/classify pipeline census · [SOURCE-PROVEN]
- **Shelf-scan path:** `handleShelfScanFile` @ `js/views.js:7999` → `downscaleShelfPhoto`
  → `vision-proxy` `:8020` → `scanResponseToSpecs(json)` `:8032` → `{kind:'title',
  title, author, legibility}` queries `:8040` → **`resolveBatch(queries, cb)`** `:8043`
  → **`openBookReview(resolved,'scan')`** `:8048`. **Never auto-writes** (comment `:8031`).
- **Barcode/manual single:** `resolveBook` → `handoffResolvedSingle(result, source)`
  `:6801`. **Bulk:** parse+dedupe → `resolveBatch` → review.
- **The ONE shared write discipline** = every book-write site calls
  `markBookPending(uid,id)` (P0 guard) + `markBooksDirty()` + `saveState()`. Sites
  (grep `markBookPending(`): `:6228, :6640, :7457, :7775, :7811` — 5 sites, all funnel
  the same guard; `resolveBatch`→`openBookReview` is the common confluence for scan/
  bulk. GB backfill + cover fetch live in the resolver (`GOOGLE_BOOKS_PROXY_URL`
  `js/integrations.js:13`; per-resolve metadata backfill `js/views.js:6244, :6281,
  :6650`). Classification: `classifyBooksViaLLM` `:5353` / `classifyBookLocal` `:5450`
  behind the shelf.
- **Adversarial (no 2nd book-write surface):** all adds route through the pending-
  guarded write; no add site bypasses `markBookPending`. Confirmed by the 5-site census.
- **FX-1 add-guard behavior under a 27-book burst · [SOURCE-PROVEN]:** FX-1 is a
  **sync-merge guard, NOT a rate-limiter/debounce.** `pendingBookSync` (`js/state.js:
  985–1047`): per-uid localStorage set (`praxis_pending_books_<uid>` via ls/sv) of
  locally-added ids not yet confirmed; `markBookPending` `:1011`, `isBookPending`
  `:1022`, `clearPendingBookSync` `:1035`. A 27-book burst simply marks 27 ids pending;
  each is independently protected from the REPLACE merge until its
  `saveBooksToFirestore` success clears exactly that payload's ids (`js/state.js:2792–
  2793`). **No queue/debounce, no cap — bursts don't drop; they mark-and-flush.**
- **FX-1c / Finding C status:** see item 11 + the BRIEF-CONFLICT note.

## 10 — Matcher idiom (SCA3 / SC4) · [SOURCE-PROVEN]
- `findShelfBookByIdentity(uid, title, author)` @ `js/views.js:7572` → returns an
  existing shelf book id or null, via normalized `bookIdentityKey(title, author)`
  (`:7573`; empty key `'ta:|'` never folds, `:7577`). Scans the user's deduped
  `userBooks[uid].bookIds`.
- `scanLibraryForCleanup(uid)` `:7591` groups the whole library by the same
  `bookIdentityKey`.
- **Callable for SCA3 tray+library dedupe WITHOUT signature changes** — `(uid,title,
  author)` covers the library arm; the same `bookIdentityKey` can key a client-side
  tray set. Doubles as SC4's "already on your shelf" (Add→Open) signal.

## 11 — Batch-undo mechanics + the flush signal · [SOURCE-PROVEN] — GO/NO-GO answer
- **`deleteBook(uid,id)` @ `js/views.js:7471`** — thorough 7-collection scrub
  (userBooks index, record, arc membership, sub-theory book-evidence, notebook
  bookIds, theme membership, book artifact), then **step 8 `:7541–7543`:
  `clearPendingBookSync(uid,[id])` THEN `markBookDeletePending(uid,id)`.** i.e. delete
  ALREADY clears the pending-add and starts a delete tombstone. Batch/merge-dupe path
  does the same over `dropIds` (`:7771–7775`).
- **The sync-flush signal SCD-2 needs EXISTS** (not NONE): the `pendingBookSync` set
  draining — observable via `isBookPending(uid,id)` / `getPendingBookSync(uid)`
  (`js/state.js:1005–1030`), driven by the `booksDirty → saveBooksToFirestore` success
  → `clearPendingBookSync` chokepoint. `flushPendingBooks()` `js/state.js:1183` is the
  page-hide best-effort flush (adds AND deletes). **It is POLLABLE STATE, not an
  event/callback** — SCD-2's "briefly finishing sync… then armed" must poll the pending
  set (or hook save success), there is no emitted signal to subscribe to.
- **`pendingBookDeletes` (`js/state.js:1119–1175`)** already guards a
  delete-before-sync book from stale-remote resurrection (merge SKIPs the id until the
  remote drops it). So the book delete-before-sync race SCD-2 fears is **already
  covered** for books.

## 12 — Torch · [SOURCE-PROVEN absence] + [DEVICE-OWED]
`grep -rE "ImageCapture|torch|applyConstraints|getCapabilities|fillLightMode" js/
netlify/` = **NONE-FOUND.** No torch code today (confirms the brief's "likely none").
- **[DEVICE-OWED]** Android torch capability (needs `ImageCapture` + track
  `torch` constraint — not present, build-new).
- iOS: no torch/`ImageCapture` API in Safari (platform knowledge, marked as such);
  SC12/SC8 EMPTY-state lighting coaching is the iOS substitute per the brief.

## 13 — Soft-counter + tray-persistence storage · [SOURCE-PROVEN]
- Idiom: `ls(k,d)` / `sv(k,v)` @ `js/state.js:252/262` (the ONLY localStorage
  wrappers). **Non-schema per-uid keys precedent** (grep `praxis_[a-z_]+`):
  `praxis_pending_books_<uid>`, `praxis_yumi_gate_budget`, `praxis_tts_budget`,
  `praxis_yumi_web_budget`, `praxis_yumi_router_budget`.
- **Soft daily-counter type case:** `ls('praxis_yumi_profile_budget', {day:'',
  count:0})` @ `js/state.js:1851` — the exact `{day,count}` shape SC9's soft counter
  needs. Direct precedent; no schema change.
- **Tray persistence (SCE-2):** same dedicated per-uid ls/sv key pattern as
  `pendingBookSync` — a `praxis_scan_tray_<uid>` blob survives a PWA kill; resume-on-
  relaunch = read it on init (the pending-sets already prove this pattern).
- **Offline detection (SCE-3): NONE exists today.** `grep navigator.onLine|'offline'`
  = EMPTY. Net-new hook (`navigator.onLine` + online/offline listeners) — no precedent
  to reuse.

## 14 — Signed-out gate · [SOURCE-PROVEN]
Shared helper **`buildSignedOutPrompt(title, body)`** — e.g. the Shelf uses it @
`js/views.js:4282`. Gate = `getCurrentUser()` returns null (`:545, :878`) → render the
prompt; per-surface ids `shelf-signin-prompt` / `notebook-signin-prompt` /
`book-detail-signin-prompt` (`:72, :79, :96`). A new `#scan` route gates the same way:
`if (!getCurrentUser()) mount buildSignedOutPrompt(...)` (scan = billable authed
context).

## Also — Builder $SURFACES · [SOURCE-PROVEN]
`tools/studio-build:28` `$SURFACES` list does **NOT** include `scan`. `:33`
`ROUNDSTUBS="scan r-shelf r-arc"` — **`scan` is a ROUNDSTUB** (rendered as a stub,
excluded from TOTAL/PCT/heat). **Promoting `scan` from ROUNDSTUBS → $SURFACES is the
SCAN close-out item** (note `import-capture` IS a full surface at `:28`).

---

## BRIEF-CONFLICT (surfaced, not absorbed — FORK-VERBATIM)

**SCD-2's Finding-C premise is inaccurate as applied to the book batch-Undo it
guards.** Brief SCD-2 (`scan-round-brief.md:44`) states: *"Finding C says delete
doesn't clear a pending add — batch Undo is a burst of deletes over just-fired adds,
the highest-probability trigger of that exact race."* The actual Finding C
(`docs/checkpoints/fx1.md:146–151`) reads: *"`deleteArc`/`deleteSubTheory`/
`deleteUserTheme` don't `clearPendingSync` (unlike `deleteBook`'s
`clearPendingBookSync`). Inert for correctness … the pending array grows unbounded."*
So Finding C is (a) scoped to **arcs/subs/themes**, explicitly **NOT `deleteBook`**,
and (b) a **bounded-memory nuisance, not a data-resurrection race.** Batch-Undo of
scanned BOOKS uses `deleteBook`, which already clears the pending-add (`:7542`) AND
tombstones the delete (`:7543`); `pendingBookDeletes` covers the resurrection case.
**The SCD-2 hold may still be wanted defensively, but its stated justification does not
match the code.** **RULED → BRIEF-ERRATA-1 (below).**

---

## BRIEF-ERRATA LEDGER (Preston-ruled 2026-07-25)

The brief file (`docs/studio/scan-round-brief.md`) STAYS AS COMMITTED (`6e10c41`);
corrections live here, in the ledger — not by editing the constitution.

### BRIEF-ERRATA-1 — SCD-2 batch-Undo hold is RETIRED
Resolves the BRIEF-CONFLICT above **against the brief.** Recon reading stands:
Finding C is arc-scoped and inert-for-correctness, NOT the book path.

> `docs/checkpoints/fx1.md:146–151` — *"Finding C — pending-set growth on
> delete-before-sync. `deleteArc`/`deleteSubTheory`/`deleteUserTheme` don't
> `clearPendingSync` (unlike `deleteBook`'s `clearPendingBookSync`). Inert for
> correctness (a deleted id is gone from state, so the clear-loop never revisits it)
> but the pending array grows unbounded for created-then-deleted-before-first-sync
> records."*

`deleteBook` already clears the pending add (`js/views.js:7542`) and tombstones the
delete (`:7543`); `pendingBookDeletes` (`js/state.js:1119`) covers resurrection.
**RULING:** the SCD-2 "hold Undo until adds flush" gate is **dropped.** Batch Undo
**fires immediately** as a loop over `deleteBook` — the canonical scrub.
**BUILD-VERIFICATION RIDER (mandatory):** a **forced-timing race test on
prestonpraxistest** — shelve a batch, hit Undo *instantly, mid-sync*, then reload and
prove **zero resurrection** (books count stable + ids stable). This is a hard gate on
the build's batch-Undo slice, not optional.

### BRIEF-ERRATA-2 — SC6 predicate amended to the shelf endpoint's real vocabulary
Ratified as amended: the shelf-path exception predicate is
**exception ⇔ (Google Books no-match) OR (confidence == low)**. "legibility" was
`vision-proxy` vocabulary (`clear|partial`), never `shelf-vision`'s — `shelf-vision`
emits `confidence` (high/med/low) + `spineText`, no `legibility` field
(`netlify/functions/shelf-vision.js:11–13, :314`). Calibration sweeps the cut across
`{low}` vs `{low, medium}` (see `scan-open-calibration.md`).

### BUILD-FIRST TASK (item 8) — shelf-vision WIRING
The build's **first named task**: switch the app's shelf-scan from `vision-proxy`
(`js/views.js:8020`) to the de-risk `shelf-vision` endpoint. **Client wiring only —
the endpoint is UNTOUCHED** (the "zero endpoint change" non-goal stays intact). This
is the prerequisite that makes SC6's `"I read: '<spineText>'"` correction sheet
possible (only `shelf-vision` returns `spineText`).

### SCE-3 LEDGER NOTE — offline barcode is contingent
zxing is **CDN-lazy-loaded** (`@zxing/library@0.20.0`, `js/views.js:6830`), not
vendored. So "barcode decodes offline" holds ONLY when either (a) native
`BarcodeDetector` is present (Chrome/Android — no script needed), or (b) the zxing
CDN script is already cached. On iPhone Safari offline with an uncached zxing, live
barcode decode is unavailable and must fall through to the ISBN type-in. The SCE-3
offline card + the `sw.js` zxing-precache decision are build-round items.

---

## Consolidated DEVICE-OWED felt card (Preston's phone)

1. **iOS live-camera in the installed PWA (item 4).** Add Praxis to Home Screen
   (standalone). Open the barcode scanner. Does the live viewfinder appear and decode?
   Repeat in a plain Safari tab. Report: viewfinder shows / decodes / permission
   prompt behavior, in BOTH contexts.
2. **Camera warm-up time (item 2).** From tapping Scan mode to first live frame —
   perceived delay? (informs the SCD-1 warm-up transition length).
3. **Safe-area on full-bleed (item 5).** Whatever full-bleed camera mock you view:
   does content clear the notch/home-indicator? Installed PWA AND Safari (rig can't
   see this — env()=0 there).
4. **Torch (item 12).** Android only: is a flashlight/torch control expected in your
   scanning conditions? iOS has none — confirm EMPTY-state lighting coaching is the
   acceptable substitute.
5. **SC12 shelf photos (item 3).** The run card — 3–5 fresh shelf frames through
   `scan-derisk.html` on `opus-4-8`.

## Residuals / not-yet-measured (not device-owed)
- Desktop nav-pill width fit for an 8th (Scan) entry at 1360 (build-time measure).
- Whether `sw.js` precaches the zxing CDN URL (SCE-3 offline barcode) — build must check.
