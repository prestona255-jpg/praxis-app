# Praxis P2 — eighteenth sitting (11–14 Nov 2026, Fable 5.2): the L4b design chat

Opened as "Open Lens, the page, in Sunflower". On 11 Nov Preston reopened the look himself ("the color scheme in general is still off"; "designed like an Apple quality app"). The sitting closed with a new colour direction, fifteen redrawn rooms, a new capture and two new gestures. Everything below was ruled by Preston on his phone against the two artifacts named in §B, unless marked PROPOSED.

Model: Claude Fable 5.2 (`claude-fable-5-2`). Repo read: `praxis-app` main at v3.316 (zip of 14 Nov, tree dated 30 Oct).

## A. Ruled

**r88 — the look: "Blue sky, warm ground" (canon amendment 1.5).** Brown, yellow, white and blue, calm and clean, large covers. Night stays brown. Day paper turns from wheat to white. Yellow is the one main button on a screen. Brown does the work of an accent: links, "Open", the current tab. A warm sand block ("the field") carries the one thing a page is about. Supersedes the day column of canon 1.4; the night column shifts slightly. Preston, 14 Nov: "I like this version."

**r89 — the sky is blue with a sunset burst.** Both moods (day `#1D5AA6`, night `#0F2F5E`). A warm burst sits behind the flower (gold, coral, pink, fading to the blue). The flowing strokes follow the same colours by distance from the flower, ending pale blue at the edges; the brown specks are gone. Brown ground rises at the base of the sky. Lens names and the hint carry a soft dark edge so they read on the burst. Preston, 14 Nov: "a pink warm-ish burst, sunset"; then "Much better." **The mockup does this from outside `hand.js`; the real version is an engine change (ledger E1).**

**r90 — Open Lens, the page (fifteenth r46), the third drawing.** The lens sits large in a band of sky and moves; Back and ••• live in the band. Yumi's question is the largest line on the page, with one button to her ("Think it through with Yumi"). "Yours" is one grouped list (why you return, what you said back, let her forget). Her reading and the books are one section: a passage, a swipe row of covers, and her clause under the selected cover. Leaving a book out is under Edit; the floor of two books shows in place. Rename, See on the shelf and Let it go are under •••. Two type voices only; no mono labels on the page. Preston, 11 Nov: "love everything but the color"; 14 Nov: the band's burst takes **that lens's own colour**.

**r91 — the tab bar (ruling 79, drawn).** Home · Shelf · Notebook · Capture · You, with the Search pill on Home and a search bar on Shelf and Notebook. The current tab is brown, not gold.

**r92 — Capture is a dial.** One circle of five wedges: Note, Voice, Paste, Photo, Scan. The chosen wedge, the centre and the edge of the writing box take that way's own colour (gold `#F2B72E`, coral `#EE7A5E`, violet `#B595E6`, blue `#6FA8EE`, green `#7CBF78`). "File it" stays yellow. When the reader starts typing, the dial folds to one coloured chip so the box and "File it" sit above the keyboard; the chip reopens the dial; words survive a change of way. Preston, 14 Nov: "a clear defined infographic circle with all the different options and each their own color."

**r93 — press and hold a cover.** On Home, Shelf, a category, search results and the book page, holding a cover brings up that book's short menu: each lens it is in, Your notes, Add a note. A plain tap still opens the book. Right-click does the same on desktop.

**r94 — reading status is hidden until asked for.** No status control and no status label sits on the book page or in the hold menu. Tapping the cover (on the book page, or the small cover inside the hold menu) shows Reading / Have read / Will read; choosing one folds them away and confirms in a toast. Preston, 14 Nov, twice: "not always present"; "hidden from here and the main page; when you click on the book then the option comes up."

**r95 — a one-time hint teaches both cover gestures.** The first time a book page opens, a bubble under the cover says to tap it for status and hold it for more. "Got it", or using either gesture, retires it for good.

**r96 — the rooms in the look.** Notebook (one list, a dot per kind, the lens mark at the right, filter chips), a book, You (the flower in the sky band, numbers, threads, open questions, rows), Search, a category, a note, the artifact, What Yumi sees, Settings, Your data, About Praxis. Structure and words come from Day Three, trimmed. Preston, 14 Nov: "Yes this is all amazing."

**r97 — a reader with nothing yet has rooms too.** Home (an empty sky, "Start with one book"), Shelf, Notebook and You each have an empty state with one first step. Layout ruled; **the words are PROPOSED** (ledger W1–W3).

## B. The pictures

- **Praxis Style Study** — https://claude.ai/artifact/F9K9C6VjR2VfMyNsWSps5T (v12). Home, Shelf, Notebook, a book, Capture, You, Search, a category, a note, the artifact, What Yumi sees, Settings, Your data, About; the hold menu; the empty rooms. Suite `tools/hz19.py`: **139 runs, 1103 checks, 0 failed.** The fourteen rooms are checked in "Blue sky, warm ground" only; the two other styles in the control are kept for the record and should be read as rejected.
- **Praxis Open Lens 4** — https://claude.ai/artifact/YVY6PayUefc12ZYnpLekaN (v1). The third drawing in the look. Suite `tools/ol19b.py`: **68 runs, 678 checks, 0 failed.**
- Both load `hand.js` unchanged (md5 `fd51ca7e69325ad3f93c4be54d974d9a`).
- Superseded and kept for the record: Praxis Open Lens (1, 2, 3), Praxis Colour Study.

