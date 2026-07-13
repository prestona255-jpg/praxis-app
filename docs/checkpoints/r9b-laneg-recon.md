# R9b Lane G — Stage 0 recon (galaxy + desktop composition rider)

Target **v3.201**, display-only. Rails: `js/views.js` + `assets/components.css` +
`assets/theme.css`. Evidence = live-DOM `getBoundingClientRect`/computed-style on the
D0 rig (static-server :8761, `getCurrentUser` stubbed to `rig_user`, in-memory fixtures,
direct `renderProfilePage()`). Screenshots hang in this headless pane — DOM geometry is
the evidence, per rig facts.

---

## 1. GATES (all clear)

| gate | result |
|---|---|
| HEAD == origin/main | ✅ `f7b2ddf` == `f7b2ddf` |
| live sw.js == v3.200 (2× cache-busted) | ✅ `praxis-v3.200` both fetches; `Age:0` fresh edge (not stale) |
| local sw.js | `praxis-v3.200` |
| ON-1/ON-4 morning report in docs/checkpoints/ | ✅ `overnight-on1-on4-2026-07-13.md` present |
| Now == R9b Lane G | ✅ sequence.md Now = R9b; Lane P shipped v3.200; Lane G is the galaxy lane |
| no other regen-owner mid-flight | ✅ Builder regen is deferred to THIS round's close-out (handoff §7) |
| confirm-pass status | handoff §1 says OWED; **prompt Context says GIVEN (2026-07-13)** — resolved, panel gate unblocked |

---

## 2. HANDOFF vs PROMPT — one flag, NOT a contradiction

The canonical handoff `docs/studio/r9b-laneg-handoff.md` covers **only the galaxy** (§2
LOCKS: central orb · CSS-only motion · presence · sky lens-mode · published-arc
constellations · selection-scoped panel · teal→gold re-skin · AM39 budget). The prompt
adds a **DESKTOP COMPOSITION RIDER (Stage 1)** — widen the portrait body, the 8px margin,
the "›" orphan, journey dedup — which the handoff does NOT mention.

**Ruling: this is an ADDITION by the authoritative prompt, not a contradiction.** The
handoff is silent on desktop composition (it never says "no rider"); the rider is
consistent with `sequence.md` Now = "**DW-1..3 Desktop Wave (NAMED SLOT, pinned after
R9a)**" + the R9a **PROOF-SCOPE** lesson. Flagged here for Preston's awareness; proceeding
as the prompt directs. (No verbatim STOP — the STOP trigger is a genuine X-vs-not-X clash.)

---

## 3. RECON FINDINGS (line anchors + live measures)

### 3a — Portrait body container + occupancy + h-scroll (MEASURED on FIXTURE-R)

- **Body container = `.pf-below`.** Base `padding:0 18px` (components.css:13540). Desktop
  `@media (min-width:1200px)`: `.pf-below{ max-width:1280px; margin:0 auto; padding:0 34px }`
  (components.css:**13648, 13652**). The upper tier is **1200**, not 760 — R9a's first ≥1200 tier.
- **Effective CONTENT column caps at 1280**; the measured border-box = 1280 + 34·2 padding = **1348** at any width ≥ that.
- **8px `<body>` margin CONFIRMED** at every width (`getComputedStyle(body).margin == "8px"`) — the overnight handoff. On #profile it shifts `#app`/`.pf-root`/`.pf-below`/`.pf-hero` to left:8.

**Occupancy table — `.pf-below` (portrait BODY, by name) on FIXTURE-R (130/3/4/16):**

| viewport | body border-box w | left | occupancy | h-scroll (`scrollW−clientW`) |
|---|---|---|---|---|
| **1280** | 1249 (fills; parent<1280) | 8 | **97.6%** | **0** |
| **1440** | 1348 | 38 | **93.6%** | **0** |
| **1920** | 1348 | 278 | **70.2%** | **0** |

- **KEY FINDING:** the body **already clears the ≥60% floor at all three widths (70.2% @1920).**
  So the rider is **composition-driven, not gate-rescue** — the Stage-1 occupancy gate is a
  **no-regression floor**, and the real wins are (b) strip/caption alignment and (c) full-width sections.
