# Portrait Fidelity Spec — v6 instrument mockup → live account page

**Source of truth:** `praxis-portrait-mockup-v6-instrument.html` (851 lines, 61,655 bytes; copied into the worktree as a reference, NOT committed).
**Target:** `renderAccountPage()` ([js/views.js:12370](../../js/views.js)), Umber **DARK** ground.
**Built:** Stage 0, 2026-06-23, worktree `relaxed-lederberg-ac8a2a`, off `main` HEAD `72db19b`.
**Rule:** PORT, do not re-author. Allowed deviations only: real data, real taxonomy, ES3 dialect, Praxis token names, explicitly-deferred backend. Everything else 1:1.

> **Worktree note:** this build runs in the existing `relaxed-lederberg-ac8a2a` worktree (clean, at main HEAD) as the build lane — I did NOT spawn a nested worktree (CLAUDE.md: worktrees are guarded, never freehand). The reference mockup copy at repo root is untracked and will be staged-out of every commit (explicit `git add <files>`, never `-A`).

---

## 0 · Anchor re-confirm (all VALID at HEAD 72db19b)

| Anchor | Recon | Re-confirmed | Control |
|---|---|---|---|
| `renderAccountPage()` | views.js:12370 | **12370** ✓ | `function renderAccountPage()` |
| hero (`account-hero`) | ~12492 | **12380 / 12417**, heroText 12447, heroName 12460, heroTagline 12470 ✓ (already carries `Fidelity (mock .account-hero)` comments @12419) | `hero.className='account-hero'` |
| constellation slot | ~12572 | **12587 / 12596** ✓ | `account-constellation-slot` |
| stat cards (`account-stats`) | ~12618/12630 | **12625** ✓ | `stats.className='account-stats'` |
| expand host | ~12633 | **12634** ✓ | `account-expand-host` (also used @11366/11374/11388) |
| transparency / data card | ~12648/12720 | **12648** `account-card account-data-card` ✓ | `dataEyebrow 'your data'` |
| reader-model section | ~12700–12718 | `buildReaderModelSection` def **11860**, appended **12718** ✓ | `buildReaderModelSection(uid)` |
| **threads "Recurring themes" (reuse)** | 12049/12226 | **12221** comment `recurring themes`; **12226** `lbl1='Recurring themes'`; **12229** `model.threads` ✓ | `getReaderModel(uid)` @11862 |
| profile.values site 1 (.set) | integrations.js:731 | **731** `.set({` (displayNameOverride @732) ✓ | full-doc overwrite |
| profile.values site 2 (seed) | state.js:873 | **873** `profile:{...}` (readerModel @874) ✓ | ensureUser |
| profile.values site 3 (getProfile) | state.js:973 | **969** `function getProfile(uid)` ✓ | — |
| SCHEMA tail gate | state.js:2714 | **2714** `=== '1.23.0'` (control 1.22.0 @2692) ✓ → new gate `'1.24.0'→'1.25.0'` | migrate() @2151 |
| dark-ground set | views.js:350–352 | **350** `umberGroundDark={...account:1}` ✓ | account ∈ dark |
| categories-axis data | — | `SHELF_THEMES` views.js:2480 · `THEME_TO_TRADITION` state.js:300 · `TRADITIONS` state.js:321 · `deriveTraditionFromGenre` state.js:350 ✓ | — |
| lenses-axis data | — | `state.userThemes` state.js:284 · `createUserTheme` state.js:1665 · `assignBookToTheme` state.js:1687 · `generateLenses` yumi-brain.js:917 · `evalLensResponse` yumi-brain.js:981 ✓ | — |
| notes data | — | `entry.bookIds` (schema state.js:26/42) ✓ | — |
| **no arc-constellation dep** | — | portrait marks are self-contained inline SVG in the mockup JS (`shape()`, galaxy stars, emblem builder); `renderTraditionFormArc` NOT used by the portrait ✓ | — |

**Baseline bytes (to-be-touched):** views.js 567,489 · state.js 117,072 · integrations.js 78,187 · components.css 349,147 · theme.css 23,158 · sw.js 4,816.

**Banned-token baseline (pre-existing; re-grep post-edit must not INCREASE):**
- views.js: `.catch`=1, `.finally`=0, `=>`=1, backtick=3, `\bconst\b`=1, `\blet\b`=4, `\bclass\b`=126 (all in HTML-string `class="..."`, comments, regex — not ES6 syntax).
- state.js: `.catch`=0, `.finally`=0 → **cscript-parse-clean**. backtick=9, const=1, let=2 (comments/strings).
- integrations.js: `.catch`=20 → **cscript false-FAILs**; verify via full-diff / live.
- **Parse policy:** state.js → cscript `new Function(body)`. views.js → `parse-check-views.js` (cscript false-FAILs on its 1 `.catch`). integrations.js → full-diff + live.

