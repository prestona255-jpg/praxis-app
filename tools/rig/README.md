# The Praxis rig

One behaviour rig, kept in the repo, run the same way by the build chat and by Claude Code, and added to by
every build that touches how the app reads, writes or signs in. It loads the real app (the tree's own
`index.html` and every file it pulls in, byte for byte) into several "devices" at once, gives them one shared
fake cloud in place of Firebase, and drives them through scenarios: reads that fail, a device that is
behind, the app closed before a write lands. Each scenario ends in `check()` lines that read PASS or FAIL.

Nothing here is served to a reader: `tools/` is not part of the app, and changing it needs no `sw.js` bump.
Rig code is not app code: the app's ES3 rule does not bind it.

## Where it came from

FB-1a (the shelf lock and the notes guard, v3.340) was proved twice. The build chat wrote a rig in Python
(`docs/checkpoints/fb-1a-shots/fb1a_rig.py`). The Windows build machine has no Python, so Claude Code ported
its twenty-five scenarios to a page that drives iframes (`docs/checkpoints/fb-1a-shots/rig/`), and added
eight of its own. The chat then ran that page rig unchanged on Linux with the Python launcher here, and read
exactly what Claude Code read. RIG-1 (23 Nov 2026) gave the page rig this permanent home and split it so a
suite is one file. `docs/checkpoints/fb-1a-shots/` stays as the record of what proved FB-1a; it is not run.

## What is here

| file | what it is |
|---|---|
| `driver.html` | the driver page; it loads `core.js` |
| `core.js` | everything that is not a scenario: the shared cloud, the devices, `check()`, `stage()`, `fail_user_reads()`, the log, the runner |
| `scenarios/<name>.js` | one suite per file (`fb-1a`, `fb-1a-extras`, `_template`) |
| `bridge.js` | put into each device's `index.html`: carries the fake's calls, `ev()` and page errors to the driver |
| `fake-firebase.js` | answers the app's request for Firebase: auth, Firestore reads and writes, all routed to the driver's cloud |
| `helpers.js` | `T.*`, loaded into each device after it opens: the app's own write sites, statement for statement (`T.addBook`, `T.note`, `T.editArc`, `T.latches`, `T.pending`, `T.del`, ...) |
| `helpers-guard.js` | put into each device's `index.html`: records every toast in `window.__toasts` |
| `serve.ps1`, `run.ps1` | the Windows launcher (PowerShell and the installed Chrome) |
| `run.py` | the launcher for machines with Python 3 and Chrome (Linux, macOS); standard library only |

## How to run it

On Windows (no Python needed), from the repo root:

    powershell -NoProfile -ExecutionPolicy Bypass -File tools/rig/run.ps1 -Suite fb-1a -Tree . -Label "HEAD" -Out rig-fb-1a.txt

Optional: `-TimeoutSec 900`, `-Chrome <path to chrome.exe>` (else the usual install folders are tried).

On Linux or macOS:

    python3 -I tools/rig/run.py --suite fb-1a --tree . --label HEAD --out rig-fb-1a.txt

Optional: `--timeout 900`, `--chrome <path>`, `--rig-dir <folder holding driver.html>`.

`-Tree` / `--tree` is any folder holding the app's `index.html`: the repo root, or a `git archive` copy of an
older commit (`git archive <sha> | tar -x -C <folder>`) to read the same suite against code before a fix.
The log is written as the run goes; its last lines are the summary and `RIG-DONE`. Runs take from seconds
(`_template`) to about three minutes (`fb-1a`). Only one run at a time: every run uses ports 8800 to 8806.

## The contract between a launcher and the page

`run.py`, `run.ps1` and `serve.ps1` are written to this; a third launcher would be too.

- Ports: 8800 serves the driver page; 8801 to 8806 serve the tree, one port per device, so each device is its
  own origin with its own localStorage.
- The page is opened at `http://localhost:8800/__rig/driver.html?suite=<name>&label=<text>`, in headless
  Chrome with a fresh profile.
- Routes, on every port: `/__rig/<path>` answers the file `tools/rig/<path>`; any path holding
  `/vendor/firebase/` answers `fake-firebase.js` when it also holds `firebase-app-compat` and the empty script
  `/* rig */` otherwise; `/` answers `/__rig/driver.html` on 8800 and `/index.html` on the others; every other
  path answers that file of the tree, byte for byte, or 404. The tree's `index.html` alone gets the header
  `Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:` and, straight after
  `<head>`, the two script tags for `/__rig/bridge.js` and `/__rig/helpers-guard.js`. Every answer carries
  `Cache-Control: no-store`. `POST /__rig/log` appends its body to the log.
- The page's last two lines are the summary, `<label>: N / M passed, F failed` (followed by
  `, then STOPPED in [Sx]` when a scenario threw), and `RIG-DONE`.
- A launcher exits 0 when `RIG-DONE` was printed, the last summary line reads "0 failed" and the run was not
  stopped; 1 when a check failed or the run stopped; 2 when `RIG-DONE` never came within the timeout (900 s
  unless told).
- `run.ps1`: `powershell -NoProfile -ExecutionPolicy Bypass -File tools/rig/run.ps1 -Suite <name> -Tree <folder> -Label <text> -Out <log file>`
- `run.py`: `python3 -I tools/rig/run.py --suite <name> --tree <folder> --label <text> --out <log file>`

When the suite named has no file, the page says so in one line, prints `RIG-DONE`, and the launcher exits 1
(there is no summary line, so the run is not clean). It does not wait for the timeout.

