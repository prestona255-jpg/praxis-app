---
surface: arcs
route: "#arcs"
render_fn: renderArcsPage (views.js:3581)
ground: dark
in_nav: yes
state: closed
rounds: 1
mockup: docs/studio/mockups/arcs.html
mobile: native
desktop: composed
---

## State

`#arcs` → `renderArcsPage` (views.js:3458); dark ground; in top-nav (arcs). Arcs teaching page.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade (VC4) — Intersectional arcs through values (the unsolved "Connections"): `profile.values` exists but is never wired into any arc; there is no arc-to-arc or arc×values surface, so calling arcs "intersectional" (P-6) overstates what renders. Prototype how a declared value threads onto the galaxy as a legible cross-arc link before claiming intersectionality (charter §3d). Gap, large · also OQ3.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: open-question] OQ3 — "Intersectional" arcs (P-6 / VC4): Is the values × arc-to-arc connections dimension in launch scope, or is the "intersectional" claim softened in copy until it's built? (The connections visualization is the unsolved design problem the maker is stuck on.)
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: CLOSED v3.189 1da97e3] [sev: FIX] Arcs list (#arcs) FIX now — the card-counts computation as an O(1) map (currently re-derived); navigate to the newly created arc; a shared share-count helper. [fix: R5 S1 — module `_arcSubsIndex` built ONCE per renderArcsPage (`_buildArcSubsIndex`) and read by `_arcSubsOf` (O(1) per-card, replacing the per-card full scans); the shared `_arcSubCount` helper is the single count path (`_arcCardCounts` delegates to it); `openArcEditor` onSave now navigates to the new arc (`location.hash = 'arc/' + arc.id`). js/views.js.]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: CLOSED v3.189 a4ad4d2] [sev: Rebuild-requirement] Arcs list (#arcs) Rebuild requirement — auto-fit grid, equal tiles, and a unified card class. [fix: R5 S2 D1 — `.arcs.lum-amber-deep .arcs-grid` = `repeat(auto-fit,minmax(240px,1fr))` + `grid-auto-rows:1fr` equal-height tiles + the unified solid `.arc-card` (the prior glass + backdrop-blur skin dropped), under the Universal-light Option-B skin (route map untouched). assets/components.css.]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: PARTIAL v3.189 8a17a0c] [sev: Hygiene] Arcs list (#arcs) Hygiene → sweep — dead arcs CSS, an orphaned row renderer, stray cover-thumbnail rules. [fix: R5 S6 — the dead `.arcs.lum-amber` arcs-list dark-skin block REMOVED (grep-proven zero JS callers: 'arcs lum-amber' non-deep = comment-only). Residual dead classes LISTED with grep-proof, DEFERRED to the S-C sweep (scattered/interleaved with live rules → a bulk deletion at the tail was avoided): `.st-register-toggle` (S4), the S3-replaced `.arcfield-read-head/-threads/.arcfield-thread-row/.arcfield-read-subs/.arcfield-read-sub*`, and `.itx-sub`/`.itx-sub-*`.]

## Round history

- **R-ARC (DEEP round) — IN CLOSE-OUT PREP (2026-07-17), felt pass PENDING.** This surface's arc-lifecycle
  domain took: the **ember** — arc lifecycle + rename + graduation (S3 `36dc570`) and its reverse gear,
  **un-graduate** (S3R `c681d35`). **FF-7 note:** the arc-aggregate maturity ramp `_arcMaturityWord`
  (`forming/warming/mature/bright`) was **held OUT** of the FF-7 rider as part of the **FORMING-REACH**
  residual — it reads a different (aggregate) score than the per-sub ramp FF-7 unified, so a word swap there
  needs its own ruling. Full per-surface census re-measure carried to the round CLOSE. Authoritative ledger +
  SHAs: `docs/studio/r-arc.md` Round history; checkpoints `docs/checkpoints/r-arc-*.md`.
### MW-2 mobile pass — SHIPPED-LOCAL (2026-07-11, commit 900aa4f; chip → mobile: native)

Arcs LIST half of the MW-2 mobile wave (arc-detail interior tracked in `arc-detail.md`).
**Chip: `mobile: native`** — `docs/studio/reports/mw2-2026-07-11.md`.
- **P8 PASS already (no change):** list @390 scrollWidth 390, grid 1-col
  (`.arcs.lum-amber-deep .arcs-grid{1fr}`), cards 293–300px (whole card = tap target, ≫44px).
- **P3 PASS already:** the arc cards are the tap targets (huge). **P5 n/a** (short list, no
  sticky-title need). **P1/P2/P4/P6/P7/P9 n/a** for the list.
- No list change was needed; the substantive P3 work lands in the arc interior — see
  `arc-detail.md`. CSS-only (arc-detail), desktop byte-unchanged. praxis-reviewer CLEARED.

### R5 CLOSED — felt pass PASSED IN FULL (2026-07-10, deployed v3.189, commit 27b4878)

Preston's felt pass passed in full on the live deploy: all the grounds (light arcs list ·
warm-dim arc interior · cognac field stage), the register-collapse fold, the publish→walk
mark round-trip, and the mark picker all read true. R5 covered BOTH `#arcs` (list) and
`#arc/<id>` (interior) per the round's locked scope. Route STAYS in `umberGroundDark`; the
skins are scoped Option-B overrides (the R2/R3/R4 mechanism — no map-flip). Round closed.

