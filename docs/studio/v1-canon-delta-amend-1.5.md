# Canon delta — amendment 1.5: "Blue sky, warm ground" (ruling r88, 14 Nov 2026)

Changes **values only**. No token is added, removed or renamed in this amendment. Everything not listed keeps its 1.4 value, including `--sky`, `--yumi`, `--stem`, every gradient (`--lamp`, `--lamp-foot`, `--pool`, `--spill`), the `--bl-*` Bloom tokens and the theory layer.

| Token | Night, 1.4 | Night, 1.5 | Day, 1.4 | Day, 1.5 |
|---|---|---|---|---|
| `--page` | `#24180C` | `#1F140C` | `#EDD79E` | `#FBF8F1` |
| `--page-2` | `#4A2E18` | `#33241A` | `#FBF3D9` | `#FFFFFF` |
| `--page-3` | `#63401F` | `#46321F` | `#E2C98C` | `#EFE9DC` |
| `--ink` | `#F5E8C4` | `#FBF4E6` | `#2A1E10` | `#2B1B10` |
| `--ink-2` | `#CDB894` | `#CDBBA5` | `#6F5A34` | `#6A5646` |
| `--ink-3` | `#BAA48C` | `#BFAB94` | `#6B5936` | `#6A5646` |
| `--line` | unchanged | unchanged | `rgba(42,30,16,.16)` | `rgba(43,27,16,.14)` |
| `--gold` | `#E8B23A` | `#F2B72E` | `#D9931A` | `#F2B72E` |
| `--gold-ink` | `#E8B23A` | `#E3B88A` | `#835508` | `#7A4520` |
| `--gold-star` | `#E8B23A` | `#F2B72E` | (night only) | (night only) |
| `--on-gold` | `#1C120A` | `#2B1B10` | `#2A1E10` | `#2B1B10` |
| `--umber` | `#4A2E18` | `#33241A` | (night only) | (night only) |
| `--umber-2` | `#63401F` | `#46321F` | (night only) | (night only) |
| `--on-night` | `#F5E8C4` | `#FBF4E6` | (night only) | (night only) |
| `--on-night-2` | `#CDB894` | `#CDBBA5` | (night only) | (night only) |
| `--on-night-3` | `#BAA48C` | `#BFAB94` | (night only) | (night only) |

The `html[data-mood="auto"]` block takes the Day 1.5 column, byte-identical to the day block, as in 1.4.

**Role change, in words.** `--gold-ink` was "gold as ink". From 1.5 it is the accent ink: a warm brown by day, a tan by night, used for links, "Open", and the current tab. `--gold` is the yellow fill of the one main button.

**Measured (WCAG ratio, new values).** Night: ink on page / page-2 / page-3 = 16.49 / 13.63 / 11.05; ink-2 = 9.67 / 7.99 / 6.48; ink-3 = 8.14 / 6.72 / 5.45; gold-ink = 9.87 / 8.16 / 6.62; on-gold on gold 9.15; on-night on sky 16.82. Day: ink = 15.63 / 16.57 / 13.70; ink-2 and ink-3 = 6.53 / 6.93 / 5.72; gold-ink = 7.33 / 7.78 / 6.43; on-gold on gold 9.15. **Day `--gold` on page is 1.71 and on page-2 is 1.81: it is a fill, never a text colour on paper** (1.4's `#D9931A` on wheat was about 1.76).

**Not in 1.5, held for the sky lane (LC2).** The blue sky (`#1D5AA6` day, `#0F2F5E` night), the sunset burst, the brown ground at the sky's base, and the warm field block (`#EFD9BA` day, `#4A2E18` night). Those need new tokens and a new engine, and get their own amendment.
