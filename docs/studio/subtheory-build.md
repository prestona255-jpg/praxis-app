---
surface: subtheory-build
route: "#subtheory/<id>/build"
render_fn: renderSubTheoryBuild (anchor by name — grep '^function renderSubTheoryBuild'; views.js ~10449 as-of-2026-07-11)
ground: dark
in_nav: no
state: closed
rounds: 1
mobile: native
desktop: composed
---

## State

`#subtheory/<id>/build` → `renderSubTheoryBuild` (anchor by name — grep `^function renderSubTheoryBuild`; views.js ~10242 as-of-2026-07-10); dark ground; sub of arcs. The **workshop** — the SOLE prose editor after R6 (warm-dim contained working panel). **CLOSED R6 (v3.190, `4c8f73e`, felt-passed 2026-07-10).**

## Decisions

- **R6 (v3.190, felt-passed 2026-07-10):** the workshop is the SOLE prose editor — the notebook births, the workshop writes, the Page reads (decisions #1/#2/#3/#4). The warm-dim WORKING register (decision #8) renders as a **CONTAINED rounded panel** (`.stb-warm-dim`, `max-width:1220`/`radius:26px`) on the route's dark ground — **felt-pass CONFIRMED as decided, NOT debt** (finishing "opens" it into the full-bleed amber room). Focus Mode (#7) collapses the rail to pure prose. Delete re-homed here from the Page (feature-preservation). Finish/Finished vocab (#5). Pull system (R#5) = deterministic search/filter + woven/unwoven dot + "woven into ¶N"; **`writing-canvas.js` UNTOUCHED** (reused `insertAtCaret`/`weaveNote`).
- Warm-dim ink-ramp bare-on-field labels = **CARRIED NAMED DEBT** (systemic ramp retune, not per-element) — filed as `R6-INK` in the sibling `subtheory-page.md` ledger.

## Gap ledger

- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: partial-R6] [sev: ADD] Sub-theory ADD — the publish transition (private milestone); a Connections section (which also fixes unlinking, currently broken on touch because it's hover-only); the Yumi margin presence (intent locked, form held); composer keys (⌘↵ / ⌘P / ⌘S). → R6: publish transition = Finish/Finished (S1 `78174f5`); Connections + Yumi margin present. STILL OPEN: composer keys; touch-unlink (Connections still routes to the arc, no in-place unlink) — deferred.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: open] [sev: FIX] Sub-theory FIX now — autosave plus flush-on-exit (a real prose-loss bug today); confirm-before-discard on an empty draft. → R6 did NOT touch this (`writing-canvas.js` untouched by design); `createWritingCanvas` already has debounced `scheduleSave` + flush-on-blur (repo-mapper 2026-07-10), but confirm-before-discard is still unbuilt. Carried to a writing-canvas / data-loss round.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: fixed-pre-R6] [sev: REWORK] Sub-theory REWORK — migrate the body onto the shared writing canvas (single body field); maturity indicator → qualitative rather than a number. → CLOSED: single `bodyPublic` on the shared canvas (R5 S4 register collapse); maturity is a qualitative band label ("nascent/developing/established", `_stComputeMaturity`), not a number.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: partial-R6] [sev: Hygiene] Sub-theory Hygiene → sweep — citation-matching cleanup. → R6: the citation engine is now single-homed in the workshop (Page canvas removed, S2); `parseCitations` title-substring matching unchanged — a deeper matcher cleanup is still open.

## Mockup evaluation

**Round:** R6 Sub-theory (deep). **Mockup:** `docs/studio/mockups/subtheory.html` (72,478 B; do-not-merge, self-contained; open by double-click — no server needed). Built at HEAD `b1c4518`, against deployed `praxis-v3.189`. Scope: this ONE file covers a scoped multi-route set as four scoped panels — (a) `#subtheory/<id>/build` (renderSubTheoryBuild), (b)/(c) `#subtheory/<id>` DRAFT/FINISHED (renderSubTheoryPage + renderSubTheoryReadOnly), (d) the Notebook right leaf's birth flow (buildNotebookRightLeaf). `docs/studio/subtheory-page.md` and `docs/studio/notebook.md` are REFERENCED for their gap ledgers (AF1-AF5, WL3, OQ1, NB1-NB6 etc.) — never edited.

### Anchor confirmation (fresh recon vs the brief's stated lines)

| Anchor | Brief said | Found | Delta |
|---|---|---|---|
| `renderSubTheoryReadOnly` | ~9569 | **9569** | exact |
| `renderSubTheoryPage` | ~9751 | **9751** | exact (this ledger's sibling `subtheory-page.md` frontmatter still says `9119` — STALE, pre-existing drift, not introduced here) |
| Page canvas (`createWritingCanvas`, `subtheory-page`) | ~10086 | **10086** | exact |
| Page pill "Set as milestone" | ~9864-9882 | **9862-9884** (`stPubDone` 9864, `paintStPub` 9865-9872, text 9871, click handler 9874-9883) | within stated range |
| `renderSubTheoryBuild` | brief flagged the ledger frontmatter's `10576` as STALE, fresh anchor **11128** | **11128** | **CONFIRMED: 11128 is live; 10576 (this file's own frontmatter, line 4, and the `## State` line 13) is stale by ~552 lines** — recorded as a pre-existing drift finding, not corrected here (frontmatter edits are Preston's `state: shaped` step, out of this round's append-only scope) |
| Build canvas (`createWritingCanvas`, `subtheory-build`) | ~11260 | **11260** | exact |
| Build pill "Publish · private" | ~11224-11238 | **11222-11238** (`pub` button 11222, `paintPub` 11225-11229, click handler 11230-11238) | within stated range |
| Notebook working leaf | ~2073-2222 | `buildNotebookRightLeaf` **2078-2264** (comment header 2073) | function runs ~42 lines past the stated end (2222→2264: the Yumi-complicate block + `nb-working-acts` land at 2230-2262) — minor range drift, not a wrong anchor |
| Notebook name canvas | ~2148 | **2148** | exact |
| Gather vars | ~1628-1630 | `notebookGatherArc` **1629**, `notebookGatherName` **1630** | exact (±1) |
| `.subtheory-readonly` CSS block | brief said ~6449-6507 | **6295-6358** (header/body/evidence/quote/annotation/seealso) | **brief's line range is STALE by ~154 lines** — corrected here |
| "saved-meta" CSS (AF5) | brief said ~10886 | no `.saved-meta` class exists; the real AF5 anchor is **`.st-page.lum-amber-deep .st-tb-saved` components.css:10732** (Page) / **`.st-build.lum-amber-deep .stb-saved` components.css:10889** (Build), both `font-size:11px; color:var(--lum-ink-4)` | **stale terminology — corrected here; 10886 lands on the unrelated `.stb-into` rule** |

### Current-surface structure (what the mockup evolves)

> **Currency note (R-ARC recon, 2026-07-15 — Preston's F6 ruling).** The workshop's Yumi margin is
> **gold/amber, not cyan** — R#8 converted all four margin sites to `--lum-gold-d` (see the R#8 row in
> Decisions below, and its live verification note), and the live code carries an explicit "no blue"
> comment. The census line below said "cyan" for four days after its own file recorded the conversion —
> corrected here. `--lum-cyan` remains Yumi-reserved *elsewhere* (the Bloom/chat seam); it is simply not
> what the workshop margin wears. Anyone designing against "restyle the cyan margin" is working from a
> stale model.

- **Workshop** (`#subtheory/<id>/build`) — `.st-build.lum-amber-deep` full-bleed, two-column: `.stb-main` (hero mark + editable title + saved/publish/open-page acts + `.stb-sheet` holding the shared `createWritingCanvas` bound to `bodyPublic`, a **gold/amber** Yumi margin (`.stb-ymargin`), a connections foot) + `.stb-rail` ("Pull from your reading" — real books, expandable to real marginalia, each weave-able via `insertAtCaret` + `addEvidence`). No citation engine, no Write/Preview toggle — Build never had one.
- **The Page** (`#subtheory/<id>`) — `.st-page.lum-amber-deep`, a `.st-topbar` (back/hero-mark/kicker/saved/publish-pill/quiet "Continue building →") over a 3-column `.st-grid` (230px evidence-attach rail | the editable `.st-main`/`.manuscript` sheet (same canvas, `subtheory-page` surfaceId, the citation preview + Write/Preview + Published toggle) | 190px Yumi margin), with `.st-connections` as a sibling footer below the sheet.
- **Read-only render** (`renderSubTheoryReadOnly`, shared by the seed-view path AND the Page's own "Published" preview toggle) — a bare `<h2>` + `<div>` body (citations resolve to `.subtheory-cite` spans, superscript-numbered only when `mode==='published'`) + an `<ol>` evidence list + a see-also block. Styled with the raw `--ink`/`--ink-2`/`--ink-3` family (base `components.css:6295-6358`), NOT `--lum-*` — no scoped `.st-page.lum-amber-deep .subtheory-readonly-*` override exists at all (grep-confirmed empty) — this is AF4.
- **Notebook right leaf** (`buildNotebookRightLeaf`) — gathered list (each note, a × remove) → a name field (already a single-line `createWritingCanvas`, `surfaceId:'notebook-forming-name'` — never a body textarea) → a gather bar (arc picker + Create) → a reserved/quiet Yumi-complicate slot → Clear. `notebookCreateSubTheory` (views.js:2382) ends with `location.hash = 'subtheory/' + st.id` — the auto-navigation decision #2 removes.
- **Fonts/tokens**: Cormorant Garamond (serif, titles/prose/italics), DM Sans (body), DM Mono (eyebrows/meta) — all three routes. Ground: `umberGroundDark` (r0-recon.md:429) resolves `--ink` family to `--text-d`/`--muted` (theme.css:341-344); the `.lum-amber-deep` wraps additionally carry the full `--lum-*` Lumen set (lumen-amber.css:29-58) at fixed full-amber values — there was, pre-this-mockup, no warm-dim register at all on this surface.
- **Responsive**: both Page and Build collapse to a single column at the live, confirmed **759px** breakpoint (components.css:10836, 10951); the Notebook's Universal-light skin (shipped R4 v3.188) also uses 759px (components.css:11096). This mockup uses the identical breakpoint throughout — no invented breakpoint.

### Decisions — exists / partial / new

| # | Decision | Live state | Mockup delta | DOM anchor (live) |
|---|---|---|---|---|
| 1 | Notebook births, workshop writes — leaf loses prose affordance | **partial** — the leaf already has no body textarea (only a single-line name canvas); nothing enforces "no prose" as a stated principle | reinforcing microcopy "Name it — the writing happens in the workshop" under the name field; explicit comment locking the no-textarea invariant | `buildNotebookRightLeaf` views.js:2134-2158 (`nb-nameblock`/`nb-working-name`) |
| 2 | Stay in the notebook on mint; newborn card + workshop door | **new** — live auto-navigates via `location.hash` | `.nb-newborn-card` (mark + title + eyebrow + snippet + "Continue in the workshop →" door + "you're staying right here" note), gather form hidden in place | `notebookCreateSubTheory` views.js:2362-2383, esp. line 2382 |
| 3 | Workshop absorbs the Page's citation engine (Write\|Preview + superscript previews) | **new for Build** — this exact toggle/pane exists on the Page (`wpToggle`/`subtheory-cite-preview`, views.js:10031-10121) but Build's `stb-sheet` has only the bare canvas | `.stb-wptoggle` (Write\|Preview) + `.stb-cite-preview` pane added to the Workshop, lifted from the Page's pattern | Page: views.js:10031-10121, 10118-10147; Build (pre-mockup): views.js:11247-11274 (no toggle) |
| 4 | Page = read/author-view; single Edit door; canvas dropped | **partial→new** — the topbar (hero/breadcrumb chrome) already exists but wraps an EDITABLE `.st-main`; a quiet `.st-tb-build` link already exists (views.js:9891-9894) | the editable `.st-main`/`.manuscript`/canvas region is REPLACED by the AF4-fixed `renderSubTheoryReadOnly` body; the quiet build-link becomes a prominent `.st-edit-door`; the now-orphaned evidence-attach rail (`.st-gutter`) is DROPPED as a mechanical consequence (it fed the removed canvas) — carried silently, not a separate decision | views.js:9807-10169 (`.st-main`), 9891-9894 (`.st-tb-build`), 10508-10992 (`.st-gutter`) |
| 5 | "Finish" replaces "Set as milestone" AND "Publish · private"; one word, both directions | **exists as a control, wrong vocabulary** — both pills already toggle the SAME `status`/`publishedAt` fields (draft↔published) | text-only relabel on both existing pill controls (`.st-pill-publish` Page, `.stb-pubpill` Build) → "Finish"/"Finished"; "Publish" never appears for a sub-theory anywhere in the mockup (grep-verified, see below) | Page: views.js:9862-9884; Build: views.js:11222-11238 |
| 6 | Draft = warm-dim; Finished = full-amber immersive room | **new** — live is ALWAYS `.lum-amber-deep` full-amber regardless of `status` | draft Page gets the `.stb-warm-dim` modifier (§8); finished Page keeps the live `.lum-amber-deep` skin UNMODIFIED + a new `.st-room-threshold` cue ("entering the finished room") + kicker copy "FINISHED"; the private-evidence filter case is exercised live in the room (see Data-source findings) | views.js:9808 (`wrap.className='st-page lum-amber-deep'`, unconditional) |
| 7 | Workshop keeps its 2-col anatomy + a new FOCUS MODE | **exists (anatomy) / new (focus)** — `.stb-main`+`.stb-rail` is craft-passed, untouched | `.stb-focus-toggle` button + `.is-focus` modifier class hiding `.stb-rail`/`.stb-ymargin`/`.stb-conn`, centering `.stb-main` at 680px — both states shown (toggle live in the mockup) | views.js:11174-11365 (`.stb-build`/`.stb-main`/`.stb-rail`) |
| 8 | Workshop sits WARM-DIM, not full amber | **new** — live Build is unconditionally `.lum-amber-deep` | `.stb-warm-dim` additive modifier (see Data-source findings — modeled additively, NO fork needed) | views.js:11157 (`wrap.className='st-build lum-amber-deep'`) |
| 9 | AF4 (token cross-wiring) + AF5 (saved-cue contrast) | **partial→fixed** — AF4: confirmed empty grep, no `.st-page.lum-amber-deep .subtheory-readonly-*` override exists; AF5: confirmed `color:var(--lum-ink-4)` on both saved-cues | AF4: new scoped rules repoint `.subtheory-readonly-*`/`.subtheory-cite*` to the `--lum-ink` family (works in both warm-dim and full-amber registers because §8/§6 remap `--lum-ink` itself); AF5: `.st-tb-saved`/`.stb-saved` bumped `--lum-ink-4`→`--lum-ink-3` | components.css:6295-6358 (AF4), 10732 + 10889 (AF5) |

### Data-source findings + build-time stand-ins

- **Decision #8 (warm-dim workshop) — modeled additively, no fork.** The live Build/Page CSS is authored entirely in the `--lum-*` namespace (full-amber, light-ink-on-dark). Rather than recasting any structural rule, the mockup defines an ADDITIVE `.stb-warm-dim` wrapper class that re-points the SAME custom-property names (`--lum-ink`, `--lum-ink-2/3/4`, `--lum-glass`, `--lum-glass-raised`, `--lum-glass-bd`, `--lum-glass-bd-2`, `--lum-gold`, `--lum-gold-l`, `--lum-gold-d`) to warm-dim values — every consuming rule (padding, layout, radius, all unchanged) repaints correctly because it already reads by variable name. `--lum-cyan` (Yumi) and `--lum-cloth` (cover swatch) are left untouched — ground-independent. Two literals are named BUILD-TIME stand-ins (no live equivalent exists yet):
  - **`--lum-ink-4` warm-dim (`#b3a480`)** — interpolated; Universal v1.1 (praxis-universal-token-sheet.md §2-§3) defines only a 3-tier light ink ramp (`--ink`/`--ink-2`/`--ink-3`), no 4th tier. Live-wiring path: extend the Universal sheet with a light `--ink-4`, or accept `--ink-3` doing double duty (as the shipped Notebook skin already does, components.css:11993).
  - **The warm-dim glass gradients** (`--lum-glass`/`--lum-glass-raised` translucent-white recipes) — modeled from the R5-ratified `.arcfield.arcfield-warm` room recipe (`docs/studio/mockups/arcs.html:247-251`, itself citing theme.css primitives), not a value that exists anywhere in `lumen-amber.css` today. Live-wiring path: a real `.st-build.lum-amber-deep.<warm-dim-class>` / `.st-page…` CSS block in `assets/components.css`, sibling to the existing full-amber rules, at the BUILD round.
- **Decision #6 (private-evidence filter in the finished room)** — real live mechanic, not a stand-in: `evidencePrivate()` (views.js:9584-9588) + the citation-parse comment at views.js:9598-9601 ("a published phrase that named a private entry no longer resolves → plain italics"). The mockup's private journal entry ("that first year at Miami Northwestern") is INVENTED sample content (the real seeded arc has no private evidence example — its two attached marginalia entries are `isPrivate:false`, js/state.js:3313-3314,3353,3360) but exercises the REAL code path faithfully: draft (panel b) shows it as a resolved `.subtheory-cite` span + a 4th evidence-list item tagged "private — excluded when published" (the existing `.subtheory-attached-private-tag`, views.js:10672-10680); finished (panel c) shows the identical phrase reverted to plain `<em>`, superscript numbering renumbered 1-3, and the 4th evidence item gone.
- **Sample content provenance** — Preston's real seeded "A Pedagogy of Desire" arc (js/state.js:2893-3384, `userId:'__praxis_seed__'`): 5 real books, 4 real published sub-theories (cited by title in the Connections foot: "Eros in the Classroom" = `podS2`). The 5th sub-theory, "Wanting as a Curriculum," is INVENTED in the same voice to give the mockup a real (non-seed) editable/mintable subject — seed sub-theories always render through the read-only branch (`stpIsSeed`, views.js:9779-9790) and can never reach Build, so a seed sub-theory could not exercise decisions #1-#5/#7/#8 at all.

### Forks

**None.** All nine decisions compose without collision:
- #3 (Build absorbs the citation engine) and #4 (Page loses its canvas) divide cleanly — write lives only in the Workshop, read lives only on the Page; no two elements claim the same slot.
- #5's "Finish" pill appears on both the Workshop and the Page (mirroring how the live app already duplicates the SAME publish-toggle control across both surfaces) — this is a vocabulary unification, not a slot collision; both instances toggle the identical `status`/`publishedAt` fields.
- #8's "amber is the finished read's room only" is stated as an explicit resolution inside the decision itself, pre-empting the only plausible ambiguity (what ground the Workshop shows for an already-finished sub-theory reopened for editing) — the Workshop stays warm-dim unconditionally, full amber never appears there.

### Self-verify evidence

- **Byte size:** 72,478 B (`wc -c`).
- **EVOLVED census:** `grep -c "EVOLVED: #"` on the file body (excluding the header comment's generic `#n` convention line) = **33**, every decision #1-#9 mapped at least once, nothing unmapped: #1×2 · #2×3 · #3×4 · #4×6 · #5×4 · #6×5 · #7×4 · #8×2 · #9×3.
- **Structural balance:** DOCTYPE/html/head/body each occur exactly once; `<div>` 99/99, `<section>` 4/4, `<header>` 2/2, `<footer>` 2/2, `<aside>` 2/2, `<ol>` 2/2, `<li>` 7/7, `<p>` 18/18, `<span>` 55/55, `<button>` 18/18, `<a>` 11/11, `<script>` 1/1, `<style>` 1/1; CSS brace balance 248/248; HTML comment balance 23/23. All 20 `id=` attributes unique (no duplicates).
- **JS parse gate:** the inline `<script>` block extracted and run through `cscript //nologo //E:jscript tools/parse-check` → `PARSE OK` (ES3 style, var/function only, matching the app's own convention).
- **All four panels render and the interactions work:** scene switcher (a/b/c/d), Focus Mode toggle (Workshop), Write\|Preview toggle (Workshop), Finish/Finished pill toggle (all three panels a/b/c), Create → newborn-card reveal (panel d) — verified by reading the wiring (`setScene`/`toggleFocus`/`setWP`/`toggleFinish`/`doCreate`) against the DOM ids each references; every referenced id exists exactly once (see above).
- **"Publish" never appears for the sub-theory** — grep-confirmed: the only surviving uses of the word "Publish" in the file are inside HTML comments describing the LIVE (pre-evolution) copy being replaced (e.g. "replaces 'Publish · private'"); no visible button/label text reads "Publish" anywhere in the four panels.
- **`git status --porcelain`** for the two in-scope paths, before this append: `?? docs/studio/mockups/subtheory.html` only — `docs/studio/subtheory-build.md` was clean (this edit is the first touch). No file under `js/`, `assets/`, `index.html`, `sw.js`, or `design/` was read via a write-capable tool or touched in any way.

## Mockup revision 1

**Trigger:** Preston's felt-pass on the R0 mockup — **"skeleton PASS, skin FAIL."** Ten locked revisions (R#1–R#10), implemented IN PLACE in the same file (`docs/studio/mockups/subtheory.html`), revision mode: in-place edits including removals, tagged `<!-- REVISED: R#n -->`. No commits, no cache bump, no second mockup file. This section is appended below the untouched R0 `## Mockup evaluation` above — nothing in that section was rewritten.

### Current-surface structure this revision touches (recap, R0 unchanged unless noted)

The R0 structure stands (Workshop two-column shell, the Page's topbar+grid+connections+Yumi-margin, the read-only render, the Notebook right leaf) — this revision plugs a redundancy leak (R#1/R#2/R#3/R#4), adds two new organs (R#5 the pull system, R#6 walk-nav), and fixes a skin/contrast list (R#7/R#8/R#9/R#10). No panel's anatomy is recast; §7 THE GROUND SPECTRUM's warm-dim/full-amber assignment from R0 (decision #6/#8) is preserved, only deepened (R#9).

### Decisions — exists / partial / new (against the R0 mockup, not live)

| # | Decision | R0 mockup state | Revision-1 delta | Anchor (mockup file) |
|---|---|---|---|---|
| R#1 | Kill Write\|Preview in the Workshop; "Open the page →" is the sole door | **existed as a redundant second path** — `.stb-wptoggle` + `.stb-cite-preview#citePreviewA` duplicated the Page's rendered view inside the Workshop | toggle markup/CSS/ids/JS handler (`setWP`) REMOVED entirely (grep-confirmed zero, see Self-verify); `.stb-openpage` restyled from a bare mono link to a quiet outlined-gold pill (now the sole path); the inline `.subtheory-cite` spans in the canvas (decision #3's real substance) are UNTOUCHED/kept | CSS: line 211 (removal note) · markup: line 667 (`.stb-openpage`), line ~672 (canvas, citations retained) |
| R#2 | "Finish" lives ONLY in the Workshop | **existed on both Workshop (finishA) and Page-Draft (finishB)** — same control duplicated across two rooms | `finishB` button REMOVED from the Draft topbar entirely; `finishA` (Workshop) and `finishC` (Finished room, "Finished/reopen") both UNTOUCHED — confirmed not this decision's target | markup: line 806 (removal note, Draft topbar `.st-tb-right`) |
| R#3 | Page-Draft strips autosave chrome | **existed** — `<span class="st-tb-saved">saved · 4 mins ago</span>` in the Draft topbar | REMOVED from Draft only; Finished room's `.st-tb-saved` ("finished · 2 mins ago") is UNTOUCHED (out of this decision's scope); maturity (`.st-maturity`) and provenance (`.t-meta`) lines both UNTOUCHED, still reader-facing | markup: line 802 (removal note, Draft topbar) |
| R#4 | Draft's edit door quiets to outlined gold | **existed as a filled gold block** (`.st-edit-door`, `background:linear-gradient(...var(--lum-gold))`) | new `.st-edit-door-outline` modifier (own light wash + `--lum-gold-d` text, border only) added to the Draft's door only; Finished room's `.st-edit-door-quiet` (neutral ink, "recedes") is a DIFFERENT, untouched register; `.st-edit-door`'s shared 44px mobile rule (unedited) still applies since the base class is still present | CSS: lines 369-370 · markup: line 814 |
| R#5 | THE PULL SYSTEM: search/filter, visible WOVEN/UNWOVEN state, insert-at-cursor | **existed as a passive list** — 2 books, 2 passages, one `.stb-weave`/`.stb-weave.done` toggle button per passage, no search, no "where" | (a) new book-select + text-search bar, deterministic `filterPull()` (book-row-level filter); (b) every passage now carries an orb-dot state (`.stb-weave-dot` lit/unlit, Universal depth v1.2 recipe 2) + a "woven into ¶N" caption on woven passages; (c) the weave button IS the insert-at-cursor affordance, `title` attribute added, `weaveIn()` deterministic handler (no Yumi). Added a 3rd book ("Pedagogy of the Oppressed") with 2 passages (1 woven, 1 unwoven) for the multi/intersectional case — 3 books, 4 passages total now. NO Yumi generation anywhere in this organ. | CSS: lines 271-293 · markup: lines 709 (filter bar), 757 (3rd book) · JS: `filterPull()`/`weaveIn()` |
| R#6 | WALK-NAV in the Finished room | **did not exist** — Finished room had no sibling navigation | new `<nav class="st-walknav">` footer, Finished panel only: prev = real Sub-theory 1 "Desire as Political Refusal" (`js/state.js:3339-3346`, shortened "The Refusal" per the locked decision's own sample copy), next = real Sub-theory 3 "Eros in the Classroom" (`js/state.js:3348-3354`, already this mockup's Connections link), arc name "A Pedagogy of Desire" as the spine. Text links only — the constellation shape-click mount is explicitly NOT modeled (separate, later decision) | markup: line 921 · CSS: `.st-walknav*` rules added in the Page section |
| R#7 | Marginalia rail re-palette (off khaki/olive) | **existed as a dark `rgba(20,12,5,.3)` overlay** on `.stb-marg`, read muddy/khaki against the light warm-dim card behind it; `.stb-pg` used `--lum-ink-4` (fails AA); `.stb-weave`/`.stb-weave.done` used `--lum-gold-l`/`--lum-ink-4` (both decorative-only, fail AA) | `.stb-marg` background → warm amber-family wash (Universal field-8 pale-gold); `.stb-pg` → `--lum-gold-d` (was ink-4); `.stb-weave` active → `--lum-gold-d` text (was gold-l); `.stb-weave.done` → `--lum-ink-2` (was ink-4). All verified ≥4.5:1 at the gradient's worst stop — see the contrast table below | CSS: line 268 (`.stb-marg`), lines 271-293 |
| R#8 | Yumi's margin voice: no blue, gold/amber presence | **existed in cyan/teal** everywhere Yumi speaks in a margin: `.stb-yd`/`.stb-ymargin p` (workshop, `--lum-cyan`), `.st-yumi-eyebrow`/`.lum-light`/`.st-yumi-note p` (Page, both registers, `rgba(127,208,240,…)`/`--lum-cyan`), `.nb-complicate`/`.nb-ybubble`/`.nb-ctag` (Notebook, raw teal hexes `#1f5a6b`/`#4a9fb8`/`#256b80`) | ALL FOUR converted to `--lum-gold-d` (register-aware: resolves dark-on-light in warm-dim, light-on-dark in full-amber) or this file's own established amber literals (Notebook). Verified against the real live Yumi Bloom (`assets/components.css:11-37 .yumi-bloom-orb`, `var(--gold)` glow — confirms the cyan was R0 mockup drift, NOT prior live canon, so this is a correction, not a fork against established design) | CSS: line 235 (`.stb-ymargin`), Page `.st-yumi*` block, Notebook `.nb-complicate`/`.nb-ybubble`/`.nb-ctag` block |
| R#9 | Deepen the workshop's warm-dim | **existed as a flat 2-stop gradient**, byte-identical to `.arcfield.arcfield-warm` (R5-ratified, unchanged at the arc-interior level) — "flat cream," minimal ground-to-panel separation | `.stb-warm-dim` gains 2 radial atmospheric washes + an inset vignette over a darkened base (Universal depth v1.2 recipe 6, retuned warmer/deeper); `--lum-glass`/`--lum-glass-raised` boosted toward near-opaque white so the lit canvas/sheet pops off the dimmer field; box-shadows added to `.stb-source`/`.st-connections` for visible separation; dark ink (`--lum-ink:#241710`) kept throughout — no polarity inversion | CSS: line 486 (`.stb-warm-dim`) |
| R#10 | Fix the workshop title clip | **`<input>` with no `text-overflow`** — a long value could render as a hard mid-word clip ("Wantin") with no visual cue | `text-overflow:ellipsis; overflow:hidden` added to `.stb-title-input`; a `title="Wanting as a Curriculum"` attribute added as the native-tooltip fallback | CSS: line 200 · markup: the `.stb-title-input` element, Workshop panel |

### Data-source findings

- **R#6's siblings are real, not invented.** `js/state.js:3317-3367` (the seeded "A Pedagogy of Desire" arc): `podS1` = "Desire as Political Refusal" (linked to `podS2`), `podS2` = "Eros in the Classroom" (linked to `podS1`/`podS3`), `podS3` = "Pain and Struggle on the Path of Liberation`, `podS4` = "Radical Self-Actualization" — a linear S1↔S2↔S3↔S4 chain. The mockup's invented "Wanting as a Curriculum" (R0) opens by directly bridging S1's refusal and S2's eros, so it sits at walk-position 2 — pushing "Eros in the Classroom" to position 3, which matches Preston's own locked sample text ("Sub-theory 1 · The Refusal" / "Sub-theory 3 · …") exactly and reuses the SAME title this mockup already cites in its Connections foot. No stand-in needed; live-wiring path is a `linkedSubTheories`-order walk once "Wanting as a Curriculum" is a real minted record.
- **R#8's factual claim verified against live.** Decision text asserts Yumi's live Bloom already wears gold/amber. Confirmed: `assets/components.css:11-37`, `.yumi-bloom-orb{ filter: drop-shadow(0 3px 12px color-mix(in srgb, var(--gold) 38%, transparent)); }`, with the block's own comment: "A warm SVG heart on the warm surface: NO dark vessel." This makes R#8 a **correction of R0-introduced drift**, not a fork against an established "cyan = Yumi" canon — no live cyan-Bloom precedent exists to collide with.
- **R#9's two BUILD-TIME stand-ins from R0 (`--lum-ink-4` warm-dim, the warm-dim glass gradients) are UNCHANGED in kind, only in value** — still no live 4th light-ink tier and still no live `.st-build.lum-amber-deep.<warm-dim>`/`.st-page…` CSS block exists in `assets/components.css`; this revision only deepens the SAME named stand-ins' literals. Live-wiring path is unchanged from R0's note.

### Contrast table (every text-on-ground pair touched by R#4/R#7/R#8/R#9)

Computed via the standard WCAG 2.x relative-luminance formula (script run through `cscript //nologo //E:jscript`, not eyeballed). Backgrounds are flattened at each gradient's WORST (most field-bleeding / lowest-opacity) stop — the conservative case.

| Pair | fg | bg (flattened, worst stop) | Ratio | Verdict |
|---|---|---|---|---|
| R#4/R#1 door text (`--lum-gold-d`) on its own light wash | `#855410` | `#f3e9d0` | 5.31:1 | PASS |
| R#7 passage text (`--lum-ink-2`) on the new `.stb-marg` wash | `#645940` | `#f1dba8` | 5.07:1 | PASS |
| R#7 `.stb-pg` label (`--lum-gold-d`, was ink-4) on `.stb-marg` wash | `#855410` | `#f1dba8` | 4.72:1 | PASS |
| R#7 weave-active label (`--lum-gold-d`, was gold-l) on the chip wash | `#855410` | `#f1d89d` | 4.60:1 | PASS |
| R#7 weave-done/"woven-where" text (`--lum-ink-2`, was ink-4) on `.stb-marg` wash | `#645940` | `#f1dba8` | 5.07:1 | PASS |
| R#8 Workshop Yumi text (`--lum-gold-d`) on `.stb-ymargin`'s wash (in-sheet) | `#855410` | `#f5e4bd` | 5.11:1 | PASS |
| R#8 Draft-Page Yumi text (`--lum-gold-d`) on the new `.st-yumi` card wash (on-field) | `#855410` | `#ecdab1` | 4.65:1 | PASS |
| R#8 Finished-room Yumi text (`--lum-gold-l` equiv., full-amber `--lum-gold-d`=`#cf9c2a`) on body | `#cf9c2a` | `#171009` | 7.57:1 | PASS |
| R#8 Notebook Yumi text (`#855410`) on the notebook card | `#855410` | `#fffdf6` | 6.30:1 | PASS |
| R#8 Notebook `.nb-ybubble` "Y" (white) on its gradient's deep stop | `#ffffff` | `#855410` | 6.42:1 | PASS |
| R#6 walk-nav arc-spine label (full-amber `--lum-ink-3`) on body | `#b6a888` | `#171009` | 8.03:1 | PASS |
| R#6 walk-nav sibling title (full-amber `--lum-ink-2`) on body | `#e8dcc4` | `#171009` | 13.88:1 | PASS |
| R#6 walk-nav arrow (bumped `--lum-ink-4`→`--lum-ink-3`) on body | `#b6a888` | `#171009` | 8.03:1 | PASS |
| R#9 canvas/read-hero body ink (`--lum-ink`, dark, kept) on the boosted lit sheet | `#241710` | `#f5e9cb` | 14.44:1 | PASS |
| R#9 canvas secondary text (`--lum-ink-2`) on the boosted lit sheet | `#645940` | `#f5e9cb` | 5.71:1 | PASS |

**All 15 touched pairs PASS ≥4.5:1.**

**One flagged pre-existing finding, NOT fixed here (not one of the ten):** `.stb-eyebrow`/`.st-tb-kicker` (`--lum-ink-3`) and `.st-tb-back` (`--lum-ink-4`) sit BARE on the warm-dim field (outside any card) and already failed AA in the R0 mockup — `--lum-ink-3` (`#978b6d`) on R0's own field-dark end (`#e7d2a8`) = **2.28:1 FAIL**; `--lum-ink-4` (`#b3a480`) on the same = **1.66:1 FAIL**. This revision's R#9 field-darkening moves the same pair to **2.12:1** (still failing, marginally lower) — a side effect, not a new regression in kind, since it was already failing before any R1 edit. Left untouched per the "flag, don't silently expand scope" rule; a future decision should retune the warm-dim ink-3/ink-4 ramp for bare-field use (the systemic fix, not a per-element patch).

### Token provenance (R#7–R#9 replaced literals)

| Literal | Used for | Source |
|---|---|---|
| `#f8e078` / `#f2c25a` (field-8 pale-gold / field-1 amber) | `.stb-marg` wash, weave-chip wash | `docs/studio/universal-depth.css:43` (`--field-8`, `--field-1`) |
| `--lum-gold-d` / `#855410` | R#4 door text, R#7 pg-label + weave-active, R#8 Yumi text (warm-dim + Notebook) | already-scoped `.stb-warm-dim` token (R0); Universal `--gold-deep`, `docs/studio/praxis-universal-token-sheet.md` §2-§3 |
| `--lum-ink-2` / `#645940` | R#7 weave-done + woven-where, R#9 canvas secondary text | Universal v1.1 `--ink-2`, `praxis-universal-token-sheet.md` §2 (already the `.stb-warm-dim` value from R0) |
| Universal depth v1.2 recipe 2 (luminous orb, amber variant) | R#5(b) `.stb-weave-dot`, R#8 `.stb-yd`/`.lum-light` dots | `docs/studio/universal-depth.css:57-71` |
| Universal depth v1.2 recipe 6 (atmospheric ground) | R#9 `.stb-warm-dim` radial washes + vignette | `docs/studio/universal-depth.css:109-117`, retuned warmer/deeper for a working (not paper) register |
| Universal depth v1.2 recipe 7 (constellation thread, `--thread`/`--u-thread` `#c2a463`) | R#6 `.st-walknav-thread` | `docs/studio/universal-depth.css:125-133` (already imported as `--u-thread` in this file's `:root`, R0) |
| `#f2c25a` / `#855410` (this file's OWN established amber literals) | R#8 Notebook `.nb-complicate`/`.nb-ybubble`/`.nb-ctag` | reused verbatim from this mockup's own `.notebook-entry-tag-m`/`.btn-primary`, not a new invention |
| `var(--gold)` glow, live Bloom | R#8's factual basis (no literal reused, cited as confirmation) | `assets/components.css:11-37` `.yumi-bloom-orb` |

### Forks

**None new.** All ten revisions compose without collision:
- R#1 and R#4 share ONE outlined-gold-pill idiom (mechanical coherence, not a new decision — R#1's "Open the page →" and R#4's "Edit in the workshop →" are now mirrored threshold doors).
- R#2's removal (Draft loses Finish) and R#5's rail rebuild touch adjacent but disjoint DOM regions (topbar vs. rail) — no slot collision.
- R#6 (Finished-room footer) and R#9 (field depth, shared with Draft via `.stb-warm-dim`) touch different panels' backgrounds — no overlap (R#6 is full-amber only, R#9 is warm-dim only).

### Self-verify evidence

- **Byte size:** 91,523 B (`wc -c`), up from R0's 72,478 B (+19,045 B — the pull system's 3rd book + filter bar, the walk-nav footer, and the revision-1 header/legend additions account for the growth).
- **REVISED census:** `grep -oE 'REVISED: R#[0-9]+'` → R#1×4 · R#2×1 · R#3×1 · R#4×2 · R#5×8 · R#6×3 · R#7×2 · R#8×3 · R#9×3 · R#10×2 = 29 tagged instances, all ten mapped, nothing unmapped (one additional untagged `REVISED: R#n` line is the header's own meta-description of the tagging convention, same pattern R0 used for its own `EVOLVED: #n` convention line).
- **Dead-toggle grep (R#1):** `grep -c 'stb-wptoggle\|stb-cite-preview\|wpPreview\|wpWrite\|citePreviewA\|setWP'` → **0**. Confirmed dead: markup, ids, CSS, and JS handler all removed.
- **R0's EVOLVED tags:** all 8 SURVIVING decision numbers (#1,#2,#4,#5,#6,#7,#8,#9) still present (2/3/5/3/5/4/2/3 = 27 instances); #3's tag count is now 0 because R#1 removed its ENTIRE manifestation (the toggle+preview pane) — decision #3's substance (inline `.subtheory-cite` citation styling in the canvas) is explicitly retained and documented in prose at the removal site (line 677-679), per this round's own R#1 instruction ("KEEP the inline...citation markers...that's the absorbed citations engine, decision #3 — it stays").
- **Structural balance:** DOCTYPE/html/head/body 1/1 each; `<div>` 112/112; `<span>` 72/72; `<a>` 13/13 (precise `<a[ >]` regex); `<li>` 7/7 (precise `<li[ >]` regex, excludes `<link>`); `<p>` 15/15; `<button>` 18/18; `<select>` 1/1 (new, R#5); `<nav>` 1/1 (new, R#6); `<section>` 4/4; CSS brace balance 273/273; HTML comment balance 32/32. One duplicate CSS rule (`.stb-marg`, an artifact of a multi-step edit) was caught and removed during self-verify — confirmed zero exact-duplicate rule lines remain (`sort | uniq -d` on the extracted stylesheet, decorative-only repeats excluded).
- **JS parse gate:** the inline `<script>` extracted and run through `cscript //nologo //E:jscript tools/parse-check` → `PARSE OK` (ES3 style, var/function only; new `weaveIn()`/`filterPull()` functions match the app's own convention, `document.querySelectorAll`/`getElementById`/`textContent` — all already used elsewhere in this same file).
- **All four panels still render and the pull-system + walk-nav states are live in the markup:** scene switcher (a/b/c/d) untouched; Focus Mode toggle untouched; the Finish/Finished pill on finishA/finishC untouched; Create → newborn-card reveal (panel d) untouched; the new `filterPull()` (book-select `onchange` + search `oninput`, 3 books/4 passages to filter) and `weaveIn()` (2 live unwoven buttons wired, 2 already-woven statics) are present and reference only ids that exist exactly once (`pullBookSel`, `pullSearchInput`, `pullEmptyMsg` — each confirmed singular in the id-uniqueness check, 20/20 unique text matches including one comment-only mention of the removed `finishB` id, which is NOT a live DOM element).
- **`git status --porcelain`:** exactly two paths touched this run — `docs/studio/mockups/subtheory.html` and `docs/studio/subtheory-build.md`. No file under `js/`, `assets/`, `index.html`, `sw.js`, or `design/` was written, staged, or committed. Pre-existing untracked `design/*`/other drift present at session start is unrelated to this run and was not touched.

## Round history

- **R6 Sub-theory (DEEP) — SHIPPED v3.190, CLOSED 2026-07-10.** 7 commits `78174f5 → 4c8f73e`, pushed `origin/main`, live-verified. Five beats: recon → click-forks → mockup (`subtheory.html` rev1; felt-passed "skeleton PASS, skin FAIL" → revised) → staged build (S1 vocab `78174f5` · S2 Page=read `4a2b3cf` · S3 workshop=sole-editor `066e056` · S4 pull-system `d6f9bca` · S5 notebook-births `9f0f8b5` · S6 skin+debt `08f61ac` · S7 red-team+cache `4c8f73e`) → felt pass (**FULL PASS 2026-07-10**: contained warm-dim panel confirmed-as-decided; newborn-card persistence passed; cyan pill-flag dot kept). fix-red-team CLEAN + praxis-reviewer CLEARED. Records: `docs/checkpoints/r6-subtheory.md` (+ `-recon.md`). touches: [subtheory-build, subtheory-page].

- **MW-3 Sub-theory mobile pass — SHIPPED-LOCAL v3.194 (2026-07-11), `mobile: native`.** The
  workshop half. Commit `99f7fb0` (with the Page, one commit) — CSS-only, one @media(max-width:759px)
  block. **P7:** `.stb-pull-book-sel`/`.stb-pull-search` 11.5px → 16px. **P3:** `.stb-delete` (26→44),
  `.stb-hero-mark-edit` (32→44×44), `.stb-yx` Yumi dismiss (8×19→44×44), pull inputs (→44/57);
  covered already (verified, no change): pubpill/openpage/weave/conn-add/crow/focus-toggle; title
  26px + canvas 18px (P7). **P8:** workshop scrollWidth 390, 0 offenders. Live-390 rig + praxis-reviewer
  PASS (6/6, one non-blocking pull-input note closed). Record: `docs/studio/reports/mw3-2026-07-11.md`.

## Round record — DW-3 (2026-07-14)

commits: 939eb73 (1, the Sub-theory-build slice; DW-3 batch 939eb73..cache-bump)
gates: PASS — D1 occ 49.3%→67.2% @1920 (96.1/89.8% @1280/1440), composed WITHIN the R6 contained-panel metaphor (the Notebook-widen precedent): the warm-dim panel 1220→1400 + content 940→1280, the existing two-region breathing — the writing column `.stb-main` held at a reading measure (flex:0 0 720px, 67.8ch) and the R6-S4 pull/evidence rail inhabiting the freed width (flex:1 1 0, ~540). D2 writing prose 67.8ch (≤72). D3 hScroll 0 @1280/1440/1920. D4 27/27 cursor:pointer. D5 rail body 15px unchanged. D6 focus-visible rings (pubpill/focus-toggle/openpage/weave/brow/conn-add/crow/delete). Focus mode (`.is-focus`, higher specificity) UNTOUCHED — its narrow centered column is the deliberate reading form. ≤1199 provably inert — matchMedia(min-width:1200)=false, `.stb-warm-dim` computed max-width 1220 (base) + `.stb-main` flex-basis 0% (base) @1024, `.stb-build` flex-direction column @390, hScroll 0 + node-count 162 match baseline.
defects-found: 0 shipped. Self-caught + fixed mid-build: `.stb-rail{flex:1 1 auto}` let the rail's wide intrinsic content balloon to 864px and squeeze `.stb-main` to 396px (writing collapsed to 34ch) → `.stb-main{flex:0 0 720px}` + `.stb-rail{flex:1 1 0;min-width:0}`.
lessons: A reading-measure sidebar composition needs the MAIN column FIXED (flex:0 0 <measure>) and the rail `flex:1 1 0; min-width:0` — `flex:1 1 auto` on the rail makes its intrinsic content its basis and it balloons, collapsing the main. Compose-within a round-owned metaphor by widening its governor + letting existing regions breathe (never restructure); a higher-specificity modifier like `.is-focus` survives a lower-specificity ≥1200 rule automatically.
evidence: docs/checkpoints/dw-3.md (Stage 1) · dw-3-recon.md. Chip stretched → composed (D1–D6 on live evidence; native awaits the deployed felt pass).

## Next

- **Mobile pass DONE (MW-3).** Both sub-theory faces are `mobile: native`. Nothing outstanding on
  the mobile axis; future work is content/feature, not responsive.
