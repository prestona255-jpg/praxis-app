# FX-1 — the incoming-wipe sync guard (arcs · subTheories · themes · artifacts)

Lane B, worktree `../praxis-fx1` (branch `fx1-lane`), base `ba60224`.
Stage-0 recon: `docs/checkpoints/fx1-recon.md`. Model: Opus 4.8, gate agents Sonnet.

**STATUS: BUILT, gates green, headless race PROVEN. Committed local on `fx1-lane`.
HOLDING at the push (v3.237) pending Preston's word + the live corroboration call.**

## The defect (the R1 residual, not the shipped "F-DL1")

Naming, per the recon: commit `c70f0dc` titled "F-DL1" already shipped the
**OUTGOING** clobber guard (the load-settle latches) for these collections. This is
the **INCOMING** wipe those commits' own checkpoints named and deferred: at
post-sign-in load, each collection clears this uid's known records and re-splats the
remote doc; a record created in the window between sign-in and that load — present
locally + unsynced, absent from the remote doc — is deleted. Books was already
guarded (`pendingBookSync`/`mergeRemoteBookDoc`); the 5 others were not. This ships
the guard for **4** of them; notebook is the named follow-up **FX-1b** (its 4 creation
sites span `views.js`/`import-capture.js`, colliding with Lane A's active views.js —
recon §6). Commit subject uses **FX-1**, not F-DL1, to avoid reading as re-done work.

## The build — the pendingBookSync pattern, generalised

The 4 targets lack books' secondary index array (`bookIds`); ownership is inline on
each record. So the guard is a **keep-predicate only**, no index rebuild — simpler
than the books precedent.

**`state.js` — a generic `(kind, uid, id)` pending-sync family** (`pendingSyncKey`,
`getPendingSync`, `markPendingSync`, `isPendingSync`, `clearPendingSync`, `mapIdList`),
byte-shaped after `pendingBookSync`. Per-uid + per-kind localStorage key
(`praxis_pending_<kind>_<uid>`), ls/sv only, never in the state blob.
- **mark on create** at the 4 chokepoints: `createArc` · `createSubTheory` ·
  `createUserTheme` · `ensureOneArtifact` (artifacts key = the composite `uid:bookId`).
- **clear on confirmed save** in the 4 `saveState` success callbacks (mirrors the
  books clear at `state.js:2638`): `clearPendingSync(kind, uid, mapIdList(payload.<X>))`
  — clears exactly the saved snapshot; ids created after stay protected.

**`integrations.js` — the keep-predicate in the 4 clear-loops.** The remote id set is
now computed BEFORE the clear-loop; a local record is deleted only if
`owned-by-uid AND !remoteHas[id] AND !isPendingSync(kind, uid, id)`. A synced record
(in remote) is kept then overwritten by the splat (remote wins, unchanged behavior);
a pending local-only record is kept and the splat never touches it (it survives); a
genuine server-side delete (absent + not pending) is dropped (correct).
**arcs + subTheories ship together** (the required pairing: a sub-theory's ownership
is transitive through its `arcId`, so a preserved sub-theory never points at a wiped
arc). The stale "profile/readerModel deferred to F-DL3" doc-block comment is corrected
in the same commit.

## The race, PROVEN HEADLESS — the mechanism, on the real shipped bytes

Node is blocked (CLAUDE.md); the F-DL1/2/3 precedent is a deterministic ES3 sim. This
sim (`scratchpad/sim-fx1.js`, run-once, not committed) is **more faithful than the
precedent**: it reads and evals the ACTUAL guard family from the built `state.js`, and
slices each clear+splat block from BOTH `base` (ba60224) and `guarded` `integrations.js`,
running each against the same crafted race inputs. **42 PASS / 0 FAIL.** Per collection:

| Assertion | arcs | subTheories | themes | artifacts |
|---|---|---|---|---|
| BASE reproduces the bug — race victim LOST | ✓ | ✓ | ✓ | ✓ |
| GUARD keeps the race victim — SURVIVES | ✓ | ✓ | ✓ | ✓ |
| GUARD still drops a genuine server delete | ✓ | ✓ | ✓ | ✓ |
| remote wins for synced ids | ✓ | ✓ | ✓ | ✓ |
| pending mark held pre-save; cleared on snapshot; later id protected | ✓ | ✓ | ✓ | ✓ |

Plus guard-family unit properties (per-uid + per-kind namespacing, idempotent mark,
null-uid no-op, mapIdList keys). The base run reproducing the LOSS is the proof the
defect is real and that the guard is what prevents it.

## The wiring, PROVEN in the REAL APP (rig, no Firebase)

The sim tests the family + merge; it cannot show `createArc` actually reaches
`markPendingSync` at runtime. Driven live in the rig (worktree served, stub uid
`raceUser`, no Firebase): every real create path — `createArc` · `createSubTheory` ·
`createUserTheme` · `ensureOneArtifact` — leaves its record in the correct real
localStorage pending set. `ALL_WIRED: true`; the 4 `praxis_pending_<kind>_raceUser`
keys exist; console clean.

## The one thing NOT headless — escalation for Preston

The live throttled-Firebase end-to-end race on **prestonpraxistest** (recon §5) is the
human-observable corroboration. It needs **interactive Firebase sign-in (2FA)** — the
one genuinely human-only step, which I cannot perform (entering credentials is
prohibited). The mechanism + wiring above are complete without it. The live run is
offered as optional pre-push corroboration; numbered steps are in the session report.
`prestona255` untouched (read-only always).

## Gates

| Gate | Result |
|---|---|
| `parse-check` state.js / integrations.js | PASS / PASS |
| headless race sim (real bytes, base+guarded) | **42 / 0** |
| real-app wiring (4 create paths → pending set) | ALL_WIRED, console clean |
| ES3 added code lines | CLEAN |
| dirty set | exactly `state.js` + `integrations.js` |
| frozen files (marks / lumen-amber / arc-constellation) | 0 diff |
| sw.js | untouched — cache bump rides the push (v3.237) |
| guard symmetry | 4 marks · 4 clears · 4 keep-predicates |

Byte deltas (LF vs ba60224): `state.js` +4,308 · `integrations.js` +2,294.

## Residual / follow-on

- **FX-1b — notebook's incoming guard.** Named data-loss debt, sequenced after B-M's
  views.js work lands (its 4 creation sites are in views.js/import-capture.js). Tabled,
  not dropped.
- Live throttled-Firebase corroboration on prestonpraxistest — pending Preston.
