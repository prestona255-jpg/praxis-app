# R-SHELF BUILD — checkpoint

Model: Opus 4.8, default effort. Base HEAD `4a3c2e3`; rollback tag **`pre-rshelf`** @ `4a3c2e3` (pin 8, set before S1).
CACHE_VERSION `praxis-v3.241` → **v3.242** (bumped at S4). Mockup parity: `r-shelf.html` @ `rshelf-mockup d3bfb59`.
Recon: `docs/checkpoints/r-shelf-build-recon.md`. Brief v4 = law; mockup = parity; shelf-look = picture.

## RULED (this session)
- **D1** g0–g3 = marginalia count → `0→g0, 1–2→g1, 3–5→g2, 6+→g3` (g0 = absence).
- **D2** ember = `valueMarks.length ≥1 → marked`, `≥2 → heavy`.
- **D4** DESK LINE = **carrying-question-OR-NOTHING**. No "still reading" text (removed at elevation R2). Line renders only when a question exists (none authored yet → renders nothing). Desk MEMBERSHIP = still-reading books (`status==='reading'`); empty desk (no still-reading) → "Nothing in hand right now." Carrying-question AUTHORING = named seam for **R-CAPTURE**.
- **D5** Covers|**Compact** density seg (cosmetic `--cover-w`); the live **List view retires**.
- **F7** keep `renderShelfBookRow(book,isAlight,arcs)` signature stable; flag dead `_accountBuildCategoryPanel`/`renderAccountPage` tree (16695) for S-B.

## PINS
1 signed-out hard gate preserved exactly · 2 Sort dropdown retires (order-by-life) · 3 keep live "Ask Yumi for more lenses" · 4 mockup dev chrome (state/wheat/reduced toggles + brief banner) does NOT ship; reduced-motion via media query only · 5 self-run S1→S4, HALT only on unruled Q or a gate failing twice (fix-once→revert→abort) · 6 Builder regen ONCE at S4 · 7 praxis-reviewer gates close, red-team not required · 8 tag `pre-rshelf` (done) · 9 behavior-preservation inventory → S4 acceptance card (PRESERVED/RETIRED-BY-RULING) · 10 lazy-load below-fold covers, pre-sized slots = zero CLS, spine fallback on 404/hang, S4 initial-render number @1360+390 · 11 real empty states judged on real conditions.

## CANON PROPOSALS (draft at S4, Preston ratifies, rides close docs)
a lessons: "Major surface rewrites tag base (pre-<round>) before slice 1" (pre-umber/pre-rshelf).
b inventory ROW 9 — BEHAVIORS (PRESERVED evidence / RETIRED-BY-RULING citation).
c inventory STATES row judged on real conditions, never dev toggles.
d lessons: "Media loads into pre-sized slots — zero CLS; a failed asset renders its fallback, never a hole."

---

## SLICE LOG

### S1 — THE SHELL — DONE (local commit, --no-verify; sw.js bump rides S4 per §6)
Files: `assets/theme.css` (+tokens), `assets/components.css` (+bookcase CSS block), `js/views.js`
(renderShelf rewrite + helper cluster + getShelfGrouping default + module vars).

