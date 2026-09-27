# ONBOARDING BRIEF — v3 (the first-run spine)

| | |
|---|---|
| Status | **v3 — RATIFIED 2026-09-27, first landing in the repo.** v1 (2026-07-17) and v2 (2026-07-17, ratified) were chat-only; the gap was ledgered as `OB-BRIEF-UNLANDED` in `onboarding.md`. |
| Governs | the ONBOARDING round (the Aug-22 gameplan's widened round = the beta runway), P3 build lanes, the acceptance card, the spine mockup, the stranger test |
| Written from | `docs/studio/p2-cold-census.md` (`f4490e3`, run 2026-09-20 on live v3.299) + source at `5598c2a` |
| Canon | `docs/studio/v1-canon-delta.md` v1.1 "The Sunflower" — every screen in the mockup and the build inherits it |
| Supersedes | brief v2 in full; W9 v4 (July 3) in full; the July-17 ground ruling 1 (import-first) |
| Not in scope | Yumi's generative work (R10, parked past beta) · search/flow (not a P3 lane unless Preston rules it one) · Yumi's glyph shape (V-1 §4) · the commons/galaxy as spine stops (first-visit moments, OB-2/OB-6) |

---

## 0 · Mission and the anchor

A person Preston has never coached, on their own phone, signs in, gets books in, leaves a
note, closes the app, and returns two days later to find it all there and legible — with no
Preston intervention. That sentence is the round's acceptance test (Aug 22) and the
acceptance card's first row. Everything below serves it.

The census proved nobody but Preston has walked the app, and that the shipped first-run
(an 8-beat modal journey, `js/intros.js` `JOURNEY`) was never designed against a stranger:
it teaches on Preston's books (beat 5 chips, `intros.js:251-253`), writes the first book
through a replica writer (`doShelve`, `:319-333`), asserts acts it never saw happen (beat 8),
and treats the escape hatch as permanent (`onSkip` → `markSeenAndClose`). v3 replaces it with
**one first-run**, built on the real surfaces, from real data.

---

## 1 · The spine (v3)

Six beats. Yumi's first line is on demand, after release. Nothing gates on the corpus floor;
the floor decides only what is *promised* versus *performed*.

| # | Beat | Surface (real) | Act | Escape |
|---|---|---|---|---|
| 1 | **Front door** | signed-out Home (pre-auth) | read the three terms; Sign in | none needed — nothing is written |
| 2 | **Books** | `#scan` · the Shelf's add door · paste/import | bring books; asks for three, accepts one | explore on my own |
| 3 | **Margin** | the shared capture door, pre-scoped to the first book | one honest note (Marginalia / Journal) | explore on my own |
| 4 | **Values** | the R8 beat, as shipped (v3.195) | pick presets, name your own, or skip | explore on my own |
| 5 | **Consent** | `#yumi-sees` | "May Yumi walk your shelves?" — two neutral chips, or Decide later | explore on my own |
| 6 | **Release** | Home, sky-first (V-1 R9) | read a computed account of what happened and what is promised | — (this is the exit) |
| — | **Yumi's first line** | the Bloom, when the reader opens it | her stance question + one open question about their book; scripted below the floor | — |

**Beat copy is a P3 deliverable against the mockup, not this brief.** Where v3 fixes copy it is
because the copy is a contract: the three terms (Δ1), the shelf's three-door sentence (Δ3),
the consent question (Δ6), "I'm in the corner when you want me" (Δ8).

### 1.1 Front door (Δ1)
One pre-auth screen: wordmark · the three terms verbatim — *Yumi sees only what you allow ·
Memory is yours to grant · Your words stay yours* · **Sign in**. Terms are read before
signing (OB-12). The sign-in tap opens the Google prompt directly (1 tap today, keep it).
No beat ever mounts over a surface that has not rendered signed-in (§6 precondition A).

### 1.2 Books (Δ3)
The beat *is* the Shelf's own zero-state sentence — "scan a spine, search a title, or paste a
whole list" — and each door opens the **real surface**: `#scan` (Book or Shelf mode; the
designed no-camera state with "Add without the camera" stands), the real add door, the real
paste/import path. At 390 the beat leads with scan; at 1360 with search / paste. Asks for
three; accepts one; blocks on nothing. Every book written here is written by the surface's
own writer — the spine owns no writer.

### 1.3 Margin (Δ2)
Opens the shared capture door **plain** — no Room landing, no basin, no create — pre-scoped to
the first book, note registers only (Marginalia / Journal), and completes on the door's own
callback. A skipped margin is recorded as skipped (§1.6 tells the truth about it).

