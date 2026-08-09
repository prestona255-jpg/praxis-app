# R10 CONNECTIONS — STAGE 0 (SCAN / recon) checkpoint

**Model:** Opus 4.8, default effort · **Date:** 2026-08-08 · **HEAD:** `d5d78c8` at recon (the 0.7
commit — this file — advances HEAD by one) · **sw.js:** `praxis-v3.275` (unchanged; docs-only).
**Status:** **COMPLETE.** 0.0–0.6 done; **census (0.2) LANDED** via the CD-6 mechanism (Preston ran
the v2 script in his live prestona255 console, read-only). HALT GATE 2 fired at first pass (no
headless read path) and cleared when Preston supplied the live run. The three chat forks are **RULED**
(0.4 · 0.5 · census interpretation). Stage 0.7 committed **local, NO PUSH**.

Privacy pin honored throughout: **no why-line body is quoted, excerpted, or paraphrased anywhere in
this file** (only counts, value names, book titles). This session issued **zero** account writes; the
census ran read-only in Preston's own console.

---

## 0.0 — PRE-FLIGHT (HALT GATE 1) — **PASS**

- a. Brief present in session ✓ (attached `r10-connections-brief.md`, read).
- b. Repo state: `HEAD == origin/main == d5d78c8`; tracked tree clean (untracked `??` = pre-existing
  design/docs noise, none tracked-modified); `sw.js CACHE_VERSION == 'praxis-v3.275'` ✓.
- c. **ANCHOR SCAN — all CODE anchors ALIVE:**

| # | Anchor | File | Lines | Notes |
|---|---|---|---|---|
| 1 | `profile.values` definition | js/state.js | 1358, 1383, 1482 (profile literals); 1424–1425 (normalizer); 3590–3601 (public-view snapshot) | array of value slugs on `profile` |
| 1 | `valueMarks` readers/writers | js/state.js | normalizers 420–425, 673–674, 800–801; creators 2017, 2216; publish-filter 2374–2387; backfill 3775 | book/sub/arc each get `valueMarks:[]` |
| 1 | `valueMarks` in views | js/views.js | 21 refs; writer `buildValueMarkRegister` 10213; readers 4774+, 4894+, 5006, 14650+, 19181+ | — |
| 2 | `.pf-vline` rule block | assets/components.css | 15228–15266 | shipped value-lighting grammar (`.34`/`.78` opacity) |
| 3 | galaxy value-lighting emit | js/views.js | 19643 (path emit `data-vline`); 20139, 20150 (`querySelectorAll('.pf-vline')`) | faint lensing paths |
| 4 | R8 mark-register fn + mounts | js/views.js | fn 10213; mounts **book 10597**, **sub-theory 12258**; **arc mount REMOVED** (see 0.4) | — |
| 5 | shelf values-as-illumination (F6) | js/views.js | chips 4589–4613; match 4786–4792; counts 4888+; ember 5006+; re-apply 5550 | illumination-only, never removal |
| 6 | `#walk/<arcId>` route | js/views.js | **816** (`if (parts[0] === 'walk' && parts[1])`); helpers 14731, 20465, 21149 | CANON — untouched by R10 |

- d. **DOC anchor (soft):** `docs/studio/room-felt-brief.md` FOUND — §5 = "CARRY-FORWARDS (placed,
  not redesigned)" @ line 187. Reconciled in 0.5.

Foundations byte-lock confirmed unchanged: `lumen-amber.css` md5 `070679b0…`, `marks.js` md5 `772886c0…`.

---

## 0.1 — LAND THE BRIEF + AMENDMENTS — **DONE**

- Brief copied **byte-verbatim** from the attached source → `docs/studio/r10-connections-brief.md`
  (`cmp` = IDENTICAL; header untouched). Pre-append: 13,002 B / 135 lines.
- Two amendment blocks (v3 amendments + Round-open ratifications) written to a temp file and appended.
  **Append proof:** `tail -n 35 brief | diff - temp` = **empty** ✓. One markdown blank-line separator
  between the handoff note and the `## v3 amendments` heading.
- **Final brief: 15,368 B / 171 lines.** All 12 numbered sections + Handoff note + 2 appended blocks
  present (heading scan verified).

---

## 0.2 — REAL-DATA CENSUS (CN-12) — **LANDED** (HALT GATE 2 fired at first pass, then cleared)

