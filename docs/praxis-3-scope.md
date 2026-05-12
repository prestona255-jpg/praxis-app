# Praxis Stage 3 — Scope Document

*As of May 12, 2026 · Working document, not a roadmap entry · Source of truth for Stage 3 thinking until promoted to roadmap substage data*

---

## Status

Stage 2 substages 2.1 through 2.8 are Shipped. Stage 2.9 (voice document v1.1.0 + cache rollover) is committed and live; re-audit pending. When the re-audit returns required PASS on tests #13, #14, #15, #17, Stage 2 closes and Stage 3 opens.

This document is the working scope for Stage 3. It is not a promise of what will ship; it is the current best thinking, dated, with the design tensions named honestly. As substages get worked, their detail gets promoted into the roadmap; this document keeps the *why* visible after that promotion happens.

## What Stage 3 is

Stage 3 is *Notebook + Arcs UI*. After Stage 3 ships, a user can: open the Notebook as a top-level surface, see all entries (Marginalia and Journal) as one graph, write Marginalia inside book detail view, write Journal from the Notebook, toggle Journal entries to private, see what Yumi can currently see, mark a book finished and create its Book Artifact, create Knowledge Arcs explicitly, and view arcs chronologically.

This is the stage where Praxis's constitutional principles become user-facing instead of schema-only. Stage 2 made Yumi behave like the voice document; Stage 3 makes the structural commitments visible. Notebook is structurally private because the surface enforces it. Book Artifacts are one-per-user-per-book because the creation flow makes the count obvious. Knowledge Arcs are intersectional by design because they cross books and connect entries across registers. The reader has access to what Yumi sees because there is a surface that shows it.

## Constitutional grounding

The six load-bearing principles, restated against Stage 3:

1. **Yumi never summarizes books.** No Stage 3 surface should make summarization the easy default. Empty states do not say "let Yumi summarize this for you." Book detail view shows Marginalia and metadata, not auto-generated synopses.

2. **Notebook is structurally private.** Stage 3's Notebook surface enforces this at the UI level — no share affordance exists, no export-to-public flow exists, no "show my Notebook to a friend" surface exists. The privacy is not a setting; it is the absence of a surface.

3. **One Book Artifact per user per book.** Stage 3 implements the creation flow that triggers `ensureOneArtifact`. The UI surfaces this — if an Artifact exists, the surface offers to *open* it, not to *create another*.

4. **Stars de-emphasized, no follower counts as primary UI.** Stage 3 introduces no rating UI, no aggregate count surface, no social metadata.

5. **No asymmetric knowledge.** Stage 3 ships the transparency view that makes this principle real. Anything Yumi sees, the user can see.

6. **Knowledge Arcs are intersectional by design.** Stage 3's arc creation flow allows attaching books and entries across the user's whole Notebook — not scoped to a single domain, not categorized into a taxonomy, not auto-tagged. The intersectional move is structural: an arc *can* hold anything that the user wants to thread together.

## What Stage 2 surfaced that informs Stage 3

The 2.8 compliance audit revealed three things relevant to Stage 3 design:

First, Yumi's context window is *thin*. She sees `currentBook`, three recent notebook entries, `currentArc`, conversation summary, and recentTurns. Stage 3 introduces the Notebook surface where many more entries will exist, and the arc surface where multiple arcs may be active. The context-injection logic in `yumi-brain.js` does not yet need to scale, but it will need to be reconsidered in Stage 4 when arcs become conversational targets. *Flagged, not addressed in Stage 3.*

Second, Yumi pattern-matches on whatever context she's given. The 2.8 audit caught her pattern-matching the audit's question shape from recentTurns. The Revision C constraint in voice doc v1.1.0 rules this out for *conversation behavior*. Stage 3's transparency view exists in part to give the user the *receipts* on what context Yumi has — so if she ever does pattern-match in a way the user dislikes, the user can see why.

Third, the voice doc's arc-register example (*"you started with what love is, then what love does..."*) is gorgeous but speculative — written before any real arc exists. Stage 3 ships arc *creation*; arc-register *conversation* is deferred (substage 9 below) until real arcs exist and can be observed.

