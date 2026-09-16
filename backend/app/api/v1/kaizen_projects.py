from fastapi import APIRouter

router = APIRouter(prefix="/kaizen-projects", tags=["kaizen-projects"])

@router.get("/")
async def get_projects():
    return []

@router.post("/")
async def create_project(project: dict):
    return {"status": "created", "project": project}
