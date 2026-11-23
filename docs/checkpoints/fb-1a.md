FB-1a STARTED

# FB-1a — the shelf lock and the notes guard — praxis-v3.340

Data-loss / state tier (FIX-PROTOCOL §5, path C, interim rule). Closes the audit's rows
BR-01 and BR-02 only. **FX-1 is NOT complete after this build** (see Known limits).

This build runs on its FOURTH cut, r4. The first cut was stopped at its own Stage 0 by the
recon gate (Finding F1); the second cut, r2, by F4, F5, F6 and R-B, re-cut on Preston's ruling
R5; the third cut, r3, by D, re-cut on R7. Nothing of any of them was applied; their patches,
numbers and scratch copies are discarded. What their Stage 0 runs found is kept at the end of this file,
cut by cut, as the record of what the recon gate changed.

## What was wrong

- **BR-01.** Each collection's write latch (books, arcs, sub-theories, lenses, artifacts,
  notes) opened when the sign-in load SETTLED, and an errored read counted as settled. Every
  cloud write is a whole-document `.set()` built from the device's copy. So a device whose
  copy was behind (or empty) that failed its read and then changed anything replaced the
  cloud's document with its own copy.
- **BR-02.** The notebook's load deleted EVERY local note of the uid and laid in the cloud
  copy. A note the cloud never received (written with no signal, the app closed before the
  write went out) was deleted at the next good load. This is the debt the repo names FX-1b
  for the notebook (docs/launch-runway.md, the FX-1 row).

## Rulings (Preston, 22 and 23 Nov 2026)

- **R1** The audit's push: "Hold the push (Recommended)". The audit commit stays local, unpushed,
  by this ruling.
- **R2** The order of the fix builds: 1a (this), then 1b (the rest of data safety), then 2
  (platform guard rails), then the phone walk, then the book page.
- **R3** The notice's words, ruled twice. The first wording ("… What you write is kept on this
  device.") was withdrawn after the first Stage 0 showed it untrue for an edit lost under L1.
  Final for this build: "Can’t reach your library right now. New notes and books are kept on
  this device."
- **R4** Carried from docs/launch-runway.md: "No outside account is invited before FX-1 is
  COMPLETE." FB-1a does NOT complete FX-1.
- **R5** On the r2 Stage 0 report and its shelf-sort question (23 Nov 2026): "Re-cut now
  (Recommended)" — the comparison uses the reader's own fields; the build chat re-cut. That
  re-cut is r3.
- **R6** On how the build chat finishes r3 (23 Nov 2026): "Trim and deliver (Recommended)" —
  the chat ran the final build four times and the four new mechanism-removed legs on the final
  bytes; the six older legs are not re-run in the chat. This executor's runs of every leg are on
  the final bytes.
- **R7** On the r3 Stage 0 report (23 Nov 2026): "Fix it now, small (Recommended)" — a fourth
  cut that changes only D, proved in the chat by two runs of the final build, r3's own reading of
  the new steps, and the two legs that touch the gate. The r3 recon residuals go to build 1b.

## Choices the build chat made (each Preston's to overrule)

- **C1** A failed read is retried on 'online', on returning to the front, and on a timer of
  5 s, 15 s, 45 s, then every 120 s.
- **C2** A record this device created or changed while its read was failing wins over the
  cloud's copy of the same record, even if another device changed it meanwhile. Every record
  this device did not touch takes the cloud's.
- **C3** For arcs, sub-theories, lenses, artifacts and notes, a record changed here while
  failing is kept even if another device deleted it meanwhile (the reader's words are never the
  ones dropped). A book deleted elsewhere stays deleted, and a local edit to it is dropped with
  it.
- **C4** The notebook gets the delete half (FX-1c) as well as the add half (FX-1b), so a note
  deleted with no signal is not copied back from a stale cloud copy.
- **C5** A note kept as pending, and a delete the cloud still lists, are pushed at the load
  that finds them.
- **C6** Delete account will not start while any of the six loads is in flight or failing.
  The reader sees the existing line, with only the bracketed words new: "Nothing was deleted.
  Praxis could not reach your data to remove it (your library has not finished loading on
  this device). Your account is untouched — try again in a moment."
- **C7** The notice is the app's existing toast (2.6 s), said once per sign-in, at the first
  failed read.
- **C8** "Changed" is a comparison of each record's print with its print taken when the
  reader's state was loaded (at start-up, or at sign-in on this page), held in memory until
  that kind's load succeeds. A book's print is the repo's eleven authored fields (those
  mergeBookFingerprint names); a lens's is everything but its look; the other kinds' is the
  whole record. A change to a book that touches only OTHER fields is not the reader's as far
  as this build can tell (L11).
- **C9** For these six loads, an answer that arrives after a sign-out, or for an earlier
  sign-in, is dropped. Profile, reader model and lens offers are as they were.
- **C10** A load whose FIRST answer is found or absent merges exactly as before, with nothing
  put back (L10).
- **C11** A live arc's public copy is neither refreshed nor removed by a save made before BOTH
  the arcs read and the sub-theories read have succeeded. The refresh is owed, and is made at
  the first save of any kind after both have — in practice the save the sub-theories load itself
  makes (L5 says what is left).
- **C12** C3 holds even when the record's PARENT was deleted on the other device. A sub-theory
  edited here while failing is kept with its arcId still naming the deleted arc; the Arcs page
  lists it under Unrooted. An artifact edited here is kept with its bookId naming a deleted
  book; its page says "Book not found." Neither is repaired by this build (L12).

## Known limits — open after this build, by design

- **L1** An EDIT to an already-synced record, made while the read is failing, still reverts if
  the app is closed before a retry succeeds (audit BR-03; build 1b). Measured as rig scenario
  S13.
- **L2** Two devices still overwrite each other: a device that loaded earlier writes its whole
  copy (audit BR-04; build 1b).
- **L3** Profile and reader model keep their F-DL3 latches, which still open on an errored
  read (audit BR-29; build 1b).
- **L4** mergeBookDuplicates still re-keys an artifact without markPendingSync, and deletes
  the dropped key without noteRecordDeleted (the other half of FX-1b).
- **L5** Closed in r3 as r2 named it, and D closed in r4. What is left: a refresh still owed
  when the app is closed, or in a session whose sub-theories read never succeeds, is not made;
  the next arcs save after a full load makes it. The reader is not told that a public copy is
  behind.
- **L6** A pending arc, sub-theory, lens, artifact or book that survives a load is still not
  pushed until its collection next changes (the notebook now is: C5). The lens offers' own
  latch still has no retry.
- **L7** The 2.6-second toast is easy to miss. A lasting "not synced yet" mark belongs to
  build 1b.
- **L8** A read that keeps failing holds that collection's writes, and holds Delete account on
  that device (C6), until a read succeeds. Reopening the app starts the reads again; it does
  not end a failure that lasts (a rules error, say). C6's line ends "try again in a moment":
  those are the existing line's words, advice and not a promise.
- **L9** Automatic writes. r3 takes out the three the r2 Stage 0 named: a book is compared on
  its eleven authored fields only, a lens without its look, and the arc unpublish flag can no
  longer be written while a latch is shut (C11). An automatic write to any OTHER compared field
  would still count as the reader's change on a load that failed and was retried. One is known:
  isbn is one of the eleven and has catalogue backfill write sites.
- **L10** An edit made before the FIRST answer of a load that then succeeds is overwritten by
  the cloud copy, exactly as before this build (C10).
- **L11** The other side of C8: a change to a book made while a read is failing that touches
  ONLY fields outside the eleven does not count as changed; on the retried load that book takes
  the cloud's copy. The reader actions that write only such fields (the r3 Stage 0 list): "Fix
  this book" when the title, author and ISBN already match, Resolve covers, re-scanning a book
  already on the shelf, and the book's evidence and attached notes. Goes to build 1b.
- **L12** C12's two leftovers: a kept sub-theory's arcId can name an arc that no longer exists
  (deleteArc sets it to null instead), and a kept artifact can outlive its book.
- **L13** (r3 recon B1) Lens fields filled in with defaults when a lens is drawn count as a
  change; that copy is stale, not wrong.
- **L14** (r3 recon B2) Clicking into a sub-theory's title box and out again stamps it as
  changed with nothing typed.
- **L15** (r3 recon R-F1) An old sub-theory with no owner id is not put back after a retried
  load.

## FINAL-PASS SUMMARY (FIX-PROTOCOL §5.5) — read this first

**The four things §3 demands, each with its evidence:**

1. **The failure, reproduced (BEFORE, 3ce6a7b).** The chat's rig, ported: 22 / 46 passed, 24 failed,
   then STOPPED in S11. S1: a laptop a week behind, reads failing, one edit and one added book —
   the cloud shelf went from 7 books to 4 and the phone's second note, its rewrite and its second
   arc were gone. S2: a new device whose shelf read failed, then one added book — that one book
   became the whole cloud shelf. S3: a note written with no signal and the app closed was gone at
   the next open (BR-02). Coverage: the journal composer's offline entry lost (X1); an undone
   capture brought back (X3).
2. **The fix, shown (AFTER, the staged build).** 99 / 99, two counted runs plus a trial run; 0 page
   errors. The same S1 now leaves the cloud shelf at the phone's 7 plus the laptop's 1, every edit
   on both sides kept; S2's cloud shelf is untouched while failing, then 9; S3's note is kept and
   pushed. Coverage 20 / 20 (both composers and capture's Undo through their own controls, a lens
   and an artifact created while failing, an account switch, the 15 s and 45 s steps, the real sort
   and lens render).
3. **The control.** S0 (the normal path: books, a note, an arc reach the cloud, every latch open, no
   notice, prints agree), S5 (a delete on a device that has just re-read still lands elsewhere), S16
   (Delete account on a loaded device: the failed-login recovery re-uploads, the real deletion
   leaves no document) — all PASS on AFTER. The eleven suites at count on both trees (export 58,
   delete 58 — the covenant and the delete order unchanged).
4. **No new silent-loss path, branch by branch.**
   - found (first answer): merges exactly as 3ce6a7b (C10; L10 names the edit it overwrites, as before).
   - absent: the local copy is kept and pushed (S6, X4).
   - error: no whole-document write leaves while failing (S1, S2, S6, S11); the notice once (S7).
   - error-then-found: the reader's changes put back and pushed — made before the sign-in event (S20),
     before the first answer (S15, S23), between failures (S1, S14, S19), across a second sign-in (S18);
     machine writes do not count (S19, X7).
   - error-then-absent: pushed (S6).
   - error-then-sign-out: nothing read or written after (S8); a switch writes nothing of one account
     under the other (X5).
   Every mechanism, taken out alone, is caught (M1–M11). The red-team found no new path; its four
   residuals (G3–G6) are each no worse than 3ce6a7b except G5 (stated below).

```
FINAL-PASS — FB-1a (r4) @ 3ce6a7b → CACHE_VERSION praxis-v3.340
FILES: js/integrations.js js/state.js js/views.js js/app.js sw.js tools/fx1c-sim
       (+ docs/checkpoints/fb-1a.md, docs/checkpoints/fb-1a-shots/**, BOARD.md, docs/studio/sequence.md,
          docs/launch-runway.md, docs/Checklist and Roadmap/BUILD_STATE.md, docs/studio/builder.html)
PROOF 1 clobber-prevented: before cloud shelf 7→4, notes/arc lost / after 7+1, all kept     PASS
PROOF 2 no-stranding:      found = as before (C10) / absent pushed (S6) / error held+retried (S1,S7,S12)  PASS
PROOF 3 control:           S0, S5, S16 + 11 suites at count (export 58, delete 58)           PASS
PROOF 4 notes (BR-02):     before offline note gone / after kept+pushed (S3, X1, X2); deletes held (S4, X3)  PASS
LEGS: M1–M11 each caught, alone, on the final bytes                                         PASS
BYTES: integrations.js 239,860 (+18,082) · state.js 222,265 (+2,091) · views.js 1,425,621 (+1,198)
       · app.js 6,285 (+505) · fx1c-sim 16,804 (+488) · sw.js 6,894 (+0, v3.339→v3.340) — all = the brief's md5s
PARSE: parse-check PARSE OK on 19 js + sw.js · ES3 tokens in added lines 0 · eol i/lf w/crlf
FOUNDATIONS md5: lumen-amber 631bc2aa… ok · marks 772886c0… ok · hand.js dc6a021e… ok
SPEED (CPU 4x, 150 books): fb1aBegin all six median 0.8 ms / max 3.5 · fb1aChanged all six 0.8 / 1.7
git show --stat preview: the 6 code files + the docs above (no audit path; the audit commit parked, unpushed)
RED-TEAM (§9): recon gate r4 clean (G1, G2) · staged build CLEAN, no blocks-commit (G3–G6, nits)
REVIEWER: praxis-reviewer PASS-WITH-NOTES (code exact; four doc notes acted on — 3.2)
RESIDUALS: L1–L15 (the brief's known limits) · G1–G6 (the gates') · persistence of signed-in
           writes on the real Firebase unverified — the rig is a fake cloud; AFTER THE PUSH A–E
```

