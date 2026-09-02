# R-FIRSTSHELF MERGE ROUND — STAGE 0 RECON

STARTED. Base `0f0ff31` / v3.288 / HEAD == origin/main / tracked-dirty 0 / untracked 106.
Rig: localhost:8915, fixture reproducing Preston's three real groups. §9 dispatch CONFIRMED.

## Headline findings

1. **The surface CANNOT SEE Preston's duplicates.** `scanLibraryForCleanup` groups by
   `bookIdentityKey` (title+surname); the census groups pairwise by `bookIdentityTier`.
   Measured on his three real groups: surface **0 groups**, census **3 pairs, all EXACT**.
2. **T8 reproduced on the live function.** Six authored fields destroyed, incl. `valueMarks[0].why`.
3. **I3 already has a working mechanism** (`markBookDeletePending` + `mergeRemoteBookDoc`) — proven.
4. **I2 has NO existing pattern.** No tombstone, no snapshot, no restore anywhere. Must be built.
5. **I2/I3 interaction hazard, measured:** a naively restored record is DELETED by the next sync
   unless the restore also calls `markBookPending`.

## Anchors (all live, no dead anchors)

| anchor | location | note |
|---|---|---|
| `mergeBookDuplicates` | views.js:7758 | **0 callers** (gated v3.284; was 3 at `d2a9e2a`) |
| `scanLibraryForCleanup` | views.js:7716 | 2 callers (7953, 8027) |
| `openLibraryCleanup` | views.js:7945 | 1 caller — Tidy library chip, views.js:4585 |
| `deleteBook` | views.js:7400 | the 7-collection census |
| `bookIdentityTier` | views.js:7654 | exact / probable / near-miss / none |
| `mergeRemoteBookDoc` | integrations.js:775 | honours pending-deletes |
| `markBookDeletePending` | state.js:1140 | the sync tombstone |
| `ensureBookFields` | state.js:387 | the record schema |

Bytes at HEAD: views.js 1,172,809 · state.js 183,808 · integrations.js 155,459 · sw.js 6,041. All blob CR=0.

## HALT — one question: the Undo window and its storage.
