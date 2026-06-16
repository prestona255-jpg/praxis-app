# Notebook N0 — recon + data-model proposal (ZERO code · DECISION GATE)

**Stage:** N0, first of the Notebook N0–N3 epic. Produces this recon doc + a
written data-model proposal, then **STOPS for Preston's green-light**. No app
code, no commit, no deploy was written by N0.

**Repo state (recon item 7) — attested before any reading:**
- `git rev-parse --show-toplevel` → `C:/Users/pallen/Desktop/praxis-app` ✓
- remote `origin` → `github.com/prestona255-jpg/praxis-app.git` ✓
- branch `main`; `HEAD == origin/main == 0d5d4f8f774f7eb49e8d898f0c8e9654a37d9232` ✓
- No **tracked** file dirty. Untracked, pre-existing only (`design/`, two PDFs,
  one screenshot, `docs/checkpoints/10-5-8*.md`) — none touched by N0. This doc
  adds one more untracked file under `docs/checkpoints/`.
- Live SW: `CACHE_VERSION = 'praxis-v3.111'` (`sw.js:10`). Matches the brief.
- Current schema: default literal `1.9.3` (`state.js:268`,`:792`) walks
  `migrate()` to terminal stamp **`1.18.0`** (`state.js:1965`; no block consumes
  `'1.18.0'`). **Next migration step for this epic = `1.18.0 → 1.19.0`.**

---

## PART 1 — RECON (file + line citations, real signatures)

### 1. Note storage

- **Store:** `state.notebookEntries` — a **plain object keyed by `entryId`**
  (NOT an array). Declared `notebookEntries: {}` at `state.js:276`; reset to `{}`
  in `replaceState` (`state.js:788`); serialized **directly** in the save payload
  (`state.js:776`).
- **Entry shape** — documented at `state.js:36-46`, confirmed verbatim by both
  live creation sites:
  ```
  {
    id:         string,
    userId:     string,                   // owner uid (direct ownership)
    register:   'journal' | 'marginalia', // the ONLY two kinds (see flag F1)
    isPrivate:  boolean,                  // register-default at creation; per-entry-flippable today
    body:       string,                   // raw text / markdown (no title field)
    bookIds:    string[],                 // FKs into state.books
    arcIds:     string[],                 // FKs into state.arcs
    createdAt:  number,                   // ms epoch
    updatedAt:  number
  }
  ```
- **No `kind`/`type` field beyond `register`.** No `question` register exists
  (`grep 'question'` across `js/` → **0 matches**). No title field (entries are
  body-only; `openEditor showTitleField:false` for both).
- **No sub-theory link ON the entry** — the note→sub-theory relation is one-way,
  stored on the sub-theory's `evidence[]` (see item 4); the entry is unaware.
- **ID gen:** `genEntryId()` (`state.js`, alongside `genEvidenceId` at `:657`).
- **CRUD (real):** create is inline in `openJournalEditor` (`views.js:955`, shape
  `:965-975`) and `openMarginaliaEditor` (`views.js:7140`, shape `:7150-7160`);
  `deleteEntry(entryId)` (`state.js:951`); arc linkage `addEntryToArc(arcId,
  entryId)` (`state.js:881`), unlinked in `deleteArc`/`deleteEntry`.
  **There is no `updateEntry` (no body-edit path)** — post-creation mutations are
  only `isPrivate` (`togglePrivacy`) and `arcIds`. (See flag F2.)

### 2. Book linkage + sections (Inbox / Journal mapping)

- **Book linkage:** `entry.bookIds` (array of book FKs). Marginalia born with
  `bookIds:[bookId]` (`views.js:7156`); journal born with `bookIds:[]`
  (`views.js:971`).
- **Per-book "banks":** the data already supports a bank with **no new field** —
  the set of entries whose `bookIds` contains a given `bookId`. Today the Notebook
  view does NOT bank-group: `renderNotebook` builds ONE flat chronological stream
  of all the user's `notebookEntries` + `bookArtifacts`, interleaved by `createdAt`
  desc (`views.js:789-836`). A book's marginalia is shown separately on book-detail.