---

## (a) TOKEN TABLE — mockup `:root` → Praxis token

**Convention reminder:** "no hardcoded hex" is **color-only**. All px geometry (radii, sizes, blur, transition timings, letter-spacing) ports as **literal values 1:1** — those are NOT tokens and need no decision.

**Fonts — EXACT, map cleanly:**

| Mockup | Value | Praxis token | Match |
|---|---|---|---|
| `--serif` | Cormorant Garamond, Georgia, serif | `--font-serif` | ✓ exact |
| `--sans` | DM Sans, system-ui, sans-serif | `--font-body` | ✓ exact |
| `--mono` | DM Mono, ui-monospace, monospace | `--font-mono` | ✓ exact |

**Page ground — NOT ported (already on Praxis dark ground):** the mockup's `body{background:radial-gradient(ellipse 130% 100% at 50% -10%, #2C2114, #201810, #120E08)}` is replaced by the existing `body[data-ground="dark"]::before` → `--ground-grad` over `--ground #2f1c0e`. `--bg-top/-mid/-edge` are consumed only inside ported rules (e.g. `.season::before box-shadow ... var(--bg-mid)`) → remap to `--ground` / `--surface-d`. **Geometry/stops differ but we accept the Praxis ground (canon).**

**Colors — the decision surface (mockup palette ≈ but ≠ Praxis Umber dark):**

| Mockup var | Mockup value | Nearest Praxis dark token | Resolved value | Exact? |
|---|---|---|---|---|
| `--ink` | `#F1E8D1` | `--ink` (→`--text-d`) | `#f0e3c8` | ✗ very close |
| `--ink-2` | `#D8CDB1` | `--ink-2` (→`--muted`) | `#c2a87f` | ✗ |
| `--ink-soft` | `#AA9E80` | `--muted` / `--meta` | `#c2a87f` / `#9a7e4e` | ✗ |
| `--ink-faint` | `#7C725A` | `--meta` | `#9a7e4e` | ✗ |
| `--gold` | `#CBA862` | `--gold` (dark) | `#d2a23e` | ✗ |
| `--gold-deep` | `#9C7F45` | `--gold-ink` / `--gold-soft` | `#855410` / `#e7c46a` | ✗ |
| `--gold-glow` | `rgba(203,168,98,.5)` | derive from `--gold` | — | ✗ |
| `--teal` | `#4FBBA0` | `--teal` | `#2e8a93` | ✗ (notable) |
| `--clay` | `#CC7B5D` | `--danger` | `#c2603a` | ✗ |
| `--violet` | `#9690D6` | `--journal-color`/`--register-journal` | `#7d6db0` | ✗ |
| `--card` | `rgba(60,48,28,.42)` | `--surface`(dark `#3e2814`) or `--glass`(`rgba(64,40,20,.74)`) | — | ✗ |
| `--card-2` | `rgba(60,48,28,.26)` | `--glass`/`--surface-2` | — | ✗ |
| `--card-solid` | `#241B10` | `--sunk-d` / `--dark-2` | `#241406`/`#2a1a0c` | ✗ close |
| `--line` | `rgba(201,171,99,.16)` | `--border`(dark) | `rgba(210,162,62,.18)` | ✗ close |
| `--line-soft` | `rgba(201,171,99,.10)` | `--wash`(dark) | `rgba(210,162,62,.08)` | ✗ close |

**Sub-theory glyph colors (COUNTS panel `shape()`):** mockup `#6FC9BC / #8E8AD0 / #6FA052 / #CC7B5D` ≈ Praxis `--subtheory-*` palette (`--subtheory-1 #6FC9BC` exact; others near). Map to `--subtheory-N` / accent tokens.

**Accent literals reused in JS (galaxy HUES, emblem strokes, field blooms):** `['#CBA862','#4FBBA0','#CC7B5D','#9690D6','#D9A24E','#8FB36A']` + emblem `#CC7B5D/#CBA862/#9C7F45/#4FBBA0/#F1E8D1`. These are the same gold/teal/clay/violet/cream family — remap to the chosen color tokens (var() in inline SVG fills, which the codebase already does).

### ⮕ DEVIATION FLAG — the one color/spacing ruling (Preston)
The mockup was authored in a bespoke dark palette **close to but not identical** to Praxis Umber dark. The fidelity contract's "values must stay identical" cannot literally hold for colors. Two resolutions:

