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

## Corner arrangement — OWNER felt call (carried)

The create-door/Shelf-FAB stacking (door above the "+ Add a book" FAB on mobile
Shelf) resolves the overlap but the exact arrangement is Preston's felt call — he may
prefer a different order, a merged control, or a different offset. Flagged for the
felt pass.
