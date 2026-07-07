# Fable Audit — Combined Report (read-only)

_Aggregation of the three Fable deep-dive passes — Pass 1 (security & data integrity),
Pass 2 (craft/aesthetic + open-gap), Pass 3 (writing-loop · values/covenant · structural-IA) —
reformatted to the June `praxis-2.0-audit.md` shape. No source was modified; no pass was
re-run or re-audited. Findings are deduped across passes; each row notes its pass of origin._

Ledger totals: **4 CRITICAL · 26 HIGH · 22 MEDIUM · 16 LOW** (68 deduped issues) · Upgrades: 7 · Open questions: 6.
Ground truth: **HEAD `a92c499` / `praxis-v3.180`.** The passes froze at `aa730e5/v3.177`; the only
app-source drift since is `js/integrations.js` (the F-DL1/2/3 data-loss latches, now fixed) + `sw.js`
bumps — `views.js`/`components.css`/`theme.css`/`assets/` are byte-unchanged, so every anchor below
resolves at HEAD. Sources: [pass1-security.md](docs/checkpoints/pass1-security.md) ·
[pass2-craft-opengap.md](docs/checkpoints/pass2-craft-opengap.md) ·
[pass3-summary.md](docs/checkpoints/pass3-summary.md) (+ the four Pass-3 lane ledgers). The July-6
writing pass has no standalone doc — its content lives in `fable-audit-charter.md §4`.

---

## 1 · Executive summary

### Overall read
The three read-only passes converge on a clear picture: **Praxis's foundations are sound — the
launch risk is not lost work but broken covenant, an invisible core action, a hostile first-run, and
a pervasive craft deficit.** The data spine now writes durably (the Pass-1 F-DL1/2/3 losses are
fixed in code), security is fundamentally solid (the `__praxis_seed__` exception can't leak real data,
the publish fence is intact, all five proxies fail closed), and every step of the writing loop
persists. What remains, in priority order: **(1)** one *live covenant break* — Yumi's NOTICE/NAME
move-scan reads journal entries the `#yumi-sees` transparency view swears she cannot see (**VC1**),
with a wider blast radius through an unguarded grader-feeding reader (**VC1-b**); **(2)** a *P0 craft
break* — the notebook's primary writeline is invisible at ~1.1:1 (**NB1**), so the core action of a
writing app can't be seen while you type; **(3)** a *compound signed-out first-run failure* — the app
greets first-timers with "Welcome back," a fabricated avatar, and dead personal-dashboard widgets, and
dead-ends its one shareable payoff (**OG1–OG4**); and **(4)** a *quantified, pervasive craft deficit* —
meta ink fails AA on both grounds (**CC1/CC3**), the type scale is a ~1.6%-tokenized fiction
(**CC4**), and two token namespaces run in parallel (**CC5**), which together produce the maker's
"washed-out, inconsistent surface-to-surface" signal. Findability is the fourth theme: global Search is
orphaned on mobile (**IA1**), the search index is partial (**IA5**), and the arc's three authoring
doorways confuse without wayfinding (**AF1/IA6**). The covenant's aspirational limbs — values-driven
*intersectional* arcs and a flagship values-capture moment — are simply unbuilt (see Upgrades). Both
planted canaries (mobile-Search orphan · journal-scan leak) were caught.

