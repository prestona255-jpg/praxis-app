---
surface: books
route: "#books"
render_fn: renderShelf (views.js:3730)
mockup: docs/studio/mockups/shelf.html
ground: dark
in_nav: yes
state: closed
rounds: 2
mobile: native
---

## State

`#books` → `renderShelf` (views.js:3730); dark ground; in top-nav (books). Shelf (Covers / List).

## Decisions

- **[2026-07-08] R2 shape stage — 8 locked additive decisions, mockup at
  `docs/studio/mockups/shelf.html`.** The current Shelf design is KEPT (loved); the
  evolution adds ONLY these eight: (1) arc thread-tie — a colored bar down each
  card's LEFT SPINE, colored by primary arc; tap reveals ALL arcs (intersectional);
  (2) a bulk **Select** mode whose only action is **Move to arc** (no archive, no
  bulk delete); (3) the register/tradition tick stays UNTOUCHED (Amber); (4) a
  **Sort** control (date-added default + reading status) — grouping stays on the
  existing sidebar Lenses⇄Categories seg, not duplicated; (5) the persistent header
  **＋ Add a book** button is kept exactly (already exists); (6) card anatomy kept
  (cover + title + author + status), not restyled; (7) a state-COLORED reading
  status dot (reading = gold, read = green, want = hollow ring) rendered *alongside*
  the existing mono text label; (8) the thread sits on the left spine (= 1).
- **[FORK A — for Preston] Register tick vs. arc thread share the left spine.**
  Decision 3 keeps the tradition tick exactly as-is (`.shelf-book-tick`, `left:0`,
  `width:3px`); Decisions 1/8 put the arc thread on that same spine. The mockup's
  proposed resolution is a **two-lane spine**: register tick stays at `left:0/3px`,
  the arc thread sits just inside it (`left:3px`, `4px`, glow) — so a book with a
  tradition shows both, a book with none shows only the arc thread hugging the edge.
  Alternatives if Preston prefers: (B) arc thread becomes the spine and the register
  tick moves to a corner pip; (C) arc thread only, retire the tradition tick on the
  Shelf. Carried as a fork, never decided silently (THE FORK RULE).

## Mockup evaluation

*Read-only Stage-A evaluation of the live Shelf against the 8 locked decisions,
written while reconstructing `docs/studio/mockups/shelf.html`. This doubles as the
surface scan for the mockup stage.*

### Current surface — what the live Shelf actually is (HEAD f629a43)

- **Route / render:** `#books` → `renderShelf` (views.js:3730), with two card
  helpers `renderShelfBook` (4914, Covers) and `renderShelfBookRow` (5022, List).
  Signed-out hard-gates to a sign-in prompt (views.js:3757).
- **Ground / skin:** dark "reading-room" Amber — `.shelf.lum-amber-deep`
  (components.css:11287-11399) layered over the base `.shelf-*` structure
  (components.css ~2320-2500, 2111). Page ground = `lumen-amber.css .lum-amber-deep`
  radial (lumen-amber.css:82-89). Tokens: `--lum-*` only.
- **Layout:** full-width head (`.shelf-head`: `.shelf-title` "Your shelf" + mono
  `.shelf-count` "N books · R reading · F finished") → a deterministic cyan
  `.shelf-yumiline` (hidden until a top lens exists) → a single decluttered
  `.shelf-toolbar` → a `.shelf-layout` grid (`204px 1fr`, gap 38) of a sticky
  `.shelf-side` sidebar + `.shelf-main`. At ≤759 it reflows to one column and the
  sidebar becomes a fixed slide-in drawer toggled by the mobile-only **Filters**
  button (components.css:11373-11399).
- **Toolbar (canon 4-E):** `.btn.btn-primary` "＋ Add a book" · Covers|List `.seg` ·
  quiet `Filters` (mobile) · spacer · quiet chips **Scan shelf / Scan barcode /
  Bulk add / Resolve covers / Tidy library** · a `.nav-search` "Filter shelf…".
- **Card anatomy (Covers):** `.shelf-book` (bare flex column) → `.shelf-book-cover-area`
  (aspect 2/3, real `<img>` via `buildSelfHealingCover` or a cloth-gradient
  "cover pending" placeholder) → optional `.shelf-book-rmark` (gold "alight" dot,
  top-right) → optional `.shelf-book-tick` (left-edge 3px tradition bar) →
  `.shelf-book-title` (Cormorant 600) → `.shelf-book-author` (DM Sans) →
  `.shelf-book-meta > .shelf-book-status` (mono uppercase label + a flat gold
  square `::before`).
- **Sidebar rails (append order):** Reading status → Lenses|Categories seg →
  Lenses (+ "Ask Yumi for more lenses") → Author. Each is a `.shelf-filter-group`
  (`h3.shelf-filter-label` mono-gold + `ul.shelf-filter-list` of `.shelf-filter`
  rows with an `.n` count).
- **Fonts:** `--lum-serif` Cormorant Garamond (titles), `--lum-sans` DM Sans
  (body/nav), `--lum-mono` DM Mono (labels/meta/counts) — the three app stacks.

### The 8 decisions — exists / partial / new

