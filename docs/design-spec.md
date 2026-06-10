# Praxis — Design Spec (code-true)

**Source of truth:** `docs/mockups/praxis-umbrel-full-app-medium.html` (the medium-honey
mockup) for all page chrome, type, color, and the **home constellation embed**;
`praxis-constellation-hybrid-v2.pdf` (comp-v2) for the **Arcs full constellation**
behaviors (Layers, dots, faint links, legend, motion).

Every value below was read out of the mockup's literal CSS. Screenshots were a visual
cross-check only. When the live app disagrees with a value here, **the live app is the
drift** — conform live toward this doc, not the reverse.

Provenance tags used below:
- `[mockup]` — read directly from the mockup HTML/CSS. Canonical.
- `[comp-v2]` — from the comp-v2 PDF (Arcs full view). Canonical for that surface.
- `[live-impl]` — value the mockup does **not** specify (e.g. the treatment overlay
  system), carried from the current shipped renderer because there's no mockup source.
  Flagged so you know its origin.
- `[reconcile]` — a known live↔mockup divergence to fix during conformance.

---

## Two decisions (settled)

1. **Silhouette = circle, everywhere.** The mockup *code* literally renders hex and
   diamond marks (`.mk.hex` / `.mk.dia`, home lines 115–116, Arcs lines 170–171), but
   those are a superseded older decision. Settled call: **circle-only.** The 14
   treatments × 16 hues give 224 stable, glance-distinct combos — uniqueness rides on
   **treatment × color**, not shape. "Keep the shapes" means keep the *treatments*. This
   is the one place the spec deliberately overrides the mockup code.

2. **Mockup token values are canonical — mockup wins on conflict.** The mockup defines
   its own values (e.g. `--gold:#a8741a`); prior recon recorded live theme.css using
   *different* ones (e.g. live `--gold:#d4972a`, live ground `#FAEEDA`). This doc records
   the **mockup's** values as canonical (it's the only artifact with literal values, and
   Phase 1 reconstructed *to* it). **Scope guardrail:** conformance fixes *conflicts*
   (same visual role, different value → mockup wins). Live has tokens the mockup never
   addresses (the register system, ~109 extra) — those are **out of scope, not drift**;
   do not delete them. Claude Code reads live theme.css and reconciles only the
   conflicts, stage by stage. I did **not** reproduce live values from memory here —
   that would re-introduce the prose-fidelity leak this whole exercise kills.

---

# Part A — Design Tokens

## A.1 Fonts `[mockup]`

| Token | Stack | Used for |
|---|---|---|
| `--serif` | `'Cormorant Garamond', Georgia, serif` | page titles, book titles, prose, "the question", quotes, Yumi-voice italics |
| `--ui` | `'DM Sans', system-ui, sans-serif` | body, nav, buttons, hero H1, inputs |
| `--mono` | `'DM Mono', monospace` | eyebrows, labels, meta, kbd hints, status, register tags |

Loaded weights: Cormorant 400/500/600 + italic 400/500; DM Sans 300–700; DM Mono 400/500.

**Note the trap:** the hero H1 is **DM Sans 700**, *not* serif. Serif is for the
quieter editorial layer; the hero shouts in sans.

## A.2 Color tokens `[mockup]`

| Token | Value | Role |
|---|---|---|
| `--bg` | `#d8bd80` | ground mid-stop |
| `--bg2` | `#e3c98c` | lighter ground |
| `--panel` | `#ecdcae` | card/glass fill |
| `--panel-2` | `#f2e6c2` | lighter panel |
| `--sunk` | `#c9a85f` | recessed |
| `--glass` | `rgba(245,233,200,.5)` | nav / control glass |
| `--glass-2` | `rgba(245,233,200,.82)` | secondary button glass |
| `--line` | `rgba(58,40,16,.2)` | hairline borders |
| `--line-2` | `rgba(58,40,16,.32)` | stronger borders |
| `--ink-1` | `#2a1810` | primary text |
| `--ink-2` | `#5c3e26` | secondary text |
| `--ink-3` | `#7a5c34` | tertiary / labels |
| `--ink-4` | `#9a7e4e` | quietest / meta |
| `--gold` | `#a8741a` | gold accent, q-pull rule |
| `--gold-l` | `#c5912b` | gold light |
| `--river` | `#27566a` | river blue (reg-tag text) |
| `--river-l` | `#3f7d92` | river light |
| `--teal` | `#1d8f68` | Yumi / marginalia / "gathered" |
| `--grad` | `linear-gradient(92deg,#b8841f,#27566a)` | primary buttons, avatar, gradient text |

