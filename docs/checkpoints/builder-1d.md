# BUILDER 1d — build checkpoint

Recon: `docs/checkpoints/builder-1d-recon.md` (Stage 0 accepted in full by Preston).
Preston GO: execute Stages 1→5; **Stage 4d SKIP** (lab 5→6, R-ARC only); commit-no-push; halt at final report.

Scope: `tools/studio-build` (generator) + `docs/studio/{INDEX.md, lab.md, sequence.md}` + 3 new stub docs.
NON-GOALS held: no app code, no canon docs, no sw.js, zero cache bump.

## Slice table (parse / bytes / greps)

| Slice | files | added/removed | gate | result |
|---|---|---|---|---|
| S1 ritual amendment | docs/studio/INDEX.md | +16 / -0 | docs-only, ≤25 ln, no other files | **PASS** |
| S2 Round Records + LESSONS | tools/studio-build | — | parser=30, sh -n OK | **PASS (pre-flight)** |
| S3 usability quartet | tools/studio-build | — | ES3 class=5/bt=1, PARSE OK | **PASS (pre-flight)** |
| S4 seeds | lab.md + 3 stubs + sequence.md rider | — | exact files, lab 5→6, +3 docs | **PASS** |
| S5 regen+verify+commit | docs/studio/builder.html | — | determinism ×2, parity, EOL, reviewers | **PASS** |

## S5f — red-team probes (own) — ALL PASS (honest degrades)
- **A** zero-round doc / no-history stub → 0 rows (reader=0, scan=0, r-arc=0); render skips (no empty card), no crash.
- **B** doc with ONLY a `## Round record` block → 1 row, tag=record, id=R9c, date=2026-07-20 (schema path live; confirms 1b).
- **C** mixed h3+bullet round-history → h3-mode wins (1 entry, bullets fold). DOCUMENTED ASSUMPTION: a doc uses ONE round-entry format; all 23 real docs do (verified in 0e). A hypothetical mixed doc would undercount — flagged, not present.
- **D** empty Now → "sequence.md Now not parsed" (honest soft-fail); empty milestones → milestone line omitted, no crash.
- **E** rr_id: no-em-dash ('R1 CLOSED'), em-dash ('MW-1 mobile pass'), paren ('R6 Sub-theory') all clean.
- Minor future refinement (0 impact now): a `## Round record` entry's lead uses dectrunc(whole block); could prefer the `lessons:` value once records exist. Cosmetic, not a blocker.

## S5 — regen #1 (from current generator) + parity — PASS
- Regen #1 clean: **warnings 0**; closed 8/22, gaps 184, ship 22, milestones 8, risks 6 HELD; **lab 6**; run1 = **460,851 B** (+27,481 vs 433,370; within 0f honest range).
- **Parity (rendered on run1):** rr-row **30** (== census) · rr-card 11 · rr-stub 3 · rr-lesson 7 ·
  page-round-records 1 · now-banner 1 · progmap 1 · brail-filter 1 · data-pcol 11 · page sections
  **34** (33+1) · surface pages 23 HELD · sidebar dest **9** (8+1) · **topnav 7 HELD** · heat-tile
  elements 23 HELD · **ptick 12 data-keys BYTE-IDENTICAL** · dec-row 26 HELD · lab-card 6 · overview
  "8 of 22" + "184" HELD.
- **4c rider effect:** broken `href="#s-shelf"` = **0** (was 1); degraded `shelf` touch label = 0;
  reach-map DW orb now `Shelf &middot; 43`.

## S5f — praxis-reviewer verdict: **CLEARED TO COMMIT**
- All 7 load-bearing claims PASS (independently re-derived): parser=30, stubs out of $SURFACES,
  ES3 5/1/0/0 + cscript PARSE OK, additive (numstat 202/1, no rename), determinism (no
  Math.random/ls-t/sort in new shell; the one `new Date()` is client-side countdown), rider net-0
  DW-only, `sh -n` clean. Foundation locks byte-exact; no EOL flip; `git diff --check` clean.
- **MINOR FIX to fold in:** `.pm-c-next` CSS rule missing (program-map next chips fall back to base
  `.pm-chip`). One-line CSS add — applied before the determinism regen pair.

## S5f — fix-red-team verdict: **NO BLOCK-COMMIT DEFECT** (8/8 probes honest degrade)
5 lower-severity findings — worthwhile ones folded into the generator before the determinism regen:
- **F1 (real quality) FIXED** — LESSONS strip clipped each CLAUDE.md seam to its first *physical* line
  → mid-sentence fragments. Fix: join continuation lines, then first-*sentence* lead via `dectrunc`.
  Verified: 7 clean leads ("VISUAL GATE: computed styles never prove a look…" etc.).
