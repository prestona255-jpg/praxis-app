PASS 3 STARTED

# Fable Deep-Dive — Pass 3: Writing-loop (§3c) + Values/Covenant (§3d) + Structural/IA (§3e)

**Track = AUDIT (read-only; changes no code).** Last finding-phase pass before July 15.
Pass 1 (security) + Pass 2 (craft + open-gap) done; Pass 2 surfaced the launch-critical
NB1 (notebook writeline invisible) + OG1–OG4 (signed-out first-run). This pass is the
last chance to surface a launch-blocker.

**Persistence / governance note.** `praxis-recon` and `praxis-reviewer` are strictly
read-only (their charters forbid creating files), so the agents RETURNED their ledgers and
the orchestrator persisted them here + printed the summary — the write-test-first
reliability goal (FIX-PROTOCOL §6) is met (content on disk, backstopped by the workflow
journal at `subagents/workflows/wf_75daf543-b02/journal.jsonl`). No app source was touched.

**Method.** 5-agent read-only workflow (run `wf_75daf543-b02`): 1 recon (scope) → 3
reviewer lanes in parallel (writing-loop / values-covenant / structural-ia, Opus/high) → 1
adversarial completeness critic. ~527k agent tokens, 0 errors.

---

## Ground truth (recon-established — DRIFT from the frozen charter)

- Charter freezes at `aa730e5 / praxis-v3.177`; **actual repo HEAD is
  `a92c499 / praxis-v3.180`** (+7 commits, on `main`).
- `git diff --stat aa730e5..HEAD`: the ONLY app-source change is `js/integrations.js`
  (+138 — the F-DL1/F-DL2/F-DL3 data-loss latches, commits `c70f0dc` / `d1a8f6a`) plus
  `sw.js` cache bumps. **`js/views.js`, `components.css`, `theme.css`, `assets/`
  are BYTE-UNCHANGED** — so every Pass 1/2 surface & craft line-anchor still resolves.
- **Consequence for Pass 3:** anchor to HEAD, and do NOT re-flag **F-DL1** (fixed, `c70f0dc`)
  or **F-DL2** (`d1a8f6a`) as open — they moved from finding to fixed since Pass 1.
- Foundations byte-locks: **OK** (both match).

---
# Fable Audit â€” Pass 3 Step 1 (SCOPE) Â· Ground-Truth Report

Read-only. No app file changed. One agent-memory file updated (`.claude/agent-memory/praxis-recon/anchors_confirmed.md`, not repo app code).

## 1 Â· Ground truth (established this run â€” NOT assumed from charter)

| Fact | Charter (Â§1) | Actual @ HEAD | Evidence | Drift |
|---|---|---|---|---|
| HEAD sha | `aa730e5` | `a92c4991ba0b184008ba7d88414f907e6d04b333` (`a92c499`) | `git log -1` | **+7 commits** |
| HEAD subject | (docs BOARD sync) | "Build 2b â€” reviewer wiring + hands-off data-loss" | `git log -1 --format=%s` | â€” |
| HEAD == origin/main | â€” | **YES** (both `a92c499â€¦`) | `git rev-parse HEAD`/`origin/main` | clean |
| Branch | â€” | `main` | `git rev-parse --abbrev-ref HEAD` | â€” |
| CACHE_VERSION | `praxis-v3.177` | **`praxis-v3.180`** | `sw.js:10` | **+3 bumps** |
| SCHEMA_VERSION | `1.11.0` | not re-derived (Pass 3 UX scope) | â€” | â€” |
| `lumen-amber.css` | 14,681 B / MD5 `9879ddb8â€¦` | **14,681 B / `9879ddb83a7e68e8378c621e473b0a57`** | `wc -c` + `certutil MD5` | **MATCH (exact)** |
| `marks.js` | 10,255 B / MD5 `772886c0â€¦` | **10,255 B / `772886c049d0d6d03d341507e602d88a`** | `wc -c` + `certutil MD5` | **MATCH (exact)** |

**foundationsOk = TRUE.** Both byte-locks match MD5 + size exactly.

### Drift adjudication â€” is the charter's frozen census still valid at HEAD?

`git diff --stat aa730e5..HEAD` â€” the ONLY changes since the charter's SHA:
- `js/integrations.js` (+138 âˆ’5) â€” the **F-DL1/F-DL2/F-DL3 data-loss sync latches** (Pass-1 territory)
- `sw.js` (2 lines) â€” cache bumps v3.178â†’v3.180
- docs/tools/hooks/.claude fix-infra only (`CLAUDE.md`, `docs/FIX-PROTOCOL.md`, `docs/LAUNCH-STATUS.md`, `hooks/pre-commit`, `tools/ground-truth`, `tools/parse-check`, `.claude/agents/*`, `proposals/README.md`)

