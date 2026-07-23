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
(5%)**. Recorded, not silently widened.

> **RULED — BAND WIDENED EXPLICITLY (Preston, 2026-07-22, field gate).** On the classification
> evidence above, and on the B1 precedent: a **468-line composition replaced by the full field** is
> honest scope, and the **5% code overage is accepted**. The S1 band is amended in place to
> **+27,400 code / +9,600 comment** — the measured figures — rather than the estimate it was
> written against. This is a widening ON EVIDENCE, at a halt, with Preston's word; it is not a
> band quietly stretched to fit a diff, and the distinction is the whole point of the rule.

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
field either way, so law 5 holds — and reversible in one line.

> **RULED (Preston, 2026-07-22, field gate): overflow parking ACCEPTED.** The retirement ruling's
> premise was wrong and stopping was correct. **THE ARC-CONTEXT GAP IS NAMED DEBT**, for the round
> ledger, and is deliberately NOT built mid-gate: `renderRoute` never sets `state.currentArcId` on
> `#arc/<id>` (views.js sets it to `null` there; only the sub-theory routes set it), so
> `assembleContextData` hands the chat a `currentArc` of `{title}` at best and `null` in fact —
> the Bloom cannot know which arc you are standing in. Closing it is **Yumi-adjacent, and Yumi is
> a non-goal for this round.** Debt, named, not silently absorbed.

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

> **RULED (Preston, 2026-07-22, field gate): NO PRE-EMPTIVE STRETCH.** This is what the felt gate
> is for — the void gets judged on real arcs at real density, not guessed at. **Requirement placed
> on the snapshot verification: a 1360 shot of the DENSEST real arc (~24 marks) alongside a SPARSE
> one, so the felt pass sees both extremes.** If the void fails his eye, the xBand-class stretch
> becomes the fix-forward from his words.

### 5.4 NOT BUILT — the orphan "unrooted" seat (ruling 5)

Ruled, scoped, **and not built in S1.** It is a separate surface (the Arcs index, per your
placement note) rather than part of the field, and I stopped at the gate rather than start it half
way. Its count also still needs re-verifying on the real S1 snapshot — the seed workspace has **0**
orphans, so the figure of 7 is unconfirmed here.

> **RULED (Preston, 2026-07-22, field gate): the orphan seat rides the S2→S3 run as its NAMED
> FIRST ITEM, after the snapshot confirms the real count. Not blocking this gate.**

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
- Reviewer + red-team gates: **RUN. One BLOCK + one HOLD fixed in a follow-on commit; see §7.**

---

## 7 — GATE RESULTS + FIX (follow-on commit)

Both gates ran against `0759e09` (Sonnet-pinned per MODEL LAW v2). The fix commit
sits on top; base bytes for it are `0759e09`.

### 7.1 Reviewer (praxis-reviewer) — HOLD → cleared

PASS on ES3 (parse OK both files, zero real const/let/arrow/class/backtick),
byte-locks (both MD5s match, neither in the diff), the behaviour-preservation
inventory (`_arcReadSpine` confirmed still called by `renderInteract` at
views.js:20513; every named removal is dead-but-defined, **zero dangling
callers**), undeclared vars (no sibling to the `isSeedArc` bug), CSS brace/comment
balance (+18/+18 comments, +62/+62 braces, no new imbalance), and the sw.js
single-increment.

**BLOCKING finding #6 — undisclosed new hardcoded hex in components.css.** True and
fair: 10 values / 12 occurrences of raw hex in the sky / Gate Row / soil chrome,
inlined from the mockup instead of tokenised — while the *same commit* tokenised
the pigment set correctly, which made the omission worse, not better.

**FIXED.** Ten named tokens added to `theme.css` (`--harvest-1/2`,
`--card-ink-warm`, `--ember-ink`, `--gold-hi`, `--gold-ink-door`,
`--cloth-page-1/2`) with a full provenance comment, and every literal in the
appended CSS re-pointed to a token. Re-grep of the S1 block's added lines:
**one** hex remains, `#3d2807` on `.af-btn-primary` — the gradient's dark *text*
colour, which has no existing token and is a one-off; it is disclosed here rather
than minted a token for a single use. `#DFB759` now reuses the existing
`--gold-ember`; the wrong `--danger` fallback is gone (uses the real
`var(--danger)`).

### 7.2 Red-team (fix-red-team) — 1 BLOCK, 1 HOLD, 2 NOTE — all resolved

