# R-ARC ROOM-2 — THE NOTE DOOR — STARTED

Base `8835d69` / live v3.225. Wave C (Fable 5), Run Mode v2 — **DATA-WRITE
EXCEPTION ARMED: this slice commits LOCAL and HALTS for Preston's explicit
push word regardless of gate results.**

**Post-S7 FELT CHECKPOINT verdict (Preston, relayed): FUNCTIONAL PASS** —
field drag + byte-exact reload · lighting/caret clean incl. both red-team
spots under real hands · C1 landing + honest return + receipt · rail groups.
v3.225 stands. **Intake ratified:** INT-5 (OS scrollbars in the paper world →
ROOM-3) · INT-6 (sparse field undesigned → EMPTY-STATE mandate/ROOM-3) ·
INT-7 (workshop left-column composition → ROOM-3) · INT-8 (field vs gathered
card grammar split → ROOM-3) · **INT-9 (Bloom hint collides with marginalia,
surface-independent → STANDALONE overnight-eligible, NOT a ROOM-2 rider)** ·
RM6 ruled WRONG-feeling (ROOM-3 evidence). **Arc-Field page findings =
pre-Wave-C debt → POST-WAVE LEDGER.** FINISH-CHOREO vehicle deferred to the
post-ROOM-3 slotting.

## Scope (the ruled brief, D5 + D7 + INT-2 a/b/c)

- Route `#note/<id>` — the note as a PLACE (own surface; owner-gated;
  signed-out prompt).
- (a) notebook card BODY opens it (no new FF-8 row action); the Room field's
  lifted entry-cards gain a destination-named "Open the note →" door (tap
  semantics unchanged — the door lives INSIDE the lift, DWF-1-honest).
- (b) DURABLE editing inside it — closes MARG-EDIT. Register-aware:
  marginalia edits through the shared WritingCanvas (the book-detail
  composer precedent, made durable); journal/question edit through a PLAIN
  editor (the canvas's markdown round-trip is NOT identity for single
  newlines — plain registers must never have their newlines rewritten).
  Woven `quote` snapshots NEVER retro-edit (ruled, disclosed).
- (c) PROVENANCE: filed book (door) · arcs · woven appearances (mirror-read
  of subTheories[*].evidence for kind 'entry' + refId) with FF-7-law doors.
- D7: absorbs old Slice 10 — spotlight + #search retarget from bare
  '#notebook' to '#note/<id>'; spotlight's dead `en.title` match removed.
- RM7 recon item: stale evidenceLayout entries (pruning disposition).

## Stage 0 recon (LIVE anchors)

- Router: `renderRoute` parts[]-branches (views.js:561-593 the subtheory
  pair) — `#note/<id>` branch lands beside them; sets no current* pointers
  (a note is not a lens context — T2-adjacent conservatism; disclosed).
- Retarget sites (D7 absorbs Slice 10): spotlight.js:168-176 (`en.title`
  dead match + `route:'#notebook'`) · views.js:902-910 (the #search items
  builder, `route:'#notebook'`).
- Card body: `renderNotebookEntry`'s bodyEl (:14649 region) — click opens
  `#note/<id>` when the click isn't a text-selection (selection-empty
  guard).
- Field door: the field mount's `onTap` override in views.js — tap keeps
  ROOM-1's lift semantics AND injects a destination-named "Open the
  note →" link inside the lifted card (entry-kind only), once.
- Edit paths today (from the Room-brief recon, re-verified): deleteEntry
  (state.js:2044) + the same-session closure update (views.js:14251-14256)
  — no durable edit; this slice closes MARG-EDIT.
- `buildSignedOutPrompt` views.js:2056 (the gate helper, reused).
- **RM7 DISPOSITION: CLOSED as unreachable-today** — grep proves NO
  evidence-removal path exists (`removeEvidence`/`evidence.splice` = 0;
  the two `.evidence = []` hits are init defaults); `evidenceLayout` keys
  are evidence-element ids; dissolve removes the whole record. Re-opens
  with any future evidence-removal feature.
