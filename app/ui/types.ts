export type Aggregation = "daily" | "weekly";
export type TimeFilter = "week" | "month";
export type Timeseries = {
  day: string;
  athleteName: string;
  km: number;
};
export type ChartData = {
  day: string;
  km: number;
};
export type Athlete = {
  id: string;
  name: string;
  team: "bulls" | "sharks";
  event: "half" | "full";
};

export type WeeklyKilometers = {
  [date: string]: number;
};

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
