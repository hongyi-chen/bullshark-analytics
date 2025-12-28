import { atom } from 'jotai';
import { TimeFilter, TeamStatsData } from '@/lib/types/dashboard';
import { ServerActivity } from '@/lib/server-api';
import { Athlete } from '@/app/ui/types';

export const timeFilterState = atom<TimeFilter>('week');

export const activitiesState = atom<ServerActivity[]>([]);

// Backward compatible derived atoms
export const loadingState = atom<boolean>((get) => {
  const loading = get(dataLoadingState);
  return loading.activities || loading.athletes;
});

export const errorState = atom<string | null>((get) => {
  const errors = get(dataErrorState);
  return errors.activities || errors.athletes;
});

export const teamStatsState = atom<TeamStatsData | null>(null);

export const teamLoadingState = atom<boolean>((get) => {
  const loading = get(dataLoadingState);
  return loading.activities || loading.athletes || loading.teamStats;
});

export const teamErrorState = atom<string | null>((get) => {
  const errors = get(dataErrorState);
  return errors.activities || errors.athletes || errors.teamStats;
});

export type TeamChartMode = 'weekly' | 'running';

export const teamChartModeState = atom<TeamChartMode>('running');

export type TeamViewMode = 'comparison' | 'bulls-breakdown' | 'sharks-breakdown';

export const teamViewModeState = atom<TeamViewMode>('comparison');

export const athletesState = atom<Athlete[]>([]);

// Derived atom: timeseries from activities
export const timeseriesAtom = atom((get) => {
  const activities = get(activitiesState);
  return activities
    .filter((a) => a.sport_type === "Run")
    .map((a) => ({
      day: a.date.split("T")[0],
      athleteName: a.athlete_name,
      km: a.distance / 1000,
    }));
});

// Derived atom: activity stats from activities
export const activityStatsAtom = atom((get) => {
  const activities = get(activitiesState);
  const runs = activities.filter((a) => a.sport_type === "Run");

  if (runs.length === 0) {
    return {
      overall: { totalRuns: 0, totalKm: 0, longest: null, shortest: null, mostRuns: null },
      athletes: [],
      lastFetchedAt: null,
    };
  }

  // Group by athlete
  const athleteMap = new Map<string, { runs: number; totalKm: number; longestKm: number; shortestKm: number }>();
  let longestRun = { athleteName: "", km: 0 };
  let shortestRun = { athleteName: "", km: Infinity };

  for (const run of runs) {
    const km = run.distance / 1000;
    const existing = athleteMap.get(run.athlete_name) || {
      runs: 0,
      totalKm: 0,
      longestKm: 0,
      shortestKm: Infinity,
    };

    existing.runs++;
    existing.totalKm += km;
    existing.longestKm = Math.max(existing.longestKm, km);
    existing.shortestKm = Math.min(existing.shortestKm, km);

    athleteMap.set(run.athlete_name, existing);

    if (km > longestRun.km) longestRun = { athleteName: run.athlete_name, km };
    if (km < shortestRun.km) shortestRun = { athleteName: run.athlete_name, km };
  }

  const athletes = Array.from(athleteMap.entries())
    .map(([athleteName, data]) => ({
      athleteName,
      runs: data.runs,
      totalKm: data.totalKm,
      longestKm: data.longestKm,
      shortestKm: data.shortestKm === Infinity ? 0 : data.shortestKm,
    }))
    .sort((a, b) => b.totalKm - a.totalKm);

  const mostRuns = athletes.reduce(
    (max, a) => (a.runs > max.runs ? a : max),
    { athleteName: "", runs: 0 }
  );

  return {
    overall: {
      totalRuns: runs.length,
      totalKm: runs.reduce((sum, r) => sum + r.distance / 1000, 0),
      longest: longestRun.km > 0 ? longestRun : null,
      shortest: shortestRun.km < Infinity ? shortestRun : null,
      mostRuns: mostRuns.runs > 0 ? mostRuns : null,
    },
    athletes,
    lastFetchedAt: runs[0]?.date || null,
  };
});

// Unified loading state atom
export const dataLoadingState = atom({
  activities: false,
  athletes: false,
  teamStats: false,
});

// Unified error state atom
export const dataErrorState = atom<{
  activities: string | null;
  athletes: string | null;
  teamStats: string | null;
}>({
  activities: null,
  athletes: null,
  teamStats: null,
});