**`js/views.js`, `assets/components.css`, `theme.css`, `assets/*` are BYTE-UNCHANGED since `aa730e5`** (`git diff --stat aa730e5..HEAD -- js/views.js components.css theme.css assets/` â†’ empty). **Verdict: every Pass 1 / Pass 2 surface & craft line-anchor remains valid at HEAD.** Pass 3 (UX/values/IA) may cite the census as-is; the charter's "may be on a later docs-only fix-infra commit" note is CONFIRMED with one correction â€” one app file (integrations.js, data-loss lane) also moved, but it is NOT a Pass-3 surface.

Provenance chain: charter's `aa730e5` = "docs: BOARD.md â€” W13 pre-audit re-census sync to 0ee5fad (rev 2)" (a docs-only commit) built on `0ee5fad` (the W13-census HEAD, itself v3.177). So even the charter's own HEAD is one docs-commit ahead of its census SHA.

## 2 Â· Surface census â€” renderRoute() @ `js/views.js:343-694` (read end-to-end)

Dispatch is sequential `if (â€¦) { â€¦; return; }` with a catch-all fallthrough. **18 render surfaces + 1 redirect** â€” exactly matches charter Â§1. No route present in code but absent from the charter's 18, and none of the 18 missing from code.

| # | Route | renderRoute case | Render fn (call) | Notes |
|---|---|---|---|---|
| 1 | `#book/<id>/marks` | `book && parts[1] && parts[2]==='marks'` :474 | `renderBookView()` :479 | ordered before #book detail |
| 2 | `#book/<id>` | `book && parts[1]` :482 | `renderBookDetail()` :487 | Pass2 BD1-3; soft-gate |
| 3 | `#artifact/<id>` | `artifact && parts[1]` :490 | `renderArtifact()` :499 | Pass2 BD4; seed-excepted |
| â€” | `#arc/<id>/new-subtheory` | `arc && parts[2]==='new-subtheory'` :511 | `location.replace` :517/519 | **THE 1 REDIRECT** |
| 4 | `#subtheory/<id>/build` | `subtheory && parts[1] && parts[2]==='build'` :528 | `renderSubTheoryBuild()` :538 | Pass2 AF1 (3 doorways) |
| 5 | `#subtheory/<id>` | `subtheory && parts[1]` :541 | `renderSubTheoryPage()` :547 | Pass2 AF2/AF3/AF4/AF5 |
| 6 | `#arc/<id>` | `arc && parts[1]` :550 | `renderArcDetail()` :558 | Living Field; F-MA1; AF6 |
| 7 | `#books` | `books` :561 | `renderShelf()` :569 | Pass2 SH1-3 |
| 8 | `#arcs` | `arcs` :572 | `renderArcsPage()` :582 | clean overview entry (no redirect) |
| 9 | `#account` | `account` :590 | `renderAccountPage()` :595 | Pass2 PA1/PA5 |
| 10 | `#about` | `about` :601 | `renderAbout()` :606 | static; Pass2 CLEAN |
| 11 | `#home` | `home` :614 | `renderHome()` :619 | Pass2 H1-5 + **OG1-4 (launch-crit)** |
| 12 | `#yumi-sees` | `yumi-sees` :626 | `renderWhatYumiSeesPage()` :631 | Pass2 PA2; transparency covenant |
| 13 | `#profile` | `profile` :639 | `renderOwnProfile()` :644 | Pass2 PA3/PA4/PA7 |
| 14 | `#commons` | `commons` :649 | `renderCommons()` :654 | **social IA promotion target** |
| 15 | `#reader/<uid>` | `reader && parts[1]` :657 | `renderOtherProfile()` :662 | social IA; F-RL1 |
| 16 | `#walk/<arcId>` | `walk && parts[1]` :665 | `renderInteract()` :670 | social IA; F-RL2 |
| 17 | `#search` | `search` :677 | `renderSearch()` :682 | Pass2 CLEAN |
| 18 | `#notebook` + empty + unknown | catch-all fallthrough :685 | `renderNotebook()` :693 | **NB1 P0 launch-crit**; writing bottleneck |

Route-ordering invariants confirmed present: sub-routes (`/marks`, `/new-subtheory`, `/build`) precede their bare-parent blocks (comments at :472-473, :502-510, :528-532). `umberGroundDark` map (views.js:373) = 16 dark keys incl. `artifact` and `'yumi-sees'`.

