# T13 STALE DRAFT CASE — Stages 1–3 · consolidated report

Base `7436606` / v3.284 → local **v3.285**. 2026-08-30. **Not committed, not pushed.**
Stage 0 recon: `docs/checkpoints/stale-draft-recon.md`.

---

# STAGE 1 — VERDICT

## **H2 CONFIRMED. H1 FALSIFIED. H3 FALSIFIED.**

The draft has nothing to do with it. The degradation is a **Google Books lookup
failure silently laundered into "needs a look."** Every book in the degraded runs
was read correctly by the vision layer and then failed at the catalogue hop, and
the code could not tell the reader the difference because it never looked at the
HTTP status.

Rig: the committed `.claude/rig/serve.ps1` static server on :8791, the real app
booted from the repo root, auth stubbed at the one seam (`praxis_user`), `fetch`
wrapped to count requests and return controllable upstream responses. Everything
below is driven through the app's own functions, not reimplemented.

### The five measurements

**1. Lookups issued per run — draft absent vs present** *(before the fix)*

| stale items in draft | vision books | lookups issued | status dist |
|---|---|---|---|
| 0 | 19 | **19** | 200 × 19 |
| 5 | 19 | **19** | 200 × 19 |
| 20 | 19 | **19** | 200 × 19 |

**Lookups == vision books, exactly, at every draft size.** A draft adds zero
requests. H3's premise — that a draft doubles the lookup load — is false.

**2. Status distribution.** Under the synthetic upstream: 200 → match, 429 → the
failure. Against the REAL upstream, probed from this machine: **25 of 25
consecutive keyless Google Books requests returned HTTP 429**, and the body reads

```
"message": "Quota exceeded for quota metric 'Queries' and limit 'Queries per day'
            of service 'books.googleapis.com' for consumer 'project_number:624717413613'"
"quota_limit": "defaultPerDayPerProject",  "quota_limit_value": "0"
```

Saved verbatim (1,306 B) and replayed through the client's own code path:

| hop | value |
|---|---|
| `res.ok` | **false** — and nothing read it |
| `res.json()` parses | **true** — a 429 body is valid JSON |
| `data.items` | **undefined** → `finish([])` |
| `resolveBook` returns | `status:'none'` (`manualStub`) |
| `scanGbNoMatch` | **true** |
| `scanIsException` | **true** |
| card the reader sees | **"The Beautiful Risk of Education / Gert Biesta — needs a look"** |

That is the exact card in the screenshot. The title and author are correct because
`manualStub` echoes the query back; the "needs a look" is the lie.

**3. Confidence curve at 0 / 5 / 20 stale items** *(before the fix)* — **19 / 19 /
19 confident, 0 exceptions each. Already flat.** The draft never moved it.

Against a failing catalogue, with **no draft at all**, the same curve collapses:

| upstream | confident | exceptions |
|---|---|---|
| all 200 | 19 | 0 |
| first 8 OK, then 429 | **8** | **11** |
| all 429 | **0** | **19** |

**4. Does rehydration at 9574 resolve draft items, or only render?** — **Only
render. Zero fetches.** Measured on every draft-facing path:

| path | fetches |
|---|---|
| `renderScan()` with a 5-item draft (rehydrate) | **0** |
| `scanRenderReview()` over those items | **0** |
| `scanOpenWalker` + all 5 walker steps | **0** |
| `scanUpdateNavBadge()` | **0** |

Corroborated statically: `scanResolveAndFill` opens with fresh locals and
**replaces** `scanResult` wholesale at `views.js:8992`; `scanResult` is assigned in
exactly two places repo-wide; the walker uses stored `alternates` and fires no
model or network call by design.

**5. Does declining the batch reduce the next run's request count?** — **No.**
Walked 19 exceptions as "Not a book" (draft → cleared), then ran a fresh 19-book
capture: **19 lookups.** Identical.

### Against the timeline

The measured recovery is ~3 minutes, and the 3:07→3:10 sequence *rose* under rapid
succession. Both facts are consistent with H2 and inconsistent with H1/H3:

