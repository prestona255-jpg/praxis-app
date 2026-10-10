# ONBOARDING acceptance — mockup (v2)

Surface walked: `design/praxis-spine-v1.html` (artifact "Praxis First-Run Spine", version 11) in headless Chromium at a 390×844 viewport with the three canon faces loaded; the phone screen is 358px wide in Walk view and 342px in Annotated. 1360 is not drawn and was not walked.
Base commit: `7df365b` · Date: 2026-10-09 · Session model: claude-fable-5-1 as configured, chat-side (card written in chat; landed by Claude Code, which re-ran only the G: counts)

Supersedes the 2026-09-27 mockup-stage card, which was written before any mockup existed and never landed.

**How this card came to be.** Mockup v6 (the sky-band walk, felt-passed 2026-10-05) was scored that day in chat from a summary of the brief: eleven PASS, one PARTIAL, and no row for Δ7. That score was wrong. On 2026-10-09 the mockup was corrected in five rounds:

1. A walk against the brief's own sentences found six breaks and one inventory failure (no control on the phone worked). Preston ruled three forks, all at rec; three the brief already ruled.
2. Preston caught a seventh break that walk had missed: the scan frame drew one book at a time, though §1.2 names Shelf mode and the live Scan surface has it. He ruled two more forks, both at rec.
3. Walking that version he asked what would improve it and ruled four presentation changes, all at rec: a waiting sky on the welcome; the headline "Where reading becomes theory."; scan as the one main door; each star fading in once as its act lands, with one caption the first time the band appears.
4. Two independent reviewers who had not seen the build then read the mockup, this card and the landing prompt cold. They found that the consent frame still misstated the live app (it listed the whole shelf and "reading activity" as visible, and showed a Journal note as visible; the live page lists the open book, the arc, the sub-theory, recent visible entries and the conversation, and Yumi never reads Journal notes), that Yumi read the shelf after a no, that two of the three doors opened nothing, and a set of smaller defects.
5. The same two reviewers then read version 10 and the rewritten card. The redrawn consent frame was still wrong in three places: it named an open book, which the live page never shows when opened by its own route; a yes given with reads-along off still read ON, where the live app pauses; and after a yes the page said Yumi sees nothing else while its last row said she reads the whole shelf. They also found a second shelf photo that offered the same five books again as not yet shelved, a new screen that kept the last one's scroll position, and a card that scored like gaps unlike. All of that is fixed in version 11, and the card is re-scored to one rule. What was found and not fixed is named below as debt or as a flag.

Version 11 is the result, and it is what this card walks. Preston has not yet felt-passed the changed frames: every OWNER row is blank.

| v6 showed | The brief says | this version |
|---|---|---|
| "Yes, walk them" filled gold beside two outlined chips | two chips, neither lit until tapped (§1.5) | two neutral chips ("Yes, walk them", "No, thank you"); Decide later is a quiet link |
| ledger "titles only · if you allow · nothing else, ever"; note frame "Yumi can't read it unless you say so" | the real `#yumi-sees`; reads-along shown as a fact (§1.5) | **ruled 10-09: what is true today.** The live page's own sentence; the reader's own books and one note (§1.5); Journal never shown; reads-along with its switch. Drawn wrong twice and redrawn: see O-8 |
| three terms that were not the brief's; "No feeds. No follower counts." added | the three terms verbatim (§1.1) | **ruled 10-09: the brief's three**, with the live glosses |
| no values frame | the R8 beat is beat 4 (§1.4) | **ruled 10-09: drawn in**, one frame, skip is free |
| at one book: scan again, or leave the walk | asks for three; accepts one; blocks on nothing (§1.2) | "Go on with this one" beside the next add |
| Yumi asks a question on Home at release | her first line waits until she is opened; release ends on its closing line (§1.6, §1.7) | dock carries the closing line; her question and stance live in F:yumi |
| the scan frame drew one book at a time; no whole-shelf path | each door opens the real surface: `#scan` (Book or Shelf mode) (§1.2) | **ruled 10-09: Shelf leads in first-run**, Book one tap away; the live review is drawn (draft → Shelve N → Undo); **ruled 10-09: a reader on a phone can choose a shelf photo** |
| every button inside the phone was `href="#"` | inventory row 3: controls functional or static-by-design | every control works; Walk view hides the design notes |

