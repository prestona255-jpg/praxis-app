# R-CAPTURE BRIEF — v2

**Version:** v2 (July 23, 2026) — supersedes v1 (July 18, 5,143 B).
**Commit target:** docs/studio/r-capture-brief.md (replaces v1 in place).
**Status:** PRE-DECISIONS. Everything here is re-ratified at the round open before any code.
**Build model:** Opus 4.8 default effort, Sonnet gates (Model Law v2). Fires at its sequence slot: after the ARC STANDARD build, per the July 23 ## Now.

**Why v2 exists:** v1 was shaped and closed July 18 (CD-1..6). Five days later the
R-SHELF close (July 23) handed this round a seam v1 could not know about — the
desk's carrying-question AUTHORING. v2 restates the CD rulings unchanged for
re-ratification, adds CA-1..3, consolidates the failure-state law, and updates
the Stage-0 recon checklist. Nothing in CD-1..6 is relitigated here.

---

## 1 · MISSION

R-CAPTURE owns THE DOOR: every way a thought or text enters Praxis — type,
dictate, paste, upload, import — the landing, and the <400ms law. The founding
story is Preston texting himself the AI-liberation eruption because no door was
fast enough. The round's job: make capture a single, fast, unlosable gesture —
THE phone gesture — that every future entry point (SCAN, share-target, the Room)
inherits instead of reinventing.

---

## 2 · THE RULED PRE-DECISIONS

### CD-1..6 (ruled July 18, standing — restated for re-ratification)

- **CD-1 · THE DOOR = TWO RULED CORNERS.** "+" create bottom-left · flower
  bottom-right. Amends R-POLISH AMB-1 (r-polish-brief v1.4 carries the
  amendment). Plus a nav entry and ⌘N. *Recon must verify the shipped
  corner state post-R-POLISH — see recon item 2.*
- **CD-2 · THE LANDING = A PRE-RENDERED CAPTURE SHEET.** Bottom sheet at 390,
  card on desktop. Focus lands in one frame; zero network work pre-keystroke.
  TWO sizes: quick text · expanded (voice / import / photo) — the old capture
  window evolves into expanded. The sheet is the ME-1 activation instrument.
- **CD-3 · CONTEXT-SMART, NEVER SILENT.** Book Detail pre-associates; the Room
  honors D4; neutral context → Inbox + the matcher. Association is always a
  visible one-tap chip — the app never files invisibly.
- **CD-4 · TALK-IT-THROUGH = A SEAT ONLY.** The seat sits in the sheet;
  the conversation itself ships with the YG round. Seam stated, not built here.
- **CD-5 · COMMIT-AND-STAY.** Commit clears the field and stays open for the
  next thought. Receipt = the SAVE PULSE: "filed to X · Undo." Close is
  explicit, never automatic.
- **CD-6 · ONE CREATE DOOR, ONE COMPONENT.** Mode set: note (default) · voice ·
  paste/import · photo · Scan/add-book seat. Unifies SC2's FAB; Book Detail's
  Add-marginalia and Notebook's Catch-a-note become the same shared component.

### CA-1..3 (ruled July 23, this session — at rec, no felt test yet)

- **CA-1 · CARRYING-QUESTION AUTHORING = ON THE DESK, INLINE.**
  A question is not a note. It never passes through the capture door and never
  joins the corpus. The reader taps the desk's question line — or, when empty,
  the desk's one --ink-3 line — and edits in place. Clearing is a first-class
  act: "or-nothing" is honored literally (no placeholder text, no modal,
  nothing sulks). Storage = ONE profile-level field, never an entry.
  **The one bridge:** a question-register note gains an overflow forward-act,
  "Carry on the desk" — writes the same single field, replace-with-confirm if
  a question is already carried. Two paths, one field; the authoring home is
  the desk. (F-B honored: promotion is a forward act; un-carrying = clearing,
  not undeleting.)
- **CA-2 · THE FAILURE LAW (consolidated).** No captured TEXT is ever lost:
  the sheet's draft rides the shipped per-tab per-uid persistence hard gate
  (R-ARC S2 machinery — one gate, not a sibling). Voice's loss window = the
  in-progress recording only, bounded and disclosed; the transcript writes
  the instant it exists. Offline = the pending chip. Mid-capture death,
  offline, dictation error — RAW JOINS THE CORPUS holds under every failure
  the build can reach.
- **CA-3 · THE WORKSHOP SEAT = INHERITED, NOT RE-RULED.** The in-Room door
  takes ROOM-3 §6's reserved seat (default: field-header region; the D4 seat
  comment already marks it in code). Final placement = recon evidence, this
  brief does not pre-place it.

---

## 3 · LAWS

- **<400ms LOCAL-FIRST** — engineered AND perf-gate-measured, including with
  any carrying-question or association context present: no new pre-keystroke
  work, ever.
- **RAW JOINS THE CORPUS** — under success and under failure (CA-2).
- **ONE DOOR** — one component everywhere; new entry points seat into it.
- **⌘Enter commits, Enter = newline.** Input debounced.
- **Titleless embers + rename** (inherited, R-ARC F-A).
- **F-B: delete terminal, forward acts only.**
- **Raised-hand Yumi** — the sheet never speaks unbidden; Yumi adds nothing
  the user didn't write; only stops for the ambiguous.
- **Never-asked-never-forbidden.**
- **OB L-1 pairing (stated, not implied):** first-run's first ember is PLAIN
  capture — never basin/create, no Room landing. This is CONSISTENT with
  CD-3: first-run fires from neutral context, so context-smart filing lands
  it Inbox-bound by its own grammar. Recon confirms the door OB opens is
  this door.
