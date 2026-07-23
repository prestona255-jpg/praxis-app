# R-CAPTURE — Stage-0 recon

READ-ONLY census. HEAD `09ba14d9a836a15ad328e2db767c060409a2e079` == `origin/main`
(`git log -1`: `docs(r-capture): brief v2 — CD-1..6 restated + CA-1..3 (question
authoring), supersedes v1`). Tracked working tree clean (`git status --porcelain
-uno` = 0 lines); untracked design/docs clutter present (long-standing, not new).

**Standing facts:**
- `sw.js:10` `CACHE_VERSION = 'praxis-v3.251'`.
- `docs/studio/r-capture-brief.md` = **10,601 B** — exact match to the brief's
  own stated size. No drift.
- Byte-locks: `assets/marks.js` = **10,255 B** (exact match, no deviation).
  `assets/lumen-amber.css` = **14,966 B** — **deviates from the 14,681 B
  foundation expectation** stated in this agent's operating brief. This is a
  **known, long-standing deviation** (first logged at FX-1, 2026-07-15-ish,
  memory `fx1_syncguards_incoming_census.md`), not new drift introduced this
  session. Flagged per standing instruction; not a fresh regression.

---

## 1 · Entry-point census — the ground truth

**"One Door" describes an aspiration, not the app today.** FOUR structurally
distinct capture UIs exist, all converging on the SAME storage chokepoint
(`captureNote()` / hand-written `state.notebookEntries[id]=`), sharing zero DOM
or component code:

| # | Entry point | Trigger / where it lives | Render fn | Storage accessor | Record shape |
|---|---|---|---|---|---|
| 1 | **Notebook writeline** | `<textarea class="nb-ce">` always present on `#notebook` inside the composer | `buildNotebookWriteline(activeKey)` views.js:3030 | `captureNote(register, body, activeKey, images)` views.js:3434 | `{id,userId,register,isPrivate,body,bookIds,arcIds,images,filed,createdAt,updatedAt}` |
| 2 | **Book Detail "Add marginalia"** | `.bk-actionbtn-primary` button, book-detail action row | `openMarginaliaEditor(bookId, editEntryId)` views.js:14800, mounts `createWritingCanvas` (writing-canvas.js:114, contenteditable) | inline write of the SAME 11-field shape (views.js:14851-14863) on create; `updateNotebookEntryBody(entryId, body)` (state.js:2455) on edit | identical shape to #1 |
| 3 | **ImportCapture overlay** (paste / upload / dictate) | `window.ImportCapture.open()` — Notebook's `.nb-modes` paste/import/dictate chips (views.js:3226-3228, handoff cue `↗`) | `open()`/`renderEntry()` import-capture.js:400-476, panel rebuilt fresh on every open (NOT pre-rendered/cached) | `commitEntries()` (bulk) / `processDictation → commitEntries` (single) | same 11-field shape (comment import-capture.js:16 "the locked 11-field entry shape") |
| 4 | **Onboarding "Act two · the margin"** | body-level first-run journey overlay, `.ij-noteta` textarea + Marginalia/Journal toggle | `buildActMargin()` intros.js:263-277, write via `doNote()` intros.js:332-338 | `captureNote(realReg, body, activeKey, [])` intros.js:337 — **same accessor as #1**, but `activeKey = picked.bookId` (the book just shelved in Act 1), never `'inbox'` when a book was shelved | same shape |

**Confirmed NOT capture (nav/chat only):**
- **Yumi Bloom FAB** (`.yumi-bloom`, yumi-ui.js:944-1012, global fixed z-9999,
  mounted once at boot via `initYumiUI` yumi-ui.js:1454-1467) — grepped
  yumi-ui.js exhaustively: **zero calls to `captureNote` or
  `state.notebookEntries`**. Chat-only, routes to yumi-brain.js's proxy. Not a
  text-capture door today — confirms CD-4's "seat only" framing is accurate to
  the CURRENT state (there is no seat yet either, just full chat).
- **⌘K / spotlight.js** — `spotlightSelectRoute(route)` (spotlight.js:383) is
  its only terminal action; zero `createNote`/`captureNote`/`createArc`/
  `createSubTheory` calls anywhere in the file (grepped). **Pure navigation**,
  confirms the brief's own framing.
