from app.database import AsyncSessionLocal
from fastapi import Depends, HTTPException, status

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

def get_current_user():
    return {"username": "admin", "role": "admin"}
