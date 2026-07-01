# Wave 7 — deferred tasks (logged for Preston's greenlight; NOT done)

Surfaced by the mockup-truth pass (audit wf_f0e7a600-b81). These are out of the Wave 7
reskin scope (they touch logic/flow or need a data-model field) and are logged here as
explicit follow-up tasks — not counted as shipped.

## 1. Import — review-before-commit flow (FLOW/LOGIC rebuild)
`import-amber.html` describes a **different modal** than the live one Surface B reskinned.
Mockup = a 4-tab bar (Paste | Upload | Dictate | Talk it through), a header **book-picker**
scoping the import to one book, a **pre-commit editable review** (Yumi say-line + per-card
register selector + per-note delete-before-commit) gated by a "Bring in N notes" button, an
over-split **Merge / Keep-separate** flag, and a distinct conversational "Talk it through"
door. The live modal is **dictation-first** (mic hero + paste/upload pills) and
**file-then-review** (commits immediately, then a receipt + coarse whole-import Undo).
- Wave 7 shipped the **amber SKIN** of the live modal (verified). The mockup's flow/structure
  is a **separate feature build** — it changes commit order + adds UI + needs a book-scope
  model. Greenlight required before building.

## 2. Import — PASTE-PATH MISSING CANCEL (real gap — FIX task, not a clean defer)
**Confirmed real** (audit import buildMap n15): a cancel/escape affordance exists ONLY on the
**dictation-transcribe** beat (`renderProcessing` with `onType` → "Taking a while — type
instead" + close). The **paste / bulk-import** beat is reached via `runImport → renderProcessing(panel, label)`
**without `onType`**, so it renders the breathing "Y" orb with **no Cancel and no close** — a
user who pastes a large block can be **stranded mid-process** with no UI exit (segmentDoc has a
server-side timeout, but no client abort control). The mockup keeps an always-present Cancel on
its beat. **FIX task:** add a Cancel/abort affordance to the paste-path processing beat (wire an
abort into the `runImport` `renderProcessing` call). Small, but touches the processing flow —
so logged, not silently accepted.

## 3. Arcs — published-flag + consequence (DATA-MODEL)
The arc record (`createArc` / `ensureArcFields`) carries only
`title/description/bookIds/entryIds/userId/createdAt`. The mockup's **Published-only toggle**,
per-arc **public/private chip**, and **consequence line** ("walked by N · built on by N" /
"a draft — only you can see it") all need real fields that don't exist. Omitted this wave.
**Task:** add an arc `published` boolean (+ publishedAt) and, if wanted, consequence counts
(walked / built-on / questioned) — then wire the toggle, chip, and consequence line. Feature +
schema change; greenlight required.

## Also flagged for the final look (not auto-applied)
- Arcs illustrated example card ("A Pedagogy of Flow"): C1 (drop description) was applied to
  the **real** arc cards (own + seed Pedagogy-of-Desire); the illustrated example **kept** its
  explanatory copy since it has no real constellation/meta to carry the tile. Preston to confirm
  at final look whether to strip it too.
