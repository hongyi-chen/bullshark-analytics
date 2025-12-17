import { NextRequest, NextResponse } from 'next/server';
import { startOfDay } from 'date-fns';
import { db } from '@/lib/db';

function isRun(a: { type: string | null; sportType: string | null }): boolean {
  return a.sportType === 'Run' || a.type === 'Run';
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const days = Math.min(Math.max(Number(url.searchParams.get('days') ?? '30'), 1), 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const rows = await db.clubFeedActivity.findMany({
    where: { fetchedAt: { gte: since } },
    select: {
      fetchedAt: true,
      athleteName: true,
      distanceM: true,
      type: true,
      sportType: true,
    },
    orderBy: { fetchedAt: 'asc' },
  });

  // Because ClubActivity may not include a real activity timestamp, we bucket by fetchedAt (when we first saw it).
  const byDayAthlete = new Map<string, number>();

  for (const r of rows) {
    if (!isRun(r)) continue;
    if (!r.athleteName) continue;

    const day = startOfDay(r.fetchedAt).toISOString().slice(0, 10);
    const key = `${day}:${r.athleteName}`;
    byDayAthlete.set(key, (byDayAthlete.get(key) ?? 0) + (r.distanceM ?? 0));
  }

  const points = Array.from(byDayAthlete.entries())
    .map(([key, meters]) => {
      const [day, athleteName] = key.split(':');
      return { day, athleteName, km: meters / 1000 };
    })
    .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : a.athleteName.localeCompare(b.athleteName)));

  return NextResponse.json({ ok: true, days, since: since.toISOString(), points });
}
