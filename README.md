# Praxis

A reading community organized by depth of engagement, not metrics of attention. Yumi is the companion inside it.

## Status

Pre-build. Planning documents in `docs/`. Stage 0 (Yumi voice document) in progress.

## What's in this repo

Right now: planning documents only. Code starts at Stage 1.

- `docs/praxis-companion.pdf` — canonical project document. Brand position, build sequence, voice anchors.
- `docs/book-app-timeline.docx` — stages and calendar view.
- `docs/stage-0-prompt-praxis.md` — the prompt to paste into a fresh Claude chat for Stage 0.
- `docs/01-stage-0-voice-document.docx` — original Stage 0 prompt (superseded by stage-0-prompt-praxis.md).
- `docs/02-stage-1-foundation.docx` — Stage 1 prompt for when you're ready.
- `docs/00-template.docx` — reusable scaffold for future stage prompts.
- `docs/setup-bookshop.md`, `setup-firebase.md`, `setup-netlify.md` — handoff prompts for external accounts.
- `docs/yumi-book-app-living-document.html` — narrative living document (open in browser, edit in Claude chats).

## Build sequence

See `docs/praxis-companion.pdf` Order of Operations for the canonical sequence. Short version:

1. Bookshop affiliate application (slow external dependency)
2. GitHub repo (this repo)
3. Firebase setup
4. Stage 0 — Yumi voice document
5. Netlify setup
6. Stage 1 — Foundation code

## Conventions

When code arrives at Stage 1: vanilla JS only (`var`/`function`, no `const`/`let`/arrow/class/template literals), CSS variables only, fixed file load order. See `docs/02-stage-1-foundation.docx` for full conventions.

## Brand position (non-negotiable)

- Yumi never summarizes books. She redirects: "I'd rather read it with you. Where are you in it?"
- The Notebook is fully private. Never published, never surfaced to other users.
- One Book Artifact per user per book. Structural rule, enforced in data model.
- Star ratings de-emphasized. Never the primary signal on book pages.
- No follower counts, like counts, or reshare counts as primary UI.
