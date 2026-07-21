---
name: launch-runway
title: The Launch Runway
kind: studio-source
generated-panel: Launch runway (tools/studio-build → builder.html)
updated: 2026-07-20
source: docs/studio/sequence.md (## Now / ## Next / ## Then / BETA-READINESS gate)
---

# THE LAUNCH RUNWAY — R-POLISH close → beta-readiness gate

The single forward line from where the program stands today to the beta gate, one
row per round / gate-item with its live status. Sourced from `sequence.md`; that
file stays the living plan, this is its runway view (and the Builder's LAUNCH
RUNWAY panel). No clock — the July-15 date is retired; order, not dates.

## The sequence

| # | Round / gate-item | Status | Notes |
|---|---|---|---|
| 0 | **R-POLISH** — the pre-launch polish round | **CLOSING (this close-out)** | BP-1v3 batches all shipped: Slice-0 kit → B1/B1-FIX (v3.231/232) → B2 (v3.233) → B3 (v3.234) → B4/B4-FIX (v3.235/236) → **B-M mobile batch (v3.238)**. FX-1 add-guard pulled forward and shipped mid-round (v3.237). Felt: tab-side PASS; PWA-only checks OPEN-VERIFY (below). |
| 1 | **FINISH-CHOREO** slice | NEXT | the mark-as-finished feel; ROOM-charter-named finish choreography. |
| 2 | **R-SHELF** — Shelf deep re-round | queued | the most-used surface predates R5–R9 Universal maturity. `[books]` |
| 3 | **R-CAPTURE** — the capture round (owns THE DOOR) | queued | one entry, sub-400ms; ruled brief in-repo. `[import-capture, notebook]` |
| 4 | **SCAN** round (studio-scan) | queued | 7-lens audit → steady state; camera modes plug into R-CAPTURE's door. `[books]` |
| 5 | **S-B** — sweep + dead-code deletion | queued | incl. deleting the ~2060-L unrouted old profile renderers (renderAccountPage debt, below) + tokenize shared light-skin literals. |
| 6 | **R10** — Connections | queued | cross-arc / graph round; lens work = CONFIRM + CONSOLIDATE only (ruled KEEP). `[arcs, arc-detail]` |
| 7 | **ONBOARDING** round | queued | inherits the Bloom teaching beat (RD-6's retired hint text from R-POLISH L5). `[onboarding]` |
| 8 | **BETA-READINESS gate** | **the wall — see below** | not a round; the ordered launch checklist. R11 is HARD-BLOCKED until it clears. |
| 9 | **R11** — Social / discovery | BLOCKED on the gate | commons / reader / walk; no outside beta tester before the gate clears. |
| 10 | **S-C** — final sweep + carried debt | queued | signed-out/global empty states, AA opacity, dead selectors, parked tasks. |
| 11 | **Feature layers** | interleave as prereqs clear | Yumi generative (eval-gated; Preston authors prompts+rubric) → intelligence wake-up · ambient sounds · beta loop. |

## The BETA-READINESS gate — in order (the launch blockers)

| # | Blocker | Status |
|---|---|---|
| 1 | **FX-1 — data-loss sync guards (HARD DEPENDENCY)** | **PARTIAL — pulled forward, add-guard LIVE (v3.237).** The incoming-wipe ADD guard for arcs/subTheories/themes/artifacts shipped + proven (headless 42/42 + independent 15/15). **Remaining before the give: FX-1c (delete-symmetry) + FX-1b (notebook + the 5th artifact site).** No outside account is invited before FX-1 is COMPLETE. |
| 1b | **CAPTURE-OWNER — hard review** | open; scoped `captureNote` owner-uid follow-on (multi-image commit misattribution window). Same posture as FX-1. |
| 2 | **Stage-2 JWT auth (two-phase)** | open; proxy auth-gating hardening. |
| 3 | **Goodreads import — minimal CSV** | open (title/author/ISBN/shelf; rich mapping is post-gate). |
| 4 | **Export / backup + minimal Settings** | open. |
| 5 | **commons `#reader` fencing** | open; the draft-sub-body leak — `buildPublishedArcDoc` exposes draft sub-theory bodies because it has NO `status==='published'` filter (`integrations.js:2499-2516`; the prior `:2456` cite was STALE — that line is now TTS-cache code, corrected 2026-07-21 from the FINISH-CHOREO recon). **Owned by FINISH-CHOREO S1** — the filter is part of its ruled privacy sweep. **This row CLOSES as a VERIFIED side effect — it flips only when the filter provably ships and is red-teamed.** Not deleted preemptively, not double-built. |
| 6 | **Admin runbook doc** | open. |
| 7 | **Unlisted-URL + open-auth access model** | open. |

Full detail in `docs/LAUNCH-STATUS.md`.

---

# THE CARRIED-DEBT LEDGER (round-close sweep)

Named debts carried past R-POLISH — deferred, never dropped. Each has an owner slot.

| Debt | Owner / lands in | What it is |
|---|---|---|
| **FX-1c — delete-symmetry guard** | its own slice (BETA-READINESS #1 completion) | the `pendingDeleteSync` tombstone half of the books precedent, for arcs/subTheories/themes/artifacts — stops a locally-deleted-but-unsynced record being resurrected by a stale remote splat. Folds in Finding C (delete fns don't `clearPendingSync`). In-scope (state.js + integrations.js), its own sim + red-team. Record: `docs/checkpoints/fx1.md`. |
| **FX-1b — notebook incoming-guard + the 5th artifact site** | after B-M's views.js work landed (now clear) | notebook's 4 views.js/import-capture.js creation sites + `mergeBookDuplicates` (views.js:8394) artifact repoint — both views.js-coupled add-sites the FX-1 2-file scope excluded. |
| **inert XL `.lede`** | whenever About XL is next opened | `.about .hero .lede{max-width:420px}` (base, 0,3,0) wins over both the fix's and XL's `.about .lede` (0,2,0); XL's lede declaration has been inert since B4. Kept mirrored; an XL-tier re-scope fixes both bands. Record: `docs/checkpoints/r-polish-b4.md`. |
| **K-LISTBOX** | L2 control-canon / a control round | `.k-listbox*` in praxis-kit.css is presentation with ZERO JS app-wide — a from-scratch component (open/close, keyboard, ARIA, focus, value-sync), not band-cheap. AES-4 shipped the styled-native select instead. |
| **arc-Field glyph items** | R10 / arc-adjacent | the candy-glyph palette items on the protected constellation renderer (RD-1 WIDENED remnants); the ARC-FIELD MOBILE TOUCH MODEL is a named carried slot for the field's drag/connect touch model. |
| **renderAccountPage — unrouted legacy** | S-B (dead-code deletion) | ~1,370-line defined-but-unroutable renderer (`#account` hard-redirects to `#profile`); B4 confirmed it dead, not a light-page. |
| **SEARCH-IA1 — Search dark→light + no mobile entry** | its own round item | Search is the one unconverted surface (~56 `.search.lum-amber` dark selectors) AND has no mobile entry point (nav pill hidden ≤759, no hamburger item, ⌘K opens Spotlight not `#search`). Deferred from B-M as a bundled ruling — ground conversion + entry point decided together. |
| **B-M-SA — subtheory evidence bottom-sheet safe-area (+momentum)** | ✓ **SHIPPED v3.239** (`micro-239`) | The live rail `.subtheory-rail.subtheory-rail-mobile-open` got `padding-bottom: calc(24px + env(safe-area-inset-bottom))` + `-webkit-overflow-scrolling:touch` (components.css:7021) — the same P4 pattern as the Bloom-orb / Shelf-select-bar slices. **Felt check** ("evidence-sheet last row clears the home indicator", standalone PWA) tracked below as **OV-4**. The dead `.st-gutter.subtheory-rail-mobile-open` mock (0 js hits) still folds into S-B's dead-code sweep. |
| **MANIFEST-WARM — warm PWA splash theme** | ✓ **SHIPPED v3.239** (`micro-239`) | `manifest.json` `background_color`/`theme_color` **and** the `index.html:6` meta theme-color all `#191F33` → **`#29200F`** (hour-4 ember horizon). **The residual's "pre-amber leftover" premise was WRONG** — `#191F33` is `--ground` (theme.css:38), the *zenith* of THE HOUR's twilight gradient; `#29200F` is that same ground's warm horizon end. **Felt check** (splash reads warm, not navy) tracked below as **OV-3**. |
| **MASK-SHELL — precache the maskable icon** | ✓ **SHIPPED v3.239** (`micro-239`) | `/assets/icon-maskable.svg` added to `sw.js` APP_SHELL, rode the v3.239 bump — re-install/offline now covered. Infrastructure (no felt check). |

---

# OPEN-VERIFY (Preston's call — verifications, NOT debts)

Deferred verifications; the work SHIPPED and its evidence-of-record stands. Not
debt — they are corroborations Preston runs when the tooling/hardware aligns.

| Line | Evidence of record | The deferred verification | Guardrail |
|---|---|---|---|
| **OV-1 — live FX-1 race corroboration** | headless mechanism proof: sim **42/42** on the real shipped bytes (base-vs-guarded) + the reviewer's **independent 15/15** harness + a mutation test (41/1 when the guard is stripped). | the live throttled-Firebase end-to-end on `prestonpraxistest` — needs laptop + test account together + interactive sign-in. Steps recorded. | none needed — the guard is proven; this is corroboration. |
| **OV-2 — the 3 PWA-only felt checks** | tab-side felt pass = PASS (edge-to-edge, Book Detail, Home, Profile clean, feels good). | orb safe-area · Shelf select-bar safe-area · re-installed maskable icon crest — all standalone-PWA-only, not headless-verifiable. | **revert-on-felt-fail stays LIVE** for those three slices until Preston runs them; each reverts as its own per-slice follow-up. |
| **OV-3 — MANIFEST-WARM splash (v3.239)** | code proven: both manifest tokens + `index.html:6` meta = `#29200F` (hour-4 ember horizon); JSON valid; red-team + reviewer confirmed the hex against `theme.css`. | the installed-PWA launch splash reads **warm, not navy** — standalone-PWA-only, not headless-verifiable. | **revert-on-felt-fail stays LIVE** for this slice until Preston runs it (reverts as its own per-slice follow-up). |
| **OV-4 — B-M-SA evidence-sheet safe-area (v3.239)** | code proven: `calc(24px + env(safe-area-inset-bottom))` on `.subtheory-rail…mobile-open` (components.css:7021), matching the shipped Shelf/Bloom env pattern; `viewport-fit=cover` present. | the mobile evidence bottom-sheet's **last row clears the home indicator** — standalone-PWA-only, not headless-verifiable. | **revert-on-felt-fail stays LIVE** for this slice until Preston runs it (reverts as its own per-slice follow-up). |

---

# ⚖ RESIDUAL DISPOSITIONS — ruled 2026-07-20 (FORK-VERBATIM)

The three B-M residuals were surfaced under FORK-VERBATIM, not silently changed.
Now ruled; each sets its row in the carried-debt ledger above.

| # | Residual | Ruling |
|---|---|---|
| **R-a** | Sub-theory mobile rail safe-area | **Both branches fire.** The selector the recon named (`.st-gutter.subtheory-rail-mobile-open`) is DEAD (0 js hits) → moot, folds into S-B's dead-code sweep. But the *live* rail (`.subtheory-rail.subtheory-rail-mobile-open` — a `bottom:0` fixed sheet, `padding-bottom:24px`, no `env()`) carries the real P4 gap → **B-M-SA**, a small B-M follow-up slice with its felt delta declared. |
| **R-b** | Navy manifest theme (`#191F33`) | **Warm-ify as its own slice** → **MANIFEST-WARM** (manifest.json only). |
| **R-c** | Maskable icon not precached | **Add to APP_SHELL at the next sw.js touch** → **MASK-SHELL** (rides the next bump). |
