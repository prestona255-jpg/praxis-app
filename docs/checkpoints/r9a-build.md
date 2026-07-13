# R9a — Profile / Galaxy · BUILD LOG (per-slice PASS/FAIL)

Contract: the v5 mockup `docs/studio/mockups/profile.html` (felt-passed 2026-07-12). Spec:
`r9a-shape-a.md` (A1–A8 + AM1–AM52 + AM44 addendum). Recon: `r9a-recon.md`. Handoff:
`r9a-build-handoff.md`. Discipline: FIX-PROTOCOL v1.2 Path B (commit-no-push), plan-file protocol.

---

## STEP 0 — GROUND TRUTH + AM11 STAGING RE-ESTIMATE (pre-build gate)

### 0.1 Ground truth (session start, 2026-07-12)
| Check | Expected | Result |
|---|---|---|
| `sh tools/ground-truth` | HEAD bb631aa, hook armed, v1.2, 7 agents | ✅ HEAD `bb631aa`, ARMED, FIX-PROTOCOL v1.2, 7 agents |
| HEAD == origin/main | equal | ✅ `bb631aa` == `bb631aa` |
| tracked tree clean | clean | ✅ empty porcelain (tracked) |
| sw.js CACHE_VERSION | v3.197 | ✅ `praxis-v3.197` (sw.js:10) |
| code moved since recon (91fe74b→bb631aa)? | docs-only | ✅ only SHAPE docs changed; **no** views/components/state/integrations/sw/index touched → recon anchors hold |

### 0.2 Anchors re-confirmed FIRST-PARTY (not doc-trusted)
- Merge target: `renderOwnProfile` js/views.js:16569 (681 L) · `renderOtherProfile` :17250 (visitor, **preserved**) · `renderAccountPage` :17680 (~1380 L). Merged surface ≈ **2060 L** today.
- Reuse idioms all present: `_buildArcSubsIndex` :3451 · `_portraitAxisData` :15862 · `_portraitGalaxyLayout` :15956 · `_portraitFieldTensions` :16003 · `_portraitRenderGalaxy` :16147 · `_portraitEmblem` :16396 · `arcFieldHue` hash→`--field-N` :5491.
- Route arms: `activeRoute` lumps account|profile|commons|reader|walk :415 · `parts[0]==='profile'` :681 · account arm dispatch (recon :632).
- Data: migration terminus **1.29.0** (state.js:3427-3439) · twin merge `ensureArcFieldsAll` integrations.js:221 / `ensureSubTheoryFieldsAll` :278 / `ensureBookFieldsAll` :787 · **no** profile-ensure on merge (profile via `getProfile`:1350 / `setProfile`:1361) · `SHELF_CATEGORIES` 17-label taxonomy state.js:497 · `categoryOverride||category` resolver :615 · `userThemes` shelf-lens reader views.js:4605 (AM44 source).
- Field hues: bright `--field-1..10` **LIVE** (universal-depth.css; components.css:1711/11650/12385 fallbacks). **`--field-*-deep` ABSENT** → AM26 ramp is a real add to theme.css/lumen-amber.css (AA-checked; mockup supplies verified 4.89–7.17:1 values).
- CSS home: `assets/components.css` (13,440 L / 626 KB); tokens `assets/theme.css`, `assets/lumen-amber.css`.

### 0.3 AM11 RE-ESTIMATE — the slice plan (7 build slices + verification)
| # | Slice | Files | Band (net new/chg) | Gate |
|---|---|---|---|---|
| 1 | CSS foundation: `--field-*-deep` ramp (AA) + full `.pf-*` port (base + `@media min-width:1200px` after base) | theme.css, lumen-amber.css, components.css | +~9–13 KB CSS | AA proof per hue; global-stylesheet smoke (no bleed) |
| 2 | **AM8 data layer (GATED)**: migration 1.29.0→1.30.0 + profile-shape default + `setProfile` sanitize + BOTH merge paths | state.js, integrations.js | +~40–70 L | fix-red-team; migration idempotent; twin-trap proof; round-trip |
| 3 | Aggregation helpers (display-only ES3): `_profileValueLoad`, per-category + per-lens tallies (AM44), overview stats, gaps (reuse `_portraitFieldTensions`), published list, star→field derivation, AM22 hue map | views.js | +~250–400 L | parse-check; probe each shape on fixture |
| 4 | Galaxy renderer `_profileRenderGalaxy` + ES3 collision engine port (`placeLabels`/`placeInvite`) | views.js | +~180–300 L | parse-check; single SVG render (AM39); reduced-motion |
| 5 | Page composition `renderProfilePage` (hero→thesis→values→numbers→questions→now→published→settings; DNA carry; fencing; DOM order AM51) | views.js | +~350–550 L | parse-check; both modes render |
| 6 | Interactivity + a11y (star/planet/chip/toggle/counts/preview/offer/edit; strip AM37/AM48; focus/keyboard D6/AM23) | views.js | +~180–280 L | parse-check; each interaction fires |
| 7 | Route flip + finalize: `#account`→`location.replace('#profile')`; `#profile`→`renderProfilePage`; nav avatar index.html:39; retire old renderers; keep `#reader` | views.js, index.html | +~30–80 L / −~2000 L (old renderers) | forensic smoke; redirect refresh-stable |
| V | Verification suite + **cache bump v3.197→v3.198** (LAST commit) | sw.js | +1 L | full suite printed; both gates |

