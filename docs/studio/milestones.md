---
name: milestones
title: Milestones
kind: studio-source
updated: 2026-07-12
---

<!-- FORMAT — hand-edit this file freely; the Builder's Milestones strip (top of the
     Plan page) is a generated view of it (tools/studio-build). Each milestone is ONE
     PIPE-DELIMITED LINE under "## Milestones":

       - <date> | <kind> | <label> | <note>

     where
       - <date>  = YYYY-MM-DD  (a real calendar date) OR  —  (no date yet)
       - <kind>  = HARD | TARGET | RETIRED
                     HARD    a fixed, real date (past landmark or a locked future gate)
                     TARGET  an aim, not a promise (may carry — for "no date yet")
                     RETIRED a date that was dropped; renders struck, never counts down
       - <label> = short name
       - <note>  = one clause of context

     RULES the parser follows (soft-fail law — a bad line is skipped with a warning
     into the regen report, never aborts):
       - a line must have exactly 4 pipe-separated fields; otherwise it is SKIPPED
         with a warning.
       - an unknown <kind> still renders, flagged, as TARGET.
       - days-remaining (computed live in the Builder) renders ONLY for a real future
         HARD/TARGET date; a past date shows "shipped/passed", a — shows "—",
         a RETIRED row shows struck. This is the DESIGNED honest state — Praxis is on
         no hard clock (the July-15 launch date is retired), so "—" is correct, not a
         placeholder awaiting a number.
-->

# Milestones

The program's dated landmarks. Praxis runs on **no hard clock** — the old July-15
launch date is retired (see `sequence.md` Standing rules), so the forward view is an
honest **flexible launch, no date set**. Past landmarks are HARD facts; the launch row
counts down only once a real HARD target exists.

## Milestones

- 2026-07-08 | HARD | Studio installed | the docs/studio scaffold + the generated Builder landed; no app files touched
- 2026-07-09 | HARD | Master sequence landed | the locked continuous program replaced ad-hoc round-by-round re-planning (R4 close-out)
- 2026-07-11 | HARD | Mobile wave complete | MW-1 / MW-2 / MW-3 shipped — 8 surface chips ruled mobile-native
- 2026-07-12 | HARD | R9a Profile / Galaxy shipped | merged Profile at #profile + the project's first >=1200 desktop composition tier (v3.198)
- 2026-07-15 | RETIRED | Original launch target | struck — replaced by a flexible launch on no hard clock
- — | TARGET | Launch | flexible — no hard date; days-remaining renders "—" until a real HARD target is set
