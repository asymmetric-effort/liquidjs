# CI/CD

## GitHub Actions

The CI pipeline (`.github/workflows/ci.yml`) runs on every push and PR to `main`.

### Jobs

| Job | What it does | Duration |
|-----|-------------|----------|
| **lint** | TypeScript type check + Prettier format check | ~10s |
| **test** | 465 Vitest tests with coverage thresholds | ~15s |
| **build** | Rollup build + verify outputs + bundle size check (< 512KB) | ~15s |
| **e2e** | Install Playwright + run 27 browser tests | ~30s |

### Coverage Thresholds

Enforced in `vitest.config.ts`:
- Statements: 95%
- Branches: 94%
- Functions: 97%
- Lines: 95%

## Local Testing with act

[nektos/act](https://github.com/nektos/act) runs GitHub Actions workflows locally in Docker containers.

### Install act

```bash
curl -sSL https://github.com/nektos/act/releases/latest/download/act_Linux_x86_64.tar.gz | tar -xz -C ~/bin act
```

### Run Workflows

```bash
./scripts/act-run.sh              # All jobs
./scripts/act-run.sh lint         # Single job
./scripts/act-run.sh --list       # List jobs
```

### Container Image

The `.actrc` file maps `ubuntu-latest` to `catthehacker/ubuntu:act-latest`, which includes Node.js and system dependencies needed for Playwright.

### Artifact Uploads

`upload-artifact` steps are guarded with `!env.ACT` and skipped during local testing (the GitHub artifact API isn't available locally).

## Adding New CI Steps

1. Edit `.github/workflows/ci.yml`
2. Test locally: `./scripts/act-run.sh <job-name>`
3. Verify all jobs pass: `./scripts/act-run.sh`
4. Commit