**Token additions (theme.css, HARD RULE #1 — hex→token map):** `--shelf-cavity #efe7d6`
(cavity + recessed controls — light-safe twin of --surface-2 which flips dark on the shelf's
dark route) · `--board-face #e3d8c1` · `--board-under #b9a97e` · `--spine-cloth #4a3f4d` ·
`--gold-ink-on-gold #3d2807` (the shelf's established gold-ink literal, tokenized for new rules) ·
`--wheat-* (13)`. **All other colors wire live tokens** (--ink/--gold*/--field-* re-pointed light
by the :12688 block; --ink-2/-3/-4 re-pointed to --card-* in the new block; --page-2/--line-page/
--scrim/--card-* light-safe; register tick = live --register-<tradition>; status = live tokens).
Only shadow/glow **rgba** remain inline — the shelf's existing convention (12610/12612).

**Ground-check (L8):** the shelf sits on body[data-ground=dark] → --surface-2/--border/--ink-2/3/4
FLIP dark. New CSS re-points --ink-2/3/4→--card-* and uses --shelf-cavity (not --surface-2). No
--lum-* in new CSS (Law 6).

**CSS integration:** ADDITIVE (design-canon §2). New R-SHELF block appended after the MW-1 block
(components.css), source-order wins; the AES-2 sheet (:12729), Manage sheet (:12890), Select bar
(:12845) PRESERVED untouched (NON-GOALs). Old .shelf-book/.shelf-grid/.shelf-layout rules become
unmatched (new DOM = .cavity-cover/.case/.wall) — harmless.

**JS:** `renderShelf` rewritten (shell: strip + slim-header[search+mode-seg+carried Manage/Add/
Select+value-chips] + desk + empty case + focused container + editor/scan/arc-picker hosts +
selectbar). Helper cluster replaces `renderShelfBook` (shelf-only): buildCoverNode, renderShelfDesk,
buildShelfWheat, applyShelfIllumination, shelfUpdateSearchEmpty, compute helpers (alight/arcs/
valueCounts), utils (glowTier/values/match/spine/otherLens/hash), renderShelfCase STUB (S2 fills).
`arcFieldHue` KEPT; `renderShelfBookRow` UNTOUCHED (F7). getShelfGrouping default 'lenses'→
'categories'. Pin 2: Sort dropdown NOT rebuilt (retired). List view NOT rebuilt (D5 → Covers|Compact
runtime density). Pin 4: no mockup dev chrome shipped.

**MECHANICAL GATES — all PASS:**
- parse-check (cscript ES3): `PARSE OK: js/views.js` exit 0.
- ES3: arrow/backtick/const/let declarations in new code = 0 (the one `=>` is a pre-existing
  comment @11565; 37 backticks are pre-existing strings/comments; parse-check would fail on real
  ES5 syntax — it passed).
- diffstat vs `4a3c2e3` (COMMITTED S1 numbers — corrected after the reviewer caught a mis-stated
  figure; the earlier "net −604L / −63,557B" was a mid-splice PowerShell working-tree reading taken
  BEFORE the getShelfGrouping + module-var edits, not the committed blob delta): **js/views.js 707
  insertions / 1551 deletions (net −844 lines); bytes 1,051,460 → 1,011,557 = −39,903** (LF blobs).
  assets/components.css +211L; assets/theme.css +29L. 0 CR in new content (LF; git blob is LF). No
  other tracked file dirty. (Authoritative round total is the S4 byte reconciliation below.)
- byte band: not pre-stated numerically (S1 net-negative — sidebar dissolved, case stubbed; S2
  restores the case and grows it). Measured from the commit, not back-derived.

**LIVE VERIFY (rig :8793, prestonpraxistest-shaped stub d0tester, 5 seed books, cache-busted):**
| gate | 390 | 1280 | 1360 | 1920 | state |
|---|---|---|---|---|---|
| wheat strip height | 64 | 104 | 104 | 104 | PASS |
| topmost head below strip top | +4px | +4px | +4px | +4px | PASS (≥2) |
| stalks clipped | 0 | 0 | 0 | 0 | PASS |
| h-overflow (scrollW≤innerW) | 390≤390 | 1265≤1280 | 1345≤1360 | 1905≤1920 | PASS |
- Desk: 5 still-reading books render; **empty-desk path** → "Nothing in hand right now." (pin 11) PASS.
- Header: search + mode-seg(2) + Manage + Add present; count "5 books · 5 reading · 0 finished". Value
  chips 0 (seed has no value marks → hidden, correct). Case empty (S1 stub, caseChildren 0).
- Signed-out HARD GATE (pin 1): seedRig({signedIn:false}) → "Your shelf is private", no strip/desk/
  case, no crash. PASS.
- CSS bleed (L8): Notebook / Arcs / Home render intact, **0** stray .horizon-strip/.desk/.case/
  .cavity/.wall. PASS.
- Console: clean (0 errors) across the full sweep.

RIG NOTE: initial page-load on the rig lands blank (app bootstrap quirk in the headless pane); the
route is unchanged from live and `renderShelf()` renders correctly when driven — the sanctioned rig
pattern (drive render per width; elevation-pass-2 precedent). Not a route regression.

S1 verified. Proceeding to S2 (the case).

### S2 — THE CASE — DONE (local commit, --no-verify)
Files: `js/views.js` (renderShelfCase full + band/wall/life/pile/lens helpers, replacing the
S1 stub), `assets/components.css` (pile-row flex-wrap P8 guard + cover-area margin reset).

**JS:** `renderShelfCase` (bands by mode; categories = book.category via classifyBookLocal + the
carried lazy-classify orchestration `shelfMaybeClassify`; lenses = userThemes, multi-membership A2;
genre-baseline is NOT a grouping axis — A2 needs the multi-membership store) · `shelfLastTouched`/
`shelfLifeSort`/`shelfBandLifeKey` (order-by-life §11, memoized on shelfCtx.touch) · `shelfWall-
Columns` (2/3/4) · `buildShelfBand`/`buildShelfShelfline`/`buildShelfBandHeader` (labels inert
spans in S2) · `shelfBuildPile` · `shelfBuildLensRow` (F7, live copy "Ask Yumi for more lenses",
pin 3) · `isMobileShelf`. THE WALL masonry = shortest-column fill in life order, a band never splits.

**Order-by-life mapping (pinned):** lastTouched = max(latest marginalia createdAt/updatedAt,
finishedAt, addedAt). Verified: fx_1 (added 52d ago, 3 marginalia) + fx_2 (36d, 6 marginalia) both
bump to today; Literary Fiction lead-3 = the 3 marginalia books; within-band descending; band order
by most-recent member.

**Two bugs caught + fixed in S2 verify (recorded — the reasoning was the defect):**
1. **GRAVITY 16px stagger** — the carried `.shelf-book-cover-area` class inherits `margin-bottom:16px`
   from the old card CSS; `flex-end` aligns the MARGIN box, so cover feet sat 16px above spine feet.
   Fixed: `margin:0` on the new cover-area rule. Re-measured 0px. (Carried-class collision, L8-adjacent.)
2. **pile h-overflow risk** — a large uncategorized set in a no-wrap pile-row would h-overflow (P8);
   added `flex-wrap:wrap; row-gap:22px`.

**MECHANICAL:** parse-check `PARSE OK` exit 0. ES3 (var/function only).

**LIVE VERIFY (rig :8793, d0tester, 145-book at-scale fixture across the 17 real SHELF_CATEGORIES
+ 5 uncategorized + injected marginalia [g1/g2/g3] + 2 userThemes + 1 bad-URL cover; cache-busted
via the neutral-page SW-kill dance + rig.bustCss):**
| gate | 390 | 1000 | 1280 | 1360 | 1920 | state |
|---|---|---|---|---|---|---|
| wall columns | 1 (single) | 2 | 3 | 3 | 4 | PASS |
| gravity worst intra-row foot spread | 0px | 0px | 0px | 0px | 0px | PASS (≤1) |
| band splits across columns | — | 0 | 0 | 0 | 0 | PASS |
| See-all tiles ≥760 | n/a | 0 | 0 | 0 | 0 | PASS |
| h-overflow (scrollW≤innerW) | 390≤390 | 985≤1000 | 1265≤1280 | 1345≤1360 | 1905≤1920 | PASS |
| h-scroll shelflines | — | — | — | — | 0 | PASS |
- Aspect 2:3 on 123 real covers: worst dev **0.7%**, 0 over 6%. PASS.
- Order-by-life: primary (marginalia) + finishedAt + addedAt floor; within-band descending; both modes. PASS.
- Marks: 23 spines (cover-less + bad-URL 404 fallback), 60 embers (value marks D2), glow g1/g2/g3 = 1/1/1. PASS.
- Illumination (Law-1 rider): value chip → 121 dim / 24 lit, opacity 0.32, **cavity ground
  239,231,214 before==lit** (unchanged). PASS.
- Lens mode: 2 userTheme bands + A2 "also under" ×2 (fx_1 in both) + yumi-row "Ask Yumi for more
  lenses"; no pile in lens mode. PASS.
- PIN 10: all 145 book-slots exactly 96×144 (zero CLS); 122/122 cover imgs `loading="lazy"`; bad-URL
  cover → spine (never a hole). PASS.
- masonry column-balance delta 738px @1920 (flagged, structural — life-order binds the fill; matches
  the elevation-pass-2 638–795 band; felt-pass call).
- Console: clean (0 errors).

S2 verified. Proceeding to S3 (focused view + mobile See-all).

### S3 — FOCUSED VIEW + MOBILE SEE-ALL — DONE (local commit, --no-verify)
Files: `js/views.js` (buildShelfShelfline mobile 2-row See-all cap; buildShelfBandHeader mobile
label→button; buildShelfBand passes group info; +openShelfFocusedBand/closeShelfFocusedBand).

**JS:** A1 mobile cap — at <760, a band with > (perRow×2) books renders (perRow×2 − 1) covers + a
See-all tile (2 shelf rows). §3.7 "the case opens" — mobile band labels are BUTTONS; clicking a
label OR a See-all tile opens `#shelf-focused` (built on demand: back button + title/count + one
cavity with ALL band books, `focused:true` → status word shown); the strip, desk, header, and case
are hidden (absent, §3.7). Back restores them. Desktop labels stay inert spans (focused view is
mobile-only). shelfFocused guards the resize re-render (don't rebuild the case under an open focus).

**MECHANICAL:** parse-check `PARSE OK` exit 0. ES3.

**LIVE VERIFY (rig :8793, d0tester, 145-book fixture, fresh via neutral-page SW-kill):**
- 390: **12 See-all tiles**, each capped at exactly **6 cells** (5 covers + tile = 2 rows of 3);
  17 label buttons + 1 inert pile span; no h-overflow. PASS.
- Focused view (label click): shown; strip/desk/header/case ALL hidden (§3.7); title "Arts & Culture",
  all band covers, status word shown, back button present, no strip inside. Back → strip/case restored. PASS.
- Focused view (See-all click, large band): "See all 7" → focused shows all 7, no nested See-all. PASS.
- Console: clean.

S3 verified. Proceeding to S4 (close).

### S4 — CLOSE — DONE (final local commit; NO PUSH — awaits Preston's push word + felt pass)

**Close deliverables:**
- Acceptance card (CLOSE): `docs/checkpoints/r-shelf-acceptance-close.md` — every brief v3 §3–§4 + v4
  §11 law sentence VERBATIM, walked 390 + 1280/1920, all PASS (Law 8 governs); OWNER felt rows blank.
- Behavior-preservation inventory (pin 9): 20 live behaviors, each PRESERVED (evidence) or
  RETIRED-BY-RULING (D5 List·Compact / pin 2 Sort / F4 status·author·tradition rails). Nothing silent.
- Completeness inventory: 8 rows × both surfaces, no MISSING; + proposed ROW 9 (Behaviors).
- Trial verdicts + canon proposals a/b/c/d: drafted in the acceptance-close doc, PROPOSED for Preston.

**INTERACTIVE-CONTROL SWEEP (CLAUDE.md gate — every control fired live, own-state + effect @1280):**
search (dim/lit) · mode toggle (lens is-on + aria + case is-lens; re-shelves) · value chips (illum) ·
Manage open/close (aria-expanded) · Covers|Compact density (case cover 68px / 96px) · Select
(armed→"Done" + is-selecting + checks visible) · pick → selectbar has-pick + count · Add → editor host
mounts · arc-thread reveal (arcs-open + chip title, injected arc) · Scan/Barcode/Bulk/Resolve/Tidy
(present + wired) · band-label→focus + See-all→focus + back→restore (390). ALL PASS.

**PIN 10 initial-render (145-book fixture):** 74.7ms @1280 · 83.5ms @1360 · 46.5ms @390 — imperceptible
for a one-shot render; slots pre-sized 96×144 (0 CLS); 122/122 covers lazy; bad-URL → spine.

**BYTE RECONCILIATION (base `pre-rshelf` blob → working tree):**
- js/views.js −26,051 (sidebar/rail machinery dissolved → leaner bookcase) · assets/components.css
  +39,216 (bookcase block) · assets/theme.css +2,608 (new tokens) · sw.js +0 (equal-length version).
- FOUNDATIONS INTACT: lumen-amber.css 14,966 · marks.js 10,255 (both unchanged). views.js 0 CR (LF).
- NON-GOAL confirm: js/state.js + js/integrations.js UNTOUCHED (not in the diff) — display-only, zero
  schema/state/data-writes. Byte-locks unbroken.

**Cache:** sw.js CACHE_VERSION praxis-v3.241 → **v3.242** (the one bump, §6/pin 6).
**Builder:** `tools/studio-build` regenerated `docs/studio/builder.html` (rides this commit, pin 6).
**Docs currency:** sequence.md (Re-plan log + ## Now bullets), BOARD.md (row 4), books.md (round
history + frontmatter render_fn 3730→4501; stale-anchor note recorded honestly).
**Gate:** praxis-reviewer (pin 7) — verdict recorded below; red-team not required (display-only).

**RESIDUALS / FLAGS (felt-pass judges; none block the build):**
- Claude-specced dials: uniform-cover variance 5.5%; wheat desktop strip 104px (96–120 midpoint);
  masonry column-balance delta 738px @1920 (structural — life-order binds the fill).
- Order-by-life live signal RESOLVED as built (marginalia/finishedAt/addedAt); desk carrying-question
  AUTHORING = named R-CAPTURE seam (D4).
- Rig SW-stickiness: JS freshness needed the neutral-page SW-kill dance (documented); not a ship issue.

**REVIEWER GATE (pin 7) — HOLD → RESOLVED (fix-once, pin 5).** praxis-reviewer returned HOLD with 2
blocking + 1 non-blocking finding; all addressed in this commit and re-verified live:
- **BLOCK 1 — zero-books empty-state regression (Gate 9).** The new renderShelfCase rendered a BLANK
  case for a 0-book library (the old rich empty state was dropped). FIXED per pin 11 / Law 4: a
  zero-books branch in renderShelfCase renders one quiet line ("Your shelf is open — add your first
  book…") + the Add primary; renderShelfDesk suppresses its "Nothing in hand" line when the whole
  library is empty (no double-empty). Live-verified: empty state shown + Add mounts the editor; normal
  path (17 bands) intact; console clean.
- **BLOCK 2 — S1 checkpoint byte/line delta mis-stated (Gate 3/10).** The S1 "net −604L / −63,557B"
  was a mid-splice PowerShell working-tree reading, not the committed blob delta. CORRECTED to the
  committed numbers (707 ins / 1551 del / −39,903 B) in the S1 slice log above.
- **NON-BLOCK — dead `.desk-demo-toggle` selector (pin 4).** Removed from the mobile 44px rule (it
  referenced excluded mockup dev chrome; 0 live DOM matches).
Re-verify after fixes: parse-check `PARSE OK`; zero-books + normal path + Add live; console clean.
Red-team not required (display-only, no data writes).

**THE ROUND CLOSES ON PRESTON'S DUAL FELT READ (390 phone + desktop) ON PRODUCTION.** No push until
his exact push word.
