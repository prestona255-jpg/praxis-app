# MICRO-239 — MANIFEST-WARM + B-M-SA + MASK-SHELL (one slice, v3.239)

STARTED 2026-07-21. Model Opus 4.8, gate agents Sonnet. HEAD 852577c / v3.238.
One commit closing three launch-runway ledger rows; sw.js bump v3.239; self-running
with commit pre-granted, HOLD at the push word. Records here per FIX-PROTOCOL §1/§6.

## Stage-0 recon — anchors confirmed

### Slice 1 — B-M-SA (MECHANICAL, proven pattern)
- Anchor: `assets/components.css:7010` `.subtheory-rail.subtheory-rail-mobile-open`;
  the target line is **:7018 `padding: 24px 16px;`** (fixed `bottom:0` sheet, `overflow-y:auto`).
- Edit: `padding: 24px 16px calc(24px + env(safe-area-inset-bottom));`
  + add `-webkit-overflow-scrolling: touch;` (the momentum rider — it's overflow-y:auto).
- Prior-fix check: MW-3 built this mobile-open block; the edit sits ON the padding line
  BESIDE MW-3's work — no shared name, no collision. Proven pattern: B-M shipped the
  identical `calc(24px + env())` treatment on the Bloom orb + Shelf select-bar.
- Felt delta (390): the mobile evidence bottom-sheet's last row clears the home indicator.

### Slice 2 — MASK-SHELL (MECHANICAL)
- Anchor: `sw.js:12-39` APP_SHELL. `/assets/icon.svg` present (:20); **`/assets/icon-maskable.svg`
  NOT present** — confirmed by read. Add it after `icon.svg`.
- Bump `CACHE_VERSION` `praxis-v3.238` → `praxis-v3.239` (:10).
- Felt delta: none owner-visible (precache/offline coverage only — infrastructure, no felt pass).

### Slice 3 — MANIFEST-WARM (FORK — Preston's call, surfaced under FORK-VERBATIM)
- Anchor: `manifest.json:6-7` `background_color` + `theme_color` = **`#191F33`**.
- **The recon overturns the residual's premise.** `#191F33` is NOT a "pre-amber leftover" —
  `theme.css:38` `--ground: #191F33` wires it to the dark-ground primitive, and THE HOUR
  (v3.232) makes the ground a **twilight ARC gradient**, not a flat color:
  `--hour-1 #191F33` (zenith, night blue) → `--hour-2 #1B1D2B` (turn) → `--hour-3 #241C14`
  (warming) → `--hour-4 #29200F` (horizon, ember brown) [theme.css:94-100]. The manifest hex
  is exactly the **zenith (coldest) stop** — hence "flashes navy". A flat splash color cannot
  be the gradient, so "the warm ground" = a felt pick among the arc's warm stops (or the icon
  ground). Owner-visible splash + felt delta → owner-viewport primacy → **Preston picks the hex.**
- FORK 3a — WHICH warm hex (candidates):
  - `#29200F` (hour-4, ember-brown horizon) — the app's own warmest ground note; the literal
    warm END of "the warm ground" Preston named. **RECOMMENDED.**
  - `#241C14` (hour-3, warming) — a mid-arc warm brown, subtler.
  - `#3a2410` (icon-maskable ground) — matches the installed icon's field exactly (splash↔icon
    continuity). Note: `icon.svg` (the "any" splash icon) has NO ground rect — it's transparent,
    so `background_color` IS the field the crest floats on.
- FORK 3b — SCOPE: a **second theme-color site**, `index.html:6`
  `<meta name="theme-color" content="#191F33">`, at the same navy — OUTSIDE the stated
  "manifest.json" scope. Left navy, the browser-TAB chrome stays navy while the installed-PWA
  chrome goes warm (inconsistent). Include it (coherent) or hold to manifest-only (literal scope)?

## Scope / files (pending the fork ruling)
`manifest.json` · `assets/components.css` · `sw.js` (+ APP_SHELL + bump) · `docs/launch-runway.md`
(flip the 3 ledger rows) [· `index.html` IF FORK 3b = include]. NON-GOALS: no other CSS, no
data/state, foundations untouched, prestona255 read-only.

## FORK RULED (Preston, 2026-07-21)
- 3a HEX = **`#29200F`** (ember horizon, hour-4) for BOTH manifest tokens.
- 3b SCOPE = **INCLUDE `index.html:6`** meta theme-color → `#29200F` (browser-tab chrome warm too).
- Final files: `manifest.json` · `index.html` · `assets/components.css` · `sw.js` (+APP_SHELL +bump v3.239)
  · `docs/launch-runway.md` (flip 3 rows). Proceeding to build → red-team → reviewer → commit (pre-granted) → HOLD push.

## Stage-1 build log — all slices landed, checks GREEN

