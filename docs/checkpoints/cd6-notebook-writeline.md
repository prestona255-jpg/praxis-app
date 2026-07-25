# CD-6 UNIFICATION · STAGE 1 (Notebook writeline) — BUILD + VERIFY

Built per Preston's rulings (FORK B · register additive · PHOTO migrates into the door ·
draft-orphan accepted · ⌘Enter+noNav+leaf-refresh · dead CSS stays). HEAD `77d0112` →
CACHE_VERSION `praxis-v3.253` → **v3.254**. Committed-local pending Preston's felt pass.

## What shipped

- **Writeline RETIRED** — `buildNotebookWriteline` + `appendWritelineChip` +
  `buildNotebookModeChip` + `setNotebookComposing` + the UX-3 debounce vars
  (`nbLastCommitAt`/`nbCommitBusy`/`nbCommitGen`/`NB_COMMIT_DEBOUNCE_MS`) removed
  (not commented). `nbJustSavedId` + all photo IDB helpers + `buildNotebookInboxEmpty` kept.
- **"Catch a thought" affordance** — `buildNotebookCatchAffordance(activeKey)` mounts in
  `buildNotebookLeftLeaf` (replaces the writeline). Opens the shared door:
  `openCaptureDoor({mode:'note', targetKey:<book tab>, register:<journal on Journal tab>})`.
- **Door register additive** — `capOpen` honors `opts.register` (default marginalia; a saved
  `capture` draft still wins). One path (`capSetRegister`) — no guard fork.
- **Door photo mode = LIVE** (migrated writeline image path) — photo mode keeps
  field+register+context and adds attach pills + preview strip. `capCommit` files the note
  WITH staged images via the existing `nbDownscaleImageToBlob → nbPhotoIdbPut → captureNote(images)`
  path (NO new write surface). `capStagedImages` + `capCommitBusy`/`capCommitGen` ported.
  Scan stays inert (SCAN's socket).
- **Ruling #5** — a door commit on `#notebook` refreshes the left leaf (`renderNotebook()` in
  `capFinishCommit`); `captureNote(noNav=true)` never repoints `notebookActiveTab` (HOLD-2).
- **Guards singular** — the door's owner checks / auth-reset / draft gate / `capMicSeq` /
  FileReader guard are the ONE implementation; the affordance only calls `openCaptureDoor`.
  Auth-reset + `capSetMode`(leave photo) + `capClose` + `capCommit` all clear `capStagedImages`.

## Mechanical gates (self-verify)

| Gate | Result |
|---|---|
| parse `js/views.js` (cscript) | **PARSE OK, exit 0** |
| parse `sw.js` (cscript) | **PARSE OK, exit 0** |
| views.js byte delta | 1,101,075 → **1,092,305 (−8,770 B)** (recon floor −6k/−9k) |
| components.css byte delta | 856,182 → **858,358 (+2,176 B)** (.nb-catch + photo panel) |
| sw.js byte delta | **+0** (version string equal length — as predicted) |
| EOL | **0 CR** on all 3 files — no flip |
| dirty tracked files | only the 3 intended |
| `buildNotebookWriteline` live refs | **0** (2 comments reworded; mount replaced) |
| guard singularity | ONE `nbDraft*` impl; `capOwnerUid`/`capMicSeq`/FileReader door-only; affordance calls `openCaptureDoor` only |
| entry-write-surface grep | `function captureNote`=1 (sole writer); door calls it in 2 branches; **0** new writers/`addDoc`/new `.set(` |

## Live walk (rig: serve.ps1 :8760, uid `d0tester`, `__praxis_seed__` workspace)

*(Note: the rig's Firebase `onAuthStateChanged:signed-out` async-clobbers the route to `#home`
after a full render — a known rig artifact, NOT a build defect. Each probe re-asserts the stub
+ pins `#notebook` before measuring; the clobber only affected the first, un-pinned probe.)*

| Check | Evidence |
|---|---|
| affordance renders, writeline gone | `.nb-catch`=1 · `.nb-composer/.nb-ce/.nb-modes`=0 · line "Catch a thought…" |
| edit live (door) | `#capPhoto`/`#capShots` present · `.for-photo` seat=0 · `.for-scan` seat=1 |
| A — affordance opens door (Inbox) | open · mode note · register marginalia · chip "Inbox" · field focused |
| B — text commit | entry {marginalia, filed:false→Inbox} · toast "Filed to Inbox · Undo" · field cleared, sheet stays open |
| ruling #5 leaf refresh | Inbox 1→2 at commit time · new note visible in `.leaf-left` |
| HOLD-2 notebookActiveTab | active tab stays Inbox across commit (never retabbed) |
| C — Journal tab default | affordance on Journal → door register = **journal** |
| D — targetKey pre-assoc | `openCaptureDoor({targetKey:<bookId>})` → chip shows that book title; register marginalia |
| F — mode walk | note(field/seg/ctx, rest hidden) · voice(+mic-hero) · paste(+uploadrow) · **photo(field/seg/ctx + photo panel)** · scan(seg/ctx/field-wrap hidden, scan seat only) |
| E — photo attach+commit | staged fig=1 · committed · note.images=[{idbKey, w48, h32, caption "rig caption"}] · staged cleared after · **blob in IndexedDB: 770 B image/jpeg** |
| 390 geometry | page no h-scroll · affordance 301×68 fits · door = bottom sheet in-vp · photo pills fit · 0 overflowers |
| 1360 geometry | page no h-scroll · affordance 601px (leaf-scoped) · door = corner card left:24 · photo card 452px in-vp · 0 overflowers |
| console | **clean** (0 errors across the whole walk) |

