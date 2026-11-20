# L4f — Home's sky follows You's rule: a thread from each orb, and a full sky drifts with every name

L4f STARTED 20 Nov 2026 (Opus 5.5, executing the written patch). Base e9119d5 / v3.335.

20 Nov 2026 · Opus 5.5 executing an already-written, already-measured patch (written and measured by the review chat on a
clean clone of main at `e9119d5`), applied byte for byte on main at `e9119d5` (v3.335) == origin/main. Preston's go-ahead
included "run fix-red-team on this". **Status: built, local until committed and pushed.** CACHE_VERSION `praxis-v3.336`.
**js/hand.js is NOT touched and stays locked at `dc6a021e5b89652cf5e6c0a84ae249cd` (53,596 B).**

## Rulings, worded as given (20 Nov 2026)

- **R1** My phone check of L4e at v3.335: PASS on every step. The orbs drift with their names, the threads and the flower's
  colours are there, a moving orb opens its page and Back returns, the Threads switch works, the sky re-lays itself when the
  phone turns, the List turns as before. "It looks amazing."
- **R2** I want those changes made to Home as well. Home's sky follows the same rule as You's Lenses sky (L4e R5 and R7): a
  thread from each orb to the flower, and a full sky (the engine's own "many" or "tight") drifts with every name; a sky with
  only a few lenses keeps circling as it does now. This supersedes the last sentence of L4e's R4 ("Home's sky does not
  change").
- **R3** It is its own small build, next, ahead of the Shelf, and takes v3.336.
- **R4** On L4e's residual R-1 (only the phone's Reduce Motion can stop the sky): ship as it is; a Motion switch in the sky's
  sheet is its own later build, before the beta. Not this build.
- js/hand.js is NOT touched by this build and stays locked at dc6a021e5b89652cf5e6c0a84ae249cd (53,596 B).
- **Ruled at Checkpoint 2 (20 Nov 2026):** the 2.2 timing bar failed on this host at 12 and 20 lenses, as it does at
  e9119d5 for the same cases (§ 2.2). Preston: "Accept, go to red-team".
- **Ruled at the Stage 4 report (20 Nov 2026), on the red-team's F2:** "accept it as a residual and commit. Home keeps You's
  rule for now. A height cap for Home's sky on phones is its own decision before the beta, built alongside the Motion switch."
  The two extra doc files (the seventh-r8 amendment note and docs/studio/home.md) are accepted.

## A choice the review chat made — Preston's to overrule

From 1200 px wide, Home's sky is the pinned left column (seventh r8). A drifting sky can be taller than the screen (the review
chat measured the column at 951 px on a 900 px screen with 20 kept lenses), and a pinned column taller than the screen can never
show its own foot (the counts and the Lenses door). So while the sky is fixed the column is not pinned and scrolls with the page;
with a turning sky it stays pinned exactly as now. **Recorded as the review chat's choice, for Preston to overrule if he
wishes.** Measured here (§ 2.5): "never" is too strong — a pinned column taller than the screen shows its foot only at the very
end of the page (with a long right-hand column: counts first fully in view at scroll 1,600 of 1,739 pinned, at 157 un-pinned).
The line stands; its reason is "only at the very end", not "never".

## What was built

- **js/views.js** `lxHomeSky`: after `rec.S.toggles(lxSkyToggles())`, one line —
  `rec.S.toggles({ auto: true, drift: true, stems: lxSkyToggles().threads });` — the three toggles L4e gave You's Lenses sky.
  `lxSkySheet`: the Threads switch sets `stems` on whichever sky opened the sheet (it was You only), and its small print is the
  one line on both skies: "A thread from each orb to your flower, and between lenses that share a book".
- **assets/components.css**: one block after the L4e block — at 1200 px and wider, Home's sky column is `position:relative`
  while its field is `fixed` (`.home-page.lum-amber-deep.home-sky-on > .sky.lx-sky:has(.field.fixed)`).
- **sw.js**: `praxis-v3.336`.

## Stage 0 — pre-flight: PASS

