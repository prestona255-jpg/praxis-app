P1 FIX ROUND 2 STARTED — 2026-09-03, base c8a35ae / v3.298

# P1 FIX ROUND 2 — D1 · D2 · D3 · R1

The three defects and one residual found by the five read-only verification checks on `c8a35ae`.
Model: Opus 5 (MODEL LAW v2 — "OPUS EXECUTES" already-ruled work; this is a fix session on ruled
defects). Gate agents stay Sonnet by frontmatter. Governing docs: CLAUDE.md · PROTOCOL.md v1.2 ·
docs/FIX-PROTOCOL.md v1.3. Prior record: `docs/checkpoints/p1-safety-build.md`.

| id | defect | source |
|---|---|---|
| **D1** | `classifyBooksViaLLM` (integrations.js:2419, fetch :2434 via `CLAUDE_PROXY_URL`) still fetches claude-proxy directly — no token, uncounted, and 401 once v3.295 deploys | check 2 |
| **D2** | the report's click-path says the `aiUsage` doc "will read `count: 4`"; count-before-upstream makes it 3 | check 4 |
| **D3** | residual R2-1 has no clause for the ceiling ghost-doc case | check 5 |
| **R1** | a still-valid token for a DELETED user passes `verifyIdToken`, reads null, and `_writeUsage` recreates `aiUsage/{uid}` while the upstream call proceeds | check 5 |

Preston's rulings on the Stage 0 fork + carries (verbatim): Option A — mint the SA token with scopes
`datastore identitytoolkit`, one token, one cache; `accounts:lookup` with `localId`; an empty users
array = user-not-found → 403; any other lookup failure → 503, fail closed. All three mechanical carries
approved: parse-check in place of `node --check`; the decision logic in ceiling-core with trace proof
for the glue; yumi-ui 403 rendering left as a reported follow-up. Bump to `praxis-v3.299` with sw.js.

ENCODING RULE in force: every write goes through a byte-safe path (Write tool / heredoc / `perl` with
`use bytes`); after EVERY write the C3 A2 marker grep runs on that file and its count is reported here.
Any nonzero = STOP + restore from HEAD.

---

# STAGE 0 — PRE-FLIGHT (read-only) — PASS

## 0.1 Protocol docs

| Found | Missing |
|---|---|
| CLAUDE.md · PROTOCOL.md v1.2 · docs/FIX-PROTOCOL.md v1.3 · BOARD.md · docs/studio/sequence.md · docs/launch-runway.md · proposals/README.md · docs/studio/LAUNCH-STATUS.md | **docs/LAUNCH-STATUS.md** |

All seven agent files present: `fix-red-team` · `fix-implementer` · `praxis-recon` · `praxis-reviewer` ·
`repo-mapper` · `studio-mockup` · `studio-scan`. Frontmatter re-verified: every gate agent `model: sonnet`;
`fix-implementer` still `model: inherit` — the one exception CLAUDE.md already records. The missing file is
FIX-PROTOCOL's ledger pointer (unchanged since the last session); `docs/launch-runway.md` is the live ledger.

## 0.2 Base

```
HEAD                c8a35ae094e1e3a596116d313d15d2d10d0c0a74
tracked-dirty       0
CACHE_VERSION       praxis-v3.298
lumen-amber.css     070679b03453ca0d8405cb6f92ec5ad2   (locked, unchanged)
marks.js            772886c049d0d6d03d341507e602d88a   (locked, unchanged)
```

## 0.3 Three-layer fetch census (before)

**(a) every constant holding a Netlify function path**
```
js/import-capture.js:33   TRANSCRIBE_PROXY_URL   = '/.netlify/functions/transcribe-proxy'
js/integrations.js:12     CLAUDE_PROXY_URL       = '/.netlify/functions/claude-proxy'
js/integrations.js:13     GOOGLE_BOOKS_PROXY_URL = '/.netlify/functions/google-books-proxy'
js/integrations.js:2610   ELEVENLABS_PROXY_URL   = '/.netlify/functions/elevenlabs-proxy'
js/views.js:9351          SCAN_VISION_URL        = '/.netlify/functions/shelf-vision'
```

