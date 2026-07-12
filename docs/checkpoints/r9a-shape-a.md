# R9a — Profile / Galaxy · SHAPE-A locked decisions

> **STATUS: FINAL — SHAPE-B v5 felt-pass PASSED (2026-07-12).** This is the complete, canonical
> decision stack for the R9a BUILD: **A1–A8 + AM1–AM52 + the AM44 data-source addendum.** Later
> amendments SUPERSEDE earlier clauses where marked inline (never deleted): A2 switch → AM1;
> Fork-4 side-stage → AM3; AM9 order → AM18/AM33/AM51; AM16 grid → AM41/AM42; AM27 Published-in-
> rail → AM41. **The BUILT contract is the v5 mockup `docs/studio/mockups/profile.html`** — see
> `docs/checkpoints/r9a-build-handoff.md` for the memory-blind build handoff.

The signed-off decisions list. This is the SPEC the SHAPE-B mockup is built against
(MOCKUP-FIRST). Resolved with Preston 2026-07-12 via tappable forks, one checkpoint at
a time. Governance: this list + CLAUDE.md canon > the two Universal mockups > everything.

---

## AMENDMENTS — SHAPE-B felt-pass v1 FAIL on composition (2026-07-12, Preston-directed)

The v1 mockup's fencing ruling (A2), the why-line evidence register, and gaps-as-questions
LANDED and survive. The **layout failed** the felt pass. Three supervised rounds of design
questions produced the amendments below. **They SUPERSEDE A2's two-pane switch and the Fork-4
side-stage; everything not named here stands as locked.** Findings driving the amendment:
desktop failed D1's own ≥60% occupancy (right rail died after the galaxy; dead gutters returned
below the fold); the signature artifact rendered thumbnail-size (desktop) / behind a tab
(mobile); sky hierarchy inverted (planets uniform blobs, stars barely read, a 4-line legend
doing the encoding's job); "STRONG LOAD / IN PROGRESS / EMERGING" printed task-status vocabulary
onto an evidence design; and two locked items were silently dropped — counts (A4) and the full
public Numbers view (evolution-spec lock).

- **AM1 — ONE SPINE, GALAXY HERO FOR EVERYONE (supersedes A2's switch).** The segmented switch
  is DELETED. Owner and visitor BOTH open on the sky: owner = full sky (dashed "only you can see
  this" rings stay) + instrument content beneath; visitor = fenced published-only sky + portrait
  content. Owner gets a small **"preview as visitor"** link (the existing preview state + return
  link carry over unchanged). The "The instrument / Your portrait" vocabulary dies with the
  switch; remaining labels are plain nouns.
- **AM2 — R9a INTERACTIVITY.** Tap star → the existing sub-theory route; tap planet → shelf
  filtered to that category. In-galaxy selection panels / nested exploration = **R9b**.
- **AM3 — COMPOSITION (supersedes Fork-4 side-stage).** Desktop ≥1200 = **full-width hero band,
  height-capped ~60vh**, values/projects in **composed columns beneath** (≤72ch prose); the
  occupancy check must **PASS**. Mobile 390 = same spine, hero scaled, **no tab**.
- **AM4 — GROUND FINAL: warm `--br-deep`.** Retire `.galaxy-night` from build scope (mockup
  artifact only; **no night ground ships**).
- **AM5 — SKY HIERARCHY: stars lead.** Sub-theories = bright GOLD glints, the page's
  protagonists. Planets recede to soft tinted fields **SIZED BY BOOKS READ** (sizes must visibly
  differ — Critical Pedagogy dominates the sky). Book-field denser but dim. Constellation lines
  draw on tap. Labels in the DISPLAY face, sentence case — no all-caps mono inside the art.
  Legend DELETED → a one-line tap hint; the sky self-explains. Sparse categories carry an
  invitation line in the sky itself.
- **AM6 — VALUE CARDS: single column.** Load expressed TYPOGRAPHICALLY (name scale / ink
  density) — **NO printed load labels**. Why-line quotes at full measure. "Drawn on by N
  sub-theories" as a plain line. Sub-theory chips restyled as unambiguous links (D4).
- **AM7 — COUNTS (rescues the A4 dropped lock).** A thin clickable mono caption at the hero's
  lower edge — "129 books · 11 sub-theories · 3 published" → shelf / arcs / published. The full
  public **Numbers view is PINNED to R9b** (lives in the deferred in-galaxy panel) — record in
  the close-out ledger as a rescued dropped lock.
- **AM8 — VALUES STATEMENT.** Keep the header one-liner AND add a 2–3 sentence prose statement
  block (his voice) as the FIRST content under the hero, editable in settings. **⚠ DATA-PLAN
  CHECKPOINT:** this implies ONE new persisted `profile` text field — it touches the display-only
  guardrail. Mockup renders placeholder text flagged as his-to-write; **before BUILD, present the
  data plan (`ensureProfileFields` + BOTH merge paths + migration bump) as an explicit
  checkpoint — do NOT silently carry a persisted field.**
- **AM9 — BELOW-HERO ORDER:** values → open questions → Now → published work → settings.
  Settings drops to a visibly QUIETER dense register (small type, plain inputs, hairline
  separator) — the page must not end at lyric scale on form inputs.
  *(⚠ ORDER SUPERSEDED by AM18 → AM33 → AM51 — final order: Statement → Values → Numbers →
  Questions → Now → Published → Settings. The QUIETER settings register STANDS.)*

---

## AMENDMENTS v2 — SHAPE-B felt-pass v2 PARTIAL (2026-07-12, Preston-directed)

v2's **hero sky PASSED** (star-led hierarchy, sized planets, sparse invitation — all KEPT). The
**page below the hero FAILED**: containment collapsed to a flat document, color-starved,
load-as-type ambiguous alone, mobile sky clipping labels at both edges, and TWO locked items
still missing (the tappable values strip; the Numbers view). AM10–AM23 **extend AM1–AM9; where
they conflict (AM9's order), the NEW lock wins.** Everything from v2 not named here survives
(sky hierarchy, fencing/preview, settings register, the AM8 statement checkpoint).

- **AM10 — CONTAINMENT.** Full grouped-card system below the hero. Every section (statement,
  values, numbers, questions, Now, published, settings) sits in a contained surface card (radius
  token, consistent insets, subtle surface differentiation), headers OUTSIDE the groups. No
  floating text on bare paper.
- **AM11 — BY THE NUMBERS lands in R9a (REVERSES the Q7-B call — record in close-out as a
  deliberate reversal, Numbers pulled forward from R9b).** Overview stat row: books · marginalia
  · passages · sub-theories · published. Plus per-category cards: field hue, book count,
  marginalia count, mini-bar. All client-side, display-only. **COVENANT LINE:** these describe
  READING; value load is never numbered or ranked — the evidence-weighted rule stands.
- **AM12 — VALUES STRIP (rescues the 2nd dropped lock).** Tappable value row docked at the hero's
  lower edge; tap a value → lights its constellation in the sky. Value CARDS lead the content
  below the statement, single column; open questions move BELOW values.
- **AM13 — COLOR RULE.** `--field-*` hues code CATEGORIES everywhere they appear (stat cards,
  category links in value cards / questions / published, planet halos). Values stay gold family;
  prose stays ink. Color = meaning, one rule. No invented hexes.
- **AM14 — LOAD CUE.** Orb size + fill depth paired with name scale. Strong = larger fuller gold
  orb; emerging = small faint ring. Still zero printed load labels (AM6 stands).
- **AM15 — HERO CONTRACT.** ~60vh cap ENFORCED at ≥1200. Identity on the sky top-left; values
  strip + clickable counts caption docked at the hero's base. First screen = sky + identity +
  values + caption, no scroll.
- **AM16 — PUBLISHED WORK.** 2-up cards on desktop — display-face title, one-line excerpt,
  category in its field hue, date. The PUBLISHED pill is DELETED.
  *(⚠ GRID PLACEMENT SUPERSEDED by AM41/AM42 — Published is a full-width closing band, 3-up
  desktop / 1-up mobile, with the AM42 anatomy. The pill-deleted + display-face-title decisions
  STAND.)*
- **AM17 — MOBILE SKY.** Retuned at 390, NOT scaled. Taller aspect; label only the top ~5 planets
  by size; collision-aware label placement with edge padding (kills the clipping CLASS);
  invitation docked, not floated; values strip horizontally scrollable; P1–P9 re-verified.
- **AM18 — PAGE ORDER (amends AM9's order; its settings register stands):** Statement → Values →
  By the numbers → Open questions → Now → Published → Settings.
- **AM19 — YUMI OFFERS.** Offer/confirm/rename/reject cards dock at the TOP of the Values section,
  owner-only. Accepted value graduates into a card in place.
- **AM20 — SPARSE STATES.** Every new section carries an invitation line in the sky's register
  when thin ("your numbers will gather here as you read"). A 3-book library must look honest.
- **AM21 — OWNER/VISITOR MATRIX (explicit).** Visitor sees Statement · Values (accepted stones
  only, NO offers) · Numbers (public full set) · Published · fenced sky. Owner-only: Open
  questions · Now · Settings · Yumi offers · full sky. Preview-as-visitor = exactly the visitor
  column.
- **AM22 — CATEGORY→HUE MAPPING.** Deterministic + stable (slug-order; hues repeat past 10; 17
  live categories). Same category = same hue on every render and surface. In the sky, no two
  adjacent planets share a hue.
- **AM23 — INTERACTION A11Y.** Stars, planets, strip chips are real focusable controls; D6
  focus-visible passes at 1440; constellation draw respects the reduced-motion rig; tap targets
  meet P3 at 390.
- **STAGING NOTE (for BUILD).** With AM11 aboard, R9a's build exceeds the shape the master
  sequence locked. At BUILD stage, re-estimate; if the plan exceeds the five-beat budget, HALT
  and present a split fork — the pressure valve = AM11's fallback seam (overview row ships R9a,
  per-category cards → R9b). Do not silently absorb the growth.

---

## AMENDMENTS v3 — SHAPE-B felt-pass v3 STRONG PARTIAL (2026-07-12, Preston-directed)

v3 kept: sky, strip, load orbs, color arrival, honesty touches (retired-value note, sparse
invitations). Two problem classes remained — QUALITY (no elevation; three competing hue grammars;
washed contrast; numeral illegibility) and ORGANIZATION (locked order scrambled by column pairing;
thesis half-width with scaffolding copy inside). **⚠ NAMED VERIFICATION FAILURE:** the v3 report
claimed AM17 (collision-aware labels, class killed); the 390 render still overlapped "Philosophy
of Mind" / "Political Philosophy" — the executor measured only edge overflow, not label-label
intersection. **AM17 now passes ONLY with measured proof (AM38): sample every 390 sky-label rect,
assert zero intersections + zero overflow, print the measurements. A claim without measurement =
FAIL.** AM24–AM40 extend the stack; where AM10 conflicts (the thesis), **AM29 wins by name.**
Everything from v3 not named survives (AM40).

- **AM24 — ELEVATION GRAMMAR.** Three levels — page ground / card surface (`--surface`) / inset
  (`--surface-2`) — soft WARM shadows (never gray-black), radius token consistent. Cards drop
  heavy outlines, sit on surface + shadow; hairline borders only where separation needs help.
- **AM25 — ONE HUE ANATOMY.** Neutral card surfaces everywhere. Category hue appears ONLY as:
  left-edge rail · dot · data text/numerals · bar fill. Identical anatomy on Numbers cards,
  Published cards, category links. Full-outline + top-border treatments DELETED.
- **AM26 — DEEP RAMP.** Add `--field-*-deep` companions (`--gold`/`--gold-deep` precedent). Deep
  ramp = text/rails/dots/borders on light surfaces, **AA-checked per hue**. Bright ramp = sky /
  orbs / bar fills only. AM22's deterministic mapping carries BOTH ramps.
- **AM27 — DESKTOP COMPOSITION (≥1200).** Statement full-width, then the MEANING SPLIT — main
  column = Values → Open questions → Now (the voice); right rail = By the numbers → Published
  (the public record). Reading order preserved within each column. Rail + sky = the visitor's
  content.
  *(⚠ "Published-in-rail" SUPERSEDED by AM41 — the rail is Numbers-ONLY; Published re-homes to a
  full-width closing band. The MEANING SPLIT itself (voice column / record rail) + statement-
  full-width STAND.)*
- **AM28 — GILDED SEAM.** Sky→paper edge = the canon's 1px gilded hairline (inset, fading ends).
  Strip docks just above it. Hard edge otherwise; NO gradient band.
- **AM29 — THE THESIS UNCARDED (names the AM10 exception).** The values statement renders
  full-measure, uncontained, between hero and the card system — the ONE sanctioned containment
  exception. All mockup scaffolding copy deleted from UI text. Owner gets a quiet edit
  affordance; AM8's data checkpoint stands.
- **AM30 — DATA TYPOGRAPHY.** Every data numeral (stat row, category counts, caption) = DM Mono
  lining figures (fixes 11→II, tabular alignment). Cormorant keeps names, headers, prose.
- **AM31 — BAR SEMANTICS.** Bar = share of library (category books ÷ total), uniform scale on
  every card, bright-hue fill on a subtle track, ONE caption at the section header ("bars show
  share of your library").
- **AM32 — POLISH BATCH.** (1) unselected strip chips = visible ring + lighter label on dark; (2)
  native scrollbars hidden / custom-thin on the mobile strip; (3) category grid auto-fits (no
  orphan cards); (4) headers-outside-cards audited page-wide; (5) scaffolding-copy sweep; (6)
  Yumi offer card restyled to the elevation grammar; (7) retired-value note KEPT verbatim; (8)
  hero-base caption + tap hint get hierarchy (hint quiet, counts separated + clickable, no
  cramped mono stack).
- **AM33 — MOBILE STACKING ORDER.** At 390 the meaning split does NOT stack column-wise; sections
  interleave per the locked reading order: Statement → Values → Numbers → Questions → Now →
  Published → Settings. The split is a ≥1200 composition, not a content order.
- **AM34 — VISITOR RENDER, REQUIRED.** v4 renders the visitor view as its OWN artifact at BOTH
  viewports (390 + 1280) — fenced sky, statement, accepted values only (no offers), Numbers,
  Published. Its balance gets Preston's eyes before BUILD.
- **AM35 — SETTINGS PLACEMENT.** Full-width below the end of both columns, quiet register (AM9).
  Not a column member.
- **AM36 — DOM ORDER = READING ORDER.** Visual columns must NOT reorder the DOM;
  keyboard/screen-reader traversal follows AM33's sequence at every viewport; CSS places the rail.
- **AM37 — STRIP BEHAVIOR.** Tap lights that value's constellation; same tap un-lights; tapping
  another switches the lit set. ONE value lit at a time; state visible on the chip.
- **AM38 — AM17 ENFORCEMENT.** Measured label rects at 390; zero-intersection + zero-overflow
  assertions printed in the report.
- **AM39 — (BUILD-stage forward note, no mockup action).** Sky implementation budget: target a
  single SVG render, no per-frame JS after the draw-in, reduced-motion path per canon. Flag at
  BUILD staging alongside the AM11 pressure valve.
- **AM40 — Everything else from v3 not named here survives unchanged** (sky hierarchy, strip
  mechanics, load orbs, fencing matrix, hero contract, settings register, AM8 checkpoint, AM11
  staging note).

---

## AMENDMENTS v4 — SHAPE-B felt-pass v4 STRONG PARTIAL (2026-07-12, Preston-directed)

v4 kept: elevation, hue anatomy, deep ramp, DM Mono numerals, meaning split, uncarded thesis,
strip rings, visitor render. Three issues: (a) **Published broken by our own spec collision** —
AM16 (2-up) × AM27 (rail placement) = cramped cards, mismatched heights, "Philosophy of MindMay
2026" spacing collision, an orphan, dead rail whitespace; (b) **the LENS AXIS was lost in the
merge** (shipped account galaxy has a categories|lenses toggle; merged page had zero lens
presence); (c) **NEW COLLISION INSTANCE** — the invitation line runs through a star near Critical
Pedagogy at 1280 (same class as AM17/AM38, new member). AM41–AM52 extend the stack.

- **AM41 — PUBLISHED RE-HOME (supersedes AM16 grid + AM27 Published-in-rail).** Full-width closing
  band BELOW the two-column zone. 3-up at ≥1200, 1-up at 390. The rail becomes **Numbers-only**
  (rail whitespace gap dies). Published stays fully visitor-visible — the visitor matrix is a
  CONTENT rule, not a geometry rule.
- **AM42 — PUBLISHED ANATOMY.** Display title, one-line excerpt, LINEAGE line ("from the arc
  [X]"), category dot + deep-hue text, date with real spacing (collision bug dies), equal-height
  cells. BUILD note: lineage falls back gracefully (omit the line, never "from the arc undefined").
- **AM43 — PUBLISHED BEHAVIOR.** Newest first; cap 6; when more exist, a quiet "all published
  work →" to the **ARCS PAGE** (named destination, never a dead link). Sparse → invitation line
  (voice per AM50).
- **AM44 — LENS AXIS RESTORED.** Segmented `[ Categories ‹› Lenses ]` toggle on the Numbers
  header; stat cards regroup in place (per-lens: books · marginalia · bar). Overview row
  unchanged. Sky stays category-planets; **SKY-LEVEL lens regrouping is PINNED TO R9b** with the
  in-galaxy panel (recorded by name so it cannot drop again).
  - **AM44 addendum — DATA SOURCE PINNED (2026-07-12, build constraint; mockup lens data is
    illustrative only).** The lens grouping aggregates the **EXISTING shelf lens collection** and
    its book associations — `state.userThemes[id] = {id, userId, name, bookIds:[]}`
    (state.js:2124), the SAME objects the shelf's Lenses grouping reads (`userThemeList` from
    `state.userThemes` where `userId===uid`, `.bookIds`; views.js:4605-4609, orphan-safe) and
    Yumi's `gatherLensLibraryMetadata` / `generateLenses` consume (yumi-brain.js:882/976).
    **No new lens list, no parallel store.** Display-only derivation: books/lens =
    `theme.bookIds.length` (owned-filtered); marginalia/lens = notebook entries whose bookIds ∩
    `theme.bookIds` (existing associations); bar = lens-books ÷ total. **If the aggregation seems
    to need a new store/association, that is a HALT fork — not a silent addition.**
- **AM45 — LENS TREATMENT.** Lenses do NOT take field hues (color=category law unbroken). Lens
  cards = one gold-family anatomy (gold-deep rail, dot, text). Bars stay (share of library, same
  scale) with the honest caption "a book can hold several lenses — shares overlap." Sparse lens
  state exists. Toggle = real control (D6 focus, P3).
- **AM46 — LENS VISIBILITY: OWNER-ONLY.** Visitors see Numbers in categories view with NO toggle.
  Lenses = unconsented interpretive constructs; private-by-default. Added to the AM21 matrix.
- **AM47 — COLLISION ENGINE WIDENED.** Covers ALL sky text — labels, invitation, anything future.
  The invitation docks in the EMPTIEST QUADRANT (it marks sparseness; it lives in the sparse
  region). PROOF: measured rects, zero-intersection AND zero-overflow, at BOTH 390 AND 1280,
  printed. Claims without measurements = FAIL.
- **AM48 — CHIP OVERFLOW AT EVERY WIDTH.** Edge fade + scroll affordance whenever chips exceed the
  row, at any viewport. No chip clips mid-word.
- **AM49 — IDENTITY RESTORATIONS (two silent drops — restore, don't debate).** (1) the byline
  "Publishing as Preston A." returns to the identity block, both modes. (2) the AVATAR returns to
  the hero with the canon's offset gold ring.
- **AM50 — FENCING COMPLETIONS (extend the AM21 matrix).** (1) visitor value cards show PUBLISHED
  sub-theory links only (no drafts); "drawn on by N" reflects only visible links; a stone with
  zero published subs still stands on its why-lines. (2) retired-value note OWNER-ONLY. (3) the
  values STRIP renders for visitors (values are public) and tap-to-light works against the fenced
  sky (lights published stars only). (4) Now + Open Questions carry a quiet "only you can see
  this" whisper in the dashed-ring register. (5) sparse lines get voice variants: owner-voice
  where owner-only, third-person where public ("what they publish will stand here" vs "what
  you publish…").
- **AM51 — DOM ORDER for the re-home.** Statement → Values → Numbers → Questions → Now → Published
  → Settings at every viewport; CSS places the rail; traversal follows the sequence.
- **AM52 — VISITOR RENDER RE-VERIFIED** at both viewports: categories-only Numbers (no toggle),
  the new Published band, fenced value cards per AM50, strip present + functional. AM40's survival
  clause carries.
- **LEDGER NOTE (close-out, no mockup action):** the R10 RETIRE-LENSES question gains a dependency
  — the profile now hosts a lens surface, so that debate inherits one more consumer. Record so R10
  argues with full information.

---

## Locked decisions (A1–A8)

**A1 · Merge → one Profile, canonical at `#profile`.** `#account` →
`location.replace('#profile')` (the R7 marks-route precedent, views.js:521 — no history
push, refresh-stable). The nav avatar link (index.html:39) is repointed `#account`→`#profile`
so the primary path lands directly; the `#account` redirect is the bookmark/old-link safety
net. `activeRoute` keeps the avatar lit (already lumps account|profile → 'account'; update as
needed). `#reader/<uid>` stays the separate visitor route (renderOtherProfile). The instrument
DNA (offer/confirm/rename/reject, gaps-as-questions), the settings + "Your data" cluster, and
sign-out are all CARRIED into the merged page — never lost.

**A2 · Organizing principle = ONE segmented switch `[ The instrument · Your portrait ]`.**
*(⚠ SUPERSEDED by AM1 — the switch is deleted; galaxy-hero-for-everyone. The A2 fencing RULING
below — owner full sky + marked-unpublished + "preview as visitor" — SURVIVES and carries into AM1.)*
The owner defaults to the **instrument** pane. ONE tap flips to the **portrait** pane (galaxy
leading, values statement, own work). The single control is BOTH the "galaxy one tap away" AND
the owner↔visitor mode switch. Build the switch, fence the entry.

**RULING — owner's private stars (2026-07-12, Preston-directed).** The owner's portrait pane is
**NOT literally the visitor view.** It renders the owner's **FULL sky** — ALL sub-theories as
stars, **published AND unpublished** — with unpublished stars **visually marked** ("only you can
see this", the Now-strip privacy precedent: a dimmed/haloed treatment + a private glyph). The
owner never loses their own unpublished thinking from their own galaxy. **Visitor-preview honesty
is preserved** by a quiet **"See it as a visitor →"** affordance INSIDE the portrait pane that
recomputes the sky **published-only** (drops unpublished stars + owner-only chrome), showing
exactly what a visitor at `#reader/<uid>` would see — **preview only, zero social hooks** (the
fenced door; follow / build-on / walk are R11 / Lane-2). **OQ-B honored:** the ACTUAL visitor
render (`#reader/<uid>`, renderOtherProfile) stays published-only — a separate route,
unchanged/fenced. Two galaxy renders gated by whose eyes; value-load + the faint book star-field
recompute per view (owner = full; visitor-preview = published-only). The mockup bakes: full sky +
marked-unpublished + the "See it as a visitor" toggle.

**A3 · Galaxy ontology — re-authored (not re-skinned).**
- **Bright glinting stars = SUB-THEORIES** (tap → sub-theory page).
- **Faint star-field = books read** (the ground).
- **Planets = CATEGORIES** — the 17-label LIVE classification (`book.category` /
  `categoryOverride`), size = books read in that category. **This retires the galaxy's own
  tradition placeholder** (views.js:15838 comment: the "categories" axis grouped by tradition
  as a placeholder "a future Categories build will replace — NOT swapped"; R9 IS that build).
  Tradition is out — it was retired from the shelf in reading-model v2.
- **Constellation** hub-radiates from the strongest category, n−1 lines, draw-in on select —
  honoring `prefers-reduced-motion` (reuse the `reduceMotion` matchMedia rig, views.js:18701)
  and the no-transform-rig rail.
- **Star→planet linkage (SHAPE-B mechanic, display-only):** a sub-theory carries no category
  today (Thread-4 negative finding) — its field is DERIVED at render from the dominant category
  among its evidence books (or its arc's books). No data-model change. *(Constellation topology
  finalized in SHAPE-B; flagged if it becomes a real fork.)*
- **TAP-FIRST:** no hover-only interactions (mobile P3 44px; desktop D4 hover = enrichment).

**A4 · Value-load = EVIDENCE-WEIGHTED, never tallies.** A value's load = marks carrying a
why-line + sub-theories drawing on the value (weighted) — **no raw count renders anywhere** (a
tally is a streak mechanic; the instrument pivot rejected it). New display-only
`_profileValueLoad(uid)` built ONCE per render (the `_buildArcSubsIndex` idiom, views.js:3451),
zero mutation, over EXISTING `valueMarks` + `profile.values`. **SPARSE-HONEST:** the sparse
state is first-class with an invitation line — never fake density (Preston's real library is
sparse). Handle the orphaned-slug case (a `valueMark.value` no longer in `profile.values`).

**A5 · Desktop D1 — the project's FIRST ≥1200 composition tier.**
*(⚠ Fork-4 side-stage SUPERSEDED by AM3 — desktop = full-width galaxy HERO band ~60vh + composed
columns beneath; occupancy must PASS. The D1/D2/D3/D4/D6 gates + the D0-rig verification stand.)*
At `min-width:1200px` the
INSTRUMENT pane composes TWO columns: value-load + gaps-as-questions + Now strip as the main
column (**prose ≤72ch**, D2) + the **GALAXY as a persistent side stage** (the width-earner). At
mobile (<1200) the A2 switch tabs the panes. New `@media (min-width:1200px)` blocks in
components.css AFTER base rules (source order wins); the 759/760 tier is byte-untouched.
Verify on the **D0 rig** (local :8760 static-server, SW-clear + cache-bust, `praxis_user` auth
stub, in-memory fixture, direct `renderRoute()`) at **1280×800 / 1440×900 / 1920×1080**: D3 no
h-scroll, D4/D6 hover + focus-visible, D5 display-only scale (body stays 16px). The Profile's
Builder desktop chip upgrades **stretched → native** only via this measured evidence at close.

**A6 · Settings + "Your data" covenant = LAST, in the instrument pane.** Owner-only; never in
the portrait/visitor pane. The page reads instrument (the work) → then quiet housekeeping, with
the covenant CLOSING the page as it already does (renderAccountPage keeps it LAST). Identity
edit, Yumi prefs, sign-out live here too.

**A7 · Galaxy ground = warm `--br-deep` (recommended; felt-deferred).** Keep the live
token-composed deep-space well (`--br-deep`/`--sunk-d`/`--scrim`, components.css:7416) —
conforms to the §7 ground spectrum (light → warm-dim → deep-warm field → amber). If still
contested at SHAPE-B, render **BOTH** grounds (warm `--br-deep` vs the mockup's blue-black
`.galaxy-night`) for Preston's felt call. *(Per Preston's SHAPE-A instruction.)*

**A8 · `.op-conseq` re-home rides this round.** `loadOwnProfileSocial`'s patch of `cNum`
(build-on `<b>`) + `walkB1` (readers `<b>`) at views.js:16871-16872 is re-homed. PA3: render an
HONEST empty state for zero value-load (no reads-as-broken em-dash), and rewrite the stale
"…appears here once Praxis opens to other readers" sub-copy to match live behavior. The social
counters' real home is R11.

---

## Rails carried (no-go, restated)
- **Display-only / in-guardrail:** R9a is aggregation + presentation over EXISTING data
  (`valueMarks`, `profile.values`, `book.category`). **NO data-model change, NO migration bump**
  (1.29.0 stands). If any mechanic (e.g. star→planet linkage) forces a new persisted field →
  **HALT fork**, not a silent carry.
- Strict ES3 in views.js (var/function, string concat, two-arg `.then`, for-loops). Tokens-only
  Universal v1.2; **no `--lum-*` in NEW CSS**; no `--register-*`/`--subtheory-*` concat families;
  no setProperty seams; no transform-rig tokens. Byte-locked foundations untouched.
- Labels are Apple-plain nouns (Books · Knowledge arcs · Sub-theories · Fields). Poetry only in
  content. `deleteBook` = canonical scrub for any data removal. `prestona255` READ-ONLY;
  `prestonpraxistest` for behavioral tests. Path-explicit staging, never `-A`.
- **R9b DEFERRED (do NOT build):** arc cards, lineage row, Now-strip richness, destination
  cross-links. (The Now strip in A5 is present but minimal — richness is R9b.)
- Cache bump **v3.197 → v3.198 LAST**, one, at the final commit. COMMIT-NO-PUSH; Preston's exact
  words push (FIX-PROTOCOL §5 Path B).

## SHAPE-B construction notes (mockup decisions, not Preston-forks unless flagged)
- **Starfield:** seed it stable (recommended) so the faint book star-field doesn't reshuffle on
  every re-render (the live 34-`.speck` field uses `Math.random()` per render). Minor.
- **Gaps-as-questions:** reuse the `_portraitFieldTensions` idiom (views.js) — real tension
  questions from live data, rephrased for values/fields.
- **Value-load visual:** how "evidence-weighted" reads WITHOUT a number — resolved in SHAPE-B
  (e.g. weighted glow / evidence chips / why-line surfacing), rendered both viewports.
- **BOTH viewports:** SHAPE-B renders 390 (mobile composition) AND ≥1200 (the D1 composition) —
  two renders, Universal tokens only, in the light/warm register.

---

*SHAPE-A complete. Next: SHAPE-B mockup (both viewports) → HALT for Preston's felt pass.*
