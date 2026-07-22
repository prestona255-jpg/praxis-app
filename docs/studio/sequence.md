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

- **2026-07-21 (SEQUENCE RULING v2 — Preston-DIRECTED, enacted)** — corrected order: design-ready rounds
  build first; THE ARC STANDARD designs in parallel and builds after R-SHELF. **PIPELINE LAW:** design phases
  overlap (chat / briefs / isolated worktrees); build phases **SERIALIZE** — the shared `views.js` / `components.css`
  build lane is **one lane, always**. **Order: FINISH-CHOREO S2 → R-SHELF build → ARC STANDARD build → R-CAPTURE**
  (R-CAPTURE's shaping runs in chat during ARC's build); **S3** (motion dignity) rides where cheapest without
  breaking the lane law. Downstream spine unchanged (→ SCAN → S-B → R10 → ONBOARDING → BETA-READINESS → R11 →
  S-C → feature layers).
  - **S2 = GO** (Preston, 2026-07-21): the S1 corroboration + felt checks landed (his reported verdicts; the OV
    flips ruled), so the standing gate is satisfied. The build lane is S2's until it ships; R-SHELF's build takes
    the lane on Preston's mockup felt-pass; ARC STANDARD's build queues behind R-SHELF.
  - **S2 = BUILT + VERIFIED, committed-local, awaiting push** (2026-07-21): THE THRESHOLD is in a local commit
    (data-write HOLD — pushes on Preston's exact word). Built: the full-screen finishing ceremony (parameterized
    `_pubOverlay` variant, ruling A1) + the public `answeringLine` field (write at the Finish site, ruling B1;
    `updateSubTheory` untouched) + threshold-label replacement + the conditional privacy sweep. Rulings A1/B1
    ruled cold, one at a time. Red-team CLEAR + reviewer PASS after gate fixes; live-rig verified at 390/1360;
    signed-in Firestore round-trip UNVERIFIED (rig signed out — Preston's live-smoke steps in the checkpoint).
    Record: `docs/checkpoints/finish-choreo-s2.md` (+ recon §7b/§7c RULED block). **S3** (dignity + measure) remains.
  - **R-SHELF v3** committed (`docs/studio/r-shelf-brief.md` = the July-17 v3 recovered from the owner's download;
    supersedes the v2 at 3f5df8b; committed under its splice discipline — carry-forward blocks byte-identical to
    v2, NEW/AMENDED authoritative, splice diff-gate PASS). The mockup worktree spawns **off the v3 commit hash**;
    the July-14 CC prompt is superseded. Mockup built 390-first per v3 + Law 8 FELT CANON; Preston's felt read on
    it gates the build.
  - **LOOK batch DISSOLVED into THE ARC STANDARD.** Definitions (verbatim, Preston): **LOOK-1** — writing-surface
    contrast (owner felt finding, July 21, 1360: on the sub-theory build page the writing column sits directly on
    the page ground with no surface of its own — prose, ground, and adjacent panels read as one low-contrast
    plane; the writing surface needs to be a place) → ABSORBED into ARC STANDARD. **LOOK-2** — universal-look
    coherence (owner felt finding, July 21: surfaces across pages don't yet speak one material language; scope
    defined evidence-first at its own Stage-0) → arc-side ABSORBED into ARC STANDARD; **app-wide remainder = its
    own named row** (launch-runway). **THE ARC STANDARD** — deep round, builds after R-SHELF: full north-star
    mockup of the arc interior + sub-theory writing surface at 1360 in THE HOUR world (mockup spec comes from chat
    — do not self-design; do-not-merge branch; second-yes ratification; build-to-mockup, fidelity-gated),
    absorbing LOOK-1, LOOK-2 arc-side, and the arc-Field ledger items (candy glyph palette, pill sprawl,
    dark-panel seam, stray glyph). Its do-not-merge mockup branch is scaffolded now (empty, off the live arc
    surfaces) and holds for Preston's spec.
  - Preston-DIRECTED, not PROPOSED. Standing law unchanged (S2 data-write hold, FORK-VERBATIM, felt-delta,
    owner-viewport). `## Now` order re-set accordingly.
- **2026-07-20 (R-POLISH CLOSE-OUT — Preston-DIRECTED, enacted)** — **trigger: all BP-1v3 batches
  shipped+live (B1→B4 v3.231→v3.236, B-M v3.238); FX-1 add-guard pulled forward + shipped v3.237;
  tab-side felt PASS.** R-POLISH → Shipped. **Now** re-set to the 3 truest next moves —
  **FINISH-CHOREO → R-SHELF → R-CAPTURE** (promoted from ## Next; spine unchanged beyond that:
  → SCAN → S-B → R10 → ONBOARDING → BETA-READINESS → R11 → S-C → feature layers). **FX-1 marked
  PULLED-FORWARD and PARTIAL** at the beta gate: add-guard live, **FX-1c (delete-symmetry) + FX-1b
  (notebook + 5th artifact site) remain before the give**. New close-out artifact:
  `docs/launch-runway.md` (the runway view + carried-debt ledger + OV-1/OV-2 open-verify), rendered
  as the Builder's LAUNCH RUNWAY panel in this close's single regen. Three B-M residuals (R-a/R-b/R-c)
  await Preston's ruling in that ledger before the close-out commit. Nothing dropped.
- **2026-07-18 (R-ARC CLOSE-OUT — Preston-DIRECTED, enacted)** — **trigger: Wave C complete, Slice 9
  the raised-hand seat PUSHED+LIVE v3.229 (`5df9d00`, deployed smoke FULL PASS).** Spine enacted: R-ARC
  → build-complete/SHIPPED (formal close pends Preston's felt look on the v3.229 seat). **Now = R-POLISH**
  (5 lanes, Fable opens/Opus builds), promoted ahead of SCAN/R-SHELF (control canon precedes control-heavy
  rounds). Next canonical order set: R-POLISH → FINISH-CHOREO → R-SHELF → R-CAPTURE → SCAN → S-B → R10 →
  ONBOARDING → BETA-READINESS gate → R11 → S-C → feature layers. ON-8 + RD-6 fold into R-POLISH L5;
  DW-NAV768/HOME-LAMP/ON-7/2560-sag/page-scrollbar into L1; Book-Detail ✎ re-wire candidate in L2; RD-1
  widened in L3. Slice-8 cross-device Firestore leg + RM-SPLAT + DISMISS-UNIFY logged to the BETA gate.
  Directed by Preston, not proposed.
- **2026-07-18 (R-ARC ROOM-3 felt verdict — Preston-DIRECTED)** — **trigger: ROOM-3 FUNCTIONAL
  PASS** (v3.227 `62ab1c4`). No spine change applied YET (Wave C continues: Slice 8 → 9 → close).
  **DIRECTED, not PROPOSED (Preston's ruling this session):** a NEW pre-launch round **R-POLISH** is
  created and will slot **TOP of Next at the close-out re-plan, AHEAD of SCAN/R-SHELF** (the control
  canon must precede control-heavy rounds). Five lanes: **L1** XL-tier occupancy canon ≥~1600
  (designed at 1920 + per-page passes; absorbs the 2560-sag / P-A) · **L2** control canon (ruled
  control dialect + app-wide sweep; P-B) · **L3** RD-1 glyph slice WIDENED to arc-panel + Home
  thumbnails + workshop glyph (P-C; RD-1's ground work rides here) · **L4** drag choreography
  (lift/settle; P-E) · **L5** Yumi caption-family removal, all 3 strings (P-D — **absorbs ON-8**,
  now retired as standalone). Opens Fable-design, builds Opus. Evidence: Preston's three 1920px
  screenshots. FINISH-CHOREO + R-CAPTURE + RD-1(→L3) remain carried to the same close-out re-plan.
- **2026-07-17 (R-ARC FF-7 close-out prep)** — **trigger: the FF-7 vocabulary rider shipped+live**
  (`8a20bf8`, v3.220), the last build slice of R-ARC Wave B. **No spine change** — R-ARC stays the single
  `## Now` item (it does not close until Preston's felt pass on S5's dissolve + FF-7). Refresh only, within
  Now: the round doc `r-arc.md` brought current with the full S1→FF-7 slice ledger; the Now item's status
  line updated. **Carried, not applied:** (a) the per-surface studio-census re-measure across the five
  touched surfaces is the **deferred backlog** (it needs the felt pass — recorded as a Round-history pointer
  on each surface, not fabricated now); (b) **FORMING-REACH** — FF-7's recon found **four** maturity ramps,
  not three; the three non-lifecycle ramps + the FROZEN `arc-constellation.js:1433` ramp are held as a named
  residual, the frozen-file member routed into **3B-MOTE's** authorized single frozen edit (Preston's routing
  ruling, 2026-07-17); (c) **§C Yumi corner-tag** vocabulary deferred to **Wave C's** raised-hand seat (F4
  removed its live targets — a NO-OP for FF-7). (d) **PROCESS RIDER (Preston 2026-07-17):** declared byte
  bands now carry TWO figures — a CODE band (hard) + a COMMENT allowance (soft, clears by classification);
  canonical codification landed in FIX-PROTOCOL §3 (its own follow-on config commit).
- **2026-07-15 (DW WAVE CLOSE)** — **trigger: the Desktop Wave closed** (DW-POLISH v3.209 `2e25c23`
  + DWF-1 v3.210 `d3a96df`, both pushed, live and felt-passed). Four spine writes, each on a
  Preston ruling, none autonomous:
  (a) **DW → Shipped**, closed on the **"0 stretched" exemption ruling** (granted at DW-4; wording
  lands here per his instruction) rather than on a literal zero — the 5 uncomposable chips
  (`book-marks`/`account` dead routes; `yumi-panel`/`import-capture`/`spotlight` overlays) take a
  one-time ledger-recorded D1 exemption under the canon's own clause. **DW-WALK-FIX / DW-SEARCH-FIX
  remain open and still block a literal zero — the wave closes on the ruling, knowingly.**
  (b) **Now = R-ARC, single item** — Preston's ruling of **2026-07-14**. Corroborated by the slot
  `r-arc.md` was written to await ("slot at the next re-plan"); this close is that re-plan.
  (c) **SCAN and R-SHELF each slide back one slot**; SCAN still precedes R-SHELF, whose brief it
  exists to draft. **ARC-FIELD** moved Now→Next (Now is R-ARC alone) and flagged as an R-ARC-adjacent
  fold candidate — named, **not merged**: that would be a spine call, and it is Preston's.
  (d) **Book Detail chip → `native`** — granted 2026-07-15 on the deployed v3.210 felt pass. The
  first surface in the program to earn `native` through the polish tier.
- **2026-07-15 (DW-POLISH · Book Detail)** — the POLISH TIER opened and its premise proved on the
  first surface. No reordering of the spine: this executed Preston's felt-diagnosis work order on a
  surface already in the program. Findings recorded, none applied as a silent re-plan:
  (a) **The program lesson is now evidence, not a hunch:** *composed ≠ designed — widen-within
  ceilings on content-rich detail pages; the polish tier exists for them.* DW-3 passed **every**
  D-gate (D1 63.0% ≥60 · D2 70.8ch ≤72 · D3 0 · D4 22/22 · D5 16px) and the page still read as
  three stacks — because every D-gate is HORIZONTAL and the defects were vertical and structural
  (a 195px hole; the thinking capped at 28.5% with the ISBN beside it as a peer). **`rig.hollow`
  is the only gate that saw it.** Consider whether the canon should carry a vertical gate
  (a "D7 — vertical rhythm") rather than relying on a rig helper — that is a canon change and is
  **Preston's call**, so it is written here, not applied.
  (b) **`PROPOSED:` — the DW sweep's chip vocabulary has no rung for this.** Chip law is
  `stretched → composed → native`, and DW-3 earned `composed` honestly on the gates. DW-POLISH did
  not raise the chip (under-claim law: `native` awaits the deployed felt pass), but the sweep now
  has surfaces that are *gate-passing and undesigned* with no way to say so on the board. If the
  polish tier runs on more surfaces, the vocabulary needs a rung or the chip needs re-defining.
  Program-level; **not taken here**.
  (c) **`DW-BOARD-BACKFILL` still open** — DW-POLISH updated Book Detail's own BOARD row (its own
  measurement); DW-2/DW-STP2's rows remain unbackfilled by the batches that measured them.
  (d) **CLAUDE.md §4-I's desktop clause marked STALE** (Preston's ruling) — it described an
  arrangement never built, and the desktop canon has no §4-I at all. Mobile clause stands.
