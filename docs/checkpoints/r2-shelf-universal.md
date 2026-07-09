# R2 SHELF LIVE BUILD — Universal skin + 8 features — STARTED

HEAD f629a43 · main · working tree carries the R2 mockup/eval/infra (prior stages, related).
Spec = docs/studio/mockups/shelf.html (Universal state). MOCKUP WINS on any disagreement.

## Stage 0 — recon facts (confirmed)

- Shelf wrapper: `wrap.className='shelf lum-amber-deep'` (views.js:3751). Scope for the skin = `.shelf.lum-amber-deep`.
- Live shelf CSS block: components.css 11283-11400 (base Amber). Base card/tick CSS 2320-2500.
- renderShelf 3730 · renderShelfBook 4914 · renderShelfBookRow 5022 · renderShelf called 40× (sole update path).
- Arc data: `arc.bookIds` = array of `{id, addedAt}` (state.js:1776-1782). A book is in an arc if arc.bookIds has an el with `.id === book.id`.
- Write path (move-to-arc): `addBookToArc(arcId, bookId)` (state.js:1813, idempotent, markArcsDirty) → caller does `saveState()` + re-render. Reuses the book-detail path (views.js:13153-13157). NO data-logic change.
- Picker: `buildArcPickerPanel({user,label,statusMsg,onPick(arcId),onDone})` (used by openBookArcPicker 13142). Move-to-arc reuses it.
- Arc color: NONE exists (no arc.color/hue/lens color — grep 0). PATH TAKEN: promote the mockup `--arc-*` palette to the Universal field spectrum + assign per-arc deterministically by id-hash → `var(--field-N)`. Recorded as reviewable.
- CX-5: universal-depth.css UNLINKED; --gold-hi/--field-1..10 undefined in assets/ (grep 0). Stage 1 links it.
- B2 residual in scope: `.shelf-filter .n` opacity:.7 → AA fix.

## Tap-reveal vs. navigation (forced adaptation, reviewable)

Mockup hijacks whole-card click for arc-reveal (mockup has no nav). LIVE cards are `<a href="#book/id">` and "book open" is a required regression gate. Resolution: the arc-thread bar is the reveal trigger (stopPropagation + toggle reveal); the rest of the card still navigates. Reveal markup/CSS byte-faithful to the mockup; only the trigger scope narrows (whole-card → thread). Recorded prominently.

## Stages: 1 foundation · 2 skin · 3a-d features · 4 fidelity+ship-prep. Gates self-verified via preview rig (computed-style parity + forensic smoke).

## Stage 1 PASS (foundation)
- index.html links /docs/studio/universal-depth.css. CX-5 tokens defined app-wide: --gold-hi #d9a441, --field-1 #f2c25a, --field-7 #8590d8, --thread #c2a463. --lum-gold #ffce4a unchanged.
- Shelf spot-check @1280 UNCHANGED from Amber baseline: card rgba(24,16,6,.5), title rgb(253,248,236), sidebar rgba(0,0,0,0), status rgb(255,206,74). Console clean.

## Stage 2 PASS (skin, Parity R1)
- components.css: appended shelf-scoped Universal skin block (32 rules) after the shelf block + .n opacity:1 AA fix.
- PARITY R1 all EXACT vs mockup Universal: ground #f4efe4, cover #efe7d6, card title #241710, author #645940, page-title ink-gold clip, status #855410, sidebar label #855410, seg-on gradient, btn gilding, yumi #256b80, .n opacity 1.
- Register tick UNCHANGED: resolves var(--register-theory)=--br-deep #1c1209 (theme.css); skin has 0 --register/--tick overrides.
- SCOPE: Notebook (.lum-amber-deep:not(.shelf)) keeps dark ground. Console clean.

## Stage 3a PASS (arc thread-tie + reveal)
- CSS: arcthread/arcs/arc-chip scoped .shelf.lum-amber-deep (no glow); row two-lane spine.
- JS: shelfArcsByBook map (owner-filtered), arcFieldHue(id) -> var(--field-N) id-hash, renderShelfBook/Row take arcs.
- SMOKE: 2 threads render, hue var(--field-4)=rgb(245,186,206), glow none, left:3px (has-tick), tap-reveal -> 2 intersectional chips (primary "A Pedagogy of Desire" + "The Self"). Title click navigates (book-open preserved); thread click preventDefaulted. Parse OK, 0 ES3 violations, console clean.
- Cache note: preview bfcache serves stale JS on location.replace; use index.html?cb=<t> for a fresh document.

