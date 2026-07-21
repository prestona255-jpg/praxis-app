# ACCEPTANCE CARD — protocol + template

Status: BINDING rider on the five-beat engine. Companion to LESSONS.md
(this card exists to mechanize L1 and L4).

## THE RULE

Twice per deep round — (1) at SHAPE-B mockup delivery, (2) at CLOSE —
the executing session generates an acceptance card:

    docs/checkpoints/<round>-acceptance-<mockup|close>.md

Contents: every law sentence from the round's brief, VERBATIM (Law-8
discipline — laws are the acceptance criteria; generators never reword
them), one row each, walked AT THE ACCEPTANCE SURFACE the brief names.
A stage without its card is not done. The card is printed AND committed
(checkpoint-file reporting, protocol item 9).

## ROW STATES

- PASS — with an evidence pointer (rect table, grep count, screenshot
  ref, parity proof). "Looks right" is not evidence (L2).
- FAIL — returns to chat per Law 8. No silent fixes of law breaks.
- DEFERRED — only if the brief itself defers it; name the owning round.
- OWNER — reserved rows (felt-pass judgments) left blank for Preston.
  Agents never fill an OWNER row (L10).

## TEMPLATE

    # <ROUND> acceptance — <stage>
    Surface walked: <e.g. 390, live worktree serve, cache-busted>
    Base commit: <hash>   Date: <date>   Session model: <model>

    | # | Law / dial sentence (verbatim from brief) | State | Evidence |
    |---|-------------------------------------------|-------|----------|

    Flags carried in (from chat evaluation): <list or none>
    Flags carried out (new, non-law): <list or none>

---

# R-SHELF acceptance — mockup (SEED)

⚠ SEED CARD. Law wording below is shorthand from the shaping record —
the generating session MUST replace each row's text with the verbatim
sentence from the committed brief v3 before walking. Statuses below are
from the July 21 desktop-screenshot evaluation only; per L4 the real
walk runs at 390 and supersedes every "sight" entry.

Surface walked: NOT YET — desktop screenshots only (deferred surface)
Base commit: 36b7d45

| # | Law / dial (shorthand — replace verbatim) | State | Evidence |
|---|---|---|---|
| 1 | One illumination grammar; dimming = cover opacity only, cavity ground never changes | pending 390 | rider check owed |
| 2 | Same library, re-shelved (toggle regroups, never a new collection) | pending 390 | count==fixture per band |
| 3 | Evidence-weighted marks (g0–g3 under-glow) | ⚠ FLAG | embers invisible in screenshots — recon 8 risk live |
| 3b | SINGLE COAL: one ember + glow per cover; chips carry the count | ⚠ FLAG | header chips show no counts |
| 4 | Sparse-honest (NOW empty = one --ink-3 line, no furniture) | pending | dual-state toggle present; walk both states |
| 5 | Canon-native (mobile P1–P9) | pending 390 | — |
| 6 | Ground check / ES3 | pending | grep pass owed |
| 7 | Animation containment (wheat: ≥8s, tip-lean, transform/opacity only, reduced-motion still-field) | partial | still-field toggle present; period/props unverified |
| 8 | FELT CANON (law breaks return to chat) | governs card | — |
| 3.1 | CARVED: one inset per cavity, ground only, board two flat tones | ✓ sight | screenshots |
| 3.4 | THE DESK: page-or-lighter, chrome-free, in front of case | ✓ sight | recon-9 tone check owed at 390 |
| Q7 | Strip = 64px at 390, scrolls away, never sticky | pending 390 | desktop looks in breathe-range; MEASURE, don't eyeball |
| — | Focused view = the case opens (one ground grammar) | pending | fixture mandate |
| — | Header at 390 scrolls away; FAB + Bloom only persistent chrome | pending 390 | — |

Flags carried in: (a) band scrollbars un-Apple → DEFERRED to R-POLISH
page-scrollbar item, note only; (b) per-cover status caption × 130
books vs "quiet marks" register → OWNER dial call at 390.
Flags carried out: —

---

# THE ELEVATION LOOP (⚠ TRIAL — ratify or drop at R-SHELF close)

Purpose: the card above checks rule-compliance. This loop pushes the
mockup to get BETTER before the owner felt pass. Runs after the card,
before Preston.

## THE SCORE — six axes, 0–3 each, max 18

| Axis | 0–3 means | Evidence type |
|---|---|---|
| Fidelity | brief laws met (feed from the card) | card rows |
| Craft | spacing/alignment/token discipline, finished feel | rect tables, token grep |
| Motion | animations obey timing + containment laws | prop/period check |
| Quiet | no visual noise or repetition clutter | element counts |
| Responsive | 390 / 1280 / 1920 all behave | 3-width walk |
| Function | interactive mockup bits actually work | toggle/filter/focus test |

## THE LOOP

1. Score all six, honestly, with evidence pointers.
2. One pass = improve the 2–3 lowest axes ONLY.
3. Re-score. Commit with before/after in the subject
   ("elevation pass 1: 11→14").
4. HARD LIMITS: max 3 passes, then it ships to Preston regardless.
   Improvements stay INSIDE ruled space — anything needing a new
   design decision HALTS and returns to chat (agents never invent
   design). Preston's felt pass beats the score; 18/18 he dislikes
   = FAIL.

## R-SHELF TRIAL — provisional seed score
(desktop screenshots only; the session RE-SCORES at 390 before pass 1)

| Axis | Seed | Note |
|---|---|---|
| Fidelity | 2 | two card flags open (embers, chip counts) |
| Craft | 2 | solid carved grammar; scrollbars deferred to R-POLISH |
| Quiet | 1 | status caption ×130 covers — loudest thing on the page |
| Motion | — | unscorable from stills |
| Responsive | — | 390 not yet walked |
| Function | — | toggles present, untested |

Seed: 5/9 scorable. Session re-scores all six at 390, then runs passes.

---

# THE COMPLETENESS INVENTORY (⚠ TRIAL — ratify or drop at R-SHELF close)

Purpose: the card checks ruled things; the loop scores finish. This
inventory checks for HOLES — the unruled space where pieces go missing.
Runs at mockup delivery, BEFORE the elevation loop. Every row must be
answered; a blank row = the stage isn't done.

Row states: SHOWN (evidence pointer) · N/A-OWNED (name the owning
round) · MISSING (= FAIL — fix if ruled space allows, else HALT to
chat).

| # | Anatomy | What "shown" means |
|---|---|---|
| 1 | Ground | the full visual background/landscape present, not placeholder |
| 2 | States | empty · sparse · full/at-scale · error (where applicable) each demonstrated |
| 3 | Controls | every visible control functional in the mockup, or marked static-by-design |
| 4 | Widths | 390 / 1280 / 1920 walked (deferred widths = N/A-OWNED, named) |
| 5 | Motion | every ruled animation present + reduced-motion behavior verified |
| 6 | Marks | all meaning marks/indicators legible on their actual ground |
| 7 | Text | zero placeholder/filler text surviving; registers match canon |
| 8 | Seams | entries/exits to adjacent surfaces shown or explicitly out-of-round |
