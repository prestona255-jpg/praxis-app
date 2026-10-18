# L7a — THE APP SHELL, FIRST SLICE — build record (Stages 1–3)

Model: Opus 5.5 executes; gate agents Sonnet (frontmatter). Base HEAD `a0c7ce4`, start
CACHE_VERSION `praxis-v3.299`. Recon + rulings: `docs/checkpoints/l7a-recon.md`.
Built 2026-10-17. Not a visual slice: there is no owner-visible before/after at 1360 or 390 on
the web (FELT-DELTA clause) — this is infrastructure; no felt pass is queued for it.

Byte method: LF-normalized measured bytes — `tr -d '\r' < <file> | wc -c` against
`git show HEAD:<file> | wc -c` (every blob is LF, CR=0), per-stage against a snapshot of the
previous stage. Never numstat.

## Stage 1 — one API base (commit L7a.1, CACHE_VERSION → praxis-v3.300)

| file | expected | measured |
|---|---|---|
| js/state.js | +301 | **+301** (2 lines inserted before `var state = {`, now :273) |
| js/integrations.js | +54 | **+54** (:12, :13, :2626) |
| js/views.js | +18 | **+18** (:9351) |
| js/yumi-brain.js | +18 | **+18** (:104; working tree stays CRLF, CR 3170 → 3170) |
| js/import-capture.js | +18 | **+18** (:33) |
| sw.js | +0 | **+0** (`v3.299` → `v3.300`) |

Greps: `grep -c "var PRAXIS_API_BASE" js/state.js` = **1** · `grep -o "PRAXIS_API_BASE + '/.netlify/functions/" js/*.js | wc -l` = **6** ·
unprefixed `'/.netlify/functions/` = **0 lines**.
Parse (`tools/parse-check`): state / integrations / views / yumi-brain / import-capture — **PARSE OK, exit 0 ×5**.
Harness self-check: a copy of state.js with an appended arrow function → **PARSE ERROR, exit 1**.
Regression harnesses over the real state.js + integrations.js bytes: `tools/delete-test` **58/58 exit 0** ·
`tools/export-test` **58/58 exit 0** · `tools/fx1c-sim` **60/60 exit 0**.

## Stage 2 — vendor the runtime CDN scripts (commit L7a.2, CACHE_VERSION → praxis-v3.301)

Downloaded twice each; the two copies are identical (cmp), and each also matches an INDEPENDENT copy from the
npm CDN byte for byte (`cdn.jsdelivr.net/npm/firebase@10.12.5/<file>`; `unpkg.com/@zxing/library@0.20.0/umd/index.min.js`).
`git hash-object --path` == `--no-filters` for every vendored file → the committed blob is byte-identical to the download.

| path | bytes | sha256 | source |
|---|---|---|---|
| vendor/firebase/10.12.5/firebase-app-compat.js | 31,683 | 8912da846b0424822a8ca681e0021bc9281a089313966c5f97bad82d02cb9f65 | https://www.gstatic.com/firebasejs/10.12.5/ |
| vendor/firebase/10.12.5/firebase-auth-compat.js | 139,589 | d08600699f3d17864b1e133b8d4e0a5a94ac62756b6ffdd9e4516b457800de61 | same |
| vendor/firebase/10.12.5/firebase-firestore-compat.js | 342,262 | 603b7f6d0a9d4a214960f4d720afd76ff9ecdc9187bcc689b477780fabea0b75 | same |
| vendor/zxing/0.20.0/index.min.js | 336,049 | a560a87011ff742441d5770cc5ab0f64cfbfb7b228966c5433783e3ba96dd410 | https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/umd/index.min.js |
| vendor/firebase/10.12.5/LICENSE | 14,096 | 065e45b5674f9bf7… | https://raw.githubusercontent.com/firebase/firebase-js-sdk/firebase%4010.12.5/LICENSE (Apache-2.0; its protobuf portion BSD-3-Clause — both texts included) |
| vendor/zxing/0.20.0/LICENSE | 13,321 | 849b3ff4527ff587… | the LICENSE shipped in the npm package @zxing/library@0.20.0 (== github zxing-js/library tag v0.20.0) — Apache-2.0 |

