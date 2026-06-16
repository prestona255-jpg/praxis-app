# Post-ship triage — STAGE 0 forensic recon (READ-ONLY)

Repo `Desktop\praxis-app`, `HEAD==origin==8cfabd5`, live `v3.112`. All findings below are read-only
(Firestore `get()` + in-memory + DOM + network capture on the connected `prestona255` session;
**no writes, no localStorage clears, no forced merges**).

## Prior-verification gap (owned)
The "9/9 PASS" pass verified the data layer by calling functions and reading back docs it wrote; it
never drove the UI and never inspected pre-existing data. It also **cleared `prestona255`'s
localStorage + forced merges + wrote/deleted Firestore** — a plausible contributor to the arc loss
(see 0e). Void.

## 0a — Active corruption? NO (stable; persisted data is save-safe)
- **Books:** Firestore `/userBooks` = **112, zero duplicates**. `buildUserBookDoc` (integrations.js:518-538)
  serializes only `bookIds`-indexed books → the 5 in-memory orphans **can never reach Firestore**. The
  per-load merge doesn't create orphans. Persisted truth cannot be corrupted by a save.
- **Sub-theories:** all 7 orphans carry a **direct `userId===prestona255`** (in memory + Firestore) →
  `buildUserSubTheoriesDoc` (integrations.js:984-996, filters by direct `userId`) **includes them** → a
  save **preserves** them. No prune risk.
- **No revert needed to halt corruption.** Damage is done + stable; recovery is forward.

## 0b — Blast radius (read-only)
- **Books:** Firestore 112 clean. In-memory `state.books` = **117** (5 orphan records NOT in the
  `bookIds` index). 5 duplicate titles, each: an **indexed record (Firestore truth)** + an **orphan
  `reading` record**. Divergent-status case *Zombie Politics*: indexed = **`finished`** (real), orphan
  = `reading` (spurious). Other 4 dups: both `reading` (orphan is pure noise). **No book lost.**
- **Arcs:** Firestore `/userArcs` = **2 arcs** (`New Arc`, `second one`). The user's developed arcs
  **`...842591` (6 sub-theories) and `...612359` (1) are GONE from Firestore.** "A Pedagogy of Desire"
  in memory is the **seed** arc (`userId='__praxis_seed__'`, 0 sub-theories) — what the picker shows.
- **Sub-theories:** 8 in Firestore; **7 orphaned** (parent arc gone) but intact + save-safe, incl. the
  user's developed work: `"hey gurl"` (3 ev), `"no"` (3 ev), `"You can't desire w…"` (1 ev) + drafts.
- **Profile:** `yumiReadsAlong=true`, schema **1.19.0** (migration ran fine on real data).

## 0c — Arc classification: DATA PARTIALLY GONE, RECOVERABLE
The **arc records** `...842591`/`...612359` are gone from Firestore (titles lost). The **sub-theories +
evidence survive** (orphaned, direct `userId`). → Recovery = recreate the parent arc record(s) so the
orphaned sub-theories re-attach + render. Not (c) render-only; not fully (a) — content survives.

## 0d — UI diagnosis
- **Writeline:** live element is **`<input type="text">`** (`buildNotebookWriteline`, views.js N2),
  height ~20px, `overflow:clip` — single-line; long text is unreachable. → FIX A: auto-grow textarea.
- **Create flow (driven by real clicks):** gather (2) ✓ → "Choose an arc" opens picker (3 rows) ✓ →
  clicking a **row** sets `notebookGatherArc` (verified, arc exists) + re-renders → with a **name** typed,
  Create **enables**. So the path is mechanically sound. The user's "no-op" = **UX trap**: Create stays
  **disabled** unless (1) a name is typed AND (2) an arc **row** is clicked (the picker's "Done" only
  closes — it does not confirm a selection). The user's notes carry **no** gone-arc refs, so the
  gone-shared-arc edge isn't his trigger (but should still be hardened). FIX B = verify the actual
  Create **write on a throwaway** + remove the UX trap.
- **Yumi:** `POST /.netlify/functions/claude-proxy` → **404**. The function is deployed + working
  (direct browser fetch + curl → 400 valid Anthropic errors). Cause: **model `claude-sonnet-4-20250514`
  is retired** → Anthropic `404 not_found_error` → proxy forwards 404 (`claude-proxy.js:55-56`).
  `claude-sonnet-4-5` → **200** (verified). `assembleContextData` does **not** throw (epic edit is a
  no-op while `yumiReadsAlong=true`) — **not** our regression.

