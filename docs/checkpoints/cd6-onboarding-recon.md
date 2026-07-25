# CD-6 STAGE 4 — onboarding act-margin socket — S4-0 RECON

STARTED. HEAD `ce277e7` · CACHE_VERSION `praxis-v3.258` · target v3.259.
Verdict: **ABORT-REPORT at S4-0** (recon abort-gate), no build. Fork surfaced for Preston.

## 1 · Named-brief absence (proven, not asserted — LESSONS L2)

The prompt names `docs/studio/onboarding-brief.md` ("v2, 12 OB pre-decisions").
**It does not exist on any branch or in git history.**
- `git log --all --name-only -- '*onboarding-brief*'` → empty.
- `onboarding-module-lane` branch has no onboarding docs under `docs/studio`.
- The only landed governance is **OB L-1** (a single pre-decision in
  `docs/studio/r-capture-brief.md` §3 + recon-item 7 in §5) and the R-CAPTURE
  Stage-0 recon's **§7 flag**. There is no 12-item OB pre-decision list anywhere.
Per LESSONS L1 (DELIVERED ≠ LANDED): an unlanded brief is a draft, not a state —
I cannot build against it. r-capture-brief §7 NON-GOAL: "no onboarding spine
changes (consume the OB brief)"; the OB brief was never landed.

## 2 · Anchors (all confirmed against source)

- `buildActMargin()` — js/intros.js:263-277. Renders the **"Act two · the margin"**
  beat: an `.ij-sim is-bright` "the real surface" teaching frame ("[book] · margins")
  + a `.ij-regs` Marginalia/Journal toggle + `<textarea id="ij-noteta">` +
  `.ij-keepnote` button; after keep, an inline `.ij-notecard` preview.
- Write path: `#ij-keepnote` handler (intros.js:462-466) → `picked.note = v` +
  `doNote(picked.register, v)` (intros.js:332-338) → **`captureNote(realReg, body,
  activeKey, [])`** (intros.js:337). `activeKey = picked.bookId || 'inbox'` →
  book-scoped to the Act-1 book.
- **`captureNote` is defined ONCE** — js/views.js:3072. It IS the shared sole-writer.
  buildActMargin already routes through it. **There is no bespoke write path to unify.**
- Single caller: the beat dispatch in `renderStep()` (intros.js:379). It is a
  narrative beat, **not a summonable door** — no nav entry, no ⌘N, no `openCaptureDoor`.
- The beat is woven into the journey: `picked.note`/`picked.register` drive the
  inline notecard (intros.js:269-270), **Act 3's** "1 note · the one you just kept"
  (intros.js:291), Yumi's dock commentary (`dockActMargin`, :278-285), and the
  Continue button text (:419). The whole 8-beat journey is a felt-passed full-screen
  overlay (`window.Intros.startJourney()`).

## 3 · The shared door's contract (what the "socket" can actually accept)

- `capOpen(opts)` (views.js:23083) reads **only** `opts.targetKey`, `opts.mode`,
  `opts.register`. That is the entire opts contract.
- `capCommit()` (views.js:23316) → `captureNote(...)` then `capFinishCommit` —
  **commit-and-stay**: clears the field, shows the save-pulse toast, keeps the
  sheet OPEN. Close is explicit (X / drag-down). **No completion callback, no
  one-shot mode, no host-embed mode.** Door singleton law: affordance-opens-overlay,
  **never embed**.

## 4 · Why S4-0 aborts (both abort conditions met)

To "retire buildActMargin into the shared door" there are only two shapes, and
each trips the gate:

**(A) Make the beat OPEN the door overlay (affordance-opens-overlay).** Opens a
bottom-sheet/corner-card door **on top of** the full-screen journey overlay; the
door stays open on commit (no "done → advance" affordance) and writes via
`captureNote` **without** setting `picked.note`/`picked.register`. To keep the
narrative working (notecard preview, Act-3 reference, dock, Continue) I would have
to **add a new door completion callback** (beyond the `register`-additive contract,
against the singleton law) AND **re-choreograph the beat**. That is NEW onboarding
surface design + a door-core behavior change, with **no mockup** (MOCKUP-FIRST law)
and no felt pass on a never-seen overlay-over-overlay composition.

**(B) Keep the beat UI, route the write "through the door."** The write is
**already** `captureNote` (the sole writer). This is a **no-op** — it retires no
door.

Neither path is "wiring the door to receive the onboarding capture moment without
building onboarding UI." The recon that opened R-CAPTURE already said this
(r-capture-recon §7): buildActMargin "shar[es] only the storage accessor with the
rest of the app, **not a 'door' in any component sense**," and flagged it as a
**FORK for Preston** — "either OB L-1 is describing a future state the onboarding
journey must be rebuilt toward, or the 'neutral/plain' framing needs to be dropped."

**Abort conditions (prompt S4-0):**
1. **Brief demands NEW surface design** — YES (path A re-choreographs a felt-passed beat + adds door-core behavior).
2. **Contradicts a shipped ruling / requires a held one** — YES. The only ruled basis for pointing the onboarding ember at "THIS door" is **OB L-1**, which the prompt **holds as future-state** and which the R-CAPTURE recon flagged as **already CONTRADICTED** by live code (book-scoped, not neutral). r-capture-brief §7 makes onboarding-spine changes a **NON-GOAL**.

## 5 · The fork for Preston (proposal — no code this session)

- **Opt 1 (recommended) — RE-SCOPE CD-6 to close.** Formally rule that
  buildActMargin is **not a CD-6 door**: it already routes through the sole-writer
  `captureNote`; its UI is an onboarding teaching beat, not a capture component.
  CD-6's door-set = the 3 real doors already retired (writeline v3.254 · book-marg
  v3.255 · ImportCapture v3.257). Mark the onboarding act-margin "already on the
  shared write primitive; UI unification deferred to the ONBOARDING round under
  OB L-1." **R-CAPTURE / CD-6 can then close.** No code.
- **Opt 2 — DEFER, keep CD-6 open.** Park buildActMargin explicitly as an OB-L-1
  item for the ONBOARDING round (already in the sequence tail). No code now.
- **Opt 3 (NOT recommended) — REBUILD the beat to open the real door.** Requires:
  the OB brief authored + landed, OB L-1 ruled LIVE (not held), a mockup of the
  re-choreographed beat, a new door completion/one-shot opt, and a felt pass. A
  mini onboarding round, not a socket wiring — contradicts §7 and this prompt's
  own non-goals.

## 6 · Consequence for the session

Part 1 does not ship. The prompt sequences Part 2 **after Part 1 ships**
("Part 1 fully shipped before Part 2 begins") and an S4-0 abort is a genuine FORK
(Preston's re-scope call). Per the FORK RULE I HALT and surface — I do **not**
autonomously begin Part 2 (F2 note-detail repaint, a felt-required full-surface
round). Preston rules the fork and says whether to proceed to Part 2.

Byte-locks untouched (read-only recon). Nothing staged, nothing committed.