**Total ≈ 1200–1800 net LOC across 6 files + 1 schema migration + the project's FIRST ≥1200 composition tier + full verification suite + 2 adversarial gates.**

### 0.4 BUDGET VERDICT
Large but **cohesive** (one page, one renderer, one CSS block; the mockup is a near-complete blueprint — port + ES3-convert + wire real data, not design). The AM11 pressure valve (defer per-category cards + lens depth to R9b) saves only ~10–15% of effort while **breaking the felt-passed v5 contract** (the mockup shows the full category grid + lens toggle in every owner frame) and leaving Numbers as a thin, un-felt-passed 5-stat row. **Recommendation: build the FULL v5 mockup as a 7-slice Path-B staged build; do NOT invoke the AM11 split.** Split fork presented for Preston's call per STEP 0.

### 0.5 FORKS surfaced to Preston (HALT — awaiting word before any code)
1. **Budget:** full v5 build (recommended) vs AM11 split (per-category cards + lens depth → R9b).
2. **DNA carry:** the v5 mockup surfaces A1's named DNA (Yumi offer/confirm/rename/reject, gaps-as-questions, settings + Your-data + sign-out) — all present. It does **not** surface the reader-model **threads / journey / returns** apparatus that lives on today's account page (not named in the R9a shape, not in the mockup). Fork: keep them (owner-only, appended) · defer them to a follow-up · or drop. Recommendation: **keep as owner-only sections** appended in the voice column (no-regress), pending felt-pass placement.
3. **AM8 data plan** (STEP 2 gate): the ONE persisted addition — see 0.6.

### 0.6 AM8 DATA PLAN (presented for explicit word)
- New field `profile.statement` (string, the values-statement prose; thesis reads it, Settings edits it).
- Default in the profile shape; `setProfile` sanitize (trim, string-coerce, cap length) alongside `values` (state.js:1410 pattern).
- Migration **1.29.0 → 1.30.0** (state.js:3439): backfill `statement:''` on existing profiles.
- **Twin-trap:** profile is not `ensure`-d on the Firestore merge like arcs/subs/books. Plan: add the default on the profile merge/load path so a record synced from an older client gains the field (mirror the ensure-on-merge intent for the profile object). Exact merge site pinned in Slice 2 recon.
- `deleteBook`-class scrub: N/A (no data removal).

### 0.7 PRESTON'S RULINGS (2026-07-12) — STEP 0 gate cleared
1. **Budget → FULL v5 build.** No AM11 split. Parity to the v5 mockup at all four frames is the target.
2. **DNA carry → KEEP threads / journey / returns as owner-only sections** appended in the voice column (no regression of shipped reader-model UI); final placement gets Preston's felt pass.
3. **AM8 data plan → APPROVED as specced** (§0.6). `profile.statement`, migration 1.29.0→1.30.0, twin merge default, fix-red-team gates it before the route flip.

**STATUS: STEP 0 CLEARED. Proceeding to STEP 1 (line-level touch-site recon) → Slice 1.**

---

## STEP 5 — SHIP GATES + cache bump (both gates run; HOLD items remediated)

