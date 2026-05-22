# Knowledge Arcs — Visual System Spec

A design language for rendering Knowledge Arcs in Praxis. Written to be portable to another Claude session that will help implement this in the app.

This is not a final visual design — it's a vocabulary and a set of principles that any specific arc visualization should respect. The Praxis decision to defer arc workspace visual design (see living document §10) stands. This spec gives the next implementer something coherent to build *with*.

---

## 1. What a Knowledge Arc actually is

Before describing how to draw one, the visual system has to know what it's drawing. Anchors from the May 2 decisions:

- An arc is the **central organizing structure of reading practice in Praxis**, not a feature or a tag system. It is a navigable workspace.
- Arcs are **intersectional by design**: books from different traditions, disciplines, and registers must be able to live in the same arc and speak to each other.
- An arc is anchored by a **question** the reader is pursuing, but the question can be articulated loosely, can evolve, and may emerge from the books rather than precede them.
- The **Notebook** is a graph, not a list. It has two registers: Marginalia (book-anchored highlights and notes) and Journal (free-form reflective writing). Both can link to each other, to arcs, and to books.
- **Yumi** appears in the arc as someone who notices connections, never as a summarizer or grader. Her presence in the visual should feel peripheral and observational, never central or directive.
- **Stars and follower counts are de-emphasized.** Engagement and depth can be shown, but never as scores or leaderboards.

The visual must encode all of this. If a visualization makes the arc feel like a checklist, a tag cloud, or a quantified-self dashboard, it has failed the brief regardless of how clean the layout is.

---

## 2. Core visual principles

### 2.1 Register before sequence

Shapes encode the **register** of a book (theory, memoir, novel, history, poetry, etc.) before they encode anything else. This is the intersectionality principle made visual: at a glance, you can see that an arc holds work from multiple traditions, and no single tradition gets a privileged position or shape.

Recommended shape vocabulary (stable across the system):

