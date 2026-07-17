# PRAXIS — Fix & Build Protocol (v1.2)

Standing instruction set for **any staged code change** in praxis-app. Claude
Code loads this every session (via the pointer in CLAUDE.md). A fix prompt should
be SHORT and point here — the discipline below is inherited, not restated per
prompt. **Long doc, short prompts.**

Scope: Praxis only. (HQ has its own conventions.)

**New in v1.1:** auto-commit-on-green for rote fixes (§5), the FINAL-PASS SUMMARY
format (§5.5), an internal red-team pass (§9), the status-ledger rule (§1).
**New in v1.2:** the check enforcement is now a real blocking git hook (§5, §2);
the red-team pass is a named subagent that fires on EVERY fix (§9); Stage 0 has a
formal prior-fix regression check and a named live-smoke artifact (§1); and there
is a defined subagent roster + a dual-build procedure (§10).

---

## 0. The one rule that kills the ping-pong

**Chain the stages autonomously to the commit gate.** Do NOT stop for approval on
rote steps. Stop and surface for a human ONLY at a genuine fork (§4) or a failed
proof (§3). Everything else — recon, self-check, build, proof, checks, red-team —
runs in one unattended pass, then reaches the commit gate. For a proven,
non-data-loss fix it commits itself (§5); otherwise it HALTs with a compact
summary (§5.5).

---

## 1. The fix lifecycle

Stage 0 → 1 → 2. Stage 0 and Stage 1 **chain** by default. The commit gate is
either self-driven (§5) or a HALT (§5.5).

**Stage 0 — RECON (read-only)**
- **Write-test first:** create `docs/checkpoints/<fix>.md` with `<FIX> STARTED`,
  `type` it to confirm non-empty, then append. If empty, STOP. (Save-point if the
  chat paste drops — §6.)
- **Map first, if warranted.** If the fix touches a file a prior fix already
  patched, or cross-cutting sync/state logic, dispatch the **repo-mapper** agent
  (§10) BEFORE recon to build a fresh data-flow map from source. This is the
  antidote to stale premises.
- **Confirm anchors:** quote exact function + file:line for every site you'll
  touch. Mismatch, or code that contradicts the fix's premise → STOP (fork, §4).
- **Enumerate scope:** every file/collection/site. Confirm counts; don't trust a
  stated number.
