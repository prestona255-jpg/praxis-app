---
surface: subtheory-page
route: "#subtheory/<id>"
render_fn: renderSubTheoryPage (anchor by name — grep '^function renderSubTheoryPage'; views.js ~10045 as-of-2026-07-11)
ground: dark
in_nav: no
state: closed
rounds: 1
mobile: native
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

## Round history

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
