---
surface: capture
route: "overlay (BUILT — global, body-mounted; summonable over any route)"
render_fn: "BUILT — buildCaptureDoor/initCaptureDoor/capOpen (js/views.js door module, the new unified door) + buildNotebookCatchAffordance (the Notebook leaf's door into it). CD-6 Stage 1 retired buildNotebookWriteline (v3.254) + Stage 2 retired the Book-Detail Add-marginalia CREATE composer into the door (v3.255); the TWO remaining legacy doors still COEXIST (CD-6 open): window.ImportCapture · buildActMargin. (createWritingCanvas stays — shared; its ✎ EDIT path is kept, deferred until F2.)"
ground: "light working surface, summoned over --scrim (RULED LIGHT 2026-07-23)"
in_nav: "yes — Capture nav entry + ⌘N + the create-corner (CD-1)"
state: shipped
mockup: docs/studio/mockups/capture.html
shipped: v3.252
rounds: 1
---

## State

R-CAPTURE / THE DOOR is a **net-new unified surface** — SHAPE-B mockup delivered
2026-07-23, no build round has run yet (`rounds: 0`). The mission (r-capture-brief.md
v2): every way a thought enters Praxis — type, dictate, paste, upload — becomes ONE
fast, unlosable gesture instead of four bespoke UIs reinventing it. The locked
decisions are CD-1..6 (ruled 2026-07-18) + CA-1..3 (ruled 2026-07-23, the R-SHELF-
inherited carrying-question-authoring seam). This file did not exist before this
mockup session — created now per explicit instruction, not an append-only violation
(no prior ledger content to preserve).

## Current-surface structure (the four source UIs this round unifies)

**1 — Notebook writeline** (`buildNotebookWriteline`, js/views.js:3030-3239;
`captureNote`, :3434-3469). Inline composer, NOT a sheet/modal — mounted at the top
of the notebook's left leaf. Anatomy: auto-growing `<textarea class="nb-ce">`
(placeholder "Write a note…") → `.seg`/`.seg-opt` register chips (marginalia ·
question · journal, default marginalia unless the Journal tab is active) → `.crow`
(chips + spacer + a `.btn.btn-primary` "Capture" button) → `.nb-modes` labeled
"or bring one in" row (photo/library stage inline; paste/import/dictate hand off to
`window.ImportCapture.open()`). Commit-and-stay IS live here: `captureNote()`
re-renders the notebook and stays on the same tab (views.js:3467); the SAVE PULSE
(`.mo-savepulse`, applied at views.js:15704-15706) is the real precedent CD-5 lifts.
Fonts/tokens: `.notebook.lum-amber-deep` scope — `--lum-serif` field text 17px,
`--lum-ink-4` italic placeholder, gilded `.btn-primary` (Recipe 5). Responsive: no
sheet/card distinction — it's always inline, reflowing with the leaf.

**2 — Book-Detail "Add marginalia"** (`createWritingCanvas`, js/writing-canvas.js:
114-215). A `contenteditable` panel (`.wc-input`) mounted via `createWritingCanvas
(mountEl, opts) → handle` — substrate-agnostic per the writing-core contract. This is
the **tightest synchronous open→focus chain in the app** (the perf floor CD-2's
<400ms law is measured against). No register chips, no mode row — single-purpose.

**3 — ImportCapture overlay** (`window.ImportCapture`, js/import-capture.js:
400-476 `open`/`renderEntry`). A **centered modal**, not corner-anchored:
`.ic-overlay` (`position:fixed; inset:0; align-items:flex-start; padding:48px 18px`)
→ `.ic-panel` (`max-width:520px`, centered). States: entry (mic hero or type-note
hero + paste/upload pills) → processing (`.ic-orb` breathing spinner) → receipt
(book-grouped, progressive disclosure) → exception queue. Dictation machinery:
`recordAndTranscribe` (:1084) → `transcribeBlob` (:1030) → `processDictation`
(:1263), gated on `canRecord()` (:1008). Scrim click DOES close (js/import-capture.js
:409) — CD-5 deliberately overrides this for the unified door (see Forks).
`.lum-amber-deep` reskins it dark (components.css:10883-10911) — the OLD amber
overlay precedent CD-2's ground default deliberately does NOT reuse (see ground
OWNER row).

**4 — Onboarding act-margin** (`buildActMargin`, js/intros.js:263-277). A two-way
register toggle (`.ij-reg.is-m` / `.is-j`) + a bare `<textarea id="ij-noteta">`, one
"Keep this note" button. Writes through the SAME real `captureNote()` (`doNote`,
intros.js:330-338) — confirms the round's "one door, wired to real primitives" is
already the house style, just not yet unified in UI.