- **Option A (RECOMMENDED, canon-compliant):** wire ported rules to the **existing Praxis dark tokens** (`--ink`, `--gold`, `--teal`, `--journal-color`, `--danger`, `--surface`, `--border`, `--subtheory-*`). Values shift slightly toward the live app palette → new sections render **native** to the existing dark account page; **zero new hex**. Cost: not pixel-identical to the v6 mockup (gold a touch deeper `#d2a23e`, teal deeper-blue `#2e8a93`, violet/clay shifted). This becomes the standing INTENTIONAL-DEVIATION (`token`) in the Stage 5 ledger.
- **Option B (mockup-exact):** add the mockup palette as ~12 account-scoped tokens in theme.css. Pixel-identical to mockup; cost: two golds/teals coexist on one page, diverges from live Umber, adds hardcoded hex.

CLAUDE.md design canon ("conform to existing tokens; no new hardcoded hex; the account page is the Umber DARK ground") points to **A**. I will proceed on **A** unless overridden.

---

## (b) COPY INVENTORY — verbatim, section by section

> Strings marked **[static]** port verbatim. **[derived]** = structural copy verbatim, content from real data. **[illustrative]** = sample content, replaced by real data (NOT a copy-parity target; its TEMPLATE is).

**NAV / REVIEW banner / FAB "Y"** — mockup-only chrome, **NOT PORTED** (Praxis has its own nav + Bloom FAB).

**HERO** *(already-live; ADAPT)*
- eyebrow **[derived]**: `Your standing place · reading since {Month Year}` (date = earliest book `addedAt`)
- name **[derived]** + `✎`; desc/tagline **[derived]** + `✎`
- stance line **[static]**: `Everything below is yours. Yumi offers; you decide what it means.`

**VALUES** *(PORT — Stage 1)*
- eyebrow **[static]**: `What you're reading toward` + hint `— in your own words`
- stone-add **[static]**: `＋ place a stone`
- stone-input placeholder **[static]**: `what you care about…`
- helper **[static]**: `You place these. Yumi never fills them in.`
- stones **[illustrative]**: naming the world / the classroom as a commons / reading as refusal / desire as method

**COUNTS** *(already-live stats + expand-host; VERIFY parity — see open item)*
- eyebrow **[static]**: `Your reading life` + hint `— tap to open it here`
- labels **[static]**: `Books` `Arcs` `Sub-theories` `Marginalia`; chev `▾`
- panel head **[static]**: `{Your books|Your arcs|Your sub-theories|Your marginalia}` + `still on your account` + `close ✕`
- row **[static]**: `open →`; badges **[derived]** `Reading`/`Finished`; sub meta **[derived]** `N sub-theories` / `N pieces of evidence`
- more **[derived]**: `…{n} more on the Shelf →` / `…{n} more arcs →` / `…all {n} sit on the Arcs board →` / `…{n} more across the Notebook →`

**MOVEMENT / TOGGLE** *(PORT — Stage 2)*
- eyebrow **[static]**: `What your reading shows` + hint `— for you to name`
- `View by`; seg **[static]**: `Book categories` (on) / `Your lenses`

**SORTS / DIALOGUE** *(PORT — Stage 3)*
- eyebrow **[static]**: `How your library sorts` + hint `— you hold the names`
- hold (categories) **[static]**: `These buckets are yours — rename them, merge them, or throw them out. The sorting is the thinking.`
- hold (lenses) **[static]**: `Lenses are yours to shape — keep what fits your thinking, rename it, or let it go.`
- pre (categories) **[static]**: `Yumi would file these under`; pre (lenses) **[static]**: `Yumi would make a lens called`
- confirmed label (categories) **[static]**: `You call these:`; (lenses) **[static]**: `Your lens:`; meta `filed`/`your name`/`{n} books`
- chips **[static]**: `that's it` · `rename ✎` · `not really` (categories reject) / `not a lens` (lenses reject) · `set aside` · `undo`
- aside body **[static]**: `You set this one aside.`
- offer bodies **[illustrative]** (categories/lenses sample text replaced by real proposals)

**FIELD** *(PORT — Stage 2)*
- eyebrow **[static]**: `The field you read across` + hint `— and its edges`
- field-help **[static]**: `Soft regions are where your reading gathers. The marked points are where it pulls two ways, or thins out — tap one.`
- tlabel **[static]**: `?`; tension-card = `{q italic}` + `{sub}` **[derived structure / illustrative content]**

