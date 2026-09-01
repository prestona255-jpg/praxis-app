# T12 TITLE CORRUPTION — BUILD + PROOF

Round: R-FIRSTSHELF / T12. Date: 2026-09-01. Base: `72ed8fb` (= `bc32953` + one
docs-only commit). Recon: `docs/checkpoints/title-corruption-recon.md`.
Status: **SHIPPED → v3.286.** R1 ruled ACCEPTED by Preston 2026-09-01 (retirement
condition: T21). The catalogue-backfill alternative was evaluated and declined for
this round — see R1 and T21.

---

## STAGE 1 — THE WRITER, IDENTIFIED

**`processBulkLines`' TITLE-FORM branch — `js/views.js:6635`, reached from the Shelf's
`Bulk add` chip.** Not inferred from plausibility; six independent lines of evidence,
four of them eliminations run against the bytes that were actually deployed on the day.

### 1.1 The mechanism (this is the finding)

`fetchBookByTitle` builds its query as **`'intitle:' + title`** — `js/integrations.js:1937`:

```js
var q = 'intitle:' + title;
```

So a pasted line `On Being Human as Praxis by Sylvia Wynter` was sent to Google Books
as `intitle:On Being Human as Praxis by Sylvia Wynter`. GB's `intitle:` is a loose
match, so it **still returned the right volume** — and the callback backfilled the
correct ISBN and the correct author onto a record whose title stayed wrong:

- `js/views.js:6738` — `title: entry.value` (the pasted line, verbatim)
- `js/views.js:6780-6788` — `isbn` written only when `isbn === ''` → filled
- `js/views.js:6789-6795` — `author` written only when `author === ''` → filled
- the title-form branch **never attempts a title backfill at all**; the comment at
  `views.js:6770` says so in as many words ("never backfilled")

That is why the corrupted records carry a **valid ISBN** and can match their clean
twins at the EXACT tier. The record looked healthy in every field but the one.

### 1.2 The elimination, against the DEPLOYED bytes

The three ids decode to **2026-08-19 22:56:31–32 UTC**. `git log --since=2026-08-10
--until=2026-08-22` shows no commit on 08-19; HEAD that day was `93ee9a1` — **v3.278**.
All four checks below were run against `git show 93ee9a1:js/views.js`, not against HEAD.

| path | verdict | evidence |
|---|---|---|
| `scanCommitBook` | **RULED OUT** | at v3.278 all three call sites pass `status: 'will-read'` (v3.278 lines 8528, 8655, 9048). All six live records are `reading`/`read`. Never `will-read`. |
| `confirmReviewBooks` | **RULED OUT ×3** | (a) writes `coverCandidates` unconditionally since `e54a8f8` 2026-06-18, before both batches — v3.278 line 7342; live records have `hasCoverCandidatesKey=false`. (b) writes `publisher/year/pageCount/description` from the catalogue at create (v3.278 7343-7344); all six live records have those empty. (c) row default `status: 'read'` (v3.278 line 7116). |
| `intros.js doShelve` | **RULED OUT** | writes `isbn: ''` and runs **no lookup at all** — `js/intros.js:325`. It can never acquire an ISBN. All three corrupted records have one. Also onboarding-gated. |
| `openShelfEditor` | **RULED OUT** | one record per Save click, and the editor closes on save. Three records at 740 ms and 260 ms apart would be three full reopen-type-save cycles inside one second. Also contradicts the shape: a hand-typed `by Sylvia Wynter` cannot coexist with a hand-typed author `Katherine McKittrick`. |

Remaining: `processBulkLines` title-form. Positive confirmation, field by field, against
the live dump:

| live field | value | written by |
|---|---|---|
| `status` | `"reading"` | hardcoded, `views.js:6735` |
| `genre` | `""` | hardcoded, `views.js:6737` |
| `hasCoverCandidatesKey` | `false` | the path never writes the key; `ensureBookFields` does not stamp it (`state.js:387-427`) |
| `publisher`/`year`/`pageCount`/`description` | `""`/`null`/`null`/`""` | the bulk resolve queue backfills **only** `isbn` + `author` — never these |
| `isbn`, `author` | correct | backfilled from the loose `intitle:` lookup (§1.1) |
| `title` | the pasted line, verbatim | `views.js:6738`, never backfilled |

