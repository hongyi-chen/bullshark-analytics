import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isRun(a: { type: string | null; sportType: string | null }): boolean {
  return a.sportType === 'Run' || a.type === 'Run';
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? '10'), 1), 50);

  const rows = await db.clubFeedActivity.findMany({
    where: {
      OR: [{ sportType: 'Run' }, { type: 'Run' }],
    },
    select: {
      fetchedAt: true,
      athleteName: true,
      distanceM: true,
      name: true,
    },
    orderBy: { fetchedAt: 'desc' },
    take: limit * 2, // Get extra to filter
  });

  const runs = rows
    .filter((r) => r.athleteName)
    .slice(0, limit)
    .map((r) => ({
      athleteName: r.athleteName!,
      km: (r.distanceM ?? 0) / 1000,
      activityName: r.name ?? 'Run',
      fetchedAt: r.fetchedAt.toISOString(),
    }));

  const lastPoll = runs.length > 0 ? runs[0].fetchedAt : null;

  return NextResponse.json({
    ok: true,
    lastPoll,
    runs,
  });
}