**GALAXY** *(PORT — Stage 2)*
- eyebrow **[static]**: `Your reading as a galaxy` + hint `— bigger stars hold more; nearer stars share more`
- galaxy-help **[static, templated]**: `Each star is one of your {categories|lenses}. The more `**`books`**` inside, the larger it burns; the more you've `**`annotated`**`, the brighter. Stars that share notes are pulled together by gravity — hover one to see what it's bound to.`
- readout default **[static]**: `Hover a star to see its mass and what it's bound to. Nearer stars share more of your notes.`
- readout (hover) **[derived]**: `{name} {books} books · {notes} notes · {among your densest margins|lightly annotated so far} · {bound most to {partner}|stands on its own}`
- star caption **[derived]**: `{books} books · {notes} notes`

**RETURNS** *(PORT — Stage 3)*
- eyebrow **[static]**: `What your margins keep returning to`
- ret-help **[static]**: `Just the count — drawn straight from your notes. What it adds up to is yours to say.`
- rows **[derived]**: `{book/phrase}` + `{returned N×|across N books|your densest margins · N notes|N books}`

**THREADS** *(PORT — Stage 3; reuse reader-model threads @12221-12229)*
- ti **[static]**: `~` + `Yumi can go one step further`
- blurb **[static]**: `Turn on her reader-model and she'll name the threads she sees weaving through your margins — patterns you might not catch yourself. She only ever names what's actually there, and you can dismiss anything that doesn't fit.`
- toggle **[static]**: off `Let Yumi notice` / on `Yumi is noticing`
- minis **[static]**: `that's right` → `✓ kept`; `dismiss` → `dismissed`
- thread bodies **[derived]**: `{thread label}` + `noticed across {n} notes in {m} books` / `a pattern Yumi is still forming`

**JOURNEY** *(PORT — Stage 4)*
- eyebrow **[static]**: `How your reading has moved`
- help **[static]**: `No streaks, no finish line — just the shape of the change.`
- seasons **[derived]**: `{when}` (mono) + `{said, Yumi-voiced}`; open-end said **[illustrative]** stays an open question, not a verdict

**CAPSTONE / EMBLEM** *(PORT — Stage 4)*
- eyebrow **[static]**: `And so —`
- e-chips **[static]**: `your values` · `your lenses` · `your categories` · `your marginalia`
- e-explain default **[static]**: `Tap a strand to see what it's made of.`
- EXPL (4) **[static]**:
  - values: `The core — the four values you placed. They sit at the center because everything else is read through them.`
  - lenses: `The rings — the lenses you've built with Yumi. Your own conceptual structure, holding the rest together.`
  - categories: `The outer arcs — the categories your library leans into. The faint ones are where your reading goes thin.`
  - marginalia: `The filaments — your {n} marginalia, each reaching inward, sized by how often you return to it.`
- ask **[static]**: `Does this look like you?`
- ask-sub **[static]**: `Woven from the values you placed, the lenses you keep, the categories you read across, and the marginalia underneath it all — every strand traces back to something of yours. It isn't a verdict. It's a question.`
- ask-acts **[static]**: `yes, that's me` · `not quite` · `show me what it's made of` (toggles `hide what it's made of`)
- ack yes **[static]**: `Then it's yours. It'll keep changing as you do.`
- ack no **[static]**: `Good — that gap is the interesting part. Keep reading against it.`
- made rows (4) **[static parts / derived from]**: `the core` · `the rings` · `the outer arcs` · `the filaments` + the from-descriptions

**GOVERNANCE** *(already-live; VERIFY parity)*
- eyebrow `Your data`; covenant `Your library, your arcs, your notebook — they live in your account, and they're yours. Take a copy or remove them whenever you like.`; actions `Edit profile`/`Theme`/`Export to JSON`/`Sign out`; danger `Delete account` / `Permanently removes your account and everything in it. This can't be undone.`

---

## (c) STRUCTURE — section order + component inventory

Mockup `.stage` order → live `renderAccountPage` wrap order:

1. HERO `.card.hero` — **ALREADY-LIVE** (adapt eyebrow+stance)
2. **VALUES** `.sec > .eyebrow + .card > .stones#stones + helper` — **PORT (S1)** — insert after hero (~12492)
3. COUNTS `.sec > .stats(4×.stat) + .panel#panel` — **ALREADY-LIVE** (stats+expand-host) — verify
4. MOVEMENT `.movement > .toolbar > .seg#axisSeg` — **PORT (S2)**
5. SORTS `.sec > #sorts + .holding#sortHold` — **PORT (S3)**
6. FIELD `.sec > .card.field-wrap > .field-help + .field#field + .tension-readout#treadout` — **PORT (S2)**
7. GALAXY `.sec > .card.galaxy-wrap > .galaxy-help#galaxyHelp + .galaxy#galaxy + .galaxy-readout#galaxyReadout` — **PORT (S2)**
8. RETURNS+THREADS `.sec > .card.returns + .card.threads#threads(.toggle#rmToggle + .named#named)` — **PORT (S3)**
9. JOURNEY `.sec > .card.journey(.season×4, last .open-end)` — **PORT (S4)** — insert BEFORE reader-model/transparency cluster (~before 12700)
10. CAPSTONE `.sec > .card.capstone(svg.emblem#emblem + .e-chips#eChips + .e-explain#eExplain + .ask + .ask-sub + .ask-acts + .ack#ack + .made#made)` — **PORT (S4)** — capstone before governance footer
11. GOVERNANCE `.sec > covenant + actions + danger` — **ALREADY-LIVE** — verify

