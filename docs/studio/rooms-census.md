# Praxis rooms census — 14 Nov 2026 (Fable 5.2, the L4b design chat)

Read against `praxis-app` **main at v3.316** (GitHub zip, tree dated 30 Oct 2026; `sw.js:12 CACHE_VERSION = 'praxis-v3.316'`; `assets/theme.css` md5 `b72052969185e8d4536a9fdb1ccc4953`). L2 and L4 are **not** on this tree (no `js/hand.js`, no `css/sky.css`, sixteenth and seventeenth sitting files absent). Line numbers are for this tree only and will drift; the function names are the anchors.

**Status words.** *Redrawn* = a new layout exists in the Style Study or Open Lens 4. *Reskin only* = keeps its structure, takes the new colours through tokens (lane LC1). *Untouched* = not drawn, not ruled for beta, or behind the theory switch. *New* = no route exists yet.

**"In Day Three"** = the room has a paint function in `design/praxis-day-three.html` (the walk's fixture). It is not a claim about which of the seven beats lands there.

## Routes (js/views.js `renderRoute` :396)

| Route | Function (views.js) | In Day Three | Status | Lane |
|---|---|---|---|---|
| `#home` | `renderHome` :1901 | paintHome | Redrawn (sky + "Where you left off" + Still reading + Yumi row; empty state) | L4 sky, then L4b-3, LC2 |
| `#books` | `renderShelf` :4602 (`renderShelfDesk` :5398, `renderShelfCase` :5820, `renderShelfBookRow` :5968) | paintShelf | Redrawn (search, Lenses/Categories, chips, lens bands of large covers; empty state) | L4b-3 |
| `#book/<id>` | `renderBookDetail` :13104 (`renderBookView` :12519) | paintBook | Redrawn (cover on the warm field, status behind the cover, Add a note, lenses, marks, artifact; hold menu) | L4b-3, L4b-4 |
| `#book/<id>/marks` | router redirect to `#book/<id>` (:639) | paintMarks | Untouched (Day Three draws a marks page; live redirects. Ledger M1) | — |
| `#artifact/<bookId>` | `renderArtifact` :15824 | paintArtifact | Redrawn (passage, Edit, Yumi row, "Yumi may read this") | L4b-3 |
| `#notebook` (+ unknown hashes) | `renderNotebook` :2376 (`renderNotebookEntry` :19591) | paintNotebook | Redrawn (one list, kind dots, lens mark, filter chips; empty state) | L4b-3 |
| `#note/<id>` | `renderNoteSurface` :19268 | paintNote | Redrawn (note large, Edit/Move/Delete, Ask Yumi, also in this book) | L4b-3 |
| `#search` | `renderSearch` :1202 | paintSearch | Redrawn (field, four scope chips, Recent, open a lens, live results) | L4b-3 |
| `#profile` | `renderProfilePage` :23691 (sky `.pf-sky` built near :22608) | paintYou | Redrawn as **You** (flower in the sky band, numbers, threads, open questions, rows; empty state) | L4 (sky), L4b-3 |
| `#account` | router redirect to `#profile` (`location.replace`, :765) | paintSettings / paintData | Live keeps Settings (the Night · Day row, action near :23487) and the delete flow (near :23398) **inside** `renderProfilePage`. Redrawn as two pages under You: **Settings** and **Your data**. New routes needed, or sections of `#profile` (ledger N4) | L4b-3 |
| `#yumi-sees` | `renderWhatYumiSeesPage` :20519 | paintSees | Redrawn (the yes, three plain rows, said-back, her portrait) | L4b-3 |
| `#about` | `renderAbout` :24822 | paintAbout | Redrawn (lead, the covenant as rows, where your words go) | L4b-3 |
| `#scan` | `renderScan` :11692 | door mode "Scan" | Reskin only. The capture dial's Scan wedge is its door (ledger N2) | LC1 |
| `#lens/<id>` | **none** (fifteenth r46) | paintLens | **New.** Open Lens, the page (Open Lens 4) | L4b-2 |
| `#category/<id>` | **none** (fifteenth r47) | paintCat | **New.** Category page | L4b-2 |
| `#arcs`, `#arc/<id>` | `renderArcsPage` :4301, `renderArcDetail` :17197 | "open in the next release" | Untouched. They share the day token block (`.arcs.lum-amber-deep, .arcfield`, theme.css :377), so LC1 changes their ink and gold values (ledger C3) | LC1 (measure only) |
| `#subtheory/<id>`, `/build` | `renderSubTheoryPage` :14604, `renderSubTheoryBuild` :14972 | — | Untouched | — |
| `#value/<id>` | `renderValuePage` :19096 | — | Untouched | — |
| `#commons`, `#reader/<uid>`, `#walk/<arcId>` | `renderCommons` :24285, `renderOtherProfile` :24370, `renderInteract` :24489 | — | Untouched | — |
| `#deleted` | `renderDeletedPage` :23460 | — | Reskin only | LC1 |
| `#diag` | `renderShelfDiagnostic` :6638 | — | Untouched | — |
| invite gate (every route when held) | `renderListGate` :1530 | — | Reskin only | LC1 |

## Sheets, panels and chrome

| Surface | Where | In Day Three | Status | Lane |
|---|---|---|---|---|
| Top nav `.app-nav` (Home · Shelf · Arcs · Notebook · Scan · Capture · About · Account, hamburger on mobile) | `index.html` :60–92; `initNavMobileToggle`, `initNavReveal` | paintTabs | **Replaced on phones** by the tab bar Home · Shelf · Notebook · Capture · You + the Search pill (ruling 79). Arcs, Scan and About leave the top level (ledger N1–N3). **L4b-1 built at v3.327 (17 Nov 2026, `docs/checkpoints/l4b-1.md`)**: the bar + the pill on phones, About Praxis as the last row of You; 760+ unchanged | L4b-1 |
| Capture door | `initCaptureDoor` :26317, `capOpen` :25595, `openCaptureDoor` :26530 | doorHtml | Redrawn as **the dial** (five coloured wedges; folds to a chip while typing) | L4b-4 |
| Yumi panel and the Bloom | `js/yumi-ui.js` `openYumiPanel` :1548, `toggleYumiPanel` :1575, `openLensPanel` :2248 | paintYumi | Reskin only (not redrawn this sitting) | LC1 |
| Lens sheet, offer card, say-back, Lenses page | L4 (not on this tree) | paintLensSheets | L4's own; reskinned by LC1, sky by LC2 | L4, LC2 |
| Book hold menu | **none** | — | **New** (press and hold a cover) | L4b-4 |
| Spotlight (⌘K) | `js/spotlight.js` | — | Reskin only | LC1 |
| Intros / first-run | `js/intros.js` | — | Untouched (L5 owns the walk) | L5 |
| "Tell Preston" | row on You | paintFeedback | Not drawn | — |

## What the census changes about the plan

1. **L4b was scoped as "the Day Three rooms in Sunflower". It is now a colour change plus fifteen redrawn rooms.** It cannot be one build. See the lane order in `p2-eighteenth-sitting-rulings.md` §C.
2. **Two routes do not exist yet** (`#lens/<id>`, `#category/<id>`), and the tab bar replaces the phone nav. Those are structure, not paint.
3. **The colours live in one place.** All seventeen Sunflower hex values sit in `assets/theme.css` (blocks at :22, :377, :412) plus five literals: `index.html` :6 and :20, `js/views.js` :23035, `manifest.json` :6–7. `components.css` and `praxis-kit.css` hold none. That is why the colour lane can be a 35-line, byte-neutral change.