- **Universal tokens + ES3** (build-round note; no code in this brief).

---

## 4 · BUILD LANES

1. **LANE 1 — the door + the sheet.** Corners, ⌘N, nav entry, pre-rendered
   sheet both sizes, commit-and-stay + save pulse, context chips, persistence
   gate wiring. **CA-1 rides Lane 1** (desk-side, small, but the desk is
   shipped and stable at v3.243 — treat with G-law care: real-data substrate,
   computed-style parity).
2. **LANE 2 — mode integrations.** Voice (dictation v2 machinery folds in),
   paste/upload, photo/OCR fast-follow (vision-proxy seam per the import
   ledger).
3. **LANE 3 — Android share_target.** STRETCH. iOS limits noted honestly;
   feasibility = recon item, ships only if the recon says yes.
4. **LANE 4 — hardening close-out.** segmentDoc auto-retry-on-5xx ·
   tag_audio_events hardening · live-caption cosmetic (guarded, OFF on iOS,
   Scribe always the filed transcript) · worktree cleanup
   (../praxis-dictation-400, ../praxis-dictation-v2) ·
   **CAPTURE-OWNER beta-gate 1b intake at build open.**

---

## 5 · STAGE-0 RECON CHECKLIST (build round opens here; HALT only on dead anchors)

1. **Entry-point census** — every live way in (FAB? notebook Catch-a-note?
   Book Detail Add-marginalia? in-Room? dictation? paste/upload? import?):
   name each, and state whether One Door currently describes the app or an
   aspiration. Census is the ground truth the unification is measured against.
2. **Corner-state verify** — what R-POLISH actually shipped at the two
   corners vs CD-1's amendment of AMB-1.
3. **Door-seat placement** — ROOM-3 §6 evidence; confirm the D4 seat comment
   and rule final placement from what the field header actually holds.
4. **Carrying-question storage** — where the profile-level field lives;
   whether it requires a schema-version/normalizer touch (see §7 flag);
   desk tap-grammar audit on shipped v3.243 (question-line tap vs the
   "+N more" door and life-ordered strip — no collisions).
5. **Dictation reality** — v2's live quality post-v3.141 book-association
   work; what folds into the sheet's voice mode vs what stays.
6. **share_target feasibility** — Android manifest reality, offline behavior,
   what iOS permits; GO/NO-GO evidence for Lane 3.
7. **OB L-1 door confirm** — the first-run ember path reaches THIS door,
   plain, no Room landing.
8. **Persistence-gate reuse audit** — the sheet's draft keys ride the
   existing per-tab per-uid machinery; confirm no sibling gate gets built.
9. **Perf baseline** — measure the current fastest capture path so the
   <400ms gate has a before-number.

---

## 6 · SEAMS HONORED

- **OB-1/OB-10** — first-run capture-as-offer opens through this door; L-1.
- **The Room** — D4 in-Room capture + the §6 reserved seat (CA-3).
- **SCAN** — camera modes are NOT built here; the mode-set seat (CD-6) is the
  socket, designed so SCAN plugs in without redesigning the sheet.
- **The desk** — carrying-question-or-nothing (R-SHELF D4) + CA-1 authoring.
- **YG** — the Talk-it-through seat (CD-4).
- **FINISH-CHOREO S3** — rides where cheapest; this round doesn't own it and
  must not block its lane.

---

## 7 · NON-GOALS

No camera/scan modes (SCAN owns them — only the socket is ours) · no
onboarding spine changes (consume the OB brief) · no Goodreads mapping ·
no URL unfurling · no new-book creation in the picker · no YG conversation ·
no mockup building in the shaping session · no relitigating CD-1..6 or any
shipped R-ARC/R-SHELF grammar.

---

## 8 · OPEN QUESTIONS + HONEST FLAGS

- **CA-1 schema flag:** the profile-level field may want a schema-version /
  normalizer touch. This brief does NOT pre-rule it — it's a build-open
  decision made against recon item 4's evidence, disclosed before the lane
  fires. If it requires touching the locked migrate/normalizer path, HALT
  for Preston's word.
- **The promote act ("Carry on the desk")** is ruled at rec with no felt
  test. If it feels like a second door in practice, the fallback is
  desk-only authoring — the field and the inline editor survive unchanged.
- **CD-2's two-size sheet** was ruled without a felt test at 390 (v1 flag,
  still true).
- **Lane 3** ships only on recon's GO.

---

## 9 · RISKIEST AMBIGUITY

**CA-1's tap grammar on the shipped desk.** v3.243's desk already has live
interaction (the "+N more" door, life-ordered covers, focused-view entry).
Tap-to-edit on the question line must coexist without stealing or shadowing
any shipped gesture — and it has never been felt. Recon item 4 carries the
audit; the felt pass carries the verdict.

---

## HANDOFF NOTE

Pre-decisions: CD-1..6 standing from July 18, CA-1..3 new from July 23 —
one door in two corners, a pre-rendered two-size sheet with modes, context-
smart never-silent filing, commit-and-stay with the save pulse, and the
carrying question authored inline on the desk with one forward-act bridge.
Before the build fires: this brief's commit, re-ratification at the round
open, the ARC STANDARD build clearing the lane, and Stage-0 recon (nine
items, census first). Riskiest ambiguity: CA-1's tap grammar on the shipped
v3.243 desk — unfelt interaction on stable shipped ground; recon audits it,
the felt pass rules it.
