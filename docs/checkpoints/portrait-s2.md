# Portrait Stage 2 — Revealed Self (shared toggle + FIELD + GALAXY) — checkpoint

**Lane:** `relaxed-lederberg-ac8a2a`, on top of Stage 1 `d6b77a2`. Additive-only. Local commit (no push, no `sw.js` bump).
**Scope:** insert the REVEALED-SELF section after the stat cards — one shared `[Book categories ⇄ Your lenses]` toggle drives the FIELD (poles + tension *questions*) and the GALAXY (gravity-clustered two-channel star-map). All figures read live state.

## Slice table

| File | Δ bytes (pre-stated → actual) | ins/del | Parse | Notes |
|---|---|---|---|---|
| js/views.js | ~+14KB → **+26,395** | **539 / 0** | **cscript PASS** (598,156 chars) | helper block (`_portraitAxisData`/`_portraitGalaxyLayout`/`_portraitRenderGalaxy`/`_portraitRenderField`/`_portraitFieldTensions`/`_portraitEsc`) + REVEALED-SELF section + toggle. Purely additive |
| assets/components.css | ~+3KB → **+6,723** | **265 / 0** | n/a | 37 portrait rules, all `.account`-scoped |

Total **804 insertions / 0 deletions** — purely additive, no behavior removed (Affirmation A), no EOL flip (localized additive diff). Overshoot vs estimate = field-tension detection + section-markup verbosity (all intended additive code, 0 surprise logic).

## Banned-token gate (Affirmation B) — PASS
views.js word-boundary counts = Stage-1 baseline exactly: `.catch`=1, `.finally`=0, `=>`=1, backtick=3, `\bconst\b`=1, `\blet\b`=4. **Zero new.** New code is var/function, classic `for` loops, IIFE closures, string concat, native `.indexOf`/`.sort`/`.slice` (in-codebase ES5 methods), regex literals. No `.forEach`/`.map`/arrow/template-literal.

## CSS scoping (anti-bleed) — PASS
All 37 new rules prefixed `.account .portrait-*` / `.account .account-revealed` / `.account .account-portrait-sec`. The mockup's generic `.field`(2)/`.bloom`(17)/`.seg`(23) collide globally → every portrait element is `portrait-`-prefixed. The `@media (prefers-reduced-motion)` wraps a `.account .portrait-star` selector (scoped). No global selector added; no `#hex` literals (colors via var()/color-mix/`--scrim`/`--sunk-d`).

## Data round-trip (real state, no fixtures) — PASS by code-path
`_portraitAxisData(uid, axis)`:
- **books/grouping:** categories → `state.books[bid].traditionOverride || .tradition` (skip unassigned/empty); lenses → `state.userThemes` (`userId===uid`, `.bookIds`).
- **notes/density:** `state.notebookEntries` (`userId===uid`), grouped via each entry's `bookIds` → grouping set; density = notes/books.
- **bonds:** a notebook entry whose `bookIds` span ≥2 groupings adds +1 per pair (the bridging-notes signal; **NOT** `readerModel.threads`).
- **recent:** max entry `createdAt` per grouping (RISING tension).
No comp fixtures left (`AX`/`GAL`/`cols:['Nonfiction'`/`books:[41,22` all ABSENT). Per-user `userId===uid` filters present (multi-account safe). Runtime = Preston's Stage 6 live smoke.

## Fidelity — galaxy/field 1:1 (modulo Option-A tokens)
- **Force-sim** `_portraitGalaxyLayout` ported 1:1: VW720/VH340/pad14, **440 iters**, sep+40/push·0.5, rep 2600/d², spring rest+46/f·0.006·w, centre·0.012.
- **Two channels:** size `rad=16+t·30` (#books); brightness curves `hi 0.28+br·0.5`, `glow 10+br·30`, `galpha 0.22+br·0.42`, `op 0.82+br·0.18` (density). 34 specks, double-rAF settle, hover lite/clear/partnerOf, readout template — all match.
- **Field:** poles + blooms + dashed tension lines; tensions GAP/THIN/RISING framed as QUESTIONS from real signals (lowest-bond pair / densest-vs-thinnest / most-recent note).
- **Copy:** toggle labels, eyebrows, field-help, galaxy help/readout, tension templates verbatim + **typographic** (`’ —`); ASCII control absent.

## DECOUPLE honored — PASS
Portrait marks encode **size + brightness + position only** — never a per-category silhouette. No `silhouette`/`_tfaGeometry`/`renderTraditionFormArc` in portrait code; shape is decoupled from taxonomy (per the locked Stage-0 fork → DECOUPLE).

## Reduced motion — PASS
JS: `reduceMotion` branch places stars at final positions instantly (no scale-in). CSS: scoped `@media (prefers-reduced-motion:reduce){ .account .portrait-star{transition:none} }`.

## Adversarial critic (2 reviewers) — clean after 1 fix
- **Logic/edge-cases/ES3 reviewer: clean, 0 defects** (sparse-data guards `||1` cover 0/1-grouping + 0-note + all-equal; bonds valid; force-sim terminates; XSS-escape via `_portraitEsc` on every theme-name interpolation confirmed).
- **Fidelity reviewer:** 4 flags → #1 (gradient highlight color-mix) + #2 (star dark stop `--sunk-d`) are the **approved Option-A token deviations** (kept); **#3 precision** `Math.round`→`toFixed(2)` **APPLIED** (fractional color-mix %, strictly more faithful); **#4 false positive** (readout already uses curly `’` — verified curly=3 / ASCII=0).

## Intentional deviations (Stage 5 ledger)
- `token`: galaxy/field colors → Umber dark tokens (Option A) — star cream highlight = `color-mix(--text-on-dark)`, dark stop = `--sunk-d`, hues = `[--gold,--teal,--danger,--journal-color,--subtheory-15,--subtheory-9]`, galaxy deep-space bg = `--surface-d/--sunk-d/--scrim` mix.
- `data`: field tension SUB-lines are fixed instrument questions (mockup's per-axis bespoke subs were illustrative); positions are deterministic (the field is impressionistic — not a force-sim).
- `anti-bleed`: all classes `portrait-`-prefixed + `.account`-scoped (mockup's `.field/.seg/.bloom` collide).
- `reuse-live`: field/galaxy cards use `.account-card`; eyebrows reuse the Stage-1 `.account-values-eyebrow`.

## Residuals / deferred (NOT Stage 2)
Categorize-as-dialogue, raw returns, interpreted threads (consent-gated), journey, emblem — later stages. `:focus-visible` still deferred (tlabel/star keep `tabindex`/`role` + focus/blur handlers for keyboard). No `sw.js` bump, no push.

## Verdict: PASS — **needs Preston's live visual smoke.** The galaxy is the one thing that must be *seen* (gravity settling, hover bridges, brightness) — no local browser here.
