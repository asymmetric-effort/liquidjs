.PHONY: all tools clean lint test e2e build demos help

# Default target
all: tools

# ============================================================================
# Tools — compile Go binaries to ./bin/
# ============================================================================
TOOLS_DIR := tools
BIN_DIR := bin
GO := go

tools: $(BIN_DIR)/liquidjs-debug $(BIN_DIR)/demos

$(BIN_DIR)/liquidjs-debug: $(wildcard $(TOOLS_DIR)/liquidjs-debug/**/*.go $(TOOLS_DIR)/liquidjs-debug/*.go)
	@mkdir -p $(BIN_DIR)
	cd $(TOOLS_DIR)/liquidjs-debug && $(GO) build -o ../../$(BIN_DIR)/liquidjs-debug .
	@echo "Built bin/liquidjs-debug"

$(BIN_DIR)/demos: $(wildcard $(TOOLS_DIR)/demos/**/*.go $(TOOLS_DIR)/demos/*.go)
	@mkdir -p $(BIN_DIR)
	cd $(TOOLS_DIR)/demos && $(GO) build -o ../../$(BIN_DIR)/demos .
	@echo "Built bin/demos"

# ============================================================================
# Clean
# ============================================================================
clean:
	rm -rf $(BIN_DIR)
	mkdir -p $(BIN_DIR)
	@echo "Cleaned bin/"

# ============================================================================
# Lint — run linters across the entire monorepo
# ============================================================================
lint: lint-core lint-go

lint-core:
	cd core && npx tsc --noEmit
	cd core && npm run format:check
	@echo "Core lint passed"

lint-go:
	cd $(TOOLS_DIR)/liquidjs-debug && $(GO) vet -v ./...
	@[ -d $(TOOLS_DIR)/demos ] && cd $(TOOLS_DIR)/demos && $(GO) vet -v ./... || true
	@echo "Go lint passed"

# ============================================================================
# Test — run tests across the entire monorepo
# ============================================================================
test: test-core test-go

test-core:
	cd core && npm test
	@echo "Core tests passed"

test-go:
	cd $(TOOLS_DIR)/liquidjs-debug && $(GO) test -v ./pkg/...
	@[ -d $(TOOLS_DIR)/demos ] && cd $(TOOLS_DIR)/demos && $(GO) test -v ./... || true
	@echo "Go tests passed"

# ============================================================================
# E2E — run end-to-end tests
# ============================================================================
e2e:
	cd core && npx playwright test
	@echo "E2E tests passed"

# ============================================================================
# Build — build the LiquidJS library
# ============================================================================
build:
	cd core && npm run build
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
	@echo "  all (default)  Build all Go tools to ./bin/"
	@echo "  tools          Build all Go tools to ./bin/"
	@echo "  clean          Delete and recreate ./bin/"
	@echo "  lint           Run linters (TypeScript + Go)"
	@echo "  test           Run all tests (Vitest + Go)"
	@echo "  e2e            Run Playwright E2E tests"
	@echo "  build          Build the LiquidJS library"
	@echo "  demos          Build all demo Docker containers"
	@echo "  help           Show this help"
