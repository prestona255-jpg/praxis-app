# Wave 8 · Lane A — The Living Field — STAGE 0 RECON (read-only)

**Repo state:** HEAD `972fed6` == origin/main. `sw.js` CACHE_VERSION = `praxis-v3.169`
(sw.js:10). Byte-locks exact: `assets/lumen-amber.css` 14,681 B (MD5
`9879ddb83a7e68e8378c621e473b0a57`), `assets/marks.js` 10,255 B (MD5
`772886c049d0d6d03d341507e602d88a`). Render rig: PowerShell static server up on :8760
(launch config `praxisapp`); Claude_Preview CDP confirmed — at width 390
`matchMedia('(max-width:759px)')` = **true**, `clientWidth`/`innerWidth` = 390; at 1280
the app shell renders (`praxis · HOME SHELF ARCS NOTEBOOK ABOUT … Welcome back`).

Evidence base: 6-agent workflow (5 praxis-recon census agents + 1 praxis-reviewer
adversarial verify), 270 tool calls, cross-verified. Verify confidence: HIGH; every
spot-checked file:line reproduced its quoted code; one real omission caught (Reset, below).

---

## ★ HEADLINE — the brief's premise is stale

The brief opens: *"converts the arc INTERIOR (#arc/<id>) from the shipped umber
arc-constellation to the 'living field' design in the Amber system."* **Ground truth: the
Living Field already shipped (Wave 1).** The live interior is already `.arcfield.lum-amber`
(views.js:11440), with the marker `/* WAVE 1 · THE LIVING FIELD (renderArcDetail on
.lum-amber) */` at components.css:11574–11684. The "umber arc-constellation"
(`renderArcConstellation`, arc-constellation.js:404) is **dead code** — zero live callers,
superseded at Stage 9.5. Most of the Stage-1 manifest is therefore **already built**.

---

## 1. Layout manifest / render path (#arc/<id>)

- **Route dispatch:** `renderRoute()` (views.js:343) → views.js:545 `if (parts[0]==='arc'
  && parts[1])` → `renderArcDetail(parts[1])` at views.js:553. (`#arc/<id>/new-subtheory`
  matched earlier at views.js:506.)
- **Sole DOM builder:** `renderArcDetail(arcId)` — views.js:**11376–11878**. Root wrap
  `.arcfield.lum-amber` (11440) → `#app`. Not-found guard 11397; combined
  ownership/logged-out guard 11410; reads face pref `praxis_arc_face` (11433).
- **Three faces** (`praxis_arc_face` = field | read | page, toggle at views.js:11560–11565):
  - **FIELD** (default) — inline 11593–11838. Builds container
    `.arc-detail-web-view.cstl-host #arc-field` (11601), holds the SVG constellation + two
    control bars, inside `.arcfield-stage` grid (11841) beside the rail aside. Whisper card
    `#arcfield-whisper` (11849) hidden until a mark is tapped.
  - **READ** — `_arcFieldReadFace(arc)` (11879–11971): a deterministic *threads list* view.
    ⚠ NOT the "honest Yumi-reading-unavailable placeholder" the manifest asks for.
  - **PAGE** — `_arcFieldPageFace(arc, arcId, user)` (11972–12025): hand-off card routing to
    `#subtheory/<id>/build` (the real W3 writing surface); focal mark via `bookSubMarkHTML`
    (which *does* use PraxisMarks.render). Matches manifest intent.
- **Rail:** `buildArcFieldRail(arc, arcId, user)` (11278) — "Books in this arc" (read-only
  rows, `.mc` cover chip `display:none` at all widths) + "Notes in this arc" (navigable) +
  `+ Add a sub-theory` (logged-in).
- **Ask-Yumi:** `buildArcVoiceAffordance(arcId)` (11253), appended if(user) at 11585 →
  `requestArcVoice` → `YumiBrain.considerArcVoice`; fallback string at 11216.
