# Wave 7 · Surface C — Arcs page → `.lum-amber` (BUILD)

Source: `design/Wave 7 …zip → arcs-amber.html` (look ref; tokens wired from
`lumen-amber.css`). Disposition: **redesign in place** on `#arcs` (renderArcsPage +
.arc-card CSS). Recon: read-only 3-agent fan-out (wf_61b84c7b-0b9) + own data-model verify.

## DEFER confirmation (verified against the real schema)
`ensureArcFields` / `createArc`: an arc record carries **title, description, bookIds,
entryIds, userId, createdAt** — and nothing else. No `published`, no `maturity`, no
consequence (walked/built-on/questioned). Therefore, per the brief:
- **Published-only filter → OMITTED** (no arc published flag). Not built.
- **Per-arc public/private `.pub` chip → OMITTED** (same missing flag).
- **Consequence line → OMITTED** (no walked/built-on/questioned fields).
- Logged as a **data-model task** for Preston to greenlight later (adding a published flag
  or consequence metric is a feature).

Real fields used: sub-theory **status/updatedAt/createdAt** + the canonical
**`_stComputeMaturity(sub) → [0,1]`** derivation (same one the constellation + sub-theory
detail use). Mark identity = stored `markShape/markColor` else `stHashIndices(id)`, rendered
through the shipped **`bookSubMarkHTML(sub, cd)`** bridge → `PraxisMarks.render` (never hand-rolled).

## What was built
- **Atmosphere**: `wrap.className = 'arcs lum-amber'` + a full-bleed amber ground (centered
  1080 column) — the book/notebook full-bleed pattern.
- **Mini-constellation** (`_arcCardConstellation`): up to 5 of the arc's sub-theory idea-lights
  via `bookSubMarkHTML`, deterministic id-hash positions, faint curved threads, each light's
  size + glow scaled by its real `_stComputeMaturity`. Empty arc → quiet dark band + faint dot.
- **Sort** (`_arcsSortBar` + `_arcsSortApply`, persisted `praxis_arcs_sort`): Recent (createdAt) /
  Name (title) / Maturity (aggregate `_stComputeMaturity`) — all real fields. + **"N arcs"** count.
- **Meta** (`_arcCardMeta2El`): "N sub-theories · <maturity word> · touched <when>" — count real,
  maturity word + touched derived from real fields (display-only).
- **Begin tile**: existing `.arc-card-start` restyled to the mock dashed `.begin`.
- CSS: scoped `.arcs.lum-amber` token-remap + glass card + constellation band + sort/count + begin.
- Removed two now-dead helpers (`_arcCardThumb`, `_arcCardMetaText`) my change orphaned.

## Mechanical gates

| Gate | Expected | Actual | Verdict |
|---|---|---|---|
| views.js Δbytes | +4000 ±2000 → [2000,6000] | **+6972** | **FAIL — over ceiling by 972** |
| components.css Δbytes | +3000 ±1500 → [1500,4500] | **+5517** | **FAIL — over ceiling by 1017** |
| combined surface | ≤ 10500 | **12489** | over by 1989 |
| views.js parse (cscript) | PASS | PASS (700430 chars) | PASS |
| components.css braces | balanced | 2572 / 2572 | PASS |
| components.css parens | balanced | 4820 / 4820 | PASS |
| EOL (git i/w) | i/lf w/crlf | i/lf w/crlf | PASS |
| foundation lock | 14681 / 10255 | 14681 / 10255 | PASS |
| dead code | gone | function defs 0/0 | PASS |
| dirty set | views.js + components.css | + yumi-ui/import-capture (A,B held) | PASS |

## Classification of the byte miss
Not scope creep: parse PASS, additive (net of removing 2 dead fns), zero fabricated fields,
the deferred controls genuinely omitted. The overshoot is the real size of (a) a per-arc
mini-constellation renderer (the centerpiece feature), (b) the sort + maturity/touched/meta
helpers, and (c) a token-pure `.lum-amber` reskin with the full-bleed restructure + color-mix
verbosity (same tax as Surface A). The +4,000 / +3,000 recon estimates undercounted all three.

## HALT — awaiting Preston (exactly the Surface A flow)
Per protocol + the explicit "far off = stop and report." Build parses + balances and is
render-ready, but NOT rendered yet. Options:
- **A (recommended):** re-baseline to ~+6,972 / +5,517 (justified: real constellation feature +
  token purity), then I render-and-look (desktop + true 390) and HOLD with screenshots.
- **B:** trim — drop the "touched" meta leg + tighten comments (~views +6,150) and trim the CSS
  comment/whitespace (~css +4,900); neither reaches the original ceiling without cutting real
  look (constellation band / sort / begin) — i.e. fidelity loss, same as Surface A's option B.

No commit. CACHE_VERSION still v3.160 (→ v3.161 at the single wave ship).

## RESOLUTION — Preston chose A (re-baseline), keep the "touched" meta
Re-baselined to views.js +6,972 / components.css +5,517 (in-scope, additive, real
features). No trim. Defers stay omitted (verified absent below).

## Render-and-look — PASS (desktop 1280×800 + true 390×844 CDP)
Server `praxisapp-w7` :8761 (KeepAlive off). SW+caches cleared → 0 before reload. Seeded a
fake signed-in user + 4 arcs (varying createdAt/title/maturity) + 12 sub-theories (+ the
seed Pedagogy-of-Desire arc with 3 subs). Screenshots: desktop grid, examples row, 390 1-up.

Manifest vs arcs-amber.html — all ticked:
- [x] full-bleed `.arcs.lum-amber` amber ground + centered 1080 column.
- [x] sort Recent/Name/Maturity each re-sorts the REAL set — Recent (createdAt desc), Name
  (On/Teaching/The/What alpha), Maturity (Hidden→Teaching→Banking→What, = seeded maturity);
  active-state + `praxis_arcs_sort` persistence confirmed.
- [x] glass arc-card material (`--lum-glass`), hover lift.
- [x] per card: title (serif) · description (quiet) · meta "N sub-theories · <maturity> ·
  touched <when>" (e.g. "5 sub-theories · mature · touched today").
- [x] mini-constellation of REAL sub-theory marks: **15/15 lights are `.lum-mark`** via
  `bookSubMarkHTML → PraxisMarks.render`; glow scales with `_stComputeMaturity` (arc 1 rich,
  arc 4 a single faint light). Distinct shapes/colours render.
- [x] begin-an-arc tile ("Start another arc", dashed).
- [x] seed card (Pedagogy of Desire) renders a real 3-mark constellation — NOT empty/broken;
  the illustrated card uses the clean empty-band fallback (faint dot).
- [x] Yumi-cyan never hand-painted on a light — mark glow colours are the PraxisMarks palette
  (#E8B45C/#6FC9BC/#9BA4E8/#EFA89A…), zero `#7fd0f0`.
- [x] DEFERRED + ABSENT: no `.pubtog`, no `.pub` chip, no `.conseq` line; meta has no
  walked/built-on/questioned.
- [x] non-amber path intact: `#arc/<id>` arc-detail renders (title + "5 sub-theories"),
  console clean. (Only the two JS helpers were removed; the legacy `.arc-card-*` CSS block
  was left in place, untouched.)
- [x] 390 reflow: grid 1-up (326px col), symmetric ~32px gutters, **no horizontal overflow**.
Console clean on every surface.
