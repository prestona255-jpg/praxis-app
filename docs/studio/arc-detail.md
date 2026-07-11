---
surface: arc-detail
route: "#arc/<id>"
render_fn: renderArcDetail (views.js:12691)
ground: dark
in_nav: no
state: closed
rounds: 1
mockup: docs/studio/mockups/arcs.html
mobile: native
---

## State

`#arc/<id>` → `renderArcDetail` (views.js:12060); dark ground; sub of arcs. Arc detail / constellation.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: VERIFY-CLOSED] [sev: HIGH] OG3 — The one shareable payoff dead-ends: a signed-out visitor exploring the seed arc reaches an impressive interior (and the Arcs examples) with no "sign in to build your own" CTA (views.js:12040-12065, 3546-3641) — the best conversion moment asks nothing. [fix: shipped BEFORE R5 — the signed-out seed-arc interior appends a "Build your own arc" sign-in CTA (renderArcDetail, live at views.js:13196-13199: `if (arc.userId === '__praxis_seed__' && !user) buildSignedOutPrompt(...)`), and renderArcsPage appends the signed-out list CTA. Verified present at HEAD 27b4878.]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.189 1da97e3] [sev: MEDIUM] F-MA1 — A signed-out viewer can drag/connect (mutate) the "read-only" seed arc locally (views.js:12460; arc-constellation.js:1292; state.js:1991,2129) — read-only contract violation (non-persisting). [fix: R5 S1 — `_subSeedLocked(sub)` (state.js) no-ops `setSubTheoryPosition` / `linkSubTheories` / `unlinkSubTheories` when the record is seed-owned (`userId === '__praxis_seed__'`) and the current user is not the sentinel. Verified safe vs the delete-cascade (fires ONLY when a seed sub is involved; normal↔normal cascade untouched).]
- [source: fable-audit-combined.md 2026-07-07] [status: CLOSED v3.189 a4ad4d2] [sev: LOW] AF6 — Duplicate "+ Sub-theory" affordances (header + control-bar + Page-face) (views.js:12148,12277,12648). [fix: R5 S2 D4 — consolidated into ONE canonical `.arcfield-addsub-canon` in the head control column (`.arcfield-headctl`), visible across all three faces. The header instance, the dead unappended `stControlBar` instance, and the Page-face empty-state CTA were all removed; the rail add-sub is KEPT (the mockup retains it as the in-context field affordance).]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: PARTIAL v3.189 8a17a0c] [sev: Program-decision] Part I.4 (Tier 0) — Dead constellation code (~1,200 lines) is split, not bulk-deleted: CUT NOW the genuinely dead (orphaned halo/grain definitions, dead focus-ring CSS, three superseded mark helpers); PARK for Phase 3 (~750–1,160 lines) the book-era substrate and book-constellation renderer for the Layers redesign to decide. The core renderer is a protected, byte-frozen invariant from the Umber port — not touched speculatively. Every deletion grep-verified for membership. [fix: R5 S6 — the genuinely-dead `.arcs.lum-amber` arcs-list skin CUT (grep-verified zero JS callers). `renderArcConstellation` lives in the byte-FROZEN `arc-constellation.js` (Δ=0 invariant) — NOT cut; the book-era substrate stays PARKED per the split. Residual dead classes (`.st-register-toggle`, `.arcfield-read-*`, `.itx-sub*`) listed with proof → S-C sweep. Renderer untouched (Δ=0 proven).]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: SUPERSEDED v3.189 f6563bc] [sev: ADD] Arc interior ADD — a List view with sub-theory rows. [fix: superseded — the List FACE was retired at Wave 1 (F-D1); its sub-theory-rows function is ABSORBED into the R5 S3 Read spine (`_arcReadSpine`: mark · title · maturity glow · first line · connection count rows). Supersession chain: List view (pre-W1) → retired (F-D1) → Read spine (R5 S3, f6563bc).]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: CLOSED v3.189 1da97e3] [sev: FIX] Arc interior FIX now — the arc-voice request rejection path. [fix: R5 S1 — `requestArcVoice` now wires `YumiBrain.considerArcVoice(arcId).then(onFulfilled, arcVoiceFail)` — a rejection (gate threw / network failed / grade errored) renders the inline fallback + re-enables the trigger, instead of hanging the "…" placeholder. js/views.js.]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: REWORK] Arc interior REWORK — exit-returns-to-origin (verified against the shipped route-fix).
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: PARTIAL v3.189 8a17a0c] [sev: Held-Phase-3] Arc interior Held for Phase 3 — ALL field-feature enhancements: the spine chip, tooltips and keyboard focus, labeled books, tap-preview, the mobile touch model. The field is the redesign's centerpiece and invariant-protected, so building features on it now risks throwing them away. Safeguard: a mobile-usable arc field is a non-negotiable Phase 3 requirement (revisit a mobile stopgap if Phase 3 slips). The hold covers FEATURES only, never contrast or a11y bugs. [fix: R5 shipped the READ-side — mark tooltips (D6) + keyboard focus rings on the Read-face controls (real; constellation ring latent — frozen renderer); the flat Read list → the deterministic Read SPINE (S3). STILL HELD on the constellation field itself: spine-chip / labeled-books / tap-preview, and the **mobile touch model** — now a NAMED SLOT in sequence.md (non-negotiable, per Preston).]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Cut-now+park] Arc field / constellation — Cut now + park per the Tier 0 split.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: PARTIAL v3.189 8a17a0c] [sev: FIX] Arc field / constellation FIX now (dual-ground a11y root-fix, CSS and tokens only, verified NOT to touch the protected renderer) — the constellation's dual-ground text response; a focus ring on marks; the thread color promoted to a token. [fix: R5 S6 — a focus-ring on marks added (CSS-only `[data-st-sub-id]:focus-visible`, latent until the frozen renderer's nodes carry tabindex; real focus rings shipped on the Read controls). The interior chrome's dual-ground text is handled by the S2 warm re-point (the field stage stays cognac by design). The thread-color-to-token promotion + residual field a11y → S-C sweep.]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Fix-or-fold] Arc field / constellation Fix or fold — center-label wrap.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Held-Phase-3] Arc field / constellation Held for Phase 3 — the Layers rebuild.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: VERIFY-CLOSED (field) / carried (Layers+mobile)] [sev: Held-Phase-3] Part V Held for Phase 3 — the arc-interior 'living field' redesign: the held field features, the Layers system, and the non-negotiable mobile-usable mandate. [fix: the 'living field' interior SHIPPED at Wave 1 (the lum-amber Living Field; the umber `renderArcConstellation` is dead). R5 warmed its chrome to the ground spectrum + built the Read spine. HELD: the Layers system (R11 / deferred); the mobile-usable mandate = the NAMED SLOT in sequence.md.]
- [source: fable-audit-charter.md §4 2026-07-06] [status: CLOSED v3.189 1da97e3] [sev: P1/P2-friction] §3c — "Tidy" and other buttons whose function isn't self-evident. [fix: R5 S1 D5 — the `.arcfield-tidy-help` caption ("Tidy composes an open arrangement for this session only — Restore brings back what you saved. Reset placements permanently clears every saved position; it cannot be undone.") + `.arc-reset-btn` danger styling + the ⚠ affordance; the destructive Reset stays behind the in-DOM confirm (openArcResetConfirm). js/views.js + assets/components.css.]

