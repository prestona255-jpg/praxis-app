# R-ARC — SLICE 9 BUILD CHECKPOINT (the raised-hand seat) — 2026-07-18

**Model:** Opus 4.8, default effort, ultracode OFF (sequential lane, no Workflow — the harness
turn-flag was a false-positive match on "ultracode OFF"). **Base:** `f5b4c47` → D14 docs pass
`a0a067d` (local). **Recon of record:** `docs/checkpoints/r-arc-slice9-recon.md`.

**STATUS: BUILT + COMMITTED LOCAL (v3.229). DATA-WRITE TRIPWIRE TRIGGERED → HALT for Preston's
push word; then the FELT-LOOK HALT; deployed smoke follows the push.**

## 0. D14 DRIFT RECONCILIATION (docs-only, `a0a067d`, before any code)
6 corrections across 5 docs (SR-1 static · SR-3 two-part law · seat supersedes D14 chrome · "no sv()"
stale-fixed · F-D answered · Slice-8 currency · room3-handoff drift marked). 3rd doc-drift lesson.

## 1. THE BUILD — slices & mechanical gates
| Slice | File | Δ (LF) | lines | code band | parse |
|---|---|---|---|---|---|
| B1 | assets/components.css | +1036 B | 19/0 | 317 B (≤2.0 KB) ✓ | (css) |
| B2 | js/yumi-brain.js | +2278 B | 48/0 | 1033 B (≤1.6 KB) ✓ | OK |
| B3 | js/yumi-ui.js | +5067 B | 107/0 | 2344 B (≤2.6 KB) ✓ | OK |
| B4 | js/views.js | +327 B | 4/0 | 89 B ✓ | OK |
| Fix | js/app.js | +384 B | 5/0 | 75 B ✓ | OK |
| B5 | sw.js | v3.228→v3.229 | 1/1 | — | — |

Pure insertion everywhere (sw.js the only 1/1 swap). All touched blobs LF (no EOL flip). **T2 EVAL-GATE
GREP-ZERO:** `git diff a0a067d -- js/yumi-brain.js` = 2 hunks (post-`considerNotice` block + 2 export
lines), 0 deletions, `gradeUtterance` appears only in a comment — the gate is byte-untouched.

## 2. THE SEAT (how it works)
Cheap `handEligible` (no proxy) raises the body FAB (`.yumi-bloom--raised`, a static one-step brighten to
`--gold-hi`) when a genuine cross-note noticing is plausible and the panel is closed. Opening the Bloom
runs the real `considerHeldNotice` → the FROZEN `considerNotice`/`gradeUtterance` (lazy compose), delivers
the move, and lowers the hand. State is ls-session (`praxis_yumi_hand {raised,raises,done}`), boot-cleared.
Cap = 3. Consent rechecked at delivery. Only explicit dismissal is durable (reused Slice 8).

## 3. GATE AGENTS (Sonnet, on the frozen tree)
- **fix-red-team → BLOCK**, then **BLOCKS RESOLVED** on re-review. Findings: (1) unbounded barren re-raise
  → FIXED (`done` session-bound); (2) dead boot-raise (yumi-ui init before state load) → FIXED (moved to
  app.js post-`loadState`). Covenant/T2/single-slot/static/ES3/scope all verified sound.
- **praxis-reviewer → HOLD**, then **HOLD CLEARED** on re-review. Defects: (1) consent bypass at delivery
  → FIXED (consent recheck in `considerHeldNotice`, gate untouched); (2) currency → this checkpoint +
  sequence.md/r-arc.md + Builder regen ride this commit. Bands/parse/ES3/EOL/scope PASS.

## 4. LOCAL RIG BATTERY — FULL PASS (.claude/rig, port 8794, d0tester, 11 visible seed notes)
| Check | Evidence |
|---|---|
| Static — Leg A byte-identical (settle) | raised filter T0 == T+1.5s (`…/0.6 … 15px`) |
| Static — no new animation | orb + petals/core/halo/ember animation sets identical rest vs raised |
| Static — distinguishable | raised `srgb .851 .643 .255/0.6 15px` vs rest `srgb .824 …/0.38 12px` |
| Raise on trigger | `maybeRaiseHand` → raised, ls `{raised:true,raises:1}` |
| Lazy compose | proxy calls: **0 on raise, 1 on open** |
| Open delivers + spent | hand lowered synchronously on open; ls `raised:false` |
| Barren → done | quiet delivery (404 backend) set `done:true` |
| Session-drop | reload: `{raises:3,done:true}` → boot-cleared → re-raised `{raises:1,done:false}` (noticing survived, re-raisable) — also proves the boot-raise fix live |
| Cap=3 / done / cooldown | raises:3 blocked · done blocked · cooldown (post-scan) blocks; raises:2 raises |
| Consent at delivery | consent-off → `considerHeldNotice` `{quiet,'consent'}`, **0 proxy**; UI open 0 proxy |
| RD-6 chip unchanged | `.yumi-bloom-line` text identical rest vs raised ("see what I'm noticing") |
| 390 clean | hscroll 0 · FAB in viewport · line `display:none` (orb-only at mobile) |
| Console | 0 errors (only expected `fail-quiet` warns from the local 404 backend) |

## 5. RESIDUALS (for the felt look — none blocking)
- **FELT CANON #2 at desktop:** the persistent hint line ("see what I'm noticing") remains — that line's
  retirement is **RD-6** (deferred to R-POLISH L5, a non-goal here). The raise adds no words/badge/count,
  so #2 holds *for the raise*; at mobile the line is already hidden (orb-only). Flagged for felt.
- **Barren re-try:** a persistently-barren cluster gets one speculative scan per session (bounded by
  `done` + cooldown + cap). Felt-tunable (the cap and the barren-rest are knobs).
- **`.yumi-bloom-orb` transition unscoped** to base (needed for both-direction easing; inert on the panel
  crest orb). Intentional.
- **Boot-raise on the deployed site:** relies on `praxis_user` being in ls at boot (true for a returning
  signed-in reader). To confirm in the deployed smoke.

## 6. NEXT (HALTS)
1. **Push HALT** (data-write tripwire) — awaiting Preston's exact push word. On the word: push, then run the
   DEPLOYED SMOKE (live sw.js ×2 cache-busted + the live battery on prestonpraxistest/d0tester stub, NEVER
   prestona255), record the push ledger, regen the Builder at the push point.
2. **FELT-LOOK HALT** (at close) — the FELT CANON sentences 1–7 are the acceptance; headline: does the
   brightened orb read as a hand quietly raised — noticeable when looked at, silent when ignored.
