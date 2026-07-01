# Wave 7 · Surface B — Import/Capture modal → `.lum-amber-deep` (BUILD)

Source: `design/Wave 7 …zip → import-amber.html` (look ref; tokens wired from
`lumen-amber.css`). Disposition: **reskin the live `import-capture.js` modal in place**;
segmentation/dictation/cap/timeout logic byte-identical. Recon: read-only 3-agent fan-out
(wf_f28c66a0-a88) + own reads.

## Approach — scoped token remap (not 50 per-selector overrides)
The `.ic-` block (components.css 10322–10594, ~272 lines) is **theme-token-only, zero raw
hex**. So one ADDITIVE block remaps the theme COLOUR tokens → `--lum-*` scoped to
`.ic-overlay.lum-amber-deep`; every existing `.ic-` rule (entry / paste / processing /
receipt / queue / dictation / filed) recolours at once by inheritance. Non-colour tokens
(`--radius/-font/-motion/-shadow`) left as-is. Plus: panel = solid `--lum-bg` (overlay-solid,
no backdrop-filter — iOS rule), a sunken paste/search field, and the **coral Amber-warning**
on the flagged/exception card + needbar. JS: overlay root `el('div','ic-overlay')` →
`'ic-overlay lum-amber-deep'` (+2-line comment) — the ONLY JS change.

## Mechanical gates

| Gate | Expected | Actual | Verdict |
|---|---|---|---|
| components.css Δbytes | +2000 ±1000 → [1000,3000] | **+2178** | PASS (in band) |
| import-capture.js Δbytes | +300 ±400 → [-100,700] | **+191** | PASS (in band) |
| components.css braces | balanced | 2543 / 2543 | PASS |
| components.css parens | balanced | 4734 / 4734 | PASS |
| **Freeze list byte-identical** | logic untouched | git diff = 1 hunk, ONLY the overlay className+comment (L401-405) | **PASS** |
| EOL (git i/w) | i/lf w/crlf (no flip) | i/lf w/crlf | PASS |
| Foundation lock | 14681 / 10255 | 14681 / 10255 | PASS |
| dirty set | components.css + import-capture.js | + yumi-ui.js (Surface A held) only | PASS |

Freeze list proven untouched (function-level diff): segmentDoc (129-159), SEG constants
(28-64), parseJSON (85-98), coerceSegments (102-123), collectText (68-81), transcribeBlob
(1028-1072, the 20s TRANSCRIBE_TIMEOUT_MS/AbortController), recordAndTranscribe (1082-1135),
pickAudioMimeType, canRecord, commitEntries (260-317), matchBook (191-225), runImport,
processDictation, the ownsEntry/flip/file/undo mutators — all byte-identical.

## Render-and-look — PASS (desktop 1280×800 + true 390×844 CDP)
Server `praxisapp-w7` :8761. SW + caches cleared before reload (SW was serving the cached
pre-edit JS — caught it: overlay class came back `ic-overlay` until the clear; after, it is
`ic-overlay lum-amber-deep`). Network blocked + motion stilled for stable frames.

Live-DOM proof (computed):
- overlay class = `ic-overlay lum-amber-deep`; `.ic-panel` background = lum-amber-deep radial
  (opaque), no backdrop-filter (overlay-solid).
- `.ic-cta` background = `linear-gradient(rgb(255,231,154), rgb(255,206,74))` = `--lum-gold-l→--lum-gold`.
- Flagged exception: `.ic-qcard` border = `--lum-coral` (rgb 255,154,110) @45% + 7% coral wash;
  `.ic-needbar` border = coral @50%; quote in Cormorant serif; guess chips `--lum-ink`.
Screenshots: entry (desktop), entry (390), flagged-exception (desktop) — serverId 0755c3e8…,
inline. Console clean.

### Deliberate divergences (logged — "reskin, engine held")
1. Structure stays the live **dictation-first entry** (mic hero + "or" + paste/upload pills),
   not the mockup's 4-tab row. "Talk to Yumi" **is** the dictate mic — there is no separate
   talk-chat tab. Recoloured in place, not rebuilt.
2. Panel is SOLID `--lum-bg`; the mockup's `backdrop-blur` is dropped (overlay-solid iOS rule).
3. Flagged-exception uses `--lum-coral` (amber-caution) per the brief's "Amber warning",
   not the mockup's `--lum-rose` (error pink).
4. `--text-on-dark` remaps to `--lum-gold-ink` (dark) on ALL light fills (gold + cyan) — reads
   better than the mockup's white-on-cyan; a minor, intentional unification.
5. Receipt / queue / dictation-listening states recolour via the same inherited remap (verified
   the exception/flagged state directly; the others inherit identical tokens — not separately
   screenshotted because reaching them needs live segmentation/mic).

## HOLD — awaiting Preston's eyes-on
No commit (single wave commit held for A+B+C). CACHE_VERSION still v3.160 (→ v3.161 at ship).
