---
surface: artifact
route: "#artifact/<id>"
render_fn: renderArtifact (views.js:11310)
ground: dark
in_nav: no
state: untouched
rounds: 0
desktop: composed
---

## State

`#artifact/<id>` → `renderArtifact` (views.js:11310); dark ground (keyed in `umberGroundDark`, views.js:397); sub of books. Finished-book artifact.

**FIVE render paths, ONE root.** `wrap.className = 'artifact-view'` is set at `views.js:11316`,
**before** the `!book` guard — so `.artifact-view` roots not-found (`:11319`), the signed-out
gate (`:11346`), empty (`:11360`) and the full read (`:11374`) alike. Any rule on the bare root
hits all four. The full read carries a `.artifact-read` modifier (DW-4, `:11381`) so the desktop
composition can reach it alone.

**The full read is SIGNED-OUT REACHABLE.** A seed `__praxis_seed__`-keyed artifact makes `podArt`
truthy, which falsifies the `&& !podArt` conjunct of the auth gate (`:11346`); `:11358`
(`if (!artifact && podArt)`) then assigns it and control lands on the full render — byte-identical.
The "seed bypass" is therefore **not a distinct DOM path**, it is a gate bypass. Conversely the
EMPTY path is provably signed-in-only: reaching `!artifact` requires `podArt` falsy, which reduces
the gate-false condition to `(user && user.uid)`.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] VC3 — A Book Artifact has no edit/delete after first write — visible to Yumi, not correctable (views.js:7842-7849, 10905-10966, 12956) — the P-5 correctability limb the code asserts.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] BD4 — The substrate link back to the book renders as plain `--ink-3` prose, no link chrome (components.css:3058-3065).
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Already-covered] Book detail Already covered — the artifact editor moves onto the canvas with markdown.

## Round record — DW-4 (2026-07-14)

- `commits:` `6554e9a..6554e9a (1)`
- `gates:` D1 37.5%→**60.8%** @1920 · D2 83.9ch→**72.0ch** @1280/1440/1920 · D3 hScroll 0 · D4 1/1 · D5 body 16px unchanged · D6 pre-existing global ring (`--river`, no radius) · all 5 render paths gated incl. signed-out · ≤1199 provably inert. Chip → `composed` (under-claimed; `native` awaits the deployed felt pass).
- `defects-found:` 2 — D1: the worst occupancy in the wave (37.5% @1920, below DW-3's book-detail at 42.9%) — a fixed 720px column at every width ≥760, with **no `min-width` rule of any kind** on the surface. · D2: the essay ran **83.9ch**, 12ch past the cap — `.artifact-body` had no cap and the column had a width but never a measure.
- `lessons:` `.artifact-view` roots ALL FIVE paths (className set at `views.js:11316`, before the `!book` guard) — an unscoped grid would have restructured not-found / empty / **signed-out**. The `.artifact-read` modifier (DW-2's `.home-composed` precedent) makes the composition structurally unreachable from the other four.
- `lessons:` The full artifact read is SIGNED-OUT REACHABLE via the seed `podArt` gate bypass (`:11346` / `:11358`) — the third instance of the named DW pattern after DW-2 Home and DW-STP2 seed. Signed-out belongs in every gate set on this surface.
- `lessons:` Both CSS readers computed the content box as `max-width − padding`; the surface is `content-box`, so `max-width` IS the content box. Live geometry (720px / 83.9ch) corrected the estimate (656px). Reproduce-first earns its keep.
- `evidence:` `docs/checkpoints/dw-4.md`, `docs/checkpoints/dw-4-recon.md` §3–§4

## Round history

## Next
