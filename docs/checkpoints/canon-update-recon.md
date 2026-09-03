CANON UPDATE STARTED

# CANON UPDATE — STAGE 0 PRE-FLIGHT (read-only)

Date 2026-09-03 · Base `5773b19` / v3.294 · HEAD == origin/main · tracked-dirty 0
`sh tools/ground-truth`: hook ARMED (`core.hooksPath = hooks`) · FIX-PROTOCOL v1.2 · 7 agents
Foundations md5 confirmed unchanged: lumen-amber `070679b0…` · marks `772886c0…`
Docs read: CLAUDE.md (45,455 B) · PROTOCOL.md (13,402 B) · docs/FIX-PROTOCOL.md (19,013 B)
Checkpoints read (2026-08-29 → 2026-09-03): covers-diagnosis(+recon) · firstshelf-dupes(+census.js)
· stale-draft(+recon) · title-corruption(+recon) · render-firstshelf(+recon) ·
render-firstshelf-c(+recon) · merge-round(+recon, incl. REVEAL v3.291, v3.292, the #diag
resolution) · undo-independence(+recon).

## 1 · Per-lesson canon census

| # | status | evidence | proposed home |
|---|---|---|---|
| L1 | **PARTIAL** — reactive only | FIX-PROTOCOL §1 (:44) "Mismatch, or code that contradicts the fix's premise → STOP"; §4.4 (:156); repo-mapper "antidote to stale premises" (:42, :300). All three are *notice-if* rules; none makes testing the premise a Stage-0 deliverable. | FIX-PROTOCOL §1 Stage 0, new bullet above "Confirm anchors" (:43) |
| L2 | **ABSENT** | `grep -ci fixture` CLAUDE.md 0 / PROTOCOL.md 0 / FIX-PROTOCOL 0. Nearest cousin PROTOCOL.md:91 (render seeding, not data-shape realism, and in the wave protocol). | CLAUDE.md § Verification |
| L3 | **ABSENT** | no equivalence/skip clause in any of the three. Sibling family: CLAIMING ABSENCE REQUIRES PROOF (CLAUDE.md:229). | CLAUDE.md § Verification, adjacent to :229 |
| L4 | **ABSENT** | `grep -ci uid` = 1 hit, and it is the substring inside "build agent **guid**e" (CLAUDE.md:1). No uid/account rule anywhere. | CLAUDE.md § Verification |
| L5 | **ABSENT** | `grep -n register` → CLAUDE.md:558/560 (Notebook capture registers), PROTOCOL.md:150 (unrelated). Cousin DOC = POINTER (:74) covers doc-vs-code, not a brief's deictic reference. | CLAUDE.md § Lessons |
| L6 | **ABSENT** | `grep -ci hoist` 0/0/0. § Conventions is a terse syntax-floor list with no specimens. | CLAUDE.md § Lessons |
| L7 | **ABSENT** | no ordering-dependency clause in FIX-PROTOCOL §1/§3 or PROTOCOL.md §3. | FIX-PROTOCOL §1 Stage 0, appended to the byte-FLOOR bullet (:56) |
| L8 | **PARTIAL** — the check exists, the build rule does not | CLAUDE.md:539 "Counts must match data … rendered count must equal the stored count" is the CHECK. No rule requires the mutating surface to re-render on return. | CLAUDE.md § Verification, citing :539 rather than restating it |
| L9a | **ALREADY PRESENT — do not re-add** | CLAUDE.md:208–219 verbatim: "THE BAR IS CONDITIONAL — ASK FOR THE LIFT (2026-09-01) … Ask BEFORE the build, not at the HALT." Proven working this week: merge-round-recon:3 "§9 dispatch CONFIRMED"; title-corruption-recon:24; undo-independence §6b ran it. | — |
| L9b | **ABSENT** (stable tree before dispatch) | FIX-PROTOCOL §9 (:269–290) says when the pass fires and how deep, never "after the last edit". | FIX-PROTOCOL §9, one sentence at :271 |
| L10 | **ALREADY PRESENT — do not re-add** | CLAUDE.md:187–202, with the merge-round specimen and the `getBoundingClientRect` + pixels-visible requirement. Applied this week: undo-independence §5 proof 7 cites "CLAUDE.md:187" by name. | — |
| L11 | **ABSENT** (its cousin is a different rule) | CLAUDE.md:532 "UI-driven > function-call … not by invoking functions in the console" governs how the AGENT verifies; it says nothing about how a diagnostic is DELIVERED to Preston. | CLAUDE.md § Verification |
| L12 | **ABSENT** | no judgment-order rule; nearest register is THE FORK RULE (:88) / FORK-VERBATIM (:90). | CLAUDE.md § Lessons |

