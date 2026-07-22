# R-SHELF acceptance — CLOSE
Surface walked: **390 + 1280 + 1360 (owner) + 1920**, live build on the rig (:8793,
prestonpraxistest-shaped stub `d0tester`, 145-book at-scale fixture across the 17 real
SHELF_CATEGORIES + uncategorized pile + injected marginalia [g1/g2/g3] + 2 userThemes + 1 bad-URL
cover), cache-busted (neutral-page SW-kill + rig.bustCss). Geometry/rect proofs (headless
screenshots are dead — L10); the owner FELT pass on production is reserved and gates the round close.
Base tag: `pre-rshelf` (`4a3c2e3`).   Date: 2026-07-22.   Session model: Opus 4.8.

## LAW / DIAL SENTENCES (verbatim, brief v3 §3–§4 + v4 §11), walked 390 + 1280/1920

| # | Law / dial sentence (verbatim) | State | Evidence |
|---|---|---|---|
| L1 | One illumination grammar. Search and values both LIGHT matches and DIM the rest. Illumination never rearranges, hides, or removes. Grouping changes only via the mode toggle. | PASS | value chip → 121 dim / 24 lit; bands unchanged (grouping only regroups on mode toggle); search dims, never removes |
| L1-rider | chip/search dimming applies as cover opacity only — cavity ground never changes under illumination | PASS | dim opacity 0.32; cavity bg 239,231,214 before==lit==after |
| L2 | Same library, re-shelved. Modes regroup the same books. Category mode = exclusive (one home per book). Lens mode = angles (duplication allowed, A2). | PASS | Categories = 17 bands (book.category exclusive); Lenses = 2 userTheme bands, fx_1 in both → A2 "also under" ×2 |
| L3 | Evidence-weighted marks only. Glow rides real annotation counts; embers ride real value-marks. No tallies, no streaks, nothing performative. | PASS | glow g1/g2/g3 from marginaliaForBook count (1/3/6); ember from valueMarks; g0=absence |
| L4 | Sparse-honest everywhere. | PASS | empty desk = one --ink-3 line; 2-book bands get a dignified single-row shelf; lens-empty = the Ask-Yumi row |
| §3.1 | one inset shadow per cavity, ground layer only, never on covers | PASS | cavity box-shadow = single `inset 0 15px 20px -15` (top-only); board via ::after; covers carry their own (glow) shadow only |
| §3.2 | period ≥ 8s, tip-lean only, exactly two layers, far layer half-amplitude and one tone dimmer. Animate transform and opacity only — never filter. | PASS | 35 stalks @390, durations 8.05–12.86s (all ≥8s); 2 layers (21 near/14 far); swayFar half-amp; keyframes transform-only (no filter) |
| §3.3 | one ember + one glow per cover, two ember brightness steps, g0 = absence, chips carry the count | PASS | ≤1 ember/cover (marked/heavy = valueMarks ≥1/≥2); glow g0–g3 (g0 = no data-glow attr); value chips carry counts |
| §3.4 | desk tone = page or lighter, cavities darker — light falls on what's in hand; empty = one line, no furniture | PASS | desk chrome-free (page-tone ground) vs cavity --shelf-cavity darker; empty desk = "Nothing in hand right now." |
| §3.5 | 64px fixed at 390, scrolls with the page, never sticky | PASS | strip 64@390 / 104@≥760; position:relative (not sticky/fixed) |
| §3.7 | one ground grammar round-wide; the focused view is the case opened, with strip and desk absent | PASS | focused view (mobile): strip+desk+header+case hidden; same carved cavity grammar; all band books |
| §3.8 | at 390 nothing above the case is sticky; FAB and Bloom are the only persistent chrome | PASS | header static, desk static, strip relative; Add-FAB (≤759 fixed) + Bloom untouched (NON-GOAL) |
| L5 | Canon-native (mobile P1–P9; P3 44px targets; P8 no overflow; reduced-motion freeze) | PASS | mobile controls min-height:44px; 0 h-overflow @390; reduced-motion @media zeroes the stalk animation |
| L6 | Ground check (light primitives; gold-as-text = --gold-deep; --gold-hi = embers/glyphs; no --lum-* in new CSS; ES3) | PASS | new CSS uses --page-2/--line-page/--shelf-cavity/--card-*; --ink-2/3/4 re-pointed to --card-* (dark route flips them); 0 --lum-* in new rules; parse-check PASS |
| L7 | Animation containment (ambient motion in the horizon band ONLY; reduced-motion still field; band scrolls with the page) | PASS | stalks only in #shelf-horizon; reduced-motion → animation:none; strip relative (scrolls away) |
| §11 THE WALL | 2 cols @760-1279 / 3 @1280-1919 / 4 @≥1920; a band never splits; no See-all / h-scroll ≥760; band labels inert ≥760; wall max 1920 centered; desk + wheat full content width above | PASS | 1col@390 · 2@1000 · 3@1280/1360 · 4@1920; 0 band splits; 0 See-all/h-scroll ≥760; desktop labels inert spans |
| §11 ORDER BY LIFE | within a band, books descend by lastTouched; bands descend by most-recent member; BOTH modes; desk exempt; placement only (no badges) | PASS | marginalia bumps fx_1/fx_2 to today; Lit-Fiction lead-3 = the 3 marginalia books; within-band descending; both modes; 0 rendered timestamps |
| §11 dot-only status | per-cover status = a single dot; the status word survives only in the focused full view | PASS | 81 status dots in the case, 0 with text; focused view shows the word |
| §11 desk line | carrying-question-OR-NOTHING; the desk baseline is UNDRAWN | PASS | desk line = nothing (no per-book question source authored — R-CAPTURE seam, D4); no drawn desk board |
| Law 8 | the §3 law sentences are binding acceptance criteria; any felt adjustment breaking one returns to chat | GOVERNS | no law-sentence break; the flagged dials (variance 5.5%, strip 104 midpoint, masonry delta) are Claude-specced within ruled space |

