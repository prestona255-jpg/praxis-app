# SCAN ROUND — BUILD (Opus 4.8, default effort)

Model pin confirmed: Claude Opus 4.8, default effort. Self-running per protocol.
Ground: HEAD f7e925c == origin/main == local (verified). CACHE_VERSION praxis-v3.259 (sw.js:10).

---

## STAGE 0 — PREFLIGHT (report)

### 0a — HOOK EXEMPT-LIST FIX — DONE (committed `63267ff`, local, infra)
- `hooks/pre-commit` check #3 (served-source needs sw.js) false-positived on root-level
  standalone HTML. Added an awk filter: drop root-level `*.html` from the served set
  UNLESS it is `index.html` (the served app shell — APP_SHELL lists only `/index.html`
  among root HTML). Boundary proven against `sw.js` APP_SHELL.
- Fire-tested 15 scenarios (scratch replica of check #3): root mockups (scan-surface/
  scan-mockup/books-mockup/build-status) → PASS(exempt); index.html + js/views.js +
  assets/components.css alone → BLOCK(gated); mixed mockup+source → BLOCK (source still
  caught); with sw.js → PASS; docs/tools/design → PASS. ALL 15 OK.
- Committed alone (config/infra, no app source, no sw.js). No more --no-verify this round.

### 0b — ANCHOR RE-VERIFICATION (re-grepped; NONE gone) — [SOURCE-PROVEN]
| anchor | recon | actual | note |
|---|---|---|---|
| renderRoute() | ~396 | `js/views.js:396` | cleanup block `:436–443` (nav-close + Manage-sheet scroll-lock/handler purge) = SCE-1 teardown mount |
| route dispatch | — | `:614–824` if/return chain; notebook fallthrough `:816–824` | #scan block slots before the notebook fallthrough; add 'scan' to umberGroundDark `:480` |
| capSetMode | ~23057 | `:23057` | mode click wiring `:23873` (`capSetMode(data-mode)`) |
| capOpen / openCaptureDoor | 23110 / 24009 | `:23110` / `:24009` | door entry |
| capdoor scan socket | ~23344 | `:23344` `if (capMode === 'scan') { return; }` in capCommit | S5 CD-6 fill: scan chip → close door + route #scan |
| capdoor mode chips | ~23746–50 | `:23746–23750` | scan chip `:23750` (`data-mode="scan"`) |
| capdoor visibilitychange/pagehide | 24003–06 | `:24003` / `:24006` | existing draft-flush handler (SCE-1 twin idiom exists) |
| openBarcodeScanner / stopCamera | 6849 / 6859 | `:6849` / `:6859` (nested) | S5 retirement candidate; grep callers first |
| handleShelfScanFile / vision-proxy | 7999 / 8020 | `:7999` / `:8020` | legacy shelf path; S5 retire, re-point Manage-sheet |
| scanResponseToSpecs / downscaleShelfPhoto | 6771 / 6737 | `:6771` / `:6737` | vision-proxy normalizer (legacy) |
| resolveBatch → openBookReview | 8043 / 7212 | `:8043` (call) / `openBookReview:7212` | shared add confluence |
| findShelfBookByIdentity / bookIdentityKey | 7572 / 7565 | `:7572` / `:7565` | SCA3 dedupe + SC4 "already-owned" (no sig change) |
| deleteBook | 7471 | `:7471` | batch-Undo scrub (ERRATA-1: already clears pending-add `:7542` + tombstones `:7543`) |
| Manage-sheet entries | ~4506–19 | scanBtn "Scan shelf" `:4504`, barcodeBtn "Scan barcode" `:4519` | S5 re-point to #scan |
| nav markup | index.html:46–58 | `:46–59` (7 entries + wordmark + ⌘K well) | add SCAN entry; 390 collapses to hamburger `:60` |
| pendingBookSync / pendingBookDeletes | state.js | `markBookPending:1011`, `clearPendingBookSync:1035`, `pendingBookDeletes:1119`, `flushPendingBooks:1183` | delete-before-sync resurrection already covered for books |
| yumi budget ls-key precedent | state.js:1851 | `_yumiProfileBudgetSpend:1850`, `{day,count}` shape, ls/sv | soft daily-counter type case for SC9 shelf-shot cap |
| Builder $SURFACES roundstub | studio-build:33 | ROUNDSTUBS="scan r-shelf r-arc" (`:33`); SURFACES `:29` | S6: move scan → SURFACES, regen once |
| ls / sv wrappers | state.js:252/262 | `:252` / `:262` | only localStorage path |

