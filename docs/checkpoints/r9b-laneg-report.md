# R9b Lane G — round report (the profile GALAXY + desktop composition rider)

**Target v3.201. Display-only** (no data-model / state / routing / auth change; `state.js`/`integrations.js`/
`firestore.rules` untouched). Rails: `js/views.js` + `assets/components.css` + `assets/theme.css` (+ `sw.js`
bumped once, final commit). Foundations byte-locked throughout (`lumen-amber.css` `9879ddb8…`, `marks.js`
`772886c0…`).

## Commit list (local, NOT pushed until Preston's words)

| commit | slice | code bytes (LF) |
|---|---|---|
| `cf69f5d` | **S1** desktop composition rider | components.css +885 · views.js +456 |
| `9f1b83b` | **S2** the galaxy mockup (`design/profile-galaxy-laneG.html`) | 52 KB (unserved design file) |
| `2d0f561` | **S3** sigil-galaxy center + value-line lensing | views.js +6898 · components.css +314 |
| `99751fe` | **S4** CSS-only motion + presence + sparse rule | views.js +631 · components.css +1668 |
| `c41a235` | **S5** diverse muted hue wheel + sky lens-mode | views.js +1402 · theme.css +1248 |
| `0adfd2b` | docs (S3–S5 records + the since-overruled size-valve split) | docs-only |
| `574e5cb` | **S6** the in-galaxy selection panel | views.js +10360 · components.css +4824 |
| `df83598` | **S7** arc constellations + interaction map + teal→gold | views.js +2388 · components.css +694 |
| `f1153ee` | **collision-gate fix** (widened text-vs-OBJECT proof) | views.js +1767 |
| `<final>` | cache bump v3.201 + this report + records | sw.js version-string only |

Total code delta (origin/main..HEAD, the 3 rails): **+437 / −35 lines** (components.css +106 · theme.css +17 ·
views.js +349). No EOL flips (numstat per slice). sw.js untouched until the final commit.

## Felt-pass decisions (applied)
1. **Core silhouette** = DERIVED default (no picker; sigil session owns it). `_pfDominantTradition` → `_PF_SIL`:
   **hexagon**{theory, wisdom, empirical} · **compass**{history, place, practice} · **spark**{memoir, novel,
   poetry}; default **hexagon** (no/unknown dominant tradition). Mapping printed here + in code.
2. **Hue wheel** = the amended **diverse muted full-spectrum** wheel (amber / terracotta / rose / plum / slate /
   teal / sage / olive / clay / steel), `--pf-hue-1..10 + -d`, deterministic per slug.
3. **Motion feel** = as mocked (drift 34–41s · rings 64–150s · orbits ≥120s · breath 6.5s).
4. **Sparse variant** = as mocked (≤4 planets → tightened centered cluster).
5. **Frozen reduced-motion** = as mocked.

## Decision records (self-resolved, my authority; evidence + revert in the checkpoint)
- **S1 D1–D6** — accepted by Preston (widen 1400 · hero-dock 0px align · regrid · "›" drop · journey dedup ·
  8px margin scope-flagged to DW).
- **Silhouette mapping** — the tradition→shape table above (deterministic).
- **Hue collisions allowed** — a pure per-slug hash maps some sibling categories to one hue (e.g. Theory+LitFic,
  Psych+Poetry in the test fixture). Kept — the "deterministic per-slug" law forbids set-dependent
  collision-avoidance. Revert: swap `_pfFieldHueIdx` for a curated map (a data decision).
- **teal→gold scoped to the `.rm-toggle` on-state** — the section's other teal accents (col-header, checkmark,
  panel-title, save/add buttons, `9467–9501`) LEFT teal per the handoff's specific scope + "cyan=Yumi-only".
  **Felt-pass flag** (coherence).
- **Stars orbit WITHIN the field** (collision fix) — moons close-in; frees the label zone. A visual departure
  from the mockup's outside-orbit (the felt pass was on the look; this is a collision-driven mechanical fix).
