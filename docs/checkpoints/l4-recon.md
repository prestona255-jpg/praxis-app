# L4 — Stage 0 pre-flight report (read-only)

Taken 10 Nov 2026, Opus 5.5 in Claude Code, against HEAD `c6a32eb`. Nothing in the repo was edited, staged or committed. The only write was the carry extraction (`p2-carry-v18/`, untracked) that Preston asked for. This report lands in `docs/checkpoints/l4.md` at Stage 5.

**Verdict: CLEAN TO BUILD, WITH ONE STOP.** `sky.css` reads 9 custom properties that live `theme.css` does not define (F1). The brief's own §5.4 names this case as a STOP with one question. Sixteen more forks follow, each with the default I take on "go".

---

## 0.1 Ground truth (`sh tools/ground-truth` + git)

| Check | Expected | Found | |
|---|---|---|---|
| HEAD | `c6a32eb` | `c6a32ebdb9bcfe5f12857dacea8291d479305b08` | MATCH |
| origin/main | == HEAD | `c6a32eb…` | MATCH |
| HEAD subject | "L1.2c — the status zone, …" | "L1.2c — the new look: the status zone, the Add-a-book radios, the soil band" | MATCH (brief abbreviated it) |
| CACHE_VERSION | `praxis-v3.316` (sw.js:12) | `var CACHE_VERSION = 'praxis-v3.316';` sw.js:12 | MATCH |
| hook gate | armed | `core.hooksPath = hooks`, ARMED | MATCH |
| FIX-PROTOCOL | v1.3 | "# PRAXIS — Fix & Build Protocol (v1.3)" | MATCH |
| lumen-amber.css | 11,953 B · `631bc2aad9f55bbf77b090b30f6807db` | HEAD 11,953 · `631bc2aa…07db`; working tree identical | MATCH |
| marks.js | 10,255 B · `772886c0…` | HEAD 10,255 · `772886c049d0d6d03d341507e602d88a`; working tree identical | MATCH |
| tracked tree clean | clean | **`M docs/checkpoints/l1.md`** (+14 lines) | **NOT CLEAN → F13** |

The dirty hunk is the L1.2c push-and-deploy record from the previous session ("Pushed — L1.2c, 2026-10-30" and "Deploy confirmed, 2026-10-30"). It was never committed. No code is dirty.

## 0.2 Protocol docs

**Found (14/14 named):** CLAUDE.md · PROTOCOL.md · docs/FIX-PROTOCOL.md · CRAFT.md · BOARD.md · docs/studio/sequence.md · docs/studio/lessons.md · docs/Checklist and Roadmap/BUILD_STATE.md · docs/checkpoints/l1.md · docs/checkpoints/l3.md · docs/studio/v1-canon-delta.md · docs/studio/consent-copy.md · docs/studio/praxis-universal-token-sheet.md · design/praxis-day-three.html.
**Canon amendments found:** v1-canon-delta-amend-1.2.md · v1-canon-delta-amend-1.4-tokens.md · v1-canon-delta-amend-1.4-corrections.md.
**Agents (.claude/agents/):** fix-implementer · fix-red-team · praxis-recon · praxis-reviewer · repo-mapper · studio-mockup · studio-scan.
**Expected and not found:** none. Note that **there is no amendment 1.3 in the repo.** The contract (§3 step 10) and the seventeenth sitting (S9) both cite "amendment 1.3's ten presets + seven more" for the Garden. Its only carrier is `hand.js`'s `GARDEN`. Amendment 1.5 should record that (Stage 5.4).

## 0.3 The carry

Found at the repo root: `p2-carry-v18/` (extracted this session from `~/Downloads/praxis-p2-carry-v18.tgz`). Before extraction, all 215 archive entries were checked: all sit under `p2-carry-v18/`, with no absolute paths, no `..` and no links.
**MANIFEST.txt verified line by line: 206/206 MATCH** on size and md5, 0 MISMATCH, 0 missing. The only file not in the manifest is MANIFEST.txt itself. The files to be lifted:

| File | Manifest | Found | |
|---|---|---|---|
| hand.js | 40,981 · `fd51ca7e69325ad3f93c4be54d974d9a` | same | MATCH |
| sky.css | 11,522 · `89f56ebe061f66985d30888e5969f10b` | same | MATCH |
| l4-lens-engine-contract.md | 22,201 · `a71f3f70…` | same | MATCH |
| lens-contract.md | 7,520 · `306f4c0a…` | same | MATCH |
| p2-sixteenth-sitting-rulings.md | 9,724 · `d1c54d0f…` | same | MATCH |
| p2-seventeenth-sitting-rulings.md | 12,971 · `c06b2bd2…` | same | MATCH |
| DESIGN-HANDOFF-10nov.md | 5,567 · `87a79b28…` | same | MATCH |
| praxis-lens-sky.html | 54,715 · `4d956bb1…` | same | MATCH |
| praxis-lens-sheet.html | 70,185 · `ae904a9b…` | same | MATCH |

