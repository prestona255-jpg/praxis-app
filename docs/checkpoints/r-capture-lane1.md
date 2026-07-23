# R-CAPTURE — Lane 1 checkpoint (the door + sheet + CA-1)

Spec: docs/studio/mockups/capture.html (felt PASS 2026-07-23). Self-run law:
local commits per slice, no push, no mid-run halt. sw.js bump + Builder regen
deferred to the final push point.

## Slice A — the note+paste door  ✅ COMPLETE (committed local)

Built: the pre-rendered capture sheet (CD-2) as ONE body-mounted component,
summonable over any route via the "+" create corner (bottom-left, mirroring the
flower), the nav `Capture` entry, ⌘N, and `views.openCaptureDoor({targetKey,mode})`.
Note + paste modes fully wired; voice mode = Lane 2; photo/scan = inert seats (§7).

Files: `assets/components.css` (+19,003 B — the `.capdoor-*` / `.cap-create-door` /
`.cap-nav-entry` / `.desk-question` block, all existing tokens, `.mo-savepulse`
reused), `js/views.js` (+22,669 B — `captureNote` gains a backward-compatible
`noNav` param + the door module), `index.html` (+264 B — nav entry), `js/app.js`
(+332 B — boot mount hook).

Mechanical gates: **parse-check PASS** (cscript, views.js + app.js); byte deltas
measured (above); grep capdoor=102 css / 46 views, cap-nav-entry=1; only the 4
intended tracked files dirty.

Live-verify (localhost rig, SW-cleared, signed-out + stubbed `captest` uid; DOM
+ computed-style, pane can't composite pixels — felt pass is Preston's):

| Check | Evidence |
|---|---|
| Mounts at boot, no console errors | createDoor/scrim/sheet/toast/navEntry all present; console clean |
| Focus-in-one-frame (CD-2) | click `+` → sheet is-open, `document.activeElement.id==='capField'` |
| Context chip = real state (CD-3) | 6 options = Inbox + 5 local books; never-silent, one-tap |
| Book pre-association (CD-3) | `openCaptureDoor({targetKey})` + `#book/<id>` route → chip shows that book |
| Mode switch (CD-6) | voice → `cap-expanded cap-mode-voice`, mic hero visible; back to note clean |
| Commit-and-stay (CD-5) | inbox: entry filed=false; book: filed=true + bookIds=[id]; field cleared, **sheet stays open**, caught +1, toast "Filed to X · Undo" |
| Undo | entry deleted from state.notebookEntries, field restored, caught → 0 |
| Signed-out guard (RAW-not-lost) | commit → "Sign in to keep your notes", field preserved, Undo hidden |
| Persistence (CA-2) | draft stored `praxis_nb_draft_captest_capture` on close, restored on reopen (shipped nbDraft gate, no sibling) |
| Scrim-click = CD-5 explicit-close | scrim click keeps sheet open (nudge); Esc + X close |
| 390 composition (L16) | 0 h-overflow; sheet fixed full-width bottom-anchored, 16px radius, 54vh; hero 16px in-view; create-door bottom-left |
| 1360 composition | 0 h-overflow; card at + origin; both corners |

Scope note (carried, not silent): the NEW door coexists with the legacy bespoke
doors. Fully collapsing the census's 4 doors into it (re-pointing Book-Detail
Add-marginalia's contenteditable+images editor, Notebook's inline writeline,
ImportCapture's segmentation) would REGRESS capability if done naively — that
migration is a documented FOLLOW-ON, not this slice. The door is the socket; the
new summons (corner/⌘N/nav + book pre-association) are live. Flagged for the
final felt pass.

## Slice B — CA-1 desk (carrying-question authoring)  ✅ COMPLETE

Storage = ONE profile field `carryingQuestion` (never an entry), additive across
the SAME 3 sync sites as `statement`/`answeringLine` — NO SCHEMA_VERSION bump:
`ensureUser` literals + guard (`js/state.js`), `loadProfileFromFirestore` merge +
`saveProfileToFirestore` `.set()` (`js/integrations.js`). Desk row is its OWN block
above `#shelf-desk-row` (`renderShelfDesk` shell + `renderDeskQuestion`), leaving the
tight `.desk-head` flex untouched.

Parse PASS (views/state/integrations). Live-verify (1360 + 390, stubbed `captest`):
empty = "Tap to carry a question." (`--ink-3`, no furniture); tap → input; author →
`profile.carryingQuestion` set + `is-authored` upright serif; clear → `''` + back to
prompt (F-B: un-carrying = clearing). Needs an account (question = a profile fact).
390 composition: authored line within width, 0 h-overflow. No console errors.

## Slice C — CA-1 bridge ("Carry on the desk")  ✅ COMPLETE

A question-register note gains a FORWARD act in the notebook-entry overflow
(`renderNotebookEntry`): writes the ONE profile field, replace-with-confirm if a
question is already carried; direct otherwise. Register-gated (present ONLY on
question notes — verified count=1 vs a marginalia note's 0). Reuses
`deskWriteCarryingQuestion` + the `.desk-carry-confirm` CSS + the door's toast.

Parse PASS. Live-verify: act present on question / absent on marginalia; direct
carry writes the field; second carry → replace-confirm → Replace updates it. No
console errors.

Lane 1 remaining: voice mode = Lane 2 (import-capture dictation fold-in).
