# DW-4 build checkpoint — Desktop Wave batch 4 (artifact + what-Yumi-sees) + 2 ruled riders

Self-selected batch (Stage 0 recon: `dw-4-recon.md`). Standing delegation (Preston,
2026-07-14): every fork ruled at my recommendation, no mockup, no mid-run halt; chips
under-claimed `composed` (the deployed felt pass decides `native`).

**Rig:** `.claude/rig/` (extracted + committed this batch — future sessions LOAD it, not rebuild).
PowerShell HttpListener :8790 → :8791 (JS change); auth stub uid `d0tester`; the
`__praxis_seed__` workspace **self-seeds on a fresh origin** (5 books / 1 arc / 4 sub-theories /
16 notes / 1 artifact) — no injection needed. In-memory re-owning only; NEVER `sv('praxis_state')`.
IO/rAF don't fire; screenshots proven dead; DOM geometry is the evidence.

**Commit model:** per-stage LOCAL commits, `--no-verify` (source without a sw.js bump trips the
hook; the bump is the final commit, hook-armed). NOTHING pushed — Preston's exact words.

---

## THE BATCH — 2, and that is the complete remainder

Of the 15 chips reading `stretched`, artifact + yumi-sees are the **only live, non-exempt,
unshipped page surfaces left**. Full derivation in `dw-4-recon.md` §2. The load-bearing exclusions,
each verified against the ledger rather than assumed:

- **arc-detail → EXEMPT.** The prompt's exempt set names "Connections" without naming a surface;
  `sequence.md:387` maps "Connections → **R10**", and R10's own entry (`:433-437`) declares
  **`touches: [arcs, arc-detail]`**. Round-owned.
- **book-marks → DEAD ROUTE.** R7 retired it; `views.js:520-528` redirects to `#book/<id>`.
- **account → DEAD ROUTE.** Merged → `#profile`; `views.js:645` `location.replace('#profile')`.
- **yumi-panel · import-capture · spotlight → not page-surfaces** (`route: "overlay"`). D1 governs
  a *primary page-surface*; a modal's right form is a contained dialog. Resolving their chips is a
  **ledger-exemption decision**, not composition work — named, not taken.

**Ranking @1920 (reproduce-first; prior rankings not trusted): artifact 37.5% occ — the worst D1
in the wave, below DW-3's book-detail at 42.9% > yumi-sees 56.7% occ, but the worst D2 in the wave
at 138.3ch — above D0's own reference violation (Arcs, 137ch).** Both fail D1 AND D2. Both taken.

---

## STAGE 1 — ARTIFACT (editorial spread) — `6554e9a` — self-verified PASS

**Baseline:** a fixed 720px centered column at every width ≥760. **No `min-width` rule of any kind
existed on this surface** — the base rules were also the desktop layout, unmediated 760→2560.
`.artifact-body` had no cap. A width, never a measure.

**Edit:** `+41` components.css (one `@media (min-width:1200px)` block) `+9` views.js (one modifier
line). Title + substrate pointer form a left orientation margin (470px); the essay holds a book
measure in the right column (618px = 72ch). Both are EXISTING elements re-placed — no new data, no
copy change. Mirrors the sub-theory Page's own main+margin reading room. Full-amber ground
(`umberGroundDark artifact:1`) untouched — measure is width, not color.

| width | cw | occ | title | body | body ch | sideBySide | hScroll |
|---|---|---|---|---|---|---|---|
| 1280 | 1280 | 91.3% | x56 w470 | x606 w618 | **72.0** ✓ | true | **0** ✓ |
| 1440 | 1440 | 81.1% | x136 w470 | x686 w618 | **72.0** ✓ | true | **0** ✓ |
| 1920 | 1920 | **60.8% ✓D1** | x376 w470 | x926 w618 | **72.0 ✓D2** | true | **0 ✓D3** |

- **D1** 37.5% → **60.8%** @1920. PASS. Two genuine regions side-by-side (title/link 376–846 |
  essay 926–1544), not a widened gutter.
