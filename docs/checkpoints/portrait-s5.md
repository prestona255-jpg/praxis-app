# Portrait Stage 5 — the EMBLEM capstone — checkpoint

**Lane:** `relaxed-lederberg-ac8a2a`, on top of Stage 4 `ffd74a9`. Additive-only. Local commit (no push, no `sw.js` bump).
**Scope:** a generative emblem the reader is ASKED about (not told), composed from real signals; capstone placement (before the transparency + "Your data" cluster, which stays LAST). Read-only.

## Slice table

| File | Δ | ins/del | Parse | Notes |
|---|---|---|---|---|
| js/views.js | +9,768 | **181 / 0** | **cscript PASS** (633,924 chars) | `_portraitEmblem` + `_portraitMadeRow` + capstone section + chip/show-made/ack interactions |
| assets/components.css | +4,054 | **169 / 0** | n/a | 33 capstone rules `.account`-scoped + 1 namespaced `@keyframes` |

Total **350 insertions / 0 deletions** — purely additive. No EOL flip.

## Banned-token gate (Affirmation B) — PASS
views.js = baseline: `.catch`=1, `=>`=1, backtick=3, `\bconst\b`=1, real `let`-decl=0, no `.forEach`/`.map` in code. var/function, for-loops, Math, `.toFixed`/`.slice`/`.join`, string concat.

## CSS scoping / no hex — PASS
33 rules all `.account .portrait-*`/`.pe-*` (under `.portrait-emblem`). **One `@keyframes portrait-breathe`** is global by CSS-language necessity (at-rules can't be scoped) but **namespaced** (no collision); the `animation:` that applies it is `.account`-scoped. No `#hex` (hues → `--danger`/`--gold`/`--teal`/`--ink`; swatches → tokens; chip/btn fills → color-mix).

## Real data — PASS
Emblem composed from live signals: VALUES = `profile.values` → core gems; LENSES = `userThemes` (`userId===uid`) count → rings; CATEGORIES = tradition book counts → outer arcs (opacity by rank); MARGINALIA = entries `register==='marginalia'` (`userId===uid`) → filament nodes. Counts drive geometry; the mockup's exact angle/radius SLOTS are reused. No comp fixtures.

## Copy parity — PASS
Verbatim + typographic: "And so —"; "Tap a strand to see what it’s made of."; "Does this look like you?"; ask-sub ("It isn’t a verdict. It’s a question."); "yes, that’s me" / "not quite" / "show me what it’s made of" (↔ "hide what it’s made of"); ack "Then it’s yours. It’ll keep changing as you do." / "Good — that gap is the interesting part. Keep reading against it."; the 4 EXPL strings + 4 made-rows (part + from). Counts templatized `{n}` (the mockup's "four"/"47" were illustrative).

## DECOUPLE / framing — PASS
The emblem is a **composed capstone mark** from 4 signal LAYERS (values/lenses/categories/marginalia) — not a per-book silhouette keyed to category. The framing is the QUESTION ("does this look like you?"), never a verdict; "what it’s made of" makes every strand traceable to a real signal (earned + legible).

## Read-only — PASS
The ack only sets text (`ackEl.textContent`); v6 specifies no persisted response. No `setProfile`/`createUserTheme`/save in the capstone.

## Reduced motion — PASS
JS: `breathe` class omitted when `prefers-reduced-motion`. CSS (scoped): `@media` removes the `breathe` animation + the `pe-grp`/`made` transitions → the emblem holds still.

## Adversarial critic — CLEAN (0 defects, both reviewers)
- **Reviewer 1 (logic/edge-cases/ES3/security): clean** — SVG math valid; data-driven counts never index out of SLOT arrays / never divide by zero (`nGems>0?nGems:1`); sparse-data (0 of each signal) renders a valid mostly-empty emblem + center ring; chip/show-made/ack handlers correct + bound once; no ES3 violations; read-only confirmed.
- **Reviewer 2 (security/parity/anti-bleed): clean** — `profile.values` escaped (`emCoreFrom` uses `_portraitEsc(vList.slice(0,4).join(', '))`); gems draw circles only (no text injection); 4 groups + chips + EXPL + ask/ask-sub/acts + ack + 4 made-rows verbatim+typographic; swatches = tokens; all scoped; `@keyframes` namespaced; no backdrop-filter; emblem is a leaf (iOS transform-ancestor bug N/A).

## Intentional deviations (combined ledger)
- `token` (Option A — emblem hues/swatches/gems → tokens) · `copy-normalize` (typographic) · `reuse-live` (capstone card = `.account-card`; eyebrow = `.account-values-eyebrow`).
- `data`: counts templatized `{n}`; geometry SLOTS fixed (mockup angles/radii) with data-driven counts + opacity.
- `css-at-rule`: `@keyframes portrait-breathe` is global+namespaced (cannot be `.account`-scoped) — the sole non-scoped rule, by CSS necessity.

## Verdict: PASS — committed locally. The reader-model transparency + "Your data" covenant remain LAST (untouched). Needs Preston's live smoke (the emblem breath + strand-focus + made-breakdown + sparse-data on a real account).
