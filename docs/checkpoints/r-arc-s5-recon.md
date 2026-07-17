# R-ARC SLICE 5 — REVERSE GEAR — STAGE 0 RECON

**Base:** `6ad6822` (local; = `dde64db` origin + the config commit) / live `sw.js` v3.218.
**Model:** OPUS (already-ruled: F-B ruled, plan-banded). **Mode:** unattended.
**Plan:** `docs/r-arc-plan.md` Slice 5 (lines 226–234). **Fork F-B:** RULED B1 (delete terminal;
reverse gear = the loop's forward acts only; recoverable delete = named future item, NOT this round).

---

## 1. THE DISAMBIGUATION (required before build) — dissolve ≠ 3B-SM split/merge

Three basin life-2 mechanics, kept distinct:

| Act | Meaning | This slice? | Precedent |
|---|---|---|---|
| **DISSOLVE** | Un-form ONE basin → its gathered notes return to loose motes in the notebook | **YES (Slice 5)** | none (new) |
| **SPLIT** | Divide ONE basin into TWO basins | **NO → Slice 3B-SM** | ZERO precedent (spike) |
| **MERGE** | Combine TWO basins into ONE | **NO → Slice 3B-SM** | `mergeBookDuplicates` template |

Dissolve = **un-form entirely** (one basin → nothing, notes released). Split/merge = **divide/combine**
(basin count changes, structure rearranged). No overlap. Split/merge stay deferred to 3B-SM after the
basin felt pass (plan line 180).

---

## 2. DATA-MODEL FINDINGS (all read directly from source)

- **A basin** = an unnamed draft sub-theory. `_stIsBasin(sub)` (`js/views.js:8491`): `status !== 'published'`
  AND `header` (whitespace-stripped) is empty. Rendered as a formless mote (`_stMoteHTML`, `_stMarkOrMote`).
- **A basin's contents** = `evidence[]` elements of `kind:'entry'`, each `refId` = a notebook entry id
  (`addEvidenceToSubTheory`, `js/state.js:2432`; attached by `notebookCreateSubTheory`, `views.js:2620–2624`).
- **⭐ THE LOAD-BEARING FINDING — forming a basin never touches the source notes.**
  `notebookCreateSubTheory` (`views.js:2598`) and the Yumi fold `notebookGatherFromThread` (`views.js:3306`)
  both attach notes **by reference only**. Neither sets `entry.filed`, adds a back-ref, or removes the entry.
  (The `entry.filed = true` at `views.js:3346` belongs to `fileEntryToBook`, a *different* function starting
  at 3342 — file-to-book, not gather.) **A basin is a pure non-destructive overlay; its notes are always
  independently present in `state.notebookEntries`.**
- **Consequence for dissolve:** "return to loose motes" needs **NO note restoration** — the motes never left
  the notebook. Dissolving a basin = removing the basin *record*; the notes are already loose.
- **`deleteSubTheory` (`state.js:2171`)** hard-deletes WITH cascade: unlinks every partner
  (`unlinkSubTheories` over a snapshot), clears a dangling `currentSubTheoryId`, `saveState()`. Self-contained.

---

## 3. THE DISSOLVE DETERMINATION (mechanics + the F-B boundary)

**Dissolve = remove the basin record; its gathered notes remain loose in the notebook.** Because the notes
persist independently (§2), this is genuinely recoverable — you can re-gather them — so it honors the
reverse-gear covenant ("nothing unrecoverable") and is distinct from terminal delete.

**Distinct from terminal delete (F-B):**
- Terminal `deleteSubTheory` → confirm copy (`views.js:10264`): *"Its evidence and any resonance links are
  removed. This can't be undone."* + `st-confirm-btn-danger`. Applies to formed/named theory; loses authored prose.
- Dissolve → reverse-gear framing (like the unlink modal `views.js:10341`: *"Both sub-theories stay; only the
  link between them is removed"* — reassuring, no "can't be undone"). Applies to a **basin only**.

**⚠ THE AUTHORED-CONTENT EDGE — forced by F-B (carried, not a new fork).** `_stIsBasin` is true for a
blank-header draft **even if it carries authored content**. Dissolving that would lose the content =
unrecoverable = violates the covenant. **Therefore dissolve is offered ONLY when the basin holds no
author-authored content.** Two authored fields, both record-only:
- **prose** — `bodyPublic`/`bodyIntellectual` (the workshop canvas writes prose while unnamed; only *Finish*
  is dormant pre-name, `views.js:11196–11202`).
- **valueMarks** — `valueMarks[].why` is author-typed free-text (`views.js:9405/9476`), authored on the
  basin's read page (the value-mark register mounts at `views.js:11113–11116` with only an owner-signed-in
  gate — **no draft gate**), stored only on the sub-theory record.

**⚠ RED-TEAM CORRECTION (2026-07-16):** the §2 data-model survey enumerated `evidence[]` only and MISSED
`valueMarks` — the red-team caught it as a silent-loss BLOCK (a value-marked basin could be dissolved,
destroying the `why` notes). The guard now covers BOTH fields; the UI condition mirrors it
(`footIsDissolvableBasin`). This guard flows necessarily from F-B ("nothing unrecoverable") + the covenant —
it *narrows* scope, adds nothing, so it is a mechanical determination, not a fork. Preston-adjustable at felt
pass. **Named residual (no live loss today):** `evidence[]` external-source (`kind:'external'`) + per-element
`annotation` are also author-authored + record-only, but have **no live writer** for real users (read-only in
the live UI; authored external/annotation exist only in the `__praxis_seed__` published data, which dissolve
already refuses via the `status==='published'` guard) — so dissolve is safe today; if a future slice adds an
external/annotation editor reachable on a basin, the guard must extend to it.

**⭐ DESIGN DETERMINATION — the removal affordance follows the object's nature (carried; documented for the
felt pass).** In the workshop foot today, every sub-theory shows the terminal *"Delete this sub-theory"*
(`views.js:11359–11368`). On a **prose-empty basin**, "This can't be undone" is actually *false* (the notes
remain; only the evidence *refs* go). So the build **swaps** the foot control by the object's nature:
- **basin + prose-empty →** quiet *"Dissolve this basin"* (reverse-gear; reassuring confirm; routes to the arc).
- **otherwise (named, or prose-bearing) →** the existing terminal *"Delete this sub-theory"* (UNCHANGED).