- **voice-input.js** — Web Speech API (`SpeechRecognition`) wrapper, `window.
  VoiceInput.{listen,attachMicButton}`. **Used by Yumi chat's talk-mode only**
  (push-to-talk / hands-free), confirmed by its own header comment ("Adapted
  from HQ-DEPLOY... the Yumi panel orchestrates the mic directly"). **Not the
  note-dictation transport** — see §5, this corrects the brief's item-5
  framing.

**"+" create bottom-left is NOT a universal element** — see §2.

**⌘N does not exist.** Grepped every `metaKey`/`ctrlKey` keydown handler
app-wide: exactly two exist — spotlight.js:420-430 (⌘K) and yumi-ui.js:1445-1452
(⌘J, toggles Yumi panel). No `'n'` key handler anywhere. CD-1's "+ a nav entry
and ⌘N" is aspirational.

---

## 2 · Corner-state verify

**AMB-1 (R-POLISH B1, components.css:9-18, intros.js:606-616) is real and
shipped for the Bloom half only.** The comment states: *"the flower is ONE of
the two ruled fixed elements (bottom-right; the '+' create door owns
bottom-left)."*

- **Bottom-right (Bloom):** genuinely global. `.yumi-bloom` position:fixed,
  z-9999, safe-area-inset-bottom-aware (components.css:19-40), mounted once on
  `DOMContentLoaded` (yumi-ui.js:1463-1467), survives every route (appended to
  `document.body`, never torn down). Visible/clickable even on `#arc/*` (only
  the auto-open-panel behavior is suppressed there, `suppressYumiOnArc`
  yumi-ui.js:53-57 — deliberate taps still work). **CD-1's bottom-right half is
  shipped exactly as ruled.**
- **Bottom-left ("+" create):** **NOT a universal element.** The only
  bottom-left fixed control in the whole app is `.shelf-add-primary`
  ("Add a book"), and it is: (a) Shelf-surface-only (rendered only inside
  `renderShelf`, views.js:4911), and (b) **mobile-only** — its `position:fixed`
  rule (components.css:12890-2894) lives inside `@media (max-width:759px)`
  (opens components.css:12866). At desktop widths and on every other route,
  there is no bottom-left fixed control at all. Confirmed by the CSS's own
  comment (components.css:12887-12889: "P2 · thumb-zone — Add a book relocates
  to a bottom-LEFT FAB… hidden in Select mode").
  **Verdict: CD-1's bottom-left half is UNSHIPPED as a universal "+ create"
  door — the only thing standing there today is a Shelf-scoped, mobile-only,
  book-adding button.** Any global capture FAB is genuinely new surface for
  Lane 1.

---

## 3 · Door-seat placement (CA-3 / D4)

Confirmed present, comment-only, exactly as the R-ARC ROOM-3 checkpoint
(`docs/checkpoints/r-arc-room3.md:62-64,103-108`) documents:

- `js/views.js:12035-12036` (inside `renderSubTheoryBuild(id)`, views.js:11349
  — the sub-theory's own field/workshop surface): *"D4 capture-door seat
  reserved in the header below (comment only — a visible inert control would
  be a dead control, DWF-1; wired in D4's build)."*
- The header it refers to: `fHead`/`.stb-srchead` (views.js:12040-12052) — a
  block-stacked div containing `.stb-src-title` ("The field") and `.stb-src-sub`
  (the passage count line, e.g. "3 passages — what this piece stands on…").
  **No DOM stub exists** — the checkpoint's own red-team correction (r-arc-
  room3.md L6, lines 103-108) is explicit: *"NO visible element and NO
  pre-built flex chrome… R-CAPTURE builds the header structure + control when
  the door ships."* The r-capture-brief's "the D4 seat comment already marks
  it in code" (line 73) is accurate but should not be read as "a reserved
  spatial slot exists" — it is literally a code comment beside two text divs.
- `views.js:14570` and `views.js:9971` (`'the ember'` etc.) are unrelated hits
  (Page-face CTA retirement note; the arc lifecycle-word array) — not part of
  the D4 seat.
- This surface is untouched by THE ARC STANDARD's S1-S4 additions (grepped
  `views.js:4222`, `:9999` — unrooted-seat and mark-composer work, both
  elsewhere). D4 seat location is current.

---

## 4 · Carrying-question storage + desk tap-grammar

### 4(a) Schema — does it touch the locked migrate/normalizer path?

**No.** `ensureUser(uid)` (state.js:1353-1462) is the profile schema
chokepoint — the exact same additive-field pattern as `ensureArcFields`/
`ensureSubTheoryFields` (R-ARC S2 census precedent). It backfills `state.
users[uid].profile = {displayNameOverride, penName, onboardingSeen, tagline,
yumiReadsAlong, yumiReaderModel, yumiWebGrounding, voiceOn, talkMode, values,
statement}` (state.js:1358/1383) with one `typeof x !== '<type>'` guard per
field (7 precedent fields, most recently `statement` at R9a). Called on BOTH
load paths: localStorage first-writer + Firestore sign-in merge
(`integrations.js:114`, `:563`, `:643`, `:771`). **No `SCHEMA_VERSION` bump
needed** — `state.SCHEMA_VERSION` only advances for whole-blob `migrate()`
steps (state.js:2670-3480), which `ensureUser` is not part of.

**BUT three sites, not one, for a fully-synced field** (all additive, all
well-precedented, none is the locked migrate/normalizer path):
1. `ensureUser` default shape — state.js:1358 + 1382-1384 guard.
2. `saveProfileToFirestore(uid, profile, callback)` — integrations.js:974-1046,
   explicit `.set()` field list (full-doc overwrite; comment integrations.js:
   1003-1004, 1011-1012 etc.: *"must be listed or it would be wiped on every
   save"*). A new field must be added here or it never leaves the device.
3. `loadProfileFromFirestore` merge callback — integrations.js:560-607, the
   symmetric read side (comment integrations.js:581-583: *"the Firestore-merge
   gotcha: a doc from sign-in bypasses migrate(), so read AND write must both
   carry this field or a second device silently wipes it"*).

`firestore.rules:51-54` (`/userProfiles/{uid}`) has **no field allow-list**
(unlike `publishedArcs`'s `publishedArcKeys()`) — no rules change needed.

**Verdict for Fork C: NOT a HALT fork.** Additive-only, 3 known chokepoints,
identical to how `statement` (R9a) and `values` (Portrait Stage 1) were added.

### 4(b) Desk tap-grammar audit (v3.243, R-SHELF)

`renderShelfDesk()` (views.js:5407-5445), DOM built at views.js:4961-4979:
`.desk` > `.desk-head` (flex row, `align-items:baseline`, components.css:
13008) containing `<h2>Now</h2>` + `<span class="count" id="shelf-desk-count">`
+ `.desk-row` (cover strip). Today `#shelf-desk-count` renders **only**
`'what you're carrying'` (a label for the still-reading books, views.js:5433)
— **NOT a question line**. The comment at views.js:5403-5406 is explicit that
this is unbuilt: *"The carrying-question line is carrying-question-OR-NOTHING
(D4) — no source is authored yet (an R-CAPTURE seam), so it renders nothing
here."*

**Existing interactive elements on the desk (the only two things a new
element could collide with):** each cover node (`buildCoverNode`, opens the
book) and `.desk-more` ("+N more reading →", views.js:5438-5443, opens the
focused band view). **No existing element would be repurposed** — a
question line is wholly new DOM. `.desk-head` is a tight flex row (10px gap,
baseline-aligned) sized for a short h2 + a short mono count label
(components.css:13008-13010); a full sentence-length question does not fit
that row's grammar and most likely needs its own block between `.desk-head`
and `.desk-row`, not an addition to the existing flex row. This sizing/
placement judgment is unfelt — matches the brief's own §9 flag exactly. No
code-level collision found; the risk is aesthetic/interaction, not structural.

---

## 5 · Dictation reality — CORRECTS the brief's file attribution

**The brief names `voice-input.js` for "book-association work" — this is
wrong.** All v3.141-era dictation + book-matching machinery
(`matchBook`, `processDictation`, `segmentDoc`, `commitEntries`) lives in
**`js/import-capture.js`**, not `voice-input.js`. `voice-input.js` (Web Speech
API) is untouched by that work and is used exclusively by Yumi chat's
talk-mode (confirmed §1).

**Machinery (import-capture.js):**
- `canRecord()` (:1008) — `MediaDevices.getUserMedia` + `MediaRecorder`
  feature check; false → textarea fallback, never a dead mic.
- `recordAndTranscribe(cbs)` (:1084-1137) — `getUserMedia({audio:true})` →
  `MediaRecorder` (webm/opus preferred, mp4 fallback for Safari/iOS,
  `pickAudioMimeType` :1017-1025) → on stop, one `Blob` → `transcribeBlob`.
- `transcribeBlob` (:1030-1074) — base64-encodes the blob, `POST
  /.netlify/functions/transcribe-proxy` (ElevenLabs Scribe, per prior-session
  naming — this repo's proxy layer, not directly grep-confirmed as "Scribe" in
  this file but matches memory `dictation_v2_shipped`), **20s hard timeout**
  (`TRANSCRIBE_TIMEOUT_MS`, :30) via `AbortController`.
- `processDictation(panel, transcript)` (:1263-1284) — feeds the transcript
  through the **same** `segmentDoc` engine the bulk-import path uses, then
  `commitEntries([item])` — a real 1-note commit, filed or Inbox with a
  book-guess chip UI (`renderDictated`, :1290-1366).
- Explicit comment (:1211-1212): *"recordAndTranscribe yields a STRING; this
  is the SOLE dictation transport (no VoiceInput)."*

**Loss window (matches CA-2):** bounded to "the audio is still in the
`MediaRecorder` buffer and has not yet become a `Blob`" — i.e. from mic-tap to
`rec.onstop` firing. Once `transcribeBlob`'s POST resolves and text exists,
`processDictation` commits synchronously via the same `captureNote`-adjacent
chokepoint (`commitEntries`) — durable from that instant. UI states
(Listening → Transcribing → "sorting your note…") disclose every stage; every
error branch (`denied`/`unsupported`/`empty`/generic-fail) falls back to a
type-a-note textarea, never a dead end (renderTypeNote, :1181-1188).

**What folds cleanly into a sheet "voice mode":** the whole `canRecord` →
`recordAndTranscribe` → `transcribeBlob` → `processDictation` chain is
self-contained and UI-agnostic (`panel` is just a mount div) — portable
as-is. **What stays bespoke:** the mic-hero / listening / dictated-confirm
screens (`buildMicHero`, `renderListening`, `renderDictated`) are hand-built
DOM in import-capture.js, not a shared component — CD-6 unification work,
not carryable machinery.

---

## 6 · SHARE_TARGET feasibility (Lane 3)

**Confirmed: `manifest.json` has NO `share_target` key** (full file read,
454 B, 8 top-level keys: name/short_name/start_url/display/background_color/
theme_color/icons — no share_target, no screenshots, no categories).

**Installability today:** manifest is otherwise minimally complete —
`start_url`, `display:"standalone"`, `background_color`/`theme_color`, two
icons (`icon.svg` purpose "any", `icon-maskable.svg` purpose "maskable", both
`sizes:"any"`, no PNG fallback). `index.html:8` links it; SW registers at
scope `/` (index.html:145). `sw.js` (6,041 B) precaches a real APP_SHELL list
(24 entries) install-time with a cache-busting fetch pattern
(`precacheFresh`, sw.js:64-75) and serves cache-first with a 503 fallback on
fetch failure (sw.js:130-145) — genuine offline-shell behavior for the static
app, though Firestore/API calls are explicitly passed through untouched
(`isApiRequest`, sw.js:42-50) and will fail offline as expected.

**What a share_target would require:**
- Add `"share_target": {"action": "...", "method": "GET"|"POST",
  "params": {...}}` to manifest.json.
- **Text-only share (title/text/url via GET):** small, additive. **But: zero
  query-string handling exists anywhere in the app today** (`grep
  location.search / URLSearchParams` across all of js/ = 0 hits — router is
  100% hash-based, `location.hash`). A GET share_target landing needs new
  plumbing to read `location.search` and feed it into a route/sheet — real
  but small net-new code, not a rewire of existing machinery.
- **File/image share (POST, multipart):** requires `sw.js`'s fetch handler to
  intercept POST — today it explicitly bails on non-GET
  (`if (event.request.method !== 'GET') return;` sw.js:107) — a genuine SW
  code change, more surface.
- **iOS:** WebKit does not implement the Web Share Target API for installed
  PWAs at all (platform limitation, not a Praxis gap) — any Lane 3 work is
  Android/Chrome-only by construction.

**GO/NO-GO:** **Conditional GO** for a narrow Android **text-only**
share_target (manifest addition + new `location.search`-reading landing,
small and additive). **NO-GO** for file/image sharing this round (real SW
surgery) and **NO-GO for iOS** (platform does not support it — "iOS limits
noted honestly" per brief §4).

---

## 7 · OB L-1 door confirm — PARTIAL CONTRADICTION, flagged

**Two onboarding mechanisms exist; only one is live, and its capture moment
is NOT neutral.**

- `maybeStartOnboarding(uid)` (yumi-ui.js:861-879) is the real gated trigger
  (signed-in, empty shelf, `onboardingSeen !== true`, not on an arc route),
  called from both the profile-load and books-load Firestore callbacks
  (integrations.js:185-186, :631-632).
- Inside it: *"W9: the guided journey REPLACES the scripted Yumi-chat
  greeting"* (yumi-ui.js:870-877) — since `window.Intros` is always loaded
  (intros.js is in `sw.js`'s APP_SHELL and the index.html load order),
  **`Intros.startJourney()` (intros.js:503) is what actually fires for real
  first-run users**; the older `startOnboarding()` chat-Q&A path
  (yumi-ui.js:781-794, ends by shelving ONE book via `processBulkLines`) is
  now **dead in production** — reachable only via its exported test entry
  point.
- The real journey is 8 beats (`JOURNEY`, intros.js:91-95): welcome →
  covenant → stance → values → **act-shelf** (real book create via
  `doShelve`, intros.js:315-329) → **act-margin** (real note via `doNote` →
  `captureNote`, intros.js:332-338) → act-sees → release.
- **`act-margin`'s capture is book-scoped, not neutral.** `doShelve`'s return
  is captured into `picked.bookId` (intros.js:447/455); `doNote` then calls
  `captureNote(realReg, body, activeKey, [])` with **`activeKey = picked.
  bookId ? picked.bookId : 'inbox'`** (intros.js:336) — since Act 1 (shelve)
  always precedes Act 2 (margin) and always sets `picked.bookId` on success,
  the onboarding's first real note is **filed to the just-created book**
  (`filed:true, bookIds:[bookId]` per `captureNote`'s branch logic), **never**
  Inbox-bound.

**This contradicts OB L-1's stated premise** ("first-run fires from neutral
context, so context-smart filing lands it Inbox-bound by its own grammar" /
"the door OB opens is this door, plain") **on two counts:** (1) the capture
UI is a bespoke one-off (`.ij-noteta` + `.ij-regs` toggle, intros.js:263-277)
sharing only the storage accessor with the rest of the app, not a "door" in
any component sense; (2) its context is deliberately book-scaffolded
(Act 1 → Act 2), the opposite of neutral. **Flagged as a fork for Preston** —
either OB L-1 is describing a future state the onboarding journey must be
rebuilt toward, or the "neutral/plain" framing needs to be dropped for the
onboarding case specifically.

---

## 8 · Persistence-gate reuse audit (CA-2)

**Confirmed: ONE existing gate, exactly as CA-2 describes, no sibling
needed.** "R-ARC S2: local-first session persistence" (views.js:1828-1868):

- Key scheme: `nbDraftKey(uid, activeKey)` (views.js:1844-1847) →
  `'praxis_nb_draft_' + uid + '_' + activeKey'`. Comment (:1839-1843):
  *"THE TAB IS IN THE KEY, and that is load-bearing"* — here "tab" = the
  Notebook's UI tab (inbox / journal / a bookId), not a browser tab; scoping
  on both uid AND that key is what stops one context's draft from clobbering
  another's on background/reload.
- Read/write/clear chokepoints: `nbDraftSave(uid, body, register, activeKey)`
  views.js:1849-1855, `nbDraftLoad(uid, activeKey)` views.js:1857-1863,
  `nbDraftClear(uid, activeKey)` views.js:1865-1868 — all thin `sv()`/`ls()`
  wrappers (per CLAUDE.md's storage convention).
- Owner-gating: uid captured ONCE at composer-mount time (closure var
  `nbOwnerUid`, views.js:3057-3058) and re-verified at flush time
  (views.js:3075-3076) — prevents an account-switch mid-session from writing
  A's draft into B's key.
- Flush hooks installed once app-wide (`nbInstallDraftHooks`, views.js:
  1877-1888): `visibilitychange` (hidden) + `pagehide` — explicitly NOT
  `beforeunload` (comment: iOS may never fire it).
- 300ms debounced auto-save on input (`nbDraftSchedule`, views.js:3079-3083)
  plus save-on-blur.

**The sheet's draft can ride this directly** by choosing its own `activeKey`
value (e.g. a literal `'sheet'` or the sheet's current context id) — additive
key-namespace use of the existing functions, not a new mechanism.

---

## 9 · Perf baseline (<400ms)

**No existing global "tap a fixed corner → focused capture input" path
exists to benchmark end-to-end** (§2: neither corner opens a note-capture
sheet today — Bloom opens chat, the Shelf FAB adds a book). The two closest
real analogs both skip the "reach the door from anywhere" hop:

1. **Notebook writeline** — `renderNotebook()` (views.js:2058+) is **fully
   synchronous** through composer mount: no `fetch`/`then`/`await` anywhere
   in the render path before `buildNotebookWriteline` appends the `<textarea
   class="nb-ce">` (confirmed by full read of views.js:2058-2117). The
   textarea exists in the DOM the instant `#notebook` finishes rendering, but
   there is **no autofocus** — the user still has to manually tap it. A rig
   should time: hashchange → `renderRoute` → `renderNotebook` return → (tap)
   → `focus` event. Pre-keystroke async work: **none found**.
2. **Book Detail "Add marginalia"** — `openMarginaliaEditor` (views.js:14800)
   → `createWritingCanvas` (writing-canvas.js:114-140) is **also fully
   synchronous**: click handler → function call → `contenteditable` div
   created + appended → `canvas.focus()` (views.js:14905), same tick. No
   network, no async, anywhere in the chain (confirmed by reading
   writing-canvas.js:114-190). This is the tightest chain in the app today.

**What a before-number should measure:** click-to-focus latency for #2 (the
tightest existing chain) as the floor, PLUS the currently-nonexistent
"reach the door" hop (corner-tap → sheet-visible → focus) that CD-2 actually
needs timed once Lane 1 builds it — there is no current equivalent to
benchmark for that leg. `ImportCapture.open()` is NOT the fast path: its
`renderEntry` is synchronous too, but reaching a text field requires a
**second click** (the "Paste notes" pill, import-capture.js:437,458-462)
before the `<textarea class="ic-textarea">` becomes visible/focusable — not
"focus lands in one frame" per CD-2.

---

## Fork evidence (not decided here)

### B — Mockup fork
No existing bottom-sheet/card capture component exists anywhere in the app.
All four census entries (§1) are either inline editors mounted into a
pre-existing page host (`#book-detail-editor-host`, `#notebook-editor-host`)
or a full-viewport-adjacent modal overlay rebuilt from scratch on every open
(`import-capture.js` `.ic-overlay`, panel `innerHTML` cleared and rebuilt at
:415-416 `renderEntry`). **None matches CD-2's "pre-rendered, two-size,
focus-in-one-frame" bottom-sheet/card shape.** This is real net-new UI
territory, not a restyle of an existing sheet — supports the case for a quick
390+1360 mockup before build (per the brief's own §8 flag that CD-2 was ruled
without a felt test).

### C — CA-1 schema call
See §4(a) in full. **Verdict: NOT a HALT fork.** Additive-only across three
already-precedented chokepoints (`ensureUser`, `saveProfileToFirestore`'s
explicit `.set()` list, `loadProfileFromFirestore`'s merge). No
`SCHEMA_VERSION` bump, no `firestore.rules` change (no field allow-list on
`/userProfiles`). Identical shape to how `statement` (R9a) and `values`
(Portrait Stage 1) were added.

### D — Pre-state byte bands (measured, HEAD 09ba14d)

| File | Bytes |
|---|---|
| js/views.js | 1,062,208 |
| js/import-capture.js | 66,922 |
| js/voice-input.js | 5,963 |
| js/state.js | 181,169 |
| js/integrations.js | 153,865 |
| js/app.js | 3,549 |
| assets/components.css | 835,846 |
| sw.js | 6,041 |
| manifest.json | 454 |
| index.html | 8,602 |

(Also measured, not requested but load-order-adjacent: js/intros.js 38,826 ·
js/room-field.js 16,670 · js/yumi-ui.js 91,422 · js/spotlight.js 15,822 ·
js/writing-canvas.js 27,272 · js/arc-constellation.js 95,048 ·
js/yumi-brain.js 154,835 · assets/theme.css 45,705.)

---

## §2 re-ratification — CD-1..6 / CA-1..3 vs recon evidence

| Ruling | Contradiction found? |
|---|---|
| CD-1 (two ruled corners) | **Half-contradicted.** Bloom (bottom-right) shipped exactly as ruled. The "+" create door (bottom-left) is UNSHIPPED as a universal element — only a Shelf-scoped, mobile-only "Add a book" FAB occupies that corner today (§2). |
| CD-2 (pre-rendered two-size sheet) | No contradiction — brief already flags this as unfelt/unbuilt (§8); recon confirms no such component exists anywhere (Fork B). |
| CD-3 (context-smart, never silent) | No contradiction — not yet built, nothing to conflict with. Existing capture paths ARE mostly non-silent (dictation shows a book-guess chip UI; Notebook writeline is a straightforward tab-scoped file). |
| CD-4 (talk-it-through = a seat only) | No contradiction, but stronger than stated: today there is no seat AT ALL, only the full Yumi chat panel — confirmed zero capture-note calls in yumi-ui.js (§1). |
| CD-5 (commit-and-stay) | No contradiction — Notebook writeline already re-renders and keeps composing after `captureNote` (views.js:3467, no navigation away); this is a real, reusable precedent for commit-and-stay behavior. |
| CD-6 (one create door, one component) | No contradiction — confirms the premise. FOUR distinct bespoke capture UIs exist today (§1), zero shared component; CD-6 accurately names a real problem. |
| CA-1 (question authoring on the desk) | No contradiction in the ruling itself. Its schema flag (§8 of the brief) resolves NOT-a-HALT per §4(a)/Fork C above. |
| CA-2 (the failure law / persistence gate) | No contradiction — the named "per-tab per-uid" gate exists exactly as described (§8) and is reusable as-is. |
| CA-3 (workshop seat inherited) | No contradiction — the D4 seat comment exists exactly where CA-3 says (§3), correctly described as comment-only, not pre-built. |
| **OB L-1** (stated in §3 LAWS, not §2, but carrying a recon-confirm requirement) | **Contradicted.** See §7 — the live onboarding capture moment is book-scoped, not neutral, and uses a bespoke one-off UI, not "this door." Flagged as a fork for Preston. |

---

## Mismatches ranked by severity

1. **[HIGH] OB L-1 contradicted by code.** The real first-run onboarding
   (`Intros.startJourney`, live and gated correctly) files its one real
   capture into the just-shelved book (`activeKey = picked.bookId`), never
   Inbox — the opposite of "neutral context → Inbox by its own grammar."
   Preston's call: rebuild the onboarding beat toward neutral-context once
   the door exists, or drop the "plain/neutral" framing for onboarding
   specifically. (§7)
2. **[HIGH] CD-1's bottom-left "+" create door is unshipped as a universal
   element.** Only a Shelf-scoped, mobile-only "Add a book" FAB occupies
   that corner. Lane 1 is building a new global element there, not
   generalizing an existing one — larger scope than "verify the shipped
   corner state" implied. (§2)
3. **[MEDIUM] Brief item 5 misattributes dictation machinery to
   `voice-input.js`.** All v3.141 book-association/dictation code lives in
   `import-capture.js`; `voice-input.js` is a separate, unrelated Web Speech
   API module used only by Yumi chat's talk-mode. Any Lane 2 voice-mode work
   should scope against `import-capture.js`, not `voice-input.js`. (§5)
4. **[LOW] Foundation byte-lock deviation.** `assets/lumen-amber.css` =
   14,966 B vs the 14,681 B expectation in this agent's standing brief —
   confirmed a pre-existing, already-logged deviation (since FX-1), not new
   this session. Carried forward for visibility only.
5. **[LOW] No felt precedent for the desk's question-line placement.**
   `.desk-head` is a tight flex row sized for a short h2 + short mono label;
   a full question sentence likely needs its own new block-level row rather
   than joining the existing row. Not a collision with any existing control,
   but an unfelt layout call — matches the brief's own §9 flag, cited here
   with the concrete CSS geometry. (§4b)
