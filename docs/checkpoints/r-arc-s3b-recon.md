# R-ARC SLICE 3B — "THE BASIN" — STAGE 0 RECON

**Status: RECON COMPLETE · FORKS RULED (Preston 2026-07-16) · BUILDING.**
**3B-1 = DEFER the frozen FIELD mote visual (its own follow-on: single-edit auth + hard red-team) BUT
take the views.js partial — workshop/picker/newborn chrome go formless NOW. 3B-2 = split + merge BOTH
DEFERRED to a new slice 3B-SM, after Preston felt-tests the basin.** So **Slice 3B = origin phrase +
naming-threshold invitation + formless-mote CHROME (views.js only)** — additive, off the frozen file.
Base **`c681d35`** / v3.214 (HEAD == origin/main). Read-only. Plan: `docs/r-arc-plan.md` (Slice 3B).

## The big finding — a basin IS an existing sub-theory record

The recon's headline: **a basin = `state.subTheories[id]` with `header === ''`**, NOT a new collection.
- `createSubTheory` already permits a blank header (native, unvalidated).
- `state.subTheories` already holds arbitrarily many records → **multiple concurrent basins is FREE**
  (the eruption's "4+ sub-theory seeds" needs no new architecture).
- A new top-level `state.basins` collection would be a **7th Firestore collection** (own dirty-flag, own
  load/write fns, own sign-in fan-out slot) — a substantial, non-additive lift. **Avoided.**

## What's ALREADY WIRED (zero or near-zero new code)

| Piece | Mechanism (live today) |
|---|---|
| Basin identity | blank-header `subTheories[id]` |
| Multiple concurrent basins | arbitrary `subTheories` records |
| Fragment accretion **at mint** | `notebookCreateSubTheory` → `addEvidenceToSubTheory` loop |
| Fragment accretion **post-mint, multi-session, any register** | `openEntrySendToSubTheory` picker — the "Send to sub-theory" link on **every** notebook card (incl. journal, which gather locks out) |
| Mass (brightness signal) | `_stComputeMaturity` = `bodyPublic.length + 80×evidence.length`, capped 1500, normalized [0,1] — **already flows into `sub.maturity` end-to-end** |
| The mint (naming = the transform) | `updateSubTheory(id, {header})` — **already exists** (workshop title-blur uses it). "Naming is the mint" collapses to this one call. |
| Fragment unit | existing `evidence[]` `{kind, refId, quote, ...}` — no lighter shape needed |

## What's GENUINELY NEW — ranked, with disposition

| Piece | Difficulty | Recon note |
|---|---|---|
| **Origin phrase** (`originEntryId` on sub-theory, string\|null) | **Trivial** | Exact mirror of Slice 3's arc field; rides `ensureSubTheoryFields` (both paths confirmed). The phrase renders from `notebookEntries[originEntryId].body` (single source, no dup). |
| **Naming-threshold invitation** | **Small** | Zero existing threshold-nudge logic (exhaustive grep). At mass, invite naming; the mint is already wired. |
| **Merge** (basin + basin → one) | **Moderate — real precedent** | `mergeBookDuplicates(uid,keepId,dropIds)` is the template: repoint `evidence[]`, decide a `bodyPublic` policy, tombstone + `unlinkSubTheories` the dropped id. |
| **Split** (one basin → two) | **⚠ HIGHEST RISK — ZERO precedent** | No `split(` of a collection anywhere (`git log -S` empty). Move a subset of `evidence[]` to a new record + decide `bodyPublic` handling (no analog splits free text). The plan already suspected this. |
| **Formless-mote VISUAL** | **⚠ SCOPE CONFLICT** | "Form follows naming: unnamed = formless mote, brightness = mass." The chrome marks (`bookSubMarkHTML`) branch from **views.js** (buildable), BUT the arc-interior **field** mark is `_stRenderShapes` inside the **FROZEN `arc-constellation.js`** — a formless mote (suppress the shape body, brightness only) needs an edit to that non-goal file. Mass is already wired; only the shape-suppression branch is missing, and it lives in the one file this round shouldn't touch. |
| **Rail register-expansion** | **Open (Fork 5)** | The workshop rail (`marginaliaFor`) shows `register==='marginalia'` only — question/journal-sourced fragments count in mass but are invisible in the rail. Decisions file frames this as Fork 5's "real ask," unresolved. |

## Tripwires — confirmed for the sub-theory layer

- **T3:** `ensureSubTheoryFields` rides both `migrate()` (`state.js:3518`) + the Firestore merge
  (`integrations.js:278`). `originEntryId` needs zero new wiring — one line in that function.
- **T4:** `state.basins` = zero hits (clean). `state.seeds` is taken (Pedagogy migration) — **not touched**.
- **T1/F3:** the status coercion (`!== 'draft' && !== 'published' → 'draft'`) mechanically ENFORCES that a
  basin is a **structure, never a status value** — a basin can't be marked via `status`. Good.

## ⛔ THE DECISION GATE — two forks reshape the slice

**FORK 3B-1 — the formless-mote VISUAL: defer, or authorize a frozen single-edit?**
The visual half of "form follows naming" needs a shape-suppression branch inside the **frozen**
`arc-constellation.js` (for the field view). The round's non-goals name that file byte-frozen; T5 has an
escape ("byte-frozen unless explicitly authorized single-edit").
- **(A)** Ship 3B **data-model-only** — origin phrase + naming threshold + (optionally) merge; motes look
  like blank-header sub-theories for now; the formless-mote render is a **named follow-on** with its own
  explicit single-edit authorization. *(My lean — keeps 3B additive-safe and off the frozen file.)*
- **(B)** Authorize the single-edit **now** — I add the shape-suppression branch to `arc-constellation.js`
  under FIX-PROTOCOL, byte-frozen siblings, red-team the frozen delta hard.

**FORK 3B-2 — split/merge scope.**
- **(A)** **Both deferred** — 3B ships the basin's *identity + naming threshold* (origin phrase, the
  invitation, the already-wired accretion/mint); split AND merge become their own slice (3B-SM). *(My
  lean — the felt core is "capture → unnamed basin → accretes → named at mass"; split/merge is life-2's
  advanced capability, not the core loop, and split has zero precedent.)*
- **(B)** **Merge in 3B, split its own spike** — merge has a real template; split doesn't.
- **(C)** **Both in 3B** — largest, highest-risk; split needs a spike regardless.

## The MINIMAL coherent 3B I recommend (pending the forks)

**Origin phrase + the naming-threshold invitation**, riding entirely on what's already wired
(accretion via the existing picker, the mint via `updateSubTheory`, mass via `_stComputeMaturity`). That
delivers §4b's four lives as a felt loop — *capture → unnamed basin carrying its origin phrase → accretes
fragments → at mass, invited to name → naming mints it into a sub-theory* — **without touching the frozen
file and without the zero-precedent split.** The formless-mote field visual (3B-1) and split/merge (3B-2)
become named follow-ons unless Preston rules them in.

Open sub-questions if merge/split ride: the merge `bodyPublic` combination policy, and whether a
merged/split basin carries a lineage breadcrumb.

## Ground truth
HEAD `c681d35` == origin/main · v3.214 · byte-locks 14,681 / 10,255 exact · no `basin`/`Basin` in `js/`
(slice not started) · `state.basins` clean · `state.seeds` = Pedagogy migration (untouched).
