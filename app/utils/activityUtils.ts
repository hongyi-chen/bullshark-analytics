import { ServerActivity } from "@/lib/server-api";

export function getTimeseries(activities: ServerActivity[]) {
    return activities.filter((a) => a.sport_type === "Run")
      .map((a) => ({
        day: a.date.split("T")[0],
        athleteName: a.athlete_name,
        km: a.distance / 1000,
      }));
}