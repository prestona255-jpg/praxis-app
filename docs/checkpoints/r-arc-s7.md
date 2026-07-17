# R-ARC SLICE 7 — ROOM LIGHTING — STARTED

Base `c33f22c` / v3.224 (push proof pending Netlify; triple-match done). Wave C
(Fable 5), **AUTONOMOUS RUN MODE v2 in force** (standing push on fully-green +
self-run deployed smoke + push ledger; hard halts unchanged; ROOM-2/Slice-8
data-write exception; mandatory FELT CHECKPOINT after this slice — no new
slice past it until Preston's verdict).

**Quality riders recorded (standing, Slice 7 forward):**
- FEEL STANDARD — motion quality by MEASUREMENT (latency, sustained frame
  rate, settle) in each FINAL-PASS. For lighting: pass-duration measured
  short/long doc; decoration ships WITHOUT motion BY DESIGN (quiet-marking
  law — a fade on underlines is noise, not settle) — disclosed as a design
  determination, not an omission.
- EMPTY-STATE MANDATE — widens ROOM-3 (every Room state designed; RM2/RM3/
  RM6 are its subjects).
- ROADMAP: **CORPUS EXPORT** (full notes/arcs/prose walk-out) — logged for
  round-close prep beside the beta gate; built never in Wave C.
- FINISH-CHOREO — named design item (§4b privacy sweep + threshold
  question); vehicle at the next slotting checkpoint.

## Scope (the ruled remap + ratified spike laws)

Light the PROSE CANVAS in the workshop (the live contenteditable) with
deterministic recognition. F-C absolute: display-layer only, plain text sole
source of truth, spans stateless/expendable; abs-offset caret carry around
EVERY pass (spike F1); strictly-inside boundary law (F2); pause-cadence
(S6c F3 — the natural design even though per-keystroke proved safe); T10
hardest here (moved text nodes only, zero innerHTML).

## Stage 0 recon (LIVE anchors)

- The canvas mount: views.js `renderSubTheoryBuild` — `canvas =
  createWritingCanvas(...)` (the handle exposes getValue/getSelection/
  onSelectionChange but NO setSelection — the restore walker lives with the
  lighting helper, per the spike harness pattern).
- The editor element: `.wc-input` inside the workshop wrap (query after
  mount).
- S6c's `_recogIndex()` memo is REUSED as-is (same file, same staleness
  residual R1 disposition).
