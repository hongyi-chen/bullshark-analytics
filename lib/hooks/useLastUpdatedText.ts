import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { lastUpdatedTextState } from '@/lib/state/atoms';

/**
 * Custom hook to update the header's "last updated" text based on the last fetched timestamp.
 * This reduces code duplication across multiple view components.
 * 
 * @param lastFetchedAt - ISO date string of when data was last fetched, or null/undefined if no data
 */
export function useLastUpdatedText(lastFetchedAt: string | null | undefined) {
  const [, setLastUpdatedText] = useAtom(lastUpdatedTextState);

  useEffect(() => {
    if (!lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(lastFetchedAt).toLocaleString()}`);
    }
  }, [lastFetchedAt, setLastUpdatedText]);
}
