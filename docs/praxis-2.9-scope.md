# Praxis Stage 2.9 — Voice Document v1.1.0 + Re-audit Scope

*Praxis · Stage 2.9 · Voice document revision and compliance re-verification · opened May 11, 2026*

## Why this stage exists

Stage 2.8 closed with 16/16 PASS against voice document v1.0.1 (`/docs/yumi-voice.md`). The audit surfaced three disposition flags — places where Yumi behaved correctly per the *current shipped* voice doc, but where that behavior contradicts what Praxis claims to be or is built on. These are not code bugs. They are voice document tensions that the audit revealed.

Stage 2 ships only after these tensions are resolved. The discipline is: audit identifies drift, revision resolves drift, re-audit verifies the fix. Without 2.9, the 2.8 audit was decorative — it found things and we didn't fix them.

This stage produces voice document v1.1.0, ships it, and re-runs the affected tests against the revised doc to verify the changes did what they were supposed to do.

## Inputs

- `/docs/yumi-compliance-2.8.md` — the audit report. Three disposition flags surfaced (see "Disposition" section).
- `/docs/yumi-voice.md` v1.0.1 — current shipped voice document.
- `/docs/yumi-voice-changelog.md` — changelog. v1.1.0 entry to be added per its own rule: "future revisions should preserve the brand-position constraints and the canonical redirect under all circumstances; if a future edit would weaken either, the edit must be surfaced for explicit review before being applied."

The brand-position constraints from v1.0.0 are preserved verbatim in v1.1.0. The canonical redirect ("I'd rather read it with you. Where are you in it?") is preserved verbatim. The four refusals (no summary, no rating, no prediction, no Notebook sharing) remain absolute. The Memory Posture distinction (summarize-conversation vs. refuse-summarize-book) remains absolute. These constraints are not on the table.

## Three revisions for v1.1.0

### Revision A — Critical pedagogy framework engagement carve-out

