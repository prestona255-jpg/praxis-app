# Praxis Design System

Locked 2026-05-15. Extended to v2 2026-05-19. This document records
the visual design language of Praxis and the reasoning behind it. The
palette values also live in assets/theme.css; this doc is the source
of intent. If a value here and in theme.css ever disagree, that is a
bug to reconcile.

## Palette — "Wheat field, cherry oak, Oshun"

The palette is grounded in three images: a golden field of wheat at
golden hour with wind moving through it; cherry oak as used in
Japanese timber homes, where people make a life; and the Yoruba
Orisha Oshun — generative tension, community, creation, foundation.
The guiding principles: gold is primary, not decorative accent;
warmth runs through every value, including the darks; water (Oshun's
element) is present as a single reserved accent, not as a base.

### Surfaces
- --surface     #ebe0c4   Wheat at golden hour. The page ground.
- --surface-2   #f6ecd2   Lighter wheat. Card surface — cards sit
                          lighter than the page so they lift.
- --color-surface          Alias of --surface (spec-naming convenience).

### Ink ramp — cherry oak
A single warm wood ramp, dark to faded. Reads as wood, not as
grey-with-warmth. Tuned as a set; --ink is the anchor.
- --ink     #2a1810   Dark cherry. Primary text.
- --ink-2   #5c3e26   Cherry. Author text, secondary text.
- --ink-3   #8a6b48   Weathered cherry. Meta, labels.
- --ink-4   #b8997a   Faded cherry. Quietest text, borders.

### Gold — Oshun, primary
- --gold        #d4972a   Honey lit from behind. Primary accent:
                          nav underline, primary buttons.
- --gold-light  #f0c46a   Wheat under low sun. Pill backgrounds.
- --gold-text   #6b4516   Deep gold. Text on --gold-light fills.

### Grounding
- --br-deep   #4a2810   Deep cherry. Primary-button hover; grounds
                        the gold.

### Water — one drop
- --river   #2a4a5c   A single note of water. Reserved for links,
                      focus rings, and the selected-filter signal.
                      Never body text. Never a background. Present
                      only where it does work.

## Typography
- Display (page titles, book titles): Cormorant Garamond, 500-600
- Body (author, prose, nav): DM Sans, 400-500
- Meta / mono (counts, timestamps, status pills): DM Mono, 400
Loaded via Google Fonts in index.html.

## Top navigation
- Three items: Books, Notebook, Arcs. Praxis wordmark at left.
  (v1 had two — Arcs added at v2; see v2 section C1 for the
  reasoning. The "no nav item that goes nowhere" principle still
  holds: Arcs earns the slot because the Arcs page exists.)
- Yumi is intentionally NOT a nav item — it stays a floating panel.
- Settings is intentionally NOT a nav item — deferred until a
  Settings route exists. Principle: no nav item that goes nowhere.
- Active route marked by a --gold underline, toggled in renderRoute().

## Shelf surface
- Page header: Cormorant title "Your shelf", DM Mono book-count
  subtitle. Add book (primary) + Bulk add (secondary) at top-right.
- Two-column layout: filter sidebar (220px) + book grid.
- Filter sidebar: two sections — Filter by theme (the 15 themes from
  docs/themes.md) and Filter by author (from state.books). The
  taxonomy is editorial, not bookstore-genre — see docs/themes.md.
- Grid: 4 cards per row at desktop, responsive 4 -> 3 -> 2 -> 1.
- Book card: preserved-aspect-ratio cover on a uniform-height area,
  Cormorant title, DM Sans author, DM Mono status pill.
- Status pill variants: reading = --gold-light fill + --gold-text;
  finished = --ink-4 tint + --ink-2; want = transparent + --ink-4
  outline + --ink-3 text.
- Empty state: centered Cormorant headline + DM Sans subtitle +
  Add book button. Copy: "Your shelf is empty." / "Add a book to
  begin."

## Dark mode
Acknowledged as a future stage. Not designed yet. When built, the
cherry ramp inverts toward deep walnut and the wheat ground toward
near-black umber — a parallel palette, not a recolor.

