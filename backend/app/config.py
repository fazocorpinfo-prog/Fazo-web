from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", case_sensitive=False, extra="ignore", enable_decoding=False
    )

    app_name: str = "Fazo Admin"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    database_url: str = "sqlite:///./fazo.db"

    secret_key: str = "change-me-to-a-long-random-string"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    admin_initial_username: str = "admin"
    admin_initial_password: str = "admin123"
    admin_initial_email: str = "admin@fazo.uz"

    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    telegram_bot_token: str = ""
    telegram_admin_ids: List[str] = Field(default_factory=list)

    @field_validator("cors_origins", "telegram_admin_ids", mode="before")
    @classmethod
    def _split_csv(cls, v):
        if isinstance(v, str):
            return [item.strip() for item in v.split(",") if item.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
