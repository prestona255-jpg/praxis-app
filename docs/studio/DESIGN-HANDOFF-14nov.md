# DESIGN-HANDOFF — 14 Nov 2026 · the L4b design chat (eighteenth sitting)

Model: Claude Fable 5.2 (`claude-fable-5-2`). Chat opened 11 Nov on the v18 carry; closed 14 Nov with this v19 carry.

## What this chat was asked for, and what it made

| Asked (the brief) | Made |
|---|---|
| 1. Open Lens, the page | Three drawings; the third approved for structure (11 Nov), then recoloured as **Open Lens 4** (14 Nov). |
| 2. Room census, and the walk's rooms Open Lens unlocks | `rooms-census.md`, against main at v3.316. Fourteen rooms drawn in the Style Study, plus Capture, the hold menu and four empty rooms. |
| 3. L4b contract | §D of `p2-eighteenth-sitting-rulings.md`: reads, writes, back stack. **Short on purpose**; exact voice lines wait for each room's own prompt. |
| 4. L4b opening build prompt | **Not written as one prompt.** L4b became seven lanes (§C of the rulings). The first, `LC1-OPENING-PROMPT.md`, is written. The rest need L4 on main. |

## What changed underneath the brief

Preston reopened the look on 11 Nov. The brief's rule "decisions already ruled are not reopened (Sunflower canon…)" was his to lift, and he lifted it. The result is canon amendment 1.5 and rulings r88–r97. Night default, Garden only, floor 5, rulings 82–87, S1–S16 and say-back in Yumi's panel were **not** reopened.

## State of the build, as far as this chat could see

- `praxis-app` main is at **v3.316** (L1.2c). No `js/hand.js`, no `css/sky.css`, no sixteenth or seventeenth sitting files. **L4 is not on main.** Preston did not know its state on 14 Nov.
- LC1 must not run while another lane is mid-flight. Its Stage 0 stops on a dirty tree and asks whether to wait for L4. The design chat's recommendation: **wait for L4.**

## The carry (see MANIFEST.txt for size and md5)

- `LC1-OPENING-PROMPT.md` — paste into Claude Code (Opus). Three "go"s: Stage 0 · commit · push.
- `lc1/` — the exact expected results for the three token files and the diff. Verified here by dry run on a copy of main: six files change, zero bytes of size change, no Sunflower literal left outside `docs/`, `design/`, `proposals/`, `vendor/`.
- `v1-canon-delta-amend-1.5.md`, `p2-eighteenth-sitting-rulings.md`, `rooms-census.md`, this file.
- `design/` — the two mockups (wrapped pages and their bodies) with `hand.js` unchanged beside them (md5 `fd51ca7e69325ad3f93c4be54d974d9a`).
- `tools/` — the suites and builders (design-side Python Playwright). `out/` — the suite logs and eight overview images.

## Found while reading the repo, not asked for

1. **`build-theme.pl` cannot regenerate the live `theme.css`.** Fed the current file it exits 255 ("unparsed :root text: color-scheme: dark;"). It was a one-time transformer. The L1 record's H3 finding stands in a new form. LC1 keeps the two sources in step by hand and reports this as a separate task.
2. **`#account` redirects to `#profile`.** Settings and the delete flow live inside `renderProfilePage`. Day Three and the Style Study draw them as their own pages (ledger N4).
3. **`#book/<id>/marks` redirects to the book.** Day Three draws a marks page (ledger M1).
4. **`--gold` is used as a text colour 49 times in `components.css`.** On day paper it was already about 1.76:1 under canon 1.4. LC1 measures and lists; it does not fix.

## For the next design sitting

1. **The engine for the blue sky (E1).** Change `hand.js` `spawn()` stroke colours, the lens tint mix, and the Garden clamp for a blue ground; ship `hand.js` v2 with its own suite. The Style Study's `tintCurrent()` shows the target and is not the method.
2. Rule the ledger (§E): G1 first (status is invisible), then N1–N5 (where Arcs, Scan, About, Settings and Your data live), then W1–W3 (the empty-room words).
3. Re-read each redrawn room against the live strings before its prompt is written.
4. Not drawn: Yumi's panel, the lens sheet from the sky, first-run, "Tell Preston".

## Open questions this chat could not close

- Has L4 pushed, and at what version? Did its phone pass find anything that touches Open Lens?
- Does the dial clear a real iPhone keyboard? Does 0.43 s feel right for press-and-hold?
