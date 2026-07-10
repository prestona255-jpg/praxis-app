# R6 Sub-theory (DEEP) — Stage 0 recon + parity extraction

**HEAD** `b1c4518` (== origin/main). **Cache** `sw.js:10` = `praxis-v3.189` → bump target
**v3.190** (Stage 7). **Hook** ARMED, **FIX-PROTOCOL** v1.2. App code (js/assets/index/sw)
**clean** at session start. Parity source: `docs/studio/mockups/subtheory.html` (rev 1, felt-passed),
1160 lines, 4 panels. Prime directive: **mockup wins** on any prompt-vs-mockup disagreement.

## Verification rig — CONFIRMED AVAILABLE (no Node)

`.claude/launch.json` → **`praxisapp`** config serves the static root via `.claude/static-server.ps1`
(PowerShell) on **:8760**. Serves the **working tree**, so the unpushed build is live-testable.
Same rig R4 Notebook used. Auth model: `getCurrentUser` is localStorage-based → seed a synthetic
`TESTUID` + signed-out, **no real account touched** (test-account rule honored). `preview_start
{name:"praxisapp"}` at the first visual gate.

## Anchors (grep-confirmed, both agents independently)

| Target | Live line | Notes |
|---|---|---|
| `renderSubTheoryReadOnly(subTheory, mode)` | **9569**–9750 | the read body; `--ink` family (AF4) |
| `renderSubTheoryPage(id)` | **9751**–11127 | Page face; has its own canvas |
| `renderSubTheoryBuild(id)` | **11128**–11490 | Workshop; has its own canvas |
| `buildNotebookRightLeaf(user, activeKey)` | **2078**–2265 | the working leaf |
| `notebookCreateSubTheory` (mint) | **2362**–2383 | auto-navs at **2382** (`location.hash=`) |
| Page canvas call | **10086**–10098 | surfaceId `subtheory-page`, binds `bodyPublic` |
| Build canvas call | **11260**–11270 | surfaceId `subtheory-build`, binds `bodyPublic` |
| Page pill | **9862**–9884 | "Set as milestone"/"Milestone set" (9871) |
| Build pill | **11222**–11238 | "Publish"/"Published · private" (11227) |
| `parseCitations(bodyText, evidenceTitles)` | **9495**–9546 | title-substring match, positions NOT persisted |
| citeTitle/citeLine helpers | 9598–9636 | build evidenceTitles from live evidence |
| arc sibling sort `_arcDetailBuildSubTheoryData` | **11632**–11650 | oldest-first by `createdAt`, tie id — walk-nav source |
| Page W12 gate | 9756–9789 | seed exemption at 9765 |
| Build W12 gate | 11132–11141 | no seed exemption |

**components.css:** `.subtheory-readonly-*` 6295–6358 · legacy `.st-page` 9742–9804 (superseded) ·
`.st-page.lum-amber-deep` 10718–10833 (+@759 10836–10853) · `.st-build.lum-amber-deep` 10864–10948
(+@759 10951–10966) · saved-cue `.st-tb-saved` 10732 / `.stb-saved` 10889 (both `--lum-ink-4`).

**Stale-frontmatter doc drift (fix with the diff):** `subtheory-page.md:4,13` says `9119` (actual 9751);
`subtheory-build.md:4,13` says `10576` (actual 11128). Correct in the relevant stage commit per "docs ride
with the diff." Do NOT set `mockup:`/`state:` — Preston's at felt pass.

## Canvas verdict (repo-mapper) — NO TOUCH

`insertAtCaret(text)` exists at `writing-canvas.js:403` (exposed :653) and is **already wired** on both
sub-theory surfaces: Build `weaveNote` `views.js:11277-11286` (`insertAtCaret` + `addEvidence`), Page
`insertCitationAtCursor` `views.js:10018-10022`. Stage 4 "weave in" reuses `weaveNote` verbatim; all new
code sits in `views.js`. `writing-canvas.js` stays closed. Must-not-edit set (for the diff gate): `flushSave`,
`scheduleSave`, `snapshot`, `scheduleSnapshot`, `normalize`, `serializeMarkdown`, `setValue`, `onSave`.
Four canvas mounts total: notebook-forming-name (2148), subtheory-page (10086), subtheory-build (11260),
marginalia (13715). `--lit` + citations are **caller-owned** (views.js), not the module.

## Woven-state (census §4) — STORED

`notebookCreateSubTheory` calls `addEvidenceToSubTheory(...,{kind:'entry',refId})` per gathered note →
lands in `subTheory.evidence[]` (`refId` → note id). Same array the Build rail's `isEvidenceAttached`
(11431, 11462-11463) reads. Founding-gather + later-woven notes are **not distinguished** in storage.
Woven = `isEvidenceAttached`. "woven into ¶N" = render-time paragraph-index derivation (new logic, no field).

## ABORT DETERMINATION — CLEAR (no abort)

- Stored-schema change required? **NO** (§9: status/publishedAt/bodyPublic/evidence[]/arcId/createdAt all exist).
- Parity demands a RAILS edit? **NO** (zero RAILS markers in views.js).
- Canvas edit required? **NO** (insertAtCaret already public + wired).
→ Per the plan's Stage-0 clause ("stop only if abort"), no abort. Proceed pending go-ahead.

