# SCAN — FIX LOOP 4 SHIP (v3.269) · Opus 4.8

Round STAYS OPEN. Records the PUSH + independent deploy verification of the single
fix-loop-4 commit (F9 — crop Shelf capture to the frame). No new code, no amends, no
rebase — a plain fast-forward. Preston's device felt pass (round 4, below) is the
round's next input; the CLOSE session runs only on his pass.

Ship date: 2026-08-05. Pushed by: this session, on Preston's explicit ship directive.

---

## STAGE 0 — STATE MATCHED THE BUILD HANDOFF → PASS
- branch=`main` · HEAD=`6c021af` · origin/main(pre)=`30f6d99` · ahead 1 / behind 0.
- `git status --porcelain` tracked-modifications: none (only pre-existing `??` untracked checkpoints).
- 1 commit: `6c021af` (F9 + sw.js bump + checkpoint). Working-tree CACHE_VERSION=`praxis-v3.269`.
- **Marker discrimination (HEAD vs origin/main pre-push):** `scanFrameToVideoRect` HEAD **2** /
  origin **0**; `scanShelfCropRect` HEAD **2** / origin **0**. Both new at HEAD → presence
  post-deploy proves the code shipped, not a version echo.
- Baseline (live v3.268, signed-out headless): both markers `undefined`; console = 13 `[log]`
  lines, `onAuthStateChanged: signed out`, **zero errors/warnings**.

## STAGE 1 — PUSH → PASS
```
To https://github.com/prestona255-jpg/praxis-app.git
   30f6d99..6c021af  main -> main
```
Fast-forward, exactly 1 commit. Post-push fresh fetch: HEAD == origin/main == `6c021af`;
ahead 0 / behind 0.

## STAGE 2 — DEPLOY VERIFICATION (independent) → PASS
- **VERSION** — live `/sw.js` cache-busted: try1 `praxis-v3.268` → try2 `praxis-v3.269` →
  try3 `praxis-v3.269` (HTTP 200), **2 consecutive** = v3.269. Served sw.js **6041 B** = repo
  `sw.js@6c021af` (6041 B). (v3.268/269 equal length → size corroborating, not discriminating;
  the markers below discriminate.)
- **CLIENT MARKERS ON SERVED BYTES** (proves the CODE deployed, B3 lesson): served `/js/views.js`
  `scanFrameToVideoRect` = **2**, `scanShelfCropRect` = **2**, wiring
  `scanCaptureBase64(scanShelfCropRect())` = **1**.
- **ENDPOINT POSTURE** — `netlify/functions/shelf-vision.js` is **untouched this loop**
  (`git diff 30f6d99..6c021af` on that path = 0 files), so there is **nothing new to verify
  server-side** — no inference stage and no negative probe this loop (unlike the FX-K ship).
- **BOOT SMOKE** (live signed-out): the open tab first booted the stale v3.268 SW (L5). After SW
  unregister + cache clear + reload, the running v3.269 bundle reports `scanFrameToVideoRect`,
  `scanShelfCropRect`, `scanCaptureBase64` all **`function`**; signed-out; **errors-only console
  read = "No console logs" (zero errors)** — matches the Stage-0 baseline.
  - HONESTY RAIL: crop BEHAVIOR (does the shot now contain only the framed row?) is NOT claimed
    verified — the rig has no camera and no vision call was made. Code is present + boots clean;
    the frame-promise, in-frame accuracy, and cleaner partials are DEVICE-OWED (the felt card).

## VERDICT
All automated gates PASS. v3.269 is LIVE and serving the F9 code (crop-to-frame). shelf-vision.js
untouched. Round STAYS OPEN pending Preston's device felt pass round 4.

---

## FELT CARD — SCAN round 4 (installed PWA + plain Safari, live URL)
Do this on the iPhone, fresh (accept the "new version — Reload" banner, or force-quit + reopen
the PWA, so the v3.269 SW is active):

- [ ] **Frame promise** — ONE shot with the frame around a single shelf row, other rows visibly
  above/below: the tray contains **ONLY** the framed row's books.
- [ ] **In-frame accuracy holds** — the confident reads inside the frame still land.
- [ ] **Partials cleaner** — fewer leading-garbage edge reads (e.g. "ND THE EDUCATION OF DESIRE S").
- [ ] **Spot-check** — Shelf still **sharp** (F6) · non-books still **absent** (F8) · Book decode +
  camera-light-death still fine (FX-A/G) · FX-H receipt still correct.

HALT — Preston's felt round 4 is the round's next input: **PASS → the round CLOSE session**
(Builder regen + sequence.md/BOARD.md + worktree cleanup); **FAIL → fix-loop-5 triage**.
