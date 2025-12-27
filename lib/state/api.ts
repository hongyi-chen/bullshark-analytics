import { ServerActivity } from '@/lib/server-api';
import { TeamStatsData } from '@/lib/types/dashboard';
import { Athlete } from '@/app/ui/types';

// Simple in-memory cache with SWR-like behavior
// Not persisted across hard refreshes; sufficient to smooth client-side route transitions
const CACHE_TTL_MS = 60_000; // 1 minute

type CacheEntry<T> = {
  ts: number;
  data?: T;
  promise?: Promise<T>;
};

const cache = new Map<string, CacheEntry<any>>();

function getKey(path: string) {
  return path; // can be extended later
}

export function hasFreshActivitiesCache(timeFilter: 'week' | 'month'): boolean {
  const key = getKey(`/api/activities/${timeFilter}`);
  const entry = cache.get(key);
  return !!entry && Date.now() - entry.ts < CACHE_TTL_MS && entry.data != null;
}

export function hasFreshAthletesCache(): boolean {
  const key = getKey('/api/athletes');
  const entry = cache.get(key);
  return !!entry && Date.now() - entry.ts < CACHE_TTL_MS && entry.data != null;
}

export function hasFreshTeamStatsCache(): boolean {
  const key = getKey('/api/team_stats');
  const entry = cache.get(key);
  return !!entry && Date.now() - entry.ts < CACHE_TTL_MS && entry.data != null;
}

async function fetchWithCache<T>(endpoint: string, validate: (x: any) => T): Promise<T> {
  const key = getKey(endpoint);
  const now = Date.now();
  let entry = cache.get(key) as CacheEntry<T> | undefined;

  if (entry && entry.data && now - entry.ts < CACHE_TTL_MS) {
    // Fresh data
    return entry.data as T;
  }

  if (entry?.promise) {
    return entry.promise;
  }

  const p = (async () => {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    }
    const raw = await res.json();
    const data = validate(raw);
    cache.set(key, { ts: Date.now(), data });
    return data;
  })();

  cache.set(key, { ts: now, promise: p });
  return p;
}

export async function fetchActivities(timeFilter: 'week' | 'month'): Promise<ServerActivity[]> {
  const endpoint = `/api/activities/${timeFilter}`;
  return fetchWithCache<ServerActivity[]>(endpoint, (raw) => {
    if (!Array.isArray(raw)) {
      throw new Error('Server response is not an array');
    }
    return raw as ServerActivity[];
  });
}

export async function fetchTeamStats(): Promise<TeamStatsData> {
  const endpoint = '/api/team_stats';
  return fetchWithCache<TeamStatsData>(endpoint, (raw) => raw as TeamStatsData);
}

export async function fetchAthletes(): Promise<Athlete[]> {
  const endpoint = '/api/athletes';
  return fetchWithCache<Athlete[]>(endpoint, (raw) => {
    if (!Array.isArray(raw)) {
      throw new Error('Server response is not an array');
    }
    return raw as Athlete[];
  });
}
