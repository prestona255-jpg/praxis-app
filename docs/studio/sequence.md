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

## Now

- [ ] **R1 — re-skin the canon + galaxy mockup to Universal → felt pass.** The two
  `design/*.html` files adopt the Universal semantic set; the galaxy mockup gets
  the §4 scoped night. Track-B's "Profile / Galaxy north star" and "iterate until
  it feels finished" live here (Track-B PHASE A + PHASE B). Closes ONLY on
  Preston's felt pass.

## Next

- [ ] **Studio install** — the `docs/studio` scaffold + the `studio-scan` agent +
  this Builder (this run). No app files touched.
- [ ] **R2 — first surface round** (Shelf or Home). Prove Universal on one live
  surface; that surface's gap audit writes the next round's brief.

## Then

Per-surface rounds, one surface at a time, each: **scan → forks → mockup
reconstruction → felt pass → staged build → close.** A round closes ONLY on
Preston's felt pass. Carried from the launch spine and the evolution track and
folded into the rounds — nothing dropped:

- [ ] **Signed-out / first-run** — OG1–OG4 + IA4: honest signed-out state, a real
  sign-in CTA, onboarding that lands in the writing loop rather than Home. Pairs
  with First-run Path A. (launch-spine STEP 2)
- [ ] **Shared-tab account-switch race** — F-DL4: reset the eight `*Loaded` and
  `*WritePending` latches in `clearUserState()`. Touches `state.js`.
  (launch-spine STEP 4)
- [ ] **F-DL1 + F-DL3 live smokes** — the two shipped data-loss fixes whose live
  smoke never ran; procedure proven on F-DL2, 15/15. (launch-spine STEP 5)
- [ ] **Backport the aesthetic uplift into the live app** — once the Universal
  mockups lock, one batch craft/polish pass flows back app-wide. (Track-B PHASE C
  + post-launch #6 craft pass + post-launch #7 backport)
- [ ] **Goodreads migration** — First-run Path B; the import infra is real work.
  (post-launch #1)
- [ ] **Public commons + moderation** — public routes, signed-out rendering, a
  moderation surface; the consented door on the same covenant surface as VC1.
  (post-launch #2)
- [ ] **Galaxy encoding** — real engagement + read-progress wiring behind the
  visual. (post-launch #3)
- [ ] **Values–arcs wiring** — profile values shape how arcs form and what
  connections get suggested; a data-model change, done right not rushed.
  (post-launch #4)
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