- Confidence tracks **whether the catalogue answered**, nothing else. It is not a
  function of elapsed time, request history, or draft state — so a run can be
  healthy at 3:10, dead at 3:21, and healthy again at 3:25 with no local cause.
- The keyless consumer is a **shared anonymous project** (`project_number:
  624717413613`), not Preston's IP. Its availability is not his to exhaust and not
  his to wait out — which is exactly how a three-minute recovery happens, and why
  three rising runs in four minutes were fine.

**What I could NOT determine, stated plainly.** Whether the deployed function is
calling Google keyed or keyless. I cannot reach `praxis-reading.netlify.app` from
this machine (egress blocked) and cannot read Netlify env vars. The keyless
default is literally `0/day`, so if `GOOGLE_BOOKS_API_KEY` is unset in prod,
matching would fail *always* — and it demonstrably works sometimes, so a key is
probably set and **that key's own quota is the binding constraint.** That is
inference, labelled as inference. The 2a fix makes it directly readable off the
device from now on.

---

# STAGE 2 — WHAT SHIPPED

Files: `js/integrations.js` · `js/views.js` · `assets/components.css` · `sw.js`.

### 2a — `res.ok`, unconditional  *(T14)*

`googleBooksSearch` now has **three** outcomes instead of two: items · `[]` with
`err === null` (a genuine no-match) · `[]` with `err` (transport/quota — we do not
know whether the book exists). `resolveBook`'s `manualStub` carries `lookupFailed`
+ `lookupHttpStatus` **alongside** `status`, which is byte-untouched — all five
existing readers (`views.js` 7121, 7163, 7801, 8125, 10500) are unaffected.

Retry: 2 attempts at 400 ms / 1200 ms, **only on 429 and 503**. A deterministic
error (401 key mismatch, 400 bad q, 413 oversize) is never retried. A 20 s circuit
breaker means the first book in a dead-quota run pays the backoff and the rest fail
fast: **a 19-book all-429 run costs 21 HTTP calls, not 57.**

The exception predicate is deliberately **unchanged** — a book we could not look up
still cannot be confidently shelved. What changed is that we now say which kind it
is: separate review-face state (`is-unlooked`: upright, ungrayed, gold-deep flag —
explicitly *not* the `is-lean` "unavailable" gray), a run-level note, honest tray
and announcer copy, and walker copy that stops asking "Is this the one?" about a
candidate it never received.

### 2b — draft destruction / R1 banner

`#scan-draftbar`, mounted **inside `#scan-screen-view`** under the top bar, above
the reticle. Names the count and the age; RESUME and DISCARD. **SUPERSEDED BY THE
ADDENDUM:** this section originally kept `#scan-primer-resume`; the ruling below
removes it, and the code matches the addendum. Register: the
viewfinder's own glass chrome, gold accent, solid fill, `backdrop-filter: none`
(canon §2), z-index 21 — under the overlays at 50.

DISCARD does not fire on first press. It swaps to an inline confirm naming the
count and stating in words that shelved books are untouched.

### 2c — the timestamp  *(T15)*

`savedAt` was written by `scanSaveDraft` since introduction and read by nothing
(grep = 1). It is rewritten on every save, so it is **already a last-touched
stamp** — it just never reached a caller. `scanLoadDraft` now returns it.

Clock source: `Date.now()`, the device wall clock. `scanDraftAgeMs` returns a
negative age for a missing/garbage stamp **and** for a backward-moved clock; a
negative age **never expires** and reads "from an earlier scan." Refusing to delete
on an untrustworthy clock is the only safe direction — keeping a draft too long
costs a banner, dropping one too early is silent data loss.

### 2d — the mechanism at its source

Stage 1 disproved H1 and H3, so there is no confidence corruption to repair. 2a
**is** the source fix for what actually happened.

### 2e — Undo safety

