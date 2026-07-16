# R-ARC — WAVE B CONTEXT-SUCCESSION HANDOFF

**Written at a slice boundary (session end after F4). The successor does NOT start Slice 4 without
Preston's word.** Ground truth below is from repo evidence at write time, not memory.

---

## 0. SUCCESSOR'S FIRST ACT (do this before anything else)

**Verify `HEAD == origin/main == this doc's commit SHA.** Run:
```
git rev-parse HEAD ; git rev-parse origin/main ; git ls-remote origin refs/heads/main
```
All three must equal the SHA this handoff was committed at (reported back to Preston at commit time). If
they disagree, STOP and report — do not build on a divergent tree. Then run `sh tools/ground-truth` and
read `docs/r-arc-plan.md` + `docs/checkpoints/r-arc-ff-routing.md` before any build.

---

## 1. WHERE THE TREE STANDS (repo evidence)

- **HEAD = `3fefc93`** (`feat(r-arc F4): remove the "From how you read" Yumi blocks — the covenant`).
  **HEAD == origin/main** (verified). **Live cache = `praxis-v3.217`** (deployed, cache-busted ×2 at push).
- **This session shipped Waves A + B through F4 — 9 commits** on top of the session-start origin `42ef1a3`:

| SHA | Slice | Live |
|---|---|---|
| `03e2da0` | docs — Stage 0 recon + 7 fork rulings; **F-DL closed NO-INCIDENT** | — |
| `3e6665e` | docs — full build plan + six fork rulings; **EMBER locked** | — |
| `98738b0` | **S1** — the disabled-state law (a dead `.btn` looked alive app-wide) + toast | v3.211 |
| `ba4888c` | **S2** — local-first notebook persistence (the hard gate; 3 red-team BLOCKs fixed) | v3.212 |
| `36dc570` | **S3** — the ember: arc lifecycle + rename + graduation; `'seed'`→`'nascent'` | v3.213 |
| `c681d35` | **S3R** — un-graduate (graduation's reverse gear; felt-pass-promoted) | v3.214 |
| `02b517e` | **S3B** — the basin: identity + naming (formless mote + origin phrase + naming threshold; 5 chrome surfaces) | v3.215 |
| `bb70889` | **S3B-POLISH** — basin display fixes (FF-5/9a/9b/9c + maturity-ramp unified) | v3.216 |
| `3fefc93` | **F4** — remove the "From how you read" blocks + N1 (`Name it…`) + N2 (Finish dormant pre-mint) | v3.217 |

**Round state:** the basin CORE felt-**PASSED** (Preston, deployed). 3B-POLISH felt-**PASSED**. F4 felt gate
is the pending item at session end (VISUAL GATE owed: single-column reading room + dormant Finish pill).
Every checkpoint lives at `docs/checkpoints/r-arc-*.md`; the plan is `docs/r-arc-plan.md`.

---

## 2. THE FELT-PASS FINDINGS + ROUTING (the operative planning doc)

`docs/checkpoints/r-arc-ff-routing.md` is the consolidated Slice-3B deployed felt-pass verification +
routing report (FF-1…FF-12, F4). Read it — it carries the code evidence for every finding.

**Preston's routing rulings (verbatim, 2026-07-16):**

> 1. 3B-POLISH RIDER: APPROVED as scoped (FF-5 + FF-9a/b/c). ADD the maturity-ramp desync (one ramp, one
> source-of-truth function, Arc-Read == Page == #search on the same number) if it fits the rider's band;
> if not, name it separately. Present the rider's band before build.
>
> 2. F4: OWN SMALL SLICE, approved (3R pattern). SCOPE = the WHOLE Page aside goes, including the
> evidence-grounded notes — the covenant (Yumi never speaks unbidden) admits no exception for grounded
> speech; that noticing returns via the raised-hand margin seat in Wave C. The .st-grid edit ships in the
> same slice, no blank gutter.
>
> 3. FF-7 VOCABULARY — anchors, apply table-wide:
>    - Pre-mint basin STATE word = GATHERING (from the four-lives canon: noticed → gathering → naming →
>      mint). NOT "forming" — that collides with the maturity ramp.
>    - Identity = origin phrase in provisional styling (per FF-5); text fallback when no phrase exists =
>      "Unnamed basin". "Untitled sub-theory" retires at all 22 sites — reach can ride 3B-MOTE or the
>      polish rider, your call, disclose which.
>    - Eyebrow stays truthful (born-just-now vs draft distinction from Slice 2 preserved).
>    - DOORS: destination-named, one verb — "Open the workshop →" / "Open the page →", each used ONLY
>      toward its destination. "Continue in" and "Edit in" retire.
>    - Yumi corner tag: ONE phrase app-wide — "I'm here when you want to talk it through."
>    Deliver the applied table for my confirm before any vocab build.
>
> 4. FF-10: Finish DORMANT pre-mint — disabled per the Slice 1 law, with a quiet reason tied to the
> naming invitation. Naming stays never-asked-never-forbidden; finishing requires a name.
>
> 5. FF-8: EXPAND SLICE 4 to include the note action-row collapse. Slice 4 must be RE-BANDED with the
> expansion and the band presented at its pre-build gate.
>
> 6. FF-6: NAMED SYSTEMIC ITEM "UNFILED-REACH". Deliver the DESIGN BRIEF this wave (no build): how
> bookless captures reach the rail, pull, and counts — match-state language per D9/D10. Build lands in
> Wave C alongside FF-12 (same rail).
>
> 7. FF-1 → Wave C named requirement "beat orientation" (FF-7's vocabulary is the interim). FF-2 → Wave C
> (per-passage door = Room work; existing Page door stays meanwhile). FF-11 → named debt under the
> desktop-composition mandate, not this wave. FF-12 → Wave C, confirmed.
>
> 8. Checkpoint correction approved; ride the next commit.
>
> ORDER: 3B-POLISH rider → F4 slice → Slice 4 (expanded, re-banded) → Slice 5 → UNFILED-REACH brief
> delivered → Wave C post-reset. Each slice HALTS at its gates per standing rules.

**Done this session from that order:** 3B-POLISH ✓ (`bb70889`), F4 ✓ (`3fefc93`).

---

## 3. REMAINING WAVE B ORDER (what the successor does next, ONLY on Preston's word)

1. **Slice 4 — ONE DOOR, NOT TWO (EXPANDED + RE-BANDED).** Plan: `docs/r-arc-plan.md` Slice 4. Core:
   collapse the 3 sub-theory creation paths to one (`notebookCreateSubTheory` retires the parallel `#arc/
   <id>/new-subtheory` redirect + the Yumi `nameSubTheoryFromThread` path). **EXPANDED (ruling #5):** also
   collapse the Notebook note-card action row (FF-8 — 6 equal-weight actions incl. destructive Delete at
   parity; §9b Finding #3) to one primary + overflow, destructive off the row. Also inherits the **arc-
   picker BOUND FINDING** (dark-token picker on the light notebook — plan Slice 4): the new door's arc
   picker ships ground-correct. **MUST be RE-BANDED with the FF-8 expansion; present the band at the
   pre-build gate BEFORE building.** Model: **OPUS**.
2. **Slice 5 — REVERSE GEAR (REQ#6).** Plan: `docs/r-arc-plan.md` Slice 5. Ember rename (shipped S3) +
   un-graduate (shipped S3R) already done; remaining = dissolve a basin back to motes + undo affordances.
   **Fork F-B ruled:** delete stays terminal (copy stands); recoverable delete = future item. Model: OPUS.
3. **UNFILED-REACH — DESIGN BRIEF (ruling #6, NO BUILD this wave).** Deliver a design brief: how bookless
   captures (`bookIds:[]`, a normal common state) reach the workshop rail, the pull, and the Page book-
   count — match-state language per **D9/D10**. Build lands in **Wave C** alongside FF-12 (same rail). The
   evidence is in `r-arc-ff-routing.md` FF-4/FF-6.
4. **FF-7 APPLIED VOCABULARY TABLE — for Preston's confirm (ruling #3, NO BUILD until confirmed).** Take
   the anchors (GATHERING · provisional identity · destination-named doors · one Yumi tag) and produce the
   applied table (every current string → its canonical replacement + surface), for Preston's ruling BEFORE
   any vocab build. Enumeration is in `r-arc-ff-routing.md` Part 2.

---

## 4. WAVE C — PARKED (post-Saturday-reset)

Wave C opens **only after Preston's Saturday reset** and starts with the **caret-safety SPIKE** (plan
Slice 6a): prove a NON-destructive decoration technique for in-text recognition before Room-lighting is
built — the codebase's own header calls live inline decoration "highest caret risk" and F-C ruled
**decoration is a DISPLAY LAYER ONLY; plain text is the single source of truth; decorated DOM never
reaches the serializer, even if the spike succeeds.** Wave C also absorbs FF-12 (gathered evidence beside
the canvas), FF-1 (beat orientation), FF-2 (per-passage door), UNFILED-REACH's build, and the workshop
felt mandate (FF-3). See `docs/r-arc-plan.md` Slices 6–9 + 12.

---

## 5. BINDING RULES FOR THE SUCCESSOR (non-negotiable)

- **Nothing pushes without Preston's exact words.** Commit locally; then he says push. On push, prove:
  commit SHA, `HEAD == origin/main == ls-remote`, and the live `sw.js` version with **two cache-busted
  reads**.
- **Every slice HALTS at its gates** — Stage 0 recon → build slice-by-slice → self-verify (parse, byte
  band, greps, EOL via `git ls-files --eol` not the circular diffstat) → **fix-red-team** → **praxis-
  reviewer** (its verdict gates the commit) → rig live-verify → checkpoint → STOP for Preston.
- **A DECLARED BAND is presented before build** and is a **HARD halt** on breach — logic overage HALTS,
  comment-only clears by line classification, a band is NEVER silently widened. (S2 + S3 were re-banded by
  Preston; S3B-POLISH held its declared band.)
- **CLAIMING ABSENCE REQUIRES PROOF** — cite the exhaustive ESCAPED grep (`git log -S`, full-corpus) that
  would have found it. An unescaped `.` is a wildcard. (Bitten repeatedly; the F4 red-team's repo-wide
  orphan sweep is the model.)
- **NEVER `--amend` while agents were live** unless the tree is verified clean (`git status` clean +
  `git diff HEAD` empty), and **verify the tree AFTER any amend** (`git diff <base>..HEAD --stat`).
  Pathspec checkout mutates the live index even under `--work-tree`. (S3B-POLISH's em-dash amend was safe
  only because the tree was verified first.)
- **MODEL LAW:** gate agents (`praxis-reviewer`, `praxis-recon`, `studio-scan`, `repo-mapper`,
  `studio-mockup`) = **sonnet** (frontmatter). `fix-red-team` / `fix-implementer` = **inherit**. Deep build
  slices, mockup shaping, Yumi grammar = **OPUS** session. ⚠ Inside a `Workflow`, omitting `model` inherits
  the SESSION model, not frontmatter — pass it explicitly there or the law breaks silently. The Agent tool
  honors frontmatter.
- **FF-7 ANCHORS (ruled, apply when the vocab build fires):** pre-mint state word = **GATHERING** (never
  "forming"); identity = origin phrase in provisional styling, fallback **"Unnamed basin"**; doors
  **destination-named, one verb** ("Open the workshop →" / "Open the page →", each only toward its
  destination); **one** Yumi corner tag app-wide = **"I'm here when you want to talk it through."**
- **Rig discipline:** LOAD `.claude/rig/` (never rebuild); fresh port per session (no urlacl on this box);
  seed self-seeds the Pedagogy workspace + stubs auth (`d0tester`); **kill SW + caches before measuring**
  (the SW re-registers and serves stale JS — caught mid-verify in S2 + S3); `studio-build` runs DETACHED
  (~15-20 min, never concurrent). `prestonpraxistest` for behavioral smoke; **`prestona255` NEVER signs
  into the rig browser** (stale cache = the F-DL clobber source; F-DL5 unfixed).
- **Strict ES3:** `var`/`function` only, string concat, two-arg `.then`, no `const`/`let`/arrow/template-
  literal/`class`. Parse via `cscript //nologo //E:jscript tools/parse-check <file>`.
