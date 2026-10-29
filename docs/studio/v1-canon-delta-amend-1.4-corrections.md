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

Records: `docs/checkpoints/l1.md`, `docs/checkpoints/l1-tools/pair-spec.tsv`.
