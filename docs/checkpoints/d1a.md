D1a STARTED

# D1a — fix build 1b, part one: offline edits kept, the merge's artifact site, the size meter

Data tier C (BETA.md, Build sizes; FIX-PROTOCOL §5 path C, interim rule). Pre-flight written
24 Nov 2026 against main `0b0a730` (praxis-v3.340). Target version praxis-v3.341.

## Stage 0 — pre-flight, read-only on app code (24 Nov 2026)

### 0.1 The state of main

- HEAD `0b0a730` == origin/main (fetched). Branch main. No tracked file dirty; untracked files only.
- sw.js `CACHE_VERSION = 'praxis-v3.340'` → this build ships `praxis-v3.341`.
- Before-numbers (bytes, working tree; every blob CR=0): js/integrations.js 244,881 · js/state.js
  226,943 · js/views.js 1,454,622 · js/app.js 6,396 · sw.js 7,066.
- Foundations: lumen-amber.css md5 `631bc2aad9f55bbf77b090b30f6807db`, marks.js md5
  `772886c049d0d6d03d341507e602d88a` — both match FIX-PROTOCOL §2.
- `sh tools/ground-truth`: hook gate ARMED, FIX-PROTOCOL v1.3, seven agents present.

### 0.2 Documents

Found and read: CLAUDE.md, BETA.md, PROTOCOL.md, docs/FIX-PROTOCOL.md, tools/rig/README.md,
docs/checkpoints/fb-1a.md (Known limits L1–L15, Choices C1–C12, the live smoke), and the agent
files CLAUDE.md names: `.claude/agents/praxis-recon.md`, `praxis-reviewer.md`, `fix-red-team.md`,
`repo-mapper.md` (all `model: sonnet`), `fix-implementer.md` (`inherit`), `studio-mockup.md`,
`studio-scan.md` (`sonnet`). Missing: none.

### 0.3 The premises, tested against the source

1. **BR-03 holds, and is wider than "while the read is failing".** FB-1a knows what the reader
   changed only in memory (`fb1aBase`, integrations.js 129; `fb1aKept` set only for a load that
   FAILED first, 366). Every found branch splats the cloud's record over each synced id
   (integrations.js 507–985). So a change is lost at the next load whenever its write did not land
   before the app closed — including after a GOOD load followed by no signal (the SDK holds the
   `.set()` in memory; the next load's first answer is found, the C10 path). Scenario a is that case.
2. **L4 holds** at views.js 9530–9552: the moved artifact gets no `markPendingSync`, the dropped
   key no `noteRecordDeleted`. Measured as g1/g2 on main: the dropped key comes back and the moved
   one is deleted, on the device and in the cloud.
3. **A new hazard the L4 fix would create, unless its inverse moves with it.** `undoBookMerge`
   (views.js 9289) restores artifacts (9336–9341) but its "sync half" (9343–9345) handles books
   only. Once the merge marks the dropped key pending-delete, an Undo that restores it leaves the
   mark in place, and the next load that sees the key listed deletes it ("never resurrected") —
   even online. g3 guards this; it passes on main because main never marks the key.
4. **What is waiting is not sent at the load (fb-1a.md L6), and scenario g needs it.** A pending
   create or a pending delete that survives a load is pushed only when its collection next changes
   (the notebook alone does it at the load, C5). On main, d2's new artifact stays off the cloud
   after the reopen, and so would g1's moved artifact after the L4 fix. The brief's g asks for the
   artifact "on the device and in the cloud", so the fix must send what is waiting at the load.
5. **The rulings against the code.** Notes and artifacts carry `updatedAt`. The artifact switch
   (views.js 16418–16424) stamps `yumiMayReadAt` on ON only, never `updatedAt`; an artifact's body
   has no edit path after creation except the merge's append (views.js 9546). Books carry no
   last-changed time. **Lenses (`state.userThemes`) DO carry `updatedAt`** (createUserTheme,
   renameUserTheme, assign/unassign stamp it) — the ruling says they do not; it is honoured as
   ruled (the unconfirmed device wins). Arcs and sub-theories carry `updatedAt`; no ruling names them.
6. **A trap the persistence would spring (fb-1a.md L13).** `createUserTheme` writes a lens without
   its optional fields; `ensureThemeFields` fills them at render (state.js 2902, 3146) without a
   save. A print kept across a close would read that fill-in as the reader's change at every later
   load, and the lens rule (unconfirmed wins) would then lay a stale copy over another device's
   rename. The fix's own print normalizes a copy through each kind's ensure function first.
7. **Automatic writes (scenario f).** Category stamps and the cover backfill write no field the
   book print names (fb1aPrint, integrations.js 182). The title-path backfill writes `isbn` and
   `author` only when blank at add time (views.js 7443, 7836) — fb-1a.md L9 stays open.

### 0.4 Where the fix goes (planned; nothing written yet)

One new block in js/integrations.js, beside FB-1a, all names `d1a*` / `D1A_*`:

- **M1 the synced record.** Per kind and uid, localStorage `praxis_synced_<kind>_<uid>` =
  `{ id: hash of the record's print }` (artifacts add `:1`/`:0`, the switch as the cloud has it).
  Written at every found merge from the cloud's copy, and at every confirmed save from the prints
  taken when that save was SENT (saveState builds the payload from live objects, so a print taken
  in the callback would record an edit made while the write was in flight). No entry for an id =
  nothing known; a device with no record yet (first run of v3.341) counts nothing as changed.
- **M2 the merge.** Before each found branch's splat: the device's unconfirmed changes = records
  whose print differs from their synced entry, plus FB-1a's in-memory kept set. After the splat and
  `fb1aReapply`: books and lenses — the device's copy wins (C2; a book deleted elsewhere stays
  deleted, C3); notes, artifacts, arcs, sub-theories — the newer `updatedAt` wins, a tie goes to the
  device; a record another device deleted is kept and marked pending (C3); the artifact switch is
  merged on its own (the side that changed it wins).
