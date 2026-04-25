# Contributing

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) (JavaScript/TypeScript runtime and package manager)
- Docker (for local CI testing)

### Clone and Install

```bash
git clone <repo-url>
cd liquidjs

# Core framework
cd core
bun install
```

### Run Tests

```bash
# Core — unit/integration
cd core && bun run test

# Core — E2E
cd core && bun run test:e2e
```

### Run All CI Locally

```bash
./scripts/act-run.sh          # All jobs
./scripts/act-run.sh --list   # See available jobs
```

## Monorepo Structure

| Directory | Purpose | Language |
|-----------|---------|----------|
| `core/` | LiquidJS framework | TypeScript |
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
