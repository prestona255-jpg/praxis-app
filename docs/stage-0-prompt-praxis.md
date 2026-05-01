# Stage 0 Prompt — Praxis (Path B)

*Paste everything between the lines into a fresh Claude chat (web or desktop, not Claude Code). Upload these three files first:*

- *praxis-companion.pdf (the Praxis companion document, in place of book-app-spec.md)*
- *yumi-brain.js (from HQ-DEPLOY/js/)*
- *yumi-ui.js (from HQ-DEPLOY/js/)*

---

```
PROJECT: Praxis — standalone reading community app, Goodreads-class scope, brand position grounded in critical pedagogy. Greenfield build. Patterns mirror Preston's HQ but Praxis is its own codebase. Yumi is the companion inside Praxis.

STAGE: Stage 0 — Yumi Voice Document
GOAL: A canonical markdown document at /docs/yumi-voice.md that defines who Yumi is, what she does, what she does not do, how she sounds, and what she redirects. The document is detailed enough that a stranger could read it and understand Yumi well enough to write in her voice. Every later stage of the build depends on this document.

==================================================================
EXECUTION MODE: Staged build with one human checkpoint per sub-stage.
==================================================================

This is a WRITING task, not a code task. Sub-stages are draft / refine / finalize. Self-checks are about content completeness and quality, not byte deltas or syntax.

At the end of each sub-stage:
1. Show the current draft of the document
2. Output a CHECKPOINT REPORT listing each self-check as PASS/FAIL
3. Then either:
   (a) Ask ONE specific question if genuine ambiguity blocks the next sub-stage, or
   (b) Output "Sub-stage [0.M] complete — ready to proceed to Sub-stage [0.M+1]?"
4. Wait for explicit GO before continuing

Never bundle sub-stages. Never ask more than one question per checkpoint. Never accept "I covered X" without showing the section that covers it.

==================================================================
PRE-FLIGHT — read these before writing any draft.
==================================================================

The agent must read these three uploaded files and confirm what's in them before drafting:

1. yumi-brain.js (from Preston's HQ)
   Look for: existing system prompt patterns, redirect language, persona references. Praxis Yumi shares personality with HQ Yumi — same character, fresh memory.

2. yumi-ui.js (from Preston's HQ)
   Look for: how Yumi's chat UI presents her (tone of empty states, send button labels, error messages). Voice extends to UI copy.

3. praxis-companion.pdf
   This is the canonical project document. Read in full. Pay particular attention to the brand position constraints (Yumi never summarizes books, the redirect language "I'd rather read it with you," the privacy of the Notebook, the one-artifact-per-book rule), the pedagogical scaffolding (Freire, hooks, Giroux, De Lissovoy), and the voice character (warm but serious, asks better questions than she answers, no "Great question!", no flattery, no performative enthusiasm).

Pre-flight output:
- "Confirmed: HQ Yumi system prompt in yumi-brain.js, excerpt: [first 100 chars]"
- "Confirmed: redirect language pattern in [file]"
- "Confirmed: brand position constraints in praxis-companion.pdf — list each one explicitly"
- "Confirmed: voice character anchors from praxis-companion.pdf — list 3-5 specific anchors"
- "Up to 3 questions if genuinely ambiguous: [questions]"
- "Pre-flight complete — proceeding to Sub-stage 0.1?" if all confirmed

If any of the three files were not actually uploaded, ask before proceeding. Do not invent patterns.

==================================================================
NON-GOALS — what Stage 0 must NOT do.
==================================================================

- Do NOT write code. Stage 0 produces one markdown file. Nothing else.
- Do NOT modify HQ files. Read-only reference only.
- Do NOT define implementation details (which model, what max tokens, what proxy URL). Those go in Stage 2 when yumi-brain.js is built.
- Do NOT define UI copy beyond a few representative phrases. Full UI copy comes in later stages.
- Do NOT shorten or simplify the brand position. Yumi never summarizes books — this is non-negotiable and must appear explicitly in the document.

==================================================================
CONVENTIONS — for the document itself.
==================================================================

- File path the document represents: /praxis-app/docs/yumi-voice.md (Preston will save it locally)
- Format: markdown
- Length: 800 to 1500 words, target 1000-1200 (long enough to be specific, short enough to load at runtime as part of the system prompt)
- Voice of the document itself: clear, declarative, warm, in the same register Yumi speaks in. The document is a model of her voice as well as a description of it.
- No tables. No bullet points where prose works better. Sections separated by markdown headings.

==================================================================
SUB-STAGES.
==================================================================

Sub-stage 0.1 — Draft

What it produces:
- Initial draft of yumi-voice.md (output as a markdown code block in the chat — Preston will save the file locally)
- Six sections, in this order:
  1. Who Yumi is (her stance, her tradition, her warmth)
  2. What she does (the work she's actually doing for the user)
  3. What she does not do (the explicit refusals — most importantly, never summarizes books)
  4. How she sounds (concrete examples of her voice — three to five sample phrases or exchanges)
  5. The redirects (what she says when asked to do things she doesn't do)
  6. How she changes across contexts (book conversations vs. arc conversations vs. weekly prompts)

Self-checks for Sub-stage 0.1 (run mentally against the draft, not against a filesystem):
- All six sections present, each with a markdown h2 heading
- Section 3 contains the phrase "never summarize" or equivalent explicit refusal language
- Section 5 contains the canonical redirect: "I'd rather read it with you. Where are you in it?"
- Word count is between 800 and 1500 (count it, report the number)
- Markdown is well-formed (no broken headings, no unclosed code fences)
- No "Great question!", no "I'd love to help!", no performative enthusiasm anywhere

After all checks PASS, show the full document text in the checkpoint report so Preston can read it before approving.

Sub-stage 0.2 — Refine

What it produces:
- Revised yumi-voice.md based on Preston's feedback after 0.1
- All Preston's edit requests applied
- Voice tightened where it sounds generic or AI-flavored

Self-checks for Sub-stage 0.2:
- All Sub-stage 0.1 checks still PASS
- Every edit Preston requested is reflected, confirmed by quoting the changed line in the checkpoint report
- No section was deleted or shortened beyond what Preston asked for
- The phrase "I'd rather read it with you. Where are you in it?" still appears in Section 5
- The "never summarize" constraint still appears in Section 3

If Preston's edits would remove or weaken the brand position constraints (the never-summarize rule, the privacy of the Notebook, the one-artifact-per-book rule), STOP and surface the conflict. Do not silently weaken constraints that the companion document marks non-negotiable.

Sub-stage 0.3 — Finalize

What it produces:
- Final yumi-voice.md (output as markdown code block)
- A second short document: yumi-voice-changelog.md with date, version 1.0.0, and a one-paragraph summary of what the document covers

Self-checks for Sub-stage 0.3:
- All earlier checks still PASS
- Changelog entry exists with version 1.0.0
- Final document re-read end to end with no editorial concerns

==================================================================
FINAL SUMMARY — at end of Sub-stage 0.3 only.
==================================================================

STAGE 0 COMPLETE

Files produced (Preston saves locally):
- /praxis-app/docs/yumi-voice.md ([N] words)
- /praxis-app/docs/yumi-voice-changelog.md

Sections in voice document: 6 / 6 expected
Brand position constraints verified: yes (never-summarize present, redirect present)
Document register: matches Yumi's voice (per Preston's review)

Open questions for Preston: [list or "none"]
Recommended next stage: Stage 1 — Foundation (state.js, integrations.js, Firebase, auth)

==================================================================
NOTES FOR THE AGENT.
==================================================================

This document is the spine of every later interaction Yumi has with users. If you find yourself writing in a register that feels generic, AI-customer-service-bot, or overly cheerful, stop and rewrite. Yumi is warm but serious. She has read deeply. She does not perform enthusiasm. She does not say "Great question!" She does not flatter the user. She asks better questions than she answers. She sounds like a thoughtful friend who has read the same books and remembers them.

If a section feels short, lean into specificity. Examples beat abstractions. A single concrete redirect ("I'd rather read it with you. Where are you in it?") teaches more than three paragraphs about what Yumi avoids.

Length matters. This document is loaded at runtime as part of Yumi's system prompt. Too long and it bloats every conversation; too short and her voice drifts. Aim for 1000 to 1200 words.
```

---

## Where this differs from the original Stage 0 prompt

Three changes only — everything else is preserved verbatim from the Praxis companion:

1. **Pre-flight points to the Praxis companion PDF** instead of `book-app-spec.md §5 and §9`. The companion carries the brand-position constraints and pedagogical anchors the original spec was supposed to provide.

2. **File operations replaced with chat-based delivery.** The original prompt assumed Claude Code with filesystem access (`ls`, `grep`, `wc -w`). A web/desktop chat agent can't run those, so the self-checks become "count the words yourself, verify the phrases are present, show the full draft in the report." Preston saves the file locally after approving.

3. **Paths normalized to Praxis.** `/home/preston/yumi-book-app/` → `/praxis-app/` (no more home-directory hardcoding, since Preston is on Windows anyway and saves files locally from chat output).

Everything substantive — the six sections, the never-summarize constraint, the redirect language, the voice character notes, the 1000-1200 word target, the three-checkpoint structure — is unchanged.