## Stage 3b PASS (Select -> Move to arc)
- CSS: check overlay/is-picked/selectbar scoped .shelf.lum-amber-deep; colors from skin.
- JS: shelfSelecting/shelfPicked state + helpers (toggleReveal/pick/updateSelectbar/moveToArc); unified card click handler routes select/reveal/navigate by zone; Select toggle in toolbar; selectbar + shelf-arc-picker-host in render.
- SMOKE: armed=is-selecting, checks show (block), pick 2 -> count "2", bar has-pick, check fill rgb(168,118,26)=#a8761a. Move: buildArcPickerPanel (a.arc-picker-row) -> pick arc -> both books added to arc.bookIds (shape {id,addedAt} via addBookToArc), saveState called 1x, selection cleared, select exited, bar hidden. Parse OK, 0 new ES3, console clean.
- Firestore round-trip = deployed felt-pass residual (harness fake-auth). Wiring = book-detail's proven addBookToArc+saveState path, no data-logic change.

## Stage 3c PASS (sort) + 3d PASS (status dots) + decision 5 (Add)
- 3c: shelfSort var + books.sort branch (status: reading->will-read->read, added tiebreak); toolbar dropdown (Sort: Date added default). SMOKE: default order by addedAt; "Reading status" reorders to [reading,reading,will-read,read,read]. Grouping seg untouched.
- 3d: per-state ::before round dots override base 5px square (CX-4). reading rgb(255,206,74) round 7px glow; read rgb(123,191,123) flat; will transparent + #978b6d hollow ring 50%. Label kept #855410 gold-deep.
- Decision 5: persistent Add "＋ Add a book" present + gilded (gradient). Parse OK, console clean.
- ALL 8 DECISIONS BUILT: 1/8 arc thread+reveal, 2 select->move-to-arc, 3 tick untouched, 4 sort, 5 Add, 6 anatomy kept, 7 status dots.

## Stage 4 PASS (fidelity gate + ship prep)
- PARITY R2 (full manifest) ALL EXACT: ground #f4efe4, cover #efe7d6, card title #241710, author #645940, page-title clip, status/sidebar #855410, seg gradient, btn gold-hi, rmark luminous star (alight seeded), yumi #256b80, dots reading#ffce4a/read#7bbf7b/will-ring#978b6d, arcthread no-glow, .n opacity 1, tick #1c1209 (real register, unchanged).
- glowCount 7 <= 14. Mobile 375: single-col, Filters shown, drawer fixed+opens, light drawer #fffdf8, Universal ground. Regression: book-open OK, Lenses<->Categories toggles, no crash. Cross-surface: Arcs (arcs lum-amber) + Notebook (dark) render, NO bleed. Console clean throughout.
- sw.js v3.184 -> v3.185. books.md state:built rounds:1 + round-history. Builder regen: books tile u-orb--lit u-orb--honey (built) + brief-star + "built · 1 rounds" + mockup link.
- APP diff --stat: components.css +181, index.html +6, views.js +331/-9, sw.js +1/-1. Rails: 0 --register/--tick/--subtheory overrides in CSS; 2 --tick setProperty seams UNCHANGED; 3 new --arc setProperty (feature). No rails line removed.
- Arc-thread hue = var(--field-N) by id-hash -> HARD depends on universal-depth.css (linked Stage 1, by design per Stage-0 rule).
- Firestore persist of move-to-arc = deployed felt-pass residual (harness signed out).

## Red-team (fix-red-team, FIX-PROTOCOL §9)
MECHANICAL SPINE CLEAN (independently re-derived): ES3 floor (parse OK + harness self-validated), register-tick rails (2 --tick seams byte-unchanged, 0 CSS overrides, only new --arc setProperty), move-to-arc write path (identical to openBookArcPicker addBookToArc+saveState, idempotent, no stranding/double-write, deleteBook/merge untouched), CSS scope (all .shelf.lum-amber-deep, ground shelf-scoped not body, no bleed), book-open regression (normal click navigates, className coercion safe). No block-commit defect.
4 residuals (none crash/data-loss):
- #1 reveal-trigger divergence from mockup (whole-card->thread) — FORK, Preston's felt-pass call. Flagged.
- #2 a11y: reveal is pointer-only (aria-hidden 4px thread) + sub-min touch target — LOGGED as spawn task_e4cb7af7, resolve WITH the #1 fork.
- #3 arc threads depended on --field-2..10 from non-precached docs/ css, no fallback — FIXED: field spectrum now defined locally in .shelf.lum-amber-deep (fallback-proof; verified --field-3 resolves #d98f8a from shelf scope). universal-depth.css link kept as the CX-5 foundation; still live-verify it serves 200 on deploy.
- #4 comment nits (index.html --thread; views.js stopPropagation->preventDefault) — FIXED.
POST-FIX re-verify: parse OK, parity spot-checks unchanged (ground/cover/status), arc thread still colored, console clean.

## FINAL app diff --stat: components.css +185, index.html +7, views.js +331/-9, sw.js +1/-1. App code = ONLY these 4. Nothing committed. v3.185.
