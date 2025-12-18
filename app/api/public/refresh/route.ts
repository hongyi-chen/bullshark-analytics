import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

const STATE_ID = 'public';
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

export async function POST() {
  const now = new Date();

  // DB-backed cooldown so this can't be spammed too hard.
  const state = await db.publicRefreshState.upsert({
    where: { id: STATE_ID },
    create: { id: STATE_ID, lastTriggeredAt: now },
    update: {},
  });

  if (state.lastTriggeredAt) {
    const diff = now.getTime() - new Date(state.lastTriggeredAt).getTime();
    if (diff < COOLDOWN_MS) {
      const retryAfterSeconds = Math.ceil((COOLDOWN_MS - diff) / 1000);
      return NextResponse.json(
        {
          ok: false,
          error: 'Refresh is on cooldown. Please try again later.',
          retryAfterSeconds,
          lastTriggeredAt: state.lastTriggeredAt,
        },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
      );
    }
  }

  // Record the trigger before polling so concurrent callers won't all poll.
  await db.publicRefreshState.update({
    where: { id: STATE_ID },
    data: { lastTriggeredAt: now },
  });

  const e = env();
  if (!e.JOBS_RUNNER_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'Server is not configured with JOBS_RUNNER_SECRET.' },
      { status: 500 },
    );
  }

  // Keep it relatively lightweight for a public button.
  const pollUrl = new URL(`${e.APP_BASE_URL}/api/cron/club-poll`);
  pollUrl.searchParams.set('pages', '3');
  pollUrl.searchParams.set('perPage', '50');

  const res = await fetch(pollUrl.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${e.JOBS_RUNNER_SECRET}`,
    },
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }

  if (!res.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Poll failed',
        status: res.status,
        body,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, triggeredAt: now.toISOString(), result: body });
}
