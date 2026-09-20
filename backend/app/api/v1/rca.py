from fastapi import APIRouter
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class AnalyzeRequest(BaseModel):
    area: str
    symptoms: dict

def get_base_response():
    return {
        "timestamp": datetime.now().isoformat(),
        "data_source": "SIMULATOR",
        "disclaimer": "[SIMULATED DATA] RCA results are advisory."
    }

@router.post("/analyze")
async def analyze_symptoms(req: AnalyzeRequest):
    from app.services.redis_store import get_active_alarms, get_current_state
    state = await get_current_state()
    alarms = await get_active_alarms()
    
    base = get_base_response()
    
    # Try to find an alarm for this area
    area_alarms = [a for a in alarms if req.area.upper() in a.get("department_code", "").upper() or req.area.upper() in a.get("alarm_tag", "").upper()]
    
    if area_alarms:
        alarm = area_alarms[0]
        issue = alarm.get("description", "Unknown issue")
        severity = alarm.get("severity", "MEDIUM").upper()
        
        why1 = alarm.get("why_occurred", "Process parameters deviated from normal operating envelope.")
        causes = alarm.get("possible_causes", [])
        why2 = causes[0] if causes else "Underlying mechanical or process instability."
        
        # Make whys 3-5 conditional based on severity and area
        if severity == "CRITICAL":
            why3 = f"[SIMULATED] Rapid deterioration of {req.area} components due to sustained stress."
            why4 = f"[SIMULATED] Failure to trigger preventative interlocks during transient spikes."
            why5 = f"[SIMULATED] Systemic gap in early-warning anomaly detection for {req.area}."
        else:
            why3 = f"[SIMULATED] Operational parameters in {req.area} not continuously optimized."
            why4 = f"[SIMULATED] Lack of real-time compensation in local control loops."
            why5 = f"[SIMULATED] Manual intervention relied upon instead of closed-loop setpoint adjustment."
        
        base.update({
            "area": req.area,
            "problem_statement": f"{issue} detected in {req.area}.",
            "impact": alarm.get("consequence", "Production loss and potential equipment damage."),
            "ranked_causes": [
                {"cause": why2, "probability": 0.85, "evidence": alarm.get("alarm_tag")}
            ],
            "five_why": [
                {"question": "Why did the alarm trigger?", "answer": why1},
                {"question": "Why did that happen?", "answer": why2},
                {"question": "What is the root cause of that?", "answer": why3},
                {"question": "Why was it not caught earlier?", "answer": why4},
                {"question": "What is the systemic issue?", "answer": why5}
            ]
        })
    else:
        # Fallback to simulated data if no alarms
        base.update({
            "area": req.area,
            "problem_statement": f"Specific Energy Consumption is above target in {req.area}.",
            "impact": "₹42,000/day energy loss",
            "ranked_causes": [
                {"cause": "Elevated mill DP indicating high circulating load", "probability": 0.82, "evidence": "DP trend rising for 90 min"},
                {"cause": "Moisture in feed", "probability": 0.15, "evidence": "Outlet temp dropping"}
            ],
            "five_why": [
                {"question": "Why is SEC high?", "answer": "Mill main drive power is elevated relative to feed rate."},
                {"question": "Why is power elevated?", "answer": "High circulating load inside the mill."},
                {"question": "Why is circulating load high?", "answer": "Separator efficiency has dropped."},
                {"question": "Why did separator efficiency drop?", "answer": "Separator RPM is not matched to current material grindability."},
                {"question": "What is the root cause?", "answer": "Lack of real-time feed-forward control based on feed composition."}
            ]
        })
        
    return base

@router.get("/history")
async def get_rca_history():
    base = get_base_response()
    base.update({
        "history": [
            {"id": 1, "date": "2023-10-01", "area": "RAW_MILL", "top_cause": "Separator blockage", "status": "RESOLVED"}
        ]
    })
    return base

@router.get("/active")
async def get_active_rca():
    base = get_base_response()
    base.update({
        "active": [
            {"id": 2, "date": "2023-10-02", "area": "KILN", "top_cause": "Coal quality variation", "status": "OPEN"}
        ]
    })
    return base
