import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { lastUpdatedTextState } from '@/lib/state/atoms';

/**
 * Hook to update the header's "last updated" text based on a timestamp.
 * Extracts repeated logic from DashboardView, TeamsView, TrainingView, etc.
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
