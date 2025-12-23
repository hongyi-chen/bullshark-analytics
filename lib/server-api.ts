import { env } from '@/lib/env';

export type ServerActivity = {
  id: string;
  date: string; // ISO timestamp of when activity occurred
  athlete_name: string;
  resource_state: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  sport_type: string;
  workout_type: number | null;
  device_name: string;
};

export async function fetchActivities(): Promise<ServerActivity[]> {
  const e = env();

  // Use /read endpoint for legacy compatibility (old API routes)
  const url = `${e.BASE_SERVER_URL}/read`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    // Don't cache - we want fresh data
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('Server response is not an array');
  }

  return data as ServerActivity[];
}
