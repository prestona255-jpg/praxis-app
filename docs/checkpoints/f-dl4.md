# F-DL4 — shared-tab account-switch latch race — BUILD

F-DL4 STARTED @ HEAD 599a6dd / v3.183 → v3.184. Data-loss / state tier. Recon+map: f-dl4-recon.md.

## Fix (2 files — load-order constraint state.js BEFORE integrations.js)
| File | Change |
|------|--------|
| js/integrations.js | new top-level `function resetSyncLatches()` beside the latch decls (~:63): sets all **10** latches false (8 *Loaded + 2 *WritePending) |
| js/state.js | `clearUserState()` ends with `if (typeof resetSyncLatches === 'function') { resetSyncLatches(); }` (runtime-only, typeof-guarded cross-file call) |

## Mechanical gates
- Parse: state.js **exit 0**, integrations.js **exit 0** (harness self-validates — proven in OG run).
- ES3 scan additions → **clean**.
- resetSyncLatches assignment count = **10** (grep `= false;`). Matches the full latch set (no missing/extra).
- Byte delta (git diff --stat): integrations.js +23, state.js +8, sw.js +1 — localized, no EOL flip.
- sw.js: v3.183 → v3.184 (exactly +1).
- Scope: only the 3 files. `pendingBookSync`/`pendingBookDeletes` (per-uid, isolated) correctly untouched.

## Gate: deep §9 fix-red-team (data-loss tier) → **CLEAN** (f-dl4-redteam.md).
No block-commit findings. Reset set exact (10/10); no NEW silent-loss (strictly equal-or-better — suppresses the spurious B-write); reachability + 4 call sites correct; F-DL5 read-race + write-drop sibling pre-existing, not worsened. Parse exit 0 both, harness self-validates, cache v3.183→v3.184.

## Live SMOKE — BLOCKED, flagged (not faked)
The shared-tab A→B switch smoke needs TWO test accounts in one tab. The only connected browser is
Preston's REAL account (prestona255@gmail.com) — I will NOT sign it out (an account-switch smoke from
real data risks triggering the very clobber under fix). No test session (prestonpraxistest@gmail.com +
a 2nd throwaway) is currently provisioned. Per the queue's explicit fallback + the F-DL1/F-DL3 code-first
precedent (both shipped with live smoke pending), F-DL4 ships on red-team-clean with the smoke flagged.
- **PENDING (human gate — provision a 2-account test session):** run f-dl4-recon.md §"Named live-smoke
  click-path". PASS = B's write survives + A's data intact after the switch.
- **Code-shipped live-verify (read-only, real account undisturbed):** deployed CACHE_VERSION v3.184;
  `typeof window.resetSyncLatches === 'function'`; `clearUserState.toString()` contains the reset call.
  (Do NOT call resetSyncLatches on the real page — it would transiently defer that account's saves.)

## Residual (documented, flagged): F-DL5 — the pre-existing stale-callback re-set race (load callbacks
carry no uid-guard). NOT introduced here; the latch reset is a strict improvement for the common case.