`scanClearDraft` touches one localStorage key and nothing else. `scanLastShelvedIds`
is module state, written only by `scanShelve`, only for `out.created` ids.
Proven by direct data inspection below.

---

# STAGE 3 — PROOF

### 1. Stage 1's five measurements — above, with the verdict.

### 2. `res.ok` — both paths, through the real `resolveBook` + `scanIsException`

| upstream | HTTP attempts | `status` | `lookupFailed` | `lookupHttpStatus` | exception? | shown as |
|---|---|---|---|---|---|---|
| 429 quota | **3** (1 + 2 retries, 2416 ms) | `none` | **true** | **429** | yes | "couldn't look up" |
| 200, `totalItems: 0` | **1** (no wasted retry) | `none` | **false** | 0 | yes | "needs a look" |
| 200, match | 1 | `strong` | false | — | **no** | confident |

### 3. Confidence curve AFTER the fix — flat, as before

| stale in draft | lookups | confident | exceptions | `rec.unlooked` |
|---|---|---|---|---|
| 0 | 19 | **19** | 0 | 0 |
| 5 | 19 | **19** | 0 | 0 |
| 20 | 19 | **19** | 0 | 0 |

And the two degraded shapes, now correctly attributed:

| upstream | found · confident | exceptions | of which catalogue-outage | genuinely need a look |
|---|---|---|---|---|
| all 429 | **19 · 0** | 19 | **19** | **0** |
| 6 OK then 429 | **23 · 6** | 17 | **17** | **0** |

The second row is Preston's 3:18 screenshot ("23 found · 6 confident") reproduced
exactly — and now labelled as an outage rather than seventeen misread spines.

Rendered review face on that run:

```
23 found · 6 confident
17 books couldn’t be looked up — the book catalogue didn’t answer.
Nothing is wrong with the read; try these again in a minute.
card 1: class "scan-dc is-unlooked"  flag "couldn’t look up"
        aria "Could not be looked up: … Open to fix."
```

A draft holding one of each kind renders both states side by side:
`is-unlooked / "couldn’t look up"` and `is-lean / "needs a look"`. Walker,
outage step: *"I read this one — I just couldn't look it up"* · *"The book
catalogue didn't answer (429). Accepting adds it exactly as read…"* · accept reads
**"Add it as I read it."** Normal step is byte-identical to today.

`lookupFailed` survives `scanSaveDraft` → `scanLoadDraft` (the cards render
correctly after a full `renderScan()` round-trip through localStorage).

### 4. Banner

| check | result |
|---|---|
| exists | yes |
| inside `#scan-screen-view` (capture view) | **yes** |
| inside `#scan-ov-primer` | **no** |
| visible with a 9-item, 12-minute-old draft | yes, at 375×812 |
| text | "9 books from 12 minutes ago are still in your draft case." |
| computed | `display:block · position:absolute · z-index:21 · background rgba(28,20,10,.82) · border rgb(217,164,65) · backdrop-filter: none · filter: none` |
| `.scan-overlay` z-index | 50 (overlays still cover it) |
| no draft | **hidden** |
| expired draft | **hidden**, storage cleared, primer Resume also hidden |
| after the reader shoots anyway | **hidden**, `scanDraftPending` false |

**RESUME** — draft in storage 9 → **9** (preserved), `scanResult` 9 items, review
screen active, bar down.
**DISCARD** — confirm shows "Discard 9 books from that scan? Books already on your
shelf are not touched."; main row hidden; on confirm, draft → `null`.

### 5. Expiry

| case | stamp | result |
|---|---|---|
| 25 h, untouched | `now − 25 h` | **cleared**, silently |
| started 25 h ago, touched 1 h ago | `now − 1 h` | **kept** · "from 1 hour ago" |
| no `savedAt` field | ABSENT | **kept**, no throw · "from an earlier scan" |
| garbage `savedAt` | `"not-a-number"` | **kept**, no throw |
| clock moved backward | `now + 6 h` | **kept**, no throw |
| 23 h 59 m | — | kept |
| 24 h 01 m | — | cleared |
| nav badge after expiry | — | badge empty, storage `null` |

