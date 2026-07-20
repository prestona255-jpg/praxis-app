# R-POLISH B4 — Stage 0 recon (About + Arcs index + Search/Account, light)

READ-ONLY recon. HEAD `0896017c501051389c5cdbcc9367b62d865a8650` ("docs(R-POLISH B3): deployed
live-smoke results — v3.234 @ 7ddd3c8, 22/22 PASS, plus the deploy-pipeline incident"). `HEAD == origin/main`
(both `0896017`). Tree: 103 untracked entries (long-standing design/docs clutter, same pattern every prior
run), zero tracked modifications. Live `sw.js` `CACHE_VERSION = 'praxis-v3.234'` (sw.js:10) — matches the
task brief's stated live version exactly.

## 0 · HALTS / DEAD ANCHORS — read first

1. **DEAD ANCHOR — `#account` is not a page.** `renderRoute()` hard-redirects `#account` →
   `location.replace('#profile')` (js/views.js:705-712); the comment there states plainly
   `renderAccountPage is retired (defined-but-unrouted; see r9a-build.md "unrouted legacy renderers"
   debt)`. `renderAccountPage()` (js/views.js:20602-21974) still exists as a **live, exported
   function** (`renderAccountPage: renderAccountPage` at js/views.js:22421, plus two internal
   re-render call sites at 16763/17257) but has **zero routed entry point** — a user can never reach
   it. The brief's B4 line ("ABOUT + ARCS INDEX + SEARCH/ACCOUNT (light)", docs/studio/r-polish-brief.md:63)
   names "Account" as a light page alongside Search; there is no such live page. If "Account" means
   the live successor (`#profile` → `renderProfilePage`), that surface is **B3's territory**
   (Book Detail + Profile, already built with the dawn seam — see prior recon
   `rpolish_b3_lane2_s0_bookdetail_profile_census`), not light-ground, and not named in B4's own
   scope line in the brief. **This needs Preston's call before any B4 build touches "Account."**
2. **Frozen-gate collision — NONE found for B4's actual live targets.** Both byte-locks hold exact
   (§4). `js/arc-constellation.js` is untouched since `5c92382` (2026-07-04), well before R-POLISH —
   nothing in B4's scope (About stations, Arcs-index exemplar card, Search) requires touching it.
   The Arcs-index "exemplar wash" root cause (§3) is a **views.js caller bug**, not a marks.js/
   lumen-amber.css edit — no collision.

## 1 · ABOUT (`#about`, `renderAbout`)

`renderAbout()` spans js/views.js:21975-22368 (`aboutWireStations` starts 22373 — this is a **big
line-drift** from the last full census on file, which had it at 18142-18382; the page was rebuilt
end-to-end by DW-1 "Fork A" since then — do not reuse the old span). Root: `page.className = 'about'`
(views.js:21981) — still **zero `lum-` class**, but the page is no longer the old "legacy bright"
surface either: ground resolves through `umberGroundDark['about'] = 1` (views.js:468), so
`body[data-ground="dark"]` is set on the About route and `--ink`/`--ink-2`/etc. resolve to the
dark-study set (theme.css:541-559). `.about`'s own content blocks (`.model`, `.lexi`, `.ref`,
`.about-accordion`) paint with `--page`/`--page-2`/`--surface` (theme.css:45-46, **not** remapped
under `[data-ground="dark"]`) — i.e. warm cream "paper" cards floating on the dark twilight ground,
consistent with PG-1 v2 ("printed pages are where you work" — r-polish-brief.md:13).

