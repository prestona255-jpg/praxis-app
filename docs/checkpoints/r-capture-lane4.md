# R-CAPTURE — Lane 4 checkpoint (hardening close-out)

## segmentDoc auto-retry-on-5xx  ✅ COMPLETE (committed local)

`js/import-capture.js` — `segmentDoc` (paste/import segmentation) now auto-retries
ONCE on a transient failure (5xx OR a network error) with a 700ms backoff; a 4xx is
NOT retried. Raw text is never lost either way (the caller's catch keeps it in the
field). Parse PASS. Live-verify (stubbed fetch):

| Case | calls | result |
|---|---|---|
| 5xx → 200 | 2 | resolved (retried) |
| 4xx | 1 | rejected (no retry) |
| 5xx → 5xx | 2 | rejected (one retry then throw) |
| network-err → 200 | 2 | resolved (retried) |

## tag_audio_events hardening  ✅ COMPLETE (server, live-smoke pending)

`netlify/functions/transcribe-proxy.js` — the proxy sent `model_id` + `file` to
ElevenLabs Scribe but never set `tag_audio_events`, which defaults TRUE (injects
`(laughter)`/`(footsteps)` tags into the transcript). Added
`form.append('tag_audio_events', 'false')` so a filed note is clean prose (RAW joins
the corpus as the reader's words). Node function (not the ES3 harness's domain);
**verified by diff — a real ElevenLabs round-trip is a Preston live-smoke item** (the
proxy is inert until the env keys are set; can't be exercised locally).

## live-caption guarded OFF on iOS  ✅ SATISFIED BY DESIGN (recorded)

Grep-confirmed: NO live-caption / partial-caption feature exists anywhere. The sheet's
voice mode shows LISTENING → TRANSCRIBING → the full Scribe transcript; **Scribe is
already the SOLE filed transcript**, with no separate live caption to guard. Nothing
to build; the law ("Scribe always the filed transcript") holds by construction.

## worktree cleanup  ✅ ALREADY CLEAN (recorded)

`git worktree list`: the two named strays (`../praxis-dictation-400`,
`../praxis-dictation-v2`) **do not exist** — already removed. Present worktrees
(arc-standard-mockup, rshelf-mockup, scan-derisk, yumi-mockup) are OUT of Lane 4's
scope and left untouched.

## CAPTURE-OWNER beta-gate 1b intake  ✅ RECORDED

The capture door's beta-readiness residuals (to fold into `docs/launch-runway.md` at
the round close, all requiring Preston's signed-in real-device smoke — the rig is
signed-out and can't reach Firestore/the proxies):
1. Signed-in Firestore round-trip for `profile.carryingQuestion` (CA-1) + note-writes
   (commit-and-stay) — persistence across reload + a second device.
2. A real dictation round-trip (mic → MediaRecorder → transcribe-proxy → transcript
   in the field → file it), incl. the `tag_audio_events:false` clean-prose check.
3. A real Android "Share → Praxis" intent on an installed PWA.
4. The 390 bottom-sheet true-phone felt verdict (carried from the mockup close).
