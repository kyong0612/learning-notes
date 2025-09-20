#!/bin/bash

echo "🔄 Running Neo4j migrations..."

# Check if Neo4j is running
if ! docker compose ps | grep -q "neo4j-sandbox.*Up"; then
    echo "❌ Neo4j is not running. Please start it first with: make start"
    exit 1
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Neo4j connection details
NEO4J_URL="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASS="password123"

# Migration directory
MIGRATION_DIR="./migrations"

# Check if migration directory exists
if [ ! -d "$MIGRATION_DIR" ]; then
    echo "❌ Migration directory not found: $MIGRATION_DIR"
    exit 1
fi

# Get list of migration files
MIGRATION_FILES=$(ls -1 $MIGRATION_DIR/*.cypher 2>/dev/null | sort)

if [ -z "$MIGRATION_FILES" ]; then
    echo "⚠️  No migration files found in $MIGRATION_DIR"
    exit 0
fi

echo "📁 Found migration files:"
echo "$MIGRATION_FILES" | while read file; do
    basename "$file"
done
echo ""

# Create migrations tracking node if it doesn't exist
docker exec neo4j-sandbox cypher-shell \
    -u "$NEO4J_USER" \
    -p "$NEO4J_PASS" \
    -a "$NEO4J_URL" \
    --format plain \
    "MERGE (m:_Migration {id: 'migrations'}) RETURN m" > /dev/null 2>&1

# Process each migration file
for migration_file in $MIGRATION_FILES; do
    filename=$(basename "$migration_file")

    # Check if migration has already been applied
    APPLIED=$(docker exec neo4j-sandbox cypher-shell \
        -u "$NEO4J_USER" \
        -p "$NEO4J_PASS" \
        -a "$NEO4J_URL" \
        --format plain \
        "MATCH (m:_Migration {id: 'migrations'})-[:APPLIED]->(mf:_MigrationFile {name: '$filename'}) RETURN count(mf) as count" 2>/dev/null | tail -1)

    if [ "$APPLIED" == "1" ]; then
        echo -e "${YELLOW}⏭️  Skipping $filename (already applied)${NC}"
        continue
    fi

    echo -e "${GREEN}▶️  Applying $filename...${NC}"

    # Copy migration file to container
    docker cp "$migration_file" neo4j-sandbox:/tmp/current_migration.cypher

    # Execute migration
    if docker exec neo4j-sandbox cypher-shell \
        -u "$NEO4J_USER" \
        -p "$NEO4J_PASS" \
        -a "$NEO4J_URL" \
        --file /tmp/current_migration.cypher > /dev/null 2>&1; then

        # Mark migration as applied
        docker exec neo4j-sandbox cypher-shell \
            -u "$NEO4J_USER" \
            -p "$NEO4J_PASS" \
            -a "$NEO4J_URL" \
            --format plain \
            "MATCH (m:_Migration {id: 'migrations'})
             CREATE (m)-[:APPLIED {appliedAt: datetime()}]->(mf:_MigrationFile {name: '$filename', appliedAt: datetime()})
             RETURN mf" > /dev/null 2>&1

        echo -e "${GREEN}✅ Successfully applied $filename${NC}"
    else
        echo -e "${RED}❌ Failed to apply $filename${NC}"
        echo "Check the migration file for errors and try again."
        exit 1
    fi
done

echo ""
echo "✨ All migrations completed successfully!"