# ARC STANDARD — mockup notes

Running record of amendments, collisions, and cuts made while building the
ARC STANDARD mockup on `mockup/arc-standard` (do-not-merge).

Binding record: `docs/studio/arc-standard-brief.md` (commit `9f254a0`).
This file does not replace the brief — it records where the mockup **amends**
it, and every amendment carries its provenance.

---

## Amendments to the brief — §2 F6

Both amendments below are **Preston felt ruling, Stage 1 review — 2026-07-22**,
recorded verbatim as issued.

### AMENDMENT 1 — PALETTE-X

> AMENDMENT 1 — PALETTE-X: the mark pigment family expands 5 → 10.
> Derive 10 perceptually-spaced pigments from the Hour's earth/jewel
> register (keep m1-m5's hue anchors where they survive spacing;
> candidates for the new five: lapis, moss, plum, rust, madder — you
> tune). Every pigment ships with an on-sheet AA variant where the raw
> fails (the --m1-on-ground precedent): solid fill-or-stroke ≥3:1 on the
> vellum sheet, measured and recorded in the header. Glow stays GOLD-ONLY
> (semantic gold law) — pigment never glows. Update the composer grid +
> fixtures. Note in the header: this amends the brief's F6 hue budget by
> Preston's felt ruling (July 22) — discipline retained, candy still dead.

**What amends what:** the brief's F6 froze the hue budget at "the five shipped
jewel families (m1–m5) — B2's ruled 16→5 collapse, already live and re-frozen."
PALETTE-X supersedes that sentence and only that sentence. F6's *ordering* law
is untouched: form still leads, pigment is still second, and the uniqueness law
is unchanged.

### AMENDMENT 2 — SHAPES-X

> AMENDMENT 2 — SHAPES-X: silhouettes expand 5 → 8 minimum (10 welcome
> if each earns distinctness at field distance). Keep beacon/facet/seed/
> frond/gate; add candidates: spire, well (ring), vessel, bloom, stone —
> you may substitute better forms, but every silhouette must be
> distinguishable at resting size from every other, verified in a probe
> row rendered in the header comment or a shot. Uniqueness law unchanged.

**As built: NINE, not ten.** See the P-1 cut below.

---

## PALETTE-X as built — the ten pigments

Named, never numbered (P-4). Measured against **both** vellum ends; the sheet
foot `#F6EFDC` is the worst case for dark marks and is the number that rules.
Floor = **3:1** (WCAG graphical-object minimum).

*This table is the CURRENT set, after R-2: gold has been retired as a pigment
and verdigris holds the tenth slot. The anchor notes below describe the 1R
state they were written in; R-2 (further down) is what supersedes them.*

| pigment | fill | hue | vs sheet top | vs sheet foot | edge | edge vs foot |
|---|---|---|---|---|---|---|
| madder | `#B8425A` | 348 | 5.03 | **4.62** | `#85293D` | 7.68 |
| terracotta | `#C75434` | 13 | 4.21 | **3.86** | `#94371F` | 6.48 |
| ochre | `#A65F10` | 32 | 4.68 | **4.29** | `#74400A` | 7.38 |
| olive | `#7C8B4F` | 75 | 3.52 | **3.23** | `#556032` | 5.89 |
| moss | `#55913F` | 104 | 3.62 | **3.32** | `#3B682B` | 5.72 |
| verdigris | `#3C9257` | 139 | 3.67 | **3.36** | `#1F6334` | 6.33 |
| teal | `#3E8A83` | 174 | 3.86 | **3.54** | `#266059` | 6.31 |
| lapis | `#4A7BB8` | 213 | 4.14 | **3.80** | `#2F5484` | 6.72 |
| iris | `#7A6BB8` | 252 | 4.32 | **3.96** | `#55447E` | 7.28 |
| plum | `#A85A8E` | 320 | 4.42 | **4.05** | `#7A3D64` | 6.83 |

**20/20 PASS.** Band 3.23–4.62 — deliberately narrow, so no pigment reads
heavier than another at field distance.

**Worst-case discipline (new at 1R).** Stage 1 measured only the lighter sheet
top. That is the *easier* end for dark marks. Measured properly, **moss at
`#5C9A4F` passes on the top at 3.22 and FAILS on the foot at 2.96** — it was
re-tuned to `#55913F` before shipping. Every future pigment is measured on the
foot.

### Anchor provenance — which shipped jewels survived