- **2026-07-14 (DW-4)** — batch shipped-local (artifact + yumi-sees → `composed`). No reordering:
  DW-4 executed the next batch of an item already in **Now**. Three findings recorded, none applied
  as a silent re-plan:
  (a) **Rider scope widened on evidence, within the rider's own explicit scope.** DW-RING-RADIUS was
  ruled as "remove the `border-radius:6px` declaration from EVERY DW focus-ring block (DW-1/2/3 +
  STP2)". The ledger's premise that the literal is "reused verbatim across every DW D6 block" is
  **false** — there are three literals (DW-1 **4px**, DW-3/STP2 **6px**, DW-2 **8px**), so the "6px"
  wording named only 3 of 6 blocks while the rider's SCOPE named all four batches. Executed the
  stated intent ("it is not part of a ring" — value-independent) across all six; the literal
  reading would have left **7 of 19 deformations** live under a different number. Not a spine change:
  the rider's own scope, honoured.
  (b) **`PROPOSED:` — the DW sweep's "0 stretched" exit criterion is unreachable as written.** 5 of
  the 13 remaining chips can never be composed (2 dead routes: `book-marks`, `account`; 3 overlays:
  `yumi-panel`, `import-capture`, `spotlight`). They need a one-time **ledger-recorded D1 exemption**
  — the canon's own clause — not a build. DW-4 did **not** take that ruling; it is program-level and
  belongs to Preston. Until it is made, the sweep cannot report "done" honestly.
  (c) **`DW-BOARD-BACKFILL` named** — BOARD.md records only DW-1; DW-2/DW-3/DW-STP2 never updated
  their rows despite the file's binding maintenance rule. DW-4 added its own two and left the other
  five to the batches that measured them (pre-existing-drift rail).
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
- **2026-07-10** — R5 Arcs CLOSED (felt pass in full, v3.189 `27b4878`, deployed) and the **GROUND
  SPECTRUM canonized** (CLAUDE.md §7 — light list → warm-dim interior → deep-warm field stage →
  full-amber visitor room; the field-stage carve-out is PART OF the spectrum, resolving the mockup's
  `PROPOSED:` note). R5 Arcs → Shipped (both `#arcs` + `#arc/<id>`). Re-set **Now** to **R6
  Sub-theory** (the lead next-surface round; inherits R5's single-register model + the full-amber
  reading-room end of the spectrum). Added a NAMED SLOT to Next — the **arc-field mobile touch
  model** (held from R5, non-negotiable, a visible line not a residual). The **OVERNIGHT/INTAKE
  Stage 1a scope is now UNBLOCKED** (Preston's timing rule: it opens after R5 closes). Named R5 debt
  (dead CSS, warm `--ink-3`/`--lum-ink-3` AA, arc-voice box, latent constellation focus-ring) folds
  into the S-C sweep. Preston-directed close + cadence re-order; nothing retired, no Preston decision
  contradicted — no `PROPOSED:` flag. Builder regenerated.
- **2026-07-10** — R6 Sub-theory CLOSED (felt pass **FULL PASS**, v3.190 `4c8f73e`, deployed + live-
  verified). Both sub-theory surfaces (`#subtheory/<id>` read + `#subtheory/<id>/build` workshop) rebuilt
  and closed — the notebook births / the workshop writes / the Page reads. Felt-pass rulings: warm-dim
  CONTAINED working panel = DECIDED (not debt); cyan pill-flag dot KEPT; warm-dim ink-ramp = carried named
  debt. R6 Sub-theory → Shipped. **PROMOTED R7 Book Detail ahead of the S-A sweep (Preston's call,
  2026-07-10)** — Now re-set to **R7 Book Detail**; S-A follows R7. Preston-directed re-order (not
  autonomous) — recorded here, not flagged `PROPOSED:`. Named R6 debt (R6-OWN ownership → R9; R6-INK
  warm-dim ink-ramp → systemic) recorded in `subtheory-page.md`; sub-theory surfaces marked mobile-eligible.
  Builder regenerated.
- **2026-07-10** — R7 Book Detail CLOSED (SHIPPED v3.191 `bff5d82`, Preston's deployed felt pass =
  PASS). R7 Book Detail → Shipped. The **MOBILE WAVE lands as the program's next stretch** (the
  studio-side mobile canon `praxis-mobile-canon.md` + Builder chips + the overnight queue landed on
  main via `1ac1536` / `a246e4a`): **Now = MW-1** (Shelf + Home mobile pass, canon P1–P9); **Next =
  MW-2** (Notebook + Arcs) · **MW-3** (Sub-theory + Book Detail) · then **S-A**. Everything downstream
  (the arc-field touch model, FX-1, R8 Values, R9 Profile…) shifts intact — nothing else reordered or
  reworded. Book Detail shipped the BD2 4-I `order` reorder in R7; its full mobile-canon pass is MW-3
  (no `mobile:` chip claimed on the ledger). Preston-directed cadence (the mobile wave is the next
  stretch); nothing retired, no Preston decision contradicted — no `PROPOSED:` flag. Builder regenerated.
