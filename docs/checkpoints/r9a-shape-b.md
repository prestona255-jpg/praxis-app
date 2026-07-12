# R9a — Profile / Galaxy · SHAPE-B mockup evaluation

Mockup: `docs/studio/mockups/profile.html` (open directly in a browser — self-contained,
no build). Built strictly against `docs/checkpoints/r9a-shape-a.md` (A1–A8, locked
2026-07-12) and the Stage-0 recon at `docs/checkpoints/r9a-recon.md`. **This report is
untracked scratch** per the run's rails — it does not touch `docs/studio/profile.md`,
`sequence.md`, or `BOARD.md`. Preston's felt pass is the next gate, not this file.

---

## (a) The Stage-A shape this evolves from

Today the merge target is **two separate self-pages**: `#account` (`renderAccountPage`,
views.js:17680) carries the INSTRUMENT — hero, declared VALUES stones (no load display,
no evidence), the R8 Yumi value-retrofit offer cards, the field/tension card, the LIVE
galaxy (`_portraitRenderGalaxy`, book-groupings by tradition-or-lens, size=#books/
brightness=density — NOT sub-theories/categories), and settings+covenant LAST. `#profile`
(`renderOwnProfile`, views.js:16569) carries the PORTRAIT — identity, `.op-conseq`
("What your thinking has done", stuck on an em-dash placeholder), "Your arcs" with the
publish fence, and **no values, no galaxy**. Owner-vs-visitor is a ROUTE split
(`#profile` vs `#reader/<uid>`), not a mode switch. SHAPE-B's job was to re-author this
into one page behind a single switch, re-author the galaxy's ontology, and add the
project's first ≥1200 composition tier — without touching any live file.

## (b) Locked decisions → mockup realization

