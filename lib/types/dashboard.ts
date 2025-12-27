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

export type TeamWeeklyData = {
  weekStart: string;
  weeklyTeamKilometers: number;
  weeklyRunningSum: number;
  weeklyAthleteKilometers: Record<string, number>;
};

export type TeamAthleteKilometers = Record<string, number>;

export type TeamStats = {
  athleteKilometers: TeamAthleteKilometers;
  weeklyKilometers: TeamWeeklyData[];
};

export type TeamStatsData = {
  bulls: TeamStats;
  sharks: TeamStats;
};

export type TeamComparisonChartData = {
  weekStart: string;
  bullsKm: number;
  sharksKm: number;
};

export type AthleteBreakdownChartData = {
  weekStart: string;
  [athleteName: string]: string | number;
};
