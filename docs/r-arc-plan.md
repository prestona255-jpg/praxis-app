# R-ARC — FULL BUILD PLAN

**Status:** AUTHORED 2026-07-15, at the SHAPE-B felt verdict. **NOTHING BUILT. HALTED.**
**The build fires only on Preston's fresh, explicit word, per slice.**
**Trigger idiom:** "Execute <slice> from docs/r-arc-plan.md".

**Governance:** `docs/studio/r-arc-brief.md` (v4, constitution) > `docs/studio/r-arc-shape-b-decisions.md`
(locked decisions D1–D20) > this plan. This plan is authoritative for **slicing, scope, and gates** only.

**Felt verdict carried in (2026-07-15):** the writing surface **PASSES** — it felt good to write in.
**`EMBER` is LOCKED** as the young/unnamed **arc** noun (the luminous register won; "seedling" retired).
With F1's mote/basin, the vocabulary is now closed:

| Concept | Word | Status |
|---|---|---|
| A young / unnamed **arc** | **EMBER** | LOCKED 2026-07-15 |
| An unnamed **sub-theory** (visual) | **MOTE** | LOCKED (F1) |
| The gathering structure that accretes | **BASIN** | LOCKED (F1) |
| ~~seed / seedling~~ | **FORBIDDEN** | as user-facing noun AND schema key (F1) |

⚠ **`_arcMaturityWord()` prints the literal `'seed'` on screen today** for zero-sub-theory arcs
("0 sub-theories · seed"). EMBER's landing **must** retire that string, or the forbidden noun ships
beside its own replacement. Carried as a named gate in Slice 3.

---

## 0. What recon changed (read before slicing — three premises moved)

**(a) ⚠ REQ#7's silent block: my hypothesis was FALSIFIED, and the real cause is worse.**
I guessed `createSubTheory` returned `null` into a swallow. Wrong on both counts:
`notebookCreateSubTheory()` guards *before* the call (`if (!ids.length || !arcId ||
!state.arcs[arcId]) { return; }`), and the button is correctly disabled (`createBtn.disabled =
!canCreate()`). A disabled `<button>` never dispatches `click` — mechanically airtight.

**The real block is at the CSS layer.** `components.css` carries 12 `[disabled]` selectors; **none**
is `.btn` / `.btn-primary` / `.createbtn`. All three rules painting this button are unconditional, and
`.btn`'s base hardcodes `cursor:pointer`, which as an author style **beats the browser's default
`disabled → cursor:default`**. Net: **a disabled "Create sub-theory →" is pixel-identical to an enabled
one** — full gold gradient, pointer cursor, no dimming, no class swap. Preston clicked a button that
looked completely alive. `git log -S"canCreate"` confirms this has been true since the flow shipped
(`e46bd1b`) and has never had disabled styling.
**This is a whole-app defect wearing a Notebook costume** — every `.btn-primary` in Praxis has an
invisible disabled state. Slice 1 fixes the law, not the instance.

**(b) REQ#8 is nearly free.** Captured notes **are already indexed** — both `⌘K` spotlight and the
`#search` route index `notebookEntries` across all three registers. The real gap is that **neither
deep-links to a note** (both route to a bare `'#notebook'`). REQ#8 collapses from "build search" to
"build a note deep-link." *(Also found: spotlight matches `en.title`, a field that does not exist on the
schema — dead code.)*

**(c) REQ#1's Room half contradicts a risk this codebase already assessed and acted on.**
`writing-canvas.js`'s own header names the live as-you-type inline transform **"DEFERRED (highest caret
risk)"** — and that was for the *simpler* case of `**bold**`/`*italic*`. `wcRenderMarkdown` is a
**destructive rebuild** (`innerHTML=''` then re-walk) and is **never** called from `onInput`; the only
paths that do call it (load/`setValue`/undo-redo) already accept **"caret jumps to end of document"** as
the price. Every existing inline citation in Praxis lights in a **read-only** render
(`parseCitations` → `renderSubTheoryReadOnly`), never in the live editor — even `weaveNote` inserts
**plain text**. Building Room lighting the obvious way risks caret destruction *and* feeding decorated
`<span>` DOM back through the markdown serializer — **silent corruption of Preston's saved text**.
→ **Slice 6 opens with a SPIKE. The Room half does not get built until the spike proves a
non-destructive technique.** This is the plan's single largest risk.

