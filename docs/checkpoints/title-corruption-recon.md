# T12 TITLE CORRUPTION — STAGE 0 PRE-FLIGHT (recon, read-only)

Round: R-FIRSTSHELF / T12. Date: 2026-09-01. No code changed in this stage.

## 1. Protocol docs — found / missing

FOUND (by filename):
- `CLAUDE.md` (44,190 b)
- `PROTOCOL.md` (13,402 b)
- `docs/FIX-PROTOCOL.md` (19,013 b) — v1.2, §9 red-team pass at line 269
- `BOARD.md` (36,699 b)
- `docs/studio/sequence.md` (116,417 b)
- `docs/Checklist and Roadmap/BUILD_STATE.md` (33,699 b)
- `docs/design-spec.md` (23,875 b)
- `.claude/agents/` — all 7 agent files present

MISSING: none of the docs named by CLAUDE.md were absent.

`sh tools/ground-truth` → hook gate ARMED (`core.hooksPath = hooks`), FIX-PROTOCOL v1.2,
HEAD 72ed8fb, 7 agents registered.

§9 DISPATCHABILITY: `fix-red-team` frontmatter reads `model: sonnet` (MODEL LAW v2 pin
satisfied). No `deny` rule in `.claude/settings.local.json` or `~/.claude/settings.json`.
The session bar's "unless the user requested it" clause is satisfied by this round's
prompt. Expect it to dispatch.

## 2. Repo state

| item | value |
|---|---|
| HEAD | `72ed8fb` docs(agents-barred) — the bar is conditional |
| origin/main | `72ed8fb` (HEAD == origin/main) |
| stated BASE | `bc32953` — **one commit behind HEAD** |
| CACHE_VERSION | `praxis-v3.285` (`sw.js:10`) |
| tracked-dirty | **0 files** (clean) |
| untracked | 106 entries |
| `js/views.js` | 1,154,085 b working tree == 1,154,085 b blob; blob CR count **0** |
| `sw.js` | blob CR count **0** |

`72ed8fb` is `bc32953` + one docs-only commit (the agents-barred correction). Same code
bytes. Reported per instruction; not treated as a fork.

## 3. EVERY path that creates a book record and writes a title

`genBookId()` (`js/state.js:1314`) is the only book-id minter. Exhaustive census of
assignments into `state.books[<id>]` (`grep -rn "state\.books\[[^]]*\] *="`, 7 hits, 6 of
them creators):

| # | site | trigger | title derived from | batch? | isbn at create |
|---|---|---|---|---|---|
| 1 | `js/views.js:6310` `openShelfEditor` save | Shelf → `＋ Add a book` → Save | the Title `<input>`, trimmed, **verbatim** | no — 1 per click | user-typed |
| 2 | `js/views.js:6714` `processBulkLines` ISBN-form | Bulk add, line parses as ISBN | `''` → backfilled from catalogue `result.title` | **yes** (per-line loop) | the pasted ISBN |
| 3 | `js/views.js:6727` `processBulkLines` **title-form** | Bulk add, line is not an ISBN | the pasted line, trimmed, **verbatim** | **yes** (per-line loop) | `''` → backfilled from `result.isbn` |
| 4 | `js/views.js:7343` `confirmReviewBooks` | review screen → Confirm | catalogue `rs.book.title`; or, on `isNoMatch`, the row's manual title input | **yes** (per-row loop) | catalogue / `result.query.isbn` |
| 5 | `js/views.js:8770` `scanCommitBook` | `#scan` verdict Add · denied/offline ISBN door · `Shelve N` | `spec.title` — the VISION item (`vb.title`) or a picked candidate (`cand.title`) | **yes** via `scanShelve` (9428) | resolver ISBN |
| 6 | `js/intros.js:325` `doShelve` | guided intro journey, first book | the journey's picked title, **verbatim** | no | hard `''`, **never backfilled** |
| 7 | `js/state.js:3370` seed loop | `__praxis_seed__` bootstrap | 5 hardcoded literals | n/a | literal |

Non-creator: `js/integrations.js:836` `state.books[rbid] = remoteBooks[rbid]` — the
Firestore merge. It replays ids minted remotely; it cannot mint a fresh `Date.now()` id.

Title-UPDATE (not create) paths, for completeness:
- `views.js:6362` / `6809` — the post-add resolve backfill. Writes title **only when the
  stored title is `''`**. Cannot overwrite.