The badge reads through the same chokepoint, so an expired draft is invisible to
**every** reader, not just the entry point.

### 6. Undo safety — direct inspection of stored data

Pre-existing book `book_…970_231298` created through `scanCommitBook`; a scan batch
then shelved `book_…973_436166`.

```
scanLastShelvedIds                       = ["book_…973_436166"]
contains the pre-existing id             = false
--- seed a 6-item draft, DISCARD it ---
draft in storage                         = null
library ids byte-identical to before     = true
scanLastShelvedIds mutated by discard    = false
pre-existing book still on shelf         = true
--- then fire the real Undo ---
pre-existing still present               = true
scan-created still present               = false
VERDICT: undo deleted only the scan create = TRUE
```

### 7. Gates

**Call chains (T3)** — every new path traced from a real gesture and **fired**:

| new path | chain | fired |
|---|---|---|
| `scanDraftBarResume` | click `#scan-draftbar-resume` ← `scanWireShell` ← `renderScan` ← `renderRoute` (`parts[0]==='scan'`, views.js:541) | ✅ |
| `scanDraftBarAskDiscard` | click `#scan-draftbar-discard` ← same | ✅ |
| `scanDraftBarDiscard` | click `#scan-draftbar-yes` ← same | ✅ |
| `scanRenderDraftBar` | `renderScan` · `scanResolveAndFill` · click `#scan-draftbar-no` | ✅ |
| expiry in `scanLoadDraft` | `renderScan` **and** `scanUpdateNavBadge` (badge proved) | ✅ |
| `googleBooksSearch` err arm | `resolveBook` ← `scanResolveAndFill` ← `scanRunShelfVision` ← shutter / drop-zone | ✅ |
| `scanLookupFailed` | item build in `scanResolveAndFill` | ✅ |
| `is-unlooked` + review note | `scanRenderReview` | ✅ |
| walker outage copy | `scanRenderWalkerStep` | ✅ |

No `grep -c == 1` definitions. Nothing shipped into a function without a caller.

**Byte deltas** (LF-normalised, measured before and after — not back-derived):

| file | base | now | delta | code / comment split of added lines |
|---|---|---|---|---|
| `js/views.js` | 1,134,070 | 1,146,862 | **+12,792** | 228 added lines, 84 comment · ~8,012 code B / ~6,365 comment B |
| `js/integrations.js` | 152,974 | 155,459 | **+2,485** | 59 added, 19 comment · ~2,072 code B / ~1,513 comment B |
| `assets/components.css` | 883,703 | 886,213 | **+2,510** | 28 added, 2 comment |
| `sw.js` | 6,041 | 6,041 | **+0** | equal-length version string — predicted exactly |

Diffstat: 4 files, 316 insertions, 35 deletions. Dirty set is exactly those four.

**Parse gate** — harness self-validated first (it must fail a broken copy before it
may pass a real file):

```
broken syntax   → exit 1  "PARSE ERROR … Expected identifier"
ES5 const/arrow → exit 1  "PARSE ERROR … Syntax error"
known-good file → exit 0
js/views.js         exit 0
js/integrations.js  exit 0
sw.js               exit 0
```

**Blob CR = 0** at stage time for `views.js`, `components.css`, `sw.js`.
`integrations.js` has a CRLF **working tree** (3,553 CR == 3,553 LF, uniform — no
mixed-EOL damage); `git ls-files --eol` reports `i/lf` for all four, and every blob
in this repo is already LF, so the clean filter normalises it and the flip is
immaterial to what commits.

**Foundations byte-lock** — unchanged:
`lumen-amber.css` `070679b03453ca0d8405cb6f92ec5ad2`, 14,966 B ✓ ·
`marks.js` `772886c049d0d6d03d341507e602d88a`, 10,255 B ✓

**ES3** — no `const` / `let` / `class` / arrow / template literal in new code. The
only backtick hits are prose inside comments (`` `items` ``, `` `err` ``), matching
existing precedent; the cscript gate is the authority and it passes.

