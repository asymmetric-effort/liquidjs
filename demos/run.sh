#!/usr/bin/env bash
# Launch a LiquidJS demo project.
#
# Usage:
#   ./demos/run.sh <project>       # Build and start a demo
#   ./demos/run.sh <project> -d    # Start detached
#   ./demos/run.sh --stop-all      # Stop all running demos
#   ./demos/run.sh --list          # List available demos
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if ! docker info &>/dev/null 2>&1; then
  echo "Error: Docker daemon is not running."
  exit 1
fi

if ! docker compose version &>/dev/null 2>&1; then
  echo "Error: Docker Compose is not installed."
  echo "Install: https://docs.docker.com/compose/install/"
  exit 1
fi

ARG="${1:-}"

case "$ARG" in
  --list|-l)
    echo "Available demos:"
    for d in "$SCRIPT_DIR"/*/docker-compose.yml; do
      name=$(basename "$(dirname "$d")")
      echo "  $name"
    done
    ;;
  --stop-all)
    echo "Stopping all demos..."
    for d in "$SCRIPT_DIR"/*/docker-compose.yml; do
      dir=$(dirname "$d")
      name=$(basename "$dir")
      if docker compose -f "$d" ps -q 2>/dev/null | grep -q .; then
        echo "  Stopping $name..."
        docker compose -f "$d" down
      fi
    done
    echo "Done."
    ;;
  "")
    echo "Usage: ./demos/run.sh <project>"
    echo "Run './demos/run.sh --list' to see available demos."
    exit 1
    ;;
  *)
    PROJECT_DIR="$SCRIPT_DIR/$ARG"
    if [ ! -f "$PROJECT_DIR/docker-compose.yml" ]; then
      echo "Error: No demo found at demos/$ARG/"
      echo "Run './demos/run.sh --list' to see available demos."
      exit 1
    fi

    shift
    echo "=== Starting demo: $ARG ==="
    cd "$PROJECT_DIR"
    docker compose up --build "$@"
    ;;
esac