## 3.10 stage boundaries
- 3.10a: shelf + top nav styling. Typography, layout, color,
  default + hover states. Filter sidebar renders as MARKUP ONLY.
- 3.10b: filter behavior (clicking a theme/author actually filters),
  focus/active/disabled states, transparency view.
- 3.10c: remaining surfaces — Notebook, book detail, editor modal,
  Artifact view, settings panel.

---

# v2 — The Material Layer, the Wheat Field, the Arcs Surfaces

Extended 2026-05-19. v1 specified palette and type. It did not
specify *material, light, depth, motion, sound*, or the Arcs
surfaces. v2 records that layer. All decisions below are locked.

## The governing rule

**Praxis is the room; the books are why you came.**

Every material, light, motion, and sound decision is checked against
this. Does it make the book more present, or the interface more
present? Anything that makes a person notice the background instead
of the book has failed. Calm and beauty come from restraint and
warmth — never from adding more.

## A — The material layer

### A1 — Light & golden hour
- **A1.1 — Direction.** Low-angle warm light, raking from one upper
  corner, the way golden hour actually crosses a field. Not top-down,
  not flat.
- **A1.2 — Page glow.** The page ground (--surface) carries a faint
  radial glow — a barely-perceptible brighter zone, sun on a field.
  Not a flat fill.
- **A1.3 — Cards and light.** Cards both catch a highlight on the
  edge facing the light AND cast a shadow on the opposite side.
- **Direction consistency rule (load-bearing).** A1.1, A1.2, A1.3,
  and the wheat field (B5) must all agree on ONE light direction.
  Highlights sit on the edges facing the light source; shadows fall
  to the opposite side; the page glow and field brightness peak at
  the light's corner. Light coming from inconsistent directions is a
  bug.

### A2 — Material & grain
- **A2.1 — Page texture.** Faint wood grain — long, soft, directional,
  the cherry-oak timber-home reference made literal but quiet.
  Strength 2 on a 0–10 scale (felt, not noticed). Grain runs WITH the
  A1.1 light direction, not against it.
- **A2.2 — Card edges.** A hairline edge — a crisp 1px line in --ink-4
  (faded cherry). The timber-joinery reference: parts meet precisely.
  The hairline also gives cards definition against the wheat ground so
  they do not go muddy.
- **A2.3 — Corner radius.** Soft — 10px — applied consistently to
  every surface (cards, pills, pickers, panels, the Yumi panel). One
  value, no exceptions. Inconsistent radii read as unfinished.
- **Surface-set rule (load-bearing).** The hairline (A2.2), the
  highlight, and the shadow (A1.3) are a SET. Every elevated surface
  gets all three or none. Half-applied depth reads as broken.

### A3 — Depth & elevation
- **A3.1 — Shadow color.** Shadows are a deep warm brown (--br-deep
  family, ~#4a2810) at ~10% opacity. NEVER grey-black. A cool shadow
  on a warm ground is the fastest way a warm palette looks cheap.
  This is a correctness rule, not a preference.
- **A3.2 — Tiers.** Three elevation tiers:
  - Tier 0 — the page itself (the wheat ground). No shadow.
  - Tier 1 — cards and the filter sidebar. Hairline + soft shadow.
  - Tier 2 — floating things: the Yumi panel, modals, pickers,
    confirm panels. Deeper shadow.
- **A3.3 — Yumi's depth.** The Yumi panel sits at Tier 2 but at the
  GENTLE end of Tier 2's shadow range — present and clearly afloat,
  never looming. This matches Yumi's voice (the reader sitting next
  to you, not the room). The depth decision and yumi-voice.md agree.

### A4 — Motion
- **A4.1 — Easing.** Slow ease-out. Things arrive and settle. No
  spring, no bounce, no overshoot. Never linear.
- **A4.2 — Duration.** 350ms base. Unhurried without being sluggish.
- **A4.3 — What moves.** Only these:
  - Route changes — soft cross-fade.
  - Cards on hover — a small lift (~3px) with the shadow deepening
    slightly (the card leaning toward the light).
  - The gold nav underline — slides between nav items.
  - Pickers and panels — fade and rise into place.
  Nothing else animates. No decorative motion, no idle animation,
  nothing that grabs attention.