**Early engine checks (read-only, on the carry copy):**
- `cscript //nologo //E:jscript tools/parse-check p2-carry-v18/hand.js` → `PARSE OK`, exit 0.
- ES3 grep: 2 hits. Both are backticks inside comments (:28, :233). The hook's non-blocking ES3 WARN will print them at commit.
- `hand.js` and `sky.css` were run through the hook's auto-guard regexes as fully-added files. 5a (CSS-var seam), 5b (hex in CSS), 5c (deps, JS and CSS): **0 hits each.**
- `hand.js` reads `var(--bl-core|gold|light|wisdom|theory|emp|edge)`. All 7 are defined in live theme.css. ✓

## 0.4 Anchors (all resolve; drift noted)

| File | Anchor (brief) | Found | First line |
|---|---|---|---|
| yumi-brain.js | LENS_GEN_SYSTEM :881 | :881 | `var LENS_GEN_SYSTEM =` |
| | "you keep circling" :899 | :899 | `+ 'reader -- "you keep circling..." -- naming what you see WITHOUT '` |
| | gatherLensLibraryMetadata :923 | :923 | `function gatherLensLibraryMetadata() {` |
| | buildLensGenUserMessage :990 | :990 | `function buildLensGenUserMessage(meta) {` |
| | yumiMarkLensNamesSent :1021 | :1021 | `function yumiMarkLensNamesSent(meta) {` |
| | generateLenses :1031 | :1031 | `function generateLenses(meta) {`; `max_tokens: 1024,` at :1035 |
| | LENS_GEN_BLOCKLIST :1065 | :1065 | `var LENS_GEN_BLOCKLIST = [` |
| | nameCollidesWith :1089 | :1089 | `function nameCollidesWith(name, otherNames) {` |
| | evalLensResponse :1130 | :1130 | `function evalLensResponse(rawText, libraryTitles, valueNames) {` |
| | VALUE_RETROFIT_MAX :1229 | :1229 | `var VALUE_RETROFIT_MAX = 240;` |
| | prioritizeValueBooks :1235 | :1235 | `function prioritizeValueBooks(books, titleToId, max) {` |
| | parseValueRetrofitArray :1340 | :1340 | `function parseValueRetrofitArray(rawText) {` |
| | aiProxyFetch :111 | :111 | `function aiProxyFetch(payload) {` |
| | consent rejections :87, :817 | **:88, :818** (+1) | `return Promise.reject(_aiProxyError(-1, 'consent_required', …` |
| | aiLimitMessage :136 | :136 | `function aiLimitMessage(err, who) {` |
| yumi-ui.js | lensAiSuggestionsEnabled :1785 | :1785 | `function lensAiSuggestionsEnabled() {` (reads `ls('praxis_lens_ai_suggestions', true)` :1788) |
| | startLensSuggest :1795 | :1795 | `function startLensSuggest() {` |
| | lensSuggestAdopt :1831 | :1831 | `function lensSuggestAdopt(pid) {` |
| | lensSuggestDismiss :1850 | :1850 | `function lensSuggestDismiss(pid) {` |
| | (lensSuggestRename, not named) | :1858 | `function lensSuggestRename(pid) {` (retired in 3.4) |
| | buildLensSuggestRetry :1887 | :1887 | "Ask Yumi again" :1891 |
| | buildProposedLensCard :1900 | :1900 | `lens.books.join(' · ')` :1919 · "Name it" :1928 |
| | "Yumi’s suggestions" :2059 | :2059 | `sugLabel.textContent = 'Yumi’s suggestions';` (curly ’) |
| | "…lens suggestions are off…" :2064 | :2064 | ✓ |
| | "Reading across your shelf…" :2074 | :2074 | ✓ |
| | "…couldn’t reach for lenses just now." :2079 | :2079 | ✓ |
| | "…didn’t find clear lenses this time…" :2086 | :2086 | ✓ |
| | sparse lines :2096–2097 | :2096–2097 | ✓ |
| | covenant line :2108 | :2108 | "Yumi proposes these from your titles, authors, and genres only…" |
| state.js | ls / sv :252 / :262 | :252 / :262 | `function ls(k, d) {` / `function sv(k, v) {` |
| | ensureThemeFields :890 | :890 | `function ensureThemeFields(theme) {` (+ `ensureThemeFieldsAll` :905) |
| | isYumiYesGranted :1428 | :1428 | `function isYumiYesGranted(uid) {` |
| | SHELF_CATEGORIES :499 | :499 | `var SHELF_CATEGORIES = [` |
| | book.category :413 | :413 | `if (typeof book.category !== 'string') { book.category = ''; …` (categoryOverride :415/:420; resolver override-wins :617–619) |
| | reader-model mirror ~:1553 | :1556–1558 | `if (!state.users[uid].readerModel \|\| …` |
| | createUserTheme :2669 | :2669 | `function createUserTheme(name) {` (markPendingSync('themes') :2685) |
| | assignBookToTheme :2693 | :2693 | `function assignBookToTheme(themeId, bookId) {` |
| | markPendingSync (brief: integrations) | **state.js:1081** | `function markPendingSync(kind, uid, id) {` |
| integrations.js | /userThemes load + REPLACE-merge :411–430 | :410–430+ | `// Stage 7 (manual themes): fetch this user's theme overlay from` → `loadThemesFromFirestore(u.uid, …` :415, FX-1c splat + pending-delete set |
| | deleteAccountCloudData :1412 | :1412 | `function deleteAccountCloudData(uid) {` |
| | buildExportBundle :3060 | :3060 | `function buildExportBundle(uid, email, published, publicProfile, exportedAt) {` |
| | (ACCOUNT_GLOBAL_KEYS, not named) | :1489 | carries `'praxis_lens_ai_suggestions'` at :1495 → F9 |
| views.js | the one location.search read :26540 | :26540 | `var s = location.search \|\| '';` inside `capHandleShareTarget` :26539 → F12 |
| | renderHome :1901 | :1901 | `function renderHome() {` |
| | buildHomeYumiDock :1599 | :1599 | `function buildHomeYumiDock() {` (appended :1995) → F3 |
| | buildHomeFieldData :1672 | :1672 | `function buildHomeFieldData(arcs) {` |
| | renderProfilePage :23691 | :23691 | `function renderProfilePage() {` (live sky `_profileBuildSky` :22596 → F10) |
| | the Shelf's lens bands | **`renderShelfCase` :5820** | lenses mode groups `state.userThemes` where `userId === uid` (:5876–5880); grouping key `praxis_shelf_grouping` (:298–314) |
| | router | `renderRoute` :396 | |
| claude-proxy.js | ALLOWED_MODELS :27 | :27 | `var ALLOWED_MODELS = { 'claude-sonnet-4-6': true };` |
| | MAX_OUTPUT_TOKENS :32 | **:30** | `var MAX_OUTPUT_TOKENS = 4096;` (clamp :117–118) |
| | ceiling.enforce :79 | :79 | `var gate = await ceiling.enforce(event, Date.now());` |
| lib/ceiling.js | PRAXIS_AI_DAILY_CAP :44 | :44 (doc) / :297 (read) | default 300 |
| index.html | script list :96–121 | :96–121 | state :99 · ME-1 comment :100–105 · measure :106 … yumi-brain :112 · yumi-ui :115 · intros :118 · views :119 · import-capture :120 · app :121 |
| | stylesheets | :32 lumen-amber · **:34 `/assets/theme.css`** · :35 components · :40 praxis-kit · :47 universal-depth | **there is no `css/` directory** → F2 |
| sw.js | precache list :38–53 | APP_SHELL :14–53 | `/assets/lumen-amber.css` :21 · `/js/views.js` :51 |
| firestore.rules | /userThemes/{uid} owner-only | :92–96 | `allow read, create, update: if onList() && request.auth.uid == uid;` + owner-only delete. **List-gated, not plain owner-only** → F14 |

