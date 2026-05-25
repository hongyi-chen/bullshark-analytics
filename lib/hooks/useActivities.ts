import { useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { activitiesState, dataLoadingState, dataErrorState } from '@/lib/state/atoms';
import { fetchActivities, hasFreshActivitiesCache } from '@/lib/state/api';
import { TimeFilter } from '@/lib/types/dashboard';

export function useActivities(timeFilter: TimeFilter) {
  const [activities, setActivities] = useAtom(activitiesState);
  const setLoading = useSetAtom(dataLoadingState);
  const setError = useSetAtom(dataErrorState);
  const abortedRef = useRef(false);

  useEffect(() => {
    abortedRef.current = false;

    async function load() {
      const hasFresh = hasFreshActivitiesCache(timeFilter);

      setLoading((prev) => ({ ...prev, activities: !hasFresh }));
      setError((prev) => ({ ...prev, activities: null }));

      try {
        const data = await fetchActivities(timeFilter);
        // Only update state if the effect hasn't been cleaned up
        if (!abortedRef.current) {
          setActivities(data);
        }
      } catch (e: unknown) {
        if (!abortedRef.current) {
          setError((prev) => ({
            ...prev,
            activities: e instanceof Error ? e.message : String(e)
          }));
        }
      } finally {
        if (!abortedRef.current) {
          setLoading((prev) => ({ ...prev, activities: false }));
        }
      }
    }

    load();

    return () => {
      abortedRef.current = true;
    };
  }, [timeFilter, setActivities, setLoading, setError]);

  return activities;
}
