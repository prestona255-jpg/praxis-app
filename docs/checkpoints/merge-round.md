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

---

# REGISTER, ROUTING, LEGIBILITY — v3.292

Reopen of v3.289–v3.291. The merge surface shipped proven and unreviewed by eye; it was
unusable on device before anything could be merged. **§9 NOT run and not needed** — mechanically
confirmed: 0 lines in this diff touch `mergeBookDuplicates`, `undoBookMerge`, the tombstone family,
or `groupShelfDuplicates`. M2 was a label; the grouping was already correct.

## M1 — routing detour: NOT REPRODUCED, ledger stays OPEN

| chip | hash before → after | `renderRoute` fires | panel visible |
|---|---|---|---|
| tidy | `#books` → `#books` | **0** | 656px |
| bulk | `#books` → `#books` | **0** | 302px |
| add | `#books` → `#books` | **0** | 364px |

`renderRoute` was wrapped and counted. The two full-viewport overlays still in the DOM
(`.shelf-manage-backdrop`, `#capScrim`, both z-10020) are `pointer-events:none; opacity:0`, and four
hit-tests inside the panel all land on panel content. After the reveal the nav sits at **top −4,791px**;
the only `#profile` link is hamburger-hidden at 0×0. **No mechanism found. M1 stays OPEN per ruling —
not recorded as closed-by-M8.** Preston re-tests on device; if it recurs it becomes its own item.

## M8 — the scroll lock, and the hoist

`openManageSheet` sets `document.body.style.overflow='hidden'` at mobile. `closeManageSheet` cleared
it — but was **closure-local inside `renderShelf`**, so v3.291's `revealShelfPanel` could only do
`classList.remove('is-open')` and left the lock, the bound Escape handler and `aria-expanded="true"`
behind. Measured on all three chips before the fix: `body.style.overflow` = `hidden`.

Fixed by **hoisting, not copying**: one `closeShelfManageSheet(returnFocus)`. `returnFocus` is FALSE
for the reveal on purpose — focusing an element scrolls it into view, which would undo the reveal.

**Close-path enumeration — every path calls the one function:**

| path | line | call |
|---|---|---|
| Manage button toggle | 4503 | `closeManageSheet()` → 4501 → `closeShelfManageSheet(true)` |
| backdrop tap | 4505 | same |
| close button | 4506 | same |
| Escape key | 4494 | same |
| the reveal | 6231 | `closeShelfManageSheet(false)` |

No path closes this sheet without it.

**Ordering, proven:** the close is synchronous and completes before the scroll, so the scroll never
runs against a locked body. Five conditions × three chips × two viewports, **all pass**:

| chip | overflow empty | aria false | Escape unbound | scrollable | top under sticky head | pixels |
|---|---|---|---|---|---|---|
| tidy 664 / 844 | ✔ / ✔ | ✔ / ✔ | ✔ / ✔ | ✔ / ✔ | 8 / 8 | **656 / 836** |
| bulk 664 / 844 | ✔ / ✔ | ✔ / ✔ | ✔ / ✔ | ✔ / ✔ | 64 / 244 | **302 / 302** |
| add 664 / 844 | ✔ / ✔ | ✔ / ✔ | ✔ / ✔ | ✔ / ✔ | 8 / 182 | **364 / 364** |

## M2 — the number and the noun

`report.duplicates.length` is the GROUP count and was labelled "duplicate records to merge". Fixture
(census three + three scan-test pairs + 20 filler): **"6 groups · 12 records to merge"**. All three
census groups render, alongside Educated / Artificial Intelligence / Marriage a History — so the
grouping was never the problem.

## M3 — contrast, every text element, before and after

| element | before | after |
|---|---|---|
| group title (Cormorant) | **1.19** ✘ | **15.18** ✔ |
| group author | 1.93 ✘ | 6.61 ✔ |
| notes / pick rows | 1.93 ✘ | 6.61 ✔ |
| stat label | 1.93 ✘ | 6.61 ✔ |
| stat number | 3.51 ✘ | 5.59 ✔ |
| cover placeholder title / label | 1.93 ✘ | 6.61 ✔ |
| duplicate chip | 2.72 ✘ | 13.77 ✔ |
| missing-cover chip | 2.30 ✘ | 6.00 ✔ |
| thumbnail glyph | 2.30 ✘ | 6.00 ✔ |
| button labels (×3) | 3.50 ✘ | **16.72** ✔ |