### 1.3 Two facts the round brief did not carry

**(a) The "clean" records are also a batch — 2 ms apart** (`…509302` / `…509304`,
2026-08-16 13:55:09). **(b) That batch is a different writer.** At **v3.277**
(`02d1ef1`, the bytes deployed until 2026-08-16), `scanCommitBook` wrote
`status: 'reading'` and **no `coverCandidates` key** — both call sites pass
`status: 'reading'` (v3.277 lines 8652, 9018). That matches the clean pair exactly,
including the shape of its data: a truncated spine title (`"Sylvia Wynter"`) and a
cover-derived author string (`"Katherine McKittrick, editor"` — what is printed on the
physical book, and *not* what Google Books returns, since `fetchBookByTitle` takes
`v.authors[0]`, `integrations.js:1960`).

The 2 ms vs 740 ms spacing corroborates: `processBulkLines` calls `renderShelf()`
**inside** its write loop (`views.js:6749`); `scanShelve` and `confirmReviewBooks` call
it once after. Spacing is a *corroborating* signal, not the identification — shelf size
also moves it. The identification rests on §1.1 + §1.2.

### 1.4 Correction to the Stage-0 recon

Recon §9 offered `coverCandidates` absence as a discriminator against **both**
`confirmReviewBooks` and `scanCommitBook`. That was **half wrong**, and Preston caught
it before it was relied on. `scanCommitBook` only gained the key on **2026-08-23**
(`2fef2f1`, v3.279) — *after* both batches — so its absence says nothing about the scan
path. It remains valid against `confirmReviewBooks` (key present since 2026-06-18).
The scan path is ruled out on `status`, not on `coverCandidates`.

### 1.5 The one thing NOT proven

That a human pasted three prose lines (as opposed to some other feed into the same
function). `processBulkLines` has three call sites: `views.js:6481` (the Bulk add
Submit, live), `views.js:6599` (`openScanReviewEditor` — **dead**, `grep -c` == 1 and
`git log -S` shows its only caller removed by `62b4152`, 2026-06-18), and
`yumi-ui.js:843` (`finishOnboarding` — gated on `bookIds.length !== 0`,
`yumi-ui.js:865`; the red-team notes it is in practice unreachable, since
`yumi-ui.js:869-876` hands off to `Intros.startJourney`, which `intros.js:673/681`
exports unconditionally). So the Bulk add textarea is the only live door. Labelled as
inference.

---

## STAGE 2 — THE FIX

Three edits, one new function. `js/views.js` only, plus the `sw.js` bump.

1. **`splitTitleByline(raw)` — `js/views.js:7532`**, seated immediately after
   `bookIdentityKey`, the file's single normalization home. Returns `{title, author}`.
   Splits on the LAST `/\s+by\s+/i` and only when five rules all hold (title side
   ≥ 2 words · byline 2-4 tokens · no digit · no `:` · byline does not open with an
   article/determiner). Otherwise returns the line unchanged.
2. **`processBulkLines` title-form branch (~6687)** calls it; the entry carries
   `byline`. The **dedup key deliberately stays on the RAW line** (see §4 residual R2).
3. **The title-form resolve callback — `js/views.js:6811`** writes the parsed byline to
   `author` **only when the catalogue ANSWERED and that answer carried no author**
   (`author === '' && result &&`). The catalogue always wins, and a failed lookup
   writes nothing at all — see residual R4.

### Why the parsed byline can never outrank the catalogue

Census group 2 is the proof: `"On Being Human as Praxis by Sylvia Wynter"` names the
**subject**, not the author. Wynter is who the book is *about*; McKittrick edited it.
A design that wrote the parsed byline into `author` at create would have blocked the
correct catalogue author and made that record **worse**. The fallback ordering is not
a stylistic choice — the data ruled it.

### What was NOT done, deliberately

- **No catalogue-title preference.** The prompt's constraint ("prefer an authoritative
  catalogue title") does not bind here: this path has no catalogue title at write time,
  and enabling one would rewrite *every* bulk-added title from a fuzzy `intitle:` match.
  That is a behavior change with real regression risk, not this fix.
- **No fix to `openShelfEditor`.** A reader typing `"X by Y"` into the manual Title
  field hits the same class through a different door. Stage 1 identified one writer;
  widening is Preston's call. Logged as **T19**.
