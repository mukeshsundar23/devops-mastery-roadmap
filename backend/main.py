from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import create_access_token, decode_token, hash_password, verify_password
from database import Base, engine, get_db
from models import Progress, User

# ── Bootstrap ────────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevOps Roadmap API", docs_url="/api/docs", redoc_url=None)
security = HTTPBearer()


# ── Schemas ───────────────────────────────────────────────────────────────────
class Credentials(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ProgressUpdate(BaseModel):
    completed: bool


# ── Auth helpers ──────────────────────────────────────────────────────────────
def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    username = decode_token(creds.credentials)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/auth/register", response_model=Token)
def register(body: Credentials, db: Session = Depends(get_db)):
    if not body.username or len(body.username) < 2:
        raise HTTPException(status_code=400, detail="Username must be at least 2 characters")
    if not body.password or len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if db.query(User).filter(User.username == body.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    user = User(username=body.username, hashed_password=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": create_access_token(user.username)}


@app.post("/api/auth/login", response_model=Token)
def login(body: Credentials, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == body.username).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"access_token": create_access_token(user.username)}


@app.get("/api/progress", response_model=List[int])
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Progress)
        .filter(Progress.user_id == current_user.id, Progress.completed == True)
        .all()
    )
    return [r.day for r in rows]


@app.post("/api/progress/{day}")
def update_progress(
    day: int,
    body: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if day < 1 or day > 60:
        raise HTTPException(status_code=400, detail="Day must be between 1 and 60")

    existing = (
        db.query(Progress)
        .filter(Progress.user_id == current_user.id, Progress.day == day)
        .first()
    )

    if body.completed:
        if not existing:
            db.add(Progress(user_id=current_user.id, day=day, completed=True))
        elif not existing.completed:
            existing.completed = True
    else:
        if existing:
            db.delete(existing)

    db.commit()
    return {"success": True}
