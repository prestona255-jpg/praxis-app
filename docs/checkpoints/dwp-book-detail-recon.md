# DW-POLISH · Book Detail — Stage 0 recon + baseline + composition proposal

**Session:** DW-POLISH (the design pass). **Date:** 2026-07-15.
**HEAD at recon:** `5cb60e4` == `origin/main`. Tracked tree clean.
**Status: HALTED at Stage 0 for Preston's call.** Nothing built, nothing staged.

---

## 0 · Stage 0 gates — ALL GREEN

| Gate | Required | Observed | Verdict |
|---|---|---|---|
| HEAD == origin/main | `5cb60e4` or descendant | `5cb60e4` == `origin/main` | PASS |
| Tree clean | tracked files clean | `git status --porcelain -uno` → empty | PASS |
| Live sw.js == repo | v3.208 | md5 `0c188f4f…` **identical** both sides; `CACHE_VERSION='praxis-v3.208'` | PASS |
| Hook gate | armed | `core.hooksPath = hooks` (ground-truth) | PASS |
| No other session | — | no `index.lock` / MERGE_HEAD / rebase dir; only this worktree on `main` | PASS |
| Rig | loaded, not rebuilt | `.claude/rig/{serve.ps1,seed.js,measure.js}` loaded verbatim from disk | PASS |

**Rig note.** `.claude/rig/` has **no README** — the prompt refers to one. The traps the prompt
cites are real but live in the three files' header comments (port-reuse SW ghosts + cache-bust
mechanism → `measure.js:38-65`; Tab-armed `ringProbe` → `:276-300`; `rig.hollow` → `:168-185`;
`proveInert` → `:368-386`). Named as a doc gap: **DWP-RIG-README**.

**Port hygiene (the "fresh port is a LIE" trap).** Served on :8801, then FIRST probed
`caches.keys()` → `["praxis-v3.208"]`, i.e. current-repo bytes, no ghost SW from an earlier
session. Then unregistered (1 SW) + deleted (1 cache), reloaded, re-installed the rig.

---

## 1 · The surface as built (live, measured — not from docs)

`renderBookDetail` (views.js ~9264-9650) emits ONE container `.bk-shell` inside
`section.bk-surface.lum-amber-deep`. At ≥1200 it is a CSS grid — the **DW-3** composition,
`assets/components.css:11150-11201`:

```
.bk-surface .bk-shell{ display:grid; grid-template-columns:minmax(0,1fr) 340px;
                       grid-auto-rows:min-content; column-gap:44px; align-items:start;
                       max-width:1200px; }                                   /* :11170 */
.bk-surface .bk-shell > .bk-hero { grid-column:1; grid-row:2; }              /* :11173 */
.bk-surface .bk-shell > .vr-card { grid-column:2; grid-row:2; margin:0; }    /* :11174 */
.bk-surface .bk-shell > .bk-cols { grid-column:1; grid-row:7 / span 5; }     /* :11185 */
.bk-surface .bk-shell > .bk-actions{ grid-column:2; grid-row:7; … }          /* :11186 */
.bk-surface .bk-shell > .bk-edit-toggle{ grid-column:2; grid-row:8; … }      /* :11187 */
.bk-surface .bk-shell > .bk-find { grid-column:2; grid-row:9; … }            /* :11188 */
```

Rows 3-6 are the four on-demand panel rows (editor / arc-picker / send-to-sub host +
`.bk-edit-panel`), collapsed to 0 when idle — the DW-3 fix for the "picker lands at the page
bottom" defect. **They are load-bearing; do not reclaim rows 3-6.**

**The three stacks Preston felt, located exactly:**

| Stack | Element | Where it lives | Width @1920 |
|---|---|---|---|
| Hero | `.bk-hero` | shell grid col 1, row 2 | 816px |
| Middle | `.bk-main` (in `.bk-cols`, a **nested flex row**) | col 1, row 7/span 5 | 542px |
| "Aside" | `.bk-aside` (also in `.bk-cols`) | beside main, **inside col 1** | 250px |
| Rail | `.vr-card` + `.bk-actions` + `.bk-edit-toggle` + `.bk-find` | col 2, rows **2, 7, 8, 9** | 340px |

