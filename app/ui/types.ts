export type Aggregation = "daily" | "weekly";
export type TimeFilter = "week" | "month";
export type Timeseries = {
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