Build = 7 commits `f4be5c2 → 27b4878` (mockup `f4be5c2`, 86,010 B). Six stage gates, all PASS
(records: `docs/checkpoints/r5-*.md`; §9 red-team clean):

- **S1 fix slate** (`1da97e3`) — arc-voice `.then` rejection handling; **F-MA1** seed-mutation
  guard (`_subSeedLocked` on setSubTheoryPosition/link/unlink, verified safe vs the delete-cascade);
  arcs O(1) `_arcSubsIndex` + shared `_arcSubCount`; navigate-to-new-arc; D5 self-evident
  Tidy/Restore/Reset helper + `.arc-reset-btn`.
- **S2 grounds + D4** (`a4ad4d2`) — arcs list → Universal light (`.arcs.lum-amber-deep`, D1
  auto-fit equal-height grid, solid cards); arc interior → warm-dim (chrome re-point scoped so
  the field stage keeps its dark renderer); field stage → deep cognac + softened feathered
  vignette; **D4/AF6** = ONE canonical `.arcfield-addsub-canon` in the head (3 sites consolidated).
- **S3 read spine** (`f6563bc`) — shared deterministic `_arcReadSpine` (one renderer, two lenses);
  author `_arcFieldReadFace` rebuilt (mark · title · maturity glow · first line · connections ·
  gutter threads · `.read-private` on drafts · closing); visitor `renderInteract` uses the SAME
  spine + a threshold cue, **W6.5 social layer PRESERVED** (per-sub `.itx-thread` anchoring intact).
- **S4 register collapse** (`12e5f96`, DATA-ADJACENT) — the Public|Intellectual toggle + dual-body
  model removed (single body = `bodyPublic`); the **idempotent, flag-guarded migration** folds a
  former `bodyIntellectual` into `bodyPublic` under a `---` divider in `ensureSubTheoryFields` (runs
  on both the localStorage load AND the Firestore merge), NEVER deleting the dormant field;
  idempotency proven on 4 fixtures; maturity + search repointed off the duplicate.
- **S5 publication + mark identity** (`317fa0e`, payload data-adjacent) — `buildPublishedArcDoc`
  carries each sub's resolved markShape/markColor so the walk shows the SAME marks as the author
  (walk mark-identity bug FIXED); D3 quiet head publish/unpublish + staleness (`arc.publishedAtLocal`);
  D2 quiet "in the commons" card chip. Covenant: no walk-count badge on head/cards.
- **S6 mark language** (`8a17a0c`) — the committed 16-name set (spark/vessel/grove/ember/horizon/
  lodestar/cairn/harbor replace compass/river/chamber/kite/dune/gate); the EXISTING `openSymbolPicker`
  surfaced via a `.read-change-mark` Read-row trigger; D6 mark names in the tooltip + focus rings on
  the Read controls; the dead `.arcs.lum-amber` block cut.

**Forks decided (Preston):** D4/AF6 → folded into S2 (one head canon); `#walk` → PRESERVE W6.5
(spine as the read display, build-on anchoring kept).

