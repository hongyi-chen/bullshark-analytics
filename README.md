# Bullshark Analytics 🦈
https://bullsharks.online/

A lightweight public dashboard that visualizes Bullsharks' running activity across
multiple views (teams, training volume, injury insights, and weekly winners).

This repo is **frontend and serverless API only**:
- The source-of-truth activities come from the Bullsharks backend server (Cloud Run).
- This Next.js app calls that backend from server-side API routes, then computes summary stats and time series for the UI.

## Views
- Dashboard: club highlights, recent runs, and activity trends.
- Teams: Bulls vs Sharks comparisons and leaderboards.
- Training Volume: weekly kilometers by athlete with search and filters.
- Injury Insights (Beta): per-athlete training load and risky week markers.
- Weekly Winners: a per-week leaderboard and streaks.

## Documentation
For details on the backend server API endpoints, see the [Server API Documentation](https://github.com/BraydenRoyston/bullsharks.online/blob/main/docs/API_DOCUMENTATION.md).

## Tech stack
- Next.js (App Router)
- Jotai (global state)
- Recharts (charts)

## Environment variables
Copy `.env.example` to `.env` and fill in the values.

Required:
- `BASE_SERVER_URL` (base URL of the Bullsharks backend, no trailing slash; endpoints are appended by the app)
  - The app calls:
    - `${BASE_SERVER_URL}/activities/{week|month}`
    - `${BASE_SERVER_URL}/read` (legacy: club stats/timeseries/latest)
    - `${BASE_SERVER_URL}/athletes`
    - `${BASE_SERVER_URL}/athletes/training_data`
    - `${BASE_SERVER_URL}/team_stats`

Optional:
- `APP_BASE_URL` (used for generating absolute URLs in metadata/social cards)

## Local dev
```sh
npm install
npm run dev
```

Open the dashboard at:
- `http://localhost:3000/`

## API (used by the dashboard)
- `GET /api/activities/week` → returns activities for the current week
- `GET /api/activities/month` → returns activities for the current month
- `GET /api/athletes` → athlete metadata (team/event labels)
- `GET /api/athletes/training_data` → training volume + injury risk data
- `GET /api/team_stats` → team aggregates for Bulls vs Sharks
- `GET /api/club/stats?mode=days|week&days=30` → aggregated club stats (legacy)
- `GET /api/club/timeseries?days=30` → daily kilometers per athlete (legacy)
- `GET /api/club/latest?limit=10` → latest runs (legacy)
- `GET /api/health`

## Deploying (Vercel)
1) Create a Vercel project from this repo.
2) Set Vercel environment variables:
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