Component classes (CSS to port): `.eyebrow(.hint)`, `.card`, `.stones/.stone(.rm)/.stone-add/.stone-input`, `.stats/.stat(.n/.l/.chev)/.panel(.inner)/.phead/.row/.badge/.meta/.more/.deep`, `.movement/.toolbar/.seg/.by`, `.offer(.body/.yumi-says/.pre/.proposed/.acts/.chip(.yes/.no)/.confirmed/.aside/.undo/.rename-in)/.holding`, `.field-wrap/.field/.bloom/.pole(.dim)/.tlabel/.tension-readout/.tension-card(.q/.sub)/.field-help`, `.galaxy-wrap/.galaxy-help/.galaxy(.dim)/.bonds/.speck/.star(.nm/.ct/.hi)/.galaxy-readout(.where)`, `.returns/.ret-row(.ph/.ct)/.ret-help`, `.threads(.ti/.sig/.blurb)/.toggle(.switch/.knob)/.named/.thread-row(.body)/.mini(.dismiss)`, `.journey(.help)/.season(.when/.said/.open-end)`, `.capstone/.emblem/.breathe/.grp/.e-*/.e-chips/.e-chip/.e-explain/.ask/.ask-sub/.ask-acts/.made(.mrow/.swatch/.part/.from)/.ack`. Governance `.covenant/.actions/.danger` already-live.

---

## (d) INTERACTION INVENTORY

| # | Interaction | Handler (mockup) | Stage |
|---|---|---|---|
| I1 | COUNTS stat → expand-in-place panel (toggle close on re-click); `close ✕` | `openPanel/closePanel`, stat click loop | live/verify |
| I2 | VALUES add stone (input → Enter/blur commit, Escape cancel) + remove `✕` | `addBtn`, `makeStone`, `bindRm` | S1 |
| I3 | shared AXIS toggle re-renders **dialogue + field + galaxy** | `seg` click → `setAxis` → `renderSorts/renderField/renderGalaxy` | S2 (scaffold) |
| I4 | DIALOGUE confirm/rename/reject/undo (event-delegated on `#sorts`) | `sortsEl` click | S3 |
| I5 | FIELD tension hotspot tap/Enter/Space → tension-readout card | `tlabel` click+keydown | S2 |
| I6 | GALAXY hover/click/focus star → dim others, brighten bound partners, show filaments, readout; blur/leave clear | `lite/clear/partnerOf` | S2 |
| I7 | THREADS consent toggle → reveal `.named`; label flip | `rmToggle` click | S3 |
| I8 | THREAD mini that's-right / dismiss | `minis` loop | S3 |
| I9 | EMBLEM chip → `data-focus` strand isolation + explain (toggle off) | `eChips` loop, `setChip` | S4 |
| I10 | EMBLEM `show me what it's made of` expand/collapse; `ackYes`/`ackNo` | `showMade`/`ackYes`/`ackNo` | S4 |
| I11 | boot `setAxis('categories')` | bottom of IIFE | S2 |

ES3-ify note: `.forEach` is used heavily in the mockup; the Praxis client uses classic `for` loops — convert all `.forEach`/`arr.map` to indexed `for`. `requestAnimationFrame` double-rAF for the galaxy settle is fine. `Math.random()` (specks) is fine in client JS. `prefers-reduced-motion` guard ported verbatim (`reduceMotion`, `@media(prefers-reduced-motion:reduce)`).

---

## (e) SUB-SPECS

