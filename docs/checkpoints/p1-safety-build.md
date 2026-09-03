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
