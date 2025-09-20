#!/bin/bash

echo "⚠️  WARNING: This will delete all Neo4j data!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Stopping Neo4j if running..."
    docker compose down

    echo "Removing data directories..."
    rm -rf data/ logs/ import/ plugins/

    echo "✅ Clean up complete!"
else
    echo "Cancelled."
fi