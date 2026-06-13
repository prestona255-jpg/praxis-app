# Praxis — BUILD STATE (canonical)

> **This file is the single source of truth for "where the work stands."**
> It replaces the two stale HTML trackers, which stored their checkbox state in
> `localStorage` (not git) and drifted ~70 cache bumps behind reality. This file
> commits its state as diff-reviewable text and is updated in the **same commit**
> that finalizes each checkpoint, so it can never go stale on the desktop again.

**Authoritative as of:** 2026-06-12
**Live:** https://praxis-reading.netlify.app
**Live CACHE_VERSION:** `praxis-v3.97`
**HEAD == origin/main:** `276d3db`
**Schema:** `state.js` static initializer `SCHEMA_VERSION: '1.9.3'` (the pinned
seed-ladder literal, never bumped); `migrate()` chain terminal step = **1.17.0**
(`state.js` ~line 1857). Runtime schema is 1.17.0; the 1.9.3 literal is expected.

**Provenance:** reconstructed and verified against `git log` (300 commits) +
`sw.js` CACHE_VERSION + `docs/checkpoints/` on 2026-06-12 (recon:
[checklist-rebuild-recon.md](../checkpoints/checklist-rebuild-recon.md)).
Refresh this stamp on every update.

**Retired artifacts (git-recoverable at these final SHAs):**
- `Praxis_Build_Checklist.html` — deleted; last content at `c0ddfe5` (2026-06-08,
  "stamp 9.6c shipped" — it predates all of Stage 10).
- `Praxis_Roadmap.html` — deleted; last content at `40de91f` (2026-06-12, the 10.5
  ship). The detailed forward-stage specs (Stage 11/12/13) live in that blob; recover
  with `git show 40de91f:"docs/Checklist and Roadmap/Praxis_Roadmap.html"`.

---

## Status legend (controlled vocabulary)

| Term | Meaning |
|---|---|
| **SHIPPED+VERIFIED** | Commit landed + checkpoint/commit record + live confirmation with recorded evidence. |
| **SHIPPED-UNVERIFIED** | Code is in the live bundle, but a required pass-check is AWAITING or was human-handed (not contract-grade executor evidence). A residual to close. |
| **DEFERRED** | Deliberately not built; has a gate or a reason. |
| **PLANNED** | Roadmap-only; no code exists. |
| **REVERTED** | Shipped then rolled back. |

**Column conventions.** Stage 10 and the open/forward sections carry the full
per-substage schema (ID · Status · Cache@ship · Commit · Checkpoint · Live-verify ·
Residuals) — that is the live format for active work. Settled pre-protocol stages
(0–6.x) carry a leaner table (ID · Substage · Status · Commit · Notes); their
verification was **commit-based** (they predate `docs/checkpoints/`), and their cache
bumps live in `sw.js` history. Per-substage update model: a row reaches
SHIPPED+VERIFIED only when its checkpoint (or commit record) shows parse PASS +
in-band byte deltas (deviations classified, not silently widened) + matched grep
counts + a live-DOM pass-check with recorded evidence (`ss_` id / session id).

---

## 1. Shipped stages (0 → 10)

Build did **not** run in numeric order: 14.x shipped before 9.6; 3.10 and 9.6 substages
landed out of alpha order; 10.3 shipped before 10.2. Sections below are in build order.

### Stage 0 — Yumi voice document foundation — SHIPPED+VERIFIED
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 0 | `yumi-voice.md` v1.0.0 | SHIPPED+VERIFIED | `cd125c1` | Later v1.1.0 `e39af30`, v1.1.1 `469c28c`; v1.2.0 length-cap flagged non-gating at 2.10 re-audit. |

### Stage 1 — Repo skeleton, state, auth, ISBN, PWA — SHIPPED+VERIFIED (2026-05-01→05)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 1.1 | Repo skeleton (state, integrations, stubs, manifest, sw) | SHIPPED+VERIFIED | `ba03c4d` | |
| 1.2 | State schema (collections, loadState/saveState/migrate) | SHIPPED+VERIFIED | `cccbf3f` | |
| 1.3 | Firebase + Google Auth | SHIPPED+VERIFIED | `55197a3` | |
| 1.4 | ISBN fetch (Open Library → Google Books fallback) + merge | SHIPPED+VERIFIED | `142b485`,`8719592` | |
| 1.5 | PWA shell (sw + manifest + favicon) + follow-ups | SHIPPED+VERIFIED | `a62ca03`,`0d205e6`,`2c45b1e`,`c9cc16d` | |
| 1.5c | Cleanup: verify-engine removal, schema 1.1.0, auth observer, proxy gate | SHIPPED+VERIFIED | `e58ab85` | |

