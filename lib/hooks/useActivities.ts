import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { activitiesState, dataLoadingState, dataErrorState } from '@/lib/state/atoms';
import { fetchActivities, hasFreshActivitiesCache } from '@/lib/state/api';
import { TimeFilter } from '@/lib/types/dashboard';

export function useActivities(timeFilter: TimeFilter) {
  const [activities, setActivities] = useAtom(activitiesState);
  const setLoading = useSetAtom(dataLoadingState);
  const setError = useSetAtom(dataErrorState);

  useEffect(() => {
    async function load() {
      const hasFresh = hasFreshActivitiesCache(timeFilter);

      setLoading((prev) => ({ ...prev, activities: !hasFresh }));
      setError((prev) => ({ ...prev, activities: null }));

      try {
        const data = await fetchActivities(timeFilter);
        setActivities(data);
      } catch (e: any) {
        setError((prev) => ({
          ...prev,
          activities: e?.message ?? String(e)
        }));
      } finally {
        setLoading((prev) => ({ ...prev, activities: false }));
      }
    }

    load();
  }, [timeFilter, setActivities, setLoading, setError]);

  return activities;
}
