# Portrait Stage 1 — VALUES (declared "stones") — checkpoint

**Lane:** `relaxed-lederberg-ac8a2a` @ main HEAD `72db19b`. Additive-only. Local commit (no push).
**Scope:** add `profile.values` (array of strings) across all write/read sites + migrate gate; port the mockup VALUES section (eyebrow + stones + helper) after the live hero. No consent gate, no Yumi write — declared by the reader.

## Slice table

| File | Δ bytes (pre-stated → actual) | ins/del | Parse | Notes |
|---|---|---|---|---|
| js/state.js | ~+1350 → **+1801** | 42 / 3 | **cscript PASS** (118873 chars) | 3 "del" = the 3 literals modified in-place (873/898/980, each `+ , values: []`) |
| js/integrations.js | ~+500 → **+707** | 10 / 1 | harness-EXEMPT (pre-existing `.catch`×20) | 1 "del" = comma added after talkMode line; FAIL is the `.catch` @452, NOT my edit (parser passed *through* my line-376 edit) |
| js/views.js | ~+2200 → **+4272** | 107 / 0 | **cscript PASS** (571761 chars) | purely additive; overshoot vs estimate = comment density + full handler set (collect/persist/makeStone/add) |
| assets/components.css | ~+1200 → **+2782** | 95 / 0 | n/a (CSS) | purely additive; overshoot = multi-line rule formatting |

Total: **254 insertions / 4 deletions** (the 4 "deletions" are in-place field-additions, no content removed). Small localized diff = **no EOL flip** (CLAUDE.md proof: diffstat, not the cosmetic autocrlf warning).

## Banned-token gate (Affirmation B) — PASS
Every count equals the Stage-0 baseline → **zero new** `const`/`let`/`=>`/backtick/`.catch`/`.finally`:
- views.js: `.catch`=1, `.finally`=0, `=>`=1, backtick=3, const=1, let=4 (all unchanged)
- state.js: `.catch`=0, `.finally`=0, `=>`=0, backtick=9, const=1, let=2 (all unchanged)
- integrations.js: `.catch`=20, others 0 (all unchanged)
My additions use only var/function, classic `for` loops, `instanceof`, `.trim()` (already used in-codebase @12555), string concat.

## Data round-trip (4-site discipline) — PASS by code-path
`values` carried at: ensureUser seed [state.js:873], reseed [898], additive guard [939], getProfile default [980], setProfile sanitizer [1036-1043], migrate `1.24.0→1.25.0` [2766-2778], saveProfileToFirestore `.set()` write [integrations.js:767], loadProfileFromFirestore symmetric read [376]. UI persist: `accountValuesPersist()` → `setProfile(uid,{values})` + `saveProfileToFirestore(uid, getProfile(uid))` [views.js:12532-12536], fired on add (commit) + remove. Seed-on-render from `profile.values` [views.js:12539-12543]. The Firestore-merge-bypasses-migrate gotcha is covered (write AND read both carry `values`). Runtime round-trip = Preston's Stage 6 live smoke.

## Copy parity (typographic-normalized per decision 4) — PASS
Verbatim, with typographic glyphs: `What you’re reading toward ` (’ U+2019) + `— in your own words` (hint), `＋ place a stone` (＋ U+FF0B), placeholder `what you care about…` (… U+2026), helper `You place these. Yumi never fills them in.`. Control: ASCII `What you're reading toward` correctly ABSENT.

## CSS parity (Option A var-remap) — PASS
Mockup VALUES rules ported, **scoped under `.account`** (anti-bleed; generic names `.stones/.stone/.rm/.stone-add/.stone-input` = 0 collisions but scoped anyway). Geometry/px **1:1**: stones gap 11px / pad 20px 22px; stone 18px serif italic, pad 9px 18px, radius-pill, transition transform .14s; rm 12px, opacity 0→.8; stone-add 13.5px dashed; stone-input 18px serif italic, width 200px; note pad 0 22px 18px, 12.5px italic serif; eyebrow margin-bottom 11px. Color remaps: gold-rgba gradient → `color-mix(var(--gold) 16%→5%)`; white-4% inset → `color-mix(var(--text-on-dark) 6%)`; `--line`→`--border`; `--ink-faint`→`--ink-4`; `--gold-deep`→`--gold`.

## Intentional deviations (for the Stage 5 ledger)
- `token`: colors → canonical Praxis Umber dark tokens (Option A, approved).
- `copy-normalize`: typographic apostrophes/quotes (decision 4, approved).
- `reuse-live`: VALUES card uses live `.account-card` (solid/`--radius-md`, canon §4-A) not the mockup's blur/17px `.card`; eyebrow reuses `.eyebrow` with gold + weight-500 restored to match the mockup's gold section eyebrows.
- `correctness`: commit-once guard on the stone input (the mockup has a latent double-add: Enter detaches the input → blur re-fires commit). ES3-dialect correctness adaptation; no design change.

## Residuals / deferred
- **`:focus-visible`** (mockup line 252, spec R4) NOT added — adding an app-global rule in a values-only stage risks bleed; deferred to a deliberate a11y pass. Stone-input keeps a visible gold border meanwhile.
- Hero **stance line** + "reading since {date}" eyebrow are a hero ADAPT, out of Stage 1 scope (spec open item #3).
- `sw.js` CACHE_VERSION bump deferred to Stage 6 (single push), per the build prompt.

## Verdict: PASS — awaiting Preston. Runtime/visual confirmation is the Stage 6 live smoke.
