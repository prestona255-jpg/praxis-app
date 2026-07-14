# DW-1 build checkpoint — Desktop Wave batch 1 (About + Arcs + body-margin)

Forks (Preston, this session): **About = A** (spine + column + wide figures) ·
**Arcs = A** (widen column + cap teach ≤66ch) · **body-margin = scoped
`@media(min-width:760px)` reset**. Stage 0.5 mockup skipped by name for this batch.

Rig: PowerShell HttpListener, fresh port per edit (rAF + IntersectionObserver do
NOT fire in this headless pane — screenshots time out too; DOM geometry is the
hard evidence, per D0). Auth stub uid `d0tester` + 3-arc/4-sub fixture.

Commit model: per-stage LOCAL commits, slices `--no-verify` (source without a
sw.js bump trips the hook; the bump is the Stage-5 final commit, hook-armed).
NOTHING pushed — Preston's exact words push.

---

## STAGE 1 — ABOUT (Fork A) — self-verified PASS

**Edits:**
- `js/views.js` renderAbout (20563+): prepended `<nav class="about-spine">` (6
  buttons, "On this page" eyebrow, `data-target` = section ids — buttons NOT
  #-anchors, so the hash router is untouched); added `id="ab-s0".."ab-s5"` to the
  6 `<section class="sect">`; wired click-to-scroll + a synchronous rAF-free scroll
  handler (`window.__aboutSpineScroll`, matching the shelf-head pattern at
  views.js:4069) that tracks the active section, self-removes when About unmounts.
  (First swapped an IntersectionObserver → scroll handler when the pane proved it
  fires neither IO nor rAF; the sync scroll handler is verifiable AND in-idiom.)
- `assets/components.css`: base `.about-spine{display:none}` + a `@media
  (min-width:1200px)` block — `.about` becomes `grid 184px minmax(0,1fr)`, spine
  `grid-row:1/span 50; position:sticky; top:96px` (implicit-row-safe sticky),
  content → column 2; prose centered at its 56ch cap; figures use the width
  (lexicon 3-up, covenant 3-across, refusals 2×2); spine link + `.mtog`
  `:focus-visible` gold rings. Tokens only, no hex, no `--lum-*`.

**Diffstat (surgical):** views.js +63/-6 · components.css +75/-0.
Parse-check `views.js`: **PARSE OK**.
**EOL CORRECTION (praxis-reviewer, Stage 5):** the original "no EOL flip" claim here was
FALSE at the working-tree level — the Edit tool flipped `components.css` w/crlf→w/lf during
this stage (the 3rd confirmed instance of the tool pattern; F-PX1 hit it on sw.js). Git
blobs are stored LF either way, so the committed history and runtime are unaffected; the
staged-blob CR=0 gate passed truthfully. The working tree was restored to CRLF
(`perl -pi -e 's/(?<!\r)\n/\r\n/g'`) at the Stage-5 fix slice; `git ls-files --eol` now
reads `i/lf w/crlf` on both touched files.

**Live gates (SW-cleared fresh origin, transitions killed):**

| Width | occupancy | hScroll | prose | spine | figures |
|---|---|---|---|---|---|
| 1280 | 95.5% ✓ | 0 ✓ | 56ch ✓ | flex+sticky ✓ | lex 3-col ✓ |
| 1440 | 84.8% ✓ | 0 ✓ | 56ch ✓ | flex+sticky ✓ | lex 3-col ✓ |
| 1920 | **63.4% ✓D1** | **0 ✓D3** | **56ch ✓D2** | sticky@96px, left-margin ✓ | lex/feat/refuse ✓ |

- D1 occupancy ≥60% at 1920 = **63.4%** (`.about` box 1208 = 1160 + 48 pad). PASS.
- D2 prose ≤72ch = **56ch** at every composed width. Colophon element reads 154.7ch
  but that's a centered single line — its REAL text extent is **68.4ch** (410px, 54
  chars). PASS.
- D3 hScroll == 0 at 1280/1440/1920. PASS.
- D4 pointer: 13 interactive, 13 cursor:pointer; spine links hover. PASS.
- D5 density: body 16px unchanged; h1 clamp-capped 52px (no scale needed). Recorded.
- D6 focus-visible: spine links + `.mtog` gold rings (tokenized); **scroll-spy
  active-state VERIFIED** (ab-s0 top → s1@2600 → s4@4200 → s5 bottom → s0 back). PASS.
- **≤759 (390) UNCHANGED:** block layout, mobile padding 44/18, lex 1-col, spine
  display:none, hScroll 0.
- **760–1199 (1024) UNCHANGED:** `.about` display:block, max-width 640, colWidth 688
  (= baseline), lex 2-col, featrows/refuse flex, spine display:none.

Structure: spine labels render "What Praxis is / Critical pedagogy / The covenant /
What it refuses / The lexicon / Orientation"; spine x:132–316, hero x:364 (right of
spine + 48 gap). Screenshot: timed out (pane capture limit, D0-sanctioned) — geometry
+ a11y-tree stand as evidence; Preston's felt pass is the visual gate.

