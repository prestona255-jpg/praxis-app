# The build sequence

This is the **master sequence** — the locked, continuous program that replaces the
old round-by-round ad-hoc re-planning. Praxis is built one surface round at a time,
one round per chat/session, on `main`, on no clock (the July 15 launch date is retired
— see Standing rules). The order below is **canonical, not concrete**: it is re-planned
WITHIN the program at each round close-out (promote what proved severe, demote or retire
what closed or lost relevance), and every reordering records a dated rationale in the
Re-plan log. A change to the launch spine, an outright retirement, or a contradiction of
a Preston decision is written `PROPOSED:` and flagged for his call — never applied silently.

**Two round types.** A **DEEP round** runs the full five beats — recon → click-forks with
Preston → mockup reconstruction → staged build → close. A **SWEEP round** takes 2–3 light
surfaces together and skips only the mockup beat — recon → click-forks → build → close.
Either way a round closes fully: Preston's felt pass → surface ledger → this sequence →
BOARD → `tools/studio-build` Builder regen (currency is automatic, not optional).
Dependencies are declared per round; on any conflict, live source wins. Every Claude Code
build prompt carries the read-discipline: grep → ranged view (no whole-file reads of
anything large) and a capped agent fan-out.

The fix-protocol runs the code changes inside Claude Code — no copy-paste ping-pong. One
prompt dispatches the agents (`repo-mapper` recon → `fix-red-team` adversarial review →
`fix-implementer` patch) and chains them end-to-end. Code-changing work keeps PASS/FAIL
gates + revert-on-fail; the loop writes checkpoints to disk and reports the commit hash.
None of this needs the Build 3/4 CI automation — that stays parked.

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
- **2026-07-09** — R3 Home CLOSED (felt pass in full, v3.187 `c3e869d`; signed out
  AND signed in). Moved R3 Home → Shipped. Re-set **Now**: **R4 Notebook** (heat 18,
  the heaviest open surface) is now the lead next-surface round, beside the
  **data-loss launch cluster** (STEP 4/5) — Now tightened 3→2 as a surface closed.
  Shelf-categories stays in Next; arc-detail stays in Then. Named debt from R3
  (constellation-opacity AA on the light field, Preston-accepted; the unscoped
  signed-out `.empty-state`) recorded in `home.md` and carried to the Then
  craft/backport pass — not a Now move. Autonomous completion + cadence re-order;
  nothing retired, no Preston decision contradicted — so no `PROPOSED:` flag.
