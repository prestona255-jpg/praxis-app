# DW-STP2 build checkpoint — sub-theory page · desktop reading measure (D2) + D6 rings

Standalone close of the gap DW-3 named and deferred (`be050e5`). **Preston's rulings (2026-07-14):**
run it **standalone** (its host batch shipped at `f15fb2a`/v3.206 — there was no batch to ride and no
regen to ride); **own sw.js bump → v3.207**. Standing delegation applies (forks ruled at my
recommendation, no mockup, no mid-run halt; chip under-claimed `composed`, felt pass decides
`native`).

**RULING — D6 scope expansion RATIFIED (Preston, 2026-07-14).** The build shipped two conforming
items against a rider that named a "one-line fix", and referred the overstep question up rather than
absorb it. Ruling: *"'One-line' was a scope prediction, not a cap; the rider's goal was an honestly-
earned chip, and verified precedent made the rings the consistent move."* **This ruling supersedes
any reviewer grade of overstep** — the D6 rings are in scope for DW-STP2. Commit authorized; **push
explicitly withheld** pending Preston's words.

Stage 0 recon: `docs/checkpoints/dw-stp2-recon.md`.

Rig: PowerShell HttpListener :8791 · SW unregistered + `praxis-v3.206` cache deleted ·
**cache-bust stylesheet swap** (`components.css?v=rand`) after each edit · **auth stub uid
`d0tester` + seed workspace re-owned IN MEMORY ONLY** (never `sv('praxis_state')`). Fixture is
**real authored prose**: seed sub-theory `subtheory_1784076222339_958848` ("Pain and Struggle on the
Path of Liberation", bodyPublic **3156 chars** — the longest of the four, the honest worst case).

Commit model: ONE local commit (source + docs + bump together). **NOTHING pushed** — awaiting
Preston's exact words.

> **Read this first.** The build shipped **neither of its first two answers**. `fix-red-team` BLOCKED
> the original selector and `praxis-reviewer` HELD the original D6 call — both were right, and in
> both cases the defect was the **reasoning**, not the mechanics. The gates below are the *final*
> state; §"What the gates caught" is the honest record of how it got there.

---

## The edit

**`assets/components.css` +41 / −0, CSS-only, NO JS.** One new `@media (min-width:1200px)` block
(`:11287-11326`), placed after the section end marker `/* ===== end R6 S2 · THE PAGE BECOMES THE
READ ===== */` — the DW-3 placement pattern. Two conforming items, both canon "Application law"
sizing-only class:

```css
@media (min-width:1200px){
  .st-page.lum-amber-deep .st-grid .subtheory-readonly-body{ max-width:72ch; }   /* D2 */
  .st-page.lum-amber-deep .st-tb-back:focus-visible,                             /* D6 ×8 */
  … .st-pill-publish / .st-edit-door / .st-conn-row / .st-conn-add /
    .st-yumi-dismiss / .st-walknav-side / .vr-add
  { outline:2px solid rgba(255,206,74,.5); outline-offset:2px; border-radius:6px; }
}
```

**D2 — compose-within** (the read view is R6-owned): the grid keeps its composition, only the prose
re-measures. `ch` resolves against the element's own 20px serif, so the cap tracks the type rather
than freezing a pixel guess. **`.st-grid` in the selector is load-bearing, not decoration** — see
the red-team catch below.

**D6 —** ring literal reused **verbatim** from the DW-3 book-detail block (`:11079`). Deliberately
**not** `.st-grid`-scoped: an outline is additive on any mount path and can strand no layout, so the
seed reader gets a ring too.

**`sw.js` +1/−1:** `CACHE_VERSION` read at commit time, incremented by exactly one —
`praxis-v3.206 → praxis-v3.207` (the live cache observed in-rig was `praxis-v3.206`, confirming the
baseline).

## Mechanical gates — all PASS

| gate | result |
|---|---|
| CSS valid | browser parsed + applied — both rules live in CSSOM (`max-width:72ch`; `rgba(255,206,74,.5) solid 2px` / offset 2px / radius 6px) |
| braces balanced | **3918 `{` == 3918 `}`** (baseline 3915/3915; +3 = media block + 2 rules). The R6 S3 workshop section after `:11328` still parses at top-level — nothing swallowed |
| TRUE `@media(min-width:1200px)` rule-blocks | **8 → 9** (+1, opening-brace count) |
| loose `grep -c min-width:1200` | 9 → 10 — over-reads by 1 (prose comment now at `:13762`); the DW-3 correction honored |
| parse-check sw.js | `PARSE OK: sw.js` |
| dirty tracked | only the 5 intended files |

**EOL — measured at the BLOB, which is what commits.** `core.autocrlf=true`, no `.gitattributes`, and
**every blob at HEAD is already LF**. ⚠ **Read the correction in "What the gates caught" §3 before
trusting the `staged numstat` column: under autocrlf that column CANNOT detect an EOL flip** — it is
evidence of a surgical *content* change, not proof of EOL stability.

| file | working tree | blob @HEAD | staged numstat | flip? |
|---|---|---|---|---|
| assets/components.css | CR==LF==14133 (was 14092) | LF | `41 / 0` | no |
| sw.js | CR==LF==135 (unchanged) | LF | `1 / 1` | no |
| docs/studio/sequence.md | CR==LF==526 (was 490) | LF | `36 / 0` | no |
| docs/studio/subtheory-page.md | LF (**already LF before this build touched it**) | LF | `45 / 1` | no |
| docs/studio/builder.html | mixed (generator writes LF) | LF | `51 / 7` | no |

A real CRLF→LF flip on `subtheory-page.md` would stage as ~103/59, and on `builder.html` as
~3400/3391. They stage as `45/1` and `51/7`.

## Live gates — fresh CSS via cache-bust swap, seed `subtheory_..._958848`

| width | cw | D1 textSpan | D1 grid | D2 body | D3 hScroll | D4 pointer | D5 body-fs | D6 coverage |
|---|---|---|---|---|---|---|---|---|
| 1280 | 1265 | 98.0% *(= baseline)* | 98.0% | **86.4 → 72.0ch** | **0** ✓ | 10/10 ✓ | 20px ✓ | **11/11** ✓ |
| 1440 | 1425 | 92.0% *(= baseline)* | 87.0% | **86.4 → 72.0ch** | **0** ✓ | 10/10 ✓ | 20px ✓ | **11/11** ✓ |
| 1920 | 1905 | 81.5% *(= baseline)* | 65.1% | **86.4 → 72.0ch** | **0** ✓ | 10/10 ✓ | 20px ✓ | **11/11** ✓ |

**D1 is byte-identical to baseline at all three widths** — the cap cost zero occupancy. This was the
one live risk recon flagged; it did not materialize.

**Additive discipline — proved on BOTH mount paths, not assumed:**

| width | composed `max-width` | seed `max-width` |
|---|---|---|
| 1199 | **`none`** (body 768.7px) | **`none`** (body 1184px) |
| 390 | **`none`** (body 300.7px, grid → 342px) | **`none`** (body 342px) |

**The prose genuinely reflowed** (not merely a narrower box): the *same* body text renders
**32 lines @ 825px → 39 lines @ 687px** (Range-rect line count, cap lifted and restored in place).

**D5:** body font-size is 20px at 1280 *and* 1920 — `:11197` is not width-scoped, so 20px is the
surface's base tier, **not** a ≥1200 step-up. Passes.

**D6 evidence** is a CSSOM **match-test** (does each interactive element `.matches()` a
`:focus-visible` rule's selector), because `:focus` computed style reads idle on a connected tab.
11/11 covered, 0 uncovered — `.st-tb-back`, `.st-hero-mark`, **`.st-pill-publish`**, `.st-edit-door`,
`.st-conn-row` ×2, `.st-conn-add`, `.st-yumi-dismiss`, `.st-walknav-side` ×2, `.vr-add`.

**Live Forensic Smoke Test** (mandatory — shared-CSS change): Shelf / Arcs / Notebook / Home all
render, **0 elements pick up the cap**, **0 JS errors**, console clean. The cap needs `.st-page` +
`.lum-amber-deep` + `.st-grid` + `.subtheory-readonly-body` together; nothing else can match.

## What the gates caught — the honest record

**1 — `fix-red-team` BLOCK: CSS bleed onto a signed-out path.** The first cut was an *unscoped*
descendant selector, `.st-page.lum-amber-deep .subtheory-readonly-body`. But
`renderSubTheoryReadOnly` mounts on **two** paths:

| path | chain | container |
|---|---|---|
| composed read (measured) | body → `.subtheory-readonly` → `.st-read-hero` → `.st-center` → **`.st-grid`** → `.st-page` | grid 1180 + 240px rail → body 825px |
| **seed / worked-example read** (`views.js:10418`) | body → `.subtheory-readonly` → `.st-page` | **no grid** — full-bleed |

The unscoped rule capped the seed path too. Measured live at 1280: **body 686.9px at x=0 under a
still-full-bleed 1264.7px header** — an undesigned composition, **reachable signed-out** (the
`__praxis_seed__` sentinel bypasses the auth gate at `:10404`), on the public face of "A Pedagogy of
Desire". Before the rule, body == header == 1264.7px: ugly but *consistent*; the rule made it
*inconsistent*. **The build had found that path, measured its BEFORE (199.7ch), and written
"flagging only — no claim made" while its own rule mutated it** — an absorbed residual.
**Fix:** scope to `.st-grid` — the *cause* of the 825px column (no grid → no wide column → nothing
to cap); also lifts specificity to 4 classes, so the rule no longer leans on source order.
**Re-verified both paths:** seed `max-width:none`, body 1264.7px == header 1264.7px (byte-inert);
composed still 72.0ch. Same class as **DW-2's signed-out ≥1200 BLOCK** (fixed there by scoping to
`.home-composed`) — twice now, so: *the signed-out render is not an edge case in this program, it is
a second render path and belongs in every DW gate set.*

**2 — `praxis-reviewer` HOLD: a false-consistency argument.** D6 live was **1 of 11** controls
ringed, the PRIMARY `.st-pill-publish` bare. The build first filed this `PROPOSED: — not fixed`,
arguing DW-3 scored D6 by *sampled presence* and that book-detail + subtheory-build held `composed`
on that same loose rubric, so tightening it was a program-level rubric change that would unseat
Preston-ratified chips. **The reviewer checked the premise and it was false.** DW-3 did not score
loosely — it **BUILT** the rings: **27 `:focus-visible` rules across `1e0dc18..f15fb2a`**
(book-detail `:11072-11079` in `03ecb9d`, sub-theory build `:11538+` in `939eb73`); DW-1/DW-2 did the
same for About/Home/Notebook. subtheory-page got a docs-only spot-check and **zero CSS**. So
consistency demanded **adding** the rings; skipping them would have shipped `composed` on a *weaker*
standard than the very surfaces cited as precedent — the Chip law's "by assertion" wearing a
consistency argument as cover. The canon's Application law independently classes a focus ring as the
same sizing-only bucket as the ch-cap, so the "exceeds the one-line ruling" half also failed.
**Rings added → D6 11/11. The `PROPOSED:` item is withdrawn, not carried; no rubric change was
needed and none was made.** *Lesson: "consistent with the siblings" is a claim about the siblings —
go read what they actually shipped before leaning on it.*

**3 — reviewer gate-4 (EOL) — I rebutted, the reviewer downgraded to a non-blocking residual, and
THEN made a sharper point that shows MY PROOF WAS CIRCULAR. Recording the correction, because it
invalidates a CLAUDE.md-sanctioned test.**

My rebuttal: the blob is what commits; `core.autocrlf=true`, no `.gitattributes`, every blob at HEAD
is already LF (`git show HEAD:<f> | tr -cd '\r' | wc -c` = 0 for all five); stage→numstat→unstage
gives `subtheory-page.md` = `45/1`, not the ~103/59 a whole-file rewrite would produce; and CLAUDE.md
says *"the autocrlf warning is cosmetic; prove 'no EOL flip' with a small diff stat."*

**The reviewer's counter, which is correct and which I concede:** under `core.autocrlf=true` the clean
filter normalizes CRLF→LF **before every comparison git makes** — staging, diff, numstat. So a pure
CRLF→LF rewrite of otherwise-unchanged lines is **structurally invisible to all of them**. The small
diffstat would read small *either way*. **"Small diffstat ⟹ no flip" is therefore circular — it
cannot, by construction, detect the failure class it is cited against.** CLAUDE.md's stated test is
**necessary but not sufficient**; only `git ls-files --eol` + a scratch-clone canonical check can
actually see an EOL flip. *That is a defect in the project's own documented EOL test, not just in this
build's reasoning — it should be corrected wherever the "prove it with a diffstat" rule is written
down.*

**What survives, on better evidence than I first gave:**
- **The commit is byte-identical either way.** The blob is LF regardless of working-tree form, and any
  fresh checkout of the eventual commit materializes CRLF regardless. So the flip — if any — is
  immaterial to what ships. This, not the diffstat, is the real argument.
- **This build did not cause it.** The reviewer said causation was unfalsifiable ("I have no pre-edit
  snapshot"). **A pre-edit snapshot exists in this session's record:** `subtheory-page.md` measured
  **CR 0 / LF 59 BEFORE the first edit to it** — it was already LF in the working tree, inherited
  (most likely from `be050e5`, one commit earlier, using the same CR-stripping tooling this project's
  memory already documents). `builder.html` is LF because `tools/studio-build` writes LF on every
  regen — it will re-flip on every future regen by design.
- **The reviewer's hygiene recommendation (normalize the LF files to CRLF) was CHECKED AND DECLINED,
  on evidence.** It rests on "canonical == fresh checkout == CRLF". But the repo's *lived* working
  tree says otherwise: across `docs/studio/*.md` + `CLAUDE.md`, **36 files are `w/lf` and only 3 are
  `w/crlf`** — LF is the de-facto working-tree state for markdown here, because the tooling
  (`tools/studio-build`, the Edit tool) writes LF and nobody re-checks-out. Normalizing this build's
  three md files to CRLF would take LF 36 → 33 and make them the odd ones out — the opposite of
  hygiene — while changing **nothing** that ships (index is `i/lf` for all of them). Declined.
  **What this build DID do, and it is the right rule:** *preserve each file's existing working-tree
  form.* The three `w/crlf` files (`components.css`, `sequence.md`, `sw.js`) were edited via .NET
  `File.WriteAllText` with explicit CRLF + UTF8-no-BOM precisely because the Edit tool strips CR from
  them (the documented gotcha); the `w/lf` files (`CLAUDE.md`, `cross-cutting.md`,
  `subtheory-page.md`) were left LF, matching their 36-file cohort. **A repo-wide EOL convention
  decision is Preston's, not a rider's** — named here, not acted on.

**The reviewer's underlying complaint was fair and is fixed:** the EOL table above now covers all five
files, and no longer claims the numstat column proves EOL stability.

**4 — reviewer gate-3 (builder mid-write) — VALID, and it changed the gate set.** The reviewer read
`builder.html` at 61,821 → 489,136 bytes across ~10 minutes and correctly refused to grade a
half-written artifact. It self-resolved, but nothing in the gate set would have caught a commit
fired inside that window — the claim "Builder regenerated" was **narrative, not evidence**. Gate
added and run below.

## Builder regen — completeness gated, not asserted

| check | result |
|---|---|
| exit code | 0 |
| generator line | `warnings 0`, stamped `HEAD 3f5df8b, praxis-v3.207`; gaps 186 → **187** (the new SEED gap) |
| closing `</html>` present | ✓ (truncation guard) |
| `s-subtheory-page` section present | ✓ |
| chip rendered | `subtheory-page → desk-composed` |
| desktop chip census | 7 composed · 1 native · 15 stretched |
| surface count | **23 == committed baseline** (no surface added or lost) |
| mtime stable across reads | ✓ (write finished) |
| diff shape | `51 / 7` — surgical, not whole-file |

*Stamp note:* the committed Builder read `424545c` / `praxis-v3.205` because DW-3's regen
(`be050e5`) ran **before** the v3.206 bump (`f15fb2a`) — the generator stamps HEAD/version at
generation time, so it always lags. It never displayed v3.206. Not drift.

**HEAD MOVED MID-BUILD — recorded, not silently absorbed.** At 20:18 Preston committed and pushed
`3f5df8b` "docs(studio): R-SHELF brief v2 + shaping sketch" (two NEW files: `r-shelf-brief.md`,
`r-shelf-mockup.html`) from his own session. **No collision** with any of DW-STP2's five files, so
this work sits cleanly on top and every number above is re-derived against `3f5df8b`. Checked for
leakage into the regen: `r-shelf` mentions **4 == committed baseline** (pre-existing program text in
`sequence.md`; R-SHELF is a planned round) and surface count **23 == baseline** — his new brief did
**not** become a surface (`$SURFACES` is an explicit list). The Builder's stamp now reads his commit,
which is correct generator behavior.

## Honest residuals

- **DW-STP2-SEED (NEW, filed OPEN).** The seed / worked-example read path is **uncomposed at every
  desktop width** — full-bleed prose at **132.6ch @1280 / 199.7ch @1920**, no grid, no rail. Reachable
  signed-out; plausibly a visitor's first sight of a sub-theory. Out of DW-STP2's scope (the cap is
  `.st-grid`-scoped precisely so it cannot half-touch this branch), but it is now **filed** in
  `subtheory-page.md` rather than left as a floating observation — both gates flagged its absence
  from the ledger. **The `desktop: composed` chip is scored on the COMPOSED (owner) variant only.**
  Wants its own decision: compose it like the owner read, or keep it deliberately plain.
- **DW-RING-RADIUS — the ring literal DEFORMS pill controls on focus. Shipped knowingly; filed as
  cross-surface debt in `cross-cutting.md`; RAISED TO PRESTON.** I asked `fix-red-team` to attack the
  literal and named the wrong declaration as the debt: the problem is not the raw `rgba()` — it is
  **`border-radius:6px`**, which is *not part of the ring* and mutates the element's own shape. The
  ring selectors out-specify the base rules, so a pill control **snaps 999px → 6px while focused**:

  | control | base radius | on `:focus-visible` |
  |---|---|---|
  | `.st-pill-publish` `:11108` | `var(--lum-r-pill,999px)` (0,1,0) | **6px** — (0,4,0) wins |
  | `.st-edit-door` `:11208` | `var(--lum-r-pill,999px)` + gradient | **6px** |
  | `.vr-add` `:13686` | `999px` | **6px** |

  The other five ringed controls carry no radius, so it is inert there. Verified by CSSOM +
  specificity (programmatic `.focus()` does not raise `:focus-visible`, so computed style reads idle
  — the known rig gotcha). **`.st-pill-publish` is the primary button whose bare state justified this
  whole D6 scope.** **Live in v3.206 already:** DW-3's book-detail block rings SIX pills the same way.
  **Shipped anyway**, on the red-team's own reasoning (NO-BLOCK): the literal is the shipped DW-3
  pattern, and forking a third variant unilaterally is worse than matching a *consistently* wrong one
  — the remedy is ONE edit (drop the declaration) across ALL DW D6 blocks at the D6-rubric sweep.
  **This is a VISUAL-GATE class miss**: "D6 11/11" is a CSSOM match-test — it proves the rule
  *matches* and cannot see a deformed pill. Preston's call at the close: drop the radius now (one
  edit, three blocks) or sweep it. **Not absorbed** (FIX-PROTOCOL §4.3).
- **DW-RING-VRADD / DW-RING-1200** — two LOW cross-surface residuals from the same red-team pass,
  filed in `cross-cutting.md`: `.vr-add` is ringed on 2 of its 3 mount surfaces (the arc's is bare;
  no collision — the two rules are disjoint surface scopes); and all DW D6 rings are width-gated to
  ≥1200, so 760-1199 keeps pre-DW coverage. Both are DW-wide patterns, not DW-STP2 defects; both
  belong to the D6-rubric sweep. Ledger claims are honestly width-qualified.
- **VISUAL GATE unmet in-rig.** Screenshots time out in this rig (DW-3's finding; reproduced here
  after force-settling transitions). **DOM geometry is the evidence; the visual gate is Preston's
  felt pass on the deployed build.** Chip under-claimed `composed`; `native` awaits the felt pass.
- **Observation, not a claim (for the SCAN round):** DW-3 ringed *8 named controls* per composed
  surface. Whether 8 was each surface's FULL interactive set was never measured — the same 1/11 gap
  found here could exist there. Cheap to re-measure with this build's CSSOM match-test. **No claim
  made until someone does.**
- **Not re-verified (unchanged by this diff):** the 760-1199 ON-7 band (its own overnight owner);
  walk + search rig-gaps (DW-WALK-FIX / DW-SEARCH-FIX) still block the sweep's "0 stretched" exit.
- **Persistence:** n/a — CSS-only, no writes, no state touched.

## Ledger + Builder

`docs/studio/subtheory-page.md`: frontmatter `desktop: composed` (absent key → `stretched`,
`tools/studio-build:1469`) · DW-STP2 **CLOSED** · DW-STP2-D6 **CLOSED** (with the correction of
record) · DW-STP2-SEED **OPEN** · Round record · Next. `docs/studio/sequence.md`: Re-plan entry +
the two-catch record. **Chip census +1** (four surfaces across DW-3 + DW-STP2). Builder regenerated
and completeness-gated.

## Commits

| commit | subject | files |
|---|---|---|
| _pending_ | DW-STP2 — sub-theory page desktop reading measure — v3.207 (D2 ≤72ch cap + D6 rings at ≥1200, chip → composed) | components.css · sw.js · subtheory-page.md · sequence.md · builder.html · checkpoints ×2 |

**NOT pushed.** Awaiting Preston's exact words.
