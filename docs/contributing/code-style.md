# Code Style

## TypeScript (core/)

- **Strict mode** — `strict: true` in tsconfig
- **No `any`** — Avoid unless documented
- **`const` over `let`** — Never `var`
- **Named exports** — No default exports
- **Formatting** — Prettier with: single quotes, trailing commas, 100 char width
- **Semicolons** — Always
- **Arrow parens** — Always (`(x) => x`, not `x => x`)

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add useOptimistic hook
fix: prevent stale closure in setState
test: add coverage for SSR context restoration
refactor: simplify fiber cloning in memo bail-out
docs: add sourcemap command documentation
chore: update playwright to v1.60
perf: reduce allocation in reconciler hot path
```

## Go (tools/)

- **`gofmt`** — Standard formatting
- **`go vet`** — Must pass clean
- **Error handling** — Always check and wrap with `fmt.Errorf("context: %w", err)`
- **Package names** — Short, lowercase, no underscores
- **Test files** — `*_test.go` alongside source

## Documentation (docs/)

- Markdown with GitHub-flavored extensions
- Code blocks with language tags
- Internal links use relative paths
- One concept per page, linked from index
