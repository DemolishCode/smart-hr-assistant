from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.core import User

router = APIRouter()

@router.get("/me")
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user profile
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "department": current_user.department.name if current_user.department else None,
        "position": current_user.position
    }
