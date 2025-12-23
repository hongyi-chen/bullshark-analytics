export type TimeseriesPoint = {
  day: string;
  athleteName: string;
  km: number;
};

export type AthleteStats = {
  athleteName: string;
  runs: number;
  totalKm: number;
  longestKm: number;
  shortestKm: number;
};

export type OverallStats = {
  totalRuns: number;
  totalKm: number;
  longest: { athleteName: string; km: number } | null;
  shortest: { athleteName: string; km: number } | null;
  mostRuns: { athleteName: string; runs: number } | null;
};

export type LatestRun = {
  athleteName: string;
  km: number;
  activityName: string;
  fetchedAt: string;
};

export type ActivityData = {
  timeseries: TimeseriesPoint[];
  stats: {
    overall: OverallStats;
    athletes: AthleteStats[];
    lastFetchedAt: string | null;
  };
  latestRuns: {
    runs: LatestRun[];
    lastPoll: string | null;
  };
};

export const TIME_FILTERS = ['week', 'month'] as const;
export type TimeFilter = typeof TIME_FILTERS[number];