| # | Decision | Status | Live anchor / where it lands |
|---|----------|--------|------------------------------|
| 1 | Arc thread-tie on left spine; tap reveals ALL arcs | **PARTIAL** | A left-spine bar already exists — `.shelf-book-tick` (views.js:4978-4982, components.css:2438-2445) — but it encodes **tradition**, not arc, and renders only when the book has a register token. Tap-to-reveal is **NEW** (card is a plain `<a href="#book/id">`, no per-card disclosure). No per-arc color exists live (see below). |
| 2 | Bulk **Select** → **Move to arc** only | **NEW** | No multi-select of existing cards anywhere. "Bulk add" (paste import, views.js:5709) and "Tidy library" (merge dupes) are unrelated. Lands as: a `Select` toolbar toggle → per-card checkbox overlay on `.shelf-book-cover-area` → a fixed Move-to-arc action bar. |
| 3 | Register tick UNTOUCHED (Amber) | **EXISTS** | `.shelf-book-tick` (left:0, 3px, `--tick=var(--register-<tradition>)`). Kept byte-for-byte — but see **Fork A**: decisions 1/8 also want the spine. |
| 4 | Sort control (date-added + status); grouping stays on Lenses⇄Categories | **NEW** (sort) · **EXISTS** (grouping) | Sort is NEW — `books.sort` is hardcoded `addedAt` desc (views.js:4679-4681) with no UI. Grouping seg already exists in the sidebar (`groupSeg`, views.js:4384) — NOT duplicated in the toolbar. |
| 5 | Persistent header **Add a book** | **EXISTS** | `.btn.btn-primary` "＋ Add a book", first toolbar child (views.js:3848-3855). Kept exactly. |
| 6 | Card anatomy kept (cover+title+author+status) | **EXISTS** | Exactly `renderShelfBook` (views.js:4914-5013). Not restyled. |
| 7 | Reading status colored dot (reading=gold / read=green / want=ring) | **PARTIAL — conflict** | Status IS shown, as a mono uppercase **text label** preceded by a flat 5×5 `var(--gold)` **square** (`.shelf-book-status::before`, components.css:2495-2500 / Amber 11353). Cross-check **CX-4**: that square has ZERO state encoding — all three states paint identically gold. Evolution: round the `::before` and color it per state, **keeping** the text label alongside (Decision 7's "without removing the existing treatment"). |
| 8 | Thread on the left spine | **PARTIAL** (= #1) | Same lane as `.shelf-book-tick` (`left:0`). See Fork A. |

**Where each NEW element anchors in the real DOM:** the arc thread → inside
`.shelf-book-cover-area` (a sibling of `.shelf-book-tick`); tap-reveal → a
disclosure appended after `.shelf-book-meta`; Select checkbox → an overlay on
`.shelf-book-cover-area`; the Move-to-arc bar → a fixed sibling of `.shelf`; the
Sort control → a toolbar child beside the Covers|List `.seg`; the status dot →
the existing `.shelf-book-status::before`.

### Thread-color source — what live actually has (Stage A item 4)

**There is NO per-arc color in the live app today, confirmed three ways:**

- `universal-depth.css` is **not loaded** — `index.html` links only `lumen-amber.css`,
  `theme.css`, `components.css` (index.html:13-16). So `--field-1..10` and `--gold-hi`
  are **undefined** anywhere in `assets/` (cross-check CX-5).
- Arcs carry **no color field** — `ensureArcFields` stamps only
  `title / description / bookIds / entryIds` (state.js:711-732); grep for
  `arc.color`/`arc.hue` = 0 hits.
- The nearest live color data is per-*book*/per-*sub-theory*, not per-arc:
  - `--register-<tradition>` — a real, loaded 9-tradition spectrum (theme.css:41-132)
    already used by the shelf tick, but keyed to tradition, not arc.
  - `PraxisMarks.COLORS` — a live 16-hue palette, one hue per sub-theory mark
    (marks.js:20-37). An arc could derive a color from its dominant sub-theory's mark.

**Build-time decision for the mockup:** arc threads use the **Universal field
spectrum** (`--field-1..10`, universal-depth.css:42-43) as inlined literal hexes —
a clearly-marked stand-in that also aligns the mockup forward to Universal §8.
**Recommended live-wiring path** (a build round, not this mockup): derive an arc's
color from its dominant `PraxisMarks` sub-theory hue (available today, no new field,
no new stylesheet) — or, if §8 lands first, add an `arc.hue` seeded from the field
spectrum. Either is a data/model decision for its own round, not a visual mockup call.

### Notes carried into the mockup

- Covers render as the live **cloth-gradient "cover pending" placeholder** (the app
  uses real `<img>` covers via `buildSelfHealingCover`; a standalone offline file has
  no images) — a faithful stand-in for the *pending* cover state, commented as such.
- Register-tick colors in the mockup are approximate tradition hexes (the tick is
  "kept as-is", secondary); live resolves `var(--register-<tradition>)` from theme.css.
- The mockup ships desktop (sidebar visible) + mobile ≤759 (drawer) in one file, with
  the live 759 reflow mirrored, and light interactivity (card tap → arc reveal;
  Select → checkmarks + Move-to-arc bar; Sort menu; Covers/List switch; mobile drawer).

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: open, verified 2026-07-08] [sev: MEDIUM] SH1 — The shelf toolbar has 6 near-equal controls (declutter overshot canon 4-E) (views.js:3858-3923) — toolbar clutter. [note: anchor drifted but the finding reproduces — the current toolbar (post-Umber-port canon-4-E pass, commit 0dd3d19) is 1 primary + 1 seg + 1 quiet Filters toggle (views.js:3889-3904, hidden ≥760px per components.css:11372-11375) + 5 quiet chips (Scan shelf/Scan barcode/Bulk add/Resolve covers/Tidy library, views.js:3914-3977) + search. Canon 4-E names only 3 chips (Scan shelf/Bulk add/Resolve covers), so the quiet-weight tier still carries 5-6 near-equal controls, 2-3 over spec.]
- [source: fable-audit-combined.md 2026-07-07] [status: open, verified 2026-07-08] [sev: LOW] SH2 — Shelf toolbar `.btn` uses `backdrop-filter:blur(10px)` — confirm vs the no-blur-on-chrome canon (components.css:11302). [note: confirmed unchanged — `.shelf.lum-amber-deep .btn{...-webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);}` still present verbatim at components.css:11302.]
- [source: fable-audit-combined.md 2026-07-07] [status: open, verified 2026-07-08] [sev: LOW] SH3 — Shelf cover-grid status label is 9.5px mono (below the small-type floor) (components.css:11352). [note: confirmed unchanged — `.shelf.lum-amber-deep .shelf-book-status{...font-size:9.5px;...}` still present verbatim at components.css:11352; the same class carries the only read-state text in both Covers and List view (components.css:11360).]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: open, verified 2026-07-08] [sev: Decided] Shelf / categories — Taxonomy authority DECIDED: a fixed curated taxonomy (17 categories plus Uncategorized) with a per-book manual override. Curated coherence beats Goodreads tag-sprawl; the override handles misfiles without opening the door to chaos. [note: half-realized — the 17+Uncategorized taxonomy IS live (SHELF_CATEGORIES, state.js:484-503), but the "per-book manual override" half of the decision is NOT built: views.js:4531-4532 carries an explicit unimplemented hook, "BUILD 2 hook — preserve a manual override here once it exists: // if (rb.categoryOverride) { continue; }".]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: open, verified 2026-07-08] [sev: FIX] Shelf / categories FIX now — capture raw categories on the manual and by-title add paths and in the fetch paths; scope the re-classify and lazy passes to the shelf index, not all books; a duplicate-add guard; batch progress on the long first-run classify; re-classify must PRESERVE a manual override. [note: mostly still open. (1) raw-categories capture — volumeToBook (integrations.js:2074) DOES set rawCategories on the resolver object, but every write site that persists a book drops it: manual add (views.js:5539-5548), bulk add both branches (views.js:5912-5921, 5925-5934), review-confirm/barcode-scan (views.js:6750-6756), and the background-fetch settle() helpers (views.js:5150-5154, 5182-5186) all omit rawCategories, so it is always [] on a saved record regardless of add path. (2) re-classify NOT scoped to the shelf index — `for (rbid in state.books)` (views.js:4527) clears ALL of state.books, not the deduped shelf set. (3) no duplicate-add guard found at save time (only after-the-fact Tidy-library merge, views.js:6862-6900). (4) no batch progress — the loading row shows only a static pending count (views.js:4497-4502); classifyBooksViaLLM (integrations.js:2180-2211) has no per-batch progress callback. (5) manual-override preservation on re-classify is the same unbuilt hook as the Decided item above (views.js:4531-4532).]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: open, verified 2026-07-08] [sev: ADD] Shelf / categories ADD — the manual override plus a book-detail category picker; the lineage shelf extension (value→category/lens mapping, same consent and one-noticing). [note: none of the three pieces exist — no categoryOverride field anywhere (grep: 0 hits outside the unbuilt-hook comment at views.js:4531); both category-display sites are read-only labels with no picker/editor (views.js:7413-7414 bookLensTags; views.js:8351 book-detail Subjects row); no "lineage shelf extension" (value→category/lens mapping) found anywhere in js/ (grep: 0 hits).]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: open, verified 2026-07-08] [sev: Hygiene] Shelf / categories Hygiene → sweep — dead shelf-button rules and a stray segment option. [note: dead-rule sweep confirmed still needed — `.shelf-new-book`/`.shelf-header`/`.shelf-headline` (components.css:1135-1188) match ZERO live elements (grep of views.js: 0 hits for any of the three classNames; the live toolbar uses `.btn`/`.chip`/`.shelf-head` instead, views.js:3767,3850). Could not independently confirm the "stray segment option" beyond this — no extra/orphaned .seg-opt found in renderShelf; every seg-opt instance (views.js:3865-3883 Covers/List, 4362-4378 Lenses/Categories) maps to a live, wired option.]
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: open, verified 2026-07-08] [sev: Gate] Shelf / categories Gate — the deeper accuracy pass (backfilling raw categories across the legacy library plus a tighter classification rubric) is folded into 2.0 but shaped by Preston's pending eyeball of the live library's real accuracy (a to-do on his side, not a blocker). [note: still pending — nothing in code resolves a human eyeball pass; the taxonomy is live and reviewable at state.js:484-503 whenever Preston does this to-do.]

