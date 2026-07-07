# Fable Deep-Dive — Pass 3 SUMMARY (Writing-loop · Values/Covenant · Structural/IA)

**Track = AUDIT (read-only; zero code changed).** Consolidates the three Pass-3 lanes +
an adversarial completeness critic. Run `wf_75daf543-b02`, 5 read-only agents (recon →
3 reviewer lanes → critic), ~527k tokens, 0 errors. Lane ledgers:
[pass3-writing-loop.md](docs/checkpoints/pass3-writing-loop.md) ·
[pass3-values-covenant.md](docs/checkpoints/pass3-values-covenant.md) ·
[pass3-structural-ia.md](docs/checkpoints/pass3-structural-ia.md) · scope in
[pass3-scope.md](docs/checkpoints/pass3-scope.md).

## Ground truth (recon-established)
- Charter freezes `aa730e5 / v3.177`; **actual HEAD `a92c499 / praxis-v3.180`** (+7 commits, `main`).
- Only app-source drift since the freeze is `js/integrations.js` (+138 — the F-DL1/2/3 data-loss
  latches) + `sw.js` bumps. **`views.js`, `components.css`, `theme.css`, `assets/` byte-unchanged**
  → all Pass 1/2 anchors still resolve. **F-DL1 and F-DL2 are now FIXED in code (`c70f0dc` /
  `d1a8f6a`) — do NOT re-open.** Foundations byte-locks OK.

---

## The one-paragraph read
The writing loop's **data spine is sound** — every persistence step writes through the
dirty-flag + `saveState` path and signed-out states are honest, so the launch risk here is
**not lost work but broken covenant and broken wayfinding.** The single launch-critical
discovery is **VC1**: Yumi's NOTICE/NAME scan reads journal entries that the canonical filter
*and* the `#yumi-sees` transparency view both exclude, so once a user flips their journal
register to *Visible*, the transparency view **actively lies** about the app's most sensitive
content — and the critic proved a wider blast radius through an **unguarded 5th reader**
(`_memberBodies`) that feeds the proxy grader. Everything else is launch-quality polish on
three seams: the **#notebook** surface (capmode buttons that misrepresent themselves, a dead
"ask Yumi" click — batchable with the carried NB1 P0), **findability** (global Search orphaned
on mobile, a partial search index, social discovery with no top-level home), and the arc's
**three-doorway authoring** model (naming splits, no breadcrumbs). The covenant's aspirational
limbs — values-driven **intersectional arcs (P-6)** and a flagship values-capture moment — are
simply **unbuilt** (the largest honest post-launch gap). Both planted canaries were caught. One
caveat on the pass itself: "silence is complete" is ~80–85% earned — see Residual coverage.

---

## LAUNCH-CRITICAL (the fix-pipeline gate — Pass 3's new P0-class)

