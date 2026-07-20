# FX-1 SYNC GUARDS (kill F-DL1) — Stage 0 recon (READ-ONLY)

HEAD `a443b45` / `praxis-v3.236`. `HEAD == origin/main` (confirmed post-fetch). Tree
NOT fully clean — see §0. No app code read/write beyond `Read`/`Grep`; no pathspec
checkout used; nothing staged or committed.

---

## 0. Baselines + ground truth

| Check | Value | Evidence |
|---|---|---|
| HEAD | `a443b4577f8d153122e61aeeff179dd73a7cb781` | `git rev-parse HEAD` |
| Subject | `fix(R-POLISH B4-FIX): the About measure reaches the band Preston actually reads in, and the SW stops choking on extension requests` | `git log -1 --format=%s` |
| origin/main | same SHA | `git fetch origin main` then `git rev-parse origin/main` |
| `sw.js` CACHE_VERSION | `praxis-v3.236` | `sw.js:10` |
| `assets/marks.js` | 10,255 B | `wc -c`; matches every prior census |
| `assets/lumen-amber.css` | **14,966 B** | `wc -c`; **NOT** the 14,681 B this task states as the expected lock |
| `js/integrations.js` (pre-build baseline) | 139,314 B / 3,220 lines | `wc -c` / `wc -l` |
| Worktrees | only `main` (this tree), `scan-derisk-lane`, `yumi-mockup-lane` | `git worktree list` |

**⚠ Byte-lock deviation — NOT a defect, but flagged as instructed.** `lumen-amber.css`
grew 14,681 → 14,966 B (+285 B) in `124fe99` ("B3 lane 1 — AES enforcement, partial")
and has been re-verified byte-identical at every commit since, including **self-
documented in THIS session's own HEAD commit message**: `a443b45`'s log states
*"Frozen files 0 diff: marks.js (…, 10,255 B) and lumen-amber.css (…, 14,966 B)
byte-identical."* The 14,681 B figure this prompt (and this agent's own prior memory)
carries is **stale** — superseded on `main`, not a local/dirty drift. `marks.js`
10,255 B is unchanged and matches.

**⚠ Tree not fully clean.** Two tracked files are dirty, both docs-only, both
unrelated to FX-1's scope:
- `CLAUDE.md` — +19 lines (FELT-DELTA CLAUSE + OWNER-VIEWPORT PRIMACY + CAPTURE
  PROVENANCE, all dated 2026-07-20).
- `docs/checkpoints/r-polish-b4.md` — +8 lines (a "CLOSED 2026-07-20" verdict banner).

These read as an in-progress R-POLISH (Lane A) session's uncommitted doc updates.
**Zero overlap with `js/integrations.js` or `js/state.js`** — does not block FX-1
recon or block-scope, but the tree should be clean (or explained) before FX-1's own
build commits, per the "no tracked file dirty that the slice didn't intend to touch"
halt condition. Not FX-1's to fix.

**No FX-1 (or active Lane-A) worktree exists.** `git worktree list` shows only
`main` + two unrelated lanes (`scan-derisk-lane`, `yumi-mockup-lane`). R-POLISH B4 /
B4-FIX (`c2c9d68`, `a443b45`) landed **directly on `main`, sequentially** — not from
a still-open parallel worktree. If Preston intends FX-1 to run in an actual parallel
worktree against a still-live Lane A, that Lane-A worktree does not currently exist to
race against; the "two lanes run in parallel worktrees" premise in this task is not
yet materialized on disk. Flagging so the parent session doesn't assume a worktree
that isn't there.

---

## 1. THE POPULATION — enumerated at HEAD, verbatim comment re-read

`integrations.js:31-49` (F-DL1 doc-block) still says "profile/readerModel are
deferred to F-DL3" — **stale**: F-DL3 (`9914dd9`) and F-DL4 (`cfd168f`) both shipped
and closed that deferral for the **outgoing** direction (see §4). The comment was not
updated after those two commits landed; note as doc-drift, not a code defect.

8 synced Firestore docs, all fetched in `onAuthStateChanged`'s signed-in branch
(`integrations.js:93-607`):

