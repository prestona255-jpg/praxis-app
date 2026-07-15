# DWF-1 — Book Detail: the marginalia pencil, resolved as decoration

**Date:** 2026-07-15. **Base:** `2e25c23` (v3.209). **Ship:** v3.210.
**Trigger:** Preston's deployed felt pass on v3.209 read the per-card marginalia ✎ as an edit
control — click produced nothing, console silent.

---

## 1 · Stage 0 diagnosis — the brief's premise was FALSE

The brief's prime suspect was "the click path was wired through a wrapper the restructure removed
(`.bk-reading` / `.bk-cols` now emit 0×) — dead delegation." **Falsified on every limb:**

| Hypothesis | Evidence | Verdict |
|---|---|---|
| The restructure broke it | `buildMargCard` is **byte-identical** between `5cb60e4` (parent) and HEAD (`diff` clean) | FALSE |
| It was ever wired | `bk-pen` entered in **one** commit (`9a9169b`, Wave 4), never modified; `git log -S "pen.addEventListener"` finds only the Portrait/R6-Page pencils | FALSE |
| A listener exists | Runtime click → `ANYTHING_CHANGED:false`. `SPAN`, `aria-hidden="true"`, `cursor:auto`, `tabIndex:-1` | FALSE |
| Its path crosses a removed wrapper | Ancestors: `bk-pen → bk-annot → bk-marg → bk-sec → bk-main → bk-shell → bk-surface` — **all present** | FALSE |
| Stale delegation names a removed wrapper | Only `bk-cols`/`bk-reading` refs in views.js are **3 comments** (9330/9364/9507). Book-detail has **zero** delegation — all 13 sites are lines 1321 / 17972-18160 / 20089-20454, other surfaces | FALSE |

**Conclusion:** not a regression. The ✎ was decorative from birth, and read as an edit affordance.
**Preston's ruling:** resolve as decoration now (remove the glyph); the capability becomes
**MARG-EDIT**, a named item.

---

## 2 · Stage 1 — the removal

Glyph + its append removed from `buildMargCard`; `.bk-pen` and `.bk-surface .bk-pen` removed from
components.css.

| Gate | Expected | Measured |
|---|---|---|
| grep `bk-pen` — views.js | 0 | **0** |
| grep `bk-pen` — components.css | 0 | **0** |
| byte delta — views.js | negative | **-10** |
| byte delta — components.css | negative | **-6** |
| parse-check | PASS | **PASS** |
| CSS brace balance | 0 | **0** |

**Remnants (reported, deliberate):** `bk-pen` survives only in `docs/studio/mockups/book-detail.html`
and `dwp-book-detail.html` — **felt-passed historical design records, not live code**, each
self-contained (they define their own `.bk-pen`). Retro-editing a signed-off mockup would rewrite
the record of what was approved. Live code is 0 across `js/ assets/ *.html netlify/`.

**Live PASS/FAIL @1920, 3/3 marginalia cards:** `GLYPH_GONE:true` · `ALL_TEXT_RENDERS:true`
(207/300/212 chars) · `LAYOUT_INTACT:true` (`annotChildren:1`) · h-scroll 0. Text sits at x399 vs a
card edge of x375 = the 22px card padding — no orphan gap, so removal (not de-affordance) held.

### Self-caught during the build
The **first edit dropped `annot.appendChild(atext)`** along with the pen's append — every marginalia
card would have rendered **EMPTY**. **Parse, grep and byte-delta ALL passed on that broken state.**
Only reading the diff caught it. Restored and live-verified. This is the same class as the v3.209
Edit-panel orphan: mechanical gates are blind to a missing append.

---

## 3 · Stage 2 — INTERACTIVE-CONTROL SWEEP (first run of the new gate)

Own-state (text/disabled/aria/inDom) **and** global (DOM/route/state), rich fixture @1920.

| Control | Own-state | Global | Verdict |
|---|---|---|---|
| **per-card ✎** (pre-fix) | — | none | **SILENT — never wired → REMOVED** |
| became-link | — | `hash → #subtheory/…` | ✓ |
| ✎ Add marginalia | — | `editorHost 0→2` | ✓ |
| Add to an arc | — | `arcHost 0→1` | ✓ |
| Send to sub-theory | — | `subHost 0→1` | ✓ |
| status seg | `onOpt` flips | `status reading→read→reading` | ✓ |
| rating star (folded) | `starsOn 0→4` | `rating null→4` | ✓ |
| This moved me (folded) | label ♡→♥ | `moved false→true→false` | ✓ |
| value-mark name / + mark a value | — | `vrEditing false→true` | ✓ |
| Edit/more toggle | label → "Close edit" | `editPanel false→true` | ✓ |
| Edit panel — Fix this book | **`disabled false→true`, "Looking up…"** | (async) | ✓ |
| Edit panel — tradition / category | — | `trad→theory` / `cat→Literary Fiction` | ✓ |
| Edit panel — Remove from shelf | — | `removeConfirm false→true` | ✓ |
| Edit panel — ISBN input | editable, not readOnly/disabled | — | ✓ |
| backlink · Yumi bloom | — | `→#books` · `nodes 322→333` | ✓ |
| Find this book | real `<a>`, `target=_blank`, `rel=noopener noreferrer` | — | ✓ |
| **`.bk-showall`** (fixture: 7 marginalia) | **`inDom true→false`** | `folded 4→0`, `visibleCards 3→7` | ✓ |
| **arc chip** (fixture: owned arc) | `<a href="#arc/…">` | `hash → #arc/arc_fixture_own` | ✓ |

**PASS — zero silent controls.**