- HEAD `e9119d5` == origin/main; CACHE_VERSION `praxis-v3.335`; tracked tree clean; hook gate ARMED; FIX-PROTOCOL v1.3.
- Protocol docs found: CLAUDE.md, PROTOCOL.md, docs/FIX-PROTOCOL.md, CRAFT.md, BOARD.md, the seven `.claude/agents/` files,
  docs/studio/sequence.md, docs/studio/lessons.md, docs/checkpoints/l4.md, l4e.md (ledger R-1, E-L1–E-L9, S-5), l4d.md,
  docs/studio/l4-lens-engine-contract.md. Missing: none. Node is blocked on this machine; the parse check is `tools/parse-check`
  (cscript JScript).
- Before-numbers (HEAD blobs, and working tree LF-stripped): views.js 1,407,990 B `186524e5…`, components.css 952,708 B
  `2e058502…`, sw.js 6,894 B `6f995589…` — MATCH. Unchanged files: hand.js `dc6a021e…` (53,596 B), state.js `b8cdafb5…`,
  integrations.js `2d86b859…`, theme.css `571e0ccc…`, lumen-amber.css `631bc2aa…`, marks.js `772886c0…` — MATCH.
- The diff, extracted to scratch: 57 lines, 3,275 B, md5 `c47d2078bd9ce4f6979c6c218d612970` — MATCH; non-ASCII § ×1, — ×3,
  ’ ×1. `git apply --check` clean; applied to pure-LF scratch copies: the three after-md5s exact.
- Home's other states (code read): no lenses, one lens, offers only and before the yes draw the sky through the same
  `lxHomeSky` path (one lens never drifts: the engine needs more than one orb); `?sky=off` never reaches it; Home never uses the
  compact sky. Nothing outside `lxHomeSky` / `lxSkySheet` sets toggles on Home's sky; the only rule that pins it is
  components.css's seventh-r8 block; no JS reads its height. `lxRefresh` / `lxAfterLensWrite` re-render Home on a lens write.
- Nothing reserved v3.336; `docs/checkpoints/l4f.md` did not exist.

## Stage 1 — apply: PASS

Applied with `git apply --cached` then the three files checked out from the index (the working tree keeps CRLF; the blobs are
LF). Staged blobs (`git cat-file -p :<path>`):

| file | bytes | md5 | expected |
|---|---|---|---|
| js/views.js | 1,408,106 (+116) | `d40e7a230df67996380c720c784fbb9f` | exact |
| assets/components.css | 953,259 (+551) | `c77cf65ba2f54b459273b264a5f57122` | exact |
| sw.js | 6,894 (+0) | `b03bd4308bd650746cb10258efcfc57d` | exact |

