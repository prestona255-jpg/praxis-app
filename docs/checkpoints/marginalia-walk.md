# Marginalia coverage walk — #book/<id>/marks + book-detail composer

Read-only audit (queue item 4). **No code changed.** Dispatched praxis-recon to walk the
one core writing surface the fable audit didn't reach. Verified against live source at
HEAD e861d59 / cache v3.182.

## VERDICT: CONCERN — but **zero LAUNCH-CRITICAL**. Launch is not blocked by this surface.

The privacy covenant (VC1-class) is **clean on every seam this surface actually touches**.
Two SHOULD-FIX (both NB1-class craft), three NOTE-level items. None launch-critical.

## Function anchors (for any follow-up ticket)
- `renderBookView(bookId)` — `#book/<id>/marks` route — js/views.js:7591-7728
- `renderBookDetail(bookId)` — `#book/<id>`, hosts Add-marginalia — js/views.js:8070-8356
- `marginaliaForBook(bookId)` — js/views.js:7438-7461
- `buildMargCard(marg)` — read-only list item — js/views.js:7500-7541
- `openMarginaliaEditor(bookId)` — the composer — js/views.js:12883-12943
- Add-marginalia button wiring — js/views.js:8180-8185

## Findings

### [VC1-CLASS] CLEAN — Yumi per-note trigger honors the covenant
`openMarginaliaEditor` onSave (js/views.js:12920) → `maybeDrawOut(id)` (js/views.js:2812-2828)
→ `YumiBrain.considerMove` (js/yumi-brain.js:1701-1716) gates on
`entry.isPrivate === true || entry.register === 'journal'` (js/yumi-brain.js:1714) BEFORE any
model call. Correct.

### [VC1-CLASS] CLEAN — #yumi-sees reads through the canonical filter
`openTransparencyView`/`buildTransparencyContent` (js/views.js:13866+) → `getContextSnapshot`
= alias of `assembleContextData` (js/yumi-brain.js:2774) → canonical `isPrivate===true ||
register==='journal'` skip (js/yumi-brain.js:225-227). No weaker predicate on this path.

### [OK] Typed marginalia ink is legible — NOT an NB1 repeat
`.wc-input{color:var(--ink)}` (components.css:10537) on the genuinely-dark `.bk-surface.lum-amber-deep`
ground (lumen-amber.css:82-89). Under `[data-ground="dark"]` `--ink → #f0e3c8` (theme.css:341); vs
dark gradient stops ≈13.5–14.8:1. Unlike the Notebook bug, no light card wraps the editor host.
(Token/contrast math; no live screenshot this pass.)

### [NB1-CLASS · SHOULD-FIX] Placeholder text sub-AA on the marginalia composer
`.wc-input:empty::before{color:color-mix(in srgb, var(--meta) 78%, transparent)}` (components.css:10547).
`--meta:#9a7e4e` (theme.css:33) is NOT in the dark-ground remap list, so over the mid gradient stop
≈3.23:1 — below AA 4.5:1. Same class as the NB1 fix, but that fix was scoped to
`.notebook .nb-composer .nb-ce::placeholder` (components.css:9756) and does not reach `.wc-input`.
Placeholder = "Write in the margin…" (js/views.js:12893). Dim but readable → SHOULD-FIX.

### [NB1-CLASS · SHOULD-FIX] No per-note visibility indicator + no edit/delete from the book surface
`buildMargCard` (js/views.js:7500-7541) renders pen glyph + body + date + optional "became →"
link, with NO click handler and NO private/Yumi-visible dot (contrast the Notebook's
`renderNotebookEntry` js/views.js:13413-13422). `openMarginaliaEditor` is CREATE-ONLY (`entryId`
starts null, never seeded from an existing note). Only edit/delete path is the Notebook, with no
deep-link back. The book-marks card is inert.

### [NOTE] evidence/publish filter is isPrivate-only (fragile, currently safe)
`evidencePrivate()` (js/views.js:8898-8901, twin 10066-10074) and the arc source-list filter
(js/views.js:10246-10248) check `isPrivate===true` only — no `register==='journal'` — when deciding
whether a `kind:'entry'` evidence quote is safe to show OTHER readers. Currently safe ONLY because
`toggleGather()` (js/views.js:2258-2263) bars journal entries at the UI. That is a single
enforcement point, not defense-in-depth: `notebookCreateSubTheory` (2325-2346) and `weaveNote`
(10671-10680) trust caller-supplied ids without re-checking register. No live leak. Flag for anyone
touching the gather/evidence write path.

### [COPY · NOTE] Signed-out marks gate overstates privacy
`buildSignedOutPrompt('Your marks are private', '...your notes are yours alone.')` (js/views.js:7600)
reads absolute, but marginalia is Yumi-visible BY DEFAULT (`getRegisterDefault`, js/views.js:13727,
2763). True human-to-human only. Debatable given the app's careful transparency framing elsewhere.

### [NOTE] Stale in-code comment (doc-vs-code drift)
components.css:10530-10535 says book detail is "the bright page, so --ink/--page read bright" —
contradicted by js/views.js:369-372 (book joined the DARK umberGroundDark set in Wave 4). Fix when
that CSS block is next touched.

## Follow-up (spawned as background tasks, out of this sweep's scope)
- SHOULD-FIX: dark-ground placeholder contrast for `.wc-input` (mirror the NB1 pattern).
- SHOULD-FIX: per-note visibility dot + edit/delete affordance (or deep-link) on the book-marks list.
