# The rig launcher race and the crashed-harness hole (R2's residuals R2-9 and R2-10)

Model: Opus 5.5. A rig-only commit on top of R2 (0e2da52), ruled by Preston 26–27 Nov 2026: its own commit, pushed
together with R2. No version bump; no app file (nothing under js/ or assets/, not sw.js); no change to what any R2
scenario checks. Files: tools/rig/run.ps1, tools/checks.ps1, tools/rig/README.md (the launcher contract), this record
and rig-launcher-shots/.

## Fix 1 — tools/rig/run.ps1
The fault: run.ps1 polled the log with `[IO.File]::ReadAllText($Out)` (run.ps1:36 and :45 at 0e2da52) while
serve.ps1:35 appends to it. ReadAllText asks for the file with other writers refused, so a read that landed on an
append threw IOException; with `$ErrorActionPreference = 'Stop'` and no cleanup, the launcher died and left its server
and Chrome running, and the next run's page posted its lines to that orphan.
The fix: (1) Read-Log reads through a FileStream opened with FileShare.ReadWrite|Delete (the writer keeps writing) and
tries again on an IOException; (2) everything from starting the server to the end of the wait sits in try/finally,
which stops this run's Chrome (by its profile) and its server however the run ends; (3) before starting, a server
already answering on localhost:8800 makes the run stop with exit 2 and a RUNNER line, instead of talking to it; and a
server that answered while ours had already exited is not taken for ours.

Proof, failing first (rig-launcher-shots/):
- Forced collision: a copy of 0e2da52 whose serve.ps1 holds each append open for 1.5 s (PROOF ONLY; never committed).
  0e2da52's run.ps1, suite r3: exit 1, `Exception calling "ReadAllText" ... because it is being used by another
  process.` at run.ps1:36, `FullyQualifiedErrorId : IOException`; port 8800 still listening afterwards
  (fix1-before-console.txt, fix1-before.txt). The fixed run.ps1, same copy: exit 0, `32 / 32 passed, 0 failed`,
  RIG-DONE, nothing left on 8800 (fix1-after*.txt).
- Orphan: with that crashed run's server still up (its log A), 0e2da52's run.ps1 ran _template into log B: exit 2;
  A grew 201 -> 2,804 bytes and held the run's own `1 / 1 passed, 0 failed` and RIG-DONE; B held only `RUNNER: no
  RIG-DONE within 60 s` (orphan-before-B.txt, orphan-logs-A.txt). The fixed run.ps1 beside a server started by hand
  (log A): exit 2 at once, `RUNNER: a rig server is already answering on localhost:8800 (another run, or one left
  behind); stop it and run again`; A stayed at 0 bytes (orphan-after-B.txt).

## Fix 2 — tools/checks.ps1 (R2-10)
The fault: cscript exits 0 after a JScript runtime error, and Check-Cscript scored on the exit code alone, so a harness
that died part-way scored PASS (26 Nov: r1-test died after 33 of its checks; "PASS harness r1-test exit 0").
The fix: Cscript-Crash finds cscript's own error line (`<file>(line, col) JavaScript runtime|compilation error`); any
cscript check whose output carries it FAILS with the line as its detail, whatever the exit code. A third self check,
`self harness-crash-fails`, runs a script that crashes on purpose and passes only if the crash is caught.
Proof, failing first: a copy of 0e2da52 with the pre-R2 tools/r1-test put back (it crashes on R2's views.js) and only
the _template rig suite. 0e2da52's checks.ps1: `PASS  harness r1-test  exit 0 ... JavaScript runtime error: The value
of the property 'r2FindOn' is null or undefined` and `CHECKS: 34 of 34 passed, 0 failed` (fix2-before.txt). The fixed
checks.ps1 on the same copy: `FAIL  harness r1-test  exit 0 ... crashed: ...` , `PASS  self harness-crash-fails`,
`CHECKS: 34 of 35 passed, 1 failed` (fix2-after.txt).

## The full run
rig-launcher-shots/checks-run-final.txt, alone, on the fixed tree: **CHECKS: 40 of 40 passed, 0 failed** (39 before, plus the new self
check). No harness that scored PASS before now scores FAIL: every harness ran to its end (r1-test 88 passed, r2-test 83/83).
A first full run's log was damaged by this session's own path scrub (it rewrote the file mid-run) and was discarded;
the run was repeated alone with its log kept outside the repo until it finished.
