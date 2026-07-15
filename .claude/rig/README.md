# PRAXIS DW RIG — `.claude/rig/`

The desktop-wave measurement rig: a local static server, a seed/auth stub, and a
measurement harness. A session **LOADS this rig; it does not rebuild it** (the
rig-efficiency law, DW-4 2026-07-14). The hard-won facts live in each file's own
header comments — read them before relearning anything the hard way.

## ⚠ Location guard — do not move this directory

**Intentionally lives in a dot-directory: NOT published on the Netlify deploy. Do
not move it to a published path.**

There is no `netlify.toml`, so the publish root is the repo root — but Netlify does
not publish dot-directories, which is what keeps this rig off the live site. Probed
live against `praxis-reading.netlify.app` on 2026-07-15, with every path below
present on `origin/main`:

| Path | Live |
|---|---|
| `/.claude/rig/seed.js` | **404** |
| `/.claude/rig/measure.js` | **404** |
| `/.claude/agents/praxis-recon.md` | **404** (corroborates: it is the dot-dir, not the file) |
| `/tools/parse-check` | **200** |
| `/index.html` | **200** (control — the probe works) |

`seed.js` is auth-shaped: it writes a fake `praxis_user`. Under `.claude/` that is
inert and unreachable. A move to any published path (`tools/rig/` included) would
**expose it** — `/tools/parse-check` returning 200 is the proof that `tools/` ships.
DW-4 proposed exactly that move on the false premise that `.claude/rig/` was already
served; the proposal was **RULED withdrawn (Preston, 2026-07-15)** once the live
probe falsified it. See `docs/checkpoints/dw-4.md` (the rig-exposure bullet).

Tracking works because `.gitignore` ignores `.claude/*` and then negates
`!.claude/agents/` and `!.claude/rig/`. Both negations are load-bearing — leave them.

## The three files

| File | What it is |
|---|---|
| `serve.ps1` | PowerShell `HttpListener` static server. Serves the **repo root**. |
| `seed.js` | Paste-able: `seedRig(opts)` + `rigIds()`. SW-kill, force-settle, auth stub. |
| `measure.js` | Installs `window.rig` — the D1–D6 gate instruments. ES5 on purpose. |

## Launching it

```sh
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/rig/serve.ps1 -Port 8790
```

Run it in the **background** — it blocks while listening. Port defaults to `8790`.
It resolves its root two levels up from its own directory (`$PSScriptRoot` →
`.claude/rig` → `.claude` → repo root), so it must stay two levels deep from the
root for that resolution to hold. It binds `localhost:$Port` and *tries* the
`127.0.0.1` twin, falling back to localhost-only when the urlacl reservation is
denied (this box has no admin). `KeepAlive` is forced false — otherwise the pane's
network-idle wait never fires. Every response carries `Cache-Control: no-store`.

Note `.claude/launch.json` does **not** contain a rig config; its entries point at
`.claude/static-server.ps1`, a different and gitignored file. Launch the rig by the
command above, not via `preview_start`.

## Loading it in the Browser pane

Because `serve.ps1` serves the repo root, the rig is reachable on its own origin —
load it instead of pasting 15KB per reload:

```html
<script src="/.claude/rig/measure.js"></script>
```

Either way it is **per page load**: a reload wipes `window.rig`, so re-load it.

## `window.rig` — the API (from `measure.js`)

Gate instruments, mapped to `docs/studio/praxis-desktop-canon.md` D1–D6:

- `rig.occ(sel)` — **D1** composition; content span / clientWidth. Its own header
  flags a known artifact: a left-pinned leaf skews the span, so eyeball
  `.left`/`.right` against the real column before believing a number.
- `rig.hollow(sel)` — **D1's vertical half.** Occupancy/ch/scroll are all
  horizontal; a vertical void is invisible to every one of them. This instrument
  exists because DW-4 shipped a 270px hole past every horizontal gate.
- `rig.ch(sel)` / `rig.chOf(el)` / `rig.widestProse(sel, minChars)` — **D2** measure (≤72ch).
- `rig.hscroll()` / `rig.overflowers()` — **D3** scroll.
- `rig.pointer(sel)` — **D4** pointer.
- `rig.body()` — **D5** density.
- `rig.rings(sels)` — **D6** focus. A CSSOM **match test, not a look**.
- `rig.ringProbe(sels)` — the real `:focus-visible` readout. Needs one **real Tab
  keypress** first to flip interaction modality to keyboard; it then persists, and
  later programmatic `.focus()` calls match. `el.focus({focusVisible:true})` does
  *not* work (the option is accepted, which makes it look like it did).
- `rig.radius(sel)` — resolved border-radius, for ring-deformation checks.
- `rig.vp()` — viewport readout.
- `rig.fingerprint()` — returns **both** `djb2` and `djb2geom`; report both and say
  which moved. A JS modifier class lands at every width, so the strict hash can
  move while geometry does not.
- `rig.proveInert(token, cond)` — the guard-band instrument. Delete your own block
  from the live CSSOM and re-fingerprint **within one load**: a 0-bit delta is
  provably inert. Cross-load hashes are polluted by async cover loads and by dpr
  differing per pane.
- `rig.bustCss(file)` (+ `rig.bustDone`) — swap a stylesheet `<link>` to a
  cache-bust query. This is how you iterate CSS without a new port.

## `seed.js`

`seedRig(opts)` unregisters every service worker and deletes every cache, then
force-settles transitions/animations, then stubs auth by seeding `praxis_user`
(uid `d0tester`, matching the D0 recon rig so measurements compare). The auth seam
is exactly one line: `getCurrentUser()` is `ls('praxis_user')`
(`integrations.js:660`). The `__praxis_seed__` "Pedagogy of Desire" workspace
self-seeds on a fresh origin — you do not need to inject it.

`rigIds()` reads the ids back. **Seed ids are per-origin** — the seeder mints them
from `Date.now()+random`, so every port re-seeds with different ids and a hardcoded
id silently renders the not-found path. Always use `rigIds()`.

## Two traps that have already cost gates

- **"Fresh port" is a lie.** A port unused *this session* is not a fresh origin: the
  pane's profile persists and a service worker registered by an *earlier* session
  survives there with its caches. The cache **name** is the tell. On every port:
  unregister, clear caches, reload, and assert your edit is actually live
  (`String(fn).indexOf('<token>')`, or `rig.rings`) **before** measuring. A gate
  measured on unverified bytes is fiction.
- **Screenshots in this headless pane are proven dead** (30s timeouts, D0 §2).
  Geometry is the evidence. Do not try.
