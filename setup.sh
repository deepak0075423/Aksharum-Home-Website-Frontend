#!/usr/bin/env bash
# Sets up the Aksharum frontend for local development: installs deps.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if [ ! -f .env ]; then
  echo "No .env found — copying .env.example. Edit it if your backend runs on a different URL."
  cp .env.example .env
  exit 1
fi

echo "==> Installing dependencies (npm ci)"
npm ci

echo "==> Done. Start the dev server with: npm run dev"
