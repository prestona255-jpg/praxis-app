LC2-b STARTED 2026-11-26

# LC2-b — the sky to the top on a phone's Home (v3.345)

Size SMALL by BETA.md (look only: nothing saved, synced, signed in, deleted or exported changes). One stop: the commit
gate. Applied byte for byte from the build chat's `lc2b.patch` (cut on f6dc239). Executor: Claude Code, Opus 5.5.

## The ruling (Preston, 26 Nov 2026, from his phone check of LC2 on v3.344)
Home "looks good but the top brown space throws me off". He chose "sky to the top" over closing the gap only, and "sky
only" for this build's scope. Phones only (759 px and narrower), Home only, the blue sky only.

- B1 The 30 px gap above Home's sky goes.
- B2 The sky slides up under the praxis bar. `--sky-top` (72 px plus the top inset) is taller than the bar on purpose: the
  spare runs off the top of the page, so the sky can never start short of the top.
- B3 The bar is see-through on Home, the wordmark and the Search pill in the sky's text colour with the sky's soft dark
  edge.
- B4 The status strip (`#statusbar-scrim`) is the sky's blue while Home's sky is under it, and the page colour again once
  the sky has scrolled past. Flat blue, not see-through, so text never slides under the clock (the build chat's call).
- B5 js/views.js sets `<html data-sky-top>` with one IntersectionObserver on Home's sky host (rootMargin -60px at the
  top). No scroll listener. components.css is the only reader.
- Unchanged: every other page, 760 px and wider, `<html data-sky="brown">`, js/hand.js, the meta theme-color.

Owner-visible delta, stated before the build (FELT-DELTA): at 390, Home — before: a light (Day) or dark-brown (Night)
status strip, a solid praxis bar with a hairline, then a 30 px band of page colour, then the sky; after: blue from the
very top of the screen, praxis and Search in cream on the sky. At 1360: none.

## Stage 0 — pre-flight
- Protocol docs found: CLAUDE.md, PROTOCOL.md (v1.2), docs/FIX-PROTOCOL.md (v1.3), BETA.md, BOARD.md,
  docs/studio/sequence.md; agents in .claude/agents/: fix-implementer, fix-red-team, praxis-recon, praxis-reviewer,
  repo-mapper, studio-mockup, studio-scan. None missing. `sh tools/ground-truth`: HEAD f6dc239, hook gate ARMED.
