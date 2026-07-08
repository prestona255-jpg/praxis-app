---
surface: yumi-panel
route: "overlay"
render_fn: buildYumiPanel (yumi-ui.js:1027) / buildYumiBloom (yumi-ui.js:920)
ground: overlay
in_nav: no
state: untouched
rounds: 0
---

## State

Overlay (js/yumi-ui.js): `buildYumiPanel` (1027) + Bloom FAB `buildYumiBloom` (920); body-level, present on every surface.

## Decisions

## Gap ledger

- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] Yumi panel FIX now — wrap the three still-untimed Yumi fetches in the timeout primitive; close the orphaned-user-turn gap on send failure (atomic, so a failed send doesn't strand your message); a distinct 'still reaching Yumi…' state on slow networks; reconcile the transparency builder's dual-ground identity.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Hygiene] Yumi panel Hygiene → sweep — dead voice-button code and a stray link rule.
- [source: fable-audit-charter.md §4 2026-07-06] [status: unverified] [sev: P1/P2-friction] §4 Yumi — voice/response doesn't work well; doesn't feel alive.

## Round history

## Next
