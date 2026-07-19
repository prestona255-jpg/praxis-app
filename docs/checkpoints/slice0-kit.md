# R-POLISH SLICE 0 — STAGE 3 — THE FOUNDATION KIT (rig-demoed) → PASS

New files (docs/, NOT wired into the app — B1–B4 adopt per SEQ-1, one touch per page):
- `docs/studio/kit/praxis-kit.css` — the kit: SYS-1 `--space` scale + per-tier grid · TY-1 ramp tokens+classes ·
  C-patterns control canon (CC-1..4, carved grammar) · MO-1 motion tokens + six moments · people components.
- `docs/studio/kit/kit.html` — the demo rig (both grounds).
Consumes app token NAMES (theme.css) so it is drop-in. CSS-only; no app view touched.

## Byte bands (declared before writing)
- praxis-kit.css: NEW, estimated 7–9 KB. Actual: measured at commit (report below in END REPORT).
- kit.html / l3-proof.html: NEW rig pages, no band (proof artifacts, not app source).

## What the kit implements (to the brief §2 laws)
- **SYS-1** `--space-3xs…3xl` (2→64) + per-tier `--grid-cols` (4/8/12 at base/760/1600) + `--measure` (66/70/72ch).
- **TY-1** 5-role ramp tokens + classes: display/title/heading/body/meta + the **reader's-words** register
  (`.ty-reader` — own register, UPRIGHT, finest setting) + Cormorant ≥24px floor (`.ty-title--sm` → DM Sans) + 12px meta floor.
- **C-patterns**: `.k-field` carved grammar (inset recess) for input/search/textarea/select · `.k-listbox` (CC-1 house dialect ≥760, native styled <760: 16px no-zoom / 44px touch) · `.k-chip` (CC-3 state/toggle) · `.k-seg` (ONE segmented style, retires the 6) · `.k-btn` primary-gold/secondary/quiet · `.k-toggle` · `.k-dashed` (+ mark a value) · `.k-destructive` (quiet/cornered).
- **CC-4 states** (verified live below).
- **MO-1**: `--dur-fast 150ms` / `--dur-gentle 300ms` / `--ease-standard` + six moments (`.mo-hover/press/reveal/crossfade/savepulse`) + one global reduced-motion kill.
- **People**: `.k-term` (UX-1 lexicon) · `.k-breadcrumb` (UX-2 Arc › Sub-theory · state) · `.k-toast` (UX-3 undo/soft-delete) · `.k-pending` (pending/syncing/saved/failed write indicator).

## LIVE demo evidence (localhost:8790/docs/studio/kit/kit.html, CSSOM)
All 14 component types render: listbox 1 · select 1 · input 5 · textarea 1 · chip 5 · seg 2 · btn 7 · toggle 1 ·
dashed 1 · destructive 1 · term 2 · breadcrumb 1 · toast 1 · pending 3. Console clean.

### CC-4 states law (each verified)
| state | evidence | verdict |
|---|---|---|
| focus-visible ring — LIGHT | rule `2px solid var(--gold-deep,#855410)` → resolves **#855410** | PASS |
| focus-visible ring — DARK | `[data-ground=dark]` override `var(--gold,#d2a23e)` → resolves **#d2a23e** | PASS (both grounds) |
| hover — ground shifts one step | `.k-field:hover{background:var(--surface-2)}` present | PASS |
| disabled — 40% ink, no pointer | computed opacity **0.4**, pointer-events none | PASS |
| error — ONE treatment | is-error border computed **rgb(194,96,58)** = `--danger #c2603a` | PASS |
| destructive — quiet/cornered | `.k-destructive` danger-ink, transparent, confirm-gated (copy) | PASS |

### MO-1 motion + reduced-motion
| check | evidence | verdict |
|---|---|---|
| tokens resolve | fast **150ms** · gentle **300ms** · ease **cubic-bezier(.22,1,.36,1)** | PASS |
| six moments present | hover/press/reveal/crossfade/save-pulse classes wired | PASS |
| reduced-motion kill | `@media (prefers-reduced-motion: reduce)` present; declares **transition:none / animation:none** on the motion + control classes | PASS (match-test; pane can't emulate `reduce`) |

**VERDICT: kit PASS.** Felt/visual polish is Preston's eyes-on (VISUAL GATE). Red-team (Sonnet) runs before commit.
