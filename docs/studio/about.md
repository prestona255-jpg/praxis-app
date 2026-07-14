---
surface: about
route: "#about"
render_fn: renderAbout (views.js:18330)
ground: dark
in_nav: yes
state: untouched
rounds: 0
desktop: composed
---

## State

`#about` → `renderAbout` (views.js:18330); dark ground; in top-nav (about). About / orientation.

## Decisions

## Gap ledger

- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Hygiene] About Hygiene → sweep — orphaned pre-port CSS, with a verify-first caveat: the 'rearm-card accordion' in that block must be grep-checked to confirm it's the OLD dead one, not the LIVE onboarding rearm, before cutting.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] About FIX now — reconcile the hero-glyph sizing to one source; secondary text to AA.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: REWORK] About REWORK — the orientation switcher to proper semantics (real tablist or real toggle); the tabs-versus-toggle choice is a mockup detail.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Rebuild-requirement] About Rebuild requirement — the mobile three-column triad and the wide SVG figures.

## Round history

## Round record — DW-1 (2026-07-14)

commits: 68f46a9 (1, the About slice; DW-1 batch 68f46a9..cache-bump)
gates: PASS — D1 occupancy 63.4% @1920 (95.5/84.8% @1280/1440, `.about` box 1208); D2 prose 56ch (colophon real text 68.4ch); D3 hScroll 0 @1280/1440/1920; D4/D6 spine + `.mtog` gold focus-visible + scroll-spy active-state verified; ≤759 (390) and 760–1199 (1024) byte-equivalent to baseline (spine display:none, single 640 column).
defects-found: 0 in-scope. Out-of-scope flagged: DW-STN-A11Y — About SVG `.stn`/`.pipe` stations are onclick-only (no keyboard focus), pre-existing.
lessons: In the headless verify pane neither IntersectionObserver nor requestAnimationFrame nor screenshots fire — build scroll-spies as synchronous scroll handlers and prove composition by DOM geometry, not IO/rAF/pixels.
evidence: docs/checkpoints/dw-1.md (Stage 1) · docs/checkpoints/dw-1-recon.md. Chip stretched → composed (D1–D6 on evidence; native awaits the felt pass).

## Next
