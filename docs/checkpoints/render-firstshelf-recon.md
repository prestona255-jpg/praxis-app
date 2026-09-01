# R-FIRSTSHELF RENDER ROUND — STAGE 0 RECON

STARTED. Base 53e7cf4 / v3.286 / origin/main. Rig: localhost:8811, 390x844 + 390x664, dpr 2.

## 1. Protocol docs

FOUND: CLAUDE.md · PROTOCOL.md · docs/FIX-PROTOCOL.md (v1.2) · docs/studio/sequence.md
· .claude/agents/{fix-implementer,fix-red-team,praxis-recon,praxis-reviewer,repo-mapper,
studio-mockup,studio-scan}.md · docs/design-spec.md · .claude/rig/README.md
MISSING: none of the docs the above point to were absent.
`sh tools/ground-truth`: HEAD 53e7cf4 · hook gate ARMED · FIX-PROTOCOL v1.2 · 7 agents.

## 2. Base state

HEAD               53e7cf4e4b49e93de85c1d0e908e1c96e7da11e7  == origin/main
CACHE_VERSION      praxis-v3.286 (sw.js:10)
tracked-dirty      0
untracked          106
parse gate         PARSE OK: js/views.js (exit 0)
bytes (blob==wt)   views.js 1,159,714 · components.css 887,011 · sw.js 6,041
blob CR            0 / 0 / 0
foundations md5    lumen-amber 070679b0… (locked) · marks 772886c0… (locked)

## 3. Per-defect anchors + baseline measurements

See the session report. Summary of verdicts:
D1 REPRODUCED · D2 REPRODUCED · D3 REPRODUCED · D4 REPRODUCED · D5 **NOT REPRODUCED**
D6 REPRODUCED · D7 REPRODUCED (one half only) · D8 REPRODUCED (at 664, + a 2nd half)
D9 REPRODUCED · D10 REPRODUCED (root cause = an omission from an existing reskin block)
RIDER REPRODUCED (and the collateral measured exactly: 1 of 31).

## 4. HALT

One question: the rider fork (relax rule 2 -> 1 measured regression in the 31-set).
