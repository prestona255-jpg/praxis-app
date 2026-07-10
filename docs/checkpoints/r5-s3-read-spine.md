# R5 S3 — THE READ SPINE — RECON + DESIGN (build spec; durable)

Shared deterministic Read renderer, two lenses (author `_arcFieldReadFace` + visitor `renderInteract`).
NO model calls. Files: js/views.js + assets/components.css.

## Anchors (verified)
- `_arcFieldReadFace(arc)` views.js:13210-13310 — current: `.arcfield-read` head "The threads in your field"
  + `.arcfield-read-threads` (flat A⟷B rows) + `.arcfield-read-subs` (name + N threads). To be REBUILT to the spine.
- Called at views.js:13185 (`arcFace === 'read'`).
- `renderInteract(arcId)` views.js:17423 — the #walk/#interact page. NOT a thin read view:
  it is the SHIPPED W6.5 SOCIAL LAYER — head (byline `data.authorPublicName`, walkedBy, tags), `.itx-subs`
  (17521-17553: per-sub `.itx-sub` = mark + head + body + `.itx-thread` host), arc-level thread
  (`.itx-arclevel`), `loadBuildOnsForArc` → `placeContrib` into `threadHosts[''+idx]` keyed by
  `targetAnchor`, and `_itxComposer` (build-on / ask-a-question). Walk mark bug @17531 (S5).
- gutter renderer (mockup): `buildReadGutter(svgId, rowCenters[], edgesIdx[[i,j]])` — path
  `M 28 a Q gx (a+b)/2 28 b` (gx=8 if |i-j|>1 skip, else 28), stroke var(--thread); + a gold-hi dot per row.

## DATA-SHAPE FINDING (decisive)
`buildPublishedArcDoc` (integrations.js:2442-2476) projects each published sub-theory as ONLY
`{ header, body:bodyPublic }` — NO mark identity, NO maturity, NO edges. So the VISITOR spine is
inherently thinner than the author spine: title + first-line + mark only. NO gutter threads (no edges
in payload), NO maturity glow, NO connection count for the visitor. (S5 adds mark identity to the
payload; maturity/edges for the visitor are out of R5 scope.) The shared renderer must render-what's-present.

## COLLISION (prime directive: behavior-preservation > structure; report, don't silently pick)
Mockup Scene D = a READ-ONLY visitor spine. Live `renderInteract` = the shipped W6.5 social layer
(build-on/question contributions anchored per-sub + composer + walkedBy increment). These DIVERGE.
Resolution (behavior-preservation): KEEP the W6.5 social layer. The shared spine replaces ONLY the
`.itx-subs` sub-DISPLAY loop; each row exposes a `.itx-thread` host (via an `onRow` seam) so
`placeContrib`/`threadHosts[''+idx]` still work; the arc-level thread, `_itxComposer`, and
`loadBuildOnsForArc` stay UNCHANGED. Add the threshold cue + amber room. → REPORT at THE STOP.

## DESIGN — shared renderer `_arcReadSpine(rows, opts)`
- `rows` = [{ id, title, firstLine, markSub (record for bookSubMarkHTML) | markSize, maturityWord?,
  maturityKey?('bright'|'mature'|'forming'), connCount?, isDraft? }].
- `opts` = { edges? ([[i,j]] index pairs → gutter), onRow?(rowEl,i,row), lens }.
- Builds `.read-list` → `.read-gutter-svg` (only when edges present) + `.read-row`s (mark, body:
  row-top[title link, glow, private?], first-line, meta[connCount]). Gutter via a ported buildReadGutter
  using index-proportional row centers (viewBox 0 0 56 N*140, preserveAspectRatio none; approximation
  matching the felt-passed mockup — noted). Deterministic.
- Author (`_arcFieldReadFace`): rich rows from `_arcDetailBuildSubTheoryData` (real maturity via
  _stComputeMaturity→_arcMaturityWord mapping, edges, isDraft = status==='draft' → `.read-private`),
  + arc-level `.read-closing`. Replaces the flat threads+subs blocks.
