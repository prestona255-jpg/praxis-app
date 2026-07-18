# R-ARC SLICE 8 — THE DISMISSAL STORE (REQ#1c) — STARTED

Base `62ab1c4` / live v3.227. Wave C (Opus). **DATA-WRITE slice — Preston's ruling:
build C1, full gates, commit LOCAL, HARD HALT for his explicit push word (data-write
exception ABSOLUTE).** Recon: `r-arc-slice8-recon.md`. Scope RULED **CANDIDATE 1**
(minimal, plan-faithful); C2 (unified store) logged as follow-on **DISMISS-UNIFY**.

## Scope (C1, Preston-ruled)

Make the Portrait through-line "Set aside" a durable+synced TOMBSTONE (F-D REMEMBERED,
per-match) instead of a hard delete — completing the half-built readerModel path (the
`status==='dismissed'` read-filter at views.js:21250 is already live-but-dead; nothing
writes it). Fuzzy ≥2-overlap kept (untouched); consent gate unchanged; forward-only.

**Edits (3 files):**
1. **js/state.js** — NEW `dismissReaderThread(uid, threadId)` after `deleteReaderThread`
   (:1558): by-id find (mirrors `editReaderThread`), flip `status='dismissed'` + updatedAt
   + `readerModel.updatedAt` + saveState. **Forward-only** (idempotent `!== 'dismissed'`
   guard; no un-dismiss — F-B). Available regardless of consent (reader controls own data,
   as deleteReaderThread).
2. **js/views.js** — Portrait "Set aside" handler (:21288): `deleteReaderThread` →
   `dismissReaderThread`; keep the existing `saveReaderModelToFirestore` sync + re-render.
   Update the :21275-21278 comment (delete → tombstone).
3. **sw.js** — bump v3.227 → v3.228.

**By-id, NOT overlap-keyed (disclosed determination):** reusing `addReaderThreadFromName`'s
overlap-match would FAIL to dismiss manual threads (`addReaderThread` sets
`memberNoteIds:[]` → cannot overlap-match). By-id (editReaderThread pattern) dismisses
EVERY thread correctly. This is the truest reading of Preston's "reuse the readerModel
by-id mutation pattern near-verbatim." (Preston rules at the HALT if he wants overlap.)

**T3 both-path — satisfied by EXISTING plumbing (no new code):** `replaceReaderModel`
already coerces `status:'dismissed'` on the Firestore load (state.js:1612);
`saveReaderModelToFirestore` passes `threads` wholesale (integrations.js:1064). So a
tombstone syncs + survives reload with ZERO integrations.js change. VERIFY at self-verify,
never assume.

## NON-GOALS / disclosures (Preston conditions)
- **Forward-only** (no un-dismiss); if ever wanted → intake, not a silent add.
- **Hard-deleted past dismissals are gone and STAY gone** — never synthesized.
- **T2 frozen gate untouched** — grep-proof zero yumi-brain.js changes in FINAL-PASS.
- **DISMISS-UNIFY** (C2, app-wide across all 4 mechanisms) = named follow-on, ground doc
  = the recon; slotting at a future re-plan. Logged in the ledger.
- **RM-SPLAT** (replaceReaderModel REPLACE-splat clobbers a sibling device's offline
  write; F-DL5-adjacent) = inherited, disclosed, logged to the beta-readiness basket; NOT
  expanded here.
- **Resurrection risk (disclosed):** `addReaderThreadFromName` (DEAD, 0 callers) would, if
  ever wired, overlap-update a dismissed thread back to `status='named'` (silent
  un-dismiss). No active path today; flagged for Slice 9 / DISMISS-UNIFY (add a
  dismiss-respect guard when it is revived).

## Band declaration (Addendum v2: ~38 B/line + 20% line contingency; re-band GRANTED state.js ≤4.1KB)
| File | Lines (branch-derived) | +20% | CODE (hard) | COMMENT (soft) |
|---|---|---|---|---|
| js/state.js | ~14 (by-id loop + flip, mirrors editReaderThread) | 17 | **≤4,100 B** (granted; EXPECTED ~600–800 B — the minimal reuse lands far under) | ≤500 B |
| js/views.js | ~4 (repoint 1 + comment 3) | 5 | **≤400 B** | ≤250 B |
| sw.js | version swap | — | ±0 (v3.227→v3.228) | — |
state.js expected FAR under the granted ceiling (the ceiling covered the rejected
overlap-upsert variant); arithmetic re-shown at self-verify.