---

# HALTS, FORKS, AND WHAT I DID NOT DO

### HALT — §9 red-team could not run
The session bars spawning agents, so `fix-red-team` did not fire. Per CLAUDE.md
that is **HALT-tier**, named, not absorbed and not substituted with an inline pass.
This diff is larger and more behavioural than the COVERS two-line assignment that
was ruled acceptable once — treat that ruling as spent, not as precedent.

### FORK — shooting again still discards a pending draft
The banner makes the supersession **visible before the shutter**; it does not
**prevent** it. `views.js:8992` still replaces `scanResult` wholesale, so a reader
who sees the bar and shoots anyway loses those items. Three options; Preston's call,
not mine, and not resolved in a code comment:

- **A — warn only.** What is built. Cheapest, no new state.
- **B — block the shutter** until RESUME or DISCARD is chosen. Safest; adds a modal
  gate to the rapid-scan flow Preston has been protecting.
- **C — merge** the new capture into the pending draft. No data loss; needs a union
  and a dedupe policy across two scans, and touches the tiered identity work that
  is explicitly a non-goal this round.

### INFRASTRUCTURE — for Preston, not a code change
The keyless Google Books quota is `defaultPerDayPerProject = 0` on a shared
anonymous project. If `GOOGLE_BOOKS_API_KEY` is unset in Netlify, book matching is
permanently broken; if it is set, that key's quota is the binding constraint on how
many books can be scanned per day. Either way this is a **launch-blocking
infrastructure decision.** I did not add or configure the key (non-goal). After
this fix the device itself reports the HTTP status, so the answer is now readable
from a real run instead of inferred.

### LOG updates

- **T13 — REVISED. The stale-draft framing is NOT filed as fact.** The draft does
  not degrade confidence and does not increase lookup load; both were measured.
  What is real and was found alongside it: an unresolved draft is **silently
  destroyed** by the next capture. That is now surfaced (R1) and expired (R2).
- **T14 — fixed.** `googleBooksSearch` checked no status; the proxy passes upstream
  status through untouched; a 429 was indistinguishable from a no-match. Now three
  outcomes, with capped retry and a circuit breaker.
- **T15 — fixed.** `savedAt` was write-only since introduction. Now read, and it is
  the clock R2 runs on.
- **T16 — T5 is at least partly T14, and should not be carried as a separate
  vision-layer phenomenon.** The exception predicate has two arms: `confidence ===
  'low'` (vision) and GB no-match (catalogue). A flapping catalogue moves the second
  arm run-to-run with no vision change at all, which is the same shape as the
  15/17/19 spread. I cannot split the two retrospectively — the runs that produced
  T5 recorded no status. From v3.285 onward `rec.unlooked` separates them per run,
  so the next real scan settles it with data rather than inference.

### Residuals
- **VISUAL GATE uncleared** — screenshots at 375×812 corroborate; the felt pass is
  Preston's and has not happened. Stated deltas: (1) a gold-bordered draft bar on
  the capture view naming count + age, with RESUME/DISCARD; (2) catalogue-outage
  books stand upright and ungrayed in the review with "couldn't look up" instead of
  leaning gray "needs a look", plus a run-level explanation line.
- **LIVE CACHE_VERSION VERIFY IS OWNER-ONLY** — `praxis-reading.netlify.app` is
  host-blocked from this machine.
- The 20 s circuit breaker re-arms if a run outlives it. Harmless (worst case, one
  more retry pair later in a long run); noted, not tuned.
- Rig note: the pane keeps the tab `document.hidden`, so Chrome clamps timers. A
  labelled harness shim routed **sub-100 ms** timers through a MessageChannel to
  restore the book-pacing loop. Retry backoffs and every longer timer stayed on the
  real clock. This changes when the loop ticks, never what it computes.

**Nothing committed. Nothing pushed. `sw.js` is at v3.285 locally, staged with the
source when you give the word.**

---
---

