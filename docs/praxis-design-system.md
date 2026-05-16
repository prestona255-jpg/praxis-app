# Praxis Design System

Locked 2026-05-15. This document records the visual design language
of Praxis and the reasoning behind it. The palette values also live
in assets/theme.css; this doc is the source of intent. If a value
here and in theme.css ever disagree, that is a bug to reconcile.

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
- Two items only: Books, Notebook. Praxis wordmark at left.
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

## Change log
- 2026-05-15: Design system locked. Palette, typography, nav, shelf
  spec recorded.
