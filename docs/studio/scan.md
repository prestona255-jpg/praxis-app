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
- Next lead deep round = **RE-PLAN PENDING** (Preston's ruling; see `docs/studio/sequence.md` Re-plan log
  2026-08-08). Carried debt is recorded in the CARRIED-DEBT LEDGER (above / `docs/launch-runway.md`),
  recorded not licensed.
