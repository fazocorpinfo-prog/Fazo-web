# FAZO ekotizimi — Deploy yo'riqnomasi

Uch alohida loyiha, uch platforma:

| Loyiha | Papka | Platforma | Ma'lumotlar bazasi |
|---|---|---|---|
| **Fazo sayti + backend** | `frontend/` | Netlify | MongoDB Atlas |
| **Mudarris landing** | `mudarris-landing/` | Netlify (subdomen) | — (fazo backendга yuboradi) |
| **Mudarris CRM (demo)** | `fazo_kurs_crm/` | Render | PostgreSQL (Render) |

---

## 1. MongoDB Atlas (avval shuni qiling)

1. https://cloud.mongodb.com → bepul **M0** cluster yarating.
2. **Database Access** → foydalanuvchi yarating (username + parol).
3. **Network Access** → `0.0.0.0/0` qo'shing (Netlify uchun).
4. **Connect → Drivers** → connection string oling:
   `mongodb+srv://USERNAME:PAROL@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
   > `<db_username>` va `<password>` o'rniga **haqiqiy** login/parolni yozing.

---

## 2. Fazo sayti (`frontend/`) → Netlify

### Env o'zgaruvchilar (Netlify → Site settings → Environment)
```
MONGODB_URI=mongodb+srv://...        # Atlas string
MONGODB_DB=fazo
JWT_SECRET=<uzun tasodifiy satr>     # `openssl rand -hex 48`
ADMIN_SEED_USER=admin
ADMIN_SEED_PASS=<kuchli parol>       # admin panel paroli
ADMIN_SEED_EMAIL=fazocorpinfo@gmail.com
TELEGRAM_BOT_TOKEN=8531717018:...    # env fayldagi token
TELEGRAM_CHAT_ID=5314914121          # guruh id
SITE_EMAIL=fazocorpinfo@gmail.com
CORS_ORIGINS=https://mudarris.fazo.uz
NEXT_PUBLIC_MUDARRIS_URL=https://mudarris.fazo.uz
NEXT_PUBLIC_MUDARRIS_CRM_DEMO_URL=https://crm.fazo.uz
```

### Bazani to'ldirish (deploy'dan keyin bir marta)
Lokal kompyuterda (Atlas URI bilan):
```
cd frontend
# .env.local ga Atlas MONGODB_URI qo'ying
npm run seed          # butun kontentni Atlas ga yozadi (uz/ru/en)
```
> `npm run seed -- --dry-run` — hech narsa yozmasdan tekshiradi.
> `npm run seed -- --with-media` — public rasmlarni GridFS ga ham yuklaydi.

### Admin panel
`https://fazo.uz/admin` — `admin` / (siz bergan parol). Kirgach **Sozlamalar → parol** ni almashtiring.

---

## 3. Mudarris landing (`mudarris-landing/`) → Netlify subdomen

1. Netlify'da yangi sayt → repo `mudarris-landing`.
2. Custom domain: `mudarris.fazo.uz` (DNS: CNAME → Netlify).
3. Env:
   ```
   NEXT_PUBLIC_FAZO_API=https://fazo.uz
   ```
   > `NEXT_PUBLIC_*` build vaqtida "muhrlanadi" — o'zgartirsangiz qayta deploy qiling.
4. Eski Telegram env'lari (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) **kerak emas** — o'chiring (endi fazo backend yuboradi).

Arizalar va tashriflar avtomatik fazo backendга `project="mudarris"` bilan boradi va fazo admin'da **alohida** ko'rinadi.

---

## 4. Mudarris CRM demo (`fazo_kurs_crm/`) → Render

`render.yaml` allaqachon sozlangan. Render'da env (sync:false bo'lganlar):
```
DEMO_MODE=True                # (yaml'da bor)
DEMO_ALLOW_RESET=True         # (yaml'da bor)
DEMO_PASSWORD=demo1234        # public demo paroli
DEMO_ADMIN_USERNAME=owner     # (yaml'da bor)
DEMO_ADMIN_PASSWORD=<kuchli>  # yashirin owner (siz to'liq yozuv huquqi bilan)
DEMO_RESET_SECRET=<tasodifiy> # avto-reset uchun
TELEGRAM_BOT_TOKEN=...        # CRM boti tokeni (webhook — TEGILMAYDI)
```

### Demo qanday ishlaydi
- **Public demo login:** `demo_director` / `demo_teacher` / `demo_cashier` — parol `DEMO_PASSWORD`. Faqat **ko'rish** (har qanday o'zgartirish "Demo rejimida — o'chirilgan" deb rad etiladi).
- **Yashirin owner:** `owner` / `DEMO_ADMIN_PASSWORD` — to'liq yozuv (siz uchun).
- **Bot webhook tegilmagan** — CRM boti normal ishlaydi.

### Avto-reset (bepul tier)
Render bepul tierda cron yo'q. GitHub Actions ishlatiladi (`.github/workflows/demo-reset.yml` tayyor):
1. CRM repo → Settings → Secrets:
   - `DEMO_RESET_URL` = `https://crm.fazo.uz/api/v1/demo/reset/`
   - `DEMO_RESET_SECRET` = Render'dagi bilan bir xil qiymat
2. Har 6 soatda demo ma'lumotlar seed holatiga qaytadi.

> Render **paid** tierда bo'lsangiz — `render.yaml` ga `type: cron` service qo'shsa ham bo'ladi.

---

## 5. Subdomenlar (DNS)

| Subdomen | Yo'naltirish |
|---|---|
| `fazo.uz`, `www.fazo.uz` | Netlify (fazo sayti) |
| `mudarris.fazo.uz` | Netlify (mudarris landing) |
| `crm.fazo.uz` | Render (CRM demo) |

Render'da: `crm.fazo.uz` ni custom domain qo'shing; `ALLOWED_HOSTS` va `CSRF_TRUSTED_ORIGINS`ga qo'shing (render.yaml'da namuna bor).

---

## Xavfsizlik eslatmalari
- `env`, `.env.local` — **hech qachon commit qilinmaydi** (gitignore'da).
- Bot token CRM webhook bilan **birga ishlatiladi** — fazo faqat `sendMessage` qiladi, `setWebhook`/`getUpdates` GA TEGMAYDI.
- Deploy'dan keyin barcha default parollarni almashtiring.

## Lokal ishga tushirish (dev)
```
# Fazo (lokal Mongo bilan)
cd frontend
node scripts/dev-mongo.mjs &   # lokal MongoDB (test uchun)
npm run seed                    # kontentni to'ldirish
npm run dev                     # http://localhost:3000

# CRM (lokal)
cd fazo_kurs_crm
python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
