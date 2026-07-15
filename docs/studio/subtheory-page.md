---
surface: subtheory-page
route: "#subtheory/<id>"
render_fn: renderSubTheoryPage (anchor by name — grep '^function renderSubTheoryPage'; views.js ~10045 as-of-2026-07-11)
ground: dark
in_nav: no
state: closed
rounds: 1
mobile: native
desktop: composed
---

## State

`#subtheory/<id>` → `renderSubTheoryPage` (anchor by name — grep `^function renderSubTheoryPage`; views.js ~9838 as-of-2026-07-10); dark ground; sub of arcs. The **read / author-view** surface after R6 (no editor): DRAFT = warm-dim contained panel · FINISHED = full-amber immersive room + walk-nav. **CLOSED R6 (v3.190, `4c8f73e`, felt-passed 2026-07-10).**

## Decisions

- **R6 (v3.190, felt-passed 2026-07-10):** the Page becomes READ (decision #4) — `renderSubTheoryPage`'s editor (canvas / citation-engine / evidence-rail) removed; it now wraps `renderSubTheoryReadOnly` in a hero + breadcrumb. Ground by status (decision #6): DRAFT = warm-dim, FINISHED = full-amber immersive room + `st-walknav` (siblings via `_arcDetailBuildSubTheoryData`). Single Edit door → the workshop. Finish reopen-pill on the FINISHED Page only; none on draft (Preston ruling). Private-evidence filter preserved.
- **Felt-pass rulings (2026-07-10):** (1) warm-dim = a **CONTAINED panel** on the dark ground — **DECIDED, not debt**; (2) the **cyan flag dot** on the "Finished" reopen pill (`components.css:10738`) — **KEPT** (pre-existing, mockup-kept; a status flag, not Yumi's voice); (3) newborn-card persistence on notebook re-entry — **PASSED** (coherent with "stays put").

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6] [sev: HIGH] AF1 — Build-vs-read: three doorways (Build workshop, the Page, and the arc Page-face stub) all edit the same `bodyPublic` and cross-link each other (views.js:10522, 9065, 12628) — none reads as authoritative; core build-vs-read confusion. → CLOSED by R6: ONE editor (the workshop, S3 `066e056`); the Page lost its canvas (S2 `4a2b3cf`); the notebook births only (S5 `9f0f8b5`). Write lives in one room, read in another — authoritative by construction.
- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6-S2] [sev: HIGH] AF2 — The published sub-theory read page is bare (h2 + pre-wrap + `<ol>`), no hero/breadcrumb (views.js:8883-9063; css c6449-6507) — not the immersive read the craft promises. → CLOSED by R6 S2: `renderSubTheoryReadOnly` wrapped in the read hero + topbar/breadcrumb; finished = full-amber immersive room + walk-nav (felt pass pending).
- [source: fable-audit-combined.md 2026-07-07] [status: verify-closed-superseded] [sev: HIGH] AF3 — `Public/Intellectual` dual-register (ledger row was truncated). → SUPERSEDED before R6: R5 S4 register collapse replaced Public/Intellectual with Published/Private on a single `bodyPublic` (idempotent `bodyIntellectual→bodyPublic` migration); R6 S1 `78174f5` unified the transition vocab (Finish/Finished). No live Public/Intellectual toggle remains (grep-confirmed across R5/R6).
- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6-S2] [sev: MEDIUM] AF4 — Read-only body styled with `--ink`/`--ink-2` in a `--lum-*` wrap — legible only by ground luck (components.css:6457,6477; views.js:9095) — fragile token cross-wiring. → CLOSED by R6 S2: the readonly wrap re-points to coherent `--lum-*` (one rule, works in both registers because `--lum-ink` is what `.stb-warm-dim` remaps); rig-verified dark-on-warm-dim + light-on-amber.
- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6-S1] [sev: MEDIUM] WL3 — The same `status='published'` transition is named "Set as milestone" vs "Publish" across faces (views.js:9185 vs :10621) — one act, two vocabularies (compounds AF1). → CLOSED by R6 S1: one word, both directions (Finish/Finished) on both faces; "Publish" reserved for the arc commons act.
- [source: fable-audit-combined.md 2026-07-07] [status: fixed-R6-S6] [sev: LOW] AF5 — The Page topbar "saved · when" is `--lum-ink-4` 11px ~3.4:1 (components.css:10886). → CLOSED by R6 S6: page `st-tb-saved`→`--lum-ink-3` (dark ground, ~7:1); workshop `stb-saved`→`--lum-ink-2` (cream, 4.8:1). (The other bare-on-field warm-dim labels remain the carried systemic ink-ramp residual.)
- [source: fable-audit-combined.md 2026-07-07] [status: verify-closed-superseded] [sev: open-question] OQ1 — Published/Private vs Public/Intellectual: the maker wants the `Public…` (ledger row truncated). → RESOLVED: R5 S4 settled the axis as **Published/Private** (single body); R6 kept it and named the transition **Finish/Finished** ("Publish" reserved for the arc commons act). No open question remains on this surface.
- [source: pass3-writing-loop.md 2026-07-07] [status: unverified] [sev: unknown (residual, not filed)] Residual (not filed here; thread for Lane B/IA) — What status='published' visibly DOES for a sub-theory (beyond the pill + read-only render at 9101) was not fully traced to a commons/surface payoff; if it has no downstream visibility, 'Publish' overstates.
- [source: r6-subtheory-recon.md 2026-07-10] [status: verified] [sev: LOW → R9] R6-OWN — neither `renderSubTheoryPage` nor `renderSubTheoryBuild` checks `subTheory.userId === user.uid`; a signed-in user can open/edit another user's `#subtheory/<id>[/build]` by hash alone. Server-side backstop VERIFIED (`firestore.rules:47-50` gates read AND write to `request.auth.uid == uid`), so severity is LOW — named debt for R9's owner-vs-visitor round. R6 S2 preserved the W12 signed-out gate EXACTLY; no owner guard added (Preston's ruling, 2026-07-10).
- [source: r6-subtheory close 2026-07-10] [status: named-debt] [sev: LOW, systemic] R6-INK — bare-on-field warm-dim ink-ramp: `.stb-eyebrow` / `.st-tb-kicker` / `.st-tb-back` (`--lum-ink-3`/`-4`) sit outside any card on the warm-dim cream field at ~2.1–2.5:1 (AA-fail). Mockup R1 eval + R6 Stage-0 flagged it; R6 S6 fixed only the elements it touched (saved-meta). NAMED DEBT — wants a systemic warm-dim ink-ramp retune (a future decision), NOT per-element patches. Felt-pass ruling 2026-07-10: CARRIED.
- [source: DW-3 reproduce-first spot-check 2026-07-14] [status: CLOSED DW-STP2 v3.207] [sev: MEDIUM] DW-STP2 — subtheory-page ALREADY D1-composes at ≥1200 (occ 79.9%; `.st-page` `max-width:1180` + 2-col grid `minmax(0,1fr) 240px`) and passes D3 (hScroll 0 @1280/1440/1920), D4 (9/9 pointer), D6 (focus-visible present) — BUT **FAILS D2**: the main read prose `.subtheory-readonly-body` is **86.4ch** (825px / 20px serif, `max-width:none` — uncapped). Preston's DW-3 chip-truth rider was conditional ("if they pass, mark composed"); D2 fails, so the surface was NOT flipped to `desktop: composed` — it stays `stretched` with this named gap. Fix = a ≤72ch cap on `.subtheory-readonly-body` scoped to `@media(min-width:1200px)` (a small CODE change, outside the docs-only rider's scope → its own overnight/round item; the read view is R6-owned, so compose-within). Evidence: `docs/checkpoints/dw-3.md`. → **CLOSED by DW-STP2** (`components.css:11287-11326`, ONE rule `.st-page.lum-amber-deep .st-grid .subtheory-readonly-body{ max-width:72ch }`; true 1200-blocks 8→9). Rig reproduced DW-3 **exactly** (825px / 86.4ch) before the fix, then **72.0ch / 686.9px at 1280 / 1440 / 1920**; D1 textSpan **unchanged** (98 / 92 / 81.5%) — the cap cost zero occupancy; same prose reflows 32→39 lines. `≤1199` byte-inert (`max-width:none` @1199 and @390; grid still collapses to 342px @390). The `.st-grid` scoping is load-bearing — see **DW-STP2-SEED**. Evidence: `docs/checkpoints/dw-stp2.md`.
- [source: DW-STP2 live re-verify 2026-07-14] [status: CLOSED DW-STP2 v3.207] [sev: MEDIUM] **DW-STP2-D6** — D6 coverage on this surface was far thinner than the ledger's "focus-visible present" implied: live, **only 1 of 11** interactive elements was matched by any `:focus-visible` rule (`.st-hero-mark-ed`); **uncovered** were `st-tb-back`, `st-pill-publish` (the PRIMARY button the D6 check names explicitly), `st-edit-door`, `st-conn-row` ×2, `st-conn-add`, `st-yumi-dismiss`, `st-walknav-side` ×2, `vr-add`. → **CLOSED by DW-STP2**: 8 ring selectors added inside the same `@media(min-width:1200px)` block, reusing the DW-3 book-detail literal verbatim (`outline:2px solid rgba(255,206,74,.5); outline-offset:2px; border-radius:6px`, `:11079`). Live re-verify: **11/11 covered, 0 uncovered** at 1280 / 1440 / 1920 (CSSOM match-test — `:focus` computed style reads idle on a connected tab). **Correction of record:** this was first filed `PROPOSED — not fixed`, on the reasoning that DW-3 scored D6 by *sampled presence* and that book-detail + subtheory-build held `composed` on that same loose rubric, making a tightening a program-level rubric change. **`praxis-reviewer` disproved that premise and it was wrong**: DW-3 did not score its composed surfaces loosely — it **BUILT** their rings (**27 `:focus-visible` rules added across `1e0dc18..f15fb2a`**; book-detail `:11072-11079` in `03ecb9d`, sub-theory build `:11538+` in `939eb73`). subtheory-page got a docs-only spot-check and zero CSS. So consistency with the siblings required **adding** the rings, not skipping them; skipping would have shipped `composed` on a weaker standard than every surface it cited — the Chip law's "by assertion". Rings are also explicitly overnight-eligible/sizing-only under the canon's Application law, the same bucket as the ch-cap. No rubric change was needed and none was made.
- [source: DW-STP2 red-team + reviewer 2026-07-14] [status: OPEN] [sev: MEDIUM] **DW-STP2-SEED** — the **seed / worked-example read path is uncomposed at every desktop width**. `renderSubTheoryPage` renders `__praxis_seed__`-owned sub-theories ("A Pedagogy of Desire") through a **structurally different branch** (`views.js:10418`): `.st-page.lum-amber-deep` → `.subtheory-readonly` directly, with **no `.st-grid`, no `.st-center`, no `.st-read-hero`** — so no 1180 column, no rail, no centering. The prose runs **full-bleed at 132.6ch @1280 / 199.7ch @1920**, far past D2, and D1 does not compose. This path is **reachable signed-out** (the sentinel bypasses the auth gate at `:10404`) and is the **public face of the worked example** — plausibly a visitor's first sight of a sub-theory. NOT in DW-STP2's scope (its cap is deliberately `.st-grid`-scoped so it cannot half-touch this branch — an unscoped selector stranded a 687px column at x=0 under a full-bleed header, which is what the red-team BLOCKED). D6 rings DO cover it (a ring is additive on any path). Filed here because DW-STP2 measured it and both gates flagged its absence from the ledger. **The `desktop: composed` chip is scored on the COMPOSED (owner) variant only** — this branch is a separate, unclaimed surface variant. Wants its own decision: compose the seed read like the owner read, or deliberately keep it a plain full-bleed reading page.