numstat `3 2` · `6 0` · `1 1`. `tools/parse-check` PARSE OK on all 19 js/*.js files and sw.js. The added views.js lines hold
no `const `, `let `, `=>`, `class ` or backtick (0). `git ls-files --eol`: i/lf w/crlf on all three, as before. The six
unchanged files at their numbers.

## Stage 2 — measure, test and look (headless Chrome over CDP, CSS animations ON, 20 Nov 2026)

Rig (untracked, never staged): `.claude/rig/captures/l4f/` — `l4f-rig.js` (Home probes, `window.L4F`, on top of the L4e
chain), `l4f-run.ps1` (head copied from `../l4e/l4e-head.ps1`), helper scripts, logs `log-*.txt`. Served by
`../l4b2bhf1/serve-root.ps1`: **8882 the working tree (AFTER)**, **8883 a `git archive` of e9119d5 + the rig files (BEFORE;
its views.js, components.css, sw.js and hand.js re-md5'd to the e9119d5 blobs)**. Fixture: the L4e one — the l4 fixture + hf1
+ the realistic 17-category shelf (239 books) from `L4E.seed()`; kept lenses by `l4Show(n)` (35 extra lens records in memory
for 20 / 30). 320–430 = phone emulation (dpr 2, 844 high); 560 and up dpr 1, 900 high. Nothing reaches Firestore. The served
sw.js reads `praxis-v3.336` (AFTER) and `praxis-v3.335` (BEFORE).

### 2.1 Suites at their e9119d5 counts — PASS
lens-eval 68/68 · lens-data 101/101 · export 58/58 · delete 58/58 · ceiling-core 36/36 · fx1c-sim 60/60 · L4b-1 hotfix 46/46 ·
L4b-2a unit 71/71 · L4b-2a hotfix 1 unit 74/74 · L4b-2b unit 120/120 · L4b-2b hotfix 1 unit 74/74 — each read by its own printed
total, all exit 0.

### 2.2 The engine's time on Home — FAIL on this host at 12 and 20 lenses (both builds); accepted by Preston
`S.place` wrapped (L4D.start/stop), CPU 4×, 10 s per case. **Quiet run** (host CPU 3 % before, 4 % after, by
`Win32_Processor.LoadPercentage`; no other rig running), `log-perf-*.txt`:

| Home case (kept) | BEFORE 4× mean / p95 ms | AFTER 4× mean / p95 ms | AFTER fps (rAF) · worst 1 s |
|---|---|---|---|
| 390 (3) | 0.52 / 2.2 | 1.21 / 2.6 | 16.7 · 13 |
| 390 (12; AFTER drifting) | 2.65 / 8.8 | **3.94 / 9.7** | 8.2 · 5 |
| 1360 (3) | 0.82 / 2.6 | 1.26 / 3.9 | 15.1 · 9 |
| 1360 (12; turning in both) | 2.71 / 6.0 | **3.46 / 9.4** | 7.8 · 6 |
| 1360 (20; AFTER drifting) | 4.23 / 13.1 | **6.24 / 13.9** | 5.6 · 3 |

**The bar (AFTER mean < 2 ms, p95 < 5 ms) fails at 12 and 20 lenses; BEFORE fails it in the same cases.** The control: a second
run (20 s windows, host 15 % → 43 %, `log-perf2-*.txt`) timed You's drifting 12-lens Lenses sky — code this build does not touch,
which L4e passed at 1.41 / 4.0 — at **3.25 / 8.9 (AFTER build) and 4.32 / 13.6 (BEFORE build)**: this host measures the same sky
2.3–3× slower than L4e's quiet run (S-5). In that run Home's drifting 12-lens sky at 390 was **2.86 / 7.3** — no dearer than
You's. CPU 1× (same run): AFTER Home 390 (12) 0.36 / 0.7, 390 (3) 0.18 / 0.3, 1360 (12) 0.48 / 0.9, 1360 (20) 1.28 / 1.8; every
AFTER case under the bar at 1×. Hand-stepped attribution (`log-attr-*.txt`, host 47–52 % — noisy at 4×, steadier at 1×): at 1×
the stems cost 0.1–0.3 ms a frame (Home 390 (12) 0.40 as is, 0.25 without stems, 0.22 without drift; 1360 (20) 0.76 / 0.42 /
0.43); no in-memory change brings 1360 (20) under the bar at 4× (4.7 ms without stems, 4.0 without drift) — the rest is the
existing engine at 20 orbs. `PraxisHand.stats()` over each whole session: 12.0–14.0 fps AFTER, 12.1–15.7 BEFORE. Headless Chrome
on this machine is not an iPhone; the contract §6 gate stays owed.

**The first two seconds on Home, 12 kept lenses at 390, CPU 4×** (`log-load-*.txt`; Shelf → Home, three runs each — a route
entry, not a cold load: the rig signs in only after the app has started): time to the sky's mount **AFTER 784 / 1,273 / 1,518
ms, BEFORE 671 / 844 / 1,026**; first frame of the sky 3–16 ms after its mount in both; long tasks AFTER 3–10 (1.47–2.19 s in
all, the largest 0.76–1.52 s), BEFORE 7–10 (1.84–1.93 s, the largest 0.63–0.96 s); one build per entry in both. The drifting
sky's first frame lands about 0.4 s later (median 1,273 against 844 ms at 4×).

### 2.3 Home's drifting sky against the real DOM — PASS
`log-drift-after.txt`, summarised by `sum-drift.ps1`. 320, 360, 390, 430, 560, 760, 900, 1024, 1200, 1360, 1600 × Night and Day
× 3, 6, 7, 9, 12, 13, 20, 30 kept lenses, plus 12 with a 40-character name (Night) at every width: **187 cases, 101 drifting
skies**, each simulated 90 s at 1/60 s and sampled 120 times against each name's and form's real rectangle. **Every name showing
in every sample; names on names (> 1 px) 0; names into forms (> 5 px) 0; forms into forms (> 5 px) 0; outside the field 0; on
the flower's middle (0.54 × its width) 0.** In all 187: one stem per orb; the field inside the sky's own box; the greeting above
the field and the line and counts below it, visible, inside the sky and touching no orb; what follows the sky clear of it (12 px
below under 1200; 28 px, 32 at 1600, to its right from 1200). 0 page errors. Turning skies (86): 3 and 6 at every width; 7, 9
and 12 from 760 up. **Sideways scroll:** 101 px at 760 and 45 px at 900 in every case — identical at e9119d5 (`log-drift-
before.txt`): S-1, older than this build.

Home's field height at 390 (Night): 483 px with 7 lenses, 554 with 9, 722 with 12, 783 with 13, 1,169 with 20, 1,687 with 30
(12 with a 40-character name 739); a turning sky is 300 (360 many; **340 tight**, e.g. 7 lenses on a phone with Names off — the
prompt's "300 or 360" omits it). From 1200: 602 with 13, 894 with 20, 1,280 with 30; a turning sky 440.

### 2.4 Home's other states — PASS
`log-states-*.txt`, one fresh boot per width. Home's sky (frozen at one turn point, stems removed, gradient ids normalised) and
the rest of the page (the arc field's markup excluded — the fixture's sub-theory ids are random per run) hashed, BEFORE vs AFTER:

| state | 390 | 1360 | stems BEFORE → AFTER |
|---|---|---|---|
| no lenses | identical | identical | 0 → 0 |
| one kept lens (turning) | identical | identical | 0 → 1 |
| offers only (1 open, 1 Later) | identical | identical | 0 → 0 |
| offers + 3 kept | identical | identical | 0 → 3 |
| before the Yumi yes, 0 kept | identical | identical | 0 → 0 |
| before the yes, 12 kept | drifts (by design) | identical (turning) | 0 → 12 |
| `?sky=off`, 12 kept | identical, no sky, 0 stems in the document | identical | 0 → 0 |

No page error; no stem to an orb that is not there. Noted on the way: a turning sky that follows a drifting one at another
width re-strews its stars for its new height (440 at 1360 after a 722 px sky at 390) where e9119d5 kept the stars of the
earlier height — L4e's star rule meeting a Home sky that can now be tall; not a defect.

### 2.5 The pinned column — PASS
`log-column-*.txt`. 1200, 1360, 1600 × 720 and 900 high × 3, 12, 13, 20, 30 kept (30 cases each build):

- **Turning skies (3, 12): `position: sticky`, column = the screen's height, exactly as at e9119d5.**
- **Fixed skies (13, 20, 30): `relative`; column 806 px (13 at 720 high), 900 (13 at 900), 1,098 (20), 1,484 (30); scrolling the
  page brings the counts and the line fully into view in every case (2/2).**
- At e9119d5 every column is exactly the screen's height (720 or 900) at every count: **a turning sky's column is never taller
  than a 720 px screen** — no older drift.
- **Before the CSS line** (the L4f rule deleted in the page, `COLUMN-NOCSS`): at **720 high with 13 lenses the column is pinned
  at 806 px on a 720 px screen**, and the counts still come into view — but only because the grid ends with the sky. With a
  long right-hand column (a 1,600 px spacer in the glimpses, `log-tallright-after.txt`): pinned, the counts are first fully in
  view at scroll **1,600 of 1,739** (17 of 201 positions); un-pinned (the line), at **157** (81 of 201). 20 lenses at 900 high:
  1,419 of 1,559 pinned, 265 un-pinned. 12 lenses (turning): sticky in both, counts always in view.

### 2.6 Nothing else moved — PASS
`log-same-*.txt` (two runs of each build). Six fixed points of the turn (S.tick stubbed, S.th set, S.place(true) twice); every
orb's left, top, classes, name classes and name transform; stars and flower markup (gradient ids normalised); shared-book threads
(stems removed); field class and height.

- **Home's turning skies (3 and 6 at 320, 390, 760, 1360; 12 at 760 and 1360): identical in all 10; the only difference is
  0 stems before and one per orb after.**
- **You** (Lenses 3 and 12, Categories List and By the orbs, Marks; 390 and 1360): every turning sky identical (Categories List
  at 390 differed in one of two AFTER runs and matched e9119d5 in the other — a run-to-run flake, not the build). The drifting
  You skies' orb positions differ between two e9119d5 runs as well (the drift depends on elapsed time); their stars, flower,
  threads, classes and heights are identical. The Threads small print on You is unchanged; on Home it now reads the new line.

### 2.7 The switches on Home — PASS
`log-switches-after.txt`, 390, 12 kept. Holding the flower (a real 800 ms press) opens "Your sky"; the small print reads "A thread
from each orb to your flower, and between lenses that share a book". **Threads off:** Home 12 stems + 13 shared-book threads → 0
+ 0; You on its next visit 0 + 0; Home on return 0 + 0. **On:** 12 + 13 back. **Names off:** the turning sky, 360 px, no names,
no inline height, 0 transforms, 0 orbs left at 0,0 (stems stay, Threads being on). **On:** the drifting sky back at 722 px, every
orb rising in from its cell. Storage: the only keys added in the session are `praxis_mood`, `praxis_sky_threads`,
`praxis_you_catnames` — all existing keys, set by the rig or the switch; nothing new.

### 2.8 Taps, turning, Reduce Motion — PASS
`log-taps-*.txt`, `log-reduce-after.txt`. Home 12 at 390 and 20 at 1360: the centre of every orb's form and of its name hits its
own button at three moments 4 s apart (12/12, 20/20; none under 44 px). **A touch and a click on a moving orb open that lens's
sheet ("Lens: …") — the same as e9119d5, where a tap on Home's turning orb opens the lens sheet**; closing returns to Home with the
sky still drifting (moved 14.6–34.3 px, |dx|+|dy|, in the next second). Tab reaches each orb (12/12, 20/20) with a visible ring.
390 → 844 → 390: one rebuild each (a turning sky at 844, 12 is not full at that width; drifting again at 722 px, 0 overlaps,
0 outside); 1360 → 700 → 1360: one rebuild each, drifting, 0 overlaps; a height-only change: 0 rebuilds. **Reduce Motion**
(emulated): still rows, 544 px at 390 (12) and 582 px at 1360 (20), every name, 0 outside, 0 on the flower, 0 overlaps, no
`flow`, nothing moving in 2 s, 0 rebuilds, stems drawn (12, 20).

### 2.9 Leaving and coming back — PASS
`log-inout-after.txt`. Home → Shelf → Home → You → Home, twice, 12 kept at 390: 0.98 ticks per frame (one loop); 1 sky, then 2
once You has been visited, never more; 12 orbs throughout; the drift-only styles (inline height, transforms, `flow`) only on the
fixed skies; Home's sky (722 px) and You's (661 px) each keep their own state. Scrolling Home's page to the foot and back: the
sky does not run while off screen, and the first frame back moves at most **0.92 px**.

### 2.10 Captures — `docs/checkpoints/l4f-shots/` (29, full frames, 20 Nov 2026)
Home with 3, 12 and 20 lenses at 390 (2,000 px tall frame, dpr 2) and 1360 (900 high), Night and Day, BEFORE and AFTER (24);
Home 12 at 390 at 0, 10 and 20 s (3); Reduce Motion at 390 (1); the 1360 column with 20 lenses scrolled to its foot (1). Nothing
hidden but a first-run intro panel. Looked at: at 390 with 12 lenses every name shows and the threads run to the flower; the view
switch now starts about 1,060 px down an 844 px phone. At 1360 the yellow "+" button covers the start of the counts line — the
same at e9119d5 (separate task).

### 2.11 Walk at 390 — PASS
`log-walk-after.txt`: Home (3) → tap an orb → its lens sheet → close; Home (12, drifting) → the same; hold the flower → Threads off
(0 stems) and on (12) → Shelf → Home (12 orbs) → You → Categories (turning, 17 stems) → By the orbs (drifting, 870 px) → Home
(drifting, 722 px). 0 page errors.

### What the rig cannot show
Day is measured but not seen on a phone; a real iPhone's frame rate (the contract §6 gate stays owed); a true cold load of Home
(the rig signs in after the app starts); screen readers; the installed PWA; Preston's real shelf and lens names; a browser
without `:has()`.

## Stage 3 — the red-team and the reviewer

**fix-red-team (Sonnet, frontmatter-pinned), on the staged tree:** `RED-TEAM: findings (0 BLOCK, 2 MAJOR, 3 MINOR, 1 NIT)` —
"no commit blocker. F1 and F2 should be answered by Preston before commit." It read the diff, the grid rules, hand.js and the
rig logs; it did not re-run the rig. Each finding in its words (condensed), then what the rig showed:

| id | sev | finding | checked in the rig / disposition |
|---|---|---|---|
| F1 | MAJOR | From 1200 the sky spans `grid-row: 1 / span 4`; a sky taller than the right column could share its extra height among the spanned rows and spread the view switch, the variant and the glimpses apart; only `altTop` was logged | **Measured, not reproduced** (`log-rows-*.txt`, 1360 × 720 and 900, 3–30 lenses, both builds): the extra height goes entirely into the empty fourth row (65 → 151 / 443 / 829 px); the gaps switch → variant and variant → glimpses are **0 px in all 20 cases**, BEFORE and AFTER. Closed |
| F2 | MAJOR | On a phone the sky is uncapped: Home is a content page whose own rows (the view switch, where you left off, still reading) now sit one to three screens down; You's sky owns its page, Home's heads someone else's | **Measured** (`log-f24-*.txt`, 390 × 844): the view switch starts at 635 / 635 / 818 / 889 / 1,057 / 1,118 / 1,504 / 2,022 px with 3 / 6 / 7 / 9 / 12 / 13 / 20 / 30 lenses (e9119d5: 635–695); "Still reading" at 1,501 with 12, 2,466 with 30 (e9119d5: 1,139). **Ruled by Preston (20 Nov): accepted as residual R-5; a phone height cap is its own decision before the beta, alongside the Motion switch** |
| F3 | MINOR | The load cost is real, not the host alone: the sky's mount at 4× moves from 671 / 844 / 1,026 to 784 / 1,273 / 1,518 ms, the worst long task 956 → 1,517 ms; a first tap during it would wait | Residual **R-2** (below). Its optional fix (defer the first build a frame) is not this build's |
| F4 | MINOR | A lens arriving while Home is open (`lxRefresh` / `lxAfterLensWrite` → `renderRoute`) would rebuild Home with no kept scroll, snapping a reader 1,000+ px down back to the top, the drift starting again | **Measured, not reproduced** (`log-f24-after.txt`): `lxRefresh()` at scroll 900 with 12 drifting: scroll stays 900, the same sky, one build, 0 rise, the orbs carry on (18 px in 1.2 s). Closed |
| F5 | MINOR | Without `:has()` (Chrome < 105, Firefox < 121, old iOS) the un-pin does nothing: the column stays sticky and taller than the screen, the counts in view only at the page's end (as in § 2.5's "line dropped" rows); a JS class set by the build would not need `:has()` | Residual **R-3** (below). The rule applies only from 1200 px (desktops); Safari has `:has()` from 15.4 |
| F6 | NIT | Clean: `stems` from the sheet touches only the sky that opened it (never the Yumi sky or one off the page); nothing else read the old small print; the tab bar, Bloom and Search pill do not depend on the sky's height; the 300 / 360 / 340 / 440 / 480 heights are CSS defaults an inline height overrides; the empty and one-lens states never fix | Agreed |

**praxis-reviewer (Sonnet, frontmatter-pinned): `REVIEWER: PASS WITH NOTES`** — "No blocking defect." Re-measured the three staged
blobs (bytes, md5, numstat) and the six locked files — all exact; ES3 and no-hex on the added lines; `tools/parse-check` on the
staged views.js; `git diff --cached --check` exit 0; index LF / working tree CRLF; the call sites (`lxHomeSky` ← renderHome
views.js:2159; `lxSkySheet` ← the hold timer :28391 and keydown :28399); spot-checked § 2.3, 2.4 and 2.5 against the logs — "Holds"
each. Notes: the doc amendments (BOARD.md:16, BOARD.md:151, docs/studio/home.md:120, l4e.md, the contract) — all made in this
stage; stage the captures by name, never `add -A`; § 2.4's re-strewn stars on Home are a disclosed behaviour change (low).

## Residual

- **R-1 (L4e's, carried under R4).** Only the phone's Reduce Motion stops the sky — now Home's too when it is full. The Motion
  switch in the sky's sheet is its own build, before the beta.
- **R-2 (F3).** A full drifting Home sky costs more at load: at CPU 4× in headless Chrome, 12 lenses at 390, the sky's mount
  lands ~0.4 s later (median 1,273 against 844 ms) and the longest task grows (up to 1.52 s against 0.96 s). Not an iPhone
  measurement; the contract §6 gate on the installed app stays owed.
- **R-3 (F5).** In a desktop browser without `:has()`, a drifting Home sky's column stays pinned, so its counts and door come into
  view only at the very end of the page (as in § 2.5's measurement with the CSS line removed).
- **R-4 (§ 2.2).** The 2 ms / 5 ms engine-time bar at CPU 4× is not met on this host at 12 and 20 lenses, in either build;
  accepted by Preston at Checkpoint 2 (S-5).
- **R-5 (F2), ruled by Preston 20 Nov 2026: accepted as a residual; commit.** On a phone a full Home sky pushes Home's own rows
  down — the view switch at 1,057 px with 12 lenses, 1,504 with 20, 2,022 with 30 on an 844 px screen (e9119d5: 695). Home keeps
  You's rule for now. **A height cap for Home's sky on phones is its own decision before the beta, built alongside the Motion
  switch (R4).**

## Separate tasks (older than L4f; not this build's)

- **S-1 (L4d)** — sideways scroll at 760 (101 px) and 900 (45 px), identical at e9119d5, at every lens count.
- **At 1360 the yellow "+" button (bottom-left) covers the start of Home's counts line** — the same at e9119d5
  (`l4f-home-1360-20-night-before.jpg`).
- **The mockup `design/praxis-lens-sky.html`** still carries the old small print "Join lenses that share a book" (a design
  reference, not shipped; not touched).
- S-3, S-4, D-L1, D-L2, E-L1–E-L9 — not this build.

## Files changed

js/views.js · assets/components.css · sw.js · docs/checkpoints/l4f.md (new) · docs/checkpoints/l4f-shots/ (29 new captures) ·
docs/checkpoints/l4e.md · docs/checkpoints/l4.md · docs/checkpoints/p2-seventeenth-sitting-rulings.md (an amendment note under
S8; the ruling kept as given) · docs/studio/l4-lens-engine-contract.md · docs/studio/home.md · BOARD.md ·
docs/Checklist and Roadmap/BUILD_STATE.md · docs/studio/sequence.md · docs/studio/builder.html (regenerated). Rig files
(`.claude/rig/captures/l4f/`) are not staged.

## Proposed commit

Subject: `L4f — Home's sky follows You's rule: a thread from each orb, and a full sky drifts with every name — v3.336`

## Owed after the push

On my phone at v3.336, close the app fully and reopen it. Home: a thin thread runs from each orb to the flower; with the few
lenses I have today the orbs still circle. Hold the flower → Threads off: the threads go; on: they return. You → Categories →
By the orbs: still drifting as at v3.335. Say PASS, or name what is wrong. (Home drifts only once I keep enough lenses to fill
the sky: seven or more on a phone.) The About page has no version line; the sign of the new build is the threads on Home, or
check #diag.
