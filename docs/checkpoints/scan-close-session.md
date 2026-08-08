# SCAN ROUND — CLOSE-OUT SESSION (paperwork)

SCAN CLOSE STARTED — docs-only. Model: Opus 4.8, default effort. Date: 2026-08-08.
Base: HEAD 6c021af (== origin/main). Closing version v3.269 (no app bytes this session; sw.js stays v3.269).
Expected shape: exactly 6 local commits, zero app bytes.

The SCAN deep round shipped through v3.269 (HEAD 6c021af, pushed) and Preston's felt
round 4 (Aug 8) was a FULL PASS. The round is closed on the felt side; this session
does the close-out paperwork.

---

## STAGE 0 — PRE-FLIGHT

### 1. Ground state
- `git fetch` done. **HEAD = origin/main = `6c021af607cdfa469d9657f0352c01561e516e83`.** ✓
- Tracked tree: **CLEAN** — `git status --porcelain | grep -v '^??'` returns nothing (zero tracked modifications). ✓
- `git status --short`: every line is `??` (untracked). No ` M`/`M `/`A ` entries. The four EXPECTED
  checkpoint files are present:

  | file | bytes |
  |---|---|
  | docs/checkpoints/scan-fixloop2-ship.md | 6336 |
  | docs/checkpoints/scan-fixloop3-triage.md | 19658 |
  | docs/checkpoints/scan-fixloop3-ship.md | 5445 |
  | docs/checkpoints/scan-fixloop4-ship.md | 4094 |

