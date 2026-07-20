# R-POLISH B3 — BUILD · SESSIONS 1–2

Model: Opus 4.8, default effort (ultracode OFF) · gate agents Sonnet ·
base HEAD `989e175` (v3.233) · Stage-0 recon: `docs/checkpoints/r-polish-b3-recon.md`

**SESSION 1** shipped AES-1, AES-2, AES-5a and the `--m1` rider, committed LOCAL at
`124fe99`. **SESSION 2** (this file's second half) finishes the batch: AES-3, AES-4,
AES-5b, the ✎ re-wire, Book Detail XL, the Profile dawn seam, and the `--m1` darken.

**STATUS: BATCH COMPLETE, LOCAL ONLY. Awaiting Preston's felt pass and push word.**
`sw.js` bump to v3.234 + the `lumen-amber.css` byte-lock re-baseline ride the SHIP
commit, as ruled.

---

## SESSION 1 — DONE + VERIFIED (unchanged, see `124fe99` for full detail)

### AES-1 · THE GLOWS RETIRE — both mechanisms
Mechanism A (the Field's halo, `arc-constellation.js:871/882`) retired via CSS on the
renderer's OUTPUT — `fill` is a presentation attribute and loses to any CSS rule, so the
locked renderer stays byte-identical; selected by `circle[r="54"]`. Mechanism B
(`PraxisMarks`) retired by dropping the `var(--mk-glow)` read at `lumen-amber.css:177` —
one ruled line in a byte-locked file, re-baseline authorised. `marks.js` untouched.
THE SPLIT, as ruled: only `fill` is touched; `opacity` still carries `lum(maturity)`.

### AES-2 · ONE WORLD, SHEETS ON IT — Shelf + Notebook
Both were still running the PRE-HOME mechanism (own opaque full-bleed fixed ground).
Deliberately NOT transparent — they keep dark ink, so transparency would have put dark
text on the twilight world. The sheet becomes the lit surface; the world shows in an
18px margin (`--sheet-gap`). Every internal layout rule, column and card untouched.

### AES-5a · THE DOG-EAR — ours, not the asset's
`integrations.js:1975` already stripped `&edge=curl`, but two read sites (`:1812`,
`:1913`) took `imageLinks.thumbnail` raw. Fixed at both, plus the load-time normaliser
in `state.js` so covers ALREADY STORED heal. Same rewrite class, same field, no new
write path.

---

## SESSION 2 — DONE + VERIFIED LIVE

All measurements taken on the committed rig (`.claude/rig/`) at a **fresh origin**,
signed in as the `d0tester` stub, after asserting the served bytes were mine.

### RIG NOTE, worth keeping — "fresh port is a lie", confirmed again
Port 8790 was serving a **stale `praxis-v3.230` service-worker cache from an earlier
session**: every CSS assertion read false and `praxis-kit.css` was not even in
`document.styleSheets`, while `fetch()` of the same files returned the new bytes. The
document was stale; the server was not. A brand-new port (8797) loads uncontrolled on
first navigation and read clean. **Assert your bytes in the DOCUMENT before measuring —
a fetch() probe does not prove what the page is running.**

### AES-3 · THE ARC HEAD LEARNS THE KIT
Inventory found the real defect: **three control families wearing the same gold pill**,
and the loudest thing in the head was a view toggle.

| Control | Before | After (measured live) |
|---|---|---|
| faces `.seg-opt.is-on` | **filled gold gradient** | lifted paper `rgb(246,236,212)` = `--lum-base` |
| `.seg` trough | flat | carved, `inset 0 1px 2px rgba(80,50,15,.12)` |
| `+ Sub-theory` | gold *outline* | **the ONE filled gold** `linear-gradient(#C79433,#A8761A)` |
| `.arcfield-life-btn` | gold border + gold text | quiet, `rgba(38,32,25,.18)` border, ink-2 |
| `.arcfield-status-chip` | bordered pill | neutral state wash `rgba(38,32,25,.05)` |
| `.arc-detail-delete` | outlined pill | `order:99`, borderless, mono, `--lum-ink-3` |

**Filled-gold controls in the head: 1** (`+ Sub-theory`) — CC-3 restraint satisfied.
**DELETE's confirm panel PRESERVED** — `.arc-confirm-panel` opens, 127px, visible, with
its "Delete arc / Cancel" actions and the arc intact. Only the trigger was re-skinned.
**MW-2 P3 mobile touch targets INTACT at 390** — all 7 header controls measured 44px.
This was the live risk (the block is LATER in source than the `<=759` blocks at
`:12969-12973` / `:13136-13139`); it holds because the block declares neither `display`
nor `min-height`.

### AES-4 · THE STYLED-NATIVE SELECT
`appearance:none` + kit dress + a caret drawn from **two `linear-gradient`s, not an SVG
data URI** — a data URI bakes a literal hex no token can reach, and gradients take
`currentColor` / a token instead. This also retires the deferral at `components.css:8920`
("a custom caret would need new hex or a third file"): no hex, and `praxis-kit.css` IS
that third file since B1. That stale comment is corrected in this diff.

Measured live: `appearance:none` · caret gradients present · `background-color` survives
the earlier `background` SHORTHAND · still a **native `<select>`, 6 options, aria-label
intact, not disabled** · at 390: `min-height:44px`, `font-size:16px` (no-zoom).

`.k-select` is defined in the kit as the reusable dress. **It is NOT adopted by class
here** — nothing in the app carries `class="k-select"`; this surface's rule is an
independent re-statement, because the per-surface `background` shorthand at (0,3,0)
outranks any 0,1,0 kit class. The comment says so plainly (the red-team caught the
original wording claiming adoption).

### AES-5b · PLATE-FRAME + CARVED EDGE
Three thumbnails were three grammars: `.home-wf` a plate with no edge, `.home-arcfield`
a **raised** border-frame, `.arc-const` no plate at all (a flat band with a bottom rule).
Converged on the `.home-wf` plate + the CC-2/RD-1 **carved** edge (inset shadow + inset
hairline) — a miniature of a carved field should not be raised.

Measured on the Arcs index: `margin:11px 11px 0` · `border-radius:12px` · bottom rule
gone · `inset 0 2px 10px rgba(38,32,25,.16), inset 0 0 0 1px rgba(38,32,25,.1)` ·
parchment fill matching the precedent.
**The hover affordance was rebuilt, not orphaned:** `.home-arcfield`'s hover animated
`border-color`, and the carve removes the border. The hover now drives the inset hairline
gold. (The original `border-color` hover rule is left in place and INERT — logged in the
comment so the next reader is not misled.)

### ✎ MARG-EDIT · THE PENCIL, RE-WIRED
The trick is small because the machinery existed: `onSave` already branched on `entryId`,
so seeding it routes saves down an UPDATE path that had been unreachable since the
function was written. No new write path, no new record, no schema change.
Owner-gated **twice** — at the render gate in `buildMargCard` and again at the seed in
`openMarginaliaEditor`, so no caller can reach another user's entry by passing an id.

**End-to-end, driven through the real UI:**

| Check | Evidence |
|---|---|
| create path still works | typed via the real composer → entry `…743988_741971` created, `filed:true`, correct `bookIds` |
| pencil renders owner-only | **4 cards, exactly 1 pencil** — the 3 `__praxis_seed__` cards have none |
| signed-out | `praxis_user` null → **0 pencils** on the same 4 cards |
| opens pre-filled | editor text === the stored body, exactly |
| open creates nothing | 17 entries before, 17 after |
| save UPDATES, no duplicate | same id; 17 → 17; still exactly 1 `d0tester` entry |
| no field corrupted | ONLY `body` + `updatedAt` changed; `userId`/`register`/`bookIds`/`arcIds`/`images`/`filed`/`isPrivate`/`createdAt` all preserved |
| mobile | 44×44 at 390 |

### BOOK DETAIL XL
The `>=1200` block hard-capped `.bk-shell` at 1200px, sized when 1200 WAS the wide tier.
Re-tuned to the XL-1 **detail archetype**, matching the house pattern exactly (the arc
Field's own `>=1600` tier and Home's):

| Width | Before | After (measured) |
|---|---|---|
| 1920 | 1200/1920 = 62.5% | **1560 → 81.9%** |
| 2560 | 1200/2560 = **46.9% FAIL** | **1560 → 61.3% PASS** |

Grid resolves to `1136px 380px`; the cap deliberately STOPS at 1560 (compose, never
stretch). Mobile unaffected (`max-width:none` at 390, no h-scroll).

### PROFILE · THE DAWN SEAM
`.pf-hero` was a fully opaque radial with no light stop — dark → light happened the
instant its box ended. **The ramp could not simply fade the hero's bottom**, because
`.pf-hero-dock` is the hero's LAST child and its text is `--text-on-dark`: fading through
it would have put light text on a lightening ground (the exact coupling trap AES-2 hit on
Shelf/Notebook). So the hero grows a dawn band BELOW the dock and the ramp lives there.

Final measured stack: **ramp `z-index:1` < hairline `z-index:2` < dock `z-index:3`**,
ramp height 76px == `padding-bottom:76px`, **ramp overlap into dock content = 0px**,
`.pf-taphint` clears the ramp by 14px. Identical at 390 and at the `>=1200` tier.

### `--m1` ON-GROUND — DARKENED, **AND MADE TO ACTUALLY REACH THE PIXELS**

Darkened as ruled: `#B08A25` (3.067:1, no margin) → **`#9D7A20` = 3.811:1** on the
parchment field. And its EDGE, which session 1 missed: `--m1-edge` feeds
`--subtheory-{1,6,11,16}-edge`, so it renders on these same surfaces; at `#A67F1E`
(3.517:1) it was about to become **darker than the new fill**, inverting the carve — an
edge is a shadow, never a highlight. New `--m1-edge-on-ground: #725814` holds the edge at
0.50× the fill's luminance, the same ratio the ratified pair holds.

**THE CORRECTION TO SESSION 1 — the rider was INERT, and this is the lesson.**
Session 1 scoped `--m1:var(--m1-on-ground)` on the three light-ground consumers and
reported "3.07:1". Measured live this session: `--m1` inside that subtree did read the
on-ground value — **but the mark glyphs paint `fill="var(--subtheory-6)"` /
`var(--subtheory-16)`, and those still computed to the ratified `#D9B24A` at 1.92:1.**
`--subtheory-N: var(--m1)` is DECLARED at `:root` (`theme.css:377-392`, `:706-721`), so
it substitutes ROOT's `--m1` at computed-value time and inherits down as an
already-resolved colour. **A custom property resolves where it is DECLARED, not where it
is USED** — re-pointing `--m1` in a descendant cannot reach it. Session 1 measured the
lever; the pixels never moved.

Fixed by re-declaring all four slots + their `-edge` twins in the same scope. Re-measured
live: glyph bodies now compute `rgb(157,122,32)` = `#9D7A20` = **3.811:1 PASS**.
(The halos read 2.461:1 and that is correct — they are the blurred decorative
`--mark-glow` AES-1 deliberately unified to one gold, not the informational shape.)

---

## WHAT THE GATES CAUGHT (all fixed and re-verified live)

The value of this session was mostly in what the gates found, not what the build wrote.

1. **D2 regression, mine, caught by the rig.** Widening the content column pushed
   `.bk-atext` from ~54ch to a measured **83.4ch** — over the 72ch floor, at 1920 AND
   2560. It was not in the `>=1200` cap list, correctly, because it did not exceed there.
   Capped at `>=1600` only, the tier that caused it. Re-measured: **71.9ch**.
2. **Session 1's `--m1` rider was inert** — above.
3. **RED-TEAM BLOCK — silent stuck "Saving…".** `flushSave` calls `cueSaving()` BEFORE
   `onSave`, and `cueSaving` sets no self-resolving timer. The update branch's
   `if (!entry) return;` therefore left the cue on "Saving…" **forever** while the edit
   was discarded — the user is told it is saving, and it is not. Reachable in normal use:
   the notebook load path REPLACE-clears `notebookEntries` and re-splats the remote set,
   so another tab or device deleting the entry lands here. **B3 is what makes this branch
   reachable on an ordinary edit** (previously it needed a same-session create-then-delete
   race). Fixed with `report.setLocal(false)`. Verified live: cue reads **"Couldn't save"**,
   not stuck.
4. **REVIEWER HOLD — the stuck-cue fix was INCOMPLETE, and I had called it complete.**
   The same `onSave` carries a sibling early return, `if (!user) { return; }`, with the
   identical defect. `getCurrentUser()` is a **fresh `localStorage` read on every call**
   (`integrations.js:660`), not a cached value, so a sign-out or session expiry landing
   inside the autosave debounce reaches that line with the cue already on "Saving…" — the
   same silent-discard, one branch over. Fixed the same way. Verified live by signing out
   under a live editor and typing: cue reads **"Couldn't save"**, and the stored body is
   **untouched** (the write was correctly refused, not half-applied).
   The third early return, `if (body === '') { return; }`, is **correctly left bare** and
   now says so: `flushSave` guards `trimEdge(v) === ''` BEFORE calling `cueSaving()`, so
   an empty doc never reaches `onSave` with a cue showing. Two of three guards needed the
   treatment; the third would have been noise.
5. **RED-TEAM BLOCK — the gilded hairline was hidden.** `.pf-hero::before` carried
   `z-index:1`; `.pf-hero::after` had none. **A positioned box with a positive z-index
   paints in a later step than one at `z-index:auto`, so source order does not save it** —
   the ramp painted clean over the hairline, and at `bottom:0` the ramp is at its 100%
   stop, fully opaque. My own earlier check read `afterZ:"auto"` and *inferred* the
   hairline was on top; it never verified visibility. Fixed with an explicit `z-index:2`.
6. **RED-TEAM CONCERN — the ramp reached into the dock.** At 104px it overlapped the
   dock's box by 28px and its content by ~14px, where `.pf-taphint` sits, so "nothing
   readable ever sits on the ramp" was false as measured. Ramp pinned to 76px == the
   padding band. Overlap now **0px**.
7. **THE UPDATE BYPASSED A SANCTIONED ACCESSOR — caught by reading the studio ledger, after
   both gate agents had passed it.** `docs/studio/r-arc.md` records that **ROOM-2 (v3.226)
   already built durable editing** at the `#note/<id>` door, and `r-polish-charter.md`
   warns in as many words: *"never silently double-own it."* So I checked whether this
   pencil duplicates that path. The affordance does not — book-detail.md defines this gap
   as exactly "no re-entry with prefill" + "no affordance on Book Detail's marg cards",
   and says "a real, wired pencil returns here when MARG-EDIT ships". **But the WRITE did.**
   The note door writes through `updateNotebookEntryBody` (`state.js:2455`); my branch
   hand-wrote `entry.body` / `entry.updatedAt`. That accessor carries a **NO-TOUCH-WRITE
   guard** (`en.body === body` → no bump, no dirty flag) that **ROOM-2's own red-team added
   as finding N3** — so hand-writing here silently reintroduced a defect this codebase had
   already paid to fix. It is reachable: `lastSaved` is re-initialised on every re-open, so
   a blur with no edit reaches the branch. Routed through the accessor; both doors onto the
   same record now converge on ONE write path. Re-verified live, three ways:
   **(A)** open + blur with no edit → `updatedAt` **unchanged at its seeded 1000** ·
   **(B)** real edit → body changed, `updatedAt` bumped, `createdAt` preserved, 18→18
   entries, every other field intact · **(C)** entry deleted mid-edit → **"Couldn't save"**,
   not stuck, and not resurrected. Neither gate agent caught this — the reviewer graded
   accessors by looking for raw Firestore calls, which this never had.
8. **Three comments claimed more than the code did** — `.k-select` "adopts it" (nothing
   carries the class), AES-5b "rewrote the hover" (the old rule is left inert, not
   rewritten), and "the exact ratio" (0.4965 vs 0.5005). All three corrected. This is the
   COPY-IS-A-CONTRACT lesson applied to code comments.

---

## MECHANICAL GATES

| Gate | Result |
|---|---|
| `tools/parse-check js/views.js` | **PASS** |
| ES3 in added CODE lines | **CLEAN** — no `const`/`let`/arrow/backtick/`class` (backticks appear only inside prose comments, established house style) |
| dirty set | exactly the 4 intended files |
| `js/arc-constellation.js` | **0 diff** |
| `assets/marks.js` | **0 diff**, 10,255 B — lock intact |
| `assets/lumen-amber.css` | **0 diff this session**; 14,966 B — re-baseline rides the ship commit |
| CSS brace balance | balanced in all three sheets |
| console | clean on every surface driven |
| D3 h-scroll | none at 1920 / 2560 / 390 on Book Detail or Profile |

### Byte deltas (LF-normalized, vs `124fe99`)

| File | Delta |
|---|---|
| `assets/components.css` | +15,616 |
| `assets/praxis-kit.css` | +1,376 |
| `assets/theme.css` | +826 |
| `js/views.js` | +4,326 |

**BAND NOTE — the total is OVER, the code is UNDER, and both are stated plainly.**
The ✎ item's declared band was ~40-70 lines / ~1.5-2.5 KB. Final `views.js`:

| Measure | Declared | Actual | Verdict |
|---|---|---|---|
| total added lines | 40-70 | **79** | over |
| CODE lines | (of that band) | **31** | under |
| CODE bytes | 1,500-2,500 | **1,222 B** | under |
| comment lines | — | 48 | — |

The **code came in BELOW estimate** — the estimate anticipated writing an edit path, and
the machinery already existed, so seeding `entryId` was most of it. The total exceeds the
line band on **comment mass alone**, which clears by the two-figure rule (code band = hard
ceiling; comment allowance clears by line classification). No logic overage — the deviation
is in the opposite direction from the one that halts.

The comments grew for a traceable reason: two red-team BLOCKs, one reviewer HOLD, and the
accessor finding each demanded its reasoning recorded **at the fix site**, not just in this
file — the stuck-cue race, the z-index painting rule, why the third guard is deliberately
left bare, and why the update must go through `updateNotebookEntryBody` are all non-obvious
enough that a future reader would otherwise "simplify" them straight back into defects. The
code shrank as the reasoning grew: routing through the accessor DELETED a hand-rolled guard
and its fields, which is why CODE fell from 33 lines to 31 while comments rose.

### EOL
`git ls-files --eol` shows `i/lf` for all four files; every HEAD blob carries **0 CR
bytes**, so the working-tree CRLF is immaterial to what commits (the diffstat test alone
is necessary-but-not-sufficient here, per the DW-STP2 caveat — this is the direct check).

---

## RESIDUALS (honest, none blocking)

- **`.k-select` is defined but unconsumed.** The other four native selects
  (`views.js:6712` genre · `:9436` tradition · `:9467` category · `:20459` send-target)
  keep their OS skin this batch — out of AES-4's ruled scope, which named one anchor.
  They adopt `.k-select` when their surfaces are next opened. **Named kit debt**, joining
  `.k-listbox` (presentation, zero behaviour app-wide).
- **`.arc-detail-delete` hit width narrowed.** The quiet treatment drops the old pill's
  `padding:7px 14px`; vertical 44px is preserved by the surviving mobile rule (verified),
  but horizontal hit area is now text-width. Acceptable for a cornered text link and
  consistent with the base rule's grammar — logged, not fixed.
- **The pencil's caret lands at position 0** on open, so typing without clicking prepends.
  Users placing their own caret are unaffected. Fixing it means touching
  `writing-canvas.js` focus behaviour, which is shared surface — out of this batch's scope.
- **Pre-existing D3 at 390 on the sub-theory workshop**: `.rf-card` / `.rf-kind` /
  `.rf-body` and the Yumi bloom FAB overflow to 506px. **Not mine** — none of those
  selectors appear anywhere in this diff. Logged for the room-field owner.
- **AES-5a latent bug — `?edge=curl` as the FIRST query param produces a malformed URL.**
  Verified live: `normalizeCoverUrlsToHttps` correctly strips the curl, upgrades http →
  https, and is **idempotent** (second run reports `changed:false`). But
  `.replace('?edge=curl','')` removes the `?` as well, so
  `…/content?edge=curl&id=Y` → `…/content&id=Y` — the query separator is destroyed and
  that cover would 404. **Not reachable with real Google Books URLs** (they always lead
  with `?id=`, so `edge=curl` is never first), and the idiom is **pre-existing** —
  `integrations.js:1985` shipped it long before B3; session 1 copied the established
  form to two more sites. Correct general fix is `?edge=curl&` → `?` plus
  `&edge=curl` → `''`, across 4 sites in 2 files. **Out of this batch's ruled scope —
  surfaced for Preston's call rather than carried silently (THE FORK RULE).**
- **`.lum-yumi p` measure unverified** on Book Detail: `rootedSubTheories` is owner-filtered,
  so the signed-in stub renders no whisper. It is already in the `>=1200` cap list; the
  widened tier does not remove that cap.
- **Line-number citations inside this session's new comments have drifted.** Several
  pointers (AES-3's diagnosis table; the residual-selects list) were drafted before later
  edits earlier in the same files shifted everything below them. The reviewer independently
  confirmed the underlying CLAIMS are true — four control families did wear the same gold
  pill; four native selects do remain unconverted — only the pointers slipped, the same
  non-blocking class as prior S6b/S8/R8-RF1 slips. Left as-is rather than renumbered by
  hand, which risks introducing fresh errors into comments; flagged here so a reader
  treats those specific line numbers as approximate.
- **VISUAL GATE outstanding.** Everything above is geometry, computed style and live DOM.
  Screenshots are proven dead in this headless pane (D0 §2), so **none of this is a look**.
  The dawn seam, the plate carve and the arc head's new hierarchy are exactly the kind of
  change CLAUDE.md says is not done until Preston's eyes pass it.

---

## SHIP CHECKLIST (nothing below is done yet)

1. Preston's felt pass on the seven items.
2. On his exact words: SHIP commit carries `sw.js` **v3.233 → v3.234** (read at commit
   time, +1, never a hardcoded target) and the `lumen-amber.css` byte-lock **re-baselined
   to 14,966 B** in CLAUDE.md / wherever the lock is carried.
3. Regen the Builder — this IS the push point (BUILDER CADENCE).
4. Push, wait for Netlify, hard-refresh, confirm v3.234 in DevTools, then run the deployed
   live-smoke: one-world margins · single-hue gold halos with density opacities ·
   normalized arc header · dressed select · healed covers on *Empire of AI* and
   *All About Love* · dawn seam · pencil opens the editor · console clean · 390 + 1920.
