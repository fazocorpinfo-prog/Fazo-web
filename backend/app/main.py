from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from app.admin.routes import router as admin_router
from app.api.analytics import router as analytics_router
from app.api.auth import router as auth_router
from app.api.contacts import router as contacts_router
from app.config import settings
from app.database import SessionLocal, init_db
from app.models.user import User
from app.security import hash_password

BASE = Path(__file__).parent


def _bootstrap_admin() -> None:
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == settings.admin_initial_username).one_or_none()
        if existing:
            return
        user = User(
            username=settings.admin_initial_username,
            email=settings.admin_initial_email,
            hashed_password=hash_password(settings.admin_initial_password),
            is_active=True,
            is_superuser=True,
        )
        db.add(user)
        db.commit()
    finally:
        db.close()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    static_dir = BASE / "admin" / "static"
    if static_dir.exists():
        app.mount("/admin/static", StaticFiles(directory=str(static_dir)), name="admin-static")

    app.include_router(auth_router)
    app.include_router(contacts_router)
    app.include_router(analytics_router)
    app.include_router(admin_router)

    @app.on_event("startup")
    def on_startup() -> None:
        init_db()
        _bootstrap_admin()

    @app.get("/", include_in_schema=False)
    def root():
        return RedirectResponse(url="/admin")

    @app.get("/api/health", tags=["system"])
    def health():
        return {"status": "ok", "app": settings.app_name, "env": settings.app_env}

    return app


app = create_app()
