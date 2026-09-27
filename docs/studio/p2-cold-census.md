# P2 OPEN — COLD-ACCOUNT CENSUS

**What this is.** A record of what a genuinely fresh person sees on the live app today —
exact screens, exact copy, exact taps, exact network cost — from the first screen through
a first book, a first note, and a first return. It judges nothing and proposes nothing.
The P2 shaping session is written from it.

| | |
|---|---|
| Run | 2026-09-20, Preston's personal Mac (`~/Desktop/Projects/praxis-app`) |
| Target | **live** `https://praxisreader.com` — `CACHE_VERSION praxis-v3.299` |
| Repo HEAD | `58cd730` · `HEAD == origin/main` · tree clean |
| Account | fresh throwaway, uid `w5NBen…`, created at sign-in during this run |
| Mode | read-only against the app; no code changed; no rig seed/auth stub used |
| Captures | 55 PNGs, ~25 MB, **local only** — `.claude/rig/captures/p2/` |

---

## 0 · RAIL CLASSIFICATION — **(A) SEED LEAK**

The `Still reading` rail on Home counts and displays the **seed workspace's five demo
books as the reader's own**, on an account that owns nothing.

### The measurement, side by side

| Moment | Home `.home-reading-status` | Shelf `.shelf-slim-count` | `state.books` | owned |
|---|---|---|---|---|
| Fresh account, nothing added | **"5 books open right now"** | **"0 books · 0 reading · 0 finished"** | 5 | 0 |
| After adding one book by hand | **"6 books open right now"** | **"1 book · 1 reading · 0 finished"** | 6 | 1 |
| Second device, same account | **"6 books open right now"** | **"1 book · 1 reading · 0 finished"** | 6 | 1 |

Identical at **390** and **1360**. The rail's five titles are the seed's five, verbatim:

1. Zombie Politics and Culture in the Age of Casino Capitalism — Henry Giroux
2. Yearning: Race, Gender, and Cultural Politics — bell hooks
3. Hidden Potential — Adam Grant
4. Range: Why Generalists Triumph in a Specialized World — David Epstein
5. Their Eyes Were Watching God — Zora Neale Hurston

They render as real cover art, **220 px visible above the fold at 390** — no scrolling.
Captures: [10b-home-rendered-390.png](../../.claude/rig/captures/p2/10b-home-rendered-390.png) ·
[10b-home-rendered-1360.png](../../.claude/rig/captures/p2/10b-home-rendered-1360.png) ·
[22-home-1book-390.png](../../.claude/rig/captures/p2/22-home-1book-390.png)

### Mechanism (read at HEAD `58cd730`)

- **`js/views.js:1603` `homeReadingBooks()`** iterates `state.books` — the global catalogue —
  filtering only on `normalizeStatus(b.status) === 'reading'`. **No ownership check.**
  Sole caller `js/views.js:1820`; `grep -c 'homeReadingBooks('` = 2 (definition + 1 call), so
  it is live code, and the live render proves it executes.
