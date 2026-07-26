---
surface: capture
route: "overlay (BUILT — global, body-mounted; summonable over any route)"
render_fn: "BUILT — buildCaptureDoor/initCaptureDoor/capOpen (js/views.js door module, the new unified door) + buildNotebookCatchAffordance (the Notebook leaf's door into it). CD-6 retired three legacy doors — writeline (Stage 1, v3.254) · Book-Detail Add-marginalia CREATE (Stage 2, v3.255) · window.ImportCapture (Stage 3, v3.257). **CD-6 CLOSED at three (2026-07-25 ruling):** onboarding buildActMargin ruled NOT a CD-6 door (beat 6 of the first-run journey, one caller, already writes through the sole-writer captureNote); its UI-unification is an ONBOARDING-round item under OB L-1 (held future-state). (createWritingCanvas stays — shared; its ✎ EDIT path is kept, deferred until F2.)"
ground: "light working surface, summoned over --scrim (RULED LIGHT 2026-07-23)"
in_nav: "yes — Capture nav entry + ⌘N + the create-corner (CD-1)"
state: closed
mockup: docs/studio/mockups/capture.html
shipped: v3.252
rounds: 1
---

## State

**ROUND CLOSED (2026-07-25) — v3.252 → v3.259. See "## R-CAPTURE — ROUND CLOSED" below for the
acceptance card, the felt-pass ledger (actual shape), the debt ledger, and what the round did NOT
prove.** The narrative in the rest of this section is the MOCKUP-SESSION record (the `rounds: 0`
era) and is kept for history; the surface has since shipped and the round has closed
(`state: closed`, `rounds: 1`).

R-CAPTURE / THE DOOR is a **net-new unified surface** — SHAPE-B mockup delivered
2026-07-23, no build round has run yet (`rounds: 0`). The mission (r-capture-brief.md
v2): every way a thought enters Praxis — type, dictate, paste, upload — becomes ONE
fast, unlosable gesture instead of four bespoke UIs reinventing it. The locked
decisions are CD-1..6 (ruled 2026-07-18) + CA-1..3 (ruled 2026-07-23, the R-SHELF-
inherited carrying-question-authoring seam). This file did not exist before this
mockup session — created now per explicit instruction, not an append-only violation
(no prior ledger content to preserve).

## R-CAPTURE — ROUND CLOSED (2026-07-25)

Closed on Preston's rulings at the Stage-0 acceptance gate (close-out session). The felt passes
were GIVEN but had lived only in chat — landed here now, in their **actual shape**, not a
flattened verdict. Draft class same as the OB brief: given ≠ landed.

### Acceptance card (brief `r-capture-brief.md`, walked law by law)