**Fragmentation this round closes:** 4 different open triggers, 3 different visual
containers (inline / contenteditable panel / centered modal), 2 different
"talk it through" fates (dropped from ImportCapture per views.js:3213's comment; not
replaced), and register/mode chips re-implemented with slightly different markup in
each of 3 of the 4 places.

## Decisions

| # | Decision | State (exists / partial / new) | Live DOM anchor |
|---|---|---|---|
| CD-1 | Two ruled corners ("+" bottom-left, flower bottom-right) | **partial** | Flower EXISTS: `.yumi-bloom` (components.css:19-58, AMB-1, 42px fixed bottom-right, z:9999). "+" door is **NEW** — closest live analog is the Shelf's page-scoped mobile FAB `.shelf-add-primary` (components.css:12890-12894), which is NOT global and not gilded. |
| CD-2 | Pre-rendered capture sheet, two sizes (quick text / expanded) | **partial** | No live corner-anchored sheet exists. Closest structural anchors: `.ic-overlay`/`.ic-panel` (centered modal, js/import-capture.js:400-412) and `createWritingCanvas` (synchronous focus chain, js/writing-canvas.js:114-140). Both are **NEW** as a unified two-size component. |
| CD-3 | Context-smart, never-silent (visible one-tap chip) | **partial** | Context-smart FILING exists (`captureNote`'s `filed`/`bookIds` branch, views.js:3441-3447) but is **invisible today** — no chip anywhere shows or lets the user change the target. The chip UI is **NEW**. |
| CD-4 | Talk-it-through = a seat only | **new** (with a dead precedent) | ImportCapture used to have a "talk it through with Yumi" mode; the R4 unified composer comment explicitly records it was **DROPPED** ("eval-gated; its own future round", views.js:3213). CD-4 reopens the seat, inert only. |
| CD-5 | Commit-and-stay + the save pulse ("filed to X · Undo") | **exists** (in one of the four) | `captureNote()` clears via re-render and stays on-tab (views.js:3463-3469); `.mo-savepulse` fires on the just-saved card (views.js:15704-15706, class defined assets/praxis-kit.css:61-62). The "· Undo" receipt text does **not** exist live anywhere — **new**. |
| CD-6 | One door, one component — the 5-mode set | **partial** | Every mode exists SEPARATELY: photo/library inline (views.js:3230-3231), paste/import/dictate hand off to ImportCapture (views.js:3226-3228), voice inside ImportCapture (:429-433). Photo/scan-as-a-SEAT does not exist (photo is fully wired live, not a placeholder) — this mockup deliberately treats photo as a seat **for this file only**, per the task's own instruction ("photo/OCR and scan modes are SEATS... per §7 non-goals"); the live app's photo capture is further along than that framing implies. Flagged as a scope note, not a fork (no collision — the instruction is explicit). |
| REGISTER | marginalia / journal / question, 3-way | **exists** | `buildNotebookWriteline`'s `defs` array (views.js:3090-3094) + `captureNote(register, ...)` (views.js:3434). Colors: `--marginalia-color`/`--journal-color`/`--question-color` (theme.css:428-430). |
| CA-1 | Carrying-question authoring on the desk, inline | **new** | The desk EXISTS (`renderShelfDesk`, views.js:5407-5445; `.desk-head`, views.js:4965-4974) with NO question row at all. The forward-act bridge ("Carry on the desk") has no live anchor anywhere — fully new, on both ends. |

## Data-source findings (build-time stand-ins)

- **No invented color was required.** Every hue the mockup uses resolves through a
  real live mechanism: the register family is the live `--marginalia-color` /
  `--journal-color` / `--question-color` triad (theme.css:428-430); the arc-context
  chip's hue is computed with the SAME hash-to-field-spectrum function as the live
  `arcFieldHue(arcId)` (js/views.js:5058-5066), reproduced verbatim in the mockup's
  `fieldHueForArc()`. **No BUILD-TIME color stand-in is flagged** — this is a
  genuine finding, not an omission.
- **The paste/import "matcher" is simplified.** Live, a multi-passage paste segments
  into several notes with book guesses via `segmentDoc()` + a review receipt
  (js/import-capture.js `runImport`/`renderReceipt`, :499-546). The mockup files a
  pasted blob as ONE raw note through the shared commit path instead of simulating
  that segmentation UI. This is a **build-time behavioral simplification**, not a
  data or color stand-in — RAW JOINS THE CORPUS holds either way, and the
  segmentation review UI is Lane 2 build detail, not a locked decision this mockup
  re-specifies. Live wiring path: `segmentDoc()` + `commitEntries()`,
  js/import-capture.js.
- **Voice transcription is simulated**, not calling any proxy (matches the <400ms /
  offline-safe law — the mockup never touches a network). Live wiring path:
  `recordAndTranscribe` → `transcribeBlob` → `processDictation`
  (js/import-capture.js:1084/1030/1263).

## Forks

- **FORK — scrim-click-to-close.** ImportCapture's live overlay closes on a scrim
  click (js/import-capture.js:409, `if (e.target === ov) { close(); }`). CD-5 rules
  "close is explicit (X / drag-down), never automatic" for the unified door — a
  direct behavioral collision with the surface it supersedes. **Resolution
  implemented in the mockup:** scrim click does NOT close; it nudges the veil
  (a brief darken-flash, reduced-motion-safe) as a legible "that's not how you close
  this" cue instead. This is a genuine CD-5-vs-precedent collision, not a mechanical
  call — **written here as the FORK row for Preston**, per FORK-VERBATIM. The
  build round should re-confirm this resolution before wiring it over the live
  ImportCapture behavior.
  - **RULED (Preston, 2026-07-23, by sight): CD-5 explicit-close as built.** The
    unified door does not close on scrim-click; the build wires this override over
    ImportCapture's `if (e.target === ov) { close(); }` (import-capture.js:409).

## OWNER felt-call rows — RULED BY PRESTON (2026-07-23, mockup felt pass = PASS)

- **Ground — RULED: LIGHT as built.** The sheet is a LIGHT working surface (paper
  tokens) over `--scrim`; the warm-dim alternative is retired. Build to light.
- **Scrim-click — RULED: CD-5 explicit-close as built.** The unified door does NOT
  close on scrim-click (nudge-the-veil), overriding ImportCapture's live behavior.
  The Fork below is resolved to CD-5; the build wires the override.
- **CD-2's two-size sheet — RULED: STANDS.** The two-size shape (bottom sheet ≤759 /
  corner card ≥760) is accepted. **DEFERRED CHECK: the true 390 bottom-sheet felt
  verdict is taken at the FINAL live pass on Preston's actual phone** — carried as a
  stated check in the final felt script (not re-opened before then).
