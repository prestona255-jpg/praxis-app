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
