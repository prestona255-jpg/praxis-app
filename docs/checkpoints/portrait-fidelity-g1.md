# Portrait Fidelity — GROUP 1 (pure-additive styling/typography sweep) · BUILT, VERIFY PASS

**Date:** 2026-06-24 · **Lane/worktree:** `peaceful-joliot-2f5c97` @ base `bcdce38` (v3.143).
**Files:** `js/views.js`, `assets/components.css`. **NOT shipped** (no CACHE_VERSION bump yet; awaiting Preston's "commit and push"). No DOM order changes. Umbrella preserved.

## Edits (8 changes across 7 sites)

| # | File:loc | Fidelity item | Before → After |
|---|----------|---------------|----------------|
| E1 | views.js 13443 | COUNTS eyebrow-hint split | `'eyebrow'` + baked string → `'eyebrow account-values-eyebrow'` + base textnode `'your reading life '` + `span.hint '— tap to open it here'`. (Adopting `account-values-eyebrow` is REQUIRED for the `.hint` flip [rule scoped to `.account-values-eyebrow .hint`] and also recolors the eyebrow `--ink-3`→`--gold` + margin `0 0 11px` — a deliberate, visible change matching the mockup's uniform gold section eyebrows.) |
| E2 | components.css 10170 | Hero name size | `font-size:30px; line-height:1.1` → `35px; 1.04` |
| E3 | components.css 10171 | Hero tagline | add `font-size:18px`; `color:var(--muted)` → `var(--text-d)` (brighter ink, per mockup descriptor) |
| E4 | components.css 8191 | "Your data" covenant | `font-size:18px; color:var(--ink-2)` → `19px; var(--text-d)` |
| E5 | components.css 8239 | Stat-card chevron | `14px; color:var(--gold-text)` → `11px; color:var(--gold); opacity:.5` |
| E6 | components.css 7103 | Stat grid | `display:flex; flex-wrap:wrap; gap:14px` → `display:grid; grid-template-columns:repeat(4,1fr); gap:13px` (desktop-first base; the existing `<760` rule still steps to 2-up — canon §3) |
| E7 | components.css 7592 | Galaxy deep-space | center `color-mix(--surface-d 40%, --sunk-d 60%)` + mid `--sunk-d` → center `color-mix(--br-deep 70%, --sunk-d)` + mid `--br-deep` (near-black, not brown; edge `--scrim` + inset shadow unchanged; specks already present) |
| E8 | components.css after 7301 | Portrait card radius | NEW additive rule: `.account .account-values-card, .account .portrait-{field-wrap,galaxy-wrap,returns,threads,journey,capstone} { border-radius:var(--radius-lg) }` (16px ≈ mockup 17px; 1px gap deliberately not a new token) |

## VERIFY battery — ALL PASS

| Gate | Result |
|------|--------|
| Byte deltas (measured both ends) | views.js 635348 → **635550 (+202)**; components.css 371160 → **372008 (+848)**. Additive; the +848 = two explanatory comment blocks (E6/E7) + the 7-selector E8 rule. |
| EOL integrity (no flip) | `git diff --stat` = views 8 lines / components 42 lines (small localized diff, NOT whole-file). CRLF lines = total lines in BOTH files (14462/14462, 10489/10489) → zero bare-LF introduced. |
| cscript JScript parse (views.js) | **PARSE: PASS (635550 chars)** via `.claude/parse-check-views.js`. |
| Banned-token gate = baseline | Diff-based (definitive): **no added** const / let / `class` keyword / `=>` / `.catch` / `.finally` / backtick. (Whole-file backtick "0→6/10" was a buggy-baseline artifact — baseline grepped `\`` not `` ` ``; backticks pre-exist in comments; my added lines have none.) |
| No new hardcoded hex | No `#hex` in any declaration; the only `#hex` on an added line is inside a **comment** documenting the mockup color↔token map (allowed, canon §1). Declarations are token-only. |
| CSS scoping (anti-bleed) | All added selectors are `.account .portrait-*` / `.account .account-values-card`; value edits hit existing `.account`-prefixed rules. No generic/unscoped selector added. |
| Copy parity | COUNTS eyebrow text byte-identical (`your reading life ` + `— tap to open it here`, em-dash intact). Full portrait verbatim sweep = already faithful (curly `'`, em-dashes, `＋`, `…` all correct; zero ASCII substitutes in portrait copy). |
| Umbrella intact | 4 portrait catches present (VALUES 13315 / REVEALED-SELF 13833 / JOURNEY 13862 / CAPSTONE 13963; +4-line shift from E1 expected). E1 edit is OUTSIDE the umbrella (stats eyebrow always was). Non-portrait code untouched. |
| Dirty-file scope | Only `js/views.js`, `assets/components.css` (M) + untracked `docs/checkpoints/portrait-fidelity-{recon,g1}.md`. No stray files. |

## Items VERIFIED with NO edit needed (part of G1's plan)
- **Verbatim chrome sweep** — portrait copy already uses curly apostrophes + em-dashes + `＋`/`…`; the only ASCII `...` is `'Saving...'` (profile-save status, not a mockup string — left alone).
- **Movement divider** — `.account .account-revealed` already = `margin-top:42px` + 1px top hairline (correct geometry; line token `--border` vs mockup faint-gold is an acceptable low-sev mapping).
- **Reduced-motion star settle** — handled in JS (stars seed at final position/opacity when `reduceMotion`; no FROM state to animate). Capstone breathe disabled in the CSS reduced-motion block (8183).
- **Galaxy specks + inset shadow** — already present (7617 / 7602); only the gradient needed deepening.

## Residuals (not G1 defects)
- **Focus-ring teal** — portrait interactives (stars/chips/stones/seg) have no explicit `:focus-visible` teal ring; low-severity accessibility nicety, not a flagged visual gap. Defer (confirm/decide later).
- Galaxy deepen + all typography/treatment bumps are **Preston's visual comp-gate** on the live screenshots after push.

## STATUS
G1 built + mechanically verified. **HALTED for Preston's eyes-on.** Live smoke is the real gate; it runs after his explicit "commit and push" (single `CACHE_VERSION` bump v3.143 → next at that point). G2 (hero: monogram, stance line, ✎, email relocation) is next, unstarted.
