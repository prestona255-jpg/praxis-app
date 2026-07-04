# BOARD.md — Praxis Coverage Board

**What this is:** the single committed picture of every surface in the app
and where it stands on each build dimension. Gaps are visible as cells,
not memories. This file — not chat history, not any agent's recollection —
is where "what still needs converting?" gets answered.

**Maintenance rule (binding):** any wave that changes a cell updates this
file IN THE SAME COMMIT (docs ride with the diff). The updating agent
re-verifies the cell's evidence at current HEAD before flipping it; line
anchors below drift as files grow, so re-grep before relying on them.

**Source of truth for this revision:** Ground-Truth Census v2, July 3 2026,
HEAD `c3f0d2d` (`praxis-v3.172`). Route census = `renderRoute()` @
`js/views.js:343`.

Legend: ✅ done · ◐ partial · ✗ absent · — not applicable · ? ambiguous

---

## 1 · Surface × dimension matrix (18 render surfaces + 1 redirect)

| # | Surface | Amber | Mobile @759 | Empty state | Logged-out | Load/Error |
|---|---------|-------|-------------|-------------|------------|------------|
| 1 | `#home` renderHome | ✅ v1423 | ✅ css11829 | ✅ v1464/1499/1546 | ✗ no gate (same as zero-data) | ✗ sync |
| 2 | `#notebook` + catch-all, renderNotebook | ✅ v1702 | ✅ css11426 | ✅ v1999/2039 | ✅ hard v1709 | ✗ sync |
| 3 | `#arcs` renderArcsPage | ✅ v3399 | ✅ css1894 | ✗ by-design v3454 | ◐ omission v3441 | ✗ sync |
| 4 | `#books` renderShelf | ✅ v3675 | ✅ css11554 | ✅ v4720 | ✅ soft CTA v3771/4764 | ✗ sync |
| 5 | `#book/<id>/marks` renderBookView | ✅ v7581 | ✅ css10860 | ✅ v7585/7659/7698 | ✗ **NO GATE — gap vs parent** | ✗ sync |
| 6 | `#book/<id>` renderBookDetail | ✅ v8052 | ✅ css10860 | ✅ v8056 | ✅ soft `.bk-signin` v8164 | ✗ sync |
| 7 | `#artifact/<id>` renderArtifact | ✗ v10822 | ✗ css3060 base only | ✅ v10825/10848 | ✗ v10839 | ✗ sync |
| — | `#arc/<id>/new-subtheory` (redirect) | — | — | ? state:1905→#arcs | ✗ **L4: no auth gate on createSubTheory (state.js:1909)** | — |
| 8 | `#subtheory/<id>/build` renderSubTheoryBuild | ✅ v10482 | ✅ css11276 | ✅ v10468/10671/10803 | ✗ (v10615 = consent lookup, not gate) | ✗ sync |
| 9 | `#subtheory/<id>` renderSubTheoryPage | ✅ v9063 | ✅ css11161 | ✅ v9048/10069+ | ✗ (consent lookup only) | ✗ sync |
| 10 | `#arc/<id>` renderArcDetail (the Field) | ✅ v11983 | ✅ css11686 | ✅ v11940/11953/12439 | ? combined gate v11953 → "not found" copy, no sign-in CTA | ✗ sync |
| 11 | `#account` renderAccountPage | ✅ ember v16933 | ✅ css5792/10362/11887 | ✅ v17683/17826 | ✅ hard v16942 | ✗ sync |
| 12 | `#about` renderAbout | ✗ v18148 | ✗ | — static | ✗ static | — static |
| 13 | `#yumi-sees` renderWhatYumiSeesPage | ✗ v13952 | ✗ css3482 base only | ✅ per-section v13827–13925 | ✗ | ✗ sync |
| 14 | `#profile` renderOwnProfile | ✅ ember v15827 | ✅ css12078 | ✅ v16042 | ✅ hard v15832 | ◐ social stats silent-fail (v16114) |
| 15 | `#commons` renderCommons | ✅ ember v16421 | ✅ css12217 | ✅ v16472 | ✅ hard v16416 | ✅ v16459/16465 |
| 16 | `#reader/<uid>` renderOtherProfile | ✅ ember v16508 | ✅ css12217 | ✅ v16592 | ✅ hard v16501 | ✅ v16517/16530 |
| 17 | `#walk/<arcId>` renderInteract | ✅ ember v16625 | ✅ css12217 | ✅ v16634/16641/16805 | ✅ hard v16620 | ✅ v16626/16759 |
| 18 | `#search` renderSearch (W8) | ✅ v1025 | ✅ css11768 | ✅ v963 | ◐ soft CTA v992–1000 | — sync by design (no fetch) |

**Tallies:** Amber 15/18 (✗ artifact, about, yumi-sees) · Mobile 16/18
(✗ artifact, yumi-sees) · Empty 15✅ 1✗ 1? 1— · Logged-out: 7 hard,
3 soft, 8 none/partial (three coexisting philosophies — see §3, L3) ·
Load/Error: 3✅ 1◐, rest sync-render with none.

## 2 · Panels & overlays (non-router)

