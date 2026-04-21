# REST API Demo

Two-container demo: Go REST API + LiquidJS UI.

## Architecture

```
Browser -> nginx (port 3000) -> LiquidJS SPA
                              -> /api/* proxy -> Go API (port 8080)
```

## Features Demonstrated

- **UI**: fetch API, async state with loading/error handling, CRUD operations, form state
- **API**: Go net/http, JSON encoding, CORS, in-memory CRUD store
- **Integration**: nginx reverse proxy, docker-compose networking

## Run

```bash
docker compose up --build
```

- UI: http://localhost:3000
- API: http://localhost:3000/api/bookmarks (proxied)
