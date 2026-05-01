# Stage 2 — Design Note

A planning document for Stage 2, written before Stage 1 begins. This is NOT a prompt. When Stage 2 is close to running (probably 4–6 weeks from Stage 1 kickoff), this note becomes the basis for the actual Stage 2 prompt, using the template at /docs/00-template.docx.

Status: draft v0.1, last updated May 2, 2026. Will be revised after Stage 1 ships, when implementation realities reshape what's actually needed.

## What Stage 2 is for

Stage 2 is when Yumi comes online for the first time. After Stage 1 finishes, the app is plumbing — auth works, Firebase syncs, ISBN fetch works, PWA installs. Nothing is alive. Stage 2 makes Yumi alive: she has a brain, a UI surface, a voice document loaded into her system prompt, and the ability to actually have a conversation with the user.

The original Praxis companion describes Stage 2 in one paragraph: "yumi-brain.js + yumi-ui.js working with Netlify proxy function. Voice document loaded. Voice input prominent."

That paragraph is too thin for what Stage 2 actually needs to do. This note expands it.

## Goal sentence

At the end of Stage 2, a user can sign in, open the app, and have a real spoken conversation with Yumi. They can talk to her, she can talk back, and her voice (literal and figurative) matches the voice document. Voice input and voice output are first-class — not buried in settings, not opt-in by default. Text input still works as a fallback.

If voice agent / screen commands are in scope for Stage 2 (decision deferred — see below), users can also ask Yumi to navigate or take actions in the app verbally.

## What gets built

### Core (definitely in Stage 2)

**yumi-brain.js** — the system prompt and conversation logic.

