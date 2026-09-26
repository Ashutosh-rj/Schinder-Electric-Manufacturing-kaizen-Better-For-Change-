from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter()

# In-memory storage seeded with realistic plant improvement initiatives
_PROJECTS: List[Dict[str, Any]] = [
    {
        "id": "KAI-3001",
        "title": "Cement Mill 1 Energy Loss & Fan Optimization",
        "dept": "CEMENT_MILL",
        "impact": "₹42,000/day",
        "owner": "R. Sharma",
        "sponsor": "Vikram Sharma (Plant GM)",
        "progress": 40,
        "status": "ANALYZING",
        "priority": "HIGH",
        "created_at": "2026-09-10",
        "target_date": "2026-10-15",
        "charter": {
            "problem_statement": "Finish grinding ball mill CM1 specific energy consumption is currently 41.2 kWh/t, which is 10.8% above BAT target (38.0 kWh/t). Separator recirculation fan runs at fixed 960 RPM, creating excessive airflow drag, fines over-grinding, and elevated motor power draw.",
            "target_condition": "Reduce total grinding circuit SEC to <= 38.0 kWh/ton while sustaining 3-day and 28-day compressive cement strength and Blaine fineness >= 3800 m²/kg.",
            "lead_engineer": "Rajesh Sharma (Lead Process Optimization Engineer)",
            "electrical_lead": "Amit Verma (E&I Reliability Manager)",
            "milestones": [
                {"name": "Telemetry Baseline Audit", "date": "2026-09-12", "completed": True},
                {"name": "SciPy SLSQP Affinity Law Simulation", "date": "2026-09-18", "completed": True},
                {"name": "VFD Setpoint Trimming Trial", "date": "2026-09-25", "completed": False},
                {"name": "Empirical Blaine Quality Lock", "date": "2026-10-05", "completed": False},
                {"name": "Standardize Plant SOP (OPL-208)", "date": "2026-10-15", "completed": False}
            ]
        },
        "root_cause": {
            "five_why": [
                {"question": "Why is CM1 specific energy consumption (SEC) high?", "answer": "Mill main drive and separator fan power draw are elevated relative to the 100 TPH clinker feed rate."},
                {"question": "Why is power draw elevated?", "answer": "Excessive internal recirculating load and aerodynamic drag across the dynamic separator cage."},
                {"question": "Why is recirculating load high?", "answer": "High fan air velocity sweeps coarse clinker particles prematurely before optimal ball charge attrition."},
                {"question": "Why is fan air velocity unnecessarily high?", "answer": "Separator ID fan runs at fixed 960 RPM without closed-loop trim matched to Blaine requirements."},
                {"question": "What is the systemic root cause?", "answer": "Lack of real-time feed-forward control based on clinker grindability index and fluid affinity law optimization."}
            ],
            "ishikawa": {
                "Machine": ["Fixed speed 1800 kW fan motor", "Guide vane damper mechanical hysteresis"],
                "Method": ["Manual damper adjustment based on 2-hour lab samples", "Fixed speed operating habit"],
                "Material": ["Clinker hardness variance from burning zone fluctuation", "Moisture spikes in gypsum feed"],
                "Measurement": ["2-hour delay in laboratory Blaine titration feedback", "Differential pressure gauge drift"],
                "Milieu": ["Ambient air temperature fluctuations affecting air density"]
            },
            "telemetry_tags": [
                {"tag": "CM-POWER", "desc": "Cement Mill Main Drive Power", "value": "5,200 kW", "normal": "4,800 kW", "status": "HIGH"},
                {"tag": "CM-FAN-SPEED", "desc": "Separator Fan RPM", "value": "960 RPM", "normal": "845 RPM", "status": "HIGH"},
                {"tag": "CM-FEED", "desc": "Total Grinding Mill Feed", "value": "100.0 TPH", "normal": "100.0 TPH", "status": "NORMAL"},
                {"tag": "CM-BLAINE", "desc": "Cement Fineness (Fineness Target)", "value": "3820 m²/kg", "normal": "3800 m²/kg", "status": "NORMAL"}
            ]
        },
        "action_plan": [
            {"id": "ACT-1", "task": "Instrument CM1 separator inlet duct with digital differential pressure transmitter", "owner": "A. Patel", "due": "2026-09-22", "done": True},
            {"id": "ACT-2", "task": "Configure closed-loop VFD speed setpoint via EcoStruxure DCS gateway", "owner": "R. Sharma", "due": "2026-09-26", "done": False},
            {"id": "ACT-3", "task": "Conduct 24-hour step test reducing fan speed by -30 RPM increments", "owner": "V. Nair", "due": "2026-09-30", "done": False},
            {"id": "ACT-4", "task": "Verify Blaine fineness and 1-day cement mortar compressive strength", "owner": "Quality Lab", "due": "2026-10-05", "done": False}
        ],
        "business_case": {
            "capex_inr": 850000,
            "opex_annual_inr": 120000,
            "daily_savings_inr": 42000,
            "annual_savings_inr": 15330000,
            "payback_months": 2.1,
            "roi_pct": 170.4,
            "co2_avoided_tons_year": 1240
        },
        "verification": {
            "baseline_sec": 41.2,
            "target_sec": 38.0,
            "current_sec": 37.8,
            "trend_points": [41.2, 41.0, 41.5, 41.1, 39.5, 37.9, 37.7, 37.8]
        },
        "opl_id": "OPL-208",
        "notes": [
            {"author": "R. Sharma", "date": "2026-09-12 14:30", "text": "Completed preliminary telemetry analysis. Potential daily savings confirmed at ₹42,000/day by reducing fan speed to ~845 RPM."},
            {"author": "Vikram Sharma", "date": "2026-09-15 09:15", "text": "Approved pilot trial protocol. Ensure CCR operators monitor air-slide transport to prevent duct chute settling."}
        ]
    },
    {
        "id": "KAI-3002",
        "title": "Kiln Burning Zone Thermal Inefficiency & Fuel Rate Optimization",
        "dept": "PYROPROCESS",
        "impact": "₹28,500/day",
        "owner": "S. Gupta",
        "sponsor": "Vikram Sharma (Plant GM)",
        "progress": 20,
        "status": "DETECTED",
        "priority": "HIGH",
        "created_at": "2026-09-14",
        "target_date": "2026-10-30",
        "charter": {
            "problem_statement": "Kiln specific fuel consumption is elevated at 748 kcal/kg clinker against design target of 735 kcal/kg due to burning zone secondary air temperature drop and coal firing rate over-compensation.",
            "target_condition": "Reduce kiln fuel flow setpoint from 12.0 t/h to 10.8 t/h, reducing specific heat consumption by 13 kcal/kg and saving ₹28,500/day.",
            "lead_engineer": "S. Gupta (Pyroprocessing Senior Specialist)",
            "electrical_lead": "A. Verma",
            "milestones": [
                {"name": "Secondary Air Pyrometer Calibration", "date": "2026-09-16", "completed": True},
                {"name": "Tertiary Air Damper Position Tuning", "date": "2026-09-24", "completed": False},
                {"name": "Coal Firing Trimming Trial", "date": "2026-10-02", "completed": False}
            ]
        },
        "root_cause": {
            "five_why": [
                {"question": "Why is kiln thermal heat consumption high?", "answer": "Elevated coal firing rate at kiln main burner."},
                {"question": "Why is more coal being fired?", "answer": "Burning zone temperature (BZT) dips below 1420°C periodically."},
                {"question": "Why does BZT dip?", "answer": "Secondary combustion air temperature from clinker cooler drops during grate speed surges."},
                {"question": "Why does secondary air drop?", "answer": "Cooler first grate under-grate aeration fan pressure is not dynamically linked to clinker bed depth."},
                {"question": "What is the root cause?", "answer": "Cooler speed control is operating in manual mode rather than closed-loop bed pressure control."}
            ],
            "ishikawa": {
                "Machine": ["Cooler grate drive hydraulic pump wear", "Primary burner nozzle tip carbon build-up"],
                "Method": ["Manual cooler fan speed regulation", "Coal setpoint compensation without BZT pyrometer linkage"],
                "Material": ["Coal ash content variance (32% vs 28% design)", "Raw meal LSF volatility"],
                "Measurement": ["Optical pyrometer optical window dust coating"],
                "Milieu": ["High ambient crosswinds cooling kiln shell"]
            },
            "telemetry_tags": [
                {"tag": "KILN-FUEL", "desc": "Kiln Main Coal Feed", "value": "12.0 TPH", "normal": "10.8 TPH", "status": "HIGH"},
                {"tag": "KILN-BZT", "desc": "Burning Zone Temperature", "value": "1415 °C", "normal": "1450 °C", "status": "LOW"},
                {"tag": "KILN-O2", "desc": "Kiln Inlet Oxygen", "value": "3.8 %", "normal": "2.5 %", "status": "HIGH"}
            ]
        },
        "action_plan": [
            {"id": "ACT-1", "task": "Clean optical pyrometer protective lens and recalibrate dual-color sensor", "owner": "Instrumentation", "due": "2026-09-20", "done": True},
            {"id": "ACT-2", "task": "Enable automatic cooler bed pressure control loop on DCS", "owner": "S. Gupta", "due": "2026-09-28", "done": False},
            {"id": "ACT-3", "task": "Trim coal firing rate by 0.3 t/h while monitoring clinker free lime", "owner": "CCR Lead", "due": "2026-10-05", "done": False}
        ],
        "business_case": {
            "capex_inr": 350000,
            "opex_annual_inr": 60000,
            "daily_savings_inr": 28500,
            "annual_savings_inr": 10402500,
            "payback_months": 1.2,
            "roi_pct": 287.2,
            "co2_avoided_tons_year": 1664
        },
        "verification": {
            "baseline_sec": 748.0,
            "target_sec": 735.0,
            "current_sec": 742.0,
            "trend_points": [748, 747, 749, 746, 745, 743, 742, 742]
        },
        "opl_id": "OPL-206",
        "notes": [
            {"author": "S. Gupta", "date": "2026-09-14 11:00", "text": "Opportunity detected via Isolation Forest anomaly trigger. Secondary air dropped to 820°C during cooler surging."}
        ]
    },
    {
        "id": "KAI-3003",
        "title": "Preheater Top Stage False Air Sealing & Draft Recovery",
        "dept": "MAINTENANCE",
        "impact": "₹14,350/day",
        "owner": "M. Kumar",
        "sponsor": "Priya Sharma (Plant Head)",
        "progress": 90,
        "status": "VERIFYING",
        "priority": "MEDIUM",
        "created_at": "2026-08-28",
        "target_date": "2026-09-25",
        "charter": {
            "problem_statement": "Stage 4 cyclone dipleg double flap valve and inspection manholes drawing 8.5% false air into preheater gas stream, reducing ID fan thermal capacity and increasing fan power by 240 kW.",
            "target_condition": "Eliminate false air leakage to < 2.0% via ceramic rope gasketing and counter-weight flap seal refurbishing.",
            "lead_engineer": "M. Kumar (Mechanical Maintenance Lead)",
            "electrical_lead": "A. Patel",
            "milestones": [
                {"name": "Ultrasonic Air Leakage Survey", "date": "2026-08-30", "completed": True},
                {"name": "Ceramic Gasketing & Counter-weight Calibration", "date": "2026-09-08", "completed": True},
                {"name": "Oxygen Profile Verification", "date": "2026-09-15", "completed": True},
                {"name": "Final SOP Lock & Standardization", "date": "2026-09-25", "completed": False}
            ]
        },
        "root_cause": {
            "five_why": [
                {"question": "Why is preheater ID fan power high?", "answer": "ID fan gas volume flow exceeds design by 14%."},
                {"question": "Why is gas volume high?", "answer": "Cold ambient false air ingress into top preheater cyclones."},
                {"question": "Where is false air entering?", "answer": "Stage 4 dipleg flap seals and expansion bellow joints."},
                {"question": "Why are flap seals leaking?", "answer": "Counter-weight arm seized from clinker dust accretion."},
                {"question": "What is the root cause?", "answer": "Absence of periodic seal lubrication and visual inspection standard."}
            ],
            "ishikawa": {
                "Machine": ["Flap seal hinge seized", "Ceramic rope worn at manhole doors"],
                "Method": ["Inspection only during annual shutdown", "No routine oxygen draft balance check"],
                "Material": ["High-temperature gasket degradation"],
                "Measurement": ["Draft differential transmitter line chocked"],
                "Milieu": ["Severe thermal shock on preheater top deck"]
            },
            "telemetry_tags": [
                {"tag": "PH-O2-TOP", "desc": "Preheater Top Oxygen", "value": "4.1 %", "normal": "2.8 %", "status": "HIGH"},
                {"tag": "PH-FAN-POWER", "desc": "Preheater ID Fan Power", "value": "2,450 kW", "normal": "2,210 kW", "status": "HIGH"},
                {"tag": "PH-DRAFT", "desc": "Top Cyclone Draft", "value": "-52 mbar", "normal": "-45 mbar", "status": "HIGH"}
            ]
        },
        "action_plan": [
            {"id": "ACT-1", "task": "Carry out smoke bomb test to pinpoint vacuum leakage joints", "owner": "M. Kumar", "due": "2026-08-31", "done": True},
            {"id": "ACT-2", "task": "Replace packing with graphite-reinforced high temp ceramic rope", "owner": "Mechanical Team", "due": "2026-09-06", "done": True},
            {"id": "ACT-3", "task": "Calibrate counter-weight lever balance for free swinging operation", "owner": "A. Patel", "due": "2026-09-10", "done": True}
        ],
        "business_case": {
            "capex_inr": 180000,
            "opex_annual_inr": 20000,
            "daily_savings_inr": 14350,
            "annual_savings_inr": 5237750,
            "payback_months": 0.4,
            "roi_pct": 2800.0,
            "co2_avoided_tons_year": 574
        },
        "verification": {
            "baseline_sec": 4.1,
            "target_sec": 2.8,
            "current_sec": 2.9,
            "trend_points": [4.1, 4.0, 3.8, 3.4, 3.1, 3.0, 2.9, 2.9]
        },
        "opl_id": "OPL-207",
        "notes": [
            {"author": "M. Kumar", "date": "2026-09-12 16:00", "text": "Post-sealing oxygen at top cyclone dropped from 4.1% to 2.9%. Preheater fan power reduced by 215 kW immediately."}
        ]
    },
    {
        "id": "KAI-3004",
        "title": "Raw Mill ID Fan VFD Retrofit & Speed Optimization",
        "dept": "RAW_MILL",
        "impact": "₹19,200/day",
        "owner": "A. Patel",
        "sponsor": "Vikram Sharma (Plant GM)",
        "progress": 100,
        "status": "STANDARDIZED",
        "priority": "HIGH",
        "created_at": "2026-08-01",
        "target_date": "2026-09-01",
        "charter": {
            "problem_statement": "3,500 kW Raw Mill process fan operated with inlet vane throttling damper at 68% open, generating continuous throttling pressure loss of 280 mmWG and consuming unnecessary 380 kW.",
            "target_condition": "Full damper opening with medium-voltage VFD speed control to modulate airflow dynamically based on mill feed rate and grinding bed differential pressure.",
            "lead_engineer": "A. Patel (Electrical & Projects Lead)",
            "electrical_lead": "Amit Verma",
            "milestones": [
                {"name": "VFD Retrofit Commissioning", "date": "2026-08-05", "completed": True},
                {"name": "Fluid Affinity Law Speed Tuning", "date": "2026-08-15", "completed": True},
                {"name": "Energy Audit & SEC Verification", "date": "2026-08-25", "completed": True},
                {"name": "SOP Standardized & Locked", "date": "2026-09-01", "completed": True}
            ]
        },
        "root_cause": {
            "five_why": [
                {"question": "Why was Raw Mill fan consuming excessive electricity?", "answer": "Inlet guide vanes were throttling the airstream continuously."},
                {"question": "Why was the fan throttled?", "answer": "Process required 320,000 m³/h airflow but fan fixed speed produced 410,000 m³/h."},
                {"question": "Why did the fan produce excess flow?", "answer": "Fan was oversized by 25% during original plant engineering design."},
                {"question": "Why was speed not adjusted instead of throttling?", "answer": "Fan was driven by fixed-speed 6.6kV induction motor without variable frequency drive."},
                {"question": "What is the root cause?", "answer": "Capital expenditure constraint during initial project phase precluded MV VFD installation."}
            ],
            "ishikawa": {
                "Machine": ["Inlet damper throttling losses", "Fixed speed induction motor"],
                "Method": ["Damper throttling flow control"],
                "Material": ["Feed moisture variability requiring airflow changes"],
                "Measurement": ["Orifice flow plate pressure drop"],
                "Milieu": ["High dust concentration causing damper blade abrasion"]
            },
            "telemetry_tags": [
                {"tag": "RM-FAN-POWER", "desc": "Raw Mill Fan Power", "value": "2,980 kW", "normal": "2,980 kW", "status": "NORMAL"},
                {"tag": "RM-FAN-SPEED", "desc": "Raw Mill Fan VFD Speed", "value": "830 RPM", "normal": "830 RPM", "status": "NORMAL"},
                {"tag": "RM-SEC", "desc": "Raw Mill SEC", "value": "16.8 kWh/t", "normal": "17.0 kWh/t", "status": "NORMAL"}
            ]
        },
        "action_plan": [
            {"id": "ACT-1", "task": "Install and commission 6.6kV 3,500 kW MV VFD", "owner": "Schneider Electric Projects", "due": "2026-08-05", "done": True},
            {"id": "ACT-2", "task": "Lock inlet damper at 100% full open position", "owner": "A. Patel", "due": "2026-08-08", "done": True},
            {"id": "ACT-3", "task": "Integrate DCS cascade PID loop with mill differential pressure", "owner": "R. Sharma", "due": "2026-08-18", "done": True}
        ],
        "business_case": {
            "capex_inr": 2800000,
            "opex_annual_inr": 180000,
            "daily_savings_inr": 19200,
            "annual_savings_inr": 7008000,
            "payback_months": 4.9,
            "roi_pct": 243.8,
            "co2_avoided_tons_year": 768
        },
        "verification": {
            "baseline_sec": 19.4,
            "target_sec": 17.0,
            "current_sec": 16.8,
            "trend_points": [19.4, 19.3, 19.5, 18.2, 17.4, 17.0, 16.9, 16.8]
        },
        "opl_id": "OPL-208",
        "notes": [
            {"author": "A. Patel", "date": "2026-09-01 10:00", "text": "Successfully standardized and verified. SEC dropped by 2.6 kWh/t consistently. Ready for horizontal replication to Coal Mill fan."}
        ]
    },
    {
        "id": "KAI-3005",
        "title": "Clinker Cooler Aeration Fan Speed Profiling & Air Distribution",
        "dept": "COOLER",
        "impact": "₹12,400/day",
        "owner": "V. Nair",
        "sponsor": "Priya Sharma (Plant Head)",
        "progress": 65,
        "status": "IMPLEMENTING",
        "priority": "MEDIUM",
        "created_at": "2026-09-05",
        "target_date": "2026-10-10",
        "charter": {
            "problem_statement": "6 aeration fans on clinker cooler running at uniform 100% speed, causing excessive fluidization on cold grate end and red river channeling on hot recuperating grate.",
            "target_condition": "Implement differentiated speed profiling (Hot zone: 92%, Mid zone: 80%, Cold zone: 65%) to optimize recuperation air to secondary and tertiary ducts while reducing aeration power by 165 kW.",
            "lead_engineer": "V. Nair (Cooler Process Specialist)",
            "electrical_lead": "A. Verma",
            "milestones": [
                {"name": "Cooler Bed Thermal Profiling", "date": "2026-09-08", "completed": True},
                {"name": "Differentiated Fan Speed Matrix Trial", "date": "2026-09-18", "completed": True},
                {"name": "Secondary Air Temperature Verification", "date": "2026-09-28", "completed": False},
                {"name": "DCS Profile Automation & SOP", "date": "2026-10-10", "completed": False}
            ]
        },
        "root_cause": {
            "five_why": [
                {"question": "Why is cooler aeration power consumption high?", "answer": "All 6 aeration fans run at maximum 100% fixed speed."},
                {"question": "Why do cold zone fans run at 100%?", "answer": "No zoned speed regulation exists in CCR operator graphics."},
                {"question": "Does cold zone need 100% air?", "answer": "No, clinker is already cooled below 120°C in final grate section."},
                {"question": "What is the impact of excess cold air?", "answer": "Wastes electrical power and reduces tertiary air temperature by dilution."},
                {"question": "What is the root cause?", "answer": "Single master speed reference used instead of zoned profile curve."}
            ],
            "ishikawa": {
                "Machine": ["Uniform VFD setpoint distribution", "Air beam seal leakage"],
                "Method": ["Flat speed profiling policy", "Lack of zoned temperature monitoring"],
                "Material": ["Clinker granulometry variance (fines vs boulders)"],
                "Measurement": ["Under-grate pressure sensor impulse line clogged"],
                "Milieu": ["High clinker fall temperature surges"]
            },
            "telemetry_tags": [
                {"tag": "COOLER-FAN-KW", "desc": "Cooler Aeration Fans Total Power", "value": "1,120 kW", "normal": "955 kW", "status": "HIGH"},
                {"tag": "COOLER-SEC-AIR", "desc": "Secondary Air Temperature", "value": "910 °C", "normal": "950 °C", "status": "LOW"},
                {"tag": "CLINKER-TEMP", "desc": "Discharge Clinker Temperature", "value": "98 °C", "normal": "110 °C", "status": "NORMAL"}
            ]
        },
        "action_plan": [
            {"id": "ACT-1", "task": "Program segmented speed matrix logic in EcoStruxure PLC", "owner": "CCR Lead", "due": "2026-09-15", "done": True},
            {"id": "ACT-2", "task": "Purge under-grate pressure sensor impulse lines", "owner": "Instrumentation", "due": "2026-09-20", "done": True},
            {"id": "ACT-3", "task": "Lock zoned profiling curve and verify AQC boiler inlet gas temp", "owner": "V. Nair", "due": "2026-10-02", "done": False}
        ],
        "business_case": {
            "capex_inr": 220000,
            "opex_annual_inr": 30000,
            "daily_savings_inr": 12400,
            "annual_savings_inr": 4526000,
            "payback_months": 0.6,
            "roi_pct": 2043.6,
            "co2_avoided_tons_year": 496
        },
        "verification": {
            "baseline_sec": 1120,
            "target_sec": 955,
            "current_sec": 995,
            "trend_points": [1120, 1115, 1100, 1060, 1030, 1010, 998, 995]
        },
        "opl_id": "OPL-205",
        "notes": [
            {"author": "V. Nair", "date": "2026-09-18 15:20", "text": "Segmented speed trial successful. Secondary air temperature increased by +35°C, improving kiln thermal efficiency."}
        ]
    }
]