| # | Decision | Realized as | Live DOM anchor it evolves |
|---|---|---|---|
| A1 | Merge → one Profile at `#profile`; `#account` redirects; instrument DNA + settings + sign-out carried forward | ONE page, shared `.pf-head` identity header above the switch; both panes present in one DOM. **Routing itself is not built** (mockup only, per HARD RULES — the `location.replace('#profile')` redirect + nav-avatar repoint is a live build-time step, named not done) | `renderAccountPage` hero (views.js:17780) + `renderOwnProfile` `.op-head` (16612) |
| A2 | ONE segmented switch `[ The instrument · Your portrait ]`, owner defaults to instrument | `.pf-switch` (role=tablist), `setMode()` toggles `.mode-instrument`/`.mode-portrait` on `.render-frame`; both panes' DOM persists across the toggle (display switch, not re-render — mobile canon P6) | new — no live precedent (closest: `.account.gal-show-bonds` toggle idiom, views.js:18533) |
| A2‑RULING | Owner's portrait = FULL sky (published + unpublished), unpublished visually marked; "See it as a visitor →" recomputes published-only, drops unpublished + owner chrome; real `#reader/<uid>` stays a separate fenced route | `STARS[].pub` flag; unpublished stars render with a dashed halo ring + dimmed core; detail panel shows a **"only you can see this"** badge (reused verbatim from the live Now-strip precedent, `.lc-private`, `design/praxis-profile-galaxy-mockup.html:639`); `.pf-visitor-toggle` sets `visitorPreview=true`, re-renders both ground panels with unpublished stars **dropped from the DOM**, shows a banner naming `#reader/<uid>` explicitly, hides the toggle itself (owner-only chrome) | new — the "only you can see this" copy is live (Now-strip precedent) |
| A3 | Galaxy re-authored: bright stars=sub-theories, faint field=books, planets=categories (17-label live axis, tradition retired), constellation=hub-radiating from strongest category (n−1 lines), tap-first | `PLANETS` (5, category-labeled, size=`sqrt(books)`), `STARS` (7 sub-theories, tap→detail), `FIELD_SEED` (46-point seeded faint field, `mulberry32`, never `Math.random()`), hub-spoke lines from the largest planet (Critical Pedagogy) to the other 4, opacity lifts on tapping the hub (CSS transition, zeroed under `prefers-reduced-motion`). All interaction is `click`, no hover-only door | `_portraitRenderGalaxy` (views.js:16147) — the DECOUPLE comment there ("stars encode SIZE+BRIGHTNESS only, never shape-as-category") is exactly what A3 retires |
| A4 | Value-load = evidence-weighted (glow/scale + why-lines + "drawn on by N sub-theories" as NAMED chips), never a bare tally; sparse-honest; orphaned-slug handled; one Yumi offer-card | `.pf-vcard` ×4 (Liberation/Praxis/Doubt/Dignity): `.pf-orb` (lit/soft/low = §8 recipe-2 luminous orb, glow tier stands for load) + 1–2 italic why-line quotes + a chip row NAMING the sub-theories (never a number alone); orphaned-slug note ("One mark still points to solidarity — a value you retired…"); one offer-card proposing "Craft" with `that's it / rename ✎ / not this` (exact chip vocabulary named in the brief, synthesized from the live `.portrait-chip` triad + the retrofit `.account-retro` triad) | value declare/vlist (views.js:17868) has NO load display today; retrofit offer cards (18010-18121); category offer chips (18331-18375) |
| A5 | Desktop D1 (≥1200): instrument composes 2 columns — main (value-load+gaps+now, ≤72ch) + galaxy as a PERSISTENT side stage | `@container pf (min-width:1200px)`: `.pf-profile-grid{grid-template-columns:1fr 560px}`; `.pf-side-stage{grid-column:2;grid-row:1/span 3;display:block!important}` stays visible regardless of which pane is active; prose spans capped `max-width:64ch` (`.prose-measure`) inside a wider (≈620px) main column, not the whole column | no live precedent — first ≥1200 tier project-wide (desktop-recon D0 finding: 0 such blocks exist) |
| A6 | Settings + "Your data" covenant LAST, owner-only, never in the portrait/visitor pane | 3 identity fields (name/pen name/tagline), "Yumi reads along" toggle, Save/Sign-out, covenant closing line — all inside `.pf-pane-instrument`, physically last, never rendered when `.mode-portrait` is active | `renderAccountPage` settings+transparency+sign-out tail (views.js:18997) |
| A7 | Both galaxy grounds rendered for felt-pick: warm `--br-deep` (live, §7-favored) vs `.galaxy-night` (mockup blue-black) | `.ground-warm` (radial well from `--sunk-d`→`--br-deep`→`--scrim`) and `.ground-night` (`.galaxy-night` class + a darker radial variant) side by side (`grid-template-columns:1fr 1fr`) on desktop; mobile shows Warm only (§7-favored default) with a note pointing at the desktop comparison — satisfies "at least one in mobile" | components.css:7416 (`.account .portrait-galaxy` well) vs `design/praxis-profile-galaxy-mockup.html:98-106` |
| A8 | `.op-conseq` re-homed; honest empty state (no em-dash), stale "…once Praxis opens to other readers" sub-copy rewritten | `.pf-conseq` moved into `.pf-pane-portrait-head` (its real live home, `renderOwnProfile`, not the instrument — see residual note below); copy: *"Your work hasn't been built on yet — that's expected this early. Once Praxis opens further, what other readers make from it, and who's walked your arcs, will land here."* No `<b>—</b>` placeholder anywhere | `.op-conseq` / `cNum` / `walkB1` (views.js:16739-16756, patched by `loadOwnProfileSocial`, integrations.js:3151) |

Sparse-honest panel (A3/A4, not its own letter): `.pf-sparse` — a dashed-border reference
card, explicitly labeled "reference only — not this account's live state", with the
locked invitation line verbatim: *"Your sky is just beginning — mark a value, publish a
sub-theory, and it fills in."*