**Rulings recorded:** the **GROUND SPECTRUM** is canonized (CLAUDE.md §7) — light list → warm-dim
interior → deep-warm field stage → full-amber visitor room; the **field-stage carve-out is PART OF
the spectrum, not an exception** (the mockup's `PROPOSED:` note resolves to this); the mockup's 3-way
Read-ground toggle was a felt instrument only — **warm-dim shipped fixed** as the Read default.

**New findings recorded this round:**
- **Walk mark-identity bug** — the walk hashed a synthetic `arcId:index` instead of the sub's real
  mark. FIXED (`317fa0e`); **old published snapshots show hash marks until republished** — a
  one-time user-action item (republish corrects them).
- Stale comment `views.js:3513` ("no published flag") — the `arc.published`/`freshness`/`walkedBy`
  fields are REAL; comment is drift (logged, not chased — line drifts).
- Stale comment (the removed register toggle) — updated in S4.
- Sibling seed-render mark construct `~views.js:16970` (`{id: seedKey + ':' + i}`) — a DIFFERENT
  seed-render fn, OUTSIDE R5's `renderInteract` scope. Logged (same class of hash-mark, not fixed here).
- Dead-CSS list (`.st-register-toggle`, the S3-replaced `.arcfield-read-*`/`.itx-sub*`) → **S-C sweep**.
- Warm-interior arc-voice inline box on GLOBAL dark tokens (minor; re-pointing globals would break the
  dark-stage renderer) → felt-pass-accepted, S-C.
- **`--ink-3`/`--lum-ink-3` tertiary meta ≈2.3:1 on warm parchment = ACCEPTED carried AA debt**
  (Preston's felt pass; held near its light-ground baseline) → **S-C sweep owns it**.
- Latent constellation focus-ring (frozen renderer emits `data-st-sub-id` but no tabindex — CSS only);
  the REAL keyboard focus rings shipped on the Read-face controls.

## Round record — DW-1 (2026-07-14)

commits: b1058f1 (1, the Arcs slice; DW-1 batch 68f46a9..cache-bump)
gates: PASS — D1 occupancy 71.4% @1920 (col 1360; 95.4/94.9% @1440/1280); D2 `.arcs-teach` 66ch (was 137ch — the named target fixed); D3 hScroll 0; grid widens 4→5 columns; head/grid left-aligned. 760–1199 (1024) unchanged (teach uncapped 119.8ch — cap confirmed ≥1200-scoped); ≤759 (390) unchanged; signed-out empty-state clean, no crash, console clean.
defects-found: 0 in-scope.
lessons: A stale SW/HTTP layer can survive unregister + cache-clear on a localhost origin — restart the static server on a fresh port per edit to guarantee the browser loads the new files.
evidence: docs/checkpoints/dw-1.md (Stage 2) · docs/checkpoints/dw-1-recon.md. Chip stretched → composed.

## Next

## Mockup evaluation

**R5 Arcs Shape-B mockup** — `docs/studio/mockups/arcs.html` (79,044 bytes). Covers
BOTH `#arcs` (list) and `#arc/<id>` (interior) in one file per this round's locked
scope note. `docs/studio/arc-detail.md` was read as input for the interior's own
gap ledger (AF6, §3c, field a11y, the Read-face redesign) and is referenced, never
edited, below.

**Ledger-anchor drift found (recorded, not fixed here):** this file's frontmatter
says `renderArcsPage (views.js:3458)`; the live function is actually at
**views.js:3544**. `arc-detail.md`'s frontmatter says `renderArcDetail
(views.js:12060)`; live is actually at **views.js:12633**. Both are pre-existing
ledger drift (function growth between the census and this round), not something
this mockup round introduces or corrects — Preston's call whether to bump the
frontmatter line numbers at close.

### Current-surface structure (as read from live source)

**#arcs list** (`renderArcsPage`, views.js:3544-3782; CSS components.css:1650-1729):
`.arcs.lum-amber` root (dark Lumen atmosphere) → `.arcs-head` (eyebrow "Constellations"
+ `<h1>Arcs</h1>` + italic serif teaching paragraph) → for a signed-in user, `.arcs-bar`
(Recent/Name/Maturity `.arcs-seg` + "N arcs" count) + `.arcs-grid#arcs-yours` (card
per owned arc via `_arcCardConstellation`/`_arcCardMeta2El`, plus a dashed
`.arc-card-start` "Start another arc" tile) → an unconditional `.arcs-grid#arcs-examples`
(the live "Pedagogy of Desire" seed card + the illustrated-only "Pedagogy of Flow"
card) → for signed-out, `buildSignedOutPrompt`. Grid today is
`grid-template-columns:repeat(auto-fill,minmax(238px,1fr))` (components.css:1728) —
auto-**fill**, not auto-fit; collapses to `1fr` at 759px (components.css:1729 +
the legacy 5527-5530 block). Card anatomy: `.arc-card-thumb.arc-const` (mini
constellation SVG, up to 5 marks + faint thread paths) → `.arc-card-body`
(`.arc-card-title` only, per the Wave 7 C1 ruling that dropped descriptions) →
`.arc-card-meta` (mono: "N sub-theories · `<maturity word>` · touched `<when>`",
all real/derived, no published state today). Fonts: `--lum-serif` (title),
`--lum-sans` (body), `--lum-mono` (eyebrow/meta) — the dark Lumen set.

**#arc/<id> interior** (`renderArcDetail`, views.js:12633-13165;
`.arcfield.lum-amber` root, CSS components.css:9798-9830 base +
11420-11521 lum-amber skin): `.arcfield-head` (`.t` block: eyebrow "Arc" + italic
serif `<h1 class="arcfield-q">` = `arc.title` + optional `.arcfield-desc` +
computed `.arcfield-sub` "N sub-theories · M books · tended `<when>`") + a
Delete/Hide button + a header "+ Sub-theory" button (shown only when
`arcFace !== 'field'`) + the `.seg.arcfield-faces` tri-tab (Field/Read/Page; List
retired per Wave 1 F-D1). **Field face**: `.arcfield-stage` = a 2-col grid
(`1fr 232px`, no <760px override) of the constellation SVG (`.arc-detail-web-view`,
the protected renderer, `_ST_MARK_TABLE`-driven marks + `linkedSubTheories` edges +
a bottom `.st-control-bar-bottom` of Tidy/Restore, Connect, Reset placements
(gated behind `openArcResetConfirm`), and a Layers popover) + `.arcfield-rail`
(books/notes/+Add-a-sub-theory). **Read face** (`_arcFieldReadFace`,
views.js:13172-13260): today a FLAT list — a "the threads in your field" head, a
`.arcfield-read-threads` block of plain "A ⟷ B" rows, then a `.arcfield-read-subs`
list of sub-theory name + "N threads" — no marks, no maturity, no first-line
prose, no fold. **Page face** (`_arcFieldPageFace`): a real stub — focal
sub-theory's mark + "Write "..."" + a fixed body paragraph + "Open the page →" to
`#subtheory/<id>/build` (writing surface untouched). Fonts/tokens: same dark
`--lum-*` set as the list. Data model already carries `bodyPublic` +
`bodyIntellectual` per sub-theory (views.js:11746-11757 `_stComputeMaturity` reads
both), `status: 'draft'|'published'` (views.js:9805/9818-9819), and — **contrary to
the prompt's Stage-0 note** — a REAL `arc.published` / `arc.freshness` /
`publishedArcs/{arcId}.walkedBy` model (see Data-source findings below).

