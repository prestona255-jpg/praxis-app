# Portrait Fidelity — GROUP 3 (remove cream slot + reorder) · BUILT, VERIFY PASS, COMMITTED LOCAL

**Date:** 2026-06-24 · **Worktree:** `peaceful-joliot-2f5c97` (base v3.144 `54395f6`). Local commit only — ships WITH G4 (one cache bump) once G4's actions-row ambiguity is resolved.
**Affirmation-A relaxed for G3 (DOM-moving):** deletions = EXACTLY the enumerated cream-slot set; one 4-line documenting comment added in its place.

## Deletions (the enumerated cream-slot set)
| File | Removed |
|------|---------|
| views.js 13405–13450 | The "shape of your thinking — tap a mark" eyebrow + `account-constellation-slot` div + its `renderSubTheoryConstellation` render + delegated mark-click wiring + `appendChild`. Replaced by a 4-line comment (the only insertion). |
| views.js 11695–11789 | `_accountBuildConstellationData()` + its doc comment (last caller was the cream slot → **0 callers** after removal). |
| components.css 7076–7100 | `.account-constellation-slot` (+ `-filled`, `-filled svg`) — 3 rules + comments. |
| components.css 8263–8282 | `.account-constellation-slot [data-st-yumi]` + `.account-constellation-slot .st-drift` (+ `:hover`) — 3 rules + comments. |

**Left in place (NOT enumerated / shared):** `_accountOpenMark` (def 11387) — dead-but-uncalled after removal (its only caller was the cream slot); the comment at 10143 merely references it by name; harmless, removing it would exceed the enumerated set. `.account-panel-head` etc. (8284+) — SHARED by category + mark panels, stays. `cstl-host` / `#account-cstl` — home-preview + arc-detail only, untouched.

## Resulting order
hero (monogram + stance) → VALUES (13131) → profile editor `account-edit-form` **`display:none`** (13237, revealed by ✎ / Edit-profile) → **COUNTS** (`your reading life` 13317 / `account-stats` 13325) → REVEALED-SELF (13343) → … ⇒ **visually hero → values → COUNTS → revealed.**

## VERIFY — ALL PASS
| Gate | Result |
|------|--------|
| **CRASH-SAFETY dangling refs** (cream slot is OUTSIDE the umbrella) | `account-constellation-slot` **0** (views+css); `_accountBuildConstellationData` **0**; cream locals (`slotEyebrow`/`constSlot`/`constData`) **0**; lone "shape of your thinking" hit = the replacement *comment*. **0 dangling refs.** |
| Deletions = enumerated set only | `git diff --stat` = views 146 lines / components 47 lines; **189 deletions, 4 insertions** (the comment). Deletion-heavy, localized — no other section touched. |
| Byte deltas (G3, negative) | views.js 636638 → **630875 (−5763)**; components.css 373865 → **372064 (−1801)**. |
| cscript parse (views.js) | **PARSE: PASS (630875 chars)** — no structural break from the function removal. |
| Umbrella intact | 4 catches present + bounding: VALUES 13230 / REVEALED 13706 / JOURNEY 13735 / CAPSTONE 13836 (line nums shifted up by the deletions). |
| Banned-token = baseline | No added const/let/class/=>/.catch/.finally/backtick. |
| No new hex | NONE (the 4 insertions are comment lines). |
| Scoping | No new selectors (removals only). |
| EOL | All-CRLF both files (14343/14343, 10501/10501). |

## STATUS
G3 committed locally. **Proceeding to G4 → HALTED on the actions-row ambiguity** (mockup shows a "Theme" ghost button; Praxis has no theme feature + a "No Theme button" code note + Non-goal "no new features"). Awaiting Preston's call before G4 edits. No ship until G4 passes.
