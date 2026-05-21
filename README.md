# TP — NestJS Microservices (REST · GraphQL · gRPC · Kafka)

A mini distributed order platform that shows the complementary role of REST,
GraphQL, gRPC, and Kafka in a microservices architecture built with NestJS.

## Architecture

```
Client HTTP
├── REST ────────► catalog-service
├── REST ────────► order-service ── gRPC ──► stock-service
│                       │
│                       └── Kafka topic: order.created ──► notification-service
└── GraphQL ────► query-service ── REST ──► catalog-service / order-service
```

| Service              | Responsibility                          | Dominant transport   | Port            |
| -------------------- | --------------------------------------- | -------------------- | --------------- |
| catalog-service      | Product CRUD                            | REST                 | 3001            |
| order-service        | Order creation and lookup               | REST + gRPC + Kafka  | 3002            |
| stock-service        | Stock validation & reservation          | gRPC                 | 50051 (gRPC)    |
| notification-service | Reacts to order.created events          | Kafka                | — (no HTTP)     |
| query-service        | Aggregated read API                     | GraphQL (over REST)  | 3003 (/graphql) |
| Kafka broker         | Event bus                               | —                    | 9092            |
| Kafka UI (optional)  | Web inspector for topics                | —                    | 8080            |

## Requirements

- Node.js 20+
- npm (or pnpm)
- Docker Desktop (only used to run Kafka + Zookeeper)

## Quickstart

```bash
# 1. Start Kafka + Zookeeper (+ optional Kafka UI on :8080)
docker compose up -d

# 2. Install dependencies and start each service in its own terminal
cd catalog-service       && npm install && npm run start:dev   # :3001
cd ../stock-service      && npm install && npm run start:dev   # gRPC :50051
cd ../order-service      && npm install && npm run start:dev   # :3002
cd ../notification-service && npm install && npm run start:dev # Kafka consumer
cd ../query-service      && npm install && npm run start:dev   # :3003/graphql
```

Order of start matters slightly: `stock-service` must be up before
`order-service` accepts traffic, and Kafka must be reachable for
`order-service` (producer) and `notification-service` (consumer).

## Test scenarios (cover the grading criteria)

### 1. Create products (REST)
```bash
curl -X POST http://localhost:3001/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Laptop","price":1200,"stock":10}'

curl http://localhost:3001/products
```
Three products are also auto-seeded on first boot (`Laptop`, `Wireless Mouse`,
`Mechanical Keyboard`) so you can jump straight to creating orders.

### 2. Create a valid order (REST → gRPC → DB → Kafka)
```bash
curl -X POST http://localhost:3002/orders \
  -H 'Content-Type: application/json' \
  -d '{"productId":1,"quantity":2,"customerEmail":"client@test.com"}'
```
Watch the three logs:
- `stock-service` logs: `Reserved 2 of product 1 (remaining: 8)`
- `order-service` logs: `Published order.created for orderId=1`
- `notification-service` logs: `confirmation envoyée à client@test.com pour la commande 1`

### 3. Create an invalid order (stock too low)
```bash
curl -i -X POST http://localhost:3002/orders \
  -H 'Content-Type: application/json' \
  -d '{"productId":1,"quantity":9999,"customerEmail":"client@test.com"}'
```
Expected: `HTTP/1.1 409 Conflict` with body
`{"statusCode":409,"message":"insufficient stock: requested 9999, available 8",...}`.

### 4. Read aggregated data (GraphQL)
Open `http://localhost:3003/graphql` in a browser and run:
```graphql
query {
  products { id name price stock }
  orders   { id productId quantity status customerEmail }
  orderById(id: 1) { id status customerEmail }
}
```

## Why four transports? (technical justification)

Each transport is used where it is the right fit, not for show:

- **REST** — public, request/response, well-known verbs. Used for the two
  CRUD-shaped APIs (`catalog`, `orders`) that any HTTP client can hit.
- **gRPC** — typed contract, low overhead, internal east-west traffic. Used
  for the synchronous `CheckAndReserve` call where `order-service` needs an
  authoritative yes/no from `stock-service` before persisting the order. A
  Protobuf contract keeps the two services strongly coupled at the schema
  level without needing a shared library.
- **Kafka** — asynchronous fan-out of events. `order.created` is broadcast
  once and any number of consumers (here `notification-service`, tomorrow
  invoicing, analytics, etc.) can subscribe without `order-service` knowing
  they exist. This decouples the order flow from any slow or unreliable
  downstream consumer.
- **GraphQL** — read-side aggregation. `query-service` lets a client fetch
  exactly the fields it needs across `catalog` and `orders` in a single
  round-trip, avoiding the over/under-fetching that plain REST would cause.

## Folder layout

```
tp-microservices-nest/
├── catalog-service/        # REST + SQLite
├── order-service/          # REST + gRPC client + Kafka producer + SQLite
├── stock-service/          # gRPC server (in-memory)
├── notification-service/   # Kafka consumer
├── query-service/          # GraphQL aggregator
├── proto/
│   └── stock.proto         # shared gRPC contract
├── docker-compose.yml      # Kafka + Zookeeper (+ optional UI)
└── README.md
```

## Notes

- SQLite databases (`*.sqlite`) are created in each service's working
  directory on first boot — they are gitignored.
- `synchronize: true` is enabled in TypeORM for convenience; do not ship it
  to production.
- The proto file is shared from `proto/stock.proto` so both `stock-service`
  (server) and `order-service` (client) read the same contract.
