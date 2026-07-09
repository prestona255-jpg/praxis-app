# R3 HOME — build round checkpoint

R3-HOME STARTED. Self-running staged build; ONE stop at the ship gate.
HEAD 97e6d13 · CACHE_VERSION praxis-v3.186 → v3.187. Target = the UNIVERSAL
v1.2 LIGHT side of docs/studio/mockups/home.html (Preston felt-passed).

## Stage 0 — RECON (read-only)

### Tree / anchors
- HEAD `97e6d13` (expected). Working tree: only `docs/studio/home.md` modified
  (the mockup eval from the shape stage — expected, DISJOINT from the build
  surface js/views.js + assets/components.css + sw.js; not a contaminating dirty
  tree). Untracked = the long pre-existing design/docs pile from session start.
  NOT a STOP (attributable, disjoint).
- Re-anchored (line numbers stale ~+170 pre-v3.186; these are FRESH):
  - `renderHome`            js/views.js:1440
  - `homeRenderField`       js/views.js:1309
  - `homeLeftOffCard`       js/views.js:1356
  - `homeReadingSpine`      js/views.js:1425   (edge + text title, NO cover — D2 target)
  - `homeReadingBooks`      js/views.js:1409
  - `homeShowVariant`       js/views.js:1340   (unchanged by D3)
  - `buildSignedOutPrompt`  js/views.js:1881   (OG cluster — 0 diff)
  - alternator auto-flip    js/views.js:1596-1603 (ls/sv praxis_home_variant — D3 target)
  - altNote copy            js/views.js:1496   ("alternates ... each visit" — D3 copy fix)
  - field variant (vField)  js/views.js:1502-1531 (NO section label — H4/D3 target)
  - umberGroundDark map     js/views.js:373   (home:1 present)
  - `buildSelfHealingCover` js/views.js:6792   (D2 resolver — reuse verbatim)
  - shelf cover call site   js/views.js:5092  (buildSelfHealingCover pattern)
  - base home CSS block     assets/components.css:11796-11846 (.home-page.lum-amber-deep)
  - `.home-wfcap`           assets/components.css:11815 (9.5px --lum-ink-4 — H3/D4b)
  - `.home-altnote`         assets/components.css:11801 (13px --lum-ink-4 — H5/D4c)
  - `.home-mspine-title`    assets/components.css:11841 (no clamp — H2/D4a)
  - `.home-sectlabel`       assets/components.css:11817 (class EXISTS; used only by left variant)
  - Shelf R2 skin precedent assets/components.css:11402-11521 (.shelf.lum-amber-deep)
  - dead landing CSS        assets/components.css:814-976 (Batch-4A hero/cta/preview + Umber-port frame)

### Measure-before (working-tree bytes, wc -c)
- js/views.js        853275
- assets/components.css 558657
- sw.js              4762

### D1 MECHANISM — judgment call (FLAGGED, resolved to the named precedent)
The task prose says "flip route 'home' OUT of the dark-ground map ... exactly the
Shelf's R2 mechanism." Those two clauses CONFLICT against live code:
- The ACTUAL Shelf R2 mechanism (components.css:11402+) KEEPS `books:1` in
  umberGroundDark and scopes a `.shelf.lum-amber-deep { --lum-*: light; light
  ground }` override that paints a light surface over the dark body ground.