- **Live mark/interaction renderers (all reused, none umber):**
  `window.renderSubTheoryConstellation` (arc-constellation.js:1223; called views.js:11808),
  `window.attachSubTheoryDrag` (arc-constellation.js:1354; called 11823),
  `_stConstellationAttachInteractions` (views.js:10606; called 11816).
- **Marks drawn by:** arc-constellation.js's own `_ST_MARK_TABLE` (870–887, "the frozen
  sixteen marks copied VERBATIM from docs/mockups/praxis-marks-16-spec.html") via
  `_stRenderShapes` (898–967). **Not** PraxisMarks, **not** tradition-forms-arc.

### Dead code on this route (flag only — do NOT delete; out of scope)
- `renderArcConstellation` (arc-constellation.js:404) — 0 callers.
- `_arcRenderBooks` (arc-constellation.js:270) — only called by ^dead.
- `_arcDetailBuildConstellationData` (views.js:10389) — 0 callers.
- `_arcConstellationAttachInteractions` (views.js:10888) + helper chain — 0 callers
  (superseded by `_stConstellationAttachInteractions`).

---

## 2. Feature inventory (verified against committed code)

| # | Feature | Wired? | Anchor | Persistence |
|---|---------|--------|--------|-------------|
| a | Drag-to-arrange | ✅ | attachSubTheoryDrag arc-constellation.js:1354; onCommit views.js:11832 | `setSubTheoryPosition(id,x,y)` state.js:1961 → x/y + markSubTheoriesDirty+saveState |
| b | Connect-two → thread | ✅ | Connect btn arc-constellation.js:1725; onLink views.js:11829 | `linkSubTheories(a,b)` state.js:2099 (symmetric `linkedSubTheories`) |
| c | Attach-a-book | ❌ | — | **Not wired, deliberate** (F-D1 ruling views.js:11276; books join an arc from book-detail). Books render as inert squares (`_stRenderBooks` arc-constellation.js:1176) → click routes to #book/<id> |
| d | Hover card | ✅ | showCard arc-constellation.js:1641 (desktop, !isTouch) | ephemeral; title + maturity word + gathered count + Open/Change-mark/Unlink/Delete |
| e | Legend (5 items) | ✅ | `<g data-st-legend>` arc-constellation.js:1117 (static SVG, no CSS) | 2 of 5 visually dormant in live data: *faint* (no edge sets faint:true) & *incorporated* (evidence always state:'gathered') |
| f | Ask-Yumi entry | ✅ | views.js:11267 → requestArcVoice | remote/generative; if(user) only |
| g | Books-in-arc rail | ✅ | buildArcFieldRail views.js:11278 | read-only |
| h | + Add a sub-theory | ✅ | rail btn views.js:11364 (the live one) | nav → #arc/<id>/new-subtheory. (header btn 11504 gated `arcFace!=='field'`; control-bar btn 11634 built but never appended) |
| i | Thread visual states | ✅ | resonance=solid tan line (arc-constellation.js:1090); faint=dashed (built, dormant) | runtime CSS classes |
| j | Maturity → visual | ✅ | `_stLuminosity(sub.maturity)` arc-constellation.js:780 → **halo opacity [0.32,0.62]** | maturity NOT stored — computed `_stComputeMaturity` views.js:10528 = clamp01((|bodyPublic|+|bodyIntellectual|+80·|evidence|)/1500) |

**Extra wired behaviors** (beyond the named 10):
- Muted↔colorful palette toggle (views.js:11757, `praxis_constellation_palette`) — switches mark anatomy.
- Layers popover: Books / Marginalia / Faint switches (views.js:11746) — flip an SVG attr, CSS fades the group, no re-render.
- Concentrate/dim focus mode: click mark → `markConcentrate`/`markRelease` (views.js:10743); focal/linked/dim opacity at components.css:11625–11627.
- Keyboard parity via `_arcMakeFocusable` (views.js:10868); evidence-dot click routing (10811).
- Unlink/Delete from hover card (arc-constellation.js:1589).
- **⚠ Reset button (views.js:11673)** — *caught by adversarial verify, missed by census.*
  Bulk-clears **every** sub-theory position in the arc: loops `setSubTheoryPosition(k,null,null)`
  → **persisted, destructive** Firestore write-through. Functionally the opposite of Tidy.