- Rebuild wipes (history/setValue) arrive via `applyHistory` →
  `fireSelectionChange` — the `onSelectionChange` subscriber + a debounced
  idempotent pass covers input AND rebuild without touching
  writing-canvas.js (which stays UNTOUCHED — the spike's contract).
- Styling ground: warm-dim workshop — new scoped rule
  `.st-build.lum-amber-deep .wc-input .rec-lit` (S6c's rule is
  notebook-scoped).

## Design (session-owned)

`_recogLightLive(ed, canvas)` in views.js beside `_recogLightEl`:
- Guards: skip while a NON-COLLAPSED selection sits in the editor (spike R2
  named it untested — retry next debounce) · skip during IME composition
  (compositionstart/end flags — R2's named untested class, avoided
  entirely) · skip if index empty.
- The pass: save abs sel (own walker over `ed`, canvas.getSelection() as
  cross-check) → unwrap existing `.rec-lit` spans + `ed.normalize()` →
  walk text nodes (starts/lens captured pre-mutation) → `scan()` →
  reverse-order segment wraps (the S6c decorator's proven loop) → restore
  sel via strictly-inside posFromAbs (F2). Idempotence: skip when the
  editor text AND match set are unchanged since the last pass (cheap string
  compare memo).
- Cadence: one debounced trigger (~600ms) wired from the canvas's
  `onSelectionChange` + the editor's `input` event; first pass at mount.
- FEEL measurement built into the checkpoint battery: pass duration
  (performance.now) short doc + eruption-length doc; the debounce keeps
  every pass off the keystroke path.

## Band declaration (two figures, DENSITY-CLASSED)

| File | Class | CODE (hard) | COMMENT (soft) |
|---|---|---|---|
| js/views.js | algorithmic ~28–30 B/line, ~75–95 lines (walker 30 · pass 30 · wiring/guards 25 — counted from branch structure per the standing addendum) | **+1,900–3,100 B** | ≤600 B |
| assets/components.css | — | **+60–200 B** | ≤120 B |
| sw.js | — | bump v3.224→v3.225 ±0 | — |

writing-canvas.js · recognition.js · room-field.js · state.js UNTOUCHED.
Greps: T10 innerHTML 0 in added lines · T11 evidenceLayout untouched · T4
seed 0 · `_recogLightLive` = def + wiring only.

## ⚠ BUILD INCIDENT — NUL-byte corruption, caught + repaired pre-gates

Two U+0000 bytes rode an edit payload into the memo-key lines (the separator
literal between quotes was an actual NUL). **The tell:** whole-file diffstat
(43,876 lines) + `git ls-files --eol` flipping to `w/-text` (git's binary
heuristic) — the surgical-diffstat discipline caught it immediately. Repaired
(`perl s/\x00/|/g` + unix2dos): 0 NULs, diff surgical (90 insertions),
`w/crlf`, parse OK. **NEW STANDING GOTCHA: an invisible NUL in an Edit
payload flips the file to `-text` and explodes the diffstat — check
`ls-files --eol` on any whole-file diffstat before assuming EOL.**

## ⛔ MECHANICAL HALT #3 — HARD CODE-BAND BREACH (2026-07-17)

| Figure | Measured | Declared | Verdict |
|---|---|---|---|
| views.js CODE (hard) | **3,346** | +1,900–3,100 | **BREACH +246 (8%)** |
| views.js COMMENT (soft) | 491 | ≤600 | ✓ |
| css | 93 / 112 | 60–200 / ≤120 | ✓ |
| sw.js | ±0 (4,946, version swap only) | ±0 | ✓ |

**Why, honestly:** the line count was RIGHT this time (90 built vs 75–95
declared — the branch-structure addendum worked). The DENSITY class was
wrong: I priced "algorithmic ~28–30 B/line" but walker/guard-heavy code
(recursive walks, long guard conditionals) measures **~37 B/line** —
one class step low, the same direction as both prior breaches.
**Proposed ADDENDUM v2: price EVERYTHING at ~38 B/line (DOM density)
unless a tighter class is PROVEN from comparable shipped code** — the
conservative default ends this failure mode.
**Scope did NOT drift:** the diff = the live-light helper + one wiring call
+ one CSS rule, exactly the ruled Slice 7 scope. Halted per the standing
law and Run Mode v2's unchanged hard-halt list. Options: (a) re-band at
measured + headroom (views ≤3,450); (b) code-shrink = design change
(fewer guards — they fence the spike's two named untested classes; cutting
them is a safety call, not a trim), Preston's alone.

## RE-BAND RULED (Preston, 2026-07-17) — option (a)

**views.js CODE ≤3,450** (measured 3,346 clears, 104 headroom). (b) DECLINED
FIRMLY — "safety code is never trim material." **ADDENDUM v2 RATIFIED as
standing pricing law: everything prices at ~38 B/line (conservative) unless
a tighter class is PROVEN from comparable shipped code.** NUL-incident
disposition accepted. Conditions: reviewer scope-map + byte re-derivation;
full rig battery (lighting live, pause cadence, caret carry, value
identity, undo re-light, guards, FEEL per the rider); red-team →
dispositions → reviewer SEQUENCED. **PINNED: the v3.224 deployed verify
rides this slice's deployed smoke** (or runs standalone if the push stalls).

## Self-verify

Parse views.js exit 0 (×3 through the NUL repair) · **views logic 3,346
≤3,450 re-banded ✓** · comment 491 ≤600 ✓ · css 93/60–200 + 112/≤120 ✓ ·
sw ±0 (4,946, version swap only, diffstat 1/1) · T10 innerHTML 0 · T4 seed 0
· ES3 tokens: 1 grep hit = the word "class" inside the R2-guard COMMENT
(comment-only, zero code tokens) · `_recogLightLive` = 2 (def + wiring) ·
scope = exactly views.js/components.css/sw.js.

## Rig live-verify (:8936 fresh port; d0tester + userBooks + st_light_test)

- **Mount pass:** 2/2 lit exactly (Hidden Potential|title · bell
  hooks|author); `yearning` honestly dark; dotted 1px computed; text
  byte-intact; stored body untouched.
- **Caret carry across a LIVE pass (the slice's core proof):** caret placed
  mid-'Potential' INSIDE a lit span → real-typed X → the pause pass ran
  (stale word honestly UNLIT, bell hooks held) → real-typed Y landed
  EXACTLY adjacent: **"PotenXYtial"** — the restore put the caret back to
  the character.
- **Undo → re-light:** app-handler undo (defaultPrevented ✓) → text
  reverted one step → rebuild wiped spans (0) → the selection-change →
  debounce path re-lit the correct set.
- **Fresh title at pause:** typed "Their Eyes Were Watching God" → lit at
  the next pass.
- **Guards, behaviorally:** non-collapsed selection ('draft') SURVIVED the
  debounce window untouched (the pass deferred) · IME: compositionstart +
  real-typed " Hidden Potential again" → **stayed dark through the pause
  window** → compositionend → lit at the deferred pass.
- **F-C at the persistence layer:** autosaved `bodyPublic` === visible text
  byte-exact, ZERO markup, through multiple save cycles with 3 live spans.
- **FEEL (the rider, measured):** live pass (save+unlight+wrap+restore)
  **0.5 ms** on a real doc · eruption-length light (4,600 chars, 120
  spans) **5.1 ms** — both far under a 16.7 ms frame; the 600 ms debounce
  keeps every pass off the keystroke path. **No motion BY DESIGN** (quiet-
  marking law; a fade on underlines is noise) — a design determination,
  disclosed, not an omission.
- **390:** 3 lit, no h-scroll. **Smoke minimum:** Shelf 5/5 · Arcs List ·
  Web 4 SVGs · Notebook renders (0 cards == 0 stored for this origin's
  user; counts match data) + writeline. **Console: zero errors across the
  entire battery.**

## Gate: fix-red-team — 2 BLOCK + 1 HOLD (dispositions below)

- **BLOCK 1 — end-of-doc caret restore mathematically never fires**
  (`posIn(N)` can't satisfy `acc+L >= N+1`; restore silently skips at THE
  most common typing position). My own pre-trace empirically confirmed the
  mechanism (survival in the battery = browser fixup grace, not our law —
  the checkpoint's "restore put the caret back" claim was a mid-doc-only
  proof, honestly narrowed). **FIXED:** posIn clamps null → last text
  node's end (F1 has no exceptions).
- **BLOCK 2 — decoration-blind memo: undo racing the 600ms debounce lands
  text back on the memoized value with spans wiped → pass skips → dark
  FOREVER** (not the ≤600ms self-heal class — indefinite). Correctly
  traced; my rig undo test passed only because it reverted to a
  differently-keyed string. **FIXED:** the skip now also requires the DOM
  to match the memo (spans present, or last pass found none; `lastN`).
- **HOLD 3 — no double-attach guard** (the FEEL test itself invoked a 2nd
  instance on the live editor) → **RS4 below, named not absorbed**.
- Red-team's cleared-list: abs-0 caret ✓ · empty editor ✓ · absOf
  textContent math ✓ · save-before-unlight ordering ✓ · bands/greps/NUL/
  scope/writing-canvas-byte-zero/F-C persistence all independently
  re-derived clean.

## ⛔ MECHANICAL HALT #4 — the BLOCK fixes breach the just-ruled band

| Figure | Measured | Ruled | Verdict |
|---|---|---|---|
| views CODE (hard) | **3,802** | ≤3,450 | **BREACH +352 — entirely the two BLOCK fixes** |
| views COMMENT (soft) | 588 | ≤600 | ✓ (trimmed 895→588) |

The S5 precedent (BLOCK fix = fix + continue) collides with the band law
(breach = halt, never silently widen). Both fixes are SAFETY code — under
Preston's own Slice-7 ruling ("safety code is never trim material") the
only path is his re-band word. Requested: **views CODE ≤3,900**. Parse OK ·
NULs 0 · diffstat 102 insertions surgical · fixes built and measured,
NOT yet re-verified live (the re-probe runs on his word, before reviewer).

## RE-BAND GRANTED (Preston, 2026-07-17): views CODE ≤3,900

Both BLOCKs ratified real; both fixes accepted as safety code (+352 = the
honest cost of the caret law having no exceptions). RS4 stands named.
Conditions: fix re-probe live + explicit (end-of-doc BY LAW; undo-race
driven to re-light); reviewer sequenced after with scope-map + byte
conditions. Addendum-v2 covers future slices; no further re-bands expected
this slice. Measured against the granted band: **CODE 3,802 ≤3,900 ✓ ·
COMMENT 588 ≤600 ✓.**

## Fix re-probe (:8937 fresh port — Preston's two explicit conditions)

- **LAW PROOF 1 (end-of-doc BY LAW, not grace):** terminal-match fixture,
  caret at abs N, real edit → the pass ran (terminal match re-lit; the
  wrap SPLIT the final node into `[span][!]`) and the selection landed at
  **the clamp's exact output signature — the LAST text node ("!") at its
  full length** (grace collapses to parents on removal; it cannot place a
  caret at a specific fresh node-end through a wrap+unlight cycle). Sealed
  by continuation: the next real char landed at the absolute end
  (`…Hidden Potential!?`).
- **LAW PROOF 2 (undo-races-debounce, driven):** typed state B →
  app-handler undo dispatched BEFORE the 600 ms debounce → text reverted
  onto the memoized value with **spans wiped to 0** (the pre-fix
  dark-forever setup, exactly) → the deferred pass **RE-LIT** ("Hidden
  Potential" back). BLOCK 2's fix proven behaviorally.
- Console: zero errors through both proofs.

## Gate: praxis-reviewer — CLEARED TO COMMIT (sequenced post-dispositions)

Scope map exact (helper+fixes · one wiring call · one CSS rule · version
swap — nothing else); bands re-derived (**views CODE 3,803** — the reviewer
caught my trailing-blank classification inconsistency; amended — ≤3,900 ✓ ·
COMMENT 588 exact ✓ · css 93/112 exact ✓ · sw ±0 ✓); BLOCK-fix
implementations match their designs line-for-line; writing-canvas byte-zero;
F-C zero persistence reads; foundations exact; mid-review drift check clean.
Two precision misses quoted + amended here: insertions = **101** (my "102"
counted the `+++` diff header — the recurring confound) and CODE = **3,803**
(trailing blank). Both immaterial to every band.

## Residuals

- RS1 — WebKit/mobile-Safari leg untested (pane is Blink; spike R2's
  standing carry — the deployed felt pass + Slice 11's phone leg own it).
- RS2 — decoration during rapid continuous typing stays absent until the
  600 ms pause (by design, F3 cadence); if the felt pass wants faster,
  the debounce is one constant.
- RS3 — spellcheck-replacement / drag-drop / context-menu-paste mutations
  re-light at the next pass (the S6a T7 class); a mid-word replacement can
  read stale for ≤600 ms. Cosmetic, self-healing.
- RS4 *(red-team HOLD 3)* — `_recogLightLive` carries no double-attach
  guard; a second instance on one editor races timers/memos (the FEEL test
  itself did this in the rig). One call site today, fresh editor per
  render — a future re-render-in-place bug is the exposure. Named; a
  de-dup marker is a one-line candidate for ROOM-3's polish.
