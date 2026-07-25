# CD6-NBK-REFRESH-GUARD (micro-lane) — BUILD + VERIFY

Built per Preston's F1/F2/F3 rulings (pre-authorized ship on green). HEAD `f5e11b7` →
CACHE_VERSION `praxis-v3.255` → **v3.256**. NOTE-tier guard; felt-skip ruled.

## The change (2 edits, js/views.js + sw.js)
1. **New `capNotebookHasOpenInline()`** (parallel to the Stage-2 `capBookPageHasOpenInline`) — returns
   true if any wired notebook inline host holds content: id-based (`notebook-editor-host`,
   `notebook-transparency-host`, `notebook-settings-host`) via `getElementById().firstChild`, and
   class-based per-card/gather pickers (`.notebook-working-arc-picker-host`,
   `.notebook-entry-arc-picker-host`, `.notebook-entry-carry-host`, `.notebook-entry-book-picker-host`,
   `.notebook-entry-subtheory-picker-host`) via `querySelectorAll` (ALL instances scanned — a closed
   picker leaves an empty host that must not count). The built-in gather NAME canvas is deliberately
   NOT checked (content restored; a `.wc-input` check would false-positive since it is always present).
2. **`capFinishCommit` notebook branch guarded**: `if (capIsNotebookRoute() && !capNotebookHasOpenInline()) renderNotebook();`.

`renderNotebook` / the pickers / `createWritingCanvas` unchanged. F3: dead `openJournalEditor` +
`#notebook-editor-host` logged as a separate task (`DEAD-JOURNAL-EDITOR`), guarded harmlessly.

## Mechanical gates
| Gate | Result |
|---|---|
| parse views.js (cscript) | **PARSE OK, exit 0** |
| capNotebookHasOpenInline def+call | 2 · guarded branch present (views.js) |
| capCommitBusy = false | only finalize + backstop, BOTH gen-gated (unchanged) |
| entry-write | `captureNote` sole writer (1 def); addDoc 0; no new `.set(` |
| byte delta | views.js **+2,010 B** · sw.js **+0** · 0 CR both |
| foundations MD5 | marks `772886c0…` · lumen-amber `070679b0…` — UNCHANGED |
| scope | only js/views.js + sw.js dirty (no growth) |

## Live verify (rig :8760, uid d0tester)
| Check | Evidence |
|---|---|
| fresh guard | served views.js carries `capNotebookHasOpenInline` |
| NO false-positive | normal state (no host open) → guard FALSE → door commit refreshes; note visible in leaf |
| GUARD true → SKIP (element identity, querySelectorAll per-card path) | populated `.notebook-entry-arc-picker-host` → `capNotebookHasOpenInline()`=**true** → `renderNotebook` SKIPPED (`#app` first child UNCHANGED) → the host SURVIVES (marker preserved) |
| note still files | a door commit files the note regardless of the skipped refresh |
| after close → refresh | host emptied → guard FALSE → commit refreshes; note visible |
| console | clean (0 errors) |
| id-path (settings/transparency/editor hosts) | byte-identical getElementById loop to the Stage-2 book-page guard already proven; rig couldn't open the settings panel (toggle not exposed) — id-path inherits the proven Stage-2 result |

## Residual
- **DEAD-JOURNAL-EDITOR (F3, separate task):** `openJournalEditor` + `#notebook-editor-host` are a
  pre-existing orphan (zero callers). Not folded here (REVERT JUDGMENT); guarded harmlessly.

## Stage-2 red-team — BLOCK found (pre-authorized ship VOID; HALT for Preston)

**BLOCK (real): `.notebook-working-arc-picker-host` never self-clears → guard stuck `true` →
notebook refresh permanently suppressed.** The gather "Choose an arc" picker's `onDone` is a no-op
(`openGatherArcPicker`, views.js:2786, PRE-EXISTING — `buildArcPickerPanel` has no internal
close/clear, unlike `buildBookPickerPanel`/`buildSubTheoryPickerPanel`). So click "Choose an arc" →
click "Done" (without picking) leaves the host populated forever → `capNotebookHasOpenInline()`
returns `true` on every later call → `capFinishCommit` never refreshes `#notebook` again (door
commits file but don't surface until an unrelated full re-render). Ordinary use, no race. My
live-verify round-tripped only ONE of the 5 class selectors and generalized — the uncovered branch.
The other 4 per-card hosts + the id hosts all self-clear correctly (verified by the red-team).

**Everything else clean** (red-team): no false-negative gaps · `notebook-arc-editor-host` is on
`#arcs` (out of scope) · querySelectorAll ALL-instances scan correct for the 4 sound selectors · no
`capCommitBusy`/writer/`.set`/`addDoc` regression · ES3-clean · parse exit 0 · foundations MD5
unchanged · byte delta +2,010 exact.

**HALT — awaiting Preston's ruling on the fix (a genuine fork, one is scope-growth he gated):**
- **Option A (in-scope, RECOMMEND for a felt-skip lane):** drop `.notebook-working-arc-picker-host`
  from the guard's selector list. Then a door commit while the gather picker is open tears it down
  (recoverable — selection list; the gather name + set are persisted/restored). No permanent
  suppression. The gather picker's broken `onDone` is logged as its own task **GATHER-PICKER-DONE-NOOP**
  (pre-existing UX bug: "Done" doesn't close the gather picker). No UI behavior change → stays felt-skip.
- **Option B (SCOPE GROWTH — Preston-gated):** fix `openGatherArcPicker`'s `onDone` to clear the host
  (one line), like its siblings. Makes the host self-clear → safe to keep in the guard, AND fixes the
  latent "Done does nothing" UX bug. But it changes the gather picker's Done behavior (a felt-able
  change) inside a felt-skip lane.

## FIX APPLIED — Option A (Preston-ruled). Re-verified per-selector.
`.notebook-working-arc-picker-host` DROPPED from the guard's selector list (guard now scans the 4
self-clearing per-card hosts + the 3 id hosts). GATHER-PICKER-DONE-NOOP logged as its own task.
views.js +2,442 B · parse exit 0 · releases both gen-gated · foundations unchanged.
**Re-verify (each selector INDIVIDUALLY — the miss was generalizing):**
- 4 class selectors (`entry-arc-picker` · `entry-carry` · `entry-book-picker` · `entry-subtheory-picker`):
  each populated → guard TRUE → renderNotebook SKIPPED (element identity) → cleared → guard FALSE →
  renderNotebook FIRES. **All 4 ✓.**
- 2 live id hosts (`notebook-editor-host` · `notebook-transparency-host`): each round-trip ✓.
  `notebook-settings-host` confirmed NOT created (inert no-op, matches red-team).
- **Gather host (excluded):** only it populated → guard FALSE → door commit → refresh FIRES, gather
  picker torn down (the accepted recoverable outcome). **No permanent suppression ✓.** (Name/set
  restore is renderNotebook's existing unchanged behavior — the diff doesn't touch the name canvas
  or gather restore; couldn't live-exercise without a gathered-note setup on the stub.)
- Normal path: guard FALSE → refresh fires → note visible ✓. Console clean.
