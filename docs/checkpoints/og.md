# OG1–OG4 + IA4 — honest front door — BUILD

OG STARTED @ HEAD e861d59 / v3.182 → v3.183. Recon: docs/checkpoints/og-recon.md. Non-data-loss, presentational.

## Slices built (all reuse `buildSignedOutPrompt` — no new CSS/UX)

| # | Slice | File | Change |
|---|-------|------|--------|
| A | renderHome signed-out front door + honest greeting | js/views.js ~1418, ~1427 | `getCurrentUser()` null → `buildSignedOutPrompt('Welcome to Praxis', …)` + return (kills fake dashboard). Signed-in greeting `(haveArcs \|\| hasShelf) ? 'Welcome back.' : 'Welcome to Praxis.'` (OG1, OG4) |
| B | nav profile signed-out honesty | js/views.js ~436 | Signed-out: person-silhouette SVG (not 'P'), name '', sublabel 'Sign in', aria+title 'Sign in'. Signed-in restores initial/name/'Account'/aria + removeAttribute('title') — cycle-safe (OG2) |
| C1 | renderArcsPage signed-out CTA | js/views.js ~3639 | `!arcsUser` → `buildSignedOutPrompt('Build your own arc', …)` after examples (OG3) |
| C2 | renderArcDetail seed-arc foot CTA | js/views.js ~12527 | `arc.userId==='__praxis_seed__' && !user` → seed CTA (OG3 primary payoff) |
| D | intros.js onNext release handoff | js/intros.js ~386 | On "Enter Praxis": route `#book/<picked.bookId>` else `#notebook`, not left on Home (IA4) |

## Mechanical gates
- **Parse**: `cscript //E:jscript tools/parse-check js/views.js` → PARSE OK, **exit 0**; js/intros.js → PARSE OK, **exit 0**.
- **ES3 scan** of additions (`git diff | grep '=>|const |let |backtick'`) → **clean** (no arrow/const/let/backtick).
- **Byte delta** (git diff --stat): views.js +104/-22 lines (82 net new), intros.js +13/-1 (12 net new), sw.js 1 line. Localized — no EOL flip (104 lines in an ~18,500-line file).
- **sw.js**: CACHE_VERSION v3.182 → v3.183 (exactly +1).
- **Scope**: only the 5 slices + sw.js bump. index.html untouched (nav sublabel set via JS). Visibility-toggle bug untouched (moved to register redesign). Nav stays solid/no-blur (zero CSS added).

## Gate: §9 fix-red-team → **no block-commit findings** (og-redteam.md).
Byte deltas (LF-norm): views.js +3655 · intros.js +416 · sw.js +0. Parse exit 0 both; harness self-validates. Paths walked: signed-out home/nav/arcs/seed + new-user greeting + nav cycle-safety + IA4 routing — all sound.
Residual (non-blocking): VISUAL eyes-on the signed-out render (reuses the already-shipped #search buildSignedOutPrompt look — verified readable/styled live). Ledger + og docs staged in the commit.

## Ledger: LAUNCH-STATUS.md OG1-OG4 + IA4 rows updated in this commit.
