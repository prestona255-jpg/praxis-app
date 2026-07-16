# R-ARC — Slice 3B deployed felt-pass: verification + routing report

**For Preston's ruling. BUILD NOTHING until he routes. Base `02b517e` / v3.215.**
Basin core (3B narrow scope) = **PASS** (Preston, live). Everything here is surrounding surfaces.
Evidence gathered by 3 read-only recon passes; every claim carries a cited function.

---

## PART 1 — VERIFIED (FF-4 / FF-6 / FF-9 / FF-12)

### FF-4 — "Pull from your reading" returns "No marginalia matches" for "enclosed"
**VERDICT: NOT a search defect. Symptom of FF-6.** `filterPull()` (views.js) correctly substring-matches
passage BODY text case-insensitively — verified. But the rail pool is built by looping `state.books` and
calling `marginaliaFor(bookId)`, which keeps an entry only if `en.bookIds.indexOf(bookId) !== -1`. The 3
"enclosed" marginalia are **unfiled** (`bookIds: []`), so they're never rendered as `.stb-passage` nodes —
there is nothing for the filter to match. "No matches" is literally true of what's rendered, misleading
about what exists. **Do NOT fix the search; fix the pool (FF-6).**

### FF-6 — the systemic hypothesis: pull indexes only book-filed marginalia
**VERDICT: CONFIRMED, both halves, with mechanism.**
- **The rail is book-keyed.** `marginaliaFor(bookId)` requires a book link. `bookIds: []` is a **normal,
  common state** — `captureNote(...'inbox'...)` sets `filed=false, bookIds=[]` (the default writeline
  register is marginalia), and `commitEntries` lands unmatched imports the same way. Such a note can
  **never** appear in the rail, for any book. And `notebookCreateSubTheory` adds gathered notes to
  `evidence[]` with **no book check** — so a sub-theory's own evidence routinely contains notes the
  workshop rail can never surface.
- **The Page's "N BOOKS" undercounts identically.** `renderSubTheoryPage` computes `stBookN` by looping
  each entry's `bookIds`; with `bookIds: []` the loop runs zero times. A sub-theory built from bookless
  captures renders **"STARTED FROM 3 MARKED PASSAGES · 0 BOOKS"** — exactly Preston's "0 books".
