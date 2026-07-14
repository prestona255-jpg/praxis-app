# BUILDER 1d — Stage 0 recon (read-only)

Session: fresh. Scope: usability + round-learning pass on the GENERATED
`docs/studio/builder.html` (via `tools/studio-build`) + hand-owned studio sources.
App code (views/components/theme/state/integrations/sw/index/firestore.rules) is OUT
OF SCOPE. Zero cache bump. Stage 0 HALTS for go-ahead.

## 0a — git state — GATE PASS

- HEAD            = `d6fd3aef17f8c6f34be8078499e001b54d9c19d0` (short `d6fd3ae`)
- origin/main     = `d6fd3ae` (identical)
- d6fd3ae ancestor-or-equal of HEAD: YES (HEAD *is* d6fd3ae, the R9b close-out)
- ahead/behind    = 0 / 0
- tracked working tree: **clean** (`git status --porcelain --untracked-files=no` empty)
- untracked: 112 entries (design mockups, docs/checkpoints, 5 under docs/studio/ —
  all pre-existing scratch, none touched by this run). Not a gate failure — the gate
  is "no tracked changes," which holds.
- ground-truth: hook ARMED (`core.hooksPath = hooks`), FIX-PROTOCOL v1.2, 7 agents present.

## 0b — close-out state verification (5 findings)

1. **sequence.md Now is PAST R9b (DW/S-A era)** — EXPECTED. Verbatim Now block:
   - `DW-1..3 — Desktop Wave (NAMED SLOT; folds S-A in)` — touches: [home, shelf, arcs,
     notebook, profile, book-detail, about, search, yumi-sees]
   - `SCAN round (studio-scan)` — touches: [books]
   - `ARC-FIELD MOBILE TOUCH MODEL (NAMED SLOT, carried)` — touches: [arc-detail]
2. **milestones.md contains the beta-readiness milestone** — CONFIRMED
   (`— | TARGET | Beta-readiness gate | FX-1 … commons #reader fencing …`). 8 milestone lines total.
3. **lab.md** — sigil session ✓ + curated published order ✓ present (both dated 2026-07-13).
   **ambient-sound card: PRESENT, NOT ABSENT.** ⚠ **CONTRADICTS the prompt's premise.**
   `lab.md` lines 40–43 already carry `- title: Ambient sounds / stage: spark / date: 2026-07-12`.
   It PREDATES the R9b close-out (07-13), so it was seeded by an earlier session, not the
   close-out. Current lab = **5 cards** (Ambient sounds, Goodreads import, Export/backup +
   Settings, Sigil session, Curated published order). See **DECISION GATE** below — this
   breaks Stage 4d's premise and the "lab 5→7" gate.
4. **Per-surface docs for SCAN and R-SHELF do NOT exist** — CONFIRMED ABSENT
   (`docs/studio/scan.md`, `docs/studio/r-shelf.md` both absent; `shelf.md` also absent;
   `books.md` is the canonical Shelf surface doc). Gap is REAL → Stage 4e valid.
   R-ARC doc also absent → Stage 4b valid.
5. **builder.html stamp**: `HEAD e73e994 · praxis-v3.202 · generated 2026-07-13 23:49 UTC`;
   overview reads "8 of 22 surfaces … 184 open gaps". Stamp HEAD `e73e994` is d6fd3ae's PARENT
   — correct: the generator bakes HEAD at generation time, and the d6fd3ae commit contains
   that regen, so the stamp always lags its own commit by one. Matches the prompt's stated
   close-out stamp (lab 5, milestones 8). EXPECTED.

## 0c — DW-touch slug rider (decides Stage 4c) — UNCLAIMED (4c IN PLAY)

