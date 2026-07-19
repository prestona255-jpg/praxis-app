# R-POLISH B2 — THE ARC CLUSTER · BUILD

Model: Opus 4.8, default effort (ultracode OFF per Preston) · gate agents Sonnet ·
base HEAD `19cf306` (v3.232) · Stage-0 recon: `docs/checkpoints/r-polish-b2-recon.md`

Stage-0 gates all PASSED (triple match, live sw.js v3.232 ×2, byte-locks exact).
Preston's four rulings received; this file records what they produced.

---

## LANE A — the buildable four

### A1 · RM6 / XL-1 — the desk widens · DONE

The field's width was never designed: 788px, incidental (1080 shell − 48 padding −
220 rail − 24 gap), held from ~1128px through 2560 because **no `@media (min-width)`
rule referenced `.arcfield` at all**. Net-new tier authored at ≥1600.

| Width | shell | field | rail | occupancy | h-scroll |
|---|---|---|---|---|---|
| 1920 | 1560 | **1228** | 260 | **81.9%** | none |
| 2560 | 1560 | **1228** | 260 | **61.3%** | none |

Both clear XL-1's ≥60% floor. The cap deliberately does not keep growing — XL-1 says
compose, never stretch — so 2560 gets the same desk with more room around it.

### A2 · HD-1 — reveal on intent · DONE

Bound once via the `initNavMobileToggle` guard idiom (the nav is static markup, never
re-created per route). Synchronous `pageYOffset` read, matching the two existing
handlers; no rAF (the pane does not fire it).

| Step | actualY | tucked |
|---|---|---|
| top | 0 | **false** (seated) |
| down | 400 | true |
| down | 1200 | true |
| **UP 100 (intent)** | 1100 | **false — revealed** |
| down again | 1160 | true |
| **UP 160** | 1000 | **false — revealed** |
| back to top | 5 | **false** (seated) |

Geometry: tuck = `translateY(-98.67px)`, nav bottom **−6 → fully offscreen**; reveal
restores `top:14`. Transition list resolves
`opacity .35s …, transform .3s cubic-bezier(.22,1,.36,1)` — MO-1's gentle 300ms.

**⌘K:** `openSpotlight` now calls `praxisRevealNav()`. Disclosed: the FOCUS half already
worked and is unchanged — it lands in the spotlight OVERLAY's input, not the nav's static
`.app-nav-search-input`, which is inert by design (clicking it routes to `#search`).
Rebuilding that is search architecture, not this rider.

**<760 unchanged, proven not assumed:** at 390 the nav stays `position:relative`,
`backdrop-filter:none`, and the tuck class is **inert** (`transform:none`) — the transform
is scoped ≥760 precisely because canon §2 forbids transform on an ancestor of the
overflowing mobile menu (the iOS composite bug).

**One real defect caught mid-build:** `components.css:10818`
`.app-nav{transition:opacity …}` sits later at equal specificity and was silently
clobbering the transform transition (measured: computed read `opacity .35s` only). Fixed by
making that rule own BOTH properties rather than fighting it with specificity.

### A3 · L4 / DR-1 — workshop drag choreography · DONE

Measured **settled** (the pane pauses the transition clock — an unsettled read showed
identity and looked like a failure):

| State | transform | shadow |
|---|---|---|
| rest | `none` | `0 10px 22px -16px` |
| dragging | **`matrix(1.03,…)`** | **`0 16px 30px -14px @ .55`** |
| drop | `.rf-settle` applied, then removed | transition `transform .3s cubic-bezier(.34,1.2,.5,1)` = `--ease-emphasis`, which overshoots |

