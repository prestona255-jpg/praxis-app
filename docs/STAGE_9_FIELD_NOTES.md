# Stage 9.4 — Field Notes

**What this is:** notes from writing one real sub-theory inside Praxis using the
9.2 writing surface. Stage 9.4 is a usage test, not a build. The sub-theory written
was the recognition sub-theory from the May 27 drafts — "You can't desire what you
can't be recognized in" (`#subtheory/subtheory_1780497327729_2989`).

**Where these feed:** Stage 9.5 (sub-theory constellation), Stage 10 (evidence &
citation), Stage 11 (Yumi presence/transparency). A few items are genuinely new and
go to a "round 2 / checklist 2.0" backlog.

**Test date:** 2026-06-03. **Result:** PASS. The surface is usable, data persists,
no blocker found.

---

## The three bins

- **Fix now (blocker):** none.
- **Already scheduled in checklist 1:** the missing browse surface (→ 9.5), the
  arc-membership detour to cite a book (→ 10.1), Yumi-while-writing (→ 11).
- **Backlog / round 2 (not planned anywhere):** book-cover/shelf mismatch, both
  registers rendering at once, "Yumi as a noticing companion in the margin."

---

## What worked

- Header, public body, and intellectual body all accepted real long-form prose and
  survived save → close → reopen-by-id intact. Persistence is solid (`createSubTheory`
  / `updateSubTheory` / `addEvidence` all call `saveState()`).
- Attaching evidence worked end-to-end: a shelf book from the rail, an external source
  via "Add external source", and the attached items showed in the ATTACHED list.
- The global Yumi widget could discuss the sub-theory by its actual header and engage
  with the Miami Northwestern material — so the draft is readable by Yumi's context.
- The 5.6 material language is on the surface: it reads as a designed editorial page
  (Cormorant header, parchment ground, editorial evidence rail), not a wireframe.

---

## Findings

### F1 — No surface lists saved sub-theories  · SCHEDULED → 9.5  *(headline)*
**Symptom:** after writing and saving, there is nowhere to *find* the sub-theory.
`renderArcDetail` never reads `state.subTheories`; the arc page still shows books.
The only way back into a draft is the `#subtheory/<id>` URL.
**Means:** the writing surface produces an artifact that is invisible between sessions
unless you keep the link. This is the lived justification for 9.5 — the constellation
must become the browse surface.

### F2 — Citing a book forces a detour out to the arc  · SCHEDULED → 10.1
**Symptom:** to cite *The Politics of Education* (Freire) it had to be added to the
arc from the shelf first; the rail only lists arc-member books, so a non-member book
isn't citable from the writing surface.
**Means:** the act of citing breaks the writing flow. Stage 10.1's send-to-sub-theory
channel (or a cite-and-add shortcut on the rail) should close this.

### F3 — Yumi is reachable but not *in* the writing  · SCHEDULED → 11
**Symptom:** the global Yumi widget is available and context-aware, but she is a panel
you open, not a presence beside you as you write. The in-surface noticing slot
(`yumiNoticing`) is a stubbed empty array.
**Means:** Stage 11 should define the presence model, not just transparency/consent.
**Sub-item to verify:** Yumi was addressed as "the sub-theory I just uploaded" —
confirm whether she auto-reads the current sub-theory from state or whether it was
fed to her. That answer sizes the `getYumiContext` wiring Stage 11 needs.

### F4 — Autosave fires on blur only  · VERIFY (else → 9.2 polish)
**Symptom:** body fields save via `updateSubTheory` on the field's `blur`, not on a
timer. A long session that never loses focus is exposed to a crash or SW swap.
**Means:** empirically persistence held (reopened intact), so not a blocker. Run the
deliberate test — type a sentence, reload without clicking out. If it survives, close
this. If it doesn't, it becomes a small 9.2 hotfix (interval / `beforeunload` save).

### F5 — Book cover present in arc but not shelf  · BACKLOG / round 2
**Symptom:** the same book's cover showed in the arc but not on the shelf.
**Means:** two display paths populating book metadata differently — an
`ensureBookFields` consistency question. Cosmetic, deferred. Not a 9.4/9.5 concern.

### F6 — Both registers render at once  · BACKLOG / round 2
**Symptom:** PUBLIC and INTELLECTUAL REGISTER showed simultaneously rather than
toggling between them.
**Means:** minor surprise vs. the "toggleable" spec. Cosmetic; revisit in a 9.2 polish
pass. Deliberately not chased during the test.

---

## Data tension surfaced for 9.5 / 10 (record now, decide at 9.5)

The pivot spec's marginalia cloud assumes per-attachment **gathered / incorporated**
state and **prose anchors**. The shipped build has neither: `attachedMarginalia` is
never populated, and `evidence[]` elements are flat (`id, kind, refId, external,
quote, annotation, addedAt`) with no state field and no `proseAnchor`. Incorporation
requires a prose anchor, which is explicitly Stage 10's job.

**Consequence for 9.5:** the constellation can render shapes, luminosity, resonance
edges, Yumi, and **gathered (hollow)** marks from `evidence[]` now — but the
**incorporated (solid + tethered)** state has no data source until Stage 10. This is
a settle-at-9.5 decision, captured here so it isn't rediscovered cold.
