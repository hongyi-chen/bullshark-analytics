import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { lastUpdatedTextState } from '@/lib/state/atoms';

interface UseLastUpdatedTextOptions {
  lastFetchedAt: string | null | undefined;
  customPrefix?: string;
}

export function useLastUpdatedText({ lastFetchedAt, customPrefix }: UseLastUpdatedTextOptions) {
  const setLastUpdatedText = useSetAtom(lastUpdatedTextState);

  useEffect(() => {
    if (!lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else if (customPrefix) {
      setLastUpdatedText(customPrefix);
    } else {
      setLastUpdatedText(`Last updated: ${new Date(lastFetchedAt).toLocaleString()}`);
    }
  }, [lastFetchedAt, customPrefix, setLastUpdatedText]);
}