- **Journal section** → `register:'journal'` entries (direct).
- **Inbox (quick-capture)** → **no concept exists today.** Closest analog: a
  journal entry with `bookIds.length === 0` (unfiled). Mapping Inbox onto current
  data is a genuine fork (see proposal A / flag F3).
- **Counts for tabs:** derivable client-side (loop + filter), the pattern
  `getAggregateCounts(uid)` already uses (`yumi-brain.js:340`).

### 3. Visibility

- **Field:** `entry.isPrivate` (boolean). Stamped at creation from the per-kind
  default via `getRegisterDefault(register)` (`views.js:7866`), which reads
  `state.users[uid].registerDefaults[register]`.
- **registerDefaults seed:** `{ journal: true, marginalia: false }`
  (`ensureUser`, `state.js:669`) → **journal private, marginalia visible.**
  CONFIRMED matches the brief.
- **Per-entry toggle TODAY (being removed):** `togglePrivacy(entryId)`
  (`views.js:7881`), surfaced as the "Make visible / Make private" link in
  `renderNotebookEntry` — **the only call site**, `views.js:7669-7677`. A
  separate read-only **visibility indicator** ("Private" / "Visible to Yumi" dot)
  sits at `views.js:7634-7643` (a readout, not a control).
- **Register-default settings UI:** `openNotebookSettings()` (`views.js:7899`) —
  a Visible|Private segmented pill **per register** (`:7948-7949`), writing via
  `setRegisterDefault(register, isPrivate)` (`views.js:8014`). This is the closest
  existing thing to a "master switch," but it is **two per-kind defaults**, not one.
- **Yumi read filter (single enforcement point):** `assembleContextData()`
  (`yumi-brain.js:178`). The notebookEntries loop **skips `isPrivate === true`**
  (`yumi-brain.js:217-220`); same predicate for `bookArtifacts` (`:266`) and in
  `getAggregateCounts` split-by-register (`:374-381`). It is exposed as BOTH
  consumers: `buildContext` (prose blob, `:394`) and `getContextSnapshot`
  (`getContextSnapshot: assembleContextData`, `yumi-brain.js:573`).
  **Yumi filters on `isPrivate` ONLY.** CONFIRMED. (Matches memory: the filter
  site is load-bearing; do not introduce a parallel path.)

### 4. Sub-theory / arc / evidence linkage (N3 must REUSE this)

- **Sub-theory store:** `state.subTheories` keyed by id. Created via
  `createSubTheory(arcId, fields)` (`state.js:980`); record shape `:986-1004`
  includes `arcId` (parent-arc FK), `userId`, `header`, `bodyPublic`,
  `bodyIntellectual`, `evidence: []`, `status:'draft'`, `markColor`, x/y, etc.
  `createSubTheory` REQUIRES a valid `state.arcs[arcId]` (returns null otherwise).
- **Sub-theory ↔ arc:** `subTheory.arcId`. The arc holds no sub-theory list; the
  link is the child's `arcId`.
- **Evidence element shape** (built by `addEvidence`, `state.js:1240-1248`):
  ```
  {
    id:         'evidence_<ts>_<rand>',   // genEvidenceId()
    kind:       'book' | 'entry' | 'external',
    refId:      bookId | entryId | <genEvidenceId for external>,
    external:   { title, author } | null,
    quote:      string,
    annotation: string,
    addedAt:    number
  }
  ```
- **The note→evidence path (EXISTING — to REUSE):**
  `openEntrySendToSubTheory(entryId, mountEl)` (`views.js:7574`)
  → `buildSubTheoryPickerPanel('entry', entryId, entryBody)` (`views.js:7419`),
  which lists **draft** sub-theories grouped by arc (`status === 'draft'` filter,
  `:7449`)
  → row tap → `addEvidenceToSubTheory(stId, {kind:'entry', refId:entryId,
  quote:body})` (`state.js:1286`)
  → dedupe `isEvidenceAttached(stId,'entry',entryId)` (`state.js:1263`)
  → `addEvidence(...)` appends to `subTheory.evidence[]` (`state.js:1213`).
  A notebook entry therefore becomes evidence as `{kind:'entry', refId:<entryId>}`.