## How to add a suite

Adding a suite is adding one file. Nothing else changes: not `core.js`, not either launcher.

1. Copy `scenarios/_template.js` to `scenarios/<build>.js` (letters, digits, `-` and `_` in the name).
2. The file calls `rigSuite(async function () { ... })` once. That function is the suite: it opens devices,
   drives them, and calls `check()`. If it throws, the run stops and the summary says in which `stage()`.
   `core.js` prints the summary line and `RIG-DONE`; the suite does not.
3. Run it: `-Suite <build>` / `--suite <build>`.
4. Commit it with the build. Suites stay: a later build runs the earlier suites too.

What a suite has to work with, all declared by `core.js` and in scope in the suite file:

- `rig.device(name)` gives a device (`phone`, `laptop`, `newphone`, `tablet`, `spare`, `guestphone`, one
  port each). On a device: `await d.open(wait)`, `d.close()` (the app closed, storage kept),
  `await d.sign_in(uid, wait)`, `await d.ev('<js run in the app>')` (returns its value), `await d.waitFor('<js>', ms)`,
  `await d.wait(ms)`, `d.errors` (its page errors).
- `rig.cloud`: the shared cloud. Read it with `books(uid)`, `book(uid, id)`, `notes(uid)`, `arcs(uid)`,
  `sub(uid, id)`, `arts(uid)`, `lens_names(uid)`, `user_docs(uid)`, `sets(dev, col)`, `docs`, `log`.
  Bend it with `rig.cloud.offline.add(dev)` (reads and writes fail), `fail_user_reads(rig, dev, on, cols)`
  (reads fail, for every user collection or only `cols`), `rig.cloud.slow[dev] = ms` (a failing read answers
  only after `ms`).
- In a device: `T.*` (`helpers.js`), `__rigSignIn(uid)` (a sign-in event), `__rig.gets` (reads per collection),
  `__rig.reauths`, `__rig.authDeleteFails`, `__rig.authDeleteMs`; `localStorage` `rig_auth_delay` (ms before
  the sign-in event at start-up) and `rig_auth` (the account that event brings).
- `check(name, got, want)` compares deeply (key order ignored; `null` and `undefined` equal). `stage(id, title)`
  starts a scenario. `get`, `sorted`, `allTrue`, `J`, `sleep`, `print` are helpers.
- End a suite as `fb-1a` does, with the page-errors check across every device, so a page error fails the run.

The scenario ids and the check names are the record: a later build that changes one says so. If a suite
needs a helper the others will want, it may keep its own helpers in its file; moving one into `core.js` or
`helpers.js` is a change to every suite and is proved by re-running all of them.

## What a suite must imitate

A rig is kinder than the app unless it is made not to be. Every build that touches how the app reads, writes
or signs in says in its prompt which of these its suite exercises:

  1. A read that fails SLOWLY, seconds after it was asked, with the reader acting meanwhile (the cloud's slow
     setting; fb-1a S15, S23).
  2. A sign-in event that arrives AFTER the app is already up as the cached reader (rig_auth_delay; S20).
  3. The app writing BY ITSELF: the shelf sort's stamp, a cover lookup landing, a lens getting its look (S19;
     fb-1a-extras X7).
  4. A second device that is BEHIND the cloud (S1, S11).
  5. The app CLOSED before a write lands (S3, S4, S13).
  6. A read that fails for ONE collection only (S2, S10, S21).
  7. A retry already in flight, and a second sign-in event for the same account (S12, S18).

## What no rig can show

How long the real Firebase library takes to give up on a read, and that a write queued offline is sent when
the connection returns; the keyboard; Safari's toolbars; the installed app. Those stay with the live check
after a push and with Preston's phone.

## The suites today

| suite | what it proves | reads at RIG-1 (HEAD `aaaa875`, v3.340) |
|---|---|---|
| `fb-1a` | FB-1a: S0 to S24, the build chat's scenarios (S24 runs after S21) | 99 / 99; on `3ce6a7b` (before FB-1a) 22 / 46 then STOPPED in [S11] |
| `fb-1a-extras` | FB-1a: X0 to X7, Claude Code's own (the composers, Undo, the timer steps, the real sort and lens render) | 20 / 20 |
| `d1a` | D1a (v3.341): a to h, the brief's (offline edits kept across a close, the rulings on which edit wins, the switch, the merge's artifact site, the size meter); i, j, k, Preston's additions (an edit before the sign-in event, one collection's read failing, a save sent but never acknowledged); l to o, Preston's ruling at the commit gate (an artifact whose book is gone, and a sub-theory whose arc is gone, stay deleted; a note is kept; D1a's memory cleared on an account switch and a wipe). Imitates behaviours 2, 3, 4, 5 and 6 | 82 / 82; on `0b0a730` (before D1a) 43 / 82 |
| `_template` | nothing: the smallest suite that works | 1 / 1 |

D1a changed one fb-1a check, as the record: S13 used to record the known limit "the EDIT reverted to the
cloud copy (BR-03, next build)"; from D1a it records the edit kept, on the device and in the cloud. And S22: it recorded the artifact of a
book deleted on another device as kept; from D1a (Preston's ruling of 24 Nov) that artifact stays deleted.

The d1a suite bends the cloud from inside its own file, for its own scenarios only: a write can be
applied while its answer is lost (d3, k2), and a set over 1,048,576 bytes is refused with the service's
message (h). `core.js` is unchanged.
