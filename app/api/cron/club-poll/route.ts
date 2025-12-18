import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { db } from '@/lib/db';
import { decryptString, encryptString } from '@/lib/crypto';
import { listClubActivities, refreshAccessToken, StravaClubActivity } from '@/lib/strava';

// Uses Prisma + Node crypto; must not run on the Edge runtime.
export const runtime = 'nodejs';

function isAuthorized(req: NextRequest): boolean {
  const e = env();

  // In production, require an auth mechanism.
  // In local dev, allow calling without a secret to keep iteration easy.
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd && e.APP_BASE_URL.includes('localhost')) return true;

  // If a secret is configured, allow either Authorization header or ?secret=...
  const secret = e.JOBS_RUNNER_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') ?? '';
    if (auth === `Bearer ${secret}`) return true;

    const url = new URL(req.url);
    if (url.searchParams.get('secret') === secret) return true;
  }

  // Optional: Vercel Cron sets a header on cron invocations.
  // If you rely on this, ensure the endpoint isn't otherwise publicly callable.
  if (req.headers.get('x-vercel-cron') === '1') return true;

  return false;
}

function safeStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  return typeof v === 'string' ? v : JSON.stringify(v);
}

function computeDedupeHash(a: StravaClubActivity): string {
  const athleteName = [a.athlete?.firstname, a.athlete?.lastname].filter(Boolean).join(' ').trim();
  const parts = [
    athleteName,
    a.name ?? '',
    a.type ?? '',
    a.sport_type ?? '',
    String(a.distance ?? ''),
    String(a.moving_time ?? ''),
    String(a.elapsed_time ?? ''),
    String(a.total_elevation_gain ?? ''),
    // Include any hidden id if Strava ever returns one
    safeStr((a as any).id ?? (a as any).activity_id ?? ''),
  ];

  return crypto.createHash('sha256').update(parts.join('|')).digest('hex');
}

async function getServiceAccessToken(): Promise<string> {
  const e = env();
  const athleteId = e.STRAVA_SERVICE_ATHLETE_ID;

  const tokenRow = await db.athleteToken.findUnique({ where: { athleteId } });
  if (!tokenRow) {
    throw new Error(
      `No token found for STRAVA_SERVICE_ATHLETE_ID=${athleteId}. First OAuth with /api/auth/strava/start, then set STRAVA_SERVICE_ATHLETE_ID to the returned athleteId.`,
    );
  }

  const refreshToken = decryptString(tokenRow.refreshTokenEnc, e.APP_ENCRYPTION_KEY);
  const nowEpoch = Math.floor(Date.now() / 1000);

  if (tokenRow.expiresAt && tokenRow.expiresAt > nowEpoch + 60 && tokenRow.accessTokenEnc) {
    return decryptString(tokenRow.accessTokenEnc, e.APP_ENCRYPTION_KEY);
  }

  const refreshed = await refreshAccessToken(refreshToken);

  await db.athleteToken.update({
    where: { athleteId },
    data: {
      refreshTokenEnc: encryptString(refreshed.refresh_token, e.APP_ENCRYPTION_KEY),
      accessTokenEnc: encryptString(refreshed.access_token, e.APP_ENCRYPTION_KEY),
      expiresAt: refreshed.expires_at,
      scope: refreshed.scope ?? tokenRow.scope,
    },
  });

  return refreshed.access_token;
}

async function runPoll(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const e = env();
  const url = new URL(req.url);
  const perPage = Math.min(Math.max(Number(url.searchParams.get('perPage') ?? '30'), 1), 200);
  const pages = Math.min(Math.max(Number(url.searchParams.get('pages') ?? '3'), 1), 20);

  const accessToken = await getServiceAccessToken();

  let fetched = 0;
  let inserted = 0;

  for (let page = 1; page <= pages; page++) {
    const activities = await listClubActivities(accessToken, e.STRAVA_CLUB_ID, { page, perPage });
    fetched += activities.length;
    if (!activities.length) break;

    for (const a of activities) {
      const athleteName = [a.athlete?.firstname, a.athlete?.lastname].filter(Boolean).join(' ').trim() || null;
      const dedupeHash = computeDedupeHash(a);

      try {
        await db.clubFeedActivity.create({
          data: {
            clubId: e.STRAVA_CLUB_ID,
            athleteName,
            name: a.name ?? null,
            type: (a.type as string | undefined) ?? null,
            sportType: (a.sport_type as string | undefined) ?? null,
            distanceM: typeof a.distance === 'number' ? a.distance : null,
            movingTimeS: typeof a.moving_time === 'number' ? a.moving_time : null,
            elapsedTimeS: typeof a.elapsed_time === 'number' ? a.elapsed_time : null,
            totalElevationGainM: typeof a.total_elevation_gain === 'number' ? a.total_elevation_gain : null,
            dedupeHash,
            raw: a as any,
          },
        });
        inserted++;
      } catch (err: any) {
        // Deduplicate
        if (err?.code !== 'P2002') throw err;
      }
    }

    // Heuristic: if we didn't insert anything on this page, older pages are likely already seen.
    // This keeps polling efficient.
    if (inserted === 0 && page >= 2) break;

    if (activities.length < perPage) break;
  }

  return NextResponse.json({ ok: true, clubId: e.STRAVA_CLUB_ID, fetched, inserted, perPage, pages });
}

// Vercel Cron (configured via vercel.json) invokes your endpoint with GET.
export async function GET(req: NextRequest) {
  return runPoll(req);
}

export async function POST(req: NextRequest) {
  return runPoll(req);
}
