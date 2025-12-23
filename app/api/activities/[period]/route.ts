import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

const VALID_PERIODS = ['week', 'month'] as const;
type Period = typeof VALID_PERIODS[number];

function isValidPeriod(period: string): period is Period {
  return VALID_PERIODS.includes(period as Period);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ period: string }> }
) {
  try {
    const { period } = await params;

    if (!isValidPeriod(period)) {
      return NextResponse.json(
        { error: `Invalid period. Must be one of: ${VALID_PERIODS.join(', ')}` },
        { status: 400 }
      );
    }

    const e = env();
    const backendUrl = `${e.BASE_SERVER_URL}/activities/${period}`;

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

    if (!Array.isArray(data)) {
      throw new Error('Backend response is not an array');
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: error?.message ?? String(error) },
      { status: 502 }
    );
  }
}
