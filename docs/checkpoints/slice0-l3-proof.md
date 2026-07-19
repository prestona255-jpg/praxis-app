# R-POLISH SLICE 0 — STAGE 2 — L3 LEGIBILITY PROOF → **PASS** (no DUSK CARVE)

Rig page: `docs/studio/kit/l3-proof.html` (parchment field + gold-channel glyphs, real density).
Loads `PraxisMarks` (byte-locked, untouched) for the real 16-shape vocabulary. Screenshots dead in
the pane → evidence is contrast math + geometry + shape-channel (felt legibility = Preston's eyes-on).

## The mechanism (why gold-channel, proven at token level — harness `scratchpad/l3contrast.js`)
Glyphs are graphical objects → WCAG 1.4.11 non-text threshold **3.0:1** on parchment `#f4efe4`.
- **Candy fills: 16/16 FAIL** (1.28–2.11:1). The raw field pastel on light is illegible — this IS P-C.
- **Deep hues alone: 7/16 FAIL** (gold 2.65 · yellow 2.14 · pink 2.92 · green 2.68 · lime 2.42 · mint 2.62 · sand 2.76).
  "Just use the deep field hue" is NOT sufficient.
- **Unifying gold-channel stroke PASSES:** `--gold-deep #855410` = **5.60:1** · ink `#1c1209` = **16.07:1**.
→ The grammar: a dark-gold/ink **silhouette stroke** carries legibility; the field hue is a low-opacity
**accent**; the **shape** carries identity (NEVER COLOR ALONE — 16 distinct silhouettes).

## Live rig evidence (localhost:8790, CSSOM/geometry)
| check | result | verdict |
|---|---|---|
| marks placed at real arc density | **36** in a bounded 640×460 desk | PASS |
| min center-to-center distance | **62px** (collision guard held) — no muddy overlap | PASS |
| gold-channel stroke (computed) | `rgb(133,84,16)` = `#855410` | applied |
| stroke vs parchment mid-tone `#ecdcb4` (live) | **4.72:1** (> 3.0 glyph, > 4.5 text) | PASS |
| shape channel — 16 shapes render distinctly | **16/16** | PASS |
| console | clean | PASS |

**VERDICT: L3 PASSES.** Gold-channel-on-light reads legibly at mass density via the stroke+shape channels;
the candy-fill approach is objectively illegible (16/16). **DUSK CARVE not invoked.** Mechanism confirmed
token-level (Stage-1 §1): arc marks are `var(--field-N)` + deep variants already exist → B2 wires the
gold-channel via token repoint, no render surgery, no foundations edit. Preston's felt legibility pass is the
remaining gate (VISUAL GATE — computed styles are necessary, not sufficient).
