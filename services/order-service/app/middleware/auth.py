from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify JWT token from request header
    Same concept as Node.js auth middleware!
    """
    try:
        token = credentials.credentials

        # Decode and verify token
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        # Return user info from token
        return {
            "userId": payload.get("userId"),
            "email": payload.get("email"),
            "role": payload.get("role")
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token. Please login again!"
        )