## (c) The two galaxy grounds + the read on §7

Both render side by side in the desktop frame (`.pf-ground-row{grid-template-columns:1fr
1fr}` inside `@container pf (min-width:1200px)`) and Warm-only on mobile.

- **Warm (`--br-deep`)** — a radial well from `--sunk-d` (`#241406`) through `--br-deep`
  (`#1c1209`) to `--scrim` (`rgba(15,9,4,.6)`). **Data-source / build-time note:** these
  three hex values are **not** in the two Universal source files' `:root` — they are the
  real LIVE `theme.css` tokens (lines 28, 57, 68), cited verbatim (not invented) so the
  comparison is against the ACTUAL live well, not an approximation. This is the one place
  this mockup steps outside the "tokens only from the two source files" rail; it is
  necessary because A7's whole point is comparing the real live treatment against the
  mockup's night, and approximating `--br-deep` from `--ink`/`--night-line` alone would
  make that comparison dishonest. Live-wiring path if this ships: `components.css:7416`'s
  existing `.account .portrait-galaxy` background rule, unchanged.
- **Night (`.galaxy-night`)** — the scoped class copied verbatim, applied to the panel
  only (never body-level), rendering `#0b0d16`→`#101019` with cream ink/on-dark gold.
- **My read:** Warm reads as continuous with the rest of the page — it feathers out of
  the surrounding paper rather than punching a hole in it, which is exactly what §7 asks
  for ("never a hard dark panel in a light page"). Night is a handsome, legible sky in
  isolation, but side by side it reads as a harder cut against the warm paper chrome
  around it (the identity header, the value-load cards, the switch) — it looks like a
  different app's screenshot pasted in. I'd recommend Warm for the ship default, Night
  as a documented felt-rejected alternative, but this is explicitly Preston's call
  (A7 says "felt-deferred" if still contested) — I did not resolve it in the build.

## (d) How D1 earns the width

