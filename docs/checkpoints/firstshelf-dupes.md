R-FIRSTSHELF-DUPES STARTED

# STAGE 0 — PRE-FLIGHT RECON (read-only)

Date: 2026-08-29 · Base 216d07a · v3.283 · HEAD == origin/main · main

## 1. Protocol docs

FOUND + READ: CLAUDE.md · PROTOCOL.md · docs/FIX-PROTOCOL.md (v1.2) ·
docs/studio/sequence.md (head) · `sh tools/ground-truth` (hook ARMED,
core.hooksPath=hooks).
NOT READ this stage (pointers, not governing for a fix round): design-spec.md,
BUILD_STATE.md, docs/studio/<surface>.md, PRINCIPLES.md.
NOT FOUND: none of the named docs were missing.

## 2. Repo state

HEAD 216d07a60163f194ae2e2daf66c4287186fc6e6e == origin/main
CACHE_VERSION 'praxis-v3.283' (sw.js:10)
tracked-dirty 0 · untracked 106 (non-goal)

Byte baselines (raw / LF-norm / working-tree CR / blob CR):
  js/views.js          1118194 / 1118194 / 0 / 0
  js/integrations.js    156487 /  152974 / 3513 / 0
  js/state.js           187734 /  183808 / 3926 / 0
  assets/components.css  882277 /  882277 / 0 / 0
  sw.js                    6041 /    6041 / 0 / 0
Parse gate baseline: `cscript //nologo //E:jscript tools/parse-check js/views.js`
  -> "PARSE OK: js/views.js", exit 0.

## 3. Anchors — ALL RESOLVE. No dead anchor.

DEDUPE INFRASTRUCTURE ALREADY EXISTS (grep, not memory).

A. Identity key — views.js:7460 `bookIdentityKey(title, author)`
   returns 'ta:' + resolverNormalize(title) + '|' + resolverNormalize(author)
   9 occurrences in views.js. ISBN branch DELIBERATELY REMOVED (comment :7455-7459).
B. resolverNormalize — integrations.js:2063. lowercase; [^a-z0-9 ]+ -> ' ';
   collapse ws; trim. Does NOT strip leading articles. Does NOT strip credentials.
C. findShelfBookByIdentity — views.js:7467 (4 occurrences). Blank key 'ta:|' is
   never a dup signal.
D. Cleanup scan — views.js:7486 `scanLibraryForCleanup(uid)`.
E. Merge — views.js:7528 `mergeBookDuplicates(uid, keepId, dropIds)` (3 occ).
F. Manual-merge SURFACE ALREADY EXISTS — views.js:7714 `openLibraryCleanup()`,
   reached from the Shelf Manage sheet "Tidy library" chip (views.js:4581-4586).
   Per-group "Merge" button at :7824. "Resolve all" bulk auto-merges every group
   at :7787-7791.

SHELVE PATH (prompt cited ~9099-9102 — VERIFIED, shifted):
  views.js:9091 `scanShelve()` -> loop over scanResult.confident ->
  views.js:9102 `scanCommitBook({...}, null)`.
  Cover-candidate defensive read is at 9098-9101; the commit call is 9102.
RECORD WRITE + FIELD SHAPE — views.js:8573 `scanCommitBook(spec, cb)`:
  { id, title, author, isbn, addedAt, status, genre, coverUrl, coverCandidates }
  then ensureBookFields (state.js:387) -> push to state.userBooks[uid].bookIds ->
  markBookPending -> markBooksDirty -> saveState.
  ** scanCommitBook HAS NO DUPLICATE GUARD. It unconditionally mints genBookId(). **
  3 call sites: :8559 (verdict-card Add) · :8662 (denied/offline ISBN door) ·
  :9102 (Shelve N).
RECORD ID — state.js:1314 `genBookId()` = 'book_' + Date.now() + '_' +
  Math.floor(Math.random()*1e6). NOT stable across two scans of the same physical
  book. Confirmed by construction.