## 0.5 Stats and expected deltas

**HEAD sizes** (`git show HEAD:<f> | wc -c`, LF blobs):

| File | HEAD bytes | Expected change (estimate, floor → ceiling) |
|---|---|---|
| js/yumi-brain.js | 156,777 | +6,000 → +11,000 (prompt +~40 chars; message v2; eval v2 ten steps; generateLensReReading) |
| js/yumi-ui.js | 98,798 | −4,500 (retire the suggestions section + switch + adopt/dismiss/rename) then +7,000 → +12,000 (the pinned say-back); net +2,500 → +8,000 |
| js/state.js | 193,491 | +6,000 → +10,000 (ensureThemeFields backfill; offers writers; sameLens guard; mayAutoReRead) |
| js/integrations.js | 212,483 | +2,500 → +5,000 (/userLensOffers load + save beside /userThemes; export; delete batch) |
| js/views.js | 1,297,192 | +25,000 → +45,000 (#lenses page; lens sheet; Home sky behind the key; You modes; Yumi row) |
| js/app.js | 5,035 | +250 → +600 (`?sky` read before renderRoute → F12) |
| assets/components.css | 902,065 | +10,000 → +20,000 (Lenses page, sheet, pinned panel, You modes, 1360 column → F11) |
| index.html | 10,592 | +2 lines, ≈ +100 |
| sw.js | 6,824 | +2 precache lines (≈ +45) and v3.316 → v3.317 (0 bytes net) |
| firestore.rules | 12,445 | +1 match block, ≈ +250 |
| js/hand.js | NEW | **40,981 exactly** |
| assets/sky.css (F2) | NEW | **11,522 exactly**, if F1 bridges outside the file. A rename inside it changes the size (F1) |

These are estimates, stated before the build so the actuals can be checked against them. They are not claims.

**LENS_GEN_SYSTEM** (evaluated with cscript JScript; Node is blocked):
- Live source block (`var …;`, LF): **2,615** (brief: 2,615) ✓
- Live joined string: **2,333** (brief: 2,333) ✓
- Contract §1 joined: **2,372**, mirroring today's shape (paragraphs joined `\n\n`, then "Return ONLY a JSON array, nothing around it:" + `\n` + the JSON without its markdown backticks). Keeping the two backticks gives 2,374, the brief's figure. I land 2,372: the backticks are markdown code fencing, not prompt text.

**Grep expectations, before → after:**

| Pattern | File | Brief | Mine | |
|---|---|---|---|---|
| `you keep circling` | yumi-brain.js | 1 → 0 | 1 → **1** | **F7**: the contract's verbatim prompt itself contains `never "you keep circling", …` |
| `max_tokens: 1600` in generateLenses | yumi-brain.js | 0 → 1 | 0 → 1 | ✓ |
| `praxis_lens_ai_suggestions` | yumi-ui.js | 1 → 0 | **2** → 0 | **F9**: 2 today (comment :1787 + read :1788); also integrations.js:1495, views.js:21650 (comment) |
| `Yumi’s suggestions` | yumi-ui.js | 1 → 0 | 1 → 0 | ✓ (curly ’) |

**index.html (F2 default):** `<link rel="stylesheet" href="/assets/sky.css">` at new line **35**, after theme.css (:34). `<script src="/js/hand.js"></script>` at new line **120**, directly before views.js. That is after state.js and leaves the ME-1 comment ("measure.js loads directly after state.js") true. views.js moves :119 → :121.
**sw.js:** `'/assets/sky.css'` after `'/assets/lumen-amber.css'` (:21); `'/js/hand.js'` before `'/js/views.js'` (:51); CACHE_VERSION → `praxis-v3.317` at commit time.

## 0.6 What I read, in my words

1. **The Lenses page** (`#lenses`) is where Yumi's reading of the shelf lives, off Home. Her state comes first, in her voice, on the umber band: reading · nothing clear · under five books · nothing new · no yes (a consent card) · the daily limit.
2. Below that comes the inline offer under "From Yumi". After it: Later rows; "Your lenses" rows; a "Remembered as not this · N" fold with "Let her forget this" and Undo; "Name your own"; and the one-line door to Open Lens (L4b). Back returns to where you came from.
3. **The offer card** is one of her lenses, not yet yours. It has a mark and name, the covers (tap one for her clause on that book), her reading (lead · one clause per book · close) and the question "she would hold, not for answering here". Then three theme chips and four answers: Take it up (the only gold), Later, Not this, and "Not quite — talk it through".
4. **The lens sheet** is what a tap on any lens opens, as a bottom sheet (docked right at 1360). It shows the mark, name and counts; her pinned question; her reading (left-out books drop their clause); the covers with her clause and "Leave out of this lens" (never under two books); why you keep returning; and what you said back, with "Let her forget this". The doors are Open lens (a toast only), talk it through (her lenses only), Rename, and Let it go (the confirm names what stays).
5. A lens of your own she hasn't read says so, with "Ask Yumi to read it" (one call).
6. **The say-back** is Yumi's panel with the lens pinned. Her first reading stays at the head as it stood. She asks what the books are for. You write one line of up to 140 characters. She re-reads the same books through your words, quoting you once as "You told me: …", and offers one "Call it …" chip beside "Name it yourself". After her first reading and two re-readings, the name line opens empty and the name is yours. Keep it stores the exchange as `said[]`.
7. **The Home sky** (behind `praxis_sky`) is the head of Home. It has the rail, the date, the greeting, then a living field: a current underneath, your kept lenses as Garden-coloured painted forms orbiting a flower made of their colours, and threads between lenses that share books. Below it: one honest line or hint, the counts, and a quiet door line to Lenses when something is waiting. Then the paper, with the Yumi row gone.
8. **The sky sheet**: holding the flower for 500 ms (or Enter/Space on it) opens "Your sky": a Threads switch, a Names switch, and a Lenses row with counts.
9. **You** gets the same sky under the name, with a Lenses · Categories · Marks control. Categories shows your shelf's categories sized by book count, and a tap filters the Shelf. Marks shows your eight most-annotated books sized by notes, and a tap filters the Notebook. Neither statistics mode draws threads.
10. **1360** puts the sky in a sticky 600 px left column, with the paper on the right and the tab bar hidden. Day keeps the sky dark (the lamp on `#2B1E12`) and turns only the paper light, which the screenshots show.

---

## Forks (FORK-VERBATIM: every one reaches Preston; "go" accepts each default unless he says otherwise)

**F1 — THE QUESTION. sky.css reads 9 custom properties that live theme.css does not define.** It uses the mockup's names, not the repo's:

| sky.css reads | uses | live twin (same value) | live value (night) |
|---|---|---|---|
| `--on-n` | 20 | `--on-night` | #F5E8C4 |
| `--on-n2` | 6 | `--on-night-2` | #CDB894 |
| `--on-n3` | 6 | `--on-night-3` | #BAA48C |
| `--ink3` | 4 | `--ink-3` | #BAA48C |
| `--serif` | 3 | `--font-serif` (→ `--font-display`) | Fraunces |
| `--sans` | 11 | `--font-body` | DM Sans |
| `--mono` | 2 | `--font-mono` | DM Mono |
| `--card` | 2 | no exact name: `--umber` (#4A2E18, the mockup's night `--card` value) or `--card-1` (`var(--page-2)`) | **design call** |
| `--star` | 5 | no exact name: `--gold` (#E8B23A, the mockup's value) or `--gold-star` | **design call** |

Lifted byte-for-byte, those declarations are invalid at computed-value time. The sky's text would fall back to inherited colour and font, its hairlines (`color-mix` of `--on-n`) would vanish, and the stars would lose their colour. The 13 short names (`--d --dl --tf --tl --tg --ro --del --bd --bdl --ax --ay --sc --sw`) are per-orb values `hand.js` sets inline. They are fine.
The brief allows neither a byte change to `sky.css` nor a new token. Options:
- **(A) Rename in sky.css (recommended).** Map the 9 names to their live twins. `sky.css` diverges from the carry: its new size and md5 go into l4.md for the design chat to take back, as Stage 6 already does for engine edits. No token is added. `hand.js` stays byte-for-byte.
- **(B) A scoped alias block** in components.css (`.sky{--on-n:var(--on-night);…}`). `sky.css` stays byte-for-byte, but that is 9 custom-property definitions outside theme.css.
- **(C) Back to the design chat** for a v19 `sky.css` against live names. Stage 4 waits. Stages 1–3 and 5 can proceed.

Whichever you pick, `--card` and `--star` need a twin named. Recommended: `--card` → `--umber` and `--star` → `--gold` (same values as the mockup).

**F2 — sky.css location.** The brief says `css/sky.css`, but the repo has no `css/` directory. Every stylesheet lives in `assets/`, beside `theme.css`, and the hook's hex and dependency guards scan only `assets/*.css`. **Default: `assets/sky.css`**, precache entry `/assets/sky.css`. (PROTOCOL.md §7 says "no new stylesheets". This lane overrides that on purpose: the contract wants the host CSS shared with the mockup as one file. It is recorded, not silently absorbed.)

**F3 — Ruling 84 vs the consent copy.** The brief says "the Yumi row is removed from Home's paper for everyone". That row (`buildHomeYumiDock`, views.js:1599, appended :1995) does three jobs:
(1) before the yes: "I’m quiet until you say yes." → `openYumiYesSheet('home-dock')`;
(2) hand raised: "I noticed a thread in your notes. When you want it.";
(3) otherwise: "I’m in the corner when you want me."
`consent-copy.md:24` lists **"Home’s dock before the yes"** as a door to the yes, and `:153` specifies its copy. `:19` says the Bloom only appears after the yes. Ruling 84's reason ("with the Bloom already in the corner… says it twice") only holds after the yes. **Default: remove the dock after the yes (jobs 2 and 3) and keep the pre-yes quiet dock (job 1).** That keeps consent-copy.md unchanged, as the brief demands, and honours r84's stated reason. The hand-raised notice stays reachable through the Bloom (to be checked in the sweep). If you meant the pre-yes door to go too, that changes the consent contract, which the brief forbids. It's your call.

**F4 — The new Firestore rule needs publishing, and persistence goes unverified until it is.** Netlify does not deploy `firestore.rules`. Until `/userLensOffers/{uid}` is published in the Firebase console, every offers write fails with `permission-denied` on live. **Ordering dependency:** publish the rule BEFORE the v3.317 push. The autonomous run proves the writers and the round-trip on the app's own writers against a stubbed Firestore. **Persistence is unverified: the rig is signed out.** Your live-smoke steps will be written into l4.md.

**F5 — Stage 4's "Preston's real lenses" at 0/1/3/5/8/12/16.** The rig cannot sign in as you, and the live origin is unreachable from this box (curl exit 56, per l1.md). I can't read your lens count, and if you have fewer than 16, "temporarily filter, never write fake lenses" cannot reach 16. **Default:** render the counts from a local fixture built through the app's own writers (`createUserTheme` / `assignBookToTheme`) in a signed-out rig. That writes nothing to any account. The renders at your real lenses become a named check on your device at the push gate.

**F6 — Docs scope.** The brief says "no other doc touched". CLAUDE.md requires a BOARD.md row for a new surface (`#lenses`) in the same commit, the studio surface markdown, and a Builder regen (`tools/studio-build`) at the push point. **Default: follow CLAUDE.md.** Add the BOARD.md row, update the surface markdown, and regen the Builder on the push commit. Checkpoint 5's `git status` will list those three files, so its "no other doc" claim is amended to name them.

**F7 — `you keep circling` grep.** 1 → 0 is impossible with a verbatim §1 prompt, because the prompt contains the phrase in its ban list. **Default: expected after = 1**, the ban-list line, proven by its line number.

**F8 — The eval fixture.** Contract §9 proof 8 lists 3 clean, 2 old-shape, 2 reader-claims, 1 declined twin, 1 under-2, 1 over-length, 1 uncited clause and 1 unparseable. Brief §1.6 lists 3 clean, 1 old-shape, 1 reader-claim, 1 "You told me" exempt, 2 declined twins (name and ⅔), 1 under-2, 1 uncited clause, 1 over-length q and 1 unparseable. Both total 12, with different members. **Default: the union, 14 fixtures** (the brief's 12 plus the contract's second old-shape and second reader-claim). PASS = 14/14.

**F9 — `praxis_lens_ai_suggestions` beyond yumi-ui.** **Default:** retire both yumi-ui.js hits (2 → 0). Keep `integrations.js:1495`: it is in `ACCOUNT_GLOBAL_KEYS`, which clears the key on account switch, so a stale value still gets wiped. Leave the views.js:21650 comment, which belongs to another feature.

**F10 — You already has a sky.** `renderProfilePage` draws `.pf-sky` through `_profileBuildSky` (views.js:22596) inside `.pf-sky-host`, with its own Lenses|Categories `.pf-seg` axis toggle. The carry never names it. **Default:** behind `praxis_sky`, the `hand.js` sky and the Lenses · Categories · Marks control replace `.pf-sky-host`'s content and the `.pf-seg`. With the key off, You is byte-for-byte untouched; the DOM diff proves it.

**F11 — components.css is not in the brief's file list.** The Lenses page, the lens sheet, the pinned say-back, You's mode control, Home's door line and the 1360 column all need CSS, and PROTOCOL §7 puts it in components.css. **Default:** add it there, desktop-first (CLAUDE.md §3), and report the delta.

**F12 — Where the `?sky` read goes.** The one `location.search` read (`capHandleShareTarget`, views.js:26539) runs from app.js:48, **after** `renderRoute()` at app.js:40. It would miss the first render of a cold open. It also returns early when there's no share payload. **Default (pre-authorized by the brief):** read `?sky=on|off` in app.js **before** `renderRoute()`, and strip it with the same `replaceState` idiom. app.js joins the file list.

**F13 — The dirty l1.md.** **Default:** keep the 14-line L1.2c push record. Stage 5.3's close-out goes on top of it and it rides the L4 commit.

**F14 — The rule's shape.** "Mirror /userThemes" means copying `onList() && request.auth.uid == uid` for read, create and update, plus an owner-only delete (the L3.2 ruling). **Default: an exact mirror, onList() included.**

**F15 — Stage 6's fallback differs between the two docs.** Contract §6: if the re-run fails, ship with motion off behind `praxis_sky_motion`. Brief: "the sky ships dark into L4b". Not needed until Stage 6; raised now so it doesn't surprise anyone then.

**F16 — The shape of `themes`.** lens-contract §2 says `[≤3 strings]`; engine contract §2 says `[≤3 {k,t}]`. **Default: `{k,t}`** (the newer contract, and what the mockup renders).

**F17 — Proof 9, "one call per generation, counted at the proxy".** The autonomous run counts at the stub (no live call). The proxy count (the ceiling before and after) becomes a push-gate check alongside your one real generation.

## Ordering dependencies (#10)
1. Publish `/userLensOffers` in firestore.rules **before** the v3.317 push (F4).
2. Stage 1's shim (`buildProposedLensCard` reads `lens.reading`) keeps the live panel working until Stage 3 retires it. Everything lands in one commit, so no live build ever carries the shim alone.
3. The F1 bridge must exist before any Stage 4 render check, or the sky renders unstyled and the sweep would grade a broken skin.

## Gates
This session carries **no AgentTool bar**, so no lift is needed and every gate agent runs normally. The plan on "go":
1. Create `docs/checkpoints/l4.md` with `L4 STARTED` (the FIX-PROTOCOL write-test; Stage 0 itself stayed read-only, per the brief).
2. Run `repo-mapper` on the `/userThemes` load, the REPLACE-merge, FX-1 / FX-1c and `markPendingSync` (Stage 2 sits beside prior fixes).
3. Run `fix-red-team` on this recon (§1#8). A finding stops the build before a line is written.
4. Build Stages 1–5.
5. Before the commit gate: `fix-red-team` (§9) on the diff, then `praxis-reviewer`. Their verdicts gate the commit.

## Pre-existing drift (separate tasks, not folded in)
- `index.html` loads `/js/intros.js` and `/docs/studio/universal-depth.css`, but **neither is in sw.js APP_SHELL**. Offline cold opens miss them.
- CLAUDE.md, PROTOCOL.md §9 and FIX-PROTOCOL §1 still name `praxis-reading.netlify.app` as the live origin. The carry and l1.md use `praxisreader.com`.
- Anchor drift that is expected and noted, not fixed: consent rejections at :88/:818, MAX_OUTPUT_TOKENS at :30, `markPendingSync` in state.js, and lens-contract's cited lines (:2571/:2595/:1246/:2772).
- The Garden's source, "amendment 1.3", is absent from the repo (0.2).

---

## Fidelity manifest (PROTOCOL §2), derived from the two mockup files

**The Lenses page** (`praxis-lens-sheet.html`, `pageHtml`)
1. Header: Back (44 px circle, chevron) + "Lenses" (serif 30 px). Back returns to origin.
2. Her state band `.ystate`: umber ground, on-night ink, Yumi seed 40 px, italic serif 16 px line + mono 11 px caption.
   - 2a under: "Lenses come once your shelf holds five books. It holds N." / "NAME YOUR OWN ANY TIME"
   - 2b reading: "Reading across your shelf…" / "USUALLY A FEW SECONDS · N BOOKS"
   - 2c nothing: "Yumi didn’t find clear lenses this time — your shelf may be small or wide-ranging." / "NAME YOUR OWN BELOW · OR ASK HER AGAIN AS IT GROWS" + ghost "Ask Yumi again"
   - 2d quiet: "Nothing new from me. Every thread I found is taken up, waiting, or remembered as not this." / "SHE READS AGAIN WHEN YOUR SHELF CHANGES"
   - 2e daily limit: the `aiLimitMessage` line verbatim. **Not drawn in the mockup; from contract §4. DEFERRED-to-contract, built as 2a's shape.**
3. No-yes card `.consent`: eyebrow "Before she reads"; h3 "Yumi hasn’t read your shelf."; p "One yes lets her read your titles — never what’s inside a book — and offer lenses. You can read the full list any time on What Yumi Sees."; pill "Yes, bring my books" (→ the one-yes sheet); quiet "Not now". PROPOSED copy (S14).
4. "FROM YUMI" eyebrow (gold-ink mono 11 px caps) + "N offer(s)", then the offer card inline.
5. Offer card `.offer-card`: card ground, 20 px radius, card-hi shadow.
   - 5a "Yumi’s offer · n of N"
   - 5b mark (formSvg, xl) + italic serif 20 px name
   - 5c "RESTS ON N BOOKS · TAP A COVER FOR HER CLAUSE"
   - 5d covers row: 58×84 px, horizontal scroll; title serif 9.5 px + author 8.5 px on the cover colour
   - 5e clause card on tap (`.clause`, card-2, italic serif)
   - 5f "HER READING": lead (ink) + clauses (ink-2) + close (ink)
   - 5g "THE QUESTION SHE WOULD HOLD FOR IT · NOT FOR ANSWERING HERE" + italic serif 17 px question
   - 5h three theme chips: outline pill, bold key + the rest
   - 5i after a say-back: "WHAT YOU SAID BACK" + quoted lines with a gold left rule; the name follows the round
   - 5j 2×2 grid: pill "Take it up" (the only gold) · ghost "Later" · ghost "Not this" · ghost "Not quite — talk it through"
   - 5k "Not this is remembered: she won’t offer it again while these books are on your shelf. Later never expires."
6. LATER: eyebrow + "N set aside · never expires"; rows `.lrow` (60 px: mark 36 px, italic name, small lead + "N books.", chevron). A row opens a sheet: "Set aside for later", mark + name, "N BOOKS · WAITING AS LONG AS YOU LIKE", lead, pill "Take it up" + ghost "Not this".
7. YOUR LENSES: eyebrow + "N kept"; rows with mark, italic name, and small "From Yumi · N books · <q>" or "Yours · N books" → the lens sheet. Empty: "None yet. Name your own below."
8. Fold: "Remembered as not this · N" (⌄/⌃, `aria-expanded`). Rows read "<name> · <when> · you said “…”" with a txtbtn "Let her forget this". Fine print: "She won’t offer these again while their books are on your shelf. Forgetting lets her." Toast: "Forgotten. She may offer <name> again." + Undo.
9. Ghost "Name your own" (the live create flow).
10. Next line: "→ Open Lens — one page per lens — opens with the Day Three rooms (L4b)."
11. Toasts:
    - take: "Kept. <name> is yours now; her question stays pinned to it."
    - later: "Set aside. It waits in Later, as long as you like."
    - not this: "Not this — remembered. She won’t offer <name> again while these books are on your shelf." + Undo, 6 s
12. Layout: at 390 the tab bar shows with Home current; at 1360 the column is centred at max 680 px.

**The lens sheet** (`sheetHtml`)
13. Handle; top row: mark (xl) + italic name + close × (44 px).
14. Count: "FROM YUMI|YOURS · N BOOKS · N READ · N NOTES" (left-outs excluded).
15. "YUMI’S QUESTION · PINNED TO THIS LENS" + italic question (only if `q`).
16. "HER READING": lead + clauses (left-outs drop theirs) + close.
    - 16a A lens of your own she hasn't read: "She hasn’t read this one. It is yours as you named it." + ghost "Ask Yumi to read it".
17. "THE BOOKS IN IT · TAP ONE[ FOR HER CLAUSE]" covers; the picked cover gets a gold outline and `aria-pressed`.
18. Clause card: her clause, or "<title> — in this lens because you put it there."; then "<title> · read|unread[ · left out]" and a txtbtn "Leave out of this lens" or "Put it back".
    - Disabled at two books, with "A lens rests on at least two books."
    - A left-out cover drops to opacity .35 with a dashed edge.
    - Toast: "Left out. <title> stays on your shelf; the lens rests on the rest." + Undo.
19. "WHY YOU KEEP RETURNING TO IT" + italic `why` (only if set).
20. "WHAT YOU SAID BACK · KEPT WITH THE LENS": quoted lines + "Yumi quotes these when she reads this lens." + "Let her forget this". Toast: "Forgotten. She no longer quotes what you said to this lens." + Undo.
21. Pill "Open lens" (door toast) + ghost "Not quite — talk it through" (her lenses only).
22. Ghost "Rename" + txtbtn "Let it go".
23. Confirm card: "Let this lens go?" / "Its N books stay on your shelf.[ Your words to this lens stay in Yumi’s memory; you can forget them on What Yumi Sees.]" / pill "Let it go" + quiet "Keep it". Toast: "Let go. Its books stay on your shelf." + Undo.
24. At 1360 the sheet docks right, 440 px.

**The say-back, in Yumi's panel with the lens pinned** (`panelHtml`)
25. Sticky head: mark (sm) + italic name + "N BOOKS · HER FIRST READING, AS IT STOOD" + the first reading (lead + close).
26. Her turn (seed): "What are these books for, to you?"
27. Your line as a bubble (card-2, italic serif, quoted).
28. Her re-reading: "You told me: “…”" + lead + close + italic question. On the last reading only, while fewer than 2 lines have been written: a gold chip "Call it *<name>*" + a chip "Name it yourself" (which turns into the name line).
29. After two lines: "Three readings is enough from me. The name is yours.[ Her last question is held with the lens.]" + the name line (max 60, ✓ button).
30. Input line: placeholder "Write back, one line…" or "Say more…", counter "0/140", gold send →. Enter sends; Escape goes back to the sheet.
31. Fine print: "Her claims stay about the books. What you write is kept with the lens; you can forget it on What Yumi Sees."
32. Foot: pill "Keep it" + ghost "Back to the lens". Toasts: "Kept. What you said back stays with the lens." / "Kept as <name>. What you said back stays with the lens."
33. At 1360 the panel docks right, 460 px, full height. Night ground, with terracotta as Yumi's alone.

**The Home sky** (`praxis-lens-sky.html`)
34. Rail: "praxis" wordmark + Search pill + avatar (the bloom of your kept looks).
35. Mono date eyebrow; serif greeting "Good morning|afternoon|evening, <name>."
36. Field: `canvas.paint` (the current); `svg.bg` with `[data-stars]` + `[data-threads]`; orbs (Garden forms, italic names); the centre flower `[data-core]`, labelled "Your centre. Hold it for your sky’s settings."
37. Honest line or hint:
    - 1 lens: "Your first lens, around your flower · tap it"
    - N lenses: "N lenses around your flower · tap one"
    - 0 books: "The seed waits for your first book." + a Begin card
    - under the floor: "Lenses come once your shelf holds five books. It holds N." + quiet "Name your own"
    - reading: "No lenses yet. Yumi is reading across your shelf." + "Lenses ›"
    - nothing clear: "No lenses yet. Yumi didn’t find clear ones this time." + "Name your own" · "Ask Yumi again"
    - books but no lens: "No lens yet. Name your own, or ask Yumi to read across your shelf." + "Lenses ›"
38. Counts: "N books · N lenses · N notes" (mono).
39. Door line, shown only when something waits: "Yumi has an offer for you · N waiting in Later · Lenses ›".
40. Paper below: the live paper. The Yumi row goes after the yes (F3).
41. Hold 500 ms, or Enter/Space, opens the "Your sky" sheet:
    - Threads switch: "Join lenses that share a book"
    - Names switch: "Show each lens’s name; off, names come on touch"
    - Lenses row with counts ›
    - "Hold the flower any time to come back here."
    - The `praxis_sky_stats` readout line (gate only)
42. A tap on an orb opens the lens sheet.
43. At 1360 the sky is a sticky 600 px left column; the paper sits right at max 640 px; the tab bar is hidden.
44. Day: the sky stays dark (the lamp on #2B1E12) and only the paper turns light. Night: the Pool.

**You**
45. Rail "praxis" + "YOU"; avatar + name (serif 34 px) + "Reading here since <date> · N books".
46. Segmented control: Lenses · Categories · Marks (`aria-pressed`).
47. Hints:
    - lenses: "Your galaxy, in lens mode: N lenses around your flower · tap one"
    - categories: "Your shelf by category: N categories around your flower · sized by books · tap one to open the shelf there"
    - marks: "Your marginalia: N notes on M books · sized by notes · a marginalia · b questions · c journal"
48. A category orb opens the Shelf filtered; a marks orb opens the Notebook filtered to that book. Neither statistics mode draws threads.
49. The live You paper below is unchanged.
