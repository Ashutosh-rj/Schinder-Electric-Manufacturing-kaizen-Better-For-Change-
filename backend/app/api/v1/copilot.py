from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import os
import json
from google import genai
from google.genai import types

router = APIRouter()

class CopilotRequest(BaseModel):
    query: str
    context: Optional[dict] = None

@router.post("/query")
async def query_copilot(req: CopilotRequest):
    from app.services.redis_store import get_current_state, get_active_alarms, BAT_SEC_KWH_T_CLINKER, get_kaizen_opportunities
    state = await get_current_state()
    alarms = await get_active_alarms()
    opps = await get_kaizen_opportunities()
    
    answer = ""
    evidence = []
    root_causes = []
    recs = []
    intent = "llm_analysis"

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        answer = "I am the Kaizen Copilot. (Note: GEMINI_API_KEY is not set. Please configure it to enable the full LLM capabilities). "
        answer += f"Currently the plant has {len(alarms)} alarms and {len(opps)} active optimization opportunities."
        return _format_response(req.query, intent, answer, evidence, root_causes, recs)

    try:
        client = genai.Client(api_key=api_key)
        
        system_instruction = (
            "You are Kaizen Copilot, an expert industrial AI assistant for a cement plant. "
            "You help plant operators, engineers, and managers optimize production, diagnose issues, "
            "and improve energy efficiency.\n\n"
            f"CURRENT PLANT CONTEXT (JSON):\nState: {json.dumps(state)}\nAlarms: {json.dumps(alarms)}\n"
            f"Opportunities: {json.dumps(opps)}\nBAT SEC Target: {BAT_SEC_KWH_T_CLINKER} kWh/t.\n\n"
            "Analyze the user's query based on this live context. Keep answers concise, technical, and actionable."
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=req.query,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
            )
        )
        
        answer = response.text
        
        # Simple extraction for evidence
        for k, v in state.items():
            if k.lower().replace("-", " ") in answer.lower():
                evidence.append({"tag": k, "current": v, "status": "REFERENCED"})

    except Exception as e:
        answer = f"An error occurred while connecting to the LLM: {str(e)}"
        
    return _format_response(req.query, intent, answer, evidence, root_causes, recs)

def _format_response(query, intent, answer, evidence, root_causes, recs):
    return {
        "query": query,
        "intent": intent,
        "answer": answer,
        "evidence": evidence[:5],
        "root_causes": root_causes,
        "recommendations": recs,
        "data_sources": ["sensor_readings", "production_records", "alarms"],
        "data_timestamp": datetime.now().isoformat(),
        "time_period_analyzed": "Live Data",
        "confidence": "HIGH",
        "related_kaizen": [],
        "disclaimer": "[LLM ADVISORY] AI-generated response based on live telemetry. Verify before acting."
    }
