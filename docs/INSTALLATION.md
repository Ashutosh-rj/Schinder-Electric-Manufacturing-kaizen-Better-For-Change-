# KAIZEN — Installation Guide

## Prerequisites

Only **Docker Desktop** is required. No Python, Node.js, or database installation needed.

- Docker Desktop 4.x or later
- Docker Compose v2.x (bundled with Docker Desktop)
- 8 GB RAM recommended (all services combined)
- 10 GB free disk space

---

## Quick Start (3 commands)

```bash
git clone <repo-url>
cd kaizen
cp .env.example .env
docker compose up --build
```

Wait approximately 60-90 seconds for all services to initialize. Then open:
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

Login: `admin@kaizen.io` / `kaizen123`

---

## Service Ports

| Service | Port | Notes |
|---------|------|-------|
| Frontend | 3000 | React app via Nginx |
| Backend API | 8000 | FastAPI |
| ML Service | 8001 | Internal only (via backend) |
| PostgreSQL | 5432 | TimescaleDB |
| Redis | 6379 | Cache |
| Kafka | 29092 | External access only |
| MinIO Console | 9001 | Web UI |
| MinIO API | 9000 | S3-compatible |
| Prometheus | 9090 | Metrics |
| Grafana | 3001 | Dashboards |

---

## Environment Configuration

Copy `.env.example` to `.env` and review:

```bash
cp .env.example .env
```

**Minimum required changes for production:**
```
SECRET_KEY=<generate with: openssl rand -hex 32>
POSTGRES_PASSWORD=<strong password>
MINIO_SECRET_KEY=<strong password>
```

---

## Verify Installation

```bash
# Check all services are healthy
docker compose ps

# Test backend API
curl http://localhost:8000/health

# Test ML service
curl http://localhost:8001/health
```

---

## Development Mode (hot reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Frontend changes: hot-reload via Vite
Backend changes: hot-reload via Uvicorn `--reload`

---

## Reset / Clean Start

```bash
make clean    # removes all containers AND volumes (all data lost)
make up       # fresh start with re-seeded data
```

---

## Troubleshooting

### Kafka fails to start
Zookeeper must be healthy before Kafka starts. If Kafka keeps restarting:
```bash
docker compose restart zookeeper
docker compose restart kafka
```

### Database not initialized
If the frontend shows no data:
```bash
docker compose exec backend python scripts/seed_demo.py
```

### Port conflicts
If ports 3000, 8000, 5432 are in use, change them in `.env`:
```
FRONTEND_PORT=3100
BACKEND_PORT=8080
POSTGRES_PORT=5433
```
And update `docker-compose.yml` port mappings accordingly.

### Running on low RAM (< 8GB)
Disable Kafka and use Redis Streams:
```
KAFKA_ENABLED=false
```
Then restart: `docker compose up --build`
