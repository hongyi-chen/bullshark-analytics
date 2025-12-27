// Diverse color palettes for team athlete visualizations
// Bulls: Vibrant, warm colors with high contrast
const BULLS_COLORS = [
  '#22c55e', // Bright green (--accent)
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#eab308', // Yellow
  '#14b8a6', // Teal
  '#a855f7', // Violet
  '#84cc16', // Lime
];

// Sharks: Cool, contrasting colors with high distinction
const SHARKS_COLORS = [
  '#3b82f6', // Bright blue (current Sharks color)
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#eab308', // Yellow
  '#14b8a6', // Teal
  '#a855f7', // Violet
];

/**
 * Assigns a consistent color to an athlete based on their name and team.
 * Uses hash-based selection to ensure the same athlete always gets the same color.
 *
 * @param athleteName - The name of the athlete
 * @param team - The team the athlete belongs to ('bulls' or 'sharks')
 * @returns A hex color code
 */
export function getAthleteColor(athleteName: string, team: 'bulls' | 'sharks'): string {
  const palette = team === 'bulls' ? BULLS_COLORS : SHARKS_COLORS;

  // Hash the athlete name for consistent color assignment
  let hash = 0;
  for (let i = 0; i < athleteName.length; i++) {
    const char = athleteName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return palette[Math.abs(hash) % palette.length];
}