- **2026-07-10** — MW-1 Shelf + Home mobile pass SHIPPED-LOCAL (`a405730` shelf + `e5ab754` home; NOT
  pushed). Both surfaces passed both build gates (praxis-reviewer CLEARED ×2; fix-red-team found +
  fixed one blocker — the back-nav scroll-lock leak). MW-1 → Shipped; **Now advanced to MW-2**
  (Notebook + Arcs), promoted from Next per the locked mobile-wave order. Shelf + Home ledger chips
  ruled `mobile: native` on both-layer evidence. ON-2 (overnight) closed — absorbed by MW-1 as the P1
  reference implementation. Downstream order unchanged (MW-3 · S-A · then the Then stretch). Pure
  program advance on completed work — nothing retired, no Preston decision touched — no `PROPOSED:`
  flag. Round-CLOSE (felt pass + push) remains Preston's; Builder regenerated. Report:
  `docs/studio/reports/mw1-2026-07-10.md`.
- **2026-07-11** — MW-1 PUSHED + live (`0f661f3`, sw.js v3.192, Preston). MW-2 Notebook + Arcs
  mobile pass SHIPPED-LOCAL (`bd5c4c5` notebook + `900aa4f` arcs; NOT pushed). Both surfaces passed
  both build gates (praxis-reviewer CLEARED ×2; fix-red-team N/A — CSS-only, no JS/state; one cosmetic
  `.btn` display residual the Arcs reviewer named was resolved in-stage). MW-2 → Shipped; **Now advanced
  to MW-3** (Sub-theory + Book Detail — the last mobile-wave pass), promoted from Next per the locked
  order. notebook + arcs + arc-detail ledger chips ruled `mobile: native` on both-layer evidence. Both
  surfaces were already largely mobile-clean (Notebook: only P7 input floors; Arcs: only arc-detail P3
  hit areas) — no structural work needed, unlike MW-1's Manage sheet. Downstream order unchanged
  (S-A · then the Then stretch). Pure program advance on completed work — nothing retired, no Preston
  decision touched — no `PROPOSED:` flag. Round-CLOSE remains Preston's; Builder regenerated. Report:
  `docs/studio/reports/mw2-2026-07-11.md`.
- **2026-07-11** — MW-3 Sub-theory + Book Detail mobile pass SHIPPED-LOCAL (`99f7fb0` sub-theory +
  `5dd7cee` book detail; NOT pushed). **THE MOBILE WAVE IS COMPLETE** — MW-1/MW-2/MW-3, 8 surface
  chips all `mobile: native`. MW-3 was the heaviest of the three: unlike MW-2's already-clean
  surfaces, both MW-3 halves carried a real P8 h-scroll to fix — the Sub-theory FINISHED room's
  author topbar (~130px overflow) and Book Detail's missing `box-sizing:border-box` (the one surface
  omitting it) + the read-status segment overflow. Both build gates cleared (praxis-reviewer PASS ×2;
  the Book Detail reviewer HOLD on the rating-star tap targets was fixed 44×44 and re-confirmed;
  fix-red-team N/A — CSS-only). MW-3 → Shipped; **Now advanced to S-A** (About · Search · what-Yumi-
  sees), promoted from Next per the locked order. One desktop residual carried (MW3-BKBOX — the base
  `.bk-surface` content-box also h-scrolls at desktop; out of the mobile wave's scope, its own felt-
  gate). Promoted the held **ARC-FIELD MOBILE TOUCH MODEL** one tier (Then→Next) — with the eight
  page-surfaces now mobile-native, the constellation's drag/connect touch model is the truest
  remaining mobile line. Pure program advance on completed work — nothing retired, no Preston decision
  touched — no `PROPOSED:` flag. Round-CLOSE (felt pass) remains Preston's; Builder regenerated.
  Report: `docs/studio/reports/mw3-2026-07-11.md`.
