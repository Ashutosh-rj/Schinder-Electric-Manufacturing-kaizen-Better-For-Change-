from fastapi import APIRouter

router = APIRouter(prefix="/oee", tags=["oee"])

@router.get("/")
async def get_oee():
    return {}