### Stage 2 — Yumi brain, UI, voice input, context + memory — SHIPPED+VERIFIED (2026-05-05→13)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 2.1 | Yumi-brain skeleton (voice-doc preload + buildSystem) | SHIPPED+VERIFIED | `5ef6bd6` | |
| 2.2 | Claude proxy live test (GATE-OFF) | SHIPPED+VERIFIED | `a67a140` | |
| 2.3 | Yumi UI scaffold (panel, toggle, greetings) | SHIPPED+VERIFIED | `e1fbeda` | |
| 2.4 | Wire brain → UI, remove testProxy | SHIPPED+VERIFIED | `ba151a8` | |
| 2.5 | Voice input (tap-to-toggle, append) | SHIPPED+VERIFIED | `9913fc3` | cache v2.5 |
| 2.6a/b | currentBook/Arc schema + buildContext into system prompt | SHIPPED+VERIFIED | `ae33511`,`68b4133` | |
| 2.7a/b-i | yumiMemory field (1.3.0) + recentTurns (1.4.0) | SHIPPED+VERIFIED | `f9bea78`,`8cd0731`,`7513401` | |
| 2.7b-ii a–f | recentTurns append/cap, summarizer rollover (1.5.0), prompt v3, length, replacement framing, examples-as-illustration | SHIPPED+VERIFIED | `64305e0`,`c4b649c`,`4712d53`,`4cbb060`,`9b7838c`,`6990384`,`3341853` | The summarizer/memory-leakage chain. |
| 2.8 | Voice-compliance audit + 2.9 scope | SHIPPED+VERIFIED | `7f0427e` | |
| 2.9 | Voice v1.1.0 + re-audit | SHIPPED+VERIFIED | `e39af30` | 5/6 PASS, test #13 FAIL noted → v1.1.1. |
| 2.10 | Voice v1.1.1 routing-rule restructure + re-audit | SHIPPED+VERIFIED | `469c28c` | Test #13 PASS; Stage 2 closed. |

> ⚠ The stale tracker's "Stage 2.6 / 2.7" Milestones are a **resequenced future**
> namespace (Yumi context+arc voice, eval layer), NOT this shipped Stage 2. See §3.

### Stage 3 — Notebook, privacy/transparency, Books shelf, covers, finish/artifact, status — SHIPPED+VERIFIED (2026-05-14→15)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 3.1 | Notebook surface scaffold (1.6.0) | SHIPPED+VERIFIED | `225af47` | |
| 3.2 | Journal entry creation (1.7.0) | SHIPPED+VERIFIED | `8507d82` | |
| 3.3 | Marginalia from book detail | SHIPPED+VERIFIED | `9bcc03d` | |
| 3.4a | Privacy filter at Yumi-context layer (1.8.0) | SHIPPED+VERIFIED | `e3b48a2` | Constitutional Principle #5. |
| 3.4b | Privacy toggle UI + register defaults | SHIPPED+VERIFIED | `21e4315` | |
| 3.6a | Extract `assembleContextData` + `getContextSnapshot` | SHIPPED+VERIFIED | `47f99b6` | Single enforcement point for Principle #5. |
| 3.6b | Transparency view ("What does Yumi see?") | SHIPPED+VERIFIED | `4e08ea9` | |
| 3.5a | Books shelf + add-book editor (1.9.0, 3 stages) | SHIPPED+VERIFIED | `33a717e`,`6a5f6b1`,`8f7a96e` | |
| 3.5b | ISBN + cover render + metadata backfill (4 stages) | SHIPPED+VERIFIED | `26ff4da`,`7f92ef0`,`793dc3d`,`46f8dca` | |
| 3.7 | finishedAt + Artifact + Notebook unification (multi-stage) | SHIPPED+VERIFIED | — | Shipped before 3.5c. |
| 3.5c | Bulk add | SHIPPED+VERIFIED | — | Shipped after 3.7. |
| 3.7c | Status selector + 6-branch status matrix | SHIPPED+VERIFIED | — | |
| 3.5d / 3.5e | (Superseded by visible banner) | DEFERRED | `83e7992` | Never shipped; superseded. |
| 3.7b | Library surface | DEFERRED | — | Roadmap-only. |