| Law | Verdict | Evidence |
|---|---|---|
| CD-1 two corners + nav + ⌘N | **MET** | `capCreateDoor` views.js:23893 · Bloom flower (AMB-1) · Capture nav :23895 · ⌘N :23928; v3.252 |
| CD-2 pre-rendered two-size sheet | **MET** | `capOpen`/`buildCaptureDoor` :23110/:23730; two-size shipped v3.252. **390 bottom-sheet geometry PROVEN by the iPhone felt passes** (Preston, close ruling) |
| CD-3 context-smart, never-silent chip | **MET** | never-silent context chip v3.252; felt #1 ruled F3 |
| CD-4 talk-it-through = inert seat | **MET (inert)** | `#capTalkSeat` "arrives with the YG round" ~:23789 |
| CD-5 commit-and-stay + save pulse | **MET** | `capCommit` :23343; scrim explicit-close ruled; v3.252 |
| CD-6 one door, unify 4 sources | **MET (closed at 3)** | writeline v3.254 · book-marg v3.255 · ImportCapture v3.257; 4th (onboarding `buildActMargin`) ruled not-a-door (`bc0de4d`) |
| CA-1 carrying-question on desk + bridge | **MET (built)** · tap-grammar felt PENDING | shipped v3.252; tap-grammar felt verdict owed → debt ledger |
| CA-2 failure law | **PARTIALLY MET** | core MET (draft-persistence gate + raw-joins-corpus, DOOR-SEG verified); **offline sub-clause UNVERIFIED — the offline path was never exercised**; the pending-chip affordance is the NOT-MET LAW row below |
| CA-3 workshop seat inherited | **MET as seam · wiring DEFERRED (by design)** | reserved comment-only per DWF-1 (views.js:11761); "the Room seam (CA-3)…deliberately absent" (:22987); in-Room door is D4's build |
| LAW `<400ms` local-first | **UNVERIFIED** | engineered (recon §9: no pre-keystroke async; pre-rendered sheet); no post-build measurement, no instrumentation |
| LAW ⌘Enter commits / Enter newline | **MET (impl) · exercise UNVERIFIED** | views.js:23867 (`(meta\|\|ctrl)+Enter→capCommit`; plain Enter → newline by fall-through); no recorded real-input firing |
| LAW offline pending chip | **NOT MET (not built)** | grep of `js/` for `navigator.onLine`/offline/`capPending` = empty; the disclosure chip does not exist |
| LAW raw joins corpus | **MET** | DOOR-SEG children-verified-then-parent-deleted under CA-2 (cd6-importcapture.md red-team CLEAN); persistence gate |
| LAW F-B forward acts | **MET** | CA-1 "Carry on the desk" + DOOR-SEG "Split into N?" are forward acts; delete terminal |

No CD/CA graded NOT MET. CA-2 is partial (offline sub-clause UNVERIFIED); the offline pending chip
is a NOT-MET LAW, carried as debt (`CAPTURE-OFFLINE-CHIP` + `CAPTURE-OFFLINE-UNEXERCISED`).

### Felt-pass ledger (actual shape — passes were given, landed here)

- **v3.252 THE DOOR** — felt PASS #1 on Preston's real library (ruled F1–F4).
- **v3.253 mobile-sheet** — felt-TRIAGE: originated from Preston's real-iPhone paste screenshot (the
  L18 specimen). It exercised **PASTE mode only**; it did NOT walk all five door modes → **not
  upgraded to a clean PASS**, and `MOBILE-ALLMODES-WALK` is owed (debt). (Upgrading it would violate
  the very lesson the round wrote — L18, "walk every mode.")
- **v3.254 writeline** — felt PASS.
- **v3.255 book-marg** — felt PASS.
- **v3.256 refresh-guard** — felt-SKIP (Preston-ruled; guard/wiring).
- **v3.257 ImportCapture + DOOR-SEG** — **NOT a clean standalone pass.** Real iPhone: full flow PASS
  (paste → file → split into 3 → file-3 → undo toast; LLM segmentation and question auto-flag
  verified working). Desktop: per-child book chip **FAILED** (dead click) + review-panel h-scroll.
  **The desktop leg was closed by v3.258.** The record shows the failure, not a laundered pass.
- **v3.258 SPLIT-POP fix** — desktop PASS confirmed by hand: book chip flips up visible near the
  fold, click-outside closes, phone re-tap fine. **This is what closes CD-6 Stage 3 end-to-end.**
- **v3.259 F2** — desktop PASS: light ground with readable serif, long marginalia un-clamped, gold
  back-link returning to the notebook, new Inbox wording. **Not walked: Edit-open and the 390 pass.**
- **`ce277e7` / `bc0de4d` / `aa57ad5`** — felt-SKIP (hook / docs / Builder — no app surface).

### Debt ledger (R-CAPTURE close — landed, not merely reported)

