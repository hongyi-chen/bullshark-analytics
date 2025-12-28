import { NextResponse } from 'next/server';
import { fetchAthletesFromServer } from '@/lib/server-api';

export async function GET() {
  try {
    const athletes = await fetchAthletesFromServer();

    return NextResponse.json(athletes);
  } catch (err: unknown) {
    console.error('Failed to fetch athletes from server:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch athletes from server' },
      { status: 502 }
    );
  }
}
