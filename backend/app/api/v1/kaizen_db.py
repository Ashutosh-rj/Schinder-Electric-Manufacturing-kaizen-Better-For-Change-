from fastapi import APIRouter

router = APIRouter(prefix="/kaizen-db", tags=["kaizen-db"])

@router.get("/")
async def get_kaizen_db():
    return []
