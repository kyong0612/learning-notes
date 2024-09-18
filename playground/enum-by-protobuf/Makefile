# --- Tooling & Variables ----------------------------------------------------------------
BUF := go run github.com/bufbuild/buf/cmd/buf


.PHONY: bufinit
bufinit:
	@echo "Initializing..."
	@$(BUF) config init

.PHONY: bufbuild
bufbuild:
	@echo "Building..."
	@$(BUF) build

.PHONY: buflint
buflint:
	@echo "Format & Linting..."
	@$(BUF) format -w
	@$(BUF) lint

.PHONY: bufgen
bufgen:
	@echo "Generating..."
	@$(BUF) generate
