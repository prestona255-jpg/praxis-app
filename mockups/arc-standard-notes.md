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

| pigment | fill | hue | vs sheet top | vs sheet foot | edge | edge vs foot |
|---|---|---|---|---|---|---|
| madder | `#B8425A` | 348 | 5.03 | **4.62** | `#85293D` | 7.68 |
| terracotta | `#C75434` | 13 | 4.21 | **3.86** | `#94371F` | 6.48 |
| ochre | `#A65F10` | 32 | 4.68 | **4.29** | `#74400A` | 7.38 |
| gold | `#9D7A20` | 43 | 3.81 | **3.49** | `#725814` | 5.86 |
| olive | `#7C8B4F` | 75 | 3.52 | **3.23** | `#556032` | 5.89 |
| moss | `#55913F` | 104 | 3.62 | **3.32** | `#3B682B` | 5.72 |
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

**Flagged for the felt pass:** gold/ochre remain the tightest pair at 11°,
separated by lightness (3.49 vs 4.29). And a second-order tension worth a
ruling — **the pigment named "gold" and the gold attention-coal now share a
name and a family**, while the semantic law says only the coal may glow. It
reads correctly in the probe; it may still be worth retiring gold *as a
pigment* so gold means attention and nothing else.

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

## COLLISION — F-1 vs P-2 (reported, not resolved)

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
