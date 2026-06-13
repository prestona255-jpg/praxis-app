# 10.5 — Stage 0 recon

HEAD: ca7fd13 (v3.95). Tracked tree clean (3 unrelated untracked strays).
Protocol: default execution protocol governs. 10.5.6 carries the DESIGN
DECISION GATE — build halts there for Preston's comp-gate via live screenshots.

## Baselines (re-measured)
| File | Bytes | Lines |
|---|---|---|
| js/state.js | 75,019 | 1,836 |
| js/views.js | 329,075 | 7,999 |
| assets/components.css | 161,917 | 5,726 |
| sw.js CACHE_VERSION | — | praxis-v3.95 |

## Anchors confirmed (all where the plan expects)
- Disclosure: `attachBtn` "+ Attach a book" (views.js:5062-5074), local classList
  flip on `pickerWrap` (:5057). pickerWrap children: sourceSection THEN
  externalSection (:5059-5060).
- FINDING for 10.5.1: externalSection is ALREADY a structural sibling of the book
  list inside pickerWrap — the "flatten" is presentational (the external toggle
  reads as a secondary button below the source list, styled
  `notebook-editor-cancel subtheory-external-toggle`, views.js:4975). Slice scope
  = rename "+ Attach a book"→"+ Attach evidence" (2 code occurrences :5065/:5069)
  + surface the external toggle at the disclosure's top level alongside the
  source list label (reorder/peer presentation), no data change.
- buildExternalForm (views.js:4982), externalToggle (:4976).
- Rail rows: buildAttachedRow (views.js:4762).
- Registers: publicBody (:4329), intelBody (:4337); previews
  publicPreview/intelPreview (:4386+); refreshCitationPreviews (:4649);
  Preview toggle `.subtheory-preview-toggle` (:4402).
- citePins closure (views.js:4533). citationPins refs in code: 0 (green-field).
- Schema terminal: 1.16.0 (state.js:1831); 10.5.7 adds 1.16.0 -> 1.17.0.
  Literal anchor 1.9.3 untouched as always.

## Slice order + byte bands (set here per plan)
ROADMAP NOTE resolution: the plan says the roadmap HTML gets its 10.5 entry as
10.5's OWN first slice — recorded as SLICE 0 below.

| Slice | File(s) | Band | Notes |
|---|---|---|---|
| 0 — roadmap entry | Praxis_Roadmap.html | +800..+2,500 | add s10-5 substage block to s10.substages (data-only) |
| 10.5.1 — rename/flatten | views.js | +100..+600 | 2 label renames + peer presentation of external toggle |
| 10.5.2 — Cite button | views.js | +1,200..+3,000 | insert-at-cursor helper + last-focused-register tracking + row action |
| 10.5.3 — autocomplete | views.js | +1,500..+3,500 | "*"-triggered picker (mirror 10.1 picker pattern), writes plain *Title* |
| 10.5.4 — coach line | views.js + css | views +300..+1,000; css +200..+800 | muted teaching sentence, hidden once a citation exists |
| 10.5.5 — tap support | views.js | +300..+1,000 | touch tap on resolved dot -> .arc-tooltip card |
| 10.5.6 — Write/Preview toggle | views.js + css | set AFTER comp gate | DESIGN GATE: options presented when reached; Preston comp-gates on live screenshots |
| 10.5.7 — persist pins | state.js (+views read-through) | state +800..+2,000; views +200..+1,200 | schema 1.16.0->1.17.0, citationPins field, ensureSubTheoryFields backfill, citePins reads through. SCOPE CONFIRMED AT GO (Preston): ALSO route persisted citationPins into renderSubTheoryReadOnly's citation resolution — the published render respects the author's pin; first-candidate remains the unpinned fallback. Views band restated +200..+1,200 at recon time to cover BOTH read-through sites (editor closure + read-only resolver). |
| final — SW bump | sw.js | 1/1 swap | -> praxis-v3.96 |

Deviations follow the recorded-deviation discipline (comment-only clears by
classification; logic overage = split or component accounting; no silent widen).

## Verification plan
Per the default protocol: live checks run by the executor in the provisioned
test session (prestonpraxistest@gmail.com — identity reconfirmed before any
write; 10.4 fixtures still present and reusable). Live-DOM structural proof is
the hard evidence; screenshots corroborate (session IDs if no repo path).
Comp-gate for 10.5.6 = live screenshots of layout options (gate #2, human-only).