- Branch main, HEAD `f6dc239` (= expected), sw.js `praxis-v3.344`. One tracked file dirty: docs/checkpoints/lc2.md
  (LC2's push record, rides this build).
- Patch: `C:\Users\pallen\Downloads\lc2b.patch`, copied outside the repo: 3,736 B, md5
  `15bbe8b3309fddcaad7149981cd311c2` (= expected). `git apply --check --verbose`: exit 0. `--stat`: 3 files changed, 31
  insertions(+), 1 deletion(-).

## Stage 1 — applied and staged (the index, LF; read with git cat-file / git show / git ls-files -s)

| file | size | md5 | blob | CR | expected | result |
|---|---|---|---|---|---|---|
| assets/components.css | 998,569 (was 996,678, +1,891) | 13d4da48e511163fb515c59cc961fe99 | 876fc575ff7a6588d7e27d92910b6d846816dd27 | 0 | same three | MATCH ×3 |
| js/views.js | 1,490,374 (was 1,489,681, +693) | f2c2698d85fe03853cd735e0982576b2 | 5a797bd7fa9e939de52782cc2d895373de3f38b2 | 0 | same three | MATCH ×3 |
| sw.js | 6,894 (same; v3.344 → v3.345) | 0b01c2032a1a11524f78dfce3183572b | 23ade71da74a956d5404c3df6f21db5428937793 | 0 | same three | MATCH ×3 |

## Stage 2 — proofs

**2.1 Parse** (`tools/parse-check`, cscript JScript): staged views.js `PARSE OK`, exit 0; staged sw.js `PARSE OK`, exit 0;
the working-tree views.js `PARSE OK`, exit 0. The harness rejects a broken copy (sw.js + an arrow function: `PARSE ERROR
... Syntax error`, exit 1).

**2.2 tools/lc2-test, new section h (LC2-b)** — cases a–f as briefed, in the same harness, CR-tolerant reading kept, no new
harness. 30 new checks. a: markers once each, after LC2's end marker. b: one `@media (max-width:759px)` holds all 7
rules (8 selectors), nothing before or after it; every selector starts `html` and carries `:not([data-sky="brown"])`;
no hex. c: `--sky-top`, Home's sky margin and padding, Home's padding-top 0, `.app-nav` transparent only under
`body:has(.home-page.home-sky-on)`, `var(--sky-blue)` only on `#statusbar-scrim` under `html[data-sky-top]`. d: one
`new window.IntersectionObserver(` in the whole of views.js, inside `lxSkyHost`, under `if (key === 'home' &&
window.IntersectionObserver)`, rootMargin `'-60px 0px 0px 0px'`; its callback makes exactly one setAttribute and one
removeAttribute call, both `document.documentElement` and `data-sky-top`; every `data-sky-top` in views.js is inside
lxSkyHost; `addEventListener('scroll'` count 4 as at f6dc239, none in lxSkyHost. e: LC2's block still 4 rules (and LC2's
own cases a–g run untouched). f: sw.js praxis-v3.345 or later.
- RED, on a copy of f6dc239 (theme.css, components.css, views.js, hand.js, sw.js written out LF): exit 1, **47 of 71
  passed, 24 failed** — all 24 failures in section h; sections a–g all pass. The 6 h checks that pass on f6dc239 are the
  "unchanged" invariants (scroll count 4, none in lxSkyHost, LC2 still 4 rules) and three "every one…" sub-checks that
  are vacuous at zero rules (their parent counts fail).
- GREEN, on the staged bytes written out LF: exit 0, **71 of 71 passed, 0 failed**. In the working tree (OLD hand.js from
  `git show 93fe836`, so section 0 runs too): exit 0, **76 of 76**.
- One case was mine and wrong at first: "no scroll listener inside lxSkyHost" counted the word `scroll`, which the patch's
  comment uses ("no scroll listener", "scrolls past"). Narrowed to the listener forms (`addEventListener('scroll'`,
  `addEventListener("scroll"`, `onscroll`) before the readings above. The patch was not touched.

**2.3 Checks** on a fresh LF copy of the staged index (`git -c core.autocrlf=false checkout-index -a`, CR 0, md5s as the
table): see "Checks summary" below.

**2.4 Pictures and measurements** — fresh, 2026-11-26 15:46, this machine. The repo's capture path (headless Chrome 158 over
CDP, as R1, R3 and LC2; runner `.claude/rig/captures/lc2b/lc2b-run.ps1`, untracked, seeding through R3's `r3-rig.js`, the
`praxis_user` stub, 4 books, 5 lenses, 5 notes; nothing reaches Firestore). AFTER = the applied working tree on
localhost:8950 (served `praxis-v3.345`); BEFORE = f6dc239 on localhost:8951 (served `praxis-v3.344`). 390 × 844 dpr 3
mobile + touch, **with a 47 px top safe-area inset emulated** (`Emulation.setSafeAreaInsetsOverride`; the strip measures
47 px tall), and 1360 × 900 dpr 1, no inset. Logs: `.claude/rig/captures/lc2b/log-measure.txt`, `log-look.txt`,
`log-compare.txt` (every field, after vs before). Page errors: none.