**Evidence codes.** F:`id` = a frame's `data-id` in the mockup. G: "text"=n = the literal occurs n times in the mockup file (the landing agent re-runs these). W1 to W7 = reader paths driven through the phone's own buttons on 2026-10-09, chat-side, 75 checks, all passing; the landing agent cannot re-run them. W1 one book in Book mode · a typed Journal note · Decide later. W2 three books by the paste stand-in · note skipped · yes. W3 the escape hatch at the doors. W4 three books · no. W5 a whole shelf from one shot · Review 1 · Shelve 6 · Undo · Choose a photo · Shelve 5 · a second photo, five different books · a third, nothing new · a Marginalia note · reads-along off and on · yes. W6 two books by the search stand-in · no note · Decide later. W7 three books · reads-along off · yes, so the walk reads PAUSED · reads-along back on. The same run ends with a short-phone pass (390×664) that checks an answer stays in view and a new screen opens at its top.

**States.** PASS, FAIL, DEFERRED and OWNER as `acceptance-card.md` defines them. One rule separates FAIL from DEFERRED on this card: a row is FAIL when the build needs a frame this mockup does not draw, and each such row points to a named debt; a row is DEFERRED when its sentence can only be proven on the built app, or names something already shipped, so the close card owns it.

## The anchor and the thirteen laws (verbatim from brief v3 §0, §3)