Named tasks flagged (not touched): SVG `.stn`/`.pipe` stations are onclick-only (no
tabindex) — a pre-existing keyboard-a11y gap, out of composition scope → **DW-STN-A11Y**.

---

## STAGE 2 — ARCS (Fork A) — self-verified PASS

**Edit (pure CSS, `assets/components.css` +14):** a `@media(min-width:1200px)` block
after the base Arcs rules — `.arcs.lum-amber-deep > *{max-width:1360px}` (widens the
column so the existing auto-fit grid uses the width) + `.arcs.lum-amber-deep
.arcs-teach{max-width:66ch}` (caps the 137ch teaching line). No JS change; the head's
eyebrow/title are short and self-cap. Tokens only.

**Live gates (SW-cleared fresh origin, signed-in fixture):**

| Width | occupancy | hScroll | `.arcs-teach` | grid cols |
|---|---|---|---|---|
| 1280 | 94.9% ✓ | 0 ✓ | 66ch ✓ | 4 |
| 1440 | 95.4% ✓ | 0 ✓ | 66ch ✓ | 5 |
| 1920 | **71.4% ✓D1** | **0 ✓D3** | **66ch ✓D2** | **5** (was 4) |

- D1 occupancy ≥60% at 1920 = **71.4%** (col 1360). PASS. (also 95.4/94.9% at 1440/1280)
- D2 `.arcs-teach` = **66ch** (was 137ch) at every composed width. The named target
  defect FIXED. PASS.
- D3 hScroll == 0 at 1280/1440/1920. PASS.
- Grid widens 4→5 columns; head/grid left-aligned (x:272 == x:272). D4/D6 inherited
  from R5 (existing card hover + sort-seg affordances; no new interactive elements).
- **760–1199 (1024) UNCHANGED:** teach `max-width:none` (uncapped base, 119.8ch — the
  66ch cap is confirmed ≥1200-scoped), col 945 (base), grid 3-col, hScroll 0.
- **≤759 (390) UNCHANGED:** grid 1-col, teach 41.3ch (naturally narrow), hScroll 0.
- **Signed-out (1920):** empty-state renders ("Build your own arc"), teach + examples
  present, "Your arcs" grid correctly absent, hScroll 0, **console clean** — no crash.

---

## STAGE 3 — BODY-MARGIN (scoped `@media(min-width:760px)` reset) — self-verified PASS

**Edit (pure CSS, `assets/components.css` +12):** a `@media(min-width:760px){body{margin:0}}`
block before the TOP NAV section. Kept in components.css (theme.css stays 0-@media);
scoped ≥760 so ≤759 is byte-unchanged.

**Live gates:**

| Width | body margin | hScroll | note |
|---|---|---|---|
| 768 | **0/0** ✓ | **15 → 8** ✓ | improved 8px; residual 9px = DW-NAV768 (nav content too wide, separate) |
| 390 (≤759) | **8/8 UNCHANGED** ✓ | 0 | reset is ≥760-scoped — non-goal satisfied |
| 1280 | 0/0 | 0 ✓ | About centered, hScroll 0 (composed tier unaffected, +16px slack) |
| 1920 | 0/0 | 0 ✓ | About box centered 348/349, Arcs head 272/273, nav pill 395/395 — all symmetric |