- **F2/F4 (latent UTF-8 + polish) FIXED** — byte-based `cut -c` could split an em-dash; chips had no
  ellipsis + one dangling backtick. Fix: `chip_trunc` (strips md markers, word-boundary backoff, `…`;
  byte-safe) for program-map chips + hardened `rr_id`. Verified: "DW-1..3 — Desktop Wave (NAMED SLOT;…"
  (em-dash intact), "Overnight batch…" (no backtick).
- **F3 (nit) FIXED** — pm-shipped "22 closed" → "22 shipped" (disambiguated from "8/22 surfaces closed").
- **F5 (fragile) FIXED** — added `grep .` to the lessons dedup pipe (belt-and-suspenders vs a surviving blank).
- Post-fix pre-flight: `sh -n` OK · round_entries still **30** · ES3 still **5/1/0/0** · pm-c-next rule present.
- `.pm-c-next` CSS added (reviewer's minor gap).
- Scope re-confirmed by both agents: only INDEX/builder/lab/sequence/studio-build tracked + 3 stubs;
  render_node / Now-Next-Then / 12 tick keys untouched; foundation locks byte-exact; no EOL flip.

## S5b — determinism regen pair — PASS (with a mid-run environment change)
- First pair (regenA 01:02 / regenB 01:16): stripped byte counts EQUAL (460,985 == 460,985); the ONLY
  diff was the cache-version string `praxis-v3.202` (A) vs `praxis-v3.203` (B) in the bstamp + Vitals.
- **Cause — a PARALLEL COMMIT landed mid-run:** Preston (separate session, same repo) committed **F-PX1**
  between regenA and regenB. **HEAD moved `d6fd3ae` → `a6decb3`** ("F-PX1 — proxy per-request cost bounds
  + signed-out Yumi gate (v3.203)"); sw.js bumped v3.202→v3.203. `a6decb3` is a **clean descendant of
  d6fd3ae** (gate 0a holds); `origin/main` still `d6fd3ae` (a6decb3 local, unpushed, ahead 1). F-PX1 files
  (sw.js · 4 netlify proxies · yumi-ui.js · f-px1 checkpoints) have **ZERO overlap** with my 5 files.
- Interpretation: the generator IS deterministic (the entire variance was the external sw.js cache input
  flipping mid-run). But my regenB baked a STALE stamp (`HEAD d6fd3ae`, since a6decb3 landed just after).
  → Re-running the pair on the now-stable base (a6decb3 / v3.203) for a clean stamp + clean determinism.
- My Builder-1d commit will sit on top of a6decb3 (docs+generator, no conflict); the eventual push includes
  BOTH a6decb3 (F-PX1, Preston's) and my commit. Flagged in the final report.
- **Re-ran the pair on the stable a6decb3/v3.203 base (regenC 01:33 / regenD 01:43):** HEAD + cache stable
  across both; **DETERMINISM PASS** — regenC == regenD byte-identical stamp-stripped (461,162 B each; stripped
  460,985 == 460,985). Final builder.html stamps **HEAD a6decb3 · praxis-v3.203** (bstamp + Vitals), warnings 0.

## S5c — final parity (on a6decb3/v3.203 builder.html) — PASS
- rr-row **30** · rr-card 11 · rr-stub 3 · rr-lesson 7 · page sections 34 · sidebar dest 9 · **topnav 7** ·
  ptick 12 · dec-row 26 · lab-card 6 · overview "8 of 22" + "184" HELD · #s-shelf broken 0.
- F1 verified rendered: 7 clean first-sentence lessons. F4 verified: chips clean (em-dash intact, ellipsis,
  "Overnight batch…" no dangling backtick). ES3 (generator inline JS): class 5 · backtick 1 · const/let/arrow 0.
- Reviewer CLEAR + red-team no-block stand: their load-bearing claims (parser 30, ES3 5/1/0/0, stubs out of
  $SURFACES, topnav 7, additive, net-0 rider) are unchanged by the F1–F5 + pm-c-next fixes (CSS/awk-lead only,
  re-validated above).

## S5e — byte reconciliation vs 0f
- builder.html: 433,370 → **461,162 = +27,792 B**. 0f point-estimate +17,600; 0f HONEST RANGE (2×-low caveat)
  **+18k–35k** → +27,792 sits inside the range. Divergence from the point-estimate is explained by the
  pre-stated 2×-low correction; no unexplained >30% divergence. PASS.
- generator source `tools/studio-build`: **+211 / −1** (the −1 is the `boot()` swap; the render-functions
  block is entirely new vs HEAD, so its internal edits register as additions). No duplication — every
  replaced fragment (`cut -c1-46/40/34`, `%s closed`, old lessons awk, old dedup pipe) = 0 in the staged blob.

## S5d — EOL gate — PASS
- All 10 staged blobs `git show :<f> | tr -cd '\r' | wc -c` = **0** (no EOL flip). `git diff --cached --check` clean.
- sequence.md `1/1` = the one-word `shelf`→`books` rider (net-0 bytes), no whole-file rewrite.

## S5g — stage + commit (hook-armed, NO PUSH)
- Staged PATH-EXPLICITLY (never `git add -A`), exactly 10 files; **sw.js NOT staged** (F-PX1's, committed
  in a6decb3, clean). Nothing else dirty.
- Pre-commit hook passes hook-armed: docs/ + tools/ are exempt from the served-source-needs-sw.js BLOCK;
  foundations byte-locked (not staged); ES3 check scans `*.js` only (tools/studio-build isn't one).
- Base = a6decb3 (F-PX1, Preston's parallel commit; a clean descendant of d6fd3ae). origin/main = d6fd3ae.
  After this commit: origin/main..HEAD = **2 commits** (a6decb3 F-PX1 + this Builder-1d commit).

## S1 — close-out ritual amendment — PASS
- `docs/studio/INDEX.md` only; +16 / -0 (≤25 gate); em-dashes intact.
- Added a "Required close-out output — the Round record" block on the canonical `close`
  beat: `## Round record — <round-id> (<date>)` with load-bearing keys
  (commits/gates/defects-found/lessons/evidence), keys shown inline-coded (no literal
  `## ` line → no renderMd H2 mis-parse in #page-index). 1b honored (additive, no
  retroactive rewrite).
- `git status`: only INDEX.md dirty. GATE PASS.

## S2 — Round-records index + LESSONS strip (tools/studio-build) — PRE-FLIGHT PASS
- Added: `ROUNDSTUBS="scan r-shelf r-arc"` (kept OUT of `$SURFACES`); `rr_id`/`round_entries`
  parser (h3-headers-else-`- **`-bullets; parses `## Round history*` tag=ledger + `## Round
  record` tag=record); `render_round_records` (LESSONS strip + per-surface cards + queued-stub
  cards); sidebar `Round records` dest link; page call after Glossary; CSS block.
- **round_entries dry-run = 30 rows** (home 3·books 6·book-detail 3·arcs 2·arc-detail 3·
  subtheory-page 3·subtheory-build 2·notebook 3·account 2·profile 2·onboarding 1) — MATCHES
  0e census exactly.
- LESSONS strip source = per-surface `lessons:` (0) + CLAUDE.md 7 seams → 7 rendered, deduped.
- `sh -n tools/studio-build` = SYNTAX OK.

## S3 — usability quartet (tools/studio-build) — PRE-FLIGHT PASS
- 3a NOW banner (render_now_banner, atop Overview; soft-fails to "sequence.md Now not parsed").
- 3b PROGRAM MAP (render_program_map: shipped→now→next→then→launch rail, all from sequence.md).
- 3c progressive disclosure (`data-pcol` + `wirePcol` localStorage `studio_pcol_*`, state not in markup).
- 3d sidebar quick-jump filter (`#brail-filter` + `filterBrail`, `.style.display` toggle).
- **ES3 scan (generator inline-JS block): class=5, backtick=1, const/let/arrow=0 — ZERO GROWTH
  vs 0g baseline.** cscript ES3 **PARSE OK**. New JS toggles via `.style`/`.open`/getElementsByClassName
  (no `class=` literals, no backticks).
- Topnav untouched (still 7); new sections are SIDEBAR pages.

## S4 — seeds + riders — PASS
- **4a** lab.md: +R-ARC card (stage: shaping, 2026-07-13). Lab **5→6** (ambient SKIPPED per Preston).
- **4b** `docs/studio/r-arc.md` created (round-doc stub; status=future round; adjacent = arc
  interior · sub-theory writing · R10 dependency · Yumi generative).
- **4c** sequence.md DW-touch slug rider `shelf`→`books` (line 351); **net 0 bytes** (5==5);
  historical MW-1 line 285 `shelf` left untouched (pre-existing drift, out of scope).
- **4d** SKIPPED (Preston's ruling — ambient card already present at lab.md:40).
- **4e** `docs/studio/scan.md` + `docs/studio/r-shelf.md` created (round-doc stubs; status=queued
  round; SCAN = Oasis-grade Barcode/Photo/Shelf capture; R-SHELF = shelf metaphor + IA, decided at SHAPE-A).
- GATE: only INDEX.md/lab.md/sequence.md/tools/studio-build modified + 3 new stub docs + the 2
  checkpoints. (Other untracked docs/studio files pre-existed in the 0a snapshot.) surface-doc
  count +3 exactly; lab 5→6.
