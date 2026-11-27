# Praxis: the first beta (read this first)

Written 2026-11-23 at v3.340 (main at fedbc77) from Preston's rulings of that day.
Build order re-ruled 2026-11-25 (main at db457de, v3.341).
Order after R1 re-ruled 2026-11-25 (main at f6fe2c4, v3.342): the book page, then Find a book, then LC2.
Order after R3 re-ruled 2026-11-26 (main at 93fe836, v3.343): LC2 (the sky), then Find a book.
LC2-b ruled 2026-11-26 from the LC2 phone check (main at f6dc239, v3.344): the sky to the top on a phone's Home, then Find a book.
Find a book (R2) built 2026-11-26 on f95eb93 (v3.346); next in the order: the remaining rooms (R4, R5).

This page leads on three things: the first beta's SCOPE, the BUILD ORDER, and the
OPEN BLOCKERS. Where BOARD.md, docs/studio/sequence.md, docs/launch-runway.md,
docs/studio/LAUNCH-STATUS.md or docs/Checklist and Roadmap/BUILD_STATE.md disagree
with it on those three things, this page wins and the other file is corrected in the
same commit. How a build is RUN is unchanged: PROTOCOL.md and docs/FIX-PROTOCOL.md
still govern. Keep this page under 150 lines. Change it only on a Preston ruling,
with the date.

Several chats design Praxis at once. Design happens in parallel; builds enter the
repo ONE AT A TIME, from the table below. A feature joins the first launch only by
getting a row here.

## What the first beta is

- Five to ten readers Preston invites by hand, on the web, at praxisreader.com.
  The App Store is the second launch, after real readers have used the beta.
- A reader can: sign in; find and add books (search, barcode, shelf photo); use the
  Shelf; write, speak and find notes; get lenses and deeper readings from Yumi; write
  an artifact; export; delete the account.
- Anyone can open a demo page with no sign-in.

## Out of the first beta (ruled)

- Arcs, sub-theories, values, the commons, reader and walk pages (23 Nov). Their
  routes land on one #next page.
- File import, lane L2 (23 Nov). A photo and a spoken note stay.
- Galaxy lens colours and the "choose the hand" cards (29 Oct).

## Ready means all four

1. No known way to lose a reader's work: FX-1 complete; fix builds 1b and 2 live.
2. A new reader finishes the audit's seven journeys on an iPhone without help: arrive
   and sign in; add a first book; write and find a note; get lenses; find things
   again; come back the next day, offline and on a second device; settings and leaving.
3. A reader can reach Preston (Tell Preston), and opt-in error counts work.
4. Nothing private is public: the GitHub repo is private and the live site does not
   serve docs/.

Then Preston walks the seven journeys on his phone, and one new reader walks them
cold. Only then is anyone invited.

## Build order

Three lanes: data, rooms, features. The order (ruled 25 Nov 2026, replacing the 23 Nov
"data and room builds alternate"): D1a first; then R1; then the book page (R3), LC2, LC2-b and Find a book (R2), in that order (re-ruled 25 Nov after R1, and 26 Nov after R3: LC2 before Find a book; LC2-b ruled 26 Nov after LC2); then the remaining rooms; then Deeper Yumi; then the data builds D1b, D1c and D2;
the demo page last. Every row finishes before the first invite.

