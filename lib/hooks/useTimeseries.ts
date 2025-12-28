import { useAtomValue } from 'jotai';
import { timeseriesAtom } from '@/lib/state/atoms';

export function useTimeseries() {
  return useAtomValue(timeseriesAtom);
}
