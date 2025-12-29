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

export type RiskyWeek = {
  week: string; // ISO date string e.g., "2025-12-22"
  riskCount: number;
  risks: string[]; // Array of risk types e.g., ["HIGH_VOLUME_SPIKE"]
};

export type TrainingData = {
  weeklyKilometers: WeeklyKilometers;
  riskyWeeks: RiskyWeek[];
};

export type AthleteWithTrainingData = Athlete & {
  trainingData: TrainingData;
};
