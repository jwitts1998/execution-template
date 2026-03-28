#!/usr/bin/env bash
#
# Report current repo status to Brain
#
# Usage: ./scripts/report-status.sh
#
# Environment:
#   BRAIN_ROOT - Path to command-center (required)
#   REPO_ID    - Override repo ID (optional)
#   REPO_NAME  - Override repo name (optional)
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Check BRAIN_ROOT
if [ -z "${BRAIN_ROOT:-}" ]; then
  echo "Error: BRAIN_ROOT environment variable not set"
  echo "Set it to the path of your command-center repo"
  exit 1
fi

# Build and run the status reporter
cd "$REPO_ROOT/mcp/status-reporter"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ ! -d "dist" ]; then
  echo "Building..."
  npm run build
fi

echo "Reporting status to Brain..."
node dist/report-status.js

echo "Done!"