**26 text elements measured, 0 below 4.5:1, minimum 5.59:1, 0 gradients.** Card bg
`rgb(35,40,56)` → `rgb(246,239,220)` (`--card-2`). Radios `accent-color: --gold-deep` (was iOS blue).

⚠ **A measurement error I made and corrected mid-build:** my first contrast pass read
`background-color` without compositing alpha, so `rgba(36,23,16,.05)` was scored as near-black and
five elements showed false failures (one at "1.00"). Fixed by stacking every translucent layer to an
opaque base before measuring. It also found a *real* one the naive method hid: the cover placeholder
was `--wash-page` over a **dark parent slot**, still 1.95:1 after the rule "won" — alpha over a dark
parent is still dark. Both the slot and the placeholder are now opaque cream.

## M4 — discriminators

Rows now carry a thumbnail, name, and a meta line: `added <date> · ISBN <n>/no ISBN · reading/finished
· has a cover/no cover · carries <what>`.

Fixture differing ONLY in `addedAt` and cover presence:
```
Educated · added 7/21/2023  · ISBN 9780399590504 · reading · no cover   · carries nothing yet
Educated · added 11/14/2023 · ISBN 9780399590504 · reading · has a cover · carries nothing yet
```
Distinguishable. Truly-identical fixture shows: **"These are identical — same title, author, ISBN,
date and content. Either is fine; we will keep the first."**

## M5 — copy and hierarchy

Eyebrow `Shelf · one-time cleanup` → **`Shelf · cleanup`**; "one-time" count **0**. Lead sentence now
opens with merging. Order measured: 6 duplicate groups (0–5) → covers heading (6) → **Resolve all
covers (7)** → cover items (8+). Kept, demoted.

## M6 — copy that is true

"searching…" was `buildSelfHealingCover`'s **static placeholder** for a book with no cover — nothing
was searching. Strings now: **idle "No cover yet."** · **action "Find cover"** · **in-flight "Looking…"**
(unchanged). Occurrences of "searching…": **0**.
**T20 confirmed and NOT touched** — `fetchBookByTitle` (integrations.js:1942) calls `res.json()` with
no `res.ok` check; it has a `.catch` so it cannot hang, and it is not this defect.

## M7 — FAB and Add over the panel

| state | create-door | Add a book |
|---|---|---|
| cleanup panel | `none` ✔ | `none` ✔ |
| bulk panel | `none` ✔ | `none` ✔ |
| add panel | `none` ✔ | `none` ✔ |
| **no panel (control)** | `flex` | `flex` |

## Merge regression — untouched code, proven anyway

I1 both directions (rating 5, `why` prose, 2 notes on the survivor either way) **PASS**.
Undo-across-navigation (merged row listed after reopen, dropped record restored, tombstone consumed)
**PASS**.

## Gates

Parse `PARSE OK` · foundations md5 unchanged · NUL 0 · CR 0 · `views.js` **+6,551**,
`components.css` **+6,976**, `sw.js` **+0** · 7 surfaces render, **0 console errors**, shelf counts ==
data · zero-duplicate panel opens clean ("0 groups · 0 records to merge", overflow empty).

## Appearance judgments — NOT measurements

1. **The primary is a flat `--gold-hi` fill with an `--ink` label** — Preston's ruling, 2026-09-02,
   and it corrected a wrong call of mine. My first cut went DARK on a bad read of "no gradients".
   His ruling was right; its premise needed one correction, measured: `--ink` on the token literally
   named `--gold` is **4.37:1** — better than my 3.50, still under the floor. The reference he named,
   `.shelf-add-primary`, is a GRADIENT whose visible fill is `--gold-hi` (the 40% stop, not the 100%
   stop), and its own label measures **6.20** against that lighter gold. So the flat equivalent of
   "matching .shelf-add-primary" is `--gold-hi`: **7.75:1**. Flat gold, ink label, no gradient, as
   ruled — with the token corrected to the one the ruling was describing.
2. Whether the meta line (`added · ISBN · status · cover · carries`) is the right amount, or too much
   for a phone.
3. Whether "These are identical — either is fine" reassures or reads as the app giving up.
4. Whether the covers section reads as clearly secondary now that it sits below the duplicates.
5. Whether the gold radios read as the app's own control or just as "not blue".
6. **What I could not judge at all:** whether this panel now feels like somewhere you'd trust your
   prose. I can measure that no text is under 4.5:1; I cannot measure whether it reads as Praxis.
