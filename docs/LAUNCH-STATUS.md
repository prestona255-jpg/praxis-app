# Praxis — Launch Status Ledger

Standing §1 status ledger referenced by `docs/FIX-PROTOCOL.md` §2 (Stage 2:
"Update the status ledger in the SAME commit"). One row per launch-critical
item — what shipped (with its SHA + CACHE_VERSION) and what remains. The commit
gate updates this file in the same commit that ships each item.

Seeded 2026-07-06 at HEAD `9914dd9` (== origin/main). SHAs below are verified
against `git log`; the remaining-set reflects the launch brief, not an
independent audit.

## Shipped

| Item  | What                                                                        | SHA       | CACHE  |
|-------|-----------------------------------------------------------------------------|-----------|--------|
| F-DL1 | load-resolved sync latches — stop outgoing REPLACE clobber on 5 collections | `c70f0dc` | v3.178 |
| F-DL2 | books outgoing-clobber latch beside `pendingBookSync`                        | `d1a8f6a` | v3.179 |
| F-DL3 | profile + readerModel outgoing-clobber latch (pending-flag + tail re-fire)  | `9914dd9` | v3.180 |
| VC1   | journal-register covenant leak — 4 readers (considerMove/scan/`_memberBodies`/gatherArcContext) now apply the isPrivate-OR-journal predicate; `#yumi-sees` no longer lies | `165bbe3` | v3.181 |
| NB1   | notebook writeline made visible — `.nb-ce` typed → `--br-deep` (16.4:1), placeholder → `--gold-ink` (5.70:1) on the cream composer; AA in every state | (this commit) | v3.182 |

## Remaining — launch-critical

- [ ] F-DL1 — live smoke (throwaway-account clobber repro; persistence unverified until run)
- [ ] F-DL3 — live smoke (throwaway-account clobber repro; persistence unverified until run)
- [ ] F-DL4
- [x] NB1 — notebook writeline AA-legible (typed 16.4:1 / placeholder 5.70:1), SHIPPED (this commit) / v3.182
- [ ] OG1
- [ ] OG2
- [ ] OG3
- [ ] OG4
- [x] VC1 — Pass 3's launch-critical journal-covenant leak — SHIPPED `165bbe3` / v3.181; live covenant smoke pending (throwaway acct: set journal register → Visible, write a journal note, confirm it is absent from `#yumi-sees` and Yumi never references it)
- [ ] Pass 3 residuals — should-fix / post-launch (WL1/WL2/VC2/VC3/CR2/IA1/IA4/IA5/IA6 …); tracked in `docs/audit/fable-audit-combined.md`, not launch-critical

## Infra build log

- **Build 1** (`c8a05ca`): fix-infra foundation — `docs/FIX-PROTOCOL.md` (v1.2),
  the 3 subagents (`repo-mapper`, `fix-red-team`, `fix-implementer`),
  `hooks/pre-commit` commit gate, and this ledger.
- **Build 2a** (`b8edb92`; ground-truth exit-0 fix `83f213e`): protocol additions
  + scripts — §11 Post-push rollback, §2 deploy build-lag header nuance, §10
  Draft-for-OK (#7) + `proposals/`, `tools/ground-truth` (session-start check),
  `tools/parse-check` (cscript parse harness; extensionless so it is not treated
  as served source).
- **Build 2b** (this commit): reviewer wiring + hands-off data-loss — §5 rewritten
  into three tiers (data-loss ships hands-off ONLY behind red-team-clean + Build-3
  smoke; interim = genuine human read), §1 Stage-0 recon reviewer gate (#8), §9 now asserts a
  script's EXIT CODE not just its output, and `hooks/pre-commit` rule #3 exempts
  `tools/` (like `docs/`).

Activation reminders (per clone / per session):
- Commit gate: `hooks/pre-commit` — activate with `git config core.hooksPath hooks`.
- Session start: run `sh tools/ground-truth`.