## Round history

- **DW-STP2 — desktop reading measure (D2) — SHIPPED-LOCAL v3.207, 2026-07-14 → `desktop: composed`.**
  The standalone close of the gap DW-3 named and deferred (`be050e5`). CSS-only, ONE rule in a new
  `@media(min-width:1200px)` block (`components.css:11287-11309`) — additive, `≤1199` untouched:
  `.st-page.lum-amber-deep .st-grid .subtheory-readonly-body{ max-width:72ch }`.
  **Compose-within**: the grid keeps its composition, only the prose re-measures.
  Gates at 1280 / 1440 / 1920 — D1 textSpan **98 / 92 / 81.5% (identical to baseline)** · D2
  **86.4ch → 72.0ch** · D3 hScroll **0** · D4 **10/10** · D5 body **20px** (base-tier, no ≥1200
  step-up). `≤1199` proved byte-inert (`max-width:none` @1199 + @390). Rig reproduced DW-3's
  825px / 86.4ch **exactly** before the fix. Screenshots time out in this rig (DW-3's finding) —
  DOM geometry is the evidence; **the visual gate is Preston's felt pass on the deployed build**,
  so the chip is under-claimed `composed` (felt pass decides `native`).
  **`.st-grid` in that selector is load-bearing — a red-team BLOCK, not decoration.**
  `renderSubTheoryReadOnly` mounts on TWO paths under `.st-page.lum-amber-deep`: the composed read
  (`→ .st-grid → .st-center → .st-read-hero`) and the **seed / worked-example read**, which has no
  `.st-grid`, is full-bleed, and is **reachable signed-out** via the `__praxis_seed__` sentinel
  (`views.js:10418`). The first cut was an unscoped descendant selector: it capped the seed path too,
  stranding a **687px column at x=0 beneath a still-full-bleed 1264.7px header** — an undesigned
  composition, on the public face of "A Pedagogy of Desire". Caught pre-commit by `fix-red-team`
  (same class as DW-2's signed-out ≥1200 BLOCK, remedied there by scoping to `.home-composed`).
  Scoping to `.st-grid` anchors the cap to the *cause* of the 825px column — no grid, no wide
  column, nothing to cap — and lifts specificity to 4 classes, so the rule no longer depends on
  source order. Re-verified both paths: seed `max-width:none` / body 1264.7px == header 1264.7px
  (byte-inert), composed still 72.0ch. That branch is now filed as **DW-STP2-SEED**.
  **D6 rings shipped in the same block — `praxis-reviewer` caught a wrong call.** The build first
  filed D6 as `PROPOSED — not fixed`, arguing the siblings held `composed` on a loose
  sampled-presence rubric. That premise was **false**: DW-3 *built* its rings (27 `:focus-visible`
  rules across `1e0dc18..f15fb2a`) and subtheory-page simply never got any (1/11 covered). Skipping
  them would have shipped this chip on a weaker standard than the surfaces it cited. 8 ring
  selectors added, DW-3 literal verbatim → **D6 11/11 at 1280 / 1440 / 1920**. Gap **DW-STP2-D6**
  CLOSED, not proposed. Record: `docs/checkpoints/dw-stp2.md`.

- **R8 — value-mark register — SHIPPED v3.195 (`37ea1f0`), 2026-07-11.** The read Page gained the owner-only
  **value-mark register** footer (`buildValueMarkRegister('subtheory', …)`, `.vr-*`) — a reader gesture, NOT a
  prose edit (the workshop stays the sole editor, R6 #4). Persists on `state.subTheories[id].valueMarks` via
  `markSubTheoriesDirty`+`saveState`. Owner-gated (seed + signed-out early-return above). Live smoke: Care
  mark survived the Firestore round-trip.

- **R6 Sub-theory (DEEP) — SHIPPED v3.190, CLOSED 2026-07-10** (the Page half; covered with `subtheory-build` — see that ledger's Round history for the full beat/commit record, `78174f5 → 4c8f73e`, felt-passed FULL PASS 2026-07-10). This surface: `renderSubTheoryPage` rebuilt as the read/author-view (editor removed, S2 `4a2b3cf`). Ledger: AF1/AF2/AF4/AF5/WL3 CLOSED · AF3/OQ1 superseded · ownership → R9 named debt (`R6-OWN`) · warm-dim ink-ramp → named debt (`R6-INK`).

- **MW-3 Sub-theory mobile pass — SHIPPED-LOCAL v3.194 (2026-07-11), `mobile: native`.** The read
  Page half (warm-dim draft + full-amber finished room). Commit `99f7fb0` (with the workshop, one
  commit) — CSS-only. **P8 (the substantive fix):** the FINISHED room's author topbar-right stacked
  saved + Finished pill + "Edit in the workshop →" (nowrap, base `flex:0 0 auto`) = ~496px → a ~130px
  h-scroll at 390 (scrollWidth 492). `.st-tb-right{ flex-wrap:wrap; width:100% }` constrains it to the
  wrapped topbar line so its children wrap → **scrollWidth 390, 0 offenders** (the DRAFT topbar was
  already clean — R#3/R#2 stripped saved+pill). **P3:** `.st-tb-back` (16→44, the read's EXIT),
  `.st-hero-mark-edit` (30→44×44); covered already: pill-publish/conn-add/conn-row/edit-door/
  walknav-side. Read-only Page → P7 n/a. Live-390 rig + praxis-reviewer PASS. Record:
  `docs/studio/reports/mw3-2026-07-11.md`.

## Next

- **Mobile pass DONE (MW-3).** Both sub-theory faces are `mobile: native`. Nothing outstanding on
  the mobile axis.
- **Desktop: `composed` (DW-STP2, v3.207) — awaiting the felt pass** to earn `native`. **D1–D6 all
  hold** at 1280 / 1440 / 1920 on live evidence (D6 now 11/11, rings built).
- **DW-STP2-SEED is the one open desktop question here** — the signed-out seed / worked-example read
  renders an uncomposed full-bleed branch (132.6ch @1280, 199.7ch @1920) that the `composed` chip
  does NOT cover. Decide it deliberately: compose it like the owner read, or keep it a plain
  reading page. It is a visitor's likely first sight of a sub-theory.
- **Worth checking in the SCAN round (an observation, not a claim):** DW-3 ringed *8 named controls*
  per composed surface. Whether 8 is that surface's FULL interactive set was never measured — the
  same 1/11 gap this build found here could exist there. Cheap to re-measure with the DW-STP2 CSSOM
  match-test; no claim made until someone does.
