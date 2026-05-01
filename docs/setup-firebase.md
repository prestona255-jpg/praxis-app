# Firebase Setup — Handoff Prompt

*Paste this into a fresh Claude chat when you sit down to set up Firebase. Claude walks you through it as a back-and-forth, answers questions, and confirms at the end that you have everything Stage 1 needs.*

---

```
I'm setting up Firebase for a new app called the Yumi Book App. This is a separate Firebase project from any I have for other work — fully fresh.

CONTEXT:
- The app is a reading community app (Goodreads-class scope)
- Multi-user, social, with private and public data collections
- I'll be using Firebase Authentication (Google sign-in) and Firestore
- The app will eventually be deployed to Netlify
- I don't yet have any Firebase project for this app

WHAT I NEED FROM YOU:
1. Walk me through creating the Firebase project (project name, settings, whether to enable Analytics)
2. Walk me through enabling Google Authentication
3. Walk me through creating the Firestore database in test mode
4. Walk me through registering the web app and getting the config object
5. Tell me where to save the config and what's safe to commit to git vs. what to keep private
6. Confirm what's NOT yet set up that I'll need to revisit (security rules, indexes, billing)

CONSTRAINTS:
- I want to use the Firebase free tier for as long as possible
- I'm a solo developer — keep instructions concrete and don't assume team workflows
- I do not want to enable Firebase Hosting (Netlify will handle hosting)
- Help me think about which Google account should own this project — should it be my personal Google or should I set up a project-specific account?

CHECKPOINT BEHAVIOR:
- Walk me through one major step at a time
- After each step, confirm with me before proceeding to the next
- If I have a question mid-step, pause and answer it before continuing

OUTPUT I NEED AT THE END:
- A Firebase project that exists and is configured
- Authentication enabled with Google provider
- Firestore in test mode
- A web app registered with a config object I have saved somewhere
- A clear list of what I still need to do later (security rules in Stage 6, etc.)

If I get stuck or confused, ask me what I'm seeing on screen rather than guessing. The Firebase console UI is the source of truth — let me describe what I see if my screenshots aren't matching your instructions.

Ready when you are. Start by asking me one question to make sure we're aligned before walking me through step 1.
```

---

## What to do with this

1. Open a fresh Claude chat (web or desktop)
2. Paste the prompt block above
3. Claude asks one alignment question — answer it
4. Walk through the steps one at a time
5. At the end you should have:
   - A Firebase project named (likely) `yumi-book-app`
   - Authentication enabled with Google
   - Firestore database in test mode
   - Web app registered with a config object copied somewhere safe
   - A clear understanding of what comes later (security rules at Stage 6)

## Don't skip

The config object is what Stage 1.3 of the build needs. If you finish Firebase setup and don't have the config saved somewhere, the next time you reach Stage 1.3 you'll have to come back to Firebase and fish it out again. Save it now — a notes app, a password manager, anywhere you'll find it later.
