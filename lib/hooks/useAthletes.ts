import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { athletesState, dataLoadingState, dataErrorState } from '@/lib/state/atoms';
import { fetchAthletes, hasFreshAthletesCache } from '@/lib/state/api';

export function useAthletes() {
  const [athletes, setAthletes] = useAtom(athletesState);
  const setLoading = useSetAtom(dataLoadingState);
  const setError = useSetAtom(dataErrorState);

  useEffect(() => {
    async function load() {
      const hasFresh = hasFreshAthletesCache();

      setLoading((prev) => ({ ...prev, athletes: !hasFresh }));
      setError((prev) => ({ ...prev, athletes: null }));

      try {
        const data = await fetchAthletes();
        setAthletes(data);
      } catch (e: unknown) {
        setError((prev) => ({
          ...prev,
          athletes: e instanceof Error ? e.message : String(e)
        }));
      } finally {
        setLoading((prev) => ({ ...prev, athletes: false }));
      }
    }

    load();
  }, [setAthletes, setLoading, setError]);

  return athletes;
}
