# Bullshark Analytics 🦈
https://bullsharks.online/

A lightweight public dashboard that visualizes Bullsharks running activity.

This repo is **frontend + serverless API only**:
- The source-of-truth activities come from the Bullsharks backend server (Cloud Run).
- This Next.js app calls that backend from server-side API routes, then computes summary stats + timeseries for the UI.

## Documentation
For details on the backend server API endpoints, see the [Server API Documentation](https://github.com/BraydenRoyston/bullsharks.online/blob/main/docs/API_DOCUMENTATION.md).

## Tech stack
- Next.js (App Router)
- Jotai (global state)
- Recharts (charts)

## Environment variables
Copy `.env.example` to `.env` and fill values.

Required:
- `BASE_SERVER_URL` (base URL of the Bullsharks backend, no trailing slash; endpoints are appended by the app)
  - The app calls `${BASE_SERVER_URL}/activities/{week|month}` and `${BASE_SERVER_URL}/read` (legacy)

Optional:
- `APP_BASE_URL` (used for generating absolute URLs in metadata/social cards)
- Strava-related keys are only required if you run the backend yourself

## Local dev
```sh
npm install
npm run dev
```

Open:
- Dashboard: `http://localhost:3000/`

## API (used by the dashboard)
- `GET /api/activities/week` → returns activities for the current week
- `GET /api/activities/month` → returns activities for the current month
- `GET /api/club/stats`, `GET /api/club/timeseries`, `GET /api/club/latest` remain for legacy views
- `GET /api/health`

## Deploying (Vercel)
1) Create a Vercel project from this repo.
2) Set Vercel env:
   - `BASE_SERVER_URL=https://bullsharks-server-288102886042.us-central1.run.app`
   - (optional) `APP_BASE_URL=https://your-app.vercel.app`
3) Deploy.

## Troubleshooting
- **500 with** `Invalid environment configuration: BASE_SERVER_URL: Invalid url`
  - Ensure `BASE_SERVER_URL` includes `https://` and does not include a trailing slash.
- Status chips:
  - "ran today" → user ran today
  - "recent" → last run within the past 3 days
  - "inactive" → no runs in the past 4+ days
