from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ApprovalRequest(BaseModel):
    approved_by: str
    notes: str = ""

@router.post("/{id}/approve")
async def approve_recommendation(id: int, req: ApprovalRequest):
    # In a real application, we would fetch the recommendation details from the DB
    # For demo purposes, we assume recommendation id 1 is for CM-FAN-02
    if id == 1:
        from app.services.opcua_client import opcua_manager
        node_id = "ns=2;s=CM-FAN-02.Speed.Setpoint"
        recommended_value = 95.0  # e.g., reduce fan speed to 95%
        
        try:
            await opcua_manager.write_setpoint(node_id, recommended_value)
        except Exception as e:
            return {"status": "FAILED_DCS_WRITE", "id": id, "error": str(e)}
            
    elif id == 2:
        # Limestone Crusher (CR-401)
        from app.services.opcua_client import opcua_manager
        node_id = "ns=2;s=CR-401.FeedRate.Setpoint"
        recommended_value = 800.0  # e.g. reduce feed rate from 850 to 800 TPH to stabilize
        
        try:
            await opcua_manager.write_setpoint(node_id, recommended_value)
        except Exception as e:
            return {"status": "FAILED_DCS_WRITE", "id": id, "error": str(e)}

    return {"status": "APPROVED", "id": id, "dcs_updated": True}
