# The L4 lens engine contract

Seventeenth sitting, 9 November 2026 (Fable 5.1, the L4 design chat). Deliverable 3 of four. Binds the L4 build (Opus in Claude Code). Extends — never replaces — `lens-contract.md` (thirteenth r6: fields, offers doc, let-go memory, the seven PASS proofs); where this file and that one touch, that one's additive-only rule (r14) governs. Verified against the repo at HEAD c6a32eb (v3.316), not memory; every live reference below carries its file and line.

What this covers: §1 what Yumi is sent · §2 what comes back · §3 the eval · §4 the consent gate · §5 cost against the 300/day ceiling · §6 the iPhone motion gate · §7 the exact lines that change · §8 the sky engine the build lifts · §9 PASS proofs added to lens-contract §7.

## 0 · Ground, verified live

| Piece | Where today | What it does |
|---|---|---|
| Lens generation | `js/yumi-brain.js:874–1063` (`LENS_GEN_SYSTEM`, `gatherLensLibraryMetadata`, `buildLensGenUserMessage`, `generateLenses`) | One-shot call; library as a numbered list of title · author · genre tag; lenses they have; declared values. Returns `[{name, why, books:[ints]}]`. |
| The eval | `js/yumi-brain.js:1121–1178` (`evalLensResponse`) | Parse → structural → blocklist (`LENS_GEN_BLOCKLIST` :1065) → value collision (`nameCollidesWith`) → index grounding, distinct, in bounds → ≥2 books or drop → cap 5. Fail-safe `[]`. |
| The library cap | `VALUE_RETROFIT_MAX = 240` (:1229), `prioritizeValueBooks` | Engaged books first when a shelf is over 240. Preston's 148 never trips it. |
| The caller | `js/yumi-ui.js:1795` (`startLensSuggest`), the lens panel `renderLensPanelBody` :2060+ | In-memory offers; Not this is a splice (:1850); the switch `praxis_lens_ai_suggestions` (ls, default true, :1785). |
| The gate | `js/yumi-brain.js:87, 817` → `consent_required` unless `isYumiYesGranted(uid)` (`js/state.js:1428`, `profile.yumiYes === 'granted'`) | No call leaves without the one yes. |
| The proxy | `netlify/functions/claude-proxy.js:27, 32, 79` | `ALLOWED_MODELS = {'claude-sonnet-4-6'}` (J4); `MAX_OUTPUT_TOKENS = 4096` clamp; the per-uid ceiling before body parse, fail closed. |
| The ceiling | `netlify/functions/lib/ceiling.js:44, 323` | `PRAXIS_AI_DAILY_CAP` default **300 calls per uid per UTC day**; refusal `{code:'daily_limit', limit, resetAt}`; the client labels the reset in local time (`aiLimitResetLabel`, yumi-brain.js). |
| Book metadata | `js/state.js:171 (genre), 413 (category), 499 (SHELF_CATEGORIES)` | `genre` is the free tag; `category` is one of the 17 (or Uncategorized). The live payload sends `genre`. |

## 1 · What Yumi is sent

**Model** `claude-sonnet-4-6` (the only model the proxy allows; J4 pins it). **`max_tokens` 800** (L4 hotfix 2, ruled by Preston 14 Nov 2026, R1–R2; was 1000 at v3.318, 1600 at v3.317, 1024 before): the ruled reading is longer per lens — lead, one clause per book, a close, a question, three themes — about 350–450 output tokens each on the live evidence (above the earlier 190–280 estimate), so two lenses of at most five books ≈ 700–900; 800 caps the call's time and sits under the proxy's 4096 clamp. A reply cut at 800 keeps every lens that arrived complete (§3 step 2). Why: at five lenses of up to eight books, three real reads on v3.317 ran 30.09 / 30.58 / 30.22 s and were cut off by claude-proxy's 30 s limit (504); at three lenses and 1000, reads on v3.318 completed (23.25 / 22.83 / 30.30 s, 200) and were then discarded as unreadable. This is a stopgap: the two-step read (R5) replaces it. Both lens callers set it; the proxy's clamp still applies.