## Escape-valve note (ruling #3)

Photo migration stayed within "existing plumbing only": reused `nbDownscaleImageToBlob` /
`nbPhotoIdbPut` / `genNotebookImageId` / the `.notebook-shot*` + `.capdoor-pill` +
`.notebook-capture-input` classes; **no new write path** (captureNote already stores
`note.images`); CSS added = 1 panel-visibility rule + 1 actions flex + 1 shots flex. No HALT
triggered — the migration did not exceed into new UI systems or new write paths.

## Stage-2 adversarial gate (fix-red-team, Sonnet) — 1 BLOCK found + FIXED, re-verified

**BLOCK (real, fixed): ungated `capCommitBusy` release → same-account double-write race.**
The port added a 4th async release path into the auth-reset (the exact function the last three
gate-fixes `9c385ea`/`9d5979c`/`6847567` hardened). `finalize`'s release and the auth-reset's
release were both unconditional; only the backstop was gen-gated. Scenario: A's image put in
flight → auth switches to B → auth-reset force-releases the gate → B commits while A's put is
outstanding → A's stale finalize also releases B's gate → B double-write possible. (No
cross-account leak — the `commitOwner` check blocks A's note under B; the defect was a
same-account duplicate window for the incoming account.)
**Fix (2 edits):** (1) gen-gate `finalize`'s release — `if (capCommitGen === myGen) { capCommitBusy = false; }`
(views.js:23268); (2) remove `capCommitBusy = false` from the `onAuthStateChanged` reset
(views.js:23441) — an in-flight commit's own gen-gated finalize/backstop releases the gate;
force-releasing mid-put is exactly what opened the window. Now the ONLY two release sites are
both gen-gated (finalize :23268 + backstop :23286); the auth-reset does not release.
**Red-team RE-CONFIRMED: BLOCK-CLEARED** (independent re-read of current source) — both legs
closed structurally: leg A (auth-reset holds no `capCommitBusy` assignment), leg B (`myGen` is a
fresh per-call local; the top-of-`capCommit` `if (capCommitBusy) return` means a newer `myGen` can
only arm after the older gate is already false, so a stale finalize racing a newer commit is
structurally excluded). No new data-loss/double-write. Findings 2/3/4 unchanged, non-blocking.
**Re-verified live:** 4 rapid same-tick commit clicks during the async put → **exactly 1 note**
(busy gate blocked the 3 extras); image attached; a post-finalize commit works (gen-gated release
fires normally, `capCommitGen===myGen`). Parse exit 0; views.js delta now **−8,168 B**.
- **NIT (fixed):** `capAddStagedPhoto` stale-owner branch did `URL.revokeObjectURL(URL.createObjectURL(blob))`
  (a no-op) — simplified to a bare `return` (no URL created yet).
- **HOLD (process, noted):** the FIX-PROTOCOL §1 #8 recon-reviewer gate was deferred at recon
  (the fork was unruled) and not re-run at Stage-1 top; the red-team served as the (late)
  recon-reviewer and caught the BLOCK. Recorded so the sequencing isn't repeated silently.
- **NOTE (accepted):** Findings 3 (silent photo-drop on signed-out→signed-in mid-decode,
  fail-closed) and 4 (Journal-tab chip reads "Inbox" while filing journal — pre-existing door
  display behavior) → residuals R4/R5 below, no code change.

## Residuals (honest)

- **R1 — photo-note Undo orphans the IDB blob.** `capUndo` deletes the entry doc; the
  device-local IndexedDB blob is not GC'd (pre-existing door-Undo pattern; device-local,
  ephemeral). Not built (would be "new"); flagged for Preston.
- **R2 — image-only caught-list row** shows the target chip with empty text (body ''). Cosmetic.
- **R3 — dead writeline CSS** left in place per ruling #6 (`.nb-composer`/`.nb-modes`/`.nb-ce`/
  `.nb-shots`); `.seg`/`.seg-opt` shared, untouched.
- **R4 — silent photo-drop on signed-out→signed-in mid-decode.** `capAddStagedPhoto`'s owner
  guard fail-closes (drops the photo, no toast) if the account resolves between file-select and
  the async decode. Safe direction (gate-5's "drop rather than leak" precedent); rare; not built.
- **R5 — Journal-tab chip reads "Inbox".** `capBuildTargets` has no Journal entry, so a
  Journal-tab open resolves the chip to Inbox while `register:'journal'` still routes the note to
  the Journal tab (counted correctly). Pre-existing door display behavior, not introduced here.
- **R6 — auth-switch mid-photo-put briefly blocks the incoming owner's next commit (≤15s, no
  toast).** Because `if (capCommitBusy) return` gates the top of `capCommit`, if account A's image
  put is still in flight when B signs in, B's very next commit (even a text-only one) is a no-op
  until A's gen-gated finalize/backstop releases the gate (normally sub-second; ≤15s worst case).
  This is the intentional trade (block rather than race) the fix chose; local IDB puts are fast, no
  feedback on the rare blocked click. Named per FIX-PROTOCOL (document every known edge).

HALT for Preston's felt pass. Ship = v3.254 on his word.