- **Byte-locks:** `assets/lumen-amber.css` = 14,681 · `assets/marks.js` = 10,255. **Frozen (census only):**
  `arc-constellation.js`, `tradition-forms-arc.js`, the yumi eval-gate region of `yumi-brain.js`.

---

## 6. OPEN NAMED ITEMS (do not lose these)

| Item | What | Home |
|---|---|---|
| **3B-MOTE** | the formless mote on the ~6 remaining reference/list chrome sites (Arcs-list cards, connections footers, profile thumb, grew-row, Read-tab list, 2 dialogs) + the **frozen FIELD** render. Inherits the frozen-field ruling (ONE authorized edit to `arc-constellation.js` + hard red-team). The arc-card-constellation treatment (mote vs shapes) is decided INSIDE 3B-MOTE. **"Untitled sub-theory" retirement (22 sites) rides here.** | `docs/r-arc-plan.md` Slice 3B-MOTE |
| **3B-SM** | basin split + merge (§4b life-2). Merge has a template (`mergeBookDuplicates`); split has ZERO precedent (needs a spike). Runs only after Preston felt-tests the basin. | `docs/r-arc-plan.md` Slice 3B-SM |
| **UNFILED-REACH** | bookless captures unreachable from theorizing surfaces (FF-6). Design brief this wave; build in Wave C. | `r-arc-ff-routing.md` FF-6 |
| **CAPTURE-OWNER** | ⚠ **BETA-GATE HARD REVIEW.** `captureNote` reads `getCurrentUser()` fresh; the multi-image commit path has an async put window where an account switch misattributes the note. Pre-existing (base `98738b0`), NOT an S2 regression. Same posture as FX-1: **no outside account invited while unreviewed.** | `docs/studio/sequence.md` beta-readiness gate item 1b + `r-arc-s2.md` residual #10 |
| **Arc-Read dot/label pairing** | the maturity WORD now uses `_stMaturityWord` (.34/.67) but the Arc-Read glow-dot COLOR class still uses `_arcReadMaturityKey` (.4/.7) — they disagree in narrow score zones. Left as-is (dot is a separate visual signal); flag at Preston's visual pass; trivial follow-on if he wants the dot unified. | `r-arc-s3b-polish.md` residual #1 |
| **FF-11 desktop debt** | the Notebook desktop void (the newborn card floats in a large empty column) — a distinct instance from Slice 12's named workshop void. Named debt under the desktop-composition mandate; NOT this wave. | `r-arc-ff-routing.md` FF-11 |
| **N2 re-enable timing** | naming a basin re-enables Finish on the NEXT render (not on title blur), consistent with the mote/invite. Live re-enable = a small follow-on. | `r-arc-f4.md` residual #2 |
| **Studio-census refresh** | `docs/studio/subtheory-build.md` + the generated Builder still name the removed `.stb-ymargin` — refresh at the R-ARC round close (S1–S3B deferred per-slice studio-census updates; the round is tracked via `r-arc-*` checkpoints + `r-arc-plan.md`). | round close |

---

## 7. VISUAL GATES OWED (Preston's eyes on deploy)
- ~~**F4** (this session's pending gate): the single-column reading room (no right gutter) + the dormant
  Finish pill on an unnamed basin.~~ **CLEARED — F4 deployed visual gate PASSED (Preston, 2026-07-16, no
  findings).** Recorded in `docs/checkpoints/r-arc-f4.md` residual #1.
- Carried: S3 (ember chip / graduate / rename / "Unnamed"), S3R ("Return to ember"), S3B (the mote glow +
  naming invitation), 3B-POLISH (provisional phrase + placeholder + the Arc-Read dot/label pairing).
