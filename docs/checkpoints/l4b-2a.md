# L4b-2a — Open Lens, the page (`#lens/<id>`) — v3.329

17 Nov 2026 · Opus 5.5 executing an already-written, already-tested patch (the review chat's, on a clean clone of
main at 6c31f48). Base: HEAD `6c31f48` (the L4b-1 hotfix, v3.328) == origin/main. Ruling r90, drawn in "Praxis Open
Lens 4" (`docs/checkpoints/p2-eighteenth-sitting-rulings.md`). The category page (`#category/<id>`) is NOT in this build.

## The four rulings (Preston, 17 Nov 2026, all at rec)

1. Two builds: Open Lens first (this one, v3.329), the category page second (L4b-2b, v3.330).
2. A tap on a lens still opens the lens sheet. The sheet's "Open lens" pill, which until now only showed a placeholder
   toast, opens the page.
3. The band at the top of the page is TODAY'S sky colour (`--sky`) with that lens's own colour glow over it. It turns
   blue when LC2 changes `--sky`. No blue in this build.
4. (For L4b-2b, recorded only.) The category page opens from the Shelf's category heading and from the You-sky
   category orb.

## What was built

A new route, `#lens/<id>`: one kept lens as a page. A band of today's sky with the lens's colour glow (its mark, its name,
"From Yumi · n books · n notes", Back to the room it was opened from, a ••• menu: Rename · See on the shelf · Let it go);
Yumi's question as the largest line with one button to Yumi ("Think it through with Yumi", the say-back) or, for a lens of
the reader's own she has not read, "Ask Yumi to read it"; **Yours** (the why line, what you said back, Let her forget this);
**Her reading** with the covers at size (Edit puts a minus on each kept cover, disabled at the floor of two; a left-out cover
stays, dimmed, with Put it back); **Notes** on the lens's books (All / Marginalia / Questions; never the Journal, never another
reader's). One column; two from 1000px (it fires at Preston's 1360).

views.js (9 edits): `tabbarTabFor` lights the origin's tab · renderRoute bookkeeping (`lxLastRoute` never records a `#lens`
route; `olFrom` set from a room, kept when coming back from a book or note; `olSt.fresh` on arrival; `olPrev`) ·
`umberGroundDark` gains `lens` · the top nav treats `lens` like `lenses` · the `lens` route branch (bare `#lens` →
`location.replace('#lenses')`) · three module vars `olFrom` / `olPrev` / `olSt` · `lxAfterLensWrite` re-renders on `#lens`
· the sheet's pill → `#lens/<id>` · new functions `olRoomRoute`, `olFromLabel`, `olNotes`, `olNotesOf`, `olSect`,
`olCovers`, `olBar`, `renderOpenLens`. components.css: one block "L4b-2a OPEN LENS", every rule under `.lx.ol`, no hex.
sw.js: `praxis-v3.328` → `praxis-v3.329`.

The page writes ONLY through what the lens sheet already uses: `renameUserTheme`, `lensLeaveOut`, `lensPutBack`,
`lensSetWhy` (its first caller), `lensForgetSaid` / `lensRestoreSaid`, `letGoLens` / `undoLetGoLens`, `lxAskToRead`,
`YumiUI.openLensSayBack`. No new field, no new storage key, no state.js change, no new model call.

## Stage 0 — pre-flight (read-only)