- **"Carry on the desk" — RULED: STANDS as shown (NOT a second door).** The
  forward-act bridge is accepted; desk-only-authoring fallback is not needed.

## Completeness inventory (9 rows — docs/studio/acceptance-card.md:138-148)

| # | Anatomy | Verdict |
|---|---|---|
| 1 | Ground | SHOWN — the app-frame's light Book-Detail-lite backdrop + the always-dark nav/corners + the light capture sheet over `--scrim`, all real token values, no placeholder gray boxes. Evidence: capture.html `.app-body`/`.app-nav`/`.capdoor-sheet` blocks. |
| 2 | States | SHOWN — sheet closed/open, note/voice/paste/photo-seat/scan-seat modes, quick vs expanded sub-size, register×3, context chip×4 targets (inbox/2 books/1 arc), mic idle/listening/transcribing/filled, commit empty-guard (no-op on blank), toast shown/dismissed/undo, desk question empty/authored/editing, carry-bridge direct + replace-confirm. Distribution-skew: the desk shows 6 covers + a "+2 more reading →" door (8 reading books total) specifically to stress CA-1's coexistence risk. Evidence: capture.html JS state machine (`setMode`/`commit`/`renderDeskQuestion`). |
| 3 | Controls | SHOWN — every visible control is wired: both corners, nav entry, ⌘N, mode chips, register segmented control, context chip + picker, mic, upload (real `FileReader`, no network), commit, Undo, X close, drag-handle-to-dismiss, desk question tap-to-edit + clear, bridge overflow menu + carry + replace/cancel. Two are deliberately INERT-by-design (talk-it-through seat, photo/scan seat cards) — static-by-design, not broken. |
| 4 | Widths | SHOWN — real breakpoint (759/760, matching the app's own divide): bottom sheet ≤759, corner-anchored card ≥760. Walked by resizing the live file at 390 / 1280 / 1920 (no XL-tier logic needed — the component anchors, it doesn't reflow columns). |
| 5 | Motion | SHOWN — scrim fade, sheet slide/scale-in, drag-to-dismiss, mic pulse + EQ bars, save-pulse (`.mo-savepulse`, verbatim keyframes), toast slide. Reduced-motion: both the real `@media (prefers-reduced-motion: reduce)` query AND a manual `html.force-reduced-motion` toggle (mockbar button) so it's verifiable without an OS setting change. |
| 6 | Marks | SHOWN — register dots (marginalia teal / question indigo / journal violet) legible on the light sheet AND in the caught-list/desk contexts; the arc-context chip's field-spectrum dot; the ember + arc-thread marks on the desk's cover art (real live classes, real tokens). |
| 7 | Text | SHOWN — zero lorem/filler. Real-register sample content: a marginalia line ("the wound is a place where light enters…"), a journal-toned voice sample, a question ("Is dignity something a system can design for…"), 6 distinct real book titles/authors on the desk not reused from any other mockup file in this repo. |
| 8 | Seams | SHOWN — the CD-1 nav entry + ⌘N (into the door); the Book-Detail "✎ Add marginalia" button (a real seam INTO the door, pre-associating context); the CA-1 bridge (a seam OUT of a filed note, back into the desk); the photo/scan seats (explicit sockets for SCAN, not built here); the talk-it-through seat (explicit socket for YG, not built here). |
| 9 | Behaviors | N/A-OWNED (net-new surface — there is no prior "capture" surface behavior set to preserve/retire; ROW 9 governs evolving an EXISTING surface's behaviors, which does not apply to a first build). The four SOURCE surfaces' relevant behaviors (commit-and-stay, register chips, dictation, scrim-click-close) are individually addressed above (Decisions table + the scrim-click FORK) rather than as a single Behaviors row. |

## Elevation self-score (6 axes, 0-3 each, max 18 — docs/studio/acceptance-card.md:87-96)

| Axis | Score | Evidence |
|---|---|---|
| Fidelity | 3 | All 7 locked decisions (CD-1,2,3,4,5,6,CA-1) + REGISTER are shown and interactive; the one collision (scrim-click) is resolved-and-flagged, not silently dropped. |
| Craft | 3 | Every color/radius/shadow/spacing value is a named token lifted from theme.css/lumen-amber.css/praxis-kit.css/universal-depth.css (grep-provable, see Token wiring proof below); real class-name/CSS grammar reused verbatim where a live precedent exists (`.desk-head`, `.cavity-cover`, `.mo-savepulse`, the shelf-manage-sheet bottom-sheet pattern). |
| Motion | 3 | MO-1 durations/easings throughout (`--dur-fast`/`--dur-gentle`/`--ease-standard`/`--ease-emphasis`); the save-pulse keyframes are byte-identical to `assets/praxis-kit.css:61-62`; reduced-motion verified via both the real media query and a manual toggle. |
| Quiet | 3 | One primary gilded action per view (the commit button); seats are visually recessed (dashed, muted `--ink-3`) rather than competing; the mode row uses the existing quiet-chip dialect, not a new one; annotation chrome (blue) is categorically separated from app chrome so it never reads as UI noise. |
| Responsive | 3 | Real 759/760 divide (not invented); bottom-sheet grammar mirrors the shipped `.shelf-manage-sheet` (safe-area, 82-86vh cap, translateY slide); corner-anchored card verified independent of viewport width ≥760 (1280 and 1920 render identically, as intended — a popover, not a layout). |
| Function | 3 | Every claim above is a real DOM/JS effect, not a static screenshot: commit actually clears the field and appends to the caught list; Undo actually restores it; the desk question actually persists across edit/clear cycles within the session; the carry-bridge actually triggers the replace-confirm branch when a question is already carried. |

**18/18.** Per the elevation-loop protocol this ships to Preston as-is (no axis below 3 to improve) — the felt pass is what actually judges it; a full mockup score is a passed floor, not a shipped look (OWNER-VIEWPORT PRIMACY, CLAUDE.md).

## Gap ledger

- **F4 · CD-6 UNIFICATION — staged retirement IN PROGRESS (ruled 2026-07-23).** The new
  door shipped ADDITIVE; the legacy bespoke doors are being retired one surface per stage,
  one felt pass each. **Stage 1 SHIPPED (2026-07-24, v3.254):** `buildNotebookWriteline` is
  RETIRED — the Notebook leaf now opens the shared door via `buildNotebookCatchAffordance`;
  the writeline's photo capture MIGRATED into the door's photo mode (existing plumbing:
  `nbDownscaleImageToBlob → nbPhotoIdbPut → captureNote(images)`, no new write surface).
  **Stage 2 SHIPPED (2026-07-24, v3.255):** the Book-Detail **CREATE** composer retired — the
  "✎ Add marginalia" button opens the shared door pre-targeted to the book (register default
  marginalia, NOT locked — a question about a book is a valid capture); the book page's marg list
  refreshes on commit, GUARDED so it never tears down an open inline editor/picker. Census-ruled
  plain (his marginalia 0/11 on every formatting feature); `createWritingCanvas` UNTOUCHED (shared)
  and the ✎ EDIT pencil kept (FORK 2 — edit is not capture; deferred until F2). **THREE doors →
  the shared door + TWO remaining legacy:** window.ImportCapture · onboarding buildActMargin.
  Next stages (order): ImportCapture (segment handoff / DOOR-SEG) → onboarding. HALT per stage.
  The R-CAPTURE round does NOT close until CD-6 is complete or explicitly re-scoped. Records:
  `docs/checkpoints/cd6-{notebook-writeline,book-marginalia}{,-recon}.md`.
- **DOOR-SEG (F1) — debt, follow-on lane.** A multi-note blob paste files as ONE raw
  note (the door has no `segmentDoc` step — mockup-deferred, unbuilt). Deserves a
  segmentation handoff: route the paste through the ImportCapture pipeline
  (`segmentDoc` + review) or offer a split. Not this push.
- **F2 — note-detail readability (PRE-EXISTING, un-owned by R-CAPTURE).** `renderNoteSurface`
  (js/views.js ~15500–15610): serif ink barely readable on the dark-amber ground +
  invisible back-link. Opened as its own named task. NOTE folded in (F3 wording): align
  the note-detail's "Unfiled — not filed to a book" label (js/views.js:15605) to
  "In the Inbox — not yet filed to a book" so it agrees with the door's "Filed to Inbox".
- (The pre-existing `import-capture.md` ledger's REWORK/FIX/ADD items still stand.)

## Round history

- **2026-07-23 — SHAPE-B mockup delivered.** `docs/studio/mockups/capture.html`
  built against r-capture-brief.md v2 (CD-1..6 + CA-1..3), Universal token sheet +
  `universal-depth.css` v1.2, and the four source UIs read as Stage-A material
  (buildNotebookWriteline/captureNote, createWritingCanvas, ImportCapture,
  buildActMargin). One fork surfaced (scrim-click-to-close vs CD-5), resolved in
  the mockup and flagged verbatim for Preston. Four OWNER rows reserved (ground,
  CD-2 two-size felt test, CA-1 tap-grammar felt test, carry-as-second-door
  fallback). Self-score 18/18; completeness inventory 8 SHOWN + 1 N/A-OWNED, zero
  MISSING.
- **2026-07-23 — MOCKUP FELT PASS = PASS (Preston, by sight).** State flipped to
  `shaped`; `mockup:` frontmatter line set. Rulings recorded (OWNER rows + Fork):
  ground = LIGHT as built · scrim-click = CD-5 explicit-close as built · CD-2
  two-size stands · "Carry on the desk" stands (not a second door). The true 390
  bottom-sheet felt verdict is DEFERRED to the final live pass on Preston's actual
  phone (carried as a stated check in the final felt script). Mockup + ledger +
  acceptance card committed locally as the build spec; the continuous four-lane
  build is authorized (self-run law — no mid-run halt, nothing pushed).
- **2026-07-23 — THE DOOR SHIPPED (additive), v3.252.** Four lanes built as one
  continuous self-run (Lane 1a door · Lane 1 CA-1 · Lane 2 voice · Lane 3 share_target
  · Lane 4 hardening) + 5 gate-fix rounds (1 reviewer + 4 red-team passes; the
  cross-account/auth-switch async surface closed to grep-confirmed completeness — timers
  cleared · mic seq-guarded · FileReader exact-owner-guarded). Preston's felt pass #1 on
  his REAL library ruled every finding: F1 designed one-note (→ DOOR-SEG debt) · F2
  pre-existing (own task) · F3 closed/never-silent (+ wording NOTE) · F4 gap → CD-6
  staged unification is the round's next phase · corner 18px stack kept · snapshot
  skipped (felt pass exercised the real library). Build commits `cd100e7..` ; shipped at
  the push-point commit (sw v3.252, this commit). Records: `docs/checkpoints/r-capture-*`.
- **2026-07-24 — CD-6 STAGE 2 SHIPPED: Book-Detail Add-marginalia CREATE retired (v3.255).**
  The census ruled the rich editor unused (his marginalia 0/11 on every formatting feature), so a
  surgical change: the "✎ Add marginalia" button opens the shared door pre-targeted to the book
  (`openCaptureDoor({targetKey:bookId})`, register default marginalia NOT locked — FORK 3), and the
  book page's marg list refreshes on commit (route-gated). `createWritingCanvas` + the ✎ EDIT pencil
  UNCHANGED (FORK 2, deferred to post-F2). Data shape identical (11-field, `body` markdown, same
  `wcRenderMarkdown`); no new write surface; photo additive via the Stage-1 pipeline. **Stage-2
  red-team caught + FIXED a real BLOCK** — the book refresh tore down `#app` and would destroy an
  open inline editor/picker; a `capBookPageHasOpenInline()` guard skips the refresh while one is
  open (note still files, surfaces on close); RE-CONFIRMED BLOCK-CLEARED (exhaustive 3-host writer
  audit). Preston felt pass = PASS. Byte-locks untouched (marks/lumen-amber MD5, writing-canvas.js
  not in diff). Follow-ons: **CD6-NBK-REFRESH-GUARD** micro-lane (same guard for #notebook, v3.256,
  next) + **PHOTO-PLACEHOLDER** polish. Records: `docs/checkpoints/cd6-book-marginalia{,-recon}.md`.
- **2026-07-24 — CD-6 STAGE 1 SHIPPED: the Notebook writeline RETIRED (v3.254).** FORK B
  (Preston-ruled): `buildNotebookWriteline` + its helpers removed (−8,168 B views.js); a quiet
  `buildNotebookCatchAffordance` in the leaf opens the shared door (`openCaptureDoor`,
  tab-scoped: book tab → `targetKey`, Journal tab → `register:'journal'` via additive
  `opts.register`). PHOTO migrated into the door's photo mode (existing plumbing only; no new
  write surface — `captureNote(images)` already existed). Ruling #5: a door commit on
  `#notebook` refreshes the leaf; `noNav` keeps `notebookActiveTab` (HOLD-2). Guards singular,
  grep-provable. Stage-2 red-team caught + FIXED a same-account double-write race (an auth-reset
  ungated `capCommitBusy` release — the class the last 3 gate-fixes hardened); both releases now
  gen-gated, RE-CONFIRMED BLOCK-CLEARED. Live-verified on the rig (affordance, register default,
  targetKey, mode walk, photo→IndexedDB, leaf refresh, HOLD-2, 390+1360, console clean). Preston
  felt pass = PASS. Records: `docs/checkpoints/cd6-notebook-writeline{,-recon}.md`.

## Next

- **CD-6 UNIFICATION (F4) — IN PROGRESS.** ✅ **Stage 1 (Notebook writeline) v3.254 · Stage 2
  (Book-Detail Add-marginalia CREATE) v3.255 — both SHIPPED.** Remaining: **ImportCapture next**
  (segment handoff / DOOR-SEG), then onboarding act-margin. One felt pass each, HALT per stage.
  The round closes only when this is complete or re-scoped.
- **CD6-NBK-REFRESH-GUARD (micro-lane) — Preston-scheduled IMMEDIATELY after v3.255, BEFORE Stage 3.**
  The Stage-1 `#notebook` door-commit refresh (`renderNotebook()`) has the same unconditional `#app`
  teardown Stage 2 just guarded on the book page — a live destroys-open-work bug (an open notebook
  inline editor / gather name-canvas is torn out by a ⌘N/nav door commit). Apply the same
  `capBookPageHasOpenInline`-class guard to the notebook's inline-mount hosts. Own Stage-0 inline-host
  audit → guard fix → parse + element-identity verify → red-team confirm → HALT. Guard, not a surface
  change → felt-skip. Ships **v3.256** on Preston's word. Ahead of ImportCapture.
- **PHOTO-PLACEHOLDER (polish, own future lane — NOT this stage/micro-lane).** The "photo not on this
  device" state (`buildNotebookShot`, views.js ~2946) renders a full-size empty slab dominating the
  note card; it should collapse to a compact one-line chip. Pre-existing presentation, cosmetic.
- **DOOR-SEG** (multi-note paste segmentation) — follow-on lane.
- Post-push live-smoke: real dictation · paste · Android share · the 390 phone pass · the
  auth-switch reset branches (numbered PASS/FAIL, delivered with the push).
