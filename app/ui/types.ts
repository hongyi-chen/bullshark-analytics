export type { TimeFilter, TimeseriesPoint as Timeseries } from "@/lib/types/dashboard";
export { TIME_FILTERS } from "@/lib/types/dashboard";

export type Aggregation = "daily" | "weekly";

export type ChartData = {
  day: string;
  km: number;
};

export type Team = "bulls" | "sharks";
export type Event = "half" | "full";

export type Athlete = {
  id: string;
  name: string;
  team: Team;
  event: Event;
};

export type WeeklyKilometers = Record<string, number>;

export type RiskyWeek = {
  week: string;
  riskCount: number;
  risks: string[];
};

export type TrainingData = {
  weeklyKilometers: WeeklyKilometers;
  riskyWeeks: RiskyWeek[];
};

export type AthleteWithTrainingData = Athlete & {
  trainingData: TrainingData;
};

export type WeeklyWinner = {
  athleteName: string;
  totalKm: number;
  streak: number;
};

export type WeeklyLeaderboardData = {
  weekStart: string;
  winners: WeeklyWinner[];
  weekNumber: number;
};
