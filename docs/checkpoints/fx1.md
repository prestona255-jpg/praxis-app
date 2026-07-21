# FX-1 — the incoming-wipe sync guard (arcs · subTheories · themes · artifacts)

Lane B, worktree `../praxis-fx1` (branch `fx1-lane`), base `ba60224`.
Stage-0 recon: `docs/checkpoints/fx1-recon.md`. Model: Opus 4.8, gate agents Sonnet.

**STATUS: SHIPPED + LIVE — v3.237 (`e5318e4`), served-byte-verified, `manual_deploy:false`.**
The ADD-incoming-wipe guard for arcs/subTheories/themes/artifacts; headless-proven
(sim 42/42 on real bytes + the reviewer's independent 15/15 + a mutation test), reviewer
CLEARED. **OV-1 (live throttled-Firebase race on `prestonpraxistest`) is OPEN-VERIFY, not
a debt** — the headless proof is the mechanism evidence of record; the live run is
corroboration Preston does when laptop + test account align (steps in `docs/launch-runway.md`).

The red-team raised TWO claims-outliving-code findings; **Preston ruled B — ship the
add-guard alone, the rest becomes named debt (FX-1c delete-symmetry, FX-1b notebook +
5th artifact site).** Both are in the `docs/launch-runway.md` carried-debt ledger. The
findings, recorded for the follow-ons:**

1. **DELETE-SYMMETRY FORK (recon-flagged, I failed to surface it).** The books
   precedent this "generalises" is a TWO-part system — an add-guard AND a symmetric
   delete-guard (`pendingBookDeletes`), which stops a locally-deleted-but-unsynced
   record from being RESURRECTED by a stale remote splat. This build ships the ADD
   half only. The delete-resurrection race (delete a record → reload before the
   outgoing write confirms → the unconditional splat re-adds it) is untreated for all
   4 collections. **The recon (§1) explicitly handed this fork forward; my fork report
   to Preston did not carry it, and the code resolved it silently in a comment — the
   exact "silently resolved a fork" failure.** Not a regression (the delete-race is
   pre-existing; FX-1 is a strict improvement on adds), but a real symmetric data-loss
   gap that must be Preston's scope call, not a comment. → **FX-1c** if deferred.
2. **5th artifact write-site.** `mergeBookDuplicates` (views.js:8394) does
   `state.bookArtifacts[keepAK] = dropArt` — a new local composite key with no
   `markPendingSync`. The "4 chokepoints / complete" claim below was FALSE. It is a
   views.js site (out of the 2-file scope, like notebook) → rides **FX-1b**.

The ADD-guard mechanism itself PASSED every red-team item (keep-predicate, clear-on-
save, mark-on-create, arcs↔subTheories pairing, F-DL2 orthogonality, backfill,
byte/parse/frozen, and the sim proven non-vacuous by a mutation test). It is a
proven strict improvement. What follows describes the ADD half accurately.

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
  NOT complete for artifacts: `mergeBookDuplicates` (views.js:8394) is a 5th write-site
  that mints a new artifact key without marking pending — a views.js site, tabled with
  FX-1b (see Residual). The earlier "4 chokepoints = complete" claim was wrong.
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

## Residual / follow-on (named data-loss debt, per the red-team)

- **FX-1c — the DELETE-symmetry guard.** The other half of the books precedent: a
  `pendingDeleteSync` tombstone set so a locally-deleted-but-unsynced record is not
  resurrected by a stale remote splat, for arcs/subTheories/themes/artifacts. Fully
  in-scope (state.js delete fns + integrations.js splat) — does NOT have the views.js
  coupling FX-1b has. **Preston's scope call: build now (option A) or defer (option B)
  — see STATUS.**
- **FX-1b — notebook's incoming ADD guard + the mergeBookDuplicates artifact site.**
  Both are views.js-coupled add-sites (notebook's 4 creation sites + the artifact
  repoint at views.js:8394), sequenced after B-M's views.js work lands. Tabled.
- **Finding C — pending-set growth on delete-before-sync.** `deleteArc`/
  `deleteSubTheory`/`deleteUserTheme` don't `clearPendingSync` (unlike `deleteBook`'s
  `clearPendingBookSync`). Inert for correctness (a deleted id is gone from state, so
  the clear-loop never revisits it) but the pending array grows unbounded for
  created-then-deleted-before-first-sync records. One-line fix per delete fn; folds
  naturally into FX-1c's delete-side work.
- Live throttled-Firebase corroboration on prestonpraxistest — post-deploy, pending
  Preston's sign-in (interactive/2FA — the one human-only step).