**System prompt** — `LENS_GEN_SYSTEM` is rewritten to the ruled voice (seventh §F; tenth r2; the sixth sitting's "her claims stay about the books"). Normative text, to land verbatim in yumi-brain.js:

> You are Yumi, a reading companion inside Praxis. You are grounded in critical pedagogy — Freire, hooks, Lorde — and you hold that a reader naming their own intellectual world is itself an act of freedom. You are not a recommender and you do not sort books into market genres.
>
> You are given a reader's shelf as METADATA ONLY: a numbered list of books (a 1-based number, then title, author, and the shelf's category), the names of lenses they already keep, lenses they have already set aside or declined, and any values they have declared. You are not given their notes, marginalia, journal or anything from inside a book, and you never ask for them.
>
> Read across the whole shelf and offer up to two LENSES: ways of seeing it, named in the language of ideas, not bookstores ("Technologies of liberation and oppression", not "Technology"). A lens rests on at least two books and at most five.
>
> Speak about the BOOKS, never about the reader. You may be sure about the shelf — what these titles do when set side by side — and you may ask the reader a question. You may not claim anything about the reader's inner life, habits, feelings or motives: never "you keep circling", "you seem drawn to", "you love", "you tend to", "you have been". The one exception is quoting their own words back when they are given to you under "The reader said", marked "You told me: …".
>
> For each lens return: name (a few words, precise, in the spirit of critical pedagogy); lead (one sentence, sure about the shelf, about what these books do together); clauses (one short clause per cited book, by its number — what that book does in this lens, from its title and author only, never its contents); close (one sentence that brings them together); q (one question the lens would hold for the reader, ending in a question mark); themes (three short key phrases, each a key word and a few words after it); books (an array of the 1-based numbers cited, 2 to 5, only numbers from the list).
>
> Keep every line short. The app drops a whole lens when one line runs long: lead at most 180 characters, each clause at most 100, close at most 130, q at most 100. A quoted "You told me: …" sentence does not count toward the lead. Each theme key is one to three words.
>
> Never propose a lens that duplicates or lightly rephrases a value they have declared, a lens they keep, or one they set aside or declined. If the shelf is too small or scattered for honest lenses, offer fewer, or none. Warmth over cleverness.
>
> Return ONLY a JSON array, nothing around it:
> `[{"name":"…","lead":"…","clauses":[{"i":3,"c":"…"}],"close":"…","q":"…?","themes":[{"k":"…","t":"…"}],"books":[3,17]}]`

**User message** (`buildLensGenUserMessage` v2), in this order, nothing else:
1. "Here is the reader's shelf (metadata only), numbered:" — one line per book: `N. "Title" by Author [Category]`. **Category, not genre** (the shelf shows categories; the covenant line says so). Capped at 240 as today, engaged books first.
2. "Lenses they keep:" — kept lens names only.
3. "Lenses already offered — do not offer these again:" — the names of open, Later and declined offers from `/userLensOffers/{uid}` (contract §2). New.
4. "Values they have declared (commitments, not lenses):" — value names, as today.
5. For a **re-reading** (the say-back, tenth r1): the one lens as a numbered sub-list of its books, its current name, lead, close and question, then "The reader said: "…"" (the line, ≤140 characters) and the instruction "Re-read these books through what the reader said. Keep the same books. Quote the reader's line once, as "You told me: …". Return ONE lens object with a new name, lead, close and question." Nothing else from `said[]`.

**Never sent:** notes, marginalia, journal, the `why` line, `said[]` beyond the one line of the round, covers, the chat transcript, titleToId, any id. The payload is provably metadata-only (the live gather already keeps `titleToId` out: yumi-brain.js:950).

**Size on the 148-book test library:** ≈ 148 × 18 ≈ 2,700 input tokens for the list + ≈ 700 system + ≈ 100 names ≈ **3,500 in**, ≤ **800 out** per generation; a re-reading ≈ 1,100 in, ≤ 400 out.

## 2 · What comes back, and what the build keeps

The model returns the array in §1. The eval (§3) turns each survivor into an **offer** per lens-contract §2, which gains the ruled reading's parts as optional fields (additive, r14):

