import { useAtomValue } from 'jotai';
import { activityStatsAtom } from '@/lib/state/atoms';

export function useActivityStats() {
  return useAtomValue(activityStatsAtom);
}
