# UNDO INDEPENDENCE — build report

Round: LIVE DEFECT (v3.293 → **v3.294**). Base `3ee464d`. One commit, one bump.
Recon: `docs/checkpoints/undo-independence-recon.md`.
Rig: `.claude/rig/serve.ps1` :8811, uid `d0tester`, SW+caches killed, transitions
force-settled. **Every capture below was taken fresh on 2026-09-03 against the
final bytes** — none reused from the pre-fix run (CAPTURE PROVENANCE).

## 1. The defect

Undo behaved as a **stack**: after six sequential merges only the newest had a live
Undo; the other five refused with *"your shelf has changed since the merge."*
Reproduced on a 148-book / 6-pair fixture, 148 → 142, message verbatim.

**The suspicion in the ruling named `bookIds`. It was FIVE of seven buckets** —
`index`, `arcs`, `subs`, `notes`, `themes`. Removing the `index` check alone would
have left the defect standing on any shelf whose duplicates share a collection,
which is Preston's shelf. Measured in the recon §2.

## 2. What the fingerprint watched — before and after

| bucket | before | after | why |
|---|---|---|---|
| `books` (survivor + folded record: title/author/isbn/status/finishedAt/rating/dateRead/categoryOverride/traditionOverride/movedMe/valueMarks) | watched | **watched** | the reader's own work on the two records. A survivor deleted since the merge also lands here — its fingerprint becomes `'null'`. |
| `artifacts` (artifactKey(uid, keepId) + each folded id) | watched | **watched** | the reader's writing ON those two books, keyed per book. An unrelated merge can never touch these keys. |
| `index` — JSON of the **entire shelf `bookIds` array** | watched | **dropped** | changes on *every* merge. This is what Preston hit. |
| `arcs` / `subs` / `notes` / `themes` — whole membership arrays | watched | **dropped** | membership of *other* books. Now handled by surgical repoint instead of refusal. |

## 3. Why both halves had to change together

The guard was wide because the **restore was wholesale**:
`state.userBooks[uid].bookIds = ts.bookIdsBefore.slice()` and four sibling array
overwrites. Undoing merge #1 after #2 would have rolled #2 back with it. Loosening
the guard alone would have converted a false refusal into real data loss. So the
restore became surgical first, and the guard narrowed second.

- `mergeRestoreMembership(cur, before, touched)` — removes the touched ids from the
  live array and re-inserts them, in pre-merge order and deduped, at the position
  the survivor **currently** occupies. Returns `null` (leave the collection alone)
  when no touched id is present, or when nothing would be restored.
- `mergeRestoreEvidence` — sub-theory evidence is repointed in place and never
  deduped by the merge, so the inverse is per-entry, matched on the entry's own
  **stable `id`**. Never position, never content. An entry that cannot be matched
  by id is skipped, never guessed at. (This is the §9 BLOCK fix — see §9 below.)

`mergeBookDuplicates`, `groupShelfDuplicates`, the surface layout and the covers
section are **untouched**. The merge write path needed no change — the tombstone
already stored more than a surgical restore needs. The prompt's STOP was not hit.

## 4. Mechanical gates

| gate | result |
|---|---|
| parse (`cscript //E:jscript tools/parse-check js/views.js`) | **PARSE OK** |
| `js/views.js` bytes | 1,229,592 → **1,236,790** (+7,198) |
| diff lines added | 170 = **69 code** + 98 comment + 3 blank; 20 removed |
| `sw.js` | 6,041 → 6,041 bytes, one line, `praxis-v3.293` → **`praxis-v3.294`** |
| EOL (`git ls-files --eol`) | `i/lf w/lf` both files — no flip |
| `grep -c 'fp.index'` / `'afterState.index'` | **0 / 0** (index check gone) |
| `mergeRestoreMembership` / `mergeRestoreEvidence` | 7 / 3 (1 def + real callers each) |
| `mergeEvidenceSignature` | **0** — removed entirely by the §9 fix |
| dirty tracked files not intended | none (`js/views.js`, `sw.js`, docs only) |

## 5. Proofs — all seven, on the fixture shaped like his shelf

**1. Six merges, every tombstone still undoable.** 148 → 147 → 146 → 145 → 144 →
143 → **142**; undoable count 1 → 2 → 3 → 4 → 5 → **6**; refusals **zero at every
step**. Rendered proof at 390×664: six `[data-state="cleanup-merged"]` cards under
*"Recently merged — undoable for 30 days"*, each carrying a live **Undo this merge**.
Screenshot captured (390×664, cards 1–5 legible, all six buttons present).