- **M3 the switch at start-up.** Once per uid per page, before FB-1a's base is taken: an artifact
  whose switch is ON while the synced record says the cloud never had it ON is turned OFF.
- **M4 what is waiting is sent at the load** (premise 4): a found branch that kept a pending
  create, or still sees a pending delete listed, marks its collection dirty (FB-1a's C5, all six).
- **M5 the merge site.** views.js `mergeBookDuplicates`: `markPendingSync` on the moved key,
  `noteRecordDeleted` on the dropped key, `updatedAt` stamped on an appended keep artifact.
  `undoBookMerge`: a restored artifact key is un-marked as a delete and marked pending; a key the
  Undo removes is recorded as deleted. **Ordering dependency: the merge's delete mark and the Undo's
  un-mark ship in the same commit** (premise 3).
- **M6 the meter.** At each of the six sends in saveState: the document's size (UTF-8 bytes of the
  JSON of the payload without `updatedAt`); past 700 KB (716,800 B) the first line; a save refused
  for size (the service's message names "exceeds the maximum allowed size") the second. Each at
  most once a day per device (`praxis_d1a_said_<line>` = the local date), through `showToast`.
- **M7 what is waiting, recorded.** `d1aWaiting(uid)` reads M1 and the pending sets: per kind, the
  changed, created and deleted ids. Nothing draws it.

Files: js/integrations.js (block + two calls in each of the six found branches + one line in
`fb1aBegin`), js/state.js (saveState: send prints, confirm, meter and refusal, in each of the six
blocks), js/views.js (M5), sw.js (v3.341). Rig: tools/rig/scenarios/d1a.js (new), fb-1a.js (S13),
README.md. No new field on a book or lens record; one document per collection stays.

Prior-fix regression check: FB-1a's names (`fb1a*`, `FB1A_NOTICE`, the six `fb1aLoad` callbacks,
`fb1aRepublishOwed`) are read, not changed, except one added call at the top of `fb1aBegin`. The
FX-1c splat regions (`// FX-1c splat-begin/end:<kind>`, read by tools/fx1c-sim) stay byte-whole;
the new calls sit before `splat-begin` and after `splat-end`.

Byte floors (code, then comment): integrations.js +7,000 / +3,000 · state.js +1,200 / +300 ·
views.js +500 / +300 · sw.js +0.

### 0.5 The suite on today's main

