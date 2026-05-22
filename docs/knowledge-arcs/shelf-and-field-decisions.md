# Knowledge Arcs — Shelf and Field Decisions

Companion document to `knowledge-arcs-visual-system.md`. Captures decisions extending the visual system to the Books shelf (Stage 5.6) and the dark constellation field (Stage 5.4 Stage 2.0). Source-of-truth for the 9-tradition vocabulary, shape and material assignments, engagement-saturation banding, dark-field treatment, and per-book tradition override location.

Locked in design conversation, May 2026. Changes to this document require deliberate design review, not in-line edits.

## 1. The 9-tradition vocabulary

The visual system spec (`knowledge-arcs-visual-system.md` §2.1) opened the door for new traditions beyond the original five. This document expands the set to nine, mapped against the 15-theme taxonomy from `themes.md`.

**A note on naming.** This document uses the term "tradition" for what the upstream visual system spec (`knowledge-arcs-visual-system.md`) calls "register." The concept is identical — a book's tradition (theory, memoir, history, etc.) is what the visual system spec means by register. The rename exists because the code uses `register` as a load-bearing field name on notebook entries (values: `'journal'` | `'marginalia'`), and reusing it on book records would create a permanent disambiguation tax. In code: `book.tradition`. In the upstream visual system spec: "register." Same concept.

| Tradition | Themes it holds (default) | Shape | Material |
|---|---|---|---|
| Theory | Critical theory & pedagogy; Power & systems; Political economy & society | Square | Cherry oak (wood-grain) |
| Wisdom | Philosophy & wisdom; Faith & meaning | Hexagon | Gold |
| Empirical | Mind & behavior | Pentagon | Clay / terracotta |
| History | History & memory; Liberation | Diamond | Bronze |
| Memoir | Grief & witness; Love & connection; Joy & wonder | Circle | Water (Oshun palette) |
| Novel | Story & imagination | Oval | Wheat |
| Poetry | (poetry-as-form, not theme-locked) | Triangle | Indigo |
| Place | Place & belonging; Nature & ecology | Crescent | Tea |
| Practice | Craft & practice | Trapezoid | Paper-and-ink |

Materials are the load-bearing extension. Shapes carry legibility (small, instant, no legend needed after first encounter). Materials carry the cosmological and critical-pedagogy weight: Yoruba water for Oshun and witness; cherry oak and gold from Japanese material vocabulary already in `theme.css`; wheat from the field that is Praxis's page ground; indigo as the Black-diasporic textile tradition. The materials are not decoration. They name traditions.

## 2. Per-book tradition override

The theme→tradition map above is the DEFAULT, not the lock. Any individual book can have its tradition overridden by the user, expressing the reader's own sense of what the book is.

- Data model: `book.tradition` (default from theme map) and `book.traditionOverride` (optional, user-set).
- UI location: edit-book modal only. Book detail view stays a reading surface; settings live in the modal.
- Rendering: if `traditionOverride` is set, use it; otherwise compute from theme map.

## 3. Engagement-saturation

A book's glyph fill goes from light to deep based on engagement. Engagement is defined as notes count: marginalia entries + journal entries linked to that book.

Three discrete bands:
- Band 1 (lightest fill): 0 notes
- Band 2 (mid fill): 1–4 notes
- Band 3 (deepest fill): 5+ notes

Discrete, not continuous — saturation differences at 20px don't read continuously. Three is also the §2.2 wording from the visual system spec.

Engagement-saturation reflects WHERE THE READER HAS BEEN, not quality or rating. The system has no opinion about which books are better.

When the Notebook data layer is not yet live, the renderer SHALL scaffold against zero counts (all books in Band 1) without failing. When Notebook lands, real counts wire in transparently.

## 4. Shelf — Books page treatment (Stage 5.6)

Selective vocabulary inheritance — covers stay primary, tradition and engagement appear as quiet metadata.

- Tradition glyph rendered top-right corner of every cover.
- Glyph is FILLED with the engagement-saturation for that book (not just tradition color). Glyph carries both signals.
- No engagement ring around the cover (glyph alone is enough).
- No marginalia dots on the shelf (dots are arc-local; the shelf is "find a book").
- No resonance threads on the shelf (threads need a question to mean anything; the shelf has no question).

The shelf stays a library. The vocabulary is visible at a glance for readers who have learned it, invisible enough not to dominate cover art for new readers.

## 5. Dark constellation field (Stage 5.4 Stage 2.0)

The arc-web container gets a localized dark field treatment as the ground books and threads will eventually be drawn on. The wheat-field page ground stays unchanged.

- Scope: arc-web container ONLY. The wheat-field page ground stays the Praxis atmosphere everywhere else.
- Color family: deep purple-blue, matching the reference SVGs in this folder (`#7F77DD` family for accents, deeper purple for the ground).
- Edge treatment: wheat-grain bleed. The Stage 5.1 grain layers persist into the dark field at adjusted opacity. The constellation is the same surface as the wheat field, seen at night — not a different room.
- Light direction: preserves the Stage 5.1 upper-left light rake. Faint warm glow at the upper-left of the dark field; shadows fall down-right.
- New CSS tokens (added in Stage 5.4 Stage 2.0 implementation, NOT in this doc): `--field-dark`, `--field-dark-glow`, `--field-dark-grain`.

The "night sky window in a wheat-field room" metaphor is pedagogically deliberate. The arc is A PLACE INSIDE PRAXIS, not a different app.

## 6. What this document does not decide

- The fifteen 1:1 theme-to-shape mapping question (deferred). The default map above is one-to-many: a tradition can hold multiple themes.
- User customization of tradition names, shapes, or materials (deferred as a post-Stage-5.6 future track — would warrant its own top-level Stage 6 or beyond when the conversation happens). The 9 above are locked defaults; pluralization is a future conversation.
- The Field as default home view (deferred — currently the constellation is the home view; the Field view from `knowledge-arcs-visual-system.md` §3.1 is a future track).
- Concept-currents and the Loom (deferred — `knowledge-arcs-visual-system.md` §2.8 and §3.3).
- Threads as derived from Notebook entries (deferred to a later constellation stage — initial constellation stages will scaffold hand-authored thread records).

## 7. Build sequencing

The locked build order is:

1. Stage 5.6 sub-steps 1–6 — Shelf tradition vocabulary (Track B).
2. Stage 5.4 Stage 2.0 — Dark constellation field (Track C).
3. Stage 5.4 Stages 2–12 — Constellation rendering (Track A).

Stage 5.6 ships first because the shelf is the proving ground for the tradition data model and the theme→tradition map. The constellation work inherits a known-working vocabulary.

## 8. Stability

This document is locked May 2026. Changes require deliberate design conversation, not in-line edits. Track changes here as a brief log:

- 2026-05-22: Initial decisions locked (9 traditions, shape/material table, engagement banding, dark-field treatment, per-book override).
- 2026-05-22: Renamed "register" → "tradition" throughout this doc to disambiguate from notebookEntries.register field in code. Concept unchanged; visual system spec retains "register" terminology.