**(b) `fetch(<NAME>` per constant**
```
fetch(CLAUDE_PROXY_URL         js/integrations.js:2434          <- D1
fetch(GOOGLE_BOOKS_PROXY_URL   js/integrations.js:1981, 2068, 2487
fetch(ELEVENLABS_PROXY_URL     js/integrations.js:2668
fetch(TRANSCRIBE_PROXY_URL     js/import-capture.js:350
fetch(SCAN_VISION_URL          (none — hoisted at Item 1)
fetch(PROXY_URL                (none — the constant was retired at Item 1)
```

**(c) every bare `fetch(` in js/ — 10 hits, all accounted for**

| file:line | classification |
|---|---|
| js/yumi-brain.js:83 | **through the door** — the `fetch` inside `aiProxyRequest` itself, correct |
| js/integrations.js:2434 | **direct → claude-proxy — D1, the defect** |
| js/integrations.js:1981 · 2068 · 2487 | direct → google-books-proxy (explicit non-goal: separate quota) |
| js/integrations.js:2668 | direct → elevenlabs-proxy (TTS; not an AI-ceiling proxy) |
| js/import-capture.js:350 | direct → transcribe-proxy (ElevenLabs STT; not an AI-ceiling proxy) |
| js/integrations.js:1914 · 1934 | non-Netlify — `openlibrary.org` cover/metadata lookups |
| js/yumi-brain.js:17 | non-Netlify — `/docs/yumi-voice.md` (a static doc read) |

**Result: exactly one direct claude-proxy fetch (D1) and zero others to a ceiling-covered endpoint.**
Scope unchanged; no STOP.

## 0.4 Anchors (quoted verbatim)

**The door** — `js/yumi-brain.js:77` (`aiProxyRequest`) and `:103` (`aiProxyFetch`). The Authorization
header is attached at **yumi-brain.js:86**:
```js
        'Authorization': 'Bearer ' + token
```
`aiProxyRequest` resolves `{ status, ok, json, text }` for ANY status and rejects only when there is no
signed-in Firebase user (`code:'sign_in_required'`, zero network). `aiProxyFetch(payload)` posts to
`/.netlify/functions/claude-proxy`, THROWS a typed error on non-2xx, and returns `r.json` on success.

**The template** — three byte-identical instances, `yumi-brain.js:813 · 842 · 1745`:
```js
  var call = aiProxyFetch(payload).then(function (data) {
```

**The defect** — `js/integrations.js:2419-2447`, full function:
```js
function classifyBooksViaLLM(books, callback) {
  var result = {};
  var list = (books instanceof Array) ? books : [];
  function finish() { if (typeof callback === 'function') { callback(result); } }
  if (list.length === 0) { finish(); return; }
  function processBatch(start) {
    if (start >= list.length) { finish(); return; }
    var batch = list.slice(start, start + CLASSIFY_BATCH);
    var payload = {
      model:       CLASSIFY_MODEL,
      max_tokens:  1024,
      temperature: 0,
      system:      CLASSIFY_SYSTEM,
      messages:    [ { role: 'user', content: buildClassifyPrompt(batch) } ]
    };
    fetch(CLAUDE_PROXY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-praxis-key': PRAXIS_CLIENT_KEY },
      body:    JSON.stringify(payload)
    }).then(function (res) {
      return res.ok ? res.json() : null;
    }, function () { return null; })
      .then(function (data) {
        applyClassifyBatch(batch, data, result);
        processBatch(start + CLASSIFY_BATCH);
      }, function () {
        applyClassifyBatch(batch, null, result);
        processBatch(start + CLASSIFY_BATCH);
      });
  }
  processBatch(0);
}
```
It RETURNS nothing; it reports through `finish()` → the callback. Every failure shape becomes
`data = null`, and `applyClassifyBatch(batch, null, result)` leaves that batch unclassified.
Sole caller: **views.js:5436**, which reads `resultMap`, writes `state.books[rk].category`, and is
already wrapped in a watchdog `setTimeout` — an empty map is a silent no-op.

**The ceiling null-read path** — `netlify/functions/lib/ceiling.js`:
```
:191   if (res.status === 404) { return null; }      <- _readUsage's cold path
:242   var doc = await _readUsage(projectId, uid, access);
:243   var decision = core.decide(doc, nowMs, cap);
:253   await _writeUsage(projectId, uid, access, decision);   <- first write
:160   scope: 'https://www.googleapis.com/auth/datastore',    <- the SA token scope
```
Response shape (`_json(status, obj)`): `{ statusCode, headers:{Content-Type, Access-Control-Allow-Origin},
body: JSON.stringify(obj) }`, bodies carrying `{ error: '<human>', code: '<stable>' }`.

