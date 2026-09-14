# KAIZEN — Hackathon Demo Guide

## One-Command Start

```bash
make demo
```

This will:
1. Start all Docker services
2. Initialize database with TimescaleDB schema
3. Seed 30 days of historical plant data
4. Start the simulator (normal scenario)
5. Train/load demo ML models

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kaizen.io | kaizen123 |
| Operator | operator@kaizen.io | kaizen123 |
| Manager | manager@kaizen.io | kaizen123 |

---

## The Hackathon Demo Story

### Step-by-Step Walkthrough

**1. Login (30 seconds)**
- Open http://localhost:3000
- Login as admin@kaizen.io / kaizen123
- You see the **KAIZEN COMMAND CENTER**

**2. Plant Normal Operation (1 minute)**
- Show the Overview dashboard
- Point to: Production TPH, Power MW, SEC kWh/t, WHRS MW
- Show 8 department cards — all GREEN
- Show KAIZEN SCORE: ~87
- Show real-time trend charts (live data from simulator)

**3. Trigger Demo Mode (automatic)**
- Click **"HACKATHON DEMO MODE"** button (cyan, top-right)
- A modal appears with 11 animated steps
- Click **"START DEMO"**

**4. Fan Degradation Injected**
- System automatically calls: `POST /api/v1/simulator/scenario {"scenario": "fan_degradation"}`
- Within 5 seconds: Cement Mill department card turns YELLOW/ORANGE
- SEC starts rising on the trend chart
- Fan vibration sensor goes red
- New alarm raised: HIGH priority

**5. AI Detects Anomaly**
- Anomaly detection worker fires (checks every 30s)
- Z-score for cement mill SEC > 2.5 → ANOMALY
- Engineering rule fires: "fan_power > baseline*1.15 AND production ≈ const"
- Kaizen Opportunity created: **KAI-NEW-001 "Cement Mill 2 Fan Optimization"**

**6. Root Cause Analysis**
- Navigate to **Kaizen Opportunities** page
- See KAI-NEW-001 at top (HIGH priority)
- Click to expand: Problem, Root Cause, Current vs Target performance
- RCA shows: "Fan operating point deviation — 68% probable cause"

**7. Optimization Run**
- Navigate to **Optimization** page
- Select: Target = "Cement Mill"
- Click **[RUN OPTIMIZATION]**
- SciPy differential_evolution runs
- Result: Fan Speed -5% → expected SEC reduction 8.4%
- Expected saving: 185 kWh/day

**8. What-If Simulation**
- Navigate to **What-If Simulator**
- Slide "Cement Mill Fan Speed" to -5%
- Click **[RUN SIMULATION]**
- Before/After table appears (labeled SIMULATED)
- Production: unchanged
- Power: -550 kW
- SEC: -1.9 kWh/ton
- CO₂: -12.3 kg/hour

**9. Recommendation Approval**
- Navigate to **Overview** → Command Center panel shows the recommendation
- Current value: Fan speed 100% | Recommended: 95%
- Expected benefit: -8.4% SEC, -185 kWh/day
- Confidence: 91%
- Click **[APPROVE]**
- Status changes: PENDING_APPROVAL → APPROVED → IMPLEMENTED

**10. Simulator Applies Change**
- Scenario transitions: fan_degradation → normal (with new setpoint)
- Within 10 seconds: SEC drops on trend chart
- Cement Mill card turns GREEN
- Alarm clears

**11. Savings Verified**
- 30 seconds of post-intervention data collected
- Savings Verification runs: Baseline vs Post-intervention
- Actual energy saving: ~175 kWh/day
- Financial saving: ~₹1,312/day
- CO₂ reduction: 0.14 tonnes/day
- Kaizen status: VERIFIED → CLOSED
- KAIZEN SCORE increments

---

## Key Talking Points

### "What Is Happening?"
> Point to the Overview dashboard with live telemetry, 8 department status cards, KAIZEN SCORE.

### "Why Is It Happening?"
> "KAIZEN detected an anomaly in Cement Mill 2 using a combination of statistical EWMA baseline tracking AND engineering rules. The Z-score exceeded 2.5 standard deviations."

### "What Will Happen?"
> "The ML health score for CM-FAN-02 has dropped from 91 to 74. XGBoost predicts 80% failure risk within 18 days without intervention."

### "What Should We Do?"
> "Constrained optimization using SciPy differential evolution found the optimal fan operating point: reduce speed by 5%, saving 185 kWh/day while maintaining production and quality."

### "What Happens If We Do It?"
> "The What-If simulator shows: -550 kW power, -1.9 kWh/ton SEC, production unchanged, CO₂ -12.3 kg/h. Risk: LOW."

### "Did It Actually Improve?"
> "Post-intervention measurement confirms 175 kWh/day actual saving, closing the Kaizen loop."

---

## Live Demo Tips

1. **Keep the Overview tab open** during the demo — it shows everything
2. The **HACKATHON DEMO MODE** modal auto-sequences all steps with visual feedback
3. All charts auto-refresh every 5 seconds via WebSocket
4. The **Copilot** can answer "What changed during the last 15 minutes?" in real time
5. Point to the **SIMULATED DATA** labels — this shows the platform's integrity

---

## Scenario Commands

```bash
# During live demo, switch scenarios via terminal
make scenario-fan-degradation    # Inject the fault
make scenario-normal             # Apply the fix
make scenario-energy-inefficiency # Show another anomaly
```

Or use the UI: Administration → Simulator Control → Select Scenario

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Services not starting | `docker compose logs -f` to see errors |
| No data on dashboard | Wait 60s for seeder to complete |
| WebSocket not connecting | Check backend is healthy: `curl http://localhost:8000/health` |
| Charts empty | Ensure simulator is running: `docker compose logs simulator` |
