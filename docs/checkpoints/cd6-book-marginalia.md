# CD-6 UNIFICATION · STAGE 2 (Book-Detail Add-marginalia) — BUILD + VERIFY

Built per Preston's rulings. HEAD `c59a092` → CACHE_VERSION `praxis-v3.254` → **v3.255**.
Committed-local pending felt pass. A deliberately SMALL, surgical change (the census ruled the
rich editor unused: 0/11 on every formatting feature).

## Rulings → what shipped
- **FORK 1 (rich vs plain) = PLAIN DOOR for create.** `createWritingCanvas` module UNTOUCHED
  (shared, 9 refs in views.js). The create button no longer mounts it; a plain-door body still
  renders as markdown on the card (`wcRenderMarkdown` reads `body` either way — nothing lost).
- **FORK 2 (✎ edit) = OUT OF SCOPE, pencil UNCHANGED.** `openMarginaliaEditor` is untouched; the
  ✎ pencil (views.js:8489) still opens it edit-only. Ledger note: revisit routing edit to
  note-detail + full retirement once F2 (note-detail readability) ships.
- **FORK 3 (register) = default marginalia, NOT locked.** The door's 3-way grammar stands; a
  question/journal about a book is a valid capture.
- **FORK 4 = explicit commit** (draft gate; no live-entry-on-first-keystroke).
- **FORK 5 = the "✎ Add marginalia" button becomes the affordance** → `openCaptureDoor({mode:'note',
  targetKey:bookId})`; the book page's marginalia list refreshes on commit, route-gated like #notebook.

## The change (3 edits)
1. **views.js:9414** — the primary `.bk-actionbtn-primary` handler: `openMarginaliaEditor(bookId)`
   → `openCaptureDoor({ mode:'note', targetKey:bookId })`. (Create composer retired from the button.)
2. **views.js `capFinishCommit`** — the route-gated refresh extended: `#notebook` → `renderNotebook()`;
   else on a `#book/<id>` route → `renderBookDetail(capCurrentBookKey())`, **GUARDED by
   `capBookPageHasOpenInline()`** (Stage-2 gate fix — see below). `captureNote(noNav=true)` still never
   touches `notebookActiveTab` (HOLD-2). `renderBookDetail` tears down `#app` (`host.innerHTML=''`),
   so the refresh is skipped whenever an inline editor/picker is open on the page.
3. **sw.js** — v3.254 → v3.255.

`openMarginaliaEditor`, `createWritingCanvas`, the door guards, and the photo pipeline are all
UNTOUCHED. No new write surface, no second image pipeline, no new guard/async path.

## RECONCILE (census withImages=2 vs "composer images always []") — RESOLVED with code proof
`openMarginaliaEditor` create write is hardcoded `images: []` (views.js:14579) — cannot produce
images. The only writers of `{register:'marginalia', images:[non-empty]}` are `captureNote`-with-
images calls = the door photo mode (Stage 1+, capCommit) + the retired writeline (pre-Stage-1).
`ImportCapture` writes `images:[]` (import-capture.js:319). So the 2 image-marginalia are capture-
path notes; no composer image path was missed.

## Mechanical gates
| Gate | Result |
|---|---|
| parse views.js (cscript) | **PARSE OK, exit 0** |
| views.js byte delta | 1,092,907 → **1,093,906 (+999 B)** (rewire + refresh branch + comments) |
| sw.js byte delta | **+0** (version string equal length) · 0 CR both |
| create composer retired | `openMarginaliaEditor(` live calls = pencil(8489) + def only; button → `openCaptureDoor` (9414) |
| createWritingCanvas untouched | 9 refs in views.js; writing-canvas.js not in the diff |
| guard singularity | `capCommitBusy = false` only at finalize + backstop, BOTH gen-gated (unchanged from Stage 1) |
| entry-write-surface | `captureNote` = sole writer (1 def); nbPhotoIdbPut 1; `addDoc` 0; no new `.set(` |
| foundations MD5 | marks `772886c0…` · lumen-amber `070679b0…` — UNCHANGED |

