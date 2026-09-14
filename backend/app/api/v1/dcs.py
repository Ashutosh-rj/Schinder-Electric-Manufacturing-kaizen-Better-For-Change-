from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.opcua_client import opcua_manager

router = APIRouter()

class SetpointWriteRequest(BaseModel):
    node_id: str
    value: float
    equipment_code: str
    reason: Optional[str] = None

@router.post("/write")
async def write_to_dcs(req: SetpointWriteRequest):
    """
    Writes a setpoint to the DCS after an optimization recommendation is approved.
    Requires safety bounds checking in the client.
    """
    try:
        success = await opcua_manager.write_setpoint(req.node_id, req.value)
        if success:
            return {
                "status": "success", 
                "message": f"Successfully wrote {req.value} to {req.node_id}"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to write to DCS.")
    except ValueError as e:
        # Safety limit violation
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_dcs_status():
    """
    Returns the connection status to the DCS.
    """
    return {
        "is_connected": opcua_manager.is_connected,
        "url": opcua_manager.url
    }
