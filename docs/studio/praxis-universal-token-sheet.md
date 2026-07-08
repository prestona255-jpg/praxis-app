# Praxis Universal — Token Reconciliation Sheet v1.2 (R0 → R1 source + Light & Depth law)

**Date:** 2026-07-08 · **Inputs:** `docs/studio/recon/r0-recon.md` (live 208 tokens) × `design/praxis-design-canon.html` + `design/praxis-profile-galaxy-mockup.html` (canon 13 tokens)
**Status:** CONFIRMED v1.2 — R1 re-skinned the canon + mockup to this; R1.1 is the warmth revision below; **v1.2 adds §8 Light & Depth** (the gilding / glow / atmosphere law + its restraint rails). Remains the source of truth; R2 proves on one live surface.
**v1.2 amendment:** §8 is the depth law Preston felt-passed (the "v3" writing-surface + profile direction). Its single buildable form is `docs/studio/universal-depth.css` (Universal depth v1.2) — copy recipes from there and cite the version; never fork inline copies.

---

## v1.1 revision (warmth — after Preston's felt gate)

R1's light-ground result read flat: four "keep-live" values tuned for the live app's warm amber ground read muddy on canon's near-white paper. v1.1 adopts the **canon** value for those four on the **LIGHT ground only** — dark-ground remaps, the `.galaxy-night` scope, gilding (`--gold-hi #d9a441`, `--lum-gold #ffce4a`), `--surface`/`--surface-2`/`--paper`/`--ink`/`--radius`, and all decorative literals are unchanged.

| Token (light ground) | v1.0 | v1.1 | Why |
|---|---|---|---|
| `--gold` (primary) | `#855410` | **`#a8761a`** | brighter, truer gold on paper — the richness lever |
| `--gold-deep` | (collapsed to `#855410`) | **`#855410`** (now DISTINCT) | deep gold survives for small-text / AA contrast |
| `--ink-2` | `#4d3b2a` | **`#645940`** | warmer, wider tier separation |
| `--ink-3` | `#9a7e4e` (live `--meta`) | **`#978b6d`** | canon tertiary — restores three-tier ink variation |
| `--line` (hairline) | `rgba(36,23,16,.16)` | **`#e3d8c1`** (warm opaque) | warm hairlines on light; translucent stays ONLY in dark-ground contexts |

**Field spectrum (new in v1.1):** a ten-hue planet set `--field-1 … --field-10` (promoted from live `--tradition-*-halo` + canon planet hues — no invented colors; values in §2) is added to `:root` for planet/field variation. `--sage` (§2) is **superseded by `--field-5`**.

---

## Principle (what this fusion is and is NOT)

This is a **combination, not a supersession.** The live app's **architecture stays**: the two-tier resolution (primitive → semantic), the ground-aware `[data-ground="dark"]` remap, the entire `--lum-*` Lumen set, and the 57 register/subtheory tokens assembled by runtime string-concatenation. Canon's **paper-and-night colors fold into that machinery** — we change contested *values*, never the structure.

Why the structure is untouchable: 170 tokens are consumed by literal `var()`, but 57 more (`--register-*`, `--subtheory-*`) are consumed by concat (`'var(--subtheory-'+n+')'`). A value-only find/replace that renames or drops any concat-family token **silently breaks the constellation and register coloring** with no error. So R1 changes values in place; it does not rename, restructure, or prune.

---

## §1 · The three resolved forks

| Fork | Decision | Who | Rationale |
|---|---|---|---|
| **Light ground** | **Canon paper** — near-white card `#fffdf8` on warm paper `#f4efe4` | Claude (deferred) | The card/ground separation is what lets gilding read. Low blast radius — most surfaces are dark-ground. |
| **Night** | **Contextual** — warm umber for reading/chrome, blue-black `#0b0d16` **galaxy-only** | Preston | Starfield wants sky; reading wants warmth. Scoped, not body-level → 21 other surfaces untouched. |
| **The golds** | **Three roles, distinct** — deep `#855410` (interactive), gilding `#d9a441` (edge+glow), luminous `#ffce4a` (stars) | Claude (deferred) | Gilding law ("edge + glow, never a fill") only holds if gilding-gold ≠ interactive-gold. Deep gold is the 173-ref workhorse — repointing ripples everywhere. |

---

## §2 · Universal PRIMITIVE layer (the changes)

Only these primitives change or get added. Everything else in live's primitive palette stays.

