#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/catalog-service"
echo "Starting catalog-service on port ${PORT:-3001}..."
echo "Swagger UI: http://localhost:${PORT:-3001}/api"
npm run start:dev