**First pass → HALT GATE 2.** The sanctioned mechanism is the CD-6 Stage-3 census — a read-only,
counts-only probe run against Preston's real signed-in data (`cd6-book-marginalia-recon.md` §1b:
*"I am signed out (rig stub), so I cannot read the real … the owner runs it or connects a session"*;
`cd6-importcapture-recon.md` §3 ran it live on prestona255, structure-only). No headless read path
existed this session: `_snapshot.json` **ABSENT** on disk (whole-tree find); rig `seed.js` synthetic
(0 valueMarks); no in-app browser session open. Per the brief → **report and stop, never improvise.**
**Cleared:** Preston ran the v2 script in his live prestona255 console (read-only) and returned the
output below.

### v1 SCRIPT DEFECT (recorded per L19 — proxy-assertion class)

§0.2 **v1** carried an owner-filter — `if (!b || b.userId !== uid) { continue; }` — verified against
**WRITER** code (state.js book/arc/sub creation all set `userId`), **not against live data shape.**
**Live books carry NO `userId` field**, so the filter matched nothing and **zeroed the library.**
This is the L19 fault class (assert against the live shape, not the writer's promise). The **ownership
probe** proved it (verbatim):

```
{"myUidPrefix":"5rQp6H","totalBookKeys":136,"ownedByMe":0,"ownerFieldPrefixes":{"undefi":136}}
```

136/136 book keys report `undefined` for the owner field → `ownedByMe:0`. **`state.books` is already
user-scoped** (no cross-user books to filter), so **v2 drops the owner-filter** and adds a
`__praxis_seed__`-skip guard (`k.indexOf('seed')` / `b.__seed` / `b.isSeed`) instead.

### FIELD-CONFIRM PROBE (verbatim)

```
{"withValueMarksField":136,"withoutField":0,"sampleBookKeys":null}
```

All 136 books carry the `valueMarks` field (0 missing) — the array exists everywhere; it is simply empty.

### v2 SCRIPT (verbatim — the script that actually ran; SUPERSEDES §0.2 v1)

```js
(function () {
  // R10 Stage-0 census v2 — READ-ONLY, counts only. No why-line bodies.
  var u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  if (!u || !u.uid) { return 'NO SIGNED-IN USER.'; }
  var prof = (typeof getProfile === 'function') ? (getProfile(u.uid) || {}) : {};
  var declared = (prof.values instanceof Array) ? prof.values : [];
  var per = {}, totalMarks = 0, perBook = [], maxOnBook = 0, skippedSeed = 0, k, i, j;
  function E(v) { if (!per[v]) { per[v] = { marks: 0, withWhy: 0, works: {}, worksWhy: {} }; } return per[v]; }
  for (k in state.books) {
    if (!Object.prototype.hasOwnProperty.call(state.books, k)) { continue; }
    var b = state.books[k]; if (!b) { continue; }
    if (k.indexOf('seed') !== -1 || b.__seed || b.isSeed) { skippedSeed++; continue; }
    var vm = (b.valueMarks instanceof Array) ? b.valueMarks : [];
    perBook.push(vm.length); if (vm.length > maxOnBook) { maxOnBook = vm.length; }
    for (j = 0; j < vm.length; j++) {
      var m = vm[j]; if (!m || typeof m.value !== 'string' || m.value === '') { continue; }
      totalMarks++; var e = E(m.value); e.marks++; e.works[k] = true;
      var why = (typeof m.why === 'string') ? m.why.replace(/^\s+|\s+$/g, '') : '';
      if (why !== '') { e.withWhy++; e.worksWhy[k] = true; }
    }
  }
  function count(o) { var n = 0, x; for (x in o) { if (Object.prototype.hasOwnProperty.call(o, x)) { n++; } } return n; }
  var g0 = 0, g1 = 0, g2 = 0, rows = [];
  for (i = 0; i < declared.length; i++) {
    var v = declared[i], e = per[v] || { marks: 0, withWhy: 0, works: {}, worksWhy: {} };
    var qual = count(e.worksWhy);
    if (qual >= 2) { g2++; } else if (qual === 1) { g1++; } else { g0++; }
    rows.push({ value: v, marks: e.marks, marksWithWhy: e.withWhy, worksMarked: count(e.works), qualifyingWorks: qual, pairEligible: (qual >= 2) });
  }
  var orphanRows = [], ov;
  for (ov in per) { if (declared.indexOf(ov) === -1) { orphanRows.push({ value: ov, marks: per[ov].marks, qualifyingWorks: count(per[ov].worksWhy) }); } }
  perBook.sort(function (a, b) { return a - b; });
  var marked = perBook.filter(function (x) { return x > 0; });
  function med(a) { if (!a.length) { return 0; } var n = a.length, mid = Math.floor(n / 2); return (n % 2) ? a[mid] : (a[mid - 1] + a[mid]) / 2; }
  var out = {
    declaredValues: declared.length, booksCounted: perBook.length, skippedSeed: skippedSeed,
    tableA_B: rows, orphanValues: orphanRows,
    grounds_0_qualifying: g0, grounds_1_qualifying: g1, grounds_2plus_qualifying: g2,
    tableC_totalMarks: totalMarks, tableC_maxMarksOnOneBook: maxOnBook,
    tableC_medianMarks_allBooks: med(perBook), tableC_medianMarks_markedBooksOnly: med(marked),
    tableC_markedBooks: marked.length
  };
  console.log(JSON.stringify(out, null, 2)); return out;
})();
```

### CENSUS RESULT (verbatim, live prestona255 console)

```json
{
  "declaredValues": 1,
  "booksCounted": 136,
  "skippedSeed": 0,
  "tableA_B": [
    {
      "value": "Care and love",
      "marks": 0,
      "marksWithWhy": 0,
      "worksMarked": 0,
      "qualifyingWorks": 0,
      "pairEligible": false
    }
  ],
  "orphanValues": [],
  "grounds_0_qualifying": 1,
  "grounds_1_qualifying": 0,
  "grounds_2plus_qualifying": 0,
  "tableC_totalMarks": 0,
  "tableC_maxMarksOnOneBook": 0,
  "tableC_medianMarks_allBooks": 0,
  "tableC_medianMarks_markedBooksOnly": 0,
  "tableC_markedBooks": 0
}
```

**Tables a / b / c (folded from the verbatim output):**

- **a — per declared value (mark + why):** `Care and love` — marks **0**, marksWithWhy **0**,
  worksMarked **0**, qualifyingWorks **0**. (1 declared value; **136 books counted, 0 seed-skipped**.)
- **b — PAIR-ELIGIBILITY per ground:** `Care and love` pairEligible = **false** (0 qualifying works).
  Totals: **grounds with 0 qualifying = 1 · 1 qualifying = 0 · 2+ qualifying = 0.** No co-presence
  pair exists on any ground.
- **c — DISTRIBUTION shape:** totalMarks **0** · maxMarksOnOneBook **0** · medianMarks(all) **0** ·
  medianMarks(marked-only) **0** · markedBooks **0**. orphanValues (marked-but-undeclared): **[] (0)**.

⚠ **136 supersedes the brief's "129".** The live library is **136 books** (census `booksCounted`);
the brief §0.2c / handoff "129-book library" is stale — use **136**.

### CENSUS INTERPRETATION (design input, on record — Preston's ruling)

**The library is UNMARKED — 0 valueMarks across 136 books, 1 declared value (`Care and love`), 0
orphans.** The brief's riskiest ambiguity ("sparse grounds") **resolved to its extreme: EMPTY, not
sparse.** Consequences that bind SHAPE-A:

- **Empty-state is the value page's PRIMARY state** (not an edge case) — designed first, as the room a
  reader actually enters.
- **Veins are untestable on pre-existing data** — there are no co-present works to ratify a vein
  between. The **first felt pass = the first marking practice** (mark, then connect).
- **Staging follows the data:** grounds + living statements first → veins second → the Yumi proposer
  third, and only once real marks exist to propose from.

### SYNC-GUARD BASELINE (data-round law, day one)

- **SCHEMA read:** live `state.SCHEMA_VERSION == '1.9.3'` (state.js:272, 1949). ⚠ **DRIFT** — the
  brief's NON-GOALS cite "SCHEMA stays 1.24.0"; that number is **stale**, live is `1.9.3`. The
  invariant (no schema change this round) holds; only the cited number is wrong. (DOC = POINTER, LIVE
  FILE = SOURCE.)
- **localStorage keys the values/marks layer touches:** **none dedicated.** `profile.values`,
  `profile.statement`, and every object's `valueMarks` live INSIDE the synced `state` object,
  persisted by `saveState()` → main key `praxis_state_<uid>` (state.js:2692) + queued to Firestore via
  `markBooksDirty` / `markSubTheoriesDirty` / `markArcsDirty`. Existing guard keys:
  `praxis_pending_books_<uid>` (1002), `praxis_pending_<kind>_<uid>` (1072),
  `praxis_pending_book_deletes_<uid>` (1131) = the `pendingBookSync`-style guard CN-12 names. R10's new
  data (Vein, per-value living-statement, ratification state) ships its own `praxis_pending_*` guard
  from day one.
- **Writes issued by THIS session: ZERO.** The census ran in Preston's console (read-only, no
  `saveState`/mutation). My session: Read/Grep/Bash-read + `cp` brief + Write checkpoint. No account
  write, no push.