**This is the "three stacks share a page but not a grid" diagnosis, made mechanical:**
`.bk-cols` is a **flex row nested inside grid column 1**. So `.bk-main` and `.bk-aside` are NOT
on the shell's tracks at all — their edges cannot relate to the rail's. And the rail is not one
object: it is **four separate grid items pinned to four different rows**.

---

## 2 · Baseline — the gates ALL PASS and the page is still undesigned

This is the session's thesis, in numbers. Signed-in (stub `d0tester`), seed book
"Their Eyes Were Watching God" (3 marginalia + 1 journal + the artifact — the richest seed book).

| Gate | @1280 | @1440 | @1920 | Canon threshold | Verdict |
|---|---|---|---|---|---|
| D1 occupancy `.bk-shell` | 94.9% | 84.2% | **63.0%** | ≥60% @1920 | **PASS** |
| D2 widest prose | 70.8ch | 70.8ch | 70.8ch | ≤72ch | **PASS** |
| D3 h-scroll | 0 | 0 | 0 | 0 | **PASS** |
| D5 body font | 16px | 16px | 16px | unchanged | **PASS** |

**And yet — the vertical instrument:**

```
rig.hollow(rail items) →
  gaps: [195, 14, 14]   maxGap 195   medianGap 14   suspect: TRUE
  verdict: "HOLE: maxGap 195px vs median 14px — a track is sized by a sibling,
            not by its own content"
```

Identical at **1280, 1440 and 1920** — the hole is width-invariant, because the shell is a fixed
`max-width:1200` with hardcoded `816px 340px` tracks (computed `grid-template-columns` reads
literally `"816px 340px"` at every width).

**Mechanism (root-caused, not guessed).** `.bk-hero` is `grid-row:2` and `.vr-card` is
`grid-column:2; grid-row:2` — **the same track**. The track sizes to the taller sibling (hero,
266px → row 2 = 288px); `align-items:start` leaves `vr-card` (93px) floating with a **195px void
beneath it**. `grid-auto-rows:min-content` (:11170) cannot help: min-content of row 2 *is* the
hero.

### Other measured voids

- **Dead rail tail: 799px.** Last rail item (`.bk-find`) bottoms at y660; the content column runs
  to y1459. The rail stops a third of the way down the page.