A basin has no unrecoverable content, so dissolve fully covers removing it; a prose-bearing blank-header draft
still gets terminal delete (honest about the prose). F-B stays intact (delete terminal for formed work; reverse
gear never becomes undelete). If Preston prefers showing *both* on a basin, that is a trivial felt-pass change.

---

## 4. REVERSE-GEAR COVERAGE — "undo affordances on the loop's remaining forward acts"

The theorizing loop (REQ#6: gather → form → name → graduate → connect) is **already richly reversible**;
dissolve fills the one remaining gap:

| Forward act | Reverse fn | Clickable affordance today | Gap? |
|---|---|---|---|
| Gather a note (stage) | `toggleGather` (`views.js:2529`) | ✅ × "Remove from gathered" (`views.js:2284`) | — |
| **Form a basin** (create from gather) | — | ❌ none | **DISSOLVE (this slice)** |
| Name/mint a basin | `updateSubTheory` (clear header) | ✅ title input (`views.js:11148`) — clearing reverts to basin | — |
| Rename an ember/arc | `updateArc` (`state.js:1910`) | ✅ "Rename" (`views.js:12831`) | — |
| Graduate an arc | `ungraduateArc` (`state.js:1939`) | ✅ "Return to ember" (`views.js:12823`, S3R) | — |
| Link (resonance) | `unlinkSubTheories` (`state.js:2318`) | ✅ per-connection "Unlink" (`views.js:10315`) | — |

**Out of F-B's enumerated loop (NOT built this slice — named follow-ons):** un-attach evidence (**no
`removeEvidence` exists** — append-only), remove-from-arc (**no `removeBookFromArc`/`removeEntryFromArc`
exists**), un-file a note. These are membership/evidence acts, not the loop's forward acts F-B enumerates
("ungather, rename, dissolve"); building them would exceed the band and F-B's scope. **Scope call:** Slice 5 =
**dissolve** (the one genuinely-missing loop reverse) + this documented confirmation that the loop's other
forward acts already carry reverses. Flagged for Preston; band + F-B rule it.

