# Books #6 — Stage 1: Cover integrity (placeholder + persistence)

## Changes
- **views.js** — new shared `buildSelfHealingCover(book, imgClass, placeholderFn)` (candidate-walk on `<img>` onerror → typographic placeholder; null/no-candidates → placeholder directly). Adopted at 3 call sites: `renderShelfBook` (shelf card), `renderBookDetail` (detail), `makeReviewCover` (review, refactored to delegate). `confirmReviewBooks` now persists `coverCandidates` (full list, not just coverUrl[0]) for both matched + no-match rows → shelf walks the same list review walked → shown==saved.
- **components.css** — `.book-detail-cover-placeholder` is now a typographic "cover pending" well (was an empty tinted box) + `.book-detail-cover-pending-title` / `-label`. `.shelf-book-cover-placeholder` gradient hardcoded hex `#ecdcae/#cfb06a` → `var(--surface)/var(--sunk)` (token-only + mockup-faithful).
- review row cp-lab text "no cover" → "cover pending" (mockup A row 4).

## Self-verify (PASS)
| gate | result |
|---|---|
| parse views.js (`new Function`) | PASS (466985 chars) |
| byte delta views.js | 465407 → 466985 (+1578) |
| byte delta components.css | 235259 → 236046 (+787) |
| diffstat | 2 files, +93/−50, scoped (no EOL flip / whole-file rewrite) |
| grep buildSelfHealingCover | 5 (1 def + 1 comment + 3 call sites) |
| grep coverCandidates in views.js | 10 |

## DOM-fidelity (localhost preview, SW bypassed)
- `buildSelfHealingCover` loaded: **function**
- null cover → returns placeholder node directly: **true**
- broken single candidate → starts `<img>`, swaps to placeholder after onerror: **true**
- candidate-walk (1st broken, 2nd valid data-uri) → stays `<img>`, src = 2nd: **true**
- `renderShelfBook({coverUrl:null})` → `.shelf-book-cover-placeholder`, title "Test Book", label "cover pending": **PASS**
- `renderShelfBook({coverUrl:'…'})` → `img.shelf-book-cover` with onerror listener: **PASS**
- console errors: **none**

## Residual (live-Charles ship gate)
- Full persistence round-trip (review-confirm a matched-with-cover book → reload → shelf shows SAME cover for "Empire of AI" / "On Critical Pedagogy") needs signed-in state; localhost Google sign-in is broken. Mechanism (candidate-walk) + write (coverCandidates persisted) are verified; the round-trip is a ship-gate Charles check.

PASS → committed local → continue Stage 2.
