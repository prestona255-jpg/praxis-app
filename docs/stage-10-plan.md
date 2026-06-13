# Stage 10 build plan — 10.3, then 10.2, then 10.4

Execution governed by the "Plan-file execution protocol" in CLAUDE.md.
Build order is 10.3 -> 10.2 -> 10.4 (10.3 is small and unblocks 10.2's
external-source linking). Baselines at authoring (HEAD bb177f9, v3.92):
state.js 73,484 b / views.js 306,306 b / components.css 158,406 b.
Re-measure at each substage start; cite plan baselines only as sanity.
Every substage: SW bump in its FINAL slice (v3.93 for 10.3, v3.94 for
10.2, v3.95 for 10.4 — adjust if reality has moved). Commits use em-dash.

## SUBSTAGE 10.3 — External quotes (finish the 9.2 form)

Roadmap: s10-3 L5019-5038. Most of this shipped in 9.2: buildExternalForm
(views ~4418-4465) already collects title/author/quote/annotation and
saves via addEvidence kind 'external'. Remaining work is surgical.

NON-GOALS: no promote-to-shelf; no DOI/metadata fetch; no URL embedding;
no changes to book/entry evidence handling; no UI redesign of the form.

STAGE 0 RECON (write to docs/checkpoints/10-3-recon.md, then proceed —
no decision gate): confirm current addEvidence external branch
(state ~1129-1143, refId null), buildExternalForm anchors, schemaVersion
runtime terminal (expect 1.15.0), genEvidenceId availability for UUID
duty or locate the house UUID util. Re-measure baselines.

SLICE 1 (state.js): external refId = UUID.
- addEvidence: when kind==='external', assign refId = a new unique id
  (reuse the house id-gen pattern; do NOT invent a new scheme).
- Migration 1.15.0 -> 1.16.0: idempotent backfill — every existing
  evidence element with kind 'external' and refId null gets a new id.
  Bump runtime terminal to 1.16.0; the pinned 1.9.3 literal anchor is
  UNTOUCHED (seed-ladder rule in CLAUDE.md context).
- Gates: cscript parse PASS state.js; byte delta expected +400..+1200;
  grep '1.16.0' count = the migrate-chain pattern count for a terminal
  step; console harness proves backfill idempotent (run twice, second
  run changes nothing).

SLICE 2 (views.js): required title.
- buildExternalForm save path: empty/whitespace title -> do not save,
  show inline error or disable save (mirror nearest existing
  required-field pattern in the codebase; recon names it).
- Gates: parse-check-views.js PASS; byte delta +150..+600; grep the
  validation guard appears exactly once.

SLICE 3 (sw.js): CACHE_VERSION -> next version. Token swap counts must
match. Full-diff verify.

LIVE PASS-CHECKS (after Preston-authorized push): add external source
with empty title -> blocked with feedback; with title only -> saves and
renders in the rail; DevTools: new external item has non-null refId;
re-load -> previously-saved old external items now carry refIds
(backfill proof); different sub-theory's picker/rail does not show it
(locality); shelf has no phantom book. Screenshot the rail before/after.

## SUBSTAGE 10.2 — Inline citation rendering (the heavy lift)

Roadmap: s10-2 L4998-5018. NOTHING exists today: body is a raw textarea
(blur-saved, views ~4074-4085), raw text stored verbatim, zero italic
rendering (comment at views ~3658 defers to Stage 10).

NON-GOALS: no fuzzy matching beyond case-insensitive substring; no
author-name linking; no un-italicized detection; no arbitrary phrase
linking; no contenteditable migration unless the decision gate picks it;
no touching blur-save semantics.