| Primitive | Live now | Universal | Source | Note |
|---|---|---|---|---|
| `--paper` *(light page ground)* | `--page` `#f8f1e1` | **`#f4efe4`** | canon | ~imperceptible shift; aligns to the canon reference. Semantic page ground reads from here. |
| `--card` *(light card fill)* | `--page-2` `#fcf6e8` (was doubling as surface) | **`#fffdf8`** | canon | **The identity move** — near-white cards. `--surface` now resolves to this, not to page-2. |
| `--card-2` *(secondary card)* | (none — `--surface-2` = page-2) | **`#efe7d6`** | canon | Canon gives a real secondary card tier; live had none. |
| `--gold-ink` *(deep/interactive gold)* | `#855410` | **`#855410`** | live | **UNCHANGED.** The 173-ref workhorse. Semantic `--gold` keeps resolving here. |
| `--gold-hi` *(gilding highlight)* | (approximated by `--gold-soft`) | **`#d9a441`** | canon | **NEW primitive.** The canonical gilding token — edge treatment + glow ONLY, never a fill. |
| `--lum-gold` *(luminous/star gold)* | `#ffce4a` | **`#ffce4a`** | live | **UNCHANGED.** Lives in the Lumen set, drives field/constellation. |
| `--sage` *(held accent)* | (none) | **`#a9b98c`** | canon | **Superseded by `--field-5` (v1.1).** Now homed in the ten-hue field spectrum below. |

Warm-umber dark primitives (`--ground #2f1c0e`, `--surface-d #3e2814`, `--surface-d2 #4a3119`, `--text-d #f0e3c8`) — **all UNCHANGED.** They carry the reading-surface identity.

**v1.1 gold split (light ground):** `--gold` = **`#a8761a`** (canon, primary/accent) and `--gold-deep` = **`#855410`** (deep, for gold text/icons on cream at small sizes / AA). The R1 collapse of the two into one value is undone.

**v1.1 field spectrum** (ten planet/field hues, added to `:root`; promoted from live `--tradition-*-halo` + canon planets, no invented colors — supersedes `--sage`):
`--field-1 #f2c25a` amber · `--field-2 #e07a52` coral · `--field-3 #d98f8a` rose · `--field-4 #f5bace` pink · `--field-5 #a9b98c` sage · `--field-6 #98d4b0` mint · `--field-7 #8590d8` periwinkle · `--field-8 #f8e078` pale gold · `--field-9 #e8b068` honey · `--field-10 #b8896c` russet.

---

## §3 · Universal SEMANTIC layer (collisions resolved)

Final values for the 12 collision rows. "Keep live" = the value flows unchanged; "Adopt canon" = new value, same two-tier plumbing.

**Group A — same-name collisions:**

| Token | Universal `:root` (bright) | `[data-ground=dark]` | Call |
|---|---|---|---|
| `--surface` | `var(--card)` = **`#fffdf8`** | `var(--surface-d)` `#3e2814` (unchanged) | Adopt canon (bright card) |
| `--surface-2` | `var(--card-2)` = **`#efe7d6`** | (per-surface, unchanged) | Adopt canon (secondary tier) |
| `--ink` | **`#241710`** | `var(--text-d)` `#f0e3c8` (unchanged) | Keep live — 313 refs, canon `#241d10` imperceptibly different |
| `--ink-2` | **`#645940`** *(v1.1)* | (unchanged) | **Adopt canon (v1.1)** — warmer, wider tier separation on paper |
| `--ink-3` | **`#978b6d`** *(v1.1)* | (unchanged) | **Adopt canon (v1.1)** — restores three-tier ink variation |
| `--gold` | **`#a8761a`** *(v1.1, light)* · `--gold-deep` `#855410` | `#d2a23e` (unchanged, on-dark legibility gold) | **Adopt canon (v1.1)** — brighter gold on paper; deep gold kept distinct for small-text AA |

**Group B — same-role, different-name:**

| Role | Universal token · value | Call |
|---|---|---|
| page ground | `--page` → **`#f4efe4`** (canon paper value) | Adopt canon value into live token name |
| hairline | light: `--line`/`--border` **`#e3d8c1`** *(v1.1, warm opaque)* · dark: **`rgba(36,23,16,.16)`** (unchanged) | **v1.1** — warm opaque hairline on paper; translucent stays ONLY in dark-ground contexts |
| deep gold | `--gold-ink` **`#855410`** | Keep live — canon `#8c5c10` imperceptible |
| warm-red accent | `--danger` **`#c2603a`** | Keep live — canon `--ember #c0492a` imperceptible |
| corner radius | `--radius-lg` **`16px`** | Identical — no change (canon `--radius` = same) |
| gilding accent | `--gold-hi` **`#d9a441`** (new, §2) | Adopt canon — this is the gilding token; live `--gold-soft #e7c46a` stays for its softer-wash uses |

---

## §4 · Contextual night (the one new build)

**Default dark = UNCHANGED warm umber.** The `umberGroundDark` body-ground system and all its surfaces are not touched.

