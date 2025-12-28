import { useCallback, useEffect, useMemo, useState } from "react";
import { Timeseries } from "../types";

export function useAthleteStatus(timeseries: Timeseries[] | undefined) {
  const [todayTimestamp, setTodayTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTodayTimestamp(today.getTime());
  }, []);

  const athleteLastRunDate = useMemo(() => {
    const pts = timeseries || [];
    const lastRun = new Map<string, string>();
    for (const p of pts) {
      if (p.athleteName) {
        const existing = lastRun.get(p.athleteName);
        if (!existing || p.day > existing) {
          lastRun.set(p.athleteName, p.day);
        }
      }
    }
    return lastRun;
  }, [timeseries]);

  const getAthleteStatus = useCallback(
    (athleteName: string): "today" | "recent" | "inactive" | null => {
      if (todayTimestamp === null) return null;
      const lastRun = athleteLastRunDate.get(athleteName);
      if (!lastRun) return null;

      const [year, month, day] = lastRun.split("-").map(Number);
      const lastRunDate = new Date(year, month - 1, day);

      const diffDays = Math.floor(
        (todayTimestamp - lastRunDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) return "today";
      if (diffDays <= 3) return "recent";
      return "inactive";
    },
    [todayTimestamp, athleteLastRunDate]
  );

  return getAthleteStatus;
}
