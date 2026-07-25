# CD-6 STAGE 3 BUILD — ImportCapture retirement + DOOR-SEG (v3.257)
CD6-IMPORTCAPTURE-BUILD STARTED · HEAD f8ac91e · ship v3.257

## STAGE A — retirement to headless core (in progress)

### Pre-flight predicted deltas (measured on LF blobs, before cutting)
- import-capture.js: 66,681 B / 1444 L -> ~25,336 B / ~521 L  (PRED delta -41,345 B / -923 L)
- components.css:    858,358 B / 16,943 L -> ~841,500 B  (PRED delta ~-16,856 B / -292 L)
- JS delete ranges (orig line#): 263-386 · 397-796 · 869-1020 · 1155-1422 + API rewrite
- CSS delete ranges: 10602-10795 · 10812-10911 (keep book-picker survivor 10796-10811)
- Foundations MD5 baseline: marks 772886c0… · lumen-amber 070679b0… (must stay)

### STAGE A — RESULTS (verified, HALT A)
DELETED (overlay UI + own dictation UI + commitEntries + dead vars/SVGs/helpers):
  bodyKey, commitEntries, renderNotebookIfMounted, closeBtn, close, done, open, renderEntry,
  renderProcessing, runImport, renderReceipt, buildBookRow, buildNoteRow, buildFlip, buildNeedBar,
  ownsEntry, flipRegister, fileToBook, leaveInInbox, openQueue, renderQueue, buildQueueCard,
  undoImport, buildMicHero, buildNoteComposer, buildTypeNoteHero, renderTypeNote, renderListening,
  startDictation, processDictation, renderDictated, fileDictationToBook, undoDictation, renderError,
  + OVERLAY_ID/lastImport/lastDictation/CHECK_SVG/CHEV_SVG/MIC_SVG.
KEPT headless: collectText, parseJSON, coerceSegments, segmentDoc, normTitle, hasSharedToken,
  matchBook, looksLikeQuestion, registerFor, el, candidateBooks, buildBookSearch (book-picker),
  canRecord, pickAudioMimeType, transcribeBlob, recordAndTranscribe. API re-exposed to the keep-list.

VERIFY (all PASS):
- parse gate: PARSE OK exit 0; harness self-check FAILS a broken copy (exit 1).
- deleted symbols: 0 dangling refs in-file (the 2 'commitEntries' hits are explanatory COMMENTS);
  module-private (IIFE) so 0 external callers possible except via ImportCapture.* .
- ImportCapture.* external couplings UNCHANGED: recordAndTranscribe=2, canRecord=1, no others.
- no surviving JS references any deleted .ic-* class (matches are mic-*/dynamic/graphic false-positives).
- ES3 floor clean (no const/let/=>/backtick).
- import-capture.js: 66,681 -> 24,241 B  (numstat 39 add / 981 del; PRED ~25,336 — merged-range
  deletions removed a few more comment lines than the un-merged estimate; explained).
- components.css: 858,358 -> 841,566 B (numstat 3 add / 295 del; PRED ~841,500). Kept ONLY the
  book-picker survivor (.ic-guess/:hover/-au + .ic-book-search*); dropped dead .ic-guesses/.ic-guess.ic-alt.
- .ic-trigger (3, Stage-1 writeline drift) LEFT ALONE — separate named task (REVERT JUDGMENT).
- foundations MD5 unchanged: marks 772886c0… · lumen-amber 070679b0… .
- git status: only M js/import-capture.js + M assets/components.css (+ new docs). No stray tracked files.
NO escape-valve trip: no keep-listed fn touched overlay DOM or removed state.

### STAGE A — AMENDMENT (Option 1 ruled): buildBookSearch RETIRED
- Removed: buildBookSearch (fn + API entry) + el() (its sole remaining consumer) + the module-header
  line naming buildBookSearch. candidateBooks KEPT (feeds capChip in Stage B).
- CSS: removed the book-picker survivor island (.ic-guess/:hover/-au + .ic-book-search* + my header
  comment) AND the 3 dead .ic-trigger selector-lines (Stage-1 remnant) -> components.css has ZERO .ic-.
- PROOF (condition 1): tree-wide grep = 0 for buildBookSearch + ic-overlay/panel/guess/book-search/
  trigger/qcard/needbar/brow/mic/receipt/flip/quoted/filed; components.css grep '\.ic-' = 0; no JS
  creates any ic- class. Braces balanced 4433=4433 (-7 vs backup = exactly the 7 .ic- rules removed;
  ic-trigger selector-lines carry no braces). Live .chip/.nb-tab comma-group siblings intact.
- parse gate PARSE OK exit 0; ImportCapture.* couplings still recordAndTranscribe=2/canRecord=1.
- FINAL byte deltas (condition 2):
    import-capture.js 66,681 -> 22,038 B  (numstat 39 add / 1032 del)   [Stage-0 pred -41,345 kept BBS;
      actual -44,643 because the amendment ALSO retired buildBookSearch+el — explained]
    components.css    858,358 -> 840,354 B (numstat 0 add / 314 del)     [pred -16,856 kept survivor;
      actual -18,004 because the amendment ALSO removed the survivor island + ic-trigger — explained]
- foundations MD5 unchanged: marks 772886c0… · lumen-amber 070679b0… . git status: only the 2 files.
- CARRIED to Stage B: (3) L18 covers chip-picker states incl. picker-open-during-owner-change;
  (4) capChip/capRenderChipPop = HALT-before-touch (door core not this lane's to refactor).

### STAGE B — DOOR-SEG (built + verified on the rig; HALT B)

CAPCHIP FITNESS (condition 4): capRenderChipPop/capSetChip/capSetRegister are door SINGLETONS
(no params, one fixed DOM host, mutate global capTarget/capRegister) → cannot serve N per-note
controls as-is; but NO modification needed → NO HALT. The review builds its own per-note controls
reusing the VISUAL idiom (.capdoor-chip*/.capdoor-seg classes) + READ-ONLY helpers (candidateBooks,
capRegColor, state.books) with local callbacks. Door core untouched (grep: capRenderChipPop/
capSetChip/capSetRegister bodies unchanged).

BUILD (additive, views.js +15,428 B numstat 278/0; components.css split styles +22 lines):
- state: capSplitGen (gen-token) · capSplitState · capSplitUndo · CAP_SPLIT_MINLEN=280.
- capShouldOfferSplit (>=1 blank-line break OR len>=280) · capOfferSplit (segmentDoc, gen+owner-gated) ·
  capRenderSplitReview / capRenderSplitChipPop (idiom reuse) · capAcceptSplit (CA-2) · capUndoSplit (CA-2) ·
  capCancelSplit · capSplitRefreshRoute · capEntryTargetKey · capCaughtRowFor.
- caught-row "Split into notes?" affordance (heuristic-gated, suppressed while a review is open).
- #capSplit host added to buildCaptureDoor; capClose drops a pending review; BLOCK-1 auth handler tears
  down the split surface (splitState/undo null + gen bump + host clear).
- FILE-RAW-FIRST: capCommit UNCHANGED (nothing new pre-commit; <400ms untouched).

L18 WALK — rig (d0tester, seeded books, stubbed segmentDoc; screenshots dead → state/DOM evidence):
- T1 heuristic boundaries: 179→F · 280→T · 279→F · blank-line→T · single-line→F · empty→F. PASS
- T2 file-raw-first: paste blob → capCommit → delta 1, body == full blob verbatim, register marginalia/inbox;
  caught row shows "Split into notes?". PASS
- T3 split→review: phase review, 3 children, head "Split into 3 notes?", each row has seg+chip;
  child0 marginalia/freire (matchBook), child1 question/foucault (?-detect), child2 marginalia/inbox. PASS
- T4 controls: journal pill click → child.register journal; row1 chip pop = [Inbox, Pedagogy] (candidateBooks);
  Inbox pick → child.targetKey inbox; #capSplit .capdoor-seg computes display:flex in SCAN mode (mode-immune). PASS
- T5 ACCEPT (CA-2): 3 children written via captureNote (edits carried: inbox/foucault-question/journal-detached),
  parent deleted ONLY after all verified, undo record set, host hidden. PASS
- T6 UNDO (CA-2): parent re-filed with full raw body FIRST, then 3 children deleted; count→1; undo consumed. PASS
- T7 proxy-down (reject): splitState null, parent intact, count unchanged, toast "Couldn’t split — your note is filed". PASS
- T8a 0-seg / T8b 1-seg: parent intact; toasts "Couldn’t split…" / "That reads as one note — kept as is". PASS
- T9 double-tap: gen bumped once, one review rendered. PASS
- T10 owner-switch DURING segmentation: late result dropped, review never built, 0 entries under new uid. PASS
- T11 owner-switch with review OPEN → Accept refused: toast "Signed in as a different account — split cancelled",
  0 entries under new uid, parent survived (the picker-open-during-owner-change surface, condition 3). PASS
- T_auth: BLOCK-1 handler inspection — clears splitState/undo + bumps gen + clears host. PASS (code-wired;
  can't live-fire firebase state change on the rig — the accept-time + segmentDoc-completion guards are the live protection).
- T12 CA-2 partial-write: 2nd child fails mid-loop → landed child deleted, parent kept, count net-zero,
  toast "Couldn’t split — your note is kept as one". PASS
- REGRESSION: short note commits normally, no split offer. PASS. CONSOLE: clean (0 errors) across the walk.

GATES: parse views.js + import-capture.js PARSE OK · ES3 clean (split block: no const/let/=>/backtick) ·
SOLE WRITER: captureNote is the only LIVE entry writer (import commitEntries deleted Stage A; the 14577
openMarginaliaEditor CREATE branch is DEAD — its only caller always passes editEntryId → UPDATE path; pre-existing
Stage-2 leftover, flagged as drift, NOT this lane) · foundations MD5 unchanged · CACHE_VERSION bump v3.257 rides ship.
DRIFT (separate tasks, not folded): DEAD-VOICEINPUT · openMarginaliaEditor dead CREATE branch (14577).

### AMENDMENTS (Preston, at HALT B acceptance)
- **UNDO parent-first ordering RATIFIED** (amends the prompt's literal "delete children, re-file parent").
  capUndoSplit re-files the parent from the ephemeral snapshot FIRST, verifies it landed, THEN deletes the
  children — content present at every instant (strictly safer than the literal order, which has a window
  where neither parent nor children exist). Built + verified this way (T6). Logged as the ratified order.
- **14577 dead CREATE branch → NAMED-TASK LEDGER** alongside DEAD-VOICEINPUT. `openMarginaliaEditor`'s
  `entryId===null` create branch (views.js:14577) is unreachable (its only caller, views.js:8489, always
  passes `marg.id`); pre-existing Stage-2 leftover. Own dead-code cleanup lane. Not folded here.

### NAMED-TASK LEDGER (drift found, deferred — separate felt-passed lanes)
1. DEAD-VOICEINPUT — voice-input.js loaded (index.html:83) but the transport bypasses it ("no VoiceInput").
2. MARG-CREATE-DEAD — openMarginaliaEditor create branch (views.js:14577), unreachable Stage-2 leftover.

### RED-TEAM GATE — live checks (orchestrator-run; static audit runs in the Sonnet fix-red-team agent)
- 390 GATE (CDP 390x800): offer row within [219,343]; review #capSplit within [15,352], 3 rows no overflow,
  no text clip, chip-pop within [28,255] (no right-overflow), toast within [98,293]. Page: NO h-scroll at any
  state. Accept falls below the fold on a 3-child review (top 1143) BUT is REACHABLE — sheet body scrolls
  (scrollHeight 1029 > clientHeight 551, overflowY auto) → after scroll accept at top 695/bottom 730, within
  viewport, no h-overflow. PASS.
- DESKTOP (1280x860): split within, 3 rows no overflow, chip-pop within, no page h-scroll; accept below fold
  (top 1031) but reachable via body scroll (maxHeight 700, overflowY auto) → after scroll top 674/bottom 709,
  reachable. PASS.
- MODE COVERAGE (L18) — offer surfaces on the caught row + review renders in EVERY mode (measured live, not
  assumed):
    | mode  | caught visible | offer painted (w124xh19) | review renders | register seg visible |
    | note  | yes | yes | yes | yes |
    | voice | yes | yes | yes | yes |  (long dictation >280 chars fires the length heuristic — offer appears)
    | paste | yes | yes | yes | yes |
    | photo | yes | yes | yes | yes |
    | scan  | yes | yes | yes | yes |  (#capSplit-scoped .capdoor-seg override beats the cap-mode-scan hide)
  PASS. Ruling honored (offer allowed on any mode's caught row); tabled per mode.
- FELT OBSERVATION (not a BLOCK — reachable): a 3+-child review pushes the Accept button below the fold at both
  390 and desktop; it is reachable by scrolling the sheet body. A future "focus mode" (hide composer chrome while
  a review is open) would remove the scroll; out of the minimal ruling — flag for Preston's felt pass.

### RED-TEAM GATE — RESULT: CLEAN (fix-red-team, Sonnet, independent)
All 7 targets BLOCK-CLEARED with independently re-derived evidence:
1. STUB-CONTRACT: stub shape == coerceSegments output; reject path == real (door never inspects err); confidence/page
   never read by door, type only forwarded to real registerFor/matchBook → no false door-branch. CLEARED.
2. MID-LOOP KILL / receipt-after-fail: offer-reject writes nothing; accept-partial deletes only landed children,
   parent never deleted in that branch; UI re-rendered consistent; honest toasts. CLEARED.
3. DOUBLE-WRITE (Split/Undo): capSplitState guard + synchronous capRenderCaught removes the button same-tick;
   capSplitGen drops superseded results in BOTH resolve+reject; capSplitUndo consumed once; disjoint entry keys,
   no capCommitBusy collision. CLEARED.
4. OWNER-CHANGE DURING CHILD-WRITE LOOP: captureNote + the loop are fully synchronous (only !user branch; saveState
   sync; maybeDrawOut fire-and-forget) — no yield between entry owner-check and last captureNote → entry check
   suffices. CLEARED.
5. HEURISTIC FALSE-FIRE: NOTE not BLOCK — over-offer is non-destructive (file-raw-first + verified-then-delete +
   snapshot-restore Undo).
6. SOLE-WRITER/ES3/FOUNDATIONS: captureNote sole LIVE writer (14577 dead — caller always passes editEntryId);
   ES3 clean; MD5 re-hashed unchanged. CLEARED.
7. STAGE-A COMPLETENESS: every ImportCapture.* ref is a live kept-API call or mockup HTML; 0 dangling .ic-; load
   order intact. CLEARED.
Also: byte deltas independently re-derived (match), CRLF=0 (no EOL flip), parse harness self-validated.

### RED-TEAM non-blocking findings — DISPOSITION
- N1 (cosmetic) `.capdoor-split-row:first-of-type` never fires (the .capdoor-split-head div is the true first-of-type
  → the first row keeps a harmless hairline under the head). → NAMED TASK CDSEG-NIT1. Ship as-cleared (audit integrity).
- N2 (UX) per-child chip-pop has no click-outside closer (closes on select / re-render only). → NAMED TASK CDSEG-NIT2.
  Ship as-cleared; flagged for Preston's felt pass.
- N3 (methodology) T12's partial-failure was FORCED via an injected captureNote stub — NOT a naturally-reachable
  production path (captureNote fails only on !user; the loop is synchronous). T12 therefore proves the DEFENSIVE
  branch is WELL-FORMED against a hypothetical, NOT that a real production failure mode exists. Documented as such
  (does not invalidate the fix; the cleanup-on-partial-failure branch is sound by static reading).

### NAMED-TASK LEDGER (updated)
1. DEAD-VOICEINPUT · 2. MARG-CREATE-DEAD (views.js:14577) · 3. CDSEG-NIT1 (dead :first-of-type CSS) ·
4. CDSEG-NIT2 (chip-pop click-outside) · 5. SPLIT-FOCUS-MODE (felt option: hide composer chrome during a review
   so Accept needs no scroll — reachable today via sheet scroll).