# ADDENDUM — FORK RULING B: BLOCK THE SHUTTER

Folded into the SAME uncommitted change at **v3.285**. One version bump, one commit.
The warn-only banner never existed as a shipped decision.

## The visibility predicate — verbatim

```js
function scanDraftBarIsOnScreen() {
  var bar = scanEl('scan-draftbar');
  if (!bar) { return false; }                                   // not in the DOM
  if (bar.getClientRects && bar.getClientRects().length === 0) { return false; }  // display:none anywhere up the tree
  var r = bar.getBoundingClientRect();
  if (!(r.width > 0 && r.height > 0)) { return false; }          // collapsed
  var vw = window.innerWidth || 0, vh = window.innerHeight || 0;
  if (vw > 0 && vh > 0) {
    if (r.bottom <= 0 || r.right <= 0 || r.top >= vh || r.left >= vw) { return false; }  // scrolled/positioned away
  }
  var cs = window.getComputedStyle ? window.getComputedStyle(bar) : null;
  if (cs) {
    if (cs.display === 'none' || cs.visibility === 'hidden') { return false; }
    if (cs.opacity !== '' && parseFloat(cs.opacity) === 0) { return false; }
  }
  return true;
}

function scanShutterBlocked() {
  if (!scanDraftPending) { return false; }
  if (!scanDraftBarIsOnScreen()) { return false; }   // THE ESCAPE HATCH
  var d = scanLoadDraft();                           // applies R2 expiry
  return !!(d && (d.confident.length + d.exceptions.length) > 0);
}
```

It reads **rendered geometry + resolved style** — never the flag, never a class
name — so any CSS change that hides the bar makes it return `false` and frees the
shutter. **Every clause fails OPEN.** A predicate guarding an escape hatch must
never invent a reason to lock someone out; the `vw > 0 && vh > 0` guard exists
because a zero-sized embedding would otherwise read every element as off-screen.
(That is not hypothetical — the Browser pane reports `innerHeight === 0` while
hidden, and the first cut of this predicate refused to block there. It failed in
the safe direction, which is how it was caught rather than shipped.)

`scanDraftBarBlockProbe()` exposes `pendingFlag / barOnScreen / draftItems /
blocked` separately so a test asserts each clause on its own. **It has no
production caller by design** — it is a test surface, declared here rather than
left to look like dead code.

## Order of operations on entry — implemented and proven

```js
scanResult = scanLoadDraft();          // 1 — R2 EXPIRY runs FIRST; expired -> null
scanDraftPending = !!(scanResult && (...confident.length || ...exceptions.length));  // 2 — arm
scanRenderDraftBar();
scanEnter();
```

An expired draft cannot reach step 2: it no longer exists. `scanLoadDraft` is also
the single chokepoint the nav badge reads, so expiry cannot be half-wired.

## What blocked looks like

The shutter is **never disabled and never grayed.** Measured at the moment of a
blocked tap: `disabled=false · opacity 1 · filter none · pointer-events auto ·
cursor pointer · aria-disabled null`. The tap routes attention to the existing bar
(`.is-calling`, a 1.4 s brightening of the same component, reduced-motion aware)
plus the announcer. No new component, no modal, no `alert()`. The screenshot at
375x812 shows the glowing bar with a full-brightness cream shutter.

**Guarded at two sites**, both on the shelf-capture path: `scanFireShelfShot`
(before the freeze, capture and budget spend — a blocked tap costs nothing) and
`scanRunShelfVision` (the chokepoint the desktop drop-zone also uses). **Book mode
is deliberately not guarded** — its cover shot and barcode add go through
`scanCommitBook` and never touch `scanResult`, so they cannot destroy a draft.
Verified: a Book-mode shutter tap while `scanShutterBlocked()` is true proceeds.

**One thing the ruling implied that I had to add:** the bar sits at z-index 21 and
the overlays at 50, and the camera-denied card carries its own shelf drop-zone. A
refusal fired from there would have explained itself behind an opaque panel — a
refusal with no visible cause, the exact failure B exists to prevent. So
`scanCallDraftBar` now calls `scanCloseAllOverlays()` first. Invariant: **if we
refuse, the reason is on screen.**