| Item | Sev | One-line | Lives · owner |
|---|---|---|---|
| R1 SPLIT-POP-DOUBLE-CLIP | LOW | flip-up checks only room-below; degenerate short-body could flip unreachable; no data loss | cd6-split-pop-fix.md:39 · SCAN round / split micro-lane |
| SPLIT-HSCROLL | HELD | desktop h-scrollbar on the review; not reproduced with synthetic content | sequence.md · blocked on Preston's triggering note |
| SPLIT-FOCUS-MODE | LOW-MED | 3+-child review pushes Accept below the fold (reachable via scroll); hiding composer chrome would remove the scroll | cd6-importcapture.md:141 · Preston felt call |
| MARG-CREATE-DEAD | LOW | unreachable Stage-2 create leftover (`openMarginaliaEditor` create branch, views.js:14577) | cd6-importcapture.md:119 · cleanup lane |
| DEAD-VOICEINPUT | LOW | `voice-input.js` (5,796 B) dead but still `<script>`-loaded (index.html:83) | cd6-importcapture-recon.md:169 · cleanup lane |
| PHOTO-PLACEHOLDER | LOW | "photo not on device" renders a full-size empty slab; should collapse to a chip (`buildNotebookShot`) | capture.md gap ledger · polish lane |
| GATHER-PICKER-DONE-NOOP | **MED** | gather "Choose an arc" picker's Done is a genuine no-op (`onDone:function(){}`, no internal close) — a dead button | capture.md round history · own felt-passed fix lane |
| DEAD-JOURNAL-EDITOR | LOW | `openJournalEditor` + `#notebook-editor-host`: zero callers, host created empty | capture.md Next · cleanup lane |
| NOTE-IMG | **MED** | note-detail renders no attached photos (`renderNoteSurface`) — silently dropped | f2-note-detail-recon.md:61 · note-detail/canvas lane |
| CANVAS-NO-SHELL | LOW | the writing canvas mounts with no visual frame on note-detail + book-detail; `#book-detail-editor-host` carries a layout-only rule; pre-existing on both, independent of F2 | canvas/shell round |
| NOTE-PAGE-FLOOR | LOW | note-detail ends abruptly — ~2/3 of the viewport empty below the provenance block, where the book-detail sibling has grid structure | note-detail lane |
| REGISTER-GRAMMAR-SPLIT | LOW | register is a chip with a gold left rule in the notebook list but plain mono text on note-detail; the timestamp drops its time | note-detail lane |
| MOBILE-ALLMODES-WALK | **MED** | a 390 walk of all five door modes (note · voice · paste · photo · scan) is owed — v3.253 walked paste only (L18) | next round touching capture |
| CAPTURE-OFFLINE-CHIP | LOW | the offline disclosure affordance ("pending" chip) is not built; deferred debt | next round touching capture |
| CAPTURE-OFFLINE-UNEXERCISED | **MED** | the offline capture path was never exercised at all; "data-safe by local-first construction" is an inference we have never tested — same class as the `<400ms` UNVERIFIED grade | next round touching capture · task = exercise the offline path |
| CA-1-TAPGRAMMAR-FELT | PENDING | the desk carrying-question tap-grammar (the round's riskiest ambiguity) was never felt | next round touching the desk |
| OB-DOOR | ROUND-GAP | onboarding door UI-unification into the shared door, gated behind OB L-1 | onboarding.md:33 · ONBOARDING round |
| OB-BRIEF-UNLANDED | ROUND-OPEN | the OB brief does not exist yet (dependency) | onboarding.md:40 · ONBOARDING round |
| REACH-MAP-TIEBREAK | LOW | the Builder reach-map gap-cap tie-break is arbitrary among gap-0 surfaces (meaningful at the top, arbitrary at the bottom); pre-existing, not the parser fix's | gate 2026-07-25 · Builder/tooling lane |
| C2-BYTE-IDENTITY-CONTINGENT | LOW | Builder NOW-parser byte-identity holds for current content only; exact trigger below | gate 2026-07-25 · close-out ledger / future Builder change |
| GATE-HARNESS-FIDELITY | NOTE | the parser gate replicated the reach-map cap with `gapcount` (returns 0 for any name) instead of the Builder's real `qgap`-on-`$SURFACES`, producing confident-but-wrong numerics (the "8→7" / "`various` enters"); same proxy-assertion class as L19 but aimed at a HARNESS not a UI — a verification harness must exercise the real code path, not a look-alike | gate 2026-07-25 · verification-harness discipline (lesson-note, not a lane) |
| B3-SMOKE-WIRING | **MED** (tooling) | auto-guard's B3 smoke stage skipped honestly (no automated smoke exists); follow-on = build one | auto-guard.md:80 · tooling lane |

**Open questions — STAY OPEN (deliberately NOT answered in a closing session; owner = next round touching the notebook):**
- **`#note/<id>` route promotion** — unlocked by F2; recorded report-only (f2-note-detail.md §"#note/<id> route", recon §8). A product call, left as a question.
- **split-after-door-closes discoverability** — how does a user find a pending split review once the door closes? A product call, left as a question.

### What this round did NOT prove (read before assuming)

UNVERIFIED grades — implemented ≠ verified:
- **`<400ms` local-first** — engineered (no pre-keystroke async, pre-rendered sheet); never measured post-build.
- **⌘Enter commits / Enter newline** — implemented (views.js:23867); never exercised by a recorded real-input test.
- **the offline path** — never exercised at all; "data-safe by local-first" is an inference we have not tested (`CAPTURE-OFFLINE-UNEXERCISED`).

Un-walked felt legs:
- v3.257 desktop before v3.258 (failed → closed by v3.258).
- v3.259 F2: Edit-open + the 390 pass.
- CA-1 desk carrying-question tap-grammar (the round's riskiest ambiguity) — never felt.
- All-modes 390 walk (note · voice · paste · photo · scan) — only paste was walked (`MOBILE-ALLMODES-WALK`).

### Corrections landed with this close (gate 2026-07-25)

- **"Reach map 8→7" was a gate artifact — record the MECHANISM, never a number.** The Builder reach
  map renders **only real `$SURFACES`**: it is the union of the Now/Next moves' `touches`, but the cap
  is keyed on `qgap` (the `$SURFACES` gap map), so **non-surface touch-tags — `scan`, `shelf`,
  `various`, `views`, `yumi-brain` — never appear on it** (their `qgap` is empty, so the cap drops
  them). Mechanism: filtering closed `[x]` rounds out of `## Now` drops the real surfaces they carried,
  so a closed round's surfaces leave — **`notebook` left because R-CAPTURE was its only carrier**. After
  this close the map is the **6 rendered surfaces**: Shelf (books) · Arc interior (arc-detail) · Account ·
  Yumi panel · Import & capture · Profile. (The earlier "8→7"/"8→8" figures and the "`various` enters"
  claim were the parser gate replicating the cap with `gapcount` instead of `qgap` — see
  `GATE-HARNESS-FIDELITY` in the debt ledger. Mechanism, not numbers.)
- **`C2-BYTE-IDENTITY-CONTINGENT`** — the Builder NOW-parser's "Next/Then/Shipped/Discovered
  byte-identical to the pre-fix parse" holds for **current content only.** Exact trigger: any future
  item in those four sections carrying a backtick-bracket `` `[…]` `` with **no `touches:` line** —
  C2 will populate `touches` from it where the old parser left it empty (enriches the reach map;
  never drops, duplicates, or reorders an item).

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
  and the ✎ EDIT pencil kept (FORK 2 — edit is not capture; deferred until F2).
  **Stage 3 SHIPPED (2026-07-25, v3.257):** the **ImportCapture overlay is RETIRED** — it was already
  orphaned (0 live `.open()` callers since Stage 1); the overlay UI + its dictation UI + `commitEntries`
  + `buildBookSearch` deleted, the segmentation pipeline + transport kept HEADLESS (window.ImportCapture
  namespace kept). **DOOR-SEG PAID:** the door's paste files raw-as-one, then offers "Split into N?" — a
  forward act (file-raw-first, Option A) that runs `segmentDoc` on the filed note and writes N children
  via a `captureNote` batch-loop under CA-2 ordering (children verified-then-parent-deleted; undo re-files
  the parent first). **CD-6 CLOSED at three doors (2026-07-25, Preston-ruled Option 1 — RE-SCOPE at the
  S4-0 recon abort-gate).** The fourth candidate, onboarding **buildActMargin** (intros.js:263), is ruled
  **NOT a CD-6 door**: it is beat 6 of the 8-beat first-run journey overlay (one caller, `renderStep`
  intros.js:379), not a summonable capture component, and it **already writes through the sole-writer
  `captureNote`** (via `doNote`, intros.js:337) — there is no bespoke write path to unify and no door to
  retire. Unifying its *UI* into the shared door (open the real door instead of the bespoke `.ij-noteta`
  beat) would re-choreograph a felt-passed narrative beat + add a door-core completion opt, gated behind
  **OB L-1** (held future-state) + a non-existent OB brief — an **ONBOARDING-round item, NOT CD-6 debt**
  (logged in `onboarding.md`). Records:
  `docs/checkpoints/cd6-{notebook-writeline,book-marginalia,importcapture,onboarding}{,-recon}.md`
  (onboarding = recon-only, no build).
- **DOOR-SEG (F1) — ✅ PAID (2026-07-25, v3.257, CD-6 Stage 3).** The door's paste files raw-as-one,
  then offers "Split into N?" (local heuristic-gated: ≥1 blank-line break OR ≥280 chars; no LLM pre-tap)
  → `segmentDoc` on the filed note → a minimal caught-list review (per-note register flip + book chip fed
  by `candidateBooks` via the door's native capChip idiom) → accept writes N children via a `captureNote`
  batch-loop (CA-2 verified-then-delete). Raw joins the corpus by construction; proxy-down/failure keeps
  the parent untouched. Red-team CLEAN; 390 + desktop + all-modes gated.
- **F2 — note-detail readability (PRE-EXISTING, un-owned by R-CAPTURE).** `renderNoteSurface`
  (js/views.js ~15500–15610): serif ink barely readable on the dark-amber ground +
  invisible back-link. Opened as its own named task. NOTE folded in (F3 wording): align
  the note-detail's "Unfiled — not filed to a book" label (js/views.js:15605) to
  "In the Inbox — not yet filed to a book" so it agrees with the door's "Filed to Inbox".
- (The pre-existing `import-capture.md` ledger's REWORK/FIX/ADD items still stand.)

## Round history

- **2026-07-25 — CD-6 CLOSED at three: onboarding buildActMargin ruled NOT-A-DOOR (docs-only re-scope, no ship).**
  Preston-DIRECTED (Option 1 at the S4-0 recon abort-gate). The last CD-6 candidate is retired from the
  door-set **by ruling, not code**: `buildActMargin` (intros.js:263) is beat 6 of the 8-beat first-run
  journey overlay — one caller (`renderStep`), no nav/⌘N — and **already routes through the sole-writer
  `captureNote`** (via `doNote`, intros.js:337). It is "not a door in any component sense" (r-capture-recon
  §7); unifying its *UI* into the shared door would re-choreograph a felt-passed narrative beat + add a
  door-core completion opt, gated behind **OB L-1** (held future-state) and a non-existent OB brief — an
  ONBOARDING-round item, logged in `onboarding.md`, **NOT CD-6 debt**. **CD-6 door-set complete at three:**
  writeline v3.254 · book-marg v3.255 · ImportCapture v3.257. Docs-only, **no CACHE_VERSION bump**. Records:
  `docs/checkpoints/cd6-onboarding-recon.md`.
- **2026-07-25 — CD-6 STAGE 3 SHIPPED: ImportCapture RETIRED + DOOR-SEG PAID (v3.257).** Preston-DIRECTED
  (rulings + amendments at the Stage-0 HALT and HALT A/B). The overlay was already ORPHANED (git `-S`: 0 live
  `.open()` callers since Stage 1). **Stage A** deleted the overlay UI + its own dictation UI + `commitEntries`
  + `buildBookSearch` + `el()` (import-capture.js 66,681→22,038 B) and drove components.css to ZERO `.ic-` rules
  (incl. the pre-existing `.ic-trigger` remnant, condition-1 ruled); the segmentation pipeline + transport stay
  HEADLESS on the kept `window.ImportCapture`. **Amendment:** buildBookSearch retired (was keep) — the review uses
  the door's native capChip idiom fed by `candidateBooks`. **Stage B (DOOR-SEG, views.js +15,428 B / 278·0):**
  file-raw-first (capCommit untouched); a heuristic-gated "Split into N?" runs `segmentDoc` on the FILED note
  (gen-gated, owner-guarded), a minimal per-note review (register flip + book chip), accept via a `captureNote`
  batch-loop under **CA-2** (children verified → parent deleted; undo re-files parent first). L18 walk T1–T12 on
  the rig + 390/desktop/all-mode gates all PASS, console clean. **Red-team (Sonnet) CLEAN** — 7/7 BLOCK-CLEARED
  (stub-contract line-by-line, mid-loop kill, double-write, owner-change-during-loop=synchronous, sole-writer,
  Stage-A completeness); heuristic-false-fire = NOTE (non-destructive). Ships v3.257. Records:
  `docs/checkpoints/cd6-importcapture{,-recon}.md`. Named follow-ons: DEAD-VOICEINPUT · MARG-CREATE-DEAD ·
  CDSEG-NIT1/2 · SPLIT-FOCUS-MODE. **CD-6: ONE legacy door left (onboarding buildActMargin); round STAYS OPEN.**
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
- **2026-07-24 — CD6-NBK-REFRESH-GUARD micro-lane SHIPPED (v3.256).** The Stage-1 `#notebook` refresh
  gained the same teardown guard Stage 2 built for the book page (`capNotebookHasOpenInline()` — a door
  commit no longer closes an open notebook inline picker/panel). Recon reframed the severity to NOTE-tier
  (the one on-demand typed-text editor `openJournalEditor` is dead; the rest are selection pickers).
  Red-team caught a real BLOCK — the gather picker's no-op `onDone` never self-clears, which would stick
  the guard permanently true → **Option A: dropped the gather host from the guard** (its `onDone` bug →
  GATHER-PICKER-DONE-NOOP task); re-verified each of the 4 class + 2 id selectors individually, gather
  exclusion + normal path; RE-CONFIRMED BLOCK-CLEARED. Felt-skip (Preston-ruled), pre-authorized ship on
  green. Byte-locks untouched. Records: `docs/checkpoints/cd6-nbk-refresh-guard{,-recon}.md`.
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

- **R-CAPTURE ROUND CLOSED (2026-07-25).** `state: closed`, `rounds: 1`. The acceptance card, the
  felt-pass ledger (actual shape), the debt ledger, and "what this round did not prove" are in
  "## R-CAPTURE — ROUND CLOSED" above. Next surface in the sequence = **SCAN** (inherits THE DOOR's
  mode-set socket, CD-6). Everything below this line is carried debt / follow-on, owned per the debt ledger.
- **CD-6 UNIFICATION (F4) — ✅ CLOSED at three doors (2026-07-25, Option-1 re-scope).** Stage 1 (Notebook
  writeline) v3.254 · Stage 2 (Book-Detail Add-marginalia CREATE) v3.255 · Stage 3 (ImportCapture retire +
  DOOR-SEG) v3.257 — SHIPPED. The fourth candidate, onboarding `buildActMargin`, is ruled **NOT a CD-6
  door** (already on the sole-writer; UI unification → ONBOARDING round under OB L-1, see `onboarding.md`).
  (v3.257 still awaits Preston's live felt pass — felt-skip does NOT apply, that stage changed surfaces.)
- **CDSEG-SPLIT-POP-FIX — ✅ SHIPPED v3.258 (2026-07-25).** The desktop-only failure Preston felt (clicking a
  split child's book chip did nothing; iPhone worked): the picker pop opened DOWNWARD into the scrollable
  `.capdoor-body` overflow and clipped invisible when the chip sat near the fold. Fixed by flipping the pop UP
  when it won't fit below (Option A, scoped to `.capdoor-split-chipwrap` — door-core untouched). **Riders shipped
  with it: CDSEG-NIT2** (per-child chip-pop now has a document click-outside closer, leak-proof — open/close ×10
  net 0) + **CDSEG-NIT1** (dead `:first-of-type` selector → `.capdoor-split-head + .capdoor-split-row`). Red-team
  (Sonnet) CLEAN. Records: `docs/checkpoints/cd6-split-pop-fix.md` + `cd6-split-chip-desktop-recon.md`.
- **SPLIT-HSCROLL (named task).** A horizontal scrollbar Preston saw on the review at desktop — NOT reproduced
  with synthetic content (incl. long URLs, which wrapped); distinct from the pop-clip. Needs his exact triggering
  note to reproduce; candidate = a wide element with real data. Own lane.
- **R1 · SPLIT-POP-DOUBLE-CLIP (residual, named by the v3.258 red-team).** The flip-up checks only room below,
  never above; in a degenerate short-body case the pop could flip up unreachable. No data loss. Follow-on.
- **SPLIT-FOCUS-MODE (felt option).** A 3+-child split review pushes Accept below the fold (reachable via
  sheet scroll today); hiding the composer chrome during a review would remove the scroll. Preston's felt call.
- **CD6-NBK-REFRESH-GUARD (micro-lane) — ✅ SHIPPED v3.256.** `capNotebookHasOpenInline()` mirrors the
  book-page guard: the `#notebook` door-commit refresh is skipped while an inline picker/panel is open
  (4 self-clearing per-card hosts + 3 id hosts). Recon reframed the severity to **NOTE-tier** — the one
  on-demand typed-text editor (`openJournalEditor`) is dead, the rest are selection pickers. Stage-2
  red-team caught + FIXED a real BLOCK (the gather picker's no-op `onDone` never self-clears → would
  stick the guard true → **dropped the gather host from the guard**, Option A); re-verified each selector
  individually + RE-CONFIRMED BLOCK-CLEARED. Felt-skip (Preston-ruled). Records:
  `docs/checkpoints/cd6-nbk-refresh-guard{,-recon}.md`.
- **GATHER-PICKER-DONE-NOOP (named task).** The gather "Choose an arc" picker's "Done" is a genuine
  no-op — `openGatherArcPicker` passes `onDone: function(){}` (views.js:~2786) and `buildArcPickerPanel`
  has no internal close/Escape (unlike its book/subtheory siblings). A real UX bug (Done doesn't close
  the picker); deserves its own felt-passed fix lane. Surfaced by the v3.256 red-team.
- **DEAD-JOURNAL-EDITOR (named task).** `openJournalEditor` + `#notebook-editor-host` are a pre-existing
  orphan (zero callers — exhaustive grep). The host is created empty and never populated. A dead-code
  cleanup for its own lane.
- **PHOTO-PLACEHOLDER (polish, own future lane — NOT a micro-lane).** The "photo not on this device"
  state (`buildNotebookShot`, views.js ~2946) renders a full-size empty slab dominating the note card;
  it should collapse to a compact one-line chip. Pre-existing presentation, cosmetic.
- **DOOR-SEG** (multi-note paste segmentation) — follow-on lane.
- Post-push live-smoke: real dictation · paste · Android share · the 390 phone pass · the
  auth-switch reset branches (numbered PASS/FAIL, delivered with the push).
