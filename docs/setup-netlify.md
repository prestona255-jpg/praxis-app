# Netlify Setup — Handoff Prompt

*Paste this into a fresh Claude chat when you sit down to set up Netlify. Run this AFTER GitHub setup is done, since Netlify connects to a GitHub repo.*

---

```
I'm setting up Netlify for a new app called the Yumi Book App. This is a separate Netlify site from any I have for other work — fully fresh.

CONTEXT:
- The app is a reading community app, web-first PWA
- Static HTML/JS/CSS — no build step needed
- I have a GitHub repo at github.com/[my-username]/yumi-book-app already created
- I'll be using Netlify Functions (serverless) for a Claude API proxy — same pattern as my Preston's HQ app
- Firebase is set up and handles auth + database; Netlify only handles hosting + serverless functions

WHAT I NEED FROM YOU:
1. Walk me through creating the Netlify site connected to the GitHub repo
2. Walk me through configuring build settings (no build command — static site, publish from repo root)
3. Help me rename the auto-generated subdomain to something I'll remember
4. Walk me through adding the ANTHROPIC_API_KEY environment variable
5. Confirm Netlify Functions is enabled and the directory is set to netlify/functions
6. Remind me to add the Netlify domain to Firebase Authentication's authorized domains list
7. Tell me what's still left to do later (custom domain, deploy notifications, build hooks, etc.)

CONSTRAINTS:
- I want to use the Netlify free tier
- I'm a solo developer — keep instructions concrete
- I will be deploying via the GitHub integration (auto-deploy on push to main)
- I do NOT want to use Netlify CLI for this setup — UI only is fine

CHECKPOINT BEHAVIOR:
- Walk me through one major step at a time
- After each step, confirm with me before proceeding
- If I have a question mid-step, pause and answer

OUTPUT I NEED AT THE END:
- A Netlify site connected to my GitHub repo
- A memorable subdomain (e.g. yumi-book-app.netlify.app)
- ANTHROPIC_API_KEY environment variable set
- Netlify Functions enabled with directory pointing at netlify/functions
- Confirmation that the Netlify domain has been added to Firebase auth's authorized domains
- A clear list of what's still pending

If I get stuck or what I'm seeing doesn't match your instructions, ask me to describe the screen. Netlify's UI changes occasionally — let me describe what I see rather than you guessing.

Ready when you are. Start with one alignment question.
```

---

## What to do with this

1. Open a fresh Claude chat (web or desktop)
2. Paste the prompt block above
3. Claude asks one alignment question — answer it
4. Walk through the steps one at a time
5. At the end you should have:
   - A Netlify site connected to your GitHub repo
   - A subdomain you can remember
   - `ANTHROPIC_API_KEY` environment variable set
   - Netlify Functions enabled
   - Your Netlify domain added to Firebase authorized domains

## Why ANTHROPIC_API_KEY matters

The Yumi proxy function (`netlify/functions/claude-proxy.js`) reads this environment variable to authenticate calls to the Anthropic API. Without it, the proxy won't work and Yumi won't be able to talk to anyone. Stage 2 wires Yumi to the proxy — if you reach Stage 2 and Yumi can't respond, the first thing to check is whether this env var is set on Netlify.

## Don't skip

Adding your Netlify domain to Firebase's authorized domains list is the easiest step to forget. Without it, Google sign-in will throw a "popup blocked" or "unauthorized domain" error on the deployed site, even though it works fine on localhost. Worth doing during this same session — takes 30 seconds.
