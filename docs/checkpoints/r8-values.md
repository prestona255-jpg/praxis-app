# R8 — Values · BUILD checkpoint

**R8 VALUES STARTED** — 2026-07-11. HEAD at build start `f6c3a5a` (mockup spec commit). Target CACHE_VERSION v3.194 → **v3.195** (bump LAST). Recon: `docs/checkpoints/r8-values-recon.md`. Mockup/spec: `docs/studio/mockups/values.html`.

## Locked decisions (Preston, this round)
- **Model A — shared vocabulary.** `profile.values` (the declared "stones") IS the value vocabulary. Marks reference its string slugs. Mark field key is distinct: **`valueMarks`** (no alias with `profile.values`).
- **Tag + lineage.** A mark = `{ value: <string>, why: <string> }`. Sits **beside** the shipped `movedMe` (untouched).
- **Scope = all four:** preset moment (onboarding beat) · marks on book/sub-theory/arc · Yumi eval-gated retrofit · one shelf filter row.
- **10 presets approved** (Liberation · Power, named · Dignity · Solidarity · Care · Doubt · Praxis · Inheritance · Hope · Craft).
- **Per-object fields, NOT a new collection** — marks ride each object's already-guarded doc. NO new unguarded surface (FX-1 parked, untouched).
- Value hue = `--gold-hi` (orbs/glyphs); value **text** = `--gold-deep #855410` (AA). Ground = Universal light. Everything new renders mobile-canon-native (P1–P9).

