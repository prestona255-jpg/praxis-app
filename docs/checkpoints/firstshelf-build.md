# R-FIRSTSHELF — BUILD checkpoint

R-FIRSTSHELF BUILD — sweep-shaped, on base b5f6d4f (docs-only recon, unpushed).
Model: Opus 4.8 default effort. Red-team gate: Sonnet, frontmatter-pinned.
Rulings R1–R6 EXECUTED, not re-derived. Target CACHE_VERSION praxis-v3.277 (bump at S5).

Evidence rule: measured rects (rig, localhost:8795, uid `d0tester` synthetic, force-settled,
L19 hit-tested), never self-report. Privacy pin: counts/ids/titles only.

---

## S0 — GROUND TRUTH — PASS

- HEAD `b5f6d4f` (recon commit) == the base; origin/main `2e99b2f` (ahead 1, unpushed); tree clean.
- CACHE_VERSION `praxis-v3.276`; hook ARMED; FIX-PROTOCOL v1.2.
- Baseline bytes (LF, worktree==blob): views.js 1,103,051 · components.css 873,038 · sw.js 6,041.
- All S1/S2/S3 anchors re-confirmed live against the base (renderShelfCase wall branch, renderShelfDesk
  cap, scanReviewHTML/scanRenderReview/scanWireShell/scanCommitBook, renderLensPanelBody, the `.wall`/desk
  CSS). No dead anchor.

## S1 — FS-1 THE WALL AT LOW BAND COUNT (R1) — PASS · commit `ff8d91f`

**Edit:** `renderShelfCase` (views.js) — `ncols = Math.min(bandCount, shelfWallColumns())`, floored to 1;
`.wall` gains `is-single` when ncols===1. `components.css` — `.wall.is-single{ justify-content:center }` +
`.wall.is-single .wall-col{ flex:0 1 auto; width:100%; max-width:600px }`. PARSE OK. Bytes: views +337,
components.css +251.

**Measured (BEFORE recon vs AFTER), no empty column at any N/width:**

| N (bands) | @1360 BEFORE | @1360 AFTER | @1920 BEFORE | @1920 AFTER |
|---|---|---|---|---|
| 5 (2 bands) | 3 cols `[1,1,0]` — 1 empty | **2 cols `[1,1]`, 0 empty** | 4 cols `[1,1,0,0]` — 2 empty | **2 cols `[1,1]`, 0 empty** |
| 13 (4 bands) | 3 cols | 3 cols `[1,2,1]`, 0 empty | 4 cols | 4 cols `[1,1,1,1]`, 0 empty |
| 40 (10 bands) | 3 cols | 3 cols `[4,3,3]`, 0 empty | 4 cols | 4 cols `[3,3,2,2]`, 0 empty |
| 1 band (single) | — | **`wall is-single`, 1 col, width 600, centered (1360 left 373 ≈ right 388; 1920 left 653 ≈ right 668)** | — | same |

