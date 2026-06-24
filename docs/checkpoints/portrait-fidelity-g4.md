# Portrait Fidelity — GROUP 4 (governance actions row + apostrophes) · BUILT, VERIFY PASS

**Date:** 2026-06-24 · **Worktree:** `peaceful-joliot-2f5c97` (on top of the local G3 commit `c04cbd6`). Ships WITH G3 (one cache bump v3.144 → v3.145).
**DECISION (Preston):** the mockup's **"Theme" ghost button is OMITTED** — Praxis has no theme feature (single Umber dark; "No Theme button" code note) and Non-goals forbid new features. The mockup's Theme is treated as illustrative chrome (DATA), like its sample book titles.

## Edits
| # | File | Change |
|---|------|--------|
| 1 | views.js (editBtn) | `'btn btn-ghost account-secondary-btn'` → `'btn btn-primary'` — Edit profile is now the gradient primary (`.btn-primary` = `var(--grad)` + `--br-deep` text). Export to JSON + Sign out stay ghost ⇒ **actions row = 1 primary + 2 ghost** (mockup minus the omitted Theme). |
| 2 | views.js (covenant) | `they\'re` (straight) → `they’re` (curly). |
| 3 | views.js (danger desc) | `can\'t` (straight) → `can’t` (curly). |
| 4 | components.css (delete btn) | Re-scoped `.account .notebook-new-entry.account-delete-btn` (+ `:hover`) → `.account .account-delete-btn` (+ `:hover`). The stale `.notebook-new-entry` qualifier never matched the live `btn btn-ghost account-delete-btn`, so the **clay danger** styling (transparent + `--danger-line` border + `--danger` text) never applied — now it does, aligning to the mockup's clay delete link. |

**Not changed (already aligned):** the danger CARD is already clay (`.account-card.account-danger` = `--danger-line` border + danger wash; label = `--danger` mono uppercase). The transparency block STAYS (Preston's call) — untouched.
**Minor accepted residual:** Edit profile no longer shows the `account-edit-active` gold-border active state (that rule is scoped to `.account-secondary-btn`, which the primary button drops); the form revealing + scrolling is the feedback. The ✎ pencils + Edit-profile button still toggle the form correctly (closure over `profileBlock`/`editBtn`).

## VERIFY — ALL PASS
| Gate | Result |
|------|--------|
| Copy parity | straight `they\'re`/`can\'t` remaining = **0**; curly `they’re`/`can’t` present; actions labels verbatim ("Edit profile" / "Export to JSON" / "Sign out"); **1 primary + 2 ghost** (no Theme). |
| Danger re-scope | `.account .account-delete-btn` (+ `:hover`) now match the live button (14015); the lone surviving `notebook-new-entry.account-delete-btn` string is in the documenting comment only; arc-detail delete (`arc-detail-delete`) untouched. |
| Byte deltas (small) | views.js 630875 → **630857 (−18)**; components.css 372064 → **372219 (+155, comment)**. |
| EOL | all-CRLF (14343/14343, 10503/10503). |
| cscript parse | **PARSE: PASS (630857 chars)**. |
| Banned-token = baseline | NONE added. |
| No new hex (declarations) | NONE. |
| Umbrella intact | 4 portrait catches present. |
| diff scope | views 6 lines / components 10 lines — tiny, localized. |

## STATUS
G3 + G4 both PASS → shipping together (one cache bump v3.144 → v3.145). Mandatory post-ship structural smoke follows (cream slot is OUTSIDE the umbrella → AUTO-REVERT on blank/crash).
