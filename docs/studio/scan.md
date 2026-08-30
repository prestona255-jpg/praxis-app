---
surface: scan
route: "#scan"
render_fn: renderScan (js/views.js)
ground: dark
in_nav: yes
state: closed
rounds: 1
mobile: native
desktop: honest-secondary
mockup: scan-surface.html (SHAPE-B, felt-pending)
---

## State

The unified capture surface: a full-bleed camera (`renderScan`, js/views.js) entered
from the create door's Scan mode (CD-6 socket) and its own first-class nav entry
(`#scan`). **Book mode** = continuous free barcode decode (BarcodeDetector / zxing) +
a cover shutter (paid single-book vision) → a verdict card with one locally-derived
context line (zero LLM) → one-tap guarded Add. **Shelf mode** = a deliberate shutter →
shimmer → `shelf-vision` (claude-opus-4-8) → a live tray with SCA3 dedupe → the
mirror-shelf review (draft-case cavity, upright confident vs leaning exceptions) → the
exception walker (evidence line `I read: '<spineText>'`, GB candidates) → Shelve N via
the shared guarded write → receipt with an IMMEDIATE batch Undo. Four failure states,
designed permission + offline + denied doors, a soft daily cost cap (30/day, never
silent-degrade), SCE-1 hardware-honest camera lifecycle, and a death-proof draft.

The camera is dark/warm (Universal HOUR chrome over live video); the review returns to
the light draft case. Mobile-first (390 is the acceptance surface); desktop is an honest
secondary (ISBN/search add-door + a shelf-photo drop-zone — no fake viewfinder).

## Decisions

- **21 forks ruled at rec** (SC1–12, SCA1–3, SCD-1–3, SCE-1–3) — see the brief.
- **Cut = {low}** (SC12 calibration on the real library; 9.3% exception rate). GB arm
  STRENGTHENED (bookIdentityKey corroboration, not totalItems>0; noisy-author→title-only).
- **ERRATA-1**: batch Undo fires IMMEDIATELY (deleteBook loop; no sync-hold).
- **BRIEF-CONFLICT #1** (surfaced): shelf-vision returns no partial books on max_tokens →
  TRUNCATED ships as an honest distinct state, no impossible keep-partial tray.

## Gap ledger

- SCAN carried debt lives in the round-close CARRIED-DEBT LEDGER (`docs/launch-runway.md`, 6 SCAN rows,
  2026-08-08): partial-books endpoint (ERRATA-3) · OCR author misspells · hallucinated-author on hard
  spines · FAB/Review-N overlap at 390 (overnight-eligible) · vision-proxy latent stop_reason gap · iOS
  home-icon opens Safari. Scan-local S-B residuals: dead `.barcode-scanner-*` / `.shelf-scan-status` CSS
  + the stale `downscaleShelfPhoto` comment.
- **COVERS (v3.282/283, 2026-08-29)** — scan cover resolve: `scanResolveAndFill` never set `item.coverCandidates`,
  so the tray / review / walker covers only ever tried `coverCandidates[0]` (the OpenLibrary url) and never the
  Google Books art. Fixed at v3.282; dead `scanClassify` removed at v3.283. Carried debt T1 (three divergent cover
  decision paths) and T4 (OL-before-GB ordering unexamined) are in the CARRIED-DEBT LEDGER (`docs/launch-runway.md`).
  Record: `docs/checkpoints/covers-diagnosis.md`.

