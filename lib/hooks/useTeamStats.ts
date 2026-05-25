import { useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { teamStatsState, dataLoadingState, dataErrorState } from '@/lib/state/atoms';
import { fetchTeamStats, hasFreshTeamStatsCache } from '@/lib/state/api';

export function useTeamStats() {
  const [teamStats, setTeamStats] = useAtom(teamStatsState);
  const setLoading = useSetAtom(dataLoadingState);
  const setError = useSetAtom(dataErrorState);
  const abortedRef = useRef(false);

  useEffect(() => {
    abortedRef.current = false;

    async function load() {
      const hasFresh = hasFreshTeamStatsCache();

      setLoading((prev) => ({ ...prev, teamStats: !hasFresh }));
      setError((prev) => ({ ...prev, teamStats: null }));

      try {
        const data = await fetchTeamStats();
        if (!abortedRef.current) {
          setTeamStats(data);
        }
      } catch (e: unknown) {
        if (!abortedRef.current) {
          setError((prev) => ({
            ...prev,
            teamStats: e instanceof Error ? e.message : String(e)
          }));
        }
      } finally {
        if (!abortedRef.current) {
          setLoading((prev) => ({ ...prev, teamStats: false }));
        }
      }
    }

    load();

    return () => {
      abortedRef.current = true;
    };
  }, [setTeamStats, setLoading, setError]);

  return teamStats;
}
