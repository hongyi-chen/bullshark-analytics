import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { activitiesState } from '@/lib/state/atoms';
import { startOfWeek, format, parseISO, subWeeks, differenceInWeeks } from 'date-fns';
import { WeeklyLeaderboardData, WeeklyWinner } from '@/app/ui/types';

export function useWeeklyWinners(weekStart: string): WeeklyLeaderboardData {
  const [activities] = useAtom(activitiesState);

  return useMemo(() => {
    const selectedWeekDate = parseISO(weekStart);

    // Step 1: Filter runs only
    const runs = activities.filter(a => a.sport_type === 'Run');

    // Step 2: Group by athlete and week
    type WeeklyData = Map<string, number>; // weekKey -> totalKm
    const athleteWeeks = new Map<string, WeeklyData>();

    for (const run of runs) {
      const runDate = parseISO(run.date);
      const runWeekStart = startOfWeek(runDate, { weekStartsOn: 1 });
      const weekKey = format(runWeekStart, 'yyyy-MM-dd');

      if (!athleteWeeks.has(run.athlete_name)) {
        athleteWeeks.set(run.athlete_name, new Map());
      }

      const weeks = athleteWeeks.get(run.athlete_name)!;
      const currentKm = weeks.get(weekKey) || 0;
      weeks.set(weekKey, currentKm + (run.distance / 1000));
    }

    // Step 3: Calculate streaks and get selected week data
    const winners: WeeklyWinner[] = [];

    for (const [athleteName, weeks] of athleteWeeks.entries()) {
      // Get km for selected week
      const totalKm = weeks.get(weekStart) || 0;

      // Skip if no activity in selected week
      if (totalKm === 0) continue;

      // Calculate streak - count consecutive weeks backwards from selected week
      let streak = 0;
      let checkWeek = selectedWeekDate;

      while (true) {
        const checkWeekKey = format(checkWeek, 'yyyy-MM-dd');
        if (weeks.has(checkWeekKey)) {
          streak++;
          // Move to previous week
          checkWeek = subWeeks(checkWeek, 1);
        } else {
          break; // Streak broken
        }
      }

      winners.push({ athleteName, totalKm, streak });
    }

    // Step 4: Sort by km descending
    winners.sort((a, b) => b.totalKm - a.totalKm);

    // Calculate week number (weeks since earliest activity)
    let weekNumber = 1;
    if (runs.length > 0) {
      const earliestRun = runs.reduce((earliest, run) => {
        const runDate = parseISO(run.date);
        return runDate < parseISO(earliest.date) ? run : earliest;
      });
      const earliestDate = parseISO(earliestRun.date);
      const earliestWeekStart = startOfWeek(earliestDate, { weekStartsOn: 1 });
      weekNumber = differenceInWeeks(selectedWeekDate, earliestWeekStart) + 1;
    }

    return {
      weekStart,
      winners,
      weekNumber,
    };
  }, [activities, weekStart]);
}
