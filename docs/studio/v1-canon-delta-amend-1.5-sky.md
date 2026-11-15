# The Sunflower — canon delta amendment 1.5: the sky

Status: AMENDS `docs/studio/v1-canon-delta.md` with amendments 1.2 and 1.4 (tokens + corrections). Written at L4 Stage 5
(10–11 Nov 2026, Opus 5.5) from the build. Every value below is read from live `assets/theme.css` or from the lifted engine
(`js/hand.js`, md5 `fd51ca7e69325ad3f93c4be54d974d9a`), never from memory.

## 1. The sky adds NO tokens

The lens sky (L4.4, rulings 84–87) consumes only tokens that live `theme.css` already defines, each with one definition
(night `:root` + the day block):

| token | role in the sky | night | day |
|---|---|---|---|
| `--sky` | the sky ground | #1C120A | #2B1E12 (the sky stays dark by day — the Sept-19 ruling) |
| `--sky-a` / `--sky-b` | the ground's two light layers | `var(--pool)` / none | `var(--lamp-foot)` / `var(--lamp)` |
| `--pool` · `--lamp` · `--lamp-foot` | the Pool at night, the lamp by day | as in theme.css | as in theme.css |
| `--on-night` · `--on-night-2` · `--on-night-3` | ink on the sky (greeting, names, hint, counts, door) | #F5E8C4 · #CDB894 · #BAA48C | same (no day override) |
| `--gold-star` | focus rings on orbs, the flower, the door | #E8B23A | #E8B23A (constant) |
| `--gold` | the switches' "on" track | #E8B23A | #D9931A |
| `--card-1` (= `--page-2`) | the switch thumb, the sheets' ground | #4A2E18 | #FBF3D9 |
| `--card-2` · `--umber` | the clause card / the state band | as in theme.css | as in theme.css |
| `--ink` · `--ink-2` · `--ink-3` · `--line` | text and rules on the sheets | as in theme.css | as in theme.css |
| `--font-serif` · `--font-body` · `--font-mono` | type | Fraunces · DM Sans · DM Mono | same |
| `--dur` · `--ease` | motion | as in theme.css | as in theme.css |
| `--bl-core` … `--bl-edge` (7) | the bloom (read by hand.js) | as in theme.css | as in theme.css |

**The mockups' names were renamed to these live twins** (amended ruling 1, Preston 10 Nov 2026), because the carry's
`sky.css` used names theme.css does not define: `--on-n/-2/-3` → `--on-night/-2/-3`, `--ink3` → `--ink-3`,
`--serif/--sans/--mono` → `--font-serif/--font-body/--font-mono`, **`--card` → `--card-1`** (the only twin that matches the
mockup in BOTH moods: #4A2E18 night / #FBF3D9 day), **`--star` → `--gold-star`** (the only constant #E8B23A; `--gold` drops to
#D9931A by day). The pre-build red-team caught the first-proposed twins (`--umber`, `--gold`) as wrong by day.

## 2. Where the sky's CSS lives

There is no new stylesheet (PROTOCOL.md §7). The host CSS is one fenced block in `assets/components.css`
(`/* === L4 SKY — begin === */ … /* === L4 SKY — end === */`, 10,557 B, md5 `f5a92edd260273230da0efb4e721dd69`). It was
derived mechanically from the carry's `sky.css` (11,522 B, md5 `89f56ebe061f66985d30888e5969f10b`) by four changes:
- the renames above;
- every sky rule scoped under `.sky`;
- the sheet, switch, mark and seed rules scoped under `.lx`, the L4 surfaces' one class (the sky host carries both: `class="sky lx"`);
- the keyframe ANIMATION rules kept inside `.sky`, so a `.mark.still` in a sheet never animates (`.pt`'s static `transform:var(--tf)` is split out under `.lx`), and the duplicate block (sky.css 110–128) dropped.

The block goes back into the carry so the mockups and the build share one source again. Two facts the mockups never had to
face, recorded for the design chat:
- the live app has **no global button reset**, so the sky's own buttons get theirs in the L4 LENSES block;
- the keyframe names (`drift turn sway ripple grain pulse morph tilt`) are global. They collide with nothing live today (0 definitions, 0 bare references), but they are generic.

## 3. The one new idiom: `color-mix` of `--on-night` for the sky's hairlines

The sky's hairlines (the avatar ring, the search pill's edge, the door's top rule, the modes' outline and pressed fill) are
`color-mix(in srgb, var(--on-night) N%, transparent)`, with N = 14 / 22 / 28 / 35. `color-mix` already appears in theme.css
(5 tokens, e.g. `--wash`, `--wheat-glow`). What is new is its use on the sky. **iOS floor: Safari 16.2** (color-mix). Below
it the declarations are invalid and the hairlines simply do not draw; nothing else degrades.

## 4. R2 exemption — the engine's SVG colours are content

`hand.js` paints the lenses in the **Garden**: 17 colours (the ten presets of amendment 1.3, then its seven "more"; the
amendment's own-slot names are colours, not names — a lens's name is always its own). Amendment 1.3 itself is not in the
repo; its colours live in the engine (`PraxisHand.GARDEN`) and are recorded here. Each is clamped toward #FFF1D2 in .05 steps
until it reads ≥3:1 on BOTH skies (#1C120A night, #2B1E12 day) — measured from `PraxisHand.gardenColour(i)`:

| # | slot | Garden | drawn | clamp t | night | day |
|---|---|---|---|---|---|---|
| 1 | Liberation | #EDB52F | #EDB52F | 0 | 9.87 | 8.67 |
| 2 | Power, named | #D4472F | #D4472F | 0 | 4.16 | 3.66 |
| 3 | Dignity | #9A6CC9 | #9A6CC9 | 0 | 4.70 | 4.13 |
| 4 | Solidarity | #5F9AE0 | #5F9AE0 | 0 | 6.30 | 5.54 |
| 5 | Care | #E58AA6 | #E58AA6 | 0 | 7.47 | 6.57 |
| 6 | Doubt | #7FBFAE | #7FBFAE | 0 | 8.74 | 7.68 |
| 7 | Praxis | #E67E3A | #E67E3A | 0 | 6.50 | 5.71 |
| 8 | Inheritance | #9C4A6E | **#A15273** | **.05** | **3.48** | **3.06** |
| 9 | Hope | #86B25B | #86B25B | 0 | 7.48 | 6.58 |
| 10 | Craft | #F3E6C8 | #F3E6C8 | 0 | 14.88 | 13.08 |
| 11 | own 1 | #F2A07B | #F2A07B | 0 | 8.85 | 7.78 |
| 12 | own 2 | #C3A6E8 | #C3A6E8 | 0 | 8.72 | 7.66 |
| 13 | own 3 | #9CC7F0 | #9CC7F0 | 0 | 10.38 | 9.13 |
| 14 | own 4 | #B7C24A | #B7C24A | 0 | 9.50 | 8.35 |
| 15 | own 5 | #C65BCF | #C65BCF | 0 | 5.09 | 4.47 |
| 16 | own 6 | #2F7F9E | #2F7F9E | 0 | 4.08 | 3.59 |
| 17 | own 7 | #C9A66B | #C9A66B | 0 | 8.02 | 7.05 |

Only Inheritance clamps, exactly as the engine contract (§3 step 9) states. The engine's gold hairlines (threads, ring
strokes) and the bloom's gradients are content under the same exemption. A lens's colour is chosen once (`makeLook`, by
name-hash stepped to the next colour not in the sky) and stored on the lens — never re-derived (tools/lens-data-test, proof 10).