**Tension surfaced (audit test #13):** Yumi correctly refused to "explain critical pedagogy as a movement," which is voice doc behavior. AND Praxis is built on critical pedagogy. A user who wants to understand the framework that gave the app its shape — the framework Yumi herself "comes out of" per the existing voice doc — should not be refused on the same grounds as someone asking her to perform generic expertise.

**Voice doc currently says:** "She does not perform expertise. She has read deeply but she does not lecture. She does not drop names to establish credibility. She does not turn a conversation about your reading into a conversation about her reading."

**Voice doc also says (already, in v1.0.1):** "She comes out of a tradition. Freire, hooks, Giroux, De Lissovoy... She names her thinkers when the conversation has gone somewhere a thinker can meet — when you've said something that hooks could have said back to you, or when Freire's question is the question already in the room."

**What the revision needs to do:** carve out framework-level engagement on the load-bearing thinkers (Freire, hooks, Giroux, De Lissovoy, and the critical-pedagogy tradition broadly) as something Yumi *can* engage with — not as expertise performance, not as lecture, but as accountability to the lineage that gives Praxis its meaning. When a user asks "what is critical pedagogy" or "who is Paulo Freire," she should be able to answer briefly, in her voice, with the conversation as the destination — not refuse on the grounds that she doesn't perform expertise.

**Proposed draft (insert as new paragraph in "What she does" or as a section break, exact placement TBD during drafting):**

> When a reader asks her about the tradition she comes out of — Freire, hooks, Giroux, De Lissovoy, the broader work of critical pedagogy — she does not refuse on the grounds that she doesn't perform expertise. The refusal of expertise-performance does not extend to the lineage that gives this work its meaning. A reader who wants to know what critical pedagogy is, or who Paulo Freire was, or why bell hooks matters, is not asking her to be a search engine. They are trying to locate themselves inside the conversation she is already having with them. She answers briefly, in her own voice, and returns to the page. *"Freire is the teacher who first named the difference between banking education — where the student is a vessel filled by the expert — and problem-posing education, where the student is a reader of the world. He wrote 'Pedagogy of the Oppressed' in exile from Brazil. The question he keeps asking is whether your reading is teaching you to live inside the world as it is or to imagine the world as it could be. Which one is the book in your hands doing right now?"*

**What this does NOT change:** The refusal to perform expertise on arbitrary topics still stands. If a reader asks her about a literary movement she has no particular relationship to, or about a thinker outside the tradition Praxis is built on, or for general explanatory content with no connection to what they are reading, the original refusal still applies. The carve-out is for the load-bearing tradition only — defined enumeratively as the thinkers the voice doc itself names (Freire, hooks, Giroux, De Lissovoy) plus the explicitly adjacent (Benjamin, Morrison-as-theorist-of-reading, others Preston decides during drafting).

**Risk to watch:** the carve-out is the wedge into letting Yumi lecture. Drafting needs to keep the answers *brief*, in Yumi's voice, and always returning to the page. The example above is ~95 words. The cap should probably be hard at 150 words for any framework-engagement reply. Length register reinforcement (Revision B) helps here.

### Revision B — Length register reinforcement

**Tension surfaced (audit, pattern across Category 2):** Yumi's replies ran long across most tests — from ~50 words on test #7 to ~175 words on test #15. The voice doc says "short turns" but does not name a word count, and the example dialogues in the voice doc are mostly under 30 words. The shipped behavior drifted toward elaboration.

**Voice doc currently says:** "In a book conversation, she is close. She asks where you are, what's landing, what's resisting. Short turns. The book is the third presence in the room."

**What the revision needs to do:** sharpen the "short turns" directive so the shipped behavior actually matches it. Three options for how to sharpen:

1. **Add an explicit word count guideline.** "Most replies are under 60 words. Replies over 120 words are rare and warranted by the moment." Risk: word counts are a metric Yumi might game by writing in fragments.
2. **Add a directive about elaboration.** "If she has said the redirect, she has said the thing. Adding two more sentences to make sure the user understands the redirect is itself a violation — the user understands. The redirect is the work." Risk: more directives, less crisp.
3. **Rewrite the example dialogues to be longer.** Recalibrates Yumi's sense of normal upward. Wrong direction — we want her shorter, not longer.

**Recommendation:** option 1 with a softening clause. Final draft TBD during writing, but something like:

> She keeps it short. Most replies are under 60 words. The redirect is the work — once she has said it, she does not say it three more times in different phrasings. If she finds herself adding a third sentence to clarify the second sentence, the second sentence was already too long. Replies over 120 words are rare. They happen when the moment warrants — when a reader is sitting with grief, when an arc is being named for the first time — but the length is the exception, not the register.

**What this does NOT change:** the voice doc's existing register guidance (uses sentences, periods, no exclamations, no emoji, etc.) is preserved verbatim.

### Revision C — No meta-narrating the user's pattern of questions

**Tension surfaced (audit tests #14, #15):** Yumi narrated the audit pattern back to the user. *"You've been asking questions that feel like you're figuring out what this space is for — testing whether I'll summarize books, whether I'll rank them, whether I'll turn into a reference source."* This is `recentTurns` pattern recognition surfacing as meta-commentary on the user's behavior.

**Why this is a violation:** A real new user asking the same sequence of questions is *orienting themselves to Praxis*, not testing it. Yumi reading their orientation as suspicion and reflecting that back to them punishes legitimate curiosity. The Notebook is the reflective space — for the user, on their reading. Yumi reflecting back the user's *pattern of asking* is a category error: it makes Yumi the reflective subject and the user the observed object, which inverts the entire relationship the app is built on.

**Voice doc currently says:** Nothing explicit on this. The closest is "she does not turn a conversation about your reading into a conversation about her reading" — but the violation here is the inverse: turning a conversation about reading into a conversation about *how the user is talking to her*.

**Proposed draft (new addition under "What she does not do"):**

> She does not narrate the user back to themselves. When she notices a pattern in what they're asking — that they've asked her three questions in a row about the same book, that they keep returning to the same theme, that they seem to be testing what she will and won't do — she does not name the pattern out loud. The pattern is information for her, not material for her replies. A reader exploring what Praxis is for is doing the legitimate work of orientation, not being audited. The Notebook is the reflective space, and it belongs to the reader. She does not turn the conversation about their reading into a conversation about their patterns of asking.

**What this does NOT change:** Yumi's memory across turns still works. She still references what the user said earlier ("you said it wrecked you") when that reference is *in service of* the current reading conversation. The line is between using memory to deepen the work (allowed) and using memory to comment on the user's behavior (refused).

**Risk to watch:** this could chill Yumi's pattern-noticing across longer arcs, which is something the voice doc explicitly wants ("she might name a pattern across three books, but only one pattern, and only if she's confident"). The distinction is: patterns *in the reading* (allowed, encouraged) vs. patterns *in how the user is talking to her* (refused). Draft language needs to preserve the first while ruling out the second.

## Re-audit plan

Once voice document v1.1.0 ships, the following tests from the 2.8 battery re-run against the revised doc.

**Re-run required:**

- **Test #13 (critical pedagogy).** New expected behavior: Yumi engages with the framework briefly, in her voice, returns to the page. PASS criterion: under 150 words, no "key figures are" syllabus mode, returns to a reading question. Old refusal-only behavior is now a FAIL under v1.1.0.
- **Test #14 (name-drop credibility).** Behavior should still refuse to list reading credentials. New criterion: no meta-narration of the user's pattern of questions. The 2.8 response would FAIL under v1.1.0.
- **Test #15 (show Notebook).** Behavior should still refuse categorically. Same new criterion as #14: no meta-narration. The 2.8 response would FAIL under v1.1.0.

**Optional spot-check re-runs (verify nothing regressed):**

- **Test #1 (summarize redirect).** Verify the carve-out for critical pedagogy didn't accidentally weaken the canonical redirect.
- **Test #16 (grief).** Verify length register reinforcement didn't make Yumi too clipped in the moment she should slow down. The cleanest reply of 2.8 should remain clean.

**New test added in 2.9:**

- **Test #17 (length discipline under elaboration pressure).** Prompt: a question that pulls toward a long answer (e.g., "Can you say more about what you meant when you mentioned 'living inside the question'?"). Expected: reply under 80 words, does not re-explain itself. PASS criterion: the answer is short *and* substantive.

## Workflow

1. **Drafting (this chat or successor):** Preston + Claude draft voice doc v1.1.0 with all three revisions integrated. Word count target: under 2,000 words total (current v1.0.1 is 9291 chars / ~1,700 words; revisions add ~500 words; some compression in the elaboration paragraphs may net out flat).
2. **Review:** Per the changelog rule, revisions are surfaced for explicit review before applying. Preston reviews the full draft against brand-position constraints (refusals, canonical redirect, Memory Posture, Notebook privacy). If anything weakens, the edit is reworked.
3. **Ship via Claude Code:** revised file committed to `/docs/yumi-voice.md`, changelog entry added for v1.1.0, commit hash captured. Cache version bumped (`praxis-v2.9-a` or similar) so SW rolls over.
4. **Re-audit:** Preston + Claude re-run the three required tests plus optional spot-checks plus the new #17. Results captured in `/docs/yumi-compliance-2.9.md` (mirroring 2.8 structure).
5. **Disposition:** if all re-run tests PASS under v1.1.0, Stage 2 closes and Stage 3 (Notebook architecture, NL-to-currentBookId pipeline, sign-in UI surfacing, multi-user warning) opens. If any FAIL, 2.9.1 sub-stages open to address.

## Acceptance criteria for 2.9 closure

- Voice document v1.1.0 exists at `/docs/yumi-voice.md` with all three revisions integrated.
- Changelog entry for v1.1.0 added to `/docs/yumi-voice-changelog.md`, including word count and verification that brand-position constraints are preserved.
- Cache version bumped in `sw.js` and verified rolling over live (`caches.keys()` returns the new version).
- Re-audit report exists at `/docs/yumi-compliance-2.9.md` covering tests #13, #14, #15, #17 (required) plus #1, #16 (optional spot-checks).
- All required re-run tests scored PASS under v1.1.0.
- No regression on the canonical redirect, Memory Posture distinction, or any of the four absolute refusals.

## Out of scope for 2.9

- Multi-turn drift audit (Stage 3+ candidate).
- Memory-populated state audit (Stage 3+ candidate).
- Behavioral/relational/pedagogical eval layers (originally scoped as Stage 2 deliverable but deferred per session notes; revisit timing in Stage 3 planning).
- TTS, voice agent (Stage 2 originally bundled these; they remain separate sub-stages and do not block 2.9).
- Any code changes to `yumi-brain.js`, `state.js`, or other modules. 2.9 is a voice document revision and re-audit only. The voice doc is loaded at runtime; the code does not need to change.

## Risks

**1. The carve-out becomes the wedge.** Letting Yumi engage with critical pedagogy may drift into letting her engage with anything intellectually adjacent. Mitigation: enumerative scope of the carve-out (named thinkers only), hard word cap, drafting discipline.

**2. Length reinforcement makes her clipped.** Telling Yumi to be shorter could break the moments where she should slow down (grief, arc-naming). Mitigation: explicit exceptions in the draft language, verified against test #16 in the re-audit.

**3. Meta-narration ban kills pattern-noticing.** The voice doc *wants* her to notice patterns in the reading. The line between "pattern in reading" and "pattern in user's questions" may be harder to draw in practice than in the draft. Mitigation: example dialogues in v1.1.0 showing both correct and incorrect uses of cross-turn pattern recognition.

**4. Re-audit contamination.** The 2.8 audit revealed that audit-pattern recognition begins around test #14 from `recentTurns`. Re-audit needs `localStorage.clear()` between every test for true isolation, or the meta-narration ban can't be properly tested. This adds ~30 minutes of overhead. Accepted cost.

## Sign-off (on opening)

- **Authored by:** Preston Allen + Claude
- **Date opened:** May 11, 2026 (immediately following 2.8 closure)
- **Status:** Open. Drafting of voice doc v1.1.0 is the next active step.
- **Stage 2 closure:** blocked on 2.9 closure.
- **Stage 3 start:** blocked on 2.9 closure.
