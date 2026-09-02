# R-FIRSTSHELF MERGE ROUND — v3.289 + v3.290

**Base** `0f0ff31` / v3.288 · **Commits** `e477b36` (T8 repair, v3.289) + `f23bfd9` (surface, v3.290)
Data-loss tier, FIX-PROTOCOL §5 path C. §9 authorized, dispatched, **two passes, four BLOCKs, all fixed**.
Rig measurements throughout; nothing live-verified (egress blocked from this box).

## The finding that reshaped the round

`scanLibraryForCleanup` grouped by `bookIdentityKey`; the census sweeps pairwise by `bookIdentityTier`.
Measured on Preston's three real groups:

| | duplicate groups found |
|---|---|
| the SURFACE (`scanLibraryForCleanup`) | **0** |
| the CENSUS (pairwise tier) | **3, all EXACT** |

```
Empire AI                            -> ta:empire ai|hao
Empire of AI by Karen Hao            -> ta:empire of ai by karen hao|hao
```
Identical ISBNs, different keys. **Un-gating the button alone would have shipped a tool that cannot
see the records it exists to merge.** `groupShelfDuplicates()` is now the census's union-find sweep,
in the app; both consume one notion of "duplicate".

## T8 — what the merge destroyed, measured on the live gated function

| field | before (on the dropped record) | after (on the survivor) |
|---|---|---|
| `rating` | 5 | `null` **LOST** |
| `valueMarks` | 1 mark | `[]` **LOST** |
| `movedMe` | true | false **LOST** |
| `categoryOverride` | "Theory" | "" **LOST** |
| `traditionOverride` | "critical" | `null` **LOST** |
| `dateRead` | set | `null` **LOST** |
| notebook entries | nb1, nb2 | **repointed ✔** |

Destroyed prose, verbatim: *"This book changed how I read everything after it."*
Collection parity was already complete — all 7 of `deleteBook`'s id-keyed collections were repointed.
The hole was the record's own scalars, which no collection sweep touches.

## Proof table (all on final bytes)

| # | proof | result |
|---|---|---|
| 1 | I1, both merge directions, Group 1 fixture | **PASS** — rating 5, prose, 2 notes on the survivor either way |
| 2 | both records carry a rating | **PASS** — survivor 3 wins, loser's 5 in the tombstone, both marks kept |
| 3 | merge → Undo → direct inspection | **PASS** — both records, index and note arrays byte-identical |
| 4 | restored record survives sync | **PASS** — remote lists it, and remote omits it |
| 5 | surface: both choices, preview, Undo | **PASS** — driven from the real Tidy chip |
| 6 | near-miss weaker affordance | **PASS** — no Merge control until "These are the same book" |
| 7 | "Resolve all" merge callers | **0** — `mergeBookDuplicates(` count 2 = 1 def + 1 deliberate caller |
| 11 | window 29d / 30d / 31d, backward clock, absent + garbage timestamp | **PASS**, prune drops only the expired one |
| 12 | three merges, Undo the middle | **PASS** — groups 1 and 3 untouched, 2 tombstones left |
| 13 | surface groups == census groups | **PASS** — `IDENTICAL: true` |
| 14 | "held" in user-visible copy | **0** (one comment records its removal) |

## §9 red-team — two passes

**Pass 1 — 2 BLOCK, 1 CONCERN, 2 NOTE.**
- **BLOCK** the 30-day Undo was reachable only inside the render that created it: `lastTombstone` is a
  closure variable, and a merged pair stops appearing among the duplicates, so reopening the panel made
  the copy's promise unkeepable. → a "Recently merged" section built from storage, independent of the
  group closures. Proven to survive navigating away and back, and to actually undo from there.
- **BLOCK** Undo did a blind whole-array restore, so "merge A, merge B, undo A" would destroy B's
  repoint wherever they share an arc/sub/note/theme, and any post-merge edit to the survivor. →
  tombstones record an `afterState` fingerprint; Undo **refuses** rather than overwrite, and names what
  moved. Proven: cross-group undo refused, arc unchanged, B's repoint intact.
- **CONCERN** `mergeCloneValue` degraded to returning the **live object** on failure, which would have
  aliased the tombstone to the record about to be mutated. → both helpers now throw; the merge wraps
  the snapshot and aborts before touching anything, and the surface says nothing was changed.

**Pass 2 — 2 BLOCK, 2 CONCERN.**
- **BLOCK** the fingerprint excluded `isbn` as catalogue backfill, but it has a text field the reader
  types into (`views.js:11753`) — a typed ISBN correction would have been silently reverted by Undo.
  → `isbn` added. Proven: typed ISBN blocks the Undo; machine backfill does not.
- **BLOCK** no `CACHE_VERSION` bump for the second layer. → v3.289 → **v3.290**.
- **CONCERN** a write-phase `mergeCloneValue` outside the snapshot guard — safe today by an invariant
  now documented at the line. **Logged as R-MERGE-1.**
- **CONCERN** collections compared whole, so Undo refuses more often than a book-scoped diff would
  require. The conservative direction; named, not accidental.

## A defect my own proof caught

Comparing whole records made **every** Undo unreachable after one navigation — the shelf classifier
writes `category` (`''` → `'Uncategorized'`) on render, and the guard read that as reader divergence.
The fingerprint now watches authored + structural state only (title, author, isbn, status, finishedAt,
rating, dateRead, categoryOverride, traditionOverride, movedMe, valueMarks) and never derived caches.

## Overstory (T23) — designed for all three, as instructed

I cannot read Preston's device; the census answers it after push. What the code does:

