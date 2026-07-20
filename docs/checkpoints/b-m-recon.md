# B-M (LANE A) — Stage-0 recon — the R-POLISH mobile batch

Model: Sonnet (gate agent, read-only recon) · HEAD `a443b45` (subject: "fix(R-POLISH
B4-FIX): the About measure reaches the band Preston actually reads in, and the SW
stops choking on extension requests") == `origin/main` · governing viewport for this
batch: **390** (OWNER-VIEWPORT PRIMACY / FELT-DELTA CLAUSE, CLAUDE.md).

**No app code, docs, or state touched. No screenshots taken — this session has no
browser tool; every finding below is a STATIC relational read (file:line), the first
of the mobile canon's two-layer gate. Live-390 CDP confirmation is deferred to the
build/verify session that runs the picked slice(s).**

---

## 0 · PREMISE CHECK — the tree is NOT clean

The task brief stated "tree clean." It is not:

```
 M CLAUDE.md
 M docs/checkpoints/r-polish-b4.md
?? (103 untracked files — design/ zips, docs/checkpoints/*.md, docs/studio/mockups/*, etc.)
```

- `CLAUDE.md` working-tree diff = exactly the FELT-DELTA CLAUSE / OWNER-VIEWPORT
  PRIMACY / CAPTURE PROVENANCE block the task told me to treat as binding law
  (`git diff -- CLAUDE.md`, +19 lines after the XL-tier lesson). **These three laws
  are UNCOMMITTED** — present in the working tree at HEAD `a443b45`, not yet part of
  any commit. I applied them anyway (they are the working state of the file you told
  me to read), but flag this: any OTHER session reading `CLAUDE.md` via `git show
  HEAD:CLAUDE.md` (rather than the live file) will not see them.
- `docs/checkpoints/r-polish-b4.md` working-tree diff = a "CLOSED 2026-07-20" stamp
  (Preston's B4 verdict) prepended, also uncommitted.
- 103 untracked files are pre-existing clutter (design zips/HTML mockups, old
  checkpoint docs, screenshots) — not created this session, not touched.

Both dirty files are consistent with an in-progress "commit these once B-M's own
work lands" pattern, not corruption — but the recon's own governing instruction
("HEAD = a443b45, tree clean") was wrong at dispatch. Reported, not fixed (read-only).

---

## 1 · Baselines

| file | bytes | lines |
|---|---|---|
| assets/components.css | 794,249 | 15,836 |
| js/views.js | 1,058,894 | 22,565 |
| index.html | 8,602 | 179 |
| manifest.json | 312 | 16 |
| sw.js | 6,010 | 156 |

`sw.js` `CACHE_VERSION` = `'praxis-v3.236'` (sw.js:10) — matches the task brief's
"live sw.js v3.236."

**Frozen locks — EXACT, unchanged:**

| file | bytes | MD5 |
|---|---|---|
| assets/marks.js | 10,255 | `772886c049d0d6d03d341507e602d88a` |
| assets/lumen-amber.css | 14,966 | `070679b03453ca0d8405cb6f92ec5ad2` |

Both match the task brief's stated values exactly (byte count and hash prefix).

**B-M's charter, verified against `docs/studio/sequence.md:576-580`** (the only
place B-M's scope is written down — it is not in `r-polish-brief.md`, which never
mentions "B-M" or mobile at all): *"B-M is a dedicated MOBILE batch and it owns the
app's EXISTING mobile debt: kit/canon application at 390 · safe-areas · emoji →
stroke icons · focus rings · cluster normalization · and the app-feel micro-riders
(tap-highlight, overscroll, user-select, manifest-icon verify)."* The 6-item slate
handed to this recon covers safe-areas + micro-riders + kit/canon-application
closely; **icon law, focus rings, and cluster normalization are named in B-M's own
charter but are NOT in the 6-item slate** — out of this recon's scope, flagged so
the fork report knows the slate is a subset, not the whole batch.

---

## 2 · Item 1 — ≤759 UA body-margin band