### GALAXY (two-channel + gravity)
- **size = #books:** `rad(b)=16+t*30` px, `t=(b−minB)/(maxB−minB)`; diameter `2·rad` (≈32–92px).
- **brightness = annotation density:** `dens=notes/books`; `br=(dens−minD)/(maxD−minD)`; drives highlight `0.28+br·0.5`, glow blur `10+br·30`, glow alpha `0.22+br·0.42`, opacity `0.82+br·0.18`.
- **HUES** rotation `['#CBA862','#4FBBA0','#CC7B5D','#9690D6','#D9A24E','#8FB36A']` `i%6` → remap to color tokens.
- **bonds = shared membership:** `bondsFor()` — for each cross-group note (thread.cols.length>1), every column pair (i,j) gets weight `+1`. Real data: notebook entries whose `bookIds` span ≥2 groups.
- **force sim** `layout(R,bonds)`: box VW=720 VH=340 pad=14; init ellipse (VW·0.28,VH·0.32); **440 iters**; per pair separation (`sep=R[i]+R[j]+40`, `push=(sep−d)·0.5`) + repulsion (`2600/d²`); bond spring (`rest=R[i]+R[j]+46`, `f=(d−rest)·0.006·w`); centering `·0.012`; clamp. Positions → % of box.
- **ambient:** 34 random specks; bond filaments = quadratic SVG paths (hidden, `.show` opacity .75 on hover); star settle scale 0.25→1 / opacity 0→op over 1.4s cubic-bezier(.22,.61,.36,1); reduced-motion places immediately.
- **hover** `lite(idx)`: `galaxy.dim` + `star.hi` + show bonds touching idx + brighten partners; `partnerOf(idx)` = max-weight bond partner; readout templated. `clear()` resets.

### FIELD (per axis)
- `F.blooms[{x,y,r,c}]` radial-gradient regions (blur 26px, opacity .32); `F.poles[{x,y,l,dim?}]` italic labels (dim = smaller/muted); `F.tensions[]` two shapes: `{a,b,mx,my,c,q,sub}` (a line between two poles = **gap**) or `{point,mx,my,c,q,sub}` (single = **thin** or **rising**).
- render: SVG viewBox `0 0 100 100` preserveAspectRatio none; dashed connector lines (dasharray `1.4 1.6`, opacity .55); blooms/poles as positioned divs; `tlabel` "?" buttons at (mx,my), click+Enter/Space → `treadout` `.tension-card(.q italic + .sub)`.
- **real mapping:** gap = two high-volume groups with ~0 shared notes; thin = lowest-density group; rising = group with most recent notes.

### EMBLEM (4 real sources → 4 groups, one 200×200 SVG, cx=cy=100)
- **e-categories** (outer arcs, clay): 5 arcs r=84, opacity by lean→thin → real **tradition lean** (counts per tradition; faint = thin).
- **e-lenses** (concentric rings, gold): 3 circles r=70/60/50 → real **userThemes**.
- **e-marginalia** (filaments+nodes, teal): 8 nodes (angle/radius/size) lines+dots → real **notebook marginalia density** (size by return frequency, count in EXPL/made).
- **e-values** (core gems, cream): 4 gems (3@r=9 + center) + ring r=13 → real **profile.values** (the placed words/count).
- `.breathe` 7s scale 1↔1.018 (reduced-motion off). focus via `em[data-focus=X]` dims `.grp`→.1 except `.e-X`→1; `setChip` highlights. `.made` 4 mrows (swatch/part/from); ack text on yes/no.

### DIALOGUE (offer states, per axis)
- **open:** `.body` + `.yumi-says(.pre + .proposed pill)` + acts `[confirm "that's it" / rename "rename ✎" / reject (rejectLabel||"not really")]`.
- **confirmed:** `.yours(yoursLabel + <b>label</b> + meta)` + acts `[rename / reject "set aside"]`.
- **aside:** dimmed `.body` + `undo`.
- transitions: confirm→confirmed(meta `filed`); rename→inline `.rename-in`, Enter/blur→confirmed(meta `your name`); reject→aside(`You set this one aside.`+undo); undo→`renderSorts()` reset.
- **real mapping — lenses axis:** proposals `generateLenses` → `evalLensResponse`; confirm/rename → `createUserTheme` (keep/name a userTheme); reject → dismiss.
- **real mapping — categories axis (NET-NEW, heaviest):** propose a label for a book-cluster on EXISTING genre/tradition (NO swap); confirm/rename → persist a user-category LABEL additively; reject → dismiss. **S3 minimal, or split to its own prompt if it balloons.**

---

## Open items / deviation flags

1. **COLOR token ruling (A vs B)** — see (a). Proceeding on **A** (Praxis dark tokens) unless overridden.
2. **COUNTS expand-in-place** is in the mockup but **not assigned a build stage** — the live page already has `account-stats` + `account-expand-host`. ASSUMED already-live; will diff against mockup in Stage 5 and flag if it needs folding into a stage.
3. **HERO** eyebrow `reading since {Month Year}` + stance line — confirm present live or adapt in S1 (cheap, additive).
4. **Categories-axis dialogue proposer** (net-new persistence) is the heaviest piece — Stage 3 decides minimal-vs-split (the Stage 3 question).
5. **GOVERNANCE** already-live — verify parity only, do not re-port.

---