**Constellation-hover dissolve = OUT (frozen file).** `arc-constellation.js` is census-only; the dissolve home
this slice is the workshop (where basins are formed/named). No frozen-file edit.

---

## 5. BUILD PLAN (slice-by-slice)

1. **`js/state.js` — `dissolveBasin(id)`** (after `deleteSubTheory`, ~`state.js:2185`). Self-contained guards
   expressed in record fields (no dependency on the views `_stIsBasin` helper): record exists · `header`
   whitespace-empty · `status !== 'published'` · `bodyPublic` + `bodyIntellectual` both whitespace-empty. On
   pass → delegate to `deleteSubTheory(id)` (cascade + persist). Return its boolean; false on any guard fail.
2. **`js/views.js` — `confirmDissolveBasin(id, afterDissolve)`** (sibling of `confirmUnlinkSubTheory`,
   ~`views.js:10302`). Reuse the `.st-confirm*` modal wholesale. Copy: *"Dissolve this basin? The notes you
   gathered stay in your notebook — only the basin is cleared."* Cancel (neutral) + Dissolve (action button).
   On Dissolve → `dissolveBasin(id)` → close → `afterDissolve`.
3. **`js/views.js` — the foot swap** in `renderSubTheoryBuild` (~`views.js:11359`): if `_stIsBasin(subTheory)`
   AND prose-empty → render quiet *"Dissolve this basin"* → `confirmDissolveBasin(id, →#arc/<arcId>)`; else →
   the existing *"Delete this sub-theory"* (unchanged).
4. **`assets/components.css`** — one additive quiet trigger class `.stb-dissolve` **only if** no existing quiet
   class fits at the build site (checked at build); modal reuses `.st-confirm*` (no CSS).
5. **`sw.js`** — CACHE_VERSION `v3.218 → v3.219` at the final commit only.

---

## 6. DECLARED BAND (HARD halt on ceiling breach)

Base bytes: `views.js` **1,000,927** · `state.js` **167,844** · `components.css` **716,409**.

| File | Band | Source |
|---|---|---|
| `js/state.js` | **+0.3 … +1.5 KB** | plan (`dissolveBasin`) |
| `js/views.js` | **+2 … +5 KB** | plan (confirm modal + foot swap) |
| `assets/components.css` | **+0 … +0.7 KB** (DECLARED addition — plan banded no CSS; additive single-use quiet class, zero existing-rule edits) | declared |
| `sw.js` | +0 net (1-line bump) | convention |

**Byte-locks (must stay exact):** `assets/lumen-amber.css` = 14,681 · `assets/marks.js` = 10,255.
**Frozen (0 diff):** `arc-constellation.js` · `tradition-forms-arc.js` · yumi eval-gate region of `yumi-brain.js`.
**T3 (both-path ensure):** dissolve adds **no field** (pure record removal) → T3 N/A; no migrate step, no
SCHEMA bump, no Firestore-merge touch. Confirmed: `ensureSubTheoryFieldsAll` (`state.js:736`) unaffected.

---

## 7. GATE PLAN (per handoff §5)
self-verify (parse cscript · byte band · greps · EOL `git ls-files --eol` + surgical diffstat) → **fix-red-team**
→ **praxis-reviewer** (verdict gates) → rig live-verify (INTERACTIVE-CONTROL SWEEP — fire the dissolve control,
probe its OWN state + confirm the notes survive) → checkpoint → commit local → HALT for push word.

**No new fork surfaced.** Determinations in §3–§4 flow from F-B + the covenant + the band; proceeding to build
per unattended run-mode.