- **Hero void is TOP-RIGHT, not "half the card."** Measured by **Range-inked** width (not boxes):
  title `.bk-bt` inks **380.4px inside a 588px box**; author `.bk-ba` inks **127.8px**. But the
  hero's rightmost ink is the `♡ This moved me` button at x=1068.5 vs a content edge of 1139 —
  only **70.5px** dead at the right. So the hero's emptiness is a **~208 × ~64px void beside the
  title/author**, plus **73px** of vertical slack (`.bk-hinfo` h164 inside a h266 hero — the
  cover's 208px drives the height). *Correction to the brief's "~half the card empty": the honest
  figure is a top-right void, not half.*
- **Hierarchy, quantified.** "In your thinking" = 542px = **28.5%** of a 1920 viewport. The ISBN
  block (`.bk-meta`, "The book") sits **beside it as a peer** at 250px / 13.1%.

### The gates could not see any of this
D1/D2/D3/D4 are **all horizontal**; D5 is a font-size check. Not one of them can see a 195px
vertical void. This is the DW-4 270px-hole lesson repeating on a different surface — and it is
the evidence for the program lesson this round must record.

---

## 3 · ⚠ DW-3's Round Record overclaims — correction required

`docs/studio/book-detail.md` (DW-3 Round record) states:

> "rail items clustered beside the tall content via `grid-auto-rows:min-content`
> (verified — no spread, `vrOverflow:0`)"

**This is false as a claim about the rail.** Live: a **195px hole** between `.vr-card` and
`.bk-actions`, at all three widths. `min-content` *does* work for rows 7-9 (actions/edit/find
cluster; the spill lands in implicit rows 10-11, measured at 399.453px each) — but it never
governed row 2, where the hero sits. `vrOverflow:0` measured **overflow**, not the **gap**: a
horizontal/overflow instrument, blind to a vertical void. Same failure class as DW-4.
→ Fold this correction into `book-detail.md` in the build commit (docs ride with the diff).

---

## 4 · Data recon — what actually exists at render time

The brief forbids new data ("arrange what exists"), so what exists governs the design.

- **Marginalia** = `state.notebookEntries` filtered `register==='marginalia'` with a **`bookIds`
  array** (not `bookId`), via `marginaliaForBook`. Seed-owned entries **deliberately surface
  signed-in AND signed-out** (W12 S10 comment in the fn) — so the rig can measure this region
  honestly on both paths. `state.marginalia` does not exist (0 keys) — a red herring.
- **`valueMarks` = EMPTY on all 5 seed books.** So "Values this carries" renders its **empty
  state** (93px: heading + `+ mark a value`). *A book with real values renders a taller card —
  Stage 1 must measure a values-populated fixture, or the rail geometry is measured on its
  thinnest possible case.*
- **ISBN present on all 5 seed books; `subjects` empty on all 5** (the `dl` shows `Subjects:
  Novel` from lens tags, not `book.subjects`).
- **`.bk-reading` ("Your reading") duplicates content already on the page** — a design-relevant
  find:
  - its `Status: Currently reading` row restates the hero's `.rstatus` control, which already
    shows "Currently reading" as the **selected** option;
  - its `Passages marked: 3` restates `.bk-tcount` ("You have 3 marked passages here");
  - its only **unique** payload is the **Rating** (5 stars).
  The duplication is invisible today only because the two live ~700px apart in different
  columns. **Consolidating status into the hero (spec 4) makes it glaring.** Named:
  **DWP-STATUS-DUP**.
- **No `<h1>` on the page** — the title is `div.bk-bt`. Pre-existing a11y gap, out of scope.
  Named: **DWP-NO-H1**.

**Render paths enumerated** (from `renderBookDetail`): not-found (`.bk-empty` + backlink, early
return) · no author (`.bk-ba` skipped) · no tags (`bookLensTags` → null) · no arc chips
(`buildBookArcChips` → null) · **signed-out** (`.bk-controls` suppressed; `.bk-actions` replaced
by `.bk-signinrow` + `.bk-signin`; copy forks on 4 strings incl. "In your thinking" → "In this
reading") · no artifact · `rooted.length>0` gates the cover root-mark + hero Yumi whisper.
**All must be gated in Stage 1.**

---

## 5 · Guard bands — baselines recorded (for the mobile law)

| Width | nodes | `djb2` | `djb2geom` | h-scroll | Notes |
|---|---|---|---|---|---|
| 390 | 126 | `f26f7867` | `245d7ba2` | 0 | `.bk-shell` correctly `display:block` |
| 1024 | 143 | `99d0813c` | `c6b3f89c` | **40** | **ON-7 residual — PRE-EXISTING, OUT OF SCOPE** |

**ON-7 @1024 reproduces exactly as `book-detail.md` predicts**: `scrollWidth 1049` vs
`clientWidth 1009`, `.bk-surface` computed `box-sizing:content-box`, `matchMedia(min-width:1200)`
= false. The DW-3 fix is scoped inside the ≥1200 block (:11169), so the 760-1199 band keeps the
defect. **This band must be left byte-identical; the 40px is not mine to fix.**

---

## 6 · THE COMPOSITION PROPOSAL

### The move, in one line
**Make the rail one object that spans the page's full height, and put every stack on the shell's
own tracks — so the 195px hole cannot exist by construction.**

### Proposed grid (≥1200 only; ≤1199 untouched)

```
.bk-shell : grid  [ minmax(0,1fr) | 340px ]   column-gap 44px   align-items:start
  row 1        .bk-backlink      1 / -1
  row 2        .bk-hero          col 1          |   .bk-rail   col 2, grid-row 2 / -1
  rows 3-6     on-demand panels  1 / -1   (UNCHANGED — DW-3's fix, load-bearing)
  row 7        .bk-main          col 1          |   (rail continues)
```

- `.bk-rail` = **ONE new wrapper**, `display:flex; flex-direction:column; gap:16px`, spanning
  from the hero's top to the page bottom. Contains: `.vr-card` → `.bk-reading` → `.bk-actions`
  → `.bk-edit-toggle` → `.bk-find`.
- `.bk-cols` / `.bk-aside` dissolve at ≥1200 (`display:contents`), promoting `.bk-main` onto the
  shell's tracks. `.bk-meta` ("The book") demotes to **footer-weight** at the bottom of `.bk-main`
  — spec 4 explicitly permits "rail, collapsed, or **footer-weight**".

**Why a wrapper is structurally necessary (not a preference).** Two independent columns of
differing height in ONE grid *always* re-create the hole unless each column is a **single grid
item** — a spanning item distributes its height across every auto track it spans, inflating the
tracks its neighbours sit in. That is exactly today's bug (implicit rows 10-11 = 399.453px each).
`display:contents` alone cannot fix it; only "one column = one item" can.

### PROTOTYPED LIVE — this is measured, not predicted

Built in the throwaway pane (CSSOM + DOM, no repo file touched) and measured @1920:

| Metric | Baseline | Proposal (prototype B) | |
|---|---|---|---|
| `rig.hollow` rail gaps | **195**/14/14 → **HOLE** | **16 / 16 / 16 / 16** | **uniform rhythm — hole GONE** ✓ |
| D1 occupancy @1920 | 63.0% | **64.2%** | ✓ |
| "In your thinking" | 542px / **28.5%** | 816px / **42.8%** | **+50% width** ✓ |
| `rig.hollow` main | uniform 26 | uniform 26/16 | ✓ |
| D3 h-scroll | 0 | **0** | ✓ |
| **D2 widest prose** | 70.8ch | **109.9ch** | **FAIL — see Fork 3** |

### DOM-touch inventory

| Change | Kind | Justification |
|---|---|---|
| Add `.bk-rail` wrapper | **DOM (new element)** | Structurally required (above). This is the restructure the sweep forbade. |
| Move `.bk-reading` → rail | **DOM (move)** | Spec 4: status sits with hero **or rail**. |
| Move `.bk-edit-toggle`, `.bk-find` → rail | **DOM (move)** | They are already visually in the rail; only their DOM home is elsewhere. |
| Move `.bk-meta` → end of `.bk-main` | **DOM (move)** | Spec 4 "footer-weight". |
| `.bk-cols`/`.bk-aside` → `display:contents` | **CSS-only** | Dissolves the nested flex without deleting elements. |
| Grid placement, gaps, D2 caps | **CSS-only** | |
| Rows 3-6 on-demand panels | **UNTOUCHED** | DW-3's fix is load-bearing. |
| ON-7 @760-1199 | **UNTOUCHED** | Not mine. |

### The mobile consequence (stated plainly, not buried)
DOM changes ⇒ **fingerprints WILL differ at ≤1199** and mobile order **necessarily** changes —
mobile is a linearisation of the same DOM, and the rail's members are not contiguous today. With
`.bk-rail` emitted **before** `.bk-main` (grid placement makes DOM order irrelevant at ≥1200):

| | live mobile order | proposed |
|---|---|---|
| | hero → values → actions → **thinking → artifact → the-book** → reading → edit → find | hero → values → **reading** → actions → **edit → find** → **thinking → artifact → the-book** |

**Delta = 3 nodes hoisted** (`reading`, `edit`, `find`); the `thinking → artifact → the-book`
spine keeps its relative order and stays below the actions, and `the-book` stays last (demoted —
an improvement, aligned with spec 4). No content added or removed. Full ≤759 + 760-1199 re-gate
owed, per the brief, plus Preston's mobile felt glance.
*Trade-off to note: with the rail DOM-first, desktop **focus order** visits the rail before the
main column while the eye reads main-left first (WCAG 2.4.3). The alternative (main DOM-first)
inverts the problem onto mobile, dropping the primary actions below a long marginalia list. I
recommend rail-first + the hoist above; flagging because it is a real trade, not a free win.*

---

## 7 · FORKS — Preston's call (the reason this halts)

**FORK 1 — the §4-I citation does not resolve.**
The brief orders "the canon §4-I page pattern — cover-left | title/author/meta/status-right".
But `docs/studio/praxis-desktop-canon.md` is **117 lines and has no §4-I at all** (it is D1-D6 +
application/chip law). The only §4-I is **CLAUDE.md:298**, and it says something **different**:

> "Desktop stays two-column (**cover + action stack left; title + artifact right**)."

That arrangement has **never been built** (live: actions are in the rail; the artifact is under
the thinking in col 1), and DW-3 already re-read §4-I as "content|rail two-column intent"
(components.css:11156). CLAUDE.md is "authoritative for conventions… **Conflict = halt and ask**."
→ **Recommendation:** follow **the brief's** wording (your live work order) and record CLAUDE.md
§4-I's desktop clause as **stale**, correcting it in the build commit. Needs your ruling.

**FORK 2 — the hero: how much width, and the duplication it exposes.**
Spec 2 wants a full-width hero that "uses its width". Measured, the hero is **not** very hollow
horizontally (70.5px dead right); its void is the ~208×64px region beside title/author. Widening
the hero to the full 1200 makes `.bk-hinfo` ≈1000px against a 380px title — **more** dead space,
unless the status zone moves in. Moving `.bk-reading` in is what fills it — and that surfaces
**DWP-STATUS-DUP** (its Status row restates the hero's own control; its Passages-marked row
restates `.bk-tcount`). Deleting those rows is a **content change**, which the brief forbids me
to take unilaterally.
- **(A)** Full-width hero + status zone → **you rule on the duplicate rows** (drop / keep / re-word).
- **(B)** Hero stays at its reading width; the rail runs full height from the hero's top.
  **Prototyped: kills the hole, uniform 16px gaps, no duplication surfaced, smaller DOM change** —
  but does **not** restructure the hero, so it does not satisfy spec 2's literal order.
→ **Recommendation: (A)**, because spec 2 is explicit and (B) leaves your central complaint
unanswered — but (A) is only honest if you rule on the duplicate rows.

**FORK 3 — "prime width" for the thinking column collides with D2.**
Spec 4 wants "In your thinking" to get prime position **and width**. Prototyped: 542→816 lifts its
share 28.5%→**42.8%**, but widest prose goes 70.8→**109.9ch** — a **D2 FAIL** (canon: "composition
never widens text to fill space"). A 66ch cap fixes D2 but leaves ~110px dead **inside** each
770px card. I tested a **2-up marginalia grid**: it yields **30.9ch** — well under the canon's
60-72ch band, so it is **rejected by measurement**.
→ So the extra width must be spent on something other than longer lines. **Recommendation:** cap
the prose (4 elements: `.bk-tcount`, `.bk-empty-note`, `.bk-atext`, `.bk-artifact-body` — the
artifact body is the one that stays at 109.9ch if you cap only the obvious three) and move each
marginalia card's **meta** (dot · location · "became" link) **beside** the text rather than under
it — the card then uses its width and keeps its measure. This is a design decision and belongs in
the mockup.

---

## 8 · What I recommend, and what happens next

1. Rule Fork 1 (§4-I), Fork 2 (hero A vs B + the duplicate rows), Fork 3 (where the width goes).
2. Then **Stage 0.5 mockup** `docs/studio/mockups/dwp-book-detail.html` — real content, tokens
   only, honest at 1440 + 1920 — for your felt pass. (Or waive with "skip the mockup".)
3. Then Stage 1 builds slice-by-slice (hero / grid / rail / hierarchy), full D1-D6 + `rig.hollow`
   per region per slice, every render path, the full mobile re-gate.

**Named this recon (all new):** DWP-RIG-README · DWP-STATUS-DUP · DWP-NO-H1 ·
DW-3 round-record correction (§3).
**Untouched by rule:** ON-7 @760-1199 · on-demand rows 3-6 · `.bk-star` 44×44 (MW-3) ·
R7 decisions F1-F6.

**Nothing is staged. Nothing is committed. Awaiting your call on the three forks.**
