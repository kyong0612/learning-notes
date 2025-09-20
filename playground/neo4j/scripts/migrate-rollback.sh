#!/bin/bash

echo "⏮️  Rolling back last Neo4j migration..."

# Check if Neo4j is running
if ! docker compose ps | grep -q "neo4j-sandbox.*Up"; then
    echo "❌ Neo4j is not running. Please start it first with: make start"
    exit 1
fi

# Neo4j connection details
NEO4J_URL="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASS="password123"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the last applied migration
LAST_MIGRATION=$(docker exec neo4j-sandbox cypher-shell \
    -u "$NEO4J_USER" \
    -p "$NEO4J_PASS" \
    -a "$NEO4J_URL" \
    --format plain \
    "MATCH (m:_Migration {id: 'migrations'})-[r:APPLIED]->(mf:_MigrationFile)
     RETURN mf.name as name ORDER BY mf.appliedAt DESC LIMIT 1" 2>/dev/null | tail -1)

if [ -z "$LAST_MIGRATION" ] || [ "$LAST_MIGRATION" == "name" ]; then
    echo "⚠️  No migrations to rollback"
    exit 0
fi

echo -e "${YELLOW}Found last migration: $LAST_MIGRATION${NC}"
echo ""

# Warning
echo -e "${RED}⚠️  WARNING: This will attempt to rollback the migration.${NC}"
echo "Note: Automatic rollback is not fully supported. You may need to manually"
echo "reverse the changes made by the migration."
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled."
    exit 0
fi

# Check if rollback file exists
ROLLBACK_FILE="./migrations/rollback/${LAST_MIGRATION%.cypher}.rollback.cypher"
if [ -f "$ROLLBACK_FILE" ]; then
    echo -e "${GREEN}Found rollback file: $(basename $ROLLBACK_FILE)${NC}"
    echo "Executing rollback..."

    # Copy rollback file to container
    docker cp "$ROLLBACK_FILE" neo4j-sandbox:/tmp/rollback.cypher

    # Execute rollback
    if docker exec neo4j-sandbox cypher-shell \
        -u "$NEO4J_USER" \
        -p "$NEO4J_PASS" \
        -a "$NEO4J_URL" \
        --file /tmp/rollback.cypher > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Rollback executed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to execute rollback${NC}"
        echo "Manual intervention may be required."
    fi
else
    echo -e "${YELLOW}⚠️  No rollback file found for $LAST_MIGRATION${NC}"
    echo "Manual rollback required. Here's what was applied:"
    echo ""

    # Show the original migration content
    ORIGINAL_FILE="./migrations/$LAST_MIGRATION"
    if [ -f "$ORIGINAL_FILE" ]; then
        echo "--- Original migration content ---"
        cat "$ORIGINAL_FILE"
        echo ""
        echo "--- End of migration content ---"
        echo ""
        echo "Please manually reverse these changes in Neo4j Browser."
    fi
fi

# Remove the migration record
echo "Removing migration record..."
docker exec neo4j-sandbox cypher-shell \
    -u "$NEO4J_USER" \
    -p "$NEO4J_PASS" \
    -a "$NEO4J_URL" \
    --format plain \
    "MATCH (m:_Migration {id: 'migrations'})-[r:APPLIED]->(mf:_MigrationFile {name: '$LAST_MIGRATION'})
     DELETE r, mf" > /dev/null 2>&1

echo -e "${GREEN}✅ Migration record removed${NC}"
echo ""
echo "Rollback completed. Run 'make migrate-info' to check current status."