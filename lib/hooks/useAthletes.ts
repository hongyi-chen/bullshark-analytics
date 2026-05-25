import { useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { athletesState, dataLoadingState, dataErrorState } from '@/lib/state/atoms';
import { fetchAthletes, hasFreshAthletesCache } from '@/lib/state/api';

export function useAthletes() {
  const [athletes, setAthletes] = useAtom(athletesState);
  const setLoading = useSetAtom(dataLoadingState);
  const setError = useSetAtom(dataErrorState);
  const abortedRef = useRef(false);

  useEffect(() => {
    abortedRef.current = false;

    async function load() {
      const hasFresh = hasFreshAthletesCache();

      setLoading((prev) => ({ ...prev, athletes: !hasFresh }));
      setError((prev) => ({ ...prev, athletes: null }));

      try {
        const data = await fetchAthletes();
        if (!abortedRef.current) {
          setAthletes(data);
        }
      } catch (e: unknown) {
        if (!abortedRef.current) {
          setError((prev) => ({
            ...prev,
            athletes: e instanceof Error ? e.message : String(e)
          }));
        }
      } finally {
        if (!abortedRef.current) {
          setLoading((prev) => ({ ...prev, athletes: false }));
        }
      }
    }

    load();

    return () => {
      abortedRef.current = true;
    };
  }, [setAthletes, setLoading, setError]);

  return athletes;
}
