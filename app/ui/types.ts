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
  [date: string]: number; // e.g., "2025-12-15": 35.3095
};

export type TrainingData = {
  weeklyKilometers: WeeklyKilometers;
};

export type AthleteWithTrainingData = Athlete & {
  trainingData: TrainingData;
};
