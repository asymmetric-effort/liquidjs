.PHONY: all clean lint test e2e build demos help

# Default target
all: build

# ============================================================================
# Clean
# ============================================================================
clean:
	rm -rf bin
	@echo "Cleaned bin/"

# ============================================================================
# Lint — run linters across the entire monorepo
# ============================================================================
lint: lint-core

lint-core:
	cd core && bun run typecheck
	cd core && bun run format:check
	@echo "Core lint passed"

# ============================================================================
# Test — run tests across the entire monorepo
# ============================================================================
test: test-core

test-core:
	cd core && bun run test
	@echo "Core tests passed"

# ============================================================================
# E2E — run end-to-end tests
# ============================================================================
e2e:
	cd core && bun x playwright test
	@echo "E2E tests passed"

# ============================================================================
# Build — build the LiquidJS library
# ============================================================================
build:
	cd core && bun run build
	@echo "Core build complete"

# ============================================================================
# Demos — build all demo project containers
# ============================================================================
demos:
	@for d in demos/*/docker-compose.yml; do \
		dir=$$(dirname "$$d"); \
		name=$$(basename "$$dir"); \
		echo "Building demo: $$name..."; \
		docker compose -f "$$d" build || exit 1; \
	done
	@echo "All demos built"

# ============================================================================
# Help
# ============================================================================
help:
	@echo "LiquidJS Monorepo Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  all (default)  Build the LiquidJS library"
	@echo "  clean          Delete bin/"
	@echo "  lint           Run linters (TypeScript)"
	@echo "  test           Run all tests (Vitest)"
	@echo "  e2e            Run Playwright E2E tests"
	@echo "  build          Build the LiquidJS library"
	@echo "  demos          Build all demo Docker containers"
	@echo "  help           Show this help"
