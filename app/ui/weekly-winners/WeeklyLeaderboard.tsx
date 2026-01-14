import LeaderboardCard, { Column, ChipDataSources } from '../common/LeaderboardCard';
import { WeeklyLeaderboardData } from '../types';

interface WeeklyLeaderboardProps {
  data: WeeklyLeaderboardData;
  chipDataSources: ChipDataSources;
}

const columns: Column[] = [
  { type: 'rank' },
  { type: 'athlete', showEventChips: true, showStatusChips: true },
  { type: 'distance' },
  { type: 'streak' },
];

export default function WeeklyLeaderboard({ data, chipDataSources }: WeeklyLeaderboardProps) {
  return (
    <LeaderboardCard
      title="Weekly Winners"
      subtitle={`Week ${data.weekNumber} Leaderboard`}
      badgeLabel="Athletes"
      badgeValue={data.winners.length}
      athletes={data.winners}
      columns={columns}
      chipDataSources={chipDataSources}
      emptyMessage="No runs recorded for this week"
    />
  );
}