| # | Check | Result |
|---|---|---|
| 0.1 | Protocol docs | Found `CLAUDE.md`, `PROTOCOL.md` v1.2, `docs/FIX-PROTOCOL.md` v1.3, `hooks/pre-commit`, `.claude/agents/` (7). Missing: a root `FIX-PROTOCOL.md` (it lives in `docs/`). `tools/ground-truth`: HEAD 6c31f48, hook ARMED. |
| 0.2 | Git | clean (tracked), HEAD `6c31f48` on main == origin/main (after fetch) |
| 0.3 | EOL | `core.autocrlf=true`; working tree CRLF (`i/lf w/crlf`), blobs CR=0 — the gate is the LF blob |
| 0.4 | Before | views.js 1,370,115 `1fe5a560…` · components.css 934,229 `25abcea7…` · sw.js 6,894 `c40a5368…` — all match |
| 0.5 | Patch | 38,871 B · 646 lines · md5 `7a6685c826d73b48bbe8ca34b2b34fd2` · 555+/5− · CR 0 · no BOM — match |
| 0.6 | Dry apply | `git apply --check` passes (worktree and `--cached`); in a scratch LF copy: all three after-numbers match exactly |
| 0.7 | Anchors (once each) | :411 `p0 === 'home' \|\| p0 === 'lenses'` · :580 `parts[0] !== 'lenses'` · :619 `lenses: 1 };   // L4.3` · :26812 `var lxSheetRoute = '';` · :27556 the pill + toast · :27589 `"Ask Yumi to read it" (S12)`. None of the 11 new names nor ~44 new `ol-*` classes pre-exist |
| 0.8 | Dependencies | all present and global with matching signatures (state.js :1453–3253; views.js `buildSignedOutPrompt` :2668, `notebookRegisterLabel` :3160, `openShelfFocusedBand` :5788, `lx*` :26814–27591; `PraxisHand.formSvg/hash` hand.js :463–464; `YumiUI.openLensSayBack` yumi-ui.js :1793); load order state → yumi-ui → hand → views |
| 0.9 | Hook dry-run | no BLOCK (#3 sw.js present, #5a static `--ol-lens`, #5b no hex, #5c no dependency); one false WARN (#4: the string "let go.") |

## Stage 1 — apply

| File (LF blob) | Expected | Actual | Blob = patch index line |
|---|---|---|---|
| js/views.js | 1,391,437 · `9cc98032…` | **1,391,437 · `9cc980325701cc942e309c1924e91905`** | `2e37885` ✓ |
| assets/components.css | 945,953 · `bb01391f…` | **945,953 · `bb01391f98ee142bc06f1f74c5adc71f`** | `9824cb0` ✓ |
| sw.js | 6,894 · `fd6cc5e7…` | **6,894 · `fd6cc5e7f578880c4beb04a0411c1a11`** | `6a9742b` ✓ |

The patch landed exactly as written; no line of it was changed. Later, on Preston's ruling, three CSS lines were added
after it (F1/F2; see "Fold-in" below). The committed components.css is therefore 946,265 B, not 945,953.

`git diff --stat`: 3 files, 555 insertions, 5 deletions. Every must-be-unchanged file matches (state.js `47eaa565`, index.html
`addda80d`, app.js `76112a87`, yumi-ui.js `ab4d4160`, yumi-brain.js `5241349a`, integrations.js `ce40d6e0`, hand.js `fd51ca7e`,
theme.css `571e0ccc`, lumen-amber `631bc2aa`/11,953, marks.js `772886c0`/10,255). `git ls-files --eol` still `i/lf w/crlf`.
**No line of the patch was changed.**

Parse: `cscript //nologo //E:jscript tools/parse-check js/views.js` → `PARSE OK`, exit 0; the harness fails a broken copy
(`null => 1` injected → `PARSE ERROR`, exit 1). Convention scan of the 439 added JS lines: const 0 · arrow 0 · class 0 · backtick 0
· `.forEach/.map/.filter/Object.keys/.trim/.includes/Array.isArray` 0 · `let` 1 (the string "let go."); added CSS: hex 0, every
selector under `.lx.ol` (plus `@keyframes ol-drift`, a new unique name; `ripple/grain/turn/morph/tilt` are existing keyframes).

## Stage 2 — test

### 2.1 Existing harnesses (cscript, all exit 0)

lens-eval **68/68** · lens-data **101/101** · export **58/58** · delete **58/58** · ceiling-core **36/36** · fx1c-sim **60/60** ·
L4b-1 hotfix unit **46/46**. Counts unchanged.

### 2.2 New unit harness — `docs/checkpoints/l4b-2a-shots/unit-harness` — **71/71**, exit 0

Extracts `tabbarTabFor`, `olRoomRoute` … `olNotesOf` and renderRoute's L4b-2a bookkeeping block BY TEXT from the real bytes
of views.js (anchors must be unique; against HEAD 6c31f48 it refuses to load, exit 2). U1 olRoomRoute 22 · U2 olFromLabel 10 ·
U3 olNotes 12 (Journal never listed even when it carries a lens book; another reader never; a left-out book's note listed;
newest first, equal times by id; a duplicate / stale book id lists a note once; bookless and malformed skipped; no
`notebookEntries` → []) · U4 olNotesOf 5 · U5 tabbarTabFor 12 (books → shelf, profile → you, lenses → home, search →
tabbarSearchFrom else home, bare `lens` falls through to notebook, category falls through — L4b-2b owes its line) · U6 the
bookkeeping 10 (fresh only on a route change; olFrom kept across book / note / lens→lens; lxLastRoute never a lens route).
Note fixtures carry `captureNote`'s exact field set.

### 2.3 The rig and the screenshots

Rig: `.claude/rig/serve.ps1` on localhost:8858 serving this working tree; SW + caches cleared and `localStorage` cleared in
the Browser pane; signed out of Firebase with the `d0tester` stub (`praxis_user`); the l4 fixture
(`.claude/rig/captures/l4-fixture.js`: 20 books, 16 lenses, 12 notes, yes granted) + `l4b1-rig.js` (proxy stubbed to reject,
intro flags set, transitions/animations off) + **`.claude/rig/captures/l4b2a/l4b2a-rig.js`** (untracked), which adds four
lenses in `createUserTheme`'s record shape run through `ensureThemeFields`: `th_ol_read` (hers, read: lead / q / close /
clauses keyed by book id, 4 books, 2 said lines, a why line), `th_ol_two` (hers, read, exactly 2 books), `th_ol_mine`
(yours, never read, 3 books), `th_ol_pale`; looks from `ensureLensLooks`. Everything in memory + the rig origin's
localStorage; nothing reaches Firestore.

