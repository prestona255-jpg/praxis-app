# Praxis consent copy — the sheet L3 builds against (25 Oct 2026)

Copy is a contract. Words for surfaces already drawn are verbatim from v16.4 and Day Three; items marked (proposed) are new here. Flags are additive only (thirteenth r14).

## The one yes — “What leaves your phone”
- Where: The first walk, beat 4, between sign-in and the book doors (#begin). Offered again on What Yumi Sees for anyone who said Not now.
- Default: Nothing on. The yes turns Yumi on.
- Flags: `profile.yumiYes` — NEW · "" | "granted" | "not-now", with yumiYesAt; `profile.yumiReaderModel` — exists · true on the yes; `profile.yumiReadsAlong` — exists · false for NEW accounts (state.js:1419/1444/1449 default-true changes); true on the yes; Preston’s own account keeps its value
- The words:
  - Kicker: Before you bring your books
  - Title: What leaves your phone.
  - Lead: Yumi thinks with Claude, an AI made by Anthropic. Three things go there to be read. Anthropic doesn’t train its AI on them.
  - Row 1: A photo of your shelf — Read once to find the titles. Praxis doesn’t save it, and Anthropic deletes it within 30 days.
  - Row 2: Your titles — Sorted into categories, and with your yes, read by Yumi so she can offer lenses and remember what you’re reading.
  - Row 3: What you say to her — Notes you mark visible. Never the Journal. Dictation asks on its own the first time, because your voice goes to a different company, ElevenLabs.
  - Button: Yes, bring my books
  - Under it: You can read the full list any time on What Yumi Sees.
  - Hatch: Not now — add books by name only
- What changes: Granted: the scan doors open; the category sorter runs; lens offers can be made; Yumi’s Bloom and dock appear; reads-along turns on. Not now: books by title search only (Google Books, no AI); shelves stay Uncategorized, by name; no Bloom, no dock, no offers; the ledger re-asks.
- Why it is true: Anthropic does not train on API inputs by default and deletes them within 30 days (verified 17 Oct, privacy.claude.com). Shelf and cover photos do go to Claude; barcode scans do not.
- Source: v16.4 walk, thirteenth sitting r1, r3, r5, r10; twelfth r4

## What Yumi sees — the yes, changeable
- Where: A page under You; the head of Yumi’s panel; a dimmed scan door; Home’s dock before the yes.
- Default: Shows the current answer.
- Flags: `profile.yumiYes` — the switch writes it; `profile.yumiReaderModel / yumiReadsAlong` — follow the switch
- The words:
  - Title: Everything she sees right now.
  - Under it: Nothing else. You can change any of it here.
  - The switch: The yes — Your shelf, read for lenses and sorting; your visible notes; her memory of you.
  - Turning it off: She stops reading and offering. Your kept lenses stay yours. Nothing new is sorted.
  - Shelf row: 148 titles, authors and genre tags. Never what’s inside a book.
  - Notes row: 19 marginalia and questions, three most recent in full. The 4 Journal entries never appear here. — SUPERSEDED 25 Oct: see "Added 25 Oct", item 6.
  - Let-go words: Words kept from lenses you let go · Let her forget this (Undo) — OMITTED until L4: see "Added 25 Oct", item 6.
  - Portrait: Her portrait of you · Correct this · End it
- What changes: Off withdraws the yes: no lens call leaves the phone (the gate in aiProxyRequest, lens contract §4.7); kept lenses stay; lensWords and the portrait stay until the reader forgets or ends them.
- Why it is true: Every row lists what is actually sent. The Journal is structurally excluded (notes with register j are never in the visible set).
- Source: Day Three · lens-contract.md §3–4

## Yumi reads along
- Where: Settings under You (moves there from the Notebook’s master switch, buildNotebookMasterSwitch views.js:2908).
- Default: OFF for new accounts; ON after the yes.
- Flags: `profile.yumiReadsAlong` — exists
- The words:
  - Row: Yumi reads along — Marginalia and questions, never the Journal.
- What changes: Off: she answers only from the book or lens she is pinned to and from what you type; your notes stop reaching her. The Bloom stays.
- Why it is true: True today once the default flips: the visible set is marginalia + questions only.
- Source: Day Three Settings; twelfth r20

## Outside angles
- Where: Settings.
- Default: OFF.
- Flags: `profile.yumiWebGrounding` — exists
- The words:
  - Row: Outside angles — One angle from beyond your books, now and then. Yumi searches the web for it.
  - In her panel, each time: From the web, once · Found just now · your outside-angles switch is on · Only the book and the question went out. Nothing from your notes. (25 Oct, F-H2)
- What changes: On: considerWebAngle may run; the panel marks every angle as from the web.
- Why it is true: Confirm in L3 that the web search request carries no reader text — only the query Yumi composes. If it carries note text, the line “nothing about you was sent” must change.
- Source: Day Three Yumi “an angle”

## Dictation’s first ask
- Where: Inside the capture door, the first tap on Voice. Once; remembered.
- Default: Asks; nothing recorded until OK.
- Flags: `profile.dictationAsked` — NEW · "" | "ok" | "declined", with dictationAskedAt
- The words:
  - Title: Before your voice goes out.
  - Body: Dictation sends your voice to ElevenLabs to turn it into words. ElevenLabs keeps recordings under its own policy; Praxis keeps only the words. You can type instead.
  - Buttons: OK, dictate · Type instead
  - While listening: Listening… · TAP WHEN YOU’RE DONE · HEARD BY ELEVENLABS
- What changes: OK: the mic starts; the sheet is not shown again. Type instead: the door switches to Note; the ask returns next time Voice is tapped.
- Why it is true: ElevenLabs retains speech-to-text audio by default; zero retention is enterprise-only (verified 17 Oct). “Keeps recordings under its own policy” is the honest line until Preston chooses the iPhone’s own recognition after the L7 device test (r10).
- Source: Day Three; thirteenth r5, r10

## Microphone or camera refused by iPhone
- Where: The same sheet (Voice) or Add a book / Scan, when iOS has the permission off.
- Default: —
- Flags: none
- The words:
  - Mic card: The microphone is off for Praxis. — iPhone Settings turned it off, so dictation waits. Typing still works, and so does paste. · Open Settings
  - Camera card: The camera is off for Praxis. — iPhone Settings turned it off, so scanning waits. Adding by name still works. · Open Settings
- What changes: The quiet card; one action that helps; nothing dimmed without a word.
- Why it is true: States the cause (iOS, not Praxis) and what still works.
- Source: Day Three; ruling 35

## Read aloud
- Where: The speaker in Yumi’s input row; Settings → Voice.
- Default: OFF (profile.voiceOn).
- Flags: `profile.voiceOn` — exists; `profile.readAloudAsked` — NEW · false; set true on the first OK (ruled 25 Oct)
- The words:
  - First-use sheet (ruled): Her words go to ElevenLabs to be spoken, including any of your notes she quotes. · Read aloud · Not now
  - Not now: The speaker stays quiet; the ask returns next time it is tapped.
  - Settings row: Voice — Dictation (ElevenLabs) and read-aloud. Each asks the first time.
- What changes: On: Yumi’s lines are synthesised by ElevenLabs. Her lines can quote the reader’s own notes, so reader text does leave the phone this way.
- Why it is true: Ruled 25 Oct: read-aloud asks once, like dictation, so the Settings row “each asks the first time” is true. Same shape as the dictation sheet; one tap, once.
- Source: Day Three Settings; handoff item 6

## “Yumi may read this” — per Artifact
- Where: On the Artifact page and on the Book page’s artifact card.
- Default: OFF for every artifact, including existing ones.
- Flags: `artifact.yumiMayRead` — NEW per artifact · false; yumi-brain.js:329–352 stops sending artifacts unless true
- The words:
  - Switch: Yumi may read this
  - Off, under it: Off until you turn it on. Today it never reaches her.
  - On, under it: She can bring it into what she says.
  - Book-page card, no artifact yet: What this book is doing in your thinking, in your own words. Yours to edit any time; Yumi reads it only when you say so.
  - On What Yumi Sees: Artifacts — None. Your artifact for <book> is switched off. / 1 artifact, <book>. You turned it on.
- What changes: On: the artifact joins Yumi’s visible set and is listed on What Yumi Sees. Off: it is never sent, which makes the card’s old promise true.
- Why it is true: Today artifacts reach Yumi with no choice (§N). The switch fixes the broken promise; the default is off so nothing changes for an existing reader without a tap.
- Source: Day Three; §N (17 Oct)

## Send error counts
- Where: Settings; the covenant’s fifth term in About.
- Default: OFF.
- Flags: `profile.sendErrorCounts` — NEW · false
- The words:
  - Row: Send error counts — Only how many things broke and whether the app opened. Off by default; nothing else leaves the phone.
  - Toast on turning on: Only counts leave the phone. Says so in About.
  - About, term 5: We count, we never watch. Praxis keeps a few numbers on your phone to understand itself. Nothing leaves unless you turn on Send error counts in Settings, and then only how many things broke and whether the app opened.
- What changes: On: measure.js may post error counts and the activation number to the small endpoint L3 adds; nothing else. Off: measure.js stays local (its covenant).
- Why it is true: The endpoint must accept exactly those two numbers and a version string — no uid-linked text. The About wording is the contract.
- Source: thirteenth r8

## The camera card (Scan)
- Where: Shown once before the first camera use (SCAN-FIX.6), never over a live camera.
- Default: Shows once.
- Flags: `scan primer seen` — exists (SCAN-FIX.6)
- The words:
  - Title (proposed): Before the camera comes on.
  - Body (proposed): Barcode scans never leave your phone. A photo of a shelf or a cover goes to Claude to read the titles; Praxis doesn’t keep it, and Anthropic deletes it within 30 days.
  - Button: Turn on camera
  - Hatch: Add without the camera
- What changes: Replaces the live line “nothing is stored, on your device or ours”, which overclaims for AI photo lookups (thirteenth sitting, L3 residual).
- Why it is true: Barcode decoding is on-device (zxing; the iPhone scanner in the App Store app). Shelf and cover photos go to the AI. The 30-day line is Anthropic’s.
- Source: handoff item 5; thirteenth r10

## Sign-in sub-line → L5
- Where: The front door, under the two sign-in buttons.
- Default: —
- Flags: none
- The words:
  - Line: Either one gives us your name and email, nothing else. Apple can hide your email if you’d rather.
  - Fail: Sign-in didn’t finish.
- What changes: —
- Why it is true: Apple and Google sign-in return name and email; Praxis stores nothing else from them (integrations.js).
- Source: thirteenth r2

## Call A — read-aloud (ruled 25 Oct)
Read-aloud asks once too, the first time the speaker is tapped (card 7). Flag profile.readAloudAsked is NEW. No open calls remain on this sheet.

## Added 25 Oct, Stage 0 of L3
Ruled in the design chat, 25 Oct (recorded in docs/checkpoints/l3.md, "Rulings, Stage 0"). These lines are part of this sheet.

1. Home's Yumi dock before the yes: "I'm quiet until you say yes." — the whole dock is the tap, and it opens the yes sheet. After not-now the dock reads the same; after the yes it reads as Day Three draws it.
2. What Yumi Sees · Artifacts row:
   - no artifacts exist: "Artifacts — None yet. When you write one, it stays off until you switch it on."
   - artifacts exist, none switched on: "Artifacts — None. <N> switched off." (N ≥ 2; for N = 1 use the sheet's existing line "Your artifact for <book> is switched off.")
   - one on: "1 artifact, <book>. You turned it on."
   - two or more on: "<N> artifacts: <book>, <book>, <book>. You turned them on." (titles in the order switched on, newest last; after three titles, "and <N−3> more").
3. "Ask Preston for a place" is a plain mail link, not an in-app box: mailto:prestona255@gmail.com with subject "Praxis beta — a place" and a one-line body "My sign-in code is <first 8 characters of the uid>." Nothing else in the body. There is no feedback door in the app yet; it arrives in L5 and will reuse this address. Ruling 63's "mail route" means exactly this.
4. The sign-in sub-line is NOT in L3. It belongs to the front door, which L5 redraws (and L7b changes sign-in itself). The sheet's line stays in this file, marked "→ L5".
5. CONFIRMED as ruled copy: "Let me try that again. What I had didn't pass my own check." · Try again. Day Three's words are ruled wherever the L3 brief points at Day Three, except where a ruling corrects them (F-H2).
6. F-H2 corrections to this sheet:
   - Notes row: "three most recent in full" is superseded by "Your N most recent notes, each shortened to about L characters." (N and L are the real values of the one note substrate every sender uses; L3.1 fills them in.)
   - Let-go words row: omitted until L4 (nothing dimmed without a word, so nothing shown).
   - Outside angles: the web query carries only the book's title and author and the question's own words. Everywhere "nothing about you was sent" appears, it reads instead: "Only the book and the question went out. Nothing from your notes."
7. F-C2 amendment: under not-now, barcode scanning stays open (Google Books gets an ISBN, not the reader); shelf and cover photos stay closed until the yes, with the camera card's own words. This amends thirteenth r3's phrase "by name only" to "by name or barcode".
8. Card 1's hatch (ruled 25 Oct, after F-C2): "Not now — add books by name or barcode." (replaces "Not now — add books by name only").
9. Send error counts, Settings row under-line (ruled 25 Oct): "Only how many things broke and whether the app opened. Off by default; nothing else leaves the phone. Only counts, by file and line — never what you wrote." Kind = the source file name + line number, never any part of the error message.
10. What Yumi Sees · lens names and values row (ruled 25 Oct, RT-3): "Your lens names and the values you chose — so she can sort your books and name a lens." Under it, while nothing has been sent yet: "Nothing sent yet."
11. Card 1 (the one yes), after the notes line, same register (ruled 25 Oct, RT-3): "Your lens names and the values you chose."
12. Notes row, final (ruled 25 Oct, RT-2 — supersedes item 6's placeholder): "Your 20 most recent notes, each shortened to about 240 characters."
