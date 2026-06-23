# Portrait Stage 3 — categorize-as-dialogue + raw returns + interpreted threads — checkpoint

**Lane:** `relaxed-lederberg-ac8a2a`, on top of Stage 2 `9315374`. Additive-only. Local commit (no push, no `sw.js` bump).
**Scope:** three pieces in the REVEALED-SELF section — a categorize-as-DIALOGUE (between toggle and field), raw RETURNS + consent-gated THREADS (after the galaxy).

## Slice table

| File | Δ bytes | ins/del | Parse | Notes |
|---|---|---|---|---|
| js/views.js | +18,791 | **363 / 0** | **cscript PASS** (616,947 chars) | dialogue + returns + threads helpers/renderers + toggle wiring + 2 critic fixes |
| assets/components.css | +6,362 | **261 / 0** | n/a | 47 portrait rules, all `.account`-scoped |

Total **624 insertions / 0 deletions** — purely additive (the `portraitSetAxis` edit added 2 lines, removed none). No EOL flip.

## Banned-token gate (Affirmation B) — PASS
views.js = S2 baseline: `.catch`=1 (a pre-existing **comment**; my async uses two-arg `.then(ok,err)`), `.finally`=0, `=>`=1, backtick=3, `\bconst\b`=1, **real `let`-declarations=0** (the word-boundary `\blet\b`=5 is English "let" in copy/comments — "or let it go" — `let <ident> =` pattern = 0). `try/catch` is an ES3 **statement**, not the banned promise `.catch` method.

## CSS scoping (anti-bleed) — PASS / no hex
All 47 new rules `.account .portrait-*`. Reused leaf classes (`.body/.pre/.s/.ph/.ct/.sig/.yes/.no/.show/.confirmed/.on`) always under a `portrait-` ancestor. No `#hex` (var()/color-mix/tokens). Threads card border = `color-mix(--journal-color 28%)`; toggle = `--journal-color`.

## Real data (no fixtures) — PASS
`_portraitCategoryProposals` (top traditions, `state.userBooks`), `_portraitReturnsData` (`state.notebookEntries`, `userId===uid`), dialogue lenses (`state.userThemes`, `userId===uid`), threads (`getReaderModel`). No comp fixtures.

## Persistence (the write model — RESOLVED, not ambiguous) — PASS by code-path
- **Confirm/rename → `userThemes`** (the EXISTING path, same as the Shelf lens-gen adopt): `createUserTheme(name)` + `assignBookToTheme(theme.id, bid)` → Firestore on the `markThemesDirty` chokepoint. NO new field, NO migrate.
- **Categories reject → ls** `praxis_portrait_dismissed` (`_portraitDismissAdd`→`sv`) so it isn't re-proposed (also added on confirm). Local nag-suppression, NOT core data (matches `praxis_lens_ai_suggestions`/`praxis_yumi_noticed` precedent).
- **Lenses proposals → on-demand `YumiBrain.generateLenses`** (two-arg `.then` + `try/catch` guard) → `evalLensResponse`; reject = transient splice.
- **Threads consent → real `yumiReaderModel`** via `setProfile({yumiReaderModel})` + `saveProfileToFirestore` (existing path; same flag the reader-model section controls).

## Security (self-audited — reviewer 2 was invalid, see below) — PASS
`_portraitEsc` wraps EVERY user-controlled value into innerHTML: theme names (confirmed offers), proposal names (open offers + proposed pill), returns titles + author, thread labels. Tradition labels are fixed/safe (escaped anyway). Numeric counts safe.

## Copy parity — PASS
Verbatim + typographic: "How your library sorts" / "— you hold the names"; both hold lines; "Yumi would file these under" / "Yumi would make a lens called"; "that’s it" / "rename ✎" / "not really" / "not a lens"; "What your margins keep returning to"; "Just the count — drawn straight from your notes. What it adds up to is yours to say."; threads ti/blurb (`she’ll`/`what’s`/`doesn’t`) / "Let Yumi notice" / "Yumi is noticing". ASCII control absent.

## Adversarial critic — clean after 2 fixes
- **Reviewer 1 (logic/persistence/ES3):** 2 defects, BOTH FIXED additively — (bug) `startPortraitLensSuggest` now wraps `gatherLensMetadata`/payload-build in `try/catch` so a synchronous throw sets `error` instead of stuck-`loading` + guards `meta.books`; (minor) `portraitRejectOffer` lens splice now bounds-checked. Re-verified: parse PASS, gate clean.
- **Reviewer 2 (security/parity): INVALID — dismissed.** It reported "Stage-3 code does not exist" and cited HEAD `72db19b` (the pre-Stage-1 commit), i.e. it audited the wrong tree. Tree integrity re-verified (HEAD `9315374`, all 4 functions present, numstat intact). Its dimensions were covered by my own copy-parity greps + escaping self-audit.

## Reviewable calls (for Preston's smoke) + intentional deviations
- **Proposer = MINIMAL** (Claude's call): categories = top-3 traditions (≥2 books) derivationally; lenses = **on-demand** `generateLenses` (button, NOT auto-on-toggle — avoids an LLM call on every render). Preston can switch to "split"/auto at the smoke.
- **Unified userThemes model:** a confirmed grouping on EITHER axis becomes a **lens** (per the build spec). Consequence: the mockup's categories-confirmed label "You call these:" is not rendered — confirmed groupings show as "Your lens:" under the lenses axis. Intentional.
- **Threads = read-only display** in the portrait (no per-thread keep/dismiss minis); thread management stays in the existing reader-model section. **Dual consent control:** the portrait threads toggle AND the existing reader-model section both flip `yumiReaderModel` (same persisted flag; live-sync only on reload).
- **Returns = structured recurrence** (densest-margins book + author returned-to); phrase/question recurrence (needs NLP) deferred.
- `token` (Option A) · `copy-normalize` (typographic) · `reuse-live` (offers/returns/threads cards = `.account-card`; eyebrows = `.account-values-eyebrow`).
- **Reduced motion:** threads reveal `.portrait-named` settles instant (scoped `@media`).

## Verdict: PASS — committed locally. Needs Preston's live smoke (dialogue confirm/rename/reject round-trip; lens-suggest async states; threads consent flip).