- `views.js:8726` `scanEnrichExisting` — fills title only when blank.
- `views.js:10834` `↺ Fix this book` (book detail → Edit panel) — the **only** path that
  overwrites a non-empty title, from the catalogue. Reader-initiated, one book.

## 4. Which paths could produce `"Title by Author"` in the title field?

| path | can it? | from what input |
|---|---|---|
| 1 `openShelfEditor` | **yes** | the reader types `Empire of AI by Karen Hao` into Title |
| 2 bulk ISBN-form | no | title comes from the catalogue |
| 3 bulk **title-form** | **yes** | a pasted line written in prose form |
| 4 `confirmReviewBooks` | **yes, only via `isNoMatch`** | the reader types it into a no-match row |
| 5 `scanCommitBook` | **yes, only if the vision model emits it** in `vb.title` |
| 6 `doShelve` | **yes** | the journey's free-text answer |
| 7 seed | no | literals |

## 5. Existing title normalization / sanitization

**NONE.** Greps run:
- `grep -rn "' by '\|\" by \"" js/*.js` → 8 hits, **all constructors** (display labels at
  `views.js:8666, 14886, 18313, 19841`; Yumi prompt lines at `yumi-brain.js:426, 955,
  1237, 1784`). Zero parsers.
- No `split(/ by /)`, no `indexOf(' by ')`, nothing.

The only normalization that touches a title is the identity family at
`js/views.js:7467-7556` — `bookIdentityKey` → `identityTitleKey` → `resolverNormalize`,
plus `identitySurnameKey` and `isbnKey13`. That family is READ-ONLY: it computes match
keys, it never writes a record. It is the single normalization source named by the
prompt's Stage-2 constraint.

Every creator's only title treatment is `.replace(/^\s+|\s+$/g, '')` (trim) or nothing.

## 6. Dead anchors

None that block the round. Two dead things noted for the record (T3 discipline):

- `openScanReviewEditor` (`views.js:6504`) — `grep -c 'openScanReviewEditor' js/views.js`
  == **1** (the definition). `git log -S 'openScanReviewEditor('` shows 2 commits:
  `47e1f86` (2026-06-11, count 1→2, its caller) and `62b4152` (2026-06-18, count 2→1, the
  caller removed). **Dead since 2026-06-18**, two months before the corruption
  timestamps. It cannot be the writer.
- `openBulkAddEditor(prefillText)` — the sole call site (`views.js:4566`) passes no
  argument, so the prefill branch is dead. Bulk add can only ever be fed by human typing.

## 7. FORENSIC ANCHOR — the timestamps decoded

The six ids decode (`Date.now()` → UTC) to:

| id | title | when (UTC) |
|---|---|---|
| `book_1782217201307_492945` | Empire AI | 2026-06-23 12:20:01 |
| `book_1786888509302_616153` | Sylvia Wynter | 2026-08-16 13:55:09 |
| `book_1786888509304_99629` | Mating in Captivity | 2026-08-16 13:55:09 |
| `book_1787180191747_72341` | Mating in Captivity **by Esther Perel** | 2026-08-19 22:56:31 |
| `book_1787180192487_515348` | Empire of AI **by Karen Hao** | 2026-08-19 22:56:32 |
| `book_1787180192747_705127` | On Being Human as Praxis **by Sylvia Wynter** | 2026-08-19 22:56:32 |

Two facts the prompt's summary did not carry, and both are load-bearing:

**(a) The two clean records are ALSO a batch — 2 ms apart.** `...509302` and `...509304`
were written in the same operation on 2026-08-16.

**(b) The intra-batch SPACING differs by three orders of magnitude.**
- clean batch: 2 ms between records.
- corrupted batch: 740 ms, then 260 ms.

That is a discriminator, because the batch creators differ in exactly one respect —
whether `renderShelf()` runs INSIDE the loop:
- `processBulkLines` (`views.js:6733-6737`): `markBooksDirty(); saveState(); renderShelf();`
  **per entry.** A full shelf repaint at ~190 books between each write ⇒ hundreds of ms.
- `confirmReviewBooks` (`views.js:7352-7356`): `markBooksDirty(); saveState();` per row,
  `renderShelf()` **once after the loop** ⇒ ~ms spacing.
- `scanShelve` (`views.js:9428`): `scanCommitBook` per item, **no render in the loop**
  ⇒ ~ms spacing.

So the corrupted trio's spacing is the signature of a per-entry-render batch, and the
clean pair's 2 ms spacing is the signature of a no-render batch — on the same shelf, so
shelf size is controlled for.

