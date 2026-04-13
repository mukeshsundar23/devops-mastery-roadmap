import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
import bcrypt

SECRET_KEY = os.getenv("JWT_SECRET", "dev-secret-change-in-production")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_access_token(username: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    )
    payload = {"sub": username, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[str]:
    """Returns username from token, or None if invalid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
