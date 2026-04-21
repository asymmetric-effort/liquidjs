# GraphQL Contact Directory Demo

Two-container demo: Go GraphQL API + LiquidJS UI.

## Architecture

```
Browser -> nginx (port 3001) -> LiquidJS SPA
                              -> /graphql proxy -> Go GraphQL API (port 8080)
                              -> /health proxy  -> Go GraphQL API (port 8080)
```

## Features Demonstrated

- **UI**: GraphQL queries/mutations via fetch, search filtering with useMemo, query inspector showing raw GraphQL, card-based directory layout
- **API**: Minimal GraphQL endpoint in Go (no external libraries), regex-based query parsing, in-memory contact store, CORS
- **Integration**: nginx reverse proxy, docker-compose networking

## GraphQL Operations

**Queries:**
- `{ contacts { id name email phone department } }` — list all contacts
- `{ contact(id: 1) { id name email phone department } }` — get one contact

**Mutations:**
- `mutation { addContact(input: { name: "...", email: "...", phone: "...", department: "..." }) { id name } }` — add a contact
- `mutation { deleteContact(id: 1) { id name } }` — delete a contact

## Run

```bash
docker compose up --build
```

- UI: http://localhost:3001
- GraphQL: http://localhost:3001/graphql (proxied)
- Health: http://localhost:3001/health (proxied)
