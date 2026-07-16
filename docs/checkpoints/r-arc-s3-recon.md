# R-ARC SLICE 3 — "THE EMBER" — STAGE 0 RECON

**Status: RECON COMPLETE. ⛔ DECISION GATE — halted for Preston before any `state.js` edit.**
Base **`ba4888c`** / v3.212 (HEAD == origin/main). Read-only. Plan: `docs/r-arc-plan.md` (Slice 3).

This is a **schema slice** (`state.js` mutation), so per the plan-file protocol I halt after recon: the
exact additive-field set + one surfaced naming collision need Preston's ruling before I mutate the schema.

## The field set — confirmed clean, proposed for ratification

Vocabulary is LOCKED: **EMBER** (young/unnamed arc) · **MOTE** (unnamed sub-theory) · **BASIN** (the
gathering structure). "seed" forbidden as noun + schema key.

| Field | Owner | Type / default | Rides | Both-path? |
|---|---|---|---|---|
| **`status`** | arc | `'ember'` \| `'graduated'`, default **`'ember'`** | `ensureArcFields` | ✅ §T3 |
| **origin/lineage ref** (name TBD — e.g. `originEntryId`) | arc | string \| `null`, default `null` | `ensureArcFields` | ✅ §T3 |
| **basin** (shape per decisions D7: origin phrase · fragments · mass · split/merge) | NEW (not `seeds`) | object | its own ensure or folds into `ensureArcFields` | must wire both if per-arc |

**No sub-theory schema change** — T1 holds (EMBER status is arc-only). `arc.status` slot is clean:
`grep "arc\.status"` = zero hits.

## Tripwires — all verified LIVE, verbatim

- **T1 (status coercion) intact** — `ensureSubTheoryFields`, `state.js`: `if (st.status !== 'draft' &&
  st.status !== 'published') { st.status = 'draft'; }`. Runs on **both** load paths. Any third
  sub-theory status is erased on next load — **EMBER never goes on `subTheory.status`.**
- **T3 (both ensure-paths) intact** — a new `ensureArcFields` field rides both `migrate()` →
  `ensureArcFieldsAll(stored.arcs)` **and** the Firestore merge → `ensureArcFieldsAll(state.arcs)` in the
  `onAuthStateChanged` arc-load callback. No migrate step, no SCHEMA_VERSION bump. Confirmed by grep of
  both call sites.
- **T4 — `state.seeds` confirmed unrelated + unsynced** (Pedagogy-of-Desire migration bookkeeping; never
  on a Firestore path). New `basin` is a clean name. No `seeds` key, no "seed" noun introduced.

## F-A — the rename path is NEW build (confirmed exhaustively)

- `createArc` hard-blocks a blank title: `if (trimmedTitle === '') return null;` (verbatim).
- **NO rename path exists anywhere** — `updateArc|renameArc|setArcTitle` = **zero** function hits;
  `git log -S` = zero in all history; escaped `\barc\.title\s?=\s?[^=]` = exactly one hit, the
  `arc.title = ''` coercion inside `ensureArcFields` (unreachable from UI). *(An unescaped first pass
  falsely matched six `typeof arc.title === 'string'` — corrected.)*
