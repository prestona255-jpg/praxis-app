# Pass 3 — LANE B: Values & Covenant (§3d)

*Read-only audit lane, run `wf_75daf543-b02`. HEAD `a92c499` / `praxis-v3.180`. Findings only — no code changed. References (not re-files) prior Pass 1/2 ids.*

---

# Fable Audit â€” Pass 3 Â· Lane B: Values & Covenant (Â§3d, P1)

**Ground truth (established this run):** HEAD `a92c499` (charter's `aa730e5` +7 commits) / CACHE `praxis-v3.180`. Per Step-1 scope, `js/views.js`, `theme.css`, `assets/*` are byte-unchanged since the charter SHA; `js/yumi-brain.js`/`js/state.js` carry only the F-DL data-loss latches (Pass-1 territory), so covenant anchors hold. Read-only; no app file changed. One agent-memory file written (not repo app code).

**Location correction (load-bearing):** `assembleContextData()` lives in **`js/yumi-brain.js:178`**, NOT `js/state.js` as `PROTOCOL.md:117` and `.claude/agents/praxis-reviewer.md:35` both assert. The covenant "lines 222-226" in PROTOCOL are correct as line numbers but in the wrong file. A reviewer trusting the doc pointer would grade the wrong file.

## Coverage matrix â€” surface Ã— the six principles (+ fabricated-data cross-cut)

`OK` = examined, principle upheld Â· `F#` = finding Â· `n/a` = principle not exercised here.

| Surface | P-1 no-summarize | P-2 private/transparent | P-3 one-artifact | P-4 no-vanity-lead | P-5 no-asymmetry | P-6 intersectional | Fabricated-data |
|---|---|---|---|---|---|---|---|
| `#home` | OK | OK | n/a | OK | OK | n/a | OG2/OG4 (prior) |
| `#books` shelf | n/a | n/a | n/a | OK (no stars lead) | n/a | n/a | OK |
| `#book/<id>` | n/a | OK | **VC3** | OK | **VC3** | n/a | OK |
| `#book/<id>/marks` | n/a | OK | n/a | n/a | OK | n/a | OK |
| `#artifact/<id>` | n/a | OK | OK | n/a | **VC3** | n/a | seed example-safe |
| `#arcs` | n/a | n/a | n/a | OK | n/a | **VC4** | OK |
| `#arc/<id>` | OK (arc-voice solicited) | OK | n/a | OK | OK | **VC4** | seed sentinel OK |
| `#subtheory/<id>` | n/a | **VC2** | n/a | OK | **VC2** | VC4 | OK |
| `#subtheory/<id>/build` | OK | OK | n/a | OK | OK | VC4 | OK |
| `#notebook` | OK (moves) | **VC1** | n/a | OK | **VC1** | n/a | OK |
| `#account` | n/a | OK | n/a | OK | OK | VC5 | PA3 (prior) |
| `#about` | OK | OK | n/a | OK | OK | n/a | OK |
| `#yumi-sees` | OK | **VC1** (understates) | n/a | n/a | **VC1** | n/a | OK |
| `#profile` | n/a | OK | n/a | OK (counts subordinate) | OK | OK | PA3 (prior) |
| `#commons` | n/a | OK | n/a | OK (titleâ†’authorâ†’meta) | OK | OK | seed badged |
| `#reader/<uid>` | n/a | OK | n/a | OK (walk/build-on trail meta) | OK | OK | OK |
| `#walk/<arcId>` | n/a | OK | n/a | OK | OK | OK | seed badged |
| `#search` | n/a | OK | n/a | OK | OK | n/a | OK |

## Yumi covenant enforcement â€” the reader census (P-1/P-2/P-5)

Every reader of `state.notebookEntries` in `yumi-brain.js`, predicate compared against the canonical two-condition filter:

| Reader | file:line | Predicate | Excludes journal? | Verdict |
|---|---|---|---|---|
| `assembleContextData` (canonical) | yumi-brain.js:222-226 | `isPrivate===true OR register==='journal'` | **YES (categorical)** | canonical |
| `getAggregateCounts` (counts only) | yumi-brain.js:386-397 | splits by register, counts only | n/a (no content crosses) | OK |
| `_visibleEntriesForScan` (NOTICE/NAME) | yumi-brain.js:1916-1927 | `isPrivate!==true` ONLY | **NO** | **VC1** |
| `gatherArcContext` (arc-voice evidence) | yumi-brain.js:2271-2272 | `isPrivate===true` ONLY | **NO** | **VC2** |

The comment at 1914-1915 explicitly claims `_visibleEntriesForScan` "mirrors the assembleContextData filter." It does not â€” it is missing the categorical journal exclusion that the canonical filter's OWN comment (218-219) says exists precisely because "getRegisterDefault can leave false." Journal register defaults private (state.js:1198), but the Notebook settings pill (`setRegisterDefault('journal', false)`, views.js:13850) lets the user set journal Visible; a subsequent journal entry then has `isPrivate=false` and leaks through the scan path.

## Ledger

| # | Surface | Issue | Principle | Sev | Type | Effort | File:Line | Observed | Fix direction |
|---|---|---|---|---|---|---|---|---|---|
| **VC1** | #notebook / #yumi-sees | NOTICE/NAME move scan sends journal-register entries to Yumi when the user has set journal Visible; canonical filter and #yumi-sees both exclude them, so Yumi holds writing the transparency view swears she cannot see | **P-1, P-2, P-5** | LAUNCH-CRITICAL | bug | small | yumi-brain.js:1916-1927 | OBSERVED | Add the `register==='journal'` categorical skip to `_visibleEntriesForScan` so the scan predicate equals the canonical two-condition filter. |
| **VC2** | #subtheory/<id> | `gatherArcContext` entry-evidence filter is isPrivate-only; a Visible journal entry attached as sub-theory evidence reaches arc-voice â€” same categorical gap as VC1, narrower trigger | **P-2** | should-fix | bug | trivial | yumi-brain.js:2271-2272 | OBSERVED | Extend the evidence guard to also skip `register==='journal'` sources. |
| **VC3** | #book/<id>, #artifact | A Book Artifact, once written, has no edit or delete affordance (card shows read-only "Open artifact â†’"; #artifact route is pure render; `openArtifactEditor`'s sole caller is gated on empty body) â€” captured content is visible to Yumi but not correctable, breaking the "correctable to the user" limb the code's own Principle-#5 comments assert | **P-5** | should-fix | small | views.js:7842-7849, 10905-10966, 12956 | OBSERVED | Give the existing artifact an Edit path (reuse `openEditor` seeded from the current record) so the "visible AND correctable" contract holds. |
| **VC4** | #arcs, #arc/<id>, #subtheory | Intersectionality is booksÃ—traditions only; `profile.values` is never referenced in any arc/sub-theory render or data path, and there is no arc-to-arc or arcÃ—values connection surface â€” the intended "ideas Ã— books Ã— arcs Ã— values" dimension is entirely unbuilt (charter Â§3d connections, Pass-3-owned) | **P-6** | should-fix | large | views.js (no arc reference to profile.values; grep-confirmed absent) | OBSERVED | Decide and prototype how a declared value threads onto the galaxy as a legible cross-arc link before calling arcs "intersectional"; today the claim overstates what renders. |
| **VC5** | #account | The values layer exists but is a buried free-text "What you're reading toward" field on the Account page â€” no flagship login moment, no presets ("Love is liberation," etc.) the maker wants; values are captured but never made a first-class covenant act | **P-6 (values-capture, Â§3d)** | nice-to-have | gap | medium | views.js:17213-17262 | OBSERVED | Promote values capture to a first-run preset-driven moment; the storage (`setProfile{values}`) already exists to receive it. |

## CLEAN (earned silence â€” verified, principle upheld)

- **P-3 uniqueness â€” CLEAN.** `ensureOneArtifact` (state.js:1099) keys by the deterministic `artifactKey(uid,bookId)` and returns any existing record untouched; the ONLY create path is `openArtifactEditor` (views.js:12956, single caller). A second artifact for the same (user,book) is impossible. (The flip side of this is VC3: the same "return existing untouched" is why there's no edit path.)
- **P-4 vanity de-emphasis â€” CLEAN.** No star rating or follower count leads any surface. Discovery cards (`_socialArcCard`, views.js:16323) render title (h3) â†’ "by <author>" â†’ a trailing `.dsc-meta` line where "N walks" sits after the revised-date, subordinate. Own-profile walk/build-on counters patch in async and do not head the hero. (F-RL2 walkedBy inflation is Pass-1 rules â€” referenced, not re-filed; the UI emphasis is correct.)
- **P-1 conversation-summary â€” CLEAN/sanctioned.** The `yumiMemory.summary` path summarizes the CONVERSATION for memory rollover, not the user's work or a book â€” the Memory-Posture distinction (docs/praxis-2.9-scope.md:19) sanctions this; #yumi-sees labels it honestly ("What Yumi remembers from this conversation").
- **P-2 #yumi-sees main-path accuracy â€” CLEAN.** `renderWhatYumiSeesPage` (views.js:14064) renders from a FRESH `getContextSnapshot()` = `assembleContextData`, the same builder the Notebook panel uses, with honest empty states per section. The main-path window is accurate. (Its accuracy is exactly what VC1 defeats: because it reads the canonical filter, it never SHOWS the journal entry the scan path already sent.)
- **Fabricated-data cross-cut â€” CLEAN where checked.** Seed/social sample arcs carry an explicit `_socialExampleBadge` (views.js:16339); the seed arc uses the `__praxis_seed__` sentinel gate. The known unframed-placeholder items (OG2 fabricated "P" avatar, PA3 profile em-dash placeholders) are prior-pass findings â€” referenced, not re-filed.

## Honest residuals

- **Reachability of VC1 is OBSERVED-in-source / INFERRED-in-frequency.** The code divergence and the settings toggle are both real and read directly; the runtime frequency depends on how many users flip journal to Visible. I did not exercise it live (read-only). The covenant is absolute regardless of frequency, and the false "mirrors" comment is itself a defect, so I rate it LAUNCH-CRITICAL.
- **P-6/VC4 is an absence claim** â€” I confirmed by grep that `profile.values` appears only in Account/portrait render, never in arc/sub-theory code. Absence proofs are as strong as the grep; I believe it complete but flag it as an absence.
- I did NOT re-audit the five-move VOICE QUALITY (charter Â§3d "does Yumi read as a partner") â€” that is behavioral/live and belongs to the writing-loop lane; I audited only the covenant/structural guarantees around the moves.
