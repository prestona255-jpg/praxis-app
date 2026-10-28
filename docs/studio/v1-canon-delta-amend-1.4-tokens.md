# The Sunflower — canon amendment 1.4: the token sheet L1 builds against

Status: written chat-side (Fable 5.1) on 2026-10-19 from canon v1.1 (2026-09-19), 1.2 (09-29), 1.3 (10-10) and the seventh to thirteenth sittings. Ground: repo ba7b289 (SCAN-FIX.6), carry v16. Where this file and an earlier canon file disagree, this file governs for VALUES; the pictures (v16 spine, Praxis in the Lens Hand v3) win for shape. The four open calls in §10 were ruled at rec on 2026-10-19.

## 0. Verdict

L1 as ruled ("theme.css values re-pointed") reaches 395 of 880 token definitions. 332 definitions sit in components.css inside the room scopes the beta uses (.shelf/.notebook/.home-page/.bk-surface/.arcs .lum-amber-deep, .account, .pf-root, .lit-page …) as LITERALS; 308 literal hexes and 572 rgba() sit beside them; 16 backdrop-filter; 216 gradients. L1 is therefore THE TOKEN LAYER across five sheets, still with no structural change.

## 1. The core (the only literals; day / night)

| token | day | night | role |
|---|---|---|---|
| **Paper** | | | |
| `--page` | `#EDD79E` | `#24180C` | the ground; body paints it directly |
| `--page-2` | `#FBF3D9` | `#4A2E18` | a card on the page |
| `--page-3` | `#E2C98C` | `#63401F` | sunk / secondary fill: spine bodies, inactive chips, sunk rows |
| `--ink` | `#2A1E10` | `#F5E8C4` | body text, titles; the ONLY text colour allowed on --page-3 at body size |
| `--ink-2` | `#6F5A34` | `#CDB894` | supporting text |
| `--ink-3` | `#6B5936` | `#BAA48C` | labels, dates, counts, placeholders, tab labels, field boundaries |
| `--line` | `rgba(42,30,16,.16)` | `rgba(255,255,255,.14)` | the hairline SEPARATOR on paper (never a control's only boundary) |
| `--line-field` | `var(--ink-3)` | `var(--ink-3)` | NEW · the 1px boundary of a field or textarea (3:1 floor, WCAG 1.4.11) |
| **Gold (the petal)** | | | |
| `--gold` | `#D9931A` | `#E8B23A` | FILL for what you press: the primary button, the active segment, the reading dot |
| `--gold-ink` | `#835508` | `#E8B23A` | TEXT: kickers, the active tab, the quiet-card rule, the focus ring |
| `--gold-star` | `#E8B23A` | `#E8B23A` | on any sky: stars, kickers, the primary button, the toast's action |
| `--on-gold` | `#2A1E10` | `#1C120A` | text on a gold fill |
| **Sky (the seed head)** | | | |
| `--sky` | `#2B1E12` | `#1C120A` | the sky: Home's field, Yumi's panel, the walk's skies, the toast |
| `--umber` | `#4A2E18` | `#4A2E18` | a card on the sky; Yumi's dock |
| `--umber-2` | `#63401F` | `#63401F` | sunk on the sky; hover on sky cards; the glyph ring |
| `--on-night` | `#F5E8C4` | `#F5E8C4` | text on the sky |
| `--on-night-2` | `#CDB894` | `#CDB894` | supporting text on the sky |
| `--on-night-3` | `#BAA48C` | `#BAA48C` | labels on the sky (label-only on --umber-2: 3.84) |
| `--line-night` | `rgba(255,255,255,.14)` | `rgba(255,255,255,.14)` | the hairline on the sky |
| **Yumi and the stem** | | | |
| `--yumi` | `#C8552E` | `#C8552E` | her seed, her halo's wash, her send control, her caret. NOTHING else. Always seated on --sky. |
| `--stem` | `#3D6446` | `#8DB08A` | one quiet text link per paper surface (re-measured: 4.76 on page; was #45704F at 4.02) |
| `--stem-sky` | `#8DB08A` | `#8DB08A` | NEW name · the lines between stars on ANY sky, both moods (6.71 day sky · 7.64 night sky) |
| **Light (one gradient per property — token rule 23)** | | | |
| `--lamp` | `radial-gradient(120% 70% at 50% -10%, rgba(92,59,33,.55), rgba(92,59,33,0) 60%)` | `none` | the lamp over the day sky |
| `--lamp-foot` | `radial-gradient(80% 40% at 50% 100%, rgba(232,178,58,.10), rgba(232,178,58,0) 70%)` | `radial-gradient(80% 40% at 50% 100%, rgba(232,178,58,.10), rgba(232,178,58,0) 70%)` | the sky's foot |
| `--pool` | `radial-gradient(82% 46% at 50% 56%, rgba(92,59,33,.58), rgba(92,59,33,0) 72%)` | `radial-gradient(82% 46% at 50% 56%, rgba(92,59,33,.58), rgba(92,59,33,0) 72%)` | the pool of umber light at night (eighth sitting r17) |
| `--sky-a` | `var(--lamp-foot)` | `var(--pool)` | sky layer A (background-image, longhand) |
| `--sky-b` | `var(--lamp)` | `none` | sky layer B |
| `--spill` | `linear-gradient(180deg, rgba(92,59,33,.16), rgba(92,59,33,0) 140px)` | `linear-gradient(180deg, rgba(232,178,58,.10), rgba(232,178,58,0) 140px)` | painted at the top of the paper, under a sky |
| `--star-glow` | `drop-shadow(0 0 5px rgba(232,178,58,.85))` | `drop-shadow(0 0 5px rgba(232,178,58,.85))` | filter on a star group only |
| `--hi` | `rgba(255,255,255,.55)` | `rgba(255,255,255,.07)` | the colour of the hairline of light |
| `--card-hi` | `inset 0 1px 0 rgba(255,255,255,.55), 0 1px 0 rgba(42,30,16,.05)` | `inset 0 1px 0 rgba(255,255,255,.07)` | every card's top edge (box-shadow longhand only) |
| `--grain-op` | `.32` | `.22` | the paper's tooth (opacity of the one noise tile) |
| `--grain-blend` | `multiply` | `screen` | the tile's blend |
| **The Bloom on paper (eleventh sitting r2)** | | | |
| `--bl-core` | `#FFF8E6` | `#FDFAF3` | her core |
| `--bl-gold` | `#B06F12` | `#C79A3A` | the deeper rim by day (3.69 on a card · 2.89 on page — the edge carries the 3:1) |
| `--bl-light` | `#E0A030` | `#DFB759` | her light |
| `--bl-wisdom` | `#F8DF86` | `#F8E078` | halo stop |
| `--bl-theory` | `#E8845E` | `#F0A88A` | halo stop |
| `--bl-emp` | `#F0B48C` | `#F8C8AA` | halo stop |
| `--bl-edge` | `rgba(42,30,16,.56)` | `rgba(255,241,210,0)` | the thin umber edge; .56 measures 3.44 on page (v16 had .38 = 2.18) |
| **Shadow (only what floats)** | | | |
| `--shadow-float` | `0 10px 30px rgba(28,18,9,.18)` | `0 10px 30px rgba(0,0,0,.5)` | sheets, Yumi's panel, menus, pickers, the toast |
| `--shadow-cover` | `inset 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(42,30,16,.18)` | `inset 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(42,30,16,.18)` | covers are content: their contact shadow (1.3 R7) |
| `--scrim` | `rgba(15,9,4,.6)` | `rgba(15,9,4,.7)` | the veil under a sheet |
| **Camera (ground-independent, R3 exemption)** | | | |
| `--scan-cam-bg` | `#0c0a07` | `#0c0a07` | unchanged |
| `--scan-glass` | `rgba(20,14,7,.62)` | `rgba(20,14,7,.62)` | unchanged: flat translucency over live video, never blurred |
| `--scan-glass-2` | `rgba(28,20,10,.82)` | `rgba(28,20,10,.82)` | unchanged |
| `--scan-on-dark` | `#f6efe0` | `#f6efe0` | unchanged |
| `--scan-on-dark-2` | `rgba(246,239,224,.62)` | `rgba(246,239,224,.62)` | unchanged |
| `--scan-cloth-1` | `#e3d8c1` | `#e3d8c1` | unchanged |
| `--scan-cloth-2` | `#d3c4a6` | `#d3c4a6` | unchanged |
| `--scan-cover-ink` | `#3a2c17` | `#3a2c17` | unchanged |
| `--scan-cover-meta` | `#6b5b3c` | `#6b5b3c` | unchanged |

### Type faces

| token | stack | job |
|---|---|---|
| `--font-display` | `"Fraunces", Georgia, serif` | anything with a voice: titles, the reader's words, Yumi's lines (italic), a lens's name (italic) |
| `--font-body` | `"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | everything you read and press · DM Sans FIRST |
| `--font-mono` | `"DM Mono", ui-monospace, Menlo, monospace` | TRUE meta only: kickers, dates, counts, keyboard hints |

## 2. Night (the default) and the day block

NIGHT IS THE DEFAULT (r39, 18 Oct; confirmed 25 Oct; supersedes v1.1 R1's day default). :root holds the night column. `html[data-mood="day"]` re-points exactly these tokens to the day column; `html[data-mood="auto"]` (Match my phone) does the same under `@media (prefers-color-scheme: light)`; the two day blocks are byte-identical, generated from one source. Yumi's panel is always sky (its scope maps paper tokens onto the sky set). `[data-ground="dark"]`, `.app-nav`, `.spotlight-panel` carry no token lines after L1.

| flips | day (the day block) | night (:root) |
|---|---|---|
| `--page` | `#EDD79E` | `#24180C` |
| `--page-2` | `#FBF3D9` | `#4A2E18` |
| `--page-3` | `#E2C98C` | `#63401F` |
| `--ink` | `#2A1E10` | `#F5E8C4` |
| `--ink-2` | `#6F5A34` | `#CDB894` |
| `--ink-3` | `#6B5936` | `#BAA48C` |
| `--line` | `rgba(42,30,16,.16)` | `rgba(255,255,255,.14)` |
| `--gold` | `#D9931A` | `#E8B23A` |
| `--gold-ink` | `#835508` | `#E8B23A` |
| `--on-gold` | `#2A1E10` | `#1C120A` |
| `--sky` | `#2B1E12` | `#1C120A` |
| `--stem` | `#3D6446` | `#8DB08A` |
| `--lamp` | `radial-gradient(120% 70% at 50% -10%, rgba(92,59,33,.55), rgba(92,59,33,0) 60%)` | `none` |
| `--sky-a` | `var(--lamp-foot)` | `var(--pool)` |
| `--sky-b` | `var(--lamp)` | `none` |
| `--spill` | `linear-gradient(180deg, rgba(92,59,33,.16), rgba(92,59,33,0) 140px)` | `linear-gradient(180deg, rgba(232,178,58,.10), rgba(232,178,58,0) 140px)` |
| `--hi` | `rgba(255,255,255,.55)` | `rgba(255,255,255,.07)` |
| `--card-hi` | `inset 0 1px 0 rgba(255,255,255,.55), 0 1px 0 rgba(42,30,16,.05)` | `inset 0 1px 0 rgba(255,255,255,.07)` |
| `--grain-op` | `.32` | `.22` |
| `--grain-blend` | `multiply` | `screen` |
| `--bl-core` | `#FFF8E6` | `#FDFAF3` |
| `--bl-gold` | `#B06F12` | `#C79A3A` |
| `--bl-light` | `#E0A030` | `#DFB759` |
| `--bl-wisdom` | `#F8DF86` | `#F8E078` |
| `--bl-theory` | `#E8845E` | `#F0A88A` |
| `--bl-emp` | `#F0B48C` | `#F8C8AA` |
| `--bl-edge` | `rgba(42,30,16,.56)` | `rgba(255,241,210,0)` |
| `--shadow-float` | `0 10px 30px rgba(28,18,9,.18)` | `0 10px 30px rgba(0,0,0,.5)` |
| `--scrim` | `rgba(15,9,4,.6)` | `rgba(15,9,4,.7)` |

```css
.yumi-panel { --page:var(--sky); --page-2:var(--umber); --page-3:var(--umber-2); --ink:var(--on-night); --ink-2:var(--on-night-2); --ink-3:var(--on-night-3); --line:var(--line-night); --gold:var(--gold-star); --gold-ink:var(--gold-star); --on-gold:var(--sky); }
.yumi-bloom { --gold:var(--bl-gold); --gold-light:var(--bl-light); --text-on-dark:var(--bl-core); --tradition-wisdom-halo:var(--bl-wisdom); --tradition-theory-halo:var(--bl-theory); --tradition-empirical-halo:var(--bl-emp); }
```

## 3. Type scale (phone / desktop ≥1200)

| role | token | px | face · weight · lh · tracking | note |
|---|---|---|---|---|
| Greeting (Home sky) | `--fs-greeting` | 46 / 66 | Fraunces 500 · 1.04 · -.015em | one per app |
| Page title (h1) | `--fs-h1` | 38 / 52 | Fraunces 500 · 1.06 · -.015em | v16 .h; text-wrap: balance |
| Count | `--fs-count` | 34 / 34 | Fraunces 500 · 1.0 · -.01em | the three Home counts |
| Card title | `--fs-title` | 26 / 32 | Fraunces 500 · 1.18 · -.01em | kit --fs-title keeps 26 |
| Sub-head / sheet head | `--fs-sub` | 24 / 26 | Fraunces 500 · 1.18 · -.01em | v16 .sub |
| Wordmark | `--fs-wordmark` | 20 / 20 | Fraunces 600 · 1.0 · -.01em |  |
| Heading | `--fs-heading` | 18 / 18 | DM Sans 600 · 1.3 · 0 | section heads inside paper |
| The reader's words | `--fs-reader` | 17 / 17 | Fraunces 500 · 1.5 · 0 | a note's text, a lens's name (italic) |
| Body | `--fs-body` | 15 / 16 | DM Sans 400 · 1.45 · 0 | the floor for running text |
| Control | `--fs-control` | 15 / 15 | DM Sans 500 · 1.0 · 0 | pill 15 · ghost 14 · min-height 44 |
| Small | `--fs-small` | 14 / 14 | DM Sans 400 · 1.45 · 0 | secondary lines, the quiet card |
| Caption | `--fs-caption` | 13 / 13 | DM Sans 400 · 1.4 · 0 | band captions, hatch links (12.5 rounds up to 13) |
| Tab label | `--fs-tab` | 11 / 11 | DM Sans 500 · 1.2 · .02em | v16 drew 10.5 — below the floor; 11 is the floor for ANY text |
| Kicker | `--fs-kicker` | 11 / 11 | DM Mono 500 · 1.3 · .12em | uppercase; kit --fs-meta 12 re-points here |

Floors: 11px any text, 15px running text. Italic Fraunces = voice only (Yumi's lines, a lens's name, a named arc). `button, input, textarea { font: inherit }`. Cormorant: 0 occurrences. Fonts self-hosted (thirteenth r4): fraunces-latin-opsz-normal 67,304 B · fraunces-latin-opsz-italic 81,520 · dm-sans-latin-400 14,200 · 500 14,304 · 600 14,144 · dm-mono-latin-500 14,988 = 206,460 B; preload the two Fraunces files; font-display swap.

## 4. Shape and motion

| token | value | role |
|---|---|---|
| `--r-card` | `20px` | every card; a row or card pressed whole |
| `--r-sky` | `28px` | the Home sky's bottom corners (phone); 24px as a column |
| `--r-sheet` | `24px` | a sheet's top corners |
| `--r-field` | `16px` | a box or choice holding more than one line |
| `--r-pill` | `999px` | one-line buttons, chips, tabs, the dock, the toast |
| `--r-spine` | `6px` | book spines; the small radius |
| `--r-glyph` | `50%` | glyph rings, avatars, the Bloom |
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | the one easing (replaces .22,1,.36,1 and .34,1.2,.5,1) |
| `--dur` | `280ms` | the one duration on paper (replaces 350 / 300) |
| `--dur-half` | `140ms` | the opacity leg of a gather; replaces 150 |

## 5. Measured pairs (WCAG 2.x; 4.5 text <18px · 3.0 labels ≥11px mono, icons, boundaries, marks)

| mood | pair | fg | bg | ratio | floor | result · rule |
|---|---|---|---|---|---|---|
| day | ink on page | `#2A1E10` | `#EDD79E` | 11.47 | ≥4.5 | PASS |
| night | ink on page | `#F5E8C4` | `#24180C` | 14.22 | ≥4.5 | PASS |
| day | ink-2 on page | `#6F5A34` | `#EDD79E` | 4.65 | ≥4.5 | PASS |
| night | ink-2 on page | `#CDB894` | `#24180C` | 8.98 | ≥4.5 | PASS |
| day | ink-3 on page | `#6B5936` | `#EDD79E` | 4.77 | ≥4.5 | PASS |
| night | ink-3 on page | `#BAA48C` | `#24180C` | 7.25 | ≥4.5 | PASS |
| day | gold-ink on page | `#835508` | `#EDD79E` | 4.53 | ≥4.5 | PASS |
| night | gold-ink on page | `#E8B23A` | `#24180C` | 8.97 | ≥4.5 | PASS |
| day | ink on page-2 | `#2A1E10` | `#FBF3D9` | 14.65 | ≥4.5 | PASS |
| night | ink on page-2 | `#F5E8C4` | `#4A2E18` | 10.16 | ≥4.5 | PASS |
| day | ink-2 on page-2 | `#6F5A34` | `#FBF3D9` | 5.94 | ≥4.5 | PASS |
| night | ink-2 on page-2 | `#CDB894` | `#4A2E18` | 6.42 | ≥4.5 | PASS |
| day | ink-3 on page-2 | `#6B5936` | `#FBF3D9` | 6.09 | ≥4.5 | PASS |
| night | ink-3 on page-2 | `#BAA48C` | `#4A2E18` | 5.18 | ≥4.5 | PASS |
| day | gold-ink on page-2 | `#835508` | `#FBF3D9` | 5.79 | ≥4.5 | PASS |
| night | gold-ink on page-2 | `#E8B23A` | `#4A2E18` | 6.41 | ≥4.5 | PASS |
| day | ink on page-3 | `#2A1E10` | `#E2C98C` | 10.04 | ≥4.5 | PASS |
| night | ink on page-3 | `#F5E8C4` | `#63401F` | 7.54 | ≥4.5 | PASS |
| day | ink-2 on page-3 | `#6F5A34` | `#E2C98C` | 4.07 | ≥3.0 | PASS — label-only on page-3 (≥11px mono, 3:1): body text on page-3 is --ink |
| night | ink-2 on page-3 | `#CDB894` | `#63401F` | 4.76 | ≥3.0 | PASS — label-only on page-3 |
| day | ink-3 on page-3 | `#6B5936` | `#E2C98C` | 4.17 | ≥3.0 | PASS — label-only on page-3 (≥11px mono, 3:1): body text on page-3 is --ink |
| night | ink-3 on page-3 | `#BAA48C` | `#63401F` | 3.84 | ≥3.0 | PASS — label-only on page-3 |
| day | gold-ink on page-3 | `#835508` | `#E2C98C` | 3.97 | ≥3.0 | PASS — label-only on page-3 (≥11px mono, 3:1): body text on page-3 is --ink |
| night | gold-ink on page-3 | `#E8B23A` | `#63401F` | 4.76 | ≥3.0 | PASS — label-only on page-3 |
| day | stem link on page | `#3D6446` | `#EDD79E` | 4.76 | ≥4.5 | PASS |
| day | stem link on page-2 | `#3D6446` | `#FBF3D9` | 6.09 | ≥4.5 | PASS |
| night | stem link on page | `#8DB08A` | `#24180C` | 7.19 | ≥4.5 | PASS |
| night | stem link on page-2 | `#8DB08A` | `#4A2E18` | 5.14 | ≥4.5 | PASS |
| day | on-gold on gold | `#2A1E10` | `#D9931A` | 6.30 | ≥4.5 | PASS |
| night | on-gold on gold-star | `#1C120A` | `#E8B23A` | 9.52 | ≥4.5 | PASS |
| day | on-night on sky | `#F5E8C4` | `#2B1E12` | 13.28 | ≥4.5 | PASS |
| night | on-night on sky | `#F5E8C4` | `#1C120A` | 15.10 | ≥4.5 | PASS |
| both | on-night on umber | `#F5E8C4` | `#4A2E18` | 10.16 | ≥4.5 | PASS |
| day | on-night-2 on sky | `#CDB894` | `#2B1E12` | 8.39 | ≥4.5 | PASS |
| night | on-night-2 on sky | `#CDB894` | `#1C120A` | 9.54 | ≥4.5 | PASS |
| both | on-night-2 on umber | `#CDB894` | `#4A2E18` | 6.42 | ≥4.5 | PASS |
| day | on-night-3 on sky | `#BAA48C` | `#2B1E12` | 6.77 | ≥4.5 | PASS |
| night | on-night-3 on sky | `#BAA48C` | `#1C120A` | 7.70 | ≥4.5 | PASS |
| both | on-night-3 on umber | `#BAA48C` | `#4A2E18` | 5.18 | ≥4.5 | PASS |
| day | gold-star on sky | `#E8B23A` | `#2B1E12` | 8.37 | ≥4.5 | PASS |
| night | gold-star on sky | `#E8B23A` | `#1C120A` | 9.52 | ≥4.5 | PASS |
| both | gold-star on umber | `#E8B23A` | `#4A2E18` | 6.41 | ≥4.5 | PASS |
| both | on-night on umber-2 | `#F5E8C4` | `#63401F` | 7.54 | ≥4.5 | PASS |
| both | on-night-2 on umber-2 | `#CDB894` | `#63401F` | 4.76 | ≥4.5 | PASS |
| both | on-night-3 on umber-2 | `#BAA48C` | `#63401F` | 3.84 | ≥3.0 | PASS — label-only on umber-2 (v1.1 R10 said so; 1.2 lightened umber-2) |
| day | placeholder ink-3 in a field on page-2 | `#6B5936` | `#FBF3D9` | 6.09 | ≥4.5 | PASS |
| day | gold fill on page | `#D9931A` | `#EDD79E` | 1.82 | ≥3 | UNDER — a gold pill is identified by its on-gold words (6.30) and its shape; 1.4.11 does not require its boundary to contrast |
| day | gold fill on page-2 | `#D9931A` | `#FBF3D9` | 2.33 | ≥3 | UNDER — same |
| night | gold-star fill on page | `#E8B23A` | `#24180C` | 8.97 | ≥3 | PASS |
| day | yumi seed on sky | `#C8552E` | `#2B1E12` | 3.70 | ≥3 | PASS |
| night | yumi seed on sky | `#C8552E` | `#1C120A` | 4.20 | ≥3 | PASS |
| both | yumi seed on umber | `#C8552E` | `#4A2E18` | 2.83 | ≥3 | UNDER — so her seed is ALWAYS seated on --sky (1.2 R6: her seat is the sky colour), never directly on an umber card |
| day | stem-sky lines on sky | `#8DB08A` | `#2B1E12` | 6.71 | ≥3 | PASS |
| night | stem-sky lines on sky | `#8DB08A` | `#1C120A` | 7.64 | ≥3 | PASS |
| day | line separator on page | `#CEB987` | `#EDD79E` | 1.36 | ≥3 | UNDER — a separator, exempt; it is never a control's only boundary |
| day | line-field (ink-3) on page | `#6B5936` | `#EDD79E` | 4.77 | ≥3 | PASS |
| day | line-field (ink-3) on page-2 | `#6B5936` | `#FBF3D9` | 6.09 | ≥3 | PASS |
| night | line-field (on-night-3) on page | `#BAA48C` | `#24180C` | 7.25 | ≥3 | PASS |
| night | line-field (on-night-3) on page-2 | `#BAA48C` | `#4A2E18` | 5.18 | ≥3 | PASS |
| day | focus ring gold-ink on page | `#835508` | `#EDD79E` | 4.53 | ≥3 | PASS |
| night | focus ring gold-star on page | `#E8B23A` | `#24180C` | 8.97 | ≥3 | PASS |
| day | tab icon ink-3 on page | `#6B5936` | `#EDD79E` | 4.77 | ≥3 | PASS |
| day | active tab gold-ink on page | `#835508` | `#EDD79E` | 4.53 | ≥3 | PASS |
| day | Bloom edge .56 on page | `#806F4E` | `#EDD79E` | 3.44 | ≥3 | PASS |
| day | Bloom rim bl-gold on page-2 | `#B06F12` | `#FBF3D9` | 3.69 | ≥3 | PASS |
| day | Bloom rim bl-gold on page | `#B06F12` | `#EDD79E` | 2.89 | ≥3 | UNDER — under 3 alone; the edge ring (3.44) is the control's boundary |
| night | Bloom rim bl-gold on page | `#C79A3A` | `#24180C` | 6.70 | ≥3 | PASS |
| day | reading dot gold on page-2 | `#D9931A` | `#FBF3D9` | 2.33 | ≥3 | UNDER — the dot is one of three SHAPES (filled gold / filled ink-3 / hollow); colour is not the only signal |
| day | read dot ink-3 on page-2 | `#6B5936` | `#FBF3D9` | 6.09 | ≥3 | PASS |

Resolving rules: (1) body text on --page-3 is --ink only; ink-2 / ink-3 / gold-ink sit on page-3 as labels (3:1). (2) --stem re-measured #3D6446; on any sky the stem is --stem-sky #8DB08A. (3) NEW --line-field = ink-3 / on-night-3 for field boundaries; --line stays a separator. (4) Yumi's seed is always seated on --sky. (5) the Bloom's edge .38 → .56. (6) a gold pill is identified by its words and shape (1.4.11). (7) on-night-3 is label-only on umber-2.

## 6. The re-point map (all 460 live names)

Names stay; values move. One definition at :root; scope-block duplicates become the same var() or are deleted. Retired hues are KEPT as aliases (ruled D).

| live name | becomes | defined in |
|---|---|---|
| `--bk-cyan-text` | `var(--ink-2)` | components |
| `--bk-field-1` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-10` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-2` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-3` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-4` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-5` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-6` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-7` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-8` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-field-9` | `var(--gold)` day · `var(--gold-star)` night | components |
| `--bk-gold-deep` | `var(--gold-ink)` | components |
| `--bk-gold-hi` | `var(--gold)` | components |
| `--bk-line` | `var(--line)` | components |
| `--bk-star` | `var(--gold-star)` | components |
| `--bk-surface-2` | `var(--page-3)` | components |
| `--card-1` | `var(--page-2)` | theme |
| `--card-2` | `var(--page-3)` | theme |
| `--card-ink` | `var(--ink)` | theme |
| `--card-ink-2` | `var(--ink-2)` | theme |
| `--card-ink-warm` | `var(--ink-2)` | theme |
| `--card-meta` | `var(--ink-3)` | theme |
| `--card-radius` | `var(--r-card)` | theme |
| `--card-shadow` | `var(--card-hi)` | theme |
| `--card-shadow-h` | `var(--card-hi)` | theme |
| `--cloth-olive-1` | `var(--page-3)` | theme |
| `--cloth-olive-2` | `var(--page-3)` | theme |
| `--cloth-ox-1` | `var(--page-3)` | theme |
| `--cloth-ox-2` | `var(--page-3)` | theme |
| `--cloth-page-1` | `var(--page-2)` | theme |
| `--cloth-page-2` | `var(--page-3)` | theme |
| `--cloth-teal-1` | `var(--page-3)` | theme |
| `--cloth-teal-2` | `var(--page-3)` | theme |
| `--dur-fast` | `var(--dur-half)` | praxis-kit |
| `--dur-gentle` | `var(--dur)` | praxis-kit |
| `--ease` | canon literal (§1) | theme |
| `--ease-emphasis` | `var(--ease)` | praxis-kit |
| `--ease-standard` | `var(--ease)` | praxis-kit |
| `--ff-body` | `var(--font-body)` | praxis-kit |
| `--ff-display` | `var(--font-display)` | praxis-kit |
| `--ff-heading` | `var(--font-body)` | praxis-kit |
| `--ff-meta` | `var(--font-mono)` | praxis-kit |
| `--ff-reader` | `var(--font-display)` | praxis-kit |
| `--ff-title` | `var(--font-display)` | praxis-kit |
| `--field-1` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-1-deep` | `var(--gold-ink)` | theme |
| `--field-10` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-10-deep` | `var(--gold-ink)` | theme |
| `--field-2` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-2-deep` | `var(--gold-ink)` | theme |
| `--field-3` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-3-deep` | `var(--gold-ink)` | theme |
| `--field-4` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-4-deep` | `var(--gold-ink)` | theme |
| `--field-5` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-5-deep` | `var(--gold-ink)` | theme |
| `--field-6` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-6-deep` | `var(--gold-ink)` | theme |
| `--field-7` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-7-deep` | `var(--gold-ink)` | theme |
| `--field-8` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-8-deep` | `var(--gold-ink)` | theme |
| `--field-9` | `var(--gold)` day · `var(--gold-star)` night | components, universal-depth |
| `--field-9-deep` | `var(--gold-ink)` | theme |
| `--fs-body` | `var(--fs-body)` | praxis-kit, theme |
| `--fs-display` | `var(--fs-h1)` | praxis-kit, theme |
| `--fs-heading` | `var(--fs-heading)` | praxis-kit |
| `--fs-meta` | `var(--fs-kicker)` | praxis-kit |
| `--fs-reader` | `var(--fs-reader)` | praxis-kit |
| `--fs-sm` | `var(--fs-caption)` | theme |
| `--fs-title` | `var(--fs-title)` | praxis-kit |
| `--glass` | `var(--page-2)` | theme |
| `--glass-2` | `var(--page-2)` | theme |
| `--glass-bar` | `var(--page)` | theme |
| `--glass-border` | `var(--line)` | theme |
| `--glass-pill` | `var(--page-2)` | theme |
| `--glass-spotlight` | `var(--umber)` | theme |
| `--gold` | canon literal (§1) | components, theme |
| `--gold-deep` | `var(--gold-ink)` | components, theme |
| `--gold-ember` | `var(--gold-star)` | theme |
| `--gold-hi` | `var(--gold)` | components, theme, universal-depth |
| `--gold-ink` | canon literal (§1) | theme |
| `--gold-ink-door` | `var(--gold-ink)` | theme |
| `--gold-ink-on-gold` | `var(--on-gold)` | theme |
| `--gold-light` | `var(--gold-ink)` | components, theme |
| `--gold-on-card` | `var(--gold-ink)` | theme |
| `--gold-soft` | `var(--gold-star)` | theme |
| `--gold-text` | `var(--gold-ink)` | components, theme |
| `--gold-world` | `var(--gold-star)` | theme |
| `--ground` | `var(--sky)` | theme |
| `--ground-base` | `var(--page)` | theme |
| `--ground-center` | `var(--page)` | theme |
| `--ground-edge` | `var(--page)` | theme |
| `--ground-grad` | `none` | theme |
| `--hour-1` | `var(--sky)` | theme |
| `--hour-2` | `var(--sky)` | theme |
| `--hour-3` | `var(--sky)` | theme |
| `--hour-4` | `var(--sky)` | theme |
| `--hour-arc` | `linear-gradient(var(--sky), var(--sky))` | theme |
| `--hour-horizon` | `var(--lamp-foot)` | theme |
| `--hour-lamp` | `var(--lamp)` | theme |
| `--ink` | canon literal (§1) | components, theme |
| `--ink-2` | canon literal (§1) | components, theme |
| `--ink-3` | canon literal (§1) | components, theme |
| `--ink-4` | `var(--ink-3)` | components, theme |
| `--lh-body` | `var(--lh-body)` | praxis-kit |
| `--lh-display` | `var(--lh-h1)` | praxis-kit |
| `--lh-heading` | `var(--lh-heading)` | praxis-kit |
| `--lh-meta` | `var(--lh-kicker)` | praxis-kit |
| `--lh-reader` | `var(--lh-reader)` | praxis-kit |
| `--lh-title` | `var(--lh-title)` | praxis-kit |
| `--line` | canon literal (§1) | components |
| `--line-2` | `var(--line)` | components, theme |
| `--line-page` | `var(--line)` | theme |
| `--line-page-2` | `var(--line)` | theme |
| `--lum-base` | `var(--page-2)` | components, lumen-amber |
| `--lum-bg` | `var(--page)` | lumen-amber |
| `--lum-cloth` | `var(--page-3)` | components, lumen-amber |
| `--lum-coral` | `var(--gold)` | lumen-amber |
| `--lum-cyan` | `var(--yumi)` | components, lumen-amber |
| `--lum-glass` | `var(--page-2)` | components, lumen-amber |
| `--lum-glass-bd` | `var(--line)` | components, lumen-amber |
| `--lum-glass-bd-2` | `var(--line)` | components, lumen-amber |
| `--lum-glass-blur` | `0px` | lumen-amber |
| `--lum-glass-raised` | `var(--page-2)` | components, lumen-amber |
| `--lum-gold` | `var(--gold)` | components, lumen-amber, universal-depth |
| `--lum-gold-d` | `var(--gold)` | components, lumen-amber |
| `--lum-gold-ink` | `var(--on-gold)` | components, lumen-amber |
| `--lum-gold-l` | `var(--gold)` | components, lumen-amber |
| `--lum-ink` | `var(--ink)` | components, lumen-amber |
| `--lum-ink-2` | `var(--ink-2)` | components, lumen-amber |
| `--lum-ink-3` | `var(--ink-3)` | components, lumen-amber |
| `--lum-ink-4` | `var(--ink-3)` | components, lumen-amber |
| `--lum-mono` | `var(--font-mono)` | lumen-amber |
| `--lum-r-card` | `var(--r-card)` | lumen-amber |
| `--lum-r-pill` | `var(--r-pill)` | lumen-amber |
| `--lum-rose` | `var(--ink-2)` | components, lumen-amber |
| `--lum-sans` | `var(--font-body)` | lumen-amber |
| `--lum-serif` | `var(--font-display)` | lumen-amber |
| `--lum-star` | `var(--gold-star)` | components |
| `--on-ground` | `var(--on-night)` | theme |
| `--on-ground-2` | `var(--on-night-2)` | theme |
| `--on-ground-3` | `var(--on-night-3)` | theme |
| `--arc-question-glow` | `var(--gold-star)` | theme |
| `--bg` | `var(--page)` | theme |
| `--bg-2` | `var(--page-2)` | theme |
| `--board-face` | `var(--page-3)` | theme |
| `--board-under` | `var(--ink-3)` | theme |
| `--border` | `var(--line)` | components, theme |
| `--border-2` | `var(--line-night)` | theme |
| `--br-deep` | `var(--sky)` | components, theme |
| `--color-surface` | `var(--page)` | theme |
| `--danger` | `var(--gold-ink)` | components, theme |
| `--danger-line` | `var(--line)` | theme |
| `--dark-2` | `var(--umber)` | theme |
| `--dots` | `radial-gradient(circle, color-mix(in srgb, var(--ink-3) 26%, transparent) 1.3px, transparent 1.5px)` | theme |
| `--ember-ink` | `var(--ink-3)` | theme |
| `--font-body` | canon literal (§1) | theme |
| `--font-mono` | canon literal (§1) | theme |
| `--font-script` | `"Fraunces", "Hiragino Mincho ProN", "Yu Mincho", "Noto Serif CJK JP", "Noto Sans CJK JP", "Songti SC", "MS PMincho", serif` | components |
| `--font-serif` | `var(--font-display)` | theme |
| `--grad` | `linear-gradient(var(--gold), var(--gold))` | components, theme |
| `--grad-soft` | `linear-gradient(var(--gold), var(--gold))` | theme |
| `--hairline` | `var(--line-night)` | theme |
| `--harvest-1` | `var(--page-2)` | theme |
| `--harvest-2` | `var(--page-3)` | theme |
| `--highlight-edge` | `var(--hi)` | theme |
| `--journal-color` | `var(--ink-2)` | components, theme |
| `--margin-rule` | `color-mix(in srgb, var(--ink-3) 40%, transparent)` | theme |
| `--marginalia-color` | `var(--ink-2)` | components, theme |
| `--mark-glow` | `var(--gold-star)` | theme |
| `--meta` | `var(--ink-3)` | theme |
| `--motion-base` | `var(--dur)` | theme |
| `--muted` | `var(--on-night-2)` | components, theme |
| `--nav-blur` | `0px` | theme |
| `--nav-frost` | `var(--page)` | theme |
| `--nav-solid` | `var(--page)` | theme |
| `--on-teal` | `var(--on-night)` | theme |
| `--orb-deep` | `var(--gold-ink)` | universal-depth |
| `--orb-glow` | `var(--gold-star)` | universal-depth |
| `--orb-hi` | `var(--gold-star)` | universal-depth |
| `--panel-yumi` | `var(--page-2)` | theme |
| `--paper` | `var(--page)` | components |
| `--question-color` | `var(--ink-2)` | components, theme |
| `--river` | `var(--ink-2)` | theme |
| `--river-l` | `var(--ink-2)` | theme |
| `--scrim` | canon literal (§1) | components, theme |
| `--shelf-cavity` | `var(--page-3)` | theme |
| `--star-gold` | `var(--gold-star)` | components |
| `--teal` | `var(--yumi)` | theme |
| `--teal-on-ground` | `var(--yumi)` | theme |
| `--text-d` | `var(--on-night)` | components, theme |
| `--text-on-dark` | `var(--on-night)` | components, theme |
| `--window-bg` | `var(--sky)` | theme |
| `--window-line` | `color-mix(in srgb, var(--gold-star) 16%, transparent)` | theme |
| `--wordmark` | `var(--ink)` | theme |
| `--page` | canon literal (§1) | theme |
| `--page-2` | canon literal (§1) | theme |
| `--radius` | `var(--r-card)` | components |
| `--radius-lg` | `var(--r-field)` | theme |
| `--radius-md` | `var(--r-card)` | theme |
| `--radius-pill` | `var(--r-pill)` | theme |
| `--radius-sm` | `var(--r-spine)` | theme |
| `--radius-xl` | `var(--r-sheet)` | theme |
| `--register-journal` | `var(--ink-2)` | theme |
| `--register-marginalia` | `var(--ink-2)` | theme |
| `--register-question` | `var(--ink-2)` | theme |
| `--shadow-1` | `var(--card-hi)` | components, theme |
| `--shadow-2` | `var(--card-hi)` | theme |
| `--shadow-cover` | canon literal (§1) | theme |
| `--shadow-d` | `var(--shadow-float)` | components, theme |
| `--shadow-page` | `var(--card-hi)` | theme |
| `--shadow-spotlight` | `var(--shadow-float)` | theme |
| `--shadow-yumi` | `var(--shadow-float)` | theme |
| `--spine-cloth` | `var(--page-3)` | theme |
| `--status-read` | `var(--ink-3)` | components |
| `--status-reading` | `var(--gold)` | components |
| `--status-will` | `transparent` | components |
| `--sunk` | `var(--page-3)` | components, theme |
| `--sunk-d` | `var(--sky)` | components, theme |
| `--surface` | `var(--page-2)` | components, theme |
| `--surface-2` | `var(--page-3)` | components, theme |
| `--surface-d` | `var(--umber)` | components, theme |
| `--surface-d2` | `var(--umber-2)` | theme |
| `--thread` | `var(--stem-sky)` | components, theme, universal-depth |
| `--thread-color` | `var(--stem-sky)` | theme |
| `--thread-color-faint` | `color-mix(in srgb, var(--stem-sky) 65%, transparent)` | theme |
| `--tradition-ground` | `var(--page-2)` | theme |
| `--tradition-inner-light` | `var(--page-2)` | theme |
| `--u-chip` | `var(--page-3)` | components |
| `--u-cloth-2` | `var(--page-3)` | components |
| `--u-gathered` | `var(--page-3)` | components |
| `--u-ground-2` | `var(--page-3)` | components |
| `--u-orb-hi` | `var(--gold-star)` | components |
| `--u-panel-1` | `var(--page-2)` | components |
| `--u-panel-2` | `var(--page-3)` | components |
| `--u-seg-2` | `var(--page-3)` | components |
| `--u-sheet-1` | `var(--page-2)` | components |
| `--u-sheet-2` | `var(--page-3)` | components |
| `--u-shot-1` | `var(--page-3)` | components |
| `--u-shot-2` | `var(--ink-3)` | components |
| `--u-spread-2` | `var(--page-3)` | components |
| `--u-teal-deep` | `var(--yumi)` | components |
| `--u-teal-mid` | `var(--yumi)` | components |
| `--u-toggle-off` | `var(--page-3)` | components |
| `--u-white` | `var(--page-2)` | components |
| `--vr-card` | `var(--page-2)` | components |
| `--vr-field` | `var(--page)` | components |
| `--vr-gold` | `var(--gold)` | components |
| `--vr-gold-d` | `var(--gold)` | components |
| `--vr-gold-hi` | `var(--gold)` | components |
| `--vr-gold-ink` | `var(--on-gold)` | components |
| `--vr-ink` | `var(--ink)` | components |
| `--vr-ink-2` | `var(--ink-2)` | components |
| `--vr-ink-3` | `var(--ink-3)` | components |
| `--vr-line` | `var(--line)` | components |
| `--vr-orb-hi` | `var(--page-2)` | components |
| `--vr-rose` | `var(--ink-2)` | components |
| `--wash` | `color-mix(in srgb, var(--ink) 5%, transparent)` | theme |
| `--wash-page` | `color-mix(in srgb, var(--ink) 5%, transparent)` | theme |
| `--wheat-ear-1` | `var(--gold-star)` | theme |
| `--wheat-ear-2` | `var(--gold)` | theme |
| `--wheat-ear-far-1` | `var(--gold-star)` | theme |
| `--wheat-ear-far-2` | `var(--gold-ink)` | theme |
| `--wheat-far-1` | `var(--page-3)` | theme |
| `--wheat-far-2` | `var(--ink-3)` | theme |
| `--wheat-glow` | `color-mix(in srgb, var(--gold-star) 28%, transparent)` | theme |
| `--wheat-near-1` | `var(--gold)` | theme |
| `--wheat-near-2` | `var(--gold-ink)` | theme |
| `--wheat-sky-1` | `var(--page-2)` | theme |
| `--wheat-sky-2` | `var(--page)` | theme |
| `--wheat-sky-3` | `var(--page-3)` | theme |
| `--wheat-soil-1` | `transparent` | theme |
| `--wheat-soil-2` | `color-mix(in srgb, var(--ink) 22%, transparent)` | theme |
| `--field-presence` | unchanged (not a look token) | theme |
| `--m1` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--m1-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--m1-edge-on-ground` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m1-on-ground` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m2` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m2-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m3` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m3-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m4` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m4-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m5` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--m5-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--arc-web-node-cover-height` | unchanged (not a look token) | theme |
| `--arc-web-node-gap` | unchanged (not a look token) | theme |
| `--arc-web-spine-width` | unchanged (not a look token) | theme |
| `--cap-h` | unchanged (not a look token) | components |
| `--cap-h-lens` | unchanged (not a look token) | components |
| `--cap-h-now` | unchanged (not a look token) | components |
| `--col-gap` | unchanged (not a look token) | components |
| `--cover-h` | unchanged (not a look token) | components |
| `--cover-h-now` | unchanged (not a look token) | components |
| `--cover-w` | unchanged (not a look token) | components |
| `--cover-w-now` | unchanged (not a look token) | components |
| `--far` | unchanged (not a look token) | components |
| `--floating-stack-h` | unchanged (not a look token) | components |
| `--glyph-hue` | unchanged (not a look token) | universal-depth |
| `--grid-cols` | unchanged (not a look token) | praxis-kit |
| `--gutter` | unchanged (not a look token) | praxis-kit |
| `--h` | unchanged (not a look token) | lumen-amber |
| `--hd` | unchanged (not a look token) | lumen-amber |
| `--hg` | unchanged (not a look token) | lumen-amber |
| `--hl` | unchanged (not a look token) | lumen-amber |
| `--measure` | unchanged (not a look token) | praxis-kit |
| `--near` | unchanged (not a look token) | components |
| `--orb-hue` | unchanged (not a look token) | universal-depth |
| `--orb-r` | unchanged (not a look token) | universal-depth |
| `--orb-s` | unchanged (not a look token) | universal-depth |
| `--row-gap` | unchanged (not a look token) | components |
| `--sheet-gap` | unchanged (not a look token) | theme |
| `--pf-hue-1` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-10` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-10d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-1d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-2` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-2d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-3` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-3d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-4` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-4d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-5` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-5d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-6` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-6d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-7` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-7d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-8` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-8d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-9` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pf-hue-9d` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-iris` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-iris-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-lapis` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-lapis-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-madder` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-madder-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-moss` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-moss-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-ochre` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-ochre-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-olive` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-olive-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-plum` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-plum-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-teal` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-teal-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-terracotta` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-terracotta-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-verdigris` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--pig-verdigris-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-empirical` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-empirical-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-empirical-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-empirical-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-history` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-history-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-history-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-history-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-memoir` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-memoir-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-memoir-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-memoir-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-novel` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-novel-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-novel-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-novel-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-place` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-place-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-place-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-place-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-poetry` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-poetry-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-poetry-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-poetry-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-practice` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-practice-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-practice-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-practice-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-theory` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-theory-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-theory-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-theory-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-wisdom` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-wisdom-deep` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-wisdom-light` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--register-wisdom-mid` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--scan-cam-bg` | unchanged (not a look token) | theme |
| `--scan-cloth-1` | unchanged (not a look token) | theme |
| `--scan-cloth-2` | unchanged (not a look token) | theme |
| `--scan-cover-ink` | unchanged (not a look token) | theme |
| `--scan-cover-meta` | unchanged (not a look token) | theme |
| `--scan-glass` | unchanged (not a look token) | theme |
| `--scan-glass-2` | unchanged (not a look token) | theme |
| `--scan-on-dark` | unchanged (not a look token) | theme |
| `--scan-on-dark-2` | unchanged (not a look token) | theme |
| `--sp-1` | unchanged (not a look token) | theme |
| `--sp-2` | unchanged (not a look token) | theme |
| `--sp-3` | unchanged (not a look token) | theme |
| `--sp-4` | unchanged (not a look token) | theme |
| `--sp-5` | unchanged (not a look token) | theme |
| `--sp-6` | unchanged (not a look token) | theme |
| `--space-2xl` | unchanged (not a look token) | praxis-kit |
| `--space-2xs` | unchanged (not a look token) | praxis-kit |
| `--space-3xl` | unchanged (not a look token) | praxis-kit |
| `--space-3xs` | unchanged (not a look token) | praxis-kit |
| `--space-lg` | unchanged (not a look token) | praxis-kit |
| `--space-md` | unchanged (not a look token) | praxis-kit |
| `--space-sm` | unchanged (not a look token) | praxis-kit |
| `--space-xl` | unchanged (not a look token) | praxis-kit |
| `--space-xs` | unchanged (not a look token) | praxis-kit |
| `--spine-w` | unchanged (not a look token) | components |
| `--subtheory-1` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--subtheory-1-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--subtheory-10` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-10-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-11` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--subtheory-11-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--subtheory-12` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-12-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-13` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-13-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-14` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-14-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-15` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-15-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-16` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--subtheory-16-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--subtheory-2` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-2-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-3` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-3-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-4` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-4-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-5` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-5-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-6` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--subtheory-6-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | components, theme |
| `--subtheory-7` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-7-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-8` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-8-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-9` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--subtheory-9-edge` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--thread-pad` | unchanged (not a look token) | components |
| `--thread-r` | unchanged (not a look token) | components |
| `--thread-w` | unchanged (not a look token) | components |
| `--thread-x` | unchanged (not a look token) | components |
| `--tradition-empirical-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--tradition-history-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--tradition-memoir-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--tradition-novel-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--tradition-place-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--tradition-poetry-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--tradition-practice-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--tradition-theory-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |
| `--tradition-wisdom-halo` | untouched at L1 — theory layer / galaxy wheel, behind the switch (twelfth r9); re-pointed when arcs return | theme |

## 7. Scopes

- `[data-ground="dark"]` (theme.css; set by views.js:495 on 16 routes): no token lines after L1; selector kept.
- `.app-nav`, `.spotlight-panel`: follow the mood.
- `.yumi-panel`: always sky (§2). `.yumi-bloom`: the --bl-* set (§2).
- Room scopes in components.css (332 definitions): every line → var(--core) or deleted; 0 literals. Local `--field-N` copies → var(--gold).
- components.css:5396 early `*/` closed; its six definitions re-point like the rest.
- Theory layer (`--m*`, `--pig-*`, `--subtheory-*`, `--pf-hue-*`, `--tradition-*-halo`, `[data-st-palette]`): untouched behind the theory switch (twelfth r9).

## 8. PWA and shell

- theme-color `#24180C` (night, the default; the L5 toggle rewrites it to `#EDD79E` while Day is in force); manifest background_color + theme_color `#24180C`.
- apple-mobile-web-app-capable yes · -title Praxis · -status-bar-style black-translucent (tab bar takes env(safe-area-inset-bottom)) · apple-touch-icon 180 PNG (rasterised icon.svg on --page until the icon is designed) · format-detection telephone=no · color-scheme light dark.
- Splash: web — `html{background:var(--page)}`, no startup PNGs; shell (L7b) — LaunchScreen storyboard, one flat #24180C in both appearances, wordmark "Praxis" Fraunces 600 20pt in on-night (r39: the launch screen is night).
- Fonts: Google Fonts link removed; six woff2 self-hosted and precached.

## 9. Rails for the L1 prompt

1. Names stay, values move; no consumer edited, no selector removed.
2. One file of literals: after L1, `#hex` / `rgba(` outside theme.css :root + night block = the camera tokens only. Today: components 308+572, lumen-amber 49+53, kit 64+18, universal-depth 31+21.
3. Token rule 23 (comma-bearing custom property never inside a shorthand; one gradient per property; longhands). `font: … var(--font-body)` and `box-shadow: var(--card-hi)` stand.
4. :root holds night. Day declared twice ([data-mood=day] + [data-mood=auto] under prefers-color-scheme: light), byte-identical, generated from one source, diffed by the build.
5. §5 pairs re-measured against the rendered CSSOM at 390; the table printed; any row under floor fails the stage.
6. Cormorant 0; every button's computed font-family begins "DM Sans".
7. Expected deltas stated before the edit: definitions per token = 1 (mood excepted), duplicates 0 (today 121), literal hexes per sheet 0, Cormorant 0, backdrop-filter 16 → 0 in stage 2 (ruled A).
8. Stage 0 stops for go-ahead with: protocol docs found; token census; the alias plan for retired hues; §5 re-measured live.

## 10. Ruled 2026-10-19 (fourteenth sitting, all at rec)

- A scope — RULED: token layer (stage 1) + flat pass (stage 2: backdrop-filter 16→0, gradient fills → darker stop flat, gold gradient buttons → flat --gold, button{font:inherit}), each with its own felt pass.
- B night default — RE-RULED 25 Oct: NIGHT IS THE DEFAULT (restores r39 of 18 Oct, which the 19 Oct question had not offered). Settings (L5): Night · Day · Match my phone. Launch screen and App Store screenshots are night. Supersedes v1.1 R1's day-default line.
- C error colour — RULED: none; the quiet card (gold-ink rule, ink-2 words); --danger → --gold-ink, --danger-line → --line; destructive = ink-2 words + confirm sheet with one gold button naming the act. Alternative --error-ink #8E2F14 / #F0A07E (5.77·7.37 / 8.29·5.92).
- D retired hues — RULED: alias, don't purge (290 consumers untouched); the 0-consumer purge → R-POLISH lite.
