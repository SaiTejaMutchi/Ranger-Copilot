# Ranger Copilot – Local-Only Setup

Run the backend (Convex) and auth **fully locally**—no Convex account or cloud required.

## 1. Configure `.env`

Ensure your `.env` contains:

```bash
# Convex local backend (port 3210)
VITE_CONVEX_URL=http://127.0.0.1:3210

# Convex Auth (required for auth.config.ts)
CONVEX_SITE_URL=http://127.0.0.1:3211
VITE_CONVEX_SITE_URL=http://127.0.0.1:3211

# Force local deployment (no Convex account needed)
CONVEX_DEPLOYMENT=anonymous:anonymous-Ranger Copilot
```

Or copy from the template:

```bash
cp .env.example .env
# Then add your OPENAI_API_KEY and ELEVENLABS_API_KEY if using AI features
```

## 2. Run Backend + Auth

**Terminal 1** – Start Convex backend and auth locally:

```bash
npm run dev:local
```

Or directly:

```bash
npx convex dev --local
```

This will:

- Start the Convex backend on **http://127.0.0.1:3210**
- Expose Convex Auth HTTP routes
- Use local storage in `~/.convex/` (no cloud)
- Watch for changes and push functions

## 3. Run Frontend

**Terminal 2** – Start the Vite dev server:

```bash
npm run dev
```

Open **http://localhost:5173** (or the port Vite shows).

## Summary

| Service           | URL                    | Port |
|-------------------|------------------------|------|
| Convex backend    | http://127.0.0.1:3210  | 3210 |
| Convex site/dash  | http://127.0.0.1:3211  | 3211 |
| Frontend (Vite)   | http://localhost:5173  | 5173 |

## Troubleshooting

- **`AuthProviderDiscoveryFailed`** – Ensure `CONVEX_SITE_URL` is set to `http://127.0.0.1:3211` (or `http://localhost:3211`).
- **Frontend can't reach Convex** – Confirm `VITE_CONVEX_URL` is `http://127.0.0.1:3210`.
- **Fresh start** – Delete `~/.convex/` and run `npx convex dev --local` again.
- **Switching to cloud** – Run `npx convex dev --configure` and pick a cloud deployment, then update `.env` with the new URLs.