- **A4.4 — The wheat does not move by default.** See B4 — the field
  is still unless ambient sound is on. Visible motion behind the
  books pulls the eye off them; that is the governing rule failing.

### A5 — Sound
Sound is load-bearing in v2: it is the trigger for the immersive mode
(see B4). It ships in Stage 4.5, not earlier.
- **A5.1 — Exists.** Yes — as an opt-in immersive mode, shipped in
  Stage 4.5.
- **A5.2 — What sounds.** Two layers, both very low: wheat rustle
  (wind through the field) and water (Oshun's river). No interaction
  sounds — no page-turn, no clicks. Interaction sound gets noticed
  and annoys quickly.
- **A5.3 — Control.** OFF by default. Turned on only by explicit user
  choice. An always-visible mute whenever sound is on. This is the
  no-manipulation principle applied to audio — non-negotiable.

## B — The wheat field

The atmospheric backdrop. The most-wanted element and the most
dangerous to the books — every decision below is deliberately tuned
to keep the field a whisper.

- **B1 — What it is.** An SVG illustration — stylized, hand-controlled,
  faded. Not a CSS gradient (too abstract to be a field), not a photo
  (photos fight covers hardest and date fastest). The SVG belongs to
  the same drawn, crafted world as the rest of the app.
- **B2 — Where it lives.** Behind the shelf only. The wheat is the
  library's ground — the harvest, the room you came to. The Notebook
  stays a clean writing surface; a field behind your own words would
  be busy.
- **B3 — Presence level.** 2, possibly 3, on a 0–10 scale where 10 is
  a literal photo. Felt, not noticed. Tunable live on the deploy.
  Start low and nudge up — starting high and never pulling back is
  the trap.
- **B4 — Motion / the immersive mode.** The field is STILL by default.
  When the user turns ambient sound ON (A5), the field gains gentle
  motion synced to the rustle. Motion is a property of the sound
  being on, not of the app. Sound off: a quiet lit room. Sound on:
  the room with the window open. Ships in two parts — still field in
  Stage 4.2, synced motion with sound in Stage 4.5.
- **B5 — Light.** The field is lit by the A1.1 low-angle light —
  brighter toward the light's corner, fading as it crosses. This is
  what makes the field and the page read as one lit space rather
  than a UI sitting on a background.

## C — The Arcs page

A dedicated, navigable surface for Knowledge Arcs. Today arcs live
inside the Notebook (arc-list block + arc detail). The Arcs page is
the teaching surface. Source material already exists — do not
re-invent: living-document Section 7 (arc creation flow, inter-book
reflection, arc completion), Section 10 (arcs as the central
organizing structure), and the two locked example arcs.

- **C1 — Top-nav item.** Yes. Arcs becomes the third top-nav item
  (Books, Notebook, Arcs). It is the flagship feature; burying it in
  the Notebook undersells it. This upgrades the v1 "no nav item that
  goes nowhere" rule rather than breaking it — the Arcs page exists,
  so it earns the slot.
- **C2 — Teaching panel.** The page opens with a short "what is an
  arc" panel in Yumi's voice — one paragraph. Core line:
  *"An arc is a path you build through your reading — books from any
  tradition, set side by side, so they speak to each other."*
- **C3 — Worked examples.** Both example arcs appear,  split by treatment. *A Pedagogy of Desire* (Giroux *Zombie
  Politics*, hooks *Yearning*, Grant *Hidden Potential*, Epstein
  *Range*, Hurston *Their Eyes Were Watching God* — through-line:
  desire as a pedagogical force) is seeded as a fully live, openable
  arc — a user can click in and see the real member books and the
  arc web. *A Pedagogy of Flow* (sound studies, relationships,
  psychoanalysis, systems, environment — through-line:
  intersectionality as connective tissue) appears as an illustrated
  card. One live, one illustrated: shows the range of what an arc can
  be without seeding two. The live example teaches by being real —
  the examples ARE the instructions.
- **C4 — How to make one.** A single guided call-to-action button
  that opens the arc editor, with three short steps shown beside it.
  Drawn from living-document Section 7.2 — this is presentation of
  an already-written flow, not new content.
- **C5 — Reading list to purchase.** Inside an arc, member books can
  link out to be bought. Commercial model: Bookshop affiliate links —
  the values-aligned baseline already decided in prior work.
  Placement: on both the Arcs page and the book detail page. Tone:
  framed as "Find this book" — honest availability, never "BUY NOW".
  One restrained line, no store styling. This is the single place
  commerce touches a pedagogy app; it must not feel like a store.

## D — The arc web

The one genuinely new design in v2. Everything in A, B, and C is
either material polish or already-specced content. The arc web is
not designed anywhere else.

The notebook architecture is already "a graph, not a list." Arc
detail currently renders a flat chronological stream. The arc web
is the richer lens on that same data.

- **D1 — Nodes (the hinge decision).** Nodes are the existing arc
  objects only — member books and member entries. The arc web does
  NOT introduce a new "concept" node type. Reasoning: concept-nodes
  (named ideas the user places and links) are a new data model — a
  Phase-scale build — and Stage 4 should visualize what exists
  beautifully, not invent a new system mid-design-pass. A
  concept-node / user-drawn-web system is a legitimate later phase
  if first users want it. It is named here only to be explicitly
  deferred.
- **D2 — Edges.** Implicit — connections are laid out automatically
  by the arc's chronology and shared books. User-drawn edges (where
  the connection itself carries a note) are powerful but belong with
  the deferred concept-node phase; pairing them keeps the big build
  in one place.
