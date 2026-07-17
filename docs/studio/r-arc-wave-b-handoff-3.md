# R-ARC — WAVE B SUCCESSION HANDOFF #3 (Slice 5 shipped+live; FF-7 vocab rider next)

**Written at a context boundary (~82% used) after Slice 5 shipped + felt-pending, the deliverable rulings
recorded. The successor does NOT start the FF-7 rider without Preston's word.** Ground truth below is from
repo evidence at write time. Continues `r-arc-wave-b-handoff-2.md` (#2, which took the round Slice 4 → Slice 5).

---

## 0. SUCCESSOR'S FIRST ACT (before anything else)

**Verify `HEAD == origin/main == ls-remote`.** Run:
```
git rev-parse HEAD ; git rev-parse origin/main ; git ls-remote origin refs/heads/main
```
**Pushed/live code state = `4a8f425`** (Slice 5). At this handoff's write time there are **local unpushed
docs commits on top** (the deliverable-rulings commit `46523a4`, then this handoff commit) — so `HEAD` will
be *ahead of* `origin/main`, and BOTH docs commits await Preston's next push word. The CODE state (`4a8f425`,
live `sw.js` **v3.219**) is what must match the remote. Then run `sh tools/ground-truth`, read
`docs/r-arc-plan.md`, `docs/checkpoints/r-arc-s5.md`, and the two confirmed deliverable docs (§5 below).

---

## 1. WHERE THE TREE STANDS (repo evidence)

- **Pushed/live code = `4a8f425`** (`feat(r-arc S5): reverse gear — dissolve a basin back to loose motes`).
  Verified `HEAD==origin==ls-remote` all `4a8f425` at push; live `sw.js` = **praxis-v3.219** (two
  cache-busted reads, age=0). Preceded by config `6ad6822` (fix-red-team frontmatter `inherit→sonnet`).
- **Local unpushed docs commits (await push word):** `46523a4` (UNFILED-REACH + FF-7 rulings recorded) +
  this handoff. **Docs-only; no code.**
- **The round to date:** S1 v3.211 · S2 v3.212 · S3 v3.213 · S3R v3.214 · S3B v3.215 · S3B-POLISH v3.216 ·
  F4 v3.217 · S4 v3.218 · **S5 v3.219** (`4a8f425`).

**Round state:** Slice 5 (Reverse Gear — dissolve) **SHIPPED + LIVE, felt pass PENDING** (Preston's eyes on
the deployed dissolve). Every checkpoint lives at `docs/checkpoints/r-arc-*.md`.

---

## 2. WHAT SHIPPED THIS SESSION (Slice 5 + config + rulings)

- **Config `6ad6822`:** `fix-red-team.md` frontmatter `inherit → sonnet` (MODEL LAW v2 SONNET-CHECKS).
- **Slice 5 `4a8f425`:** `dissolveBasin(id)` (state.js) + `confirmDissolveBasin` + workshop-foot swap
  (views.js) + `.st-confirm-btn-primary` / `.stb-dissolve` (components.css) + sw.js v3.219. A basin's gathered
  notes are evidence *references* (never consumed), so dissolve removes only the record; the motes stay in the
  notebook. Guarded to a basin with **no authored content — prose AND valueMarks.**
- **⚠ CARRIED LESSON (red-team BLOCK, S5):** a dissolve/delete guard must cover **EVERY author-authored,
  record-only field, not just prose.** The recon's data-model survey enumerated `evidence[]` only and MISSED
  `valueMarks[].why` (author-typed, record-only, authorable on a basin's READ page — `buildValueMarkRegister`
  mounts `views.js:11113` with only an owner-signed-in gate, **no draft gate**). The guard now covers both;
  UI mirror = `footIsDissolvableBasin`. Residual R1 (no live loss today): `evidence[]` `kind:'external'` +
  per-element `annotation` are also authored+record-only but have no live writer (read-only in the live UI).
- **Gates:** self-verify PASS · fix-red-team (1 BLOCK fixed) · praxis-reviewer CLEARED · rig
  INTERACTIVE-CONTROL SWEEP PASS (basin dissolved + note survived + **persisted**; named + value-marked basins
  kept terminal delete; state guard refuses a value-marked basin; console clean). Record: `r-arc-s5.md`.
- **Deliverable rulings recorded (`46523a4`, local):** UNFILED-REACH F1–F4 + FF-7 (1)–(3) — see §5.

---

## 3. REMAINING WAVE B ORDER (successor does next, ONLY on Preston's word)

