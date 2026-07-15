# DW-4 Stage 0 recon — Desktop Wave batch 4 (artifact + what-Yumi-sees) + 2 ruled riders

Standing delegation (Preston, 2026-07-14): every fork and judgment item ruled at my own
recommendation; no mockup; no mid-run halt. Chips under-claimed (`composed`; the deployed
felt pass decides `native`). Every decision + its evidence is recorded here and in the
Round Records.

## Stage 0 gates — ALL PASS

| gate | evidence |
|---|---|
| HEAD == origin/main | `082b29ca448e250f1c34b8a86d9ed6cd1e9854e3` both |
| tree clean (tracked) | `git status --porcelain -uno` → empty |
| live sw.js ×2 == repo | live `praxis-v3.207` ×2 (two cache-busted reads) == repo `sw.js:10` |
| no other session shipping | live == repo == HEAD |

## 1. Chip census — from doc frontmatter, never builder.html (regen law)

23 chips = 22 `$SURFACES` (`tools/studio-build:27`) + 1 `$LAYERS` (`cross-cutting`).
Only 8 surface docs carry an explicit `desktop:` key; the rest default to `stretched`
per chip law ("All surfaces default to stretched").

Explicit: about · arcs · book-detail · home · notebook · subtheory-build · subtheory-page
= `composed` (7) · profile = `native` (1). **15 chips read `stretched`.**

## 2. Candidate derivation — every stretched chip, with its disposition

| surface | disposition | evidence |
|---|---|---|
| books (Shelf) | EXEMPT — round-owned | `sequence.md:387` "Shelf → **R-SHELF**"; `r-shelf-brief.md` + mockup in flight |
| onboarding | EXEMPT — round-owned | `sequence.md:387` "Onboarding → its round" |
| commons, reader | EXEMPT — round-owned | `sequence.md:387` "commons + reader → **R11**" |
| **arc-detail** | **EXEMPT — round-owned (Connections)** | `sequence.md:387` "Connections → **R10**"; R10's own entry `sequence.md:433-437` declares **`touches: [arcs, arc-detail]`**. Prompt's exempt set names "Connections" without naming a surface; this is the ledger link. Per the rail "when unsure, treat as round-owned". |
| walk, search | EXEMPT — rig-gapped | tracked DW-WALK-FIX / DW-SEARCH-FIX |
| **book-marks** | **DEAD ROUTE — cannot compose** | R7 retired it. `views.js:520-528` router redirects `#book/<id>/marks` → `location.replace('#book/'+id)`; `views.js:8683-8691` the render path is gone. Renders nothing to compose. |
| **account** | **DEAD ROUTE — cannot compose** | merged → `#profile` (R9a, v3.198); `views.js:645` `location.replace('#profile')`. Frontmatter: "state: MERGED → #profile". |
| yumi-panel, import-capture, spotlight | NOT page-surfaces | `route: "overlay"` in frontmatter. D1 governs "a primary **page-surface**". A modal's right form is a contained dialog; resolving their chips is a **ledger-exemption decision**, not composition work — named below, not taken. |
| **artifact** | **SELECTED** | live page surface, `#artifact/<id>` → `renderArtifact` (`views.js:548`→`11310`) |
| **yumi-sees** | **SELECTED** | live page surface, `#yumi-sees` → `renderWhatYumiSeesPage` (`views.js:681`→`14733`) |

**The batch is 2, not 3 — and that is the complete remainder, not a shortcut.** After the
exempt, rig-gapped, dead-route and overlay sets, artifact + yumi-sees are the ONLY live,
non-exempt, unshipped page surfaces left at `stretched`. Both were re-measured
reproduce-first (below); both fail D1 AND D2; both are taken.

## 3. Baseline — live, reproduce-first (rig below). Prior rankings NOT trusted.