### Stage 3.8 / 3.9 — Knowledge Arcs (data, creation, attach, detail/delete) — SHIPPED+VERIFIED (2026-05-18→19)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 3.8.1 | Arc data layer + schema 1.9.2→1.9.3 | SHIPPED+VERIFIED | `964441f` | The pinned 1.9.3 seed literal originates here. |
| 3.8.2a | Arc creation UI | SHIPPED+VERIFIED | `11a71e1` | |
| 3.8.2b | Attach pickers (book + entry) | SHIPPED+VERIFIED | `019160e` | This is the channel 9.3 later verifies. |
| 3.9 | Arc detail view + delete-arc | SHIPPED+VERIFIED | `29ec979` | |

### Stage 3.10 — Visual styling pass + Firestore r/w + cover/metadata auto-resolve — SHIPPED+VERIFIED (2026-05-15→18)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 3.10a | Foundation + Stages 1–4 styling | SHIPPED+VERIFIED | — | |
| 3.10 Firestore | Read (Stage 1) + write mirror `/userBooks/{uid}` (Stage 2) | SHIPPED+VERIFIED | — | |
| 3.10d | title→cover adapter | SHIPPED+VERIFIED | — | |
| 3.10e | Auto-resolve cover/metadata | SHIPPED+VERIFIED | — | cache v3.10-c |
| 3.10h | Google Books via Netlify proxy | SHIPPED+VERIFIED | `b92720b` | cache v3.10-d / -h |
| 3.10b / b-i | Filters + mobile filter panel + SW fix | SHIPPED+VERIFIED | `e8e7dad` | cache v3.10-g |
| 3.10c | Style book detail / artifact / modals | SHIPPED+VERIFIED | — | cache v3.10-h |

### Stage 5.1 / 5.2 / 5.3 — Material pass, wheat-field ground, Arcs route + seed arc — SHIPPED+VERIFIED (2026-05-19→20)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 5.1 | Material pass A1–A4 (theme.css tokens) | SHIPPED+VERIFIED | `431597e`,`9510ced` | Per-surface application completed later via uplift runs. |
| 5.2 | Wheat-field mount (iterations 1b–1j; redraw-inline fixed 4-round invisibility) | SHIPPED+VERIFIED | `dda6419`…`1a306f7` | cache `-r` suffix. Micro-iterations rolled up. |
| 5.3 | Arcs route + teaching CTA + seed "A Pedagogy of Desire" + find-this-book (4 stages) | SHIPPED+VERIFIED | `6124324`,`4b5f0bb`,`ab3bba5`,`9703e24`,`b728eff` | |

### Stage 5.4 — Arc list/web view-mode toggle — MIXED (2026-05-20→22)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 5.4 Stage 1a–1f | View-mode helpers, list/web toggle, branch, wheat-field mount | SHIPPED+VERIFIED | `7ce4620`…`8926da5` | cache v3.11-a |
| 5.4 Stage 2a-1..6 | Web tokens, `renderArcWebBookNode` primitive, one-node mount | SHIPPED+VERIFIED | `e33e2f5`…`2d11a01` | cache v3.11-b. Primitive later removed as dead code in 7.1B. |
| 5.4 Stage 2b-1..3 | Spine + 5-node mount | **REVERTED** | `929d7a4`,`b220355`,`969d851` revert `e39dda3`,`e9c73be`,`24b75c4` | cache v3.11-c rolled back. Re-scoped to constellation. |

### Stage 5.6 — Tradition data model + register glyphs on shelf — SHIPPED+VERIFIED (1st attempt REVERTED) (2026-05-22)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 5.6.1 (1st try) | Tradition data model | **REVERTED** | `15ec251` reverted by `12ba756` | 116/121 books lost tradition — **Firestore merge bypasses `migrate()`** (the canonical lesson). |
| 5.6.1 (redo) | Tradition model (1.11.0) + `ensureBookFieldsAll` on merge path + `ensureBookFields` on 3 creation sites | SHIPPED+VERIFIED | `7e460eb`,`b2998e4`,`af80a0a` | 3-commit split. |
| 5.6.2–5b | Register color tokens, `renderRegisterGlyph`, shelf glyph, tradition dropdown, engagement-saturation wiring | SHIPPED+VERIFIED | `e3506b0`,`24924b4`,`77fb606`,`8476582`,`f0f892e` | |

