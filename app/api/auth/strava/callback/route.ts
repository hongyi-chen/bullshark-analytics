import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { encryptString } from '@/lib/crypto';
import { db } from '@/lib/db';
import { exchangeAuthorizationCode } from '@/lib/strava';

// Uses Prisma; must not run on the Edge runtime.
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const e = env();
  const url = new URL(req.url);

  const error = url.searchParams.get('error');
  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const stateCookie = req.cookies.get('strava_oauth_state')?.value;
  if (!code || !state || !stateCookie || stateCookie !== state) {
    return NextResponse.json({ ok: false, error: 'Invalid OAuth state or missing code' }, { status: 400 });
  }

  const token = await exchangeAuthorizationCode(code);
  const athleteId = String(token.athlete.id);

  await db.athlete.upsert({
    where: { id: athleteId },
    create: {
      id: athleteId,
      firstname: token.athlete.firstname ?? null,
      lastname: token.athlete.lastname ?? null,
      revokedAt: null,
    },
    update: {
      firstname: token.athlete.firstname ?? null,
      lastname: token.athlete.lastname ?? null,
      revokedAt: null,
    },
  });

  await db.athleteToken.upsert({
    where: { athleteId },
    create: {
      athleteId,
      refreshTokenEnc: encryptString(token.refresh_token, e.APP_ENCRYPTION_KEY),
      accessTokenEnc: encryptString(token.access_token, e.APP_ENCRYPTION_KEY),
      expiresAt: token.expires_at,
      scope: token.scope ?? null,
    },
    update: {
      refreshTokenEnc: encryptString(token.refresh_token, e.APP_ENCRYPTION_KEY),
      accessTokenEnc: encryptString(token.access_token, e.APP_ENCRYPTION_KEY),
      expiresAt: token.expires_at,
      scope: token.scope ?? null,
    },
  });

  const res = NextResponse.json({
    ok: true,
    athleteId,
    message: 'Service account connected. Set STRAVA_SERVICE_ATHLETE_ID to this athleteId.',
  });
  res.cookies.set('strava_oauth_state', '', { path: '/', maxAge: 0 });
  return res;
}