- **Square** — Theory / critical work (Freire, hooks's theoretical work, Giroux, De Lissovoy)
- **Circle** — Memoir / first-person nonfiction
- **Oval** — Novel / fiction
- **Diamond** — History / archival nonfiction
- **Triangle** — Poetry

These are starting points. The principle is what matters: distinct, simple, immediately legible shapes — not register icons or genre badges. The user should be able to read the shape system in three seconds without a legend, *after* the legend has been seen once.

If new registers are added (essay collections, plays, sacred texts, scientific writing), give them their own primitive shape rather than overloading an existing one. Never two registers in the same shape.

### 2.2 Color encodes engagement, not identity

A book's **fill color** comes from a color ramp tied to its register (e.g., theory always uses the purple ramp, memoir always uses the coral ramp). But the **saturation** within that ramp encodes **how much the reader has engaged with the book** — lightest fill for "in the arc but barely opened," mid for "actively reading," darkest for "deeply worked through."

This is critical: never use color to encode quality, rating, or recommendation strength. The system has no opinion about which books are better. It only shows where the reader has been.

For a stable palette, the visual system uses:

- **Theory** — purple ramp
- **Memoir** — coral ramp
- **Novel** — pink ramp
- **History** — amber ramp
- **Poetry** — teal ramp (the green-teal family, distinct from the notebook green)

These map to design-system color ramps; the implementer should use whatever ramp system is in the app, but assign one ramp per register and never share ramps across registers.

### 2.3 Threads carry meaning, never ornament

Lines between books represent **resonance** — that the books speak to each other in the reader's own work, usually because the reader's notes or Yumi's noticings have linked them. Thread properties carry weight:

- **Thickness** = strength of the connection (number of linked notes, frequency of cross-reference)
- **Opacity** = recency or activity (faded if the link hasn't been touched in a while)
- **Dashed vs. solid** = certainty (dashed for faint or speculative connections, solid for actively worked ones)

Threads must never be drawn purely to indicate that two books share a register or sit in the same arc — that's already implied by their co-presence. Threads only appear when *real linking work* has happened in the Notebook or by Yumi's notice.

Thread color is one consistent, quiet accent (the system uses a teal-green) so that the threads read as a single category of meaning regardless of which books they're between.

### 2.4 The Notebook appears as marks, not text

Notebook entries appear in the arc visualization as small marks, never as text blocks or popovers in the default view. Two scales:

- **Small dots** — Marginalia (book-anchored highlights and notes). Cluster around the book they're attached to. Quiet, consistent color (the system uses the same teal-green as threads, slightly more saturated when "alive"). Density is meaningful: many dots around a book = lots of marginalia.
- **Larger circles** — Journal entries. Float in the open space between books because they aren't anchored to a single book. Thin leader lines connect a journal entry to the books or arcs it links to.

The Notebook color (teal-green) is consistent and distinct from any register color. The reader learns: green marks = my work; shaped glyphs = books; threads = relations.

Tapping a mark opens the actual entry. The mark itself stays compact.

### 2.5 Yumi is peripheral, never central

Yumi appears in the visual as a small dashed circle, usually toward the edge of the field. Never at the center, never at the top, never as a chrome element that follows the user around. The dashed border is the signal that she is *present* but not *embodied* in the work — she's noticing, not authoring.

A faint dashed line can run from Yumi to the books or threads she has *recently noticed* something about, so the reader can see where Yumi's attention is currently turned. The lines fade quickly.

Yumi should never be drawn larger than the largest book glyph. Yumi never gets her own color category — she shares the question's purple. She is part of the inquiry's atmosphere, not a participant on equal footing with the reader.

### 2.6 The question is the gravity, not the gate

If the arc has an articulated question, render it as the gravitational center of the field — either as faint text at the visual center, or as a soft radial glow that pulls books toward it, or as a small anchored label that other elements visually orient around.

What the question is *not*:

- Not a header bar across the top.
- Not a prompt the reader has to answer before proceeding.
- Not styled like a UI title.

The question is allowed to be quiet, italicized, displayed in serif (the system uses a Cormorant Garamond-style serif for editorial moments). If the reader hasn't articulated a question yet, render the center as empty space — never insert placeholder text like "What is this arc about?". The empty center is a real signal.

### 2.7 No grids unless they earn it

Avoid grid layouts (rows of cards, table-style arc views) as the *primary* visualization. Grids signal "database" and "inventory" — exactly the wrong feeling for an arc. If a grid view is needed for triage or bulk operations, mark it as a utility view, not the canonical arc surface.

Acceptable structured layouts: the **loom** (warp = books, weft = concepts, crossings = work) is allowed because the warp/weft metaphor is itself meaningful — it makes intersectionality literal. The grid earns its place by encoding something the field metaphor can't. Use the loom for *analytic* views ("show me which concepts I've worked across most books"), not as the home view.

### 2.8 Concept-currents (optional, powerful)

For arcs that have moved past loose collecting into active conceptual work, the visual can show **concept-currents** flowing underneath the books: faint horizontal lines representing themes or questions the arc is pursuing (e.g., Power, Embodiment, Memory, Refusal, Care). Where a book sits over a current, a crossing dot appears — same vocabulary as the loom's crossings.

Concept-currents are user-defined and emerge from the Notebook (a concept becomes a current when the reader or Yumi has tagged it across multiple books). Currents should never be auto-imposed by the system — they appear when the reader has done enough work to warrant them.

Visually: a current is a thin, gently waved horizontal line in a subtle purple tone (the question's color family), well below the visual density of the books. Crossings on currents follow the same green-dot vocabulary as Marginalia.

---

## 3. The three working metaphors

When deciding *which kind* of arc visual to render in a given context, three metaphors are available. Each has a job:

### 3.1 The Field (default home view)

A curved arc shape descends from the question. Books hang along the arc, clustered loosely by register but not walled off. Threads cross between books that speak to each other. Notebook marks cluster around books. Yumi observes from the edge.

**When to use**: as the **default arc home view**. When the reader opens an arc, this is what they see. It feels like a place, not a list. The curve is poetic but earns its keep by visually anchoring the inquiry.

**Failure mode**: if the arc has many books (15+), the field gets crowded. Either let the field crowd honestly (density is information) or offer the loom view for analytic clarity.

### 3.2 The Constellation (exploratory view)

Books scatter across an open field with no imposed structure. The question is the gravity at the center, often invisible. Threads of varying weight connect books that resonate. Some books cluster naturally because their connections pull them together; others float at the edges because they're only loosely tied in.

**When to use**: when the reader wants to *see what shape their inquiry is taking* without imposing a structure on it. Good for moments of reflection ("what am I actually doing in this arc?"). Good for showing emergent patterns the reader hasn't named yet.

**Failure mode**: it's beautiful but hard to operate on. Don't use it as the default. Treat it as a "see this from another angle" view.

### 3.3 The Loom (analytic view)

Books are warp threads running vertically. Concepts are weft threads running horizontally. Crossings appear where the reader has engaged a particular book through a particular concept.

**When to use**: when the reader wants to ask analytic questions of their own arc — *which concepts have I worked across many books? which books have I engaged through many concepts? where are the gaps?* The loom makes intersectionality literal: the cloth only exists at the crossings.

**Failure mode**: it can read as a productivity grid if the visual treatment slips. Stay editorial: serif headers, generous whitespace, no progress bars, no completion percentages, no "x/y" counters.

### 3.4 The Hybrid (field + currents)

A field-shaped arc with concept-currents flowing underneath the books. Books sit on top of the currents; crossings appear where books and currents meet.

**When to use**: when the arc has matured enough to have named concepts (currents) but the reader still wants the field's *feel*. This is the bridge view between the field and the loom.

**Failure mode**: too much going on at once. If the concept-currents are too prominent, the field loses its quietness. Keep the currents subtle.

---

## 4. The legend and the key system

All visualizations carry a small legend explaining the vocabulary, but the legend is editorial, not chrome. Specifically:

- Place at the bottom of the visualization, not the top.
- Use the same typography as the rest of the system (small, secondary color, sentence case).
- The legend never has its own card or border — it sits in the visual's whitespace.
- Mention only what's currently on screen. If there are no journal entries in this arc, don't show the "journal entry" key.
- Use a single phrase to summarize the visual's premise, e.g., *"No fixed shape — the arc is whatever pattern these books make together."* This phrase is the visual's voice; it should be written, not generic.

The legend is also where the system can teach the reader the vocabulary on first encounter. After they've used arcs a few times, the legend can collapse to a small "?" affordance.

---

## 5. Tone and feel — what to avoid

Things that signal the wrong feeling and must not appear in arc visualizations:

- **Progress bars, percentages, completion counters.** Never "you've completed 4/8 books in this arc." Arcs don't complete.
- **Streaks, badges, achievements.** Engagement is its own reward.
- **Stars, ratings, hearts.** Per principle 4 — stars are de-emphasized everywhere in Praxis.
- **Trending, popular, recommended** indicators. Arcs are personal. Never show "books other people added to this arc."
- **Generic tags or pills** floating around books. Books have register (shape), concept-engagement (crossings), and notes (marks). They don't need decorative tags.
- **Tooltips with marketing voice.** Hover states reveal information, not delight phrases.
- **AI-shimmer language.** Yumi never says "Let me help you discover…" or "Here's what I found…". Yumi notices and reflects; the visual reflects that.

Things that are okay even if they feel "less productive":

- Empty space. An arc with three books should not be padded with placeholder content.
- An arc with no question articulated. Render the center as empty.
- An arc the reader hasn't touched in months. Show the books faded but present — not "abandoned" or "stalled."

---

## 6. Interactivity

Each visual element should be tappable. The interactions are:

- **Tap a book glyph** → open the Book Artifact (the single canonical view of that book for that reader).
- **Tap a thread** → open a small panel showing the linked notes or Yumi conversations that created this connection.
- **Tap a notebook mark** → open that specific Marginalia or Journal entry.
- **Tap the question** → open the question-editing surface where the reader can revise or annotate the arc's framing.
- **Tap Yumi** → open Yumi's current view of this arc (what she's been noticing, what she might surface if asked). Never auto-opened.
- **Tap a concept-current** → open the current's anchor view: which books touch it, which notes contributed to its emergence.

No hover-to-reveal critical information. Mobile-first.

---

## 7. Implementation notes for Praxis

Praxis is vanilla JavaScript by convention — `var` and `function` only, no `const/let/arrow/class/template literals`, string concatenation, callback-style `.then` chains. The arc visualizations should be rendered as **SVG strings built by string concatenation**, not via a templating engine or framework. Each visualization is a function that takes an arc data object and returns an SVG string.

Color values: use CSS variables defined in the Praxis design system (the same `--ink`, `--gold`, `--br-deep` family, plus added `--register-theory`, `--register-memoir`, etc.). Never hard-code hex values inside SVG output. The visualizations must respond correctly to light and dark mode.

The arc data model needs to support:

- A list of `userBook` records, each with: `id`, `register` (string, one of the named registers), `engagementDepth` (0-3 integer or float), `addedAt` (timestamp).
- A list of `thread` records, each with: `bookAId`, `bookBId`, `strength` (number), `lastTouchedAt`, `linkedEntryIds` (array).
- A list of `concept` records (for currents): `name`, `linkedEntryIds`, `linkedBookIds`.
- A list of `notebookEntry` records: `id`, `type` ('marginalia' or 'journal'), `bookId` (nullable for journal), `linkedEntryIds`, `linkedBookIds`, `linkedConceptIds`.
- An optional `question` field for the arc itself.

Threads and concepts are **derived**, not authored directly — they emerge from notebook entries' link structure. The visualization renderer should compute them at render time from the notebook graph, not store them separately.

---

## 8. A note for the next implementer

This system was developed through iterative visual sketches with another Claude. The starting question was "what does a Knowledge Arc look like" and the working principle was: a Knowledge Arc is not a flowchart, not a tag system, and not a syllabus. It is a *field of inquiry* where books from different traditions speak to each other across an evolving question.

The visual vocabulary above is the residue of that exploration. The principles matter more than the specific shapes — if a different shape system serves the same goals better, use it. What can't change without violating the project:

- Books retain a single, immediately legible visual identifier per register.
- The intersectionality principle is visible (multiple registers coexist in any arc, no register is privileged).
- Notebook work is visible as marks, never as scores.
- Yumi is peripheral.
- The question is the gravity, not the gate.
- Engagement is shown, never measured.

If a design decision is unclear, default to the choice that respects the reader's autonomy and avoids quantification. Praxis is a tool for thought, not a dashboard.