**Homes, gathered.** FIX-PROTOCOL §1 Stage 0 → L1, L7 · FIX-PROTOCOL §9 → L9b ·
CLAUDE.md § Verification — non-negotiable → L2, L3, L4, L8, L11 ·
CLAUDE.md § Lessons — the seams → L5, L6, L12 · no edit → L9a, L10.

Rationale for the split: § Lessons holds SEAMS with specimens and feeds the Builder (brief-writing
and judgment rules belong there); § Verification holds PROOF-VALIDITY invariants (what makes a
passed check mean anything); FIX-PROTOCOL holds STAGE DEFINITIONS (what the executor must produce
at a named stage). Three readers, three homes — L1 and L7 are stage deliverables, not seams.

**Out of scope, filed:** L4's code half. `docs/checkpoints/firstshelf-dupes-census.js:76` takes the
sole key of `state.userBooks` when `getCurrentUser()` yields nothing — the fallback that bound the
Aug-29 census to `VApQUg2…` while the signed-in account was `5rQp6HQkZZgIoIULLtyY2YHXqWj2`. It is a
`.js` file; this round is docs-only. Named for the next round that runs the census.

## 2 · Retirement pass

**RET-1 · CADENCE LAW (weekend-only builds) — NOT PRESENT. No action.**
Exhaustive search, per CLAIMING ABSENCE REQUIRES PROOF:
`grep -rn "CADENCE LAW\|Cadence Law\|cadence law"` over all `.md`/`.html` → **0**.
`grep -rIl weekend` over the whole tree → **2 files**, both `js/yumi-brain.js:2495` (a Yumi
worked-example body) and its worktree copy — not a rule.
`git log --all -S "CADENCE LAW"` → **0 commits**. `git log --all -S "weekend"` → 1 commit
(`6f5106c`, the Yumi example).
The only "CADENCE" in canon is BUILDER CADENCE (CLAUDE.md:613), which is unrelated and live.
Recorded so the question is not re-opened.

**RET-2 · "agents barred → HALT" as an absolute — REWRITE ×1, ANNOTATE ×3.**
The Sept-1 correction (`72ed8fb`) landed in exactly two files: CLAUDE.md and
`docs/checkpoints/stale-draft-recon.md`. Four live statements still read as unconditional:

