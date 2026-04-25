# Contributing to LiquidJS

Thank you for your interest in contributing to LiquidJS.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone git@github.com:YOUR_USERNAME/liquidjs.git`
3. Install dependencies: `cd core && bun install`
4. Set up git hooks: `ln -sf ../git-hooks .git/hooks`
5. Generate dev certs (optional): `./scripts/setup-dev-certs.sh`

## Development Workflow

```bash
cd core
bun run test          # Run unit/integration tests
bun run typecheck     # TypeScript strict mode check
bun run format:check  # Prettier formatting check
bun run build         # Rollup production build
```

## Before Submitting a PR

All of these must pass — the pre-commit and pre-push hooks enforce them automatically:

1. **TypeScript typecheck** — `bun x tsc --noEmit` (zero errors)
2. **Prettier** — `bun x prettier --check 'src/**/*.ts' 'tests/**/*.ts'`
3. **Tests** — `bun run test` (zero failures)
4. **Coverage** — ≥97.5% statements/lines, ≥98% functions

## Definition of Done

Per CLAUDE.md, all feature work must include:
- ≥97.9% test coverage
- Documentation (design, implementation, usage)
- All linters pass
- All tests pass (unit, integration, E2E)

## Code Style

- TypeScript strict mode
- No `any` types unless documented
- `const` over `let`, never `var`
- Named exports over default exports
- Zero runtime dependencies

## Commit Messages

Use conventional commits:
- `feat:` — new feature
- `fix:` — bug fix
- `test:` — test additions
- `docs:` — documentation
- `refactor:` — code restructuring
- `perf:` — performance improvement
- `chore:` — tooling, CI, etc.

## Intellectual Property

- All code must be original work or MIT-compatible
- Do not copy code from other projects without license verification
- All algorithms implemented from original understanding
- See CLAUDE.md "Intellectual Property & Licensing" section

## Security

- Report vulnerabilities to security@asymmetric-effort.com
- See SECURITY.md for details