## Addendum — completeness-critic refinements (3 adversarial critics, 2026-06-23)

3 independent critics re-extracted copy/CSS/interactions from the mockup and diffed against the spec above. **All (e) sub-spec force-sim params + galaxy formulas were independently VERIFIED correct** (VW=720/VH=340/pad=14, 440 iters, sep+40/push·0.5, rep 2600/d², spring rest+46/f·0.006·w, centering ·0.012, rad 16+t·30, dens notes/books, br curve, glow/alpha/opacity all ✓). Material gaps, folded here:

### R1 · APOSTROPHE / QUOTE GLYPH POLICY (the #1 copy-parity trap)
The mockup is **internally inconsistent**: its **static HTML** copy uses **straight ASCII `'`** (lines 291 `you're`, 348/350 `you've`/`it's`, 366 `she'll`/`what's`/`doesn't`, 384 `isn't`/`it's`, 399 `it's`, 401 `isn't`/`It's`, 403 `that's`, 405 `it's`), while its **JS-generated** strings use **typographic `’` (U+2019)** (line 595 `that’s it`, 749 `it’s bound to`, 757 `you’ve`/`it’s`, 831 literal `it’s`, 840 `it’s made of`, 842 `it’s`/`It’ll`; EXPL lenses 823 literal `you’ve`). Illustrative quote-content uses curly double-quotes `“…”` (returns 359/361, marg panel, thread notes — all illustrative→real).
- **Verbatim parity against an inconsistent source is impossible.** RULE (recommended): **normalize ALL user-visible apostrophes/quotes to typographic `’ “ ”`** (matches the JS-generated strings, the serif aesthetic, and is the more polished choice). Record as a single standing INTENTIONAL-DEVIATION (`copy-normalize`) in the Stage 5 ledger; the copy-parity grep compares against the **normalized** target, not the mockup's straight-ASCII HTML instances.
- Same logical strings that differ only by glyph (e-explain default: HTML 399 straight vs JS-reset 831 curly; galaxy-help/readout HTML 348/350 straight vs JS 757/749 curly) → **one normalized form** each. We render via JS anyway, so the JS-source (curly) form governs.

### R2 · MADE-ROW copy is DISTINCT from EXPL (separate verbatim strings)
The capstone `.made` breakdown rows (lines 409-412) are **not** the EXPL strings — both must port. The 4 `from` strings **[static frame / derived content]**:
- core (swatch `--ink`): `the {n} values you placed — {value list}`
- rings (swatch `--gold`): `your lenses — the conceptual groupings you've built with Yumi`
- outer arcs (swatch `--clay`): `the categories your library leans into — and the ones it leaves thin`
- filaments (swatch `--teal`): `your {n} marginalia, placed by how often you return to each`
Plus the EXPL set (lines 822-825) stays as its own 4 strings (different wording — "sized by" vs "placed by", adds "They sit at the center because…"). **8 distinct strings total** across EXPL + made.

### R3 · RESPONSIVE — port behaviors, align to the Praxis 760 breakpoint (not the mockup's 640)
Mockup `@media(max-width:640px)` (lines 253-257): `.stats` 4→2 col; `.hero` stacks (column, centered); `.ask` 34→27px; `.navlinks` hidden (nav excluded). Per CLAUDE.md breakpoint discipline (mobile↔desktop divide = **760**, mobile block `@media(max-width:759px)`), **port these mobile behaviors at the Praxis 759 breakpoint, not 640.** Net-new mobile-only rules → `@media(max-width:759px)`; verify at 390 + ~1280 with the other width undisturbed. This is an intentional-deviation (`breakpoint`).

### R4 · A11Y affordances (must port — keyboard fidelity)
- `:focus-visible{outline:2px solid var(--teal); outline-offset:2px;}` (line 252) — global; port (confirm not already present app-wide).
- FIELD tlabel (line 651) + GALAXY star (line 730): `tabindex="0"` + `role="button"`; click AND Enter/Space (tlabel) / focus+blur (star) mirror the pointer interaction. The galaxy `focus → lite(idx)` / `blur → clear()` keyboard path is load-bearing — port both.

### R5 · PSEUDO-ELEMENTS + structural pseudo-classes (port rules verbatim)
- `.season::before` (line 206): gold dot `9×9`, `box-shadow:0 0 0 4px var(--bg-mid)` (remap `--bg-mid`→`--ground`/`--surface-d`). `.season.open-end::before` (line 210): transparent + `1px dashed var(--gold)`. The timeline node IS a pseudo — must port.
- Border-reset pseudo-classes: `.row:first-of-type`, `.ret-row:first-of-type`, `.season:last-child` (border-left transparent), `.made .mrow:first-child`. **Port every selector + pseudo-class/element verbatim** (the fidelity method preserves cascade/specificity by definition — no need to re-document each :hover/:first-of-type individually).