- **8px margin ↔ h-scroll:** on #profile there is **NO h-scroll** at 1280/1440/1920/390 — the 8px
  body margin is a cosmetic gutter here, not an overflow source (the overnight's 8px h-scroll was the
  NAV at 768, a different surface — morning report Discovery 2). **Removing the margin is app-wide
  blast radius** (every surface's `#app` shifts 8px + gains 16px width) → Stage-1 "verify-then-fix":
  prove no surface depends on it before removal; if any does, scope the fix.

### 3b — The strip + caption "pin to the left edge" (CONFIRMED @1920)

- There is **no `position:sticky`** in the pf CSS — "sticky" is a loose descriptor. The value
  strip + counts + taphint live in `.pf-hero-dock` (components.css:13504; `position:relative;
  padding:0 30px 16px` desktop), which sits **inside the full-bleed `.pf-hero`** (no max-width).
- **@1920 measured:** `heroDockLeft=8`, `stripLeft=38`, but `belowContentLeft=312` → a **274px
  horizontal misalignment.** The strip/counts pin hard-left while the body column centers. The
  strip spans the whole 1889px hero (stripWrap w=1829) vs the 1280 body column. **This is the
  3b "must compose, not pin to the left edge" issue, quantified.** Stage-1 must constrain the
  hero-dock inner content (strip + counts + taphint) to the same centered ~1400 column (the sky
  SVG can stay full-bleed; it's `preserveAspectRatio:xMidYMid`).

### 3c — The stray "›" glyph (DIAGNOSED — CAUSE FOUND, reproduced live)

- **Emitter:** `<span class="pf-strip-more">›</span>` at **views.js:17427** (inside `.pf-strip-wrap`,
  after `.pf-strip`, before `.pf-counts`).
- **CSS:** `.pf-strip-more{ display:none }` (components.css:**13510**); shown only under
  `.pf-strip-wrap.overflow .pf-strip-more{ display:block; position:absolute; right:2px; top:50%;
  transform:translateY(-60%) }` (**13511**). The `.overflow` class is added in **`_pfWire`
  (views.js:17573)** when `sc.scrollWidth > sc.clientWidth + 2` (the value chips overflow).
- **Live reproduction:** at 1280/1440/1920 with 5 values → `stripWrapHasOverflow:false`,
  `.pf-strip-more display:none` (hidden — correct). **At 390 with 5 values → `overflow:true`,
  chevron renders at l356/**bottom 580**, directly ABOVE the counts line (top 600):
  `stripMoreAboveCounts:true`, text "›".** ← **matches Preston's "stray ›above the counts line" exactly.**
- **CAUSE:** the P4/AM48 scroll-affordance chevron is correct on desktop (5 values fit → hidden) but
  on **mobile / narrow widths** (where chips overflow) it renders as a lone chevron at the strip's
  top-right — detached from the chips, redundant with the `.pf-strip-wrap.overflow::after` edge-fade
  gradient (13509), reading as an orphaned glyph. It appears on mobile (or on desktop only with ~15+
  values overflowing the ~1180px strip).
- **Stage-1 fix (≤10 lines, recommended):** drop the `.pf-strip-more` span (views.js:17427, 1 line)
  and its two CSS rules (13510-13511), keeping the edge-fade gradient as the sole overflow cue.
  Alternative (felt call): restyle-integrate it into the fade. Rides Stage 1 (touches the same strip
  the hero-dock alignment touches). ≤10-line surgical — kept in Stage 1, not spun out.

### 3d — Journey month-label dedup (CONFIRMED emitter, dedup site identified)

- **`_pfJourneySection` (views.js:17658-17669)** renders one `<div class="pf-journey-row"><b>` +
  `_portraitEsc(m.when)` + `</b> — …` **per milestone, with no dedup.**
- **Data:** `_portraitJourneyData` (views.js:16512-16571) emits ≤5 milestones (firstBook / firstEntry
  / firstLens / firstSub / lastEntry), each carrying `when: _portraitJourneyMonth(ts)` (16504). **Two
  milestones in the SAME month print the SAME `<b>Month YYYY</b>` label** (e.g. a reader whose first
  book and first margin both land in one month). Live FIXTURE-R spread the timestamps so labels differ
  (May/Jun/Sep/Oct 2025, Jul 2026), but the emitter proves collision is possible.
- **Stage-1 fix site:** the **render loop in `_pfJourneySection`** (track last-emitted `when`, print
  the `<b>` label once per group). Do NOT touch `_portraitJourneyData` — it's shared with the retired,
  defined-but-unrouted `renderAccountPage` (views.js:19869). ~6 lines, display-only.

### 3e — Sparkline + most-revisited data (RULED — honest fallbacks)

- **Dated events that EXIST:** `book.addedAt` (number), `notebookEntries[].createdAt` (number),
  `userThemes[].createdAt`, `subTheories[].createdAt`/`.publishedAt`. Verified live: journey reads
  them; returns reads note-per-book counts.
- **NO per-session/per-page "reading" event, and NO revisit/open-count store anywhere** — grep for
  `revisit|openCount|visitCount|lastOpened|timesOpened|readCount|openedAt` across `js/` = **0 matches.**
- **RULING (sparkline):** there is no true "reading" sparkline signal → the honest instrument is the
  **marginalia-rhythm sparkline** = `notebookEntries.createdAt` bucketed monthly, trailing 12 months,
  **labeled truthfully as marginalia rhythm** (not "reading"). For a category-scoped panel: that
  category's marginalia entries per month. (`book.addedAt` is a weaker secondary; marginalia is the
  richer within-category signal.)
- **RULING (most-revisited):** no revisit store exists → **"most-revisited" has no distinct signal.**
  The honest "returns" content = **most-annotated** (densest margins, from `_portraitReturnsData`
  views.js:16352 — live: "Theory Vol 1 · 5 notes") + **return-to-author** ("you return to Z. Marker ·
  across 2 books"). Do NOT fabricate a revisit count; label the returns signal for what it is.

### 3f — "passages" contradiction (RULED — carried from R9a close)

- **`_profileOverview` (views.js:16877)** returns keys `[books, marginalia, subTheories, published,
  arcs, journalQuestion]` — verified live. **No "passages" key; no passages collection exists.** R9a
  deliberately replaced the mockup's "passages" stat with **"arcs"**.
- **RULING (the handoff §4 ruling task):** the selection-PANEL's **scoped counts = books · marginalia
  · sub-theories** for the tapped **category** (all three derivable: books = `_profileCategoryStats`
  `cats[].books`; marginalia = `cats[].marg`; sub-theories = `_pfOwnedSubs` filtered by
  `_pfSubCategory===cat`). **Never reintroduce "passages."** For a **lens**-scoped panel: books +
  marginalia are clean (`_profileLensStats` `lenses[].books/.marg`); sub-theory count is not cleanly
  lens-derivable (subs carry a derived CATEGORY, not a lens) → omit the sub-count on lens panels, or
  derive-if-present. Locked before the Lane-G mockup.

### 3g — Tradition-forms silhouette candidates for the sigil-galaxy core (3 real, cite-able)

Two grammars in the tree; both are real "mark grammar":
- **`_tfaGeometry` tradition forms** (js/tradition-forms-arc.js) — per-tradition silhouettes, the
  DERIVED-per-dominant-tradition path (fits v1's "derived default shape"):
  - **wisdom → hexagon** (tradition-forms-arc.js:242-250) — a contained gem; the "gilded orb" resonance.
  - **history → diamond** (tradition-forms-arc.js:261-270) — a sharp rotated-square identity glyph.
  - **poetry → triangle** (tradition-forms-arc.js:287-297) — an upward summit glyph.
  (also: theory→rounded-square, empirical→pentagon, memoir→circle, novel→ellipse, place→organic blob,
  practice→trapezoid.)
- **`PraxisMarks` 16 shapes** (assets/marks.js:40-57) — the sub-theory mark grammar; star-like cores:
  - **"03" the compass — four-point star** (marks.js:43) — a radiant guiding star at a galaxy core.
  - **"14" the spark — six-point star** (marks.js:54) — a center-burst core glint.
- **Stage-2 mockup shows THREE candidates** for Preston's felt-pass pick. Proposed trio (Preston
  decides): **A = compass/four-point star**, **B = wisdom hexagon**, **C = spark/six-point star** (or
  history diamond). All ship a DERIVED default (dominant tradition → shape; no picker in v1).

### 3h — Sky element census + collision set (from `_profileBuildSky`, views.js:17073-17174)

Emitted SVG elements: `.pf-skybg` rect · `.pf-spk` specks (20–95 mob / 130 desktop) · `.pf-conline`
(hub-radiate, drawn on tap) · `.pf-planet` groups (`.phit` hit + 3 nested circles) · `.pf-plabel`
labels (collision-resolved) · `.pf-invite` (emptiest-quadrant invitation, thin-signal only) ·
`.pf-vline` value lines (faint-default `opacity:.34`, `.on` `.78`) · `.pf-star` groups (`.shit` hit +
`.glow` + dashed draft ring + `.core`).

**Current collision-proof set (`_pfPlaceLabels` + `_pfPlaceInvite`, 17126-17152):** labels avoid
{stars (10px boxes) + planet CORES (prad·0.5)}; the invite avoids {labels + stars via `occ`}. **NOT in
the set:** value lines, constellation lines, arc-constellation labels (don't exist yet), **the
first-visit intro panel, the whisper.**

- **Intro panel** = W9 system, `ROUTE_INTRO['profile']='profile'` (intros.js:558), panel title "A
  portrait, not a scoreboard" (intros.js:61); separate DOM `.intro-panel-wrap`, removed in preview by
  `_pfWire` (views.js:17535). **Confirmed NOT in the sky collision set.**
- **Whisper** = `<span class="whisper">only you can see this</span>` in owner-only eyebrows (in the
  BELOW cards, not the sky). **Confirmed NOT in the sky.**
- **Lane-G obligation:** Stage-2 positions intro panel + whisper without overlapping any planet/label,
  AND the widened collision gate ADDS {value lines, curved lensing paths, arc lines+labels, sigil
  bounds, intro panel, whisper} at drift extremes on both fixtures.

### 3i — FIXTURE-S sparse sky (BUILT + rendered)

FIXTURE-S = 3 categories (Theory 2 / History 2 / Poetry 1) · 5 books · 1 published sub · 1 value.
Built in the rig harness (`window.__RIG.FS`; spec recorded here for durability).

- **@390** (viewBox 460×560): 3 planets **spread** — History (98,239), Theory (212,246), **Poetry
  isolated (294,92)**; 1 star, 3 labels, 0 vlines, 20 specks (min), **invite line shown** (bookN<25),
  1 vchip (no "›"). occupancy 95.9%, no h-scroll.
- **@1280** (viewBox 1000×460): 3 planets — Theory (470,230), History (200,290), **Poetry (501,47)**;
  planets cluster in the **left-center**, the entire right half (x501–1000) barren. occupancy 97.6%.
- **FINDING:** `_pfPlanetLayout` (views.js:16979) spreads planets on a rank-ellipse **regardless of
  count** → sparse skies read thin/lopsided with an isolated planet. Confirms the handoff's needed
  **sparse-sky rule (≤4 planets → centered cluster + tightened spread).**

---

## 4. STATS + PER-SLICE BYTE ESTIMATES

**File sizes (current):** views.js 942,464 B · components.css 650,210 B · theme.css (unread size —
tokens verified present: `--star-gold`/`--gold-hi`/`--gold-deep`/`--gold-ink`/`--br-deep`/`--sunk-d`/
`--field-1..10` + `-deep` ramp, theme.css:28/40/64/68 + 327-333).

**Byte estimates (agent estimates run ~2× low — these are FLOORS; measure at each slice):**

| stage | scope | est (floor) | ~2× ceiling |
|---|---|---|---|
| 1 desktop rider | CSS widen `.pf-below`→~1400 + regrid full-width + hero-dock align + 8px handling; JS journey-dedup (~6L) + "›" drop | +2–3 KB | ~6 KB |
| 2 mockup | one `design/*.html` (Universal v1.2, both grounds, all Stage-2 items) | 40–70 KB | (not served) |
| 3 center + lensing | orb SVG core + 3-candidate silhouette + curved lensing paths (views.js) + CSS | +4–6 KB | ~11 KB |
| 4 motion + presence + sparse | CSS keyframes + presence tune + sparse-cluster rule in `_pfPlanetLayout` | +4–7 KB | ~13 KB |
| 5 hues + lens-mode | deterministic hue map + owner-only sky lens toggle wiring | +5–9 KB | ~17 KB |
| 6 panel | selection-scoped bottom-sheet/side-panel builder + wire + CSS (**SIZE-VALVE candidate**) | +12–22 KB | ~40 KB |
| 7 constellations + interaction map + toggle re-skin | arc lines/labels + collision + rewire + teal→gold | +10–18 KB | ~34 KB |

**SIZE VALVE flag:** Stage 6 (panel) + Stage 7 are the heavy slices; if either exceeds 2× its floor
or the session judges the remainder won't fit cleanly, HALT and propose an S6/S7 → follow-on session
split (per the prompt's size valve). Not bundled to save time.

**Commit mechanism (settled):** slice commits touching served `.js`/`.css` are `--no-verify` (hook
rule #3 wants an sw.js bump on served source; the ONE bump lands in the FINAL commit, hook ARMED).
Zero sw.js touches before that. v3.200 → **v3.201** at the final commit only.

**Fixtures:** FIXTURE-R (130/3/4/16) + FIXTURE-S (3/5/1) both built in the rig harness
(`window.__RIG.build(FR|FS)`); specs recorded above for rebuild.

---

## STAGE-0 STATUS: COMPLETE — HALT for go-ahead to Stage 1.