### 1.4 Values (Δ7)
The R8 beat byte-for-byte: the 10 presets (Liberation · Power, named · Dignity · Solidarity ·
Care · Doubt · Praxis · Inheritance · Hope · Craft) + name-your-own, persisted per toggle,
additive on re-walk. OB-5's living statement leaves the spine for the Account (VC5's other
half). Values before lenses holds by construction — lenses are not in the spine (Δ5).

### 1.5 Consent (Δ6)
Opens the real `#yumi-sees`, which must list exactly the reader's own 1–3 books and one note
(§6 precondition B). One question — **"May Yumi walk your shelves?"** — two chips, neither lit
until tapped. **Decide later** records *unanswered*, which is not *declined*: generation never
ran, the question may be asked once more at its own surface, never by a ping. Consent is the
generation trigger (OB-3). The Notebook's "Yumi reads along" switch is shown on the same page
as a fact with its own control; the beat asks one question, not two. Declined is first-class:
the Lenses rail stays honest-empty, values untouched, nothing sulks.

### 1.6 Release (Δ8)
Copy is **computed** from account state — N books · note or none · consent granted /
declined / unanswered — and every unfulfilled promise names its surface: *"Your lenses land on
the shelf, under Lenses"* only when consent was granted **and** corpus ≥ 3. Ends with *"I'm in
the corner when you want me."* Lands on **Home, sky-first**: the reader's own counts under the
constellation — the same screen the two-day return lands on.

### 1.7 Yumi's first line (Δ4, Δ7)
When the reader first opens the Bloom: her stance question (*Press me · Keep me company ·
Stay out unless asked*) and one open question about the book they shelved — or, with no book yet, about the one they would bring first. **Below the
3-book floor this is scripted — no context assembly, no `claude-proxy` call — until the reader
types.** At or above the floor, her walk is performed from the reader's own data and nothing
else. She never speaks first after release (raised-hand law).

### 1.8 Resume and escape (Δ8)
A quiet **"explore on my own"** on beats 2–5. Taking it writes *progress*, not *done*: a
per-uid record `{ beat, done }` replaces `profile.onboardingSeen`. Re-entry — on any device,
from About's **"Continue the walk"** — resumes at the next unfinished beat and reads the real
shelf (a beat whose act is already done shows it done). Early bail arms the per-page
first-visit panels (OB-7). Arc-route arrivals (shared links) begin the spine on their first
non-arc route, not never (retires the OG6 suppression as a permanent skip).

---

## 2 · The eight deltas (brief v2 → v3), with the census fact each answers

Cap of eight per the Aug-22 ruling (12). No "anything else" pass was run. Fork outcomes
(2026-09-27, all at rec) are folded in.

| Δ | Census fact | Change | Retires by name |
|---|---|---|---|
| **1 Front door is the covenant** | welcome + terms only after sign-in (§2, §3.2); Google prompt names `praxis-b25d6.firebaseapp.com` (§2.1) | one pre-auth screen: terms + Sign in | journey beats 1 `welcome` + 2 `covenant`; the six-beat greeting `startOnboarding()` (`yumi-ui.js:793`, dead fallback) |
| **2 Books first, then one note** | bookless ember lands in an Inbox on a Notebook showing "Inbox 0 · Journal 0" (§5.3); capture-door destination list 3/7 below fold, selection didn't take (§5.3, §9.6); live act-margin is already book-scoped | spine order fixed books → margin; margin = the shared door, plain, pre-scoped | OB-1 capture-opens + OB-10 self-reorder; the <400 ms ember instrument; beat 6's bespoke `.ij-noteta / .ij-regs / .ij-keepnote` UI (consumes `OB-DOOR`) |
| **3 Three real doors, scan first on a phone** | shelf copy already says scan / search / paste (§5.2); `#scan` has a real fallback (§4.1); hand-add = 5 taps ~17 s, a manual form (§5.1); beat-5 chips hardcoded (§5.9) | the beat is that sentence; each door opens the real surface; asks for three | replica writer `doShelve` (`intros.js:319-333`); the three chips; Goodreads-primary as a premise (CSV = a dependency of the paste door) |
| **4 Floor is three; first line is a question until then** | Yumi's opening move read the seed's marginalia, 2 calls before the reader typed (§5.7); lenses inert at 0–1 books (§4.3) | floor = 3 owned books; below it Yumi's first line is scripted, zero LLM calls | opening-move-on-panel-open for sub-floor accounts; act-shelf's "Your first book arrives the moment you answer her" |
| **5 Lenses leave the spine** | Lenses control inert at 0 books (§10.10); at 1 book "no lenses yet — Yumi can suggest some" (§4.3) | no lens beat; release promises only when consent ∧ floor; the rail's empty copy flips to a quiet "arrived" | OB-11's in-spine-if-ready branch; OB-1's "lenses-arrive moment" |
| **6 One consent, real sees page, nothing preselected** | "leave off" pre-lit, decline is a no-op (§10.8); reads-along ON by default; sees page listed seed notes (§0) | opens real `#yumi-sees`; two neutral chips; Decide later = unanswered; reads-along shown as a fact | beat 7 `act-sees` as built; OB-3's "at import completion" phrasing (now: after the note) |
| **7 Declarations** | R8 beat already meets the brief; stance is a standalone screen; Account already carries thesis + values (§5.5) | values absorbed as shipped; stance → Yumi's first line; living statement → Account | beat 3 `stance` as a screen; OB-5's in-spine statement |
| **8 Release tells the truth, lands on the lamp, spine resumes** | release asserts both acts regardless (§5.9); escape on beat 1 only, sets `onboardingSeen` forever; retake ignores the shelf; arc-route arrivals never see it (OG6) | computed release; Home sky-first; escape on every beat writes progress; `{beat, done}` per uid; "Continue the walk" | `profile.onboardingSeen` as a boolean; beat-1-only escape; static release; "Retake the walk" semantics |