### Top findings by severity (the headline set)
1. **[CRITICAL · open · LAUNCH] Yumi's move-scan reads journal entries the transparency view excludes** — `js/yumi-brain.js:1916-1927` (vs canonical filter `:222-226`) — `_visibleEntriesForScan` filters `isPrivate`-only and drops the categorical `register==='journal'` skip the canonical `assembleContextData` filter has, so once a user sets their journal register to *Visible* the entry is withheld from the main path AND from `#yumi-sees` yet is silently sent to the model — the transparency view **actively lies** (P-1/P-2/P-5). *(VC1)*
2. **[CRITICAL · open · LAUNCH] A second, unguarded notebook reader feeds the proxy grader** — `js/yumi-brain.js:1944-1951` → grader `:2068,:2092` — `_memberBodies(ids)` reads `e.body` with no privacy/journal guard of its own; its safety is purely inherited from the broken VC1 set, so the same leak flows through it and any future caller leaks unguarded. *(VC1-b / critic CR1)*
3. **[CRITICAL · open · LAUNCH] Notebook primary writeline is invisible (~1.1:1)** — `assets/components.css:9754-9755`, markup `js/views.js:2536` — dark-ground `--ink` text on a non-repointed `--page` composer; the placeholder shows (so it looks fine) until you type, then your own writing is unreadable. The core action of a writing app. *(NB1)*
4. **[CRITICAL · fixed] Silent unrecoverable cloud-save loss for arcs/notebook/sub-theories/themes/artifacts** — `js/integrations.js:130` (+4 twins) — the REPLACE-on-auth merge clobbered local writes on a second device for five of six collections; **fixed** in `c70f0dc`/`d1a8f6a` (the F-DL1/2/3 latches). *(F-DL1)*
5. **[HIGH · open · LAUNCH] Signed-out Home pretends you're already logged in** — `js/views.js:1429` ("Welcome back."), `:436-461` (fabricated "P" avatar + "Your account"), `:1481-1545` (dead "No arcs yet / Nothing open" widgets) — a first-time visitor's highest-attention moment reads "you've been here," with no clear Sign-in CTA. *(OG1/OG2/OG4)*
6. **[HIGH · open · LAUNCH] The one shareable payoff dead-ends** — `js/views.js:12040-12065`, `:3546-3641` — a signed-out visitor who explores the public seed arc reaches an impressive interior with no "sign in to build your own" CTA; the best conversion moment asks for nothing. *(OG3)*
7. **[HIGH · open] Meta ink fails AA on both grounds** — `theme.css:62-63,33` (`--ink-3/4→--meta` ~3.2:1, ~216 sites) + `assets/lumen-amber.css:32` (`--lum-ink-4` functional microcopy ~3.4–4.1:1 on dark) — the dominant meta/label/caption color is sub-AA app-wide; the single highest-leverage token fix. *(CC1 + CC3)*
8. **[HIGH · open] The type scale is a fiction** — `theme.css:86-88` — 960 `font-size` declarations, only ~1.6% tokenized, ~60 literal values, ~190 sub-11px, half-pixel noise; no enforced rhythm = "inconsistent surface to surface / hard-to-read type," literally. *(CC4)*
9. **[HIGH · open] Build-vs-read: three doorways edit the same `bodyPublic`** — `js/views.js:10522, 9065, 12628` — the Build workshop, the Page, and the arc Page-face stub all edit one field and cross-link each other, so the writer can't tell which is authoritative. *(AF1)*
10. **[HIGH · open] Global Search is unreachable on mobile** — `assets/components.css:5400`, `index.html:26-38`, `js/spotlight.js:432-444` — its only entries are the desktop-only nav pill (`display:none <760px`) and ⌘K; the hamburger has none of it, orphaning a whole render surface on the launch device. *(IA1)*

### Status — fixed vs open
- **FIXED / shipped:** the entire Pass-1 data-loss family — **F-DL1** (`c70f0dc`), **F-DL2** (`d1a8f6a`),
  and **F-DL3** (profile + readerModel outgoing-clobber latch, shipped at `v3.180`). Do not re-open.
- **OPEN:** everything else. The three audit passes changed no code, and no other fix has shipped since —
  including the launch-critical **NB1**, **VC1 (+VC1-b)**, and **OG1–OG4**.
- **Resolved-as-non-issue:** the charter's "**#arcs auto-opens one specific arc**" friction does **not**
  reproduce at HEAD — `renderArcsPage` (`js/views.js:3413-3642`) is a genuine overview, no redirect
  (Pass 3 **WL4/IA3**); update the friction note so a later pass doesn't re-file it.
- **Governance note:** VC1 proves the standing "`assembleContextData` is the *single* Yumi-context
  enforcement point" invariant is false in code (the scan path bypasses it), and the doc pointer is
  stale — it lives in `js/yumi-brain.js:178`, not `state.js`. Correct that in the VC1 fix commit.

---

## 2 · Issues ledger (the errors)

