from datetime import datetime
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    is_superuser: bool
    created_at: datetime
    last_login_at: datetime | None

    class Config:
        from_attributes = True


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
