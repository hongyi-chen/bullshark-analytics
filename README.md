# Bullshark Analytics 🦈
A lightweight Strava club dashboard that polls the Strava **club activities feed** with a single “service account”, stores the results, and serves a public dashboard.

This is intentionally a **club-feed MVP**:
- Only one person (the service account) needs to connect to Strava.
- The data you can compute depends on what the club feed exposes (visibility rules apply).
- **Activity timestamps are not guaranteed** from the club feed, so time-based charts are currently bucketed by when the backend first *observed* an activity.

## Tech stack
- Next.js (App Router)
- Prisma (SQLite for local dev)
- Recharts (charts)

## Local setup
### 1) Install deps
```sh
npm install
```

### 2) Configure env
Copy `.env.example` to `.env` and fill values.

Required:
- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_CLUB_ID` (e.g. `1318168`)
- `STRAVA_SERVICE_ATHLETE_ID` (set after the one-time OAuth step)
- `APP_BASE_URL` (e.g. `http://localhost:3000`)
- `APP_ENCRYPTION_KEY` (32-byte base64)
- `DATABASE_URL` (default uses local sqlite)

Recommended (especially in production):
- `JOBS_RUNNER_SECRET` (protects the poll endpoint)

### 3) Initialize DB
```sh
npx prisma migrate dev
```

### 4) Run dev server
```sh
npm run dev
```

Open:
- Dashboard: `http://localhost:3000/`

## One-time: connect the service account
1) Make sure the Strava athlete you’ll use is a member of the club.
2) Visit:
- `http://localhost:3000/api/auth/strava/start`
3) After approving, you’ll see an `athleteId` in the response.
4) Put that value into `.env` as:
- `STRAVA_SERVICE_ATHLETE_ID=<athleteId>`
5) Restart `npm run dev`.

## Polling (club feed)
Poll endpoint:
- `POST /api/cron/club-poll`

Local dev auth behavior:
- If you’re running with `APP_BASE_URL` pointing at `localhost`, the endpoint is callable without a secret.

Production auth behavior:
- Recommended: set `JOBS_RUNNER_SECRET` and call with either:
  - `Authorization: Bearer <JOBS_RUNNER_SECRET>`
  - or `?secret=<JOBS_RUNNER_SECRET>`

Example (local):
```sh
curl -s -X POST "http://localhost:3000/api/cron/club-poll?pages=10&perPage=30"
```

## API
Public analytics endpoints used by the dashboard:
- `GET /api/club/stats?days=30`
- `GET /api/club/timeseries?days=30`

Health:
- `GET /api/health`

## Deploying (Vercel)
High-level steps:
1) Deploy the Next.js project to Vercel.
2) Use a hosted DB (recommended) instead of local SQLite.
3) Configure environment variables in Vercel.
4) Set up a Vercel Cron (every 15 minutes) to call:
   - `POST https://<your-domain>/api/cron/club-poll?secret=<JOBS_RUNNER_SECRET>`

## Notes / limitations
- Club feed responses may not include stable activity IDs or timestamps. This means:
  - Deduping is best-effort.
  - “Per-day” charts are based on `fetchedAt` (when the backend first saw an activity), not necessarily the activity’s true start date.
- If you want accurate per-activity timestamps and stable IDs, you generally need athlete-scoped OAuth (i.e. members authorize your app).
