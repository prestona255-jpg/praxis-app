---
surface: onboarding
route: "overlay"
render_fn: window.Intros.startJourney() (js/intros.js)
ground: dual
in_nav: no
state: untouched
rounds: 0
---

## State

Overlay (js/intros.js): `window.Intros`; first-run journey + 12 per-page intro panels.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] OG6 — First-run journey is suppressed for arc-route entrants (`isArcRoute` early-return, yumi-ui.js:844) — the most likely shared-link arrival gets no onboarding.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] IA4 — The guided journey drops the user on Home at "Enter Praxis," not into the writing loop (intros.js:387,279-288; yumi-ui.js:844) — onboarding→core-loop handoff broken (+OG6).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade — Hand off into the loop: on release, route the new user into the core writing loop (`#notebook` or the book they shelved) instead of leaving them on Home (paired with IA4 in §2; the handoff itself is the enhancement). Small.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: No-dedicated-items] Onboarding — no dedicated items; its concerns live in the Yumi first-run greeting, the Home demo-seed, and the existing intro system. Forward note: the Phase 3 vision changes WHAT gets onboarded (the social direction, lineage), so the flow is revisited in the Phase 4 mockups.

## Round history

## Next