- **Tidy / Restore (views.js:11653–11661, `praxis_arc_tidy`)** — opt-in session compose;
  nulls only the transient view-model (11801), so Restore brings stored placements back. This
  **is** the manifest's "opt-in compose + Restore," already built (distinct from Reset).

---

## 3. Data accessors

- **Arc** (state.js:1765): `{id,userId,title,description,bookIds[],entryIds[],createdAt,updatedAt}`
  — **no `subTheories` field.**
- **Sub-theory** (state.js:1910): `{id,arcId,userId,header,bodyPublic,bodyIntellectual,
  evidence[],attachedMarginalia[],linkedSubTheories[],citationPins{},status,format,
  publishedAt,x:null,y:null,createdAt,updatedAt}`. `markShape`/`markColor` = optional 0–15
  ints, added **only** by the symbol picker; absent at creation.
- **"Arc's sub-theories"** = never stored; `_arcDetailBuildSubTheoryData(arc)` (views.js:10435)
  filters the flat `state.subTheories` dict by `arcId`, sorts oldest-first, and derives
  `subTheories[] + edges[] + books[]` fresh each render (returned shape views.js:10514).
- **Mark data:** stable-from-id via `_stIdentityHash` (FNV-1a+avalanche, arc-constellation.js:526)
  → `_stIndices` (546: shapeIdx=hash(id,11)%16, colorIdx=hash(id,17)%16) → bridge
  `window.stHashIndices` (1835). Per-sub `{markShape,markColor}` override wins when present.
  **Write:** only `openSymbolPicker`'s `save()` (views.js:8015), direct mutation of
  `state.subTheories[id]`; "Auto" deletes the field.
- **Threads:** bare symmetric `linkedSubTheories` id-array; no edge object/strength/label.
  edges re-derived each render (views.js:10482).
- **Maturity:** never stored; recomputed each render (views.js:10528).
- **Positions:** `x/y` genuinely persisted (state.js:1961). Tidy nulls view-model only;
  Reset nulls the record.

---

## 4. Responsive baseline (≤759)

- Live-governing block: **components.css:11675–11683** (`.arcfield.lum-amber` …):
  (1) `.arcfield-stage` grid `1fr 220px` → `1fr` (rail **stacks below** the SVG);
  (2) `.arcfield-head` → `flex-direction:column`; (3) page padding 24→16px; (4) 44px
  min-height tap targets on seg-opt / toggle / addsub / delete.
- Shadowed legacy dupe: components.css:10178 (`.arcfield .arcfield-stage{1fr}`), inert.
- Constellation SVG is fluid via fixed `viewBox="0 0 600 500"` + `width:100%;height:auto`
  (components.css:11606) — scales, never structurally reflows.
- **Rail** = `.arcfield-rail` (NOT "arc-books"); stacks below in normal flow, wraps text,
  no scroll container. **No horizontal-scroll risk found** (grep: 0 `overflow-x`/`nowrap`
  in any `.arcfield*`/`.arc-detail-*`/`.st-*` selector; content capped `max-width:1080px`).
- Control-bar / layers / tooltip chrome: **zero** ≤759 rules (by design, canon §4-H).
- **Stage-1 responsive call:** keep the baseline behavior — **rail stacks below** (no drawer;
  lowest risk, already the shipped reflow).

---

## 5. VERDICT A — convert in place vs. mount a new field renderer

**RECOMMEND: convert IN PLACE.** There is no umber constellation to replace — the interior
is already the lum-amber Living Field via `renderArcDetail`'s Field face +
`renderSubTheoryConstellation` + `_stRenderShapes`, which already deliver unique marks,
maturity halos, drag, connect, concentrate, hover, rail, faces, and a 759 reflow. Mounting a
new renderer would duplicate every wired behavior and re-introduce the exact regression risk
Wave 1 already retired. The brief's own expected dirty set (views.js, components.css,
arc-constellation.js "only if verdict A in-place") aligns with in-place. Work reduces to
**refinement/gap-closure** within the existing Field face + arc-constellation.js renderer +
the components.css lum-amber block.

