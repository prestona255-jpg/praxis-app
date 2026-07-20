# B-M — the mobile batch (Lane A)

Worktree `../praxis-bm` (branch `bm-lane`), base `ba60224`. Recon:
`docs/checkpoints/b-m-recon.md`. Model: Opus 4.8, gate agents Sonnet.
Governing viewport: **390** (mobile batch). Every slice declares its 390 felt
delta up front (FELT-DELTA CLAUSE).

**STATUS: daytime batch 1 (the ranked top 3) BUILT + gated + committed on
`bm-lane`. HOLDING at the push (v3.238) for Preston's phone felt pass. Remaining
daytime items queued below.**

## Daytime batch 1 — the three ranked slices (each its own commit)

| # | Commit | Slice | Canon | 390 felt delta | Gate |
|---|---|---|---|---|---|
| 1 | `ce2ab30` | Bloom FAB safe-area | **P4** | orb clears the home-indicator band | rule carries `env(safe-area-inset-bottom)`; in-tab (env=0) orb stays 24px — no tab regression; no h-scroll |
| 2 | `6b2e5ad` | ≤759 body-margin reset | named residual | mobile nav goes edge-to-edge, hairline gone | body margin-left 8px→0; nav left 0 / right 390; no h-scroll |
| 3 | `f9794e9` | tap-highlight kill | app-feel | no grey/blue box on any tap | computed `-webkit-tap-highlight-color: rgba(0,0,0,0)` on html, **inherits to controls**; no layout regression |

All CSS-only, single-rule, single-surface, revert-safe, mirror proven patterns.
No cross-slice regression: after all three, orb 24px · body-margin 0 · no h-scroll
(verified together). sw.js untouched — the single cache bump rides the v3.238 push.

## THE FELT-PASS CARD (batch 1) — judge each against its stated delta only

Two-step per the ritual; the step that reveals each is load-bearing:

| Surface | Ritual step | Delta to look for |
|---|---|---|
| **Global shell** — Bloom orb (#1) | **installed PWA** (primary) **+ a plain Safari tab** | orb sits clear ABOVE the home-indicator bar in the PWA; in the tab, confirm it did NOT unexpectedly shift |
| **Global shell** — nav edges (#2) | **private tab** first | no ground-tone hairline beside the mobile nav; fill reaches both edges |
| **Any surface** — tap feel (#3) | **private tab**, tap any control | no grey/blue box flashes on tap |

**⚠ #1 correction (B-M red-team, claims-outliving-code):** the earlier version of
this card said #1 "does not exist in a browser tab (env()=0 there), so its pass
MUST use the installed PWA." That **overclaimed**. What was actually verified is
narrower: on the **Chromium/CDP rig**, `env(safe-area-inset-bottom)` resolves to 0,
so the orb stays at 24px there — that proves **no rig/desktop regression**, and
nothing about real WebKit. Whether a real **Safari tab** (not standalone) reserves
the home-indicator band the way standalone does is a version/setting-dependent
WebKit question this headless build **cannot settle**. So the CSS is correct and
additive (verified), but the tab-vs-standalone felt distinction is **EXPECTED, NOT
VERIFIED** — hence the card now asks for a glance at a plain tab too, not only the
PWA. #2 and #3 are genuinely tab-visible and were verified live at 390.

## Remaining daytime items (ranked; queued after the felt pass on batch 1)

- **Shelf `.shelf-selectbar` safe-area** — same P4 fix shape as #1, lower severity
  (Select mode is a less-visited state). CSS-only.
- **`overscroll-behavior` reset** — rubber-band / scroll-chaining on the app shell.
  CSS-only.
- **`-webkit-overflow-scrolling:touch` backfill** — 3 inner-scroll panels miss it
  (Shelf filter drawer + Shelf Manage sheet + Sub-theory rail). Splits into a
  Shelf item + a Sub-theory item (single-surface rule).
- **manifest.json / maskable icon** — DAYTIME bucket (ruled): install-affecting, gets
  a felt check of the installed icon. Touches manifest.json (not CSS/views), so it
  is deliberately outside the overnight allowlist.

## Tabled by ruling (not built here)

- **SEARCH-IA1** — Search's dark→light ground conversion is DEFERRED from B-M and
  reclassified as its own round item, **bundled with the IA1 no-mobile-entry
  ruling** (recon §3: `#search` has no mobile entry point — nav pill hidden ≤759,
  no hamburger item, ⌘K opens the Spotlight overlay, not `#search`). Ground and
  entry point get decided together, not piecemeal. Real work, not dropped.
- **Shelf action-button consolidation — DEAD PREMISE, verify-only.** The slate
  named it as open; it shipped in MW-1/ON-2 (`a405730`), `mobile: native` in
  `books.md`. No code to change; dropped from the slate.

## Non-goals held

No desktop-tier edits. Frozen files (marks.js / lumen-amber.css /
arc-constellation.js) untouched. `prestona255` read-only, untouched. Zero file
overlap with Lane B (FX-1 = integrations.js + state.js; B-M = components.css).