**2. Undo #2.** Both records restored — folded record back with `valueMarks` 1,
`movedMe true`, `dateRead 2025-01-02`, artifact restored; survivor back to its own
pre-merge state (marks 2 → 1, movedMe → false). **Shelf indices 137 / 138 —
adjacent to the survivor**, not a stored index. The other five pairs: **zero field
changes**. Arc/sub/note/theme each repointed for pair 2 only.

**3. Undo #5 after #2.** Only pair 5 changed; pair 2's earlier restoration survived
intact in every collection (`arc_shared` holds both `dup2_drop` and `dup5_drop`).
Pair 6's sole delta was `shelfKeepIdx 142 → 143` — a positional shift from the
insert, not a data change. **Under the old wholesale restore this step would have
destroyed #2's restoration.**

**4. The guard still bites.** Editing the survivor of #4 (rating → 5): #4 refuses
with *"this book has changed since the merge"*, `undoBookMerge` returns **false**,
the folded record stays gone, the edited rating is untouched — *"Nothing has been
changed"* is literally true — and the tombstone survives. #3 and #6 stay UNDOABLE.
Adding a value mark to #6's survivor refuses **#6 only**. Undo #3 then succeeds.

**5. Simulated sync, both cases.** A stale remote doc omitting every restored id
(the exact read that used to delete them): all three restored records **survive**,
stay on the shelf, keep `valueMarks` and `movedMe`. The refused pair's folded id
stays absent and stays pending-delete. `clearPendingBookDelete` + `markBookPending`
unchanged and still load-bearing.

**6. I1 both directions, and Undo across navigation.**

- Direction A (survivor *has* the scalar): survivor's rating 4 / dateRead win, marks
  union to 2; after Undo the loser's rating 1, dateRead and prose *"drop why"* are
  all preserved, survivor back to 4 / 1 mark.
- Direction B (survivor *lacks* it): rating 3, dateRead, status `read`, finishedAt,
  movedMe, `categoryOverride: Philosophy` and 1 mark all carried across; after Undo
  the loser is whole again and the survivor is blank as it began.
- Across navigation: tombstones made before a Notebook → Shelf navigation, panel
  opened via the real **Tidy library** control, **Undo clicked as a button** on card
  #2 → shelf 142 → 143, cards 6 → 5, adjacency 137/138, and the remaining five all
  still read *Undo live*. The restored pair correctly reappears as a duplicate group
  reading *"1 note · 1 value mark · moved-me · an artifact · 1 arc · 1 evidence ·
  1 theme"* — every membership repointed back.

**7. Pixels-visible (CLAUDE.md:187).** Not node counts — measured rects.

- **390 × 664:** head *"Recently merged — undoable for 30 days"* 13px visible; cards
  1–4 `124px` visible each and `elementFromPoint` **REACHABLE** on their Undo
  buttons; card 5 `92px`; card 6 `0px` (below fold — a normal six-item scroll list).
