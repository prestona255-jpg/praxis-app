# R-FIRSTSHELF — WALKER LANE · STAGE 0 RECON (report-first, zero app edits)

Base HEAD `30c534c`, origin/main `30c534c` (0/0), tree clean, CACHE_VERSION
`praxis-v3.277`. Hook ARMED, FIX-PROTOCOL v1.2. **No tracked file modified this
session; no version bump; nothing fixed.** Evidence = measured rig rects
(localhost:8795, uid `d0tester`, 390×734, force-settled, scrollY 0) + read source
at file:line. Privacy: counts / ids / titles only.

Anchors re-confirmed live on `30c534c`: `scanShelfVision` (views.js:7919),
`scanQueryForBook` (7965), `scanIsException`/`scanGbNoMatch`/`scanTitleCorroborates`
(7976–8010), `scanClassify` (8016), `scanCommitBook` (8573), `scanResolveAndFill`
(8772), `scanRenderReview` (8844), `scanRenderWalkerStep` (8920), `scanResolveStep`
(8982), `scanShelve` (9012), `scanReviewHTML` (9373); `resolveBook`/`resolveBatch`
(integrations.js:2339/2410), `scoreVolume` (2117), `candidateIsPlausible` (2105),
`titleCloseness` (2070). No dead anchor.

---

## S0 — GROUND TRUTH — PASS
HEAD `30c534c` == base; origin/main `30c534c`, ahead 0 / behind 0; tree clean
(untracked prior checkpoints only). CACHE_VERSION `praxis-v3.277`. All S1/S2/S3
anchors resolve. No HALT.

---

## S1 — THE WALKER'S OPTION SET (the blocking finding)

`scanRenderWalkerStep` (views.js:8920) renders, per exception book:
- **Best guess** — `b.title` / `b.author` from vision (8933–8934). **Display only —
  NO button, NO handler. It is never itself acceptable.**
- **Evidence line** — verbatim `b.spineText` (8937–8940).
- **Candidate buttons** (`.scan-wk-cand`, 8954–8962) → `scanResolveStep('picked', cd)`
  (8959). **This is the ONLY accept path.** Rendered ONLY from `plausible` =
  `b.alternates` filtered through `candidateIsPlausible` (8947–8950). If nothing
  passes, the header flips to **"No confident match"** (8952) and **zero accept
  buttons render.**
- **"Search on the Shelf instead"** (`.scan-wk-search`, 8963–8966) → `location.hash =
  '#books'` (8965). **Bare navigation. It does NOT query, does NOT pre-fill the
  title/author, returns no list.** The user re-adds by hand on the Shelf.
- **"Not a book"** (8968–8969) → `scanResolveStep('notbook')` → `exc._resolved =
  'notbook'` → dropped in `scanAfterWalk` (9003).
- **"Skip for now"** (8970–8971) → `scanResolveStep('skip')` → `exc._resolved = null`
  → **kept** in `scanAfterWalk` (9003), persists as a draft via `scanSaveDraft`
  (9007). Recoverable by re-opening the review/walker on the same draft.
- **"Skip all N remaining"** (8973–8976) → close walker + `scanAfterWalk`.

### Direct answer to the blocking question
**Is there any code path to accept the displayed best guess and shelve that book?
NO.** The only accept is a `plausible`-**alternate** button. Two facts make the
gap structural:
1. The best-guess text (`b.title`) is inert — never wired.
2. **The resolver's OWN top pick (`resolved.book`) is NOT offered either.** `plausible`
   is built only from `b.alternates` (8948), which is `scored[1..5]` — the resolver's
   2nd-through-6th results (integrations.js:2390–2393). `resolved.book` (the top pick)
   feeds only the cover image (`item.cover`, 8795), never the candidate list.

So when a book reaches the walker with no plausible alternate — **even if vision read
the spine perfectly** — the surface shows the correct best guess, "No confident match",
and offers no way to accept it. Only "Search" (bare nav), "Not a book", or "Skip". This
is the reported defect, and it is independent of Google-Books ranking.

---

## S2 — THE MATCHER (root cause)