STAGE 0 RECON + DECISION GATE (write to docs/checkpoints/10-2-recon.md,
then HALT): the spec's "underline-dot in the writing surface" cannot
style text INSIDE a textarea. Report the layout facts (editor DOM,
where a preview pane could mount, the rail's width budget) and cost out
three options: (A) live preview pane beneath each register's textarea,
rendered read-only with underline-dot citations — standing
recommendation from chat: this renderer is then REUSED as 10.4's
renderSubTheoryReadOnly draft mode, built once; (B) overlay div
mirroring the textarea (fragile: scroll/wrap sync); (C) contenteditable
migration (large, risks blur-save + ES3 complexity). HALT. Preston
takes the recon to chat; the decision comes back before Slice 1.

SLICES (assuming A; re-plan at the gate if not):
SLICE 1 (state.js or views.js per recon): pure citation matcher —
parseCitations(bodyText, evidence) -> ordered segments
[{text}|{text, evidenceId}] detecting *asterisk* spans, case-insensitive
substring match vs evidence display titles (book title / entry label /
external title via refId). Multi-match -> mark ambiguous (carry all
candidate ids). No-match -> plain-italic segment. Pure function, zero
DOM, zero state writes. Gates: parse PASS; console harness covering:
match, no-match, case-insensitive, multi-match, asterisk-at-edges,
unclosed asterisk (renders literal); byte delta +800..+2500.
SLICE 2 (views.js): preview pane per register — renders segments:
plain text, plain italics, citation spans w/ underline-dot style +
title tooltip (house tooltip pattern; recon names it). Re-render on
textarea input (debounced ok) and on evidence add/remove (hook the
existing refreshAttached contract ~views 4477). Gates: parse PASS;
byte delta +1500..+4000; grep render fn defined once, called from both
registers.
SLICE 3 (views.js): disambiguation — right-click/long-press on an
ambiguous citation opens a small chooser (mirror the 10.1 picker
pattern); choice pins evidenceId for that span occurrence. Persistence
of pinning: store pin map on the sub-theory record ONLY if recon found
a clean field path; else pin is render-session-only and the plan notes
it as a residual. Gates: parse PASS; byte delta +800..+2500.
SLICE 4 (components.css): citation span, dot, tooltip, preview-pane
styles. Vars only, zero raw hex in added lines, brace balance. Byte
delta +600..+2000.
SLICE 5 (sw.js): version bump, token-count match.

LIVE PASS-CHECKS: italicize an attached book's title -> dot + tooltip
in preview; phrase matching nothing -> plain italics; remove that
evidence -> dot vanishes without reload; ambiguous title -> chooser
works; externals (10.3 refIds) link too. Screenshots: preview pane with
one resolved + one unresolved italic.

## SUBSTAGE 10.4 — Dual rendering (read-only synthesis)

Roadmap: s10-4 L5039-5059. Green-field: no renderSubTheoryReadOnly, no
status==='published' branch, linkedSubTheories never listed.

NON-GOALS: no print styling; no formal citation formats; no
footnote/endnote options; no DOI/URL links; no new routes beyond what
recon justifies; no publishing WORKFLOW (button/flow) unless recon shows
one exists — rendering only.

STAGE 0 RECON (write to docs/checkpoints/10-4-recon.md; DECISION GATE
only if surprises): where read-only contexts mount today (constellation
preview/hover, arc detail), whether 10.2's preview renderer landed as
the reusable base (expected), how status flips to 'published' today (if
nothing flips it, REPORT — the plan treats publish-trigger as
out-of-scope and renders both modes via a parameter). PRIVACY CHECKPOINT
(standing decision from chat): report what a published rendering would
expose when evidence quotes private journal entries — list the exposure
paths; if rendering would surface private-entry content in any
non-owner context, HALT for decision.
SLICE 1: renderSubTheoryReadOnly(subTheory, mode) — body via the 10.2
segment renderer; mode 'published' = italics + superscript numbers
(first-appearance order), mode 'draft' = 10.2 dots. Numbered evidence
block: full citation line per item (book title/author from state.books;
entry label; external title+author), optional quote as blockquote,
optional annotation; cited-first by first appearance, uncited appended.
linkedSubTheories -> "see also" list (headers, linked). Empty arrays ->
sections suppressed entirely. Gates: parse PASS; byte delta
+2500..+6000; helper defined once.
SLICE 2: mount it in the read-only contexts recon identified (minimum:
a viewable read-only state of the sub-theory page; constellation
hover/preview only if recon shows a clean seam). Gates: parse PASS;
grep call sites match recon's list exactly.
SLICE 3 (components.css): superscripts, evidence block, see-also.
Vars only, zero hex, brace balance.
SLICE 4 (sw.js): version bump.

LIVE PASS-CHECKS: sub-theory with 3 evidence items, 2 cited -> published
mode shows superscripts in appearance order, block lists cited then
uncited; zero evidence -> no empty block; draft mode still dots; see-also
lists linked sub-theories; private-entry exposure matches the decision
made at the gate. Screenshots: published render + evidence block.

## SUBSTAGE 10.5 — Citation UX

PURPOSE: close the discoverability and friction gaps in the 10.2 citation
surface. Runs ONLY after 10.4 ships.

STAGE 0 RECON (write to docs/checkpoints/10-5-recon.md): re-measure
state.js / views.js / components.css and CACHE_VERSION; confirm the 10.2
anchors are still where this plan expects (buildExternalForm / externalToggle
disclosure, the rail evidence rows / buildAttachedRow, the register textareas
+ preview panes, the citePins closure, the schema-chain terminal). Set each
slice's byte band from the re-measured baselines. Slice 10.5.6 carries a
design decision gate -- halt there before any build.

SLICES, in build order:
10.5.1 (views.js) Attach-disclosure rename/flatten — button becomes
"+ Attach evidence"; "Add external source" surfaced at the same disclosure
level as the book list, not nested below it. Gates: parse PASS; byte band
per recon; grep the new label appears once.
10.5.2 (views.js) Cite button — each evidence row in the rail gets a small
"Cite" action that inserts *Title* at the cursor of the most recently focused
register body (fallback: append + focus). Gates: parse PASS; byte band per
recon; grep the insert helper defined once.
10.5.3 (views.js) Autocomplete — typing * in a register body opens a small
picker of attached evidence titles; selection writes plain *Title* text. The
textarea blur-save contract is untouched — this is an input helper, not a
rendering change. Gates: parse PASS; byte band per recon; grep the picker
opener defined once.
10.5.4 (views.js + components.css) Coach line — when the preview pane has no
citations, show one muted sentence teaching the asterisk convention. Gates:
parse PASS; CSS brace balance + zero hex; byte bands per recon.
10.5.5 (views.js) Tap support — on touch, tapping a resolved dot shows the
.arc-tooltip card (chooser long-press behavior unchanged). Gates: parse
PASS; byte band per recon.
10.5.6 (views.js + components.css) Write/Preview toggle — replace stacked
raw+preview with a two-tab toggle per register. DESIGN DECISION GATE: present
layout options at recon; Preston comp-gates via live screenshots before
build. Gates: parse PASS; CSS brace balance + zero hex; byte bands per recon.
10.5.7 (state.js) Persist pins — schema 1.16.0 → 1.17.0, idempotent migration
adding subTheory.citationPins; citePins closure map reads through to it. The
1.9.3 literal anchor is never bumped. Gates: cscript parse PASS state.js;
byte band per recon; grep '1.17.0' = terminal-step count; console harness
proves the migration idempotent.

GATES: per-slice byte bands set at 10.5's own Stage 0 recon (baselines will
have moved after 10.4). SW bump → one version at the substage's final slice.
Standard mechanical self-gates apply (parse, byte band, grep counts, no
unintended dirty file, no EOL flip); deviations follow the recorded-deviation
discipline (component accounting, no silent band widen).

ROADMAP NOTE: the app's roadmap HTML gets its 10.5 entry as 10.5's own
first slice, not now — recorded here so the divergence is honest, never
fake-stamped.

NON-GOALS for 10.5: no contenteditable/WYSIWYG rewrite; no fuzzy or
author-name matching; no changes to parseCitations semantics; no print
styling; no publish workflow; no Firestore-merge changes beyond the
citationPins field.

LIVE PASS-CHECKS (after Preston-authorized push): "+ Attach evidence" reads
at the flattened disclosure with external source beside the book list; a rail
row's Cite inserts *Title* at the cursor; typing * opens the title picker and
writes *Title*; an empty preview shows the coach line, which vanishes on the
first citation; tapping a dot on touch shows the card; the Write/Preview
toggle matches the gated comp; a pinned ambiguous citation survives reload
(persisted citationPins). Screenshots per slice.
