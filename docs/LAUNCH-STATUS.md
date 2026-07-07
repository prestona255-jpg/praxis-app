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

## Remaining — launch-critical

- [ ] F-DL1 — live smoke (throwaway-account clobber repro; persistence unverified until run)
- [ ] F-DL3 — live smoke (throwaway-account clobber repro; persistence unverified until run)
- [ ] F-DL4
- [ ] NB1
- [ ] OG1
- [ ] OG2
- [ ] OG3
- [ ] OG4
- [ ] Pass 3

## Infra (this Build 1)

- Fix & build discipline: `docs/FIX-PROTOCOL.md` (v1.2)
- Commit gate: `hooks/pre-commit` — activate with `git config core.hooksPath hooks` (this repo: armed)
- Subagents: `.claude/agents/{repo-mapper, fix-red-team, fix-implementer}.md`
