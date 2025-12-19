# Bullshark Analytics 🦈
A lightweight public dashboard that visualizes Bullsharks running activity.

This repo is **frontend + serverless API only**:
- The source-of-truth activities come from the Bullsharks backend server (Cloud Run).
- This Next.js app calls that backend from server-side API routes, then computes summary stats + timeseries for the UI.

## Tech stack
- Next.js (App Router)
- Recharts (charts)

## Environment variables
Copy `.env.example` to `.env` and fill values.

Required:
- `SERVER_ACTIVITIES_URL` (the backend “read” endpoint, e.g. `https://…run.app/read`)

Optional:
- `APP_BASE_URL` (used for generating absolute URLs in metadata/social cards)

## Local dev
```sh
npm install
npm run dev
```

Open:
- Dashboard: `http://localhost:3000/`

## API (used by the dashboard)
- `GET /api/club/stats?days=30` (or `mode=week`)
- `GET /api/club/timeseries?days=30`
- `GET /api/club/latest?limit=8`
- `GET /api/health`

## Deploying (Vercel)
1) Create a Vercel project from this repo.
2) Set Vercel env:
   - `SERVER_ACTIVITIES_URL=https://…run.app/read`
   - (optional) `APP_BASE_URL=https://your-app.vercel.app`
3) Deploy.

## Troubleshooting
- **500 with** `Invalid environment configuration: SERVER_ACTIVITIES_URL: Invalid url`
  - Ensure `SERVER_ACTIVITIES_URL` includes `https://` and the full `/read` path.
