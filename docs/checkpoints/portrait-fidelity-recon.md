# Reader-Portrait — Account-Page Fidelity Reconciliation · STAGE 0 RECON

**Date:** 2026-06-24 · **Mode:** read-only recon → HALT for go-ahead (no code touched).
**Worktree:** `peaceful-joliot-2f5c97` (branch `claude/peaceful-joliot-2f5c97`) @ `bcdce38`.
**origin/main:** `bcdce38` = v3.143. **CACHE_VERSION:** `praxis-v3.143` (sw.js:10).
**Mockup (target, untracked — never stage):** `C:/Users/pallen/Desktop/praxis-app/design/praxis-portrait-mockup-v6-instrument.html` (852 lines, Desktop comp).
**Live verified on:** praxis-reading.netlify.app/#account, signed in as **prestona255@gmail.com** (the REAL account — recon was VIEW-only; no writes; the SORTS confirm/rename write-path was NOT exercised).

> ⚠ **Lane note.** The handoff names lane `relaxed-lederberg-ac8a2a` as the kept fidelity lane. This recon ran in `peaceful-joliot-2f5c97`. **Both sit at `bcdce38` (identical trees)**, so recon is unaffected. Build-lane choice is a logistics decision at go-ahead (recommend: build here, it's clean at origin/main; or switch to relaxed-lederberg — identical).

---

## 0. Headline

The portrait **renders cleanly** on the live real account — **no white screen, console clean, and ZERO `portrait X section failed`** messages, so all four umbrella'd sections (VALUES, REVEALED-SELF, JOURNEY, CAPSTONE) genuinely render. **All seven interactions are wired and were verified firing live** (one write-path verified by code only, never exercised). Remaining work is **fidelity polish on a live, safe feature** — section ORDER, eyebrow-hint typography, token/treatment deltas, the hero stance line + ✎, and the disposition of two pre-portrait live-only inserts. The data-vs-fidelity frame holds throughout: every sparse count (1 stone / 3 stars / 0 bonds / 3 poles) is **DATA-correct**, not a defect.

---

## 1. Live section inventory (the backbone) — DOM-verified

Direct children of `.account` (20), in render order. `[U]` = inside an umbrella `try/catch`; `[OUT]` = always renders.

| # | Section | Root | Umbrella | Live eyebrow (verbatim) |
|---|---------|------|----------|--------------------------|
| 0 | HERO | `header.account-hero` | OUT | `your standing place · reading since May 2026` |
| 1 | VALUES (stones) | `div.sec.account-values` | **U** (try 13214→catch 13315) | `What you're reading toward — in your own words` |
| 2 | **PROFILE EDITOR** (live-only) | `form.account-block.account-edit-form` | OUT | (no eyebrow) |
| 3 | **"shape of thinking" slot** (live-only) | `p.eyebrow` + `div.account-constellation-slot.…-filled` | OUT | `the shape of your thinking — tap a mark` |
| 4 | COUNTS / stat cards | `p.eyebrow` + `div.account-stats` (4 cards) | OUT | `your reading life — tap to open it here` |
| 5 | EXPAND HOST | `div.account-expand-host` (empty) | OUT | — |
| 6 | REVEALED-SELF toggle | `div.account-revealed` | **U** (try 13464→catch **13829**) | `What your reading shows — for you to name` |
| 7 | SORTS / dialogue | `div.sec.account-portrait-sec` | (within U) | `How your library sorts — you hold the names` |
| 8 | FIELD | `div.account-card.portrait-field-wrap` | (within U) | `The field you read across — and its edges` |
| 9 | GALAXY | `div.account-card.portrait-galaxy-wrap` | (within U) | `Your reading as a galaxy — bigger stars hold more; nearer stars share more` |
| 10 | RETURNS | `div.account-card.portrait-returns` | (within U) | `What your margins keep returning to` |
| 10b | THREADS | `div.account-card.portrait-threads` | (within U) | (invitation header) |
| 11 | JOURNEY | `div.sec.account-portrait-sec` | **U** (try 13835→catch 13858) | `How your reading has moved` |
| 12 | CAPSTONE emblem | `div.account-card.portrait-capstone` | **U** (try 13863→catch 13959) | `And so —` |
| 13 | TRANSPARENCY (multi-covenant) | `section.account-card.account-data-card` | OUT | `what praxis records — and what yumi sees` |
| 14 | READER-MODEL panel (pre-existing) | `section.account-card.account-readermodel.rm-on` | OUT | `reader model` |
| 15 | "your data" covenant | `section.account-card.account-data-card` | OUT | `your data` |
| 16 | ACTIONS | `section.account-card.account-actions-card` | OUT | — |
| 17 | DANGER (delete) | `div.account-card.account-danger` | OUT | — |

**Umbrella confirmed correct:** the 4 portrait sections are wrapped; hero / profile-editor / shape-slot / stats / transparency / reader-model / your-data / actions / danger / `host.appendChild(wrap)` are all OUTSIDE → a portrait-section throw can never blank the page again.

**Live counts (DATA — all correct for the real account):** stones 1 (`Care and love`); stats **131 Books / 2 Arcs / 10 Sub-theories / 5 Marginalia** (chevrons ▾ present on all 4); categories axis = 3 groups (Theory 55 / History 39 / Memoir 18); lenses axis = 2 groups; galaxy 3 stars, **0 bonds**; field 3 poles, 0 tension callout; SORTS 1 offer; threads invitation shown; capstone 4 "what it's made of" rows; reader-model **ON** with **0 named threads**.

---

## 2. Live interaction verdicts — what FIRES vs what's silently failing

Tested by code-read **and** live DOM (JS-driven, read-only). Console scanned: only the benign Chrome-extension "message channel closed" artifact — **no app errors, no `portrait … section failed`.**

| # | Interaction | Verdict | Evidence |
|---|-------------|---------|----------|
| 8 | **Galaxy hover → filaments** | **DATA-correct (NOT a bug).** Hover fires (readout + star-brighten); 0 filaments because there are **0 bonds**. | Bond rule (views.js 12394, 12469): a bond needs one note whose `bookIds` span 2+ groupings. Live probe: **0 of 6 notes reference >1 book** → 0 bonds. Drawing code is fine; nothing to draw. |
| 9 | **Star settling drift-in** | **Present & correct mechanism.** One-time settle from center (`scale .25→1`, `opacity 0→1`) via 1.4s CSS transition; **no perpetual animation** (`animation:none`). rAF-rAF seed present (views.js 12750). reduced-motion → instant `place()`. | The handoff's "richer" ask is an **easing/stagger comp-gate**, not a missing behavior. ⚠ On the automated (backgrounded) tab rAF is throttled, so stars can read stuck at `scale .25`/`opacity 0` in a screenshot — a capture artifact, verify on a foreground tab. |
| 10a | **Shared toggle recompute** | **VERIFIED LIVE.** | Clicking *Your lenses* → poles 3→2, stars 3→2, offers 1→2; back to *Book categories* → 3/3/1. `portraitSetAxis` (13812) re-renders SORTS + FIELD + GALAXY together. State restored, no write. |
| 10b | **SORTS confirm / rename** | **WIRED (code-verified); NOT exercised — it WRITES.** | confirm/rename call `createUserTheme`+`assignBookToTheme`+`saveProfileToFirestore`. Chips present (1 offer). **Must be tested only on a throwaway account.** |
| 10c | **Emblem chips / show-made / ack** | **VERIFIED LIVE (all DOM-only, no writes).** | Clicking *your values* → emblem `data-focus="values"`, explain → "The core — the 1 values you placed…", chip `.on`. *show me what it's made of* → legend `.show`, label flips. *yes, that's me* → ack "Then it's yours…". |
| — | **THREADS consent gate** | **Correct by design (not a bug).** | `renderPortraitThreads` (13771) always shows the invitation header + toggle; when opted-in it ALSO appends threads or an empty-state. Live = ON ("Yumi is noticing") + empty-state ("hasn't named a thread yet"). The 140-char capture merely clipped before the toggle. |

---

## 3. DATA-vs-FIDELITY diff — the FIDELITY items to fix (DATA deltas omitted, they are correct)

Source: parallel mockup + CSS + helpers read, diff-synthesized, completeness-critic'd (852-line mockup read in full; live `liveValue` claims spot-verified against views.js).

### High-severity FIDELITY
- **Section ORDER** — two live-only inserts (PROFILE EDITOR, "shape of thinking" slot) sit between VALUES and COUNTS. Mockup goes HERO→STANCE→VALUES→COUNTS directly. → **gated group 3.**
- **STANCE intro line ABSENT** — mockup has a bare line under the hero: **"Everything below is yours. Yumi offers; you decide what it means."** (5px gold dot, sans 13.5px, outside any card). Add it.
- **"shape of thinking" cream slot** — a pre-portrait `.account-constellation-slot` with NO mockup counterpart; its light-cream stage breaks the dark ground. **Remove (recommended) / restyle-dark.**
- **Eyebrow-hint typography** (highest-frequency fix) — COUNTS and "shape of thinking" eyebrows **bake the "— hint" tail into one UPPERCASE-MONO string**, but the mockup atom flips the hint to **sans, sentence-case, `--ink-faint`**. VALUES already does this correctly (the `.hint` rule exists). Split base-text + `span.hint` on every portrait eyebrow that has a "— tail".
- **Inline ✎ affordance** — mockup edits via a `✎` pencil after the name + descriptor; live has none (it uses the separate editor block). Add `span.portrait-pencil` wired to surface the editor.
- **Hero avatar** — live = 96px constellation render; mockup = 74px "P" monogram on teal→amber gradient + gold ring (**same mark the nav already shows**). → **decision gate (see §5).**

### Med / low FIDELITY (group 1 — pure additive)
- Hero name 30→35px; hero tagline 17→18px + brighter `--ink`; covenant 18→19px + `--ink`.
- Stat grid: flex-wrap → CSS `grid` `repeat(4,1fr)`→`repeat(2,1fr)`@640 (faithful 4-up/2-up); gap 14→13px; chevron 14px→11px opacity .5.
- Card radius: portrait body cards 10px (`--radius-md`) → ~17px (closest `--radius-lg` 16px; or add a `--radius-17` token per canon §1 — **builder's deliberate call**, don't silently accept the 1px drift).
- Galaxy deep-space: live radial reads brown (`--sunk-d`); mockup is near-black (`#1b1207→#100b06→#070504`). Deepen toward `--br-deep`/`color-mix`. Also presence-check the **34 ambient specks** + `inset 0 0 60px` shadow.
- **Verbatim chrome sweep** — confirm em-dashes + curly `'` + `＋`(U+FF0B) + `…`(U+2026) + `✎`/`✓` across: VALUES helper, SORTS holding lines, FIELD/RETURNS/JOURNEY help, THREADS blurb+labels, CAPSTONE ask/ack, GOVERNANCE covenant/danger. (Mockup glyphs confirmed; live is the unverified half.)
- Movement divider geometry on `.account-revealed` (42px gap + 1px `--line-soft` top hairline).
- `:focus-visible` ring should be teal; confirm reduced-motion disables BOTH the capstone breathe AND the 1.4s star settle.

### Token mappings — accept as-is (no hex; faithful)
THREADS `--journal-color` ↔ mockup `--violet`; clay strand `--danger` ↔ `#CC7B5D`; journey dot ring `--ground` ↔ `--bg-mid`; field `.tlabel` blur(4px) is in-spec (canon §4-A no-blur is nav/overlay only, not in-content markers). Add a one-line comment at each.

### Out of scope / resolved-by-decision (state explicitly so a builder doesn't think they were missed)
- **NAV pill** — global app chrome, not part of `renderAccountPage`; governed by canon §4-A/B; do not port here.
- **Yumi FAB** — mockup's dashed-gold "Y" is superseded by the shipped **Bloom** glyph; do not regress.

---

## 4. Resolved unknowns (handoff §4/§5)

- **(i) "shape of thinking" slot** = pre-portrait #8 account-hub inert constellation (views.js 13394–13439). **No mockup counterpart.** → remove (recommended) / restyle-dark. *Decision gate.*
- **(ii) Stat cards** = present and structurally faithful (4 cards, serif numeral, gold mono label, ▾ chevron, expand-in-place + teal active ring); only **pushed down** by the two inserts above them. Deltas: eyebrow-hint split (grp 1) + flex→grid (grp 1) + order (grp 3).
- **(iii) Avatar** = constellation (live) vs monogram (mockup). **Handoff says FIX to monogram**; the nav already renders that monogram. *Decision gate (§5) — note: an earlier "fork" memory referred to constellation MARK SHAPES, not the hero avatar, so there is no real conflict — the handoff governs.*
- **(iv) Hero subtitle / "Publishing as" / email** = per the **handoff (authoritative)**: surface the **stance** subtitle; **relocate the email** to the "Your data" block (it doesn't belong in the hero); de-emphasize/relocate "Publishing as". *(The recon workflow suggested keeping email+penName in the hero — overridden by the handoff.)*
- **(v) Intro/stance line** = ABSENT live, PRESENT in mockup → add (grp 2).
- **(vi) RETURNS/THREADS/JOURNEY/CAPSTONE** = faithful 1:1 ports (token-swapped, data-driven, interactions wired); residual = verbatim chrome checks + a few token notes. **TRANSPARENCY** = live richer multi-covenant block + separate "your data" card; mockup has one GOVERNANCE block. *Decision gate (§5).*
- **(vii) PROFILE EDITOR block** = live-only form (Display name / Pen name / Self-description + Save). Mockup has none (edits via ✎). → fold behind hero ✎ (keep markup+Save handler), or keep. *Decision gate (§5).*

---

## 5. DECISION GATES — LOCKED 2026-06-24 (Preston)

1. **Hero avatar → MONOGRAM.** Reconcile to the "P" monogram on the teal→green gradient + gold ring (same mark the nav already uses); retire the 96px constellation avatar.
2. **"shape of thinking" cream slot → REMOVE.** Delete the slot + its eyebrow so the dark stat cards follow VALUES directly.
3. **Profile editor block → FOLD behind hero ✎.** Keep the form markup + Save handler intact; hide by default; reveal/scroll on a hero ✎ tap.
4. **Transparency multi-covenant block → KEEP as a deliberate Praxis addition** (placed after the governance block); only align the actions row (1 primary "Edit profile" + 3 ghost) + clay danger to the mockup.

(Email→"Your data", stance line, ✎ pencils, eyebrow-hint split, all group-1 token/typography/verbatim fixes need no decision — they follow the handoff/mockup directly.)

---

## 6. Proposed staged build plan (lowest-risk first; each PASS/FAIL gated; umbrella preserved)

- **Group 1 — pure-additive CSS/markup, NO order change (low risk):** eyebrow-hint split (COUNTS + shape-slot eyebrow); typography bumps (name/tagline/covenant); stat flex→grid; card radius; galaxy deep-space + specks/inset presence; verbatim chrome sweep; movement divider; focus-ring + reduced-motion check.
- **Group 2 — hero reconciliation (low risk, additive):** **avatar → "P" monogram on `--grad` + ring (retire constellation slot, gate 1);** add STANCE line; add ✎ pencils (wired to the editor); relocate email to "Your data"; de-emphasize "Publishing as".
- **Group 3 — order region (med risk, DOM-moving → was gated, now LOCKED):** stat grid finalize; **REMOVE the cream slot + eyebrow (gate 2);** **FOLD the profile editor behind ✎, keep markup+Save (gate 3)** → COUNTS follows VALUES directly.
- **Group 4 — governance (med risk, LOCKED):** **KEEP the multi-covenant transparency block as a Praxis addition after governance (gate 4);** align the actions row (1 primary gradient "Edit profile" + 3 ghost) + clay danger to the mockup.
- **Group 5 — interaction comp-gate (low risk, additive):** optional richer star-settle easing/stagger; confirm rAF-rAF seed fires on a foreground tab; **SORTS confirm/rename verified only on a throwaway account.**

**Per-stage verify idiom:** pre-stated byte deltas; cscript parse (views.js/state.js; integrations.js harness-exempt); banned-token gate = baseline (the umbrella's bare `} catch(e)` is ES3-valid, ≠ the gated `.catch`); every new rule `.account .portrait-*`-scoped, no `#hex` (Umber-dark tokens / `color-mix`); copy parity (verbatim + typographic); umbrella intact; live smoke is the real gate (structural checks did NOT catch the v3.142 crash). **Ship fix-forward** (the umbrella means a fidelity fix can't blank the page); record `PRESHIP=origin/main`, single `CACHE_VERSION` bump at push, batch a few verified stages per ship.

---

## 7. Honest residuals
- ~10 fixed-chrome live strings are flagged "verify verbatim" rather than pre-confirmed — fold into the group-1 sweep (read the live constant, diff vs mockup) before writing.
- Star-settle "richness" and all card-treatment calls are **Preston's visual comp-gate** on live screenshots, not mechanical.
- The SORTS write-path (confirm/rename) is **code-verified only**; its live PASS belongs on a throwaway account in group 5.
- Galaxy on the automated tab may show unsettled stars (rAF throttle) — verify settle on a foreground tab.