- **Dominant planet stays at center** — retained through the smaller obstacles; the sigil sits over its faint field.
- **Rig port workaround** — `127.0.0.1:<port>` twin (prefix in the gitignored `static-server.ps1`).

## D1 PROOF-SCOPE lesson (the R9a rider, applied + extended)
R9a shipped a defect (a star sat on a label at ultrawide) because the collision proof measured a SUBSET
(text-vs-text + overflow only). This round's occupancy proof (S1) restated the FULL mandate — occupancy measured
on the PORTRAIT BODY BY NAME (`.pf-below`), not the hero — and the sky collision proof measured **text vs OBJECT**
(labels vs planet-cores + stars + sigil-mark) **at drift extremes** (6 animation phases via Web-Animations
`currentTime`) on **both** fixtures. That proof CAUGHT real overlaps (dominant label on the sigil; orbiting stars
on labels) that a text-vs-text check would have shipped — the lesson working as intended. A verification
assertion must restate the full mandate, never a subset it can pass.

## Reviewer + red-team (both ran on the full diff `origin/main..HEAD`)
Both returned findings; **all blockers fixed** in `941eb06` (RIG learning: my first reduced-motion gate was a
presence-not-effect check that couldn't fail — the classic trivially-passing gate the red-team exists to catch).

- **RT#1 (BLOCK) reduced-motion freeze ineffective** — the reset lacked `!important` and lost the cascade to
  `.pf-planet.d0` (specificity) + the inline star-orbit style → planets/stars/specks kept moving. **FIXED**
  (`!important`; proven by a cascade test: injecting the reset drives every sky animationName → `none`).
- **RT#2 focus-trap listener leak on desktop re-open** — **FIXED** (`_pfOpenPanel` detaches the prior trap).
- **RT#3 star-sweep vs label geometry** — the orbit-ring obstacle that would close it drops the dominant's label;
  reverted to keep all labels; the narrow transient graze is a **documented residual** (below sampling
  resolution; 0 at 16 dense phases).
- **RT#4 (nit) lens panel resolves by name not id** — dup lens names could scope to the first match; consistent
  with the existing P3 display-dedup (both keep the first/richest by name). **Documented**, not fixed.
- **Reviewer (BLOCK) 3 hardcoded hex → tokens** (sigil stops, `.pf-panel-x` color) — **FIXED** (var(--text-on-dark)).
- **Reviewer (BLOCK) `.pf-panel-x` 34×34 → 44×44** (P3 floor) — **FIXED**.
- **Reviewer (BLOCK) trailing blank line at EOF** — **FIXED** (`git diff --check` clean).
- **Reviewer (non-block) AA pairing** — the SHIPPED text color is the `-d` deep variants on light `--surface`
  (`.pf-catcard .cm`, `.pf-pstar`), which the reviewer independently computed pass **5.11–9.15:1** — no defect.
- **Reviewer (non-block) intro-panel/whisper collision** — moot for the app build: the profile's first-visit
  intro is the existing W9 overlay (`.intro-panel-wrap`, Lane P) and the whisper is a below-card eyebrow —
  neither is a NEW sky element, so there is nothing added to the sky collision set (the mockup's in-hero card
  was a mockup-only demonstration).

## Residuals (honest)
- **Arc-label tap target ~15px (<44px, P3)** — the arc-constellation label → arc page is a *redundant secondary*
  affordance (the Arcs section cards are the primary path); a 44px hit rect would re-introduce the sky collisions
  just closed. Kept small; flagged.
- **Transient star-sweep graze** (RT#3) — geometrically possible on a non-central label at the exact south orbit
  angle; below sampling resolution; documented.
- **teal→gold coherence** — the reader-model section keeps teal accents beside the now-gold toggle (felt-pass flag).
- **Hue hash collisions** — sibling categories may share a hue (per-slug law; future curated-map data decision).
- **Lens-panel by-name** (RT#4) — dup lens names; consistent with the P3 display-dedup; low likelihood.
- **Reduced-motion CDP test** — the freeze is proven by cascade test; a true emulated-media render needs CDP
  `setEmulatedMedia`, not exposed in this rig.
- **Commons draft-body debt** (integrations.js:2456) — carried from Lane P; R11/FX-1 adjacent (not this round).
- Named debt inherited from R9a (S-B deletions, light-skin tokenization, curated published order) — unchanged.

## RIG learning (recorded for the next session)
The app re-registers its service worker on every load and serves stale precached assets → **SW-unregister +
`caches.clear()` + reload is mandatory before each live verify**; a function merely existing (`fresh:true`) is
NOT proof of freshness. `127.0.0.1:<port>` is a fresh browser origin twin of `localhost:<port>`. Screenshots
hang; Web-Animations `currentTime` freezes drift/orbit for geometry sampling.

## Gate ledger — all PASS (details in docs/checkpoints/r9b-laneg.md "HARD GATES")
Collision **0** on both fixtures at **16 dense drift/orbit phases** (all labels incl. dominant) · AA + determinism ·
gold-hierarchy · **reduced-motion freeze effective** (`!important`, cascade-proven) · P3 (star 52px; panel-x 44px) ·
D1/D3 · focus trap (+ re-open cleanup) · forensic (no bleed, console clean) · **reviewer + red-team blockers all
fixed** (`941eb06`). Commit list: `cf69f5d`…`941eb06` (11 commits) → final commit bumps sw.js v3.201.

---

## R9b FELT-PASS PATCH — round report (target v3.202)

Preston's deployed felt pass on v3.201 was a CONDITIONAL pass with nine items (P1–P9). This patch runs
them display-only, one commit per item, diagnose-first (mechanism recorded in `r9b-laneg.md` before each
fix). **Foundations byte-locked; `state.js`/`integrations.js`/`firestore.rules` UNTOUCHED (verified empty
diff) — display-only holds.**

### Commit list (local, NOT pushed until Preston's words)
| commit | item | code delta (LF) |
|---|---|---|
| `ac411ce` | **P2** dominant label off the sigil axis | views.js +28/−3 |
| `8a8e479` | **P3** sparse balanced spread + dominant robustness | views.js +36/−16 |
| `f932e51` | **P4** one hue system (Published+Arcs→wheel) + catcard wrap | views.js +5/−3 · css +5/−1 |
| `f0273b3` | **P5** never print "Untitled" + contained n=1 | views.js +12/−4 · css +1/−1 |
| `3d427c5` | **P6** lineage tag adjacent at desktop | css +4/−0 |
| `0032cd2` | **P7** desktop density on thin DNA cards | css +9/−0 |
| `71100d5` | **P9** reader-model accents teal→gold | css +4/−4 |
| `22fe3c0` | **red-team fix** dominant off-axis at every width (adaptive font) + Arcs Uncat neutral | views.js +22/−19 |
| `78b7e3f` | **P1** curated category→wheel hue map (Preston's ruling A) | views.js +23/−5 |
| `<final>` | cache bump v3.202 + this report + records | sw.js +1/−1 |
Total code (origin/main..HEAD): **views.js +92/−16 · components.css +23/−6** (+ sw.js version string). No EOL flips (surgical numstat each).

### Item outcomes
- **P1 — RULING IMPLEMENTED (`78b7e3f`, Preston chose A).** A curated `_PF_HUE_MAP` of the 17 real categories →
  wheel (string hash as the fallback for unknown/future categories): the 10 common categories on distinct slots,
  warmest→most-read (amber=LitFic, terracotta=Theory, rose=History, plum=Memoir), **slate=Tech-only /
  steel=Religion-only** — the "two grey-blue planets" now distinct. Coherence holds (sky=Numbers=Published per
  category, P4 preserved); determinism ×2; AA all 10 deeps 5.11–9.15 both grounds; **praxis-reviewer CLEARED**
  (re-derived all 3 constraints + re-ran the old hash to confirm the collision was real). Proposal B (sparse
  saturation floor) SKIPPED — the map fixes the collision (distinct hues); B would alter a felt-passed opacity.
  FLAG for the re-pass: slate + steel stay blue-family-adjacent (a Tech+Religion user sees two distinct blues),
  reassignable in one map line.
- **P2** dominant label placed beside/below the sigil axis (never captions the mark); resting-box
  collision 0 + orbit-graze delta 0 vs baseline; 390/1280/1920.
- **P3** sparse sky fills both halves (FS fill 0.18→0.66), collision 0 at rest + 12 orbit phases both
  fixtures; reduced-motion frozen by effect; hardens P2 for long names on narrow skies.
- **P4** Published+Arcs on the wheel → one hue app-wide (Tech&Society slate everywhere); AA all deeps
  5.11–9.15 on light; catcard dot aligned on wrap.
- **P5** literal "Untitled" gone (excerpt/arc-lead/quiet descriptor); n=1 contained + left-anchored.
- **P6** lineage tag adjacent (16px, was 819px) at ≥1200; mobile base rule intact.
- **P7** thin DNA cards hug content at ≥1200; rich cards + mobile untouched; journey/statement no-harm pass.
- **P8** the 8px body-margin ruling HOLDS (0 h-scroll on #profile owner+visitor at 1280/1440/1920);
  forensic clean (no `.pf-*` bleed on Shelf/Arcs/Home, console clean). Book Detail 32px = pre-existing
  ON-7/MW3-BKBOX defect (patch CSS provably profile-scoped) → re-seed at close-out.
- **P9** interactive accents → gold (AA 6.31 text / 8.19–4.62 button); `.rm-panel-title` kept teal (Yumi-voice).

### Gates
- **praxis-reviewer:** **CLEAR TO COMMIT** — independently re-derived all 11 checks: ES3 (PARSE OK; `class=`
  only in HTML-attr strings), display-only (sw.js/state.js/integrations.js/firestore.rules/yumi-brain.js =
  0 diff lines; no Firestore writes), foundations md5-locked (`9879ddb8…`/`772886c0…`), no hardcoded hex,
  all selectors profile-scoped, numstat exact + `git diff --check` exit 0 (no EOL flip), P6/P7 inside the
  `@media (min-width:1200px)` block, correctness hand-traced (P2/P3 dominant math, P4 hue, P5 arc-lead),
  **AA recomputed to the same values** (P9 6.31/8.19/4.62; P4 5.11–9.15), `.rm-panel-title` teal kept
  (Yumi covenant), `--no-verify` structurally necessary. Note: button text 4.62 clears the 4.5 floor
  tightly (12.5px bold); the final commit must stage both docs with the sw.js bump.
- **fix-red-team:** **BLOCK → FIXED** (`22fe3c0`). Finding 1 (BLOCK): the P2/P3 "clears the axis at every
  width" proof overclaimed — a 21+ char dominant ("Social & Political Thought" 26, "Religion & Spirituality"
  23) is wider than either side of the sigil on a 460 mobile sky and clamped straddling the axis (near-
  caption). FIX: dominant placed beside the sigil at a font sized to fit the roomier side (cap 19px, floor
  11px, inline font-size) → clears by construction at every width. Re-verified live 390/1280 on the exact
  failing fixtures (11.7–15.3px mobile / 19px desktop, collision 0 rest + 8 orbit phases, reduced-motion
  frozen by effect). Nit #3 fixed (Arcs Uncategorized → neutral). Finding 2 (force-place) = accepted
  residual (dominant must always be labeled). Finding 4 (sw.js) = the bump below. Other clean re-derivations:
  P4 AA recomputed, reduced-motion reset covers every animated node, P5 no "Untitled", P6/P7 scope, ES3/data-safe.
- **sw.js bump:** v3.201 → v3.202 in the FINAL commit (hook ARMED, no bypass), verified live+1 at ship.

### Residuals (carried)
Arc-label tap ~15px (documented) · transient star-sweep graze (RT#3, unchanged from baseline) · the P1
hue-collision (report+proposal, Preston's call) · P5 n=1 left-aligned measure (felt flag) · P7 density
magnitude (felt flag) · Book Detail ON-7 h-scroll (re-seed) · commons #reader draft-body debt (integrations.js:2456, R11/FX-1).