- **Persistence of the reused calls:** `createSubTheory` and `addEvidence` call
  `markSubTheoriesDirty()` + `saveState()` (`state.js:1006-1007`, `:1251-1252`), so
  evidence rides the existing `/userSubTheories` Firestore flush. The notebook
  entry itself is NOT mutated by gathering, so `/userNotebook` is untouched.

### 5. Render

- **View fn:** `renderNotebook()` (`views.js:668`). **Route:** `'notebook'`
  (`activeRoute = 'notebook'` at `views.js:372`; route map comment `views.js:9`).
- **Reads:** `state.notebookEntries` + `state.bookArtifacts`, filtered to the
  signed-in user, interleaved by `createdAt` desc into one `.notebook-entries-panel`
  stream (`views.js:789-836`); dispatched to `renderNotebookEntry(entry)`
  (`views.js:7599`) / `renderArtifactCard`.
- **Header affordances** (`views.js:696-732`): "+ New entry" (`openJournalEditor`),
  "+ New arc" (`openArcEditor`), "Settings" (`openNotebookSettings`), and
  **"What Yumi sees"** → `openTransparencyView` (`views.js:725-732`, `:8030`).
  The transparency anchor the locked design names **already exists.**
- Per-render empty mount hosts: settings / transparency / editor / arc-editor
  (`views.js:746-771`).

### 6. Firestore mirror (`/userNotebook`)

- **Doc model:** one denormalized doc per user at `/userNotebook/{uid}` —
  `{ schemaVersion, notebookEntries: {entryId:{...}}, updatedAt:
  serverTimestamp }`, FILTERED to `entry.userId === uid` (`buildUserNotebookDoc`,
  `integrations.js:869-887`).
- **Write:** `saveNotebookToFirestore(uid, payload)` — full-doc `.set()`
  overwrite, fire-and-forget, typed callback (`integrations.js:892-917`).
- **Flush trigger:** `notebookDirty` flag (`state.js:578`) set by
  `markNotebookDirty()` (`state.js:580`); consumed in `saveState()` at
  `state.js:1428-1445` → `buildUserNotebookDoc` → `saveNotebookToFirestore`.
  Callers of `markNotebookDirty`: create (`views.js:977`,`:7162`), `togglePrivacy`
  (`views.js:7885`), `addEntryToArc`/`deleteEntry` (`state.js:894`,`:970`).
- **Load/merge (auth observer):** `loadNotebookFromFirestore(uid)`
  (`integrations.js:833`) on sign-in → **REPLACE-merge**: clear this uid's local
  entries, splat remote, then a **merge-boundary normalizer** forces
  `register==='journal'` entries to `isPrivate=true` as they land
  (`integrations.js:318-335`) because the splat **bypasses `migrate()`**; re-marks
  dirty + saves only if something changed.
- **Implication for later N-stages (the migrate-bypass gotcha):** any NEW entry
  field must be (a) added at both creation sites; (b) backfilled in `migrate()`
  **AND** normalized at the `integrations.js` merge boundary (the splat skips
  migrate); (c) it then auto-rides the existing `/userNotebook` full-doc write
  (`buildUserNotebookDoc` serializes the whole entry object — no write-side change).

### 6b. (load-bearing for the proposal) — user-record fields are NOT synced

- `registerDefaults` lives on `state.users[uid]` and is **never mirrored to
  Firestore.** `/userProfiles` persists only `{displayNameOverride, penName,
  tagline, onboardingSeen, updatedAt}` (`saveProfileToFirestore` `.set(...)`,
  `integrations.js:615-626`; merge reads the same set, `:360-365`). So **by-kind
  visibility defaults are per-device today.** Any new user-level visibility
  control (the master switch) inherits that limitation unless explicitly added to
  a mirrored doc. (See proposal B / flag F4.)

---