1. **FF-7 VOCAB RIDER — BUILD (ruling confirmed; this is the next build).** Apply the **confirmed** applied
   table (`docs/checkpoints/r-arc-ff7-applied-vocab.md`) app-wide. **Model: OPUS** (already-ruled — the table
   is Preston-confirmed vocabulary, not fresh design). Scope (from the table §E): newborn eyebrow, Page kicker
   (basin/named split), 3 door labels → destination-named, one Yumi tag unified across 2 surfaces, and the
   Arc-Read maturity words **+ dot-color thresholds** → the shared `.34/.67` ramp (this **closes the standing
   Arc-Read dot/label residual**). The **22-site "Untitled sub-theory" retirement RIDES 3B-MOTE, NOT this
   rider.** Declare the band at recon (string swaps + the basin/named kicker branch + the maturity-ramp
   unification; no schema, no route — likely small: `views.js` low-KB, possibly a few CSS bytes for the ramp).
   Full gate suite (self-verify → fix-red-team → praxis-reviewer → rig sweep → checkpoint). Watch: COPY IS A
   CONTRACT — the new words must match built behavior; and the basin/named kicker branch is a real conditional,
   not a blind string swap.
2. **ROUND CLOSE PREP.** Re-run `tools/studio-build` (DETACHED, ~15-20 min, never concurrent); refresh
   `docs/studio/sequence.md` + the surface markdown (the **deferred studio-census refresh** — S1–S5 per-slice
   census updates + the removed `.stb-ymargin`, the FF-8 collapse, arc-picker relight, and now dissolve, are
   all un-censused — see handoff #2 §6); re-evaluate the sequence per the living-plan rule; **the round closes
   ONLY on Preston's felt pass.**

---

## 4. WAVE C — PARKED (post-Saturday-reset) — **FABLE 5**

Opens **only after Preston's Saturday reset**. **MODEL: FABLE 5 at DEFAULT (high) effort** (substantial
UNRULED judgment — never ultracode/max on Fable). Starts with the **caret-safety SPIKE** (plan Slice 6a):
prove a NON-destructive decoration technique before Room-lighting. **F-C ruled: decoration is a DISPLAY LAYER
ONLY; plain text is the single source of truth; decorated DOM never reaches the serializer.** Wave C absorbs:
**UNFILED-REACH's build (CONFIRMED F1–F4, alongside FF-12, same rail)**, FF-12 (gathered evidence beside the
canvas), FF-1 (beat orientation), FF-2 (per-passage door), the workshop felt mandate (FF-3), AND the Yumi
noticing's return via the **raised-hand margin seat** (F4's covenant deferral). See `docs/r-arc-plan.md`
Slices 6–9 + 12.

---

## 5. THE CONFIRMED DELIVERABLE RULINGS (Preston, 2026-07-17)