@router.get("/")
async def get_projects():
    return _PROJECTS

@router.get("/{project_id}")
async def get_project_detail(project_id: str):
    for p in _PROJECTS:
        if p["id"] == project_id:
            return p
    return {"error": "Project not found"}

@router.post("/")
async def create_project(project: dict):
    new_id = f"KAI-{3000 + len(_PROJECTS) + 1}"
    new_proj = {
        "id": project.get("id") or new_id,
        "title": project.get("title", "New Kaizen Initiative"),
        "dept": project.get("dept", "PLANT"),
        "impact": project.get("impact", "₹10,000/day"),
        "owner": project.get("owner", "Plant Operator"),
        "sponsor": project.get("sponsor", "Plant GM"),
        "progress": project.get("progress", 10),
        "status": project.get("status", "DETECTED"),
        "priority": project.get("priority", "MEDIUM"),
        "created_at": datetime.now().strftime("%Y-%m-%d"),
        "target_date": datetime.now().strftime("%Y-%m-%d"),
        "charter": {
            "problem_statement": project.get("title", "Process optimization initiative"),
            "target_condition": "Reduce energy consumption and stabilize operating parameters.",
            "lead_engineer": project.get("owner", "Plant Operator"),
            "electrical_lead": "Maintenance Lead",
            "milestones": [
                {"name": "Initial Telemetry Audit", "date": datetime.now().strftime("%Y-%m-%d"), "completed": True},
                {"name": "Model Simulation", "date": datetime.now().strftime("%Y-%m-%d"), "completed": False},
                {"name": "Pilot Setpoint Trial", "date": datetime.now().strftime("%Y-%m-%d"), "completed": False}
            ]
        },
        "root_cause": {
            "five_why": [
                {"question": "Why did the parameter deviate?", "answer": "Process variance detected by AI twin."},
                {"question": "Why was the setpoint suboptimal?", "answer": "Operating outside BAT envelope."},
                {"question": "What is the root cause?", "answer": "Manual setpoint setting without continuous closed-loop trim."}
            ],
            "ishikawa": {
                "Machine": ["Equipment setting sub-optimal"],
                "Method": ["Manual adjustment policy"],
                "Material": ["Process feed variability"],
                "Measurement": ["DCS telemetry drift"]
            },
            "telemetry_tags": []
        },
        "action_plan": [
            {"id": "ACT-1", "task": "Review DCS historical trends and alarm logs", "owner": project.get("owner", "Lead"), "due": "2026-10-01", "done": False},
            {"id": "ACT-2", "task": "Implement recommended setpoint trim", "owner": "CCR Operator", "due": "2026-10-05", "done": False}
        ],
        "business_case": {
            "capex_inr": 150000,
            "opex_annual_inr": 20000,
            "daily_savings_inr": 10000,
            "annual_savings_inr": 3650000,
            "payback_months": 0.5,
            "roi_pct": 2400.0,
            "co2_avoided_tons_year": 400
        },
        "verification": {
            "baseline_sec": 68.0,
            "target_sec": 62.0,
            "current_sec": 64.5,
            "trend_points": [68.0, 67.5, 67.0, 66.2, 65.5, 65.0, 64.5, 64.5]
        },
        "opl_id": "OPL-205",
        "notes": [
            {"author": project.get("owner", "Plant Lead"), "date": datetime.now().strftime("%Y-%m-%d %H:%M"), "text": "Initiative registered on continuous improvement board."}
        ]
    }
    _PROJECTS.insert(0, new_proj)
    return {"status": "created", "project": new_proj}