---

## 1. STANDING TRIPWIRES — every slice, no exceptions

| # | Tripwire | The trap | Proof required |
|---|---|---|---|
| **T1** | **STATUS-COERCION (F3)** | `ensureSubTheoryFields` coerces any `status` ∉ {`draft`,`published`} → `'draft'`. A third sub-theory status is **silently erased on BOTH load paths** — it would appear to work, then vanish on reload. | EMBER status is an **arc** field ONLY. Grep proof that no sub-theory status value was added. The basin is a **structure**, never an enum. |
| **T2** | **THE FROZEN GATE (F5)** | Touching the eval-gate region. | Function-diff proof the gate region is **byte-identical**. New Yumi work = a **9th `gradeUtterance` call site BELOW** the in-file seam ("ALL new code here lives BELOW the frozen gate"), own `*_SYSTEM`, own budget/cooldown `ls` key, **one** new `window.YumiBrain` export key. `YUMI_GATE_SYSTEM` is **NEVER** extended. |
| **T3** | **BOTH PATHS OR NEITHER** | `migrate()` and the Firestore merge are twins; a field ensured on one only re-opens the old seam. | Both call `ensureArcFieldsAll` / `ensureSubTheoryFieldsAll` (verified live at `state.js` migrate tail + `integrations.js` arc/sub merge callbacks). Additive fields need **no** migrate step and **no** SCHEMA_VERSION bump — but they MUST ride the ensure chokepoint. Grep both call sites per slice. |
| **T4** | **`state.seeds` IS TAKEN** | A `seeds` key exists (migration bookkeeping for the Pedagogy-of-Desire worked example, **never synced**). "seed" is also 4-way overloaded live. | Never introduce a `seeds` key. Never print the noun. Grep the final diff for both. |
| **T5** | **PROTECTED RENDERER (F2)** | `arc-constellation.js` / `tradition-forms-arc.js` — no node-size variance; mass reads as **brightness only** through the existing `[0.32, 0.62]` clamp. | Byte-frozen unless explicitly authorized single-edit. |
| **T6** | **ES3 ONLY** | `const`/`let`/arrow/template-literal/`class` fail live but pass a lazy eye. | `cscript //nologo //E:jscript tools/parse-check <file>` per touched JS file. |
| **T7** | **BYTE-LOCKS** | `assets/lumen-amber.css` = 14,681 B · `assets/marks.js` = 10,255 B. | `wc -c` per slice. |
| **T8** | **CACHE BUMP** | Every JS change after a bump needs its own bump or the SW serves stale. | Read `CACHE_VERSION` at commit time, **+1 exactly**, once at the final push. Never target a hardcoded number. |
| **T9** | **NO SECOND DOOR** | Exactly **3** sub-theory creation paths exist (proven exhaustive: `grep "createSubTheory("` = def + 3 call sites; `git log -S` = 4 commits ever). | Slice 4 must fold/retire **all three**, not just the Notebook one. |
| **T10** | **XSS DISCIPLINE** | User text reaches the DOM **only** via `textContent`/`createTextNode`; `innerHTML` is reserved for static SVG literals. Recognition injects spans — the highest-risk place to break this. | Grep the diff: zero `innerHTML =` carrying user text. |

---

## 2. STANDING GATES — per slice, in order

1. **Stage 0 recon** → `docs/checkpoints/<slice>-recon.md`; HALT at any DECISION GATE.
2. **Parse** — `tools/parse-check` per touched JS file. FAIL = mechanical halt.
3. **Byte deltas** — measured **before AND after**, never back-derived; inside the slice's stated band.
4. **Grep counts** — match the slice's stated expectation exactly.
5. **Scope** — no tracked file dirty that the slice did not intend. *(GOTCHA: `git add -A` stages ~100 strays here — explicit paths only.)*
6. **EOL** — `git ls-files --eol` (i/ vs w/). The diffstat test is **circular under autocrlf** and cannot prove EOL held.
7. **INTERACTIVE-CONTROL SWEEP** — any slice restructuring a surface's DOM fires **every** control live and tables the evidence, observing each control's **OWN** state (text/disabled/aria) *and* globals. Both directions: a global-only probe manufactures phantoms **and** misses real deaths.
8. **`fix-red-team`** before every commit (deep on data-loss/state slices).
9. **`praxis-reviewer`** grades before commit; its verdict gates.
10. **VISUAL GATE** — any slice changing what a surface *looks like* is not done until settled screenshots render at 1280 **and** true 390 **and Preston's eyes pass**. Computed styles never prove a look.
11. **Live forensic smoke** before any "done" — on `prestonpraxistest`, never `prestona255`.
12. **Docs ride the diff** — BOARD.md, the studio markdown, `sequence.md`, then `tools/studio-build` (~15–20 min, **detached, never concurrent**).

