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
    # Determine intent from query
    query_lower = req.query.lower()
    intent = "general"
    if "production" in query_lower or "why is" in query_lower:
        intent = "process_deviation"
    elif "energy" in query_lower or "saving" in query_lower:
        intent = "energy_analysis"
    elif "fail" in query_lower or "health" in query_lower:
        intent = "equipment_health"

    return {
        "query": req.query,
        "intent": intent,
        "answer": "Raw Mill 1 production is currently at 272 TPH vs target of 300 TPH (-28 TPH deviation). Analysis of associated process parameters over the last 2 hours shows elevated mill differential pressure.",
        "evidence": [
            {"tag": "KAIZEN.RAWMILL1.VRM501.MILL.DP_MMWC", "current": 820, "normal": "500-750", "status": "HIGH"},
            {"tag": "KAIZEN.RAWMILL1.FEED.LIMESTONE.RATE_TPH", "current": 285, "normal": "290-320", "status": "LOW"}
        ],
        "root_causes": [
            {"cause": "Elevated mill DP indicating high circulating load", "probability": 0.82, "evidence": "DP trend rising for 90 min"}
        ],
        "recommendations": [
            {"action": "Reduce feed by 10 TPH temporarily", "advisory": True, "safety_note": "Subject to existing DCS permissives"}
        ],
        "data_sources": ["sensor_readings", "production_records", "alarms"],
        "data_timestamp": datetime.now().isoformat(),
        "time_period_analyzed": "Last 2 hours",
        "confidence": "HIGH",
        "related_kaizen": ["KAI-003"],
        "disclaimer": "[SIMULATED DATA] No automatic control action has been executed. All recommendations are advisory only and subject to existing plant safety systems."
    }

