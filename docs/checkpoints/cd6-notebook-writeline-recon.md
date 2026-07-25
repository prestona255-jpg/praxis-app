# CD-6 UNIFICATION · STAGE 1 (Notebook writeline) — STAGE 0 RECON

CD6-NB-WRITELINE STARTED · HEAD `77d0112` · CACHE_VERSION `praxis-v3.253` → ship `v3.254`
views.js baseline: **1,101,075 B** (git blob LF == working tree; 0 CR — pure LF, byte deltas clean)
Working tree: clean (no dirty tracked files).

Scope: retire `buildNotebookWriteline` on `#notebook`, route Notebook capture through the
shipped unified door. Read-only recon; ends at a HALT for the fork + register-default ruling.

---

## §1 — CAPABILITY INVENTORY: everything the writeline does today (parity contract)

Writeline = `buildNotebookWriteline(activeKey)` **views.js:3030–3343** (+ helpers
`appendWritelineChip` :3347, `buildNotebookModeChip` :3363; both writeline-ONLY).
Mounted once per render at `buildNotebookLeftLeaf` → **views.js:2347**
(`leaf.appendChild(buildNotebookWriteline(activeKey))`).

| # | Writeline capability | Door coverage | Verdict |
|---|---|---|---|
| C1 | Auto-grow `<textarea>` (`.nb-ce`), Write-a-note placeholder | `capField` autogrow (:23363) | **PARITY** |
| C2 | Register chips marginalia/question/journal (`.seg`) | `.capdoor-seg` 3-way (:23588) | **PARITY** |
| C3 | **Register DEFAULT = journal on Journal tab, else marginalia** (:3048) | Door **always** marginalia (`capSetRegister('marginalia')` every `capOpen`, :23427) | **FORK — Preston rules** |
| C4 | **Implicit target = the active tab** (marg/ques on a book tab → files to that book; inbox → Inbox; journal → journal) via `captureNote(...,activeKey)` | Door target = explicit chip; default Inbox unless `#book` route or `opts.targetKey` (:23423). `capOpen` already accepts `targetKey`. | **PRESERVABLE at call site** (pass `targetKey:activeKey` on book tabs) |
| C5 | **Photo + library IMAGE capture** — camera/library `<input>` → `nbDownscaleImageToBlob(1600)` → `stagedImages` → IndexedDB (`nbPhotoIdbPut`) → `note.images` refs (:3114–3189, commit path :3260–3315) | Door: **photo/scan are INERT SEATS** ("the socket is here / arrives with SCAN"); `capCommit` early-returns on photo/scan (:23484). **No wired image path.** | **REGRESSION — Preston rules (headline)** |
| C6 | "or bring one in" `.nb-modes`: paste/import/dictate → `window.ImportCapture.open()` handoff | Door has **native** Voice (wired dictation, :23759), Paste/Import (upload + paste field). Paste files as ONE note (DOOR-SEG debt, already logged) vs ImportCapture's `segmentDoc` multi-note. | **PARITY+ (door stronger)**, minus multi-note segmentation (pre-logged DOOR-SEG) |
| C7 | Commit: **Enter** files, **Shift+Enter** newline (:3317) | Door: **⌘/Ctrl+Enter** files, Enter = newline (:23671) | **BEHAVIOR CHANGE** (door = house grammar) |
| C8 | Draft: `nbDraft*` on key `praxis_nb_draft_<uid>_<activeKey>` (**per-tab**), owner-gated, 300ms debounce, blur + visibilitychange/pagehide flush | Door: same `nbDraft*` primitives, **fixed** key `praxis_nb_draft_<uid>_capture` (:23268), owner-gated, own flush hooks | **SAME GATE, DIFFERENT SLOT** — see §draft |
| C9 | Commit re-renders notebook + **follows the note to its tab** (`captureNote` 4-arg, `noNav` undefined → `renderNotebook()` + repoints `notebookActiveTab`, :3470–3474) | Door commits `noNav=true` → **never** re-renders or repoints (:23506) | **BEHAVIOR CHANGE** — see §seam |
| C10 | UX-3 double-commit debounce (`nbCommitBusy`/`nbLastCommitAt`, :3246) | Door: toast/caught-list; no equivalent needed (single button, no async image puts) | N/A (image-path specific) |
| C11 | `setNotebookComposing(true/false)` focus-recede chrome (:3325/3329; def :2978, **writeline-only caller**) | Door is an overlay; no notebook-chrome recede | **DROPS** (CSS partly inert already per R4 recon) |
| C12 | Commit fires `maybeDrawOut(id)` (Yumi move on a fresh visible note) | `captureNote` fires `maybeDrawOut` regardless of caller (:3476) | **PARITY** (shared in captureNote — NON-GOAL: no Yumi change) |

