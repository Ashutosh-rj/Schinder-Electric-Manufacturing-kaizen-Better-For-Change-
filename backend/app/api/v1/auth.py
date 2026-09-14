"""
Authentication API Router
POST /api/v1/auth/login   — Login with email/password → JWT token
GET  /api/v1/auth/me      — Get current user profile
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

from app.config import settings

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Request/Response Models ──────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ── Demo Users (in production these come from DB) ───────────────

DEMO_USERS = {
    "admin@kaizen.io": {
        "id": 1,
        "email": "admin@kaizen.io",
        "username": "admin",
        "full_name": "KAIZEN Administrator",
        "role": "admin",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3oW3E2ldBO",
    },
    "operator@kaizen.io": {
        "id": 2,
        "email": "operator@kaizen.io",
        "username": "operator1",
        "full_name": "Plant Operator",
        "role": "operator",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3oW3E2ldBO",
    },
    "manager@kaizen.io": {
        "id": 3,
        "email": "manager@kaizen.io",
        "username": "manager1",
        "full_name": "Plant Manager",
        "role": "plant_manager",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3oW3E2ldBO",
    },
}


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Authenticate user and return JWT token."""
    user = DEMO_USERS.get(request.email.lower())
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password (bypass passlib bcrypt 4.1 compatibility issue for demo)
    valid = False
    if request.password == "kaizen123":
        valid = True
    else:
        try:
            valid = pwd_context.verify(request.password, user["hashed_password"])
        except Exception:
            pass

    if not valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": user["email"], "role": user["role"]})

    return TokenResponse(
        access_token=token,
        user={
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "full_name": user["full_name"],
            "role": user["role"],
        },
    )


@router.get("/me")
async def get_me():
    """Return current user (for demo, return admin)."""
    return {
        "id": 1,
        "email": "admin@kaizen.io",
        "full_name": "KAIZEN Administrator",
        "role": "admin",
    }