| # | Lane | Build | Size | Status |
|---|---|---|---|---|
| RIG | process | RIG-1, the shared test rig in tools/rig/ | small | pushed fedbc77 |
| P0 | process | This page leads | small | pushed e66c682 |
| PG | gate | Preston's 25-step phone walk of the app as it stands | - | walked 24 Nov: step 5 no (a tap on a text field zooms the page), step 6 no by its screenshot, the rest yes |
| P1 | process | Checks run by a machine on every push: the cscript harnesses and the rig | small | pushed f9c5495 |
| D1a | data | Fix build 1b, part one: offline edits kept across a close (BR-03), the mergeBookDuplicates artifact site and its Undo, what is waiting sent at the load, a size meter on each of the six reader documents (warn past 700 KB of the 1 MiB cap) | data | pushed db457de, live as praxis-v3.341, Checks 33 of 33 |
| R1 | rooms | Home and Search (L4b-3d), with the Search matching fix (every word, any order, accents and case ignored; artifacts, lenses and categories included), an "All books" side (built, switched off until R2 gives it a catalogue; ruled 25 Nov), and no text field under 16 px on phones (the walk's step 5) | small | pushed f6fe2c4, live as praxis-v3.342, Checks green, Preston's phone check passed 25 Nov |
| R3 | rooms | Book page and artifact (L4b-3b); Back returns to where the book was opened from | small | pushed 93fe836, live as praxis-v3.343, Checks 36 of 36, Preston's phone check passed 26 Nov |
| LC2 | rooms | The blue sky and sunset burst (r88, r89, r90), its own build after the book page and before Find a book (ruled 26 Nov 2026); js/hand.js unlocked for it only | small | pushed f6dc239, live as praxis-v3.344, Checks 37 of 37; Preston's phone check 26 Nov: Home good, its brown top strip ruled into LC2-b |
| LC2-b | rooms | The sky to the top on a phone's Home: no gap, the sky under a see-through praxis bar, the status strip the sky's blue while the sky is under it (ruled 26 Nov 2026 from the LC2 phone check; sky only, Home only, phones only) | small | built 26 Nov, v3.345 |
| R2 | rooms | Find a book: a search field replaces the Add a book form (NEW, ruled 23 Nov; after the book page, re-ruled 25 Nov; after LC2 and LC2-b, re-ruled 26 Nov); carries R1's residuals R-1, C-1, C-2 | small | built 26 Nov, v3.346 (picker built: 0.6 passed 7 of 7); closes R-1, R-2, C-1, C-2 |
| R4 | rooms | Notebook and a note (L4b-3c); Undo for a deleted note (BR-13) | small | patch to be cut fresh |
| R5 | rooms | You, Settings, Your data, What Yumi sees, About (L4b-3e, two builds); the lasting not-synced line and the Export words (BR-30) | small | patch to be cut fresh |
| F2 | features | Deeper Yumi, her complexity and character (ruled in 23 Nov; built after the rooms (re-ruled 25 Nov); D2 still lands before any invite) | sized at its pre-flight | in design, its own chat |
| D1b | data | Fix build 1b, part two: the profile and reader-model guards (BR-29) | data | not started |
| D1c | data | Fix build 1b, part three: two devices overwriting each other (BR-04), by a re-read on return to the front and a check of the cloud's copy before each save | data | not started |
| D2 | data | Fix build 2: the Yumi daily limit, docs/ off the live site, updates reaching readers | data | not started |
| F3 | features | ElevenLabs dictation (ruled in 23 Nov; after D2, it adds paid calls per reader) | sized at its pre-flight | in design, its own chat |
| R6 | rooms | Tell Preston | small | not started |
| R7 | rooms | First run, the hide switch for out-of-beta rooms (L5), the sky's motion switch | small | design open |
| F1 | features | The demo page, no sign-in (ruled in 23 Nov; LAST of the builds, after the rooms and Deeper Yumi, so it shows the finished app) | sized at its pre-flight | in design, its own chat |
| G | gate | Preston's walk of the seven journeys; one new reader's walk; invites | - | - |

Rules for the queue:

- A patch is written the day it runs, against that day's main. The 19 Nov room patches
  are reference for look and rulings, not bytes to apply.
- Each room build moves its room onto the type scale (seven sizes: 34, 28, 22, 17, 15,
  13, 11, added to assets/theme.css by the first room build) and the named layers.
  R1 added the scale as --ts-display, --ts-title, --ts-heading, --ts-reading, --ts-body,
  --ts-note and --ts-label.
- A build that touches how the app reads, writes or signs in adds its scenarios to
  tools/rig/scenarios/ and they stay.
- Every push to main is checked by a machine (P1): the Checks workflow on GitHub runs
  tools/checks.ps1. A new harness is added to that script's list; a new rig suite is
  picked up by itself. A red run is fixed before the next build starts.
- The rows of the 22 Nov beta-readiness audit ride with the room they belong to. The
  audit report is held locally and is not pushed.

## Build sizes

docs/FIX-PROTOCOL.md section 0 already says: chain the stages to the commit gate and
stop only at a real fork or a failed proof. Section 5 already has the tiers. From
23 Nov the prompts written in the chats follow them and add no stops of their own.

- SMALL: look, wording, one room; no change to what is saved or synced, to the rules,
  to sign-in, deletion or export. Tier A or B. One stop: the commit gate.
- DATA: anything that touches saving, sync, storage, the rules, sign-in, deletion or
  export. Tier C. Stops after the pre-flight, at the commit gate, and before the push.

In doubt, it is DATA. A small build that finds it must touch data stops and says so.

Ruled 2026-11-24: a data build is handed to Claude Code as a short brief (the hole, the proof, the non-goals, the stops). Claude Code finds the code, writes the fix and proves it; the chat reads the diff and the rig output before the commit.

## Open blockers

- FX-1 is not complete (build 1a, v3.340, closed BR-01 and BR-02; D1a, v3.341, closes BR-03 and the merge's artifact site; BR-04 and BR-29 remain, D1c and D1b).
- Ready-means item 4 is not yet true (23 Nov).
- Sign-in is a Google popup only. That is fine on the web and will not work inside
  the iPhone shell (L7b, after the beta).
- Old links and the rulebook still name praxis-reading.netlify.app, which school
  networks block. Invites and documents use praxisreader.com only.
- The Google Books lookup has a daily quota; read it in the Google Cloud console.
- The ElevenLabs spending cap is not set yet (Preston's).

## Open calls (Preston's, not yet ruled)

- The first run: how many screens, and whether the click-through guides stay or
  become tips.
- Yumi's speaking voice (text to speech): in or out of the first beta.
- Where F3, R6 and R7 sit in the 25 Nov order (not re-ruled; left in their 23 Nov places).

## After the beta

- Storage round: one cloud document per note and per book.
- Native sign-in plus Sign in with Apple; the iPhone shell (L7b); TestFlight.
- Reading text that follows the phone's text-size setting.
- A shared catalogue so a book is looked up once for all readers.

## Waiting list (design reactions held until the beta)

Nothing yet. A reaction goes here unless it breaks one of the seven journeys.
