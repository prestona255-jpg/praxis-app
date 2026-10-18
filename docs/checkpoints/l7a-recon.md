L7a STARTED — 2026-10-17

# L7a — THE APP SHELL, FIRST SLICE — Stage 0 recon

Model: Opus 5.5 executes; gate agents Sonnet (frontmatter). Agent bar LIFTED by the
go-ahead sentence "run fix-red-team on this" (CLAUDE.md § Verification).
Stage 0 is read-only on the app; this checkpoint file is the one write (FIX-PROTOCOL §1
write-test-first, which outranks the prompt's "read-only" — named, not absorbed).

## Standing files read

FOUND: CLAUDE.md · PROTOCOL.md (v1.2) · docs/FIX-PROTOCOL.md (v1.3) ·
.claude/agents/{fix-implementer, fix-red-team, praxis-recon, praxis-reviewer, repo-mapper,
studio-mockup, studio-scan}.md · docs/studio/sequence.md · docs/Checklist and Roadmap/BUILD_STATE.md.
MISSING: none.

## Ground truth (`sh tools/ground-truth`, exit 0)

HEAD a0c7ce4 · hook gate ARMED (core.hooksPath = hooks) · FIX-PROTOCOL v1.3 · 7 agents listed.
HEAD == origin/main == a0c7ce4906149c774d06bff40ec29ba343866ed2. Live Netlify deploy
6aca5da1… is commit a0c7ce4 (Netlify API).

## 0.1 Baseline

- branch main; tracked tree clean (`git status --porcelain | grep -v '^??'` empty); 111 untracked paths (not this task's).
- sw.js:10 `var CACHE_VERSION = 'praxis-v3.299';` — as expected; nothing landed since a0c7ce4 (`git log a0c7ce4..HEAD` = 0).
- Foundations: lumen-amber.css 14,966 B md5 070679b0… · marks.js 10,255 B md5 772886c0… — both match FIX-PROTOCOL §2.

## 0.2 Relative function URLs — 6 code sites (`grep -n "'/.netlify/functions/" js/*.js`)

| # | file:line | site | live reader |
|---|---|---|---|
| 1 | js/import-capture.js:33 | `var TRANSCRIBE_PROXY_URL = '/.netlify/functions/transcribe-proxy';` (indented, inside a function scope) | :350 fetch |
| 2 | js/integrations.js:12 | `var CLAUDE_PROXY_URL = '/.netlify/functions/claude-proxy';` | **NONE** — zero reads; see drift D2 |
| 3 | js/integrations.js:13 | `var GOOGLE_BOOKS_PROXY_URL = '/.netlify/functions/google-books-proxy';` | :1981, :2068, :2503 fetch |
| 4 | js/integrations.js:2626 | `var ELEVENLABS_PROXY_URL = '/.netlify/functions/elevenlabs-proxy';` | :2684 fetch |
| 5 | js/views.js:9351 | `var SCAN_VISION_URL = '/.netlify/functions/shelf-vision';` | :9369 aiProxyRequest |
| 6 | js/yumi-brain.js:104 | `aiProxyRequest('/.netlify/functions/claude-proxy', payload)` inside `aiProxyFetch` | — |

Other ways a function is reached: none. `grep -n "netlify/functions\|\.netlify" js/*.js index.html sw.js manifest.json`
adds only sw.js:43 (`isApiRequest` substring test — a matcher, not a call; stays correct for absolute URLs).
No template literals; no concatenated '/.netlify' builders.

**Other relative RUNTIME fetch (not a function, but breaks in the shell if not bundled):**
js/yumi-brain.js:11 `var YUMI_VOICE_URL = '/docs/yumi-voice.md';` fetched at :17. Resolves to
capacitor://localhost/docs/yumi-voice.md inside the shell → must be copied by assemble-www.sh.

CORS premise check (the absolute URL only works if the functions answer cross-origin):
every function answers OPTIONS with `Access-Control-Allow-Origin: *` and allows the headers each
caller sends — claude-proxy.js:33-39 + shelf-vision.js:54-60 allow `Content-Type, x-praxis-key, Authorization`
(callers send all three via aiProxyRequest, yumi-brain.js:83-90); google-books-proxy.js:9-15,
elevenlabs-proxy.js:25-31, transcribe-proxy.js:31-33 allow `Content-Type, x-praxis-key` (callers
integrations.js:1983/2070/2505/2686, import-capture.js:338 send exactly those). No origin/referer gate
in netlify/functions/ (grep empty). Premise HOLDS: only the URL needs changing.

## 0.3 Runtime external loads

Greps run: `grep -noE "(src|href)=\"[^\"]*\"" index.html`; `grep -n "https\?://" js/*.js` (non-comment);
`grep -n "https\?://\|@import\|url(" assets/*.css`; `grep -n "createElement('script')\|importScripts\|new Worker\|XMLHttpRequest" js/*.js index.html sw.js`;
`grep -noE "['\"]/(assets|docs|js|vendor|...)[^'\"]*['\"]" js/*.js`.

| file:line | load | runtime? | L7a action |
|---|---|---|---|
| index.html:77-79 | firebasejs 10.12.5 app/auth/firestore compat (gstatic) | yes | vendor (Stage 2) |
| js/views.js:7239-7240 | `<script>` @zxing/library@0.20.0 UMD (jsdelivr), `loadZxingLibrary` | yes, lazy | vendor (Stage 2) |
| index.html:10-12 | Google Fonts preconnect ×2 + css2 stylesheet | yes | stays (L1) |
| assets/lumen-amber.css:21 | Google Fonts `@import` | **NO — inside a `/* … */` comment (:19-24)** | none (prompt expectation off; D3) |
| js/integrations.js:1913, :1933 | openlibrary.org api/isbn fetch | yes | stays (absolute, works in shell) |
| js/integrations.js:2164 | covers.openlibrary.org image URL | yes (img) | stays |
| js/views.js:247, :251 | bookshop.org links | navigation only | stays |
| index.html:28 | `/docs/studio/universal-depth.css` (relative, from docs/) | yes | assemble-www must copy it |
| js/yumi-brain.js:11 | `/docs/yumi-voice.md` (relative, from docs/) | yes | assemble-www must copy it |
| index.html:8-9, 13-16, 21, 80-102 | manifest, icon, assets/*, js/* (relative) | yes | assemble-www copies |

http://www.w3.org/2000/svg namespace strings (views.js ×7) are not loads.

## 0.4 Web-only API inventory (iOS WKWebView, capacitor:// scheme)

| file:line | API | Praxis use | works in iOS WKWebView? |
|---|---|---|---|
| integrations.js:740 | `signInWithPopup` | Google sign-in | **no** — WKWebView has no popup window for Firebase OAuth; expected failure until L7b |
| integrations.js:1205 | `reauthenticateWithPopup` | delete-account re-auth | **no** — same; L7b |
| index.html:106-170 | `navigator.serviceWorker` | offline shell + update banner | **no** — SW needs App-Bound Domains; custom scheme unsupported → guarded (Stage 3a) |
| import-capture.js:295, :373; views.js:9626-9627 | `getUserMedia` | dictation mic; scan camera | **unknown** — WebKit supports it since iOS 14.3, but the L7a scaffold adds no NSCameraUsageDescription / NSMicrophoneUsageDescription → expect denial or crash if tapped; Stage 5 does not tap (residual → L7b) |
| import-capture.js:303-381 | `MediaRecorder` | dictation v2 | **unknown** — Stage 5 feature line measures presence |
| voice-input.js:12 | `SpeechRecognition` / `webkitSpeechRecognition` | live dictation | **unknown** — Stage 5 measures |
| views.js:9833-9836 | `BarcodeDetector` | native barcode loop | **no** (not in WebKit) → falls back to zxing, which is why zxing is vendored |
| (none) | `window.open` | no client call site (grep: only `window.openSymbolPicker`/`openMarkComposer` assignments, views.js:13638/13642) | n/a |
| integrations.js:3166-3172, :3176-3184 | anchor `download` + `navigator.share({files})` | Export | **unknown** — share sheet likely; anchor download unlikely without a native download delegate |
| state.js:252, :262 | `localStorage` via `ls`/`sv` | all local state | **yes**, but OS may evict WKWebView storage under pressure (residual) |
| views.js:2956-2959 | `indexedDB` | notebook photos | **yes** (expected) |

## 0.5 Shell detection — CONFIRMED at source, pinned version

- Docs: https://capacitorjs.com/docs/core-apis/web — "available at `window.Capacitor`"; `isNativePlatform: () => boolean`.
  The docs page does NOT state injection timing, so source was read at the pinned tag:
- https://raw.githubusercontent.com/ionic-team/capacitor/8.5.2/ios/Capacitor/Capacitor/JSExport.swift:18-20 —
  `exportCapacitorGlobalJS` installs `WKUserScript(source: data, injectionTime: .atDocumentStart, forMainFrameOnly: true)`
  (native-bridge.js, :26).
- https://raw.githubusercontent.com/ionic-team/capacitor/8.5.2/core/native-bridge.ts:931-936 — `const isNativePlatform = () => true; … cap.isNativePlatform = isNativePlatform;`, `win.Capacitor = cap` (:911/:1135).
- `.atDocumentStart` runs before any document script, so state.js (index.html:80) sees it. Premise HOLDS; no alternative needed.
- The guard `typeof window.Capacitor.isNativePlatform === 'function'` is correct on the web (window.Capacitor undefined → '').

## 0.6 Capacitor version — PIN 8.5.2

- https://github.com/ionic-team/capacitor/releases — newest stable is 8.5.3 (2026-10-07) = **10 days old → too new**.
- **8.5.2** — https://github.com/ionic-team/capacitor/releases/tag/8.5.2 — 2026-09-11 (36 days), stable, not pre-release.
  core/cli/ios package.json at tag 8.5.2 all read `"version": "8.5.2"`; cli engines `"node": ">=22.0.0"`.
- Capacitor 8 requires Xcode 26+. 9.x is alpha only.
- `loggingBehavior?: 'none' | 'debug' | 'production'` (default debug) — top-level key confirmed at
  cli/src/declarations.ts:47 @8.5.2.

## 0.7 Cloud Mac — GitHub Actions

- Repo **PUBLIC** (`api.github.com/repos/prestona255-jpg/praxis-app` → `"private": false`; Netlify deploy also says `public_repo: true`).
- https://docs.github.com/en/billing/concepts/product-billing/github-actions — "GitHub Actions usage is free for self-hosted runners and for public repositories that use standard GitHub-hosted runners." → macOS minutes cost $0 on this repo. (Private would bill `actions_macos` at $0.062/min.)
- Runner: `runs-on: macos-26` (arm64; `macos-latest` also points here; macos-14 deprecated). Image 20260907.0351.1, macOS 26.6.2.
  Xcode pinned `/Applications/Xcode_26.6.app` (26.6, 17F113, the image default) via `sudo xcode-select -s`.
  Simulators on that Xcode: iOS 26.5 runtime (iPhone 17 / 17 Pro / 17 Pro Max / 17e / Air). Image Node 24.20.0; setup-node pins 24 (≥22 required).
  Source: https://raw.githubusercontent.com/actions/runner-images/main/images/macos/macos-26-arm64-Readme.md:8-26, :157-224.
- `gh` is NOT installed on this machine (`gh: command not found`) → Stage 5 trigger + artifact download are Preston's (see F6).

## 0.8 Netlify safety — PARTIAL (docs do not speak to subfolders explicitly)

- https://docs.netlify.com/build/configure-builds/manage-dependencies/ — "If your build requires any JavaScript dependencies, you must list these in a `package.json` saved in the site's base directory in your repository." The page does not explicitly address a package.json in a subfolder, nor the no-build-command case. **Honest status: implied, not stated.**
- No netlify.toml, no _headers, no _redirects at the repo root (`ls` → absent). The live deploy record (Netlify API, deploy 6aca5da1…): `framework: unknown`, deploy_time 8 s, "No redirect rules processed", "No header rules processed", 5 functions. Base directory / build command not readable via the API tools available.
- Side effect to know: Netlify publishes the REPO ROOT, so `ios-shell/` (package.json, README, script) and `vendor/` become public static files. Harmless; `.github/` is a dot-dir.
- Backstop: Stage 4 checks the first deploy after push; if Netlify ever ran an install it shows in the deploy log/time.

## 0.9 Precomputed deltas (LF blobs, measured `printf … | wc -c` on the exact strings)

Baselines (`git show HEAD:<f> | wc -c`, all blobs CR=0): state.js 187,395 · integrations.js 194,808 ·
views.js 1,251,705 · yumi-brain.js 151,384 · import-capture.js 22,144 · app.js 4,187 · index.html 9,587 ·
sw.js 6,041 · .gitignore 847. Working trees: index.html and yumi-brain.js are CRLF (w/crlf), the rest LF.

| stage | file | delta | prompt | match |
|---|---|---|---|---|
| 1 | state.js | +301 (2 lines + 2 LF; `·` = 2 B) | +301 | ✔ |
| 1 | integrations.js | +54 (3 × 18) | +54 | ✔ |
| 1 | views.js / yumi-brain.js / import-capture.js | +18 each | +18 | ✔ |
| 2 | index.html | −54 (3 × −18) | −54 | ✔ |
| 2 | views.js | −34 (measured: old URL 67 B → new 33 B) | −34 | ✔ |
| 2 | sw.js | +205 (4 entries, inserted after `'/assets/wheat-field.svg',`, before `'/js/state.js',` — each with comma, no existing line edited) | state it | — |
| 3 | index.html | +130 (2-space indent + 127-char guard + LF) | state it | — |
| 3 | sw.js | +0 (`v3.299` → `v3.300`, equal length) | +1 bump | — |
| 3 | .gitignore | +54 for the three paths (+ any comment line) | — | — |
| 3 | app.js | floor ~+400 (one guarded console.log line builder) | — | — |

Net: index.html +76 · views.js −16 · sw.js +205.
First top-level `var` in state.js is :271 `var state = {` (preceded by `function sv` ending :269 and a blank :270) — insertion lands at :271.

## 0.10 Pre-existing drift (SEPARATE — not fixed here)

- D1 sw.js APP_SHELL omits `/js/intros.js` (index.html:99) and `/docs/studio/universal-depth.css` (index.html:28) — an offline cold start misses both.
- D2 integrations.js:12 `CLAUDE_PROXY_URL` has ZERO readers; integrations.js:2435 says the classify site "reaches claude-proxy through the CLAUDE_PROXY_URL constant" but :2444 routes through `aiProxyFetch`. Prefixing it is inert.
- D3 lumen-amber.css:21 Google-Fonts `@import` is commented out — not a runtime load.
- D4 CLAUDE.md "Live: praxis-reading.netlify.app"; Netlify's primary domain is **praxisreader.com** (deploy `url`/`alias`).
- D5 BUILD_STATE.md stamp 2026-07-03 / v3.172 — stale; S-B carries an open "retire or refresh" ruling.
- D6 praxis-recon.md and praxis-reviewer.md still expect lumen-amber 14,681 B; the lock is 14,966 B → reviewer gate 2 will false-FAIL unless told.
- D7 stale worktree `.claude/worktrees/zealous-bose-8a1e6a/` still on disk.
- D8 fix-implementer `model: inherit` (known, CLAUDE.md MODEL LAW follow-on).
- D9 sequence.md has no L7 / Capacitor / App Store entry — the Jan 1 bundled-app ruling lives only in chat.

## Forks and conflicts (FORK-VERBATIM)

- F1 HOOK vs COMMIT PLAN. hooks/pre-commit rule #3 BLOCKS any commit staging served source (js/*.js) without sw.js. L7a.1 stages 5 js files and no sw.js → blocked. Moving the bump does not help (then L7a.3, which stages index.html + app.js, is blocked). Options: (a) `--no-verify` on L7a.1 only, reason in the body (nothing deploys between the three local commits; the one bump rides L7a.3) — REC; (b) two bumps (contradicts "exactly one").
- F2 API ORIGIN. The prompt bakes `https://praxis-reading.netlify.app`; production's primary domain is `https://praxisreader.com`. The netlify.app host currently serves directly (no redirect rules in the deploy; Netlify does not auto-redirect the subdomain) — but this machine cannot reach either origin to measure (curl 000 / exit 56). A future 301 netlify.app→custom domain would break every shell preflight. Options: (a) keep netlify.app for L7a as ruled, revisit before an L7b binary ships — REC; (b) praxisreader.com now.
- F3 CONSOLE CAPTURE. Capacitor forwards page console via CAPLog → `Swift.print` → **stdout** (CAPLog.swift @8.5.2; Console.swift `CAPLog.print("⚡️  [level] - msg")`), which `log stream` (unified logging) does not carry. Spec'd Stage 3e capture would return an empty log and Stage 5 could not read the [praxis-shell] line. Options: (a) launch with `xcrun simctl launch --terminate-running-process --stdout=<file> --stderr=<file> booted <id>`, keep `log stream` as a secondary artifact — REC; (b) as written.
- F4 (mechanical, carried) assemble-www.sh adds `docs/studio/universal-depth.css` + `docs/yumi-voice.md` (single files, not docs/) under the prompt's own "any other runtime path" clause.
- F5 STAGE 4 DISCHARGE. Origin unreachable from this box (curl 000, exit 56; the Browser pane navigation to praxis-reading.netlify.app was denied). Signed-in checks also need a throwaway session I cannot sign into. Per PROTOCOL §9 v1.2 the live check is discharged by Preston from a written click-path.
- F6 STAGE 5 HANDS. `gh` absent → Preston presses "Run workflow"; artifact zip download needs GitHub auth even on a public repo → Preston drops the zip where I can read it.
- F7 DEPENDENCY HALT (PROTOCOL §6.4). Capacitor devDeps (build-time, ios-shell/ only) + vendored ES2017+ bundles enter the repo. Authorized by this prompt; vendored bytes are third-party, exempt from the ES3 floor and the parse harness; hook #4 will WARN (non-blocking) on vendor/*.js.

## Residuals to carry

R1 fonts on CDN until L1 · R2 Google popup sign-in fails in the shell until L7b · R3 bundle ID placeholder ·
R4 no camera/mic usage strings in the scaffold · R5 package-lock not committed until after the first CI run (transitive deps float) ·
R6 WKWebView storage eviction · R7 ios-shell/ and vendor/ served publicly by Netlify.

## §1#8 recon-reviewer gate — fix-red-team (Sonnet), 2026-10-17

Verdict: **no blocks-build on the recon's facts.** It re-derived every 0.2/0.4 anchor, found the census complete
(only the extra runtime load is /docs/yumi-voice.md, already caught; wheat-field.svg has no runtime consumer),
confirmed CORS on success AND error paths (incl. lib/ceiling.js:67-68 401/429/503 carry ACAO *), the state.js
insertion (:250 'use strict', :271 first top-level var), every byte prediction, F1 (hook #3) and F3 (stdout).
Folded into the plan:

- RT-1 (F3 refined): `--stdout=<file>` is block-buffered — the line can be lost. Capture with
  `simctl launch --console-pty` (line-buffered) under a timeout. CAPLog forwarding is on only when
  `loggingBehavior:'debug'` AND the build is **Debug** → the workflow builds `-configuration Debug`, stated.
  CAPLog truncates at 4068 chars → the feature line stays far under.
- RT-2 (F1 refined): before the `--no-verify` on L7a.1, run `sh hooks/pre-commit` on the staged set and show the
  ONLY block is rule #3 (rules #1/#2/#5 still proven); record it in the commit body.
- RT-3: Stage 1 also re-runs tools/delete-test, tools/export-test, tools/fx1c-sim (they load real state.js +
  integrations.js; `window = this` → window.Capacitor undefined → base '').
- RT-4: the three commits are pushed TOGETHER — L7a.1/L7a.2 alone would ship served source with no bump.
- RT-5 (F2): the "no auto-redirect" claim is docs-supported (apex/www only) but UNMEASURED. One line for Preston on an
  unfiltered network: `curl -I https://praxis-reading.netlify.app/` → expect 200, not 301. A 301 breaks every shell call now.
- RT-6: Stage 2 records the exact vendor paths, sha256 ×2 per download, and `git show :vendor/<f> | sha256sum` ==
  download (autocrlf=true). Exact Stage-1 lines are the prompt's §1a strings verbatim.
- RT-7: hook rule #4 prints whole minified lines from vendor/*.js (~336 KB for zxing) — commit output is truncated/redirected.
- RT-8: verify `git ls-files --eol` after editing index.html / yumi-brain.js (w/crlf working trees).
- RT-9: signed-out Stage 5 cannot exercise any proxy path (all need a Firebase ID token / Google popup). L7a proves the
  base resolves and the shell opens — NOT "API base verified in the shell". Said plainly in the report.
- D7 corrected: three stale worktrees — peaceful-joliot-2f5c97, relaxed-lederberg-ac8a2a, zealous-bose-8a1e6a.

HALT — awaiting go-ahead for Stage 1.

## Rulings at the go-ahead (Preston, 2026-10-17)

- F1 — `--no-verify` REFUSED. The hook enforces FIX-PROTOCOL §2; the prompt's "one bump in the last commit" is
  RETRACTED. Each commit bumps once and stages sw.js: L7a.1 → praxis-v3.300 · L7a.2 → praxis-v3.301 ·
  L7a.3 → praxis-v3.302. Each commit passes the hook unmodified; each bump is +0 B.
- F2 — KEEP https://praxis-reading.netlify.app as PRAXIS_API_BASE. Preston verified from outside this network on
  17 Oct that it serves the app directly (no redirect to praxisreader.com). **Primary-domain finding recorded:**
  Netlify's primary domain for site praxis-reading is https://praxisreader.com (deploy `url`/`alias`); re-check the
  netlify.app host before L7b. CLAUDE.md's "Live:" line is NOT edited in this slice — logged as a separate doc fix.
- F3 — ACCEPTED: Debug build + `xcrun simctl launch --console-pty`; `log stream` kept as a second artifact.
  Stage 5 PASS still requires `yumi-brain: voice doc loaded (`.
- COPY LIST — accepted: assemble-www.sh copies docs/studio/universal-depth.css and docs/yumi-voice.md (only those
  two from docs/) and prints them.
- HAND-OFFS — accepted: Stage 4 is Preston's on-device check from the written click-path; Stage 5 Preston presses
  "Run workflow" and drops the artifact zip.
- PRE-EXISTING ITEMS — logged only, not fixed in L7a: SW precache missing intros.js + universal-depth.css (D1);
  CLAUDE.md domain line (D4); BUILD_STATE staleness (D5); agent byte expectation for lumen-amber.css (D6); stale
  worktrees (D7). sequence.md gains its L7 entry as part of this slice (D9) — nothing else from the list.
