from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from app.api import deps
from app.core import security
from app.models.core import User

router = APIRouter()

@router.post("/login")
def login_access_token(
    db: Session = Depends(deps.get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # 1. Find user by email
    stmt = select(User).where(User.email == form_data.username) # OAuth2 form sends 'username'
    user = db.execute(stmt).scalars().first()

    # 2. Validate user and password
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not user.is_active:
         raise HTTPException(status_code=400, detail="Inactive user")

    # 3. Create Access Token
    access_token = security.create_access_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
