# R9b · LANE P (Profile page) — STAGE 0 PRE-FLIGHT RECON

> Read-only. Written before any design. Evidence-anchored (file:line). Ends in a HALT for
> Preston's go-ahead. Canonical handoff = `docs/checkpoints/r9b-handoff.md` (NOTE: the session
> prompt cites `docs/studio/r9b-handoff.md` — the file actually lives under `docs/checkpoints/`).

## 0.1 — Canon reads (≤10 lines)

- **Handoff (`docs/checkpoints/r9b-handoff.md`):** R9b = two lanes, one round, FULLY display-only;
  any persisted need = HALT fork. **Lane P ships FIRST** (arc cards question-led + visitor-fenced;
  lineage row from `valueMarks.why`; Now richness; cross-links; W9 intro beat; sparse states;
  published quality pack; DNA re-slot). Lane G (galaxy) opens after, its own five-beat.
- **Profile ledger (`docs/studio/profile.md`):** `#profile`→`renderProfilePage`; merged Profile
  (R9a, v3.198+v3.199, STRONG PASS 2026-07-12); owner-vs-visitor = a CONTENT fence; project's first
  ≥1200 composition tier; AM8 statement is the ONE persisted addition (done in R9a).
- **sequence.md:** **Now = R9b** (Lane P first, then Lane G); DW-1..3 + ARC-FIELD-MOBILE also Now.

## 0.2 — GATES

| Gate | Verdict | Evidence |
|---|---|---|
| **G1 sequence** | **PASS** | HEAD `419267c` (Builder-1c v2); `105024d` (R9a close-out) in history (`merge-base --is-ancestor` YES for both); sequence.md L318 Now = "R9b — Profile arc layer + galaxy depth". |
| **G2 live version** | **PASS** | live `sw.js` ×2 cache-busted → `var CACHE_VERSION = 'praxis-v3.199'` (identical both fetches). Local sw.js also v3.199 → ship bumps **v3.200**. |
| **G3 regen collision** | **PASS (with note)** | `tools/studio-build` clean; `builder.html` NOT dirty (absent from porcelain); no studio-build process running (ps -W shows only this session's shells). **Note:** 5 pre-existing UNTRACKED stray files under docs/studio (`mockups/home.html`, `notebook-recon.md`, `praxis-launch-tracker-light.html`, `reports/1a-m.md`, `reports/stage1b-2026-07-11.md`) — leftovers, not a regen artifact, not a collision. Surfaced for your awareness; not self-resolved. |
| **G4 contradiction scan** | **1 conflict surfaced** | See below. Most Lane-P locks match the handoff verbatim (page order, duplication rule, lineage, quality pack, DNA re-slot, Now richness, cross-links, sparse states). Two items need your eye. |

### G4 findings

1. **⚠ THE ONE FORK — the "Questions section fences like arcs" lock.** The prompt locks:
   *"THE QUESTIONS SECTION FENCES LIKE ARCS: visitors see only questions belonging to fenced-visible
   arcs."* This is **not in the handoff** (handoff keeps "Questions" in the page order, L47, but does
   NOT re-scope it) and **contradicts R9a shipped reality on two grounds**:
   - **Underivable as worded:** the profile "Open questions" are CATEGORY field-tensions
     (`_pfQuestionsSection`→`_profileGaps`, views.js:17241/16899, reading `_profileCategoryAxis`
     16688 — GAP/THIN/RISING over categories+marginalia). **Zero arc reference** — there is no
     question→arc association in the profile-questions data. Arcs store only `title` (the constellation
     adapters substitute `question = arc.title`, views.js:11389/11497).
   - **Owner-only reversal:** questions render `pf-owner-only` (views.js:17323); `components.css:13634`
     `.pf-root.is-visitor .pf-owner-only{display:none!important}` and the visitor grid
     `components.css:13650` `.pf-root.is-visitor .pf-grid{grid-template-areas:"values numbers"}` — the
     visitor grid has **no questions area at all**. Visitors see **zero** profile questions today; the
     lock presupposes they see a fenced subset.
   - A genuine arc-scoped, visitor-visible questions mechanism DOES exist — but on the **commons/interact
     surface** (`buildOns {type:'question', targetArcId}`, integrations.js:2775; shown in `#walk` via
     `renderInteract`), NOT the profile.
   - **→ needs Preston's ruling (the one Stage-0 question).**
2. **AM11 valve — moot.** The prompt: *"the valve carried from R9a lands IN LANE P if it fires — its
   definition and trigger live in the handoff."* The handoff contains **no AM11 definition**, and the
   valve is **already discharged**: R9a shipped the FULL v5 build with **no split** — per-category cards
   are LIVE (`_pfNumbersSection` catgrid views.js:17220-17226; sky planets 17095+). The valve **cannot
   fire** in Lane P. **Determination carried:** Lane P's genuinely-NEW sections are **ARCS + LINEAGE
   only** — do NOT rebuild per-category cards.

## 0.3 — RECON-VERIFY (adversarially verified; 3 refuters + completeness critic, all against live source)

- **(a) Lineage — FEASIBLE, no new field (verdict: not refuted, high).** `valueMark = {value, why}`
  (state.js:420-425; sole write `marks.push({value, why:trim})` views.js:9200 — **no timestamp/order
  field**). `_profileValueLoad` already collects non-empty `why` per declared value across book/sub/arc
  marks (views.js:16807-16810, gathered 16816-16823) and renders them display-only (`_pfValueCard`
  17181). **Dedupe key = normalized why text** (trim+lowercase+collapse-ws); **order = frequency desc.**
  THREE honest holes (richness, not feasibility): (1) `whys[val]` **excludes orphaned/retired-value**
  whys (16811-16813 discards them to a count) → to gather ALL lines the row must **re-scan valueMarks
  directly** (same data, no new field), not reuse `whys[val]`. (2) `why` is free-form optional prose
  (9180) → distinct marks almost never share identical text → "most-cited" **degenerates to all-ties
  count=1** on real data. (3) **No secondary-order key exists in-shape** — ties fall back to scan order;
  a stable order would need a persisted timestamp = **the field that is banned**. Resolution = accept
  scan-order + **sparse-honest** (the handoff's own answer). Real-data richness is **unmeasurable from
  the repo** (lives in live Firestore; prestona255 read-only) — the felt pass on the retrofitted library
  validates it.
- **(b) Fencing — FULLY DERIVABLE, no new field, `arc.published` NOT needed (verdict: not refuted, high).**
  Sub published iff `st.status==='published'` (state.js:684-687, coerced; publishedAt 692-694). Owned
  subs `_pfOwnedSubs` (views.js:16625-16637, userId OR arc-owner). Owned arcs `state.arcs[aid].userId===uid`
  (16866). Per-arc published/draft counts = a one-line `&& st.status==='published'` over the shipped
  `_accountCountSubsInArc` pattern (15106-15114). `arc.published` (integrations.js:2560) is the SEPARATE
  commons opt-in — orthogonal; the lock uses sub-status by fiat. Display holes for the build (no field):
  **C1** deleted arc leaves dangling `st.arcId` (deleteArc doesn't re-home subs) → **anchor the listing on
  OWNED ARCS**, let `_profilePublished` flat listing catch orphans. **C2** prefer arc-anchored derivation
  over sub-bucketing. **C3 (product, flag)** commons `#reader` fences arcs by `arc.published` while the
  profile fences by ≥1-published-sub, and `buildPublishedArcDoc` exposes DRAFT subs' public bodies of a
  commons-published arc (integrations.js:2456-2464) — a two-axis coherence gap, not a field gap.
- **(c) Published-piece category — DERIVED from evidence books, falls to "Uncategorized".** `_profilePublished`
  → `cat:_pfSubCategory(st)` (views.js:16884). `_pfSubCategory` (16642) tallies the dominant category of the
  sub's **evidence books** (`_pfBookCat`), returning `CATEGORY_UNCATEGORIZED` ('Uncategorized', state.js:516)
  when none. **Today the card prints the dot+label unconditionally** (17276) → it WILL print "Uncategorized".
  The quality pack's omit-when-unknown keys off `cat === CATEGORY_UNCATEGORIZED` → drop dot+label. Not built.
- **(d) Excerpt — `_pfExcerpt(st.bodyPublic)`; needs a rewrite to skip quote BLOCKS.** `bodyPublic` is a plain
  markdown string (empty '' possible → graceful ''). `_pfExcerpt` (views.js:16663) **collapses all whitespace
  BEFORE the marker strip** (16665 then 16668) → it strips only a LEADING marker and **cannot skip a
  mid-body quote block**; a blockquote-opening body surfaces the quoted text. Lock = "first clean prose
  sentence, quote blocks skipped, clamped at word boundary" → **block-detection must move ahead of the
  collapse**, and the 118-char mid-word clamp (16671) → word-boundary clamp. Not built.
- **(e) P8 + P9 (v3.199 patch) — LOCATED (named regression gates).** **P8 (journey empty-row):** the
  `if(!data.length)→invitation-line` guard in `_pfReturnsSection` (views.js:17513), `_pfJourneySection`
  (17527), + the reader-model/threads third builder (`buildReaderModelSection` 15330, mounted whole into
  `#pf-yumi-mount`). **P9 (visitor+empty-statement omission):** `_pfBuildPage` 17315-17319 — statement
  present→shown to all; empty+owner→placeholder; **empty+visitor→section OMITTED**. (Code comments label
  these P8/P5 internally — the prompt's P8/P9 numbering differs; located by behavior, not label.)
- **(f) W9 intro hook — needs a `profile` ROUTE_INTRO key.** `window.Intros` (intros.js), `INTROS` 12-entry
  array (39-76) incl. `{id:'account', 'A portrait, not a scoreboard', eg:'(Copy provisional…)'}` (61-63).
  `ROUTE_INTRO` (558) maps hash-head→id but has **NO 'profile' key** → `introForHash('#profile')` returns
  null → **no panel fires on #profile today**. Hook = add `'profile'` key + finalize the provisional copy.
  **Two consequences the recon flags:** (1) the panel is **hash-driven only** (hashchange→panelForHash,
  639) — the preview-as-visitor toggle re-renders in place with **no hashchange** (views.js:17404), so the
  hash system **cannot suppress** the beat in preview; the "intro beat OWNER-ONLY" lock needs an explicit
  `!_pfPreview` gate at show-time. (2) `buildPanelInner` renders `p.id` as the visible panel name (578) →
  a new `profile` id is cleaner than reusing `account`.
- **(g) AM51 / AM52 / Now.** **Current DOM order** (`_pfBuildPage` 17311-17335): Statement →
  [grid: Values · Numbers · Questions(owner) · Now(owner)] → Returns(owner) → Journey(owner) →
  Yumi-mount(owner) → Published → Settings(owner). **Target AM51:** Statement → Values → Numbers →
  **ARCS(new)** → Questions → Now → DNA(returns/journey/threads) → **LINEAGE(new)** → Published → Settings,
  **consent panel Settings-adjacent.** **AM52 current fencing:** `pf-owner-only` on questions/now/returns/
  journey/yumi-mount/settings/offers/orphan/lens-catgrid/edit+preview; `vis` drives statement-omit +
  preview badge; Values/Numbers/Published take a `vis` param and fence internally. **Now content:**
  `_pfNowSection` (17263) → `_pfNowLine` (17248) = latest notebook entry → "Your reading is live in **X**
  right now." (minimal; R9b adds progress + latest-published cross-link).

### Completeness-critic gaps folded in
- **AM11 closed** (see G4-2) — Lane P new = ARCS + LINEAGE only.
- **DNA re-slot is a builder SPLIT, not a string move.** `buildReaderModelSection` bundles **consent +
  threads in ONE node** (15330; consent + threads), mounted whole (17332/17564). The lock wants threads
  after Now but **consent Settings-adjacent** = two positions from one function. It has a legacy caller
  defaulting to the retired `renderAccountPage` (15345) — but that page is defined-but-unrouted, so a
  display-layer split (two mount points / reposition the consent sub-node post-mount) is lower-risk and
  **stays within views.js display — no data change.** Flag at BUILD staging.
- **Arc-card "question" = `arc.title`** (11389/11497). If Preston expects a genuine interrogative distinct
  from the title → HALT fork (banned data change). Carried as the shipped convention unless he says otherwise.

## Byte sizes (files Lane P will touch)

| File | Bytes | Role |
|---|---|---|
| `js/views.js` | 933,896 | renderProfilePage + all `_pf*`/`_profile*` (grep→ranged only; never whole-read) |
| `assets/components.css` | 647,202 | `.pf-*` scoped rules; new CSS in `@media(min-width:1200px)` after base |
| `assets/theme.css` | 23,894 | tokens (read-only for values; add a token only with a comment if needed) |
| `js/intros.js` | 38,964 | W9 `window.Intros` — the profile intro hook |

HEAD = `419267c` · live = `praxis-v3.199` · ship target = `v3.200`.

## Ambiguities → the ONE Stage-0 question
The "Questions section fences like arcs" lock (G4-1). Everything else is a finding I carry or a
mechanical determination resolved in the mockup/build beats.

## NAMED DEBT (Preston rider, 2026-07-13) — carry to Lane-G handoff + close-out

- **COMMONS #reader DRAFT-SUB-BODY EXPOSURE (two-axis coherence).** The profile fences visitor arc
  visibility by **≥1 published sub** (this lane), but the commons/`#reader`/`#walk` path fences by
  **`arc.published`** and its projection `buildPublishedArcDoc` (integrations.js:2456-2467) filters child
  subs by `st.arcId` + non-blank header **but NOT by `st.status`** — so a commons-published arc projects
  the `bodyPublic` of ALL its non-blank subs, **including DRAFT-status subs**. A reader walking a published
  arc can therefore see the public body of a sub-theory the author still holds as a draft — content the
  profile's own fencing would hide. **Not Lane P's to fix** (integrations.js is READ-ONLY this session; a
  publish-time/projection change is a data/commons concern, R11 / FX-1 adjacent). Logged here per Preston's
  rider; **→ MUST be copied into `docs/studio/r9b-laneg-handoff.md` at P-SHIP so the round close-out inherits it.**

## LIVE FINDING (P-MOCKUP felt pass, 2026-07-13) — value-line legibility at 390

`_profileBuildSky` (views.js:17130-17139) emits value constellation lines **width-agnostically** (`mob` only
changes `w/h/pad/prad`), so live DOES construct them at 390 — but two limits make them read as absent there:
(1) `.pf-vline` is `opacity:0` until a value is tapped (`.on`), at BOTH widths; (2) **same-category value
pairs collapse** — geometry trace (owner fixture): Doubt ≈ **9px**, Praxis ≈ 22px at 390 (both subs cluster
around one planet, hidden behind the star glows), while the cross-category Liberation line is 143px @390 /
280px @desktop. So the deployed portrait reads line-less at 390 unless a cross-category value is tapped.
**Fix (Lane P, in scope — the portrait galaxy `_profileBuildSky` is R9b's to evolve per the handoff rails):**
render the value web **faint-by-default** (`.pf-vline` opacity ~.34, brighten to ~.78 on tap) in
components.css — cross-category lines read at both widths without a tap; tap still lights the tapped value.
Mockup updated; build applies the same one-line CSS change. (NOT the Lane-G "published-arc constellations"
feature — a legibility tweak to the existing value web only.)

### RESOLVED (Preston, Stage-0 halt) — Option A: "Arc cards carry it."
The profile **"Open questions" section stays OWNER-ONLY field-tensions** (R9a, byte-unchanged — no
re-scope, no un-fence). The "fences like arcs" intent is satisfied by the **question-LED arc cards**:
a visitor sees only arcs with ≥1 published sub, therefore only those arcs' questions. **No separate
Questions-section fencing work; no R9a reversal.** The arc-card "question" is `arc.title` (the shipped
convention, views.js:11389/11497) — carried as-is (a genuine interrogative field would be a banned
data change / HALT fork). This is the design lock Lane P builds against.
