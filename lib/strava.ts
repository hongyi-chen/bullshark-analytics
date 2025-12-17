import { env } from './env';

const STRAVA_OAUTH_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

export type StravaTokenExchange = {
  token_type: 'Bearer';
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch seconds
  expires_in: number;
  athlete: {
    id: number;
    firstname?: string;
    lastname?: string;
  };
  scope?: string;
};

function formBody(data: Record<string, string | number>): URLSearchParams {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) body.set(k, String(v));
  return body;
}

export async function exchangeAuthorizationCode(code: string): Promise<StravaTokenExchange> {
  const e = env();

  const res = await fetch(STRAVA_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody({
      client_id: e.STRAVA_CLIENT_ID,
      client_secret: e.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    throw new Error(`Strava token exchange failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as StravaTokenExchange;
}

export async function refreshAccessToken(refreshToken: string): Promise<StravaTokenExchange> {
  const e = env();

  const res = await fetch(STRAVA_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody({
      client_id: e.STRAVA_CLIENT_ID,
      client_secret: e.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    throw new Error(`Strava token refresh failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as StravaTokenExchange;
}

export type StravaClubActivity = {
  athlete?: { firstname?: string; lastname?: string };
  name?: string;
  distance?: number;
  moving_time?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  type?: string;
  sport_type?: string;
  workout_type?: number;
  // Some Strava responses include additional fields; keep flexible
  [k: string]: unknown;
};

export async function listClubActivities(
  accessToken: string,
  clubId: string,
  opts: { page?: number; perPage?: number },
): Promise<StravaClubActivity[]> {
  const url = new URL(`${STRAVA_API_BASE}/clubs/${clubId}/activities`);
  url.searchParams.set('page', String(opts.page ?? 1));
  url.searchParams.set('per_page', String(opts.perPage ?? 30));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Strava list club activities failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as StravaClubActivity[];
}