## Locked design decisions (the nine clusters)

The following decisions are locked. Each was decided through a structured cluster discussion on May 12, 2026; reasoning is preserved here for future readers.

1. **Notebook is a top-level surface.** Entries (Marginalia and Journal) live in a single graph keyed by entryId. Each entry may be tagged with zero or more bookIds and zero or more arcIds. Book detail views and arc views render filtered slices of the graph. *Reasoning: the constitution treats the long arc as load-bearing; per-book silos would contradict that.*

2. **Unified view, split creation paths.** The Notebook surface shows all entries together as a graph; register (Marginalia or Journal) is metadata visible on each entry. Marginalia is created from book detail view (contextual to reading); Journal is created from the Notebook (free-standing reflection). *Reasoning: the data is one body of memory; the cognitive act of writing is different in the two registers; the creation affordance should respect the difference while the view honors the unity.*

3. **Per-entry privacy toggle with register-level default.** Each entry has its own private/visible toggle. The register sets a default that new entries inherit (Marginalia visible, Journal visible-but-expected-to-be-toggled). The toggle is "expected to be used often" per the constitution. *Reasoning: granular when needed, frictionless when not.*

4. **User-initiated arc creation only.** Yumi-suggested arcs deferred to Stage 4+. Users create arcs explicitly, give them titles, attach books and entries. Yumi reads arc state but does not propose arcs. *Reasoning: Yumi-suggested arcs are too close to the meta-narrating line Revision C just ruled out; arcs are constitutionally reader-owned; trust the reader-arc relationship before adding Yumi to it.*

5. **Book Artifact created when user marks book finished.** No in-progress Artifact drafting. The Artifact is a record of *what the book did to you* — past tense, ceremonial, post-completion. Marginalia covers writing during reading; Artifact covers writing after. *Reasoning: principle #3 frames the Artifact as a record, not a notes file; mixing in-progress Artifact with Marginalia dilutes both.*

6. **On-demand transparency.** A button accessible from the Notebook header opens a snapshot view of what Yumi currently sees: currentBook, recentEntries, currentArc, conversation summary, recentTurns. Not always-on; not buried; one click away. *Reasoning: transparency as a right the user can exercise, not as a constant performance; matches principle #5 without making the surface anxiety-inducing.*

7. **Arcs render chronologically by entry-added-to-arc date.** Time order is the floor; curated narrative views are a possible Stage 4 ceiling. *Reasoning: the voice doc's arc-register language is chronological (first → then → now); the network-graph alternative is the wrong abstraction (the Notebook is the graph; the arc is a path through it).*

8. **Instructional empty states, literary register, not Yumi-voiced.** Each empty surface explains what it is for in a brief sentence written in the app's voice, not Yumi's. *Reasoning: Yumi is a companion in the chat panel, not the narrator of the app; making every empty UI speak as Yumi muddies what she is.*

9. **Arc-register Yumi conversation deferred.** Yumi can read arc state (already wired in 2.6); she does not yet have the arc-register conversational behavior the voice doc describes. Becomes a Stage 4 or Stage 3.10 feature once real arcs exist. *Reasoning: arc-register conversation is currently written toward imagined arc-shapes; ship arcs first, observe them, design Yumi's arc-talk against real data.*

## Substage scope (working draft)

Nine substages, derived from the existing tentativeSubstages list in the roadmap, refined against the nine locked decisions.

### 3.1 — Notebook surface scaffold + entry schema cleanup

Purpose: stand up the top-level Notebook route as an empty surface; clean up the entry schema to match decision #1.