Every defect/gap/contract-violation from all three passes, **deduped** (one row per issue; pass of
origin noted). Pure enhancements and product asks are in §3. Sorted CRITICAL → LOW. `LC?` = gates a
good launch. `Pass`: P1 security · P2 craft/open-gap · P3 loop/covenant/IA.

### CRITICAL
| ID | Surface | Issue | Why / principle | Anchor | Pass | Status | LC? |
|---|---|---|---|---|---|---|---|
| VC1 | `#notebook`/`#yumi-sees` | Move-scan sends *Visible* journal entries to the model; transparency view says it can't see them | Covenant break — P-1/P-2/P-5; the view lies | `yumi-brain.js:1916-1927` vs `:222-226` | P3 | open | **yes** |
| VC1-b | Yumi scan | 5th reader `_memberBodies` feeds the grader unguarded — inherits VC1's broken filter | Widens VC1 blast radius; parallel-path class | `yumi-brain.js:1944-1951`→`:2068,:2092` | P3 | open | **yes** |
| NB1 | `#notebook` | Primary writeline text invisible (~1.1:1) — you can't see your own typing | Core action of a writing app is unusable | `components.css:9754-9755`; `views.js:2536` | P2 | open | **yes** |
| F-DL1 | global (sync-on-sign-in) | REPLACE-merge race clobbered local writes for 5 collections on a 2nd device | Silent unrecoverable data loss | `integrations.js:130` (+4 twins) | P1 | **fixed** `c70f0dc` | was |