### fix-red-team (full build) — NO BLOCK-COMMIT
Re-derived from source: Condition-1 CLEAN (no reachable path re-renders old renderers), AM8 intact, redirect byte-identical to the R7 /marks precedent (refresh-stable, no back-trap, cold-open-stable), retrofit accept no-wipe (getProfile-fresh + case-insensitive dedup + setProfile MERGE), aggregation read-only, `_pfPreview` cannot stick true. Findings: **F1** (residual — surfaced below); **F4** (retrofit dedup un-trimmed → FIXED, trim-before-compare views.js addValue); F2 (cache bump, done); F3 (builder stale, close-out); F5 (preview reset on bg merge → safe default, nit).
- **F1 RESOLVED (Preston, 2026-07-12): ACCEPT AS-IS** — the profile matches the shipped light surfaces (R5 Arcs + arc-field, identical values; R5 on-gold precedent); consistency with the felt-passed app wins. **CLOSE-OUT LEDGER (S-B polish candidate):** "tokenize the shared light-skin values app-wide" — three surfaces (R5 Arcs 1707-08, arc-field 12408, Profile 13458-59) now share these literals; a single shared light-skin token set would DRY them.
- **F1 SURFACED (Preston's conscious call):** `.pf-root` re-points `--ink-2:#645940 / --surface:#fffdf8 / --surface-2:#efe7d6` — **verified these MATCH the shipped light surfaces** (R5 Arcs 1707-08, arc-field 12408 use the identical values; 3 blocks total). The red-team compared to theme.css `[data-ground]` canonical (#4d3b2a/#fcf6e8), which is the DARK-ground baseline the light surfaces intentionally override — so the profile is **consistent with the light app, not drifting from it**. The residue: some on-gold/on-dark inline literals (`#fff4dc`, `#2a1a06`, `#3a2408`, `#fff2cf`, `#3a2a14`) follow the R5 precedent (R5 arcs hardcodes `#3d2807` for on-gold text). **Preston's call: accept the mockup-fidelity literals (consistent with the felt-passed light app), or tokenize app-wide as an S-B polish item.** Not R9a-specific; no bleed; AA-safe where text.

### praxis-reviewer (full build) — HOLD → 3 items REMEDIATED + re-verified → CLEARED
Verdict HOLD on 3 blockers; everything else independently verified clean (ES3, foundation MD5 locks, byte/EOL hygiene, AM8 twin, Condition-1 dead-code proof, no-bleed, AA reproduced 4.89–7.17 exactly, DOM order, fencing). Remediation (per its own clear-criteria: fix + re-run parse + diff sweep):
1. **sw.js CACHE_VERSION** v3.197→**v3.198** (read live +1). ✓
2. **`--lum-*` leak (7 sites)** — the rail forbids `--lum-*` in NEW CSS; I'd carried `var(--lum-gold)` from the mockup. **FIXED:** introduced `--star-gold:#ffce4a` (scoped in `.pf-root`, preserves the felt-passed star brightness), swapped all 7 (5 CSS + 2 SVG). Verified: **zero `--lum-*` in the R9a CSS block or the views.js profile block; `--star-gold` resolves #ffce4a live.**
3. **Returns/Journey empty-state regression (AM20 / no-regression)** — returned `''` on zero data (section vanished). **FIXED:** both now render the eyebrow + an honest invitation line on empty. **Verified on a sparse-user rig render** (returns + journey eyebrows + invitations present, no crash).
- Doc residual noted by reviewer: the Slice-1 log figure (208/0) is stale vs final components.css 227/0 (later 5b/P7 additions) — expected, not a defect.

### Post-remediation re-verify (fresh SW-cleared reload)
- parse-check views.js = PARSE OK · braces 3728/3728 · `--star-gold` live #ffce4a · sparse returns/journey show invitations · **rich render intact** (3 stars/7 planets/4 value cards/orphan/retrofit/yumi-mount/returns/journey) · **collision proof @1280 still 0/0** · console clean.

### FINAL byte deltas (7 files, all additive-dominant, no EOL flip)
`views.js 954/9 · components.css 227/0 · state.js 41/3 · integrations.js 9/1 · theme.css 9/0 · index.html 1/1 · sw.js 1/1`. New file: `docs/checkpoints/r9a-build.md`.

**STATUS: BUILD COMPLETE + VERIFIED. Both gates satisfied. Cache = v3.198. HALT at the commit gate (FIX-PROTOCOL §5 Path B) — awaiting Preston's exact words to commit + push.**

**SHIPPED v3.198 `e25ac6f` (pushed; origin synced). Deployed felt pass = STRONG PASS + 8 live defects → PATCH v3.199 (below).**

---

## POST-DEPLOY PATCH — v3.198 → v3.199 (Path B; deployed felt pass STRONG PASS + 8 defects)

### ⚠ NAMED LESSON (P2) — PROOF-SCOPE NARROWING
The shipped AM47/AM38 collision proof asserted **text-vs-TEXT pairs + overflow ONLY**. The
mandate was **"no sky text intersects sky OBJECTS"** (stars + planets too). A star sat ON the
"Psychology & Mind" label on the deployed sky at ultrawide — invisible to a proof that quietly
narrowed the claim to a subset it could pass. **LESSON: a verification assertion must restate the
FULL mandate, never a convenient subset. The green check is only as honest as the claim it makes.**
(Joins the VISUAL-GATE + AM17→AM38 lineage: computed/measured proof is necessary, never sufficient
when the assertion itself is narrower than the requirement.)

### ⚠ NAMED LESSON (P1) — FIXTURE-SHAPE
The DNA-carry data-shape bugs (returns "undefined — undefined marks"; journey empty descriptions) SHIPPED to
v3.198 because the 42-book verification fixture NEVER carried live-shaped threads/journey/returns data — I
assumed `{title,author,n}`/`{text,label}` from a partial grep instead of reading the real return shapes
(`{ph,ct}` / `{ts,when,said}`). **LESSON: any builder that reads a live data shape must be verified against a
fixture carrying that exact shape; a green render on a shape-incomplete fixture proves nothing about the
fields the builder actually reads.** (Sibling of the FORENSIC-SMOKE lesson: function-level green ≠ live-shaped
green.)

### PATCH SET (diagnosis → fix)
- **P1 — DNA-carry data-shape family (ONE root cause):** my carried builders read shapes the
  42-book fixture never covered. REAL shapes (read from source): `_portraitReturnsData` → `{ph:<html>, ct:<str>}`
  (I read `{title,author,n}` → "undefined — undefined marks"); `_portraitJourneyData` → `{ts, when, said:<html>}`
  (I read `{text,label}` → empty descriptions). **Reader-model threads VERIFIED CLEAN** — `buildThreadItem`
  reads `thread.label` (schema state.js:1473) with a `(untitled theme)` fallback. Fix returns+journey to the real fields; re-verify on an ENRICHED fixture (author/addedAt/createdAt/multi-note/dup-lens/threads).
- **P2 — collision engine WIDENED:** `_pfPlaceLabels` must avoid stars AND planets, not just placed labels. Proof set = text-vs-text + text-vs-star + text-vs-planet + overflow, at 390/1280/1920, all printed.
- **P3 — duplicate lens cards:** DIAGNOSIS = data-side duplicate `userThemes` records (aggregation iterates each once). Fix = defensive dedup-by-name in `_profileLensStats` (display-only, NO stored mutation) + report the data finding.
- **P4 — strip chevron** gates to ACTUAL overflow (CSS: hide `.pf-strip-more` unless `.overflow`).
- **P5 — published excerpts** strip leading markdown markers (`> `/`#`/`-`/`*`) in `_pfExcerpt`.
- **P6a — Numbers header** unify to one layout across toggle states. **P6b — `.rm-toggle` teal = SHIPPED account precedent** (`.account-readermodel .rm-toggle-on{background:var(--marginalia-color)}` components.css:9452) → **LEAVE IT** (Lane G owns DNA re-skin).
- **P7 — interim wiring (approved):** category cards + planets → `shelfFilter.category` + `#books`; lens cards → `shelfFilter.theme` + `#books` (both filters exist — 5244/5211; no invented route).
- **P8 — visitor + empty statement:** OMIT the thesis section entirely for a visitor when statement is empty (owner keeps the write-this placeholder + edit affordance).

### PATCH VERIFICATION (enriched fixture — real shapes the 42-book fixture missed: author/addedAt/createdAt, multi-note books, DUP lenses 2×Theory+3×History, markdown-prefixed bodies, reader-model threads) · ALL PASS
- **P1 returns FIXED:** "Education 1 — your densest margins · 12 notes", "you return to *William James* · across 6 books" (was "undefined — undefined marks"). **journey FIXED:** "May 2026 — You opened with *Education 1* by bell hooks", "You named your first lens — *Theory*" (was empty). **threads VERIFIED CLEAN** (buildThreadItem `.label`).
- **P2 WIDENED PROOF @ 390 / 1280 / 1920 — ALL PASS:** text-vs-text=0, **text-vs-star=0, text-vs-planet-core=0**, overflow=0 (rects sampled: 6–8 texts, 3 stars, 7 planet cores). Object def stated: star cores + planet visible cores (engine avoids star±10 + planet prad×0.5). *(P2 lesson applied: assertion restates the full "no text on objects" mandate.)*
- **P3 FIXED:** 6 dup records → 3 cards (Theory/History/Desire canon); **console.warn fires** the data finding; **stored userThemes NOT mutated** (display-only dedup).
- **P4 FIXED:** 1 chip → `.pf-strip-more` `display:none` (no overflow); 4 chips @390 → chevron shows.
- **P5 FIXED:** "Some silences are taught." / "The sentence that will not resolve…" (leading `> ` / `#` stripped).
- **P6a FIXED:** Numbers header stable across toggle states (caption/toggle top+right identical: 835/835/1201 both). **P6b:** teal = shipped precedent → LEFT.
- **P7 WIRED:** category card "Education" → `shelfFilter.category='Education'` + `#books`; lens 'ln2' → `shelfFilter.theme='ln2'` + `#books` (cross-axes reset; existing routes only).
- **P8 FIXED:** visitor+empty → thesis OMITTED; owner+empty → placeholder + edit present.
- **Forensic smoke:** Shelf/Arcs/Notebook render, no `.pf-` bleed. **AA untouched** (deep ramp unchanged; `.pf-returns-ct` reuses the shipped `--ink-3` secondary-meta pattern).
- **Gates:** parse-check views.js PASS · braces 3733/3733 · zero `--lum-*` in new code · patch deltas views.js 71/15, components.css 9/2, sw.js 1/1 (additive, no EOL flip) · dirty = {views.js, components.css, sw.js, r9a-build.md} (state.js/integrations.js correctly untouched — display-only patch). Cache **v3.198→v3.199**.

**STATUS: PATCH COMPLETE + VERIFIED (Preston's specified suite). Cache v3.199. HALT at the commit gate (Path B) — awaiting exact words to commit + push.**

---

## STEP 1 — line-level touch-site recon (before any edit)

### Route / nav (Slice 7)
- `index.html:39` nav avatar `href="#account"` → `#profile` (keep `data-route="account"` — the umbrella token; `activeRoute` 415-424 returns 'account' for #profile so highlight survives).
- Route arm `#account` js/views.js:632-639 → `location.replace('#profile'); return;` (the `/marks` precedent :521). `#profile` arm :681-688 → `renderProfilePage()` (new). Retire renderOwnProfile/renderAccountPage after caller-audit; **keep** renderOtherProfile (#reader).

### AM8 data (Slice 2) — the twin-trap, all 8 sites
- **state.js:** getProfile default :1354 · ensureUser seed literals :1247 + :1272 · ensureUser additive guard (after value guards) · setProfile sanitize (near tagline :1373; string-coerce+trim+**cap 600**) · migration `1.29.0→1.30.0` at :3439 (backfill `statement:''` over stored.users profiles).
- **integrations.js:** read-merge setProfile list :548 (`statement:(typeof rd.statement==='string')?rd.statement:''`) · write `.set()` list :973 (`statement:(profile&&typeof profile.statement==='string')?profile.statement:''`). Mirrors the `values`/`tagline` symmetric pattern exactly.

### CSS foundation (Slice 1)
- Deep ramp `--field-1-deep..10-deep` → **theme.css :root** (per rails). Bright ramp is `:root`-global (universal-depth.css:42-43; identical values to the mockup FIELD array). AA-verify each deep hue against **--surface-2 `#efe7d6`** (worst-case light surface; mockup claims 4.89–7.17:1).
- `.pf-*` block → **end of components.css** (~13440), scoped under a page root class; convert mockup `@container pf (min-width:1200px)` → **`@media (min-width:1200px)`** (desktop canon). OMIT mockup-harness/generic rules (`*`,`body`,`.mono`,`.si`,`.fb`,`.fs2`,`.render-frame`,`.frame-*`, global `:focus-visible`). Fence rule `.render-frame.is-visitor .pf-owner-only` → `<root>.is-visitor .pf-owner-only`.

### Data sources (Slices 3-4)
- Taxonomy = **17 `SHELF_CATEGORIES`** (state.js:497), NOT the mockup samples. Resolver `categoryOverride||category` (:615). **AM22 hue = `SHELF_CATEGORIES.indexOf(cat) % 10` → `--field-{n+1}`** (slug-order, deterministic; `arcFieldHue` :5491 is the sibling idiom).
- Owned: books `state.userBooks[uid].bookIds` · arcs/subs `userId===uid`. valueMarks `{value,why}` on book/sub/arc. `profile.values` declared stones. Lenses `state.userThemes` where `userId===uid`, `.bookIds` (views.js:4605). Reuse: `_portraitFieldTensions` :16003 (gaps), `_buildArcSubsIndex` :3451, `_portraitEmblem` :16396.

---

## SLICE LOG

### Slice 1 — CSS foundation · PASS
- theme.css :root: `--field-1-deep..10-deep` added (9 ins). **AA verified per hue vs --surface-2 #efe7d6: 4.89–7.17:1, all ≥ 4.5** (printed calc, hue6=4.89 min, hue10=7.17 max).
- components.css: full `.pf-*` port appended (208 ins, 0 del). Fonts→`--font-serif/body/mono`; warm shadows→global `--shadow-1/2`; `@container`→`@media(min-width:1200px)`; harness/generic/`.mono`/`.pf-toast` OMITTED; fence→`.pf-root.is-visitor`; `.sec-*` scoped under `.pf-root` (no-bleed). Scope block re-points globals to R5 light set + hero-well tokens (§7).
- **Gates:** braces BALANCED (3716/3716) · additive-only (numstat 208/0, 9/0 → no EOL flip; LF/CRLF warning cosmetic per CLAUDE.md) · `.pf-`/`.sec-` namespace clean (no collision) · no existing rule touched → no global-stylesheet bleed vector. No live consumer yet (renderProfilePage = Slice 5); live visual deferred to Slice V forensic smoke.

### Slice 2 — AM8 data layer (`profile.statement`) · PASS (mechanical) · fix-red-team dispatched
- **state.js (8→now):** seed literals :1247 + :1272 · ensureUser guard :1321-1322 · getProfile default :1362 · setProfile sanitize :1430-1433 (`trim()` + cap 600) · migration `1.29.0→1.30.0` :3458-3477 (for-in backfill over stored.users, hasOwnProperty, idempotent).
- **integrations.js:** read-merge :553 (`statement:(typeof rd.statement==='string')?rd.statement:''`) · write `.set()` :981 (symmetric). Twin-trap closed.
- **Gates:** parse-check state.js + integrations.js = **PARSE OK** · all `statement` sites present (grep) · migration terminus = 1.30.0 · dirty = exactly {components.css, theme.css, state.js, integrations.js} · numstat 41/3 + 9/1 (in-place literal edits, no EOL flip).
- fix-red-team dispatched on the AM8 diff (early, data-loss focus); comprehensive red-team (redirect+AM8+merge) runs at STEP 5.

### Slice 3 — aggregation helpers (display-only ES3) · PASS (parse) · functional verify rides Slice 5 render
- 14 helpers before renderOwnProfile (views.js:16583+): `_pfCatHue` (AM22 slug-order %10), `_pfBookCat` (override→category→Uncategorized), `_pfOwnedBookIds`, `_pfOwnedSubs` (userId OR arc-owner, belt+suspenders), `_pfSubCategory` (dominant evidence-book cat), `_pfExcerpt`, `_pfDate`, `_profileCategoryAxis` (books+marg+recent+bonds+total), `_profileCategoryStats`, `_profileLensStats` (AM44 source-pinned: userThemes ∩ marginalia), `_profileValueLoad` (evidence-weighted tier w1-4, NEVER printed count; orphan collection), `_profileOverview` (books/marg/subs/published/arcs/journalQuestion), `_profilePublished` (status='published' subs, arc lineage graceful, newest-first), `_profileGaps` (3 tensions, phrasing verbatim from `_portraitFieldTensions`, AM22-hued `.cat` spans).
- **Gates:** parse-check views.js = **PARSE OK** · ES3-scan clean (no arrow/const/let/backtick/class in the block) · all 14 defined · reuses `_portraitEsc`. Functional probe deferred to the Slice-5 live render on the seed fixture.
- **FORK RESOLVED (Preston, 2026-07-12):** the 3rd stat = **"Arcs"** (owned knowledge arcs), replacing the mockup's un-backable "passages". Row = books · marginalia · arcs · sub-theories · published. `_profileOverview.arcs` already computed. (Deliberate divergence from AM11's named "passages" — recorded per the steer rule.)
- **fix-red-team VERDICT: CLEAN on data-loss.**

### Slice 4 — galaxy renderer (re-authored PORTRAIT galaxy) · PASS (parse) · visual tune at D/P gates
- views.js:16918+: `_pfLcg` (seeded stable sky), `_pfPlanetLayout` (deterministic dominant-focal ellipse for VARIABLE real category count — the mockup's 7 fixed POS can't apply), `_pfPlaceLabels` + `_pfPlaceInvite` (collision engine ported 1:1), `_profileBuildSky(uid,pub,mob)`.
- Real data: planets = `_profileCategoryStats` (sized by books, `var(--field-N)` fills), stars = `_pfOwnedSubs` (visitor→published-only; `data-sub`=id routes to #subtheory), faint field = seeded specks ~library size, value-lines connect drawing-subs' stars, constellation hub-radiates from dominant. Unpublished stars carry the dashed "only you" ring.
- **Gates:** parse-check views.js = **PARSE OK** · ES3-clean · **zero hardcoded hex** (omitted the mockup's `#fff8e6` sparkle to stay tokens-only) · AM39: single SVG render, no per-frame JS. Position/size magic-numbers TUNE at the D1/P-gate visual pass on the D0 rig.

### Slice 5+6 — composition + interactivity (`renderProfilePage`) · PASS (parse) · live verify next
- views.js:17124+: `_pfOrbSvg`, `_pfValueCard`, `_pfValuesSection`, `_pfNumbersSection` (5 stats incl. **arcs**; lens grid+toggle owner-only), `_pfQuestionsSection`, `_pfNowLine`/`_pfNowSection` (minimal, R9b owns richness), `_pfPublishedSection` (cap 6 + "all published work→#arcs"), `_pfSettingsSection` (identity fields + AM8 statement textarea + yumiReadsAlong toggle + Save/Sign out + Your-data link), `_pfBuildPage`, wire helpers (`_pfLightValue`/`_pfClearValue`/`_pfSetAxis`/`_pfSaveSettings`/`_pfWire`), `renderProfilePage`.
- REAL navigation (not mockup toasts): star/sublink/pub-card `data-sub`→`#subtheory/<id>`; planet→`#books`; counts/stats→`#books`/`#notebook`/`#arcs`; Save→`setProfile`+`saveProfileToFirestore`; Sign out→`signOut`; preview↔exit re-renders published-only. Owner/visitor = content rule (`vis` drives data; `.pf-owner-only`+`.is-visitor` CSS fences). Signed-out = clean sign-in prompt (no crash).
- Fixed a stray duplicate lens caption. **Gates:** parse-check = **PARSE OK** · ES3-clean · tokens-only. NOT yet reachable (route flip = Slice 7); functional+visual verify via D0 rig NEXT.
- **Deferred to Slice 5b (DNA carry, Preston-approved "keep"):** Yumi value-offer dock (AM19, wire R8 retrofit) · reader-model threads/journey/returns owner-only sections · fuller Yumi prefs (reader-model/web/voice consent) + Your-data export/delete in Settings.

### VERIFICATION SUITE — core build (D0 rig :8761, synthetic 42-book/6-sub/4-value fixture) · ALL PASS
Rig: fresh load (**schema auto-migrated to 1.30.0** — AM8 migration confirmed live), `getCurrentUser` stubbed to `rig_user`, direct `renderProfilePage()`. Hard evidence = live-DOM `getBoundingClientRect` (screenshots hang in this headless pane — a rig limitation; Preston's felt pass runs on the deployed URL post-push).
- **Data layer:** value-load tiers + why-lines + pub/draft subs + orphan(Solidarity) correct; overview 42·32·**1 arcs**·6·3; 7 category planets (Education dominant, all distinct hues — AM22); published 3; gaps 3.
- **Render:** 7 planets · 6 stars · 54 specks · 7 labels · 1 invite · 4 value cards · 5 stats · 7 cat cards · 3 gaps · 3 pub · 4 settings fields · orphan · thesis=statement (AM8 renders). No console errors.
- **AM47 collision @1280:** 8 sky texts, **0 collisions, 0 overflow** (rects printed).
- **AM38 collision @390:** 6 sky texts (top-5 labels + invite), **0 collisions, 0 overflow**.
- **D1 @1920:** hero 98% + content column 70% occupancy (≥60 PASS); grid split active (750/500).
- **D2:** prose 67/58/58 ch (≤72 PASS). **D3:** 0 h-scroll @1280/1920.
- **P8:** 0 h-scroll @390. **P3:** chip 80 / star-hit 44 / planet-hit 62 (≥44 PASS). **P7:** input+textarea **16px** (was 12.5 → FIXED via `@media(max-width:759px)` override; components.css).
- **AM51 DOM order:** Statement→Values→Numbers→Questions→Now→Published→Settings (exact).
- **AM52 visitor fencing:** questions/now/settings/lens-toggle/orphan/preview-link hidden; vis-badge shown; **fenced sky = 3 published stars only**; sublinks published-only (0 drafts); published band shown.
- **AA rendered (deep hue on light):** cat-meta 4.89 · sublink 5.92 · pub-cat 4.89 · gap-cat 5.92 — all ≥4.5.
- **Interactions:** lens toggle swaps grids + caption; value-chip lights exactly its subs' stars (+vline, faded others).
- **AM39:** single SVG render, no per-frame JS (by construction). **Forensic smoke:** Shelf/Arcs/Home render, **no `.pf-` bleed**, console clean.
- **P7 fix logged:** components.css `@media(max-width:759px){.pf-field input/textarea{font-size:16px}}` (mobile-only, desktop 12.5/14 register kept).

### Slice 5b — DNA carry (Preston-approved "keep") · PASS (parse) · Condition-1 PROVEN
- **Reader-model section:** `buildReaderModelSection(uid, rerenderFn)` parameterized (15330); both internal re-renders (rerender 15345, considerProfileRefresh 15839) now fire `rerenderFn` first, `renderAccountPage` only as dead `else`-fallback. renderProfilePage mounts it as a live DOM node with **`buildReaderModelSection(uid, renderProfilePage)`** (17502) → reader-model consent (yumiReaderModel/webGrounding/voice/talkMode) + threads (delete/edit) all re-render the Profile.
- **Retrofit (AM19 dock):** `_pfRunRetrofit`/`_pfRenderOffers` — profile-scoped, reuses `YumiBrain.gatherValueMetadata`/`generateValueRetrofit`/`evalValueResponse` (R8 engine); accept → `setProfile(values)` + `saveProfileToFirestore` + **renderProfilePage**; reject removes card; rename inline. Dock in `_pfValuesSection` (owner-only), wired `retro-run` in `_pfWire`.
- **Returns + Journey:** `_pfReturnsSection`/`_pfJourneySection` (display-only, reuse `_portraitReturnsData`/`_portraitJourneyData`), owner-only, appended after Now. No handlers.
- **No arc-publish regression:** publishing is on the arc-detail page (`_arcHeadPublishControl` views.js:12408/mounted 12608) — the retired own-profile "Your arcs" grid was secondary.

### Slice 7 — route flip · PASS (parse)
- `#account` arm (632) → `location.replace('#profile')` (R7 /marks precedent). `#profile` arm (681) → `_pfPreview=false; renderProfilePage()`. index.html:39 nav avatar href `#account`→`#profile` (data-route="account" umbrella token kept; activeRoute lights it). renderOtherProfile own-uid self-redirect (18089-ish) → `#profile` → renderProfilePage (unchanged, still correct).

### CONDITION-1 PROOF (Preston's hard gate #1) — ZERO reachable call sites to old renderers
- **(1) Route arms:** #account → `location.replace('#profile')` (no renderAccountPage); #profile → `renderProfilePage()` (no renderOwnProfile). ✓
- **(2) Nav href:** `grep href="#account" index.html` = NONE (→ #profile). ✓
- **(3) Every remaining `renderOwnProfile()/renderAccountPage()` call is inside DEAD code:** `renderOwnProfile` (17667, def) · `renderAccountPage` (def) · `_opPublishControl` 17993/18089 (sole caller 17790 = renderOwnProfile, dead) · `_accountToggleEditForm` 15327 (callers 18710/19908 = renderAccountPage, dead) · `buildReaderModelSection` 15345/15839 = `else`-fallback, dead when rerenderFn passed. The profile code (renderProfilePage + `_pf*`) calls NONE of them. ✓
### VERIFICATION — 5b + 7 (fresh reload, rig :8761) · ALL PASS
- **Fresh code loaded** (cb reload): `_pfRunRetrofit`/`_pfReturnsSection`/`_pfJourneySection` present; `buildReaderModelSection.length===2`; schema 1.30.0.
- **Signed-out `#account` → redirect → `#profile` sign-in prompt: PASS** — hash lands `#profile`, `.pf-root` renders "Sign in to see your reading as a galaxy.", **no account page, no crash** (Preston's explicit ask).
- **5b DNA carry renders (owner):** retrofit dock ✓ · reader-model section mounted in `#pf-yumi-mount` (`.account-readermodel`) ✓ · 2 threads (`.rm-item`) ✓ · returns 1 row ✓ · journey 3 rows ✓ · value cards 4 ✓ · **stat row = books · marginalia · arcs · sub-theories · published** ✓. Console clean.
- **CONDITION-1 LIVE PROOF: PASS** — clicking a reader-model consent toggle re-renders **`.pf-root` present, NO `.account.lum-amber-ember`, yumi still mounted** → the carried handler re-renders the Profile, never the old page.
- **No regression:** collision @1280 still 0; visitor mode fences all 5b owner-only (yumi/returns/retrofit hidden, sky = 3 published stars).
- **Live Forensic Smoke (views.js + shared CSS touched):** Shelf · Arcs · Notebook · Home · Sub-theory · Book-detail · Other-profile all render **`ok` (no `.pf-` bleed)**, profile restored, console clean.

- **CARRIED HANDLERS → re-render target (all → renderProfilePage or no-page-rerender; NONE → old page):**
  1. `_pfSaveSettings` (Save) → **renderProfilePage** · 2. `toggle-reads` (yumiReadsAlong) → local classList, no rerender · 3. `signout` → `signOut()` · 4. `retro-run` → renders offers only · 5. retrofit **accept** (`addValue`) → **renderProfilePage** · 6. retrofit reject/rename → DOM/`addValue`→**renderProfilePage** · 7. **`buildReaderModelSection`** (consent flips, web/voice/talkMode, thread delete/edit, considerProfileRefresh) → `rerenderFn` = **renderProfilePage** · 8. preview/exit-preview → **renderProfilePage** · 9. star/planet/sublink/counts/stat/pub → `location.hash` nav · 10. lens toggle / chip-light → client-side DOM.
  **Zero carried handler re-renders renderOwnProfile/renderAccountPage.** ✓

### NAMED DEBT (Preston's hard gate #2) — unrouted legacy renderers → S-B candidate
- `renderOwnProfile` (~681 L) + `renderAccountPage` (~1380 L) + their private helpers (`_opPublishControl`, `_accountToggleEditForm`, the inline retrofit/values/threads blocks) remain **defined-but-unrouted** (dead: no route arm, no nav href, no reachable handler). ~2060 L. **Deletion is its own future task (S-B residuals candidate); NEVER bundled into R9a.** Recorded here + to be added to the close-out ledger / sequence.md at the round close.
- **RESIDUAL (felt-pass tuning, not a gate):** value-load tiers bunched at w1 on the uniform synthetic fixture (thresholds 4/2/1); evidence-honest, will spread on real data — Preston's felt eye judges. Galaxy planet positions/sizes are reasonable but tune on his real library. Re-derived from source: twin-trap symmetry exact (:553/:981 mirror `values` :548/:978); full-doc `.set()` carries statement (all savers pass `getProfile` which now returns it); F-DL3 write-latch covers it (deferred write re-fires post-merge via getProfile); migration additive+idempotent+non-clobbering, 1.30.0 terminal (set once, no `==='1.30.0'` block); no third round-trip (`m.profile` :1058 = reader-model, different object); ES3-clean, parse exit 0. Findings = HYGIENE not defects: (1) CSS co-dirty → stage **path-explicit per slice**, never `-A` [handled at STEP 5]; (2) UI wiring lands Slices 4-5 of THIS build (comment describes intended role, build fulfills it); (3) CACHE bump = last step; (4) 600-cap mirrors `values`. Standing model-limit (pre-R9a client omits field on .set) is inherent + pre-existing, correctly handled forward.