## Round history

### R8 value-mark register — SHIPPED v3.195 (`37ea1f0`, 2026-07-11)

`renderArcDetail` gained the owner-only **value-mark register** card under the head
(`buildValueMarkRegister('arc', …)`, `.vr-*`, same gate as the publish control — excludes seed arcs).
Persists on `state.arcs[id].valueMarks` via `markArcsDirty`+`saveState` (rides the userArcs doc; no new
collection). Self-contained `--vr-*` palette so it reads AA on the warm-dim arc chrome (where `--lum-ink`
is cream — the praxis-reviewer HOLD). Live smoke: Doubt mark survived the Firestore round-trip.

### MW-2 mobile pass — SHIPPED-LOCAL (2026-07-11, commit 900aa4f; chip → mobile: native)

Arc-detail (the living field) half of the MW-2 mobile wave. **Chip: `mobile: native`** —
`docs/studio/reports/mw2-2026-07-11.md`.
- **P3 (the change):** several interior controls were sub-44px → 44px at ≤759:
  `.arcfield-pub-btn` (27), `.arcfield-addsub-canon` (29), `.arc-voice-ask` (29), the
  add-sub/page `.btn` primaries (39/40), the read-face sub-theory links `.read-list .read-title a`
  (23), `.read-change-mark` (13); + a specificity match on `.arcfield-page-open` so the Page CTA
  flex-recenters. Live @390: all 44-64px, 0 sub-44 remain across all faces; @1265 unchanged.
- **P8 PASS already (no change):** all 3 faces (Field/Read/Page) @390 — scrollWidth 390,
  0 offenders, with a real **26-node constellation** rendered (renderer untouched — locked).
- **P6 SATISFIED:** the Field/Read/Page faces seg switches faces (exercised all 3, 44px).
- **P5 n/a** (orientation anchor is the faces seg, not a sticky title — a sticky faces-seg is a
  possible follow-up). **P1/P2/P4/P7/P9 n/a.** CSS-only (+18/−0), desktop byte-unchanged.
  praxis-reviewer CLEARED (one cosmetic `.btn` display-collision residual RESOLVED).

### R5 CLOSED — felt pass PASSED IN FULL (2026-07-10, deployed v3.189, commit 27b4878)

R5 Arcs was ONE round covering both `#arcs` (list) and `#arc/<id>` (this interior). The full
stage-by-stage record + rulings live in `docs/studio/arcs.md` → Round history (R5). For the
interior specifically, R5 shipped: **F-MA1** seed-mutation guard (S1), the **arc-voice rejection**
fix (S1), **D5** self-evident Tidy/Restore/Reset (S1), the **warm-dim interior** + **deep-cognac
softened field stage** (S2, the GROUND SPECTRUM — CLAUDE.md §7), **D4/AF6** one canonical
+Sub-theory control (S2), the deterministic **Read spine** replacing the flat list (S3), the
register collapse on the sub-theory surface (S4), the **D3** head publish/unpublish + staleness
(S5), the **walk mark-identity** fix (S5), and **mark tooltips + focus rings** (S6). Route stays in
`umberGroundDark` (Option-B). Held: the constellation **mobile touch model** (named slot in
sequence.md) and the **Layers** rebuild (R11/deferred). Round closed on Preston's felt pass.

## Next
