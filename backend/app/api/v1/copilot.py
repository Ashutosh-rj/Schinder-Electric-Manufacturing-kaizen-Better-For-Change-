from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

router = APIRouter()

class CopilotRequest(BaseModel):
    query: str
    context: Optional[dict] = None

@router.post("/query")
async def query_copilot(req: CopilotRequest):
    from app.services.redis_store import get_current_state, get_active_alarms, BAT_SEC_KWH_T_CLINKER
    state = await get_current_state()
    alarms = await get_active_alarms()
    
    # Determine intent from query
    query_lower = req.query.lower()
    intent = "general"
    
    answer = ""
    evidence = []
    root_causes = []
    recs = []

    if "production" in query_lower or "why is" in query_lower or "raw mill" in query_lower:
        intent = "process_deviation"
        rm_feed = state.get("RM-FEED", 285.0)
        rm_vib = state.get("RM-VIBRATION", 2.0)
        dev = 300 - rm_feed
        
        answer = f"Raw Mill 1 production is currently at {rm_feed:.1f} TPH vs target of 300 TPH (-{dev:.1f} TPH deviation)."
        if rm_vib > 4.5:
            answer += " Analysis shows elevated mill vibration, indicating potential overload or uneven grinding."
            root_causes.append({"cause": "Elevated mill vibration indicating uneven bed or overload", "probability": 0.85, "evidence": "Vibration is high"})
            recs.append({"action": "Check separator speed and grinding pressure", "advisory": True})
        else:
            answer += " Mill vibration is normal. Process appears stable, but feed rate is suboptimal."
            root_causes.append({"cause": "Feed rate setpoint low or material restriction", "probability": 0.70, "evidence": "Vibration normal, but feed low"})
            
        evidence.append({"tag": "KAIZEN.RAWMILL.FEED", "current": round(rm_feed, 1), "normal": "290-320", "status": "LOW" if rm_feed < 290 else "NORMAL"})
        evidence.append({"tag": "KAIZEN.RAWMILL.VIBRATION", "current": round(rm_vib, 2), "normal": "0-4.5", "status": "HIGH" if rm_vib > 4.5 else "NORMAL"})
        
    elif "energy" in query_lower or "saving" in query_lower:
        intent = "energy_analysis"
        total_power = state.get("PLANT-TOTAL-POWER", 18400.0)
        clinker_tph = state.get("KILN-CLINKER-PROD", 185.0)
        current_sec = (total_power / clinker_tph) if clinker_tph > 0 else 64.2
        
        answer = f"Current plant SEC is {current_sec:.1f} kWh/ton clinker, compared to the BAT target of {BAT_SEC_KWH_T_CLINKER} kWh/ton."
        if current_sec > BAT_SEC_KWH_T_CLINKER:
            answer += " We are operating above target. Check Kaizen opportunities for potential optimizations, such as Cement Mill fan speed adjustments."
        
        evidence.append({"tag": "KAIZEN.PLANT.SEC", "current": round(current_sec, 1), "normal": str(BAT_SEC_KWH_T_CLINKER), "status": "HIGH" if current_sec > BAT_SEC_KWH_T_CLINKER else "NORMAL"})
        
    elif "fail" in query_lower or "health" in query_lower or "equipment" in query_lower:
        intent = "equipment_health"
        cm_vib = state.get("CM-VIBRATION", 1.5)
        if cm_vib > 5.0:
            answer = f"Cement Mill 1 Fan is showing signs of critical degradation. Vibration is currently {cm_vib:.2f} mm/s (limit 4.5 mm/s)."
            root_causes.append({"cause": "Bearing wear or imbalance", "probability": 0.9, "evidence": "High vibration readings"})
            recs.append({"action": "Schedule immediate inspection of CM1 Fan bearings", "advisory": True})
        else:
            answer = "Overall critical equipment health is stable. Cement Mill vibration is within normal limits."
            
        evidence.append({"tag": "KAIZEN.CM1.VIBRATION", "current": round(cm_vib, 2), "normal": "0-4.5", "status": "HIGH" if cm_vib > 4.5 else "NORMAL"})
    else:
        # General response with some live data
        clinker = state.get("KILN-CLINKER-PROD", 185.0)
        answer = f"I am your Kaizen Copilot. Currently, the plant is producing {clinker:.1f} TPH of clinker with {len(alarms)} active alarms. How can I assist you with process optimization today?"

    return {
        "query": req.query,
        "intent": intent,
        "answer": answer,
        "evidence": evidence,
        "root_causes": root_causes,
        "recommendations": recs,
        "data_sources": ["sensor_readings", "production_records", "alarms"],
        "data_timestamp": datetime.now().isoformat(),
        "time_period_analyzed": "Live Data",
        "confidence": "HIGH",
        "related_kaizen": ["KAI-003"] if intent == "process_deviation" else [],
        "disclaimer": "[SIMULATED DATA] No automatic control action has been executed. All recommendations are advisory only."
    }