Captures: `.claude/rig/captures/l4b2a/l4b2a-shots.ps1` (untracked) — headless Chrome over CDP, 390×844 dpr 2 mobile and
1360×900 dpr 1, Day and Night, full-page JPG; **each capture is gated on a DOM check** printed beside it (menu / confirm /
rename / minus count / why / gone / sign-in / mood / width — all as expected, 0 console errors). For the full-page frames
the position:fixed chrome below the nav (tab bar, flower, Capture +) is hidden, because a full-page capture paints it at the
viewport line mid-page; `end-390-{day,night}.jpg` are viewport frames scrolled to the end WITH the tab bar. All taken fresh
17 Nov 2026 against the applied bytes (v3.329 served).

`docs/checkpoints/l4b-2a-shots/` — `<state>-<390|1360>-<day|night>.jpg` for: `read-full` (a lens Yumi has read) ·
`menu-open` · `letgo-confirm` · `rename` · `edit` (minus buttons) · `two-books` (minus disabled, "A lens rests on at least two
books.") · `mine-unread` ("Ask Yumi to read it") · `why-editor` · `gone` (`#lens/nope`, "This lens isn't on your shelf.") ·
`signed-out`; plus `end-390-day.jpg`, `end-390-night.jpg`. 42 images, 6.8 MB.

### 2.4 Measurements at 390

| Measure | Result |
|---|---|
| `scrollWidth` == viewport | **390 == 390** on all ten states (and in every R10 edge case) |
| band full width | left 0, width 390 (`margin:0 -20px`) |
| last note row clears the tab bar at the end | last row bottom **564**, tab bar top **778** — clears by 214 (`end-390-*.jpg`) |
| every control ≥ 44 px | **yes** on all ten states (19–23 controls each), except the signed-out "Sign in" `.btn-primary` **80×38.7** — the same size on `#lenses` (`buildSignedOutPrompt`), so it is not from this patch |
| 1360 | two columns (`min-width:1000px` matches); left 400 sticky, right 596; band 400×328 |

**Contrast on the band** (the number the review chat could not take). Method: resolve `--sky`, `--on-night` and the three
gradient stops through the browser (`color-mix` as computed), composite the radial gradient over the sky exactly as the CSS
declares it (58%×38% at 50% 40%, stops 0 / 34 / 62 / 100%, premultiplied interpolation), and take the WORST ratio over a
5×3 grid of points across each text element's box. Text-shadow ignored.

*At the glow's centre itself* `--on-night` (#FBF4E6) would read **1.27:1** on the palest lens colour (#F3E6C8), 1.57 on
#9CC7F0, 1.63 on #EDB52F, 1.60 on the default `--gold-star`, 2.83 on the darkest (#a15273) — **no text sits there**: the
centre is behind the mark. Under the text itself (17 lens colours measured, palest to darkest):

| Element | 390 Night | 390 Day | 1360 Night | 1360 Day |
|---|---|---|---|---|
| lens name (h2) | **14.73** (palest) … 16.02 | 12.65 … 14.01 | 15.11 … 16.16 | 13.01 … 13.36 |
| "From Yumi · n books · n notes" | **16.82** (outside the glow, d 1.27) | 14.79 | 16.82 | 14.79 |
| Back label (`--gold-star`) | 9.12 … 9.76 | 7.85 … 8.54 | 9.41 … 9.87 | 8.14 … 8.29 |
| ••• | 9.45 … 9.89 | 8.18 … 8.66 | 9.73 … 9.99 | 8.47 … 8.56 |
| rename field (open) | 10.26 … 14.2 (ignores the field's own darker fill) | — | — | — |
| "Use her words" / Cancel | 10.16 | — | — | — |
| a 60-char name wrapping to 3 lines (#B7C24A) | 11.17 (d 0.65 — the closest text gets) | — | — | — |

Day `--sky` is #2B1E12, Night #1C120A. Every measured text on the band clears 4.5:1 by at least 1.7×; the floor is set by
the gold Back label in Day (7.85).

### 2.5 The walk (UI-driven: real clicks on the rendered page, 390, Night)

| # | Walk | Result | Evidence |
|---|---|---|---|
| i | Shelf → lens mark → sheet → Open lens → page; Back says Shelf, returns there; Shelf tab lit | **PASS** | `#lens/th_ol_read`, sheet closed, Back "Shelf" / aria "Back to Shelf", tab `shelf`, Back → `#books` |
| ii | Home sky → lens → sheet → page; Back says Home | **PASS** | orb "Love as a discipline. 6 books. Opens the lens." → `#lens/th_l4_05`, Back "Home", tab `home`, → `#home` |
| iii | Lenses → row → sheet → page → Back → Lenses → its own Back does not return to the page | **PASS** | page Back "Lenses" → `#lenses` → its Back → `#books` (lxLastRoute `books`) |
| iv | page → Open the book → browser Back → page: same cover, Edit off, menu closed, Back still the origin | **PASS** | pre: cover 3 picked + Edit on + menu open → `#book/bk_l4_05` → Back → pick "All About Love", minus 0, menu none, Back "Shelf", tab shelf |
| v | page → a note row → `#note/<id>` → browser Back → page | **PASS** | `#note/nb_l4_10` rendered → Back → page, Back "Shelf" |
| vi | See on the shelf → Shelf in Lenses grouping, that lens's band focused | **PASS** | grouping set from `categories` to `lenses`; `#shelf-focused` holds "Love as a pedagogy · 4 books"; horizon hidden |
| vii | Let it go → origin with the Undo toast; Undo restores and the origin re-renders | **PASS** | from Shelf: `#books`, lens gone, shelf marks for it 0, toast "Let go. Its books stay on your shelf. Undo" → Undo → restored, shelf mark 1 |
| viii | minus → Undo; minus again → Put it back under the dimmed cover | **PASS** | 4 → 3 kept + 1 dimmed + toast → Undo → 4; again → pick the dimmed cover: "left out, still on your shelf" + Put it back → 4. (Put it back APPENDS to `bookIds`, so the cover order changes — state.js `lensPutBack`, shared with the sheet.) |
| ix | the page opens at its top; Back to the origin restores the depth left | **PASS** | Shelf at 7711 → page scrollY 0 → page's Back → `#books` at 7711 |

Extra, not asked: the BROWSER's Back from the page to `#books` comes back at 1623, not 7711 — and so does every other
destination (`#book/<id>` 1284, `#notebook` 975), so it predates this patch (ledger L-9).

## Stage 3 — red-team

Two passes: my own (R1–R10 below, each with rig evidence) and **fix-red-team** (FIX-PROTOCOL §9; Sonnet, frontmatter-pinned;
Preston lifted the agent bar in the go-ahead, "Go, run red-team"), dispatched on the frozen applied tree with the code and the
questions, not my findings. It re-ran parse-check (PARSE OK, exit 0) and confirmed scope (3 files). Its verdict, verbatim:
"RED-TEAM: findings (no data-loss, consent or cross-route-paint BLOCK found; two MAJOR CSS defects should be fixed before
commit)." The two passes agree on F1–F3; F4 and F5 are the agent's, F4 reproduced in the rig. **No BLOCK by this build's
definition (data loss, consent breach, crash, painting over another route), so no line was changed.**

### Findings

F1 and F2 are **FIXED in this commit** (Preston, 17 Nov 2026: "Fold in F1/F2"; see "Fold-in" below). F2b–F8 stay in the
ledger.

| # | Sev | Finding | Evidence | Smallest fix (F1/F2 applied at the fold-in; the rest NOT applied) |
|---|---|---|---|---|
| F1 | **MAJOR** | The page's own reset `.lx.ol button{…border:0;background:none…}` (specificity 0,2,1) beats `.lx .pill` and `.lx .ghost` (0,2,0, components.css :17567–17568) and `.btn-primary` (0,1,0). Three reused buttons lose their look: the why editor's **Keep** pill has no fill, so its `--on-gold` text (#2B1B10) sits on the dark card — **invisible in Night**; the signed-out **Sign in** loses its gold — **invisible in Night**; **See your lenses** (the gone state) loses its border and reads as plain text | computed: Keep bg `rgba(0,0,0,0)` (on `#lenses` a `.pill` is `rgb(242,183,46)`); Sign in bg transparent on `#lens`, gold on `#lenses`; ghost border 0 vs 0.67px; shots `why-editor-390-night.jpg`, `signed-out-390-night.jpg`, `gone-390-day.jpg` | one line appended inside the block: `.lx.ol .pill{background:var(--gold)}.lx.ol .ghost{border:1px solid var(--line)}.lx.ol .btn-primary{background:var(--grad)}` — tested in the rig by an injected style: Keep gold, **9.15:1**, Night and Day; Sign in gold; ghost border back; `.ol-top .ghost` (0,4,0) unaffected |
| F2 | **MAJOR** | No global `box-sizing`; `.lx.ol .ol-rw` (`width:100%` + 14px padding) on the said-back and why rows (divs; the button rows are border-box by UA) runs **28px past its card**, clipped by `overflow:hidden`; the why textarea (`width:100%` + 24px padding) runs **38px past** (374 in a 350 card); Cancel is 44 of its 58px visible | rows 20..398 in a card 20..370; text box to 384; a long said line's glyphs measured 3–10px past the clip (a word ending in the last 14px is cut); textarea 34..408 | `.lx.ol .ol-rw,.lx.ol .ol-why textarea{box-sizing:border-box}` — tested: rows end at 370, textarea at 356, Cancel inside the card |
| F2b | NIT | Same cause on the band's rename line (`width:calc(100% - 20px)` + 18px padding): 368 wide instead of 350 | 11..379 in a 390 band — centred (11px each side), **not lopsided** as the agent wrote | add `.lx.ol .ol-band .lx-line` to F2's selector |
| F3 | MINOR | Every action re-renders the whole page (`host.innerHTML=''`), so focus falls to `<body>`: opening the menu, Edit, a cover, a chip, Escape out of rename. The menu takes no focus, has no Escape and no outside-tap close (the ••• toggles it) | rig: `document.activeElement` = BODY after each; Escape on the menu: still open. No written a11y rule in the repo, but the practice is Escape-to-close (17 `key === 'Escape'` handlers in views.js, the lens sheet among them) — so a ledger item, not a rule breach | re-focus the acted-on control after `rerender` by a stable `data-` hook; Escape on `.ol-menu` closes it and focuses `.ol-more` |
| F4 | MINOR | Leave the page and come back while "Ask Yumi to read it" is in flight: `fresh` resets `asking`, the button re-enables, a second tap fires a **second model call** (same call type, no new kind) | rig with `generateLenses` held open: 1 call → `#books` → back → button enabled → tap → **2 calls** | keep `asking` across the fresh reset when `olSt.id` is unchanged (or an in-flight guard in `lxAskToRead`) |
| F5 | MINOR (latent) | `olNotes` excludes only `journal`; an entry with an unknown or missing register would list under All, labelled "Journal" by `notebookRegisterLabel`'s default | code; real registers are marginalia / question / journal only | whitelist marginalia and question |
| F6 | NIT | Unsaved text in the rename field or the why editor is lost on any re-render (a toast Undo, a cover pick); with the why editor open, a re-render also re-focuses the textarea | rig: after a cover pick focus = the why textarea | carry the draft in `olSt` |
| F7 | NIT | A lens whose books have all left the shelf says "3 books", shows Edit with nothing to edit, and shows her reading with no covers | R10 rig | count `shown`, hide Edit when `shown` is empty |
| F8 | NIT | A bare `#lens` lights the Notebook tab for one render before the redirect lands on Home (`tabbarRoute` runs before the lens branch) | MutationObserver: `notebook>home` | none needed until L4b-2b touches `tabbarTabFor` |

### The ten questions

- **R1 — no path paints Open Lens over another route.** Only `renderRoute` (which renders the CURRENT hash) and the page's
  `rerender()` (which checks `r[0]==='lens' && r[1]===themeId`) ever call `renderOpenLens`. `lxAskToRead`'s done →
  `rerender`; the forget / leave-out toast Undos → `rerender`; the say-back's onDone and the let-go Undo → `lxAfterLensWrite`,
  which re-renders only the route the reader is on. Both passes found no escape. The one late-callback gap is F4 (a double
  read, not a mis-paint).
- **R2 — confirmed.** `olSt.fresh` is set only when `olPrev !== rest` (unit harness U6: same-route re-render → `fresh` false,
  `olFrom` kept); the new `olSt` object carries no `fresh`, so the flag is spent on use. A same-route re-render keeps Edit, the
  open why editor, the notes filter and the menu (walk viii: Edit survives the toast Undo). It loses typed-but-unsaved text,
  focus, and the covers row's scroll (F3, F6).
- **R3 — no flash.** `letGoLens` → `olSt = {id:null}` → toast → `location.hash = origin`, all synchronous; the hashchange is
  async, so nothing renders between (rig: a MutationObserver saw the "isn't on your shelf" node 0 times during the let-go). The
  browser's Back afterwards lands on `#lens/<id>` and shows "This lens isn't on your shelf." with Back still naming the origin —
  right. Undo pressed there (the toast is still up) → `lxAfterLensWrite` → the page re-renders as the restored lens — right.
- **R4 — no leak.** The listener is added only right before `location.hash = '#books'`, and the page is never on `#books`, so
  the hashchange always fires and the listener removes itself on it; a hash assignment cannot be cancelled. The
  already-on-#books guard `lxOpenShelfCategory` needs is unnecessary here. Off the shelf, `openShelfFocusedBand` returns
  (no `#shelf-focused`). Note it rewrites the reader's stored grouping to `lenses`, as `lxOpenShelfCategory` does to
  `categories` (walk vi).
- **R5 — sound.** `olPrev='lens'` is not a room, so `olFrom` is untouched; `replace` leaves no `#lens` entry, so Back from
  `#lenses` cannot loop; `routeTopOnHash` sees an unstamped entry and opens `#lenses` at its top (rig: scrollY 0,
  `history.state.praxisRoute` stamped, tab `home`). Two costs: the one-render Notebook mark (F8), and the Lenses page's own Back
  then returns to the shelf at 0, not the depth left (the replace pattern the L4b-1 hotfix ledger already names).
- **R6 — no consent breach; confirmed.** A theme's `.why` is written at state.js :906 (default), :3086 (`''` on keep) and :3192
  (`lensSetWhy`), and read only by the sheet (views.js `lxQuestion`) and the page. The lens read sends book metadata +
  `themeLensNames:[name]`; the say-back sends name / lead / close / q / bookIds + the reader's one line
  (`buildLensReReadMessage`, yumi-brain.js); `letGoLens` moves said lines (not why) to `readerModel.lensWords`; integrations.js
  only syncs the theme to the reader's own `/userThemes/{uid}` doc and the export. Every other `.why` in js/ and netlify/ is
  `valueMarks[].why` or the model's own output (yumi-brain.js :1530). "Kept with the lens" is true. Notes: `e.userId === uid`
  and `register !== 'journal'` (unit U3; F5 is the latent edge).
- **R7 — no reader or model text reaches innerHTML or a style.** Every string goes through `lxEl` (textContent), `.value`,
  `placeholder` or `aria-label` via setAttribute; `img.src` is a cover URL on an `<img>`. innerHTML: four fixed SVG strings,
  `lxSeed()` (`yumiSeed`, fixed), and `PraxisHand.formSvg(t.look, hash(t.name), box)` — the name only hashed. **Residual,
  pre-existing:** hand.js `form()` writes `look.c[0..]` into SVG markup unescaped (`halo(…, c[0])`, `lay(d, c[0], …)`); the
  page's own `--ol-lens` is hex-tested, formSvg is not. Same exposure as the sheet / sky / shelf marks (owner-only data). L-8.
- **R8 — outward: nothing.** No existing `.lx` rule, `[data-ground="dark"]` remap or L4b-1 phone rule touches the page (0 hits);
  no `.lx.ol` rule can match outside it (only `renderOpenLens` makes `lx … ol`). **Inward: F1 and F2** — the page's reset
  changes three reused buttons, and the screenshots taken before the fold-in showed it. Fixed at the fold-in below.
- **R9 — order is the DOM's and is sensible:** Back · ••• · (menu items) · Think it through · the why row · Let her forget this ·
  Edit · the covers (a `group` "The books in this lens", `aria-pressed`) · Open the book · See all · the three chips
  (`aria-pressed`) · the note rows. The menu is `role=menu` / `menuitem`, ••• carries `aria-haspopup` / `aria-expanded`; the
  mark is `role=img`. The rename field and the why textarea take focus when opened (rig: activeElement = the input / the
  textarea). Escape closes rename. Escape does not close the menu: not a written rule here, a ledger item (L-4), and F3.
- **R10 — no crash, no sideways scroll in any case.** Books all missing: no covers, "3 books", Edit (F7). 40 books: 40 covers,
  a 5,148px swipe row at 390, wrapping from 1000px; 40 minus buttons in Edit; scrollWidth 390. A 60-char name with no spaces:
  wraps to 3 lines (`overflow-wrap:anywhere`), 370 wide inside the band, name contrast 11.17; rename `maxLength` 60. A 500-char
  said line: one 333px row, no clamp. A 5,000-char note body: clamped to 3 lines (74px). Console clean throughout.

### praxis-reviewer (Sonnet, the commit gate)

**PASS — "cleared to commit, with F1/F2 as Preston's open ruling."** (That ruling is now made: fold them in; see
"Fold-in" below and its re-check.) Measured itself: the three after-numbers (exact), deltas
+21,322 / +11,724 / +0 and numstat 555+/5−, the ten unchanged files (`git diff HEAD` empty), sw.js one line, EOL `i/lf w/crlf`,
`git diff --check` clean, parse exit 0, ES3 / hex on the added lines, harnesses 71/71 · 46/46 · 101/101 (exit 0), spot-checked
anchors, the four docs consistent with each other and the code. Not re-run by it: the 42 shots, the contrast figures and the
walk (rig evidence, this record's). Persistence unverified (the rig is signed out).

## Fold-in — F1/F2 (Preston, 17 Nov 2026: "Fold in F1/F2")

Three lines appended inside the L4b-2a block, just before its end marker (components.css :17925–17927), after the patch.
No other line changed:

```css
/* F1/F2 (red-team, Preston 17 Nov 2026): the button reset above strips reused fills; rows and the textarea need border-box. */
.lx.ol .pill{background:var(--gold)}.lx.ol .ghost{border:1px solid var(--line)}.lx.ol .btn-primary{background:var(--grad)}
.lx.ol .ol-rw,.lx.ol .ol-why textarea{box-sizing:border-box}
```

- **Size:** components.css 945,953 → **946,265 B** (+312), md5 `fee4f1a82f999ce4b276ca8a0ee5284d`, blob `7d5dec3`. EOL `i/lf w/crlf`.
- **No hex** in the three lines (grep 0).
- **Scope:** every selector starts with `.lx.ol`. The only element with both classes is `renderOpenLens`'s
  `lxEl('section', 'lx lx-page ol')` (views.js :27711), so nothing outside the page can match.
- **Rig check** (Browser pane, CSS reloaded, the rule found in the loaded CSSOM):

| Check | 390 | 1360 |
|---|---|---|
| Keep, why editor | gold `rgb(242,183,46)`, ink `rgb(43,27,16)`, **9.15:1**, 256×44, Night and Day | the same, 306×44 |
| Sign in, signed out | filled gold (`--grad` resolves to `#F2B72E` here), ink, 80×39 | the same |
| See your lenses, gone | border back: 1px `--line` (Night `rgba(255,255,255,.14)`, Day `rgba(43,27,16,.14)`) | the same |
| `.ol-rw` past its card | **0 of 8** (was 28px) | 0 of 8 |
| why textarea | right edge 356 in a 370 card (was 408) | 528 in 542 |
| scrollWidth | 390 | ≤ 1360 |

- **Shots:** all 42 re-taken after the fold-in (headless Chrome, fresh profile, every capture DOM-gated), console errors 0.
  The last note row still ends at 564, above the tab bar at 778. `why-editor-390-night.jpg` shows Keep in gold;
  `signed-out-390-night.jpg` shows Sign in in gold.
- **F2b** (the rename line, 18px wider than intended, centred) was not part of the ruling and stays in the ledger.
- **praxis-reviewer re-check (Sonnet): PASS, "cleared to commit".** What it measured:
  - The diff differs from the patch's CSS hunk by exactly the 3 lines (114 → 117 added, +312 B).
  - All three sizes, md5s and EOLs match.
  - The added lines contain no hex, and the only `lx … ol` element is views.js :27711.
  - The three overrides restore the same values as the base rules (`.lx .pill` :17567, `.lx .ghost` :17568, `.btn-primary`
    :10093). No hover or disabled state is outranked; `:disabled` is opacity only (:17571).
  - `.lx.ol .ol-top .ghost` (0,4,0) still sets `border:0`.
  - `git diff --check` is clean, and the 10 must-be-unchanged files have no diff.

## Ledger (recorded, not fixed here)

From the brief (recorded as asked):

- **L-1** A lens under two books shows "A lens rests on at least two books…" with no "Add books" button; that surface is not designed.
- **L-2** The book page's own back link does not return to Open Lens; the browser's Back does (walk iv).
- **L-3** Under the picked cover the page says "read" / "unread" (the live sheet's words), not Reading / Have read / Will read.
- **L-4** Escape does not close the ••• menu; a tap outside it does not either (the ••• button toggles it). See F3.
- **L-5** The band is the brown sky until LC2.
- **L-6** "Think it through with Yumi" (page) and "Not quite — talk it through" (sheet) open the same say-back under two names (ledger S18).
- **L-7** L4b-2b owes: `#category/<id>`, its line in `tabbarTabFor` (today a lens opened from a category would light Notebook —
  unit U5), and its two doors (the Shelf's category heading, the You-sky category orb).

Found on the way (new):

- **L-8** (pre-existing, hand.js) `form()` writes `look.c[]` colours into SVG markup without the hex test the page applies to
  `--ol-lens`. Owner-only data; the sheet, sky and shelf marks share it. R7.
- **L-9** (pre-existing) The browser's Back to `#books` from any page does not return to the depth left (7711 → `#book` 1284,
  `#notebook` 975, `#lens` 1623 in the rig). The page's own Back does (walk ix).
- **L-10** (pre-existing, state.js) `lensPutBack` appends, so a book put back moves to the end of the covers (walk viii).
- **L-11** (pre-existing) `buildSignedOutPrompt`'s "Sign in" is 80×38.7 — under 44, on `#lenses` too.
- **L-12** (pre-existing) `lxAskToRead` returns silently (`done(false)`, no toast) when fewer than two of the lens's books are on the shelf.
- **L-13** F2b–F8 above. (F1 and F2 were fixed in this commit.)

## Owed

- **Preston's look** at 1360 and 390, Day and Night (the 42 shots are the rig's; whether it looks right is his call).
- The live check below, after the push.

## Numbers

| File | Before (LF) | After (LF) | Δ | md5 after |
|---|---|---|---|---|
| js/views.js | 1,370,115 | 1,391,437 | +21,322 | `9cc980325701cc942e309c1924e91905` |
| assets/components.css | 934,229 | 946,265 | +12,036 (patch +11,724, F1/F2 +312) | `fee4f1a82f999ce4b276ca8a0ee5284d` |
| sw.js | 6,894 | 6,894 | +0 | `fd6cc5e7f578880c4beb04a0411c1a11` |

## What Preston runs (the live check — this machine cannot reach the origin)

After the push: on the phone, open praxis-reading.netlify.app, accept "new version ready — Reload" (or close and reopen the
app); confirm v3.329 (About → the version line, or `#diag`). Then: Shelf → switch to Lenses → tap a lens's mark → the sheet
→ **Open lens** → the page; check the Back label says Shelf and the Shelf tab stays lit; ••• → Rename / See on the shelf /
Let it go (Keep it); Edit → a minus → Undo in the toast; open the why line → type → Keep (in Night the Keep button is
gold — the F1 fix); a note row → Back. Pass: every step lands where it says and nothing reads faint. **Persistence unverified — the rig
is signed out**: rename, leave-out / put-back, the why line, forget-said and let-go wrote to the rig's local store only.
Live-smoke on a signed-in account: rename a lens on the page, reload, the new name holds on Home's sky and the Shelf band;
write a why line, reload, it holds on the sheet and the page.