**(c) Deployed code on 2026-08-19:** `git log --since=2026-08-10 --until=2026-08-22` shows
no commit on 08-19. HEAD that day was `93ee9a1` (2026-08-16), **v3.278**.

## 8. THE SHAPE ARGUMENT (stated as INFERENCE; Stage 1 must test it)

Group 2 is the key. Title `"On Being Human as Praxis by Sylvia Wynter"`, author
`"Katherine McKittrick"`. The name after `by` is **not** the record's author. So the title
string was NOT assembled from the record's own author field — it arrived as one string
from a source that did not know the author, and the author was filled in afterwards from
a catalogue that knows the real one (McKittrick edited the Wynter volume).

That is exactly the `processBulkLines` title-form shape:
- `title` = the pasted line, verbatim, and the resolve queue's title branch does not even
  attempt a title backfill (`views.js:6770-6788`; the comment at 6770 reads "never
  backfilled"), so it can never be corrected.
- `author` starts `''` → backfilled from `result.author` ⇒ "Katherine McKittrick".
- `isbn` starts `''` → backfilled from `result.isbn` ⇒ which is **why the census can match
  these EXACT-by-ISBN** against the clean copies.

INFERENCE, not yet proof. Stage 1 must discriminate it from paths 1, 4 and 5 on the
record's own field shape.

## 9. THE ONE QUESTION (Stage 0 gate)

The discriminating evidence lives in the three live records' FULL field shape, and this
machine has no egress to the signed-in app (memory: live-site egress blocked; a headless
browser would be signed out and `state.books` empty).

The fingerprints are clean and non-overlapping:

| field | bulk title-form (#3) | manual add (#1) | review confirm (#4) | scan (#5) |
|---|---|---|---|---|
| `coverCandidates` | **key absent** | **key absent** | present (array) | present (array) |
| `status` | `reading` | reader's radio | `read` (row default) | `will-read` |
| `publisher` / `year` / `description` | `''` / `null` / `''` | same | **populated from catalogue** | `''` / `null` / `''` |
| `genre` | `''` | reader's genre field | `''` | `''` |

`ensureBookFields` (`state.js:387`) stamps `publisher/year/description/pageCount/rating/
dateRead` as `''`/`null` on every record, so their PRESENCE proves nothing — their VALUES
do. `coverCandidates` is NOT stamped by `ensureBookFields`, so its absence is decisive
against #4 and #5.

**Ask:** run this read-only snippet in the console on praxis-reading.netlify.app while
signed in, and paste the output. It writes nothing.

```js
(function(){var ids=['book_1782217201307_492945','book_1787180192487_515348',
'book_1786888509302_616153','book_1787180192747_705127',
'book_1786888509304_99629','book_1787180191747_72341'],o=[],i,b;
for(i=0;i<ids.length;i++){b=state.books[ids[i]];if(!b){o.push(ids[i]+' MISSING');continue;}
o.push(ids[i]+'\n  title='+JSON.stringify(b.title)+'\n  author='+JSON.stringify(b.author)
+'\n  isbn='+JSON.stringify(b.isbn)+'\n  status='+JSON.stringify(b.status)
+'\n  genre='+JSON.stringify(b.genre)+'\n  publisher='+JSON.stringify(b.publisher)
+'\n  year='+JSON.stringify(b.year)+'\n  pageCount='+JSON.stringify(b.pageCount)
+'\n  description.len='+((b.description||'').length)
+'\n  coverUrl='+(b.coverUrl?'set':String(b.coverUrl))
+'\n  hasCoverCandidatesKey='+(b.hasOwnProperty('coverCandidates'))
+'\n  coverCandidates.len='+((b.coverCandidates||[]).length)
+'\n  category='+JSON.stringify(b.category)
+'\n  rawCategories.len='+((b.rawCategories||[]).length)
+'\n  addedAt='+b.addedAt+'\n  tradition='+JSON.stringify(b.tradition));}
console.log(o.join('\n\n'));})();
```

If you would rather not run it, say so and Stage 1 proceeds on the structural evidence
(§7 spacing + §8 shape + §3/§5 exhaustiveness) alone — I will label the identification as
what it is and the HARD STOP will be judged on that basis.

## 10. Stage 0 baselines (for the Stage 3 byte delta)

- `js/views.js` = **1,154,085 bytes** (working tree and `HEAD` blob agree), CR count 0.
- `sw.js` CACHE_VERSION = `praxis-v3.285`, CR count 0.
- `grep -c 'genBookId()'`: views.js **4** · state.js **2** (1 def + 1 call) · intros.js **1**.
