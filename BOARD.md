# BOARD.md — Praxis Coverage Board

**What this is:** the single committed picture of every surface in the app
and where it stands on each build dimension. Gaps are visible as cells,
not memories. This file — not chat history, not any agent's recollection —
is where "what still needs converting?" gets answered.

**Maintenance rule (binding):** any wave that changes a cell updates this
file IN THE SAME COMMIT (docs ride with the diff). The updating agent
re-verifies the cell's evidence at current HEAD before flipping it; line
anchors below drift as files grow, so re-grep before relying on them.

**Source of truth for this revision:** Ground-Truth Census v3 — W13 pre-audit
re-census, July 6 2026, HEAD `0ee5fad` (`praxis-v3.177`). Route census =
`renderRoute()` @ `js/views.js:343` (18 render surfaces + 1 redirect, unchanged).

Legend: ✅ done · ◐ partial · ✗ absent · — not applicable · ? ambiguous

---

## 1 · Surface × dimension matrix (18 render surfaces + 1 redirect)

| # | Surface | Amber | Mobile @759 | Empty state | Logged-out | Load/Error |
|---|---------|-------|-------------|-------------|------------|------------|
| 1 | `#home` renderHome | ✅ Universal-light v1450 · css11705 (R3, v3.187) · **R-POLISH B1 (v3.231): PG-1 GROUND FLIP — `home` dropped from `umberGroundDark`, so Home is `data-ground="bright"` and the paper is a VIEWPORT-FIXED `.home-page.lum-amber-deep::before` instead of an element-bound sheet. Measured 1920: the 173px dark gutters (DW-2's `max-width:1560`) → 0; occupancy 81.9→88.2%; XL tier widened 1560→1680 / tracks 1240+360. Nav PROVEN unchanged (`.app-nav` is an independent selector on theme.css's dark remap). Latent `--surface:#3e2814` leak inside Home → `#fffdf8`. TY-1 floor: 10 sub-12px classes → 0 (incl. `.home-mspine-pending` 6.5px). MO-1 hover/press + reduced-motion. Verified 390/768/1280/1920/2560** | ✅ css11829 | ✅ v1464/1499/1546 · **B1: paper ground mounts on the signed-out path too (scoped to `.home-page.lum-amber-deep`, which the prompt path carries without `home-composed`)** | ✗ no gate (same as zero-data) | ✗ sync |
| 2 | `#notebook` + catch-all, renderNotebook | ✅ Universal-light v1755 · css11828 (R4, v3.188) · **R-POLISH B1 (v3.231): NBK-1 RECONCILED — the growing leaf was ruled DELIBERATELY (mockups + notebook-hybrid.md + DW-2's 200-note test), so it is honoured, NOT bounded; the brief's "scrolls within the leaf" premise is struck in the same commit. Growth composed instead: XL ≥1600 governor 1360→1680 (leaves 840/839, equal height), right leaf gets SYS-1 composed-empty. TY-1 floor: 24 sub-12px classes → 0 (incl. a SECOND actions container `.notebook-entry-overflow` a named grep missed). Reader's-words register UPRIGHT Cormorant 17px. CC-2 carved composer. UX-3 SUBMIT DEBOUNCE — two fires → ONE entry, control reproduces 2 dupes without it. MO-1 save pulse on commit** · **CD-6 Stage 1 (v3.254, 2026-07-24): the inline writeline RETIRED — the leaf now mounts `buildNotebookCatchAffordance` (opens the shared capture door, tab-scoped targetKey/register); the writeline's photo capture MIGRATED into the door's photo mode. UX-3 submit-debounce retired with the writeline; the door's own gen-gated `capCommitBusy` is the double-write guard** | ✅ css11426 | ✅ v1999/2039 · **B1: 2 leaves render on the empty path; composed-empty right leaf** | ✅ hard v1709 · **B1 re-verified: 0 leaves + sign-in prompt, no crash** | ✗ sync |
| 3 | `#arcs` renderArcsPage | ✅ Universal-light+spectrum (R5, v3.189) · **DESKTOP ≥1200 composed (DW-1: widen col + teach-cap 66ch, D1–D6 live)** · **R-POLISH B4 (v3.235): XL-1 LIST COMPOSITION — governor 1360 → 1560; occupancy 53.4% FAIL → 61.3% @2560, 71.4% → 81.9% @1920. The list archetype came FREE and was verified against a seeded 7-arc library, not inferred: `.arcs-grid` is already `repeat(auto-fit,minmax(240px,1fr))`, so a wider governor IS more columns — measured 7 cards → 6 columns @247px. That measurement also caught a defect the widening would have WORSENED: the 2-card "learn from" row stretches to fill, so each example card was 672px and would have become 772px (a 772×112 letterbox) — capped to 300px, `justify-content:start`. EXEMPLAR-WASH CLOSED: root cause was `_arcCardConstellation(null)` → `_arcSubsOf(null)` returns `[]` → the renderer's own `!subs.length` early-exit returned a bare `.arc-const-empty` (one 11px CSS dot at .5 opacity). **marks.js is NEVER reached for that card**, so the GO's "candy paint lives in byte-locked marks.js" premise was false — no jewel-token hunk, no re-baseline. Fixed caller-side with a fixed authored arrangement; live: 5 marks, 4 threads, 5 distinct opacities .607→.953, 5 distinct sizes 18→27px. "Illustrated example" now delivers what it promises.** · **R-POLISH B3 (v3.234): AES-5b PLATE-FRAME — the arc-card thumbnail was the odd one of three (flat band, radius 0, a bottom rule standing in for a frame) while `.home-wf` was a plate and `.home-arcfield` a RAISED border. All three converge on the plate + the CC-2/RD-1 CARVED edge (inset shadow + inset hairline): measured `margin:11px 11px 0`, `radius:12px`, bottom rule gone. `.home-arcfield`'s hover was REBUILT onto the carve (it animated `border-color`, which the carve removes) so the affordance is not orphaned** | ✅ css1894 | ✗ by-design v3454 | ◐ omission v3441 | ✗ sync |
| 4 | `#books` renderShelf | ✅ Universal-light + **R-SHELF THE BOOKCASE — CLOSED (v3.243 `c90e70a`, felt pass #2 = PASS 2026-07-22; S5 felt-fail fix on his REAL library — desk 6-cap + door, labels navigate, also-under demoted, caption de-link + AA-safe inks, editor light dress, safe-area, ground seams): the sidebar dissolves (F4) into a slim header (search + Categories⇄Lenses re-shelving toggle + carried Manage/Add/Select + value chips); a wheat horizon strip (F9) + the desk (NOW = still-reading, F2) sit above the case — carved cavities with gravity shelf-lines (feet on the line, 0px spread all widths), order-by-life arrangement (§11: marginalia→finishedAt→addedAt, derived-not-persisted), and THE WALL masonry (2/3/4 cols ≥760, no band splits). Marks: single-coal ember (value marks) + under-glow g0–g3 (marginalia density) + dot-only status. Illumination = value chips + search LIGHT/DIM (cover opacity only, cavity ground unchanged, Law 1). Sort dropdown + Covers\|List retired (pin 2, D5→Covers\|Compact); real covers lazy-loaded into pre-sized slots (0 CLS) → spine on 404. renderShelfBook replaced (shelf-only); renderShelfBookRow kept (F7). New tokens in theme.css only (HARD RULE #1)** | ✅ P1–P9 @390: single-column bands, A1 2-row+See-all cap, mobile labels open the focused view (§3.7); 44px targets; 0 h-overflow | ✅ real states — empty desk "Nothing in hand right now", sparse 2-book bands, lens-empty Ask-Yumi row, search-empty line, bad-URL→spine | ✅ hard v3700 (W11-S8-L1; **preserved exactly, pin 1**) | ✗ sync |
| 5 | `#book/<id>/marks` renderBookView | ✅ v7581 | ✅ css10860 | ✅ v7585/7659/7698 | ✅ hard v7591 (W11-S8-L1) | ✗ sync |
| 6 | `#book/<id>` renderBookDetail | ✅ Universal-light v8781 · css10708 (R7, v3.191) · **DESKTOP ≥1200 DESIGNED (DW-POLISH, v3.209): one grid, every column ONE object — `.bk-rail` wrapper (rows 2-7) + `.bk-cols`/`.bk-aside` dissolved + `.bk-reading` folded into the hero + ISBN to footer-weight. `rig.hollow` rail 195/14/14 (HOLE) → 16/16/16 uniform on DEFAULT data; "In your thinking" 542px/28.5% → 816px/42.8%; edges align (measured). D1–D6 live; all 4 on-demand panels re-measured, zero collisions. **CHIP = `native`, GRANTED 2026-07-15 on the deployed v3.210 felt pass — the FIRST surface to reach native through the polish tier.** DWF-1 (v3.210, `d3a96df`) then resolved the marginalia ✎ that pass caught: never wired (buildMargCard byte-identical to its parent; no listener in any commit) → removed as decoration, MARG-EDIT named as a ROUND GAP. **MARG-EDIT IS NOW CLOSED (R-POLISH B3, v3.234): the ✎ is back and WIRED** — `openMarginaliaEditor(bookId, editEntryId)` seeds `entryId` + `initialValue`, which routes saves down the UPDATE branch that already existed but was unreachable; owner-gated twice (render gate in `buildMargCard` + seed re-check). Live: 4 cards / exactly 1 pencil (0 signed-out), opens pre-filled, 17→17 entries on save, only `body`+`updatedAt` change, 44×44 at 390. Two silent-failure guards fixed with it (`!entry`, `!user`): `flushSave` cues "Saving…" BEFORE `onSave`, so a bare return stranded the cue while discarding the edit — both now report "Couldn't save". **XL ≥1600 (B3): `.bk-shell` 1200→1560, rail 340→380 — occupancy 46.9% FAIL → 61.3% @2560, 81.9% @1920; `.bk-atext` capped 72ch (83.4ch regression caught by the rig and fixed in-session).** Residual DWP-RAIL-INVERT ruled OPTION A (ship as built; the void mode inverts at 9+ value-marks on an empty book)** · **CD-6 Stage 2 (v3.255): the "✎ Add marginalia" CREATE button now opens the shared capture door pre-targeted to the book (`openCaptureDoor({targetKey:bookId})`, register default marginalia but NOT locked — a question about a book is a valid capture); the marg list refreshes on commit, guarded (`capBookPageHasOpenInline`) so it never tears down an open inline editor/picker. The ✎ EDIT pencil + `createWritingCanvas` UNCHANGED (edit deferred to post-F2); census-ruled plain (0/11 formatting); photo capture additive via the door** | ✅ css10860 · **DW-POLISH mobile re-gate: DOM changed, −9 nodes @390+@1024, content-complete, 0 h-scroll, order preserved; delta = reading-card folded + edit/find hoisted** | ✅ v8056 | ✅ soft `.bk-signin` v8164 · **DW-POLISH: signin-row in the rail, D2 85.1→72ch (the whisper cap the signed-in path could not see)** | ✗ sync |
| 7 | `#artifact/<id>` renderArtifact | ✅ v373 key (W10-B) · **DESKTOP ≥1200 composed (DW-4: editorial spread — title/pointer margin + 72ch essay; D1 37.5%→60.8%, D2 83.9→72.0ch, D1–D6 live)** | ✅ css @759 | ✅ v10825/10848 | ✅ CTA v10879 (W11-S8-L1; was silent ✗) · **seed artifact opens read-only (W12-S10)** · **DW-4: the seed bypass lands on the FULL read, so the composed layout is signed-out reachable — gated signed-out** | ✗ sync |
| — | `#arc/<id>/new-subtheory` (redirect) | — | — | ? state:1929→#arcs | ✅ **L4 gate (W10-B): signed-out → null → #arcs (state.js:1939)** | — |
| 8 | `#subtheory/<id>/build` renderSubTheoryBuild | ✅ warm-dim workshop · sole editor (R6, v3.190) · **R-POLISH B3 (v3.234): AES-4 STYLED-NATIVE SELECT — `.stb-pull-book-sel` was the one control here still rendering as an OS widget beside a carved field. `appearance:none` + kit dress at ALL widths; the caret is TWO `linear-gradient`s, not an SVG data URI, because a data URI bakes a literal hex no token can reach. Still a native `<select>` (6 options, aria-label, iOS wheel, 16px no-zoom at 390) — the SKIN is removed, not the behaviour. Retires the `components.css:8920` deferral ("a custom caret would need new hex or a third file"): no hex, and praxis-kit.css IS that third file since B1. `.k-select` added to the kit as the reusable dress but NOT adopted by class here (the per-surface `background` shorthand outranks it); the other 4 native selects stay OS-skinned — named kit debt** · **R-ARC Wave C ROOM composition: ROOM-1 spatial field v3.224 · S7 live lighting v3.225 · ROOM-3 recomposition v3.227 — the lengthening-page field (RD-2: bounded width, growing height, NO inner scroll), one mono kicker + quiet court + RD-4a door-mirror corner + DE-CARDED sheet (RD-4), the "Gathered" panel DISSOLVED into the field with one-click kind-doors (RD-5/F2), empty + basin states designed (RD-3); felt checkpoint pending** | ✅ css @759 (R6-verified) · ROOM-3 M1-lite full-width field | ✅ signed-out/not-found | ✅ hard (W11-S8-L1; R6-verified) | ✗ sync |
| 9 | `#subtheory/<id>` renderSubTheoryPage | ✅ read/author-view · warm-dim draft / full-amber room + walk-nav (R6, v3.190) | ✅ css @759 (R6-verified) | ✅ signed-out/not-found | ✅ hard (W11-S8-L1) · **seed sub-theory READ opens read-only (W12-S10)** | ✗ sync |
| 10 | `#arc/<id>` renderArcDetail (the Field) | ✅ v11983 · **R-POLISH B3 (v3.234): AES-3 THE HEAD LEARNS THE KIT — inventory found THREE control families wearing the same gold pill and the loudest thing in the head was a view toggle. Now: faces seg CARVED with gold retired (selected = lifted paper `--lum-base`), `+ Sub-theory` the ONE filled gold (measured: exactly 1 gradient control in the head), lifecycle verbs quiet, status chip neutral state, DELETE quiet + cornered (`order:99`) with `openArcDeleteConfirm`'s panel PRESERVED (verified: 127px, visible, Delete/Cancel, arc intact). MW-2 P3's 44px mobile targets all survive (the block is later in source, so it declares neither `display` nor `min-height`). Also AES-1's `--m1` on-ground rider MADE EFFECTIVE: session 1 scoped `--m1` but the glyphs paint `var(--subtheory-N)`, declared at `:root` and inherited already-resolved — they still read #D9B24A at 1.92:1. Re-declaring the 4 slots + edges in scope moved the pixels to #9D7A20 = 3.811:1** | ✅ css11686 | ✅ arcfield-empty v12377 (W11-S8-L1; was guard-only) | ✅ owner-gate v11953 + sign-in CTA (W11-S8-L1; gate unchanged) · **seed arc opens read-only (sentinel, pre-W12)** | ✗ sync |
| 11 | `#account` → **redirect `#profile`** (R9a v3.198; renderAccountPage retired defined-but-unrouted — S-B deletion debt) | — merged into #14 | — | — | — | — |
| 12 | `#about` renderAbout | ✅ **R-POLISH B4 (v3.235): ALREADY one-world — `umberGroundDark` contains `about`, so B1-FIX unified this ground; verified live (`data-ground="dark"`, viewport-fixed `body::before` painting). About is a dark room with cream paper diagram cards. NO ground work needed or done. What it lacked was the XL tier: **cap 1160 → 1560**, which on this content-box page with 24px side padding **renders as a 1608px border box** (the figure occupancy is measured from, as DW-1 always did: "~1160 + 48 padding = ~1208"). Occupancy 47.5% FAIL → **63.2%** @2560 and 63.4% → **84.4%** @1920; measure 56 → 71.9ch (XL-1's "wider ≤72ch"). *(Arcs index reports 81.9%/61.3% from the same 1560 cap because its governed child has zero padding — same width, two paddings, two honest numbers.)* STN-A11Y: the `.stn` groups were click-only — no role, NO tabindex, unreachable by keyboard — and both station SVGs carried `role="img"`, which makes descendants presentational, so any role added under it would have been inert (the B3 failed-rider shape). Now `role="group"` containers + `role=button`/`tabindex=0`/`aria-label`/`aria-pressed` stations, Enter+Space activation (verified), caption `aria-live=polite`, gold focus ring, and focus restores opacity inside `.evo.sel`. ME-1 disclosure landed: a 4th covenant row "We count, we never watch" + no·5 "No streaks"; the 3-up/2-col grids became 2×2 + a spanning capstone so neither addition orphaned.** · ~~v18142~~ · **DESKTOP ≥1200 composed (DW-1: spine + reading column + wide figures, D1–D6 live)** | ✅ css9655 | — static | ✗ static | — static |
| 13 | `#yumi-sees` renderWhatYumiSeesPage | ✅ v373 key + scoped repin (W10-B) · **DESKTOP ≥1200 composed (DW-4: ledger column + framing rail; D1 56.7%→63.4%, D2 138.3→51ch, D1–D6 live; all 3 builder mounts verified — both overlays unchanged)** | ✅ css @759 | ✅ per-section v13827–13925 · **DW-4: 3 of 7 sections are STRUCTURALLY always-empty here — the router (v676-683) nulls the book/arc/sub-theory pointers before render (named gap, not fixed)** | ✗ | ✗ sync |
| 14 | `#profile` **renderProfilePage (MERGED, R9a → R9b v3.202)** | ✅ light-below / dark-warm galaxy hero (§7); `.pf-*` scoped · **R-POLISH B3 (v3.234): THE DAWN SEAM — `.pf-hero` was a fully opaque radial with NO light stop, so dark→light happened the instant its box ended: a hard cut the 1px AM28 hairline marked but never blended. The ramp could NOT simply fade the hero's bottom — `.pf-hero-dock` is the hero's LAST child and its text is `--text-on-dark`, so fading through it would put light text on a lightening ground (the AES-2 coupling trap). The hero grows a 76px dawn band BELOW the dock and the ramp lives there. Final measured stack: ramp `z-index:1` < hairline `z-index:2` < dock `z-index:3` — the hairline needed an EXPLICIT z-index (a positive z-index paints later than `auto` regardless of source order, so the ramp was covering it). Ramp height == padding, so overlap into dock content = 0px; `.pf-taphint` clears by 14px. Identical at 390 and ≥1200** · **+ DESKTOP ≥1200 = project's FIRST composition tier (D1–D6 live)** · **R9b galaxy v3.201 (sigil/motion/panel/constellations) + felt-pass patch v3.202 (curated hue map · dominant off-axis · one hue system · reader-model→gold)** | ✅ P1–P9 @ true 390 (v3.199); widened collision proof 390/1280/1920 + R9b sparse-spread/dominant re-proven | ✅ sparse-honest invitations every section + visitor fence (`.pf-owner-only`/`.is-visitor`) | ✅ hard sign-in prompt, no crash | ✅ profile Firestore load; statement round-trip live-verified · **Slice 8 (v3.228, COMMITTED LOCAL): reader-model thread "Set aside" is now a durable+synced TOMBSTONE (dismissReaderThread → status='dismissed', forward-only) — remembered per-match, not hard-deleted; read-filter activated** |
| 15 | `#commons` renderCommons | ✅ ember v16421 | ✅ css12217 | ✅ v16472 | ✅ hard v16416 | ✅ v16459/16465 |
| 16 | `#reader/<uid>` renderOtherProfile | ✅ ember v16508 | ✅ css12217 | ✅ v16592 | ✅ hard v16501 | ✅ v16517/16530 |
| 17 | `#walk/<arcId>` renderInteract | ✅ ember v16625 | ✅ css12217 | ✅ v16634/16641/16805 | ✅ hard v16620 | ✅ v16626/16759 |
| 18 | `#search` renderSearch (W8) | ✅ v1025 | ✅ css11768 | ✅ v963 | ✅ hard v1005 (W11-S8-L1; soft-CTA retired) | — sync by design (no fetch) |

> **NAMED DRIFT — this board under-reports the Desktop Wave (DW-4, 2026-07-14).** Only **DW-1**
> (arcs · about) and profile's first tier were ever recorded here; **DW-2** (home · notebook,
> v3.205), **DW-3** (book-detail · sub-theory build, v3.206) and **DW-STP2** (sub-theory page,
> v3.207) all shipped `composed` chips and never updated their rows, despite the binding
> maintenance rule at the top of this file. DW-4 added its own two rows (7 · 13) and, per the
> standing "pre-existing drift outside your batch is a named task, never a silent fix" rail,
> **did not backfill the other five** — the evidence for those cells belongs to the batches that
> measured them. Backfilling rows 1 · 2 · 6 · 8 · 9 from `docs/checkpoints/dw-2.md` / `dw-3.md` /
> `dw-stp2.md` is a tracked task (**DW-BOARD-BACKFILL**). Until it runs, read the per-surface
> `desktop:` frontmatter in `docs/studio/` (9 composed · 1 native) as the true desktop census,
> not this column.

**Tallies:** Amber 18/18 (W10-B closed artifact + yumi-sees) · Mobile 18/18
· Empty 16✅ 1✗ 1— (W11-S8-L1 added #arc/<id>) · Logged-out (W11-S8-L1,
f98dc82): 13 hard · 1 soft (#book/<id>) · 2 open (#arcs·#about) · 2 none
(#home·#yumi-sees) — L3 front-end gating unified to CRAFT §3.1; commons-open
(Lane 2) deferred · Load/Error: 4✅ (commons·reader·walk·profile), rest
sync-render with none (W11-S8-L1: #profile social-fetch now graceful).

## 2 · Panels & overlays (non-router)

| Panel | Entry | Amber |
|-------|-------|-------|
| Yumi panel | yumi-ui.js:1333 / Bloom FAB :912/:998 | ✅ `.lum-amber-deep` |
| Import/Capture | ImportCapture.open, wired v1456+ | ✅ `.lum-amber-deep` |
| **THE DOOR** (capture sheet — R-CAPTURE, v3.252) | `initCaptureDoor`/`buildCaptureDoor` (views.js door module); summon = create-corner (bottom-left, stacks above the Shelf FAB on mobile) + Capture nav + ⌘N + `openCaptureDoor()` | ✅ LIGHT sheet over `--scrim` (ruled); 390 bottom-sheet / ≥760 corner-card; note/voice/paste + never-silent context chip + commit-and-stay + CA-1 desk carrying-question + Android text-share. Signed-out: commit gated (field preserved). **CD-6 UNIFICATION IN PROGRESS: Stage 1 (v3.254) retired the Notebook writeline (`#notebook` → `buildNotebookCatchAffordance`, photo migrated into photo mode); Stage 2 (v3.255) retired the Book-Detail Add-marginalia CREATE composer (the "✎ Add marginalia" button opens THIS door pre-targeted to the book; book-page marg list refreshes on commit, guarded). THREE doors live: this + 2 legacy (ImportCapture · onboarding buildActMargin). Round OPEN; micro-lane CD6-NBK-REFRESH-GUARD (v3.256) next** |
| Spotlight ⌘K | spotlight.js:341/353 — nav pill now routes `#search` (:442); overlay = ⌘K only | ? pre-Amber styling — verify |
| Pickers ×8 (arc/sub/gather/file-to-book/mark…) | v12960/13077/13003/13437/2284/2945/8377 | ? unverified as a set |
| Confirms ×6 (deletes/reset/unlink/review) | v12596/12699/8608/8678/14102/6654 | ? unverified as a set |
| Reader-portrait offer | v17432 | ? |
| **Intro journey** (first-run, 8 steps — R8 added a `values` beat) | intros.js `startJourney`; body-level overlay; fired by yumi-ui `maybeStartOnboarding` (scripted chat greeting replaced) | ✅ `.lum-amber` |
| **Intro per-page panels ×12** | intros.js `maybeShowPanel`; ls/sv seen-flags; 8 auto-show surfaces (home·shelf·notebook·field·search·commons·account·sees) | ✅ dual-ground |
| **Intro ⓘ re-summon + About Orientation** | intros.js `updateSummon`; `buildAboutOrientation` single-sources INTROS into renderAbout | ✅ |

## 3 · Open-items ledger (from Census v2 mismatches)

| ID | Item | Disposition |
|----|------|-------------|
| H1 | BUILD_STATE.md stale 49 versions (v3.123/9c6608b vs v3.172/c3f0d2d) | HOUSEKEEPING WAVE (with this file's first commit) |
| M2 | CLAUDE.md:32-33 load order reversed (load-bearing) + omits spotlight/writing-canvas/import-capture | HOUSEKEEPING WAVE |
| M3 | CLAUDE.md:287-290 fossil cache target v3.107→108 | HOUSEKEEPING WAVE |
| L4 | createSubTheory has no auth gate — signed-out can mint a draft via stale redirect link | ✅ DONE — W10-B: guard mirrors exportWorkspace (state.js:1914), signed-out → null → #arcs |
| L2 | Loading/error states absent on 13 local surfaces | ✅ SHIPPED W11-S8-L1 (f98dc82): #arc/<id> empty + #profile graceful error. Reframed — the 13 are synchronous state.* surfaces that need no loading/error; real L2 was ~2. #account section-drops DEFERRED (defensive umbrellas, never fire) |
| L3 | Logged-out handling = 3 coexisting philosophies (hard/soft/none) | ✅ front-end SHIPPED W11-S8-L1 (f98dc82): unified to CRAFT §3.1 — 5 hard-gates (book/marks · subtheory×2 · shelf · search) + 2 copy fixes (artifact · arc/<id>), in-place prompt via shared buildSignedOutPrompt. Commons-open (Lane 2: #commons/#reader/#walk) DEFERRED — auth-required firestore.rules loosening = backend security change / audit input |
| L1 | Dead sweep — W10-B: ~~.shelf-list~~ REMOVED · ~~.notebook-leaf-* (14 rules + comma-group partial)~~ REMOVED · ~~renderArcConstellation~~ REMOVED. KEPT: legacy `.st-page` = EXCLUDED (LIVE — `st-page` class emitted at views.js:9063, base layer under `.st-page.lum-amber-deep`); `tfa-stage` gradient (tradition-forms-arc.js:73) = HELD this wave | ✅ b/c/e DONE; .st-page + tfa-stage carried |
| L1b | Known-stale doc: 3 comment mentions of the removed `renderArcConstellation` remain (arc-constellation.js:8, :401; views.js:10883) — live-adjacent docs, left intact per ruling | Future doc pass (deferred) |
| M1 | Field mark "flat-fill" debt is NOT clean — url(#tfa-shine) overlay exists (arc-constellation.js:954) | Re-inspect before any polish build; AUDIT INPUT |
| M4 | --subtheory-5 #7CC6DA ≈ --lum-cyan #7fd0f0 (cyan collision; marks.js:25 labels it "cyan") | AUDIT INPUT (color system ruling) |
| M5 | Haystack duplication spotlight.js:47-184 vs views.js:742-876; divergent matching (title-only vs title+author) | LOGGED DEBT — consolidate when spotlight next touched |
| M6 | integrations.js byte anchor re-baselined → 127,249 B (972fed6) | DONE (recorded here) |

## 4 · Wave board (pre-audit)

| Wave | Scope | Status |
|------|-------|--------|
| Housekeeping | Commit this file + fix H1/M2/M3 (docs only, zero code) | NEXT |
| W9 | Intro system SHIPPED: first-run guided journey (real writes: shelve/note/consent) + 12 single-sourced per-page panels (dual-ground) + About Orientation; scripted chat greeting replaced. About kept bright at W9 (superseded by W10 Lane A) | SHIPPED v3.173 |
| W10 Lane A | `#about` → dark Amber ground + five interactive models (evolution · pipeline · praxis⇄pedagogy · banking⇄problem-posing · applause⇄consequence); live doctrinal prose preserved verbatim; Orientation card preserved in a bright frame | SHIPPED v3.174 |
| W10 Lane B | Polish sweep pt.1: `#artifact` + `#yumi-sees` → dark-Amber + @759 (yumi-sees Option A: bright panel kept via scoped `.yumi-sees-page` re-pin, Notebook overlay byte-identical) · L4 auth gate · dead-code sweep (b `.shelf-list` / c `.notebook-leaf-*` / e `renderArcConstellation`) | SHIPPED v3.175 |
| W10 (L2/L3) | Remaining polish: loading/error states (L2) · logged-out unification (L3) — both deferred to after CRAFT.md | AFTER Lane B |
| Pre-audit prep | CRAFT.md + metrics · sound design doc · seed real arcs · writing-loop diagnosis session · census delta → refresh this board | AFTER W10 |
| AUDIT | Fable, findings-report-only; charter = correctness + craft + writing-loop deep-dive; after July 7 | GATED ON ABOVE |

## 5 · Post-audit program queue (order set by audit findings)

Writing-loop rebuild + Generative Yumi ("alive") — co-flagship, intertwined ·
Sound build (Yumi voice + ambient, from the design doc) · Admin/moderation
surface (fenced firestore.rules edit — own careful wave; interim backend =
Firebase console) · Goodreads CSV import · Data export/backup + Settings
surface · Activity/notifications surface · Nav rail / app shell (own
program, re-parents all surfaces) · views.js split strategy (per audit
ruling on the ~810 KB monolith).

## 6 · Deferred-feature ledger (audit inputs)

Generative Yumi layer (gated on external Yumi eval) · Import
review-before-commit flow · Import paste-path Cancel · Arcs consequence
fields (→6.5 publish model) · Book-detail alight-predicate widening ·
Top-nav Profile link · Reversible set-aside for reader-model threads ·
Theme action · Nav search-placeholder truncation · "Tap to find lenses"
starburst orphaning · Per-note route (note results land on #notebook) ·
W8: mark gradient-depth polish (see M1) · Dictation-quality tuning.

---
*Board revision 1 — derived from Census v2 (c3f0d2d). Cell updates ride with
each wave: W10 Lane B (v3.175) flipped rows 7 + 13 (Amber + Mobile), closed L4,
and struck the b/c/e items of L1. W11 S8 Lane 1 (v3.176, f98dc82) flipped the
Logged-out column to 13 hard (rows 4·5·7·8·9·18 + copy on 10), added #arc/<id>'s
empty state, and made #profile's social-fetch graceful — L2/L3 front-end DONE;
Lane 2 (commons-open) deferred as an auth-required rules change. W12 S10
(v3.177) completed the "A Pedagogy of Desire" seed (4 sub-theories + 16 notes
+ 1 artifact, all `__praxis_seed__`, pure-local) and extended the existing
`#arc/<id>` sentinel open-exception to the `#subtheory/<id>` READ page (read-
only) + `#artifact/<id>` + `marginaliaForBook` — real-user hard-gates unchanged
(the 13-hard tally is for real content; the seed is an exception, as `#arc/<id>`
already was). It also fixed a pre-existing wipe: `clearUserState` (state.js) now
PRESERVES `__praxis_seed__`-owned records (+ seed books by id) across sign-out /
signed-out auth resolution, so the whole seed now PERSISTS signed-out instead of
flashing then vanishing ~1s after load — which is what made even the row-10
`#arc/<id>` seed truly viewable signed-out. All real-user records are still
wiped. Next full refresh: the census delta before the audit charter freezes.*

*Board revision 2 — W13 pre-audit re-census at HEAD `0ee5fad` (`praxis-v3.177`),
July 6 2026 (recon: `docs/checkpoints/w13-precensus-recon.md`). The 18 render
surfaces + 1 redirect are unchanged, and every §1 cell VALUE was re-verified at
this HEAD — no flips. Confirmed unchanged: Amber 18/18; Empty 16 ✅ · 1 ✗ · 1 —;
Logged-out 13 hard · 1 soft (`#book/<id>`) · 2 open (`#arcs`·`#about`) · 2 none
(`#home`·`#yumi-sees`); Load/Error 4 ✅ async (`commons`·`reader`·`walk`·`profile`).
`#account` and `#arc/<id>` were re-verified as HARD gates — each blocks real
content behind an early return, so a branded sign-in shell is not a soft-CTA.
SCHEMA_VERSION current = `1.11.0` (migrate-ladder landing @ state.js:2893; default
literal `1.9.3`). Foundations MD5-locked: `lumen-amber.css` `9879ddb8…`, `marks.js`
`772886c0…` (both unchanged since `5cfbea2`). This revision syncs ONLY the
provenance header (→ `0ee5fad`), the redirect row's L4 anchor (`state.js:1914`→
`1939`, `1905`→`1929`), and row-10's seed-read-only annotation. The ~40 drifted
in-cell `v####` anchors are deliberately NOT rewritten — they re-drift as the file
grows (per the maintenance rule above); the full refreshed per-surface anchor set
lives in the recon doc.*

*Board revision 3 — R6 Sub-theory CLOSED (v3.190, `4c8f73e`, felt-passed 2026-07-10). Flipped the Amber
cell of rows 8 (`#subtheory/<id>/build`) + 9 (`#subtheory/<id>`) to the R6 transformation: the Page is now
the read/author-view (its editor removed — warm-dim draft / full-amber immersive room + walk-nav) and the
workshop is the sole warm-dim editor. Logged-out hard-gates on both rows PRESERVED + R6-verified; empty
states preserved. The prior in-cell `v####`/`css####` anchors on these rows were DROPPED — R6 removed
~1000 lines from `renderSubTheoryPage` and grew the notebook region, so those numbers drifted hard; re-grep
by function name (`renderSubTheoryPage` ~9838, `renderSubTheoryBuild` ~10242, of 2026-07-10) before relying.
Named debt carried: R6-OWN (ownership → R9 owner-vs-visitor) + R6-INK (warm-dim ink-ramp, systemic retune).
Records: `docs/studio/subtheory-build.md` + `subtheory-page.md` (both `state: closed`).*

*Board revision 4 — R8 Values SHIPPED (v3.195, `37ea1f0`, 2026-07-11; live 5-step smoke passed in full incl. the
Firestore round-trip, deployed felt pass pending). R8 is FEATURE-ADDITIVE — it flips NO coverage cell
(Amber/Mobile/Empty/Logged-out/Load-Error all hold); it threads a new value layer through existing surfaces.
Recorded elsewhere: the Intro journey is now **8 steps** (§2, a new `values` beat after `stance`);
book-detail/sub-theory-page/arc-detail gained an owner-gated value-mark register (`.vr-*`, self-contained
`--vr-*` palette, AA on every ground); `#account`'s values section gained the Yumi eval-gated retrofit; `#books`
gained one Values filter row-group. All new UI is mobile-canon-native (Mobile 18/18 holds). Data layer: additive
per-object `valueMarks[]` (migration `1.28.0→1.29.0`) — NO new synced collection (FX-1 untouched). SCHEMA_VERSION
chain now lands at `1.29.0`. Records: `docs/checkpoints/r8-values*.md`; surface ledgers: onboarding · account ·
book-detail · subtheory-page · arc-detail · books.*