**artifact** — `.artifact-view` = a fixed 720px centered column (`components.css:2915-2920`),
`box-sizing: content-box`, padding 96/32. NO `min-width` block of any kind exists for
`.artifact-*` — the base rules ARE the desktop layout, unmediated 760→2560.

| width | cw | occ (leaf span) | prose (`.artifact-body`) | hScroll | body |
|---|---|---|---|---|---|
| 1280 | 1265 | 56.9% | **83.9ch** ✗D2 | 0 ✓ | 16px |
| 1440 | 1425 | 50.5% | **83.9ch** ✗D2 | 0 ✓ | 16px |
| 1920 | 1920 | **37.5%** ✗D1 | **83.9ch** ✗D2 | 0 ✓ | 16px |

**yumi-sees** — `.yumi-sees-page` = a fixed 1080px centered column (`components.css:3341-3345`);
`.transparency-panel` (`:3136`) carries **no max-width at all** — it inherits whatever the
parent hands it. NO `min-width` block anywhere. ZERO `ch` caps on any of its 6 prose selectors.

| width | cw | occ (leaf span) | framing prose | widest leaf | hScroll |
|---|---|---|---|---|---|
| 1280 | 1265 | 85.4% | **138.3ch** ✗D2 | 156.8ch | 0 ✓ |
| 1440 | 1425 | 75.8% | **138.3ch** ✗D2 | 156.8ch | 0 ✓ |
| 1920 | 1905 | **56.7%** ✗D1 | **138.3ch** ✗D2 | 156.8ch | 0 ✓ |

**Ranking by damage @1920: artifact (37.5% occ — the worst D1 measured in the whole DW,
below DW-3's book-detail at 42.9%) > yumi-sees (56.7% occ, but the worst D2 measured in the
whole DW at 138.3ch — above D0's own reference violation, Arcs at 137ch).** Both taken.

**Occupancy honesty note (the D0 "envelope metric artifact", live here):** yumi-sees' leaf
span is set by `.yumi-sees-closing` — a ONE-LINE, `text-align:center`, full-width box. Its
*rect* is 1080px; its *ink* is ~56 chars. So 56.7% overstates the real content span, and any
page-widen mechanically inflates it. Both a naive and an ink-honest occupancy are reported at
the gate; the chip is not claimed on the naive number alone.

## 4. MOUNT-SITE RAIL — every render path, verified in code

**artifact — `.artifact-view` roots ALL FIVE paths.** `wrap.className='artifact-view'` executes
at `views.js:11316`, **before** the `!book` guard at `:11319`. So not-found, signed-out,
empty and full all share the root. A rule on `.artifact-view` hits every one.

| path | condition | signed-out reachable |
|---|---|---|
| not-found | `!book` (`:11319-11330`) | **yes** |
| signed-out gate | `(!user\|\|!user.uid) && !podArt` (`:11346-11349`) → `buildSignedOutPrompt` mounts INSIDE `.artifact-view` | **yes** |
| **full artifact** | `artifact` truthy (`:11374-11390`) | **YES — via the seed bypass** |
| empty | `!artifact` (`:11360-11371`) | **no — provable** |

The **seed bypass is not a distinct DOM path** (a correction to the intuitive reading): a truthy
`podArt` falsifies the `&& !podArt` conjunct at `:11346`, and `:11358` (`if (!artifact && podArt)`)
assigns it — control lands on the full render, byte-identical. So `.artifact-view > h1.artifact-title
+ div.artifact-body + a.artifact-substrate-link` **mounts with NO user**. This is the third
instance of the named pattern (DW-2 Home, DW-STP2 seed) — signed-out is in the gate set.
The empty path is provably signed-in-only: reaching `!artifact` requires `podArt` falsy, which
reduces the gate-false condition to `(user && user.uid)`.

Live-verified seed artifact present: `state.bookArtifacts` = exactly
`__praxis_seed__:book_1784081738748_841783`.

**yumi-sees — ONE builder, THREE mount contexts. This is the bleed site.**
`buildTransparencyContent` (`views.js:14562-14725`) is shared by:

1. the routed page — `section.yumi-sees-page > section.transparency-panel` (`:14738`)
2. the Notebook inline panel — `div#notebook-transparency-host > section.transparency-panel` (`:14535`) — **no `.yumi-sees-page` wrapper**
3. the Yumi slide-over overlay — `div.yumi-panel-sight-view > section.transparency-panel` (`yumi-ui.js:1128-1138`) — **no `.yumi-sees-page` wrapper**; *not even named in the builder's own doc comment*, which claims two consumers

⇒ **every rule this batch writes for yumi-sees MUST be scoped `.yumi-sees-page …`.** A bare
`.transparency-*` rule bleeds into two overlays. The builder's DOM is NOT touched (that would
change all three).

