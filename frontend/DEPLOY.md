# Deploy FAZO to Netlify

## 1. Prepare for Deploy (Already Done)

- ✅ `netlify.toml` — Build config and Node 18
- ✅ Middleware updated for Netlify paths
- ✅ Build tested locally (`npm run build`)

## 2. Environment Variables

Set these in Netlify **before** deploying (for the contact form Telegram integration):

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token |
| `TELEGRAM_ADMIN_IDS` | Comma-separated Telegram admin chat IDs |

Example:

```env
TELEGRAM_ADMIN_IDS=123456789,987654321
```

**Where to set:** Netlify Dashboard → Site → Site configuration → Environment variables

## 3. Deploy Options

### Option A: Deploy via Git (Recommended)

1. Push your code to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [app.netlify.com](https://app.netlify.com) and sign in.
3. Click **Add new site** → **Import an existing project**.
4. Connect your Git provider and select the FAZO repository.
5. Netlify will auto-detect Next.js. Confirm:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` (or leave empty — Netlify auto-detects)
   - **Base directory:** (leave empty unless your app is in a subfolder)
6. Add environment variables (see above).
7. Click **Deploy site**.

Future pushes to your main branch will trigger automatic deploys.

---

### Option B: Deploy via Netlify CLI

1. Install the CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Log in:
   ```bash
   netlify login
   ```

3. From your project root:
   ```bash
   npm run build
   netlify deploy --prod
   ```

4. For first-time setup, run:
   ```bash
   netlify init
   ```
   Follow the prompts to connect a Git repo or create a new site.

---

### Option C: Manual Deploy (Drag & Drop)

1. Build locally:
   ```bash
   npm run build
   ```

2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Deploy manually**.

3. Drag the **`.next`** folder into the deploy zone.

   > **Note:** Manual deploy is limited for Next.js (no SSR, API routes may not work). Prefer Git or CLI for full functionality.

## 4. Custom Domain (Optional)

1. Netlify Dashboard → Site → **Domain management**.
2. Add your custom domain.
3. Follow Netlify’s DNS instructions.

## 5. Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Failed publishing static content"** | In Netlify UI: Site configuration → Build & deploy → Build settings → **clear** the "Publish directory" field (leave empty). The `netlify.toml` uses `.next` and must not be an absolute/Windows path. |
| Build fails | Check `npm run build` locally. Ensure Node 18+ (`npm install`). |
| Contact form not sending | Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_IDS` in Netlify env vars. Make sure each admin has started a chat with the bot and IDs are comma-separated. |
| 404 on locale routes | Middleware should handle `/uz`, `/en`, `/ru`. Verify `netlify.toml` and middleware. |
