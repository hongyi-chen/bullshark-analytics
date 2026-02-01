# Bullshark Analytics 🦈
https://bullsharks.online/

A lightweight public dashboard that visualizes Bullsharks running activity.

This repo is **frontend + serverless API only**:
- The source-of-truth activities come from the Bullsharks backend server (Cloud Run).
- This Next.js app calls that backend from server-side API routes, then computes summary stats + timeseries for the UI.

## Views
- **Dashboard**: activity leaderboard, highlights, and latest runs.
- **Teams**: team comparison and weekly/running totals.
- **Training Volume**: athlete training data with search and filters.
- **Injury Insights (Beta)**: per-athlete volume trends and risk weeks.
- **Weekly Winners**: weekly leaderboard with streaks.

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
  - The app calls `${BASE_SERVER_URL}/activities/{week|month}`, `${BASE_SERVER_URL}/athletes`,
    `${BASE_SERVER_URL}/athletes/training_data`, `${BASE_SERVER_URL}/team_stats`, and `${BASE_SERVER_URL}/read` (legacy)

Optional:
- `APP_BASE_URL` (used for generating absolute URLs in metadata/social cards)
- Strava-related keys are only required if you run the backend yourself

## Local dev
```sh
npm install
npm run dev
```

Open:
- App: `http://localhost:3000/` (tabs for Dashboard, Teams, Training Volume, Injury Insights, Weekly Winners)

## API (used by the dashboard)
- `GET /api/activities/week` → returns activities for the current week
- `GET /api/activities/month` → returns activities for the current month
- `GET /api/athletes` → athlete metadata (teams/events/status chips)
- `GET /api/athletes/training_data` → training volume + risk weeks used by Training/Injury tabs
- `GET /api/team_stats` → team summary stats used by the Teams tab
- `GET /api/club/stats?mode=week|days&days=1..365` → legacy summary stats
- `GET /api/club/timeseries?days=1..365` → legacy per-day/athlete totals
- `GET /api/club/latest?limit=1..50` → legacy latest runs
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
