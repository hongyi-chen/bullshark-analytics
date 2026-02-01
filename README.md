# Bullshark Analytics 🦈

https://bullsharks.online/

A lightweight public dashboard that visualizes the Bullsharks running club's activity data. The app provides multiple views for tracking team performance, individual training volume, injury risk indicators, and weekly leaderboards.

## Overview

This repository contains the **frontend and serverless API layer only**. Activity data is sourced from a separate Bullsharks backend server (hosted on Google Cloud Run). This Next.js application fetches data from that backend via server-side API routes, computes summary statistics and time series, and then renders interactive charts and leaderboards.

### Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Next.js App (this repo)                     │
├─────────────────────────────────────────────────────────────────────┤
│  Browser (React Client)                                             │
│  ├── Jotai atoms for global state                                   │
│  ├── Custom hooks (useActivities, useAthletes, useTeamStats, etc.)  │
│  └── React components with Recharts visualizations                  │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (/api/*)                                        │
│  └── Proxy requests to backend, compute derived stats               │
├─────────────────────────────────────────────────────────────────────┤
│  lib/server-api.ts                                                  │
│  └── Server-side functions to fetch from backend                    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│              Bullsharks Backend Server (Cloud Run)                  │
│              └── Source of truth for Strava activities              │
└─────────────────────────────────────────────────────────────────────┘
```

## Views

The app is a single-page application with tab-based navigation. Each tab renders a different view:

| Tab | Description |
|-----|-------------|
| **Dashboard** | Club highlights, leaderboards by total distance, activity trends (daily/weekly), runs per athlete chart, and latest runs feed |
| **Teams** | Bulls vs Sharks team comparison with running totals or weekly breakdown charts, plus per-team leaderboards |
| **Training Volume** | Weekly kilometers chart for each athlete with search and filters (by event type and team) |
| **Injury Insights (Beta)** | Per-athlete training load visualization with risky week markers based on training load analysis |
| **Weekly Winners** | Week-by-week leaderboard with streak tracking for top performers |

## Project Structure

```
app/
├── api/                    # Next.js API routes (serverless functions)
│   ├── activities/[period]/route.ts   # Fetch activities for week/month
│   ├── athletes/route.ts              # Athlete metadata
│   ├── team_stats/route.ts            # Team aggregates
│   └── ...
├── ui/                     # React components organized by feature
│   ├── common/             # Shared components (Card, Header, Footer, LeaderboardCard)
│   ├── dashboard/          # Dashboard view components
│   ├── team/               # Teams view components
│   ├── training/           # Training Volume view components
│   ├── injury-insights/    # Injury Insights view components
│   └── weekly-winners/     # Weekly Winners view components
├── utils/                  # Utility functions (formatting, styling)
├── page.tsx                # Main page (renders Header + MainContent + Footer)
└── layout.tsx              # Root layout with JotaiProvider

lib/
├── hooks/                  # Custom React hooks for data fetching
│   ├── useActivities.ts    # Fetch and cache activities
│   ├── useAthletes.ts      # Fetch athlete metadata
│   ├── useTeamStats.ts     # Fetch team statistics
│   └── ...
├── state/
│   ├── atoms.ts            # Jotai atoms for global state management
│   └── api.ts              # Client-side API fetching with caching
├── providers/
│   └── JotaiProvider.tsx   # Jotai context provider
├── types/
│   └── dashboard.ts        # TypeScript type definitions
├── server-api.ts           # Server-side API functions
└── env.ts                  # Environment variable validation (Zod)
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** (App Router) | React framework with server-side rendering and API routes |
| **React 19** | UI component library |
| **Jotai** | Lightweight atomic state management |
| **Recharts** | Composable charting library for React |
| **date-fns** | Date utility functions |
| **Zod** | Runtime schema validation (for env vars) |
| **SCSS Modules** | Scoped component styling |
| **Vercel Analytics** | Performance and usage analytics |

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

### Required

| Variable | Description |
|----------|-------------|
| `BASE_SERVER_URL` | Base URL of the Bullsharks backend (no trailing slash). The app appends endpoints like `/activities/week`, `/athletes`, etc. |

### Optional

| Variable | Description |
|----------|-------------|
| `APP_BASE_URL` | Used for generating absolute URLs in metadata and social cards |

### Backend Endpoints Called

The app calls these endpoints on the backend server:
- `${BASE_SERVER_URL}/activities/{week|month}` — Activity data for a given time period
- `${BASE_SERVER_URL}/read` — Legacy endpoint for club stats/timeseries
- `${BASE_SERVER_URL}/athletes` — Athlete metadata (team, event)
- `${BASE_SERVER_URL}/athletes/training_data` — Training volume and injury risk data
- `${BASE_SERVER_URL}/team_stats` — Team aggregates for Bulls vs Sharks

## Local Development

```sh
npm install
npm run dev
```

Open the dashboard at http://localhost:3000/

## API Routes

These Next.js API routes are used by the frontend:

| Endpoint | Description |
|----------|-------------|
| `GET /api/activities/week` | Activities for the current week |
| `GET /api/activities/month` | Activities for the current month |
| `GET /api/athletes` | Athlete metadata (team/event labels) |
| `GET /api/athletes/training_data` | Training volume + injury risk data |
| `GET /api/team_stats` | Team aggregates for Bulls vs Sharks |
| `GET /api/club/stats` | Aggregated club stats (legacy) |
| `GET /api/club/timeseries` | Daily kilometers per athlete (legacy) |
| `GET /api/club/latest` | Latest runs (legacy) |
| `GET /api/health` | Health check endpoint |

## Deployment (Vercel)

1. Create a Vercel project from this repository.
2. Set the environment variables:
   - `BASE_SERVER_URL=https://bullsharks-server-288102886042.us-central1.run.app`
   - (optional) `APP_BASE_URL=https://your-app.vercel.app`
3. Deploy.

## Key Concepts

### Athletes
Each athlete belongs to a **team** (Bulls or Sharks) and is registered for an **event** (Half Marathon or Full Marathon). This metadata is used for filtering and team-based comparisons.

### Activity Status Chips
Leaderboards display status chips indicating recent activity:
- **"ran today"** — The athlete ran today
- **"recent"** — The athlete's last run was within the past 3 days
- **"inactive"** — No runs in the past 4 or more days

### Training Risk Analysis
The Injury Insights view shows risky weeks based on training load patterns. Risk indicators help athletes identify potential overtraining.

## Documentation

For details on the backend server API endpoints, see the [Server API Documentation](https://github.com/BraydenRoyston/bullsharks.online/blob/main/docs/API_DOCUMENTATION.md).

## Troubleshooting

### 500 Error: `Invalid environment configuration: BASE_SERVER_URL: Invalid url`
Ensure `BASE_SERVER_URL`:
- Includes the protocol (`https://`)
- Does NOT include a trailing slash