**BLOCK #1 — "ONE IDENTITY EVERYWHERE" was false on the visitor #walk lens.** The
real bug, and the one the recon should have traced into `integrations.js`:
`buildPublishedArcDoc` (R5 S5, pre-existing, untouched) caches a hash-fallback
`markShape`/`markColor` on the published payload; `_stMarkIdentity` cannot tell a
cache from a user choice, so on the walk it took the "chosen" branch and collapsed
every mark onto **four** pigments while the author's field showed **ten** — and,
because the walk's `markSub` carried **no id**, hashed the empty string for
treatment and gave **every walked mark in the system the same treatment.** Proven
by the red-team under the cscript harness: pigment mismatched 13/13, silhouette
8/13, treatment constant.

**FIXED, and verified live.** `buildPublishedArcDoc` now also carries the COMPOSED
triple (`markSilhouette`/`markTreatment`/`markPigment` + `markCount`), resolved
from the real record via `window.stMarkIdentity` — display-only, no user record
gains a field. `renderInteract`'s `markSub` prefers that triple and, for an old
snapshot that lacks it, still hands the row a **stable id** (`arcId:index`) so the
treatment axis varies again; republishing upgrades a stale snapshot exactly.
Live proof on the seed arc (rig, signed-in): the payload carries
`beacon/outline/verdigris · vessel/outline/iris · bloom/hatched/olive ·
seed/solid/ochre` — **4 distinct pigments, 3 treatments**, and **all four match
the author's field identity byte-for-byte** (`allMatchFieldVsWalk: true`). The old
-snapshot fallback's treatment went from 1 distinct value to varied.
*(The walk's full DOM render needs the Firestore fetch the rig has no backend for —
"Opening the arc…" — so the on-screen walk is a post-push live-smoke item; the
payload-equivalence proof above is the load-bearing evidence.)*

**HOLD #2 — `_afFitFieldHeight`'s 500 ceiling clipped the DEFAULT even-count
layout.** True: `_stRadialLayout` puts a mark at y=410 at every even sub-theory
count (starting at the first 2-mark arc), which needs 506 and got clamped to 500 —
geometry cutting a mark, which RD-3 forbids. **FIXED:** the upper clamp is
removed; the page lengthens instead (RD-2, the law it was written under). The
seed's own 4-sub (even) field now renders uncropped (`s1fix-field-1360.png`).

**NOTE #3 — `bookSubMarkFill` still used the retired 16-slot hue.** FIXED: it now
returns `var(--pig-<pigment>)` from `_stMarkIdentity`, so the "became →" glint
matches the composed mark.

**NOTE #4 — the arc field's own `renderSubTheoryConstellation` call omits
`markScale`, inheriting the new 0.8→1 default (~25% larger marks).** Confirmed
DELIBERATE — form-forward marks are the redesign — and now stated so. All four
other call sites (Home's two variants) pass explicit scale and are unaffected.

**Red-team CLEAN list, confirmed:** the Tidy branch nulls x/y on the fresh
per-render object literals `_arcDetailBuildSubTheoryData` builds, **not** on
`state.subTheories` references — no covenant-breaking write; `_ST_SIL16`/`_ST_PIG16`
byte-accurate, all 9 silhouettes + 10 pigments reachable; **no SVG id collision**
across concurrent constellations (`_stNextId`/`_stGlyphSeq` are page-global
monotonic counters — Home draws two at once, verified `homeDupIds: false`);
`_stRenderMarkLabel` XSS-safe (`_arcEscapeXml` applied last); no new identity write
at the state or migrate layer.

### 7.3 Interactive-control sweep (the DOM-restructure gate)

Every control on the field fired live and observed its OWN state (not just global
DOM): `+ Sub-theory` present/enabled · door reads `Publish →` on the graduated
fixture · `⋯` opens and flips `aria-expanded` to true · Tidy shows its own label ·
**Marginalia toggles its own `data-st-marginalia` on→off on the live svg** · Connect
carries `data-st-control=connect` · edit-in-place opens `input.af-q-edit`.
`scrollWidth 1265 ≤ 1280` — no overflow.

### 7.4 Fix commit — files, bytes, cache

| file | why |
|---|---|
| `js/integrations.js` | BLOCK #1 — payload carries the composed triple |
| `js/views.js` | BLOCK #1 walk consumer + stable id · HOLD #2 clamp removal · NOTE #3 fill |
| `assets/theme.css` | reviewer #6 — 10 named chrome tokens |
| `assets/components.css` | reviewer #6 — literals re-pointed to tokens |
| `sw.js` | CACHE_VERSION praxis-v3.244 → **v3.245** |
| `docs/checkpoints/arc-standard-s1.md` | this §7 + the field-gate rulings folded in |

`integrations.js` is a NEW file in the round's touch set (the recon's blind spot —
it named `_arcReadSpine`'s dual use but did not trace the R5 S5 markShape cache
across the diff boundary). Recorded, not hidden.
