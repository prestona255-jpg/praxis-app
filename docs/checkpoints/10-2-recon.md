# 10.2 — Stage 0 recon + DECISION GATE

HEAD: abcd03a (v3.93). Tracked tree clean (only 3 unrelated untracked PDFs/screenshot).
**This substage HALTS after recon for Preston's decision (A/B/C below). No build yet.**

## Baselines (re-measured; reflect shipped 10.3)
| File | Bytes | Lines |
|---|---|---|
| js/state.js | 75,019 | 1,836 |
| js/views.js | 306,870 | 7,435 |
| assets/components.css | 158,406 | 5,592 |
| sw.js CACHE_VERSION | — | praxis-v3.93 |

## Layout facts (renderSubTheoryPage, route #subtheory/<id>)
- `.subtheory-layout` = CSS grid `grid-template-columns: 1fr 300px`, gap 22px
  (components.css:4718). Left = prose column `.subtheory-main` (min-width:0,
  flexible); right = fixed **300px** evidence rail.
- Editor DOM in `main` (views.js:4068-4116): header-input (34px serif) →
  `.subtheory-register-toggle` pill (Public | Intellectual tabs) →
  `publicBody` textarea → `intelBody` textarea. `showRegister(bool)` display-
  toggles so exactly ONE body textarea is visible at a time (views.js:4097-4116).
- `.subtheory-register-body` (components.css:4795): serif 18px / line-height 1.6,
  width 100%, min-height 40vh, padding 0, transparent, border none, resize none.
- Bodies persist on BLUR via updateSubTheory (views.js:4075-4085). Raw text stored
  verbatim; NO italic/citation rendering exists (comment views.js:3658 defers to St10).
- Mobile (@media ~components.css:5031): layout collapses to one column; rail becomes
  a bottom sheet behind the "Evidence" railToggle.

## Where a preview pane could mount + width budget
- A read-only preview pane mounts in `main`, beneath the active textarea (a sibling
  after `publicBody`/`intelBody`). It inherits the FLEXIBLE prose-column width
  (wide on desktop, full-width on mobile) — generous budget, not the 300px rail.
- One pane per register, OR one shared pane re-rendered on tab switch.
- Because saves are blur-gated, the pane MUST read live `textarea.value` on `input`
  (debounce ok), not the saved field — else it lags a register's unsaved edits.

## Citation matcher inputs (the title sources)
- `evidenceLabel(el)` (views.js:4185-4210) already resolves a DISPLAY label:
  book = `title — author` (live off state.books), entry = title or 60-char body
  preview, external = `title — author` (from stored {title,author}).
- NUANCE: matching needs the BARE title, not the `title — author` composite.
  The matcher should compare the italic phrase (case-insensitive substring) against:
  book -> state.books[refId].title; entry -> entry.title or label; external ->
  el.external.title (resolved via the 10.3 refId). evidenceLabel is right for the
  TOOLTIP text; a separate bare-title extraction is right for MATCHING.

## Tooltip pattern (house)
- Rich: `.arc-tooltip` surface (components.css:4524-4570) — positioned hover card
  (title/meta/affordance), needs positioning JS. Polished path.
- Cheap: native `title=` attribute (46 existing uses in views.js). Carries the full
  citation string on hover with zero JS. Low-cost v1 path.

## Evidence-change re-render seam
- The rail's `refreshAttached()` repaints the attached list on attach/detach WITHOUT
  a full renderSubTheoryPage re-render (local; protects un-blurred prose,
  views.js:4258 / 4487-4492). 10.2's preview must re-parse + repaint wherever
  evidence changes — cleanest is a `refreshCitations()` closure called alongside
  every existing `refreshAttached()` call site (attach via buildSourceRow,
  buildExternalForm, and any detach). No event bus exists; co-calling is the idiom.

## DECISION GATE — three options for the "underline-dot in the writing surface"
The spec wants an underline-dot under italicized citations IN the writing surface.
You cannot style text INSIDE a <textarea>. Options:

### (A) Live read-only PREVIEW PANE beneath each register's textarea  [RECOMMENDED]
- Render parsed segments (plain / plain-italic / citation-with-dot+tooltip) read-only
  in a pane under the active textarea; re-render on input (debounced) + on evidence change.
- PRO: simplest correct approach; no textarea hacks. The SAME renderer is reused as
  10.4's renderSubTheoryReadOnly draft mode — built once, paid once.
- CON: duplicates the text vertically (raw textarea above, rendered preview below);
  some vertical space cost. The writer sees literal *asterisks* above, rendered below.
- COST: moderate. Touches: parser (slice 1), preview render + input/evidence hooks
  (slice 2), CSS (slice 4).

### (B) Overlay div mirroring the textarea
- An absolutely-positioned layer under/over the textarea paints decorations beneath
  the real (transparent-text) glyphs. The borderless transparent textarea (padding 0)
  helps alignment.
- PRO: decorations appear under the actual text, in place (closest to the literal spec).
- CON: fragile — must mirror font metrics (serif 18/1.6), wrapping, scroll position,
  resize, zoom, and IME exactly; classic source of drift. Highest maintenance risk.
- COST: high (sync correctness), brittle.

### (C) contenteditable migration
- Replace the textareas with contenteditable divs that render decorations inline.
- PRO: true in-place rendering, no preview duplication.
- CON: large rewrite — replaces blur-save (textarea.value -> updateSubTheory), caret/
  selection, paste sanitization; ES3 (no template literals/arrow) raises complexity;
  directly risks the blur-save contract this plan's non-goals say not to touch.
- COST: high; touches the most load-bearing editor code.

## Recommendation
**(A) preview pane.** Lowest risk, honors the non-goal "no contenteditable migration
unless the gate picks it," and its renderer is the reusable base 10.4 expects. Tooltip:
start with native `title=` (cheap, accessible) and upgrade to `.arc-tooltip` only if you
want the richer card. Underline-dot via a CSS class on citation spans.

HALT — awaiting Preston's choice of A / B / C (and tooltip flavor) before Slice 1.