- Register-aware editing law: marginalia = WritingCanvas (markdown
  round-trip is its native format); journal/question = PLAIN editor
  (wcRenderMarkdown → serialize is NOT identity for single newlines —
  plain registers' newlines must never be rewritten).

## Band declaration (Addendum v2: ~38 B/line, branch-derived line counts)

| File | Lines (branch-derived) | CODE (hard) | COMMENT (soft) |
|---|---|---|---|
| js/views.js | ~170 (guards 18 · header 20 · body view 14 · edit 45 · provenance 40 · route 10 · card-open 8 · field door 14 · #search 1) | **+5,600–7,300 B** | ≤1,400 B |
| js/state.js | ~14 (updateNotebookEntryBody) | **+250–600 B** | ≤200 B |
| js/spotlight.js | ~4 changed | **+80–300 B** | ≤80 B |
| assets/components.css | ~30 | **+700–1,500 B** | ≤250 B |
| sw.js | bump v3.225→v3.226 | ±0 | — |

Woven `quote` snapshots untouched — grep-provable (zero writes to
`.quote`). writing-canvas.js/recognition.js/room-field.js untouched. T11
armed (no evidenceLayout reads added anywhere near Yumi).

## ⛔ MECHANICAL HALT #5 — TWO HARD CODE-BAND BREACHES (2026-07-17)

Build complete; parses ×3 exit 0; NULs 0; diffstats surgical; tripwires
clean (quote-writes **0** — the ruled snapshot law grep-proven ·
evidenceLayout 0 · ES3 0 · seed 0 · innerHTML 3 = the standard
`host.innerHTML=''` MOUNT-CLEAR idiom ×3, no user text — named exception,
house pattern).

| File | CODE measured | Declared hard | Verdict |
|---|---|---|---|
| js/views.js | **7,608** | 5,600–7,300 | **BREACH +308 (4%)** |
| js/state.js | 252 | 250–600 | ✓ (floor grazed) |
| js/spotlight.js | 115 · comment trimmed 150→~75 | 80–300 / ≤80 | ✓ |
| assets/components.css | **2,534** | 700–1,500 | **BREACH +1,034 (69%)** |

**Why, honestly:** (1) views — Addendum v2's 38 B/line held; the LINE count
ran 212 vs ~170 derived (the register-aware edit split, provenance rows,
and the lifted-card door each ran longer than derived). (2) css — the real
miss: I priced CSS at JS-ish width when the codebase's own shipped evidence
was in this wave — **ROOM-1's css measured ~124 B/line** (long single-line
rules); 20 rules × ~125 = exactly the ~2,500 built. **Proposed CSS PRICING
ADDENDUM: css prices at ~125 B/line from shipped evidence, always.**
**Scope did NOT drift:** the diff = the note surface + the three ruled
openings + retargets + the setter, exactly the ruled scope. Halted per the
law. Requested: **views CODE ≤7,900 · css CODE ≤2,700** + the CSS addendum
ratification.

## BANDS GRANTED (Preston, 2026-07-17) + TWO PRICING LAWS RATIFIED

**views ≤7,900 · css ≤2,700.** Standing laws: **(1) CSS PRICING ADDENDUM —
css prices at ~125 B/line from shipped evidence; shipped code is the pricing
source for EVERY class.** **(2) LINE-COUNT CONTINGENCY — declared line
estimates carry +20% margin into the hard band** (three slices breached on
line count with density correct; the band catches drift, not estimation
variance). Conditions standing; **data-write exception governs the commit
gate: LOCAL + HALT, no push of any kind without Preston's explicit word.**
Self-caught pre-battery: the lifted-card door stayed visible after unlift
(the lift class clamps only `.rf-body`) → one `:not(.rf-lifted)` rule
(+70 B, css 2,604 ≤2,700 ✓).

## Self-verify

Parses ×3 exit 0 (views/state/spotlight) · NULs 0 · diffstats surgical ·
**views logic 7,608 ≤7,900 ✓ · comment 1,052 ≤1,400 ✓ · state 252/139 ✓ ·
spotlight 115/65 ✓ · css 2,604 ≤2,700 + 96 ≤250 ✓ · sw ±0 v3.226** ·
Greps: `.quote` writes **0** (the ruled law) · evidenceLayout 0 (T11) ·
ES3 0 · seed 0 · innerHTML 3 = mount-clear idiom only (named).

## Rig live-verify (:8938 fresh port; 3-register fixture + woven sub + arc)

- **The surface:** renders complete — markdown body (`<strong>` ×1) + LIT
  (S6c parity, 1 span) · eyebrow "Marginalia · date" · back link · Edit
  button · **provenance 3/3 with exact destination-named doors** (Filed →
  `#book/<id>` · In the arc → `#arc/arc_n2` · Woven into → `#subtheory/
  st_n2` "Open the page →").
- **DURABLE EDIT (closes MARG-EDIT):** Edit → the shared canvas mounts
  with the body → real-typed " EDITED DURABLY." → Done → state updated +
  updatedAt + view re-rendered; **FULL RELOAD → the edit PERSISTS** (the
  closure-death gap, closed).
- **THE QUOTE-SNAPSHOT LAW, LIVE:** the woven evidence `quote` byte-frozen
  before/after the edit AND after reload, while `entry.body` diverged —
  exactly as ruled.
- **Journal newline-safety:** plain render (`pre-wrap`) · plain TEXTAREA
  editor · saved body === `'line one\nline two EDITED\nline three'`
  byte-exact, zero `\n\n` rewrites. Unfiled provenance row honest.
- **Gates:** not-found → honest copy + back link · signed-out → "This
  note is private" prompt, no crash, no body leak.
- **Openings:** notebook card BODY → `#note/<id>` (correct id);
  **selection guard held** (text selected → click → no navigation) ·
  field card tap → lift + "Open the note →" (`#note/n_marg`) **visible
  lifted, `display:none` unlifted** (the self-caught rule proven).
- **Deep links (D7/Slice 10):** spotlight driven live — typed "commons" →
  the note row → click → **routed `#note/n_q`**. #search retarget
  grep-proven (same items builder).
- **390:** surface renders, no h-scroll. **Smoke minimum:** Shelf 5/5 ·
  Arcs · Web 4 SVGs · Notebook + writeline. **Console: zero errors across
  the entire battery.**

## Gate: fix-red-team — 1 BLOCK + 1 HOLD + 2 NOTE (deep, data-loss tier)

- **B1 — the plain editor's silent-loss window was UNBOUNDED** (no
  autosave/blur; the back link + provenance doors always clickable beside
  it) — larger than both house precedents. **FIXED by design resolution:**
  the plain path adopts the CANVAS persistence model (700ms debounced
  autosave + blur flush + Done) and **Cancel is REMOVED — a discard promise
  cannot coexist with autosave** (canvas precedent; the removed lines paid
  for the fix inside the band). Loss window now <700ms, matching the house
  law. **Disclosed for Preston's push-gate read: plain-register edits now
  autosave; there is no Cancel.**
