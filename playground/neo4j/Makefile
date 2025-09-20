.PHONY: help start stop logs clean status restart migrate migrate-info migrate-rollback migrate-create

# Default target
help:
	@echo "Neo4j Docker Sandbox - Makefile Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make start          - Start Neo4j container"
	@echo "  make stop           - Stop Neo4j container"
	@echo "  make restart        - Restart Neo4j container"
	@echo "  make logs           - Show Neo4j logs (follow mode)"
	@echo "  make status         - Show container status"
	@echo "  make clean          - Remove all data (CAUTION!)"
	@echo ""
	@echo "Migration commands:"
	@echo "  make migrate        - Run pending migrations"
	@echo "  make migrate-info   - Show migration status"
	@echo "  make migrate-rollback - Rollback last migration"
	@echo "  make migrate-create DESC=name - Create new migration"
	@echo ""
	@echo "  make help           - Show this help message"

# Start Neo4j container
start:
	@./scripts/start.sh

# Stop Neo4j container
stop:
	@./scripts/stop.sh

# Restart Neo4j container
restart: stop start

# Show logs
logs:
	@./scripts/logs.sh

# Clean all data
clean:
	@./scripts/clean.sh

# Show container status
status:
	@echo "Neo4j Container Status:"
	@docker compose ps

# Run migrations
migrate:
	@./scripts/migrate.sh

# Show migration info
migrate-info:
	@./scripts/migrate-info.sh

# Rollback last migration
migrate-rollback:
	@./scripts/migrate-rollback.sh

# Create new migration
migrate-create:
	@if [ -z "$(DESC)" ]; then echo "エラー: DESC パラメータが必要です。例: make migrate-create DESC=add_user_constraint"; exit 1; fi
	@./scripts/migrate-create.sh "$(DESC)"