### Query construction — NOT raw pass-through
`scanQueryForBook` (7965) builds `{kind:'title', title: vb.title, author: (noisy ?
'' : vb.author)}` from vision's **parsed** `title`/`author`, not the raw OCR string.
The raw spine ("BROWNE DARK MATTERS DUKE") lives in `vb.spineText` and is used only
for the evidence line. "DUKE" (publisher) is in `spineText`, not the query — the
brief's raw-pass-through hypothesis is **falsified**: the vision contract
(shelf-vision.js:183–198) emits `title`, `author`, `spineText`, `confidence` as four
separate fields, and the query reads only `title`/`author`.
`resolveBook` (integrations.js:2375–2378) then builds `q = 'intitle:' + title
('+inauthor:' + author when present)`. **Multi-word titles are NOT quoted**, so
`intitle:Dark Matters` scopes only "Dark" to the title and leaves "Matters" as free
text (same for "Pedagogy of Hope" → only "Pedagogy" scoped). This is a real ranking
weakener, especially for common titles / prolific authors.

### The confidence rule (the exact comparison + threshold)
Two independent layers — and the scan path **does not use `resolveBook`'s own
strong/weak verdict at all**:
- `resolveBook` computes `status = (top.score >= 60 && titleCloseness >= 0.65 &&
  topHasIsbn) ? 'strong' : 'weak'` (integrations.js:2399–2401). **The scan classifier
  never reads this** — it is dead weight for the scan flow.
- `scanIsException(vb, resolved)` (7007→7007; 8007–8010): exception ⇔
  `vb.confidence === 'low'` (vision) **OR** `scanGbNoMatch(vb, resolved)`.
- `scanGbNoMatch` (7991–8003): no-match ⇔ `resolved.status === 'none'` **OR** no
  candidate in `[resolved.book].concat(alternates)` has a title that
  **`scanTitleCorroborates`** the vision title.
- `scanTitleCorroborates` (7976–7983): normalized-equal, OR the shorter (≥6 chars) is
  a substring of the longer (subtitle tolerance).

So a book is "confident" ⇔ vision confidence ≠ `low` AND at least one of the ≤6
returned candidates' titles corroborates the vision title. Note only `low`
short-circuits; `high`/`medium` fall through to the GB corroboration test.

### ⭐ Does the lookup already receive multiple candidates and discard all but one? — YES
`resolveBook` sorts every returned Google-Books item by `scoreVolume` and returns
`book` (top) **plus up to 5 `alternates`** (integrations.js:2381–2402).
`scanResolveAndFill` carries `item.alternates = rz.alternates` (8796) into every tray
item, confident or exception. **Ranked candidates are already in hand and are the
input the walker filters.** The candidate-picker is therefore nearly free to build;
what's missing is (a) offering `resolved.book`/the best guess as acceptable, and (b)
the plausibility gate that currently hides everything (below). The larger cost is only
if the correct book isn't in the returned window at all (query/ranking).

### Live Google-Books reproduction — BLOCKED (brief premise no longer holds)
The brief authorized keyless Google-Books calls ("free and unauthenticated"). **That
is no longer true.** Every keyless request now returns HTTP 429 with
`quota_limit_value:"0"`, `quota_limit:"defaultPerDayPerProject"`,
`reason:"RATE_LIMIT_EXCEEDED"` (captured live in the pane, 2026-08-16). Google has
zeroed the default per-project/day quota for keyless Books-API traffic. I hit it from
PowerShell and the in-app browser (same result); I have no `GOOGLE_BOOKS_API_KEY`, so I
**cannot reproduce the ranking for the two device books.** Prod works only because the
proxy appends `&key=` when `GOOGLE_BOOKS_API_KEY` is set (google-books-proxy.js:85–88);
the 6-of-13 confident result proves the prod key is set.
> **Latent single-point-of-failure worth flagging:** if `GOOGLE_BOOKS_API_KEY` is
> ever unset or its quota exhausted, `googleBooksSearch` → `[]` → `manualStub`
> (`status:'none'`) → `scanGbNoMatch` true for **every** book → 100% exceptions. The
> proxy does not surface a distinct "GB down" state to the client; it looks identical
> to "no match."

### Where each device book falls off — code-grounded reasoning (not live-measured)
Both read correctly and landed in exceptions with "No confident match." Given the
logic, the fall-off is one (or a combination) of:
- **Vision `confidence:'low'`** → exception BEFORE GB is consulted (8008). A crisp read
  is usually `high`, so this is possible but not the likely sole cause for two clean
  spines.
