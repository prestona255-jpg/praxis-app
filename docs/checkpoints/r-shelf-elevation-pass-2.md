# R-SHELF — ELEVATION PASS 2

Surfaces walked: **390 + 1280 + 1920** (+ **1360**, Preston's real CSS viewport, per the
OWNER-VIEWPORT PRIMACY lesson). True viewports via the Browser pane; localhost serve
(PowerShell HttpListener, `Cache-Control:no-store`), cache-busted; render forced fresh at
each width (the headless pane does not dispatch a `resize` event, so `renderCase()` is
called after each resize — on a real device the page renders once at load width, correct).
Base commit: `8675cb2` (elevation pass 1, 10→17). Model: Opus 4.8, default effort.
Discipline: RULED changes only (Part 1 five fixes · Part 2 THE WALL · Part 3 ORDER BY LIFE),
per the July-21 rulings amending brief v3's desktop-deferral. §3 governs §5's stale numbers.

The scope note: **THE WALL + ORDER-BY-LIFE (July 21)** put desktop composition and shelf
ordering IN scope. Responsive now scores fully.

---

## SCORE — six axes (BEFORE → AFTER)

BEFORE = pass-1's shipped 17/18 (desktop deferred/unwalked). AFTER = + the five structural
fixes + THE WALL + order-by-life.

| Axis | Before | After | Evidence |
|---|---|---|---|
| Fidelity | 3 | 3 | brief laws still met; wall/life-order/gravity are additive fidelity. Card rows all PASS. |
| Craft | 3 | 3 | gravity spread 0px every width; covers uniform 2:3 (worst dev 0.73%); wheat heads +4px; tokens intact. Residual: masonry column-balance delta 638–795px (flagged). |
| Motion | 3 | 3 | wheat 2 layers, period 8.05–12.99s (all ≥8s), transform-only, reduced-motion→still field; heads no longer clipped (was −15px). |
| Quiet | 3 | 3 | dot-only status (0 band caption text); 1 ember/cover max; chip counts sum 80. |
| **Responsive** | **2** | **3** | **desktop now IN scope + fully walked.** 390 single-col; 1280/1360 = 3-col wall; 1920 = 4-col. No h-overflow at any width; 17 bands, zero splits; no See-all/scroll ≥760. |
| Function | 3 | 3 | mode re-shelve (same wall), masonry fill, life-order, focused view (mobile), value filter, Manage/Select, wheat + reduced-motion toggles — all verified. |
| **TOTAL** | **17/18** | **18/18** | |

**18/18 is FLOORS CLEARED, not a shipped look** (OWNER-VIEWPORT PRIMACY). Preston's dual
felt read (390 phone + desktop walk) outranks the score; 18/18 he dislikes = FAIL.

---

## PART 1 — THE FIVE STRUCTURAL FIXES (verification, rect evidence)

### 1. GRAVITY — covers bottom-aligned, feet on a drawn shelf line, zero intra-row stagger

BEFORE (baseline, 390): first band's row cover-bottom spread = **224px** (no shared baseline).