- **Root:** `bookIds: []` is first-class and routinely produced, but every book-keyed surface silently
  **drops** it rather than surfacing it as "unfiled." → **Capture-first notes are unreachable from the
  theorizing surfaces. A systemic gap — NAMED item, no ad-hoc patch** (per Preston's FF-6 instruction).

### FF-12 — do gathered passages render beside the prose canvas in the Workshop?
**VERDICT: CONFIRMED — no.** `renderSubTheoryBuild` has exactly ONE rail ("Pull from your reading") = an
unscoped browse of ALL book-filed marginalia, built from `state.books`, **not** from `subTheory.evidence`.
It never renders THIS sub-theory's gathered evidence as a list. The only origin material shown is
`_stOriginPhrase` — **the first gathered note only, truncated, and only while unnamed** (it vanishes at the
first title blur). So while composing, the writer weaves **from memory** — the mockup's dead-middle
problem, confirmed. → Wave C / the FF-3 workshop mandate.

### FF-9 — three visual defects
- **(a) placeholder clipped ("sub-thec"):** `.stb-title-input` has **no `text-overflow:ellipsis`** (grep:
  4 hits total, none this class), a 28-char weight-600 serif placeholder, ancestor `.stb-sheet`
  `overflow:hidden`. Root confirmed at code level; the exact "sub-thec" slice needs a live render.
  **Fix:** `overflow:hidden;text-overflow:ellipsis` on the class and/or shorten the copy. **~40–50 B CSS.**
- **(b) mid-word truncation:** all 4 `_stOriginPhrase` consumers use raw `.substring(0,N)+'…'` (char-count).
  **Fix:** one ES3 word-boundary helper (`lastIndexOf(' ')` before the cap) + 4 call swaps. **~500–600 B,
  near-zero net.**
- **(c) Page passage double-render:** CONFIRMED, isolated to `renderSubTheoryReadOnly`. `citeLine()` falls
  back to `en.body` (truncated) as the **label**, and `.quote` renders the **full** body — same text
  twice per `<li>`. `captureNote` never sets `.title`, so it fires for nearly every captured note.
  **Fix:** suppress the cite-line for entry-kind evidence when `citeTitle(el)` is empty. **~10–15 lines,
  one loop, no schema/CSS.**

### FF-5 — origin phrase renders TITLE-STYLED (undermines the mint)
**VERDICT: 2 of 4 sites violate.** Newborn card (`.nb-newborn-title`, serif 22px/600) and the Read Page
(`.subtheory-readonly-header`, an `<h2>` at serif 30px) show the basin's origin phrase in **title
treatment** — an unnamed basin reads as NAMED. The **workshop already does it right** (`.stb-origin-phrase`
= italic 13px muted, a separate sibling below the empty title input). **Fix:** mirror the workshop pattern
onto the 2 violators (phrase in its own quoted/italic/secondary element; the title slot stays neutral/empty
for a basin). **Small rider: ~20–30 JS lines + ~10–15 CSS lines** (3R-scale).

---

## PART 2 — THE FF-7 VOCABULARY TABLE (current mess — for your canonical ruling)

### Lifecycle-state phrases (one object, many words)
| State | Current string(s) | Surface / source |
|---|---|---|
| Just-minted (session) | **"born just now · draft"** | Notebook newborn card eyebrow (`buildNotebookNewbornCard`) |
| Just-minted (reload) | **"draft"** | same, restored |
| Draft on the Page | **"A SUB-THEORY · STILL FORMING"** | Page topbar kicker (`renderSubTheoryPage`) |
| Published on the Page | **"A SUB-THEORY · FINISHED"** | same |
| Unnamed basin | **"Unnamed basin"** (origin-phrase fallback) | newborn card + Page read-only title |
| Legacy blank header | **"Untitled sub-theory"** | **22 call sites** (dialogs, lists, spotlight, portrait…) |
| Maturity (Page + #search) | **nascent / developing / established** (.34/.67) | `renderSubTheoryPage`, `_searchSubMaturityWord` |
| Maturity (Arc Read face) ⚠ | **forming / warming / mature / bright** (.2/.4/.7) | `_arcFieldReadFace` via `_matWordFromScore` — **same score, DIFFERENT ramp than Page/#search** |
| Naming invite (adjacent) | "This gathering keeps circling something — what would you call it?" | Workshop (§4b verbatim) |

### Door labels
| Label | Surface | Routes to |
|---|---|---|
| **"Continue in the workshop →"** | Notebook newborn card | `#subtheory/<id>/build` |
| **"Edit in the workshop →"** | Page topbar ("the SOLE way in") | `#subtheory/<id>/build` |
| **"Open the page →"** | Workshop action row | `#subtheory/<id>` |
| **"Open the page →"** ⚠ | Arc-detail Page-face stub | `#subtheory/<id>/**build**` — **SAME words, OPPOSITE direction** |

### Yumi corner tag
Both Page + Workshop use the identical lead-in **"From how you read: "** but with different chrome (Page:
"YUMI" eyebrow + up to 2 dismissible notes; Workshop: no eyebrow, one note, summary overwrites the prompt).
*(These are the F4 blocks — see Part 3.)*

**Two collisions the ask didn't name but belong in the ruling:** (1) the Arc-Read-face maturity ramp
disagrees with Page/#search on the same number; (2) "Open the page →" means two opposite directions.

**Deliver to me:** ONE canonical phrase per lifecycle state + ONE door-label convention. *(I enumerated;
I did not pick the words — yours to rule.)*

---

## PART 3 — F4 VEHICLE (the "From how you read" blocks)

**Sites (exhaustive, 2):** Page (`renderSubTheoryPage`, inside `aside.st-yumi`) + Workshop
(`renderSubTheoryBuild`, inside `div.stb-ymargin`). D16 already rules them **superseded, wholesale
removed** (the reason is strong: `profile.summary` is generated **ungated** by `gradeUtterance`).

**Cost (measured):**
- Wholesale (per D16): **≈ −4.75 KB views.js, −2.7 KB components.css.**
- ⚠ **Non-optional layout follow-on:** the Page's `aside` sits in a `.st-grid` with a **fixed 240px right
  track** (`grid-template-columns: minmax(0,1fr) 240px`). Naive `<aside>` deletion leaves a **persistent
  blank 240px gutter** — the same slice MUST edit `.st-grid` (blast radius contained: `.st-grid`/`.st-center`
  are used once, this function only). The Workshop panel has no gutter risk (flow child).
- **One scope judgment for you:** D16 says "blocks removed." The Page block also holds **evidence-grounded**
  sibling notes ("you marked this same nerve in *Title*") — do those go too (the whole `aside`), or only
  the reader-model line? §9b's framing ("unbidden monologue, summarizes the reader") plausibly means the
  whole panel, but D16 names no exception for the evidence notes. **Your call.**

**Vehicle rec: its OWN small slice (3R-style, DELEGABLE/sonnet) — NOT a rider on Slice 4.** Slice 4 is an
OPUS 3-surface minting restructure; bundling an unrelated Yumi-grammar deletion violates the no-bundle rule
and muddies Slice 4's gates. F4 matches 3R's profile exactly (small, no schema/auth/persistence, grep-
checkable).

---

## PART 4 — FF-10 (Finish on an unnamed basin) — DESIGN CONFIRM

**Code fact:** the Finish/Finished pill (`renderSubTheoryBuild`) flips `status:'published'` on
`pubDone()` alone — **zero `_stIsBasin`/`header===''` gate**. A signed-in author can Finish an unnamed
basin today; reachable end state = a **"FINISHED" sub-theory titled "Unnamed basin."**
**Law:** §4b describes the Finish *choreography* (privacy sweep → threshold question) and the *earning bar*
(grounded + made + answering) but is **silent** on whether Finish is gated pre-naming. D13 frames naming as
the mint that makes a mote a sub-theory at all — so "Finish before minting-by-name" is a genuine gap in the
written law. **Both facts reported; no gate proposed. You rule whether Finish stays dormant pre-mint.**

---

## PART 5 — ROUTING RECOMMENDATIONS (per item, with cost)

| FF | What | My routing rec | Rough cost |
|---|---|---|---|
| **FF-4** | pull "no match" | **Do not fix** — it's FF-6's symptom (fixing the search wastes effort on the wrong layer) | — |
| **FF-6** | bookless captures unreachable from theorizing surfaces (+ Page "0 books") | **NAMED systemic follow-on** (per your instruction) — needs design: how unfiled captures reach the rail + the book-count. Broaden `r-arc-s3b.md` residual #4 (which only names the register axis, not this bookless axis) | design + build — own item |
| **FF-12** | no gathered evidence beside the canvas (weave from memory) | **Wave C** — part of the workshop rebuild (FF-3) | Wave C |
| **FF-3** | workshop feels off | **Wave C felt mandate** (recorded, no scope change now) | Wave C |
| **FF-5** | origin phrase title-styled | **Small rider** (could bundle with FF-9) | ~20–30 JS + 10–15 CSS |
| **FF-9a** | placeholder clip | **Small rider** | ~40–50 B CSS |
| **FF-9b** | mid-word truncation | **Small rider** | ~500–600 B |
| **FF-9c** | Page passage double-render | **Small rider** | ~10–15 lines |
| **F4** | superseded Yumi blocks | **Own small slice (3R-style)** + the `.st-grid` follow-on; scope judgment (whole aside vs reader-model line) is yours | ≈ −4.75 KB views, −2.7 KB css |
| **FF-7** | vocabulary mess | **Your ruling** (canonical table) → then a small rider applies it | ruling now; rider later |
| **FF-10** | Finish pre-mint | **Your design confirm** (gate or not) | confirm now |
| **FF-1** | loop legibility | **GAP** — not covered by Slice 4 / Wave C / Slice 12. Needs a home (Wave C or a new named item) | flag |
| **FF-2** | Page/Workshop door | read/make split is **intentional** (R6); a whole-page "Edit in the workshop" door exists. A finer per-citation route is **not named** anywhere — Wave C or Slice 4 if you want it | flag |
| **FF-8** | 6 equal-weight note actions | ⚠ **GAP** — §9b Finding #3 verbatim, **never carried into any slice**. Slice 4's "One Door" is textually only the 3 *creation* paths, NOT the per-entry action row. **Expand Slice 4 to include it, or make it its own item** — your call | Slice 4 expansion or own item |
| **FF-11** | Notebook desktop void (newborn card) | **GAP** — Slice 12 names only the **Workshop** void by name; the Notebook void (§9b #7) is a distinct instance unclaimed by any slice. Add to Slice 12 scope or its own | flag |

### Natural bundling (my suggestion, your call)
- **"3B-POLISH" small rider** = FF-5 + FF-9a + FF-9b + FF-9c (all basin/sub-theory **display** fixes on
  surfaces 3B touched; one coherent commit, 3R-scale, DELEGABLE). ~1–1.5 KB total.
- **F4** = its own slice (bigger, layout risk, Yumi-grammar concern).
- **FF-6** = named systemic follow-on (design-first).
- **FF-7 / FF-10** = your rulings now (no build).
- **FF-8 / FF-11 / FF-1 / FF-2** = plan-coverage gaps → route into Slice 4 (expand) or Wave C or new items.

### Two low-severity extras the recons surfaced (for the same rulings)
- Arc-Read-face maturity ramp disagrees with Page/#search (folds into FF-7).
- `docs/checkpoints/r-arc-s3b.md:3` still says "NOT committed. NOT pushed" though it shipped in `02b517e`
  — a stale status line; I'll correct it in the next commit.
