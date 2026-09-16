from fastapi import APIRouter

router = APIRouter(prefix="/standards", tags=["standards"])

@router.get("/")
async def get_standards():
    return []
