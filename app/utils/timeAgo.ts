/**
 * Formats a date string as a human-readable relative time (e.g., "5m ago", "2h ago").
 * @param dateStr - ISO date string to compare against current time
 * @param referenceTime - Optional reference timestamp (ms since epoch). Defaults to Date.now().
 *                        Useful for consistent rendering during SSR/hydration.
 */
export function timeAgo(dateStr: string, referenceTime?: number): string {
  const now = referenceTime ?? Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