Note: @zxing/library's package.json declares `"license": "MIT"`, but the LICENSE file in that same package and at
the repo tag is Apache-2.0. The actual file is vendored; the mismatch is upstream's and is recorded, not resolved.

| file | expected | measured |
|---|---|---|
| index.html | −54 | **−54** (:77–79; CRLF working tree kept, CR 194) |
| js/views.js | −34 | **+29** = **−34** code (:7240) + 63 comment (:7219 zxing loader comment corrected: it is now vendored and precached — red-team nit, docs ride with the diff) |
| sw.js | state it | **+350** = **+205** code (4 entries after `'/assets/wheat-field.svg',`; version `v3.300` → `v3.301` +0) + 145 comment (header :8–9: Firebase + zxing now vendored and precached, not CDN) |

Greps: `gstatic.com/firebasejs` in index.html = **0** · `/vendor/firebase/10.12.5/` = **3** ·
`cdn.jsdelivr.net/npm/@zxing` in views.js = **0** · `/vendor/zxing/0.20.0/index.min.js` = **1** · APP_SHELL `'/vendor/` = **4**.
Parse: views.js, sw.js — **PARSE OK, exit 0**. Vendored files are third-party bytes, exempt from the ES3 floor and not parse-checked.

## Stage 3 — scaffold + SW guard (commit L7a.3, CACHE_VERSION → praxis-v3.302)

