# R-POLISH B1 — HOME + NOTEBOOK + THE APP-WIDE SWEEPS

B1 STARTED. Model: Opus 4.8 default effort; gate agents Sonnet.
Base HEAD `c97d476` · live+local sw.js `praxis-v3.230` → ships `v3.231`.
Tracked tree clean at open (103 untracked strays untouched, never `-A`).

---

## STAGE 0 — ANCHORS + BANDS

### Anchor verification vs main (dead anchor = HALT)

| # | anchor | claimed | resolved | verdict |
|---|---|---|---|---|
| A1 | `YUMI_BLOOM_LINES` | yumi-ui.js:910 | `:910` map · reader `:923-924` · `updateYumiBloomLine` `:932-936` · el var `:29` · hashchange `:1466` | **LIVE** |
| A1b | inline caption dup | yumi-ui.js:1015 | `:1015` `'<span class="yumi-bloom-line">tap to talk</span>'` + wire `:1017-1018` | **LIVE** |
| A2 | `.intro-summon` | — | created `intros.js:613` (+`:506`,`:609-622`) · CSS `components.css:14071,14072,14085` · defensive removal `views.js:18990` | **LIVE** |
| A3 | `umberGroundDark` | views.js:397 | `:397` map, applied `:398-399` | **LIVE** |
| A4 | Home render fn | — | `renderHome()` views.js:1482 | **LIVE** |
| A4b | Notebook render fns | — | `renderNotebook()` :1920 · `buildNotebookLeftLeaf` :2197 · `buildNotebookRightLeaf` :2247 · `buildNotebookWriteline` :2856 | **LIVE** |
| A5 | lens panel | yumi-ui.js:2078 → :1901 | `openLensPanel` :2072, reset at :2078-2080 · `renderLensPanelBody` auto-fire `startLensSuggest()` :1901 | **LIVE** |
| A6 | nav search input | — | `.app-nav-search-input` **index.html:30** (static markup); ⌘K wiring spotlight.js:433-441 | **LIVE** (see N1) |
| A7 | capture submit path | — | `captureNote(register, body, activeKey, images)` views.js:3237 (header :3231); composer `buildNotebookWriteline` :2856 | **LIVE** |

**All anchors resolve. No HALT.**

**N1 — anchor correction (carried, not a fork).** The Slice-0 census listed the nav
search as "`spotlight.js:306`, `views.js:4649`". Neither is the nav input:
`views.js:4649` is `#shelf-search-input`, the **Shelf** grid filter (an exempt
surface — R-SHELF), and `spotlight.js:306` is the **⌘K overlay** input. The nav
bar's own input is static markup at `index.html:30`. B1 converts **index.html:30**
and leaves both others alone; the census line is corrected in this commit.

### Baseline bytes (git blob = LF-normalized; working tree is CRLF)

| file | blob (base) | wt |
|---|---|---|
| js/views.js | 1,009,763 | 1,031,891 |
| js/yumi-ui.js | 88,110 | 90,217 |
| js/intros.js | 39,041 | 39,041 |
| assets/components.css | 708,956 | 723,523 |
| assets/theme.css | 25,600 | 26,123 |
| index.html | 6,917 | 7,076 |
| sw.js | 4,809 | 4,809 |

### Declared bands (per FIX-PROTOCOL §3 — CODE ceiling hard, COMMENT allowance soft)

Sweeps are net-negative; composition work is net-positive. Bands declared BEFORE writing:

| file | CODE band (hard ceiling) | COMMENT allowance (soft) | why |
|---|---|---|---|
| js/yumi-ui.js | **−1,400 … +250 B** | +900 B | L5 removes map+reader+updater+wire (net −); CO-1 rider is a small deletion + guard |
| js/intros.js | **−900 … +100 B** | +600 B | AMB-1 summon retirement (net −) |
| js/views.js | **−400 … +3,000 B** | +2,200 B | ground flip (−1 map key), Home/Notebook kit classes, debounce, save pulse |
| assets/components.css | **+2,000 … +11,000 B** | +3,500 B | Home paper + XL composition + Notebook XL + kit adoption sites; minus 3 `.intro-summon` + 3 `.yumi-bloom-line` rules |
| assets/praxis-kit.css | **NEW ≈ 12,000 B ±1,500** | — | promoted from docs/studio/kit/ (see N2) |
| index.html | **+40 … +260 B** | +200 B | kit `<link>` + nav search kit class/label |
| sw.js | **+0 … +40 B** | — | version string equal-length (+0) + one APP_SHELL entry |

### N2 — KIT ADOPTION MECHANISM (determined, not a fork)

`docs/studio/kit/praxis-kit.css` is written as **drop-in** ("Consumes app token
NAMES (theme.css) so it is drop-in"), and SYS-1 states the metric layer exists
precisely so "per-batch passes [don't] re-invent paddings and drift regrows."
Copying kit rules into components.css per batch is the failure mode SYS-1 names.
So B1 **promotes** the file to `assets/praxis-kit.css`, `<link>`ed after
components.css (kit classes are all net-new `.k-*`/`.ty-*`/`.mo-*`, so no
cascade contest) and added to the sw.js `APP_SHELL` precache. B2–B4 then adopt by
class only. **Consumed, not forked** — content is byte-identical except N3.

### N3 — KIT CORRECTION (the kit violates its own ruled law, twice)

TY-1 rules a **12px absolute floor** ("nothing in the app renders smaller"), and
the B1 prompt restates it for both Home and Notebook. The shipped kit sets
`font-size:11px` in two places: `.k-breadcrumb .state` (line 135) and `.k-pending`
(line 140). Adopting as-is would ship a floor violation into the app on B1's own
commit. Corrected to **12px** at promotion; logged here rather than silently
widened. This is the law outranking the artifact — the kit's own header says it is
"Built to docs/studio/r-polish-brief.md §2 laws."

### N4 — PG-1 MECHANISM: the stated reason for Home's dark ground is OBSOLETE

The Home token block carries this rationale (components.css:13050-13058, verbatim):

> "Home keeps `body[data-ground="dark"]` (so the nav stays consistent with the
> other dark routes), so those globals would otherwise resolve to their pale
> dark-ground values … Re-point them to the light ink ramp"

