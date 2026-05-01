import hashlib
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def hash_password(password: str) -> str:
    """
    bcrypt has a 72-byte limit.
    We pre-hash using SHA256 to ensure safe input size.
    """
    normalized_password = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(normalized_password)



def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password using same normalization strategy.
    """
    normalized_password = hashlib.sha256(plain_password.encode()).hexdigest()
    return pwd_context.verify(normalized_password, hashed_password)



def create_token(data: dict) -> str:
    """
    Creates JWT token with expiration.
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def decode_token(token: str) -> dict:
    """
    Decodes JWT token safely.
    """
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM]
    )