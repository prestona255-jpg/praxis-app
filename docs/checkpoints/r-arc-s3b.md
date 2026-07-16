# R-ARC SLICE 3B — "THE BASIN" (identity + naming) — BUILD

**Status: BUILT · code CLEAN (both gates: data-safe, XSS/T5/parse/ES3/bytes all PASS) · ⛔ HELD ON A
SCOPE DECISION — "form follows naming in chrome" is a ~11-site sweep, bigger than the 3 surfaces ruled or
the 5 built; the remaining reference/list surfaces + the frozen field await Preston's scope ruling. NOT
committed. NOT pushed.** Base **`c681d35`** / v3.214 → v3.215. Recon: `r-arc-s3b-recon.md`.

## ⚠ THE GATE-CAUGHT EXTENSION (both agents, 2026-07-16)

Red-team + reviewer independently caught that my first cut left the **Read Page** (`renderSubTheoryPage`
hero + `renderSubTheoryReadOnly` title) and the **account-row glyph** rendering a basin **SHAPED** with
title "Untitled sub-theory" — one click from the workshop's mote, and my residual R2 falsely claimed only
the frozen FIELD was deferred. **Ruling (mine, carried): these are views.js chrome, so they complete "the
views.js partial goes formless" that Preston authorized — only the frozen FIELD `arc-constellation.js`
was to wait.** FOLDED IN: Page hero → `_stMarkOrMote`; Page/read-only title → origin phrase for basins
(named/published/seed subs are never basins, so the signed-out-reachable path is unaffected — verified);
account glyph → mote for basins. Re-verified live (Page mote + phrase; named reverts to shaped; account
basin=mote / named=shaped). If Preston wanted strictly the 3 named surfaces, trivially reversible.

## Scope as ruled (Preston 2026-07-16)

The recon's headline: **most of the basin is already wired** (a basin = a blank-header `subTheories[id]`;
accretion, mass, the mint via `updateSubTheory` all ship today). Preston then ruled the two forks:
- **3B-1 (mote visual):** DEFER the frozen-file FIELD render (its own follow-on: single-edit auth + hard
  red-team). **Take the views.js partial** — workshop / picker / newborn chrome go formless NOW.
- **3B-2 (split/merge):** BOTH DEFERRED to a new slice **3B-SM**, after Preston felt-tests the basin.

So **Slice 3B = origin phrase + naming-threshold invitation + formless-mote CHROME (views.js only)** —
additive, off the frozen `arc-constellation.js`.

## What shipped

**`state.js`** — `originEntryId` (string|null) on the sub-theory: `ensureSubTheoryFields` backfill (rides
both paths) + `createSubTheory` sets it. Mirrors the arc field from Slice 3.