That premise no longer holds. `theme.css:367-372` applies the dark token remap to
`[data-ground="dark"], .app-nav, .yumi-bloom, .yumi-panel, .spotlight-panel` —
**`.app-nav` is listed independently**, so the nav (and Bloom, panel, spotlight)
self-darken regardless of the body's ground. Flipping Home to `bright` therefore
does **not** touch the nav. This is the de-risking fact for PG-1 and is verified
live (computed `.app-nav` background sampled before/after, Stage 2 table).

**Consequence for the flip:** the Home-scoped `--ink-2/-3/-4/--sunk` overrides were
written as *compensation* for the dark remap. They are **KEPT** — under
`:root` v1.1, `--ink-3` resolves to `#978b6d`, which the Slice-0 contrast gate
measured at **2.94:1 on `--paper` (FAIL)**, while Home's scoped `#645940` is the
AA-safe collapse. Deleting the "now-redundant" block would therefore be a
**contrast regression**, not a cleanup. They are re-commented as the light ramp
rather than the dark undo.

### N5 — Home already paints light; the flip is about the FRAME

`.home-page.lum-amber-deep` (components.css:13066) already sets
`background-color:var(--paper)` + the weathered light gradient, `background-attachment:fixed`.
So Home's *sheet* is light today; P-G's "light-sheet-on-dark frame" is the
**body ground showing around/behind it**. The flip retires the dark vignette
(`body[data-ground="dark"]::before` → `var(--ground-grad)`) so the page is one
paper world. Before/after computed sampling at 390/1280/1920 is the proof (Stage 2).

### N6 — AMB-1 content check: VERIFIED, do not rebuild

`.intro-summon`'s only behaviour is re-opening a surface's already-dismissed intro
panel (`updateSummon` → `showPanel(id)`, intros.js:609-622). intros.js **PART B**
`buildAboutOrientation()` already emits About's "Re-enter a page" section from
**the same `INTROS` single source**, with a retake path. Retiring the summon loses
no content and no route to that content. Verified, not rebuilt.

---
## BEFORE — Home computed sample (PG-1 baseline, signed-in composed, 3 owned arcs)

Rig: `.claude/rig/` loaded (not rebuilt), `serve.ps1` :8790, auth stub uid `d0tester`,
transitions force-settled. Screenshots are proven dead in this pane (rig README) —
**geometry + computed style are the evidence**; Preston's deployed felt pass is the visual gate.

| metric | 390 | 1280 | 1920 |
|---|---|---|---|
| `body[data-ground]` | dark | dark | dark |
| `body::before` | dark radial `rgb(64,40,18)…` | same | same |
| `.home-page` x / width | 8 / 374 | 0 / 1265 | **173 / 1560** |
| paper full-bleed? | **NO** (8px seam) | yes | **NO (173px dark gutters)** |
| `.app-nav` bg | `rgb(62,40,20)` | same | same |
| `--surface` inside Home | **`#3e2814` (DARK)** | same | same |
| `--ink-3` inside Home | `#645940` | same | same |
| content bottom / docH | 1611 / 1795 | 985 / 1065 | 985 / 1174 |
| void below content | 184 | 80 | **189** |
| occupancy | 95.9% | 100% | 81.9% |
| sub-12px classes | 7 | 7 | 7 |
| <24px pointer targets | 0 | 1 (`.home-gl-link` 18px) | 1 |
| hscroll | 0 | 0 | 0 |

**P-G measured, not asserted:** the "light sheet on a dark frame" is DW-2's
`max-width:1560px` on `.home-page` at `min-width:1200px`. Home already paints light
paper (N5) — the dark frame is the body ground showing in the 173px gutters at 1920
(and an 8px seam at 390). At 1280 the paper is already full-bleed, which is why the
defect is XL-tier-specific.

**Sub-12px offenders (identical at all 3 widths):** `.home-reading-status` **9px** ·
`.home-sectlabel` 10 · `.home-arcmeta` 10 · `.home-gl` 10 · `.home-wfcap` 11 ·
`.home-fieldstat` 11 · `.home-gl-link` 11.

---

## STAGE 1 — APP-WIDE SWEEPS → PASS

### L5 · the caption family — **7 strings / 8 route keys / 1 inline dup → 0**
Removed from `js/yumi-ui.js`: `YUMI_BLOOM_LINES` map, `YUMI_BLOOM_LINE_DEFAULT`,
`yumiBloomLineFor()`, `updateYumiBloomLine()`, the `yumiBloomLineEl` module handle,
the inline `'tap to talk'` span in `buildYumiBloom`, its two wire lines, and the
`hashchange` listener. From `assets/components.css`: `.yumi-bloom-line`,
`.yumi-bloom:hover .yumi-bloom-line`, and the `<=759` `display:none` hide.

- grep, app-wide, all 7 strings: **0** live occurrences.
- grep `YUMI_BLOOM_LINES|yumiBloomLineFor|updateYumiBloomLine|yumiBloomLineEl|yumi-bloom-line`: 6 hits, **all 6 are comments** (provenance), 0 code.
- **A11Y HELD:** the FAB's own `aria-label="Talk to Yumi"` (set in `buildYumiBloom`)
  was always the accessible name — live readout confirms it survives. The caption
  was decoration on top of it, so nothing assistive was lost.