### Decision table (D0-D11)

| # | Decision | Status | Live DOM anchor / mockup anchor |
|---|---|---|---|
| D0 | Mockup review chrome — skin toggle (Universal Light ⇄ amber-chrome compare) + 4-state switcher (a-d) | **new** (mockup-only tooling, not a live-surface change) | mockup: `.mock-toolbar`, `setSkin()`/`setMockState()` |
| D1 | Arcs-grid rebuild — auto-**fit** (not auto-fill) + `grid-auto-rows:1fr` equal-height tiles, one unified `.arc-card` class | **partial→new** — live already ships auto-fill (components.css:1728), a unified-ish `.arc-card` base; this promotes to auto-fit + explicit equal-height, the residual half of the "Rebuild requirement" gap row | live: components.css:1728 `.arcs.lum-amber .arcs-grid`; mockup: `.arcs-grid` rule (auto-fit + grid-auto-rows) |
| D2 | "In the commons" quiet chip + walked-by recessed meta on arc cards | **new** | live: none (`.arc-card-meta`, views.js:3425-3436, has no publish state); mockup: `.arc-chip-commons` in card1/card2 |
| D3 | Publication state line + quiet Publish/Unpublish affordance IN THE arc-detail HEAD | **new** (the affordance exists live today, but only on the OWN-PROFILE page, not the arc's own head) | live: `_opPublishControl`, views.js:17056-17082 (profile-only); mockup: `.arcfield-pub` in Scene A + B head |
| D4 | AF6 resolution — ONE canonical +Sub-theory control-bar-style button; header + Page-face duplicates removed | **new** (resolves a named live redundancy) | live: header instance views.js:12774-12783, dead control-bar instance views.js:12904-12912 (built, never appended), Page-face empty-state instance views.js:13284-13293; mockup: `.arcfield-addsub-canon` in the head, Scenes A + B |
| D5 | Tidy/Restore/Reset legibility (§3c) — self-evident helper copy + Reset visually marked destructive + inline confirm | **partial→new** — live already gates Reset behind a confirm PANEL (`openArcResetConfirm`); this adds the helper copy + the visible danger styling + an inline (non-modal) confirm variant for the mockup | live: `resetBtn`, views.js:12943-12958; mockup: `.arc-reset-btn`, `.arcfield-tidy-help`, `armReset()`/`cancelReset()` |
| D6 | Hover/focus tooltip naming the mark + visible keyboard focus ring on marks | **new** | live: `.arc-tooltip` anatomy exists (components.css:5892-5930) but names only the sub-theory, never the MARK; no documented focus-visible ring on marks (arc-detail.md "Held-Phase-3: tooltips and keyboard focus"); mockup: `.arc-tooltip-mark` line + `.fld-node:focus-visible` |
| D7 | Read face — author-lens spine (mark+title+maturity-glow+first-line+connections rows; threads rendered between joined rows; arc-level closing section) | **new** (replaces the flat `_arcFieldReadFace` list) | live: views.js:13172-13260; mockup: `.arcfield-read` → `.read-list`/`.read-row`/`.read-gutter-svg`, Scene A |
| D8 | Read face — visitor published lens (Read face only), SAME spine, capability-gated to published-only rows + byline + walked-by meta | **new** | live: no commons/walk page reaches this today (R11 territory, contract-only here); mockup: Scene D, filtered to rows n1/n3/n5 |
| D9 | Draft-only sub-theories carry a quiet "private" marker (Published/Private the only visibility axis) | **new** | live: no visibility marker rendered in `_arcFieldReadFace` today; mockup: `.read-private` on rows n2/n4 |
| D10 | Single-register migration OUTCOME — one body, former-Intellectual prose folded under a light divider (no "Public"/"Intellectual" UI anywhere) | **new** (data model unchanged — `bodyPublic`/`bodyIntellectual` both still exist live, per NON-GOALS; this models the RENDER outcome only) | live: `_stComputeMaturity` still reads both fields, views.js:11746-11749; mockup: `.read-fold-body` + `.read-fold-divider` on row n1, `toggleFold()` |
| D11 | Mark picker popover — 4×4 grid of the 16 real silhouettes, named (7 canon + 9 drafted), hue swatches from `--subtheory-1..16`, "Let Praxis choose" marked as the hash default | **new** | live: no picker UI exists (marks are hash-derived only, `stHashIndices`, views.js:821/9032); mockup: `.mark-picker`, `buildMarkPicker()`, triggered from Read-face row n1's "Change mark ▾" |

### Data-source findings (build-time stand-ins, named)

- **`arc.published` / `arc.freshness` / `publishedArcs/{arcId}.walkedBy` — REAL, live-wired, NOT a stand-in.** Stage-0 anchors handed to this round said "arc record has NO published flag (DEFERRED comment @views.js:3513)" — that comment is **stale**. `publishArc`/`unpublishArc` (js/integrations.js:2485-2620) write a real `publishedArcs/{arcId}` Firestore doc (`freshness:'frozen'|'live'`, `walkedBy` a server-incremented counter, `js/integrations.js:3038-3048` on an anonymous walk) and flip local `arc.published`/`arc.freshness` flags consumed today by `_opPublishControl` (views.js:17056-17082, **own-profile-only**). D2's card chip and D3's head line/affordance in this mockup wire directly to these real fields — the only genuinely new *behavior* is surfacing the SAME publish control on the arc's own head (D3) instead of only the profile page. **Live-wiring path for a real build:** call the existing `publishArc(arcId, opts, cb)` / `unpublishArc(arcId, cb)` from a new head-mounted control in `renderArcDetail`, re-entering `renderArcDetail(arcId)` on success (mirrors `_opPublishControl`'s own re-render-on-success pattern) — no new Firestore shape needed.
- **"Snapshot N edits behind" — a genuine BUILD-TIME stand-in.** `freshness` is binary (`'frozen'|'live'`) — there is no live counter of how many edits a frozen snapshot has drifted from the current draft. The mockup shows this ONCE as a clearly labeled static example (`.arcfield-pub-example`, Scene A), not as computed live data. **Live-wiring path:** the cheapest real signal would be an incrementing `arc.editsSinceSnapshot` counter bumped on every sub-theory `saveState` while `freshness==='frozen'`, reset to 0 on republish — a small, additive field, not a data-model rewrite.
- **Per-mark hue / silhouette — REAL, not a stand-in.** `--subtheory-1..16` (theme.css:190-225) and `_ST_MARK_TABLE` (arc-constellation.js:801-818) are exact, live, and copied byte-identical into the mockup (see verify evidence below). No color invention was needed anywhere in this round.
- **The nine DRAFTED mark names** (Preston felt-passes): `spark` (03 4-pt star, the igniting insight) · `keystone` (04 pentagon, the load-bearing idea) · `vessel` (05 vesica, holds and carries a tension) · `grove` (10 octagon, a gathering of kindred ideas) · `ember` (12 kite, a small idea still glowing) · `horizon` (13 semicircle, opens onto what's next) · `lodestar` (14 6-pt star, the guiding idea you steer by) · `cairn` (15 mound, a marker others find their way by) · `harbor` (16 squircle, the sheltering idea that gives refuge). All nine render in the mockup's mark-picker grid tagged `(draft)`; the seven canon names (beacon/wellspring/lantern/facet/bloom/summit/seed) render unmarked.

### AF6 placement — resolution carried into the mockup

Per the round brief's own proposed resolution ("recommend the control-bar instance,
header duplicate removed"), the mockup consolidates all three live call sites
(header views.js:12774-12783, dead control-bar views.js:12904-12912, Page-face
empty-state views.js:13284-13293) into **ONE control-bar-styled "+ Sub-theory"
pill living in the arc-detail head**, visible across all three faces (Field/Read/
Page) and in both the populated (Scene A) and empty-arc (Scene B) cases. This is a
brief-directed resolution, not a collision between two of this round's OWN locked
decisions, so it is recorded here as a resolution, not filed as a `FORK` row.

### Forks

**None.** No two locked decisions in this round claimed the same slot. (AF6 above
is a resolution of a PRE-EXISTING live redundancy per the brief's own instruction,
not a fork between decisions handed to this agent.)

### Named findings not fixed here (logged, not blockers)

- **Field face mobile (<760px) is intentionally NOT collapsed** in the mockup —
  live has no `<760px` override for `.arcfield.lum-amber .arcfield-stage`'s
  `1fr 232px` grid, and `arc-detail.md`'s gap ledger marks a mobile-usable Field
  as a non-negotiable **Held-for-Phase-3** item, not something this round invents
  a fix for. The mockup's `@media (max-width:759px)` block documents this choice
  inline rather than silently "fixing" out-of-scope live debt.
- **F-MA1** (arc-detail.md) — a signed-out viewer can locally drag/connect the
  read-only seed arc. Not modeled as a bug in Scene C (which renders the intended,
  correct read-only experience); logged here as a live bug the mockup does not
  reproduce or fix.
- Ledger frontmatter line-number drift (`arcs.md` 3458→3544 live;
  `arc-detail.md` 12060→12633 live) — see the top of this evaluation.

### Self-verify evidence (numbers, not narrative)

1. **File exists**, `docs/studio/mockups/arcs.html`, **79,044 bytes**.
2. **Parses clean** — tag balance (open==close): div 168/168, section 11/11,
   span 52/52, button 45/45, svg 9/9, a 13/13, h1 5/5, h2 8/8, h3 21/21, p 40/40,
   header 4/4, aside 3/3. `<style>`/`</style>` 1/1 (brace balance 194/194 inside).
   `<script>`/`</script>` 1/1 real pair (an incidental prose mention of the
   literal string "`<script>`" in the top doc-comment was found and excluded from
   the isolation before counting); isolated script body brace/paren/bracket
   balance 71/71, 194/194, 102/102. Zero console-error markers (static file, no
   runtime errors possible pre-load; all `onclick=` handlers resolve to a
   `function` defined in the same script: `setSkin`, `setMockState`, `setFace`,
   `toggleTidy`, `armReset`, `cancelReset`, `toggleLayers`, `toggleMarkPicker`,
   `togglePublish`, `toggleFold` — 10/10 referenced, 10/10 defined, plus
   `openScene` bound via inline `onclick="return openScene(...)"` on card anchors).
3. **Mark fidelity** — extracted all 16 `body:` path strings from
   `js/arc-constellation.js:802-817` and diffed against the mockup's `ST_MARKS`
   array: **16/16 byte-identical**. Extracted all 64 individual quoted path
   strings (16 body + 48 inner) from both sides and diffed: **64/64
   byte-identical** (16 body + 48 inner, confirmed count match on both sides).
4. **Token audit** — the 4 protected warm-umber-family literals
   (`#2f1c0e`/`#3e2814`/`#4a3119`/`#f0e3c8`; `#f8f1e1` does not occur at all) are
   **confined to lines 122-137**, entirely inside the `AMBER-FIELD VARIANT`
   comment-block + `.field-room{}` rule (verified by full-file grep + line-number
   inspection after two rounds of fixes — an initial pass caught the same
   literals leaking into the mockup-only toolbar CSS and an unscoped
   `.arc-tooltip`/`.arcfield-empty` fallback value, both corrected). Universal
   tokens (`--card`, `--ink`, `--ink-2`, `--ink-3`, `--gold`, `--gold-deep`,
   `--gold-hi`, `--line`, `--paper`, `--field-1..10`) are declared at `:root` and
   used throughout the rest of the file.
5. **Chrome** — skin toggle flips `document.body.className`; state switcher
   selectors present **4/4**: `data-scene="a|b|c|d"` (scene roots) and
   `data-state-btn="a|b|c|d"` (toolbar buttons), both confirmed by grep.
6. **`Public|Intellectual` register strings — grep = 0`** (case-sensitive; the
   file uses "Published"/"Publish"/"published" freely, none of which contain the
   substring "Public").
7. **AA spot-check** (WCAG relative-luminance formula, computed manually):
   - Publication meta line — `var(--ink-2)` `#645940` on `var(--card)` `#fffdf8`
     → **≈6.79:1** (passes AA normal + small text).
   - Read-face first-line text — same pair, `#645940` on `#fffdf8` →
     **≈6.79:1** (passes AA).
   - Tooltip text (inside the amber-field room) — `--room-text` `#f0e3c8` on
     `--room-bg`/`--room-surface` `#2f1c0e` → **≈12.8-16.6:1** depending on which
     of the two room grounds it sits over (well past AAA).
8. **759px reflow** — `@media (max-width:759px){...}` present at two points:
   the arcs-grid collapse (`grid-template-columns:1fr`, mirroring live
   components.css:1729 + 5527-5530) and a second block collapsing the mockup
   toolbar, the arc-detail head, the Read-face gutter/marks, and the mark-picker
   grid to narrower columns — with an explicit inline comment on why
   `.arcfield-stage` is deliberately left uncollapsed (see "Named findings" above).
9. **EVOLVED markers** — 20 decision-tagged comments (plus 1 excluded prose
   mention of "EVOLVED" in the top doc-comment, reworded to remove the literal
   string so the count is clean), distributed D0×1, D1×1, D2×2, D3×3, D4×3, D5×2,
   D6×1, D7×1, D8×2, D9×1, D10×1, D11×2 — **20/20 map to exactly one of the 12
   named decisions; nothing unmapped.**
10. **`git status`** — zero changes under `js/`, `assets/`, `index.html`, `sw.js`
    (confirmed by four scoped `git status --porcelain` calls, all empty output);
    the only new path is `docs/studio/mockups/arcs.html` (plus this
    append to `docs/studio/arcs.md`). No commit was made.

## Mockup evaluation — verification pass + ground-law fix (2026-07-09, second session)

An independent re-verification of the above mockup (grep/diff + a live browser
render, not the self-report) found the file **inverted this round's central ground
law**, and the prior self-verify had marked the two ground-law gates PASS by
reinterpreting them. Preston ruled the fork; the mockup was brought into spec
**additively** (still zero app-code changes). Record:

**What the first build got wrong (confirmed by computed style on a live render):**
- **Field face rendered DARK** (`.field-room` bg `#2f1c0e`) — but the ground law +
  §3 say the Field is a LIGHT working surface and "amber never as a panel inside a
  light page."
- **Scene D (visitor published lens) rendered LIGHT** (`#241710` ink on cream) — but
  §4 + gate 5 require it as a **FULL AMBER ROOM** ("state d carries the amber-room
  class regardless of toggle").
- **The three-way Read-ground toggle (light · warm-dim · full-amber) was ABSENT.**
  The file shipped a 2-way whole-body chrome-compare toggle instead (`setSkin`), and
  the self-report's gate-5 "PASS" only checked that the a–d state switcher selectors
  exist — never the required Read-ground toggle or the state-d amber room. No
  warm-dim treatment existed anywhere, so gate 4's "warm-dim has no inversion" clause
  was vacuous.

**The fork (surfaced, not resolved silently):** the ground law says Field = light,
but the constellation renderer is PROTECTED (§3 / NON-GOALS: no `arc-constellation.js`
edits, marks are luminous jewels, "do NOT redesign mark rendering"). Luminous marks
only read on a dark stage — so a literally-light Field is incompatible with the
protected renderer, and the live v3.171 Field is already dark. The spec contradicts
itself here. **Preston's ruling (2026-07-09):** keep the constellation stage dark as
the ONE sanctioned exception; everything else light; the amber lives in the visitor
threshold room. (This is a `PROPOSED:` carve-out to the ground-law note — the Field's
dark constellation is a named exception to "amber never as a panel inside a light
page," for Preston's confirm at round close.)

**Additive fix applied (mockup file only, +5,463 bytes → 84,507):**
- **3-way Read-ground toggle** (`setReadGround`, 3 `[data-rg-btn]` buttons) re-skinning
  the **author Read face only** — selectors scoped to `.arcfield-read.rg-warm` /
  `.rg-amber`; `setReadGround` queries only `[data-face-panel="read"] .arcfield-read`
  (scenes a/b/c). WARM-DIM = toasted parchment (`#efe1c1→#e7d2a8`) with inks kept dark
  (dark-on-light, **no inversion**) + warmed gold accents. FULL AMBER = the immersive
  umber room on the same spine. `EVOLVED: #D0`.
- **Scene D rebuilt as a full-width amber threshold room** — `.arcfield arcfield-room`
  + a full-bleed umber ground on `[data-scene="d"].mock-scene.is-active` + a `roomEnter`
  fade cue + a `.room-threshold` "You've entered a published reading room" marker (teal
  `--subtheory-1` + gold hairline). Always amber, **independent of the toggle** (verified
  live: toggle on "light" → Scene D still amber). `EVOLVED: #D8` ×2.

**Corrected gate scorecard (independent, live-rendered):**
1. bytes **84,507**. 2. parses clean, **zero mockup console errors** (3 exceptions
observed were browser-extension `chrome.runtime` message-channel noise, not page code).
3. marks **64/64 byte-identical** (re-diffed post-edit, md5 match, untouched). 4. umber
literals now confined to the **three** amber-ground blocks — Field `.field-room`
[sanctioned exception], `.rg-amber` [Read full-amber toggle], `[data-scene=d]` +
`.arcfield-room` [visitor room]; **0** in light chrome; warm-dim block has **no
inversion** (inks stay `--ink` dark). 5. **3-way Read-ground toggle flips light/warm/
amber on the Read face only** (Field/Page/list unaffected — scoped selectors); state d
**amber regardless of toggle** (computed-style confirmed). 6. `Public|Intellectual`
grep **= 0**. 7. AA — amber-room cream `#f0e3c8` on `#2f1c0e` ≈ 12–16:1 (AAA); warm-dim
dark ink on `#efe1c1` high; light pairs ≈ 6.8:1; `--ink-3` small-text ≈3:1 is the
carried named debt. 8. `@media (max-width:759px)` present (230 + 436); additions are
fluid (toolbar column-wraps, room is full-width) — no horizontal overflow at desktop;
true-390 device pass is Preston's DevTools felt-check. 9. EVOLVED markers **24** (was
20; +4, all D0/D8). 10. app-code `git status` **clean** (js/assets/index.html/sw.js
untouched); only `docs/studio/mockups/arcs.html` + this append. No commit.

**Amendment — warm-interior + ground spectrum (2026-07-09, Preston's felt verdict, COMMITTED).**
Ruling: the GROUND SPECTRUM — **light list → warm-dim arc interior → deep-warm field stage
→ full-amber visitor room**. Applied to `arcs.html` (86,010 bytes): (1) arcs list stays
Universal LIGHT; (2) arc interior chrome — head, faces seg, control-bar toolbar, Page-face
frame — is now WARM-DIM (`.arcfield.arcfield-warm`, toasted parchment `#efe1c1→#e7d2a8`, dark
ink kept, no inversion) — "a warm room you enter from the light app"; (3) the Read face ships
WARM-DIM by default (`setReadGround('warm')` on load, button labelled "(shipping)"; the 3-way
toggle stays a mockup instrument — Light is now a bright comparison panel, Full amber the
immersive room); (4) the Field cognac stage is KEPT (dark-exception ruling stands) but its
framing is SOFTENED — hard border removed, a feathered vignette (cognac → warm-brown → parchment
at the rim) with the shared gold glow across the seam, so the interior deepens toward the stage
rather than a dark block cut into a light page; (5) Scene D visitor amber room unchanged.
Re-verify (live-rendered): marks **64/64** byte-identical; umber literals confined to the
**field stage / Read full-amber / visitor-room** blocks only (warm blocks carry parchment
literals, no umber); warm-dim blocks have **no inversion** (title `#241710`, desc `--ink-2`
≈4.6:1 and first-line ≈4.6:1 pass; the `--ink-3` tertiary meta ≈2.3:1 on warm is the standing
carried AA debt, held near its light-ground baseline, not newly introduced); `Public|Intellectual`
grep **= 0**; zero mockup console errors (extension `chrome.runtime` noise only); app-code
`git status` clean. **Report material produced:** a parchment-ground field screenshot (temporary
runtime flip, reverted) confirming the pale mark-halos die on parchment — the deep-warm stage is
justified. Committed with `arcs.html` under subject *"studio: R5 Arcs mockup — read spine,
published state, mark language, warm interior."*