**Standing rig hazard (carried, binding):** **`prestona255` does not sign into the rig browser this
round.** Its cached state there is stale (stops 2026-07-13) and is exactly the outgoing-clobber source
the F-DL latches block, with **F-DL5 unfixed**. All behavioral smoke runs on `prestonpraxistest`.

---

## 3. THE SLICES

### Slice 1 — THE DISABLED-STATE LAW + the silent block *(REQ#7a)*
**Why first:** Preston hit this live tonight. It is small, it is a whole-app defect, and it ships confidence.
**Scope:** `assets/components.css` **+40…+90 B** (rule) · `js/views.js` **+150…+400 B**.

⚠ **CORRECTED AT BUILD (2026-07-16) — this slice's plan text was wrong on two counts:**
1. It said "wire `showToast()` at the create path: 'Choose an arc first'." **Impossible.** The button is
   `disabled`, and a disabled `<button>` never dispatches `click` — a click-handler toast can never fire.
   *(A listener already sits there, already unreachable.)*
2. It assumed guidance was missing. **It isn't.** The gather bar already renders **"No arc chosen"** + a
   working **"Choose an arc"** chip (and "Create an arc first — sub-theories live inside an arc." when
   `hasArcs` is false). Nothing needed explaining — the label was already true and already ignored,
   because the button beside it looked alive.
**The slice therefore shrank to: the CSS law + path (a)'s toast** (a route handler, where a toast *can*
fire). `cursor:not-allowed` also dropped — house idiom is `cursor:default`.
**Gates:** disabled button **visibly** disabled at 390 + 1280 (VISUAL GATE); click → feedback; the sweep
fires every `.btn-primary` in the app to confirm no surface regressed.
**Model:** **DELEGABLE** (sonnet) — mechanical, bounded.
**⚠ Scope honesty:** this touches a base rule used app-wide. Desktop-first: base edit hits **both** widths —
intended here (both want the identical value), which is exactly when a base edit is legal.

### Slice 2 — PERSISTENCE, THE HARD GATE *(REQ#3; D4 adopted)*
**Why second:** Preston: "non-negotiable." And it is the law S1 rests on.
**The gap, verified:** **`beforeunload` = zero hits repo-wide.** Typed-but-uncommitted text is lost on
navigate-away/reload. `notebookGathered` / `notebookGatherName` / `notebookGatherArc` / `notebookNewborn`
are **bare module-level vars, never persisted** — a reload zeroes the gather set *and* the only
"Continue in the workshop →" door. **Mobile backgrounding makes this the higher-risk case in practice.**
**Build:** an `ls`-backed, per-uid draft+gather store (via the `ls`/`sv` wrappers only), restored on mount.
Survives: beat-switch · navigate-away · reload.
**Scope:** `js/views.js` **+1.5…+3.5 KB** · `js/state.js` **+0.4…+1.2 KB** · `sw.js` +1 line.
**Gates:** the three survival cases proven **live, by driving the UI** (type → navigate → back → text
present; type → F5 → present; gather → reload → cards present). Data-layer checks do **not** count.
**Model:** **OPUS** — durability tier; F-DL family discipline; silent-loss adjacent.

### Slice 3 — THE EMBER *(S2 data model; REQ#6 rename)*
**Additive fields only** (T3): arc `status` (**ember** ↔ graduated) · basin structure (origin phrase,
fragments, mass, split/merge) · lineage (birth-capture link) · mote identity.
**⚠ Two verified asymmetries this slice must resolve:**
- **`createArc` hard-blocks a blank title** (`if (trimmedTitle === '') return null;`) — a titleless ember
  is not free. Either origin-phrase-as-title, or a new creation path. **FORK F-A below.**