## PART 2 — DATA-MODEL PROPOSAL (written, not built)

### A. BANKS + Inbox + Journal (the spread's top tabs + counts)

| Tab | Maps to | New field? | Migration? |
|---|---|---|---|
| **Journal** | `register:'journal'` entries (filed) | none | none |
| **Bank: <book>** | entries whose `bookIds` ∋ that bookId | none | none |
| **Inbox** | quick-captures awaiting distill | **fork — see below** | depends on fork |

Banks and Journal need **no schema change** — both are derivations over the
existing `(register, bookIds)` fields, with counts computed client-side
(`getAggregateCounts`-style loop). Inbox is the only open question.

**Inbox fork (F3 — Preston decides):**
- **Option I-A — derive, zero migration.** Inbox = `register:'journal'` entries
  with `bookIds.length === 0`. Quick-capture writes a journal entry; filing it to a
  book adds a bookId (moving it from Inbox into that book's bank). Pro: no field,
  no migration. Con: conflates "a journal thought I want to KEEP as journal" with
  "a raw capture awaiting triage" — they become the same bucket, and "manual
  distill" has no durable state.
- **Option I-B — one explicit boolean (recommended).** Add `filed: boolean` to the
  entry. Quick-capture sets `filed:false` (→ Inbox); distilling sets register /
  bookIds and `filed:true`. Existing entries migrate to `filed:true` (nothing lands
  in Inbox retroactively). Pro: Inbox is a real, durable triage state distinct from
  Journal; matches "quick-capture→Inbox" + "manual distill". Con: one boolean +
  one `migrate()` step (`1.18.0→1.19.0`) + one merge-boundary normalizer line +
  rides `/userNotebook` (free on the write side). Cost is exactly the established
  `isPrivate` pattern.
- **Recommendation: I-B (`filed`).** Sub-question if I-B: quick-capture stamps
  `register:'journal'` at capture (simplest — `register` stays always
  journal|marginalia, and the Yumi prose already does `register||'journal'`), and
  distill may reassign to marginalia + a bookId. (Leaving `register` empty until
  distill is possible but widens an invariant currently relied on everywhere.)

### B. By-kind visibility + ONE master switch + remove per-entry toggle

**Keep the enforcement point.** `entry.isPrivate` stays the field Yumi's filter
reads — do NOT rip out the `isPrivate === true` skip in `assembleContextData`
(the single load-bearing site). Continue stamping it at creation from the by-kind
default.

**Changes:**
1. **Remove the per-entry toggle.** Delete the "Make visible/Make private"
   affordance (`views.js:7669-7677`) and `togglePrivacy` (`views.js:7881`). The
   read-only visibility indicator (`views.js:7634-7643`) can stay as a per-entry
   *readout* (now driven purely by kind default + master switch).
2. **Add one master switch** — a user-level boolean `yumiReadsAlong`
   (default `true`). Semantics: when **OFF**, nothing crosses to Yumi (everything
   treated as private); when **ON**, the by-kind policy applies (marginalia
   visible, journal private).
3. **Yumi filter gains ONE guard term** in `assembleContextData`: if the active
   user's `yumiReadsAlong === false`, the collected entries/artifacts set is empty.
   Single point, consistent with principle #5.
4. **By-kind default** stays as `registerDefaults` (journal private / marginalia
   visible) — the creation-time stamp. The two-pill `openNotebookSettings` UI is
   replaced by the single master switch (the per-kind pills retire).

**Field additions:** `state.users[uid].yumiReadsAlong: boolean` (seeded in
`ensureUser`, default `true`; backfilled on every user in the `1.18.0→1.19.0`
migration step).

**Forks for Preston:**
- **F4 — sync home (must resolve).** `registerDefaults` and the user record are
  **localStorage-only** (recon 6b). If `yumiReadsAlong` lives there too, the master
  switch is **per-device** — Yumi could be "off" on the phone but reading along on
  the laptop, which undercuts a consent control. To sync it, add `yumiReadsAlong`
  to `/userProfiles` (`saveProfileToFirestore` `.set` + the merge read + `setProfile`)
  — a real (small) `integrations.js` change. **Recommend: mirror via `/userProfiles`.**
- **F5 — legacy `isPrivate` on toggle removal.** Existing journal entries are
  already uniformly private (the `1.14.0→1.15.0` honesty flip, `state.js:1879-1912`).
  Existing **marginalia** may have been manually flipped private by users. On
  removing the per-entry toggle: **(i)** re-normalize every entry to its kind
  default in `1.19.0` (clean "by-kind" story, but discards deliberate hiding), or
  **(ii)** preserve stored `isPrivate`, govern only go-forward + the master switch
  (safe, but a few legacy marginalia won't match the by-kind narrative).
  **Recommend (ii)** — never surface writing a user deliberately hid.

### C. Gather → sub-theory (REUSE recon item 4)

**No new linkage model, no schema change, no migration.** N3's gather is a
**view-layer driver** over the existing evidence path:

1. User multi-selects N left-leaf notebook entries ("gather").
2. Target a draft sub-theory — existing, or newly created via
   `createSubTheory(arcId, {...})` (requires an arc; see note).
3. For each gathered entry: `addEvidenceToSubTheory(stId, {kind:'entry',
   refId:entryId, quote:entry.body})` — dedupe is built in.

- **Field additions:** NONE (entry unchanged; `evidence[]` already holds
  `{kind:'entry', refId}`).
- **Firestore:** sub-theory side rides the existing `/userSubTheories` flush
  (`markSubTheoriesDirty` + `saveState`); `/userNotebook` untouched. No mirror change.
- **F6 — arc context for a NEW sub-theory.** `createSubTheory` requires a parent
  `arcId`, and the picker only lists `status:'draft'` sub-theories. If the spread's
  right-hand "working page" is reached per-book (no arc in context), gather-into-a-
  *new* sub-theory must first establish/choose an arc. This is a UX adjacency, not
  a data-model change — flag so N3 wires arc selection rather than assuming one.

---

## PART 3 — FLAGS / FORKS SUMMARY (decisions for Preston)

- **F1 — "question" kind.** The brief's item-1 lists `marginalia | journal |
  question`, but **no `question` register exists** (0 grep matches; "question" in
  Praxis = the *arc's* central question, not a note kind). Decision: does the epic
  introduce a third entry kind `question` (→ new register value + creation path +
  a private/visible default + migration), or was "question" the arc question and
  out of the entry model? **Need scope confirmation.**
- **F2 — no note body-edit path.** Entries are create + delete + isPrivate-flip +
  arc-link; there is **no `updateEntry`**. "Manual distill" (refining a raw Inbox
  capture) implies an edit path — a small net-new CRUD fn that marks `/userNotebook`
  dirty. Confirm it's in epic scope (likely N2/N3).
- **F3 — Inbox model** (proposal A): derive (I-A) vs explicit `filed` boolean
  (I-B, recommended).
- **F4 — master-switch sync home** (proposal B): localStorage-only (per-device) vs
  mirror to `/userProfiles` (recommended). Material to the privacy story.
- **F5 — legacy `isPrivate`** on per-entry-toggle removal: re-normalize vs preserve
  (recommend preserve).
- **F6 — arc context** for gather-into-new-sub-theory (proposal C): a UX wiring
  note for N3, not a schema change.

**Net schema footprint if recommendations are taken:** one migration step
`1.18.0 → 1.19.0` adding `entry.filed:boolean` (default true) and
`user.yumiReadsAlong:boolean` (default true), both following the established
`isPrivate` pattern (creation-site stamp + `migrate()` backfill + merge-boundary
normalizer), plus a `/userProfiles` field for the master switch. Gather (C) and
Banks/Journal (A) add **zero** schema.

---

## DECISION GATE — HARD STOP

N0 wrote zero app code, made no commit, ran no deploy. The above is recon +
proposal only. **Awaiting Preston's green-light (or adjustment) on the data model
— specifically F1–F6.** N1 (the spread shell, read-only render) is a separate
prompt and builds only on approval.
