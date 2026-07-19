# R-POLISH B3 — BUILD · SESSION 1 (PARTIAL, LOCAL ONLY)

Model: Opus 4.8, default effort (ultracode OFF) · gate agents Sonnet ·
base HEAD `989e175` (v3.233) · Stage-0 recon: `docs/checkpoints/r-polish-b3-recon.md`

**STATUS: LANE 1 PARTIAL. Committed LOCAL, not pushed. `sw.js` NOT bumped (still
v3.233). `lumen-amber.css` byte-lock NOT yet re-recorded — that rides the ship commit,
as ruled.** A fresh session finishes the batch from here.

Preston's four Stage-0 rulings received and applied: (1) re-baseline the lumen-amber lock
for one ruled line · (2) hue/density split confirmed · (3) dog-ear identified · (4) AES-4
split into styled-native now + k-listbox as named kit debt.

---

## DONE + VERIFIED LIVE

### AES-1 · THE GLOWS RETIRE — both mechanisms

Recon found two architecturally distinct glow systems, not one.

**Mechanism A — the Field's own halo.** `arc-constellation.js:871/882` emit a blurred
`<circle r="54" fill="var(--subtheory-N)" opacity="lum(maturity)">` behind each glyph.
Retired via CSS on the renderer's OUTPUT (`fill` is a presentation attribute and loses to
any CSS rule — the R1 precedent), selected by `circle[r="54"]`, which is the halo and
nothing else. **Locked renderer byte-identical.**

**Mechanism B — `PraxisMarks`.** `marks.js:96` stamps a literal hex into an inline
`--mk-glow`; the paint lives at `lumen-amber.css:177`. That `var(--mk-glow)` read is
DROPPED in favour of `var(--mark-glow)` — one ruled line, byte-locked file, re-baseline
authorised. **`marks.js` itself untouched.**

**THE SPLIT (the ruling):** only `fill` is touched. `opacity` still carries
`lum(maturity)` — annotation density — straight from the renderer.

| Probe | Before | After |
|---|---|---|
| distinct halo fills | 4 candy hues (`#7CC6DA`,`#E8B45C`,`#E8998D`,`#F2A8C6`) | **1 — `rgb(199,154,58)` = `#C79A3A`** |
| `allHalosGold` | false | **true** |
| density signal | varies | **still varies** — `0.32 / 0.4 / 0.5 / 0.6` |

New token `--mark-glow: var(--gold-world)` (theme.css) is the single home for every mark
glow, app-wide.

### AES-2 · ONE WORLD, SHEETS ON IT — Shelf + Notebook

Recon finding: both still ran the **pre-Home mechanism** — each painting its own opaque,
full-bleed, `background-attachment:fixed` ground, the exact technique B1-FIX retired for
Home. They never got the conversion, so crossing into them changed apps.