| state (390 unless said) | Night | Day | pass |
|---|---|---|---|
| Home at the top: sky host top | −15 px (≤ 0) | −15 px | yes |
| Home at the top: `.app-nav` background | rgba(0,0,0,0) | rgba(0,0,0,0) | yes |
| Home at the top: `#statusbar-scrim` | rgb(15,47,94) = #0F2F5E | rgb(29,90,166) = #1D5AA6 | yes |
| Home at the top: `<html data-sky-top>` | present | present | yes |
| Home at the top: praxis / Search colour, edge | rgb(251,244,230), the sky edge | the same | yes |
| Home scrolled past the sky (scrollY 707, sky bottom 0) | attribute absent; strip rgb(31,20,12) = page | absent; rgb(251,248,241) = page | yes |
| Home scrolled back to the top | attribute back; strip blue | the same | yes |
| Shelf: `.app-nav` background | rgb(51,36,26), as before | rgb(255,255,255), as before | yes |
| Shelf: `data-sky-top` | absent | absent | yes |
| Home `?sky=brown` 390: gap, bar, strip | identical to before (homePadTop 30, sky top 134, nav rgb(51,36,26), strip page) | identical (nav white) | yes |
| Home 1360, blue and brown | identical to before | identical | yes |

After vs before, field by field (`log-compare.txt`): Home 390 blue differs in exactly the intended fields (strip, bar
background and hairline, wordmark and pill colour and edge, Home padding 30 → 0, sky top 134 → −15, height 603 → 722,
the flower 30 px higher). Everywhere else the only differences are: `data-sky-top` present on Home at 1360 and with
`?sky=brown` (no CSS reads it there — every reader is under the 759 media query and `:not([data-sky="brown"])`), and
`--sky-top` defined on `<html>` on every phone page (read only by the Home rule). The sky's spare above the screen is
15 px with a 47 px inset (bar 104 px; `--sky-top` 119 px).

Captures, `docs/checkpoints/lc2b-shots/` (14, viewport, jpeg): `lc2b-after-home-top-blue-390-{night,day}`,
`lc2b-before-home-top-blue-390-{night,day}` (the side by side), `lc2b-after-home-scrolled-blue-390-{night,day}`,
`lc2b-after-shelf-blue-390-{night,day}`, `lc2b-after-home-top-brown-390-{night,day}`,
`lc2b-after-home-top-blue-1360-{night,day}`, `lc2b-after-home-top-brown-1360-{night,day}`.

