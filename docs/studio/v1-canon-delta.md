# V-1 CANON DELTA — "The Sunflower"

**Status:** v1.1, 2026-09-19 (v1 + the break-it pass: seven amendments, marked ▲). Written against `docs/studio/v1-recon.md` (HEAD 6c1c0a2, v3.299), the five Stage-2 captures (home-1360, books-1360, notebook-390, scan-390, yumi-panel-1360), and the signed-off Home mockup (praxis-v1-home-directions.html, Direction B, day + night).
**Scope:** this delta changes the canon only. Old surfaces inherit the tokens and keep their structure. Structure changes wait for R-POLISH lite, with ONE exception: Home, whose new structure is the reference implementation.
**Supersedes:** `praxis-universal-token-sheet.md` §2 primitives and §4 galaxy-night; THE HOUR twilight ground (v3.232); the gilding layer's gradient fills. Everything in CRAFT.md, the desktop canon (D1–D6), the mobile canon, and the Yumi covenant stands.

---

## 0. The one idea

Praxis is a sunflower: an ochre page, one petal-yellow, a seed-head brown sky, and terracotta for the one thing on the screen that is alive. Every color on every surface comes from the flower. Nothing else enters.

---

## 1. Token sheet (the source of truth)

Names below are the CANON names. Existing token names in the app are NOT renamed; they are re-pointed to these values (rule 1). Values are final unless a rule below says otherwise.

### Page (day)
| Canon name | Value | Role |
|---|---|---|
| `--page` | `#F3E3B4` | the ground; `body` paints it directly |
| `--page-2` | `#FAF0CF` | card on the page |
| `--page-3` | `#EBD9A6` | sunk / secondary fills (spine bodies, inactive chips) |
| `--ink` | `#2A1E10` | body text, titles |
| `--ink-2` | `#6F5A34` | supporting text |
| `--ink-3` | `#72603C` | labels, dates, counts (AA at 4.76:1 on page, 4.35:1 on page-3) |
| `--line` | `rgba(42,30,16,.16)` | the only hairline on paper |

### Accent (the petal)
| Canon name | Value | Role |
|---|---|---|
| `--gold` | `#D9931A` | FILL, on paper: the primary button, the active tab, the spine stripe, the FAB |
| `--gold-ink` | `#835508` | TEXT, on paper: kickers, active nav, "Your shelf →" |
| `--gold-star` | `#E8B23A` | on night: the stars, the threads, the primary button, kickers |
| `--on-gold` | `#2A1E10` | text on a gold fill (6.3:1) |

### Night (the seed head)
| Canon name | Value | Role |
|---|---|---|
| `--night-00` | `#1C120A` | the sky when the whole app is in night mood |
| `--night-0` | `#2B1E12` | the sky (day mood); the page (night mood) |
| `--night-1` | `#3B2A19` | reserved step; not used by Home |
| `--night-2` | `#4A2E18` | card on night; Yumi's dock; Yumi's panel |
| `--night-3` | `#5C3B21` | sunk on night; the glyph ring; hover on night cards |
| `--on-night` | `#F5E8C4` | text on night |
| `--on-night-2` | `#CDB894` | supporting text on night |
| `--on-night-3` | `#BAA48C` | labels on night (4.17:1 on night-3, 5.86:1 on night-0) |
| `--line-night` | `rgba(255,255,255,.14)` | the only hairline on night |

### Yumi
| Canon name | Value | Role |
|---|---|---|
| `--yumi` | `#C8552E` | her glyph stroke, her send control, her caret. NOTHING else. |

### Type
| Canon name | Value |
|---|---|
| `--font-display` | `"Fraunces", Georgia, serif` |
| `--font-body` | `"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` — DM Sans FIRST |
| `--font-mono` | `"DM Mono", ui-monospace, Menlo, monospace` |

