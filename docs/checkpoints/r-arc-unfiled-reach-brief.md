# UNFILED-REACH — DESIGN BRIEF (no build; for Preston's confirm)

**Ruling #6 (handoff #1). NO BUILD this wave — build lands in Wave C, alongside FF-12 (same rail).**
Evidence: `r-arc-ff-routing.md` FF-4 / FF-6. This brief states the problem, a recommended direction aligned
to the **D9/D10 quiet-marker idiom**, and the decision points for your confirm.

## RULINGS (Preston, 2026-07-17) — CONFIRMED for the Wave C build (alongside FF-12)

- **F1 = GLOBAL unfiled group.** The rail carries a global "Unfiled" browse group (all the reader's
  `bookIds:[]` captures); FF-12's own-evidence panel covers this-sub-theory scoping. The two are complementary.
- **F2 = "· N BOOKS · N UNFILED"** as proposed — the quiet match-state tail, shown when unfiled `> 0`.
- **F3 = NO — weaving never files.** Filing a note to a book stays an explicit, separate act; weaving only
  attaches evidence (the two axes stay independent).
- **F4 = NO new Inbox sibling.** One Door law — the Notebook note-card overflow "Send to sub-theory" already
  routes Inbox captures; no parallel affordance.
- **Brief CONFIRMED** for the **Wave C build, alongside FF-12** (same rail).

---

## 1. THE PROBLEM (FF-6, confirmed with mechanism)

`bookIds: []` is a **first-class, routine** capture state — `captureNote(...'inbox'...)` (`views.js:3216`)
writes `filed=false, bookIds=[]` for the default writeline register, and unmatched imports (`commitEntries`)
land the same way. But **every book-keyed theorizing surface silently drops it** rather than surfacing it as
"unfiled." Three surfaces, one root:

| Surface | Mechanism (code) | Symptom |
|---|---|---|
| **The workshop rail** ("Pull from your reading") | `marginaliaFor(bookId)` (`views.js:11484`) loops `state.books` and keeps a note only if `en.bookIds.indexOf(bookId) !== -1` (`marginaliaForBook`, `:8693`). The rail is built from books, **never** from `subTheory.evidence`. | A bookless capture can **never** appear in the rail, for any book — even when it is already THIS sub-theory's own gathered evidence. |
| **The pull (search/filter)** | `filterPull()` (`views.js:11643`) substring-matches the **rendered** `.stb-passage` nodes — it works correctly, but the pool it searches is the book-keyed rail. | "No marginalia matches" is **literally true of what's rendered, false about what exists** (FF-4). |
| **The Page book-count** | `stBookN` (`views.js:10960–10983`) loops each evidence entry's `bookIds`; with `bookIds:[]` the loop runs zero times. | "STARTED FROM 3 MARKED PASSAGES · **0 BOOKS**" — a real sub-theory reads as sourced from nothing. |

**Root:** the app has two axes — a note's **filing** (which book, if any) and its **content**. Every
theorizing surface reads the filing axis as if absence-of-book == absence-of-note. Capture-first thinking is
therefore unreachable from the surfaces where you theorize.

---

## 2. THE DESIGN PRINCIPLE — match-state language (per D9/D10)

D9 (a quiet "private" marker on draft sub-theories) and D10 (former-Intellectual prose folded under a light
divider — a state rendered quietly, never a loud UI mode) establish the house idiom: **a state the reader
should know about is surfaced as a quiet marker, never as a silent drop or a loud mode.** UNFILED-REACH
applies the same idiom to the filing axis: **an unfiled note is surfaced WITH a quiet "unfiled" state
marker — reachable and honest — never dropped.** "Unfiled" is a first-class, nameable state, not an error.

---

## 3. RECOMMENDED DIRECTION, per surface

- **A · The rail gains an "Unfiled" group.** The "Pull from your reading" pool, today grouped by book, gains
  one more group — **Unfiled** — collecting the reader's `bookIds:[]` captures so they are browsable,
  searchable, and weavable exactly like book-filed marginalia, under a quiet "unfiled" header (the D9 marker
  idiom). This is the reach fix: nothing that exists is unreachable.
- **B · The pull needs NO change.** Once the pool includes the unfiled group, `filterPull()` matches those
  passages automatically — FF-4's "No matches" dissolves on its own. **This is a pool fix, not a search fix**
  (do not touch `filterPull`).
- **C · The Page count speaks the unfiled state.** The meta line surfaces the unfiled portion rather than
  undercounting: e.g. **"STARTED FROM 3 MARKED PASSAGES · 2 BOOKS · 1 UNFILED"** (quiet match-state tail),
  so a sub-theory built from bookless captures never reads as "· 0 BOOKS."

---

## 4. DECISION POINTS (your confirm — I recommend, you rule)

- **F1 — the unfiled group's SCOPE in the rail.** (a) **ALL of the reader's unfiled captures** (a global
  "Unfiled" browse group, symmetric with the per-book groups) — the true reach fix (weave anything unfiled).
  (b) Only **this sub-theory's own unfiled evidence** — narrower; overlaps FF-12 (which brings *this sub's
  gathered evidence* beside the canvas). **Recommend (a) for the rail** (reach) **+ (b) via FF-12's own-
  evidence panel** — complementary, same rail, coordinated in Wave C. Your call on whether the rail carries a
  global unfiled group or only the scoped one.
- **F2 — the count's wording + threshold.** Recommend the quiet tail **"· K UNFILED"** appended only when
  `K > 0` (honest, match-state, ~1 line). Alternatives: fold unfiled into a single "N SOURCES" figure, or a
  separate quiet chip. Your call on the exact words (this also feeds FF-7's vocabulary ruling).
- **F3 — does weaving an unfiled note file it?** When a bookless capture is woven as evidence, does it stay
  unfiled or gain a filing? **Recommend it stays unfiled** — weaving attaches evidence; filing to a book is a
  separate deliberate act (keeps the two axes independent, matches today's non-mutating `addEvidence`). Flag
  for confirm.
- **F4 — reach from the Notebook too?** FF-6's root also strands unfiled captures at capture time (Inbox).
  This brief scopes to the **theorizing** surfaces (rail/pull/count) per the ruling; whether the Notebook
  Inbox gains a parallel "route an unfiled note to a sub-theory" affordance is a **possible sibling item** —
  named, not folded in here unless you want it.

---

## 5. SCOPE + SEQUENCING

- **Wave C build, alongside FF-12** (same rail — the two must be designed together: FF-12 adds *this sub's
  evidence* beside the canvas; UNFILED-REACH adds the *global unfiled pool* to the browse rail). Building
  either without the other risks a second rail rework.
- **No data-model change** — `bookIds:[]` is already first-class; the fix is display + count aggregation
  (read-side), consistent with the S5 "display-only aggregation is allowed" guardrail.
- **No new fork for the covenant** — nothing here writes or deletes; it surfaces existing state.

**Deliverable status:** design brief complete; **F1–F4 RULED (Preston, 2026-07-17, see top) — CONFIRMED for
the Wave C build alongside FF-12.** No build this wave (Wave C = Fable 5, post-Saturday-reset per MODEL LAW).
