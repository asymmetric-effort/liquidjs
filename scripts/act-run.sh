#!/usr/bin/env bash
# Run GitHub Actions workflows locally using act.
#
# Usage:
#   ./scripts/act-run.sh              # Run all jobs
#   ./scripts/act-run.sh lint         # Run only the lint job
#   ./scripts/act-run.sh test         # Run only the test job
#   ./scripts/act-run.sh build        # Run only the build job
#   ./scripts/act-run.sh e2e          # Run only the e2e job
#   ./scripts/act-run.sh --list       # List available jobs
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

export PATH="$HOME/bin:$PATH"

if ! command -v act &>/dev/null; then
  echo "Error: act is not installed. Install it with:"
  echo "  curl -sSL https://github.com/nektos/act/releases/latest/download/act_Linux_x86_64.tar.gz | tar -xz -C ~/bin act"
  exit 1
fi

if ! docker info &>/dev/null 2>&1; then
  echo "Error: Docker daemon is not running."
  exit 1
fi

cd "$PROJECT_DIR"

JOB="${1:-}"

case "$JOB" in
  --list|-l)
    echo "Available jobs in .github/workflows/ci.yml:"
    act --list
    ;;
  lint|test|build|e2e)
    echo "=== Running job: $JOB ==="
    act -j "$JOB" --container-architecture linux/amd64 --env ACT=true
    ;;
  "")
    echo "=== Running all CI jobs ==="
    act push --container-architecture linux/amd64 --env ACT=true
    ;;
  *)
    echo "Unknown job: $JOB"
    echo "Available: lint, test, build, e2e, --list"
    exit 1
    ;;
esac
