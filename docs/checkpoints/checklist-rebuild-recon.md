# Checklist rebuild — Stage 0 recon

Task: rebuild the build checklist as a current, repo-tracked file, reconstructed
from the repo itself (git log, docs/checkpoints/, CLAUDE.md, scope/spec docs) —
NOT from the stale `Praxis_Build_Checklist.html` or `Praxis_Roadmap.html`, both of
which are treated as relics, not sources of truth.

Method: a 6-agent reconstruction workflow read the history from four independent
angles (300-commit git log, the stale HTML tracker, the 9-file checkpoint trail,
the scope/spec docs), reconciled them into one authoritative status map, then ran
an adversarial completeness critic against the raw git log. This file records the
recon findings; the build itself halts for Preston's go.

## Live ground truth (independently re-verified at HEAD)
- HEAD == origin/main == `276d3db`.
- `sw.js` line 10: `CACHE_VERSION = 'praxis-v3.97'` (current live version).
- `state.js`: static initializer `SCHEMA_VERSION: '1.9.3'` (line 268, the pinned
  seed-ladder literal); migrate() chain terminal step reaches **1.17.0**
  (line ~1857). citationPins field + migration present. Cite BOTH in the rebuilt
  doc so a future auditor doesn't trip on the 1.9.3 literal.
- Tree clean except 3 untracked binary strays (2 PDFs + 1 PNG) — not bug-list docs.

## Stage-by-stage real status (through Stage 10)
All SHIPPED+verified unless noted. Evidence = commit hashes + checkpoint/commit
record + live confirmation.

| Stage | Status | Key evidence |
|---|---|---|
| 0 — Yumi voice doc v1.0.0 | SHIPPED | cd125c1 (later v1.1.0 e39af30, v1.1.1 469c28c; v1.2.0 length-cap flagged non-gating) |
| 1 — skeleton/state/auth/ISBN/PWA | SHIPPED | ba03c4d,cccbf3f,55197a3,142b485,a62ca03,e58ab85 |
| 2 — Yumi brain/UI/voice/context/memory | SHIPPED | 2.1–2.9 chain incl. 2.7b-ii a–f summarizer, voice audits (cache v2.5) |
| 3 — Notebook/privacy/transparency/Books/covers/finish/status | SHIPPED | 3.1–3.7c; DEFERRED never-shipped: 3.5d/3.5e (superseded), 3.7b |
| 3.8/3.9 — Knowledge Arcs data/create/attach/detail | SHIPPED | 964441f,11a71e1,019160e,29ec979 (schema 1.9.3) |
| 3.10 — visual pass + Firestore r/w + cover resolve | SHIPPED | reached cache v3.10-h; shipped out of alpha order |
| 5.1/5.2/5.3 — material/wheat-field/Arcs route+seed | SHIPPED | 431597e…1a306f7; seed "A Pedagogy of Desire" |
| 5.4 — arc list/web toggle | SHIPPED (Stage1) / **REVERTED** (Stage2b) | 2b v3.11-c rolled back: 929d7a4/b220355/969d851 |
| 5.6 — tradition model + register glyphs | SHIPPED (1st attempt **REVERTED**) | 15ec251→12ba756 (Firestore-merge-bypasses-migrate incident), redo 7e460eb… |
| 5.7 — notebook delete + seed-pass | SHIPPED | 91f1214,c5ef918 |
| 7.1/7.2 — arc-constellation wired into web view | SHIPPED | 19c9ac8…45ebe4d, 8cc4ed6, c48966d; field-test PASS |
| 8.1 — constellation interactivity | SHIPPED | d671e1a,bc31d5d,b2cdea4 (reduced-motion respected) |
| 9.1–9.5 — sub-theory model/surface/note→ev/field-test/constellation | SHIPPED | 2662a31,6fec418/b6004b0,ba59a5a; 9.4 is a field test (STAGE_9_FIELD_NOTES.md) |
| 14 (INF-1..4) — sync/isolation/account/SW-freshness | SHIPPED | 14.1a–14.4, cache v3.15→v3.19; built BEFORE 9.6 |
| 9.6 — luminous constellation workspace | SHIPPED a/b/c (v3.20→v3.27); **9.6d PLANNED, not shipped** | caf86f7,d39e05a,66ff194…7a2c976 |
| Visual Uplift / Theme / Hybrid / Chrome / design-spec | SHIPPED | v3.28→~v3.82; ⌘K spotlight, Home route, design-spec conformance; residual per-surface backlog |
| 6.x — shelf-photo scan/vision, first-run onboarding, "What Yumi sees" | SHIPPED | vision-proxy.js 467297a…6.2-polish b062992 |
| **10 — Evidence & citation** | **SHIPPED, LIVE praxis-v3.97; 10.5.8 DEFERRED** | 10.1 c93e710/bb177f9 (no 10-1.md — predates checkpoints dir); 10.3 390a0b5(v3.93); 10.2 883a430(v3.94); 10.4 be73c1b(v3.95); 10.5 40de91f(v3.96); 10.5.9 2356479/276d3db(v3.97) |

