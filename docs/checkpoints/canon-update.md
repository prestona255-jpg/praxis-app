# CANON UPDATE — STAGE 1 BUILD REPORT

Date 2026-09-03 · Base `5773b19` / v3.294 · **docs-only, no code, no cache bump, §9 not required**
Stage 0 recon: `docs/checkpoints/canon-update-recon.md` (accepted, homes as proposed).
Ruling: L13 added THIS ROUND (Preston, 2026-09-03) — the missing visual step in FIX-PROTOCOL is
"the root the other lessons grew from, not a separate item."

---

## 1 · Per-lesson disposition

| # | rule | disposition | where it landed |
|---|---|---|---|
| L1 | test the brief's premise before planning against it | **ADDED** | FIX-PROTOCOL §1 Stage 0 (#9), above "Confirm anchors" |
| L2 | fixtures reproduce the live data shape | **ADDED** | CLAUDE.md § Verification |
| L3 | "both readers agree" ≠ "both readers see everything" | **ADDED** | CLAUDE.md § Verification |
| L4 | confirm the uid before any cross-surface comparison | **ADDED** | CLAUDE.md § Verification |
| L5 | name the reference surface | **ADDED** | CLAUDE.md § Lessons |
| L6 | hoist, never copy half | **ADDED** | CLAUDE.md § Lessons |
| L7 | ordering hazards are stated, not assumed | **MERGED** into the existing byte-FLOOR bullet | FIX-PROTOCOL §1 Stage 0 (#10) |
| L8 | re-render after mutation | **ADDED**, citing the existing count check rather than restating it | CLAUDE.md § Verification |
| L9a | ask for the §9 lift in the go-ahead | **ALREADY PRESENT — not re-added.** Now carried in the REWRITTEN lead (RET-2) rather than a sub-bullet | CLAUDE.md § Verification |
| L9b | dispatch against a frozen tree | **ADDED** | FIX-PROTOCOL §9 |
| L10 | existence is not visibility | **ALREADY PRESENT — not re-added.** Verified in place, CLAUDE.md § Verification, "T3 PROVES THE CALL SITE EXECUTES. IT DOES NOT PROVE THE RESULT IS VISIBLE." (was :187 at base; :217 after this diff) | — |
| L11 | a console diagnostic does not exist for a phone-only user | **ADDED** | CLAUDE.md § Verification |
| L12 | the instrument settles it, not more reasoning | **ADDED** | CLAUDE.md § Lessons |
| **L13** | **VISUAL GATE in FIX-PROTOCOL** | **ADDED (Preston's ruling this round)** | FIX-PROTOCOL §1 Stage 1 (#11) |

Added 11 · already present 2 (cited, not re-added) · merged into an existing rule 1.
No lesson is stated in two places. L13 points at CLAUDE.md § Lessons for the standard rather than
restating VISUAL GATE / MOCKUP FIRST / FELT-DELTA / OWNER-VIEWPORT PRIMACY / CAPTURE PROVENANCE.

## 2 · Retirements

| # | verdict | before → after |
|---|---|---|
| RET-1 | **NOTHING TO RETIRE** | The CADENCE LAW has no trace in the repo. `grep -rn "CADENCE LAW\|Cadence Law\|cadence law"` over all `.md`/`.html` = **0**; `grep -rIl weekend` over the whole tree = 2 files, both `js/yumi-brain.js:2495` (a Yumi worked-example body); `git log --all -S "CADENCE LAW"` = **0 commits**. The only "CADENCE" in canon is BUILDER CADENCE (unrelated, live). Preston confirms it lived in his notes, not the repo. **No edit.** |
| RET-2a | **REWRITTEN** | BEFORE: "When a session instruction bars spawning agents, FIX-PROTOCOL §9's fix-red-team gate **cannot run. That is a HALT-tier condition**…" — the retracted absolute, stated first, with the correction as a sub-bullet below.<br>AFTER: "**THE SESSION BAR ON AGENTS IS CONDITIONAL, AND THE LIFT IS ASKED FOR BEFORE THE BUILD.** … **HALT-tier is the consequence of an UNLIFTED bar, not of the bar.**" The old sub-bullet is retitled **THE VERIFICATION BEHIND IT** and keeps only the non-duplicated half (the settings/registration verification that rules out a config cause); its "ask for the lift" sentences moved up into the lead rather than being repeated. |
| RET-2b | **ANNOTATED** | CLAUDE.md § Session rules — one sub-bullet under the praxis-recon + praxis-reviewer mandates covering both: gate agents are barred by DEFAULT, the bar is conditional, one sentence lifts it, "ask before the work, not at the gate." |
| RET-2c | — | covered by the same sub-bullet (one pointer for both mandates, deliberately not written twice). |
| RET-2d | **ANNOTATED ×2** | FIX-PROTOCOL §9 gained a paragraph naming the default bar and the lift; §1#8's recon-reviewer gate gained "This gate needs the same lift as §9 — see there." **A §9 reader now learns the lift exists**, which was the failure. |
| RET-3 | **ANNOTATED ×2, not removed** | FIX-PROTOCOL §1 Stage 2 and PROTOCOL.md §9 both now name how the live-verify is discharged when the origin is unreachable: the executor AUTHORS the device pass, Preston discharges it, and the round says in one line that the origin was unreachable. Measured, not assumed: `curl -s -o /dev/null -w "%{http_code}" https://praxis-reading.netlify.app/sw.js` → **`000`, exit 56**, re-confirmed 2026-09-03. |
| RET-4 | **REAFFIRMED — neither rule softened, no edit to either** | MOCKUP FIRST (CLAUDE.md § Lessons) and VISUAL GATE (ibid.) applied to the merge round and were skipped: its own v3.292 header reads *"the merge surface shipped proven and unreviewed by eye."* That is a **violation**, not a stale rule. The mechanism is recorded instead where it belongs — L13, the missing visual step in the protocol the round actually ran under. |
| RET-5 | **considered, not proposed** | FIX-PROTOCOL §5 path A (self-drive) went unused all week and §5 path C's interim human-read governed every data-tier round and held. Dormant is not superseded. |

## 3 · Version bumps (mechanical determination, named)

Both edited protocols carry a version line and a change-log convention, and PROTOCOL.md's own
footer mandates the bump on a rule change. Bumped, with the pointer corrected in the SAME commit
per "docs ride with the diff":

- `docs/FIX-PROTOCOL.md` **v1.2 → v1.3**, with a `New in v1.3` paragraph naming #9/#10/#11 and the
  §9 / §1#8 / Stage-2 annotations.
- `PROTOCOL.md` **1.1 → 1.2**, with a `Changes in v1.2` note for the §9 discharge clause.
- `CLAUDE.md` § Session rules pointer `(v1.2)` → `(v1.3)`.
- `tools/ground-truth` echoes `head -1 docs/FIX-PROTOCOL.md` and parses nothing, so its output line
  now reads v1.3 with no behaviour change. No other file cites either version
  (the copy under `docs/5 Files Build Protocol/` is untracked and out of scope).

## 4 · Builder — and a correction to my own Stage 0

Regen `sh tools/studio-build` → **exit 0, warnings 0**:
`wrote docs/studio/builder.html (HEAD 5773b19, praxis-v3.294, 2026-09-03 19:32 UTC; closed 9/23,
gaps 194, ship 36, map 6; lab 6, milestones 8, risks 6; warnings 0)`.
LF-normalized **658,565 → 659,128 B (+563)**. Worktree CR 147 (generator artifact, unchanged count
from the prior file); committed blob CR **0**.

**LESSONS strip: 30 chips rendered, the three additions present at 28/29/30** — NAME THE REFERENCE
SURFACE · HOIST, NEVER COPY HALF · THE INSTRUMENT SETTLES IT, NOT MORE REASONING.

**CORRECTION.** My Stage 0 predicted "12 → 15" chips. That was wrong in a way worth recording: I
took "per-surface Round-record `lessons:` (0 today)" from the **code comment** at
`tools/studio-build:607` instead of measuring the ledgers. Measured now, six surface ledgers carry
**15** `lessons:` entries (`book-detail` 10 · `about`/`arcs`/`home`/`notebook`/`subtheory-build` 1
each). The CLAUDE.md half is 15 as predicted; the strip is 15 + 15.

**The consequence is live, not cosmetic: the strip is now EXACTLY AT its cap of 30.** No
`+ N more not shown` line renders because the total is 30, not 31 — but the CLAUDE.md seams are
concatenated **after** the surface ledgers and `head -30` truncates the tail, so **the next lesson
added to either source pushes a CLAUDE.md seam off the Builder**, newest-first among the losers.
Raising the cap is a `tools/studio-build` change (a `tools/` file, out of scope for a docs-only
commit) — filed, not absorbed.

This is the DOC = POINTER lesson landing on me at the same session I wrote three others: I trusted a
comment over a measurement, in a report whose whole subject is not doing that.

## 5 · Residual carried

**L4's code half is NOT fixed.** `docs/checkpoints/firstshelf-dupes-census.js:76` still falls back
to the sole key of `state.userBooks` when `getCurrentUser()` yields nothing — the fallback that
bound the Aug-29 census to `VApQUg2…` while the signed-in account was
`5rQp6HQkZZgIoIULLtyY2YHXqWj2`. It is a `.js` file and this round is docs-only. The rule is now in
canon; the script is not yet compliant with it. **The next round that runs the census fixes it
first, or states the uid it bound and the signed-in uid by hand before its numbers are trusted.**
