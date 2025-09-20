#!/bin/bash

echo "Stopping Neo4j sandbox..."

# Stop the container
docker compose down

echo "✅ Neo4j has been stopped."
echo ""
echo "Note: Your data is preserved in the ./data directory."
echo "To completely remove data, run: rm -rf data/ logs/ import/ plugins/"