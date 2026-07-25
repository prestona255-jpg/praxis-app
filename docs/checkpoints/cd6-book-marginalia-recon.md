# CD-6 UNIFICATION · STAGE 2 (Book-Detail Add-marginalia) — STAGE 0 RECON

CD6-BOOK-MARG STARTED · HEAD `c59a092` · CACHE_VERSION `praxis-v3.254` → ship `v3.255`
Baselines (LF blobs): views.js **1,092,907 B** · writing-canvas.js **26,613 B** · components.css **858,358 B**
Foundations MD5 (must stay): marks.js `772886c0…` · lumen-amber.css `070679b0…`

## §1 — THE DATA-SHAPE CONTRACT (the surface's special risk) — RESOLVED: shape is IDENTICAL

The Book-Detail marginalia composer is `openMarginaliaEditor(bookId, editEntryId)`
(views.js:14520), which mounts **`createWritingCanvas`** (js/writing-canvas.js) — a **rich
markdown editor** (contenteditable): live block transforms (H1/H2, bullet/numbered/checkbox
lists, blockquote), inline **bold**/*italic* controls, undo/redo stack, autosave. BUT its
**canonical stored value is markdown plain-text** (writing-canvas.js:16 — "zero migration").

What it WRITES (create, views.js:14571-14583) — the SAME 11-field entry captureNote produces:
`{id, userId, register:'marginalia', isPrivate:getRegisterDefault('marginalia'), body:<markdown>,
bookIds:[bookId], arcIds:[], images:[], filed:true, createdAt, updatedAt}`.

- **body** = a markdown STRING. Headings/lists/checkboxes/**bold**/*italic*/`>`quotes are all
  markdown TOKENS *inside body*, not separate fields. Rendered on the card by `wcRenderMarkdown`
  (writing-canvas.js:36) — the SAME renderer a door-written plain body flows through. **So the
  door's plain field writes a valid `body`; no storage incompatibility, no lost field.**
- **NO separate quote/page-number/anchor/mark-link field exists.** Quote-like content = a `>`
  markdown line in body. Page numbers, if a user types them, are just body text. Nothing
  structured to drop.
- **images = always `[]`** — the marginalia editor has NO image capture. The door's Stage-1 photo
  mode would ADD images here (net-new, **not** a regression).
- **No marks.js seam** (grep-confirmed): the ✎ is a literal glyph char; marks.js (constellation)
  is untouched. **The NON-GOAL marks.js/lumen-amber lock holds by construction.**

**Conclusion: the ONLY capability deltas are in the EDITING LAYER, not the record** —
(a) rich markdown editing affordances, (b) the edit-existing path, (c) the autosave model.
Whether (a) is load-bearing is a DATA question → the census (§1b).

## §1b — USAGE CENSUS (needs Preston's real signed-in data — script below)

I am signed out (rig stub), so I cannot read the real marginalia. The census script (in the HALT)
counts, over real `register:'marginalia'` entries: total · how many carry block markdown
(`#`/`##`/`-`/`*`/`1.`/`[]`/`>`) · inline **bold** · *italic* · multi-line · images · length
buckets · 3 anonymized shapes (length + which tokens, never the text). **FORK 1 is ruled on these
numbers.** (Read-only; owner runs it or connects a session for me to run.)

## §2 — CAPABILITY TABLE (C-table)