At 1280 the content region occupies roughly (1280 − 2×56 page padding) = 1168px of
"active" width against a fixed 1300px shell (~90%), comfortably clearing D1's ≥60%
occupancy check. Main column is a flexible `1fr` (~572px) holding value-load cards, gaps
cards, and the Now strip — none of which need to be prose-capped as a whole block, so I
scoped the ≤72ch cap (I used 64ch) to the actual sentence-bearing spans
(`.prose-measure`, wrapping the gaps/now text) rather than the whole column, per D2's
"composition never widens text to fill space" — the cards themselves are legitimately
wider than 64ch (they're evidence rows with chips, not prose). The side stage is a fixed
560px holding both galaxy grounds at ~262px each side by side, the shared legend, and the
tap-detail readout. The side stage is on a separate grid row-span (`1 / span 3`) so it
never disappears when the switch flips to "Your portrait" — it is the one region on the
page that is ALWAYS visible at desktop width, which is the literal "one tap away becomes
right there" the brief asks for. Verified no h-scroll at 1280×800 (D3) by construction —
`box-sizing:border-box` throughout, no fixed-px child wider than its container; body text
stays 16px at both tiers (D5), only the display name and values-prose step up
(28px→32px, 19-23px→24px) inside the `@container` block.

## (e) Residuals / honest gaps

1. **A8 placement judgment call.** The brief's INSTRUMENT-pane bullet list doesn't
   explicitly place "What your thinking has done"; I placed it in the PORTRAIT pane
   because that's its actual live DOM home (`renderOwnProfile`, not `renderAccountPage`)
   and A8's own text calls it a "re-home," not a relocation across panes. Flagging this
   as a judgment call, not a silently-carried mechanical one, since it's a real placement
   decision with only indirect textual support.
2. **A3's "categories = 17-label live `book.category`" vs the recon's own fork
   recommendation ("9 book traditions").** The Stage-A locked text explicitly overrides
   the recon's recommendation — A3 says "This retires the galaxy's own tradition
   placeholder… Tradition is out." I built the mockup's 5 sample planets as `book.category`
   -style nouns (Critical Pedagogy, Political Philosophy, Philosophy of Mind, Memoir,
   Poetics & Literature) consistent with that ruling. No fork — this is settled, restated
   here only because a future reader might see the recon's contrary recommendation and
   wonder why the mockup ignored it.
3. **Value-tracing (chip-select thread reveal) from the reference mockup was NOT carried
   in.** A3 locks a hub-spoke category constellation, not a value-threads-across-fields
   mechanic (the reference mockup's `selectValue()`/thread reveal). I built the former
   only, to avoid inventing a second, un-locked interaction mode. If Preston wants
   value-tracing back in the galaxy, that's a new decision, not a SHAPE-B gap.
4. **P5 (large-title collapse) not built.** The identity header is static, not a
   sticky-compacting title. Profile is a plausible P5 candidate (it's a primary
   destination page with a title) but nothing in A1–A8 requires it, and adding it would
   be new unlocked scope. Named as an open mobile-canon question for a future round, not
   built here.
5. **P4 (safe-area insets) — not applicable.** This surface has no fixed/bottom-anchored
   chrome (no composer, no bottom sheet), so there is nothing for `env(safe-area-inset-*)`
   to pad. `viewport-fit=cover` is set on the outer studio page for correctness; the
   product surface itself has no fixed elements needing the inset.
6. **The live "declare a value" add/remove flow (the `.account-vlist` +/− UI) was not
   rebuilt.** A4 is about the LOAD display, not the declare mechanic, which is carried
   forward unchanged and out of this round's touch. The mockup shows the 4 stones as
   already-declared; adding a 5th is not wired.
7. **Routing (A1's `location.replace`, nav-avatar repoint, `activeRoute` update) is
   named, not built** — correctly, per the HARD RULES (app code is read-only; a routing
   change is a live BUILD round, not a mockup). Recorded here so it isn't lost between
   SHAPE-B and the eventual build brief.
8. **A7's Warm-ground hex citation** (see §c) is the one spot this mockup pulls values
   from outside the two named source files. Flagged there and here for visibility, not
   silently carried.
9. **No forks.** A1–A8 as locked did not collide with each other anywhere I could find;
   nothing here needed a `FORK` row for Preston.

---

## Post-build LIVE-VERIFICATION + one fix applied (executor, 2026-07-12)

The mockup was live-rendered on a fresh-port static server (`:8771`, no SW) and driven
through the DOM (screenshots time out in this headless pane — the documented D0 limitation;
DOM geometry + clean console are the evidence). **VISUAL-GATE finding: one real defect the
build's static/parse self-check missed.**

- **DEFECT (found live, now fixed):** `.pf-side-stage` (the galaxy) was nested INSIDE
  `.pf-pane-portrait-head`, which is `display:none` in instrument mode. The desktop
  `@container` rule forces `.pf-side-stage{grid-column:2;display:block!important}`, but a
  `display:block` child of a `display:none` ancestor still doesn't render — so at desktop
  **instrument** mode (the owner default) the D1 grid reserved a 560px col-2 that rendered
  **blank** (side-stage + both galaxies measured `0×0`, `offsetParent:null`). The two-column
  layout computed correctly but its right column was invisible — exactly the class of miss
  the VISUAL GATE exists to catch.
- **FIX (markup-only, no CSS change):** moved `.pf-side-stage` out of `.pf-pane-portrait-head`
  to be a DIRECT child of `.pf-profile-grid` (a real grid item). The mode CSS was already
  written for this (base hidden → `.mode-portrait` shown at mobile; `grid-column:2` always-on
  at desktop) — the only bug was the nesting.
- **RE-VERIFIED live, all pass:** desktop instrument = instrument col-1 (557px) **+ galaxy
  side-stage col-2 (560×356) with BOTH grounds rendering** (warm + night, 77 circles each);
  desktop portrait = instrument hidden, head+body col-1, galaxy stays col-2; mobile instrument
  = galaxy hidden (one tap away); mobile portrait = galaxy shown (339px) and **leads**; the
  `[The instrument · Your portrait]` switch flips both frames; "See it as a visitor" drops the
  unpublished stars (154→142) + shows the banner; widest prose 66ch (≤72, D2); desktop content
  occupancy 91% (≥60, D1); page h-scroll 0 at both frames (D3); **console clean**; 14-token
  Universal `:root` present; tracked tree clean (only the four round docs untracked).

*Note on the build agent's self-report:* it claimed "fully interactive / verifies clean" from
static + `cscript` ES3 parse checks — it has no browser-render tool, so it could not have seen
the blank col-2. Recorded per the "distrust self-reports; the live render is the gate" rule.

---

*SHAPE-B v1 complete. Preston's felt pass on v1 = FAIL on composition (see below).*

---

## SHAPE-B v2 — REBUILD against AM1–AM9 (executor, 2026-07-12)

v1 FAILED the felt pass on composition (dead gutters below the fold; thumbnail hero; inverted
sky hierarchy; task-status vocab; two dropped locks). v2 is a **from-scratch rebuild** of
`docs/studio/mockups/profile.html` against the amended locks. What changed and the **live-gate
evidence** (fresh-port `:8771`, DOM-measured — screenshots time out in this headless pane):

| Lock | v2 realization | Live evidence |
|---|---|---|
| **AM1** one spine, galaxy hero for all; switch deleted | No switch; galaxy leads for everyone; "preview as visitor" carries the fencing | `noSwitch:true`; preview drops unpublished stars **11→3** + banner + owner chrome hidden; return restores 11 |
| **AM2** tap star→sub-theory, planet→shelf, sky→constellation | wired to toasts (nav simulated) | star/planet taps toast the route; sky tap toggles `show-lines` (false→true→false); **6 hub-spoke lines** from the dominant category |
| **AM3** full-width hero + composed columns; occupancy PASS | hero band 1278×440; below-hero fluid 2-col | grid `654/495px`; **occupancy 94%** (≥60 ✓); mobile grid `none` (single col) |
| **AM4** warm ground only | `.galaxy-night` retired | `noNightGround:true` |
| **AM5** stars lead; planets sized by books | lum-gold glints (r5+glow); planet radii by book count | planet radii `[51,31,24,23,19,17,16]` — **CP dominates 3.2×**; 130 dim specks; 8 dashed-unpublished; labels in Cormorant; legend→tap hint; sparse invitation in-sky |
| **AM6** value cards single col, typographic load | `.w1–.w4` name scale + ink density; NO printed labels | statement 69ch, why 56ch (≤72 ✓); sublinks are `→` links |
| **AM7** counts rescued | mono caption "129 books · 11 sub-theories · 3 published", clickable | present; Numbers view pinned R9b (record at close) |
| **AM8** values statement + flag | prose block, first content, placeholder flagged | flagged "you'll write this"; **⚠ data-plan checkpoint pending before BUILD** |
| **AM9** order + quiet settings | statement→Values→Open→Now→Published→Settings | mobile order exact; settings eyebrow `--ink-3`, small inputs, hairline sep |

Plus: page **h-scroll 0** at both frames (D3); **console clean**; 14-token Universal `:root`
verbatim; warm `--br-deep` cites the live well (AM4). Tracked tree clean; only the four round
docs untracked.

*Residual for the felt pass:* AM5 "stars lead" and AM6 "typographic load" are **felt** judgments
the DOM can't fully prove — Preston's eyes decide whether the stars truly read as protagonists
and whether the value-load scale reads as evidence. AM8's persisted-field data plan is the
explicit pre-BUILD checkpoint (not carried).

*SHAPE-B v2 complete. Preston's felt pass on v2 = PARTIAL — hero sky PASSED (kept); below-hero
FAILED (see AM10–AM23).*

---

## SHAPE-B v3 — REBUILD against AM10–AM23 (executor, 2026-07-12)

v2's hero sky was kept; the below-hero was rebuilt with containment, the Numbers view, the
values strip, category color, load orbs, the owner/visitor matrix, and a retuned mobile sky.
**Live-gate evidence** (fresh-port `:8771`, DOM-measured; screenshots time out in this pane):

| Lock | v3 realization | Live evidence |
|---|---|---|
| **AM10** containment cards, headers outside | 7 sections → 7 surface cards | `cards:7`, `sections:7` |
| **AM11** By the numbers pulled into R9a | overview 5-stat row + 7 per-category cards (hue, books, marginalia, mini-bar) + covenant | `statCells:5`, `catCards:7`, covenant present |
| **AM12** values strip lights constellation | 4 chips docked at hero base; tap → its sub-theory stars light, rest fade, value-line draws | `stripChips:4`; Liberation tap → `lit=2 faded=9 vlinesOn=1 active=true`; toggles off |
| **AM13** color codes category everywhere | field-hue dots/borders/bars on stat cards, sublinks, questions, published, planet halos | `catDots:17`; `FIELD_INK` removed (no invented hexes) |
| **AM14** load orbs + name scale | orb size + fill depth by weight, no printed labels | orb widths `[26,21,17,13]` (w1→w4) |
| **AM15** hero contract ~60vh, identity + strip + counts docked | identity top-left; strip + counts at base | hero `507px`; `heroHasId:true`, `heroDock:true` |
| **AM16** published 2-up, no pill | 2-up cards (title/excerpt/category-hue/date) | pubgrid `226/226px`; `noPill:true` |
| **AM17** mobile sky retuned (taller, top-5, edge-padded) | portrait sky, top-5 labels only, clamped | mobile sky `388×474`; **`mobLabelsClipped:0`** (v2 clipping class killed) |
| **AM18** page order (amends AM9) | Statement→Values→Numbers→Questions→Now→Published→Settings | mobile DOM order exact |
| **AM19** Yumi offers top of Values, graduate | offer owner-only at values top; accept → value card in place | offer→gone, Craft card added (vcards 4→5) |
| **AM20** sparse invitation lines | in-sky invitation + numbers section invitation | `skyInvite:1`, `sectionInvite:1` |
| **AM21** owner/visitor matrix | preview hides Questions/Now/Settings/offers/full-sky | 5 owner-only visible → 0 on preview; visitor sees Numbers (✓) not Questions (✓) |
| **AM22** stable category→hue | fixed slug-order map, same hue everywhere; sky adjacency distinct | consistent across sky + cards |
| **AM23** interaction a11y | stars/planets/chips focusable (tabindex+role), focus-visible, reduced-motion, P3 hits | star `tabindex 0/button`; mobile hits: chips **44**, stars **46**, planets **46** |

Plus: **AM3 occupancy 95% span** (2-col `674/510px`, D1 PASS); prose ≤72ch (D2); **h-scroll 0**
both frames (D3/P8); **console clean**; warm ground only; tracked tree clean.

*Residuals for the felt pass:* (1) AM5 "stars lead" / AM6 "typographic load" / AM10 "containment
reads right" are **felt** calls the DOM can't settle — Preston's eyes. (2) Mobile star 44px hits
overlap where sub-theories cluster on one planet (P3 ≥8px separation is a build-time spacing
refinement — flagged, not silently carried). (3) **AM8 persisted `profile` field remains the
explicit pre-BUILD data-plan checkpoint.** (4) STAGING NOTE: with AM11 aboard, the build likely
exceeds the five-beat budget — the AM11 split fork (overview row R9a / per-category cards R9b) is
the named pressure valve to present at BUILD estimate.

*SHAPE-B v3 complete. Preston's felt pass on v3 = STRONG PARTIAL — sky/strip/orbs/color/honesty
kept; QUALITY + ORGANIZATION failed; AM17 verification failure named (edge-only measurement).*

---

## SHAPE-B v4 — REBUILD against AM24–AM40 (executor, 2026-07-12)

Four artifacts: **owner + visitor, each at 390 and 1280** (AM34). Elevation grammar (AM24), one
hue anatomy + deep ramp (AM25/AM26), meaning split (AM27), gilded seam (AM28), uncarded thesis
(AM29), mono numerals (AM30), bar=share (AM31), polish batch (AM32), DOM=reading-order (AM33/AM36),
**collision-RESOLVING label placer** (AM17/AM38). Live-gate evidence (`:8771`, DOM-measured):

### AM38 — the named enforcement (measured label rects at 390, printed)
**Owner-390 AND Visitor-390: 5 labels each, 0 intersections, 0 overflow** (sky 388×478). Rects
(x0–x1, y0–y1 within sky):
- Critical Pedagogy `112.9–225.6 · 272.4–292.4`
- Political Philosophy `89.3–195.3 · 404.0–420.0`
- Philosophy of Mind `74.6–179.6 · 95.9–111.9`
- Social Theory `236.0–308.3 · 165.3–181.3`
- Memoir `239.6–281.8 · 351.2–367.2`

The v3-failing pair (Philosophy-of-Mind × Political-Philosophy) is now y-separated (96–112 vs
404–420) — no intersection. The placer is an algorithm (greedy place → nudge y → drop if
unresolvable), so it kills the CLASS, not two instances. *(Verified via getBoundingClientRect on
every `.pf-plabel`, pairwise AABB intersection + sky-bounds overflow; both mobile frames.)*

### AM26 — deep ramp AA (measured contrast on `--surface-2` #efe7d6)
All 10 `--field-*-deep` pass AA 4.5:1: `f1 5.50 · f2 5.43 · f3 5.40 · f4 5.05 · f5 5.42 · f6 4.89
· f7 7.01 · f8 5.03 · f9 5.32 · f10 7.17`. (Lowest f6 = 4.89 ≥ 4.5.)

### The rest
| Lock | Evidence |
|---|---|
| AM24 elevation | cards = `--surface` + warm shadow, no heavy border |
| AM25 one anatomy | catcard/pub border `none` (left-rail `::before` + dot); `noPill:0` |
| AM27 meaning split | grid `708/472px`; areas values,questions,now→main · numbers,published→rail |
| AM33/AM36 DOM order | grid DOM `[values,numbers,questions,now,published]`; mobile full `[statement,values,numbers,questions,now,published,settings]` |
| AM28 gilded seam | hero `::after` gradient hairline (inset, fading ends), no band |
| AM29 uncarded thesis | `thesisUncarded:true`, scaffold copy gone |
| AM30 mono numerals | stat `.n` = DM Mono (tabular/lining) |
| AM31 bar=share | bars `[36,19,12,12,9,7,6]%`; CP 36% = 46/129 |
| AM32 polish | resting chips = gold ring; strip scrollbar hidden; catgrid auto-fit; counts+hint hierarchy |
| AM34 visitor | visitor sees values/numbers/published; NOT questions/now/settings/offer/preview; grid `"values numbers"/"values published"` |
| AM37 strip | one lit at a time (Liberation→Doubt switches; re-tap untoggles) |
| AM15 hero | 514px (~60vh band) |

Plus: **AM3 occupancy 95%**, prose ≤72ch, **h-scroll 0** all frames, **console clean**, warm ground
only, tokens-only (deep ramp is the sanctioned `--field-*-deep` companion, not invented hexes).

*Residuals for the felt pass:* (1) elevation/hue-anatomy/thesis reading right = felt calls;
(2) **visitor-view balance at both viewports** is explicitly for Preston's eyes (AM34) — the
desktop visitor is values-left + numbers/published-rail under a fenced sky; (3) **AM8 persisted
field** = the pre-BUILD data-plan checkpoint; (4) **AM11 + AM39** build-size → the split-fork +
sky-render-budget go to the BUILD estimate, not absorbed silently.

*SHAPE-B v4 complete. Preston's felt pass on v4 = STRONG PARTIAL — Published spec-collision
(AM16×AM27), lost lens axis, new sky-text collision at 1280.*

---

## SHAPE-B v5 — REBUILD against AM41–AM52 (executor, 2026-07-12)

Four artifacts (owner + visitor, 390 + 1280). Published re-homed to a full-width band (AM41-43);
lens axis restored owner-only (AM44-46); collision engine WIDENED to all sky text + invitation,
docked in the emptiest quadrant (AM47); avatar + byline restored (AM49); fencing completed (AM50).

### AM47 — the widened enforcement (measured `.pf-skytext` = labels + invitation, BOTH widths, ALL frames)
Zero intersections, zero overflow, invitation included as a participant everywhere:
| Frame | sky | text elts | intersections | overflow |
|---|---|---|---|---|
| Owner 390 | 388×478 | 6 (5 labels + inv) | **0** | **0** |
| Owner 1280 | 1278×398 | 8 (7 labels + inv) | **0** | **0** |
| Visitor 390 | 388×478 | 6 | **0** | **0** |
| Visitor 1280 | 1278×398 | 8 | **0** | **0** |

The v4 failure (invitation through a star near CP at 1280) is fixed: `placeInvite` computes quadrant
occupancy from label + STAR boxes, docks the invitation in the emptiest quadrant, and verifies it
clears every occupied box. *(Method: getBoundingClientRect on every `.pf-skytext`, pairwise AABB +
sky-bounds, all four frames.)*

### The rest — measured
| Lock | Evidence |
|---|---|
| AM41 published re-home | not in grid; full-width band below; 3-up desktop / 1-up mobile; rail = `"values numbers"/"questions numbers"/"now numbers"` (Numbers-only) |
| AM42 anatomy | lineage "from the arc [X]"; category↔date gap **173–249px, 0 collisions** (v4 bug dead); equal-height cells (all 128px) |
| AM43 behavior | newest-first, cap 6, "all published work →" to Arcs when >6 (hidden at 3) |
| AM44-46 lens axis | owner seg `[Categories|Lenses]`; toggle regroups (lens grid shown, cat hidden); caption "a book can hold several lenses — shares overlap"; **visitor has NO seg** |
| AM45 lens treatment | gold-family anatomy (gold-deep rail/dot/text), bars kept, share scale |
| AM48 chip overflow | mobile strip `.overflow` (edge fade + ›) true; desktop false (fits) |
| AM49 identity | avatar (offset gold ring) + "Publishing as Preston A." byline, BOTH modes |
| AM50 fencing | visitor value cards published-subs-only + recount (Liberation 2 / **Praxis 0 stands-on-why** / Doubt 1 / Dignity 0); retired-note owner-only; **strip renders for visitor & lights published stars only** (Lib→2, Praxis→0 on fenced 3-star sky); questions/now "only you" whisper; numcov voice own="your"/vis="their" |
| AM51 DOM order | statement→values→numbers→questions→now→published→settings (mobile exact) |
| AM52 visitor | categories-only Numbers (no toggle), new Published band, fenced value cards, strip functional |

Plus: h-scroll 0 all frames, console clean, warm ground, tokens-only (deep ramp sanctioned).
**LEDGER (close):** R10 RETIRE-LENSES gains a consumer (the profile lens surface) — record so R10
argues with full information.

*Residuals for the felt pass:* elevation/anatomy/lens-view/visitor-balance are felt calls; **AM8
persisted field + AM11/AM39 build-size** remain the pre-BUILD checkpoints.

*Next: Preston's felt pass on v5 (owner + visitor, both viewports).*
