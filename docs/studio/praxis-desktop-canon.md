# Praxis Desktop Canon — v1

What the Universal tokens are to color and the mobile canon is to
phones, this document is to wide screens. Every surface ships
desktop-canon-native from R9a forward; existing surfaces conform
through the Desktop Wave (DW).

Evidence base: docs/studio/desktop-recon.md (D0, HEAD 6184d31).
The recon's finding in one line: every surface is a fixed centered
column that never uses the width — composition is absent, not broken.

This document is rendered by the Builder and never hand-edited.
Plain-language presentation lives in the generator; this text is
canonical.

---

## D1 — Composition tier

At min-width: 1200px, a primary page-surface must COMPOSE the
viewport: a second functional region (rail, sidebar, margin
apparatus, paired panel) or a deliberately widened, justified
layout. Center-and-gutter is not composition. The 1200 tier is
ADDITIVE — the 759/760 breakpoint and all behavior below it are
untouched.

Check: at 1920×1080, primary content region(s) occupy ≥60% of
viewport width, measured by sampled rects, OR the surface carries
a ledger-recorded exemption naming why a governed single column is
the right form for it.

Reference violation: About at 1920 — 66% of the viewport is empty
gutter (D0 §2).

## D2 — Reading measure

Primary prose blocks are capped at 60–72ch using the existing
ch-cap idiom (.about 56ch and .read-list 62ch are the in-repo
precedents). Composition never widens text to fill space; when D1
widens a layout, prose keeps its measure and the extra width goes
to a second region or to justified margins.

Check: live-measured widest text-bearing prose block ≤72ch at
1280, 1440, and 1920.

Reference violation: the Arcs teaching paragraph at 137ch (D0 §2).

## D3 — Scroll discipline

No horizontal document scroll at any desktop width. Page surfaces
declare box-sizing: border-box; fixed-width children never exceed
their container.

Check: scrollingElement scrollWidth == clientWidth at 1280, 1440,
and 1920.

Reference violation: .bk-surface 32px h-scroll at all three widths
(ON-7; box-sizing fixed only ≤759px).

## D4 — Pointer affordance

Every interactive element in the desktop tier carries a hover
state and cursor: pointer. Hover is enrichment, never the only
door: anything reachable by hover must remain reachable by
click/tap (parity with mobile canon P1–P9).

Check: sampled interactive elements show a computed style delta on
hover; no functionality exists only behind :hover.

Baseline: 334 :hover rules in components.css (D0 §1) — the idiom
is healthy; this law formalizes it for new work.

## D5 — Density and scale

The ≥1200 tier may step DISPLAY elements up one notch (h1, hero
numerals, metric figures). Body text never scales up — measure and
composition do the work. Where D1 puts more content per row,
vertical rhythm tightens accordingly; a composed layout must not
read sparser than the narrow one.

Check: computed body font-size at 1920 equals the base-tier value;
h1/display steps recorded per surface in the ledger.

## D6 — Keyboard focus

Interactive elements in the desktop tier show a visible
:focus-visible treatment, tokens-only colors, never suppressed
outline without replacement.

Check: sampled focus-visible outline present on top-nav links,
primary buttons, and chips on each surface.

---

## Application law

Structural composition work (D1, layout regions) is PASS/WAVE work
— never overnight. Sizing-only conforming items (a ch cap, a
box-sizing declaration, a focus ring) are overnight-eligible under
the standing overnight rail (CSS + views.js only, max 3/night,
commit-no-push).

## Chip law

The Builder carries a desktop status chip per surface:
stretched → composed → native. All surfaces default to
"stretched" (D0 evidence). Upgrades happen only via ledger
evidence from a DW pass or a felt-passed round — never by
assertion.

## Rails restated

Tokens-only color (Universal v1.2); no --lum-* in new CSS; strict
ES3 in views.js; the 1200 tier is written as new @media blocks in
components.css after base rules (source order beats equal
specificity); verification = the two-layer gate run at 1280/1440/
1920 with the D0 rig (stubbed auth, fixture, SW-clear).
