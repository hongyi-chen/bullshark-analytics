import { NextRequest, NextResponse } from 'next/server';
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

  type Agg = { runs: number; totalM: number; minM: number; maxM: number };
  const byAthlete = new Map<string, Agg>();

  let totalRuns = 0;
  let totalM = 0;
  let lastFetchedAt: Date | null = null;

  for (const r of rows) {
    if (!isRun(r)) continue;
    if (!r.athleteName) continue;
    const m = typeof r.distanceM === 'number' ? r.distanceM : 0;

    totalRuns += 1;
    totalM += m;
    lastFetchedAt = r.fetchedAt;

    const cur = byAthlete.get(r.athleteName) ?? { runs: 0, totalM: 0, minM: Number.POSITIVE_INFINITY, maxM: 0 };
    cur.runs += 1;
    cur.totalM += m;
    cur.minM = Math.min(cur.minM, m);
    cur.maxM = Math.max(cur.maxM, m);
    byAthlete.set(r.athleteName, cur);
  }

  const athletes = Array.from(byAthlete.entries()).map(([athleteName, a]) => ({
    athleteName,
    runs: a.runs,
    totalKm: a.totalM / 1000,
    longestKm: a.maxM / 1000,
    shortestKm: (a.minM === Number.POSITIVE_INFINITY ? 0 : a.minM / 1000),
  }));

  const longest = athletes.reduce<{ athleteName: string; km: number } | null>((best, a) => {
    if (!best || a.longestKm > best.km) return { athleteName: a.athleteName, km: a.longestKm };
    return best;
  }, null);

  const shortest = athletes.reduce<{ athleteName: string; km: number } | null>((best, a) => {
    if (a.shortestKm <= 0) return best;
    if (!best || a.shortestKm < best.km) return { athleteName: a.athleteName, km: a.shortestKm };
    return best;
  }, null);

  const mostRuns = athletes.reduce<{ athleteName: string; runs: number } | null>((best, a) => {
    if (!best || a.runs > best.runs) return { athleteName: a.athleteName, runs: a.runs };
    return best;
  }, null);

  athletes.sort((a, b) => b.totalKm - a.totalKm);

  return NextResponse.json({
    ok: true,
    days,
    since: since.toISOString(),
    lastFetchedAt: lastFetchedAt ? lastFetchedAt.toISOString() : null,
    overall: {
      totalRuns,
      totalKm: totalM / 1000,
      longest,
      shortest,
      mostRuns,
    },
    athletes,
  });
}