| anchor | outcome |
|---|---|
| `--m1` gold | `--m1-on-ground #9D7A20` (theme.css:205) — the standing Fork-B ruling. Raw `--m1 #D9B24A` measures **1.76:1** on the foot; it can never touch this sheet. Not a DUSK CARVE event. |
| `--m2` terracotta | `#C75434` RAW, unchanged |
| `--m3` olive | `#7C8B4F` RAW, unchanged |
| `--m4` teal | `#3E8A83` RAW, unchanged |
| `--m5` ochre | **SHIFTED** `#B07514` → `#A65F10` (hue 37 → 32) |

**The ochre shift is a spacing change, not an AA change** — raw ochre passes at
3.39. At 5-wide, ochre 37 and gold 43 could coexist. At 10-wide, six degrees
apart is a collision. The amendment's own words license it: *"keep m1-m5's hue
anchors **where they survive spacing**."*

**RUST is deliberately absent** from the new five. Rust lands at hue ~15–20,
on top of terracotta. **IRIS (252)** was substituted to hold the blue-violet
gap. Substitution is explicitly permitted by Amendment 2's wording.

**Flagged for the felt pass** *(both resolved by R-2, below)*: gold/ochre were
the tightest pair at 11°, and the pigment named "gold" shared a name and a
family with the gold attention-coal while the semantic law says only the coal
may glow.

---

## R-2 — GOLD RETIRES AS A PIGMENT (Preston, 2026-07-22)

> R-2 GOLD RETIRES AS PIGMENT — semantic gold completes: gold = attention
> /coal/harvest ONLY, never identity. Replace it to hold the 10-pigment
> floor: you tune the replacement (not gold-family, ≥25 degrees hue from
> both neighbors, AA >=3:1 on the sheet foot, named not numbered). If
> spacing + AA genuinely can't yield a lawful 10th, HALT with the
> evidence and the best 9 — don't ship a fake distinction. Migration
> note for the notes file: existing m1/gold marks re-point to ochre
> (nearest). Update composer, fixtures, probe, and the AA table.

**A lawful 10th exists — no HALT needed. VERDIGRIS `#3C9257`.**

| test | requirement | measured | |
|---|---|---|---|
| not gold-family | — | hue 139, aged copper | PASS |
| hue distance, lower neighbour | ≥25° | **35°** from moss (104) | PASS |
| hue distance, upper neighbour | ≥25° | **35°** from teal (174) | PASS |
| AA on the sheet foot | ≥3:1 | **3.36:1** (edge `#1F6334` at 6.33) | PASS |
| named, not numbered | — | verdigris | PASS |

It lands dead centre of the widest gap the retirement opened (moss 104 → teal
174), which is why it clears both neighbours by an identical 35°.

**Hue spacing after the swap** — 348 · 13 · 32 · 75 · 104 · **139** · 174 ·
213 · 252 · 320, gaps 25 · 19 · 43 · 29 · 35 · 35 · 39 · 39 · 68 · 28. The
tightest pair is now terracotta/ochre at 19°, separated by lightness (3.86 vs
4.29). **R-2 made the palette more separable, not less** — the old gold/ochre
11° squeeze is gone.

**MIGRATION (required note):** existing **m1 / gold marks re-point to OCHRE**,
the nearest surviving pigment. Deterministic, per G3's re-point law. Nothing
else changes silently; recomposition is offered in the composer, never applied.

Updated with the ruling: `:root` tokens, `HUES` + `HUE_NAMES`, the composer
grid, the probe's constant pigment (was gold, now ochre), the header AA table,
and the table above. No fixture used gold as an identity, so no mark changed
colour — verified by re-shooting the 1360 set against the current bytes.

---

## SHAPES-X as built — NINE silhouettes

`beacon · facet · seed · frond · gate · spire · well · vessel · bloom`

9 forms × 3 treatments × 10 pigments = **270 unique identities**, far past the
brief's "well over 16."

### P-1 CUT: `stone` is out

P-1 raised the bar from resting size to **the smallest maturity size F-4
produces (34px)**. At 34px a stone reads as a plain rounded ovoid — **the same
silhouette as `seed`, in solid *and* in outline.**

- Failing evidence: `shots/stage-1r/stage-1r-probe-min-1360-CUT.png`
- Passing evidence: `shots/stage-1r/stage-1r-probe-min-1360.png`

P-1 is explicit: if two forms blur at minimum, one is out. **`seed` survives**
because it is the arc's own mint word; `stone` was a candidate, not canon. Its
path is kept commented in the mockup as the record of what was rejected.

Angular replacements were considered and rejected: an irregular angular boulder
collides with `beacon` and `facet`. The distinct-form budget at 34px is
genuinely spent at nine — which is why the amendment's floor of eight, not its
ceiling of ten, is the honest number.

