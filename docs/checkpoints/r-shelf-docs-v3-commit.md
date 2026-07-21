# R-SHELF docs v3 — commit record

Session: docs-only landing (Opus 4.8). Base HEAD `36b7d45`.

## The divergence, resolved (option a, Preston-ruled)
The task assumed v3 lived only in chat and the tree held v2. Preflight (L1) found
**v3 already committed at `36b7d45`** (pushed, HEAD==origin/main): `docs/studio/r-shelf-brief.md`
is the correctly-spliced v3 (20,922 B).

The recovered root file `r-shelf-brief (1).md` (12,251 B) is the **paraphrase-DIRECTIVE
draft** — its carry-forward sections are directives ("Carry v2's finding text verbatim"),
not the actual v2 text (v2-verbatim §1 grep = 0). Committing it byte-faithful would **FAIL**
the splice diff-gate (carry-forward not byte-identical to v2). Per the task's own HALT clause,
it was NOT committed. It is left **untracked** in the repo root.

## Splice diff-gate (on the committed `36b7d45`) — PASS
Every `[CARRY-FORWARD]` block byte-identical to v2 at `3f5df8b` (§1 finding, §2 forks +1
authorized F9 pointer, §4 laws 1-7, §5 mandates, §6 recon 1-7, §7 seams, §8 non-goals,
§9 Q1-6, §10 record); `[NEW v3]` §3 THE FELT DIAL (3.1-3.8) + `[AMENDED v3]` Law 8 FELT CANON,
the spawn rule, recon items 8-10 authoritative as written; provenance line present.
**GATE (the July-17-original tell): the Law-1 illumination rider is present** —
"…cover opacity only — cavity ground never changes under illumination…" (brief line 102,
verified in the committed bytes via `git show 36b7d45`).

## This commit (docs-only)
- `docs/studio/lessons.md` (NEW, 4,430 B) — the fault-pattern canon L1-L10 + mechanical truths +
  amendment rule. Grep: `^\*\*L[0-9]` = 10.
- `docs/studio/acceptance-card.md` (NEW, 5,602 B) — acceptance-card protocol + template + the
  R-SHELF SEED card + the ELEVATION LOOP trial. `Base commit:` set to `36b7d45` (the one
  authorized mechanical edit). Grep: `ELEVATION LOOP` = 1, `SEED CARD` = 1.
- this checkpoint.

No app code, no cache bump, no Builder regen, no push. The v3 brief itself is unchanged
(already landed at `36b7d45`). Commit subject reflects the actual diff (lessons + card), not
the brief, per L1/L2 — the brief is referenced, not re-claimed as content of this commit.
