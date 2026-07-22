FINISH-CHOREO S2 RECON STARTED

# FINISH-CHOREO S2 (THE THRESHOLD) — Stage-0 recon (read-only)

Praxis recon scout. Ground truth from live source only, this session. No app-code
edits, no commits. Spec: `docs/studio/finish-choreo-brief.md` D2 + S2 slice line.

## 0. Ground truth

- **HEAD** `36b7d45f38f1975acf8d6b15b096aebd80994e1a` — "docs(R-SHELF): brief v3 —
  THE FELT DIAL (splice diff-gate PASS) + SEQUENCE RULING v2 re-plan"
- **HEAD == origin/main** (`git rev-parse HEAD` / `origin/main` identical;
  `git fetch --dry-run` returned nothing new). Branch `main`.
- **sw.js CACHE_VERSION** = `'praxis-v3.240'` (sw.js:10) — matches S1's shipped
  FINAL-PASS stamp exactly (S1 commit `125d823`, "feat(v3.240): FINISH-CHOREO S1
  — the publish spine…"). **S1 is confirmed SHIPPED at this HEAD** — `bb2dcae`
  (brief) → `125d823` (S1 build) → `36b7d45` (docs-only, this session's starting
  point). No uncommitted S2 work exists; tree carries zero tracked modifications.
- **git status**: 105 untracked entries (the long-standing design/docs/checkpoint
  clutter, unchanged in kind from prior runs), **zero tracked modifications**
  (`git status --porcelain | grep -v '^??'` empty). Cleanest tree logged in
  several runs.
- **Foundation byte-locks:**
  - `assets/lumen-amber.css` = **14,966 B** (`wc -c`). This is the post-`124fe99`
    value, NOT the 14,681 B figure in this agent's own operating instructions —
    **flagged per instruction, but this is RE-CONFIRMED historical drift already
    logged across 3 prior recon runs (11th/12th runs, this run), not new
    breakage.** Do not treat as a fresh incident; the instructed baseline
    (14,681 B) is stale and should be updated at the source.
  - `assets/marks.js` = **10,255 B** — exact match, no deviation.
- `js/views.js` 22,728 lines · `js/state.js` 3,729 lines · `js/integrations.js`
  3,460 lines (`wc -l`, this session).
- `renderRoute()` NOT re-anchored this run (out of task scope — this recon is
  scoped to the sub-theory Finish surface only, not the router).

## 1. The Finish pill click — THE S2 TRIGGER

`renderSubTheoryBuild` (views.js:11485), the `.stb-pubpill` corner button.

**Exact click handler, views.js:11544-11565:**
```js
var pub = document.createElement('button');
pub.type = 'button';
function pubDone() { var r = state.subTheories[id]; return !!(r && r.status === 'published'); }
function pubIsBasin() { return _stIsBasin(state.subTheories[id]); }
function paintPub() {
  var basin = pubIsBasin();
  pub.className = 'stb-pubpill' + (pubDone() ? ' on' : '') + (basin ? ' is-dormant' : '');
  pub.textContent = pubDone() ? 'Finished' : 'Finish';
  pub.disabled = basin;
  if (basin) { pub.setAttribute('title', 'Name it to finish'); }
  else { pub.removeAttribute('title'); }
}
paintPub();
pub.addEventListener('click', function() {
  if (pubIsBasin()) { return; }
  var r = state.subTheories[id]; if (!r) return;
  if (pubDone()) { r.status = 'draft'; r.publishedAt = null; }
  else { r.status = 'published'; r.publishedAt = Date.now(); }
  r.updatedAt = Date.now();
  if (typeof markSubTheoriesDirty === 'function') markSubTheoriesDirty();
  saveState(); paintPub();
});
```
- The **FF-10/D8 basin-guard** (`pub.disabled = basin` + `title="Name it to
  finish"` + the click-guard `if (pubIsBasin()) return;`) is intact, triple-
  layered, re-confirmed this run — **do not rebuild it.**
- The click body is a **single if/else on `pubDone()`**: crossing IN
  (`!pubDone()`, → published) is the `else` branch at line 11561; crossing OUT
  (reopen, `pubDone()`, → draft) is the `if` branch at line 11560. S2's threshold
  must interpose **only before line 11561's branch fires** — the reopen branch
  (11560) stays untouched/instant per D2.
- **Exhaustive check — exactly ONE call site in the whole app flips a sub-theory
  to `'published'`:** `grep -n "status = 'published'" js/views.js` returns only
  line 11561. (`state.js:3630` has a literal `status: 'published'` but it is
  inside a worked-example/seed-data object literal, not a live user-triggered
  write path — confirmed by context, not a second trigger.) The Finish pill is
  the sole crossing-IN chokepoint S2 needs to guard.
- **`_pubOverlay()` reuse — CONCRETE, with a real fit problem (see §7b).** S1's
  shared overlay factory (views.js:20096-20116) returns `{scrim, panel, open,
  close}`: Esc/backdrop close, fade+slide, no scale, reduced-motion via CSS. It
  is content-agnostic — any caller populates `panel`. BUT `open()`/the factory
  hardcode `panel.className = 'pub-ceremony-panel'` (views.js:20100), and that
  class (components.css:14739-14747) is a **centered card, `max-width:420px`,
  `translateY` slide** — a modal dialog, not a full-screen surface. D2 requires
  "one quiet full-screen overlay." Reusing `_pubOverlay()` verbatim gives a
  centered dialog, contradicting D2's literal wording. See §7b (FORK-VERBATIM).

## 2. `ensureSubTheoryFields` / `ensureSubTheoryFieldsAll` — the schema chokepoint

`state.js:644-736` (`ensureSubTheoryFields`) / `state.js:742-754`
(`ensureSubTheoryFieldsAll`).

- **`answeringLine` is absent** — confirmed by full read of the function body
  (644-735) and a repo-wide grep (`answeringLine` = zero hits anywhere in `js/`
  at this HEAD). This is a genuine net-new field for S2.
- **The chokepoint pattern S2 should follow is already demonstrated twice in
  this same function** for other additive string/object fields with no schema-
  version bump: `citationPins` (state.js:677-683, "10.5.7") and
  `evidenceLayout` (state.js:684-689, "ROOM-1") were both added directly inside
  `ensureSubTheoryFields` with a comment citing their originating slice, NOT
  gated behind a new `SCHEMA_VERSION` step. `answeringLine` (typeof-check,
  default `''`) fits the same additive-string pattern as `header`/`bodyPublic`
  (state.js:647-654).
- **Both merge-path twins are confirmed wired, generically, already** — because
  the field will live inside `ensureSubTheoryFields` itself, both call sites
  pick it up automatically, with zero extra wiring:
  - **migrate() path** (localStorage): `ensureSubTheoryFieldsAll` called at
    state.js:3240 (SCHEMA 1.11.0→1.12.0), :3261 (1.13.0→1.14.0), and :3702
    (1.28.0→1.29.0, the R8 values step). All three are idempotent re-runs of
    the same chokepoint per the standing pattern (comment at :3236-3237
    explicit: "idempotent — re-running on already-migrated state is a no-op").
  - **Firestore-merge path**: `ensureSubTheoryFieldsAll(state.subTheories)`
    called at `integrations.js:301`, inside the sub-theories REPLACE-merge
    callback, with an explicit standing comment (integrations.js:294-299)
    naming this exact chokepoint as "the standing pattern for every future
    schema field." This is the "Firestore merge bypasses migrate()" lesson's
    own documented fix point — S2 rides it for free by editing
    `ensureSubTheoryFields` only, no second edit needed in integrations.js.
- **No SCHEMA_VERSION bump is required** — matches the citationPins/
  evidenceLayout precedent exactly (both additive, no version step).

## 3. `st-room-threshold` — the standing label S2 replaces

**views.js:11194-11199** (inside `renderSubTheoryPage`, published branch only):
```js
if (published) {
  var stThreshold = document.createElement('p');
  stThreshold.className = 'st-room-threshold';
  stThreshold.textContent = 'entering the finished room';
  wrap.appendChild(stThreshold);
}
```
- Line drift from the S0 recon's cited 11190-11194 → now 11194-11199 (+4 lines,
  intervening comment growth). Re-grep before building.
