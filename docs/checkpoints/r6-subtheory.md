# R6 Sub-theory (DEEP) — build checkpoints

Parity source: `docs/studio/mockups/subtheory.html` (rev 1, felt-passed). Recon:
`docs/checkpoints/r6-subtheory-recon.md`. Local commits only, no push; round does NOT
close (Preston's felt pass). Cache bump v3.189→**v3.190** at Stage 7.

Preston's GO rulings: (1) ownership gap = LOW named debt for R9, CARRY not fix, W12
preserved exactly; (2) Finish = mockup wins (workshop + published-Page reopen, none on
draft Page); (3) Stage-6 Yumi recolor = sub-theory surfaces ONLY, notebook R4 teal untouched.

---

## STAGE 1 — Vocabulary (presentation only) ✅

**Mechanism:** UI-string rename only; stored `status` (`'draft'`/`'published'`) unchanged, no
migration (status is separate from the label — recon §3).

**Edits (js/views.js):**
- 9871 Page pill: `'Milestone set' : 'Set as milestone'` → `'Finished' : 'Finish'`.
- 11227 Build pill: `'Published · private' : 'Publish'` → `'Finished' : 'Finish'`.
- 9812-9813 describing comment: "private-milestone publish pill" → "Finish pill" (doc-with-diff).

**Gates:**
- Parse: `cscript tools/parse-check js/views.js` → **PARSE OK**.
- Old strings `Set as milestone|Milestone set|Published · private` → **0**.
- New `'Finished' : 'Finish'` → **2** (both pills).
- Diff = exactly the comment (2 lines) + 2 label lines; the status-write click handlers
  (9874-9883, 11230-11237) and `stPubDone()`/`pubDone()` guards are **byte-identical**.
- Arc-commons/profile "Publish" (`_arcHeadPublishControl`, `_opPublishControl`, etc.) **untouched** —
  decision #5 reserves "Publish" for the commons act.

Commit: (recorded below on commit)