## 5. Findings that change the design (verified, not assumed)

- **The routed `#yumi-sees` page can NEVER show a current book / arc / sub-theory.** The router
  (`views.js:676-683`) nulls `currentBookId`/`currentArcId`/`currentSubTheoryId` *before* calling
  `renderWhatYumiSeesPage()`. So 3 of 7 sections are structurally always-empty on this route;
  signed-out, 2 more are (`assembleContextData` gates summary/turns behind `activeUid`).
  Live: `sectionCount 7 · emptyCount 5`. A composition here must not give permanently-empty
  boxes equal weight (D5: "a composed layout must not read sparser than the narrow one").
  **This is a product gap, not composition — named, not fixed** (no new data, no copy rewrites).
- **The in-Notebook panel runs at a DIFFERENT width than the page** — 1180 (`.notebook` at
  `components.css:9661` wins over the dead `:1255` 1080 rule) vs the page's 1080 — from the same
  builder. Named, not fixed (out of batch).
- **Agent content-box arithmetic was wrong twice; live geometry corrected it.** Both CSS readers
  computed content = `max-width − padding` (a `border-box` assumption). These surfaces are
  `content-box`, so `max-width` IS the content box: artifact prose is **720px/83.9ch** (not the
  estimated 656px), yumi-sees prose **1030px/138.3ch** (not 968px). Reproduce-first earns its keep.

## 6. RIDER 1 — DW-RING-RADIUS: the ledger's premise is WRONG (verify-precedent rail)

`cross-cutting.md:67` states the ring literal `outline:2px solid rgba(255,206,74,.5);
outline-offset:2px; border-radius:6px` is "reused **verbatim** across **every** DW
`@media(min-width:1200px)` D6 block". **Verified against the CSS: false.** There are three
distinct literals across six blocks:

| block | line | color | offset | radius |
|---|---|---|---|---|
| A · DW-1 About `.about-spine-link` | 9531 | `var(--gold)` **token** | 2px | **4px** |
| B · DW-3 Book detail (8 sel) | 11072-11079 | `rgba(255,206,74,.5)` raw | 2px | **6px** |
| C · DW-STP2 Sub-theory page (8 sel) | 11317-11324 | raw | 2px | **6px** |
| D · DW-3 Sub-theory build (8 sel) | 11571-11578 | raw | 2px | **6px** |
| E · DW-2 Home (4 sel) | 12778-12781 | `var(--gold)` **token** | **3px** | **8px** |
| F · DW-2 Notebook (5 sel) | 13016-13020 | `var(--gold)` **token** | 2px | **8px** |

Two corrections follow: (a) the rider's literal text ("remove the `border-radius:6px`
declaration") names only B/C/D — **DW-1's 4px and DW-2's 8px are the same defect and are
missed by the wording**; (b) the ledger's related claim that the literal "is a raw `rgba()`
rather than a token" is true ONLY of B/C/D — **A/E/F already use `var(--gold)`**.

**Deformation census — 34 ring selectors audited, base radius resolved through the token layer
(`--lum-r-pill:999px` `lumen-amber.css:58`; `--lum-r-card:16px` `:57`; `--radius-pill:999px`
`theme.css:309` — each defined once in `:root`, no scoped re-point):**

