# Portrait Stage 4 — the reading JOURNEY — checkpoint

**Lane:** `relaxed-lederberg-ac8a2a`, on top of Stage 3 `4301970`. Additive-only. Local commit (no push, no `sw.js` bump).
**Scope:** a narrated timeline of the reader's becoming, in Yumi's voice, from REAL timestamps. Read-only. Inserted after returns/threads, before the transparency + "Your data" cluster (which stays LAST).

## Slice table

| File | Δ | ins/del | Parse | Notes |
|---|---|---|---|---|
| js/views.js | +5,740 | **107 / 0** | **cscript PASS** (622,687 chars) | `_portraitJourneyMonth` + `_portraitJourneyData` + journey section |
| assets/components.css | +1,610 | **62 / 0** | n/a | 11 journey rules, `.account`-scoped |

Total **169 insertions / 0 deletions** — purely additive. No EOL flip.

## Banned-token gate (Affirmation B) — PASS
views.js = baseline: `.catch`=1, `=>`=1, backtick=3, `\bconst\b`=1, real `let`-decl=0. The `.forEach`=1 hit is a **Stage-2 comment** ("`.forEach` -> for"), not code, not in this diff. `new Date(ts)` is valid client JS (the workflow-sandbox ban does not apply to views.js; the codebase uses `Date.now()`/`new Date` throughout).

## CSS scoping / no hex — PASS
11 new rules all `.account .portrait-journey`/`.portrait-season`. The timeline-node `::before` ring uses `var(--ground)` (the dark page behind the translucent card) for the mockup's `--bg-mid`. No `#hex`.

## Real data — PASS
Milestones from real timestamps: earliest book `addedAt`, earliest/most-recent notebook entry `createdAt`, earliest userTheme `createdAt`, earliest sub-theory `createdAt` (field `header`). Per-user `userId===uid` filters on entries/themes/sub-theories. `_portraitJourneyMonth` formats each to "{Month} {Year}". No comp fixtures.

## Copy parity — PASS
Verbatim + typographic: "How your reading has moved"; help "No streaks, no finish line — just the shape of the change."; open-end "Where does it go next? That part isn’t written yet — it’s yours."

## NO streaks / rings / completion — PASS
The only "streak"/"finish line" string is the **negation** in the help line. No counters-as-goals, no rings, no % complete. Milestones are factual events narrated plainly; the timeline ends on an **open question**, not a summary.

## Reduced motion — n/a
The journey has no JS animation; the `::before` node is static. Nothing to gate.

## Intentional deviations (Stage 5 ledger)
- `data`: milestones are **factual derivations** narrated in Yumi's plain second-person voice (the mockup's interpretive narration — "an argument with him" — was illustrative). The open-end question is **generic** ("Where does it go next?"), not interpolated with a specific theme (the mockup's "the refusal" was illustrative).
- `token` (Option A; `::before` ring = `--ground`) · `copy-normalize` (typographic) · `reuse-live` (journey card = `.account-card`; eyebrow = `.account-values-eyebrow`).
- Empty state: a gentle "Your reading hasn’t left a trail yet…" season when there are no events; the open-end always renders.

## Verdict: PASS — committed locally. Needs Preston's live smoke (the milestone narration on a real account's timestamps + the no-streak framing reading right).
