# Wave 7 · Surface A — the Yumi panel → `.lum-amber-deep` (BUILD)

Source: `design/Wave 7 …zip → yumi-amber.html` (look ref; tokens wired from
`lumen-amber.css`, not the mockup hex). Disposition: **reskin in place** (slide-in
panel), confirmed Stage 0. Covenant = VERIFY-only.

## Approach
- `js/yumi-ui.js` `buildYumiPanel()`: panel className `yumi-panel` → `yumi-panel
  lum-amber-deep` (+ 2-line comment). The atmosphere class supplies `--lum-bg`;
  the load-bearing slide-over base (components.css ~L193) + open class are untouched.
- `assets/components.css`: ADDITIVE scoped override block `.yumi-panel.lum-amber-deep …`
  inserted after the existing Umber-port head block (after L10155). 27 selectors,
  each = one planned panel element. Material/colour only → lum-amber-deep (amber
  ground, cyan Yumi presence-dot, gold reader bubble, near-white serif, teal send
  orb, dark field). Overlay stays SOLID (no backdrop-filter — iOS rule). All washes
  via `color-mix(in srgb, var(--lum-*) N%, transparent)` — no raw hex (one rgba(0,0,0,.7)
  drop-shadow mirrors lumen-amber.css's own `.lum-glass` shadow convention).

## Mechanical gates (slice 1)

| Gate | Expected | Actual | Verdict |
|---|---|---|---|
| components.css Δbytes | +2500 ±1200 → [1300, 3700] | **+4889** | **FAIL — over ceiling by 1189** |
| yumi-ui.js Δbytes | +800 ±600 → [200, 1400] | +187 | UNDER by 13 (markup already supported the look; only the class hook needed) |
| components.css braces | balanced | 2538 / 2538 | PASS |
| components.css parens | balanced | 4693 / 4693 | PASS |
| additive (numstat) | additive, no rewrite | 70 ins / 0 del | PASS |
| EOL (git i/w) | i/lf w/crlf (no flip) | i/lf w/crlf | PASS |
| Covenant `assembleContextData` | untouched | yumi-brain.js no diff | PASS |
| Selector scope | == planned surface | 27 selectors, all planned, 0 extra | PASS (no scope creep) |

## Classification of the byte miss
Not scope creep (proven: 70/0 additive; 27 selectors all map to planned elements;
zero added features/selectors). Cause = byte density the +2500 recon estimate
under-counted: (a) ~620 B comment header; (b) `color-mix(...)` token-purity (~12
washes × ~30 B over the raw rgba the estimate implicitly assumed). A faithful,
token-pure reskin of a 27-rule surface lands ~+4,300–4,900, not +2,500–3,700.

## RESOLUTION — Preston chose A (re-baseline)
Yumi-CSS re-baselined to the corrected envelope. Comment header tidied (not padded):
components.css final delta **+4,492** (was +4,889); yumi-ui.js +187. Combined surface
**+4,679** vs combined ceiling +5,100 — under. Braces 2538/2538, parens 4693/4693,
EOL unflipped, covenant untouched. App-source dirty set = components.css + yumi-ui.js
ONLY (yumi-brain/views/sw/index untouched).

## Render-and-look — PASS (desktop 1280×800 + true 390×844 CDP)
Server: `praxisapp-w7` :8761 (KeepAlive disabled in static-server.ps1 so the
screenshot's network-idle wait fires — the app's openlibrary/font fetches otherwise
keep the socket busy; harness-only, gitignored). Network blocked + motion stilled for
a stable frame.

Live-DOM proof (preview_inspect / computed):
- panel: `position:fixed`, 380×540 (desktop) / 343w @390 (slide-over intact),
  background = lum-amber-deep radial (opaque base rgb(24,16,6)), **backdrop-filter:none**
  (overlay-solid, iOS rule) — class `yumi-panel lum-amber-deep yumi-panel-open`.
- Yumi msg: Cormorant **italic**, near-white (rgb 253,248,236), cyan `::before` dot.
- you msg: gold-wash `srgb 1 .906 .604 / .1` (= --lum-gold-l @10%); geometry @390 left-gap
  38px ≫ right-gap 16px → right-aligned (the earlier getComputedStyle marginLeft:0 was a
  quirk; box model proves it).
- sight pill + send orb + dots: `rgb(127,208,240)` = --lum-cyan.
Screenshots captured both widths (serverId 0755c3e8…; inline, no repo path). Console clean.

### Deliberate divergences (logged, not defects — "reskin, engine held")
1. Header presence stays the app's **gold Bloom crest** (canonical Umebloom mark), not the
   mockup's flat cyan orb; Yumi's cyan reads via dots/pill/orb. ← judgment call for Preston.
2. Mockup's italic `.note` ("She'll never tell you what to think…") not added (optional chrome).
3. Yumi replies carry no inline book-`ref` chips / gold `em` — real grounding (buildGroundingChips)
   is held per brief; recolored cyan when it fires.
4. "What Yumi sees" fold = live shared buildTransparencyContent, recolored to lum — not the
   mockup's literal two-column reads/never-reads (that's the shared #yumi-sees surface, out of scope).

## HOLD — awaiting Preston's eyes-on
No commit. CACHE_VERSION still v3.160 (bump to v3.161 at first ship).

---
### (original halt note, superseded by Resolution above)
## HALT — awaiting Preston
Per protocol (byte delta outside band) + the explicit "hold to the estimate, stop
and report." Did NOT render-and-look yet. Options put to Preston:
- **A (recommended):** re-baseline Yumi-CSS to ~+4,900 (justified: token-purity the
  brief required), proceed to render-and-look as-is.
- **B:** trim comment + collapse whitespace → ~+4,150 (still > 3,700; cannot reach the
  original ceiling without dropping real look — header wash / presence-dot gradient /
  sight-fold + chip recolor).

No commit. CACHE_VERSION still v3.160 (untouched; bump to v3.161 at first ship).
