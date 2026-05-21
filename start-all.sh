#!/usr/bin/env bash
# Starts all services in background and tails their logs.
# Press Ctrl+C to stop everything.

ROOT="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Stopping all services..."
  kill 0
}
trap cleanup INT TERM

echo "=== Starting infrastructure (Kafka) ==="
docker compose -f "$ROOT/docker-compose.yml" up -d zookeeper kafka

echo "=== Starting all microservices ==="

(cd "$ROOT/stock-service"        && npm run start:dev 2>&1 | sed 's/^/[stock]        /') &
(cd "$ROOT/catalog-service"      && npm run start:dev 2>&1 | sed 's/^/[catalog]      /') &
(cd "$ROOT/order-service"        && npm run start:dev 2>&1 | sed 's/^/[order]        /') &
(cd "$ROOT/notification-service" && npm run start:dev 2>&1 | sed 's/^/[notification] /') &
(cd "$ROOT/query-service"        && npm run start:dev 2>&1 | sed 's/^/[query]        /') &

echo ""
echo "Services starting — Swagger UIs:"
echo "  catalog-service:      http://localhost:3001/api"
echo "  order-service:        http://localhost:3002/api"
echo "  notification-service: http://localhost:3004/api"
echo "  query-service (GQL):  http://localhost:3003/graphql"
echo ""

wait
