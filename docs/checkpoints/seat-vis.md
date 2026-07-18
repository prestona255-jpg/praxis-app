# SEAT-VIS — raised-hand visibility micro-patch — STARTED

**Type:** CSS-only polish (display-only; no data, no state, no JS). NON-data-loss.
**HEAD @ start:** 8f45221 · live sw.js praxis-v3.229 (gate PASS: HEAD==origin==8f45221,
local sw.js v3.229, deployed sw.js v3.229).
**Scope (hard):** `assets/components.css` — `.yumi-bloom--raised` + its variables ONLY,
plus the one-line `sw.js` CACHE_VERSION bump. No JS, no yumi-brain, no new elements, no copy.

## Finding of record (why this exists)
Preston never perceived the raise across 3 live attempts. 15px/60% gold-hi vs 12px/38% gold
passes a screenshot diff but FAILS a human glance at arm's length on a 1920 parchment screen.
Delivery itself is verified working live (he received a genuine noticing).

## Recon (Stage 0)
- Rest orb (base, line 32-38, OUT OF SCOPE — not touched): `56×56`,
  `filter: drop-shadow(0 3px 12px color-mix(in srgb, var(--gold) 38%, transparent))`.
- Base living-orb motion (lines 81-85, UNTOUCHED): petals spin 22s · core breathe 4.5s ·
  halo glow 6s · two embers twinkle. Always-on in BOTH rest and raised — the "static law"
  means the RAISE adds ZERO new animation, not that the orb freezes (reconciled Slice 9).
- Raised block (lines 121-128, the target):
  - `121  .yumi-bloom-orb { transition: filter 420ms var(--ease); }`  (the ONE transition up; kept)
  - `122  .yumi-bloom--raised { --gold: var(--gold-hi); }`  (petals→gold-hi family; KEPT)
  - `123-125 .yumi-bloom--raised .yumi-bloom-orb { filter: drop-shadow(0 3px 15px gold-hi 60%); }`  (REPLACE)
  - `126-128 @media (prefers-reduced-motion){ .yumi-bloom-orb { transition:none; } }`  (kept)
- Token check (tune-to-tokens, no invented hues): `--gold-hi:#d9a441` defined at `:root` in
  `docs/studio/universal-depth.css:38` (loaded index.html:23) → globally reachable by the body FAB.
  Rest `--gold` is ROUTE-DEPENDENT: `#d2a23e` on `[data-ground="dark"]` (≈ gold-hi → petal
  recolor imperceptible = the diagnosed failure), `#855410` on bright routes. The HALO is the
  route-INDEPENDENT visibility lever → the correct instrument, and exactly what Preston sized.

## The dial (approved target)
- Petals: keep stepping to the `--gold-hi` family at full presence (existing `--gold: var(--gold-hi)`).
- Halo: wide, still, TWO-LAYER — inner ~30px @ ~0.55, outer ~44px @ ~0.45, both in `--gold-hi`.
- STATIC LAW ABSOLUTE: one transition up, then perfectly still — no pulse, no motion, nothing
  time-varying, in any state. The raise adds no new `animation`.

## Planned edit (one hunk, lines 123-125)
Replace the single `drop-shadow(0 3px 15px … 60%)` with a two-layer symmetric halo:
`drop-shadow(0 0 30px … 55%)` + `drop-shadow(0 0 44px … 45%)`, both `color-mix(… var(--gold-hi) …, transparent)`.
Symmetric (`0 0`) so it reads as the orb radiating (a halo), not a grounding shadow.
Byte FLOOR: +70 B (one added drop-shadow layer + reformat); comment-band allowance for a SEAT-VIS note.

## Stage 1 — BUILD + PROVE (all green)
Edit applied (assets/components.css, one hunk lines 122-129) + sw.js CACHE_VERSION v3.229 → v3.230.

**Byte / structure gates**
- components.css delta = **+340 B** LF-normalized (HEAD 708616 → 708956). Classified:
  CODE ~+80 B (1 `filter:` line → `filter:` + 2 `drop-shadow` lines) — floor +70 respected, NO CODE-band
  breach; remainder ~+260 B = SEAT-VIS provenance comment + header reconcile (COMMENT allowance, clears
  by classification). Red-team independently re-derived +340 B (removed 242 / added 582).
- git diff --stat: components.css 8+/3- (surgical, no EOL flip); sw.js 1+/1- delta **0 B** (equal-length version).
- Brace balance HEAD vs WT = **4001/4001** (no global CSS bleed); each new drop-shadow+color-mix line paren-balanced 3/3.
- Working-tree blobs LF (0 CR); autocrlf warning cosmetic.

**Rig check — settled CSSOM (localhost:8790, SW killed, animations natural)** — screenshots dead, geometry is evidence:
| | REST (v3.229 base) | RAISED (new v3.230) | RAISED (old v3.229) |
|---|---|---|---|
| color | #d2a23e (--gold, dark route) | #d9a441 (--gold-hi) | #d9a441 |
| layers | 1 | **2** | 1 |
| blur | 12px | **30px + 44px** | 15px |
| alpha | 0.38 | **0.55 + 0.45** | 0.60 |
| offset | 0 3px | **0 0 (symmetric halo)** | 0 3px |
- settled RAISED filter = `drop-shadow(#d9a441/0.55, 0 0 30px) drop-shadow(#d9a441/0.45, 0 0 44px)` — exact approved dial.
- RAISED orb `animation: none / 0s`; inner living-orb groups identical rest vs raised (spin 22s/breathe 4.5s/glow 6s/twinkle 5s+6.5s) → **the raise adds ZERO animation**.
- STATIC proof: settled RAISED filter byte-identical T0 == T+1.5s; rest ≠ raised (distinguishable).
- 390 (true): FAB visible bottom-right (right/bottom 24px = --sp-5), 56×56, two-layer halo computes identically.
- Console: **no errors** (error-only scan).

**STATIC-LAW / interpolation note (red-team #2 reconciled):** the rest→raised transition goes from a
1-function to a 2-function filter list. The paused-pane frozen 0% frame read as
`[#d2a23e@0.38 3px 12px, IDENTITY]` — a *padded 2-function* form. A DISCRETE transition would serialize the
raw 1-function rest filter at 0%; the padded form is direct evidence Blink interpolates **pairwise with
identity-padding** (rest→L1 morph, identity→L2 fade-in) — i.e. the SR-1 "one gentle transition," not a pop.
Immaterial to the hard STATIC LAW regardless: one bounded, non-repeating transition; the HELD state is
proven still (T0==T+1.5s) and declares no animation.

**Red-team (fix-red-team, Sonnet) — findings resolved:**
- #1 BLOCK (sw.js not yet bumped) → CURED: bumped to v3.230 (the prompt's declared ship step).
- #2 NOTE (interpolation "gentle" claim) → reconciled above with the frozen-frame evidence; not a block.
- Confirmed clean: --gold-hi resolves via :root (yumi-ui.js:1369 appends .yumi-bloom to <body>, outside every
  surface scope), no invented hue, scope untouched beyond the raised block + its shared header comment.
