---
surface: yumi-sees
route: "#yumi-sees"
render_fn: renderWhatYumiSeesPage (views.js:14733)
ground: dark
in_nav: no
state: untouched
rounds: 0
desktop: composed
---

## State

`#yumi-sees` → `renderWhatYumiSeesPage` (views.js:14733); dark ground (keyed in `umberGroundDark`, views.js:397; retains a bright transparency panel inside); reached from the Yumi panel. "What Yumi sees" transparency.

**ONE builder, THREE mounts — the bleed law for this surface.**
`buildTransparencyContent` (`views.js:14562-14725`) feeds all three:

1. the routed page — `section.yumi-sees-page > section.transparency-panel` (`:14738`)
2. the Notebook inline panel — `div#notebook-transparency-host > section.transparency-panel` (`openTransparencyView`, `:14535`) — **no `.yumi-sees-page` wrapper**; adds the page-absent `.transparency-close`
3. the Yumi slide-over overlay — `div.yumi-panel-sight-view > section.transparency-panel` (`yumi-ui.js:1128-1138`) — **no `.yumi-sees-page` wrapper**, and **not named in the builder's own doc comment**, which claims only two consumers

⇒ every page rule MUST be `.yumi-sees-page`-scoped or it restructures both overlays. (The W10
Lane B block, `components.css:3397`, already states this invariant; DW-4 verified all three
mounts live.) The three also run at DIFFERENT widths from identical markup — page 1080
(now 1208 at ≥1200), Notebook panel 1180 (`.notebook` `components.css:9661` wins over the dead
`:1255` 1080 rule), overlay ~333.

**The routed page can NEVER show a current book / arc / sub-theory.** The router
(`views.js:676-683`) nulls `currentBookId` / `currentArcId` / `currentSubTheoryId` *before*
calling the renderer. So 3 of 7 sections are structurally always-empty on this route; signed-out,
2 more are (`assembleContextData` gates summary + turns behind `activeUid`). Live: 7 sections,
5 empty. **The surface owns ZERO interactive elements** — the Close button is panel-only.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] PA2 — The bright honey #yumi-sees panel re-pins `--ink-3/4→--meta` → 11px #9a7e4e on honey ~3.2:1 (components.css:3490-3491) — AA fail on a privacy-critical surface.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: ADD] Yumi panel ADD — a signed-out prompt on What-Yumi-Sees (signed-out-parity).

## Round record — DW-4 (2026-07-14)

- `commits:` `d555114..d555114 (1)`
- `gates:` D1 56.7%→**63.4%** @1920 (naive leaf-span and panel-span AGREE — the `.yumi-sees-closing` envelope artifact is neutralised, not hidden) · D2 framing **138.3ch→51ch**, section-body 72.0ch, entry/artifact body 68.5ch · D3 hScroll 0, overflowers 0 · D4/D5 surface owns zero interactive elements; body 16px unchanged · signed-out composes · **both overlay mounts verified UNCHANGED** · ≤1199 provably inert (CSSOM block-deletion, 0-bit delta at 390 and 1024). Chip → `composed` (under-claimed).
- `defects-found:` 2 — D2: the framing prose ran **138.3ch**, the worst measure in the wave, past D0's own reference violation (Arcs, 137ch); **not one of the surface's six prose selectors carried a `ch` cap**, and `.transparency-panel` declares no `max-width` at all, so every measure it had was inherited. · D1: 56.7% @1920 from a fixed 1080px column with no `min-width` rule.
- `lessons:` ONE builder feeds THREE mounts and only the page wraps in `.yumi-sees-page` — every rule must carry the page scope. The third mount (the Yumi slide-over, `yumi-ui.js:1128`) is **not named in the builder's own doc comment**; a pass that trusted the comment would have shipped a bleed into it.
- `lessons:` `rig.chOf` on a block measures the BOX, not the ink — `.transparency-section-label` "reads" 126ch and `.yumi-sees-closing` 136ch, but both are short strings in wide boxes (the D0 envelope artifact). Filter prose by text length before believing a ch number.
- `lessons:` `.transparency-entry-meta` is left at 99.4ch as D2-exempt chrome (11px mono single-line caption, not a prose block — DW-3's display-heading exemption). The composition improved it 150.9ch→99.4ch as a side effect. Recorded, not silently capped.
- `evidence:` `docs/checkpoints/dw-4.md`, `docs/checkpoints/dw-4-recon.md` §3–§5

## Round history

## Next
