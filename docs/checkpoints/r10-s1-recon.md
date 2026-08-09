# R10 S1 "GROUNDS" — S1-0 RECON + PROPOSAL

**Model:** Opus 4.8, default effort · **Date:** 2026-08-08 · **HEAD:** `d3352ec` == origin/main ·
**sw.js:** `praxis-v3.275`. Read-only recon. Ends at **HALT 1** (proposal → Preston's go).
Evidence rule: every claim is a grep/line-range/byte fact. Independent coverage cross-check dispatched
(`repo-mapper`, Sonnet) — folded before HALT 1.

---

## A. ANCHOR VERIFICATION

- **`#value` / `#ground` routes DO NOT exist** — `grep "parts\[0\] === 'value'|'ground'|renderValuePage|#value/"` → **0 hits**. Clear to add.
- Route dispatch = `renderRoute`, hash split on `/`; ground set at **views.js:496** `umberGroundDark[parts[0]] ? 'dark' : 'bright'`. `umberGroundDark` (views.js:494) lists the dark set; **'value' absent → renders BRIGHT by default** (the daylight requirement). Route body pattern = the note route at **views.js:689** (`if (parts[0] === 'note' && parts[1]) { …; renderNoteSurface(parts[1]); return; }`).
- **F2 back-nav:** `noteBackAffordance` `backOk` allow-list at **views.js:16312** ("mirrors umberGroundDark minus 'note'"). The value route wants a symmetric back handling (add 'value' to the bright/back handling).

## B. SCHEMA RECONCILIATION (corrects a Stage-0 misread)

The migrate() chain runs **1.0.0 → 1.30.0** (terminal `stored.SCHEMA_VERSION = '1.30.0'`, **state.js:3805**).
- `SCHEMA_VERSION: '1.9.3'` (state.js:272) is the **anchor default literal** (comment state.js:2710), NOT the current version.
- `1.24.0` (state.js:3585) is the migrate step that **introduced** `profile.values` (the "stones", additive array-default).
- **Current live schema = 1.30.0.** ⚠ **CORRECTION:** the committed Stage-0 checkpoint (`r10-stage0-recon.md`) recorded "live SCHEMA == 1.9.3" — that read the anchor literal, not the migrate terminal. Reported here; the S1 invariant (no schema change) is unaffected. Pre-existing doc drift → **reported, not folded into this build** (fix is a 1-line correction to the Stage-0 doc, separate task).

## C. `profile.values` READ/WRITE COVERAGE (the shim's job) — HALT-1 evidence

Today `profile.values` = array of **strings**. S1 makes each entry an OBJECT `{id, name, statement, statementRevisedAt, statementHistory[], declaredAt}`. Enumerated read/write sites (hand-built; `repo-mapper` cross-checks exhaustiveness):

| Site | R/W | Today treats entry as | Shim/normalizer coverage |
|---|---|---|---|
| **state.js:1538–1545 `setProfile`** | **WRITE** | flattens: `('' + fields.values[vi]).trim()` → **would corrupt an object to `"[object Object]"`** | **THE key seam.** Becomes the WRITE-NORMALIZER (accept string OR object → store object). Mandated "writes store objects". |
| integrations.js:565→601 `loadProfileFromFirestore` | READ→WRITE | passes `rd.values` straight into `setProfile` (the flattener) | covered once setProfile normalizes; the remote array is object-transparent here |
| integrations.js:1036 `saveProfileToFirestore` `.set()` | WRITE | copies `profile.values` as-is into the Firestore doc | **object-transparent** (copies the array); objects survive the write |
| views.js:19159 `_profileValueLoad` | READ | `declaredSet[declared[i]]=1` (string key); marks matched by `m.value` string; emits `{name:declared[i], w, whys, subs}` | central loader — normalize `declared`, **key by `.name`**, add `.id` to output |
| views.js:10231 `buildValueMarkRegister` vocab | READ | offers `profile.values` as string pick-options; stores `m.value=<string>` | route through normalizer, use `.name` (marks NOT re-keyed — S1 keeps `m.value` = name string) |
| views.js:18731 | READ | `profile.values` as strings (portrait/emblem) | normalizer → `.name` |
| views.js:20086, 20132, 20290 | READ | `_profileValueLoad(...).values` consumers + editor `p.values.slice()` | loader covers the first two; the editor (20290) reads/writes → normalize |
| state.js:1489 `setProfile` other-field callers (views 20169 profile-save; 20294 values-editor; intros 354 onboarding) | WRITE | pass `values` arrays of strings | write-normalizer covers all |
| yumi-brain.js:936, 1071, 1215 | READ | `p.values` → `valueNames` (needs STRINGS) | `valueNamesFor(uid)` helper = normalizer → `.name[]`. Yumi is DARK this round but the reads still execute. |
| intros.js:110–226, 348–439 onboarding | READ+WRITE | `picked.values` = strings for chip UI; writes via `setProfile({values})` | write-normalizer + read maps to `.name` for chips |

**HALT-1 determination on migration:** the only stored-write that flattens is **`setProfile`** (state.js:1541). Making it a normalizer-to-object (the mandated "writes store objects") + a read-side normalizer for not-yet-rewritten localStorage strings **covers every site**. `saveProfileToFirestore` is object-transparent; the Firestore round-trip survives. **No read site is un-coverable → NO destructive stored migration is required → the migration-forcing HALT-1 condition does NOT fire.** (HALT 1 still occurs as the proposal-approval stop.)

## D. THE SIX DOORS vs the AUTHORITATIVE Stage-0 entry map — 5 of 6 COLLIDE

The design's "full convergence, door-ONLY" list, verified against the live code. Only **one** is a clean additive door; **five** collide with shipped behavior or don't exist. Per the design ("any discrepancy is a reported finding, not a judgment call") these are REPORTED:

| # | Design door | Live element | Current tap behavior | Discrepancy |
|---|---|---|---|---|
| 1 | `.pf-vcard` | views.js:19714 `_pfValueCard` — plain `<div>` | **none** (not tappable); inner `.pf-sublink` route to subs | **CLEAN ADD** — card tap → `#value/<id>`; sublinks keep their sub-routes (stopPropagation). Needs `.id` from the loader. |
| 2 | profile **stones** | — | — | **ABSENT.** No stones render post-S-B (deleted with the R9a marquee `renderOwnProfile`). CSS `.stones` orphaned (components.css:7466). **No emit site to wire.** |
| 3 | profile **strip chips** | views.js:20090 `.pf-vchip` in `.pf-strip` | **lights the galaxy constellation** (taphint "Tap a value to light its constellation" — the CN-1 echo) | **CONFLICT:** routing removes the galaxy value-lighting echo (CN-1 keeps it). |
| 4 | book-detail **mark chips** | views.js:10259 `.vr-mark-name` `<button>` | opens **inline lineage-EDIT** (`editIdx` toggle) | **CONFLICT:** routing removes the inline lineage-edit affordance. |
| 5 | **shelf value controls** | views.js:4600 `.vchip` `<button>` | toggles the **F6 illumination filter** (`shelfFilter.value` + `applyShelfIllumination`) | **CONFLICT:** routing removes a shipped, felt-passed R-SHELF F6 behavior. |
| 6 | **workshop Connections card** | views.js:12571 `.stb-conn` in `renderSubTheoryBuild` | it is the **linkedSubTheories (sub↔sub) foot** — shows partner subs, "＋ draw a connection" (→ arc constellation), "－ remove a connection" | **BIG:** "compress to a value-grounds row" **replaces the linkedSubTheories display** (drawing still lives in the constellation; the workshop loses the link list + unlink shortcut). CN-10 RULED it converges — but losing linkedSubTheories UI is a real behavior change to confirm. |

## E. STATEMENT MODEL

- The value object's `statement` is **per-value, net-new** (Stage-0 ontology note). The existing **`profile.statement`** (views.js:20095 `.pf-thesis`, "the through-line of your reading") is the GLOBAL profile thesis — **separate, untouched.** The value page reads/writes `value.statement` + `value.statementHistory` + `value.statementRevisedAt`.
- `declaredAt` is net-new; legacy values have none → "omit the declared clause when declaredAt is unknown" (design), never invented.
- `id` = stable slug from name. Existing slug helper `scanNormTitle` (views.js:7895) collapses to alnum-only (`careandlove`); recommend a small `valueSlug(name)` (lowercase, alnum, hyphen-joined → `care-and-love`) for a readable route id. `valueIdFor(name)` = `valueSlug(name)` (read-side resolver for marks/chips → `#value/<id>`; marks store `m.value` = name string, never re-keyed).

## F. WORKSHOP GROUNDS-ROW SKETCH

Replace `.stb-conn`'s body (keep the block + `CONNECTIONS`→ quiet "GROUNDS" head) with a daylight row of the reader's declared value grounds (`_profileValueLoad(uid).values` → `.name`), each a chip routing to `#value/<id>`. Room dialect (quiet, ground names only, no counts). Empty state: declarative line, never a question. (Pending the D#6 ruling on the linkedSubTheories display.)

---

## PROPOSAL (for HALT 1)

**(a) Shim placement + coverage:** two-piece, non-destructive, confirmed by the independent `repo-mapper` cross-check (§G). (1) **Read-shim in `getProfile` (state.js:1478) — the single chokepoint** (every reader funnels through it or through `_profileValueLoad`/`buildValueMarkRegister`, both of which call `getProfile`): lazy-wrap each legacy string → `{id:valueSlug(name), name, statement:'', statementRevisedAt:0, statementHistory:[], declaredAt:0}` on read; well-formed object → passthrough + backfill. Primitive `normalizeValue(entry)` + convenience `valueNamesFor(uid)` (→ names) + `valueIdFor(name)`. Then **`.name` extraction at the ~10 sites that use an entry as a bare string / dict-key** (enumerated §G). (2) **Write-normalizer**: `setProfile` (state.js:1538) stores objects → the Firestore round-trip survives (saveProfileToFirestore is object-transparent). No migrate change, no schema bump. Full table = §C + §G.

**(b) Composer — RECOMMEND plain styled-textarea in canon dress.** The statement is one short prose articulation; `createWritingCanvas` is a shared singleton whose draft/commit/guards read a textarea and whose in-new-surface mount is heavy + risky (the cd6-marginalia FORK-1 lesson). A quiet canon-dressed textarea matches the "declarative, quiet" posture and avoids singleton entanglement.

**(c) Door wiring — REPORT + recommendation (the §D discrepancies):** door #1 `.pf-vcard` is a clean additive door (wire it). Doors #3/#4/#5 each **override a shipped behavior** (galaxy-lighting / lineage-edit / F6 filter); #2 is absent; #6 **replaces linkedSubTheories**. Recommendation: **additive doors** — wire `.pf-vcard` cleanly; for the conflicting sites, prefer preserving the shipped behavior and add the door only where non-destructive; **defer/omit** the sites where routing regresses F6, the galaxy echo, or linkedSubTheories — unless Preston rules literal full-convergence. This is the session's one design question ↓.

**(d) Workshop grounds-row:** §F — recompose `.stb-conn` into a quiet daylight grounds row (value names → doors); gated on the #6 ruling (replace vs coexist with linkedSubTheories).

**(e) Expected per-file byte deltas (floors, CODE):** state.js +0.4–0.8 KB (setProfile normalizer + a helper); views.js +2.5–4 KB (renderValuePage + route + loader/​door edits + workshop row); components.css +1.5–2.5 KB (`.value-page` daylight skin, composer, history, grounds row); intros.js/yumi-brain.js small read-adapter deltas (<0.3 KB each). A `docs/studio` OB-5 note (values-object shape). sw.js +0 until the ship gate (v3.276).

### THE ONE QUESTION (HALT 1)
The "full convergence" door list collides with shipped behavior on **5 of 6 sites** (§D: strip chip = galaxy-lighting/CN-1 echo · shelf chip = F6 filter · mark chip = lineage-edit · workshop card = linkedSubTheories · stones = absent). **Literal full-convergence** (override the filter, the galaxy echo, and the linkedSubTheories display) **or additive-doors** (wire `.pf-vcard` cleanly, preserve F6 + galaxy echo + linkedSubTheories, defer the conflicting sites)? Recommend **additive-doors**.

---

## HALT-1 RULING — Preston's GO (2026-08-08, verbatim in substance)

The ONE QUESTION (door convergence) was ruled by **Preston** in his GO message (not the agent's
recommendation — this satisfies FORK-VERBATIM; the recon only *recommended* additive-doors):

- **DOOR RULING = ADDITIVE-DOORS, with a convergence SCHEDULE:**
  - **S1 wires `.pf-vcard` ONLY** (tappable → `#value/<id>`; content untouched).
  - **`.vr-mark-name`** (book-detail mark chips) → **DEFERRED to S2** (resolved when the evidence trail exists; lineage-edit untouched now).
  - **`.pf-vchip` strip chips + shelf `.vchip`** → **DEFERRED to S3** (their taps are the value-lighting / F6 grammar veins render under). **F6 + the galaxy echo are NOT regressed — ever.**
  - **Profile stones** → **VOID** (deleted in S-B; removed from the door map).
  - **Workshop `.stb-conn`** → **OUT OF R10 JURISDICTION** — it displays linkedSubTheories, the sub↔sub citation type CN-6 scoped out as a named future. **UNTOUCHED.** This is a **CORRECTION to the SHAPE-A checkpoint-3 (0.5 CN-10) ruling**, which was made on a *misidentified* surface. "Full convergence" stands as the destination for value-labeled elements; the schedule above governs.
  - **SUPERSEDE:** the original prompt's S1-3 six-site list + the felt card's "tap every one of the six doors" are superseded — **S1-3 = the `.pf-vcard` door only**; felt card = both statement states + history + edit + the one door, phone + desktop.
- **NORMALIZER LAW (binding):** `setProfile`'s normalizer **MERGES BY NAME** — an incoming bare string whose name matches an existing object resolves TO that object (statement/history/declaredAt preserved); a fresh object only for a genuinely new name; **same rule on the Firestore sign-in merge** (integrations:565). (This is what makes self-test 2 passable by design.)
- **Composer** = plain styled-textarea in canon dress (createWritingCanvas stays out).
- **NAMED TASK (report, don't do):** schema-number corrections (live terminal **1.30.0**; brief says 1.24.0; Stage-0's "1.9.3" was an anchor-literal misread) = one docs task at round close.

---

## G. COVERAGE CROSS-CHECK (repo-mapper, Sonnet — reconciled)

**Verdict CONFIRMED: no read site is un-coverable → no destructive migration → HALT-1 migration
condition does NOT fire.** The cross-check confirms `setProfile` is the sole flattener and
`saveProfileToFirestore` is object-transparent, and adds precision:

- **Shim chokepoint = `getProfile` (state.js:1478)** — cleaner than routing each reader; every site
  funnels through it. Confirmed no second remote-read path (`grep userProfiles` — visitor/social reads
  reuse `getProfile`).
- **The exhaustive MUST-CHANGE list (10 `.name`-extraction sites + the write-normalizer):**
  1. `setProfile` values branch (state.js:1538) — write-normalizer.
  2. `_profileValueLoad` (views.js:**19163** `declaredSet[declared[i]]=1` + **19208** `.name`) — ⚠ **19163 uses the entry as a DICT KEY**; an object silently collapses to `"[object Object]"`, so every value shows 0 evidence and every mark reads as orphaned — **passes a naive smoke test** (no throw). Highest-value catch (L3 class). Fix cascades to ~6 transitive render sites.
  3. `buildValueMarkRegister` (views.js:10231 vocab, 10381 display, **10383 the WRITE** `marks.push({value:val})`) — must extract `.name` before display AND before push, or a new mark's `.value` becomes an object (corrupts the string-typed `valueMarks[].value`).
  4. `_pfRenderOffers.addValue` dedup (views.js:20291) — blind stringify breaks case-insensitive dedup.
  5. `intros.js resetPicked` (110–112) — ⚠ **highest severity**: coerces declared entries to `"[object Object]"`, and `doValues` REPLACES `profile.values` wholesale → **silent durable data-loss if a reader retakes onboarding**. Must extract `.name`.
  6. `yumi-brain.js` ×5 (933–937, 958–967, 1064–1074, 1209–1216, 1240–1242) — two `.join(', ')` prompt serializations would send garbage to the model (silent Yumi/lens-gen + value-retrofit regression, not a crash). Extract `.name`. (Dark chat unaffected, but lens-gen/retrofit run.)
- **`_portraitEmblem` (views.js:18728) is DEAD** (zero callers, `vList` never consumed) — **drop from scope** (my §C listed 18731 as a reader; it's unreachable).
- **No-change (confirmed safe):** ensureUser guard (1423), migrate step (3587), `loadProfileFromFirestore` raw fetch, `saveProfileToFirestore` .set() — *conditional on setProfile being fixed first*, `_pfValueCard` (own shape).
- **Out of scope (pre-existing, not new):** `valueMarks[].value` is a separate collection keyed by NAME (state.js:421); it already orphans on rename (`_pfOrphan`). S1 does not re-key it; `id` merely becomes available for a future by-id linkage (unscoped). Not a blocker.

**Net effect on the proposal:** the shim design is validated and the must-change list is now exhaustive
and exact. No new HALT. The 19163 dict-key coercion + the intros-retake data-loss are the two
S1-1 self-test cases that must be *demonstrably able to fail* (L3).