## 6. VERDICT B — renderer unification (marks via PraxisMarks.render; drop tradition-forms-arc.js)

**RECOMMEND: do NOT unify onto PraxisMarks; keep `_stRenderShapes`. Unification is
INFEASIBLE without editing byte-locked marks.js — and unnecessary.**

- **tradition-forms-arc.js is already out of the mark path.** Its `renderTraditionFormArc`
  (renders *book traditions*, not sub-theory marks) is dead — only called from the dead
  `renderArcConstellation`. So "drop it from this render path" for marks is *already true*.
- **But the file is NOT droppable:** `getTraditionFormsArcDefs()` **is called live** at
  arc-constellation.js:1266 by `renderSubTheoryConstellation` for shared tradition-neutral
  `<defs>` (tfa-ground, tfa-innerL, tfa-qhalo, tfa-shine). It stays a load-bearing global
  script (and the brief's non-goals forbid deleting it anyway).
- **Routing interior marks through `PraxisMarks.render(shapeId,colorIdx,cd)` is infeasible
  without editing marks.js** (byte-locked). Gaps marks.js cannot express, each required by
  `_stRenderShapes`: (1) maturity-driven blurred halo `<circle>` behind the body; (2)
  muted↔colorful dual anatomy; (3) nested `<g transform>` drag/drift/scale composition the
  drag layer + CSS drift depend on; (4) per-mark evidence dot sub-layer; (5) marks.js returns
  an HTML `<span>/<svg>` fragment that can't be injected into the constellation's single-SVG
  `innerHTML` without a `<foreignObject>` (the WebKit blur trap this codebase avoids).
- **The current renderer already satisfies the contract's spirit:** unique mark per
  sub-theory, stable-from-id, per-sub `{markShape,markColor}`, per-instance radial gradient +
  hue-matched halo, maturity→glow. The 16-mark *vocabulary* is identical to marks.js's
  (verbatim copy). Unification would **regress** capability, not add fidelity.

⚠ **Contract tension for Preston:** the standing contract says *"Marks render via
PraxisMarks.render"* and Stage 1 says *"every sub-theory = its unique PraxisMark (real
marks.js)."* The live interior does **not** call marks.js for field marks (it uses the same
16-mark vocabulary via `_stRenderShapes`). Given Verdict B, the honest read is *keep
`_stRenderShapes`* — but that is a literal divergence from the contract wording that Preston
must rule on.

---

## 7. Doc / drift findings (flag only — read-only; not this patch's to fix)

1. **MEDIUM** — CLAUDE.md "File load order" lists `arc-constellation → tradition-forms-arc`,
   but index.html:46–47 loads **tradition-forms-arc BEFORE arc-constellation** (load-bearing:
   arc-constellation.js:10–11 requires it first). CLAUDE.md order is backwards; also omits
   spotlight.js / writing-canvas.js / import-capture.js.
2. **LOW** — BUILD_STATE.md:161 reportedly still marks Stage 7.1B (renderArcConstellation)
   shipped without noting the Stage-9.5 supersession (per memory; not re-read this run).
3. **LOW** — marks.js:4 doc-comment calls `markShape` a string "01".."16"; stored state is a
   0–15 int everywhere. views.js:6768 is the correct int→string adapter (not a bug).
4. **INERT** — `cstl-host` class applied at views.js:11601 has no matching `.arcfield` CSS
   rule (only `.home-preview .cstl-host` exists). Dead class, not a hazard.
5. **INERT** — shadowed legacy media block components.css:10178.

---

## STAGE 0 CLOSE — HALT

Premise contradiction (§Headline) is the one blocking ambiguity. Awaiting Preston's scope
ruling before any Stage-1 build. No edits, stages, or commits made.
