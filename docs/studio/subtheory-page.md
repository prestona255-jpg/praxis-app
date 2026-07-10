---
surface: subtheory-page
route: "#subtheory/<id>"
render_fn: renderSubTheoryPage (views.js:9751)
ground: dark
in_nav: no
state: untouched
rounds: 0
---

## State

`#subtheory/<id>` → `renderSubTheoryPage` (views.js:9751); dark ground; sub of arcs. Sub-theory detail (the Page).

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] AF1 — Build-vs-read: three doorways (Build workshop, the Page, and the arc Page-face stub) all edit the same `bodyPublic` and cross-link each other (views.js:10522, 9065, 12628) — none reads as authoritative; core build-vs-read confusion.
- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6-S2] [sev: HIGH] AF2 — The published sub-theory read page is bare (h2 + pre-wrap + `<ol>`), no hero/breadcrumb (views.js:8883-9063; css c6449-6507) — not the immersive read the craft promises. → CLOSED by R6 S2: `renderSubTheoryReadOnly` wrapped in the read hero + topbar/breadcrumb; finished = full-amber immersive room + walk-nav (felt pass pending).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] AF3 — `Public
- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6-S2] [sev: MEDIUM] AF4 — Read-only body styled with `--ink`/`--ink-2` in a `--lum-*` wrap — legible only by ground luck (components.css:6457,6477; views.js:9095) — fragile token cross-wiring. → CLOSED by R6 S2: the readonly wrap re-points to coherent `--lum-*` (one rule, works in both registers because `--lum-ink` is what `.stb-warm-dim` remaps); rig-verified dark-on-warm-dim + light-on-amber.
- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6-S1] [sev: MEDIUM] WL3 — The same `status='published'` transition is named "Set as milestone" vs "Publish" across faces (views.js:9185 vs :10621) — one act, two vocabularies (compounds AF1). → CLOSED by R6 S1: one word, both directions (Finish/Finished) on both faces; "Publish" reserved for the arc commons act.
- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6-S6] [sev: LOW] AF5 — The Page topbar "saved · when" is `--lum-ink-4` 11px ~3.4:1 (components.css:10886). → CLOSED by R6 S6: page `st-tb-saved`→`--lum-ink-3` (dark ground, ~7:1); workshop `stb-saved`→`--lum-ink-2` (cream, 4.8:1). (The other bare-on-field warm-dim labels remain the carried systemic ink-ramp residual.)
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: open-question] OQ1 — Published/Private vs Public/Intellectual: the maker wants the `Public
- [source: pass3-writing-loop.md 2026-07-07] [status: unverified] [sev: unknown (residual, not filed)] Residual (not filed here; thread for Lane B/IA) — What status='published' visibly DOES for a sub-theory (beyond the pill + read-only render at 9101) was not fully traced to a commons/surface payoff; if it has no downstream visibility, 'Publish' overstates.
- [source: r6-subtheory-recon.md 2026-07-10] [status: verified] [sev: LOW → R9] R6-OWN — neither `renderSubTheoryPage` nor `renderSubTheoryBuild` checks `subTheory.userId === user.uid`; a signed-in user can open/edit another user's `#subtheory/<id>[/build]` by hash alone. Server-side backstop VERIFIED (`firestore.rules:47-50` gates read AND write to `request.auth.uid == uid`), so severity is LOW — named debt for R9's owner-vs-visitor round. R6 S2 preserved the W12 signed-out gate EXACTLY; no owner guard added (Preston's ruling, 2026-07-10).

## Round history

## Next