**`views.js`** — four helpers + wiring:
- `_stIsBasin(sub)` — an unnamed, non-published sub-theory is a BASIN.
- `_stMoteHTML(sub, cd)` — the formless mote: a soft `--gold` glow, **brightness = mass** via opacity
  (mirrors the field's `[0.32, 0.62]` clamp), **fixed size, no size variance** (F2). All values computed.
- `_stMarkOrMote(sub, cd)` — dispatch: mote for a basin, shaped `bookSubMarkHTML` otherwise.
- `_stOriginPhrase(sub)` — the basin's origin phrase (life 1): the body of its `originEntryId` note, else
  its first evidence quote. Display-only; the note is the single source.
- **Wired — ALL views.js chrome (the mote replaces the shaped mark for basins; origin phrase replaces
  "Untitled"):** workshop hero, newborn card mark **+ title**, `subTheoryRowLabel` (picker), the notebook
  mint (`originEntryId = first gathered note`), the workshop **naming-threshold invitation** (§4b), **and
  (folded in at the gate) the Read Page hero + `renderSubTheoryReadOnly` title + the account-row glyph.**
  The frozen FIELD render (`arc-constellation.js` `_stRenderShapes`) is the ONLY deferred surface.

**`components.css`** — `.st-mote` (generic glow, used on light newborn + warm workshop) + the workshop
basin-note / invite / origin-phrase (warm-dim `--lum-*`).

## ⚠ A REAL BUG THE RIG CAUGHT

The newborn card first rendered **"Untitled sub-theory"**, not the origin phrase — because
`notebookNewborn.header` is **pre-baked** with an `'Untitled…'` fallback in `notebookCreateSubTheory`, so
`nb.header` was already truthy and masked the phrase. **Fixed:** the card checks the real record's
basin-hood FIRST (`rec && _stIsBasin(rec)` → origin phrase), else falls back to `nb.header`. Re-verified:
the newborn title now shows the origin phrase.

## Mechanical gates

| Gate | Result |
|---|---|
| Parse (T6) | `PARSE OK` state.js + views.js |
| Bytes (measured; no pre-declared band — 3B was NOT STARTED, so no band to breach) | state +699 (logic 220) · views **+4,911** (logic 3,368 gross-added, incl. the gate fold-in) · css +805 (**comment 324 / logic 481** — reviewer's exact count; my grep over-counted CSS block-comment continuation lines) · sw +0. **Flag for Preston:** views is substantial (5 helpers + 9 wiring sites across all chrome) — the real cost of "form follows naming" across every views.js surface. |
| ES3 | 0 violations in added lines |
| T4 | no `seeds` key, no `'seed'` noun (grep clean) |
| T5 | `arc-constellation.js` / `tradition-forms-arc.js` / `yumi-brain.js` **byte-untouched** (the frozen FIELD mote render is the deferred follow-on) |
| Byte-locks (T7) | 14,681 / 10,255 exact |
| New hex | none (`.st-mote` uses `--gold`) |
| XSS | `_stMoteHTML` injects only computed numbers + a token via innerHTML; no user text. Origin phrase reaches the DOM via `textContent` only. |

## Live verification — the rig (port 8803, SW killed)

| # | Behavior | Result |
|---|---|---|
| 1 | Schema: `originEntryId` on sub-theory, `createSubTheory` sets it, backfill | ✅ |
| 2 | Basin identity (`_stIsBasin`) — unnamed draft = basin | ✅ |
| 3 | Workshop hero renders the MOTE, not a shaped SVG mark | ✅ (`moteInHero`, `shapedMarkAbsent`) |
| 4 | Mote **brightness = mass** — opacity 0.32 (mass 0) → **0.44** (mass 0.40) | ✅ |
| 5 | Origin phrase displays (workshop `.stb-origin-phrase`) | ✅ |
| 6 | Naming invitation ABSENT below mass, PRESENT at mass (§4b's exact copy) | ✅ |
| 7 | **The mint**: naming → basin becomes a shaped sub-theory; mote + invitation gone | ✅ (`shapedMarkNow`, `inviteGone`) |
| 8 | Picker label shows the origin phrase for a basin | ✅ |
| 9 | Newborn card: mote + origin phrase (after the fix) | ✅ |
| 10 | Persistence: `originEntryId` survives a reload | ✅ `PERSISTED: true` |
| 11 | **Read Page (folded in): basin → mote + origin phrase, not shaped + "Untitled"** | ✅ `pageHeroMote`, `titleIsOriginPhrase` |
| 12 | **Regression: NAMING reverts the Page to a SHAPED mark + the name** | ✅ `NAMED_REVERTS_TO_SHAPED` |
| 13 | **Account row (folded in): basin glyph = mote + phrase; named = shaped** | ✅ (fn-direct: `basinRow_glyphIsMote`, `namedRow_glyphShaped`) |

The full §4b loop is felt-real: **capture → unnamed basin (formless mote + origin phrase) → mass accretes
(mote brightens) → naming invited at mass → naming mints it into a shaped sub-theory.**

## Design choices flagged for the felt pass (Preston's eyes)

1. **The mote** — a soft gold radial glow, brightness-only, fixed size. First look at "form follows
   naming"; the FIELD render (constellation) is the deferred follow-on, so a basin still shows shaped in
   the arc field for now (chrome-only this slice, as ruled).
2. **The naming-threshold** = maturity ≥ 0.15 (≈225 chars or ~3 fragments). A felt number — tune freely.
3. **The invitation copy** = §4b's verbatim "this gathering keeps circling something — what would you
   call it?"
4. **Origin phrase for unnamed** everywhere (workshop, picker, newborn) instead of "Untitled".

## Residuals

1. **VISUAL GATE owed** — the mote glow + the invitation, Preston's eyes on deploy.
2. **⚠ "form follows naming in chrome" IS A BIGGER SWEEP THAN SCOPED — a decision is owed (reviewer,
   2026-07-16).** DONE (5 surfaces): workshop hero, picker label, newborn (mark + title), Read Page
   (hero + title), account row (glyph + label). **STILL SHAPED (~6 more views.js chrome sites the reviewer
   enumerated — NOT yet converted):** `_arcCardConstellation` (**Arcs-list "Your arcs" cards — highest
   traffic**), own-profile arc thumb (`op-thumb`), Book-Detail "what it grew into" (`buildGrewRow`), the
   Read-Page connections footer, the workshop connections footer, the arc-detail Read-tab author list, +2
   text-only "Untitled" dialogs (mark-picker header, unlink confirm). PLUS the frozen FIELD
   (`_stRenderShapes`) which is the ruled deferral. **This is a scope decision for Preston** — full chrome
   sweep, his exact 3 surfaces, or a defined subset. Note `_arcCardConstellation` is a constellation-style
   thumbnail (chrome vs field-like is itself a judgment call).
3. **Split/merge deferred** to Slice 3B-SM (3B-2), after Preston felt-tests.
4. **Rail register-expansion** (Fork 5) still open — basin fragments from question/journal notes count in
   mass but aren't visible in the workshop rail.
5. **Basin mote keeps the symbol-picker trigger** (red-team nit) — the workshop/Page hero mote is still
   `role=button` → `openSymbolPicker`; a user can pick a shape on a basin, but form-follows-naming shows
   the mote regardless until it's named, so the pick is invisible until then. Minor; the pick is retained
   (applied once named), not lost. Named, not fixed.
6. **Fixed (red-team nit):** `_stOriginPhrase` now guards `sub.evidence[0]` truthiness before `.quote`
   (a `[null]` evidence array from a corrupt remote merge would otherwise throw).
