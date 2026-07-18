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
| NB1   | notebook writeline made visible — `.nb-ce` typed → `--br-deep` (16.4:1), placeholder → `--gold-ink` (5.70:1) on the cream composer; AA in every state | `165bbe3`… | v3.182 |
| OG1-4 | honest front door — signed-out #home no longer fakes "Welcome back" + a personal dashboard (real Sign-in CTA); nav avatar no longer fabricates a "P"/"Your account" when signed out (silhouette + "Sign in"); signed-out #arcs and the public seed-arc payoff carry a "Build your own arc" CTA; new signed-in accounts greeted "Welcome to Praxis." | (this commit) | v3.183 |
| IA4   | onboarding hand-off — "Enter Praxis" routes the finished new reader into the writing loop (`#book/<shelved>` else `#notebook`), not left on Home | `599a6dd` | v3.183 |
| F-DL4 | shared-tab account-switch latch race — `clearUserState()` now resets all 10 cloud-sync latches (8 `*Loaded` + 2 `*WritePending`) via a new `resetSyncLatches()` in integrations.js; account B no longer inherits A's loaded/write-pending state on a same-tab switch | (this commit) | v3.184 |

## Remaining — launch-critical

- [ ] F-DL1 — live smoke (throwaway-account clobber repro; persistence unverified until run) — BLOCKED: no test session connected (only the real account); needs a provisioned throwaway
- [ ] F-DL3 — live smoke (throwaway-account clobber repro; persistence unverified until run) — BLOCKED: same, needs a provisioned throwaway
- [x] F-DL4 — clearUserState resets all 10 sync latches on account switch — SHIPPED (this commit) / v3.184; red-team clean. LIVE SMOKE PENDING (needs a provisioned 2-account test session — the shared-tab A→B switch; the only connected browser is the real account, not signed out)
- [ ] F-DL5 (follow-up, not launch-critical) — the pre-existing stale-callback races the load callbacks carry no uid-guard: (a) an in-flight A read re-setting a `*Loaded` latch after reset; (b) A's deferred single-doc write dropped on a mid-load switch. F-DL4's reset does NOT worsen either. Proper close = an auth-generation token / per-callback uid-guard.
- [ ] RM-SPLAT (follow-up, not launch-critical; R-ARC Slice 8, 2026-07-18) — `replaceReaderModel` REPLACE-splats the WHOLE `readerModel.threads` array (not a per-record merge), so two devices dismissing/editing different threads while offline can clobber each other's un-synced write. PRE-EXISTING pattern-(B) property (F-DL5-adjacent), NOT introduced or worsened by Slice 8's tombstone (same mutate→saveState→saveReaderModelToFirestore shape as delete/edit/add). Gets its hard review HERE in the beta-readiness basket. Proper close = per-record merge or an auth-generation guard (co-review with F-DL5).
- [x] NB1 — notebook writeline AA-legible (typed 16.4:1 / placeholder 5.70:1), SHIPPED (this commit) / v3.182
- [x] OG1 — signed-out #home honest (no fake "Welcome back"/dashboard); new-account greeting "Welcome to Praxis." — SHIPPED (this commit) / v3.183
- [x] OG2 — signed-out nav no longer fabricates a "P" avatar + "Your account" (person silhouette + "Sign in") — SHIPPED (this commit) / v3.183
- [x] OG3 — signed-out #arcs + public seed-arc payoff carry a "Build your own arc" Sign-in CTA — SHIPPED (this commit) / v3.183
- [x] OG4 — dead "No arcs yet / Nothing open" dashboard widgets removed for signed-out — SHIPPED (this commit) / v3.183
- [x] IA4 — onboarding hands off into the writing loop, not Home — SHIPPED (this commit) / v3.183
- [ ] OG/IA4 residual — VISUAL eyes-on: the signed-out front door / nav silhouette render at 390 + ~1280 is presentational (reuses the shipped `buildSignedOutPrompt` look); Preston's eyes-on pending. Not launch-blocking.
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