**NEW: a galaxy-scoped night.** The starfield/galaxy container — and only that container — gets a scoped remap. **Do NOT** add a body-level `data-ground` value or edit `umberGroundDark`; scope it to the galaxy element so the account/profile page *around* it stays umber.

Implement as a scoped block (`.galaxy-night` on the starfield container, or a container-scoped `[data-ground="night"]` that is applied to the element, never `document.body`):

| Night token | Value | Source |
|---|---|---|
| night ground | `#0b0d16` | canon galaxy |
| night panel/surface | `#101019` | canon galaxy |
| night hairline | `--night-line` **`#3a2c15`** | canon (finally homed) |
| text on night | `var(--text-d)` `#f0e3c8` cream | live (labels read on blue-black) |
| stars / luminous | `--lum-gold` `#ffce4a` | live Lumen |
| night accents | `--gold-hi` `#d9a441` | gilding |

**Blast radius: the galaxy surface only.** R1 verifies by confirming `document.body[data-ground]` is never assigned `"night"` and `umberGroundDark` is unedited.

---

## §5 · Mechanical batch (recorded, keep-live)

These collisions resolved to keep-live because the canon delta is imperceptible or the live form is the more correct engineering choice — no felt call needed: `--ink` (`#241710`), `--danger`/`--ember` (`#c2603a`), `--radius-lg`/`--radius` (`16px`, identical), and the deep gold `--gold-ink`/`--gold-deep` (`#855410`, kept distinct for small-text AA).

**Superseded by v1.1** — *revised after Preston's felt gate; live values read flat on paper ground:* `--ink-2` (`#4d3b2a` → `#645940`), `--ink-3` (`var(--meta)`/`#9a7e4e` → `#978b6d`), light-ground `--gold` (`#855410` → `#a8761a`), and the light-ground hairline (translucent `--border` → warm opaque `--line #e3d8c1`; translucent retained on dark only).

---

## §6 · What does NOT change (R1 safety rails)

- **The entire `--lum-*` Lumen set** (28 tokens) — untouched.
- **The 27 `--register-*` + 30 `--subtheory-*` concat families** — untouched. Renaming or dropping any breaks constellation/register coloring silently.
- **The 5 runtime `setProperty` seams** (`--tick`, `--lit`, `--reg` at views.js:4981/5044/9519/10706/13453) and the marks.js inline `--cd`/`--mk-glow` — untouched.
- **The 170 literally-consumed tokens** keep their names; only the contested handful in §3 change value.
- **The 10 true-dead tokens** are NOT part of this reconciliation (separate cleanup task if ever; recorded in recon §1.5, not touched).

---

## §7 · R1 handoff

On Preston's confirm, R1 (staged Claude Code build, self-running gates) re-skins **the canon + mockup** to this sheet — meaning the two `design/*.html` files adopt the Universal semantic set and the galaxy mockup gets the §4 scoped night. R1 is where byte-deltas and grep-verification live; this sheet is the spec it implements against. R2 then proves Universal on one live surface (Shelf or Home), and that surface's gap audit writes the next round's brief.

---

## §8 · Light & Depth (v1.2)

The depth law. Where §1–§7 fixed *which colors* Praxis wears, §8 fixes *how light falls
on them* — the gilding, the glow, the weathered warmth, the stacked planes. This is the
"v3" direction Preston felt-passed (the writing-surface + profile mockups). It reaches the
live surfaces through the R2+ studio rounds, never in a single swing.

**Single source.** The recipes below are *documented* here and *built* once in
`docs/studio/universal-depth.css` (header: `Universal depth v1.2`). That file is the
canonical, buildable form; `tools/studio-build` inlines it into `builder.html`; future
mockups and surface builds copy from it and cite the version. The CSS shown below mirrors
that file — **if the two ever disagree, `universal-depth.css` wins** and this doc is the
drift to correct. A recipe change edits the file and regenerates; it never hand-syncs copies.

The tokens are wired by NAME (`--gold-hi #d9a441`, `--field-1 … --field-10`, `--lum-gold
#ffce4a`, `--thread #c2a463`, `--gold`, `--gold-deep`); read values from `theme.css` /
§1–§2, never hardcode a literal downstream.

### The eight recipes

**1 · Gilded hairline** — a card/panel top edge, edge treatment only (never a fill):

```css
.u-gild-hairline{position:relative;}
.u-gild-hairline::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent 0%,var(--gold-hi) 15%,#f2c25a 50%,var(--gold-hi) 85%,transparent 100%);
  pointer-events:none;border-radius:inherit;}
```

**2 · Luminous orb** — any state / presence dot is a lit sphere, never a flat circle.
Glow intensity encodes state: **bright = active/closed, soft = in progress, unlit = untouched**
(flat `--line` fill, no shadow):

