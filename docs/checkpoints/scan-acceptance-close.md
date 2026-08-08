# SCAN acceptance — close

Surface walked: **390 (the acceptance surface, L4)** — Preston's **device felt round 4**
(installed PWA + plain Safari, live URL) = **FULL PASS**, 2026-08-08; rig-corroborated at 390
(headless prestonpraxistest, stubbed vision). Widths: 390 built + verified; desktop honest-secondary built.
Base commit: `6c021af`   Closing version: **v3.269** (live, pushed)   Date: 2026-08-08   Session model: Opus 4.8

The eight rows are the brief's `## LAWS` sentences VERBATIM (Law-8 discipline — laws are the
acceptance criteria; generators never reword them). Each graded PASS / FAIL / DEFERRED with an
evidence pointer (version · commit · felt-round citation). The two build-stage DEFERRED halves —
Law 2's hardware-indicator felt and Law 8's visual-canon felt — are now closed by felt round 4 and
graded PASS with that citation; the residual real-AT screen-reader pass is named honestly (not a law FAIL).

| # | Law sentence (verbatim from `docs/studio/scan-round-brief.md` §LAWS) | State | Evidence |
|---|---|---|---|
| 1 | **TWO TRUST POSTURES, ONE CAMERA.** Barcode verdicts are confident; shelf results are claims. Upright cover vs leaning gray spine carries the difference — never copy alone, never apology. | **PASS** | Book verdict card (confident) vs mirror-shelf upright/leaning gray spine (build trace, scan-build.md §S6). Felt round 4: **11/11 confident correct + 2 need-a-look correctly flagged** as leaning — the posture split held on real spines. v3.269 · felt round 4 (Preston, 2026-08-08). |
| 2 | **THE CAMERA FORGETS.** Images transient end-to-end — never persisted client- or server-side — and the hardware camera releases on route exit and backgrounding (SCE-1); the indicator light is the proof. A verified invariant, not copy. | **PASS** | Structure: teardown on renderRoute-cleanup + visibilitychange + pagehide + zxing reset (build trace). **Hardware felt (was DEFERRED at build) now CONFIRMED** — felt round 4: green camera dot **dies on the primer**; camera light **dead on nav-away and on app-switch** (SCE-1 indicator-light proof). v3.269 · felt round 4. |
| 3 | **THE QUICK CARD IS FREE.** Zero LLM calls on the verdict card; context locally derived; silence over filler. | **PASS** | `scanComputeContext` is local (owned / author-count); zero model call on the card; silent otherwise (build trace, scan-build.md §S6). No felt-round contradiction. v3.269. |
| 4 | **EXCEPTIONS NEVER AUTO-COMMIT.** Maybe-books never enter the library; drafts persist safely. | **PASS** | Shelve commits only `scanResult.confident`; exceptions persist (SCE-2 draft + nav badge). Felt round 4: the **2 need-a-look books were flagged, not auto-shelved**, and **draft persistence observed live**. v3.269 · felt round 4. |
| 5 | **FAILURE WEARS ITS OWN CLOTHES.** Four distinct felt states; truncation ≠ empty ≠ failed ≠ refused. | **PASS** (law) · keep-partial tray **DEFERRED** (see below) | CALL-FAILED / EMPTY / TRUNCATED / REFUSED each its own overlay; felt round 4: **failure card observed live** + draft persistence. TRUNCATED ships honest (no impossible keep-partial tray — ERRATA-3 / BRIEF-CONFLICT #1). v3.269 · felt round 4. |
| 6 | **THE SHUTTER IS THE BUDGET.** Deliberate capture for paid calls; auto-fire only for free local decode; queue-1; never silent-degrade the model. | **PASS** | Shelf = deliberate shutter; Book barcode = free auto-fire; SC10 queue depth 1; soft cost cap 30/day; **always opus, never degrade** (build trace + red-team confirmed refund can't be gamed). v3.269. |
| 7 | **RAISED-HAND YUMI.** Card context is ambient; she doesn't speak here. Enrichment = one deliberate tap deeper. | **PASS** | No Yumi surface on scan; context is a quiet mono line; no enrichment built (correct — she doesn't speak here). Bloom hidden on the surface (FX-E). v3.269. |
| 8 | **CANON-NATIVE.** Strict ES3, Universal v1.2 tokens, mobile canon P1–P9, 759/760, control canon (no underlined captions), XL tier on desktop, mobile-first with desktop honest secondary, reduced-motion variants for all three signatures. Accessibility: results announced; walker fully operable without the viewfinder. | **PASS** (structure + visual-canon felt) · real-AT screen-reader pass = named residual | Parse OK; tokens wired real; ES3 0; no underlined captions; RM stills for all 3 signatures; `aria-live` announcer; walker keyboard-operable (build trace + both Sonnet gates). **Visual-canon felt (was DEFERRED) CONFIRMED** — felt round 4: Shelf **sharp** after Book→Shelf switch, camera-dark→light-review ground reads right. Real screen-reader (AT) device pass = carried verification, not a law FAIL. v3.269 · felt round 4. |

## DEFERRED sub-capabilities — named honestly, NOT laundered into a law PASS

| item | state | why / owner |
|---|---|---|
| **SC8 keep-partial tray** (under Law 5 · TRUNCATED) | **DEFERRED** | ERRATA-3 / BRIEF-CONFLICT #1: `shelf-vision` returns **no partial books** on a `max_tokens` stop — there is nothing to keep. TRUNCATED ships as an honest distinct state instead ("I read part of this shelf and stopped," reshoot the rest). Owner: **a future endpoint round** (partial-books capability, carried-debt ledger). |
| **Offline ISBN-capture queue** (SCE-3) | **DEFERRED (defaulted NO)** | SCE-3 shipped the designed KNOWN-OFFLINE card (never a shot into an inevitable CALL-FAILED). The offline ISBN-capture **queue** was an open question defaulted **NO** at build — not built. Owner: **future / beta** (open question, not a debt-fix in scope). |

## 8-ROW COMPLETENESS INVENTORY (Ground/States/Controls/Widths/Motion/Marks/Text-registers/Seams)

| # | row | state | evidence |
|---|---|---|---|
| 1 | **Ground** | **SHOWN** | light app → camera-dark viewfinder (HOUR warm-up/overlays) → light draft-case review. Full-amber (visitor room) correctly absent. Felt round 4: grounds read right, Shelf sharp on return. |
| 2 | **States** | **SHOWN** | 20+ reachable states asserted incl. skew (40-book payload + all-exceptions batch, rig). Felt round 4: failure card + draft persistence observed live. |
| 3 | **Controls** | **SHOWN** | all 18 primary controls + 5 fail-dismiss + drop-zone fired live (L18/L19 sweep); own-state asserted; 0 dead controls; primer allow button L19 hit-tested. |
| 4 | **Widths** | **SHOWN** (390) · XL-tier bespoke desktop = **N/A-OWNED** | 390 built + verified (acceptance surface, L4); desktop honest-secondary built (ISBN/search + drop-zone, no fake viewfinder; nav fits 1360, no overflow). XL-tier bespoke scan composition ≥1600 = named residual R4, owner **a future XL round**. |
| 5 | **Motion** | **SHOWN** | 3 mandated signatures (lock-on snap / shimmer read / shelve flight), each with a reduced-motion still; + warm-up fade. |
| 6 | **Marks** | **SHOWN** | Raised-hand Yumi → no Yumi glyph. Covers = typeset cloth into pre-sized 2:3 slots (real coverUrl draws over; 404 → fallback, never a hole). Reticle brackets + shelf glyph + teal tick, legible on the dark ground. |
| 7 | **Text-registers** | **SHOWN** | serif (titles/covers) / body (actions) / mono (eyebrows/meta/counts/evidence). Evidence line `I read: '…'` in mono; NO underlined-link captions (control canon). Zero placeholder text. |
| 8 | **Seams** | **SHOWN** | Entry = the CD-6 create-door Scan socket (wired) + first-class `#scan` nav. Review = draft-case of the shipped carved cavity (SCD-3). Add = the shared 5-site guarded write. Undo immediate (ERRATA-1). No endpoint / schema / sw-beyond-bump touched. |

No inventory row is MISSING.

## Elevation (L14)
Rig-verified at the acceptance surface + skew data at the build stage (no in-ruled-space regression
found in the sweep). The camera-dependent felt — warm-up length, first-frame, torch, indicator death,
notch clearance — was DEVICE-OWED and could not be elevated on the rig (no camera); it is now closed by
Preston's felt round 4 FULL PASS. Craft/Quiet on the live look = his felt pass, which is IN.

Flags carried in (from the build stage): the four build-stage DEVICE-OWED felt items (frame promise /
in-frame accuracy / partials / hardware-indicator death) + R1 real-Firestore forced-timing race.
Flags carried out (new, non-law): none new — the felt items resolved at round 4; the real-Firestore
live-smoke (R1) is Preston's owner-run corroboration, tracked as a carried verification, not a debt.

## Verdict
**All 8 law rows PASS. Two DEFERRED sub-capabilities named honestly (SC8 keep-partial tray; offline
ISBN queue). Completeness inventory: 8/8 SHOWN (XL desktop = N/A-OWNED, named). Elevation clean.
The SCAN round's laws are met at v3.269 on Preston's felt round 4 FULL PASS.**
