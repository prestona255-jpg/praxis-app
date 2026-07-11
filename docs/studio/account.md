---
surface: account
route: "#account"
render_fn: renderAccountPage (views.js:17109)
ground: dark
in_nav: yes
state: untouched
rounds: 0
---

## State

`#account` → `renderAccountPage` (views.js:17109); dark ground; in top-nav (account). Account hub.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] PA1 — Account cross-links ("View your public profile →" etc.) render as mono labels with a near-invisible underline (components.css:11899-11905) — the "links look accidental" friction.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade (VC5) — Flagship values-preset moment: today values are a buried free-text "What you're reading toward" field; the maker wants a first-run, preset-driven values moment ("Love is liberation," etc.). Storage (`setProfile{values}`) already exists to receive it (views.js:17213-17262). Gap, medium.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Export] Account / reader-portrait Export (high priority) — complete the export NOW: artifacts, lenses, and reader-model, user-filtered, from a single source of truth. Import/restore and making the cloud a first-class citizen ride the durability closeout.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] Account / reader-portrait FIX now — keyboard and tab-index on the chips; extend the try/catch umbrella over the reader-model, transparency, and data tail; dark-mode contrast to AA.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: REWORK] Account / reader-portrait REWORK — unify the DUPLICATED reader-model consent toggle into one; add a re-entrancy guard on the page render.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Rebuild-requirement] Account / reader-portrait Rebuild requirement — the mobile galaxy and the import panel.

## Round history

- **R8 — Values (retrofit + values section) — SHIPPED v3.195 (`37ea1f0`), 2026-07-11.** The values section
  ("What you're reading toward") gained the **Yumi value-RETROFIT**: a button-triggered, metadata-only,
  eval-gated suggestion panel (offer-cards accept/rename/reject) that adds a DECLARED value (a `profile.values`
  stone) — NEVER auto-marks an object. Ember scope (`.account-retro-*`, `--lum-*`). The copy-contract on the
  values note was corrected ("…Yumi may notice values your shelf carries, but never fills them in for you").
  Partially closes VC5 (the flagship values-preset moment — the onboarding beat is the other half). Live
  smoke: real proxy returned grounded suggestions ("Power Named", "Relational Ground"); accept added a stone,
  `noAutoMark` verified. touches: renderAccountPage.

## Next
