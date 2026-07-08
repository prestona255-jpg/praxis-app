---
surface: cross-cutting
route: "—"
render_fn: "(multiple / infrastructure)"
ground: "n/a"
in_nav: no
state: untouched
rounds: 0
---

## State

Not a route — the infrastructure and multi-surface layer: tokens (`theme.css`,
`lumen-amber.css`), shared `components.css` rules, the Netlify proxies,
`firestore.rules`, the sync / durability boundary, the Yumi privacy-filter engine,
PWA / build. Findings here touch many surfaces at once; a token fix reaches the
whole app. The defect audit maps what's BROKEN; both instruments file here.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: CRITICAL] VC1 — Move-scan sends *Visible* journal entries to the model; the transparency view says it can't see them. `_visibleEntriesForScan` filters `isPrivate`-only and drops the categorical `register==='journal'` skip that the canonical `assembleContextData` filter has (yumi-brain.js:1916-1927 vs :222-226), so a Visible journal entry is withheld from #yumi-sees yet silently sent to the model — the transparency view actively lies (P-1/P-2/P-5).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: CRITICAL] VC1-b — A second, unguarded notebook reader feeds the proxy grader. `_memberBodies(ids)` (yumi-brain.js:1944-1951 → grader :2068,:2092) reads `e.body` with no privacy/journal guard of its own; its safety is purely inherited from the broken VC1 set, so the same leak flows through it and any future caller leaks unguarded.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: CRITICAL] F-DL1 — Silent unrecoverable cloud-save loss: the REPLACE-on-auth merge clobbered local writes on a second device for five of six collections (arcs/notebook/sub-theories/themes/artifacts) at integrations.js:130 (+4 twins). FIXED in c70f0dc/d1a8f6a (the F-DL1/2/3 latches).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] F-PX1 — The public LLM/vision proxy is an uncapped billing relay: no model pin, token cap, or rate limit (integrations.js:18; claude-proxy.js:47-58) — surprise-bill / cost-DoS once the URL is public.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] CC1 — Light-page meta ink `--ink-3/4→--meta` ~3.2:1 across ~216 sites, and ink-3==ink-4 collapses the ramp (theme.css:62-63,33) — AA fail on nearly all meta/label copy; the single highest-leverage token fix.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] CC3 — `--lum-ink-4` used for functional microcopy on dark = ~3.4–4.1:1 (byte-locked foundation) (lumen-amber.css:32; c11616/11630/11657) — AA fail; needs a foundations decision.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] CC4 — The type scale is untokenized fiction: 960 `font-size` declarations, only ~1.6% via `--fs-*`, ~60 literal values, ~190 sub-11px, half-pixel noise (theme.css:86-88) — the "inconsistent / hard-to-read type" root.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] CC5 — Two full token namespaces coexist (`--ink-*` vs `--lum-*`, 719 refs) — one thing styled two ways (lumen-amber.css + components.css); a cross-surface inconsistency root.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] CC6 — `.seg`/`.seg-opt` redefined 8+× in two contradictory visual languages (components.css:9761,9823,9920,9987,11308,11423,11617) — the segmented control looks different per surface.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] VC2 — Arc-voice evidence gathering excludes `isPrivate`-only, so a *Visible* journal entry reaches Yumi (yumi-brain.js:2271-2272) — covenant leak (VC1's narrow twin), P-2/P-5.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] F-RL1 — `publishedArcs` owner-update doesn't pin `authorUid` → self-misattribution via a hand-crafted write (firestore.rules:90) — public attribution integrity.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] F-SD1 — `marginaliaForBook` signed-out ownership filter fails open (`&& uid` short-circuits), defended only externally (views.js:7451) — inverts visible-when-out → visible-to-all.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] F-DL2 — Re-dirty flag is in-memory only; the page-hide flush was books-only for 5 collections (state.js:2462 +twins; flush :1025-1034) — multi-device staleness on write-fail+close. FIXED d1a8f6a.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] F-DL3 — Profile + readerModel outgoing-clobber on the sync boundary (integrations.js sync path) — data-loss latch (third of the family). FIXED v3.180.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] CC2 — Dark-ground `--ink-2/3/4` all → `--muted`, so only 2 ink tiers on every dark surface (theme.css:341-344) — flat hierarchy (contrast passes).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] CC12 — `--gold` (dark value) fails AA at 2.08:1 on light in 4 floating-chrome selectors (theme.css:358 vs :64,336-340) — gold-as-text unreadable on light.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] IA6 — No breadcrumb/wayfinding across the arc's three faces Field/Read/Build (on top of AF1) (views.js:8883-9063, 10522, 12628) — the nesting mental model is invisible.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] F-RL2 — `walkedBy` counter is inflatable by any authed user (no per-user idempotency) — a vanity number only (integrations.js:2881; firestore.rules:11-15).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] CC7 — 3 near-identical primary gradient buttons diverge; a 4th re-skins the shared one (components.css:869,1165,9660,11302).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] CC8 — `.eyebrow` re-declared 8× with drifting size/spacing/color (components.css:804,1864,9276,10903,10979,11137,11417,11938).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] CC9 — Card radius literals (10/12/18/14/16/22/11px) coexist with tokens (components.css e.g. c10899/10967/11052).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] CC10 — `--sp-*` spacing ~9% adopted (102 refs vs ~1100 literal px) (theme.css:77-82).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] CC11 — 35 raw `rgba(0,0,0,…)` box-shadows despite warm `--shadow-*` tokens (components.css:9668,10899,11052,11154,11302).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] CC13 — `--teal` as small text = 3.4–3.6:1 (legit as fill, fails only as text) (theme.css:37,172; c7747/7761).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade (PA5/PA4) — Galaxy-only reading shape: drop "field you read across" (bar chart) and make the constellation the single reading viz — luminosity = engagement, planet size = # books, genre counts (books + notes) (views.js:17708, 16188-16204; charter §3d). Redesign, medium. Spans #books/#account/#profile.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade (IA2) — Promote social-discovery to a top-level surface: `#commons`/`#reader`/`#walk` all set `activeRoute='account'` and have no first-class nav entry; the router branch already exists, so promotion needs only a nav `li` + an `activeRoute` case (views.js:398-407; index.html:26-31). Redesign, medium. Distinct from the §6-deferred signed-out commons item (OQ6).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade (IA7) — Re-weight the top nav: static About holds a permanent slot while Search/Profile/social have none; consider demoting About into Account/overflow and elevating Search or Commons (index.html:26-34). Polish, small.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade (IA8) — Resolve the two identity destinations: `#account` and `#profile` both render galaxy/identity; merge or clearly divide labor (Account = settings, Profile = public view) and dedupe the galaxy (views.js:17183-17196; refs PA4/PA5). Redesign, medium.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: open-question] OQ4 — `walkedBy` vanity metric (F-RL2): Gate it to one-per-user (a marker doc) / count server-side, or ratify it as an intentionally-ungated vanity number? P-4 says vanity metrics stay de-emphasized regardless.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: open-question] OQ5 — Proxy billing cap (F-PX1): Accept the uncapped-relay cost risk for launch, or add a model allow-list + `max_tokens` clamp + per-IP rate cap before going public? (Pass 1 flagged this as a July-8 fix-or-accept.)
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: open-question] OQ6 — Social promotion vs signed-out opening: Promoting Commons to top-level nav (IA2, in-scope) is distinct from opening `#commons`/`#reader`/`#walk` to signed-out users (a firestore.rules loosening the charter §6 deliberately defers). Confirm the split so the two aren't conflated in one change.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Program-decision] Part I.1 (Tier 0) — Publishing is two layers: a private FLOOR (a sub-theory marked 'published' is a private, self-only milestone; wires the existing read-only renderer plus a publish action; no standalone public sub-theory page) and an ELEVATED public goal (arc publishing becomes a first-class 2.0 goal — arcs publish to a profile, people follow each other, others see and interact with published arcs; the publishable unit is the arc, the sub-theory stays the private building block). Largest shift in the phase; Praxis moves toward a social space for knowledge; the public profile + following surface are a NEW Phase 3 build.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Program-decision] Part I.2 (Tier 0) — Founding principles kept as constraints, not cut: principles against follower-counts-as-primary-UI and against asymmetric knowledge are kept as shaping constraints on the social layer. Phase 3 posture: headline is always substance (who cited/built on your arc); following and reactions allowed; vanity metrics may exist but are never the primary surface; prominence is a Phase 3 dial. Noted risk: too-austere feedback can feel inert.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Platform-note] Notebook Platform note — markdown rendering is decided as platform-wide across all writing registers.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: REWORK] Writing surfaces REWORK — migrate the legacy editor (journal, arc-create, artifact, and the sub-theory body) onto the V1 'Lifted Sheet' canvas; unify the two separate Marginalia entry points into one. (Canvas is currently live only at Marginalia; everything else is a migration target.)
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: ADD] Writing surfaces ADD — a shared auto-grow utility, and author the writing-core contract document FIRST, before migrating, so the canvas has a spec.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Scope-boundary] Writing surfaces scope boundary — composing surfaces get the full canvas; chat and search inputs get auto-grow only. Migration order is sequenced in Phase 5.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: PWA/build] Part IV PWA / build — delete the dead files and orphaned functions; add committed parse-check harnesses; strict mode on the largest files; a cache-control and hashed-asset strategy to kill the manual cache-bump hazard; reconcile the load-order doc.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Build-hygiene] Part IV Carry as build-hygiene (incremental, opportunistic during the Phase 5 rebuild, not a feature decision) — begin decomposing the 14,526-line view module (53% of the client); the ES3 Promise shim; the hashed-asset work.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Ships-now] Part V — Ships now (Phase 5 build, once mockups exist): all behavior, correctness, performance, security, and accessibility fixes across every surface; the publishing FLOOR (private milestones), the writing-canvas migration, the notebook Yumi pedagogy, the lineage system, the categories taxonomy and override, the durability pattern, export; the global hygiene sweep and the cut-now portion of the dead code.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Held-Phase-3] Part V Held for Phase 3 — the per-surface visual mockups themselves.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Held-Phase-3] Part V Held for Phase 3 — held FORM decisions: note-body type and notebook style, the orientation tabs-versus-toggle choice, and the rest of the form-not-intent items flagged throughout.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: note] Part V — What Phase 3 inherits: the full INTENT layer. The vision doesn't reopen WHAT Praxis should do (settled here); it decides HOW it should look and feel, and it designs the two genuinely new surfaces (the social profile and the living field) this phase scoped but left to be drawn with the whole picture in view.
- [source: pass3-scope.md 2026-07-07] [status: unverified] [sev: unknown] Scope ambiguity #5 — Propose-vs-report tension: charter §3d invites proposals for values/connections; the Pass-3 base task caps at one-line direction. Reviewer must pick which governs.

## Round history

## Next