**The origin ghost** (DR-1's "origin slot dims", read onto a slotless surface): appears on
pickup at the pickup point, 150×69, dashed, `matchesCardOrigin:true`; stays put during the
move; removed on drop and on touch-cancel.

`--dur-*`/`--ease-*` reused from the kit, not reinvented. Reduced-motion block added
(verified by CSSOM match — `:media` state is not readable idle in this pane).

**Accepted from the ruling:** "targets brighten on approach" STRUCK (free placement, no
targets). Arc-Field face ships lift + dim only, no overshoot — `onCommit` calls
`renderArcDetail` and tears down the SVG; buying the animation would mean changing commit
flow, which the ruling forbids. Named partial.

### A4 · ASK YUMI chip · DONE

Root cause was **zero container styling**, not a position bug: an inline-styled pill alone
on a `display:block` page above a wide two-column field. Inline styles moved to real CSS;
container added.

**Caught by measuring:** my first fix used `margin:10px 0 4px`, whose shorthand zeroed the
shell's `margin-left/right:auto` — chip measured `x:0` against a shell at `x:172`, i.e. the
exact far-left symptom re-created one layer up. Fixed to `margin:10px auto 4px`; now
`chipAlignedToShell: true`.

Disclosed: it renders on **all three faces**, not only Field. Its uppercase-sentence
treatment is left alone — that is R6/TY-1, a different law's batch.

### A5 · (unplanned) the app-loaded kit · FIXED

R4 in B1-FIX was **incomplete**: there are TWO `praxis-kit.css` files. My sweep covered
`docs/studio/kit/` (the demo); `index.html:21` loads **`assets/praxis-kit.css`** (15,249 B,
a different file), which still carried the retired `#d2a23e`. Re-pointed to `#C79A3A`.

---

## LANE B — the ruled four

### RULING 1 · RD-1 — parchment field + the jewel collapse · DONE

**The field.** `.arcfield.arcfield-warm .arc-detail-web-view` was the sanctioned dark
exception (cognac `#2f1c0e` + feathered vignette). Now parchment: `--card-1` → `--card-2`,
**CARVED** (one inset shadow + hairline, CC-2's grammar applied to a surface), no outward
feather — there is no longer a polarity change at the rim to soften.
Measured live: field ground `rgb(253,249,238)`.

**The collapse, 16 → 5, deterministic and disclosed:** `N → m((N-1) mod 5)+1`

| jewel | slots |
|---|---|
| m1 gold | 1, 6, 11, 16 |
| m2 terracotta | 2, 7, 12 |
| m3 olive | 3, 8, 13 |
| m4 teal | 4, 9, 14 |
| m5 ochre | 5, 10, 15 |

The renderer picks N by id-hash, so an existing sub-theory keeps its N and lands on ONE
fixed jewel — **identities stay stable across the change**, as ruled. Five jewels over
sixteen slots means hue no longer uniquely identifies; **glyph SHAPE carries the remaining
distinction** and the 16-shape `_ST_MARK_TABLE` is untouched. Each jewel gained a companion
`--mN-edge` for the marks' inner strokes. **RE-FROZEN at five** in the same commit, with the
freeze notice at `theme.css:24` updated to record the unfreeze→collapse→re-freeze.

**My own v3.232 comment corrected**, as ruled: it claimed the jewels retire `--field-N`.
Wrong target — `arc-constellation.js` never reads `--field-N` (zero hits). The renderer's
candy was `--subtheory-*`, and that is what these retire.

**A wrong assumption of mine, caught by measuring.** I first collapsed only `:root`,
reasoning the `[data-st-palette]` blocks were opt-in alternates. **They are not:**
`views.js:13777` reads `ls('praxis_constellation_palette', 'colorful')` — **"colorful" is
the shipped default**. After the `:root` edit the field still painted `#C9D67E` chartreuse
and `#E89BB4` rose. The collapse was applied to the `colorful` block too; `muted` is left as
the genuine opt-in.

Verified after: `--subtheory-1/6/11/16` → `#D9B24A`, `-3` → `#7C8B4F`; painted fills are
jewels (terracotta `rgb(199,84,52)`, teal `rgb(62,138,131)`).

**DISCLOSED FOR THE FELT PASS — `--m1` gold as a FILL measures 1.92:1 on parchment**
(needs 3 for non-text). Its edge `--m1-edge #A67F1E` measures **3.52 ✓**, and marks are
filled shapes WITH edge strokes, so the object boundary carries identifying contrast. The
other four fills pass (m2 4.21 · m3 3.52 · m4 3.86 · m5 3.70) and all five edges pass
(3.52–7.06). Darkening `--m1` would change a ratified Hour token — a design-comp change,
so it is surfaced rather than taken.

Rider disclosed: `views.js:10349` pins the mark-PICKER swatches to `colorful`, so the
picker now shows 16 shapes in 5 jewels. Correct under the ruling; worth seeing.

**SHARPENED AFTER RED-TEAM — the collapse is NOT app-wide, and the gap sits on a surface
this very batch touched.** "16 → 5" is true of every consumer that reads
`var(--subtheory-N)` — i.e. the arc-interior Field face. It is **not** true of
`assets/marks.js`, which hardcodes the 16-pastel table in `PraxisMarks.COLORS`
(`marks.js:20-36`) and is **byte-locked**, so it takes no CSS token. The Arcs-index card
paints through `bookSubMarkHTML` → `PraxisMarks.render`, so **the same sub-theory now shows
a jewel on the Field face and its old candy hue on the Arcs-index card.** GR-1 fixed that
card's POSITION math this commit but could not touch its COLOR without breaking the
byte-lock — which the ruling explicitly forbade ("no unification against byte-locked
marks.js"). This is the renderer-unification debt made visible, not a new defect, but the
RD-1 text above read more totalizing than what shipped and is corrected here.
**FELT-PASS CHECK: compare one arc's Field-face mark against that same arc's card in the
Arcs list — they will not match until the S-B sweep lands.**

**Also surfaced by the red-team — an out-of-inventory consumer.** `components.css:12979-80`
(`.itx-root .room-threshold::before/::after`, pre-existing, untouched) uses
`var(--subtheory-1)` as a decorative gradient line in the visitor's published reading room.
It shifts teal `#6FC9BC` → gold `--m1` as a side effect. Cosmetic, no functional break,
but it is a real consumer the 4-renderer-path inventory did not enumerate.

### RULING 2 · GR-1 — the living miniature · DONE (data-wiring only)

Four renderers ACCEPTED as this batch's reality; no unification against byte-locked
`marks.js`. Narrowed to the felt core: miniatures render the REAL stored arrangement.

`_arcCardConstellation` hashed each sub's **id** and ignored the stored `sub.x`/`sub.y` the
user dragged — so two miniatures of the same arc disagreed about its shape. Now normalises
the arc's own placed marks into the thumb's 0–100 space (normalising to the arc's own
extent, not a viewBox constant, so the mapping holds whatever dimensions the field was
authored at) and preserves the RELATIVE arrangement.

Proven with a deliberate diagonal (`x:100,220,340,460 / y:80,180,280,380`):

| | positions |
|---|---|
| unplaced (hash fallback) | 17.6/52.0 · 35.6/44.5 · 56.2/39.3 · 89.6/34.5 |
| **placed (real)** | **12/20 · 37.3/40 · 62.7/60 · 88/80** — the diagonal, exactly |

Fallbacks deliberate: a sub with no placement keeps its hash slot; an arc with NO placements
keeps the entire old layout, so never-arranged arcs look as they do today.

**Arcs-index wiring** taken as the authorized surgical exception — data only, zero page
composition (B4 keeps the page).

**DEBT RECORDED:** full renderer unification (4 paths, incl. the split *inside* the arc
interior between Page face and Field face) → the S-B sweep.

### RULING 3 · R1 — the 12px floor · DONE, with the diagnosis corrected

CSS-override first, per the ruling — and it turned out **no renderer edit was needed at
all**, because the brief's premise was wrong in both directions:

| context | scale | `font-size="11"` renders at | verdict |
|---|---|---|---|
| arc interior (600×500 @ 1228px) | **2.047×** | **~22.5 real px** | already PASSES |
| Home thumbnail (600×360 @ 248px) | **0.413×** | **~4.55 real px** | FAILS hard |

`font-size="11"` is **user units inside a scaled viewBox, not pixels**. Editing 11→12 at
the source would have left the real violation at ~4.96px and inflated the interior to
~24.5px — breaking the one place that was correct.

Fix is contextual: a miniature shows the ARRANGEMENT; a 4.5px word is noise. Labels hidden
in thumbnail containers only. After: Home thumbnail **0 visible texts**; arc interior
smallest visible text **21.49px**.

**Locked renderer untouched — grep-proven:** `js/arc-constellation.js` has **zero diff
lines**; `font-size="11"` count **8 = 8** vs HEAD; `assets/marks.js` **10,255 B = 10,255 B**.

### RULING 4 · `\|t` — PROBED, nothing built

| Source | Result |
|---|---|
| repo source, all `.js/.json/.html`, escaped patterns | **0 hits** |
| shared `__praxis_seed__` workspace, 4 sub-theories, all body fields | **0 hits** |
| 16 notebook entries, any pipe at all | **0 hits** |

Not code, not shared fixture, **not systemic**. It is isolated to Preston's own account
content → **his to delete in-app**, noted for the felt pass. No intake item, no sanitizer.

---

## FROZEN-GATE PROOF

| Gate | Evidence |
|---|---|
| `arc-constellation.js` (locked renderer) | **0 diff lines** |
| its `font-size="11"` literals | **8 now = 8 at HEAD** |
| `assets/marks.js` (byte-locked) | **10,255 B = 10,255 B** |
| `--tradition-*` feed | untouched |
| `--subtheory-*` | unfrozen by ruling → collapsed → **re-frozen at five**, documented |

## BYTE LEDGER (LF-normalized)

| File | Base | Now | Delta |
|---|---|---|---|
| `assets/components.css` | 739,419 | 748,836 | +9,417 |
| `assets/theme.css` | 32,743 | 36,485 | +3,742 |
| `js/views.js` | 1,018,557 | 1,023,857 | +5,300 |
| `js/room-field.js` | 12,052 | 14,324 | +2,272 |
| `js/spotlight.js` | 14,721 | 15,352 | +631 |
| `assets/praxis-kit.css` | 15,249 | 15,285 | +36 |

Parse: `views.js` · `room-field.js` · `spotlight.js` · `arc-constellation.js` all PASS.

## RESIDUALS / DEBT

- **DR-1 partial on the arc-Field face** (lift + dim, no overshoot) — named follow-on.
- **`--m1` gold fill 1.92:1 on parchment** — edge carries the boundary at 3.52; Preston's
  call at the felt pass.
- **Renderer unification (4 paths)** → S-B sweep.
- Carried from B1-FIX and still open: R1 nav-not-sticky <760 · R3 nav-list 760–800 overflow ·
  R5 pre-existing light-page contrast debt · R6 mono-caps sentences.