Scope: new route in `views.js` for Notebook; minimal empty state (decision #8); confirm `notebookEntries` schema supports zero-or-more `bookIds` and zero-or-more `arcIds` per entry (likely already does — verify); remove or deprecate `notebookId` field if no longer needed under decision #1 (one Notebook per user, keyed by userId). Schema bump to 1.6.0 if any change to the entry shape.

Non-goals: no entry creation UI yet; no graph rendering yet; no Marginalia creation surface yet.

Open question: does the `notebookId` field get dropped, or kept as reserved-for-future-use (e.g., per-arc notebooks someday)? Default position: drop it; document the removal in the changelog.

### 3.2 — Journal entry creation

Purpose: from the Notebook surface, the user can create a Journal entry.

Scope: "+ New entry" affordance in the Notebook header creates a Journal entry; rich text or markdown editor (decide at design time — lean markdown for portability); save persists to `notebookEntries`; entry appears in the unified Notebook view; entry has the register-level default for privacy (visible-to-Yumi) which can be toggled per decision #3.

Non-goals: no Marginalia creation in this substage (it lives in 3.3); no graph view yet (3.5); no privacy toggle UI yet (3.4).

Open question: editor surface — full-screen modal, inline expansion, separate route? Lean inline expansion for the writing affordance to feel close to the Notebook surface; full-screen feels too "document editor" and breaks the surface continuity.

### 3.3 — Marginalia entry creation from book detail view

Purpose: from inside a book's detail view, the user can create Marginalia attached to that book.

Scope: book detail view (which doesn't yet exist as a meaningful surface) gets a Marginalia creation affordance; entry creation flow is contextual to the book (the entry's `bookIds` array is pre-populated); same persistence path as 3.2; entry appears in both the book's detail view *and* the unified Notebook surface.

Non-goals: no "select a passage and annotate" UI yet — that's a richer interaction for Stage 4. Stage 3 Marginalia is a short note attached to the book, not a highlight on a specific page. The voice doc describes Marginalia as "highlights and notes"; we ship "notes" in Stage 3 and defer "highlights" until we have a real reading surface (which Stage 3 doesn't yet provide).

Open question: does book detail view need substantial work in this substage, or is a minimal "this is the book; here is its Marginalia" surface enough? Default position: minimal. Book detail view is a Stage 4 hardening target.

### 3.4 — Privacy toggle UI

Purpose: each entry's privacy toggle is surfaced and operable; register-level defaults are configurable.

Scope: each entry in the Notebook view has a small visible privacy indicator (icon or color); clicking it toggles per-entry visibility; a settings surface (likely in the Notebook header) lets the user set register-level defaults for Marginalia and Journal independently; toggle state persists per entry; Yumi's context-injection logic in `yumi-brain.js` is updated to respect the per-entry visibility flag (entries marked private are excluded from `recentEntries` and `summary`).

Non-goals: no granular sharing-with-X-but-not-Y (the Notebook is structurally private; there is no sharing surface).

Risk: the privacy change in `yumi-brain.js` is load-bearing. A bug here violates principle #5 (asymmetric knowledge). This substage needs a verification step that confirms private entries do not appear in any buildContext output.

### 3.5 — Notebook graph view

Purpose: the Notebook surface renders entries as a graph — entries link to books, to arcs, to each other.

Scope: nodes are entries (Marginalia and Journal both, distinguished by visual register marker); edges are inferred from shared `bookIds`, shared `arcIds`, and explicit cross-entry links (which require a data shape for "entry → entry" links to be defined here); basic graph layout (force-directed is overkill for Stage 3 — start with a clustered-by-tag layout); pan/zoom; click a node to open the entry.

Non-goals: no graph editing in this substage (you don't drag-rewire edges); no Yumi annotations on the graph; no time-axis on the graph (that's the arc view).

Open question: explicit cross-entry links — how does a user *create* an "entry mentions entry" link? Lean: a markdown convention (`[[entryId]]` or `@entryId`) inside an entry's body that the renderer detects and converts to a graph edge. Alternative: an explicit "link to entry" button. The markdown convention is lighter-weight and lets the link emerge from writing.

Risk: graph layout can become a rabbit hole. The Builder-Intellectual flag here is strong. Decision rule: the graph should be *legible and navigable* in Stage 3; *beautiful* is a Stage 4 polish target.

### 3.6 — Transparency view

Purpose: the user can see what Yumi currently sees.