**What the suites do not measure.** Text sitting on a glow is checked against the flat sky colour, not the glow. The dial's fit above a real iPhone keyboard is measured by sheet height (about 400 pt), not on a device. Press-and-hold timing (0.43 s) is a guess.

## C. The lanes (replaces "L4b is one build")

| Lane | What | Needs | Size |
|---|---|---|---|
| **LC1** | The colours: token values in `theme.css` plus five literals. No layout. | A clean tree. Runs before or after L4, never during. | 35 lines, byte-neutral. Prompt: `LC1-OPENING-PROMPT.md` |
| **L4b-1** | The tab bar and the Search pill replace the phone nav. | LC1 | small |
| **L4b-2** | New routes `#lens/<id>` (Open Lens) and `#category/<id>`. | L4 (the lens engine) | medium |
| **L4b-3** | The redrawn rooms, a few per build: Home body, Shelf, book, Notebook, note, You, artifact, the pages under You, Search. | L4b-1 | large; split by room |
| **L4b-4** | The capture dial, the hold menu, status behind the cover, the hint. | L4b-3 (book) | medium |
| **LC2** | The blue sky and the sunset burst. | L4 **and** a new `hand.js` from a design sitting (ledger E1) | engine |
| **L4b-5** | The empty rooms. | W1–W3 ruled; ideally with L5 | small |

Order: LC1 → L4b-1 → L4b-2 → L4b-3 → L4b-4 → LC2 → L4b-5. LC2 can move earlier once the engine exists. Between LC1 and LC2 the app has the new paper under the old brown sky; that pairing was liked on 11 Nov ("brown for the night").

## D. Contract notes for the rooms (what each reads and writes)

- **Open Lens** reads the lens record (lens-contract §1, engine contract §2: name, hersName, origin, bookIds, leftOuts, q, lead, clauses, close, why, said, rounds) and the notes of its books. Writes: rename (`name`), leave out / put back (`leftOuts`), the why line, let her forget (`said`), let it go. "Gone" books are derivable as clause keys in neither `bookIds` nor `leftOuts`.
- **Hold menu and status** read the book record and its lenses; write `status` only. No new field.
- **The hint** needs one new per-reader flag through `ls`/`sv` (suggested key `praxis_cover_hint`). Additive.
- **Capture dial** is the existing door with its registers re-housed. It writes what the door writes today. Typed text must survive a change of way.
- **Tab bar** is navigation only. Back stack: a tab is a root; a room opened from a tab goes back to it; Search goes back to the tab it was opened from.
- **Live voice differs from Day Three** wherever the mockup's words were trimmed to fit. The build takes the live strings unless a ruling above changes them. Exact lines get listed in each room's own prompt, at its Stage 0.

## E. The ledger (for Preston to rule; none of these is designed around)

**Engine.** E1 — the blue sky needs `hand.js` changed: stroke colours in `spawn()` are five browns; the lens tint mixes toward them; the Garden colours are clamped to 3:1 against two brown skies. E2 — the sky following the time of day (peach at morning, this sunset at evening). Not drawn.

**Colour risks LC1 will measure.** C1 — `--gold` is used as text 49 times and as a border 75 times in `components.css`. On white day paper the new yellow is 1.71:1; on wheat today it is about 1.76:1, so this is not worse, but it is not good. C2 — the day `--lamp` is a brown glow at the top of day pages; on white it may read as dirt. C3 — the Arcs list and arc interior share the day token block, so their ink and gold shift with it.

**Gestures.** G1 — status is invisible until the cover is tapped; nothing on the page says where a book stands. G2 — two hidden gestures rest on one hint. G3 — hold timing.

**Words (PROPOSED).** W1 — the empty-room lines. W2 — the two ways to add a first book ("Scan a barcode", "Type a title"). W3 — "Once a few books are here" avoids naming the floor.

**Navigation.** N1 — Arcs leaves the top level (Day Three: "open in the next release"). N2 — Scan becomes a wedge of the dial; does `#scan` stay a route? N3 — About moves under You. N4 — Settings and Your data: new routes, or sections of `#profile`? N5 — "Tell Preston" has a row and no page.

**Carried from earlier in the sitting.** The corner Bloom overlaps right-edge controls. Whether a lens under two books shows in the sky. Whether notes survive when a book leaves the shelf. "Add books to it" and "Add a line (why)" need surfaces. A zero-book lens is not drawn. Back is no longer pinned on Open Lens. The "Journal is never read" line was dropped from Open Lens notes. S17–S21 (order on the page; the door's name against the sheet's "Not quite — talk it through"; no door for an unread own lens; the under-two-books state; rename in the head). M1 — Day Three draws a marks page; live redirects `#book/<id>/marks` to the book.

## F. What was not done this sitting, and why

- **The L4b room prompts.** Line numbers and the lens engine both depend on L4, which is not on main. Each room gets its own prompt when its lane opens.
- **A check against the live app's strings.** The repo arrived at the end; the census was made from it, the rooms were not re-read against it.
- **Yumi's panel, the lens sheet from the sky, first-run.** Not redrawn.
