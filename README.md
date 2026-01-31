# Bullshark Analytics 🦈
https://bullsharks.online/

A lightweight public dashboard that visualizes Bullsharks running activity.

This repo is **frontend + serverless API only**:
- The source-of-truth data comes from the Bullsharks backend server (Cloud Run).
- This Next.js app calls that backend from server-side API routes, then computes summary stats, leaderboards, and timeseries for the UI.

## What’s in the UI
The app is a single-page dashboard with multiple views:
- **Dashboard**: club totals, highlights, recent runs, and leaderboards
- **Teams**: Bulls vs Sharks comparison + athlete breakdowns
- **Training Volume**: per-athlete weekly mileage trends
- **Injury Insights (Beta)**: volume risk highlights and warnings
- **Weekly Winners**: weekly leaderboard + streaks

## Architecture at a glance
1. UI uses **Jotai** atoms + hooks to request data.
2. Client hooks call **App Router API routes** in `/app/api`.
3. API routes proxy the Bullsharks backend (`BASE_SERVER_URL`) and return JSON.
4. Client derives stats/timeseries for charts and leaderboards.

The client uses a lightweight in-memory cache (60s TTL) to smooth navigation.

## Tech stack
- Next.js (App Router)
- React
- Jotai (global state)
- Recharts (charts)
- date-fns (date utilities)
- zod (env validation)

## Environment variables
Copy `.env.example` to `.env` and fill values.

Required:
- `BASE_SERVER_URL` (base URL of the Bullsharks backend, **no trailing slash**)

Optional:
- `APP_BASE_URL` (used for generating absolute URLs in metadata/social cards)

## Local dev
```sh
npm install
npm run dev
```

Open:
- Dashboard: `http://localhost:3000/`

## App API routes
These are the routes used by the UI. They proxy the backend and normalize data:
- `GET /api/activities/week`
- `GET /api/activities/month`
- `GET /api/athletes`
- `GET /api/athletes/training_data`
- `GET /api/team_stats`
- `GET /api/club/stats` (legacy)
- `GET /api/club/timeseries` (legacy)
- `GET /api/club/latest` (legacy)
- `GET /api/health`

## Backend endpoints used
These are called by the serverless API layer:
- `${BASE_SERVER_URL}/activities/{week|month}`
- `${BASE_SERVER_URL}/read` (legacy activities)
- `${BASE_SERVER_URL}/athletes`
- `${BASE_SERVER_URL}/athletes/training_data`
- `${BASE_SERVER_URL}/team_stats`

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