- **NO arc rename path exists** — proven twice (function grep `updateArc|renameArc|setArcTitle` = zero;
  `arc\.title\s*=` = exactly **one** hit, inside `ensureArcFields`, unreachable from UI). "Rename an
  ember" (REQ#6) is **new build**, not a wiring job. *(Sub-theory rename **does** exist —
  `updateSubTheory` from the workshop title blur.)*
- **`_arcMaturityWord`'s `'seed'` must retire** (see header).
**Tripwires:** **T1** (arc field ONLY — no third sub-theory status) · **T3** (both paths) · **T4** ·
don't create a third lifecycle vocabulary beside the existing `arc.published` boolean.
**Scope:** `js/state.js` **+1.2…+3.0 KB** · `js/views.js` **+0.5…+1.5 KB**.
**Model:** **OPUS** — schema seam + the coercion tripwire.

### Slice 4 — ONE DOOR, NOT TWO *(REQ#4, REQ#7b)*
**The census is exhaustive — all three fold or the round ships a second door (T9):**
| Path | Trigger | Lands |
|---|---|---|
| (a) `#arc/<id>/new-subtheory` redirect | "＋ Add a sub-theory" (2 controls) | auto-navigates to `/build`; **null → silent `location.replace('#arcs')`** |
| (b) `notebookCreateSubTheory()` | "Create sub-theory →" | stays; newborn card + door |
| (c) `nameSubTheoryFromThread()` | Yumi "Accept" on a name proposal | stays; **can auto-mint an arc**; no door |
Three different landings, two different arc-resolution behaviors. The loop replaces (b) and must
**retire or fold** (a) and (c).
**Scope:** `js/views.js` **+3…+7 KB** (net; some deletion) · `js/yumi-ui.js` **±0.5 KB**.
**Gates:** the sweep, exhaustively; grep proves **exactly one** live creation path; no route orphaned.
**Model:** **OPUS** — UX restructure across three surfaces.

### Slice 5 — REVERSE GEAR *(REQ#6)*
**Exists:** ungather (`toggleGather`, non-destructive) · link/unlink · sub-theory rename.
**Missing:** ember rename (Slice 3) · **dissolve a basin back to motes** (new) · undo affordances on the
loop's forward acts.
**⚠ FORK F-B:** delete is **terminal** today for arc *and* sub-theory, and the copy says verbatim
**"This can't be undone."** Preston: "nothing unrecoverable." These contradict.
**Scope:** `js/views.js` **+2…+5 KB** · `js/state.js` **+0.5…+1.5 KB** (more if F-B → recoverable delete).
**Model:** **OPUS** (semantics) — the visible-undo chrome is delegable once the semantics land.

