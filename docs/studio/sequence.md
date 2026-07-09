# The build sequence

Two tracks in parallel. Track A is the machine — build in Claude Code, on main,
in order. Track B is the look — worked together with Preston, on no clock. Every
decision below is already made; nothing here is pending a call.

The fix-protocol runs the code changes inside Claude Code — no copy-paste
ping-pong. One prompt dispatches the agents (`repo-mapper` recon → `fix-red-team`
adversarial review → `fix-implementer` patch) and chains them end-to-end.
Code-changing work keeps PASS/FAIL gates + revert-on-fail; the loop writes
checkpoints to disk and reports the commit hash. None of this needs the Build 3/4
CI automation — that stays parked.

## Re-plan log

The sequence is a living plan (see CLAUDE.md Studio Protocol). Any reordering
records a dated one-line rationale here; a re-plan that changes the launch spine,
retires an item, or contradicts a Preston decision is written as `PROPOSED:` and
flagged at the top of the Builder's sequence page for his call — never applied silently.

- **2026-07-08** — installed → depth law (Universal §8 / `universal-depth.css` v1.2)
  adopted; Builder v2 (depth re-skin + sidebar rail + overview-first + progress bar +
  surface cards). Legacy audit/gap findings imported into the surface ledgers. No
  launch-spine change; no item retired.
- **2026-07-09** — R2 Shelf CLOSED (felt pass in full, v3.185 `372775a`). Recorded
  completion of Studio install + R1 + R2 into Shipped (reality, not retirement — R2's
  live felt pass validated the Universal lock R1 delivered). Re-set **Now** to the 3
  truest next moves: (1) the Shelf **data-correctness round** — CX-1/CX-2 promoted
  from the R2 cross-check as the top-severity open work, sanctioned to run "after the
  skin" per the reconciliation addendum; (2) **R3 Home** as the next surface,
  folding in signed-out/first-run (launch STEP 2); (3) the **data-loss launch
  cluster** (F-DL4 + F-DL1/3 smokes, STEP 4/5). Notebook (heat 18) + the deferred
  Shelf-categories feature round → Next; arc-detail (heat 14) → Then. Autonomous
  re-order (promote-severe-gaps + continue-cadence); no launch-spine item retired, no
  Preston decision contradicted — so no `PROPOSED:` flag.
- **2026-07-09** — Shelf data-correctness round CLOSED (live pass in full, v3.186
  `e12f705`; Firestore resurrection test held). Moved it to Shipped → both Shelf
  rounds now closed. Promoted **R3 Home** to the top of Now (the recommended next
  surface) and pulled **R4 Notebook** (heat 18, now the heaviest open surface) up
  into Now beside the data-loss launch cluster; Shelf-categories feature round stays
  in Next. Autonomous completion + cadence re-order; nothing retired, no `PROPOSED:`.

## Shipped

- [x] **Fable audit committed** — the five `pass3-*.md` ledgers +
  `docs/audit/fable-audit-combined.md`. Docs-only; done first to prove the
  pipeline was alive. (launch-spine STEP 0)
- [x] **VC1 + VC1-b — journal privacy leak closed** (v3.181). `register==='journal'`
  skip in the move-scan, `_memberBodies` guarded, VC2's evidence path closed;
  `assembleContextData` restored as the single filter site. (launch-spine STEP 1)
- [x] **NB1 — invisible notebook writeline fixed** (v3.182). The visibility slice
  shipped alone; WL1/WL2/CR2/NB2–6 deferred. (launch-spine STEP 3)
- [x] **On-book marginalia coverage walk** — read-only audit, no launch-critical
  findings (commit `2ff2f3f`). (launch-spine OPTIONAL; residual loose end from that
  row — an earlier parked `git stash`; `git stash list` to decide keep-or-drop when
  convenient.)
- [x] **Living-doc tracker retired** — superseded by this sequence and the Builder.
- [x] **R0 recon** — token inventory + surface census (commit `75bb7d3`).
- [x] **Universal token sheet confirmed** — v1.1 (paper-and-night fusion, warmth
  revision, ten-hue field spectrum).
- [x] **Studio install** — the `docs/studio` scaffold + `studio-scan` agent + the
  generated Builder. No app files touched.