- **Query/window (most likely):** unquoted multi-word `intitle:` + a common title
  ("Dark Matters") or a prolific author (Freire has *Pedagogy of the Oppressed / of
  Freedom / of the Heart / of Hope*) lets same-author or same-phrase books rank first;
  Google returns ~10 items, `resolveBook` scores only the top 6 → if the exact edition
  ranks outside that window, `scanGbNoMatch` never sees a corroborating title. Worked
  string-math: `scanTitleCorroborates("Pedagogy of Hope", "Pedagogy of the Oppressed")`
  = **false** (neither contains the other), so a Freire result dominated by *Oppressed*
  fails; `scanTitleCorroborates("Pedagogy of Hope", "Pedagogy of Hope: Reliving…")` =
  **true** (prefix substring) — so the book WOULD be confident **iff** that edition is
  in the scored window. The failure is that it isn't surfaced, i.e. query/ranking, not
  the corroboration test.
- **Walker plausibility gate:** even if a corroborating candidate came back, the walker
  only shows it when `candidateIsPlausible` passes (needs `book.isbn`, non-periodical,
  year ≥ 1900, `titleCloseness ≥ 0.5`; integrations.js:2105–2113). A public-domain-scan
  edition without an ISBN is dropped → "No confident match" even with a real hit.

**Which of bad-query / bad-ranking / too-strict-threshold** cannot be split without
the prod key. Ranked by code evidence: **query construction (unquoted multi-word
`intitle:`) + the 6-item scoring window are the primary suspects**, with the walker's
ISBN-required plausibility gate a secondary contributor. This is the honest limit of a
keyless recon.

---

## S3 — SCANNED-BOOK DEFAULT STATUS — MEASURED (the real fold fix)

Default status: `scanShelve` (9018) calls `scanCommitBook({… status:'reading'})`;
`scanCommitBook` (8585) defaults to `'reading'`. **Every shelved scanned book is
`reading`.** (There is no `'shelved'` status in the vocabulary — `normalizeStatus`,
state.js:460, knows only `reading` / `read` / `will-read`, and maps unknown →
`reading`. The brief's "shelved" = a non-reading status; the meaningful alternative is
`will-read`.)

The case (`#shelf-case`) groups the **whole** library by category/lens regardless of
status; the desk (`#shelf-desk-row`) shows only the `reading` subset, mobile-capped at
2 (5128). So the default shifts case-top purely by desk height.

**Measured at 390×734, N=7, scrollY 0, force-settled** (`getBoundingClientRect().top`
of `#shelf-case`; A2 floor = case-top ≤ 694, i.e. ≥ 40px above the 734 fold):

| scanned default | desk | desk-row h | **case-top** | vs 734 fold (≤694) | vs 794 fold (≤754) |
|---|---|---|---|---|---|
| **`reading` (current)** | 2 covers + "+5 more reading →" | 318 | **835** | **−141 · FAIL** | −81 · FAIL |
| `will-read` (alt) | "Nothing in hand right now." | 53 | **569** | **+125 · PASS** | +185 · PASS |
| `read` (alt) | "Nothing in hand right now." | 53 | **569** | **+125 · PASS** | +185 · PASS |

Defaulting scanned books to a non-reading status pulls the bookcase **266px up
(835 → 569)** and clears the binding 734 fold by **+125px**. The rig reproduces the
device desk exactly ("+5 more reading →"), and the `reading` case-top (835) matches the
S2-amendment re-measure (836) — the rig is faithful.

