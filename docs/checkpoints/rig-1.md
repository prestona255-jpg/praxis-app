RIG-1 STARTED

# RIG-1 — the shared test rig

**Built 2026-11-23** on `aaaa875` (origin/main at the start: the docs-only commit that recorded FB-1a's push of
`42201f4`, praxis-v3.340). Opus 5.5. Tools and docs only: no file the app serves changed, no version bump.
Run mode: a tools-and-docs build with no served file, run straight through to the commit; the push is the only
gate (the prompt's RUN MODE, after Preston's go-ahead of 23 Nov 2026).

## What the rig is

One behaviour rig in the repo, `tools/rig/`, run the same way by the build chat and by Claude Code, and kept and
added to by every build that touches how the app reads, writes or signs in. It loads the real app into up to six
"devices" (iframes, one localhost port each, so each has its own storage) over one shared fake cloud, and drives
them through scenarios that end in PASS/FAIL checks. Preston's ruling, 23 Nov 2026: "Lets do the rig".

## Where it came from

FB-1a was proved twice. The build chat wrote a rig in Python (`docs/checkpoints/fb-1a-shots/fb1a_rig.py`); this
machine has no Python, so Claude Code ported its twenty-five scenarios to a page rig
(`docs/checkpoints/fb-1a-shots/rig/`) and added eight of its own (X0–X7). The chat then ran the page rig unchanged
on its own machine (Linux, Chrome, the Python launcher this build carries) and read what Claude Code read. RIG-1
writes no new rig: it gives the port a permanent home, splits it so a suite is one file, and adds a launcher for
each kind of machine. `docs/checkpoints/fb-1a-shots/` was only read from (copied, never moved or edited).

## What was built — `tools/rig/`

| file | from | measure |
|---|---|---|
| `README.md` | new: what it is, how to run it on each machine, the contract, how to add a suite, what a suite must imitate, what no rig can show | — |
| `driver.html` | fb-1a-shots `driver.html`; title "Praxis rig"; loads `core.js` | 2 lines changed |
| `core.js` | driver.js lines 7–150 byte for byte (Cloud, Device, Rig, check, stage, fail_user_reads, the log) + a new header + the runner | no scenario, no suite name (grep 0) |
| `bridge.js` | byte for byte | md5 `5d86b29be22d774bf7c7a43927641b21` |
| `fake-firebase.js` | byte for byte | md5 `eda7215e009b9ee268b11f97cb4f7903` |
| `helpers.js` | byte for byte | md5 `2d332247a5600faacdfb23556ce33e39` |
| `helpers-guard.js` | byte for byte | md5 `450c2c6dcc5f73dc7013001a50ec4dc4` |
| `scenarios/fb-1a.js` | driver.js `scenarios()` body, lines 153–504, byte for byte | S0–S24, S24 after S21 |
| `scenarios/fb-1a-extras.js` | driver.js `extras()` body, lines 516–619, byte for byte | X0–X7 |
| `scenarios/_template.js` | new: one device, sign in, add a book, one check on the cloud | 1 check |
| `serve.ps1`, `run.ps1` | serve-fb1a.ps1 and run-fb1a.ps1, made general (`-Suite`; exit 0 / 1 / 2) | — |
| `run.py` | extracted from the prompt file between its marker lines, as bytes | 162 lines · 7,938 B · md5 `f6d24290ee0e685808f610612b4b163e` · ASCII, no tabs, LF (the prompt file had no CR, so none was dropped) |

**How a suite registers.** A suite file calls `rigSuite(async function () { ... })` once. The runner reads
`?suite=<name>` (letters, digits, `-`, `_`), loads `/__rig/scenarios/<name>.js` with a script tag, runs the
registered function, and prints the summary line (`, then STOPPED in [Sx]` if it threw) and `RIG-DONE`. A missing
file, or a file that registers nothing, is one plain line and `RIG-DONE`. What changed around the moved bodies:
`async function scenarios() {` / `async function extras() {` → `rigSuite(async function () {`; the closing
summary lines (npass/nfail, the summary print, `return nfail`) left the suite files because the runner prints the
summary now; `}` → `});`. The `?mode=extra` switch is gone: the extras are `-Suite fb-1a-extras`.

**The contract**, in a sentence: ports 8800 (driver) and 8801–8806 (one per device), the driver opened at
`/__rig/driver.html?suite=<name>&label=<text>` in headless Chrome with a fresh profile, the routes and the
index.html CSP and injection exactly as listed, the last two lines the summary and `RIG-DONE`, exit 0 / 1 / 2.
The full text is `tools/rig/README.md`, "The contract between a launcher and the page".

## Proofs

All run 2026-11-23 with `tools/rig/run.ps1` (headless Chrome, a fresh profile each run), each read by the run's
own summary line. Logs in `docs/checkpoints/rig-1-shots/` (`proofs.txt` gathers the readings and exit codes).

| proof | run | reading | exit |
|---|---|---|---|
| P1 | fb-1a on the repo at HEAD `aaaa875` | **99 / 99 passed, 0 failed** (177 s) | 0 |
| P2 | fb-1a on a `git archive` copy of `3ce6a7b` | **22 / 46 passed, 24 failed, then STOPPED in [S11]** (74 s) | 1 |
| P3 | fb-1a-extras on HEAD | **20 / 20 passed, 0 failed** (117 s) — FB-1a's report gave 20 of 20 | 0 |
| P4 | _template on HEAD | **1 / 1 passed, 0 failed** (6 s) | 0 |
| P5 | fb-1a on a scratch copy of HEAD with leg M2 | **36 / 47 passed, 11 failed, then STOPPED in [S11]** (62 s) | 1 |
| P6 | scenario text, old vs new | **33 of 33** equal once indentation is ignored; order the same | — |
| P7 | md5s and the served-file diff | four lifted files and run.py at their md5s; served-file diff empty | — |
| P8 | `-Suite nope` | one line, `no suite named "nope": tools/rig/scenarios/nope.js was not found`, then `RIG-DONE`, in 2 s | 1 |