- **Extra untracked files: YES, many** — the pre-existing untracked set (design/*.html/.zip,
  ~60 docs/checkpoints/*.md from prior sessions, docs/studio/mockups/*, docs/studio/reports/*,
  a few root .html/.md). Reported, never staged, proceed. No tracked modification → NOT a FAIL.

### 2. Anchors (each PASS/FAIL)
- **sequence.md `## Now` names SCAN as lead — PASS.** Line 859 (verbatim):
  `- [ ] **SCAN — the de-risk scan surface (round)** — the cover/ISBN scan flow predates THE DOOR; folded`
  SCAN is the first (lead) unchecked `## Now` item.
- **BOARD file path + SCAN row — PASS.** `BOARD.md` at repo root (34142 B). SCAN = **row 19**
  (`#scan` renderScan), currently reads "SCAN round, **v3.260→v3.264** — BUILT + VERIFIED,
  committed-local, awaiting push + felt pass" (STALE version — Stage 4 restamps closed / v3.269).
- **Builder generator invocation — PASS.** `sh tools/studio-build` (CLAUDE.md:538 + Studio Protocol
  "emitted by `tools/studio-build`"). Output = `docs/studio/builder.html` (generated only, never hand-edited).
- **Canonical debt/gap ledger + row format — PASS.** `docs/launch-runway.md` → "THE CARRIED-DEBT
  LEDGER (round-close sweep)", a 3-column table `| Debt | Owner / lands in | What it is |`.
  Format specimen (existing row, FX-1c — which is ALREADY present, rows 38 & 57):
  `| **FX-1c — delete-symmetry guard** | its own slice (BETA-READINESS #1 completion) | the `pendingDeleteSync` tombstone half of the books precedent … Record: `docs/checkpoints/fx1.md`. |`
  (The per-surface `docs/studio/scan.md` Gap ledger is EMPTY — no specimen; the round-close
  carried-debt ledger is the canonical target and already holds FX-1c.)
- **acceptance-card.md rider present (completeness-inventory section) — PASS.** "THE COMPLETENESS
  INVENTORY — RATIFIED PERMANENT" present (plus the elevation loop). Brief §77 names the 8-row set
  (Ground/States/Controls/Widths/Motion/Marks/Text-registers/Seams).
- **scan-round-brief.md present + law count — PASS.** Present. `## LAWS` = **exactly 8** numbered law
  sentences (1 TWO TRUST POSTURES · 2 THE CAMERA FORGETS · 3 THE QUICK CARD IS FREE · 4 EXCEPTIONS
  NEVER AUTO-COMMIT · 5 FAILURE WEARS ITS OWN CLOTHES · 6 THE SHUTTER IS THE BUDGET · 7 RAISED-HAND
  YUMI · 8 CANON-NATIVE).
- **surfaces.md scan entry current state — PASS (with note).** There is NO `surfaces.md`; the studio
  uses per-surface files. The scan surface ledger is `docs/studio/scan.md`; frontmatter `state: built`
  (line 7), `rounds: 1`, `in_nav: yes`, `mobile: native`. S6 promoted scan ROUNDSTUB→real surface —
  the full frontmatter + State/Decisions/Round-history confirm a real surface entry, not a stub.
  Quote: `state: built`.

### 3. Worktree evidence (no removal in Stage 0)
`git worktree list` (verbatim):
```
C:/Users/pallen/Desktop/praxis-app                                       6c021af [main]
C:/Users/pallen/Desktop/praxis-app/.claude/worktrees/zealous-bose-8a1e6a 13548b4 (detached HEAD)
C:/Users/pallen/Desktop/praxis-arc-standard-mockup                       1ee4bb5 [mockup/arc-standard]
C:/Users/pallen/Desktop/praxis-auto-guard                                ce277e7 [auto-guard-lane]
C:/Users/pallen/Desktop/praxis-builder-nowparse                          fd8f8d6 [builder-nowparse-lane]
C:/Users/pallen/Desktop/praxis-rshelf-mockup                             d3bfb59 [rshelf-mockup]
C:/Users/pallen/Desktop/praxis-scan-derisk                               42ad980 [scan-derisk-lane]
C:/Users/pallen/Desktop/praxis-yumi-mockup                               7549932 [yumi-mockup-lane]
```
- `.claude/worktrees/zealous-bose-8a1e6a @ 13548b4` exists: **YES** (dir present, created Jul 25 15:00).
- `git merge-base --is-ancestor 13548b4 HEAD` exit code: **1** (13548b4 is NOT an ancestor of HEAD).
- `git cherry HEAD 13548b4`: 6 commits in `merge-base..13548b4`. **TWO unmerged (`+`):**
  `10f92463` "Stage 0 recon + Stage 1 writing-core mockup" · `12d6bbac` "Stage 1c: writing-core module
  contract". Four `-` (patch-equivalent in HEAD) incl. tip `13548b4` "sw: bump CACHE_VERSION to praxis-v3.150".
  Merge-base = `1a48045` "Build 1: bump CACHE_VERSION to v3.149 for ship".
- Worktree tree dirty?: **CLEAN** (`git -C .claude/worktrees/zealous-bose-8a1e6a status --short` empty).
- **Stage 6 pre-verdict:** condition (a) [ancestor OR zero unmerged] = **FAIL** (not an ancestor; two
  unmerged commits carrying old "writing-core" work). Condition (b) [clean tree] = PASS. Since (a) fails,
  removal is NOT permitted → leave the worktree for Preston, report the divergence. A skipped removal is
  a valid outcome.

### Stage 0 verdict
All anchors PASS. Ground clean, HEAD == origin/main. HALT for Preston's go-ahead.

Preston go-ahead 2026-08-08 with two rulings: (1) launch-runway.md carried-debt ledger
SANCTIONED as the Stage-3 target (non-goals rider amended for that one Builder-source
append); (2) worktree pre-verdict CONFIRMED — the two unmerged commits are the parked
Writing-Core lane; do NOT remove zealous-bose. Stage-4 fork: stamp "RE-PLAN PENDING" if
not unambiguous; do not decide it.

---

## STAGE 1 — CHECKPOINT DOCS (commit 1 of 6) — PASS
- Staged path-explicitly: the four fix-loop checkpoint files.
- Gate: `git show --stat` = **exactly 4 files, all `docs/checkpoints/`, zero app files.** PASS.
- Commit **`fe8dca1`** — "docs(scan) — checkpoint fix-loop 2–4 ship + triage records" (em-dash intact).
  4 files changed, 538 insertions(+). CRLF warnings cosmetic (blobs store LF).

---

## STAGE 2 — ACCEPTANCE CARD (commit 2 of 6) — PASS
- Wrote `docs/checkpoints/scan-acceptance-close.md`: the brief's **8 LAW sentences VERBATIM** as rows,
  each graded against the closing state (v3.269) with Preston's felt round 4 (2026-08-08, FULL PASS) as
  evidence. All 8 laws PASS. The two build-stage DEFERRED halves (Law 2 hardware indicator, Law 8 visual
  canon) close to PASS on the felt pass; the real-AT screen-reader leg named as a residual, not a law FAIL.
- **DEFERRED sub-capabilities named honestly, NOT laundered:** SC8 keep-partial tray (ERRATA-3 — endpoint
  returns no partial books; TRUNCATED ships honest) → future endpoint round; offline ISBN queue (SCE-3,
  defaulted NO) → future/beta.
- **8-row completeness inventory:** 8/8 SHOWN (Ground/States/Controls/Widths/Motion/Marks/Text-registers/
  Seams); Widths XL-tier bespoke desktop = N/A-OWNED (future XL round); no row MISSING.
- **Gate:** row count = 8 (== Stage-0 law count); each law appears exactly once; zero laws invented. PASS.
- Commit **`befc474`** — "docs(scan) — close acceptance card (8 laws PASS, felt round 4)". 1 file, 61 insertions(+).

## STAGE 3 — DEBT LEDGER (commit 3 of 6) — PASS
- Canonical ledger = `docs/launch-runway.md` → CARRIED-DEBT LEDGER (Preston-sanctioned target).
- **6 NEW rows:** partial-books endpoint (ERRATA-3) · OCR author misspells (specimen "Cihaar") ·
  hallucinated-author on hard spines (specimen "Nick Fentin, PhD", correctly need-a-look-caught) ·
  FAB/Review-N overlap at 390 (overnight-eligible) · vision-proxy latent stop_reason gap (backport
  candidate) · iOS home-icon opens Safari (pre-existing manifest item).
- **Dedup:** FX-1c already a ledger row (rows 38 & 57) → one-line SCAN citation added, NO second row.
  The other "likely duplicate" — iOS home-icon — had NO ledger match → it is a genuinely NEW row
  (honest correction to the "last two are likely duplicates" premise: only FX-1c was a true dup).
- **Gate:** diff touches only launch-runway.md; **added-row = 6, cited-row = 1** (numstat 7 ins/1 del =
  6 new rows + the FX-1c line rewritten in place). PASS.
- Commit **`7ca82c0`** — "docs(scan) — carried-debt ledger: 6 SCAN rows + FX-1c citation". 1 file.

## STAGE 4 — SEQUENCE + BOARD STAMP (commit 4 of 6) — PASS
- **sequence.md:** SCAN `## Now` item → `[x]` CLOSED (2026-08-08, v3.269, felt round 4 FULL PASS);
  added a `[~]` **RE-PLAN PENDING** lead item so the Builder headlines the pending re-plan rather than
  silently promoting FINISH-CHOREO S3 (generator NOW_LEAD = first `[~]`, tools/studio-build:230);
  Re-plan log entry dated 2026-08-08 recording the close + the **PROPOSED-class next-lead fork**.
- **BOARD.md:** row 19 (`#scan`) restamped "CLOSED 2026-08-08, v3.269; Preston felt round 4 = full PASS".
- **docs/studio/scan.md:** frontmatter `state: built → closed`; Round history closed; Gap-ledger pointer
  to the 6 carried-debt rows; Next = felt pass done + RE-PLAN PENDING.
- **RE-PLAN FORK (not decided here — never invent an order):** next lead deep round is Preston's ruling.
  Candidates: `## Now` remainder (FINISH-CHOREO S3 · Yumi round) vs `## Next` (S-B · R10 · ONBOARDING).
- **Gate:** diff = exactly 3 files (sequence.md, BOARD.md, scan.md), zero app files. PASS.
- Commit **`0138d31`** — "docs(scan) — mark SCAN round CLOSED; next lead RE-PLAN PENDING". 3 files.

## STAGE 5 — BUILDER REGEN (commit 5 of 6) — PASS
- Ran `sh tools/studio-build` (documented invocation, CLAUDE.md:538) — the session's single regen. exit 0.
  Summary: "wrote builder.html (HEAD 0138d31, praxis-v3.269, 2026-08-08; **closed 9/23**, gaps 194, ship 28,
  map 6; warnings 0)".
- **Gate 1 — scan renders CLOSED:** `scan</span><span class="badge"><span class="u-orb u-orb--lit u-orb--amber"></span>closed`
  (+ prose "scan is a closed …"). `u-orb--lit u-orb--amber` = the generator's `closed)` orb class
  (tools/studio-build:60). Closed count 8→**9/23** (scan is the +1 from built→closed). The Now banner
  headlines the `[~]` **RE-PLAN PENDING** lead (NOW_LEAD = first `[~]`, studio-build:230) — no silent promotion. PASS.
- **Gate 2 — blob hash changed:** `928a54e9502ab273c312714b63bfc84f` → **`69ebbad6f61f64db436d5d1fa37b1272`**
  (602,690 → 607,762 B). PASS.
- **Gate 3 — diff scope:** `git status --porcelain` = only ` M docs/studio/builder.html`. PASS.
- Commit **`937444e`** — "docs(scan) — regen Builder (scan closed 9/23, RE-PLAN PENDING lead)". 1 file.

## STAGE 6 — WORKTREE CLEANUP — SKIPPED (valid outcome, no commit)
- Removal permitted only if BOTH (a) 13548b4 ancestor-of-HEAD OR zero unmerged, AND (b) clean tree.
- **(a) FAILS:** `git merge-base --is-ancestor 13548b4 HEAD` = exit 1 (not an ancestor) AND `git cherry`
  shows **2 unmerged commits** — `10f92463` "Stage 0 recon + Stage 1 writing-core mockup" + `12d6bbac`
  "Stage 1c: writing-core module contract" = **the parked Writing-Core lane** (Preston-confirmed).
- **(b) PASS:** worktree tree clean.
- Since (a) fails → **remove nothing**; leave `.claude/worktrees/zealous-bose-8a1e6a @ 13548b4` for Preston.
  Preston's go-ahead explicitly ruled: do NOT remove it. Worktree list unchanged before/after. No commit.

## STAGE 7 — SESSION CHECKPOINT + PUSH GATE
- This file is committed as **commit 6 of 6**, sealing the close-out record.
- Expected shape held: **exactly 6 local commits, zero app bytes, sw.js stays v3.269** (no `.js/.css/.html`
  outside `docs/`; the only `.html` touched is `docs/studio/builder.html`, docs-exempt from the hook).
- HALT for Preston's push word. After his word: push → cache-busted `/sw.js` fetch ×2 must still read
  **v3.269** (UNCHANGED = pass; docs-only means the live app must not move).
- **POST-PUSH RESULT:** _(filled after the push word)_.
