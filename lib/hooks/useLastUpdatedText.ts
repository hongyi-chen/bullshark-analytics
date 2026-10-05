import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { lastUpdatedTextState } from '@/lib/state/atoms';

/**
 * Hook to set the "last updated" text in the header based on data fetch timestamps.
 * Centralizes the pattern used across Dashboard, Teams, Training, Injury, and Weekly Winners views.
 *
 * @param lastFetchedAt - ISO date string of when data was last fetched, or null/undefined if no data
 * @param customPrefix - Optional custom prefix instead of "Last updated:" (e.g., "Week of")
 */
export function useLastUpdatedText(
  lastFetchedAt: string | null | undefined,
  customPrefix?: string
): void {
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
