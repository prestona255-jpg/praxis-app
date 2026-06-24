# Portrait Fidelity — GROUP 2 (hero reconciliation) · BUILT, VERIFY PASS

**Date:** 2026-06-24 · **Lane/worktree:** `peaceful-joliot-2f5c97` @ base `bcdce38`.
**Files:** `js/views.js`, `assets/components.css`. Shipped together with G1 (one push, CACHE_VERSION v3.143 → v3.144). No DOM-order moves. Hero is OUTSIDE the umbrella — handled per the crash lesson.

## The four locked calls (+ supporting edits)

| # | File | Change |
|---|------|--------|
| V1 | views.js (hero avatar) | Constellation slot render → **"P" monogram**: `heroSlot` class `account-slot cstl-host`#`account-cstl` (+ the `renderSubTheoryConstellation` SVG block) → `account-slot account-hero-monogram`, `textContent = (displayNameOverride‖displayName‖email‖'?').charAt(0).toUpperCase()`. Removed the `#account-cstl` id, `cstl-host` class, and the hero's `_accountBuildConstellationData()` call (the fn is still used by the cream slot 13422 → no dead code). |
| V2 | views.js (✎ helper + name pencil) | New local `function _heroPencil(label)` → a `span.portrait-pencil` (`role=button`, `tabindex`, `aria-label`, `✎`) wired `addEventListener('click', …_accountToggleEditForm(profileBlock, editBtn))`. **Pure closure over the function-scoped `profileBlock`/`editBtn` — NO `document.getElementById`/`querySelector` (crash-safe; hero is outside the umbrella).** Appended into `heroName`. |
| V3 | views.js (descriptor pencil) | `heroTagline.appendChild(_heroPencil('Edit description'))` inside the `if (profile.tagline)` block. |
| V4 | views.js ("Publishing as") | de-emphasized: class `account-field-hint` (shared) → new `account-hero-pubas` (so the shared hint class is untouched). |
| V5 | views.js (email relocate) | Removed the hero `emailLine` block; added `account-email-line` "Signed in as <email>" into the **"your data"** card (after the covenant). Dropped the hero-only `account-signin-copy` class. |
| V6 | views.js (stance line) | After `wrap.appendChild(hero)`, before VALUES (outside umbrella): `p.portrait-stance` = `span.portrait-stance-dot` + verbatim text **"Everything below is yours. Yumi offers; you decide what it means."** |
| C1 | components.css | Broadened `.account-hero .account-email-line` → `.account .account-email-line` (so the relocated email keeps quiet-mono styling). |
| C2 | components.css | NEW additive G2 block (all `.account`-scoped, token-only): `.account .account-hero .account-hero-monogram` (var(--grad) + 1.5px var(--gold-light) ring + centered 42px serif-600 var(--text-on-dark)); `.account .account-hero-pubas` (12px body var(--muted)); `.account .portrait-pencil` (+ `:hover`/`:focus-visible`); `.account .portrait-stance` + `.account .portrait-stance-dot`. |

## VERIFY battery — ALL PASS

| Gate | Result |
|------|--------|
| Byte deltas (vs base `bcdce38`) | views.js 635348 → **636638 (+1290; G2 ≈ +1088)**; components.css 371160 → **373865 (+2705; G2 ≈ +1857)**. Additive. |
| EOL integrity | `git diff --stat` localized (views 87 / components 103 lines). CRLF = total lines BOTH files (14481/14481, 10548/10548) → zero bare-LF. |
| cscript parse (views.js) | **PARSE: PASS (636638 chars)**. |
| Banned-token gate = baseline | Diff-proven: no added const / let / `class` keyword / `=>` / `.catch` / `.finally` / backtick. |
| No new hex (declarations) | Only `#hex` on an added line is the **G1 galaxy comment** (block-comment middle line), not a declaration. G2 declarations token-only (`var(--grad)`, `var(--gold-light)`, `var(--text-on-dark)`, `var(--muted)`, `var(--gold)`, `var(--ink-4)`). |
| **HERO-WIRING SAFETY (mandated)** | Hero region (13088–13225) element-lookup/addEventListener grep: only `signinBtn.addEventListener` (pre-existing signed-out path, 13113) + my `pen.addEventListener` (13164). **NO `getElementById`, NO `document.querySelector` anywhere in the hero region** → the ✎ cannot throw before `wrap` is attached. |
| CSS scoping | All new selectors `.account`-scoped (grep: NONE unscoped). |
| Umbrella intact | 4 portrait catches present (VALUES 13326 / REVEALED-SELF 13844 / JOURNEY 13873 / CAPSTONE 13974). Hero/stance/monogram edits OUTSIDE the umbrella and render-throw-safe (string-fallback monogram; closure-wired ✎; plain DOM for stance/email). |
| Copy parity | Stance line verbatim (periods + spacing exact). |
| Dirty-file scope | Only `js/views.js`, `assets/components.css` (+ untracked checkpoint docs). |

## Spotted-for-G4 (NOT fixed here — governance scope, no bundling)
- The "your data" covenant copy uses a **straight apostrophe** `they\'re` (views.js ~14071); mockup is curly ’. Folds into G4's governance verbatim sweep (along with the actions-row + clay-danger alignment).

## STATUS
G1+G2 built + mechanically verified → shipping as one push (CACHE_VERSION v3.143 → v3.144). **Then HALT for Preston's live visual smoke of the top-of-page** (hero monogram + stance + ✎ + relocated email; G1 type/spacing/grid/galaxy/radius). G3 (DOM-moving group) waits for that look. Anything off is fix-forward (changes are render-throw-safe), not a revert.