### Shape
| Canon name | Value | Role |
|---|---|---|
| `--r-card` | `20px` | every card |
| `--r-sky` | `28px` | the Home sky's bottom corners (phone); `24px` as a column (desktop) |
| `--r-pill` | `999px` | every button, chip, tab, dock |
| `--r-spine` | `6px` | book spines |
| `--r-glyph` | `50%` | glyph rings, avatars |

### Mood
`[data-mood="night"]` on `<html>` remaps: `--page → --night-0`, `--page-2 → --night-2`, `--page-3 → --night-3`, `--ink → --on-night`, `--ink-2 → --on-night-2`, `--ink-3 → --on-night-3`, `--line → --line-night`, `--gold → --gold-star`, `--gold-ink → --gold-star`, `--on-gold → --night-0`, sky `--night-0 → --night-00`. That is the whole night. No second palette, no second sheet.

---

## 2. The ten rules

**R1 — Names stay, values move.** The app has 458 tokens, 872 definitions, 6,375 consumers. They are not renamed and consumers are not edited. Every existing color token becomes an alias of a canon token above (`--lum-ink: var(--on-night)`, `--page: #F3E3B4`, `--gold-soft: var(--gold)`, and so on), defined ONCE, in ONE file, at `:root`. The 121 duplicate definitions are collapsed to one each; the mood block is the only permitted second definition. ▲ The `[data-ground]` and `.lum-amber-deep` scope MECHANISM is untouched in V-1 (1,183 + 24 selectors depend on it); only the token VALUES inside those scope blocks are re-pointed, so a dark-scoped surface resolves to the night ramp and a light-scoped one to the page. Removing the scopes is R-POLISH lite. ▲ Mood: the app has no `prefers-color-scheme` rule today. V-1 ships DAY as the default on every route (the biggest felt change: 14 of 15 routes are dark today) and defines the `[data-mood="night"]` block, but ships NO toggle; the toggle is a P3 settings item. Tokens the sheet has no role for are retired, not re-pointed: `--lum-cyan`, `--lum-coral`, `--lum-rose`, `--lum-cloth`, `--teal`, `--thread`, `--grad-soft`, `--hour-*`, every `--glass*`, `--lum-glass-blur`, `--gold-hi`. Their consumers get the nearest canon token in the same commit. The `--field-1..10` spectrum and the `--register-*` / `--subtheory-*` sets are OUT OF SCOPE for V-1 (see §4).

**R2 — Five colors, from the flower.** Page, gold, night-brown, terracotta, and the cream that is ink-on-night. No navy, no teal, no green, no purple, no rose, no coral, anywhere, including the avatar, the spine cloth, the empty-state orb, and the "grass" strip on the Shelf. If a thing needs a second color to be understood, it gets a second SHAPE or a LABEL instead. ▲ CONTENT is exempt: book cover art, user photos, and imported images keep their own colors. Chrome is never exempt.

**R3 — The ground is flat.** `body` paints `--page` directly. `body::before` and the twilight gradient are removed. The only gradient in the app is the lamp: `radial-gradient(120% 60% at 50% -10%, rgba(92,59,33,.55), transparent 60%)` over the Home sky, and nothing else. No glass, no `backdrop-filter`, no blur, no glow, no gilded hairline, no inner-top-light. Depth is tone: page-2 on page, night-2 on night-0. Where the old surface had a gradient fill, the new one has the gradient's darker stop as a flat fill. ▲ One exemption: the Scan viewfinder's controls sit over live camera video and may use a flat translucent fill (`rgba(28,18,9,.62)`, the existing `--scan-glass` role) — translucent, never blurred.

**R4 — Gold is pressed, never painted.** `--gold` fills only things you press (primary button, active tab, FAB) and the spine stripe. It never fills a surface larger than a button. Gold text (`--gold-ink`) is for kickers and the active nav item only. Gradient gold buttons become flat `--gold` with `--on-gold` text. On night, the stars and threads are `--gold-star` and nothing else on the sky is.