## Findings carried (flagged, NOT auto-fixed)

1. **MEDIUM — no ownership check on non-seed sub-theories** (census §7). Neither `renderSubTheoryPage`
   nor `renderSubTheoryBuild` checks `subTheory.userId === user.uid` — a signed-in user can open/edit
   another user's `#subtheory/<id>[/build]` by hash. Client-side only; Firestore rules are the presumed
   backstop (unverified). Directly adjacent to Stage 2's "Page = read/author-view." **Out of R6 scope**
   (mockup models no owner-vs-visitor gating; sequence.md defers that to R9). Stage 2 preserves W12 gating
   exactly per the plan; this gap is flagged for Preston, not touched.
2. **LOW — doc drift** (stale frontmatter line numbers, above) — fix with the diff.

## Prompt ↔ mockup reconciliations (mockup wins — for Preston's eyes)

- **Stage 3 gate "exactly ONE Finish control across both surfaces"** vs the mockup, which keeps **two**:
  `finishA` (workshop, Finish/Finished) AND `finishC` (Finished-room reopen pill, published state only).
  The Page-DRAFT pill is removed (R#2); the Page pill renders ONLY when `status==='published'` (as
  "Finished", reopenable). Mockup wins → I keep finishA + finishC; the "one Finish" gate is read as
  "Finish removed from Page-draft; workshop always; Page reopen only when published."
- **Stage 3 "kill Write|Preview toggle"**: no such toggle exists LIVE (it was a mockup-R0 element, killed
  in mockup-R1). Live grep==0 already; nothing to remove — "Open the page →" door is net-new markup.

## Parity checklist (carried through every gate)

**S1 Vocabulary** — Page pill 9871 "Set as milestone"/"Milestone set"→"Finish"/"Finished"; Build pill
11227 "Publish"/"Published · private"→"Finish"/"Finished". Stored status writes byte-identical. Gate: grep
old strings==0; status-write diff clean.

**S2 Page=read** — remove Page canvas call 10086-10098 + Page-only satellites (insertCitationAtCursor,
stBumpLight, publicBody, cite-preview pane) as mechanical casualties; Draft(status=draft)=`.stb-warm-dim`
read (readonly body, quiet `.st-edit-door-outline`→/build, NO finish, NO saved chrome, maturity/provenance,
Yumi note, connections); Finished(status=published)=full-amber + `.st-room-threshold` + finishC reopen +
`.st-edit-door-quiet` + superscript cites + private-evidence filtered + `.st-walknav` (siblings via
11632-11650, arc-name spine). Preserve W12 (9756-9789). Gate: parity vs panels b/c; grep Page canvas call==0;
visitor smoke.

**S3 Workshop sole editor** — finishA Finish here; `.stb-openpage` "Open the page →"→#subtheory/<id>;
Focus Mode `.stb-focus-toggle` (net-new additive); `.stb-warm-dim` ground. Citations absorbed (weaveNote
extant). Gate: parity vs panel a; toggle grep==0; Finish placement per the reconciliation above.

**S4 Pull system** — rail search/filter (book `<select>` + free text, `filterPull`); woven/unwoven per
passage (`isEvidenceAttached` → lit/unlit `.stb-weave-dot`); "woven into ¶N" caption (new render logic);
"+ weave in" reuses `weaveNote`/`insertAtCaret`. Gate: `writing-canvas.js` untouched in diff; no Yumi gen.

**S5 Notebook birth-only** — keep gather→name→mint; drop any prose affordance (decision #1); mint stays
(remove auto-nav 2382 → reveal newborn card + "Continue in the workshop →"). Storage untouched (N0). Gate:
parity vs panel d; forensic smoke capture→gather→mint→reload, zero loss.

**S6 Skin+debt** — marginalia→amber-family (R#7); Yumi margin no-blue gold/amber (R#8); AF4 readonly wrap
→coherent `--lum-*` (mockup 529-537); AF5 saved-meta `--lum-ink-4`→`--lum-ink-3`; `.stb-warm-dim` glass
depth (R#9, mockup 486-513); delete stale toggle comment (old ~10073); purge orphaned selectors. 4th
light-ink tier `--lum-ink-4` warm-dim is a build-time stand-in — mint once in the token sheet if needed +
flag. Gate: computed contrast ≥4.5:1 table; token provenance; dead-selector grep==0.

**S7 Red-team+ship** — fix-red-team whole diff; full forensic smoke (all routes, draft+finished, signed-out,
notebook mint, R5-arc no-bleed spot-check) on :8760; praxis-reviewer; cache bump→v3.190; final commit. STOP.

## Commit plan (local, unpushed; explicit `git add <path>` only — 92 pre-existing untracked entries in tree)

S1→S6 each: one local commit (em-dash subject), views.js/components.css as scoped + the stage checkpoint.
S7: cache bump + final commit. Nothing pushes. Round does NOT close (Preston's felt pass).