- **Safe shape:** mirror `updateSubTheory(id, fields)` (exists; edits `header`/body when a string is
  supplied, bumps `updatedAt`, `markSubTheoriesDirty` → `saveState`). A new `updateArc(id, fields)` is the
  clean analog. F-A: naming stays the mint; a titleless arc displays "ember · unnamed" and a rename path
  ships (also serves REQ#6).

## The `_arcMaturityWord` 'seed' retirement — 4 render sites (none may be missed)

`_arcMaturityWord(arcId)` returns `'seed'` for a zero-sub-theory arc. Output rendered at **4 surfaces**
via 2 call sites:
1. `_searchBuildIndex()` → `#search` result crumb ("Arc · seed").
2. `_arcCardMeta2El()` (shared meta-line) → **Arcs-list "Your arcs" card** · **Arcs-list "Examples" card**
   · **own-profile `.op-arc` grid card**.
All four retire the literal together when EMBER replaces it.

## ⛔ THE DECISION GATE — a naming collision the SHAPE-B table never checked

**`ST_MARK_NAMES` (views.js) already ships BOTH "the seed" AND "the ember" as live on-screen sub-theory
MARK names** — the 16-glyph shape vocabulary ratified R5 S6, orthogonal to arc maturity. Resolved by
`_stMarkNameFor(sub)` and rendered live in the **arc-interior hover-tooltip**, the **symbol-picker preview
label**, and its **cell tooltips**.

Two distinct problems this creates, neither surfaced by the decisions §1 naming table (which only checked
`_arcMaturityWord` against the mockup word, never against this shipped array):

1. **"the ember" (mark #11) is ALREADY shipping.** The moment EMBER becomes the arc-status noun, "ember"
   means two unrelated things on one screen: an arc's lifecycle stage, and a mote's assigned symbol name.
   On an arc-interior tooltip a mote's shape can read "the ember" while its parent arc **is** an ember.
2. **"the seed" (mark #10) is a live on-screen string TODAY**, independent of `_arcMaturityWord`. Retiring
   `_arcMaturityWord`'s `'seed'` does **not** retire it. If T4/F1's forbidden-noun gate is literal ("never
   print the noun 'seed'"), a sub-theory whose glyph is #10 still prints "the seed" after Slice 3 ships —
   an unaddressed exposure.

**This is a FORK (THE FORK RULE) — Preston's call, three options:**
- **(A)** The forbidden-noun gate scopes to the **lifecycle/arc vocabulary only**; shape names are a
  separate ratified system (R5 S6) and "the seed"/"the ember" glyph names stand. EMBER ships as the arc
  noun; the on-screen coexistence is tolerable (different grammatical framing: "ember" the stage vs "the
  ember" the shape). *Cheapest; my lean, but it is Preston's word.*
- **(B)** EMBER is fine as the arc noun, but **"the seed" glyph (#10) must also retire** to honor a literal
  forbidden-noun reading — a bigger scope (the 16-name vocabulary is referenced in the frozen `arcs.html`
  mockup + the marks system; renaming one glyph ripples).
- **(C)** Pick a **different arc-status noun** than EMBER because "the ember" is already taken as a glyph
  name — reopens the naming table.

**Recommendation: (A).** The shape-name vocabulary and the lifecycle vocabulary are different registers,
and "the ember"/"the seed" (with the article, as *named marks*) don't read as the lifecycle nouns. But I
will not decide a locked-vocabulary question silently — **halting for Preston.**

## Render hooks for ember smallness (F2) — census, protected renderer untouched

- `_stLuminosity` (clamp [0.32,0.62]) lives in the **frozen** `arc-constellation.js` — untouchable.
- **The hook is `buildHomeFieldData(arcs)`** (views.js, NOT frozen): builds one field-node per arc with
  `maturity: _arcAggregateMaturity(id)` (returns 0 for a zero-sub-theory arc). An ember's brightness floor
  could be set here without touching the protected renderer.
- ⚠ Second surface: `_arcCardConstellation` (Arcs-list thumbnail, not frozen) **already varies node SIZE**
  per sub-theory (`15 + 13*mat`) and renders **blank** for a zero-sub-theory arc. F2 (brightness-only)
  must decide whether to leave this size-varying second renderer alone or extend it — a design call for
  the build prompt, flagged.

## Ground truth
HEAD `ba4888c` == origin/main · v3.212 · byte-locks 14,681 / 10,255 exact · no `r-arc-s3.md` yet
(consistent with nothing built). `docs/r-arc-plan.md` carries the uncommitted Slice-4 arc-picker finding
(expected, from this session).
