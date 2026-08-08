# S-B SWEEP — the reconciled debt table

One consolidated table of every carried debt, assembled from the scattered ledgers and
**deduped** (an item in two ledgers is ONE row, both births cited). This is the sweep's
authoritative worklist. `docs/launch-runway.md` (THE CARRIED-DEBT LEDGER) is reconciled to
cite this table rather than duplicate it.

Assembled 2026-08-08 at HEAD `10b297e` (after Stage 1 `f4e7ef9` + Stage 2 `10b297e`).

**Sources inventoried (Stage 0.4):** `docs/launch-runway.md` (CARRIED-DEBT LEDGER + OPEN-VERIFY
+ residual dispositions) · `docs/studio/sequence.md` (Now/Next + BETA-READINESS) · `BOARD.md`
(L1/L2 dead-sweep rows) · `docs/studio/LAUNCH-STATUS.md` (beta blockers) · `docs/studio/overnight.md`
(ON-queue) · per-surface gap ledgers (`account.md`, `profile.md`, `yumi-panel.md`,
`import-capture.md`, `cross-cutting.md`) · `docs/checkpoints/*` recon TODOs (`r9a-build.md`,
`finish-choreo-recon.md`, `r-polish-b4-recon.md`).

**Ordering = this sweep's actionability:** Tier 1 (DELETION-CLASS — worked top-down this session)
→ Tier 2 (GUARD-COVERED — re-entry now blocked by the auto-guard) → Tier 3 (LEDGERED-WITH-OWNER —
recorded, owned elsewhere, NOT this session).

---

## TIER 1 — DELETION-CLASS (this sweep works these, top-down under THE DELETION RULE)

Each is one census + one commit. `renderAccountPage`'s reachability is resolved FIRST (ruling 3):
its two references live inside the LIVE `buildReaderModelSection` — if they are live call sites the
whole marquee is NOT unambiguously dead and is skipped + ledgered.

| # | Item | Born-where | Owner | Trigger / census gate |
|---|---|---|---|---|
| **1a** | `renderAccountPage()` (22244–23616, ~1,373 L) + export line (25263) + the 2 dead `else`-branch `renderAccountPage()` refs inside LIVE `buildReaderModelSection` (18075, 18569) | `r9a-build.md` NAMED DEBT; `launch-runway.md` (renderAccountPage row); `BOARD.md` row 11; `account.md:16`, `profile.md:17` | **S-B (this session)** | `#account`@737 redirects to `#profile` (route dead); resolve the buildReaderModelSection refs = dead `else` (rerenderFn always a fn) vs live caller. Delete only if unambiguously unreachable; else skip + ledger. |
| **1b** | `renderOwnProfile()` (20803–~21129, ~327 L) | `r9a-build.md`; `account.md:16`; `profile.md:17` | **S-B (this session)** | callers = self (20962) + `_opPublishControl` (21287/21302, itself dead). No live caller. Delete after 1a. |
| **1c** | `_opPublishControl()` (21271–21315, ~45 L) | `r9a-build.md` (private helper) | **S-B (this session)** | sole caller 21085 is inside `renderOwnProfile` (1b). Orphaned once 1b lands; verify zero-refs then delete. NOT `openPublishCeremony`/`openUnpublishConfirm` (LIVE — untouched). |
| **1d** | `_account*` helper block (17646–18059; 14 fns, ~414 L): `_accountCounts` `_accountStatCard` `_accountHostReset` `_accountToggleCategory` `_accountEmptyRow` `_accountMoreLink` `_accountBuildPanelHead` `_accountSubTheoryRow` `_accountCountSubsInArc` `_accountArcRow` `_accountMarginaliaRow` `_accountBuildCategoryPanel` `_accountReadingSince` `_accountToggleEditForm` | `r9a-build.md` (private helpers / inline blocks) | **S-B (this session) — PARTIAL, census-gated** | delete only helpers whose ONLY callers are in the deleted 1a/1b regions. **Any helper shared with LIVE `renderProfilePage`/`_pf*` code (watch `_accountCounts`, `openAccountDeleteConfirm`@17583) is SKIPPED** as census-ambiguous. A shrunken block is a valid outcome. |
| **2** | `.st-gutter` dead CSS (`components.css:10283, 10320–10334`; `.st-page .st-gutter*` incl. `.subtheory-rail-mobile-open`) | `launch-runway.md` residual disposition **R-a** ("0 js hits"); `finish-choreo-recon.md` | **S-B (this session)** | 0 JS class-emits (`grep st-gutter js/*.js` = 0), 0 in index.html → no element ever receives the class. App-byte CSS change ⇒ rides an sw.js bump. |
| **3** | Yumi-panel dead code — "dead voice-button code and a stray link rule" | `yumi-panel.md:20` (from `praxis-2.0-phase2-ledger.md`, 2026-06-27) | **S-B (this session) — CENSUS-FIRST** | census `js/yumi-ui.js` / `components.css` for the named dead voice-button code + stray link rule; delete only if provably unreachable, else report zero / skip-ambiguous. |
| **4** | Import-Capture overlay dead code (sequence S-B item names "Import-Capture overlay") | `sequence.md` S-B `## Next` item; `cross-cutting.md:60` ("orphaned functions") | **S-B (this session) — CENSUS-FIRST** | census `js/import-capture.js` for dead/orphaned code post-CD-6 door unification; **zero findings = report zero, not an error.** |