**After the push (23 Nov 2026):** committed `42201f4`, pushed, deployed (Netlify, ready). Preston's
live smoke on a throwaway account, a real phone and a desktop: **A and B PASSED** (B: both devices
ended with everything; the notice appeared once); C, D and E not run, by his choice. See "The
commit, the push and the live smoke" below.

**What a human should weigh before the words.** G5: for as long as a device's sub-theories read
keeps failing, a live arc edited there keeps its old public copy (3ce6a7b would have republished
it at once, with R-B's risk of unpublishing it); the reader is not told. G4: a read that never
answers at all (no error, no answer) holds that collection and Delete account for the session.
Neither is a lost record; both are build 1b's.

## Stage 0 on r4 — pre-flight, read-only on code and git state, 23 Nov 2026

Nothing but this file was written. No code, no index, no branch moved; the live index was
untouched throughout (tracked status 0 before and after). Line numbers in this section are the
r4 PATCHED files.

**What was carried and what was done again.** Carried by reference (inputs unchanged): 0.2, 0.3
(origin/main did not move), and 0.7 a–f, h–l, n–r and t (the r3 answers, kept below under the
third cut's Stage 0, and the earlier cuts' further down). Done again: 0.1, 0.4, 0.5, 0.6, and 0.7
g, m and s, plus the r3-to-r4 diff that bounds the carry.

### 0.1 The state of main — done again

HEAD was the one local audit commit (docs only, held by R1); origin/main `3ce6a7b` (re-checked against the remote with `git ls-remote`:
unmoved). `git log origin/main..HEAD` is exactly that one commit, every path under the audit's own
folder (0 outside). CACHE_VERSION at origin/main `praxis-v3.339` (sw.js:12). Tracked tree
clean (0). Hook gate ARMED (`core.hooksPath = hooks`, FIX-PROTOCOL v1.3, seven agents). No parking branch
yet — step 1.1 not done.

### 0.2 Protocol documents — carried forward

Unchanged (same last commits as at every earlier Stage 0). Found: CLAUDE.md, PROTOCOL.md,
docs/FIX-PROTOCOL.md (v1.3), CRAFT.md, and in .claude/agents/: fix-implementer.md,
fix-red-team.md, praxis-recon.md, praxis-reviewer.md, repo-mapper.md, studio-mockup.md,
studio-scan.md. **Missing: none.**

### 0.3 The before-numbers — carried forward

origin/main has not moved; the r3 Stage 0 re-measured all eighteen (MATCH).

### 0.4 The r4 patch and rig, extracted — done again

The prompt file reached disk LF-only (0 CR in 157,076 B), so nothing was dropped.

- patch: **822 lines · 46,178 B · md5 `f04038fa1e345fd2de60873d5e8b1edd`** · 0 CR · 0 tabs ·
  no BOM (starts `diff`) · ends with one LF · 42 hunks in 6 files · 6 non-ASCII (’ ×3, — ×2,
  § ×1) · 14 single-space context lines — **MATCH** on every count.
- rig: **625 lines · 51,648 B · md5 `7a4e1c14b50ee1a97c758b0484293036`** · 0 CR — **MATCH**.

### 0.5 Apply check — done again (scratch index, never the working tree, never stash)

`GIT_INDEX_FILE=<scratch> git read-tree origin/main` → `git apply --cached --check` **OK** →
applied → staged blobs, every one CR=0:

| file | bytes | md5 | numstat | |
|---|---|---|---|---|
| js/integrations.js | 239,860 | `c71774b168d4dc7791ad01b6bde4597f` | 381 30 | MATCH |
| js/state.js | 222,265 | `c8fbc04b553dda87cba864ad9cb42541` | 30 2 | MATCH |
| js/views.js | 1,425,621 | `8e5524b4062ed617821693fdc24844e5` | 7 3 | MATCH |
| js/app.js | 6,285 | `50c2b4ce148ea23199371f5bfabc7f8a` | 7 0 | MATCH |
| sw.js | 6,894 | `3ebc481175483a92461eeab363f313b7` | 1 1 | MATCH |
| tools/fx1c-sim | 16,804 | `326a74e1b54d579f2feaf56da0a1d685` | 6 3 | MATCH |

**r3 → r4** (`git diff --no-index --numstat` of the r3 scratch tree against the r4 one):
js/integrations.js **3 3**, js/state.js **21 4**; js/views.js, js/app.js, sw.js and tools/fx1c-sim
byte-identical (cmp). The integrations.js hunks are the fb1aPrint comment (two lines: the true
reason for repeating the eleven fields, no rig named) and the sign-in call's trailing comment (no
longer "no-op"). The state.js hunks are `fb1aRepublishOwed` (1277) and the gate and its debt
(3659–3688). So every r3 answer that rests on anything else stands.

### 0.6 Reservations — done again

v3.340 not reserved (`git log --all -S praxis-v3.340` empty). docs/checkpoints/fb-1a-shots/ does
not exist. This file exists untracked and nothing else of FB-1a does. No parking branch yet.

### 0.7 The code read

**g) Ordering dependencies** (FIX-PROTOCOL #10; the commit message repeats them):
1. Start-up: js/app.js `loadState()` (29) → `fb1aBegin(getCurrentUser().uid)` (34–36) →
   `saveState()` (37) → the first render. Inside the DOMContentLoaded handler (app.js 11).
2. Sign-in: account-switch `clearUserState()` (integrations.js 435) → `loadState()` (443) →
   `fb1aBegin(u.uid)` (444) → the invite check, the first asynchronous step; the six loads start
   only inside `l3Verdict`.
3. `fb1aReapply` AFTER each merge and BEFORE that branch's saveState: books 517, arcs 610,
   sub-theories 688, lenses 776, artifacts 855, notes 983 (the notebook splat 909–982 before it).
4. In the notebook branch the dirty mark comes before saveState.
5. A note is marked pending BEFORE the saveState that could push it: views.js 3616, 3956, 19022.
6. `noteRecordDeleted` BEFORE the record is deleted: state.js 2522; views.js 26445, 26678, 26685,
   26713.
7. deleteAccount's guard (integrations.js 1735) BEFORE the re-auth (1743).
8. Load order (index.html 109, 121, 130, 132): js/state.js (`normalizeStatus` 463) → js/integrations.js
   (`fb1aPrint` 182, `fb1aBegin` 217) → js/views.js → js/app.js (the start-up call).
9. **New in r4 — the owed republish:** paid in the block straight AFTER saveState's arcs block
   (state.js 3683–3688, after the arcs block 3629–3679) of the same saveState, only when
   `arcsLoaded` and `subTheoriesLoaded` are both true. The sub-theories load opens its latch at
   its callback's first line (integrations.js 645) and calls saveState only after its merge and
   `fb1aReapply` (found: 688 → 701; absent: 722); no saveState runs between 645 and 701. The
   error branch (725) keeps the latch shut, so it cannot pay.

**m) The byte numbers — exact.** js/integrations.js +381 / −30 lines, net **+18,082 B**. Of the
381 added lines: **106 whole-line comments, 17 blank, 258 code**; added-line bytes 20,219 (with
LF): comment lines 8,003, blank 17, code 12,199; removed-line bytes 2,137. (Against r3: comment
lines −12 B, and the sign-in call's line — code with a trailing comment — +19 B.) js/state.js
+30 / −2 (15 comment, 15 code), net +2,091; added-line bytes 2,206, removed 115. js/views.js +7 /
−3, net +1,198. js/app.js +7 / −0, net +505. sw.js +1 / −1. tools/fx1c-sim +6 / −3, net +488.
In the ADDED lines of the four js files and tools/fx1c-sim, `const `, `let `, `=>`, `class ` and
the backtick each count 0, comments included.

**s) The republish gate and its debt (D).**
- **Callers of `republishLiveArcs`** (every js file and tools/): two, both in saveState —
  state.js 3672 (in the arcs block, gate open) and 3687 (the debt). Defined at integrations.js
  4274.
- **Set** (3674): when saveState's arcs block runs (`arcsDirty`, a current reader, the arcs saver
  present) and the gate is shut — the arcs or the sub-theories latch is not open. **Cleared**: at
  3671 when the gate lets the call through, and at 3686 when the debt is paid. **Paid**: at
  3683–3688, in ANY saveState (not only an arcs save) once both latches are true, for
  `getCurrentUser().uid`.
- **Settle order 1 (normal):** the arcs load answers found → its saveState (arcs latch open,
  sub-theories shut): if arcs were dirty, the gate skips and sets the debt; the nested
  sub-theories load answers found (701) or absent (722) → that saveState pays. **Order 2 (S10:
  arcs failing, sub-theories loaded):** the sub-theories branch's saveState finds the arcs latch
  shut — no pay; the arcs retry answers found → its saveState runs the arcs block with both
  latches open (call made, debt cleared), or, if arcs are not dirty, the debt block pays.
- **Twice in one saveState: no.** The gate's open condition clears the flag before the debt block
  reads it; the debt block needs the same two latches true, so if the gate was shut it is still
  shut. **On half a library: no** — both latches open only after this sign-in's arcs and
  sub-theories loads answered found or absent (`resetSyncLatches` shuts them at sign-out and at a
  switch), and in the found branches after `fb1aReapply`.
