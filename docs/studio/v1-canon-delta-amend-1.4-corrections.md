# Canon amendment 1.4 — corrections made in L1.1 (2026-10-28)

`v1-canon-delta-amend-1.4-tokens.md` is kept byte-for-byte as received (59,739 B, md5 `7f5918e0…`). Where L1.1's
rulings changed what it says, the correction is recorded here; **where the two disagree, this file governs.**

1. **§1 `--gold` — "FILL for what you press: the primary button, the active segment, the reading dot".** Corrected
   (Preston, 28 Oct, M1): a SELECTED segment / chip / tab / register is an **`--ink` fill with `--page` text** — Day
   Three's on-states (`.vfseg`, `.modes`, `.chips`, `.seg`). Gold is the one primary action pill on a screen. Text on a
   gold fill is `--on-gold`.
2. **§6 `--glass-spotlight → var(--umber)`.** Superseded by §7 ("`.spotlight-panel` follows the mood"):
   `--glass-spotlight → var(--page-2)`.
3. **§5 rule 1 (labels on `--page-3` at 3:1)** — narrowed (Preston, 28 Oct): the 3:1 allowance is for kicker / count /
   meta labels of 11px+ only. Control labels, tab labels and body text on `--page-3` take `--ink`.
4. **Pairing methods (Preston, 28 Oct; the L1.1 red-team BLOCK).** A name §6 maps to a mood-FIXED value must not be paired
   with a mood-FLIPPING partner. M1 text on a gold fill → `--on-gold`; selected state → `--ink` + `--page`. M2 an
   `--ink` fill → `--page` text. M3 `--br-deep` text on paper → `--ink`; text on a `--br-deep` fill → `--on-night`.
   M4 a translucent dark fill under ink text is a sunk fill (`--page-3`), not a veil. M5 a danger fill → `--gold` +
   `--on-gold` (ruling C). M6 as item 2. M7 gold as text on paper or on a gold wash → `--gold-ink`; Yumi's colour is
   never a text colour (her words → `--ink-2`).
5. **§8** — `color-scheme` follows the mood in CSS (`dark` at `:root`, `light` in the day block), so the UA's own
   controls follow the chosen mood, not the OS.

6. **M8 and M9 (Preston, 28-29 Oct).** M8 — the extended sweep: the states a resting-route sweep never renders
   (signed-out, ceremonies, intro panels, each capture-door register, About, Spotlight) are swept too (`l1.md`, "Extended
   P4 (M8)"). **M9 — a room on a fixed light LITERAL ground takes the day token values in both moods** (L1.2, 29 Oct).
   A theory room whose ground is a literal Q1 left untouched (the Arcs list `.arcs.lum-amber-deep`, light paper; the arc
   interior `.arcfield`, warm-dim) must not pair it with a mood-flipping shared token — at night `--ink` turned light on
   light paper (the Arcs title 1.01:1). Method: the room's selector joins the first day block (`html[data-mood="day"]`)
   AND the §6 alias list (`:root, .yumi-panel, .yumi-bloom, …` — an alias resolves where it is declared, so the core values
   alone would leave `--card-ink`, `--surface`, `--border`… at night). Never the `auto` block: it sits inside a media
   query. The room then renders its Day look in both moods; theory tokens and literals stay untouched. The day block's
   non-token lines ride in with it (`color-scheme: light`, `--lamp`, `--sky-a/-b`, `--spill`, `--grain-*`, `--bl-*`,
   `--shadow-float`, `--scrim`) — measured harmless in both rooms. Proof: every text pair on #arcs and #arc/<id> at or
   above floor in both moods (`l1.md`, L1.2a P5).

7. **§10 ruling A — the flat pass, AS AMENDED (Preston, 29 Oct, L1.2b).** backdrop-filter → 0 (all 20). Gradients:
   only §1's `--lamp`, `--lamp-foot`, `--pool`, `--spill` remain as definitions; consumer gradients go flat by role —
   gold controls → `--gold`; gradient-clipped titles → `--ink`; lines and marks → their own colour; glows → `none`
   unless one matches a §1 light (none did); a fill → its darker stop, and where the darker stop flips with the mood →
   the stop the surface's role names (so a surface is one role in both moods). Kept as drawings, not fills: the
   `.k-select` chevron, the `.mc-cell.is-taken` hatch, `.cover-unknown` stripes, the shelf's cavity lines, and the two
   scroll / action-bar fades (`.pf-strip-wrap.overflow::after`, `.intro-journey .ij-actionbar`). Theory and camera
   gradients untouched (rails). Shadows: only what floats takes `--shadow-float`; cards `--card-hi`; covers
   `--shadow-cover`; rings / bars drawn as shadow stay (borders); glows → `none`. Motion: literals → `--ease`, `--dur`
   (230–599ms), `--dur-half` (under 230ms); loops of 600ms or longer keep their durations; one global reduced-motion
   guard SHORTENS (0.01ms, one iteration) and never sets `animation:none` / `transition:none`, so end events fire.
   **`button{font:inherit}` is DROPPED** — it resized 88 controls (a layout change); `font-family:inherit` stays and
   each non-DM-Sans button's own `font-family` → `var(--font-body)`. Applied table: `docs/checkpoints/l1-flat.md`.
8. **Title-role button exemptions (Preston, 29 Oct) — buttons that stay in the display serif.** A button whose role in
   Day Three is a TITLE keeps `var(--font-serif)` (= `--font-display`, Fraunces); a later sweep must not move it to DM
   Sans. The list (each keeps `var(--font-serif)`):
   - `.shelf.lum-amber-deep .cavity-band-hd button.label` — the shelf's category headings ("Education", "Theory &
     Philosophy"; Day Three `.bnd .bh .bhbtn em`, serif 500).
   - `.arcfield.af-world .af-q` — the arc's question: an `<h1>`, the arc's title (role=button only for its owner, to edit).
   - `.arcfield.af-world .af-invite` — the line that holds the same title slot while an arc has no question.
   - `.desk-question.is-authored .desk-question-line` — the question the reader carries, once written (Day Three
     `.desk .carry`, the display serif). **Flagged for Preston's felt pass:** it is the reader's words rather than a
     title in the strict sense; its unwritten prompt ("Tap to carry a question.") follows the DM Sans rule.
   Not buttons any rule reaches: `.shelf .shelf-filter`, `.shelf-sort-btn`, `.account-retro-btn` (no renderer in js/).
   The camera's `.scan-draftbar-btn` stays mono with the camera surface (untouched, as its gradients). The proof is a
   RULE census (every font rule whose subject is a `<button>` / role=button class in js/ — what is left is this list +
   the camera + three `font:inherit` rules that inherit the body face) AND the live probe: buttons not in DM Sans on
   the 18 routes + the lens sheet at 390 and 1360 = the shelf headings only.

Records: `docs/checkpoints/l1.md`, `docs/checkpoints/l1-tools/pair-spec.tsv`.
