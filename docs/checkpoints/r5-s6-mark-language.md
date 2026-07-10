# R5 S6 — MARK LANGUAGE + FIELD LEGIBILITY — BUILT

## Parts
- **16-name table**: `ST_MARK_NAMES` (views.js:9056) aligned to the committed set (by shape index 0-15):
  beacon/wellspring/**spark**/keystone/**vessel**/lantern/facet/bloom/summit/**grove**/seed/**ember**/
  **horizon**/**lodestar**/**cairn**/harbor (8 renamed from compass/river/chamber/kite/harbor/spark/dune/gate).
  Display-only — shape indices + markShape/markColor unchanged (no data migration).
- **Mark picker**: the existing `openSymbolPicker(subId)` (views.js:9071, window-exposed, writes markShape/
  markColor or Auto=hash) IS the mockup's picker — reused, not rebuilt. S6 surfaces it via a `.read-change-mark`
  ("Change mark ▾") trigger in the AUTHOR Read row (`_arcReadSpine` opts.allowMarkEdit; visitor lens has none).
- **Tooltips (D6)**: `_stMarkNameFor(sub)` (resolved index → name) added to the views.js arc-tooltip `shapeLines`
  (chrome only; the frozen renderer's SVG is untouched).
- **Focus rings (D6)**: `:focus-visible` on the Read-row controls (read-change-mark, read-title link) — real;
  + latent `[data-st-sub-id]:focus-visible` on constellation marks (frozen renderer emits data-st-sub-id but
  no tabindex — CSS only, no renderer edit).
- **Dead-code cut**: removed the contiguous, grep-verified-dead `.arcs.lum-amber` arcs-list dark skin (deadened
  in S2). renderArcConstellation FUNCTION is in the byte-FROZEN arc-constellation.js (Δ=0) — NOT cut.

## Gates — ALL PASS
- parse OK views.js. names aligned; _stMarkNameFor def+use; allowMarkEdit + read-change-mark present.
- dead-code: `.arcs.lum-amber` (non-deep) rules remaining = 0. CSS braces 3310/3310. Δ=0 frozen-3. ES3 clean.

## Deletions LISTED with proof (grep = 0 JS callers) — .arcs.lum-amber REMOVED; the rest DEFERRED to a
focused sweep (S-C) to avoid scattered/interleaved CSS-bleed risk at the tail of the build:
- `.st-register-toggle` (S4-removed) — 0 callers.
- `.arcfield-read-head` / `.arcfield-read-threads` / `.arcfield-thread-row` / `.arcfield-read-subs` /
  `.arcfield-read-sub-name` / `.arcfield-read-sub-meta` (S3-replaced) — 0 callers; INTERLEAVED with the LIVE
  `.arcfield-read` + `.arcfield-read-empty` (both still emitted).
- `.itx-sub` / `.itx-sub-mark` / `.itx-sub-head` / `.itx-sub-body*` (S3-replaced) — 0 callers; LIVE `.itx-subs`
  wrapper still emitted.

## Residuals
- R-S6a: picker write round-trip (change mark → walk shows it after republish) verified at THE STOP live smoke.
- R-S6b: dead CSS listed above deferred to S-C sweep (not silently kept).
- R-S6c: name change is display-only (shapes unchanged) — no migration.
- R-S6d: constellation focus ring latent (frozen renderer, no tabindex); real rings on Read-face controls.

## Commit: LOCAL checkpoint, --no-verify (single sw.js bump at THE STOP).