**R5 — Three faces, three jobs.** Fraunces for anything with a voice: page titles, arc names, book titles in running text, Yumi's line, quoted passages. DM Sans for everything you read and press. DM Mono only for TRUE meta: dates, counts, kickers, keyboard hints. Cormorant Garamond is retired from `index.html`'s font link and every stack. Floors: body 15px phone / 16px desktop; h1 36px phone / 52px desktop; kickers 11.5px mono at .08em tracking, never smaller. Every `<button>` declares `font: inherit` at the base, so no control can fall to Arial again.

**R6 — Yumi is terracotta, once.** Yumi keeps her existing glyph SHAPE (the mark `yumiGlyph()` returns) and it is re-stroked `--yumi`. Her glyph sits in a `--night-3` ring on a `--night-2` dock or panel. Her panel is a `--night-2` card with a `--line-night` edge: no glass, no blur, no gradient. Her greeting and every line she speaks are Fraunces italic in `--on-night`. Her send control is `--yumi`. Terracotta appears on exactly these and on nothing else in the app; the recon found cyan on 6 elements on Home and 4 on #yumi-sees, and terracotta inherits precisely those seats.

**R7 — Cards are tone, lines are hairlines, shadows are for what floats.** A card is `--page-2` at `--r-card` with no border. Sections inside a card separate with `--line`. Nothing on paper casts a shadow. ▲ Only what OVERLAYS floats, and every floating thing shares one shadow token (`--shadow-float: 0 10px 30px rgba(28,18,9,.18)`): the FAB, Yumi's panel, the ⌘K spotlight, modals and sheets, menus and pickers. In-flow cards never float. The Shelf's spines keep their stripe and lose their purple cloth: spine body `--page-3`, stripe `--gold`, label `--ink-2`.

**R8 — One motion.** One easing, `cubic-bezier(.2,.7,.2,1)`; one duration, 280ms; opacity and transform only. Things arrive; nothing pops, pulses, or glows. ▲ Yumi's presence is the one living thing: her bloom may breathe (one keyframe, ≥4s cycle, opacity/transform only) and her mic may pulse while recording. The constellation's draw-in on select is an arrival and stays. Keyframe budget app-wide: ≤8 named `@keyframes` (today: 55, 13 of them Yumi). `prefers-reduced-motion` disables all of it. Reveal animations start from a visible resting state.

**R9 — Home is sky-first (the one structural rule).** Phone: the sky is a header (`--night-0` + the lamp, `--r-sky` bottom corners) holding the date, the greeting, the constellation and its kicker; the paper rises below with Where you left off → Still reading → Where your thinking stands → Yumi's dock; a bottom tab bar (Home · Shelf · Arcs · Notebook · Scan) replaces the hamburger; ▲ Capture keeps its existing door unchanged (R-CAPTURE's DOOR-SEG ruling stands), About and Account live under the avatar, and the FAB keeps its current role and is only recolored. Desktop ≥1200: a 1200 composition; the sky is a 520px sticky column (`--r-sky` 24px) holding date, greeting, constellation, kicker, and the counts; the paper column is ≤648px; the top rail is `--page` with the wordmark, sections, ⌘K, avatar. The floating pill nav is retired. The "whole field / where you left off" alternator is retired on Home: the field is always in the sky. The seed field's example marks (the four shapes) keep their shapes and take `--gold-star` until the `--field-*` decision in §4.

**R10 — Every pair has a number.** No text sits on a ground without a measured contrast: ≥4.5:1 for anything under 18px, ≥3:1 for labels at ≥11.5px mono and for icons. The build proves it by running the sheet's pairs through a contrast check and printing the table; a felt pass does not substitute. The reference pairs, already measured on the mockup: ink/page 12.74 · ink-2/page-2 5.78 · ink-3/page-2 4.57 · gold-ink/page-2 5.04 · on-gold/gold 6.30 · on-night/night-0 13.28 · on-night-3/night-0 5.86 · gold-star/night-0 8.37 · on-night-2/night-2 6.42 · night-0/gold-star 8.37 · on-night-3/night-3 4.17 (label only).

