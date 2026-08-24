#!/usr/bin/env bash
# Restart the prod server and screenshot routes.
#   scripts/shot.sh '[["/tour","tour-1",1440,950,false]]'
#   PORT=3014 scripts/shot.sh '[["/","home",1440,950,true]]'
# Screenshots land in .shots/ ; server log in .shots/prod.log
set -uo pipefail

PORT="${PORT:-3013}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/.shots"
TARGETS="${1:?usage: shot.sh '<json targets>'}"

mkdir -p "$OUT"

# Narrow pattern: only this project's server on this port.
pkill -f "next start -p $PORT" 2>/dev/null

# Local binary, never npx -- npx would fetch from the registry if next were missing.
NEXT="$ROOT/node_modules/.bin/next"
[ -x "$NEXT" ] || { echo "next not installed in $ROOT" >&2; exit 1; }

# next start needs a build; BUILD=1 forces a rebuild of a stale one.
if [ ! -f "$ROOT/.next/BUILD_ID" ] || [ "${BUILD:-0}" = "1" ]; then
  echo "building..."
  (cd "$ROOT" && "$NEXT" build > "$OUT/build.log" 2>&1) || {
    echo "build failed, see $OUT/build.log" >&2; tail -20 "$OUT/build.log" >&2; exit 1; }
fi

# Own the server for the life of this script and tear it down on the way out --
# a surviving server would make the script's caller wait on it forever, and
# leaving one running is what forced the pkill in the first place.
cd "$ROOT"
"$NEXT" start -p "$PORT" < /dev/null > "$OUT/prod.log" 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null; wait "$SERVER" 2>/dev/null' EXIT

# Poll for readiness instead of a blind sleep.
for _ in $(seq 40); do
  curl -sf -o /dev/null "http://localhost:$PORT" && break
  kill -0 "$SERVER" 2>/dev/null || { echo "server died, see $OUT/prod.log" >&2; exit 1; }
  sleep 0.5
done

node "$ROOT/scripts/shot.mjs" "$PORT" "$OUT" "$TARGETS"