**Deliberately NOT `background:transparent`** (Home's answer). Home flips its ink ramp to
cream and puts work on `.lit-page` cards; Shelf/Notebook keep **dark ink on light paper**,
so transparency would have put dark text straight onto the twilight world — the B1-FIX
coupling trap. The sheet itself becomes the lit surface; the world shows in the margins.

Each wrapper now: `--card-1`→`--card-2` vellum · `background-attachment:scroll` (a sheet
scrolls with the page; only the world is fixed) · `margin:var(--sheet-gap)` ·
`border-radius:var(--card-radius)` · `box-shadow:var(--card-shadow)`.
New token `--sheet-gap: 18px`. **Every internal layout rule, column and card untouched** —
Shelf's composition stays R-SHELF's, per the light-touch exemption.

### AES-5a · THE DOG-EAR — identified, and it is OURS

Preston's ruling suspected baked-in Goodreads assets. The probe found otherwise: it is a
**bypassed sanitiser in our own fetch path**.

`integrations.js:1975` (`googleBooksLargestCover`) already strips `&edge=curl`. But two
read sites — `:1812` (`fetchGoogleBooks`) and `:1913` (the recommend path) — took
`imageLinks.thumbnail` **raw** and normalised only the protocol, so the curl survived.
Google Books bakes the page-fold into the IMAGE via that URL param.

Fixed at both sites. **Plus** the load-time normaliser `normalizeCoverUrlsToHttps`
(`state.js:2803`) now strips it too, so **covers already stored heal** — without that, the
fold would persist for exactly the books that showed it. Same rewrite class the normaliser
already performs on the same field, flushed by the same `changed` flag: **no new field, no
new record, no new save path.**

Verdict: band-cheap in the fetch path, shipped per the ruling. NOT reclassified to intake.

### `--m1` ON-GROUND RIDER

`--m1` (`#D9B24A`) measured **1.92:1** as a mark fill on parchment — below the 3:1 non-text
floor. Ratified token untouched; new `--m1-on-ground: #B08A25` is scoped to the two
light-ground consumers only (`.arcfield .arc-detail-web-view`, `.home-arc-ff`, `.home-wf`),
re-pointing `--m1` for those subtrees so slots 1/6/11/16 fix through the RD-1 collapse.

Measured after: **3.07:1**. **RESIDUAL — that is a thin margin.** Worth darkening a notch
for robustness before ship.

Recon confirmed the blast radius is exactly those two surfaces: the mark picker and
`.itx-root .room-threshold` render on DARK and correctly keep the ratified value; no
consumer renders on both grounds.

---

## NOT DONE — the fresh session's work

| Item | Anchor | Note |
|---|---|---|
| **AES-3** arc header → kit | seg `views.js:13617-13637` · chip `:13342` · life-btns `:13348-13368` · DELETE `:13600-13607` | all bespoke; kit peers exist. **DELETE ARC is ALREADY confirm-gated** (`openArcDeleteConfirm` `:14293+`) — re-skin the button, preserve the panel |
| **AES-4** styled-native select | `views.js:11983-12031` | ruled: `appearance:none` + kit dress + custom chevron, ALL widths. Full `.k-listbox` component = **named kit debt** (zero JS exists app-wide) |
| **AES-5b** thumbnail plate-frame | `.arc-const` `components.css:1819` · `.home-arc-ff` `:13155` | `.home-wf` already has a plate at `:13517` — precedent to match |
| **Book Detail XL** | `renderBookDetail` `views.js:9762-10212`; CSS `10877-11442`, XL block `11355-11391` | block fires at `min-width:1200`, `.bk-shell` hard-capped `max-width:1200px` → **62.5% at 1920 (pass), 46.9% at 2560 (FAILS the ≥60% floor)**. Measure already ≤72ch (6 selectors capped, `:11407-11423`). Rail consolidation list: **0 of 9 controls kit-native**, 6 distinct treatments (`.bk-actionbtn`, `-primary`, `.bk-signin`, `.bk-edit-toggle`, `.vr-add`, `.bk-find`) |
| **Profile dawn seam** | `renderProfilePage` `views.js:19394-19423`; CSS `14599-14963` | **Mechanism:** `.pf-hero` (`:14640`) is a fully opaque dark radial with NO light stop; dark→light happens the instant its box ends and `.pf-root`'s light ground (`:14626-14632`) shows through — a hard cut. The `::after` at `:14653` is a **1px horizontal gold hairline ornament**, not a blend. The ~630px figure is EMERGENT (`.pf-sky-host` 478px + dock content), and at `min-width:1200` becomes viewport-relative (`60vh`, `:14890`). A dawn = add a fade tail to `.pf-hero`'s own background and/or replace the 1px line with a 40–80px gradient bridge |
| **✎ re-wire** | `openMarginaliaEditor` `views.js:14462-14522` · `buildMargCard` `:9012-9065` | **VERDICT: SMALL WIRING JOB, build it.** The save machinery is already edit-capable and `createWritingCanvas` already honours `initialValue` (`writing-canvas.js:618`). Gaps: an id param + pre-fill, and a pencil in `buildMargCard`. **~40–70 lines / ~1.5–2.5 KB** in views.js. DWF-1's "never wired" still true at this HEAD |

## SHIP CHECKLIST FOR THE FRESH SESSION

1. Finish the table above.
2. Darken `--m1-on-ground` (3.07 is thin).
3. **Re-record the `lumen-amber.css` byte-lock at its new value** (14,966 B as of this
   commit; re-measure at ship) — CLAUDE.md + wherever the lock is carried.
4. Bump `sw.js` v3.233 → **v3.234**, once, in the final commit.
5. Red-team (Sonnet) · live-smoke-gated push · HALT for the felt pass.

## FROZEN-GATE PROOF (this commit)

| Gate | Evidence |
|---|---|
| `js/arc-constellation.js` | **0 diff lines** |
| `assets/marks.js` | **0 diff lines**, 10,255 B unchanged |
| `assets/lumen-amber.css` | 1 ruled line (14,681 → 14,966 B) — **re-baseline pending at ship** |
| Shelf / Arcs-index COMPOSITION | untouched — only the Shelf's ground recipe + wrapper frame |

Parse: `js/integrations.js` PASS · `js/state.js` PASS.
