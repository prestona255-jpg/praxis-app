# SCAN — FIX LOOP 3 SHIP (v3.268) · Opus 4.8

Round STAYS OPEN. Records the PUSH + independent deploy verification of the three
fix-loop-3 commits (FX-I, FX-J, FX-K). No new code, no amends, no rebase — a plain
fast-forward. Preston's device felt pass (round 3, below) is the round's next input;
the CLOSE session runs only on his pass.

Ship date: 2026-08-05. Pushed by: this session, on Preston's explicit ship directive.

---

## STAGE 0 — STATE MATCHED THE BUILD HANDOFF → PASS
- branch=`main` · HEAD=`30f6d99` · origin/main(pre)=`30cd777` · ahead 3 / behind 0.
- `git status --porcelain` tracked-modifications: none (only pre-existing `??` untracked
  triage/ship checkpoints).
- 3 commits present, exact: `a5e6668` (FX-I) · `21ecfc3` (FX-J) · `30f6d99` (FX-K + sw.js
  bump + checkpoint). Working-tree CACHE_VERSION=`praxis-v3.268`.
- **Marker discrimination (HEAD vs origin/main pre-push):**
  - `scanAcquireShelf` (js/views.js): HEAD **2** / origin/main **0**.
  - `candidateIsPlausible` (js/integrations.js): HEAD **1** / origin/main **0**.
  Both new at HEAD → presence post-deploy proves the code shipped, not a version echo.
- Baseline (live v3.267, signed-out headless): markers `undefined`; console = 13 `[log]`
  lines, `onAuthStateChanged: signed out`, **zero errors/warnings**.

## STAGE 1 — PUSH → PASS
```
To https://github.com/prestona255-jpg/praxis-app.git
   30cd777..30f6d99  main -> main
```
Fast-forward, exactly 3 commits. Post-push fresh fetch: HEAD == origin/main == `30f6d99`;
ahead 0 / behind 0.

## STAGE 2 — DEPLOY VERIFICATION (independent) → PASS
- **VERSION** — live `/sw.js` cache-busted: try1 `praxis-v3.267` → try2 `praxis-v3.268` →
  try3 `praxis-v3.268` (HTTP 200), **2 consecutive** = v3.268. Served sw.js body **6041 B** =
  repo `sw.js@30f6d99` (6041 B). (v3.267/268 equal length → size corroborating, not
  discriminating; the markers below discriminate.)
- **CLIENT MARKERS ON SERVED BYTES** (proves the CODE deployed, B3 lesson):
  - served `/js/views.js`: `scanAcquireShelf` = **2** (FX-I), `candidateIsPlausible(b.title` = **1** (FX-J walker).
  - served `/js/integrations.js`: `candidateIsPlausible` = **1** (def), `candidateIsPeriodical` = **4** (def + 2 calls + comment).
- **FX-K (shelf-vision.js) — HONESTY RAIL:** a Netlify FUNCTION; its source is never served to
  the client, so no byte check is possible and no vision call is sanctioned. Verified as
  **INFERENCE**: Netlify deploys functions + static assets ATOMICALLY from one commit, and the
  static assets from `30f6d99` are confirmed live (version + markers), so the shelf-vision bundle
  at `30f6d99` deployed with them. Corroborated by a NEGATIVE probe (no key, empty body):
  `POST /.netlify/functions/shelf-vision` → **HTTP 401 `{"error":"unauthorized"}`** — the
  function is deployed and gating BEFORE any model call (no key used, no image, no vision call).
  **This proves the function is LIVE; it CANNOT distinguish old vs new prompt bytes** — the FX-K
  change is prompt prose, server-internal, observable only via an actual vision call (a non-goal).
  FX-K deployment therefore rests on the atomic-deploy inference, stated plainly.
- **BOOT SMOKE** (live signed-out): the open tab first booted the stale v3.267 SW (L5). After SW
  unregister + cache clear + reload, the running v3.268 bundle reports `scanAcquireShelf`,
  `scanStreamConstraints`, `candidateIsPlausible`, `candidateIsPeriodical` all **`function`**;
  signed-out; **errors-only console read = "No console logs" (zero errors)** — matches the
  Stage-0 baseline.
  - HONESTY RAIL: FX-I/FX-J/FX-K BEHAVIOR is NOT claimed verified — the rig has no camera and no
    vision call was made. Code is present + boots clean; camera sharpness (F6), non-book omission
    (F8), and the walker-on-real-partials (F7) are DEVICE-OWED (the felt card).

## VERDICT
All automated gates PASS. v3.268 is LIVE and serving the FX-I + FX-J code; the FX-K function
bundle deployed atomically from the same commit (endpoint live, gating 401). Round STAYS OPEN
pending Preston's device felt pass round 3.

---

## FELT CARD — SCAN round 3 (installed PWA + plain Safari, live URL)
Do this on the iPhone, fresh (accept the "new version — Reload" banner, or force-quit + reopen
the PWA, so the v3.268 SW is active):

- [ ] **F6** — Shelf viewfinder is **SHARP after a Book→Shelf switch** (fresh high-res acquire,
  not the soft re-attach); the shot it then takes is sharp.
- [ ] **FX-A/FX-G not re-broken** — Book mode: camera light **dies on nav-away AND app-switch**;
  **no black viewfinder** on Book↔Shelf; barcode decode still works.
- [ ] **F8** — ONE sanctioned opus shelf shot with the **Sharpie + scarves** in frame: the
  non-books are **ABSENT** from the tray / needs-a-look; the real books still land.
- [ ] **F7** — the walker on remaining partials shows **plausible candidates OR the honest "No
  confident match — Search on the Shelf instead"**; zero 1890s catalog/periodical junk.
- [ ] **Undo race** (owed from round 2, **prestonpraxistest ONLY**): Shelve → **instant Undo
  mid-sync** → reload → **zero resurrection**.
- [ ] **FX-H** — the bottom pill stays **hidden at rest**; the receipt appears only on Shelve.

HALT — Preston's felt round 3 is the round's next input: **PASS → round CLOSE session** (Builder
regen + sequence.md/BOARD.md + worktree cleanup); **FAIL → fix-loop-4 triage**.