- Visitor (`renderInteract`): thin rows from `data.subTheories` ({header,body}); mark = existing
  `{id:arcId+':'+idx}` (S5 fixes to real); NO edges (no gutter), NO maturity/conn (payload lacks);
  NO private markers (published-only). onRow attaches `.itx-thread` host + sets `threadHosts[''+i]`.
  Wrap adds `.room-threshold` cue. Composer/contributions/arclevel UNCHANGED.

## CSS (mockup 362-402) — add `.read-*` using LIVE `--lum-*` tokens so the spine adapts to whichever
ground it's in (author warm-dim `.arcfield.arcfield-warm .arcfield-read` OR visitor amber `.itx-root`):
`.read-list/.read-gutter-svg/.read-row/.read-mark/.read-body/.read-row-top/.read-title(+a hover)/
.read-glow/.read-glow-dot.is-{bright,mature,forming}/.read-first-line/.read-meta/.read-private/.read-closing`.
Maturity map: seed/forming→is-forming, warming/mature→is-mature, bright→is-bright.
NO rg-light/rg-warm/rg-amber toggle (S2 ruled it doesn't ship; Read is warm-dim by default).
`.read-change-mark` + `.read-fold-*` are S6/S4 — defer their wiring, but the fold divider markup is S4.

## GATE (S3): one renderer, two call sites (grep-proof); walk renders the spine on prestonpraxistest
data; no generative call added; parse clean; Δ=0 frozen-3; W6.5 social layer preserved (composer +
per-sub build-on anchoring intact).

## RULING (Preston, 2026-07-09): PRESERVE W6.5 (spine as read display)
The shared spine replaces only the visitor sub-DISPLAY; each row keeps its `.itx-thread` build-on host
(onRow seam) + the composer/contributions/arc-level thread stay untouched. Report the divergence at THE STOP.

## Slice log — BUILT, gates PASS
- Shared `_arcReadSpine(rows, opts)` @views.js:13278 + helpers `_buildReadGutterInto`,
  `_arcReadFirstLine`, `_arcReadMaturityKey`, `_matWordFromScore`.
- `_arcFieldReadFace` rebuilt to the spine (author lens): real mark/maturity-glow/first-line/
  connCount + `.read-private` on drafts + gutter threads (edgePairs) + `.read-closing`. Dropped the
  cyan "threads in your field" head (covenant mis-seam).
- `renderInteract` visitor lens: `.itx-subs` display loop → `_arcReadSpine` (published payload rows:
  title+first-line+mark; no maturity/edges/private); `.room-threshold` cue added; **W6.5 PRESERVED** —
  onRow attaches `.itx-thread` + `threadHosts['' + i]` (index-aligned to the composer's targetAnchor);
  composer/contributions/arc-level thread UNCHANGED.
- CSS: `.read-*` scoped under `.read-list` (no bleed), `--lum-*`-driven (adapts warm↔amber); `.read-closing`
  under `.arcfield-read`; `.room-threshold` under `.itx-root` (uses --subtheory-1, NOT Yumi cyan).

## Gates — ALL PASS
- parse: PARSE OK js/views.js (exit 0).
- ONE renderer (`_arcReadSpine` def @13278) · TWO call sites (author @13258, visitor @17665).
- no generative call in the spine (deterministic; grep clean).
- W6.5 preserved: `threadHosts['' + i]` set in onRow @17668.
- ES3 clean (backtick-in-comment removed); Δ=0 frozen-3; CSS braces 3324/3324.
- bytes: components.css +37 · views.js +317/−99.

## Residuals
- R-S3a: visitor marks still the arcId:index hash (the walk mark bug) — S5 wires the REAL mark identity
  into the publish payload. Expected/next.
- R-S3b: dead CSS from the old displays (`.arcfield-read-head/-threads/-sub*`, `.itx-sub*`) no longer
  emitted → S6 dead-code sweep.
- R-S3c: gutter endpoints are index-proportional (approximate when rows vary height), matching the mockup.
- R-S3d: visitor room = shipped `.itx-root lum-amber-ember` + new threshold cue (behavior-preserving),
  not a byte match of mockup `.arcfield-room` — felt-pass note.
- GATE "walk renders spine on prestonpraxistest data" = LIVE verification, deferred to THE STOP smoke.
- VISUAL GATE: spine LOOK unverified until Preston's felt pass on the deployed app.