### Slice 6 — THE SPIKE + DETERMINISTIC RECOGNITION *(REQ#1a, REQ#2)*
**6a — THE CARET SPIKE (gate; build nothing else until it resolves).** Prove a **non-destructive**
decoration technique: Range-based text-node splitting that **never** calls `wcRenderMarkdown` and
**never** reaches the markdown serializer's tag handling. Deliverable: a spike report with the caret
surviving decoration mid-word, undo/redo intact, and `getValue()` **byte-identical** before/after
decoration. **FAIL → FORK F-C.**
**6b — the matcher.** Generalize `matchBook`'s two-pass title/author logic + `normTitle` from
"one guess → one bookId" to "scan prose for every occurrence." **No library index exists** — build one
(`state.books` carries `title` + `author`; `author` is a **bare free-text string**, no id).
Deterministic, local, **no model call**, private. Runs live (REQ#1's fast half; REQ#2's raw-capture rule).
**6c — read-only lighting first (cheapest, safest mount).** Marginalia cards already re-render via
`wcRenderMarkdown` into a **static, non-editable** div — no caret, no undo, rebuilt every paint.
*(Journal/question cards are plain `textContent` today — lighting them needs a first render pass, so they
are a separate, larger job.)*
**Scope:** `js/views.js` **+2…+5 KB** · a new matcher **+2…+4 KB**. Spike = throwaway, committed as a report.
**Model:** **6a OPUS** (architectural risk) · **6b DELEGABLE** · **6c OPUS**.

### Slice 7 — ROOM LIGHTING *(REQ#1b)* — **GATED ON 6a**
The live-canvas half. **Does not start until the spike passes.** T10 applies hardest here.
**Scope:** unknown until 6a — **deliberately unestimated.** Any number now would be fiction.
**Model:** **OPUS**.

### Slice 8 — THE DISMISSAL STORE *(REQ#1c)*
"Not this," **remembered**. ⚠ **No working precedent exists:** `lensSuggestDismiss` doesn't persist at
all; the reader-model dismissal writes `ls('praxis_yumi_noticed')` — **local-device-only, never syncs**;
`citationPins` is shaped exactly right and ensured on **both** paths but has **zero writers**.
**FORK F-D (tier):** REQ#1 says "remembered" (durable/synced); D14 says the raised hand is "sticky per
session." Different tiers. Which for dismissals?
**Scope:** `js/state.js` **+0.4…+1.0 KB** · `js/views.js` **+0.5…+1.5 KB**. T3 applies.
**Model:** **DELEGABLE** once F-D is ruled.

### Slice 9 — SEMANTIC NOTICING *(REQ#1d, REQ#2)*
Yumi's half: a **9th `gradeUtterance` call site below the frozen gate**, firing **only at gather/ask**
(REQ#2, conservative). Follows the existing shape exactly: N ordered pre-gates → one generate → grade →
surface-or-silent. Own `*_SYSTEM`, own budget/cooldown key, one new `window.YumiBrain` export key.
**T2 is the gate. Function-diff proof required.** Needs its own eval battery (brief Q3).
**Scope:** `js/yumi-brain.js` **+3…+6 KB, ALL BELOW THE SEAM** · zero proxy change (verbatim relay).
**Model:** **OPUS** — MODEL LAW names Yumi grammar/eval work as Opus explicitly.

### Slice 10 — NOTE DEEP-LINK *(REQ#8)*
Notes are already indexed in both systems. Build the **per-note deep link** (both currently route to a
bare `'#notebook'`). Remove spotlight's dead `en.title` match.
**Scope:** `js/spotlight.js` **+0.2…+0.6 KB** · `js/views.js` **+0.5…+1.5 KB**.
**Model:** **DELEGABLE**.

### Slice 11 — MOBILE, FIRST-CLASS *(REQ#5)*
**Better than feared:** capture controls have **zero viewport gating**; 44px targets exist at ≤759;
`capture="environment"` is real; dictation transport is genuinely iOS-aware (MIME branching +
gesture-scoped `getUserMedia`).
**Real gaps:** Slice 2's persistence (backgrounding) · the compose control's home at 390 (FORK F-E) ·
the mobile raised hand (one fixed presence glyph + count, D14) · **PWA dictation at real eruption
length is UNVERIFIED** (brief §9 diligence; "[keyboard clacking]" was captured as a note live).
**Gates:** true 390 + **Preston's phone leg on the DEPLOYED build** (his requirement).
**Model:** **DELEGABLE** build + **Preston** for the phone leg.

### Slice 12 — THE ROOM'S COMPOSITION + THE RAISED HAND *(S3 design)*
Inherited from DW-3, no DW-POLISH pass. `min-height:100vh` + `align-items:flex-start` is the mechanical
source of the "mostly emptiness"; `bumpLight()` ties `--lit` to prose length so a young draft is
*deliberately* dimmer; **the workshop has no `ch` cap at any tier** (the ≤72ch stopgap is the Page's).
Plus D14's raised hand (desktop margin dots / mobile presence glyph), which **SHAPE-B round 1 shipped
clipped invisible** — the gate is: prove visibility by **measuring**.
**Model:** **OPUS** — design.

---

## 4. FORKS — ALL SIX RULED (Preston, 2026-07-16)

| # | RULING |
|---|---|
| **F-A** | **LITERALLY TRUE** — embers may exist unnamed (display: **"ember · unnamed"**); naming remains the mint; **a rename path ships** (it also serves REQ#6). |
| **F-B** | REQ#6 **scopes to the loop's forward acts** — ungather, rename, dissolve basin→motes. **Delete stays terminal** and its "can't be undone" copy **stays truthful**. Recoverable delete = **named future item**, not this round. |
| **F-C** | Spike fallback = **decorate-on-pause** (~1s idle or blur). ⭐ **And in ALL cases decoration is a DISPLAY LAYER ONLY — plain text remains the single source of truth; decorated DOM never passes through the serializer. This rule holds even if the spike succeeds.** |
| **F-D** | **REMEMBERED** — dismissals persist **per match**, not per session. |
| **F-E** | As the mockup decided (**D1: nav compose + mobile FAB**). |
| **F-F** | Authors **LIGHT and LINK TO THE FILTERED SHELF** for that author string. **Full author entity = named follow-on item at close-out**, not built now. |

**F-C is the round's most important ruling.** It converts REQ#1's biggest risk from a *care* problem into
an *architecture* problem: if decoration is display-only and never reaches the serializer, the
text-corruption failure mode is **structurally impossible** rather than merely avoided. Slice 7's gate
becomes "prove the display layer never round-trips", which is a checkable invariant.

**EMBER vocabulary gate confirmed** — the live `'seed'` string retires in Slice 3, as planned.

### The forks as originally posed (kept for the record)

| # | Fork | Why it can't be carried silently | Blocks |
|---|---|---|---|
| **F-A** | **Titleless ember.** `createArc` hard-blocks a blank title and no rename path exists. Options: **(A1)** origin phrase becomes `title` at birth, rename later (cheap; but "naming is the mint" then renames rather than mints) · **(A2)** new creation path allowing titleless arcs (truer to D13; more surface). | It decides whether "the name is the mint" is literally true at the arc layer or a UI fiction over a pre-filled title. | Slice 3 |
| **F-B** | **Does "nothing unrecoverable" extend to DELETE?** Today delete is terminal for arc + sub-theory, with copy saying "This can't be undone." **(B1)** REQ#6 covers only the loop's forward acts (ungather/rename/dissolve) — delete stays terminal, copy stands · **(B2)** delete becomes recoverable (trash/undo) — a real build, and the copy is then a promise we must keep. | COPY IS A CONTRACT cuts both ways: B2 without the build ships a lie; B1 leaves a dead end you called out. | Slice 5 |
| **F-C** | **If the caret spike FAILS.** **(C1)** light on pause/blur, not per-keystroke · **(C2)** read-only surfaces only (the Room's prose lights when you leave it) · **(C3)** accept a rebuild+caret-restore. | The codebase already deferred a *simpler* version of this as "highest caret risk." I will not silently pick. | Slice 7 |
| **F-D** | **Dismissal tier.** "Remembered" (durable/synced, survives devices) vs D14's "sticky per session." | No working precedent exists either way; it's a covenant question, not a technical one. | Slice 8 |
| **F-E** | **The compose control's home** (D1) — already reserved for felt judgment (decisions §7.3). SHAPE-B round 1 proposed: compose bottom-**left**, Bloom bottom-**right**, raised hand = right-edge tab mid-height. | Three fixed controls contest the 390 thumb corner. | Slice 11 |
| **F-F** | **AUTHORS have no destination.** REQ#1 says authors are "linked to their library pages." **Zero author entity, zero author route, zero `state.authors`** (exhaustive grep); `book.author` is a bare free-text string. Options: **(F1)** authors light but don't link · **(F2)** link to a filtered shelf view · **(F3)** build an author entity + route + identity resolution ("bell hooks" vs "hooks, bell") — a **round of its own**. | F3 is not a slice, it's a program. This one likely reshapes REQ#1's scope. | Slice 6 |

---

## 5. MODEL ASSIGNMENT (MODEL LAW)

| Slice | Model | Why |
|---|---|---|
| 1 Disabled law | **DELEGABLE** (sonnet) | mechanical, bounded |
| 2 Persistence | **OPUS** | durability / silent-loss tier |
| 3 The Ember | **OPUS** | schema seam + coercion tripwire |
| 4 One Door | **OPUS** | cross-surface UX restructure |
| 5 Reverse Gear | **OPUS** semantics · chrome delegable | |
| 6a Spike | **OPUS** | architectural risk |
| 6b Matcher | **DELEGABLE** | bounded, deterministic |
| 6c Read-only lighting | **OPUS** | first decoration surface |
| 7 Room lighting | **OPUS** | the risk |
| 8 Dismissal store | **DELEGABLE** after F-D | proven schema pattern |
| 9 Semantic noticing | **OPUS** | MODEL LAW names Yumi grammar/eval work Opus |
| 10 Deep-link | **DELEGABLE** | bounded |
| 11 Mobile | **DELEGABLE** + Preston's phone leg | |
| 12 Room composition | **OPUS** | design |

**Agents:** gate agents (`praxis-reviewer`, `praxis-recon`, `studio-scan`, `repo-mapper`) = `sonnet`
frontmatter · `fix-red-team` / `fix-implementer` = `inherit` (**red-team's `inherit` is due for revisit
at the R-ARC close** — CLAUDE.md's standing note). ⚠ **Inside a `Workflow`, omitting `model` inherits the
SESSION model, not the frontmatter** — pass it explicitly there or MODEL LAW breaks silently. The Agent
tool honors frontmatter.

---

## 6. SEQUENCE

**Wave A (foundation — no forks blocking):** Slice 1 → Slice 2.
**Wave B (needs F-A):** Slice 3 → Slice 4 → Slice 5 (needs F-B).
**Wave C (needs F-F; 6a gates the rest):** Slice 6a → 6b → 6c → [7 if 6a passes / F-C if not] → 8 (F-D) → 9.
**Wave D (polish + proof):** Slice 10 → 11 (F-E) → 12 → close.

One commit per slice, **local**. **Nothing pushes without Preston's exact word.** Cache bumps once at the
final push of a shipping group (T8).

**Honest scale:** this is a multi-session round — 12 slices, 6 forks, one unestimable slice (7) pending a
spike. It is **not** one sitting, and any plan claiming otherwise would be lying to you.

---

## 7. TRACEABILITY — every requirement, so none can fall out

| REQ | Preston's words | Slices | State |
|---|---|---|---|
| **1** | In-text recognition everywhere I write; split deterministic/semantic; "not this" remembered; noticing never rewriting | **6a, 6b, 6c, 7, 8, 9** | **F-F blocks scope** (authors have no destination); **6a gates the Room half** |
| **2** | Raw-capture consent: deterministic lighting only; semantic only on gather/ask | **6b, 9** | clean — 9's pre-gates enforce it |
| **3** | Persistence = the hard gate: gathered cards + drafts survive beat-switch, navigate-away, reload | **2** | gap verified (`beforeunload` = zero hits; gather state is bare module vars) |
| **4** | The door: notes → a forming sub-theory without reading instructions | **4** (+2 for its persistence, +12 for its room) | |
| **5** | Mobile first-class; deployed felt pass includes a phone leg | **11** (+2, +12's mobile hand) | better than feared; **PWA dictation unverified** |
| **6** | Reverse gear everywhere: ungather, rename an ember, dissolve a basin; nothing unrecoverable | **3** (rename), **5** (dissolve/undo) | **F-B**: "nothing unrecoverable" vs terminal delete |
| **7** | One door, not two; verify + resolve the silent block | **1** (block), **4** (one door) | block **diagnosed** — invisible disabled state, whole-app defect |
| **8** | Captured notes findable in search | **10** | **already indexed**; gap = deep-link |

**Plus, carried from the decisions list (not a Preston requirement — do not let them fall out either):**
D11 birth delight / no confetti · D12 brightness-only at three masses · D14 raised hand absolute ·
D16 superseded-block removal (F4) · the naming table's retirement of `_arcMaturityWord`'s `'seed'`.

---

## 8. STILL OWED BY PRESTON

1. **The verbatim July-14 eruption** (Messages text) — the mockup fixture's one unresolvable input.
   SHAPE-B round 1 proved the cost of inventing it: the placeholder contradicted D10 by calling a source
   unread inside the all-read track.
2. **The six forks** (§4) — F-A and F-F reshape scope; the rest gate their slices.
3. **SHAPE-B round 2** — deferred by ruling: the writing surface passed; the corrected panel re-runs with
   his notes folded in, survivor as 4th contender.
