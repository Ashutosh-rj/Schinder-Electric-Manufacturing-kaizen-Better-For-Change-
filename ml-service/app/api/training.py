from fastapi import APIRouter, BackgroundTasks
from app.training.trainer import auto_train

router = APIRouter()

@router.post("/train")
async def trigger_training(background_tasks: BackgroundTasks):
    background_tasks.add_task(auto_train)
    return {"status": "training_started", "job_id": "auto"}
