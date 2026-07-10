# R5 ARCS — Stage 0 recon (STARTED)

Build: R5 Arcs (DEEP round). Prime directive: parity-to-committed-mockup
`docs/studio/mockups/arcs.html`; behavior-preservation > structure-match on collision.
HEAD `f4be5c2` · CACHE_VERSION `praxis-v3.188` → ship target `v3.189`.

## Session-start rituals (done)
- `sh tools/ground-truth`: HEAD f4be5c2, hook ARMED, FIX-PROTOCOL v1.2, 7 agents, exit 0.
- Read PROTOCOL.md (v1.1), FIX-PROTOCOL.md (v1.2), docs/studio/sequence.md.
- sequence.md confirms **R5 Arcs is the `Now` round** (heaviest open surface); shape beat
  (forks + mockup + Preston felt-pass on the mockup) is DONE; this is the BUILD beat.

## Precondition 1 — mockup committed: PASS
- `docs/studio/mockups/arcs.html` = **86,010 B**, committed at HEAD `f4be5c2`
  ("studio: R5 Arcs mockup — read spine, published state, mark language, warm interior"),
  working tree clean.
- 86,010 B == the post-amendment size recorded in `arcs.md` amendment note (warm-dim
  interior + Read warm-dim-by-default + softened field vignette + Scene D amber room). MATCH.

## Precondition 2 — anchors (verified by symbol; drift only in stale ledger frontmatter)
| Symbol | Prompt line | Live line | Status |
|---|---|---|---|
| `_arcCardConstellation` | 3442 | 3442 | exact |
| `renderArcsPage` | 3544 | 3544 | exact |
| `renderArcDetail` | 12633 | 12633 | exact |
| `_arcFieldReadFace` | 13172 | 13172 | exact |
| `_arcFieldPageFace` | 13265 | 13265 | exact |
| `_opPublishControl` | 17060 | 17060 | exact |
| `renderInteract` | 17393 | 17393 | exact |
| `setSubTheoryPosition` (state.js) | 1999 | 1999 | exact |
| `linkSubTheories` / `unlinkSubTheories` (state.js) | — | 2137 / 2163 | found |
| `_ST_MARK_TABLE` (arc-constellation.js) | 801 | 801 | exact |
| `publishArc` / `unpublishArc` (integrations.js) | "in file" | 2491 / 2579 | found |
| register toggle block (bodyPublic/bodyIntellectual) | ~9932 | 9933–10104 | found |
| dual-body maturity reads (`_stComputeMaturity`) | ~11648/~11743 | 11747–11748 | found |
| arc-voice `.then` (considerArcVoice call site) | — | views.js:12491 | found |

- `arc.published` / `arc.freshness` / `publishedArcs/{arcId}.walkedBy` are **REAL, live-wired**
  (integrations.js publishArc 2491, unpublishArc 2579, anon walk walkedBy++ 3048). The
  views.js:3513 "no published flag" comment is **stale** — trust the fields (prompt confirmed).

## Precondition 3 — walk-view mark bug: CONFIRMED
- views.js:17501 (inside `renderInteract`): `bookSubMarkHTML({ id: arcId + ':' + idx }, 24)` —
  marks from a synthetic hash, not the sub-theory's real mark identity. S5 fixes this.
- Sibling construct at views.js:16970 `{ id: seedKey + ':' + i }` is a DIFFERENT seed-render fn,
  OUTSIDE renderInteract / S5 scope — noted, not touched.

## S4 scope note (register collapse)
- `Public|Intellectual` grep is noisy: also matches retained `bodyPublic` field,
  `authorPublicName`, `loadPublicProfile`, `activeRegisterPublic`. S4's "=0 render sites" gate
  targets the toggle LABELS (9994 'Public', 10000 'Intellectual') + the dual-body writing UI
  (publicBody/intelBody/showRegister/activeRegisterPublic, 9933–10104), NOT `bodyPublic`.
- Migration folds `bodyIntellectual` → `bodyPublic` (append under divider), never deletes;
  maturity (11747–11748) + first-line fallback (13912–13915) + context reader (827–828)
  repoint/verify at S4.

## S6 note
- `function renderArcConstellation` = 0 defs in js/*.js (only comment refs). Views.js copy
  appears already removed (W10 Lane B). S6 "cut" is likely orphaned-CSS-only — grep-prove at S6.

## FORK / decision row surfaced at Stage 0 (the one collision)
- **D4 (AF6 — consolidate the +Sub-theory button to ONE canonical control)** is in the committed
  mockup's decision table (arcs.md D4) but is **NOT covered by any build stage S1–S6**. It is the
  single live-relevant mockup decision the stage list omits (D0 is mockup-tooling-only, correctly
  excluded). Mechanical default = follow the explicit stage list (D4 DEFERRED, borders R6
  sub-theory territory). Flagged for Preston's ruling before S2 touches the arc-detail head.

## Verdict
Stage 0 CLEAN — all 3 preconditions PASS, all anchors resolve, no contradiction. One scope
fork (D4) surfaced.

## Go-ahead + D4 RULING (Preston, 2026-07-09)
- **D4 FOLDS INTO S2** — consolidate the 3 +Sub-theory call sites (header dup views.js:12774,
  dead control-bar instance ~12904, Page-face empty-state ~13284) into ONE canonical
  head-mounted control, for full mockup parity. Added to S2 scope.
- Go-ahead to self-run S1→S6 to THE STOP; local commit per stage; push on Preston's word.