```css
.u-orb{background:radial-gradient(circle at 35% 30%, <hi> 0%, <hue> 55%, <deep> 100%);
  box-shadow:0 0 <r>px <s>px <hue @ .4–.7 alpha>;}
.u-orb--lit{ /* active/closed — bright glow */ }
.u-orb--soft{ /* in progress — soft glow */ }
.u-orb--unlit{background:var(--line);box-shadow:none;} /* untouched — flat, unlit */
```
Per-hue modifiers (`.u-orb--amber … .u-orb--russet`) set the sphere's field color from
`--field-1 … --field-10`.

**3 · Ink-to-gold display text** — titles and display numbers only:

```css
.u-inkgold{background:linear-gradient(180deg,var(--ink) 38%,var(--gold) 108%);
  -webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;}
```

**4 · Lamplight** — the meaning-bearing element in a region (selected value, key passage,
active whisper) gets a radial warm wash. **HARD RULE: one lamplight per view region.**

```css
.u-lamplight::before{content:'';position:absolute;inset:-24% -12%;pointer-events:none;
  background:radial-gradient(ellipse, rgba(242,194,90,.32) 0%, transparent 72%);}
```

**5 · Gilded button** — the primary action: a lit gold gradient, an inner top light, a soft
outer gold glow, dark-ink text `#3d2807`:

```css
.u-btn-gild{color:#3d2807;background:linear-gradient(180deg,#f2c25a 0%,var(--gold-hi) 40%,var(--gold) 100%);
  box-shadow:inset 0 1px 0 rgba(255,240,200,.7), 0 6px 18px -8px rgba(217,164,65,.6);}
```

**6 · Atmospheric ground** — light grounds are weathered, not flat: 2–3 radial warm washes
(`#f8e4b0`, `#e8c887` family) over a `linear-gradient(155deg,#f2e2bd,#dfc38a)` base, plus an
`inset 0 0 60px rgba(133,84,16,.12)` vignette. Depth stacks in planes:
**ground → sub-panel → sheet → lit content.**

```css
.u-ground-atmo{background:
    radial-gradient(60% 46% at 22% 16%, rgba(248,228,176,.5), transparent 60%),
    radial-gradient(55% 50% at 82% 30%, rgba(232,200,135,.4), transparent 66%),
    linear-gradient(155deg,#f2e2bd,#dfc38a);
  box-shadow:inset 0 0 60px rgba(133,84,16,.12);}
.u-panel{background:linear-gradient(180deg,#f4e6c4,#eedcb2);border-radius:16px;box-shadow:0 6px 24px rgba(120,75,15,.18);}
.u-sheet{background:linear-gradient(180deg,#fffdf6,#fdf8ea);box-shadow:inset 0 1px 0 rgba(255,250,235,.9);}
```

**7 · Constellation thread** — related items strung on a 1px gilded line
(`--thread #c2a463`, fading ends) with field-spectrum orbs (recipe 2) at the nodes:

```css
.u-thread{height:1px;background:linear-gradient(90deg,transparent,var(--thread) 18%,var(--thread) 82%,transparent);}
/* SVG: stroke:var(--thread); nodes are <circle> filled per recipe 2. */
```

**8 · Glyph color language** — kinds of thinking carry field hues (margin = sage, seam = rose
with a periwinkle droplet, question = periwinkle, journal = honey, sub-theory = amber, book =
russet, value = gilding gold); the field spectrum lives **ON surfaces**, not only in planet data
(`.u-glyph-margin … .u-glyph-value` set `--glyph-hue` from the spectrum).

### The restraint laws (binding — the discipline that keeps this from turning garish)

- **Glow only on meaning-bearing elements** — state, values, primary actions, presence.
  Nothing decorative glows.
- **One lamplight per view region.** The wash marks the single most important thing in a
  region; two lamplights and neither reads as the answer.
- **Gilding is edge + glow, NEVER a fill on large surfaces.** A gilded hairline and a pooled
  glow, not a gold panel.
- **The v3 reference is the CEILING for light grounds** — beyond its warmth/depth, use the
  umber dark ground instead; do not push the paper past it.
- **PERFORMANCE** — glows are box-shadow / radial-gradient and cost paint: cap luminous orbs
  at ~30 per rendered view, never attach glow to elements animated on scroll, no
  `filter: blur()` for glow effects, and any list surface (shelf, search) applies orb glow
  only to in-viewport / interactive rows.
- **ACCESSIBILITY** — ink-to-gold gradient text is DISPLAY-ONLY (titles / metrics ≥18px, never
  body or meta text); all text tokens must hold WCAG AA on their assigned grounds; and a
  lamplight wash must never drop the text above it below AA (test the wash's densest point).