- **R-FIRSTSHELF-DUPES Stage 2 — PREVENTION (v3.284, 2026-08-29, local/unpushed)** — four consecutive scans
  of one physical shelf produced duplicate shelf records. Two causes, both now closed on the prevention side:
  (a) the shared identity key (`bookIdentityKey`) normalized the WHOLE author string, so
  `"Helen Fisher, PhD"` and `"Helen Fisher"` were different books and the existing cleanup surface reported
  **0 duplicates** for the pair on screen; (b) `scanCommitBook` — the one commit point all three scan
  add-doors share — **never consulted the key at all** and minted a fresh `genBookId()` every time.
  **Shipped:** the identity source is now TIERED (Preston Ruling 2) inside the one existing function family
  — key = normalized title (leading article stripped, **subtitles never stripped**) + first-author
  **surname**; `bookIdentityTier` returns `exact` (normalized ISBN-13 equality) / `probable` (key equality,
  ISBNs absent or differing) / `near-miss` (titles equal, one surname a strict prefix of the other — the
  vision layer's truncation, T7/F2; marks nothing, blocks nothing, counted only) / `none`.
  The shelve path folds an **EXACT** match and enriches blank fields only — never `status`, never any
  reader-authored field. A **PROBABLE** match is never silently refused (it may be a second edition).
  **Tray + review face:** a new informational state — filled gold tick + "already shelved" (EXACT), hollow
  gold tick + "may be a copy" (PROBABLE) — built on the tray's existing tick geometry and `.spine-flag`
  typography, deliberately NOT the `.is-lean` gray. Before this, `data-owned` was written and read by
  **nothing** (zero CSS selectors, zero readers). The "Shelve N" count now equals what Shelve will CREATE.
  **F5 ordering hazard closed in the same commit:** `mergeBookDuplicates` went from 2 live callers to ZERO
  (`grep -c 'mergeBookDuplicates('` 3 → 1, i.e. definition only) — "Resolve all" is covers-only, per-group
  Merge disabled and labelled; detection untouched.
  **HELD:** the merge surface (Stage 3) — it waits on FIX-PROTOCOL §9's `fix-red-team` gate and on **T8**
  (`mergeBookDuplicates` drops `valueMarks` incl. authored `why`, `movedMe`, `rating`, `dateRead`,
  `categoryOverride`, `traditionOverride`).
  **RESIDUAL — VISUAL GATE UNCLEARED:** proven structurally (72/72 assertions across 3 cscript harnesses,
  all exit 0, harness self-validated against a broken copy), NOT visually — this rig has no camera and
  cannot drive the scan overlay. Felt pass PENDING. Record: `docs/checkpoints/firstshelf-dupes.md`;
  console census: `docs/checkpoints/firstshelf-dupes-census.js`.

- **T13 / T14 / T15 — STALE-DRAFT ROUND (v3.285, 2026-08-30) — LOCAL, UNPUSHED.** Opened on the premise
  that an unresolved draft case degrades every subsequent scan (observed 19 -> 6 -> 1 confident across
  successive runs on one shelf; declining the batch restored 16/19). **Stage 1 falsified the premise and
  named the real mechanism** — the third round running in which Stage 0/1 corrected the opening premise.
  - **T13 REVISED, not filed as fact.** The draft neither corrupts confidence nor adds lookups. Measured:
    lookups issued == vision books EXACTLY at draft sizes 0 / 5 / 20 (19 / 19 / 19), confidence curve flat
    (19 / 19 / 19 confident), and every draft-facing path — rehydrate, review, all walker steps, nav badge —
    issues **zero** fetches. Declining the batch changed the next run's request count by zero. What IS real
    and was found alongside it: `scanResolveAndFill` replaces `scanResult` wholesale (`views.js:8992`), so a
    second capture **silently destroyed** an unresolved draft with nothing on screen having named it.
  - **T14 FIXED — the actual defect.** `googleBooksSearch` never checked `res.ok`; it called `res.json()` on
    any status, and a Google Books error body is valid JSON with no `items`, so a **429 fell through the
    `!data.items` guard and returned `[]` — byte-identical to "this book does not exist."** The proxy passes
    the upstream status through untouched (`google-books-proxy.js:89-118`), so the information existed at
    that hop and was discarded. Replayed with the REAL upstream body (1,306 B, saved verbatim): `res.ok`
    false, parse succeeds, `items` undefined -> `manualStub` -> `status:'none'` -> `scanIsException` true ->
    the reader is shown "The Beautiful Risk of Education / Gert Biesta -- needs a look", which is the exact
    card in Preston's screenshot. A partial-failure run reproduces "23 found · 6 confident" exactly.
    **Now three outcomes:** items · `[]` with `err === null` (a true no-match) · `[]` with `err`
    (transport/quota). `lookupFailed` + `lookupHttpStatus` ride ALONGSIDE `status`, which is byte-untouched,
    so all five existing readers are unaffected. Retry 2x (400/1200 ms) on **429 and 503 only** — a
    deterministic 401/400/413 is never retried — behind a 20 s circuit breaker, so a 19-book dead-quota run
    costs **21 HTTP calls, not 57**.
  - **A NEW SURFACE STATE — `is-unlooked`.** Two different things shared one gray leaning spine. `is-lean`
    (grayscale + rotate) reads "unavailable" and is right for a genuine no-match. A book whose spine was read
    perfectly and could not be ASKED about is not that: upright, ungrayed, gold-deep flag ("couldn't look
    up"), in the `.is-shelved` / `.is-maybe` informational register — plus a run-level note on the review
    face, honest tray + announcer copy, and walker copy that stops asking "Is this the one?" about a
    candidate it never received.
  - **T15 FIXED.** `savedAt` was write-only since introduction (repo-wide grep = 1, the write). It is
    rewritten on every save, so it was ALREADY a last-touched stamp that never reached a caller.
    `scanLoadDraft` now returns it, and R2's ~24h silent auto-clear runs at that single chokepoint — the nav
    badge reads through it too, so expiry cannot be half-wired. Clock = `Date.now()`; a missing/garbage stamp
    OR a backward-moved clock yields a negative age, which **never expires**.
  - **R1 + FORK RULING B (Preston, 2026-08-30) — THE SHUTTER IS BLOCKED.** `#scan-draftbar` mounts inside
    `#scan-screen-view` (the capture view, where the shutter is), names count + age, offers RESUME and a
    two-step DISCARD that names the count and states shelved books are untouched. It **replaces**
    `#scan-primer-resume`, removed in the same commit — that button only appeared pre-grant, vanished on
    dismissal, sat on a screen with no shutter, and was off the block. Preston ruled the warn-only version
    insufficient: "the warning must prevent the thing it warns about." A shelf capture now refuses while a
    pending draft is on screen, at BOTH shelf doors (`scanFireShelfShot` before the freeze/capture/budget
    spend, and `scanRunShelfVision`, which the desktop drop-zone shares). Book mode is deliberately ungated —
    it commits through `scanCommitBook` and cannot destroy a draft.
  - **THE ESCAPE HATCH IS THE LOAD-BEARING PART.** B's failure mode is total, so the block is NEVER
    conditioned on the flag: `scanShutterBlocked()` requires `scanDraftBarIsOnScreen()`, a predicate over
    RENDERED GEOMETRY + RESOLVED STYLE (in-DOM · non-empty `getClientRects` · non-zero rect · viewport
    intersection, guarded on a non-zero viewport · display/visibility/opacity). **Every clause fails OPEN** —
    no banner, no block. Swept all six suppression modes individually (display:none, visibility:hidden,
    opacity:0, zero size, off-viewport, detached); each releases the shutter, and restoring the bar re-blocks.
    `scanDraftBarBlockProbe()` exposes each clause for a test and has **no production caller by design**.
    RESUME/DISCARD release the block in a `finally`, so a mid-action throw cannot strand anyone.
  - **The blocked shutter is never disabled and never grayed** (`disabled false · opacity 1 · filter none ·
    pointer-events auto · cursor pointer`); the tap brightens the bar (`.is-calling`, reduced-motion aware)
    and announces. `scanCallDraftBar` closes overlays first — the camera-denied card carries its own shelf
    drop-zone, and a refusal that explains itself behind an opaque panel is the failure B exists to prevent.
    **Invariant: if we refuse, the reason is on screen.**
  - **INFRASTRUCTURE, for Preston, not a code change:** the keyless Google Books consumer is a shared
    anonymous project (`project_number:624717413613`) whose `defaultPerDayPerProject` is literally **0** —
    25 of 25 probe requests returned 429. If `GOOGLE_BOOKS_API_KEY` is unset in Netlify, matching is
    permanently broken; if it is set, that key's quota is the binding constraint on books-scanned-per-day.
    Launch-blocking, and explicitly out of this round's scope. From v3.285 the device reports the HTTP
    status, so the next real run answers it with data instead of inference.
  - **T16 — T5 IS PROBABLY NOT A SEPARATE PHENOMENON.** The 15/17/19 confidence spread was attributed to
    vision-layer instability. The exception predicate has two arms — `confidence === 'low'` (vision) and GB
    no-match (catalogue) — and a flapping catalogue moves the second arm run-to-run with no vision change at
    all, which is that same shape. It cannot be split retrospectively (those runs recorded no status);
    `rec.unlooked` separates them per run from v3.285 onward.
  - **RESIDUALS:** VISUAL GATE uncleared (screenshots at 375x812 corroborate; felt pass is Preston's) ·
    FIX-PROTOCOL §9's `fix-red-team` did NOT run (session agent-barred; named HALT-tier at Stage 0 and
    unresolved at commit — the COVERS two-line ruling is explicitly not precedent for a +453-line diff
    carrying a refusal gate on a paid capture path) · live CACHE_VERSION verify is owner-only (egress
    blocked). Records: `docs/checkpoints/stale-draft-recon.md` + `docs/checkpoints/stale-draft.md`.
## Round history

- **SCAN (deep round) — CLOSED 2026-08-08** (full felt PASS on Preston's device round 4, installed PWA +
  Safari; closing version **v3.269**). Shipped v3.259→v3.269: the 6 build commits (`63267ff` hook infra ·
  `71c0bcf` S1 pipeline · `007ad96` S2 surface · `6103937` S3 Book mode · `50656a6` S4 Shelf mode ·
  `a9e0c2b` S5 lifecycle+retirement, v3.260→v3.264/265) + 4 fix loops through `6c021af` (F9 frame-crop
  last, v3.269). Ported from `scan-surface.html`. Wired shelf-vision (opus), retired the legacy
  vision-proxy shelf path + openBarcodeScanner modal (net −260 L). Full rig verification; the forced-timing
  race is proven in local bookkeeping (real-Firestore leg = Preston's live-smoke, R1). Records:
  `docs/checkpoints/scan-build.md` + `scan-fixloop4-ship.md` (felt round 4) + the close acceptance card
  `docs/checkpoints/scan-acceptance-close.md`. **Round CLOSED on Preston's felt pass.**

## Next

- Felt pass DONE — Preston, device round 4, 2026-08-08 = FULL PASS. Round CLOSED.
- **OPEN ON THIS SURFACE (v3.285, 2026-08-30, local + unpushed):** two felt passes owed —
  (1) the capture-view draft bar + the blocked shelf shutter (which must still read as LIVE, not dead);
  (2) the `is-unlooked` catalogue-outage state on the review face. And **§9's `fix-red-team` is unrun on
  that diff** (agent-barred session) — HALT-tier, unresolved, gating the push, not just the felt pass.
- **NOT a scan-surface question but it gates scan accuracy:** whether `GOOGLE_BOOKS_API_KEY` is set in
  Netlify, and what its quota is. Preston is checking separately (T14).
- Next lead deep round = **RE-PLAN PENDING** (Preston's ruling; see `docs/studio/sequence.md` Re-plan log
  2026-08-08). Carried debt is recorded in the CARRIED-DEBT LEDGER (above / `docs/launch-runway.md`),
  recorded not licensed.
