#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/query-service"
echo "Starting query-service on port ${PORT:-3003}..."
echo "GraphQL Playground: http://localhost:${PORT:-3003}/graphql"
npm run start:dev
