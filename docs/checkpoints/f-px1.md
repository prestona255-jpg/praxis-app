# F-PX1 — STAGE 1 (per-request cost bounds + google-books cap + 1f signed-out Yumi gate)

STARTED @ HEAD d6fd3ae / live v3.202 → CACHE_VERSION v3.203 at final commit.
Lane: netlify functions + client (yumi-ui.js). Parallel-safe vs Builder 1d (docs/studio/**).
0d DECISION: per-request caps only (Stage 1d skipped BY NAME). Stage 2 = beta-gate item (not built).

## Slices
- 1a/1b/1c claude-proxy.js — body 413 / max_tokens clamp / model pin
- 1a vision-proxy.js — image-size 413
- 1a elevenlabs-proxy.js — text-size 413
- 1a google-books-proxy.js — q-size 413 (Preston ruling #1)
- 1f yumi-ui.js — gate signed-out FAB send path (Preston ruling #2, ES3)
- 1e — client honesty VERIFY (RF1/LENS-1); extend where a caller lacks a distinct call-failed surface
- sw.js — CACHE_VERSION v3.202 → v3.203 (client changed: 1f)

Stable error shape for new rejections: `{ error: <human>, code: <stable_snake> }`.

## Slice results

### Byte deltas (git diff --numstat, LF-normalized; all ADDITIVE, uniform CRLF, no EOL flip)
| File | +lines | -lines | bytes before → after |
|---|---|---|---|
| netlify/functions/claude-proxy.js | 54 | 0 | 2443 → 5151 (+2708) |
| netlify/functions/vision-proxy.js | 18 | 0 | 9547 → 10396 (+849) |
| netlify/functions/elevenlabs-proxy.js | 15 | 0 | 4813 → 5447 (+634) |
| netlify/functions/google-books-proxy.js | 17 | 0 | 3997 → 4740 (+743) |
| js/yumi-ui.js | 39 | 0 | 82899 → 84797 (+1898) |
| sw.js | (version string) | | v3.202 → v3.203 (+0) |
| transcribe-proxy.js / shelf-vision.js | 0 | 0 | UNTOUCHED (already bounded — verify-only) |

CRLF check: the 4 functions + yumi-ui.js were all-CRLF from the first edit (CR==LF).
sw.js was FLIPPED CRLF→LF by the version-bump edit (whole file, CR=0/LF=135) — the
edit-tool EOL-normalize trap that `git diff` hides. **Caught by praxis-reviewer gate
#5**, RESTORED via `git checkout -- sw.js` + a byte-preserving PowerShell
ReadAllText/Replace/WriteAllText of only the version line → CR==LF==135, `w/crlf`,
git diff = the single version line. `git ls-files --eol` now shows all 6 touched
files `w/crlf`.

### Explicit-file staging list (parallel-lane guard — NEVER `git add -A`)
The working tree also carries the concurrent Builder-1d lane's dirt (docs/studio/**,
tools/studio-build) — NOT mine. Stage EXACTLY these 8:
`netlify/functions/claude-proxy.js netlify/functions/vision-proxy.js`
`netlify/functions/elevenlabs-proxy.js netlify/functions/google-books-proxy.js`
`js/yumi-ui.js sw.js docs/checkpoints/f-px1.md docs/checkpoints/f-px1-recon.md`
Then `git show --stat` must list exactly those 8 (no docs/studio/**, no tools/studio-build).

### Parse gate (ES3 client)
- `cscript //nologo //E:jscript tools/parse-check js/yumi-ui.js` → **PARSE OK, exit 0**.
- ES3 banned-token grep on ADDED lines only (=>/const/let/backtick/class): **clean**.
- Functions are Node (async/await) — NOT ES3-gated; they mirror the shipped shelf-vision/transcribe 413 idiom byte-for-byte in shape; live-verify post-push.

### Rejection paths present (grep-confirmed)
claude-proxy: MAX_BODY_BYTES(413) · ALLOWED_MODELS(400) · MAX_OUTPUT_TOKENS clamp · vision: MAX_IMAGE_B64_CHARS(413) · elevenlabs: MAX_TTS_CHARS(413) · google-books: MAX_Q_CHARS(413).

### 1e — client honesty (VERIFY-ONLY, no code change)
Every caller that could plausibly trip a cap surfaces a DISTINCT call-failed state:
- Yumi sendMessage: `!res.ok` → `throw` (yumi-brain.js:790-793) → runChat `.catch` → renderError. ✓
- Import segmentDoc: `!res.ok` → throw → runImport reject → `renderError(panel,'Yumi couldn't read those notes…')` (import-capture.js:542-544). ✓ (the >1 MB paste case)
- Shelf scan: non-200 → "Scan failed — please try again" (views.js:8168+), distinct from empty "No readable titles". ✓
- Lens/retrofit: RF1/LENS-1 already honest ("Yumi couldn't look…"). ✓
- classify: silent degrade → Uncategorized = ACCEPTED RESIDUAL (Preston ruling #3). Never trips caps under legit use: 20-book batch, model claude-sonnet-4-6 (allowed), max_tokens 1024 (<4096), body «1 MB. ✓ record, don't rebuild.
- elevenlabs TTS: on failure skips audio, renders text (graceful); Yumi lines never >5000 chars.

### 1f — signed-out Yumi gate: LOCAL LIVE PROOF (static-server :8761, signed-out, fresh code after SW/cache clear)
Gate placed in the send-button click handler (the single chokepoint — click, Enter-key at yumi-ui.js:1307, and voice `sendVoiceUtterance`:615 all funnel through `yumiSendBtnEl.click()`), AFTER the onboarding branch, BEFORE classifyUtterance/sendMessage.
- Preflight: `renderYumiSignedOut` defined = true (new code served), `getCurrentUser()` = null (signed-out).
- **SIGNED-OUT probe (GATE #1):** typed + Send → network-capture: **ZERO POST to claude-proxy** (only anon google-books-proxy backfill fired, 404 locally — confirms the 0c google-books signed-out finding). Panel renders **"Yumi is private / Sign in to think with Yumi…"** in place; FAB chrome untouched. NETWORK-CAPTURE PROOF, not narration.
- **SIGNED-IN probe (GATE #2):** stubbed `getCurrentUser → {uid}` → typed + Send → **claude-proxy attempted (2 POSTs = classifyUtterance + sendMessage)**, 404 only because functions don't run on the static server. Gate lets the signed-in path through UNCHANGED (only early-returns on null user; additive block, no existing line altered).
- **GATE #3 (seed-arc visitor untouched):** onboarding branch returns before the gate (code-verified); Home visitor page rendered clean.
- Console: only the expected `[yumi] sendMessage failed proxy 404` from the signed-in stub probe (demonstrates the honest error path) — no unexpected errors.

### Function per-request probes (413/400/clamp)
POST-PUSH only — the static server does not run Netlify functions (0f). Exact live probes recorded in the FINAL REPORT for the deployed endpoints.

## Review gates
- **fix-red-team (§9): RED-TEAM clean** — no block-commit findings. Re-derived fail-closed
  ordering, secret handling (no leak), clamp/pin edges, size measure, 1f single-chokepoint
  (Enter@1349 + voice@638 both route through .click(); other classifyUtterance caller is a
  test harness), caller coverage. Nits: fractional max_tokens → honest upstream 400 (no leak);
  1f is client-side defense-in-depth (Stage 2 covers the rest).
- **praxis-reviewer: HOLD → resolved.** Blocking gate #5 EOL — sw.js was CRLF→LF flipped by the
  version-bump edit. FIXED: git checkout + byte-preserving PowerShell replace → CRLF restored,
  all 6 files w/crlf, 1-line diff. Non-blocking doc gaps (yumi-ui before-byte, staging list)
  folded in. All other 8 gates PASS.

## Close-out
- **THIS commit (F-PX1 Stage 1) is LOCAL, NOT pushed.** 8 files, functions+client+sw.js+these
  2 checkpoints. HEAD ≠ origin/main d6fd3ae.
- Hook: ARMED; committed clean (WARN on backticks-in-comments in the Node function files = the
  documented raw-diff false positive; the ES3 client file yumi-ui.js has zero backticks + PARSE OK).
- Parallel-lane 1d dirt (docs/studio/**, tools/studio-build) left UNSTAGED and untouched.
- **PUSH GATED** on Preston's exact words. At push: rebase-before-push (fetch; if origin advanced
  via 1d, rebase, re-verify lane-only files, re-run parse gate on yumi-ui.js, re-read live sw.js
  ×2 → bump to live+1 if 1d shipped a bump first), then the live probe set (below).
- **Post-push live probes (deployed functions; authed on prestonpraxistest, prestona255 read-only):**
  1. claude-proxy: model 'claude-opus-4-8' → 400 {code:model_not_allowed}; body >1 MiB → 413
     {code:payload_too_large}; max_tokens 99999 → forwarded upstream shows 4096 (clamp observed).
  2. vision-proxy: image >7.5M chars → 413. elevenlabs: text >5000 → 413. google-books: q >300 → 413.
  3. legit-shape probe each caller still 200 (Yumi round-trip, a real scan, a real search).
  4. 1f on the deployed site signed-out: FAB send → prompt + ZERO claude-proxy (network capture).

## Live probe RESULTS (post-push, deployed CACHE_VERSION v3.203 confirmed; signed-out, no account written; prestona255 untouched)
Probes hit the deployed functions with the in-page x-praxis-key.
| Probe | Sent | Result | Verdict |
|---|---|---|---|
| claude-proxy model pin | `model: claude-opus-4-8` | **400** `{code:"model_not_allowed","model not allowed"}` | PASS — rejected before Anthropic |
| claude-proxy body cap | 1,150,087-byte body (>1 MiB) | **413** `{code:"payload_too_large","payload too large"}` | PASS — rejected before parse |
| claude-proxy clamp | `max_tokens: 10,000,000` | **200**, `stop_reason:end_turn`, out_tokens 4, model echo claude-sonnet-4-6 | PASS — the 200 proves the clamp (unclamped, Anthropic 400s on 10M > model cap; clamped→4096 succeeded) |
| claude-proxy legit | `sonnet, max_tokens:24` | **200** → text "pong" | PASS — real calls unchanged |
| elevenlabs cap | text 6,000 chars | **413** `{code:"payload_too_large","text too large"}` | PASS |
| google-books cap | q 400 chars | **413** `{code:"payload_too_large","query too large"}` | PASS |
| **1f signed-out Yumi** (fresh tab, clean network log) | FAB → type → Send, signed-out | network log = **0 requests to claude-proxy** (only anon google-books backfill); panel renders "Yumi is private / Sign in to think with Yumi…"; console clean | PASS — network-capture proof |

### Probe caveats (honest; neither a regression)
1. **google-books legit 200 unobtainable at probe time** — Google Books API returned its OWN upstream 503 (`"Service temporarily unavailable", domain:"global"`), which the proxy correctly relays (pre-existing behavior; the only change was the q-length 413, which PASSED). Re-confirm a 200 when Google recovers.
2. **vision-proxy image 413 — RULING (Preston, session close): DECLINED, cap STAYS AS-IS (7.5M b64 chars).** A >7.5M-char body (~7.5 MB) exceeds Netlify's ~6 MB synchronous-request platform limit, which 413s FIRST — so the platform is the effective gate and the function-level image cap (mirroring shipped shelf-vision) is documented **defense-in-depth above it**. A one-line lowering below ~5.8M + a cache bump is not worth the churn. No change.

**F-PX1 Stage 1: shipped, live, verified.** Deferred: Stage 2 auth-gating (beta-gate item, 0c); global daily volume ceiling (0d follow-up — @netlify/blobs or Firebase-SA+rules).
