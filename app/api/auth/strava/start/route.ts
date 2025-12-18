import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

// Uses Node crypto; must not run on the Edge runtime.
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const e = env();

  const state = crypto.randomBytes(16).toString('base64url');
  const redirectUri = `${e.APP_BASE_URL}/api/auth/strava/callback`;

  const url = new URL('https://www.strava.com/oauth/authorize');
  url.searchParams.set('client_id', e.STRAVA_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('approval_prompt', 'auto');
  url.searchParams.set('scope', 'read,activity:read_all');
  url.searchParams.set('state', state);

  const res = NextResponse.redirect(url.toString());
  res.cookies.set('strava_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: e.APP_BASE_URL.startsWith('https://'),
    path: '/',
    maxAge: 10 * 60,
  });

  return res;
}
