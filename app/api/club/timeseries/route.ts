import { NextRequest, NextResponse } from 'next/server';
import { startOfDay } from 'date-fns';
import { fetchActivities } from '@/lib/server-api';
import { isRun } from '@/app/utils/activityUtils';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const days = Math.min(Math.max(Number(url.searchParams.get('days') ?? '30'), 1), 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const activities = await fetchActivities();

    // Filter for runs within the time period
    const runs = activities.filter((a) => {
      const activityDate = new Date(a.date);
      return isRun(a.sport_type) && activityDate >= since && a.athlete_name;
    });

    // Group by day and athlete
    const byDayAthlete = new Map<string, number>();

    for (const r of runs) {
      const activityDate = new Date(r.date);
      const day = startOfDay(activityDate).toISOString().slice(0, 10);
      const key = `${day}:${r.athlete_name}`;
      byDayAthlete.set(key, (byDayAthlete.get(key) ?? 0) + r.distance);
    }

    const points = Array.from(byDayAthlete.entries())
      .map(([key, meters]) => {
        const [day, athleteName] = key.split(':');
        return { day, athleteName, km: meters / 1000 };
      })
      .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : a.athleteName.localeCompare(b.athleteName)));

    return NextResponse.json({ ok: true, days, since: since.toISOString(), points });
  } catch (err: unknown) {
    console.error('Failed to fetch activities from server:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch activities from server' },
      { status: 502 }
    );
  }
}
