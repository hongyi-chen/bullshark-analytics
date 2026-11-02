import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { lastUpdatedTextState } from '@/lib/state/atoms';

export function useLastUpdated(lastFetchedAt: string | null | undefined) {
  const setLastUpdatedText = useSetAtom(lastUpdatedTextState);

  useEffect(() => {
    if (!lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(lastFetchedAt).toLocaleString()}`);
    }
  }, [lastFetchedAt, setLastUpdatedText]);
}