## Data-loss battery (Preston's required proofs — rig, prestonpraxistest/stub)
1. Reproduce: today "Set aside" hard-deletes → re-notice/re-surface possible.
2. Fix: tombstone WRITTEN → survives reload → survives a Firestore sync round-trip.
3. Dead filter proven live BOTH ways: dismissed hidden · non-dismissed shows.
4. No-new-silent-loss control: a DIFFERENT (non-dismissed) thread still surfaces; the
   dismissed one never resurrects via any ACTIVE path (addReaderThread pushes new;
   replaceReaderModel preserves 'dismissed'; addReaderThreadFromName dead).

## SELF-VERIFY (post-build)
Parse state.js/views.js exit 0 · ES3 added clean · NULs 0 · **T2 grep: 0 yumi-brain.js
changes** · foundations md5 unchanged · **T3 both-path VERIFIED (not assumed):**
replaceReaderModel coerces `status:'dismissed'` on load (state.js:1612) + saveReaderModel
ToFirestore writes `threads:threads` wholesale (integrations.js:1064) → tombstone syncs +
round-trips with ZERO integrations.js change. dismissReaderThread = 1 def + 1 call; the
MANUAL delete (deleteReaderThread views.js:16519) correctly UNTOUCHED.

| File | CODE | band | COMMENT | soft |
|---|---|---|---|---|
| js/state.js | **523** | ≤4,100 ✓ (far under — the ceiling covered the rejected overlap-upsert) | 495 | ≤500 ✓ |
| js/views.js | **90** | ≤400 ✓ | 278 | ≤250 (28 B over — cleared-by-classification) |
| sw.js | ±0 (v3.227→v3.228) | — | — | — |

## RIG DATA-LOSS BATTERY (:8945 fresh port; d0tester stub; readerModel opted-in, 3 threads incl. a manual empty-members one) — FULL PASS
- **Flip-not-delete + control:** dismissReaderThread('th_A') → true; th_A `status='dismissed'`
  (NOT removed); count still 3; th_B untouched `named` (the control still surfaces).
- **Manual thread by-id:** dismissReaderThread('th_M', memberNoteIds:[]) → true, dismissed
  — proves the by-id determination (overlap-keying would have failed this).
- **Forward-only / idempotent:** re-dismiss('th_A') → false, updatedAt unchanged (no double-write).
- **Persistence:** the tombstone survives in `praxis_state_d0tester` as `dismissed` (present,
  count preserved — NOT deleted); th_B control also persisted `named`.
- **Load round-trip:** replaceReaderModel (the Firestore load path) preserves `dismissed`.
- **Save path:** saveReaderModelToFirestore writes threads wholesale (code-verified) → the
  real Firestore network round-trip is the deployed smoke's job (post-Preston-push, prestonpraxistest).
- **Console:** ZERO errors across the battery.
- **Read-filter (pre-existing, unchanged by Slice 8):** verified-by-code (views.js:21250 skips
  `status==='dismissed'`); its panel-render runtime lands at the deployed smoke / Preston's live
  check (the rig's d0tester has no portrait data to mount the deep panel — disclosed).

## Gates (sequence)
self-verify ✓ → fix-red-team (DEEP, data-loss tier) → dispositions → praxis-reviewer FROZEN
tree → LOCAL commit → **HARD HALT for Preston's push word.** (Rig battery done above.)

## RULING OF RECORD + PUSH (Preston, 2026-07-18)
- **PUSHED on Preston's explicit word:** `998bc46` → v3.228, HEAD == origin/main. Deployed
  smoke: v3.228 live ×2 (cache-busted) + deployed bytes carry `dismissReaderThread` + the
  views repoint.
- **BY-ID DETERMINATION — ACCEPTED as the ruling of record:** the tombstone matches by thread
  `.id`, not by member-overlap (overlap-keying would break manual empty-member threads). The
  reading of "reuse addReaderThreadFromName near-verbatim" = the readerModel BY-ID mutation
  pattern. Correct.
- **RESIDUAL live-smoke (the one human-provisioned gate):** the real-Firestore cross-device
  round-trip on **prestonpraxistest ONLY** (dismiss on A → syncs → suppressed on B / after
  a cache-clear + fresh sign-in). Mechanics proven locally + code-verified; only the live
  network round-trip needs the connected session.
- **Follow-ons live:** DISMISS-UNIFY (ledger) · RM-SPLAT (LAUNCH-STATUS beta basket). Slice 9
  handoff written (`docs/studio/r-arc-slice9-handoff.md`).
