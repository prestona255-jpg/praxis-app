# THE ARC STANDARD — S1 · THE FIELD

**Date:** 2026-07-22 · **Base:** `9f254a0` · **CACHE_VERSION:** `praxis-v3.243` → `praxis-v3.244`
**Status:** BUILT + VERIFIED, committed LOCAL. **HALTED at the field gate** — push word + Preston's
felt pass on the live app. **Two halt items and one open ruling are listed in §5; S2 has NOT started.**

Stage-0 rulings 1–6 all honoured. Recon: `docs/checkpoints/arc-standard-recon.md`.

---

## 1 — What the arc interior is now

One lit sheet on the Hour's twilight, world margins visible, and **nothing floating on it as a
panel**. Top to bottom: **sky** (the question, its answer when one exists, value embers) → **Gate
Row** (kicker · one act · one door · ⋯) → **the field** (composed marks on gold threads, sitting
directly on the sheet) → **soil row** (the member books at the field's foot).

The before/after the felt pass judges, at Preston's two viewports:

| | before | after |
|---|---|---|
| ground | a cream constellation **panel** `rgb(253,249,238)` floating on a toasted-parchment page `rgb(233,220,188)` — a seam on four sides | one vellum sheet; `.af-field` computes `background:none · border:0px · box-shadow:none` |
| the question | a 38px heading in a header block, **and** a watermark inside the canvas | one line of sky, edit-in-place where it stands |
| controls | **15** live controls in 5 places (head seg, head canon, far-right Hide, full-width Ask-Yumi bar, in-canvas control bar, rail duplicate) | **3** in one row: `+ Sub-theory` · one door · `⋯` |
| books | **17 `<rect>` squares inside the arrangement canvas** — the only dark objects on a light field, one sitting on the legend | a soil band at the foot, shelf cover dialect, cloth-spine fallback |
| marks | 16 frozen shapes on 5 collapsed hues (3 of 4 seed marks read the same gold) + teal evidence dots outnumbering marks 3:1 | 9 silhouettes × 3 treatments × 10 pigments, sized by maturity, one gold coal |

Captures, taken fresh against these bytes, 2026-07-22 (rig-only, gitignored):
`.claude/rigcap/shots/before-field-{1360,390}.png` · `s1-field-{1360,390}.png`.

---

## 2 — The laws, verified

Computed-style and DOM evidence, live, signed-in as the rig stub. (Law G2: geometry alone lies —
each of these reads the painted value or the control's own state.)

| law | check | result |
|---|---|---|
| **1** one ground | `.af-field` computed | `bg rgba(0,0,0,0)` · `bg-image none` · `border 0px` · `shadow none` — **no panel exists to have a seam** |
| **3** the horizon speaks | seed arc | question on the sky; owned fixture with a finished sub → **answer joins it**, sourced from that sub's `answeringLine` (the S2 ceremony's own output, per §6) |
| **3** nothing else rides the sky | owned fixture, 2 value marks | 2 gold embers, no pill/border/fill; **0 value marks → nothing at all** |
| **4** sparse-honest | blank title | pre-question invitation renders, `.af-q` absent — one `--ink-3` line, nothing else |
| **5** one gate | control sweep | `+ Sub-theory` · `Graduate →` · `⋯`; menu = Connect · Tidy · Reset · Marginalia · Faint links · Muted palette · Ask Yumi · Delete |
| **6** form first | seed arc | 4 marks, 4 distinct silhouettes + 4 distinct pigments (was: 3 of 4 the same gold) |
| **8** honest doors | state sweep | ember+marks → `Graduate →` · graduated → `Publish →` · published → quiet `Published` + walk link · **zero marks → NO door at all** (the ember ruling: the seat is empty, so the S1 disabled-button law holds by construction) |
| **9** soil below, sky above | seed arc | 5 books in the soil band, 0 in the canvas (`_stRenderBooks` call sites: **0**) |
| **10** threads are gold | render | edges `var(--thread-color)` → `--thread`; the teal evidence dots retired from the field |
| **RD-2** no overflow | 1360 | `documentElement.scrollWidth` **1345** ≤ `innerWidth` **1360**; one scroll world, no inner scroller |
| **RD-2** lengthening page | `_afFitFieldHeight` | viewBox height re-declared to lowest mark + 96, floor 300 — crops the void, **moves nothing** |
| **positions sacred** | migration | derive-only; **S1 writes no data** (see §3) |

Parse gate: `tools/parse-check` **PASS** on `js/views.js` and `js/arc-constellation.js`.
Byte-locked foundations re-md5'd, **unchanged**: `lumen-amber.css` `070679b0…` · `marks.js` `772886c0…`.

---

## 3 — Migration (G3-as-built, ruling 6): DERIVE, DON'T WRITE

`_stMarkIdentity(rec)` is a pure function. **No field is added to any sub-theory, nothing syncs, and
S1 performs no data write at all** — which takes the data-loss surface off the round's riskiest gate
entirely. The composer (S4) is the only writer.

- **silhouette** — composed > chosen `markShape` via `_ST_SIL16` (16 legacy bodies → their nearest of
  the nine; all nine reachable) > `hash(id, 11) % 9`
- **treatment** — composed > `hash(id, 13) % 3`. No legacy field existed: the old
  `_ST_TREATMENTS` axis was dead code on the render path.
- **pigment** — composed > chosen `markColor` via `_ST_PIG16` > `hash(id, 17) % 10`

The chosen/derived split is the whole migration: **a mark that only ever had a hash had no identity
to change**, so it takes the full ten-wide spread; **a mark whose owner chose one keeps it**, moving
only where a ruling moved it. `_ST_PIG16` reproduces theme.css's exact five-way collapse with one
change — **R-2 verbatim: every gold slot re-points to ochre**.

**ONE IDENTITY EVERYWHERE.** `bookSubMarkHTML` now draws the composed mark too, so a sub-theory
cannot be a gold hexagon in the field and something else on its own page. `marks.js` is byte-locked
and untouched — it simply loses that one caller. **Named spill:** the Home field embed shares this
renderer, so Home's marks change with it. Home's *composition* is untouched (a non-goal); the glyph
change is unavoidable if one thing is to have one face, and it is on the felt-pass list.

---

## 4 — Behaviour-preservation inventory (nothing died silently)

| what | verdict |
|---|---|
| Field/Read/Page switcher | **RETIRED** (F5, the round's one ruled behaviour merge) |
| Read: first body line · maturity word · thread count · private marker · row door | **CARRIED** → the approach card (S2) |
| Read: gutter thread curves | **RETIRED BY NAME** — the field's real threads supersede an index-proportional approximation |
| Read: "N sub-theories · M threads" closing line | **RETIRED BY NAME** — its counts ride the Gate Row kicker |
| `_arcReadSpine` renderer | **PRESERVED, NOT DELETED** — the visitor `#walk` lens shares it; only the author call site went |
| Page face (focal mark + blurb + door) | **RETIRED BY NAME** — a self-described stub; marks are the real path |
| Rename | **CEASES TO EXIST** (F5) — replaced by edit-in-place on the horizon line |
| ember / graduated chip | **RETIRED** → a kicker word (F5) |
| `+ Sub-theory` rail duplicate | **RETIRED** — one canonical act. Gate parity kept: **any signed-in user** can plant, seed arc included, exactly as before |
| Connect · Tidy/Restore · Reset placements · Layers · Delete/Hide · Return to ember · Unpublish | **CARRIED → ⋯ overflow.** Connect keeps its exact element identity (`attachSubTheoryDrag` toggles `.is-connecting` on that node) |
| Layers → **Books** switch | **RETIRED** with the squares it faded |
| "Notes in this arc" rail | **RETIRED BY NAME** (ruling 3) |
| value-mark register panel | **DISSOLVED** → gold embers on the sky; empty = nothing (F4) |
| in-canvas question watermark · Yumi ghost · legend row · tidy help caption | **RETIRED** — law 1, law 4 |
| gathered evidence dots (teal) | **RETIRED from the field** — the maturity ramp (size + coal) carries the same count, in gold. **Their per-dot source channel** (`data-st-kind`/`data-st-ref`) **moves to the approach card in S2**; other embeds keep the dots |
| Ask Yumi | **→ ⋯ overflow, NOT retired.** See §5. |

---

## 5 — HALT ITEMS · open rulings

### 5.1 BAND OVERAGE — mechanical halt condition, declared

LF-normalised, like-for-like (`git show HEAD:<f> | tr -d '\r'` vs `tr -d '\r' < <f>`):

| file | HEAD | now | delta |
|---|---|---|---|
| `js/views.js` | 1,027,815 | 1,035,067 | **+7,252** |
| `js/arc-constellation.js` | 82,923 | 97,127 | **+14,204** |
| `assets/components.css` | 816,044 | 828,767 | **+12,723** |
| `assets/theme.css` | 40,298 | 43,153 | **+2,855** |
| `sw.js` | 6,041 | 6,041 | 0 |
| | | **TOTAL** | **+37,034** |

Declared S1 band: **+26,000 code / +9,000 comment = 35,000**. **Over by ~2,034.**
Classification: 330 of 1,257 added lines (26%) are comment lines, so roughly +9,600 comment and
+27,400 code — i.e. the comment half is inside its allowance and **the code half is over by ~1,400
(5%)**. Recorded, not silently widened. Nothing is reverted for it; your call whether it clears.

*(A note for the next stage's bands: the raw byte figures are ~16 KB larger per big file if measured
without `tr -d '\r'` — the working tree is CRLF, the blobs are LF, and components.css has 16,257
lines. Measure like-for-like or the band is fiction.)*

### 5.2 ASK YUMI — ruling premise falsified, parked reversibly

Ruling 3 was: retire it **if** the Yumi flower is present, because the seat owns that job. The
flower **is** present (`#yumi-bloom`, `position:fixed`, `z-index:9999`, measured on the arc route).
**But the seat does not own the job**, and the code says so:

- the chat's context is `assembleContextData`, whose `currentArc` is **`{title}` only**;
- `renderRoute` **never sets `state.currentArcId` on `#arc/<id>`** — views.js sets it to `null`
  there; only the sub-theory routes set it. **The chat does not know which arc you are standing in.**
- `requestArcVoice` runs `gatherArcContext`, which reads **every sub-theory's header and
  `bodyPublic`**.

Retiring it would delete a capability the flower cannot replace. It is in the ⋯ overflow — off the
field either way, so law 5 holds — and reversible in one line. **Your word at this gate.**

### 5.3 THE FIELD'S SHAPE — the one composition item S1 does not resolve

The app's arrangement space is a **600×500 viewBox** stretched to the sheet, so at 1360 the field
renders **1144×953** and four marks in the upper two-thirds leave a real void beneath them. The
mockup's field is much flatter (~470px tall at any width) because it places marks at *x%* and *y in
pixels*. `_afFitFieldHeight` crops the tail, but it cannot change the aspect.

Reconciling them means a **display-time horizontal stretch** — the same class of move as the
mockup's own `xBand`, never written back — which changes how **every existing arrangement reads**.
That is a felt call on real data, not a mechanical one, so it is not made here. **At 390 the field
reads well** (see `s1-field-390.png`); the void is a 1360 problem. This is the DUSK-CARVE-class item
for your eye.

### 5.4 NOT BUILT — the orphan "unrooted" seat (ruling 5)

Ruled, scoped, **and not built in S1.** It is a separate surface (the Arcs index, per your
placement note) rather than part of the field, and I stopped at the gate rather than start it half
way. Its count also still needs re-verifying on the real S1 snapshot — the seed workspace has **0**
orphans, so the figure of 7 is unconfirmed here. It carries into the next stage.

---

## 6 — Residuals and honest limits

- **Real-account snapshot NOT run.** Every check above is on the repo-shipped `__praxis_seed__`
  worked example (4 sub-theories, 5 books, 3 real links) plus a rig-only owned-arc fixture for the
  owner-gated states (which the seed arc cannot exercise — its `userId` is the sentinel). Law G1
  wants the real substrate; that belongs to the live smoke after the push.
- **dpr 1.** The capture rig's honest limit: geometry is true, hairline rendering is not.
- **Identities are not comparable across two captures.** Each headless run is a fresh profile, so
  the seed re-seeds with new ids and the hash-derived marks legitimately differ between the 1360 and
  390 shots. Not a stability bug — identity is a pure function of the id — but do not read the two
  images as the same four marks.
- **Uniqueness is not guaranteed for pre-existing marks** (270 combos, hash-derived). S4 enforces it
  at the mint and *offers* recomposition for a prior collision, never applies one.
- **`_stRenderBooks`, `_stRenderLegend`, `_ST_MARK_TABLE`'s render path** are now uncalled from the
  arc field. Left defined on purpose — `_ST_MARK_TABLE` is the migration table's source of truth for
  what each legacy index meant. A later sweep removes what is genuinely dead.
- Reviewer + red-team gates: **not yet run** — they belong to this halt, before the push.