## 3 Â· Prior audit artifacts located

| Artifact | Path | Status |
|---|---|---|
| Charter | `docs/fable-audit-charter.md` | tracked; freezes aa730e5/v3.177; Â§3a-3f lens plan; Â§4 friction spine; Â§5 canaries; Â§6 do-not-flag |
| Pass 1 (security Â§3a) | `docs/checkpoints/pass1-security.md` | CONDITIONAL GO; F-DL1/F-DL2/F-PX1/F-MA1/F-RL1/F-RL2/F-SD1 |
| Pass 2 (craft Â§3b + open-gap Â§3f) | `docs/checkpoints/pass2-craft-opengap.md` | 49 findings CC1-13/NB1-6/BD1-4/AF1-6/H1-5/SH1-3/PA1-7/OG1-6; HALTs, explicitly hands 2 items to Pass 3 |
| W13 census | `docs/checkpoints/w13-precensus-recon.md` | per-surface anchors; own HEAD 0ee5fad/v3.177 |
| "July 6 writing pass" / friction doc | **NONE committed** | content lives ONLY in charter Â§4 + w13-precensus + Pass 2 writing-loop ledger |
| (near-name decoys) | `docs/checkpoints/writing-surface-recon.md`, `writing-trio-recon.md`, `writing-trio.md` | **UNTRACKED**, older Wave-3 recon â€” NOT the July-6 pass |

Search method: `grep -rln -i "writing-loop|friction|writing pass|july 6"` across `docs/` returned only the three audit docs + the two decoy recons; `git ls-files` confirms the writing-* recons are untracked.

## 4 Â· Pass-1 fix drift a Pass-3 reviewer MUST know

The +7 commits since the charter SHA include the actual **fixes** for Pass-1's lead finding:
- **F-DL1** (P0-decision REPLACE-merge race) â†’ FIXED, commit `c70f0dc` "F-DL1 â€” load-resolved sync latches" (v3.178)
- **F-DL2** (no page-hide flush) â†’ FIXED, commit `d1a8f6a` (v3.179)
- **F-DL3** (profile + readerModel outgoing-clobber latch) â†’ NEW, commit `9914dd9` (v3.180)

A Pass-3 reviewer citing "F-DL1 open" would be stale. These are Pass-1 territory (not Pass-3 UX/values/IA) â€” reference-only, do not re-file.

## 5 Â· Scope ambiguities a lane reviewer will hit
1. **Ground-truth drift** (Â§1) â€” cite HEAD, not charter SHA; F-DL1/2 now fixed.
2. **No standalone July-6 friction doc** â€” charter Â§4 IS the friction spine; the writing-*-recon.md files are Wave-3 decoys.
3. **`#arcs` auto-open** â€” router is clean (:572-583); the "auto-opens one arc" behavior is INSIDE renderArcsPage, trace the fn body, not the route.
4. **Social-IA promotion** â€” #commons/#reader/#walk set `activeRoute='account'` (:398-399), no first-class nav; DO NOT conflate top-nav promotion (in-scope Â§3e) with signed-out opening (charter Â§6 do-not-flag).
5. **Propose-vs-report tension** â€” charter Â§3d invites proposals for values/connections; Pass-3 base task caps at one-line direction. Reviewer must pick which governs.
6. **AF3 already corrected** â€” Public|Intellectual = two prose FIELDS, not visibility; don't re-file the naive Published/Private relabel.

## 6 Â· Mismatches ranked by severity
- **[HIGH] Charter ground truth is stale** â€” HEAD aa730e5â†’a92c499, CACHE v3.177â†’v3.180. Mitigated: all Pass-3 surface files (views.js/components.css/theme.css/assets) byte-unchanged, so the census & craft anchors hold. LOUD FLAG per instruction â€” do not silently accept charter's aa730e5/v3.177.
- **[MED] Pass-1 F-DL1/F-DL2 now fixed in code** (integrations.js +138) but charter/Pass-1 docs still describe them as open decisions â€” a reviewer reading only the docs would misreport.
- **[LOW] "July 6 writing pass" has no committed artifact** â€” a Lane C reviewer expecting a discrete friction doc will not find one; charter Â§4 substitutes.
- **[INFO] Foundations, surface count, route ordering, redirect** all MATCH charter exactly â€” clean.

*Scope established. Findings-phase (Pass 3 Lanes) not started â€” this was step 1 only.*