### Stage 5.7 — Notebook entry deletion + seed-pass propagation — SHIPPED+VERIFIED (2026-05-23)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 5.7.1 | Notebook entry deletion UI w/ cascade | SHIPPED+VERIFIED | `91f1214` | |
| 5.7.2 | Propagate seed-pass to arc picker + notebook list | SHIPPED+VERIFIED | `c5ef918` | |

### Constellation 7.1 / 7.2 — Arc-constellation renderer wired into arc-detail web view — SHIPPED+VERIFIED (2026-05-26→27)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| Constellation 0–3 | Source docs → CSS vars → tradition-form renderer → arc-constellation renderer + test pages | SHIPPED+VERIFIED | `19c9ac8`,`9fffb1f`,`54b7b97`,`45ebe4d` | |
| 7.1A | Script tags + constellation data adapter | SHIPPED+VERIFIED | `8cc4ed6` | |
| 7.1B | Wire `renderArcConstellation` into web view; remove dead `renderArcWebBookNode`; backfill seed traditions | SHIPPED+VERIFIED | `c48966d`,`8f093b0` | |
| 7.2 | Desktop + mobile field test | SHIPPED+VERIFIED | — | `STAGE_9_FIELD_NOTES.md`. Seed arc viewable signed-out (`46f7169`,`7e64bb4`). |

### Stage 8.1 — Constellation interactivity (hover / click / keyboard) — SHIPPED+VERIFIED (2026-05-31)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 8.1A | Data attributes for interactivity | SHIPPED+VERIFIED | `d671e1a` | |
| 8.1B | Tooltip + click layer | SHIPPED+VERIFIED | `bc31d5d` | |
| 8.1C | Keyboard focus + tab order | SHIPPED+VERIFIED | `b2cdea4` | prefers-reduced-motion respected. |

### Stage 9.1–9.5 — Sub-theory model, writing surface, note→evidence, field test, sub-theory constellation — SHIPPED+VERIFIED (2026-06-02→03)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 9.1 | Sub-theory data model (1.12.0, `ensureSubTheoryFields` chokepoint) | SHIPPED+VERIFIED | `2662a31` | localStorage-only; Firestore mirror → Stage 12. |
| 9.2 | Sub-theory writing surface + evidence rail + `addEvidence` + Yumi presence | SHIPPED+VERIFIED | `6fec418`,`b6004b0` | |
| 9.3 | Note → evidence channel | SHIPPED+VERIFIED | — | Verification checkpoint (no build — picker existed from 3.8.2b); richer channel → 10.1. |
| 9.4 | "Write one sub-theory inside Praxis" | SHIPPED+VERIFIED | — | **Load-bearing field test** → `STAGE_9_FIELD_NOTES.md` (F3→Stage 11, F4 autosave, F5/F6 backlog; F6 closed by 10.5.6). |
| 9.5 | `renderSubTheoryConstellation` replaces books-as-glyphs; `linkSubTheories` built here | SHIPPED+VERIFIED | `ba59a5a` | Re-skinned by 9.6b. |

### Stage 14 (INF-1..4) — Workspace sync, multi-user isolation, account lifecycle, SW freshness — SHIPPED+VERIFIED (2026-06-03→06)
> Built **before** 9.6 (out of numeric order). The stale tracker showed all four UNCHECKED and called INF-1 "the single biggest launch blocker" — wrong; it shipped.

| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| INF-1 / 14.1a–c | Workspace sync: per-uid `/userArcs`,`/userNotebook`,`/userSubTheories`; `arcsDirty` chokepoint; direct sub-theory userId | SHIPPED+VERIFIED | `d24fd6b`,`68b7201`,`c27e44a`,`fd4333f`,`2378b59` | |
| INF-2 / 14.2 | Multi-user isolation (uid-scoped reads/writes, clean sign-out) | SHIPPED+VERIFIED | `a21d6d8` | |
| INF-3 / 14.3 | Account lifecycle: `userProfiles`, `exportWorkspace`, `deleteAccount` (5-collection fan-out), `#account` page + styling, signed-in email | SHIPPED+VERIFIED | `84504c9`,`e82da83`,`47bdb1d`,`f352ca8`,`3fc66f1`,`c215660`,`8d0c0f4`,`fdfaf75` | cache v3.15→v3.17 |
| INF-4 / 14.4 | SW freshness (controlled skip-waiting + update-prompt) | SHIPPED+VERIFIED | `b9ee166`,`e547c52` | cache v3.19 |

### Stage 9.6 — Constellation becomes a luminous workspace — SHIPPED a/b/c; 9.6d PLANNED (2026-06-06→07)
| ID | Substage | Status | Cache | Commit | Notes |
|---|---|---|---|---|---|
| 9.6a | Position schema + persistence | SHIPPED+VERIFIED | v3.20 | `caf86f7` | |
| 9.6b | Luminous 16-mark static re-skin | SHIPPED+VERIFIED | v3.21–v3.25 | `d39e05a`,`e5427da`,`d3bf42b` | Contrast tuned (b.1), mark-distribution fixed (b.2). |
| 9.6c | Interactivity: control bar / drag / hover cards / **Connect** + resonance edges | SHIPPED+VERIFIED | v3.23–v3.27 | `66ff194`,`54e0108`,`fba9a12`,`7a2c976` | **Connect shipped at 9.6c.4 (`7a2c976`)** — later regressed by 6.2b onboarding (panel overlay), **RESOLVED** at `2e2f028` / v3.98 (audit #1). |
| 9.6d | **Book evidence layer** (gray book glyphs from `evidence[].refId`, dotted tethers, intersection bridges, book-attach, Books toggle) | **PLANNED** | — | — | Authored in spec/checklist/roadmap (`s9-6d`); never shipped. Nearest unshipped constellation sub-stage. |

### Visual Uplift / Theme / Hybrid / Chrome / design-spec — SHIPPED+VERIFIED (2026-06-08→11)
> This is the stale tracker's "Visual System Uplift" *initiative* actually executed.
| ID | Substage | Status | Cache | Notes |
|---|---|---|---|---|
| Theme Phase 1 | Re-ground base palette to medium honey | SHIPPED+VERIFIED | v3.28 | `ca1c80d`,`adf0fc9` |
| Phase 3.1 / 3.2 batches | Per-surface uplift (shelf, notebook, book, writing, account, arcs) + foundation chrome | SHIPPED+VERIFIED | →v3.40 | mockups ingested as ground truth. |
| Hybrid A–C.2 | Constellation restage (marks/legend/Layers/book squares) | SHIPPED+VERIFIED | v3.41–v3.44 | |
| Chrome / Spotlight / Home | lowercase wordmark; ⌘K spotlight (new `js/spotlight.js`); Home landing route + hero/preview | SHIPPED+VERIFIED | v3.45–v3.50 | |
| A1/A2 + B1–B3 | book-detail grid fix, `.notebook` cap, quiet constellation/embed/marks | SHIPPED+VERIFIED | v3.51–v3.55 | |
| SW Reload-banner fix | Pass API/streaming without `respondWith`; unpin worker | SHIPPED+VERIFIED | — | `852f441`,`79f9177` |
| design-spec stages 1→9b-iv | Code-derived `design-spec.md` conformance (Parts A/B + constellation 9b: 16 marks, channels, muted palette, symbol picker, celestial drift) | SHIPPED+VERIFIED | ~v3.55→v3.82 | Cache bumps live in `sw.js` (not in commit subjects). |
| Sub-theory delete affordance | Wire `deleteSubTheory` (chip + hover-card) with cascade | SHIPPED+VERIFIED | — | `b376073` |
| Home embed uplift (slice 9a) | Widen embed viewBox, embed-scoped suppressions, `markScale` seam | SHIPPED+VERIFIED | v3.82 | `fe285be` |

### Stage 6.x — Shelf-photo scan/vision, first-run onboarding, transparency surface — SHIPPED+VERIFIED (2026-06-11→12)
| ID | Substage | Status | Commit | Notes |
|---|---|---|---|---|
| 6.1b | Shelf-photo capture + `vision-proxy.js` (Netlify fn) + canvas downscaler | SHIPPED+VERIFIED | `467297a`,`55ddc48` | |
| 6.1b.1 | Harden extraction (sonnet-4-6, temp 0, transcription-only) | SHIPPED+VERIFIED | `cc031bf` | |
| 6.1c | Scan hand-off → prefill bulk editor | SHIPPED+VERIFIED | `48b9b9e` | |
| 6.2a | Per-title scan review editor | SHIPPED+VERIFIED | `47e1f86` | |
| 6.2b / b.1 | First-run six-beat Yumi greeting; clear stale panel on auth change | SHIPPED+VERIFIED | `f93aaef`,`a6a3af2` | |
| 6.2c-pre / 6.2c | Journal private-by-default migration; "What Yumi sees" page + affordance | SHIPPED+VERIFIED | `f4b0a2a`,`4b4b438` | |
| 6.2-polish | Transparency copy (page-true framing) | SHIPPED+VERIFIED | `b062992` | |

### Stage 10 — Evidence and citation subsystem — SHIPPED, LIVE praxis-v3.97 (10.5.8 DEFERRED) (2026-06-12)
Checkpoints: `docs/checkpoints/10-2..10-5(+recon).md`. 10.1 predates the checkpoints dir.

| ID | Substage | Status | Cache@ship | Commit | Checkpoint | Live-verify evidence | Residuals |
|---|---|---|---|---|---|---|---|
| 10.1 | Send-to-sub-theory evidence channel (picker, toast, affordances, house-language) | SHIPPED+VERIFIED | v3.91→v3.92 | `c93e710`,`bb177f9` | (commit-only; predates dir) | Commit + MEMORY record | — |
| 10.3 | External quote: stable `refId` (UUID) + required title; migration 1.15.0→1.16.0 | **SHIPPED-UNVERIFIED** | v3.93 | `390a0b5`,`abcd03a` | `10-3.md` | Automated: live CACHE_VERSION fetch + `migrate()` idempotency harness PASS. **6 eyes-on UI checks human-handed, never re-run in test session.** | Re-run the 6 UI checks (empty-title block, title-only save, non-null refId, backfill-on-reload, rail locality, no phantom book) + rail before/after screenshots in `prestonpraxistest@gmail.com`. |
| 10.2 | Inline citation live-preview: parse `*asterisk*` spans, dots, hover card, ambiguity chooser | **SHIPPED-UNVERIFIED** | v3.94 | `883a430` | `10-2.md` | Built; corroborated indirectly by 10.4/10.5 (built on it, passed). **Own pass-checks + screenshots logged AWAITING.** | Run 10.2's own live pass-checks + capture preview-pane screenshots (one resolved + one unresolved italic). Session-only pins residual was CLOSED by 10.5.7. |
| 10.4 | `renderSubTheoryReadOnly` (draft/published) + numbered evidence block + see-also; **Privacy Gate A** | SHIPPED+VERIFIED | v3.95 | `be73c1b`,`dd9c0c1` | `10-4.md` | 4/4 live checks PASS in test session (`ss_4057nchry`,`ss_1935adwc4`,`ss_1277wiq9n`,`ss_1528hgbn6`). Private-entry evidence excluded from published render (no marker/count); owner-only rail tag. | — |
| 10.5.1–10.5.7 | Citation UX: Attach-evidence flatten, Cite button, autocomplete, coach line, tap support, Write/Preview toggle (Gate→Option C), persist pins (1.16.0→1.17.0 `citationPins`) | SHIPPED+VERIFIED | v3.96 | `40de91f` | `10-5.md` | 7/7 functionally PASS live (`ss_9112ucbcj`,`ss_8439d8aoz`); pinned ambiguous cite survives reload. | Two post-ship defects A+B (fixed in 10.5.9). |
| 10.5.9 | Cleanup: fix Defect A (blue Cite link → muted) + Defect B (`citationPins` backfill on Firestore merge via standing `ensureSubTheoryFieldsAll`) | SHIPPED+VERIFIED | v3.97 | `2356479`,`276d3db` | `10-5.md` | Both re-verified live at v3.97: Cite link computed color = `--river`, no underline; 4 pre-existing fixtures report `citationPins` after synced reload. | — |
| 10.5.8 | App-wide writing-surface field treatment (border/surface tint, padding, prose max-width on **every** textarea) | **DEFERRED** | — | — | `10-5.md` (lines 120, 171) | — | = **audit bug #5** (see §4). Carries own comp-gate (before/after desktop+mobile, both registers, every textarea) + the 9.2/6.2 borderless-spec override note. Only open Stage 10 item. Not yet authored into a plan. |

---

## 2. In-flight / nearest-next

| Priority | Item | Status | Pointer |
|---|---|---|---|
| ~~1~~ | **Connect sub-theories regression** — broken since 9.6c.4 | ✅ RESOLVED · `2e2f028` / v3.98 | Closed — see **audit bug #1 (§4)**. Onboarding parked the z-9998 Yumi panel over the constellation; suppressed on `#arc/` routes + class-based toggle. |
| 2 | 10.2 / 10.3 verification residuals | SHIPPED-UNVERIFIED | Close in a dedicated verification pass (§5). Not a code change. |
| 3 | 9.6d book-evidence layer | PLANNED | Authored, never shipped; nearest unshipped constellation sub-stage. |
| 4 | 10.5.8 = audit bug #5 writing-surface field treatment | DEFERRED | Own comp-gate; cross-linked to audit #5 (§4). |
| 5 | Visual-uplift per-surface residual backlog | OPEN | Yumi panel, settings, empty states, onboarding polish. Initiative, not a dated stage. |

---

## 3. Deferred & forward (PLANNED — no code)

> Detailed specs for these live in the retired `Praxis_Roadmap.html` blob (`git show 40de91f:…`).

| ID | Item | Status | Notes |
|---|---|---|---|
| Stage 11 | Yumi transparency surface | PLANNED | Required before Stage 12; absorbs field-note F3 (Yumi-in-the-writing). Partly prefigured by 6.2c "What Yumi sees". |
| Stage 12 | Public publishing (12.1–12.5) | PLANNED | publish/unpublish + Firestore mirror + pen-name ("Roland Blair") + per-publication selector. Inherits Privacy Gate A (10.4). Relocated here from 9.1. |
| Stage 13 | Social & discovery | PLANNED | Below-the-line; design after Stage 12 + 60 days live. |
| 2.7 (resequenced) | Yumi eval layer | PLANNED | The tracker's future namespace — NOT the shipped Stage 2.7b memory chain. |
| 2.6 (resequenced) | Yumi context + arc voice (`getYumiContext` dead-stub) | PLANNED | Future namespace; not the shipped Stage 2.6a/b. |
| 6.3 | Shelf search | PLANNED | |
| 5.5 / 6.4 | Ambient sound + Yumi speaking aloud (TTS) | PLANNED | |
| 6.5 | Empty & first-run states | PLANNED | Partly absorbed by 6.2b greeting. |

---

## 4. Open audit-bug list

Source: design chat (was **not** in the repo before this file — only item #5 was ever
transcribed, as `audit bug #5` in `10-5.md`). Ordered **strongest-first**. #1 outranks
all (broken core function, pre-launch). "A Pedagogy of Desire" content work is saved for
the very end (after this list).

- [x] **1.** Connect sub-theories no longer works · regression since 9.6c.4 · **RESOLVED** at `2e2f028` / live **v3.98**. Root cause: onboarding parked the z-9998 Yumi panel over the constellation via two paths — auto-open on `#arc/` routes + the persisted `praxis_yumi_open` flag it set and never cleared; a real click on a covered mark hit the panel, `closest('[data-st-sub-id]')` returned null, `disarm()` fired (the connect handler / `linkedSubTheories` path / panel base CSS were byte-identical to 9.6c.4 — see A-1..A-3 diagnosis). Fix: suppress the panel on `#arc/` routes (`maybeStartOnboarding` gate + `renderYumiPanel` `!isArcRoute` + `hashchange` `suppressYumiOnArc`) and make the toggle class-based (no dead first click under suppression); connect handler / constellation render / panel CSS untouched. (A first route-gate-only attempt `a0458a2` was reverted `96d7cf3` — it missed the persisted-flag path.) **PARKED (logged, do NOT fix now):** (a) pre-existing manual-open overlap — deliberately opening Yumi on an arc still covers marks; not the regression. (b) onboarding still leaves `praxis_yumi_open=true` on non-arc pages — minor UX wart. (c) Preston's personal real-account "click panes, no connection" was never confirmed to be this overlay (account onboarded, panel closed); if it recurs, the parked lead is drift-target instability on the animated marks.
- [ ] **2.** Global search-result click does not navigate — ⌘K spotlight (`js/spotlight.js`) result selection does not route.
- [ ] **3.** Enter does not send in Yumi — Yumi input: Enter should send.
- [ ] **4.** Mobile pass, all pages — Full-app mobile sweep.
- [ ] **5.** Writing boxes feel weird / hard to engage · DEFERRED (comp-gate) — **Same tracked item as 10.5.8** (app-wide writing-surface field treatment; overrides a locked borderless spec). #5 ⟷ 10.5.8 — one item, two references, not two.
- [ ] **6.** Screen uploaded books for titles + read-status · feature — Extends the 6.1 shelf-photo scan toward read-status capture.
- [ ] **7.** User-created themes, Yumi-assisted · feature
- [ ] **8.** Developed account page · feature — Enhances the shipped 14.3.4 `#account` page.

---

## 5. Verification residuals to close (dedicated pass — do NOT bundle)

| Item | Why it's UNVERIFIED | Close by |
|---|---|---|
| 10.2 live pass-checks + screenshots | Logged AWAITING in `10-2.md`; only corroborated indirectly via later substages. | Run 10.2's pass-checks + capture screenshots in the test session. |
| 10.3 six eyes-on UI checks | Human-handed before the post-push contract existed; never re-run in the executor test-session pattern. Informal eyes-on ≠ contract-grade recorded evidence. | Re-run the 6 checks + rail before/after screenshots in `prestonpraxistest@gmail.com`. |

---

## 6. Reverts & lessons

| Event | Commits | Lesson |
|---|---|---|
| 5.6 sub-step 1 first attempt | `15ec251` reverted by `12ba756` | **Firestore merge bypasses `migrate()`** — schema migrations on remote-merged records must also touch the integrations.js merge path. 116/121 books lost tradition. |
| 5.4 Stage 2b full revert | `929d7a4`,`b220355`,`969d851` | Web-spine arc view rolled back (v3.11-c); re-scoped to the constellation. |
| Defect A (10.5) | fixed `2356479` | An `<a>` with no CSS rule falls back to the blue/underlined anchor default — add a rule mirroring the rail affordance. Same class as the 10.1-polish blue link. |
| Defect B (10.5) | fixed `2356479` | `citationPins` not backfilled on Firestore-merged records. **Standing fix:** `ensureSubTheoryFieldsAll` in the sub-theory merge backfills the full field set on every synced record — covers all future schema fields. |
| Design/privacy gates resolved | — | 10.2→Option A preview pane; 10.4 Privacy→exclude private evidence (no reader marker, owner-only rail tag — Stage 12 inherits this default); 10.5.6→Option C Write/Preview. |
| Stale-SW friction | — | A new bundle may only load after unregister-SW + clear-caches + double reload — the known manual-cache-bump cost. Every JS change after a CACHE_VERSION bump needs its own bump. |

---

## 7. Appendix — CACHE_VERSION timeline (milestone granularity)

| Cache | Milestone |
|---|---|
| v2.5 | 2.5 voice input |
| v3.10-a…-h | 3.10 visual + Firestore + cover resolve |
| v3.11-a / -b | 5.4 Stage 1 / Stage 2a (-c reverted) |
| v3.15→v3.19 | Stage 14 INF-1..4 |
| v3.20→v3.27 | 9.6a / 9.6b / 9.6c |
| v3.28→~v3.55 | Theme phases + Hybrid + Chrome + Home + A/B uplift |
| ~v3.55→v3.82 | design-spec conformance (Parts A/B + constellation 9b-i..iv) + sub-theory delete + home embed |
| v3.83→v3.91 | 6.x scan/vision + onboarding + transparency + 10.1 |
| v3.92 | 10.1-polish + Stage 10 execution-protocol setup |
| v3.93 | 10.3 external refId + required title |
| v3.94 | 10.2 inline citation preview |
| v3.95 | 10.4 read-only render + Privacy Gate A |
| v3.96 | 10.5 Citation UX |
| **v3.97** | **10.5.9 cleanup (Defects A+B) — current live** |
