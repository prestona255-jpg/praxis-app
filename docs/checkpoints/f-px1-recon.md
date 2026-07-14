# F-PX1 — PROXY COST-CAP + AUTH-GATING — Stage 0 RECON

STARTED. Lane: netlify functions + client proxy-call sites. Parallel with Builder 1d
(docs/studio/**, tools/studio-build, builder.html — NOT touched here). Commit-local, never push.

## 0a — Git state
- HEAD == origin/main == `d6fd3ae` (clean start). Branch `main`.
- Tree dirty only on `docs/studio/INDEX.md` (the 1d lane's file — not mine) + long pre-existing untracked list. My lane's files all clean.

## 0b — Proxy function census (netlify/functions/, 6 files, zero-dep Node 18+)
No `netlify.toml`, no `package.json`, no `node_modules` → functions run on Netlify's built-in runtime, **built-ins + global fetch only, no external deps**.
All 6 share the same CORS (`Allow-Origin: *`, POST/OPTIONS) + the `x-praxis-key` shared-secret gate (fail-CLOSED: 503 when env unset, 401 on mismatch). **The shared secret is embedded in the client (`PRAXIS_CLIENT_KEY`) → view-source recovers it; it stops randoms, not a determined caller. That is exactly why F-PX1 needs real per-request bounds.**

| Function | Bytes | Upstream (billable?) | Model pin | max_tokens | Payload-size cap | Notes |
|---|---|---|---|---|---|---|
| **claude-proxy.js** | 2443 | Anthropic Messages — **$$** | **NONE** | **NONE** | **NONE** | **Pure pass-through**: `JSON.parse(event.body)` → forwarded verbatim to Anthropic. Client picks model + max_tokens + body. **THE F-PX1 relay.** |
| **vision-proxy.js** | 9547 | Anthropic vision — $$ | pinned `claude-sonnet-4-6` (server) | pinned 2000 (server) | **NONE** | mediaType+image validated; server-built prompt. Missing only a size cap. |
| **elevenlabs-proxy.js** | 4813 | ElevenLabs TTS — $$ | voice/model/format pinned | n/a (TTS) | **NONE** (no text-length cap) | client controls only `text`. |
| **transcribe-proxy.js** | 6987 | ElevenLabs STT — $$ | pinned `scribe_v2` | n/a | audio ≤ 7,500,000 b64 chars → 413 | **already bounded.** |
| **shelf-vision.js** | 15482 | Anthropic vision — $$ | allowlist {sonnet-4-6, opus-4-8} | 4096 | image ≤ 7,500,000 → 413 | **already fully bounded + stop_reason guard. NOT app-wired** (de-risk endpoint). |
| **google-books-proxy.js** | 3997 | Google Books — low/free | n/a | n/a | **NONE** (no `q`-length cap) | cheap, but reachable signed-out (0c). |

## 0c — Client call-site map + signed-out reachability (the Stage-2 gate)
5-cluster census fanned out + adversarially cross-checked (workflow wf_7032390c-5de, 10 agents, all agree except book-search where the verifier caught a missed path).

**All claude-proxy callers send model `claude-sonnet-4-6`** (YUMI_WEB_MODEL / CLASSIFY_MODEL / SEG_MODEL all resolve to it). 14 claude-proxy sites: 12 in yumi-brain.js (92,745,785,985,1268,1721,1965,2341,2363,2674,2827,3007), classify (integrations.js:2203), segmentDoc (import-capture.js:141). max_tokens observed: 64–1024, **plus segmentDoc = 4096 (the clamp ceiling)**. classify batches 20 books/call (CLASSIFY_BATCH), not 130 at once.

| Cluster | Proxy | Entry point | Auth gate | Signed-out? |
|---|---|---|---|---|
| **Yumi chat** | claude-proxy ×12 | Body-level Bloom FAB — `renderYumiPanel` appends to `document.body` unconditionally at DOMContentLoaded (yumi-ui.js:1325-1328,1423-1427); `position:fixed;z-index:9999` on every route incl. logged-out. Click→send→`classifyUtterance`(yumi-brain.js:3007)→`sendMessage`(:785). | **NONE** on chat path. `appendTurn` no-ops when uid null (:135-139) but does NOT block the fetch. Only `isVoiceOn()` (uid-gated) blocks the **TTS** path. | **YES** ✅ (reader+verifier agree) |
| Yumi TTS | elevenlabs-proxy (integrations.js:2397 via playLine) | renderYumiMessage speak branch (yumi-ui.js:255) | `isVoiceOn()` → false when `resolveActiveUid()` null | no |
| Book classify | claude-proxy (integrations.js:2203) | Shelf "Categories" toggle / Re-classify | `renderShelf` hard-returns signed-out (views.js:4001-4006); trigger re-checks `getCurrentUser()` (:4844) | no |
| Import/segment + dictate | claude-proxy (import-capture.js:141) + transcribe-proxy (:1065) | Notebook composer Paste/Import/Dictate chips (views.js:2827-2829) | `renderNotebook` early-returns `buildNotebookSignedOut` (views.js:1797-1801) | no (UI); **endpoint itself unguarded — console `window.ImportCapture.segmentDoc` bypass exists, not a UI path**) |
| Shelf photo scan | vision-proxy (views.js:8131) | "Scan shelf" chip in Manage sheet | `renderShelf` hard-return (:4001-4006) + `if(user)` wrap (:4330) | no |
| **Google Books search** | google-books-proxy ×3 (integrations.js:1789,1868,2227) | add-a-book / cover resolve / bulk — **AND an un-gated startup cover-backfill: `app.js:37-52` DOMContentLoaded loops seed bookIds → `fetchAndApplyCover`→`fetchGoogleBooks`→POST, no `getCurrentUser`; `stateKey()`→`praxis_state_anon` signed-out** | **NONE on the startup backfill path** | **YES** ✅ (verifier overturned reader's "no") |

**0c VERDICT: NOT all callers authed → NO.** Two callers fire signed-out: Yumi chat (claude-proxy, billable) and Google Books cover-backfill (google-books, cheap). → **Stage 2 (auth-gating) becomes a named beta-gate item; Stage 1 ships alone.**

## 0d — Budget-counter mechanism
- Zero deps + **no service-account / Firebase-Admin creds in the function env** (grep clean) → **no fail-closed global store is buildable today without new infrastructure.**
- Options (each needs a Preston decision — flagged, none taken):
  - **(A)** add `package.json` + `@netlify/blobs` → real global daily counter (~30 lines/fn). Cheapest real option, but introduces the repo's first build dependency + changes the deploy shape.
  - **(B)** Firebase service-account env var + Firestore REST atomic-increment + a deny-by-default counter doc in `firestore.rules` (rule diff presented BEFORE any write). Heavier; touches rules (a non-goal unless strictly required).
  - **(C)** ship per-request bounds as the ceiling now; document the daily ceiling as deferred, needing (A) or (B).
- Existing "cap": a **client-side** per-day localStorage rate cap in yumi-brain.js (`_yumiRouterBudgetSpend` ~2916-2925) — trivially bypassed (clear localStorage / direct API). Not a server ceiling.
- **Recommendation: (C) now** — matches the task's 0d rule ("per-request caps don't need persistence; Stage 1 proceeds regardless"); Stage 1d **skipped BY NAME**, daily ceiling filed as a follow-up requiring (A)/(B).
- **DECISION (Preston, 2026-07-13): (C) per-request caps only.** Stage 1d is skipped BY NAME. Global daily volume ceiling filed as a deferred follow-up (needs 0d-A `@netlify/blobs` or 0d-B Firestore-REST — Preston's future call). No new infra / deps / rules edits this lane.

## 0e — Stage-1 byte estimates (agent estimates run ~2× low → ranges)
- claude-proxy.js (2443 B): +body-size 413 + model-allowlist 400 + max_tokens clamp ≈ **+1000–1800 B**.
- vision-proxy.js (9547 B): +image-size cap ≈ **+400–800 B**.
- elevenlabs-proxy.js (4813 B): +text-length cap ≈ **+400–800 B**.
- google-books-proxy.js (3997 B, OPTIONAL): +`q` cap ≈ **+300–600 B**.
- transcribe-proxy.js / shelf-vision.js: **+0** (verify-only).
- Client 1e (import-capture.js/views.js, ES3): mostly verify; optional paste pre-guard/failure surface ≈ **+0–600 B**. sw.js: version-string bump, **+0 net**.
- **Stage 1 total ≈ +2100–4600 B** across 3–4 function files + minimal client.

## 0f — Local test capability
- Node blocked + no netlify.toml/package.json → **cannot run `netlify dev` locally.**
- Verification path = post-push probes against the DEPLOYED functions (`praxis-reading.netlify.app/.netlify/functions/*`): oversized→413, disallowed model→400, clamp observed in the forwarded upstream call. Authed probes on **prestonpraxistest**; **prestona255 = read-only always**.
- Parse gate (`tools/parse-check`) covers structure pre-push; behavioral proofs are post-push.

## Proposed Stage-1 per-proxy caps (for Preston's confirm at the HALT)
| Proxy | body/text 413 cap | max_tokens clamp | model pin (400) |
|---|---|---|---|
| claude-proxy | **1,048,576 B** (1 MiB; segmentDoc paste is the unbounded setter — recommend + confirm) | min(client, **4096**) | `{claude-sonnet-4-6}` |
| vision-proxy | image ≤ **7,500,000** b64 chars (mirror shelf-vision) | (already 2000, server) | (already sonnet-4-6, server) |
| elevenlabs-proxy | text ≤ **5,000** chars | n/a | (already pinned) |
| google-books (opt) | `q` ≤ **300** chars | n/a | n/a |
| transcribe / shelf-vision | already bounded — verify only | — | — |

Residual the per-request caps DON'T close: call **volume** (input-token cost-DoS) — only the deferred daily ceiling (0d A/B) closes it.