- **2026-07-11** — R8 Values CLOSED (DEEP, SHIPPED v3.195 `37ea1f0`; the round's live 5-step smoke on
  `prestonpraxistest` PASSED IN FULL — incl. the load-bearing Firestore round-trip; Preston's deployed felt
  pass pending). R8 → Shipped. **Re-plan (Preston-directed, pre-aligned July 11):** **R9 Profile/Galaxy lands
  as Now** with a LOCKED shape — **R9a = the MERGED single Profile** (Account collapses to a settings + "Your
  data" section; `#account` redirects; instrument DNA carried), organized by **OWNER-vs-VISITOR**: the owner
  opens on the INSTRUMENT (evidence-weighted value-load, a Now strip, gaps-as-questions; the galaxy one tap
  away); the visitor opens on the PORTRAIT (galaxy leading — stars = sub-theories, planets = fields; a values
  statement; published work). Galaxy = **tap-first + sparse-honest**; **value-load is EVIDENCE-WEIGHTED** per
  the R8 evidence rule, never raw tallies. **R9b (Next)** = arc cards, a lineage row, destination cross-links.
  **Precondition (in the R9 entry):** Preston runs the Yumi value-retrofit on his REAL library before the R9
  felt pass, so the galaxy has fuel. **S-A** (About·Search·yumi-sees), bumped from Now when R8 jumped ahead,
  returns to Next beside the arc-field mobile touch model; **FX-1 stays parked** (re-raise trigger unchanged).
  Preston-directed close + pre-agreed re-plan (record, don't redesign) — recorded, not flagged `PROPOSED:`.
  Records: `docs/checkpoints/r8-values*.md`, `r8-redteam.md`, `r8-reviewer.md`. Builder regenerated.
- **2026-07-12** — **R9a Profile / Galaxy CLOSED** (deployed felt pass = STRONG PASS; shipped v3.198
  `e25ac6f` + patch v3.199 `6e96d5b`; live smoke on `prestonpraxistest` PASSED IN FULL). Moved R9 → Shipped.
  **Re-plan:** **R9b promoted to Now** as two lanes one round (Lane P page ships first, then Lane G galaxy —
  its own five-beat, fully display-only); **DW-1..3 Desktop Wave pinned to Now** (R9a delivered the project's
  first ≥1200 tier); ARC-FIELD-MOBILE stays Now; **S-A sweep + the overnight batch re-slotted to Next**;
  **R10's lens item rewritten** — retire-lenses PRE-ANSWERED = KEEP (Preston re-opened AM45 + the sky-lens
  deferral, investing in lenses), R10 = confirm+consolidate the three consumers only. Autonomous
  within-Now/Next re-order on the felt pass; the R10 lens-direction change is a **Preston decision** (recorded,
  not `PROPOSED:`).
  **DELIBERATE REVERSALS (round ledger, one line each):** (1) **Numbers pulled forward** into R9a — AM11
  reversing the Q7-B defer; (2) **lens axis restored** — AM44; (3) **"arcs" replaced "passages"** as the 3rd
  stat (no distinct passages store in the data); (4) **Published re-homed** to the full-width closing band —
  AM41 superseding AM16 × AM27; (5) **the thesis rendered UNCARDED** — AM29, the one named AM10 containment
  exception; (6) **AM45 lenses gold-only + the R10 sky-lens deferral RE-OPENED** by name (now R9b Lane G).
  **LESSONS:** **PROOF-SCOPE** — a verification assertion must restate the FULL mandate, never a subset it
  can pass (the shipped AM47/AM38 proof measured text-vs-text + overflow only; a star sat on a label live at
  ultrawide). **FIXTURE-SHAPE** — the DNA-carry data-shape bugs shipped because the 42-book verification
  fixture never carried live-shaped threads/journey/returns data; every carried builder needs a
  live-shaped fixture. (Both also in `docs/checkpoints/r9a-build.md`.)
  **NAMED DEBT:** ~2060 L defined-but-unrouted old renderers (S-B deletion task) · tokenize the shared
  light-skin literals app-wide (S-B; 3 surfaces share them) · teal reader-model toggle re-skin (Lane G) ·
  curated published ordering (future data session) · the duplicate-lens DATA records surfaced by P3
  (display-deduped only — future data-hygiene, DEL-1 adjacent).
  **FX-1 — DECIDED (Preston, 2026-07-12):** converted from soft park to a **HARD DEPENDENCY** — a named
  prerequisite of **R11 / first-beta-tester** (no outside account is EVER invited before FX-1 ships), and it
  **jumps immediately on any data-loss scare**. R9b proceeds now. (The R9 close was the named re-raise
  trigger; the guard held — R9a shipped ZERO new synced collections — but the parked status is retired: FX-1
  is now a gate, not a maybe.)
  **BUILDER-1c gate:** no Builder-1c commit present at this close → **NAMED FALLBACK** recorded — one extra
  Builder regen after 1c lands (this close's regen does not wait).
- **2026-07-13** — **R9b Profile / Galaxy CLOSED** (Lane P v3.200 + Lane G v3.201 + the felt-pass patch v3.202
  `e73e994`; **deployed re-pass = FULL PASS**). R9b → Shipped. **Re-plan (Preston-directed, this close-out) —
  the locked NEW MASTER SEQUENCE:** DW-1/2/3 (folded around S-A) → **SCAN round** (new) → **R-SHELF** (new deep
  round) → S-B sweep + dead-code deletion → R10 Connections (lens = KEEP, pre-answered) → **ONBOARDING** round
  (W9) → **BETA-READINESS gate** (FX-1 · Goodreads import · export/backup + Settings · admin interim · commons
  `#reader` fencing debt) → R11 Social-discovery → S-C + debt → feature layers. **Rationale per reorder (one
  line each):** *SCAN promoted* — the studio audit instrument re-enters the steady state before the next deep
  round now that the mobile/desktop/profile spine is built; *R-SHELF added (new deep round)* — the Shelf is the
  most-used surface and predates the R5–R9 Universal maturity, so it earns a full re-round; *S-B paired with the
  ~2060-L dead-renderer deletion* (R9a debt now has cause to run); *ONBOARDING promoted to its own round* — the
  W9 intro system needs a dedicated pass before beta (was folded in feature layers); *BETA-READINESS named as a
  GATE* collecting FX-1 (the hard R11 prereq, unchanged) + the launch-blockers so R11 can't invite an outside
  account until it clears; *R11 stays gated on FX-1* (no re-raise). Autonomous re-order WITHIN the program on the
  felt pass + Preston's close direction; nothing retired, no Preston decision contradicted — **no `PROPOSED:`
  flag.** ARC-FIELD-MOBILE carried (still a named Now slot). **DECISIONS recorded:** *P1 curated category→wheel
  hue map* (Preston chose proposal A — separates the two grey-blues: slate=Technology & Society, steel=Religion &
  Spirituality) · the *v3.201 wheel amendment* (diverse muted full-spectrum) · *R10 lens = KEEP* (pre-answered).
  Builder regenerated.
- **2026-07-14 (DW-STP2)** — the `subtheory-page` **D2** gap that DW-3 named and deferred
  (`be050e5`) closed **standalone** (Preston ruled: standalone, own bump → v3.207): a `≤72ch` cap on
  the read prose at `≥1200`, **plus the surface's missing D6 focus rings** (see the correction
  below). `subtheory-page` → **`desktop: composed`**, so the DW chip census moves **+1** beyond
  DW-3's three (book-detail, subtheory-build, profile) → **four surfaces flipped across DW-3 +
  DW-STP2**. The rig reproduced DW-3's `825px / 86.4ch` **exactly** before the fix; after,
  **D1–D6 all hold at 1280 / 1440 / 1920** (D2 72.0ch, D6 11/11) with **D1 occupancy unchanged** —
  the cap cost nothing. Walk + search remain the tracked rig-gap blockers on the sweep's "0
  stretched" exit; the 760-1199 ON-7 band still sits with its overnight owner. Autonomous — a named
  gap closed on its own evidence; nothing retired, no launch-spine change, no Preston decision
  contradicted — **no `PROPOSED:` flag**.
- **2026-07-14 — DW-STP2's two pre-commit catches (recorded because the reasoning, not the code, was
  the defect).** Both gates fired and both were right; the build shipped neither of its first two
  answers.
  **(1) `fix-red-team` BLOCK — CSS bleed onto a signed-out path.** The cap's first cut was an
  unscoped descendant selector, `.st-page.lum-amber-deep .subtheory-readonly-body`. But
  `renderSubTheoryReadOnly` mounts on **two** paths, and the build had *measured the second one's
  before-state and then declared it out of scope while its own rule mutated it*. Live at 1280 the
  unscoped rule stranded a **687px column at x=0 beneath a still-full-bleed 1264.7px header** on the
  **signed-out** worked example. Fixed by scoping the cap to `.st-grid` (the *cause* of the 825px
  column). Same class as DW-2's signed-out ≥1200 BLOCK — **twice now, a DW cap has leaked onto a
  signed-out branch; the signed-out render is not an edge case in this program, it is a second
  render path and belongs in every DW gate set.** The branch itself is filed as **DW-STP2-SEED**.
  **(2) `praxis-reviewer` HOLD — a false-consistency argument.** The build first filed the surface's
  D6 gap (1/11 controls ringed; the PRIMARY `.st-pill-publish` bare) as `PROPOSED: — not fixed`,
  reasoning that DW-3 scored D6 by *sampled presence* and that book-detail + subtheory-build carried
  `composed` on that same loose rubric, so tightening it would retroactively unseat ratified chips.
  **The reviewer checked the premise and it was false.** DW-3 did not score loosely — it **BUILT**
  the rings: **27 `:focus-visible` rules across `1e0dc18..f15fb2a`** (book-detail `:11072-11079` in
  `03ecb9d`, sub-theory build `:11538+` in `939eb73`). subtheory-page received a docs-only
  spot-check and zero CSS. Consistency therefore demanded **adding** the rings; skipping them would
  have shipped `composed` on a weaker standard than the very surfaces cited as precedent — the Chip
  law's "by assertion" wearing a consistency argument as cover. Rings added (DW-3 literal verbatim)
  → **D6 11/11**. **No rubric change was needed and none was made; the `PROPOSED:` item is
  withdrawn, not carried.** Lesson for the sweep: *"consistent with the siblings" is a claim about
  the siblings — go read what they actually shipped before leaning on it.*

## Shipped

- [x] **R-POLISH — the pre-launch polish round (v3.231→v3.238)** — the pre-launch craft
  pass, run as BP-1v3 batches. **Slice-0** kit + proofs → **B1/B1-FIX** THE HOUR (v3.231/232)
  → **B2** the arc cluster (v3.233) → **B3** AES enforcement (v3.234; AES-1/2/5a + `--m1` rider,
  AES-3 arc-head→kit, AES-4 styled-native select, AES-5b plate-frame, the ✎ MARG-EDIT re-wire,
  Book-Detail XL, Profile dawn seam) → **B4/B4-FIX** About + Arcs index + light pages (v3.235/236;
  STN-A11Y, ME-1 measurement covenant, exemplar-card fix, XL composition, the 1360-viewport measure
  fix + SW scheme guard) → **B-M** the mobile app-feel batch (v3.238; Bloom + Shelf-select-bar
  safe-area, ≤759 body-margin, tap-highlight, overscroll-contain, momentum ×2, maskable icon).
  **FX-1 add-guard pulled forward mid-round (v3.237)** — the incoming-wipe guard for
  arcs/subTheories/themes/artifacts, headless-proven (42/42 + independent 15/15). 3 felt canon laws
  + FORK-VERBATIM ratified into CLAUDE.md. Runway + carried-debt ledger: `docs/launch-runway.md`.
  Tab-side felt PASS; OV-1/OV-2 OPEN-VERIFY. Records: `docs/checkpoints/r-polish-*.md`, `b-m.md`, `fx1.md`.