## If RESUME or DISCARD throws mid-action

Both handlers release the block in a `finally`, so a throw anywhere in the body
cannot leave the reader blocked. This is the *second* of two independent guards —
the escape hatch already makes "blocked with no banner" unreachable, because the
gate requires the bar to be on screen. A failed DISCARD is non-destructive: the
draft stays in storage and re-arms next entry, which is the safe direction.

Proven by injecting a throw:

| injected failure | rethrew | `scanDraftPending` after | blocked after | data |
|---|---|---|---|---|
| `scanLoadDraft` throws during RESUME | yes | **false** | **false** | draft intact |
| `scanClearDraft` throws during DISCARD | yes | **false** | **false** | 9 items still in storage |

Shutter free immediately afterwards: capture proceeded.

## Primer collision — RULED: the bar supersedes; the primer resume is removed

Diff:
```
- var resume = scanEl('scan-primer-resume');
- ... resume.textContent = 'Review ' + scanResult.found + ' from your last scan';
- ... resume.addEventListener('click', ...)
- <button class="scan-btn scan-btn-ghost" type="button" id="scan-primer-resume" style="display:none"></button>
```
`grep -c 'scan-primer-resume' js/views.js` is now **1**, and that one is the
replacement comment naming the removal (the stale-comment trap, closed in the same
commit).

Why the primer button is the one that goes: it only ever appeared before the
camera was granted, vanished the instant the overlay was dismissed, and sat on a
screen with **no shutter** — it fired before the reader was looking at a shelf and
was gone by the time they could lose anything. It is also **off the block**: RULING
B's gate reads the *bar*, so a resume taken from a screen the gate cannot see would
be a second, ungoverned path to the same state. Nothing regresses on the
camera-denied path — that overlay never carried a resume affordance, before or
after.

## PROOF — the ruling's eleven

| # | check | result |
|---|---|---|
| 1 | shutter blocked, banner visible | `blocked:true` · **capture did not fire** · `refusedToBar:true` · draft 9/9 intact · `scanResult` 9 items |
| 2 | **ESCAPE HATCH** — flag set, banner suppressed | `pendingFlag:true · barOnScreen:false · blocked:false` -> **capture fired** |
| 3 | 25 h-old draft | cleared on entry (`ls` -> `null`), `pendingFlag:false`, never blocked, capture fired |
| 4 | empty draft | never blocks — empty object, forced flag on zero items, and no draft at all: all `blocked:false`, capture fired |
| 5 | RESUME | `blocked` true->**false**, bar down, **9/9 items preserved** (titles verbatim `Stale Book 0...8`), review screen active, shutter free |
| 6 | DISCARD | `blocked` true->**false**, draft->`null`, **library ids byte-identical**, undo list unchanged, pre-existing book still shelved, shutter free |
| 7 | blocked shutter not disabled/grayed | `disabled false · opacity 1 · filter none · pointer-events auto · cursor pointer · aria-disabled null` + screenshot |
| 8 | predicate | verbatim above |
| 9 | primer ruling | above, with diff |
| 10 | call chain from a real tap | below |
| 11 | bytes · parse · CR | below |

**Escape-hatch clause sweep** — each suppression mode applied individually, then a
real shutter tap. All six release the shutter:

| suppression | `barOnScreen` | `blocked` | capture fired |
|---|---|---|---|
| `display:none` | false | false | yes |
| `visibility:hidden` | false | false | yes |
| `opacity:0` | false | false | yes |
| collapsed to zero size | false | false | yes |
| positioned off-viewport | false | false | yes |
| element detached from the DOM | false | false | yes |
| *(restored)* | **true** | **true** | **refused** |

**Drop-zone chokepoint:** `scanRunShelfVision` blocked -> 0 vision calls, bar
called, draft intact; after DISCARD the same call -> **1 vision call**. Fired from
under the camera-denied overlay: overlay closed, bar on screen and calling, 0
vision calls.