### R6 · JS color-literal → token map (Option A; explicit, prevents drift)
All JS-inline color literals get `var(--token)` (codebase already uses var() in SVG fills):

| JS site (line) | Literal | → token |
|---|---|---|
| HUES[0..5] (662) | `#CBA862,#4FBBA0,#CC7B5D,#9690D6,#D9A24E,#8FB36A` | `--gold,--teal,--danger(clay),--journal-color(violet),--subtheory-15(sand),--subtheory-9(green)` |
| star gradient (732) | `rgba(255,249,233,…)` / hue / `rgba(18,12,6,.92)` | `--text-on-dark`(cream) / hue token / `--ground`/`--sunk-d` |
| specks (714) | `#F1E8D1` / `#CBA862` | `--ink` / `--gold` |
| bond path stroke (721) | `#CBA862` | `--gold` |
| emblem (796/801-803/808/816) | clay arcs `#CC7B5D`; rings `#CBA862`(sw1.3,op.85)/`#9C7F45`(sw0.7,op.55)/`#CBA862`(sw0.5,op.4); filaments `#4FBBA0`; gems `#F1E8D1` | `--danger / --gold,--gold-deep,--gold / --teal / --ink` |
| galaxy box bg (156) | `#1b1207,#100b06,#070504` (deep-space radial) | **decision:** map to `--sunk-d`/`--ground`/darker, OR keep as an account-scoped "deep space" exception token. Flag with the color ruling. |
| `.btn.primary` (57) | `linear-gradient(90deg,var(--teal),var(--gold))` | already token-based; ⚠ verify the teal→gold blend still reads after the dark-token swap (Stage 6 smoke). |
| `--gold-glow` (16) | `rgba(203,168,98,.5)` | **unused in mockup — do NOT port.** |

Emblem `from`/EXPL swatches (made rows 409-412): `#F1E8D1→--ink`, `#CBA862→--gold`, `#CC7B5D→--clay/--danger`, `#4FBBA0→--teal`.

### R7 · REAL-DATA SELECTOR PRECISION (pin the sources)
- **Galaxy/field bonds = factual cross-group notes:** `notebookEntries` whose `bookIds` map to ≥2 distinct groups (tradition for categories-axis / userTheme for lenses-axis). **NOT `readerModel.threads`** — that is the consent-gated *interpreted* layer (S3 threads block), a different thing; do not source bonds from it.
- **e-values** count/words = `profile.values` (length + the placed strings). **e-marginalia** count = notebook entries with `register==='marginalia'` (return-frequency = per-book revisit count). **e-lenses** = `state.userThemes`. **e-categories** lean = per-tradition book counts (`deriveTraditionFromGenre`/`traditionOverride`).
- Galaxy `GAL[axis]={books[],notes[]}` and `AX[axis]={cols[],counts[],field,sorts,hold,threads}` illustrative arrays → built from the above selectors per axis.

### R8 · Interaction explicitness (free with verbatim port — noted for the parity ledger)
Escape on stone-input removes it without commit (509); galaxy double-`requestAnimationFrame` before `place()` for the settle (739, reduced-motion bypasses); `partnerOf(idx)` = max-weight bond partner for the readout (742); state is **class-driven** — `.stat.active`, `.seg button.on`, `.offer.confirmed`/`.aside`, `.toggle.on`, `.star.hi`, `.galaxy.dim`, `.bonds path.show`, `.named.show`, `.made.show`, `.panel.open` — all come from porting the CSS+JS verbatim.

### R9 · EXCLUDED COMPONENTS (formal not-ported list)
`.review` banner, `.nav` + `.wordmark`/`.search`/`.navlinks`/`.k`, nav `.avatar`, `.yumi-bubble` FAB — **NOT ported** (Praxis has its own nav + Bloom). Hero avatar uses the **already-live Praxis account avatar** (mockup `.avatar.av` `#57C2A8/#9A7C44/#1A140B` literals not ported). `.movement` is a `.movement` div (the only non-`.sec` section); all other sections are `.sec`.

### Dismissed over-flags (honest audit — not gaps)
Cascade/specificity documentation (preserved by verbatim port); `content:''` strategy (correct — dot is `background`, not a glyph); emblem inline-SVG-vs-CSS-class (port as JS-built inline SVG per mockup); galaxy-help static HTML line 348 ("groupings") — **immediately overwritten by the JS template on boot** (`setAxis` → line 757), so the JS form governs and the static is never seen; `@keyframes breathe` / reduced-motion already in (e); responsive "is it desktop-only" — resolved by R3.