- **No repair of the three existing records** (round non-goal). Logged as **T17**.

---

## STAGE 3 — PROOF

### 3.1 Parse gate

```
cscript //nologo //E:jscript tools/parse-check js/views.js
PARSE OK: js/views.js
```

### 3.2 Behavioural harness — REAL EXECUTION, not reasoning

`splitTitleByline` is **extracted verbatim from the shipped file** (1,100 bytes, located
by string search, never retyped) and `eval`'d under `cscript //E:jscript` (ES3). The
surrounding record model cites its sources line by line. Harness:
`<scratchpad>/t12-harness.js`.

**Base bytes** (`git show HEAD:js/views.js`) — the harness finds no `splitTitleByline`
and falls back to identity, reproducing the corruption:

```
=== TEST SET 4 -- REPRO of the census record shape (base bytes) ===
  pasted: "Mating in Captivity by Esther Perel"
    title="Mating in Captivity by Esther Perel"  author="Esther Perel"
    isbn="9780060753641"  status="reading"  genre=""  hasCoverCandidatesKey=false
  pasted: "Empire of AI by Karen Hao"
    title="Empire of AI by Karen Hao"  author="Karen Hao"
    isbn="9780593657522"  status="reading"  genre=""  hasCoverCandidatesKey=false
  pasted: "On Being Human as Praxis by Sylvia Wynter"
    title="On Being Human as Praxis by Sylvia Wynter"  author="Katherine McKittrick"
    isbn="9780822375852"  status="reading"  genre=""  hasCoverCandidatesKey=false
```

Every field matches the live console dump for all three records, including the
`author` ≠ byline case. **The corruption reproduces on base bytes.**

**Fixed bytes** — same input, same modelled catalogue answers:

```
    title="Mating in Captivity"       author="Esther Perel"         isbn="9780060753641"
    title="Empire of AI"              author="Karen Hao"            isbn="9780593657522"
    title="On Being Human as Praxis"  author="Katherine McKittrick" isbn="9780822375852"
```

### 3.3 Titles legitimately containing "by" — the test set, all PASS unchanged

31 lines, each asserted byte-identical after the splitter:

Death by Black Hole · Bird by Bird · Side by Side · Step by Step · Ruled by Secrecy ·
Divided by Faith · Wounded by School · Saved by the Light · Blinded by the Right ·
Surrounded by Idiots · Learning by Doing · Fooled by Randomness · Betrayed by Nature:
The War on Cancer · Consumed by Hate, Redeemed by Love · Divided by a Common Language ·
By the Sea · Undone by the Ordinary · Poisoned by Gaslight · Nudge · Empire of AI ·
**The Cottage by the Sea · The House by the Cerulean Sea · The Girl by the Lake · The
Cabin by the Lake · A Cottage by the Sea · The Summer House by the Sea · The Little Shop
by the Harbour · Christmas at the Cottage by the Sea · The House by the Loch · Murder by
the Book · The Bookshop by the Shore** (the bolded eleven are the locative class the
red-team found; rule 5 was added for them).

### 3.4 Lines that MUST split — all PASS

| input | title | byline |
|---|---|---|
| Mating in Captivity by Esther Perel | Mating in Captivity | Esther Perel |
| Empire of AI by Karen Hao | Empire of AI | Karen Hao |
| On Being Human as Praxis by Sylvia Wynter | On Being Human as Praxis | Sylvia Wynter |
| Fooled by Randomness **by** Nassim Nicholas Taleb | Fooled by Randomness | Nassim Nicholas Taleb |
| The Life-Changing Magic of Tidying Up by Marie Kondo | The Life-Changing Magic of Tidying Up | Marie Kondo |
| All About Love by bell hooks | All About Love | bell hooks |
| Pedagogy of the Oppressed by Paulo Freire | Pedagogy of the Oppressed | Paulo Freire |
| The Left Hand of Darkness by Ursula K. Le Guin | The Left Hand of Darkness | Ursula K. Le Guin |
| Empire of AI␠␠BY␠␠Karen Hao | Empire of AI | Karen Hao |
| Mating in Captivity by Esther Perel**.** | Mating in Captivity | Esther Perel |
| The Second Sex by de Beauvoir | The Second Sex | de Beauvoir |
| The Starry Night by van Gogh | The Starry Night | van Gogh |