- The DW Now item (sequence.md:351) touches line still reads `…, shelf, …` (NOT `books`).
- `books` is the canonical Shelf slug (`books.md` exists; SCAN + R-SHELF both `touches: [books]`;
  generator `hname books → "Shelf"`, `layerhue books → #e07a52`). There is NO `shelf.md`,
  no `id="s-shelf"` page, and `shelf` is not in the generator's SURFACES/hname/layerhue tables.
- **Concrete degradation proven in the live builder.html:** the DW thread node renders a
  broken touch-chip `href="#s-shelf"` (1×; **0** `id="s-shelf"` targets exist) labelled
  lowercase "shelf" with a BLANK gap count — vs the correct `books` chip "Shelf · 43" →
  valid `#s-books` (6×). Fixing the one word repairs the chip + reach-map orb.
- The R9b close-out did NOT fix it → **Stage 4c is a genuine, non-cosmetic repair, IN PLAY.**
- Byte delta of the rider: `shelf`(5) → `books`(5) = **net 0 bytes**.
- NOTE (pre-existing drift, NOT this run's to fix): sequence.md:285 (historical MW-1 Shipped
  entry) also uses `touches: [shelf, home]`. 4c fixes ONLY the DW Now line per the prompt.

## 0d — canonical close-out ritual definition (Stage 1 target)

Grepped CLAUDE.md + docs/studio/:
- **PRIMARY (studio-owned charter): `docs/studio/INDEX.md`** — `## The loop — scan → shape-A
  → shape-B → build → close` (line 6); the **`close` beat bullet, lines 26–27**: *"a round
  closes ONLY on Preston's felt pass. The surface markdown and sequence.md are updated and
  tools/studio-build is re-run."* This is the canonical enumeration of close-out OUTPUTS and
  is the cleanest, safest edit target (studio doc, not project instructions).