Flags carried out (Claude-specced dials, felt-pass judges): (1) uniform-cover variance 5.5% nominal;
(2) wheat desktop strip 104px = the 96–120 midpoint; (3) masonry column-balance delta 738px @1920
(structural — life-order binds the fill, can't bin-pack tighter without breaking Part 3);
(4) order-by-life live signal = marginalia/finishedAt/addedAt (build-time seam, now RESOLVED as built).

---

## BEHAVIOR-PRESERVATION INVENTORY (pin 9 — every live interactive behavior; nothing retires silently)

| # | Live behavior | Verdict | Evidence / ruling |
|---|---|---|---|
| 1 | Search | **PRESERVED** (effect changed by ruling) | `#shelf-search-input` filters by title/author; effect is now LIGHT/DIM (Law 1), not remove — a ruled change, not a silent one |
| 2 | Select → Move to an arc | **PRESERVED** | Select armed→"Done"+is-selecting; pick → selectbar has-pick, count; Move → shelfMoveToArc (carried) |
| 3 | Manage sheet (open/close, desktop popover + mobile sheet) | **PRESERVED** | manageBtn aria-expanded; the MW-1/B-M CSS (12890-12997) untouched |
| 4 | Covers \| List view toggle | **RETIRED-BY-RULING (D5)** | replaced by Covers\|Compact density (68px/96px verified); List view retired; renderShelfBookRow kept for the dead tree (F7) |
| 5 | Sort dropdown (date-added / reading-status) | **RETIRED-BY-RULING (pin 2)** | order-by-life supersedes it; not rebuilt |
| 6 | Scan shelf (camera) | **PRESERVED** | `.shelf-scan-btn` + input, handleShelfScanFile wired (NON-GOAL, scan round owns internals) |
| 7 | Scan barcode | **PRESERVED** | `.shelf-barcode-btn` → openBarcodeScanner wired |
| 8 | Bulk add | **PRESERVED** | `.shelf-new-book-bulk` → openBulkAddEditor; Add → openShelfEditor mounts the editor host (verified) |
| 9 | Resolve covers | **PRESERVED** | `.shelf-resolve-covers-btn` → startCoverBackfill; running-state label from coverResolveState |
| 10 | Tidy library | **PRESERVED** | `.shelf-tidy-btn` → openLibraryCleanup wired |
| 11 | Add a book | **PRESERVED** | `.shelf-add-primary` → openShelfEditor; editor host populated (verified) |
| 12 | Lens generation entry ("Ask Yumi for more lenses") | **PRESERVED** | live copy kept (pin 3); → window.PraxisLensPanel.open() |
| 13 | Category classify (lazy Sonnet batch) | **PRESERVED** | shelfMaybeClassify carries the orchestration verbatim (guard + watchdog + batched persist) |
| 14 | Arc thread-tie + tap-reveal | **PRESERVED** | thread colored by arcFieldHue; tap → arcs-open, chip shows arc title (verified with an injected arc) |
| 15 | Reading-status filter rail | **RETIRED-BY-RULING (F4)** | sidebar dissolved; status is now a per-cover dot; no status filter |
| 16 | Author / tradition filter rails | **RETIRED-BY-RULING (F4)** | sidebar dissolved; band labels are the navigation |
| 17 | Category / Lens grouping | **PRESERVED (transformed)** | the sidebar seg → the header mode toggle (a re-shelving act, F1); groups the case into bands |
| 18 | Value filter rail (R8) | **PRESERVED (transformed, F6)** | rail → header value chips (illuminate; count==data preserved) |
| 19 | Signed-out hard gate | **PRESERVED exactly (pin 1)** | buildSignedOutPrompt("Your shelf is private"), early return; no strip/desk/case |
| 20 | Cover → book navigation | **PRESERVED** | .cavity-cover is an `<a href="#book/<id>">`; select/thread/chip preventDefault, else navigate |

Nothing retired silently: every RETIRED row cites its ruling (D5 / pin 2 / F4).

---

## COMPLETENESS INVENTORY (8 rows × both surfaces) + ROW 9 (proposed)

| # | Anatomy | 390 (mobile) | 1280/1920 (desktop) |
|---|---|---|---|
| 1 | Ground | **SHOWN** — vellum sheet on twilight + carved cavities (one top inset) + drawn shelf lines + 64px wheat horizon | **SHOWN** — same, wheat 104px, full content width above the wall |
| 2 | States (REAL conditions, not dev toggles) | **SHOWN** — empty desk (no still-reading → one line), sparse (2-book bands = dignified single row), full/at-scale (145 books, 18 bands, 2-row+See-all cap), error (bad-URL cover → spine; lens-empty → Ask-Yumi; search-empty line) | **SHOWN** — same states; full-scale = the masonry wall |
| 3 | Controls | **SHOWN** — search·mode toggle·value chips·Manage(Covers\|Compact + Select live; Scan/Barcode/Bulk/Resolve/Tidy carried)·Add-FAB·See-all·band-label→focus·desk | **SHOWN** — same, minus mobile-only (See-all/focus) = **N/A-OWNED: mobile**; labels inert ≥760 |
| 4 | Widths | **SHOWN** — 390 walked (single col) | **SHOWN** — 1000/1280/1360(owner)/1920 walked; 2/3/3/4-col wall |
| 5 | Motion | **SHOWN** — wheat 2-layer sway 8.05–12.86s, transform-only; reduced-motion → still field | **SHOWN** — same; case mode-fade |
| 6 | Marks | **SHOWN** — register tick · arc thread + reveal · single-coal ember (gold→gold-hi lit) · under-glow g0–g3 · status dot; legible on cavity ground | **SHOWN** — same, on the wall |
| 7 | Text | **SHOWN** — real titles/authors, real 17-category + userTheme names, dot-only status; zero placeholder/filler (fixture titles are the at-scale substrate; the owner felt pass runs on the real library) | **SHOWN** — same |
| 8 | Seams | **SHOWN/named** — focused view (case opens) · pile→classify · Ask-Yumi lens-gen (F7) · Manage(scan round) · Add-FAB(R-SCAN door) · carrying-question authoring = **R-CAPTURE seam** (D4). Home wheat / Arcs / Galaxy out-of-round | **SHOWN/named** — same; focused view N/A-OWNED: mobile |
| **9** | **Behaviors (proposed row)** | **SHOWN** — behavior-preservation inventory above: 20 behaviors, each PRESERVED (evidence) or RETIRED-BY-RULING (citation) | **SHOWN** — same |

No MISSING rows. Mobile-only / desktop-only cells are N/A-OWNED by design.

---

## TRIAL VERDICTS (proposed to Preston at close — ratify or drop, per acceptance-card.md)

**THE ELEVATION LOOP — proposed verdict: RATIFY (kept the mockup honest; ran on the mockup at
pass-1→pass-2, 10→17→18/18; on the LIVE build it functioned as the gate that caught the gravity
margin-collision and the pile overflow before they reached the felt pass).** Final live score
(evidence-backed, floors-cleared — NOT a shipped look; OWNER-VIEWPORT PRIMACY: Preston's felt pass
outranks it):
| Axis | Score | Evidence |
|---|---|---|
| Fidelity | 3 | all law sentences PASS (card above) |
| Craft | 3 | gravity 0px all widths; aspect worst dev 0.7%; tokens clean. Residual: masonry delta 738px (structural) |
| Motion | 3 | wheat 2-layer ≥8s transform-only; reduced-motion still field |
| Quiet | 3 | dot-only status (0 caption text); ≤1 ember/cover; chip counts |
| Responsive | 3 | 1/2/3/4-col wall; 0 h-overflow 390→1920 |
| Function | 3 | full interactive sweep PASS (20 behaviors) |
| **TOTAL** | **18/18** | floors cleared; **felt pass reserved for Preston** |

**THE COMPLETENESS INVENTORY — proposed verdict: RATIFY + adopt ROW 9 (Behaviors) and the STATES
real-conditions amendment.** It surfaced the carrying-question seam (D4 → R-CAPTURE) and forced the
real empty/error states (empty desk, bad-URL spine, lens-empty) to be shown on real conditions
rather than a dev toggle.

## CANON PROPOSALS (drafted for Preston's ratification; ride the close docs commit)
- a. lessons.md mechanical truth: **"Major surface rewrites tag their base (pre-<round>) before slice 1"** — specimen: pre-umber / pre-rshelf.
- b. Completeness inventory gains **ROW 9 — BEHAVIORS**: every live interactive behavior PRESERVED (evidence) or RETIRED-BY-RULING (citation). Blank = not done.
- c. Inventory **STATES row amended**: judged on real conditions, never dev toggles.
- d. lessons.md mechanical truth: **"Media loads into pre-sized slots — zero CLS; a failed asset renders its fallback, never a hole."** — specimen: R-SHELF covers (145 slots 96×144 pre-sized; bad-URL → spine).

OWNER rows (felt-pass judgments) left blank — Preston's, on production. The round closes only on his
dual felt read (390 phone + desktop).