Seen in the pictures: at the top of Home the flat blue strip meets the sky's painted strokes at a straight edge 47 px down
(the strip is flat by B4; the sky's strokes begin under it). Whether that edge reads on the phone is for Preston's eyes.
**The captures cannot show a real notch or Dynamic Island, nor the colour iOS gives the clock and battery** — the inset is
emulated, the strip is drawn by the page, and headless Chrome draws no status bar.

**2.5 Review agents** — see below.

## Checks summary
`powershell -NoProfile -ExecutionPolicy Bypass -File tools/checks.ps1`, run in the fresh LF copy of the staged index
(`INFO version praxis-v3.345`, `INFO line-endings sw.js LF`, `INFO commit none` — a copy with no .git, as on the Checks
machine, so lc2-test reads OLD from its fingerprints): **`CHECKS: 37 of 37 passed, 0 failed`**, exit 0. The two self
checks, 21 parse checks, 9 harnesses (lc2-test `71 of 71`) and 5 rig suites (d1a 82/82, fb-1a 99/99, fb-1a-extras 20/20,
r3 32/32, _template 1/1).

## Review
- **fix-red-team (§9, Sonnet), on the staged diff: no BLOCK; 3 NITs and 1 residual.** It traced the observer: created once
  (lxSkyHost returns the cached record before the new block; one caller, `lxSkyHost('home')`; no reset), never
  disconnected (harmless); the cached host detached on a route change reports not-intersecting and the attribute clears,
  re-attached it reports intersecting and it is set again. Cascade: the scrim rule (1,2,1) beats the base (1,0,0); the
  `.app-nav` rule (0,4,3) beats `.app-nav{background:var(--surface)}`; the sky rule (0,6,1) beats (0,4,0); Home's
  padding-top 0 beats `padding:30px 0 80px`. The phone `.app-nav` is `position:relative`, so the clear bar scrolls away
  with the page and never lies over light content. ES3 clean; no comment overclaims; no scope drift.
  - NIT 1: the observer's callback runs after the next frame, so leaving Home the next page's strip can show the sky blue
    for about one frame before its 140 ms fade (the strip rule is not gated on Home). Recorded as R-8; not changed.
  - NIT 2: section h checks text and structure; it cannot fail on behaviour. The behaviour proof is 2.4's measurements.
  - NIT 3: `data-sky-top` is set at 760+ and under `?sky=brown`, inert there. Same as R-4.
  - Its residual "no rendered evidence" was written without 2.4's captures (not given to it); 2.4 measures the collapse
    (sky top −15 px), the spare (15 px with a 47 px inset) and the colours. The real notch remains R-2.
  - It counted section h as 33 checks on its own scratch run; the harness prints 30 new (76 − 46 in the worktree).
- **praxis-reviewer (Sonnet): CLEAR-WITH-NITS, no blocking gate.** It re-derived: the staged diff of the three app files,
  CR stripped, byte-identical to lc2b.patch; the staged sizes and md5s; sw.js one line; EOL i/lf; `git diff --cached
  --check` clean; ES3 clean; hand.js `4000e9cc…`, lumen-amber `631bc2aa…`, marks.js 10,255 B, and no diff in any non-goal
  file; lc2-test 76 of 76 in the worktree (30 new); every row of the 2.4 table against `log-measure.txt`; the 14 captures
  present; BETA.md 138 lines; the records agreeing on order, version and the LC2 Checks run. It did not re-run the RED
  reading on f6dc239. Nits: lc2.md's "uncommitted" heading (reworded: "rides LC2-b's commit"); this line (filled); the
  residual order (fixed); and R-4, R-5, R-8 as recorded. The Builder is regenerated and staged in this commit.

## Residuals
- R-1 The colour iOS gives the clock and battery over the Day blue (`#1D5AA6`): only Preston's phone can show it. The meta
  theme-color is unchanged by ruling.
- R-2 The fit on a real notch / Dynamic Island: the inset here is emulated (47 px). Only the phone shows it.
- R-3 The straight edge where the flat strip meets the sky's strokes (above). By B4's design; recorded for the felt pass.
- R-4 `data-sky-top` is also set on Home at 760 px and wider and with `?sky=brown`; nothing reads it there (measured: no
  field differs). Recorded, not changed (the patch is applied as written).
- R-5 The comment in js/views.js says the strip is "see-through while the sky is under it"; B4 made it flat blue. A
  comment only; the patch is applied as written. For the build chat's next cut.
- R-6 Seen on the same phone check of LC2, logged for their own builds and not touched here: the keyboard pushing Yumi's
  panel off the top; a broken book cover in a lens sheet.
- R-7 Persistence is not in play (look only); the rig is signed in by a stub, not Preston's account, and is not a phone.
- R-8 (red-team NIT 1) Leaving Home, the next page's strip can stay the sky blue for about one frame before the observer
  clears the attribute and the 140 ms fade runs. Not measurable in the 1.2 s-settled readings above; for the phone pass.
  The build chat may gate the strip rule on `body:has(.home-page.home-sky-on)` in a later cut.

## What Preston runs (after the push; this machine cannot reach the live site)
1. Open the app on the phone; accept "new version ready — Reload" if it shows. The app's diag page reads `praxis-v3.345`.
2. Home at Night: no brown or white above the sky; the blue runs to the top of the screen; praxis and Search readable on it.
3. The clock and battery readable on the blue.
4. Scroll Home down: nothing slides under the clock; once the sky has gone by, the strip turns back to the page colour.
   Scroll back up: the strip is blue again.
5. Switch to Day and repeat 2–4 (the clock on the lighter blue is the one to look at).
6. Open the Shelf: its top bar is as before (solid, with its hairline), the strip the page colour.
Pass: all six as described. Compare with `lc2b-before-home-top-blue-390-*.jpg` and `lc2b-after-home-top-blue-390-*.jpg`.