**Report line 802** (`docs/checkpoints/p1-safety-build.md`), verbatim:
> **The test uid's `aiUsage/IdeCZDWvmPMvoEcfAQnMXVApQUg2` doc will read `count: 4` (or the
> attempts made) until 00:00 UTC** — expected; it rolls to 1 on its first call the next UTC day.

**R2-1** — defined at `p1-safety-build.md:604-611` inside pass-1 finding 2; echoed at `launch-runway.md:58`.
Full text covers ONLY another device's client writes to the private collections, ending "unreadable
orphans, a hygiene residual, not a privacy hole". **No clause mentions the ceiling, aiUsage, or spend.**

**Harness lines 93 / 95** (`tools/ceiling-core-test`), verbatim:
```js
check('call 3 admitted, count 3 (= cap)', d2, { allowed: true, day: '2026-09-03', rolled: false, nextCount: 3, cap: 3 });
check('call 4 REFUSED with resetAt', d3, { allowed: false, day: '2026-09-03', used: 3, cap: 3, resetAt: '2026-09-04T00:00:00.000Z' });
```

**How the harness stubs Firestore/auth: IT DOES NOT.** It reads `ceiling-core.js` ONLY (`:16`) and
evaluates it with `new Function` to hand back six pure functions. It never loads `ceiling.js` and has no
Firestore or auth stub. Proven this session:
```
$ cscript //nologo //E:jscript tools/parse-check netlify/functions/lib/ceiling.js
PARSE ERROR in netlify/functions/lib/ceiling.js: Expected ';'
```
(23 `async`/`await` occurrences — ES2017; the harness engine is ES3.)

## 0.5 Before-stats

| file | bytes | non-ASCII | C3 A2 |
|---|---|---|---|
| js/integrations.js | 193,647 | 2,074 | 0 |
| netlify/functions/lib/ceiling.js | 12,176 | 0 | 0 |
| netlify/functions/lib/ceiling-core.js | 4,804 | 0 | 0 |
| docs/checkpoints/p1-safety-build.md | 77,508 | 1,772 | 0 |
| docs/launch-runway.md | 27,677 | 423 | 0 |
| tools/ceiling-core-test | 7,023 | 4 | 0 |

## 0.6 Ambiguity scan — 3 mechanical carries + 1 fork (all now ruled)

1. **`node --check` is unavailable** (Node IT-blocked). Sanctioned gate: `cscript //nologo //E:jscript
   tools/parse-check`. Applies to integrations.js and ceiling-core.js. It CANNOT apply to ceiling.js
   (ES2017 async — proven above); that file is proven by trace + the live click-path, exactly as Item 1
   recorded. **APPROVED.**
2. **Stage 2.2's harness case cannot drive `enforce()`** for the same reason. Carry: the guard's DECISION
   goes in the pure core (`ceilingDecideIdentity`), all three outcomes tested there; "no write / no
   upstream" is proven as a property of the returned decision PLUS the glue's early-return trace, and is
   reported as such rather than claimed as an executed assertion. **APPROVED.**
3. **A new 403 code falls through `yumiRenderProxyError`** (yumi-ui.js) to the generic "Something went
   wrong reaching Yumi." Adding it to the existing `unauthenticated` branch is one token, but yumi-ui is a
   client behavior change the non-goals arguably reach. Carry: **not touched**, reported as a follow-up.
   **APPROVED.**
4. **THE FORK — `admin.auth().getUser(uid)` does not exist here.** No `admin` in scope; firebase-admin is
   not a dependency and R1.1 bound this file to "no firebase-admin, no dependency"; PROTOCOL §6.4 makes any
   new dependency a HALT. The zero-dep equivalent is Identity Toolkit `accounts:lookup`, which the current
   `datastore`-only SA token cannot authorize. **RULED: Option A** — mint the one cached SA token with
   `datastore identitytoolkit` (space-delimited, narrowest grant covering both calls).

**Version bump**: D1 edits `js/integrations.js`, which `sw.js` precaches at `:30`. CLAUDE.md requires a bump
for any served JS change and `hooks/pre-commit` rule #3 hard-BLOCKS served source staged without `sw.js`.
→ `praxis-v3.298` → `praxis-v3.299`. **RULED.**

