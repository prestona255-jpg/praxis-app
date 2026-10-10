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
- **BRIEF v3 RATIFIED (2026-09-27, Preston; chat-side, Fable) — `docs/studio/onboarding-brief.md` is the round's constitution.** Six-beat spine on real surfaces (front door with the covenant → books through the Shelf's three real doors, scan first on a phone → one note through the shared capture door → the R8 values beat as shipped → consent on the real `#yumi-sees` → computed release landing on Home sky-first; Yumi's first line on demand, scripted below the 3-book floor). Eight deltas vs v2, cap held. Five forks ruled at rec: Δ2 books-first, Δ8 Home landing, Δ1 covenant pre-auth, Δ4 zero-call first line, hygiene fork = SPLIT (render gap + seed leak → P3 Stage 0; the rest → H-1). ONE FIRST-RUN inventory: brief §5 names every shipped first-run behavior and its fate — the 8-beat journey, the six-beat greeting, `onboardingSeen`, the beat-1 escape, "Retake the walk", the OG6 suppression. Next: the mockup-stage acceptance card (`docs/checkpoints/onboarding-acceptance-mockup.md`, per `acceptance-card.md`) → spine mockup → stranger walks the mockup → P3.
- **SPINE MOCKUP + ACCEPTANCE CARD LANDED (2026-10-09; chat-side, Fable)** — `design/praxis-spine-v1.html` is the spine's picture and `docs/checkpoints/onboarding-acceptance-mockup.md` (v2) is its card. The walk is the brief's six beats plus Yumi's first line, with the SKY BAND ruled 2026-10-05 (each act lights a star; release opens onto the Home sky with the same stars unconnected). Five forks ruled 2026-10-09, all at rec: the covenant's three terms verbatim from the brief · the values beat drawn into the walk · the consent page shows what is true today · in first-run the scan door opens in Shelf mode, Book one tap away · a reader on a phone can choose a shelf photo (a new build item). Two of the card's OWNER rows correct or contradict something already written and are not yet answered: the front door is three frames where brief §1.1 says one screen (O-2), and the consent frame was redrawn after review found the fork had described the live `#yumi-sees` page wrongly (O-8). Not signed off: nine OWNER rows are blank, five rows are FAIL carried as named debt (laws 4 and 10, deltas 3, 5 and 8), two inventory rows are MISSING (designed states, 1360), Preston has not felt-passed the changed frames, and no stranger has walked it.

## Gap ledger

- [source: cd6-onboarding-recon.md 2026-07-25] [status: ruled-deferred] [sev: ROUND-GAP] OB-DOOR — the
  first-run **act-margin** beat (`buildActMargin`, intros.js:263) still uses a bespoke inline capture UI
  rather than the shared capture door. Not a defect (it writes through the sole-writer `captureNote`
  already); it is the onboarding-round's chance to unify the *look/gesture* under **OB L-1** — retire the
  `.ij-noteta` beat, open the real door pre-scoped, re-choreograph the narrative around a door-completion
  callback. Gated: OB L-1 live + mockup + door completion opt + felt pass. **Owned by the ONBOARDING round,
  not CD-6.**
- [source: r-capture-brief.md §7 2026-07-25] [status: landed 2026-09-27] [sev: ROUND-OPEN] OB-BRIEF-UNLANDED —
  `docs/studio/onboarding-brief.md` (the "OB brief" the R-CAPTURE brief §7 defers onboarding-spine changes
  to) **does not exist on any branch or in git history**. Landing it — the OB pre-decisions incl. OB L-1's
  live-vs-held ruling — is a **named ONBOARDING round-open task**, a prerequisite of OB-DOOR above. Not
  R-CAPTURE / CD-6 debt. **LANDED 2026-09-27 as v3** — `docs/studio/onboarding-brief.md` (the July-17 v1/v2 were chat-only; v3 written from the P2 census `f4490e3`). OB L-1 is superseded by v3 Δ2 (books first, then one note through the shared door).
- [source: onboarding-acceptance-mockup.md 2026-10-09] [status: open] [sev: ROUND-OPEN] OB-MOCKUP-DEBT — six debts the spine mockup carries, owed before the P3 spine lane builds against it: D-1 the seven undrawn §8 states (+ scan-failure, import-wait) · D-2 the error color token (canon v1.2 has none) · D-3 the Lenses rail's "arrived" state · D-4 the re-entry frame (About's "Continue the walk") · D-5 the 1360 frames · D-6 the search and paste doors (each a marked stand-in), plus Book mode's verdict sheet and the camera primer. Record: `docs/checkpoints/onboarding-acceptance-mockup.md`.
- [source: onboarding-acceptance-mockup.md 2026-10-09] [status: open] [sev: ROUND-OPEN] OB-SHELF-PHOTO — ruled 2026-10-09: on a phone, the Scan surface's Shelf viewfinder gains "Choose a photo", feeding the same shelf-vision pipeline as today's drop zone (`scanDropzoneHTML`, js/views.js), which appears only once the camera is refused or unavailable. A new build item for P3's scan door promotion lane. Its companion ruling, first-run opens Scan in Shelf mode, needs no new mechanism (the `#scan/shelf` preselect).

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