- Higher-level twins (do NOT edit): CLAUDE.md Studio Protocol lines 419–423/444–448 ("THE
  LOOP … close = a round closes ONLY on Preston's felt pass"); sequence.md:15 Standing-rules
  "felt pass → surface ledger → this sequence → BOARD → Builder regen" (sequence.md content is
  off-limits except the 4c rider).
- **Stage 1 plan: extend INDEX.md's `close` bullet** (≤25 lines) to require a `## Round record —
  <round-id> (<date>)` block (schema: commits / gates / defects-found / lessons / evidence) be
  appended to the OWNING per-surface doc at close. Schema keys are load-bearing (Stage 2 parser).

## 0e — census (raw material for the Round-Record index) — LOCKED PATTERNS

**Round-history entries** — rule (reproducible by the Stage 2 parser):
> Within any section header matching `^## Round history` (prefix — includes
> `## Round history (mobile)`), entry_count = ( #`^### ` > 0 ) ? #`^### ` : #`^- \*\*` .
> (h3 headers ARE the entries where present; sub-detail bullets like `- **P3`/`- **S1` are
> ignored. Bullet-format docs with zero h3 use their top-level `- **` round bullets.)

| doc | entries | (h3 / topbull) | note |
|---|---|---|---|
| home | 3 | 3 / 9 | h3: MW-1, R3 CLOSED, R3 build |
| books | 6 | 6 / 12 | |
| book-detail | 3 | 0 / 3 | TWO sections: `## Round history` + `## Round history (mobile)` |
| arcs | 2 | 2 / 10 | |
| arc-detail | 3 | 3 / 4 | R8, MW-2, R5 |
| subtheory-page | 3 | 0 / 3 | R8, R6, MW-3 |
| subtheory-build | 2 | 0 / 2 | R6, MW-3 |
| notebook | 3 | 3 / 12 | |
| account | 2 | 0 / 2 | rounds=0 but 2 history bullets (R8, R9a-merge) |
| profile | 2 | 0 / 2 | R9a, R9b |
| onboarding | 1 | 0 / 1 | R8 |
| (12 other docs) | 0 | — | book-marks, artifact, about, commons, reader, walk, search, yumi-sees, yumi-panel, import-capture, spotlight, cross-cutting |
| **TOTAL** | **30** | | **← hard Stage-2 row gate** |

**Lessons lines** — pattern `lessons:` schema key inside `## Round record` blocks (none exist
yet) + free-form `lesson` mentions: **0 across ALL 23 per-surface docs** (grep -ic 'lesson' = 0
everywhere). Lessons live ONLY in **CLAUDE.md `## Lessons — the seams` = 7 bullets** (VISUAL
GATE · MOCKUP FIRST · COPY IS A CONTRACT · DOC=POINTER · AUTH-GATED WRITES · SCREENSHOTS · THE
FORK RULE). ⇒ Stage 2b LESSONS strip currently renders **7** (from CLAUDE.md); per-surface
lessons populate going forward via the Stage 1 schema. (sequence.md Re-plan-log "LESSONS:"
entries are NOT in scope — 2b says "surfaces + CLAUDE.md" only.)

**Named-debt lines** — structured gap-ledger entries. Two formats: generator `gapcount` =
`^- \[source: ` (home 11, books 43, arc-detail 14, notebook 18, cross-cutting 44, … total 184);
profile uses `^- \[status: ` (8) — so **profile's gaps read 0 via `gapcount`** (pre-existing
quirk; heat grid shows "Profile 0 GAPS"; NOT this run's to fix — flagged). Named-debt is NOT a
Stage-2 render target (2a/2b render rounds + lessons only), so it is informational, not a hard
gate.

## 0f — expected byte deltas per stage (honest; ~2×-low caveat applied in the range)

Reference: Decisions section = 5,122 B for 5 `dec-shead` + 26 `dec-row` ⇒ **~150 B / rendered row**.
builder.html today = **433,370 B**, 3,239 lines.

| Stage | source-file Δ | builder.html Δ (at Stage-5 regen) |
|---|---|---|
| S1 INDEX.md ritual (≤25 ln) | +~1,600 B | +~1,600 B (INDEX.md island re-embed) |
| S2 Round Records + LESSONS (studio-build gen) | +~6,000 B | +~9,500 B (30 rows×~180 + ~14 cards + 7-item strip + chrome) |
| S3 usability quartet (studio-build gen) | +~6,600 B | +~4,200 B (NOW banner + program rail ~12 nodes + disclosure + sidebar filter) |
| S4 seeds (lab card + 3 stubs; rider 0 B) | +~3,500 B | +~2,500 B (1 lab card + 3 round-doc cards) |
| **S5 regen (net builder.html)** | — | **433,370 → ~451,000 B (+~17,600)** |

Honest range with the historical 2×-low correction: builder.html actual growth **+18k–35k B**
(→ ~451–468 KB); generator-source growth **+12.6k–20k B**. Divergence >30% from these numbers
is a Stage-5 FAIL to explain.

## 0g — parser inventory + regen baseline + harness plan

**Generator = `tools/studio-build` (1,444 lines, extensionless, ES3 client JS).** Parsers/renderers:
- `parse_items` (sequence Now/Next/Then/Shipped/Discovered), `parse_bullets` (Re-plan/Standing/Open-calls),
  `parse_overnight`, `parse_lab`, `parse_milestones`, `parse_risks` (last three soft-fail → `$WARN`),
  `fm`, `gapcount` (`^- [source: `), `has_brief`, `render_decisions` (per-surface `## Decisions`),
  `render_glossary`, `build_mobile_canon`, `build_desktop_canon`, `render_milestones`, `render_risks`,
  `labgroup`, `heat_group`, `brail_group`, `render_node`, `build_reachmap`.
- Client JS (ES3 here-doc, gen lines 1336–1433): `renderMd` (markdown islands), `cardify` (H2→.bcard),
  `sevDots`, `wireTicks` (`studio_ptick_` + `data-key`), `wireMilestoneDays`, `showPage` (hash nav +
  in-page anchors). **Enumeration:** `SURFACES` = 22 + `LAYERS` = cross-cutting = 23 docs iterated.

**Pre-existing element baseline (builder.html) — Stage-2/5 "held" anchors:**
- `.page` sections = **33** (23 surface `s-<slug>` + overview, plan, overnight, mobile-canon,
  desktop-canon, lab, decisions, glossary, mockups, index).
- sidebar `.brail-dest` = **8** (Overview, Plan, Mockups, Overnight, Mobile canon, The Lab,
  Decisions, Glossary) → Stage 2 adds **Round records** ⇒ 9 (intended add, not a "held" count).
- **topnav `.topnav-link` = 7** (Overview · Now · Overnight · Mobile canon · Desktop canon ·
  Program · Surfaces) — **HARD-HELD at 7** (Stage 3d gate). New sections go in the SIDEBAR.
- heat-tiles = 23, heat-sections = 7 groups, dec-row = 26, dec-shead = 5, lab-card = 5, ms = 8,
  stat-card = 3, vital = 6, now-move (overview) = 3, thread tnodes = ~13, reach-svg = 1.
- **tick data-keys = 12** (Now 3 + Next 3 + Then 6), keyed on `slug(title)`. Stage 2 must leave
  these byte-identical — achieved by not touching `render_node`/Now/Next/Then. The 12 keys:
  dw-1-3…, scan-round…, arc-field-mobile…, r-shelf…, s-b…, overnight-batch…, r10…, onboarding…,
  beta-readiness-gate, r11…, s-c…, feature-layers.

**ES3 false-positive baseline (Stage 3d gate) — CONFIRMED = prompt's "5 class + 1 backtick":**
scan of gen lines 1336–1433: `class` word = **5** (all `class="…"` string literals + the "class
'page'" comment), backtick = **1** usage (3 chars, the `/`…`/g` code-span regex), `const`/`let`/`=>`
= **0**. New inline JS (S3c collapse, S3d filter) must add ZERO new backticks and ZERO new
`class`-word occurrences — toggle via `.style.display`/`setAttribute`/`.open`, string-concat only.

**Regen baseline:** `sh tools/studio-build` runs **>5 min** on this Windows box (per project memory
`builder_1c_v2_shipped` + `r4_notebook_closed`: "studio-build >5min → DETACHED; foreground timeout
truncates builder.html"). **Plan:** Stage 5 snapshots builder.html first, then regen **DETACHED**,
determinism ×2 (stamp-stripped byte-identical).

## KEY BUILD-DESIGN DETERMINATIONS (carried into the build; flagged for the record)

1. **The 3 new stubs (scan / r-shelf / r-arc) must NOT join the generator `SURFACES` list.**
   Doing so would flip TOTAL 22→25, PCT, "8 of 22", the heat grid, group rollups, gapcount
   iterations, Decisions iteration, and markdown islands — VIOLATING the Stage-2/5 "pre-existing
   counts held" gate and rewriting the overview numbers. They render as **round-doc entries** in
   the new Round-Records section (each shows "queued / 0 rounds"), satisfying 5c's "3 new surface
   entries rendered" WITHOUT perturbing the 22-surface census.
2. **Round-Records rows == 30** (census) is the hard gate; **cards ≈ 14** (11 docs-with-rounds +
   3 stubs) is a design count, not the row gate.
3. **Program map (3b)** must not duplicate the existing Plan-page thread; render a compact
   done→NOW→next rail (reuse the reach-map/thread parser), driven ONLY by sequence.md.

## MECHANICAL HALT — one question for Preston (see chat)

The single genuine ambiguity: **Stage 4d's premise is false — the ambient-sound lab card
already exists** (0b#3). Adding it again duplicates; the "lab 5→7" gate becomes "5→6". Awaiting
Preston's call on 4d before proceeding. Everything else (4a/4b/4c/4e, Stages 1/2/3/5) is
unblocked and mechanically determined.