| # | Surface | Issue | Principle | File:Line | Ev. |
|---|---|---|---|---|---|
| **VC1** | `#notebook` / `#yumi-sees` | Yumi's NOTICE/NAME scan sends **journal-register** entries to the model once the user sets their journal register to *Visible*; the canonical filter and `#yumi-sees` both exclude journal categorically, so **Yumi holds writing the transparency view promises she cannot see.** | P-1 (never reads journal) · P-2 (private notebook + accurate transparency) · P-5 (no asymmetric knowledge) | `yumi-brain.js:1916-1927` (scan) vs canonical `:222-226` | OBSERVED (code divergence verified by critic); frequency INFERRED |
| **VC1-b** (critic CR1, part of VC1's fix scope) | Yumi scan | **5th unguarded reader:** `_memberBodies(ids)` reads `e.body` with **no `isPrivate` and no journal guard** and feeds full member bodies to `gradeUtterance` (the claude-proxy grader) at `:2068`/`:2092`; its safety is purely inherited from the broken `_visibleEntriesForScan` set. | P-1/P-2/P-5 | `yumi-brain.js:1944-1951` → grader `:2068,:2092` | OBSERVED (critic-verified) |

**Fix scope (one change, covenant-tier):** add the categorical `register==='journal'` skip to
`_visibleEntriesForScan` (make its predicate equal the canonical two-condition filter), and
guard `_memberBodies` (or confirm it only ever receives ids from the now-fixed set). Also close
the same isPrivate-only gap on the arc-voice evidence path (**VC2**, below) in the same batch.
**Governance flag:** this violates the standing "assembleContextData is the *single* Yumi-context
enforcement point" invariant (CLAUDE.md / PROTOCOL / memory) — and note the doc pointer is
stale: `assembleContextData` lives in **`js/yumi-brain.js:178`, not `state.js`.**

---

## POST-LAUNCH · should-fix (launch-quality, P1)

### Writing-loop (Lane A)
| # | Surface | Issue | File:Line | Batch |
|---|---|---|---|---|
| **WL1** | `#notebook` | "talk it through with Yumi" capmode button opens the **file-import overlay**, not a Yumi conversation — all three capmode buttons call `ImportCapture.open()` with no arg (**copy-is-a-contract** canary). | `views.js:1989,1998,2008` + `import-capture.js:400` | 🔵 notebook · ref NB3 |
| **WL2** | `#notebook` | Per-note "ask Yumi" is a **dead click with no feedback** when the Yumi panel is closed (`considerMove` bails at panel-closed; output only renders on `r.surface`). | `views.js:13496-13506, 2812-2823` + `yumi-brain.js:1715` | 🔵 notebook · ref NB3 · *runtime INFERRED* |
| **WL3** | `#subtheory/<id>` + `/build` | The **same** `status='published'` transition is "Set as milestone" on the Page and "Publish" on the Build face — one act, two vocabularies. | `views.js:9185` vs `:10621` | 🟢 arc-authoring · ref AF1 |

### Values-covenant (Lane B)
| # | Surface | Issue | Principle | File:Line |
|---|---|---|---|---|
| **VC2** | `#subtheory/<id>` | Arc-voice evidence gathering excludes only `isPrivate` — a *Visible* journal entry attached as evidence reaches Yumi (narrow-path twin of VC1). | P-2/P-5 | `yumi-brain.js:2271-2272` |
| **VC3** | `#book/<id>`, `#artifact/<id>` | A Book Artifact has **no edit/delete affordance** after first write — visible to Yumi but not correctable by the reader (the "correctable" limb of Principle #5 the code's own comments assert). | P-5 | `views.js:7842-7849, 10905-10966, 12956` |
| **CR2** (critic; extends VC3) | `#notebook` | **Notebook notes are equally uneditable** — the action row offers Gather/ask-Yumi/Add-to-arc/File/Send/**Delete** but no **Edit**; marginalia/question notes *are* Yumi-visible, so the same P-5 correctability gap applies to notes, not just artifacts. | P-5 | `views.js:13508-13611` (no Edit; Delete `:13565`) |
| **VC4** | `#arcs`, `#arc/<id>`, `#subtheory/<id>` | Arcs cross books/traditions only; **`profile.values` is never wired into any arc** and there is no arc-to-arc / arc×values surface — calling arcs "intersectional" overstates what renders. | P-6 / §3d connections | `views.js` (arc render carries no `profile.values`) · **INFERRED-from-absence (grep)** |

### Structural-IA (Lane C)
| # | Surface | Issue | File:Line | Batch |
|---|---|---|---|---|
| **IA1** | `#search` / global | Global Search is **unreachable on mobile** — only entries are the desktop-only nav pill (`display:none <760px`) + ⌘K; hamburger has no Search. A whole surface orphaned on the launch device. | `components.css:5400`; `index.html:26-38`; `spotlight.js:432-444` | *exhaustiveness INFERRED (no device smoke)* |
| **IA2** | `#commons`/`#reader`/`#walk` | Social-discovery layer buried two levels under the avatar, **no top-level home** (the §3e promotion the maker asked for). Router branch already exists → cheap to promote. | `views.js:398-407, 17196`; `index.html:26-31` | deferred-item #2 |
| **IA4** | onboarding → `#home` | Guided journey drops the user on **Home at "Enter Praxis"** instead of into the live writing loop; OG6 also suppresses onboarding on arc routes. | `intros.js:387, 279-288`; `yumi-ui.js:844` | 🟠 first-run · ref OG6 |
| **IA5** | `#search` | Partial index — **omits artifacts + marginalia**, and a matched note routes to the whole Notebook (no deep-link). | `views.js:742-875` (note route `:870`) | — |
| **IA6** | arc 3 faces | No breadcrumb/wayfinding across Field/Read/Build — on top of AF1's three doorways, the nesting is invisible. | `views.js:8883-9063, 10522, 12628` | 🟢 arc-authoring · ref AF1 |

## POST-LAUNCH · nice-to-have (P2)
| # | Surface | Issue | File:Line |
|---|---|---|---|
| **WL5** | `#notebook` | Journal notes are shown as inviolably private (lock chip replaces Gather) yet keep a one-click **"Send to sub-theory"** that attaches the journal body as publishable evidence — *rated nice-to-have but flagged as a Lane-B covenant call.* | `views.js:13475-13480` vs `:13549-13557`; `state.js:2268` |
| **VC5** | `#account` | A values layer exists but is a **buried free-text field** — no flagship login preset moment (the values-capture the maker wants). `setProfile{values}` storage already exists to receive it. | `views.js:17213-17262` |
| **IA7** | top-nav | Static **About** holds a permanent nav slot while Search/Profile/social have none — nav weight ≠ product priority. | `index.html:26-34` |
| **IA8** | `#account` + `#profile` | Two identity destinations both render galaxy/identity — unclear which is canonical "you." | `views.js:17183-17196` · ref PA4/PA5 |

---

## Fix-batching against carried launch-critical (NB1 / OG1–OG4)
- 🔵 **#notebook epicenter** — carried **NB1 (P0, invisible writeline)** + **NB2–NB6** (Pass 2) +
  **WL1**, **WL2** + VC1's notebook side + **CR2** (note-edit). One coordinated notebook fix retires
  the most launch + quality debt on a single surface. *(This is the strongest batch.)*
- 🟠 **First-run cluster** — carried **OG1–OG4** (signed-out) + **IA4** (onboarding hands off to
  Home, not the loop) + the zero-data signed-in first-run residual (below).
- 🟢 **Arc-authoring** — **AF1/AF2** (Pass 2) + **WL3** (naming split) + **IA6** (no breadcrumb).

## Resolved / stale (earned silence — no code)
- **WL4 / IA3** — the charter's "**#arcs auto-opens one specific arc**" friction (handed to Pass 3)
  **does NOT reproduce at HEAD** — `renderArcsPage` (`views.js:3413-3642`) is a genuine overview,
  no redirect. Closest live analog is Home's whole-field tap opening a single/seed arc
  (`views.js:1264-1278`). Action: mark the friction note resolved so a later pass doesn't re-file.
- **F-DL1 / F-DL2** — now fixed in code (`c70f0dc` / `d1a8f6a`); do not re-open.

## Residual coverage — silence NOT yet earned (critic-surfaced)
These were **not walked**; recorded honestly rather than claimed clean (charter §2):
1. **On-book marginalia capture** (`#book/<id>/marks` writeline) + the **note-revision** step — Lane A
   was journey-scoped to the Notebook composer; the most natural first-time writing entry was skipped.
2. **Zero-data signed-in first-run** empty-state pass (empty Home/Shelf/Arcs right after onboarding) —
   no lane walked the fable protagonist's actual first screen; ties to IA4.
3. **Signed-in first-touch via a shared social deep-link** (cold `#walk`/`#reader`/`#arc` from someone
   else's link) — an in-scope IA entry vector Lane C didn't walk (distinct from the §6-deferred
   *signed-out* commons item — do not conflate).
4. **OBSERVED→INFERRED downgrades:** VC4 (grep-absence), IA1 (mobile-exhaustiveness), WL2 (runtime).

*Both planted canaries (mobile-Search orphan · journal-scan leak) were caught. Estimated coverage
of the intended Pass-3 surface ≈ 80–85%.*

---

*Pass 3 complete. HALT answered — **VC1 (+VC1-b) routes into the fix pipeline FIRST**
(Preston's call). It is queued as its own FIX-PROTOCOL fix session (Stage 0 recon → build →
red-team → commit gate) — NOT built in this audit session (audit and building stay separate).
NB1 + the #notebook batch and the OG1–OG4 first-run cluster remain the carried launch-critical
tracks behind it.*

### VC1 fix-session starting anchors (for the separate fix prompt)
- **Primary:** `js/yumi-brain.js:1916-1927` (`_visibleEntriesForScan`, isPrivate-only) — bring its
  predicate to equal the canonical filter at `:222-226` (add `register==='journal'`).
- **Blast-radius twin:** `js/yumi-brain.js:1944-1951` (`_memberBodies`) — guard directly, or prove it
  only ever receives ids from the now-fixed set (feeds grader `:2068`,`:2092`).
- **Same-batch sibling (VC2):** `js/yumi-brain.js:2271-2272` (`gatherArcContext` evidence guard,
  isPrivate-only).
- **Covenant proof to add:** write a *Visible* journal entry → confirm it is withheld from the scan
  AND from `#yumi-sees` (data-loss/covenant tier evidence, per FIX-PROTOCOL §3).
- **Doc drift to fix in the same commit:** the "single enforcement point" claim + the stale
  `state.js` pointer (it's `yumi-brain.js:178`) in CLAUDE.md / PROTOCOL / the Principle-#5 note.*