- **H2 — the #note route was the SOLE renderRoute branch not clearing the
  Yumi lens pointers (16-of-17), and my "conservative" framing had the
  polarity BACKWARDS — owned.** FIXED: the standard three-pointer clear +
  saveState, comment corrected.
- **N3 — Done double-write/touch-write** → FIXED globally: the setter
  no-ops on unchanged body.
- **N4 — vestigial `_stMarkOrMote` gate** → simplified.
- Red-team's cleared-list: quote-law 0 writes · Firestore twin rides whole
  entries · naked setter = house pattern (deleteEntry/updateSubTheory
  cited) · wcRenderMarkdown emits no anchors (body-click safe) · field
  door dedup + no cross-card leak · en.title provably always dead · bands
  honest · parses re-run.

## Fix re-probe (:8939 fresh port — all four proven live)

**H2:** #subtheory/X → #note/Y → `currentSubTheoryId/BookId/ArcId` ALL null
(had a sub before). **N3:** Edit → Done with zero changes → `updatedAt`
UNCHANGED. **B1 (the exact BLOCK scenario):** typed in the plain editor →
abandoned via the always-visible back link WITHOUT Done → **the edit
SURVIVED** (`alpha\nbeta EDITED NO DONE\ngamma`, newlines byte-exact).
Console: zero errors. Post-fix bands: **views 7,692 ≤7,900 ✓ · comment
1,349 ≤1,400 ✓ · state 327/139 ✓** (the Cancel removal paid for the safety
code). Parses OK · NULs 0.

## Gate: praxis-reviewer — CLEARED TO COMMIT (LOCAL ONLY; push stays Preston's)

Every gate PASS on the frozen tree: hunk map exact (nothing unmapped) ·
bytes re-derived (views 7,692/1,349 EXACT · state/spotlight exact · **css
CODE actual 2,609 vs my claimed 2,604 — amended: I added an estimated
"+70 B" instead of re-measuring the `:not` rule (75 B); ≤2,700 holds either
way**) · EOL proven by scratch-clone · quote-law zero writes (the single
hit is the law's own comment) · T11 zero (the one hit = an unchanged
context line) · B1/H2/N3 implementations verified in code · honest empty
states quoted · RM7-closure re-verified repo-wide.

## Residuals

- RN1 *(reviewer)* — dead `.note-edit-cancel` selector remains in the css
  compound rule (the JS button was removed by the B1 design resolution).
  Harmless; NOT fixed post-review (frozen-tree discipline) — rides ROOM-3.
- RN2 — the marginalia Done button's blur→flush + explicit update pair
  still double-CALLS (the setter's no-op guard makes the second write
  free); cosmetic call-graph, not data.
- RN3 — provenance renders at mount; a weave made in another tab during
  viewing isn't live-reflected (re-render on revisit; consistent with the
  app's render model).
- RS1-class carry: WebKit leg untested (deployed felt pass owns it).