- [x] **R1 — canon + galaxy mockups re-skinned to Universal** — the two
  `design/*.html` adopt the Universal semantic set + the §4 scoped night; Universal
  locked (validated by R2's live felt pass). (Track-B PHASE A + B)
- [x] **R2 — Shelf: Universal v1.2 skin + 8 features** (v3.185, `372775a`; felt pass
  PASSED IN FULL 2026-07-09 — visual + Move-to-arc Firestore round-trip + thread-tap
  reveal). First surface round; also codified the studio **mockup stage**
  (`studio-mockup` agent, five-beat loop, shaped/built orbs + surface mockup link).
  (launch-spine — first surface round)
- [x] **Shelf data-correctness round — CX-1 / CX-2 / CX-3** (v3.186, `e12f705`; live
  pass in full 2026-07-09 — the Firestore **resurrection test** held, plus dedup-on-add
  + delete persistence). Merge parity + tombstone, dedup-on-add guard, orphan-safe
  author rail; `deleteBook` byte-locked reference. Data-loss tier, own commit.
  (Shelf round 2 — both Shelf rounds now closed)

## Now

- [ ] **R3 — Home: next surface round** — prove Universal on Home (the R2 cadence's
  next surface), folding in the honest **signed-out / first-run** launch step
  (OG1–OG4 + IA4: real sign-in CTA, onboarding that lands in the writing loop rather
  than Home). scan → forks → mockup → felt pass → staged build → close.
  (launch-spine STEP 2)
  touches: [home, onboarding]
- [ ] **Data-loss launch cluster** — **F-DL4** shared-tab account-switch race (reset
  the eight `*Loaded`/`*WritePending` latches in `clearUserState()`, `state.js`) +
  the **F-DL1 / F-DL3** live smokes that never ran (procedure proven on F-DL2,
  15/15). The remaining launch-spine data-loss work. (launch-spine STEP 4 + 5)
  touches: [account]
- [ ] **R4 — Notebook: surface round** — the heaviest surface gap-heat now that the
  Shelf is closed (18 open gaps). scan → forks → mockup → felt pass → build → close.
  touches: [notebook]

## Next

- [ ] **Shelf categories feature round** — the deferred data/product arc off the
  "Shelf / categories" ledger cluster (rawCategories capture on every write path,
  duplicate-add guard, batch progress, manual override + book-detail picker, lineage
  extension, re-classify scoping). NOT a visual round.
  touches: [books]

## Then

Per-surface rounds, one surface at a time, each: **scan → forks → mockup
reconstruction → felt pass → staged build → close.** A round closes ONLY on
Preston's felt pass. Carried from the launch spine and the evolution track and
folded into the rounds — nothing dropped. (The launch-spine data-loss + signed-out
steps 2/4/5 were promoted into **Now** on 2026-07-09 — see the Re-plan log.)

- [ ] **Arc interior round (arc-detail)** — the third-heaviest surface (14 open
  gaps) after Notebook; queue behind R4. touches: [arc-detail]
- [ ] **Backport the aesthetic uplift into the live app** — once the Universal
  mockups lock, one batch craft/polish pass flows back app-wide. (Track-B PHASE C
  + post-launch #6 craft pass + post-launch #7 backport)
- [ ] **Goodreads migration** — First-run Path B; the import infra is real work.
  (post-launch #1)
  touches: [import-capture]
- [ ] **Public commons + moderation** — public routes, signed-out rendering, a
  moderation surface; the consented door on the same covenant surface as VC1.
  (post-launch #2)
  touches: [commons]
- [ ] **Galaxy encoding** — real engagement + read-progress wiring behind the
  visual. (post-launch #3)
- [ ] **Values–arcs wiring** — profile values shape how arcs form and what
  connections get suggested; a data-model change, done right not rushed.
  (post-launch #4)
  touches: [profile, arcs]
- [ ] **Register redesign + consented door** — registers named for what they are,
  visibility on the publish pill; journal → public evidence only via an explicit,
  loud, visibly-re-marked step. Never silent. (post-launch #5)

## Discovered — profile ledger

The seven-item spine the profile / galaxy work surfaced. These are MISSING, not
broken — the studio loop's other instrument:

- [ ] **Owner-vs-visitor view — CORE.** The profile renders one way for its owner,
  another for a visitor.
- [ ] **Recent-thinking feed.** A stream of recent sub-theories, notes, and marks.
- [ ] **Published section.** The reader's published sub-theories, surfaced on the
  profile.
- [ ] **Library path.** A route from the profile into the reader's library.
- [ ] **Edit mode.** In-place editing of the profile's identity and values.
- [ ] **Social / discovery hooks.** Follow, build-on, walk — the commons hooks.
- [ ] **Longer about.** Room for a fuller prose self-description.

## Standing rules

- **One build.** No post-launch bucket — the launch spine and the evolution are
  one continuous build.
- **Two tracks.** Track A is the machine (Claude Code, on main, staged fixes);
  Track B is the look (mockups, felt passes). Worked together, never in isolation.
- **Flexible launch date.** No hard clock; the old "days to July 15" counter is
  retired with the tracker.
- **Test-account rule.** All write/behavior verification runs on a fresh throwaway
  Firebase account — never destructive verification on a real account.

## Open calls — already made

Reference — nothing here is pending a decision.

- **Commons** — Public — signed-out visitors welcome. *A real build, not a nav
  flip. Publish means world-readable, so the consented door is designed on the
  same covenant surface.*
- **Account + Profile** — Merged into one Profile. *The settings surface and the
  public portrait become a single page rather than two.*
- **About page** — Kept — below Search / Profile in nav. *Stays as an orientation
  surface; not folded into anything else.*
- **Journal → public** — Consented door only — explicit and loud. *A private note
  becomes published evidence only via a deliberate "make this public" step, and is
  visibly re-marked afterward. Never silent.*
- **Reading shape** — Galaxy-only. *No alternate list or grid view — the galaxy is
  the single portrait of how you read.*
- **Values** — In scope now — the moment + arc-wiring. *The values moment ships at
  launch; the wiring that lets values shape arcs follows in Phase 2.*
- **Commons moderation · OQ-A** — Your review first; community flags in Phase 2.
  *Keeps quality high at launch while the commons is small, then hands moderation
  to the community as it grows.*
- **Whose galaxy on commons · OQ-B** — Only your published sub-theories. *The
  galaxy is your intimate reading portrait; the sub-theories are the thinking you
  choose to share. Keep them separate — the galaxy stays yours.*
