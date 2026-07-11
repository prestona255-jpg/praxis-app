# R8 — Values · Stage-0 recon

- **Round:** R8 Values (DEEP, five-beat). Preston-directed jump ahead of `Now = S-A` (record in Re-plan log at close).
- **HEAD at recon:** `f086243` · **origin/main:** `f086243` (0/0 — Stage 1b IS pushed; FIRST CHECK #1 ✅).
- **Live cache:** `praxis-v3.194` (sw.js:10).
- **Recon method:** 8 parallel read-only threads, grep→ranged-view discipline, 0 errors, 150 tool-calls, 664k tokens. Full agent output: workflow `wf_8dd7c7ac-09f`.
- **Date:** 2026-07-11.

---

## 0. FIRST-CHECK results + stale-premise corrections

| Check | Result |
|---|---|
| f086243 on origin/main | ✅ pushed (no gated push needed). MW-1/2/3 + 1b "SHIPPED-LOCAL NOT pushed" notes in sequence.md / memory are **stale** — all pushed. |
| Overnight batch | ON-1 (menu overlay) + ON-4 (header search) are `queued`, **unrun** ("no runs yet"). ⚠️ **ON-7 does not exist** in overnight.md — the round names a nonexistent item. Batch is a during-round night job gated on "R8 work committed"; not for now. |
| Six named memory files | ⚠️ **None exist** (`praxis-studio-protocol`, `praxis-reading-model-v2`, `praxis-evolution-spec`, `preston-writing-pass-friction-notes`, `praxis-onboarding`, `praxis-user-themes`). Proceeding from the rulings restated in the round prompt + repo ground truth. The soft design context (reading-model, "flagship ask in his words", value-lineage / dad's notes framing) is reconstructed at SHAPE-A for Preston to correct. |

**Stale premises found in the round framing (corrected against live code):**
- **profile.values ALREADY EXISTS** — the round treats "the values data layer" as new; half of it is already built, guarded, and migrated (see §1).
- **"Journey drops the user on Home" (IA4) is FIXED** — `599a6dd` (2026-07-07) re-points the release exit to `#book/<shelvedId>` or `#notebook` (intros.js:387-396). The remaining onboarding gap is **OG6 only** (entry: arc-deep-link entrants get no journey, yumi-ui.js:844).
- **"July-3 intro redesign" IS real** — `7eef1de` (2026-07-03, W9, v3.173). That premise holds.

---

## 1. THE HEADLINE — Values is two layers, and one already exists

### Layer 1 — DECLARED values ("the stones") — **ALREADY BUILT**
`profile.values` = per-user `[]` of trimmed strings, **declared by the reader, never inferred** (Yumi does not write here).
- Default in profile shape — `state.js:1229` (`values: []`).
- Sanitized in `setProfile` to trimmed non-empty strings — `state.js:1392-1398`.
- **Account UI already collects + persists it** — `accountValuesPersist()` / `accountValuesCollect()` (views.js:17584-17589, 17522-17664): `setProfile(uid,{values:[...]})` + `saveProfileToFirestore`.
- **Guarded-sync-safe on BOTH Firestore load paths** — `integrations.js:544` + `973` (the migrate-bypass twin-trap is *already handled* for values).
- Migrated — schema 1.24.0→1.25.0 (`state.js:3222-3241`).
- Read display-only by `_portraitEmblem` (views.js:16073) which already tallies declared-values count + lenses + books-per-tradition.

**⇒ The onboarding "preset moment" writes to an EXISTING, already-guarded field via the EXISTING `accountValuesPersist` idiom. No new collection, no migrate touch, no new sync guard for the declared half.**

### Layer 2 — value-MARKS ("weight things carry") — **the genuinely new build**
The attachment thread from ruling (a): quiet per-object marks tying an owned object (book / sub-theory / arc) to value(s). **This is where the moved-me register lives.**
- **Precedent = `movedMe`** (book boolean, `state.js:419`; render+self-save toggle views.js:9007-9022). The prompt's "the moved-me register" literally points at this existing field.
- Marks on sub-theory + arc = add a field to `ensureSubTheoryFields` (state.js:638) / `ensureArcFields` (state.js:741) + the `create*` literals + a render seam + a self-saving toggle. **Byte-for-byte analogue of movedMe ×3.**

### Layer 3 — the retrofit (the ONE generative piece)
Yumi suggests values for the existing library, **eval-gated, never auto-applied** — mirrors `generateLenses` + the Name-it/Rename/Not-this adoption UI (see §4).

### Consumers (design the data shape; build nothing)
- **Shelf filter row** — one row in the existing sidebar rail (§5).
- **Profile value-load** (R9) — display-only tally of marks per value (§6).

---

## 2. THE GUARDED-SYNC MANDATE (Layer-2 marks) — non-negotiable

Ruling: *any NEW sync collection ships WITH the pendingBookSync-style guard from day one; FX-1 is parked; we do not add a 6th unguarded collection.*

**Recon recommendation (Threads 2 + 7 + 8, unanimous): use per-object fields, NOT a new value→objectRef collection.**
- A per-object mark rides the object's **own already-guarded doc** (userBooks / userArcs / userSubTheories) — zero new sync lane, zero new Firestore-rules block, zero 6th-collection risk.
- The `ensure*Fields` chokepoint is the exact mechanism that keeps a new field alive across the REPLACE-splat merge — add the field there and it is merge-safe for free (the twin-trap fix).
- A separate value collection would multiply the cross-collection referential-integrity surface: a value-row can orphan when its object is deleted in a separately-merged doc (the arc/sub-theory white-screen bug class).

**The append-step migration pattern** (state.js:3399 template): one new `if (SCHEMA_VERSION === X) { ensure*FieldsAll(...); SCHEMA_VERSION = Y; }` step **AND** the same `ensure*FieldsAll` on the integrations.js merge path (the migrate-bypass twin). Current chain runs to `1.28.0`.

**Books seam (Thread 7):** `state.books` is a global catalog keyed by bookId, but it's persisted **per-user** inside `/userBooks/{uid}` (buildUserBookDoc writes each book record whole). So `movedMe`-on-book is already effectively per-user and merge-safe — the movedMe precedent is the proven path. (A *central* value index would reintroduce the leak concern; per-object fields sidestep it.)

**Write-path asymmetry to respect (Thread 8):** `createSubTheory` self-saves; `createArc` does NOT (defers to caller); `updateSubTheory` only writes header/body fields. ⇒ a mark toggle must call `markXDirty()` + `saveState()` **itself** (like the book handler), never route through `updateSubTheory`.

---

## 3. THE THREE-AXIS BOUNDARY (verified distinct at 3 storage layers)

| Axis | Means | Storage | Cardinality |
|---|---|---|---|
| **Categories** | what a book **IS** | per-book fields `category`/`categoryOverride`/`rawCategories` (state.js:411-419), 17-label taxonomy (state.js:491), `classifyBookLocal` override→cache→keyword | 1 per book |
| **Lenses** | how the shelf is **ARRANGED** | `userThemes[id]={id,userId,name,bookIds:[]}` owner-keyed collection (state.js:2096) + derived genre lenses; view toggle `praxis_shelf_grouping` | many-to-many, arrangement-only, **Yumi-blind** |
| **Values** | weight things **CARRY** | *(new)* per-object mark field(s) referencing a value vocabulary | TBD (fork §7) |

**⚠️ NAMING: the key `values` is TAKEN** by `profile.values` (declared stones). The new **mark** field must use a distinct key (e.g. `valueMarks` / `carriedValues`). The *vocabulary* (the slug strings) can still be shared with `profile.values` — that's the join, not an alias (§7 fork).

---

## 4. THE RETROFIT TEMPLATE (Layer 3) — anchors

- **Generation:** `generateLenses(meta)` — one-shot claude-proxy call, `claude-sonnet-4-6`, max_tokens 1024, `x-praxis-key`, returns raw text, no transcript write (yumi-brain.js:941). Clone → `generateValueRetrofit` with a new `VALUE_GEN_SYSTEM`.
- **Metadata-only gather** (covenant-preserving): `gatherLensLibraryMetadata` sends only title/author/genre + existing names (yumi-brain.js:875-936). Covenant copy is load-bearing: *"from your titles, authors, and genres only — never from inside your books, and never from your private notes."*
- **The "eval gate" for suggestions = `evalLensResponse`** — a **pure-client** structural+grounding validator (≥2 real library titles, structural cap 5, junk blocklist, fail-safe to `[]`; yumi-brain.js:1005). **NOT** the LLM grader. Clone → `evalValueResponse`.
- **The LLM 3-layer fail-closed grader = `gradeUtterance`** (yumi-brain.js:722) — Fidelity / No-leakage / Stance, fail-closed on every path, shared daily budget `praxis_yumi_gate_budget` (200/day). Reserved for *utterances*; the lens feature does NOT route suggestions through it. Optional for a value's reader-facing "why" line.
- **Never auto-applied:** adoption is an explicit click — lens panel `Name it / Rename / Not this` (yumi-ui.js:1608) OR the reader-portrait offer-card `that's it / rename ✎ / reject` (views.js:17857). **The portrait offer-card is the closest home** — it already has a "Your lenses" axis + a non-generative category sibling through one confirm/rename/reject widget.
- **Seam:** two parallel drivers already duplicate the generate→validate→surface→adopt logic (lens panel + portrait). Factor a shared helper or pick ONE pattern — do not add a blind 3rd copy. Export-name alias trap: brain fn is `gatherLensLibraryMetadata` but exported/called as `gatherLensMetadata` (silent 'error' state if mis-wired).

---

## 5. SHELF FILTER ROW (consumer, cheap) — anchors

The **Filters sidebar** (`.shelf-side` rail, `#shelf-filters-btn`) is the home — **not** the MW-1 Manage sheet (that's tools). A value filter is **one row-group, zero new machinery**:
1. one key on `shelfFilter` (views.js:5812): `value:null`.
2. a `valueSection` built exactly like `statusSection`/`authorSection`; rows carry `data-filter-section='value'` + `data-filter-value` and wire the **shared** `onShelfFilterRowClick` (views.js:4888 idiom).
3. `sidebar.appendChild(valueSection)` — natural slot after Reading-status (~4765) or before Author (~5023).
4. one predicate in the apply pass (~5169): `valueOk = shelfFilter.value===null || <fb carries value>`; append `&& valueOk` at 5176.
5. **must also** add `shelfFilter.value!==null` to the `filterActive` OR-chain (5268-5274) — miss it and a zero-result value filter reads as "shelf is open" not "nothing matches."

`toggleShelfFilter` exclusive-clear is generic (`for sk in shelfFilter`) — new section joins single-select free. CSS already exists (`.shelf-filter-group/-label/-list`, components.css:2016 + the `.lum-amber-deep` twin 11543) — no new CSS. Counts must read the **deduped** shelf set (orphan-safe).

---

## 6. R9/R10 DATA-SHAPE CONTRACT (design now, build nothing)

**Value-load aggregation contract** (R9 builds read+tally+render; R8 owns storage + write UI):
```
INPUT  — marks R8 places on the reader's owned carriers, keyed by the profile.values vocabulary:
         subTheories[id].valueMarks[]  where userId===uid
         arcs[id].valueMarks[]         where userId===uid
         books                         via userBooks[uid].bookIds → the book's mark field
OUTPUT — valueLoad = { <valueSlug>: <count of owned objects carrying it> }
         (optional per-carrier: { <slug>: { books, subTheories, arcs, total } })
COMPUTE— one display-only _profileValueLoad(uid): build the tally ONCE per render
         (the _buildArcSubsIndex / _portraitEmblem facet-tally discipline, views.js:3676 / 16073).
         No state mutation, no persistence — design-canon §4-G "counts are display-only."
```
**Render site:** the deferred `.op-conseq` "What your thinking has done / Your work is **load-bearing** in —" placeholder (views.js:16414) already frames value-load — OR a new `.op-values` section. **Collision:** `loadOwnProfileSocial` async-patches that `.op-conseq` `<b>` with build-on count (views.js:16549) — if R9 reuses it for value-load, re-home the social patch. **PA3:** current em-dashes never resolve on read-failure — R9 must render an honest empty state for zero value-load, not a repeat of the "reads-as-broken" placeholder.

R10 (Connections: values × ideas × books × arcs) consumes the same per-object marks — the per-object-array shape serves both consumers without a central index.

---

## 7. THE FORKS (for SHAPE-A — Preston's calls)

1. **Architecture — the declared↔marks relationship + naming.** Do value-marks draw from the **declared vocabulary** (`profile.values` becomes THE value vocabulary; marks reference its slugs → clean declared-vs-carried join for the profile) *(recommended, Model A)* — or a **separate mark vocabulary** (needs a mapping layer; profile can't cheaply compare, Model B, argued against). Mark field key stays distinct (`valueMarks`) regardless.
2. **Mark shape + relationship to movedMe + lineage/provenance.** Is a mark (a) a bare tag; (b) a tag **+ a short "why"/lineage line** (echoes the lens "why" + the "value-lineage / whose thought you carry" frame from the missing spec) *(recommended — lineage is central to the round)*; and does it **sit beside `movedMe`** *(recommended)* or subsume it? `movedMe` today has **no provenance** — lineage forces a richer shape than boolean.
3. **R8 build scope** (multi-select): preset moment (onboarding beat) · marks on **book** · marks on **sub-theory** · marks on **arc** · Yumi retrofit (eval-gated) · Shelf filter row. Recommend **all six** — marks ×3 are cheap movedMe-analogues; the filter row is the payoff (one row); retrofit is the ruling's one generative piece.
4. **Starter preset SET** (content approval — required by the ruling). Proposed set grounded in critical pedagogy + a value-lineage frame — see SHAPE-A. Approve / edit / reframe.

**Carried recommendations (refinable at mockup, not blocking):**
- Onboarding: add a **new `values` beat** after `covenant`/`stance` (the `stance` beat is a decoy — a 3-way preset that *never persists*; no `yumiStance` field). Persist inline on click via `doValues(arr)` = `setProfile({values})`+`saveProfileToFirestore` (the accountValuesPersist idiom). picked accumulator gains a `values` field. OG6 entry-gap (arc-deep-link → no journey) is out of R8 scope unless folded.
- Retrofit home = the Account reader-portrait offer-card; eval = structural `evalValueResponse` (no LLM-grader spend), covenant copy preserved verbatim.

---

## 8. MECHANICAL NOTES for the build
- Strict ES3 (`var`/`function`, string concat, two-arg `.then`, `for`-loops). Universal v1.2 tokens; no new hex.
- Any views.js/state.js/intros.js/components.css change → **CACHE_VERSION bump last** (v3.194 → v3.195), one per stage, commit-no-push.
- Live Forensic Smoke Test triggers (views.js + shared CSS): Shelf + Arcs(List/Web) + Notebook + Sub-theory + Book detail + console scan; counts==data.
- prestona255 read-only ALWAYS; prestonpraxistest for behavioral write tests (fresh throwaway, non-destructive).
- Anything new that renders ships mobile-canon-native (P1–P9) — no fresh mobile debt.
