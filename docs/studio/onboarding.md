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

- **CD-6 re-scope (2026-07-25, Preston-ruled Option 1) — `buildActMargin` is an ONBOARDING-round item,
  not a CD-6 door.** At the R-CAPTURE CD-6 Stage-4 recon abort-gate, `buildActMargin` (intros.js:263 — beat
  6 "Act two · the margin" of the 8-beat first-run journey) was ruled **NOT a capture door in the CD-6
  component sense**: one caller (`renderStep`, intros.js:379), no nav/⌘N, and it **already writes through
  the sole-writer `captureNote`** (via `doNote`, intros.js:337). CD-6 is therefore **closed at three doors**
  (writeline v3.254 · book-marg v3.255 · ImportCapture v3.257; see `capture.md`). Under the **ONE FIRST-RUN
  inventory law** — this ledger is the single home for every first-run concern — the beat's *UI* unification
  (retire the bespoke `.ij-noteta`/`.ij-regs`/`.ij-keepnote` teaching UI in favor of opening the real shared
  door) is filed **here as onboarding-round work, NOT as CD-6 debt**. It is tied to **OB L-1** (held
  future-state): pointing the first-run ember at "this door, plain" is exactly OB L-1's premise, which the
  R-CAPTURE recon §7 flagged as *already contradicted* by live code (the beat is book-scoped, not neutral).
  Doing it requires OB L-1 ruled live + a mockup + a new door completion/one-shot opt + a felt pass — a
  round, not a socket. Recon: `docs/checkpoints/cd6-onboarding-recon.md`.

## Gap ledger

- [source: cd6-onboarding-recon.md 2026-07-25] [status: ruled-deferred] [sev: ROUND-GAP] OB-DOOR — the
  first-run **act-margin** beat (`buildActMargin`, intros.js:263) still uses a bespoke inline capture UI
  rather than the shared capture door. Not a defect (it writes through the sole-writer `captureNote`
  already); it is the onboarding-round's chance to unify the *look/gesture* under **OB L-1** — retire the
  `.ij-noteta` beat, open the real door pre-scoped, re-choreograph the narrative around a door-completion
  callback. Gated: OB L-1 live + mockup + door completion opt + felt pass. **Owned by the ONBOARDING round,
  not CD-6.**
- [source: r-capture-brief.md §7 2026-07-25] [status: dependency] [sev: ROUND-OPEN] OB-BRIEF-UNLANDED —
  `docs/studio/onboarding-brief.md` (the "OB brief" the R-CAPTURE brief §7 defers onboarding-spine changes
  to) **does not exist on any branch or in git history**. Landing it — the OB pre-decisions incl. OB L-1's
  live-vs-held ruling — is a **named ONBOARDING round-open task**, a prerequisite of OB-DOOR above. Not
  R-CAPTURE / CD-6 debt.

## Gap ledger (legacy — imported audits)

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] OG6 — First-run journey is suppressed for arc-route entrants (`isArcRoute` early-return, yumi-ui.js:844) — the most likely shared-link arrival gets no onboarding.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] IA4 — The guided journey drops the user on Home at "Enter Praxis," not into the writing loop (intros.js:387,279-288; yumi-ui.js:844) — onboarding→core-loop handoff broken (+OG6).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade — Hand off into the loop: on release, route the new user into the core writing loop (`#notebook` or the book they shelved) instead of leaving them on Home (paired with IA4 in §2; the handoff itself is the enhancement). Small.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: No-dedicated-items] Onboarding — no dedicated items; its concerns live in the Yumi first-run greeting, the Home demo-seed, and the existing intro system. Forward note: the Phase 3 vision changes WHAT gets onboarded (the social direction, lineage), so the flow is revisited in the Phase 4 mockups.

## Round history

- **R8 — Values preset moment — SHIPPED v3.195 (`37ea1f0`), 2026-07-11.** The first-run journey (js/intros.js
  `JOURNEY`) gained a new **`values` beat** ("What do you read toward?") — 4th of now **8 beats**, after
  `stance`. Offers the 10 approved starter presets (Liberation · Power, named · Dignity · Solidarity · Care ·
  Doubt · Praxis · Inheritance · Hope · Craft) + a name-your-own input; each toggle persists to
  `profile.values` via the `accountValuesPersist` idiom (`setProfile{values}` + `saveProfileToFirestore`).
  `resetPicked` SEEDS the accumulator from existing `profile.values` (red-team FINDING 1 fix — a retake no
  longer wipes prior declarations; the beat is additive). Dark journey ground (`.ij-vchip`, gilding-gold
  on-state). Closes the onboarding half of VC5 (retrofit = the Account half). Live smoke: real chip clicks →
  persisted; retake with 4 declared → seeded-selected → +1 kept all, no wipe.

## Next
