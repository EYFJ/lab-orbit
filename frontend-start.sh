#!/bin/sh
set -eu
cd /app/frontend
current_hash=$(sha256sum package.json package-lock.json | sha256sum | cut -d ' ' -f 1)
previous_hash=$(cat node_modules/.laborbit-dependencies-hash 2>/dev/null || true)
if [ "$current_hash" != "$previous_hash" ] || [ ! -x node_modules/.bin/vite ]; then
  npm ci --no-audit --no-fund
  printf '%s' "$current_hash" > node_modules/.laborbit-dependencies-hash
fi
exec npm run dev -- --config docker.vite.config.mjs