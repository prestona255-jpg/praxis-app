---
surface: import-capture
route: "overlay"
render_fn: window.ImportCapture (js/import-capture.js)
ground: overlay
in_nav: no
state: untouched
rounds: 0
---

## State

Overlay (js/import-capture.js): `window.ImportCapture`, invoked from views.js:2025-2053; upload / paste / dictation capture.

## Decisions

## Gap ledger

- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: REWORK] Import / capture REWORK — promote the overlay to a REAL dialog (focus-in, Escape, Tab-trap) using the shared focus-trap helper; here a modal IS correct, because it's a discrete flow, unlike the notebook.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] Import / capture FIX now — a timeout and abort on the segmentation call (it can hang with no exit); a visible close affordance on EVERY processing beat.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: ADD] Import / capture ADD — a large-upload size cap plus chunked/paged segmentation, so a big paste never silently drops content past the token limit.

## Round history

## Next