**UNFILED-REACH** (`docs/checkpoints/r-arc-unfiled-reach-brief.md`) — **CONFIRMED for Wave C, alongside FF-12:**
- **F1 = GLOBAL unfiled group** in the rail (FF-12's panel covers own-evidence). **F2 = "· N BOOKS · N
  UNFILED"** (shown when unfiled > 0). **F3 = NO — weaving never files** (filing stays explicit). **F4 = NO new
  Inbox sibling** (One Door; the overflow "Send to sub-theory" already routes Inbox captures).

**FF-7** (`docs/checkpoints/r-arc-ff7-applied-vocab.md`) — **CONFIRMED; the rider is cleared to build:**
- **(1) Lifecycle words:** chip **"GATHERING"**; newborn eyebrow **"gathering · just now"**; Page kicker
  basin **"· GATHERING"** / named **"· DRAFT"**; "forming" retires everywhere.
- **(2) Maturity ramp:** unify **words AND dot-color thresholds to `.34/.67`** (nascent / developing /
  established) — one source of truth; **closes the Arc-Read dot/label residual** (dot key repoints .4/.7 →
  .34/.67).
- **(3) Doors:** destination-named **"Open the workshop →"** (→ `/build`) / **"Open the page →"** (→
  `#subtheory/<id>`), including the Arc-detail Page-face stub fix.
- **Identity fallback "Unnamed basin" stands**; the Yumi tag unifies to **"I'm here when you want to talk it
  through."** app-wide.

---

## 6. BINDING RULES FOR THE SUCCESSOR (non-negotiable)

- **Nothing pushes without Preston's exact words.** Standing unattended run-mode: build the slice, run the
  full gate suite, commit LOCAL, HALT for the push word. On push, prove: commit SHA, `HEAD==origin==ls-remote`,
  live `sw.js` with **two cache-busted reads**.
- **Every slice HALTS at its gates:** Stage 0 recon → build → self-verify (parse `cscript //nologo //E:jscript
  tools/parse-check`; byte band; greps; EOL `git ls-files --eol` + surgical diffstat) → **fix-red-team** →
  **praxis-reviewer** (verdict gates) → **rig live-verify (INTERACTIVE-CONTROL SWEEP — fire every control,
  probe its OWN state)** → checkpoint → STOP.
- **UNATTENDED RUN-MODE:** build end-to-end; the declared band does NOT wait for Preston — declare it, proceed,
  HARD halt on breach. **HALT ONLY on the four standing conditions:** (1) a NEW fork the rulings don't cover,
  (2) a band breach, (3) a gate HOLD/BLOCK the fix doesn't resolve, (4) the final commit gate. A red-team BLOCK
  in your own fresh code with a determined fix = fix + re-verify + continue (S5 did exactly this on the
  valueMarks BLOCK). **⚠ BAND DISCIPLINE:** comment overage clears by line classification (trim for headroom,
  S4/S5 precedent); logic overage HALTS; NEVER silently widen. (S5's state.js + css bands were both tight —
  watch verbose comments.)
- **CLAIMING ABSENCE REQUIRES PROOF** — escaped grep (`git log -S`, full-corpus); an unescaped `.` is a wildcard.
- **MODEL LAW v2 (CLAUDE.md canon): SONNET CHECKS · OPUS EXECUTES · FABLE DESIGNS.** Gate agents
  (`fix-red-team` NOW Sonnet-pinned via `6ad6822`, `praxis-reviewer`, `repo-mapper`, `praxis-recon`,
  `studio-scan`, `studio-mockup`) = Sonnet, frontmatter-pinned (⚠ inside a `Workflow`, pin explicitly).
  **→ FF-7 rider = OPUS** (already-ruled). **→ Wave C = FABLE 5 at DEFAULT effort.**
- **Rig discipline:** LOAD `.claude/rig/` (never rebuild); serve DETACHED (background Bash, `serve.ps1
  -Port <fresh>`); seed self-seeds Pedagogy + stubs auth (`d0tester` via `praxis_user`); **kill SW + caches
  before measuring**; `prestona255` NEVER signs into the rig. ⚠ Browser-pane SW caches the `<link>` stylesheet
  by pathname → serves STALE CSS despite unregister+clear+reload; `fetch(url,{cache:'no-store'})` bypasses it
  (probe the server directly + inject the rule to measure). The auth stub is cleared by the boot auth-listener
  — re-set `praxis_user` post-boot. Screenshots are DEAD in the pane (geometry is evidence). **⚠ To stop the
  rig: `HttpListener` binds via HTTP.sys so the port shows under System/PID 4 — kill the `powershell.exe`
  running `serve.ps1` (by CommandLine), not the port owner.**
- **Strict ES3:** `var`/`function`, string concat, two-arg `.then`, no `const`/`let`/arrow/template-literal/`class`.
- **Byte-locks:** `assets/lumen-amber.css` = 14,681 · `assets/marks.js` = 10,255. **Frozen (census only):**
  `arc-constellation.js`, `tradition-forms-arc.js`, yumi eval-gate region of `yumi-brain.js`.

---

## 7. OPEN NAMED ITEMS (do not lose these)

| Item | What | Home |
|---|---|---|
| **Slice 5 felt pass** | Preston's eyes on the deployed dissolve (v3.219): basin foot shows "Dissolve this basin", modal reassures, dissolving returns notes to the notebook; named/value-marked basins keep terminal delete. | live v3.219 |
| **FF-7 vocab rider** | The next BUILD (§3.1) — apply the confirmed table app-wide (OPUS). | `r-arc-ff7-applied-vocab.md` |
| **Arc-Read dot/label residual** | **CLOSED BY the FF-7 rider** (ruling #2 unifies dot thresholds to .34/.67). Verify it's actually closed in the rider. | FF-7 ruling |
| **YUMI NOTICE→FOLD WATCH** | Confirm a REAL Yumi noticing → fold → door → create cycle fires during normal use BEFORE Wave C (S4-6 fold is the only Yumi creation route; did not surface organically at the S4 felt pass). | handoff #2 §6 |
| **R6** (Yumi-panel clear-to-basin) | The Yumi-panel Accept reverts an emptied name to `proposal.name`; **ruling DEFERRED** to the Yumi-watch moment. | `r-arc-s4.md` R6 |
| **UNFILED-REACH build** | CONFIRMED (F1–F4); builds in Wave C alongside FF-12 (same rail). | `r-arc-unfiled-reach-brief.md` |
| **S5 R1 residual** | `evidence[]` external/annotation authored+record-only but no live writer; if a future slice adds an external/annotation editor reachable on a basin, extend `dissolveBasin`'s guard. | `r-arc-s5.md` R1 |
| **Studio-census refresh** | S1–S5 per-slice census + `.stb-ymargin` removal + FF-8 + arc-picker relight + dissolve un-censused; refresh at round close. | round close |
| **CAPTURE-OWNER** | ⚠ BETA-GATE HARD REVIEW (`captureNote` async put window misattributes on account switch; pre-existing). No outside account while unreviewed. | handoff #2 §6 |
| **3B-MOTE / 3B-SM** | Formless-mote everywhere + frozen FIELD (one authorized `arc-constellation.js` edit) / basin split+merge (spike). "Untitled sub-theory" 22-site retirement rides 3B-MOTE. | `r-arc-plan.md` |

---

## 8. VISUAL GATES
- **Slice 5: felt pass PENDING** (deployed v3.219). Behavioral proof is in `r-arc-s5.md` (rig sweep); Preston's
  eyes are the gate.
- No earlier gates outstanding (S1–S4 all felt-passed).