- **D3 — Layout.** Chronological spine — the arc reads first → then →
  now along a spine, with entries branching off it. Most legible,
  and it honors the oldest-first ordering that Stage 3.9 already
  ships.
- **D4 — Static or interactive.** A rendered artifact — beautiful,
  fixed, you look at it. The interactive "arc as workspace" (drag
  nodes, draw edges) is the deferred concept-node phase. For Stage 4
  the web is the arc SEEN, not edited.
- **D5 — Relationship to the list view.** The web is an ADDITIONAL
  view — a toggle between "list" and "web" on the same arc. The
  legible chronological list (3.9) stays; the web is added as the
  richer lens.
- **D6 — Aesthetic of the web.** Nodes are small book covers and
  cherry-ink entry cards arranged along the spine. Edges are thin
  hairlines in --ink-4. The single --river drop marks the
  currently-focused node. The web sits on the wheat field. It must
  read as drawn and crafted — part of the same world as the rest of
  the app — not like a generic mind-map tool.

## Build sequencing (consequence of A–D)

- **Stage 4.1 — material pass.** A1–A4 applied to existing surfaces
  (shelf, notebook, book detail, pickers). No new features.
- **Stage 4.2 — the wheat field.** Part B — the still SVG field
  behind the shelf.
- **Stage 4.3 — the Arcs page.** Part C — top-nav item, teaching
  panel, worked examples, how-to, the Find-this-book affiliate
  surface.
- **Stage 4.4 — the arc web.** Part D — the rendered chronological-
  spine web as a toggle view on arc detail.
- **Stage 4.5 — ambient sound + immersive mode.** Part A5 and the
  B4 synced field motion. Opt-in. Ships last.

Held separately — Phase 2, the social layer (profiles, published
arcs, book pages, arc completion, author pages, connection
mechanics). Already specced in living-document Sections 7–9. Not new
design — but it needs a multi-user backend, so it is its own phase
with its own infrastructure pre-flight, not folded into Stage 4.

## Change log
- 2026-05-15: Design system locked. Palette, typography, nav, shelf
  spec recorded.
- 2026-05-19: v2 extension locked. Governing rule, material layer
  (light, grain, depth, motion, sound), the wheat field, the Arcs
  page, and the arc web recorded. Top nav goes from two items to
  three (Arcs added). Sequencing recorded as Stages 4.1–4.5.
