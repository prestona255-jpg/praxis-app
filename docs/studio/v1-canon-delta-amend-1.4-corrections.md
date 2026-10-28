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

Records: `docs/checkpoints/l1.md`, `docs/checkpoints/l1-tools/pair-spec.tsv`.
