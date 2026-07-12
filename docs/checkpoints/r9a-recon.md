# R9a — Profile / Galaxy · Stage-0 recon

- **Round:** R9a — the MERGED single Profile (DEEP, five-beat). First round born under BOTH the mobile canon AND the desktop canon.
- **HEAD at recon:** `91fe74b` · **origin/main:** `91fe74b` (0/0 — clean, nothing to push).
- **Tree:** clean of tracked changes (`git status --porcelain --untracked-files=no` empty; only Preston's pre-existing untracked scratch present, as at session start).
- **Live cache:** `praxis-v3.197` (sw.js:10). Hook gate **ARMED**, FIX-PROTOCOL v1.2 live, 7 agents present.
- **Recon method:** 5-thread parallel read-only workflow (`wf_a59b8bbf-8dd`) + direct grep/ranged-view backfill. **Evidence-provenance note:** Thread 1 (account page) ran full (20 tool calls, 145k tokens) but returned a degenerate `"test"` stub; Thread 3 (routing) hit the StructuredOutput retry cap. **Both territories were re-derived by direct recon** (greps + ranged views cited inline below) — no gap left uncovered. Threads 2/4/5 returned clean anchored evidence.
- **Date:** 2026-07-12.

---

## STAGE-0 FIRST CHECKS — all PASS

| Check | Expected | Result |
|---|---|---|
| `sh tools/ground-truth` | HEAD 91fe74b, hook armed, v1.2 | ✅ HEAD `91fe74b`, gate ARMED, FIX-PROTOCOL v1.2, 7 agents |
| HEAD == origin/main | equal | ✅ `91fe74b` == `91fe74b` |
| tracked tree clean | clean | ✅ empty porcelain (tracked) |
| sw.js CACHE_VERSION | v3.197 | ✅ `praxis-v3.197` (sw.js:10) |
| sequence.md | R9 = Now, R9a locked shape | ✅ Now = R9 Profile/Galaxy · R9a merged Profile (sequence.md:271-281) |
| Desktop canon + recon read | D1–D6 + evidence base | ✅ `praxis-desktop-canon.md` (117L) + `desktop-recon.md` (388L) |
| Mobile canon read | P1–P9 | ✅ `praxis-mobile-canon.md` (207L) |
| **Mockup pair — Universal :root** | 14-token block | ✅ BOTH `design/praxis-profile-galaxy-mockup.html` + `design/praxis-design-canon.html` carry the identical 14-token Universal `:root` (paper·surface·surface-2·ink·ink-2·ink-3·line·gold·gold-deep·gold-hi·lum-gold·ember·radius·night-line) + the 10-hue `--field-*` spectrum + the scoped `.galaxy-night`. **Both are COMMITTED (tracked)** — not among the untracked scratch. Re-skin verified. |
| r8-values-recon §6 read | value-load contract + re-home | ✅ `docs/checkpoints/r8-values-recon.md:106-122` |

**Mockup path correction (mechanical, carried silently per the fork rule):** the round prompt expected the mockups **uncommitted among untracked files**; `git ls-files` shows **both are tracked** (committed, clean). The substance the prompt needed — that each `:root` is the 14-token Universal block — **holds**. No STOP: the concern was "missing or un-reskinned"; they are present and re-skinned. Recorded here, not escalated.

---

## 1. THE MERGE TARGET — two self-pages, mapped

### 1.1 `#account` — `renderAccountPage` (views.js:17680 → ~19050) — the INSTRUMENT
Route arm: `parts[0]==='account'` → clears book/arc/sub pointers → `renderAccountPage()` (views.js:632-638). Scoped `.account.lum-amber-ember`. Signed-out → sign-in prompt (views.js "Sign in to manage your account.").

Section order top-to-bottom (all `.account-card`, all token-scoped, ES3-built):
1. **Hero** — monogram + displayName + tagline + "Publishing as " + penName, `_heroPencil` inline edit.
2. **Discoverability links** — `.op-account-link` ×2: "View your public profile →" (`#profile`, views.js:17823) + "Explore the commons →" (`#commons`). *(This is the left-x=32 element the desktop-recon flagged — it is Account-page chrome, `display:inline-block` no position; the x is column padding, NOT a pinned breadcrumb. `#profile` itself has none — Thread 2.)*
3. **Stance line** (`.portrait-stance`) — the covenant one-liner: *"Everything below is yours. Yumi offers; you decide what it means."*
4. **VALUES card** (`.account-values-card`) — declare row + `.account-vlist` of stones; `accountValuesCollect/Persist/Rename/MakeRow`; `setProfile(uid,{values:…})`. Note: *"You place these — you always accept, rename, or wave away. Yumi may notice values your shelf carries, but never fills them in for you."*
5. **RETROFIT** (`.account-retro`) — "Ask Yumi to notice values in your library" → eval-gated offer cards with **"Add this value" / "Rename" / "Not this"** + verbatim covenant copy (metadata-only). *(The R8 Yumi retrofit — this is the fuel-generator Preston runs before the felt pass.)*
6. **Portrait OFFER cards** (`.portrait-offer[data-offer]`) — the INSTRUMENT DNA: lens/category offers with chips **"that's it" / "rename ✎" / "reject"** (views.js ~18342 `renderPortraitDialog`). Drives `generateLenses`/`evalLensResponse`/`gatherLensMetadata`.
7. **FIELD card** (`.portrait-field-wrap`) — soft regions + tension points ("tap one").
8. **GALAXY card** (`.portrait-galaxy-wrap gal-show-bonds`, `#account-portrait-galaxy`) — "Your reading as a galaxy", axis toggle **categories | lenses**, bonds/counts toggles (GOLD on-state, not cyan). **This is the live galaxy.**
9. **RETURNS** (`.portrait-returns`) — "What your margins keep returning to."
10. **THREADS** (`.portrait-threads`) — reader-model opt-in toggle ("Let Yumi notice" / "Yumi is noticing") + through-line rows with **"This is me" / "Set aside"**; `deleteReaderThread`.
11. **JOURNEY** (`.portrait-journey`) — "How your reading has moved" — milestones from real timestamps, no streaks.
12. **Profile edit form** (`.account-edit-form`) — displayName / penName / tagline (same 3 fields as #profile).
13. **Yumi settings + transparency + "Your data" cluster** (kept **LAST**) + **sign-out** (`signoutBtn` "Sign out" → `signOut()`, views.js:18997-18999).

### 1.2 `#profile` — `renderOwnProfile` (views.js:16569-16885) — the PORTRAIT (owner-only)
Route arm: `parts[0]==='profile'` → `renderOwnProfile()` (views.js:681-688). Scoped `.op-root.lum-amber-ember`, governor **max-width 840px** centered. Signed-out → sign-in prompt (no visitor path here). 81 `.op-*` rules, all `.op-root`-scoped (no bleed).
- **`.op-head`** identity card — displayName + tagline + "Publishing as " penName + `.op-walk` (readers) + `.op-follows`; edit form (`.op-edit-*`) writes the **same 3 fields via the same `setProfile`+`saveProfileToFirestore` path** as #account → **duplication**.
- **`.op-conseq`** (views.js:16739-16756) — "What your thinking has done" / "Your work is load-bearing in **—** other fields." The `<b>` (`cNum`) **inits to em-dash** and sub-copy says *"…appears here once Praxis opens to other readers"* (reads-as-deferred), **yet is wired to real data**.
- **"Your arcs"** grid (`.op-arcs-grid`) — arcs where `userId===uid`, each with idea-marks + per-arc **publish control** `_opPublishControl` (Publish/Unpublish + identity/freshness segments → `publishArc`/`unpublishArc`, views.js:17036-17161). **This is the publish fence.**
- **NO values/stones** here (they live only on #account). **NO galaxy** here.

### 1.3 Owner-vs-visitor TODAY = split at the ROUTE, not a mode switch
- `#profile` → `renderOwnProfile` (owner-only). `#reader/<uid>` → `renderOtherProfile` (visitor). `renderOtherProfile` redirects to `#profile` when `targetUid===user.uid` (views.js:17259) so no one sees a visitor view of themselves.
- **Implication for the locked shape:** R9a's "owner-vs-visitor as two read-modes of ONE page" is a **new construct** — today it is two functions. The visitor mode is *designed but fenced* (publish gate); build the mode switch, wire no social hooks (R11).

---

## 2. THE GALAXY — shipped ontology ≠ R9 target ontology (the round's core design work)

### 2.1 What ships today (`_portraitRenderGalaxy`, views.js:16147)
- **Nodes = book-GROUPINGS** by the current axis: traditions (`book.traditionOverride||book.tradition`) OR lenses (`userThemes` membership). `_portraitAxisData` (15862).
- **SIZE = #books** in the grouping · **BRIGHTNESS = annotation density** · **bonds = shared-note bridges** (a notebook entry spanning 2+ groupings). Explicit DECOUPLE comment: *"stars encode SIZE (#books) + BRIGHTNESS (annotation density) only — never shape-as-category"* (views.js:15842).
- **Render mechanics:** absolutely-positioned `.portrait-star` DIVs (radial-gradient from `PORTRAIT_HUES` var() strings), 34-DIV `.speck` ambient starfield (`Math.random()` each render — non-deterministic), bond filaments as one inline `<svg viewBox="0 0 100 100">`. Layout = JS gravity sim `_portraitGalaxyLayout` (15956), 720×340 virtual box, 440 iterations, returns %-coords.
- **NOT the locked renderer:** the portrait galaxy is a **separate code path** from `renderSubTheoryConstellation`/`renderArcConstellation` (arc-constellation.js, F-D4 locked). The portrait never calls them. **The arc-constellation lock does NOT bind R9's galaxy work** — but that renderer stays off-limits.
- **PraxisMarks (assets/marks.js)** = 16 shapes × 16 colors, but a **hardcoded-hex** palette → using it as-is on the portrait would violate tokens-only. Not used on the portrait today.

### 2.2 R9 TARGET ontology (corrected/canonical, from the round prompt)
- **Bright glinting stars = SUB-THEORIES** (tap → sub-theory page).
- **Faint star-field = books read** (the ground).
- **Planets = FIELDS**, size = books read.
- **Constellation** hub-radiates from the strongest field, n−1 lines, draw-in on select.
- **Value-load = EVIDENCE-WEIGHTED** (marks with why-lines + sub-theories drawing on the value) — **never raw tallies**.

⇒ **The galaxy is re-authored, not re-skinned.** The node semantics flip from book-groupings to sub-theories/fields. The gravity-sim layout, the reduced-motion rig, and the tokens-only DIV/SVG-circle glyph pattern are **reusable scaffolding**; the data feeding them is new.

### 2.3 ⚠ THE FIELDS FORK (Thread 4) — a real data question for SHAPE-A
"Planets = fields, size = books read" has **no arc- or sub-theory-level field today** — only **per-BOOK tradition** (9 canonical: theory/wisdom/empirical/history/memoir/novel/poetry/place/practice + unassigned; `state.TRADITIONS`, state.js:321). The only per-field tally is `tradCount` in `_portraitEmblem`. **Fork:** does the galaxy's "fields" = the 9 book traditions (aggregated display-only, in-guardrail) — OR a new field axis on arcs/sub-theories (a **data-model change**, outside the display-only guardrail)? → **Preston's call at SHAPE-A.**

---

## 3. THE DATA LAYER R9 CONSUMES (ready — R8 landed it)

- **`valueMarks: []`** on **book** (ensureBookFields, state.js:387/420) · **sub-theory** (ensureSubTheoryFields, state.js:644/671) · **arc** (ensureArcFields, state.js:753/772). Each mark = **`{ value:<profile.values slug>, why:<lineage string> }`** (write site views.js:9196). Persisted via each object's EXISTING guarded sync (`markBooks/SubTheories/ArcsDirty`).
- **`profile.values: []`** — declared stones, sanitized to trimmed non-empty strings in `setProfile` (state.js:1410), **never inferred**. Onboarding vocab = 10 presets (intros.js:86: Liberation · Power, named · Dignity · Solidarity · Care · Doubt · Praxis · Inheritance · Hope · Craft).
- **Migration:** chain terminates at **1.29.0** (R8 step 1.28.0→1.29.0, state.js:3429). **TWIN merge path** = integrations.js **:221 (arcs) / :278 (subTheories) / :787 (books)** — *NOT the ~544/~973 the old recon guessed.* Any new field R9 adds must ride BOTH (the twin-trap).
- **Display-only aggregation idioms to mirror:** `_portraitEmblem(uid)` facet-tally (views.js:16396, zero mutation) · `_buildArcSubsIndex()` build-once-per-render (views.js:3451, assigned to `_arcSubsIndex` during renderArcsPage, cleared after).
- **Owned-object enumeration:** books `state.userBooks[uid].bookIds` · arcs `state.arcs[id].userId===uid` · sub-theories `state.subTheories[id].userId===uid` (userId backfilled transitively from arc on merge — confirm present on the galaxy's render path).
- **⚠ No cross-object value-tally exists yet.** R9 must build a NEW display-only per-value aggregation across owned books+subs+arcs `valueMarks` — evidence-weighted, not a count (per the round's law). Watch the **orphaned-slug** case (a `valueMark.value` no longer in `profile.values`).

---

## 4. ROUTING / REDIRECT (Thread 3, direct-recon)

- Dispatch is `parts[0]` string-match (`parts = hash.split('/')`): `'account'`→renderAccountPage (632), `'profile'`→renderOwnProfile (681). **Both are BARE routes — no `parts[1]` read today**, so deep-link param preservation on the `#account` redirect is **defensive/forward-looking**, not currently load-bearing.
- **`location.replace` redirect precedent (R7):** the retired `/marks` route → `location.replace('#book/'+parts[1])` (views.js:521) and `location.replace('#book/'+bookId)` (views.js:8652) — no history push, refresh-stable. **This is the pattern for the `#account` redirect.**
- **Nav:** ONE avatar link → `#account` (index.html:39, `.app-nav-profile data-route="account"`). `#profile` has **no** top-nav link (reached from Account). `activeRoute` lumps `account|profile|commons|reader|walk` → `'account'` (views.js:415-424) so the avatar stays lit across the umbrella. ⇒ redirecting `#account`→the merged page (or repointing the avatar) is low-friction; the active-route highlight already survives.
- **SPA gotcha:** same-`#hash` nav is a no-op (known Praxis trap) — a redirect must change the hash, not re-assign the same one.

---

## 5. THE `.op-conseq` RE-HOME (rides this round, per r8-recon §6)

`loadOwnProfileSocial(uid, cb)` (impl integrations.js:3151) async-patches TWO closure-captured DOM nodes: **`cNum`** (the `.op-conseq` build-on `<b>`, views.js:16872) and **`walkB1`** (the `.op-walk` readers `<b>`, 16871). §6 flags: if R9 reuses `.op-conseq` for value-load, **re-home the social patch**. **PA3:** the em-dash placeholder reads-as-broken on the common (0 / read-fail) case — R9 must render an **honest empty state** for zero value-load, and rewrite the stale "…once Praxis opens to other readers" sub-copy to match a now-live counter. R11 owns the social counters' real home.

---

## 6. DESKTOP-CANON-NATIVE — the amendment's weight

Both self-pages are **fixed-px centered columns with NO upper composition tier** (desktop-recon confirmed: 0 `@media (min-width)` block touches `.account`/`.portrait-*`/`.op-*`; the only 3 min-width blocks are nav pill / shelf rail / shelf toggle). Governors: `#account` 800→**1080** (ember `> *`), `#profile` **840**. At 1920 the account column wastes ~412px/side; profile ~540px/side.

R9a ships the project's **FIRST min-width composition tier**:
- **D1** — at ≥1200 COMPOSE the viewport (second functional region OR justified widened layout; ≥60% occupancy at 1920, or a ledger exemption). The galaxy + the instrument stack is the natural two-region candidate.
- **D2** — prose ≤72ch via the ch-cap idiom. **D3** — no h-scroll at 1280/1440/1920. **D4/D6** — hover + focus-visible on interactive elements. **D5** — display-only scale steps at the wide tier; body stays 16px.
- **Mechanics:** new `@media (min-width:1200px)` blocks in components.css **after** base rules (source order wins). 759/760 tier untouched. Verify with the **D0 rig** (local :8760 static-server, SW-clear + cache-bust, `praxis_user` auth stub, in-memory fixture, direct `renderRoute()`), at 1280×800 / 1440×900 / 1920×1080.
- **SHAPE-B must render BOTH viewports** (mobile composition AND ≥1200 composition) — two renders.
- **Chip:** Profile's desktop chip upgrades `stretched → native` **only** via this measured evidence at close.

---

## 7. GROUND SPECTRUM for the galaxy (§7 law)

- The **live** galaxy well is already a **token-composed deep-space panel** (`--br-deep`/`--sunk-d`/`--scrim`, components.css:7416) inside the light-ember account page — matching CLAUDE.md §7's *"feathered field, never a hard dark panel in a light page."* Warm brown-black.
- The **mockup's** `.galaxy-night` (mockup:98) is a **class-scoped token remap on the starfield container only** (never `body`): `background:#0b0d16` blue-black + local `--surface/--ink/--gold` remap. **Fork:** adopt the mockup's explicit `.galaxy-night` blue-black night, or keep the live warm-feathered `--br-deep` well? **§7 favors warm-feathered** (light working → warm-dim interior → deep-warm field → full-amber room) — a hard blue-black panel would break the spectrum. → SHAPE-A / SHAPE-B call.

---

## 8. FORKS FOR SHAPE-A (Beat 2 — one question per checkpoint, each with a recommendation)

The prompt names four expected forks; recon surfaces those plus the galaxy-ontology forks:

1. **Redirect mechanics for `#account`.** (a) `#account` `location.replace('#profile')`, merged page lives at `#profile`, nav avatar repointed to `#profile`; (b) merged page lives at `#account`, `#profile` redirects to `#account`, nav unchanged; (c) keep both hashes routing to the one merged renderer. → *Recommend (b)*: the nav avatar already points `#account` and `activeRoute` already lumps both; least churn, old `#profile` links still land.
2. **Where settings + "Your data" covenant sits in the merged page order.** The account page already keeps it LAST. → *Recommend: keep LAST*, below the instrument/portrait — the covenant closes the page (it already reads that way).
3. **Owner-mode above-the-fold composition.** Instrument-first (evidence-weighted value-load + Now strip + gaps-as-questions; galaxy one tap away) per the locked shape. → *Recommend: honor the lock* — value-load lead, galaxy a tap below.
4. **The ≥1200 second region (which earns the width).** Candidates: (a) galaxy as a persistent right/left panel beside the instrument stack; (b) a values→evidence two-column split; (c) a margin apparatus (gaps-as-questions rail). → *Recommend (a)*: the galaxy is the portrait's signature and the most width-hungry element — pairing it with the instrument column is the truest D1 composition.
5. **[GALAXY] Fields source (§2.3).** 9 book traditions (display-only, in-guardrail) vs a new arc/sub field axis (data-model change). → *Recommend: book traditions* — stays inside the display-only guardrail; a field axis on arcs is R10/later.
6. **[GALAXY] Ground register (§7).** Warm-feathered `--br-deep` well (live, §7-favored) vs mockup `.galaxy-night` blue-black. → *Recommend: warm-feathered* — conform to the ratified ground spectrum.

**Deferred, do NOT build (R9b):** arc cards, lineage row, Now-strip richness, destination cross-links. **Fenced, do NOT wire:** any social hook (follow/build-on/walk) — visitor mode designed, door shut (R11/Lane-2).

---

## 9. RAILS CONFIRMED (no-go, restated)
Strict ES3 in views.js (var/function, no const/let/arrow/backtick, string concat). Tokens-only Universal v1.2; no `--lum-*` in NEW CSS; no `--register-*`/`--subtheory-*` concat families; no setProperty seams; no transform-rig tokens. Byte-locked foundations untouched. `deleteBook` = canonical scrub reference for any data removal. `prestona255` READ-ONLY; `prestonpraxistest` for behavioral tests. Path-explicit staging, never `-A`. Cache bump v3.197→**v3.198** LAST, one, at the final commit. COMMIT-NO-PUSH; Preston's exact words push.

---

## 10. RESIDUALS / HONESTY LEDGER
- **Thread 1 (account-page) returned a `"test"` stub** and **Thread 3 (routing) failed the schema cap** — both re-derived by direct grep/ranged-view recon (§1.1, §4 anchors are first-party, not agent-sourced). No coverage gap.
- **Fields axis** (§2.3) and **ground register** (§7) are the two genuine design forks; both surfaced to SHAPE-A, neither pre-decided here.
- **Non-deterministic starfield** (`Math.random()` per render, views.js:16171) — a seeded/stable sky is an open SHAPE-B question (does the sky reshuffle on re-render?).
- **`sw.js` CACHE_VERSION** is v3.197; bump to v3.198 is the LAST build step, not now.
- Report is the SCAN-beat deliverable. **Beat 1 (SCAN) complete → HALT for Preston's go-ahead before SHAPE-A.**