- **`js/views.js:4367-4368`** (`renderShelf`) reads `state.userBooks[uid].bookIds`. Correctly scoped.
- **`js/views.js:1700-1701`** (Home's own `hasShelf`) reads `state.userBooks[uid].bookIds`. Correctly scoped.
- **`js/state.js:3360`** — the seeder writes its five books to `stored.books` only, commenting
  that the example *"must not pollute any user's shelf."* All five carry `status: 'reading'`.
  The seeder's protection is bypassed by `homeReadingBooks()` alone.

**Correction to the brief that opened this line of enquiry:** `views.js:1025-1026` is inside
`_searchBuildIndex()` (`function` at `:935`) — the ⌘K search index, not the Shelf. It is also
correctly scoped, so the conclusion is unchanged; the Shelf citation is `:4367`.

### The sharpest statement of it

It is not only Home-vs-Shelf. **It is inside a single render of a single surface.** On the
fresh account, Home's greeting reads **"Welcome to *Praxis.*"** — the new-reader branch, taken
from the correctly-scoped `hasShelf` — and 500 px below it the same surface reads
**"5 books open right now."** One screen, two readers of the same fact, disagreeing.

### The Sept-13 sighting

Explained, and the same event. The seed's five titles were chosen from Preston's own library,
so "6 of my own books" and "the seed leak" are one observation, not two.

### Where else the leak surfaces, and where it does not

Every other surface labels the demo content honestly:

| Surface | Framing | Honest? |
|---|---|---|
| `#arcs` | "Your arcs — **0 arcs**"; the seed arc under "**Arcs to learn from / examples**" | yes |
| `#home` constellation | "**An example field — begin an arc to grow your own**" · "No arcs yet" | yes |
| `#commons` | three cards, all badged "**Example**", "by Praxis"; the seed arc absent | yes |
| Export | "Ready: **1 book**, 0 arcs, 0 photos"; archive contains only the reader's book+note | yes |
| Notebook (tabs/entries) | seed entries never rendered; per-tab counts match data | yes |
| **Home rail** | "5 books open right now" under "Still reading", linking "Your shelf →" | **no** |
| **Capture door destination listbox** | offers all 6 books — the 5 seed ones included — as filing targets for a private note | **no** |
| **`#yumi-sees` (the covenant page)** | lists 2 seed marginalia + 1 seed book artifact as this reader's context | **no** |

The Notebook's own "File to book" picker offers **only** the reader's book. Two pickers for
the same job, two scoping rules.

### The covenant page — recorded in full because of what it promises

`#yumi-sees` states: *"This is everything Yumi sees right now… Yumi does not see anything else."*
Under **RECENT NOTEBOOK ENTRIES** it listed, on this account:

- "First note from a fresh account, P2 census." — *marginalia from Range · 9/20/2026, 5:04:44 PM* (the reader's own)
- "The zombie is the anti-becoming — a public life that consumes and moves but does not think or feel…" — *marginalia from Zombie Politics and Culture in the Age of Casino Capitalism · 9/20/2026, 4:26:04 PM*
- "His \"disimagination machine\" names the systems that make imagining otherwise feel impossible…" — *marginalia from Zombie Politics and Culture in the Age of Casino Capitalism · 9/20/2026, 4:26:04 PM*

and under **RECENT BOOK ARTIFACTS**: "On Their Eyes Were Watching God, and the horizon" —
*Artifact from Their Eyes Were Watching God · 9/20/2026, 4:26:04 PM*.

Two of the three notes, and the artifact, belong to the seed workspace. The 4:26:04 PM stamps
precede the account's existence. Capture:
[29-yumi-sees-390.png](../../.claude/rig/captures/p2/29-yumi-sees-390.png)

This reaches Yumi. Her opening line to this reader (below, §5.7) reads the seed's marginalia
as his.

---

## 1 · PRE-FLIGHT

### 1.1 Governing docs — FOUND / MISSING

| File | State |
|---|---|
| `CLAUDE.md` · `PROTOCOL.md` (v1.2) · `docs/FIX-PROTOCOL.md` (v1.3) · `CRAFT.md` | FOUND, read |
| `.claude/agents/praxis-recon.md` (`model: sonnet`) · `docs/studio/onboarding.md` | FOUND, read |
| `docs/studio/v1-canon-delta.md` | FOUND — context only, **not applied** |
| `docs/studio/v1-recon.md` §5 | FOUND — capture method read |
| `.claude/rig/README.md` · `.claude/rig/seed.js` header | FOUND, read; **rig seed/auth stub not used** (live account) |
| **`docs/studio/onboarding-brief.md`** | **MISSING — confirmed.** Matches the standing `OB-BRIEF-UNLANDED` gap in `onboarding.md` ("does not exist on any branch or in git history") |

### 1.2 Repo + machine

- `git status --porcelain` → one pre-existing untracked file, not from this task: `?? docs/praxis-living-document.html`. No tracked file dirty.
- HEAD `58cd73089ab13929d8dc60d5e502660fb9f998b7` — *"studio: V-1 close — canon delta v1.1 (the sunflower) + sequence line (docs only)"*. After `git fetch origin`, `git rev-list --left-right --count origin/main...HEAD` → `0 0`.
- `Darwin macbook-pro-6.lan 25.5.0 … x86_64`. Chrome **153.0.8010.48**, `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- **Node is absent on this Mac** (not on PATH, not at `/usr/local/bin` or `/opt/homebrew/bin`). `python3` 3.9.6 with no websocket library.

### 1.3 Live reachability — PASS

| Origin | HTTP | `CACHE_VERSION` | bytes |
|---|---|---|---|
| `https://praxisreader.com/sw.js` | 200 | `praxis-v3.299` | 6,041 |
| `https://praxis-reading.netlify.app/sw.js` | 200 | `praxis-v3.299` | 6,041 |

Byte-identical (`cmp` clean) and matching `sw.js:10` at HEAD. The live bundle is the bundle at `58cd730`.

### 1.4 Fresh-profile proof

Read via `Page.addScriptToEvaluateOnNewDocument` — at document-start on the origin, **before a
line of app JS runs**. Both census profiles:

```
{"ls": 0, "lsKeys": [], "ss": 0, "idb": [], "cookie": ""}
```

A third, separate throwaway profile was used to prove the harness, so the census profile's
landing was a genuine first visit.

---

## 2 · THE FRONT DOOR (signed out)

Capture: [00-landing-390.png](../../.claude/rig/captures/p2/00-landing-390.png)

A bare `https://praxisreader.com` lands on route **`#home`**. Everything on screen, in document
order — hit-tested (`checkVisibility` + `elementFromPoint`), not a DOM dump:

| y | element | copy |
|---|---|---|
| 18 | `a.app-nav-wordmark` → `#home` | `praxis` |
| 14 | `button.app-nav-hamburger` | `≡` (aria `Open menu`) |
| 163 | `h2` | **Welcome to Praxis** |
| 220 | `p` | *A place to build theory from your reading — set books side by side into arcs, and keep your marginalia, journal, and questions, with Yumi reading along only ever as much as you allow. Sign in to begin.* |
| 360 | `button.btn.btn-primary` | **Sign in** |
| 799 | `button.cap-create-door` | *(unlabelled)* aria `Capture a thought` |
| 799 | `button.yumi-bloom` | *(unlabelled)* aria `Talk to Yumi` |

**No overlay of any kind.** No "Where today gathers", no journey. Source-consistent:
`intros.js` `maybeShowPanel` returns early while signed out.

**The `Still reading` rail does NOT render signed out** — `.home-glimpse` is not in the DOM at
all. `renderHome()` early-returns at `views.js:1657-1663` to the signed-out prompt before the
rail is built. **So the leak does not predate sign-in at the surface.** But the fuel is already
loaded: at that same moment `state.books` = **5** (the seed self-seeds into a brand-new origin)
and `state.userBooks` = `{}`.

Nav, in DOM behind the hamburger (one tap reveals all): Home `#home` · Shelf `#books` ·
Arcs `#arcs` · Notebook `#notebook` · Scan `#scan` · Capture `#` · About `#about` ·
Account `#profile`. Plus the ⌘K search field.

localStorage after landing — 6 keys: `praxis_user` (literal value `"null"`),
`praxis_m_activated`, `praxis_m_counts`, `praxis_state_anon`, `praxis_yumi_hand`,
`praxis_m_first_seen`.

### 2.1 Taps to the Google prompt: **1**

One tap on `Sign in` opens the Google popup directly (`accounts.google.com/v3/signin/identifier`,
title *"Sign in - Google Accounts"*). **No refusal** — scanned for every "browser may not be
secure" variant; none present. Its copy: `Sign in with Google` / `Sign in` /
**`to continue to praxis-b25d6.firebaseapp.com`** / `Email or phone` / `Forgot email?` / `Next` /
`Create account`. The consent screen names the Firebase project id, not Praxis.
Capture: [02-google-prompt.png](../../.claude/rig/captures/p2/02-google-prompt.png)

### 2.2 Network, landing → before any tap

**48 requests. 5 hit `/.netlify/functions/`** — `google-books-proxy` ×5, all 200 — alongside
5 × `openlibrary.org/api/books` → **404**, for ISBNs `9781433127199`, `9781138821750`,
`9780593653142`, `9780735214507`, `9780061120060`: the five seed ISBNs exactly.

**A stranger who lands and never signs in costs five Netlify function invocations**, all of
them cover lookups for books that are not theirs. The sign-in tap itself adds 5 requests
(gapi, the Firebase auth iframe, identitytoolkit) and **zero** function calls.

---

## 3 · FIRST LANDING SIGNED IN, AND THE FIRST-RUN INVENTORY

### 3.1 What actually happens at the instant of sign-in

Route is `#home`. **Home is not what you see** — the 8-beat first-run journey fires immediately
and covers the viewport at both widths.
Captures: [10-home-fresh-390.png](../../.claude/rig/captures/p2/10-home-fresh-390.png) ·
[10-home-fresh-1360.png](../../.claude/rig/captures/p2/10-home-fresh-1360.png)

**FINDING 1 — the surface underneath the journey is the *signed-out* Home.** Probing `#app`
beneath the overlay: `hasHomeComposed: false`, `hasSignedOutEmpty: true`,
`emptyHeadline: "Welcome to Praxis"`, text ending *"Sign in to begin. | Sign in"*.

Confirmed live: tapping beat 1's escape hatch **"I'll explore on my own"** dropped a signed-in
reader (`firebase.auth().currentUser` non-null, uid `w5NBen…`) onto that signed-out prompt,
with a live **Sign in** button — and the "Where today gathers" intro card mounted below it,
telling a reader with zero notes *"Yesterday you marked Freire on 'banking education.'"*
Capture: [12-escape-landing-390.png](../../.claude/rig/captures/p2/12-escape-landing-390.png)

**Mechanism — a deterministic branch gap, not a race.** Every `renderRoute()` in the signed-in
auth path sits inside a `status === 'found'` branch of a Firestore loader
(`js/integrations.js:662`, `:699`); `maybeStartOnboarding` at `:684` fires unconditionally
(`profResult.status !== 'error'`). On a **first-ever sign-in** every loader returns `absent`,
so **zero renders fire while the journey still mounts**. The comment at `:722-728` states the
design: *"Signed-IN branch deliberately left untouched — its loader callbacks already drive the
render."* They drive it only when a remote doc already exists.
`closeJourney()` then removes the overlay and calls `panelForHash()`, never `renderRoute()`.

**Falsification test, run:** on the **second device** (§6.2), where the remote docs now exist,
the same sign-in rendered Home signed-in correctly. The failure is specific to the first-ever
sign-in. Recorded as observed; a race would be timing-dependent and this is not.

### 3.2 First-run inventory — every behaviour that fires on a fresh account

| # | Behaviour | Fired | Evidence |
|---|---|---|---|
| 1 | **8-beat first-run journey** (`intros.js` `JOURNEY`, via `yumi-ui.js:885` `maybeStartOnboarding`) | **yes**, immediately at sign-in | dots `Step 1`…`Step 8` |
| 2 | R8 values beat | yes — beat 4 of the journey | below |
| 3 | `intros.js` per-page panels (12 registered ids) | **suppressed while the journey is open**; armed on its close | `.intro-panel-wrap` absent during, present after |
| 4 | "Welcome back, reader" copy on a first visit | **no** — correctly showed "Welcome to *Praxis.*" | `hasShelf` false |
| 5 | Flags the app writes itself | `praxis_state_<uid>` on sign-in; `praxis_intro_<id>` one per panel shown; `profile.onboardingSeen` on journey close | localStorage + profile |
| 6 | Yumi chat greeting | replaced by the journey (same gate) | `yumi-ui.js:884-890` |

**The journey, beat by beat** (walked with `Continue` only — `onNext` never gates on a choice,
so nothing was declared; verified after: `stance:null · values:0 · entries:0 · owned:0 · onboardingSeen:false`):

| Beat | kind | Headline | Primary |
|---|---|---|---|
| 1 | `welcome` | **Welcome to *Praxis*.** / "Reading that stays with you — books, margins, and the theories they grow into." / "I'm Yumi. In a moment we'll take your first steps together — doing, not touring." | `Continue` · `I'll explore on my own` |
| 2 | `covenant` | **Nothing hidden.** "Three terms, before anything else." — *Yumi sees only what you allow* · *Memory is yours to grant* · *Your words stay yours* | `Continue` |
| 3 | `stance` | **How should *Yumi* begin?** — Press me / Keep me company / Stay out unless asked | `Decide later` |
| 4 | `values` | **What do you read toward?** — 10 chips (Liberation · Power, named · Dignity · Solidarity · Care · Doubt · Praxis · Inheritance · Hope · Craft) + "…or name your own" | `Skip for now` |
| 5 | `act-shelf` | **ACT ONE · YOUR SHELF — Bring your first book.** | `Skip this act` |
| 6 | `act-margin` | **ACT TWO · THE MARGIN — Leave one honest note.** | `Skip this act` |
| 7 | `act-sees` | **ACT THREE · WHAT SHE SEES — Read the covenant yourself.** | `Continue` |
| 8 | `release` | **The rest, you'll find by walking.** | `Enter Praxis` · `Retake the walk` |

Captures 11 · 11b · 11c · 11d · 11e (beats 1–5) and 16a–16e (beats 5–8, from the retake, §5.9).

**The escape hatch appears on beat 1 only.** From any later beat there is no exit but walking
or stepping back. And the journey's acts are where a fresh reader's first book and first note
actually happen — `#8 release` routes to `#book/<id>` if a book was shelved during the walk,
else `#notebook`; **never to Home**.

---

## 4 · THE FOUR MOVED PREMISES

### 4.1 SCAN — 2 taps from fresh Home (hamburger → `Scan`)

Camera permission state at arrival: `prompt` (**not granted**). One `<video>` element,
`srcObject: false`, `readyState: 0`. The no-camera state is a designed screen, verbatim:

> ◲
> **Turn on the camera to scan**
> Praxis reads the book right on your phone. Images leave only as identification requests — nothing is stored, on your device or ours.
> `Turn on camera`  ·  `Add without the camera`

A real fallback exists. Captures:
[13a-menu-390.png](../../.claude/rig/captures/p2/13a-menu-390.png) ·
[13-scan-390.png](../../.claude/rig/captures/p2/13-scan-390.png)

### 4.2 CAPTURE — visible on fresh Home, **1 tap**

`button.cap-create-door` (aria `Capture a thought`), bottom-left FAB. Opens the "Catch a
thought" sheet. Contents, verbatim: eyebrow **Catch a thought**; modes `✎ Note` · `🎙 Voice` ·
`⭳ Paste/Import` · `📷 Photo` · `▤ Scan a book`; a `textarea` placeholder *"Write a note…"*;
registers `Marginalia` · `Question` · `Journal` (`data-r`, `aria-pressed`, **Marginalia default**);
destination chip `Inbox ▾`; *"nothing caught yet this session"*; `File it`.

Also present: a control whose visible text is **"arrives with the YG round"** (aria
*"Talk it through"*) — copy naming an unbuilt round, on a door a first-run reader can reach in
one tap. Capture: [14-capture-390.png](../../.claude/rig/captures/p2/14-capture-390.png)

### 4.3 LENSES — present on a 0-book account, inert

A `Categories | Lenses` segmented control on the Shelf. Toggling to `Lenses` changes
`is-on` and **nothing else**: the same zero-state renders, word-for-word. One occurrence of
"lens" in the whole rendered body; zero nav links. With one book, the Shelf reads
*"no lenses yet — Yumi can suggest some from what you're reading."*
Capture: [15b-lenses-390.png](../../.claude/rig/captures/p2/15b-lenses-390.png)

### 4.4 SEED ARC "A Pedagogy of Desire"

| Surface | Present | Framing |
|---|---|---|
| `#home` | yes, in "How your arcs connect" | *"An example field — begin an arc to grow your own"* + *"No arcs yet"* |
| `#arcs` | yes, under "**Arcs to learn from**" / eyebrow "examples" | Your arcs = "**0 arcs**"; card reads "A Pedagogy of Desire · 4 sub-theories · bright · touched today" |
| `#commons` | **no** | three arcs, all badged "Example", "by Praxis" |

All three honest. Note the arc card says "touched today" on a brand-new account, and the Arcs
empty state's create tile reads "**Start another arc**" with zero arcs owned.
Captures: [15-arcs-fresh-390.png](../../.claude/rig/captures/p2/15-arcs-fresh-390.png) ·
[15c-commons-390.png](../../.claude/rig/captures/p2/15c-commons-390.png)

---

## 5 · THE WALK

Book named by Preston: **Range — David Epstein**. Note text, exact:
`First note from a fresh account, P2 census.`

> **Note on the book chosen:** "Range: Why Generalists Triumph in a Specialized World" by David
> Epstein is **seed book #4**. This made the hand-add a dedupe test as well. It did not dedupe —
> see 5.1.

| # | Beat | Taps | Wall | `/.netlify/functions/` | Capture |
|---|---|---|---|---|---|
| 5.1 | Add Range by hand, Home → shelved | **5** | ~17 s | 1 × `google-books-proxy` | [20b](../../.claude/rig/captures/p2/20b-addbook-door-390.png) · [21](../../.claude/rig/captures/p2/21-addbook-filled-390.png) |
| 5.2 | Shelf with one book | 0 | — | 0 | [21-shelf-1book-390](../../.claude/rig/captures/p2/21-shelf-1book-390.png) · [-1360](../../.claude/rig/captures/p2/21-shelf-1book-1360.png) |
| 5.3 | Note filed to the book | **6** | ~20 s | 0 | [23c](../../.claude/rig/captures/p2/23c-note-ready-390.png) · [24](../../.claude/rig/captures/p2/24-notebook-after-note-390.png) |
| 5.4 | Arcs with one book | 0 | — | 0 | [25](../../.claude/rig/captures/p2/25-arcs-1book-390.png) |
| 5.5 | Profile / Account | 0 | — | 0 | [26](../../.claude/rig/captures/p2/26-profile-390.png) |
| 5.6 | Commons signed-in | 0 | — | 0 | [27](../../.claude/rig/captures/p2/27-commons-signedin-390.png) |
| 5.7 | Yumi panel + 1 message | **3** | 14 s | **5 × `claude-proxy`** | [28](../../.claude/rig/captures/p2/28-yumi-panel-390.png) · [28c](../../.claude/rig/captures/p2/28c-yumi-reply-390.png) |
| 5.9 | Journey retake, beats 5–8 | 9 | ~30 s | 0 | [16a](../../.claude/rig/captures/p2/16a-retake-b5-actshelf-390.png)–[16e](../../.claude/rig/captures/p2/16e-retake-release-landing-390.png) |

### 5.1 ADD BY HAND

Path: Home → `Your shelf →` (1) → `＋ Add a book` (2) → title field (3) → author field (4) →
`Save` (5).

**The door is a manual form, not a title search.** Fields: `Title`, `Author (optional)`, status
radios (`Currently reading` **default** / `Have read` / `Will read`), `ISBN (optional)`,
`Save` / `Cancel`. Typed `Range` / `David Epstein`.

On Save: metadata resolved — ISBN `9780593084496`, cover from `books.google.com`. The Shelf
re-rendered to **"1 book · 1 reading · 0 finished"** and showed the book once.

**No dedupe against the seed.** `state.books` went 5 → 6; the reader's Range is a separate
record with a different ISBN from the seed's Range (`9780735214507`). Consequence: the Home
rail now lists **"Range" twice** — the seed's long title and the reader's short one.

### 5.2 SHELF with one book

Copy on the zero-state, before the add: *"Your shelf is open — add your first book: scan a
spine, search a title, or paste a whole list."* Controls: search (`Search your shelf…`),
`Categories | Lenses`, `Manage`, `＋ Add a book` (twice — header and empty state), a `Now`
section with *"Tap to carry a question."*

**Rendered count equals stored count** at every reading: 1 row, "1 book".

### 5.3 NOTEBOOK — one note, filed to the book

On a fresh account the Notebook offers **two tabs only — `Inbox 0` · `Journal 0`**; a book tab
appears only once a note is filed to that book. Door: `✎ Catch a thought… / type · dictate ·
paste · photo`. Master toggle **"Yumi reads along" is ON by default** (aria `Yumi reads along: on`).

Registers offered: **Marginalia** (default, `aria-pressed="true"`) · Question · Journal.

The capture door's destination chip (`Inbox ▾`) opens a `role=listbox` of **7 options — Inbox
plus all 6 books in `state.books`, the 5 seed books included.** The box is 252 px tall,
mounted at `top: 735` in an 844 px viewport: **109 px visible, 3 of 7 options below the fold.**

Selecting a book there did not change the chip, and the note filed to **Inbox**, unattached.
It was then attached through the Notebook's own path — entry `⋯` → `File to book` → `Range`.
That picker offers **only the reader's own book**.

**The "File to book" picker mounts with `pixelsVisible: 0`** — `.book-picker-panel` at document
offset 900 while the viewport showed 1243–2087. It is a second instance of the specimen already
recorded in `CLAUDE.md` (§ Verification, "T3 PROVES THE CALL SITE EXECUTES…"): a panel that
opens correctly, contains the right options, and is not on screen.

Final state: **1 entry**, register `marginalia`, `filed: true`, `bookIds: [Range]`.
Notebook tabs: **`Inbox 0` · `Journal 0` · `Range 1`**. Rendered counts match stored.

### 5.4 ARCS with one book

"Your arcs — **0 arcs**", sort segment `Recent | Name | Maturity`, create tile
"**Start another arc**", then "Arcs to learn from / examples" carrying the seed arc. Teaching
copy: *"An arc is a path you build through your reading — books from any tradition, set side by
side, so they speak to each other."*

### 5.5 PROFILE / ACCOUNT

`scrollHeight` **4,887 px** at 390. Above the fold: avatar `P`, display name, and
`preview as visitor →`. A `Your thesis` field. Section headings found:
"Let Yumi remember what you explore?" and "What Yumi remembers about you". The galaxy renders
with one book and zero arcs. `Export my data` sits at document offset **4,641** — the bottom.
The intro panel "A portrait, not a scoreboard" fired here.

### 5.6 COMMONS signed-in

*"the commons / **The commons** / Arcs readers have published. A finite field — turn it to draw
a new handful."* + `Turn the field`. Four cards: three badged **Example**, "by Praxis"
("The Hidden Curriculum of the Bell Schedule", "What a Question Is For", "Reading as Rehearsal"),
each *"tended 79 days ago · 0 walks"*; plus one unbadged, **"New Arc" by Roland Blair** — a real
published arc by another reader, which is what the commons is for.

### 5.7 YUMI — **FINDING 2: the first message gets no reply, silently**

Opening the panel: greeting `.yumi-greeting` — *"It is nice to be in your presence today."*
Sub-header *由美 · reasoned beauty*; footer note *"She'll never tell you what to think. The
thread is yours to take where you want."* Opening the panel fired **2 `claude-proxy` calls**,
which replaced the greeting with an opening move:

> "I notice a thread running through your notes — the self that is always in the process of
> becoming, and the forces, manufactured or structural, that try to stop that becoming before it
> starts. Where do you think that preoccupation comes from for you?"

**That is a reading of the seed workspace's marginalia** (Giroux's "disimagination machine",
hooks's "homeplace", becoming) on an account whose only note reads *"First note from a fresh
account, P2 census."* — the §0 leak, reaching Yumi's context assembly through `#yumi-sees`.

The one permitted message, `What do you see?`, was sent. It fired **3 more `claude-proxy`
calls**. **All five returned HTTP 200**, bodies 579–874 B, durations 1.2–4.5 s. **No reply ever
rendered.** No thinking indicator, no error, no toast, console clean; checked at t+0, +10, +25 s.
The transcript ends with the reader's own message, unanswered. The backend answered and the
client dropped it.

### 5.9 THE RETAKE (beats 5–8, copy only)

Reached from About → **"Retake the walk"** (`.intro-retake`). Beats 1–4 stepped past; 5–8
recorded without shelving or keeping anything.

- **Beat 5 `act-shelf`** — *"ACT ONE · YOUR SHELF / Bring your first book."* Panel labelled
  "Your shelf / THE REAL SURFACE" reads **"Nothing gathered yet. / Your first book arrives the
  moment you answer her."** Yumi, in cyan: *"What are you reading right now — or what's been
  waiting for you?"* / *"Her question is the act — answering it shelves the book."* Chips:
  `Pedagogy of the Oppressed` · `Teaching to Transgress` · `Empire of AI`; field
  *"…or type any title"*; `Shelve it`.
  **The three chips are static strings** — `js/intros.js:251-253`, literal `chips: [...]` — not
  account data.
  **The retake does not respect the existing shelf:** Range was already shelved and the beat
  still said "Nothing gathered yet."
- **Beat 6 `act-margin`** — *"ACT TWO · THE MARGIN / Leave one honest note."* Panel "Your first
  book · margins / THE REAL SURFACE / THE PAGE". Registers offered: **MARGINALIA** / **JOURNAL**
  (no Question). Field *"one honest sentence…"*, button `Keep this note`. Prompt: *"Open anywhere
  — the passage that made you stop, the sentence you argued with."* / *"A sentence is plenty. Why
  this book — why now?"* / *"Marginalia sits beside the text · Journal sits beside your life."*
  Likewise did not acknowledge the note already filed.
- **Beat 7 `act-sees`** — *"ACT THREE · WHAT SHE SEES / Read the covenant yourself."* Four rows:
  *Your shelf* — **VISIBLE**; *Your margins* — **VISIBLE**; *Reading activity* — **VISIBLE**;
  *Memory — the reader's model* with chips `LEAVE OFF` / `TURN ON`. Copy: *"What I can read is
  exactly this list, nothing more. Memory stays off until you say otherwise."* / *"A setting, not
  a speech — change it here any time."*
  **What declining looks like: nothing.** `leave off` already carries `is-on`; declining is the
  default and the affirmative tap is a visual no-op. `profile.yumiReaderModel` was `false`
  before and after. (The profile key is `yumiReaderModel`; there is no `memoryOptIn`.)
- **Beat 8 `release`** — *"The rest, you'll find by walking. / Your shelf has its first book. Its
  margin has your first thought. Every other room introduces itself when you first enter — and
  every introduction lives in About, forever. / I'm in the corner when you want me."*
  `Enter Praxis` · `Retake the walk`.
  **It asserts both acts as done regardless** — this run skipped both and was told its shelf had
  its first book and its margin its first thought.

Release routed `#about` → **`#notebook`** (not `#book/<id>`: `picked.bookId` is null when
nothing was shelved *in that walk*), landing on the `Range` tab showing *"Range / David Epstein /
Currently reading · 1 note / Your notebook for this book"*. `onboardingSeen` → `true`.
**No data was duplicated by the retake:** 1 book, 1 note before and after.

---

## 6 · THE RETURN

### 6.1 New tab, same profile

Closed every `praxisreader.com` tab, opened a new one, navigated.
Capture: [30-return-same-profile-390.png](../../.claude/rig/captures/p2/30-return-same-profile-390.png)

| Question | Answer |
|---|---|
| Still signed in? | **yes** — uid `w5NBen…`, `firebase.auth().currentUser` non-null |
| Greeting | **"Welcome back, reader."** (`hasShelf` now true) |
| Book there? | **yes** — Range |
| Note there? | **yes** — filed to Range, body verbatim |
| First-run behaviours re-firing? | **none.** Journey absent, no intro panel; 6 `praxis_intro_*` flags already consumed (home, shelf, notebook, sees, profile, commons); `onboardingSeen: true` |
| Network | 49 requests, **0** function calls |

**Home rendered signed-in correctly this time** — the first corroboration of §3.1's mechanism.
The rail still read **"6 books open right now"**: the leak persists across sessions.

### 6.2 Second device — a new, empty profile, same account

Fresh `--user-data-dir`, proven empty at document-start (`ls 0 · idb [] · ss 0 · cookie ""`).
Capture: [31-return-new-device-390.png](../../.claude/rig/captures/p2/31-return-new-device-390.png)

| Question | Answer |
|---|---|
| Still signed in? | signed in at the prompt; uid `w5NBen…` from both `getCurrentUser()` and `firebase.auth().currentUser` |
| Greeting | **"Welcome back, reader."** |
| Book there? | **yes** — Range |
| Note there? | **yes** — filed to Range |
| Journey? | **no** — as expected: `onboardingSeen` is `true` in Firestore, so the gate never opens on any later device. What shows instead is the ordinary signed-in Home |

**This is the falsification test for FINDING 1, and it passes.** On this device the remote docs
already exist, the loaders return `found`, `renderRoute()` fires, and Home rendered signed-in
immediately — no stale signed-out prompt. The first-sign-in failure is a branch gap, not a race.

**A second, related observation on this device:** `praxis_intro_*` was empty, yet **no intro
panel fired on the landing surface** (`#home`). The first hashchange (`#books`) fired
"The shelf is the spine" and wrote `praxis_intro_shelf`; returning to `#home` then fired "Where
today gathers". `initPanels` runs its check before auth settles, `maybeShowPanel` returns early
while signed out, and it only re-runs on `hashchange` — so **on every new device the landing
surface's introduction is skipped**, silently, without consuming its flag. Same family as
FINDING 1: first-run UI gated on an auth state that arrives after the check.
Capture: [31b-return-new-device-home-390.png](../../.claude/rig/captures/p2/31b-return-new-device-home-390.png)

---

## 7 · EXPORT — **PASS** (both formats)

Door: Account → **`Export my data`**, at document offset 4,641 of a 4,887 px page (scroll to
bottom, then 1 tap). It is **two-step**: the first tap builds and reports, the button becomes
`Save the archive`, and a second tap downloads.

Status line after step 1:
> *"Ready: 1 book, 0 arcs, 0 photos · praxis-export-2026-09-20.zip (4 KB). Tap Save to keep it."*

Correctly scoped to the reader — **1 book, not 6.** It counts books, arcs and photos but
**never counts notes**, though the standing copy promises *"every book, arc, sub-theory, note,
photo and value mark, as one archive — a complete praxis.json plus readable Markdown."*

After step 2: *"Saved praxis-export-2026-09-20.zip to your downloads. Export again any time —
the archive is a snapshot of right now."*

Archive (4,449 B) — `README.md` (657 B) · `books/Range.md` (171 B) · `notebook.md` (113 B) ·
`praxis.json` (2,985 B) · `profile.md` (11 B).

| Check | Result |
|---|---|
| JSON contains the one book | **PASS** — `collections.userBooks.books[book_…]` → title `Range`, author `David Epstein`, ISBN `9780593084496`, `status: reading`, cover URL |
| JSON contains the one note | **PASS** — `collections.userNotebook.notebookEntries[entry_…]` → `body` verbatim, `register: marginalia`, `filed: true`, `bookIds: [book_…]` (Range) |
| Markdown bundle offered | **PASS** — `books/Range.md` and `notebook.md` both carry the note verbatim, with its book attribution |
| Scoping | **PASS** — no seed books, no seed notes, no seed artifact |

`praxis.json` top-level keys: `format` (`praxis-export`) · `version` (1) · `schemaVersion`
(`1.30.0`) · `exportedAt` · `exportedAtIso` · `uid` · `email` · `collections` (8:
userBooks, userArcs, userNotebook, userSubTheories, userThemes, userArtifacts, userProfiles,
userReaderModel) · `published` (0) · `publicProfile` (null). The archive contains the account's
full uid and email address in `praxis.json` and `README.md` — correct for a personal export,
noted here because the file is a plaintext download.

Saved to the scratchpad only. **Not** copied into the repo.

---

## 8 · CAP ACCOUNTING

Authoritative: the page never reloaded between the signed-out landing and the end of §5, so
`performance.getEntriesByType('resource')` covers the whole session in one log.

**11 Netlify function calls, all HTTP 200.**

| Function | Calls | When |
|---|---|---|
| `google-books-proxy` | **6** | 5 at t≈1 s — **signed out**, cover lookups for the five seed ISBNs; 1 at t≈2,214 s for the hand-added Range |
| `claude-proxy` | **5** | 2 at t≈2,841–2,845 s — **opening the Yumi panel** (the opening move); 3 at t≈2,878–2,884 s — **the single message**, which never produced a reply |

Which beats fired them: the signed-out landing (5), the hand-add (1), opening Yumi (2), one
message to Yumi (3). Sign-in, the journey, the retake, the note, all navigation, the return and
the export fired **zero**.

Other hosts over the same session: `firestore.googleapis.com` 56 · `books.google.com` 52 ·
`praxisreader.com` 38 · `openlibrary.org` 5 (all 404) · `identitytoolkit.googleapis.com` 3 ·
`www.gstatic.com` 3 · `apis.google.com` 2 · `fonts.googleapis.com` 1. **161 requests total.**

Two things a cap conversation will want: a stranger who never signs in still costs 5 function
invocations, and one Yumi message costs 3 proxy calls (5 counting the panel-open) — here, for
no delivered answer.

---

## 9 · METHOD AND LIMITS

### 9.1 The 2026-09-19 halt, recorded as fact

A first attempt at this census on **2026-09-19** from the district Windows laptop **halted at
Stage 0**: that machine cannot reach `praxisreader.com` or `praxis-reading.netlify.app` on any
network. This run was executed on Preston's personal Mac, where both origins return 200 (§1.3).

### 9.2 Instruments

Rebuilt from the method in `docs/studio/v1-recon.md` §5, which used a PowerShell WebSocket CDP
client on Windows. Neither PowerShell, Node, nor a Python websocket library exists on this Mac,
so the harness is a **pure-stdlib Python 3.9 CDP client** implementing RFC 6455 client framing
on a raw socket. It lives in the session scratchpad only, never under the repo.

- Chrome **153.0.8010.48**, launched with `--remote-debugging-port` and a fresh `--user-data-dir`
  only — **no `--headless`, no `--enable-automation`** — so the window was visible and ordinary
  for Preston's two interactive sign-ins.
- `Emulation.setDeviceMetricsOverride`: **390×844 @ dpr 2, `mobile: true`** (+ touch emulation,
  5 points) and **1360×900 @ dpr 1, `mobile: false`**. `clientWidth` was read back at every
  measurement; every figure in this report was taken at a proven viewport.
- `Page.captureScreenshot`, viewport-height, `captureBeyondViewport: false`.
- `Runtime.evaluate` for all readings; `Input.dispatchMouseEvent` / `Input.insertText` for all
  interaction. **Every proof in this report is UI-driven** — no app function was invoked directly
  to produce a result.
- `Network` domain per beat, plus the Performance API for the whole-session total (§8).
- **Harness note:** Chrome 153's DevTools endpoint answers the WebSocket upgrade with a
  `Sec-WebSocket-Accept` that does **not** match the RFC 6455 computation — verified
  independently with `shasum` on 2026-09-20 (our value is the RFC-correct one; Chrome's differs).
  The handshake is validated on the `101` upgrade and on frame exchange instead. This is a
  localhost debug socket, so the accept value carries no security role here.

### 9.3 Visibility standard

"On screen" in this report means **hit-tested**: `Element.checkVisibility({checkOpacity,
checkVisibilityCSS})` **and** a viewport-intersecting rect **and** `document.elementFromPoint` at
the element's centre returning that element or its descendant. An earlier, weaker probe (own
computed style only) over-counted — it reported a closed capture sheet and an invisible toast as
visible. Every visible-copy list here was re-taken with the stronger test. Where a thing is in
the DOM but not on screen, this report says so with its pixel count (§5.3).

### 9.4 The per-beat viewport override

The CDP metrics override lives on the DevTools session, so it clears when the harness
disconnects between beats. It is re-applied at the top of every beat and `clientWidth` verified,
so every capture and measurement was taken at a proven 390 or 1360; the window reverted to its
natural size in the gaps, which is what made the Google sign-in flow ordinary. Ruled and
approved by Preston before Stage 1.

### 9.5 Capture provenance

**55 PNGs, ~25 MB, all taken fresh on 2026-09-20 against the live bytes at
`CACHE_VERSION praxis-v3.299`,** at the stated viewports. None is reused from an earlier round.
They live at `.claude/rig/captures/p2/` on this machine and are **local-only, never staged,
regardless of size** — they show a real account.

> **Hazard worth recording:** `.gitignore` ignores `.claude/*` then negates `!.claude/rig/`, so
> this directory is **not** ignored and these PNGs are stageable. The commit for this work stages
> `docs/studio/p2-cold-census.md` and nothing else.

Two captures were renamed mid-run to avoid a collision between the prompt's `31-` (the return)
and the export screens, which became `40-export-door-390.png` / `40b-export-after-390.png`.
Journey beats use `11-`/`11b`–`11e` and `16a`–`16e` so as not to collide with the prompt's
`13-`/`14-`/`15-` names for §4.

### 9.6 What could not be measured, and what to distrust

- **The first-sign-in render failure was diagnosed after the fact.** The harness connected
  after Preston signed in, so the Firestore reads and console lines from that instant were not
  captured live. The branch-gap reading rests on source (`integrations.js:662`, `:684`, `:699`,
  `:722-728`), on `state.profiles` being empty at the first probe, and on the second-device test
  (§6.2) behaving differently once the remote docs existed. Timing of the individual loader
  callbacks at that first sign-in is **not** in evidence.
- **One Yumi message only.** FINDING 2 rests on a single send. It is not known whether a second
  message would also fail, whether the failure is deterministic, or what the 200 responses
  contained — reading the response bodies would have needed the Network domain attached before
  the send.
- **The capture door's destination selection was exercised once** and did not take (the chip
  stayed `Inbox ▾`). Since the listbox was mostly below the fold, a missed tap cannot be ruled
  out. What is solid: the listbox's **contents** (7 options, 5 of them seed books) and its
  geometry, both read from the DOM. The failure-to-select is reported as observed, not as a
  confirmed defect.
- **No arc was created**, per the brief, so nothing downstream of an arc was exercised.
- **Camera was never granted**, so only the pre-permission scan state is recorded.
- **One device, one browser, one platform.** Font resolution is macOS-specific.
- **Instrumentation errors made during the run, and their consequences** — recorded because they
  shaped the data:
  1. The notes collection was probed as `state.entries`; it is **`state.notebookEntries`**, and
     entries carry `body` + `bookIds[]`, not `text` + `bookId`. A successful file-it read as a
     failure, so the step was repeated and a **duplicate note** was created. It was found,
     deleted through the app's own two-step confirm, and the survivor re-filed. The account
     ended with exactly one note, as specified. **The duplicate was mine, not the app's.**
  2. The delete control was nearly reported as dead before source showed it to be a deliberate
     two-step confirm (`views.js:19389-19400`: `Delete` → `confirm delete` / `cancel`). It works.
     No such claim reached a finding.
  3. A side-effectful script was re-run once to read its output tail. It crashed before its
     first capture and landed no taps — verified against both the live state (still beat 5,
     0 books, 0 entries, `onboardingSeen:false`) and the capture timestamps. No data was
     consumed.
- **Everything above is one account's experience on one day.** It is a census, not a sample.

---

## 10 · WHAT P2 SHAPING MUST ADDRESS (facts only)

1. **The Home rail counts the global catalogue, not the reader's shelf.** `homeReadingBooks()`
   (`views.js:1603`) has no ownership filter, while `renderShelf` (`:4367`) and Home's own
   `hasShelf` (`:1700`) do. A fresh account reads "5 books open right now" against a shelf of 0,
   and "6" against a shelf of 1, at 390 and 1360, on first visit, on return, and on a second
   device. Classification **(A) SEED LEAK**.

2. **The same leak reaches the covenant page and Yumi.** `#yumi-sees` — which states "this page
   lists exactly what Yumi can read — nothing more" — listed two seed marginalia and one seed
   book artifact as this reader's context, stamped before the account existed. Yumi's opening
   move to the reader was a reading of those seed notes. The capture door's destination listbox
   likewise offers all five seed books as filing targets for a private note, while the
   Notebook's own picker offers only the reader's book.

3. **A first-ever sign-in leaves the signed-out screen painted.** Every `renderRoute()` in the
   signed-in auth path is inside a `status === 'found'` branch; a brand-new account returns
   `absent` from every loader, so nothing re-renders, while `maybeStartOnboarding` fires
   unconditionally and mounts the journey over the stale surface. Taking beat 1's
   "I'll explore on my own" lands a signed-in reader on "Sign in to begin" with a live Sign in
   button. Confirmed not a race: the same sign-in on a second device, with the remote docs
   present, rendered correctly.

4. **The first message to Yumi produced no reply and no error.** Five `claude-proxy` calls, all
   HTTP 200 with non-empty bodies; nothing rendered; console clean. The reader is left looking
   at their own unanswered question.

5. **The prompt's assumed first-book path is not the app's.** A fresh reader's first book and
   first note live inside journey beats 5 and 6; release routes to `#book/<id>` or `#notebook`,
   never Home. The Shelf's hand-add door is a **manual form**, not a title search, and does not
   dedupe — adding "Range" to an account whose catalogue already held the seed's "Range" put the
   title on the Home rail twice.

6. **The journey does not know what the account already holds.** On retake with a book shelved
   and a note filed, beat 5 still says "Nothing gathered yet / Your first book arrives the moment
   you answer her", beat 6 still says "Leave one honest note", and beat 8 asserts "Your shelf has
   its first book. Its margin has your first thought" — which it says even when both acts are
   skipped. Beat 5's three suggested titles are static strings (`intros.js:251-253`), not
   account data.

7. **On every new device the landing surface's introduction is silently skipped.** `initPanels`
   checks before auth settles and only re-runs on `hashchange`, so the flag is never consumed and
   the panel simply never appears for the surface the reader lands on.

8. **Declining memory is indistinguishable from doing nothing.** At beat 7, `leave off` already
   carries `is-on`; the decline is the default and the affirmative tap is a visual no-op.
   Meanwhile "Yumi reads along" is **ON by default** on the Notebook.

9. **Copy naming unbuilt behaviour is reachable in one tap from a fresh Home.** The capture
   door carries a control reading **"arrives with the YG round"**. The Arcs zero-state create
   tile reads "Start another arc" with zero arcs owned, and the seed arc card reads "touched
   today" on a brand-new account.

10. **Lenses exist as a control and do nothing on a 0-book account.** The `Categories | Lenses`
    toggle flips its own state and renders identical content.

11. **Two panels open where the reader cannot see them.** The Notebook's "File to book" picker
    mounts at **0 pixels visible**; the capture door's destination listbox shows 109 of 252 px,
    with 3 of 7 options below the fold. Both are the specimen already named in `CLAUDE.md`.

12. **Cost, for the record.** A stranger who lands and never signs in spends 5
    `google-books-proxy` invocations on cover lookups for the seed's books (alongside 5
    OpenLibrary 404s). Opening Yumi's panel spends 2 `claude-proxy` calls before the reader has
    typed anything; one message spends 3 more.

13. **Export is sound.** Both formats carry the reader's book and note verbatim, correctly
    scoped, with no seed contamination. Its status line counts books, arcs and photos but never
    notes, and the door sits at the bottom of a 4,887 px page behind a two-step confirm.