First cut of the suite: 21 / 41, 20 failed. Revised after the recon gate (0.6): 28 / 53, 25 failed
(shown at STOP 1). **Final, with Preston's additions i, j, k and his F1 lens line, on main `0b0a730`:
35 / 67 passed, 32 failed** (the 67th line, added at Stage 2, also fails on main); log `docs/checkpoints/d1a-shots/rig-d1a-on-main-0b0a730.txt`.
Every scenario has a failing line: a (3), b (3), c (1), d (2, both d2), e (3), f (1), g (5), h (6),
i (1), j (1), k (5). c's lens line now passes on main by ruling F1 (the newer rename wins, which
main also does); c fails on main by its book line.
Lines that pass on main, and why they stay: d1 (main loses the ON with every other offline change,
so it passes for the wrong reason; after D1a it guards M3); d3 (the lost answer: guards M3 against
turning off an ON the cloud has); e's and f's controls (what main already does right must hold —
f's three of them guard the print against the app's own writes); g3 (guards M5's Undo half).

### 0.6 The recon gate (fix-red-team, Sonnet, 24 Nov 2026) — 3 BLOCK, 5 RESIDUAL, 3 NIT

Re-derived and held: every anchor; BR-03 (no Firestore persistence is enabled, so a held `.set()`
dies on close); the payload builders hold LIVE references (integrations.js 1387, 1970, 2259, 2479),
so prints are taken at send; artifact ids are `uid:bookId` in both payload and `fb1aOwned`;
premise 3 confirmed (without the Undo half, the next load deletes the restored key and M4 pushes
the delete).

- **B1 M3 underspecified — taken.** M3 now reads: an ON is turned OFF at start-up when the artifact
  is a pending create, or its synced entry ends `:0`. An artifact with no entry and no pending mark
  (a device's first run of v3.341) is left alone. M3 does NOT mark the artifacts dirty, so where the
  write landed but its answer was lost (the cloud HAS the ON), the next load takes the cloud's ON
  (M2: the switch is unchanged against its entry, so the cloud's side wins). New scenario d3.
  An ON turned on in-session while a read fails is kept by M2 when that read succeeds; M3 reverts
  only across a close (the ruling's words: "does not survive a close").
- **B2 the print must converge — taken.** D1a's print is its own (`d1aPrint`, FB-1a's untouched):
  a shallow copy normalized by the kind's ensure function, and for notes also the merge's inline
  defaults (`filed` book-aware, `images`, journal `isPrivate`); books keep the eleven fields; lenses
  drop `look`; serialized with keys SORTED at every level; the stored hash carries a print-version
  tag (`v1:`), so a later change of the print reads as "nothing known", never as "changed".
  New f lines: a lens filled in at render, and a note as an older device wrote it.
- **B3 forks resolved silently — taken.** Listed below, for Preston, verbatim.
- **R4–R8 → Known limits** at the close: M4 acts in the found branch only (an absent load still
  does not push a surviving pending create); L9 and L14 widen from failed loads to every
  unconfirmed write, and clocks that disagree between devices decide newer-wins; the merge's
  repoints of notes, arcs, sub-theories and lenses (and deleteBook's) stamp no time; the lost-answer
  window, a full localStorage, and restoreCloudFromLocal (which bypasses saveState: no confirm, no
  meter) degrade to today's behaviour; the meter counts JSON, which Firestore does not.
- **Suite — taken:** e gains a positive control; arcs, sub-theories and lens-against-lens are
  exercised (a, c); d3, the lost answer; g builds its copies through `T.addBook`; h measures a
  second document (artifacts). Still not exercised: an artifact body edited on two devices (the app
  has no artifact body edit after creation; scenario b proves newer-wins on notes, the same code).
- **NIT:** blob (LF) sizes, the measure FIX-PROTOCOL wants: integrations.js 239,860 · state.js
  222,265 · views.js 1,425,621 · app.js 6,285 · sw.js 6,894. M5's stamp lands before
  `captureMergeAfterState` (views.js 9572). Hashing per save: measured at the commit gate.

### 0.7 Forks for Preston (FORK-VERBATIM)

- **F1 Lenses carry `updatedAt` in the code, against the ruling's premise.** Keep the ruling (the
  device with the unconfirmed change wins), or make lenses newer-wins like notes? Built as ruled
  until told otherwise; scenario c's lens line reads the ruling.
- **F2 Arcs and sub-theories are not named by a ruling.** They carry `updatedAt`. Recommended:
  newer-wins, like notes (the ruling's reason applies). The alternative: the unconfirmed device
  wins, like books.
- **F3 FB-1a's C2 changes for the kinds that become newer-wins.** C2 ("a record this device changed
  while failing wins over the cloud's copy") is Preston's to overrule; under D1a it holds for books
  and lenses only, and for notes, artifacts (and arcs, sub-theories under F2) the newer edit wins,
  in-session too. C10 / L10 close as a consequence: an edit made before a load's first answer is now
  kept.
- **F4 Sending what is waiting at the load (M4, closes L6 in the found branch).** Needed by the
  brief's own g (the moved artifact must reach the cloud) and by d2. Recommended: all six kinds, as
  FB-1a's C5 does for notes. It adds a push at load where something waits, and an arcs push also
  runs the live-arc republish. The alternative: artifacts only, and g/d2's book and pending-create
  lines move to Known limits.
- **F5 `undoBookMerge` is outside the brief's named function.** Its artifact half must change with
  the merge (premise 3), or the L4 fix opens a new loss on Undo. Recommended: include.
- **F6 The meter's numbers.** 700 KB read as 716,800 bytes; size = UTF-8 bytes of the payload's JSON
  without `updatedAt`; the refusal is recognised by the service's message ("exceeds the maximum
  allowed size"). Each line once a day per device.

## Rulings (Preston, 24 Nov 2026)

From the brief:
- **R1** The same note or artifact changed on two devices: the newer edit wins, by the record's own
  last-changed time. Books carry no such time: the device with the unconfirmed change wins (FB-1a C2).
- **R2** "Yumi may read this", off wins: a switch-ON the cloud never confirmed does not survive a
  close. A switch-OFF made with no signal is kept.
- **R3** The meter's two lines, each said at most once a day, as the app's usual notice: past 700 KB,
  "Praxis is running low on room for your library. Please tell Preston."; a save refused for size,
  "Praxis can’t save more of your library to the cloud. Your work is kept on this device. Please
  tell Preston."
- **R4** The lasting "not synced yet" mark is not this build: what is waiting is recorded, nothing drawn.

On the STOP 1 forks ("go, with these rulings and three additions"):
- **F1** Lenses: the newer edit wins, by the lens's own last-changed time. This replaces the brief's
  line that lenses follow books. Only books keep "the device with the unconfirmed change wins".
- **F2** Arcs and sub-theories: the newer edit wins — on condition that the app never updates that
  time by itself (audit below).
- **F3** Accepted as the consequence of F1 and F2. **F4** Accepted: what is waiting is sent at the
  load, for all six. **F5** Accepted: the merge's Undo is fixed in this commit. **F6** Accepted.
- **A1–A3** Three additions to the suite, each shown failing on main first: an edit before the
  sign-in event on a load whose first answer succeeds (scenario i); one collection's read failing
  alone, the app closed before it recovers (j); a save SENT but never acknowledged (k) — a record
  counts as confirmed only on the cloud's acknowledgement.

At the commit gate ("Not committing yet. One ruled fix, then re-prove"):
- **R5** An artifact whose book is gone from the shelf after a load STAYS DELETED: it is not brought
  back, whatever was changed on this device and whatever its switch says. The same for a sub-theory
  whose arc is gone. FB-1a's book rule applied to the records that belong to a book or an arc. A note
  is not covered: it can live without a book.
- **R6** On an account switch or an account wipe, everything D1a keeps in memory is cleared.

## The F2 condition — every write of `updatedAt` on an arc or a sub-theory (24 Nov 2026)

Searched: `updatedAt\s*=[^=]|updatedAt\s*:` over js/*.js (every assignment and every literal), then
the callers of each enclosing function (`[^a-zA-Z_.]<fn>\(`), each caller read in place. No file
outside js/ is served code. **No site is automatic: every one runs from a reader's own action.**

| site | function | reached from | kind |
|---|---|---|---|
| state.js 2325 | createArc (literal) | the reader creating an arc | reader |
| state.js 2342 | updateArc | the arc rename box and the arc question box, on blur (views.js 17652, 18223) | reader (see note) |
| state.js 2356 / 2369 | graduateArc / ungraduateArc | the Graduate and "Return to ember" buttons (views.js 17603, 17615, 17959, 18356) | reader |
| state.js 2386 | addBookToArc | the shelf's Move-to-arc picker, the book page's arc picker (views.js 6781, 19214) | reader |
| state.js 2411 | addEntryToArc | the note's arc picker (views.js 19256) | reader |
| state.js 2469 | deleteArc (its sub-theories re-homed) | the reader deleting an arc (views.js 18830) | reader |
| state.js 2518 | deleteEntry (evidence scrubbed from sub-theories) | the reader deleting a note (views.js 20363) | reader |
| state.js 2568 | createSubTheory (literal) | the reader creating a sub-theory | reader |
| state.js 2588 | updateSubTheory | the workshop title box on blur (views.js 15605); the writing canvas's save, which fires only when the text changed (writing-canvas.js 521–527) | reader (see note) |
| state.js 2621 | setSubTheoryPosition | a mark dragged (views.js 18118); "Reset placements" (18922) | reader |
| state.js 2644 | adoptSubTheoryIntoArc | the Unrooted seat's arc button (views.js 4463) | reader |
| state.js 2676 | setMarkIdentity | the mark composer's Save and "Reset to auto" (views.js 14188, 14204) | reader |
| state.js 3337 / 3367 | linkSubTheories / unlinkSubTheories | a mark dragged onto another; the unlink button; deleteSubTheory (views.js 18115, 14727; state.js 2700) | reader |
| state.js 3422 | addEvidence | the gather-create, the sub-theory picker, a card woven in (views.js 3312, 19457, 15714) | reader |
| state.js 3452 | setEvidenceLayout | an evidence card's drag end (room-field.js 256: "onMove only at drag-end (no load write)") | reader |
| views.js 15228, 15548, 15559 | renderSubTheoryPage / renderSubTheoryBuild | Reopen and Finish (the threshold ceremony) | reader |
| state.js 4149, 4529–4620 | the shared worked example (seed) | its records belong to `__praxis_seed__`, never synced | not a reader record |

**Note — two reader gestures stamp the time with nothing changed.** The sub-theory title box calls
`updateSubTheory` on every blur, and `updateSubTheory` always bumps `updatedAt` (fb-1a.md L14 / B2);
the arc rename and question boxes call `updateArc` on blur, which also always bumps it. Each needs the
reader to tap into the box; neither is automatic. Under F2 such a copy carries a newer time and wins
over another device's earlier real edit. Recorded as limit L-D6; not changed here (out of scope).

## Stage 1 — the build (24 Nov 2026)

What was written, all as planned in 0.4 with the gate's corrections (0.6) and the rulings above:

- **js/integrations.js** — the D1a block (after FB-1a's listeners): `d1aCanon`, `d1aPrint`,
  `d1aHash`, `d1aEntry`, `d1aSend` / `d1aConfirmed` / `d1aRefused` (the send side and the meter),
  `d1aBefore` / `d1aAfter` / `d1aCloudHas` (the load side), `d1aStart` (the switch at start-up),
  `d1aWaiting` (the record of what waits). One call added at the top of `fb1aBegin`. In each of the
  six found branches: `d1aBefore` first, `d1aAfter` straight after `fb1aReapply`, `d1aCloudHas`
  just before the branch's `saveState`. The FX-1c splat regions are untouched (fx1c-sim 72 / 72).
  FB-1a's header comment, which called BR-03 "the next build", now points at the D1a block.
- **js/state.js** — saveState, in each of the six blocks: `d1aSend` as the payload is built,
  `d1aConfirmed` in the success branch (only on the cloud's answer), `d1aRefused` in the failure branch.
- **js/views.js** — `mergeBookDuplicates`: the moved key is un-marked as a delete and marked pending;
  an appended keep artifact is stamped `updatedAt`; the dropped key gets `noteRecordDeleted`.
  `undoBookMerge`: a restored key is stamped, un-marked as a delete and marked pending; a key the Undo
  removes gets `noteRecordDeleted`. **Ordering dependency (stated): the merge's delete mark and the
  Undo's un-mark ship in this one commit.**
- **sw.js** — `praxis-v3.341`.

Who wins, as built: a book — this device, when the book is still on its shelf after the merge; a
note, artifact, lens, arc or sub-theory — the larger `updatedAt` (else `createdAt`), a tie to this
device; a record another device deleted — kept and marked pending, except a book; a change the cloud
already holds — nothing sent; the artifact switch — the side that changed it against the synced
entry, and at start-up an ON that is a pending create, or whose entry says off, is turned off and
saved on the device only.

### 1.1 Measures (LF, the committed form; FIX-PROTOCOL measures blobs)

| file | blob before | after | delta | floor at 0.4 |
|---|---|---|---|---|
| js/integrations.js | 239,860 | 259,306 (final, after Stage 4; 256,372 at Stage 2) | +19,446 (Stage 4 added +2,934; at Stage 2 +16,512, comment lines about 4.3 KB; first measured +16,586, before the redundant "cloud already holds it" line, 74 bytes, was deleted at Stage 2 — corrected on the reviewer's HOLD) | +7,000 code / +3,000 comment |
| js/state.js | 222,265 | 224,459 | +2,194 | +1,200 / +300 |
| js/views.js | 1,425,621 | 1,427,037 | +1,416 | +500 / +300 |
| sw.js | 6,894 | 6,894 | +0 (a version string of equal length) | +0 |

The deltas are above the floors, as FIX-PROTOCOL §3 expects of agent estimates; the code grew past
the 0.4 sketch for reasons the gate and the rulings added: the canonical print (B2), the time and
switch settling for five kinds (F1, F2), the "cloud already holds it" case (A3), the per-record cache
that keeps a save from re-hashing an unchanged notebook, and the meter's daily stamp. Parse:
`tools/parse-check` PARSE OK on all four (exit 0). ES3 scan of the added lines: no `const`, `let`,
`=>`, backtick or `class` (one hit, the word "let" in a comment). The four code files stay CRLF in
the working tree (counted: every LF has its CR); some docs and rig files the edit tool wrote are LF in
the working tree, which git normalizes; every blob is LF. Foundations unchanged (md5 above).

## Stage 2 — the proof (24 Nov 2026)

### 2.1 The suites, on this tree

| suite | this tree | main `0b0a730` |
|---|---|---|
| `d1a` (new) | **67 / 67** at Stage 2; **82 / 82** after Stage 4 | 35 / 67; after Stage 4 **43 / 82** (39 failed) |
| `fb-1a` (S13 changed, below; S22 changed at Stage 4) | 99 / 99 | 99 / 99 before S13 changed |
| `fb-1a-extras` | 20 / 20 | 20 / 20 |
| `_template` | 1 / 1 | 1 / 1 |

`tools/checks.ps1`: **CHECKS: 33 of 33 passed** (main: 32; the one more is `rig d1a`). S13 in
`tools/rig/scenarios/fb-1a.js` now records "the EDIT is kept and pushed (BR-03, closed by D1a)", on
the device and in the cloud, where it recorded the edit reverting; the README says so.

The README's seven behaviours the d1a suite exercises: **2** (a sign-in event after the app is up: i),
**3** (the app writing by itself: f — a category stamp, a cover landing, a lens filled in at render, a
note normalized from an older device), **4** (a device behind the cloud: b, c, e, f), **5** (the app
closed before a write lands: a, b, c, d, f, g, j, k), **6** (one collection's read failing alone: j).
Not 1 (a slow-failing read) or 7 (a retry in flight, a second sign-in event): fb-1a's S15, S18, S23
keep those, and pass.

### 2.2 Mechanisms removed one at a time (each a scratch copy of the tree; the d1a suite against it)

Script: a `git archive` of HEAD with the four built files laid over it, one exact string replaced per
leg (the run refuses a leg whose string does not match exactly once). All on the final bytes, 24 Nov.

| leg | mechanism removed | d1a suite | caught by |
|---|---|---|---|
| L1 | the confirm on the cloud's answer (`d1aConfirmed` writes nothing) | 55 / 66 | a, c, e, g2 |
| L2 | confirm at SEND instead (Preston's A3) | 49 / 66 | a, b, c, e, k1, k2 … |
| L3 | `d1aBefore` (no unconfirmed change found) | 52 / 66 | a, b, c, e, i, j, k |
| L4 | newer-wins (this device always wins) | 64 / 66 | b B2, c's lens line (F1) |
| L5 | the send compare ("a change the cloud already holds is not sent again") | 65 / 66 | k2 "not written a second time" |
| L6 | the lens print's normalization (`ensureThemeFields` in `d1aPrint`) | 66 / 67 | f "the fill-in is not the reader's change" |
| L7 | the start-up switch pass (`d1aStart`) | 61 / 66 | d1, d2, d3 |
| L9 | the switch settled on its own (`d1aAfter`) | 65 / 66 | d3 |
| L10 | what is waiting sent at the load | 65 / 66 | g (the dropped books, in the cloud) |
| L11 | the cloud's copy recorded at the load (`d1aCloudHas`) | 61 / 66 | b B1, e, k2 |
| L12 | the merge's `markPendingSync` on the moved key | 64 / 66 | g1 |
| L13 | the merge's `noteRecordDeleted` on the dropped key | 62 / 66 | g1, g2 |
| L14 | the Undo's artifact half | 64 / 66 | g3 |
| L15 | the meter's first line | 60 / 66 | h (all six) |
| L16 | the refusal's second line | 63 / 66 | h |
| L17 | once a day | 62 / 66 | h |
| L8 | (not a mechanism) `d1aStart` also marking the artifacts dirty | 66 / 66 | — harmless: the dirty send cannot leave before the load lays the cloud's ON back |

Every mechanism, removed alone, is caught. L6 was first run on the 66-line suite and passed: under F1
a lens goes to the newer edit, so the false change could not beat the laptop's later rename. Its
remaining harm is a lens recorded as waiting and sent again; the check for that was added to f (the
suite's 67th line) and L6 then failed it. The other legs ran on the 66-line suite; the added line
reads only the waiting record after a lens fill-in, which none of them touches.

### 2.3 What D1a costs a save (measured, 24 Nov 2026; desktop Chrome in the rig, no CPU throttle)

A throwaway suite (run once, deleted, not committed): 600 notes of about 1.1 KB and 150 books.
Notebook document 792,897 bytes. Native `JSON.stringify` of that document: 3.7 ms. `d1aSend` on it:
first send of a session 23.1 ms; unchanged 3.8 ms; one note edited 6.1 ms. Books (150), first send
2.8 ms. At a load: `d1aCloudHas` 13.6 ms; `d1aWaiting` (all six) 15.5 ms. A phone is several times
slower: expect tens of milliseconds per save on a library this size, about a tenth of a second at the
first save of a session. `d1aCache` holds one more copy of each sent document's records, as strings,
in memory.

## Stage 3 — the gates

### 3.1 fix-red-team (§9, Sonnet, data-loss depth, on the frozen tree) — no BLOCK; 3 RESIDUAL, 4 NIT

Held under attack: the FX-1c splat regions untouched; scope (no edit to core.js, firestore.rules,
index.html, assets/, netlify/, .github/, tools/checks.ps1); no email, account name or `\Users\` path
in any added line; `d1aPrint`'s shallow copy never mutates a live record (all five ensure functions
set top-level fields only); the send-side snapshot is synchronous, a deferred send never confirms,
the confirm's uid is captured at send; `d1aStart` saves locally only and runs after the reader is
known; the merge's stamp lands before `captureMergeAfterState`, and the Undo's restore and its marks
ship together; `wipeAccountLocal` sweeps `praxis_synced_*_<uid>`. Its findings, and what was done:
- **R1 a record revived under a parent that is gone** → Known limit L-D1 (it is FB-1a's C3 / C12,
  now across a close).
- **R2 the book rule and the app's writes to the eleven fields** → Known limit L-D2.
- **R3 the cost per save was claimed, not measured** → measured (2.3).
- **NIT the rig's refusal text is the rig's** → Known limit L-D8. **NIT both lines in one save** →
  L-D7. **NIT suite gaps** (first run, account switch, the legacy ON) → L-D4, L-D9. **NIT stale record
  lines** (0.5's count, the CRLF sentence) → corrected above.

Three legs did not fail at first, and were acted on: the "cloud already holds it" line was redundant
with the send compare after it (deleted; the leg now removes the compare); the lens fill-in in f had a
load between it and the close, so it never armed (f reordered, so the fill-in comes after the last
load); a variant of `d1aStart` that also marks the artifacts dirty is harmless, because the dirty
send cannot leave before the load has laid the cloud's ON back (kept as a reading, not a mechanism).

### 3.2 praxis-reviewer (Sonnet, 24 Nov 2026) — HOLD on one figure, then PASS WITH NOTES

- **HOLD, corrected:** the integrations.js "after" size was recorded before the redundant line was
  deleted (256,446 / +16,586); measured again, 256,372 / +16,512 (1.1). No code change.
- Verified by the reviewer: locks untouched (both md5s); no change to firestore.rules, index.html,
  assets/, netlify/, .github/, tools/checks.ps1, test-arc-constellation.html; ES3 clean in the added
  app lines; parse OK on the three app files; sw.js one line; every touched blob LF; no email,
  account name, held-commit mention or `\Users\` path in any added line; no new `.set`/`.update`/
  `.delete`; the wiring at all six load branches and all six send sites; confirm only in the `ok`
  branch; the rulings as built; the merge and Undo halves in one diff; the exact meter lines, the
  apostrophe as FB1A_NOTICE's; S13, the README, BETA.md (129 lines) and the ledgers.
- **Notes:** `d1aWaiting` has no caller in the app yet — the record of what waits is the persisted
  synced maps and pending sets, and `d1aWaiting` computes it from them on demand (D-C9 says so now);
  the legs ran on the 66-line suite except L6 (disclosed in 2.2); the refusal matcher has met only
  the rig's imitation of the service's message (L-D8); the checks run's tail is saved as
  `d1a-shots/checks-and-main-tail.txt`.
- **builder.html (Preston, 24 Nov: stage it):** the two lines of `docs/studio/builder.html` flagged at the commit gate (the overview and plan pages, each rewritten whole by `tools/studio-build`) carry only text already in HEAD — a test account's address and FB-1a's sentence about the held audit commit, from `sequence.md` — re-emitted by the generator, with no new public text from this build.

## Stage 4 — the ruled fix at the commit gate (Preston, 24 Nov 2026: R5, R6)

### 4.1 What changed

- **js/integrations.js only** (no other app file; +2,934 bytes, 256,372 → 259,306 LF). `d1aAfter`'s "deleted on another device" branch
  asks `d1aParentGone` first: an artifact whose `bookId` is not on the reader's shelf after the load,
  or a sub-theory whose `arcId` names an arc that is gone, is removed and its pending mark cleared
  (nothing waits). Otherwise C3 as before, and the record is noted in `d1aRevived`. At the end of the
  books and arcs loads, `d1aDropOrphans` removes any child brought back before its parent's load had
  answered whose parent is now gone, as a recorded delete (it may already have been sent). `d1aReset`
  clears D1a's memory, called from `resetSyncLatches`. The block's header comment says so.
- **A premise the ruling did not have:** `deleteArc` never deletes an arc's sub-theories; it re-homes
  them (`arcId` null, stamped; state.js 2458, "the reader's authored prose … NEVER cascade-deleted").
  So R5's sub-theory half applies when the sub-theory itself was deleted elsewhere along with its arc
  (scenario m). The arc alone deleted elsewhere is the fork in 4.3.
- **fb-1a S22 changed:** it recorded the artifact of a book the phone deleted as kept on the laptop;
  under R5 it stays deleted. Its sub-theory half is unchanged (re-homed, never deleted). The check's
  name says so; the README says so.

### 4.2 The proof (each new line run first on the STAGED build — the index written out with
`git checkout-index`, the index untouched — then on this tree)

| scenario | staged build | this tree |
|---|---|---|
| l — book + artifact deleted elsewhere, unsent change here, switch confirmed ON | FAIL (artifact back, on the phone and in the cloud) | PASS (gone both; nothing waiting) |
| l2 — the same, the artifacts load answering before the books load | FAIL | PASS (brought back for a moment, then removed once the books load answers; nothing waiting at the next load) |
| m — sub-theory deleted elsewhere with its arc, unsent change here | FAIL | PASS |
| n — a note changed here whose book was deleted elsewhere: kept | PASS (control) | PASS |
| n2 — a note deleted elsewhere WITH its book, changed here: kept (C3) | PASS (control) | PASS |
| o — account switch A → B: none of A in D1a's memory; then B's account wiped: memory empty | FAIL (A's three ids and uid held; the cache full after the wipe) | PASS |

Staged build 77 / 82 (the five failing lines are l, l2, m and o's two); this tree **82 / 82**; main
`0b0a730` 43 / 82. n and n2 cannot fail on the staged build — it already keeps notes; their job is to
catch the rule reaching too far, which leg L21 shows they do. Logs in `d1a-shots/`:
`rig-d1a-lmno-on-the-staged-build.txt`, `rig-d1a-on-the-build.txt`, `rig-d1a-on-main-0b0a730.txt`, `legs2.txt`.

Mechanism-removed legs for the new rule (same method as 2.2, on the final bytes):

| leg | removed | d1a suite | caught by |
|---|---|---|---|
| L18 | the parent rule (`d1aParentGone` always false) | 79 / 82 | l, l2, m |
| L19 | the clean-up when the parent's load answers later (`d1aDropOrphans` at the books load) | 81 / 82 | l2 |
| L20 | the memory reset (`d1aReset` in `resetSyncLatches`) | 80 / 82 | o (both lines) |
| L21 | (reach) the rule applied to notes as well | 81 / 82 | n2 |

All four suites on this tree: d1a 82 / 82, fb-1a 99 / 99, fb-1a-extras 20 / 20, _template 1 / 1.

### 4.3 Fork for Preston (FORK-VERBATIM): the arc alone deleted elsewhere

`deleteArc` re-homes an arc's sub-theories (`arcId` null, stamped now) and never deletes them. If this
device has an unsent change to such a sub-theory made AFTER the other device deleted the arc, the
change is newer, so it wins — and it carries the old `arcId`, naming the deleted arc, back to the
cloud (scenario m2's reading: on the phone and in the cloud the `arcId` is the deleted arc's). It
shows under Unrooted (FB-1a S22 checks that). Options: (a) leave as is — L-D1 (c), FB-1a L12; (b) when
the newer local copy names an arc that is gone, keep its words but take `arcId` null, as `deleteArc`
does (a re-home, no deletion). Recommended: (b), in a later data build or here on your word. Not built.
**Ruled (Preston, 24 Nov 2026): "Leave for later".** Not in D1a; open as L-D1 (c).

## Choices made in this build (each Preston's to overrule)

- **D-C1** The record of what the cloud holds is a hash of each record's print, per kind and uid, in
  localStorage (`praxis_synced_<kind>_<uid>`); taken at send, kept only on the cloud's acknowledgement,
  and rewritten from the cloud's copy at every found load.
- **D-C2** A print normalizes a copy the way the app does on load and render, sorts keys, and carries
  a version tag; books keep the eleven fields, lenses drop `look`.
- **D-C3** Newer-wins reads `updatedAt`, else `createdAt`; a tie goes to this device.
- **D-C4** A record another device deleted, changed here unconfirmed, is kept and marked pending
  (FB-1a C3), except a book, an artifact whose book is gone, and a sub-theory whose arc is gone
  (they stay deleted: R5). "Gone" is read after the load; a child brought back before its parent's
  load answered is removed, as a recorded delete, when that load answers. A sub-theory with no arc
  named (`arcId` null) keeps C3.
- **D-C10** D1a's memory (`d1aStartedFor`, `d1aCache`, `d1aDocBytes`, `d1aRevived`) is cleared in
  `resetSyncLatches`, beside FB-1a's own reset: the one place an account switch, a sign-out and an
  account wipe all pass through (R6).
- **D-C5** The artifact switch is settled on its own against the synced entry; at start-up an ON
  that is a pending create, or whose entry says off, is turned off and saved on the device only.
- **D-C6** What is waiting is sent at a FOUND load only (absent loads unchanged).
- **D-C7** The merge stamps `updatedAt` on an appended keep artifact; Undo stamps each restored one.
- **D-C8** The meter: 716,800 bytes; UTF-8 bytes of the payload's JSON without `updatedAt`; the
  refusal recognised by "exceeds the maximum allowed size" (or `invalid-argument` naming a size);
  `praxis_d1a_said_<room|full>` holds the local date of the last time each line was said.
- **D-C9** What waits is recorded in localStorage (the synced maps and the pending sets), and
  `d1aWaiting(uid)` reads it on demand (per kind: changed, created, deleted). Nothing calls it in the
  app yet and nothing draws it: it is there for the Your data room (R5).

## Known limits — open after this build

- **L-D1** (red-team R1; rewritten on Preston's ruling of 24 Nov) A note, lens or arc changed here and
  deleted on another device is kept (FB-1a C3), across a close too; a note keeps it whether or not its
  book is gone (a note can live without a book). An ARTIFACT whose book is gone from the shelf after
  the load, and a SUB-THEORY whose arc is gone, are NOT brought back: they stay deleted, whatever
  changed here and whatever the switch says, on the device and in the cloud (scenarios l, l2, m).
  When the artifacts load answers before the books load, the artifact is brought back for that
  moment (and may be sent) and is removed, as a recorded delete, once the books load answers (l2);
  that delete waits until the next load confirms it. What stays open: (a) a sub-theory that was
  already unrooted (`arcId` null) and is deleted elsewhere is still kept (C3); (b) a record created
  here and never confirmed — a pending create — whose parent is deleted elsewhere is kept by FX-1's
  pending guard, as before; (c) **the arc alone deleted elsewhere** — `deleteArc` never deletes a
  sub-theory, it re-homes it (`arcId` null, stamped) — so the cloud keeps the sub-theory, and a
  newer unsent change here wins with the dead `arcId` (the m2 reading; FB-1a L12, now across a close).
  (c) was put to Preston as fork 4.3 and ruled "Leave for later" (24 Nov): not built in D1a.
- **L-D2** (red-team R2; FB-1a L9) Books go to the device with the unconfirmed change, whole record.
  Any write to one of the eleven printed fields counts as the reader's, including the app's own
  (the title-path backfill of a blank isbn or author at add time). Such a book then overwrites
  another device's confirmed change to it.
- **L-D3** Two devices still overwrite each other (BR-04, D1c), and profile and reader model keep
  their latches (BR-29, D1b).
- **L-D4** A device's first load under v3.341 knows nothing yet: an edit carried in from v3.340 is
  lost as before, and a switch-ON with no record of the cloud survives that first close.
- **L-D5** Clocks: newer-wins compares two devices' clocks.
- **L-D6** (the F2 audit's note) The sub-theory title box and the arc rename and question boxes stamp
  `updatedAt` on blur with nothing changed; that copy then wins over another device's earlier edit.
  The merge's repoints of notes, arcs, sub-theories and lenses (and deleteBook's) stamp no time.
- **L-D7** A save that crosses 700 KB and is refused in one go says both lines; the second replaces
  the first on screen at once.
- **L-D8** The refusal is recognised by the service's message as documented; the rig proves the
  plumbing with its own copy of that message, not the live service's wording.
- **L-D9** A write that lands while its answer is lost, then the page closes: the record stays
  "waiting" until the next load sees the cloud holds it (then nothing is sent). A full localStorage,
  or `restoreCloudFromLocal` (it calls the save functions directly), leaves the record as it was.
- **L-D10** An absent load still does not send a surviving pending create (FB-1a L6, absent branch).
- **L-D11** The meter measures JSON, which is not exactly how the service counts; JSON over-counts.
- **L-D12** (rewritten on Preston's ruling of 24 Nov) Cost: 2.3. Memory: everything D1a keeps in
  memory (`d1aStartedFor`, the hash cache `d1aCache`, the sizes `d1aDocBytes`, the brought-back set
  `d1aRevived`) is cleared on an account switch, a sign-out and an account wipe — all three run
  `clearUserState` → `resetSyncLatches` → `d1aReset` (scenario o: none of A's ids or uid is held after
  A → B; after B's wipe the memory is empty). A consequence: signing out and back in on the same page
  runs the start-up switch pass again, as a close would (an unconfirmed switch-ON is turned off).

## AFTER THE PUSH — the live smoke (Preston runs it, on a throwaway account)

The build machine cannot reach the live origin (re-measure before the push). Set-up as fb-1a.md's
(a throwaway account on the invite list; a desktop Chrome and a phone, each opened once with a good
connection). Desktop: hard-refresh, DevTools → Application → Service Workers, the cache name reads
`praxis-v3.341`.
- **C (BR-03; fb-1a.md's C, now expected to PASS).** Desktop offline, edit an existing note's words,
  close the tab, go online, reopen. PASS: the edit is there; reload the phone: it is there too.
- **D1a-1 (a book and a lens).** Phone: airplane mode on; mark a book read and rename a lens; swipe
  the app away; airplane mode off; open. PASS: both changes there; the desktop shows them on reload.
- **D1a-2 (the switch).** Phone: on a book with an artifact, switch "Yumi may read this" ON with
  airplane mode on; swipe away; airplane mode off; open. PASS: the switch is OFF.
Any step that does not read as written goes to the build chat with what was on screen.