- Loads /docs/[yumi-voice.md](http://yumi-voice.md) as part of her system prompt at runtime
- Builds context blocks (current book, recent notebook entries, current arc if any) and injects them into the system prompt
- Sends conversation to Anthropic API via Netlify proxy function
- Handles streaming responses
- Maintains short-term conversation memory (per session) and longer-term memory (per user, fresh on signup)
- Convention: same patterns as Preston's HQ yumi-brain.js, including buildYumiSystem() function

**yumi-ui.js** — the chat interface.

- Chat panel UI, opens from a persistent button or keyboard shortcut
- Renders user messages and Yumi messages with correct typography (Cormorant Garamond display, DM Sans body — same as HQ)
- Empty state, error states, loading states
- Voice input button prominent, not buried
- Voice output toggle (always-on by default for Phase 1 testing — see TTS section)
- Convention: same patterns as Preston's HQ yumi-ui.js

**voice-input.js** — speech-to-text (lifted verbatim from HQ in Stage 1.1).

- Already copied during Stage 1, but Stage 2 wires it up to actually feed yumi-ui.js
- User holds mic button, speaks, releases, transcript appears in input field, sends to yumi-brain.js

**Netlify proxy function** — claude-proxy.js (lifted verbatim from HQ in Stage 1.1).

- Already deployed by end of Stage 1, but Stage 2 is the first time anything actually calls it
- Reads ANTHROPIC_API_KEY env var, forwards JSON body to Anthropic /v1/messages, returns response

### TTS additions (Yumi speaks back)

This is new for Praxis — HQ Yumi doesn't speak audibly. Stage 2 adds it because the voice document was written for a companion, and a companion who only types feels colder than one who can actually be heard.

**Service choice** — decide during Stage 2 pre-flight.

- Options: ElevenLabs (best voice quality, paid, ~$5–22/month for hobby tier), OpenAI TTS (cheaper, decent quality, requires separate OpenAI account), browser Web Speech API (free, lower quality, available offline).
- Recommendation lean: ElevenLabs for Phase 1 if budget allows, fallback to Web Speech API for cost-controlled defaults. But this is a Stage 2 decision, not now.

**Yumi's voice character** — needs explicit decision.

- Tone: warm but serious, matching the voice document
- Pace: unhurried, comfortable with pauses
- Pitch: not perky, not robotic
- Specific voice profile to be picked during Stage 2 — likely involves listening to several voice samples and picking by ear, since the voice document already says she sounds like "a thoughtful friend who has read the same books and remembers them"
- Not a celebrity-voice clone, not a generic assistant voice. Something distinctive but unobtrusive.

**Always-on vs opt-in.**

- Default for Phase 1: always-on, with a one-tap mute toggle in the chat UI
- Reasoning: voice was the whole point of this addition; making it opt-in means most users never experience it
- Opt-out is easy and visible, not hidden in settings

**Voice document re-review when TTS lands.**

The voice document was written to be read on screen. When TTS is implemented, re-read the document by listening to a synthesized voice say it, sub-stage by sub-stage. Some lines that work in text ("that's a heavy passage to be sitting with") may need revision when spoken aloud — pacing, emphasis, where to pause. Treat this as a v1.1 revision of [yumi-voice.md](http://yumi-voice.md), with the changelog noting the synthesized-voice review pass.

**TTS sub-stages, rough sketch:**

- 2.X.1 Service integration: API key, basic call, return audio blob
- 2.X.2 Audio playback: queue, play, interrupt on new user input
- 2.X.3 Voice character: pick the voice, test against sample Yumi responses
- 2.X.4 Voice document review pass: listen to [yumi-voice.md](http://yumi-voice.md) spoken, revise if needed

## Voice agent / screen commands — DEFERRED DECISION

This is the bigger of the two additions and the one that genuinely changes what Yumi is. Three options, each with real consequences:

**Option A — In Stage 2.** Voice agent is part of Stage 2. Yumi can navigate, add notes, change shelves, and execute defined app actions in response to spoken commands.

- Pro: ships sooner, voice experience is fully conversational from launch.
- Con: Stage 2 becomes much larger, possibly 8–10 sub-stages instead of 4–5. Tool-calling architecture has to be designed alongside Yumi-brain rather than after.
- Con: Phase 1 testers (1–3 people including Preston's father) get a much more complex first impression of Yumi. The companion register and the agent register have to coexist on day one — risk that the agent layer swallows the companion layer.

**Option B — Stage 2.5** (separate stage between current Stage 2 and Stage 3). Stage 2 ships as planned (Yumi conversational, TTS working, no agent layer). Stage 2.5 adds the agent layer cleanly on top.

- Pro: keeps Stage 2 focused on getting Yumi's voice (literal and pedagogical) right before adding action capability.
- Pro: lets Phase 1 testers experience Yumi-as-companion first, then Yumi-as-companion-plus-agent — the relationship gets to ground itself before adding capability.
- Con: pushes voice agent out by a few weeks, slower to feel "magical."

**Option C — Post-Phase 2** (deferred until after first paid cohort). Voice agent is a Phase 3 feature, after the core companion experience has been validated with 10–25 users.

- Pro: lowest risk, only build what's been validated.
- Con: significant capability gap for a long time.

Preston's preliminary lean: **Option B (Stage 2.5)**. Reasoning: the voice document we wrote on May 1, 2026 is grounded in Yumi as companion. Letting Phase 1 testers experience that companion clearly, with TTS giving her a literal voice, before layering agent capability on top — that protects the character. Option A risks the agent register dominating before the companion register is established. But this is a real call to make at Stage 2 pre-flight, not now.

If Option B is chosen, Stage 2.5 design note will be written separately when Stage 2 ships. It would cover:

- Tool definitions: what actions Yumi can take in the app (navigate, search, add to notebook, change shelf, etc.)
- Intent parsing: how spoken commands get matched to tool calls
- Confirmation patterns: when does Yumi just do the thing vs. ask "do you want me to..."
- Failure modes: what happens when she misunderstands, what undo looks like
- Voice document implications: does Yumi's voice change when she's executing an action vs. having a conversation? (Probably not, but worth deciding explicitly.)

## Brand-position constraints (apply to every stage, especially this one)

Stage 2 is the first stage where Yumi actually behaves. The brand position must hold under voice and under any agent capability:

- Yumi never summarizes books — including when asked verbally. Voice doesn't change the rule.
- The Notebook is structurally private — voice agent commands cannot expose it.
- One Book Artifact per user per book — agent capability cannot create duplicates.
- Star ratings de-emphasized — Yumi's voice does not narrate star averages.
- No follower counts, like counts, or reshare counts as primary UI — voice does not surface them either.

If voice agent capability is built (Option A or B), the tool definitions must be designed so that the agent layer cannot violate these constraints. Specifically: there is no "summarize this book" tool. There is no "show notebook to other user" tool. The structural privacy is in the tool surface, not just the UI.

## Pre-flight requirements (when Stage 2 actually starts)

When Stage 2 is close to running, the agent should read these files before writing any code:

- /praxis-app/docs/[yumi-voice.md](http://yumi-voice.md) — the voice document, loaded as part of system prompt
- /praxis-app/js/state.js — current state schema (built in Stage 1)
- /praxis-app/js/integrations.js — Firebase patterns, Netlify proxy URL (built in Stage 1)
- /praxis-app/netlify/functions/claude-proxy.js — proxy contract
- /praxis-app/index.html — file load order, current script tags
- HQ-DEPLOY/js/yumi-brain.js — the buildYumiSystem() pattern, system prompt structure
- HQ-DEPLOY/js/yumi-ui.js — the chat UI patterns, voice input integration
- HQ-DEPLOY/js/voice-input.js — already copied to Praxis in Stage 1.1, confirm wiring

## Conventions (still apply)

- var/function only — no const/let/arrow/class/template-literals
- String concatenation only
- CSS variables only (--ink, --ink-2, --gold, --br-deep, --border, --color-surface, etc.)
- localStorage via ls(k, d) / sv(k, v) wrappers
- File load order: state → integrations → yumi-brain → arcs → yumi-ui → views → app
- Fonts: Cormorant Garamond (display), DM Sans (body), DM Mono (code/meta)

## Open questions (to resolve during Stage 2 pre-flight, not now)

- Which TTS service: ElevenLabs, OpenAI, or Web Speech API?
- What does Yumi's voice actually sound like? (Pick during Stage 2.X.3, not before.)
- Is voice agent in Stage 2 (Option A), Stage 2.5 (Option B), or deferred to Phase 3 (Option C)?
- How does Yumi handle being interrupted mid-response by voice input? (UX question.)
- Does Yumi's voice ever change emotionally — softer when a user is grieving, quieter on weekly prompts? Or is the voice consistent and only the words change? (The voice document says "the volume changes, the character does not" — this principle applies to literal voice too, probably, but worth deciding explicitly.)
- Phase 1 testers (Preston's father and 0–2 others) — do they get TTS from day one of their testing, or does TTS land mid-Phase-1?

## Notes for future Preston

This document was written May 2, 2026 — the day after Stage 0 shipped, when voice and voice-agent were freshly exciting ideas. The current you (whoever is reading this when Stage 2 actually starts) probably has new information that reshapes some of this. Trust the new information. This document is a starting point, not a contract.

In particular: if Stage 1 surfaces patterns that change how yumi-brain.js should be structured, this note may need substantial revision before becoming a prompt. Don't paste this directly into Claude Code. Convert to a proper Stage 2 prompt using the template, run it through the silent checklist, then run it staged with checkpoints.

The voice document is the spine. Everything in Stage 2 must serve it, not override it.