**19 of 34 rings deform a real painted radius** — a 999px pill squaring to 6px/8px while
keyboard-focused (except `.home-arc-start`, a 16px card → 8px). Per block: **A 0/1 · B 6/8 ·
C 3/8 · D 3/8 · E 3/4 · F 4/5.** The defect reproduces in **all five blocks that have pills**,
not just book-detail. The remaining 15 rings sit on elements with no painted box (no
background/border), where the radius merely rounds the outline's own corners.

`.vr-add` is the trap: its base `999px` (`:13685`) is LATER in the file than both rings
(`:11076` (0,3,0), `:11324` (0,4,0)), so source order says "base wins" and **specificity says
the rings win** — they do. It is also the only class ringed by two blocks.

**DECISION — execute the rider's INTENT across all six blocks (A–F), not its literal "6px".**
Drop the `border-radius` declaration from every DW ring block. Rationale: (1) the rider's own
stated reason — "it is **not part of a ring**"; "browsers already make `outline` follow
`border-radius`, so the declaration buys nothing on a pill and only deforms it" — is
**value-independent**: it condemns 4px and 8px exactly as it condemns 6px; (2) the rider's
SCOPE is explicit and covers them — "EVERY DW focus-ring block (**DW-1/2/3 + STP2**)" — the
"6px" was a misdescription of the literal, not a narrowing of scope; (3) leaving 4px/8px would
leave 7 of the 19 deformations live under a different number and force a second sweep;
(4) letting the outline follow each element's *real* radius is correct by construction — it
needs no pill/non-pill classification to rot. The 15 square-base controls get square outlines
that match their actual shape, which is what outline-follows-border-radius is for.
Tokenizing the raw `rgba()` in B/C/D is a **separate** named gap and is NOT taken here (the
rider says remove the radius; scope stays minimal).

## 7. RIDER 2 — DW-STP2-SEED: confirmed, with a caveat that changes the fix

Verified in code AND live. The seed/signed-out read path builds
`section.st-page.lum-amber-deep` > `a.st-tb-back` + `div.subtheory-readonly` — **`.subtheory-readonly`
is a DIRECT child**, and there is **no `.st-grid`** (live: `hasStGrid:false`,
`roIsDirectChild:true`). The existing DW-STP2 D2 cap is scoped
`.st-page.lum-amber-deep .st-grid .subtheory-readonly-body{max-width:72ch}` (`:11306`) —
so it cannot reach the seed path.

**The real cause (new structural evidence, not in the ledger):** `.st-page.lum-amber-deep` is
itself `max-width:none` (`:11092`); only `> .st-topbar` and `> .st-grid` get the 1180 column
(`:11096`). The seed branch builds neither, so its prose inherits the raw viewport.
**Live: `.subtheory-readonly-body` = 1265px = 132.6ch @1280, x=0→1265 (full bleed, occ 100%).**

**The exact discriminator** is depth, not class: on the seed path `.subtheory-readonly` is a
direct child of `.st-page`; on the composed path it is four levels down
(`.st-page > .st-grid > .st-center > .st-read-hero > .subtheory-readonly`) and can never be a
direct child. `.st-page.lum-amber-deep > .subtheory-readonly > .subtheory-readonly-body` is
therefore **mutually exclusive with `:11306` by construction**, not by cascade luck. Class alone
cannot discriminate (seed root and composed-*published* root are both exactly
`'st-page lum-amber-deep'`; `.stb-warm-dim` marks composed-*draft* only).

