from fastapi import APIRouter

router = APIRouter(prefix="/loss-tree", tags=["loss-tree"])

@router.get("/")
async def get_loss_tree():
    return {}
