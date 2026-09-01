# R-FIRSTSHELF CORRECTION PASS — STAGE 0 RECON

STARTED. Base `3ea577d` / v3.287 / HEAD == origin/main / tracked-dirty 0.
Rig: localhost:8877, 390×844, dpr 2. Baseline read: `docs/checkpoints/render-firstshelf.md`.

Protocol docs FOUND: CLAUDE.md · PROTOCOL.md · docs/FIX-PROTOCOL.md (v1.2) ·
docs/checkpoints/render-firstshelf.md · render-firstshelf-recon.md · docs/studio/sequence.md ·
BOARD.md · .claude/rig/README.md. MISSING: none.

## C1 — NOT REPRODUCED in the rig (measured, every configuration)

Flag is 8px below its OWN caption box and inside its own cell in all of:
cover+flagged · placeholder+flagged · mixed bands · flag at 1/2/5 lines.
Escapes the cell only at a 5-line flag string, and then by 2px.

REAL defect found in the same fix: placeholder cover heights disagree inside a
has-flags band — unflagged placeholder grows to 169px, flagged placeholder to 137px.

## C2 — REPRODUCED by arithmetic. `hyphens:auto` (added v3.287) is the culprit.

## C3 — one hide rule only: `body.scan-active`. `:has()` supported.

## C4 — review "N found" (views.js:9321) vs tray "N confident · N need a look"
(scanFinishFill, views.js:9250).

## HALT — one question: C1's mechanism.
