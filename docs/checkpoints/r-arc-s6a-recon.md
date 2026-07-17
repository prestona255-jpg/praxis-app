# R-ARC S6a — CARET-SAFETY SPIKE — Stage 0 recon

Base `fa52910` / live v3.220. Fable 5 session (Wave C). Read: js/writing-canvas.js
in full (659 lines, 27,272 B). Spike = evidence-gathering only; no app code touched.

## Anchors (verified by full read)

| Fact | Anchor |
|---|---|
| Canvas = contenteditable div, block DOM (p/h2/h3/blockquote/ul/ol) | `createWritingCanvas`, writing-canvas.js:114-141 |
| Stored value = markdown plain text; `getValue()` = `serializeMarkdown(ed)` | :193-215, :395 |
| **Serializer is TRANSPARENT to unknown elements** — `inlineOfNode` special-cases strong/b, em/i, br; any other element recurses into children | :151-167 (the `else { out = out + inlineOfNode(c); }` arm, :163) |
| Undo/redo = private markdown-snapshot stack; Ctrl+Z/Y intercepted + preventDefault, routed to `doUndo/doRedo`; history re-render via `wcRenderMarkdown` accepts caret-to-end | :534-561, :584-595 |
| `wcRenderMarkdown` is a destructive rebuild (`innerHTML=''`), called ONLY from load/setValue/undo-redo — never from `onInput` | :86, :396-402, :544-550, :573-580 |
| Absolute-text-offset machinery exists (`textLen`/`textOffsetOf`/`readSelection`) | :358-388 |
| `normalize()` (canvas's own) only lifts top-level stray text nodes into `<p>` — never descends into blocks | :268-282 |
| `applyBlock` rebuilds a block from `textContent` (would wipe in-block decorations; text preserved) | :286-328 |
| Paste is plain-text via `execCommand('insertText')` | :596-603 |
| Autosave debounced 700ms on input/blur; `flushSave` no-ops when `getValue() === lastSaved` | :521-532 |

## The identified caret trap (the spike's core question)

Wrapping a matched text run = `splitText` at both ends + move the middle text node
into a `<span>` (`appendChild` = remove + re-insert). Per DOM range fixups, a
selection whose container is a REMOVED node collapses to the parent — so
decorating the word the caret sits in WILL clobber the caret unless explicitly
saved/restored. Antidote: absolute text offsets are INVARIANT under decoration
(text content unchanged), so save-abs-offset → mutate → restore-abs-offset is a
deterministic, provably-correct caret carry. The canvas already owns this exact
offset arithmetic (:358-388) — the technique reuses a proven in-house pattern.

## Spike design

Throwaway harness `.claude/rig/spike-caret.html` (untracked; dot-dir = never
published, per the rig location guard). Loads `/js/writing-canvas.js` UNMODIFIED
off the rig server (repo root). Decorator implemented harness-side only:
- collect matches per text node (skip inside existing `.wc-lite`), apply in
  reverse document order; wrap = guarded splitText + span insert;
- save/restore caret across every decorate/undecorate via abs offsets;
- undecorate = unwrap spans + DOM `ed.normalize()` + caret restore.

## Test battery

- **T1 serializer transparency:** `getValue()` byte-identical before/after
  decoration (length + first-diff-index proof), incl. a match nested inside
  `<strong>` and multiple matches in one text node. Non-vacuous: span count > 0.
- **T2 caret mid-word:** caret placed INSIDE a matched word; decorate; abs
  selection unchanged (canvas's own `getSelection()` = the app-facing truth) +
  typed continuation lands exactly at the caret (programmatic + REAL keystrokes).
- **T3 undo/redo intact:** snapshot stack unpolluted (no decoration markup in any
  restored value); undo re-render wipes spans (expected — display layer rebuilds);
  text correct after undo AND redo; re-decoration after re-render works.
- **T4 pipeline silence:** zero `input` events + zero `onSave` calls fired by
  decoration itself.
- **T5 undecorate round-trip:** unwrap + normalize → byte-identical + caret held.
- **T6 edges:** match at node start/end (splitText guards), whole-node match,
  absent needle (0 wraps, value unchanged).
- **T7 native-undo probe (residual documentation):** `execCommand('undo')` after
  decoration — keyboard undo is intercepted (:589), but context-menu/mobile undo
  is a live residual path; observe and report, not a pass/fail gate.

## Risk notes carried into the report

- Typing inside a decorated span joins the span's text node — display layer gains
  unmatched chars until the next decoration pass (stale-highlight, a Room design
  note); serializer transparency means it can never corrupt the stored text.
- F-C law holds regardless of verdict: decoration = display layer only; plain
  text single source of truth; decorated DOM never *depended on* by serialization
  (transparency is a safety net, not a license).

No DECISION GATE marked in the plan for 6a recon; ruling of 2026-07-17 says the
spike may run and report now. Proceeding to build the harness.