**XL tier.** About's only desktop composition tier is `@media (min-width:1200px)`
(components.css:9728-9781, "DW-1 (Fork A)" comment at 9716-9725): `.about{ max-width:1160px;
display:grid; grid-template-columns:184px minmax(0,1fr); column-gap:48px; }` (components.css:9729-9735).
**No `@media (min-width:1600px)` block exists for `.about`** — confirmed by reading all four
1600px blocks in components.css (11503 Book Detail, 12810 arc Field, 15372 Home, 15483 Notebook);
none touch `.about`/`.about-spine`. Occupancy: CSS-declared 1160/1920 = **60.4%** (barely clears
XL-1's ≥60% floor, unauthored/accidental — same pattern as Book Detail/Profile pre-B3); the DW-1
checkpoint's own live-measured box was **1208px** (`docs/studio/about.md:30`, "D1 occupancy 63.4%
@1920 ... `.about` box 1208") — at 2560 either number **FAILS**: 1160/2560 = 45.3%, 1208/2560 = 47.2%.
So About needs the same XL-1 1600px tier B2/B3 already authored for the Field/Book-Detail/Home/Notebook.

**The SVG "stations."** Two tappable diagrams: the "evolution" model (`<svg class="evo">`,
views.js:22024, `role="img" aria-label="The evolution of reading..."`) and the "pipeline" model
(`<svg class="pipe">`, views.js:22066, own `role="img" aria-label`). Each station is a plain
`<g class="stn" data-e="N">` / `<g class="stn" data-i="N">` (views.js:22029/22034/22043/22048 for
evo; 22073-22078 for pipe) — **no `role`, no `tabindex`, no `aria-label`/`aria-pressed`, no `title`
child anywhere on the `<g>` itself.** They ARE genuinely interactive: `aboutBindStation`
(views.js:22380-22391) attaches a real `click` listener that swaps `.on`, dims siblings
(`dimModel.setAttribute('class','model evo sel')`), and rewrites the caption (`#about-evocap`/
`#about-pipecap`). Wiring call sites: `aboutWireStations(page, '.evo .stn', ...)` (22287-22292) and
`aboutWireStations(page, '.pipe .stn', ...)` (22295-22302). **Verdict: interactive, mouse-only,
zero ARIA/keyboard today** — exactly the STN-A11Y gap the brief names. CSS also has no
`:focus-visible` rule scoped to `.stn` (only `.about .mtog:focus-visible` at components.css:9646 and
`.about-spine-link:focus-visible` at 9778 exist) — a keyboard-focus treatment would need to be added
alongside the tabindex/role/aria-pressed wiring, not just the attributes.

**Existing "covenant" content** (relevant to §2 ME-1): About already has a "The covenant" section
(`id="ab-s2"`, views.js:22170-22182 — Yumi-behavior covenant: "Yumi sees only what you allow" /
"Memory is yours to grant" / "Your words stay yours") and a "What it refuses" section
(`id="ab-s3"`, views.js:22184-22193, incl. `no·3 No harvesting. Your reading is not a product. What
the app knows, you can read; what it remembers, you granted.` at views.js:22191). Neither makes any
claim about aggregate usage counts or error telemetry — **no existing live copy would be
contradicted by adding an ME-1 covenant section beside `ab-s2`,** as the brief's ME-1 law specifies
("written into About as a covenant section beside the privacy covenant").

## 2 · ME-1 MEASUREMENT COVENANT — ground truth for a NOT-YET-WRITTEN law

`docs/studio/r-polish-brief.md:46` (full text, was truncated on the first grep pass — read directly):
> **ME-1 · THE MEASUREMENT COVENANT.** Privacy-first minimal instrumentation, disclosed plainly:
> client error capture + anonymous AGGREGATE counts only — no per-user behavioral profiles, no
> third-party trackers, no session replay, ever. "We count, we never watch," written into About as a
> covenant section beside the privacy covenant. ACTIVATION defined as a number... Implementation:
> the telemetry module + About covenant text ride B4 (About's batch); activation counters land with it.

**Exhaustive whole-repo search** for `analytics|telemetry|track\(|gtag|plausible|posthog|sendBeacon|
beacon` (escaped, case-insensitive, tracked files only): 16 files hit, every single one a false
positive on plain reading — `xTrack()` (a pane-width helper, js/room-field.js:61), "the beacon" (a
mark-shape name, assets/marks.js:41 / ST_MARK_NAMES), and one real hit that is **dead code** (below).
`window.onerror|addEventListener('error'|unhandledrejection|Sentry|reportError` (case-insensitive):
zero real hits — the only `'error'` listeners are an `<audio>` element (js/integrations.js:2384) and
an `<img>` broken-cover handler (js/views.js:7724), both local UI fallbacks, not error reporting.
**Conclusion: ME-1 is 100% net-new — no telemetry module, no client-error-capture, no analytics
call of any kind exists anywhere in the live app today.**

**The one real hit is dead code and pre-figures ME-1's exact language.** Inside the unrouted
`renderAccountPage()` (§0.1): `views.js:21793-21796` — `'What Praxis records: aggregate counts of
your activity and which features you use. We never read the content of your notebook entries or
marginalia for analytics.'` (class `account-covenant`), plus three sibling `.account-covenant`
paragraphs at 21799-21809 ("What Yumi can see..."), 21815-21819 ("The covenant: no asymmetric
knowledge..."), and 21866-21871 (a second data-card covenant, "Your library, your arcs, your
notebook..."). **None of this has ever rendered for a live user** (the route redirects before
`renderAccountPage` is ever called). It is a design-intent fossil, not a live promise — no COPY IS A
CONTRACT violation exists to fix, but its language ("aggregate counts... never read content...")
is close enough to ME-1's own wording ("anonymous AGGREGATE counts only") that reusing/porting it
into the new About covenant section is a legitimate option, not a from-scratch copy job.

FELT CANON's "Stewardship" acceptance sentence (r-polish-brief.md:83) — *"The app counts but never
watches; every cost, limit, and refusal tells the truth"* — is the sentence ME-1 is written to
satisfy; CO-1 (r-polish-brief.md:48, already-shipped per prior memory `project_fpx1_proxy_costcap`)
covers the *cost-cap* half (per-request Netlify proxy caps) but that is Yumi-generation budgeting,
not user-activity telemetry — a distinct mechanism from what ME-1 asks for.

## 3 · ARCS INDEX (`#arcs`, `renderArcsPage`) — the exemplar-wash root cause, nailed

`renderArcsPage()` js/views.js:4156-4401, root `wrap.className = 'arcs lum-amber-deep'` (the light
skin, unchanged). **GR-1 (B2) is confirmed CONSUMED here and correct**: `_arcCardConstellation`
(views.js:4008-4104) now normalizes and plots real `sub.x`/`sub.y` (views.js:4043-4076, comment
4023-4042 self-documents the GR-1 fix) — the earlier B2-census gap ("Arcs-index thumbnail ignores
real x/y") is **closed** as of this HEAD for the "Your arcs" grid (call site views.js:4249) and the
seeded "Pedagogy of Desire" exemplar card (call site views.js:4343).

**Root cause of the washed/blank exemplar card — confirmed, not the seeded/desire card, the
*second* one:**
```
js/views.js:4364-4367
  var flowCard = document.createElement('div');
  flowCard.className = 'arc-card arc-card-illustrated';
  flowCard.appendChild(_arcCardConstellation(null));   // <-- arcId is null
```
`_arcSubsOf(null)` early-returns `[]` unconditionally (views.js:3912-3913, `if (!arcId) { return []; }`).
Back in `_arcCardConstellation`, `!subs.length` is true, so the function hits its own early-exit
guard **before ever calling `bookSubMarkHTML`/`PraxisMarks.render`**: `thumb.className = 'arc-const
arc-const-empty'; return thumb;` (views.js:4015-4018). The only paint that ever happens for this
card is the CSS empty-state dot: `.arcs.lum-amber-deep .arc-const-empty::after{ ... width:11px;
height:11px; ... background:radial-gradient(circle, var(--gold-hi), transparent 70%); opacity:.5; }`
(components.css:1823) — a faint 11px dot at 50% opacity, centered, no threads, no marks. The card's
own comment (views.js:4312-4317) says this is deliberate: *"The Pedagogy of Flow card has NO seeded
data — it's an illustrated example, deliberately not a real arc (design-system v2 Part C3: 'One
live, one illustrated...')."* — but the renderer it shares with every real card has **no illustrated
path**; passing it `null` makes it render literally the same near-nothing a genuinely-empty real arc
would.

**(a) vs (b): this is (b) STRUCTURAL, not a marks.js token re-point.** The early-exit at
views.js:4015-4018 fires *before* any call into `bookSubMarkHTML`/`PraxisMarks.render` — marks.js is
never reached for this card, so there is no jewel-token/color hunk to change inside the byte-locked
file. The fix is a caller-side data problem in views.js: either (1) synthesize a small fixed
illustrative sub-theory-shaped array (fake `.x`/`.y`/`.id` records) to feed
`_arcCardConstellation`, or (2) give the "illustrated example" card a dedicated static SVG/markup
path distinct from the live-data renderer, or (3) accept the empty-state visual but make it
*richer* generically (both would touch `_arcCardConstellation` and/or its CSS, not marks.js, not
arc-constellation.js). No byte-locked file needs editing either way.

`.arc-card-illustrated` (components.css:1622-1625) already carries an intentional `opacity:.78` +
`cursor:default` + a "Illustrated example" label (views.js:4369-4372, `.arc-card-label`) as its
"this is not a real arc" cue — so the card is not *meant* to look identical to the live one; the
gap is specifically that "illustrated" currently means "empty," contradicting its own label.

## 4 · FROZEN GATES / BYTE LOCKS

| file | size | MD5 | expected (PROTOCOL.md / FIX-PROTOCOL.md) | match |
|---|---|---|---|---|
| `assets/marks.js` | 10,255 B | `772886c049d0d6d03d341507e602d88a` | 10,255 B / `772886c0…` | **EXACT** |
| `assets/lumen-amber.css` | 14,966 B | `070679b03453ca0d8405cb6f92ec5ad2` | 14,966 B / `070679b0…` (docs/FIX-PROTOCOL.md:94-95, re-baselined 14,681→14,966 at B3's AES-1) | **EXACT** |
| `js/arc-constellation.js` | 82,923 B | `25a4558952199449430a3e73d382be74` | **no formal byte-lock recorded in PROTOCOL.md or FIX-PROTOCOL.md** (zero hits, grepped) | n/a — informational only |

`git log -1 -- <file>`: `marks.js` → `5cfbea2` (2026-06-29, unchanged through all of R-POLISH);
`lumen-amber.css` → `124fe99` ("B3 lane 1 — AES enforcement, partial", 2026-07-19 — matches the
FIX-PROTOCOL.md note that AES-1 dropped `var(--mk-glow)` at lumen-amber.css:177, the one ruled edit
that moved the byte count); `arc-constellation.js` → `5c92382` (2026-07-04, pre-dates R-POLISH
entirely). PROTOCOL.md §6 item 1 (line 116) states the lumen-amber re-baseline explicitly and names
it as Preston-authorized — consistent, no unrecorded touch.

## 5 · SEARCH (`#search`) and ACCOUNT

**`#search` → `renderSearch()`** js/views.js:1120-1298. Hard signed-out gate (views.js:1128-1135,
in-place `buildSignedOutPrompt`, no redirect). Root: `wrap.className = 'search lum-amber'`
(views.js:1142) — **`lum-amber` bare, not `lum-amber-deep`.** All of `.search`'s CSS
(components.css:13272-13309+) reads `--lum-*` tokens (`--lum-base`, `--lum-ink`, `--lum-gold-l`,
etc.) from the **old, pre-PG-1 dark Lumen-Amber skin** — the same dark-amber design system Interact/
Walk and Other-Profile still use (`lum-amber-ember`), not the light-paper `lum-amber-deep` family
About/Arcs-index/Shelf/Home now use. **This is a real mismatch against the brief's own framing**:
r-polish-brief.md:63 groups Search under "(light)" alongside About/Arcs-index, but Search never
received the PG-1/RD-1 light-paper conversion — it is still on the original dark skin. Either the
brief's parenthetical is imprecise, or Search actually needs a real ground-conversion pass (a
sizable scope item, not "light-touch"). Flag for Preston before scoping B4's Search work.
No XL tier: `.search-page{ max-width:820px; }` (components.css:13273) is the only width rule and has
no `@media(min-width:1600px)` (or 1200px) companion anywhere — occupancy 820/1920=42.7%,
820/2560=32.0%, both far under the 60% floor, but Search is **not named** in XL-1's own surface
enumeration (r-polish-brief.md:26 lists list/detail/spread/Field pages only) — may be intentionally
out of XL-1's scope rather than a defect; not asserted as a bug here.

**`#account`**: DEAD ANCHOR, see §0.1. `renderAccountPage()` (views.js:20602-21974) is defined,
exported, unrouted — genuinely unreachable via any route.

## 6 · RESIDUAL RIDERS

**R2 — nav ~8px overflow, 760-800 band (a.k.a. "DW-NAV768"): REAL, self-documented, unfixed.**
components.css:610-621, the comment placed directly above the fix that partially addressed it:
> *"DW-1 (Stage 3) — scoped UA body-margin reset. theme.css `body{}` never resets the 8px UA margin;
> at >=760 (the desktop horizontal-nav band) those 16px push the nav links past the viewport,
> producing the 768 h-scroll. Reset at >=760 ONLY... A residual 8px page h-scroll at 768 (the nav
> list overruns its pill) is a separate nav-fit item (DW-NAV768), out of this batch's About+Arcs
> scope."*
`.app-nav{ max-width:1080px; ... }` (components.css:632-637); `.app-nav-list{ flex:0 0 auto;
gap:32px; }` (components.css:746-753, never shrinks). Also named in `docs/studio/sequence.md:40/563`
as a carried residual explicitly folded into R-POLISH's **L1** (not B4) — confirm with Preston
whether B4 or L1/close-out owns the actual fix; the brief text doesn't assign it to B4.

**R3 — UA `body{margin:8px}` reset: REAL, confirmed unreset below 760px.** `theme.css` `body{}`
(theme.css:575-586) declares no margin at all (relies on UA default 8px). `@media (min-width:760px)
{ body{ margin:0; } }` (components.css:621) resets it **only at ≥760px**; nothing resets it below.
Self-documented residual: components.css:15381-15389, *"the 8px dark gutter each side at 390...
the body-margin reset itself is logged as a residual for the app-wide chrome pass rather than
reached for from Home's batch."* Currently masked at ≤759 by the viewport-fixed paper-ground
`body::before` (which paints regardless of body's own box margin, since it is `position:fixed`).
**What a global reset would risk:** low — the fixed-ground pseudo already visually covers the
margin band on every surface (not scoped to Home), so a `body{margin:0}` at all widths is likely
safe; **not verified live across all 20 routed surfaces this session** — flag as low-risk, not
zero-risk.

**Notebook spine-line "cutting through the capture card" — UNCONFIRMED by static reading.**
Two candidate "spine" elements exist in Notebook: (1) `.nb-bb-spine` (views.js:1940-1942, the
gilt-edge stripe on the book-band cover) — its container `.nb-bb-cover` declares both
`position:relative` and `overflow:hidden` (components.css:12193), so the absolutely-positioned
stripe is correctly contained; (2) `.notebook-entry::before` (components.css:4188-4194 base,
re-declared under `.notebook.lum-amber-deep .notebook-entry` at 12228 with its own
`position:relative`) — the per-entry register-color bar, also correctly contained, and shares no
class or ancestor with the capture composer. The composer itself is `.nb-composer`
(`buildNotebookWriteline`, views.js:3018-3020) — a distinct class, no selector or negative-margin
path connects any spine rule to it. **I could not locate a structural cause for this defect via
grep + CSS containment reading.** Per "measure the premise": report as unconfirmed rather than
force a fix target; needs a live/visual check (not currently in this session's evidence) before
B4 scopes work against it.

**K-LISTBOX — re-confirmed zero JS, real named debt, NOT band-cheap for B4.**
`grep -rn "k-listbox"` app-wide (tracked files only): hits only in `assets/praxis-kit.css`
(104-110, definitions), `docs/studio/kit/praxis-kit.css` (a design-reference copy, not loaded live),
and doc checkpoints (`r-polish-b3.md`, `r-polish-b3-recon.md`, `slice0-kit.md`). **Zero references
in any `.js` file** — no open/close handler, no keyboard nav, no ARIA wiring, no value-sync, ever.
Self-documented as debt in-file: `praxis-kit.css:92`, *"`.k-listbox` above remains NAMED KIT DEBT —
presentation, zero behaviour."* True build cost estimate: open/close toggle (`data-open` +
outside-click), full keyboard nav (Arrow Up/Down, Home/End, optional typeahead), ARIA
(`role="listbox"`/`"option"`, `aria-expanded`, `aria-selected`, `aria-activedescendant` or roving
tabindex), focus management (trap while open, return-focus on close), and value-sync (selected
label into the trigger button + a change signal to the caller) — realistically 100-200 lines of ES3
plus per-call-site wiring at N adoption points. **This is a real, non-trivial custom-control build,
not something to fold into a "light-touch only" B4 slice** — stays named debt.

## 7 · BASELINES (current HEAD)

| file | bytes | lines |
|---|---|---|
| `assets/components.css` | 782,483 | 15,644 |
| `assets/theme.css` | 39,187 | 734 |
| `assets/praxis-kit.css` | 16,661 | 191 |
| `js/views.js` | 1,050,620 | 22,437 |
| `index.html` | 8,111 | 172 |
| `sw.js` | 4,837 | 138 (`CACHE_VERSION = 'praxis-v3.234'`, sw.js:10) |
| `assets/lumen-amber.css` | 14,966 | — (byte-locked, §4) |
| `assets/marks.js` | 10,255 | — (byte-locked, §4) |
| `js/arc-constellation.js` | 82,923 | — |

## 8 · MOBILE CLAUSE PRECHECK (390px)

**Emoji in chrome:** zero found. Read the full render-function bodies for all three surfaces
(`renderAbout` 21975-22368, `renderArcsPage` 4156-4401, `renderSearch` 1120-1298) — every glyph is
either an inline SVG stroke icon or a plain text label; no literal emoji characters present in any
of the three.

**h-scroll risk:**
- About: mobile block exists, `@media(max-width:759px){ .about{padding:44px 18px 70px 18px;}
  .about .lex{grid-template-columns:1fr;} .about .orientation{padding:24px 18px 18px;} }`
  (components.css:9709-9714). `.about-spine{display:none}` base (components.css:9726) keeps the
  1200px-tier sticky spine fully out of the mobile DOM-visual path. SVG diagrams are
  `width:100%;height:auto` (components.css:9639) — scale down, no fixed-px overflow found.
- Arcs index: mobile rule confirmed live, `@media(max-width:759px){ .arcs.lum-amber-deep
  .arcs-grid{grid-template-columns:1fr;} }` (components.css:1829).
- Search: **zero dedicated `max-width:759px` rules found anywhere for `.search`** (full-file grep
  of every `.search*` selector — all sit in the 13270-13320 desktop-agnostic fluid block; none
  inside any mobile media query). Layout is fluid (`max-width:820px`, `box-sizing:border-box`,
  `flex-wrap` on chips) so structural overflow is unlikely, but this is genuinely **zero mobile
  pass**, unlike About (1 block) and Arcs-index (2+ rules) — flag as possible mobile debt for
  Search, unverified live this session.

**focus-visible gap:** About's `.stn` stations have no `:focus-visible` rule at all (only
`.mtog`/`.about-spine-link` do, components.css:9646/9778) — consistent with §1's finding that they
carry no `tabindex`/`role` either; STN-A11Y must add both together.

## 9 · DOC-VS-CODE DRIFT (flagging per standing instruction)

1. **`docs/studio/sequence.md:571-573` (the mandatory session-start "Now" read) is STALE relative
   to HEAD, moderate-to-high severity.** It reads: *"BATCH PROGRESS (local, unpushed): ... B3 AES
   enforcement, sessions 1+2 (v3.234, LOCAL — awaiting Preston's felt pass)."* But HEAD `0896017`
   IS `origin/main` (pushed), and that exact commit's own subject says *"deployed live-smoke
   results — v3.234 @ 7ddd3c8, 22/22 PASS."* B3 is pushed, live, and 22/22 deploy-smoke-verified —
   only Preston's own felt-pass (a legitimate human-only gate) is genuinely still open. Calling it
   "LOCAL, unpushed" is factually wrong and would mislead a B4 session about round state.
2. **`docs/checkpoints/r-polish-b3.md:10` self-contradicts its own body.** Header stamp: *"STATUS:
   BATCH COMPLETE, LOCAL ONLY. Awaiting Preston's felt pass and push word."* But the same file's
   tail (lines 342-406) records `## SHIPPED — pushed on Preston's word, v3.234 LIVE`, the deploy
   incident (a broken Netlify↔GitHub host-key link, fixed by Preston, documented at lines 351-364),
   and a full 22/22 deployed-live-smoke table. The top-of-file stamp was never updated after the
   SHIPPED section was appended.
3. **`docs/studio/builder.html` one commit behind the round's actual head.** Last touched at commit
   `7ddd3c8` (the B3 feat commit) — its own stamp shows `<code>124fe99</code>` / `praxis-v3.234` /
   "generated 2026-07-19 23:25 UTC" — but the round has advanced one more commit since (`0896017`,
   the deployed-live-smoke docs commit, which is the actual push-point per CLAUDE.md's BUILDER
   CADENCE rule: "the FINAL LOCAL commit that awaits Preston's push word IS the push point — the
   Builder regen rides that commit"). Minor severity, but technically outside the stated cadence.
4. **`docs/Checklist and Roadmap/BUILD_STATE.md`** still stamped "Authoritative as of 2026-07-03,"
   `praxis-v3.172`, HEAD `c3f0d2d` (lines 9-11) — unchanged for many sessions, ~62 cache-versions
   behind live v3.234. Same long-standing, previously-flagged drift (see memory
   `anchors_confirmed.md`), re-confirmed this run, not new.

## Mismatches ranked by severity

1. **DEAD ANCHOR — `#account` (§0.1, §5).** The brief names "Account" as a B4 light-page target;
   no such live page exists (`location.replace('#profile')`, `renderAccountPage` unrouted). Needs
   Preston's call on what "Account" actually means for B4 before any build work starts here.
2. **`docs/studio/sequence.md`'s "Now" entry mis-states B3 as local/unpushed (§9.1).** The
   mandatory session-start doc is factually wrong about the most recent round state — a B4 session
   trusting it would misjudge whether B3 shipped.
3. **Search's ground mismatches the brief's "(light)" framing (§5).** `.search.lum-amber` is still
   the old dark Lumen-Amber skin, not the light-paper family About/Arcs-index/Home now share — this
   changes B4's real scope size for Search if it needs converting, not just polishing.
4. **Arcs-index exemplar-wash root cause is structural, in views.js, not a marks.js token fix
   (§3).** Confirmed exact line (`views.js:4367`, `_arcCardConstellation(null)`) and exact guard
   clause that short-circuits before marks.js is ever reached (`views.js:4015-4018`). No frozen-gate
   collision, but the brief's implicit "small fix" framing (grouped with STN-A11Y as light-touch)
   may under-scope it slightly — it needs a real (if small) data-shape decision, not a token swap.
5. **About has no XL/1600 tier and fails the 60% floor at 2560 (§1).** Same pattern already fixed
   for Book Detail/Field/Home/Notebook in B2/B3; About was never given the treatment. Passes at
   1920 only by accident (60.4% declared / 63.4% measured, both just over the floor).
6. **R2 "DW-NAV768" nav overflow — real, self-documented, but not clearly B4's to fix (§6).**
   `sequence.md` currently assigns it to L1, not B4; the recon brief that spawned this task implies
   B4 should verify/size it. Needs scope confirmation.
7. **Notebook spine/capture-card overlap — UNCONFIRMED (§6).** Could not locate a structural cause
   via static reading; both candidate "spine" elements are properly CSS-contained. Report as
   unverified rather than asserted; do not build a fix against an unconfirmed premise.
8. **K-LISTBOX real cost (§6), builder.html one-commit lag (§9.3), BUILD_STATE.md staleness
   (§9.4), R3 body-margin reset (§6), Search's zero mobile pass (§8), r-polish-b3.md self-
   contradicting header (§9.2)** — all real, all low-to-moderate, none blocking, all listed above
   with exact citations.
