import { ServerActivity } from "@/lib/server-api";

export function isRun(sportType: string): boolean {
  return sportType === "Run";
}

export function getTimeseries(activities: ServerActivity[]) {
    return activities.filter((a) => isRun(a.sport_type))
      .map((a) => ({
        day: a.date.split("T")[0],
        athleteName: a.athlete_name,
        km: a.distance / 1000,
      }));
}