**Anchor:** `assets/components.css:621` — `@media (min-width: 760px) { body { margin: 0; } }`
(exact line; the task brief's "622" is the following blank line). Comment block
above it (`components.css:610-620`, "DW-1 (Stage 3)") self-documents the reset is
`>=760 ONLY, so <=759 ... stays byte-unchanged` — i.e. it was written knowing it
does not cover mobile.

**Ground mechanism (`assets/theme.css:575-583, 623-657`):** `body{background:
transparent}` (575-583); the visible ground is `body::before{position:fixed;
inset:0; ...}` (623-642, light) with a `[data-ground="dark"]` override (655-657).
Fixed + `inset:0` means the ground ignores `<body>`'s box entirely — it paints the
true viewport edge regardless of the 8px UA margin. This is why a prior B4 census
memory called the gutter "masked."

**That framing is incomplete — measured, not assumed.** The ground's own fill
differs in shade from the OPAQUE chrome that sits inside the margin-shrunk `<body>`
box:

| ground token (fixed layer) | opaque UI on top (inside body's margin) |
|---|---|
| light: `--page` = `#f4efe4` (theme.css:45) | `.app-nav{background:var(--surface)}` at ≤759 = `#fffdf8` (theme.css:217, components.css:5575) |
| dark: `--ground` = `#191F33` (theme.css:38) | dark-route nav surface remaps to `--surface-d` = `#232838` (theme.css:40,550) |

Both pairs differ by a real (if small, ~10-25/255 per channel) amount. Wherever
opaque chrome abuts the true edge — concretely, the mobile nav bar
(`.app-nav` ≤759, `components.css:5560-5578`, `position:relative`, solid fill,
`height:auto;min-height:56px`) — the 8px UA margin shows as a thin strip of the
GROUND's tone flanking the nav on both sides, for the nav's full height, distinct
from the nav's own fill. It is not literally invisible; it is subtle.

**FELT DELTA at 390:** a hairline (~8px) band of ground-tone visible down both
edges of the mobile nav bar (and any other full-bleed opaque chrome), replaced by
edge-to-edge nav fill if fixed. Small but real and statable — passes the
FELT-DELTA CLAUSE bar. Elsewhere (page content that itself sits on the ground
color, e.g. Home's own sections per the `PG-1` comment at `components.css:15573-
15581`), the seam really is invisible — the prior "masked" framing holds ONLY there.

**Fix shape:** mirror the existing rule — `@media (max-width:759px){body{margin:0}}`
(or drop the `min-width` qualifier entirely on the existing rule). CSS-only, one
rule, single surface (global-shell). **Bucket: OVERNIGHT-eligible.**
**Canon pattern:** none of P1-P9 name UA-margin resets directly; closest kin is the
app-wide-chrome residual class the DW-1 comment itself uses — cite as a named
residual, not a mislabeled P-pattern.

---

## 3 · Item 2 — Search dark→light ground conversion (deferred from B4)

**Anchor:** `renderSearch()` — `js/views.js:1126` (both the signed-out branch at
:1137 and signed-in at :1148 set `wrap.className = 'search lum-amber'`). Route:
`umberGroundDark['search']=1` (`views.js:474`), so `<body data-ground="dark">` on
`#search` regardless of the panel's own skin.

**Current ground mechanism — confirmed the OLD dark family, not `-deep`.** Every
one of the ~56 `.search.lum-amber *` selectors (`components.css:13464-13535`) reads
raw `--lum-*` tokens (`var(--lum-ink)`, `var(--lum-base)`, `var(--lum-gold-l)`,
`var(--lum-serif)`, …) — the same pre-PG-1 dark-panel family as `.yumi-panel.lum-
amber-deep` / `.account.lum-amber-ember`, NOT the light-paper family (`--page`,
`--page-2`, remapped `--lum-ink`) that About/Arcs-index/Home/Shelf/Notebook now
share as `X.lum-amber-deep`. **Search is the one surface never converted.**

**What conversion touches:** the root class rename (`lum-amber` → `lum-amber-deep`,
matching the light family's naming convention) plus re-pointing every one of the
~56 rules in that block from raw `--lum-*` literals to the light-paper tokens (the
`-deep` pattern used elsewhere re-declares `--ink`/`--ink-2`/`--surface-2` etc.
scoped under the class, not a 1:1 token swap) — a real, non-trivial CSS pass across
a ~70-line dedicated block (`components.css:13464-13535`), not a light touch.

**AES-2 coupling risk, confirmed present and non-trivial:** the block leans on gold
being the sole lift color against a dark base (`.search-chip.is-on{color:var(--lum-
gold-ink); background:linear-gradient(...var(--lum-gold-l),var(--lum-gold))}`,
`components.css:13480`; `mark{background:rgba(255,206,74,.22);color:var(--lum-gold-
l)}`, :13504) — lightening the ground without re-deriving these WILL under-contrast
gold-on-gold-tinted-cream, exactly the coupling trap named in the brief.

**FELT DELTA:**
- **390:** the search page currently reads as a full-bleed dark amber room (matches
  no other mobile surface's paper feel); conversion would make it read as a cream
  page like Shelf/Notebook. Statable, real, but this is the exact surface the ONE
  4-line mobile block (`components.css:13528-13534`, padding/font-size only) also
  lives on — converting ground WITHOUT re-verifying those 4 rules against the new
  light tokens risks a second, smaller felt regression inside the same slice.
- **1360:** desktop `.search-page{max-width:820px}` (components.css:13465) currently
  centers a dark card on the dark-route ground (visually coherent, both dark);
  post-conversion it would be a light card that must also be checked against
  `<body data-ground="dark">`'s ground (still dark at the route level per
  `umberGroundDark['search']=1`) — i.e. **converting the PANEL alone, without also
  reconsidering the route's `data-ground` value, produces a light card floating on
  a dark body ground**, a mismatch every other `-deep` surface avoids by ALSO being
  in the light `umberGroundDark` exception set. This is a real architecture
  question the fork report should carry forward, not silently resolve.

**Bucket: DAYTIME ROUND WORK, never overnight** (per the task's own instruction and
independently confirmed by scope — this is a ground-family conversion + a
route-ground-vs-panel-ground question, not a CSS tweak).
**Canon pattern:** none of P1-P9 directly (ground/skin is canon-fidelity lens
territory, not a mobile-interaction pattern); P7 (input discipline) is
INCIDENTALLY already satisfied on Search's mobile input (`font-size:20px`,
`components.css:13531`, clears the 16px floor).

**Adjacent finding, not in the 6-item slate but load-bearing for how B4's "(light)"
framing should be read going forward:** `#search` has **no entry point on mobile at
all**. `.app-nav-search` (the nav pill that routes to `#search`, `spotlight.js:441-
453`) is `display:none` at ≤759 (`components.css:5593-5595`, "the glass search is
desktop chrome"), and the mobile hamburger list (`index.html:46-56`, reused
verbatim at `≤759` per `components.css:5601` `.app-nav.app-nav-mobile-open .app-
nav-list`) has no Search entry either — Home/Shelf/Arcs/Notebook/About/Account
only. ⌘K opens a DIFFERENT surface (the Spotlight overlay, `spotlight.js:342-360`),
not the `#search` route. This matches `docs/studio/search.md:19`'s existing
HIGH-severity gap IA1 exactly — re-confirmed live via code read, not carried from
the doc. Ground-converting a page mobile users cannot reach is lower-leverage than
it looks; flagging for the fork discussion, not resolving it.

---

## 4 · Item 3 — App-feel micro-riders

Exhaustive absence checks below ran across **every stylesheet `index.html` loads**
(`index.html:12,13,15,16,21,28` → Google Fonts remote, `lumen-amber.css`,
`theme.css`, `components.css`, `praxis-kit.css`, `docs/studio/universal-depth.css`)
plus `index.html`'s own inline markup.

| rider | current state | anchor | felt delta @390 | overnight? |
|---|---|---|---|---|
| `-webkit-tap-highlight-color` | **ZERO hits, any file** | — (absence, exhaustive per above) | every tap on every control shows the UA default blue/grey flash; a global reset removes it app-wide, on every surface, every tap | **YES** — 1 global rule, revert-safe, CSS-only |
| `overscroll-behavior` | **ZERO hits, any file** | — (absence, exhaustive) | rubber-band/scroll-chaining at page-scroll boundaries, most noticeable in standalone PWA mode; a global `overscroll-behavior-y:contain` (scoped to `html,body` or `#app`) removes it | **YES** — 1 global rule, revert-safe, CSS-only |
| `touch-action` | set in exactly **one** place, deliberately | `.yumi-mic-btn{touch-action:none}` (`components.css:513`, voice-in press-and-hold) | no other interactive/draggable control sets it. **The one real candidate — the arc-field constellation's drag/connect canvas — is explicitly OUT of B-M's scope**: it is its own named backlog item, "ARC-FIELD MOBILE TOUCH MODEL" (`docs/studio/sequence.md:627`, carried in Next), not B-M's to touch. | **N/A** — no in-scope gap found |
| `-webkit-overflow-scrolling: touch` | present on 4 inner-scroll surfaces, **absent on at least 3 others** | present: mobile nav panel (`components.css:5616`), Notebook `.nb-tabs` h-scroll (`:12486`), `.intro-journey` (`:14716`), profile `.pf-panel-bd` (`:15352`). absent: Shelf mobile filter drawer `.shelf .shelf-side` (`overflow-y:auto`, `:10291-10296`, no touch hint); Shelf `.shelf-manage-sheet` (`overflow-y:auto`, `:12894-12902`, no touch hint); Sub-theory mobile rail `.st-gutter.subtheory-rail-mobile-open` (`overflow-y:auto`, `:10364-10369`, no touch hint) | inertial/momentum scroll inside these 3 panels may feel sticky/stepped on iOS Safari/WebView vs. the 4 that already have it | **YES, but NOT single-surface as one item** — splits into a Shelf item (2 selectors) + a Sub-theory item (1 selector) per the overnight rubric's "single-surface" rule |
| manifest.json — maskable icon / sizes / theme-color / display | **display:standalone YES, theme_color YES (`#191F33`, matches `index.html:6`'s `<meta name="theme-color">` exactly)** — **maskable icon MISSING**: the one declared icon (`manifest.json:8-14`) is `assets/icon.svg`, `"sizes":"any"`, `"purpose":"any"` — no `"purpose":"maskable"` entry, no raster PNG fallback sizes (192/512, the common Android-launcher expectation) | `manifest.json:1-16` (whole file, only 312 B / 16 lines) | on Android home-screen install, the icon may render un-masked/oddly cropped inside the OS's adaptive-icon shape vs. a proper maskable safe-zone asset | **FLAG, not a clean yes** — manifest.json is outside the rubric's stated allowlist ("CSS + views.js ONLY"); it is not on the categorical-exclusion list either (that names `state.js`/`integrations.js`/`firestore.rules`/`sw.js` specifically), so this is a genuine ambiguity, not a clear pass or block — surfacing for Preston's bucket call, not assuming either way |

---

## 5 · Item 4 — Safe-area / standalone collisions

`index.html:5` — `<meta name="viewport" content="width=device-width, initial-scale=1,
viewport-fit=cover">` — present, count 1 (P4 static check passes).

`env(safe-area-inset-*)` — **8 occurrences app-wide**, all `-bottom` or `-top`,
none `-left`/`-right`: `components.css:5567` (nav top), `:5589` (`#app` bottom
scroll-gutter for the Bloom FAB's clearance), `:5618` (mobile menu panel bottom),
`:12899` (Shelf Manage sheet bottom), `:12912` (Shelf `+Add` FAB bottom),
`:14858`/`:14892`/`:14938` (intro-journey / intro-panel bottom bars).

**Real collision candidate, well-evidenced: the Yumi Bloom FAB itself does NOT use
`env()`.** `.yumi-bloom{position:fixed;bottom:var(--sp-5);right:var(--sp-5);
z-index:9999}` (`components.css:19-23`; `--sp-5:24px`, `theme.css:232`) — a
STATIC 24px offset, present on **every route** (the z-ledger's own "Bloom 9999"
entry, CLAUDE.md Operational notes). Contrast: the Shelf `+Add` FAB (also
bottom-anchored, `.shelf-add-primary`) explicitly adds the inset
(`bottom:calc(var(--sp-5) + env(safe-area-inset-bottom))`, `:12911-12912`) — the
Bloom orb is the ONE fixed corner element (per its own "AMB-1 · THE CORNER LAW"
comment, `components.css:11-18`, "ONE of the two ruled fixed elements") that skips
the pattern its sibling already uses. On a notched/home-indicator iPhone in
standalone mode (`display:standalone` per manifest), the home indicator's own
gesture-reservation band is commonly ~34px — a static 24px offset sits INSIDE that
band, not clear of it. `#app{padding-bottom:calc(96px + env(safe-area-inset-
bottom))}` (`:5589`) protects scrolled CONTENT from the orb, but nothing protects
the orb ITSELF from the home indicator.

**Second candidate:** `.shelf.lum-amber-deep .shelf-selectbar{position:fixed;
left:0;right:0;bottom:0;...padding:14px 22px;...}` (`components.css:12797`) — the
full-width Select-mode action bar (Shelf bulk-select), no `≤759` scoping (it is a
base rule, live at every width), also has no `env()` term while sitting flush at
`bottom:0`.

**FELT DELTA at 390 in standalone PWA mode specifically** (not reproducible in a
normal mobile-Safari tab, since only standalone launches reserve the home-indicator
band the same way): the Bloom orb's tap target sits partly under/adjacent to the
gesture bar instead of clear above it; the Shelf select-bar's bottom edge (and its
`move`/`cancel` buttons) sit flush against the indicator rather than padded clear
of it.

**Bucket: OVERNIGHT-eligible**, both — single CSS-property additions
(`env(safe-area-inset-bottom)` added to two `bottom:` values), single-surface each
(Bloom = global-shell; select-bar = Shelf), revert-safe, objectively verifiable by
grep count (8→10) and a computed-style check.
**Canon pattern: P4 (Safe-area insets)** — direct hit, this is exactly P4's stated
rule ("Fixed chrome pads with `env(safe-area-inset-bottom)` ... Insets are
additive padding, never replacements").

---

## 6 · Item 5 — Shelf action-button consolidation

**ALREADY SHIPPED — the slate's framing ("→ ONE mobile button," implying open
work) does not match live code.** Confirmed by direct read of `renderShelf()`
(`js/views.js:4497-4955`), not by trusting the ledger:

- Always-visible toolbar (`toolbar`, every viewport, `views.js:4635-4864`):
  `newBtn` (＋ Add a book, primary, `:4734-4741`) · `sortWrap` (Sort, `:4774-4821`)
  · `filterBtn` (Filters, `:4840-4855`) · `manageWrap` (the Manage trigger,
  `:4651-4660`, appended `:4860`) · `searchWell` (the "Filter shelf…" text input,
  `:4937-4953`).
- Everything else routes into `manageBody` (the P1 sheet/popover), confirmed at
  its actual `.appendChild` call sites, exactly 7 controls: `seg` (Covers|List,
  `:4769` — **"MW-1 P1: Covers|List lives in the Manage sheet"**), `selectBtn`
  (`:4834`), `scanBtn` (`:4886`), `barcodeBtn` (`:4897`), `bulkBtn` (`:4906`),
  `resolveBtn` (`:4923`), `tidyBtn` (`:4933`).
- This is byte-for-byte what `overnight.md`'s ON-2 entry claims shipped
  (`docs/studio/overnight.md:112-126`, `status: closed`, commit `a405730`,
  "ABSORBED BY MW-1"), and matches `books.md`'s `mobile: native` chip.

**Minor doc-vs-code drift found in the SAME file, not from any external doc:** the
comment block introducing the toolbar (`views.js:4630-4634`, "one primary Add a
book + Covers|List segmented + a quiet Filters toggle...") describes the
PRE-MW-1 shape (Covers|List in the always-visible row) — it was never updated when
the very next comment block (`:4640-4644`) and the actual code (`:4769`) shipped
Covers|List into Manage instead. Low severity (comment-only, no behavior split),
flagged per the doc-drift instruction.

**FELT DELTA: none — reclassify as verify-only per the FELT-DELTA CLAUSE.**
Nothing to build; the target state (canon §4-E's "1 primary + chips," further
refined by ON-2's Manage layer) is live. **Not an overnight candidate — there is
no code left to change.**
**Canon pattern: P1 (Bottom sheet)** — Shelf Manage IS the canon's own named
"Reference implementation" for P1 (`praxis-mobile-canon.md:39-40`); P2 (thumb-zone,
the `.shelf-add-primary` relocation) also already applied (`components.css:12907-
12915`).

---

## 7 · Item 6 — Mobile-canon chip status + unapplied patterns

**Chip census (`docs/studio/*.md` frontmatter `mobile:` field, read directly, not
from memory):**

| chip | surfaces |
|---|---|
| `native` (8) | arc-detail, arcs, book-detail, books, home, notebook, subtheory-build, subtheory-page |
| **no `mobile:` field → `desktop-only` by canon default** (13) | about, account, artifact, book-marks, commons, cross-cutting, import-capture, onboarding, profile, reader, **search**, spotlight, yumi-panel, yumi-sees |

**Search — the item-2 target — is a `desktop-only` chip with real code
disagreeing slightly**: it does carry ONE mobile reflow block (`components.css:
13528-13534`, 4 rules — padding/input-size/icon-offset/title-size), which is more
than "zero," so "desktop-only" undersells it a little, but nowhere close to a
`native` pass: **P3 (44px tap targets) is unmet** on `.search-chip`
(`components.css:13478`, `padding:7px 14px` + ~10px font ≈ 26px effective height,
no mobile override raising it) and on `.search-res` rows (no explicit min-height
anywhere in the block). No P1/P5/P6 applicability (no sheet, no large-title, no
segmented control on this surface). P7 partially met (input font-size 20px at
mobile, `:13531`, clears the 16px floor) but the `.search-chip`/`.search-res`
text itself was never audited against 16px at mobile.

**B-M-touched-surface pattern map (the 6 slate items only):**

| item | surface(s) | canon pattern(s) | status |
|---|---|---|---|
| 1 (body-margin) | global-shell | none of P1-P9 (named residual, not a canon pattern) | unapplied |
| 2 (Search ground) | search | none directly; P7 incidentally met on the input | search stays `desktop-only`; P3 gap open regardless of ground work |
| 3 (micro-riders) | global-shell / Shelf / Sub-theory | none of P1-P9 (B-M's own separately-named "app-feel micro-rider" category, `sequence.md:578-579` — NOT one of the 9 ratified patterns; citing a P-id here would be a fabricated citation) | tap-highlight/overscroll unapplied; overflow-scrolling partially applied (4 of 7 identified inner-scroll surfaces) |
| 4 (safe-area) | global-shell (Bloom), Shelf (select-bar) | **P4** — direct hit | 8 of 10 identifiable fixed-bottom elements comply; Bloom + select-bar do not |
| 5 (Shelf consolidation) | books | **P1, P2** — direct hits, both already the canon's own reference implementations | fully applied, shipped |

---

## 8 · Fork-report ranking — overnight candidates (CSS + views.js only, ≤3 tonight)

Ranked by (a) severity/confidence of the gap, (b) cleanliness of the fix (mirrors
an existing proven pattern in the same file), (c) footprint (single rule vs.
multi-selector), (d) single-surface compliance per the overnight rubric.

1. **Bloom FAB safe-area** (§5) — `components.css:19-23`, add
   `+ env(safe-area-inset-bottom)` to `bottom:var(--sp-5)`. Highest confidence real
   defect (a persistent, every-route, most-prominent fixed control with a concrete
   iOS standalone collision risk), smallest fix, mirrors the EXACT pattern already
   proven twice in the same file (`:12899`, `:12912`). Single surface: global-shell.
   Canon: P4 direct hit.
2. **≤759 body-margin reset** (§2) — `components.css:621`, add the mirror rule
   `@media(max-width:759px){body{margin:0}}`. Cleanest possible fix (copies an
   existing 1-line rule verbatim, inverted), real if subtle felt delta, zero
   behavioral risk (a pure layout-offset change, not a color/token change). Single
   surface: global-shell.
3. **`-webkit-tap-highlight-color` reset** (§4) — one new global rule (e.g. scoped
   to interactive selectors or `*`), zero prior art to contradict, standard
   best-practice hardening, every-tap visible improvement (arguably the MOST
   universally felt of the three, since it fires on every single tap app-wide).
   Single surface: global-shell.

**Held below the top 3, available if Preston swaps one out:**
4. Shelf `.shelf-selectbar` safe-area (§5) — same fix shape as #1, lower severity
   (Select mode is a less-visited state than "every route, always visible").
5. `overscroll-behavior` reset (§4) — same shape as #3, subtler effect (only
   noticeable at scroll boundaries / in standalone mode).
6. `-webkit-overflow-scrolling:touch` backfill (§4) — real but lowest-visible-impact
   gap found, AND fails the rubric's literal "single-surface" test as one item (it
   spans Shelf + Sub-theory); would need to ship as two separate overnight items
   if picked, eating 2 of the 3 slots for the smallest felt delta on this list.

**NOT overnight-eligible (excluded from the ranking above):**
- Search ground conversion (§3) — ROUND WORK by explicit instruction and by scope
  (a ~70-line, ~56-selector CSS-family conversion + an unresolved route-ground-vs-
  panel-ground architecture question), never a single CSS rule.
- Shelf action-button consolidation (§6) — already shipped; no code to change.
- manifest.json maskable icon (§4) — flagged, not ranked: outside the rubric's
  literal "CSS + views.js ONLY" allowlist; needs Preston's bucket call before any
  session (overnight or otherwise) touches it.

---

## 9 · HALT-worthy findings, ranked by severity

1. **Working tree was not clean at dispatch** (§0) — the task's own premise
   ("HEAD = a443b45, tree clean") was false; two tracked files carry uncommitted
   diffs, one of which IS the very law block (FELT-DELTA / OWNER-VIEWPORT /
   CAPTURE PROVENANCE) the task told this recon to treat as binding. Applied
   anyway (it is the live working-tree state), but any parallel session reading
   `CLAUDE.md` via a committed ref would miss it.
2. **manifest.json ambiguity** (§4, §8) — the one slate item that names a file
   outside the overnight rubric's positive allowlist ("CSS + views.js ONLY") without
   being on its categorical-exclusion list either. Genuine gap in the rubric's own
   coverage, not resolved here.
3. **Item 2's framing risk** — converting Search's panel ground without also
   revisiting `umberGroundDark['search']` (route-level dark) produces a light card
   on a dark body ground; this is an architecture fork the fork report should
   surface explicitly, not a mechanical CSS pass.
4. **Item 5 is a dead premise** — the slate names it as if open; it shipped in
   MW-1 (`a405730`, 2026-07-10) and is `mobile: native` in `books.md`. No HALT
   needed (verified, not ambiguous) but flagged so it is not accidentally
   re-scoped into tonight's build.

No slate item names a genuinely nonexistent anchor (no dead-anchor HALT).
