# LiquidJS Demos

Containerized demonstration SPAs showcasing LiquidJS features and integration patterns.

## Prerequisites

- Docker 20+
- Docker Compose v2+

## Quick Start

Run any demo from its directory:

```bash
cd demos/<project>
docker compose up --build
```

Or use the launcher script from the repo root:

```bash
./demos/run.sh todo-app        # http://localhost:3000
./demos/run.sh rest-api        # http://localhost:3000 (UI) + API on :8080
./demos/run.sh protobuf-app    # http://localhost:3000 (UI) + gRPC on :8080
./demos/run.sh graphql-app     # http://localhost:3000 (UI) + GraphQL on :8080
./demos/run.sh dashboard-app   # http://localhost:3000
./demos/run.sh --stop-all      # Stop all running demos
```

## Demos

### Standalone (single container)

| Demo | Port | Features Demonstrated |
|------|------|----------------------|
| [todo-app](todo-app/) | 3000 | useState, useCallback, useMemo, useRef, useEffect, lists, keys, events |
| [dashboard-app](dashboard-app/) | 3000 | createContext, useContext, useReducer, memo, multiple views, CSS-in-JS patterns |

### API Integration (two containers)

| Demo | Ports | Protocol | Features Demonstrated |
|------|-------|----------|----------------------|
| [rest-api](rest-api/) | 3000, 8080 | REST/JSON | fetch API, async state, loading/error states, CRUD operations |
| [protobuf-app](protobuf-app/) | 3000, 8080 | Protobuf/gRPC-Web | Binary protocol, typed messages, streaming patterns |
| [graphql-app](graphql-app/) | 3000, 8080 | GraphQL | Query/mutation, variables, optimistic updates |

## Architecture

Each demo follows this structure:

```
demos/<project>/
  docker-compose.yml    # Container orchestration
  ui/                   # LiquidJS SPA
    Dockerfile          # Multi-stage: build with Node, serve with nginx
    src/app.ts          # Application source
    index.html          # HTML shell
    nginx.conf          # Production nginx config (if applicable)
  api/                  # Backend (API demos only)
    Dockerfile          # Go API server
    main.go             # API implementation
  README.md             # Demo-specific documentation
```

## Stopping Demos

```bash
cd demos/<project>
docker compose down
```
