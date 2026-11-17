# L4b-1 HOTFIX — v3.328 — pages open at the top, the sheet clears the keyboard

Preston walked L4b-1 on his phone on 17 Nov 2026, Day and Night. The tab bar PASSED and the lane is
closed (`docs/checkpoints/l4b-1.md`). The walk found four problems, none caused by L4b-1:

- **H1** A page opened at the scroll depth the last page was left at (renderRoute never moved the scroll).
- **H2** Tapping the capture sheet's note field raised the keyboard OVER the field; the field came into
  view only after the first keystroke.
- **H3** A first-visit page card (`.intro-panel-wrap`) sat on top of the tab bar.
- **H4** His profile holds a declared value whose name renders as the text `[object Object]` (You page:
  the Values card and the galaxy chip) — damage left by the old coercion bug that the R10 S1 notes in
  state.js and intros.js describe.

The reviewing chat wrote the four fixes as a patch; this build verified it, applied it, proved it, and
changed ONE line of it after a red-team BLOCK (H1, below). No layout or colour change; every CSS line is
inside `@media (max-width: 759px)`; the tab bar, Search pill and `tabbar*` functions are untouched.

## The fixes, in plain words

**H1 — a new page opens at its top.** A listener in views.js runs on every hash change BEFORE the router
draws the page (views.js loads before app.js, whose listener calls renderRoute), so the reset comes first
and any scroll a page makes on purpose while it draws still wins. Four cases:
1. A tap in the tab bar or the top nav → the top, always. (Tapping the tab of the page you are already on
   also returns to the top; no page change happens.)
2. The browser's own Back / Forward (a history entry the listener has already stamped with
   `{ praxisRoute: n }`) → left alone; the browser restores the depth as it always has.
3. A link straight back to the page you just came from — a page's own "Back to your shelf" link is a NEW
   history entry, not a Back → the depth you left that page at, set just after the page has drawn.
4. Anything else → the top.
Changed from the patch (red-team BLOCK, see Stage 1b): after a Back / Forward, case 3 is not armed for
the next page change.

