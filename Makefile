.PHONY: up down demo seed test logs clean build

# ─── Quick Start ──────────────────────────────────────────────────
up:
	@echo "🚀 Starting KAIZEN platform..."
	@cp -n .env.example .env 2>/dev/null || true
	docker compose up --build -d
	@echo "✅ KAIZEN is starting. Services:"
	@echo "   Frontend  → http://localhost:3000"
	@echo "   Backend   → http://localhost:8000"
	@echo "   API Docs  → http://localhost:8000/docs"
	@echo "   Grafana   → http://localhost:3001  (admin/kaizen123)"
	@echo "   Prometheus→ http://localhost:9090"
	@echo "   MinIO     → http://localhost:9001  (minioadmin/minioadmin)"
	@echo "   ⏳ Wait ~60s for all services to initialize..."

down:
	docker compose down

# ─── Demo Mode ────────────────────────────────────────────────────
demo:
	@echo "🎬 Starting KAIZEN HACKATHON DEMO..."
	@cp -n .env.example .env 2>/dev/null || true
	docker compose up --build -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 60
	docker compose exec backend python scripts/seed_demo.py
	@echo "🎯 DEMO READY!"
	@echo "   Open http://localhost:3000"
	@echo "   Login: admin@kaizen.io / kaizen123"
	@echo "   Click 'HACKATHON DEMO MODE' to start the demonstration"

# ─── Development ──────────────────────────────────────────────────
dev:
	@cp -n .env.example .env 2>/dev/null || true
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# ─── Database ─────────────────────────────────────────────────────
seed:
	docker compose exec backend python scripts/seed_demo.py

migrate:
	docker compose exec backend alembic upgrade head

# ─── Testing ──────────────────────────────────────────────────────
test:
	docker compose exec backend pytest tests/ -v
	docker compose exec frontend npm run test

test-backend:
	docker compose exec backend pytest tests/ -v --tb=short

test-frontend:
	docker compose exec frontend npm run test

# ─── Logs ─────────────────────────────────────────────────────────
logs:
	docker compose logs -f backend ml-service simulator

logs-all:
	docker compose logs -f

# ─── Build ────────────────────────────────────────────────────────
build:
	docker compose build --no-cache

# ─── Cleanup ──────────────────────────────────────────────────────
clean:
	docker compose down -v --remove-orphans
	docker image prune -f

# ─── Scenarios ────────────────────────────────────────────────────
scenario-normal:
	docker compose exec backend curl -X POST http://localhost:8000/api/v1/simulator/scenario -H "Content-Type: application/json" -d '{"scenario":"normal"}'

scenario-fan-degradation:
	docker compose exec backend curl -X POST http://localhost:8000/api/v1/simulator/scenario -H "Content-Type: application/json" -d '{"scenario":"fan_degradation"}'

scenario-energy-inefficiency:
	docker compose exec backend curl -X POST http://localhost:8000/api/v1/simulator/scenario -H "Content-Type: application/json" -d '{"scenario":"energy_inefficiency"}'