## Live L18 walk (rig :8760, uid `d0tester`, seed book `book_1784933414017_538254`)
| Check | Evidence |
|---|---|
| fresh bundle | served views.js carries the button→door rewire + the `renderBookDetail(bkKey)` refresh |
| A — button opens door | pre-targeted chip = book title (CD-3) · register marginalia · mode note · **seg = 3 (not locked, FORK 3)** |
| B — commit + book refresh | marginalia 0→1, filed:true, bookIds=[book], images 0 · toast "Filed to <book> · Undo" · **note visible on the book page (refreshed)** · sheet stays open · ✎ pencil rendered on the new card |
| D — ✎ edit UNCHANGED | pencil → `createWritingCanvas` mounts (`.wc-input` + `.wc-fmt` format bar) · **prefilled with the note body** |
| E — FORK 3 question | question about the book filed: register question, filed:true, bookIds=[book] |
| F — HOLD-2 | after book-page commits, notebook renders, active tab still "Inbox 0" (undisturbed); marginalia+question filed to the BOOK not inbox |
| G — photo (additive) | book-page photo → marginalia + image (idbKey, w44/h30), filed to book · book page refreshed |
| 390 | page no h-scroll · button + door in-vp · 0 overflowers across all 5 modes |
| 1360 | page no h-scroll · door corner card (left 24, right 420) in-vp · 0 overflowers |
| console | **clean** (0 errors across the walk) |

## Stage-2 adversarial gate (fix-red-team, Sonnet) — 1 BLOCK found + FIXED, re-verified

**BLOCK (real, fixed): the book-page refresh destroyed open inline UI.** The new
`renderBookDetail(bkKey)` branch tore down `#app` (`host.innerHTML=''`) unconditionally — so a
door commit (nav Capture / ⌘N) while the **✎ pencil-edit canvas** (or the arc / sub-theory picker)
was open would destroy that in-progress UI. Reachable by ordinary same-page usage, no race. The
checkpoint's own "no surface-state to disturb" claim was false (corrected above).
**Fix:** a `capBookPageHasOpenInline()` guard (checks the three inline hosts —
`book-detail-editor-host` / `-arc-picker-host` / `-subtheory-picker-host`); the book-page refresh is
skipped when one is open. The note is still filed and sits in the door's caught-list; it surfaces
when the editor closes (its own `renderBookDetail`) or on the next nav.
**Re-verified live (element-identity, two runs + full-behavior):** with the editor open, a door
commit → `renderBookDetail` SKIPPED (`#app` first child + `.bk-actions` + editor host are the SAME
elements; the marked `.wc-input` survives) · the second note IS filed · it is NOT on the page yet ·
and it SURFACES when the editor is closed (Done). Normal path (no editor) still refreshes in place.
Parse exit 0; views.js delta now **+2,194 B**.
- **NOTE (Finding 2, same root, fixed by the same guard):** an open arc/sub-theory picker was
  likewise closed by the teardown — the host guard covers it (no data at risk either way; picker
  selections write on click).
- **Pre-existing (flagged, not fixed here):** the `#notebook` branch (Stage 1) has the same latent
  teardown of an open inline editor. Filed as **CD6-NBK-REFRESH-GUARD** (residual R3) — REVERT
  JUDGMENT: not this stage's cause, not widened here.

## Residuals
- **R1 — FORK 2 deferred (by ruling).** The ✎ pencil keeps the bespoke `openMarginaliaEditor` edit
  path; full retirement + routing edit to note-detail waits on F2. Not a regression — edit works
  unchanged. Logged for the post-F2 revisit.
- **R2 — the door commit on routes that are neither #notebook nor #book does no in-place refresh**
  (e.g. a ⌘N capture on #arcs); the sheet's caught-list is the receipt. By design (no leaf to refresh).
- **R3 — CD6-NBK-REFRESH-GUARD (pre-existing, Stage 1).** The `#notebook` refresh branch has the
  same latent `#app` teardown of an open inline editor (e.g. a notebook-card journal/marginalia edit,
  or the gather name canvas). Not caused by this stage; the same `capBookPageHasOpenInline`-style
  guard (notebook hosts) should be applied in a follow-on. Flagged, not widened here.

Stage-2 adversarial gate next, then HALT for the felt pass. Ship = v3.255 on Preston's word.