- CSS: `components.css:11867-11871` — a mono-uppercase eyebrow with flanking
  `::before`/`::after` 1px rule-lines (`.st-room-threshold::before/::after`),
  sized for a short fixed label (~24 chars). **A user-authored answering-line
  sentence of arbitrary length will not fit this recipe as-is** — worth a build-
  time CSS pass, not just a text swap (flagged, not decided here).
- **Scope confirmation — do NOT touch the visitor twin.** A second, textually-
  similar but CSS-and-DOM-independent label exists: `.room-threshold` inside
  `renderInteract` (the visitor's published-read room), rendered around
  views.js:20451 area (`itx-root .room-threshold`, components.css:13371-13374,
  "You've entered a published reading room"). D2/D1 scope is A1 (author Finish)
  only — this visitor-facing copy is out of S2's scope and uses a different
  class (`.room-threshold`, not `.st-room-threshold`); confirm the build touches
  only the `.st-room-threshold` selector.
- **Mobile step-down** at components.css:11926-11928 only pads the label at
  ≤759px (no display:none) — confirm any longer answering-line text still
  clears P9/mobile-canon wrapping checks once real copy lands.

## 4. The arc's central question — VERBATIM source

**There is no separate `arc.question` field stored on the arc record.**
`ensureArcFields` (state.js:766-807) backfills `title`, `description`,
`bookIds`, `entryIds`, `valueMarks`, `status`, `originEntryId` — no `question`
key anywhere.

- `arc.question` DOES appear as a **read**, in `arc-constellation.js:1207`
  (`_stRenderQuestion(arc.question || '', ...)`) — but that's the SVG field
  renderer's data-contract key name, fed by a transient adapter object built at
  render time, not a persisted property.
- The adapter: `views.js:12327-12332` builds `{ question: (arc && arc.title) ?
  arc.title : '', books: …, threads: [], yumiNoticing: [] }` — i.e. `question`
  is `arc.title`, remapped, for the constellation renderer only.
- **The canonical, self-documented statement** is at `views.js:13577-13579`,
  inside `renderArcDetail`'s head-block comment: *"Head (mock .arcfield-head):
  .t block (eyebrow + the question + a computed sub-meta line)… **arc.title IS
  the question (no separate field)**."* The live render (views.js:13591-13603)
  sets `title.textContent = arc.title` (or `'Unnamed'` with an
  `arcfield-q-unnamed` modifier class when blank — R-ARC S3's ember-may-be-
  unnamed rule).
- **S2's threshold headline** must therefore read `state.arcs[subTheory.arcId]
  .title`, with the SAME blank-title handling the arc-detail head already uses
  (fall back to "Unnamed", never an empty `<h1>`) — this is the one existing
  precedent to match, not a new decision.

## 5. The private marks/chips source — "What stays yours / What travels"

**The deterministic, already-live filter is `evidencePrivate()`,
views.js:10932-10936**, inside `renderSubTheoryReadOnly`:
```js
function evidencePrivate(el) {
  if (!el || el.kind !== 'entry') { return false; }
  var en = state.notebookEntries && state.notebookEntries[el.refId];
  return (!en) || en.isPrivate === true;
}
```
Applied at views.js:10938-10944: `evidence` items of `kind:'entry'` whose
referenced `state.notebookEntries[refId].isPrivate === true` (or the entry is
gone) are dropped from the PUBLISHED read; DRAFT keeps all. This is the
single source of truth for "which of this sub-theory's evidence is private" —
`isPrivate` itself lives only on `notebookEntries` (journal/marginalia/question
registers); books and external sources are never private (comment at
:10930-10931, "Books and external sources are never private").

**For S2's sweep**, iterate `subTheory.evidence[]`, partition by
`evidencePrivate(el)`:
- **"What stays yours"** = entries where `evidencePrivate(el)` is true (private
  or orphaned notebook entries).
- **"What travels"** = the rest (`kind:'book'`, `kind:'external'`, and
  non-private `kind:'entry'`).
- Show the sweep step **only if the private set is non-empty** (D2: "ONLY if
  private marks/chips exist on this sub-theory") — a direct
  `evidence.length`-after-filter check.

**`attachedMarginalia[]` is a red herring, confirmed dead-write.** It is a
parallel array of raw notebookEntry ids on the sub-theory record
(`ensureSubTheoryFields`, state.js:663-666; `createSubTheory`, state.js:2192).
Exhaustive grep (`attachedMarginalia\.push|attachedMarginalia\s*=\s*\[|
attachedMarginalia:\s*\[`, repo-wide) finds **only its two zero-value
initializations** — no live code path ever pushes an id into it. It IS read
by two unrelated display-only aggregations (`rootedSubTheories`,
views.js:8973-9004; the Shelf "alight" computation, views.js:5836-5855), but
since it's never populated, those reads are permanently no-ops in practice.
**Conclusion: the sweep should enumerate `evidence[]` only** (matching
`evidencePrivate()` exactly); `attachedMarginalia` needs no privacy handling
because nothing ever populates it — flagged for awareness, not a build task.

## 6. The reopen path — confirmed instant, ceremony-free

**views.js:11258-11275**, inside `renderSubTheoryPage`'s published branch:
```js
var stReopen = document.createElement('button');
stReopen.type = 'button';
stReopen.className = 'st-pill-publish done';
...
stReopen.addEventListener('click', function() {
  var r = state.subTheories[id];
  if (!r) { return; }
  r.status = 'draft'; r.publishedAt = null; r.updatedAt = Date.now();
  if (typeof markSubTheoriesDirty === 'function') { markSubTheoriesDirty(); }
  saveState();
  renderSubTheoryPage(id);
});
```
Line drift from the S0 recon's 11254-11271 → now 11258-11275 (+4). Zero
confirm, zero overlay, immediate re-render. This is the Page's reopen pill
(distinct DOM/handler from the Build workshop's own pubDone()-branch reopen at
views.js:11557-11565, §1 above) — **two independent reopen call sites exist**
(Page pill + Build pill), both instant, both correctly out of D2's ceremony
scope (ceremony marks the crossing IN only, "REOPENING is instant, no
ceremony").

## 7. Named laws to cite, files owned, and forks

### 7a. Ratified motion laws (cite, do not reinvent)

- **R-POLISH L4 "the Drag Law" — SHIPPED, live, re-confirmed this run**:
  `components.css:12237-12284` (`.st-build.lum-amber-deep .rf-card*`), tokens
  `--dur-fast`/`--dur-gentle`/`--ease-standard`/`--ease-emphasis`
  (praxis-kit.css:36-37, `--ease-emphasis:cubic-bezier(.34,1.2,.5,1)`). Uses
  `transform:scale(1.03)` on `.rf-dragging` (line 12265) — this is the field's
  drag-card surface, a DIFFERENT UI element from the ceremony; D4 forbids
  scale() specifically **inside the ceremony**, not app-wide — no conflict, but
  do not cite L4's scale usage as license for the threshold overlay.
- **Mobile canon P9 "Motion restraint"**
  (`docs/studio/praxis-mobile-canon.md:177-192`, full text read this run):
  "motion vocabulary is exactly two moves — opacity fades and the sheet's
  slide-up… Nothing else animates… No transform-rig tokens, ever (standing
  rail)." D4 already codifies this for the ceremony specifically.
- **`_pubOverlay()` motion contract** (views.js:20094-20095 comment + CSS
  components.css:14732-14747/14766-14768): fade scrim (opacity transition) +
  slide panel (`transform:translateY`, NOT scale), reduced-motion
  `transition:none`. This is the concrete, already-shipped implementation of
  D4/P9 for THIS kind of overlay — the pattern to extend, not redesign.

### 7b. Files S2 owns + the overlay-reuse fork

Per the brief line 17: `integrations.js` is NOT listed for S2 (only S1/S3
touch it); **S2's stated file set is views.js + state.js + components.css**,
which the task brief also states. Confirmed by code: nothing in
`integrations.js` needs to change for S2 — `ensureSubTheoryFieldsAll` is
already called generically at integrations.js:301 (§2), and no other
integrations.js write path touches sub-theory status.

**⚖ FORK-VERBATIM candidate — the overlay shape.** `_pubOverlay()`
(views.js:20096-20116) is the only existing full-screen-scrim ceremony
primitive, and its mechanics (Esc/backdrop close, fade+slide, reduced-motion
CSS, kit tokens) are exactly what D4 asks for. But its `panel` is hardcoded to
`.pub-ceremony-panel` — a **centered 420px-max-width card**, not "full-screen."
D2's literal text: "one quiet full-screen overlay — never stacked modals."
Two honest paths exist and were NOT adjudicated by this recon:
1. **Parameterize `_pubOverlay()`** to accept a panel class name (e.g.
   `_pubOverlay('threshold-panel')`), add a new full-screen CSS recipe under a
   new class, sharing the scrim/Esc/backdrop/fade JS verbatim.
2. **Build a second, dedicated overlay factory** for the threshold, duplicating
   the scrim/Esc/backdrop/fade mechanics with full-screen CSS from the start,
   leaving `_pubOverlay()`/`.pub-ceremony-panel` untouched for the publish
   ceremony.
Both are legitimate engineering choices with different collision profiles
(shared code vs. duplicated mechanics) — per CLAUDE.md's FORK-VERBATIM hard
rule (a recon-named fork reaches Preston verbatim, never silently resolved),
this is named here for Preston's call, not decided.

### 7c. A second build-time fork: how `answeringLine` gets written

`updateSubTheory(id, fields)` (state.js:2219-2230) is a **narrow allowlist** —
it only writes `header`, `bodyPublic`, `bodyIntellectual` onto the record; any
other key in `fields` is silently dropped (no passthrough, no fallback). Both
existing status-flip call sites (the Finish pill, views.js:11557-11565; the
reopen pill, views.js:11267-11274) bypass `updateSubTheory` entirely and
mutate `state.subTheories[id]` directly + `markSubTheoriesDirty()` +
`saveState()`. S2 must pick one of: (a) extend `updateSubTheory`'s allowlist
to include `answeringLine`, or (b) write `subTheory.answeringLine` directly in
the ceremony's confirm handler, matching the direct-mutation pattern the two
neighboring status-flip sites already use. Not FORK-VERBATIM tier (no data-loss
or scope-fork implication either way — both are mechanically identical writes
to the same field) but worth naming so the build session doesn't invent a
third pattern.

## 8. Doc-vs-code drift flagged this run

- **`docs/launch-runway.md` row 5** (line 43, "commons `#reader` fencing")
  is still literally labeled **"open"** in its status column, and its own body
  text says the row "CLOSES as a VERIFIED side effect — it flips only when the
  filter provably ships and is red-teamed." **The filter has shipped
  (`integrations.js:2527-2528`, `st.status === 'published' &&`, confirmed live
  this run) and has been red-teamed twice** per
  `docs/checkpoints/finish-choreo-s1.md`'s FINAL-PASS block ("RED-TEAM: CLEAN"
  logged twice, 2026-07-21). The row has not been flipped. This may be
  deliberate — the S1 checkpoint's own "S2 OPEN QUESTION" (a frozen arc whose
  published sub is later reopened to draft keeps its stale frozen public entry)
  is an unclosed vector under the same gate-5 umbrella, and S2's D2 scope
  doesn't obviously cover it either (D2 is about the Finish ceremony, not
  frozen-arc republish semantics) — flagged as an open status ambiguity, not
  asserted as a bug.