### HIGH
| ID | Surface | Issue | Why / principle | Anchor | Pass | Status | LC? |
|---|---|---|---|---|---|---|---|
| OG1 | `#home` (signed-out) | "Welcome back." headline to a first-time visitor | False premise at peak attention | `views.js:1429` | P2 | open | **yes** |
| OG2 | `#home`/nav (signed-out) | No obvious sign-in; nav shows a fabricated "P" avatar + "Your account" | Reads "already logged in"; no start | `views.js:436-461` | P2 | open | **yes** |
| OG3 | `#arc/<seed>` (signed-out) | Seed-arc payoff + Arcs examples have no "sign in to build" CTA | Best conversion moment asks nothing | `views.js:12040-12065, 3546-3641` | P2 | open | **yes** |
| OG4 | `#home` (signed-out) | Dead/negative personal-dashboard widgets ("No arcs yet", "Nothing open") | Shows a new person their empty account | `views.js:1481-1545` | P2 | open | **yes** |
| F-PX1 | Netlify proxies | Public LLM/vision proxy is an uncapped billing relay (no model pin/token cap/rate limit) | Surprise-bill / cost-DoS once URL public | `integrations.js:18`; `claude-proxy.js:47-58` | P1 | open | no |
| CC1 | global (tokens) | Light-page meta ink `--ink-3/4→--meta` ~3.2:1 (216 sites); ink-3==ink-4 collapses the ramp | AA fail on nearly all meta/label copy | `theme.css:62-63,33` | P2 | open | no |
| CC3 | global (tokens) | `--lum-ink-4` used for functional microcopy on dark = ~3.4–4.1:1 (byte-locked foundation) | AA fail; needs a foundations decision | `lumen-amber.css:32`; c11616/11630/11657 | P2 | open | no |
| CC4 | global (tokens) | Type scale untokenized: 960 `font-size`, ~1.6% via `--fs-*`, ~190 sub-11px, half-pixel noise | "Inconsistent / hard-to-read" root | `theme.css:86-88` | P2 | open | no |
| CC5 | global (tokens) | Two full token namespaces coexist (`--ink-*` vs `--lum-*`, 719 refs); one thing styled two ways | Cross-surface inconsistency root | `lumen-amber.css` + components.css | P2 | open | no |
| CC6 | global (components) | `.seg`/`.seg-opt` redefined 8+× in two contradictory visual languages | Segmented control looks different per surface | `components.css:9761,9823,9920,9987,11308,11423,11617` | P2 | open | no |
| NB2 | `#notebook` | Register `.seg`/crow `.chip` are dark-brown controls inside a bright cream card — collision + AA fail | Composer chrome unreadable | `components.css:9761-9764,9674-9680` | P2 | open | no |
| NB3 | `#notebook` | paste/import, dictate, Talk-to-Yumi are 11.5px run-in prose, no button chrome | The "hidden buttons" friction | `components.css:11241-11246`; `views.js:1982-2011` | P2 | open | no |
| NB4 | `#notebook` | Composer never states its destination (which book / Inbox / Journal) | The "unclear book context" friction | `views.js:1965-1977` | P2 | open | no |
| BD1 | `#book/<id>` | Actions split across two zones; no single ranked primary move | Hierarchy broken — nothing reads as THE move | `views.js:8120-8194` | P2 | open | no |
| BD2 | `#book/<id>` | Canon 4-I mobile reorder unimplemented (only stacks columns, no `order`) | Mobile spec unmet | `components.css:10798-10805` | P2 | open | no |
| AF1 | `#subtheory/<id>`(+/build) | Three doorways edit the same `bodyPublic`, cross-linking — none reads as authoritative | Core build-vs-read confusion | `views.js:10522, 9065, 12628` | P2 | open | no |
| AF2 | `#subtheory/<id>` (read) | Published sub-theory read page is bare (h2 + pre-wrap + `<ol>`) — no hero/breadcrumb | Not the immersive read the craft promises | `views.js:8883-9063`; css c6449-6507 | P2 | open | no |
| AF3 | `#subtheory/<id>` | `Public\|Intellectual` register naming reads confusingly (it names two prose FIELDS, not visibility) | Correction: don't naive-relabel → see OQ1 | `views.js:9367,9373,9323,9331` (pill `:9176`) | P2 | open | no |
| H1 | `#home` | Still-Reading spines are text-only (no covers) while the shelf shows covers | Two book surfaces contradict | `views.js:1398-1411`; c11653 | P2 | open | no |
| H2 | `#home` | `.home-mspine-title` 10px, no clamp in a 52×78 box → long titles overflow | Layout overflow | `components.css:11656` | P2 | open | no |
| H3 | `#home` | `.home-wfcap` (explains the whole-field interaction) 9.5px `--lum-ink-4` ~3.4:1 | Lowest contrast on the copy that most needs reading | `components.css:11630` | P2 | open | no |
| PA1 | `#account` | Cross-links ("View your public profile →" etc.) render as mono labels w/ near-invisible underline | "Links look accidental" friction | `components.css:11899-11905` | P2 | open | no |
| PA2 | `#yumi-sees` | Bright honey panel re-pins `--ink-3/4→--meta` → 11px `#9a7e4e` on honey ~3.2:1 | AA fail on privacy-critical surface | `components.css:3490-3491` | P2 | open | no |
| WL1 | `#notebook` | Three capmode buttons all open `ImportCapture.open()`; "talk it through with Yumi" delivers a file panel | Copy-is-a-contract break | `views.js:1989,1998,2008`; `import-capture.js:400` | P3 | open | no |
| VC2 | `#subtheory/<id>` | Arc-voice evidence gathering excludes `isPrivate`-only → a *Visible* journal entry reaches Yumi | Covenant leak (VC1's narrow twin) — P-2/P-5 | `yumi-brain.js:2271-2272` | P3 | open | no |
| IA1 | `#search`/global | Global Search unreachable on mobile (desktop-only pill + ⌘K; hamburger has no Search) | Whole surface orphaned on launch device | `components.css:5400`; `index.html:26-38`; `spotlight.js:432-444` | P3 | open | no |

### MEDIUM
| ID | Surface | Issue | Why / principle | Anchor | Pass | Status | LC? |
|---|---|---|---|---|---|---|---|
| F-MA1 | `#arc/<seed>` | Signed-out viewer can drag/connect (mutate) the "read-only" seed arc locally | Read-only contract violation (non-persisting) | `views.js:12460`; `arc-constellation.js:1292`; `state.js:1991,2129` | P1 | open | no |
| F-RL1 | `publishedArcs` (rules) | Owner-update doesn't pin `authorUid` → self-misattribution via hand-crafted write | Public attribution integrity | `firestore.rules:90` | P1 | open | no |
| F-SD1 | `marginaliaForBook` | Signed-out ownership filter fails open (`&& uid` short-circuits) — defended only externally | Inverts visible-when-out → visible-to-all | `views.js:7451` | P1 | open | no |
| F-DL2 | global (durability) | Re-dirty flag in-memory only; page-hide flush was books-only for 5 collections | Multi-device staleness on write-fail+close | `state.js:2462` (+twins); flush `state.js:1025-1034` | P1 | **fixed** `d1a8f6a` | no |
| F-DL3 | global (durability) | Profile + readerModel outgoing-clobber on the sync boundary | Data-loss latch (third of the family) | (integrations.js sync path) | P1 | **fixed** `v3.180` | no |
| CC2 | global (tokens) | Dark-ground `--ink-2/3/4` all → `--muted` — only 2 ink tiers on every dark surface | Flat hierarchy (contrast passes) | `theme.css:341-344` | P2 | open | no |
| CC12 | global (tokens) | `--gold` (dark value) fails AA 2.08:1 on light in 4 floating-chrome selectors | Gold-as-text unreadable on light | `theme.css:358` vs `:64,336-340` | P2 | open | no |
| NB5 | `#notebook` | Gather→sub-theory Create disabled with no visible reason when no arc exists | Payoff dead-ends silently | `views.js:2137-2141,2171-2184` | P2 | open | no |
| BD3 | `#book/<id>` | Desktop two-column intent (4-I) not held; actions render full-width below hero | Layout divergence from canon | `views.js:8164-8272` | P2 | open | no |
| AF4 | `#subtheory/<id>` | Read-only body styled with `--ink`/`--ink-2` in a `--lum-*` wrap — legible only by ground luck | Fragile token cross-wiring | `components.css:6457,6477`; `views.js:9095` | P2 | open | no |
| H4 | `#home` | Whole-field variant has no section label; its purpose is unnamed | "Field purpose unclear" friction | `views.js:1456-1486` | P2 | open | no |
| SH1 | `#books` | Shelf toolbar has 6 near-equal controls (declutter overshot canon 4-E) | Toolbar clutter | `views.js:3858-3923` | P2 | open | no |
| PA3 | `#profile` | Deferred-social em-dash placeholders shown as prominent copy | Reads as broken/empty | `views.js:16116-16120` | P2 | open | no |
| OG6 | onboarding | First-run journey suppressed for arc-route entrants (`isArcRoute` early-return) | The most likely shared-link arrival gets no onboarding | `yumi-ui.js:844` | P2 | open | no |
| WL2 | `#notebook` | Per-note "ask Yumi" is a dead click w/ no feedback when the Yumi panel is closed | Deliberate action silently no-ops (runtime INFERRED) | `views.js:13496-13506, 2812-2823`; `yumi-brain.js:1715` | P3 | open | no |
| WL3 | `#subtheory/<id>`(+/build) | Same `status='published'` transition named "Set as milestone" vs "Publish" across faces | One act, two vocabularies (compounds AF1) | `views.js:9185` vs `:10621` | P3 | open | no |
| WL5 | `#notebook` | Journal notes shown as inviolably private yet keep a one-click "Send to sub-theory" (publishable) | Covenant call → OQ2 | `views.js:13475-13480` vs `:13549-13557`; `state.js:2268` | P3 | open | no |
| VC3 | `#book`/`#artifact` | A Book Artifact has no edit/delete after first write — visible to Yumi, not correctable | P-5 correctability limb the code asserts | `views.js:7842-7849, 10905-10966, 12956` | P3 | open | no |
| CR2 | `#notebook` | Notebook notes equally uneditable (Delete only, no Edit); marginalia/question notes ARE Yumi-visible | Same P-5 gap as VC3, generalized to notes | `views.js:13508-13611` (Delete `:13565`) | P3 | open | no |
| IA4 | onboarding→`#home` | Guided journey drops the user on Home at "Enter Praxis," not into the writing loop | Onboarding→core-loop handoff broken (+OG6) | `intros.js:387,279-288`; `yumi-ui.js:844` | P3 | open | no |
| IA5 | `#search` | Partial index — omits artifacts + marginalia; a note hit routes to the whole Notebook (no deep-link) | Findability gap | `views.js:742-875` (note route `:870`) | P3 | open | no |
| IA6 | arc 3 faces | No breadcrumb/wayfinding across Field/Read/Build (on top of AF1) | Nesting mental model invisible | `views.js:8883-9063, 10522, 12628` | P3 | open | no |

### LOW
| ID | Surface | Issue | Anchor | Pass | Status |
|---|---|---|---|---|---|
| F-RL2 | `publishedArcs`/`#walk` | `walkedBy` counter inflatable by any authed user (no per-user idempotency) — vanity number only | `integrations.js:2881`; `firestore.rules:11-15` | P1 | open |
| CC7 | global (components) | 3 near-identical primary gradient buttons diverge; a 4th re-skins the shared one | `components.css:869,1165,9660,11302` | P2 | open |
| CC8 | global (components) | `.eyebrow` re-declared 8× with drifting size/spacing/color | `components.css:804,1864,9276,10903,10979,11137,11417,11938` | P2 | open |
| CC9 | global (components) | Card radius literals (10/12/18/14/16/22/11px) coexist with tokens | `components.css` (e.g. c10899/10967/11052) | P2 | open |
| CC10 | global (components) | `--sp-*` spacing ~9% adopted (102 refs vs ~1100 literal px) | `theme.css:77-82` | P2 | open |
| CC11 | global (components) | 35 raw `rgba(0,0,0,…)` box-shadows despite warm `--shadow-*` tokens | `components.css:9668,10899,11052,11154,11302` | P2 | open |
| CC13 | global (tokens) | `--teal` as small text = 3.4–3.6:1 (legit as fill, fails only as text) | `theme.css:37,172`; c7747/7761 | P2 | open |
| NB6 | `#notebook` | "What Yumi sees" consent panel is cyan italic 14px — least-legible on privacy-critical copy | `components.css:11172,11230` | P2 | open |
| BD4 | `#artifact` | Substrate link back to the book renders as plain `--ink-3` prose, no link chrome | `components.css:3058-3065` | P2 | open |
| AF5 | `#subtheory/<id>` | Page topbar "saved · when" = `--lum-ink-4` 11px ~3.4:1 | `components.css:10886` | P2 | open |
| AF6 | `#arc/<id>` | Duplicate "+ Sub-theory" affordances (header + control-bar + Page-face) | `views.js:12148,12277,12648` | P2 | open |
| H5 | `#home` | `.home-altnote` (explains the field/left-off toggle) 13px `--lum-ink-4` ~3.4:1 | `components.css:11616` | P2 | open |
| SH2 | `#books` | Shelf toolbar `.btn` `backdrop-filter:blur(10px)` — confirm vs no-blur-on-chrome canon | `components.css:11302` | P2 | open |
| SH3 | `#books` | Shelf cover-grid status label 9.5px mono (below small-type floor) | `components.css:11352` | P2 | open |
| PA6 | `#commons`/`#reader`/`#walk` | Social meta type mixes mono-upper + serif-italic + a 9px "Example" badge competing | `components.css:11931-11955` | P2 | open |
| PA7 | `#commons`/`#reader`/`#walk` | Social-surface meta contrast (same `--lum-ink-4` root as CC3) | (per-surface; CC3 root) | P2 | open |

---

## 3 · Upgrades (candidate improvements — the COULDs)

Ideas and product-direction asks the passes surfaced — **not bugs.** They improve the app rather than
fix a defect, so they are kept separate from §2. (The post-wave GAP ledger is deliberately excluded.)
Grouped by surface.

**Shelf / galaxy (`#books`, `#account`, `#profile`)**
- **Galaxy-only reading shape.** Drop "field you read across" (bar chart) and make the constellation the
  single reading viz — luminosity = engagement, planet size = # books, genre counts (books + notes).
  *(PA5 `views.js:17708`, PA4 `views.js:16188-16204`; charter §3d.)* — redesign, medium.

**Arcs / connections (`#arcs`, `#arc/<id>`)**
- **Intersectional arcs through values (the unsolved "Connections").** `profile.values` exists but is never
  wired into any arc; there is no arc-to-arc or arc×values surface, so calling arcs "intersectional" (P-6)
  overstates what renders. Prototype how a declared value threads onto the galaxy as a legible cross-arc
  link before claiming intersectionality. *(VC4; charter §3d.)* — gap, large · **also OQ3.**

**Values capture (`#account` / login)**
- **Flagship values-preset moment.** Today values are a buried free-text "What you're reading toward"
  field; the maker wants a first-run, preset-driven values moment ("Love is liberation," etc.). Storage
  (`setProfile{values}`) already exists to receive it. *(VC5 `views.js:17213-17262`.)* — gap, medium.

**Navigation / IA (global)**
- **Promote social-discovery to a top-level surface.** `#commons`/`#reader`/`#walk` all set
  `activeRoute='account'` and have no first-class nav entry; the router branch already exists, so promotion
  needs only a nav `li` + an `activeRoute` case. *(IA2 `views.js:398-407`; `index.html:26-31`.)* — redesign,
  medium. (Distinct from the §6-deferred *signed-out* commons item — see OQ6.)
- **Re-weight the top nav.** Static About holds a permanent slot while Search/Profile/social have none;
  consider demoting About into Account/overflow and elevating Search or Commons. *(IA7 `index.html:26-34`.)*
  — polish, small.
- **Resolve the two identity destinations.** `#account` and `#profile` both render galaxy/identity; merge or
  clearly divide labor (Account = settings, Profile = public view) and dedupe the galaxy. *(IA8
  `views.js:17183-17196`; refs PA4/PA5.)* — redesign, medium.

**Onboarding**
- **Hand off into the loop.** On release, route the new user into the core writing loop (`#notebook` or the
  book they shelved) instead of leaving them on Home. *(paired with IA4 in §2; the handoff itself is the
  enhancement.)* — small.

---

## 4 · Open questions (need a product / design decision)

1. **Published/Private vs Public/Intellectual.** The maker wants the `Public\|Intellectual` toggle replaced
   with Published/Private — but AF3 shows that toggle names two prose *fields* (`bodyPublic`/`bodyIntellectual`),
   while visibility is already a separate publish pill (`views.js:9176`). Semantically-correct move: rename the
   *registers* (e.g. "Public / Working notes") and do Published/Private on the *publish pill only*. Confirm.
2. **Journal privacy vs "Send to sub-theory" (WL5).** Should journal-register notes — presented as inviolably
   private, Gather-locked — be attachable as publishable sub-theory evidence at all? Withhold the affordance, or
   add an explicit "this makes it shareable" confirmation? A covenant call.
3. **"Intersectional" arcs (P-6 / VC4).** Is the values × arc-to-arc connections dimension in launch scope, or
   is the "intersectional" claim softened in copy until it's built? (The connections visualization is the
   unsolved design problem the maker is stuck on.)
