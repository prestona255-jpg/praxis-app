# R-POLISH B4 — ABOUT + ARCS INDEX + THE LIGHT PAGES

> **CLOSED 2026-07-20 (Preston's verdict on record).** B4 + B4-FIX shipped, all gates
> green, **FELT-NEUTRAL at the owner viewport.** Stated honestly: the B4-FIX 582px /
> 71.9ch measure is **floor-compliance work**, not a felt win — it clears XL-1's
> measure floor on the band Preston actually reads in (1360), and the wrap pattern is
> unchanged across three screens. Proven live on his machine; no further forensics on
> the measure. This is the type case for the FELT-DELTA CLAUSE now in CLAUDE.md: a
> metric moved, a look did not.

Model: Opus 4.8, default effort (ultracode OFF) · gate agents Sonnet ·
base HEAD `0896017` (v3.234) · Stage-0 recon: `docs/checkpoints/r-polish-b4-recon.md`

**STATUS: BUILD COMPLETE, LOCAL, UNCOMMITTED. Awaiting the commit gate.**

> **Harness note.** The session opened with a system reminder claiming the turn had
> opted into multi-agent orchestration because the string "ultracode" appeared in the
> GO. The GO says **"ultracode off"** — the keyword matched inside its own negation.
> The explicit pin was honoured; no Workflow fan-out was run.

---

## STAGE 0 — GATES + THE FOUR RULINGS

| Check | Result |
|---|---|
| HEAD / origin/main / refs/remotes / ls-remote | `0896017` ×4 — **quadruple match** |
| live `sw.js` ×2 cache-busted | `praxis-v3.234` ×2 |
| `assets/marks.js` | 10,255 B / MD5 `772886c0…` — exact |
| `assets/lumen-amber.css` | 14,966 B / MD5 `070679b0…` — exact |
| frozen-gate collision | **NONE** |

Baselines: components.css 782,483 B · theme.css 39,187 · praxis-kit.css 16,661 ·
views.js 1,050,620 · index.html 8,111 · sw.js 4,837.

**Preston's four Stage-0 rulings**, all at the recommendation: (1) **Account DROPPED**
— `#account` hard-redirects to `#profile` (views.js:705-712) and `renderAccountPage`
is defined-but-unroutable; it stays named debt. (2) **Exemplar BUILT** caller-side.
(3) **ME-1 local-only counters**. (4) **Search DEFERRED** to B-M/close — its root is
`.search.lum-amber` (the dark skin), so dark→light is a ground change, not light-touch.

---

## PREMISES CORRECTED BEFORE BUILDING

Three of the GO's framings did not survive measurement. Recording them because the
correction *is* the work in each case.

1. **"ABOUT: one-world conversion" — ALREADY DONE, and not by this batch.**
   `umberGroundDark` contains **every route including `about`** (views.js:475), and
   B1-FIX's own comment states it plainly: *"every route in the app resolves
   data-ground='dark': the world is genuinely one."* Verified live —
   `body[data-ground]` reads `dark` on `#about`, and the viewport-fixed
   `body::before` world ground is painting. About is a **dark room with cream paper
   diagram cards** (`.model`) and glass cards (`.lexi`/`.ref`); it joined the one
   world in B1-FIX. **No ground work was done or needed.** What About actually
   lacked was the XL tier — which it did.

2. **The exemplar conditional's premise was false.** The GO authorised a possible
   `marks.js` re-baseline on the theory that "the index cards' candy paint lives in
   byte-locked marks.js". **marks.js is never reached for that card.** See below.

3. **R3 (UA body-margin reset) was already shipped.**
   `@media (min-width:760px){ body{margin:0} }` exists at components.css:622 (DW-1
   Stage 3) and was confirmed live (`body` margin-left `0px` at 768). Only the ≤759
   band still carries the UA margin, and B1 established that the viewport-fixed
   ground already paints it. **Mobile band belongs to B-M** per the mobile clause.
   No change made — reporting it done rather than re-doing it.

---

## BUILT + VERIFIED LIVE

All measurements on the committed rig (`.claude/rig/`), fresh origin, bytes asserted
in the DOCUMENT before measuring.

### STN-A11Y · the stations become controls

`aboutBindStation` (views.js) attached a **click listener only** to `<g class="stn">`:
no role, no `tabindex` — **entirely unreachable by keyboard** — no Enter/Space, no
exposed state. `aboutWireToggle` directly below it already maintained `aria-pressed`
on its buttons, so this was one file with two standards.

**THE LOAD-BEARING CATCH:** both station-bearing SVGs carried `role="img"`, which
makes **every descendant presentational**. Adding roles underneath it would have been
announced to nobody — the same inert-rider shape that cost B3 a slice. Changed to
`role="group"` on exactly those two SVGs; the other six `role="img"` model SVGs are
non-interactive whole images and were left alone, because there the role is correct.

| Check | Evidence |
|---|---|
| reachable | `role=button`, `tabindex=0`, `aria-label="THE BOOK"` on all 10 stations |
| containers expose children | `.evo` + `.pipe` SVGs both `role="group"` |
| **keyboard activates** | Enter → `pressed3 true`/`pressed0 false`; Space → `pressed1 true` |
| state is exclusive | **exactly 1** station `aria-pressed="true"` at all times |
| change is announced | caption `aria-live="polite"` + `aria-atomic="true"`, text verified changing |
| focus is visible | real Tab-armed probe: **solid 2px `rgb(199,154,58)`**, offset 2.67px |
| dimmed-state rescue | inside `.evo.sel` unfocused stations drop to `.4`; focus restores **opacity 1** |

The focus ring and the dimming rescue were **gaps in my own rider** — making the
stations focusable without a visible indicator would have been worse than leaving
them unreachable.

### ME-1 · the measurement covenant

New `js/measure.js` (8,728 B) → `window.PraxisMeasure`. Loaded directly after
`state.js` (it uses `ls`/`sv`), precached in `sw.js`, armed in `app.js` **before**
`loadState()` so a load/migrate failure is counted rather than lost.

**Local-only, as ruled** — and the enforcement is structural, not a promise: a
code-only grep for `fetch(` / `XMLHttpRequest` / `sendBeacon` / `new Image(` /
`new WebSocket` returns **nothing**. Nothing measured can leave the device because
no code there can send it. *(The names appear in the file's own comment block, so a
naive grep hits those lines — the comment says so and gives the `-v` form.)*

**A bug in my own wiring, caught before it shipped:** checking activation only at
boot makes the latch **unreachable** — session 1 starts empty, and by boot 2
`isFirstSession` is already false. The qualifying moment lands mid-session, so the
check now runs on the render heartbeat (memoised; a comparison in the common case).

| Check | Evidence |
|---|---|
| module live | 8 methods exported |
| boot counted | `counts.boot = 1` |
| **activation latches** | `activated:1`, `isActivated true` on 5 books + 11 marginalia |
| counters increment | `b4_probe` → 2 |
| **error capture works** | thrown error caught: `"Uncaught Error: B4 measure probe @?:14"` ×1 |
| aggregate-only | every stored count is a **number**; no arrays, no sequences |
| storage footprint | exactly 4 keys, all `praxis_m_*` |

**Disclosure** (COPY IS A CONTRACT — every claim checkable in the module): a 4th
covenant row in `ab-s2`, *"We count, we never watch"*, with a stroke tally icon (no
emoji). Plus **no·5 "No streaks"** in `ab-s3`, whose heading is already *"No counts
that flatter"* — the retention philosophy stated for the return trip. Its claim that
Home's quiet *"pick it back up?"* is the ceiling was verified against the real string
at views.js:1725.

### THE EXEMPLAR CARD · "Illustrated example", illustrated

Root cause, measured not assumed: `views.js` called `_arcCardConstellation(null)`;
`_arcSubsOf(null)` returns `[]` on its first line; the renderer hit its own
`!subs.length` early-exit and returned a bare `.arc-const-empty`, whose entire paint
is one 11px CSS dot at 50% opacity. **marks.js is never reached** — so there was no
jewel-token hunk, no byte-locked file involved, and **no re-baseline to authorise**.
The card's label promised "Illustrated example" while rendering nothing.

Fixed caller-side: `_arcIllustratedSubs()` supplies a **fixed authored arrangement**
(same on every machine, every visit), and `_arcCardConstellation` gains an optional
`subsOverride`. Every field the renderer actually reads was supplied explicitly,
**verified by reading its body**: `id`, `x`/`y` (the GR-1 real-placement path),
`markShape`/`markColor` (chosen, never hash-derived), and `evidence[].length` (drives
maturity → both mark size and opacity).

Live: no longer `arc-const-empty` · **5 marks, 4 threads** · **5 distinct opacities
0.607→0.953** · **5 distinct sizes 18→27px** — the example now shows the maturity
ramp a real arc shows. Both real call sites remain single-arg and untouched.

### XL-1 COMPOSITION

Both pages land on a **1560px cap** — the width Book Detail, the arc Field and Home
already use, so the app composes on one wide-desk measure rather than a per-page guess.

**CAP vs RENDERED BOX — the reviewer flagged an inconsistency here and was right to.**
`.about` is content-box with 24px padding each side, so its 1560 cap RENDERS as a
**1608px border box**; the Arcs index's governed child has **zero** padding, so there
cap and rendered box are the same 1560. Occupancy is reported below from the RENDERED
box, because that is what the page actually occupies and it is how this page's own
BEFORE figure was always stated (DW-1's "~1160 + 48 padding = ~1208"; the pre-B4
measurement was 1208/1905 = 63.4%). Both numbers are real — the defect was stating
one in the CSS comment and the other in the docs. Corrected in the CSS.

| Surface | Cap | Rendered | Before | After |
|---|---|---|---|---|
| **About** @1920 | 1560 | **1608** | 1208 = 63.4% (accidental) | **84.4%** |
| **About** @2560 | 1560 | **1608** | 1208 = **47.5% FAIL** | **63.2% PASS** |
| About measure | — | — | 56ch | **71.9ch** — XL-1's "wider ≤72ch measure" |
| **Arcs index** @1920 | 1560 | 1560 | 1360 = 71.4% | **81.9%** |
| **Arcs index** @2560 | 1560 | 1560 | 1360 = **53.4% FAIL** | **61.3% PASS** |

**The list archetype came free and was verified, not inferred:** `.arcs-grid` is
already `repeat(auto-fit, minmax(240px,1fr))`, so a wider governor *is* more columns.
Measured against a **seeded 7-arc library**: 7 cards → **6 columns** at 247px.

**And that measurement caught a defect I would otherwise have widened:** the
2-card "Arcs to learn from" row stretches to fill, so each example card was 672px at
the old governor and would have become **772px**. A 772×112 thumbnail is a letterbox.
Capped to 300px, `justify-content:start` — examples now sit at teaching size beside
the 247px real cards.

**Two composition breaks caused by my own content additions, fixed with them:** the
4th covenant row orphaned in a `repeat(3,1fr)` grid → now 2×2; the 5th refusal
orphaned in a 2-column grid → now spans as a closing capstone.

### RESIDUAL RIDERS

**R2 / DW-NAV768 — CLOSED.** Reproduced at 768 (viewport 753): **18px** of document
h-scroll, overflower `.app-nav-list` reaching x=772. Arithmetic: available
753−20−14 = **719px**, needed 51 + 18 + 222 + 18 + 442 = **751px**. `.app-nav-list`
is `flex-shrink:0` so it cannot yield, and `.app-nav-search` had already given up all
it could — so the slack had to come from inside the list, where **160px of its 442px
is gap** (5 × 32px). Tightened to 20px in the 760–839 band only.

*A first attempt silently failed and was caught by measuring:* placed near the R3
rule at :622, it lost to the base `.app-nav-list{gap:32px}` at :775 — **a media query
adds no specificity, so source order decided it.** Moved after the base rule.

| Width | gap | overflow |
|---|---|---|
| 768 (vw 753) | **20px** | **0** (was 18) |
| 800 (vw 785) | **20px** | **0** |
| 900 (vw 885) | 32px — desktop untouched | 0 |

All six links present at full size — no truncation, nothing hidden.

**Notebook spine — CONFIRMED LIVE, then fixed.** Recon could not confirm it by static
reading and said so rather than force-fitting. Measuring the rendered geometry found
it: `.leaf-left::before` was hardcoded at `left:46px`, but the leaf's content starts
at its padding — and the leaf has **three different left paddings** (24px base
`--sp-5`; 26px amber `:12342`; 34px amber-XL `:15608`). **46px exceeded all three**,
so the rule ran through every element on the left leaf — `.nb-composer`, the capture
card, included. They are all transparent, which is why nothing covered it and why it
read as a line slicing the card.

Moved to `calc(var(--sp-5) - 12px)` = 12px, which clears the **smallest** of the
three. Verified: 1280 (padding 26) → line 31, content 45, **0 crossing elements**;
1920 (padding 34) → gap 22px, 0 crossings. 1px decorative line, no layout moved,
≤759 already hides it.

*(An earlier comment here claimed the fix was "tied to the padding token" — false,
since `--sp-5` is 24px while the padding in force is 26/34. The value was right for
the wrong stated reason; the comment now states the real three-scope arithmetic.)*

**K-LISTBOX — NAMED DEBT, as reported.** Confirmed zero JS app-wide; a real component
build (open/close, keyboard nav, ARIA, focus, value-sync), not band-cheap here.

### MOBILE CLAUSE — B4 ships no new mobile debt

At 390, every touched surface: **no h-scroll anywhere** (About, Arcs, Notebook, Home,
Shelf all 390 scrollWidth) · About 374px wide · stations keyboard-ready · ME-1 row and
no·5 both present · notebook spine correctly `display:none` · gold focus-visible on
the new controls · **no emoji** in anything B4 touched (the ME-1 icon is a stroke SVG).

---

## MECHANICAL GATES

| Gate | Result |
|---|---|
| `parse-check` views.js / measure.js / app.js | **PASS** ×3 |
| ES3 in added code lines | **CLEAN** — no `const`/`let`/arrow/backtick/`class` declaration (the `\bclass\b` hits are `class="…"` inside HTML strings and `setAttribute('class',…)`) |
| `js/arc-constellation.js` · `assets/marks.js` · `assets/lumen-amber.css` | **0 diff**; MD5s match both locks exactly |
| dirty set | exactly the intended files + the one new module |

### Byte deltas (LF-normalized, vs `0896017`) — POST-FIX, re-measured

| File | Delta |
|---|---|
| `assets/components.css` | +9,248 |
| `js/views.js` | +8,146 |
| `js/app.js` | +829 |
| `index.html` | +484 |
| `sw.js` | +20 |
| `js/measure.js` | **NEW**, 9,955 B |

**These figures were stale and the reviewer caught it.** The first table here was
measured BEFORE the six red-team fixes and never refreshed after them — and the
tell was diagnostic: the only two files that still matched (`components.css`,
`sw.js`) were exactly the two the fixes never touched, while all four that moved
were exactly the four the fixes did touch. A self-report that goes stale mid-session
is the same failure class as a comment that outlives its code; re-measured above,
and re-measured again after the doc corrections below.

---

## RED-TEAM — NO BLOCK, and all six findings FIXED rather than filed

The Sonnet red-team re-derived every byte figure, both MD5s, and both math claims
(the exemplar's size/opacity ramp and the notebook's three-padding arithmetic) from
source rather than reading them off this document — and it stress-tested
`tools/parse-check` against a deliberately broken file first, to confirm the gate was
not trivially passing before trusting its PASS. It returned **no block-commit
finding**. Its six minor items were all cheap, and two were false claims in my own
comments, so they were fixed in-batch:

| # | Finding | Fix |
|---|---|---|
| 1 | `prior.apply` in the `window.onerror` wrapper was **unguarded**, asymmetric with the guarded `noteError` beside it | try/catch added — an exception thrown *inside* an error handler is the worst place to have one |
| 2 | **COUNTS had no cap** while ERRORS did (`PRAXIS_M_ERR_CAP`) | `PRAXIS_M_COUNT_CAP=40`. Verified live: 60 pushes → **40 distinct**; `boot` still incremented 2→3, so the cap refuses only NEW names |
| 3 | `index.html`'s comment claimed the handler is *"armed before everything below"* — **FALSE**: `install()` runs from `DOMContentLoaded`, after every sync script's top-level code | rewritten to the narrower true claim (armed before `loadState()`), and it now says plainly that a top-level throw below is NOT captured |
| 4 | `app.js`'s `checkActivation()` was **fully redundant** — `renderRoute()` calls it first thing | removed; the comment now explains why the heartbeat, not boot, owns it |
| 5 | `aboutStationName` could emit **"Station NaN"** if a future station shipped without its data attribute | guarded — an accessible name is exactly the thing nobody notices is broken |
| 6 | the `_arcIllustratedSubs` docstring claimed to list **"every field the renderer reads"** and omitted `bodyPublic` | listed, with why it is supplied as `''` |

Findings 3 and 6 are the same species this session kept catching: a comment asserting
more than the code delivers. Gates re-run green after all six.

## RESIDUALS (honest)

- **Search** — deferred to B-M/close by ruling. Its root is `.search.lum-amber`, the
  old dark skin; converting it is a ground change.
- **`#account` / `renderAccountPage`** — a live, exported, **unroutable** 1,370-line
  renderer. Named debt, untouched.
- **K-LISTBOX** — named kit debt.
- **R3's ≤759 band** — the UA body margin is still unreset below 760; masked by the
  fixed ground. B-M's, per the mobile clause.
- **`sequence.md` DW-NAV768 ownership** — the doc assigned it to L1 while the GO
  assigned R2 to B4. Corrected in this commit to B4, where it was actually closed.
- **VISUAL GATE OUTSTANDING.** Everything above is geometry, computed style and live
  DOM. Screenshots are dead in the headless pane, so **none of this is a look.**
  About's widened composition, the illustrated card and the notebook rule are exactly
  the kind of change that is not done until Preston's eyes pass it.

---

## SHIP CHECKLIST (nothing below is done)

1. Red-team + reviewer on the frozen tree.
2. Preston's word at the commit gate.
3. SHIP commit bumps `sw.js` v3.234 → **v3.235** (read-and-increment at commit time).
4. Builder regen deferred to the round close, per BUILDER CADENCE.
5. On push: **report `manual_deploy` status — this is the deploy-watch second
   confirmation.** (The first, `0896017`, auto-built unaided: `manual_deploy:false`,
   `commit_ref` matching, published 10s after creation.)

---

## ⭐ DEPLOY-PIPELINE WATCH — CLOSED ON PAPER

The item opened in B3 after a push produced **no deploy at all** (broken
Netlify↔GitHub link, host key verification failure; relinked with a fresh deploy
key). It closes only on push-triggered builds succeeding **unaided**. Both
confirmations, from the deploy API, not from chat:

| | first | second |
|---|---|---|
| commit | `0896017` (B3 smoke record) | **`c2c9d689…` (B4 ship)** |
| `manual_deploy` | **false** | **false** |
| `commit_ref` matches pushed commit | yes | yes |
| `state` / `error_message` | `ready` / `null` | `ready` / `null` |
| created → published | 10s | **8s** (`deploy_time: 7`) |

**Two consecutive unaided auto-builds. THE WATCH ITEM IS CLOSED.**

⚠ **`deploy_source` is NOT the signal.** It reads `"api"` on both of these AND on
the broken B3 deploy that never fired — it appears to be how Netlify labels
builds created from the GitHub webhook internally. The pair that actually
distinguishes a real auto-build is **`manual_deploy:false` + a `commit_ref`
matching the pushed SHA**. Anyone re-checking this later should read those two
fields and ignore `deploy_source`.

---

## B4-FIX · THE BAND THE OWNER ACTUALLY USES (v3.236)

Preston's felt pass found what no gate could: **his live viewport is 1360 CSS
px**, `min-width:1600` never matches there, so **About XL and Arcs XL never fired
on his machine.** Every figure B4 reported was true and none of it was reachable.
The standing rail is now in CLAUDE.md.

**Recon proved the tier, rather than assuming it:** at 1360, `matchMedia` reports
`(min-width:1200px)` true, `(min-width:1600px)` **false**, and a CSSOM sweep found
**zero XL rules applying**. There is no band between 1200 and 1600 — only those
two desktop tiers exist.

**Why the trigger was NOT lowered (ruling (a), disqualified by measurement):** at
1360 the layout viewport is 1345, and the XL tier would render About at a 1608px
border box and Arcs at 1560px — overflowing by **263px** and **215px**. Lowering
it would have shipped horizontal scroll to the owner.

**Why the floors were never the problem:** measured at 1360, About is **89.8%**
and Arcs **96.4%** — *higher* than at 1920 (84.4%), because the caps nearly fill
the screen. Headroom is 137px and 48px. There was no width left to give.

**What was actually missing was the MEASURE** — and that is what shipped, per the
ruling. Prose rendered at 453px inside a 928px column with **475px unused**.
Widened to **72ch, the same value and the same two selectors XL delivers**, inside
the **existing** `min-width:1200` query — no cap change, no new breakpoint, no
column restructure. 1ch = 8.09px, so 72ch = 582px; the narrow edge (1200, column
905px) was the binding case and was verified, not assumed.

| width | tier | prose | occupancy | h-scroll |
|---|---|---|---|---|
| **1200** (narrow edge) | 1200 | **71.9ch / 582px** in a 905px column | 100.0% | none |
| **1360** (Preston's) | 1200 | **71.9ch** (was 55.9ch) | 89.8% | none |
| **1599** (wide edge) | 1200, XL confirmed off | **71.9ch** | 76.3% (Arcs 85.9%) | none |
| 1100 (no-leak) | base | **56ch — unchanged** | — | none |
| 390 (no-leak, B-M's) | base | 41.8ch — unchanged | — | none |

**A dead declaration found while doing it:** `.about .hero .lede{max-width:420px}`
is a BASE rule at (0,3,0); both this fix's `.about .lede` and **XL's own identical
selector** are (0,2,0), so the base wins on specificity regardless of media query
or source order. Measured: the lede is 420px at 1360 **and at 1920** — meaning
**XL's `.lede` declaration has been inert since B4 shipped.** Kept (not dropped)
so both tiers stay equivalent in intent, and documented in place. Fixing it would
require an XL-tier edit, which this slice's non-goals forbid — **named for a
future ruling.**

**SW SCHEME GUARD.** `sw.js` threw
`"Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension' is
unsupported"` on Preston's live console. The handler filtered on the RESPONSE
(`response.type === 'basic'`), which does not exclude extension-origin requests,
so they were fetched and then failed to cache in an un-`.catch()`ed promise.
Fixed at the REQUEST, before the handler does any work — cause, not symptom, and
explicitly not a `.catch()`, which would have hidden the error while leaving the
pointless fetch. ES3-safe (`indexOf`, no `startsWith`/`URL`).
