import { NextRequest, NextResponse } from 'next/server';
import { fetchActivities } from '@/lib/server-api';
import { startOfWeek } from 'date-fns';

function isRun(sportType: string): boolean {
  return sportType === 'Run';
}

// Date cutoff - only show runs from 12/15/2025 onwards
const DATE_CUTOFF = new Date('2025-12-15T00:00:00Z');

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') ?? 'days';

  let since: Date;
  let days: number;

  if (mode === 'week') {
    // Current week: from Monday 00:00:00 to now
    since = startOfWeek(new Date(), { weekStartsOn: 1 }); // 1 = Monday
    days = Math.ceil((Date.now() - since.getTime()) / (24 * 60 * 60 * 1000));
  } else {
    // Rolling days mode
    days = Math.min(Math.max(Number(url.searchParams.get('days') ?? '30'), 1), 365);
    since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }

  // Respect the date cutoff
  if (since < DATE_CUTOFF) {
    since = DATE_CUTOFF;
  }

  try {
    const activities = await fetchActivities();

    // Filter for runs within the time period and after cutoff
    const runs = activities.filter((a) => {
      const activityDate = new Date(a.date);
      return isRun(a.sport_type) && activityDate >= since && a.athlete_name;
    });

    type Agg = { runs: number; totalM: number; minM: number; maxM: number };
    const byAthlete = new Map<string, Agg>();

    let totalRuns = 0;
    let totalM = 0;
    let lastActivityDate: Date | null = null;

    for (const r of runs) {
      const m = r.distance;
      const activityDate = new Date(r.date);

      totalRuns += 1;
      totalM += m;

      if (!lastActivityDate || activityDate > lastActivityDate) {
        lastActivityDate = activityDate;
      }

      const cur = byAthlete.get(r.athlete_name) ?? {
        runs: 0,
        totalM: 0,
        minM: Number.POSITIVE_INFINITY,
        maxM: 0,
      };
      cur.runs += 1;
      cur.totalM += m;
      cur.minM = Math.min(cur.minM, m);
      cur.maxM = Math.max(cur.maxM, m);
      byAthlete.set(r.athlete_name, cur);
    }

    const athletes = Array.from(byAthlete.entries()).map(([athleteName, a]) => ({
      athleteName,
      runs: a.runs,
      totalKm: a.totalM / 1000,
      longestKm: a.maxM / 1000,
      shortestKm: a.minM === Number.POSITIVE_INFINITY ? 0 : a.minM / 1000,
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
      lastFetchedAt: lastActivityDate ? lastActivityDate.toISOString() : null,
      overall: {
        totalRuns,
        totalKm: totalM / 1000,
        longest,
        shortest,
        mostRuns,
      },
      athletes,
    });
  } catch (err: any) {
    console.error('Failed to fetch activities from server:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch activities from server' },
      { status: 502 }
    );
  }
}
