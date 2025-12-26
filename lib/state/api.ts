import { ServerActivity } from '@/lib/server-api';
import { TeamStatsData } from '@/lib/types/dashboard';

export async function fetchActivities(timeFilter: 'week' | 'month'): Promise<ServerActivity[]> {
  const endpoint = `/api/activities/${timeFilter}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${timeFilter} data: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Server response is not an array');
  }

  return data as ServerActivity[];
}

export async function fetchTeamStats(): Promise<TeamStatsData> {
  const endpoint = '/api/team_stats';

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to fetch team stats: ${response.status}`);
  }

  return await response.json();
}
