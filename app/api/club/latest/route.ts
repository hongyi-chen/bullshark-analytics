import { NextRequest, NextResponse } from 'next/server';
import { fetchActivities } from '@/lib/server-api';
import { isRun } from '@/app/utils/activityUtils';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? '10'), 1), 50);

  try {
    const activities = await fetchActivities();

    // Filter for runs with athlete names, sort by date descending
    const runs = activities
      .filter((a) => isRun(a.sport_type) && a.athlete_name)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
      .map((r) => ({
        athleteName: r.athlete_name,
        km: r.distance / 1000,
        activityName: r.name || 'Run',
        fetchedAt: r.date, // Using activity date instead of fetchedAt
      }));

    const lastPoll = runs.length > 0 ? runs[0].fetchedAt : null;

    return NextResponse.json({
      ok: true,
      lastPoll,
      runs,
    });
  } catch (err: unknown) {
    console.error('Failed to fetch activities from server:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch activities from server' },
      { status: 502 }
    );
  }
}
