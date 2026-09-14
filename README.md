# KAIZEN — Change for Better
## AI-Powered Integrated Cement Plant Intelligence Platform

```
██╗  ██╗ █████╗ ██╗███████╗███████╗███╗   ██╗
██║ ██╔╝██╔══██╗██║╚══███╔╝██╔════╝████╗  ██║
█████╔╝ ███████║██║  ███╔╝ █████╗  ██╔██╗ ██║
██╔═██╗ ██╔══██║██║ ███╔╝  ██╔══╝  ██║╚██╗██║
██║  ██╗██║  ██║██║███████╗███████╗██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝
         CHANGE FOR BETTER
```

> **KAIZEN** is an AI-assisted, plant-wide industrial intelligence and optimization platform for an integrated cement manufacturing plant. It operates as a unified Observe → Understand → Predict → Optimize → Recommend → Act → Verify → Improve industrial intelligence loop.

---

## 🚀 Quick Start

```bash
git clone <repo-url>
cd kaizen
cp .env.example .env
docker compose up --build
```

**That's it.** Wait ~60 seconds for all services to initialize.

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | admin@kaizen.io / kaizen123 |
| **API** | http://localhost:8000 | — |
| **API Docs** | http://localhost:8000/docs | — |
| **Grafana** | http://localhost:3001 | admin / kaizen123 |
| **Prometheus** | http://localhost:9090 | — |
| **MinIO** | http://localhost:9001 | minioadmin / minioadmin |

## 🎬 Hackathon Demo

```bash
make demo
```

Then open http://localhost:3000, log in, and click **"HACKATHON DEMO MODE"** to start the automated demonstration.

---

## 📐 Architecture

```
Users
  │
  ▼
Frontend (React + TypeScript + Vite) — Port 3000
  │
  │ REST API + WebSocket
  ▼
Backend (FastAPI + Python) — Port 8000
  │
  ├── ML Service (FastAPI + XGBoost + SHAP) — Port 8001
  ├── PostgreSQL + TimescaleDB — Port 5432
  ├── Redis (Cache + Sessions) — Port 6379
  ├── Kafka (Event Streaming) — Port 9092
  └── MinIO (ML Models + Reports) — Port 9000
  
Simulator (Correlated Plant Telemetry Generator)
  │
  └─→ Kafka → Backend → TimescaleDB
```

## 🏭 Plant Coverage

| Section | Equipment |
|---------|-----------|
| Mine | Excavators, Dumpers, Crushers, Conveyors |
| Raw Material | Limestone, Clay, Additives, Storage |
| Raw Mill | Mill, Separator, Fans, Bag Filter |
| Pyroprocessing | Preheater, Precalciner, Kiln, Burner, Cooler |
| Clinker | Storage, Conveying |
| Cement Mill | Ball Mill/VRM, Separator, Fans |
| Packing & Dispatch | Packers, Conveyors, Dispatch |
| CPP | Boiler, Turbine, Generator |
| WHRS | Waste Heat Boiler, Turbine, Generator |
| Utilities | Compressors, Pumps, Electrical Distribution |

## 🧠 Intelligence Features

### What Is Happening? (Observe)
- Real-time plant telemetry via WebSocket
- 200+ sensors across all departments
- Data quality monitoring (GOOD/STALE/MISSING/SUSPECT)

### Why Is It Happening? (Understand)
- Root Cause Analysis engine
- Parameter correlation analysis
- Engineering rule engine (50+ rules)

### What Will Happen? (Predict)
- Equipment health scoring (XGBoost)
- Failure risk prediction (LightGBM)
- Energy anomaly detection (EWMA + Z-score + Isolation Forest)

### What Should We Do? (Optimize)
- Constrained optimization (SciPy)
- Kiln optimization (differential evolution)
- Cement Mill & Raw Mill optimization

### What Happens If We Do It? (Simulate)
- Interactive What-If simulator
- Before/After comparison with delta
- Risk assessment for quality and equipment

### Did It Actually Improve? (Verify)
- Closed-loop savings verification
- Baseline vs post-intervention comparison
- Financial and CO₂ savings calculation

## 📊 Navigation

| Page | Description |
|------|-------------|
| Overview | KAIZEN Command Center |
| Digital Twin | Interactive plant map |
| Energy | SEC, energy balance, loss detection |
| Process | Process intelligence, trends |
| Equipment Health | Health scores, status |
| Predictive Maintenance | RUL, failure risk, SHAP |
| Optimization | Run constrained optimization |
| What-If Simulator | Interactive parameter simulation |
| WHRS | Waste heat recovery dashboard |
| Captive Power | CPP energy balance |
| Emissions | Carbon intelligence |
| Alarms | Alarm management + history |
| Kaizen Opportunities | Ranked improvement list |
| Reports | Daily/Shift/Energy reports |
| Kaizen Copilot | AI assistant |
| Administration | Users, plant config |

## ⚙️ Scenarios

Change the active scenario via API or the UI:

| Scenario | Description |
|----------|-------------|
| `normal` | Stable plant operation |
| `fan_degradation` | Cement mill fan efficiency degrades → SEC rises |
| `energy_inefficiency` | SEC rises while production holds constant |
| `mill_instability` | Raw mill feed oscillates |
| `kiln_disturbance` | BZT drops, fuel adjusts |
| `whrs_degradation` | WHRS generation drops 25% |
| `cpp_issue` | CPP efficiency falls |
| `sensor_failure` | Stale/missing sensor data |

```bash
# Switch to fan degradation scenario
make scenario-fan-degradation
```

## 🔐 Roles

| Role | Access |
|------|--------|
| Admin | Everything |
| Plant Manager | KPIs, production, economics, approval |
| Shift Engineer | Process analytics, optimization, reports |
| Operator | Live process, alarms, recommendations |
| Energy Manager | Energy, SEC, savings, emissions |
| Maintenance | Equipment health, maintenance records |

## 📁 Project Structure

```
kaizen/
├── frontend/         React + TypeScript + Vite
├── backend/          FastAPI + Python
├── ml-service/       ML predictions + SHAP
├── simulator/        Correlated plant simulator
├── database/         DB schema + seeds
├── infrastructure/   Prometheus, Grafana, Kafka config
├── docs/             Architecture, API, ML docs
├── scripts/          Utility scripts
├── tests/            pytest + vitest
├── docker-compose.yml
├── .env.example
└── Makefile
```

## 🧪 Testing

```bash
make test           # All tests
make test-backend   # pytest only
make test-frontend  # vitest only
```

## 📖 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Data Model](docs/DATA_MODEL.md)
- [ML Guide](docs/ML.md)
- [Optimization](docs/OPTIMIZATION.md)
- [Demo Guide](docs/DEMO.md)
- [Security](docs/SECURITY.md)

---

## ⚠️ Important Notes

> All plant data is **SIMULATED** for demonstration purposes.
> All ML predictions are trained on synthetic data and labeled **PREDICTED / SIMULATED**.
> The platform operates as **Decision Support** only — no autonomous control actions.
> Every recommendation requires operator approval before implementation.

---

*Built for the Schneider Electric Hackathon — KAIZEN: Change for Better*
