import { NextResponse } from 'next/server';
import { fetchAthletesTrainingDataFromServer } from '@/lib/server-api';

export async function GET() {
  try {
    const athletesTrainingData = await fetchAthletesTrainingDataFromServer();

    return NextResponse.json(athletesTrainingData);
  } catch (err: unknown) {
    console.error('Failed to fetch athletes training data from server:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch athletes training data from server' },
      { status: 502 }
    );
  }
}