**Forks ruled 2026-09-27 (tappable, all at rec):** Δ2 books-first over capture-offer /
capture-gate · Δ8 landing = Home over `#book/<id>` / `#notebook` · Δ1 covenant before sign-in
over as-shipped · Δ4 scripted first line (zero calls) over a scoped opening move · **hygiene
fork (open since Sept 13) = SPLIT**: the two spine preconditions (§6 A, B) move into P3 Stage 0;
the rest stays a separate H-1 before the stranger test.

---

## 3 · Laws in force (verbatim; the acceptance card walks these)

- **ONE FIRST-RUN** — every shipped first-run behavior is absorbed or retired by name (§5). One spine, one progress record, one mockup.
- **REAL SURFACES, REAL DATA** — every beat runs on the live surface with the reader's own data. "Simulated-real" is dead. The spine owns no writer.
- **FIRST EMBER = PLAIN ONE-DOOR NOTE CAPTURE** — never basin / create, no Room landing.
- **RESUME** — spine progress persists per uid; re-entry resumes at the next unfinished beat, never restarts; unanswered consent = unasked, generation never ran.
- **PROMISE-KEEPING** — every promise the spine makes names its fulfillment surface (lenses → the Shelf's Lenses rail, quiet "arrived" state, Yumi silent).
- **RAISED HAND** — no unbidden post-release ping, ever. Yumi speaks first only inside the spine.
- **VALUES BEFORE LENSES** — the values invitation has zero generation dependency.
- **DECLINED MEMORY IS FIRST-CLASS** — lenses absent gracefully, values untouched, nothing sulks.
- **SMALL-CORPUS FLOOR = 3** — below it Yumi's walk is promised, not performed; nothing gates on it.
- **DESIGNED STATES** — every beat has waiting / empty / error states; none block release (RF1).
- **SPARSE-HONEST** — applies to one- and two-book shelves.
- **COPY IS A CONTRACT** — no beat promises behavior that is not built (`CLAUDE.md`).
- **INHERITED QUALITY BAR** — the books beat inherits each door's quality bar; a door's defect is that door's lane, not onboarding scope.

---

## 4 · OB pre-decisions and ground rulings — status after v3

| Ruling | Status |
|---|---|
| Ground 1 — import-first, Goodreads primary | **RETIRED** (Aug-22 ruling 7; Δ3). Import = the paste door; CSV = its dependency. |
| Ground 2 — split pair: lenses generated, values invited | KEPT. |
| Ground 3 — short spine + first-visit moments | KEPT; commons (OB-2) and galaxy (OB-6) stay first-visit moments. |
| OB-1 spine = A×D blend, capture opens | **RETIRED** (Δ2). |
| OB-2 commons exposure | KEPT (one promise-line at release; full exposure = commons first-visit moment on the seed arc's ground). |
| OB-3 memory consent = generation trigger, declined first-class | KEPT; placement now *after the note*, on the real sees page (Δ6). |
| OB-4 covenant cards trimmed to two | **AMENDED** → one pre-auth screen (Δ1); Yumi's intro + stance → her first line (Δ7). |
| OB-5 values presets + living statement | **AMENDED** → presets kept (R8); living statement → Account (Δ7). |
| OB-6 galaxy first-visit, conditional | KEPT (conditional on the seed rendering in the galaxy; promise-frame fallback). |
| OB-7 escape hatch on every beat, early bail arms panels | KEPT and **strengthened** — bail writes progress, not done (Δ8). |
| OB-8 "three books by hand" as first-class path | **ABSORBED** into Δ3 — hand-add is one of three doors, not the door. |
| OB-9 panel census 9 → 13 (+1 conditional) | KEPT, outside the spine. |
| OB-10 capture = offer not gate, self-reorder | **RETIRED** (Δ2). |
| OB-11 values before lenses; lenses in-spine if ready | first half KEPT as law; second half **RETIRED** (Δ5). |
| OB-12 sign-in between covenant and Act 1 | KEPT (Δ1 is its concrete form). |
| RESUME · PROMISE-KEEPING · STRANGER-TEST gate | KEPT (§3, §9). |

---

## 5 · ONE FIRST-RUN inventory — every shipped behavior, by name

| Shipped behavior | Where | Fate |
|---|---|---|
| Six-beat scripted Yumi greeting | `js/yumi-ui.js:793` `startOnboarding` (+ `ONB_*` strings, `finishOnboarding`) | **RETIRED** — deleted, not kept as fallback (Δ1) |
| 8-beat journey, beat 1 `welcome` | `js/intros.js` `JOURNEY` | **RETIRED** → front door (Δ1) |
| beat 2 `covenant` | " | **RETIRED** → front door (Δ1) |
| beat 3 `stance` | " | **RETIRED** → Yumi's first line (Δ7) |
| beat 4 `values` (R8, v3.195) | " | **ABSORBED** as shipped (Δ7) |
| beat 5 `act-shelf` + `doShelve` + three chips | `intros.js:236-262, :319-333` | **RETIRED** → three real doors (Δ3) |
| beat 6 `act-margin` + `.ij-noteta` UI (`doNote` → `captureNote`) | `intros.js:267-289, :336-342` | **RETIRED** UI → shared door pre-scoped (Δ2); the sole-writer path stays |
| beat 7 `act-sees` + `doConsent` | `intros.js:290-306, :344-351` | **RETIRED** as built → real sees page, neutral chips (Δ6); `yumiReaderModel` write stays |
| beat 8 `release` + IA4 routing | `intros.js:484-498` | **RETIRED** → computed release, Home (Δ8) |
| `profile.onboardingSeen` (Firestore) + `maybeStartOnboarding` gate | `yumi-ui.js:885`, `integrations.js:684` | **RETIRED** → per-uid `{ beat, done }`; gate reads progress (Δ8) |
| escape hatch on beat 1 only (`onSkip`) | `intros.js:500-504` | **RETIRED** → every beat, writes progress (Δ8) |
| About "Retake the walk" (`startJourney`) | `views.js:24419` | **AMENDED** → "Continue the walk" resumes (Δ8) |
| `isArcRoute` suppression (OG6) | `yumi-ui.js:881` | **AMENDED** → deferred, not skipped (Δ8) |
| 12 per-page intro panels (`INTROS`) + `praxis_intro_<id>` flags | `intros.js:40-73` | **KEPT** as first-visit moments (OB-9); §6 D fixes the landing-surface skip |

---

## 6 · P3 preconditions — defects the spine cannot ship over

Filed from the census. **Not deltas.** A and B are P3 **Stage 0** (the hygiene-fork split);
C–F are P3 lane work; G–H go to H-1 or beta triage.

| | Defect | Evidence | Owner |
|---|---|---|---|
| **A** | First-ever sign-in never renders signed-in Home: every `renderRoute()` in the auth path sits under `status === 'found'`; `absent` renders nothing; `closeJourney()` calls `panelForHash()` not `renderRoute()` | census §3.1, §6.2 (falsified as a race); `integrations.js:662, :684, :699, :722-728` | **P3 Stage 0** |
| **B** | Seed leak: `homeReadingBooks()` has no ownership filter; the same reaches `#yumi-sees`, Yumi's context assembly, and the capture door's destination list | census §0, §10.1–2; `views.js:1603` vs `:1700`, `:4367`; `state.js:3360` | **P3 Stage 0** |
| C | First Yumi message: 5 × HTTP 200, nothing rendered, console clean | census §5.7, §9.6 (one send only — reproduce first) | P3 spine lane (Yumi's first line) |
| D | Landing-surface intro panel silently skipped on every new device (`initPanels` before auth; re-runs only on `hashchange`) | census §6.2 | P3 spine lane |
| E | Add door is a manual form, not the title search its copy promises; no dedupe | census §5.1 | P3 "scan door promotion" lane |
| F | Copy naming unbuilt behavior one tap from Home: "arrives with the YG round"; "Start another arc" at 0 arcs; seed arc "touched today" | census §10.9 | P3 spine lane (copy sweep) |
| G | Two panels mount off-screen: "File to book" at 0 px visible; capture-door listbox 109/252 px | census §10.11; the T3 specimen in `CLAUDE.md` | H-1 |
| H | Signed-out landing costs 5 `google-books-proxy` calls for seed covers; Google consent screen names the Firebase project | census §2.2, §8 | H-1 (cost) · Firebase `authDomain` → praxisreader.com (config) |

**H-1 (separate, before the stranger test):** cache keyed to uid/version · client error
reporting · nightly Firestore backup · auth edges · G and H above · the parked P1 residuals
(deletion re-run with an arc + the stale-tab ghost-doc write) on a second throwaway. The
census throwaway (`prestona255+praxis1`, uid `w5NBen…`) stays alive for the return test.

---

## 7 · Dependencies

- Goodreads minimal CSV — a dependency of the **paste door**, beta-gate scope; the spine does not wait on it.
- The add door becomes a title search (§6 E) before the books beat can claim "search a title."
- Firebase `authDomain` on praxisreader.com (§6 H) before the front door can claim Praxis at the Google prompt.
- V-1 canon delta v1.1 tokens are live in P3's first slice (R1 aliasing) before any spine screen is measured.
- The `#scan` surface's quality bar (closed 2026-08-08, v3.269) is inherited, not re-audited.

---

## 8 · Designed states per beat (none block release)

| Beat | Waiting | Empty | Error |
|---|---|---|---|
| Books | cover lookup pending (spine shows the title at once) | zero books after the beat → release says so, no promise | lookup fails → book kept titled, cover absent, no toast storm |
| Margin | — | note skipped → release says so | write fails → the door's own error; spine does not advance |
| Values | — | skipped → nothing asserted | persist fails → chip reverts, door's error |
| Consent | — | Decide later → unanswered | persist fails → chips return to neutral |
| Release | computed from state at open | — | — |
| Yumi's first line | typing indicator only after the reader types | scripted question below floor | proxy error → the honest message, never a blank transcript (§6 C) |

---

## 9 · Gates

- **Acceptance card** (`docs/checkpoints/onboarding-acceptance-mockup.md`, per the `acceptance-card.md` protocol — the mockup-stage card, written before build; the close-stage card follows at round close) — the anchor row, one row per law in §3, one row per Δ, walked at 390 and 1360 on a fresh throwaway on live. OWNER rows left for Preston.
- **Spine mockup** — tappable, sunflower canon, 390 + 1360, front door → first book → first note → Yumi's first line, with empty / waiting / error states. A stranger walks the mockup before P3 builds it (Aug-22 mitigation). Soft budget: ~3 min to release, import wait excluded.
- **Stranger test** (round close) — ≥1 genuinely fresh person, own device, on live; then the two-day return. The round budgets a fix loop after it; close is not assumed clean.

---

## 10 · P3 lanes (from the Aug-22 plan, restated against v3)

1. **Stage 0** — §6 A + B, then the V-1 R1 token aliasing; the visual gate at 390 + 1360.
2. **Spine** — beats 1, 4 (as-is), 5, 6, Yumi's first line, resume record, About "Continue the walk"; §6 C, D, F.
3. **Scan-door promotion** — beat 2's three doors on the real surfaces; §6 E.
4. **Capture-in-first-run** — beat 3 on the shared door: pre-scope + completion callback (the `OB-DOOR` item).
5. **B-M close** — the installed-PWA re-census of M-A–M-F (ruling 8).
Then the stranger test → fix loop → R-POLISH lite → P4 triage → P5 invite 3–5.

## 11 · Open

- Whether the front door's three terms carry a "read the long version" link to About before sign-in (About renders signed-out today).
- The exact field name and collection for the per-uid progress record — P3 Stage 0 recon proposes; must survive account deletion and export (P1 items).
