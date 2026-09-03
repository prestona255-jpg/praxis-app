# UNDO INDEPENDENCE — Stage 0 recon

Round: LIVE DEFECT, v3.293 → v3.294. Base `3ee464d`, clean tree.
Rig: `.claude/rig/serve.ps1` :8811, uid `d0tester`, SW+caches killed, fixture
seeded fresh 2026-09-03. `js/views.js` 1,229,592 bytes, 0 CR (blob and worktree
both LF — an EOL flip is immaterial here, per the CLAUDE.md floor note).

## 1. The defect, reproduced — not assumed

Fixture shaped like Preston's shelf: **148 books, 6 duplicate pairs**, plus one arc,
one sub-theory, one notebook entry and one theme that each reference a member of
EVERY pair (so a second merge necessarily touches the same collections as the first).

Six merges in sequence, checking every earlier tombstone after each:

| after merge | shelf | undoable | refused |
|---|---|---|---|
| 1 | 147 | #1 | — |
| 2 | 146 | #2 | #1 |
| 3 | 145 | #3 | #1 #2 |
| 4 | 144 | #4 | #1 #2 #3 |
| 5 | 143 | #5 | #1 #2 #3 #4 |
| 6 | **142** | **#6 only** | #1 #2 #3 #4 #5 |

Every refusal reads verbatim: *"your shelf has changed since the merge"*. The shelf
walks 148 → 142, matching Preston's device exactly. **It is a stack. Confirmed.**

## 2. What the fingerprint watched BEFORE

`captureMergeAfterState` (views.js:8348) builds seven buckets; `mergeUndoStaleReason`
(views.js:8365) refuses if ANY differs:

| bucket | what it stored | moved after an unrelated merge? |
|---|---|---|
| `books` | `mergeBookFingerprint` of survivor + each folded id — title, author, isbn, status, finishedAt, rating, dateRead, categoryOverride, traditionOverride, movedMe, valueMarks | **no** |
| `index` | **JSON of the ENTIRE shelf `bookIds` array** | **YES** |
| `arcs` | whole `bookIds` array of every arc referencing either id | **YES** |
| `subs` | whole `evidence` array of every sub-theory citing either id | **YES** |
| `notes` | whole `bookIds` array of every notebook entry referencing either id | **YES** |
| `themes` | whole `bookIds` array of every theme referencing either id | **YES** |
| `artifacts` | the artifact records of survivor + folded ids | **no** |

Measured on the fixture, per tombstone:

```
#1..#5  buckets that moved: index, arcs:arc_shared, subs:sub_shared,
                            notes:note_shared, themes:theme_shared
#6      buckets that moved: (none)
```

**The suspicion in the ruling named `bookIds` only. FIVE of the seven buckets move.**
Removing the `index` check alone would leave the defect standing on any shelf where
duplicates share an arc, a sub-theory, a note or a theme — which is the normal case
and is Preston's case. `books` and `artifacts` are the two that correctly held still.

## 3. Why the guard could not simply be loosened

The restore in `undoBookMerge` writes **whole pre-merge arrays back**:

```js
state.userBooks[uid].bookIds = ts.bookIdsBefore.slice();
for (k in ts.arcsBefore) { ... state.arcs[k].bookIds = mergeCloneValue(ts.arcsBefore[k]); }
```

That is why the guard was written so wide: with a whole-array restore, undoing merge
#1 after merge #2 would roll the shelf and every shared collection back over #2's
applied repoint — six books resurrected, five merges silently reversed. **The guard
and the restore are one mechanism.** Loosening the guard without making the restore
surgical converts a false refusal into real data loss. Both halves change together
or neither does.

## 4. What the fingerprint watches AFTER

Only the two things the ruling names — **the survivor's and the folded record's own
authored state**:

| bucket | kept? | why |
|---|---|---|
| `books` | **KEPT** | the reader's own work on the two records involved: rating, marks, status, and the record's identity (title/author/isbn). A survivor deleted since the merge also lands here — its fingerprint becomes `'null'`. |
| `artifacts` | **KEPT** | the reader's *writing on those two books*, keyed per book (`artifactKey(uid, bookId)`). An unrelated merge can never touch these keys; a second merge onto the SAME survivor can, and should refuse. |
| `index` | **DROPPED** | positional shelf state. Other books moving is not this book's authored state. |
| `arcs` `subs` `notes` `themes` | **DROPPED** | membership of other books. Now handled by a surgical repoint instead of a refusal. |

## 5. Forks

**None reaching Preston.** The ruling resolves the guard's scope and the restore's
shape. Two determinations carried mechanically, both strictly more conservative than
the ruling requires, both stated here for the red-team to attack:

1. **`artifacts` stays in the fingerprint.** A book artifact is the reader's prose ON
   that book, keyed by that book — inside the ruling's "the survivor's or the folded
   record's own authored state", not outside it.
2. **A collection with none of the touched ids present is skipped, not restored.** If
   the reader removed the book from an arc after merging, the Undo does not resurrect
   that membership.

## 6. Non-goals held

`mergeBookDuplicates`, `groupShelfDuplicates`, the surface layout and the covers
section are untouched. The fix needs **no change to the merge write path** — the
tombstone already records everything required (`bookIdsBefore`, `arcsBefore`,
`subsBefore`, `notesBefore`, `themesBefore` are all whole pre-merge arrays, which is
strictly more information than a surgical restore needs). The STOP condition in the
prompt is not triggered.

## 7. Backward compatibility — Preston's six live tombstones

The tombstone shape does not change. Old `afterState` objects carry all seven buckets;
the new guard reads only `.books` and `.artifacts` and ignores the rest. **The six
tombstones already on his device become undoable the moment the new bundle loads** —
no migration, no re-merge.
