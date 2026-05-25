import { useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { athletesTrainingDataState, dataLoadingState, dataErrorState } from '@/lib/state/atoms';
import { fetchAthletesTrainingData, hasFreshAthletesTrainingDataCache } from '@/lib/state/api';

export function useAthletesTrainingData() {
  const [athletesTrainingData, setAthletesTrainingData] = useAtom(athletesTrainingDataState);
  const setLoading = useSetAtom(dataLoadingState);
  const setError = useSetAtom(dataErrorState);
  const abortedRef = useRef(false);

  useEffect(() => {
    abortedRef.current = false;

    async function load() {
      const hasFresh = hasFreshAthletesTrainingDataCache();

      setLoading((prev) => ({ ...prev, athletesTrainingData: !hasFresh }));
      setError((prev) => ({ ...prev, athletesTrainingData: null }));

      try {
        const data = await fetchAthletesTrainingData();
        if (!abortedRef.current) {
          setAthletesTrainingData(data);
        }
      } catch (e: unknown) {
        if (!abortedRef.current) {
          setError((prev) => ({
            ...prev,
            athletesTrainingData: e instanceof Error ? e.message : String(e)
          }));
        }
      } finally {
        if (!abortedRef.current) {
          setLoading((prev) => ({ ...prev, athletesTrainingData: false }));
        }
      }
    }

    load();

    return () => {
      abortedRef.current = true;
    };
  }, [setAthletesTrainingData, setLoading, setError]);

  return athletesTrainingData;
}
