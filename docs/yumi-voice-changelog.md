# Yumi Voice Document — Changelog

## v1.1.0 — May 12, 2026

Stage 2.9 voice document revision integrating three disposition flags from the Stage 2.8 compliance audit (see /docs/yumi-compliance-2.8.md). Four additions, no removals; all existing brand-position constraints preserved verbatim. Word count after additions: 2,010 (awk-canonical), +305 from v1.0.1.

**Revision A — critical pedagogy framework engagement.** Appended ~95 words to the second paragraph of "Who Yumi is," after the existing sentence about naming thinkers. Carves out direct engagement with the load-bearing thinkers (Freire, hooks, Giroux, De Lissovoy) and the framework itself when a reader asks directly, in Yumi's voice, briefly, returning to the page. Resolves Test #13: framework-level engagement was being refused under the "no expertise performance" rule, conflating credential-display with conversation about the tradition the app emerges from. The carve-out is framed as conversational engagement (the way she'd talk about any book she's spent time with), not as exception-permission to lecture.

**Revision B — length register.** Inserted ~55 words into "How she sounds," before the existing "She uses sentences" prosody paragraph. Establishes brevity as character: under sixty words typical, longer rare and warranted. The closing sentence ("The brevity is not terseness. It is the discipline of leaving room for the reader to think.") states the *why*. Resolves Category 2 length drift surfaced across the 2.8 audit (~70w–~175w against the voice doc's "short turns" directive).

**Revision C — no meta-narrating the reader.** Inserted ~75 words into "What she does not do" as a new sixth paragraph, after the Notebook-privacy paragraph. Names three categories of pattern-noticing Yumi may do (reading, Notebook, arc) and one she may not (the conversation with her — how the reader is asking, what they seem to be testing, their stance toward her). Resolves Tests #14, #15: Yumi was pattern-matching the audit's question shape from recentTurns and reflecting it back, punishing legitimate orientation with suspicion. Final two sentences anchor the rule pedagogically: "The reader's life with books is the work. The reader's relationship to Yumi is not the work, and it is not Yumi's to narrate."

**Connector — Memory Posture.** Appended one sentence (~30 words) to the final paragraph of Memory Posture, after the existing "She remembers the conversation. She does not summarize the book." Makes the relationship between Memory Posture and Revision C explicit: Yumi remembers the conversation in order to be present in it, not in order to narrate the reader back to themselves. Prevents Memory Posture from being read as license for what Revision C rules out.

**Brand-position constraints — verified preserved verbatim:** Yumi does not summarize books (1 occurrence); Notebook structurally private (phrase "structural, not editorial" preserved); one Book Artifact per user per book (untouched); no ratings (preserved); canonical redirect "I'd rather read it with you. Where are you in it?" (2 occurrences, How she sounds + Redirects, unchanged from v1.0.1); Memory Posture distinction sentence preserved verbatim with connector appended after, not modifying it.

Re-audit required before Stage 2 closes: tests #13, #14, #15 (required re-runs), plus a new test #17 for length discipline under elaboration pressure. Optional spot-checks: #1, #16. localStorage.clear() between every test — the 2.8 audit revealed recentTurns pattern recognition contamination beginning around test #14. See /docs/yumi-compliance-2.9.md (forthcoming) for re-audit report.

## v1.0.1 — May 7, 2026

Added a Memory posture section in preparation for Praxis sub-stage 2.7b-ii-b (conversation-memory summarization rollover). The section makes explicit the categorical distinction between summarizing a conversation Yumi has been part of — which she does, in her own voice, when older turns would otherwise be dropped — and summarizing a book, which she refuses absolutely. The pathway by which Yumi summarizes her own conversation memory is not a backdoor to book summarization, and the document now says so. All other sections are unchanged from v1.0.0; word count after addition: 1,705 (awk-canonical).

## v1.0.0 — May 1, 2026

Initial canonical voice document for Yumi, the reading companion inside Praxis. Defines who Yumi is, what she does, what she does not do, how she sounds, what she redirects, and how her register changes across book conversations, Learning Arc conversations, and weekly prompts.

The document anchors Yumi in a tradition (Freire, hooks, Giroux, De Lissovoy) and names what reading is for — questions about power, responsibility, accountability, how the world got arranged — and what reading is reading against — the spectacle of self-interest, the privatization of love, the treatment of media and culture as neutral mirrors. It establishes the non-negotiable brand-position constraints: Yumi never summarizes books, the Notebook is structurally private, one Book Artifact per user per book, no ratings, no follower-counted social layer.

The document is loaded at runtime as part of Yumi's system prompt. Word count: 1,510 (awk-canonical). Length tuned to be specific enough to define voice without bloating every conversation turn. Future revisions should preserve the brand-position constraints and the canonical redirect ("I'd rather read it with you. Where are you in it?") under all circumstances; if a future edit would weaken either, the edit must be surfaced for explicit review before being applied.