**This is the measured fold fix the S2 amendment was reaching for** (its cover-shrink
lever bottomed out at 752–766, still short). The cost is a design/product call, not a
mechanical one: a bulk shelf-scan defaulting to `will-read` makes the desk read
"Nothing in hand right now" for freshly-added books — arguably *more* honest (you
aren't reading 7 books you just scanned) but it's Preston's call (fork, S6).

---

## S4 — THE HONEST-STATE CLUSTER (located + mechanism; NOT fixed)

**a. "Draft case — nothing's on your shelf yet" after 6 shelved.**
`scanReviewHTML` bakes `<span class="scan-rv-draftbadge">◲ Draft case — nothing's on
your shelf yet</span>` as a **static string inside `#scan-rv-body`** (views.js:9379).
It reads NO state and is never toggled (only grep hit is its own literal). It shows
whenever the body is shown (any `found > 0`); it hides only when `found === 0` (body
swapped for the done-door, 8885–8887). So while any exception remains — regardless of
how many books were already shelved this pass — the badge asserts "nothing's on your
shelf yet." Stale because the copy is a constant, not bound to shelf/shelved count.

**b. "7 found · 0 confident" after a 13-found scan — settles one-scan-vs-two.**
`scanRenderReview` recomputes `found = confident.length + exceptions.length` on every
render (8846) and writes `#scan-rv-count` = `found + ' found · ' + conf + ' confident ·
' + exc + ' need a look'` (8847). `scanShelve` empties the confident set on a successful
shelve (`scanResult.confident = []`, 9025). So after the 6 confident are shelved, the
next render computes `found = 0 + 7 = 7`, `conf = 0` → **"7 found · 0 confident · 7 need
a look."** **This was ONE scan, not two** — the header re-narrates the residual as if it
were the scan total after the confident cohort was consumed. **The matcher's real record
is therefore 6 confident of 13 (46%), NOT 0-of-7.** (Confirmed in the rig: a fabricated
2-exception / 0-confident result renders "2 found · 0 confident · 2 need a look.")

**c. "Shelve 0" in full primary gold.**
Foot markup: `<button … id="scan-rv-shelve" class="scan-btn scan-btn-primary">Shelve
<span id="scan-rv-shelve-n">0</span></button>` (9391). `scanRenderReview` sets only the
count text (`#scan-rv-shelve-n = conf`, 8877) and shows the whole foot whenever
`found > 0` (8901) — it never applies a disabled/absent state when `conf === 0`. So with
exceptions remaining but nothing confident, the button renders **"Shelve 0" in full
gold** (rig-confirmed: `scan-rv-shelve` text "Shelve 0", full-width primary rect).
`scanShelve` early-returns on `!confident.length` (9013), so the tap is inert — but the
control looks primary/active. The disabled (or hidden-when-0) state is simply never
written.

**d. Title truncation garbage ("Ordinary Resurrectio1", "Doorways to Transformatio1",
"The Accommod:").**
Scan covers render titles via `scanCoverNode` (8085) with **no JS truncation**
(`textContent = title`). The clip is CSS: `.scan-dc .cap .t` (`-webkit-line-clamp:2`,
`text-overflow:clip`, 11px; components.css:16856) and `.scan-cov .cov-t`
(`-webkit-line-clamp:4`, `text-overflow:clip`, 10px; 16869). **Rig-measured** — every
one of the three titles OVERFLOWS its box horizontally (`.cap .t`: scrollW 68/73 vs
clientW 64; `.cov-t`: scrollW 51/62/66 vs clientW 47) and is hard-clipped with
`text-overflow:clip` (no ellipsis). The last visible glyph is sliced mid-character by
the box's right edge (and by the clamp's last line). That is exactly why the trailing
garbage **differs per title** ("1", "1", ":") instead of being a uniform "…": each word
clips at a different letter, and a vertically-sliced "n"/"a" reads as "1"/":". Mechanism
= narrow fixed-width cover + `line-clamp` + `text-overflow:clip` (no ellipsis) →
mid-glyph horizontal clipping. (The pixel-level "looks like a 1" is a visual-gate item —
this pane cannot screenshot; the overflow geometry is the hard evidence.)