Scope: a "What does Yumi see?" affordance in the Notebook header (per decision #6); opens a snapshot panel showing currentBook, currentArc, the three recent entries currently in Yumi's context, the conversation summary if any, and the recentTurns array; styled distinctly from the rest of the app (this is a diagnostic surface, not a primary surface); read-only, no editing affordances.

Non-goals: no edit-what-Yumi-sees flow (the user controls visibility through the privacy toggle in 3.4, not through this view); no historical transparency (showing what Yumi saw an hour ago); no Yumi-side metadata (token counts, model used, etc.).

This substage is short — the data already exists in `state` and `buildContext` already assembles it. The work is presentation.

### 3.7 — Mark book finished + Book Artifact creation flow

Purpose: the user can mark a book finished, which triggers the option to create the Book Artifact.

Scope: book detail view gets a "mark finished" affordance (button, checkbox, status indicator — decide at design time); marking finished records a `finishedAt` timestamp on the userBooks entry for that book; finishing a book offers to create the Artifact via `ensureOneArtifact` (per decision #5 and principle #3); the Artifact creation flow is a single-entry surface (title pre-filled with the book title, body editable, save); once an Artifact exists, the book detail view shows "open Artifact" instead of "mark finished → create Artifact"; the Artifact appears in the Notebook view as a distinct entry type (or as a special kind of entry — schema decision below).

Non-goals: no auto-prompt to finish books (Yumi-suggestion deferred per decision #4 spirit); no Artifact templates; no Yumi-assisted Artifact drafting.

Open question: is a Book Artifact a special kind of `notebookEntry` (with a flag), or does it live in `bookArtifacts` as the schema currently has it? The schema has `bookArtifacts` keyed by `artifactKey(userId, bookId)`, separate from `notebookEntries`. Probably keep them separate — the one-per-user-per-book invariant lives at the schema level via `ensureOneArtifact`, and mixing them into `notebookEntries` would dilute that. But the Artifact should *appear* in the unified Notebook view as if it were an entry. The view can pull from both maps.

### 3.8 — Knowledge Arc creation

Purpose: the user can create a Knowledge Arc and attach books and entries to it.

Scope: a "New Arc" affordance on the Notebook surface; arc creation flow asks for a title (required) and an optional description; the user can then add books from their userBooks and entries from their Notebook to the arc; the arc persists to `state.arcs` with the existing schema; arcs appear in their own section of the Notebook surface (sidebar or filter); a user can edit an arc's title, description, and member books/entries after creation.

Non-goals: no Yumi-suggested arc creation (decision #4); no arc-register Yumi conversation (decision #9); no arc deletion confirmation flow in this substage (just a button that asks "are you sure?"); no arc sharing (Notebook is structurally private; arcs are part of the Notebook).

Open question: can a book or entry belong to multiple arcs? Yes, per the schema (`bookIds` and `entryIds` are arrays on the arc; nothing prevents membership in multiple arcs). The arc creation UI should make this clear — adding a book that's already in another arc should not produce a warning, it should just add.

### 3.9 — Arc view UI (chronological)

Purpose: opening an arc shows its books and entries in chronological order by entry-added-to-arc date (per decision #7).

Scope: an arc view route that takes an arcId; renders the arc's title, description, and members in time order; each member is a card (book or entry); the time axis is implicit (vertical scroll, oldest at top); clicking a card opens the book or entry; the user can reorder member-added-date for editing purposes but not the underlying time-axis (that's curated-narrative view, deferred).

Non-goals: no Yumi arc-register conversation in this view (decision #9 defers it); no network-graph rendering of the arc (the Notebook view does that for the whole graph; the arc view is the path through it); no auto-generated arc summary at the top.

This is the substage that closes Stage 3 if Yumi arc-register conversation stays deferred. If you decide mid-Stage-3 that Yumi *should* talk in arc register, that becomes 3.10 — a separate substage with its own scope discussion and compliance pass.

## Dependencies and sequencing

3.1 must come first — it's the schema and surface scaffold the rest sits on.

3.2 and 3.3 can be parallel; both depend on 3.1; 3.3 also requires a minimal book detail view to exist (currently it doesn't, as a real surface).

3.4 depends on 3.2 (Journal entries must exist to be toggled). The `yumi-brain.js` change in 3.4 has cross-cutting risk — it's the first time Stage 3 touches Yumi behavior.

3.5 depends on 3.2 and 3.3 (entries must exist to graph).

3.6 depends on 3.4 (the transparency view should show *post-privacy-filter* state, so the privacy logic must already work). Could in principle ship before 3.5; depends on which the user-facing answer is more useful first.

3.7 depends on 3.3 (book detail view must exist) and 3.1 (the Artifact appearing in the Notebook view requires the Notebook surface).

3.8 depends on 3.1 (Notebook surface) and 3.2/3.3 (entries must exist to attach to arcs).

3.9 depends on 3.8.

Reasonable shipping order: 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6 → 3.7 → 3.8 → 3.9. This is the order the roadmap entries get drafted in.

## Risks

**Builder-Intellectual sprawl in 3.5 (graph view).** Graph rendering is a research project at scale. The discipline is *legible and navigable*, not *beautiful*. If the substage starts feeling like a graph-visualization library evaluation, stop and revert to the simpler layout.

**Privacy bug in 3.4.** A bug in `yumi-brain.js` that lets private entries reach Yumi's context is a constitutional violation, not a UI bug. This substage needs a verification step that explicitly tests the filter: create a private entry, send a Yumi message, inspect the transparency view, confirm the entry is absent.

**Empty states underestimated.** Stage 3 is the first stage where a new user opens a real surface. The instructional empty states (decision #8) need actual care, not afterthought. The risk is shipping surfaces that work for Preston-the-developer but confuse Preston-the-tester or any actual user.

**Arc-register conversation pressure.** Once arcs exist as objects, the temptation to wire up Yumi's arc-register conversation immediately will be strong (the voice doc has been describing it for months). Hold the line on decision #9. Arc-register conversation is a Stage 4 deliverable that earns its language from real arcs.

**Marginalia scope creep.** The voice doc describes Marginalia as "highlights and notes." Stage 3 ships notes; highlights require a real reading surface. The risk is that 3.3 expands into "let's also build a highlighting UI" and Stage 3 doubles in scope. Hold to notes-only for Stage 3.

## Open questions deferred to substage design time

- Editor surface for entry creation (markdown vs. rich text vs. plain). Lean markdown.
- Graph layout algorithm in 3.5. Lean clustered-by-tag for Stage 3.
- Explicit cross-entry link syntax in 3.5. Lean markdown convention `[[entryId]]` or similar.
- Book Artifact's relationship to the Notebook view in 3.7 (schema-separate, view-unified). Lean: keep schemas separate, unify in the view.
- Arc creation flow surface (modal vs. inline expansion vs. separate route). Lean modal for Stage 3 simplicity.

## Stage 3 acceptance

Stage 3 closes when:

- All nine substages are Shipped (manual checkbox per substage).
- The privacy filter in 3.4 is Proven (audit checkbox confirms a manual test where a private entry is verified absent from `buildContext` output).
- A user (Preston, in the first instance) can complete an end-to-end flow: add a book → create Marginalia inside it → create a Journal entry from the Notebook → toggle one Journal entry to private → open the transparency view and confirm the private entry is absent → mark a book finished and create its Artifact → create an arc → attach the book and three entries → view the arc chronologically.

A Stage 3 compliance audit document (`/docs/praxis-3-compliance.md`) records this end-to-end flow with screenshots or console output as evidence. Stage 3 ships only when the audit document exists and the end-to-end flow passes.

## Document discipline

This scope doc is the source of truth for Stage 3 thinking. When Stage 3 substages are about to be worked, their detail gets *promoted* into the roadmap as full substage data blocks (mirroring the Stage 2.x pattern). The roadmap mirrors this doc; this doc leads.

When Stage 3 thinking changes mid-build, update this doc *first* (with an "Updated:" line above the changed section), then propagate to the roadmap. Drift between this doc and the roadmap is a signal to reconcile.

Marked "as of May 12, 2026" at the top because that's the truth of when this thinking was set down. Future updates carry their own dates.

---

*End of Stage 3 scope. The roadmap entries derived from this document are drafted separately in the next pass.*
