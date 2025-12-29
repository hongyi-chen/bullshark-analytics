import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { athletesTrainingDataState, dataLoadingState, dataErrorState } from '@/lib/state/atoms';
import { fetchAthletesTrainingData, hasFreshAthletesTrainingDataCache } from '@/lib/state/api';

export function useAthletesTrainingData() {
  const [athletesTrainingData, setAthletesTrainingData] = useAtom(athletesTrainingDataState);
  const setLoading = useSetAtom(dataLoadingState);
  const setError = useSetAtom(dataErrorState);

  useEffect(() => {
    async function load() {
      const hasFresh = hasFreshAthletesTrainingDataCache();

      setLoading((prev) => ({ ...prev, athletesTrainingData: !hasFresh }));
      setError((prev) => ({ ...prev, athletesTrainingData: null }));

      try {
        const data = await fetchAthletesTrainingData();
        setAthletesTrainingData(data);
      } catch (e: unknown) {
        setError((prev) => ({
          ...prev,
          athletesTrainingData: e instanceof Error ? e.message : String(e)
        }));
      } finally {
        setLoading((prev) => ({ ...prev, athletesTrainingData: false }));
      }
    }

    load();
  }, [setAthletesTrainingData, setLoading, setError]);

  return athletesTrainingData;
}
