# R-ARC ROOM-3 — WORKSHOP COMPOSITION — STARTED

Base `470d7cf` / live v3.226. Wave C (Opus 4.8, default effort, ultracode OFF —
gate agents Sonnet). **RUN MODE v2, FULLY SELF-RUNNING** (autonomous push on
fully-green; ROOM-3 is display/composition layer, NOT a data-write slice —
no push-word stop). HARD STOPS only at: the mandatory POST-ROOM-3 FELT
CHECKPOINT, a red-team BLOCK I cannot fix, a band breach. RD-1 OUT. ON-8 (Bloom
retire / RD-6) HELD — OUT of ROOM-3. Recon: `docs/checkpoints/r-arc-room3-recon.md`.

## Scope (the ruled brief; felt-brief GOVERNS the design answers)

RD-2 the lengthening page (kills INT-5/RM6 by construction) · RD-3 settled sparse
field + empty state + clip law · RD-4 one-title quiet court + door mirror +
de-carded sheet · RD-5 one card grammar + Gathered panel DISSOLVES · §2a P1
reduced-motion + P2 keyboard + P3 focus coherence · mobile M1-lite §4 · RN1 dead
`.note-edit-cancel` cleanup · RS4 `_recogLightLive` one-line double-attach guard.
FF-1 beat orientation = ABSORBED into RD-4's kicker state. FF-11 (Notebook void)
= governing felt-brief is silent → DEFER (conditional default = debt ledger),
disclosed. RD-6 Bloom = ON-8 HELD, OUT.