- No other doc-vs-code contradiction found touching S2's scope this run
  (CLAUDE.md, PROTOCOL.md version, BUILD_STATE stamps not re-audited this run —
  out of this task's narrow scope; last full audit logged in
  `anchors_confirmed.md` 4th run remains the standing citation for those).

## 9. Honest residuals

- Line numbers throughout §1/§3/§6 have drifted +4 to +5 lines each versus the
  S0 recon's citations (intervening comment/code growth from S1's shipment) —
  re-grep immediately before any edit, do not carry these forward past this
  session.
- The `.st-room-threshold` CSS recipe (§3) was not evaluated against a real
  long sentence — flagged as a probable but unconfirmed visual-fit issue, not
  measured.
- The `attachedMarginalia` dead-write finding (§5) was reached by grep
  exhaustiveness (three literal patterns covering initialization, assignment,
  and object-literal declaration) plus reading both of its two read call
  sites — a `git log -S attachedMarginalia` historical check was NOT run this
  session; if it was ever populated by code since removed, that history is
  unexamined (irrelevant to current behavior either way, since the live field
  is provably always empty on any record built by current code).
- `renderRoute()` was not re-anchored (out of this task's scope) and BUILD_STATE
  staleness was not re-audited this run — both stand from prior recon citations
  only, do not cite this session as their source.
- No live/browser verification performed (read-only static recon only, per
  role) — the CSS-fit and overlay-shape findings above are code-and-token-level,
  not felt-pass-level; Preston's felt pass at 1360/390 remains the actual gate
  once S2 is built.

STOP.

---

## RULED (Preston, 2026-07-21) — the two forks §7b/§7c named above

Recorded here at the recon itself (FORK-VERBATIM: a recon-named fork's ruling lands where the
fork was named, not only in the build checkpoint). Presented cold, one at a time; ruled between.

- **§7b (overlay shape) → RULED A1.** Parameterize `_pubOverlay()` with **one** variant-class
  argument and reuse the proven scrim/Esc/backdrop/fade+slide engine; add a **distinct, quiet,
  full-screen** threshold skin (NOT a scaled-up publish card): the arc's central question as the
  headline, the answering line, Finish / Not yet. (Option 2 — a separate factory — rejected.)
- **§7c (answeringLine write) → RULED B1.** Direct-mutate at the Finish site with the **full
  sibling sequence** (mutate → `markSubTheoriesDirty()` → `saveState()`), matching the neighboring
  status-flip; **`updateSubTheory`'s allowlist is left UNTOUCHED.** (Option a — widen the
  allowlist — rejected.)

Build against these + brief D2. Executed this session; see `docs/checkpoints/finish-choreo-s2.md`.
