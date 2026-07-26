---
surface: scan
route: "#scan"
render_fn: renderScan (js/views.js)
ground: dark
in_nav: yes
state: built
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

## Round history

- **SCAN (deep round) — BUILT + VERIFIED, committed-local, awaiting push + Preston's felt
  pass** (v3.260→v3.264, 6 commits: `63267ff` hook infra · `71c0bcf` S1 pipeline · `007ad96`
  S2 surface · `6103937` S3 Book mode · `50656a6` S4 Shelf mode · `a9e0c2b` S5 lifecycle+
  retirement). Ported from `scan-surface.html`. Wired shelf-vision (opus), retired the legacy
  vision-proxy shelf path + openBarcodeScanner modal (net −260 L). Full rig verification;
  the forced-timing race is proven in local bookkeeping (real-Firestore leg = Preston's
  live-smoke). Records: `docs/checkpoints/scan-build.md`. **Round closes on Preston's felt pass.**

## Next

- Preston's felt pass on the installed PWA + Safari (the DEVICE-OWED felt card in scan-build.md).
- Carried debt after the pass: dead `.barcode-scanner-*` / `.shelf-scan-status` CSS (S-B sweep);
  the `downscaleShelfPhoto` comment still describes the retired vision-proxy flow.
