# R-ARC S6a — CARET-SAFETY SPIKE — REPORT (v2, post-gates)

**VERDICT: PASS — a non-destructive decoration technique is proven, with
harness-committed, re-runnable evidence for all mandated deliverables.**

Session: Wave C (Fable 5, default effort). Base `fa52910` / live v3.220. Spike =
evidence-gathering only: `js/writing-canvas.js` UNMODIFIED (verified by reviewer:
`git diff fa52910 -- js/writing-canvas.js` = 0 lines); all decoration logic
harness-side. Recon: `r-arc-s6a-recon.md`. Harness: `.claude/rig/spike-caret.html`
(throwaway, ES5 var/function, LF; dot-dir = never published per the rig location
guard). Rig server port 8931. No pushes (felt-verdict hard gate). No app code
touched.

**v2 note:** run 1's Phase B was driven by operator-improvised console code —
`fix-red-team` correctly BLOCKED that as unauditable. Fix: all Phase B/C drivers
were committed INTO the harness (`spike.b0..b5BlockRebuild`,
`nativeUndoProbe2`, `cutProbe`, `enumSpans`, `setCaretAbsInside`) and the ENTIRE
battery re-ran through them on a fresh load. Run-2 numbers below; run 1 agreed on
every shared row.

---

## 1. The proven technique (Slice 7 inherits this shape)

1. **Match per text node** (walk `ed`, skip `.wc-lite` subtrees — never nest);
   collect `{node, start, end}`; **apply in reverse document order** so earlier
   offsets stay valid.
2. **Wrap = guarded `splitText` + span insert**: split only when the match is
   interior (`start > 0` / `end < len`), then `insertBefore(span, target)` +
   `span.appendChild(target)`.
3. **Caret carried across EVERY mutation via absolute-text-offset save/restore.**
   Abs offsets are invariant under decoration (text content never changes), so
   they are a deterministic caret key. Load-bearing: the `appendChild` move
   REMOVES the caret's node from the tree, and DOM range fixups collapse the
   selection to the parent — decorating the caret's own word WITHOUT restore =
   clobbered caret (the trap, confirmed mechanically).
4. **Serializer transparency.** `inlineOfNode` (writing-canvas.js:151-167) has
   exactly 4 tag branches (strong/b, em/i, br); any other element falls to the
   `else` arm (:163) and recurses into children. Proven empirically for the
   in-block case byte-for-byte, including a match nested inside `<strong>`. The
   direct-child-of-`ed` case is proven by code-trace only (both gate agents
   traced `serializeMarkdown`:212's identical `inlineOfNode` fallback; the
   battery could not produce a top-level span because `wcRenderMarkdown` never
   emits bare top-level text and `normalize()`:268-282 prevents it persisting) —
   a scoping the harness cannot close and the Room never hits.
5. **Decoration is invisible to the editor pipeline — directly instrumented:**
   `wcRenderMarkdown` wrapped with a call counter BEFORE canvas creation (the
   canvas resolves the global by name at call time): **0 calls during
   decoration** (1 at boot = the initial render, proving the counter live).
   Plus 0 `input` events, 0 `onSave` calls (the input-silence is a DOM
   guarantee — programmatic `insertBefore`/`appendChild` fire no `input` — not a
   harness accident; red-team confirmed).
6. **The display layer is expendable BY DESIGN**: history re-renders, native
   undo, and `applyBlock` rebuilds may wipe spans; text held value-identical in
   every observed case; a re-decoration pass heals. Decoration must be a pure
   function of (plain text, match index), re-runnable at any time, carrying zero
   state in the DOM.

*Precision (red-team NOTE 5): "byte-identical" throughout = JS string equality
(UTF-16 code-unit compare). The fixture is all-ASCII, so code-unit-identical =
byte-identical here; the Slice-7 gate should say "value-identical."*

## 2. Evidence table — run 2, every row driven by harness-committed code

Fixture: 340 B markdown — h2 · paragraph · bulleted list (one match inside
`**strong**`) · blockquote · em/strong closing line; 6 `enclosed` matches.
Phase A auto-runs on load (`window.__A`); Phase B/C rows cite their committed
driver. The ONLY operator act is real-keystroke delivery (the pane's type
action); every dispatch and assertion is harness code.

