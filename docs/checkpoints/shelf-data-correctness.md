# SHELF DATA-CORRECTNESS ROUND — STARTED

HEAD a273438, main, tree clean. Data-loss tier. deleteBook = read-only reference.
repo-mapper confirmed every premise (agent a707ba6b).

## Symbols (re-derived; prior anchors stale post-R2)
- deleteBook(uid,id) views.js:7088-7171 — REFERENCE, byte-locked read-only.
- scanLibraryForCleanup(uid) views.js:7180 (dup key at 7199).
- mergeBookDuplicates(uid,keepId,dropIds) views.js:7215-7280.
- openShelfEditor single-add save: state.books[id] write 5854, userBooks push 5875, markBookPending 5876.
- processBulkLines bulk-add: state.books[id] 6227/6249, userBooks push 6256, markBookPending 6257; within-paste ISBN-only dedup seenIsbns.
- state.js: markBookPending 922, clearPendingBookSync 946, markBookDeletePending 982, artifactKey 1091 (userId+':'+bookId), ensureArtifactFields 1113 (artifact = {userId,bookId,title,body}).
- resolverNormalize: integrations.js:1984 (lowercase, strip non-[a-z0-9 ], collapse ws, trim).
- Author rail: booksMap=state.books (4090); authors loop 4099; authorCounts loop 4115 — RAW state.books (CX-3). Deduped set the siblings use = shelfBookIds (3781) / lcArr (4152).

## CX-1 PARITY TABLE  mergeBookDuplicates vs deleteBook (coverage target)

| # | collection | deleteBook | merge NOW | GAP | merge FIX (repoint onto survivor) |
|---|---|---|---|---|---|
| 1 | userBooks.bookIds | remove | remove drops | — | keep |
| 2 | state.books | delete | delete drops / enrich keep | — | keep |
| 3 | arcs.bookIds ({id,addedAt}/bare) | remove | repoint drop→keep (shape-kept, dedup) | — | keep |
| 4 | subTheories.evidence {kind:book,refId} | remove | **UNTOUCHED** | YES | REPOINT refId drop→keep, dedup; markSubTheoriesDirty |
| 5 | notebookEntries.bookIds | remove | repoint drop→keep (dedup) | — | keep |
| 6 | userThemes.bookIds | remove | **UNTOUCHED** | YES | REPOINT drop→keep, dedup; markThemesDirty |
| 7 | bookArtifacts[key(uid,id)] | delete | **UNTOUCHED** | YES | REPOINT/MERGE per artifact-collision rule; markArtifactsDirty |
| 8 | tombstone (clearPendingBookSync + markBookDeletePending) | yes (deleted id) | **only markBookPending(keepId)** | YES (CRIT resurrection) | per dropId: clearPendingBookSync(uid,[drop]) + markBookDeletePending(uid,drop). NEVER keepId. |

Merge = REPOINT user data onto survivor (evidence/themes/artifact preserved), NOT destroy. Only the dropId RECORD is deleted (already) + tombstoned.

## ARTIFACT-COLLISION RULE (principle 3: one artifact per user per book; reviewable)
For each dropId with an artifact at key(uid,drop):
- keep has NONE → move drop's artifact to key(uid,keep), set .bookId=keepId (repoint the book link). Preserves writing.
- BOTH exist → keep's stays canonical; append drop's title+body into keep's body under a merge marker ("\n\n— merged from a duplicate copy —\n"), only if non-empty. NEVER silently delete.
Then delete key(uid,drop). ensureArtifactFields(keep art).

## CX-2 dedup-on-add
Identity key = SAME as merge: `bookIdentityKey(t,a) = 'ta:'+resolverNormalize(t)+'|'+resolverNormalize(a)`. New single-source helper; scanLibraryForCleanup:7199 refactored to call it (no divergence). Guard reuses findShelfBookByIdentity(uid,t,a).
- single add: on collision → FOLD (no new entry; navigate to the existing copy).
- bulk add: on collision (vs shelf OR earlier in the same paste) → SKIP the line. Seed the seen-set with the existing shelf's keys.

## CX-3 Author rail (ledger books.md:152 + RE-GRADE :179 HIGH)
Quote: "The Author filter rail reads raw state.books directly (authors/authorCounts ... for (abid in booksMap)/for (tcid in booksMap)) instead of the deduped shelfBookIds/lcArr set that every sibling rail was reworked to use ... an author whose only book(s) are orphan/duplicate records outside that set shows a >0 count in the sidebar but yields ZERO cards when clicked — 'rendered count == stored count' violation."
FIX: build a deduped authorSrc from shelfBookIds (mirrors lcArr), iterate it in both author loops instead of raw booksMap. Counts then match the rendered set.

