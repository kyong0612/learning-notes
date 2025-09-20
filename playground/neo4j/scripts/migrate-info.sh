#!/bin/bash

echo "📊 Neo4j Migration Status"
echo "========================="

# Check if Neo4j is running
if ! docker compose ps | grep -q "neo4j-sandbox.*Up"; then
    echo "❌ Neo4j is not running. Please start it first with: make start"
    exit 1
fi

# Neo4j connection details
NEO4J_URL="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASS="password123"

# Migration directory
MIGRATION_DIR="./migrations"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Get list of all migration files
echo ""
echo "📁 Available migrations:"
echo ""

if [ -d "$MIGRATION_DIR" ]; then
    for migration_file in $(ls -1 $MIGRATION_DIR/*.cypher 2>/dev/null | sort); do
        filename=$(basename "$migration_file")

        # Check if migration has been applied
        APPLIED_INFO=$(docker exec neo4j-sandbox cypher-shell \
            -u "$NEO4J_USER" \
            -p "$NEO4J_PASS" \
            -a "$NEO4J_URL" \
            --format plain \
            "MATCH (m:_Migration {id: 'migrations'})-[:APPLIED]->(mf:_MigrationFile {name: '$filename'})
             RETURN mf.appliedAt as appliedAt" 2>/dev/null | tail -1)

        if [ -n "$APPLIED_INFO" ] && [ "$APPLIED_INFO" != "" ] && [ "$APPLIED_INFO" != "appliedAt" ]; then
            echo -e "${GREEN}✓${NC} $filename ${GRAY}(applied: $APPLIED_INFO)${NC}"
        else
            echo -e "${YELLOW}○${NC} $filename ${GRAY}(pending)${NC}"
        fi
    done
else
    echo "❌ Migration directory not found: $MIGRATION_DIR"
fi

echo ""

# Show summary
TOTAL_COUNT=$(ls -1 $MIGRATION_DIR/*.cypher 2>/dev/null | wc -l | tr -d ' ')
APPLIED_COUNT=$(docker exec neo4j-sandbox cypher-shell \
    -u "$NEO4J_USER" \
    -p "$NEO4J_PASS" \
    -a "$NEO4J_URL" \
    --format plain \
    "MATCH (m:_Migration {id: 'migrations'})-[:APPLIED]->(mf:_MigrationFile)
     RETURN count(mf) as count" 2>/dev/null | tail -1)

if [ -z "$APPLIED_COUNT" ] || [ "$APPLIED_COUNT" == "count" ]; then
    APPLIED_COUNT=0
fi

PENDING_COUNT=$((TOTAL_COUNT - APPLIED_COUNT))

echo "📈 Summary:"
echo "  Total migrations: $TOTAL_COUNT"
echo "  Applied: $APPLIED_COUNT"
echo "  Pending: $PENDING_COUNT"
echo ""

# Show database schema info
echo "🗂️  Current Schema:"
echo ""

# Count constraints
CONSTRAINT_COUNT=$(docker exec neo4j-sandbox cypher-shell \
    -u "$NEO4J_USER" \
    -p "$NEO4J_PASS" \
    -a "$NEO4J_URL" \
    --format plain \
    "SHOW CONSTRAINTS YIELD name RETURN count(*) as count" 2>/dev/null | tail -1)

# Count indexes
INDEX_COUNT=$(docker exec neo4j-sandbox cypher-shell \
    -u "$NEO4J_USER" \
    -p "$NEO4J_PASS" \
    -a "$NEO4J_URL" \
    --format plain \
    "SHOW INDEXES YIELD name WHERE type <> 'LOOKUP' RETURN count(*) as count" 2>/dev/null | tail -1)

if [ -n "$CONSTRAINT_COUNT" ] && [ "$CONSTRAINT_COUNT" != "count" ]; then
    echo "  Constraints: $CONSTRAINT_COUNT"
fi

if [ -n "$INDEX_COUNT" ] && [ "$INDEX_COUNT" != "count" ]; then
    echo "  Indexes: $INDEX_COUNT"
fi

echo ""
echo "💡 Run 'make migrate' to apply pending migrations"