---

## 3. What the recon found that these rules answer

| Recon fact | Rule |
|---|---|
| 458 tokens / 872 definitions / 121 re-pointed; `--ink` defined 14× | R1 |
| 6 definitions never reach the CSSOM (`components.css:5396` early `*/`) | R1 (collapse rewrites that block; the comment is fixed in passing) |
| 182 literal hexes; 12 of top 15 are the literal values of named tokens | R1, R2 |
| `--font-body` puts DM Sans fifth; 3 of 15 route-states mix two font systems | R5 |
| `.scan-vf-back` resolves to Arial | R5 (`button { font: inherit }`) |
| `--lum-cyan` holds two values; cyan on exactly 10 Yumi elements | R6 |
| `body` transparent on all 15 routes; ground painted by `body::before` | R3 |
| 14 of 15 routes dark, `#scan` alone bright | R1 (grounds decided by tokens, not attribute); `#scan` reads paper tokens and stays paper |
| `#profile` prose 222.6ch, `#about` 140ch, `#subtheory` 88ch | not V-1: R-POLISH lite, D2 |
| Purple spine cloth, teal avatar, gold gradient buttons, glass Yumi panel (captures) | R2, R4, R6, R7 |

---

## 4. Out of scope for V-1 (named, not forgotten)

1. **The `--field-1..10` spectrum** (ten hues for sub-theory marks and the galaxy). R2 forbids them as colors; V-1 does not decide their replacement. Options for the round that owns it: shape-only marks (the 16-mark PraxisMarks system already carries shape × treatment), or a tonal ramp of gold. Until then they render `--gold-star` on night and `--gold` on paper.
2. **Register hues** (`--register-marginalia` teal, `--register-journal` purple, `--register-question` blue). R2 forbids them as colors. Registers are already labeled by word; V-1 leaves them labeled and monochrome. If a hue is later needed, it is a gold tint, decided with the Notebook.
3. **Avatar color.** Currently teal. Becomes `--night-3` ring with `--on-night` initial until the profile round.
4. **The Shelf "grass" strip.** R2 makes it gold-on-page; whether it survives at all is R-SHELF's, not V-1's.
5. **Reading measure on #profile / #about / #subtheory.** Desktop canon D2 violations; R-POLISH lite.
6. **The Yumi glyph SHAPE.** V-1 recolors it; it does not redraw it. Preston has said the current look is "not cute"; the shape question is its own small round after the recolor is felt.

---

## 5. Acceptance for the V-1 build (the P3 lane that applies this)

- ONE `:root` block in ONE file defines every color, type, shape and motion token. The scope blocks (`[data-ground]`, `.lum-amber-deep`, `.galaxy-night`) may still exist but contain only `var(--canon-name)` re-points, never literals.
- Definition count per token = 1 (mood block excepted). Duplicate-definition count = 0.
- `--lum-cyan`, `--teal`, `--hour-*`, `--glass*`, `--gold-hi`, `--grad-soft`, `--lum-cloth`: 0 definitions, 0 consumers.
- `backdrop-filter`: 0 occurrences. `linear-gradient` / `radial-gradient`: exactly 1 occurrence (the lamp). `@keyframes`: ≤8 named.
- `prefers-color-scheme`: 0 occurrences (no mood toggle ships in V-1); the `[data-mood="night"]` block exists and is inert.
- `Cormorant`: 0 occurrences in index.html and the five stylesheets.
- Literal hexes outside the token file: 0 (was 182).
- Computed `font-family` on every `<button>` in the Stage-2 route set begins with "DM Sans".
- The contrast table in R10 reproduced by the build's own check, all pairs at or above floor.
- Home matches the mockup at 390 and 1360, day and night, by Preston's felt pass on the deployed build — the FELT-DELTA clause applies: the before/after at 1360 is stated before the build starts.
- Every other route: renders, no h-scroll, no regressions in the interactive-control sweep, and reads as the same app as Home. Structure unchanged.
