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

---

## AMENDMENT RULE

New laws enter with a named specimen or they don't enter. Close-out
sessions may propose additions; Preston ratifies; the addition rides the
close-out docs commit. Laws are never reworded by generators (plain-
language law applies to presentation only).