---

## COLLISION — F-1 vs P-2 — **RULED R-1: ACCEPT AS BUILT** (2026-07-22)

> R-1 F-1/P-2: ACCEPT AS BUILT. Real chain graph stays on growing (truth of
> the data, route defeated by arrangement); sparse demo stays on labelled
> finished. Record the split in the notes file.

**The split, recorded:**

| weather | graph | provenance |
|---|---|---|
| **growing** | the real chain — S1–S2, S2–S3, S3–S4, every mark connected | **REAL**, from `linkedSubTheories` in `js/state.js` |
| **finished** | sparse, 6 marks / 4 edges, one hub, one mark connected to nothing | **SYNTHETIC-SHAPE**, labelled in the file and in the dev bar |

The route reading is defeated by **arrangement**, not by falsifying the data:
the path is scattered in 2D so no left-to-right order survives, and each curve
bows perpendicular to its own chord on alternating sides. The finding below is
kept as the record of why the split exists.

---

## The collision, as found (kept for the record)

**Both cannot hold on real data.**

- **P-2** requires the connection pairs to come from the seed arc's actual
  connection data where it exists.
- **F-1** requires a graph that is not a chain, with not every mark connected.

**The real graph is a chain.** Ground truth, read from `js/state.js:3648-3677`
(the repo-shipped `__praxis_seed__` worked example):

```
S1 "Desire as Political Refusal"              linkedSubTheories -> [S2]
S2 "Eros in the Classroom"                    linkedSubTheories -> [S1, S3]
S3 "Pain and Struggle on the Path of Liberation"  -> [S2, S4]
S4 "Radical Self-Actualization"               linkedSubTheories -> [S3]
```

`views.js:11936-11957` derives `arc.edges` from these, so the arc's real edge
set is **S1–S2, S2–S3, S3–S4** — a 4-node path in which every mark is
connected. There is no real sparse graph anywhere in the seed to draw on.

**Resolution taken, pending Preston's ruling:**

1. The **growing** weather carries the real graph honestly (P-2 wins on the
   real-data surface), and F-1's *visual* requirement — "curves must not read
   as a route; no implied order" — is met by **arrangement**: F-2 scatters the
   path so that no left-to-right reading survives, and each curve bows
   perpendicular to its own chord on alternating sides.
2. The **sparse/unconnected demonstration** rides the **finished** weather,
   which is synthetic-shape and labelled as such in the file and in the dev bar
   (6 marks, 4 edges, one hub, one mark connected to nothing).

If Preston would rather the growing field show a synthetic sparse graph so F-1
is demonstrated on the primary surface, that is a one-line fixture change.

---

## FIXTURE CORRECTION — Stage 1 overstated "REAL"

