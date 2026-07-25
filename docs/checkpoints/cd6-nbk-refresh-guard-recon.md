# CD6-NBK-REFRESH-GUARD (micro-lane) — STAGE 0 RECON

Guard the Stage-1 `#notebook` door-commit refresh (`renderNotebook()` in `capFinishCommit`) the same
way Stage 2 guarded the book page — but the audit reframes the severity.

HEAD `f5e11b7` · views.js baseline **1,095,101 B** · CACHE_VERSION `praxis-v3.255` → ship `v3.256`
Foundations (guard won't touch): marks `772886c0…` · lumen-amber `070679b0…`

## The teardown IS reachable
`capFinishCommit`: `if (capIsNotebookRoute()) renderNotebook();`. `renderNotebook` does
`host.innerHTML=''` on `#app` (like `renderBookDetail`). A door commit via ⌘N / the nav Capture entry
while on `#notebook` tears down `#app` — so any open inline UI on the notebook is destroyed. Reachable
by ordinary use, no race.

## …but the severity is LOWER than the book page (the key finding)
The book page was a BLOCK because its on-demand **rich edit canvas** (`createWritingCanvas`, typed
text) got torn out. **`#notebook` has NO on-demand typed-text editor:**

| Notebook inline surface | Host | Populated? | Torn-down cost |
|---|---|---|---|
| `openJournalEditor` (inline journal textarea, Save/Cancel — NO autosave) | `#notebook-editor-host` (id) | **DEAD — 0 callers** (exhaustive grep: only comments + the `views.` export). Never populated. | none (nothing mounts) — **also flag as dead code** |
| Add-to-arc picker (per card) | `.notebook-entry-arc-picker-host` | wired | open picker closes — **recoverable** (0 text inputs, writes on click) |
| Carry-question replace-confirm | `.notebook-entry-carry-host` | wired | confirm box closes — recoverable (buttons, no text) |
| File-to-book picker (per card) | `.notebook-entry-book-picker-host` | wired | open picker closes — recoverable |
| Send-to-sub-theory picker (per card) | `.notebook-entry-subtheory-picker-host` | wired | open picker closes — recoverable |
| Gather arc picker | `.notebook-working-arc-picker-host` | wired | open picker closes — recoverable |
| "What Yumi sees" / settings panels | `#notebook-transparency-host` · `#notebook-settings-host` (id) | wired | panel closes — no typed work |
| Gather **name canvas** (`createWritingCanvas`) | built INTO `renderNotebook` (not a host) | always (forming UI) | content **persisted (`notebookGatherName`, 700ms autosave) + restored** on re-render; only last-<700ms + caret at risk (soft) |

`#notebook-arc-editor-host` (openArcEditor) is on **`#arcs`**, NOT `#notebook` (legacy prefix) — out of scope.

**Verdict: NOTE-tier "a ⌘N commit closes your open picker / nudges name-typing," not the book page's
data-loss BLOCK.** All 4 pickers = 0 text inputs (selection lists). The one true typed-text surface
(`openJournalEditor`) is dead; the name canvas is content-safe by restore.

## The fix (proposed — mirrors Stage 2)
A `capNotebookHasOpenInline()` guard; `if (capIsNotebookRoute() && !capNotebookHasOpenInline()) renderNotebook();`.
It checks the on-demand hosts — id-based (`notebook-editor-host`, `notebook-transparency-host`,
`notebook-settings-host`) + class-based (`.notebook-working-arc-picker-host`,
`.notebook-entry-arc-picker-host`, `.notebook-entry-carry-host`, `.notebook-entry-book-picker-host`,
`.notebook-entry-subtheory-picker-host`) — for `firstChild`. **NOT** the built-in name canvas (a
`.wc-input` check would false-positive — the name canvas is always present; and its content is
restored anyway). Could share one helper with the book page: `capHasOpenInline(ids, classSelectors)`.

## The forks for Preston
- **F1 — still apply the guard, given the lower severity?** RECOMMEND **yes** — it's cheap, makes a
  door commit non-destructive on `#notebook` too (protects the open pickers + avoids the settings/name
  disruption), and keeps the pattern consistent with the book page. (Reclassify to a polish-only item
  if you'd rather not spend the micro-lane on a recoverable-tier annoyance.)
- **F2 — the name canvas:** RECOMMEND leave unguarded (content restored; a `.wc-input` check would
  wrongly suppress every notebook refresh). If you want mid-name-typing fully protected, the guard can
  add "the name canvas's contenteditable has focus" — a small extra clause. Your call.
- **F3 — dead `openJournalEditor` + `#notebook-editor-host`:** a pre-existing orphan the audit surfaced
  (REVERT JUDGMENT: not this micro-lane's cause). RECOMMEND a **separate named cleanup task**, not
  folded here. (The guard can still list `notebook-editor-host` harmlessly.)

HALT — awaiting the ruling on F1–F3 before the guard fix (then parse + element-identity verify +
red-team confirm → HALT with numbers → v3.256 on your word).