**Call chain (T3), real gesture -> block check:**
`click .scan-shutter` (built in `scanRenderActionRow`, `views.js:8391-8393`, shelf
arm) -> `scanFireShelfShot` -> `scanShutterBlocked()` -> `scanDraftPending` +
`scanDraftBarIsOnScreen()` + `scanLoadDraft()` -> refuse -> `scanCallDraftBar()` ->
`scanCloseAllOverlays()` + `.is-calling` + `scanAnnounce`. Driven by an actual
`.click()` on the rendered element, not by calling the handler.
Second site: drop / file-input -> `scanShelfFromFile` -> `scanRunShelfVision` ->
same gate.

Occurrence counts (no zero-caller production code):
`scanShutterBlocked` 4 · `scanDraftBarIsOnScreen` 3 · `scanCallDraftBar` 3 ·
`scanRenderDraftBar` 7 · `scanDraftBarResume` 2 · `scanDraftBarDiscard` 2 ·
`scanDraftBarBlockProbe` 2 (**definition + comment — test surface, zero production
callers, intentional and declared**).

## Gates, at stage time

| file | base (`7436606`) | now | delta |
|---|---|---|---|
| `js/views.js` | 1,134,070 | 1,154,085 | **+20,015** |
| `js/integrations.js` | 152,974 | 155,459 | **+2,485** |
| `assets/components.css` | 883,703 | 887,011 | **+3,308** |
| `sw.js` | 6,041 | 6,041 | **+0** (equal-length version string) |

Added-line classification — `views.js` 352 lines, **156 comment** (~11,836 B comment
/ ~10,174 B code) · `integrations.js` 59 lines, 19 comment · `components.css` 41
lines, 3 comment. Comment share is high by intent: every guard here carries why it
fails open.

Diffstat 4 files, 453 insertions, 40 deletions. Dirty set is exactly those four.
**`CACHE_VERSION` is still `praxis-v3.285` — one bump, not two.**

Parse gate: `views.js` exit 0 · `integrations.js` exit 0 · `sw.js` exit 0, with the
harness self-validated first (broken syntax -> exit 1, ES5 arrow/const -> exit 1,
known-good -> exit 0).

**Blob CR = 0 on all four files, measured now.** `git ls-files --eol` reports `i/lf`
for all four; `integrations.js` has a uniform CRLF working tree (3,553 CR == 3,553
LF, no mixed-EOL damage) which the clean filter normalises.

Foundations byte-lock unchanged: `lumen-amber.css` `070679b0...` · `marks.js`
`772886c0...`.

## STILL OUTSTANDING BEFORE ANY COMMIT

- **§9 red-team — HALT-tier, unresolved.** Agents are barred this session. The diff
  is now materially larger than when this was first named (+453 lines, a new
  refusal gate on a paid capture path). The COVERS ruling was for a two-line
  property assignment and is not precedent for this.
- **VISUAL GATE uncleared.** Screenshots at 375x812 corroborate; the felt pass is
  Preston's. Stated owner-visible deltas at 390: (1) the gold draft bar on the
  capture view; (2) a shelf-shutter tap that brightens the bar instead of shooting,
  while the shutter stays cream and live; (3) the primer's "Review N from your last
  scan" button is gone; (4) catalogue-outage books upright and ungrayed with
  "couldn't look up" plus the run-level explanation line.
- **CURRENCY (CLAUDE.md, Studio Protocol).** `BOARD.md` row 19 (`#scan`) and the
  studio markdown + `sequence.md` must be updated, and `tools/studio-build` re-run,
  **in the same commit** — the final local commit awaiting the push word is the
  push point, so the Builder regen rides it. Not started: it is a 15-20 minute
  detached job and the instruction was to report and stop.
- **LIVE CACHE_VERSION VERIFY IS OWNER-ONLY** — the deploy is host-blocked here.

Nothing committed. Nothing pushed.