Stage 1's header claimed the growing weather was `REAL SHAPE — seed arc: 5
sub-theories · 5 books · 12 evidence`, and rendered five invented sub-theory
titles and five invented book titles.

**The arc really has FOUR sub-theories**, and the five books are Giroux /
hooks / Grant / Epstein / Hurston — not the five titles Stage 1 displayed.

| field | Stage 1 | Stage 1R (verified against `js/state.js`) |
|---|---|---|
| sub-theories | 5 (one invented: "A note on grading", 102 chars) | **4** — the fifth is retired |
| titles | invented | **real** seed literals |
| body lengths | 1658 / 1455 / 3156 / 1568 / 102 | **1658 / 1455 / 3156 / 1568** — the four were real and are preserved |
| evidence | "12" | **11** (4/3/2/2 per sub-theory) |
| books | 5 invented titles | **5 real** seed books |
| links | 4 invented pairs | **3 real** pairs |

Sub-theory and book titles are repo-shipped seed literals (`__praxis_seed__`),
not private account content, so displaying them is safe. No marginalia, journal,
or question prose from any account appears in the mockup; the question and the
finished answer remain synthetic.

---

## Fixes applied during 1R capture (caught by looking, not by gates)

1. **The maturity coal rendered as a hard ring.** A stroked circle around the
   mark reads as a badge or a border — chrome. Replaced with a soft radial
   bloom: a coal has no edge, it is light the mark sits in.
2. **The field stranded a void under the lowest mark** (154px). Vertical
   positions were percentages *of the box whose height was derived from those
   same percentages* — circular. Positions are now pixels off a fixed
   `BASE_Y`, and the box is `lowest + 108`.
3. **The sky ran to four lines** at 30ch. Widened to 34ch.

---

# STAGE 2 — 390

## THE CAPTURE RIG WAS LYING — and the audit caught it

`chrome --headless --window-size=390,N --screenshot` **does not give a 390px
layout viewport on Windows.** Chrome clamps the window's layout width to ~512
and still writes a 390-wide *image*: the capture is a **512 layout cropped to
390.** Every mobile claim measured that way is false.

It surfaced only because the in-page audit prints `window.innerWidth`, and
under a `--window-size=390` capture it read **512px**. This is CLAUDE.md's tier
lesson wearing a screenshot: *verify at the real viewport, never at one the
renderer merely labelled.*

**Fixes attempted, in order:**

| approach | outcome |
|---|---|
| `--headless=old` | still 512 — same clamp |
| `--force-device-scale-factor=1` | irrelevant: DSF is device px, not CSS px |
| CDP `Emulation.setDeviceMetricsOverride` | **correct, and unusable here** — the agent sandbox denies `Start-Process` ("Access is denied") and denies launching Chrome from background bash ("Permission denied"). Written anyway as `mockups/rig/shoot.ps1`, for use outside the sandbox. |
| **iframe at a declared width** | **works.** `mockups/rig/frame-390.html` |

**The lever:** an iframe is laid out at exactly the width you declare, so the
inner document's `innerWidth`, media queries and layout all resolve against 390
for real. The frame is pinned top-left at zero margin, so capturing at
`--window-size=390,N` crops the empty wrapper away. Requires
`--allow-file-access-from-files` so the wrapper can grow the frame to the
content height (no inner scrollbar).

**Honest limits, stated wherever this rig is used:** dpr is 1, not a phone's
2–3 (geometry is true, hairline rendering is not); `position:fixed` inside the
frame pins to the frame; `100vh` inside the frame is the frame's height.

## The 390 laws, MEASURED (not asserted)

From `shots/stage-2/stage-2-audit-390.png`, captured 2026-07-22 against these
bytes, at a viewport that reports **390px**:

| measure | value | | law |
|---|---|---|---|
| viewport width | **390px** | — | the rig is honest |
| document scrollWidth | 390px | PASS | RD-2: no horizontal overflow at any width |
| furthest right edge | 390px (`HTML`) | PASS | nothing crosses the viewport |
| gate targets | 44 · 44 · 44 | PASS | P3: 44px minimum |
| vertical inner scrollers | none | PASS | one scroll world |
| sky band height | 148px | PASS | slim horizon |
| question | 105 chars · 4 lines · 106px | PASS | horizon fit: no truncation, no overflow |
| soil row | 336px box · 336px content | PASS | band fits; the scroller never engages at 5 books |

**Horizon-fit check (§7.6).** The *real* seed question is already **105 chars**
— inside the 100–120 band the check names — so the honest stress case is a
**synthetic 114-char** question at the top of the band (`?q=long`). It renders
in 4 lines at 390 with no truncation and no overflow:
`shots/stage-2/stage-2-horizon-fit-390.png`. **No truncation law is needed for
the sky.**

An audit bug was caught and fixed en route: a global `.btn` sweep also measured
the composer's buttons, which sit inside a `display:none` scrim and report 0px
height — manufacturing a phantom P3 FAIL. Scoped to the gate row.

## The arrangement at 390

Horizontal room collapses from ~1108px to ~344px, so two marks separated by
their *x* distance at 1360 are only ~79px apart at 390 while their labels are
~90px wide. Two display-time transforms answer this. **Neither is written back
to stored state** — the user's arrangement is untouched (covenant law); this is
presentation, the same class of move for both:

1. **`xBand`** — the extremes map to a safe band (22–78%) and everything
   between keeps its proportional place. The band exists because a centred
   label hanging off a mark at x=78 would otherwise cross the sheet edge.
2. **Vertical stretch** — `BASE_Y` goes 470 → **760** at 390, giving the field
   the room the x-axis lost.

### PROPOSED LAW, NOT RULED — the 2-line label clamp at 390

The stretch buys room but **cannot fix a genuine 2D collision.** On the
finished weather, *"Pain and Struggle on the Path of Liberation"* runs to three
lines and its box reached the mark below it — **"Match quality" and "Pain and
Struggle" labels visibly overlapped.**

Applied: at 390 a **resting** label clamps to two lines with an ellipsis
(footprint ~48px → ~32px). The full name is never lost — it returns whole on
approach, the lit state, which is where F-7 already puts the detail.

**RULED (Preston, 2026-07-22): the 2-line label clamp at 390 STANDS**, approved
on sight. The full name still returns whole on approach.

---

# STAGE 3 — one place, three distances

## The rig

**RULED (Preston, 2026-07-22): the rig stays at `mockups/rig/` for the round.
Graduation to `.claude/rig/` is a CLOSE ruling — carried here.** If it
graduates it needs its own path-scoped hook exemption, since check #3 blocks
`.claude/**` html exactly as it blocked it during Stage 2.

`frame-390.html` became **`frame.html`** and takes a `w` param: it is used at
1360 as well as 390 now, for the reason in the next section.

## Two capture traps, both caught by the audits themselves

1. **An appended node does not reliably reach a `--screenshot` frame.** Both
   in-page audits were provably in the DOM (`--dump-dom` found them) and
   provably absent from the capture. Worse, the rig's own onload resize fires
   `window.onresize → render()`, which rebuilds `sheet.innerHTML` and throws
   the appended node away. **Evidence that exists only between two repaints is
   not evidence.** Audits now REPLACE the sheet and latch `auditMode` so the
   resize path cannot wipe them. The Stage 2 audit was converted too — its
   append had only ever survived by luck, and stopped the moment the resize
   path changed. Same numbers, now reproducible.
2. **A timed audit races the capture.** The zoom audit originally waited out
   the real 300ms flight with `setTimeout`. It now samples synchronously — and
   that is the stronger claim anyway: what law 7 asserts is that a camera
   transform *of any magnitude* cannot move a mark.

## Self-score — laws 2, 7, 12, with measured evidence

`shots/stage-3/stage-3-laws-audit-1360.png` and `stage-3-zoom-audit-1360.png`.

| law | measured | |
|---|---|---|
| **2** · sheet luminance by distance | field **0.948** · clearing **0.966** · page **0.99** | PASS — brightness rises with depth, never falls |
| **2** · world behind the sheet | `rgb(25, 31, 51)` at every distance | PASS — one twilight, no ground flip |
| **7** · door opacity, resting → lit | **0 → 1** | PASS — tap 1 lights and reveals, tap 2 opens |
| **7** · camera transform at flight end | `matrix(2.8, 0, 0, 2.8, 0, 0)` | PASS — the camera really moved |
| **7** · authored + layout position, before vs camera-at-2.8× | **IDENTICAL** (4 marks) | PASS — the camera moves… |
| **7** · authored + layout position, before vs released | **IDENTICAL** | PASS — …the arrangement never does |
| **12** · canvas bounded | 1px border · 12px radius | PASS — a real surface, not a bare textarea |
| **12** · canvas lifted | box-shadow present | PASS — Lifted Sheet treatment |
| **12** · honest focus | focus ring painted | PASS — visible, not implied |

Per-mark, unchanged throughout: `21% / 122px (233,122) · 57% / 66px (632,66) ·
38% / 296px (421,296) · 78% / 221px (864,221)`.

Motion vocabulary, as shipped and not invented: `transform+opacity ·
var(--dur-gentle) 300ms · cubic-bezier(.22,1,.36,1)` — MO-1, `praxis-kit.css:36-37`.
The crossfade fallback mirrors the shipped `.mo-crossfade` / `mo-cross`
keyframes exactly. Under `prefers-reduced-motion: reduce`, `goDist()` skips the
flight entirely and swaps instantly.

### Two findings the self-score produced against itself

- **It scored a working door a FAIL** (`0 → 0`). Reading opacity straight after
  a class flip returns the *start* of the transition, not the target. Fixed by
  suppressing the transition and forcing a reflow before reading — the same
  family as the repo's `:focus`-not-readable trap.
- **It scored law 2 on a blind metric.** All three distances measured 0.948
  because only `background-image` changed while the probe read
  `background-color`. Each distance now declares both, so the paint and the
  measurement are the same fact. (The R-POLISH B3 lesson: measure the painted
  fill, not where the token was declared.)

## Defects caught by looking at the frames

- The woven chip landed **mid-word** (`keeping i|ts own counsel`) — prose was
  sliced at a raw character offset. The weave now lands at an authored word
  boundary.
- The gather frame **contradicted its own caption**: header read "Risen from
  Zombie Politics" while the lifted cover was *Range*. `S1.evidence[3]` is the
  Giroux book, which is `books[0]` in the soil.
- A **nascent** mark answered a tap with nothing but a label-colour change (its
  maturity coal is 0). The lit state now carries its own gold drop-shadow, on
  top of whatever coal the mark already has.
- **The clearing did not collapse at 390** — the `190px 1fr 190px` court left
  the canvas ~90px wide, one word per line. It stacks now, canvas first,
  because writing is what you came for.