- **1360 × 900** (Preston's real CSS viewport): all five remaining cards
  `1261 × 72`, **72px visible each, all REACHABLE**.
- One occlusion appeared at 390 on card 4 — `intro-panel-wrap`, the first-run shelf
  intro (`praxis_intro_shelf`, fixed, z-10005). A **fresh-origin rig artifact**, not
  this change and not a surface Preston sees; dismissed, after which every measured
  button was reachable. Recorded rather than quietly cropped.

## 6. Adversarial edges I ran beyond the seven

- **Two merges onto the SAME survivor.** Undo A correctly **refuses** while B stands
  (B's union is on that survivor); Undo B succeeds; A then becomes undoable and
  succeeds. Final state 1/1/1 marks, all three on the shelf, **no duplicate ids**.
  The guard enforces LIFO *only where merges genuinely share a record*, and leaves
  ordering free everywhere else — which is exactly the ruling.
- **Reader empties an arc after merging.** Undo restores the record but leaves the
  arc empty — it does not resurrect membership the reader removed.
- **Duplicate-signature evidence — found in my own pass, then found INSUFFICIENT by
  §9.** My pass caught that two entries with identical `quote`+`annotation` came
  back **swapped**, and I fixed it by trying index `i` first with a signature scan
  as fallback. The red-team showed that fix was still unsound on real data. See §9.
- **Duplicate-id sweep** after six merges + two undos: shelf, arc, note and theme
  all report **zero** duplicated ids.

## 6b. §9 — fix-red-team (Sonnet; bar lifted in Preston's go-ahead)

**One BLOCK, and it was right.** I verified both of its structural premises against
the source before acting, and then reproduced the corruption.

**The finding.** `mergeRestoreEvidence` matched entries by content signature, with
index as the primary. Both discriminators fail on real data:

1. **Content does not discriminate.** Book evidence is routinely attached with no
   quote and no annotation, so real entries commonly share the single signature
   `["book","",""]`. My fixture had given every entry a distinct quote
   (`'passage 0'`…) — **an unrealistic fixture that hid the defect.** This is the
   "verify on the real snapshot, not a fixture" lesson landing again.
2. **Index does not hold.** `deleteBook` (views.js:7702) REBUILDS a sub-theory's
   evidence array through a keep-filter, so deleting *any* unrelated book shifts
   the index of every entry after it. Ordinary use, no warning. **Verified by
   reading the function**, then by measurement (array 3 → 2, indices shifted).

**Reproduced, both ways.** Sub-theory with `[P, B, D]`, all blank signatures; merge
B→A, merge D→A, delete unrelated book P, then undo both:

| matcher | result | truth |
|---|---|---|
| old (signature + index) | **`[D, B]`** — B's passage attributed to D, D's to B | `[B, D]` |
| new (`id`) | **`[B, D]`** | `[B, D]` |

Silent misattribution of one reader's passage to the wrong book, with the Undo
reporting success. On a data-loss-tier fix that is a correct BLOCK.

**The fix — match by identity, like the rest of the round.** Every evidence element
is created by `state.js addEvidence`, which assigns `id: genEvidenceId()`; I
confirmed `state.js:2716` is the **only** `evidence.push(` in the codebase, so no
path produces an id-less element, and the tombstone deep-clones those ids verbatim.
`mergeRestoreEvidence` now finds the entry by `id` and repoints it only if it is
still where the merge left it. `mergeEvidenceSignature` is **deleted** (grep 0) and
the scan fallback is **gone** — an unmatchable entry is skipped, never guessed at,
because skipping leaves a visible, hand-correctable citation where a guess silently
attributes a passage to the wrong book.

**Its other findings.** #2 (`mergeRestoreMembership` cannot duplicate or drop the
survivor), #3 (backward compatibility with the six old-format tombstones), #4
(parse, byte delta, cache bump, call-sites non-dead, ES3 clean) — all PASS,
independently reproduced by the agent. #5 flagged the BOARD/studio/builder edits as
outside the reviewed diff: **intentional**, they are this round's required currency
updates. #6 restated my own `dropIds.length > 1` residual, which stands (§8).

**Process fault, mine.** I dispatched the red-team while still editing
`mergeRestoreEvidence`, so its first `git diff` caught an older revision of that
function. It named the instability rather than absorbing it, which is the correct
behavior; the fault was mine for not freezing the tree before dispatch.

## 7. Backward compatibility — his six live tombstones

The tombstone shape is unchanged. Old `afterState` objects carry all seven buckets;
the new guard reads only `books` and `artifacts`, which are byte-identical in shape
to what the old code wrote, and the surgical restore reads the same `*Before`
snapshot fields. **The six tombstones already on his device become undoable as soon
as v3.294 loads** — no migration, no re-merge.

## 8. Honest residuals

- The rig has no camera, no real Firestore and no iOS. Sync is proven against
  `mergeRemoteBookDoc` directly with a hand-built stale remote doc, not a live
  round-trip — **persistence across a real device sync is unverified here**;
  Preston's I3 close/reopen check on device is the one that settles it.
- Screenshot capture stalled at deep scroll offsets (scrollY ≈ 6300) and returned
  blank frames; the post-undo visual was taken at 1360 instead, where it shows Books
  1, 3, 4, 5 with #2 correctly absent. All PASS/FAIL evidence in §5 is live-DOM
  structural measurement; screenshots corroborate only.
- Two-plus folded copies in one group (`dropIds.length > 1`) is handled by the same
  code path but was exercised only with single-drop groups plus the same-survivor
  sequence in §6. The red-team traced it as structurally symmetric for N drops;
  neither of us verified it by measurement.
- My first fixture gave every evidence entry a distinct quote, which is not how the
  app writes them, and that is precisely what hid the §9 BLOCK from my own pass. The
  re-run uses the real `addEvidence` path with blank quotes. **Any future proof on
  this surface should build evidence through `addEvidence`, never by hand.**