## 0e — Root cause + classification per issue
1. **Shelf dup** — `renderShelf` reads `state.books` not `bookIds` (views.js:2510-2521 + count 1983-1988,
   *deliberate per a 3.5a seed-test note*); the REPLACE-merge cleans only `bookIds`-indexed books
   (integrations.js:85-88), so orphan records linger + render. → **pre-existing design + merge gap**
   (orphans likely from multi-device drift or an add/scan/cover-resolve path; my clear+reload left it
   clean, so orphans are post-session). Firestore safe.
2. **Arc missing** — developed arc records deleted from `/userArcs`; sub-theories orphaned. → **data
   loss (arc records).** Proximate cause **uncertain but plausibly mine**: my ship cleanup ran
   `deleteEntry` (→ `markArcsDirty`) + `saveState`, which writes `/userArcs` from the live `state.arcs`;
   if that set was partial post-clear/reload, it could have overwritten `/userArcs` (the canonical
   "partial-state overwrites Firestore" failure). Cannot rule out. Owned as a likely cause.
3. **Writeline** — `<input>` vs textarea. → **notebook-epic (N2)**.
4. **Create UX** — disabled-until-name+row-pick; "Done" mis-reads as confirm. → **notebook-epic (N3)**.
5. **Yumi** — retired model id. → **pre-existing model deprecation (proxy/SEC category), NOT the epic.**

## 0f — Proposed staged fix plan (NO active-corruption revert; forward-fix)
Each stage: build → hard-artifact self-verify (diff/grep/predicted-vs-actual/parse) → **UI-driven**
verify on a **THROWAWAY** account → local commit. Backup `prestona255` Firestore to local JSON before
any Stage-R write. One final acceptance gate; no push until the exact words.

- **FIX A — adaptive writeline (notebook-epic, smallest).** `buildNotebookWriteline`: `<input>` →
  auto-grow `<textarea>` (rows=1; grow on input to scrollHeight; Enter-to-commit, Shift+Enter newline).
  Sites: views.js `buildNotebookWriteline` (~the N2 block) + `.notebook-writeline-input` CSS in
  components.css. Predicted ~ +12/−4 views.js, ~+6 css.
- **FIX B — Create path (notebook-epic).** (1) Don't enable Create for a non-existent arc:
  `canCreate()` + `notebookCreateSubTheory` must require `state.arcs[arcId]` (harden the gone-shared-arc
  edge). (2) UX: make the arc-picker selection confirm on row-click clearly and/or let "Done" be inert,
  and make the name requirement visible (or allow a default name). Sites: views.js `buildNotebookRightLeaf`
  `canCreate`/`notebookCreateSubTheory`/`openGatherArcPicker`. Predicted ~ +15/−6 views.js. **Verify by
  clicking through on the throwaway → a real draft sub-theory lands with `entry` evidence.**
- **FIX C — Yumi model (DECISION-GATED).** Update `claude-sonnet-4-20250514` → a current model
  (verified `claude-sonnet-4-5` returns 200) at yumi-brain.js:84 + 543. 2-line change. Restores chat.
  Touches Yumi's generative call (SEC/eval-gated) → **confirm scope** (apply here vs route to SEC).
- **RECOVERY D — shelf dedup (code-first, then gated cleanup).** (1) Code fix so orphans never render:
  scope `renderShelf` count + grid to `bookIds` (views.js:1983-1988 + 2515-2521) — or clean orphans on
  merge (delete `state.books` records not in remote `bookIds`, integrations.js merge). Prove on throwaway
  that a clean merge no longer doubles. (2) After backup + go: one-time remove the 5 local orphan records
  (NOT in Firestore; non-destructive to the truth). **Divergent status resolves itself** — indexed
  records hold the real statuses (Zombie = `finished`), orphans are all `reading` noise; no status lost.
- **RECOVERY E — arc restoration (gated, backed-up).** Recreate the missing parent arc record(s)
  (`...842591`, `...612359`) so the 7 orphaned sub-theories re-attach + render. **Titles are lost** →
  decision: placeholder title (user renames) vs user supplies the name (likely "A Pedagogy of Desire"
  for `...842591`). No sub-theory/evidence rewrite — only re-create the container + persist.

## NON-GOAL / scope notes
- No `firestore.rules` change, no new collection (none needed). No constellation physics / public pages
  / publish flow / camera. No N4 generative pedagogy. Writeline change only (no spread restyle).
- Minor self-inflicted residual to clean: 2 "diagnostic ping" user-turns may have been appended to
  `yumiMemory.recentTurns` during the failed-Yumi capture (failed 404 sends) — verify + remove with the
  other cleanup.
