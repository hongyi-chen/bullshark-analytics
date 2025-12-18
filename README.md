# Bullshark Analytics 🦈
A lightweight Strava club dashboard that polls the Strava **club activities feed** with a single “service account”, stores the results, and serves a public dashboard.

This is intentionally a **club-feed MVP**:
- Only one person (the service account) needs to connect to Strava.
- The data you can compute depends on what the club feed exposes (visibility rules apply).
- **Activity timestamps are not guaranteed** from the club feed, so time-based charts are currently bucketed by when the backend first *observed* an activity.

## Tech stack
- Next.js (App Router)
- Prisma (Postgres via Neon/Vercel)
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
- `APP_BASE_URL` (must be a full URL including scheme, e.g. `http://localhost:3000` or `https://bullshark-analytics.vercel.app`)
- `APP_ENCRYPTION_KEY` (32-byte base64)
- `DATABASE_URL` (Postgres connection string)

Set after the one-time OAuth step:
- `STRAVA_SERVICE_ATHLETE_ID` (the returned `athleteId`)

Recommended (especially in production):
- `JOBS_RUNNER_SECRET` (protects the poll endpoint)

### 3) Initialize DB
You need a Postgres DB (local Postgres or Neon).

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
- `GET /api/cron/club-poll`
- `POST /api/cron/club-poll`

Query params:
- `pages` (default `3`, max `100`)
- `perPage` (default `30`, max `200`)

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

Example (prod, manual trigger):
```sh
curl -s -X POST "https://bullshark-analytics.vercel.app/api/cron/club-poll?secret=$JOBS_RUNNER_SECRET&pages=20&perPage=200"
```

## API
Public analytics endpoints used by the dashboard:
- `GET /api/club/stats?days=30`
- `GET /api/club/timeseries?days=30`

Health:
- `GET /api/health`

### Public “Refresh data” button
The homepage includes a "Refresh data" button that triggers a lightweight server-side poll without exposing secrets.
- `POST /api/public/refresh`
- Rate limited with a DB-backed cooldown (currently 10 minutes).

## Deploying (Vercel)
High-level steps:
1) Create a Vercel project from this GitHub repo.
2) Create a Neon/Vercel Postgres database and set `DATABASE_URL` in Vercel env.
3) Set `APP_BASE_URL` to your canonical domain (must include `https://`), e.g.
   - `APP_BASE_URL=https://bullshark-analytics.vercel.app`
4) Ensure your Strava app settings match:
   - Website: `https://bullshark-analytics.vercel.app`
   - Authorization Callback Domain: `bullshark-analytics.vercel.app`
5) Deploy.
   - This repo runs `prisma migrate deploy` during the Vercel build.
6) One-time: connect the service account on the production domain:
   - Visit `https://bullshark-analytics.vercel.app/api/auth/strava/start`
   - After approving, set `STRAVA_SERVICE_ATHLETE_ID` to the returned `athleteId` in Vercel env.

### Cron scheduling
This repo includes `vercel.json` cron configuration.
- On Vercel **Hobby**, cron jobs are limited to **daily** schedules.
- On Vercel **Pro**, you can use e.g. `*/15 * * * *`.

The cron should invoke:
- `POST https://bullshark-analytics.vercel.app/api/cron/club-poll?secret=<JOBS_RUNNER_SECRET>`

## Notes / limitations
- Club feed responses may not include stable activity IDs or timestamps. This means:
  - Deduping is best-effort.
  - “Per-day” charts are based on `fetchedAt` (when the backend first saw an activity), not necessarily the activity’s true start date.
- If you want accurate per-activity timestamps and stable IDs, you generally need athlete-scoped OAuth (i.e. members authorize your app).