---

## TIER 2 — GUARD-COVERED (re-entry now blocked by the auto-guard §5; Stage 2)

Not deletions — these are debt CLASSES whose *re-entry* the landed+extended guard now prevents.

| Item | Born-where | Owner | Trigger |
|---|---|---|---|
| Dynamic CSS-custom-property construction (`setProperty`/concat seams) | `auto-guard.md` 5a | auto-guard §5a (live) | any added `js/*.js` line building a `--var` name at runtime → BLOCK |
| New hardcoded hex outside `theme.css` (the tokens-only rule) — the re-entry vector for the "tokenize shared light-skin literals" debt | `auto-guard.md` 5b; `profile.md:57` (the existing-literals side stays Tier 3) | auto-guard §5b (live) | any added `assets/*.css` (≠theme.css) hex value → BLOCK |
| New external dependency (JS import/require/importScripts · CSS @import / external url) | `auto-guard.md` 5c (S-B, 2026-08-08) | auto-guard §5c (live) | any added client-file external dep → BLOCK |

---

## TIER 3 — LEDGERED-WITH-OWNER (recorded; owned elsewhere; NOT this session)

Recording is not licensing. Each carries its owner + trigger; none is touched by this sweep.

| Item | Born-where | Owner / lands in | Trigger |
|---|---|---|---|
| **Tokenize shared light-skin literals app-wide** (3 surfaces share them) | `profile.md:57`; `sequence.md` S-B item | **S-B round (a later slice — NOT this dead-code session; it changes rendered pixels)** | a supervised visual slice; guard 5b blocks NEW drift meanwhile |
| **FX-1c — delete-symmetry guard** (tombstone half for arcs/subs/themes/artifacts) | `launch-runway.md`; `fx1.md`; SCAN re-confirm | its own slice (BETA-gate #1 completion) | before the beta give; state.js + integrations.js + sim + red-team |
| **FX-1b — notebook incoming-guard + 5th artifact site** | `launch-runway.md` | after B-M (now clear) | notebook creation sites + `mergeBookDuplicates` artifact repoint |
| **F-DL5 — stale-callback uid-guard race** | `LAUNCH-STATUS.md` | beta-readiness basket (co-review RM-SPLAT) | auth-generation token / per-callback uid-guard |
| **RM-SPLAT — replaceReaderModel REPLACE-splat** | `LAUNCH-STATUS.md`; R-ARC Slice 8 | beta-readiness hard review | per-record merge or auth-gen guard |
| **SLICE-8 cross-device Firestore leg** | `LAUNCH-STATUS.md` | beta-readiness | real signed-in cross-device round-trip smoke |
| **Stage-2 JWT auth (two-phase)** · **Goodreads CSV** · **Export/backup + Settings** · **Admin runbook** · **Unlisted-URL + open-auth model** | `launch-runway.md` BETA gate; `LAUNCH-STATUS.md` | BETA-READINESS gate | the launch checklist |
| **commons `#reader` fencing** (draft-sub-body leak, `integrations.js:2499-2516`) | `launch-runway.md` #5 | **FINISH-CHOREO S1** (verified side effect) | flips only when the `status==='published'` filter provably ships + is red-teamed |
| **inert XL `.lede`** (About XL specificity) | `launch-runway.md`; `r-polish-b4.md` | whenever About XL is next opened | XL-tier re-scope fixes both bands |
| **K-LISTBOX** (`.k-listbox*` presentation, 0 JS) | `launch-runway.md` | L2 control-canon / a control round | a from-scratch listbox component (NOT S-B) |
| **arc-Field glyph items** + **ARC-FIELD MOBILE TOUCH MODEL** | `launch-runway.md`; `sequence.md` Next | R10 / arc-adjacent | the protected constellation renderer's drag/connect touch model |
| **SEARCH-IA1** (Search dark→light + no mobile entry, ~56 dark selectors) | `launch-runway.md` | its own round item | ground conversion + entry point, decided together |
| **LOOK-2 — app-wide look-coherence remainder** | `launch-runway.md`; owner felt 2026-07-21 | its own row (after THE ARC STANDARD) | evidence-first Stage-0, later |
| **DW-RING-TOKEN** (raw `rgba` ring, 3 DW-3/STP2 blocks) · **DW-RING-VRADD** (`.vr-add` ringed 2/3 surfaces) · **DW-RING-1200** (rings width-gated ≥1200) | `cross-cutting.md:69-71` (DW-4 red-team) | the **D6-rubric sweep** | one `--lum-focus-ring` token + a component-level ring decision |
| **Partial-books endpoint capability** (SC8 keep-partial tray) · **vision-proxy latent stop_reason gap** | `launch-runway.md` (SCAN ERRATA-3); `scan-build.md` | a future endpoint round / backport | only if the endpoint gains partial-return / vision-proxy is re-fronted |
| **OCR author misspells** · **Hallucinated author on hard spines** | `launch-runway.md` (SCAN, felt round 4) | scan-accuracy pass (post-beta) / record-only | fuzzy author-normalize vs GB (misspells); known LLM behavior (hallucination — no fix owed) |
| **FAB overlaps "Review N" at 390** | `launch-runway.md` (SCAN) | overnight-eligible (visual, sizing-only) | a z-order / bottom-offset nudge; candidate for `overnight.md` |
| **iOS home-icon opens Safari** (pre-existing) | `launch-runway.md` (SCAN-surfaced) | a manifest / PWA-install pass | distinct from MANIFEST-WARM / MASK-SHELL (both shipped) |
| **ON-5 floating lens caption** · **ON-6 info-button overlap** | `overnight.md` (proposed) | overnight (awaiting bucket confirm) | felt-pass-required; single-surface CSS |
| **ON-7 Book-Detail h-scroll 760–1199 band** (`MW3-BKBOX`, `components.css:10615`) | `overnight.md`; `dw-3.md` | overnight / book-detail | band-scoped `box-sizing` fix; ≥1200 already shipped (DW-3) |
| **ON-1 menu overlay bleed** · **ON-4 header search sizing** | `overnight.md` (ran, awaiting-felt-pass) | Preston's morning felt pass + push | already committed `--no-verify` local (0c7fbd4 / a8a851a); felt-gated |
| **profile star-sweep graze** (RT#3 residual) | `profile.md:66` | profile visual residual | a non-central label top brushed by a star |
| **Yumi-panel FIX — untimed fetches / orphaned-turn / slow-net state** | `yumi-panel.md:19` | a Yumi round (FIX-sev, not dead-code) | wrap 3 fetches in the timeout primitive; atomic send |
| **Pass IV/V hygiene remainders** (dead files, orphaned fns, parse harnesses, strict-mode, cache strategy) | `cross-cutting.md:60,62` | S-C final sweep / program | the global hygiene sweep (broader than this dead-code session) |

---

## OPEN-VERIFY (Preston's live cards — verifications, NOT debts)

Carried verbatim from `launch-runway.md`; the work SHIPPED, evidence-of-record stands.
- **OV-1** live FX-1 race corroboration · **OV-2** the 3 PWA-only felt checks · **OV-3** MANIFEST-WARM
  splash (v3.239) · **OV-4** B-M-SA evidence-sheet safe-area (v3.239).

**Closed/shipped (deduped OUT of the carried set):** B-M-SA · MANIFEST-WARM · MASK-SHELL (all SHIPPED
v3.239); DW-RING-RADIUS (CLOSED DW-4); ON-2 (absorbed by MW-1); ON-8 (absorbed into R-POLISH L5).

---

## Sweep summary (Stage N+2 close, 2026-08-08)

**Deletion-class RESOLVED (5 source commits, sw.js v3.269→v3.275, net −99,120 app-bytes LF):**
1a `renderAccountPage` (`e5671d1`) · 1b/1c `renderOwnProfile` + `_opPublishControl` (`ca36c8c`) ·
1d 14 `_account*` helpers (`e290187`) · 2 `.st-gutter` (`f4ddc2c`) · 3 `.yumi-panel-header` +
`.yumi-panel-sight-link` (`700898f`). Item **4 Import-Capture overlay: ZERO** (already retired at CD-6).
Reviewer-HOLD comment fix (`e6e93dc`) is the final app commit (v3.275).

**SKIPPED — census-ambiguous OR scope/intent (NOT deleted; ledgered):**
- **item 5 — orphaned `.account-*` CSS** (~92 dead selectors in components.css): the marquee JS
  deletions (1a/1d) orphaned the entire account-surface stylesheet — **NEW S-B-created debt, surfaced by
  the red-team gate.** SKIPPED because the census is **AMBIGUOUS**: the live `.account-readermodel .rm-*`
  reader-model skin (dozens of rules), the shared live `.account-card` frame (reused by the reader-model,
  comma-grouped with dead `.account-stat` at 14255), and the live `.account-confirm-panel` (the skipped
  delete-confirm) are all interleaved with the dead selectors. Needs a **dedicated CSS-dead-sweep** with
  per-rule census + comma-group splitting. The 3 dead section-header comments were retired inline (`e6e93dc`).
- **openAccountDeleteConfirm** (views.js): orphaned; its deadness = a live-`#profile` **delete-account
  PRODUCT GAP** (the merged profile offers no delete-account). Delete vs. re-wire = intent decision.
- **renderShelfBookRow** (views.js): cascade-orphaned (sole caller was `_accountBuildCategoryPanel`);
  **R-SHELF F7 deliberately kept it** for a future list view. Scope-addition.
- **`.st-main` + `.subtheory-rail-toggle/close/backdrop`** (components.css): 0-emit siblings of `.st-gutter`;
  the `.st-page` mock block may be substantially dead — rides the same dedicated CSS-dead-sweep.

**REMAINING S-B round work (beyond this dead-code session):** the dedicated CSS-dead-sweep (item-5
orphaned `.account-*` + the `.st-page` mock block) · tokenize shared light-skin literals app-wide ·
Preston's rulings — openAccountDeleteConfirm (delete vs. restore delete-account) + renderShelfBookRow
(delete vs. keep).

**Gates (Sonnet):** reviewer — **code CLEAR** (reachability census, byte-exactness, parse, brace balance,
EOL, staging, foundation locks, preserved-live-fn set all verified); HOLD only on docs (3 stale comments →
fixed `e6e93dc`; ledger currency → this close). red-team — **no block, no revert**; surfaced item 5 above.
