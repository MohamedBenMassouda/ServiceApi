#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/notification-service"
echo "Starting notification-service on port ${PORT:-3004}..."
echo "Swagger UI: http://localhost:${PORT:-3004}/api"
npm run start:dev