- Live DOM after edit: `.yumi-bloom-line` = **0**, `.yumi-bloom` children = **1** (the orb alone).

### AMB-1 · the floating ⓘ — **1 → 0**, and the flower gets its one ruled size/glow
`js/intros.js`: `updateSummon()` deleted whole, its `summonEl` handle deleted, its
call sites removed (`panelForHash`, the panel-X `onclick`, `startJourney`'s hide).
`js/views.js:18990`: the now-dead `.intro-summon` removeChild dropped.
`assets/components.css`: `.intro-summon`, `:hover`, and the `<=759` reposition dropped.

- grep `intro-summon|updateSummon|summonEl`: 3 hits, **all 3 comments**, 0 code.
- **CAUGHT AND FIXED MID-BUILD:** deleting `updateSummon` initially stranded a live
  call at `intros.js:596` (the panel-X `onclick`) — that would have thrown a
  **ReferenceError on every intro dismissal**. Found by grepping residuals rather
  than trusting the delete. Proven fixed below.
- AMB-1 flower: `.yumi-bloom` collapses from a caption-stacking column-flex to a
  single centred item; **ONE ruled size (56px orb) and ONE ruled glow** (one
  `drop-shadow` recipe) now hold at every width and route — the `<=759` variance
  existed only to hide the caption, so removing the caption is what makes "one
  ruled size" literally true instead of width-conditional.

**Behavioural proof — the dismiss path (own-state AND global, per DWF-1):**

| probe | observed | verdict |
|---|---|---|
| intro panel mounts on `#books` | `.intro-panel-wrap` = 1 | PASS |
| X click → panel removed | `.intro-panel-wrap` 1 → **0** | PASS |
| X click → own-state persisted | `praxis_intro_shelf` written | PASS |
| X click → **no error** | `window.onerror` capture = **[]** | PASS (the ReferenceError is gone) |
| summon never appears | `.intro-summon` = **0** before AND after | PASS |

### CO-1 RIDER · the lens panel stores once — **network-instrumented**
Retired the open-time `lensSuggestStatus='idle'; lensSuggestLenses=[]` reset in
`openLensPanel()` (`yumi-ui.js`). Counter wrapped around `YumiBrain.generateLenses`
(the billing site) **and** `window.fetch` for `claude-proxy`.

| leg | probe | generateLenses calls | verdict |
|---|---|---|---|
| 1 | open #1 (cold) → settle → close → open #2 | **1** across both opens | **PASS** |
| 2 | open on warm cache (`done`, 2 stored) | **0**, and **2 proposal cards rendered** | **PASS** (stored, re-rendered, not re-billed) |
| 3 | **CONTROL — old behaviour re-simulated** (`status='idle'` before open) | **1 per open** | **PASS** (the failure reproduces with the fix removed) |
| 4 | **CONTROL — error state** | **0** auto-calls; `.lens-suggest-retry` = 1; "Yumi couldn't reach for lenses just now." | **PASS** (no stranding) |

No branch is stranded: `error` and `done`-but-empty both render
`buildLensSuggestRetry()` ("Ask Yumi again"), so re-asking stays available as an
explicit, user-paid act — the same cache + explicit-refresh shape as shelf
classification's "Re-classify". Proposal accept/dismiss edits now also survive a
re-open instead of being silently discarded, which was the second half of the bug.

### Gates
- **Parse gate**, exit codes measured WITHOUT a pipe (a piped `$?` reads `tail`, not `cscript` — my first reading was invalid and was redone): `js/yumi-ui.js` **0** · `js/intros.js` **0** · `js/views.js` **0**.
- **Harness self-validation:** a deliberately broken copy exits **1** with `PARSE ERROR`. Both paths proven, so the gate is not trivially passing.
- **ES3 guard:** 3 raw-diff hits, all false positives (two backticks inside comments, one `class=` inside an HTML string) — no `const`/`let`/arrow/`class`/template literal in new code.

### Byte deltas after Stage 1 (LF-normalized, measured not back-derived)
| file | base | now | delta | band | verdict |
|---|---|---|---|---|---|
| js/yumi-ui.js | 88,110 | 87,962 | **−148** | −1,400…+250 | in band |
| js/intros.js | 39,041 | 38,826 | **−215** | −900…+100 | in band |
| js/views.js | 1,009,763 | 1,009,734 | **−29** | −400…+3,000 | in band |
| assets/components.css | 708,956 | 709,116 | **+160** | +2,000…+11,000 (full-B1 band) | below floor at this stage; Home/Notebook land in Stages 2–3 |

Added-line classification: 4,342 B added total = **2,665 B comment / 1,677 B code.**

---

## STAGE 2 — HOME (PG-1 ground flip + XL-1) → PASS

### The kit, promoted (N2) + corrected (N3)
`docs/studio/kit/praxis-kit.css` → `assets/praxis-kit.css`, `<link>`ed after
components.css, added to `sw.js` APP_SHELL. Diff vs the Slice-0 artifact = the new
header + the two 11px→12px TY-1 floor corrections, nothing else. Live: the kit
tokens resolve app-wide (`--space-xl` = 32px read off `:root`).

### PG-1 · BEFORE → AFTER (computed, signed-in composed, 3 owned arcs)

| metric | 390 B→A | 1280 B→A | 1920 B→A | 2560 (after) |
|---|---|---|---|---|
| `data-ground` | dark → **bright** | dark → **bright** | dark → **bright** | bright |
| `body::before` | dark radial → **warm grain** | " | " | warm grain |
| paper layer | element-bound → **viewport-fixed ::before** | " | " | fixed, 2544.67px |
| `.home-page` x/w | 8/374 → 8/374 | 0/1265 → 0/1265 | **173/1560 → 112/1680** | 432/1680 |
| dark gutters | 8px → **0 (paper)** | 0 → 0 | **173px → 0 (paper)** | 0 (paper) |
| grid tracks | — | 868+320 | **1164+320 → 1240+360** | 1240+360 |
| occupancy | 95.9 → 95.9 | 100 → 100 | **81.9 → 88.2** | 66.0 (≥60 ✓) |
| `--surface` in Home | **#3e2814 (DARK) → #fffdf8** | " | " | #fffdf8 |
| `--ink-3` in Home | #645940 → #645940 (kept, AA) | " | " | #645940 |
| **`.app-nav` bg** | **rgb(62,40,20) → rgb(62,40,20) UNCHANGED** | " | " | unchanged |
| sub-12px (named list) | 7 → 0 | 7 → 0 | 7 → 0 | 0 |
| <24px targets | 0 → 0 | 1 → **0** | 1 → **0** | 0 |
| hscroll | 0 | 0 | 0 | 0 |

**N4 PROVEN LIVE:** `.app-nav` background is identical before and after the flip at
every width. The nav does not follow the body ground — theme.css lists it as an
independent selector on the dark remap. The comment claiming Home had to stay dark
"so the nav stays consistent" reasoned from a premise the token sheet never
required; corrected in the same commit.

**A latent bug the flip also fixed:** `--surface` resolved to **#3e2814 (dark)**
inside Home before the flip — the Home-scoped block compensated `--ink-2/-3/-4` and
`--sunk` but never `--surface`. Nothing rendered with it today, so it was invisible;
any kit class using `var(--surface)` would have painted a dark card on the light
page. Now #fffdf8. Recorded because it is exactly the kind of latent seam that only
appears when the next batch mounts a component.

**Grid safety (the risk this mechanism carried):** a `::before` on a `display:grid`
container can become a grid item and take a track. Verified it does NOT: tracks read
`1240px 360px` (exactly two), children land at x=136/1408, and `.home-page` creates
no stacking context (transform/filter/opacity/position/isolation all inert), so the
fixed pseudo resolves against the viewport and paints above `body::before` by tree
order at equal z-index.

### The residual I did NOT reach for
At 390 the 8px inset traces to the **UA default `body{margin:8px}`**, which this app
never resets — not to Home's padding (already 0 on the sides). The fixed paper covers
that band, so the seam is gone without touching a shared chrome rule every other
surface stands on. A first attempt at a padding override here was **dead CSS** and
was removed rather than shipped. Body-margin reset → residual R3.

---

## STAGE 3 — NOTEBOOK → PASS

### NBK-1 · reconciled, not overridden
Slice-0 recon found the growing leaf was ruled **deliberately** (mockups + ship
checkpoint + DW-2's 200-note stress test). B1 honours it: nothing bounds or scrolls
the stream. The real defect was the *other* leaf — a tall blank column beside a long
stream — which now gets the SYS-1 composed-empty treatment (sticky content, bounded
measure). **The brief's §NBK-1 is corrected in this commit** (strike +
reconciliation note), per DOC-RIDES-WITH-THE-DIFF.

### Measured (1920)
| metric | value |
|---|---|
| spread | x=112 w=1680 (was capped 1360) |
| leaves | 840 / 839, **equal height** (the frame grows with the stream) |
| reader's-words register | Cormorant Garamond · 17px · **font-style: normal (UPRIGHT)** |
| sub-12px in Notebook | **0** |
| <24px action targets | **0** |
| hscroll | 0 |

### UX-3 · the debounce — PROVEN, and the recon's open question SETTLED
| leg | probe | result | verdict |
|---|---|---|---|
| 1 | two `Capture` clicks in one tick | entries 22 → **23**, one matching body | **PASS — one entry from two fires** |
| 2 | pre-existing entries | 22 preserved, none deleted or rewritten | **PASS** |
| 3 | **CONTROL** — guard neutralised, two fires | entries 23 → **25**, **2 duplicate bodies** | **PASS — failure reproduces without the guard** |

Leg 3 answers the recon's open question: the double-fire the brief flagged as
"possible… may be fixture" is **REAL**. It reproduces on demand the moment the guard
is removed.

Release safety: `nbCommitBusy` is released in `finalize()` (reached on BOTH the
success and the error callback, since each decrements `remaining`), plus a 15s
timeout backstop for a put that never calls back at all — a latch that cannot be
released would be a worse bug than the double-write it prevents.

### MO-1 · SAVE PULSE
`.mo-savepulse` lands on exactly the committed entry (matched by `data-entry-id`);
computed `animation-name: mo-save`, `520ms`, `cubic-bezier(.22,1,.36,1)`; the kit's
`prefers-reduced-motion` block covers `.mo-savepulse` (verified by CSSOM rule
search). `nbJustSavedId` is nulled as it is consumed → one pulse per commit, never
on a later re-render.

---

## STAGE 3.5 — THE CONDITIONAL GATES → PASS

### INTERACTIVE-CONTROL SWEEP — 14 controls fired live: **14 LIVE, 0 SILENT**
Own-state (text/class/disabled/aria) AND global (hash/DOM/route/state) observed for
each, per DWF-1's both-directions rule.

| surface | control | own-state | global | verdict |
|---|---|---|---|---|
| Home | seg "The whole field" | `is-on` added | variant left→field | LIVE |
| Home | seg "Where you left off" | `is-on` added | variant field→left | LIVE |
| Home | arc button (primary) | (unchanged) | → `#arc/arc_owned_0` | LIVE |
| Home | "Start a new arc" tile | (unchanged) | → `#arcs` | LIVE |
| Home | glimpse "Your shelf →" | (unchanged) | → `#books` | LIVE |
| Home | Yumi Bloom FAB | class toggled | (none — correct for a FAB) | LIVE |
| Notebook | tab (2nd / 1st) | `is-on` added | tab + DOM 158↔98 | LIVE |
| Notebook | register chip (2nd / 1st) | `is-on` added | (none — composer-local) | LIVE |
| Notebook | Gather / un-Gather | class toggled | gathered 0↔1, DOM 158↔191 | LIVE |
| Notebook | Yumi reads-along switch | own state moved | (none) | LIVE |
| Notebook | Photo | — | hidden file input fired (`accept=image/*` `capture=environment`) | LIVE |
| Notebook | Add image | — | hidden file input fired (`accept=image/*`) | LIVE |
| Notebook | Paste / Import / Dictate | — | `.ic-overlay` mounted 0→1, visible | LIVE |

**A PHANTOM I MANUFACTURED AND THEN KILLED.** The first pass scored the composer
mode chips **SILENT** — because my probe watched for
`.ic-root/.import-capture/[class*=capture-window]` while the real node is
**`.ic-overlay`**, and because a prior click had already left one mounted so the
count did not move. This is precisely the DWF-1 warning about a probe manufacturing
phantoms. Re-probed from a clean state against the true selector: all three mount
`.ic-overlay`, visible. Recorded rather than quietly corrected — the near-miss is
the lesson.

### MOUNT-SITE — every render path, both surfaces
| path | mounted as | paper ground | notes |
|---|---|---|---|
| Home · signed-in · seeded | `home-page lum-amber-deep home-composed` | fixed, #f4efe4, 1904.67px | ✓ |
| Home · signed-in · EMPTY (no arcs/books) | same | fixed, #f4efe4 | ✓ |
| **Home · SIGNED-OUT** | `home-page lum-amber-deep` (**no** `home-composed`) | **fixed, #f4efe4** | ✓ ground is scoped to `.home-page.lum-amber-deep`, so it mounts on the prompt path too |
| Notebook · signed-in · seeded | 2 leaves, 5 entries | — | reader register upright ✓ |
| Notebook · signed-in · EMPTY | 2 leaves, 0 entries | — | no crash ✓ |
| Notebook · SIGNED-OUT | 0 leaves, sign-in prompt | — | no crash ✓ |

**Console: clean** (0 errors across every path driven above).

---

## THE FLOOR SCANS — where my own method failed twice

The first Home and Notebook floor checks used **named selector lists built from
greps**, and BOTH were incomplete. An exhaustive own-text DOM scan then found
offenders the lists had missed:

- **Notebook (+4):** `.notebook-entry-overflow` — a **second** actions container
  beside `.notebook-entry-acts`, carrying its own add-to-arc / delete /
  delete-confirm / delete-cancel links at 10.5px; plus `.notebook-entry-tag`
  (8.5px), `.nb-mode .handoff` and `.nb-switch` (11px).
- **Home (+3):** `.home-mspine-title` (10px), `.home-mspine-pending` (**6.5px** —
  the smallest text in the app), `.app-nav-search-kbd` (10px).

This is the "delta list exhaustive" failure CLAUDE.md names, caught by measuring
instead of trusting the list. **Final scans: Home 0 · nav 0 · Notebook 0.**

**One judgement call, flagged for the felt pass:** `.home-mspine-pending`
("cover pending", 6.5px) sits inside a 62×92 cover placeholder. Raising it to 12px
would crowd out the title beneath it, so it is set `display:none` — the empty
placeholder already says "no cover", and the book's full title is on the anchor's
own `title` attribute, so no reader and no assistive tech loses anything. This is
the only change in B1 that removes something a reader could previously see.

**One floor NOT fixed:** the constellation renderer's SVG `<text>` "Yumi" label at
11px. It belongs to the locked renderer that **B2/GR-1 owns**, and canon §4-H defers
constellation work. Residual R1 — not silently absorbed.

---

## BYTE DELTAS vs THE DECLARED BANDS — one CODE-band BREACH, surfaced not widened

Measured after (LF-normalized), classified per FIX-PROTOCOL §3 (CODE ceiling hard,
COMMENT allowance soft), never back-derived:

| file | total Δ | **NET CODE** | NET COMMENT | CODE band | verdict |
|---|---|---|---|---|---|
| js/yumi-ui.js | −148 | **−1,224** | +1,056 | −1,400…+250 | **IN BAND** |
| js/intros.js | −215 | **−731** | +505 | −900…+100 | **IN BAND** |
| js/views.js | +4,167 | **+646** | +3,585 | −400…+3,000 | **IN BAND** (comment overage clears by classification) |
| index.html | +1,022 | **+876** | +159 | +40…+260 | **OVER — see below** |
| assets/components.css | +19,024 | **+17,663** | +1,752 | +2,000…+11,000 | **BREACH — see below** |
| sw.js | +28 | +28 | 0 | +0…+40 | IN BAND |
| assets/praxis-kit.css | NEW 15,249 | — | — | est. 12,000 ±1,500 | estimate was wrong — see below |

### The breach, stated plainly
`assets/components.css` NET CODE is **+17,663 against a declared ceiling of
+11,000** — a **CODE-band breach**, which FIX-PROTOCOL §3 says HALTS, and which is
**never silently widened**. It is reported here as a breach, not re-labelled.

**What the bytes actually are** (so the judgement is Preston's, on evidence):
every added rule is Home, Notebook, or nav chrome — the three things B1 owns. The
overage has three identifiable sources, none of them new scope:

1. **The measured floor completions.** The TY-1 work was estimated from greps that
   found ~7 Home + ~20 Notebook classes. The live exhaustive scans then found
   **7 more**, including a whole second actions container (`.notebook-entry-overflow`).
   Fixing what the gate actually found costs more than fixing what the grep predicted.
2. **Multi-line selector lists.** The floor rules are written one selector per line
   for auditability (a single rule covering 20 classes is ~20 lines / ~900 B). This
   inflates "code bytes" against an estimate I made thinking in rules, not lines.
3. **The estimate itself was low**, which §3 explicitly anticipates ("agent estimates
   run ~2× low") — but §3 grants that latitude to the FLOOR, not to the CODE ceiling.

`index.html` (+876 code vs +260) is the same shape at small scale: the kit `<link>`
plus two multi-line explanatory comment blocks whose non-`<!--` lines classify as
code. `assets/praxis-kit.css` is not authored work at all — the promoted artifact
was already 14,407 B on disk, so my "≈12,000" was a bad guess about a file I had
not yet measured; the authored delta over the source is **842 B** (header + the two
N3 corrections), and the whole-file diff is **23 lines**.

**I am not widening any band to make this pass.** The build is otherwise fully
green; this is the one number that does not fit its declared envelope, and it is
Preston's call whether the overage is acceptable in-scope work or a re-scope.

---

## FOUNDATIONS + STAGING

- **Foundations byte-lock VERIFIED unchanged:** `lumen-amber.css`
  `9879ddb83a7e68e8378c621e473b0a57` · `marks.js` `772886c049d0d6d03d341507e602d88a`
  — both match the locked values in FIX-PROTOCOL §2.
- **sw.js:** `praxis-v3.230` → **`praxis-v3.231`**, `/assets/praxis-kit.css` added to
  `APP_SHELL`, no BOM, parse exit 0. Blob CR count is 0 both before and after, so the
  working-tree EOL question is immaterial to what commits.
- **Parse gate**, exit codes measured WITHOUT a pipe (a piped `$?` reads `tail`;
  my first reading was invalid and was redone): views.js **0** · yumi-ui.js **0** ·
  intros.js **0** · sw.js **0**. Harness self-validates — a deliberately broken copy
  exits **1**.
- **Tracked files touched (exactly the intended set, never `-A`):**
  `assets/components.css` · `index.html` · `js/intros.js` · `js/views.js` ·
  `js/yumi-ui.js` · `sw.js` · `BOARD.md` · `docs/studio/r-polish-brief.md` ·
  `docs/checkpoints/slice0-census.md` · `docs/checkpoints/r-polish-b1.md`
  **NEW:** `assets/praxis-kit.css`. The 103 untracked strays are untouched.

## RESIDUALS (named, not absorbed)

- **R1 — SVG `<text>` "Yumi" label at 11px** in the locked constellation renderer.
  Below the TY-1 floor. Owned by **B2/GR-1**; canon §4-H defers constellation work.
- **R2 — nav list overflows ~8px in the 760–800 band** (`.app-nav-list` right=761 at
  clientWidth 753). **PROVEN PRE-EXISTING, not B1's:** A/B'd my two nav rules
  (`font-weight:600` on active, the reserved 2px border) — nav width measures **442
  with and without them**. App-wide chrome sizing → B4.
- **R3 — UA default `body{margin:8px}` is never reset**, which is the true source of
  the 8px inset at 390. Home's fixed paper now covers it, so it is no longer visible
  there, but it is still unreset app-wide → B4.
- **R4 — Home arc thumbnails: the interim ruling did NOT apply, by measurement.**
  The prompt pre-ruled a "SCOPED dark card surface until B2 converts the renderer,
  because candy on light is the proven 16/16 fail." Measured live, **Home ships no
  candy on light**: both Home renderers already paint DEEP marks (`#BA7517`,
  `#D67248`, `#C8842A`, `#F0C82A`) on a light parchment gradient
  (`#F4E6C4→#EEDCB2`) — i.e. already the configuration the L3 proof PASSED.
  Wrapping them in a dark card would have put parchment-tuned deep marks onto dark
  — a regression, and a violation of the ruling's own intent. **The renderer is
  untouched, as the prompt requires; B2 still owns GR-1.** Flagged prominently
  because it departs from the letter of a stated ruling on the strength of a
  measurement.
- **R5 — studio markdown + Builder regen deferred.** The prompt sets NO Builder
  regen as a non-goal (B1 is mid-round; B2–B4 remain), so `docs/studio/sequence.md`
  and the surface markdown are NOT updated here and `tools/studio-build` was NOT
  run. BOARD.md rows 1 and 2 ARE updated in this commit, per the binding
  maintenance rule.

---

## STAGE 4 — RED-TEAM (Sonnet-pinned, MODEL LAW v2) → 2 BLOCKS, BOTH FIXED + RE-PROVEN

The red-team independently re-derived the build's own proofs (re-ran the parse gate
and its self-validation, re-measured every byte delta from `git show HEAD:<f>`,
re-grepped the L5/AMB-1 removals, re-diffed the kit promotion, and worked the Home
stacking-context math by hand) and confirmed them. It then found **two
blocks-commit defects the build's own checkpoint did not cover.** Both were real.
Both are fixed and behaviourally re-proven below.

### BLOCK 1 — CO-1 opened a CROSS-ACCOUNT stale-data leak

**The finding.** Retiring `openLensPanel`'s per-open reset removed the only thing
scrubbing lens state between two users sharing one tab. `lensSuggestStatus` /
`lensSuggestLenses` are module-scoped in `yumi-ui.js` — **not** in `state` — so
`clearUserState()`'s "14.2 account switch in a shared browser" wipe
(`integrations.js:101-108`), which exists *precisely* so A's data cannot leak into
B's session, never reached them. Sign-out/sign-in does not reload the page
(`location.reload()` fires only on account deletion, `views.js:16064`), so user B
would open the panel, see proposals generated from **user A's library**, and
adopting one would call `createUserTheme()` against B — writing a theme named from
A's books into B's account. The old unconditional reset had been preventing this
by accident.

**The fix** (`js/yumi-ui.js`, `refreshYumiPanelForAuthChange`): the reset moves from
per-OPEN to **per-IDENTITY-CHANGE**. It sits ABOVE both of that function's early
returns (`if (force)…else if (onb.active) return;` and `if (!yumiBodyEl) return;`),
so an onboarding-active session or a never-yet-built panel cannot skip it, and it
runs on BOTH directions — sign-in (`integrations.js:124`) and sign-out
(`integrations.js:626`, force). An open panel of the previous user's proposals is
also closed. The stored-once law still holds for a session; the cache now dies with
the identity.

**Proof — user-aware stub, so the payload names whoever is signed in at generation:**

| step | observed |
|---|---|
| A generates | `lens-derived-from-userA` (1 API call) |
| sign-OUT (force) | status `idle`, stored **0** |
| sign-IN as B | status `idle`, stored **0** |
| B opens panel — **FIXED** | `lens-derived-from-userB`, **1 refetch** |
| B opens panel — **CONTROL (reset removed)** | **`lens-derived-from-userA`, 0 refetches** |

**VERDICT: PASS.** The control reproduces the leak exactly as described; the fix
closes it without re-billing within a session.

### BLOCK 2 — the UX-3 backstop timer was not scoped to its own commit

**The finding.** `nbCommitBusy = true; window.setTimeout(function(){ nbCommitBusy = false; }, 15000);`
was a bare unconditional reset. Commit #1 could finish legitimately at T+2s; commit
#2 could start at T+3s with its own uploads in flight; commit #1's stale T+15s timer
would then unlatch **commit #2's** gate — reopening the exact double-write race UX-3
exists to close, during the window it is meant to protect. Reachable in ordinary
"photograph a few pages" use.

**The fix** (`js/views.js`): a generation token. `nbCommitGen` increments per commit;
each backstop captures its own `myGen` in a closure and releases **only** if
`nbCommitGen === myGen`.

**Proof — driven through the REAL image branch, firing the REAL captured closures**
(`window.setTimeout` patched to capture the 15000ms callbacks; `nbPhotoIdbPut`
hung so commits stay in flight):

| step | observed |
|---|---|
| commit #1 armed (real photo staged) | `busy=true`, `gen=2`, 1 backstop captured |
| commit #1 finishes; commit #2 armed | `busy=true`, `gen=3`, 2 backstops captured |
| **fire commit #1's STALE backstop** | `busy` stays **true** — **NEGATIVE PASS** |
| **fire commit #2's OWN backstop** | `busy` → **false** — **POSITIVE PASS** (no permanent latch) |

**VERDICT: PASS.** The stale timer cannot unlatch a live commit, and the owning
timer still releases, so the hang-backstop the guard exists for is intact.

### Finding 3 (nit) — the classifier remainder, EXPLAINED not hand-waved

The red-team correctly flagged that `NET CODE + NET COMMENT ≠ total Δ` in every row,
and correctly called it load-bearing given that split is the argument about the band
breach. **It is a units mismatch, not an arithmetic error:** `git diff` lines each
carry a leading `+`/`-` marker byte that the file delta does not contain. The
remainder is therefore exactly `(added lines − removed lines)`. Verified per file:

| file | +lines | −lines | predicted remainder | red-team's measured gap |
|---|---|---|---|---|
| assets/components.css | 431 | 40 | **+391** | **391** ✓ |
| js/intros.js | 13 | 24 | **−11** | **11** ✓ |
| index.html | 14 | 1 | **+13** | **13** ✓ |

Three exact matches. The tables below now subtract the marker bytes, so they sum.

### Finding 4 — acknowledged
My dispatch brief to the red-team omitted `BOARD.md` from the changed-file list.
That was an error in the brief, not scope drift in the diff: BOARD.md is genuinely
modified, matches the build's claims, and was already listed in this checkpoint.

---

## FINAL BYTE DELTAS (after both red-team fixes; marker bytes removed)

| file | total Δ | NET CODE | NET COMMENT | CODE band | verdict |
|---|---|---|---|---|---|
| js/yumi-ui.js | +1,204 | **−949** | +2,153 | −1,400…+250 | **IN BAND** |
| js/intros.js | −215 | **−720** | +505 | −900…+100 | **IN BAND** |
| js/views.js | +5,081 | **+719** | +4,362 | −400…+3,000 | **IN BAND** (comment overage clears by classification) |
| index.html | +1,022 | **+863** | +159 | +40…+260 | **OVER** |
| assets/components.css | +19,024 | **+17,220** | +1,804 | +2,000…+11,000 | **BREACH — surfaced, not widened** |
| sw.js | +28 | +28 | 0 | +0…+40 | IN BAND |
| assets/praxis-kit.css | NEW 15,249 | — | — | est. was wrong | promoted artifact; authored delta over source = **842 B**, 23 diff lines |

The two JS files that absorbed the red-team fixes both **stayed inside their CODE
bands** (yumi-ui.js is still net −949 code even after the identity reset, because
L5's deletions dominate). The components.css breach is unchanged and remains
Preston's ruling.

## GATES, RE-RUN AFTER THE FIXES
- Parse gate (exit codes measured without a pipe): `js/yumi-ui.js` **0** ·
  `js/views.js` **0** · `js/intros.js` **0** · `sw.js` **0**. Harness self-validates
  (broken copy → exit **1**).
- ES3: the only raw-diff hit is `class=` inside an HTML string — false positive.
- Foundations byte-lock re-verified AFTER the fixes: `lumen-amber.css`
  `9879ddb8…` · `marks.js` `772886c0…` — unchanged.
- Console clean on every path driven.

---

## PRESTON'S RULINGS (2026-07-19, at the commit gate)

**1 · THE BAND — WIDENED EXPLICITLY, ON THE CLASSIFICATION EVIDENCE.**
`assets/components.css`'s declared CODE band of **+2,000…+11,000** is **widened to
the measured figure, +17,220 net code**. Preston's stated grounds: the diff is
scope-clean (Home / Notebook / nav chrome only), the growth is traced to the **7
offender classes the live scans found and the greps missed** (notably the second
actions container `.notebook-entry-overflow`), and both JS files that absorbed the
red-team fixes stayed inside their own bands. **This is a RULING, not a silent
widening** — the breach was surfaced with its classification before any commit, and
the band moved by decision, on evidence, in the open. FIX-PROTOCOL §3's prohibition
is on widening a band to make a number pass; it is not a prohibition on Preston
re-ruling a band he can see the evidence for.

**2 · THE TWO DEPARTURES — BOTH ACCEPTED.**

**(a) The interim dark-card ruling, correctly skipped on measurement.** The brief
pre-ruled a scoped dark card for Home's arc thumbnails "until B2 converts the
renderer, because candy on light is the proven 16/16 fail." B1 skipped it because
the premise does not hold for Home. **The measured ground truth, recorded here as
Preston directed:**

| what | measured value (rig, live) |
|---|---|
| `.home-wf` ground (whole-field variant) | `linear-gradient(rgb(244,230,196), rgb(238,220,178))` — light parchment |
| `.home-arcfield` ground (per-arc thumbnail, left variant) | same light parchment gradient |
| `.home-wholefield` card fill | `rgb(239,231,214)` (light) |
| mark fills, both renderers | `#BA7517` · `#D67248` · `#F0C82A` · `#F0A075` · `#C8842A` on a `#FAEEDA` plate |
| `--field-1` (the candy token, for contrast) | `#f2c25a` — **not used by these renderers** |

So Home already renders the **deep gold-channel-on-parchment** configuration the L3
Stage-0 proof PASSED — not the `--field-N` pastel candy that failed 16/16. Wrapping
it in a dark card would have put parchment-tuned deep marks onto dark: a regression,
and a violation of the interim ruling's own intent. **The renderer is untouched;
B2 still owns GR-1 app-wide.**

**(b) The spine-label removal, approved.** `.home-mspine-pending` ("cover pending",
6.5px, inside a 62×92 cover placeholder) is `display:none` rather than enlarged to
the 12px floor, where it would have crowded out the title beneath it. The empty
placeholder already carries "no cover" and the book's full title is on the anchor's
`title` attribute, so no reader and no assistive tech loses anything.

**3 · BOTH RED-TEAM FIXES CONFIRMED AS PROVEN** by Preston: the CO-1 identity reset
placed above both early returns, and the generation-token backstop. Recorded as
accepted, not merely asserted.

**4 · SHIP AUTHORIZED** — "commit and push" given, with `assets/praxis-kit.css`
explicitly included in the add (it is in `sw.js`'s `APP_SHELL`; omitting it would
fail the SW install on deploy).

---

## DEPLOYED LIVE SMOKE — v3.231 @ d5190b7 → PASS

Pushed `c97d476..d5190b7`; `HEAD == origin/main`; tree clean; foundations md5
re-verified unchanged AFTER the push. Netlify served v3.231 on the 2nd probe.

| check | evidence | verdict |
|---|---|---|
| sw.js ×2 cache-busted | probe 1 **praxis-v3.231** · probe 2 **praxis-v3.231** (Age 0, `must-revalidate`) | PASS |
| kit served + precached | `/assets/praxis-kit.css` HTTP **200**, **15,249 B**; present in deployed `APP_SHELL` | PASS |
| theme live | components.css carries both B1 blocks; `umberGroundDark = { books: 1` (home OUT); `YUMI_BLOOM_LINES` **0 hits**; index.html links the kit | PASS |
| Home @1920 · ground | `data-ground="bright"`, `body::before` = warm grain (dark radial retired) | PASS |
| Home @1920 · paper | `.home-page::before` **position:fixed**, `rgb(244,239,228)`, **1904.67px vs viewport 1905** — full-bleed; element bg transparent | PASS |
| Home @1920 · nav untouched | `.app-nav` `rgb(62,40,20)` — identical to pre-flip | PASS |
| Home @1920 · tokens | `--surface` **#fffdf8** (was #3e2814 dark) · `--ink-3` #645940 (AA collapse kept) | PASS |
| kit tokens live | `--space-xl` 32px · `--dur-gentle` 300ms | PASS |
| sweeps live | `.yumi-bloom-line` **0** · `.intro-summon` **0** | PASS |
| nav search | aria "Search books, arcs, sub-theories and notes"; well carved `rgb(107,74,35)`; ⌘K badge **12px** | PASS |
| Notebook signed-out | mounts, sign-in prompt, 0 leaves, **no crash** | PASS |
| Notebook B1 rules in deployed CSSOM | XL ≥1600 governor **1** · `.notebook-entry-tag` 12px **1** · reader upright **5** · `.notebook-entry-overflow` **14** | PASS |
| horizontal scroll | **0** on both pages | PASS |
| console | **clean, 0 errors** across both surfaces | PASS |

**Scope note on the browser pass, stated honestly:** the deployed samples above were
taken on the **signed-out** render path with the service worker unregistered and the
`praxis-v3.231` cache deleted to simulate a fresh client — not in a true Incognito
window, and not on `prestonpraxistest`. Every PG-1/L5/AMB-1/kit assertion is
auth-independent and is therefore fully proven above. The **signed-in composed**
Home (two-region grid, arc cards, spines) and the **seeded Notebook spread**
(leaves, entries, capture, debounce, save pulse) were proven on the rig against
byte-identical files, and are re-provable on the deploy in one signed-in pass.
`prestona255` was never touched — read-only throughout, no writes anywhere on
production.