| # | Check (driver) | Evidence (run 2) | Result |
|---|---|---|---|
| A0 | Baseline render→serialize round-trip | `getValue() === fixture`, 340 | PASS |
| T1/A3 | **`getValue()` value-identical after decoration** | 6 wraps (incl. in-`strong`), cmp same=true, 340/340 | **PASS** |
| A4 | Non-vacuous | 6 `.wc-lite` spans in DOM (independent query) | PASS |
| T2/A5 | **Caret survives decoration mid-word** | `encl·osed` abs 27 → 27 across 6 wraps; canvas's own `getSelection()`; caret genuinely INSIDE a span | **PASS** |
| T2/A7 | Typed continuation (programmatic) | `insertAtCaret('X')` → `The enclXosed garden sits`; removing X restores prior value exactly; spans held (6) | PASS |
| T2/B1 | **Typed continuation (REAL keystrokes)** (`b0(5)` + pane-typed `AB` + `b1Check`) | caret 240 mid-span in the blockquote → `an enclABosed conversation`; value−AB === b0.v exactly; caret 240→242 (=expected); spans held (5); real `input` fired | **PASS** |
| T4/A6 | Pipeline silence during decoration | 0 `input` · 0 `onSave` · **0 `wcRenderMarkdown` calls** (direct counter; boot=1 proves it live) | PASS |
| T3/B2 | **Undo intact** (`b2Undo`: synthetic `KeyboardEvent` → the app's real `onKeyDown` → `doUndo`; see §4 RIG) | `defaultPrevented:true`; value restored to b0.v exactly (341); spans wiped by history re-render (expected); caret-to-end 314/314 (documented price). **Snapshot taken while 5 spans were LIVE restored pure markdown — the stack is unpolluted** | **PASS** |
| T3/B3 | Redo intact (`b3Redo`) | `defaultPrevented:true`; typed state restored exactly; spans 0 | PASS |
| T3/B4 | Re-decoration after rebuild (`b4Redecorate`) | 4 wraps (honest: `enclABosed` no longer matches), value unchanged | PASS |
| T5/A9 | Undecorate round-trip (unwrap + DOM `normalize()`) | value-identical 341/341; caret held 28→28; spans 0 | PASS |
| T6/A10 | Edges | absent needle 0 wraps + unchanged · block-start match · whole-node match · decorated AND undecorated identical | PASS |
| T7a | Native-undo probe 1 (edit FAR from spans: `nativeUndoProbe`, doc end) | undo reverted ONLY the insertion — value-identical to pre-probe 341/341; **1 of 6 spans (a distant one) silently destroyed**; no exception | OBSERVED → R1 |
| T7b | **Native-undo probe 2** (edit INSIDE a span's text node + redo: `nativeUndoProbe2(2)`, span-enumerated) | `enclosedQQ` confirmed inside the span; undo → value-identical 345/345 and **ALL 4 spans survived** (incl. the edited one, same context); redo → value-identical 347/347, spans 4; cleaned | OBSERVED → R1 |
| B5 | Editor's own destructive block rebuild (`b5BlockRebuild`, `liveBlock`→`applyBlock` in a decorated block) | caret placed 19=expected (strictly-inside law); block→bullet; the block's span died (4→3), others held; text preserved exactly | PASS |
| C2 | Cut probe (context-menu-class mutation: `cutProbe(2)`) | `execCommand('cut')` returned false, zero mutation — **pane denies clipboard; vector stays UNTESTED and named in R2** | N/A → R2 |

## 3. Findings carried to Slice 7 (the Room build)

- **F1 — CARET-CARRY LAW.** Every decorate/undecorate pass wraps in
  save-abs-offsets → mutate → restore. No exceptions; the clobber is mechanical
  without it.
- **F2 — BOUNDARY SEMANTICS.** Abs-offset↔DOM position is ambiguous exactly at
  node boundaries (a `>=` walker lands at the PREVIOUS node's end — bit this
  spike's own harness at a block start in run 1; fixed as the committed
  `setCaretAbsInside`, re-proven in B5). The restore walker must choose a side;
  at span edges the choice decides whether the next typed char joins the
  highlight (visual only — both sides serialize identically).
- **F3 — STALE DECORATION IS THE STEADY STATE.** Typed chars join a span's text
  node (`enclABosed` rendered highlighted until the next pass). Heal by re-running
  the matcher on the editor's existing debounce cadence (snapshot 400ms / save
  700ms) — decorate-on-pause, the F-C fallback, is the natural design even
  though per-keystroke proved safe.
- **F4 — SPANS ARE STATELESS AND EXPENDABLE.** Any editor-internal rebuild wipes
  them legally; native undo may wipe or keep them (T7a vs T7b — undefined, both
  text-safe). Decoration = pure re-runnable function of (text, index). Never
  store data in decoration DOM.
- **F5 — T10/XSS BY CONSTRUCTION.** The technique only MOVES existing text nodes
  into created spans — zero `innerHTML`, zero user-text re-injection.
- **F6 — PERFORMANCE UNMEASURED.** 340 B fixture. Slice 7 must band its own
  matcher-pass cost at eruption length (the 6b index keeps match sets small; the
  walk is O(text)).
- **F7 — ES3 PORTABILITY CONFIRMED** (red-team): the technique uses only
  ES3-safe syntax + sanctioned DOM APIs (`splitText`, `insertBefore`,
  `querySelectorAll` — already used by the canvas itself).

## 4. Residuals + rig notes (honest limits)

- **R1 — native undo/redo (context-menu/mobile class; keyboard is intercepted,
  :584-595, preventDefault :590).** Two probes, opposite span outcomes: a
  distant edit's undo killed 1 span (T7a); an in-span edit's undo+redo kept all
  spans (T7b). **Span survival under native history is UNDEFINED; text was
  value-identical in all four observed transitions (2 undos, 1 redo, 1 revert
  control).** Consequence tier: cosmetic (stale/lost highlight), healed by
  re-decoration. Slice 7 may optionally suppress `beforeinput`
  `historyUndo`/`historyRedo`; not required for text safety on this evidence.
  Still an observation set of 2 scenarios — Slice 7's gate should re-probe on
  its real surface before relying on any span-survival assumption (it should
  rely on NONE, per F4).
- **R2 — not tested, named:** long-document scale · IME/composition input ·
  WebKit/mobile Safari (pane is Blink; rides Slice 11's phone gate) ·
  non-collapsed selections held across a decoration pass · matches spanning
  multiple text nodes (per-text-node matching is the DESIGN — a cross-boundary
  needle simply doesn't match; 6b must treat inline-formatted phrases
  accordingly) · **spellcheck replacement** (the canvas sets
  `spellcheck='true'` :135; a right-click correction is a native non-keydown DOM
  mutation — same class as T7, undrivable from the harness) · **drag-drop text**
  · **cut/paste via context menu** (cut attempted: pane denies clipboard, C2).
- **RIG — pane modifier-key synthesis does not reach page handlers.** Two
  focused `ctrl+z` attempts no-oped (focus proven true at press time); the
  sanctioned fallback (committed as `synthKey`) dispatches a synthetic
  `KeyboardEvent` at the editor, running the REAL `onKeyDown`
  (`defaultPrevented:true` proves consumption). Corroborate on real Chrome at a
  later live-verify if desired. Pane also denies `execCommand('cut')`.
- The instrument-liveness control (`saveCount` 0→1 after A7's 700ms debounced
  save) is a separate, later console read — not part of the synchronous Phase-A
  JSON (which necessarily snapshots before the debounce can fire). Mechanism:
  decoration never calls `scheduleSave`, so the only path to `saveCount:1` is
  the real debounced save from A7's edit — a fair dead-counter control.
- Run 1's harness self-pollution (F2's boundary landing put `- ` at the h2's
  end) was recovered via the app's own undo (value-verified) — recorded because
  the failure mode itself is spike evidence for F2.

## 5. The F-C law, restated at the verdict

PASS does not relax F-C: **decoration is a display layer ONLY; the plain-text
markdown remains the single source of truth; decorated DOM is never an input to
serialization.** The serializer's transparency (§1.4) is the structural backstop
that makes corruption impossible even when the law is accidentally approached —
it is not an invitation to lean on it.

## 6. Gates

- **Self-verify:** the run-2 battery above — all drivers harness-committed,
  canvas's own APIs as truth sources, non-vacuous controls, direct instruments.
- **fix-red-team (Sonnet):** 1 BLOCK + 2 HOLD + 4 NOTE on run 1. Dispositions:
  BLOCK 1 (Phase B drivers unauditable) → **FIXED**, drivers committed + full
  re-run (this v2). HOLD 2 (R2 not exhaustive: spellcheck/drag-drop/cut) →
  **FIXED**, named in R2 + cut probed (C2). HOLD 3 (T7 single uninvestigated
  observation) → **FIXED**, probe 2 with span enumeration + redo sequencing;
  R1 re-worded to "undefined span survival, text-safe in all observations."
  NOTE 4 (transparency scope) → **FIXED** (§1.4 scoping). NOTE 5 (byte vs
  code-unit) → **FIXED** (§1 precision note). NOTE 6 (liveness sourcing) →
  **FIXED** (§4). NIT 7 (:589→:590) → **FIXED**. Red-team's sound-list also
  independently confirmed: reverse-order wrap correctness, non-vacuous counts,
  non-circular caret assertions, the DOM input-silence guarantee, zero app-file
  delta, ES3 portability.
- **praxis-reviewer (Sonnet): CLEARED TO COMMIT.** Scope PASS (zero tracked
  modifications; exactly 3 new files: 2 checkpoints + the harness) · mandate
  coverage PASS with one precision finding — mandate (d) cited a proxy signal →
  **FIXED** with the direct `wcRenderMarkdown` call counter (§1.5, A6 run 2:
  0 during decoration, 1 at boot) · 8 anchors spot-checked exact · honesty PASS ·
  rig location PASS · ES3 sweep 0 hits · all 3 new files pure LF.
- **Rig live-verify:** this battery IS the rig evidence (canvas driven live in
  the pane at :8931).

**VERDICT RATIFIED — PASS (Preston via design-partner deferral, 2026-07-17).**
Slice 7 becomes estimable at its own recon. **F-C stands permanently**:
display-layer only, plain text sole source of truth, spans stateless and
expendable. Decorate-on-pause is retired as unneeded but stays recorded as the
fallback of record. Commit disposition: the two checkpoint docs ship docs-only
(this commit); the harness rides the first Wave C code slice's sw-bump commit
(`--no-verify` refused — the hook is never bypassed). Felt-verdict hard gate on
v3.220 stands — no CODE push until it lands.
