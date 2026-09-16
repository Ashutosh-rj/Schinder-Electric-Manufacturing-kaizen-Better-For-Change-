from fastapi import APIRouter

router = APIRouter(prefix="/verification", tags=["verification"])

@router.get("/")
async def get_verification():
    return {}
