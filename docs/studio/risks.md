---
name: risks
title: Risk register
kind: studio-source
updated: 2026-07-12
---

<!-- FORMAT — hand-edit this file freely; the Builder's Risk register (a section on the
     Plan page) is a generated view of it (tools/studio-build). Each risk is ONE BLOCK
     under "## Risks":

       - id: <stable handle, e.g. FX-1>
         title: <short name>
         status: parked | hard-dependency | carried
         trigger: <the condition that RE-RAISES it — what makes it jump>
         note: <one or two sentences of context>

     status vocabulary
       - parked          deliberately not being worked; sleeps until its trigger fires
       - hard-dependency not parked — a named prerequisite that gates other work
       - carried         a known residual carried forward, waiting for its sweep/round

     This register is DISTINCT from the overnight queue (overnight.md): the queue holds
     runnable fixes; this holds standing risks and their re-raise triggers.

     RULES the parser follows (soft-fail law — a bad line is skipped with a warning
     into the regen report, never aborts):
       - a block STARTS at "- id:"; it ENDS at a blank line or the next "- id:".
       - inside a block only title:/status:/trigger:/note: are recognized; any other
         non-blank line is SKIPPED with a warning.
       - an unknown status still renders, flagged, as parked.
       - a block with no id: is skipped with a warning.
-->

# Risk register

Standing risks and parked work, each with the **trigger that re-raises it**. Not the
overnight queue — these do not run unattended; they wait for a named condition. Sourced
from `sequence.md` (Re-plan log, Then, Standing rules) at authoring time; hand-edited
after.

## Risks

- id: FX-1
  title: Data-loss fix round
  status: hard-dependency
  trigger: jumps immediately on any data-loss scare — and a named prerequisite of R11 / first-beta-tester: no outside account is EVER invited before FX-1 ships
  note: F-DL1 sync guards on all 5 unguarded collections, F-DL2 flush, F-PX1 proxy cap. No longer a soft park — converted to a HARD DEPENDENCY (Preston, 2026-07-12). Interim guardrail (until it ships): after signing in on any device, let the app settle before editing.

- id: BUILD3-CI
  title: Build 3/4 data-loss CI automation
  status: parked
  trigger: the Windows box gains node/python, or CI capacity appears to host the automated smoke rig (it cannot run locally today)
  note: The automated data-loss smoke rig (Stage 0 design-lock done). Stays parked — none of the current program needs it; the fix-protocol agents cover code-changing work without it.

- id: task_3c933f62
  title: Universal-depth spreads
  status: carried
  trigger: the S-C sweep (dead selectors / depth-spread cleanup)
  note: A parked universal-depth spread task, carried since the depth-law adoption. Folds into S-C.

- id: task_e4cb7af7
  title: Reveal-animation a11y
  status: carried
  trigger: the S-C sweep (a11y pass)
  note: A parked reveal-animation accessibility task. Folds into S-C alongside the AA opacity and empty-state work.

- id: R-b
  title: R-b parked item
  status: carried
  trigger: the S-C sweep
  note: A parked item named in the S-C sweep line of sequence.md, carried with the other S-C debt.

- id: MW3-BKBOX
  title: Book-detail desktop content-box h-scroll
  status: carried
  trigger: its own felt-gate — the Book-detail desktop pass (the Desktop Wave stretch)
  note: The base .bk-surface content-box also h-scrolls at desktop width — out of the mobile wave's scope, carried from MW-3 as a named desktop residual.
