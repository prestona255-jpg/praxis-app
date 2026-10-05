# The Sunflower — canon delta amendment 1.2

Status: AMENDS docs/studio/v1-canon-delta.md (v1.1, 2026-09-19). Ruled 2026-09-29 in chat (Fable, eight items, capped, all at rec). Reference picture = artifact "Sunflower v7" (supersedes "Praxis Home Directions" v6); source landed as design/sunflower-v7.html. Where this file and v1.1 disagree, this file governs. Everything in v1.1 not named here stands.

Why: v6 read flat. Diagnosis — every color sat in one thin hue band, the paper had two value steps, the lamp lit the sky and never the page, nothing had a surface. Five depth levers were tested on the v6 Home one at a time (artifact "Sunflower, Deeper"); all five are kept. Two canon violations already in v6 were found and are fixed here (R4: gold painted on the rail stripe; R2/rail truth: the Home rail drew spines where the Shelf shows covers).

## 1. Token sheet — changed values

| token | v1.1 | v1.2 | why |
|---|---|---|---|
| page | #F3E3B4 | #EDD79E | range: page one shade deeper |
| page-2 (cards) | #FAF0CF | #FBF3D9 | range: cards one shade lighter |
| page-3 | #EBD9A6 | #E2C98C | range: third step follows |
| ink-3 | #72603C | #6B5936 | re-measured on the deeper page (4.29 → 4.77) |
| night page | #2B1E12 | #24180C | range at night; the SKY by day stays #2B1E12 (Sept-19 ruling kept) |
| umber-2 (night card-2) | #5C3B21 | #63401F | range at night |

Unchanged: ink #2A1E10, ink-2 #6F5A34, gold #D9931A, gold-ink #835508, star #E8B23A, sky-day #2B1E12, sky-night #1C120A, umber #4A2E18, umber-lamp #5C3B21, on-night #F5E8C4 / #CDB894 / #BAA48C, yumi #C8552E, radii, faces.

## 2. Token sheet — new tokens

| token | day | night | use |
|---|---|---|---|
| stem | #45704F | #8DB08A | the lines between stars; one quiet text link per surface. Never a fill, never a press. |
| spill | linear-gradient(180deg, rgba(92,59,33,.16), transparent 140px) | linear-gradient(180deg, rgba(232,178,58,.10), transparent 140px) | painted at the top of the paper, directly under the sky |
| lamp-foot | radial-gradient(80% 40% at 50% 100%, rgba(232,178,58,.10), transparent 70%) | same | second layer on the sky, at its foot |
| star-glow | drop-shadow(0 0 5px rgba(232,178,58,.85)) | same | filter on the arc-star group only |
| card-hi | inset 0 1px 0 rgba(255,255,255,.55), 0 1px 0 rgba(42,30,16,.05) | inset 0 1px 0 rgba(255,255,255,.07) | the hairline of light on every card's top edge |
| grain | SVG fractalNoise tile 220px, baseFrequency .85, 2 octaves, alpha .55; opacity .32, multiply | same tile; opacity .22, screen | one ::after over the paper layer of every screen; the sky sits above it |

## 3. Type scale — changed

| role | v1.1 | v1.2 |
|---|---|---|
| greeting (Home sky) | 36 / 52 desktop, wt 600 | 46 / 66 desktop, wt 500 |
| card title (.sub) | 22 / 28 | 26 / 32 |
| counts (.stat b) | 26 | 34 |
| kicker (.k) | 11.5 mono, .08em | 11 mono, .12em (11px is the floor for any text) |

## 4. Rules — amended (numbering follows v1.1)

- R2 SIX colors from the flower (was five): page, gold, sky brown, terracotta, and now STEM green. Stem may only draw the lines between stars and one quiet link per surface. Content (covers, photos) stays exempt.
- R3 The lamp and its spill are the only gradients (was: the lamp alone). Stars may glow. Still no glass, no blur; scan viewfinder may use flat translucency.
- R4 Unchanged in wording, now enforced on Home: the rail stripe (gold painted) is removed.
- R5 Three faces three jobs, plus: ITALIC Fraunces belongs to anything with a voice — Yumi's lines and named arcs. The app's own words (greetings, titles, labels, buttons) stay roman.
- R6 Yumi = the SEED: an open terracotta ring (r 7 of 20, stroke 1.5) with one off-center dot (cx 12.6, cy 7.6, r 1.7). Supersedes "recolor on the existing glyph shape". Her seat is the sky color. The separate glyph-redraw round is ABSORBED here, not owed.
- R7 Cards are tone AND catch one hairline of light on the top edge (card-hi). Still no drop shadows except overlays; the door (R9) is an overlay.
- R8 Unchanged. Ruled explicitly: the Home sky is STILL — no ambient motion, no twinkle. The glow is static.
- R9 Home sky-first, plus THE DOOR IS DRAWN: one pressed gold circle, 56px, pen mark in on-gold ink, bottom-right, 16px above the tab bar on phone, at the window's corner on desktop (right 40 / bottom 36 at 1360). Every surface. The paper carries 88px of bottom inset so the door never covers content. It opens the plain One-Door note (R-CAPTURE's door, <400ms). Yumi's dock stays at the foot of the paper (raised-hand law).
- R10 Unchanged; measured again — see §6.

## 5. Rules — new

- R11 GRAIN. The paper has tooth, the sky is smooth. One noise tile over the paper layer of every screen at the values in §2; the sky and the tab bar sit above it. Content under grain is fine.
- R12 RAIL TRUTH. The Home "Still reading" rail shows covers exactly as the Shelf does. A missing cover falls back to a page-3 block carrying the title in Fraunces 500 and the author in DM Sans, no stripe.

## 6. Measured pairs (v1.2 values, both moods)

Lowest passing pair by day: gold-ink #835508 on page #EDD79E = 4.53. By night: on-night-2 #CDB894 on umber-2 #63401F = 4.76. All small text ≥ 4.5; stem link #45704F on page-2 = 5.14; stem on the sky (lines only, not text) = 6.71 / 7.64. Full table in the chat record of 2026-09-29; re-measure at P3 Stage 0 against the CSSOM, not the sheet.

## 7. Out of scope (unchanged from v1.1 §4, plus)

Still out: --field-1..10 spectrum, register hues, avatar color, Shelf grass strip, reading-measure fixes. Added: XL tier (R-POLISH lite), the sparse/first-run frames of Home (the spine mockup owns them), cover art itself (real jackets in the build; v7 shows typographic placeholders).

## 8. What P3 inherits

The P3 build prompt reads v1.1 + this file + design/sunflower-v7.html. Where the three disagree, the picture wins for shape and this file wins for values.