MARKS / NOTES / ANNOTATIONS attach by RECORD ID in 7 places (deleteBook,
  views.js:7366, is the census): userBooks.bookIds · arcs[].bookIds ({id,addedAt}
  or bare string) · subTheories[].evidence[{kind:'book',refId}] ·
  notebookEntries[].bookIds (marginalia/journal/question) · userThemes[].bookIds ·
  bookArtifacts[artifactKey(uid,bookId)] · pending-sync registries.
  PLUS reader-authored fields carried ON the book record itself (state.js:387-427):
  valueMarks[] (each {value, why} — `why` is authored prose), movedMe, rating,
  dateRead, categoryOverride, traditionOverride.
TRAY RENDER — views.js:8820-8848. Already computes `owned` via
  findShelfBookByIdentity (:8826) and sets `data-owned="1"` on the cover node
  (:8846); comment reads "SOFT library signal (duplicates legal)".
SHELVE COUNT — views.js:8909 `scan-rv-shelve-n` = scanResult.confident.length;
  :8911 disables the button at conf===0; scanShelve() shelves the whole confident
  array unconditionally.
EXISTING NEAR-DUPE LOGIC (greped, reported even where unused here):
  views.js:6300 manual-add fold · :6642-6690 bulk-paste CX-2 dedup (ISBN-form on
  normalized ISBN, title-form on bookIdentityKey) · :8820 within-scan SCA3 dedupe
  (absorb + tick) · :8466 scanComputeContext "On your shelf" ·
  integrations.js:2070 titleCloseness (resolver scoring, not identity).

## 4. Does an identity helper already exist that R1 should EXTEND?

YES. `bookIdentityKey` (views.js:7460) is already the single shared source, used by
the cleanup grouping AND every add-guard. R1 extends THIS function; it does not add
a second one. This satisfies the prompt's "ONE shared identity function" directly.

## 5. Dead anchors

NONE. Every anchor the prompt cited resolves. The prompt's ~9099-9102 shelve-path
cite is off by a few lines (the commit call is :9102); anchor confirmed.

## 6. HALT-TIER CONDITION — §9 red-team cannot run

This session carries a standing instruction barring subagent dispatch. FIX-PROTOCOL
§9 requires a `fix-red-team` pass before EVERY commit gate, and §1#8 requires a
recon-reviewer gate. Per CLAUDE.md's agents-barred rule this is named as a HALT-tier
condition for Preston's ruling, NOT silently substituted with an inline pass.
This round touches the DATA-LOSS / STATE tier (merge, delete, tombstone), which is
FIX-PROTOCOL §5 path C — the tier that gets the MOST scrutiny. Preston rules.

## 7. FINDINGS (evidence-backed, pre-build)

F1. Why Preston's duplicates were never caught. resolverNormalize maps
    "Helen Fisher, PhD" -> "helen fisher phd" and "Helen Fisher" -> "helen fisher".
    Keys differ -> not grouped -> "Tidy library" reports 0 duplicates for the exact
    pair he is looking at. The surface is not broken; the KEY is too narrow.
F2. "Jefferson Fishe" vs "Jefferson Fisher" -> surnames "fishe" / "fisher" ->
    NO MATCH under the spec's surname rule. Reported per prompt Stage 4 item 1.
F3. `data-owned` is a DEAD ATTRIBUTE. Exhaustive grep across assets/ js/ *.html
    returns exactly ONE occurrence: the setAttribute at views.js:8846. Zero CSS
    selectors, zero readers. R3's "already shelved" mark has no visual presence
    today and no code reads it.
F4. DATA-LOSS PATH IN THE EXISTING MERGE. mergeBookDuplicates repoints all 7
    id-keyed collections (parity with deleteBook, verified line by line) but
    copies only BIBLIOGRAPHIC fields off the drops (coverUrl, isbn, pageCount,
    publisher, year, description, genre) plus read-status. It does NOT union
    `valueMarks` (authored `why` prose), `movedMe`, `rating`, `dateRead`,
    `categoryOverride`, `traditionOverride` — then `delete state.books[dropId]`
    destroys them. Grep: `sed -n '7528,7690p' js/views.js | grep -c valueMarks`
    == 0. Under the prompt's HARD INVARIANT ("marks/notes/annotations are NEVER
    lost") the merge as it stands is not shippable for R2.
