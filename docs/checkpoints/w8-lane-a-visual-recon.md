# Wave 8 · Lane A-VISUAL — skin conversion (parchment → dark) — STAGE 0 RECON

**Repo:** HEAD `9500439` == origin/main. `sw.js` CACHE_VERSION `praxis-v3.170`. Foundations
byte-locked & UNCHANGED: `lumen-amber.css` MD5 `9879ddb83a7e68e8378c621e473b0a57` (14,681 B),
`marks.js` MD5 `772886c049d0d6d03d341507e602d88a` (10,255 B). Render rig: server up :8760, CDP
390 confirmed (matchMedia max-width:759px = true prior session). Evidence: 4-agent recon
workflow + adversarial verify (HIGH confidence) + my own live-DOM probes.

## ★ Screenshot tool (Visual Acceptance Protocol #1)
`preview_screenshot` **FAILS this session** — two 30s timeouts on `#home` (consistent with last
session's session-wide failure). The page is fully responsive (every `eval` returns; text
`preview_snapshot` works). → Taking the **deferral path**: BEFORE/AFTER stage-bg strings + the
mapped computed-style battery at Stage 1, with final visual PASS deferred to Preston on the live
deploy. I will not self-declare a visual PASS.

## 1. Where the parchment actually lives (the crux)
The pale look is **NOT** in any stylesheet. The CSS shell is **already dark**:
- Root `.arcfield.lum-amber` (views.js:11479) declares no background → inherits the `.lum-amber`
  atmosphere (lumen-amber.css:73–81, base stops **#3a2912/#2a1d0c/#1c1208** + warm radials) — a
  dark warm ground. Live-confirmed computed: `rgb(58,41,18)→rgb(42,29,12)→rgb(28,18,8)`.
- Page ground: `arc` is in `umberGroundDark` (views.js:373) → `body[data-ground="dark"]` → dark.
- Panel `.arc-detail-web-view` bg (components.css:11605) is only a 5%-opacity warm wash on
  transparent — dark-compatible.

**The parchment is an inline SVG rect the renderer bakes:** `renderSubTheoryConstellation` emits
`<rect ... fill="url(#tfa-stage)"/>` at **arc-constellation.js:1268**, and `#tfa-stage`
(tradition-forms-arc.js:73–77) is a hardcoded **cream→wheat→goldenrod** radial
(`#fbf2da → #ecd9a6 → #d8bd80`). This opaque parchment rect sits *inside* the dark panel and
covers it. **Live-validated:** setting that rect `fill="none"` reveals the dark ground beneath;
marks/threads/watermark/legend all survive.

## 2. Mark anatomy — already a luminous jewel (no _stRenderShapes change)
`_stRenderShapes` colorful branch (the arc-interior default, arc-constellation.js:948–960):
- blurred backing **halo** `<circle r=54 fill=var(--subtheory-N) opacity=lum style="filter:blur(9px)"/>` (lum = `_stLuminosity` maturity→[0.32,0.62], arc-constellation.js:780);
- **saturated silhouette** `<path d=mark.body fill=var(--subtheory-N) stroke=var(--subtheory-N) sw=2/>` at group-opacity 0.92 (mark.body = the frozen 16-mark vocabulary `_ST_MARK_TABLE`);
- cream **shine** overlay `fill=url(#tfa-shine)` (#FFF8E7);
- **inner linework** `<path stroke=var(--subtheory-N-edge) stroke-opacity=0.62 sw=1.8/>`.
Live-confirmed on a real mark. This IS the mockup anatomy (saturated silhouette + hue halo +
inner linework) — it only looks washed out because it's on the cream stage. **Reach A: dark ground
alone makes marks read as jewels; zero mark-render edits.** (Optional, Verdict-B-safe: the unused
ring-gradient `st-halo-N` defs (arc-constellation.js:588–606) could replace the flat blurred disc
for a truer halo — not required.)

## 3. Palette + Yumi-cyan collision (PRE-EXISTING — flag only, no recolor)
16 mark hues = `--subtheory-1..16` (theme.css:190–205), resolved via
`colorVar='var(--subtheory-'+(colorIdx+1)+')'` (arc-constellation.js:911). Yumi-cyan = `--lum-cyan`
#7fd0f0 (hue ~197°). On a dark ground the cool-family hues nearest cyan:
- **Tight:** #5 aqua `#7CC6DA` (~192°, closest), #2 sky `#8FB8E8` (~211°).
- **Secondary:** #7 periwinkle `#9BA4E8`, #13 mint `#8FD4B8`.
These *could* read as Yumi-adjacent on dark. **Pre-existing (the palette predates this wave); NOT
recolored here** (would violate Verdict B's color-logic freeze). Logged for a future call.

## 4. Threads / legend / watermark on dark (mostly already fine)
- **Watermark** `_stRenderQuestion` (arc-constellation.js:840–855): `<text fill=var(--ink-2) opacity=0.82>`. On `#arc` `--ink-2` remaps to `--muted` #c2a87f (**light** tan) via theme.css:336–349 → **live-confirmed computed `rgb(194,168,127)`**. Reads on dark. Currently *low-contrast on the cream stage*; the conversion IMPROVES it. **No change needed.**
- **Legend** `_stRenderLegend` (arc-constellation.js:1117): labels `var(--ink-2)` → light tan (live-confirmed `rgb(194,168,127)`); swatches `--thread-color`/`--marginalia-color`/`--sunk` — all read on dark. **No change needed.**
- **Threads** `_stRenderEdges` (arc-constellation.js:1090): resonance = per-edge gradient of hardcoded **#966E28** (op taper 0→.7→0); faint = dashed #966E28 op .4. Mid-amber, reads on dark, but it's a raw literal (not a `--lum` token) and slightly olive vs the mockup's lighter gold thread. **OPTIONAL:** lift to a `--lum` gold token for fidelity + token-consistency with the shipped concentrate-gold. (Concentrate-gold `st-edge-lit` = `var(--lum-gold)` — already correct, reads on dark.)

## 5. BEFORE stage-background (Protocol #2, live)
- SVG visible stage = `<rect fill="url(#tfa-stage)">` → `#fbf2da/#ecd9a6/#d8bd80` cream-goldenrod parchment.
- Behind it (revealed when rect neutralized): dark `.lum-amber` atmosphere `rgb(58,41,18)→rgb(42,29,12)→rgb(28,18,8)`.
- Watermark/legend ink: `rgb(194,168,127)` (#c2a87f, light). Threads: #966E28 amber, op .85.

## 6. REACH VERDICT — **A** (stage-ground + it's already dark underneath)
The mark anatomy, watermark ink, and legend ink already read as the mockup wants on dark; the ONLY
thing painting parchment is the SVG stage rect. So the conversion is: **make the SVG stage rect
stop painting parchment, and give the panel a proper mockup-dark stage ground.** No `_stRenderShapes`
edit, no vocabulary/color-logic change → stays inside Verdict B.

## 7. PLANNED EDIT LIST + predicted byte deltas
1. **js/arc-constellation.js:1268** — stage rect `fill="url(#tfa-stage)"` → `fill="none"` (parchment
   off; dark panel shows through). `tfa-stage` becomes inert-but-emitted (harmless); **tradition-forms-arc.js
   left 100% untouched**. Predicted **+80…+180 B** (with an explanatory comment).
2. **assets/components.css** `.arcfield.lum-amber .arc-detail-web-view` — replace the 5% wash with a
   mockup-faithful **dark stage** gradient (warm-center glow via `--lum-gold` low-opacity over
   `--lum-base` dark) + subtle inset glow/border, so the stage reads as a bounded luminous-dark panel.
   Tokens only, no raw hex. Predicted **+250…+450 B**.
3. **(OPTIONAL, your call)** js/arc-constellation.js `_stRenderEdges` — lift resting thread #966E28 →
   a `--lum` gold token for mockup fidelity. Predicted **±120 B**.
Marks, legend, watermark, faces, behavior: **untouched.**

**Predicted dirty set:** `js/arc-constellation.js` + `assets/components.css` (+ `sw.js` at Stage 2).
Anything beyond this halts.

## STAGE 0 CLOSE — HALT
Awaiting go-ahead + the one scope question (approach approval + optional thread-lift include/defer).
No edits, stages, or commits made.