| # | Law sentence (verbatim) | State | Evidence |
|---|---|---|---|
| 0 | A person Preston has never coached, on their own phone, signs in, gets books in, leaves a note, closes the app, and returns two days later to find it all there and legible — with no Preston intervention. | DEFERRED → stranger test + two-day return (brief §9) | A mockup cannot hold an account. W1 and W5 complete sign-in → books → note → Home with no dead control. |
| 1 | **ONE FIRST-RUN** — every shipped first-run behavior is absorbed or retired by name (§5). One spine, one progress record, one mockup. | PASS | One mockup, one walk. No stance screen in the spine (stance sits only in F:yumi), no replica chips, no six-beat greeting. The first three sample titles reuse those of the retired chips as sample data only. Build-side retirement (brief §5) is the close card's. |
| 2 | **REAL SURFACES, REAL DATA** — every beat runs on the live surface with the reader's own data. "Simulated-real" is dead. The spine owns no writer. | DEFERRED → close card | Provable only on live. At mockup scope: Scan, the capture door, What Yumi Sees and the values beat are drawn with the live surfaces' own copy (G: "Fill the frame with one row of spines — then tap to read"=1; G: "Draft case"=3; G: "File it"=3; G: "What do you read toward?"=1), and the consent ledger shows the reader's own typed note (W5). Not drawn as real surfaces: the search and paste doors, which open a marked stand-in (debt D-6, scored at Δ3). |
| 3 | **FIRST EMBER = PLAIN ONE-DOOR NOTE CAPTURE** — never basin / create, no Room landing. | PASS | F:margin is the live capture door, plain: its own labels ("Catch a thought", "File it"), pre-scoped to the first book, Marginalia or Journal, no Room and no basin. "File it" completes the beat (W1); "Not now" records a skip (W2). |
| 4 | **RESUME** — spine progress persists per uid; re-entry resumes at the next unfinished beat, never restarts; unanswered consent = unasked, generation never ran. | FAIL → named debt | Persistence itself is build-only. Drawn: leaving early lands on Home with a line naming where the walk continues (W3; G: "Continue the walk"=1), and Decide later reads UNANSWERED (W1). Not drawn: re-entry, a resumed beat showing its act already done. The build needs that frame: debt D-4. |
| 5 | **PROMISE-KEEPING** — every promise the spine makes names its fulfillment surface (lenses → the Shelf's Lenses rail, quiet "arrived" state, Yumi silent). | PASS | Every promise in the frames names where it is kept: lenses "on the shelf, under Lenses"; the unanswered question "on What Yumi Sees"; leaving early "Continue the walk, in About"; the note "in your Notebook, under this book"; an empty shelf "Scan, in the bar below". The arc line sits directly under the sky where its lines will appear. The Lenses rail's "arrived" state itself is not drawn; that is scored at Δ5 (D-3). |
| 6 | **RAISED HAND** — no unbidden post-release ping, ever. Yumi speaks first only inside the spine. | PASS | On release Yumi's only words are the brief's closing line (G: "I'm in the corner when you want me."=1; W1: no question mark in her dock). Her question exists only in F:yumi, reached by tapping her. Decide later says the question "will not come looking for you." |
| 7 | **VALUES BEFORE LENSES** — the values invitation has zero generation dependency. | PASS | F:values sits before F:consent and depends on nothing generated. There is no lens beat. |
| 8 | **DECLINED MEMORY IS FIRST-CLASS** — lenses absent gracefully, values untouched, nothing sulks. | PASS | F:consent "declined, gracefully" reads DECLINED with "Then I'll wait to be asked." Release after a no drops only the lens line, and Yumi's first line stays scripted, not read from the shelf (W4). |
| 9 | **SMALL-CORPUS FLOOR = 3** — below it Yumi's walk is promised, not performed; nothing gates on it. | PASS | One book goes on to the note (W1) and two do (W6). Below three, F:yumi is scripted (G: "SCRIPTED · NO MODEL CALL UNTIL YOU WRITE BACK"=1); with a yes and three books it reads from the shelf (W2); with three books and no yes it stays scripted (W4), and so it does with a yes while reads-along is off (W7). Nothing gates. |
| 10 | **DESIGNED STATES** — every beat has waiting / empty / error states; none block release (RF1). | FAIL → named debt | Six of the thirteen §8 states are drawn, seven are not (table below). Returned to chat 2026-10-09; Preston's answer was "land it", so it rides as debt D-1, owed before the P3 spine lane builds. |
| 11 | **SPARSE-HONEST** — applies to one- and two-book shelves. | PASS | F:shelf draws one and two books as what they are. Release for two books and no note tells the truth about both (W6), and the drawn state "one book, no note" does the same. |
| 12 | **COPY IS A CONTRACT** — no beat promises behavior that is not built (`CLAUDE.md`). | DEFERRED → close card | The mockup is the target, so its copy is the obligation list (below). Each line names what must ship first. |
| 13 | **INHERITED QUALITY BAR** — the books beat inherits each door's quality bar; a door's defect is that door's lane, not onboarding scope. | DEFERRED → close card | Nothing to walk at mockup scope. |

## The eight deltas (the Change cell, verbatim from brief v3 §2)

| Δ | Change (verbatim) | State | Evidence |
|---|---|---|---|
| 1 | one pre-auth screen: terms + Sign in | OWNER | Terms are the brief's three, verbatim, with the live app's glosses (G: "Yumi sees only what you allow"=1; G: "Memory is yours to grant"=1; G: "Your words stay yours"=1; G: "No feeds"=0). The mockup draws three pre-auth frames (welcome · covenant · sign in), the shape felt-passed 2026-10-05; the sentence says one. See O-2. |
| 2 | spine order fixed books → margin; margin = the shared door, plain, pre-scoped | PASS | F:doors → F:shelf → F:margin in that order on every path (W1, W2, W4, W5, W6). |
| 3 | the beat is that sentence; each door opens the real surface; asks for three | FAIL → named debt | The sentence is there (G: "Scan a spine, search a title, or paste a whole list"=1) and the beat asks for three and accepts one (W1, W6). The scan door is the live Scan surface in both modes with its own guide lines and review (G: "Center a barcode or cover in the frame"=1; G: "Ready to shelve"=1; G: "Need a look"=1; W5: Review 1 → Shelve 6 → Undo), and Shelf leads in first-run (W1). But the search door and the paste door do not open a real surface: each opens a marked stand-in (G: "This door isn't drawn yet."=1). Debt D-6. |
| 4 | floor = 3 owned books; below it Yumi's first line is scripted, zero LLM calls | PASS | F:yumi "below the floor" and "at the floor"; W1, W2, W4. |
| 5 | no lens beat; release promises only when consent ∧ floor; the rail's empty copy flips to a quiet "arrived" | FAIL → named debt | Clauses 1 and 2 hold: no lens beat, and the lens line appears only with a yes, three books and reads-along on (W2 and W5 yes; W1, W3, W4, W6, W7 no). Clause 3, the rail's "arrived" state, is a Shelf frame and is not drawn. Debt D-3. |
| 6 | opens real `#yumi-sees`; two neutral chips; Decide later = unanswered; reads-along shown as a fact | OWNER | The frame carries the live page's own sentence (G: "Yumi does not see anything else."=1) and, under it, what brief §1.5 says the page must list: the reader's own books and one note. That books row is not on the live page: its Current book section reads "No book is open right now." whenever the page is opened by its own route. It is a build item, listed below. A Journal note is never shown as visible (W1); a Marginalia note is (W5). Reads-along is a working switch, and a yes given with it off reads PAUSED, as the live app pauses memory (W7). Two chips, none lit (G: "class="yes""=0; W1). Decide later = UNANSWERED. After a yes the page's sentence changes to name the walk (W2). Condensed: the empty arc and conversation lines are folded into one and the empty sub-theory and Artifacts sections are left out. Scored OWNER, not PASS: this frame has been drawn wrong twice, part of it is now new design, and O-8 is unanswered. |
| 7 | values absorbed as shipped; stance → Yumi's first line; living statement → Account | DEFERRED → close card | Drawn: F:values carries the ten presets, name-your-own and the shipped copy; stance lives in F:yumi (G: "Stay out unless asked"=1). Clause 3, the living statement, is a shipped field on the Profile page and outside this mockup. |
| 8 | computed release; Home sky-first; escape on every beat writes progress; `{beat, done}` per uid; "Continue the walk" | FAIL → named debt | Drawn: release is rendered from the walk state (W1 to W7 each differ), Home is sky-first, and the escape sits on beats 2 to 5 (G: "data-bail"=8: seven buttons, one handler). Not drawn: About's "Continue the walk" and the beat it resumes. The build needs that frame: debt D-4. The per-uid record is build-side. |

Tally: laws 8 PASS · 3 DEFERRED · 2 FAIL. Deltas 2 PASS · 3 FAIL · 1 DEFERRED · 2 OWNER. Every FAIL is a named debt below. The completeness inventory adds two MISSING rows (States, Widths), which the protocol counts as FAIL as well: debts D-1 and D-5.

## Designed states (brief v3 §8)

| Beat | Waiting | Empty | Error |
|---|---|---|---|
| Books | NOT DRAWN (cover lookup pending; the shelf read in progress) | DRAWN (W3: Home says "No books yet") | NOT DRAWN (lookup fails; an unreadable shelf photo; the daily shelf-reading rest) |
| Margin | — | DRAWN (W2: "Nothing written yet.") | NOT DRAWN (write fails) |
| Values | — | DRAWN (skip asserts nothing) | NOT DRAWN (persist fails) |
| Consent | — | DRAWN (decide later → UNANSWERED) | NOT DRAWN (persist fails) |
| Release | DRAWN (computed at open) | — | — |
| Yumi's first line | NOT DRAWN (typing indicator) | DRAWN (scripted below the floor) | NOT DRAWN (proxy error) |

Also drawn, outside §8: the sign-in failure. Six of thirteen drawn, seven not.

## Named debt (owed before the P3 spine lane builds against this mockup)

- **D-1** the seven undrawn §8 states, plus the scan-failure and import-wait frames named in chat 2026-10-05. For Shelf mode that means the read in progress, an unreadable photo ("nothing was added"), and the daily shelf-reading rest.
- **D-2** the error color token, absent from canon v1.2 (the sign-in failure uses a `--gold-ink` hairline as a stand-in). P3 Stage 0.
- **D-3** the Lenses rail's quiet "arrived" state (Δ5 clause 3; the fulfillment surface of the lens promise in law 5).
- **D-4** the re-entry frame: About's "Continue the walk" and a resumed beat showing its act already done (law 4 RESUME, Δ8, §1.8).
- **D-5** 1360. Not drawn; the mockup states the intent (beats 1 to 5 centre the card at 480px and the books beat leads with search and paste; release is the v7 desktop Home). See O-4.
- **D-6** the search door and the paste door (Δ3). Neither surface is drawn; each opens a marked stand-in that puts sample books on the shelf. Also not drawn on the scan door: Book mode's verdict sheet ("Add to shelf" / "Keep scanning") and the camera primer with "Add without the camera".

## Copy the mockup commits the build to (COPY IS A CONTRACT)

- "Choose a photo", beside a live camera — a NEW build item (ruled 10-09). Today the shelf-photo drop zone has one mount, inside the camera-off overlay, so a reader sees it only after the camera is refused or unavailable; it feeds the same shelf-vision pipeline.
- "already shelved", on a repeat photo — the live review's own flag for an exact match; the mockup's third photo shows it. "Draft case — nothing new in this photo" and "Back to your shelf" beside it are new.
- First-run opens Scan in Shelf mode (ruled 10-09) — no new mechanism; the `#scan/shelf` preselect exists.
- "Type it instead" and "Done" on the viewfinder — neither is on the live viewfinder today.
- "Shelved N · Undo" stays on screen in the mockup; the live receipt hides itself after about nine seconds.
- "Search a title · Find a book by its name" — needs brief §6 E (the add door is a manual form today).
- "Paste a whole list · Titles, or a Goodreads file" — needs brief §7 (the Goodreads minimal CSV).
- The What Yumi Sees sentence ending "Yumi does not see anything else." — false until brief §6 B (the seed leak) is fixed. The reads-along switch on that page is new (brief §1.5); today it lives on the Notebook and in Profile settings.
- "Your books", on What Yumi Sees — needs brief §1.5. The live page has a Current book section only, and opened by its own route it always reads "No book is open right now."
- "With her walk on, she also reads your whole shelf, for lenses. She sees nothing else." — new at Δ6; the live sentence has no clause for the walk. The question and the walk's status row are new on that page as well: today the memory opt-in sits on the Profile page.
- PAUSED, when the answer is yes and reads-along is off — true of memory today (the live app needs both switches and says "Paused"); the walk must follow the same rule.
- "Journal sits beside your life, and Yumi never reads it." — true today (`js/yumi-brain.js`, the journal-register skip) and must stay true.
- "Continue the walk, in About" — needs Δ8 (About says "Retake the walk" today).
- "Your lenses land on the shelf, under Lenses." — needs Δ5 and D-3.
- "Yumi walks your shelf once it holds three books." — commits the build to start her walk when a consenting reader's shelf reaches three.
- "The gold pen opens a margin in any book." — the capture door on the pen, every surface (amendment 1.2, ruling 1; canon rule R9).
- "Either way it lands in your Notebook, under this book." — needs the door pre-scoped to the book and filing there. On the P2 census (§5.3) a book picked in the door did not take, and the note filed to the Inbox.
- "No books yet. Scan, in the bar below, takes your first." — needs the v7 tab bar.
- "We ask for nothing but your name and email." — true of the sign-in today (neither provider asks for a scope beyond the default profile and email) and must stay true. Brief §6 H covers the project name on Google's consent screen.
- "You'll read it yourself in a minute." — true only while the consent beat follows in the same walk.

## Completeness inventory (acceptance-card.md)

| # | Anatomy | State | Evidence |
|---|---|---|---|
| 1 | Ground | SHOWN | sky band, grain, Home sky; canon v1.2 tokens. The band's ground was brought to canon R3 in review (the lamp on the sky; a second gradient removed), so it is a shade darker than the band felt-passed on 10-05 |
| 2 | States | MISSING → D-1 | six of thirteen. Outside §8, a repeat shelf photo is drawn (nothing new). The sign-in failure is reachable only from the state switcher, not in Walk view; the zero-book Home is reachable only by taps (W3). Skew cases (long title, very long note) are escaped and wrap but were not designed |
| 3 | Controls | SHOWN | W1 to W7; G: "href="#""=0. Static by design, marked `data-static`: Read it in full, the pen, the tab bar, Write back (G: "data-static"=5: four elements, one style rule). Search and paste open a stand-in (D-6) |
| 4 | Widths | MISSING → D-5 | 1360 is not drawn. 390 is: at 390, 360 and 320 in both views there is no horizontal scroll, every text is 11px or larger and every tappable control is 44px or taller (measured on version 11). On a short phone (390×664) an answer stays in view and a new screen opens at its top |
| 5 | Motion | SHOWN | one motion: a star fades in over 280ms on `cubic-bezier(.2,.7,.2,1)`, opacity and transform only (canon R8; G: "@keyframes kindle"=1). The Home sky stays still (R8 as ruled in canon 1.2). Under reduced motion the animation is off (measured: animation-name none) |
| 6 | Marks | SHOWN | token against token: star on sky 8.37, ink-3 on page 4.77, ink-2 on page 4.65, gold-ink on page 4.53, on-night-3 on umber 5.18. But the grain and the spill darken the rendered paper: an independent measurement of rendered pixels put small text on paper at about 4.1 to 4.45, under the 4.5 the canon asks. Carried out as flag F-1 |
| 7 | Text | SHOWN | no filler. Sample data: twelve books, one note |
| 8 | Seams | SHOWN | shown: release → Yumi's first line. Explicitly out of round: the Shelf, Arcs, Notebook and Scan tabs (static) and About (D-4); in Walk view a line under the phone says the mockup ends there. The Scan review's exception walker resolves in place. What Yumi Sees is named on Home but nothing on Home links to it |
| 9 | Behaviors | SHOWN | RETIRED-BY-RULING or absorbed: brief §5 names every shipped first-run behavior. DRESS: canon v1.2 tokens only. Flagged: the error color is missing (D-2) and the Home greeting is smaller than canon (F-2). Brought to canon in review: the switch no longer uses stem as a fill, the counts are 34px, progress dots are ink, the band and the sky screens carry no extra gradient or grain, and Yumi's mark uses the yumi token |

## Elevation loop (acceptance-card.md)

| Axis | Score | Note |
|---|---|---|
| Fidelity | 2 | five rows FAIL (laws 4 and 10, Δ3, Δ5, Δ8), every one a frame not drawn; Δ1 and Δ6 are Preston's. The score is unchanged from the last card: the same frames are missing, counted now in five rows where that card counted three |
| Craft | 2 | held down by flag F-1 (contrast under the grain) |
| Motion | 3 | one ruled motion, canon easing, reduced motion verified |
| Quiet | 2 | the consent page is dense: one sentence of six lines above a four-row ledger |
| Responsive | 1 | phone widths only; 1360 is debt D-5 |
| Function | 2 | every drawn control works; two doors are stand-ins |

12 of 18. More than three improvement passes were run in chat on 2026-10-09 (versions 7 to 11), so the loop's limit is spent; it goes to Preston as it stands. His felt pass beats the score.

## New copy written in chat on 2026-10-09 (not from the brief, the live app, or v6)

"Where reading becomes theory." (ruled 10-09) · "Your sky. It fills as you go." · "Open the camera" · "Without a camera" · "A whole shelf in one photo, or one book" · "Find a book by its name" · "Titles, or a Goodreads file" · "Choose a photo" (new on a phone) · "Type it instead" · "Done" · "N ON YOUR SHELF" · "A spine that didn't read cleanly · Best guess: …" · "Draft case — nothing new in this photo" · "Back to your shelf" · "Scan again" · "Scan the next one" · "Add another" · "Add another way" · "Go on with this one" / "Go on with these two" · "Two. One more and your shelf can carry a thought." · "Keep adding if you like, or leave your first note." · "Not now" (the note) · "Journal sits beside your life, and Yumi never reads it. Either way it lands in your Notebook, under this book." · "Your books" · "and N more" · "Yumi's walk" as the status row's label, with ON, PAUSED, DECLINED or UNANSWERED · "Her walk: your whole shelf, read for lenses, and her memory of you." · "With her walk on, she also reads your whole shelf, for lenses. She sees nothing else." · "Paused while “Yumi reads along” is off. Turn it on, above, and her walk begins." · "No, thank you" · "Journal notes are never read." · "Left unanswered, which is not a no. The question waits on this page and will not come looking for you." · "Praxis works fully without her walk. If you change your mind, the question is here." · "Change my answer" · the release lines ("Nothing written yet." · "The gold pen opens a margin in any book." · "No books yet. Scan, in the bar below, takes your first." · "Yumi is walking your shelf." · "Yumi walks your shelf once it holds three books." · "Yumi's walk is paused while “Yumi reads along” is off. The switch is on What Yumi Sees." · "The question about Yumi's walk waits on What Yumi Sees." · "You left the introduction early. Continue the walk, in About, picks up where you stopped.") · in F:yumi, "How should I begin with you? You can change this any time.", "Which book would you bring here first?" and "Write back…" · mockup-only text: "This door isn't drawn yet." and its two explanations, "MOCKUP · TAP THE FRAME", "The mockup ends here. …" under the phone, the Annotated-view title "Your own path", and the Annotated-view labels "READ FROM YOUR SHELF" and "SCRIPTED · NO MODEL CALL UNTIL YOU WRITE BACK" (hidden in Walk view).

## OWNER rows (Preston's; agents never fill these)

| # | Judgment | Verdict |
|---|---|---|
| O-1 | Does the walk still feel right with the values beat in it? | |
| O-2 | Front door: three pre-auth frames as felt-passed 10-05, or the brief's one screen? Three frames is three taps to the Google prompt where §1.1 says "1 tap today, keep it", and means a one-line errata to §1.1. | |
| O-3 | "Read it in full" before sign-in (brief §11, open) — keep or cut? | |
| O-4 | 1360: stays debt D-5 for P3 Stage 0, or drawn before the stranger? | |
| O-5 | The new copy listed above — any line that does not sound like Praxis? In particular "No, thank you" against "Decide later", and "File it" (the live door's label) where v6 said "Keep it". | |
| O-6 | The stranger's walk of this mockup: who, when, where they hesitated. Watch the values beat: after the shelf lands the walk asks three things in a row (a note, values, consent) before the app gives anything back. Watch the early-leave path too: Home then points at Scan and About, which this mockup does not draw. | |
| O-7 | Time to release on that walk (soft budget ~3 min) | |
| O-8 | The consent frame. The 10-09 fork offered "shelf, margins and reading activity listed as visible" as what is true today, and that description was wrong. The frame now carries the live page's own sentence; a "Your books" row drawn from brief §1.5, which the live page does not have; PAUSED when reads-along is off; and a sentence that names the walk once it is on. Confirm it, or rule the live page's shape instead. | |
| O-9 | Three judgement calls from the review: there is no Back anywhere in the walk (the live journey has one); the sky band sits over Scan, which is a full-screen surface in the live app; after a whole-shelf scan the note is still fixed to the first book. | |

Flags carried in (from chat): the 2026-10-05 score was wrong; the sky band, the unconnected stars and "Name your first arc, and lines appear." were ruled 2026-10-05 and are unchanged; Sunflower canon confirmed a third time, both alternates declined.
Flags carried out (new, non-law): **F-1** rendered contrast under the grain and the spill is below 4.5 for small text on paper, which canon R10 will need measured on rendered ground in P3 Stage 0; **F-2** canon 1.2 sets the Home greeting at 46px, but the longest greeting ("Good afternoon,") does not fit one line at that size on a 390 phone, so the mockup scales it to fit (41px at 390, 37 at 360, 32 at 320) and P3 Stage 0 rules a wrap or a size; no live region announces a new frame or a computed line (focus moves to the new screen instead); the band is empty at sign-in and its first star lights on arrival at the books beat (v6 drew it lit on the sign-in frame); with Shelf leading, a first-run normally spends one shelf-vision read (the Opus call), so the daily shelf-reading rest and the server cost ceiling are both in play for a stranger, which belongs in H-1's cost item (brief §6 H); the doors, review, consent and Home frames run taller than one screen at 390 and scroll, and in the mockup the Home tab bar scrolls with the page instead of staying fixed; the mockup's first book is always *Pedagogy of the Oppressed* whichever door was used.
