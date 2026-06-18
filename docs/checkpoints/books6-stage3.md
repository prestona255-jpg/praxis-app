# Books #6 — Stage 3: Cleanup fidelity + detection

## Changes (views.js + components.css)
- **Detection** — `coverBrokenIds` session registry + `isCoverBroken(id)`; `buildSelfHealingCover` marks a book broken when all candidates fail (clears on a successful load). `scanLibraryForCleanup` now returns `wrongCovers` too: null/empty coverUrl → `missingCovers`; non-empty coverUrl that failed to load (registry) → `wrongCovers`. Count = missing + wrong → matches the blank cards on the shelf, not just nulls.
- **`reResolveCover`** now also refreshes `coverCandidates` and clears the broken mark, so a re-resolved book stops counting as wrong.
- **UI (mockup E)** — summary labels aligned ("duplicate records to merge" / "books missing or wrong covers" / "books on your shelf total"); added the before→after hero ("We found the missing covers"); cover items now render a before→after and split into **missing cover** (Skip / Find cover) and **wrong cover** (Keep / Swap); combined cap of 40. Resolve-all processes both lists.
- **CSS** — `.cl-hero`, `.cl-hero-tx`, `.before-after`, `.ba-col`, `.ba-lab`, `.ba-arrow`, `.cl-mid-cover`, `.cl-mid-text` (mockup widths 90px hero / 48px item) + mobile wrap.

## Self-verify (PASS)
- parse views.js: PASS (473846 chars). diffstat: 2 files +136/−30 (scoped).
- grep wrongCovers: 7; coverBrokenIds: 6. console errors: none.

### Live preview (seeded 5-book fixture, SW bypassed)
| book | coverUrl | broken? | classified |
|---|---|---|---|
| cbk1 | null | — | **missing** ✓ |
| cbk2 | http://x/broken.jpg | yes (registry) | **wrong** ✓ |
| cbk3 | http://x/good.jpg | no | excluded ✓ |
| cbk4 | http://x/d.jpg | no | excluded (dup keep) ✓ |
| cbk5 | null | — | **missing** + dup ✓ |

- report: missing=[cbk1,cbk5], wrong=[cbk2], dupGroups=1, total=5.
- summary tiles: "1 duplicate records to merge" · "3 books missing or wrong covers" · "5 books on your shelf total" ✓
- hero present, H3 = "We found the missing covers" ✓
- kinds rendered in order: duplicate, missing cover, missing cover, wrong cover ✓ (all three types)
- before→after count: 4 (1 hero + 3 items) ✓

## Residual / honesty
- The broken-cover (wrong) count depends on the shelf having rendered (registry is async-populated as covers load/fail). Cleanup is opened FROM the shelf, so the registry is populated by then. A genuinely-loadable-but-wrong-edition cover (loads fine, wrong book) is NOT auto-detectable from metadata — out of reach; the "Fix this book" path on book-detail covers that case manually.

PASS → committed local → continue Stage 4.