| Gate | Expected | 390 | 1280 | 1360 | 1920 | State |
|---|---|---|---|---|---|---|
| worst intra-row cover-bottom spread (non-pile, all bands) | ≤1px | **0px** | **0px** | **0px** | **0px** | PASS |
| drawn shelf line per row | present | repeating-gradient board line at each row's cover-foot (period = --cover-h+--cap-h+--row-gap) | ✓ | ✓ | ✓ | PASS |
| fixed caption zone (caption length can't re-stagger) | fixed `.cap` height | title 2-line clamp + author ellipsis; `.cap` height fixed per context (72/94/110 desk; 60/80/104 mobile); overflow hidden | ✓ | ✓ | ✓ | PASS |
| mobile: max 2 rows then See-all (A1) | 2 rows | 5 covers + See-all tile = 2 rows (perRow 3) | N/A | N/A | N/A | PASS |
| cavity hugs its rows | exact | shelfline height = rows×(cover-h+cap-h)+gaps | ✓ | ✓ | ✓ | PASS |

The 7px "spread" the first sweep flagged was the **Unshelved pile** (intentionally rotated
`translateY` covers — "in motion, outside the case"), not a shelf row; excluded correctly.

### 2. UNIFORM COVERS — normalized to 2:3, seeded ≤6% variance at the top edge only

| Gate | Expected | Measured (offsetW/H, transform-agnostic) | State |
|---|---|---|---|
| cover aspect 2:3 ±6% for 100% of covers | 100% | **108/108** within; worst deviation **0.73%**; 0 over 6% | PASS |
| seeded height variance ≤6%, top-edge only, bottoms on line | ≤6% | shelf covers 136–144px (10 distinct heights); jitter **5.56%**; bottoms all on the line (gravity spread 0) | PASS |
| spines keep narrow treatment, same baseline | unchanged | `.spine` --spine-w × --cover-h, bottom-aligned in slot | PASS |

**⚠ FLAG (Claude-specced, for Preston's felt read):** the variance amount is a Claude choice —
seeded uniform scale, nominal cap **5.5%** (`0.945..1.000`, hash-seeded per title+author) so
measured pixel jitter stays under the ruled ≤6% ceiling after integer rounding. Aspect is held
at 2:3 by scaling width AND height together; the delta reads at the **top edge** (feet stay on
the line). Whether 5.5% is the right "breath" is a felt dial.

### 3. DESK — same normalization, bottom-aligned, fixed caption zone; desk/shelf ratio unchanged

| Gate | Expected | 1280 | 390 | State |
|---|---|---|---|---|
| desk covers bottom-aligned | spread 0 | **0px** (3 covers) | 0px | PASS |
| fixed caption zone incl. carrying-question, unclipped | not clipped | qline overflow **0px** (fully visible) | fits | PASS |
| desk/shelf scale ratio unchanged | reserved | --cover-h-now 170 : --cover-h 144 (desktop) unchanged from pass-1 | ✓ | PASS |

**Interpretation note (conservative, no invention):** "bottom-aligned on the desk's line" is
implemented as bottom-alignment on an **undrawn** baseline + a fixed caption zone — **no board
drawn** on the desk, honoring §3.4's chrome-less desk ("no furniture"; desk tone = page/lighter).
If Preston wants a *visible* desk line, that is a felt call, not assumed here.

### 4. WHEAT CONTAINMENT — full stalks + heads inside the strip; 64 @390 / 104 @≥760

BEFORE (390): topmost head **15px above** the strip top; **34/97 stalks clipped**.

| Gate | Expected | 390 | 1280 | 1360 | 1920 | State |
|---|---|---|---|---|---|---|
| topmost head pixel below strip top | ≥2px | **+4px** | +5px | +4px | +4px | PASS |
| stalks clipped at top | 0 | **0** | 0 | 0 | 0 | PASS |
| strip height | 64/104 | **64** | **104** | 104 | 104 | PASS |

Stalk heights now derive from the **live strip height** (head = stalkHeight + 12; near layer
capped at stripH − 16 → head lands ~4px below the top at every width). Sway/reduced-motion
unchanged (Law 7).

**⚠ FLAG (midpoint choice):** desktop strip = **104px = the MIDPOINT of the ruled 96–120px
breathe range** (Claude-specced). 390 stays 64px (Law-8 §3.5).

### 5. CHROME CLEARANCE — FAB + Bloom vs covers/captions (L6, 3 scroll × 3 widths)

FAB (Add) + Bloom positions are **NON-GOALS** (untouched this round). The lever is bottom
clearance; sheet `padding-bottom` 90→104px.

| Width | content bottom clearance ≥ chrome | Bloom overlap (top/mid/bottom scroll) | Add-FAB (top/mid/bottom) | State |
|---|---|---|---|---|
| 390 | **+86px** at scroll-bottom | 0 / 0 / 0 | 2 / 2 / **0** (fixed at ≤759) | see note |
| 1280 | +86px | 0 / 0 / 0 | inline (static) — n/a | PASS |
| 1920 | **+86px** | **0 / 0 / 0** | inline (static) — n/a | PASS |

**The Part-1.5-defined gate ("content bottom clearance ≥ chrome height") PASSES at all widths**
(+86px), so nothing is permanently trapped under chrome, and at scroll-bottom overlap = 0
everywhere. The Bloom overlaps **nothing at any scroll position, any width**. The only non-zero
rects are the **fixed Add-a-book FAB** transiently floating over ≤2 bottom-left cells mid/top
scroll at 390 — this is inherent to **persistent fixed chrome** (§3.8: "FAB and Bloom are the
only persistent chrome"), it is **scrollable-away** (not permanent), it is **identical to
pass-1** (the FAB position is untouched, NON-GOALS), and moving the FAB is out of scope. Not a
regression; reported, not hidden.

---

## PART 2 — THE WALL (desktop recomposition, ruled July 21)

| Gate | Expected | 1280 | 1360 (owner) | 1920 | State |
|---|---|---|---|---|---|
| column count | 2 @760-1279 / 3 @1280-1919 / 4 @≥1920 | **3** | **3** | **4** | PASS |
| bands, zero splits across columns | all in one col | 17 (5/4/8) | 17 | 17 (3/5/4/5) | PASS |
| no See-all tiles ≥760 | 0 | **0** | 0 | **0** | PASS |
| no h-scroll shelflines ≥760 | 0 | **0** | 0 | 0 | PASS |
| no h-overflow | scrollW ≤ innerW | 1265≤1280 | 1345≤1360 | 1905≤1920 | PASS |
| ~3 covers per row at column width | ~3 | 3,3,3,2 / 3,3 … | ~3 | ~3-4 | PASS (report) |
| band labels INERT ≥760 | span, not button | 17 inert, 0 buttons | 17/0 | 17/0 | PASS |
| desk spans full content width above wall | full-width | desk 1181 / content 1229 | ✓ | desk 1821 / 1869 | PASS |
| wheat full content width above header | full-width | strip 1229 | ✓ | strip 1869 | PASS |
| wall content max-width 1920, centered | ≤1920 | content 1229 | 1309 | **1869** (viewport-bound <1920) | PASS |
| masonry balance (tallest − shortest column) | report | **795px** (4213/3418/3742) | 795px | **638px** (2623/2785/2704/3261) | REPORT |
| Categories & Lenses take the same wall | same structure | 3-col both; toggle re-shelves; is-lens cap-ctx 94px | ✓ | ✓ | PASS |

**Visual order per width (life order, reading ACROSS the top row):**
- 1280/1360 (3-col): **Education · Arts & Culture · Memoir & Biography** (the 3 most-alive bands).
- 1920 (4-col): first band per column places the 4 most-alive bands across.
- Lens mode bands (life order): Liberation & schooling · Doubt as method · The machine & the
  classroom · Witness & testimony · Care work · Love as grounded practice.

**Masonry-balance residual (flagged):** greedy shortest-column fill in **life order** (Part 3
binds placement order) yields a 638–795px tallest-vs-shortest delta — inherent to online masonry
with a fixed placement order + heterogeneous band sizes (e.g. Theory & Philosophy = 14 books).
Classic height-descending bin-packing would balance tighter but would **violate life order**, so
it is not applied. On tall (3400–4200px) columns this reads as slightly uneven column *bottoms*;
felt-pass call.

---

## PART 3 — ORDER BY LIFE (ruled July 21)

| Gate | Expected | Measured | State |
|---|---|---|---|
| deterministic lastTouched per book, ~6mo, stable | stable | `touchDays = |hash(id+'\|touch')| % 184`; recompute vs stored **0 mismatches** | PASS |
| within-band: books descending by lastTouched | most-alive first | e.g. Education: Teaching to Transgress (1d) → … → Punished by Rewards (183d) | PASS |
| band order: descending by most-recent member | = masonry order | Education(1) · Arts&Culture(2) · Memoir(6) · Theory(7) · Poetry(7) · Genre(8)… | PASS |
| applies in BOTH modes | yes | categories + lenses both life-ordered | PASS |
| desk untouched | yes | NOW_BOOKS authored order preserved | PASS |
| no new UI (zero badges/timestamps/labels) | placement only | no touchDays rendered anywhere | PASS |

**⚠ FLAG (build-time seam, mockup-only logic):** the real "touch" signal — what actually makes a
book *alive* (marginalia writes? status changes? opens? arc activity?) — is **NOT decided here**.
The mockup seeds a deterministic pseudo-date purely to demonstrate the ordering. The live signal
is a named BUILD-TIME seam for the R-SHELF build.

---

## PASS-1 WINS — intact (regression guard)

| Win | Expected | Measured | State |
|---|---|---|---|
| shelf-band caption text | 0 | 0 (dot-only status) | PASS |
| value chip counts sum | 80 | 80 (6 chips) | PASS |
| illumination = cover-opacity only, cavity ground unchanged | rider | cavity bg 239,231,214 before==lit==after; dim opacity 0.32; lit ember→gold-hi | PASS |
| ember per cover | ≤1 | max 1 | PASS |
| console | clean | no errors after full interaction sweep (390 + 1280) | PASS |

---

## THE COMPLETENESS INVENTORY (8 rows × BOTH acceptance surfaces)

Rows: Ground · States · Controls · Widths · Motion · Marks · Text · Seams. States: SHOWN
(evidence) · N/A-OWNED (owning round) · MISSING (=FAIL).

| # | Anatomy | 390 (mobile) | 1280/1920 (desktop) |
|---|---|---|---|
| 1 | Ground | **SHOWN** — twilight sheet + carved cavities (bg 239,231,214, one top inset) + drawn shelf lines + 64px wheat horizon; not placeholder | **SHOWN** — same, wheat 104px, full content width |
| 2 | States | **SHOWN** — empty (desk toggle → one --ink-3 line), sparse (2-book bands get a dignified single-row shelf), full/at-scale (130-book fixture, 17 bands, 2-row cap+See-all), error (lens-empty = Yumi invite; search-empty line) | **SHOWN** — same states; full-scale = the masonry wall; error states identical |
| 3 | Controls | **SHOWN** — search·mode toggle·value chips·Manage(Select live; Scan/Bulk/Resolve/Tidy **static-by-design**, disabled)·Add-FAB(mockup no-op)·density seg·See-all·band-label→focus·desk demo·wheat & reduced-motion switches | **SHOWN** — same, minus mobile-only (See-all/focus) which are **N/A-OWNED: mobile**; labels inert by design |
| 4 | Widths | **SHOWN** — 390 walked, single column | **SHOWN** — 1280 + 1360 (owner) + 1920 walked; 2/3/4-col wall |
| 5 | Motion | **SHOWN** — wheat 2-layer sway ≥8s, tip-lean, transform-only; reduced-motion→still field (verified); mode fade | **SHOWN** — same |
| 6 | Marks | **SHOWN** — register tick · arc thread · single-coal ember (gold→gold-hi) · under-glow g0–g3 · status dot; legible on cavity ground (recon-8 contrast held) | **SHOWN** — same, on the wall |
| 7 | Text | **SHOWN** — real titles/authors, real 17-category + 6-lens names, carrying question; zero placeholder; registers match canon (mono eyebrows/serif titles). Fixture = sample library (flagged stand-in, file header) | **SHOWN** — same |
| 8 | Seams | **SHOWN/named** — focused view (the case opens, mobile) · pile→classify · Yumi lens-gen (F7) · Manage(DEL-1 pad) · Add-FAB(R-SCAN door) · order-by-life touch signal = build-time seam. Adjacent surfaces (Home wheat/Arcs/Galaxy) **out-of-round** (brief §7) | **SHOWN/named** — same; focused view N/A-OWNED: mobile (inert labels desktop) |

No MISSING rows. The mobile-only / desktop-only cells are N/A-OWNED **by design** (each shown on
its own surface), not holes.

---

## ACCEPTANCE CARD — law sentences (verbatim, brief v3 §3–§4), walked 390 + 1280 + 1920

| # | Law / dial sentence (verbatim) | State | Evidence |
|---|---|---|---|
| L1 | One illumination grammar. Search and values both LIGHT matches and DIM the rest. | PASS | dim 106/lit 14; opacity 0.32; cavity ground unchanged |
| L1-rider | dimming applies as cover opacity only — cavity ground never changes | PASS | cavity bg 239,231,214 before==lit==after |
| L2 | Same library, re-shelved. Modes regroup the same books. | PASS | toggle → same wall, 6 lens bands, gravity 0; count==fixture |
| L3 | Evidence-weighted marks only. Glow rides real annotation counts; embers ride real value-marks. | PASS | g0=absence; 1 ember max; chip sum 80 |
| L4 | Sparse-honest everywhere. | PASS | desk empty = one line; 2-book bands get a shelf; lens-empty = F7 invite |
| §3.1 | one inset shadow per cavity, ground layer only, never on covers | PASS | cavity inset top-only; shelf lines are board lines on ground, not cover shadows |
| §3.2 | period ≥ 8s, tip-lean only, exactly two layers, far layer half-amplitude & one tone dimmer. Animate transform and opacity only — never filter. | PASS | 8.05–12.99s; near 72/far 47; swayFar half-amp; no filter; unchanged from pass-1 |
| §3.3 | one ember + one glow per cover, two ember brightness steps, g0 = absence, chips carry the count | PASS | 1 ember/cover; .55/.78 steps; g0 no halo; chips sum 80 |
| §3.4 | desk tone = page or lighter, cavities darker — light falls on what's in hand; empty = one line, no furniture | PASS | desk transparent (sheet card-1) vs cavity --surface-2 darker; empty = one --ink-3 line |
| §3.5 | 64px fixed at 390, scrolls with the page, never sticky | PASS | strip 64@390 / 104@≥760; position:relative (not sticky) |
| §3.7 | one ground grammar round-wide; the focused view is the case opened, with strip and desk absent | PASS | focused view (mobile) hides strip+desk+header, same carved grammar |
| §3.8 | at 390 nothing above the case is sticky; FAB and Bloom are the only persistent chrome | PASS | header/desk/strip position:relative; FAB+Bloom fixed |
| Law 7 | Ambient motion lives in the horizon band ONLY; reduced-motion renders a still field; the band scrolls with the page | PASS | stalks only in strip; force-reduced → dur ~0; nohorizon → none |

Flags carried out: (1) uniform-cover variance amount (5.5% nominal) — Claude-specced;
(2) wheat desktop strip 104px = 96–120 midpoint — Claude-specced; (3) masonry column-balance
delta 638–795px — inherent to life-ordered fill; (4) order-by-life touch signal = build-time
seam; (5) desk "line" implemented as bottom-alignment, no drawn board (§3.4 chrome-less).

---

## BYTE DELTA

Base (`8675cb2`) 81970 → 90955 = **+8985**. This is a **feature-add** pass (THE WALL masonry
engine, the gravity slot/cap system + per-row shelf-line gradient, order-by-life sort, the
width-aware wheat, chrome padding) plus dense `EVOLVED PASS-2 …` provenance comments. No
pre-stated numeric band was given; the delta is dominated by new ruled CSS/JS + comments, no
logic outside Parts 1–3. LF-only (**0 CR**, base 0 CR — no EOL flip). Console clean.

---

## RESIDUALS / INHERITED

- **`docs/studio/r-shelf.md` carries an uncommitted "## Mockup evaluation" from PASS 1** (226
  insertions) — it was dirty in the worktree when pass-2 began; **untouched by pass-2, NOT staged
  in this commit** (path-explicit staging). Preston folds it into the round-close commit if wanted.
- Masonry column-balance delta (638–795px) — felt-pass call; life-order binds placement so it
  can't be bin-packed tighter without breaking Part 3.
- Uniform-cover variance (5.5%) + wheat 104px midpoint — Claude-specced dials, felt read pending.
- Desk visible-line vs bottom-align-only — conservative (no board) pending Preston.
- Screenshots not captured (the Browser pane is not displayed → not compositing frames); all
  proof is live-DOM/rect (the hard evidence per L10). The packaged phone preview is FOR the
  owner felt pass.
