---
name: desktop-recon
kind: recon
date: 2026-07-11
head: 63501cb
mode: read-only (D0 — no app files touched)
viewports: [1280x800, 1440x900, 1920x1080]
rig: local :8760 static-server, stubbed-auth (uid d0tester), 130-book fixture + seed workspace
verification: DOM geometry (getBoundingClientRect / getComputedStyle), console-clean on all surfaces
---

# D0 — Desktop Recon (evidence for the desktop canon)

Read-only evidence pass for a forthcoming **desktop canon** (the sibling of
`praxis-mobile-canon.md`). No application file was edited. Only outputs: this
report + this commit. Numbers are sampled rects, not adjectives; where a claim
rests on judgment (category splits, the failure-class ranking) it says so.

**One-line finding.** Praxis is **desktop-first with no upper composition tier**:
`theme.css` has **0** `@media` rules and the only 5 `min-width:760px` blocks in
`components.css` are nav / rail / toggle / popover chrome — **none is a content-width
or composition tier** — so **every one of the 9 measured surfaces renders a single
fixed-px centered column (640–1220px) whose dead side-gutters grow linearly with the
viewport** (to **412–632px _per side_ at 1920**); the desktop width is never *used*.
One genuine-prose block runs to **137ch**, and **Book Detail carries a 32px horizontal
scroll at every desktop width** (ON-7, confirmed). *(9 measured rows = the 8 canonical
surfaces, counting the prompt's "Profile/Account" as `#account` + `#profile`.)*

---

## STAGE 0 — Pre-flight

| Check | Result |
|---|---|
| `git rev-parse HEAD` | `63501cb201ac4976bf3cd7bba4b46d3e1f724ce4` |
| Modified/staged **tracked** files | **none** (`git status --porcelain` filtered to tracked-change codes ⇒ empty) |
| `git status --porcelain` overall | non-empty — **but 100% pre-existing untracked scratch** (design/, docs/checkpoints/, docs/studio/*, zips), all visible in the session-start snapshot |
| `sw.js` cache version | `var CACHE_VERSION = 'praxis-v3.197';` (line 10) — matches expected |
| Write-test | `docs/studio/desktop-recon.md` created + cat-back OK; file did not pre-exist |

**Porcelain-guard judgment (documented, not carried silently).** The literal guard
says "abort if `git status --porcelain` is non-empty." It is non-empty — but every
entry is an **untracked** (`??`) scratch file that predates this run; there are **zero
modified/staged tracked files**, so the app tree is exactly at HEAD `63501cb`. The
guard's purpose (recon reflects true HEAD; the final commit isn't contaminated) is
satisfied: the commit is **path-explicit** (`git add docs/studio/desktop-recon.md`),
so no scratch is swept. A tree that is dirty *only* with Preston's own known untracked
scratch is a mechanical determination, not an architecture/scope fork — **proceeded**,
with this note. (Had any tracked file been modified, this would have ABORTED.)

Session rituals: `sh tools/ground-truth` ⇒ HEAD 63501cb, hook gate **ARMED**,
FIX-PROTOCOL v1.2 live, 7 agents present. `docs/studio/sequence.md` present.

---

## STAGE 1 — Static census (grep evidence, exact counts)

CSS lives at `assets/theme.css`, `assets/components.css` (+ `assets/lumen-amber.css`,
`docs/studio/universal-depth.css`). All counts below are `grep -c` / `grep -n`.

### 1.1 `@media` rules — theme.css **0**, components.css **80**

`theme.css` contains **zero** `@media` rules — it is pure tokens/base. Of the 80 in
`components.css`, the breakdown by kind:

| Kind | Count | What it is |
|---|---|---|
| `prefers-reduced-motion` | 24 | motion guards, not layout |
| `max-width` step-downs (759 / 720 / 639) | ~46 | the **mobile** collapse tier (desktop-first: base = desktop, these step *down*) |
| **`min-width:760px`** | **5** | the only "desktop-keyed" blocks — enumerated below |
| comment lines matching `@media` | 6 | prose, not rules |

**The 5 `min-width:760px` blocks — NONE set a content-width / composition tier:**

| Line | Selector(s) | Effect | Composition? |
|---|---|---|---|
| 761 | `.app-nav` + `.app-nav-link` | nav pill border/shadow; desktop mono-uppercase links + gold-underline active | **No** — chrome |
| 1985 | `.shelf-layout.shelf-rail-open` | `grid-template-columns:180px 1fr` — reveals the filter **rail** | Partial — a sidebar, **not** a content-width governor |
| 9721 | `.shelf .shelf-filters-btn{display:none}` | hide mobile filter button on desktop | **No** — toggle |
| 11593 | `.shelf.lum-amber-deep .shelf-filters-btn{display:none}` | same, lum variant | **No** — toggle |
| 11831 | `.shelf.lum-amber-deep .shelf-manage` | Manage **popover** positioning (desktop dropdown vs mobile sheet) | **No** — overlay |

⇒ **Hypothesis confirmed at the static layer:** there is **no upper composition tier**.
Desktop composition is entirely the un-mediated base rules; nothing keyed above 760
widens, re-columns, or re-caps a page for large viewports. (CLAUDE.md §3's "the only
`@media (min-width:760px)` block today is the nav pill" is now **5 blocks**, but the
substance holds — all 5 are chrome/toggle/rail, none are content composition.)

### 1.2 `max-width` — theme.css **0**, components.css **168**

All width governance is base-rule `components.css`. Value distribution (top):

```
 14× 1080px      6× 1180px     6× 520px      5× 420px      4× 840px
  4× 680px       4× 56ch       3× 62ch       2× 900px      2× 720px
  2× 620/560/470/430/400/360/240/200px      2× 42ch/60ch
  1× each: 1220 1100 1000 940 820 800 760 640 540 460 380 280 260 220 184 100px
  1× each: 66ch 54ch 46ch 38ch 34ch 22rem 85% 100% calc(100vw-…)
 12× max-width:none  (the .lum-amber-deep roots that then cap `> *`)
```

**Category split (judgment call — by selector + value):**

- **Top-level page/content governors** (the composition spine, base rules):
  `.home-page.lum-amber-deep > *` **1080**, `.shelf.lum-amber-deep > *` **1080**,
  `.arcs.lum-amber-deep > *` **1080**, `.notebook.lum-amber-deep > *` **900**,
  `.st-page.lum-amber-deep > .st-topbar/.st-grid` **1180**,
  `.st-build.lum-amber-deep > .stb-intro/.stb-build` **940** (the shared `.stb-warm-dim`
  panel caps at **1220**, `components.css:11105`),
  `.bk-surface .bk-shell` **840**, `.account.lum-amber-ember > *` **1080**,
  `.op-root` **840**, `.search.lum-amber .search-page` **820**, `.about` **640**.
  Plus the **legacy** single-class twins that still match (`.notebook` 1180,
  `.shelf` 1180, `.arcs` 1080, `.book-detail` 1000, `.st-page` 1100, `.arc-detail`/
  `.arcfield` 1180, `.account` 800, `.artifact-view` 720, `.yumi-sees-page` 1080) —
  most are out-specified by the 2-class `.lum-amber*` rule (drift the code comments
  flag as "rules above go dead with this port").
- **Component/element caps** (the rest, ~130): cards, chips, modals, pickers, thumbs,
  `calc(100vw-…)` sheet caps, and the **ch reading caps** below.

### 1.3 The `ch` reading caps that DO exist (the good news, component-level)

`max-width` in `ch` appears **~20×** — reading-measure IS governed on *some* prose:
`.about .sect` **56ch**, `.about .model` **56ch**, `.read-list` items **62ch**,
`.ic-sub` **42ch**, `.ic-transcript` **38ch**, `.ic-mic-hint` **34ch**, and several
unlabeled 42–66ch blocks. So the vocabulary for a reading measure is already in the
codebase — it is simply **not applied to the main prose of Arcs / Notebook / Sub-theory /
Book-detail**, which fall back on the wide px column (see Stage 2).

### 1.4 `views.js` inline widths — **effectively none**

- `style="…width…"`: **2** hits — both decorative SVG (`views.js:9666` a 100%×100%
  glyph; `views.js:16173` a starfield "speck" px size). Neither is layout.
- `.style.(min|max|)width =`: **2** hits — `views.js:16103` Yumi bloom radius,
  `views.js:16196` a speck. Both decorative.

⇒ No page composition is driven by inline JS width. Governance is 100% CSS base rules.

### 1.5 `:hover` — theme.css **0**, components.css **334**

Hover affordances are broad and present on every surface (baseline for a desktop
canon's hover-reveal pattern). By scope prefix (approx., `grep :hover | prefix`):
`lum 82 · shelf 64 · notebook 50 · bk 47 · st 46 · account 39 · arc 28 · arcfield 27 ·
yumi 26 · home 17 · book 15 · ic 12 · stb 10 · app 10 · subtheory 9 · op 8`. Desktop
does not lack hover states; the canon question is consistency/affordance-legibility,
not absence.

### 1.6 Composition rules above 760px, by surface

**Zero** of the 8 page surfaces has a composition (layout/width) rule keyed above 760px.
The only above-760 layout rule in the whole file is the Shelf filter-**rail** reveal
(`min-width:760`, line 1985) — a sidebar toggle, not a page composition tier.

---

## STAGE 2 — Live measurement (CDP-equivalent via the headless Browser pane)

**Rig.** Local `:8760` static-server; SW unregistered + caches cleared; transitions/
animations force-settled (`* {transition:none!important;animation:none!important}`);
auth stubbed by seeding `praxis_user` (uid `d0tester`, `getCurrentUser()` = `ls('praxis_user')`);
**130-book fixture** injected into `state.books` + `state.userBooks`, the seed
`__praxis_seed__` workspace re-owned to the stub (arc `arc_1783781344391_409468`
hydrated, 4 sub-theories, 16 notebook entries). All 9 measured surfaces rendered
**signed-in and un-gated** → **no `MEASURED-GATED` rows**. **Console: 0 errors on every surface.**
Measurements are CSS px (dpr-independent); **dpr was 1.5** (headless default —
resize_window exposes no deviceScaleFactor; irrelevant to geometry, noted for honesty).
Viewport `clientWidth` runs ~15px under the nominal width when a vertical scrollbar is
present (1280→1265, 1440→1425, 1920→1905); measures use `clientWidth`.

**Screenshots.** The Browser-pane `screenshot` action **timed out (30s) on repeated
attempts** while JS pings returned instantly and console stayed clean — a capture-
pipeline limitation of this headless pane, not a page hang. Per the "screenshot failure
= log and continue" rule, **0 repo screenshots** were produced; DOM geometry + clean
console are the hard evidence (protocol: live-DOM structural proof is the PASS/FAIL
evidence; screenshots corroborate). `docs/studio/desktop-recon-shots/` is intentionally
absent (git tracks no empty dir; nothing to place in it).

### 2.1 Data-state per surface (what content each carried)

| Surface | Route | Data state |
|---|---|---|
| Home | `#home` | fixture (signed-in, 130-book + seed workspace) |
| Shelf | `#books` | **130-book fixture** (5 seed + 125 synthetic) |
| Arcs | `#arcs` | 3 arcs (1 hydrated "Pedagogy of Desire" + 2 light) |
| Notebook | `#notebook` | 16 re-owned seed entries |
| Sub-theory build | `#subtheory/…792571/build` | real seed sub-theory ("Desire as Political Refusal", full prose + 4 evidence) |
| Book Detail | `#book/…319099` | seed book |
| Account | `#account` | fixture (signed-in) |
| About | `#about` | static (no data dependency) |
| Profile (own) | `#profile` | fixture (own-profile) |

### 2.2 Viewport-invariant measures (governor · reading measure · type scale)

The px governors and (column-capped) reading measures **do not change with viewport** —
that is itself the finding. `body` font-size is **16px on every surface**.

| Surface | Content governor (computed) | Widest text block (ch @ px, font) | >75ch? | h1 size |
|---|---|---|---|---|
| Home | root `max-width:none`; `> *` **1080** | `.home-yumi-text` 51.8ch @363px/16px Cormorant | ok | *(no `<h1>`)* |
| Shelf | root none; `> *` **1080** | `.shelf-rootednote` 96.2ch @790px/12px DM Sans *(legend)* | ⚠ | 40px |
| Arcs | root none; `> *` **1080** | **`.arcs-teach` 137ch @1080px/18px Cormorant** *(genuine prose)* | ⚠⚠ | 46px |
| Notebook | root none; `> *` **900** | `.notebook-intro` 71ch @680px/14px DM Sans | ~ok | 30px |
| Sub-theory build | panel **1220**; `> *` **940** | `<p>` 68.1ch @481px/16px Cormorant | ok | 32px |
| Book Detail | `.bk-surface` none → `.bk-shell` **840** | `<p>` lineage 74.8ch @491px/15px Cormorant | ~edge | *(no `<h1>`)* |
| Account | root none; `> *` **1080** | `.portrait-holding` 195.8ch @1072px/12.5px *(placeholder/meta)* | ⚠ | 35px |
| About | `.about` **640** (prose ch-capped 56ch) | `.line` 106.7ch @640px/10px DM Mono *(footer meta)* | ⚠ | 52px |
| Profile | `.op-root` **840** | `.op-conseq-sub` 119.1ch @783px/15px Cormorant *(subtitle)* | ⚠ | *(no `<h1>`)* |

Notes: **Home / Book Detail / Profile render no `<h1>`** (heading semantics observation,
recorded not judged). The flagship reading-measure defect is **Arcs `.arcs-teach` at
137ch** — a real teaching paragraph with no `ch` cap, filling the full 1080 column. The
other >75ch hits are meta/caption/placeholder lines whose small font-size inflates `ch`;
they are ungoverned line-lengths but less about reading comfort. About's **prose body IS
ch-capped (56ch)** — only its footer version-stamp line is wide.

The governor column above is the CSS **cap**; a surface's measured **envelope** (actual
content span) can sit under it — Home fills only **1032** of its 1080 cap. **Account
correction (post red-team, verified live):** Account's content column IS a fixed **1080
centered** block — constant (left 92→412, right 1172→1492 across 1280→1920), exactly like
Shelf/Arcs — **not** the growing envelope the raw automated sweep first implied. That skew
came from a single left-pinned `.op-account-link` breadcrumb sitting at the **32px
root-padding edge**, offset from the centered column; §2.3/§2.4 report Account's true
column gutters and flag the breadcrumb.

### 2.3 Viewport-dependent measures — horizontal scroll + dead-gutter growth

`Gut` = per-side gutter from the content envelope to the viewport edge (the "largest
contiguous empty horizontal band" reported as the representative centered-column dead
space; the raw scanline max, which spikes on sparse footer rows, is larger and noted per
surface in 2.4). `hScroll` = `scrollingElement.scrollWidth − clientWidth`.

| Surface | 1280 (cw1265) Lgut/Rgut · hScroll | 1440 (cw1425) Lgut/Rgut · hScroll | 1920 (cw1905) Lgut/Rgut · hScroll |
|---|---|---|---|
| Home | 116 / 117 · **0** | 196 / 197 · **0** | 436 / 437 · **0** |
| Shelf | 92 / 92 · **0** | 172 / 172 · **0** | 412 / 412 · **0** |
| Arcs | 92 / 93 · **0** | 172 / 173 · **0** | 412 / 413 · **0** |
| Notebook | 182 / 183 · **0** | 262 / 263 · **0** | 502 / 503 · **0** |
| Sub-theory build | 147 / 163 · **0** | 227 / 243 · **0** | 467 / 483 · **0** |
| **Book Detail** | 232 / 193 · **32** | 312 / 273 · **32** | 552 / 513 · **32** |
| Account † | 92 / 93 · **0** | 172 / 173 · **0** | 412 / 413 · **0** |
| About | 312 / 313 · **0** | 392 / 393 · **0** | **632 / 633** · **0** |
| Profile | 212 / 213 · **0** | 300 / 300 · **0** | 540 / 540 · **0** |

**† Account** = the fixed 1080 centered-column gutters (verified live). The raw automated
sweep read **32/93 → 32/413** because a left-pinned `.op-account-link` breadcrumb (x=32)
skewed the leaf-based envelope metric; corrected here — see the Account bullet below.

**Reading of the table:**
- **Every surface's content column is a fixed-px centered block; gutters grow ≈
  Δviewport/2 while the envelope stays constant** (verified for all 9, Account included
  after the breadcrumb correction) — the entire +640px from 1280→1920 is absorbed into
  dead gutters. At 1920, **About wastes 632px on *each* side (66% of the viewport is
  empty)**; Notebook 502px, Profile/Book-detail ~530px, even the widest surfaces
  (Shelf/Arcs/Account/Home) waste ~412–437px/side.
- **Book Detail: `hScroll = 32` at all three widths → ON-7 CONFIRMED at desktop, not
  changed.** Cause: `.bk-surface` (`components.css:10505`) sets `width:100%` +
  `padding:34px 20px 80px` **without `box-sizing:border-box`** — the one surface root that
  omits it (no global box-sizing reset exists; sibling roots `.st-page`/`.notebook`/
  `.shelf` all set it; MW-3 fixed `.bk-surface` **only inside `@media (max-width:759px)`**,
  line 10904). So the root overflows the viewport at every desktop width: root width
  measured **1289 / 1449 / 1929** vs cw 1265 / 1425 / 1905 (a ~24px content-box overshoot;
  the reported `scrollWidth − clientWidth = 32` is the resulting page h-scroll — the exact
  px differ by ~8, unpinned, but the mechanism and the defect are certain).
- **Account = a 1080 centered column (constant) + a misaligned breadcrumb.** Its content
  (hero, values card, portrait placeholder) is the same fixed 1080 centered block as
  Shelf/Arcs (gutters 92/172/412); the `.op-account-link` breadcrumb, however, is pinned
  at the **32px root-padding edge** — left of the centered column — a minor left-alignment
  inconsistency (and the artifact that skewed the raw sweep's Account envelope).
  **Sub-theory build (16px) and Book Detail (~39px, partly the h-scroll shift) carry
  small, constant L/R asymmetries too**; of those only Book Detail's is a defect.

### 2.4 Full surface × viewport × 5-measures (raw, for completeness)

Measures: **[1] widest-text ch** · **[2] governor max-width(px)** · **[3] hScroll(px)** ·
**[4] largest empty band — envelope gutter L/R (px); scanline-max in ⟨⟩** · **[5] body / h1(px)**.
[1],[2],[5] are viewport-invariant (fixed-px governors) → stated once; [3],[4] per width.

| Surface | [1] ch | [2] gov | [5] body/h1 | [3]·[4] @1280 | [3]·[4] @1440 | [3]·[4] @1920 |
|---|---|---|---|---|---|---|
| Home | 51.8 | 1080 | 16 / — | 0 · 116/117 ⟨1067⟩ | 0 · 196/197 ⟨1147⟩ | 0 · 436/437 ⟨1387⟩ |
| Shelf | 96.2 | 1080 | 16 / 40 | 0 · 92/92 ⟨762⟩ | 0 · 172/172 ⟨842⟩ | 0 · 412/412 ⟨1082⟩ |
| Arcs | 137 | 1080 | 16 / 46 | 0 · 92/93 ⟨1085⟩ | 0 · 172/173 ⟨1165⟩ | 0 · 412/413 ⟨1405⟩ |
| Notebook | 71 | 900 | 16 / 30 | 0 · 182/183 ⟨1016⟩ | 0 · 262/263 ⟨1096⟩ | 0 · 502/503 ⟨1336⟩ |
| Sub-theory build | 68.1 | 940/1220 | 16 / 32 | 0 · 147/163 ⟨814⟩ | 0 · 227/243 ⟨894⟩ | 0 · 467/483 ⟨1134⟩ |
| Book Detail | 74.8 | 840 | 16 / — | **32** · 232/193 ⟨922⟩ | **32** · 312/273 ⟨1002⟩ | **32** · 552/513 ⟨1242⟩ |
| Account † | 195.8 | 1080 | 16 / 35 | 0 · 92/93 ⟨93⟩ | 0 · 172/173 ⟨173⟩ | 0 · 412/413 ⟨413⟩ |
| About | 106.7 | 640 | 16 / 52 | 0 · 312/313 ⟨776⟩ | 0 · 392/393 ⟨856⟩ | 0 · 632/633 ⟨1096⟩ |
| Profile | 119.1 | 840 | 16 / — | 0 · 212/213 ⟨655⟩ | 0 · 300/300 ⟨655⟩ | 0 · 540/540 ⟨655⟩ |

*(⟨scanline-max⟩ is the largest single-row empty band; it inflates on sparse footer/
legend rows and is the literal "largest contiguous empty band," but the envelope
gutters are the truer measure of the centered-column dead space. Both reported.)*

### 2.5 Seed hypothesis check — Notebook "stretched spread"

The seed note (Preston's July-11 screenshot: the Notebook spread stretched full-viewport,
no governor) **was NOT reproduced.** At `#notebook` with 16 entries the governor holds:
`.notebook.lum-amber-deep > *` caps at **900px**, envelope width **900** at all three
viewports (gutters 182→502). Possible the screenshot referenced a *book-scoped* notebook
or a transient/full-spread sub-state on a different render path, or predates a fix.
**Recorded as unreproduced in the `#notebook` landing state — needs Preston's screenshot
context to localize; not resolved here.**

---

## STAGE 3 — Failure classes, ranked by evidence weight

The hypothesis proposed 1) no composition tier, 2) reading measure, 3) density/scale.
Letting the numbers rank (breadth × severity × confidence), refined:

**1 — No upper composition tier → unbounded dead gutters. (Universal: 9/9 measured
surfaces.)** theme.css 0 `@media`; the 5 `min-width:760` blocks are all chrome / rail /
toggle / popover — **none a content-width or composition tier** (line 1985 *is* a
`grid-template-columns` layout rule, but it reveals the Shelf filter **rail** and splits
the already-capped 1080 envelope, adding no page width — verified: Shelf envelope stays
1080 / hScroll 0 at all widths). Every surface is a fixed-px centered column in base
rules; the whole +640px from 1280→1920 becomes dead gutter (412–632px **per side** at
1920; About = 66% empty). Minor caveats, none softening the finding: a misaligned
`.op-account-link` breadcrumb on Account; small L/R asymmetry on Sub-theory build / Book
Detail. The desktop width is never *used* — no multi-column, no wider media/rail, no
fluid-with-ceiling. This is the broadest, highest-confidence, most systemic gap and the
natural spine of a desktop canon.

**2 — Reading measure ungoverned on primary prose. (Partial: the vocabulary exists,
the application is uneven.)** Flagship: **Arcs `.arcs-teach` = 137ch** (real prose, no
`ch` cap, full 1080 column). Secondary ungoverned line-lengths on meta/caption/subtitle
(Account 195.8ch, Profile 119ch, About-footer 106.7ch, Shelf-legend 96.2ch). But
`ch`-caps already exist (About body 56ch, read-list 62ch, import-capture 34–42ch), so
this is a *consistency/coverage* defect, not an absence — rank #2, below the universal
composition gap.

**3 — Book Detail horizontal scroll at desktop (ON-7, concrete defect).** 32px h-scroll
at 1280/1440/1920; single-surface but a hard violation of the zero-h-scroll rule and a
clean, reproducible root cause (`.bk-surface` missing `box-sizing`, fixed only ≤759).
High confidence, localized — a discrete bug the desktop pass must fold in.

**4 — Type scale uniform; heading semantics gaps. (Weakest evidence.)** `body` 16px on
all surfaces; h1 30–52px where present; **Home / Book Detail / Profile expose no `<h1>`**.
No clear scale *defect* surfaced at desktop widths — recorded for completeness, lowest
weight.

**Net:** the hypothesis holds with refinements — #1 (composition tier) is confirmed and
universal; #2 (reading measure) is real but *partial* (caps exist, coverage is uneven),
demoting it below #1; the density/scale class ranks last, and a concrete ON-7 desktop
h-scroll defect earns its own rank the hypothesis didn't name.

---

## Residuals / honesty ledger

- **Screenshots: 0 captured** — Browser-pane `screenshot` times out (30s) in this headless
  pane; DOM geometry + 0-error console stand as the evidence (protocol-sanctioned). No
  `desktop-recon-shots/` dir committed.
- **dpr 1.5** (headless default; geometry is CSS-px so unaffected). deviceScaleFactor 1
  not settable via `resize_window`.
- **Notebook "stretched spread" not reproduced** (§2.5) — open, needs screenshot context.
- **Data state:** Shelf on a synthetic 130-book fixture; Arcs/Notebook/Sub-theory/Book-detail
  on the re-owned `__praxis_seed__` workspace; Home/Account/Profile on the signed-in stub;
  About static. No surface was MEASURED-GATED (all rendered signed-in).
- **Category split in §1.2** (page-governor vs component) is a judgment call on selector+value.
- **Legacy vs live governors:** many single-class `.notebook/.shelf/.st-page …` max-widths
  are out-specified by the 2-class `.lum-amber*` rules (the code's own "rules go dead" drift
  notes); the live governor is the `.lum-amber* > *` value — that is what §2 measured.
- **Envelope metric artifact (corrected):** the automated `envelope`/gutter metric spans
  `[leftmost-leaf … rightmost-leaf]`; where a surface has a left-pinned leaf offset from
  its centered column (Account's `.op-account-link` breadcrumb at x=32) the raw gutters are
  skewed. Only Account was materially affected; corrected against the live centered-column
  rects (§2.2–§2.4). Sub-theory build / Book Detail show minor (16–39px) asymmetry within
  tolerance.

**Verification pass (adversarial, before commit).** A 5-agent workflow independently
re-derived every Stage-1 grep count (**all reproduced**: theme 0/0/0; components 80 @media
/ 168 max-width / 334 :hover; exactly 5 `min-width:760` at 761/1985/9721/11593/11831, none
a content-width tier; views.js 2+2 decorative) and red-teamed the report. Findings applied
above: **Account "growing envelope" overclaim corrected** (it is a fixed 1080 centered
column + a misaligned breadcrumb — re-measured live, not the red-team's guessed "responsive
galaxy"); **§1.3 ch-cap selectors corrected** (`.ic-sub`/`.ic-transcript`/`.ic-mic-hint`,
not `.ic-h1`/`.ic-listen-state`/`.ic-mic-label`); **`.bk-surface` line ref → 10505, padding
→ `34px 20px 80px`, ON-7 px reconciliation softened**; **"not layout" → "not a
content-width/composition tier"**; **8-vs-9 surface count reconciled** (9 measured rows = 8
canonical + `#profile`); **`.stb-warm-dim` 1220 attribution corrected**. Core thesis
(#1/#2/#3) survived scrutiny unchanged.

---

*Report length: **388** lines (`wc -l docs/studio/desktop-recon.md`), measured at
commit. Evidence: Stage-1 grep census (independently reproduced) + Stage-2 live DOM
geometry across 3 viewports (console-clean, 0 screenshots — headless capture timed out).
End of D0 desktop recon.*