The last two prove rule 5 blocks articles without blocking **name particles**.

### 3.5 Catalogue-authoritative author is preferred — all PASS

```
PASS  catalogue wins (NOT the parsed "Sylvia Wynter")            got = Katherine McKittrick
PASS  lookup FAILED (429/outage/zero) -> author stays empty       got = ""   (base parity)
PASS  lookup FAILED -> title is still the CLEANED one             got = On Being Human as Praxis
PASS  lookup returns no author -> byline fallback lands           got = Sylvia Wynter
```

Row 2 is residual R4's proof: on a catalogue failure the record keeps the **cleaned
title** (the fix's whole point) while the author stays blank rather than taking an
unvalidated guess.

`ALL CHECKS PASS` — 0 failures across all five test sets.

### 3.6 T3 — the call chain from a real gesture

| # | link | file:line |
|---|---|---|
| 1 | `renderShelf()` builds `wrap`, appends to `#app` | views.js:4305, 4326 |
| 2 | `manageSheet` → `manageBody`; `manageEntry` → `controls` → `header` → `wrap` | views.js:4458-4481, 4588 |
| 3 | `bulkBtn` (`.chip.shelf-new-book-bulk`, "Bulk add") appended to `manageBody`; click → `openBulkAddEditor()` | views.js:4562-4567 |
| 4 | `editorHost.id = 'shelf-editor-host'` appended to `inner` → `wrap` (so the getElementById resolves) | views.js:4689-4696 |
| 5 | `openBulkAddEditor` mounts the textarea + Submit into that host | views.js:6448-6470 |
| 6 | Submit click → `processBulkLines(textarea.value)` | views.js:6481 |
| 7 | non-ISBN line → **`splitTitleByline(line)`** | views.js:6687 |

`grep -c 'splitTitleByline' js/views.js` == **3** = 1 definition + 1 call + 1 comment
mention. Not a zero-caller function.

### 3.7 Byte deltas, greps, EOL

| measure | value |
|---|---|
| `js/views.js` base | **1,154,085** b (`git show HEAD:js/views.js \| wc -c`) |
| `js/views.js` after | **1,159,714** b (`wc -c`) |
| delta | **+5,629** b |
| added lines (views.js) | **87** (`git diff --numstat js/views.js` = 87 added / 2 deleted) = **57 comment** + 1 blank + **29 code** |
| diffstat | `js/views.js \| 89 ++…--`, `sw.js \| 2 +-` · 2 files, 88 insertions, 3 deletions |
| blob CR (base) | 0 · worktree CR: 0 → no EOL flip |
| `sw.js` | `praxis-v3.285` → `praxis-v3.286` (read current, +1) |

Greps: `entry.byline` = 1 · `item.byline` = 2 · `bookIdentityKey(line, '')` = 1 ·
`bookIdentityKey(parsed.title` = **0** (reverted, see R2).

### 3.8 §9 red-team — run, and it BLOCKED

`fix-red-team` (Sonnet-pinned) dispatched under this round's explicit authorization.
It returned **2 BLOCK + 1 CONCERN**, all three acted on:

| # | finding | disposition |
|---|---|---|
| 1 | BLOCK — no Stage-1/2/3 proof artifact existed; only the recon | **FIXED** — this file |
| 2 | BLOCK — the heuristic corrupted real titles: `The Cottage by the Sea` → `The Cottage` (locative "by") | **FIXED** — rule 5, the article/determiner guard; 11 locative cases added to the test set; particles proven unaffected |
| 3 | CONCERN — keying the paste-dedup on `parsed.title` could silently DROP a line that previously got a record (dupe-prevention change, HELD round) | **FIXED** — the dedup key reverted to the RAW line; the diff is now title-only |
| 6 | Nit — the header claimed a non-empty title but returns `''` for empty input | **FIXED** — contract corrected |
| 10 | Info — `finishOnboarding` is effectively dead, not merely gated | **CARRIED** into §1.5 |
| 4,5,7,8,9,11,12,13 | OK — ES3, no `lastIndex` leak, ISBN branch untouched, fallback ordering, dead-caller claim, scope, sw bump, byte delta | acknowledged |

**Second pass**, run on the revised diff because all three findings changed code.
Verdict: **no BLOCKs.** It re-derived every load-bearing number independently (byte
delta, grep counts, the v3.277/v3.278 archaeology, the T3 chain), built its **own**
adversarial harness rather than trusting mine, and confirmed the base-bytes run
genuinely reproduces the live dump byte for byte. Four new findings:

| # | finding | disposition |
|---|---|---|
| 1 | CONCERN — the byline fallback fires on a FAILED lookup, and `fetchBookByTitle` has the T13/T14 `res.ok` gap with GB quota at 0 → a 429 would durably write "Sylvia Wynter" as the author | **FIXED IN CODE** — `result &&` added to the guard; residual **R4**, underlying gap logged **T20** |
| 2 | Nit — R1's "narrow" framing undersold the false-positive class (`Loch Ness`, `New York Times`) | **FIXED** — R1 rewritten, class stated broadly and named a regression class |
| 3 | Nit — the added-line table was off by one | **FIXED** — 87 = 57 comment + 1 blank + 29 code, re-measured |
| 4 | Nit — `integrations.js:1957` should be `:1960` | **FIXED** |

---

## STAGE 4 — RESIDUALS, HONEST

- **R1 — ACCEPTED KNOWN RESIDUAL. RULED by Preston 2026-09-01. Do not re-litigate.**
  **Retirement condition: T21 landing.** Until then this is a closed ruling, not an
  open question. The non-authorial-byline residual: rule 5 stops the
  article-led locative (`by the Sea`), but **any** 2-4 token phrase that is capitalized,
  digit-free, colon-free and not article-led still reads as a name. Red-team pass 2
  found the class is broader than the one example first given: `The Cottage by Lake
  Michigan`, `The Lighthouse by Loch Ness`, `A History of Violence by New York Times`
  all split wrongly. Stated plainly: this is a genuine **regression class**, not merely
  a missed improvement — those lines are stored *correctly* today and would be stored
  *wrongly* after this fix. It is bounded by the ≥2-word-title rule and by needing a
  name-shaped object, and the reader's repair is book-detail → `↺ Fix this book`
  (views.js ~10870), which re-resolves title+author from the catalogue.
  **Why it was accepted rather than fixed** (the T21 evaluation, 2026-09-01): the
  catalogue-arbitrated alternative is the right eventual shape, but it could not be
  verified from this machine — GB direct returns 429 (keyless quota 0), curl to
  Netlify returns 000, and Browser-pane navigation to the live site was denied. Every
  closeness figure in that evaluation is arithmetic over Google Books title strings
  **never actually observed**, and shipping on that is the claims-outliving-code
  failure this program exists to catch. Secondarily, the cure's risk surface is
  *broader* than R1's: `titleCloseness` hard-codes 0.85 for containment in either
  direction (`integrations.js:2081`), so any stored title that is a substring of a
  longer volume can be renamed — common, mostly benign, occasionally a genuine
  wrong-book rename. Narrow-known traded for broad-unmeasured is a bad trade until it
  can be measured. See **T21**.
- **R4 — the byline fallback is gated on a catalogue ANSWER, after red-team pass 2.**
  As first built, the fallback fired whenever `author === ''` — which includes a FAILED
  lookup. `fetchBookByTitle` has no `res.ok` check (`integrations.js:1946-1952`), the
  same defect class T13/T14 fixed in `googleBooksSearch` but did not extend here, and
  keyless GB quota is 0. So a 429 would have silently written the parsed byline —
  meaning `"On Being Human as Praxis by Sylvia Wynter"` would have durably recorded
  **Sylvia Wynter** as the author. That is this round's own bug in miniature. The guard
  is now `author === '' && result &&`: a failed lookup leaves the author blank (exact
  base-bytes parity), and the byline lands only when the catalogue answered with a
  volume that genuinely carried no author. Proven by test set 5.
  **The underlying `res.ok` gap in `fetchBookByTitle` is NOT fixed here** — it belongs
  to the T13/T14 family, in `integrations.js`, and is logged as **T20**.
- **R2 — duplicate prevention is untouched by design.** This fix does NOT stop a
  re-paste from creating a second record; it only stops the title being wrong. The
  dedup key stays on the raw line precisely so no duplicate-prevention semantics move
  under the HELD merge round.
- **R3 — one-word titles are not split** (`Sapiens by Yuval Noah Harari`). Safe miss,
  identical to today's behavior, and the price of saving `Death by Black Hole`.
- **UNVERIFIED — nothing is live-verified.** Not committed, not pushed; the fix has not
  run in a browser. The evidence above is parse + real ES3 execution of the shipped
  function + source tracing. Live smoke belongs after Preston's push.

## LOG

- **T17.** Three corrupted titles remain on the live shelf; **not repaired here**. They
  need the HELD merge round's per-group survivor choice. Note group 2 inverts the naive
  rule: the corrupted record carries the *more accurate* title (`On Being Human as
  Praxis` vs `Sylvia Wynter`), so "keep the clean-titled record" is unsafe as a default.
- **T18.** Draft bar collides with the "fill the frame with one row of spines" prompt,
  pushing it into the bracket area, half-legible. Introduced v3.285. Render round.
- **T21 (new) — bulk title path adopts `resolveBook`. Retires R1.**
  **⭐ THE LOAD-BEARING INSIGHT IS THE ORDERING: QUERY THE RAW LINE, STORE THE SPLIT
  TITLE.** This is not an implementation detail and it must not be optimized away. A
  round that queries the *split* title instead will have Google Books **confirm its own
  wrong split** — `The Cottage by Lake Michigan` splits to `The Cottage`, and
  `intitle:The Cottage` happily returns a volume called `The Cottage`, closeness 1.0,
  strong. The catalogue can only correct a bad split if it was asked the *original*
  question. Query-raw is what puts rule 5 off the critical path; query-split puts it
  straight back on.
  Scope: query the RAW pasted line through `resolveBook({kind:'title'})`
  (`integrations.js:2414`) instead of `fetchBookByTitle`; store the split title; backfill
  title/author/isbn/cover ONLY on `status === 'strong' && !lookupFailed`; add a
  **minimum-token floor** on the stored title before `titleCloseness`'s containment
  clause (`integrations.js:2081`) may drive a title write — without it, `Beloved` →
  `Beloved Dog` scores 0.85 and silently renames the book. Retires **R1** and **R3**,
  demotes rule 5 to belt-and-braces, and moves this caller off `fetchBookByTitle`
  (retiring **T20** for it). Sizing: ~30-60 code lines in `views.js`, no new
  infrastructure — but `fetchAndApplyCoverByTitle` is SHARED with the cover sweep
  (`views.js:6155`) and the single-add path (`views.js:6393`), so it needs a separate
  call path, not an edit in place; `resolveBook` is also sequential-with-backoff
  (slower per item) and returns `coverCandidates`, which would newly appear on bulk
  records. **GATE: live-verified against real Google Books responses. It cannot be
  validated from this machine.**
  Evidence that split-then-backfill is the right shape, not backfill alone — with
  provenance stated: **Preston's own knowledge, 2026-09-01, corroboration NOT
  verification** (no live query was possible). All three books carry subtitles —
  `Empire of AI: Dreams and Nightmares in Sam Altman's OpenAI` · `Mating in Captivity:
  Unlocking Erotic Intelligence` · `Sylvia Wynter: On Being Human as Praxis`. Against
  the RAW corrupted line, `titleCloseness("empire of ai by karen hao", <subtitled>)` =
  3/11 = **0.27** → `weak` → **backfill-alone would have failed groups 1 and 3**, as the
  evaluation's 0.27 row predicted. Against the SPLIT title, all three reach 0.85 via the
  containment clause regardless of subtitle. The splitter is what makes the confidence
  test deterministic.
- **T20 (new).** `fetchBookByTitle` (`js/integrations.js:1938-1952`) never checks
  `res.ok` before `res.json()`, so a Google Books 429/5xx is indistinguishable from a
  zero-result query — byte-identical to the T13/T14 defect, which was fixed only in
  `googleBooksSearch`. Every title-form bulk add and every cover-by-title backfill runs
  through it. Not fixed here (wrong file, wrong round); R4 defends against it locally.
- **T19 (new).** `openShelfEditor`'s manual Title field accepts `"X by Y"` verbatim
  through the same class of input, with no normalization. Same door, different room.
  Out of this round's identified scope — Preston's call whether to extend rule 5 there.