- **Prior-fix regression check (#2):** when editing a file a prior fix touched,
  name that prior fix's anchors (its vars, flags, load callbacks) and confirm this
  edit sits BESIDE them — no shared/reused name, no edit landing on their code.
  Flag any collision.
- **Port check:** applies cleanly, or needs a variant? Flag every variant.
- **Named live-smoke artifact (#3):** for a data-loss / state / sync fix, WRITE
  the exact throwaway-account click-path into the checkpoint file now (stale-cache
  sign-in → the racing mutation → confirm the pre-existing cloud record survives),
  so the Stage-2 live smoke is ready, not improvised.
- State the planned edit + a **byte FLOOR** per file.
- **Recon reviewer gate (#8):** before building on the recon, dispatch
  `fix-red-team` (or `repo-mapper` when a stale premise is the risk, §10) to
  VALIDATE the recon itself — every anchor resolves to a real file:line, the
  premises hold against source, scope/counts are complete, no collision missed. A
  finding here STOPS the build before a line is written: catch a bad plan before
  it is built on, not only after.
- Clean and no fork → Stage 1. Fork → HALT.

**Stage 1 — BUILD + PROVE**
- Apply the change. New code obeys the invariants (§2).
- **PROVE it behaviorally** (§3) — never assert "done."
- Run the checks (§3): ES3 grep, parse gate, byte deltas, foundations MD5,
  staging scope.
- Any proof or check FAILS → STOP, report, do NOT patch-the-patch, do NOT commit.
- All green → **red-team pass** (§9) → then the commit gate (§5).

**Stage 2 — COMMIT**
- Explicit-file stage only the intended files. **Never `git add -A`. Never** stage
  `test-arc-constellation.html`. (The commit gate hook enforces this — §5.)
- **Update the status ledger in the SAME commit** (`docs/LAUNCH-STATUS.md` or the
  active board): what shipped, its SHA, the remaining launch-critical set. Mirrors
  the BOARD-rides-with-commit rule.
- `git show --stat` = exactly the intended files + the ledger.
- Push; confirm `HEAD == origin`; report the SHA.
- Re-md5 the byte-locked foundations (§2); confirm unchanged.
- Live-verify the deployed CACHE_VERSION.

---

## 2. Standing invariants (always true — never restate in a prompt)

- **ES3 only** in new code: `var` and `function` only. String concat. CSS
  variables only. NO `const`, `let`, arrow (`=>`), `class`, or backtick.
- **Parse-gate every edited JS file.** Node is blocked → use the `new Function()`
  cscript harness, and the harness must **self-validate** (fail a broken copy
  before it passes the real file). Neutralize reserved-word method names
  (`.catch`/`.delete`/`.finally`) for the parse only.
- **Foundations are byte-locked:** `lumen-amber.css` (MD5 `9879ddb8…`) and
  `marks.js` (MD5 `772886c0…`). Do NOT edit. Re-md5 and confirm at every halt.
- **Explicit-file staging always.** Never `git add -A`. Never stage
  `test-arc-constellation.html`.
- **Bump CACHE_VERSION** (`sw.js`) on any shipped change; live-verify after push.
  If the deployed CACHE_VERSION lags, check the response headers (`Age`,
  `Cache-Control: must-revalidate`) to distinguish a still-building deploy
  (build-queue lag) from a stale edge/browser cache BEFORE retrying — a slow
  Netlify build is not a failed deploy.
- **Seed sentinel is `__praxis_seed__`** — public worked-example paths depend on
  it; don't break them.

**Enforcement (#5).** These are backstopped by a blocking git pre-commit hook
(`hooks/pre-commit`, activated via `git config core.hooksPath hooks`). It hard-
BLOCKS a commit that stages a foundations file, stages `test-arc`, or stages
source without `sw.js`. It WARNS (does not block) on likely ES3 tokens in the
staged diff — real ES3 enforcement stays at the parse-gate + red-team, because a
raw-diff regex false-positives on comments/strings. `git commit --no-verify`
bypasses the hook in an emergency.
*(Confirm any invariant if it has drifted since this doc was written.)*

---

## 3. Verification standard — prove, don't assert

- **Diffs / grep counts** for what changed.
- **Parse-gate exit codes** for structure.
- **Behavioral proof** for behavior. For a data-loss or state fix the proof MUST:
  1. **Reproduce the failure** (before: data lost),
  2. **Show the fix** (after: data preserved),
  3. **Control** (normal path still works, nothing over-blocked),
  4. **Prove no NEW silent-loss path** — a guard that blocks the bad write but
     never flushes the deferred one. Check every branch: found / absent / error.
- **Byte deltas are FLOORS.** Agent estimates run ~2× low on comment/copy
  conventions — verify by diffstat + behavioral proof, not by matching the number.
  Where a delta is exactly predictable (a version string of equal length → +0 B),
  state it, and treat a nonzero result as a red flag (EOL flip). Watch the
  CRLF-vs-LF confound on Windows working trees; report the LF-normalized delta.
- **A declared band carries TWO figures** (Preston, 2026-07-17, FF-7 close): a
  **CODE band (hard ceiling)** + a **COMMENT allowance (soft)**. At self-verify,
  classify the diff (comment-line vs code-line bytes) and test each figure against
  its own band: a **CODE-band breach HALTS**; a **COMMENT-allowance overage clears
  by line classification** (trim provenance for headroom — S4/S5/3B-POLISH
  precedent) — and **neither is EVER silently widened**. This is why the ~2×-low
  estimate above does not, by itself, block a diff whose *code* floor is respected
  and whose overage is provably comment. Do NOT trim load-bearing provenance merely
  to hit a total number — the number is a floor, not a target. Rationale + the case
  that set this: `docs/checkpoints/r-arc-ff7.md` §4.

---

## 4. What counts as a FORK (the only reasons to stop mid-run)

STOP and surface — route to Preston, who may bring in Claude (chat) — when:
1. **Two or more valid approaches** exist (A vs B). Present them; don't pick silently.
2. **Scope would expand** beyond the stated files. Name it; don't reach.
3. **A residual/gap can't be closed** in scope. Document it; don't absorb it.
4. **An anchor doesn't match**, or the code contradicts the fix's premise.
5. **A proof or check FAILS** (including a real red-team finding).

None of these → proceed. Rote re-application of a proven pattern is NOT a fork.

---

## 5. The commit gate — self-drive, final pass, and the data-loss tier

At the commit gate the fix is built, proven, green, red-teamed (§9), and written
to its checkpoint file. Three paths, by tier:

**A. Self-drive (commit-on-green) — non-data-loss, proven pattern.** If ALL of:
- the fix re-applies an already-shipped-and-proven pattern, AND
- it does NOT touch data-loss / state-corruption logic, AND
- every proof and check is green, AND
- the red-team pass (§9) came back clean —
then Claude Code executes Stage 2 itself: stage the intended files + ledger,
`git show --stat` self-check, push, re-md5 foundations, live-verify. The
`hooks/pre-commit` gate (§2) is the hard backstop on staging mistakes. **Abort
before push on any self-check or hook failure and report.** No human hop.

**B. Final pass (HALT) — NOVEL, non-data-loss.** A novel fix that does not touch
the data-loss / state tier is not a proven pattern, so it does not self-drive:
HALT and emit the FINAL-PASS SUMMARY (§5.5); Preston reads it and types
`commit and push`.

**C. Data-loss / state tier — hands-off ONLY when doubly gated.** A fix that
touches data-loss / state-corruption logic ships **hands-off** ONLY when BOTH:
  (a) the fix-red-team pass (§9) returns clean, AND
  (b) the automated live smoke PASSES on real Firestore (the Build-3 rig).
Both green → Claude Code drives Stage 2 itself, as in path A.

> **HANDS-OFF PENDING: Build 3 smoke.** Until the Build-3 automated smoke exists
> and is proven deterministic, condition (b) cannot be satisfied, so the
> data-loss tier does NOT ship hands-off. Interim rule: red-team clean + the
> FINAL-PASS SUMMARY (§5.5) + a **genuine human read** of that summary — at least
> as thorough as path B's read, and Preston may route it to Claude-chat — before
> he types `commit and push`. This is deliberately NOT a glance or a one-tap: the
> scariest tier gets the MOST human scrutiny in the interim, not the least. The
> fix-red-team subagent (§9) raises the floor beneath that read; it does not lower
> the bar or replace it. Any red-team finding, or any non-green proof, still
> hard-STOPS — every tier. The no-human path is reserved strictly for when BOTH
> (a) and (b) are satisfiable — i.e. once the Build-3 smoke is live.

**Default posture:** self-drive stays scoped to proven-pattern + non-data-loss +
fully-green + red-team-clean. The data-loss tier is hands-off only behind the
(a)+(b) double gate; until Build 3 it takes a genuine human read (never lighter
than a novel fix's). To widen or narrow, change this section.

---

## 5.5 FINAL-PASS SUMMARY (the compact review block)

When a fix HALTs for a human final pass, emit this — and ONLY this — for the
reviewer to copy in one paste (the full run stays in the checkpoint file):

```
FINAL-PASS — <fix> @ <HEAD sha> → CACHE_VERSION <next>
FILES: <files to be staged>  (+ ledger)
PROOF 1 clobber-prevented: before <remote=…> / after <remote=…>   PASS/FAIL
PROOF 2 no-stranding:       found <…> / absent <…> / error <…>     PASS/FAIL
PROOF 3 control:            <…>                                     PASS/FAIL
PROOF 4 <fix-specific>:     <before/after>                          PASS/FAIL
BYTES: <file> <actual, LF-norm> (floor <floor>) · sw.js <actual, expect +0>
PARSE: harness self-check <fail#>/exit0 · edited file exit <n>
FOUNDATIONS md5: lumen-amber <ok?> · marks <ok?>
git show --stat preview: <files>
RED-TEAM (§9): <clean | findings>
RESIDUALS: <R1/R2/…>
```

Small, scannable, everything a reviewer needs to say go/no-go. No wall of log.

---

## 6. Paste-pipe workaround

The chat paste sometimes drops report content (arrives blank). Reliable channel is
**write-test-first** (§1): every recon and proof is written to
`docs/checkpoints/<fix>.md` AND printed. If a paste drops, the file is the source
of truth — read the key lines from there.

---

## 7. Subagents (general)

Fan out with the Agent tool to parallelize **breadth** (as in the audit's
multi-agent sweep) or to keep a noisy side task (deep search, a mapping pass) out
of the main context. The orchestrating run owns this protocol and the halts —
subagents don't change the fork or commit rules, and never reach the chat side.
The named agents for THIS protocol are in §10.

---

## 8. Writing a fix prompt against this doc

```
FIX <name> — <one-line scope>. Follow docs/FIX-PROTOCOL.md.
Model: <model>. Repo: <path>. HEAD <sha> / <version>.
Recon: docs/checkpoints/<fix>.md   (or: "run Stage 0")
SCOPE: <files/collections>.  NON-GOALS: <fix-specific don't-touch>.
Chain Stage 0→1 to the commit gate; HALT on any fork (§4) or failed proof.
<Any fix-specific proof requirement.>  CACHE_VERSION → <next>.
[optional] DUAL-BUILD — this fix is catastrophic; run the §10 dual-build.
```

Non-goals defaults, staging, ES3, parse gate, byte deltas, foundations lock, the
fork/commit rules, self-drive vs final-pass, the red-team pass, and the mapper all
come from this doc.

---

## 9. The red-team pass — every fix (agent: fix-red-team)

Before the commit gate, dispatch the **fix-red-team** subagent (§10) to attack the
fix against this protocol — an adversarial self-review, not a victory lap. It fires
on EVERY fix, depth-scaled: deep on data-loss/state, quick on rote, skipped only
for a pure version-bump / comment-only diff. It looks for: claims asserted but not
proven; branches left uncovered (esp. absent/error flush paths); "fixed the test,
not the code" (source byte-unchanged? failure reproduces with the mechanism
removed?); trivially-passing checks (a parse harness that never failed a broken
copy); **a script or tool asserted by its printed OUTPUT only, never its EXIT CODE
on the success path** — re-run it and confirm `$?` is 0 when it should be (the
exact gap that shipped `tools/ground-truth` exiting 1 on success); scope drift;
silently-absorbed residuals; prior-fix regressions. It returns `RED-TEAM: clean`
or findings. A real block-commit finding = a failed check: the fix does NOT
self-commit; it returns to a human.

This pass raises the floor on EVERY tier. Under §5 it does NOT lower the human bar
on the data-loss tier: interim, that tier still gets a genuine human read of the
FINAL-PASS SUMMARY (at least as thorough as a novel fix's), and it goes fully
hands-off only once the Build-3 smoke gates it (§5 path C). The red-team is
additive to that read, never a substitute, so a soft "looks fine" pass is itself a
failure; when in doubt it returns a finding, not a blessing.

---

## 10. The subagent roster + the dual-build procedure

Three named agents live in `.claude/agents/`:

- **repo-mapper** (read-only) — builds a fresh data-flow map from source before a
  recon. Dispatch when a fix touches a prior-fix file or cross-cutting sync/state
  logic (Stage 0). Kills stale premises.
- **fix-red-team** (read-only) — the adversarial reviewer of §9. Dispatch before
  every commit gate.
- **fix-implementer** — implements a fix from a spec as a PATCH (not a commit).
  Used ONLY for dual-build (below).

**Dual-build (#6) — INVOKE-ONLY.** Not automatic. It runs only when a fix is
tagged `catastrophic` (by Preston, or by Claude flagging it). Procedure:
1. Dispatch TWO `fix-implementer` agents in parallel on the same spec, each in
   isolation, each producing a unified-diff PATCH + rationale + behavioral proof
   (neither commits, neither collides with the other's tree).
2. Diff the two patches. **Where they AGREE, the design is unambiguous. Where they
   DIVERGE, the problem is genuinely ambiguous — surface that divergence to a human
   before applying anything.**
3. On the human's decision, apply the chosen (or merged) patch through the normal
   Stage 1 → red-team → Stage 2 flow.

Dual-build is the expensive tool (~2× cost/time). A normal data-loss fix does NOT
need it — single implementer + the §9 red-team is the proven floor. Reserve it for
the one fix a launch where being wrong is catastrophic.

**Draft-for-OK (#7) — CC never self-activates its own machinery.** When a build
surfaces a recurring need for a NEW subagent, a protocol change, or any new
machinery, CC **drafts** it into `proposals/` (a spec file, INERT) and flags it in
the final summary. A drafted proposal is NOT copied to `.claude/agents/`, NOT
wired into this protocol, and NOT run — it stays inert until Preston reviews and
lands it in a deliberate commit. A proposal is a suggestion, never a fait
accompli. See `proposals/README.md`.

---

## 11. Post-push rollback

To undo a pushed commit **X** that shipped a bad change:

1. **`git revert --no-commit <X>`** — do not let revert auto-commit. X shipped
   its source *with* a `sw.js` bump, so a plain `git revert` reverses BOTH hunks:
   `sw.js` is re-staged too (the hook is *satisfied* — it does NOT catch this),
   but CACHE_VERSION moves *downward*, which does NOT bust the cache for clients
   already on the newer version. `--no-commit` lets you correct that first.
2. **Bump `sw.js` CACHE_VERSION forward** to a NEW value ABOVE the current live
   one (never the reverted-back number); stage `sw.js` with the revert. The hook
   is now satisfied (source + sw.js together) and the SW actually invalidates.
3. **Update `docs/LAUNCH-STATUS.md`** in the SAME commit: mark X reverted (its
   SHA), record the rollback SHA + new CACHE_VERSION, and re-open whatever X had
   closed.
4. **Commit** (explicit-file, em-dash subject), **push**, wait for the Netlify
   build.
5. **Live-verify** the deployed CACHE_VERSION per §2 — use the header check to
   tell build-queue lag from edge cache before declaring failure.

A commit that stages only `docs/` or `tools/` files (or files with none of the
`.js/.css/.html` extensions) needs no cache bump — a plain `git revert <X>`
passes the hook. Any commit that stages one of those extensions outside `docs/`
and `tools/` trips rule #3 and must ride a `sw.js` bump (or be handled per the
gate's exemptions).
