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
