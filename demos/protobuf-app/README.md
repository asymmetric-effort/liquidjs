# Protobuf Task Tracker Demo

A two-container Docker demo showing a SpecifyJS UI communicating with a Go API server using a protobuf-inspired binary protocol over HTTP.

## Architecture

- **API** (Go) — HTTP server that encodes/decodes task messages using `encoding/binary` with a custom wire format. Serves binary endpoints at `/proto/*` and JSON fallback at `/api/*` for debugging.
- **UI** (SpecifyJS + Vite + nginx) — Single-page kanban board that uses `ArrayBuffer`/`DataView` to encode and decode binary task messages. Displays raw hex bytes alongside decoded data.

## Wire Format

Each task is encoded as:

```
[4B] ID (uint32 BE) | [1B] Status | [1B] Priority
[2B] TitleLen (uint16 BE) | [NB] Title (UTF-8)
[2B] DescLen  (uint16 BE) | [NB] Description (UTF-8)
```

A task list prepends a `[4B] Count (uint32 BE)` header.

## Task Fields

| Field       | Type   | Values                             |
|-------------|--------|------------------------------------|
| id          | int    | Auto-assigned                      |
| title       | string | Free text                          |
| description | string | Free text                          |
| status      | enum   | 0=PENDING, 1=IN_PROGRESS, 2=DONE  |
| priority    | int    | 1-5                                |

## Running

```bash
docker compose up --build
```

Open http://localhost:3000 to see the kanban board.

## Endpoints

| Method | Path               | Format   | Description         |
|--------|--------------------|----------|---------------------|
| GET    | /proto/tasks       | binary   | List all tasks      |
| POST   | /proto/tasks       | binary   | Create a task       |
| PUT    | /proto/tasks/{id}  | binary   | Update a task       |
| DELETE | /proto/tasks/{id}  | -        | Delete a task       |
| GET    | /api/tasks         | JSON     | List (debug)        |
| POST   | /api/tasks         | JSON     | Create (debug)      |
| PUT    | /api/tasks/{id}    | JSON     | Update (debug)      |
| DELETE | /api/tasks/{id}    | -        | Delete (debug)      |
