#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/order-service"
echo "Starting order-service on port ${PORT:-3002}..."
echo "Swagger UI: http://localhost:${PORT:-3002}/api"
npm run start:dev