| case | tier | behaviour |
|---|---|---|
| same ISBN | **exact** | groups, merge-eligible |
| no ISBN, same title+author | **probable** | groups, merge-eligible |
| one split, one not, no ISBN | **none** | appears nowhere — by hand |

## Gates

Parse `PARSE OK` · foundations md5 unchanged · **NUL 0** · committed blob **CR = 0** on all three ·
bytes vs base: `views.js` **+36,432**, `components.css` **+753**, `sw.js` **+0** · ES3 clean (grep hits
are comments) · 7 surfaces render, **0 console errors**, shelf counts == data.

⚠ A literal **NUL byte** was introduced mid-build by a dedup separator written as a raw control
character — it made `grep` treat views.js as binary and broke the parse gate. Caught, stripped,
replaced with a JSON key. `NUL 0` is now a standing check in this round's gate list.

## Appearance judgments — NOT measurements

1. Whether the survivor rows read as a clear choice rather than a form.
2. Whether "carries 2 notes · 1 value mark · a rating" is the right amount of detail.
3. Whether "Recently merged — undoable for 30 days" belongs at the bottom of the panel.
4. Whether the refusal copy ("Undo is no longer safe here — …") reassures or alarms.
5. Whether the near-miss section reads as clearly weaker than the duplicate groups.

## ⭐ The closing gate is NOT mine

After push, Preston merges his real groups on device, re-runs
`docs/checkpoints/firstshelf-dupes-census.js`, and it must return **zero EXACT and zero PROBABLE
groups**; then Empire of AI must show **2 notebook entries and rating 5**. **My rig cannot clear this
gate** — it has fixtures, not his library, and no egress to the deploy.

---

# REVEAL FIX — v3.291 (live defect on v3.290)

**Reported:** tapping "Tidy library" on iPhone did nothing visible. **Reveal-only; no merge logic
touched, no write path touched.** §9 not required (ruled).

## The mechanism, measured — not a dead control

`openLibraryCleanup` ran, mounted its panel, and returned. The panel was never on screen.
At 390×664, real chip, real sheet:

| | 6 books | 136 books |
|---|---|---|
| panel mounted | true | true |
| panel top | **1146px** | **4408px** |
| **pixels visible** | **0.0** | **0.0** |
| page scrolled by the tap | no | no |
| Manage sheet still open | yes | yes |
| `elementFromPoint` at the panel | `.shelf-manage-backdrop` | `.shelf-manage-backdrop` |

`#shelf-editor-host` sits at the END of the shelf's content column (views.js ~4690), below the whole
bookcase. Not library-size dependent and not platform-specific — off-screen at 6 books too.

**Why the siblings looked fine:** `openShelfEditor` and `openBulkAddEditor` each end with an input
`.focus()`, and iOS scrolls a focused input into view. Incidental, not a decision. Measured:

| function | `focus()` | `scrollIntoView()` |
|---|---|---|
| `openShelfEditor` | 1 | 0 |
| `openBulkAddEditor` | 1 | 0 |
| `openLibraryCleanup` | **0** | **0** |

## The fix

`revealShelfPanel(panelEl)` — shared by all three chips. Closes the Manage sheet (a launcher that
stays open over its target is a control that looks live and isn't), then scrolls the **panel's own
top** to just under the sticky head (`.shelf-head` is `position:sticky; top:0; z-40` at mobile and
would otherwise cover whatever we scrolled to). Called on the cleanup panel's FIRST render only —
`render()` re-runs after every merge and undo, and re-scrolling would throw away the reader's place.

## Proof — the rect this round was missing

12 cells: 3 chips × {6, 136} books × {390×664, 390×844}.

| chip | vp | books | panel top | **pixels visible** | sheet closed | `elementFromPoint` |
|---|---|---|---|---|---|---|
| tidy | 664 | 6 / 136 | 8 / 8 | **656 / 656** | yes | `.library-cleanup` |
| bulk | 664 | 6 / 136 | 64 / 64 | **302 / 302** | yes | `.shelf-bulk-editor` |
| add | 664 | 6 / 136 | 8 / 8 | **364 / 364** | yes | `.shelf-editor` |
| tidy | 844 | 6 / 136 | 8 / 8 | **836 / 836** | yes | `.library-cleanup` |
| bulk | 844 | 6 / 136 | 244 / 244 | **302 / 302** | yes | `.shelf-bulk-editor` |
| add | 844 | 6 / 136 | 182 / 182 | **364 / 364** | yes | `.shelf-editor` |

**Focus unchanged** on the two editors — `TEXTAREA` / `INPUT` focused, inside the panel, in all cells.

**Unmount:** mounted before leaving → absent while away → absent on return, host present and empty.
Mechanism: `renderShelf()` clears `#app` (views.js:4308) and rebuilds a fresh empty
`#shelf-editor-host`; the panel has no persistence of its own.

**No merge regression on final bytes:** I1 both directions (rating 5, `why` prose, 2 notes on the
survivor either way) and the Undo-across-navigation proof (merged row listed after reopen, Undo
restores the dropped record) both PASS.

## Root cause, and what was NOT done

The host's position at the end of the content column is the root cause. Moving it would fix this at
the source and would also fix the four other panels that mount there. **Not done in this round** —
reveal-in-place is the bounded change. **Logged as a candidate: T28.**

## Standing rule added

CLAUDE.md **line 187**, under `## Verification — non-negotiable` (section opens line 153) — beside
T3, **outside `## Lessons`**, which is the only section `tools/studio-build` reads (`awk
/^## Lessons/{f=1} /^## /{f=0}`, line 610); studio-build reads CLAUDE.md and never writes it.

## Pre-existing defect, logged

`openLibraryCleanup` never revealed itself — dormant while merge was held (the panel had nothing
actionable), live the moment the panel became a destination.