Verdict: **all anchors present; no HALT.** Line drift from recon is ≤ a few lines everywhere.

### 0c — CACHE / SW POSTURE
- CACHE_VERSION = `praxis-v3.259` (`sw.js:10`). APP_SHELL (`sw.js:12–41`) is an explicit
  hardcoded list; it precaches `/index.html`, `/js/views.js`, `/js/state.js`,
  `/assets/components.css`, `/assets/theme.css` — **every file this build edits IS
  precached**, so the SW serves stale unless bumped.
- **Planned bump target: `praxis-v3.260`** (increment by exactly one, once, at ship).
- zxing is **NOT** in APP_SHELL (CDN-lazy-loaded). Per non-goals ("no sw rewrites beyond
  the version bump"), it stays CDN — offline barcode is contingent (native BarcodeDetector
  works offline; iOS-Safari uncached-zxing offline → ISBN type-in). SCE-3 offline CARD
  handles the offline-open case. No new precached assets.
- scan-surface.html mockup = untouched porting reference (non-goal: no mockup edits).

### 0c-appendix — S1 pipeline shape decided (non-churn)
S1 builds the shelf-vision pipeline as **net-new self-contained functions** the S4 #scan
Shelf mode consumes; the legacy `handleShelfScanFile`/vision-proxy path is left intact until
S5 retires it (grep-proven zero callers first). This avoids rewiring `handleShelfScanFile`
in S1 only to delete it in S5. "Switch the shelf-scan pipeline to shelf-vision" is honored:
the surface's shelf-scan runs through shelf-vision; vision-proxy shelf path retires in S5.

**CACHE_VERSION bump cadence:** per-code-slice +1 (ARC STANDARD precedent v3.246→v3.251,
hook-clean, no --no-verify). S1→v3.260. Final shipped value reported at S6 for Preston's push.

---

## S1 — WIRING (shelf-vision pipeline) — BUILT + VERIFIED (local, v3.260)

Net-new self-contained functions in `js/views.js` (after the legacy shelf helpers, ~:8103):
`scanShelfVision` (transport, SC8 four-state), `scanAuthorIsNoisy`, `scanQueryForBook`,
`scanNormTitle`, `scanTitleCorroborates`, `scanGbNoMatch`, `scanIsException`, `scanClassify`.

- **Endpoint UNTOUCHED** (`git status netlify/` clean; non-goal intact). Client requests
  `model:'claude-opus-4-8'` (SC9 — never silent-degrade to sonnet).