F5. "Resolve all" (:7787-7791) bulk-merges every duplicate group with no per-group
    consent. Widening the identity key makes that button destructive on Preston's
    real shelf. R2 says NO silent auto-merge.

## 8. Scope consequence of widening the key

bookIdentityKey is shared by 6 behaviors. Widening it also widens: the manual-add
fold (:6300), bulk-paste dedup (:6683), within-scan absorb (:8820), and the
"On your shelf" verdict line (:8466). That is the intended single-source design and
is consistent with R1, but it is a behavior change at 4 sites beyond the two the
prompt names. Flagged, not absorbed.

---

# STAGES 1, 2, 4 — BUILD + PROOF   (Stage 3 HELD)

Ruled 2026-08-29 by Preston: GO-AHEAD PARTIAL. Stages 1, 2, 4 run; Stage 3
(detection + manual merge) is HELD pending the §9 red-team gate and F4/T8.
CACHE_VERSION 3.283 → 3.284. Nothing pushed.

## SUMMARY OF WHAT SHIPPED (local)

1. The identity source became TIERED (Ruling 2), in the ONE existing function
   family. `bookIdentityKey` widened to normalized-title + first-author-SURNAME;
   `bookIdentityTier` added as the pairwise relation over it (exact / probable /
   near-miss / none); `isbnKey13` restores the ISBN branch as a TIER, not as part
   of the key (T9 recorded in-code so it is not folded back in).
2. The shelve path now consults it. `scanCommitBook` — the ONE commit point all
   three scan add-doors share — folds an EXACT match instead of minting a second
   record, enriching only blank fields.
3. The tray + review face mark EXACT and PROBABLE with distinguishable copy, stay
   visible, and the "Shelve N" count now equals what Shelve will CREATE.
4. F5 neutralized IN THIS COMMIT: `mergeBookDuplicates` has ZERO live callers.

## STAGE 1 — MEASURING THE DAMAGE

REAL DATA: NOT REACHED FROM THIS ENVIRONMENT. No local snapshot exists (grepped
`*.json` for `prestona255` / `book_17`: zero hits) and egress to the live origin is
blocked here. Per the ruling, the read-only console census is delivered instead:

    docs/checkpoints/firstshelf-dupes-census.js   (10,521 B, pure ASCII, 0 non-ASCII bytes)

It is READ-ONLY BY AUDIT, not by assertion. A write-pattern sweep over the file for
`saveState|mark*Dirty|localStorage|sv(|setItem|fetch(|XMLHttpRequest|delete state|
state.X[...] =|deleteBook|mergeBook` returns hits on COMMENT LINES ONLY (3 lines,
all prose). Every `.push` in it targets a script-local array. No network call.
It carries its own copy of the tier functions so it runs against the DEPLOYED
v3.283 bundle, which does not have them.

FIXTURE RUN (labelled fixture, NOT observation) — 9 records reproducing both known
pairs verbatim plus controls:

    total records            9
    DUPLICATE GROUPS         2   (EXACT 1 | PROBABLE 1)
    NEAR-MISS PAIRS          1

    GROUP 1 [PROBABLE]  "Anatomy of Love" / "Helen Fisher, P"  (no isbn; notebook-entries:1)
                      ~ "Anatomy of Love" / "Helen Fisher"
                        (isbn 0393285510 -> 9780393285512; arcs:1, themes:1,
                         valueMarks:1, rating:4, categoryOverride)
                        matched by: probable

    GROUP 2 [EXACT]     "Nineteen Eighty-Four" / "George Orwell"  (0451524934)
                      ~ "1984" / "Orwell, George"                 (9780451524935)
                        matched by: exact

    NEAR-MISS           "The Next Conversation" / "Jefferson Fishe"  (carries nothing)
                      ~ "The Next Conversation" / "Jefferson Fisher"
                        (arcs:1, subtheory-evidence:1, notebook-entries:1,
                         ARTIFACT(37 chars), valueMarks:1 WITH AUTHORED WHY, movedMe)

    Controls correctly NOT grouped: Counternarratives (Keene) vs (Giroux et al.);
    Fisher vs Fischer.
    RECORDS INSIDE A GROUP CARRYING ATTACHED CONTENT: 2

