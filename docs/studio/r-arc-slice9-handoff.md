# R-ARC — SLICE 9 SUCCESSION HANDOFF (raised-hand seat; Slice 8 pushed+live; Slice 9 next)

**Written 2026-07-18 at the Slice 8 close (Opus session ending). Slice 8 (dismissal
store) is PUSHED + LIVE (`998bc46`, v3.228). Slice 9 = the raised-hand seat, a T2 slice,
runs in a FRESH session. The successor does NOT start Slice 9 without Preston's word.**

## 0. SUCCESSOR'S FIRST ACT
Verify `HEAD == origin/main == ls-remote` (expect the Slice-8 closeout docs commit atop
`998bc46`; live `sw.js` = **praxis-v3.228**). Run `sh tools/ground-truth`. Read, in order:
CLAUDE.md · docs/FIX-PROTOCOL.md · docs/r-arc-plan.md (Slice 9 §; F-D) · this file ·
`docs/checkpoints/r-arc-slice8.md` (+ `-recon.md`) · `docs/studio/r-arc.md` (ledger,
current through Slice 8) · `docs/checkpoints/r-arc-room3.md` (ROOM-3, the raised-hand's
visible home).

## 1. WHERE THE TREE STANDS (Wave C, all PUSHED+LIVE unless noted)
S6a spike · S6b v3.221 · S6c v3.222 · RAIL v3.223 · ROOM-1 v3.224 · S7 v3.225 · ROOM-2
v3.226 · **ROOM-3 v3.227 (`62ab1c4`) — felt PASS FUNCTIONAL (Preston 2026-07-18)** ·
**SLICE 8 v3.228 (`998bc46`) — the dismissal store, pushed on Preston's explicit word.**
Next = **Slice 9**, then the **R-ARC close-out re-plan**.

## 2. SLICE 9 RECON OPENS WITH THE D14 DRIFT RECONCILIATION (do this FIRST, before any code)
**Third doc-drift instance of this wave.** The ROOM-2→ROOM-3 handoff
(`docs/studio/r-arc-room3-handoff.md:30-34`) projected ROOM-3 would ship "the raised-hand
VISIBILITY... (the D14 chrome only)". Shipped ROOM-3 (`r-arc-room3.md`, `62ab1c4`) contains
**NO such item** — scope narrowed silently, never corrected. Also: D14's decisions doc
(`r-arc-shape-b-decisions.md:152-159`) may be STALE — it says the dismiss listeners call
"no `sv()`", but `recordThreadDismissed` has called `sv()` since v3.128, and Slice 8 now
adds the durable `dismissReaderThread`. **Slice 9's recon must reconcile D14 (the ruled
raised-hand) against live code + shipped ROOM-3, and CORRECT the handoff/decisions docs
BEFORE writing Slice 9 code.** Record it as this wave's doc-drift lesson (3rd).

## 3. SLICE 9 — FULLY RULED (Preston, tappable, 2026-07-18) — this is EXECUTION, not design
- **SR-1 THE RAISE = the Bloom orb BRIGHTENS — ONE gentle transition to `--gold-hi`, then
  STATIC.** The rest gold steps once to `--gold-hi` when Yumi has a genuine noticing, then holds
  perfectly still — **no breath, no pulse, no motion, no intensification over time, ever
  (YG-12 anti-coercion).** **NO text, NO badge, NO new chrome.** The RD-6 hover/focus chip
  carries the words; **opening the Bloom opens what she sees.** **FEEL STANDARD (binding):** the
  brightened state is distinguishable from rest in a screenshot diff, AND ignorable at will —
  nothing moves while the reader ignores it.
  *(CORRECTED in the Slice-9 D14 pass, 2026-07-18: the original "slow breath" wording predated the
  ratified constitution pass and is SUPERSEDED — static, one step, no motion. This is the ruling of
  record.)*
- **SR-2 §C TAG = "Yumi"** — name only, mono register. (Closes the long-carried §C corner-tag
  wording item.)
