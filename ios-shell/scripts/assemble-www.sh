#!/usr/bin/env bash
# assemble-www.sh -- copy the Praxis runtime web files from the repo root into
# ios-shell/www/, the folder Capacitor bundles into the iOS app (webDir).
# The list is every path index.html and js/ load at runtime (L7a Stage 0 census):
# the app shell, its scripts and styles, the vendored Firebase + zxing, and the
# only two runtime files that live under docs/.
set -euo pipefail

SHELL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$SHELL_DIR/.." && pwd)"
WWW="$SHELL_DIR/www"

FILES="index.html manifest.json sw.js docs/studio/universal-depth.css docs/yumi-voice.md"
DIRS="js assets vendor"

rm -rf "$WWW"
mkdir -p "$WWW"

for f in $FILES; do
  if [ ! -f "$ROOT/$f" ]; then echo "assemble-www: MISSING file $f" >&2; exit 1; fi
  mkdir -p "$WWW/$(dirname "$f")"
  cp "$ROOT/$f" "$WWW/$f"
done
for d in $DIRS; do
  if [ ! -d "$ROOT/$d" ]; then echo "assemble-www: MISSING dir $d/" >&2; exit 1; fi
  cp -R "$ROOT/$d" "$WWW/$d"
done

echo "assemble-www: docs/ files copied (these two only):"
ls -l "$WWW/docs/studio/universal-depth.css" "$WWW/docs/yumi-voice.md"
count=$(find "$WWW" -type f | wc -l | tr -d ' ')
bytes=$(find "$WWW" -type f -print0 | xargs -0 cat | wc -c | tr -d ' ')
echo "assemble-www: $count files, $bytes bytes -> $WWW"