Critic result: **missingStages = empty** — every numbered namespace in the 300-commit
log appears in the table. No unbacked status claims (one cosmetic schema-literal note above).

## Stage 10 detail
- 10.1 Send-to-sub-theory evidence channel — SHIPPED (commit-verified; no checkpoint file).
- 10.2 inline citation live-preview (dots/hover/chooser) — SHIPPED; live pass-checks logged AWAITING in 10-2.md (corroborated only via later substages).
- 10.3 external-quote stable refId + required title (migration 1.16.0) — SHIPPED; automated proof done, six eyes-on UI checks HANDED TO PRESTON, never re-run in the test-session pattern.
- 10.4 renderSubTheoryReadOnly draft/published + PRIVACY GATE A — SHIPPED; 4/4 live checks PASS in test session.
- 10.5 Citation UX (10.5.1–10.5.7) — SHIPPED; 7/7 live PASS; two post-ship defects A+B.
- 10.5.9 cleanup — fixed Defect A (blue Cite link) + Defect B (citationPins not backfilled on Firestore merge); both re-verified live at v3.97.
- **10.5.8 — app-wide writing-surface field treatment — DEFERRED (audit bug #5); the ONLY open Stage 10 item.**

## THE 8-ITEM AUDIT BUG LIST IS NOT IN THE REPO (hard blocker)
Exhaustive `git grep` over the whole tracked tree (`connect regression`, `audit`,
`audit bug`, `regression`, `bug #1-9`, `eight bug/defect/item`, `bug list`) returns
ONLY two `audit bug #5` lines, both in docs/checkpoints/10-5.md (lines 120, 171),
pointing at 10.5.8. There is **NO "Connect regression"** anywhere — "Connect"
appears only as the legitimate 9.6c constellation Connect-mode control. The "#5"
numbering implies a list of items #1–#8 was produced in a design chat, but only
item #5 was ever transcribed into a tracked file.
ACTION REQUIRED: Preston must supply items #1–#4, #6–#8 from the design chat before
they can be tracked. (NB: design-spec.md C.4 "Drift checklist" is a live↔mockup
conformance table, a DIFFERENT artifact, not the audit list.)

## What the old trackers missed (high-value, in the checkpoint trail only)
- 10.1's evidence is COMMIT-based, not a checkpoint file (predates the protocol).
- Defect A (blue Cite link) + Defect B (citationPins Firestore-merge backfill) — found v3.96, fixed v3.97.
- STANDING PATTERN: Defect-B fix added `ensureSubTheoryFieldsAll` in the integrations.js sub-theory merge → backfills the FULL field set on every synced record (covers all future schema fields). Matches the "Firestore merge bypasses migrate()" memory.
- Design/policy GATES RESOLVED: 10.2→Option A preview pane; 10.4 PRIVACY→Option A exclude private evidence, owner-only rail tag (Stage 12 inherits this safe default); 10.5.6→Option C Write|Preview.
- Cross-substage RESIDUAL chain: session-only pins opened 10.2 S3 → carried 10.4 → CLOSED 10.5.7 (persisted citationPins, migration 1.16.0→1.17.0).
- Band deviations cleared by CLASSIFICATION not silent widening (comment-only at 10.2 S1/10.3 S1/10.4 S1/10.5.9 A; logic-overage HALT→split at 10.2 S2).
- Shared-helper de-dup refactors (positionToSpan 1/3, citeLines 1/2, citeIdIn 1/2).
- Test-account provenance: executor-run in prestonpraxistest@gmail.com (NOT prestona255@gmail.com), fixtures reusable, screenshots as ss_ session ids.
- 5.4 Stage 2b + 5.6 sub-step 1 REVERTS the trackers never logged.

## Open / deferred / forward items
- 10.5.8 (field treatment, app-wide) — DEFERRED, own comp-gate. Only open Stage 10 item.
- 8-item audit bug list — NOT in repo; must be supplied.
- 9.6d book-evidence layer — authored, never shipped; nearest unshipped constellation sub-stage.
- Incorporated (solid+tethered) marks; faint/speculative resonance creation UI; hover lift/line-brighten vs design-spec C.3 (drift now present via 9b-iv) — render paths built, data/UI dormant.
- Visual uplift per-surface residual backlog; Stage 3 styling pass (~53 classes + 4 ids per memory, partly absorbed, not confirmed closed).
- Stage 9.4 field-note carry-forwards (F3→Stage11, F4 autosave, F5 cover mismatch; F6 closed by 10.5.6).
- ARC_POLISH_BACKLOG P-1/P-2; voice v1.2.0 length cap.
- UNVERIFIED on record: 10.2 AWAITING screenshots; 10.3 six eyes-on checks handed to human.
- Forward roadmap-only (never built): Stage 11 (Yumi transparency surface), Stage 12 (Public publishing 12.1–12.5, pen-name), Stage 13 (Social/discovery), 2.7 Yumi eval, 6.3 shelf search, 5.5/6.4 ambient sound + Yumi TTS, 6.5 empty/first-run states.

## Proposed rebuild (DECISION GATE — halt)
FORMAT: a single repo-tracked **Markdown** file, replacing the stale HTML as the
canonical "where the work stands" pointer. Rationale: the HTML's checkbox state
lives in localStorage (`praxis_build_checklist_v3`), NOT in git — that runtime-seed
model is the documented root cause of the ~70-cache-bump drift. A .md commits its
state as diff-reviewable text and can be re-verified against git log + sw.js +
docs/checkpoints/. (Keep the .html as a frozen artifact or delete; repoint CLAUDE.md.)

STRUCTURE (8 sections): (1) header — authoritative-as-of date, live URL, CURRENT
CACHE_VERSION praxis-v3.97, HEAD hash, provenance stamp; (2) status legend; (3)
SHIPPED stages 0→10 (one table per top-level stage); (4) in-flight/nearest-next
(9.6d, 10.5.8, uplift residual); (5) deferred & forward (Stage 11/12/13, 2.7,
6.3/6.4/5.5/6.5, backlogs); (6) OPEN AUDIT-BUG LIST (explicit placeholder — #5
known = 10.5.8, #1–#4/#6–#8 to be supplied); (7) reverts & lessons; (8) appendix —
cache-version timeline.

PER-ROW FIELDS: | ID | Title | Status | Cache@ship | Commit(s) | Checkpoint file | Live-verify evidence | Residuals |.

STATUS LEGEND (single controlled vocabulary, replacing the .html's ~14 badges):
SHIPPED+VERIFIED | SHIPPED-UNVERIFIED (code live, a pass-check AWAITING/human-handed)
| DEFERRED | PLANNED | REVERTED.

UPDATE MODEL: a row reaches SHIPPED+VERIFIED only when its checkpoint (or commit
record) shows parse PASS + in-band byte deltas + matched greps + live-DOM proof
with recorded evidence. Updated in the SAME commit the checkpoint is finalized, so
it never lags the trail again. Provenance stamp refreshed each update.

ITEM COUNT: 19 stage sections; ~130 underlying substage facts; render ~90–100
visible rows (5.2/5.4 micro-iterations rolled up with sub-bullets) + a ~12-item
DEFERRED/FORWARD section.

## Decisions needed before build (halt)
1. Supply the 8-item audit bug list (only #5 is in the repo). Or confirm placeholder.
2. Format: Markdown (recommended) vs HTML; and disposition of the stale .html + CLAUDE.md repoint.
3. Treat 10.2 / 10.3 as SHIPPED-UNVERIFIED (honest) vs re-run their checks in the test session first.