```
offers.<id> = { id, name, bookIds: [], leftOuts: [],
  lead, clauses: { <bookId>: '…' }, close, q, themes: [≤3 {k, t}],
  reading,                       // kept for back-compat = lead + ' ' + clauses in book order + ' ' + close
  round: 1..3, said: [{t, at, round}], names: ['…'],   // names = her name per round, so "Use her words" can restore any round
  look: { pi, c:[2], pw, form:{R,t,rev,kind,motif,rot,ay} },
  state: 'open'|'later'|'declined', createdAt, decidedAt }
```
Taking up copies every one of these onto `userThemes[id]` (`origin:'hers'`, `hersName` = the round's name, `q` = the round's question, `reading`, `lead`, `clauses`, `close`, `themes`, `leftOuts`, `said`, `look`, `keptAt`). The lens sheet (deliverable 2) reads `lead/clauses/close/q/said/why/look`; the offer card adds `themes`; the sky reads `name/look/origin/bookIds.length`; What Yumi Sees reads `said` and `lensWords` as before.

`look` in the L4 edition is `{ pi, c, pw, form }` — the Garden index replaces `hue/L` (ruling 82: Garden only). `hue` and `L` stay optional and untouched where an old record carries them; a record with `look:null` or no `pi` is derived once on first draw with `PraxisHand.makeLook(name, looksAlreadyInTheSky)` and stored. **Stored, never re-derived**: a rename, a regeneration, a re-order keeps it.

## 3 · The eval — `evalLensResponse` v2, client-side, in this order

Fail-safe `[]`; never throws; a parse failure is the error state ("Yumi couldn't reach for lenses just now." + Ask Yumi again), never silence (LENS-1 stands).

