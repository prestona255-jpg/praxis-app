# Pass 3 — LANE A: Writing-loop (§3c)

*Read-only audit lane, run `wf_75daf543-b02`. HEAD `a92c499` / `praxis-v3.180`. Findings only — no code changed. References (not re-files) prior Pass 1/2 ids.*

---

# Fable Audit â€” Pass 3 Â· Lane A: Writing-Loop (Â§3c)

Read-only. No app file changed (one agent-memory note added under `.claude/agent-memory/praxis-reviewer/`, not repo app code). Ground truth established fresh: HEAD `a92c499` / `praxis-v3.180`; every Pass-3 surface file (`views.js`, `components.css`, `theme.css`, `assets/`) byte-unchanged since the charter SHA, so line anchors hold.

## Coverage matrix â€” writing-loop journey Ã— dimension

| Step (in order) | Handler traced | Persist? | Feedback? | Affordance | Finding |
|---|---|---|---|---|---|
| inspiration â†’ **capture** (writeline) | `buildNotebookWriteline`/`captureNote` v:2534/2768 | YES saveState 2795 | YES (follows note to tab) | Capture btn visible | CLEAN (NB1 owns the invisible-text craft break) |
| capture via **capmodes** | 3 buttons â†’ `ImportCapture.open()` v:1989/1998/2008 | n/a | overlay opens | **all 3 open ONE panel** | **WL1** |
| **attach-to-book** (File to book) | `openFileToBookPicker`â†’`fileEntryToBook` v:2967 | YES | YES (routes to book tab) | text-link | CLEAN (NB3 owns link-as-prose) |
| **group-into-arc** (Add to arc / createArc) | `openEntryArcPicker` v:13121; `createArc` state:1784 | YES | YES | text-link | CLEAN |
| **Arcs entry** (overview vs auto-open) | navâ†’#arcs; `renderArcsPage` v:3413 | n/a | overview renders | â€” | **WL4 (friction NOT reproduced)** |
| **gather â†’ sub-theory** | `notebookCreateSubTheory` v:2325 | YES | YES (routes to new page) | Create btn correctly disabled w/o arc | CLEAN (NB5 owns the disabled-reason craft) |
| **build** (Build face) | `renderSubTheoryBuild` v:10522 | YES saveState 10630 | 'saved' + pill | â€” | build-vs-read = AF1 (ref) |
| **build** (Page face) | `renderSubTheoryPage` v:~9065 | YES saveState 9195 | 'saved' + pill | â€” | AF1/AF2 (ref) |
| **publish** | Page pill v:9188 Â· Build pill v:10624 | YES both | pill repaint | **two names, one act** | **WL3** |
| **Yumi dialogue** (per-note) | `maybeDrawOut`â†’`considerMove` v:2812 / brain:1698 | n/a | **none when panel closed** | 'ask Yumi' link 13500 | **WL2** |
| signed-out entry | `renderNotebook` v:1705 | n/a | honest sign-in state | â€” | CLEAN |

## Ledger â€” new Lane-A findings

| # | Surface | Issue | Sev | Type | Evidence | Fix direction |
|---|---|---|---|---|---|---|
| **WL1** | #notebook | 'paste / import', 'dictate', and 'talk it through with Yumi' all open the identical file-import overlay; the Yumi-conversation button delivers a paste/upload panel. COPY IS A CONTRACT. | should-fix | bug (surface) | views.js:1989/1998/2008 all call `ImportCapture.open()`; import-capture.js:400 `open()` takes no arg, renderEntry = paste+upload+dictation | Give each button its own mode, or rename the 'talk to Yumi' label to match the single shared panel. |
| **WL2** | #notebook | Per-note 'ask Yumi' is a dead click with no feedback whenever the Yumi panel is closed. | should-fix | bug (surface) | link views.js:13500; `maybeDrawOut` only renders on `r.surface` (2817); `considerMove` returns `{quiet, reason:'panel-closed'}` yumi-brain.js:1715 | Open/raise the Yumi panel on click (or show a one-line cue) so the action always produces visible feedback. |
| **WL3** | #subtheory/<id> + /build | Same `status='published'` transition labeled 'Set as milestone' on the Page but 'Publish' on the Build face â€” writer can't tell they're one act. Connects AF1. | should-fix | gap (surface) | Page label views.js:9185, flip 9191-92; Build label 10621, flip 10626-27 | One name for the transition on both faces; if milestone â‰  publish, split into distinct fields. |
| **WL5** | #notebook | Journal notes are locked from Gather as 'never gathered, never read by Yumi', yet still carry 'Send to sub-theory' which can expose the private body in a publishable sub-theory. | nice-to-have | gap (surface) | lock views.js:13475-80 vs send-link 13549-57 (comment marks deliberate); addEvidence state.js:2268 | Withhold the send link from journal notes, or confirm the exposure â€” a Lane B covenant call. |

## Ledger â€” earned result (stale friction cleared)

| # | Surface | Result | Evidence |
|---|---|---|---|
| **WL4** | #arcs | The charter Â§3c item '#arcs auto-opens one specific arc' â€” explicitly handed to Pass 3 â€” **does not reproduce at HEAD.** The group-into-arc entry is a proper overview. | navâ†’#arcs (index.html:29); renderRoute dispatch views.js:572-582 (no redirect); renderArcsPage 3413-3544 = eyebrow+title+teaching + 'Your arcs' grid + worked examples, no `location.hash` to a specific arc |

## Clean cells (silence earned â€” actually traced)

- **Persistence spine intact** end-to-end: captureNote (2795), createSubTheory (state:1961), notebookCreateSubTheory reuse path (2334-2340), both publish pills, fileEntryToBook/Send-to-subtheory/Add-to-arc note pickers all write through and re-render â€” **no lost-work / silent-drop on any commit path I traced.**
- **Signed-out notebook** renders an honest sign-in empty-state and returns before the composer (views.js:1705) â€” captureNote's `if(!user)return` is unreachable, so it is not a hidden silent-fail.
- **Create button guard** â€” gatherâ†’Create correctly disabled when no live arc exists (`canCreate` 2175-2182; `notebookSharedArc` skips deleted arcs 2285-2291), so the payoff can't fire into a non-existent arc.

## Honest residuals / not chased to ground

- **Gather name lost-work (INFERRED, not filed):** the forming sub-theory NAME flows only through `createWritingCanvas` onSave (views.js:2116-2121); if a click on Create doesn't blur-then-save the canvas first, a typed name could be dropped. Name is optional (createSubTheory accepts an empty header), so impact is low; I did not open writing-canvas.js to confirm blur-before-click ordering.
- **What `status='published'` visibly *does* for a sub-theory** (beyond the pill + read-only render at 9101) was not fully traced to a commons/surface payoff; if it has no downstream visibility, 'Publish' overstates â€” flagged as a thread for Lane B/IA, not filed here.
- Craft-layer issues on this journey (invisible writeline NB1-P0, prose-styled capmodes NB3, unclear book context NB4, disabled-Create reason NB5) are **referenced, not re-filed** â€” Pass 2 owns them.

*Lane A complete. New: WL1, WL2, WL3, WL5. Earned-clean: WL4 (stale friction). References: AF1, AF2, NB1, NB3, NB5.*
