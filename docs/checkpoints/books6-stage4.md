# Books #6 — Stage 4: Mobile layout (bloom overlap + safe-area)

## Change (components.css only — all inside `@media (max-width:759px)`, desktop untouched)
- **Bloom (4i)** — `.yumi-bloom-line { display:none }` on mobile (the sprawling 184px hint line was the element overlapping content); the orb still renders on every surface. `#app { padding-bottom: calc(96px + env(safe-area-inset-bottom)) }` = a bottom scroll-gutter so the last content clears the fixed orb + home indicator.
- **Safe-area (4ii)** — mobile `.app-nav`: `height:auto; min-height:56px; padding: env(safe-area-inset-top) 16px 0 16px` so the bar extends under the iOS notch with its content seated below it. `env()` is 0 where there is no inset (box-sizing-agnostic via min-height).

## Self-verify (PASS — live preview, SW bypassed)
**Mobile (390px):**
- `.yumi-bloom` present; `.yumi-bloom-line` display **none**; `.yumi-bloom-orb` display **block** (orb renders, hint no longer overlaps) ✓
- `#app` padding-bottom **96px** (env bottom 0 in preview) ✓
- `.app-nav` min-height **56px**, padding-top **0px** (env top 0 in preview), padding-left 16px ✓

**Desktop (1280px) — undisturbed:**
- `.yumi-bloom-line` display **block** (hint visible: "tap to see what I'm noticing") ✓
- `#app` padding-bottom **0px** (gutter is mobile-only) ✓
- `.app-nav` min-height **0px**, padding-top **11px** (base pill unchanged) ✓

- console errors: none.

## Residual (iPhone eyes-on at ship)
- `env(safe-area-inset-*)` resolves to 0 in desktop-Chrome preview (no real notch), so the actual status-bar clearance can only be confirmed on Preston's iPhone. The rule is present + correct and verified to be a no-op where there's no inset.
- Bloom hint line is hidden on mobile across ALL surfaces (notebook etc.) by design — the orb (the bloom itself) still renders everywhere; verified globally (it's the shared FAB).

PASS → committed local → continue Stage 5.