- **SR-3 PERSISTENCE — TWO-PART LAW (CORRECTED, Slice-9 D14 pass, 2026-07-18):** the **NOTICING
  persists; the HAND does not.** Leaving the surface/session lowers the hand **WITHOUT spending
  the noticing** (dissolution ≠ dismissal, YG-6); the thread returns to raisable and may raise
  again. **Opened = delivered = spent.** Only **explicit reader dismissal is durable**, riding
  Slice 8's shipped F-D machinery (`dismissReaderThread` / the readerModel tombstone). Do NOT
  rebuild dismissal persistence — reuse Slice 8. *(Supersedes the earlier "a raise persists until
  SEEN or DISMISSED" phrasing, which conflated the durable dismissal with the per-session hand.)*
- **COVENANT (T2 frozen):** brightening is a raised HAND, never SPEECH — no auto-opening, no
  captions, **`gradeUtterance` gating UNCHANGED, the T2 eval-gate frozen.** Grep-prove zero
  yumi-brain.js eval-gate changes at the FINAL-PASS.

## 4. NEW SESSION MODEL (Slice 9)
**Opus 4.8, default effort, ultracode OFF, gate agents Sonnet.** Slice 9 is FULLY RULED →
the EXECUTION lane (OPUS EXECUTES per MODEL LAW v2). RUN MODE v2 applies; Slice 9 is a
**T2-adjacent / data-touching slice** — treat its commit gate as data-write-tier (LOCAL +
HALT for Preston's push word) if it writes raise/seen state; confirm the tier at recon.

## 5. AFTER SLICE 9 — THE R-ARC CLOSE-OUT RE-PLAN
Agenda comes from Preston. **R-POLISH takes TOP of Next** (already recorded, sequence.md
Re-plan log 2026-07-18): 5 lanes (L1 XL-tier canon ≥1600 · L2 control canon · L3 RD-1 glyph
widened · L4 drag choreography · L5 caption-family removal/ON-8). Ahead of SCAN/R-SHELF.
Also carried to the close-out: **DISMISS-UNIFY** (C2, app-wide durable dismissals — ground
doc = `r-arc-slice8-recon.md`), **R-CAPTURE**, **RD-1** (→ R-POLISH L3), **FINISH-CHOREO**,
**RM6** (field/rail width → R-POLISH), **FF-11** (Notebook void → debt), per-surface
studio-census re-measure. **RM-SPLAT** (F-DL5-adjacent) rides the beta-readiness basket
(`docs/LAUNCH-STATUS.md`), not a round.

## 6. RULINGS OF RECORD + STANDING NOTES from this session (inherit, don't relitigate)
- **BY-ID DETERMINATION (Slice 8) — ACCEPTED as ruling of record (Preston 2026-07-18):** the
  dismissal tombstone matches by thread `.id`, NOT by member-overlap — overlap-keying would
  break manual threads (`addReaderThread` sets `memberNoteIds:[]`). "Reuse
  addReaderThreadFromName near-verbatim" resolved to the readerModel BY-ID mutation pattern.
- **CADENCE CLARIFICATION (Preston 2026-07-18, PERMANENT):** for **data-write slices**, the
  FINAL LOCAL commit awaiting Preston's push word **IS the push point — the Builder regen
  rides that commit.** "Never regen on local-only commits" means **intermediate** commits
  only. (Codified into CLAUDE.md's Studio Protocol this closeout.)
- **Slice-8 residual live-smoke (the ONE human-provisioned gate):** the real-Firestore
  cross-device round-trip on **prestonpraxistest ONLY (never prestona255)** — dismiss a
  Portrait through-line on device A → confirm the `status:'dismissed'` tombstone syncs to
  Firestore and suppresses the thread on device B (or after a localStorage clear + fresh
  sign-in). The LOCAL round-trip + load-coercion + save-path + gates are all green; only the
  live network round-trip needs the connected session. Click-path: #profile → "Yumi can go
  one step further" (opted-in) → a named through-line → "Set aside" → reload → it stays gone.
- **Rig:** LOAD `.claude/rig/` (serve.ps1 fresh port per JS change; seed + d0tester stub,
  RE-SET `praxis_user` post-boot; prestona255 NEVER). Pane caches JS per origin — a fresh
  port is the only reliable bust (a live-origin reload can serve stale JS). Pane screenshots
  dead; synthetic Mouse/Touch events at the real listeners; hashchange routes async (re-probe
  in a fresh call); different-hash location.hash DOES route.

## 7. NON-GOALS (this handoff binds them)
No Slice 9 code before the D14 reconciliation + Preston's word. No T2 eval-gate change. No
dismissal-persistence rebuild (reuse Slice 8). No R-POLISH/DISMISS-UNIFY/RD-1 build inside
Slice 9. No prestona255 anything.