FILES: js/room-field.js · js/views.js (`renderSubTheoryBuild` 11163-11971) ·
assets/components.css · sw.js (v3.226→v3.227). state.js EXPECTED ±0 (Fork 4).
NON-GOALS: writing-canvas internals · Connections internals (R10) · yumi-ui.js
(Bloom) · schema/generator/engine · arc-Field (RD-1) · rail/field WIDTH (RM6 =
Preston's felt call).

## FORK RESOLUTIONS (carried per RUN MODE v2 "never ask mid-run"; DISCLOSED at the felt checkpoint)

- **F1 — field always renders.** Remove `if (gEv.length ...)` gate (views.js:11896);
  the field is the sole evidence surface (RD-5) and must show RD-3's empty line
  "Notes you gather will land here" at zero cards. Mechanical consequence of the
  ruling, not a choice.
- **F2 — kind-dependent card door** (honors RD-5 "the door isn't lost" + DWF-1
  no-dead-controls): entry → `#note/<refId>` (ONE click; retires the lift-then-door
  two-step); book → `#book/<refId>` direct (no note surface exists for book-kind —
  proven, renderNoteSurface is entry-only); external → honest lift/expand (never had
  a door). `.rf-door` element + CSS retired.
- **F3 — no invented copy** (subtractive mandate + COPY IS A CONTRACT): reuse the
  existing basin-only `.stb-name-invite` (gold italic) + `.stb-origin-phrase` (ink-3),
  restyled per RD-4 (full-column, never clamped). Named/published subs show only the
  kicker (no new state-varying micro-copy fabricated). The mono kicker "arc · BUILD A
  SUB-THEORY · <GATHERING|DRAFT|FINISHED>" carries arc + state at every lifecycle
  (FF-1 absorbed). The redundant `.stb-into` line drops.
- **F4 — fixed logical V-track for y** (closes the recon's coordinate re-map risk):
  y normalized against a CONSTANT vertical reference, not content-derived height →
  constant divisor → a saved position never re-maps when the field height changes.
  `setEvidenceLayout`'s [0,1] clamp stays valid (state.js UNTOUCHED). x normalized
  against the responsive width track (unchanged semantics — "fraction across width",
  survives viewport per ROOM-1). Field DISPLAY height = max(MIN_H, lowestCardBottom +
  breathing), derived for layout only, never feeds the divisor. **NO data-write:
  positions are re-interpreted at DISPLAY only (read {x,y}→pixels); nothing is written
  to evidenceLayout on load — `setEvidenceLayout` fires solely from the drag-end
  `onMove` (proven: sole caller views.js:11942 ← room-field.js `end()`).** Legacy
  ROOM-1 positions therefore render at new pixels under the bounded/growing geometry
  (inherent to RD-2's ruled change; lossless — stored values intact, cards visible +
  draggable, relative arrangement preserved) — one-time DISPLAY shift, near-zero real
  data (felt rig fresh prestonpraxistest). **Named RM-COORD, disclosed for the felt
  checkpoint** (Preston rules any legacy-preservation preference there — trivial tune,
  no data at stake).
- **F5 — rail/field width untouched** (RM6 = Preston's felt call). Field built
  width-adaptive (card columns = f(paneW)) so a felt-pass widening needs no rebuild.
- **D4 — capture-door seat reserved STRUCTURALLY + comment only.** A visible inert
  capture stub would be a DWF-1 dead control; the field header is left as a flex row
  that can hold a trailing action later, marked by comment. NOT wired to captureNote.
- **Focus (P3)** — door-mirror pill placed OUTSIDE `.stb-rail`/`.stb-conn` (in
  `.stb-main`/top bar) so Focus never swallows a destination-named door.

## BANDS (from recon §7; two-figure — CODE hard ceiling / COMMENT soft allowance)

| File | CODE (hard) | COMMENT (soft) |
|---|---|---|
| js/room-field.js | **+4,600–5,800 B** | ≤1,600 B |
| js/views.js | **+3,800–4,700 B** | ≤950 B |
| assets/components.css | **+3,200–4,300 B** | ≤300 B |
| js/state.js | **±0 expected** (Fork 4 contingency; breach re-opens scope) | — |
| sw.js | ±0 (v3.226→v3.227 version-swap) | — |

Deletions (Gathered panel ~72 views lines + its CSS; `.rf-door`; `.note-edit-cancel`)
REDUCE size but are not priced into the hard `+` ceiling.

## RECON-VALIDATION GATE (fix-red-team, Sonnet) — dispositions

Recon core reproduced byte-for-byte (all anchors, T11=0, RM7=0, T4=0, T1 binary,
innerHTML=0, foundations exact). 2 blocks + 4 lighter — all resolved, no halt:

- **B1 RS4 not censused** → dispositioned HERE: `_recogLightLive` sole call site
  views.js:11383 (def 15021); one render path → single invoke; ROOM-3 adds no
  second call. Ship the one-line double-attach guard (belt-and-suspenders vs a
  future re-render-in-place). CLOSED.
- **B2 F4 "unscoped data-write"** → DISSOLVED with proof: `setEvidenceLayout` sole
  caller views.js:11942 ← room-field.js `end()` (drag-end). NO load-path write; F4
  is display-only; state.js untouched; GO "no new data-write class" holds. Residual
  RM-COORD (legacy display shift, lossless) disclosed for the felt checkpoint.
- **L3 room-field band priced 38 vs proven ~42.6 B/line** → keep the declared bands;
  build LEAN; a CODE-band breach is a SANCTIONED hard stop (never self-widen) — if
  room-field.js exceeds 5,800, halt with the ratified "shipped code is the pricing
  source" re-band justification. Documented, not pre-widened.
- **L4 "Workshop CSS block" anchor interleaves .note-surface** → edit by SELECTOR,
  never by line-range. Noted.
- **L5 sentence-8 "Yumi's single line" vanishes once named** → F3 is consistent read
  in context (the invitation belongs to the unnamed phase); DISCLOSED so the felt
  checkpoint checks it deliberately.
- **L6 D4 seat ambiguity** → resolved: the capture-door seat's LOCATION is reserved
  by COMMENT (documented: the field header, beside the count line); NO visible
  element and NO pre-built flex chrome (a visible inert stub = DWF-1 dead control;
  speculative unused chrome is worse than a marker). R-CAPTURE builds the header
  structure + control when the door ships. Corrected per red-team F5 (the "flex row"
  phrasing overstated — the header is stacked block divs + a marker comment).

## Build order (ONE commit; sub-steps self-verified before the gate suite)

1. room-field.js — RD-2 height model + no-scroll + RD-3 collision spawn + empty
   state + clip-law + tap→onTap contract + P1 reduced-motion + P2 keyboard.
2. views.js — RD-4 kicker/court/door-mirror/de-card + RD-5 dissolve + merged field
   header + F2 kind-door onTap + F1 always-render + D4 seat comment + RS4 guard.
3. components.css — field mechanics/carved/clip/growth + court/kicker/topbar +
   de-card sheet + quiet Connections + remove dead .rf-door/.stb-gathered/
   .note-edit-cancel + empty-state + P1 media query + P2 focus-visible + mobile §4.
4. sw.js — bump v3.226→v3.227.

## Tripwire greps (at self-verify + red-team)

T11 `evidenceLayout` in yumi-brain.js = 0 (re-prove) · T1 no third sub-theory status
· T4 no 'seed' in touched ranges · T10 innerHTML zero user-text (new card/door text
= textContent) · ES3 (no const/let/=>/class/backtick) · foundations md5 unchanged.

## Gate sequence

self-verify (parse ×N · byte deltas vs bands · greps · EOL · T11=0) → fix-red-team
→ dispositions → praxis-reviewer on FROZEN tree → rig live-verify → push (autonomous
on green) → DEPLOYED SMOKE (live sw.js cache-busted ×2 + battery, prestonpraxistest
ONLY) → POST-ROOM-3 FELT CHECKPOINT (HARD STOP — deliver §3 FELT CANON checklist +
push ledger, wait for Preston).

## SELF-VERIFY (post-build, working tree)

Parse ×2 exit 0 (room-field.js · views.js) · ES3 added-lines clean · NULs 0 (×4) ·
brace balance 3996/3996 · foundations md5 UNCHANGED (lumen `9879ddb8…` · marks
`772886c0…`) · EOL all blobs LF (`i/lf`, working flips immaterial) · staging scope =
only the 4 build files.

Tripwires: **T11 evidenceLayout in yumi-brain.js = 0** · T10 innerHTML in
room-field.js = 0 (card text = textContent) · T4 'seed' = 0 · no load-path
evidenceLayout write (setEvidenceLayout sole caller = drag-end onMove).

Byte deltas re-measured AFTER the red-team + rig fixes (current tree — the earlier
table was stale, per red-team F1):

| File | CODE added | CODE band | COMMENT | soft |
|---|---|---|---|---|
| js/room-field.js | **4,820** | 4,600–5,800 ✓ | 1,562 | ≤1,600 ✓ |
| js/views.js | **2,957** | 3,800–4,700 ✓ (▼floor: RD-5 dissolve is a big deletion) | 1,311 | ≤950 ⚠ |
| assets/components.css | **2,964** | 3,200–4,300 ✓ (▼floor: dead-CSS removal) | 716 | ≤300 ⚠ |
| sw.js | ±0 (v3.226→v3.227) | — | — | — |

CODE ceilings all respected. views/css CODE under-floor — NOT a breach (ceiling is
the hard constraint; the floor is a rewrite-pricing estimate that a minimal-diff +
large deletions legitimately beats; every ruled behavior present + rig-verified).
**COMMENT overages** (views 1,311/≤950 · css 716/≤300): 100%-comment, zero code
hiding, CLEARED BY CLASSIFICATION (non-halting); trimmed hard (views 2,065→1,311 ·
css 1,444→716); remainder is load-bearing RD-2/RD-5/F2/D4/RS4/RD-4a provenance —
not silently widened. L3 (recon priced room-field at 38 vs proven 42.6): moot — the
minimal-diff landed inside the recon's own band regardless.

## GATE: fix-red-team (Sonnet) — 2 BLOCK + 3 residual, ALL dispositioned

Clean-list (independently verified): no data-write regression (setEvidenceLayout sole
caller = drag-end onMove; state.js byte-identical) · T11=0 · T4=0 · T10=0 · foundations
md5 unchanged · dead selectors 0 live refs · F2 fall-through correct · door pill
Focus-immune · pub/openPage moved-not-duplicated · RS4 guard present · ES3 clean ·
brace 3996/3996 · scope = 4 files.

- **B1 — the rfield crash + stale tree.** Mid-review the tree carried
  `rfield = createRoomField(...)` with NO `var` → strict-mode `ReferenceError` →
  100%-reachable crash of the Build surface (blank #app). **FIXED before the review
  ended** (`var rfield`, confirmed). Root cause of the churn: I was fixing rig-caught
  bugs while red-team ran. DISPOSITION: re-ran self-verify against the CURRENT tree
  (table above) + ran the live smoke on the committed code (rig section below). The
  parse-gate cannot catch this class (syntax-only) — the rig load did.
- **B2 — spawn-jitter had no high-side x-clamp.** `layoutAll()`'s spawn+jitter
  clamped only `pos.l < 0`, so a jittered card at the last column could overflow the
  field's right edge 1–3px at column-boundary widths (violates Felt Canon 1 / RD-2
  "never off-frame horizontally"). **FIXED:** added `if (pos.l > xTrack()) pos.l =
  xTrack();` (mirrors the drag clamp). Rig-verified: 9-card + 4-card fields, maxRight
  ≤ canvas width, 0 overflow, 0 page h-scroll.
- **N3 — aria "Open:" false for non-opening cards.** external + orphaned entry/book
  cards lift (no door) yet announced "Open:". **FIXED:** views passes a per-card
  `opens` flag (entry-with-note / book-with-book → true; external/orphan → false);
  room-field sets `aria-label = (opens?'Open: ':'') + kindLine`. Rig-verified: entry
  "Open: marginalia · …", book "Open: book", external "external", orphan "note ·
  original removed".
- **N4 — P1 reduced-motion media query promised, not shipped.** DISPOSITION (F4,
  documented, not a fix): the field is MOTION-FREE by design — no CSS transition/
  animation on card position or canvas height, `window.scrollBy` non-smooth — so
  growth/settle is instant for every user; P1 (instant place + relax) is satisfied
  vacuously, nothing to gate. Substitution disclosed (S7 "no motion by design"
  precedent).
- **N5 — D4 "structural" overstated.** DISPOSITION: L6 corrected above — seat is a
  comment-marked LOCATION, not pre-built flex chrome.

## RIG LIVE-VERIFY (:8944 fresh port; d0tester stub; injected 3-kind + 4-kind + empty + 9-card fixtures)

- **Composition:** topbar (kicker "arc · BUILD A SUB-THEORY · DRAFT|GATHERING|FINISHED")
  + corner (Finish + Open-the-page pill) · court (name = sole display scale; no h1/into) ·
  sheet DE-CARDED (bg transparent, border 0, radius 0) · field CARVED (`stb-field-pane`,
  inset shadow, NOT `.stb-source`).
- **RD-2:** `.rf-pane` overflow visible; canvas width = real column (475), height
  content-derived (470/610/808px by card count), **NO inner scroll on either axis**;
  relayout post-attach places against the real width (placed card left 195 = 0.6×(475−150)).
- **RD-3:** empty field = "Notes you gather will land here" @180px; spawn row-major;
  clip-law line-clamp:4; no card off-frame (F2 clamp).
- **RD-5/F2:** Gathered panel gone (0 `.stb-gathered`/`.rf-door`); count folded into
  the field header ("3 passages — what this piece stands on · arrange freely, never
  interpreted"); one-click door by kind (entry→#note, book→#book, external→lift).
- **Drag:** synthetic mouse → card moved +60/+70 → onMove wrote `{x:0.1846,y:0.0529}`
  = exact `L/(475−150)` and `T/1400`, both in [0,1]; drag≠tap (no nav).
- **Basin court:** GATHERING kicker, Finish dormant ("Name it to finish"), Dissolve.
- **Smoke (global CSS bleed):** Shelf(#books) `shelf lum-amber-deep` + covers · Arcs
  11 glyphs/42 arc els · Notebook writeline · **console ZERO errors across the whole
  battery.** No page h-scroll anywhere.
- RIG note: pane screenshots dead → geometry/DOM/computed-style + synthetic events at
  real listeners are the evidence (ROOM-1 precedent). Real-gesture drag + Preston's
  eyes = the deployed felt pass.

## §3 FELT CANON — the acceptance block (verbatim; measured FEEL STANDARD at final pass)

1. The field reads as ground you own, never a window onto somewhere else — nothing
   off-frame horizontally, no inner scrollbar on any axis.
2. You can always place a card below the lowest card without entering a mode — the
   ground lengthens under your hand.
3. The workshop is one desk — one title, one sheet, one field — the same note never
   appears on two surfaces at once.
4. Every card sits fully on the ground; no note is ever cut by an edge, panel, or pane.
5. New cards settle onto open ground without touching what you've placed — your
   arrangement never moves unless your hand moves it.
6. An empty field is quiet ground with one line of ink; no furniture in the void.
7. A short field beside a long sheet is CORRECT — height reflects contents, never
   padded to look fuller.
8. The name is the only large thing on the page, and it asks nothing.
9. Acts read by kind: status breathes, modes toggle, doors face top-right in
   destination-named pills, Finish sleeps until the name exists.
10. Nothing floats bare over content — every layered element carries its own ground.
    (ROOM-3 adds no bare-floating chrome; the pre-existing Bloom caption is ON-8/HELD,
    disclosed — RD-6 is OUT of this slice.)

Riskiest felt ambiguity (§9): RD-2a drag-boundary growth (proves only under a moving
hand). Second watch: the settled sparse field reads COMPOSED, not merely uncrowded
(sentence 7 the counter-test).