Note the near-miss record is the one carrying the most authored content. That is
the shape of the risk the held merge round has to handle.

THRESHOLD: the >8-groups stop condition is UNTESTED against real data. It will be
evaluated when the census comes back.

## STAGE 2 — PREVENTION

### 2a — the shelve-path guard

`scanCommitBook(spec, cb, out)` gained a third OPTIONAL out-param so the caller can
learn WHICH outcome it got. This is load-bearing, not cosmetic: an id returned from
a FOLD is a pre-existing book, and pushing it into `scanLastShelvedIds` would let
the batch Undo DELETE a book the reader already owned. `out.created` is the only
admissible admission test; a truthy id is not one. All 3 call sites opt in.

ENRICHMENT — `scanEnrichExisting(uid, bookId, spec)` fills ONLY blank fields:

    title, author, isbn, genre   (blank-string test)
    coverUrl                     (falsy test)
    coverCandidates              (absent-or-empty-array test)

DELIBERATELY NOT ENRICHED: `status`. Read-status is the reader's, and a fresh
scan's default `will-read` would silently un-finish a book marked read. Also never
touched: valueMarks, movedMe, rating, dateRead, categoryOverride, traditionOverride,
finishedAt. When nothing is filled, NOTHING is written at all — no save, no dirty
mark, no pending mark. Proven below.

### 2b — the tray + review marking (a BUILD; F3 said `data-owned` had zero readers)

    tray cover badge : same 16px tick geometry as the existing within-scan absorb
                       tick, seated LEFT so one cover can carry both.
                       EXACT    = filled  var(--gold-hi), glyph checkmark
                       PROBABLE = hollow  var(--gold-hi) inset ring, glyph "?"
    review-face flag : .spine-flag — the tray's existing flag typography —
                       re-scoped to .scan-dc.is-shelved / .is-maybe, coloured
                       var(--gold-deep). NO grayscale, NO lean rotation.
    copy             : "already shelved" / "may be a copy"
                       tray sub-line: "already on your shelf" / "may be a copy · still adds"

NOT USED: the `.is-lean` gray register (`--ink-3` + grayscale + rotate). Gray reads
as unavailable; these entries are informational and PROBABLE still adds.
The `.scan-dupe-tick` guard in `scanAddTick` was narrowed to `.is-absorbed` so an
owned badge can no longer suppress a real within-scan absorb tick.

COPY FIX (:8827 in the Stage-0 numbering): "may already own · legal to add" is
GONE. It promised the opposite of what the round does for an EXACT match.

### THE COUNT — a named resolution, flagged for your ruling

R3 says marked entries are "EXCLUDED from the Shelve count". Ruling 2 says the
auto-block is EXACT ONLY and "a PROBABLE match never silently blocks". Those two
sentences cannot both hold for PROBABLE: excluding it from the count while still
shelving it makes the button lie (says 5, creates 7).

RESOLVED AS: EXACT is excluded from the count (it folds, so it creates nothing);
PROBABLE is counted (it is not blocked, so it creates something). The invariant
kept is COUNT == BEHAVIOR, proven mechanically below. This is the same class of
dishonesty as T5's confidence line, so it was treated as a correctness constraint
rather than a style choice. If you want PROBABLE excluded too, it must ALSO be
blocked — say so and it is a one-line change on both sides.

### RULING 4 — F5, neutralized in the SAME commit

    "Resolve all"   : the merge loop is REMOVED. The button is now
                      "Resolve all covers →" and does covers only. Kept rather
                      than deleted because it also drives the cover
                      re-resolution, which works and is useful.
    per-group Merge : DISABLED, labelled "Merge — held", with an inline note.

DETERMINATION BEYOND THE LITERAL RULING, stated plainly: Ruling 4 names only the
"Resolve all" bulk. I gated the PER-GROUP Merge as well. Reason: it is the same
hazard from the same cause. It was effectively unreachable while the key was too
narrow to group anything; the widening in THIS commit makes it live on your real
shelf, and it calls the same `mergeBookDuplicates` that drops valueMarks (with
authored `why`), movedMe, rating, dateRead, categoryOverride, traditionOverride.
Shipping it enabled would have violated this round's own hard invariant that marks
are never lost. DETECTION IS UNTOUCHED — groups still render, still count. Only the
destructive action is off. Reverse it in one line if you disagree.