- **D2** 83.9ch → **72.0ch** at all three widths. PASS. Cap on the TEXT element (`ch` resolves
  against `.artifact-body`'s own 18px serif, so it tracks the type) — the DW-2 field-lead gotcha.
- **D3** hScroll 0, overflowers 0. **D4** 1/1 pointer. **D5** body 16px unchanged.
- **D6 PASS with no new ring:** the surface's one interactive element
  (`.artifact-substrate-link`) is already covered by the global focus list (`components.css:3891`)
  — `outline:2px solid var(--river); outline-offset:2px`, **tokenized and carrying no
  border-radius**, so it never had the DW-RING-RADIUS defect. Adding a ring would have introduced it.

**MOUNT-SITE RAIL — all five paths gated.** `.artifact-view` roots ALL FIVE (className set at
`views.js:11316`, **before** the `!book` guard). The composition is scoped to a `.artifact-read`
modifier set only where title+body+link are built (`:11381`) — DW-2's own `.home-composed` fix
(`views.js:1510` / `components.css:12729`), verified at HEAD, not recalled.

| path | root class | display | max-width | verdict |
|---|---|---|---|---|
| not-found | `artifact-view` | block | 720px | untouched ✓ |
| empty (signed-in only) | `artifact-view` | block | 720px | untouched ✓ |
| signed-out gate | `artifact-view` (+`.empty-state`) | block | 720px | untouched ✓ |
| **full read, SIGNED-OUT** (seed bypass) | `artifact-view artifact-read` | **grid 470/618** | — | composes, 72.0ch, occ 60.8% ✓ |
| full read, signed-in | `artifact-view artifact-read` | grid 470/618 | — | composes ✓ |

**Guard bands — 390 + 1024, provably inert.** `mq1200:false`; computed WITH the modifier reads
base throughout (`display:block`, `max-width:720px`, `grid-template-columns:none`; 390 keeps its
`56px 20px` mobile padding). The modifier lands at every width (its CSS does not), so the strict
`djb2` legitimately moves — **`djb2geom` is IDENTICAL with vs without the class, node counts
identical, and the signature delta is exactly 14 chars = `" artifact-read"`.** Nothing moved.

---

## STAGE 2 — WHAT YUMI SEES (ledger + framing rail) — `d555114` — self-verified PASS

**Baseline:** a fixed 1080px column, no `min-width` rule, and **not one `ch` cap on any of its six
prose selectors**. `.transparency-panel` (`:3136`) declares **no max-width at all** — every measure
it had was inherited.

**Edit:** `+53` components.css (one ≥1200 block, 8 rules). The ledger and its explanation stop
being one stack: the 7 sections become the main column at a real measure (719px); the framing —
what this page IS, and the privacy promise — becomes a right margin apparatus (380px) that stays
beside the ledger instead of being scrolled past. Column math derived, not picked: 720 main + 60
gap + 380 rail + 48 panel padding = **1208**. The builder's DOM is untouched.

| width | cw | panel occ | ledger | rail | framing ch | sideBySide | hScroll |
|---|---|---|---|---|---|---|---|
| 1280 | 1265 | 94.9% | x57 w711 | x828 w380 | **51** ✓ | true | **0** ✓ |
| 1440 | 1425 | 84.8% | x133 w719 | x912 w380 | **51** ✓ | true | **0** ✓ |
| 1920 | 1905 | **63.4% ✓D1** | x373 w719 | x1152 w380 | **51 ✓D2** | true | **0 ✓D3** |

- **D1** 56.7% → **63.4%** @1920. PASS. **Honesty note:** the baseline's leaf span was set by
  `.yumi-sees-closing` — a one-line, `text-align:center`, full-width box whose *rect* is 1080 but
  whose ink is ~56 chars (the D0 envelope artifact). After the composition the **naive leaf-span
  and the panel span AGREE (63.4 / 63.4)** — the artifact is neutralised, not hidden behind a
  number that a page-widen would have inflated mechanically.
- **D2** every prose block ≤72ch: framing **138.3 → 51ch** · section-body **72.0** · entry/artifact
  body **68.5**. PASS. Caps on the TEXT elements so each reads against its own font (17px serif
  framing vs 14px body ledger).
- **D3** hScroll 0, overflowers 0. **D5** body 16px unchanged.
- **D4/D6 — vacuous, reported as such:** the surface owns **ZERO interactive elements** (`pointer`
  0/0; the Close button is panel-only). Nothing to hover, nothing to ring; the global nav ring
  covers the way out.
- **Signed-out:** composes identically (grid, 7 sections, 51ch, hScroll 0).

**MOUNT-SITE RAIL — one builder, THREE mounts, all driven live.** `buildTransparencyContent`
(`views.js:14562`) feeds the page, the Notebook inline panel (`:14535`), and the Yumi slide-over
overlay (`yumi-ui.js:1128`) — **the third is not named in the builder's own doc comment**, which
claims two consumers. Only the page wraps in `.yumi-sees-page`. Every one of the block's 8 rules
carries that scope (audited); both overlays verified UNCHANGED:

| mount | wrapper | display | grid-cols | section-body max-w | verdict |
|---|---|---|---|---|---|
| routed page | `.yumi-sees-page` | **grid** | 718.667px 380px | 72ch | composed ✓ |
| Notebook panel (`#notebook-transparency-host`) | none | **block** | none | **none** | unchanged ✓ |
| Yumi overlay (`.yumi-panel-sight-view`) | none | **block** | none | **none** | unchanged ✓ |

**Guard bands — 390 + 1024, provably inert.** `rig.proveInert`: deleting the whole 8-rule block
from the live CSSOM changes the fingerprint by **ZERO bits** at both widths. Computed ≤1199 reads
base throughout (page 1080px, panel `display:block`, framing margin `0 0 24px`, every cap `none`,
mobile padding `28px 18px 60px` intact).

**D2-EXEMPT, recorded not hidden:** `.transparency-entry-meta` / `-artifact-meta` run **99.4ch** —
an 11px mono single-line caption, not a prose block (DW-3's display-heading exemption; D0's
Shelf-legend treatment). **This composition improved them 150.9ch → 99.4ch as a side effect.**
Capping a caption to 72ch would force a two-line wrap on a row designed as one — a design change
with no felt pass behind it, so it is named for Preston, not taken.

---

## RIDER 1 — DW-RING-RADIUS — `f6b710f` — PASS (the ledger's premise was WRONG)

**VERIFY-PRECEDENT RAIL.** `cross-cutting.md:67` claims the ring literal is "reused **verbatim**
across **every** DW `@media(min-width:1200px)` D6 block". Checked against the CSS: **false.**
Three literals across six blocks — DW-1 About `var(--gold)`/2px/**4px** · DW-3+STP2
`rgba(255,206,74,.5)`/2px/**6px** · DW-2 Home `var(--gold)`/**3px**/**8px** and Notebook
`var(--gold)`/2px/**8px**. So the rider's literal wording ("remove the `border-radius:6px`
declaration") named only **3 of the 6 blocks**. Its related claim that the literal "is a raw
`rgba()` rather than a token" is likewise true only of DW-3/STP2 — A/E/F already use `var(--gold)`.

**DECISION — execute the rider's INTENT across all six, not its literal "6px".** Its stated reason
("it is **not part of a ring**"; "outline already follows border-radius") is **value-independent**,
and its SCOPE is explicit and covers them: "EVERY DW focus-ring block (**DW-1/2/3 + STP2**)".
Leaving 4px/8px would have left **7 of the 19 deformations** live under a different number.

**Census — 34 selectors, base radii resolved through the token layer (`--lum-r-pill:999px`
`lumen-amber.css:58` · `--lum-r-card:16px` `:57` · `--radius-pill:999px` `theme.css:309`; each
defined once in `:root`, no scoped re-point): 19 of 34 deformed** — per block **A 0/1 · B 6/8 ·
C 3/8 · D 3/8 · E 3/4 · F 4/5**, i.e. in **all five blocks that have pills**. `.vr-add` was the
trap: its base 999px (`:13685`) is LATER in the file than both rings, so source order says "base
wins" and specificity says the rings win — they did.

**LIVE PROOF — this closes the ledger's own VISUAL-GATE objection** ("a CSSOM match-test … can
never see that the pill deformed"). **`:focus-visible` IS readable.** `el.focus()` does not match
it; `el.focus({focusVisible:true})` does not either (the option is *accepted*, which makes it look
like it worked — the trap); but **ONE real Tab keypress through the pane's `computer` tool flips
the interaction modality to keyboard, AND IT PERSISTS** — every later programmatic `.focus()` then
matches. With the modality armed:

- **DEFECT REPRODUCED LIVE:** re-injecting the old declaration via `insertRule` drove
  `.bk-actionbtn` **999px → 6px** while genuinely `:focus-visible`. Not theoretical.
- **FIX PROVEN:** removing it restores **999px**.
- **SWEPT (`rig.ringProbe`, every row `fv:true`):** book-detail `bk-actionbtn` · `rs-opt` ×3 ·
  `bk-moved` · `vr-add` · `bk-edit-toggle` → **999px** · Home `seg-opt` → **999px** · Notebook
  `nb-tab` · `seg-opt` · `nb-mode` · `btn-primary` → **999px** · sub-theory Page `st-pill-publish`
  (*the rider's cited primary*) · `st-edit-door` · `vr-add` → **999px** (composed path reached by
  re-owning a seed sub-theory in memory) · sub-theory Build `stb-pubpill` · `stb-focus-toggle` ·
  `stb-weave` → **999px** · About `.mtog` → **999px**. Square-base controls (`st-tb-back`,
  `st-conn-add`, `stb-delete`, `home-gl-link`, `about-spine-link`) read **0px** — square outlines
  matching their real shape, which is what outline-follows-border-radius is for. Outlines intact
  (2px; colours and offsets unchanged).

`+8 −6` (6 declarations + one marker comment). Gap **CLOSED** in `cross-cutting.md` with the
premise correction recorded. `rig.ringProbe` is committed so no future ring gate settles for a
match-test. **NOT taken, split out as `DW-RING-TOKEN` (carried):** re-colouring DW-3/STP2's raw
`rgba()` to a token — the rider authorised removing the radius; recolouring three shipped
surfaces' rings is a visible change with no felt pass behind it.

## RIDER 2 — DW-STP2-SEED — `de6c13b` — PASS

Seed/signed-out read was full-bleed: **132.6ch @1280 · 149.3ch @1440 · ~199.7ch @1920**, x=0 edge
to edge. Cause (structural, new): `.st-page.lum-amber-deep` is itself `max-width:none`; only
`> .st-topbar` and `> .st-grid` get the 1180 column (`:11096`) and the seed branch builds neither.

**Two things the evidence forced:**

1. **`.st-page.lum-amber-deep` PAINTS THE GROUND** — its own radial-gradient, plus `width:100%` /
   `max-width:none` / `min-height:100vh`. Centring the PAGE would have shrunk the deep-warm amber
   ground to a 747px strip and gutted CLAUDE.md §7. The column goes to its direct CHILDREN.
2. **Capping the prose alone reproduces DW-STP2's own red-team BLOCK in miniature** — a 687px
   column stranded at x=0 under a still-full-bleed header. Centring machinery first, measure second
   — which is what the rider asks ("a MINIMAL reading composition … **centred** prose ~72ch").

**Result @1440:** column 747 centred (x=339) · prose **72.0ch** (was 149.3) · header **shares the
column** (nothing stranded) · back-link text lands **exactly** on the column edge (369 == 369) ·
**click target stays its text (54px)** — `inline-block` + a calc'd margin, not a block with auto
margins that would become a 747px strip navigating away on a stray click · ground intact ·
hScroll 0.

**Both-path + signed-out:** signed-out seed composes identically (747 / 72.0ch / ground intact, no
user). **Composed path UNREACHED** — `myRuleReachesIt:false`, readonly `max-width:none` (my 747
absent), back-link `margin-left:0` (my calc absent); its prose still 72.0ch via the pre-existing
`.st-grid` cap. Signed-out-prompt path holds `.empty-state`, never `.subtheory-readonly` → inert.
The discriminator is **DEPTH, not class** (both roots are exactly `'st-page lum-amber-deep'`) —
mutually exclusive **by construction**.

**Guard bands:** `rig.proveInert` — 0-bit delta at 390 and 1024; computed ≤1199 reads base
(`max-width:none`, `padding:0`, `display:inline`, `margin:0`). `+41`, added INSIDE the existing
DW-STP2 block so the rule-block count is unchanged. **CARRIED:** the 760-1199 band still reads
**105.7ch @1024** — outside the ≥1200 tier by the hard rail, same class as DW-3's ON-7 residual.

---

## THE GATES FOUND A REAL DEFECT — red-team BLOCK, fixed, and the lesson is the gate itself

**`fix-red-team` → BLOCK (upheld, reproduced, fixed). `praxis-reviewer` → HOLD (doc truth only;
every engineering gate CLEAR).** Both are recorded here in full because the block is the most
useful thing this batch produced.

### BLOCK — the framing rail punched a 270px hole in the ledger. Every ≥1200 width. The page's ONLY state.

The first cut wrote `.yumi-sees-page .transparency-framing{ grid-column:2; grid-row:2; }`.
`grid-row:2` pins the 380px rail into the **same implicit row track** auto-placement hands the
**first** ledger section. The track sizes to `max(section-1 52px, rail 306px)`, and
`align-items:start` leaves the difference as a void before section 2.

**Reproduced live before acting on the report** (`rig.hollow`, 1920, real app, real data):

| | section gaps | panel height | verdict |
|---|---|---|---|
| narrow (base, ≤1199) | `[16,16,16,16,16,16]` | **1155** | the thing to beat |
| composed — FIRST CUT | **`[270,`**`16,16,16,16,16]` | **1297** | **142px TALLER than narrow → D5 FAIL** |
| composed — FIXED | `[16,16,16,16,16,16]` | **1043** | **112px SHORTER at ~1.8× the width → D5 PASS** |

**This was not a degenerate corner — it was the page's only state.** The router (`views.js:676-683`)
nulls the pointers before render, so section 1 is *permanently* the ~52px "no book is open" box.
The hole was there for every visitor, every width, signed in or out.

**Fix:** `grid-row:2 / span 7` — the rail spans the section rows instead of inflating the first, so
each row sizes to its own section again. **`span 7`, deliberately not `2 / -1`:** with no
`grid-template-rows` there is no explicit row line `-1` to resolve against and the span would
invert. 7 is the builder's structurally fixed section count (`views.js:14612-14721`), not a
data-dependent guess; an eighth section would simply sit below the rail's span — it degrades, it
cannot re-open the hole.

**Why my gate could not see it, which is the real finding.** Every metric I recorded —
occupancy, ch, `sideBySide`, hScroll, overflowers — is **horizontal**. A vertical void is invisible
to all of them. Worse: **my own Stage-0 recon predicted this exact risk** (`dw-4-recon.md` §5: "A
composition here must not give permanently-empty boxes equal weight (D5: 'a composed layout must
not read sparser than the narrow one')") and the gate I then built had no instrument for it. And
I wrote off D5 as "vacuous" on the grounds that the surface owns no interactive elements — that is
**D4's** rationale; D5's second clause is a claim about density and was never tested. DW-2 tracked
`intra-card hollow 40.7%→1.8%` as a first-class D1 sub-metric (`home.md:110`); DW-4 dropped it.
**Remedy shipped, not just noted:** `rig.hollow()` is now in the committed rig — it returns the
per-gap series, flags any gap >3× the median, and its header says why it exists. D1 has a vertical
half; measure it.

### Also fixed — an overprint this composition introduced (red-team finding 2)

Narrowing the title column 720→470 opened a window (~26-38 chars in this face) where an unbroken
token fits the old column but not the new one — and `.artifact-title` declares no wrap, so the ink
painted **straight over the essay**. Invisible to D3: the box stays 470, so `scrollWidth` never
moves and `overflowers` reads 0. Verified and fixed with `overflow-wrap:anywhere` **inside the
≥1200 block** (so ≤1199 is untouched — confirmed `overflow-wrap:normal` at 390/1024):

| token | before | after |
|---|---|---|
| 29 chars | title `scrollW 641` vs box 470 → **overprints the essay** (body x=686) | `scrollW 470`, no overprint |
| 107 chars | h-scroll **194** | h-scroll **0** |
| real 48-char title | fine | fine |

**I own this one**: my stage opened the window, so my stage closes it. The *base* column's
long-token h-scroll (418px at 720, worse than my 194) is **pre-existing and untouched** —
named `DW-ARTIFACT-WRAP` below. Measured both to tell them apart rather than claiming the win.

### Reviewer HOLD — doc truth, resolved

Both items were real and are addressed: (1) `dw-4.md` said the rig was "committed this batch" while
it was still gitignored at `1123772` — true of the batch, false at that commit; the rig landed at
**`46701a3`** with the `!.claude/rig/` negation and is now named by hash wherever claimed.
(2) The Builder regen was outstanding — it is the **last act before the bump** by the regen law, and
runs after these verdicts are folded, which is exactly now. The reviewer's non-blocking residual
(working-tree-only CRLF→LF on 6 files) is confirmed immaterial: it re-materialises as CRLF on a
fresh checkout and every committed blob is CR=0 — CLAUDE.md's own documented caveat.

**Every other gate came back CLEAR and independently reproduced**, including the two claims I most
wanted attacked: the `>` child-combinator mutual-exclusivity (exhaustive — no branch makes
`.subtheory-readonly` or `.st-tb-back` a direct child on the composed path) and the
`calc((100% − 747px)/2 + 30px)` margin (alignment delta **0.0** at 1280/1920/2560; cannot go
negative because `.st-page` is `width:100%` with zero horizontal padding).

## WHERE TO LOOK AT THE FELT PASS — the two taste questions the gates cannot answer

Both chips are under-claimed `composed` on purpose. The gates prove geometry; they cannot prove
this is *right*. Two specific places to point your eyes, stated plainly rather than buried:

1. **The artifact's left margin is deliberately quiet, and D5 is arguable.** At 1920 the title
   block runs y=189→327 and the link sits at y=357, while the essay runs y=189→770 — so roughly
   390px of the 470px margin is empty below the link. That is the classic editorial spread (and
   the reason the margin is 470: it is what makes D1 clear 60% honestly at 1920). But D5 says "a
   composed layout must not read sparser than the narrow one", and the old 720px stack had no dead
   margin at all. **I judged the spread better than a governed column and took it — that judgement
   is the thing to overrule if it reads thin.** The fallback is on the record: D1's own exemption
   clause ("a ledger-recorded exemption naming why a governed single column is the right form"),
   which DW-3 already used for the workshop's Focus Mode. Say the word and artifact becomes a
   governed 72ch reading column with the exemption recorded instead.
2. **Whether the artifact's title belongs away from its essay at all.** Splitting a finished
   room's display title into a margin is a real change to a reading room's form. It uses only
   existing elements and no copy changed, but it is the batch's most opinionated move.

yumi-sees is the safer of the two: the framing rail is explanatory chrome moving out of the
ledger's way, and the ledger keeps its own reading order.

## CENSUS — proven, not asserted

| metric | origin/main `082b29c` | now | delta |
|---|---|---|---|
| chips total | 23 | 23 | 0 |
| `composed` | 7 | **9** | **+2 = batch size** ✓ |
| `native` | 1 | 1 | 0 (riders change no chips) ✓ |
| `stretched` | 15 | 13 | −2 ✓ |
| rr-rows | 6 | **8** | **+2 = batch size** ✓ |
| `@media(min-width:1200px)` rule-blocks | 9 | 11 | +2 (one per stage; rider 2 added rules INSIDE the existing DW-STP2 block) |

rr-rows counted by `grep -h "^## Round record" docs/studio/*.md | wc -l` at both trees. Both riders
close via **gap-ledger close records** (`cross-cutting.md`, `subtheory-page.md`), not Round records
— riders close gaps, not rounds.

## RIG — extracted to `.claude/rig/` and committed (rig-efficiency law)

`serve.ps1` · `seed.js` (SW-kill + force-settle + `praxis_user` stub + **`rigIds()`**) ·
`measure.js` (`window.rig`). Facts written into the harness so no one relearns them:

- **"FRESH PORT" IS A LIE — cost this batch a confused gate.** A port unused *this session* is not
  a fresh origin: the pane's profile persists, and a SW registered by an EARLIER session survives
  there with its caches. :8791 was claimed by a **`praxis-v3.206`** SW that served a STALE
  `views.js` — the edit was on disk and `curl` proved the server served it, while the browser ran
  the old one. **The cache NAME is the tell.** Rule: on every port, unregister + clear caches,
  reload, and **assert your edit is live** (`String(fn).indexOf('<token>')`, or `rig.rings`) before
  measuring. A gate measured on unverified bytes is fiction.
- **Seed ids are PER-ORIGIN** — the seeder mints them from `Date.now()+random`, so each port
  re-seeds with different ids. A hardcoded id silently renders the not-found path. Use `rigIds()`.
- **Why the cache-bust works** (read from `sw.js`, not folklore): `sw.js:98` calls
  `clients.claim()` and `index.html:123` re-registers every load — you cannot turn the SW off. It
  does not matter: its fetch handler is cache-first via `caches.match(request)`, and
  **`ignoreSearch` defaults to false**, so `?v=<rand>` misses and hits the network.
- **`rig.proveInert(token)`** — the guard-band instrument. Cross-load hashes are polluted by async
  cover loads (DW-3) and by **dpr differing per pane** (this batch: baseline dpr 1.0 vs 1.5 moved
  sub-pixel rects while nothing moved). Instead delete your own block from the live CSSOM and
  re-fingerprint **within one load**: 0-bit delta = provably inert, nothing to argue about.
- **`rig.ringProbe`** + the real-Tab modality trick (above) — `:focus-visible` is readable.
- **`fingerprint()` returns `djb2` AND `djb2geom`** — a JS modifier class lands at every width, so
  the strict hash moves while geometry does not. Report both; say which moved and why.
- The rig loads itself from the server (`<script src="/.claude/rig/…">`) — no 15KB paste per reload.

## Named, not fixed (pre-existing drift outside this batch)

- **`renderArtifactCard` is DEAD CODE** — `views.js:14293`, **zero call sites** repo-wide; its 9 CSS
  rules style DOM never built. **`.book-detail-artifact-card` / `-body` are DEAD CSS** — zero
  emitters, so §4-I's mobile reorder `{order:6}` (`:5430`) is a **silent no-op**. Three generations
  of artifact-card CSS coexist; two are dead. Overnight-bucket (single-surface, revert-safe).
- **`#yumi-sees` can never show a current book / arc / sub-theory** — the router (`views.js:676-683`)
  nulls all three pointers before render. 3 of 7 sections structurally always-empty. Product gap.
- **The transparency panel runs at 1080 (page) vs 1180 (Notebook) vs ~333 (overlay)** from ONE
  builder; `.notebook`'s mobile padding (`:5447`) is dead (later base rule `:9661` wins at equal
  specificity). The Notebook mount's framing prose measures **169.6ch** — untouched here (round-owned).
- **`DW-BOARD-BACKFILL`** — BOARD.md records only DW-1; **DW-2, DW-3 and DW-STP2 never updated their
  rows** despite the file's binding maintenance rule. DW-4 added rows 7 · 13 and did not backfill the
  other five — that evidence belongs to the batches that measured it.
- **Overlay + dead-route chips** (yumi-panel · import-capture · spotlight · book-marks · account) can
  never be "composed": they need a **ledger-recorded D1 exemption decision**. This is why DW's "0
  stretched" exit criterion **cannot be met by composition alone** — a program-level call for Preston.
- **ULTRAWIDE SAG (2560/3840) — carried, matching both predecessors.** DW-2 and DW-3 each ran an
  explicit 2560 probe and named this; DW-4's first draft did not, and the red-team was right to call
  it. Measured: **structural hold, hScroll 0, no metaphor break, measures held (72ch / 51ch), rails
  and columns intact** at 2560 AND 3840 — but both surfaces' fixed caps decay past 1920: yumi-sees
  panel stays 1208 → **47.5% @2560 · ~31.5% @3840**; artifact stays 1168 → **45.6% @2560 · ~32% @3840**.
  D1 checks at 1920, so this is an inherited residual of the whole wave's fixed-cap approach, not a
  DW-4 gate failure. The seed sub-theory column also holds at 2560 (747 centred, 72ch, ground
  full-bleed, aligned).
- **`DW-ARTIFACT-WRAP`** — `.artifact-title` declares no `overflow-wrap` in its BASE rule, so an
  unbroken token h-scrolls the un-composed column (measured **418px** at 720 vs my composed tier's
  **194→0**). DW-4 fixed only the window its own ≥1200 composition opened; the base defect predates
  it and lives at ≤1199, where the ≥1200-only hard rail forbids reaching. Overnight-eligible
  (one declaration, single surface, revert-safe).
- **`.claude/rig/` is served on the deploy — flagged for Preston.** There is no `netlify.toml`, so
  the publish root is the repo root and `.claude/rig/seed.js` becomes a public path. It is **inert**
  (nothing references or loads it; it cannot self-execute, and its only effect is writing a fake
  `praxis_user` into the *loader's own* localStorage), and `.claude/agents/*.md` already sets the
  tracked-under-`.claude` precedent — but seed.js is the **first executable JS** tracked there, and
  it is auth-shaped. Not a vulnerability; a judgement call. If you'd rather it never ship, the fix
  is a `netlify.toml` publish dir or moving the rig to `tools/rig/` — say which and it moves.
- `DW-RING-TOKEN` (rider-1 split) · `DW-STP2-SEED` 760-1199 band residual (105.7ch @1024).
- Frontmatter line refs corrected as ride-alongs: `artifact.md` 10939→**11310**, `yumi-sees.md`
  14128→**14733**, and both surfaces' `umberGroundDark` ref 373→**397**.

---

## THE COMMIT CHAIN — 9, all local

| # | commit | what |
|---|---|---|
| 1 | `6554e9a` | Stage 1 — artifact editorial spread |
| 2 | `d555114` | Stage 2 — yumi-sees ledger + framing rail |
| 3 | `f6b710f` | Rider 1 — DW-RING-RADIUS (all six DW blocks) |
| 4 | `de6c13b` | Rider 2 — DW-STP2-SEED (centred seed read) |
| 5 | `1123772` | docs — chips · Round records · BOARD rows · sequence re-plan |
| 6 | `46701a3` | rig — `.claude/rig/` tracked (+ the `!.claude/rig/` negation) |
| 7 | `3311160` | **fix cycle — red-team BLOCK upheld** (the 270px hole + the overprint) |
| 8 | `13425d3` | Round records — fold in the BLOCK and the overprint |
| 9 | `0b49c19` | **ship — Builder regen + cache bump v3.208** (hook-armed) |

Expected push state: `HEAD == origin/main + 9`, then live sw.js ×2 == repo at **v3.208**.
`git status` clean (tracked); em-dash intact in every subject; untouchables (`state.js`,
`integrations.js`, `index.html`, `firestore.rules`, `netlify/**`) all UNTOUCHED; `sw.js` touched
only by the final commit, exactly one line.

*NOTHING pushed — awaiting Preston's exact words. The felt pass decides `native`.*
