import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { lastUpdatedTextState } from '@/lib/state/atoms';

/**
 * Custom hook to update the last updated text in the header.
 * Centralizes the duplicate effect logic found across multiple views.
 *
 * @param lastFetchedAt - ISO timestamp of when data was last fetched, or null/undefined
 */
export function useLastUpdatedText(lastFetchedAt: string | null | undefined) {
  const setLastUpdatedText = useSetAtom(lastUpdatedTextState);

  useEffect(() => {
    if (!lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(lastFetchedAt).toLocaleString()}`);
    }
  }, [lastFetchedAt, setLastUpdatedText]);
}