**e. Two camera labels overlapping ("Fill the frame with one row of spines" + "Reading
the shelf…").**
Idle hint `#scan-vf-guide` (markup 9249; text set by `scanSetMode` 8270–8271) and the
read-state overlay `#scan-shimmer` (markup 9250, containing "Reading the shelf…") are
**separate elements**. `scanRunShelfVision` does `scanShow('scan-shimmer')` (8755) but
**nothing hides `#scan-vf-guide`** — its text is only ever rewritten by `scanSetMode`,
never cleared on the read state, and `.scan-shimmer` (z35, `inset:0`, components.css:
16807) carries no opaque fill to cover the guide (z12). So during the read both labels
paint. Mechanism = the idle hint has no state-change teardown; the shimmer overlays but
does not occlude.

**f. Capture-surface copy bleeding onto the Shelf / behind the nav ("pre-rendered —
zero network before your first keystroke").**
Leaking element = `.capdoor-eyebrow-sub` (views.js:23140), a child of the pre-rendered
capture sheet `#capSheet` (mounted once at boot, app.js:30). **Two problems:**
1. **It is a developer provenance note, not UX copy** — "pre-rendered — zero network
   before your first keystroke" describes an implementation detail and should never be
   user-visible at all.
2. **Fragile hide on mobile.** Desktop hides `.capdoor-sheet` with `opacity:0` +
   transform (robust; components.css:16409). **Mobile (≤759) hides it with
   `transform:translateY(100%)` and `opacity:1`** (16422) — fully painted, held off only
   by the transform. Rig at 390×734: `#capSheet` sits at top 734→bottom 1145 and the
   eyebrow-sub at top 779 (just below the fold) — invisible *there*. But `position:fixed`
   breaks to the nearest transformed/filtered ancestor (the iOS nav-transform hazard the
   canon §2 warns of), and iOS Safari's dynamic viewport (URL-bar collapse) changes the
   visual-viewport height the `translateY(100%)`/`bottom:0` math depends on. Either
   re-anchors the opacity:1 sheet into view, exposing the painted head (eyebrow +
   eyebrow-sub) over the page — matching "on the Shelf and behind the nav overlay."
   Mechanism = opacity:1 + transform-only hide on mobile + a dev note that should not be
   rendered.

---

## S5 — THE FAB CONTRADICTION (resolved from RENDERED state, not source)

Rule: `body.scan-active .yumi-bloom{ display:none !important; }` (components.css:16977).
`scan-active` is added in `renderScan` (views.js:9208) and removed by the router on
every route change (453), re-added same-frame when the incoming route is `#scan`.

**Rendered in the rig (390×734), every relevant state:**

| surface / state | `body.scan-active` | `.yumi-bloom` computed display |
|---|---|---|
| `#scan` viewfinder | **true** | **none** |
| `#scan` review screen (`scanRenderReview`) | **true** | **none** |
| `#scan` walker open (`scanOpenWalker`) | **true** | **none** |
| `#books` populated (N=7) | false | flex (z9999, bottom-right) |
| `#books` empty (N=0) | false | flex (z9999, bottom-right) |

- **On the scan surface — viewfinder, review, AND walker — the FAB is genuinely hidden
  (`display:none`) in the current bytes (v3.277).** `scanGoScreen` switches screens
  without a route change, so `scan-active` persists across the review and the walker;
  the rule holds throughout. The prior recon's claim was correct AND is now confirmed by
  rendered state.
- **On the Shelf the FAB IS present** (correctly — `scan-active` false there), z9999,
  fixed **bottom-right** (rect ≈ left 324 / right 366 / bottom 710). The Shelf add is
  **bottom-left**: fixed `.shelf-add-primary` (left 24 / right 144 / bottom 710) and, on
  the empty shelf, the centered `.shelf-empty-zero-add` (left 135 / right 255). **At 390
  the FAB overlaps neither** (opposite corners; overlap test = false in both shelf
  states).

**Resolution.** The device evidence — FAB over "Review 7"/"Not a book" on the scan
surface, and over "+ Add a book" on the Shelf — **does not reproduce at v3.277.** On the
scan surface the FAB is hidden in every state; on the Shelf it is present but clear of
the add. The overlap the device shows is exactly what a **pre-`scan-active` (FX-E) build
would render** (visible FAB at bottom-right would sit over the review Shelve button, rect
left 126 / right 372 / bottom 720, and the walker foot). Most consistent explanation:
**a stale-cached bundle on Preston's iPhone** — the SW serves the prior build until the
"new version — Reload" banner is accepted (L5, stale-cache false reads). Recommend a
**fresh, dated device capture on a hard-reloaded v3.277** (CAPTURE PROVENANCE) before
treating the FAB overlap as a live v3.277 defect. The one genuine live truth here is that
**the Shelf FAB is present** (by design) — if Preston wants it gone near the add on the
Shelf, that is a separate, real placement question, not a scan-active failure.

---

## S6 — BUILD SHAPE + FORKS

### Build-shape recommendation (given S1 + S2)
Two tiers, cleanly separable:

**TIER 1 — ACCEPT + CANDIDATE-PICKER (SMALL).** The ranked candidates are already in
hand (`item.alternates`, and `resolved.book`), and the accept plumbing already exists
(`scanResolveStep('picked', cand)`, 8982). The build is additive to the walker:
- S1a — **Make the best guess acceptable.** Offer an explicit "Yes, add this" that
  shelves the vision reading (title+author, no-ISBN manual add is safe) — closes the
  exact reported gap (correct spine, no way to accept).
- S1b — **Include `resolved.book` in the candidate list**, not just `alternates[1..5]`
  (currently the top pick is dropped from the picker).
- S1c — **Reconsider the walker's `candidateIsPlausible` ISBN-required gate**, which
  hides real hits lacking an ISBN.
- S1d — **Make "Search on the Shelf instead" carry the title/author** (pre-fill /
  actual query) instead of a bare `#books` nav.
Scope: `views.js` scan block + a little CSS. No data-model change. Low risk.

**TIER 2 — MATCHER QUERY/RANKING (MEDIUM).** Improve `resolveBook` (integrations.js):
quote multi-word `intitle:` phrases; widen the candidate window past 6; possibly
consult `titleCloseness` before discarding. **Higher blast radius** — `resolveBook` is
**shared** with the manual ISBN/title add and the desktop drop-zone, so it carries a
regression surface and needs the full smoke. Note the scan path currently ignores
`resolveBook`'s own strong/weak verdict (§S2) — worth reconciling.

**S3 fold fix is orthogonal and cheap** (one-line default-status change in `scanShelve`/
`scanCommitBook`), but it is a **product decision** (fork DF-1), not mechanical.

Sequencing: **Tier 1 first** (closes the felt defect, small, low-risk), then decide
Tier 2 against a *keyed* GB reproduction (Tier 2 cannot be verified keyless — see the
quota blocker). S3 and the S4 honest-state cluster can ride Tier 1's commit as they
touch the same scan block.

### FORK CARD (genuinely unruled — Preston's call)

- **DF-1 · scanned-book default status.** `reading` (current, case fails the fold by
  −141) vs `will-read`/`read` (case clears by +125, desk says "Nothing in hand right
  now"). *Recommend `will-read`* — it is the measured fold fix and arguably more honest
  for a bulk scan, but it changes what the desk says about fresh adds, so it is yours.
- **DF-2 · accept semantics.** When the user accepts the best guess with no plausible
  GB candidate, add it as a **no-ISBN manual book** (vision title/author) vs **re-run a
  better GB search** first. *Recommend manual-add as the primary accept* (always
  available, never blocked on GB), with a secondary "search better."
- **DF-3 · Tier-2 timing / verification.** Tier 2 (matcher) cannot be reproduced or
  verified without `GOOGLE_BOOKS_API_KEY` (keyless quota is now 0). *Recommend* deferring
  Tier 2 until a keyed repro path exists; ship Tier 1 + S3 + S4 first.
- **DF-4 · S4 copy/state cluster scope.** Fold the six honest-state items (static badge,
  recompute wording, "Shelve 0" disabled state, title-clip ellipsis, guide teardown,
  capdoor dev-note) into Tier 1's commit, or split a dedicated honest-state pass?
  *Recommend* folding a–e into Tier 1; treat (f) the capdoor dev-note + mobile
  opacity:1 hide as its own small fix (it's a capture-surface bug, not scan).

Non-goals honored: no fixes, no app-file edits, no `sw.js` bump, no frame/camera
geometry, no nav/header design, no R10 S2, no Builder regen, no push. No re-opening any
non-goal.

### Residuals / honest limits
- **S2 live ranking UNREPRODUCED** — keyless Google-Books quota is zeroed
  (`quota_limit_value:"0"`); the two-book fall-off is reasoned from source, not measured.
  Needs a keyed repro.
- **S5 device overlap UNREPRODUCED at v3.277** — hidden in every scan state in the rig;
  most likely a stale device bundle. Needs a fresh dated hard-reloaded device capture.
- **d — the pixel "looks like a 1/:"** is a visual-gate read (pane can't screenshot); the
  overflow geometry is proven, the exact glyph artifact wants Preston's eyes.