- **Same order as before (P1–P3), corroborated.** The sequence of stage headers and check names with their
  PASS/FAIL in each new log equals the FB-1a run log it repeats: P1 = `fb-1a-shots/runs/after-run-2.txt` (124
  lines), P2 = `runs/before.txt` (60 lines, the STOPPED line included), P3 = `runs/extras-after.txt` (28 lines).
- **P5, the rig still catches a fault from its new home.** The leg was made as FB-1a made it: one line of
  `js/integrations.js` (508) in a `git archive` copy of HEAD, `if (result.status !== 'error') { booksLoaded = true; }`
  → `booksLoaded = true;`, diff-checked to that one line. The 11 FAIL lines are the same, by name, as
  `docs/checkpoints/fb-1a-shots/legs/M2.txt` (S1 ×5, S2 ×3, S6, S7, S8), the STOPPED line is the same
  (`STOPPED in [S11]: TypeError: Cannot set properties of undefined (setting 'status')`), and so is the whole
  PASS/FAIL sequence (61 lines).
- **P6, how it was compared** (`rig-1-shots/p6-compare.sh`, output `p6-compare.txt`): each scenario is cut out of
  the old `driver.js` and the new suite file by the same rule — from its `await stage('<id>'` line to the line
  before the next `await stage(` line, or before `const errs = ` for the last — each line's leading whitespace is
  stripped, and the two cuts are compared by md5. S0–S24 (25) and X0–X7 (8): **33 of 33 equal**; the stage ids
  appear in the same order (S24 after S21). Corroborated: the whole bodies are byte-identical without ignoring
  anything (driver.js 153–504 = fb-1a.js 10–361; driver.js 516–619 = fb-1a-extras.js 12–115). The comparison can
  fail: with one character changed in S12 on a scratch copy it reads "S12 DIFFERENT" and 32 of 33.
- **P7.** bridge.js `5d86b29b…`, fake-firebase.js `eda7215e…`, helpers.js `2d332247…`, helpers-guard.js
  `450c2c6d…`, run.py `f6d24290…` (162 lines, 7,938 B, no CR, no tabs, ASCII). `git diff --stat origin/main --
  js assets index.html sw.js firestore.rules netlify` prints nothing; `docs/checkpoints/fb-1a-shots/` shows no
  change in `git status`.
- **Not a proof, a note:** run.ps1 was exercised on every exit path — 0 (P1, P3,
  P4), 1 by failed checks and a stop (P2, P5), 1 by no summary (P8), and 2 by `-TimeoutSec 5` on fb-1a
  (`exit2-timeout.txt`: "RUNNER: no RIG-DONE within 5 s"; the ports were free afterwards).

## What was not proved here

- **run.py.** This machine has no Python, so it was not run. It is unproven against THIS split until the build
  chat runs it after the push (the chat proved it only against the FB-1a port): `--suite fb-1a` on the repo root
  (expects P1's line), the same on a `git archive` copy of `3ce6a7b` (P2's), `--suite fb-1a-extras` (P3's) and
  `--suite _template` (P4's). If a reading differs, the chat says where; the fix is a small follow-up, not a revert.
- The rig itself cannot show what README.md's "What no rig can show" lists: how long the real Firebase library
  takes to give up on a read, that a write queued offline is sent when the connection returns, the keyboard,
  Safari's toolbars, the installed app.

## Deliberately not in it (NON-GOALS)

No file the app serves (js/, assets/, index.html, sw.js, firestore.rules, netlify/) and no `sw.js` bump. The
scenarios' logic: S0–S24 and X0–X7 are the same statements in the same order — no new check, no dropped check.
Not this build: the phone gate and the standard test library (their own build next, after a short design note),
mechanism-removed legs as a rig feature, a third launcher. `docs/checkpoints/fb-1a-shots/` read from only.
`d141fbc` and its branch untouched, never pushed. `speed-fb1a.ps1` stays where it is (not part of the shared rig).
Public docs: no real email address, uid or account name here or in `tools/rig/`; nothing from the parked audit.

## Ledgers

BUILD_STATE (refreshed at RIG-1; the next lane corrected to Preston's re-ruling of 23 Nov 2026: RIG-1, then the
phone gate, then the book page; build 1b alternates with the room builds instead of coming before them),
`docs/studio/sequence.md` Re-plan log (one dated line; the Builder regenerated with it), `BOARD.md` (one dated
line, no cell changes), `CLAUDE.md` (one paragraph in § Verification: the shared rig).

## Review

`praxis-reviewer` (Sonnet) on the finished tree, 2026-11-23: **CLEARED TO COMMIT** — gates 1–10 PASS (served files
untouched; lifted files and run.py at their md5s and equal to the prompt's bytes; the scenario bodies byte-identical
and P6 re-run at 33 of 33; core.js suite-free; serve.ps1 and run.py route for route; the logs show what this record
claims; fb-1a-shots untouched; no personal details; the ledger diffs surgical), ES3 / foundations / sw.js N/A (no
app code). Its notes: serve.ps1 matches paths case-insensitively where run.py is case-sensitive, and binds
`localhost` where run.py binds 127.0.0.1 — neither changes a route the app uses; and re-check the Builder after its
regen (done: `tools/studio-build` exit 0, warnings 0, builder.html 3 lines changed). No red-team: no app code changed.
The Builder was regenerated at this commit (it awaits Preston's push word).