- [source: studio-scan 2026-07-08] [status: open] [sev: med] RAILS CHECK correction — the brief's "renderShelf touches NO rails seam" claim is accurate only for renderShelf's own body (views.js:3730-4913); its two Shelf-exclusive card helpers DO touch the seam. renderShelfBook (views.js:4981) and renderShelfBookRow (views.js:5044) each run `tick.style.setProperty('--tick', 'var(--register-'+tradition+')')` — these are the exact 2 instances of the `--tick` setProperty seam catalogued app-wide in r0-recon.md's Stage-3 "runtime setProperty" list, and both belong exclusively to the Shelf (r0-recon's own caller counts: renderShelfBook 1 caller, renderShelfBookRow 2, both Shelf-only). Any depth-law recipe-8 (glyph color language) conversion of the register tick IS in the rails' blast radius, contrary to the given ground map.
- [source: studio-scan 2026-07-08] [status: open] [sev: low] Register-tick construction is duplicated verbatim between renderShelfBook and renderShelfBookRow instead of a shared helper (views.js:4975-4983 vs. views.js:5038-5046).
- [source: studio-scan 2026-07-08] [status: open] [sev: low] fetchAndApplyCover and fetchAndApplyCoverByTitle are near-identical (only the underlying fetch call differs) with no shared helper (views.js:5148-5172 vs. views.js:5180-5204).
- [source: studio-scan 2026-07-08] [status: open] [sev: low] shelfRailOpen is written (views.js:3896) but never read anywhere in renderShelf, and its only setter — the desktop matchMedia branch (views.js:3895-3897) — is unreachable in practice because CSS hides #shelf-filters-btn at ≥760px (components.css:11372-11375); the surrounding comment (views.js:4153) even calls it "retired on desktop" while the code still writes it every click.
- [source: studio-scan 2026-07-08] [status: open] [sev: low] Unconditional `console.log` on every successful shelf-photo scan, not gated to a debug flag (views.js:7200-7201) — logs image dimensions and base64 size to the console on every real user scan, contrary to the "console must be clean on every surface" smoke-test bar.
- [source: studio-scan 2026-07-08] [status: open] [sev: low] Stale, self-contradicting comment: the shelfFilter block's earlier comment claims filters are "single-select per section and AND across sections" (views.js:5216-5217), directly contradicted three lines later by the accurate "Stage 4c: sections are EXCLUSIVE single-select" comment (views.js:5225-5226) and by toggleShelfFilter's actual behavior (views.js:5276-5292), which clears every OTHER section on any pick. The comment was never updated when Stage 4c changed the behavior.
- [source: studio-scan 2026-07-08] [status: open] [sev: med] rawCategories is never propagated to any state.books write site (see the FIX-now ledger note above for the 5 confirmed drop points), so classifyBookLocal's keyword-map branch (state.js:608-614) is practically dead code for every real user's library — every never-cached book falls through to the paid LLM batch classifier (integrations.js:2180-2211) even though a free local match would often resolve it.
- [source: studio-scan 2026-07-08] [status: resolved 2026-07-09] [sev: med] The Author filter rail reads raw `state.books` directly (`authors`/`authorCounts`, views.js:4027-4058: `for (abid in booksMap)` / `for (tcid in booksMap)`) instead of the deduped `shelfBookIds`/`lcArr` set that every sibling rail (Lenses, views.js:4079-4110; Reading status, views.js:4133-4149; Categories, views.js:4403-4409) was specifically reworked to use so "orphan/duplicate records never inflate a lens count" (views.js:4082). The orphan/duplicate condition is acknowledged to exist in this very function (views.js:3774-3778, "FIX D"), but the Author rail was missed by that fix.
- [source: studio-scan 2026-07-08] [status: open] [sev: med] No pagination or virtualization: renderShelf rebuilds the entire page (`host.innerHTML=''`, views.js:3733) on every filter click, status toggle, grouping toggle, and each debounced search keystroke (250ms, views.js:5329-5335); every filtered book re-renders as a fresh DOM card (views.js:4860-4872) with no cap, and the "alight" computation re-walks the FULL state.notebookEntries + state.subTheories maps on every render (views.js:4759-4789) rather than being memoized or scoped to the visible set.
- [source: studio-scan 2026-07-08] [status: open] [sev: med] Every "alight" book unconditionally renders a glowing dot (`.shelf-book-rmark`, `box-shadow:0 0 8px var(--lum-gold)`, components.css:11349; row form components.css:11361) with no viewport gating or count cap — this pre-dates §8, but converting it to the canonical luminous-orb recipe without adding the restraint rail would violate the §8 "list surfaces glow only in-viewport/interactive rows" law and the ~30-orbs-per-view cap the moment a shelf has more than a handful of alight books, since all of them render simultaneously off-screen and on.
- [source: studio-scan 2026-07-08] [status: open] [sev: med] The `:focus-visible` rule set for shelf controls (components.css:4001-4022) targets classes renderShelf no longer emits — `.shelf-new-book`, `.shelf-filter-row`, `.shelf-resolve-covers-btn`, `.shelf-scan-btn`, `.shelf-signin-prompt` — while live markup uses `.btn`/`.chip`/`.seg-opt`/`.shelf-filter` (views.js:3850,3916,3936,3945,3955,3972,4220-4222). The `.shelf.lum-amber-deep` skin block (components.css:11283-11399) defines no focus-visible treatment of its own for any of those live classes, so keyboard-focused toolbar buttons, chips, and filter rows on the dark Amber Shelf fall back to whatever the browser's default outline is (or none) instead of a themed indicator.
- [source: studio-scan 2026-07-08] [status: open] [sev: med] toggleShelfFilter (views.js:5276-5292) clears every OTHER filter section whenever any one filter is picked, so a reader can never combine two facets at once (e.g. "Reading status: reading" AND a specific "Author") — every rail reads as an independent multi-facet filter (separate labeled sections: Categories, Reading status, Author) but behaves as one global single-select across all of them, which will surprise anyone expecting the sections to combine. See the stale-comment code-health finding above for the same root cause.
- [source: studio-scan 2026-07-08] [status: open] [sev: low] Switching the sidebar grouping to "Categories" silently fires a background LLM classification call (Sonnet, integrations.js:2180-2211) for every uncached book the moment the tab is clicked (views.js:4414, `if (catPending.length > 0 && !shelfCategorizing && getCurrentUser())`) — no confirmation, no disclosure that this triggers a network/AI call, unlike Praxis's consent-gated pattern elsewhere (reader-model consent, "What Yumi sees" transparency).
- [source: studio-scan 2026-07-08] [status: open] [sev: high] The Shelf has NOT been converted to Universal v1.2 / the §8 Light & Depth law at all — it runs entirely on the legacy `--lum-*` Lumen skin (`.shelf.lum-amber-deep`, components.css:11283-11399): zero uses of `--gold-hi`, and no `.u-orb`/`.u-gild-hairline`/`.u-ground-atmo`/`.u-thread`/`.u-glyph-*` classes anywhere in the block; the toolbar `.btn`/`.chip` styling (components.css:11302-11307) uses flat glass fills, not the atmospheric-ground/gilded-hairline recipes. Where the recipes would land: recipe 2 (luminous orb) on `.shelf-book-rmark`/`.shelf-book-row-rmark` (components.css:11349,11361) and `.shelf-book-status::before` (components.css:11353); recipe 1 (gilded hairline) on `.shelf-book` cards / `.shelf-filter-group` panels; recipe 6 (atmospheric ground) on the `.shelf.lum-amber-deep` root wash (currently a flat `--lum-bg` radial via lumen-amber.css, not the two-wash-plus-vignette recipe); recipe 8 (glyph color language) on the register tick (see the RAILS CHECK correction above — it currently sources `--register-*`, not the `--field-*` spectrum).
- [source: studio-scan 2026-07-08] [status: open] [sev: low] The Shelf conflates all three gold roles the Universal token sheet keeps distinct (praxis-universal-token-sheet.md §1 "The golds" fork): `--lum-gold #ffce4a` (meant for luminous/star accents) fills the primary "Add a book" button (components.css:11304), the segmented `.is-on` state (components.css:11311), the status-pill text (components.css:11352), the filter-label eyebrows (components.css:11323), and every tick/orb glow, all at once — none of which are the gilding-edge or interactive-deep-gold roles per the sheet's three-role split. `--gold-hi` itself is never referenced (0 occurrences) in the Shelf's CSS block, so the gilding-fill law is not being actively violated — the surface simply has no gilding treatment yet to check it against.
- [source: studio-scan 2026-07-08] [status: open] [sev: low] No user-facing sort control exists — `books.sort` is hardcoded to `addedAt` descending (views.js:4679-4681) with no UI to reorder by title, author, or status, despite a Filters rail and Search already present.
- [source: studio-scan 2026-07-08] [status: open] [sev: low] The shelf-count head line never surfaces "will-read/Unread" books (views.js:3813-3817, "N books · R reading · F finished") even though that status is tracked and displayed one section down in the same render (the Reading-status rail's "Unread" row, views.js:4142-4149) — the two summaries of the same shelf disagree on what they report.

- [source: cross-check 2026-07-08] [status: resolved 2026-07-09] [data-state][high] CX-1 — mergeBookDuplicates (Tidy library, views.js:6900-6965) scrubs only notebookEntries.bookIds (6926-6937), arcs.bookIds (6939-6954), and userBooks.bookIds (6956-6958), then deletes the dropped records (6959) — omitting 4 of the 8 collections deleteBook (views.js:6773-6856) handles: sub-theory book-evidence (deleteBook step 4, 6800-6812, matched by evidence[].refId — orphaned dangling refIds after a merge), userThemes membership (step 6, 6825-6834 — orphaned ids), bookArtifacts (step 7, 6836-6841 — orphaned artifact records keyed to a now-gone book id), and clearPendingBookSync + markBookDeletePending (step 8, 6843-6845 — mergeBookDuplicates calls only markBookPending(uid,keepId), never a delete-pending guard for the dropped ids). CONFIRMED RESURRECTION RISK: integrations.js's mergeRemoteBookDoc (712-789) trusts getPendingBookDeletes (726-731) to keep a locally-removed id from being copied back from a stale/in-flight remote read (762-775, "remote wins for synced ids"); since a Tidy-merge-dropped id is never added to that pending-delete set, a remote /userBooks doc read that still lists it (a real race: the delete write hasn't yet propagated, or a second tab/session) resurrects the merged-away duplicate via `state.books[rbid] = remoteBooks[rbid]` at integrations.js:772-773.
- [source: cross-check 2026-07-08] [status: resolved 2026-07-09] [data-state][high] CX-2 — No dedup-on-add guard anywhere in the Shelf. Single add (openShelfEditor save, views.js:5539-5548) mints a fresh id and writes state.books[id] unconditionally with zero existence check against the shelf's current ISBN/title set. Bulk paste (processBulkLines, views.js:5864-5946) dedupes only ISBN-form lines WITHIN one paste (seenIsbns, 5870/5882-5884); title-form lines (5885-5887) push with no dedup at all, and neither form checks against books already on the shelf from a PRIOR add. The only remedy is the after-the-fact Tidy-library merge (scanLibraryForCleanup/mergeBookDuplicates, views.js:6862-6965) — and per CX-1, that remedy itself is incomplete.
- [source: cross-check 2026-07-08] [status: open] [performance][high] CX-3 — buildSelfHealingCover (views.js:6425-6450) creates a fresh `<img>` per call with no width/height attributes, no loading="lazy", no decoding="async", and no node-reuse (img.className/img.alt/img.src set on a brand-new element every time). Because renderShelf tears down and rebuilds the whole grid on every render (host.innerHTML='', views.js:3733), a real library re-decodes every visible cover (100+ on a large shelf) on every filter click and debounced search keystroke.
- [source: cross-check 2026-07-08] [status: open] [canon-fidelity][high] CX-4 — The read-state status dot has ZERO state encoding. `.shelf-book-status::before` is a flat 5×5 `background:var(--gold)` square (components.css:2495-2500; the Amber re-point at components.css:11352-11353 is likewise a flat `var(--lum-gold)` fill). The `shelf-book-status-<canon>` class hook emitted at views.js:5007 (grid) and views.js:5064 (list row) is consumed by NO color/glow rule anywhere in components.css — confirmed by grep: zero rule definitions for `.shelf-book-status-reading`/`-read`/`-will-read` exist (one stray COMMENT references the pattern at components.css:5640, not an actual rule). All three read-states (reading/read/will-read) paint identically. This is the clearest Recipe-2 (luminous orb) landing site and it is fully unconverted — distinct from the general "§8 not converted" finding already on this ledger.
- [source: cross-check 2026-07-08] [status: open] [canon-fidelity][high] CX-5 — §8 STRUCTURAL PREREQUISITE confirmed missing: index.html links only 3 stylesheets — lumen-amber.css, theme.css, components.css (index.html:13,15,16) — `docs/studio/universal-depth.css` is not linked anywhere in the live app. `--gold-hi` and `--field-1` (and by extension the rest of the field spectrum) return ZERO matches across all of assets/ (confirmed by grep). No `.u-*` recipe class or its decorative tokens exist live, so no §8 recipe is wireable on the Shelf (or anywhere) until this layer is loaded and the tokens are defined live — the gating first slice of any conversion, ahead of any recipe work.
- [source: cross-check 2026-07-08] [status: open] [accessibility][med] CX-6 — Filter rows carry no `aria-pressed`/`aria-selected` — only a class toggle (`shelf-filter is-on` vs `shelf-filter`) alongside `role="button"` + `tabindex="0"` (e.g. views.js:4220-4224 and every other filter-row builder in renderShelf); a screen reader has no way to announce the selected state. The Covers|List seg is an incomplete tablist: the container declares `role="tablist"` (views.js:3861-3862) but segCovers/segList (3863-3877) set only class + a data attribute, never `role="tab"`/`aria-selected` — inconsistent with the Lenses|Categories seg built moments later in the same function, which DOES set `role="tab"` + `aria-selected` on both options (views.js:4363-4364, 4375-4376).
- [source: cross-check 2026-07-08] [status: open] [accessibility][med] CX-7 — The mobile filter drawer has no focus management. openShelfFilterPanel (views.js:4620-4632) toggles two classes and binds an Escape handler — no focus move into the drawer, no focus trap, no `inert`/`aria-hidden` on the page content it covers. The Filters button that opens it (views.js:3889-3904) sets no `aria-expanded`/`aria-controls` at any point.
- [source: cross-check 2026-07-08] [status: open] [accessibility][med] CX-8 — Two data-bearing text roles measure below the 4.5:1 AA floor for sub-18px text against the `.lum-amber-deep` ground (`--lum-base #231708`, lumen-amber.css:28). Computed contrast (WCAG relative-luminance formula, from the live hex tokens): the filter match-count `.shelf-filter .n` (11px, `--lum-ink-3 #b6a888` at `opacity:.7`, components.css:11329) resolves to an effective color around #8a7d62, ≈4.3:1 — just under the 4.5:1 floor; the search placeholder (`--lum-ink-4 #867a5e` at full opacity, components.css:11315, on a 13px input per components.css:11314) computes to ≈4.1:1. Both are approximate (the ground is a radial gradient, not a flat fill — this uses the base color as the reference point) but both land clearly on the wrong side of the line, not a marginal rounding call.
- [source: cross-check 2026-07-08] [status: open] [accessibility][med] CX-9 — Heading/list semantics: every cover card titles as an `<h2>` (views.js:4985-4988) — dozens per shelf. The grid/rows containers are plain `<div>`s with no `role="list"` (`.shelf-grid`, views.js:4866-4867; `.shelf-rows`, views.js:4858) and individual cards carry no `role="listitem"`. The list-view row titles as a `<span>` instead (views.js:5048-5051) — inconsistent with the grid view's `<h2>`. Heading outline: page `<h1>` "Your shelf" (views.js:3769) is followed in DOM order by four sidebar `<h3>` labels (Lenses/Categories, Reading status, Author — views.js:4205,4293,4458,4555) BEFORE any `<h2>` appears (the cards, later in the main column) — h1 drops straight to h3 with no intervening h2.
- [source: cross-check 2026-07-08] [status: open] [ux-interaction][med] CX-10 — COPY-IS-A-CONTRACT break: the filtered-empty state subtitle reads "Clear your filters or add a new book." (views.js:4835-4836) but the empty state renders only one control, "＋ Add a book" (views.js:4841-4848) — there is no "Clear filters" affordance anywhere in that state; the only way to clear an active filter is to re-click its (now off-screen, since the list is empty) row elsewhere in the sidebar.
- [source: cross-check 2026-07-08] [status: open] [ux-interaction][med] CX-11 — The mobile filter drawer auto-closes on every pick. Any filter-row click re-enters toggleShelfFilter → renderShelf() (views.js:5276-5292), which tears down the whole page and rebuilds `sidebar` fresh as plain `className = 'shelf-side'` (views.js:4157) — the `shelf-sidebar-mobile-open` class that openShelfFilterPanel had imperatively added (views.js:4621) is gone on the new element, and CSS gates the drawer's visibility on exactly that class (components.css:11387-11393 `transform:translateX(-110%)` unless `.shelf-sidebar-mobile-open`). So only one filter can be set per drawer-open on mobile.
- [source: cross-check 2026-07-08] [status: open] [product-gaps][med] CX-12 — book.genre (drives the Lenses rail) can be set only at add-time, via openShelfEditor's SHELF_THEMES `<select>` (views.js:5468-5481). buildBookEditPanel, the book-detail edit surface (views.js:7974-8116), offers "Fix this book," an ISBN field, and a Tradition select (traditionOverride) — but NO genre field anywhere. Bulk and ISBN-form adds write `genre:''` unconditionally (views.js:5919, 5932) — those books are permanently lensless with no UI path to ever fix it.
- [source: cross-check 2026-07-08] [status: open] [ux-interaction][low] CX-13 — A background re-render not triggered by the search input (cover-backfill settle, views.js:5396-5401; classify-completion callback, views.js:4436-4453) tears down and rebuilds the whole page without restoring focus or the in-progress value, because only onShelfSearchInput sets the `shelfSearchRefocus` flag that the render's refocus step checks (views.js:4899-4907 reads it; views.js:5333 is the only setter). If one of those unrelated renders fires while the user is mid-type in the search field, focus and any not-yet-committed keystrokes are lost — transient, not a permanent character drop (the next debounce tick recovers).
- [source: cross-check 2026-07-08] [status: open] [data-state][low] CX-14 — No dedicated "clear all filters" control. shelfFilter carries 6 independent fields (author/genre/theme/status/tradition/category, views.js:5227); only the Reading-status rail has an "All" row (views.js:4307-4324), and its click handler sets ONLY `shelfFilter.status = null` (views.js:4318) — it does not clear the other 5 fields, unlike a normal filter pick elsewhere (which clears every other section via toggleShelfFilter's exclusive-select, views.js:5276-5292). A stale/emptied filter in the other 5 sections has no dedicated always-visible clear row; the only escapes are re-picking a still-valid row in another section (which incidentally clears everything) or a reload — largely mitigated once CX-10's actual "Clear filters" control ships.
- [source: cross-check 2026-07-08] [status: open] [product-gaps][low] CX-15 — Bulk paste-add commits every parsed line directly to state.books with no preview/confirm step (openBulkAddEditor's Submit handler calls processBulkLines(textarea.value) straight through, views.js:5709-5711) — unlike the photo-scan path, which routes through an editable review screen (openBookReview) before anything is written. Separately, the first-run category classify shows only a single static "Classifying N books…" count (views.js:4497-4502) with no incremental batch progress, even though classifyBooksViaLLM runs in sequential batches (integrations.js:2180-2211) that could report progress per batch.
- [source: cross-check 2026-07-08] [status: open] [product-gaps][low] CX-16 — No granular reading-progress field exists anywhere: status is a 3-value enum only (reading/read/will-read); ensureBookFields (state.js:387-413) stamps pageCount but no currentPage/percent/progress field, and grep across js/ for currentPage/readingProgress/percentRead returns zero matches.
- [source: cross-check 2026-07-08] [status: resolved 2026-07-09] [data-state][high] RE-GRADE — the Author filter rail finding already on this ledger (views.js:4027-4058 reading raw booksMap instead of the deduped shelfBookIds/lcArr set) is elevated to HIGH: because the filtered `books` array used to populate the grid IS scoped to the deduped set (views.js:4665-4681), an author whose only book(s) are orphan/duplicate records outside that set shows a >0 count in the sidebar but yields ZERO cards when clicked — a direct violation of the CLAUDE.md Live Forensic Smoke Test's "rendered count == stored count" bar, not just a cosmetic inflation.
- [source: cross-check 2026-07-08] [status: open] [performance][high] RE-GRADE — the "no pagination/virtualization" finding already on this ledger is elevated to HIGH: renderShelf is the sole update path for the entire surface, confirmed called from 40 sites in views.js (grep count); every call tears down the page (`host.innerHTML=''`, views.js:3733) and re-runs ~9 separate O(n) passes over the book set (collect, sort, filter's 7-predicate pass, lens/status/author/category tallies) plus a full walk of state.notebookEntries AND state.subTheories for the "alight" computation (views.js:4759-4789) — on every filter click, toggle, and debounced keystroke, not just on load.

## Round history

### MW-1 mobile pass — SHIPPED-LOCAL (2026-07-10, commit a405730; chip → mobile: native)

First half of the MW-1 mobile wave. The Shelf now conforms to `praxis-mobile-canon.md`
P1–P9 at ≤759. **Chip ruling: `mobile: native`** — every applicable pattern verified on
both layers (static relational + live 390 CDP), evidence in `docs/studio/reports/mw1-2026-07-10.md`.

- **P1 (ON-2 REFERENCE IMPLEMENTATION):** one "Manage" control at every viewport. Visible
  toolbar = Add-a-book + Sort + Filters + filter field; the 7 secondary controls (Covers|List,
  Select, Scan shelf, Scan barcode, Bulk add, Resolve covers, Tidy library) relocate into a
  Manage container — **bottom sheet ≤759 / anchored popover ≥760, one JS path**
  (`openManageSheet`/`closeManageSheet`, views.js ~4109-4141). Controls move WITH their live
  handlers (no re-wire). Live @390: sheet `position:fixed`, top 388/bottom 840, 54vh, scrim
  backdrop, body scroll-lock, focus-in (`shelf-manage-close`) + return (`shelf-manage-btn`),
  Escape + backdrop-tap dismiss; @1265 popover `position:absolute` anchored. Scroll-lock +
  listeners also released in `renderRoute` (views.js:359) so OS back-nav can't strand a surface.
- **P2** bottom-left Add FAB (opposite the Yumi bloom, hidden in Select mode); **P3** 44px
  (sheet close 44×44 + inherited `.btn/.chip/.seg-opt` floor); **P4** `env(safe-area-inset-bottom)`
  ×2; **P5** sticky-title compaction (scroll listener → `.is-stuck`); **P7** 16px filter input +
  `inputmode=search`; **P8** zero h-scroll @390 (fixed an 8px sticky-head overflow in verify);
  **P9** motion = {opacity, sheet slide, title font-size} + reduced-motion zero. **P6** n/a.
- Tokens: `--page-2`/`--line-page(-2)`/`--scrim`/`--ink`/`--gold-deep`/`--font-mono`/`--radius-lg`
  (Shelf is light-ground via R2 re-points, so semantic `--surface`/`--border` were NOT used); 0
  `--lum-*`, 0 blur, 0 new hex. Gates: praxis-reviewer CLEARED + fix-red-team (1 blocker — the
  back-nav scroll-lock leak — fixed & re-verified).
- **Residuals (low sev):** no Tab focus-trap on the mobile sheet (has focus-in + Escape + scrim);
  modal-over-sheet (Scan/Bulk/etc. open behind the sheet, not auto-closed to avoid an
  overflow-unlock race); the slide/fade animation couldn't be observed *settling* in the headless
  rig (verified via settled-cascade + reduced-motion static) and screenshots timed out — the
  live-DOM structural proof is the hard evidence. **Felt pass at 390/768/1280 remains Preston's.**

### Shelf data-correctness round CLOSED — live pass in full (2026-07-09, deployed v3.186, commit e12f705)

Preston's signed-in live pass on the deployed app passed in full: the **Firestore
resurrection test** (Tidy-library-merge a real duplicate pair → full reload +
Firestore sync → the dropped copy STAYED GONE — the tombstone holds against
`mergeRemoteBookDoc`'s remote-wins path), plus dedup-on-add and delete
persistence. Both R2 (visual) and this data round are now closed on the Shelf.
Remaining Shelf work is the deferred categories feature round (Next) and the
low-priority a11y follow-up `task_e4cb7af7`.

### Shelf data-correctness round (BUILT, v3.186, 2026-07-09)

The three HIGH data-state bugs the R2 cross-check parked, fixed as their own commit
(data-loss tier, own commit, deleteBook byte-locked as the coverage reference).
Fully harness-proven; Firestore round-trip = deployed check (see below).

- **CX-1 DATA-MERGE** (resolved) — `mergeBookDuplicates` (views.js:7215) now covers
  every collection `deleteBook` scrubs: REPOINTS sub-theory evidence `refId`,
  `userThemes` membership, and `bookArtifacts` (collision rule below) drop→keep
  instead of orphaning them, and **tombstones each dropId** (`clearPendingBookSync`
  + `markBookDeletePending`, never keepId) so a stale/racing remote read can no
  longer RESURRECT a merged-away duplicate via `mergeRemoteBookDoc`. Artifact-
  collision rule (reviewable): keep-has-none → move drop's artifact onto keep;
  both exist → keep canonical + drop's writing appended under a merge marker,
  never destroyed.
- **CX-2 DATA-DUP** (resolved) — single-source `bookIdentityKey` (normalized
  title+author, the same key `scanLibraryForCleanup` now uses). Single add of a
  book already on the shelf → no duplicate, folds to the existing copy; bulk add
  dedups title-form lines (shared key, vs shelf + within-paste) and ISBN-form
  lines vs the shelf.
- **CX-3 AUTHOR RAIL** (resolved) — the Author rail now counts over the deduped
  `shelfBookIds` set (like every sibling rail), so an orphan/duplicate author no
  longer shows a >0 count that yields zero cards ("rendered count == stored count"
  restored).

Scope: `js/views.js` (+185/−30) + `sw.js` v3.185→v3.186 ONLY; `deleteBook`
byte-locked; R2 skin/features byte-untouched. Evidence: docs/checkpoints/
shelf-data-correctness.md.

### R2 CLOSED — felt pass PASSED IN FULL (2026-07-09, deployed v3.185, commit 372775a)

Preston's felt pass passed in full on the live deploy: visual pass, the Move-to-arc
**Firestore round-trip confirmed persisting after reload**, and the thread-tap arc
reveal confirmed fine on mobile (reveal stays thread-tap). Residual a11y follow-up
`task_e4cb7af7` remains low-priority, decoupled from any fork. Round closed.

### R2 — Universal skin + 8 features (v3.185, felt-passed)

The live Shelf ships the Universal v1.2 light-ground skin + all 8 locked decisions,
built computed-style-identical to `docs/studio/mockups/shelf.html` (Universal state).

- **Foundation (CX-5):** `universal-depth.css` linked in `index.html`; `--gold-hi` /
  `--field-1..10` / `--thread` now defined app-wide.
- **Skin:** a shelf-scoped Universal override (`.shelf.lum-amber-deep`, ported
  byte-faithful from the mockup) — atmospheric light ground, ink-to-gold title,
  gilded Add button, luminous alight/reading marks, the three-gold role split,
  ink AA collapse, `.n` opacity AA fix. Register tick untouched (0 overrides);
  scoped so Book/Notebook keep their dark ground.
- **Features:** arc thread-tie + intersectional tap-reveal (deterministic
  `--field-*` hue by arc id-hash — no per-arc color exists in data); Select mode →
  Move-to-arc (reuses `addBookToArc`+`saveState`, no data-logic change); Sort
  (date-added / reading status; grouping stays on the sidebar seg); state-colored
  status dots (reading=luminous / read=green / want=ring); persistent Add kept.
- **Parity R2:** every manifest row EXACT vs the mockup. glowCount 7 ≤ 14.
  Regression sweep (book-open, Lenses⇄Categories, mobile drawer) green; console
  clean; no CSS bleed to Arcs/Notebook.
- **Adaptation (reviewable):** the arc reveal trigger narrowed from the mockup's
  whole-card tap to the thread bar, because the live card is a navigation link and
  book-open is load-bearing.
- **Residuals:** Firestore persistence of Move-to-arc is the deployed felt-pass
  (harness is signed out); large-library orb viewport-gating still deferred
  (pre-existing); `universal-depth.css` linked from its `docs/studio/` path.

## Next

### Round brief — R2 first-surface round (Shelf), drafted by studio-scan 2026-07-08

**(a) Ranked gaps** (most-severe × user-impact first; full text + evidence in the Gap ledger above):

1. `[high]` Zero §8 Light & Depth adoption on the Shelf — legacy `--lum-*` skin throughout, no Universal recipes anywhere in `.shelf.lum-amber-deep` (components.css:11283-11399).
2. `[med]` RAILS CHECK correction — renderShelfBook/renderShelfBookRow DO set the `--tick`/`--register-*` seam (views.js:4981, 5044); a recipe-8 glyph-language conversion is in the rails' blast radius.
3. `[MEDIUM, imported]` SH1 — toolbar still carries 5-6 near-equal quiet controls, 2-3 over canon 4-E's 3-chip spec (views.js:3858-3923, drifted anchor verified).
4. `[FIX, imported]` Shelf / categories FIX now — rawCategories never captured on ANY write path; re-classify not scoped to the shelf index; no duplicate-add guard; no batch progress; override-preservation unbuilt (5 confirmed drop points, see ledger note).
5. `[ADD, imported]` Shelf / categories ADD — no manual override field, no book-detail category picker, no lineage extension (0 hits for all three).
6. `[med]` rawCategories dead-path — classifyBookLocal's free keyword branch (state.js:608-614) is practically dead code; 100% of never-cached books pay for LLM classification.
7. `[med]` Author filter rail is not orphan/duplicate-safe, unlike every sibling rail (views.js:4027-4058 vs. 4079-4149, 4403-4409).
8. `[med]` No pagination/virtualization — full-page rebuild + full notebookEntries/subTheories walk on every filter click and search keystroke (views.js:3733, 4759-4789, 5329-5335).
9. `[med]` Unbounded orb-style glow on every alight book, no viewport cap — pre-dates §8 but blocks a compliant recipe-2 conversion (components.css:11349,11361).
10. `[med]` Dead `:focus-visible` rules target retired classes; live Shelf controls (`.btn`/`.chip`/`.seg-opt`/`.shelf-filter`) have no themed keyboard-focus treatment (components.css:4001-4022 vs. 11283-11399).
11. `[med]` Filters are exclusive across ALL sections, not per-section — a reader can never combine two facets at once (views.js:5276-5292).
12. `[Decided, imported]` Taxonomy is live but its "manual override" half is unbuilt (views.js:4531-4532).
13. `[Hygiene, imported]` Dead `.shelf-new-book`/`.shelf-header`/`.shelf-headline` rules confirmed (components.css:1135-1188, 0 live matches).
14. `[LOW, imported]` SH2 — toolbar blur still present (components.css:11302).
15. `[LOW, imported]` SH3 — 9.5px status label still present, below the small-type floor (components.css:11352).
16. `[low]` Silent LLM-classify trigger on the Categories tab, no consent/disclosure copy (views.js:4414).
17. `[low]` Three golds conflated (no active gilding-fill violation, but no gilding treatment exists to check) (components.css:11304,11311,11323,11352).
18. `[Gate, imported]` Preston's pending eyeball of live-library category accuracy — not a blocker, still open.
19. `[low]` No sort control (views.js:4679-4681); shelf-count omits will-read/Unread (views.js:3813-3817 vs. 4142-4149); 5 code-health items (duplication ×2, dead shelfRailOpen, stray console.log, stale contradictory comment).

**(b) Proposed round scope**

IN SCOPE (this is the R2 "prove Universal + §8 on one live surface" round):
- Convert `.shelf.lum-amber-deep` to the Universal v1.2 semantic set + §8 depth recipes — the round's stated purpose. Land recipe 2 (luminous orb) on the rmark/status dots WITH the restraint cap from day one (finding #9), not retrofitted.
- SH1 toolbar declutter, SH2 blur removal, SH3 type-floor bump — same CSS block already being touched by the conversion, low incremental risk.
- Hygiene sweep of the confirmed-dead `.shelf-new-book`/`.shelf-header`/`.shelf-headline` rules — same file, same pass, prevents the conversion from stacking on top of known-dead selectors.
- The dead focus-visible rule set (#10) — direct casualty of the same skin conversion; re-point or rebuild alongside the recipe work rather than leave a second stale rule set behind.

OUT OF SCOPE (defer to a dedicated round):
- The full Shelf-categories feature arc (rawCategories capture across every write path, duplicate-add guard, batch progress, manual override + book-detail picker, lineage extension, re-classify scoping) — a data-model/product build, not a visual-system conversion; bundling it here blows the round's blast radius and mixes concerns. Recommend its own round off the "Shelf / categories" ledger cluster.
- Full re-render/pagination performance fix (#8) — a real architectural change (windowing or incremental patching) touching the whole render loop; too large for a visual round.
- Filter exclusivity → faceted-filter redesign (#11) — a genuine interaction-model change; needs Preston's call (see Fork 4), not a mechanical fix.
- Sort control addition, will-read/Unread header fix, consent copy for the Categories LLM trigger — small but genuinely new feature/copy decisions, not visual-conversion work; queue for the categories round or a quick separate pass.
- Author-rail dedup fix (#7) and the code-health items — small and contained, but not required by the depth-law conversion; safe to fold into this round as a low-risk bonus IF Preston wants it, otherwise a fast follow-up.

**(c) Forks — for Preston**

1. **How far does this round push the Shelf's §8 conversion?**
   - **A) Full conversion** — atmospheric ground + gilded hairlines on cards + luminous orbs replacing the rmark/status dots + glyph-language ticks, all in one round.
   - **B) Orbs-only** — convert just the state/read dots (rmark, status pill) to the luminous-orb recipe: highest-visibility, lowest-risk slice; ground/hairline/glyph wait for a follow-up.
   - **C) Ground-first** — convert the page atmosphere + card gilded hairlines first (the biggest "does it feel different" proof), defer the orb conversion.

2. **The toolbar SH1 overshoot — which target?**
   - **A) Cut to canon 4-E's literal 3 chips** (Scan shelf / Bulk add / Resolve covers); relocate Scan barcode + Tidy library elsewhere (overflow menu, or move Tidy library to Account/Settings).
   - **B) Merge to 4** — fold Scan shelf + Scan barcode into one "Scan" chip with a mode picker; move Tidy library into the Filters drawer/overflow.
   - **C) Leave all 5** as-is (accept the canon overshoot) — treat SH1 as resolved-by-judgment since all 5 are real, load-bearing, frequently-used actions.

3. **The always-visible desktop filter sidebar — restore the collapsible affordance, or retire it?**
   - **A) Wire up shelfRailOpen for real** — desktop Filters becomes a genuine collapse/expand toggle, matching the code's evident original intent.
   - **B) Delete shelfRailOpen and the dead branch** — commit to "sidebar is always visible on desktop" (today's de facto behavior) and simplify the code to match.

4. **Filter combination — keep exclusive-single-select-across-everything, or move to real facets?**
   - **A) Keep as-is** — one filter total, from any section; zero behavior change, matches current code exactly.
   - **B) True faceted filtering** — AND across DIFFERENT sections, single-select WITHIN a section (matches the stale 3.10b-era comment's original intent and conventional library-UI behavior); a real interaction-model change.

**(d) Blast radius:** `assets/components.css` (the `.shelf.lum-amber-deep` block, ~11283-11399, plus the dead legacy `.shelf-*` rules ~1120-4061 if the Hygiene sweep is folded in) and `js/views.js` (renderShelf + renderShelfBook + renderShelfBookRow, ~3730-5275) for any toolbar/orb/tick markup changes. **The RAILS ARE near this round**, contrary to the initial ground map: renderShelfBook (views.js:4981) and renderShelfBookRow (views.js:5044) both set the `--tick` seam off `--register-*`; Fork 1's choice on recipe 8 (glyph color language) determines whether this round actually touches it. No other surface's CSS or JS is in scope — `.shelf.lum-amber-deep` is fully scoped and renderShelf's card helpers have no callers outside the Shelf.

### Cross-check reconciliation addendum (2026-07-08)

An independent read-only cross-check audit (7-lens fleet + adversarial verification) corroborated this ledger on the core set — the imported SH1-3 and "Shelf / categories" findings, and the studio-scan findings on §8 non-adoption, the rails correction, the dead focus-visible rules, and the no-pagination/orphan-author-rail pair — and independently re-verified every CX-* item added above against the code this run before appending it. Nothing was found to NOT reproduce; all 16 CX findings plus both re-grades stand as appended.

1. **Agreement.** Both audits converged on the same core set of gaps (toolbar overshoot, categories-feature incompleteness, §8 non-adoption, no-pagination, the dead rules). The cross-check ADDED the 16 CX-* findings above and ELEVATED two already-recorded studio-scan findings to HIGH: the Author filter rail (not orphan/duplicate-safe — re-graded because a stale author count that yields zero rendered cards is a direct "rendered count == stored count" violation, not just cosmetic inflation) and no-pagination/virtualization (re-graded because renderShelf is confirmed as the SOLE update path across 40 call sites in views.js, each one a full teardown + ~9 O(n) passes + a full notebookEntries/subTheories walk).

2. **THE HIGH DATA-CORRECTNESS CLUSTER.** CX-1 (Tidy-library merge omits 4 of 8 reference-scrub steps deleteBook performs, and never tombstones the dropped ids — confirmed resurrection risk via mergeRemoteBookDoc's remote-wins path, integrations.js:762-775), CX-2 (no dedup-on-add guard anywhere — single add and bulk-paste title lines both write unconditionally), and the elevated Author-rail finding are this surface's top-severity gaps, ahead of anything visual. Per FIX-PROTOCOL discipline these ship as their OWN commit — a dedicated data-correctness round — never bundled into the R2 visual/§8 conversion round. Preston calls whether that data round runs immediately before or after the skin round; either order is defensible (the data bugs are pre-existing and independent of the skin, but fixing them first means the skin round works on a surface whose counts and merge behavior are already trustworthy).

3. **CX-5 folded in as the gating first slice.** The §8 structural prerequisite — `docs/studio/universal-depth.css` is not linked in `index.html` and `--gold-hi`/`--field-1..10` are undefined anywhere in `assets/` — is now the FIRST slice of the in-scope conversion in this round's scope, ahead of any recipe (Fork 1's options A/B/C all depend on it). Without this slice, no `.u-*` class is wireable at all.

4. **In-scope WCAG fixes (one defensible answer each — decisions, not forks):** CX-6 (aria-pressed/aria-selected on filter rows; complete the Covers|List tablist to match the Lenses|Categories seg's existing pattern), CX-7 (aria-expanded/aria-controls on the Filters button; basic focus-in on mobile-drawer open), CX-8 (bump `.shelf-filter .n` and the search placeholder off `--lum-ink-3`/`--lum-ink-4` onto a token that clears 4.5:1 against `--lum-base`), CX-9 (role="list"/"listitem" on the grid/rows + cards; align the list-view row to a heading element to match the grid's `<h2>`; resolve the h1→h3 skip) — all ride the same touched render/CSS as the §8 conversion, each with one clean fix, not a design question. CX-10 (add the "Clear filters" control the empty-state copy already promises) and CX-11 (keep the mobile drawer open across a filter pick) are in-scope targeted UX fixes for the same reason — small, contained, in the exact code region already being touched.

5. **Waits.** Product: CX-12 (genre editable only at add-time), CX-15 (bulk-paste has no preview/confirm; classify has no batch progress), CX-16 (no granular reading-progress field) — real gaps, but new feature surface, not a visual-conversion or WCAG fix; queue with the deferred Shelf-categories round. Low-severity/self-healing: CX-13 (transient focus theft from an unrelated background re-render) and CX-14 (no dedicated "clear all filters" — largely mitigated once CX-10 ships) — noted, not blocking, revisit if they still itch after the in-scope fixes land.

6. **Fork 5 — Recipe-8 (kind-hue, book=russet) and the per-book tradition tick.** This round the tick is the legacy `--register-*`/`--tick` RAIL (views.js:4981, 5044) — an architecture fork, never carried silently:
   - **A) Leave the rail byte-identical** — defer Recipe-8 to a dedicated glyph round; the tick keeps sourcing `--register-*` exactly as today.
   - **B) Add a separate kind-glyph alongside the existing tick** — a new book=russet `--field-10` marker rendered next to (not replacing) the current tradition tick; zero risk to the rail, but two color systems visible on one card.
   - **C) Migrate the tick itself onto `--field-*`** — rewrites the two `setProperty('--tick', ...)` call sites and remaps all 27 legacy register hues to the field spectrum; the clean single-system outcome, but the largest, most rail-adjacent change of the three.
