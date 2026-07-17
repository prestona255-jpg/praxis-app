# R-ARC ROOM-1 — THE FIELD — STARTED

Base `ee01554` / live v3.223. Wave C (Fable 5), unattended run-mode. Charter +
all 8 rulings recorded in `r-arc-room-brief.md` (appendix). **T11 in force from
this slice** (evidenceLayout never enters Yumi context). Commit LOCAL, HALT for
push word.

Scope (per the ruled brief): the SPATIAL FIELD — gathered evidence as draggable
cards beside the prose canvas (D1), positions per sub-theory (`evidenceLayout`
additive, T3 both paths, owner-write-path via the workshop), free x/y never
interpreted (D6/T11), M1-lite mobile (native pan; press-hold drag; tap; D2 — the
rail list stays, permanent floor), **+ C1 (D3 ruling): create LANDS in the Room**
with the honest-return rider. FF-1/composition = ROOM-3, not here. Tap in ROOM-1
= lift/expand (own-state, honest — the note DOOR is ROOM-2's; no dead promise).

## Stage 0 recon (LIVE anchors, this session)

- Create tail: views.js:2640-2654 — `notebookCreateSubTheory` ends
  `nbGatherSave(); renderNotebook();` with the S4 comment RECORDING the removed
  navigation ("was location.hash = 'subtheory/' + st.id"). C1 restores
  navigation (to `/build`) by Preston's D3 reversal; the comment gets updated
  to record the reversal. The newborn RECEIPT already persists
  (`notebookNewborn` :1675, S2-persisted via nbGatherSave, renders on return
  :2250-2251, cleared at next gathering :2241 / dismiss :2496) — the receipt
  requirement is ALREADY BUILT; C1 keeps it.
- Return gesture: NO back affordance exists in the workshop (grep tb-back/
  stb-back = zero). Design: a one-shot module flag set at create-navigation;
  `renderSubTheoryBuild` renders a destination-named "← Back to the notebook"
  chip when arrived-from-create. Browser back also works (hash nav).
- Rail column: the field pane mounts ABOVE `.stb-gathered` in `.stb-rail`
  (D1: beside the prose, one surface; the rail column IS beside the prose).
  Rendered only when evidence exists (no dead region).
- evidence element ids are stable (`genEvidenceId`, state.js:2409) — the
  layout key.
- `ensureSubTheoryFields` (state.js) = the T3 chokepoint; both load paths call
  `ensureSubTheoryFieldsAll` (plan T3, verified in Wave B) — an additive
  `evidenceLayout` object ensure rides both automatically.
- D8 reconciliation recorded in the brief appendix (gate shipped
  views.js:11287-11295; FINISH-CHOREO = the named remainder).

## Design

- **NEW FILE `js/room-field.js`** — `window.createRoomField(mountEl, opts)`;
  pure display+interaction, caller passes data (no global reads): logical
  canvas 1200×900; pane `overflow:auto` (native 2-axis scroll = M1-lite pan
  free, desktop + touch); cards absolutely positioned at normalized×logical,
  clamped in-bounds; deterministic grid default for unplaced evidence
  (index-based, no randomness); mouse drag immediate, touch drag via 350ms
  press-hold (pre-hold touchmove yields to native pan), 6px tap/drag
  threshold; tap toggles `.rf-lifted` (expanded full passage, own-state);
  drag-end → `opts.onMove(evId, x, y)` normalized. All text via textContent.
- **state.js:** `evidenceLayout` ensure in `ensureSubTheoryFields` (+{}) ·
  `setEvidenceLayout(subTheoryId, evId, x, y)` — clamps 0..1, writes
  `{x,y}`, `markSubTheoriesDirty()` + `saveState()` (drag-end discrete; the
  S2 no-loss law).
- **views.js:** field pane in the rail (head + the ruled constraint as copy:
  "arrange freely — position is never interpreted") + mount + onMove →
  setEvidenceLayout; C1 navigation + comment update; the return chip.
- **CSS:** `.stb-field-pane/.rf-*` in the lum-amber-deep region + mobile.
- index.html script line after recognition.js; sw.js precache + v3.224.

## Band declaration (two figures, DENSITY-CLASSED per the standing lesson)

| File | Class | CODE band (hard) | COMMENT allowance (soft) |
|---|---|---|---|
| js/room-field.js (new) | interaction ~30 B/line | **4,800–7,600 B** | ≤1,500 B |
| js/state.js | algorithmic ~25 B/line | **+350–900 B** | ≤300 B |
| js/views.js | DOM ~38 B/line | **+1,200–2,600 B** | ≤600 B |
| assets/components.css | — | **+600–1,500 B** | ≤250 B |
| index.html | — | +40–80 B | — |
| sw.js | — | precache +25–45 B; bump v3.223→v3.224 ±0 | — |

Tripwire greps at gates: T11 (`evidenceLayout` in yumi-brain.js = 0) · T3
(ensure rides both chokepoints) · T9 (no new creation path — C1 changes a
LANDING, not a door) · T10 (textContent only) · T4 (no 'seed').

## ⛔ MECHANICAL HALT #2 — TWO HARD CODE-BAND BREACHES (2026-07-17)

Build complete; all four parses exit 0; tripwires all clean at first grep
(T11 0/0 · T4 0 · T10 0 · ES3 0 · T3 chokepoints 9+5). Soft overages
(state comments 612→**281**≤300; views 1,003→**544**≤600) cleared by trim
per the law. Measured against the declared hard bands:

| File | CODE measured | Declared hard | Verdict |
|---|---|---|---|
| js/room-field.js | **5,429** | 4,800–7,600 | ✓ |
| js/state.js | **680** | 350–900 | ✓ |
| js/views.js | **2,734** | 1,200–2,600 | **BREACH +134 (5%)** |
| assets/components.css | **1,611** | 600–1,500 | **BREACH +111 (7%)** |

**Why:** the views estimate priced ~60 DOM lines; the build is 72 (the
field-card kind-derivation carries the same 3-branch shape as the gathered
panel — inherently wide). 72 × 38 = 2,736 ≈ measured 2,734 — **the density
class was RIGHT; the LINE COUNT was underestimated.** Pricing-lesson
addendum: count lines from the design's actual branch structure, not gut
feel. CSS: the rf-card rules are long single-line declarations (~250 B each).

**Scope did NOT drift:** the diff = the field + C1 landing + return chip,
exactly the ruled ROOM-1 scope. Halted per the standing law (code breach =
halt; never silently widen). Options to Preston: (a) re-band at measured +
small headroom (views ≤2,800 · css ≤1,700 — rail precedent); (b) any
code-shrink here is a DESIGN change (fewer card branches / plainer card
chrome) — his call, not a mechanical trim.

## RE-BAND RULED (Preston, 2026-07-17) — option (a)

**views.js CODE ≤2,800 · components.css CODE ≤1,700**; soft allowances stand
as trimmed; (b) DECLINED (card branches are ruled design, not trim material).
Conditions (rail-precedent): reviewer maps the diff to exactly the ruled
scope + re-derives classification; full gate suite incl. real-drag rig
battery, press-hold, persist→reload, C1 chain, 390 pan, smoke minimum.
**The pricing-lesson ADDENDUM is accepted as STANDING: line counts price
from the design's branch structure, not gut feel.** D8 reconciliation
presented at the commit-gate HALT (recorded in the brief appendix).

## Self-verify (post-re-band)

| Gate | Result |
|---|---|
| Parse ×4 | room-field.js · state.js · views.js · sw.js — **all exit 0** |
| room-field.js bands | **logic 5,429** (4,800–7,600 ✓) · comment 1,490 (≤1,500 ✓) |
| state.js | **logic 680** (350–900 ✓) · comment **281** (trimmed 612→281, ≤300 ✓) |
| views.js (re-banded) | **logic 2,734 ≤2,800 ✓** · comment **544** (trimmed 1,003→544, ≤600 ✓) |
| components.css (re-banded) | **logic 1,611 ≤1,700 ✓** · comment 79 (≤250 ✓) |
| index.html / sw.js | +1 script line · precache line + v3.224 (±0 version) |
| Tripwires | **T11: evidenceLayout in yumi-brain.js = 0, in assembleContextData = 0** · T3 chokepoints 9+5 + ensure-unit proven live · T4 0 · T10 0 · ES3 0 |

## Rig live-verify (:8934 fresh port; fixture st_room_test 3-kind evidence + d0tester arc)

- **Field render:** pane FIRST in the rail (field → gathered → source), ruled
  copy verbatim ("arrange freely — position is never interpreted"), 3 cards
  with correct kind lines at deterministic grid defaults (58/365/672px),
  pane scrollable both axes.
- **Drag (real handler chain; see RIG note):** mousedown→mousemove→mouseup
  moved the card exactly +120/+90 (58→178, 39→129); `evidenceLayout.rv1`
  written **normalized 0.1854/0.1654 — math exact** (178/960); dragging
  class cleared.
- **Persist → FULL RELOAD:** position survived byte-exact (178px/129px)
  after reload + re-stub (localStorage round-trip, S2 law).
- **Tap:** lift → `rf-card rf-lifted` → unlift, own-state both directions.
- **Press-hold touch:** synthetic TouchEvent sequence through the real
  handlers — hold (>350ms via round-trip) ENGAGED drag (`rf-dragging`),
  moved +70/+50, layout written; **yield case: immediate touchmove before
  the hold = NO move, NO write, no drag class** (pan preserved).
- **C1 chain (real UI):** Gather link clicked (card control enumerated —
  it's an `<a>`, not a button) → gather bar → "Choose an arc" → picker →
  "Room Test Arc" → Create (enabled) → **route `#subtheory/<new>/build`,
  landed in the Room, arc eyebrow correct, return chip present**
  ("← Back to the notebook" → #notebook) → chip clicked → **notebook shows
  the newborn RECEIPT ("gathering · just now" + "Open the workshop →")**.
  No stranding in either direction. (Landing assertion needed a second
  call — hashchange routing is async after the click's task; recorded.)
- **390:** field full-width (325px), pan works (scrolled 200/150), **no
  page h-scroll**, 3 cards present.
- **Smoke minimum:** Shelf **5/5 once each** · Arcs List content · Arc Web
  4 SVGs · Notebook renders + writeline + receipt. **Console: zero errors
  across the ENTIRE battery** (drag, touch, C1, resize, smoke).
- **RIG note:** pane screenshots remain dead AND `left_click_drag` requires
  a prior screenshot → real-gesture drag is unavailable in this pane (same
  limitation class as S6a's modifier keys). Sanctioned fallback: synthetic
  Mouse/TouchEvents dispatched at the module's REAL listeners. Corroborate
  on real Chrome at the deployed felt pass.

## Residuals

- RM1 — drag not exercisable as a true OS gesture in the rig (above);
  deployed felt pass is the real-gesture gate.
- RM2 — the field renders the same uncapped evidence set as the gathered
  panel (RR8's disposition inherited).
- RM3 — card default positions overlap beyond 12 cards (grid rows exceed
  the 900px canvas at ~12+); harmless (drag apart), named for ROOM-3's
  composition pass.
- RM4 — `evidenceLayout` entries for REMOVED evidence linger (never pruned);
  inert bytes, self-healing on dissolve/delete? NOT verified — named for
  ROOM-2/3 recon.
- RM5 — VISUAL GATE: Preston's deployed eyes (pane screenshots dead).
- RM6 *(red-team NOTE 5)* — the 288px desktop rail is a KEYHOLE onto the
  1200×900 canvas: scrolling is the PRIMARY mode of use at the shipped
  width, not incidental. Named for the felt pass + ROOM-3's composition
  (wider field emphasis / auto-center are design calls).
- RM7 — `evidenceLayout` entries for removed evidence linger (RM4 renamed;
  ROOM-2/3 recon owns pruning).

## Gate verdicts + dispositions

- **fix-red-team: no BLOCK — 2 HOLD + 3 NOTE.** T11 traced CLEAN at depth
  (assembleContextData field-picks `header` only; gatherArcContext picks
  header/bodyPublic/evidence-quotes; the PUBLIC projection whitelists
  header/bodyPublic/markShape/markColor — evidenceLayout reaches neither);
  Firestore clean (userSubTheories owner-gated, NO hasOnly — the write
  syncs; load-side ensure twin confirmed at integrations.js:277-279).
  Dispositions, all FIXED + re-probed live on :8935:
  HOLD 1 (no touchcancel → stranded rf-dragging) → **FIXED** (`onTouchCancel`
  full reset; re-probe: engaged hold + cancel → class reset, ZERO write, tap
  intact after). HOLD 2 (document-listener leak on unmount mid-drag +
  dead destroy) → **FIXED** (mm/mu self-heal: `document.contains(el)` guard
  drops the stale pair and never writes). NOTE 3 (NaN passes typeof) →
  **FIXED** (`x !== x` guard). NOTE 4 (flag not consumed on early returns)
  → **FIXED** (consumed at function entry, ALL paths — no stale chip ever).
  NOTE 5 (keyhole) → **RM6, named not absorbed**. Post-fix: parses ×3 OK;
  bands re-held (room-field 5,970/7,600 + 1,450/1,500 · state 755/900 +
  281/300 · views **2,785/2,800** + 598/600); drag re-proven.
- **praxis-reviewer: CLEARED TO COMMIT** (graded against the FINAL settled
  tree — it detected the mid-review tree churn from the red-team fixes via
  repeated SHA1 hashing and settled on stability; process note: future
  parallel dispatches should sequence reviewer AFTER red-team dispositions,
  or expect exactly this). Byte re-derivation matched the post-fix numbers
  exactly; **flag accepted: views 2,785/2,800 and 598/600 — NO further
  views.js edits this slice.** Scope map clean (all hunks = field + C1 +
  chip; the two ruling-record doc diffs disclosed as docs-ride-with-diff).
  T3 chokepoints traced live (state.js:3112/3133/3574 +
  integrations.js:277-278). T11 traced at all 3 candidate leak sites. D3
  comment reversal verified; T9 one-door held (landing change, not a door).
  Y-axis normalization math also verified exact (129/780=0.1654).
