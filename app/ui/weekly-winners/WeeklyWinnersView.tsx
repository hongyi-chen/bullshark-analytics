'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { weeklyWinnersWeekState, lastUpdatedTextState, timeFilterState } from '@/lib/state/atoms';
import { useActivities, useWeeklyWinners, useAthletes, useTimeseries } from '@/lib/hooks';
import { format, parseISO } from 'date-fns';
import WeekSelector from './WeekSelector';
import WeeklyLeaderboard from './WeeklyLeaderboard';
import Divider from '../common/Divider';

export default function WeeklyWinnersView() {
  const [selectedWeek, setSelectedWeek] = useAtom(weeklyWinnersWeekState);
  const [, setLastUpdatedText] = useAtom(lastUpdatedTextState);
  const [, setTimeFilter] = useAtom(timeFilterState);

  // Fetch activities data (using 'month' to get sufficient historical data for streaks)
  useActivities('month');

  // Fetch athletes metadata for event chips
  const athletes = useAthletes();

  // Get timeseries data for status chips
  const timeseries = useTimeseries();

  // Get leaderboard data for selected week
  const leaderboardData = useWeeklyWinners(selectedWeek);

  // Update header text with selected week
  useEffect(() => {
    const weekDate = parseISO(selectedWeek);
    const weekLabel = format(weekDate, 'MMM d, yyyy');
    setLastUpdatedText(`Week of ${weekLabel}`);
  }, [selectedWeek, setLastUpdatedText]);

  // Set time filter to month when this tab is active to ensure we have enough data
  useEffect(() => {
    setTimeFilter('month');
  }, [setTimeFilter]);

  return (
    <>
      <WeekSelector
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
      />
      <Divider size={16} />
      <WeeklyLeaderboard
        data={leaderboardData}
        chipDataSources={{
          athleteMetadata: athletes,
          timeseries: timeseries,
        }}
      />
    </>
  );
}
