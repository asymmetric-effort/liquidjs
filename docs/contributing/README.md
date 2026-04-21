# Contributing

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) (JavaScript/TypeScript runtime and package manager)
- Go 1.25+ (for tools)
- Docker (for local CI testing)

### Clone and Install

```bash
git clone <repo-url>
cd liquidjs

# Core framework
cd core
bun install

# Go tools
cd ../tools/liquidjs-debug
go mod download
```

### Run Tests

```bash
# Core — unit/integration
cd core && bun run test

# Core — E2E
cd core && bun run test:e2e

# Go tools
cd tools/liquidjs-debug && go test -v ./pkg/...
```

### Run All CI Locally

```bash
./scripts/act-run.sh          # All 5 jobs
./scripts/act-run.sh --list   # See available jobs
```

## Monorepo Structure

| Directory | Purpose | Language |
|-----------|---------|----------|
| `core/` | LiquidJS framework | TypeScript |
| `tools/` | Ecosystem tooling | Go |
| `components/` | Reusable components | TypeScript |
| `docs/` | Documentation | Markdown |
| `skills/` | Claude AI skills | YAML/Markdown |

## Workflow

1. Fork the repository
2. Create a feature branch from `main`
3. Make changes with tests
4. Verify locally: `./scripts/act-run.sh`
5. Open a pull request

## See Also

- [Code Style](code-style.md) — Formatting and conventions
- [CI/CD](ci-cd.md) — Pipeline details