- **768 h-scroll: 15 → 8** (the reset's 8px). NOT gone — a residual ~9px `.app-nav-list`
  overflow remains (the desktop nav content is ~9px too wide at 768). This is
  **DW-NAV768**, flagged at the HALT and chosen-into by Preston (the scoped reset was
  picked knowing 768 isn't fully closed). Separate nav-fit task, out of About+Arcs scope.
- **Nothing else moved:** every centered column + the nav pill re-centers symmetrically
  (proven by equal left/right gutters at 1920); ≤759 keeps its 8px margin. The composed
  About/Arcs occupancy is unchanged (clientWidth is scrollbar-relative, not margin-relative).

---

## STAGE 4 — chip flips + Round records + sequence amendments + regen

**Markdown edits (generator source, never builder.html):**
- `docs/studio/about.md` — `desktop: composed` frontmatter + `## Round record — DW-1 (2026-07-14)`
  (schema keys: commits / gates / defects-found / lessons / evidence).
- `docs/studio/arcs.md` — same pair.
- `docs/studio/sequence.md` — (i) DW line rewritten: FULL SWEEP, exit = 0 chips stretched,
  ~DW-1..5 batches, exempt surfaces named with owning rounds (Shelf→R-SHELF, Scan→SCAN,
  Connections→R10, Onboarding→its round, commons+reader→R11; Walk swept; Profile native);
  (ii) BETA-READINESS expanded to the locked 7-item ordered spec (FX-1 sync guards FIRST ·
  Stage-2 JWT two-phase · Goodreads minimal CSV, rich mapping post-gate · export/backup +
  minimal Settings · commons #reader fencing · admin runbook · unlisted-URL + open-auth).
- `BOARD.md` — About + Arcs Amber cells note the DW-1 ≥1200 composed tier (the R9b
  Profile-row precedent; BOARD has no desktop column).

**Regen #1 (detached, exit 0, warnings 0) — count gates:**

| Invariant | expect | got |
|---|---|---|
| rr-row | 30 → **32** (+2 exactly) | **32** ✓ |
| chip census | 23 total, exactly 2 changed | **23** = 21 stretched + **2 composed** + 0 native ✓ |
| lessons strip | 7 → 9 (+2, the two Round-record lessons) | **9** ✓ (earlier "8" baseline was a grep artifact matching the plural container) |
| dec-row | 26 | 26 ✓ |
| topnav | 7 (6 + 1 `tn-now` variant) | 7 ✓ |
| lab groups / cards | 3 / 6 | 3 / 6 ✓ |
| rr-stubs | 13 (3 round-doc stubs stay OUT of $SURFACES) | 13 ✓ |
| tick keys | 12; byte-identical EXCEPT the ruled DW-line rename | 12; 11/12 identical; `dw-1-3-desktop-wave-…` → `dw-desktop-wave-full-sweep-batches-dw-1-5` (the 4c rewrite slugifies into the key — expected, explained; a personal tick on the old DW key won't carry) |
| NOW banner / program map | render the amendments | lead = "DW — Desktop Wave (FULL SWEEP, batches ~DW-1..5)"; JWT + minimal-CSV items render ✓ |

Determinism ×2: **PASS** — regen #2 (exit 0, warnings 0), timestamp-stripped md5
`4598bd13ed2f2486d46608a0f0eb0103` on BOTH regens (byte-identical; HEAD stamp stable
at d873acf across runs, only the time differed).

---

## STAGE 5 — gate agents + mandated smoke + fix slice

**fix-red-team: no block-commit code defect.** The two high-risk items (scroll handler,
media scoping) independently re-derived clean: the unmount guard early-returns before
touching detached nodes; the ≥1200/≥760 scoping is correct; the 1200 boundary is a clean
switch; the chip flip to `composed` is honestly under-claimed. Findings acted on:
1. FALSE "rAF-throttled" comment ×2 in views.js (handler is synchronous) → **FIXED** (fix slice).
2. `body{margin:0}` verified on only 2 of ~8 desktop surfaces; the CLAUDE.md shared-CSS
   smoke is mandatory → **RUN** (below).
3. Push must carry bump + docs → already the plan (Stage 4 + 5b commits).
4. Handler unthrottled below 1200 (6 rect reads/scroll, invisible work) → accepted nit;
   a width-gate would invalidate the verified scroll-spy for a micro-cost.
5. DW-NAV768 magnitude stated 3 ways (7/8/9px) → **NAILED to 8px page h-scroll** (the nav
   list overruns its pill by ~9px; measured post-reset hScroll = 8). Comment + docs aligned.

**praxis-reviewer: HOLD → cleared.** Blocking finding = the components.css working-tree
CRLF→LF flip + the false checkpoint claim (corrected above; CRLF restored). Non-blocking
finding = the "matches the shelf-head pattern" comment overstated (the shelf handler is
ALSO purged by renderRoute(); mine self-removes lazily) → comment rewritten to describe
the actual mechanism (fix slice). All 9 protocol gates otherwise PASS (ES3 re-derived,
foundations byte-locked 14,681/10,255 B, byte deltas +3,170/+4,488 B match numstat, git
hygiene, no data-model touch, covenant untouched, signed-out branch intact, source order
+ selector-overreach + grid mechanics verified at code level).

**Mandated components.css smoke (1440, body margin 0, signed-in stub, console scan):**
Home `home-page.lum-amber-deep` · Shelf `shelf.lum-amber-deep` · Notebook
`notebook.lum-amber-deep` · Profile `pf-root` · Yumi-sees `yumi-sees-page` · Commons
`dsc-root.lum-amber-ember` — ALL render, **hScroll 0, console clean (0 errors)**.
- **Book Detail `bk-surface`: hScroll 40** — the PRE-EXISTING ON-7 (D0 measured 32 at
  every desktop width; `.bk-surface` width:100% + 40px padding, no border-box). The
  body-margin reset arithmetically widened it by exactly the released 8px (root right
  edge: 8+(cw−16+40)=cw+32 before → 0+(cw+40)=cw+40 after). NOT fixed here — ON-7 is
  round-owned (overnight rail / DW re-seed, named NON-GOAL for this session). **ON-7's
  owner should know the visible symptom is now 40px, not 32.**
- Nav pill sits 8px higher on every ≥760 surface (top gap 22→14px) — the intended
  consequence of removing the UA margin; uniform, not a per-surface shift.

**Fix slice (comments + EOL restore only, zero behavior change):** views.js 2 comment
blocks corrected (synchronous, lazy self-removal described accurately) · components.css
DW-NAV768 comment nailed to 8px · CRLF restored. PARSE OK re-run. No re-verification
needed — comment-only diff, rendering byte-path identical.
