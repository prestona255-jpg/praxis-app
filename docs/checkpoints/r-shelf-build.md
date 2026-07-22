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
- diffstat vs `4a3c2e3`: 3 files only (theme +29, components +211, views 2258 changed / net −604L,
  byte −63,557). 0 CR in new content (LF; git blob is LF). No other tracked file dirty.
- byte band: not pre-stated numerically (S1 net-negative — sidebar dissolved, case stubbed; S2
  restores the case and grows it). Measured, not back-derived.

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