---

## 0.3 — ENTRY MAP RE-DERIVATION (CN-11) — candidate doors to the Value page (REPORT ONLY)

Every surface where a value is visible/tappable on CURRENT main. **None routes to a "value/ground
page" today — that page does not exist yet** (confirms CN-11: the map is re-derived, every door is a
candidate). The R-SHELF F4 "Values rail sidebar" is **gone** (F6 replaced it with in-grid
illumination) — confirms CN-11's retirement of the rail-door assumption.

| Door | Anchor | What a tap does TODAY | Value-page candidate? |
|---|---|---|---|
| Shelf value chips (F6) | views.js:4589–4613 | toggles **illumination filter** (dims non-matching books); not a route | strong (per-value → its ground) |
| Shelf coal ember (D2) | views.js:5006+ | display-only (`ember--marked`/`--heavy`); not tappable | weak (indicator) |
| Galaxy value-lighting | views.js:19634, 19643, 20139–20150 | tapping a value **brightens** its faint `.pf-vline` lensing paths, dims arc lines | echo (CN-1 keeps as-is) |
| Book-detail register (`.vr-card`) | views.js:10597 (`renderBookDetail`) | add/edit/remove a value mark **+ why** on this book | mark-site door |
| Sub-theory register (`.vr-card`) | views.js:12258 (`renderSubTheoryPage`, the **read** page) | same writer, quiet footer on the read page | mark-site door |
| Arc field value embers (`.af-ember`) | views.js:14650 (`renderArcField`) | **display echo only** (gold embers on the sky line); not a register, not tappable | echo |
| Profile value card (`.pf-vcard`) | views.js:19714 / 19743 (`_pfValueCard`) | shows value name + orb + why-lines + "Drawn on by N sub-theories" (sublinks route to subs); **the value itself does not route** | **primary** (the natural door) |
| Profile living statement (`.pf-thesis`) | views.js:20095–20096 | owner taps `edit` → focuses the single global "Values statement" textarea | statement door |
| Values editor | views.js:19933 (statement textarea), 20290 (`edit values`) | owner edits declared-value list + statement | — |
| Yumi retrofit dock | views.js ~19739 (`retro-run`) | "Ask Yumi to notice values in your library" → retrofit pass | — |
| Onboarding `values` beat | js/intros.js:82 | offers the 10 approved starter presets at first-run | future route (dep: OB) |

