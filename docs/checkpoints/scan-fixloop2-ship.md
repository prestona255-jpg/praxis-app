# SCAN — FIX LOOP 2 SHIP (v3.267) · Opus 4.8

Round STAYS OPEN. This records the PUSH + independent deploy verification of the two
fix-loop-2 commits (FX-G, FX-H). No new code, no amends, no rebase — a plain
fast-forward. The device felt pass (below) is the round's next input; the CLOSE
session runs only on Preston's pass.

Ship date: 2026-08-05. Pushed by: this session, on Preston's ship directive.

---

## STAGE 0 — STATE MATCHED THE AUG-5 RECON → PASS
- branch=`main` · HEAD=`30cd777` · origin/main(pre)=`340e342` · ahead 2 / behind 0.
- `git status --porcelain` tracked-modifications: none (only pre-existing `??` untracked).
- 2 commits: `1600bff` (FX-G) + `30cd777` (FX-H). Working-tree CACHE_VERSION=`praxis-v3.267`.

## STAGE 1 — GATE EVIDENCE → PASS
Gate record EXISTS and is tracked: `docs/checkpoints/scan-fixloop-2.md` (committed inside
FX-H, `30cd777`). Its claimed file/verb map matches both diffs exactly:
- FX-G `1600bff` → `js/views.js` "re-attach the display on mode switch" (28 ins).
- FX-H `30cd777` → `assets/components.css` + `sw.js` "state-gate the receipt + v3.267".

Read-only sanity gate (independent of the record):
- (a) SCOPE — FX-G: `js/views.js` only. FX-H: `assets/components.css` + `sw.js` + the doc.
  No foundation files (state.js schema/migrate, firestore.rules, theme.css, lumen-amber.css,
  marks.js). PASS.
- (b) ES3 RAILS — FX-G's 28 added lines: no `const/let/class/arrow/backtick` (grep clean).
  FX-H: CSS-only, no JS syntax. PASS.
- (c) sw.js BUMP — exactly `v3.266 -> v3.267`, in `30cd777` (FX-H). PASS.
- (d) NO AUTH / SOLE-WRITER WRITES — FX-G is display/stream lifecycle (`scanEnsureDisplay`,
  `scanTrackLive`, re-attach of the existing `scanStream`); no Firestore/captureNote/auth
  path. FX-H is CSS + version string. PASS.
- L12 comment safety — the single `*/` in the FX-H hunk is the legitimate terminator of the
  multi-line `/* FX-H (F6): STATE-GATED ... */` block; no stray `*/`, no `--token-*/`. PASS.

Stage-3 markers selected (both ABSENT at v3.266, PRESENT at 30cd777 — so presence proves
new code, not a stale-cache echo):
- FX-G marker: `scanEnsureDisplay` (function name, `js/views.js`) — v3.266 count 0, 30cd777 count 2.
- FX-H marker: `STATE-GATED` (comment token, `assets/components.css`) — v3.266 count 0, 30cd777 count 1.

## STAGE 2 — PUSH → PASS
```
To https://github.com/prestona255-jpg/praxis-app.git
   340e342..30cd777  main -> main
```
Fast-forward, exactly 2 commits, exit 0. Post-push fresh fetch:
HEAD == origin/main == `30cd777`; ahead 0 / behind 0.

## STAGE 3 — DEPLOY VERIFICATION (independent) → PASS
- 3.8 VERSION — live `/sw.js` cache-busted, 2 consecutive reads = `praxis-v3.267`,
  HTTP 200, 6041 bytes each. Repo `sw.js@30cd777` = 6041 bytes → served size MATCHES.
  (Note: `v3.266`/`v3.267` strings are equal length, so sw.js byte-size is corroborating,
  not discriminating; the markers below discriminate.)
- 3.9 MARKERS ON SERVED BYTES — proves the CODE deployed, not just the version string:
  - served `/js/views.js` grep `scanEnsureDisplay` = 2 (`function scanEnsureDisplay()` present).
  - served `/assets/components.css` grep `STATE-GATED` = 1 (`FX-H (F6): STATE-GATED with display:none`).
  - served vs repo byte sizes: views.js 1185504 vs 1185505; components.css 869582 vs 869583 —
    each −1 = bash command-substitution stripping the trailing LF; content-identical.
- 3.10 PROVENANCE — Netlify deploy metadata (`manual_deploy` flag) UNINSPECTABLE this session
  (no Netlify API access wired). Auto-build strongly inferred: origin/main pushed, NO manual
  deploy action taken, and the live site auto-served v3.267 with both new markers within
  minutes — the only deploy mechanism per CLAUDE.md is Netlify auto-build-on-push. Relying on
  3.8 + 3.9 as the mission sanctions.
- 3.11 BOOT SMOKE — signed-out headless:
  - Baseline (pre-push, v3.266): all `[log]`, `onAuthStateChanged: signed out`, zero errors/warnings.
  - Post-deploy: the open tab first served the stale v3.266 SW bundle (`scanEnsureDisplay`
    undefined — the L5 already-open-tab stale-SW behavior). After unregistering the SW +
    clearing caches and reloading, the running bundle is v3.267: `scanEnsureDisplay`,
    `scanTrackLive`, `scanSetMode` all `function`; error-only console read = "No console logs"
    (zero errors). No NEW errors vs baseline.
  - HONESTY RAIL: FX-G/FX-H BEHAVIOR is NOT claimed verified — the rig has no camera. Code is
    present + boots clean; camera-light death, mode-switch re-attach, and receipt seating are
    device-owed (the felt card).

## VERDICT
All automated gates PASS. v3.267 is LIVE and serving the FX-G + FX-H code. Round STAYS OPEN
pending Preston's device felt pass.

---

## FELT CARD — SCAN round 2 (installed PWA + plain Safari, live URL)
Do this on the iPhone, fresh (Incognito/first-open so the new SW is active — if an old tab
lingers, accept the "new version — Reload" banner or force-quit + reopen the PWA):

- [ ] **Camera light DIES on nav-away and on app-switch** (FX-A + FX-G re-attach path) —
  watch the hardware camera indicator itself, not the screen.
- [ ] **Book -> Shelf -> Book never goes dark** (FX-G): switching to Shelf keeps a LIVE
  picture (no black viewfinder with the light still lit); switching back to Book restores
  decode. All three of `scanEnsureDisplay`'s branches in play (re-attach / re-warm / no-op).
- [ ] **Pen-marked / glared barcode**: silently ignored, no garbage book conjured.
- [ ] **FX-H — the bottom pill**: in Book mode AT REST, NO dark pill peeks from the bottom
  edge at all (it is now `display:none`, not merely slid off). It appears ONLY after you
  Shelve — the "Shelved N · Undo" receipt then sits fully on-screen, seated above the
  home-indicator inset (~24px above the fold) — and vanishes cleanly after it hides.
- [ ] **One sanctioned opus Shelf shot** -> walker through the needs-a-look pile
  (skip-all still one tap).
- [ ] **On prestonpraxistest ONLY**: Shelve a batch -> INSTANT Undo mid-sync -> reload ->
  zero resurrection.
- [ ] **Notch / safe-area + torch-absence** feel acceptable.

HALT — Preston's felt pass (or FAIL findings) is the round's next input. The round CLOSE
session (Builder regen, sequence.md/BOARD.md, worktree cleanup) runs only on his pass.
