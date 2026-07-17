# R-ARC — WAVE B SUCCESSION HANDOFF #2 (Slice 4 shipped + felt-PASSED; Slice 5 next)

**Written at a slice boundary (Slice 4 felt-PASSED, deployed). The successor does NOT start Slice 5 without
Preston's word.** Ground truth below is from repo evidence at write time, not memory. This continues
`r-arc-wave-b-handoff.md` (handoff #1, which took the round F4 → Slice 4).

---

## 0. SUCCESSOR'S FIRST ACT (before anything else)

**Verify `HEAD == origin/main == this doc's commit SHA`.** Run:
```
git rev-parse HEAD ; git rev-parse origin/main ; git ls-remote origin refs/heads/main
```
All three must equal the SHA this handoff was committed at (reported to Preston at commit time). If they
disagree, STOP and report. Then run `sh tools/ground-truth`, read `docs/r-arc-plan.md` (Slice 5) +
`docs/checkpoints/r-arc-s4.md` (the last build's full log + gates) before any build.

---

## 1. WHERE THE TREE STANDS (repo evidence)

- **HEAD = `62eeca8`** (`feat(r-arc S4): one door — three creation paths collapse, FF-8 row, arc-picker relit`).
  **HEAD == origin/main == ls-remote** (verified). **Live cache = `praxis-v3.218`** (deployed; two
  cache-busted `sw.js` reads confirmed; the live SW cache is named `praxis-v3.218`).
- **The round to date (on session-start origin `42ef1a3`):** S1 v3.211 · S2 v3.212 · S3 v3.213 · S3R v3.214 ·
  S3B v3.215 · S3B-POLISH v3.216 · F4 v3.217 · **S4 v3.218** (`62eeca8`). Handoff #1 (`c01cb4d`) + the F4
  gate doc (`379dead`) are docs commits between F4 and S4.

**Round state:** Slice 4 (One Door + FF-8 + arc-picker) **felt-PASSED on the deployed build (Preston).**
Every checkpoint lives at `docs/checkpoints/r-arc-*.md`; the plan is `docs/r-arc-plan.md`.

---

## 2. SLICE 4 FELT PASS — result + rulings (Preston, on deploy)

**FELT PASS = PASS.** Deployed confirmed: arc-picker light on the live build; FF-8 row + overflow correct;
one door working. Rulings from the pass:
- **FF-8 overflow FORM: inline-reveal STANDS** (the ⋯ opens a block below the row — Preston accepted the form).
- **⚠ YUMI NOTICE→FOLD WATCH (open item):** the Yumi NOTICE did not surface organically at the felt pass
  (insufficient thread material — NOT a defect). **Before Wave C, confirm a real noticing → fold cycle fires
  during normal use** — the S4-6 fold (`notebookGatherFromThread`) is now the ONLY sub-theory-creation route
  from Yumi's panel, so a live noticing→propose→Accept→pre-gather→door→create must be observed end-to-end.
- **R6 ruling DEFERRED to that same moment:** whether the Yumi-panel Accept should honor clear-to-basin
  (today it reverts an emptied field to `proposal.name`; clearing at the DOOR already yields a basin) is
  ruled WHEN the live noticing→fold cycle is observed. Do not build R6 before then.

---

## 3. REMAINING WAVE B ORDER (successor does next, ONLY on Preston's word)

1. **Slice 5 — REVERSE GEAR (REQ#6).** Plan: `docs/r-arc-plan.md` Slice 5. **Already shipped:** ungather
   (`toggleGather`), link/unlink, sub-theory rename, ember rename (S3), **un-graduate (S3R)**. **Remaining
   scope = the reverse acts NOT yet built:** **dissolve a basin back to motes** + **undo affordances on the
   loop's remaining forward acts.** **Fork F-B RULED:** delete stays **terminal** (arc + sub-theory); its
   "This can't be undone" copy **stays truthful**; recoverable delete = **named future item, not this round.**
   ⚠ At Slice-5 recon, disambiguate "dissolve basin → motes" from the **3B-SM** split/merge item (§6) — they
   are related but distinct (dissolve = un-form entirely; split/merge = divide/combine). Plan band:
   `js/views.js` +2…+5 KB · `js/state.js` +0.5…+1.5 KB. **Model: OPUS.** Declared band presented at the
   pre-build gate; per Preston's standing run-mode it does NOT wait for his ok — declare it, proceed, HARD
   halt on breach.
2. **UNFILED-REACH — DESIGN BRIEF (ruling #6, NO BUILD this wave).** How bookless captures (`bookIds:[]`, a
   normal common state) reach the workshop rail, the pull, and the Page book-count — match-state language per
   **D9/D10**. Build lands in **Wave C** alongside FF-12. Evidence: `r-arc-ff-routing.md` FF-4/FF-6.
3. **FF-7 APPLIED VOCABULARY TABLE — for Preston's confirm (ruling #3, NO BUILD until confirmed).** Take the
   anchors (§5) → produce the applied table (every current string → its canonical replacement + surface).
   Enumeration in `r-arc-ff-routing.md` Part 2.
4. **ROUND CLOSE PREP.** Re-run `tools/studio-build`; refresh `docs/studio/sequence.md` + the surface
   markdown (the studio-census refresh — §6); re-evaluate the sequence per the living-plan rule; the round
   closes ONLY on Preston's felt pass.

---

## 4. WAVE C — PARKED (post-Saturday-reset)

Opens **only after Preston's Saturday reset**; starts with the **caret-safety SPIKE** (plan Slice 6a): prove
a NON-destructive decoration technique before Room-lighting. **F-C ruled: decoration is a DISPLAY LAYER ONLY;
plain text is the single source of truth; decorated DOM never reaches the serializer, even if the spike
succeeds.** Wave C absorbs FF-12 (gathered evidence beside the canvas), FF-1 (beat orientation), FF-2
(per-passage door), UNFILED-REACH's build, the workshop felt mandate (FF-3), AND the Yumi noticing's return
via the **raised-hand margin seat** (F4's covenant deferral). See `docs/r-arc-plan.md` Slices 6–9 + 12.

---

## 5. BINDING RULES FOR THE SUCCESSOR (non-negotiable)

- **Nothing pushes without Preston's exact words.** Under his standing unattended run-mode: build the slice,
  run the full gate suite, commit LOCAL, then HALT for the push word. On push, prove: commit SHA, `HEAD ==
  origin/main == ls-remote`, live `sw.js` version with **two cache-busted reads**.
- **Every slice HALTS at its gates** — Stage 0 recon → build slice-by-slice → self-verify (parse via
  `cscript //nologo //E:jscript tools/parse-check`, byte band, greps, EOL via `git ls-files --eol` + surgical
  diffstat) → **fix-red-team** → **praxis-reviewer** (verdict gates the commit) → **rig live-verify
  (INTERACTIVE-CONTROL SWEEP — fire every control, probe its OWN state)** → checkpoint → STOP.
- **UNATTENDED RUN-MODE (Preston's standing directive):** build workstreams end-to-end without stopping; run
  the full gate suite between each; **the declared band does NOT wait for Preston** — declare it, proceed,
  HARD halt on breach. **HALT ONLY on the four standing conditions:** (1) a NEW fork the rulings don't cover,
  (2) a band breach, (3) any gate HOLD/BLOCK the fix doesn't resolve, (4) the final commit gate (commit local,
  then halt for the push word). A red-team BLOCK in your own fresh code with a determined fix = fix + re-verify
  + continue (both S4 red-team BLOCKs were handled this way); halt to Preston only for a fork / unresolvable
  regression / design call. (S4 halted once, correctly, on S4-6 — the Yumi move's fate.)
- **A DECLARED BAND is a HARD halt on breach** — logic overage HALTS; comment-only clears by line
  classification; NEVER silently widen. (S4's components.css hit +4,067 vs a +4,096 ceiling and was trimmed
  to +3,851 for headroom — watch tight CSS bands.)
- **CLAIMING ABSENCE REQUIRES PROOF** — escaped grep (`git log -S`, full-corpus); an unescaped `.` is a
  wildcard.
- **NEVER `--amend` while agents were live** unless the tree is verified clean; verify the tree AFTER any amend.
- **MODEL LAW v2 (ratified 2026-07-16; CLAUDE.md is canon): SONNET CHECKS · OPUS EXECUTES · FABLE DESIGNS.**
  Gate agents (`fix-red-team`, `praxis-reviewer`, `repo-mapper`, `praxis-recon`, kin `studio-scan`,
  `studio-mockup`) = **Sonnet, frontmatter-pinned** (⚠ inside a `Workflow`, pin explicitly — omitting `model`
  inherits the session). **Already-ruled work runs OPUS 4.8 at default effort; deep rounds carrying
  substantial UNRULED judgment run FABLE 5 at DEFAULT (high) effort — never ultracode/max on Fable.** THE
  TEST: how much unruled judgment does the session exercise? Switches happen only at session boundaries via
  handoff; every handoff states its model.
  **→ THIS SUCCESSION: the Slice 5 successor runs OPUS 4.8** — Reverse Gear is already-ruled (F-B ruled,
  plan-banded). **→ WAVE C runs FABLE 5 at DEFAULT effort** — substantial unruled judgment (the caret spike,
  Room lighting, the raised-hand seat). (Live-file follow-on: `fix-red-team.md` frontmatter is still
  `inherit`; v2 pins it Sonnet — align in a separate config commit.)
- **FF-7 ANCHORS (ruled; apply when the vocab build fires):** pre-mint state word = **GATHERING** (never
  "forming"); identity = origin phrase in provisional styling, fallback **"Unnamed basin"**; doors
  **destination-named, one verb** ("Open the workshop →" / "Open the page →", each only toward its
  destination); **one** Yumi corner tag app-wide = **"I'm here when you want to talk it through."**
- **Rig discipline:** LOAD `.claude/rig/` (never rebuild); serve DETACHED (background Bash, not Start-Job —
  Start-Job did not keep the listener alive this session); fresh port per session; seed self-seeds the
  Pedagogy workspace + stubs auth (`d0tester` via `praxis_user`); **kill SW + caches before measuring**;
  `studio-build` runs DETACHED (~15-20 min, never concurrent); **`prestona255` NEVER signs into the rig
  browser**. ⚠ **NEW LESSON (S4):** the Browser-pane's own SW caches the `<link>` stylesheet by pathname and
  serves STALE CSS despite unregister+clear+reload AND despite a `<link>` cache-bust query — this bit WS-C on
  BOTH the rig and the deployed pane (fresh JS, stale CSS). **`fetch(url,{cache:'no-store'})` DOES bypass it.**
  To verify a CSS effect: probe the server directly (`Invoke-WebRequest`) for the rule, then `fetch` the fresh
  bytes and inject the rule as a small `<style>` and measure `getComputedStyle`. The auth stub is also cleared
  by the app's boot auth-listener — re-set `praxis_user` POST-boot (no reload). Real users are unaffected (their
  SW re-precaches on the version bump); Preston's own-browser felt pass is the visual gate.
- **Strict ES3:** `var`/`function` only, string concat, two-arg `.then`, no `const`/`let`/arrow/template-
  literal/`class`.
- **Byte-locks:** `assets/lumen-amber.css` = 14,681 · `assets/marks.js` = 10,255. **Frozen (census only):**
  `arc-constellation.js`, `tradition-forms-arc.js`, the yumi eval-gate region of `yumi-brain.js`.

---

## 6. OPEN NAMED ITEMS (do not lose these)

| Item | What | Home |
|---|---|---|
| **YUMI NOTICE→FOLD WATCH** (new, S4) | Confirm a REAL Yumi noticing → fold → door → create cycle fires during normal use BEFORE Wave C — the S4-6 fold is now the ONLY creation route from Yumi's panel, and it did not surface organically at the S4 felt pass (insufficient thread material). | S4 felt pass |
| **R6** (new, S4) | The Yumi-panel Accept reverts an emptied name field to `proposal.name` (clear-to-basin is honored at the door, not the panel). **Ruling DEFERRED** to the Yumi-watch moment above. | `r-arc-s4.md` R6 |
| **R4** (S4) | The fold REPLACES an in-progress manual gather on Accept (notes persist; staged selection/arc/name lost). Matches the ruling ("pre-gathers"); merge-vs-replace is a felt-pass follow-on if Preston wants it. | `r-arc-s4.md` R4 |
| **R5** (S4) | `notebookNewborn` cross-account carry-over is safe TODAY only via a pre-existing guard in `buildNotebookRightLeaf` (`views.js`, "a fresh gather supersedes the last birth card"). Named so a future edit there can't silently reopen a leak. | `r-arc-s4.md` R5 |
| **3B-MOTE** | The formless mote on the ~6 remaining reference/list chrome sites + the **frozen FIELD** render (ONE authorized `arc-constellation.js` edit + hard red-team). **"Untitled sub-theory" retirement (22 sites) rides here.** | `r-arc-plan.md` Slice 3B-MOTE |
| **3B-SM** | Basin split + merge (§4b life-2). Merge has a template (`mergeBookDuplicates`); split has ZERO precedent (spike). Distinct from Slice-5 "dissolve → motes" — disambiguate at recon. | `r-arc-plan.md` Slice 3B-SM |
| **UNFILED-REACH** | Bookless captures unreachable from theorizing surfaces (FF-6). Design brief this wave; build in Wave C. | `r-arc-ff-routing.md` FF-6 |
| **CAPTURE-OWNER** | ⚠ **BETA-GATE HARD REVIEW.** `captureNote` reads `getCurrentUser()` fresh; the multi-image commit path has an async put window where an account switch misattributes the note. Pre-existing (base `98738b0`), NOT an S2 regression. **No outside account invited while unreviewed.** | `sequence.md` beta gate 1b · `r-arc-s2.md` residual #10 |
| **Arc-Read dot/label pairing** | The maturity WORD uses `_stMaturityWord` (.34/.67); the Arc-Read glow-dot COLOR class uses `_arcReadMaturityKey` (.4/.7) — they disagree in narrow score zones. Trivial follow-on if Preston wants the dot unified. | `r-arc-s3b-polish.md` residual #1 |
| **FF-11 desktop debt** | The Notebook desktop void (the newborn card floats in a large empty column). Named debt under the desktop-composition mandate; NOT this wave. | `r-arc-ff-routing.md` FF-11 |
| **N2 re-enable timing** | Naming a basin re-enables Finish on the NEXT render (not on title blur). Live re-enable = a small follow-on. | `r-arc-f4.md` residual #2 |
| **Studio-census refresh** | `docs/studio/subtheory-build.md` + the generated Builder still name the removed `.stb-ymargin`; and the FF-8 collapse + arc-picker relight are un-censused. Refresh at the R-ARC round close (S1–S4 deferred per-slice census updates; tracked via the `r-arc-*` checkpoints). | round close |

---

## 7. VISUAL GATES
- **Slice 4: felt-PASSED (Preston, deployed v3.218).** Nothing owed. The Yumi noticing→fold cycle is a
  behavioral WATCH (§2/§6), not a visual gate.
- No earlier gates outstanding (S1–F4 all felt-passed; recorded in their checkpoints).
