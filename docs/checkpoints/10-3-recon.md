# 10.3 — Stage 0 recon

HEAD: 2c2a66c (v3.92). Tracked tree clean (only 3 unrelated untracked PDFs/screenshot).
No decision gate for 10.3 — recon then proceed.

## Baselines (re-measured, match plan)
| File | Bytes | Lines |
|---|---|---|
| js/state.js | 73,484 | 1,803 |
| js/views.js | 306,306 | 7,423 |
| assets/components.css | 158,406 | 5,592 |
| sw.js CACHE_VERSION | — | praxis-v3.92 |

## addEvidence external branch (state.js:1125-1161)
- Validation accepts kind 'external' (state.js:1129).
- refId is set ONLY for book/entry (1132-1135); for external it stays `null`.
- external field = `{ title, author }` (1136-1143).
- Element shape: `{ id, kind, refId, external, quote, annotation, addedAt }`.

## id-gen for UUID duty
- `genEvidenceId()` (state.js:639-641): `'evidence_' + Date.now() + '_' + Math.floor(Math.random()*1000000)`.
- This IS the house id-gen pattern (no separate UUID util). Reuse it for the external refId — no new scheme.

## Schema chain (state.js)
- Literal anchor `SCHEMA_VERSION: '1.9.3'` (line 268) + reset (769) — UNTOUCHED per seed-ladder rule.
- migrate() steps run 1.9.0 -> ... -> 1.15.0 (terminal step at line 1765-1799 sets 1.15.0), then `return stored` (1800).
- SLICE 1 adds a `1.15.0 -> 1.16.0` step before line 1800. Each step is the
  guard-mutate-stamp shape: `if (stored.SCHEMA_VERSION === 'X') { ...; stored.SCHEMA_VERSION = 'Y'; }`.

## buildExternalForm (views.js:4418-4465)
- Collects title, author, quote, annotation (4421-4436). No required-title gate today.
- Save handler (4447-4452): fires `addEvidence(id,{kind:'external', external:{title,author}, quote, annotation})` regardless of empty title, clears host, refreshAttached.
- Toggle reveals/hides (4467-4473).

## Required-field house pattern (the one SLICE 2 mirrors)
The createX inline editor at views.js:890-919:
- `trimVal(el)` = `el.value.replace(/^\s+|\s+$/g, '')`.
- `refreshSaveEnabled()` computes ok from trimmed length, sets `saveBtn.disabled = !ok`.
- `input` listeners on the field re-evaluate live.
- Defensive guard in the save click: `if (titleVal.length === 0) return;`.
This is the pattern to mirror: disable Attach when title is empty, re-enable on input, defensive guard.

## Plan conformance notes
- SLICE 1 byte band +400..+1200 (migrate step + addEvidence branch).
- SLICE 2 byte band +150..+600 (validation guard).
- SLICE 3 sw bump -> v3.93.
