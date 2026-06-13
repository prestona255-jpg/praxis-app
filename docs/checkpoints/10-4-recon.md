# 10.4 — Stage 0 recon + PRIVACY CHECKPOINT

HEAD: 2c1356e (v3.94). Tracked tree clean (only 3 unrelated untracked strays).
**HALTS at the privacy checkpoint for Preston's decision (below).**

## Baselines (post-10.2)
| File | Bytes | Lines |
|---|---|---|
| js/state.js | 75,019 | 1,836 |
| js/views.js | 319,819 | 7,762 |
| assets/components.css | 159,652 | 5,630 |
| sw.js CACHE_VERSION | — | praxis-v3.94 |

## Green-field confirmations
- renderSubTheoryReadOnly: does NOT exist (0 refs). 10.4 builds it.
- No `'published'` branch anywhere in views.js. publishedAt is only the schema
  default (state.js:455/975), NEVER set to a timestamp by any code.
- => Nothing flips status to 'published' today. Per the plan, publish-trigger is
  OUT OF SCOPE: renderSubTheoryReadOnly(subTheory, mode) takes mode ('draft' |
  'published') as a parameter; 10.4 renders, it does not publish.

## 10.2 reusable base (expected -> confirmed)
- parseCitations (pure) + the segment model are reusable directly.
- renderCitationPreview is a CLOSURE inside renderSubTheoryPage (not top-level), so
  10.4's helper reuses parseCitations and re-implements the segment->DOM paint in a
  standalone, state-pure-ish renderer (draft mode = underline-dot; published =
  superscript numbers). The bare-title resolver (citationMatchTitle) and evidenceLabel
  logic are the reference for the evidence-block citations.

## Read-only contexts that exist today (SLICE 2 mount candidates)
- renderSubTheoryConstellation (arc-constellation.js:1223): the arc theory view; owner's
  own arc. Hover renders st-hover-card (title/meta) + tooltip "marks" via _stBuildMarks
  (views.js:5009) and markLines (views.js:5231-5238) -- which ALREADY surface each
  evidence mark's label AND quote in the owner's constellation hover.
- The sub-theory page (renderSubTheoryPage) is EDITING-only today; there is no read-only
  "published preview" state. SLICE 2 must add a viewable read-only mount (a published
  preview of the sub-theory) -- the clean seam to pick at build (e.g. a Preview mode on
  the page, or the constellation preview). NO public / non-owner route exists yet
  (Stage 12 owns that).

## PRIVACY CHECKPOINT (standing decision) -- exposure paths
Private journal entries CAN be attached as evidence: the 10.1 "Send to sub-theory"
picker deliberately allows private entries, and openEntrySendToSubTheory captures
`quote = entry.body` (views.js:6705) -- so the FULL private journal body is stored as
the evidence element's quote on the sub-theory record.

A published evidence block (10.4) renders, per evidence item of kind 'entry':
1. STORED QUOTE = the entry body captured at attach time (el.quote on the sub-theory).
   This is the largest exposure: full private-journal text, persisted on the sub-theory
   even if the entry is later deleted or made private.
2. evidenceLabel = entry.title, else a 60-char body preview (views.js evidenceLabel,
   resolved LIVE from state.notebookEntries[refId]).
3. annotation = the user's own note (lower concern; user-authored about the evidence).
Inline body citations only match TITLED entries (citationMatchTitle), so an italicized
private-entry title could also resolve. linkedSubTheories "see also" lists headers only
(no private exposure).

isPrivate IS checkable at render time: evidence kind 'entry' -> refId ->
state.notebookEntries[refId].isPrivate. Edge case: if the entry was deleted, the live
isPrivate is unknown but the stored quote persists.

### Exposure scope TODAY vs the seed risk
- TODAY 10.4 mounts owner-only (constellation = owner's arc; the read-only sub-theory
  view = owner viewing own). So there is NO live non-owner exposure in 10.4 itself.
- BUT the 'published'-mode renderer built here is the BASE Stage 12 will reuse for the
  public arc/sub-theory page. If published mode renders private-entry quotes/labels,
  that exposure ships the moment Stage 12 mounts it publicly. Cheaper to decide now than
  to retrofit.

## DECISION NEEDED (HALT) -- how should 'published' mode treat private-entry evidence?
Draft mode (owner) shows everything (owner's own data). The decision is PUBLISHED mode:
- A. EXCLUDE: published mode omits any evidence item whose kind is 'entry' and whose
  live entry isPrivate === true (or entry missing) from the evidence block; its inline
  citations fall back to plain italics. Strongest privacy; the published artifact simply
  has fewer evidence items.
- B. REDACT QUOTE: published mode keeps the citation line/label but suppresses the stored
  quote for private entries (e.g. label only, or "[private source]"). Preserves the
  reference, hides the content.
- C. NO REDACTION in 10.4: render everything; defer privacy filtering to Stage 12's
  public-page boundary. Bakes the exposure into the renderer (riskier).

Recommendation: A (exclude private-entry evidence in published mode), checked on LIVE
isPrivate, treating a missing entry as private. Build the parameter now so Stage 12
inherits the safe default. Await Preston's choice before SLICE 1.