COPY IS A CONTRACT: the group note said "merge keeps your notes and the read
status" — false per F4 — now "N copies of this book on your shelf."

### 2c — CALL-CHAIN TRACES (T3: prove the call site EXECUTES)

    CHAIN 1 (Shelve N)
      location.hash '#scan' -> renderRoute parts[0]==='scan' (views.js:851)
      -> renderScan (:9547) -> scanWireShell (:9559 call / :9748 def)
      -> addEventListener('click', scanShelve) on #scan-rv-shelve (:9760)
      -> scanShelve -> scanCommitBook(spec, null, sout) -> findShelfMatch
      -> bookIdentityTier -> isbnKey13 / bookIdentityKey
      Button markup: views.js:9742 id="scan-rv-shelve".

    CHAIN 2 (verdict card Add, barcode mode)
      ... renderScan -> scanWireShell -> addEventListener('click', scanVerdictAdd)
      on #scan-vd-add (:9764) -> scanVerdictAdd (:8667) -> scanCommitBook(..., vout)

    CHAIN 3 (denied/offline ISBN door)
      ... renderScan -> scanWireShell -> scanWireAddDoors (:9771 call / :8799 def)
      -> scanWireIsbnDoor (:8832) -> btn 'click' / input Enter -> go()
      -> scanCommitBook(..., dout)

    CHAIN 4 (tray marking)
      shutter -> scanShelfVision callback (:8962) -> scanResolveAndFill (:8972)
      -> findShelfMatch -> scanDropTrayCover(item, key, tier)

    CHAIN 5 (review flags + count)
      #scan-tray-review-btn 'click' -> scanRenderReview (:9757 wiring, :9082 def)
      -> findShelfMatch per confident item -> shelveN -> #scan-rv-shelve-n

All five terminate at a real listener bound in `scanWireShell`, which `renderScan`
calls on every entry to `#scan`. No new function is reachable only by grep.

## STAGE 4 — PROOF

Harness: cscript JScript (ES3), driving the SHIPPED function text extracted from
`js/views.js` + `resolverNormalize` from `js/integrations.js`. Not a
re-implementation.