- **Exception predicate (ERRATA-2):** `(GB no-match) OR (confidence==='low')`, cut={low}.
- **GB arm STRENGTHENED (calibration build-note #1):** `scanGbNoMatch` compares top +
  alternates titles to the detected title via the normalized `bookIdentityKey` idiom, NOT
  `totalItems>0`. `scanAuthorIsNoisy` (build-note #2) relaxes editor/PhD/comma-list/empty
  authors to a title-only query (removes the Sylvia-Wynter false no-match).
- **Consumed by S4** (#scan Shelf mode); legacy `handleShelfScanFile`/vision-proxy left intact
  until S5 retires it (grep-proven zero callers first) — non-churn.

### BRIEF-CONFLICT #1 (surfaced, not absorbed — FORK-VERBATIM)
The shelf-vision endpoint returns **502 `{error:'vision-truncated'}` with NO partial books**
on `max_tokens` (shelf-vision.js:254–266). So the mockup/SC8 TRUNCATED "keep these N for now"
partial tray is **not achievable** against the real endpoint (endpoint = non-goal, cannot
change). RESOLUTION (honest): TRUNCATED ships as its OWN felt-distinct state (Law 5 satisfied —
four distinct states) with copy "read part of this shelf and stopped" + primary "reshoot the
rest / try one shelf at a time", but **no impossible keep-partial tray**. Flagged for Preston.

### S1 verification
| check | result |
|---|---|
| parse-check views.js (cscript) | **PARSE OK** |
| ES3 forbidden tokens in added lines | **0** (one comment reworded off `<=>`) |
| pure-classifier unit test (25 assertions, SC12 named specimens) | **25/25 PASS**, exit 0 |
| fail-ability (L3): remove the `{low}` arm | **7 assertions FAIL** — test IS fail-able |
| netlify/ dirty | **0 files** (endpoint untouched) |

Unit test (`scratchpad/s1-classify-test.js`, not committed) covers author-noise relaxation
(Sylvia false-flag removed), corroboration (exact/subtitle/prefix vs unrelated), all 5 SC12
named specimens' verdicts, the 3/4 split with carried spineText+cover, and a 36-book
distribution → 33 confident / 3 exceptions (GB arm contributes 0, matching {low}=9.3%).

---

## S2 — THE SURFACE (#scan route + nav + permission family) — BUILT + VERIFIED (local, v3.261)

New: `renderScan` + the scan module in `js/views.js` (~:8250); the scan CSS section in
`assets/components.css` (scoped `.scan-surface`, `scan-`-prefixed, real tokens); the scan
camera-chrome token family in `assets/theme.css` (`--scan-cam-bg/-glass/-glass-2/-on-dark/-on-dark-2`);
the `#scan` route block + active-link + `umberGroundDark` + renderRoute-cleanup teardown in
`renderRoute`; the SCAN nav entry in `index.html`.

- **Shell** ported from the mockup MINUS the entry screen + dev-strip + mock banner (the real
  create door + nav ARE the app's entry). One fixed full-viewport layer (`position:fixed`,
  `z-index:9000`) injected into `#app`, covering the nav.
- **Signed-out hard gate** built here (route front-gate; `buildSignedOutPrompt`) — S5 verifies.
- **SCE-1 route-exit teardown** wired in the renderRoute cleanup block (`scanStopStream()` on
  every route change; a cheap no-op off #scan). visibilitychange re-warm + soft counter = S5.
- **Torch hidden by default** (`is-hidden`); S3's track-probe reveals it only where supported
  (Android); iOS/desktop stay absent, per the brief's torch asymmetry.
- Forward stubs for S3 (decode/verdict/add-doors) and S4 (shutter/review/walker/shelve) so no
  control errors; those slices fill the bodies.

### S2 verification (rig: localhost:8760, seed uid d0tester, DOM/geometry — pane screenshots are dead per rig README)
| check | result |
|---|---|
| parse-check views.js | **PARSE OK** |
| ES3 forbidden tokens (added views.js+index.html) | **0** (three "first-class" comments reworded off the `class ` regex) |
| surface mounts | `position:fixed`, `z-index:9000`, view screen active |
| SCE-3 offline: `onLine=false` → offline card BEFORE primer | **PASS** (primer suppressed; ISBN add-door present) |
| SC7 primer BEFORE OS ask; allow hittable (L19 elementFromPoint) | **PASS** (primerAllowHittable) |
| SC7(b) denied = working add door (ISBN + search + shelf drop-zone) | **PASS** |
| grantAndWarm → getUserMedia fail (no cam) → denied fallback; warm veil off | **PASS** |
| mode seg Book↔Shelf: title + shutter/indicator swap | **PASS** (Shelf→shutter, Book→auto indicator) |
| torch hidden-by-default + tooltip toggle | **PASS** |
| back (`‹`) → #books + camera teardown (`scanStream` nulled on leave) | **PASS** (SCE-1 route-exit half) |
| nav Scan @ 1360: 8 entries, `navScrollW==navClientW` (1114), no doc overflow | **PASS** (8th entry fits Preston's viewport) |
| nav @ 390: list `display:none` → hamburger; Scan reachable in panel; surface mounts, no doc overflow | **PASS** |
| reduced-motion still-state block (scan) present | **1** |
| console errors | **0** |

**390 width math:** at <760 the desktop nav list is `display:none` (hamburger takes over), so the
8th (Scan) entry adds ZERO horizontal cost at 390 — it lives in the vertical panel. At 1360 the
pill holds all 8 at 1114px total (< 1360), no overflow. Both verified live.

---

## S3 — BOOK MODE (decode → verdict → guarded Add) — BUILT + VERIFIED (local, v3.262)

Replaces the S2 decode/verdict stubs with real behavior; adds the shared guarded add path.

- **Continuous free decode** on the EXISTING scan-cam-video stream: native `BarcodeDetector`
  (ean_13/8, upc_a/e; 300ms poll, paused while a verdict/overlay is up) with a lazy `zxing`
  fallback for iOS Safari (mirrors `openBarcodeScanner`'s API usage). Free + local → auto-fire
  allowed (Law 6). `scanStopBookDecode` resets the zxing reader; `scanStopStream` also stops any
  zxing-owned video stream (SCE-1 belt-and-suspenders).
- **Lock-on snap → resolveBook({kind:'isbn'}) → verdict card** over the warm camera. Cover
  (media into a pre-sized slot), title, author. **SC4 context — ONE local signal, zero LLM:**
  already-owned (`findShelfBookByIdentity`) → "On your shelf" + Add→**Open** (navigates to the
  book); else author-match count → "Second/Third … <lastname> on your shelf"; else the silent
  line. (Ordinal off-by-one caught + fixed on the rig: 1 existing → the new one is the 2nd →
  "Second".)
- **One-tap Add via the shared guarded write** (`scanCommitBook`): the 5-site census idiom —
  create → `ensureBookFields` (schema/classification chokepoint) → `ensureUser` → push →
  `markBookPending` (P0) → `markBooksDirty` → `saveState` → background `fetchAndApplyCover`. NOT
  a new write mechanism (adversarial gate held). Rapid-scan resumes after Add.
- **SC7(b) denied/offline ISBN door** wired real (`resolveBook` → `scanCommitBook`), search
  hands off to the Shelf's title/author add. (Removed a duplicate `scanWireAddDoors` stub that
  was shadowing the real one — caught on the rig when the door didn't fire.)

**SC3 note (mockup-vs-brief):** the mockup's Book mode is barcode-auto-only; the brief's Book-mode
cover-shot ("Photo rides shelf-vision as a one-book shelf") rides S4's paid-vision capture — built
there, not dropped. Surfaced for Preston.

### S3 verification (rig :8760, DOM/geometry)
| check | result |
|---|---|
| parse-check views.js | **PARSE OK** |
| ES3 forbidden tokens (added) | **0** |
| duplicate scan fn defs | **0** (scanWireAddDoors de-duped; all others single) |
| `scanCommitBook`: +1 book, `markBookPending` true, schema (`tradition`) stamped | **PASS** |
| verdict render: title/author/cover; author-match "**Second Freire on your shelf**" | **PASS** |
| owned verdict: "On your shelf" + Add label "**Open**" → navigates `#book/<id>` | **PASS** |
| silent verdict (unknown author, no shelf match): silent line shown, context hidden | **PASS** |
| Add (new) → count +1, verdict hides, decode resumes | **PASS** |
| denied ISBN door → resolve → `scanCommitBook` → "Added … · on your shelf", input cleared | **PASS** |
| decode start/stop safe when invoked; native BarcodeDetector absent in pane → zxing path | **PASS** (no throw) |
| console errors | **0** |

DEVICE-OWED: live barcode read (a real code from a real shelf) — Preston's phone (getUserMedia
+ BarcodeDetector/zxing on device; the rig has no camera).

---

## S4 — SHELF MODE + REVIEW + WALKER + SHELVE/UNDO — BUILT + VERIFIED (local, v3.263)

Replaces the four S4 stubs; the largest slice. All wired through the S1 pipeline + the S3
`scanCommitBook` shared write.

- **Shutter → freeze → shimmer → shelf-vision** (`scanRunShelfVision`, SC10 queue depth 1 via
  `scanShotBusy`). `scanCaptureBase64` scales the frame to ≤1600px jpeg. SC11 signature 2.
- **Progressive tray fill** (`scanResolveAndFill`): sequential `resolveBook` (queue-1) → `scanIsException`
  classify → drop as each lands. **SCA3 dedupe**: within-scan duplicate (same `bookIdentityKey`) →
  absorb + teal tick; library match → SOFT `data-owned` signal but still counts + shelves (duplicates
  are legal — Preston owns real copies). Count line at cut={low}.
- **Mirror-shelf review** (`scanRenderReview`): draft-case carved cavity, uniform 2:3 covers, scanned
  order; upright confident vs leaning gray-spine exceptions (Law 1 — the lean carries it).
- **Exception walker** (`scanOpenWalker`/`scanResolveStep`): evidence line **`I read: '<raw spineText>'`**
  (needs shelf-vision), GB candidates (resolver alternates), search (hands to Shelf), Not-a-book / Skip /
  Skip-all, auto-advance. **picked → promotes to confident (shelves); notbook → drops; skip → persists as
  draft.** Rebuilds the review on close.
- **Shelve N** (`scanShelve`): commits via `scanCommitBook` (shared guarded write) → SC11 signature 3
  flight (representative dozen) → receipt **"Shelved N · Undo"**. **IMMEDIATE batch Undo** (`scanUndoShelve`,
  ERRATA-1): `deleteBook` loop over createdIds — NO sync-hold. Exceptions persist.
- **Four failure states** from the endpoint stop_reason guard: CALL-FAILED / EMPTY / TRUNCATED / REFUSED
  → distinct overlays (TRUNCATED honestly has no keep-partial tray — BRIEF-CONFLICT #1).
- **SCE-2 draft persistence** (`scanSaveDraft`/`scanLoadDraft`, `praxis_scan_draft_<uid>` ls) + **quiet nav
  badge** (unreviewed-exception count, refreshed on every route in renderRoute) + **primer resume** ("Review
  N from your last scan").
- **SC3 cover-shot** (`scanFireCoverShot`): Book mode's second sensor — a frame → shelf-vision single book →
  verdict (paid; the shutter is the budget). **SC7(c) drop-zone** (`scanShelfFromFile`): a photo →
  `downscaleShelfPhoto` → the same tray/review flow (desktop / no-camera).

### S4 verification (rig :8760, stubbed vision — no paid calls)
| check | result |
|---|---|
| parse-check views.js; ES3 0; no real dup defs | **PASS** (scanShelve/scanShelveFlight distinct) |
| tray fill: 7 events → **6 covers**, **1 dedupe tick**, "6 found · 4 confident · 2 need a look" | **PASS** |
| classification split at cut={low}: 4 confident / 2 exceptions | **PASS** |
| review: 4 upright confident, 2 leaning exceptions; count + shelve/walk N | **PASS** |
| walker: evidence `'SECOND CLASS'`, 2 candidates, progress "1 of 2" | **PASS** |
| walker picked → confident +1 (promoted); notbook → dropped; auto-advance; close→review refresh | **PASS** |
| Shelve → shared write commits N; flight; receipt "Shelved N" | **PASS** |
| **ERRATA-1 immediate Undo (controlled): 0→shelve 3→Undo→0; all ids tombstoned (pendingBookDeletes); pending-add cleared; records gone** | **PASS — race-safe** |
| four failure overlays (failed/refused/truncated/empty) | **PASS** |
| drop-zone → downscale → shelf-vision fires | **PASS** |
| SC10 queue depth 1: 2nd shot ignored while busy | **PASS** |
| draft persisted + nav badge "2" (unreviewed exceptions) | **PASS** |
| console errors | **0** |

DEVICE-OWED / S6: the FULL forced-timing race (real reload against real Firestore on
prestonpraxistest) — the local bookkeeping is proven; S6 runs it on the live account.

---

## S5 — LIFECYCLE + COST + DOORS — BUILT + VERIFIED (local, v3.264)

- **SCE-1 hardware half** (`scanInitLifecycle`, bound once): stop the stream on
  `visibilitychange` hidden (when on #scan), re-warm on return; `pagehide` stops it too.
  The router owns the route-exit teardown (S2). THE CAMERA FORGETS at the hardware layer.
- **SC9 cost posture** (`scanShelfBudgetSpend`, cap **30/day**, ls `praxis_scan_shelf_budget`
  `{day,count}` — the yumi-budget precedent, no schema change). PAID reads only (shelf shot +
  cover shot); barcode stays free + uncounted. At cap → honest warm refusal card (Book mode
  stays). **NEVER silent-degrade** — the model request is always claude-opus-4-8 (S1).
  CALL-FAILED refunds the shot ("no shot counted against you").
- **CD-6 socket fill**: `capSetMode('scan')` closes the create door and routes to `#scan` —
  **context-free ALWAYS** (CD-3 pre-association does NOT apply to scanning). The `capCommit`
  inert socket stays as a defensive backstop.
- **Signed-out gate** (built S2): `renderScan` → `buildSignedOutPrompt` when signed out. Verified.
- **LEGACY RETIREMENT**: Manage-sheet "Scan shelf" → `#scan/shelf`, "Scan barcode" → `#scan`
  (mode-preselected). **Deleted** (grep-proven 0 live callers): `openBarcodeScanner` (the modal),
  `handleShelfScanFile` (the vision-proxy file-input shelf path), `scanResponseToSpecs`, the
  `showScanStatus/clearScanStatus/_scanStatusTimer` plumbing, and the `#shelf-scan-status`
  element. **KEPT** `downscaleShelfPhoto` (reused by the S4 drop-zone) and `handoffResolvedSingle`
  (shared, still referenced by the pre-existing-orphaned `openManualLookup` — out of scope).

### VISION-PROXY CALLER REPORT (non-goal: endpoint file untouched)
After retirement, **`js/` has ZERO `/.netlify/functions/vision-proxy` fetch callers** (grep-proven).
The only remaining refs are comments. `netlify/functions/vision-proxy.js` **stays** (unchanged);
it is now app-unused but preserved per the non-goal (a future feature may use it).

### Two mode-persistence bugs caught + fixed on the rig
`scanEnter` hard-coded `scanSetMode('book')` (ignored the `#scan/shelf` preselect), and the
module-level `scanMode` leaked from a prior visit into a fresh plain `#scan`. Fixed: `scanEnter`
respects `scanMode`; `renderScan` resets `scanMode = (preMode==='shelf') ? 'shelf' : 'book'` on
every entry.

### S5 verification (rig :8760)
| check | result |
|---|---|
| parse OK; ES3 0 | **PASS** |
| cost cap: 30 spends OK, 31st refused; refund restores a slot; cap=30 | **PASS** |
| cost gate in flow → refusal card (`scan-ov-cap`) shown | **PASS** |
| CD-6 socket: create-door Scan chip → door closes + routes `#scan` + surface mounts | **PASS** |
| Manage-sheet "Scan shelf" → `#scan/shelf` (Shelf mode: title Shelf, shutter); "Scan barcode" → `#scan` (Book) | **PASS** |
| `#scan` defaults Book (indicator + SC3 cover shutter); `#scan/shelf` Shelf; no mode leak across visits | **PASS** |
| signed-out: no surface, `buildSignedOutPrompt` shown | **PASS** |
| visibilitychange lifecycle bound once (`scanLifecycleBound`) | **PASS** |
| retired symbols: 0 live callers (openBarcodeScanner/handleShelfScanFile/scanResponseToSpecs/showScanStatus/clearScanStatus); vision-proxy 0 fetch callers | **PASS** (grep) |
| Shelf still renders; console errors | **0** |

DEVICE-OWED / S6 felt card: the real hardware-indicator death on app-switch (SCE-1) — Preston's phone.

---

## S6 — VERIFY + CLOSE

### Skew states (L15/G5) — rig, stubbed vision
| skew | result |
|---|---|
| 40-book payload (36 high + 4 low) | found 40 · 36 confident · 4 exceptions · 40 tray covers · review 36 upright + 4 leaning · **no doc h-overflow** |
| all-exceptions batch (8 low) | 0 confident · 8 exceptions · Shelve N=**0** · Review N=**8** · walk shown |

### Interactive-control sweep (L18/L19) — every control fired
All 18 primary controls present + wired (back · Book/Shelf seg · torch · primer allow/manual ·
denied retry/isbn-add/search · offline retry/isbn-add · verdict Add/dismiss · tray-review · rv
back/walk/shelve · receipt-undo); 5 fail-dismiss buttons (failed/empty/truncated/refused/cap);
1 drop-zone. RM still-state block present; 8 scan rules carry env(safe-area) insets; surface
z-index 9000 (over nav). Console errors across the whole sweep: **0**. The felt-critical primer
allow button was L19 hit-tested (`elementFromPoint` = the button, on top).

### FORCED-TIMING RACE (ERRATA-1 hard gate)
- **LOCAL bookkeeping PROVEN (rig, d0tester):** 0 -> shelve 3 -> **Undo instantly** -> back to
  baseline 0; all 3 ids tombstoned in `pendingBookDeletes` (merge SKIPs them -> no resurrection),
  pending-add cleared by `deleteBook`, records gone. The delete-before-first-sync resurrection is
  covered for books BY CONSTRUCTION (`deleteBook` :7542 clears pending-add + :7543 tombstones).
- **DEVICE-OWED (real Firestore):** the rig has NO Firestore (localStorage-only) + is signed out
  of a real account -- **persistence/resurrection against real Firestore is UNVERIFIED here.**
  Preston's live-smoke (below) runs it on `prestonpraxistest`.

### ACCEPTANCE CARD — brief laws (PASS / DEFERRED / owner)
| # | Brief law | Verdict | Note |
|---|---|---|---|
| 1 | **Two trust postures, one camera** | **PASS** | Book verdict card (confident) vs mirror-shelf upright/leaning gray spine; the lean + grayscale carries it, no apology copy |
| 2 | **The camera forgets** (incl. hardware) | **PASS (structure)** / **DEFERRED (hardware felt)** | teardown on renderRoute-cleanup + visibilitychange + pagehide + zxing reset; the indicator-light proof = felt card |
| 3 | **The quick card is free** | **PASS** | `scanComputeContext` is local (owned / author-count); silent otherwise; zero model call on the card |
| 4 | **Exceptions never auto-commit** | **PASS** | Shelve commits only `scanResult.confident`; exceptions persist (SCE-2 draft + nav badge) |
| 5 | **Failure wears its own clothes** (4 states) | **PASS** | CALL-FAILED / EMPTY / TRUNCATED / REFUSED each its own overlay; TRUNCATED honest (no impossible keep-partial — BRIEF-CONFLICT #1) |
| 6 | **The shutter is the budget** | **PASS** | Shelf = deliberate shutter; Book barcode = free auto; SC10 queue depth 1; cost cap 30/day; always opus (never degrade) |
| 7 | **Raised-hand Yumi** | **PASS** | no Yumi surface on scan; context is a quiet mono line; no enrichment built (correct) |
| 8 | **Canon-native + a11y** | **PASS (structure)** / **DEFERRED (AT pass)** | parse OK; tokens wired real; no underlined captions; RM stills; `aria-live` announcer; walker keyboard-operable; real screen-reader pass = device |

### 8-ROW COMPLETENESS INVENTORY
| row | state |
|---|---|
| **Ground** | light app -> camera-dark viewfinder (HOUR warm-up/overlays) -> light draft-case review. Full-amber (visitor room) correctly absent. |
| **States** | 20+ reachable + asserted incl. skew (40-book + all-exceptions). |
| **Controls** | all fired live (sweep above); own-state asserted; 0 dead controls. |
| **Widths** | **390 built + verified** (acceptance surface, L4); desktop honest-secondary built (ISBN/search + drop-zone; nav fits 1360 no overflow). XL-tier bespoke desktop composition = DEFERRED (flagged, not faked). |
| **Motion** | 3 mandated signatures (lock-on snap / shimmer read / shelve flight) each with a reduced-motion still; + warm-up fade. |
| **Marks** | Raised-hand Yumi -> no Yumi glyph. Covers = typeset cloth into pre-sized 2:3 slots (real coverUrl draws over; 404 -> fallback, never a hole). Reticle brackets + shelf glyph + teal tick. |
| **Text-registers** | serif (titles/covers) / body (actions) / mono (eyebrows/meta/counts/evidence). Evidence line in mono; NO underlined-link captions (control canon). |
| **Seams** | Entry = the CD-6 create-door Scan socket (wired). Review = draft-case of the shipped carved cavity (SCD-3). Add = the shared guarded write. Undo immediate (ERRATA-1). No endpoint / schema / sw-beyond-bump touched. |

### ELEVATION PASS (L14)
Rig-verified at the acceptance surface + skew data; the camera-dependent felt (warm-up length,
first-frame, torch, indicator death, notch clearance) is DEVICE-OWED and cannot be elevated on the
rig (no camera). Craft/Quiet on the live look is Preston's felt pass. No in-ruled-space regression
found in the rig sweep.

### FINAL CACHE_VERSION
Per-slice +1 from live v3.259 -> S1 v3.260 / S2 v3.261 / S3 v3.262 / S4 v3.263 / S5 v3.264; the S6
docs-close rides a comment-only views.js touch -> **v3.265** at the close commit (the shipped value).

### RESIDUALS (carried, named — not folded)
- **R1 — real-Firestore forced-timing race**: Preston's live-smoke (below); local bookkeeping proven.
- **R2 — dead legacy CSS**: `.barcode-scanner-*` + `.shelf-scan-status` / `.shelf-scan-input` rules now
  orphaned (their JS retired) -> S-B sweep, not this round.
- **R3 — stale comment**: `downscaleShelfPhoto`'s doc still describes the retired vision-proxy flow (the
  fn is generic + reused by the drop-zone) -> cosmetic, S-B.
- **R4 — XL-tier bespoke desktop scan composition**: deferred (acceptance surface is 390 per L4; the
  honest-secondary is built). Named, not built.

## DEVICE-OWED FELT CARD (Preston's phone — the round CLOSES on this)
Full walk in the **installed PWA** AND **Safari**:
1. Create-door **Scan chip** -> the surface (and the nav **Scan** entry).
2. **Book mode** on a real barcode from your shelf -> lock-on snap -> verdict -> Add (rapid-scan continues).
3. **Shelf mode** on ONE real row (one real opus call — budget-sanctioned) -> shimmer -> tray -> count line.
4. The **walker** on whatever it flags — the "I read: '...'" evidence line, candidates.
5. **Shelve -> Undo -> re-Shelve** — and the forced-timing feel (Undo instantly mid-sync; reload; nothing resurrects).
6. **App-switch -> does the camera indicator DIE?** (SCE-1 hardware proof.)
7. **Notch / home-indicator clearance** (env() — the rig resolves env()=0, so device-only).
8. Warm-up **feel**; torch (Android only — is EMPTY-state lighting coaching an OK iOS substitute?); reduced-motion spot check.

**LIVE-SMOKE STEPS (R1, on prestonpraxistest — the auth-gated forced-timing race):** sign in on
prestonpraxistest -> #scan Shelf -> shoot one row -> Shelve N -> hit **Undo the instant** the receipt
appears -> **hard-reload** -> confirm the shelf book count + ids are unchanged (the N shelved books are
GONE and NONE resurrected). Repeat once with a same-second app-background between Undo and reload.

---

## S6 — GATE VERDICTS (both Sonnet-pinned, run before the push HALT)

### Byte deltas (LF-normalized, pre-round f7e925c → close; the reviewer noted these were missing)
| file | before | after | delta |
|---|---:|---:|---:|
| js/views.js | 1,116,985 | 1,176,779 | **+59,794** (full surface minus the −260-line retirement) |
| assets/components.css | 843,546 | 869,026 | **+25,480** (scan CSS section) |
| assets/theme.css | 44,866 | 46,047 | **+1,181** (scan token families) |
| index.html | 8,684 | 9,119 | **+435** (nav entry) |
| hooks/pre-commit | 4,899 | 5,445 | +546 (0a exemption) |
| sw.js | 6,041 | 6,041 | +0 (version digit count unchanged) |

### fix-red-team (Sonnet) — SOUND, 1 NOTE fixed
Independently re-derived every claim against source. Confirmed TRUE: scanCommitBook = the shared
5-site guarded-write discipline (exactly one new write site, no shadow path); scanUndoShelve
race-safety (deleteBook clears pending-add + tombstones; mergeRemoteBookDoc skips pendingBookDeletes —
the reused Stage-6 guard); legacy retirement grep-clean repo-wide; cost always-opus + refund can't be
gamed; SCE-1 teardown complete + bound once; ES3 0; parse OK (harness self-validates); foundations
MD5s match; scope clean (state/integrations/yumi/netlify untouched); CACHE_VERSION +1/slice.
- **Finding 1 (staging):** the uncommitted views.js comment edit = this S6 close's own deliberate change
  (rides this commit) — resolved by committing S6 explicitly.
- **Finding 2 (NOTE): FIXED** — `scanUndoShelve` announced "N books removed" even when signed-out
  (loop skipped). Now counts real `deleteBook` successes → "N books removed" or honest "Nothing to undo".
  Re-verified on the rig (signed-in Undo still 2→0; the honest branch present). parse OK, console clean.

### praxis-reviewer (Sonnet) — HOLD → Finding A FIXED · Finding B is the mandatory human live-smoke
Independently graded the 5 slices: ES3, foundations (14,966 B lumen-amber, untouched), EOL (i/lf, 0 CR),
CACHE_VERSION +1/slice, staging, sanctioned accessors, Yumi covenant, honest empty states, and the core
SC6/GB-arm/walker/Undo logic — **all PASS on trace**. Endpoint files byte-identical (non-goal honored).
- **Finding A (CSS tokens-only) — FIXED:** 5 `rgba(6,4,2,α)` literals (near-black, matched no token) →
  the sanctioned `rgba(0,0,0,α)` shadow idiom (the reviewer's own blessed 36-occurrence pattern). Scan
  section now: 0 hex; every rgba is token-equal (`--danger`/`--gold-hi`/`--ink`/`--scan-on-dark` base) or
  the `rgba(0,0,0)` shadow idiom. Compliance fix, NO owner-visible felt delta (near-black over a dark
  camera). Re-verified live: tint gradient + over-cam overlay paint `rgba(0,0,0,α)`; surface mounts; console clean.
- **Finding B (BRIEF-ERRATA-1 forced-timing race vs REAL Firestore) — OUTSTANDING, by design:** the rig
  has NO Firestore (localStorage-only) + no connected `prestonpraxistest` session, so this HARD GATE
  cannot run here. It is the DATA-LOSS-TIER human gate (FIX-PROTOCOL §5 path C — interim: red-team clean +
  human read + live-smoke before push). The local bookkeeping is PROVEN (tombstone + pending-add clear);
  the real-Firestore leg is **Preston's mandatory live-smoke** (steps in the felt card R1). **The round is
  HELD on it** — it does not close/push until this runs green.

### CLOSE POSTURE
Both gates run. Red-team clean (NOTE fixed). Reviewer Finding A fixed + re-verified; Finding B is the
auth-gated live-smoke reserved for Preston (data-loss tier). **The round HALTS for: (1) Preston's push
word; (2) the forced-timing race live-smoke on prestonpraxistest; (3) the DEVICE-OWED felt pass** (installed
PWA + Safari). Final shipped CACHE_VERSION at this close commit: **praxis-v3.265**.