Body flat fallback under the page gradient: `#cbb074` `[mockup]`.

## A.3 Ground gradients `[mockup]` — keep these literal

The goldenrod ground is **the** identity. Four distinct surfaces:

| Surface | Gradient |
|---|---|
| `.page` (every page ground) | `radial-gradient(1100px 560px at 50% -6%, #e6cb8e, #d8bd80 55%, #c4a35a 100%)` |
| `.preview` (home embed canvas) | `radial-gradient(120% 130% at 50% 0%, #f5ead0, #e3c98c 58%, #cba85f)` |
| `.cstage` (Arcs canvas) | `radial-gradient(130% 120% at 55% 16%, #fbf2da, #ecd9a6 55%, #d8bd80)` |
| `.spot-bg` (search overlay ground) | `radial-gradient(900px 500px at 50% 0%, #e6cb8e, #d8bd80)` |

**⚠ comp-v2 guardrail:** the comp-v2 PDF pages sit on a flat lighter cream. That is a
comp-sheet presentation artifact. The constellation **canvas** (`.cstage`) is
legitimately lighter than the page (it's a recessed luminous stage: `#fbf2da` center) —
but the **page ground stays goldenrod** (`#e6cb8e → #d8bd80 → #c4a35a`). Do not flatten
the page to cream. Pull marks/toggles/dots/motion from comp-v2; never its background.

## A.4 Sub-theory hues `[mockup]` (subset of the 16)

The mockup defines 9 of the 16-hue palette; the values are byte-identical to the live
16-token `--subtheory-N` set, so this is **not** drift. Full set lives in theme.css
(`--subtheory-1…16` + `--subtheory-N-edge` companions). Mockup samples:

`--s1 #F2A6C2` · `--s3 #F0A88A` · `--s5 #E8B068` · `--s6 #ECCB6A` · `--s9 #8FCB9A` ·
`--s10 #8FD0B8` · `--s12 #8FB6D6` · `--s14 #7E7BC0` · `--s16 #BE93C6`

Marginalia/Yumi green: `--teal #1d8f68`. Resonance thread (from live): tan
`--thread-color #B89A62`, faint `#C9B68A` `[live-impl]`.

## A.5 Radii / spacing / effects `[mockup]`

| Token | Value |
|---|---|
| `--r` | `10px` (buttons, inputs, small cards, mark legend swatches) |
| `--r-lg` | `16px` (glass cards, canvas, book-detail cover) |
| `--r-xl` | `22px` (home preview canvas) |
| pill radius | `999px` (nav, segmented toggles, register toggle, avatar) |

**Blur invariant** `[mockup]` — `backdrop-filter:blur()` appears on exactly these
surfaces, nowhere else: nav `blur(8px)`, spotlight panel `blur(14px)`, constellation
control buttons `blur(6px)`. (Live keeps the 4-line / 2-surface blur invariant from
memory — verify the control-bar blur against this when conforming the Layers control.)

Page padding `[mockup]`: `.page` = `26px 34px 44px`. Centered content `.wrap` =
`max-width:1080px; margin:0 auto`. (Live centered pages use `max-width:1280`; `[reconcile]`
— pick one; mockup says 1080.)

Card shadow recipe `[mockup]`: `.glass` = `0 1px 0 rgba(255,250,230,.5) inset,
0 16px 36px -24px rgba(58,40,16,.5)` (an inset top highlight + a soft long drop). Book
cover = `0 12px 30px -16px rgba(58,40,16,.5)`.

---

# Part B — Per-Component Rules

Each component lists its structure and the tokens that apply. Values are `[mockup]`.

## B.1 Nav (`.nav`)
Pill bar, `max-width:1080px; margin:14px auto 0`, `padding:11px 14px 11px 20px`,
`gap:18px`, `border-radius:999px`, fill `--glass`, `1px --line`, `backdrop-filter:blur(8px)`,
shadow `0 8px 30px -18px rgba(58,40,16,.4)`.
- Wordmark `.wm`: serif 600, **21px**, color `#8a5e15`, letter-spacing `.3px`.
- Search `.search`: flex-1, height **38px**, pill, fill `rgba(58,40,16,.07)`, `1px --line`,
  text `--ink-3` 13px; kbd `.k` mono 10px `--ink-4` in a 6px-radius bordered chip.
- Links `.links a`: 13.5px `--ink-3`, padding `8px 12px`, pill; active `.on` →
  `--ink-1` + `rgba(58,40,16,.1)` fill.
- Avatar `.me`: 34×34 circle, `--grad` fill, white 700 14px. Account page adds
  `outline:2px solid --gold-l; outline-offset:2px`.

## B.2 Hero (`.hero`)
Centered, `padding:70px 0 30px`.
- H1: **DM Sans 700, 62px**, letter-spacing `-1.5px`, line-height 1, `--ink-1`. The
  word "theory." wears `.grad` (gradient-clipped text via `--grad`).
- Sub `p`: 17px `--ink-2`, `max-width:540px`, margins `20px auto 26px`.
- CTA row `.cta`: `gap:12px`, centered. Buttons = `Open the constellation` (`.btn.bg`)
  + `Take the tour` (`.btn.gl`). `[reconcile]` live shows "Browse your shelf" as the
  second CTA — mockup says "Take the tour."

## B.3 Buttons (`.btn`)
Base: DM Sans 13.5px **500**, `border-radius:10px`, `padding:11px 18px`,
inline-flex, `gap:8px`, `1px solid transparent`.
- `.bg` primary: `--grad` fill, white, **600**.
- `.gl` secondary: `--glass-2` fill, `--line-2` border, `--ink-1`.
- `.bq` quiet: transparent, `--ink-3` (used for "Settings"; teal variant for "What does
  Yumi see?").
- `.dang`: transparent, border `rgba(150,50,24,.45)`, text `#9c3f1c`.

## B.4 Card / glass (`.glass`)
Fill `--panel`, `1px --line`, `border-radius:16px`, the two-part shadow from A.5.
`.pad` = `24px`. Eyebrow inside = `.eyebrow` (mono 10.5px `.16em` uppercase `--ink-3`).

## B.5 Shelf row
- Header `.shelf-top`: title block (eyebrow "Your library" + `.h-pg` "Your shelf") on
  the left; right cluster = segmented `Covers|List` (`.seg`) + `Resolve covers` (`.gl`)
  + `+ Add book` (`.bg`).
- Filter rail `.fil` (180px column, 34px gap to grid): `.fh` mono 10px `.14em` uppercase
  `--ink-3` with bottom hairline; `li` 13px `--ink-2`, active `.on` → `--ink-1` 500 + a
  2px `--gold` left bar (`::before`); count `.cnt` mono 9.5px `--ink-4` right-aligned.
  Theme rail order `[reconcile]`: Critical theory & pedagogy / Power & systems /
  Liberation / Love & connection / History & memory (live shows author filter only).
- Grid `.books`: `repeat(5,1fr)`, `gap:24px 18px`.
- Card `.bk`: cover `.cov` aspect `2/3`, radius 10px, `1px --line`, cover shadow;
  a 3px `--reg` (sub-theory hue) spine `.sp` down the left edge. Cover-pending fallback
  `.cov.fb` = `linear-gradient(160deg,#ecdcae,#cfb06a)` + serif-italic title + mono
  "cover pending". Title `.tt` serif 500 16px `--ink-1` lh 1.12; author `.au` 11.5px
  `--ink-3`; status `.st` = 5×5 `--gold` square + mono 9px uppercase label.

## B.6 Book-detail header
Two-column `.cols.two` = `300px 1fr`, `gap:22px`.
- Left col: cover (aspect `2/3`, radius **16px**, heavy shadow `0 24px 50px -20px #000`),
  then a button row `Add to arc` (`.bg`, flex-1) + `Cite` (`.gl`). `[reconcile]` live
  cover floats unless it holds `grid-row:1/span 6`; q-pull + Cite currently absent live.
- Right col: `.reg-tag` (mono 10px `.1em` uppercase `--river`, `1px rgba(39,86,106,.45)`,
  radius 6px, `padding:3px 9px`) → title serif **500 42px** lh 1.02 → subtitle serif
  *italic* 20px `--ink-2` → meta row (mono 11px `.1em` uppercase `--ink-3`:
  `Reading · in 2 arcs · 4 marginalia`) → `Your Book Artifact` glass card → `.q-pull`
  (serif *italic* 22px `--ink-2` lh 1.4, 2px `--gold` left border, `padding-left:16px`).
  `[reconcile]` reg-tag on Yearning reads "Critical theory" in mockup, "MEMOIR" live
  (data fix, Stage C).

## B.7 Notebook
- Header: title block (eyebrow "Structurally private" + `.h-pg` "Notebook") + button
  cluster `+ New entry` (`.bg`) / `+ New arc` (`.gl`) / `Settings` (`.bq`) /
  `What does Yumi see?` (`.bq` teal).
- Container `[reconcile]`: mockup has no explicit `.notebook` width rule (lives inside
  `.wrap`); live added `.notebook{max-width:1280px;margin:0 auto;padding:0 32px}`.
  Reconcile to the 1080 `.wrap` width if you standardize on mockup width.
- Entry rows `.row` inside one `.glass`: `padding:16px 18px`, bottom hairline, a 2px
  `--reg` left bar (`::before`, opacity .8) where `--reg` = `--teal` for Marginalia,
  `--s14` for Journal. Head `.eh` = register tag `.tagk` (mono 9px `.12em` uppercase;
  `.m` teal-bordered, `.j` line-bordered) + timestamp `.ts` (mono 10px `--ink-4`) +
  visibility `.vis` right-aligned (mono 9.5px; `.on` teal + filled dot, `.off`
  `--ink-4` + `--line-2` dot). Source `.src` serif italic 15px; body `.body` serif 16px;
  actions `.acts` 12px `#8a5e15` links.

## B.8 Sub-theory (writing surface)
Two-column `.cols.twoB` = `1fr 300px`.
- Left: eyebrow `A Pedagogy of Desire · sub-theory` → title serif **500 34px** lh 1.05
  → register toggle `.regtoggle` (pill, mono 10px `.08em` uppercase; `.on` →
  `rgba(58,40,16,.1)` + `--ink-1`) → prose `.read` (serif 18px lh 1.6 `--ink-1`,
  italic `<em>` for emphasis) → "Yumi is noticing" card `.noticing` (`1px
  rgba(29,143,104,.35)`, radius 10px, fill `rgba(29,143,104,.08)`; `.yh` mono 9.5px
  `.14em` uppercase teal; body serif italic 15px `--ink-2`).
- Right (Evidence rail): eyebrow "Evidence" → `.rail-it` rows (14×14 2px-teal hollow
  ring + serif 15px title, bottom hairline) → `+ Attach a book` (`.gl`, full width).

## B.9 Spotlight / global search
Centered `.spot` `max-width:640px`, radius 16px, fill `rgba(246,235,205,.94)`,
`backdrop-filter:blur(14px)`, deep shadow. Input row `.in` serif 18px + `esc` chip.
Groups `.grp` with `.gh` (mono 9.5px `.16em` uppercase `--ink-4`) headers:
Sub-theories & ideas / Books / Authors / Arcs & notes. Rows `.it` 14px `--ink-2`,
22×22 icon `.ic` (sub-theory rows get a `radial-gradient(circle,#fff8e7,--sN 80%)`
chip), `b` bold `--ink-1` 500, type `.ty` mono 10px `--ink-4` right-aligned; active
`.it.on` → `rgba(58,40,16,.07)`.

## B.10 Settings / Account
Settings cards = `.glass.pad` with `.fl` label + `.tog` switch (pill; `.on` → teal fill
`#06241a` text) + 12.5px `--ink-3` helper. Account = `.h-pg` title, mono signed-in line,
`.field` blocks (mono uppercase label, serif-italic hint, 15px input on
`rgba(58,40,16,.06)`), button rows, and a dashed `.dz` danger zone
(`1px dashed rgba(150,50,24,.4)`, `#9c3f1c` accents).

---

# Part C — Constellation (highest precision — this is where the drift lives)

Two surfaces share one mark language but differ in density and chrome.

## C.1 Mark anatomy — the treated circle

**Silhouette = CIRCLE. Always.** (See decision 1. The 9.6b 4-silhouette grammar is
collapsed to circle; uniqueness now rides on **treatment × color**, not shape.)

Mockup mark `.mk` is a centered box (`transform:translate(-50%,-50%)` on its `left/top`)
with two children `[mockup]`:

| Layer | Value |
|---|---|
| **Halo** `.h` | `inset:-24%` (→ 148% of the mark box), `border-radius:50%`, `radial-gradient(circle, var(--c), transparent 60%)`, **opacity .45**, `filter:blur(8px)` |
| **Body** `.b` | `width/height:62%` of the box, `border-radius:50%`, `radial-gradient(circle at 50% 38%, #fff8e7, var(--c) 80%)` (inner-light off-center top), **opacity .66**, ring `box-shadow:0 0 0 1.5px var(--c)` |

So the canonical mark = a backlit halo + a translucent inner-lit circle with a thin
same-hue ring. `var(--c)` = the mark's `--subtheory-N` hue. **No blur/filter on the
body** — the only blur in the whole mark is the halo's `blur(8px)`. Halos are soft;
bodies are crisp-edged translucent.

### Treatment overlay `[live-impl]`
The mockup marks are *plain* inner-lit circles — they carry **no** hatch/dot/ring
treatment. The 14-treatment overlay system exists only in the live renderer
(`arc-constellation.js` `_stTreatment`), and it's what "keep the shapes → keep the
treatments" refers to. There's no mockup source for its opacities, so these are the
current shipped (B3-tuned) values, recorded so the spec governs them:
- Treatment strokes/dots draw in the **darker** `--subtheory-N-edge` token.
- Treatment group wrapped at **opacity 0.74**, inside a body group at **opacity 0.58**
  → effective ~0.43× (a typical 0.5-alpha motif lands ~0.215). Treatments read as a
  faint texture *inside* the translucent body, never as loud line-art.
- Per-mark outline (the ring): stroke `--subtheory-N-edge`, **width 1.2, opacity 0.40**.
- Inner-light: `#FFF8E7` radial, opacity driven by maturity (`0.45 + maturity*0.55`).
- Halo peak opacity **0.50**, sized ~1.25× the body.

**Settled decision (body / ring / treatment):**
- **Body opacity `.66`, halo `.45` / blur 8 / inset −24%, inner-light `#fff8e7` at
  50%/38% → hue @80%** — mockup literals, canonical target.
- **Ring = mockup's same-hue `box-shadow:0 0 0 1.5px var(--subtheory-N)`** is the target.
  Live's darker `--subtheory-N-edge` token at width 1.2 / opacity 0.40 is the recorded
  drift. **Allowed fallback:** if the same-hue 1.5px ring doesn't separate a mark from
  the canvas on the real SVG, the darker edge token may stand — eye-on-live call at
  conformance, the one place live's choice is permitted to win.
- **Treatments stay** (the "keep the treatments" rule), but are **subordinate**: the
  treatment-overlay opacity is a *dependent knob*, tuned on live so body + treatment
  together read as quiet as the mockup's clean glow. B3's 0.74 wrap was tuned against
  the old 0.58 body; expect to re-tune once body goes to `.66`. If treatments still
  fight the clean look at low opacity, the mockup's own answer (plain inner-lit circle,
  no treatment) is the proof that quiet wins — pull the overlay back, don't push the
  body down.

## C.2 HOME EMBED — sparse + asymmetric (this is a RULE, not a vibe)

Canvas `.preview` `[mockup]`: `max-width:940px` (live caps the SVG at 600 — `[reconcile]`),
`height:340px`, radius 22px, `overflow:hidden`, `1px --line`, ground = the `.preview`
radial from A.3, shadow `0 30px 70px -42px rgba(58,40,16,.55)`.

**Sparseness rules** `[mockup]`, stated as hard constraints:
1. **Exactly ~4 marks.** Not a dense field. The mockup places 4.
2. **All circles.** No hex, no diamond (per decision 1).
3. **Varied sizes, not uniform.** Mockup boxes: **84, 66, 54, 48px** — a deliberate
   size spread (≈1.75× from largest to smallest).
4. **Asymmetric placement, lots of negative space.** Mockup positions (as % of canvas,
   each mark's center): `(30,42) (62,34) (72,64) (40,70)`. Clustered upper-left + lower
   spread; the right and top-left corners are empty.
5. **Exactly ONE thin resonance thread** `.ed`: `left:30% top:42%`, `width:230px`,
   `rotate(-10deg)`, height **1.5px**, `linear-gradient(90deg, transparent,
   rgba(150,110,40,.7), transparent)` — a hairline that fades at both ends.
6. **"the question" floats off-center** `.qtt`: serif *italic* 24px `#7a4f10`, behind a
   soft halo `.qh` (here 300×300, `radial-gradient(circle, rgba(133,79,11,.2),
   transparent 62%)`, `blur(6px)`). It is a *label in the field*, not a centered title.
7. **No legend, no hint, no control bar, no Yumi ring** on the home embed. It is the
   quiet preview. (Live correctly suppresses the legend here via `showLegend:false`.)

## C.3 ARCS FULL VIEW — comp-v2

Canvas `.cstage` `[mockup]`: `height:540px`, radius 16px, `overflow:hidden`,
`1px --line`, ground = the `.cstage` radial from A.3 (lighter center, **still goldenrod
family** — not cream; see guardrail).

### Control bar `[comp-v2]` `[reconcile]`
Top bar: arc title (`.at` serif 500 24px `--ink-1`) on the left; controls on the right.
**comp-v2 controls = `+ Sub-theory · Connect · Layers ▾ · Reset`.**

- The **Layers** control is a dropdown opening a panel of **independent TOGGLE
  SWITCHES**: `Books`, `Marginalia`, `Faint links`. **Resonance is always-on** — it is
  the spine and has no toggle.
- Toggling a layer **fades it in/out on the same easing as the rest of the app — no
  reflow, no flash.** Marks don't move when a layer toggles; the layer just resolves in
  or out.
- **⚠ This is the drift to fix:** the live app renders these as **solid gold buttons**
  (mockup's older bar was `+ Sub-theory · Connect · Books · Reset` with a solid gold
  `+ Sub-theory`). Conform toward comp-v2 toggle switches, not buttons. The mockup's old
  Arcs markup (HTML lines 166, 176) is **superseded** by comp-v2.

### Marginalia dots `[comp-v2]`
One dot per note/quote attached to a sub-theory:
- **hollow = gathered** (attached, not yet woven into the prose).
- **filled = incorporated** (cited into the sub-theory).
Mockup `.gath` = 15×15, `border-radius:50%`, `2px solid --teal`, opacity .9 (the hollow
gathered dot). Incorporated = the filled counterpart. (Live: incorporated stays dormant
until Stage 10 supplies `proseAnchor` data — render gathered now, incorporated when data
exists; **never fake the data.**)

### Books layer `[comp-v2]` / `[mockup]`
Quiet gray rounded-rect glyphs `.bookg` = 22×28, radius 3px, `rgba(110,85,45,.2)` fill,
`1px --line`, on gray dotted tethers. A book feeding 2+ sub-theories renders **once** and
bridges them. Toggled by the Books layer switch.

### Edges `[mockup]` / `[live-impl]`
- **Resonance** (always-on spine): solid tan thread. Mockup `.ed` hairline = 1.5px,
  `linear-gradient(90deg, transparent, rgba(150,110,40,.7), transparent)`. Live token:
  `--thread-color #B89A62` solid, width ~1.4, opacity ~0.85.
- **Faint links** (toggleable): dashed, `--thread-color-faint #C9B68A`. (Creation UI for
  faint/speculative edges needs a schema flag — deferred; render when data exists.)

### Legend + hint `[comp-v2]`
Legend `.leg` = mono 10px `.08em` `--ink-3`, bottom-left. **comp-v2 = 5 items:**
`resonance · faint · gathered · incorporated · book`.
**⚠ drift:** the mockup's old Arcs markup shows only **3** (`resonance · gathered ·
book`) and that's what live carries — conform to the 5-item comp-v2 legend.
Hint text `[comp-v2]`: `drag · connect two sub-theories or attach a book · hover for a
card`.

### Yumi presence `[mockup]`
`.yum` upper-right (`right:6% top:14%`): a 54×54 circle with a **1.5px dashed**
`rgba(29,143,104,.7)` ring, label `.nm` serif italic 15px `--teal` "Yumi" beneath. A
present, noticing entity — dashed (provisional), not a hard node.

### "the question" `[mockup]` `[reconcile]`
Center-ish label `.qtt` serif italic 24px `#7a4f10`, over the soft `.qh` halo
(`radial-gradient(circle, rgba(133,79,11,.2), transparent 62%)`, `blur(6px)`).
**⚠ drift:** live prints the **arc title** at center (18px, opacity .82); the mockup
wants the literal words **"the question"**. Fix the center label.

### Motion `[comp-v2]`
- Marks **drift slowly** on GPU transforms (continuous, gentle). Live is currently a
  static deterministic radial layout — **drift is a to-add.**
- **Hover** lifts a mark, brightens its lines, and shows a card. (Hover card exists live,
  9.6c.3 — keep it; add the lift + line-brighten.)
- **Selecting** a mark settles it open into its sub-theory page. (Tap-to-open exists.)
- **Honor `prefers-reduced-motion`:** no drift, no lift animation when set.
- Layout authorship is the **user's** — the app gives a composed default + opt-in drag;
  it **never auto-reflows** the arrangement.

---

## C.4 Drift checklist (what conformance must close)

| # | Drift | Target |
|---|---|---|
| 1 | mixed silhouettes (circle/hex/diamond) | circle-only |
| 2 | dense/even layout | sparse + asymmetric (home: ~4 marks, varied size, 1 thread) |
| 3 | Layers as solid gold buttons | independent toggle switches (Resonance always-on) |
| 4 | 3-item legend | 5-item legend (resonance·faint·gathered·incorporated·book) |
| 5 | center label = arc title | center label = "the question" |
| 6 | static layout | slow GPU drift, reduced-motion honored |
| 7 | home SVG capped at 600 | mockup canvas 940 (reconcile cap) |
| 8 | live theme.css token values | mockup token table (Part A) |
| 9 | home CTA "Browse your shelf" | "Take the tour" |
| 10 | Yearning reg-tag "MEMOIR" | "Critical theory" (data, Stage C) |

---

*Conform staged, one component at a time: recon (read live values) → build → live-verify
on praxis-reading.netlify.app. Never a bulk "apply to all pages" swing.*