Edits:
- `manifest.json` — `background_color` + `theme_color` `#191F33` → `#29200F` (replace_all; 2 sites). JSON re-parses; maskable icon intact.
- `index.html:6` — meta theme-color `#191F33` → `#29200F`.
- `assets/components.css:7021` — `.subtheory-rail.subtheory-rail-mobile-open` padding → `24px 16px calc(24px + env(safe-area-inset-bottom))` + `-webkit-overflow-scrolling:touch` + a 3-line rationale comment. `viewport-fit=cover` confirmed present (index.html:5), so env() resolves.
- `sw.js` — `CACHE_VERSION` v3.238 → **v3.239**; `/assets/icon-maskable.svg` added to APP_SHELL (:22, after icon.svg). File exists (**2,363 B** SVG, measured `wc -c`; shipped B-M).
- `docs/launch-runway.md` — the 3 ledger rows flipped to ✓ SHIPPED v3.239; corrected the stale "pre-amber leftover" premise.

Checks:
- parse-gate `sw.js`: **PARSE OK**. `manifest.json`: **PARSES OK** (bg+theme `#29200F`, 2 icons, maskable wired).
- Greps: manifest `#29200F` ×2 / `#191F33` ×0 · index.html `#29200F` · sw.js v3.239 + icon-maskable:22 · components env line :7021.
- Foundations MD5 UNCHANGED: lumen-amber `070679b0…` (14,966 B) · marks `772886c0…` (10,255 B).
- Dirty set = 5 intended tracked files + this recon (untracked).
- **BYTE DELTAS (LF-normalized, `git show HEAD:<f>|wc -c` vs `tr -d '\r'`):** manifest.json **+0** · index.html **+0** · sw.js **+31** · components.css **+315** · launch-runway.md **+779** (grew on the correction pass's OV-3/OV-4 rows). *(Correction: the first draft mislabeled the `--numstat` LINE counts "13 ins / 8 del" as "byte deltas" — the reviewer's Gate-3 catch, the 4th recurrence of that slip on this repo. These are the real bytes, correctly labeled.)*
- **Byte FLOOR (§1:56) — not pre-stated in Stage-0 (honest gap, red-team F5 / reviewer process note).** Recorded, not back-derived: the code delta is trivially bounded (color swaps = +0, one env() padding line + comment, one APP_SHELL string + a version char), which the measured +0/+0/+31/+315 confirms.
- EOL: `sw.js` + `launch-runway.md` show `w/lf` (Edit-tool CRLF→LF flip). **Non-blocking** — both HEAD blobs are already pure LF (`git show HEAD:<f>|tr -cd '\r'`=0), so the flip is immaterial to what commits (CLAUDE.md practical-floor clause). Other 3 files keep natural `w/crlf`.
- Tier: NON-data-loss (chrome color + CSS padding + APP_SHELL entry + version bump + docs). Commit pre-granted by Preston → self-commit on green gates, HOLD at push.

## Gates (red-team + reviewer) — RUN, findings addressed

**§1#8 RECON-VALIDATION GATE — NOT run before build (honest gap, red-team F4).** I went Stage-0 recon → Stage-1 build directly. Low practical risk here (a mechanical 3-slice chrome/PWA change), and the pre-commit red-team below independently re-derived and CONFIRMED every Stage-0 anchor (the hex math, the env pattern, file existence, dead-selector claim), so the recon is validated post-hoc — but the gate itself was not run in sequence, recorded truthfully.

**fix-red-team (Sonnet):** re-derived and confirmed sound — the hex math (`#191F33`=zenith / `#29200F`=`--hour-4`), env() pattern == shipped Shelf/Bloom uses, `viewport-fit=cover` present, `icon-maskable.svg` exists + well-formed, parse-gate self-validates + PASS, foundations MD5 unchanged, byte/grep counts reproduce, no EOL-flip-that-matters, no scope drift, no ES3 violation, no `.st-gutter` bleed. Findings: **F1 (blocks) OV cross-ref dangling** → FIXED (OV-3/OV-4 added). F2 852-B guess → FIXED (2,363 B). F3 `:7018`→`:7021` cite → FIXED. F4 recon-gate + F5 byte-floor → recorded above.

**praxis-reviewer (Sonnet): HOLD → all blocks addressed.** Independently re-verified the code as exact, scoped, matching the ruled fork verbatim, safe to ship. Blocks: (1) byte-delta mislabel → FIXED (true deltas above); (2) ledger OV self-contradiction → FIXED (OV-3/OV-4); (3) red-team unrecorded → FIXED (this section). Non-blocking disclosed: EOL flip (floor applies), `:7018` cite (fixed), and the reviewer's own brief cited a STALE lumen-amber baseline (14,681 B) — the file correctly matches the ruled 14,966 B / `070679b0…` re-baseline (FIX-PROTOCOL:94-97); the brief was stale, the file is right.

**Both gates' code verdict: exact + safe. All blocking findings were paper-trail, now corrected.** → self-commit (pre-granted) → HOLD at push.