1. **Gate before the call** — no generation request at all when the shelf holds fewer than **5 books** (the offer floor, seventh r4): the Lenses page shows "Lenses come once your shelf holds five books. It holds N." No call, no ceiling spent.
2. **Parse** with `parseValueRetrofitArray`; accept the old `{name, why, books}` shape too (map `why` → `lead`, no clauses, no close) so a stale cache or a fallback reply still grounds — but such a lens is marked `thin:true` and never offered without a clause per book (step 6), so in practice it is dropped. **A reply cut off (L4 hotfix 2, R3):** only after the three existing parses fail (whole text; first `[` to last `]`; first `{` to last `}`), the generation parse walks from the first `[` tracking nesting depth and skipping quoted strings, collects each top-level `{…}` that closes, parses each on its own, and keeps them if there is at least one. A kept lens then passes every step below unchanged. When the reply's `stop_reason` is `max_tokens`, one line logs `[L4-eval] truncated: kept N` (N = complete lenses recovered). Lens replies only; `parseValueRetrofitArray` and the value retrofit are unchanged.
3. **Structure**: `name` non-empty string; `books` an array; `lead`, `close`, `q` strings; `clauses` an array of `{i, c}`; `themes` an array (missing → `[]`).
4. **Name**: not in `LENS_GEN_BLOCKLIST`; not colliding with a declared value (`nameCollidesWith`, VL-1 kept); **not the same lens as** a kept lens, an open offer, a Later offer or a declined offer — same lens = the same name ignoring case OR at least two-thirds of its books shared (lens-contract §2). A collision with a declined offer is logged `[L4-eval] declined-twin dropped`.
5. **Grounding**: 1-based indices → distinct, in bounds, canonical titles → bookIds via `titleToId`; **fewer than 2 books → drop**; more than 5 → keep the first 5 cited (L4 hotfix R2; was 8).
6. **Clauses cover the books**: a clause whose `i` is not a cited book is discarded; a cited book without a clause is removed from the lens; if that takes the lens under 2 books it is dropped. Clause ≤ 140 characters, lead ≤ 220, close ≤ 160, q ≤ 120 and ending in `?`, theme key ≤ 3 words; over-length fields are dropped with the lens (a truncated reading is not offered). **The limits Yumi is TOLD sit below these caps on purpose** (L4 hotfix 3, 14 Nov 2026; §1's "Keep every line short" paragraph): lead 180 / clause 100 / close 130 / q 100 against the caps 220 / 140 / 160 / 120, so a reply that overshoots what it was told still clears the eval. The theme key is told the cap itself (one to three words). Why: v3.319's one complete lens was dropped at `length: close` ("Conjured Knowledge: Vernacular Traditions as Epistemology") because the prompt stated no lengths at all.
7. **The voice law, linted**: a lens is dropped if `lead`, any clause, `close` or `q` matches the reader-claim list (case-insensitive, word-bounded): `you keep`, `you seem`, `you('re| are) drawn`, `you love`, `you want`, `you feel`, `you tend`, `you('ve| have) been`, `you circle`, `you return`, `your heart`, `your (mind|soul|life|habit)`, `you need`, `you always`, `you never`. Exempt: a sentence beginning `You told me:` in a re-reading. Dropped lenses are logged `[L4-eval] voice: "<phrase>"`. The live `why` field's "you keep circling…" is the exact thing this catches.
8. **Cap**: at most 2 offers per generation (L4 hotfix 2 R1; 3 at v3.318, 5 before); a third and later lens is dropped and logged `[L4-eval] cap: <name>`; if fewer than the cap survive (one, at a cap of two — hotfix 2, D-2), the sparse line shows (live copy, kept: "One clear thread so far — more will surface as your shelf grows." / "A couple of threads so far…"); none → the live "didn't find clear lenses" line.
9. **Colour** (how a lens gets its Garden colour and keeps it): at offer creation, `look = PraxisHand.makeLook(name, looks)` where `looks` = the looks of every kept lens plus every open and Later offer (so the sky's colours stay distinct up to the Garden's 17; past 17 the least-used colour from the hash onward). The **≥3:1 clamp** is inside `makeLook` via `gardenColour(pi)`: the flat colour is stepped toward `#FFF1D2` in .05 until it reads ≥3:1 on BOTH skies (`#1C120A` night, `#2B1E12` day). Measured on the Garden: only Inheritance clamps (`#9C4A6E → #A15273`, t .05 → 3.48 night / 3.06 day); the lowest unclamped are own-6 `#2F7F9E` (4.08 / 3.59) and Power, named `#D4472F` (4.16 / 3.66). Stored on the offer; carried unchanged onto the kept lens. **Across regenerations**: an offer that is the same lens (step 4's test) as an open or Later offer is not re-created, so its colour stands; a declined twin is never shown; a new lens takes a new colour. A rename keeps `look`.
10. **The Garden** is `PraxisHand.GARDEN` — amendment 1.3's ten presets then its seven "more", in that order (17). The Day Three copy carried 11; this is the full set. The six "own" slots beyond the ten are colours, not names: a lens's name is always its own.

## 4 · The consent gate it sits behind

- **One yes.** `aiProxyRequest` rejects with `consent_required` unless `isYumiYesGranted(uid)` (yumi-brain.js:87, 817; state.js:1428). L4 adds nothing in front of it and removes the parallel switch: `praxis_lens_ai_suggestions` (yumi-ui.js:1785) is **retired** — the yes is the switch (consent copy: "What changes: Granted … lens offers can be made; Not now … no offers"). Its line "Yumi's lens suggestions are off. Name your own below." goes (§7).
- **Yumi reading along is off by default for new accounts** (consent copy; state.js:1452/1477/1647 default flips in L3). The lens call does not depend on it: lenses are metadata-only and need only the yes. The build must not gate lenses on `yumiReadsAlong`.
- **No yes → no call, no stamp.** `yumiMarkLensNamesSent` (yumi-brain.js:1021) stamps "names sent" only when the call will leave; L4 extends the stamped set to the offered names it now sends (§1 item 3) so What Yumi Sees's row stays true.
- **Withdrawing the yes** (What Yumi Sees switch): she stops reading and offering; open and Later offers stay in `/userLensOffers` but are not shown as hers to decide until the yes returns (they are hers); kept lenses stay (lens-contract rule 2). No automatic re-read fires while the yes is off.
- **The ceiling is part of the gate**: `ceiling.enforce` runs before body parse and fails closed (claude-proxy.js:79). A `daily_limit` refusal shows the live line (`aiLimitMessage`, yumi-brain.js:136): "You’ve reached today’s limit for Yumi. It resets at 6:00 PM." — kept verbatim in her state line on the Lenses page, the reset in the reader’s local time.

## 5 · Cost per generation against the 300/day ceiling

One generation = **one call** (today, and still). Per call on the test library: ≈ 3,500 input + ≤ 800 output tokens (§1; L4 hotfix 2 R2, was 1,000 at v3.318 and 1,600 at v3.317). A re-reading ≈ 1,100 in + ≤ 400 out, one call each, at most two per offer (tenth r1: three readings is enough).

| Event | Calls | Trigger |
|---|---|---|
| First read (after the yes, shelf ≥ 5) | 1 | The walk's lens stop or the Lenses page's first open |
| Ask Yumi again | 1 | The reader, from the Lenses page |
| Automatic re-read | ≤ 1 per UTC day | The shelf has changed by ≥ 5 books or ≥ 10 % since `lastReadBookCount`, AND ≥ 24 h since `lastReadAt` (both on `/userLensOffers/{uid}`); runs when the Lenses page or Home opens, never in the background |
| Say-back re-reading | 1 per line, ≤ 2 per offer | "Not quite — talk it through" |
| Ask Yumi to read a lens of your own | 1 | From the lens sheet (S12) |

A heavy reader's day — a first read, two Ask-agains, four say-back lines, two own lenses read — is **9 calls, 3 % of the ceiling**. Yumi's other calls (the panel, Capture, the sorter) share the same 300; the lens engine must never loop (no retry on parse failure without the reader's tap; the error state is the retry). Dollars are the proxy's business: the build reports token counts from the response's `usage`, not estimates.

## 6 · The iPhone motion gate — PASS before the sky lands live

The sky is never still (seventh r9). Before it ships, a **10-minute check on Preston's installed PWA (iPhone, Safari standalone), Home, night, the test library**, three runs on a charged phone with no other apps in the foreground, brightness fixed:

| Run | Screen | Pass line |
|---|---|---|
| A · baseline | Live v3.316 Home (no sky), 10 min screen-on, idle | — (reference) |
| B · the sky | L4 Home, 8 lenses, threads on, 10 min idle | Battery drop within **+2 percentage points** of A |
| C · the full sky | L4 Home, 16 lenses (two rings), threads on, 10 min idle | Battery drop within **+3 points** of A; the back of the phone not warm to the hand at the end (Preston's call, written down) |

Frame rate, measured by the engine itself, not by eye: L4 adds `PraxisHand.stats()` → `{ frames, seconds, fps, worst1s }` from the one rAF loop. Pass: **mean ≥ 55 fps and no one-second window under 45 fps** during B and C (read from the console, or a hidden long-press-on-the-flower stats line in the sky sheet on Preston's account only). Thermal: iOS gives no API; the proxy is the frame rate (throttling shows there first) plus the hand on the back.

Also proven in the same session: the loop stops when the tab is hidden (`document.hidden`) and when the sky is scrolled off (`S.visible()`); **Reduce Motion on the phone stills the canvas and every CSS animation** (one screenshot each of Home and You under it); the canvas is capped at devicePixelRatio 2 (`Flow.init`). If B or C fails: halve the particle density (`W*H/760` → `/1500`), lengthen the orbit period, and re-run; if it still fails, the sky ships with motion off by default behind a `praxis_sky_motion` key and the gate is re-run in L4b. The gate's three runs and their numbers go into `docs/checkpoints/l4.md`.

## 7 · Where the live panel's voice differs from the ruled voice — the exact lines

| Live (file:line) | Ruled | Change |
|---|---|---|
| `LENS_GEN_SYSTEM` — "why (one or two sentences, spoken to the reader — "you keep circling…" — naming what you see WITHOUT summarizing any single book)" (yumi-brain.js:899) | seventh §F; tenth r2 | Replaced by the §1 prompt: lead · clauses · close · q · themes; the reader-claim ban; "You told me:" the one exception. |
| `[{"name":"...","why":"...","books":[3,17]}]` (:916) | §2 | The new return shape; `why` is gone from the prompt (the reader's own `why` line is a different field, never sent). |
| "Yumi's suggestions" (yumi-ui.js:2059) | ruling 86, S13 | "From Yumi" on the Lenses page; the panel section goes. |
| "Name it" (:1928) | ninth §A3 | "Take it up" (the only gold). |
| "Rename" (:1934), "Not this" (:1940) | stand | Unchanged. "Later" and "Not quite — talk it through" are added (ninth §A3; eleventh r4). |
| `lens.books.join(' · ')` (:1919) | ninth §A3 | Covers, with her clause on tap. |
| "Yumi's lens suggestions are off. Name your own below." (:2064) | §4 | Removed with the switch. The no-yes state shows the proposed door (S14, consent copy, L3 to ratify). |
| "Reading across your shelf…" (:2074) | ninth §A5 | Kept; the Lenses page adds "USUALLY A FEW SECONDS · N BOOKS". |
| "Yumi couldn't reach for lenses just now." (:2079) + "Ask Yumi again" (:1891) | stand | Unchanged. |
| "Yumi didn't find clear lenses this time — your shelf may be small or wide-ranging. Name your own below." (:2086) | ninth §A5 | Kept on the Lenses page; Home says only "No lenses yet. Yumi didn't find clear ones this time." with the door (ruling 86). |
| "One clear thread so far — more will surface as your shelf grows." / "A couple of threads so far — …" (:2096–97) | stand | Unchanged (claims about the shelf, not the reader). |
| "Yumi proposes these from your titles, authors, and genres only — never from inside your books." (:2108) | §1 | "…titles, authors and categories only…" — the payload now carries the category. |
| (none) | ninth §A5 | New on the Lenses page when all is decided: "Nothing new from me. Every thread I found is taken up, waiting, or remembered as not this." |
| (none) | lens-contract §2 | New toast on Not this: "Not this — remembered. She won't offer <name> again while these books are on your shelf." + Undo (6 s). |

## 8 · The sky engine the build lifts

`hand.js` (L4 edition, published with both mockups; md5 recorded in the carry) is the one engine. The build lifts it as `js/hand.js`, unchanged except: nothing. Its host contract: a `.sky` element holding `canvas.paint`, a `[data-field]` with `svg.bg > [data-stars] + [data-threads]`, a `[data-core] > svg[data-bloom]`; the host CSS from the mockup's `/* THE SKY */` block (orb, label, threads, the keyframes, the reduced-motion rule) lifted as `css/sky.css`. Load order: after state (it reads nothing from state; views call it), before views. Public surface: `Sky(host,{compact}) → set(items, shares, keptLooks) · toggles({threads,names}) · build() · tick()`, `startSkies()`, `makeLook`, `formSvg`, `bloom`, `yumiSeed`, `bloomSvg`, `gardenColour`, `sizeFor`, `contrast`, `GARDEN`. Items: `{name, look, books, state, size?, aria?}`; `shares`: `[[i, j, sharedBooks]]`. Design calls S1–S9 (sizes, rings, names, threads) are in the engine, not the views.

## 9 · PASS proofs the build adds to lens-contract §7

8. **The eval set**: a fixture of 12 model replies (3 clean, 2 old-shape, 2 with reader-claims, 1 declined twin, 1 under-2-books, 1 over-length, 1 with a clause for an uncited book, 1 unparseable) runs through `evalLensResponse` v2 with the expected survivors and the expected log lines — in the repo's harness, before any live call.
9. **No call under five books**; no call without the yes (proof 7 stands); one call per generation, counted at the proxy (the ceiling's count before and after).
10. **Colour stability**: regenerate twice on the test library; every lens that is the same lens keeps `look.pi`; no two lenses in one sky share a `pi` while the Garden has colours to spare; every `look.c[0]` measures ≥3:1 on both skies (`PraxisHand.contrast`).
11. **The voice lint**: the live prompt's own example phrase "you keep circling" is dropped by the lint; "You told me:" in a re-reading is not.
12. **The motion gate** (§6): three runs, the numbers in `docs/checkpoints/l4.md`, PASS before the push that lands the sky.
