# LiquidJS

A declarative TypeScript UI framework built for performance, browser compatibility, and developer simplicity.

## Monorepo Structure

```
liquidjs/
  core/           LiquidJS framework — virtual DOM, reconciler, hooks, renderer, static pre-rendering
  tools/          Ecosystem tooling — debug CLI, deobfuscation, analysis
  components/     Community-contributed reusable components
  docs/           Documentation (you are here)
  skills/         Claude skills for LiquidJS developers
  .github/        CI/CD workflows (GitHub Actions)
  scripts/        Repository-wide automation scripts
```

## Quick Start

```bash
cd core
bun install
bun run test          # 600+ unit/integration tests
bun run build         # Rollup build → dist/
bun run test:e2e      # 27 Playwright browser tests
```

## Documentation

See [docs/README.md](docs/README.md) for the full documentation index, or jump to:

- [Getting Started](docs/guides/getting-started.md)
- [API Reference](docs/api/README.md)
- [Architecture](docs/architecture/README.md)
- [Debug Tools](docs/tools/liquidjs-debug.md)
- [Contributing](docs/contributing/README.md)

## CI/CD

All workflows run via GitHub Actions and can be tested locally with [nektos/act](https://github.com/nektos/act):

```bash
./scripts/act-run.sh           # Run all 5 CI jobs
./scripts/act-run.sh lint      # TypeScript + Prettier checks
./scripts/act-run.sh test      # Unit/integration tests with coverage
./scripts/act-run.sh build     # Library build + bundle size check
./scripts/act-run.sh e2e       # Playwright browser tests
./scripts/act-run.sh go-tools  # Go vet + test + build
```

## License

[MIT](core/LICENSE)
