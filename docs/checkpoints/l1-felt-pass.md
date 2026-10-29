# L1.1 felt pass — the gap record (28 Oct 2026, praxis-v3.313 / 1a74f48)

Preston walked the live app on his iPhone against the Day Three mockup (design/praxis-day-three.html, v2.3) in night and in day. 24 screenshots were read by the design chat side by side with the mockup's own captures in both moods. This record is the input to L1.2 and to the later lanes. Rulings 73–81 are the design chat's (29 Oct, Preston approved).

## Verdict (ruling 73)

L1.1's paint PASSES in both moods on the ten routes walked: Home, Books, A book, Notebook, A note, Scan primer (verdict sheet), Profile, What Yumi Sees, Settings, Yumi's panel. The night ground, the day ground (#D7C38F in the app vs #D7C390 in the mockup), the selected segments (ink fill, paper text), gold held to the one primary pill, terracotta on Yumi only, no error red — all match the canon. Search and the not-on-the-list card were not walked, and the offline font check was not reported; all three carry into L1.2's felt pass.

Five defects L1 caused or exposed go FIRST in L1.2 (L1.2a). Everything else here is layout, copy or a pre-existing bug and belongs to a later lane or the D-list.

## A. L1 defects — fix in L1.2a (rulings 74–78)

| # | Route | What was seen | Ruling |
|---|---|---|---|
| F1 | Profile, both moods | The header collides: "Publishing as Roland Blair" and the empty-sky invite ("still thinking — worth returning to?") print on top of each other; the name is cut to "Preston Al…" beside the visitor pill. L1.1's ellipsis fix was tested only on "D0 Tester", an account with no pen-name line. Cause: Fraunces sets the header taller and wider than Cormorant did. | **R74** — `_pfPlaceInvite` must exclude the header's bounding box (name, pen-name line, pill) when it picks the emptiest sky area; the `.pf-name` ellipsis stays. Proof: at 390/360/320 in both moods with a fixture profile (name "Preston Allen", pen name "Roland Blair") the invite's box and the header's box do not intersect — print the four boxes. The L1-NAME residual (108px name box) stays with the profile round; this ruling fixes the overlap only. |
| F2 | Profile, both moods | A chip in the Values card reads "[object Object]" (night: the chip above the counts; day: the big line under "Ask Yumi to notice values"). Raw data printed where a value's name belongs. | **R77** — Stage 0 bisects: render Profile at f54be02 (pre-L1) and at HEAD with the same account data. If L1.1 introduced it, fix in L1.2a. If pre-existing: fix in L1.2a only if the fix is ≤ 3 lines of ES3 in the renderer and changes nothing but what the chip prints; otherwise log as D9 and leave it. Record the bisect result either way. |
| F3 | Capture door, both moods | An empty box (a missing glyph) prints before "Paste/Import". The other four mode buttons draw their icon. | **R76** — identify the character (code point) and which font the stack asks to draw it. If it is an emoji/symbol that the self-hosted stack no longer falls back for, add the system symbol fallback to the stack (font stack = L1 scope). If it is a glyph the old font supplied and no system font has, use the same glyph the Paste mode uses elsewhere in the app. Proof: the glyph renders at 390 in both moods (screenshot) and `document.fonts`/computed style names the font that drew it. |
| F4 | Profile · By the numbers, day | The coloured stat lines under each category ("15 books · 1 marginalia") measure under the floor on the card colour #E2C98C: Psychology teal 3.89:1, Race olive 4.32:1, Education green 4.33:1 (Memoir 5.74, Essays 4.69, Technology 5.14 pass). | **R75** — ruling 43's family: text on `--page-3` is `--ink` only. The stat line goes to `--ink`; the category colour stays on the dot and the bar. Proof: every category's stat line ≥ 4.5:1 in both moods, printed. |
| F5 | Yumi's panel, day | Her opening line ("It is nice to be in your presence today… what is actually open?") runs under the "She'll never tell you what to think" footer and is cut off. Fraunces is taller than the old face. | **R78** — Stage 0 measures: with a 60-word opener at 390×844, does the message area scroll? If it does not, it is a defect: fix the overflow (scrollable message area under the fixed footer; no layout change beyond that). If it scrolls, record "cramped at 390" and change nothing. |

Also covered by L1.2's flat pass as already written (ruling A), confirmed by the walk:
- The lens-card buttons (Name it · Rename · Not this) render in DM Mono; `button{font:inherit}` must put them in DM Sans — grep and prove.
- Gradients still live on: Home's top glow, the Book card, the Notebook book band, Profile's gold bottom band, the gold "Yumi reads along" ball on Notebook. Ruling A flattens them to their darker stop.

## B. Not L1 — log to the D-list (ruling 80: D9–D12)

| D | Where | What |
|---|---|---|
| D9 | Home vs Shelf | Home's "Still reading" says "117 books open right now"; Shelf says "112 reading". The two counts disagree. |
| D10 | A note's page (Journal) | A Journal entry's page says "In the Inbox — not yet filed to a book". Wrong for a Journal note. |
| D11 | Shelf, both moods | The gold "+ Add a book" pill sits on top of the "Education" heading, and the floating "+" overlaps it. |
| D12 | Settings · Send error counts | The app's note adds "Only counts, by file and line — never what you wrote", which the mockup's wording does not have. L1.2 Stage 0 greps docs/studio/consent-copy.md for the "Send error counts" item and reports whether the live words match it. If they drift, the fix is a one-line copy commit after L1.2, not inside it (copy is L1's non-goal; consent-copy.md is the contract). |

If R77 finds "[object Object]" pre-existing and not fixed, it is D13.

## C. Layout and copy — owned by later lanes

| Route | App today | Mockup | Lane |
|---|---|---|---|
| Navigation (every route) | ☰ menu at the top; a floating gold "+" bottom-left that covers content (seen on Book Artifact, Your data, the hands-free switch, Shelf). | Bottom tabs Home · Shelf · Notebook · Capture · You; a Search pill at the top of Home/Shelf/Notebook; no floating +. | **L4b (ruling 79)** |
| Home | The arc field ("How your arcs connect"), "Welcome back, reader.", the whole-field/left-off segment. In day the whole page goes paper. | The lens sky with the reader's flower (dark in both moods), "Good afternoon, Preston.", Where you left off, Still reading. | L4 (the sky, dark in day) · L5 (arcs hidden, the greeting with the name) |
| Books (Shelf) | Search box inside the card; Categories/Lenses + Manage; Now · what you're carrying. | Search pill in the header; All/Reading/Will read/Have read chips; Now · 3 books in hand with the question. | L4 (lens mode) · L4b (Search pill) · L5 |
| A book | Values this carries; Add marginalia + Add to an arc + Send to sub-theory (a second gold-outlined button); Edit/More · Find this book; In your thinking; Book Artifact. Status segment reads CURRENTLY READING in capitals and wraps to two lines. | In your lenses chips; What you marked; Your artifact; status segment Reading / Have read / Will read; no arc or sub-theory buttons. | L5 (arcs out, the segment labels) · L4 (lenses) |
| Notebook | A long explainer card; a gold-ball "Yumi reads along" switch; no Search pill, no Settings link; the per-book tab shows the cover and "Your notebook for this book". | One line under the title; Inbox/Journal/book tabs; Catch a thought; Settings link; Search pill. | **L4b (ruling 79)** |
| A note | Title, Edit this note, Where this note lives. | The note in full, Move/Delete, Ask Yumi about this note, Also in this book, Where this note lives with "Open the book". | L6 (capture) · L4b |
| Search | Not walked. | Ruling 45 (labelled pill, scope under the box, one list in three groups). | **L4b (ruling 79)** |
| Lens sheet | Yumi's suggestions list (Name it / Rename / Not this). | The lens page of ruling 46: question, why you keep returning, what you said back; Open lens · Rename · Let it go. | L4 (engine) · **L4b (the lens page, the category page)** |
| Profile (You) | Galaxy with the floating "+"; the Values card; By the numbers with Categories/Lenses. Settings is a section of Profile. | The galaxy in lens mode; Numbers; category bars; Settings is its own page. | L4 (lens mode) · L5 (Settings page, Match my phone) |
| What Yumi Sees | The old reader-model page (Let Yumi build a reader-model · consult the web · speak · hands-free). | "Everything she sees right now": the yes, your shelf, notes she reads along, artifacts, what you said back to a lens. | **L4b (ruling 79)** |
| Settings | Inside Profile; Mood Night/Day; four switches; Save · Sign out. | Own page; Night · Day · Match my phone; Lens colours Garden/Galaxy; the same four switches. | L5 (page + Match my phone) · L4 (lens colours) |
| Capture door | Five labelled mode pills; the text field; MARGINALIA/QUESTION/JOURNAL segment; Inbox picker; File it. | A row of icons; a paper writing field "Write it as you'd say it."; File it beside the book picker. | L6 |
| Scan | The verdict sheet matches the mockup (cover · title · author · Add to shelf · Keep scanning). "Type it in" pill absent. | Rulings 54–62. | Scan lane |
| Yumi's panel | Matches in shape (header, What Yumi sees pill, footer line, mic + field + terracotta send). | Same. | — (F5 only) |

## D. Lane ruling (ruling 79) — L4b, "the Day Three rooms"

No lane in sequence.md owned the Search redraw (r45), the lens page (r46), the category page (r47), the Notebook head, the What Yumi Sees page, or the bottom tabs + Search pill. They are now one lane, **L4b — the Day Three rooms**, placed after L4 (it needs the lens engine) and before L5 (the walk lands on finished rooms). Order now: L1 → L2 → L4 → L4b → L5 → L6 → L7b, with the Scan lane as before. L1.2's docs record the lane in sequence.md; the design chat writes its prompt when L4 closes.

## E. L1.2 shape (ruling 81)

Two commits in one chat, one push, one felt pass: L1.2a (praxis-v3.314: F1–F5 + the arc/sub-theory/commons/reader/walk shared-token sweep of ruling 72) and L1.2b (praxis-v3.315: the flat pass of ruling A). Each stops at its commit gate; push waits for one word after both; the felt pass then covers the twelve routes in both moods plus Search, the not-on-the-list card and the offline font check.
