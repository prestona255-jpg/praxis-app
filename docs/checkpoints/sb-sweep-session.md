# S-B DEBT SWEEP — session record

Model: Opus 4.8, default effort. Gate agents: Sonnet. Discipline: FIX-PROTOCOL v1.2,
CLAUDE.md sweep discipline (ruled July 22), THE DELETION RULE (this brief).
Zero runtime behavior / zero rendered pixels; deletion of provably-unreachable code
is the only app-byte change permitted.

---

## STAGE 0 — PRE-FLIGHT (recon) — STARTED

### 0.1 Repo state
- `git fetch` clean. **HEAD = origin/main = `950a5ee`** (exact, not a descendant).
- Tracked tree **clean** — `git status --short` shows **untracked-only** (design/ zips,
  docs/checkpoints/*.md drafts, mockups, stray root HTML). Nothing tracked is dirty.
  Untracked files reported, never staged.
- sw.js current version string: **`praxis-v3.269`** (expected ✓).

### 0.2 Anchor verdicts

| Anchor | Verdict | Evidence |
|---|---|---|
| sequence.md `[~] RE-PLAN PENDING` line | **PASS** | line 882: `[~] **RE-PLAN PENDING — Preston's ruling: the next lead deep round** — SCAN (the prior lead) closed 2026-08-08 …` |
| BOARD sweep rows | **PASS** | row 11 `#account → redirect #profile (R9a v3.198; renderAccountPage retired defined-but-unrouted — S-B deletion debt)`; row 14 `#profile renderProfilePage (MERGED, R9a → R9b v3.202)` |
| launch-runway carried-debt ledger | **PASS** | ~17 rows in THE CARRIED-DEBT LEDGER + 4 OPEN-VERIFY + 3 residual dispositions; `renderAccountPage — unrouted legacy → S-B (dead-code deletion)` row present |
| hooks/pre-commit rails/auto-guard state | **PRESENT — MAJOR FINDING** | §5 AUTO-GUARD RAILS **already landed** (5a dynamic CSS-var seam, 5b hex-outside-theme) + 4 pre-existing gates (foundations byte-lock, test-arc block, source-rides-sw.js, ES3 WARN). See §0.5. |
| Live Forensic Smoke — local-serve capability | **LIVE-ONLY BY DESIGN** | Located in CLAUDE.md "Live Forensic Smoke Test" section; invocation is **manual / UI-driven** in a signed-in browser. `tools/` has NO smoke runner (only ground-truth, parse-check, studio-build). auto-guard.md §B3 confirms: no headless runner, "live-only by design". **Gates the deletion-proof method** — see §0.6. |
| sw.js version = v3.269 | **PASS** | `sw.js:10 var CACHE_VERSION = 'praxis-v3.269';` |

### 0.3 R9a dead-code evidence — documented vs measured

**Documented (source: `docs/checkpoints/r9a-build.md`, "NAMED DEBT (Preston's hard gate #2)
— unrouted legacy renderers → S-B candidate"):**
> `renderOwnProfile` (~681 L) + `renderAccountPage` (~1380 L) + their private helpers
> (`_opPublishControl`, `_accountToggleEditForm`, the inline retrofit/values/threads
> blocks) remain **defined-but-unrouted** (dead: no route arm, no nav href, no reachable
> handler). **~2060 L.** Deletion is its own future task (S-B residuals candidate).

**Measured now (current main `950a5ee`, `js/views.js` = 25,279 L):**

| Region | Span | Lines | Status |
|---|---|---|---|
| `renderAccountPage()` | 22244–23616 (next fn `renderAbout` @23617) | **1,373** | dead def; only route `#account` @737 → `location.replace('#profile')` |
| `renderOwnProfile()` | 20803–21129 (next `_socialSignIn` @21130) | **~327** | dead; callers 20962 (self), 21287/21302 (in `_opPublishControl`) |
| `_opPublishControl()` | 21271–21315 (next `_arcFinishedCounts` @21316) | **~45** | dead; sole caller 21085 (in `renderOwnProfile`) |
| `_account*` helper block | 17646–18059 (14 fns; below = live `buildReaderModelSection` @18060) | **~414** | candidate-dead helper cluster; **needs Stage-4a reachability census** |
| export line | 25263 `renderAccountPage: renderAccountPage,` | 1 | remove with the def |
| dead `else`-fallback refs (inside LIVE `buildReaderModelSection`) | 18075, 18569 `else if (typeof renderAccountPage === 'function'){renderAccountPage();}` | 2 | handle: `typeof` on a deleted decl safely → 'undefined'; decide keep-guard vs strip-branch |

**Measured candidate total ≈ 2,150 L** (1,373 + 327 + 45 + 414 - overlaps) vs **documented
~2,060 L** — same order of magnitude. The measured number is the target; the precise figure
is Stage-4a's census output after resolving which `_account*` helpers (and
`openAccountDeleteConfirm` @17583) are shared with LIVE code.

**CRITICAL SHAPE — the dead cluster is INTERLEAVED with live code, not one block:**
- LIVE and interleaved through the region: `buildTransparencyContent`/`renderWhatYumiSeesPage`
  & the transparency renderers (17256–17563), `buildReaderModelSection` (18060 — mounted by
  live `renderProfilePage` with `rerenderFn=renderProfilePage`), the entire `_pf*`/`_portrait*`
  profile-support block (18591–20771), `renderProfilePage` (20772), the `_social*` cluster
  (21130–21270), the FINISH-CHOREO ceremony/threshold/commons functions (21316–22243:
  `_pubOverlay`, `openThresholdCeremony`, `openPublishCeremony`, `openUnpublishConfirm`,
  `renderCommons`, `renderOtherProfile`, `renderInteract`).
- ⇒ the deletion is **~4 non-contiguous regions**, each needing its own unambiguous census,
  and one LIVE function (`buildReaderModelSection`) carries two references to the deleted
  `renderAccountPage`. This is precisely THE DELETION RULE's domain — census-first, per region.
- **Census-ambiguity watch (Stage 4a):** `_account*` helpers that MIGHT be shared with live
  `_pf*`/profile code (e.g. `_accountCounts`, `openAccountDeleteConfirm`) — a shared helper is
  NOT deletable. Any such = skip + "census-ambiguous — needs human ruling."

### 0.4 Ledger-sweep inventory (Stage 3 source list)
- `docs/launch-runway.md` — CARRIED-DEBT LEDGER (~17 rows) + OPEN-VERIFY (OV-1..4) + RESIDUAL
  DISPOSITIONS (R-a/R-b/R-c). **Note:** FIX-PROTOCOL/launch-runway cite `docs/LAUNCH-STATUS.md`
  but the file lives at **`docs/studio/LAUNCH-STATUS.md`** (path drift, minor).
- `docs/studio/sequence.md` — the living plan + Re-plan log (`## Now`/`## Next`).
- `BOARD.md` (repo root) — coverage board, per-surface rows + wave history (L1/L2 dead-sweep rows).
- `docs/studio/LAUNCH-STATUS.md` — launch checklist ledger.
- `docs/studio/overnight.md` — overnight queue (FAB-overlap candidate ledgered here).
- Per-surface studio ledgers (Gap ledger sections): `account.md`, `profile.md`, `capture.md`,
  `scan.md`, `book-detail.md`, `subtheory-page.md`, `yumi-panel.md`, `import-capture.md`,
  `arc-standard.md`, `r-arc.md`, `search.md`, `cross-cutting.md`, `risks.md`, and siblings.
- `docs/checkpoints/*.md` — recon TODOs / named debt (`r9a-build.md`, `finish-choreo-recon.md`,
  `r-polish-b4-recon.md`).

### 0.5 THE AUTO-GUARD IS ALREADY LANDED AND PUSHED — Stage-0 FORK (FORK-VERBATIM)

The guard Stage 2 commissions **already exists on origin/main** and is live machinery
(`core.hooksPath=hooks`):
- Build commit **`ce277e7`** "build(auto-guard) — pre-commit rails linter …" — confirmed
  `git merge-base --is-ancestor ce277e7 origin/main` = **YES** (pushed + live; the
  auto-guard.md "committed LOCAL, never pushed" line is STALE — it shipped in the SCAN range).
- `origin/main:hooks/pre-commit` §5 = **5a** (dynamic CSS-var-name construction: `setProperty(…+`,
  `'--foo-' +` concat seam) + **5b** (hex outside `assets/theme.css`). Scope: added lines of
  `js/*.js` + `assets/*.css` only. Fixture-proven fail-able + false-positive-free.
- `docs/studio/auto-guard.md` documents the guard AND its deliberate omissions with rationale.

**Delta — brief-commissioned checks vs the landed guard:**

| Brief asks for | Landed guard | Disposition |
|---|---|---|
| setProperty / `--register-*`/`--subtheory-*` concat seams | ✅ 5a (generic `'--word-' +`) | already covered |
| hex outside theme CSS | ✅ 5b | already covered |
| ES3 (const/let/arrow/backtick/class) as BLOCK | ⚠ WARN only (§4); **deliberately NOT a block** (raw-diff regex false-positives on comments/strings) | re-adding as BLOCK contradicts a ruled decision |
| `--lum-*` in new CSS (usage block) | ⚠ **deliberately omitted** (1,013× legit uses → pervasive false-fire) | re-adding contradicts a ruled decision |
| transform-rig tokens | ⚠ **deliberately omitted** (no false-positive-free literal set defined) | needs a literal set to be writable |
| new external deps | ✖ **not present** — genuinely absent | addable (new check) |
| smoke wiring on sw.js-staged commits | ✖ **B3 SKIPPED** — smoke is live-only, no headless runner | can't wire without a headless smoke |

⇒ Stage 2 is **not** a green-field build. **THE FORK for Preston:**
- **(A) Verify-only** — the guard already landed+pushed; run the L3 deliberate-violation
  self-test against the EXISTING §5 rails, table the matrix, and unlock deletions. No new hook
  code. (Honors "auto-guard lands before deletion" — it already has.)
- **(B) Expand** — add the one genuinely-absent check (new external deps) as a fixture-proven
  rail, then self-test. Leaves the deliberately-omitted checks omitted (their auto-guard.md
  rationale stands).
- **(C) Reopen omissions** — re-add ES3-as-block / `--lum-*` usage / transform-rig. Each
  contradicts a documented ruling in auto-guard.md ⇒ `PROPOSED:`-class, Preston's explicit call;
  the false-positive risk auto-guard.md names is real.

### 0.6 Deletion-proof method — the smoke is live-only (report plainly)
The brief's Stages 4+ call for "smoke re-run PASSES identical to the baseline" against a local
serve. **There is no automated/headless Live Forensic Smoke** (confirmed §0.2). So the
deletion no-behavior-change proof must rest on:
1. **Reachability census** — route census (no `#` arm) + call-site grep census (the
   `#account`-tree pattern), printed per region.
2. **Parse-gate** — `cscript //nologo //E:jscript tools/parse-check js/views.js` (+ CSS N/A).
3. **Byte delta** pre-stated from measured region size, then measured; EOL truth via `tr -cd '\r'`.
4. **Zero-remaining-references** re-grep after each deletion.
5. **Local-serve boot check** (wireable): serve the repo root, load the app, navigate the
   affected surfaces (`#profile`, `#account`→redirect, `#sees`, `#commons`), confirm clean
   console + correct render — this is a BOOT/NAV smoke, NOT the full forensic UI smoke.
The full forensic smoke (signed-in, real data, click-through) stays **Preston's live card** at
the push gate. Reported plainly, not laundered.

### 0.7 Deletion-class shortlist (Stages 4+ will work, top-down)
1. **R9a unrouted profile/account cluster** (marquee, ~2,150 measured L, ~4 interleaved regions).
2. **`.st-gutter` dead CSS** — `assets/components.css:10283,10321-10334` (`.st-page .st-gutter*`);
   **0** JS class-emits, **0** in index.html → dead. (R-a residual.) App-byte CSS change ⇒ sw.js bump.
3. **Import-Capture overlay / Yumi-lens panel / Account residuals** (sequence S-B item) — need
   census to confirm any dead code exists; may reduce to zero.
- **NOT this sweep:** `.k-listbox*` dead CSS (K-LISTBOX) — ledger owner is "L2 control-canon /
  a control round", not S-B. Left ledgered unless Preston reassigns.

**HALTING for go-ahead (brief Stage 0 → HALT). No files changed.**

---

## STAGE 1 — RE-PLAN STAMP — COMPLETE ✓  (commit `f4e7ef9`, LOCAL)

Ruling stamped: **S-B SWEEP = lead** (Preston, 2026-08-08). R10 follows · FINISH-CHOREO S3
rides-where-cheapest · Yumi parked unscoped.

- `docs/studio/sequence.md` — new Re-plan log top entry (RE-PLAN RULED); `## Now` intro rewritten;
  `[~] RE-PLAN PENDING` item flipped → `[~] S-B` lead (in progress); `## Next` S-B marked PROMOTED.
- `BOARD.md` — row 11 (`#account` redirect) stamped: renderAccountPage deletion = sweep marquee, in progress.

Gate: `git diff --cached --name-only` = **BOARD.md + docs/studio/sequence.md only** ✓. Diffstat
+31/−15, 2 files ✓. EOL truth (staged blobs): sequence.md **0 CR**, BOARD.md **0 CR** ✓. Em-dash in
subject ✓. Docs-only ⇒ no sw.js (hook exempts docs/ + .md) ✓ (hook passed normally, no --no-verify).
No Builder regen (deferred to close per BUILDER CADENCE).

---

## STAGE 2 — AUTO-GUARD verify + extend (path B) — COMPLETE ✓  (commit `10b297e`, LOCAL)

**Ruling B**: guard already landed+pushed → verify existing 5a/5b + add the one absent check
(new-external-deps `5c`) + keep omissions omitted + correct the stale status line.

### New rail 5c (hooks/pre-commit §5)
- **JS arm** (`js/*.js` added lines): line-initial `import` · `import(…)` · `require('…')` ·
  `importScripts(…)`. Anchored against `!important`/`handleImport`/`prerequire`/prose. **0 in tree.**
- **CSS arm** (`assets/*.css` added lines, EXCLUDING byte-locked `lumen-amber.css`): `@import` /
  external `url(http…)`. The one sanctioned Google-Fonts `@import` lives in the byte-locked
  foundations sheet (excluded like theme.css is from 5b). **0 in tree** (after the exclusion).
- Omissions kept omitted: ES3-as-block (stays WARN §4), `--lum-*`/`--register-*`/`--subtheory-*`
  usage, transform-rig tokens. Documented rulings in auto-guard.md stand.

### L3 DELIBERATE-VIOLATION MATRIX (vs the live edited hook) — 10/10 GREEN

| Rail | Case | Expect | Exit | Result |
|---|---|---|---|---|
| 5a | setProperty + concat (`"--register-" + r`) | FIRE | 1 | message present ✓ |
| 5a | var-name concat (`"--subtheory-" + id`) | FIRE | 1 | message present ✓ |
| 5b | hex outside theme.css (`color:#abc123`) | FIRE | 1 | message present ✓ |
| 5c-js | line-initial `import foo from "bar"` | FIRE | 1 | message present ✓ |
| 5c-js | `require("some-pkg")` | FIRE | 1 | message present ✓ |
| 5c-js | dynamic `import("http://cdn…")` | FIRE | 1 | message present ✓ |
| 5c-css | `@import url("https://…")` | FIRE | 1 | message present ✓ |
| 5c-css | external `url("https://…png")` | FIRE | 1 | message present ✓ |
| — | CLEAN source (static setProperty + var() + data: URI) + sw.js | PASS | 0 | no BLOCK ✓ |
| — | `tools/*.sh` with backticks (scope) | PASS | 0 | no BLOCK ✓ |

Harness: `git add` synthetic violation → `sh hooks/pre-commit` → grep rail-specific BLOCK →
`git reset`; `sw.js` snapshotted + byte-restored; tree left clean, nothing staged. Every rail is
proven ABLE TO FAIL (L3), and no rail false-fires on clean input.

### Gates
- Files: `hooks/pre-commit` + `docs/studio/auto-guard.md` only ✓. Diffstat hook +21, doc +44/−5 ✓.
- EOL truth (staged blobs): both **0 CR** (LF); HEAD hook blob also 0 CR → no flip ✓.
- Neither file gated by rule #3 (no extension / docs/) → **no sw.js bump**; hook passed normally on
  its own commit (exit 0), no --no-verify ✓.
- auto-guard.md stale line corrected → SHIPPED+LIVE (`ce277e7` ancestor of origin/main); byte size
  4,899 → 7,358 B recorded ✓.

**DELETION STAGES UNLOCKED** (L3 gate green).

---

## STAGE 3 — RECONCILED DEBT TABLE — COMPLETE ✓  (commit `9041951`, LOCAL)

- `docs/checkpoints/sb-sweep-debt-table.md` (new, +101): Tier 1 DELETION-CLASS (1a–1d · 2 · 3 · 4)
  → Tier 2 GUARD-COVERED → Tier 3 LEDGERED-WITH-OWNER. Deduped across every Stage-0.4 ledger.
- `docs/launch-runway.md` (reconciled, +9/−1): CARRIED-DEBT LEDGER cites the table (no dup rows);
  renderAccountPage row stamped IN PROGRESS, line count 1,370→1,373.

**Gate stats:** ~34 rows total (Tier 1: 7 · Tier 2: 3 · Tier 3: ~24). Dedupe: renderAccountPage
folded 5 ledgers→1 row (r9a-build/launch-runway/BOARD/account.md/profile.md); .st-gutter 2→1
(R-a/finish-choreo-recon); tokenize-literals 3→1; **6 shipped/closed items deduped OUT** (B-M-SA,
MANIFEST-WARM, MASK-SHELL, DW-RING-RADIUS, ON-2, ON-8). **Deletion-class shortlist: 1a, 1b, 1c,
1d, 2, 3, 4.** EOL 0 CR both; docs-only, sw.js untouched.

---

## STAGE 4 — DELETION LANES — STARTED

Deletion-proof method (Preston ruling 2, smoke is live-only by design): per-item = unambiguous
census + parse-gate + pre-stated byte delta + EOL truth + zero-remaining-refs re-grep + local
boot/nav smoke vs a once-captured baseline. Full signed-in forensic UI smoke = Preston's live card.
**sw.js note (mechanical):** each source-touching deletion commit MUST ride an sw.js bump (hook
rule #3; no --no-verify this session), so the version climbs one per region; clients still see ONE
invalidation on the single pushed deploy (the final version). Stage N+2's "final bump" = the last
source commit's version; no separate bump-only commit.

### BASELINE — local boot/nav smoke (HEAD `9041951`; app bytes == `950a5ee`, Stages 1–3 zero app bytes)

Rig: `.claude/rig/serve.ps1` on :8790 (static, no-store), Browser pane, uid stub `d0tester`.
Screenshots dead in this pane (rig README) → DOM/console evidence only.
- **parse-gate** `js/views.js`: **PARSE OK, exit 0**.
- **11 routes walked**, all render (ok=true, no throw): #home 44624 · #profile 52325 · **#account →
  redirect #profile 52325** · #commons 22122 · #sees 24176 · #notebook 24176 · #books 46663 ·
  #arcs 30121 · #search 23660 · #reader/d0tester → #profile 21729 · #walk/none 21823 (lengths = the
  rendered container innerHTML; recorded as the comparison fingerprint).
- **console: 0 JS exceptions.** 3 network 404s only, all expected static-serve artifacts:
  `POST /.netlify/functions/google-books-proxy` ×2 + `POST /.netlify/functions/claude-proxy` ×1
  (Netlify functions absent on the local static serve — NOT code, NOT deletion-related).
- **PASS criterion for every post-deletion re-run:** all routes ok=true / no new throw · #account→#profile
  redirect intact · 0 JS exceptions · the same 3 proxy 404s (no NEW 404 for a deleted-but-still-referenced symbol).

### 1a — renderAccountPage — RESOLVED (deleted) · commit `e5671d1` · sw.js v3.270
Census: `#account`@~740 redirects to `#profile` (route dead). buildReaderModelSection has exactly 2
callers — renderProfilePage@20797 passes rerenderFn=renderProfilePage (fn → else dead); the only
rerenderFn-less call is inside renderAccountPage itself → the two else-branch refs (18075/18569) were
permanently dead. **Unambiguously dead.** Deleted def (1364 L / 66,448 B) + export + stripped 2 dead
else-branches (behavior-preserving) + rewrote 4 stale comments. Proof: `grep renderAccountPage`=**0** ·
PARSE OK · byte delta **−66,611** (band ~−66,550±150) · line −1368 · boot/nav smoke 11/11 render,
#account→#profile intact, 0 JS exceptions, same proxy-404 class · EOL 0 CR. openAccountDeleteConfirm /
buildReaderModelSection / renderProfilePage all LEFT live.

### 1b/1c — renderOwnProfile + _opPublishControl — RESOLVED (deleted) · commit `ca36c8c` · sw.js v3.271
Census: closed dead 2-cycle, no live external caller (renderOwnProfile not exported; callers = self +
2 callbacks in _opPublishControl; _opPublishControl's 1 caller is in renderOwnProfile). Merged to ONE
commit (splitting dangles a ref either way). Deleted renderOwnProfile (317 L) + _opPublishControl + its
5-line header; trimmed the stale "+ own-profile publish control" from the live W6.5 header. Proof:
grep both=**0** · PARSE OK · byte −14,179 · line −360 · smoke 11/11 render, redirect intact, 0 JS
exceptions · EOL 0 CR. LEFT live: renderProfilePage, renderCommons, _socialSignIn, openPublishCeremony,
openUnpublishConfirm, _arcFinishedCounts.

### 1d — 14 `_account*` helpers — RESOLVED (deleted) · commit `e290187` · sw.js v3.272
Census: all 14 cross-reference only each other; every entry point called solely from the deleted
renderAccountPage → zero live callers. Deleted the block (405 L / 17,048 B) + the orphaned account-hub
comment; repointed buildReaderModelSection header "Account page"→"merged Profile". Proof: grep
`_account*`=**0** · PARSE OK · byte −17,022 · line −405 · smoke 11/11 render, redirect intact, 0 JS
exceptions · buildReaderModelSection/renderProfilePage live · EOL 0 CR.

**SKIPPED + LEDGERED (census-clean dead, but out of this sweep's scope — Preston's ruling owed):**
- **openAccountDeleteConfirm** (`views.js:~17583`) — orphaned (only caller was renderAccountPage; mounts
  into `#account-delete-host`, an element built only in the deleted hub). Its deadness = a **LIVE-PROFILE
  PRODUCT GAP**: the merged `#profile` has NO delete-account path. Delete vs. re-wire is an intent call.
- **renderShelfBookRow** (`views.js:~5581`) — cascaded to orphaned (sole caller was
  `_accountBuildCategoryPanel`). **R-SHELF F7 deliberately KEPT it** (signature-stable for a future list
  view). Overriding a prior-round keep is a scope-addition fork. Its F7 comment updated to note the orphan.

### R9a MARQUEE (1a–1d) TOTAL: ~2,133 L / ~97,813 B removed across 4 commits (`e5671d1` `ca36c8c` `e290187`
+ the 1a). Documented ~2,060 L; measured higher because R9a's figure lumped in the `_social*` helpers,
which are LIVE and were KEPT.

### 2 — `.st-gutter` dead mock CSS — RESOLVED (deleted) · commit `f4ddc2c` · sw.js v3.273
Census: 0 `st-gutter` emits in all js (no concat: only read-gutter-svg + prose), 0 in index.html; live
rail is id `#subtheory-rail`. Deleted 4 dead rules + "mock" comment; fixed 1 stale comment ref. Proof:
grep=**0** · brace balance 4637=4637 (L12 hazard) · CSSOM 0 st-gutter live · byte −785 · 7-surface render
smoke ok, 0 JS exceptions, no bleed · EOL 0 CR. **Ledgered discovery (NOT expanded):** `.st-main` +
`.subtheory-rail-toggle/close/backdrop` also 0-emit → the `.st-page` mock block may be substantially dead
(R6/DW-STP2 supersession) — own census + ruling owed.

### 3 — Yumi-panel dead code (voice-button + stray link rule) — CENSUS
Source: yumi-panel.md:20 (from praxis-2.0-phase2-ledger.md, 2026-06-27, status "unverified" — pre-dates
much Yumi work; must re-verify vs LIVE code).

### 3 — Yumi-panel dead code — RESOLVED (partial) · commit `700898f` · sw.js v3.274
Re-verified vs LIVE (June-dated ledger): "voice-button" = STALE (live `.yumi-mic-btn`, 0 deletion);
"stray link rule" = `.yumi-panel-sight-link` + co-flagged `.yumi-panel-header` (0 js/html emits, drift-
flagged in components.css). Deleted both dead rules + affordance comment + resolved the drift-flag comment.
Proof: grep both=**0** · brace 4634=4634 · CSSOM 0 dead-yumi live · byte −523 · 7-surface smoke ok, live
`.yumi-panel` present, 0 JS exceptions · EOL 0 CR. LEFT live: yumi-panel-title/close/head/sight/open.

### 4 — Import-Capture overlay dead code — CENSUS
Source: sequence S-B item ("Import-Capture overlay"). Post-CD-6 door unification. Census-first.

### 4 — Import-Capture overlay dead code — ZERO FINDINGS (report zero) · NO COMMIT
Census: the overlay was ALREADY retired at CD-6 Stage 3 (comments `import-capture.js:7,430`:
open/close/commitEntries gone). Current module (451 L) is entirely live — all 6 functional exports
(segmentDoc/matchBook/candidateBooks/registerFor/canRecord/recordAndTranscribe) called from views.js;
every internal helper has a caller (refs≥2, no orphans); `_normTitle` intentionally exposed for the dev
harness; 0 overlay remnants (the 2 token hits are comments). **Zero dead code → report zero, no commit.**

## STAGE 4 — DELETION LANES — COMPLETE

| Item | Region | Verdict | Commit | Bytes (LF) |
|---|---|---|---|---|
| 1a | renderAccountPage + export + 2 dead else-branches | DELETED | `e5671d1` | −66,611 |
| 1b/1c | renderOwnProfile + _opPublishControl (dead 2-cycle) | DELETED | `ca36c8c` | −14,179 |
| 1d | 14 `_account*` helpers | DELETED | `e290187` | −17,022 |
| 2 | `.st-gutter` dead mock CSS | DELETED | `f4ddc2c` | −785 |
| 3 | `.yumi-panel-header` + `.yumi-panel-sight-link` | DELETED | `700898f` | −523 |
| 4 | Import-Capture overlay | ZERO (already retired CD-6) | — | 0 |

**Net app-byte delta: −99,120 B (LF)** across 5 source commits · **sw.js v3.269 → v3.274** (one bump per
source commit — the hook rule #3 mandates sw.js in every source-staging commit; no --no-verify used; the
final version rides the last source commit, clients invalidate once on the single pushed deploy).

**SKIPPED (census-clean dead, ledgered for Preston's ruling — NOT deleted):**
- **openAccountDeleteConfirm** (views.js) — orphaned; deadness = a live-#profile delete-account PRODUCT GAP.
- **renderShelfBookRow** (views.js) — cascade-orphaned; R-SHELF F7 deliberately kept it. Scope-addition fork.
- **`.st-main` + `.subtheory-rail-toggle/close/backdrop`** (components.css) — 0-emit siblings of `.st-gutter`;
  the `.st-page` mock block may be substantially dead (R6/DW-STP2 supersession) — own census + ruling owed.

Every deletion: unambiguous census (route + call-site grep) · parse-gate PARSE OK · pre-stated byte delta
matched · zero-remaining-refs re-grep · local boot/nav smoke = baseline (11 routes render, #account→#profile
intact, 0 JS exceptions, same 3 proxy-404 class) · EOL 0 CR. Full signed-in forensic UI smoke = Preston's
live card at the push gate (NOT run — live-only by design).

---

## STAGE N+1 — GATES (Sonnet ×2) — COMPLETE

**praxis-reviewer (Sonnet): code CLEAR / docs HOLD (resolved in the close).**
Verified independently (git show + scratch grep): every deleted symbol has 0 executing references; per-commit
+ total byte deltas exact (views.js −97,812 · components.css −1,308 · net −99,120); parse PARSE OK; brace
balance 4634=4634; EOL 0 CR no-flip across range; staging discipline (2 files/commit); foundations MD5-locked
(marks.js 10,255 B, lumen-amber.css 14,966 B — untouched); sw.js one +1 bump/source-commit; skipped items +
live-fn set all present; `buildReaderModelSection` has exactly 1 caller (renderProfilePage, passes rerenderFn)
→ else-strip behavior-preserving. HOLD (docs only): (1) 3 components.css SECTION-HEADER COMMENTS still named
renderAccountPage/renderOwnProfile (my grep was views.js-scoped) → **FIXED `e6e93dc`** (full-scope grep now 0);
(2) ledger currency (debt-table TBDs, sequence/BOARD "in progress") → **FIXED `891d736`**.

**fix-red-team (Sonnet): NO BLOCK / NO REVERT.** No dynamic-dispatch / string-concat / bracket-access /
event-wired / eval reference to any deleted symbol anywhere; no CSS class string-built emission; route arms +
exports correctly stripped; behavior-preservation of the else-strip confirmed; both skipped items intact.
**Residual-to-document surfaced:** the marquee JS deletions orphaned ~92 `.account-*` CSS selectors never
census'd — now item 5 below.

## ITEM 5 (NEW, red-team-surfaced) — orphaned `.account-*` CSS — SKIPPED + LEDGERED
The 1a/1d JS deletions orphaned the account-surface stylesheet. My census: **92 of 95 `.account-*` tokens
have 0 emitters** (dead); 3 live — `.account-card` (shared frame), `.account-confirm-panel` (the skipped
delete-confirm), `.account-readermodel` (the live reader-model skin, dozens of `.rm-*` rules). **SKIPPED per
THE DELETION RULE — census AMBIGUOUS:** the live rules are interleaved with the dead ones and comma-grouped
(e.g. `.account.lum-amber-ember .account-card, .account-stat, …` at 14255 mixes live `.account-card` with
dead `.account-stat`; `.account-card.account-danger` mixes live base + dead modifier). A clean removal needs
a dedicated CSS-dead-sweep with per-rule census + comma-group splitting — NOT a rushed tail-end bulk cut.
Ledgered: `sb-sweep-debt-table.md` §Sweep-summary + `launch-runway.md`. The 3 dead header comments were
retired inline (`e6e93dc`) so the block is flagged for that sweep.

## STAGE N+2 — CLOSE
- Final app commit `e6e93dc` (comment fix + sw.js **v3.275**). Docs close `891d736` (ledgers reconciled).
- Builder regen ran (`sh tools/studio-build`, detached) — committed separately (generated output only).
- FINISH-CHOREO S3 cheapness note: the sweep touched `views.js` (deletions in the account/profile region,
  20k–23k) and `components.css` (yumi-panel + st-gutter), NOT the notebook/writing-surface motion regions
  FINISH-CHOREO S3 owns. So the sweep does NOT make S3 cheaper as the next slice — S3 stays a rides-where-
  cheapest motion slice on its own lane; no coupling created. (Report only, no work.)