- [x] **R-ARC — knowledge-arc theorizing system (DEEP round, v3.211→v3.229)** — the capture → marginalia
  → sub-theory → arc → theorize → publish loop, rebuilt as one intelligent structure. **Wave A/B:** S1→S5
  + F4 covenant removal + FF-7 vocab rider (v3.211→v3.220), felt PASS. **Wave C:** S6a spike · S6b/S6c/RAIL ·
  ROOM charter + ROOM-1/S7/ROOM-2/ROOM-3 (v3.221→v3.227, functional PASS) · **Slice 8 the dismissal store
  (v3.228, `998bc46`)** · **Slice 9 the raised-hand seat (v3.229, `5df9d00`)** + the D14 drift reconcile
  (`a0a067d`). **Push ledger (Slice 9 close):** `f5b4c47..5df9d00 main -> main`, v3.229 live (×2 cache-busted);
  deployed seat battery FULL PASS + Slice-8 flip-not-delete verified live. Ledger: `docs/studio/r-arc.md`.
  **FORMAL CLOSE = Preston's felt look on the v3.229 seat** (the one outstanding gate). Follow-ons to the BETA
  gate: Slice-8 cross-device Firestore leg · RM-SPLAT · DISMISS-UNIFY. Deferred into R-POLISH: RD-6 (L5), RM6,
  RD-1 (L3), FINISH-CHOREO (own slice).