⚠ **Ontology note:** the brief §1 "living statement" is **per-value**; the live `profile.statement` is
a **single global** thesis (`.pf-thesis`) — there is **no per-value statement field yet.** R10's
living-statement field (which OB-5 first writes) is net-new data.

---

## 0.4 — REGISTER-RELOCATION VERIFY (write-silent prerequisite) — **RULED**

**Finding: NO R8 mark register mounts on any COMPOSITION surface today.** The pre-existing state
differs from the brief's §3 premise:

- **Arc composition (the Field):** the value-mark **register was REMOVED** by THE ARC STANDARD S1
  (`git log -S` proof: added by `482bf7f` "R8 S3 — register on sub-theory + arc"; the two mount lines
  `var arcVreg = buildValueMarkRegister('arc', arcId); if (arcVreg) …` were **deleted** in `0759e09`).
  Only a **read-only display echo** remains — `.af-embers` at views.js:14650. **The arc has no
  value-mark *authoring* path at all now** (R10 may want to re-provide one on the value page).
- **Sub-theory:** the register (`buildValueMarkRegister('subtheory', id)`, views.js:12258) mounts in
  **`renderSubTheoryPage` — the READ page** ("a quiet footer on the read Page… a reader gesture, not a
  prose edit"). The workshop **`renderSubTheoryBuild`** (12277) — the sole prose editor (R6 decision
  #4) — **carries no register.**
- **Book detail:** register at views.js:10597 (`renderBookDetail`) — a reflective surface; stays.

**RULED (Preston, Aug 8):** the sub-theory read-page register **STAYS** — it is **reflective, the
book-detail class.** **WRITE-SILENT PREREQUISITE DECLARED PAID — no register-relocation lane in R10.**
(The register-relocation vehicle the brief seeded into S-B's debt table is therefore closed: nothing
sits on a composition surface, nothing to relocate.)

---

## 0.5 — CN-10 RECONCILE — **RULED**

**room-felt-brief §5 exact language** (`docs/studio/room-felt-brief.md:187–189`, doc quote permitted):

> ## §5 CARRY-FORWARDS (placed, not redesigned)
> - **CONNECTIONS card:** carried forward, placed below the sheet in the left column, visually quieted
>   to match the court — but internally UNTOUCHED. R10 owns its future.

(reinforced by §7.8 "Connections card: confirm carry-forward placement touches no internals" and §8
"No Connections redesign (R10's)").

**The reconcile question (as reported):** §5 froze the workshop's *existing* Connections **card** as
placement-only, redesign deferred to R10 — whereas CN-10 rules R10's value-page ground = **daylight, a
carved field in the Room card dialect, with the mini night-sky retired.** They touch iff the
carried-forward card contains/implies a mini night-sky CN-10 would alter.

**RULED (Preston, Aug 8):** CN-10 **REACHES** the workshop's carried Connections card — it **converges
into the door system at SHAPE-A**; it does **not** survive as a frozen third visual. (room-felt §5's
"internally UNTOUCHED / R10 owns its future" is honored precisely by R10 now owning it — the card
becomes a door into the value-page system, not a preserved standalone component.)

---

## 0.6 — NAMING SWEEP (REPORT ONLY)

**Route-table check for `vein` / `trace` as hash routes: ZERO hits** (empty) — no route collision.

**(a) COLLISIONS with Vein / Trace as new Connections vocabulary — NONE in code:**

| word | js | css | docs/studio | verdict |
|---|---|---|---|---|
| `vein` | 0 | 0 | 1 | the 1 doc hit = the R10 brief just landed. **Zero pre-existing collision** ✓ |
| `trace` | 2 | 0 | 4 | both js hits are **benign comments** (measure.js:95 "never a stack **trace**"; views.js:3722 "x/y **trace** a flowing … rise") — not identifiers, routes, or canon. **Zero collision** ✓ |

**(b) RETIRED-WORD SURVIVALS (inventory for the close-out sweep — all CANON, none a defect):**

| word | js | css | docs/studio | canon status |
|---|---|---|---|---|
| `thread` | 151 | 60 | 74 | CANON — profile **DNA thread/journey** vocabulary (stays); also the brief's connection "thread" (now retired → **Vein**) |
| `seed` | 129 | 12 | 84 | CANON — `__praxis_seed__` **sentinel** + rig seeding (load-bearing, never touch) |
| `walk` | 67 | 13 | 72 | CANON — `#walk/<arcId>` route (views.js:816) + arc-walk vocabulary (stays; Trace ≠ this route) |

The close-out sweep retires "thread/seed/walk" **only as Connections vocabulary in Connections-adjacent
docs** — it does not touch the sentinel, the route, or the DNA vocabulary.

---

## RESIDUALS / RULINGS

1. **HALT GATE 2 — CLEARED.** Census landed via Preston's live read (0.2). Tables a/b/c recorded
   verbatim (all-zeros; library unmarked).
2. **0.4 fork — RULED:** sub-theory read-page register STAYS (reflective); **write-silent prerequisite
   PAID; no relocation lane in R10.**
3. **0.5 CN-10 fork — RULED:** CN-10 reaches the workshop's Connections card; it **converges into the
   door system at SHAPE-A**, not a frozen third visual.
4. **Census interpretation — ON RECORD:** library **UNMARKED** (0 marks / 136 books / 1 value / 0
   orphans); **empty, not sparse**; empty-state is the value page's PRIMARY state; veins untestable on
   pre-existing data; staging = grounds+statements → veins → Yumi-confirmed-by-data.
5. **SCHEMA drift:** brief cites 1.24.0; live is **1.9.3** (invariant holds; number stale).
6. **Book count:** **136** live supersedes the brief's 129.
7. **Ontology note:** `profile.statement` is a single global thesis; the per-value living statement is
   net-new data (OB-5 writes it first).

**Commit (0.7): MADE — local, NO PUSH.** Path-explicit staging of both files
(`docs/studio/r10-connections-brief.md`, `docs/checkpoints/r10-stage0-recon.md`). Push word comes
separately.
