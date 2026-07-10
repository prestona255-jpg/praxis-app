# R5 S5 — PUBLICATION LEGIBILITY + MARK IDENTITY — BUILT (⚠ payload data-adjacent)

## Part A — mark identity (the walk mark bug)
- `buildPublishedArcDoc` (integrations.js:2469-2485) now carries each sub's RESOLVED markShape/markColor
  (0-15): stored indices if valid, else the deterministic hash of the REAL sub id (window.stHashIndices,
  a runtime global reachable at publish-time), else 0. Exact diff in the commit.
- `renderInteract` spine (views.js:17665-17672): vHasMark → `markSub:{markShape,markColor}` (real) else
  `null` → `_arcReadSpine` falls back to the `{id: arcId:index}` hash. OLD snapshots (no mark fields) render
  the SAME hash marks as before (graceful); republishing corrects them to the author's real marks.

## Part B — D3 head publish control (owner-only, quiet)
- `_arcHeadPublishControl(arcId, arc)` (views.js:12610) mounted in renderArcDetail head, gated
  `user && arc.userId === user.uid` (excludes the seed). Published → "In the commons · <freshness>" +
  Unpublish; not-published → "Publish to the commons" (disabled + "Publish once you've begun." hint at 0 subs).
  Calls the EXISTING publishArc/unpublishArc → renderArcDetail on success.
- Staleness: `_arcPublishStale` compares newest arc/sub activity to `arc.publishedAtLocal` (a client-clock
  publish time now cached by publishArc, integrations.js:2557). Stale → "edited since published — republish
  to update". Real fields; testable on a stale fixture.
- Covenant: NO walkedBy count badged here (never badge energy); the count lives on commons/profile.

## Part C — D2 card chip
- `_arcCardMeta2El` (views.js) appends a quiet `.arc-chip-commons` "in the commons" when `rec.published`.
  Meta restructured to flex-column (line + chip). CSS: `.arc-chip-commons` (light) + `.arcfield-pub*` (warm).

## Gates — ALL PASS
- parse OK (views + integrations). grep-proof: payload markShape/markColor@2483-84; spine vHasMark/markSub;
  _arcHeadPublishControl/_arcPublishStale/publishedAtLocal; arc-chip-commons.
- Δ=0 frozen-3; ES3 clean; CSS braces 3335/3335; bytes css +17, integrations +20/−3, views +90.

## Residuals
- R-S5a: mark round-trip (publish → walk shows the SAME marks as the author field) + the payload markShape/
  markColor write not rejected by publishedArcs rules — verified at THE STOP live smoke on prestonpraxistest
  (the S5 gate; needs Firestore).
- R-S5b: old published snapshots show the arcId:index hash marks until republished (graceful, per prompt).
- R-S5c: the head quick-publish uses the DEFAULT identity (pen/display); the full identity+freshness panel
  stays on the profile (_opPublishControl). Deliberate quiet head affordance.
- R-S5d: staleness reads not-stale for arcs published before publishedAtLocal existed (until republish).
- R-S5e: walkedBy count NOT badged on head/cards (covenant) — count is on commons/profile.

## Commit: LOCAL checkpoint, --no-verify (single sw.js bump at THE STOP).