- A literal map-flip is ALSO incoherent alone: `--lum-*` tokens are NOT remapped
  by `data-ground` (they're :root dark literals), so flipping home to
  data-ground=bright produces NO light without the same scoped re-point anyway —
  while ALSO flipping nav chrome to bright-mode on home only (inconsistent with
  the felt-passed Shelf, whose nav stays dark-mode over a light surface).
- RESOLUTION (per DOC=POINTER / LIVE-FILE=SOURCE): follow the NAMED precedent —
  Option B, the Shelf-exact scoped `.home-page.lum-amber-deep` override; home
  STAYS in umberGroundDark; umberGroundDark UNTOUCHED. Safer, nav-consistent,
  parity-faithful, additive/reversible. GATE 1's "map diff / 0 lum-amber-deep
  residue" is therefore N/A by design; substituted proof = umberGroundDark
  byte-identical + light surface renders + other routes unaffected.
- This is the #1 flagged judgment call for the single stop. Nothing commits
  without Preston.

### Universal light set = ESTABLISHED, not new
Verified the mockup's `.skin-universal` values are byte-identical to the live
`.shelf.lum-amber-deep` R2 set (--paper #f4efe4 · --lum-base #fffdf8 · --gold-deep
#855410 · --gold-hi #d9a441 · --lum-star #ffce4a · --field-1..10 · ink ramp
#241710/#645940/#645940/#978b6d · --lum-gold-ink #3d2807). "0 new raw hex" is read
as: 0 hex beyond this established Universal-v1.2 set + the same literal-rescue
values the felt-passed Shelf R2 block already ships. A strict zero-hex reading is
impossible for this skin (the light token VALUES are hex by nature).

### Dead landing CSS (hygiene) — proven dead
grep(js/ + index.html) for home-hero/home-cta/home-preview/home-title/home-sub/
home-eyebrow = ZERO consumers. `home-page` = exactly ONE consumer (views.js:1446,
always `'home-page lum-amber-deep'`). Bare `.home-page{}` (823) is fully
overridden by `.home-page.lum-amber-deep` (11796) for its only possible match →
deletion computationally inert (will prove via computed style). Sweep span:
components.css 814-976.

### Cover pipeline (D2)
`buildSelfHealingCover(book, imgClass, placeholderFn)`: returns a real self-healing
`<img>` when book has coverCandidates/coverUrl (candidate-walk → placeholder on
error), else returns placeholderFn() directly. A coverless book CANNOT yield a
broken <img>. Reuse verbatim; NO edit to the helper.

### Field renderer (VISUAL GATE residual)
The whole-field + per-arc mini-fields render via the LOCKED
`window.renderSubTheoryConstellation` (arc-constellation.js — out of scope, §4-H).
Its luminous marks were tuned for a DARK ground; on the new LIGHT ground their
legibility is a genuine felt-pass question. D1 ports the mockup's light panel beds
(.home-arcfield / .home-wf = #f4e6c4→#eedcb2) to give the jewels a darker-than-page
bed, but the real renderer's marks-on-light look is Preston's eyes to settle.
TOP visual residual. Renderer NOT touched.

## Plan (one commit at the ship gate)
- STAGE 1 (D1, CSS-only): new R3 `.home-page.lum-amber-deep` Universal-light override
  block after 11846 (token re-points + recipes 6/4/3/5/2 + literal rescues). JS: none.
- STAGE 2 (D2): rewrite `homeReadingSpine` to buildSelfHealingCover at 52x78; CSS
  restructure `.home-mspine` (radius/overflow/transition), retire `.home-mspine-edge`,
  add `.home-mspine-cover`/`-cover-img`/`-pending`, clamp `.home-mspine-title`.
- STAGE 3 (D3+D4): kill the auto-flip (retire praxis_home_variant; mechanical default
  haveArcs?'left':'field'; session-only toggle); add field section label
  "How your arcs connect"; altNote copy → mockup; D4b .home-wfcap 11px + ink-3;
  D4c .home-altnote ink-3; D4a mspine-title clamp (in D2). Hygiene: delete 814-976.
- STAGE 4 (red-team) → ship gate (bump v3.187, parse gate, report, STOP).

## Close-out (build complete — HOLD at ship gate)

### Files touched (explicit-file staging at commit)
js/views.js · assets/components.css · sw.js · docs/checkpoints/r3-home.md
(+ r3-home-redteam evidence folded into this file; docs/studio/home.md is the
PRE-EXISTING mockup eval — NOT staged with the build; round-close docs are separate.)

### Byte deltas (working-tree, wc -c; LF-normalized diffstat below)
- js/views.js        853275 → 854206  (+931)
- assets/components.css 558657 → 549411 (-9246; net negative — the hygiene sweep
  removed ~more than the R3 skin block + AA fix added)
- sw.js              4762 → 4762 (+0; version string equal length, v3.186→v3.187)
- diffstat: components.css 166 ins / 200 del · views.js 32 ins / 15 del

### Gate table (self-verified)
| Gate | Check | Result |
|---|---|---|
| G1 (D1) | umberGroundDark UNTOUCHED (home:1 present, map byte-identical) | PASS (views.js:373) |
| G1 (D1) | scoped light override renders over dark body (Shelf-exact) | PASS (redteam re-derived) |
| G2 (D2) | cover resolver call site present | PASS (views.js:1434 buildSelfHealingCover) |
| G2 (D2) | coverless path → placeholder (no broken img possible) | PASS (traced 6792) |
| G2/D4a | title line-clamp present | PASS (components.css .home-mspine-title) |
| G3 (D3) | auto-flip retired (0 live praxis_home_variant r/w) | PASS (comment-only ref) |
| G3 (D3) | field section label present | PASS ("How your arcs connect") |
| G3 (D3) | altNote copy fixed (no auto-alternation promise) | PASS |
| D4b/c | wfcap 11px+ink-3 · altnote ink-3 | PASS |
| Hygiene | dead landing CSS swept (2 sites) + stale comment | PASS (0 residual dead-class) |
| ES3 | no const/let/arrow/class/backtick in added JS | PASS |
| Parse | cscript JScript harness (self-validated) | PASS (exit 0) |
| CSS | brace balance | PASS (3193/3193) |

### Judgment calls (flagged for Preston at the stop)
1. D1 MECHANISM = Option B (Shelf-exact scoped `.home-page.lum-amber-deep` override;
   home STAYS in umberGroundDark; map untouched). The prompt prose said "flip out
   of the map"; the NAMED precedent (Shelf R2) does NOT — it scopes an override.
   Resolved to the precedent (safer, nav-consistent, additive). See Stage 0.
2. HYGIENE completeness: the residual grep caught a SECOND dead site (mobile
   `@media` `.home-cta*`/`.home-hero-title`) + a now-dangling `home-cta-*` in a
   canon comment; both swept (docs ride with the diff). Live siblings intact.
3. CONSTELLATION-ON-LIGHT AA fix: re-pointed --ink-2/-3/-4/--sunk scoped to home
   so the LOCKED renderer's text/chrome reads dark-on-light (no renderer edit).

### Review rounds
- ROUND 1 fix-red-team: RED-TEAM clean (no block-commit findings) + 3 nits
  (signed-out .empty-state half-skin [pre-existing]; stale comment line-refs;
  hex-inline awareness). Comment line-refs FIXED (name-based now).
- ROUND 1 praxis-reviewer: FAIL — computed AA defect: locked renderer's Yumi label
  (var(--ink-2)) pale on the light field (~1.7:1) because home stays data-ground=dark.
- FIX: added --ink-2/-3/-4/--sunk light re-points to the R3 home token block.
- ROUND 2 praxis-reviewer (fix re-review): PASS-WITH-RESIDUALS / CLEARED TO COMMIT.
  Blocking gate CLEARED (full-opacity Yumi label now 5.10-5.61:1, independently
  recomputed). Scope/marks/threads/comments/structure all PASS.

### Residuals (flagged, NOT absorbed — Preston's felt-pass call)
- VISUAL GATE (top): the whole-field + mini-field constellations render via the
  LOCKED renderSubTheoryConstellation on the NEW light ground. Token re-points fix
  the ink family, but the marks-on-light *look* is Preston's eyes.
- OPACITY-COMPOSITED sub-AA text on the locked renderer (reachable on home, can't
  be fully fixed without touching arc-constellation.js opacity [non-goal] or
  deepening --ink-2 at cost to the quiet-hint intent [visual judgment]):
  - QUESTION label (seed fallback for 0-own-arcs, views.js:1321-1331): 18px @0.82
    → ~3.6-3.8:1. (I MIS-TRACED this in round 1 as "not drawn"; the reviewer
    corrected me — it IS drawn on the fresh/seed path.) Option: --ink-2=#4d3b2a
    lifts it to ~4.85:1 (passes) but darkens all field text + breaks tonal match
    with --lum-ink-2 — a felt-pass judgment, Preston's call.
  - EMPTY-arc hint (0-sub owned arc, arc-constellation.js:793): 13px @0.7 → ~2.9:1.
    Opacity-limited; no token value fully clears it.
  - BOOK-square --ink-4 stroke (mini-fields w/ books): ~2.5:1 non-text (decorative).
  - (Connect/drag hint :1095 is NOT reachable on home — legend is showLegend:false.)
- SIGNED-OUT .empty-state is unscoped (UA-default h2/p, left-aligned) — pre-existing,
  explicitly a FUTURE round per the build brief; the R3 skin gilds the Sign-in CTA.
- Persistence: praxis_home_variant key RETIRED (mechanical default matches the
  felt-passed mockup's no-persistence behavior); orphan localStorage value inert.

### Ship state
CACHE_VERSION bumped v3.186 → v3.187. Parse PASS. HOLD — awaiting "commit and push".
Live smoke (signed-in states on a throwaway account) + the felt pass are POST-push /
Preston. Studio round-close docs (home.md round history, sequence.md re-plan,
BOARD.md, builder regen) are the round-CLOSE step after the felt pass, not this commit.