- **Sign-out and switch:** the flag lives in state.js and is not reset by `resetSyncLatches`. A
  debt left by reader A is paid for whoever is the current reader once both of THEIR loads have
  succeeded — for A again after a sign-out and sign-in (the debt is kept, which is right), or for
  B after a switch. `republishLiveArcs(B)` touches only B's own live arcs, projected from B's
  fully loaded state: an extra refresh of B's public copies (a new `revisedAt`), which the next
  arc save of B's would make anyway. A's debt is then lost until A's next arcs save after a full
  load (L5's family). While signed out both latches are shut, so the debt block never runs.
- **App closed:** the flag is in memory only; the debt is not made until the next arcs save after
  a full load (L5).
- **Harnesses that load state.js alone:** `arcsLoaded` / `subTheoriesLoaded` are undeclared
  there, so the gate takes `typeof … === 'undefined'` (call made, flag cleared) and the debt
  block's `typeof … !== 'undefined'` is false — exactly 3ce6a7b's behaviour.

### The recon gate on r4 (fix-red-team, Sonnet, 23 Nov 2026)

Run under Preston's lift, on the r3-to-r4 difference and on 0.7 s, against the frozen r4 scratch
copy; no checkout and no write. **No blocks-commit finding. Two residuals, two nits.**

- **The delta is exactly as described**: integrations.js comments only (178–179, 444); state.js
  1277 and 3659–3688; the other four files byte-identical to r3. Every changed comment is true.
- **The debt** (0.7 s confirmed): two callers (state.js 3672, 3687); set only at 3674; cleared
  only just before a call (3671) or at the pay (3686). Paid in both settle orders; never on one
  load alone; at most one call per saveState; the merge and `fb1aReapply` always precede the save
  that pays. Never stale for longer than on 3ce6a7b, and never built from partial sub-theories.
- **Residual G1 — the debt is per tab session.** `resetSyncLatches` and `fb1aReset` do not clear
  it, so after a switch it is paid for the next reader's own live arcs (`republishLiveArcs` filters
  on `arc.userId === uid`; it cannot touch another reader's arcs): one extra refresh of B's public
  copies, which can also unpublish one of B's live arcs whose fully loaded projection is empty —
  exactly what any republish of B's would do. A's debt is then lost until A's next arcs save after
  a full load (L5's family; closing the app is the same). The red-team's optional cleaner shape,
  for the build chat: keep the uid with the debt.
- **Residual G2 — harnesses.** The state.js-only harnesses take both `typeof` branches exactly as
  3ce6a7b; the debt block is inert there. tools/delete-test and tools/export-test load state.js
  with integrations.js, so their latches are defined; a harness that saved with latches shut and
  then opened them would now make one republish call on its next save. Nothing in the repo runs
  that path as far as read; Stage 2 runs both for their 58.
- **Nit — the no-reader pay.** With both latches true and no current reader, 3686–3687 clears the
  flag without paying. Every `clearUserState` path read (integrations.js 435, 1168, 1218, 1222,
  1910) also shuts the latches, so it appears unreachable.
- **Nit — wording.** The comment at state.js 1277 ("paid at the first save after both have")
  means both loads have succeeded.

**Recon-gate outcome:** clean of blocks-commit. Stage 1 waits only on Preston's go-ahead.


## Stage 1 — park the audit, then apply (23 Nov 2026)

- **1.1** the audit commit parked on its own local branch (`git branch`), then `git reset --keep origin/main`. After: HEAD
  `3ce6a7b` == origin/main; the parking branch holds the audit commit; tracked tree clean (0);
  untracked files 114 before and 114 after (the agent-memory notes untouched). The audit's files
  left the working tree with the reset, as expected; nothing of them is in this round's commit.
- **1.2** `git apply --cached <scratch patch>` (md5 `f04038fa…`), then `git checkout --` the six
  files out of the index. No edit by hand.
- **1.3** Staged blobs (`git cat-file -p :<path>`), all **MATCH**: js/integrations.js 239,860
  `c71774b1…` (381 30), js/state.js 222,265 `c8fbc04b…` (30 2), js/views.js 1,425,621 `8e5524b4…`
  (7 3), js/app.js 6,285 `50c2b4ce…` (7 0), sw.js 6,894 `3ebc4811…` (1 1), tools/fx1c-sim 16,804
  `326a74e1…` (6 3).
- **1.4** `tools/parse-check`: PARSE OK on all 19 js files and sw.js. Added lines of the staged diff:
  `const `, `let `, `=>`, `class `, backtick — **0**. `git ls-files --eol`: all six `i/lf w/crlf`.
  The twelve unchanged files at their numbers (bytes, md5, and `git diff HEAD` clean).

## Stage 2 — prove it (23 Nov 2026)

Every BEFORE reading is from a `git archive origin/main` copy of 3ce6a7b (CRLF on extraction; with
the CRs dropped its blobs are the before-md5s). Every AFTER reading is from the repo root, i.e. the
staged build checked out. Same rig, same steps.

### 2.1 The suites — all at count, on both trees

| suite | BEFORE | AFTER |
|---|---|---|
| lens-eval (`tools/lens-eval-test/run.js`) | 68/68 | 68/68 |
| lens-data (`tools/lens-data-test/run.js`) | 101/101 | 101/101 |
| export-test | 58/58 | 58/58 |
| delete-test | 58/58 | 58/58 |
| ceiling-core-test | 36/36 | 36/36 |
| fx1c-sim | 60/60 | **72/72** |
| L4b-1 hotfix unit | 46/46 | 46/46 |
| L4b-2a unit | 71/71 | 71/71 |
| L4b-2a hotfix 1 unit | 74/74 | 74/74 |
| L4b-2b unit | 120/120 | 120/120 |
| L4b-2b hotfix 1 unit | 74/74 | 74/74 |

`fx1c-sim unguarded`: BEFORE 56/60 (the four C1 cases); AFTER **67/72, exactly five failures** — C1
of arcs, subTheories, themes, artifacts and notebook (plus the harness's own "expected to FAIL"
self-check line, which is not counted). Each total read from the suite's own printed line. The two
lens suites are folders: they run as `cscript //nologo //E:jscript tools/<suite>/run.js` (the bare
folder path answers "Access is denied", which is cscript refusing a directory, not a failure).

### 2.2 The behaviour — the chat's rig, ported (driver named)

**Driver: a port of fb1a_rig.py to a page rig** (Python is not on this machine; nothing was
installed). Files: `docs/checkpoints/fb-1a-shots/rig/` — `driver.html` + `driver.js` (the
Cloud, Device, check() and all 25 scenarios S0–S24, line for line, in the file's own order),
`fake-firebase.js` / `helpers.js` / `helpers-guard.js` (**lifted byte for byte** from the chat's
file by marker extraction), `bridge.js` (stands in for Playwright's expose_function, evaluate and
pageerror; makes service-worker registration a promise that never settles, as
`service_workers='block'` did), `serve-fb1a.ps1` (PowerShell HttpListener: serves the tree on
localhost 8801–8806, one port per device so each device is its own origin with its own
localStorage; answers the vendored Firebase scripts with the fake; blocks every other host with a
Content-Security-Policy of `'self'`; inserts the two rig scripts straight after `<head>` in
index.html only), `run-fb1a.ps1` (one run: the installed Chrome, headless, a fresh profile per
run). The chat's own rig file is kept beside them: `fb1a_rig.py` (md5 `7a4e1c14…`). Outputs:
`runs/` and `legs/`.
The port keeps the three abilities the brief binds: a slow failing read (the fake's `delay`, 4 s in
S15 and S23), the sign-in event held back (the fake's `rig_auth_delay`, 3 s in S20, the cached
reader already in praxis_user), and the app's own writes made by statement (S19); the REAL sort and
lens render were also driven (X7 below). One difference from Playwright, stated: a device's page is
an iframe inside the driver page, not a top-level tab; devices are on one site (localhost), so
nothing is storage-partitioned between them.

| run | reading |
|---|---|
| AFTER, trial run of the port | **99 / 99** passed |
| AFTER run 1 | **99 / 99** passed, 0 page errors |
| AFTER run 2 | **99 / 99** passed, 0 page errors |
| BEFORE (3ce6a7b) | **22 / 46 passed, 24 failed, then STOPPED in [S11]** — the chat's reading exactly |

BEFORE's 24 failures are S1 ×8, S2 ×3, S3 ×4, S4, S6, S7 ×2, S8, S9 ×2, S10 ×2; it stops in S11
because S9's Delete account ran while the reads were failing and removed the account. The notice
the AFTER runs read, once per failed load (S7): "Can’t reach your library right now. New notes and
books are kept on this device." (R3, exact). S22's readings: the kept sub-theory's arcId still
names the deleted arc and the kept artifact's bookId names the deleted book (C12); ten rooms open
with zero page errors, each draws something; the kept words are on screen in the sub-theory page,
its workshop and the Arcs page (under Unrooted).

### 2.3 Mechanism-removed legs — every leg on the final bytes

Each leg is the staged build (`git archive $(git write-tree)`, the live index untouched) with ONE
mechanism removed by one `sed` (diff-checked: M1 removes the six `fb1aReapply` lines, M6 and M9 one
line each, every other leg changes one line), run alone.

| leg | removed | reading | the chat's |
|---|---|---|---|
| M1 | the six fb1aReapply calls | 83/92, fails S1 (status edit, arc rename), S14, S15 ×2, S18, S19 (reader's own), S20, S24; STOPPED in S22 | same, plus S24 (a scenario newer than the chat's M1 reading) |
| M2 | booksLoaded opened on error | 36/47, fails S1, S2, S6, S7, S8; STOPPED in S11 | same |
| M3 | the notebook's pending keep | 92/99, fails S3, S11, S13; fx1c-sim notebook C5 fails (71/72) | same, **except** no page error (the chat saw one it did not trace) |
| M4 | the notebook's delete skip | 96/99, fails S4; fx1c-sim notebook C1 fails (71/72) | same |
| M5 | deleteAccount's guard | 43/47, fails S9, S10; STOPPED in S11 | same |
| M6 | the sign-in fb1aBegin | 98/99, fails S23 | same |
| M7 | `failed = !!fb1aTries[kind]` → false | 98/99, fails S18 | same |
| M8 | fb1aPrint → whole record | 94/99, fails S0's print check and S19 | same |
| M9 | the start-up fb1aBegin (js/app.js) | 98/99, fails S20 | same |
| M10 | the republish gate always true | 94/99, fails S21 (the public copy deleted), and S24 after it | same |
| M11 | the owed republish never paid | 96/99, fails S21's last check and both of S24's | same |

### 2.4 What the chat's rig did not exercise — the executor's coverage (`?mode=extra`)

The executor's own scenarios X0–X7 (`driver.js`, `extras()`), AFTER **20 / 20**, BEFORE 11/16 then
STOPPED in X6 (`runs/extras-*.txt`):
- **X1 the journal composer**, through `openJournalEditor` and its own Save button, offline, the app
  closed: AFTER kept (pending) and pushed at the next open. BEFORE: lost (BR-02).
- **X2 the marginalia composer**, typed into its canvas and autosaved while every read fails, the
  app closed before recovery: AFTER kept (pending) and pushed. BEFORE: not pending (it reached the
  cloud only because 3ce6a7b's latch had opened on the error — BR-01's shape).
- **X3 capture's Undo**, through the toast's own Undo control, offline, the app closed, the cloud
  still listing the note: AFTER the undone note does not come back and the delete reaches the cloud.
  BEFORE: it comes back. (A test fault of the executor's own was found and fixed here first: the
  rig read the new id from `nbJustSavedId`, which the Notebook's re-render clears — views.js 20082;
  it now diffs the note keys, as X1 does.)
- **X4 a lens and an artifact CREATED while failing**: not written while failing, both pushed after
  the retry. BEFORE: written while failing.
- **X5 an account switch while a load fails**, then a cached reader whose sign-in event brings the
  other account: AFTER and BEFORE alike — the first account's documents untouched, nothing written
  under the other, the event's account's edit pushed to its own document.
- **X6 the 15 s and 45 s timer steps**: reads failing for 25 s from the first failure, no event; the
  latch opened at **65 s** (retries due at 5, 20 and 65 s). BEFORE has no retry or notice (STOPPED).
- **X7 the REAL shelf sort and the REAL lens render** on a device that is behind, reads failing,
  their network blocked: the real sort stamped all 6 unsorted books 'Uncategorized' and the real
  `#lenses` render gave the lens its look; the other device's two status changes and lens rename
  still reached the cloud and the device.
- **Still unproven by any rig here:** the 120 s timer step; the real cover backfill writing by itself
  (made by statement in S19 only); the real Firebase library — how long a read takes to fail
  offline and that a write queued offline is sent when the connection returns (AFTER THE PUSH, A–E).

### 2.5 Speed — CPU 4x, 150 books

`rig/speed-fb1a.ps1` (DevTools protocol, `Emulation.setCPUThrottlingRate` 4): a cached reader with
150 books, 60 notes, 10 arcs, 30 sub-theories, 10 lenses and 20 artifacts, seeded through the rig's
helpers and reloaded. Measured in the page, 20 calls each (`runs/speed-4x.txt`):
**fb1aBegin, all six kinds: median 0.8 ms, max 3.5 ms. One fb1aChanged pass, all six kinds: median
0.8 ms, max 1.7 ms** (books alone 0.4 / 0.9 ms). Far under the 50 ms line. Caveat, stated: the
start-up call itself runs during page load; this times the same function called after load, so a
cold-JIT first call can be a little slower (the first of the 20 read 0.4 ms).

## Stage 3 — the gates (23 Nov 2026)

### 3.1 fix-red-team on the staged build (Sonnet, data-loss depth)

**CLEAN — no blocks-commit.** It re-derived every staged blob, the 258 / 106 / 17 split, the ES3
counts (0), parse, fx1c-sim 72 and 5 unguarded, export 58 and delete 58. Held: C2/C3 never worse per
record than 3ce6a7b's whole-document push (the one strictly worse case, a book's value-mark edited
here on a book deleted elsewhere, is C3 as ruled; L1 is the other); fb1aPrint equals
mergeBookFingerprint for every ensureBookFields shape; the republish debt cannot be paid twice or on
half a library; no base for the wrong uid; a sign-out or switch stops every retry; no unguarded
reader of a kept orphan found. Residuals it asks to record:
- **G3** (with L15) A sub-theories load that succeeds while the arcs read is still failing cannot
  backfill a legacy sub-theory's missing owner id, and the next sub-theories write drops such a
  record from the cloud (as at 3ce6a7b).
- **G4** A read whose callback never fires at all is never asked again (the in-flight mark blocks the
  retry): that latch stays shut and Delete account stays held for the session. A watchdog is build 1b.
- **G5** (L5's wording widened) For as long as the sub-theories read keeps failing, a live arc's
  public copy stays as it was, even on a device that holds the sub-theories; 3ce6a7b republished at
  the edit. The reader is not told.
- **G6** (L9's family) The cascades of a delete (deleteBook, deleteEntry's evidence scrub, deleteArc's
  re-homing) rewrite other arcs, sub-theories and lenses; on a retried load those records win whole.
- Nits: the debt flag is not per-uid (G1); the eleven-field list is checked only by the rig (S0, S19),
  not by a repo harness; fb1aPrint's catch returns '' (a record that cannot be stringified would
  never count as changed); a second same-uid sign-in event whose invite check does not answer 'ok'
  leaves the older retries registered.

### 3.2 praxis-reviewer (Sonnet, 23 Nov 2026)

**PASS-WITH-NOTES — the code exact, no blocker.** Measured on its own: the six staged blobs (bytes,
md5, numstat) and the twelve unchanged files match; only the six code files staged; `git diff
--cached --check` clean; 0 ES3 tokens in 426 added lines; PARSE OK; CACHE_VERSION praxis-v3.340;
`i/lf w/crlf`. Re-ran fx1c-sim 72/72, unguarded 67/72 with exactly the five C1 failures, export
58/58, delete 58/58. The checkpoint holds every section 3.3 asks for and its numbers match the run
files (AFTER 99/99 ×3, BEFORE 22/46 STOPPED in S11, the legs line for line, extras 20/20 and 11/16,
speed); it cut the three blocks out of fb1a_rig.py itself and found rig/fake-firebase.js,
rig/helpers.js and rig/helpers-guard.js byte-identical. Ledgers PASS. Its four notes, and what was
done with each:
1. BUILD_STATE's stamp line still carried "local until pushed" for L4b-3a.2, an "owed" phone check
   for L4b-3a.1 and a stale "Next lane"; and the edited sequence entry still said L4b-3a.1's check was
   owed. **Reconciled** in the same lines (facts from the brief: passed 21 Nov, all four steps; passed
   22 Nov at Night, six of six, Day not looked at; the next lane is R2's order).
2. This section pointed back at the summary — **this verdict is now here.**
3. Line 1's "FB-1a STARTED" — **kept**: it is FIX-PROTOCOL §1's write-test-first marker.
4. builder.html — regenerated by `tools/studio-build` after the ledgers were final, staged only once
   stable.
And a public-docs note: the published record named the parked audit's commit, its branch and its
path count, and R1's wording said the audit lists open holes. **Scrubbed**: the record now says only
that one local audit commit exists and is parked, unpushed, by R1. The audit's existence stays
named, because the brief's own BR-01 / BR-02 requires it.

## AFTER THE PUSH — the live smoke (Preston runs it, on a throwaway account)

The build machine cannot reach the live origin (re-measured before the push); this pass is
how the live check is discharged.

Set-up: a throwaway Google account that is on the invite list (the admin runbook says how one
is added). A desktop Chrome and a phone, both signed in to it, each opened once with a good
connection so both hold a copy and both have passed the invite-list check (a device that has
passed is admitted from its own stamp when the list cannot be read; one that has not sees the
"You're offline" card and loads nothing, so this step is not optional). First, on the
desktop: hard-refresh, DevTools → Application → Service Workers, confirm the cache name is
`praxis-v3.340` (accept "new version ready — Reload" if it shows).

- **A (BR-02).** Phone: airplane mode on. Capture a note. Swipe the app away. Airplane mode
  off. Open the app. PASS: the note is there. Then reload the desktop: the note is there too.
- **B (BR-01 and F1; F6 as far as a hand test can).** Phone: add a book, and mark a different
  book as read. Desktop: DevTools → Network → Offline; reload the page (the service worker
  serves it) and stay on the shelf. AT ONCE, before the notice appears, change the status of a
  book the phone did not touch (that is F1's window). F6's own trigger, a failed sort stamping
  books, cannot be forced by hand; rig scenario S19 is its proof. PASS so far: the old shelf
  shows, and the notice then appears once (the real library can take ten seconds or more to give
  up on a read) and reads "Can’t reach your library right now. New notes and books are kept on
  this device." Add one book. Network → Online and wait up to a minute (the first retry can
  fail while the library reconnects; the timer asks again). PASS: the desktop now shows the
  phone's book as well, and the book the phone marked read shows as read; reopen the phone: it
  shows the desktop's added book and the desktop's status change; nothing is missing from
  either.
- **C (L1, expected to FAIL until build 1b).** Desktop offline, edit an existing note's words,
  close the tab, go online, reopen: the edit is gone. Record it as the known limit, not as a
  regression.
- **D (C6).** Desktop offline, reload, open You, Settings, Delete account and confirm: the
  panel says nothing was deleted and that the library has not finished loading on this
  device. Go online; do NOT confirm a deletion again.
- **E (D).** Only if the throwaway account has an arc published live. Desktop offline, reload,
  rename that arc, go online, wait up to a minute. PASS: the arc's public page, opened in a
  private window, shows the new name.

Any step that does not read as written goes to the build chat with what was on screen.

## The commit, the push and the live smoke (23 Nov 2026)

- **Commit** `42201f4` on Preston's word "Commit": 40 files by explicit path (the six code files,
  this record, its 28 shots files, five ledgers); the pre-commit hook gate passed; the six code
  blobs in the commit are the brief's md5s.
- **Push** on Preston's word "Push": `3ce6a7b..42201f4`, `main` only. Before it, `git log
  origin/main..HEAD --name-only` listed that one commit and 0 paths under `docs/audit`. After it,
  HEAD == origin/main == `42201f4`; the remote holds only `main` (the parked audit stayed local).
- **Deploy.** The build machine cannot reach praxisreader.com or praxis-reading.netlify.app (curl
  and the browser pane both refused). Netlify's own record, read through its API: deploy
  `6b04a2eb…` built from `42201f4` on `main`, state ready, the site's current deploy, published
  23 Nov 2026 20:33 UTC, 40 files uploaded, its secret scan 0 matches. At that commit sw.js sets
  `praxis-v3.340`.
- **Live smoke, run by Preston on 23 Nov 2026 on a throwaway account, on a real phone and a
  desktop:**
  - **A (BR-02) — PASSED.**
  - **B (BR-01 and F1) — PASSED:** both devices ended with everything, and the notice appeared
    once.
  - **C, D and E — not run, by Preston's choice.** C (L1) is a known limit expected to fail until
    build 1b; D (C6) and E (D) stay proved by the rig only (S9, S17; S21, S24).
- What no rig and no live step here has shown stays as listed in 2.4 (the 120 s retry step; the
  real cover backfill writing by itself).

---

## The third cut's Stage 0 (r3, 23 Nov 2026) — what the recon gate changed

The r3 patch (794 lines) was extracted, checked and applied to a scratch index only; it was
never applied to the tree. Its numbers are discarded. Kept here as it was written. **js/state.js
line numbers in this section are r3's** (r4 adds one line at 1277 and sixteen after the arcs
block); js/integrations.js line numbers are the same in r3 and r4, which differ there only in
three comment lines. Where this section says L5 or C11 it means r3's wording.

Nothing but this file was written. No code, no index, no branch moved; the live index was
untouched throughout (tracked status 0 before and after). Line numbers in this section are the
r3 PATCHED files unless marked.

**What was carried and what was done again.** Carried by reference (inputs unchanged): 0.2, and
0.7 a, b, c, d, e, f, h, j, o, p, q (the r2 answers below, under the second cut's Stage 0, and the
first cut's at the end). js/views.js, sw.js and tools/fx1c-sim are byte-identical to r2, so every
answer resting only on them stands. Done again: 0.1, 0.3 (re-measured although origin/main did
not move), 0.4, 0.5, 0.6, and 0.7 g, i, k, l, m, n; new: 0.7 r, s, t.

### 0.1 The state of main — done again

HEAD was the one local audit commit (docs only, held by R1); origin/main `3ce6a7b` (re-checked against the remote with `git ls-remote`:
unmoved). `git log origin/main..HEAD` is exactly that one commit, every path under the audit's own
folder (0 paths outside it). CACHE_VERSION at origin/main `praxis-v3.339` (sw.js:12).
Tracked tree clean (0). Hook gate ARMED (`core.hooksPath = hooks`, FIX-PROTOCOL v1.3, seven
agents, `sh tools/ground-truth`). No parking branch yet — step 1.1 not done.

### 0.2 Protocol documents — carried forward

Unchanged since the first Stage 0 (same last commits). Found: CLAUDE.md, PROTOCOL.md,
docs/FIX-PROTOCOL.md (v1.3), CRAFT.md, and in .claude/agents/: fix-implementer.md,
fix-red-team.md, praxis-recon.md, praxis-reviewer.md, repo-mapper.md, studio-mockup.md,
studio-scan.md. **Missing: none.**

### 0.3 The before-numbers — re-measured: all MATCH

The six before-blobs (js/integrations.js 221,778 `2d86b859…`, js/state.js 220,174 `b8cdafb5…`,
js/views.js 1,424,423 `ac96f4c8…`, js/app.js 5,780 `76112a87…`, sw.js 6,894 `469402e2…`,
tools/fx1c-sim 16,316 `60ac4eb4…`) and the twelve unchanged files, each in bytes and md5.

### 0.4 The r3 patch and rig, extracted — done again

The prompt file reached disk LF-only (0 CR in 151,752 B), so nothing was dropped. Extracted by
marker lines (marker lines excluded) to a scratch folder outside the repo:

- patch: **794 lines · 44,746 B · md5 `9b77f20f8cadacb2d5a8fd907a2d4b83`** · 0 CR · 0 tabs ·
  no BOM (starts `diff`) · ends with one LF · 41 hunks in 6 files · 6 non-ASCII (’ ×3, — ×2,
  § ×1) · 13 single-space context lines — **MATCH** on every count.
- rig: **613 lines · 50,183 B · md5 `dd8ea95190dce07cabd4036ec4bf3ee9`** · 0 CR — **MATCH**.

### 0.5 Apply check — done again (scratch index, never the working tree, never stash)

`GIT_INDEX_FILE=<scratch> git read-tree origin/main` → `git apply --cached --check` **OK** →
applied → staged blobs, every one CR=0:

| file | bytes | md5 | numstat | |
|---|---|---|---|---|
| js/integrations.js | 239,853 | `d2ddb5ba9d4d10518db25a7b921930fb` | 381 30 | MATCH |
| js/state.js | 221,215 | `8c8ca4a6e8c91c9d0eb3d5ef1a8d4591` | 13 2 | MATCH |
| js/views.js | 1,425,621 | `8e5524b4062ed617821693fdc24844e5` | 7 3 | MATCH |
| js/app.js | 6,285 | `50c2b4ce148ea23199371f5bfabc7f8a` | 7 0 | MATCH |
| sw.js | 6,894 | `3ebc481175483a92461eeab363f313b7` | 1 1 | MATCH |
| tools/fx1c-sim | 16,804 | `326a74e1b54d579f2feaf56da0a1d685` | 6 3 | MATCH |

js/views.js, sw.js and tools/fx1c-sim are byte-identical (cmp) to r2's after-files. Against r2,
js/state.js differs only in the republish gate (one line out, eight in) and js/integrations.js in
94 lines (fb1aPrint for fb1aJson, the FB-1a header's point 2, three comments, the F5 comments).

### 0.6 Reservations — done again

v3.340 is not reserved (`git log --all -S praxis-v3.340` empty). docs/checkpoints/fb-1a-shots/
does not exist. This file exists untracked and nothing else of FB-1a does (0 tracked js, tool,
sw.js or index.html files at origin/main name `fb1a`/`FB1A_`). No parking branch yet.

### 0.7 The code read

**g) Ordering dependencies** (FIX-PROTOCOL #10; the commit message repeats them):
1. Start-up: js/app.js `loadState()` (29) → `fb1aBegin(getCurrentUser().uid)` (34–36) →
   `saveState()` (37) → the first render (`renderRoute`, later in the same handler). The call
   is inside the DOMContentLoaded handler (app.js 11), so every script has loaded.
2. Sign-in: account-switch `clearUserState()` (integrations.js 435) → `loadState()` (443) →
   `fb1aBegin(u.uid)` (444) → the invite check, the first asynchronous step; the six loads start
   only inside `l3Verdict`.
3. `fb1aReapply` AFTER each merge and BEFORE that branch's saveState: books 517, arcs 610,
   sub-theories 688, lenses 776, artifacts 855, notes 983 (the notebook splat 909–982 before it).
4. In the notebook branch the dirty mark comes before saveState (r2 g.3, unchanged code).
5. A note is marked pending BEFORE the saveState that could push it: views.js 3616, 3956, 19022
   (unchanged from r2).
6. `noteRecordDeleted` BEFORE the record is deleted: state.js 2521; views.js 26445, 26678,
   26685, 26713.
7. deleteAccount's guard (1735) BEFORE the re-auth (1743).
8. Load order (index.html 109, 121, 132): js/state.js (`normalizeStatus`, state.js 463) before
   js/integrations.js (`fb1aPrint` 182, `fb1aBegin` 217) before js/app.js (the start-up call).
   js/views.js (130) also loads before app.js.

**i) Automatic writes, measured from START-UP.**
- Inside `loadState` (`migrate`, the field backfills): before the base in both calls (app.js 29
  → 34; integrations.js 443 → 444). Confirmed.
- The three r2 named: the shelf sort's `category` stamp (views.js 6182) — `category` is outside
  the eleven: **out of the comparison**; `ensureLensLooks` (state.js 2928–2942) writes only
  `look`: **out of the comparison**; `republishLiveArcs`' `published = false` (integrations.js
  4295) — **behind the gate** (state.js 3666–3667, see s).
- Cover and metadata fills (fetchAndApplyCover / ByTitle views.js 6584 / 6616, the Fix and
  Resolve paths, scanEnrichExisting 10913–10917): coverUrl, coverCandidates, year, pageCount,
  publisher, description, genre — all outside the eleven.
- isbn (one of the eleven) is written at views.js 7443 (openShelfEditor — a book being added,
  new anyway), 7836 (processBulkLines — books being added), 9401 (mergeBookDuplicates — the
  reader's merge) and 9605 (reResolveCover, run from the reader's Resolve covers, 9728 / 10031).
  I found no isbn write that runs without a reader action on an existing book; L9's example is
  reachable only through Resolve covers.
- `sanitizeFrozenPublishedArcs` (integrations.js 717–718) writes `published = false` only after
  BOTH the arcs and sub-theories loads answered found, i.e. after both bases are gone.
- No other render-time writer of an arc, sub-theory, artifact or note field found in the
  dirty-marking sweep (every function that marks those kinds dirty was listed; all but the two
  above are reader handlers or load/save plumbing). The recon gate below re-ran this sweep.
- **None left that puts back something harmful**, on my read. (Gate verdict below.)

**k) Copy is a contract.**
- The notice (`FB1A_NOTICE`, integrations.js 337), unchanged since r2: true in every case this
  build leaves (r2 k, which rested on views.js and the pending sets, unchanged). L1 is about
  edits, which it does not promise; L8 keeps new notes and books on the device as long as it
  lasts; L10 never shows it.
- C6's bracket: true whenever shown (the guard fires only while a load is in flight or has a
  retry registered). The existing sentence's "could not reach your data" also covers a load
  merely in flight at a normal sign-in — the existing line's words, for Preston.
- L8 as now worded: true. "Reopening the app starts the reads again; it does not end a failure
  that lasts" — reopening runs the sign-in loads again (fresh sign-in number), and a read that
  keeps failing keeps its latch shut and the guard on.

**l) The named live-smoke artifact** is brought up to r3's words below (AFTER THE PUSH, step B).

**m) The byte numbers — exact.** js/integrations.js +381 / −30 lines, net **+18,075 B**. Of the
381 added lines: **106 whole-line comments, 17 blank, 258 code**; added-line bytes 20,212 (with
LF): comment lines 8,015, blank 17, code 12,180; removed-line bytes 2,137. js/state.js +13 / −2
(9 comment, 4 code), net +1,041. js/views.js +7 / −3, net +1,198 (unchanged from r2). js/app.js
+7 / −0 (4 comment, 3 code), net +505. sw.js +1 / −1. tools/fx1c-sim +6 / −3, net +488. In the
ADDED lines of the four js files and tools/fx1c-sim, `const `, `let `, `=>`, `class ` and the
backtick each count 0, comments included.

**n) F1 and F4.**
- **The base moments.** (1) Start-up, app.js 34–36, for a cached reader only, after `loadState`.
  `getCurrentUser()` (integrations.js 1228) and `stateKey()` (state.js 3509) both read
  `praxis_user`, so the base is taken for exactly the uid whose bucket was just loaded.
  (2) Sign-in, same uid: `fb1aBegin` keeps every kind that holds a base (217–223); a kind whose
  load already succeeded has none and gets a fresh one. (3) Sign-in, another uid (praxis_user
  names A, the event brings B): `clearUserState` (435) → `resetSyncLatches` → `fb1aReset`
  (412), then `loadState` reads B's bucket and `fb1aBegin(B)` takes B's base (`fb1aBaseUid !== uid`
  also resets). (4) Sign-out: the null branch calls `clearUserState` → `fb1aReset`; the next
  sign-in on the page takes a fresh base (S23). (5) The floor in `fb1aLoad` (361) runs only if a
  kind has no base at its first failure; not reached in normal flow. (6) A second sign-in event
  for the same uid: as (2).
- **An edit between start-up and the sign-in event** (all six kinds; the nested sub-theories load
  uses the same base): made after the start-up base, so NOT in it; saved to local storage by
  saveState (the latch gates only the cloud write); the sign-in `loadState` reads it back as
  record objects but `fb1aBegin` keeps the start-up base; on a failed-then-found load
  `fb1aChanged` (239) finds it, `fb1aReapply` puts it back and marks the kind dirty, and the
  branch's saveState pushes it. **F4 closed** for a cached reader.
- **An edit between the sign-in event and the first failed answer:** after the base (whichever
  call took it) → same path. **F1 stays closed.**
- **Left, for the record:** an edit made as cached reader A in the start-up moment, when the
  event then brings B — A's base is dropped, the edit stays in A's local bucket and counts as
  synced at A's next sign-in. 3ce6a7b also deferred and lost it (its latches were shut before
  the event). Not worse; L1's family.

**r) fb1aPrint against the repo.**
- The book print (integrations.js 184–191) is the same expression as `mergeBookFingerprint`
  (views.js 9218–9225), field for field and in the same order: title, author, isbn, the
  normalised status, finishedAt, rating, dateRead, categoryOverride, traditionOverride, movedMe,
  valueMarks — with the same defaults. The one difference is the `typeof normalizeStatus` guard,
  which never takes its fallback (state.js loads first); `normalizeStatus` never returns a falsy
  value. `mergeBookFingerprint(null)` returns 'null', which fb1aPrint never meets (fb1aOwned
  passes only existing records). Identical for every shape ensureBookFields allows.
- **Reader actions that write ONLY fields outside the eleven (L11):** "Fix this book" (views.js
  13173–13196) when the catalogue's title, author and isbn already match (it then changes only
  year, pageCount, publisher, description, coverUrl); Resolve covers (`reResolveCover`, 9586–9610:
  coverUrl, coverCandidates, year, pageCount, publisher, description — isbn only if blank);
  scanning a book already on the shelf (`scanEnrichExisting`, 10906–10917: genre, coverUrl,
  coverCandidates, and only blank fields). The ISBN field always writes isbn; the category
  picker writes categoryOverride (13300); status, rating, dateRead, movedMe and value-marks are
  in the eleven.
- **Lenses:** the app writes no lens field but `look` by itself (`ensureLensLooks` writes only
  `look`; `ensureThemeFields` runs inside loads and loadState). Every other lens write
  (state.js 2773–2806, 3083–3200) is a reader handler.

**s) The republish gate.** `republishLiveArcs` has one caller: saveState's arcs block (state.js
3666–3669). The block runs whenever `arcsDirty` is true; it clears `arcsDirty` first (3629–3630),
then `saveArcsToFirestore` (which, latch shut, re-marks dirty and returns), then the gated
republish. It now skips when the arcs latch is shut (every save of a failing session, R-B's
case) or the sub-theories latch is shut. **What next refreshes a live arc's public copy:** the
next saveState with `arcsDirty` true and both latches open. At the arcs-load branch's own
saveState the sub-theories latch is always still shut (that load is started inside the arcs
callback), so the arcs dirtied while failing are pushed there **and the owed republish is skipped
and not re-armed**; the sub-theories branch's saveState republishes only if arcs are dirty again.
So "the next arcs save after both have" is true, but that save comes from the reader's next
arc-dirtying action, which may not come this session: a live arc edited while failing can keep
its old public copy for the rest of the session and beyond. 3ce6a7b republished at the edit
(its latch opened on error), with R-B's risk. The harnesses that load state.js alone have no
`arcsLoaded`/`subTheoriesLoaded` (both declared in integrations.js), so `typeof … === 'undefined'`
takes the old branch there. (Recorded as R-C below.)

**t) C12 / L12 — the orphaned child.** Every reader of a sub-theory's `arcId` and of an
artifact's `bookId` was swept by the recon gate (below). S22 measures the rooms.

### Findings at r3 Stage 0 (no edit made; each is Preston's / the build chat's)

- **F4, F5, F6 / R-A, R-B: closed by r3** as read in the code (n, i, s; the F5 comments at
  integrations.js 1727–1734 and 1827–1831 now say what the guard checks and what it does not).
  Each is to be shown in Stage 2: S20 / M9 (F4), S19 / M8 (F6), S21 / M10 (R-B).
- **R-C (new; the recon gate rates it blocks-commit — see D below):** the republish gate DROPS the owed refresh rather than
  deferring it (s above). L5's wording is true but reads as if the refresh follows soon after the
  reads succeed. A live arc edited while failing keeps its old public copy until the reader next
  changes an arc. Not a data loss; a public copy that is stale (never deleted) for longer than
  3ce6a7b left it.
- **F7 (nit, comment):** fb1aPrint's comment says the field list is repeated "because this runs
  at start-up, before views.js has loaded". The start-up call runs inside DOMContentLoaded, after
  views.js. The repeat is still right for the sign-in call, which Firebase can deliver before
  every script has run; the stated reason is not quite the true one.

### The recon gate on r3 (fix-red-team, Sonnet, 23 Nov 2026)

Run under Preston's lift, against the frozen r3 scratch copy, from source; no checkout and no
write. **One blocks-commit finding (D); three residuals; two nits.** The executor re-read D, B1 and
B2 at their lines and agrees with each.

- **A. The start-up base — sound.** No wrong-uid, doubled or stale base found: the reset on a uid
  change (integrations.js 217–223), the delete on success (367), the reset through
  `clearUserState` on sign-out and switch (state.js 2265 → 412), and a no-op second call if the
  auth event ever came before DOMContentLoaded. An edit made before the sign-in event, or before
  the first answer, is found, put back and pushed for all six kinds, the nested sub-theories load
  included. **F4 closed; F1 stays closed.**
- **D (blocks-commit) — the owed live-arc republish is dropped, not deferred.** This is R-C above,
  rated higher. saveState clears `arcsDirty` before saving (state.js 3630); when the gate skips,
  nothing re-arms it. At the arcs-load branch's saveState the sub-theories latch is always still
  shut, so the gate always skips there; sub-theory edits never mark arcs dirty (`updateSubTheory`,
  state.js 2581–2590). Two consequences: in a HEALTHY session, an arc edit made while the arcs or
  sub-theories read is still in flight never reaches the arc's public copy until the reader's next
  arc edit (3ce6a7b republished it at the edit); in a session whose sub-theories read keeps
  failing, no arc edit republishes for the whole session. Words the reader removed from a live arc
  can stay public. The trade (stale public words against an unpublish on partial data) is
  Preston's. The red-team's proposed actions, for the build chat: re-mark arcs dirty when the gate
  skips, or call the republish from the sub-theories branch once both latches are open; or record
  it as a residual under Preston's ruling.
- **B1 (residual) — lens default-field stamps at render.** `ensureThemeFields` is called by
  `lensKeptThemes` (state.js 2901) and `lensThemeById` (3144) at render; on a lens record missing
  a field it stamps a default, which makes the record read as changed. Put back over the cloud's
  copy only after a failed-then-found read; the stamps are defaults, so stale, not destructive.
- **B2 (residual) — the sub-theory title blur.** The workshop title field (views.js 15605) calls
  `updateSubTheory` on every blur, which bumps `updatedAt` (state.js 2587) even when nothing was
  typed. A focus-and-leave while failing makes that sub-theory this device's copy on a retried
  load, over a newer copy from another device. Rare.
- **C — fb1aPrint equals mergeBookFingerprint** for every book (same eleven fields, order and
  defaults). L11 adds, beyond the executor's list: `evidence` and `attachedMarginalia` on a book.
  The app writes no lens field but `look` by itself.
- **E — the orphaned child: no throw found.** Sub-theory `arcId` readers (views.js 1152, 4394,
  12783, 15386, 15470, 22492, 22763, 23110, 24500; state.js 952–955; integrations.js 3390) and
  artifact `bookId` readers (views.js 20432, 20831; js/yumi-brain.js 351) are guarded or
  null-tolerant. A grep of the direct patterns, not of aliased variables: S22 is the proof.
- **F — no new silent-loss path** beyond D and L11, on found, absent, error, error-then-found,
  error-then-absent and error-then-sign-out, with the edit before the sign-in event, before the
  first answer, between failures and during a retry in flight. **R-F1 (residual, unproven):** a
  sub-theory with no `userId` is outside `fb1aOwned`, so an edit to it is not put back; old records
  only (the load backfills `userId`).
- **G — nits.** F7 confirmed (the comment's reason), and the same comment's "the FB-1a rig compares
  them" names the chat's rig, which is not in the repo — true once Stage 2 saves the rig under
  fb-1a-shots/. The sign-in call's "a no-op if start-up already did" is true only for kinds that
  still hold a base (a kind whose load already succeeded is snapshotted afresh, correctly).

**Recon-gate outcome:** one blocks-commit (D). Stage 1 waits on Preston's ruling on it.


---

## The second cut's Stage 0 (r2, 23 Nov 2026) — what the recon gate changed

The r2 patch (722 lines) was extracted, checked and applied to a scratch index only; it was
never applied to the tree. Its numbers are discarded. Kept here as it was written: its answers,
its findings and the recon red-team's verdicts. **integrations.js and state.js line numbers in
this section are r2's**; js/views.js, sw.js and tools/fx1c-sim are byte-identical in r2 and r3.
Where this section says "L5" or "L9" it means r2's wording of them.

Nothing but this file was written. No code, no index, no branch moved; the live index was
untouched throughout (tracked status 0 before and after).

### 0.1 The state of main — done again

| | |
|---|---|
| HEAD | the one local docs-only audit commit, held by R1 |
| origin/main | `3ce6a7b` (re-checked against the remote with `git ls-remote`: unmoved) |
| `git log origin/main..HEAD` | exactly that one commit; every path under the audit's own folder |
| CACHE_VERSION at origin/main | `praxis-v3.339` (sw.js:12) |
| tracked tree | clean (0 modified tracked files) |
| hook gate | ARMED (`core.hooksPath = hooks`), FIX-PROTOCOL v1.3, seven agents (`sh tools/ground-truth`) |
| the parking branch | does not exist yet (step 1.1 not done) |

### 0.2 Protocol documents — carried forward

None has changed since the first Stage 0 (last commits: CLAUDE.md 28 Oct, PROTOCOL.md and
docs/FIX-PROTOCOL.md 29 Oct, CRAFT.md 7 Jul, the seven agent files 2–16 Jul). Found:
CLAUDE.md, PROTOCOL.md (v1.2), docs/FIX-PROTOCOL.md (v1.3), CRAFT.md, and in .claude/agents/:
fix-implementer.md, fix-red-team.md, praxis-recon.md, praxis-reviewer.md, repo-mapper.md,
studio-mockup.md, studio-scan.md. **Missing: none.** Re-read this session.

### 0.3 The before-numbers — carried forward, and re-measured anyway

origin/main has not moved; all 17 blobs re-measured (`git show origin/main:<path>`) and all
MATCH the prompt in bytes and md5: js/integrations.js 221,778 `2d86b859…`, js/state.js
220,174 `b8cdafb5…`, js/views.js 1,424,423 `ac96f4c8…`, sw.js 6,894 `469402e2…`,
tools/fx1c-sim 16,316 `60ac4eb4…`; js/hand.js 53,596 `dc6a021e…`, assets/components.css
973,816 `97ccf971…`, assets/theme.css 41,369 `571e0ccc…`, assets/lumen-amber.css 11,953
`631bc2aa…`, assets/marks.js 10,255 `772886c0…`, index.html 12,113 `addda80d…`,
firestore.rules 12,779 `61250e98…`, js/yumi-brain.js 188,369 `5241349a…`, js/yumi-ui.js
101,681 `ab4d4160…`, js/import-capture.js 22,963 `10889362…`, tools/delete-test 22,131
`16892290…`, tools/export-test 20,292 `f3f0f757…`.

### 0.4 The r2 patch and rig, extracted — done again

The prompt file reached disk LF-only (0 CR in 123,700 B), so nothing was dropped. Extracted by
marker lines (marker lines excluded) to a scratch folder outside the repo:

- patch: **722 lines · 40,365 B · md5 `2967257290544b338242ce97af6635af`** · 0 CR · 0 tabs ·
  no BOM (starts `diff`) · ends with one `0a` · 39 hunks in 5 files · 6 non-ASCII (’ ×3,
  — ×2, § ×1) · 13 single-space context lines — **MATCH** on every count.
- rig: **512 lines · 37,676 B · md5 `5bbb14372c5fe624d50cb1ab595504b0`** · 0 CR — **MATCH**.

### 0.5 Apply check — done again (scratch index, never the working tree, never stash)

`GIT_INDEX_FILE=<scratch> git read-tree origin/main` → `git apply --cached --check` **OK** →
applied → staged blobs:

| file | bytes | md5 | numstat | |
|---|---|---|---|---|
| js/integrations.js | 237,577 | `80b00f028d2f159018e2e29364d2ce8e` | 343 30 | MATCH |
| js/state.js | 220,590 | `313e0e1d3df10c7c9d7f927a0ca1983f` | 5 1 | MATCH |
| js/views.js | 1,425,621 | `8e5524b4062ed617821693fdc24844e5` | 7 3 | MATCH |
| sw.js | 6,894 | `3ebc481175483a92461eeab363f313b7` | 1 1 | MATCH |
| tools/fx1c-sim | 16,804 | `326a74e1b54d579f2feaf56da0a1d685` | 6 3 | MATCH |

Every staged blob CR=0. The four files other than js/integrations.js are byte-identical to
the first cut's. The live index was untouched.

### 0.6 Reservations — done again

v3.340 is not reserved (`git log --all -S praxis-v3.340` empty; no doc names it).
docs/checkpoints/fb-1a-shots/ does not exist. docs/checkpoints/fb-1a.md exists untracked
(this file) and nothing else of FB-1a exists: no `fb1a`/`FB1A_` name in any tracked js, tool,
sw.js or index.html at origin/main (0 files). No parking branch yet.

### 0.7 The code read

Read on the r2 scratch copy; line numbers below are the PATCHED files.

**Carried from the first Stage 0 (their inputs did not move):** a, b, c, e, f, h, j — the
answers are kept in full at the end of this file. Re-checked for r2: (a) the 24 new names
(nine module variables, `FB1A_NOTICE`, fourteen functions) are all `fb1a*`/`FB1A_*` and none
exists at origin/main; r2's two new edit sites (the `fb1aBegin` call at integrations.js 409,
the guard at 1692–1701) sit beside prior-fix code without touching it. (c) re-grepped: the
only creators of a notebook entry in any js file are captureNote (views.js 3603), the journal
composer (3955), the marginalia composer (19009), `migrate()`'s two seed lines (state.js 4501,
4522) and the load's splat (integrations.js 906). (j) the one harness that cuts
integrations.js (docs/checkpoints/l4b-2b-shots/hotfix1-unit-harness:132–134) cuts
`ACCOUNT_GLOBAL_KEYS…`, `wipeAccountLocal…` and `signOut…getCurrentUser`; r2's new hunks (the
deleteAccount guard, the comment above restoreCloudFromLocal) lie before all three.

**d) The six save functions.** Extracted each body before and after: saveBooksToFirestore
(35 lines), saveArcsToFirestore (35), saveNotebookToFirestore (32),
saveSubTheoriesToFirestore (32), saveThemesToFirestore (31), saveArtifactsToFirestore (31) —
**0 differing lines each.** restoreCloudFromLocal, wipeAccountLocal and deleteAccountCloudData:
0 differing lines (only the comment above restoreCloudFromLocal changed). saveState: exactly
the 3 added lines in the notebook success branch. While a latch is shut each saver re-marks
its dirty flag and returns WITHOUT calling back (as at 3ce6a7b). Callers of the six savers in
every js file: saveState's six (state.js 3606, 3638, 3674, 3701, 3726, 3772), which do not
wait, and restoreCloudFromLocal (integrations.js 1810–1816), which does — and is reachable
only from deleteAccount after the guard (see o for the one window where a latch can still be
shut there, unchanged from 3ce6a7b).

**g) Ordering dependencies** (FIX-PROTOCOL #10; the commit message repeats them):
1. `fb1aBegin(u.uid)` (409) runs AFTER the account-switch `clearUserState()` (400) and
   `loadState()` (408), and BEFORE anything asynchronous: the next asynchronous step is
   `l3CheckAllowlist(u, l3Verdict)` (1128), and the six loads start only inside `l3Verdict`.
2. `fb1aReapply` runs AFTER each merge and BEFORE that branch's saveState: books 481 → 482 →
   483; arcs 574 → 575 → 585; sub-theories 652 → 653 → 666; lenses 740 → 741 → 749;
   artifacts 819 → 820 → 824; notes 947 → 948 → 964.
3. In the notebook branch the dirty mark (953) comes before saveState (964).
4. A note is marked pending BEFORE the saveState that could push it: views.js 3616 → 3617 →
   3618; 3956 → 3957 → 3958; 19022 → 19024 → 19025.
5. `noteRecordDeleted` runs BEFORE the record is deleted (it reads the record's `userId`):
   state.js 2521 → 2522; views.js 26445 → 26446, and inline before the `delete` at 26678,
   26685, 26713.
6. deleteAccount's guard (1698) runs BEFORE the re-auth (1704–1706).

**i) Automatic mutations, measured from sign-in.** A repo-mapper pass (Sonnet, read-only) swept
every js file; the three harmful paths below were re-read at their lines. Mutations inside
`loadState`/`migrate` come before the snapshot and do not count. No load callback writes a
DIFFERENT kind's records; the cross-kind reach is through `renderRoute()`, which every load
callback calls, and the renders below. Every merge REPLACES the record object, and "changed" is
whole-record JSON, so one stamped field carries the device's whole copy of that record back.
- **Harmful — the shelf sort stamping `category` (views.js 6160–6189, from `renderShelfCase`
  6346).** Once Yumi's yes is granted, every Shelf render in Categories mode (the default)
  sends the books with no category and, in one callback, writes `category` on all of them and
  saves (6182–6185). On a failed call it writes `'Uncategorized'` for the whole batch
  (`classifyBooksViaLLM` / `applyClassifyBatch`, integrations.js ~3031–3096) — so offline, the
  exact condition that makes a read fail, is when it stamps; and the label then sticks. On a
  retried found load each such book is "changed", and this device's whole copy of it wins:
  another device's status, rating or cover change to that book is reverted, and a good
  category is replaced by 'Uncategorized'. A book deleted elsewhere is NOT brought back (the
  books reapply keeps only ids still on the shelf). Reach: only books that have never been
  given a category on this device; a library already sorted has none.
- **Harmful — `republishLiveArcs` (integrations.js 4236–4280, from saveState's arcs block,
  state.js ~3660).** On any arcs-dirty save it sets `published = false` on every live-published
  arc whose LOCAL sub-theories project nothing published, deletes the public copy at once
  (ungated), and marks arcs dirty. On a device whose sub-theories are behind, that flag is a
  "change", so a retried load puts `published: false` back over another device's publish. L5
  already names it running while the latch is shut.
- **Harmful — a lens's `look` stamped at render (`ensureLensLooks`, state.js 2929–2943) and
  `ensureThemeFields` on read (2901, 3145).** From six render sites (views.js 5740, 5982, 27564–
  27565, 28069, 28451, 28714) on any route, the look is stamped in memory even while the
  themes load fails (only its save waits on `themesLoadOk`); the next saveState keeps it. On a
  retried found load the stale copy of that lens wins (name, books, readings), and a lens
  another device DELETED comes back (C3 applies to every non-book kind).
- **Stale only:** cover and metadata fills that complete after a reader's add or scan
  (views.js 6584, 6616, 7405–7451, 7836–7891, 9596–9610 — a failed lookup can write
  `coverUrl = null`); the yes-tap that clears 'Uncategorized' (1572–1582), which feeds the sort.
- **Reader actions that fan out** onto records the reader did not open (deleteBook,
  deleteArc's re-homing of every sub-theory of the arc, deleteEntry's evidence scrub, the
  duplicate merge) also make those records "changed" — C2 as ruled, but wider than one record.
- **Against 3ce6a7b:** none of these is worse there — 3ce6a7b's error opened the latch and the
  device's whole document went out, carrying the same stamps and every other stale record.
  But each is harmful, not merely stale, and **L9's wording undersells the shelf sort**: it
  stamps on a FAILED call, i.e. offline. Whether to leave this as L9 or to exclude `category`
  and `look` from the comparison is the chat's and Preston's call; I have not edited anything.
  Not exercised by the chat's rig (no lenses, no sort, no published arc).

**k) Copy is a contract.**
- The notice (R3), `FB1A_NOTICE` at integrations.js 302: "Can’t reach your library right
  now." — true: it is said only from the first failed read (327). "New notes and books are
  kept on this device." — true in every case this build leaves: a new note is written to
  local storage by saveState and is held through any later load by the notebook's pending set
  (the three creators all mark it); a new book is held by pendingBookSync. It makes no claim
  about EDITS, so L1 (an edit lost at a close) does not make it untrue; L8 (a read that keeps
  failing) keeps new notes and books on the device for as long as it lasts; L10 never shows
  the notice (no read failed). It promises nothing about sending.
- C6's bracket, "(your library has not finished loading on this device)" — true whenever it is
  shown: the guard fires only while one of the six loads is in flight or has a retry
  registered. Two looser words in the existing sentence around it, for Preston: "could not
  reach your data" also covers the first seconds of a normal sign-in, when a load is merely
  in flight; and "try again in a moment" is not true under L8 (a read that keeps failing
  holds deletion until a read succeeds or the app is reopened with a connection).

**l) The named live-smoke artifact** is below, brought up to r2's words (AFTER THE PUSH).

**m) The byte numbers — exact.** js/integrations.js +343 / −30 lines, net +15,799 B. Of the
343 added lines: **87 whole-line comments, 17 blank, 239 code**; added-line bytes 17,936
(with LF), of which comment lines 6,642, blank 17, code 11,277; removed-line bytes 2,137.
js/state.js +5 / −1 (3 comment, 2 code). js/views.js +7 / −3 (7 code, each with a trailing
comment). sw.js +1 / −1. tools/fx1c-sim +6 / −3 (6 code). In the ADDED lines of the three js
files and tools/fx1c-sim, `const `, `let `, `=>`, `class ` and the backtick each count 0,
comments included.

**n) F1 — closed for the case it named; one narrower window of the same family remains.**
For each kind, an edit made between sign-in and that kind's first failed answer:
- **Is it in `fb1aBase`?** No. `fb1aBegin` (182–188) snapshots all six kinds at 409, inside the
  synchronous sign-in callback; the reader cannot act until that callback returns. The nested
  sub-theories load (609) uses the same sign-in base. An edit made while the first read is in
  flight, between failures, or during a retry in flight is therefore AFTER the base.
- **Is it found by `fb1aChanged`?** Yes, on a load that failed at least once and lands found:
  at 331 `fb1aKept[kind] = fb1aChanged(kind, uid)` compares each owned record's JSON with the
  base (204–215); the edited record differs, a record created since sign-in is absent from the
  base — both are kept.
- **Is it put back by `fb1aReapply`?** Yes: the found branch merges, then 482 / 575 / 653 / 741
  / 820 / 948 put the kept object back (books only if the book is still on the shelf after the
  merge — C3) and mark the kind dirty. Every merge REPLACES the record object with the remote
  one (e.g. `state.books[rbid] = remoteBooks[rbid]`, integrations.js 1311; the notebook splat
  906), so the identity test `map[k] !== kept[k]` sees the difference.
- **Is it pushed?** Yes: the dirty mark plus that branch's saveState, with the latch opened at
  the callback's first line.
- **Any other moment the base is taken or replaced after sign-in?** (1) The floor at 326 runs
  only if a kind has no base at its first failure; `fb1aBegin` runs before every sign-in's
  loads and a base is deleted only when that kind's load succeeds, so no path reaches the
  floor in normal flow. (2) A second sign-in event for the same uid with no sign-out: a kind
  still holding a base keeps it (the older base counts more changes, which is right); a kind
  whose load already succeeded gets a fresh base, and its latch is still open from the earlier
  load, so nothing between was held. (3) An account switch: `clearUserState` → `resetSyncLatches`
  → `fb1aReset` (state.js 2265; integrations.js 377) clears the base before `fb1aBegin` takes the
  new uid's.
- **Finding F4 — the moment before the sign-in event (narrow; not measured yet).** The app
  paints from local storage before Firebase's auth observer fires (js/app.js 29, 53); with a
  user cached in `praxis_user`, an edit made in that moment is saved locally and its cloud
  write is deferred (latch shut). The sign-in callback then runs `loadState()` (408), which
  reads that edited copy back, and `fb1aBegin` (409) puts the EDITED record into the base. If
  that kind's read then fails and later lands found, `fb1aChanged` sees no change and the
  cloud's copy replaces the edit; at 3ce6a7b the error opened the latch and the edit went out
  inside the whole-document write. So on the error-then-found branch this is F1's loss, in the
  window between first paint and the auth event (on a phone, normally well under a second on a
  cold start; it does not exist when the app is resumed, because no new sign-in event fires).
  The chat's rig cannot show it: its fake fires the auth observer at `setTimeout 0`. Whether to
  close it (e.g. take the base at load-start of integrations.js, or from the stored copy before
  any render can write) is the chat's to judge; I have not edited anything.
- **A related case, for the record under L1:** an edit made while failing, then a sign-out and
  sign-in before any read succeeds — the sign-out's `fb1aReset` drops the base, the next
  sign-in's base contains the edit, and a first-answer-found load overwrites it. At 3ce6a7b the
  error had already pushed it. This is L1's shape (the session ended before a retry succeeded)
  reached by a sign-out rather than a close; L1's wording names only the close.

**o) The delete guard.** `fb1aUnfinished` (192–201) is true iff some kind has a retry
registered (`fb1aTries`) or a read in flight (`fb1aBusy`).
- Loads in flight, or failing: refused at 1698–1701 with `phase 'firestore'`, before the
  re-auth and before anything is touched (S9, S17 measure this).
- Loads all succeeded: passes; all six latches are open (each success opens its latch at the
  callback's first line, and nothing but `resetSyncLatches` shuts one); behaves as at 3ce6a7b.
- **The one state where `fb1aUnfinished` is false while latches are shut:** after the sign-in
  event but before the invite check has answered 'ok' — no load has started yet. While the
  uid is HELD at the invite gate, every route renders only the gate (views.js 546–553), so the
  delete panel cannot be reached; but in the seconds before the check answers (offline it can
  take ten seconds or more) the cached page can be. A deletion started then whose login removal
  fails would wait forever in restoreCloudFromLocal for six saves that never call back. That is
  exactly 3ce6a7b's behaviour (its latches were shut there too); r2 neither causes nor closes
  it. **But r2's two new comments overstate the guard**: integrations.js 1695 ("restoreCloudFromLocal
  … relies on every latch being open") and 1791–1792 ("latch-gated on its load having
  succeeded …, which deleteAccount checks (fb1aUnfinished) before it starts") read as if the
  guard proves every latch open; it proves only that no load is unfinished. A comment-accuracy
  finding for the chat (I have not edited it).
- A second call while the first runs: the panel disables its button (views.js 23911–23912);
  a direct second call during a deletion of a loaded device passes the guard as at 3ce6a7b.
  While loads are failing, every call is refused (S17 measures two).
- Between the guard and `wipeAccountLocal`: `fb1aTries` is empty and nothing is in flight, so
  'online', 'visibilitychange' and a still-pending timer each run `fb1aRetryAll` over an empty
  set and start nothing. New loads start only from `l3Verdict`, and `L3_RECHECK` is nulled on
  'ok' (449). `wipeAccountLocal` → `clearUserState` → `fb1aReset` then clears the timer.

**p) F2.** "Praxis has re-uploaded your data from this device" is shown only for `phase
'auth'`, which needs the guard passed, the re-auth, the cloud delete, and then a failed login
removal. With the guard passed (and the invite check answered — see o), all six latches are
open, so the six saves really write; the sentence is true for them unless a save itself errors
(restoreCloudFromLocal resolves on any answer — pre-existing at 3ce6a7b). Lens offers: its own
rule-4 latch is untouched; if its load failed or is in flight, `saveLensOffersToFirestore`
answers `{status:'deferred'}` (integrations.js 2386–2389) and writes nothing, so the sentence is
untrue for the lens offers alone — identical at 3ce6a7b. Profile and reader model: their F-DL3
latches open on error; if their load is still in flight the save sets a write-pending flag that
their load callback flushes while the tab stays open — identical at 3ce6a7b.

**q) tools/delete-test.** It loads state.js and integrations.js through `new Function` with a
stub whose `onAuthStateChanged` is `function () {}` (tools/delete-test:117), so no sign-in
callback ever runs, no `fb1aLoad` starts, `fb1aTries` and `fb1aBusy` stay empty, and
`fb1aUnfinished()` is false in every case; its `setLoaded` (165) opens the latches directly. No
case meets the guard. Not edited; Stage 2 runs it for its printed 58.

### Findings at r2 Stage 0 (no edit made; each is Preston's / the build chat's)

- **F4** (n above) — the moment before the sign-in event: F1's loss, in a narrower window. New
  against 3ce6a7b on the error-then-found branch. Not measured.
- **F5** (o above) — the guard's two new comments overstate it (invite-check window). Comment
  only; behaviour unchanged from 3ce6a7b.
- **Copy** (k above) — "try again in a moment" under L8; "could not reach" during a merely
  in-flight load. For Preston.
- **L1's wording** (n above) — the sign-out variant.
- **F6** (i above) — three automatic writes put back something harmful on a retried load: the
  shelf sort's offline 'Uncategorized' stamp (whole book records win), `republishLiveArcs`'
  `published = false`, and a lens's render-time look (a lens deleted elsewhere comes back). Not
  worse than 3ce6a7b; L9 undersells the first.

### The recon gate on r2 (fix-red-team, Sonnet, 23 Nov 2026)

Run under Preston's lift, against the frozen r2 scratch copy, from source. **No blocks-commit
finding; not clean.** It re-derived about 45 anchors, the five after-file md5s, the 87 / 17 /
239 split, the ES3 counts (0) and a parse of the patched integrations.js; confirmed that the
four existing FX-1c splat blocks are byte-identical, that every `delete state.notebookEntries`
site is now marked, and that every creator of a new book marks it pending (views.js 7373, 7799,
8426, 10969; js/intros.js 329), so the notice's "new notes and books" is true on every path.

1. **Anchors — nit, corrected above.** Four carried line numbers were pre-patch (the journal
   and marginalia composers, the two seed lines) and the six saveState saver calls were cited
   one line early. All 0.7 g ordering numbers resolve.
2. **F1 is closed** for what it named: all six kinds, the nested sub-theories load included,
   before the first answer, between failures and during a retry in flight, on every branch.
   **F4 is real, rated residual-to-document, not blocks-commit:** the window is sub-second
   (unmeasured) and cold-start only; the same edit is already lost on a first-answer found
   (L10); and F4 is L1's class — any local edit never confirmed pushed, including an earlier
   session's backlog, looks synced at sign-in, which only a lasting "changed since last
   confirmed sync" mark (build 1b) closes; moving the base earlier would not. Its proposed
   wording: "edits made before the sign-in event, or in an earlier session that never pushed,
   count as already synced"; widen L1 to name the sign-out / sign-in path and the pre-auth
   window. Also: an inherited failure (a second same-uid sign-in event while a load fails)
   skips the error branch for the new number, and for arcs the nested sub-theories load then
   waits for arcs to land found — safe (the latch stays shut), recorded here
   (residual-to-document). A switch to another uid with no cached previous user would leave the
   old `fb1aTries` / `fb1aStarted` in place — no path found that reaches it (hardening nit).
3. **The delete guard holds as stated, with one imprecision (nit):** the FIRST invite verdict
   can still land during the re-auth window (`L3_RECHECK` is non-null until 'ok') and start the
   six loads mid-deletion — the pre-verdict window again, same as 3ce6a7b, practically
   unreachable. **F5 confirmed (nit).** L8's "or the app is reopened with a connection" is not
   true for a read that fails for a lasting reason (a rules error): deletion is then held
   indefinitely on that device, where 3ce6a7b would have tried it (nit; usually moot, as the
   batch delete would meet the same rules).
4. **0.7 i: "none is worse than 3ce6a7b" holds on every branch** — on error-then-found r2's
   overwrite is a strict subset of 3ce6a7b's whole-document push. **R-A (needs a ruling;
   residual-to-document):** the shelf sort's offline stamp, as F6 says — leave as L9, or exclude
   `category` and `look` from the comparison. **R-B (residual-to-document, NEW):** while the
   arcs latch is shut, the deferred saver re-marks `arcsDirty` on every call, so
   `republishLiveArcs` (state.js 3660) runs on EVERY saveState for the whole failure, not only on
   arc edits — each run can rewrite a live public arc from stale local sub-theories or unpublish
   it with an immediate public delete. 3ce6a7b ran it only on arc saves after its latch opened.
   L5 names "still runs while shut", not "repeatedly". No other automatic writer of the six
   kinds found.
5. **C2 / C3 are never worse than 3ce6a7b in data, but make one new shape (residual; verify in
   Stage 2):** a kept child whose parent was deleted elsewhere — a sub-theory kept after another
   device deleted its arc, an artifact kept after its book was deleted there (3ce6a7b brought the
   parent back with the whole document). Stage 2 must show such an orphan renders without a throw.
6. d, g, k, m, q re-derived and confirmed.
7. **For Stage 2:** F1's closure by a slow-failing read plus an edit (S15), and F4's boundary
   measured (an edit before a DELAYED auth event, then a failed-then-found load), so the residual
   is stated by measurement, not prose.

**Recon-gate outcome:** no blocks-commit. Two items need a ruling before Stage 1 (R-A, and how
F4 / R-B are recorded); the rest are recorded.


---


## The first cut's Stage 0 (22 Nov 2026) — what the recon gate changed

The first cut's patch (712 lines) was extracted, checked and applied to a scratch index only;
it was never applied to the tree. Its numbers are discarded. Kept here: its carried answers,
its findings and the recon red-team's verdicts. **integrations.js line numbers in this section
are the FIRST cut's**; js/state.js and js/views.js are byte-identical in both cuts.

### Carried answers (0.7 a, b, c, e, f, h, j)

**a) Prior-fix regression check.** Anchors in js/integrations.js: F-DL1 latch declarations
55–58 and the header 31–47; F-DL2 `booksLoaded` 442 / the books saver 1356; F-DL3 profile and
reader-model latches 954, 1067 (untouched); F-DL4 `resetSyncLatches` 333; FX-1 keep-predicates
530, 607, 775; FX-1c splat blocks 506–543, 585–621, 675–709, 754–788; L4 hotfix R4
`themesLoadOk` 63/338/671; L4.2 rule 4 `lensOffersLoaded` 67/339/2352 and `applyLensOffersLoad`
737; L3.2/L3.2b `l3SignInSeq` 85/402/1101, `l3Verdict` 404, `L3_RECHECK` 82/1088. No `fb1a`
name exists anywhere in the base tree. The edits that land inside prior-fix logic are exactly
the listed ones: the six latch lines, the notebook's found branch (now FX-1c-shaped with its
own markers), and one line in `resetSyncLatches` (r2 adds the deleteAccount guard and drops the
first cut's six saver edits). Each `fb1aReapply` sits after its kind's `splat-end` marker, so
the fx1c-sim slices are unchanged for the four existing kinds.

**b) Readers of the six latches and `themesLoadOk`.** Only three kinds of reader exist: the
six save guards; `ensureLensLooks` (state.js 2941, `themesLoadOk`) — it works the look out in
memory and saves only when the themes load succeeded, so while failing it skips the save;
`pruneDeclinedOffers` (state.js 3099, `booksLoaded`) — returns 0 while the books latch is shut
(the safe direction). `themesLoadOk` now always equals `themesLoaded`. No render keys an empty
or error state off a latch: during a long failure the shelf shows the device's copy, and the
toast is the only sign. Pre-existing, not caused here but now lasting longer: the first-run
journey can start from the profile callback on an empty local shelf while books are failing;
`republishLiveArcs` still writes while the arcs latch is shut (L5).

**c) Notebook creates and removes.** Creates: captureNote (views.js 3603), the journal
composer (3954), the marginalia composer's new-note branch (19007) — all three marked pending.
Every other creator goes through captureNote (the split's children, the split-undo's parent,
the capture door); `genEntryId`'s only other callers are `migrate()`'s two seed lines (state.js
4497, 4518), whose notes are never synced. Removes: deleteEntry (state.js 2521) plus capUndo,
the split's partial-failure loop, the split's parent removal, and the split-undo's children —
all five mark the delete. Non-reader removals, rightly untouched: `clearUserState`,
`purgeSharedSeed` (seed notes only), the account-delete wipe. A note written before v3.340 and
never saved is not in the pending set and is lost at the first good load, as before (one-time).

**e) `l3SignInSeq`.** Written at exactly two places: +1 at each signed-in auth callback and +1
at sign-out. The six loads start synchronously inside `l3Verdict` after its own
`l3MySeq !== l3SignInSeq` check, and the nested sub-theories load starts synchronously inside
an arcs callback that `fb1aLoad` only runs for a current number, so no load starts under a
stale number. A second `'ok'` for one number: none found (`l3CheckAllowlist` calls back once;
re-asks are serialised by `l3Rechecking`; `L3_RECHECK` is nulled on ok). If it did happen,
3ce6a7b would re-run all eight loads; the patch would start none of the six again
(`fb1aStarted`), only profile and reader model.

**f) The arcs retry.** On an arcs retry the arcs callback runs again — its found branch runs
once; its nested sub-theories load does NOT start again (`fb1aStarted`), so sub-theories are
read once per sign-in. The frozen-arc sanitize gate reads `arcResult` from the arcs call that
STARTED the sub-theories load: arcs found + subs found → runs (as before); arcs error → subs
(any) → does not run this session, even after both retries succeed; arcs found + subs error →
subs retry found → runs. It never runs on non-authoritative data; in the arcs-failed-first
orders it is skipped until the next clean sign-in, which its own comment allows.

**h) Books reapply.** `mergeRemoteBookDoc` drops an id from `bookIds` only when (1) it is
absent from the remote and not pending-add — a genuine delete elsewhere, or (2) it is in this
device's own pending-delete set. A remote that lists an id but has no record for it keeps the
local record. One shape of (1) worth naming: a duplicate merge done on another device removes
the merged-away id from the remote, so a local edit to that copy is dropped with it — C3's
rule, reached through a merge rather than a delete.

**j) Harness anchors.** tools/delete-test, tools/export-test and tools/lens-data-test load
whole files through `new Function` with stub `window`/`document` that carry
`addEventListener` — the two new listeners register harmlessly. tools/fx1c-sim slices the
FX-1c markers (updated by the patch). tools/lens-eval-test reads yumi-brain.js only;
tools/ceiling-core-test reads its own core file. The five shot-folder harnesses (l4b-1-hotfix,
l4b-2a ×2, l4b-2b ×2) cut views.js / state.js / integrations.js between anchors; none of their
ranges contains an edited function.

### The first cut's findings

**F1 — the snapshot was taken at the first FAILED answer, not at sign-in.** An edit to an
already-synced record made after the app opened but before the first read failed (a real
offline read can take ten seconds or more to give up) was already in the base, so it did not
count as changed, and on the retried good load the cloud's copy replaced it — while the app was
still open. On 3ce6a7b that edit was pushed (inside the whole-document overwrite). A NEW silent
loss on the error-then-found branch. **→ r2 takes the base at sign-in (`fb1aBegin`).**

**F2 — the account-delete recovery claimed an upload it did not make.** With a latch shut (its
load still failing) the first cut's saver answered 'deferred' and wrote nothing, and
restoreCloudFromLocal counted it as done, so the panel's "Praxis has re-uploaded your data
from this device" became untrue; the comment above restoreCloudFromLocal was also made untrue.
**→ r2 refuses to start a deletion while any of the six loads is unfinished (`fb1aUnfinished`),
drops the six 'deferred' saver edits, and rewrites that comment.**

**F3 — two automatic writes make the device win** (a lens's look; the shelf sort's category).
**→ ruled as L9.**

### The recon gate on the first cut (fix-red-team, 22 Nov 2026)

Run under Preston's lift, against the frozen patched copy, from source. It re-derived 35 of 35
cited anchors and agreed with 0.7 e, f, h, i and the sign-out / account-switch lifetimes. Its
verdicts:

1. **F1 is real and a NEW silent-loss path against 3ce6a7b — blocks-commit.** Traced for books
   and for an edited note. One correction: an edit made while the FIRST read is in flight and
   that read answers found is already lost on both trees (now L10); the patch stretched that
   window to "however long the reads keep failing". **→ r2.**
2. **F2 is real but narrower — residual plus a copy fix.** The panel's "re-uploaded" line never
   checked outcomes, on 3ce6a7b either. **→ r2's guard.**
3. **NEW — a retry could write during account deletion.** Between the cloud delete and the local
   wipe, a pending retry that answered "absent" could open its latch and flush a dirty flag,
   re-creating a just-deleted document. **→ r2's guard: no retry is registered once a deletion
   starts (rig S16, S17).**
4. **0.7 c nit** — the `genEntryId` sentence (corrected).
5. **NEW — a read that always fails holds that kind's writes for good.** **→ ruled as L8.**
6. **Nit** — while a latch is shut, every saveState rebuilds that kind's payload and logs a
   "held" warning.

Stage 0 outcome on the first cut: blocks-commit at the recon gate; nothing applied; the chat
re-cut the patch as r2.