- [x] **DW — Desktop Wave (FULL SWEEP, batches DW-1..4 + DW-STP2 + DW-POLISH + DWF-1)** — the responsive ≥1200 composition tier across the
  page-surfaces. **Exit criterion: 0 of the Builder's desktop chips at "stretched."** R9a shipped the project's
  first ≥1200 tier, R9b proved the composition rider live, **Profile is already native**. One commit per batch;
  About + Arcs first (D0's two worst). **Exempt — round-owned, their chips flip with their round, NOT the sweep:**
  Shelf → **R-SHELF** · Scan → **SCAN** · Connections → **R10** · Onboarding → its round · commons + reader → **R11**.
  **Walk IS swept.** The **S-A content sweep** (About · Search · what-Yumi-sees) folds in but owns copy/content,
  not composition. Re-seed target **ON-7** (Book Detail `.bk-surface` desktop h-scroll, pre-existing) rides a
  batch or overnight. **DW-1 SHIPPED-LOCAL — About + Arcs → composed, + a scoped ≥760 body-margin reset.**
  **DW-2 SHIPPED-LOCAL — Home + Notebook → composed** (H-A two-region + Still-Reading rail · N-A
  widened spread ~1360; both chips `composed`, native awaits the deployed felt pass).
  **DW-3 SHIPPED-LOCAL — Book-detail + Sub-theory-build → composed** (self-selected: the two worst
  *reproducible* stretched surfaces — book-detail content|rail grid + subtheory-build contained-panel
  widen). **Preston's DW-3 supervision riders (2026-07-14):** (a) **ON-7 released to this batch, ≥1200
  ONLY** — `.bk-surface{box-sizing:border-box}` in the book-detail ≥1200 block (D3 now passes honestly);
  the **760-1199 band residual is re-scoped in `overnight.md`** (its own owner). (b) **Chip-truth riders
  (docs):** `profile → native` (drift fix — sequence said native, frontmatter lacked it); **subtheory-page
  spot-checked reproduce-first — D1/D3/D4/D6 PASS but D2 FAILS** (`.subtheory-readonly-body` 86.4ch,
  uncapped) → NOT flipped to composed (Preston's condition was "if they pass"); the D2 cap is a named gap
  (`subtheory-page.md` DW-STP2). Chip census changes by **THREE** this run (book-detail, subtheory-build,
  profile), not four. rr-row +2 (Round Records only for the two built). (c) **walk + search excluded =
  RIG-GAP named tasks** (below), so the sweep's exit criterion tracks them. Both built chips `composed`,
  native awaits the deployed felt pass.
  **DW-4 SHIPPED-LOCAL — artifact + what-Yumi-sees → composed** (v3.208; `6554e9a..de6c13b`, 4 build
  commits + docs). Self-selected reproduce-first: artifact **37.5% occ @1920** (the worst D1 of the whole
  wave, below DW-3's book-detail at 42.9%) → editorial spread, **60.8%**, essay **83.9ch → 72.0ch**;
  yumi-sees framing prose **138.3ch** (the worst D2 of the wave — past D0's own reference violation, Arcs
  at 137ch) → ledger column + framing rail, **51ch**, occ 56.7% → **63.4%**. Chips +2, rr-rows +2 (6→8),
  both `composed` (native awaits the deployed felt pass). **Both ruled riders CLOSED:** DW-RING-RADIUS
  (all six DW blocks — see the re-plan note below) and DW-STP2-SEED (seed read given a centred 747px
  column, 72ch; ground kept full-bleed; composed path provably unreached).
  **THE BATCH WAS 2, AND THAT IS THE COMPLETE REMAINDER** — after the exempt, rig-gapped, dead-route and
  overlay sets, artifact + yumi-sees were the only live, non-exempt, unshipped page surfaces left at
  `stretched`. **arc-detail is EXEMPT** — the exempt set's "Connections" resolves to **R10**
  (`:387`), whose own entry declares `touches: [arcs, arc-detail]`.
  **⚠ THE SWEEP'S "0 STRETCHED" EXIT CRITERION CANNOT BE MET BY COMPOSITION ALONE — a call for Preston.**
  13 chips still read `stretched`, and **5 of them can never be composed**: `book-marks` and `account` are
  **DEAD ROUTES** (R7 retired `#book/<id>/marks` → `location.replace`, `views.js:520-528`; `#account`
  merged → `#profile`, `:645` — neither renders anything to compose), and `yumi-panel`,
  `import-capture`, `spotlight` are **overlays, not page-surfaces** (`route: "overlay"`), whose right form
  IS a contained dialog. Each needs a **ledger-recorded D1 exemption** (the canon's own clause) rather than
  a build. The remaining 8 are the exempt round-owned set (books · onboarding · commons · reader ·
  arc-detail) + the rig-gapped pair (walk · search) + `scan`. **So the honest exit is: DW-WALK-FIX +
  DW-SEARCH-FIX built, the round-owned chips flipped by their rounds, and a one-time exemption ruling for
  the 5 uncomposable.** DW-4 did not take that ruling unilaterally — it is program-level.
  **DW rig-gap named tasks (tracked, not stranded — needed before the sweep's "0 stretched" exit):**
  **DW-WALK-FIX** = walk (`renderInteract`) needs a *published-arc fixture* (renders only "Opening the arc…"
  async in the no-network rig); **DW-SEARCH-FIX** = search (`renderSearch`) needs a *query-injection
  harness* (only the empty-query state is reproducible; results state can't be populated). Until these land,
  walk + search cannot be composed+gated; they remain `stretched` and BLOCK the sweep exit knowingly.
  **DW-POLISH SHIPPED + LIVE — Book Detail, the POLISH TIER's first surface** (v3.209, `2e25c23`).
  The tier's premise proved: DW-3 passed **every** D-gate and the page still read as three stacks,
  because every D-gate is horizontal and the defects were vertical + structural. `rig.hollow` rail
  **195/14/14 (HOLE) → 16/16/16 uniform** on DEFAULT data; "In your thinking" **542px/28.5% →
  816px/42.8%**; edges align (measured). **D1 UNCHANGED at 63.0% — it was never the failing gate.**
  Residual **DWP-RAIL-INVERT ruled OPTION A** (ship as built; the void mode inverts rather than dying
  — reproduced at 9+ value-marks on an empty book; cure is a col-1 wrapper, deferred).
  **DWF-1 SHIPPED + LIVE — the marginalia pencil resolved as decoration** (v3.210, `d3a96df`).
  Preston's felt pass read the per-card ✎ as an edit control; diagnosis proved it was **never wired**
  and that the restructure did not break it. Glyph removed; **MARG-EDIT** named (see `book-detail.md`).
  Created the standing **INTERACTIVE-CONTROL SWEEP** gate (CLAUDE.md).
  **⚖ THE "0 STRETCHED" EXIT CRITERION — RULED (Preston, granted at DW-4; wording lands here).**
  The criterion **cannot be met by composition alone**, and is hereby closed by a **one-time
  ledger-recorded D1 exemption** for the five chips that can never be composed (source: the DW-4
  record, `docs/checkpoints/dw-4.md:385-386`; the canon's own clause, `praxis-desktop-canon.md`
  D1: *"or the surface carries a ledger-recorded exemption naming why a governed single column is
  the right form for it"*):
  | chip | why it can never be composed |
  |---|---|
  | `book-marks` | **DEAD ROUTE** — R7 retired `#book/<id>/marks` → `location.replace` (`views.js:520-528`); renders nothing to compose |
  | `account` | **DEAD ROUTE** — merged → `#profile` (`views.js:645`); renders nothing to compose |
  | `yumi-panel` | **OVERLAY**, not a page-surface (`route: "overlay"`) — its right form IS a contained dialog |
  | `import-capture` | **OVERLAY** — as above |
  | `spotlight` | **OVERLAY** — as above |
  **The honest exit, therefore:** the exemption above + the round-owned chips flipping with their
  rounds + **DW-WALK-FIX / DW-SEARCH-FIX** (the rig-gapped pair below, still open and still
  knowingly blocking a literal "0 stretched"). The wave closes on this ruling, not on those two.
  touches: [home, books, arcs, notebook, profile, book-detail, about, search, yumi-sees, walk, subtheory-page, subtheory-build]

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
- [x] **R5 — Arcs: grounds + read spine + register collapse + publication (DEEP)** (v3.189,
  `27b4878`; felt pass PASSED IN FULL 2026-07-10 — deployed). Fourth surface round, covering BOTH
  `#arcs` (list) and `#arc/<id>` (interior). Seven commits (`f4be5c2 → 27b4878`, mockup `f4be5c2`):
  S1 fix slate `1da97e3` · S2 grounds+D4 `a4ad4d2` · S3 read spine `f6563bc` · S4 register collapse +
  idempotent migration `12e5f96` · S5 publication + walk mark-identity `317fa0e` · S6 mark language
  `8a17a0c` · cache `27b4878`. Canonized the **GROUND SPECTRUM** (CLAUDE.md §7); **Published/Private
  replaced Public/Intellectual** (single body + idempotent `bodyIntellectual→bodyPublic` migration);
  §9 red-team clean. Named debt → S-C (dead CSS, warm `--ink-3` AA, arc-voice box) + the arc-field
  mobile touch model (its own named slot below). Records: `docs/checkpoints/r5-*.md`,
  `docs/studio/arcs.md` + `arc-detail.md`. touches: [arcs, arc-detail]
- [x] **R6 — Sub-theory: Page=read + workshop=sole-editor + pull-system + notebook-births + skin (DEEP)**
  (v3.190, `4c8f73e`; felt pass **FULL PASS 2026-07-10** — deployed + live-verified). Covers BOTH
  `#subtheory/<id>` (the read/author-view Page) and `#subtheory/<id>/build` (the workshop). 7 commits
  `78174f5 → 4c8f73e`: S1 vocab · S2 Page=read `4a2b3cf` · S3 workshop=sole-editor `066e056` · S4
  pull-system `d6f9bca` · S5 notebook-births `9f0f8b5` · S6 skin+debt `08f61ac` · S7 red-team+cache
  `4c8f73e`. Resolved the notebook-vs-arcs build redundancy (ONE editor); `writing-canvas.js` UNTOUCHED;
  fix-red-team CLEAN + praxis-reviewer CLEARED. Records: `docs/checkpoints/r6-subtheory.md`,
  `subtheory-build.md` + `subtheory-page.md`. touches: [subtheory-build, subtheory-page]
- [x] **R7 — Book Detail: light ground + lineage-leads one page + arc chips + category/moved-me +
  marks route retired (DEEP)** (v3.191, `bff5d82`; felt pass PASSED — deployed 2026-07-10). Seventh
  surface round. 8 commits `25c7987` (mockup) → `bff5d82` (S6 cache): F1 light ground · F2 marks folded
  in (route redirects via `location.replace`) · F3 lineage leads · F4 arc chips (field-hue by id-hash) ·
  F5 `movedMe` persisted field · F6 category picker + `categoryOverride`; LENS "+ Add to a lens" drop
  ACCEPTED (inert `buildBookLensPanel`, one-move restore). Both gate reviewers cleared (praxis-reviewer
  PASS, fix-red-team NO-BLOCK); Live Forensic Smoke Test PASS. The BD2 4-I `order` reorder shipped; the
  full mobile-canon pass is MW-3. Records: `docs/checkpoints/r7-book-detail-recon.md`,
  `docs/studio/book-detail.md`. touches: [book-detail]
- [x] **MW-1 — Shelf + Home mobile pass (SWEEP)** (SHIPPED-LOCAL 2026-07-10, `a405730` shelf +
  `e5ab754` home; NOT pushed — awaiting Preston's push + felt pass). First of the three mobile-wave
  passes. Shelf → P1 Manage sheet/popover (ON-2 reference impl, one JS path) + P2–P9; Home → P3 44px
  targets + P8 lamplight-overflow fix (P6 pre-satisfied, rest n/a). Both surface chips → `mobile:
  native`. Both praxis-reviewer verdicts CLEARED; fix-red-team found + fixed one blocker (back-nav
  scroll-lock leak). **PUSHED + live v3.192** (Preston, 2026-07-11); felt pass pending. Report:
  `docs/studio/reports/mw1-2026-07-10.md`. touches: [shelf, home]
- [x] **MW-2 — Notebook + Arcs mobile pass (SWEEP)** (SHIPPED-LOCAL 2026-07-11, `bd5c4c5` notebook +
  `900aa4f` arcs; NOT pushed — awaiting Preston's push + felt pass). Second of the three mobile-wave
  passes. Notebook → P7 (3 inline-editor/caption inputs to 16px); P3/P6/P8 verified already, rest n/a.
  Arcs → P3 (arc-detail interior controls to 44px hit areas); P6/P8 + the list verified already, rest
  n/a. All three surface chips (notebook, arcs, arc-detail) → `mobile: native`. Both praxis-reviewer
  verdicts CLEARED (one cosmetic `.btn` display residual resolved). Report:
  `docs/studio/reports/mw2-2026-07-11.md`. touches: [notebook, arcs, arc-detail]
- [x] **MW-3 — Sub-theory + Book Detail mobile pass (SWEEP)** (SHIPPED-LOCAL 2026-07-11, `99f7fb0`
  sub-theory + `5dd7cee` book detail; NOT pushed — awaiting Preston's push + felt pass). Third and
  LAST of the three mobile-wave passes — **the mobile wave is complete, 8 surface chips native.** The
  heaviest of the three: both halves fixed a real P8 h-scroll. Sub-theory (workshop + read Page) → P8
  the FINISHED room's ~130px author-topbar overflow (`.st-tb-right{flex-wrap:wrap;width:100%}`); P7 the
  pull-filter inputs 11.5→16px; P3 delete/mark-glyphs/Yumi-x/tb-back → 44. Book Detail → P8
  `box-sizing:border-box` (the one surface missing it) + read-status segment wrap; P7 edit fields
  13→16px; P3 the small controls + 44×44 rating stars. All three chips → `mobile: native`. Both
  praxis-reviewer verdicts CLEARED (Book Detail HOLD on the rating stars → fixed 44×44 → re-confirmed).
  Desktop residual MW3-BKBOX carried. Report: `docs/studio/reports/mw3-2026-07-11.md`.
  touches: [subtheory-build, subtheory-page, book-detail]
- [x] **R8 — Values: the values THREAD (DEEP, NEW BUILD)** (v3.195, `37ea1f0`; live 5-step smoke on
  `prestonpraxistest` PASSED IN FULL 2026-07-11 — Preston's deployed felt pass pending). The flagship values
  layer, built as a THREAD not a pane. 9 commits `f6c3a5a` (mockup) → `37ea1f0` (cache): S1 data layer
  (`valueMarks` ×3 + migration 1.28.0→1.29.0) `0b09bb3` · S2 register+book `7c5ea9b` · S3 sub-theory+arc
  `482bf7f` · S4 Yumi retrofit `34c1e97` · S5 shelf filter `205fda2` · S6 preset beat `fad3e57` · gate-fixes
  `0706657` · cache `37ea1f0`. **Model A** (marks reference the declared `profile.values` vocabulary; a mark =
  `{value, why}` — tag + lineage; **per-object fields, NO new synced collection** — FX-1 untouched). Four
  pieces: the onboarding **preset moment** (10 approved presets → `profile.values`) · quiet **value-marks** on
  book/sub-theory/arc (beside `movedMe`) · the **Yumi eval-gated retrofit** (metadata-only; accept adds a
  stone, never auto-marks) · one **shelf filter row**. Both gates bit: fix-red-team caught a retake value-wipe
  (FINDING 1 — fixed + live-verified); praxis-reviewer caught a `.vr-*` contrast failure (fixed to a self-
  contained `--vr-*` palette, 15:1 live). Live smoke passed all 5 incl. **Firestore round-trip ×3 object
  types**. R9/R10 consume the per-object `valueMarks[]` shape. Records: `docs/checkpoints/r8-values*.md`.
  touches: [onboarding, account, book-detail, subtheory-page, arc-detail, books]
- [x] **R9 — Profile / Galaxy · R9a the MERGED Profile (DEEP)** — SHIPPED v3.198 (`e25ac6f`) + patch v3.199
  (`6e96d5b`); **deployed felt pass = STRONG PASS (2026-07-12)**; live smoke on `prestonpraxistest` PASSED IN
  FULL (statement Firestore round-trip · retrofit accept · visitor fencing · 8-fix spot-check desktop+390).
  Account + Profile merged into ONE Profile at `#profile`; `#account` redirects (`location.replace`, the R7
  precedent); the old `renderOwnProfile`/`renderAccountPage` retired **defined-but-unrouted** (~2060 L, S-B
  debt). A galaxy hero (stars = sub-theories, planets = categories sized by books, faint field = books read),
  a tappable values strip, an **uncarded thesis** (the AM8 `profile.statement` — the ONE persisted addition,
  migration 1.29.0→1.30.0 + the Firestore twin), then the card system: Values (evidence-weighted load + the
  Yumi value-offer retrofit re-home) · By the numbers (books · marginalia · **arcs** · sub-theories ·
  published; category grid + owner-only lens toggle) · Open questions · Now · reader-model DNA carry
  (returns/journey/consent+threads) · Published 3-up closing band · quiet Settings. Owner-vs-visitor = a
  CONTENT fence; the project's **FIRST ≥1200 composition tier** (D1–D6 proven live). Both gates cleared
  (fix-red-team + praxis-reviewer); a v3.199 patch cleared 8 deployed defects (DNA data-shapes, widened
  collision proof, lens dedup, shelf-filter links, header/chevron/excerpt/thesis-omit). Records:
  `docs/checkpoints/r9a-*.md` + `r9b-handoff.md`. touches: [profile, account]
- [x] **R9b — Profile arc layer + galaxy depth (TWO LANES + felt-pass patch, display-only)** — SHIPPED:
  Lane P v3.200 · Lane G v3.201 · **felt-pass patch v3.202 (`e73e994`; deployed re-pass = FULL PASS 2026-07-13).**
  Lane P (the page): question-led arcs · public lineage band · Now richness · a published quality pack ·
  the DNA re-slot · the faint-default value web. Lane G (the galaxy): sigil-galaxy center + value-line lensing ·
  CSS-only motion + presence + sparse rule · a diverse muted hue wheel + owner sky lens-mode · the in-galaxy
  selection panel · published-arc constellations + interaction map · teal→gold. Felt-pass patch (P1–P9): P1
  curated category→wheel hue map (the two grey-blue planets separated) · P2 dominant label off the sigil axis ·
  P3 sparse balanced spread · P4 one hue system app-wide + catcard wrap · P5 never "Untitled" + contained n=1 ·
  P6 lineage adjacent (desktop) · P7 desktop density · P9 reader-model teal→gold · P8 h-scroll verify (Book
  Detail ON-7 re-seeded). Both gate agents cleared (praxis-reviewer ×2 CLEAR; fix-red-team BLOCK→FIXED). Records:
  `docs/checkpoints/r9b-laneg*.md`, `r9b-laneP*.md`, `docs/studio/profile.md`. touches: [profile]

## Now

**The 3 truest next moves after the R-POLISH close (2026-07-20). The runway view of
the whole spine → beta gate is `docs/launch-runway.md` (Builder: LAUNCH RUNWAY panel).**

- [ ] **FINISH-CHOREO slice** — the ROOM-charter-named finish choreography (the
  mark-as-finished feel). First up post-R-POLISH.
- [ ] **R-SHELF — Shelf deep re-round (build)** — the most-used surface predates the
  R5–R9 Universal maturity. `[books]`
- [ ] **R-CAPTURE — the capture round (owns THE DOOR)** — text/voice/paste/import into
  one entry, sub-400ms; ruled brief in-repo (`docs/studio/r-capture-brief.md`).
  `[import-capture, notebook]`

- [x] **R-POLISH — the pre-launch polish round — CLOSED 2026-07-20** (batches B1→B4 +
  B-M all shipped v3.231→v3.238; FX-1 add-guard pulled forward, v3.237). Detail in
  ## Shipped below and `docs/launch-runway.md`. Tab-side felt PASS; OV-1 (live FX-1
  race) + OV-2 (3 PWA-only felt checks) are OPEN-VERIFY, not debts. Original lane
  detail retained here for the record:
  - **L1 — XL-tier composition canon ≥1600** (designed at 1920 + per-page passes) — absorbs the
    carried composition residuals: ~~DW-NAV768~~ · HOME-LAMP · ON-7 band · the 2560-sag · page-scrollbar.
    **OWNERSHIP CORRECTED (B4): DW-NAV768 was assigned to L1 here while the B4 GO assigned
    the same defect to B4 as rider "R2" — one defect, two owners. It is CLOSED in B4**
    (18px h-scroll at 768 → 0; `.app-nav-list` gap 32→20 in the 760-839 band only).
    Record: `docs/checkpoints/r-polish-b4.md`.
  - **L2 — CONTROL CANON** (rule + app-wide sweep) — one control dialect (was: native `<select>` in
    Pull-from-reading, default inputs, mixed chip/button); **Book-Detail ✎ re-wire is a candidate here**.
  - **L3 — RD-1 glyph slice, WIDENED** — the candy-glyph palette leak → the arc panel + Home
    thumbnails + workshop glyph.
  - **L4 — drag choreography** (lift/settle physical feel; the ROOM-3 under-developed-drag finding).
  - **L5 — Yumi caption-family removal** (the 3 bare-caption strings; absorbs ON-8 **and RD-6**, the
    seat's deferred persistent-hint-line retirement).
  **BP-1v3 — THE BATCH PLAN (ratified at the B4 GO):**
  **B1 → B2 → B3 → B4 → B-M → CLOSE.** B-M is a dedicated MOBILE batch and it owns the
  app's EXISTING mobile debt: kit/canon application at 390 · safe-areas · emoji → stroke
  icons · focus rings · cluster normalization · and the app-feel micro-riders
  (tap-highlight, overscroll, user-select, manifest-icon verify). Each desktop batch
  ships NO mobile debt of its own — B4 was the first held to that clause explicitly.
  **BATCH PROGRESS:** Slice 0 kit + proofs → **B1/B1-FIX** THE HOUR (v3.231/232)
  → **B2** the arc cluster (v3.233) → **B3** AES enforcement, sessions 1+2
  (**v3.234 — PUSHED, DEPLOYED, deployed-smoke 22/22 PASS at `7ddd3c8`; only Preston's
  felt pass is open**) → **B4** About + Arcs index + the light pages (BUILT, local).
  B3 carries AES-1/2/5a + the `--m1` rider (session 1) and AES-3
  arc head → kit · AES-4 styled-native select · AES-5b plate-frame + carved edge · **the ✎ re-wire,
  which CLOSES the named MARG-EDIT round gap** · Book Detail XL (46.9% → 61.3% @2560) · the Profile
  dawn seam · `--m1-on-ground` → 3.811:1 (session 2). Record: `docs/checkpoints/r-polish-b3.md`.
  **L2 ↔ MARG-EDIT ownership, now ANSWERED** (the charter required this ruled, never silently
  double-owned): the ✎ re-wire shipped **inside B3 as the Book-Detail round gap**, not absorbed into
  L2's app-wide sweep — and its write routes through `updateNotebookEntryBody`, the same accessor
  ROOM-2's `#note/<id>` door uses, so the two doors do not double-own the write either.
  Round-close rider: run the studio-census re-measure (arcs · arc-detail · subtheory-build ·
  subtheory-page · notebook) if cheap; else ledger it into L1's recon.
  touches: [global-shell, home, book-detail, arc-detail, notebook, arcs]
  - ruled brief (in-repo): docs/studio/r-polish-brief.md (v1.4) · charter: docs/studio/r-polish-charter.md
- [x] **R-ARC — the knowledge-arc theorizing system (DEEP round)** — **BUILD COMPLETE + SHIPPED+LIVE
  (v3.211→v3.229).** Wave A/B (S1→S5 + F4 + FF-7, v3.211→v3.220, felt PASS) · Wave C (S6a→ROOM-3 +
  Slice 8 dismissal store v3.228 + Slice 9 raised-hand seat v3.229). Full ledger + push ledger in
  `docs/studio/r-arc.md` and the ## Shipped entry below. **FORMAL CLOSE CONDITION (Preston, verbatim):
  Wave C and the R-ARC round close on Preston's felt confirmation of the seat — his one-note look on
  v3.229.** Everything built; only that felt confirmation is outstanding.

## Next
**Canonical order set at the R-ARC close-out (2026-07-18, Preston-ruled — enact, don't relitigate).**
*(FINISH-CHOREO · R-SHELF · R-CAPTURE promoted to ## Now at the R-POLISH close, 2026-07-20 — see above.)*
- [ ] **SCAN round (studio-scan)** — the seven-lens audit re-enters steady state; **camera modes plug into
  R-CAPTURE's door**. touches: [books]
- [ ] **S-B — Sweep + dead-code deletion** — Import-Capture overlay · Yumi/lens panel · Account residuals +
  delete the ~2060-L defined-but-unrouted old profile renderers (R9a debt) + tokenize shared light-skin
  literals app-wide. touches: [import-capture, yumi-panel, account, profile]
- [ ] **R10 — Connections** — the cross-arc/graph round (the R-ARC-named dependency).
- [ ] **ONBOARDING round** — inherits the Bloom teaching beat (RD-6's retired hint text, handed off from
  R-POLISH L5).
- [ ] **BETA-READINESS gate** — NOT a round; the launch checklist: FX-1 · Goodreads import ·
  export/backup/Settings · admin interim · commons fencing · **RM-SPLAT** · **DISMISS-UNIFY review** ·
  CAPTURE-OWNER 1b · **the Slice-8 cross-device Firestore leg** (all in `docs/LAUNCH-STATUS.md`).
- [ ] **R11 — Social / discovery round.**
- [ ] **S-C + debt** — final sweep + carried debt.
- [ ] **Feature layers** — Yumi generative wave 1 (**unbidden-speech conversion + the YG-15 amnesty**) ·
  sounds (Yumi voice + ambient) · the beta loop.
- [ ] **ARC-FIELD MOBILE TOUCH MODEL (NAMED SLOT, carried)** — the constellation field's drag/connect touch
  model on the protected renderer; candidate to fold into R-ARC-adjacent work, Preston's call. touches: [arc-detail]
- [ ] **Overnight batch (`docs/studio/overnight.md`)** — small, single-surface, revert-safe fixes run
  unattended; committed, never pushed — Preston pushes after the morning felt pass. touches: [various]

## Then

Per-surface rounds and the fix/feature spine, in program order; each surface round:
**scan → forks → mockup reconstruction → felt pass → staged build → close** (SWEEP rounds
skip the mockup beat). A round closes ONLY on Preston's felt pass. Carried from the launch
spine and the evolution track and folded into the program — nothing dropped.

- [ ] **R10 — Connections (DEEP EXPLORATION, DEPENDS R8 + R5)** — values × ideas × books ×
  arcs; the unsolved arc-to-arc visualization gets real design exploration.
  **LENS QUESTION PRE-ANSWERED = KEEP** (Preston re-opened AM45 gold-only + the sky-lens deferral and is
  investing in lenses — R9b Lane G added sky lens-mode). R10's lens work = **CONFIRM + CONSOLIDATE only**
  across the three consumers (shelf Lenses grouping · Yumi `generateLenses` · the Profile Numbers lens
  surface) — NOT a retire-debate. touches: [arcs, arc-detail]
- [ ] **ONBOARDING round (W9, DEEP)** — a dedicated pass on the intro / onboarding system before beta (was
  folded in the feature-layers tail; promoted to its own round at the R9b close). touches: [onboarding]
- [ ] **BETA-READINESS gate** — the collected launch-blockers, **in order**, before any outside beta tester is
  invited; **R11 is hard-blocked until this gate clears:**
  1. **FX-1 — data-loss sync guards FIRST (HARD DEPENDENCY, Preston 2026-07-12)** — F-DL1 sync guards on all 5
     unguarded collections + F-DL2 flush (F-PX1 proxy cap already shipped, v3.203). No outside account is EVER
     invited before FX-1; it **jumps immediately on any data-loss scare**. Interim guardrail: after signing in
     on any device, let the app settle before editing. (RULED — no re-raise.)
  1b. **CAPTURE-OWNER — HARD REVIEW at this gate (Preston 2026-07-16, R-ARC S2 carry).** `captureNote`
     (`views.js`) reads `getCurrentUser()` fresh; the **multi-image** commit path calls it inside `finalize()`
     after the async IndexedDB puts, so an account switch (no reload) landing in that window misattributes
     A's note+photos to B. **Pre-existing (base `98738b0`), NOT an S2 regression** — S2's own draft/gather
     stores are owner-gated and proven. Proper fix = a **scoped `captureNote` owner-uid follow-on** (shared
     function, out of S2 scope). Same family + same posture as FX-1: **no outside account is invited while this
     stands unreviewed.** Record: `docs/checkpoints/r-arc-s2.md` residual #10.
  2. **Stage-2 JWT auth (two-phase)** — the proxy auth-gating hardening (per F-PX1 0c, Yumi + google-books are
     reachable signed-out today; this is the beta-gate auth item).
  3. **Goodreads import — minimal CSV** (title / author / ISBN / shelf). The rich shelves → lenses mapping is a
     **post-gate round**, not a blocker.
  4. **Export / backup + a minimal Settings surface.**
  5. **commons `#reader` fencing** — the draft-sub-body debt (`integrations.js:2456`: a commons-published arc
     projects the `bodyPublic` of DRAFT-status subs; carried from Lane P).
  6. **Admin runbook doc** — the interim moderation / operations runbook.
  7. **Unlisted-URL + open-auth access** — the access model for the first invited testers.
  touches: [account, import-capture, commons]
- [ ] **R11 — Social-discovery (DEEP; DEPENDS BETA-READINESS / FX-1 — HARD)** — commons / reader / walk
  promoted to their own top-level sub-page; includes the deliberate Lane-2 commons-open security decision.
  **BLOCKED** until the BETA-READINESS gate clears (no first beta tester before then). touches: [commons, reader, walk]
- [ ] **S-C — Sweep + Debt (SWEEP)** — onboarding/intros · signed-out & global empty states
  (clears the carried R3/R4 debt) · AA opacity (`--lum-ink-4` on light) · dead selectors ·
  the parked tasks (task_3c933f62 universal-depth spreads, task_e4cb7af7 reveal a11y, R-b) ·
  the P2 audit findings.
  touches: [onboarding, cross-cutting]
- [ ] **Feature layers** — interleave as prerequisites clear: Yumi generative (eval-gated;
  PREREQ = Preston authors her prompts + rubric) → Yumi-intelligence wake-up · ambient sounds ·
  beta-tester loop. touches: [yumi-panel, import-capture]

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

## Pending inputs

Things the program is waiting on from Preston. Non-blocking by default — an item here
never stops a round; it names what a future round should fold in when it arrives.
(Distinct from **Open calls**, which are decisions already made.)

- **Preston's About/Arcs felt notes — uncollected.** Scoped into DW-POLISH as Stages 3+
  ("Book Detail only for now — no About/Arcs notes this session; they'll arrive as a later
  slice") and never supplied. **Fold into a future polish slice; non-blocking.** The polish
  tier's method is proven on Book Detail (v3.209/v3.210), so the notes can be executed as a
  slice whenever they land.
- **Verbatim July-14 eruption texts — uncollected.** The real dictation-at-eruption-length inputs
  (Slice 11 / PWA diligence; "[keyboard clacking]" was captured live). Fold into R-CAPTURE's door
  verification when supplied. Non-blocking.
- **WebKit hands-on — pending.** Real-device Safari/iOS pass (the render engine differs from Blink);
  fold into the BETA-readiness gate. Non-blocking.

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
