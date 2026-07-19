# R-POLISH SLICE 0 — STAGE 1 RECON (the six pre-build verifications)

Docs-only. HEAD f0e1642. Two Sonnet praxis-recon agents (CO-1 audit; NBK-1+UX-2) + direct grep.
Standing recs applied — obvious readings ruled, no stops. Foundations intact
(lumen-amber 14,681 B · marks.js 10,255 B). renderRoute() views.js:350.

## 1 · L3 PRECONDITION — pastels are TOKENS, not hardcoded (mechanism = repoint)
`arcFieldHue(arcId)` (views.js:5739-5746) returns `'var(--field-' + N + ')'` — the arc marks are
**token-driven, not hardcoded hex**. A hardcoded-pastel grep over the arc/field renderers = **0 hits**.
Deep/on-light channels already exist: `PraxisMarks` COLORS carry a per-colour DEEP (`#37968A`…`#CC6E5C`);
`_pfFieldHueDeep`→`--pf-hue-Nd` (views.js:17734); `--bk-field-1..10` (components.css:11056); `--field-deep`.
→ **RULING (obvious reading, pre-approved):** the L3 glyph channel is a **token/render-time repoint**, no
render surgery, no foundations edit — applied in the kit, wired at B2. The Stage-2 proof (below) confirms
the mechanism. **De-risked.**

## 2 · F6 — teal on the CONNECTION handles → gold (B2), scope-guarded
`var(--teal)` (=#2e8a93) appears 45× app-wide. The **F6 target** = the constellation CONNECTION handles /
query arrowheads (`aCqT` marker `fill="var(--teal)"` views.js:21906-21919; `st-shape--connect-selected`,
`st-canvas--connecting` arc-constellation.js:1636-1647). **SEAM (do NOT over-convert):** teal is ALSO the
marginalia register (`--register-marginalia:var(--teal)`) and Yumi's reserved cyan — both STAY. → **RULING:**
extend gold coverage to the connection handles only; ride B2; leave marginalia-teal + Yumi-cyan untouched.

## 3 · NBK-1 — the growing leaf was DELIBERATELY RULED (honor + note; the brief premise is wrong)
Current behavior: the leaf **GROWS unbounded** — `buildNotebookLeftLeaf` appends note cards directly into
`.leaf-left` (views.js:2223); every `.leaf`/`.notebook-spread` rule sets `min-height` only, **never**
`max-height`/`overflow-y` (components.css:9883, 12037; the only `overflow:hidden` is corner-clip on the outer
spread). **This is a deliberate ruling across THREE independent artifacts:** (a) the source mockups
(design/notebook.html, praxis-the-notebook-amber.html — min-height, no scroll); (b) the ship checkpoint
notebook-hybrid.md:26 (`min-height:430px`, matching the mockup); (c) DW-2's stress test rendered **200 notes
directly on the page**, measuring only render time (20ms) + hScroll (0) — page-length growth is the accepted mode.
CLAUDE.md:459 ("writeline grows with content") is the COMPOSER textarea auto-grow, a DIFFERENT control — do not conflate.
→ **RULING (pre-approved honor+note):** the brief's NBK-1 premise ("the note stream scrolls WITHIN the leaf")
**contradicts the ruled ground truth.** Honor the growing-leaf ruling; do NOT build a bounded/scrolling leaf.
A bounded leaf would be a NEW design decision (THE FORK RULE) — Preston's call, not a Slice-0/B1 fix. **The
brief text should be corrected** (flag; not edited here — no rewording of committed docs without the push word).

## 4 · MARG-EDIT vs L2 — Book-Detail ✎ rides B3; MARG-EDIT is CLOSED
The Book-Detail ✎ = `'✎ Add marginalia'` (views.js:9727). The ✎ is an ICON-DIALECT instance (census #7),
not a rewire of edit-existing (the 16512 `✎` is the Account reader-model theme editor, a different surface).
→ **RULING (pre-approved):** MARG-EDIT is **CLOSED by ROOM-2 D5**; the Book-Detail ✎ converts to the SYS-1
ICON LAW stroke family during **B3's Book-Detail conversion**. Not L2's to own, not a fix now.

## 5 · CO-1 — ONE violation: the Shelf Lens Panel re-bills on every open (log for the owning batch)
`openLensPanel()` (yumi-ui.js:2072-2086) resets `lensSuggestStatus='idle'; lensSuggestLenses=[]` on EVERY
open (comment line 2078: "each open re-asks Yumi for fresh proposals"), then `renderLensPanelBody()`
auto-fires `startLensSuggest()` from INSIDE its render body (yumi-ui.js:1901) → `generateLenses()` →
`fetch('/.netlify/functions/claude-proxy')`. **Net: reopening the panel silently re-bills a fresh generation,
discarding unreviewed proposals** — exactly the CO-1 offender the brief names. All other generative surfaces
are COMPLIANT (values-retrofit, arc-voice, enrichment, capture, Yumi-moves — all click-gated or cached).
Best-practice precedent to copy: shelf classification (`classifyBookLocal` → cached in `state.books[id].category`,
explicit "Re-classify" nulls the cache). → **RULING (pre-approved log-don't-fix):** logged as a CO-1 fix for
the **owning batch** (the lens panel lives on the Shelf → R-SHELF/its lens batch; CO-1 is cross-cutting).
Not fixed in Slice 0. (Minor: portrait lens-suggest not durably cached — LOW; stale "default OFF" comment
yumi-ui.js:1609 — cosmetic.)

## 6 · UX-2 — nav ⌘K search TRUE SCOPE (recorded)
⌘K spotlight (`spotlightSearch` spotlight.js:47-187, cap 5/group) searches:
- **Sub-theories:** header + bodyPublic + bodyIntellectual (61-63)
- **Books:** title ONLY (91)  ·  **Authors:** derived from book.author (113-130), route `#books` (unfiltered)
- **Arcs:** title ONLY (152)  ·  **Notebook entries:** body ONLY (169; title-match retired 168)
**NOT searched:** `bookArtifacts` (artifact text unsearchable though `#artifact/<id>` is a real route) ·
`arc.description` · sub-theory evidence items · `notebookEntry.register` (label-only) · any social entity.
**Asymmetry (haystack-dup debt, still live):** a SEPARATE `#search` index `_searchBuildIndex` (views.js:793-926)
has a WIDER haystack (arc = title+description+subcount; book includes author) — ⌘K and #search answer the same
query differently. → **RULING (pre-approved record):** scope recorded; UX-2's "labeled for its true scope" copy
must name WHICH surface it describes; the ⌘K/#search reconciliation is a batch item (not fixed now).

## STAGE-1 SUMMARY
No fork requires a stop (all six resolved at the standing recs). No foundations/CACHE/renderRoute deviation.
Carried forward: F6→B2 · NBK-1 brief-text correction (Preston) · Book-Detail ✎→B3 · CO-1 Lens-Panel→owning batch ·
UX-2 scope recorded. Proceeding to Stage 2 (proof) and Stage 3 (kit).