**CAVEAT that changes the fix:** a bare `max-width` on the body alone reproduces the original
red-team BLOCK in miniature — the seed path has no centering machinery at all, so a capped body
would strand a narrow column at x=0 while its own `h2.subtheory-readonly-header`,
`ol.subtheory-readonly-evidence` and the sibling `a.st-tb-back` stay full-bleed: a different
undesigned composition, not a fix. **DECISION:** mirror the surface's OWN idiom — extend the
`:11096` centered-column pattern to the seed's direct children, THEN apply the 72ch measure to
the body. That is exactly what the rider asks for ("a MINIMAL reading composition … **centered**
prose capped ~72ch"). Numbers set empirically at the gate, not computed.

## 8. The rig — extracted to `.claude/rig/`, committed with this batch (rig-efficiency law)

`serve.ps1` (one port per session, :8790) · `seed.js` (SW-kill + force-settle + `praxis_user`
stub, uid `d0tester`) · `measure.js` (`window.rig`: D1 `occ` · D2 `ch`/`widestProse` ·
D3 `hscroll`/`overflowers` · D4 `pointer` · D5 `body` · D6 `rings` CSSOM · `fingerprint`
guard-band checksum · `bustCss`). `.gitignore` gains `!.claude/rig/` beside the existing
`!.claude/agents/`.

Rig facts earned/confirmed this session, written into the harness so no one relearns them:
- **The `__praxis_seed__` workspace SELF-SEEDS on a fresh origin** — 5 books, 1 arc, 4
  sub-theories, 16 notebook entries, 1 bookArtifact. No injection needed (D0 re-owned it; not required).
- **Why the cache-bust works (read from `sw.js`, not folklore):** `sw.js:98` calls
  `self.clients.claim()` and `index.html:123` re-registers on every load — you cannot turn the SW
  off. It does not matter: the fetch handler (`:101-123`) is cache-first via
  `caches.match(event.request)`, and **`ignoreSearch` defaults to false**, so `components.css?v=<rand>`
  is a different key, misses, and hits the network. CSS edit → `bustCss()`. JS edit → fresh port.
- The rig loads itself from the server (`<script src="/.claude/rig/…">`) — no 15KB paste per reload.
- Screenshots stay proven-dead here (D0 §2, 30s timeouts); geometry is the evidence.
- IO/rAF do not fire in this pane; `clientWidth` runs ~15px under nominal with a scrollbar.

## 9. Named, not fixed (pre-existing drift outside this batch)

- **`renderArtifactCard` is DEAD CODE** — `views.js:14293`, **zero call sites** repo-wide. Its 9
  CSS rules (`:4767-4832`, `:5228`) style DOM that is never built.
- **`.book-detail-artifact-card` / `.book-detail-artifact-body` are DEAD CSS** — zero emitters.
  Consequence: §4-I's book-detail mobile reorder `.book-detail-artifact-card{order:6}` (`:5430`)
  is a **silent no-op**. Three generations of artifact-card CSS coexist; two are dead. Live is
  `.bd-artifact` / `.bk-artifact-*`.
- **`#yumi-sees` can never show current book/arc/sub-theory** (router nulls the pointers) — product gap.
- **The transparency panel renders at 1080 (page) vs 1180 (Notebook)** from one builder; the
  `.notebook` mobile padding at `:5447` is dead (later base rule `:9661` wins at equal specificity).
- **Overlay chips** (yumi-panel, import-capture, spotlight) + **dead-route chips** (book-marks,
  account) can never be "composed" — they need a **ledger-recorded D1 exemption decision**, which
  is a program-level call, not this batch's. They are why DW's "0 stretched" exit criterion cannot
  be met by composition alone.
- Stale frontmatter line refs corrected as ride-alongs: `artifact.md` `renderArtifact`
  10939→**11310**; `yumi-sees.md` `renderWhatYumiSeesPage` 14128→**14733**.
- `subtheory-page.md:36` / `components.css:11293` cite `views.js:10418` for the seed branch; the
  branch opens at `:10416` and the readonly mount is `:10424` (cosmetic; claim holds).

---
*Stage 0 complete. Proceeding to build without a halt, per the standing delegation.*
