from fastapi import APIRouter

router = APIRouter(prefix="/opl", tags=["opl"])

@router.get("/")
async def get_opl():
    return []