| file | expected | measured |
|---|---|---|
| index.html | +130 | **+130** (guard is the IIFE's first statement, :106; CRLF kept, CR 195 = lines 195) |
| js/app.js | (floor ~+400) | **+848** (comment line 130 B + a 718 B guarded block; the 2× agent-estimate pattern, FIX-PROTOCOL §3) |
| sw.js | +0 | **+0** (`v3.301` → `v3.302`) |
| .gitignore | — | **+112** (comment + `ios-shell/www/` · `ios-shell/ios/` · `ios-shell/node_modules/`) |
| ios-shell/package.json | new | 315 |
| ios-shell/capacitor.config.json | new | 243 |
| ios-shell/scripts/assemble-www.sh | new | 1,265 |
| ios-shell/README.md | new | 2,236 |
| .github/workflows/ios-shell-sim.yml | new | 6,185 |

Greps: `isNativePlatform()) return;` in index.html = **1** · `\[praxis-shell\]` in js/app.js = **1** ·
`git ls-files package.json` = **empty** (and no root package.json on disk) ·
`^\s*(push|pull_request):` in the workflow = **no lines** · CACHE_VERSION after L7a.3 = **'praxis-v3.302'** (start + 3).
Parse: app.js, sw.js — **PARSE OK, exit 0**.
JSON: package.json, capacitor.config.json parse (PowerShell ConvertFrom-Json). `bash -n assemble-www.sh` OK.
YAML: **no YAML linter on this machine** (no python, no node). Checked structurally only: 0 tabs, 0 odd-indent lines.
Step names as written: Checkout · Select Xcode 26.6 · Set up Node 24.20.0 · Install Capacitor 8.5.2 · Assemble www ·
Add the iOS platform · Sync iOS · Build App (Debug, iphonesimulator) · Boot the first available iPhone simulator ·
Install the app · Launch, wait 25 s, screenshot, capture the console · Upload artifacts (always) · Verify the shell reported in.
Pins: runs-on `macos-26`; Xcode `/Applications/Xcode_26.6.app`; Node `24.20.0`; actions by commit SHA —
checkout `3d3c42e5…` (v7.0.1, 2026-07-20), setup-node `82076278…` (v7.0.0, 2026-07-14), upload-artifact `043fb46d…`
(v7.0.1, 2026-04-10) — newest release at least two weeks old for each (setup-node v7.1.0 and upload-artifact v7.0.2
are from October, too new).
assemble-www.sh dry run (scratch copy of the tree): **37 files, 4,138,057 bytes**; prints both docs/ files; with
`docs/yumi-voice.md` removed it prints `MISSING file docs/yumi-voice.md` and exits **1**.

## Local web check (rig static server, http://localhost:8771, fresh origin, 2026-10-17)

`window.PRAXIS_API_BASE` = `""` · `window.Capacitor` undefined · `firebase.SDK_VERSION` = 10.12.5 ·
resources: the three Firebase files from `/vendor/firebase/10.12.5/`, zxing (via `loadZxingLibrary`, → `true`,
`window.ZXing` object) from `/vendor/zxing/0.20.0/index.min.js`; **0** gstatic firebasejs and **0** jsdelivr requests ·
proxy URL constants all relative (`/.netlify/functions/…`); the page's own `POST /.netlify/functions/google-books-proxy`
went to `localhost:8771` (404 — this static server has no functions; it proves the call stayed same-origin) ·
`/docs/yumi-voice.md` 200 and console `yumi-brain: voice doc loaded (11885 chars)` · SW registered, cache
`praxis-v3.302` holds 32 entries incl. all 4 vendor files · no `[praxis-shell]` line on the web · console: no
errors other than the two expected proxy 404s.
This is a local check, not the live deploy — the live check is Stage 4.

## STAGE 4 — Preston's on-device live check (after "commit and push")

This machine cannot reach the origin (curl `000`, exit 56; the Browser pane is refused), so per PROTOCOL §9 this is
yours. Use a **throwaway** Google account, never prestona255. Safari on iPhone unless a step says otherwise.

1. **Version.** Open https://praxis-reading.netlify.app. If "A new version of Praxis is ready." appears, tap **Reload**
   (repeat once if it appears again). Then open https://praxis-reading.netlify.app/#diag.
   PASS: the report's bundle line reads **praxis-v3.302**.
2. **Vendored files are deployed.** Open each URL in a new tab:
   `/vendor/firebase/10.12.5/firebase-app-compat.js`, `…/firebase-auth-compat.js`, `…/firebase-firestore-compat.js`,
   `/vendor/zxing/0.20.0/index.min.js`.
   PASS: each shows a wall of JavaScript text (not the Praxis app, not "Page not found").
3. **Firebase loads from /vendor.** Back on the app, sign in with the throwaway account.
   PASS: you land signed in (index.html now has no other Firebase source, so a working sign-in proves the vendored copy).
4. **Yumi round-trip (claude-proxy, base '').** Open Yumi, send "hello".
   PASS: Yumi replies — or shows the honest daily-limit message. FAIL: a generic error or nothing.
5. **Book lookup (google-books-proxy).** Add a book by typing a title (e.g. "Beloved").
   PASS: real catalogue results appear.
6. **Shelf scan (shelf-vision).** Scan → Shelf mode → photograph a few spines.
   PASS: titles appear in the tray. You do not need to shelve them; decline.
7. **Barcode scan (vendored zxing).** Scan → Book mode → point at a book's ISBN barcode.
   PASS: the book is recognised. (iPhone Safari has no BarcodeDetector, so this runs on the vendored zxing.)
8. **Dictation (transcribe-proxy).** Open the capture door, tap the mic, say a sentence, stop.
   PASS: your words appear as text.
9. **Console (only if a desktop Chrome is available to you).** DevTools → Network: filter `firebasejs` → **0**;
   filter `jsdelivr` → **0**; filter `vendor` → the 3 Firebase files (+ zxing once a scan opens). Console on Home,
   Shelf, Notebook, a book, Yumi: **no red errors.** EXPECTED and not a failure: DevTools-only "failed to load source
   map" warnings for the four vendored files (they end in a `sourceMappingURL` comment; the .map files were not vendored).
Report each as PASS/FAIL with what you saw. Any FAIL → I stop; nothing is patched forward.

## STAGE 5 — the simulator run (Preston's hands, then mine)

1. github.com/prestona255-jpg/praxis-app → **Actions** → "iOS shell — simulator" → **Run workflow** (branch `main`).
2. Wait for it to finish (expect ~15–30 min). Green or red, open the run → **Artifacts** → download **ios-shell-sim**.
3. Save the zip to `C:\Users\pallen\Desktop\praxis-app\.claude\l7a-sim\` (gitignored) and tell me.
I then report: build / install / launch step by step; the screenshot described (expected: the signed-out front door);
the `[praxis-shell]` line verbatim; every console error classified "expected (sign-in popup, L7b)" or "NEW — investigate";
whether Firebase, the fonts and the vendored scripts loaded. PASS also requires the line
`yumi-brain: voice doc loaded (`. What Stage 5 can NOT prove: any server-function call from inside the shell — they all
need a signed-in Firebase user, and sign-in is L7b. Stage 5 proves the shell opens and the base resolves, not that the
API base works end to end in the app.

## Residuals

R1 fonts on Google Fonts until L1 · R2 Google popup sign-in (and delete-account re-auth) fail inside the shell by design
until L7b · R3 bundle ID `com.praxisreading.app` is a placeholder · R4 no camera/microphone usage strings in the scaffold
(L7b) · R5 package-lock.json not committed until after the first CI run (transitive deps float until then) · R6 WKWebView
storage can be evicted by iOS · R7 Netlify serves `ios-shell/` and `vendor/` publicly (harmless) · R8 DevTools-only
source-map warnings for vendored files · R9 YAML not linted locally; `--console-pty` in a non-TTY CI job is unproven
until the first run — the Verify step fails the job loudly if the console line is missing · R10 praxis-reading.netlify.app
must keep serving directly (verified by Preston 2026-10-17); re-check before L7b.

## Commit staging plan (explicit-file; never `add -A`; real index only, working tree never touched)

The working tree holds the FINAL state. Each commit's intermediate file content is pinned as a git blob
(`git hash-object -w --path=<f> <snapshot>`; LF, written 2026-10-17) and placed in the index with
`git update-index --cacheinfo 100644,<blob>,<path>`; files whose final content IS that commit's content are
staged with `git add <path>`. Every blob below equals the blob of the matching commit in a full rehearsal
(a scratch clone, commits run through the real hooks/pre-commit — exit 0 ×3).

**L7a.1 — one API base for the app shell (web unchanged)** → praxis-v3.300
| path | how | blob |
|---|---|---|
| js/state.js | add (final == stage 1) | 35da95f5656a82b80c4e2452d49030e94101d9df |
| js/integrations.js | add (final == stage 1) | 11271e6547c219dc926e5d318c9ae7d3d248240d |
| js/yumi-brain.js | add (final == stage 1) | 5141a686a3986a53996ef260b71b3a78ed3b6bca |
| js/import-capture.js | add (final == stage 1) | 4308b1473069ebfd9d50e419a005197115a0a498 |
| js/views.js | cacheinfo (Stage 1 hunk only: :9351 prefixed; :7240 still jsdelivr) | 064bf7df7b281f136d57daf3c8672ff52b6d4df9 |
| sw.js | cacheinfo (v3.300, APP_SHELL unchanged) | 8ce1052586d193733d69006f64f1983558b5b5af |
| docs/checkpoints/l7a-recon.md | add (new) | — |

**L7a.2 — vendor Firebase 10.12.5 compat + zxing 0.20.0 (web unchanged)** → praxis-v3.301
| path | how | blob |
|---|---|---|
| index.html | cacheinfo (3 firebase src → /vendor; NO SW guard yet) | 215cf3e66fbf9c0efc1b72a62033d3ffad5a8800 |
| js/views.js | add (final == stage 2: :7240 → /vendor + the :7219 comment) | 327ec8eb90cafdcdbee2560c6492c8fb3cce3728 |
| sw.js | cacheinfo (v3.301 + 4 APP_SHELL entries + header comment) | 31e2a556f5a79309ab76b1b0360fd0ddfa8220c1 |
| vendor/firebase/10.12.5/{firebase-app-compat.js, firebase-auth-compat.js, firebase-firestore-compat.js, LICENSE} | add (new) | — |
| vendor/zxing/0.20.0/{index.min.js, LICENSE} | add (new) | — |
Hook: rule #4 prints a non-blocking ES3 WARN containing the minified vendor lines (~849 KB) — output goes to a
file; the proof is exit 0 + zero lines beginning `BLOCK`.

**L7a.3 — iOS shell scaffold, SW guard, simulator workflow (dispatch only)** → praxis-v3.302
| path | how | blob |
|---|---|---|
| index.html | add (final: + SW guard :106) | 73f123350f0fb0067464f2cfe939324b80ee6599 |
| js/app.js | add | e63a8d5272178ab0272795aded400db58c1103cb |
| sw.js | add (final: v3.302) | efb1e403594868c8f85457643580f58372c46d71 |
| .gitignore | add | — |
| ios-shell/package.json · ios-shell/capacitor.config.json · ios-shell/README.md · ios-shell/scripts/assemble-www.sh | add (new) | — |
| .github/workflows/ios-shell-sim.yml | add (new) | — |
| docs/checkpoints/l7a.md · docs/studio/sequence.md · docs/Checklist and Roadmap/BUILD_STATE.md | add | — |
| docs/studio/builder.html | add (regenerated by tools/studio-build: warnings 0; the L7 item renders — L21 grep, 3 hits) | — |

Docs ride L7a.1 (the recon) and L7a.3 (the record, sequence, BUILD_STATE, Builder) — the slice's entry describes
all three commits, so it lands with the commit that completes them. The three commits are pushed TOGETHER.
After each commit: `git show --stat HEAD` = exactly the files above; after L7a.3, `git status --porcelain` shows
none of the slice files and `git diff HEAD --stat` over them is empty.

## Gates (Sonnet, frontmatter-pinned), 2026-10-17

- **praxis-reviewer — HOLD on gate 6 only** (no written per-commit staging plan); gates 1–5, 7, 8 PASS, 9 N/A;
  "no mismatch on any number." Answered by the staging plan above. Re-grade requested on the revised tree.
- **fix-red-team — no blocks-commit finding.** Re-derived every hash, delta, grep, parse and harness exit; negative
  control (HEAD state.js → delete-test `LOAD FAIL: 'PRAXIS_API_BASE' is undefined`, exit 2) proves the harnesses
  exercise the new constant; every intermediate commit parses and the sims pass on the L7a.1 and L7a.2 trees.
  Taken in this build:
  - nit 1 → the zxing loader comment (views.js:7219) and the sw.js header (:8–9) no longer say "never precached /
    third-party CDNs" (comment-only; rides L7a.2).
  - residual 3 → the workflow now ends the app with `xcrun simctl terminate` so `--console-pty` returns and flushes on
    its own (SIGTERM only as a fallback after 10 s), and stopping the secondary `log stream` can no longer fail the
    step under `set -e` before the console is printed.
  - nit 4 → `grep -q` under pipefail replaced by `grep … > /dev/null` in the boot check.
  After these: a FRESH three-commit rehearsal (new scratch clone, real hook) — exit 0 ×3; L7a.1 and L7a.3 hook output
  empty; L7a.2 one WARN line (rule #4, vendor minified code) and 0 lines beginning `BLOCK`; the rehearsal's final
  tree equals the working tree for every slice code file; both intermediate trees parse.

## Residuals added by the gates

R11 the 4 vendor files (~850 KB raw) are precached, so every CACHE_VERSION bump re-downloads them (`cache:'reload'`);
before, Firebase came from gstatic's long-lived HTTP cache. Precaching zxing (needed only on the iPhone barcode path)
was the prompt's explicit 2d instruction; a later slice may move zxing to runtime caching · R12 "first available
iPhone" on macos-26 is likely an iOS 26.2 device, not 26.5 — the simulator is not pinned (the step prints the full list) ·
R13 pushing `.github/workflows/` needs a credential with the GitHub `workflow` scope; without it the whole three-commit
push is rejected (fails safe — nothing deploys) · R14 the BUILD_STATE row and the sequence Now item say "awaiting
commit and push" and go stale at the push; they are restated at the Stage 4/5 close · R15 sequence.md records the
January-1 ruling from chat (thirteenth sitting r4; twelfth r25–28), which the repo cannot verify; added as a recorded
ruling at Preston's instruction ("Add sequence.md's L7 entry"), not `PROPOSED:`.

## Final gate verdicts on the revised tree (2026-10-17)

- **fix-red-team (delta re-check): RED-TEAM: clean** — comment-only claim, Launch-step `set -e` paths, APP_ID scope,
  boot-check pipe, and every staging-plan blob id (real object DB + rehearse2) re-derived.
- **praxis-reviewer (re-grade): CLEARED TO COMMIT** — gate 6 PASS (every plan blob checked by content); gates 1–5, 7, 8
  PASS on the revised tree; 9 N/A. Blocking gates: none.
STOP — awaiting "commit and push".