## Commit strategy (decision, logged)
Source slices commit as **local WIP via `--no-verify`** (they never ship alone; the hook's per-commit cache-bump rule is a per-ship proxy). The **final commit bumps `sw.js` v3.194→v3.195** and passes the hook clean. Matches the R7 (`ec474b4…bff5d82`) / MW-3 (`5dd7cee…19ca15b`) precedent exactly + Preston's "cache bump LAST, single increment." Whole set gated by praxis-reviewer + fix-red-team before any push. **commit-no-push**; Preston pushes after the final report.

## Confirmed anchors (live source, verified this session)
| Site | file:line | Edit |
|---|---|---|
| `ensureBookFields` | state.js:419 (after movedMe) | + `valueMarks:[]` guard |
| `ensureSubTheoryFields` | state.js:661-664 (after linkedSubTheories) | + `valueMarks:[]` guard |
| `ensureArcFields` | state.js:756-760 (after entryIds) | + `valueMarks:[]` guard |
| `createArc` literal | state.js:1834 (after entryIds) | + `valueMarks:[]` |
| `createSubTheory` literal | state.js:1987 (after linkedSubTheories) | + `valueMarks:[]` |
| migrate tail | state.js:3408 (after 1.28.0 step) | + 1.28.0→1.29.0 step (books+arcs+subTheories backfill) |
| merge twin-trap | integrations.js:221/278/787 | already call ensure*FieldsAll ✓ (no edit — valueMarks rides free) |

## Slice plan (each = its own local commit)
- **S1 — state.js data layer** — valueMarks ×3 ensure*Fields + create* literals + migration 1.28.0→1.29.0. [pending]
- **S2 — value-mark component + book detail + CSS(mobile)** — shared render helper, book-detail wiring beside movedMe, components.css .vmark/.vline/.vpick + P1–P9. [pending]
- **S3 — sub-theory + arc wiring** — reuse the helper, ownership/sign-in/seed gating. [pending]
- **S4 — Yumi retrofit** — yumi-brain generateValueRetrofit + evalValueResponse + VALUE_GEN_SYSTEM; Account-portrait offer-cards (accept adds a stone to profile.values; NEVER auto-applies marks). [pending]
- **S5 — shelf filter row** — shelfFilter.value + valueSection + predicate + filterActive OR-chain. [pending]
- **S6 — onboarding preset beat** — intros.js VALUE_PRESETS + {kind:'values'} + build/dock/doValues + wire. [pending]
- **S7 — cache bump** sw.js v3.194→v3.195 (hook-clean, LAST). [pending]

## Value-mark data shape
`obj.valueMarks = [ { value: '<profile.values slug string>', why: '<optional lineage string>' }, ... ]`. `ensure*Fields` guarantees Array only (element shape enforced at write, like `evidence`/`attachedMarginalia`). Join to `profile.values` and value-load/filter is exact string match (=== contract, like the shelf rail).

---

## Gate reviews + fixes

- **fix-red-team:** NOT clean — 1 blocker + 2 residuals (full text: `docs/checkpoints/r8-redteam.md`).
  - **FINDING 1 (BLOCKER) — FIXED + verified.** Onboarding beat wiped prior `profile.values` on retake (`resetPicked` seeded `values:[]`, `doValues` replaces). Fix: `resetPicked` now seeds `picked.values` from `getProfile(uid).values` (a copy) → beat is additive. Behavioral (live retake, prior `[Liberation,Care,Doubt]`): chips render seeded-selected; +Praxis → `[Lib,Care,Doubt,Praxis]` (no wipe); −Care → `[Lib,Doubt,Praxis]` (only target removed). Reproduce/fix/control triad closed.
  - **R8-VR-BIND (residual)** — value-mark handlers bind the record at render-time vs re-reading fresh (movedMe re-reads); window closed by post-merge `renderRoute`. Documented, not fixed (a future hardening).
  - **R8-VR-RACE (residual, inherited/accepted)** — a mark on an existing synced record inherits the movedMe REPLACE-merge race; identical to movedMe/categoryOverride, the movedMe-level behavior the round accepted. Recorded so marks aren't believed fully race-safe.
- **praxis-reviewer:** HOLD → CLEARED (full: `docs/checkpoints/r8-reviewer.md`). PASS on ES3, foundation locks, EOL, staging, sanctioned accessors, Yumi covenant, honest empty states, guarded-sync, mobile size/touch, copy-contract, ownership gating.
  - **BLOCKER (Gate 3, CSS contrast) — FIXED + verified.** The `.vr-*` register used base tokens (`--ink`/`--surface`) that resolve to dark-ground LIGHT text on book/sub-theory/arc while the card was always-light → value-name 1.18:1 (invisible). First tried `--lum-*` (fixed book+sub-theory 11.4, but the ARC scope never re-points `--lum-ink` for its chrome region → still 1.70). Final fix: a SELF-CONTAINED `--vr-*` palette (opaque light card + dark ink) on `.vr-card` — the `.bk-surface`/`--bk-*` idiom — making AA DETERMINISTIC regardless of scope. Behavioral (live, all three surfaces): value-name **15.31**, label 6.40, lineage 6.40, sub 4.54 — all ≥4.5. Orb renders standalone in the retrofit via hex fallbacks. Mobile 390 re-checked: no h-scroll (open + picker), 44px, 16px. All hex confined to the token declaration; the two flagged raw hex (`#fff4d6`/`#3d2807`) are now `--vr-orb-hi`/`--vr-gold-ink`.
  - **Non-blocking cleared:** the now-unused global `--gold-hi`/`--gold-deep` theme.css promotion REVERTED; stale "7 steps" → "8 steps" (intros.js:8,79).
  - **Byte-report correction (reviewer Gate 3):** checkpoint self-reports ran ~1–3 lines high (S4 "+145/-1" actual 144/1; S6 "+86/-3" actual 83/3) — arithmetic misses only; reviewer independently verified shipped content complete. True deltas = `git diff` per commit.

## Live Forensic Smoke Test (fresh bundle, SW+cache cleared, stubbed signed-in user)

- **Renders (no throw):** shelf · bookDetail · arcDetail · subtheoryPage · account · **arcsList · notebook · home** — all 8 OK. Cross-surface (arcs/notebook/home) clean = no bleed from the global CSS/token change (the Notebook-broke-Arcs lesson).
- **Console:** clean on every surface (0 errors).
- **Value affordances:** book/arc/sub-theory each render `.vr-card`; `movedMe` still present (untouched); Account renders `.account-retro-btn` + 5 declared value rows.
- **Counts==data:** shelf Values rail `Liberation:2 · Care:1`; selecting Liberation → grid 3→2 (proven S5).
- **Mobile-canon (true 390):** no h-scroll (390≤390) incl. picker-open; `.vr-add` 44px; `.vr-opt` 44px; `.vr-whyin` 16px; lineage line renders. Two-layer evidence (render + computed).

## Slice results (parse · bytes · grep · self-verify)

- **S6 — onboarding value-preset beat — GREEN.** parse `PARSE OK: js/intros.js`; bytes intros +86/-3 (line-replacements) / components +14; ES3 clean; anchors present. New `{kind:'values'}` beat after `stance` (8-beat journey); VALUE_PRESETS (the 10); buildValues/dockValues/doValues + _value* helpers; renderStep builder+dock dispatch; nextEl label; wireStage vchip+valgo. doValues = setProfile({values})+saveProfileToFirestore (accountValuesPersist idiom), persisted per toggle. CSS .ij-vchip (gilding-gold on-state, journey dark ground, 44px mobile). Behavioral (live, full journey): advanced to the beat, 10 chips render, h1 correct, toggle Liberation → profile.values=['Liberation'] + is-on, custom add → ['Liberation','Wonder']. Commit: (S6, --no-verify, local).
- **S5 — shelf value-filter row — GREEN.** parse `PARSE OK`; bytes +83/-2 (2 = shelfFilter + gate line-replacements); ES3 clean. ONE row-group in the existing `.shelf-side` rail (no new toggle/sidebar): `shelfFilter.value` key + valueSection (distinct value-marks over the deduped `authorSrc` set, counted once/book, count-desc sort, rendered only when marks exist) + `valueOk` predicate + `&& valueOk` gate + `filterActive` OR-chain. Reuses `onShelfFilterRowClick` (generic exclusive-select). Behavioral (live): Values group renders `Liberation:2 · Care:1`; click Liberation → grid 3→2, row is-on, **count==filtered set**. Commit: (S5, --no-verify, local).
- **S4 — Yumi value retrofit — GREEN.** parse `PARSE OK` (yumi-brain + views); bytes yumi-brain +123 / views +145-1 (the -1 = copy-contract fix on the values note) / components +39; ES3 clean; exports present. Brain: VALUE_GEN_SYSTEM + generateValueRetrofit (claude-proxy clone) + gatherValueMetadata (metadata-only, existingValues) + evalValueResponse (reuses evalLensResponse — one validator). UI: button-triggered offer-cards in renderAccountPage (ember scope, --lum-* CSS); accept = add a DECLARED stone via accountValuesMakeRow+Persist, NEVER auto-marks; covenant line; loading/error/empty states. Copy contract fixed ("You place these… Yumi never fills them in" → "…may notice values your shelf carries, but never fills them in"). Behavioral (live): fns loaded; gatherValueMetadata shape correct; **eval gate kept 1/3** (dropped the single-grounded value + the blocked bare-genre name, kept the 2-grounded one). Proxy call fail-closes without the key (expected). Full UI render → end smoke. Commit: (S4, --no-verify, local).
- **S3 — sub-theory + arc wiring — GREEN.** parse `PARSE OK: js/views.js`; bytes +19/-0; ES3 clean. Sub-theory register = owner-only footer on the read Page (seed + signed-out early-return above; workshop stays sole prose editor). Arc register = owner-only card under the head (same gate as publish control; excludes seed). Behavioral (live): both build `.vr-card`, marks add + store; dirty routing exact — book:0 / sub:1 / arc:1 (kind dispatch clean, no cross-contamination). Commit: (S3, --no-verify, local).
- **S2 — value-mark register + book detail + CSS — GREEN.** parse `PARSE OK: js/views.js`; bytes views.js +223 / theme.css +6 / components.css +63, all insertions (no EOL flip); ES3 clean. `--gold-hi`/`--gold-deep` promoted to global :root. Behavioral (live, fresh bundle, SW+cache cleared): console clean; `buildValueMarkRegister` loaded; `ensureBookFields` stamps `valueMarks`; component builds `.vr-card` with 1 seeded mark + its lineage line + gilding-gold orb gradient; "+ mark a value" opens picker showing exactly the 2 unmarked values (excludes already-marked). Commit: (S2, --no-verify, local).
- **S1 — state.js data layer — GREEN.** parse `PARSE OK: js/state.js`; bytes +32/-0 (no EOL flip); `valueMarks` = 9 grep (5 functional: ensureBook/Sub/Arc + createArc/createSubTheory + migration); ES3 clean (no const/let/arrow/backtick in added lines); migration step `1.28.0→1.29.0` backfills books+arcs+subTheories via ensure*FieldsAll (merge-safe — those run on integrations.js merge too). Commit: (S1, --no-verify, local).
