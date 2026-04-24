# Fazo Backend

FastAPI backend + custom admin console matching the website's dark glassmorphism UI.

## Stack
- FastAPI · SQLAlchemy 2.0 · Pydantic v2
- JWT auth (cookie + Bearer)
- Jinja2-rendered admin panel with Chart.js, starfield canvas, and pointer parallax
- SQLite by default (swap `DATABASE_URL` for Postgres/MySQL)

## Setup

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env    # then edit values
python run.py
```

Server boots at `http://localhost:8000`.

- Admin UI: `http://localhost:8000/admin`
- API docs: `http://localhost:8000/api/docs`
- Health:   `http://localhost:8000/api/health`

Default admin (from `.env`):
- **login:** `admin`
- **parol:** `admin123`

Birinchi kirishdan keyin `Sozlamalar` → `Parolni yangilash` orqali parolni o‘zgartiring.

## Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLAlchemy DSN (default `sqlite:///./fazo.db`) |
| `SECRET_KEY` | JWT signing key — change in production |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token TTL (default 1440 = 24h) |
| `ADMIN_INITIAL_*` | Seed superuser on first boot |
| `CORS_ORIGINS` | Comma-separated list, e.g. `http://localhost:3000` |
| `TELEGRAM_BOT_TOKEN` | If set, new contacts are forwarded to Telegram admins |
| `TELEGRAM_ADMIN_IDS` | Comma-separated chat IDs |

## Public API (used by the Next.js frontend)

| Method | Path | Description |
|---|---|---|
| POST | `/api/contacts` | Submit a contact-form lead |
| POST | `/api/analytics/pageview` | Record a page view |
| POST | `/api/analytics/event` | Record a custom event |

## Admin/authenticated API

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Obtain JWT |
| GET  | `/api/auth/me` | Current user |
| POST | `/api/auth/password` | Change password |
| GET  | `/api/contacts` | List/filter contacts |
| GET  | `/api/contacts/{id}` | Contact detail |
| PATCH | `/api/contacts/{id}` | Update status / notes |
| DELETE | `/api/contacts/{id}` | Delete contact |
| GET  | `/api/analytics/dashboard?days=30` | Dashboard payload |

## Admin console

- `/admin/login` · login (heavy parallax, orbit rings, starfield, conic border glow)
- `/admin/dashboard` · stats cards, view/lead charts, top pages, device & locale donuts, recent leads
- `/admin/contacts` · filterable list + detail view + status/notes editor
- `/admin/analytics` · trend chart + donuts + top pages
- `/admin/settings` · profile + password change

Every card uses pointer-tilt 3D parallax (`data-parallax-tilt`) and a cursor-tracked glow overlay. The background is a canvas starfield (`starfield.js`) with mouse-drift, plus radial ambient gradients matching the website's `globals.css` tokens.

## Wiring the Next.js frontend

In the existing contact form, point the submit URL at this backend (set `NEXT_PUBLIC_API_BASE` or similar):

```ts
await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/contacts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, phone, service, message, source: "fazo.uz" }),
});
```

For page-view tracking, call `/api/analytics/pageview` from a client component when routes change.