@router.patch("/{project_id}")
async def update_project(project_id: str, updates: dict):
    for p in _PROJECTS:
        if p["id"] == project_id:
            p.update(updates)
            return {"status": "updated", "project": p}
    return {"status": "not_found", "message": f"Project {project_id} not found"}

@router.post("/{project_id}/notes")
async def add_project_note(project_id: str, note: dict):
    for p in _PROJECTS:
        if p["id"] == project_id:
            if "notes" not in p:
                p["notes"] = []
            new_note = {
                "author": note.get("author", "Operator"),
                "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "text": note.get("text", "")
            }
            p["notes"].insert(0, new_note)
            return {"status": "added", "notes": p["notes"]}
    return {"status": "not_found", "message": f"Project {project_id} not found"}

@router.post("/{project_id}/tasks")
async def toggle_project_task(project_id: str, task_update: dict):
    task_id = task_update.get("task_id")
    done = task_update.get("done")
    for p in _PROJECTS:
        if p["id"] == project_id:
            for t in p.get("action_plan", []):
                if t["id"] == task_id:
                    t["done"] = done
                    # Recalculate progress based on task completion
                    tasks = p.get("action_plan", [])
                    completed = sum(1 for x in tasks if x.get("done"))
                    p["progress"] = round((completed / len(tasks)) * 100) if tasks else p["progress"]
                    return {"status": "updated", "task": t, "progress": p["progress"]}

    return {"status": "not_found"}



