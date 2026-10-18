# ios-shell — the Praxis iOS app shell (L7)

Praxis ships to the App Store as a **bundled** app: the same web code, packaged
inside a Capacitor iOS shell — not a wrapper around the live site.

This folder holds only the shell's build-time tooling. Nothing here is loaded by
the web app, and Node never runs on the Windows build machine — all Node and
Xcode work happens in GitHub Actions.

| Path | What it is |
|---|---|
| `package.json` | Capacitor 8.5.2 (`@capacitor/core`, `/cli`, `/ios`), devDependencies only |
| `capacitor.config.json` | app id (a **placeholder** until L7b), name, `webDir: www`, `loggingBehavior: debug` |
| `scripts/assemble-www.sh` | copies the runtime web files from the repo root into `www/` and prints the file count and bytes |

**Generated, never committed** (see the root `.gitignore`): `www/` (assembled
web files), `ios/` (the Xcode project `npx cap add ios` creates), `node_modules/`.

## The simulator workflow

`.github/workflows/ios-shell-sim.yml` runs **only** when someone presses
"Run workflow" on the Actions tab (`workflow_dispatch`) — never on push or pull
request. On a macOS runner it: installs the Capacitor packages, assembles
`www/`, creates and syncs the iOS project, builds the app (Debug) for the
iPhone simulator, boots the first available iPhone, installs and launches the
app, takes a screenshot after 25 s, and saves the page console. It uploads the
screenshot, both console logs and the generated `package-lock.json`.

The page console is captured with `xcrun simctl launch --console-pty`, because
Capacitor forwards the page's `console.*` to the app's standard output (Debug
builds only); a `log stream` capture is kept as a second artifact.

## What the web app does inside the shell

- `js/state.js` sets `PRAXIS_API_BASE` to the Netlify origin when
  `window.Capacitor.isNativePlatform()` is true, so server functions are called
  by full address; on the web it is `''` and nothing changes.
- `index.html` skips service-worker registration inside the shell.
- `js/app.js` logs one `[praxis-shell]` feature line inside the shell only.

Not yet in the shell: native sign-in, the real bundle ID, icons and TestFlight
(L7b); fonts still load from Google Fonts until L1.
