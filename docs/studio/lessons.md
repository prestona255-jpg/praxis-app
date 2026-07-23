# LESSONS — the fault-pattern canon

Status: BINDING. Every CC session reads this file as part of the ground-truth
preamble (Standing Prompt Protocol item 7: CLAUDE.md · FIX-PROTOCOL · the
round's brief · **this file**). These are not style preferences — each law
below was paid for by a real failure in this repo. The specimen is named so
the law can't drift into folklore.

Format: LAW — specimen — rule.

---

## FAULT PATTERNS

**L1 — DELIVERED ≠ LANDED.**
Specimen: the R-SHELF brief v3 lived in chat for four days (July 17–21)
while the repo held v2 at 3f5df8b; the VL-1 gated plan was once recorded
as pushed when it wasn't.
Rule: an artifact is real only when its commit hash is verified on origin.
Completion claims require push proof (fetch → status → expected-commit
list → live check). "Delivered in chat" is a draft, never a state.

**L2 — SELF-REPORT INFLATION.**
Specimen: agent byte estimates run ~2× low; "I did X" narratives have
diverged from the diff more than once.
Rule: no self-report is accepted as evidence. Verification = independent
artifacts: diffs read, grep counts, byte deltas pre-stated then measured,
reviewers using `git show` / scratch clones. Claiming absence requires
proof of absence.

**L3 — PASSING FOR THE WRONG REASON.**
Specimen: RF1 — the retrofit silent-zero at 129-book scale wore the empty
state's clothes; small-scale controls passed because the failure looked
like a valid state.
Rule: checks run at real scale on real data, and every green check must
be demonstrably ABLE to fail (a check that can't fail is decoration).
Distinguish error states from empty states explicitly.

**L4 — WRONG-SURFACE JUDGMENT.**
Specimen: R-SHELF mockup evaluated from desktop screenshots while the
brief names 390 as the acceptance surface and defers desktop composition.
Rule: every brief names its acceptance surface; felt passes and PASS/FAIL
calls run there FIRST. Deferred surfaces get flags, never verdicts.

**L5 — STALE-CACHE FALSE READS.**
Specimen: the service worker serves stale repeatedly; measurements taken
against cached builds.
Rule: cache-bust every measure; live sw.js check ×2 cache-busted after
push; owner felt pass = fresh Incognito on the live URL.

**L6 — COLLISION PROOF AT ONE WIDTH.**
Specimen: R9a text-vs-OBJECT collision shipped because proof ran at one
viewport.
Rule: collision/overlap proofs run at 390 / 1280 / 1920, text-vs-object,
not text-vs-text.

**L7 — COUNTING STRINGS, NOT THINGS.**
Specimen: string-occurrence counts standing in for element counts.
Rule: count ELEMENTS (parsed DOM / AST), not substrings. Fixture parity =
rendered count == fixture count, proven per band/section label.

**L8 — GROUND CHECK SKIPPED.**
Specimen: light-repointed surfaces re-point --ink/--paper while --surface
/ --border stay dark; gold used as text on light grounds.
Rule: ground check FIRST per surface (--page-2 / --line-page / --scrim on
light; --gold-deep for gold-as-text; --gold-hi = orbs/glyphs only).

**L9 — OVERLAPPING OWNERS.**
Specimen: Builder regen collisions before the once-at-close law.
Rule: one regen owner, once, at round close. Model switches only at
session boundaries. Never two writers on one generated artifact.

**L10 — HEADLESS ≠ FELT.**
Specimen: headless CDP doesn't advance transitions; agent verification
mistaken for the felt pass.
Rule: agents verify everything tabulable (rects, counts, parity) headless
on prestonpraxistest first; the owner felt pass at the owner viewport is
reserved and cannot be simulated. prestona255 = read-only, always.

**L11 — THE FIXTURE IS A LIE (real-data substrate). [=G1]**
Specimen: R-SHELF (2026-07-22) — a synthetic 130-book fixture verified count-
scale and passed every gate; felt pass #1 FAILED on Preston's real 129-book /
109-reading library — the uncapped desk rendered 109 covers in one row,
invisible to the fixture.
Rule: a felt-gated visual round verifies on the OWNER'S REAL snapshot, not only a
synthetic fixture — the fixture verifies count-scale, the snapshot verifies
DISTRIBUTION-scale. Load the snapshot rig-only, git-exclude it (`.git/info/
exclude`, verified untracked), delete at close; NEVER quote/excerpt/paraphrase
note contents — counts, ids, lengths only.

**L12 — COMPUTED-STYLE PARITY; AA OVERRIDES. [=G2]**
Specimen: R-SHELF S5 — an accidental `*/` inside a CSS comment (`--gold*/`,
`--card-*/`) closed the block early and DROPPED the --ink re-point rule from the
CSSOM since S1, leaving author text stuck on the dark-ground --muted; and the
mockup's author color (#978b6d) failed WCAG AA at 10.5px. Both invisible until a
computed-style diff on real (long) names.
Rule: for a sampled element set, diff computed font-family / size / weight /
color / text-decoration BUILD vs MOCKUP; any mismatch is a finding. AA (the
ground-check floor) OVERRIDES an exact-color match — record it DEVIATION-BY-AA.
And never write `--token-*/` in a CSS comment: the `*/` closes it and drops the
next rule.

**L13 — PRESERVED BEHAVIOR IS DRESSED, NOT LEFT. [=G3]**
Specimen: R-SHELF's add/edit editor rode a legacy dark slab (--surface-2 flips
dark on the light route) mid-page through felt pass #1.
Rule: every preserved-behavior surface in a rebuild carries a DRESS verdict on
the inventory — canon-styled (evidence) or explicitly flagged to the owner
(naming the owning round). No silent legacy skins.

**L14 — ELEVATE THE BUILD, NOT THE MOCKUP. [=G4]**
Specimen: R-SHELF passed the mockup-stage elevation loop 18/18, then failed the
felt pass on the LIVE build with real data.
Rule: the elevation loop re-scores the LIVE build on the real snapshot (not just
the mockup); Craft or Quiet < 3 triggers an in-ruled-space improvement before the
owner felt pass.

**L15 — STATES INCLUDE THE SKEW. [=G5]**
Specimen: R-SHELF's states were verified on a balanced fixture; the real
library's 85%-reading majority + 13-userTheme dense membership broke the desk and
stressed the lens wall.
Rule: the completeness-inventory STATES row is judged on REAL conditions and adds
distribution-skew cases — a dominant-status majority, dense cross-membership, long
titles.

**L16 — LAWS VERIFY STRUCTURE, NEVER COMPOSITION-AT-REAL-DATA.**
Specimen: THE ARC STANDARD S1 passed every §3 law on computed-style + DOM evidence
(one ground, form-first, threads-gold, no overflow) and shipped a field that
FAILED Preston's eye — the marks sat in the upper band of a 600×500 viewBox far
taller than their spread, stranding a void. Green-gate laws proved the pieces were
right; none of them measured whether the pieces COMPOSED into one screen on real
data at real density.
Rule: a composition round adds a stated final gate — a full-page shot of the
DENSEST REAL arc/surface, at the owner's real width, judged SIDE-BY-SIDE against
the felt-passed mockup. Structural law-passes are necessary, never sufficient; the
composition-at-real-data shot is its own PASS row on the acceptance card, and the
owner's felt pass outranks it (owner-viewport primacy).

**L17 — NEVER HALT THE OWNER MID-VISION ON THE LIVE APP.**
Specimen: THE ARC STANDARD ran S-FELT→S2→S3→S4 as ONE continuous session under a
self-run law — local commit + brief report per slice, no push, no mid-run
question — and interrupted Preston only at the three named gates (Stage-0, the S1
field gate, the final push). A multi-slice vision (field → approach → clearing →
gather → weave → composer) reads as one thing to the owner; halting between its
limbs for a live look fragments the felt read and multiplies stale-SW re-verifies.
Rule: for a multi-slice vision build, run continuously to a COMPLETE, gated, shot
page on the rig (all verification on the honest rig, snapshot requested only at
final verification), then halt ONCE for the push word + the whole-vision felt pass.
A genuine HALT-class finding (byte-lock, brief contradiction, data-loss fork) still
stops the run; a slice being merely done does not.

---

## MECHANICAL TRUTHS (one-liners, still binding)

- EOL truth: tr -cd '\r' on the NORMALLY-STAGED blob, not the worktree file.
- studio-build runs DETACHED, never `&`.
- Path-explicit staging, never -A; never --amend with agents live.
- Source order beats equal specificity; desktop-only rules behind
  @media (min-width: 760px); breakpoint pair = 759/760.
- Strict ES3 in app code: var/function, no const/let/arrow/backticks,
  string concat only.
- Scroll-lock / handler cleanup lives in renderRoute.
- Form fields >=16px font (P7); tap targets >=44px (P3).
- Major surface rewrites tag their base (`git tag pre-<round>`) BEFORE slice 1 —
  one-command rollback (specimen: pre-umber, pre-rshelf).
- Media loads into PRE-SIZED slots — zero CLS; a failed asset renders its
  fallback, never a hole (specimen: R-SHELF covers, 96×144 slots, spine on 404).

---

## AMENDMENT RULE

New laws enter with a named specimen or they don't enter. Close-out
sessions may propose additions; Preston ratifies; the addition rides the
close-out docs commit. Laws are never reworded by generators (plain-
language law applies to presentation only).
