import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { teamStatsState, dataLoadingState, dataErrorState } from '@/lib/state/atoms';
import { fetchTeamStats, hasFreshTeamStatsCache } from '@/lib/state/api';

export function useTeamStats() {
  const [teamStats, setTeamStats] = useAtom(teamStatsState);
  const setLoading = useSetAtom(dataLoadingState);
  const setError = useSetAtom(dataErrorState);

  useEffect(() => {
    async function load() {
      const hasFresh = hasFreshTeamStatsCache();

      setLoading((prev) => ({ ...prev, teamStats: !hasFresh }));
      setError((prev) => ({ ...prev, teamStats: null }));

      try {
        const data = await fetchTeamStats();
        setTeamStats(data);
      } catch (e: unknown) {
        setError((prev) => ({
          ...prev,
          teamStats: e instanceof Error ? e.message : String(e)
        }));
      } finally {
        setLoading((prev) => ({ ...prev, teamStats: false }));
      }
    }

    load();
  }, [setTeamStats, setLoading, setError]);

  return teamStats;
}
