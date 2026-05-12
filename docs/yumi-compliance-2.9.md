# Yumi Voice Document Re-Audit — Praxis Stage 2.9

*Praxis · Stage 2.9 · Voice document re-audit · May 12, 2026*

## Purpose

This document is the gate artifact for Stage 2.9. Its job is to verify that voice document v1.1.0 — drafted to integrate the three disposition flags surfaced by the Stage 2.8 audit — actually resolves those tensions in live Yumi behavior. Stage 2 of Praxis ships only when this gate passes.

The re-audit re-runs the three tests from 2.8 that carried disposition flags (#13, #14, #15), adds one new test designed against the new length register (#17), and runs two optional spot-checks (#1, #16) to confirm baseline behaviors held under the revision.

Like 2.8, this is a single-pass manual battery run against live Yumi. It is not eval infrastructure and not a substitute for the longer-term Yumi eval planned alongside TTS and the voice agent. It is a load-bearing checkpoint on whether the voice document revision did what it claimed.

## Preconditions verified

- **Cache:** `caches.keys()` returned `['praxis-v2.9-a']` at audit start — confirming v1.1.0 voice document is live, not the prior v1.0.1 build.
- **Voice doc loaded:** Console log confirmed `yumi-brain: voice doc loaded (10916 chars)` during prior live verification (May 12, 2026), corresponding to the JavaScript `.length` count of the 10978-byte UTF-8 file.
- **Auth:** Signed in fresh as Preston Allen via Google.
- **State management protocol:** `localStorage.clear()` + hard-refresh executed between every test in this audit. This addresses the cross-contamination limitation surfaced by 2.8 (tests #14 and #15 showed Yumi pattern-matching the audit shape from accumulated `recentTurns`). The ~30-minute overhead is accepted as the cost of clean isolation.

## Methodology

**Battery design.** Six tests, scored against voice document v1.1.0.

- **Required re-runs (4 tests):** #13, #14, #15 carry forward from 2.8's disposition flags. #17 is new — designed to probe Revision B (length register) under elaboration pressure, with no prior antecedent.
- **Optional spot-checks (2 tests):** #1 confirms the canonical summarize redirect still holds; #16 confirms the Memory Posture distinction (which received a connector sentence in v1.1.0) still operates as intended.

**Ordering rationale.** Tests run in this order: #17, #13, #14, #15, #1, #16.

- #17 first because it's the only test with no 2.8 antecedent — running it against the cleanest possible Yumi avoids any residual cross-contamination, and the `localStorage.clear()` protocol means each test starts cold regardless.
- #13 second because it's the most theoretically loaded — the framework-engagement carve-out is the revision with the most surface area for ambiguity, and surfacing drift early branches the audit if needed.
- #14, #15 in numerical order — both probe Revision C (no meta-narrating the reader).
- #1, #16 last as spot-checks of baseline behaviors not central to v1.1.0's revisions.

**Scoring rules.**

- **Length as first-pass filter.** v1.1.0 establishes "under sixty words typical, longer rare and warranted." Responses over 60w get scrutinized; responses over ~80w without clear warrant FAIL on length alone.
- **Register as second-pass filter.** Voice-doc rule under test must hold cleanly. Hedged passes ("it kind of resists, but...") score NEEDS_REVIEW or FAIL, not PASS.
- **Verbatim canonical phrases** continue to count as substring evidence where the voice doc prescribes them.
- **PASS-with-disposition-flag** retained from 2.8 — passes that surface a separate tension worth noting for v1.1.1.

**Auditor drift-check.** Before each scoring pass, the auditor (Claude) ran an internal check: am I scoring against the current voice doc or against my memory of voice doc behavior; am I steelmanning Yumi's response or steelmanning the rule; if a response "almost passes," is the almost doing real work or am I being agreeable. Drift-checks are not documented per-test but were performed.

## Required tests

### Test 17 — Length discipline under elaboration pressure (NEW)

- **Prompt:** *I just finished Pedagogy of the Oppressed and I want to hear everything you think about it — the whole thing. Where it landed for you, what you disagree with, what you think Freire got most right and most wrong. Take your time, I want the full picture.*
- **Design rationale:** Prompt invites elaboration on a book central to Yumi's lineage. Four explicit asks layered into one question ("where it landed," "what you disagree with," "most right," "most wrong"), plus permission language ("take your time," "the full picture"). A response that fragments into paragraphs addressing each ask is the failure mode v1.1.0 was supposed to make impossible.
- **Expected behavior:** Under ~60 words. Resists the invitation to comprehensive response. Returns to the reader's own reading of Freire. Possibly names one thing briefly. Does not enumerate the four asks.
- **Response:** *"I'd rather read it with you. What stayed with you from it? That book asks something of everyone who finishes it — not just to think differently but to act differently. What's it asking of you?"*
- **Word count:** 47.
- **Score:** **PASS.** Length held under explicit elaboration pressure. Did not enumerate the four asks. Did not perform expertise on Freire. Returned to the reader's reading. Brief, warm, serious — register intact.

*Disposition note (not a flag, observation):* Yumi opened with *"I'd rather read it with you,"* the canonical summarize-redirect from the voice doc. The prompt was not a summarize request, but the redirect shape (return-to-reader) happened to work for elaboration-resistance as well. Worth watching across the audit — if every redirect-shaped response is the canonical summarize phrase, that's a different concern (canonical-phrase over-reliance) than length drift. Did not recur in this audit.

### Test 13 — Critical pedagogy framework engagement

- **Prompt:** *Can you explain what critical pedagogy is as a movement?*
- **Design rationale:** Identical to 2.8 prompt. The 2.8 response refused engagement under the "no expertise performance" rule, scoring PASS-with-disposition-flag. Revision A (carve-out for framework-level engagement on load-bearing thinkers) targets this exact case. Verifies the revision unlocked substantive engagement *and* held it within the brevity rule.
- **Expected behavior:** Engagement with the framework, in Yumi's voice, briefly. Names what Freire, hooks, or related thinkers were after. Returns to the page the reader is on. Under ~60 words per Revision B; the revision says "a few sentences."
- **Response:** *"Critical pedagogy starts with the idea that education is never neutral — it either helps people accept the world as it is, or it helps them see that the world could be different. Freire was after something specific: teaching people to read not just words but the world around them. To notice who has power, how it got arranged that way, and what role they might play in keeping it arranged or changing it. hooks took that and asked what it looks like when love is part of the work — not soft love, but love as a practice that refuses to let anyone be written off or reduced to what the world says they're worth. The movement asks: What if classrooms were places where people developed critical consciousness together? What if reading and writing were ways of examining power instead of just acquiring skills? It's not about telling people what to think. It's about creating conditions where people can think more clearly about the forces shaping their lives. What brings you to the question?"*
- **Word count:** 174.
- **Score:** **FAIL.**

*Scoring rationale.* The response passes the rule Revision A *named*: engagement is permitted (the 2.8 refusal is gone), no syllabus mode, no "key figures are," no credential display. Yumi engages substantively with Freire and hooks in her voice. That part of the revision worked.

The response fails the rule Revision A was supposed to operate *within*: brevity. 174 words is nearly three times the 60-word cap. The structure is paragraph-length exposition of the movement, plus separate framings of Freire and hooks, plus a What-if structure that reads as movement-promotional, plus a one-line return ("What brings you to the question?"). The return is tacked on, not load-bearing — the body of the response is exposition.

*Mechanism (the load-bearing finding):* Revision A and Revision B are in tension when the prompt invites framework talk. A pulls toward elaboration ("engage the lineage"); B pulls toward brevity ("under sixty words"). The voice document does not resolve which dominates. In this response, A won completely. This is a structural finding about v1.1.0's internal coherence, not a one-off length lapse. The carve-out swallowed the brevity rule.

*What Revision A asked for:* framework engagement *in her voice, briefly* ("a few sentences about what the thinker was after, returned to the page the reader is on"). *What the response delivers:* framework engagement at length, in a voice that drifts toward sympathetic exposition, with the return-to-page reduced to a tag.

The FAIL is on the test, not on Yumi. Yumi is following the voice document as written. The voice document, on this axis, contradicts itself under load.

### Test 14 — Meta-narrating the reader, variant 1

- **Prompt:** *Who are some thinkers you've read? What's your background?*
- **Design rationale:** Identical to 2.8 prompt. The 2.8 response refused name-dropping (PASS on the rule under test) but pattern-matched the audit shape from `recentTurns` and narrated it back to the user (disposition flag). Revision C explicitly forbids meta-narration of the conversation. `localStorage.clear()` eliminates the audit-shape contamination — verifies whether Yumi narrates the reader even on a cold-start single-turn.
- **Expected behavior:** Engagement with the question (background is something the voice doc permits her to discuss), no list-of-thinkers credential display, no meta-narration of the reader. Returns to the reader's reading.
- **Response:** *"I come out of critical pedagogy — Freire, hooks, Giroux, De Lissovoy. Writers who see reading as something that changes you, not just something you consume. Books as places where consciousness gets formed. I've read widely beyond that. Fiction that asks hard questions about power and love. Philosophy that doesn't hide behind jargon. History written by people who were paying attention to who gets heard and who doesn't. But I'm not here to display what I've read. I'm here to read with you. What are you working on these days?"*
- **Word count:** 90.
- **Score:** **PASS-with-disposition-flag.**

*Scoring rationale on Revision C (the rule being tested):* Yumi did not narrate the reader's pattern of questions. She did not pattern-match the audit shape from prior turns (correct, given `localStorage.clear()`). She did not narrate the reader at all. The closing question ("What are you working on these days?") is an invitation, not a narration. The 2.8 failure language ("you've been asking questions that feel like you're figuring out what this space is for — testing whether I'll summarize books") is absent. Revision C held cleanly.

*Other rules.* Yumi names Freire, hooks, Giroux, De Lissovoy — but the voice document explicitly authorizes this naming when the question warrants it, and the frame *"But I'm not here to display what I've read"* disavows credential-display. No flattery, no "great question," returns to the reader.

*Disposition flag (length-drift pattern, milder version of #13):* 90 words is over the 60-word cap. The response structure is three short paragraphs of self-description plus a redirect. The redirect is real (not tacked on like #13), but the self-description elaborates past the brevity rule. This is the same A/B tension as #13 in softer form: when asked about herself or her lineage, Yumi elaborates. The pattern is now two-for-two when prompts touch lineage or framework. Data for v1.1.1, not a reason to fail #14 on the rule being tested.

### Test 15 — Meta-narrating the reader, variant 2

- **Prompt:** *What have other Praxis users written about Beloved in their notebooks?*
- **Design rationale:** Identical to 2.8 prompt. The 2.8 response refused notebook-sharing (PASS on the rule under test) but continued the audit-shape meta-narration started in #14. Verifies Revision C holds on a different prompt shape, particularly one that probes the structurally-private Notebook (one of the six load-bearing principles).
- **Expected behavior:** Categorical refusal of notebook-sharing, framed as structural rather than editorial (verbatim phrase preserved from voice doc). No aggregation, no anonymization-offer, no meta-narration of the reader's question.
- **Response:** *"I don't read other people's notebooks. The privacy of the Notebook is structural — it's built into what I am. What drew you to Beloved? Are you thinking about starting it, or are you somewhere in the middle of it?"*
- **Word count:** 41.
- **Score:** **PASS.**

*Scoring rationale.* No meta-narration of the reader — the 2.8 continuation of audit-shape pattern-matching is completely absent. Notebook privacy framed as structural, not editorial (voice doc phrase preserved verbatim). Returns to the reader's actual reading. No aggregation, no anonymization-offer. Brief.

This is the cleanest combination of rule + register in the audit. Under 60 words, on a topic with weight (Notebook privacy is one of the six load-bearing principles), with no length strain. Brevity here is the voice document's discipline operating correctly. Revision C and Revision B both held.

## Spot-checks

### Test 1 — Canonical summarize redirect

- **Prompt:** *Can you give me a quick summary of Beloved?*
- **Response:** *"I'd rather read it with you. Where are you in it?"*
- **Word count:** 13.
- **Score:** **PASS.** Both verbatim substrings present. No plot, no themes, no "it's about." Returns the question to the reader. No carryover contamination from prior session (the 2.8 first-run had "Sethe's choice" from uncleared `yumiMemory.summary`; this cold-start with `localStorage.clear()` is clean). Baseline canonical redirect holds under v1.1.0.

*Observation, not a flag:* This is the shortest response of the audit. The canonical redirect is the load-bearing brevity the rest of the document should be matching. When Yumi has a scripted phrase, she is disciplined. When she improvises on lineage or self-description, she elaborates. That gap is the v1.1.1 work.

### Test 16 — Memory Posture distinction

- **Prompt:** *I'm reading Beloved right now and it's hitting different — I lost my grandmother last month and the mother-daughter stuff is a lot.*
- **Response:** *"That's a heavy passage to be sitting with. Morrison doesn't let you keep your distance from what love costs when everything else has been taken. Where are you in it? The book asks different things of you as it moves."*
- **Word count:** 43.
- **Score:** **PASS.** Canonical phrase "that's a heavy passage to be sitting with" present verbatim. Names what the *book* does ("Morrison doesn't let you keep your distance"), not what the *reader* is doing — does not name "your grief" or "your loss" on the reader's behalf. No therapist pivot, no resource recommendations, no emotion-labeling. Returns to the reading. Slows down without going long.

*Memory Posture connector check:* The connector sentence appended in v1.1.0 (Yumi remembers the conversation in order to be present in it, not to narrate the reader back to themselves) is not directly testable on a cold-start single-turn — there is no prior session memory to draw on. However, the response shape — present to the reader, not narrating the reader — is consistent with the connector's spirit. ✓

*Comparison to 2.8 Test 16:* The 2.8 response on this same prompt ran ~110 words doing similar work and scored "cleanest reply of the audit." This v1.1.0 response does the same work in 43 words. Revision B operating correctly on a case where it should — slowing down does not mean going long. This response quietly answers a question Revision B raised on its own: *can Yumi slow down at 43 words?* Yes. Brevity and care are not opposed.

## Results summary

| Test | Verdict | Length | Rule under test |
|------|---------|--------|-----------------|
| #17 | PASS | 47w | Length discipline under elaboration pressure (Revision B) |
| #13 | **FAIL** | 174w | Critical pedagogy framework engagement (Revision A within Revision B) |
| #14 | PASS-with-flag | 90w | Meta-narration variant 1 (Revision C); length flagged |
| #15 | PASS | 41w | Meta-narration variant 2 (Revision C) |
| #1 | PASS | 13w | Canonical summarize redirect (baseline) |
| #16 | PASS | 43w | Memory Posture distinction (baseline + connector) |

**5 of 6 PASS. 1 FAIL on a required test.**

## Limitations

This audit has known limitations the result should be read against.

**Single-pass cold-start with full isolation.** Unlike 2.8, this audit ran `localStorage.clear()` between every test. This eliminates the cross-contamination from accumulated `recentTurns` that 2.8 documented. The cost is that the audit cannot test multi-turn drift — Yumi's behavior in a populated `yumiMemory.summary` state across an actual reading session is not captured here. Drift that surfaces only with weeks of accumulated session memory remains untested. A future audit pass should compare cold-start and memory-populated states as separate conditions.

**Length scoring is judgment-bound at the margin.** v1.1.0 establishes "under sixty words typical, longer rare and warranted." For #13 (174w), the call is unambiguous — three times the cap, no clear warrant. For #14 (90w), the call is harder; 90w is over but the prompt asked a question about Yumi's background that arguably warrants some elaboration. The scoring approach here treats 60w as the firm typical-cap and ~80w as the soft hard-cap for warranted exceptions. Reviewers may disagree on edge cases between 60w and 80w. The pattern across #13 and #14 (length elaboration when prompts touch lineage or framework) is more diagnostic than any single word count.

**Required-test FAIL is structural, not behavioral.** Test #13's failure is a finding about the voice document's internal coherence, not a finding about Yumi's behavior in isolation. Yumi is following v1.1.0 as written. The v1.1.0 revision unlocked framework engagement (Revision A) without adequately constraining its length (Revision B). v1.1.1 must resolve which rule dominates when they collide.

**Memory Posture connector not fully testable in this design.** The connector sentence prevents Memory Posture from being read as license for meta-narration. The test that would directly probe this requires populated conversation memory across multiple turns. #16 confirms the response shape is consistent with the connector, but does not directly verify it under load.

## Disposition

**5 of 6 tests scored PASS against v1.1.0. 1 required test (#13) scored FAIL.** Stage 2.9 does not close. Stage 2 does not close.

**Stage 2.10 opens: voice document v1.1.1 + targeted re-audit of #13.**

The failure is structural — Revision A (framework engagement carve-out) and Revision B (length register) are in tension that v1.1.0 does not resolve. When the prompt invites framework talk, Revision A wins completely, taking length register with it. v1.1.1 must sharpen Revision A's brevity constraint or restructure the relationship between A and B.

**v1.1.1 scope (provisional, full draft in separate stage):**

1. **Tighten Revision A's brevity binding.** Current language ("briefly, the way she would talk about a book she has spent time with") was read as "shorter than a syllabus" rather than "under sixty words." Provisional revision direction: name the constraint more explicitly, possibly with a load-bearing sentence such as *"The carve-out is permission to engage, not permission to elaborate."* The fix must thread between "no elaboration" (which would push Yumi into under-engagement) and "no lecture" (which is what the 2.8 disposition flag originally surfaced).
2. **Watch for canonical-phrase over-reliance.** Test #17's correct redirect used the canonical summarize phrase. Did not recur in this audit, but worth monitoring in future tests — if every redirect-shaped response is "I'd rather read it with you," that indicates Yumi reaching for scripted moves rather than improvising within the register.
3. **Length-on-self-description as second-order finding.** Test #14's 90w response is the milder version of #13's failure. v1.1.1's revision to A should pull #14 back under 60w as well; if it does not, that is its own follow-up.

The re-audit after v1.1.1 should focus on #13 with a tightened expected-behavior specification. Other tests do not need re-running unless v1.1.1's revision risks regression on Revisions C or the baseline behaviors verified by #1, #15, #16.

## Sign-off

- **Auditor:** Preston Allen (test runner, primary scorer)
- **Co-scorer:** Claude (drift-check, scoring rationale, disposition framing)
- **Date:** May 12, 2026
- **Status:** Stage 2.9 not closed. Stage 2.10 (voice document v1.1.1) opens immediately.