**Pre-existing drift flagged (not this round's to fix):** two committed recon docs assert the constant is
dead — `docs/checkpoints/sec-recon.md:50` ("`CLAUDE_PROXY_URL` (integrations.js:12) is defined but never
consumed") and `docs/checkpoints/import-recon.md:328` ("`CLAUDE_PROXY_URL` is dead"). Both are FALSE
against the tree and have been since the classify path was written. **That stale claim is the most likely
reason the P1 Stage 0 census trusted integrations.js and missed D1.** After the D1 hoist the constant
genuinely becomes `fetch`-unreferenced, at which point those two docs become accidentally true.

---
# STAGE 1 — D1: hoist `classifyBooksViaLLM` through the door — PASS

## 1.1 The edit (byte-safe: Edit tool, no perl)

`js/integrations.js`, inside `processBatch`. The payload object above it is untouched
(`CLASSIFY_MODEL`, `max_tokens: 1024`, `temperature: 0`, `CLASSIFY_SYSTEM`,
`buildClassifyPrompt(batch)` — byte-for-byte identical). Only the transport changed, plus a
door-availability guard modelled on the one `segmentDoc` already carries (import-capture.js:151).

## 1.2 Response-shape equivalence — all three cases match

| case | OLD (`fetch(CLAUDE_PROXY_URL …)`) | NEW (`aiProxyFetch(payload)`) | caller sees |
|---|---|---|---|
| (a) success 2xx | `res.ok ? res.json() : null` → **parsed JSON** | resolves `r.json` → **parsed JSON** | identical |
| (b) non-2xx | `res.ok` false → **`null`** | THROWS a typed error → rejection arm `function () { return null; }` → **`null`** | identical |
| (c) network error | fetch rejects → `function () { return null; }` → **`null`** | `aiProxyRequest`'s fetch rejects → propagates → same rejection arm → **`null`** | identical |
| (d) NEW: signed out | would have called the proxy anonymously | rejects `sign_in_required`, **zero network** → **`null`** | identical to (b)/(c) — an unclassified batch |
| (e) NEW: door not loaded | n/a | `typeof aiProxyFetch !== 'function'` → `applyClassifyBatch(batch, null, result)` + `processBatch(next)` + `return` | identical to (b)/(c) |

**aiProxyFetch's differing error surface is wrapped**, as required: it throws where the old code
returned `null`, and the two-arg `.then(onOk, onErr)` maps every rejection back to `null` BEFORE the
existing `.then(function (data) { applyClassifyBatch(batch, data, result); … })` chain, which is
unchanged. The outer error arm (`applyClassifyBatch(batch, null, result)`) is also unchanged, so a
throw from `applyClassifyBatch` itself still advances the batch loop exactly as before.
The caller at **views.js:5436** therefore sees a byte-identical contract: `classifyBooksViaLLM` still
returns nothing, still reports through `finish()` → `callback(result)`, and a failed batch still
yields an unclassified entry behind the existing watchdog `setTimeout`. views.js is untouched.

## 1.3 Verification

**Unified diff** (`git diff -- js/integrations.js`): one hunk at `@@ -2431,12 +2431,28 @@`, `-6/+22`
lines — the 5 fetch/response lines replaced by the guard + the door call, plus 16 comment lines.
`}, function () { return null; })` and everything below it are context, not changes.

**Parse gate** (parse-check in place of `node --check`, ruled):
```
$ cscript //nologo //E:jscript tools/parse-check js/integrations.js
PARSE OK: js/integrations.js
exit=0
```

**Census re-run — layer (b):**
```
fetch(CLAUDE_PROXY_URL    hits=0      <- was 1 (D1 closed)
fetch(SCAN_VISION_URL     hits=0
fetch(PROXY_URL           hits=0
```
**Layer (c) — direct-to-claude-proxy count: `0`.** The 8 remaining `fetch(` in js/ are the door's own
(yumi-brain.js:83), 3× google-books, 1× elevenlabs, 1× transcribe, 2× openlibrary, 1× the static
voice doc — the same non-ceiling set enumerated at 0.3, with google-books' third hit shifted
1981/2068/**2503** and elevenlabs to **2684** by this hunk's +16 lines.

**Deltas** (before → after): bytes 193,647 → **194,808 (+1,161)**; non-ASCII 2,074 → **2,074 (+0)**.
Explained line by line: the +1,161 is 16 added comment lines + the 5-line guard + the reshaped call,
minus the 6 removed lines; **+0 non-ASCII because every added line is pure ASCII** (the comments use
`--`, not an em-dash, deliberately). `git diff | grep` for a non-ASCII-bearing changed line returns
**no matches**.

**MARKER GREP `js/integrations.js` C3 A2 = 0.**

## 1.4 The counter now covers this path

`aiProxyRequest` attaches the token at **js/yumi-brain.js:88**:
```js
        'Authorization': 'Bearer ' + token
```
`aiProxyFetch` (yumi-brain.js:103) calls `aiProxyRequest('/.netlify/functions/claude-proxy', payload)`,
so the new call at **js/integrations.js:2454** now passes through that header. Server-side, `claude-proxy`
runs `await ceiling.enforce(event, Date.now())` after the shared-key gate and before body parse, so shelf
classification is now identity-verified and counted like every other AI call.
**`js/yumi-brain.js` is untouched** (`git diff --stat` empty) — `aiProxyFetch`'s signature and behavior
are unchanged, per the non-goal.

**STAGE 1: PASS**

---
# STAGE 2 — R1: the ghost-doc guard — PASS

## 2.1 The edit (byte-safe: Edit tool, no perl) — three files

**`netlify/functions/lib/ceiling-core.js`** — the DECISION, pure and testable
(`ceilingDecideIdentity(lookup)`), exported as `decideIdentity`. It carries the one-line comment naming
the case it closes: *"a DELETED user whose ID token is still inside its <=1h validity window."*
```
{ found: true }  -> { allowed: true }
{ found: false } -> { allowed: false, status: 403, code: 'account_deleted' }
{ error: true }  -> { allowed: false, status: 503, code: 'identity_unavailable' }
anything else    -> treated as not-found (403) -- the closed direction
```

**`netlify/functions/lib/ceiling.js`** — two changes.
1. The SA token scope, Preston's Option A, one token and one cache:
```js
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/identitytoolkit',
```
2. `_lookupUser(projectId, uid, access)` — Identity Toolkit `accounts:lookup` by `localId`, returning
`{found}`/`{error}` and NEVER throwing, so the decision is explicit rather than an exception path. A
deleted account returns 200 with no `users` key, which is the empty-array case ruled as not-found.
3. The guard itself, on the **null-read path only**, inside the existing `try`.

## 2.2 Harness — all cases green, 36 / 36 (was 28)

The pre-existing boundary cases are untouched and still pass, verbatim from the output:
```
  PASS  call 3 admitted, count 3 (= cap)  = {allowed:true,cap:3,day:2026-09-03,nextCount:3,rolled:false}
  PASS  call 4 REFUSED with resetAt  = {allowed:false,cap:3,day:2026-09-03,resetAt:2026-09-04T00:00:00.000Z,used:3}
```
The new block:
```
[8] THE GHOST DOC -- the cold path only (deleted user, still-valid token, <=1h)
  PASS  lookup FOUND -> proceed (an ordinary new reader)  = true
  PASS  empty users array -> 403 account_deleted  = 403/account_deleted
  PASS    ... allowed=false, so no decide, no write, no upstream call  = false
  PASS  lookup FAILED -> 503 identity_unavailable (fail CLOSED)  = 503/identity_unavailable
  PASS    ... allowed=false, so no decide, no write, no upstream call  = false
  PASS  a non-2xx lookup carries its status and still fails closed  = 503
  PASS  malformed/absent lookup -> treated as not-found (the closed direction)  = 403
  PASS  the existing-doc path is NOT gated: decide() still admits a live counter  = true

36 / 36 passed
harness exit=0
```
Harness self-check ran first and correctly FAILED a wrong expectation.

**HONEST LIMIT, per the approved carry.** "No write occurred" and "the upstream stub was not called" are
NOT executed assertions here: the harness cannot load `ceiling.js` (23 `async`/`await`; the engine is
ES3 — proven at 0.4). They are proven as `allowed === false` PLUS the glue's early-return, traced:
```
267:    var doc = await _readUsage(projectId, uid, access);
273:    if (doc === null) {
274:      var idDecision = core.decideIdentity(await _lookupUser(projectId, uid, access));
275:      if (!idDecision.allowed) {
276:        return _json(idDecision.status, {          <- RETURNS here
282:    var decision = core.decide(doc, nowMs, cap);   <- never reached
292:    await _writeUsage(projectId, uid, access, decision);   <- never reached
```
`enforce`'s contract is that a non-null return IS the response: `claude-proxy`/`shelf-vision` do
`var gate = await ceiling.enforce(...); if (gate) { return gate; }` before any upstream call. So a 403
at :276 is, by construction, no counter write and no Anthropic call. The live leg is the device
click-path (Item 1 (h), below).

## 2.3 Verification

**Parse gate:** `cscript //nologo //E:jscript tools/parse-check netlify/functions/lib/ceiling-core.js`
→ `PARSE OK`, exit 0. `ceiling.js` is ES2017 and not ES3-gateable (ruled carry) — proven by trace + the
live click-path, as at Item 1.

**Deltas** (before → after), every added line pure ASCII:

| file | bytes | delta | non-ASCII | C3 A2 |
|---|---|---|---|---|
| netlify/functions/lib/ceiling.js | 12,176 → 14,301 | +2,125 | 0 → 0 (+0) | **0** |
| netlify/functions/lib/ceiling-core.js | 4,804 → 6,176 | +1,372 | 0 → 0 (+0) | **0** |
| tools/ceiling-core-test | 7,023 → 8,500 | +1,477 | 4 → 4 (+0) | **0** |

Explained: ceiling.js = the 21-line `_lookupUser` + the 14-line guard + the 4-line scope comment;
ceiling-core.js = the 22-line decision + its 14-line header + one export line; the harness = the 16-line
[8] block + the widened `new Function` return list. `git diff | grep` for a non-ASCII-bearing changed
line across all three: **0 matches**.

**STAGE 2: PASS**

---
# STAGE 3 — D2 + D3 + the aiUsage wording — PASS

## 3.1 D2 — the click-path count (`p1-safety-build.md`, the Item 1 "After:" bullet)

Was: *"doc will read `count: 4` (or the attempts made)"*. Now reads `count: 3`, "the cap, not the cap plus
the refusal", with the correction dated and attributed, and quoting the two harness lines **word-for-word**
as they appear at `tools/ceiling-core-test:93` and `:95`:
```
`call 3 admitted, count 3 (= cap)` (ceiling-core-test:93) and `call 4 REFUSED with resetAt` … `used: 3` (:95)
```
It states the mechanism (count taken before the upstream call and only on an admitted one, so the refused
call writes nothing and the effective cap is exactly N) and records that the "4" was a report slip, never
code. A new click-path step **(h)** was added for the R1 guard: inside the hour after deleting the throwaway
account, the (c) fetch with a pre-deletion token must give **403 `account_deleted`** and Firestore must show
**no `aiUsage/<uid>` document created**.

## 3.2 D3 — the R2-1 ceiling clause (`p1-safety-build.md`, pass-1 finding 2)

Added **R2-1 CEILING CLAUSE**, 13 lines: names the second mouth of the same ≤1h window (the AI proxy —
signature-not-account verification → null read → `_writeUsage` RECREATES `aiUsage/{uid}` and the upstream
call is billed), states that unlike the client-write half it IS closable without a tombstone, records it
**CLOSED** with the line reference `ceiling.js:273` (guard) and `:276` (the 403 return), names the decision
function and harness block, and narrows what REMAINS in R2-1 to the client-write half only. Cross-referenced
to click-path (h). The runway row carries the same closure in one sentence with the same line reference.

## 3.3 The aiUsage wording — every occurrence reworded to match the rule verbatim

| file:line (before) | was | now |
|---|---|---|
| p1-safety-build.md:763 | "lock `aiUsage` to server-only writes" | "lock `aiUsage` to **read/create/update: server-only; delete: owner** — the rule verbatim" |
| p1-safety-build.md:780 | "(the doc is server-only by rule)" | "(the rule is read/create/update: server-only; delete: owner)" |
| launch-runway.md:58 | "a server-only `aiUsage` block" | "an `aiUsage` block (**read/create/update: server-only; delete: owner**)" |

Sweep for any remaining bare "server-only" or "count: 4" in `docs/`: **2 hits, both in THIS report** —
line 13 (the D2 defect statement) and line 156 (the Stage 0 anchor quote), where the old wording is the
evidence being corrected. Zero elsewhere.

## 3.4 Verification

Diffs pasted above in full for both files (checkpoint: 4 hunks; runway: 1 hunk).

| file | bytes | delta | non-ASCII | delta | C3 A2 |
|---|---|---|---|---|---|
| docs/checkpoints/p1-safety-build.md | 77,508 → 79,822 | +2,314 | 1,772 → 1,796 | +24 | **0** |
| docs/launch-runway.md | 27,677 → 28,126 | +449 | 423 → 426 | +3 | **0** |

The non-ASCII deltas are the em-dashes and ellipses in the added prose (these are Markdown files and the
house style uses them); **the C3 A2 double-encode marker is 0 on both**, which is the check that matters.
No code file was touched in this stage.

**STAGE 3: PASS**

---
# STAGE 4 — CLOSE-OUT (no push) — PASS

## 4.1 Final three-layer census

**(a) constants** — unchanged set of five; `ELEVENLABS_PROXY_URL` shifted 2610 → 2626 by Stage 1's hunk.

**(b) `fetch(<NAME>)`**
```
  fetch(CLAUDE_PROXY_URL         (none)          <- was integrations.js:2434
  fetch(SCAN_VISION_URL          (none)
  fetch(PROXY_URL                (none)
  fetch(GOOGLE_BOOKS_PROXY_URL   integrations.js:1981, 2068, 2503
  fetch(ELEVENLABS_PROXY_URL     integrations.js:2684
  fetch(TRANSCRIBE_PROXY_URL     import-capture.js:350
```

**(c) every bare `fetch(` in js/ — 9 hits (was 10), all accounted for**

| file:line | classification |
|---|---|
| js/yumi-brain.js:83 | through the door (`aiProxyRequest`'s own fetch) |
| js/integrations.js:1981 · 2068 · 2503 | direct → google-books-proxy (non-goal) |
| js/integrations.js:2684 | direct → elevenlabs-proxy (not ceiling-covered) |
| js/import-capture.js:350 | direct → transcribe-proxy (not ceiling-covered) |
| js/integrations.js:1914 · 1934 | non-Netlify — openlibrary.org |
| js/yumi-brain.js:17 | non-Netlify — `/docs/yumi-voice.md` |

**DIRECT FETCHES TO A CEILING-COVERED FUNCTION (claude-proxy + shelf-vision) OUTSIDE THE DOOR: `0`.**
That is the number the go-ahead asked for.

## 4.2 Marker grep, every file touched in Stages 1–3 (plus sw.js)

```
  js/integrations.js                         C3A2=0
  netlify/functions/lib/ceiling.js           C3A2=0
  netlify/functions/lib/ceiling-core.js      C3A2=0
  tools/ceiling-core-test                    C3A2=0
  docs/checkpoints/p1-safety-build.md        C3A2=0
  docs/launch-runway.md                      C3A2=0
  docs/checkpoints/p1-fix-round-2.md         C3A2=0
  sw.js                                      C3A2=0
```
**All zero.** The encoding rule held for every write this round.

## 4.3 Gates

```
$ sh tools/ground-truth
== Praxis ground-truth ==
HEAD:           c8a35ae            (pre-commit reading)
hook gate:      ARMED (core.hooksPath = hooks)
FIX-PROTOCOL:   # PRAXIS — Fix & Build Protocol (v1.3)

$ cscript //nologo //E:jscript tools/parse-check js/integrations.js                    -> PARSE OK
$ cscript //nologo //E:jscript tools/parse-check netlify/functions/lib/ceiling-core.js -> PARSE OK

harness regression, all four:
  ceiling-core-test  36 / 36 passed      (was 28 — +8 ghost-doc cases)
  fx1c-sim           60 / 60 passed
  export-test        58 / 58 passed
  delete-test        58 / 58 passed

foundations: lumen-amber 070679b0… · marks 772886c0…   (both unchanged)
hooks/pre-commit on the staged set: exit 0 (WARN-only — backticks inside comment lines)
```

## 4.4 Version + commit

**`sw.js` bumped `praxis-v3.298` → `praxis-v3.299`, and this commit REQUIRED it**: `js/integrations.js`
is served source (`sw.js:30` precaches it), CLAUDE.md requires a bump on any shipped JS change, and
`hooks/pre-commit` rule #3 hard-BLOCKS served source staged without `sw.js`. sw.js byte delta +0 (an
equal-length version string).

**Commit `d872966`** — `fix(P1 FIX ROUND 2) — D1: the one proxy call site the hoist missed, hiding behind
a constant two recon docs called dead; R1: a deleted account could still spend and resurrect its own
counter → v3.299`. 8 files, +570 / −17. Tracked tree clean after. **NOT pushed** (`origin/main` still
`53c968d`; five local commits ahead).

## 4.5 Consolidated report

**Protocol docs** — found: CLAUDE.md · PROTOCOL.md v1.2 · docs/FIX-PROTOCOL.md v1.3 · all seven agent
files · hooks/pre-commit · tools/parse-check · BOARD.md · docs/studio/sequence.md · docs/launch-runway.md ·
proposals/README.md. Missing: **docs/LAUNCH-STATUS.md** (FIX-PROTOCOL's ledger pointer; launch-runway.md
is the live ledger).

**Per stage** — Stage 0 PASS (read-only; one fork surfaced and ruled, three carries approved) ·
Stage 1 PASS (D1) · Stage 2 PASS (R1) · Stage 3 PASS (D2 + D3 + wording) · Stage 4 PASS.
**No stage FAILED, so no edit was reverted.**

**Before / after, every touched file**

| file | bytes before | bytes after | Δ | non-ASCII before → after | C3 A2 |
|---|---|---|---|---|---|
| js/integrations.js | 193,647 | 194,808 | +1,161 | 2,074 → 2,074 (+0) | 0 |
| netlify/functions/lib/ceiling.js | 12,176 | 14,301 | +2,125 | 0 → 0 (+0) | 0 |
| netlify/functions/lib/ceiling-core.js | 4,804 | 6,176 | +1,372 | 0 → 0 (+0) | 0 |
| tools/ceiling-core-test | 7,023 | 8,500 | +1,477 | 4 → 4 (+0) | 0 |
| docs/checkpoints/p1-safety-build.md | 77,508 | 79,822 | +2,314 | 1,772 → 1,796 (+24) | 0 |
| docs/launch-runway.md | 27,677 | 28,126 | +449 | 423 → 426 (+3) | 0 |
| sw.js | 6,041 | 6,041 | +0 | 6 → 6 (+0) | 0 |
| docs/checkpoints/p1-fix-round-2.md | — | new | — | — | 0 |

Every code-file non-ASCII delta is **+0**: all added code and comments are pure ASCII by construction.
The two doc deltas are em-dashes and ellipses in added prose, house style, marker 0.

**Final census** — 0 direct fetches to a ceiling-covered Netlify function outside the door (§4.1).

**Commit** — `d872966`, v3.299, not pushed.

**`CLAUDE_PROXY_URL` after D1** — **2 references in `js/`, both in `js/integrations.js`: the declaration
at `:12` and a mention inside the new D1 comment at `:2435`. Zero `fetch()` uses.** Per the non-goal the
constant was NOT deleted. **CANDIDATE DEBT ITEM:** it is now genuinely unreferenced-by-code — either
retire it in a later sweep, or keep it as the one place the proxy path is written down. Preston's call;
not taken here.

**Pre-existing drift flagged, not fixed this round**
1. `docs/checkpoints/sec-recon.md:50` and `docs/checkpoints/import-recon.md:328` both assert
   `CLAUDE_PROXY_URL` "is defined but never consumed" / "is dead". Both were FALSE from the moment the
   classify path was written, and that stale claim is the most likely reason the P1 Stage 0 census
   trusted integrations.js and missed D1. (After this commit they are accidentally true.) **This is the
   claims-outliving-code family with a measured cost: one defect, one round.**
2. `docs/launch-runway.md` ends "Full detail in `docs/LAUNCH-STATUS.md`" — a pointer to the file that
   does not exist (the same missing-ledger gap recorded at 0.1).
3. `yumi-ui.js`'s `yumiRenderProxyError` has no branch for the new `account_deleted` / `identity_unavailable`
   codes, so both render the generic "Something went wrong reaching Yumi." Adding them to the existing
   `unauthenticated` branch is one token; left untouched by ruling, reported as a follow-up.

**STAGE 4: PASS**