**Register-default answer (C3), with reasoning for the ruling:** the door is now the one
capture grammar app-wide and its *ruled* default is **marginalia** (mockup felt-pass, capture.md).
The writeline's journal-on-Journal-tab default was a tab-local nicety. It is preservable **without
a guard fork** by passing `register:'journal'` at the notebook call site when `activeKey==='journal'`
(a small additive `opts.register` on `capOpen`). Recommendation: **base default marginalia; Journal
tab passes journal.** Preston rules.

---

## §2 — SEAM MAP

**Render / reference sites of the writeline:**
- **Only mount:** `buildNotebookLeftLeaf` → views.js:2347 (call count = 1).
- Helpers `appendWritelineChip` / `buildNotebookModeChip` referenced ONLY inside the writeline
  (3107, 3226–3231). `setNotebookComposing` (2978) called ONLY by the writeline (3159/3325/3329).
  `buildNotebookInboxEmpty` (3388, used at 2367) is the Inbox empty-state — **NOT the writeline; KEEP.**

**`notebookActiveTab` (HOLD-2 gate) — every touch:**
- decl :1815 · read at render :2130 · fallback-set :2138 · tab-click set :2325 · **writeline
  commit repoint :3471–3473** (via `captureNote` no-noNav) · file-to-book picker :3652.
