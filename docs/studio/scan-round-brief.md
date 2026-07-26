# SCAN ROUND — PRE-DECISIONS BRIEF v2.1
**Source:** Fable 5 vision session July 17 + delta sessions July 23 · **Commit target:** `docs/studio/scan-round-brief.md` (docs-only; supersedes v1 wholesale)
**Status:** All forks RULED (tappable, all at rec): SC1–SC12, SCA1–SCA3, SCD-1–SCD-3, SCE-1–SCE-3. Re-ratify at the round open.
**Model pin (Model Law v2):** shaping = Fable, BANKED here. The build runs **Opus 4.8 at default effort**; gate agents run Sonnet. No further Fable required unless a felt pass fails into re-design.

---

## MISSION

Build the unified Scan surface at Oasis quality: a full-bleed camera that identifies any book (barcode, cover, or whole shelf), gives light locally-derived context, and adds to the Shelf in one tap — with the Shelf mode honestly wearing its ASSISTED-DRAFT tier. De-risking is complete (shelf-vision.js, scan-derisk.html harness, scan-mockup.html all live). This brief carries the surface design; the build round executes it at its master-sequence slot **after R-CAPTURE** (whose create door is now Scan's front door — see SCD-1).

**Inherited locks (July 12–13, not relitigable):** all three capabilities v1 staged (Barcode nearly done via v3.120 zxing / Shelf = killer bulk feature / Photo rides Shelf vision); purpose = identify ANY book + light Yumi/values context + one-tap Add; post-scan = result card over the still-warm camera, rapid-scan continues; placement = first-class nav entry; Shelf mode = assisted-draft on **claude-opus-4-8** (sonnet insufficient), review-by-exception UX load-bearing.

---

## RULED FORKS

**SC1 · SURFACE SHAPE = COMPOSITE.** Oasis chrome (full-bleed viewfinder, corner-bracket reticle, torch where available, slim floating mode control) + a light live TRAY along the bottom edge that fills as identifications land + MIRROR-SHELF review grammar + auto-fire barcode. Rejected pures: Verdict Scanner, Acquisitions Bench, Mirror-Shelf-hero, Pocket Loupe.

**SC2 → SUPERSEDED BY SCD-1.** *(Original ruling — nav + a SCAN-owned FAB sheet — is void.)* **SCD-1 (July 23, ratified):** R-CAPTURE's CD-6 ONE CREATE DOOR absorbed the FAB unification — *Scan/add-book* is one mode of the shared create component. **SCAN builds no door.** It builds the surface the create door's Scan mode opens into, plus the first-class nav entry (that lock stands — nav owns the destination act). New mandate falling out: the create sheet lives under R-CAPTURE's <400ms law but a camera needs warm-up — the Scan-mode tap gets a **designed warm-up transition** (viewfinder fades in from the sheet; never a white flash pretending to be instant; measure real warm-up in recon).

**SC3 · MODE CONTROL = TWO SEGMENTS: Book · Shelf.** Book = continuous barcode auto-detect PLUS a shutter for cover shots (one act, two sensors). Shelf = deliberate shutter only. All three locked capabilities ship; Barcode+Photo collapse into one segment.

**SC4 · QUICK CARD = IDENTIFICATION + ADD, CONTEXT ONLY WHEN FREE AND REAL.** Cover, title, author, Add — always. One context line ONLY when locally derivable at zero cost: *already on your shelf* (Add→Open), *author already on your shelf*, *values/lens adjacency from existing marks*. Silent otherwise. No LLM call on the quick card. Yumi enrichment one tap deeper. Card text follows the shipped control canon — **no underlined-link captions** (the non-apple core, per the R-SHELF felt-fail and R-POLISH L5 removal).

**SC5 · BATCH LANDING.** Confident books shelve immediately on "Shelve N" (real adds; normal classification behind them). Exceptions NEVER auto-commit — they persist as a scan draft with a quiet badge on the Scan nav entry. Leaving mid-review loses nothing. The unshelved pile stays reserved for real-but-uncategorized books.

**SC6 · EXCEPTION THRESHOLD = COMPOUND, GB-ANCHORED.** Exception if: Google Books no-match OR low model confidence OR poor legibility. Model self-report never the sole gate; GB corroboration is the independent anchor. Duplicates auto-skip with a receipt note. Correction sheet shows the evidence — **"I read: '<raw spineText>'"** — plus top GB candidates, search picker, *Not a book / skip*. Zero endpoint change.

**SC7 · PERMISSION & ABSENCE — DESIGNED, NOT FALLBACK.** (a) Designed pre-permission primer BEFORE the OS ask; never cold-fire the native prompt. (b) Denied = a designed card AND a working add door: inline ISBN + library/GB search. (c) Desktop = honest secondary: Book mode → ISBN/search; Shelf mode → a DROP ZONE (same pipeline, tray, review). No fake viewfinder. Desktop honors the shipped **XL-tier canon** (≥1600 designed at 1920).

**SC8 · FAILURE GRAMMAR = FOUR DISTINCT FELT STATES** (RF1 lineage): **CALL-FAILED** — "nothing was used," free retry. **EMPTY** — coaching card (closer / light / one row). **TRUNCATED** — partial results are REAL: keep the tray, "I read part of this shelf and stopped," primary action = reshoot the rest. **REFUSED** — its own quiet state, never laundered into EMPTY. The harness is the reference.

**SC9 · COST POSTURE.** Deliberate shutter for every paid shelf shot; auto-fire ONLY for free local barcode. Soft client daily counter (number set at build, informed by SC12). When capped: honest, warm refusal — Book mode and search stay alive. **NEVER silent-degrade to sonnet.** F-PX1 Stage-1 caps stand as backstop; the daily-ceiling server build remains the named deferred item.

**SC10 · PIPELINING = QUEUE DEPTH 1.** One read in flight + one more shot composable; a third press waits. Shimmer = indeterminate progress; covers-drop = staged reveal of one arrived payload.

**SC11 · FELT SIGNATURE = EXACTLY THREE MANDATED PHYSICAL MOMENTS.** (1) Lock-on snap. (2) The shimmer read. (3) The shelve flight. Each with a reduced-motion still-state. Nothing else — three signatures, not confetti.

**SC12 · PRE-BUILD CALIBRATION PASS.** Re-run the real shelf photos through the live harness, simulate the SC6 compound threshold, produce the ACTUAL exception rate + the numeric confidence cut before build code. This is the scan-round instance of the REAL-DATA SUBSTRATE law.

**SCA1 · EXCEPTION WALKER.** Sequential fix-next flow through leaning spines; *skip all remaining* always one tap. The mirror-shelf stays the overview; the walker is the working surface.

**SCA2 · BATCH UNDO — amended by SCD-2.** The "Shelved N" receipt carries one-tap whole-batch Undo (insurance vs GB-corroborating-the-WRONG-book; deleteBook scrub = canonical reference, batch form over createdIds). **SCD-2 (July 23):** FX-1 shipped the add-guard alone; delete-symmetry = FX-1c named debt, and Finding C says delete doesn't clear a pending add — batch Undo is a burst of deletes over just-fired adds, the highest-probability trigger of that exact race. Ruling: **Undo holds until the batch's adds have flushed** — visible immediately, briefly "finishing sync…" if needed, then armed. FX-1c stays on the beta-gate track, NOT a SCAN prerequisite. Recon verifies add-guard behavior under batch burst.

**SCA3 · TRAY DEDUPE.** Every incoming identification checked client-side against tray AND library (normalized title/author, existing matcher idiom) before dropping in; duplicates absorb silently with a tick. Required by keep-partial reshoots and overlapping shots.

**SCD-3 · MIRROR-SHELF DIALECT (July 23).** R-SHELF is shipped and finished — the review inherits the REAL grammar directly: carved cavity, flat two-tone boards, uniform 2:3 covers, books in scanned order. A **quiet draft-case variant**: no wheat, no embers, no desk, no ceremony — a working case, visibly draft. (Supersedes v1's "lightweight drawn line now, inherit later.")

**SCE-1 · CAMERA LIFECYCLE (July 23).** SCAN owns stream teardown: getUserMedia stops on route exit (the renderRoute-cleanup idiom is its home) AND on visibilitychange — backgrounding releases the camera, returning re-warms it. Verified on the felt card by the hardware indicator itself: the light dies the instant you leave. THE CAMERA FORGETS, extended to the hardware layer.

**SCE-2 · TRAY DURABILITY (July 23).** The whole unreviewed tray persists device-locally (same non-schema idiom as the soft counter) — a killed PWA resumes the batch exactly where it stood. Paid opus work survives a phone call and iOS's app-killing.

**SCE-3 · KNOWN-OFFLINE STATE (July 23).** Opening the surface without a connection gets a designed offline card — never a shot into an inevitable CALL-FAILED. (zxing decodes barcodes offline; only lookups need network — the offline ISBN-capture queue is an open question defaulting NO.)

---

## LAWS

1. **TWO TRUST POSTURES, ONE CAMERA.** Barcode verdicts are confident; shelf results are claims. Upright cover vs leaning gray spine carries the difference — never copy alone, never apology.
2. **THE CAMERA FORGETS.** Images transient end-to-end — never persisted client- or server-side — and the hardware camera releases on route exit and backgrounding (SCE-1); the indicator light is the proof. A verified invariant, not copy.
3. **THE QUICK CARD IS FREE.** Zero LLM calls on the verdict card; context locally derived; silence over filler.
4. **EXCEPTIONS NEVER AUTO-COMMIT.** Maybe-books never enter the library; drafts persist safely.
5. **FAILURE WEARS ITS OWN CLOTHES.** Four distinct felt states; truncation ≠ empty ≠ failed ≠ refused.
6. **THE SHUTTER IS THE BUDGET.** Deliberate capture for paid calls; auto-fire only for free local decode; queue-1; never silent-degrade the model.
7. **RAISED-HAND YUMI.** Card context is ambient; she doesn't speak here. Enrichment = one deliberate tap deeper.
8. **CANON-NATIVE.** Strict ES3, Universal v1.2 tokens, mobile canon P1–P9, 759/760, control canon (no underlined captions), XL tier on desktop, mobile-first with desktop honest secondary, reduced-motion variants for all three signatures. Accessibility: results announced; walker fully operable without the viewfinder.

---

## BUILD DISCIPLINE (new in v2 — the machinery that matured since July 17)

- **Standing prompt protocol items 1–10** govern every CC prompt (ground-truth preamble + model pin · Stage-0 anchor verification · checkpoint files · conditional gates · self-running · live-smoke push gating · evidence rules · token economy · Builder regen once at close · cache bump once at ship).
- **Reading list** (protocol item 7): CLAUDE.md · FIX-PROTOCOL · this brief · **LESSONS.md**.
- **REAL-DATA SUBSTRATE law (G1):** verification runs against Preston's REAL library snapshot, not synthetic fixtures — the R-SHELF desk exploded at 129 books/109 "reading" while a 5-book fixture passed. Privacy pins ride with it: never quote marginalia/notes in reports or committed checkpoints — counts and ids only; snapshot never tracked, deleted after.
- **G2–G5 canon:** computed-style parity gate (not geometry-only) · preserved-behavior dress is owned, not assumed · a build-stage elevation pass exists · States include skew cases (e.g., a shelf shot returning 40 books; an all-exceptions batch).
- **Acceptance card** at SHAPE-B mockup delivery + at close (brief law sentences verbatim as PASS/FAIL/DEFERRED/OWNER rows) · **8-row completeness inventory** (Ground/States/Controls/Widths/Motion/Marks/Text-registers/Seams) before the **elevation loop** — both PERMANENT per the R-SHELF close (July 23), with G1–G5 standing as lessons L11–L15.
- **Test-automation directive:** behavioral checks run headless on prestonpraxistest first; escalations = one message of numbered steps; human-reserved gates = push words + owner felt passes only.

---

## STAGE-0 RECON CHECKLIST (build round opens here; HALT after report)

1. **Ground state — FIRST.** SCAN lands after R-CAPTURE's build: verify HEAD (version, route table, renderRoute cleanup idiom, nav render fn), the ARC STANDARD build's landed state, and that no other lane owns views.js.
2. **The create-door hook.** Locate CD-6's shared create component and its *Scan/add-book* mode — the integration point SCAN plugs into. Confirm the mode's tap→surface handoff, where the warm-up transition mounts, and the renderRoute-cleanup + visibilitychange mount points for SCE-1 teardown. Measure real camera warm-up time.
3. **SC12 calibration pass** (may run as its own pre-stage): real shelf photos → live harness → simulated SC6 threshold → actual exception rate + numeric confidence cut.
4. **v3.120 barcode frame acquisition** — live getUserMedia vs photo-input; verify on iOS standalone PWA with a real device. The instant-on viewfinder premise rests on this.
5. **Safe-area / env().** Full-bleed camera is the most safe-area-exposed surface in the app; the rig resolves env()=0 regardless, so this is a felt-card item verified in BOTH the installed PWA and a plain Safari tab (B-M lesson).
6. **Nav census at 390** — count entries INCLUDING R-CAPTURE's nav entry; rule the Scan slot; confirm badge capability for the draft count.
7. **zxing reuse** — lazy-load path; continuous auto-detect support for Book mode.
8. **shelf-vision.js contract re-verify** — spineText/confidence/legibility + stop_reason guard; harness failure states as the SC8 reference.
9. **Add/classify pipeline census** — the ONE shared add path (GB backfill, CLASSIFY, cover fetch); adversarial gate: no new book-write surface. **Verify the FX-1 add-guard's behavior under a 27-book batch burst**, and FX-1c's current status (Finding C exposure) for the SCD-2 hold logic.
10. **Matcher idiom** — normalized title/author matching extractable for SCA3 without signature changes.
11. **Batch undo mechanics** — deleteBook scrub over createdIds; receipt window; the sync-flush signal SCD-2's hold listens to.
12. **Torch probe** — Android ImageCapture; confirm iOS absence; wire EMPTY-state lighting coaching as the iOS substitute.
13. **Soft-counter + tray-persistence storage** — Praxis's non-schema device-local idiom serves both (SCE-2); confirm resume-on-relaunch mechanics and the offline-detection hook for SCE-3's card.
14. **Signed-out gate** — buildSignedOutPrompt idiom on the Scan route (scan = billable authed context).

---

## SEAMS

- **R-CAPTURE (the front door):** CD-6's create component owns entry; SCAN owns the surface. The warm-up transition is SCAN's; the sheet and its <400ms law are R-CAPTURE's. Photo capture-mode (marginalia photos) and Scan photo-mode (book covers) are different acts through the same door — no shared pipeline confusion. And CD-3's context-smart pre-association does **not** apply to the Scan mode: scanning from Book Detail never pre-associates the scanned book with the viewed book — scan adds are always context-free.
- **R-SHELF (shipped):** the mirror-shelf review speaks the live carved-cavity grammar as a quiet draft-case variant (SCD-3). F8's door question is closed by CD-6. Order-by-life governs the real Shelf; the draft case shows scanned order.
- **FX-1:** add-guard live; FX-1c delete tombstones = beta-gate debt; SCD-2's hold is the SCAN-side mitigation, not a replacement.
- **F-PX1:** Stage-1 caps stand; shelf-vision carries its own allow-list; signed-out = gated in place; Stage-2 JWT remains the beta-gate item.
- **Classification:** SC5's classify-behind uses the existing CLASSIFY pipeline unchanged.
- **Onboarding round:** the first successful scan's receipt links to the book on the Shelf — the hook is left; the teaching beat belongs to Onboarding.
- **Import-capture:** photo/OCR fast-follow superseded — Photo rides shelf-vision as a one-book shelf; scan review (the walker) is deliberately not the notes-review room.

---

## NON-GOALS

No endpoint changes. No accuracy relitigation. No door/create-sheet work (R-CAPTURE's). No import-capture redesign. No schema/migration touches. No FX-1c build (beta-gate track). No sound. No nav-shell redesign beyond the single Scan entry. No daily-ceiling server build. Nothing built in the vision chats.

---

## OPEN QUESTIONS (in-round, at mockup/build)

1. Tray height vs camera real estate at 390.
2. The soft-counter number (SC12 informs).
3. The numeric confidence threshold (SC12 produces).
4. Framing-guide copy final wording.
5. Which nav slot Scan takes; what compresses at 390 with capture's entry present.
6. Book-mode results: single card only, or tray also collects? (Lean: card-only; rule at mockup.)
7. Badge grammar: count vs dot.
8. Spine-order provenance — default NO; only if zero schema touch.
9. Shelf-mode orientation stance: portrait-only with the framing guide, vs landscape support (mockup decides).
10. Offline ISBN-capture queue — default NO (SCE-3).

---

## HONEST FLAGS

- **Every fork decided at Claude's recommendation** across both sessions. Preston's felt pass at the mockup is the counter-test — the brief authorizes revision there.
- **Riskiest ambiguity: iOS standalone live camera** (recon item 4 gates the composite's felt core). Second: the create-door hook's real shape — CD-6 is ruled but its build lands between now and SCAN's slot; recon item 2 verifies reality, not the brief's assumption.
- **Torch asymmetry:** Android button, iOS coaching. Designed, stated.
- **Wrong-book risk never reaches zero** at the assisted tier — SCA2 is insurance, not cure; SC12 measures how much insurance is being bought.
- **The SCD-2 hold** trades a beat of Undo latency for data safety; if the flush signal proves unreliable in recon, escalate to chat rather than shipping an Undo that can race.
- **Opus latency** read "fine" in de-risk; re-verify under queue-1 rhythm.

---

## HANDOFF

Twenty-one forks ruled at rec (SC1–12, SCA1–3, SCD-1–3, SCE-1–3): a composite surface entered through R-CAPTURE's create door and its own nav slot — Book·Shelf control with auto-fire barcode, live tray, mirror-shelf review in the shipped carved-cavity dialect with an exception walker, sync-safe batch undo, tray dedupe, four-state failure grammar, designed absence and offline states, hardware-honest camera lifecycle, a death-proof tray, and a cost posture where the shutter is the budget and the model never degrades. **Build prerequisites, in order:** commit this v2 docs-only → R-CAPTURE's build lands (sequence: FINISH-CHOREO → R-SHELF ✓ → R-CAPTURE → SCAN) → SC12 calibration → Stage-0 recon (ground state + create-door hook first) and HALT on report — under Opus 4.8, the standing protocol, and the G1–G5 canon. **Riskiest ambiguities:** iOS standalone live-camera capability, and the as-built shape of the create-door hook SCAN must plug into.
