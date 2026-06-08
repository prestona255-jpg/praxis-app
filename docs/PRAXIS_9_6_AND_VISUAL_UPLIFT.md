# Praxis — Stage 9.6 lock (re-scoped) + Visual System Uplift plan

> **Re-scope (June 7, 2026).** This supersedes the May draft of Stage 9.6. The
> constellation design was reworked in the 9.6 build chats and is now locked to the
> spec below. This document is the committed source of truth for the locked 9.6
> design (what CLAUDE.md points at); the build briefs are written against it.

Three parts: (1) the locked Stage 9.6 design, (2) the Visual System Uplift initiative,
(3) the deep-dive scaffold.

---

## Part 1 — Stage 9.6: the constellation workspace  (LOCKED)

**What it is.** The arc Web view becomes an interactive thinking-workspace, not a
static render. Sub-theories are luminous identity-marks the user arranges; books are a
quiet evidence layer beneath them; both connect.

### The material language (locked)
- **Ground:** vibrant golden wheat (`--tradition-ground` #FAEEDA), continuous with the
  page ground; the arc question sits at the gravitational center as an amber radial glow
  (`--arc-question-glow` #854F0B) with the question in italic serif over it.
- **Every sub-theory mark is luminous**, *lit from behind*: a backlit halo (radial stops
  55% @ 0 → 78% @ ~0.72 → 100% @ 0), a **translucent** body over the wheat (not a flat
  saturated fill), and a bright inner-light core (`--tradition-inner-light` #FFF8E7).
- **Maturity → luminosity:** the more developed a sub-theory, the brighter its mark.

### Sub-theory marks — the 16-mark generative grammar (locked)
Each sub-theory's mark is generated from three axes, chosen **deterministically from the
sub-theory's id (id-hash)** so the mark is **unique and stable** — a theory always wears
the same mark, and adding or removing neighbors never changes it:
- **Silhouette (4):** circle, hexagon, diamond, triangle.
- **Treatment (14):** concentric rings, diagonal hatch, halftone dots, dot-grid,
  broken-labyrinth rings, fading line-gradient, radiating burst, woven waves,
  cross-weave, stipple, spiral, chevron/herringbone, nested line-art, sunburst-fan.
- **Color (16):** the `--subtheory-1..16` palette below.

Treatments are drawn in a deeper-opacity tone of the body hue, clipped to the silhouette.
These are **finite parametric routines, not an open generative engine.** The grammar is
drawn from modern geometric mark vocabularies but rendered in the **Praxis skin** —
soft pastel, translucent body, wheat ground, backlit halo — *not* a crisp, saturated,
white-ground look.

### Palette — 16 `--subtheory-*` tokens (in theme.css)
Soft, wheat-harmonized hues spanning the wheel. The renderer indexes
`var(--subtheory-N)`, N = (idHash % 16) + 1:

1 rose #F2A6C2 · 2 blush #EF9FAE · 3 peach #F0A88A · 4 apricot #E8A06A ·
5 amber #E8B068 · 6 gold #ECCB6A · 7 sage #CBD081 · 8 leaf-green #A9C982 ·
9 green #8FCB9A · 10 mint #8FD0B8 · 11 aqua #7FBFC8 · 12 sky #8FB6D6 ·
13 lavender #8590D8 · 14 violet #7E7BC0 · 15 purple #A98FCE · 16 mauve #BE93C6.

### Marginalia marks (locked)
- **gathered** = hollow teal ring (`--marginalia-color` #1D9E75). **Live** now — renders
  from `evidence[]`.
- **incorporated** = solid teal + tether. Built but **dormant until Stage 10** supplies
  prose anchors (`evidence[]` is currently flat — no per-attachment state, no proseAnchor).
- Visibility is **optional**: a marginalia toggle (default on) hides/shows the marks.

### Connections (locked)
- **resonance** (sub-theory ↔ sub-theory) = warm **tan** solid line; speculative =
  lighter tan **dashed** ("faint"). Deliberately distinct from the teal marginalia marks
  so the two don't blur. (`--thread-color` retunes from its current teal to tan when
  edges land in 9.6c.)
- **Yumi:** a dashed circle + label at the upper right, noticing.

### Books — the evidence layer (locked, 9.6d)
Quiet, smaller, dimmer **gray** glyphs tethered by subtle gray dotted lines to the
sub-theory(ies) they feed. A book feeding **2+** sub-theories **renders once and bridges
them** — intersectionality made visible. Derived from `evidence[].refId` (kind `book`)
deduped across the arc's sub-theories — **no new schema**. Visibility optional (Books toggle).

### Legend + hint (locked)
Editorial glyph legend: *resonance · faint · gathered · incorporated · book*. Footer hint:
"drag · connect two sub-theories or attach a book · hover for a card."

### Arrangement authorship (locked)
**The user authors the arrangement.** The layout is the user's own intellectual map —
proximity is an argument about what relates to what. The app provides a **beautiful
composed default** and an **opt-in "arrange"**, but **never auto-reflows or optimizes
over a user's placement** (that would overwrite the user's meaning). Positions persist
via the 9.6a x/y schema.

### Other locked calls
- **Map vs workspace:** workspace (draggable, arrangeable).
- **Motion:** alive — the constellation is the thinking-workspace where gentle, diegetic
  motion is allowed; reading surfaces stay still.

### Build implications
- Position persists → x/y on the sub-theory record (**shipped in 9.6a**; migrate
  1.13.0→1.14.0; Firestore rides free via the by-reference doc copy).
- Book layer is **derived** from `evidence[].refId` — no new schema to read it.
- "Attach a book" = `addEvidence`; "resonance" = `linkSubTheories` (already shipped).
- The 16-mark grammar, the toggles, hover cards, drag, and the book layer are new UI.

### Sub-stage split (locked)
- **9.6a — schema + position persistence.** x/y on the sub-theory, migrate, saveState.
  **SHIPPED + verified June 7 (commit caf86f7).** No visual change.
- **9.6b — the luminous re-skin (STATIC).** The 16-mark generative grammar + the 16
  `--subtheory-*` tokens + wheat ground + amber question-glow + maturity→luminosity +
  gathered-live / incorporated-dormant marks + the glyph legend + the marginalia toggle.
  **No interactivity.** Files: `arc-constellation.js`, `theme.css`, `views.js`
  (+ `sw.js` cache bump). Marks render on the default radial layout.
- **9.6c — interactivity.** The header control bar (+ Sub-theory / Connect / Reset);
  drag (persisting position) into the user's own arrangement; hover cards; **Connect**
  wires `linkSubTheories` → the tan resonance + faint edges go live (`--thread-color`
  retunes to tan here); and the arrangement-authorship model (beautiful default +
  opt-in "arrange", never auto-reflow).
- **9.6d — the book evidence layer.** Derived book glyphs, tethers, bridges (a shared
  book renders once), book-attach (`addEvidence`), the "book" legend item, the Books toggle.

---

## Part 2 — The Visual System Uplift  (named initiative)

This design-and-interaction standard — the golden-wheat material language, the luminous
treatment, the editorial chrome, the considered motion-flow, the interaction quality —
applies to **every page and surface** of Praxis, not just the constellation. It is an
**initiative**, not a single dated stage. It spans theme.css evolution (reconciling the
canonical palette to the locked direction) and a per-surface uplift of the shelf,
Notebook, book detail, the writing surface, the Yumi panel, settings, empty states, and
onboarding. The deep-dive (Part 3) turns it into a sequenced plan.

---

## Part 3 — The deep-dive  (new chat) — kickoff scaffold

**Why a new chat:** clean context for a whole-app audit.

**What to audit:** (1) setup & onboarding; (2) data & channels — what's Firestore-synced
vs localStorage-only (RESOLVED — arcs/notebook/sub-theories sync via Stage 14.1
REPLACE-merge loaders; the strategic roadmap's "localStorage-only / biggest launch
blocker" framing is superseded), the `saveState` chokepoint,
`ensureBookFields` / `ensureSubTheoryFields`, the Netlify Anthropic proxy, `getYumiContext`
(stubbed); (3) surfaces — each scored for functionality gap AND design-language gap;
(4) functionality gaps — the Stage 9.4 field-notes items (F1–F6), persistence, Yumi
eval/TTS, citation (Stage 10), Yumi transparency (Stage 11); (5) roadmap re-sequencing.

**Inputs to bring:** `praxis-design-system.md`, `theme.css`, this doc, the current
`checklist.html` + roadmap, the locked builder screenshot + the 16-mark design board,
`state.js`, `views.js`, `arc-constellation.js`, the field notes.

**Output:** a realigned `checklist.html` + roadmap; a per-surface uplift backlog; a clean
stage sequence (9.6a–d, the uplift surfaces, the existing roadmap).