| # | Marginalia composer behavior | Door coverage | Verdict |
|---|---|---|---|
| M1 | body = markdown string, rendered by `wcRenderMarkdown` | door writes `body` plain text; SAME renderer | **shape parity** ✓ |
| M2 | **rich markdown EDITING** (live H1/H2, lists, checkbox, quote, B/I, undo) | door = plain `<textarea>`, no live render, no controls | **DELTA — FORK 1 (census-gated)** |
| M3 | register = marginalia (locked) | door 3-way, defaults marginalia | **FORK 3 (lock vs allow)** |
| M4 | isPrivate = getRegisterDefault('marginalia') | door captureNote sets same | parity ✓ |
| M5 | bookIds = [bookId] (pre-targeted), filed:true | door CD-3 `targetKey:bookId` → same | parity ✓ (already wired) |
| M6 | images: none | door photo mode (Stage-1 path) = additive | parity+ ✓ |
| M7 | **autosave (create-then-update; entry exists on 1st keystroke)** | door drafts→explicit commit (⌘Enter) | **FORK 4 (model change)** |
| M8 | **EDIT existing (✎ pencil → prefill → `updateNotebookEntryBody`)** | door has NO edit-existing mode | **FORK 2 (biggest)** |
| M9 | NO draft slot (autosaves to the entry) | door drafts to `praxis_nb_draft_<uid>_capture` | no orphan (nothing to migrate) |
| M10 | commit → `renderBookDetail(bookId)` (marg list refreshes) | door `noNav`; needs a book-page refresh hook (like #notebook, ruling #5) | **build item (route-gated refresh)** |

## §3 — SEAM MAP

- **Composer:** `openMarginaliaEditor` views.js:14520 (mount + onSave create/update + `.wc-done`).
- **Entry point A (CREATE):** `.bk-actionbtn-primary` **"✎ Add marginalia"** in `.bk-actions` rail,
  views.js:9404-9409 → `openMarginaliaEditor(bookId)`.
- **Entry point B (EDIT):** `.bk-margedit` **✎ pencil** on each marginalia card meta row, owner-only,
  views.js:8483-8490 → `openMarginaliaEditor(bookId, marg.id)`.
- **Host:** `#book-detail-editor-host` (views.js:9442; SHARED with `openArtifactEditor` — only one
  editor lives there at a time — so retiring marginalia must not disturb the artifact editor's use).
- **Write accessors:** create = inline 11-field write + `markNotebookDirty`+`saveState`+`maybeDrawOut`
  (views.js:14570-14587); edit = `updateNotebookEntryBody(entryId, body)` state.js:**2609** (doc said
  2455 — drift; no-touch-write guard, the SAME accessor ROOM-2's `#note/<id>` door uses).
- **`createWritingCanvas` is SHARED** — other consumers (sub-theory name :2507, published body :11298,
  note-detail :15159, artifact via openEditor) are OUT OF SCOPE and must be untouched. Retiring the
  marginalia consumer means *stop mounting it on this path*; the module stays.
- **R7/DW/MARG-EDIT history** (docs/studio/book-detail.md): MARG-EDIT (the ✎ re-wire) shipped
  R-POLISH B3 v3.234; the edit path is live, owner-gated twice, felt-passed. `native` chip.

## §4 — THE FORKS (each with recommendation; all gated on the census)

- **FORK 1 — the rich markdown editor (THE central one).** Retiring to the door's plain field
  **loses** live markdown editing (headings/lists/checkbox/quote/B-I). Zero-regression parity would
  require mounting `createWritingCanvas` INSIDE the door — a major change to a SHARED singleton whose
  draft/commit/guards all read `capField.value` (a textarea), affecting every door mode + the 3
  unretired doors. **That is ESCAPE-VALVE territory (exceeds migration-of-existing-plumbing).**
  Recommendation: **census-conditional.** If formatting usage is low → the rich editor is unused
  capability; retire the CREATE path to the plain door (plain body still renders as markdown on the
  card; a user can still type `>`/`-`/`#` and it renders on load). If usage is material → do NOT flatten
  it; re-scope (keep rich editing, see FORK 2 options).
- **FORK 2 — the edit-existing path (✎ pencil).** The door has no edit mode. Options: **(2a)** ✎
  routes to the **note-detail door `#note/<id>`** (ROOM-2), which already edits via the SAME
  `updateNotebookEntryBody` — no new write path, reuses a shipped surface (RECOMMEND if it offers a
  usable edit UI — needs a quick verify); **(2b)** the shared door gains a light edit mode
  (`openCaptureDoor({entryId})` → seed field → `updateNotebookEntryBody` on commit) — new door
  behavior but no new write path; **(2c)** keep `openMarginaliaEditor` for EDIT only (partial
  retirement — doesn't fully satisfy "retire the composer"). Preston rules.
- **FORK 3 — register lock.** Book-page marginalia is marginalia-only. Door is 3-way. Lock to
  marginalia (parity, RECOMMEND) or allow question/journal from the book page (expansion)?
- **FORK 4 — autosave vs draft-commit.** openMarginaliaEditor autosaves (live entry on 1st keystroke);
  the door drafts then commits explicitly. RECOMMEND accept the door's explicit-commit model (Stage-1
  precedent) — but it is a felt behavior change, so Preston's call.
- **FORK 5 — affordance placement.** RECOMMEND the primary "✎ Add marginalia" button stays as the
  affordance, now opening the door pre-targeted to the book (`openCaptureDoor({mode:'note',
  targetKey:bookId})`), + the book-page marg list refreshes on commit (route-gated, like #notebook).

## §5 — Baseline bytes + anchors + expected delta

- Remove/retire: `openMarginaliaEditor` (views.js:14520-14626, ~107 L) **IF fully retired** (FORK 2
  outcome decides — 2a/2b retire it; 2c keeps it for edit). Rewire the 2 call sites (9408 create →
  door; 8489 edit → per FORK 2). Add a small affordance/handler + a book-page refresh hook.
- `createWritingCanvas` / writing-canvas.js: **untouched** (other consumers).
- Escape-valve tripwire: if FORK 1 resolves toward rich-editing parity in the door, that is a
  door-architecture change → HALT with measured cost, do not build silently.
- Expected byte delta: modest **negative** on views.js (retire ~107 L) if fully retired; near-zero/
  positive if FORK 2c (keep edit) + affordance. Refined post-ruling.

## §6 — Stage-1 precedents that BIND (unless overridden here)

Door stays a singleton (Fork-B affordance, no embedded instance) · guards grep-singular · every
`capCommitBusy` release gen-gated · image capture = the Stage-1 photo path (no 2nd pipeline) ·
`captureNote` sole entry writer · `noNav` + route-gated leaf/list refresh + HOLD-2.

HALT — awaiting (1) the census numbers, then (2) rulings on FORK 1–5, before Stage 1 fires.
