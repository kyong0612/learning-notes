#!/bin/bash

echo "Starting Neo4j sandbox..."

# Create necessary directories if they don't exist
mkdir -p data logs import plugins

# Start the container
docker compose up -d

# Wait for Neo4j to be ready
echo "Waiting for Neo4j to be ready..."
sleep 5

# Check if Neo4j is running
if docker compose ps | grep -q "neo4j-sandbox.*Up"; then
    echo ""
    echo "✅ Neo4j is running!"
    echo ""
    echo "📊 Neo4j Browser: http://localhost:7474"
    echo "🔌 Bolt URL: bolt://localhost:7687"
    echo ""
    echo "🔐 Credentials:"
    echo "   Username: neo4j"
    echo "   Password: password123"
    echo ""
    echo "📝 To view logs: docker compose logs -f neo4j"
    echo "🛑 To stop: ./scripts/stop.sh"
else
    echo "❌ Failed to start Neo4j. Check logs with: docker compose logs neo4j"
fi