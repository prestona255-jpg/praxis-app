# Wave 8 · Lane A-VISUAL — skin conversion (parchment → dark) — STAGE 1 BUILD

**Reach A, approved.** Skin only — no behavior, no marks, no vocabulary/color-logic change
(Verdict B intact). **Dirty set (tracked):** `js/arc-constellation.js` (+14/−7),
`assets/components.css` (+5/−1). Nothing else. (`test-arc-constellation.html` pre-existing
deletion — NOT staged.) Foundations byte-locked & UNCHANGED: `lumen-amber.css`
`9879ddb83a7e68e8378c621e473b0a57` (14,681 B), `marks.js` `772886c049d0d6d03d341507e602d88a`
(10,255 B). CACHE_VERSION still `praxis-v3.170` (bump at Stage 2). `js/tradition-forms-arc.js`
**100% untouched** (`tfa-stage` def left in place, now unused-but-emitted-inert).

## Edits
1. **`js/arc-constellation.js:1268`** — stage rect `fill="url(#tfa-stage)"` → `fill="none"`. The
   parchment is gone; the dark `.lum-amber` atmosphere + the dark `.arc-detail-web-view` panel
   (CSS) show through. +4 comment lines.
2. **`assets/components.css` `.arcfield.lum-amber .arc-detail-web-view`** — replaced the 5% warm
   wash with the mockup dark stage: `background-color:var(--lum-base)` + a warm-center
   `background-image` radial (`--lum-gold` at low alpha via rgba matching the token RGB) +
   `box-shadow:inset 0 0 100px rgba(255,206,74,.05)`. Tokens + rgba idiom; **zero hex in the
   declaration** (and none in the comment after cleanup).
3. **`js/arc-constellation.js` `_stRenderEdges`** — resting resonance + faint threads lifted
   from the hardcoded `#966E28` to the **dim gold token `--lum-gold-d`** (via `style="stop-color:var(--lum-gold-d)"`
   on the gradient stops / `style="stroke:var(--lum-gold-d)"` on the faint line). `#966E28`
   fully removed from the file (grep 0). +5 comment lines.

## Static gate
- **Parse:** cscript isolated `_stRenderEdges` + stage-rect snippet → exit **0** (`PARSE OK`).
- **Foundation MD5s unchanged.** `#966E28` in arc-constellation.js → **0**. Forbidden umber
  literals (#d2a23e/#2e8a93/#2f1c0e/#f8f1e1) in both files → **0**. New CSS declaration uses only
  `var()` + `rgba()` (no hex).
- **Byte deltas:** arc-constellation.js **+605 B** (84,822→85,427); components.css **+445 B**
  (522,737→523,182). Reconciliation vs Stage-0 prediction (arc-const ~+200–300, css +250–450):
  css **in band**; **arc-const overshot** — 100% comment-driven. `git diff` line classification:
  **9 added lines are comments, 5 are the modified string-literal lines** (stage rect + faint +
  3 resonance stops); zero new logic lines. Comment-overshoot, cleared (logic in band).
- **Dirty set** = the two predicted files only.

## Self-caught bug (fixed in-wave, reported)
First `.arc-detail-web-view` attempt used `background:radial-gradient(...), var(--lum-base)` — the
`var(--lum-base)` parsed as an invalid image layer (computed `…, none`), so the dark base didn't
apply (the panel was leaning on the atmosphere behind it). **Caught by the computed-style check**
(exactly what the Visual Acceptance Protocol exists for). Fixed by splitting to
`background-color:var(--lum-base)` + `background-image:<radial>`; re-verified `panelBgColor =
rgb(35,23,8)` = `--lum-base`.

## Visual acceptance (deferral path — screenshots confirmed DOWN this session)
`preview_screenshot` timed out on every view this session; page fully responsive (all `eval`
returns green). Per protocol: BEFORE/AFTER strings + the mapped computed-style battery; **final
visual PASS deferred to Preston on the live deploy** (not self-declared).

**BEFORE → AFTER stage background:**
- BEFORE: SVG `<rect fill="url(#tfa-stage)">` → cream/goldenrod parchment (`#fbf2da/#ecd9a6/#d8bd80`).
- AFTER: SVG stage rect `fill="none"`; panel `background-color: rgb(35,23,8)` = `--lum-base` (dark) +
  warm gold radial `background-image` + inset gold glow.

**Computed-style battery (desktop 1280, seeded 3 subs + 3 threads + 1 book):**
| Check | Result |
|---|---|
| Stage bg = dark token, not cream | panel `rgb(35,23,8)` = `--lum-base`; stage rect `none` ✓ |
| Mark halo present | `<circle r=54 fill=var(--subtheory-N)>` blurred halo present ✓ |
| Resting thread | stroke `url(#grad)`; stop color `rgb(207,156,42)` = `--lum-gold-d`; op 0.85 ✓ |
| Concentrated thread | stroke `rgb(255,206,74)` = `--lum-gold`; op **1** (steady-state, transitions off) ✓ |
| Resting ≠ Concentrated, resting dimmer | **DIFFER = true** (dim gold gradient vs bright solid gold); Preston's explicit check ✓ |
| Legend ink = --muted | `rgb(194,168,127)` = `--muted` (light, reads on dark) ✓ |
| Watermark ink = --muted | `rgb(194,168,127)` = `--muted` ✓ |

Note on the concentrate opacity: an initial cross-eval read showed `0.85` (a mid-`.28s`-transition
artifact); a clean re-read with transitions killed confirmed steady-state **1** — no regression to
the shipped concentrate light-up (the concentrate rule is byte-identical to v3.170; my patch
touches neither it nor the line's `opacity` attr).

**390 (true mobile):** `matchMedia(759)`=true; stage rect `none`; panel `rgb(35,23,8)` dark; **no
horizontal scroll**; marks render; watermark ink `--muted`. Dark stage holds at mobile (layout
untouched).

## Untouched (verified): marks (same `_stRenderShapes` jewels, now on dark), legend/watermark
markup, faces, concentrate/release/Tidy/Reset/drag/connect/hover — all skin-only.

## Independent review (praxis-reviewer, pre-HOLD): CLEARED TO COMMIT
All 9 gates + correctness sub-checks pass. Confirmed: `--lum-gold-d` #cf9c2a ≠ `--lum-gold`
#ffce4a (concentrate reads brighter); `style="stop-color:var()"` robust (root-defined var);
`tfa-stage` safely inert; `_stRenderShapes`/`_ST_MARK_TABLE` untouched; tradition-forms-arc.js
untouched; byte deltas reconciled (components +438 LF-normalized; the raw +12,585 is whole-file
CRLF tax, not content). Non-blocking note: the JS `_stRenderEdges` comment cites #cf9c2a/#ffce4a
as accurate token documentation (JS comment, not a CSS declaration — not a hex-ban violation).

Its one flagged residual (transparent stage rect vs background-click-to-release) — **closed by a
live test:** concentrate → click empty field space → **released** (is-concentrated false, whisper
off); re-concentrate → click the `fill="none"` stage rect → **released**. No interaction
regression.

## STAGE 1 CLOSE — HOLD
All battery checks green at 1280 + 390; self-caught CSS bug fixed; reviewer CLEARED; release
verified. Nothing committed; CACHE_VERSION un-bumped. **Final visual PASS is Preston's on the
live deploy.** Awaiting the explicit "commit and push." Stage 2: read sw.js, bump v3.170→v3.171,
explicit-file stage arc-constellation.js + components.css + sw.js + the 2 checkpoint docs (test-arc
deletion excluded), commit (em-dash), push, report hash + HEAD==origin/main + deltas + MD5s.