| loc | text | proposal |
|---|---|---|
| CLAUDE.md:203–207 | the lead bullet states the absolute framing FIRST — "cannot run. That is a HALT-tier condition" — with the correction as a sub-bullet BELOW it. A reader who stops at the top bullet gets the retracted rule. | **REWRITE** the lead: the bar is conditional; HALT-tier is the consequence of an *unlifted* bar, not of the bar |
| CLAUDE.md:11–13 | "Before answering ANY planning, status, or roadmap question, use the praxis-recon agent" — mandates an agent that is barred by default | **ANNOTATE** with a pointer to :208 (the correction's own text says the lift "covers EVERY gate agent") |
| CLAUDE.md:14–15 | "After any build completes and BEFORE any commit, use the praxis-reviewer agent. Its verdict gates the commit." | **ANNOTATE**, same pointer |
| FIX-PROTOCOL §9:271 and §1#8:57–62 | both mandate a gate agent; neither mentions the bar or the lift, so a §9 reader never learns the lift exists | **ANNOTATE** with a one-line pointer (a pointer is not repetition) |

NOT touched: the four historical checkpoints CLAUDE.md:220–228 already tallies
(`covers-diagnosis.md:112`, `firstshelf-dupes.md:94` and `:535`, `stale-draft.md:338`). They record
what was believed then, and the tally already names them as the cost; rewriting them is rewriting
history.

**RET-3 · NEW — the executor-side live-verify requirement is unsatisfiable from this box.**
PROTOCOL.md §9 (:150) and FIX-PROTOCOL §1 Stage 2 (:82) both require the executor to fetch the
deployed origin and confirm CACHE_VERSION. Re-measured today:
`curl -s -o /dev/null -w %{http_code} https://praxis-reading.netlify.app/sw.js` → **000, exit 56**.
Three rounds this week routed around it in prose instead: covers-diagnosis R1 ("egress … blocked
(curl 000)"), firstshelf-dupes R1, merge-round header ("nothing live-verified (egress blocked from
this box)").
**PROPOSAL: ANNOTATE, not remove.** The requirement stands; it is discharged as a NAMED device pass
the executor authors (the covers "What Preston runs" pattern: hard-refresh, confirm CACHE_VERSION,
the exact click-path, the pass condition), and a round that cannot reach the origin says so in one
line instead of re-deriving it each time. This is a scope call — proposed, not applied silently.

**RET-4 · REAFFIRMED, NOT RETIRED — MOCKUP FIRST (CLAUDE.md:71) and VISUAL GATE (:31).**
The merge round rebuilt a surface with no mockup; its own v3.292 header reads "shipped proven and
unreviewed by eye". Two canon rules that applied and were skipped. That is evidence of a violation,
not of a stale rule. No edit proposed — recorded so the retirement pass does not read their silence
as consent. This is the mechanism behind the question in §4.

**RET-5 · considered, NOT proposed.** FIX-PROTOCOL §5 path A (self-drive) went unused all week, and
§5 path C's interim human-read governed every data-tier round and held. Dormant is not superseded.

## 3 · Builder scope

`tools/studio-build:611–615` reads **only** `## Lessons` from CLAUDE.md:
`awk '/^## Lessons/{f=1;next} /^## /{f=0} f&&/^- [A-Z]/{…} f&&/^  +[^ ]/{continuation}'`,
deduped (`!seen[$0]++`), cap **30** displayed. Current strip = **12** entries; after L5/L6/L12 = **15**.
The § Verification and § Session-rules edits are **invisible to the parser** — precedent: `72ed8fb`
was a § Verification + § MODEL LAW edit and its commit message records the parser output md5-identical
across the change. `grep -c FIX-PROTOCOL tools/studio-build` = 0, so the FIX-PROTOCOL edits are also
invisible. **Regen required** (the Lessons edit); expected content delta = +3 lesson chips only.
Baseline `docs/studio/builder.html` = 658,712 B.
No BOARD.md or sequence.md change: no surface cell moves and no round opens or closes.

## 4 · ONE question — a scope fork, per THE FORK RULE

FIX-PROTOCOL is the doc all of this week's rounds actually ran under. Its Stage 0→1→2 has **no visual
step at all** — no mockup gate, no felt-delta statement, no register or pixels check. CLAUDE.md carries
VISUAL GATE (:31), MOCKUP FIRST (:71) and the FELT-DELTA CLAUSE (:52), and PROTOCOL.md §2 carries the
fidelity manifest — but **nothing in FIX-PROTOCOL points at any of them**. That gap is the shared
mechanism behind L5 (the legacy dark register), v3.291 (a panel mounted 4,408px below the fold), and
v3.292 (a 1.19:1 title on a shipped surface).

**Does FIX-PROTOCOL Stage 1 get a VISUAL GATE clause** — one bullet: a fix that changes what a surface
looks like closes only on a stated felt-delta at 1360/390 and Preston's eyes, per CLAUDE.md § Lessons —
**or is that a 13th lesson outside this round's stated content, to be filed for a later round?**

HALT — awaiting go-ahead for Stage 1.
