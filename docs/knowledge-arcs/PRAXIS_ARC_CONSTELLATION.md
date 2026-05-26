# Praxis Arc Constellation — Visual + Implementation Spec
Date locked: May 23, 2026
Scope: arc constellation renderer ONLY
Supersedes: nothing — this is additive to existing 5.6 shipped work
## Relationship to shipped work
Stage 5.6 shipped the shelf-side visual vocabulary: simple register glyphs (single-path silhouettes), --register-* CSS vars, ensureBookFields data wiring, and the tradition override UI on book detail page. That shipped work stays untouched.
This document specifies the arc-side visual system, which is intentionally richer than the shelf-side: arc forms use full Round 11 treatment (grain-textured interior, halo on silhouette, inner-light at core) because the arc surface is the contemplative, central space where a reader sits inside their inquiry. The shelf is "find a book"; the arc is "be with the work." Different surfaces, different visual register.
This is a deliberate choice on record, not a drift. If shelf and arc look different, that's intended.
## The eight locked decisions (May 23, 2026)
1. Arc ground = wheat (continuous with page ground; the dark-field treatment proposed in older shelf-and-field-decisions.md is not in effect)
2. Engagement saturation: Band 0 = light fill, no halo. Band 1 = full saturation, no halo. Band 2 = full saturation + halo.
3. Shelf glyph survives at 28px with inner-light dot at band 2 only (this is shipped 5.6 work; documented here for completeness)
4. Threads: neutral teal-green, bidirectional with thickness gradient toward more-engaged book, thickness=notes, opacity=recency, dashed=speculative
5. Marginalia dots: 4px teal-green, organic cluster just outside silhouette, individual for 1–4, rosette of 3 dots for 5+
6. Arc composition: Constellation as default (gravity-as-question, Yumi at edge), Spare focal auto-mode at ≤5 books (same renderer, larger question text, fewer threads)
7. Shelf glyph: top-right at 20×20 (this is shipped 5.6 work; documented for completeness)
8. Tradition override: on book detail page (this is shipped 5.6 work; documented for completeness)
Decisions 3, 7, 8 are documented here for traceability but are NOT changed by this prompt.
## Round 11 form vocabulary (arc-scale)
Forms at arc scale (~60px diameter, with halo extending to ~80px) use full Round 11 treatment:
- Grain-textured pattern fill (horizontal contour lines, color-matched darker ink)
- 2–3 concentric rings inside the shape, dark stroke at 0.5–0.65 opacity
- Solid dark core circle at ~12px radius (scaled proportionally to form size)
- Small bright inner-light ellipse on top of core (--tradition-inner-light radial gradient)
- Halo follows silhouette, 55–78% radial stop, 0.65–0.75 opacity — present only at Band 2
Nine traditions, locked colors:
| Tradition | Shape | Base | Halo |
|---|---|---|---|
| Theory | square (rounded) | #D67248 | #F0A88A |
| Wisdom | hexagon | #F0C82A | #F8E078 |
| Empirical | pentagon | #F0A075 | #F8C8AA |
| History | diamond | #C8842A | #E8B068 |
| Memoir | circle | #9AAA48 | #C5D080 |
| Novel | oval | #E07A98 | #F5BACE |
| Poetry | triangle | #4858B8 | #8590D8 |
| Place | crescent | #5FB082 | #98D4B0 |
| Practice | trapezoid | #8A5A38 | #B8896C |
Reference implementation: docs/knowledge-arcs/round_11_brighter.svg (see Stage 0 File 2).
## Constellation composition rules
- Container background: wheat ground with same grain pattern as Round 11 reference
- Question rendered as radial gravitational glow at visual center (faint amber radial fade) + italic serif text overlaid in Cormorant Garamond or Georgia at 14px in constellation mode, 20px in spare focal mode
- Books arranged in an organic scatter, deterministic from book IDs (same arc renders the same layout across sessions)
- Threads drawn between book pairs in arc.threads array, behind books in z-order
- Marginalia dots rendered after books, in front
- Yumi: small dashed circle (14px radius) at upper-right corner, "Yumi" label below in italic serif 11px; faint dashed lines (opacity 0.4) from Yumi to each book in arc.yumiNoticing array
- Legend at bottom in editorial style: small, secondary color, sentence case, no card or border
## Spare focal mode
Triggers when arc.books.length <= 5. Same renderer; differences:
- Question text size 20px instead of 14px
- Books arranged in a wider triangular layout
- Threads still rendered but minimum opacity raised to 0.5 (no faint speculative threads in spare mode)
- Yumi still present, upper-right
## Marginalia dot rules
For each book:
- noteCount = marginalia entries + journal entries linked to this book
- If noteCount === 0: no dots
- If 1 <= noteCount <= 4: render noteCount individual 4px dots in an organic cluster just outside book silhouette, positioned deterministically from book ID (no random per-render placement)
- If noteCount >= 5: render rosette glyph — 3 dots each 3px arranged in a tight equilateral triangle, positioned at one consistent point outside the silhouette
All dots use color --marginalia-color (#1D9E75).
## Thread rules
For each thread in arc.threads:
- stroke = --thread-color (#1D9E75)
- stroke-width = clamp(0.6, threadStrength * 0.4, 3) — where threadStrength is the number of linked notes
- opacity = clamp(0.3, recencyOpacity, 0.85) — fades over time per recency
- stroke-dasharray = "3 3" if speculative else solid
- Thickness gradient: split into 2 segments at midpoint; second segment 0.4px thicker than first; the "more-engaged book" is whichever endpoint has the higher engagement band (tie-break: higher noteCount)
## Data shape expected by renderer
arc = {
  id: string,
  question: string (may be empty),
  books: [
    {
      id: string,
      tradition: string (effective tradition, post-override),
      band: 0|1|2,
      noteCount: integer
    }
  ],
  threads: [
    {
      bookAId: string,
      bookBId: string,
      strength: integer,
      daysSinceLastTouch: integer,
      speculative: boolean
    }
  ],
  yumiNoticing: [bookId, ...]
}
When arc data is not yet wired (Stage 3.8/3.9 in progress per project memory), renderer scaffolds against sample arcs defined in test-arc-constellation.html.
## What this document does NOT decide
- Wiring constellation renderer into the live arc page (Stage 3.8/3.9 territory, separate work)
- The "what Yumi can see" transparency surface
- Onboarding visuals
- Notebook visual rendering
- Any change to shelf or shipped 5.6 work
## Stability
This document is locked May 23, 2026. Changes require deliberate design conversation, not in-line edits.