- **2026-07-09** — R4 Notebook CLOSED (felt pass in full, v3.188 `8cec854`, deployed)
  and the **master sequence landed** (Preston's directive, this close-out). R4 Notebook
  → Shipped. The round-by-round ad-hoc plan is replaced by the locked continuous program
  in the header above: **R5 Arcs** is the on-deck round (Now); **R6 Sub-theory**, the
  **S-A** sweep, **R7 Book Detail**, and the **FX-1 data-loss fix round** form the near
  program (Next); **R8 Values → R9 Profile/Galaxy → S-B → R10 Connections → R11
  Social-discovery → S-C + debt → the feature layers** form the tail (Then). The
  **data-loss cluster moves out of Now** into its named FX-1 slot (Preston's call, item 6)
  with an interim guardrail (settle-before-edit after sign-in; pull FORWARD if
  second-device use starts). This is Preston-directed, not an autonomous agent re-plan —
  recorded here, not flagged `PROPOSED:`. Notebook residuals R1/R3/R4/R5 recorded in
  `notebook.md`, carried (the `.empty-state` + AA debt fold into S-C). Builder regenerated.

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
- [x] **R3 — Home: Universal v1.2 light skin + covers + alternator/craft** (v3.187,
  `c3e869d`; felt pass PASSED IN FULL 2026-07-09 — signed out AND signed in). Second
  surface round: the Universal light skin (Shelf-exact scoped override, home stays in
  `umberGroundDark`), still-reading covers (H1), mechanical alternator + field label
  (H4), craft contrast lifts (H2/H3/H5), the dead-landing-CSS sweep; the signed-out
  OG1–OG4 + IA4 cluster verified-closed live. Named debt (Preston-accepted):
  constellation-opacity AA on the light field + the unscoped signed-out `.empty-state`
  → a future craft pass. (launch-spine STEP 2)
- [x] **R4 — Notebook: Universal v1.2 light skin + unified composer + per-note chips**
  (v3.188, `8cec854`; felt pass PASSED IN FULL 2026-07-09 — deployed). Third surface
  round: the Universal light skin (scoped `.notebook.lum-amber-deep` re-point, route stays
  in `umberGroundDark`), the composer seam closed (NB1/NB2), the unified labeled `.nb-modes`
  composer with talk-to-Yumi dropped (NB3/WL1), per-note cover chips (decision 3b), the new
  rich empty states, and the deep-teal Yumi resting slot. Named debt carried (R1
  vis-indicator, R3 shared cover registry, R4 global `.empty-state`, R5 Yumi teal).
  `docs/checkpoints/r4-notebook.md` is the record. touches: [notebook]

## Now

- [ ] **R5 — Arcs (DEEP)** — the on-deck surface round and the heaviest open surface now
  that Shelf, Home, and Notebook are closed: list-first entry (arc entry currently opens a
  specific arc), arc-detail's 14 ledger gaps, a real design for the arc read page, and
  **Published/Private replacing Public/Intellectual**. Full five beats: recon → click-forks
  → mockup → felt pass → build → close.
  touches: [arcs, arc-detail]

## Next

- [ ] **R6 — Sub-theory (DEEP)** — the build surface + the immersive published read;
  resolves the notebook-vs-arcs build redundancy.
  touches: [subtheory-build, subtheory-page]
- [ ] **S-A — Sweep: About · Search · "what Yumi sees" (SWEEP)** — token alignment +
  residual gaps across three light surfaces; skips the mockup beat.
  touches: [about, search, yumi-sees]
- [ ] **R7 — Book Detail (DEEP)** — hierarchy, scannability, the buried details.
  touches: [book-detail]
- [ ] **FX-1 — Data-loss (FIX round)** — F-DL1 sync guards on all 5 unguarded
  collections, F-DL2 flush, F-PX1 proxy cap. A named slot per Preston's call. **Interim
  guardrail:** after signing in on any device, let the app settle before editing; pull this
  round FORWARD if second-device use starts.
  touches: [account]

## Then

Per-surface rounds and the fix/feature spine, in program order; each surface round:
**scan → forks → mockup reconstruction → felt pass → staged build → close** (SWEEP rounds
skip the mockup beat). A round closes ONLY on Preston's felt pass. Carried from the launch
spine and the evolution track and folded into the program — nothing dropped.

- [ ] **R8 — Values (DEEP, NEW BUILD)** — the flagship login value-presets + the values
  data layer. Unblocks Profile counts + Connections.
  touches: [onboarding, profile]
- [ ] **R9 — Profile / Galaxy (DEEP, DEPENDS R8)** — the galaxy-only shelf view, toggles +
  counts, luminosity = engagement / size = #books, and the broken profile-link affordances
  fixed.
  touches: [profile]
- [ ] **S-B — Sweep: Import-Capture overlay · Yumi/lens panel · Account residuals (SWEEP)**.
  touches: [import-capture, yumi-panel, account]
- [ ] **R10 — Connections (DEEP EXPLORATION, DEPENDS R8 + R5)** — values × ideas × books ×
  arcs; the unsolved arc-to-arc visualization gets real design exploration.
  touches: [arcs, arc-detail]
- [ ] **R11 — Social-discovery (DEEP)** — commons / reader / walk promoted to their own
  top-level sub-page; includes the deliberate Lane-2 commons-open security decision.
  touches: [commons, reader, walk]
- [ ] **S-C — Sweep + Debt (SWEEP)** — onboarding/intros · signed-out & global empty states
  (clears the carried R3/R4 debt) · AA opacity (`--lum-ink-4` on light) · dead selectors ·
  the parked tasks (task_3c933f62 universal-depth spreads, task_e4cb7af7 reveal a11y, R-b) ·
  the P2 audit findings.
  touches: [onboarding, cross-cutting]
- [ ] **Feature layers** — interleave as prerequisites clear: Yumi generative (eval-gated;
  PREREQ = Preston authors her prompts + rubric) → Yumi-intelligence wake-up · Goodreads
  import · export/backup + Settings · admin/moderation · ambient sounds · beta-tester loop.
  touches: [yumi-panel, import-capture, account]

## Discovered — profile ledger

The seven-item spine the profile / galaxy work surfaced. These are MISSING, not
broken — the studio loop's other instrument (R8 Values + R9 Profile/Galaxy address them):

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
- **Round types.** A DEEP round runs the full five beats (recon → click-forks → mockup
  → build → close); a SWEEP round takes 2–3 light surfaces and skips only the mockup
  beat. Every round closes fully — felt pass → ledger → sequence → BOARD → Builder regen.
- **Read-discipline.** Every Claude Code prompt greps → ranged views (no whole-file
  reads of anything large) and caps its agent fan-out.
- **Live source wins.** Dependencies are declared per round; on any conflict between a
  committed doc and the code, the live source is the truth and the doc is corrected in
  the same commit.
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
