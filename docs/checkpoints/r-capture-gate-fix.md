# R-CAPTURE — gate-fix (reviewer + red-team residuals)

Both gates ran (Sonnet, Model Law v2) on the complete door (base `c3e319a`, HEAD
`6ab91b2`). Reviewer = HOLD (1 BLOCK + 1 NOTE); red-team = NOT CLEAR (2 BLOCK · 3
HOLD · 4 NOTE). Everything else PASS/CLEAR (byte-locks, SCHEMA unchanged, 3-site
sync, ES3, EOL, covenant isolation, CD/CA fidelity, scope-honesty, the DWF-1 sweep).
This commit resolves every actionable finding. Files: `js/views.js`,
`assets/components.css` (+ doc corrections). Parse PASS; no console errors.

## Fixed (code)

| # | Finding | Fix | Live evidence |
|---|---|---|---|
| **Reviewer BLOCK** | `.cap-create-door` (z:9999) overlaps the shipped Shelf `.shelf-add-primary` FAB (z:90) at mobile, stealing its clicks | On `#books`, `capUpdateCreateDoorPos()` adds `.cap-on-shelf` → the door stacks 62px up, ABOVE the FAB (route-toggled on hashchange, which fires before renderRoute) | 390 #books: door top716/bottom758, FAB top776/bottom820 — **18px gap, noOverlap; class removed off-Shelf, door back at corner** |
| **Red-team BLOCK 1** | stale `capOwnerUid` never re-verified → cross-account content leak (A's text filed as B) | `capSaveDraftNow` + `capCommit` re-verify `getCurrentUser().uid === capOwnerUid` (mirrors `nbDraftFlush`); an `onAuthStateChanged` listener clears+closes the door on a uid change | switch A→B: **no draft written under B; commit refuses to file A's text, resets + toast, field cleared** |
| **Red-team BLOCK 2** | orphaned `transcribeBlob` callback appends a stale transcript after mode-change/close | `capMicSeq` token — every mic callback drops itself if superseded; bumped on setMode/close/new-session | abandoned recording's late `onResult` **dropped**; a fresh one still applies |
| **Red-team HOLD 2** | `noNav` still mutated `notebookActiveTab` (re-points the Notebook's tab) | gated the `notebookActiveTab` reassignment under `!noNav` too | code-evident (assignment now inside `if (!noNav)`) + parse |
| **Red-team HOLD 3** | stale `capTarget` files to a book deleted mid-session | `capCommit` re-validates the book against live `state.books`, falls back to Inbox + updates the chip | deleted book → **filed to Inbox (filed:false), chip + toast say "Inbox"** |
| **Red-team NOTE 1** | bridge carried an uncapped question (desk input caps 140) | `slice(0,140)` on the carried body | code + parse |
| **Red-team NOTE 2** | `localId` count+len hash could collide after undo/refile | key the caught list on the real unique entry id | two same-length commits → Undo removes the **correct** (newest) row |
| **Red-team NOTE 3** | share query `split('=')` truncated values containing `=` | split on the FIRST `=` (`indexOf`) | code + parse (happy-path share landing already verified) |
| **Reviewer NOTE** | Lane-1 checkpoint said index.html +264 B (working-tree CRLF); committed blob is +261 B (LF) | checkpoint corrected | — |

## Accepted (documented, not code — flagged for the felt pass)

- **Red-team HOLD 1** — same-account two-tab last-write-wins on the fixed `'capture'`
  draft key. This IS the ruled CA-2 design ("one thought, re-targetable, ONE gate");
  a per-browser-tab key would break the cross-tab/cross-session draft CONTINUITY
  that is the whole point of the fixed key. Same failure class the app already has
  for any shared draft key; same-account only (no cross-account leak). Accepted as
  the CA-2 tradeoff; Preston may rule otherwise at the felt pass.
- **Red-team NOTE 4** — no `migrate()` SCHEMA_VERSION backfill for `carryingQuestion`
  (unlike `statement`). Follows the `answeringLine` precedent instead: every read
  site is `typeof`-guarded (`views.js` renderDeskQuestion + bridge, `integrations.js`
  merge) and `ensureUser` + the Firestore merge both default it, so an absent field
  reads safely. The `statement` migrate step was belt-and-suspenders; not required here.

## Gate-fix round 2 — BLOCK 1 residual (red-team re-check found it STILL-OPEN)

The focused re-check (on `d6964e9`) confirmed BLOCK 2 + HOLD 2/3 + NOTE 1/2/3 +
the corner CLOSED, but caught that **BLOCK 1 was not fully closed**: the auth-listener
reset only touched the field/sheet/mic, leaving three side doors —
- the **Undo toast + `capLastFiled`**: A commits (toast up to 6.5s) → B signs in →
  listener clears the field but not the toast; B clicks Undo → A's text repopulates →
  B commits → filed as B. Now: the listener hides the toast, clears `capToastTimer`,
  and nulls `capLastFiled` on a real→real switch (and the toast is `pointer-events:none`
  + `capUndo` early-returns on null `capLastFiled` — double-safe).
- the **`capCaught` list**: never reset, so B saw A's caught note bodies. Now: cleared +
  `capRenderCaught()` on a real→real switch, and `capOpen` re-renders it as a backstop.
- **1b — signed-out→signed-in silent draft WIPE** (a real usability bug I introduced):
  the old listener wiped a signed-out user's typed draft the instant they signed in to
  save it. Now: a `prevUid === null` (signed-out → signed-in) transition **ADOPTS** the
  on-screen text (it's the just-authenticated person's own words) and persists it under
  the new owner — never wipes. Only a **real→real** account change resets.

Fix in `js/views.js` (auth-listener rewrite + `capOpen` caught backstop). Parse PASS;
caught-list survives close/reopen (verified); no console errors. The real→real /
null→real branches are confirmed by a third focused re-check (the listener needs a live
Firebase auth event the rig can't stub) — carried to Preston's signed-in live-smoke too.

## Gate-fix round 3 — the last pending-timer path (re-check #3)

Re-check #3 confirmed the three round-2 side doors CLOSED (Undo toast, capCaught,
adopt-on-signin — with the adopt-save correctly guarded by `capTrim(f0.value)` so an
empty boot field never triggers a clearing write), but found ONE more silent-loss path
in the same listener: a **stale `capDraftTimer`**. If A is mid-type (300ms debounce
pending) when B signs in, the reset clears the field + reassigns `capOwnerUid=B`, then
the stale timer fires → `capSaveDraftNow` passes its guard (both read B) → saves the
empty field under B's `'capture'` key → `nbDraftSave` empty-body → `sv(k,null)` wipes
B's pre-existing draft. (Predates the rewrite; in the mechanism this round touched.)

Fix (`js/views.js`): cancel `capDraftTimer` at the top of the reset (covers both
branches; the adopt branch persists explicitly). Also fixed the NOTE: the stale
`capSaveDraftNow` doc comment. Parse PASS. The `capDraftTimer` BLOCK confirmed CLOSED by
re-check #4 — but my round-3 "timer audit" over-claimed exhaustiveness (see round 4).

## Gate-fix round 4 — the FileReader async path (re-check #4)

Re-check #4 confirmed the `capDraftTimer` BLOCK CLOSED, but caught that my round-3
audit only covered TIMERS and missed a fifth, non-timer pending-async data path: the
paste/import **`FileReader.onload`** callback. If A clicks Upload and the file read
spans an account switch to B, the stale `onload` writes A's file content into the
field (over B's live typing) and schedules a fresh (non-stale) `capDraftTimer` that
then persists it under B's `'capture'` key — a cross-account content leak, not just the
wipe round 3 closed. Re-check #4 grep-confirmed this is the COMPLETE async inventory:
4 timers (`capToastTimer` + `capDraftTimer` cleared on switch; 0ms focus + 1800ms
tooltip cosmetic) + the mic transcribe callback (`capMicSeq`-guarded) + this FileReader.

Fix (`js/views.js`): capture `ownerAtRead = capOwnerUid` at file-select; `onload`
drops on ANY owner change (exact-match). A first pass dropped only real→real, but that
left a real→null→real variant reachable (sign-out re-seeds the field via the late
onload, then a sign-in adopts A's file as B) — so the rule is conservative exact-match:
a rare signed-out-upload-then-sign-in drops the file (re-uploadable), never leaks it.
This closes the last uncovered path in the grep-confirmed inventory — the door's
account-switch async surface is now complete (timers cleared · mic seq-guarded ·
FileReader exact-owner-guarded). Parse PASS; same-owner upload still applies (verified).

## Corner arrangement — OWNER felt call (carried)

The create-door/Shelf-FAB stacking (door above the "+ Add a book" FAB on mobile
Shelf) resolves the overlap but the exact arrangement is Preston's felt call — he may
prefer a different order, a merged control, or a different offset. Flagged for the
felt pass.
