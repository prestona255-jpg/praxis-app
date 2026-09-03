P1-SAFETY BUILD STARTED — 2026-09-03, base 53c968d v3.294, order Item 1 → 4a → 4b → 3 → 2

# P1 SAFETY SLICE — build record (Items 1 → 4a → 4b → 3 → 2)

Model: Fable 5.1. Protocol: FIX-PROTOCOL v1.3 + PROTOCOL.md v1.2 + CLAUDE.md. Stage 0 record:
docs/checkpoints/p1-safety-recon.md (accepted, binds; the go-ahead's amendments win where they differ).

## Protocol docs (by filename)
FOUND: CLAUDE.md · PROTOCOL.md (v1.2) · docs/FIX-PROTOCOL.md (v1.3) · .claude/agents/fix-red-team.md
(model: sonnet) · .claude/agents/{praxis-recon,praxis-reviewer,repo-mapper,fix-implementer,
studio-mockup,studio-scan}.md · hooks/pre-commit · tools/parse-check · docs/launch-runway.md (the live
ledger) · docs/checkpoints/p1-safety-recon.md.
MISSING: docs/LAUNCH-STATUS.md — FIX-PROTOCOL §1 Stage 2 / §11 point at it; the file does not exist
(docs/studio/LAUNCH-STATUS.md does). Per the go-ahead: noted, NOT created; launch-runway.md is the ledger.
Base: HEAD == origin/main == 53c968d, 0 tracked-dirty, CACHE_VERSION praxis-v3.294, foundations
lumen-amber 070679b0… / marks 772886c0… unchanged. Egress: praxis-reading.netlify.app → 000 (blocked);
googleapis / anthropic reachable.

## R1.2 PREMISE TEST — can any AI call site fire before sign-in? (per site)
| # | site | entry path in the shipped app | gate | before sign-in? |
|---|---|---|---|---|
| 1 | summarizeAndRoll (yumi-brain) | only inside sendMessage's history roll (:159 caller) | inherits #3 | NO |
| 2 | gradeUtterance | brain-internal only (9 callers, all inside #3/#4/#6–#11) | inherits | NO |
| 3 | sendMessage | yumi-ui.js:1299 runChat + :1274 considerName chain | yumi-ui.js:1212 (F-PX1 1f): a signed-out send returns BEFORE any brain call | NO |
| 4 | generateLenses | yumi-ui.js:1635 startLensSuggest ← lens panel open | the panel opens ONLY from views.js:5456 (shelfBuildLensRow) + :5497 (buildFirstShelfOffer), both built inside renderShelf (:4313) AFTER its signed-out return | NO |
| 5 | generateValueRetrofit | views.js:22691 _pfRunRetrofit | renderProfilePage returns a sign-in prompt signed-out (:22793) | NO |
| 6 | distillWebAngle | brain-internal (considerWebAngle ← considerMove) | considerMove :2046 `if (!uid) quiet` | NO |
| 7 | generateMove | considerMove (:2058) / :2556 | same uid gate | NO |
| 8 | scanThread | considerNotice (:2390) | :2384 `if (!uid) quiet` | NO |
| 9 | generateName | considerName (:2463) ← yumi-ui :1264 | after the :1212 gate | NO |
| 10 | generateArcVoice | considerArcVoice (:2765/:2808) ← views.js:16386 | :2742 `if (!uid) fallback` (the signed-out seed arc gets the fallback voice, no call) | NO |
| 11 | generateProfileSummary | considerProfileRefresh (:2915) ← views.js:20567 | :2896 `if (!uid) quiet` | NO |
| 12 | classifyUtterance | yumi-ui.js:1326 | after the :1212 gate | NO |
| 13 | segmentDoc (import-capture) | views.js:24995 capOfferSplit ← the Split button on a caught row | a caught row exists only after capCommit, which toasts "Sign in to keep your notes" and returns signed-out (views.js:24845-24846) | NO |
| 14 | shelf-vision (views.js:9333 scanShelfVision) | the #scan surface — the promoted first-run door | renderScan hard-gates: `if (!getCurrentUser()) { buildSignedOutPrompt… return; }` (views.js:11236-11240) | NO |

Console-only harnesses (runGateHarness / runMoveHarness / runArcVoiceHarness / praxisClearSeeds) are
window exports, not app paths; after Item 1 a signed-out console call rejects with `sign_in_required`
before any network. RESULT: no site can fire before sign-in → no fork; recorded, proceeding.

## R4.1 RENDERED-HOME STATEMENT (stated before Item 4b is built)
The checkpoint proposes RE-HOME with `arcId = null`. The rendered home for a deleted arc's sub-theories is
the surface that renders orphaned sub-theories TODAY: the sub-theory page (`#subtheory/<id>`,
`renderSubTheoryPage`), which resolves the record from `state.subTheories` and tolerates a missing parent
(the 7 orphans on the real account render there now — state.js:2403-2411 documents the condition), and
the Notebook's sub-theory listing that links to it. Register: the sub-theory page's own `.st-*`. Item 4b
therefore adds NO new surface: it turns the dangling pointer into an explicit `arcId:null` and the
sub-theory keeps rendering where it renders today. This claim is VERIFIED against source in the Item 4b
section below before building; if `renderSubTheoryPage` proves to require a live arc, that is the HALT
the go-ahead names.

## ITEM 1 — SERVER-SIDE COST CEILING (v3.295)

Design as ruled. Identity = Firebase ID token verified in `netlify/functions/lib/ceiling.js`: RS256 via
`crypto.verify` only; `alg === 'RS256'` + a `kid` required; certs from the securetoken x509 endpoint
cached per kid at module scope honoring `Cache-Control max-age`, refetched once on an unknown kid;
`iss === https://securetoken.google.com/<project>`, `aud === <project>`, non-empty `sub`, `exp > now`,
`iat <= now` (60 s skew); any failure → 401 `{code:'unauthenticated'}`; stateless-token / no-revocation
note in the header. Counter = `aiUsage/{uid}` `{day:'YYYY-MM-DD' (UTC), count}` through the Firestore
REST API with a service-account JWT (`crypto.sign` RS256) exchanged at oauth2.googleapis.com for a
datastore-scoped token cached to expiry−60 s; per request GET → `core.decide` → 429 or COMMIT
(`fieldTransforms` increment +1, or `{day:today, count:1}` when the day rolled / no doc); the
concurrency overshoot is documented in the header, no hand-rolled transaction. `PRAXIS_SA_KEY` unset →
503 `{code:'ceiling_unconfigured'}`; store read/write failure → 503 `{code:'ceiling_unavailable'}` — fail
CLOSED both ways. Env: `PRAXIS_SA_KEY` (SECRET, full SA JSON) · `PRAXIS_AI_DAILY_CAP` (default 300) ·
`PRAXIS_AI_CAP_OVERRIDES` (`uid:cap,…`). Count-before-forward (R1.9). The decision core
(`lib/ceiling-core.js`) is pure ES3 with an injected clock and never sees a request body.

Both `claude-proxy.js` and `shelf-vision.js` call `await ceiling.enforce(event, Date.now())` after the
shared-key gate and BEFORE body parse / any upstream call; both OPTIONS responses add `Authorization` to
`Access-Control-Allow-Headers` (without it the browser preflight strips the token). ONE shared counter
and ONE cap serve both functions — the R1.3 amendment defines one doc shape and one cap variable; a
per-function weight would be a one-line extension and was not built. `vision-proxy.js` DELETED (0
client callers; was deployed key-gated and unlimited).

Client: ONE door in yumi-brain.js (after `resolveActiveUid`) — `aiProxyRequest(url, payload)` attaches
`Authorization: Bearer <getIdToken()>` and resolves `{status, ok, json, text}` for ANY status (rejects
with `code:'sign_in_required'` and ZERO network when no Firebase user); `aiProxyFetch(payload)` is the
claude door (typed Error `{status, code, resetAt}`, message shape `proxy <status>: <body>` preserved for
every existing catch); `aiLimitResetLabel(resetAtIso, nowMs)` / `aiLimitMessage(err, who)` render the
reset in LOCAL time ("at 8:00 PM" / "tomorrow at 2:00 AM" on a local-calendar roll). 12 yumi-brain sites
+ import-capture `segmentDoc` (status-aware retry: 5xx/network once, 4xx never) + views.js
`scanShelfVision` hoisted through the door. Honest rendering: Yumi bubble via `yumiRenderProxyError`
at BOTH catch sites (runChat + considerName) — `daily_limit` → "You’ve reached today’s limit for Yumi.
It resets at <local>."; `unauthenticated`/`sign_in_required` → "Please sign in again to think with
Yumi."; `ceiling_*` → "Yumi is unavailable right now — the usage ceiling could not be checked."; the
import split toast → limit line + "Your note is filed."; the scan surface → a distinct `'limit'` result
state (never laundered into `'failed'`) rendered by `scanShowServerLimit` on the shared `scan-ov-cap`
card, where each opener now sets its own copy (`scanSetCapCopy`); shelf mode refunds the client shot.

### Proofs
- Core parse gate: `cscript //nologo //E:jscript tools/parse-check netlify/functions/lib/ceiling-core.js`
  → PARSE OK, exit 0. (The first draft used `toISOString` — ES5 — and the harness died mid-run while
  cscript STILL EXITED 0; fixed with a hand-built ISO. Read the harness OUTPUT, never the exit alone.)
- Harness `cscript //nologo //E:jscript tools/ceiling-core-test`: self-check (a wrong expectation fails)
  OK, then **28 / 28 passed** — [1] day key 23:59:59Z→'2026-09-03', 00:00:00Z→'2026-09-04', resetAt
  '2026-09-04T00:00:00.000Z', local zone ignored; [2] cap from env/unset/garbage/"0"→300, overrides
  hit/miss/spaces/malformed/zero; [3] cap 3: calls 1–3 admitted (counts 1,2,3), call 4 REFUSED
  `{allowed:false, used:3, cap:3, resetAt:'2026-09-04T00:00:00.000Z'}`, still refused at 23:59:59;
  [4] the same doc at 00:00:00 UTC is admitted rolled → count 1; [5] uid A at 300/300 refused while uid
  B at 300/1500 admitted (own doc, own cap); [6] the core source never references a request body, and a
  forged `uid` field on the stored doc changes nothing; [7] negative / non-numeric count → 0, missing day
  → rolled.
- Client parse gates: js/yumi-brain.js, js/yumi-ui.js, js/import-capture.js, js/views.js → PARSE OK exit
  0 each. The two functions + lib/ceiling.js are Node (async/await) — NOT ES3-gated, same as F-PX1; the
  Node glue is proven LIVE after push by the R1.10 click-path (report §6). No Node on this box.
- grep — direct proxy `fetch(` before: claude-proxy 12 (yumi-brain) + 1 (import-capture) + shelf-vision 1
  (views) = **14**; after: **0 / 0 / 0**. `aiProxyFetch(` = 14 occurrences (1 def + 12 + 1);
  `aiProxyRequest(` = 3 (1 def + the claude door + the scan site).
- Forged body uid: claude-proxy.js never reads a uid (grep `uid` = 0 outside the require line);
  `ceiling.enforce` reads identity ONLY from `event.headers`; the core has no body (harness [6]).
- ES3 rail on all added `js/` lines: 0 hits. The hook WARNs on backticks inside COMMENT lines of the two
  new lib files (Node, not served) — documented false positives, no block, exit 0.
- UTF-8 integrity: C3 A2 double-encode markers = 0 in every edited file. The FIRST views.js pass
  double-encoded 728 characters (perl wide-char re-encode) — caught by that marker grep, views.js restored
  from HEAD and re-edited byte-safely from a script file; em-dash count 505 → 506 (the one added).
- EOL: yumi-brain.js / yumi-ui.js / claude-proxy / shelf-vision are CRLF in the tree (CR counts moved only
  with lines added/removed: 3203→3170, 2118→2130); views.js / import-capture.js / sw.js CR=0 as before
  (views.js was re-materialized CRLF by the restore and normalized back to LF, diffstat vs HEAD empty
  before the re-edit). Every blob is LF.
- Hook dry-run (`sh hooks/pre-commit` on the staged set): exit 0, WARN-only as above.

### Bytes (LF-normalized) — expected (stated before edit) vs actual
| file | expected | actual |
|---|---|---|
| netlify/functions/claude-proxy.js | +900 | +1,057 |
| netlify/functions/shelf-vision.js | +700 | +444 |
| netlify/functions/lib/ceiling-core.js | new ~4,000 | new 4,804 |
| netlify/functions/lib/ceiling.js | new ~9,000 | new 11,692 |
| tools/ceiling-core-test | new ~6,000 | new 7,023 |
| netlify/functions/vision-proxy.js | −10,134 (deleted) | −10,134 |
| js/yumi-brain.js | net −500…+1,500 | −392 (helpers +3,900, 12 sites −4,290) |
| js/import-capture.js | +200 | +106 |
| js/views.js | +1,400 | +1,732 |
| js/yumi-ui.js | +600 | +891 |
| sw.js | +0 | +0 (praxis-v3.294 → praxis-v3.295) |

### Red-team (§9) — dispatched on the frozen (staged) tree — VERDICT: no BLOCK
The agent re-ran the harness (28/28), all parse gates, the hook, the grep counts, the byte deltas and the
UTF-8/CR checks independently and found every claim exact; it traced every branch of `ceiling.enforce`
(missing header / malformed token / unknown kid / cert-fetch failure / SA env unset or malformed /
token-exchange failure / Firestore read or write failure / a thrown exception / OPTIONS / non-POST) and
found NO fail-open path in either function; gate order confirmed shared-secret → enforce → body parse →
upstream, F-PX1's caps untouched, `Authorization` on both OPTIONS responses. Findings + dispositions:
1. CONCERN doc currency — the ledger block had not landed (my `#` delimiter collided with the `## `
   heading; only a blank line went in) and the beta-gate JWT row + `docs/studio/sequence.md:1377` still read
   "open" for the thing this commit ships. FIXED before commit: the P1 block + the row-2 note in
   launch-runway.md, the sequence.md annotation, and the explicit note **"builder regen deferred to the
   push point (the final local commit)"** — Items 1/4/3 are intermediate local commits under the BUILDER
   CADENCE rule; the regen rides Item 2's commit.
2. NOTE stale header — `shelf-vision.js:1-27` described the deleted `vision-proxy.js` in the present
   tense. FIXED: reworded to past tense + a line recording the deletion.
3. NIT — `classifyUtterance`'s original message was `'router proxy <s> <b>'`; the door normalises it to
   `'proxy <s>: <b>'`. Its handler discards the error text (fail-closed to CONVERSATION), so nothing parses
   it. Checkpoint wording corrected: the shape is preserved for the 12 sites that used it; this one site's
   distinct shape was replaced.
4. NOTE — a transient cert-fetch failure returns null → 401 (the ruling's literal "any failure → 401")
   and reads to the reader as "sign in again" rather than `ceiling_unavailable`. Fail-closed either way.
   RESIDUAL R1-a (UX precision), not changed.
5. CONCERN — `crypto.verify` was handed Google's X.509 CERTIFICATE PEM directly, relying on Node's implicit
   cert→key fallback, unproven on this box. FIXED: the key is now extracted explicitly with
   `crypto.createPublicKey(pem)` (accepts a certificate PEM, yields the SPKI key), falling back to the
   string only if extraction throws; a failure is still null → 401, never an admit. And the R1.10
   click-path's FIRST check is now "a normal signed-in Yumi call succeeds" — because a wrong assumption
   here is safe (fail-closed) but total.
6. NOTE — Book-mode's cover shot does not refund the client-side daily shot on the new `'limit'` branch
   (shelf mode does); book mode never refunded on ANY failure state, so the branch copies the existing
   pattern. RESIDUAL R1-b.
Post-fix re-checks: parse-gate n/a for the two Node files (async); hook re-run on the re-staged set →
exit 0 (WARN-only on comment backticks); C3A2 markers 0; CR counts unchanged in shape.

### Item 1 commit
**`0fb8aa8`** — `feat(P1 Item 1) — a server-side cost ceiling keyed on the verified uid; the proxy had no
identity, only a public key → v3.295` — 14 files, +876/−440, tracked tree clean after.

## ITEM 4 — FX-1c DELETE SYMMETRY (4a, verbatim) + THE REFERENCE SWEEP (4b) — one commit, v3.296

### R4.1 rendered-home — VERIFIED against source before building
`_afBuildOrphanSeat(user, ownArcs)` (views.js:3921, mounted at :4156 inside `renderArcsPage`) lists every
owned sub-theory whose `arcId` is falsy or points at no live arc (`if (sub.arcId && state.arcs[sub.arcId])
continue; // rooted → skip`) — an explicit ORPHAN SEAT on the Arcs field. `renderSubTheoryPage`
(:14149) resolves `var arc = (subTheory.arcId && state.arcs) ? state.arcs[subTheory.arcId] : null`
(:14546) and renders with `arc === null`. Every other `arcId` reader guards the same way (views.js:975,
:3602, :11868, :14462, :21408, :21678, :21978, :22086 `if (!s3.arcId…) continue`, :22289 `typeof
st.arcId !== 'string' … continue`, :23113). So a re-homed sub-theory (`arcId:null`) has a NAMED,
EXISTING rendered home — the Arcs field's orphan seat (register: the field's own `.af-*`) and its own
`#subtheory/<id>` page (`.st-*`) — the same place the 7 orphans on the real account render today. NO new
surface, no HALT.

### 4a — as recorded (fx1.md:137-142, launch-runway.md FX-1c row)
- state.js: after the `pendingBookDeletes` family — `pendingDeleteKey` → `praxis_pending_deletes_<kind>_<uid>`,
  `getPendingDeletes` / `markPendingDelete` / `isPendingDelete` / `clearPendingDelete` (mirrors books
  line-for-line), and ONE `noteRecordDeleted(kind, owner, id)` that every real-uid delete calls: it
  `clearPendingSync`s the id (FINDING C — a create-then-delete-before-sync no longer grows the pending-ADD
  set) and `markPendingDelete`s it; the seed sentinel (`__praxis_seed__`) and a null owner mark nothing.
  Call sites: `deleteArc` (arc.userId), `deleteSubTheory` (subTheory.userId), `deleteUserTheme`
  (theme.userId) — `dissolveBasin` inherits through `deleteSubTheory`.
- views.js `deleteBook` step 7: the artifact removal marks `('artifacts', uid, artifactKey)` — the one
  views.js touch (the record said FX-1c has no views.js coupling; the artifact delete lives there, two
  lines, typeof-guarded).
- integrations.js: the four REPLACE splats (arcs :216 / subTheories :279 / themes :355 / artifacts :414
  at v3.294) each build `<kind>DelSet` + `<kind>Confirmed` from `getPendingDeletes` BEFORE the clear-loop,
  SKIP a pending-delete id in the copy-in (and drop any stray local copy), and `clearPendingDelete` the
  confirmed ids after — `mergeRemoteBookDoc`'s `delSet` (:785-843), transplanted. Each block is wrapped in
  `// FX-1c splat-begin:<kind>` / `splat-end:<kind>` markers so the sim evaluates the REAL bytes.
- What was NOT done, by decision: the MERGE's drop-side artifact removal (`mergeBookDuplicates`
  views.js:8599, the delete at :8778 `delete state.bookArtifacts[dropAK]` — both re-derived against
  the committed v3.296 tree) is NOT marked. Marking it without also clearing the
  mark in `undoBookMerge`'s restore (views.js:8512-8585) would make the next artifacts splat DELETE the
  restored artifact — the exact books failure UNDO INDEPENDENCE fixed — and the Undo is a closed surface
  ("The merge surface, tombstones, undo — closed. Do not touch"). So the merge path keeps today's
  (unguarded) behaviour; **RESIDUAL R4-1**, a 2-line touch inside the closed Undo, Preston's call.
- Notebook has no guard of either kind — FX-1b's, untouched (R4.2 confirmed).

### 4b — the reference sweep
- `deleteArc` (state.js): every sub-theory with `arcId === arcId` is RE-HOMED — `arcId = null`,
  `updatedAt` bumped, `markSubTheoriesDirty()` — never deleted (authored prose). Then the FX-1c mark,
  then the record goes.
- `openArcDeleteConfirm`'s confirm handler (views.js:17848): captures `wasPublished` from the record
  BEFORE `deleteArc`, and after `saveState()` calls `unpublishArc(arcId, cb)` (integrations.js:2790 —
  deletes `publishedArcs/{arcId}` + `arrayRemove`s the id from `publicProfiles.publishedArcIds`,
  owner-authorized, tolerates the local record being gone); on failure it queues the id in the existing
  commons-exit queue (`_commonsQueueExit` → `drainCommonsExits` toast) so the reader sees it and a later
  sanitize pass retries. Seed arcs ("Hide arc") never unpublish.
- `deleteEntry` (state.js): scrubs `{kind:'entry', refId:<entryId>}` from every sub-theory's evidence
  (keep-filter, `updatedAt` bumped, `markSubTheoriesDirty()`), the way `deleteBook` scrubs
  `{kind:'book'}`; a `{kind:'book'}` element whose refId happens to equal the string is untouched (the
  sim checks it). The read-time filter (`evidencePrivate`, views.js:13958) stays as belt-and-braces.
- The two stale merge anchors corrected in the record, re-derived against the COMMITTED tree (the
  first correction cited pre-commit numbers, which this commit's own hunks shifted — caught by the
  red-team): fx1.md and launch-runway.md now both say `mergeBookDuplicates` views.js:8599, drop-side
  artifact delete :8778, at v3.296.

### Proofs
- **Sim `cscript //nologo //E:jscript tools/fx1c-sim`** — loads the REAL `js/state.js` (whole, with a
  localStorage shim + ES5 shims for JSON / Array.isArray / indexOf / trim, which cscript's ES3 engine
  lacks at RUNTIME — the parse gate never exercised them) and slices the four REAL splat blocks out of
  `js/integrations.js` by marker, evaluating them with exactly the closure variables they read. Harness
  self-check: a wrong expectation fails. **60 / 60 passed**, per kind (arcs / subTheories / themes /
  artifacts): C0 the real delete fn removes the record and marks it pending-delete; **C1 THE FAILURE: a
  stale remote doc still listing the id does NOT resurrect it**, the sibling is untouched, the mark
  persists while the remote lists it; C3 once the remote drops it the mark clears and it stays absent;
  C2 CONTROL: a server-side delete (present locally, absent remotely, no marks) is still dropped; C5 NO
  NEW SILENT LOSS: a pending-ADD record survives the splat (FX-1 intact); C4 FINDING C: delete-before-sync
  clears the pending-ADD mark, and an id the remote never listed clears its delete mark on the next read;
  C6 a second uid's marks are untouched; C7 the seed sentinel marks nothing. 4b: deleteArc re-homes
  (`arcId === null`), does not cascade, prose + valueMarks `why` verbatim, another arc's sub untouched;
  deleteEntry scrubs the `{kind:'entry'}` element, keeps a `{kind:'book'}` element with the same refId
  string, keeps the other entry's evidence verbatim (3 → 2).
- **The mechanism removed (§3 #1):** `tools/fx1c-sim unguarded` strips the skip line from each sliced
  block → **56 / 60, exactly the four C1 cases FAIL** (the record resurrects in every collection). The
  sim discriminates; the shipped bytes are what stop the race. (The first sim run also caught its own
  blind spot: every persistence check "passed" vacuously because `JSON` is undefined under cscript and
  `sv`/`ls` fail silently — fixed by the shims; recorded because it is the trivially-passing-check class.)
- The artifacts kind cannot run `deleteBook` in the sim (views.js is not loadable); the sim performs the
  identical two-call bookkeeping the step-7 site now carries, and the site itself is proven by grep
  (`noteRecordDeleted(` in views.js = 1, inside `deleteBook` step 7) + the T3 chain deleteBook ←
  the shelf's delete control (unchanged).
- Parse gates: state.js / integrations.js / views.js → PARSE OK exit 0 each. UTF-8 markers 0.
- grep: `FX-1c splat-begin` 4 / `splat-end` 4 · `noteRecordDeleted(` state.js 4 (1 def + 3) + views.js
  1 · `getPendingDeletes(` state 4 + integrations 4 · `clearPendingDelete(` state 1 + integrations 4 ·
  `unpublishArc(` in views.js 1 → 2 · `pendingDeleteSync` 0 (the record's NAME; the shipped key is
  `praxis_pending_deletes_<kind>_<uid>`, the books key's shape).
- EOL: state.js and integrations.js were MIXED CRLF/LF in the working tree (3,926 / 3,553 CR lines against
  3,788 / 3,429 LF lines) — the first script pass matched nothing because of it. Both normalized to LF
  (CR=0, like views.js); every blob is LF regardless, so the commit is unaffected (`git diff --stat` shows
  content lines only). views.js CR=0 as before.

### Bytes (LF-normalized) — expected vs actual
| file | expected | actual |
|---|---|---|
| js/state.js | +4,800 (family ~2,600 + marks ~300 + 4b ~1,900) | +5,070 |
| js/integrations.js | +3,200 | +3,393 |
| js/views.js | +1,200 (4a step 7 ~350 + 4b ~900) | +1,204 |
| tools/fx1c-sim | new ~12,000 | new 16,316 |
| sw.js | +0 | +0 (praxis-v3.295 → praxis-v3.296) |
| docs | fx1.md, launch-runway.md, sequence.md, this file | — |

### Red-team (§9) — dispatched on the frozen (staged) tree
(appended below when it returns)

### Red-team (§9) — dispatched deep on the frozen (staged) tree — VERDICT: no BLOCK, 3 CONCERNs
The agent re-ran the sim in both modes (60/60; unguarded 56/60 with exactly the four C1 cases
failing), re-derived every grep and byte figure, traced every branch of the four splats
(create-then-delete-before-sync, id-never-listed, failed outgoing write leaves the mark sticky like
books), traced the merge/undo interaction (the drop-side artifact delete is NOT marked, matching R4-1;
a deleted merge party is refused by the UNDO INDEPENDENCE fingerprint before any restore runs — no
new resurrection path), swept all 86 `.arcId` readers across four files for null tolerance, and
confirmed `_afBuildOrphanSeat` is really mounted (views.js:4156) and `buildPublishedArcDoc` tolerates
null. Findings + dispositions, all fixed before commit:
1. CONCERN — `openMarkComposer`'s glyph-uniqueness scan (views.js:13204) compared `other.arcId !==
   rec.arcId`; with every orphan now `arcId:null`, all orphans from every dead arc would count as
   siblings and over-restrict the glyph set. FIXED: `!rec.arcId ||` guard — a re-homed sub has no arc
   siblings. Not in my guard sweep (it compares two subs' arcIds rather than resolving an arc).
2. CONCERN — the unpublish-failure leg reused the sanitize toast ("Publish again when something is")
   for a DELETED arc, and my record claimed "a later sanitize pass retries" — false: the sanitize
   walks `state.arcs`, and the arc is gone. FIXED: `_commonsQueueExit(arcId, reason)` carries
   `'deleted'`; `drainCommonsExits` words that case honestly ("was deleted here but could not be
   removed from the commons yet — Praxis will retry the next time it loads"); and the retry now
   EXISTS: `queueArcUnpublishRetry(arcId)` persists the id in `praxis_pending_unpublish_<uid>`
   (per-uid, swept by Item 2) and `drainArcUnpublishRetries(uid)` re-runs `unpublishArc` for each on
   the next arcs load (after the FX-1c block, outside the sim markers), clearing an id only on
   success. Added AFTER the red-team returned (≈35 lines, integrations.js + 3 lines views.js);
   proof = parse gate + grep (queue 1+1, drain 2, the honest reason 1) + code read; the Firestore leg
   is async and not sim-able — named for Preston's read.
3. CONCERN — the "corrected" merge anchors (`:8594` / `:8760`) were wrong against the tree that
   ships: this commit's own hunks shift the file, and `:8760` was never grep-derived. FIXED: re-derived
   on the final tree — `mergeBookDuplicates` views.js:8599, the drop-side artifact delete :8778 — in
   fx1.md, launch-runway.md and this file. (The lesson the record already carries, re-learned in the
   same commit that carried it: re-grep against the bytes that commit.)
Post-fix re-checks: parse OK ×3, sim 60/60 + unguarded 56/60 (4 C1), C3A2 0, CR 0. Final bytes
(LF): state.js +5,070 · integrations.js +5,261 (4a +3,393, the retry queue + reason +1,868) ·
views.js +2,420 (4a +350, 4b +854, the guard + honest toast + retry call +1,216) · sw.js +0.

### Item 4 commit
**`12a8c2c`** — `fix(P1 Item 4) — FX-1c delete symmetry, verbatim from the record, and the reference
sweep: a deleted arc no longer stays live in the commons → v3.296` — 9 files, +636/−15, tracked tree
clean after.

## ITEM 3 — EXPORT (v3.297)

### Design as ruled
- **JSON canonical from the SAME eight Firestore payload builders** (R3.1): `buildExportBundle(uid, email,
  published, publicProfile, exportedAt)` (integrations.js, beside the builders) calls `buildUserBookDoc` /
  `buildUserArcsDoc` / `buildUserNotebookDoc` / `buildUserSubTheoriesDoc` / `buildUserThemesDoc` /
  `buildUserArtifactsDoc` and the two payloads that were INLINE in their save functions and are now
  HOISTED — `buildUserProfileDoc(uid, profile, stampFn)` and `buildUserReaderModelDoc(uid, model,
  stampFn)` — so `saveProfileToFirestore` / `saveReaderModelToFirestore` and the export write the SAME
  fields (the HOIST lesson; the save sites now call the builders with `_fsServerStamp`). The ONLY
  transformation on a payload is the `updatedAt`/`syncedAt` Firestore sentinel → the export instant;
  every record object is carried by reference. Wrapper: `{format:'praxis-export', version:1,
  schemaVersion, exportedAt, exportedAtIso, uid, email, collections:{8}, published:[{id,data}…] (publishedArcs
  where authorUid==uid), publicProfile}`. Firestore Timestamps inside the projections → ISO strings in
  the JSON (a replacer), everything else verbatim.
- **Markdown bundle** (R3.5): `books/<slug>.md` (details · value marks with `why` verbatim · every entry on
  the book with body verbatim + photo links · the artifact title + body verbatim), `arcs/<slug>.md` (title,
  description, value marks, books, each sub-theory: header/status, PUBLIC and WORKING bodies verbatim,
  value marks, evidence with quote + annotation verbatim and the cited entry's body for `{kind:'entry'}`,
  the arc's entries), `arcs/_unrooted.md` (sub-theories with no live arc — the re-homed ones), `notebook.md`
  (every entry, in order, with its book/arc context), `profile.md` (names, tagline, carrying question,
  statement, per-value statements, the reader-model summary + threads, the public profile), `README.md`.
  Slugs are title-derived with a uid-suffix on collision; prose is inserted RAW (never escaped).
- **ZIP, hand-written, STORE-only, real CRC32** (R3.2): `buildZipBlob(entries, nowMs)` — local headers
  (flag 0x0800 UTF-8 names), central directory, EOCD; `zipCrc32` table-driven (0xEDB88320); a manual
  UTF-8 encoder (`_u8FromString`, surrogate pairs handled). No library.
- **Photos** (R3.3): `_exportCollectImages` reads every image id this bundle's entries reference from
  IndexedDB (`nbPhotoIdbGet`), packs `images/<id>.<ext>` by blob type, and rewrites the Markdown links to
  the real extension; a blob absent on this device (cross-device ref) is skipped, not an error.
- **Delivery** (R3.4): two taps by design — PREPARE (async: projections + photos; button reads
  "Preparing…", status line reports what was gathered and the size) then SAVE inside the tap:
  `deliverExport` → `navigator.canShare({files:[File]})` → Share sheet; else `<a download>`; `cancelled`
  / `failed` / `shared` / `downloaded` each get an honest status line. The projections' Firestore reads
  failing (signed-out rig, offline) does NOT block the export — the private record still exports.
- **Placement** (R3.6): the Profile's Settings register — a new "Your data" `.pf-card` after the Settings
  card (`_pfDataSection`, `sec-data pf-owner-only`), primary `.pf-btn.save` "Export my data", wired
  through `_pfWire` (`export-prepare` / `export-save` act on the TAPPED button so Item 2's panel can offer
  the same export). `_pfDataDeleteControl` is an empty stub Item 2 fills.
- `exportWorkspace()` (state.js) DELETED with a note; its two comment citations reworded.

### Proofs
- **`tools/export-test`** (cscript; loads the REAL state.js + integrations.js in ONE scope with
  localStorage / firebase / Blob / Uint8Array shims and ES5 shims, seeds a fixture through the app's own
  writers — `ensureUser`, `ensureBookFields`, `createArc`, `addBookToArc`, `addEntryToArc`,
  `createSubTheory`, `addEvidence`, `createUserTheme`, `ensureOneArtifact`, `setProfile`, `getReaderModel`;
  notebook entries in the capture writer's shape) → **58 / 58 passed** (self-check first):
  [1] round-trip: parse(stringify(bundle)) → counts per collection == seed (2 books / 2 index / 1 arc /
  2 entries / 2 subs / 1 theme / 1 artifact), the sentinel replaced by the export instant, profile
  statement + reader-model summary byte-equal, projections + public profile carried, **every string field
  of every live record byte-equal after the round-trip (0 mismatches)**; [2] PROSE INVARIANT: 12 prose
  strings (two `why`s incl. newlines/unicode/emoji, two entry bodies incl. markdown-looking text, the
  public + working bodies, artifact title + body, quote, annotation, statement, description) each present
  VERBATIM in the JSON and in the Markdown; the artifact body in the book file, the working body in the
  arc file, the orphan in `_unrooted.md`, the photo link in the book file; [3] a second uid's book, arc,
  entry and prose ABSENT from JSON and Markdown; [4] CRC32 reference vector `'123456789'` → 0xCBF43926,
  UTF-8 encoder 5 bytes for `café` / 4 for an emoji, the archive parsed BACK from its bytes — EOCD
  signature + count, central directory ends at the EOCD, every entry's local signature / STORE method /
  sizes / **re-computed CRC equal**, names intact, total size == Σ(30+name+data) + Σ(46+name) + 22.
  (Three harness-side false failures on the way, each fixed in the harness: `createArc`'s argument order
  is (title, description, uid); the REAL `getCurrentUser` in integrations.js reads `praxis_user`, so the
  fixture must stub it; cscript reads the harness in the system codepage, so non-ASCII test strings are
  built from char codes.)
- Parse gates: integrations.js / state.js / views.js → PARSE OK exit 0. C3A2 0, CR 0 on all.
- grep: `exportWorkspace` fn defs 0 (1 comment mention, the deletion note) · `buildUserProfileDoc(` 3 (def
  + save site + export) · `buildUserReaderModelDoc(` 3 · `prepareExport(` views 1 / integrations 2 (def +
  self) · `deliverExport(` views 1 · `_pfDataSection(` 2 · `export-prepare` act 1 · `.pf-data-line` 2.
- **Live, UI-driven, on the rig** (localhost:8791, SW unregistered, stub uid `d0tester`, the seed
  workspace): see the rig lines below — the card renders in the Profile, the button is the element under
  the tap, PREPARE runs against the real code path (the projection reads fail signed-out and are
  tolerated), the status line reports the archive.

### VISUAL GATE (#11) — owner-visible delta, measured fresh 2026-09-03 on the rig
Delta stated before build: the Profile's Settings column gains a "Your data" card below Settings with one
gold primary button "Export my data"; nothing else on the page moves. Reference surface: `.pf-card` /
`.pf-set-row` / `.pf-btn.save` (components.css:15488/15576-15578; views.js `_pfSettingsSection`).
| viewport | card rect | pixels visible (after scrollIntoView) | element under the button | copy |
|---|---|---|---|---|
| 1360×900 | x34 y734 w1277 h166 | 166 / 166 | `.pf-data-line` (card), button 113×44 | eyebrow "Your data" |
| 390×844 | x18 y473 w354 h189 | 189 / 189, no horizontal overflow | `[data-act=export-prepare]` (button 310×44, full-row) | same |
Type: `.pf-data-line` Cormorant Garamond 15px `rgb(100,89,64)` on the card's `rgb(255,253,248)` → **6.8:1**;
the button is the unchanged `.pf-btn.save` gold register. Screenshots in this headless pane time out
(the documented rig fact — geometry is the evidence); Preston's felt pass closes the gate. Rig note: at
390 the FIRST measurement hit the first-run intro overlay (`.intro-panel-wrap`, the stub user's
`praxis_intro_profile`), not the button — the rig's first-run flow, not a defect; removed for the tap
measurement. Console on the rig: two `google-books-proxy` 404s (no functions on the rig) + the SW
registration error — pre-existing rig behaviour, not Item 3.

### Bytes (LF-normalized) — expected vs actual
| file | expected | actual |
|---|---|---|
| js/integrations.js | +9,000 (bundle + markdown + zip) | +23,041 (the module is 4× the estimate: markdown writers for 5 files + the zip + delivery + the two hoisted builders) |
| js/state.js | −1,500 (exportWorkspace deleted) | −1,428 |
| js/views.js | +2,500 | +5,191 |
| assets/components.css | +900 | +770 |
| tools/export-test | new | new 18,4xx |
| sw.js | +0 | +0 (praxis-v3.296 → praxis-v3.297) |
The integrations.js overage is CODE, not comment (a code-band breach by the declared figure): stated
here, not widened silently — the Stage-0 floor under-counted five Markdown writers and the delivery layer.

### Rig — live, UI-driven (2026-09-03, localhost:8791, SW unregistered, stub uid `d0tester`)
1. Fresh stub (owns nothing; the seed workspace belongs to `__praxis_seed__`): tap "Export my data" →
   button "Preparing…" (disabled), status "Gathering your books, arcs, notes and photos…" → after the
   real `prepareExport` (the two Firestore projection reads FAIL signed-out and are tolerated) → status
   **"Ready: 0 books, 0 arcs, 0 photos · praxis-export-2026-09-03.zip (3 KB). Tap Save to keep it."**,
   button → "Save the archive" (`data-act=export-save`), `_pfExportPrepared` = 4 entries (praxis.json,
   notebook.md, profile.md, README.md), json head `{"format":"praxis-export","version":1,
   "schemaVersion":"1.30.0",…}`.
2. Seeded 1 book (+ a value mark `why`) / 1 arc / 1 sub-theory (+ book evidence with quote +
   annotation) / 1 marginalia entry for `d0tester` through the state writers + `saveState()`, re-tapped →
   **"Ready: 1 book, 1 arc, 0 photos · praxis-export-2026-09-03.zip (6 KB)"**, 6 entries, **all 7 RIG prose
   needles present in the JSON**, `"uid": "d0tester"` in the JSON.
3. Tap "Save the archive" → this pane has no `navigator.share` → the anchor-download path → status
   **"Saved praxis-export-2026-09-03.zip to your downloads. Export again any time — the archive is a
   snapshot of right now."**, button back to "Export my data", `_pfExportPrepared` cleared. (The pane's
   sandbox makes the download itself inert — the path and the copy are what is proven here; the Share
   sheet is proven on Preston's iPhone.)

### Red-team (§9) — dispatched on the frozen (staged) tree
(appended below when it returns)

### Red-team (§9) — dispatched on the frozen (staged) tree — VERDICT: 1 BLOCK + 1 CONCERN, both fixed before commit
The agent diffed the hoisted builders field-by-field against the deleted inline payloads (HEAD vs staged:
byte-identical fields, defaults and guards; the sentinel still what the save sites write; the export
stamps only its own fresh wrapper), re-ran `tools/export-test` (58/58), re-measured every byte delta
(exact), the ES3 rail, UTF-8 and CR, the sw.js bump, the owner-only fence, the synchronous share call
inside the tap — and went further than the harness: it wrote a standalone script that loads the REAL
staged `buildZipBlob` / `_u8FromString`, wrote a real .zip, and validated it with the actual Info-ZIP
`unzip` binary (`unzip -t` → "No errors detected"; `-l` / `-p` list and extract) — the format is
standard-compliant, not merely self-consistent.
1. **BLOCK** — `docs/studio/account.md` (staged) said "Items 3 + 2 — LOCAL v3.297 / v3.298" and described
   Item 2's mechanics as built, inside a diff that builds Item 3 only: a status claim about work that did
   not exist (the claims-outliving-code family). FIXED: the line now records Item 3 only and says in so
   many words that Item 2 is the next commit and not built as of that line. (BOARD.md's parallel line
   was phrased as a forward note and was fine.)
2. **CONCERN** — `_pfExportPrepared` was a bare module var with no uid; the SAVE tap re-used it without
   re-checking identity, so a shared-browser account switch between PREPARE and SAVE (narrow but real:
   the Profile page must stay mounted across the switch) could hand one reader another reader's prose.
   FIXED: `prepareExport` stamps `uid` on the prepared record; `_pfExportSave` discards it and re-prepares
   when `r.uid !== uid` or the signed-in user now is not `uid`. Not harness-testable offline (the prepare
   path is Firebase-async); proven by code read + grep (`r.uid !== uid` 1, `uid: uid, blob` 1).
Post-fix: parse OK ×2, 58/58, C3A2 0. Final bytes (LF): integrations.js +23,041 · views.js +5,191 ·
state.js −1,428 · components.css +770 · sw.js +0.

## ITEM 2 — ACCOUNT DELETION, END TO END (v3.298)

### Design as ruled (the exact order)
`deleteAccount(callback, progress)` (integrations.js, replacing the Stage 14.3 definition that deleted
the data FIRST, could not re-auth, and omitted userArtifacts + every social projection):
0. the surface has ALREADY offered the export (step 1 of the panel — optional, the reader may skip);
1. **RE-AUTHENTICATE FIRST** — `authUser.reauthenticateWithPopup(GoogleAuthProvider)` (the only wired
   provider). Refused / closed → `{status:'error', phase:'reauth'}`: nothing deleted, session live;
2. the uid is captured to a LOCAL var before anything else;
3. **ONE ATOMIC BATCH** over everything under the uid — `deleteAccountCloudData(uid)`: the 8 private docs
   (`userBooks userArcs userNotebook userSubTheories userProfiles userThemes userReaderModel
   userArtifacts`/{uid}), `aiUsage/{uid}` (the AI-ceiling counter; owner-DELETE only by rule),
   `publicProfiles/{uid}`, `publishedArcs where authorUid==uid`, `follows where followerUid==uid` AND
   `where targetUid==uid`, `buildOns where fromUid==uid`. Refs are gathered first, then committed in
   chunks of 400 (Firestore caps a batch at 500) — a realistic account is 10 fixed docs + a few dozen
   edges/arcs, so ONE chunk; idempotent (a re-run finds nothing by query and completes). Any failure →
   `{status:'error', phase:'firestore'}`: nothing local touched, session live, retryable;
4. **Auth delete** (`authUser.delete()`). If THIS fails after the batch → `{status:'error', phase:'auth',
   recoverable:true}` and the LOCAL DATA IS LEFT INTACT AND RE-UPLOADED AT ONCE (`restoreCloudFromLocal`:
   every collection marked dirty + saved, profile + reader model saved directly); the panel says exactly that;
5. **local wipe** ONLY after a successful Auth delete — `wipeAccountLocal(uid)`: `accountLocalKeysFor(uid)`
   sweeps EVERY localStorage key carrying `_<uid>` (by inspection of the store, never a hand-kept list —
   so a key a later build adds is swept too), plus the enumerated global caches / budgets / cooldowns /
   view prefs (`ACCOUNT_GLOBAL_KEYS`, no prose in any of them), this uid's entry in `praxis_yumi_noticed`,
   the notebook photos this uid's entries reference — deleted PER RECORD via the new `nbPhotoIdbDelete`
   (never `deleteDatabase`; another account on a shared device keeps its photos), then `clearUserState()`;
6. `praxis_user` → null, `signOut()`, `{status:'deleted'}` → the surface routes to `#deleted`.
`progress(phase)` fires `reauth | cloud | login | local` so the panel shows honest phase copy.

**The local keys enumerated — by grepping the diffs of Items 1, 3 and 4 + the app's own writers**
(every one carries the uid in its name and is swept by the `_<uid>` inspection): Item 4a
`praxis_pending_deletes_{arcs,subTheories,themes,artifacts}_<uid>`; Item 4b `praxis_pending_unpublish_<uid>`;
Item 1 and Item 3 introduce NO localStorage keys and NO IndexedDB stores (Item 1's counter is
server-side; Item 3's `_pfExportPrepared` is an in-memory module var). Pre-existing per-uid keys swept
by the same rule: `praxis_state_<uid>`, `praxis_pending_books_<uid>`,
`praxis_pending_{arcs,subTheories,themes,artifacts}_<uid>`, `praxis_pending_book_deletes_<uid>`,
`praxis_merge_tombstones_<uid>`, `praxis_nb_gather_<uid>` (draft prose), `praxis_nb_draft_<uid>_<ctx>`,
`praxis_scan_draft_<uid>`, `praxis_firstshelf_offer_<uid>`. Global (wiped whole): the 25 keys in
`ACCOUNT_GLOBAL_KEYS`. IndexedDB: `praxisNotebook/photos`, per record. `praxis_user`: cleared last.

**Surface** (in the Item 3 card, same `.pf-*` register): `_pfDataDeleteControl` fills the stub with a
ghost + danger-ink "Delete account…" beside Export; `_pfOpenDeletePanel` mounts a panel INSIDE the card —
title, the plain copy ("It is final. There is no undo and no grace period; the export is the grace."),
step 1 "Export first" (optional; the Item 3 prepare/save on the TAPPED button), step 2 the email field
(the confirm button is DISABLED until the typed value equals the account email, case-insensitive), the
red "Delete my account" + "Keep my account"; `_pfRunDelete` shows the four phase lines and a plain
outcome line per failure leg; `renderDeletedPage` renders `#deleted` in the profile's signed-out prompt
register (`.pf-below .pf-thesis .pf-card .pf-now`) — "Your account is gone." + one "Back to Praxis". The
`#deleted` route is dispatched before `#about` in `renderRoute`. `openAccountDeleteConfirm` (dead since
e5671d1) and `wipeActiveUserLocal` (its only caller was the old deleteAccount) are DELETED with notes.

**firestore.rules** (written to the repo; Preston publishes BEFORE v3.298 pushes — report §5 carries the
verbatim text): `publicProfiles/{uid}` gains `allow delete` for the owner; `follows/{edgeId}` delete by
EITHER endpoint; new `match /aiUsage/{uid}`: `read, create, update: if false`, `delete` by the owner.

### Proofs
- **`tools/delete-test`** (cscript; the REAL state.js + integrations.js in one scope, a scripted Firebase
  stub — reauth / batch / auth-delete each forced to fail or succeed — a synchronous Promise shim, a
  recording `nbPhotoIdbDelete`, a device fixture with 17 per-uid keys for EACH of two uids + the global
  caches + `praxis_yumi_noticed` for both + photos for both, a server fixture with both uids' published
  arcs, follows in both directions and a foreign one, and build-ons from each): **49 / 49** —
  [F] the sweep finds all 17 of uid A's key shapes (incl. Item 4's pending-delete key, 4b's unpublish
  key, the composer draft) and none of B's; [A] re-auth refused → phase `reauth` only, 0 batches, 0 cloud
  deletes, auth user kept, not signed out, all local keys + `praxis_user` + in-memory entries intact;
  [B] batch fails → phase `firestore`, 0 cloud deletes, nothing local touched; [C] Auth delete fails
  AFTER the batch → phase `auth`, `recoverable:true`, cloud docs deleted, **local keys / `praxis_user` /
  photos / in-memory maps INTACT**, not signed out; [D] success → phases `reauth>cloud>login>local`,
  re-auth exactly once and first, the batch holds **exactly the 15 owned docs** (8 private + aiUsage +
  publicProfiles + 2 published arcs + BOTH follow edges + my build-on) and NOT the other uid's arc, a
  foreign edge, or the other reader's build-on on my arc (rule-bound: their words), auth user deleted,
  every key carrying the uid gone, the other uid's 17 keys untouched, the global caches gone, this uid
  removed from `praxis_yumi_noticed` and the other kept, this uid's two photos deleted per record and
  the other's kept, `praxis_user` null, signed out, in-memory maps cleared; [E] a re-run after success
  completes with only the 10 fixed docs in the batch and nothing found by query (idempotent). The
  harness first ran against a scratch copy of the tree with Item 2's scripts applied (49/49 there too),
  before the real tree changed.
- Parse gates: integrations.js / state.js / views.js → PARSE OK exit 0; C3A2 0; CR 0.
- grep: `function deleteAccount` 1 · `deleteAccountCloudData(` 2 · `wipeAccountLocal(` 2 ·
  `accountLocalKeysFor(` 2 · `openAccountDeleteConfirm` 0 fn (1 note) · `wipeActiveUserLocal` 0 fn (1
  note) · `renderDeletedPage(` 2 · `_pfOpenDeletePanel(` 2 · `nbPhotoIdbDelete(` 2 (def + call in
  wipeAccountLocal via typeof) · `parts[0] === 'deleted'` 1 · rules: `aiUsage` 1 block, `targetUid ==
  request.auth.uid` 2 (the read rule + the new delete rule).
- The rig cannot exercise the Firebase legs (no real auth on the rig) — they are the device click-path
  (report §6, Item 2 (4)–(8)); the harness is the offline proof of the ORDER and of what each leg
  touches.

### Item 3 commit
**`ac8a7f0`** — `feat(P1 Item 3) — export: one archive, praxis.json from the same eight builders the sync
writes, plus Markdown a reader can open without a parser → v3.297` — 10 files, +992/−106, tree clean after.

### VISUAL GATE (#11) — Item 2, measured fresh on the rig 2026-09-03 (port 8792, stub uid `d0tester`)
Delta stated before build: the Your-data card gains a ghost "Delete account…" beside Export; tapping it
opens a panel INSIDE the card (title, copy, step 1 Export first, step 2 the email field, the confirm
disabled until the email matches, Keep my account); `#deleted` is a one-card page in the profile's
signed-out register. Reference surfaces: `.pf-card` / `.pf-set-row` / `.pf-btn` (the card + buttons),
`.pf-below .pf-thesis .pf-card .pf-now` (the done page).
| viewport | element | rect | visible / hit | contrast |
|---|---|---|---|---|
| 1360×900 | Delete account… | x180 y456 122×44 | element under the tap = `delete-account` | ink `rgb(100,89,64)` on `rgb(255,253,248)` **6.78:1**, border `--danger` |
| 1360×900 | the panel (open) | x56 y516 1233×364 | 364 / 364 px | title 17.14:1 · copy 6.78:1 · step eyebrow 6.78:1 |
| 1360×900 | confirm, DISABLED at open + after a wrong email | x56 y832 136×44 | `disabled` true → true | ink `--ink-3` `rgb(151,139,109)` 3.32:1 on the card (an INACTIVE control — exempt; re-measured on the final bytes, see pass 1 #5) |
| 1360×900 | confirm, ENABLED after the exact email (case-insensitive) | same | `disabled` false | `--ink` 600 on a 14% `--danger` wash inside a `--danger` border → **≈14:1** (composited `rgb(247,231,221)`; the in-page helper misparsed `color()` and printed 12.45 — both ≫ 4.5) |
| 1360×900 | Keep my account | — | closes the panel (`.pf-del` gone) | ghost register |
| 390×844 | Delete account… | x196 y180 154×44 | tappable | same inks |
| 390×844 | the panel | x40 y240 310×402 | 402 / 402 at panel top; no horizontal overflow | Export first 300×44 full-row; confirm 155×44 + Keep 145×44 side by side; element under the confirm tap = `del-confirm` |
| 1360 / 390 | `#deleted` | card 564×180 @1360 · 354×234 @390 | rendered on the route, "Your account is gone.", link → `#home` 107×46 | `.pf-now` 6.78:1 |
Two contrast defects were found BY this measurement and fixed before the freeze: the ghost register's
`.pf-btn.ghost` (0,2,0) beat `.pf-btn-danger` (0,1,0), leaving the delete control at the ghost's 3.1:1
`--ink-3`; and the first solid confirm (`--text-on-dark` on `--danger`) measured 3.3:1, then `--ink` on
solid `--danger` 4.17:1 — `--danger` is too light a fill for AA at 12px. Final cut: dark ink everywhere,
the danger carried as border + wash. No new hex (`color-mix` is already in use 153× — the Safari 16.2+
floor T26 recorded). Screenshots time out in this pane (rig fact); geometry + computed colour are the
evidence; Preston's felt pass closes the gate.

### Bytes (LF-normalized) — expected vs actual
| file | expected | actual |
|---|---|---|
| js/integrations.js | +3,800 | +5,769 (the flow + the cloud batch + the local sweep + the photo loop) |
| js/views.js | +5,000 | +4,873 |
| js/state.js | −900 (wipeActiveUserLocal deleted) | −55 (the note is as long as the function was) |
| assets/components.css | +1,200 | +2,417 |
| firestore.rules | +400 | +1,486 (three commented blocks; the file also normalised CRLF→LF, blob unaffected) |
| tools/delete-test | new | new 19,561 |
| sw.js | +0 | +0 (praxis-v3.297 → praxis-v3.298) |

### Red-team pass 1 (§9, deep) — VERDICT: 2 BLOCKs + 4 CONCERNs/NOTEs. Every one acted on before commit.
The agent re-ran the harness (49/49, exit 0 checked separately), re-measured every byte, CR, parse gate,
confirmed 0 callers left for the deleted functions, traced attack (1) (nothing touched before re-auth
resolves — correct) and attack (2)'s first half (local / `praxis_user` / signOut untouched after an Auth
failure — correct), and verified every per-uid key from Items 1/3/4 and the pre-existing set resolves to
the `_<uid>` sweep. Findings + dispositions:
1. **BLOCK — "recoverable by sync" was a claim the code did not deliver.** The load-side `'absent'`
   branches never push local data up; only a dirty flag does, and nothing set one. So "sign in again and
   your data syncs back up" was false for books/arcs/notebook/subs/themes/profile/readerModel. FIXED by
   MECHANISM: on an Auth-delete failure after the batch, `restoreCloudFromLocal(uid)` marks every
   collection dirty + `saveState()` and saves profile + reader model directly — while the fresh re-auth
   token is valid. Harness case [C] now asserts all EIGHT collections are re-uploaded (`set` on each
   doc ref) before the panel reports; the panel copy says what happened ("Praxis has re-uploaded your
   data from this device, so nothing is lost and you are still signed in"). The header comment and the
   ledger row that echoed the old claim reworded.
2. **BLOCK — the `#deleted` page said "nothing can be restored" while a second signed-in device could
   still write under the uid for up to an hour** (its ID token stays valid until `exp`; the untouched
   private-collection rules admit it). Not closable without a deletion tombstone, which the brief forbids
   ("Deletion is final. No tombstone"). FIXED as COPY + a NAMED RESIDUAL **R2-1**: the done page now says
   "If another device was still signed in, it will be signed out within the hour — sign out there to clear
   its copy." Whatever a stale device writes in that window lands under a uid no one can ever sign in as
   again (Auth reissues a new uid) — unreadable orphans, a hygiene residual, not a privacy hole; the
   device click-path (8) observes it.
3. **CONCERN — the three `where` queries are rule-servable in principle but the harness enforces no
   rules.** Firestore evaluates a rule against a query's constraints; `where('targetUid','==',uid)`
   satisfies the `targetUid == request.auth.uid` arm of `follows`' OR, `where('fromUid','==',uid)` the
   `fromUid` arm of `buildOns`' OR, and `publishedArcs` reads are `request.auth != null` — and the app
   already runs `publishedArcs.where('authorUid'…)` and `buildOns.where('fromUid'…)` today. RESIDUAL
   **R2-2**: a named live check in the device pass — if a query is refused, the flow stops at phase
   `firestore` with nothing touched (safe), and the fix is to read the ids from local state / the public
   profile instead of querying.
4. **CONCERN — a failure after an earlier chunk committed said "nothing was deleted".** FIXED:
   `deleteAccountCloudData` counts committed docs and rejects with `committed`; the panel says "N
   documents were removed before it stopped, and the rest are still there … run Delete account again —
   it picks up where it left off." Harness case [B2] (405 refs → 2 chunks, the second refused) asserts
   phase `firestore`, `partial === 400`, 400 cloud deletes, local intact.
5. **CONCERN — the visual table mislabelled the disabled confirm** ("`--ink-3`… measured `rgb(36,23,16)`"
   — the measurement had run before the cache-busted CSS applied). RE-MEASURED on the final bytes:
   disabled ink `rgb(151,139,109)` = `--ink-3`, **3.32:1** on the card, border `--danger-line` — an
   INACTIVE control (WCAG 1.4.3 exempts disabled components); enabled ink `rgb(36,23,16)` = `--ink`.
6. **NOTE — four uid-less globals survived the wipe** (`praxis_portrait_dismissed` — account-linked,
   a pre-existing cross-account leak — `praxis_yumi_hand`, `praxis_m_first_seen`, `praxis_m_activated`).
   FIXED: added to `ACCOUNT_GLOBAL_KEYS`; harness [D] asserts them gone. The completeness claim is now
   stated precisely: uid-carrying keys by inspection, uid-less keys by the list.
7. **NOTE — a null email made the confirm a dead end.** FIXED: with no email on file the step reads
   "Type **delete my account** to confirm" and the phrase enables the button (harness-independent; code
   read + rig: with an email present the step still reads "Type your email to confirm").
8. **NOTE — grep count**: `targetUid == request.auth.uid` is 2 (the pre-existing read rule + the new
   delete rule), not 1. Corrected.
Post-fix: parse OK ×2, `tools/delete-test` **58 / 58** (was 49: + the 8 re-upload asserts, [B2] ×7, the
globals), C3A2 0, CR 0. Final bytes (LF) vs ac8a7f0: integrations.js **+8,413** · views.js **+5,572** ·
state.js −55 · components.css +2,417 · firestore.rules +1,486 · tools/delete-test new 21,857 · sw.js +0.
Rig re-measured on a fresh port (8793): the panel opens, the step reads "Type your email to confirm", the
label carries the email, the exact email enables the confirm; the `#deleted` copy is the new copy.

### Red-team pass 2 (§9) — on the fixes — VERDICT: 1 BLOCK + 2 CONCERNs + 2 NOTEs. Every one acted on.
Confirmed clean by the agent: the chunk accounting (`committed` only after commit resolves; [B2] re-run),
the F-DL1 latches (every save fn gated on its own `*Loaded`; the harness's `setLoaded` sets exactly those,
no cheat), a failed `auth.delete()` does not revoke the token, no absolute copy remains, the null-email
check cannot be satisfied by an empty string when an email exists, the rules match the queries, parse OK
×3, 58/58, C3A2 0 (its own first hex scan false-positived and it said so).
1. **BLOCK** — `docs/launch-runway.md` still said "tools/delete-test 49/49" after the harness grew to
   58. FIXED (58/58, with what the nine new cases cover). The same doc-currency slip the round's own
   Item 3 pass blocked — caught again by the gate, as it should be.
2. **CONCERN** — the checkpoint's integrations.js delta (+8,413) was measured BEFORE the header comment
   was reworded; the agent measured +8,564. FIXED by re-measuring on the final bytes after the pass-2
   changes below: **+9,886** (LF, vs the `ac8a7f0` blob). Views +5,572 unchanged.
3. **CONCERN — a race the recovery mechanism introduced.** `restoreCloudFromLocal` was fire-and-forget;
   the panel re-enabled "Delete my account" at once and its copy invited a retry, so a fast second run
   could delete the docs and then have the FIRST run's late re-upload writes land under a uid whose Auth
   record was by then gone — a self-inflicted version of R2-1. FIXED by MECHANISM: `restoreCloudFromLocal`
   now calls the eight save functions DIRECTLY, each as its own job that resolves when its callback fires
   (ok / deferred / error alike), returns `Promise.all`, and `deleteAccount` AWAITS it before it throws the
   `'auth'` failure — the panel cannot hear the result, let alone re-enable the button, until every
   re-upload has settled. Harness [C] still asserts all 8 `set`s (now necessarily BEFORE the callback).
4. **NOTE** — `praxis_m_counts` / `praxis_m_errors` (measure.js' anonymous aggregate counters) were the
   two uid-less siblings still outside the list. Added to `ACCOUNT_GLOBAL_KEYS` (harmless to wipe: no
   per-user link) and to the harness fixture + assertion (now "the six uid-less globals gone").
5. **NOTE** — `saveState()`'s six dirty-flag blocks run in source order without per-block isolation, so
   one builder throwing would have silenced the rest and the copy would still say "nothing is lost".
   Addressed by the same change as #3: the restore no longer goes through `saveState`; each collection is
   its own try, so one failing builder cannot stop the other seven. (The app-wide `saveState` shape
   itself is pre-existing and untouched — a separate residual, not this item's.)
Post-fix: parse OK, `tools/delete-test` 58/58, C3A2 0. Final bytes (LF) vs ac8a7f0: integrations.js
+9,886 · views.js +5,572 · state.js −55 · components.css +2,417 · firestore.rules +1,486 ·
tools/delete-test new 21,959 · sw.js +0. No third agent pass: the pass-2 fixes are one awaited promise, a
per-collection try, two list entries and two doc corrections, each re-proven by the harness; recorded here
for Preston's read (data-loss tier, FIX-PROTOCOL §5 C — the human read is the gate).

# CONSOLIDATED REPORT (appended after the final commit)

Base 53c968d / v3.294 confirmed (HEAD == origin/main, clean tracked tree). Four local commits, NO push.
Full record: `docs/checkpoints/p1-safety-build.md` (Stage 0: `p1-safety-recon.md`).

## 1. Protocol docs — found / missing (by filename)
FOUND: CLAUDE.md · PROTOCOL.md (v1.2) · docs/FIX-PROTOCOL.md (v1.3) · .claude/agents/fix-red-team.md (Sonnet-pinned; dispatched 4×) · the other six agent files · hooks/pre-commit · tools/parse-check · docs/launch-runway.md (the live ledger) · docs/checkpoints/p1-safety-recon.md.
MISSING: docs/LAUNCH-STATUS.md (FIX-PROTOCOL §1/§11 point at it; docs/studio/LAUNCH-STATUS.md exists) — noted, NOT created, per the go-ahead.

## 2. R1.2 premise test — can any AI call site fire before sign-in?
NO, for all 14 (12 claude-proxy sites in yumi-brain, import-capture's segmentDoc, the scan surface's shelf-vision). Each traced to its entry gate: the Yumi send handler returns signed-out before any brain call (yumi-ui.js:1212); the lens panel opens only from inside renderShelf's signed-in branch; the profile page returns a sign-in prompt; every consider* orchestrator early-outs on no uid; the capture door's Split button exists only after a commit that requires sign-in; renderScan hard-gates signed-out. Table with every anchor in the checkpoint. No fork → proceeded.

## 3. R4.1 rendered-home statement
A deleted arc's sub-theories are re-homed to `arcId:null` and render where today's orphans render: the Arcs field's ORPHAN SEAT (`_afBuildOrphanSeat`, views.js:3921, mounted at :4156 for a signed-in owner — its predicate is exactly "arcId falsy or no live arc") and their own `#subtheory/<id>` page (`renderSubTheoryPage` resolves the arc with `sub.arcId && state.arcs[sub.arcId]` and renders with null). Registers: the field's `.af-*` and the page's `.st-*`. No new surface, no HALT. The red-team swept all 86 `.arcId` readers and found ONE more that needed a null guard (the mark composer's sibling scan) — fixed.

## 4. Per item
| Item | commit | sw.js | files (expected → actual bytes, LF) | grep before → after | red-team |
|---|---|---|---|---|---|
| **1 — cost ceiling** | `0fb8aa8` | v3.295 | claude-proxy +900→+1,057 · shelf-vision +700→+444 · lib/ceiling.js new 11,692 · lib/ceiling-core.js new 4,804 · tools/ceiling-core-test new 7,023 · vision-proxy.js −10,134 (deleted) · yumi-brain −392 (helpers +3,900, 12 sites −4,290) · import-capture +106 · views +1,732 · yumi-ui +891 · sw +0 | direct proxy `fetch(`: 14 → 0 (12 + 1 + 1); `aiProxyFetch(` 14, `aiProxyRequest(` 3 | no BLOCK; 2 CONCERNs fixed pre-commit (explicit `createPublicKey` on the cert PEM; doc currency), 4 notes; residuals R1-a (a cert-fetch blip reads as "sign in again"), R1-b (book-mode does not refund the client shot on `limit`, matching its existing pattern) |
| **4 — FX-1c + reference sweep** | `12a8c2c` | v3.296 | state +4,800→+5,070 · integrations +3,200→+5,261 (4a +3,393; the retry queue added after the red-team +1,868) · views +1,200→+2,420 · tools/fx1c-sim new 16,316 · sw +0 | `FX-1c splat-begin/end` 4/4 · `noteRecordDeleted(` 4+1 · `getPendingDeletes(` 4+4 · `clearPendingDelete(` 1+4 · `unpublishArc(` in views 1 → 2 · `pendingDeleteSync` 0 (the record's name; the key is `praxis_pending_deletes_<kind>_<uid>`) | no BLOCK; 3 CONCERNs fixed pre-commit (mark-composer orphan collision; the deleted-arc toast said "publish again" and my "sanitize retries" claim was false → honest copy + a durable retry queue drained on the next arcs load; two anchors re-derived against the committed tree: `mergeBookDuplicates` views.js:8599, drop-side artifact delete :8778). Residual R4-1: the merge's drop-side artifact delete stays unguarded (marking it needs a 2-line touch inside the closed Undo — your call) |
| **3 — export** | `ac8a7f0` | v3.297 | integrations +9,000→+23,041 (CODE overage, stated: five Markdown writers + zip + delivery + two hoisted builders) · views +2,500→+5,191 · state −1,428 (exportWorkspace deleted) · components.css +770 · tools/export-test new 20,292 · sw +0 | `exportWorkspace` fn 0 · `buildUserProfileDoc(` 3 · `buildUserReaderModelDoc(` 3 · `prepareExport(` 1+2 · `_pfDataSection(` 2 | 1 BLOCK + 1 CONCERN, both fixed pre-commit: the studio ledger line overclaimed Item 2 as built; the prepared archive was not uid-bound at Save (now stamped + re-checked). The agent also validated a real archive with Info-ZIP `unzip -t` |
| **2 — account deletion** | `277c7fd` | v3.298 | integrations +3,800→+9,886 (the flow + the batch + the sweep + the awaited re-upload) · views +5,000→+5,572 · state −900→−55 · components.css +1,200→+2,417 · firestore.rules +400→+1,486 · tools/delete-test new 21,959 · sw +0 | `function deleteAccount` 1 · `deleteAccountCloudData(` 2 · `wipeAccountLocal(` 2 · `accountLocalKeysFor(` 2 · `openAccountDeleteConfirm` fn 0 · `wipeActiveUserLocal` fn 0 · `renderDeletedPage(` 2 · `parts[0] === 'deleted'` 1 · rules `aiUsage` 1 | pass 1: 2 BLOCKs (the "recoverable by sync" claim → now an AWAITED per-collection re-upload; the absolute "nothing can be restored" → honest copy + residual R2-1) + 4 concerns/notes (partial-chunk honesty, the visual row, four uid-less keys, null email) — all fixed; pass 2 on the fixes: 1 BLOCK (a stale 49/49 in the ledger) + the retry race the recovery introduced (fixed by awaiting) + two measure keys — all fixed. Residual R2-2: rule-servable queries, live check |

Proof harnesses (all cscript, all over the REAL bytes, all self-checking): `tools/ceiling-core-test` 28/28 (N admitted, N+1 refused with resetAt, the 00:00 UTC reset with an injected clock, a second uid unaffected, a forged body uid unreachable) · `tools/fx1c-sim` 60/60, and with the guard stripped exactly the 4 resurrection cases fail · `tools/export-test` 58/58 (round-trip counts + every string byte-equal, 12 prose strings verbatim in JSON and Markdown, a second uid absent, the zip parsed back with re-computed CRCs) · `tools/delete-test` 58/58 (every failure leg incl. a mid-way chunk failure, the awaited re-upload, the success order, the local sweep). Rig (localhost, stub uid): Item 3's prepare → "Ready: 1 book, 1 arc … (6 KB)" → Save; Items 2/3 measured fresh at 1360 and 390 (rects, pixels visible, element under the tap, contrast ≥ 6.78:1 on every text element, the confirm ≈14:1) — screenshots time out in this pane (the documented rig fact); geometry is the evidence and the felt pass is yours.

Not provable from this box, stated plainly: Item 1's Node glue (token verify + Firestore REST) — Node is blocked; proven live by §6 (a). The iOS Share sheet (no iOS here). Item 2's Firebase legs (re-auth, batch, Auth delete) — no real auth on the rig; the harness proves the ORDER and what each leg touches, §6 proves them live.

Things I did that you should know: state.js and integrations.js were MIXED CRLF/LF in the working tree; both normalized to LF (every blob is LF regardless; git sees content lines only). The first views.js edit double-encoded 728 UTF-8 characters — caught by a marker grep, restored from HEAD, redone byte-safely. The first sim run "passed" vacuously because cscript has no JSON — caught, shimmed, re-run. R4-1's residual and the retry queue were my calls under the rulings; both named in the checkpoint.



## 7. Push readiness
| version | commit | state |
|---|---|---|
| v3.295 (Item 1) | `0fb8aa8` | GREEN locally; needs `PRAXIS_SA_KEY` + caps in Netlify BEFORE push (fail-closed) |
| v3.296 (Item 4) | `12a8c2c` | GREEN |
| v3.297 (Item 3) | `ac8a7f0` | GREEN |
| v3.298 (Item 2) | `277c7fd` | GREEN (two passes); needs the rules published BEFORE push |
NOT pushed. Builder regen (`tools/studio-build`) deferred to the push point per BUILDER CADENCE — it rides
the push go-ahead, not these commits. Pushing is a separate go-ahead.

(Sections 5 and 6 of the consolidated report — the prerequisites and the device click-paths — follow; they belong between §4 and §7 above.)
## 5. PRESTON'S PREREQUISITES — exact, in order

**Before v3.295 (Item 1) pushes — Netlify → Site configuration → Environment variables:**
| name | value | secret? |
|---|---|---|
| `PRAXIS_SA_KEY` | the FULL service-account JSON (Firebase console → Project settings → Service accounts → Generate new private key; project `praxis-b25d6`). Paste the whole file as one value. | **YES — secret; never in the repo, never in chat** |
| `PRAXIS_AI_DAILY_CAP` | `300` | no |
| `PRAXIS_AI_CAP_OVERRIDES` | **leave UNSET until the cap=3 test is done**, then `5rQp6HQkZZgIoIULLtyY2YHXqWj2:1500` | no |
(`PRAXIS_CLIENT_KEY` and `ANTHROPIC_API_KEY` already exist — unchanged.) Fail-closed means: until
`PRAXIS_SA_KEY` is set, every Yumi / shelf-scan call answers 503 `ceiling_unconfigured` and the app says
"Yumi is unavailable right now — the usage ceiling could not be checked." That is the intended behaviour
of a missing key, not a bug.

**Before v3.298 (Item 2) pushes — Firebase console → Firestore → Rules → paste the repo's
`firestore.rules` (the whole file, it is the source of truth) → Publish.** The three additions, verbatim:

```
    match /publicProfiles/{uid} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null
                            && request.auth.uid == uid
                            && request.resource.data.keys().hasOnly(publicProfileKeys());
      // P1 SAFETY (2026-09-03): the owner may DELETE their public projection --
      // without this the public name + publishedArcIds outlived the account.
      allow delete: if request.auth != null
                    && request.auth.uid == uid;
    }
```
```
      // P1 SAFETY (2026-09-03): EITHER endpoint may delete the edge -- a reader
      // deleting their account must be able to remove the edges that point AT
      // them, not only the ones they made.
      allow delete: if request.auth != null
                    && (resource.data.followerUid == request.auth.uid
                        || resource.data.targetUid == request.auth.uid);
```
```
    match /aiUsage/{uid} {
      allow read, create, update: if false;
      allow delete: if request.auth != null
                    && request.auth.uid == uid;
    }
```
Publishing the rules BEFORE v3.298 is safe on its own (they only widen delete for owners and lock
`aiUsage` to server-only writes). Publishing them before v3.295 is also fine — the function's service
account bypasses rules.

**Order:** rules published → env vars set (overrides UNSET) → push v3.295…v3.298 (one push) → the Item 1
cap=3 test on the TEST account → restore `PRAXIS_AI_DAILY_CAP=300`, set the override → Items 2/3 device
passes.

## 6. DEVICE CLICK-PATHS (written for DevTools on the live site unless marked PWA)

**Item 1 — the ceiling (test account `IdeCZDWvmPMvoEcfAQnMXVApQUg2`, `PRAXIS_AI_DAILY_CAP=3`,
`PRAXIS_AI_CAP_OVERRIDES` UNSET — the override must not be in place or it silently defeats the test).**
Expected observable in bold. Any of (c)–(f) returning 200 = FAIL-OPEN = Item 1 FAIL regardless of (b).
- (0) Hard-refresh praxis-reading.netlify.app on the laptop, accept "new version ready — Reload",
  DevTools → Application → Service Workers → confirm **`praxis-v3.298`** (or the pushed tip). Sign in as
  the TEST account.
- (a) Console: `firebase.auth().currentUser.getIdToken().then(function(t){copy(t); console.log(t.length)})`
  → **a ~900+ char token is on the clipboard**; paste it into a note now — it is the (e) input.
- (a′) Read the day's starting count: nothing to read client-side (the doc is server-only by rule) —
  note the UTC date instead.
- (b) Open Yumi, send "hello" → **Yumi answers** (this is the FIRST check: a normal signed-in call
  succeeds through the new verifier). One Yumi turn is ~3 proxy calls (router + gate + reply), so with
  cap 3 the SECOND message must be refused: send "and again" → **the bubble reads "You’ve reached today’s
  limit for Yumi. It resets at <your local time for 00:00 UTC>."** — NOT "Something went wrong reaching
  Yumi." Network tab: the refused `claude-proxy` call is **429** with body
  `{"code":"daily_limit","limit":3,"used":3,"resetAt":"<tomorrow>T00:00:00.000Z"}`.
- (c) Console, no Authorization header:
  `fetch('/.netlify/functions/claude-proxy',{method:'POST',headers:{'Content-Type':'application/json','x-praxis-key':PRAXIS_CLIENT_KEY},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:8,messages:[{role:'user',content:'hi'}]})}).then(r=>r.status)`
  → **401** (body `{"code":"unauthenticated"}`).
- (d) Same fetch with `'Authorization':'Bearer '+T` where `T` is the token from (a) with its LAST character
  changed → **401**.
- (e) More than ONE HOUR after (a): the same fetch with the ORIGINAL token from (a) → **401** (exp).
  (A fresh `getIdToken()` at that moment → 429/200 as normal — proves it is the expiry, not the account.)
- (f) Netlify → env → temporarily UNSET `PRAXIS_SA_KEY` → trigger a redeploy (Deploys → Trigger deploy) →
  the (c) fetch WITH a fresh valid token → **503** `{"code":"ceiling_unconfigured"}`, and Yumi's bubble
  says "Yumi is unavailable right now — the usage ceiling could not be checked." → restore the key,
  redeploy.
- (g) Sign in as the MAIN account on a second device/profile during the same UTC day → send one Yumi
  message → **answers** (a second uid is unaffected; its own counter).
- After: `PRAXIS_AI_DAILY_CAP=300`, set `PRAXIS_AI_CAP_OVERRIDES=5rQp6HQkZZgIoIULLtyY2YHXqWj2:1500`,
  redeploy. **The test uid's `aiUsage/IdeCZDWvmPMvoEcfAQnMXVApQUg2` doc will read `count: 4` (or the
  attempts made) until 00:00 UTC** — expected; it rolls to 1 on its first call the next UTC day.

**Item 3 — export (installed PWA on the iPhone; then Safari on the laptop).**
- (1) PWA: Profile → scroll to the **"Your data"** card below Settings → tap **"Export my data"** →
  button reads **"Preparing…"**, status "Gathering your books, arcs, notes and photos…" → then
  **"Ready: N books, M arcs, K photos · praxis-export-2026-09-0X.zip (S KB). Tap Save to keep it."** and
  the button reads **"Save the archive"**. (N/M should match the shelf and arcs pages; K = photos taken on
  THIS phone.)
- (2) Tap "Save the archive" → **the iOS Share sheet opens with the zip** → choose "Save to Files" →
  status **"Shared praxis-export-….zip. Export again any time…"**. Files app → open the zip → **a folder
  with praxis.json, README.md, notebook.md, profile.md, books/, arcs/, images/**; open one book's .md →
  its notes and value-mark "why" read verbatim.
- (3) Laptop Safari/Chrome: same two taps → **a download** (no Share sheet) → unzip → `praxis.json`
  opens as JSON, `"uid"` is yours, `collections.userBooks.books` has every book.
- (4) Contrast/look (VISUAL GATE): the card sits in the Settings register; at 1360 the button is the
  gold `Save` register, at 390 the button spans the row. Felt pass = yours.

**Item 2 — account deletion (a THROWAWAY Google account; never the main one).**
- (0) Create/sign in with a throwaway Google account on the laptop; add 2 books, 1 arc with a sub-theory,
  1 note with a photo; publish the arc; follow the main account from it and have the main account follow
  it back. Wait for sync (reload → the data is still there).
- (1) Profile → Your data → **"Delete account…"** → the panel opens IN the card: title "Delete your
  account", the plain-language copy, step 1 **"Export first"** (optional), step 2 the email field, the
  red **"Delete my account"** button DISABLED.
- (2) Tap "Export first" → the same prepare/save flow as Item 3 inside the panel (optional — skipping is
  allowed).
- (3) Type a WRONG email → **button stays disabled**; type the account's email exactly → **enabled**.
- (4) Tap "Delete my account" → **"Step 1 of 4 — confirming it is you (a Google window will open)…"** →
  CLOSE the Google popup without choosing → **"Nothing was deleted. We could not confirm it was you… Your
  account and everything in it are exactly as they were."** — reload: **everything is still there,
  still signed in** (the requires-recent-login leg: data + session intact).
- (5) Tap again → this time complete the Google re-auth → **"Step 2 of 4 — removing your data…"** → **"Step
  3 of 4 — removing the login…"** → **"Step 4 of 4 — clearing this device…"** → **the #deleted page:
  "Your account is gone."** with "Back to Praxis".
- (6) Proof of absence: Firebase console → Authentication → **the throwaway user is gone**; Firestore →
  `userBooks/<uid>` … `userArtifacts/<uid>`, `publicProfiles/<uid>`, `aiUsage/<uid>` → **no documents**;
  `publishedArcs` filtered by that authorUid → **none**; `follows` → **both edges gone**. DevTools →
  Application → Local Storage → **no key contains the uid**, `praxis_user` absent; IndexedDB
  `praxisNotebook/photos` → **that photo's record gone**. Sign in as the MAIN account → **everything
  intact**, and the main account's Followers no longer lists the ghost.
- (7) Partial-failure leg (forced): with a SECOND throwaway, run (1)–(4), then before tapping Delete,
  Firebase console → Authentication → **disable** that user; tap Delete → re-auth completes (the popup
  may refuse a disabled user — if it does, that IS the reauth leg again, note it and re-enable, sign in
  fresh, then instead revoke the session via console → Users → "…" → Revoke tokens AFTER the re-auth
  popup closes but before Step 3) → expected: **"Your data was removed from Praxis, but the login could
  not be removed (…). Nothing on this device was cleared, so your account is recoverable…"** → reload:
  **still signed in, the shelf still shows the local data, and sync writes it back** (Firestore shows
  the docs again) → run Delete again → **completes to #deleted**.
- (8) Second signed-in device: sign the throwaway in on the phone too, delete from the laptop; on the
  phone, reload → **the phone sees no user data and cannot write it back (the auth user is gone: the
  next token refresh fails and the phone falls to signed-out)**. Note what the phone shows.
