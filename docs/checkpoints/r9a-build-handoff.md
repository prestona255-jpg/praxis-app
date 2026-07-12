# R9a — Profile / Galaxy · BUILD HANDOFF (memory-blind, self-contained)

**You are building R9a in a FRESH session. Read this file, then the two docs it points to,
before any code.** SHAPE-B is DONE and felt-passed; this is the BUILD beat only. Do not
re-litigate design — the decisions are locked.

## 0. THE CONTRACT
- **The BUILT target = the v5 mockup, `docs/studio/mockups/profile.html`.** It is self-contained
  (open in a browser). It renders FOUR reference artifacts — owner+visitor × 390+1280. Build the
  live app to match it. It passed Preston's felt pass on 2026-07-12.
- **The full spec = `docs/checkpoints/r9a-shape-a.md`** — the canonical decision stack
  **A1–A8 + AM1–AM52 + the AM44 data-source addendum**, with superseded clauses marked inline.
- **The census / code anchors = `docs/checkpoints/r9a-recon.md`** (Stage-0 recon of the live app).
- **The build log = `docs/checkpoints/r9a-build.md`** (create it; append per-slice PASS/FAIL).

## 1. THE LOCKED SHAPE (one paragraph)
Merge Account + Profile into ONE Profile, canonical at **`#profile`**; `#account` redirects there.
The page is a **galaxy hero for everyone** (no owner/visitor switch): a warm deep-space sky where
**bright gold stars = sub-theories** (the protagonists), **soft tinted planets = categories sized
by books read**, and a **faint dim field = books read**; a tappable **values strip** docks at the
hero base (tap → lights that value's constellation); identity (avatar + name + tagline + "Publishing
as" byline) sits top-left; a clickable counts caption + quiet tap-hint dock at the base. Below a
**gilded seam**, an **uncarded thesis** (the values statement) opens the content, then a
**containment-card system** in DOM/reading order **Statement → Values → By-the-numbers → Open
questions → Now → Published → Settings**; at ≥1200 a **meaning split** places Values/Questions/Now
in the main column (the voice) and **Numbers-only** in the rail (the record), with **Published as a
full-width 3-up closing band** and Settings full-width/quiet. **Owner vs visitor is a CONTENT rule**
(fencing), not a layout switch: visitors see statement · accepted values (published subs only) ·
Numbers (categories-only, no lens toggle) · Published · a published-only fenced sky; owner-only =
Open questions · Now · Settings · Yumi offers · lens toggle · retired-value note · full sky.
**Value-load is EVIDENCE-WEIGHTED (why-lines + orbs + name scale), never numbered.**

## 2. BUILD MANDATE (in order)

### STEP 0 — AM11 STAGING RE-ESTIMATE, FIRST (before writing code)
R9a grew well past the shape the master sequence locked (Numbers view AM11, lens axis AM44,
visitor render AM34, four-frame parity). **Re-estimate the stage plan against the round's
five-beat budget. If it exceeds budget, HALT and present a SPLIT FORK to Preston** — the named
pressure valve: **overview stat row + categories cards ship in R9a; per-category detail / lens
depth move to R9b** (AM11 fallback seam). Do NOT silently absorb the growth.

### STEP 1 — RECON (repo-mapper → read r9a-recon.md; confirm anchors still live)
Key anchors (verify against live before trusting — code may have moved):
- **Merge/redirect:** `#account` → `renderAccountPage()` (views.js ~17680); `#profile` →
  `renderOwnProfile()` (views.js ~16569). Redirect via **`location.replace('#profile')`** (R7
  precedent views.js:521 / 8652 — refresh-stable, no history push) from the `account` route arm
  (~632). **Repoint the nav avatar** `index.html:39` (`#account`→`#profile`); `activeRoute` already
  lumps account|profile|commons|reader|walk (views.js ~415-424) so the highlight survives. Preserve
  any deep-link params defensively (both routes are bare today).
- **Data (ALL EXISTING — R9a is DISPLAY-ONLY aggregation; NO data-model change, NO migration bump,
  EXCEPT the AM8 field, see below):** `valueMarks:[] = {value, why}` on book/sub/arc (ensureBook/
  SubTheory/ArcFields, state.js ~387/644/753); `profile.values:[]` (state.js ~1247, sanitize
  ~1410); migration chain terminates at **1.29.0** (state.js ~3429); **twin merge path**
  integrations.js **221 (arcs) / 278 (subs) / 787 (books)**. Owned enumeration: books
  `state.userBooks[uid].bookIds`; arcs `state.arcs[id].userId===uid`; subs
  `state.subTheories[id].userId===uid` (userId backfilled on merge — confirm present on the render
  path). Categories = `book.categoryOverride||book.category` (17-label taxonomy). Lenses = **AM44
  addendum** (`state.userThemes`, no new store).
- **Aggregation idioms to mirror (build-once-per-render, zero mutation):** `_portraitEmblem`
  (views.js ~16396), `_buildArcSubsIndex` (views.js ~3451). Build a NEW display-only
  `_profileValueLoad(uid)` + per-category / per-lens tallies the same way.
- **Galaxy renderer:** the shipped portrait galaxy `_portraitRenderGalaxy` (views.js ~16147) is a
  SEPARATE code path from the **LOCKED** `renderSubTheoryConstellation`/`renderArcConstellation`
  (arc-constellation.js — **F-D4, do NOT touch**). R9 re-authors the PORTRAIT galaxy to the new
  ontology; the arc-constellation lock does not bind it, but that renderer stays off-limits.
  **`marks.js` PraxisMarks uses HARDCODED hex → do NOT use on the portrait** (tokens-only).
- **`.op-conseq` re-home:** `loadOwnProfileSocial` patches `cNum`/`walkB1` (views.js ~16871-72,
  impl integrations.js ~3151). If R9 reuses that block, re-home the social patch; render an honest
  empty state (PA3). Social counters' real home = R11.

### STEP 2 — AM8 DATA CHECKPOINT (the ONE persisted addition — gated)
The values-statement is a NEW persisted `profile` text field. **Before writing it, present the
data plan as an explicit checkpoint to Preston:** `ensureProfileFields` (or the profile-shape
default + setProfile sanitize) **+ BOTH merge paths (the twin-trap) + migration bump 1.29.0→1.30.0**.
Do NOT silently carry a persisted field. Everything else in R9a is display-only.

### STEP 3 — AM44 DATA-SOURCE PIN
Lens Numbers view aggregates `state.userThemes` ONLY (books/lens = `theme.bookIds.length`
owned-filtered; marginalia/lens = notebook entries whose bookIds ∩ `theme.bookIds`; bar =
lens-books ÷ total). **No new lens list/store.** If it seems to need one → HALT fork.

### RAILS (no-go)
Strict **ES3 in views.js** (var/function only; no const/let/arrow/backtick/class; string concat;
two-arg `.then`; for-loops). **Tokens-only Universal v1.2 + the sanctioned `--field-*-deep`
companion ramp** (add to theme.css/lumen-amber.css, AA-checked per hue — mockup values verified
4.89–7.17:1 on `--surface-2`); **no `--lum-*` in NEW CSS**; no `--register-*`/`--subtheory-*` concat
families; no setProperty seams; **no transform-rig tokens**. Warm ground only (retire `.galaxy-night`
— it was a mockup artifact; NO night ground ships). `deleteBook` = canonical scrub for any data
removal. **prestona255 READ-ONLY always; prestonpraxistest for behavioral write tests** (fresh
throwaway, non-destructive). **Path-explicit staging, never `-A`.** New CSS = new
`@media(min-width:1200px)` blocks AFTER base rules (source order); 759/760 tier untouched.

### STEP 4 — VERIFICATION SUITE (against the BUILT app, not the mockup)
Run the full suite on the D0 rig (local :8760 static-server, SW-clear + cache-bust, `praxis_user`
auth stub, in-memory fixture, direct `renderRoute()`) AND a signed-in `prestonpraxistest` live pass:
- **AM38/AM47 collision proofs** — sample EVERY `.pf-skytext`-equivalent (labels + invitation) on
  the BUILT sky; assert **zero pairwise intersection + zero overflow at BOTH 390 AND 1280**; PRINT
  the measured rects. A claim without the measurement = FAIL. (The mockup's `placeLabels` +
  `placeInvite` emptiest-quadrant engine is the reference — port its guarantees, not hand-nudges.)
- **D1** ≥1200 composition: ≥60% occupancy at 1920 (mockup measured 95%); **D2** prose ≤72ch;
  **D3** zero h-scroll at 1280/1440/1920; **D6** focus-visible on stars/planets/chips/toggle/links;
  **D5** display-only scale. Profile Builder desktop chip upgrades stretched→native ONLY on this
  measured evidence.
- **P1–P9** mobile at true 390: **P3** tap targets ≥44 (mockup: chips 44, stars 46, planets 46);
  **P7** input ≥16px; **P8** zero h-scroll; **P4** safe-area; strip overflow fade (AM48).
- **AA** — every `--field-*-deep` used as text/rail/dot on light passes 4.5:1.
- **AM51 DOM order** = Statement→Values→Numbers→Questions→Now→Published→Settings at every viewport
  (CSS places the rail; keyboard/SR traversal follows the sequence).
- **AM52 visitor live-verify** at 390+1280: categories-only Numbers (no toggle), Published band,
  fenced value cards (published subs only, zero-pub stone stands on why-lines), strip functional
  against the fenced sky (lights published stars only), no owner-only leak.
- **AM39 sky budget:** single SVG render, no per-frame JS after draw-in completes, reduced-motion
  path per canon.
- **Live Forensic Smoke Test** (views.js + shared CSS touched): Shelf + Arcs(List/Web) + Notebook +
  Sub-theory + Book-detail + the merged Profile + console scan; counts == data; no regressions.

### STEP 5 — SHIP GATES
- Both build gates per FIX-PROTOCOL: **fix-red-team** (data-loss/state — the redirect, the AM8
  field, both merge paths) + **praxis-reviewer** (grade before commit).
- **CACHE_VERSION bump `v3.197`→`v3.198` LAST**, one, at the final commit (read the live value at
  commit time and +1 — do not hardcode).
- **COMMIT-NO-PUSH.** HALT at the commit gate per **FIX-PROTOCOL §5 Path B** — Preston's EXACT
  words push. After push: Netlify build → hard-refresh live → confirm v3.198 in DevTools → re-run
  the live pass-checks → Preston's deployed felt pass = the round CLOSE.

## 3. R9b PINS (named — do NOT build in R9a; they must not drop again)
- **In-galaxy selection panel + the full public Numbers view** (the complete set beyond the
  overview row) — lives behind the deferred in-galaxy panel.
- **SKY-LEVEL lens regrouping** (the sky planets regroup by lens) — R9a keeps the sky as
  category-planets; only the Numbers cards toggle.
- **Arc cards · lineage row · curated/destination cross-links** (the R9b arc layer).

## 4. CLOSE-OUT REMINDERS (execute at the ROUND CLOSE, after build+ship+deployed felt pass)
- **FX-1 named re-raise:** the R9 close is a named FX-1 re-raise trigger (data-loss fix round) —
  surface it to Preston; his call whether it jumps.
- **Lens-retirement → R10, now with a THREE-CONSUMER dependency:** the R10 RETIRE-LENSES question
  inherits a new consumer — the lens objects (`state.userThemes`) now feed (1) the shelf's Lenses
  grouping, (2) Yumi's `generateLenses`, AND (3) the profile Numbers lens surface. R10 must argue
  retirement against all three.
- **Pin the LENS-retirement question to the R10 close** (per the round prompt).
- **Re-plan `docs/studio/sequence.md`:** R9a → Shipped; re-set Now; **fold R9b + S-A + the overnight
  batch** and **pin the Desktop Wave DW-1..3 slot after this round** (folded around S-A). Record the
  Numbers-pulled-forward (AM11) + lens-restored (AM44) as deliberate reversals in the Re-plan log.
- **Currency:** update the surface ledger (`docs/studio/profile.md` + `account.md`) + `sequence.md`
  + **BOARD.md** (Profile row: Amber/mobile/desktop/states/logged-out) + re-run `sh tools/studio-build`
  (Builder regen; Profile desktop chip → native ONLY on the measured D-gate evidence).
- **The overnight batch fires only AFTER this close** (or a halted-unpushed state, Preston's call);
  Builder regen must not overlap the batch.

## 5. DEFINITION OF DONE
Live merged `#profile` matches the v5 mockup at all four frames; `#account` redirects; the full
verification suite PASSES with printed measurements (incl. AM38/AM47 at 390+1280); both gates
clear; cache bumped to v3.198; committed-no-push; then Preston's push + deployed felt pass closes
the round.