4. **`walkedBy` vanity metric (F-RL2).** Gate it to one-per-user (a marker doc) / count server-side, or ratify
   it as an intentionally-ungated vanity number? P-4 says vanity metrics stay de-emphasized regardless.
5. **Proxy billing cap (F-PX1).** Accept the uncapped-relay cost risk for launch, or add a model allow-list +
   `max_tokens` clamp + per-IP rate cap before going public? (Pass 1 flagged this as a July-8 fix-or-accept.)
6. **Social promotion vs signed-out opening.** Promoting Commons to top-level nav (IA2, in-scope) is distinct
   from opening `#commons`/`#reader`/`#walk` to signed-out users (a `firestore.rules` loosening the charter §6
   deliberately defers). Confirm the split so the two aren't conflated in one change.

---

## Residual coverage (silence not fully earned — from the Pass-3 critic)
Recorded honestly, not claimed clean: (a) on-book marginalia capture (`#book/<id>/marks` writeline) + the
note-revision step were not walked; (b) no zero-data *signed-in* first-run empty-state pass; (c) signed-in
first-touch via a shared social deep-link was not walked as an entry vector; (d) a few OBSERVED stamps
(VC4 grep-absence, IA1 mobile-exhaustiveness, WL2 runtime) read as INFERRED. Estimated Pass-3 coverage ≈ 80–85%.

_Combined from Pass 1 (`pass1-security.md`), Pass 2 (`pass2-craft-opengap.md`), and Pass 3
(`pass3-summary.md` + the four lane ledgers). Read-only aggregation — no app source changed, no pass
re-run. Format mirrors `docs/audit/praxis-2.0-audit.md` (`ed6e11b`)._