**Why own-state is load-bearing, proven in BOTH directions here:**
- **False positive:** a global-only probe scored the **wired** "Fix this book" as SILENT — its whole
  visible effect is `disabled=true` + "Looking up…" **on itself**. Same-tick own-state proved it live.
- **False negative risk:** `.bk-showall` **never changes its own text** — only `inDom`. A
  text-only probe would have missed it.

---

## 4 · Stage 3 — docs

- **CLAUDE.md** (Verification — non-negotiable): the INTERACTIVE-CONTROL SWEEP standing gate. **+805 B**
- **docs/studio/book-detail.md**: the false-affordance lesson + the MARG-EDIT named row. **+1312 B**
  (before the §5 correction)

---

## 5 · fix-red-team BLOCK — and it was right

**The MARG-EDIT row was written FALSE and is corrected.** I claimed "no edit-existing path anywhere
in the repo… a reader can never correct or remove it" — asserted from a **narrow grep**
(`editMarginalia|openMargEditor|editNote|editEntry`), never proven. Independently verified:

- **DELETE EXISTS** — `renderNotebookEntry` (views.js:14097; marginalia-aware `isMarg`:14103)
  appends Delete → `confirm delete` → `deleteEntry` (state.js:1974) **unconditionally**
  (views.js:14304-14348). Route: **Notebook → marginalia card → Delete**.
- **AN UPDATE PATH EXISTS** — `openMarginaliaEditor` `onSave` else-branch: `entry.body = body;
  entry.updatedAt = now` + persist (views.js:13643-13650). Create-**then-update-within-session**.

**The real gap, narrowed:** no re-entry with prefill (`entryId` resets to `null` per open), and no
edit/delete affordance on Book Detail's cards. **Tier flagged** — PROGRAM was ruled on the false
"APP-WIDE" framing; the corrected scope may not warrant it. Left at PROGRAM; a re-tier is Preston's.

The S3 docs commit was **amended** rather than followed by a correction commit: it is unpushed and
local, and its sole purpose is to land correct docs — shipping a knowingly-false claim into
`docs/studio` (which CLAUDE.md calls "THE STUDIO'S TRUTH") and correcting it afterwards would put
the falsehood in the permanent record.

**Red-team's other findings:** the missing cache bump (#1) is Stage 4 by design — it lands last with
the armed hook, exactly as this run was scoped. The missing checkpoint doc (#3) is **this file**.

**Everything else the red-team attacked came back CLEAN**, re-derived independently: the
dropped-append class (byte-proved: HEAD minus its 2 comments == base minus the 5 pen lines), other
consumers, structural selectors (`:first-child`/`nth`/`+`/`~` on `bk-*` → none), `.bk-annot{gap}` vs
the ≥1200 grid, token orphans (`--lum-gold` 204 uses, `--bk-gold-deep` 10), ES3/parse (harness
self-validated), EOL, and scope (exactly 4 files; restructure anchors byte-identical).

---

## 5b · ⚠ INCIDENT — a read-only reviewer agent reverted a committed fix via my INDEX

**The most important thing this run learned. `praxis-reviewer` returned HOLD on a real, verified
regression that its own tooling caused.**

**What happened.** The S3 amend (`ae8b73d`) shipped with `js/views.js` and `assets/components.css`
**reverted to base** — the pencil was back in the committed tree (`git show HEAD:js/views.js |
grep -c bk-pen` → 1) while the working tree still held the fix (→ 0). `git diff 2e25c23..ae8b73d
--stat` listed **only docs**. The checkpoint in that same commit asserted "grep bk-pen: 0/0" and
"GLYPH_GONE:true" — false against the tree it shipped in.

**Mechanism (root-caused, not guessed).** The reviewer documented running
`git --work-tree=<scratch> checkout <sha> -- js/views.js` to measure byte deltas in the file's real
CRLF convention. **`git checkout <sha> -- <path>` writes the INDEX of the real repository even when
`--work-tree` points elsewhere.** That reset my index entries for both files to `2e25c23`'s blobs.
`git commit --amend` then committed **the index** — silently dropping S1's fix from the tree while
leaving it in the working tree. `01bd271` (S1) was never damaged; only the amend's tree was.

**Three lessons:**
1. **"Read-only" agents are not read-only to git plumbing.** A pathspec `git checkout` mutates the
   index. Never run one against a live repo with staged work — use `git show <sha>:<path> > file`
   or a true `git worktree add`.
2. **`--amend` commits the INDEX, not your diff.** With concurrent agents touching the repo, amend
   is unsafe: it silently absorbs whatever the index holds. CLAUDE.md already prefers a new commit
   over an amend — this is the concrete reason. **Always re-verify the tree after an amend**
   (`git diff <base>..HEAD --stat` must list every file you expect).
3. **The gate agents must not run concurrently with commits.** DW-POLISH's reviewer already warned
   "the working tree changed three times during this review"; here it went further and changed the
   tree itself.

**Resolution:** re-staged both code files (verified byte-identical to `01bd271`'s tree) and
re-amended, so `2e25c23..HEAD` carries all five files and `01bd271..HEAD` is genuinely docs-only.
Verified after the fact, not assumed.

**Also corrected from the reviewer:** book-detail.md's byte delta is **+2441**, not the +2494 the
first amend claimed — I restated it without re-measuring after the MARG-EDIT correction. And
`broken.js` (981,362 B of agent scratch at the repo root) removed.

## 6 · Residuals

- **MARG-EDIT** — named, tier flagged for re-ruling (§5).
- **DWF-1-MOCKUPS** — `bk-pen` remains in the two felt-passed mockups by design (historical records).
- `.bk-annot{gap:10px}` is inert at one child; kept as MARG-EDIT's pencil seat.
