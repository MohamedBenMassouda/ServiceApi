#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/stock-service"
echo "Starting stock-service on gRPC ${GRPC_URL:-0.0.0.0:50051}..."
npm run start:dev