**H2 — the sheet rides above the keyboard.** `capKeyboardLift` reads `visualViewport`: the gap between
the visible area and the page's bottom edge is the keyboard. While the sheet is open on a phone and the
gap is at least 120px, it writes `--cap-kb` (the sheet's bottom) and `--cap-room` (its height limit) on
the sheet; the phone CSS reads both. Closed sheet, wide screen, no `visualViewport`, or no keyboard:
both are removed and the sheet is exactly as it was. It runs on open, on close, and on every
`visualViewport` resize / scroll.

**H3 — the card sits above the bar.** On phones `.intro-panel-wrap` takes `bottom: var(--tabbar-h)`
(the bar's height, safe-area inset counted once) and `padding-bottom: 14px`; not at the invite gate
(`body.l3-gated`) and not on #deleted (`body.tabbar-off`), where the bar is hidden.

**H4 — the broken value is healed on read and on write.** `healValueEntry` drops an entry whose name IS
the text `[object Object]` (no real name survives in it) and unwraps an entry whose name is itself a
value object carrying a real name; every other entry is returned untouched (same object), so statements
are never lost. `getProfile` heals in place (the array and every kept object keep their identity);
`setProfile` heals both the stored list and the incoming one, so a broken entry never comes back in from
the Firestore sign-in merge. The You page's value load skips a value mark named `[object Object]`.

## Stage 0 — pre-flight (read-only on code; 17 Nov 2026)

**0.1 Protocol docs.** Found: `CLAUDE.md`, `PROTOCOL.md` (v1.2), `CRAFT.md`,
`docs/FIX-PROTOCOL.md` (v1.3), `BOARD.md`, `.claude/agents/` (fix-implementer,
fix-red-team, praxis-recon, praxis-reviewer, repo-mapper, studio-mockup,
studio-scan). Looked for and not found: none missing. `sh tools/ground-truth`:
HEAD 3d722db, hook gate ARMED (core.hooksPath = hooks), FIX-PROTOCOL v1.3.

**0.2 Start state.** HEAD == origin/main == 3d722db ("L4b-1 — the tab bar and the
Search pill (phones) — v3.327"); 0 tracked files dirty. Committed blobs, all match:
views.js 1,364,953 B `4c6bcac2…` · state.js 218,233 B `bc3fcfe7…` ·
components.css 933,531 B `c2823d6b…` · sw.js 6,894 B `f20444fd…`. Must-be-unchanged
set at HEAD: index.html `addda80d…` · app.js `76112a87…` · hand.js `fd51ca7e…` ·
theme.css `571e0ccc…` · yumi-ui.js `ab4d4160…` · yumi-brain.js `5241349a…` ·
integrations.js `ce40d6e0…` · intros.js `115ab5ea…` · lumen-amber.css 11,953 B
`631bc2aa…` · assets/marks.js 10,255 B `772886c0…`. All blobs CR=0.

**0.3 Patch.** Saved outside the repo; the paste's single-space context lines
arrived as empty lines (6 of them). `git apply --check` exit 0 regardless. Dry-applied
into a throwaway index (`GIT_INDEX_FILE`, real index and tree untouched): views.js
1,369,928 `e835fea4…` · state.js 219,823 `47eaa565…` · components.css 934,229
`25abcea7…` · sw.js 6,894 `c40a5368…` — all four equal EXPECTED END STATE. numstat
+94/−0, +32/−5, +12/−0, +1/−1. The patch's `index` blob ids equal HEAD's.

**0.4 H1 anchors.**
- a. index.html:130 views.js, :132 app.js — views.js first. app.js binds its
  hashchange listener inside DOMContentLoaded (app.js:67), so a listener bound at
  views.js evaluation always runs first.
- b. `document.scrollingElement` = HTML at 390 and 1280; html/body/#app overflow-y
  visible; pageYOffset == scrollingElement.scrollTop. initNavReveal reads
  `window.pageYOffset` (views.js:380, :384).
- c. History writers at HEAD: app.js:47 `replaceState(null,…)` (only on `?sky=`);
  views.js:11807 `replaceState(null,'','#scan')`; views.js:26684
  `replaceState(null,…)` (share-target strip, at boot, before `load`) — **missing
  from the brief's list**; `location.replace` at views.js:694, :817, :3223, :12618.
  (The brief's views.js numbers are +41 from HEAD.) Readers of `history.state` /
  `popstate`: 0 in js/ and index.html.
- d. Deliberate scrolls: `scrollIntoView` appears on 16 lines = 12 calls + 3
  `typeof` guards + 1 comment. Synchronous inside a route render after a hashchange:
  **only #diag** (`renderShelfDiagnostic`, views.js:6780, reached from renderRoute
  :825). All others are click/handler-driven (5763 band open, 6424, 6830, 10938,
  11307 inner scroller, 11621, 18686, 18855, 19122, 23286, 23521, 23640, 23672,
  25323). Case 3 overrides #diag's own scroll only when #diag is reached by a new
  entry straight back from the page it was left for — it then restores the depth #diag
  was left at; not judged wrong. lxOpenShelfCategory (27648) opens its band in a
  timer registered after case 3's, so the band's own `scrollTo(0,0)` (5763) wins.
- e. No hash change is a same-page change: all 60 `location.hash =` sites and every
  `href="#…"` are routes; no face/tab switch uses the hash; `href="#"` (desktop
  Capture) is preventDefault'd (views.js:26532).
- Premise reproduced at HEAD, 390: You@3000 → Shelf opened at 599; You@3000 →
  Notebook at 975; Shelf@599 → Home at 581; You@2000 → Home at 867.

**0.5 H2 anchors.** `.capdoor-body` is the scroll region (components.css:16420,
flex 1 1 auto, min-height 0, overflow-y auto); `.capdoor-foot` flex:none. No rule
after :16387 sets bottom or max-height on the sheet (only :16622 reduced-motion and
:17175 `:has()` on the create door); no inline bottom/max-height writes (drag handle
writes transform only). `visualViewport`: 0 uses repo-wide. Rig at 390×844, patch CSS
injected into the page only, note mode: before = sheet 413–844 (h 431), max-height
472.64px; `--cap-room:500px` → unchanged (min() keeps 56vh); `--cap-room:300px` →
sheet 543–844, body clientH 174 < scrollH 303 (scrolls), "File it" 793–830 and
elementFromPoint hits it. **The rig cannot raise a real software keyboard.**

**0.6 H3 anchors.** `.intro-panel-wrap` (components.css:14954, :15000; built at
intros.js:600) is the only first-visit card container (`.intro-journey` is a
full-screen overlay). At HEAD, 390, #books first visit: card 579–830, tab bar
778–844 → **overlap 52px**; wrap z 10005 over bar z 50.

**0.7 H4 anchors.**
- a. Writers of profile.values: `setProfile` (state.js:1736–1772; callers
  intros.js:358 doValues, views.js:23724 addValue, integrations.js:687/:723 sign-in
  merge); `getProfile` read-shim in place (state.js:1661–1668); **`setValueStatement`
  writes `vals[i] = normalizeValue(vals[i])` in place, bypassing setProfile**
  (state.js:1795–1799; sole caller views.js:19266 on #value, which resolves through
  `_valueResolve` → getProfile first, so the heal has already run); `= []`
  initializers state.js:1558, :4408. No direct push into profile.values.
- b. No writer can produce an object-as-name or the text from HEALTHY input. Every
  coercion (normalizeValue `'' + entry.name`, intros.js:116 `'' + obj.name`) only
  yields "[object Object]" when the entry is already broken. Old damage, not a live bug.
- c. Readers all go through getProfile: You Values card via `_profileValueLoad`
  (views.js:22299); galaxy (21869); value page (19184); mark-register vocab (13015);
  walk picker (intros.js:109); Yumi (yumi-brain.js:1036, :1356, :1823); the
  Firestore push and export (`buildUserProfileDoc(uid, getProfile(uid))`,
  integrations.js:3236 and saveProfileToFirestore callers).
- d. Sign-in merge passes `values` through `setProfile` (integrations.js:687, :723).

**0.8** Nothing above changes the patch. *(Superseded at the recon gate — Stage 1b: the recon never
exercised a browser Back followed by re-entry.)*

**Premises reproduced at HEAD** (FIX-PROTOCOL #9): H1 above (four page changes, four inherited depths);
H3 above (52px overlap); H4 by running HEAD's own `state.js` under cscript —
`getProfile` returns `Care | [object Object] | (object)` for a seeded list, and HEAD's `setProfile`
turns a nested-name entry into the literal text (`Care | [object Object]`). H2 is not reproducible in
the rig (no software keyboard).

## Stage 0.9 — the recon gate (FIX-PROTOCOL §1#8; fix-red-team, Sonnet, HEAD blobs only)

**"RED-TEAM: findings (1 BLOCK, 5 NITs)."** Every recon anchor it spot-checked resolved at HEAD; the
history.state, listener-order, scroll-site, profile.values and CSS premises held. Its findings, condensed:
1. **BLOCK** — case 3 cannot tell "a link back to the page I came from" from a re-entry after a browser
   Back, and records the wrong depth on that path: the `seen` branch still set
   `routeTopPrevHash = fromHash; routeTopPrevY = pageYOffset`, and by the time hashchange fires the
   browser has already restored the depth of the page it is returning to. Suggested fix: on the `seen`
   path set `routeTopPrevHash = null`.
2. NIT — a `location.replace` redirect (views.js:694, :817, :3223, :12618) fires a second hashchange
   from an unstamped entry; prevHash becomes the redirect source, so a later back-link lands at the top
   (fails safe). Ledger.
3. NIT — views.js:11807 `replaceState(null,'','#scan')` wipes the stamp; a later Back to that entry reads
   as a new page (top). Ledger.
4. NIT — `routeTopOnTap` matches `.app-nav a` at every width: a desktop nav click on the CURRENT page now
   returns to the top (new desktop behaviour). Ledger, for Preston.
5. NIT — `healValueEntry(undefined)` is kept (as an empty-name object, as before) while `null` is dropped;
   an entry with BOTH a string id and a nested-object name is unwrapped and loses outer-only fields. Ledger.
6. NIT — the lifted sheet keeps `padding-bottom: env(safe-area-inset-bottom)` (~34px above the keyboard
   on an iPhone); `bottom` is not transitioned, so the sheet steps when the keyboard arrives; H2 is
   unproven on a device. Ledger.

## Stage 1 — APPLY

**1.1** `git apply` exit 0. With `core.autocrlf=true` it rewrote the working copies of state.js and
components.css as CRLF (they had been LF working copies); the BLOBS are LF (CR=0) — immaterial to what
commits (CLAUDE.md EOL caveat). `git ls-files --eol` now reads `i/lf w/crlf` for all four.

**1.2 Staged blobs against EXPECTED END STATE (as applied, before Stage 1b):** views.js 1,369,928
`e835fea4…` · state.js 219,823 `47eaa565…` · components.css 934,229 `25abcea7…` · sw.js 6,894
`c40a5368…` — all four equal. Must-be-unchanged, index blob = working copy (CR-stripped): index.html
`addda80d…` · app.js `76112a87…` · hand.js `fd51ca7e…` · theme.css `571e0ccc…` · yumi-ui.js `ab4d4160…`
· yumi-brain.js `5241349a…` · integrations.js `ce40d6e0…` · intros.js `115ab5ea…` · lumen-amber.css
`631bc2aa…` · assets/marks.js `772886c0…` — all equal.

**1.3** `tools/parse-check` self-validated (a broken copy → "Expected '}'", exit 1), then **PARSE OK,
exit 0** on all 19 files in js/ and on sw.js. ES3 grep on the 127 ADDED JS lines: `const` 0 · `let` 0 ·
`=>` 0 · `class` 0 · backtick 0.

## Stage 1b — the one change to the patch (the recon gate's BLOCK)

**Reproduced first, on the patch as delivered** (rig, 390): Shelf at 2000 → tap book `bk_l4_20`
(opens at 0) → scroll the book to 250 → browser Back to the shelf (no scrollTo from the listener; the
shelf landed at 1174) → the listener had recorded `prevHash = '#book/bk_l4_20'`, `prevY = 1156` — the
depth the browser had restored, not the book's 250 → tap the same book again: it opened at **1156**,
via `scrollTo(0,1156)` from case 3. Neither its top nor where it was left.

**The change** (views.js, the last statement of `routeTopOnHash`; +2 comment lines, one code line):

```
-  routeTopPrevHash = fromHash; routeTopPrevY = fromY; routeTopCur = next;
+  // After a Back / Forward the browser has already restored the depth of the page it
+  // returned to, so fromY is not where fromHash was left: arm no case-3 restore then.
+  routeTopPrevHash = seen ? null : fromHash; routeTopPrevY = fromY; routeTopCur = next;
```

It fails safe (to the top). The other approach — record each page's depth at the moment it is LEFT (a
click-capture or scroll-tracked map) so case 3 could also work after a Back — is more code and was not
taken; **it is Preston's call if he wants it** (FORK-VERBATIM). The change is inside H1's own lines, so
H1 is kept rather than removed (the brief's revert-on-FAIL rule).

**New checksums (the other three still equal EXPECTED END STATE):** views.js staged **1,370,115 B**
(+5,162 vs HEAD; +187 vs the patch as delivered) md5 **`1fe5a56032144bc07130e401a3cce430`**, CR=0;
git numstat +96 / −0. Parse OK, exit 0; working copy CR count 27,984 = line count 27,984 (no EOL flip).
After the change, rig: the same flow re-opened the book at **0** (`scrollTo(0,0)`).

## Stage 2 — PROOFS (17 Nov 2026; rig `.claude/rig/serve.ps1` on localhost:8856 serving the working
tree; SW + caches cleared before each code load; `d0tester` stub; the l4 fixture, 20 books; proxy
stubbed to reject; dpr 2.0; every capture fresh, this session)

| Proof | Result | Numbers |
|---|---|---|
| **P1** H1, 390 | **PASS** | Notebook scrolled to its maximum, **975** (the fixture's Notebook is 1,819 tall, so 1200 is not reachable) → You tab → **0** (`scrollTo(0,0)`). Home at 800 → Shelf tab → **0**. Home at 800 → "Your shelf →" (`a.home-gl-link`, an in-page link outside the nav and the bar; visible on screen) → #books at **0**. The Lenses line (`[data-lx-go="lenses"]`) carries `hidden` on this fixture, so it was not used as the in-page link. |
| **P2** H1, back link | **PASS** | Shelf at **N = 1600** → book `bk_l4_01` at **0** → scrolled to 300 → "← Back to your shelf" (`a.bk-backlink`) → shelf at **1600** (`scrollTo(0,1600)` after the timeout; Δ 0). Browser Back (book `bk_l4_11` left at 200): with `window.scrollTo` wrapped, the listener made **NO scrollTo call**; the page landed at **1147** — the browser restores while the shorter book page (max scroll 1,129) is still drawn, so its restoration is clamped. The listener made no call, so this landing is the browser's own. |
| **P3** H1 | **PASS** | Home at 600 → Home tab → **0**, `scrollTo(0,0)`, **0 hashchanges**, `routeTopForce` false. |
| **P4** H1, 1280 | **PASS** | Shelf at 400 → top-nav "Notebook" → **0**; `routeTopForce` true during the tap, false after. Desktop Capture link (`href="#"`): `routeTopForce` **false** right after the click, 0 hashchanges, hash unchanged, the sheet opens, no scrollTo. |
| **P5** H1, unit | **PASS** | `docs/checkpoints/l4b-1-hotfix-shots/unit-harness` (cscript; the H1 block extracted from views.js's real bytes; window / history / location / document stubbed). Forward from 900 → one `scrollTo(0,0)`, state stamped `praxisRoute`; second forward → `scrollTo(0,0)`; a new entry equal to the page before → none before the timeout, one timer at 0ms, then `scrollTo(0,450)`; a stamped entry → no scrollTo at all, not re-stamped; **after a Back, a new entry to the page left → `scrollTo(0,0)` (Stage 1b)**; force true in the new / back-link / stamped shapes → `scrollTo(0,0)`, flag false after; tap with no href, `#`, or outside the nav and bar → flag false, no scrollTo, no timer; a tab tap → flag true, 1000ms expiry; tapping the current page's tab → `scrollTo(0,0)`, no flag. |
| **P6** H2, unit | **PASS** | Same harness, `capKeyboardLift` extracted: vv 508 / offsetTop 0 → `--cap-kb 336px`, `--cap-room 500px`; 508 / 120 → `--cap-kb 216px`; 800 / 0 → both absent; sheet closed, 1280 wide, no visualViewport → both absent; no sheet in the DOM → no throw. |
| **P6** H2, rig 390 | **PASS (rig); the real proof is Preston's phone** | Note mode, props by hand 336px / 500px: sheet **77–508** (bottom 336 above the layout bottom; fully on screen); "File it" 457–494, visible, `elementFromPoint` hits it. Paste/Import (`cap-expanded`): sheet **7–508**, max-height 500px, body scrolls (373 of 389, scrollTop moved to 16.7), "File it" 457–494, hit. Props removed: rect **identical to before, to the pixel**, in both modes (`0,412.67,390,844` note; `0,326.67,390,844` paste). The real `capKeyboardLift` with a stubbed `visualViewport` (508/0) wrote 336px / 500px and the field sat at 242–296, above the keyboard line (508) — shot `h2-rig-390-day-sheet-lifted-336-stubbed-viewport.jpg`. `capClose` removes both properties. **The rig cannot raise a software keyboard: H2 is unproven until Preston's phone.** |
| **P7** H3 | **PASS** | 390, #books first visit: card **513–764**, tab bar top **778** (was 579–830, 52px over the bar); `elementFromPoint(195,811)` → the tab bar. `body.l3-gated` and `body.tabbar-off`: wrap bottom **0px**, padding 14px (the pre-patch phone rule). 1280: wrap bottom 0px, padding-bottom 20px, all 979 computed properties identical with and without the new block, and equal to the digest taken on HEAD before the patch. Shots: `h3-before-390-{night,day}-intro-card-on-bar.jpg`, `h3-after-390-{night,day}-intro-card-above-bar.jpg`. |
| **P8** H4, unit | **PASS** | Seeded in the brief's order: `getProfile` returns the SAME array with exactly three — the same Care object (identity, statement 's'), Freedom wrapped (`id 'freedom'`), Joy (statement 'j'); a second getProfile changes nothing (same array, same three objects); a healthy-only list is untouched (same array, same objects, same JSON). `setProfile(uid,{values:['Care','[object Object]',{name:'[object Object]'},'New']})` → exactly **Care (statement 's'), New**. Also: setProfile heals a broken STORED list it meets before any read (Joy keeps 'j'); a whitespace-padded `[object Object]` is dropped. |
| **P9** H4, rig | **PASS** | Stored `praxis_state_d0tester` seeded with Care · `[object Object]` · Freedom, plus a book mark valued `[object Object]`; reloaded and read back through the app's own `loadState`. You page: **0** occurrences of `[object Object]` in the whole page HTML; chips Care, Freedom. The walk's value picker (About → Retake the walk): Care and Freedom preselected, no broken chip. "Courage" typed and added through the walk's own field and Add button → saved; the STORED profile list then read Care, Freedom, Courage; after a reload, the same three, Courage on You (4 occurrences). Shot `h4-rig-390-night-you-values-healed-care-freedom-courage.jpg`. **Persistence unverified in the cloud — the rig is signed out** (local store only). |
| **P10** regressions | **PASS** | lens-eval-test **68/68** · lens-data-test **101/101** · export-test **58/58** · delete-test **58/58** · ceiling-core-test **36/36** · fx1c-sim **60/60** (exit 0 each). Desktop, 1280: `.capdoor-sheet` open and expanded and `.intro-panel-wrap` — all 979 computed properties identical with and without the new block (CSSOM delete/insert in one load) and equal to HEAD's digests. 1360: `(max-width:759px)` false; the sheet 24–445 × 302–720, bottom 80px, max-height 620px, no props written. Console: rig noise only (local `/.netlify/functions` 404s, Open Library CORS); no exception from the new code. |

The unit harness also fails on the patch as delivered — **44/46**, exactly the two Stage 1b cases — and
refuses to load against HEAD (anchor not found, exit 2).

## The device pass Preston owes (the origin is unreachable from this machine:
`curl … https://praxis-reading.netlify.app/sw.js` → `000`, exit 56, measured 17 Nov 2026)

On the phone, after the push: open Praxis, accept "new version ready — Reload" if it shows, and confirm
the version is **praxis-v3.328** — the `bundle:` line of the on-screen report (Shelf → Manage →
Tidy library → tap the "Shelf · cleanup" eyebrow five times → #diag). Then:
1. Scroll the Notebook (or You) well down, tap another tab → the new page opens at its top.
2. Tap Capture, tap the note field → the field is visible the moment the keyboard is up (not after the
   first keystroke); "File it" is reachable.
3. Open You → no `[object Object]` on the Values card or among the galaxy chips; your other values are
   all there.
4. (Stage 1b, iPhone) Scroll the Shelf down, open a book, scroll the book a little, use the browser's /
   the swipe Back to the shelf, then open the SAME book again → it opens at its top.
Pass = all four. Day and Night.

## Stage 2b — the red-team on the frozen diff (FIX-PROTOCOL §9; fix-red-team, Sonnet)

**"RED-TEAM: no BLOCK findings. Six NITs follow."** It read the staged diff and the source around it, re-ran
the unit harness itself (46/46, rc 0), and did not run a browser. Checked with no finding: exactly the four
files staged; sw.js only the version; every new CSS line inside `(max-width:759px)`; `--tabbar-h` defined
wherever the H3 rule applies and the selector outranks components.css:15000; ES3 clean; the
`lxOpenShelfCategory` once-listener, a hashchange before `load`, and the load stamp all behave. Its NITs,
condensed (all in the ledger below):
1. Nulling prevHash after a Back breaks no ruled case. It does remove one restore: A → B, Back, Forward to
   B, then B's link back to A lands at 0. **That pageYOffset is already the restored depth at hashchange
   time is proven on the Chromium rig only, not on iOS WebKit** — if WebKit restores later, the null is
   merely conservative. Covered by step 4 of the device pass.
2. The `location.replace` redirects (views.js:757, :880, :3286, :12681 after the patch) record the redirect
   source as prevHash — the only remaining wrong-hash path; it fails to the top (e.g. arc → workshop loses
   its back-link restore).
3. `replaceState(null,…)` at views.js:11870 (scan primer) and app.js:47 (`?sky=`) erase the stamp; the
   boot one is re-stamped on `load`, the scan one is not (a later Back to it reads as a new page).
4. The account-switch close (views.js:26573) removes `is-open` without capClose, so the two properties can
   outlive the sheet until the next visualViewport event; the closed sheet is invisible and capOpen
   recomputes. No bug.
5. The unwrap replaces the outer entry with the inner object (outer-only fields lost — only for an entry
   that is already broken); **getProfile now DROPS a `null` entry** where it used to normalise it into a
   blank value (setProfile already skipped those); `setValueStatement` bypasses the heal but works on the
   array getProfile has already healed.
6. Case 3's `setTimeout(0)` would clamp on a page that draws asynchronously after that tick, and overrides
   a deliberate on-arrival scroll; the rig covered Shelf ↔ book only.

## Stage 2c — praxis-reviewer (CLAUDE.md commit gate; Sonnet, read-only)

**"VERDICT: PASS. CLEARED TO COMMIT. No blocking findings."** Measured from the index: views.js 1,370,115
`1fe5a560…` (+5,162 vs HEAD, +187 vs the patch as delivered), state.js / components.css / sw.js equal the
brief; every must-be-unchanged file and both foundations equal; the deviation is exactly one statement
(lines 473–475 against the as-delivered views.js); ES3 0/0/0/0/0 on the 141 added lines; parse OK; unit
harness 46/46 exit 0; working tree == index for the four code files (no EOL flip: 27,984 CR = 27,984
lines); sw.js only the version; all 12 CSS lines inside `(max-width:759px)` with fallbacks; no new
storage or Firestore write on any added line; the docs agree with the code and with each other, and carry
every ledger item the brief required. Non-blocking: H2 has unit and stubbed-viewport proof only (Preston's
phone check owed); the deviation fails safe.

## Ledger — found or left by this build (not fixed here)

1. **H2 is unproven until Preston's phone.** The rig cannot raise a software keyboard; the CSS was proven by
   setting the two properties by hand and the function by stubbing `visualViewport`.
2. **A `location.replace` redirect is treated as a new page** (top), and records the redirect source as the
   previous page, so a back-link after a redirect lands at the top (§9 NIT 2).
3. **H1 case 3 can override a page's own on-arrival scroll.** The one synchronous on-arrival scroll in a
   route render is #diag (`renderShelfDiagnostic`, views.js:6780 at HEAD); case 3 overrides it only when
   #diag is reached by a link straight back from the page it was left for. lxOpenShelfCategory's band open
   (views.js:27648 → :5763) runs after case 3's timer, so the band's own `scrollTo(0,0)` wins. A page that
   draws after the 0ms tick would see its restore clamped (§9 NIT 6).
4. **Case 3 after Stage 1b:** not armed after a Back / Forward, so A → B, Back, Forward, B's link to A lands
   at the top (§9 NIT 1). The fuller fix — record each page's depth as it is LEFT — is Preston's call.
5. **Case 3 is a ping-pong by design:** Shelf → book (scroll it) → the book's back link → shelf (restored)
   → the SAME book again opens at the depth it was left (measured: 300). This is the ruled "link straight
   back to the page you just came from".
6. **Browser Back to a long page from a shorter one lands clamped** (Shelf left at 1600, Back from a book
   with max scroll 1,129 → 1147): the browser restores while the shorter page is still drawn. The listener
   makes no call on that step, so the landing is the browser's own. An improvement (restore after the draw)
   would be a feature, not this fix.
7. **`replaceState(null)` erases the stamp** at the scan primer (views.js:11807 at HEAD) and the `?sky=`
   strip (app.js:47); a later Back to the scan entry reads as a new page (§9 NIT 3).
8. **New desktop behaviour (§0.9 NIT 4, for Preston):** a top-nav click on the page you are already on now
   returns to the top (it did nothing before). Ruled for the tab bar; on desktop it rides the same tap filter.
9. **Yumi's panel composer and other bottom-anchored fields are not covered by H2** (the say-back, the
   Shelf's search, the scan review). Only the capture sheet rides the keyboard.
10. **The lifted sheet keeps its safe-area padding** (~34px above the keyboard on an iPhone) and `bottom` is
    not transitioned, so it steps when the keyboard arrives (§0.9 NIT 6).
11. **A value MARK named `[object Object]` still shows on that book's own page** (rig: `#book/bk_l4_01`
    after seeding one). The patch skips such marks only on the You page; book detail (views.js:5171), the
    shelf (:5291) and arcs (:17486) render them. Whether Preston's data holds such a mark is unknown.
    SEPARATE TASK if it does.
12. **H4 edge cases (§9 NIT 5):** getProfile now drops a `null` entry; an already-broken entry with both a
    string id and a nested-object name keeps only the inner object.
13. **"+ Add a book" covers a book title on phones** (pre-existing; from the phone walk; not this build).
14. The account-switch close path leaves the two properties on an invisible sheet until the next viewport
    event (§9 NIT 4; no visible effect).
15. Working copies of state.js and components.css are now CRLF (git apply under autocrlf); blobs LF.

