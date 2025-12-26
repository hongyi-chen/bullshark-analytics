import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET() {
  try {
    const e = env();
    const backendUrl = `${e.BASE_SERVER_URL}/team_stats`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend fetch failed: ${response.status} ${text}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching team stats:', error);
    return NextResponse.json(
      { error: error?.message ?? String(error) },
      { status: 502 }
    );
  }
}