| # | Doc | Load fn : line | REPLACE shape | Keyed by | F-DL1-incoming target? |
|---|---|---|---|---|---|
| 1 | **books** | `loadBooksFromFirestore:675` | 3-way merge via `mergeRemoteBookDoc:717` | `state.books[bookId]` + per-uid index `state.userBooks[uid].bookIds` | **NO — already guarded** (`pendingBookSync`) |
| 2 | **arcs** | `loadArcsFromFirestore:1191`, callback body `193-292` | CLEAR-AND-SPLAT (clear `195-204`, splat `205-213`) | `state.arcs[arcId]`, ownership inline `arc.userId` | **YES — target 1** |
| 3 | **subTheories** | `loadSubTheoriesFromFirestore:1386`, callback `245-291` (nested inside arcs' callback) | CLEAR-AND-SPLAT (clear `249-258`, splat `259-267`) | `state.subTheories[subId]`, ownership inline `sub.userId` | **YES — target 2** |
| 4 | **themes** | `loadThemesFromFirestore:1482`, callback `300-341` | CLEAR-AND-SPLAT (clear `304-311`, splat `312-321`) | `state.userThemes[themeId]`, ownership inline `theme.userId` | **YES — target 3** |
| 5 | **artifacts** | `loadArtifactsFromFirestore:1573`, callback `350-408` | CLEAR-AND-SPLAT (clear `354-361`, splat `362-371`) + a distinct one-time seed-on-absent branch (`380-403`) | `state.bookArtifacts[artifactKey(userId,bookId)]` — **composite key**, ownership inline `.userId` (redundant with the key) | **YES — target 4** |
| 6 | **notebook** | `loadNotebookFromFirestore:1291`, callback `416-499` | CLEAR-AND-SPLAT (clear `420-427`, splat `428-474`, 3 inline per-entry normalizers) | `state.notebookEntries[entryId]`, ownership inline `entry.userId` | **YES — target 5** |
| 7 | **profile** | `loadProfileFromFirestore:885`, callback `507-581` | REPLACE-ON-FOUND, single doc, **field-by-field** via `setProfile` (`state.js:1397`) | one slot per uid — no per-record key at all | **EXCLUDED — see below** |
| 8 | **readerModel** | `loadReaderModelFromFirestore:1000`, callback `587-607` | REPLACE-ON-FOUND, single doc, **whole-object** via `replaceReaderModel` (`state.js:1621`) | one slot per uid | **EXCLUDED — see below** |

**Classification proof for the exclusion (profile/readerModel).** Both are a single
Firestore doc holding named fields (`penName`, `tagline`, `values[]`, …) or one nested
object (`threads{}` + summary) — never a *keyed collection of independent records*.
`setProfile` (`state.js:1397`) writes each named field only "when present in
`fields`" and the `found` branch (`integrations.js:509-554`) passes **every** field
with a remote value, so `found` overwrites the whole slot at once — there is no
"local-only record absent from the remote list" to preserve, because there is no
list. `replaceReaderModel` (`state.js:1621`) is a flat whole-object replace, same
reasoning. **The race does not apply in the pendingBookSync sense** (per-id
keep-or-drop); what CAN happen instead — an in-window field/thread edit lost on
`found` — is already named and tracked as **R1-profile / R1-readerModel** in
`f-dl3-recon.md` (§ STEP 3) and `f-dl3-fix.md` (§ Residuals), unfixed by design
(remote-wins-on-found, "near-unreachable," explicitly deferred, not this task's
population). **EXCLUDED from FX-1 with proof, per the task's own test.**

**Books already guarded — mechanism verbatim at this HEAD**, confirming the task's
premise: `mergeRemoteBookDoc` (`integrations.js:717-794`) keeps a previously-known
local book id absent from remote **iff** `isBookPending(uid, pid)` is true (line
743: `if (state.books[pid] && !remoteHas[pid] && !isBookPending(uid, pid)) delete`).
`pendingBookSync` bookkeeping lives in `state.js:966-1034` (`markBookPending:998`,
`isBookPending:1009`, `getPendingBookSync:992`, `clearPendingBookSync:1022`). **A
second, symmetric guard the task's problem statement does not mention** also exists:
`pendingBookDeletes` (`state.js:1036-1093`, `markBookDeletePending`,
`isBookDeletePending`, `clearPendingBookDelete`) — protects a **locally-deleted**
book's removal from being resurrected by a stale remote read. The books precedent is
therefore a **4-part** system (add-pending set, delete-pending set, the 3-way merge,
the write-path callers), not the 3-part system named in the prompt — worth deciding
up front whether FX-1 transplants add-protection only (mirrors the prompt's framing)
or add+delete symmetry (mirrors the actual books precedent).

---

## 2. Load/merge path map — the 5 targets, full anchors

All 5 share one structural shape: **clear** (delete this uid's already-known records
from the flat map) → **splat** (copy every remote record in) → **backfill**
(`ensure<X>FieldsAll`, the 2.0-hardening batch-2a schema-completion pass) → `saveState()`
→ conditional `renderRoute()`. Anchors:

| Collection | Clear loop | Splat loop | Batch-2a backfill call | `saveState()` (found) |
|---|---|---|---|---|
| arcs | `197-204` | `205-213` | `ensureArcFieldsAll(state.arcs)` — `220-222` | `223` |
| subTheories | `249-258` | `259-267` | `backfillSubTheoryUserId` `268-270` **then** `ensureSubTheoryFieldsAll(state.subTheories)` `271-279` | `280` |
| themes | `304-311` | `312-321` | `ensureThemeFieldsAll(state.userThemes)` — `326-328` | `329` |
| artifacts | `354-361` | `362-371` | `ensureArtifactFieldsAll(state.bookArtifacts)` — `372-374` | `375` |
| notebook | `420-427` | `428-474` (3 inline normalizers folded in, see below) | `ensureNotebookEntryFieldsAll(state.notebookEntries)` — `478-486` | `487` |

**Notebook's splat is the one collection with extra inline logic riding the same
loop** (`integrations.js:428-474`), all scoped to `for (reid in remoteEntries)` — i.e.
**only applied to records that came from the remote payload**, never to a
guard-preserved local-only record:
- `filed` default, book-aware (`436-447`)
- forced `isPrivate=true` for `register==='journal'` (`448-463`), sets
  `journalPrivacyChanged` → `markNotebookDirty()` at `475-477`
- `images` array default (`464-472`)

A guard-preserved pending entry never passes through this loop (it is not a member of
`remoteEntries`), so it needs these fields already correct from its **own creation
site** — confirmed true: all 4 notebook creation sites (`views.js:3442`, `views.js:3788`,
`views.js:14595`, `import-capture.js:295`) set `filed`, `isPrivate`
(via `getRegisterDefault`), and `images` explicitly at construction. No gap.

**"absent" and "error" branches all call `saveState()`** for every one of the 5
(`232/237`, `287/290`, `336/339`, `401/406` [absent has a seed-vs-keep fork,
both sub-paths save], `493/497`) — this is the **F-DL1 outgoing-latch flush**,
already shipped, and is orthogonal to the incoming guard this task adds (§4).

**subTheories' race window is structurally different from its 4 siblings.** arcs
(`193`), themes (`300`), artifacts (`350`) and notebook (`416`) are 4 sibling
`.get()` calls fired back-to-back, synchronously, right after the books load call —
their windows run in parallel. `loadSubTheoriesFromFirestore` (`245`) is **nested
inside** the arcs callback and its `.get()` does not even fire until the arcs load has
already resolved (found/absent/error). Its own incoming-race window therefore opens
**later** and is **shorter** than the other 4's, but it is real — flag for the race
test (§5), not a blocker.

---

## 3. Does the guard transplant cleanly? — per collection

**Structural finding that changes the shape of the task, in FX-1's favor:** the 5
targets do **not** carry books' secondary per-uid index array
(`state.userBooks[uid].bookIds`). Ownership is entirely **inline** on each record
(`.userId`, or the artifact composite key). This means the transplant is **simpler**
than the books precedent for 4 of 5 — there is no `nextIds`-style index rebuild step
(`mergeRemoteBookDoc:751-765`); the guard only needs a **keep-predicate change inside
the existing clear loop** ("delete iff owned AND absent-from-remote AND NOT pending")
plus leaving the splat loop as-is (a preserved pending record is never in
`remoteEntries`/`remoteArcs`/etc., so the splat loop never touches it).

| Collection | `pending<X>Sync` exists today? | Keyed same way as books (by record id)? | Creation chokepoint(s) | Clean? |
|---|---|---|---|---|
| arcs | **NO** (grep: zero hits repo-wide for `pendingArc*Sync`) | YES, simpler (no index array) | **ONE** — `createArc`, `state.js:1912-1934` | **YES, clean** |
| subTheories | **NO** | YES, simpler | **ONE** — `createSubTheory`, `state.js:2102` | **YES, clean** — see wrinkle below |
| themes | **NO** | YES, simpler | **ONE** — `createUserTheme`, `state.js:2252` | **YES, clean** |
| artifacts | **NO** | YES, but the "id" is a **composite key** `artifactKey(userId,bookId)` (`state.js:1167-1169`), not a generated id | **ONE** — `ensureOneArtifact`, `state.js:1175-1181` | **YES, clean** — composite key is still a stable map key, pending-set entries are just `"uid:bookId"` strings |
| notebook | **NO** | YES, simpler | **FOUR** — `captureNote` (`views.js:3428-3456`), an inline journal quick-add (`views.js:3775-3791`), the marginalia-editor autosave create-on-null-entryId (`views.js:14592-14595` area), `commitEntries` (`import-capture.js:280-313`) | **CLEAN MECHANICALLY, but breaks 2-file scope** — see §6 |

**Per-collection wrinkles, named:**

- **arcs ↔ subTheories transitive-ownership coupling.** `subTheory.arcId` points at
  an arc; a sub-theory's ownership is only "transitive" through its parent arc (code
  comment at `integrations.js:240-244`: "sub-theory ownership is transitive… both the
  clear-predicate and buildUserSubTheoriesDoc need arcs present"). If a user creates a
  **new arc + a new sub-theory under it** inside the same race window, BOTH guards
  must land together or a preserved sub-theory can end up pointing at an arc-id that
  the (unguarded) arc side wiped. Since this task scopes arcs AND subTheories into the
  same 5-target population, this is satisfied **only if both are built and shipped in
  the same swing** — flag as a required pairing, not an optional split.
- **artifacts' composite key** is a documented, load-bearing invariant
  (`ensureOneArtifact`, `state.js:1171` comment: "at-most-one-artifact-per-user-per-book").
  A pending-set keyed the same way (`artifactKey(userId,bookId)`) is consistent with
  that invariant and needs no new key scheme — noted only because it is NOT a bare
  generated id like the other 4, so a literal copy-paste of `pendingBooksKey`'s
  `'praxis_pending_books_' + uid` naming pattern is fine, but the STORED values are
  composite strings, not simple entry ids.
- **artifacts' `absent`-branch one-time seed** (`integrations.js:380-403`) pushes
  every local artifact to remote when no doc exists yet — a different mechanism from
  the guard, on a different branch (`absent`, not `found`), so it does not interact
  with the `found`-branch clear/splat guard. Named so a future reviewer does not
  conflate the two.
- **notebook's 4 scattered creation sites** (vs. 1 chokepoint for the other 3) is the
  single largest transplant-cost asymmetry across the "5 collections" framing — see
  §6, this is the file-scope-breaking finding.
- **subTheories' shorter/later race window** (§2) — the guard logic itself transplants
  identically; only the *live-smoke timing* differs (§5).

**No collection in the 5-target population fails to transplant.** All 5 are
mechanically clean at the merge-logic level. The one HALT-worthy item is **file
scope**, not merge-logic feasibility — see §6.

---

## 4. F-DL2 boundary — confirmed orthogonal, zero overlap

The outgoing latches (`F-DL1` `arcsLoaded`/`notebookLoaded`/`subTheoriesLoaded`/
`themesLoaded`/`artifactsLoaded`, `F-DL2` `booksLoaded`, `F-DL3`
`profileLoaded`/`readerModelLoaded` + the two `*WritePending` flags, `F-DL4`
`resetSyncLatches()`) are declared once at `integrations.js:50-62` and gate **only**
the `save<X>ToFirestore` functions (`saveArcsToFirestore:1252` shown in full — the
gate is lines `1263-1271`, structurally identical across all 6/8 save functions:
`saveBooksToFirestore:843` gate `854-862`, `saveNotebookToFirestore:1350`,
`saveSubTheoriesToFirestore:1446`, `saveThemesToFirestore:1538`,
`saveArtifactsToFirestore:1630`, plus the profile/readerModel variant gates in
`saveProfileToFirestore:921` / `saveReaderModelToFirestore:1036`).

**Confirmed by reading `saveArcsToFirestore` in full: it contains only the OUTGOING
`.set()` and the F-DL1 gate — zero merge logic, zero reference to `state.arcs`
beyond the payload already built by the caller.** The incoming guard this task adds
lives entirely inside the **sibling LOAD callback's clear+splat block**
(`integrations.js:195-227` for arcs, and the matching ranges in §2 for the other 4) —
a structurally disjoint code region from every `save<X>ToFirestore` function. **No
overlap by construction**, confirmed per-collection, not just asserted from the books
precedent's own doc-comment.

`resetSyncLatches()` (`integrations.js:74-92`) resets only the 10 `*Loaded`/
`*WritePending` vars; a new `pending<X>Sync` bookkeeping set (localStorage, per-uid
key, like `pendingBooksKey`) is **not** part of that latch family and needs no
`resetSyncLatches` entry — books' own `pendingBookSync`/`pendingBookDeletes` are
likewise absent from that reset function today (confirmed: neither name appears in
`integrations.js:74-92`), consistent precedent.

---

## 5. Race-test design (NOT run — design only)

**Repo constraint, re-confirmed:** Node is blocked on this machine (CLAUDE.md); the
established precedent for F-DL1/F-DL2/F-DL3 was a **deterministic ES3 `cscript`
behavioral simulation** (`scratchpad/sim-fdl1.js`, `sim-fdl2-books.js`, `sim-fdl3.js` —
per their checkpoint docs), asserting before/after in-memory state, run once as proof
and **never committed** (`git log --all -- "*sim-fdl*"` → zero hits, confirmed this
session). That is the mechanism proof; a **live throttled-incognito Firebase smoke on
`prestonpraxistest`** is the human-observable corroboration, matching F-DL3's
documented click-paths (`f-dl3-recon.md` §STEP 7).

**Per-collection forced-timing design (mirrors `f-dl3-recon.md`'s pattern, generalized
to the 5):**

1. **Pre-seed** the cloud doc for `prestonpraxistest` with N known records via a normal
   signed-in session (e.g. 3 arcs `A1,A2,A3`), confirm by reload.
2. **Stale-cache device:** fresh Incognito window with **no** `praxis_state_<uid>`
   local cache (simulates a fresh device / cleared storage).
3. **Widen the window:** DevTools → Network → Slow 3G (or throttle the specific
   `userArcs`/`userSubTheories`/`userThemes`/`userArtifacts`/`userNotebook` XHR/fetch
   if the harness can target it) — widens the sign-in-to-load-settled gap from ~100ms
   to seconds, matching the F-DL1/2/3 precedent's method.
4. **Sign in**, and the moment the popup closes — **while the collection's own GET is
   still pending** in the Network panel — perform the local mutation that creates a
   NEW record of that collection (e.g., for arcs: create an arc via the normal UI
   flow; for subTheories: create a sub-theory under an existing arc; for themes:
   create a user theme; for artifacts: attach/create a book artifact; for notebook:
   capture a note via the writeline, the journal quick-add, OR an import-capture
   commit — all 4 creation paths should each get at least one pass, per §3's finding
   that notebook has 4 independent chokepoints).
5. **Let the load resolve. Reload.** **WITHOUT the guard:** the pre-existing remote
   records A1/A2/A3 are gone (the stale-subset local `.set()`... — no, wait: this
   direction is the OUTGOING clobber, already fixed by F-DL1. For the INCOMING guard
   under test here, the observable failure is the OPPOSITE: **the new in-window
   record itself is missing** after reload, because the `found` branch's clear+splat
   deleted it from local state before it had synced. **WITH the guard:** the new
   record survives the `found` branch's clear step (kept via the pending-set check)
   and appears in `state.<X>` post-merge, and a subsequent `saveState()` (the existing
   found-branch flush, or the next mutation) pushes it to the cloud, at which point
   the pending mark clears.
6. **Instrumentation needed:** (a) a way to pause/inspect the Firestore GET mid-flight
   (Network throttling is sufecient, as F-DL3 used it); (b) a `console.log` or DevTools
   breakpoint on the relevant `pending<X>Sync` localStorage key to show it holding the
   new record's id across the `found` branch; (c) a before/after **cloud-doc read**
   (Firebase console or a second authenticated tab) showing the record present after
   the deferred write flushes — the same "cloud-doc before/after" evidence format
   F-DL3 used (`f-dl3-fix.md` CHECKPOINT A/B).
7. **subTheories-specific timing note (§2):** because its `.get()` only fires after
   arcs settles, step 4's "mutate while the GET is pending" window is later and
   shorter for subTheories — the throttle should target the `userSubTheories` request
   specifically (not just the first request seen) to hit the right window.
8. **Test account: `prestonpraxistest` only.** `prestona255` stays untouched
   (read-only always, per this task's own instruction and the pre-existing hazard
   recorded in `docs/checkpoints/r-arc-recon.md` §1: "do not sign `prestona255` into
   the rig browser").

---

## 6. Scope + file overlap

**This is the one HALT-worthy structural finding.**

The task states the fix should touch "`integrations.js` and its tests ONLY."
**Two corrections, both load-bearing:**

**(a) No committed test harness exists to touch.** `git log --all -- "*sim-fdl*"` and
a repo-wide search for a `tests/`/`test/` directory covering `integrations.js` both
return nothing. The F-DL1/2/3 precedent's "proof" was an **uncommitted** ES3
`cscript` simulation written to a scratch location, run once, never staged. **"and its
tests" has no existing target in this repo** — the build's proof artifact, if it
follows precedent, will not be a tracked file at all.

**(b) The guard's natural file scope is `integrations.js` + `state.js`, not
`integrations.js` alone — and for ONE collection it also needs `views.js` +
`import-capture.js`.** Mirroring the books precedent's own file split
(`pendingBookSync` bookkeeping lives in `state.js:966-1034`, the merge consumer
`mergeRemoteBookDoc` lives in `integrations.js:717-794`, and the write-path
`markBookPending` calls live in `views.js` at 5 sites):

| File | Needed for | Collections |
|---|---|---|
| `js/integrations.js` | the guard check inside each clear-loop (§2 anchors) | all 5 |
| `js/state.js` | new `pending<X>Sync` bookkeeping (mirrors `state.js:966-1034`) + the creation-chokepoint `markPending` call | arcs, subTheories, themes, artifacts (their `create*`/`ensureOne*` fn already lives in `state.js`) |
| `js/views.js` | the creation-chokepoint `markPending` call | **notebook only** — `captureNote` (`3428`), inline journal quick-add (`3775`), marginalia-autosave create (`~14595`) |
| `js/import-capture.js` | the creation-chokepoint `markPending` call | **notebook only** — `commitEntries` (`280`) |

**4 of 5 targets (arcs, subTheories, themes, artifacts) can ship inside
`integrations.js` + `state.js` only** — their single creation chokepoint is already a
`state.js` function. **notebook is the exception**: none of its 4 creation sites are
centralized in `state.js`, so a clean transplant needs `views.js` + `import-capture.js`
too.

**Concrete Lane-A collision risk.** `git show --stat` on the two most recent R-POLISH
commits confirms **Lane A actively edits `views.js`**: `c2c9d68` (+144 lines in
`views.js`) and `a443b45` (touches `sw.js`/`CLAUDE.md`/`components.css`/
`r-polish-b4.md`, no `views.js` this specific commit, but the round as a whole does).
Per CLAUDE.md's Worktree & Merge Protocol: *"Same-file work (anything editing
views.js) stays in ONE worktree, sequential."* **If FX-1 includes the notebook target
and Lane A is concurrently live on `views.js`, the two-file "zero overlap" premise in
this task is false for that one collection.** Options for the parent session to
decide, not this recon's call: (i) scope FX-1 to the 4 clean collections
(arcs/subTheories/themes/artifacts) this swing, defer notebook to a follow-up once
Lane A's `views.js` work has landed/sequenced; (ii) confirm Lane A is not currently
live (no worktree for it exists on disk right now, per §0 — it may already be safe);
(iii) accept the same-worktree-sequential rule and build FX-1 strictly after Lane A's
current `views.js` batch commits.

**Zero overlap confirmed for the 4 clean collections** (arcs, subTheories, themes,
artifacts): their entire fix — bookkeeping, guard, creation-site mark — lives in
`state.js` + `integrations.js`, neither of which any R-POLISH commit in this session's
visible history (`685e215` through `a443b45`) has touched (`git log --oneline -- js/integrations.js js/state.js` since `685e215`: **zero commits**, confirmed).

---

## HALT-WORTHY summary (ranked)

1. **[SCOPE / FILE-OVERLAP]** notebookEntries' guard cannot stay inside
   `integrations.js` (+`state.js`) — it needs `views.js` (3 sites) and
   `import-capture.js` (1 site), the one file Lane A is actively editing. Recommend
   scoping this swing to the 4 clean collections and deciding notebook's timing
   separately. (§3, §6)
2. **[PREMISE]** `assets/lumen-amber.css` is 14,966 B, not the 14,681 B this task (and
   this agent's own prior memory) states as the byte-lock — legitimately committed at
   `124fe99`, self-confirmed in `a443b45`'s own commit message. Not a defect; update
   the expectation. (§0)
3. **[PREMISE]** "F-DL1" is an overloaded label in this repo's own history: the commit
   `c70f0dc` titled "F-DL1" already shipped the **outgoing**-clobber fix for these same
   5 collections. This task's "F-DL1" defect (the **incoming** wipe) is the R1 residual
   those three already-shipped commits (`f-dl1-fix.md`, `f-dl3-fix.md`) explicitly
   named and deferred, under the SAME "F-DL1" name. Recommend the parent session use a
   disambiguated name (the task's own "FX-1" is fine) in any commit subject so it is
   not read as re-doing already-shipped work.
4. **[SCOPE — required pairing, not a blocker]** arcs and subTheories are transitively
   coupled (`subTheory.arcId`) — both guards must ship together, not split across
   separate swings, or a preserved sub-theory can point at a wiped arc. (§3)
5. **[DOC DRIFT]** `integrations.js:31-49`'s F-DL1 doc-block still says
   "profile/readerModel are deferred to F-DL3" — F-DL3 and F-DL4 both shipped and
   closed that deferral (for the outgoing direction) two commits ago
   (`9914dd9`/`cfd168f`). Comment-only, non-blocking, worth a one-line correction in
   the same commit that touches this block next. (§1)
6. **[TREE HYGIENE]** `CLAUDE.md` + `docs/checkpoints/r-polish-b4.md` are dirty
   (docs-only, unrelated to FX-1). Not FX-1's to clean, but note before FX-1's own
   commit so a diff review isn't confused about origin. (§0)

No collection in the 5-target population fails to transplant at the **merge-logic**
level (item 1 is a file-scope/worktree-collision finding, not a mechanism failure).
Books' guard (already shipped) is unaffected by anything above — read but not
re-verified byte-for-byte this session beyond the `mergeRemoteBookDoc`/pending-set
function bodies quoted in §1.
