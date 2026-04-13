import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { lastUpdatedTextState } from '@/lib/state/atoms';

export function useLastUpdated(lastFetchedAt: string | number | null | undefined) {
  const [, setLastUpdatedText] = useAtom(lastUpdatedTextState);

  useEffect(() => {
    if (!lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(lastFetchedAt).toLocaleString()}`);
    }
  }, [lastFetchedAt, setLastUpdatedText]);
}