- The door's `captureNote(...,true)` **deliberately never touches** `notebookActiveTab` (:23467
  comment). So "notebookActiveTab unchanged on commit" is satisfied trivially by the door — but
  that MEANS the writeline's **follow-the-note-to-its-tab + re-render** (C9) is dropped: a door
  commit while on `#notebook` will not refresh the left-leaf entry list until the next render
  (the sheet's caught-list is the in-sheet receipt). **Sub-decision for the fork:** accept no-refresh
  (door purity) OR add a route-gated `if hash startsWith #notebook: renderNotebook()` after commit.

**In-flight drafts at cutover:** see §draft.

---

## §draft — one gate, or orphan/duplicate?

- BOTH writeline and door use the **same primitives** (`nbDraftKey/Save/Load/Clear`, views.js:1844–1868)
  and the **same localStorage namespace** `praxis_nb_draft_<uid>_<slot>`. **ONE gate, one owner-guard
  — no guard duplication.** Slots differ: writeline = the tab (`inbox`/`journal`/`<bookId>`), door =
  fixed `capture`.
- **No live duplication** (different slots never collide).
- **ORPHAN (one-time, at deploy):** a user mid-compose at cutover has text in `_inbox`/`_journal`/`_<bookId>`;
  the door reads only `_capture`, so that text is **never surfaced again** (not deleted — device-local,
  pre-commit, 300ms-debounced working text; NOT Firestore data). Options: (a) accept (ephemeral drafts);
  (b) one-time seed `_capture` from the most-recent legacy slot on first open. Recommendation: **(a) accept**
  — these are transient and the loss window is a single deploy boundary.
- Shared module var `nbDraftFlushFn`: writeline sets it; the door does not (door has its own
  `capSaveDraftNow` hooks). After retirement `nbDraftFlushFn` stays null and `nbInstallDraftHooks`'
  generic hooks become guarded no-ops; the door's own hooks remain. **No leak.**

---

## §3 — THE FORK (A vs B) + recommendation

**A — embed a LIVE door instance inline in the notebook leaf.**
Cost: the door is a hard **singleton** — unique element IDs (`capField`/`capSheet`/…), `getElementById`
throughout, body-mounted once at boot, styled as a fixed scrim/slide overlay. A second live inline
instance would either **collide on IDs** (getElementById returns the first — two instances fight over
`capField` et al.) or require **refactoring the whole door module to instance-scoped refs** — squarely the
"refactors beyond the writeline's seam" NON-GOAL, and the **single most likely path to FORK the guard code**
(every guard reads module-global `capOwnerUid`/`capMicSeq`/`capDraftTimer`). **HIGH cost, architecture-hostile,
guard-singularity-hostile.**

**B — replace the writeline with a "Catch a thought" affordance that opens the overlay door.** ✅ RECOMMEND
Cost: delete `buildNotebookWriteline` + the two writeline-only helpers; mount a small affordance in the left
leaf calling `openCaptureDoor({ mode:'note', targetKey:<book tab>, register:<journal on Journal tab> })`.
The door's guards / draft / `capMicSeq` / FileReader guard **all apply UNCHANGED — one implementation,
grep-provable.** LOW cost, honors the singleton + every NON-GOAL. **This is the guard-singularity-compliant
path by construction.**

**Recommendation: B.** It is the only path that satisfies the mission's hard requirement ("zero forks of
the guard code — grep-provable single implementation") without a door-module refactor (a NON-GOAL). A fights
the shipped architecture and forces guard forks.

**Under B, the two sub-rulings Preston owns:**
- **C3 register default** — recommend base **marginalia**, Journal tab passes **journal** (additive `opts.register`).
- **C5 photo/library** — recommend **defer to the door's SEAT** (photo capture on the Notebook pauses until
  the SCAN round wires the socket, which already owns photo/OCR). This is a **live wired capability going inert**
  — the headline felt loss; flag loudly. Alternatives: keep a minimal inline photo carve-out (re-introduces a
  fork) or wire photo into the door now (scope expansion beyond the writeline seam).

---

## §4 — Baseline bytes + anchors (for Stage 1)

- views.js **1,101,075 B**; sw.js `CACHE_VERSION praxis-v3.253` → **v3.254** on ship.
- Remove: `buildNotebookWriteline` 3030–3343 · `appendWritelineChip` 3347–3356 · `buildNotebookModeChip`
  3363–3383 (·`setNotebookComposing` 2978 becomes orphaned — remove-with-seam or leave dead: judgment).
- Add: the "Catch a thought" affordance in `buildNotebookLeftLeaf` (replaces the :2347 mount) + optional
  `opts.register` on `capOpen`.
- **CSS (scoping question, NOT decided here):** writeline-only rules across components.css — light
  10137–10142; amber 14406–14445, 14520–14532, 16034–16160; photo shots 4809–4909; composing 4746–4767.
  **`.seg`/`.seg-opt` are SHARED app-wide — never remove.** Recommend leaving now-dead writeline CSS in place
  this stage (surgical diff, avoids the shared-selector hazard) unless Preston wants a scoped cleanup.
- Parse check on ship: `cscript //nologo //E:jscript tools/parse-check js/views.js`.
- Recon-reviewer gate (FIX-PROTOCOL §1 #8): runs at the TOP of Stage 1 (after the ruling), before any edit —
  validating that the plan built matches the ruled fork. Held now because the central question is unruled.

---

## Expected byte delta (pre-computed, verify after)

Remove ~213 L writeline + ~11 L `appendWritelineChip` + ~21 L `buildNotebookModeChip` (± `setNotebookComposing`
~), add ~small affordance + `opts.register` branch. **Net expected: a REDUCTION on the order of −6k to −9k B**
of code (comment/whitespace-inclusive), refined at Stage 1. This is a FLOOR/estimate, not a target.

HALT — awaiting the fork + register-default (+ photo-disposition) ruling before Stage 1.
