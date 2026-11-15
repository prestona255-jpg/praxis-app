# DESIGN HANDOFF — 10 November 2026

Written by **Fable 5.1** (claude-fable-5-1), the L4 design chat, seventeenth sitting (8–10 Nov 2026). Follows DESIGN-HANDOFF-30oct.md (Opus 5.5). Carry: **p2-carry-v18** (MANIFEST.txt holds every file's size and md5).

## 1 · Ground, verified against the repo
- prestona255-jpg/praxis-app HEAD **c6a32eb** (30 Oct) = L1.2c = sw.js `praxis-v3.316`, live (Preston, 8 Nov). praxisreader.com was not reachable from the design workspace's proxy; the repo was.
- No commit after c6a32eb: the **L1 close-out docs are still owed** (checkpoint close with the felt-pass table, sequence.md `## Shipped`, BUILD_STATE, the two L3 ratios). The L4 opening prompt lands them (Stage 5.3).
- L1.2c phone pass: **all PASS, nothing open** (Preston, 8 Nov). L1-NAME and D11–D14 stay on the ledger.

## 2 · Ruled this sitting (p2-seventeenth-sitting-rulings.md)
- **83** L4 moves ahead of L2: L4 → L2 → L4b → L5 → L6 → L7b. The 148-book main account is the test library.
- **84** The Yumi row leaves Home (the corner Bloom stays).
- **85** Sky controls (Threads, Names, the Lenses door) live under a 500 ms long-press on the flower; no chips under the sky.
- **86** Yumi's reading and her offers get a dedicated **Lenses page**; the Home sky holds only kept lenses; Home carries one quiet door line.
- **87** The You sky has three modes: Lenses · Categories · Marks.
- Design calls **S1–S16** (sizes, rings, names, threads, honest lines, the sheet's depth, leave-out, the Lenses page order, the no-yes door, the say-back's name line) — **all confirmed by Preston 9 Nov**, with "I defer to you on all decisions" for the contract's calls.
- Not reopened, applied as ruled: Sunflower canon, night default, Garden only (r82), the Pool, the seven-beat walk, the floor of 5, the say-back in Yumi's panel with the lens pinned (eleventh r4 — the brief's "tell her" was the tenth-sitting wording; flagged, Preston kept the panel).

## 3 · Delivered (four deliverables, each phone-passed)
1. **Praxis Lens Sky** (artifact SaJePz2Px7znXhcxVvkjjx, v3 with the final engine) — Home and You, night/day, 390/1360, 0·1·3·5·8·12·16 lenses, honest states, an offer waiting, You's three modes, the sky sheet. Suite `tools/sky17.py`: 122 runs, 1,927 checks, 0 failed.
2. **Praxis Lens Sheet** (artifact FE9FFav88QKTyALG1WF4CV, v2 with the final engine) — the lens sheet with its depth, the say-back pinned in her panel (three rounds, scripted), the offer card, the Lenses page (six states). Suite `tools/sheet17.py`: 54 runs + 12 interactions, 453 checks, 0 failed.
3. **L4 Lens Engine Contract** (artifact 7EhWXDqmxT7gJJykn3y1g5; `l4-lens-engine-contract.md`) — what Yumi is sent / what comes back / the ten-step eval incl. the voice lint and the ≥3:1 colour clamp / the one-yes gate / cost against the 300/day ceiling / the iPhone motion gate / the exact live lines that change / the engine's surface / five added PASS proofs.
4. **L4-OPENING-PROMPT.md** — for Opus in Claude Code: Stage 0 stop → Stages 1–5 autonomous → one report → commit+push v3.317 (sky dark-launched behind `praxis_sky`, `?sky=on`) → the motion gate on Preston's phone → Stage 6 flip v3.318. Re-evaluated three rounds (anchors pinned to live lines, the live-call rule, the switch's placement, the engine-edit path on a gate FAIL).

## 4 · The engine (one file, two consumers)
`hand.js` L4 edition — 40,981 B, md5 fd51ca7e69325ad3f93c4be54d974d9a — is loaded by both mockups and lifted byte-for-byte by the build. Garden only (17, amendment 1.3's ten + seven), colour by name-hash stepped to the next free colour in the sky, clamped ≥3:1 on both skies (only Inheritance clamps, #9C4A6E → #A15273); size 36 + 13·√books with density scales, never under 44; one ring to eight, two past eight (the fuller lenses outside, the inner ring counter-turning); names with flip-then-step-back collision handling; threads by shared books (≥2 when full); `stats()` for the motion gate; the loop stops hidden/off-screen; reduced motion stills it. `sky.css` — 11,522 B, md5 89f56ebe061f66985d30888e5969f10b — is the host CSS, tokens only (color-mix of --on-n for hairlines), the engine's SVG colours exempt as content (R2).

## 5 · Open on the ledger (new; not design)
- The `?sky` switch and `praxis_sky_stats` readout are the gate's instruments; Stage 6 removes them.
- Per-device memory of Threads/Names (ls keys) — a build detail.
- The no-yes door on the Lenses page carries two PROPOSED consent lines (S14) for L3 to ratify in consent-copy.md.
- The Garden's seven "more" colours are colours, not names: a lens's name is always its own (the amendment's own-slot names are not shown).
- At 7–8 lenses on a phone, names step back when they would cross a neighbour; if the felt pass on the live sky finds that hiding rather than calm, the knob is `cls(order[i].el,'named', i<4)` in hand.js.
- The lens-contract's line citations drifted (integrations.js :1246 → :1412, :2772 → :3060; state.js :2571 → :2669): expected, noted in the prompt, not corrected in the contract.
- The design-side suites are Python Playwright and cannot run on Preston's Windows machine (Node blocked); they stay in the carry as the record.

## 6 · Next
Preston pastes L4-OPENING-PROMPT.md into Claude Code (Opus) in the repo; three "go"s (Stage 0 · the commit+push · the flip with the gate's numbers). After L4 ships: L2 file import opens, then L4b (Open Lens and the Day Three rooms), with the sky's felt pass on the live phone as L4b's first stop.
