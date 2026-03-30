from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError
from database import SessionLocal
from models import User
from security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token
)

import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Google Auth Imports
from google.oauth2 import id_token
from google.auth.transport import requests

load_dotenv()

ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# ---------------- DB Dependency ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- Request Model ----------------
class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "user"
    admin_key: str | None = None


# ---------------- GOOGLE TOKEN MODEL ----------------
class GoogleToken(BaseModel):
    token: str


# ---------------- GET CURRENT USER ----------------
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise credentials_exception

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role
    }


# ---------------- REGISTER ----------------
@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(User.email == request.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    role = "user"

    # Admin verification
    if request.role == "admin":

        if request.admin_key != ADMIN_SECRET_KEY:
            raise HTTPException(
                status_code=403,
                detail="Invalid admin secret key"
            )

        role = "admin"

    user = User(
        full_name=request.full_name,
        email=request.email,
        role=role,
        hashed_password=hash_password(request.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}


# ---------------- LOGIN ----------------
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Your account has been deactivated by admin"
        )

    access_token = create_access_token(
        {"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }


# ---------------- GOOGLE LOGIN ----------------
@router.post("/google-login")
def google_login(data: GoogleToken, db: Session = Depends(get_db)):

    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request()
        )

        email = idinfo["email"]
        name = idinfo.get("name", "")

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    user = db.query(User).filter(User.email == email).first()

    # check if user exists and is deactivated
    if user and not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Your account has been deactivated by admin"
        )

    # create new user if Google user does not exist
    if not user:
        user = User(
            full_name=name,
            email=email,
            role="user",
            hashed_password="",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }