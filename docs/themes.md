# Praxis Theme Taxonomy

The shelf filter in Praxis classifies books by theme, not by
bookstore-style genre. The internal field name on state.books
remains `genre` (no schema migration); the displayed label in
the UI is "Theme."

This taxonomy was selected to honor two simultaneous constraints:
(1) be legible to a wide range of serious readers across registers,
(2) carry an authored editorial voice rather than a neutral
bookstore vocabulary.

## The 15 themes

Grouped by register for design reference. The groupings are not
exposed in the UI — the filter shows the 15 as a flat list.

### Lineage / intellectual register

1. Philosophy & wisdom
2. Critical theory & pedagogy
3. Power & systems
4. Political economy & society

### Empirical register

5. Mind & behavior

### Diachronic register

6. History & memory

### Act register

7. Liberation

### Affective / relational register

8. Love & connection
9. Grief & witness
10. Joy & wonder
11. Faith & meaning

### Place register

12. Place & belonging
13. Nature & ecology

### Narrative register

14. Story & imagination

### Practice register

15. Craft & practice

## Editorial reasoning

The list reaches for breadth without surrendering posture. A romance
reader, a critical theorist, a behavioral scientist, a poet, a
naturalist all find shelves for their books. The categories named
are not bookstore-shaped (no "fiction" as a generic catch-all; no
"self-help"; no "nonfiction"). The differentiator from a catalog
taxonomy is that every category here implies a stance — Liberation
is not the same as "politics"; Grief & witness is not the same as
"memoir"; Power & systems is not the same as "current events."

## Field naming

- Internal data field: state.books[bookId].genre (unchanged)
- Display label in UI: "Theme"
- Filter affordance label: "Filter by theme"

This split lets us evolve the taxonomy without schema migration.
If a future iteration of Praxis renames or expands the list,
existing book records continue to function — the values they
hold are just text.

## Stability

This taxonomy is locked as of 2026-05-15. Additions, removals,
or renames require a deliberate design decision, not an in-line
edit. Track changes here as a brief log:

- 2026-05-15: Initial taxonomy locked (15 themes).