| Panel | Entry | Amber |
|-------|-------|-------|
| Yumi panel | yumi-ui.js:1333 / Bloom FAB :912/:998 | ✅ `.lum-amber-deep` |
| Import/Capture | ImportCapture.open, wired v1456+ | ✅ `.lum-amber-deep` |
| Spotlight ⌘K | spotlight.js:341/353 — nav pill now routes `#search` (:442); overlay = ⌘K only | ? pre-Amber styling — verify |
| Pickers ×8 (arc/sub/gather/file-to-book/mark…) | v12960/13077/13003/13437/2284/2945/8377 | ? unverified as a set |
| Confirms ×6 (deletes/reset/unlink/review) | v12596/12699/8608/8678/14102/6654 | ? unverified as a set |
| Reader-portrait offer | v17432 | ? |
| **Intro journey** (first-run, 7 steps) | intros.js `startJourney`; body-level overlay; fired by yumi-ui `maybeStartOnboarding` (scripted chat greeting replaced) | ✅ `.lum-amber` |
| **Intro per-page panels ×12** | intros.js `maybeShowPanel`; ls/sv seen-flags; 8 auto-show surfaces (home·shelf·notebook·field·search·commons·account·sees) | ✅ dual-ground |
| **Intro ⓘ re-summon + About Orientation** | intros.js `updateSummon`; `buildAboutOrientation` single-sources INTROS into renderAbout | ✅ |

## 3 · Open-items ledger (from Census v2 mismatches)

| ID | Item | Disposition |
|----|------|-------------|
| H1 | BUILD_STATE.md stale 49 versions (v3.123/9c6608b vs v3.172/c3f0d2d) | HOUSEKEEPING WAVE (with this file's first commit) |
| M2 | CLAUDE.md:32-33 load order reversed (load-bearing) + omits spotlight/writing-canvas/import-capture | HOUSEKEEPING WAVE |
| M3 | CLAUDE.md:287-290 fossil cache target v3.107→108 | HOUSEKEEPING WAVE |
| L4 | createSubTheory has no auth gate — signed-out can mint a draft via stale redirect link | W10 (small code fix, pre-audit) |
| L2 | Loading/error states absent on 13 local surfaces | W10 system-states pass |
| L3 | Logged-out handling = 3 coexisting philosophies (hard/soft/none) | W10 pick-one + retrofit; CRAFT.md coherence bar |
| L1 | Dead: tfa-stage gradient (tradition-forms-arc.js:73); .shelf-list css2304; .notebook-leaf-* css4925; legacy .st-page css10067/10115; DEAD FN renderArcConstellation (arc-constellation.js:404, zero call sites) | W10 dead-code sweep |
| M1 | Field mark "flat-fill" debt is NOT clean — url(#tfa-shine) overlay exists (arc-constellation.js:954) | Re-inspect before any polish build; AUDIT INPUT |
| M4 | --subtheory-5 #7CC6DA ≈ --lum-cyan #7fd0f0 (cyan collision; marks.js:25 labels it "cyan") | AUDIT INPUT (color system ruling) |
| M5 | Haystack duplication spotlight.js:47-184 vs views.js:742-876; divergent matching (title-only vs title+author) | LOGGED DEBT — consolidate when spotlight next touched |
| M6 | integrations.js byte anchor re-baselined → 127,249 B (972fed6) | DONE (recorded here) |

## 4 · Wave board (pre-audit)

| Wave | Scope | Status |
|------|-------|--------|
| Housekeeping | Commit this file + fix H1/M2/M3 (docs only, zero code) | NEXT |
| W9 | Intro system SHIPPED: first-run guided journey (real writes: shelve/note/consent) + 12 single-sourced per-page panels (dual-ground) + About Orientation; scripted chat greeting replaced. About kept bright (Amber ✗ unchanged, §1) | SHIPPED v3.173 |
| W10 | Polish sweep: artifact + yumi-sees Amber/mobile conversion · loading/error states (L2) · logged-out unification (L3) · L4 auth gate · dead-code sweep (L1) | AFTER W9 |
| Pre-audit prep | CRAFT.md + metrics · sound design doc · seed real arcs · writing-loop diagnosis session · census delta → refresh this board | AFTER W10 |
| AUDIT | Fable, findings-report-only; charter = correctness + craft + writing-loop deep-dive; after July 7 | GATED ON ABOVE |

## 5 · Post-audit program queue (order set by audit findings)

Writing-loop rebuild + Generative Yumi ("alive") — co-flagship, intertwined ·
Sound build (Yumi voice + ambient, from the design doc) · Admin/moderation
surface (fenced firestore.rules edit — own careful wave; interim backend =
Firebase console) · Goodreads CSV import · Data export/backup + Settings
surface · Activity/notifications surface · Nav rail / app shell (own
program, re-parents all surfaces) · views.js split strategy (per audit
ruling on the ~810 KB monolith).

## 6 · Deferred-feature ledger (audit inputs)

Generative Yumi layer (gated on external Yumi eval) · Import
review-before-commit flow · Import paste-path Cancel · Arcs consequence
fields (→6.5 publish model) · Book-detail alight-predicate widening ·
Top-nav Profile link · Reversible set-aside for reader-model threads ·
Theme action · Nav search-placeholder truncation · "Tap to find lenses"
starburst orphaning · Per-note route (note results land on #notebook) ·
W8: mark gradient-depth polish (see M1) · Dictation-quality tuning.

---
*Board revision 1 — derived from Census v2 (c3f0d2d). Next refresh: the
census delta after W10, before the audit charter freezes.*