**Self-test (the check CAN fail):** a deliberate violation — a forced 3-col wall over 2 bands — was measured
by the same empty-col check → `emptyCols: 1` → "CHECK CAUGHT IT." The check is not decoration.
**Boundary cases:** bandCount === cols (N=13@1360: 4 bands→3 cols capped; N=13@1920: 4 bands→4 cols) → 0 empty;
bandCount === 1 → is-single centered. Mobile unaffected (the wall isn't built <760).

## S2 — FS-2 THE MOBILE DESK (R2) — PASS · commit `d52ff55`

**Edit:** `renderShelfDesk` (views.js) — `cap = isMobileShelf() ? 2 : 6`. PARSE OK. Bytes: views +362.
**Mechanism used = #1 (cap) ALONE.** Mechanism #2 (cover shrink) NOT applied — the cap alone cleared the
criterion (R2's conditional).

**Measured @390 (fold = 844), case-top under the fold at every N≥1:**

| N (all reading) | desk covers | "+N more" | case-top | under 844? | sum proven |
|---|---|---|---|---|---|
| 1 | 1 | — | **769** | ✓ | 1+0=1 ✓ |
| 5 | 2 | +3 more | **835** | ✓ | 2+3=5 ✓ |
| 13 | 2 | +11 more | **835** | ✓ | 2+11=13 ✓ |

Worst-case margin is thin (**9px** at N≥3). Reported honestly for the felt pass; per R2 the cover-shrink lever
(mechanism 2) is available but NOT applied because the cap alone met the measured criterion.
**Desktop unaffected:** @1360 the desk still caps at 6 (N=13 → 6 covers + "+7 more" = 13, sum proven); the
mobile cap does not leak to ≥760.

## S3 — THE HAND-OFF + THE LENS BEAT (R3/R4/R5) — PASS · commit `95e8021`

### 3a — the tray-empty door
`scanReviewHTML` restructured: count+badge+bands wrapped in `#scan-rv-body`; a new `#scan-rv-done` door
("Everything from this scan is on your shelf." + "View your shelf →") added; back-to-camera stays outside the
body. `scanRenderReview` toggles by `found`: `found>0` → body+foot shown, done hidden; `found===0` → body+foot
hidden, done shown. Wired `#scan-rv-done-shelf` → `location.hash='#books'` (tap only — no auto-nav). CSS
`.scan-rv-done` (centered, canonical `--ink`/`--gold`). **Rig-proven:** confident=2/exc=0 → normal (foot on,
done off); confident=0/exc=1 (found=1) → normal; **found=0 → done shown, foot off, body off, back-to-camera
VISIBLE (rapid-scan preserved), done-button VISIBLE.**

### 3b — the one-time lens offer (auto-offers, never auto-fires)
- **Arm:** `scanCommitBook` sets `praxis_firstshelf_offer_<uid>` = `'armed'` iff absent (grown by scan;
  stored-once — never re-arms over `'used'`/`'dismissed'`).
- **Render:** `buildFirstShelfOffer(user, bookCount)` appended in `renderShelf` between desk and case; renders
  only when the key === `'armed'` AND bookCount ≥ 5 (R5 floor). Copy varies: ≤7 books = honest small-shelf
  line; ≥8 = fuller. Static (no animation → no reduced-motion concern, MO-1 N/A).
- **State machine (rig-proven):** 4 books+armed → no offer (stays armed); 5 → shown, "You've started a
  shelf…"; 13 → shown, "Your shelf is taking shape…"; dismissed/used → no offer; re-arm → returns; ×-click →
  `'dismissed'`+removed; go-click → `'used'`+removed+lens panel opens.
- **⚠ THE OFFER GATE ls KEY:** `praxis_firstshelf_offer_<uid>`. **Re-arm (one line, Preston's console):**
  `sv('praxis_firstshelf_offer_' + getCurrentUser().uid, 'armed')` — then open `#books` with ≥5 books. (This
  is why the gate is NOT keyed to "lenses never generated" — Preston already has lenses; the resettable flag
  lets him felt-test regardless.)

### 3c — render is network-free; tap fires the existing path
Performance-API proof (resets on reload): fresh baseline **0** claude-proxy resource entries → after rendering
the armed offer (no tap) **still 0** (`renderMadeZeroCalls: true`). The hit-tested tap (elementFromPoint at the
button's visible center = `firstshelf-offer-go`, on top + hittable) fired **one** claude-proxy request (log
delta 1→2; 404 on the rig — no cost). Tap routes through `PraxisLensPanel.open()` → `startLensSuggest` (the
existing generation path; no second path built).

### 3d — designed sparse state (R5)
`renderLensPanelBody` (yumi-ui.js): when `done` with 1–2 lenses, prepend an honest framing line. Rig-proven:
1 → "One clear thread so far — more will surface as your shelf grows."; 2 → "A couple of threads so far…";
3 → none; 0 → the existing empty+retry (unchanged).

### ⚠ CO-1 / B1 re-verified
`refreshYumiPanelForAuthChange` (yumi-ui.js): the identity reset `lensSuggestStatus='idle'` +
`lensSuggestLenses=[]` (lines 906–907) sits ABOVE both early returns (`onb.active` return ~916; `!yumiBodyEl`
return 919). Untouched by this round; grep-confirmed order. No new billable call class (the offer reuses the
one shipped generateLenses path; render is free).

### Smoke (views.js + shared CSS → mandated render check)
Shelf N=0 (empty line renders) · Shelf N=13 (5 bands, wall) · Arcs · Notebook — all render; console clean of
my-code errors (only environmental rig noise: openlibrary CORS on cover fetches, 404 on `/.netlify/functions/*`,
camera-not-found from a prior `#scan` visit).

**Byte deltas (LF-normalized):** views.js +4,401 · components.css +1,871 · yumi-ui.js **+614** (worktree shows
+2,732 — the file is CRLF in the tree, blob CR=0; numstat `10 0` = no EOL flip). ES3 clean (no const/let/
arrow/backtick in new hunks).

---

## S4 — RED-TEAM GATE (fix-red-team, Sonnet, fresh context) — 1 BLOCK + 1 NOTE, both cleared

The Sonnet red-team read all three commits in full, re-derived byte deltas independently, and confirmed
CLEAN: S1 column-cap logic + boundaries, S2 sum-proof at every boundary, offer gate under account switch
(uid-keyed at both arm `scanCommitBook` + render `renderShelf`; `renderShelf` clears `#app` so no stale
A-offer survives into B; module lens state reset intact above both early returns), CO-1 no-new-billable-call,
ES3, scope (only the 3 files; sw.js untouched), byte deltas (+337/+251, +362, +4,401/+1,871/+614 all match).

**BLOCK 1 (FIXED · commit `9c3b4ff`):** the tray-empty door gated on `found===0` alone conflated "shelved
everything" with "discarded everything via the walker's *Not a book*" → it could assert *"Everything from this
scan is on your shelf"* when `scanShelve` never ran and zero books were added (reachable on a pure
all-exceptions scan). This is a latent flaw in the ruling's chosen signal (`found===0`), not build-drift — a
correctness fix serving R3's *post-shelve*-door intent, not a design fork. **Fix:** a `scanShelvedAny` flag
(true in `scanShelve` on a real commit; reset in `scanResolveAndFill`), and conditional done-line copy —
shelved → "Everything from this scan is on your shelf."; discarded/none → "None of these were added to your
shelf." **Rig-proven both paths + the reset-on-new-scan.** Fix diff: views.js +16/−1 (LF), ES3 clean, PARSE OK.

**NOTE 2 (closed by measurement):** the `bandCount===0` desktop branch (all books uncategorized → pile, 0
category bands) was code-traced but unmeasured. Measured @1360: `wall is-single`, 1 column, **height 0,
childless, invisible**; the pile carries all books; no h-overflow. Harmless — confirmed, not asserted.

## Intra-stage commits (LOCAL, `--no-verify` — the single sw.js bump rides the S5 final commit)
- `ff8d91f` S1 (views + css)
- `d52ff55` S2 (views)
- `95e8021` S3 (views + css + yumi-ui)
- `9c3b4ff` S4 red-team BLOCK-1 fix (views)

## S5 — cache bump + HALT
- `sw.js` CACHE_VERSION `praxis-v3.276` → `praxis-v3.277` (equal-length version string → +0 bytes).
- Final commit stages `sw.js` + this checkpoint (runs WITH the pre-commit hook — sw.js present, no bare
  source). Then HALT for Preston's push word. **No push.**

## RESIDUALS (named, not folded)
- **S2 mobile margin = 9px** at N≥3 (835 vs 844). Cleared the measured criterion; cover-shrink lever held for
  the felt pass if Preston wants more air.
- Non-goals honored: no rawCategories re-wire, no scan nits (NIT-1/2/3 stay on the scan ledger), no server
  ceiling, no R10 S2, no onboarding copy, no Builder regen, no worktree cleanup.