HARNESS SELF-VALIDATION (§9's "trivially-passing check" test):

    real copy                                 -> exit 0
    broken copy (one expected tier flipped)   -> exit 1     PASS

Recorded: an earlier run through `| tail -3` reported exit 0 on the BROKEN copy
because `$?` was tail's, not cscript's. That is exactly the pipe-exit trap §9
names. All exit codes below are taken WITHOUT a pipe.

### PROOF 1 — the tier table                        31/31, exit 0

    "Helen Fisher, PhD" vs "Helen Fisher", same title      -> probable   PASS
    "Jefferson Fisher" vs "Jefferson Fishe", same title    -> near-miss  PASS
    ISBN-10 vs ISBN-13 of one edition                      -> exact      PASS
    Counternarratives (Keene) vs (Giroux et al.)           -> none       PASS
    "The Politics of Education" vs "Politics of Education" -> probable   PASS
    two different books, one author                        -> none       PASS
    same title+surname, two DIFFERING ISBNs                -> probable   PASS
    Preston's observed pairs, verbatim strings             -> probable / near-miss

    GUARDS: Fisher vs Fischer -> none (no prefix/fuzzy merge) · blank identity ->
    none, both directions · ISBN wins over unrelated titles · subtitle NOT
    stripped · Ed.D / MD / no-comma credential · surname-first vs given-first ·
    near-miss requires equal titles · blank author both sides.
    KEY SHAPE + ISBN NORMALIZATION: 11 further assertions, incl. the X check digit
    and rejection of a 13-digit code containing X.
    Every tier assertion runs in BOTH directions — symmetry proven, not assumed.

### PROOF 2 — shelve-path prevention                34/34, exit 0

BEFORE (base bytes at 216d07a, SAME scenario, run against `git show 216d07a`):

    shelf before: 1   shelf after: 2   ids: book_OLD, book_NEW1
    base key("Anatomy of Love","Helen Fisher, PhD") = ta:anatomy of love|helen fisher phd
    base key("Anatomy of Love","Helen Fisher")      = ta:anatomy of love|helen fisher
    FAILURE REPRODUCED: a second record was minted for the same book.

That is F1 proven mechanically rather than argued: the credential made the two keys
unequal, so the guard could never have fired.

AFTER:

    2.1 EXACT match, all fields populated
        no second record (shelf 1 -> 1) · returned the EXISTING id ·
        created=false, folded=true, tier=exact ·
        coverUrl / isbn / author / genre NOT overwritten ·
        status stays 'read', finishedAt intact ·
        valueMarks intact INCLUDING the authored why · movedMe · rating ·
        dateRead · categoryOverride all intact ·
        nothing enriched -> saves=0, dirty=0 (no write occurred at all)

    2.2 EXACT match, blanks present
        author / genre / coverUrl / coverCandidates FILLED; enriched list is
        exactly [author, genre, coverUrl, coverCandidates];
        populated isbn NOT overwritten by the 13-form;
        exactly one save, one dirty mark, one pending mark

    2.3 PROBABLE match -> NOT blocked; second record created; tier recorded as
        'probable'; the pre-existing record untouched

    2.4 no match -> normal add still works (control, nothing over-blocked)

    2.5 UNDO SAFETY — replicating scanShelve's admission test verbatim over a
        2-item confident list: folded=1, created=1, the pre-existing id is NOT in
        the Undo list, shelf grew by exactly 1

    2.6 signed out -> returns null, creates nothing, no crash (control)

### PROOF 3 — the count excludes marked entries AND matches behavior   7/7, exit 0

Shelf holds 2 books. Confident set of 4: one EXACT dupe, one PROBABLE, two new.

    marking:  "Anatomy of Love"        -> exact    ("already shelved")
              "Politics of Education"  -> probable ("may be a copy")
              "Pedagogy of Hope"       -> none
              "Counternarratives: ..." -> none

    confident band still shows ALL 4 (marked entries stay VISIBLE)      PASS
    Shelve count = 3, not 4 (the EXACT match is excluded)               PASS
    COUNT == BEHAVIOR: shelveN 3 === records actually created 3         PASS
    the PROBABLE entry WAS shelved, not silently refused                PASS
    shelf 2 -> 5; no pre-existing id entered the Undo list              PASS

Base v3.283 would have shown "Shelve 4" and created 4 — one a duplicate.

### PROOF 4 — F5: "Resolve all" cannot bulk-merge at HEAD

Using CLAUDE.md's own T3 idiom — count == 1 means the only occurrence is the
DEFINITION, i.e. zero callers:

    BASE 216d07a   grep -c 'mergeBookDuplicates('  = 3
                     :7528 definition · :7791 Resolve-all loop · :7824 per-group btn
    HEAD           grep -c 'mergeBookDuplicates('  = 1
                     :7637 definition ONLY

`mergeBookDuplicates` now has ZERO live callers. It is deliberately dead until the
held round.

### PROOF 5 — call chains

See 2c. Five chains, each terminating at a listener bound in `scanWireShell`.

### PROOF 6 — gates, bytes, EOL

    PARSE     tools/parse-check js/views.js -> "PARSE OK", exit 0
              tools/parse-check sw.js       -> "PARSE OK", exit 0

    ES3 FLOOR staged-diff scan for '=>' / 'const ' / 'let ' / 'class ' / backtick:
              '=>' 0 · 'const ' 0 · 'let ' 1 · 'class ' 2 · backtick 8
              ALL 11 hits inspected: every one is inside a // comment line
              (prose: "would let the batch Undo…", "the same class of…",
              "`status` is deliberately NOT…"). ZERO ES5 syntax. The parse gate,
              which uses new Function() and rejects ES5 syntax, is the authority
              and is green.

    BYTES     (LF-normalized, measured before AND after — never back-derived)
              js/views.js            1,118,194 -> 1,134,070   delta +15,876
              assets/components.css    882,277 ->   883,703   delta  +1,426
              sw.js                      6,041 ->     6,041   delta      +0

              sw.js +0 is the exactly-predictable case (equal-length version
              string); a nonzero here would have been an EOL-flip red flag.

              views.js diff classification (FIX-PROTOCOL §3 two-figure rule):
                net CODE delta    =  +5,109 B  (EXACT, re-measured off the staged blob)
                net COMMENT delta = +11,019 B   (69% of growth is provenance)
              added 303 lines / removed 51 lines; the 252 B gap between the
              diff-derived total (16,128) and the measured staged delta (15,876) is
              exactly the per-line +/- marker overhead (303 - 51 = 252).
              No band was declared at Stage 0 (none was requested), so this is
              reported as classification, not as a band test.

    EOL       staged-blob CR counts, measured at stage time off the STAGED blobs:
              js/views.js 0 · assets/components.css 0 · sw.js 0 ·
              docs/checkpoints/firstshelf-dupes-census.js 0

    FOUNDATIONS  neither lumen-amber.css nor marks.js is touched — not staged;
                 git status shows them clean.


### RE-MEASUREMENT NOTE (index hygiene) — recorded because the first figure was wrong

The first byte pass was taken after an initial `git add`, and three comment-only edits
landed AFTER it (the `scanResolveAndFill` header, the stale `:7565` pointer at
`scanNormTitle`, and the stale "normalized title+author" description at
`scanLibraryForCleanup`). `git status` then showed `MM js/views.js` — index behind
working tree. Everything above is the RE-MEASUREMENT taken off the STAGED BLOBS after
re-adding, with `git diff --name-only` confirmed EMPTY (index == working tree).

    first pass  : views.js +15,545   code ~+5,109 / comment ~+10,684
    re-measured : views.js +15,876   code  =+5,109 / comment  =+11,019

The CODE floor is IDENTICAL across both passes (+5,109), which is the evidence that
the later edits were comment-only rather than an assertion that they were. The whole
+331 difference is comment bytes. Per FIX-PROTOCOL section 3's two-figure rule the
code band held and the overage clears by line classification.

All three proof harnesses and the parse gate were RE-RUN against these final staged
bytes: 31/31, 34/34, 7/7, all exit 0; `PARSE OK: js/views.js` exit 0.

## STAGE 4 ITEM 7 — WHAT CHANGED AT THE FOUR F6 SITES

The widened key is inherited by four sites beyond the two the round names. This is
the intended single-source design (Ruling 2). What each now does differently:

**:6300 — MANUAL-ADD FOLD (openShelfEditor save).** Reaches PROBABLE strength, NOT
exact: `findShelfBookByIdentity` has no ISBN parameter, so it can only ever see the
title+surname key. BEFORE it folded only on exact normalized title+author string
equality. NOW, typing "Anatomy of Love / Helen Fisher, PhD" while "Anatomy of Love
/ Helen Fisher" is shelved navigates to the existing copy instead of minting a
second; likewise "The Politics of Education" folds onto a shelved "Politics of
Education".
FLAGGED: this means the MANUAL path folds on PROBABLE while the SHELVE path blocks
only on EXACT. The asymmetry follows directly from your two rulings (F6 sites
inherit; shelve-path is exact-only) and it is defensible — a human typed this
title, and the fold is non-destructive, it opens the copy they have. But it IS an
automatic action on a PROBABLE match, which is the thing Ruling 2 was written to
avoid elsewhere. Naming it rather than absorbing it. One line to make it
exact-only if you want symmetry. Logged as T10.

**:6683 — BULK-PASTE DEDUP (title-form lines).** Key is `bookIdentityKey(line, '')`
— author is empty at paste time, so the key is `ta:<title>|`. The only change is
article-stripping: pasting "The Politics of Education" now dedups against a shelved
title-only "Politics of Education". The interaction with the shelf-seeded keys at
:6658 is UNCHANGED — a title-form line's empty surname could only ever collide with
a shelf book that also has a blank author, before and after.

**:8820 — WITHIN-SCAN ABSORB (SCA3).** Two vision reads of the same spine that
differ only by a credential or a leading article now absorb into ONE tray entry
instead of two. Strictly better; this is the same defect class inside a single scan.

**:8466 — scanComputeContext "On your shelf".** Now reports "On your shelf" for a
surname-level match too. Informational only — it flips the verdict card's action
from Add to Open, which is non-destructive and matches the manual-add fold.

## RESIDUALS AND HONEST GAPS

**R1 — VISUAL GATE NOT CLEARED.** The tray badges and review flags are proven
STRUCTURALLY (classes, tokens, copy, count) and NOT visually. This rig has no
camera and cannot drive the scan overlay, and egress to the live origin is blocked
here. Per the FELT-DELTA CLAUSE, the owner-visible delta to judge, at 390:

    BEFORE: a re-scanned shelf shows nothing distinguishing books you already own;
            "Shelve 17" shelves 17 and silently duplicates 4.
    AFTER:  those covers carry a small gold tick at their top-LEFT (filled +
            checkmark = already shelved; hollow + "?" = may be a copy), the review
            card under them reads "ALREADY SHELVED" / "MAY BE A COPY" in small gold
            mono caps, and the button reads "Shelve 13".

A round does not close until you have seen that. It is not claimed as done.

**R2 — CREDENTIAL SET** is the ruled list only: PhD, Ph.D., Ed.D, MD, Jr. NOT
handled: Sr, II, III, DPhil, MFA and similar. Deliberately not widened beyond the
spec; log it if you hit one.

**R3 — THE >8-GROUP THRESHOLD** is untested. It needs the census.

**R4 — §9 RED-TEAM DID NOT RUN on this diff either.** The bar applies to the whole
session, not only to Stage 3. Stage 2 is additive and non-destructive, which is why
you released it, but the gate is still formally unmet and this commit is LOCAL and
UNPUSHED. It should get a genuine human read — or a red-team pass in a session that
can spawn agents — before it goes out.


**R5 — a NEW quiet dead-end, introduced by this change, named not absorbed.** If EVERY
book in a scan's confident set is an EXACT match on the shelf, `shelveN` is 0, so the
Shelve primary is disabled — and the review screen then offers no action on that band
at all. The reader is not trapped (Back returns to the camera, the walker still handles
exceptions, the draft persists), but there is no "clear these" affordance and the
disabled primary is the only thing the band points at. Before this change the button was
always live when `conf > 0`. This is the honest cost of making the count truthful, and
it is a real felt-pass item — if it reads badly on your device the fix is a done-door
variant for the all-already-shelved case, not a reversion of the count.

**R6 — INLINE SELF-REVIEW ONLY, and that is not §9.** I ran an adversarial read of my own
diff (scope, out-param handling, null/signed-out branches, stale-draft items lacking the
new `isbn` key, CSS cascade collisions, O(n·m) cost of the per-item shelf walk — no
complexity regression, the prior code walked the shelf per lookup too). Everything above
is what that pass produced. It is a self-check by the same agent that wrote the code,
which FIX-PROTOCOL §9 exists precisely because it does not trust. It is recorded as
what it is and is NOT offered as the gate.

## CARRIED-DEBT LEDGER (additions)

**T8.** `mergeBookDuplicates` does not union `valueMarks`, `movedMe`, `rating`,
`dateRead`, `categoryOverride`, `traditionOverride`. Reader-authored prose in
`valueMarks[].why` is LOST on merge. It repoints all 7 id-keyed collections
correctly (verified line-by-line against `deleteBook`) — the loss is confined to
fields carried ON the book record, which `delete state.books[dropId]` destroys.
BLOCKS the held Stage 3 round. Currently harmless: zero callers.

**T9.** `bookIdentityKey`'s ISBN branch was deliberately removed at CX-2 — a bare
ISBN key made a title-only copy and an ISBN-bearing copy of one work MISS each
other. It is restored as a TIER, not folded back into the key. The reason is
recorded in-code at the function so it is not "restored" into the key again.

**T10.** Manual-add fold (:6300) folds on PROBABLE while the shelve path blocks
only on EXACT. Ruled asymmetry, flagged for confirmation — see item 7.
