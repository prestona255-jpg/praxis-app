---
surface: home
route: "#home"
render_fn: renderHome (views.js:1440)
ground: dark
in_nav: yes
state: untouched
rounds: 0
---

## State

`#home` → `renderHome` (views.js:1440); dark ground; in top-nav (home). Landing / field of arcs.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] OG1 — Signed-out Home shows a "Welcome back." headline to a first-time visitor (views.js:1429) — a false premise at peak attention.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] OG2 — No obvious sign-in; signed-out nav shows a fabricated "P" avatar + "Your account" (views.js:436-461) — reads "already logged in," with no start.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] OG4 — Signed-out Home renders dead/negative personal-dashboard widgets ("No arcs yet", "Nothing open") (views.js:1481-1545) — showing a new person their empty account.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] H1 — Still-Reading spines are text-only (no covers) while the shelf shows covers (views.js:1398-1411; c11653) — two book surfaces contradict.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] H2 — `.home-mspine-title` is 10px with no clamp in a 52×78 box → long titles overflow (components.css:11656).
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] H3 — `.home-wfcap` (explains the whole-field interaction) is 9.5px `--lum-ink-4` ~3.4:1 (components.css:11630) — lowest contrast on the copy that most needs reading.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: MEDIUM] H4 — The whole-field variant has no section label; its purpose is unnamed (views.js:1456-1486) — the "field purpose unclear" friction.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: LOW] H5 — `.home-altnote` (explains the field/left-off toggle) is 13px `--lum-ink-4` ~3.4:1 (components.css:11616).
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Hygiene] Home Hygiene → sweep — dead landing CSS and a stale comment.

## Round history

## Next