## SCOPE: views.js only. deleteBook byte-locked. sw.js bump at ship. NON-GOALS honored.

## CHECKPOINT A PASS (merge parity + tombstone)
Harness merge(keep,[drop]) w/ refs in every collection: evidence refId->keep, theme->keep, notebook->keep, arc->keep (shape kept); drop record/userBooks/artifact gone; artifact collision (both existed)->keep canonical + drop body appended under merge marker; drop tombstoned (getPendingBookDeletes), keep NOT; keep enriched (read+cover+isbn); saveState 1x. Parse OK. deleteBook byte-locked (no hunk in 7088-7171). Console clean.

## CHECKPOINT B PASS (dedup-on-add)
Shared key bookIdentityKey('ta:'+resolverNormalize(t)+'|'+resolverNormalize(a)); scanLibraryForCleanup refactored to it (single source). Single add of a shelf dup -> no new entry, FOLD to #book/<existing> (Save enabled via input events; count stayed 1). Bulk: two "Educated" lines + hyphenated existing ISBN skipped, genuinely-new book added (2->3). Guard returns null for new books. Parse OK.

## CHECKPOINT C PASS (author rail orphan-safe)
authorSrc built from shelfBookIds (mirrors lcArr); both author loops iterate it. Harness: orphan record ORPH (author "Ghost", NOT in bookIds) -> "Ghost Author" GONE from rail; only on-shelf author shows count 1 = 1 rendered card. abid/tcid removed (0 refs). Parse OK.

## FINAL: full diff = js/views.js (+185/-30) + sw.js (v3.185->v3.186) ONLY. components.css 0 diff; R2 symbols 0 changed; deleteBook byte-locked. Regression: deleteBook all-8+tombstone, move-to-arc persists, shelf/threads/sort/select intact, console clean.

## RED-TEAM #1 (fix-red-team) — 2 block-commit findings, FIXED
- FINDING 1 (block): merge evidence dedup destroyed distinct quote/annotation on 2 book-evidence entries resolving to keepId (regression — pre-fix merge never touched evidence). FIX: evidence loop is now REPOINT-ONLY in place (no seenKeepEv/keptEv collapse); every entry's quote+annotation preserved. PROVEN: 2 distinct quotes (Q1/A1,Q2/A2) both survive, both refId->K.
- FINDING 2 (block): single-add fold false-positived on the empty identity 'ta:|' (ISBN-only add w/ blank title) -> silently suppressed distinct ISBN adds. FIX: findShelfBookByIdentity returns null on key==='ta:|'; bulk seed+dedup skip 'ta:|'. PROVEN: findShelfBookByIdentity('','')===null; new empty-title add not folded.
- R-a (residual -> HARDENED): merge had no keepId∈dropIds guard; with the new tombstone that would delete the survivor from Firestore. FIX: filter keepId out of dropIds up front (safeDrops). PROVEN: merge(SURV,[SURV,DP]) -> SURV alive + NOT tombstoned, DP removed+tombstoned.
- R-b (bulk title dedup only catches empty-author shelf books): acknowledged, safe-direction MISS, documented.
- Verified-clean carried: tombstone, artifact collision, deleteBook byte-lock, CX-3, ES3, scope.
- POST-FIX: parse OK; ES3 added-lines 0; deleteBook non-intersected; A/B/C re-smoked green; F1/F2/R-a fixes proven; console clean. RE-REVIEW of the delta dispatched.

## RED-TEAM #2 (re-review of the 4 fixes) — CLEAN + 1 residual FIXED
Re-review verdict: RED-TEAM clean on all 4 fixes + every re-confirmed invariant (deleteBook byte-lock, tombstone, artifact, ES3, scope). One residual surfaced:
- R-x (NOT a regression, byte-identical grouping to HEAD, but the last asymmetric holdout): scanLibraryForCleanup grouped by bookIdentityKey WITHOUT the 'ta:|' guard the fixes added elsewhere -> could cluster DISTINCT blank-identity books (unresolved ISBN-only adds) into one dup group -> destructive merge loses a book's identity. FIXED: `if (gk === 'ta:|') continue;` at the group push (views.js:7291). PROVEN: two distinct blank ISBN-only books NOT grouped; real "Educated/Westover" dup STILL grouped. Parse OK, ES3 0, deleteBook byte-lock, scope views.js+sw.js, console clean. (One-line guard excluding a group from merge = strictly safer; no re-red-team needed.)

## SHIP-READY: js/views.js (+232/-47 region) + sw.js v3.185->v3.186. deleteBook byte-locked. R2 skin/features untouched (components.css 0 diff). Ledger: books.md (round entry + CX-1/2/3 resolved + state:built rounds:2) + builder.html regen. Nothing committed.
