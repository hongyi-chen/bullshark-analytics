# Code Quality Report

**Generated:** February 23, 2026  
**Directories Reviewed:** `/workspace/app/ui/`, `/workspace/lib/`, `/workspace/app/api/`

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 4 |
| Medium | 12 |
| Low | 8 |

---

## Issues Found

### 1. Code Duplication

#### Issue 1.1: Duplicated Chart Data Processing Logic (TeamsView.tsx)
- **File:** `app/ui/team/TeamsView.tsx`
- **Lines:** 36-73 and 75-112
- **Severity:** High
- **Description:** The `chartData` and `runningTotalsData` useMemo hooks contain nearly identical logic for combining team statistics. Both iterate over `teamStats.bulls.weeklyKilometers` and `teamStats.sharks.weeklyKilometers` in the same pattern.
- **Suggested Fix:** Extract the common logic into a shared helper function that takes the data property to extract (e.g., `weeklyTeamKilometers` vs `weeklyRunningSum`) as a parameter.

```typescript
// Suggested refactor:
function combineTeamData(
  bullsData: TeamWeeklyData[],
  sharksData: TeamWeeklyData[],
  valueExtractor: (data: TeamWeeklyData) => number
): Array<{ weekStart: string; bullsKm: number; sharksKm: number }> {
  const combined = new Map<string, { bullsKm: number; sharksKm: number }>();
  // ... common logic
}
```

#### Issue 1.2: Duplicated timeAgo Implementation
- **File 1:** `app/utils/timeAgo.ts` (lines 1-13)
- **File 2:** `app/ui/dashboard/LatestRunsCard.tsx` (lines 13-24, function `timeAgoFromNow`)
- **Severity:** Medium
- **Description:** Two nearly identical implementations of time-ago formatting exist. The `LatestRunsCard` has its own `timeAgoFromNow` function instead of using the utility in `app/utils/timeAgo.ts`.
- **Suggested Fix:** Remove the duplicated `timeAgoFromNow` function and import/adapt the existing `timeAgo` utility.

#### Issue 1.3: Duplicated Last Updated Effect
- **Files:** `app/ui/team/TeamsView.tsx` (lines 271-277), `app/ui/dashboard/DashboardView.tsx` (lines 67-73), `app/ui/training/TrainingView.tsx` (lines 36-42), `app/ui/injury-insights/InjuryInsightsView.tsx` (lines 30-36)
- **Severity:** Medium
- **Description:** The same `useEffect` pattern for updating `lastUpdatedText` based on `stats?.lastFetchedAt` is repeated in 4 different view components.
- **Suggested Fix:** Create a custom hook `useLastUpdatedText(lastFetchedAt: string | null)` that encapsulates this logic.

#### Issue 1.4: Duplicated Timeseries Extraction
- **File 1:** `lib/state/atoms.ts` (lines 74-83, `timeseriesAtom`)
- **File 2:** `app/utils/activityUtils.ts` (lines 7-13, `getTimeseries`)
- **Severity:** Medium
- **Description:** Two implementations for extracting timeseries data from activities.
- **Suggested Fix:** Use the utility function in the atom derivation to maintain a single source of truth.

---

### 2. Inconsistent Naming Conventions

#### Issue 2.1: Inconsistent Function Naming (get vs use prefix)
- **File:** `app/ui/hooks/useAthleteStatus.ts`
- **Line:** 27
- **Severity:** Low
- **Description:** The hook returns a function called `getAthleteStatus`, but the hook itself is `useAthleteStatus`. This is acceptable but the returned function could be named more clearly like `calculateAthleteStatus` to avoid confusion with data-fetching patterns.

#### Issue 2.2: Mixed Quote Styles
- **Files:** Various
- **Severity:** Low
- **Description:** Some files use double quotes (`"use client"`) while others use single quotes (`'use client'`). This doesn't affect functionality but is inconsistent.
- **Suggested Fix:** Run Prettier/ESLint with consistent quote settings.

#### Issue 2.3: Inconsistent CSS Module Import Naming
- **File 1:** `app/ui/training/TrainingView.tsx` - imports as `css` from `'@/app/ui/dashboard/Filters.module.scss'`
- **Severity:** Low
- **Description:** TrainingView imports CSS from the dashboard folder rather than having its own styles, which could cause confusion.
- **Suggested Fix:** Create a shared filters stylesheet or copy relevant styles to TrainingView's own module.

---

### 3. Dead Code

#### Issue 3.1: Unused Import - LineChart in InjuryVolumeChart
- **File:** `app/ui/injury-insights/InjuryVolumeChart.tsx`
- **Line:** 2
- **Severity:** Low
- **Description:** `LineChart` is imported from recharts but not used; `ComposedChart` is used instead.
- **Suggested Fix:** Remove the unused `LineChart` import.

#### Issue 3.2: Unused getAthleteColour Function
- **File:** `app/utils/athleteStyles.ts`
- **Line:** 114-117
- **Severity:** Low
- **Description:** `getAthleteColour` is defined but not used anywhere in the codebase based on grep results.
- **Suggested Fix:** Remove if truly unused, or add usage if intended.

#### Issue 3.3: Unused getTimeseries Utility
- **File:** `app/utils/activityUtils.ts`
- **Lines:** 7-13
- **Severity:** Low
- **Description:** The `getTimeseries` function duplicates logic that exists in `timeseriesAtom` and appears to be unused.
- **Suggested Fix:** Remove or consolidate with `timeseriesAtom`.

---

### 4. Complex Functions

#### Issue 4.1: TeamsView Component Too Complex
- **File:** `app/ui/team/TeamsView.tsx`
- **Lines:** 1-387 (entire component)
- **Severity:** High
- **Description:** This component has 387 lines with 10+ useMemo hooks and complex data transformations. It handles too many responsibilities.
- **Suggested Fix:** Break into smaller components:
  - Extract chart data preparation logic into a custom hook `useTeamChartData`
  - Extract filter controls into a separate `TeamFilters` component
  - Extract leaderboard sections into `TeamLeaderboards` component

#### Issue 4.2: activityStatsAtom Too Complex
- **File:** `lib/state/atoms.ts`
- **Lines:** 86-149 (63 lines)
- **Severity:** Medium
- **Description:** This derived atom has complex nested logic for computing statistics from activities. While under 50 lines of pure logic, the nesting makes it hard to test.
- **Suggested Fix:** Extract the statistics calculation into a pure utility function that can be unit tested independently.

---

### 5. Console.log/Debug Statements

#### Issue 5.1: Console.error Statements in API Routes
- **Files:**
  - `app/api/team_stats/route.ts:26`
  - `app/api/club/timeseries/route.ts:39`
  - `app/api/club/latest/route.ts:32`
  - `app/api/club/stats/route.ts:112`
  - `app/api/activities/[period]/route.ts:49`
  - `app/api/athletes/route.ts:10`
  - `app/api/athletes/training_data/route.ts:10`
- **Severity:** Medium
- **Description:** All API routes use `console.error` for error logging. While appropriate for development, production should use structured logging.
- **Suggested Fix:** Implement a proper logging service or use Next.js instrumentation for production logging. For now, these are acceptable but consider adding a logger utility.

---

### 6. Missing Error Boundaries

#### Issue 6.1: No React Error Boundaries
- **File:** All view components
- **Severity:** High
- **Description:** The application lacks React Error Boundaries. If any component throws during rendering, the entire app will crash.
- **Suggested Fix:** Add error boundaries at critical points:
  1. Create an `ErrorBoundary` component
  2. Wrap each major view (`DashboardView`, `TeamsView`, `TrainingView`, `InjuryInsightsView`, `WeeklyWinnersView`) with an error boundary
  3. Consider wrapping chart components specifically as they may fail with bad data

```typescript
// Suggested ErrorBoundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  // Implementation...
}
```

---

### 7. Hardcoded Values That Should Be Constants

#### Issue 7.1: Hardcoded Date Cutoff
- **File:** `app/api/club/stats/route.ts`
- **Lines:** 6-7
- **Severity:** Medium
- **Description:** `const DATE_CUTOFF = new Date('2025-12-15T00:00:00Z');` is hardcoded.
- **Suggested Fix:** Move to a configuration file or environment variable.

#### Issue 7.2: Hardcoded Cache TTL
- **File:** `lib/state/api.ts`
- **Line:** 7
- **Severity:** Low
- **Description:** `const CACHE_TTL_MS = 60_000;` - while documented, could be configurable.
- **Suggested Fix:** Consider making this configurable via environment variable.

#### Issue 7.3: Hardcoded Chart Dimensions
- **File:** `app/ui/training/TrainingChartCard.tsx`
- **Line:** 152
- **Severity:** Low
- **Description:** `style={{ height: '600px' }}` is hardcoded inline.
- **Suggested Fix:** Move to CSS module variable or constant.

---

### 8. Magic Numbers/Strings

#### Issue 8.1: Magic Numbers in Date Calculations
- **File:** `app/ui/dashboard/LatestRunsCard.tsx`
- **Lines:** 16-18
- **Severity:** Medium
- **Description:** Magic numbers `60000`, `3600000`, `86400000` used without explanation.
- **Suggested Fix:** Define constants with meaningful names:
```typescript
const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;
```

#### Issue 8.2: Magic Numbers for Athlete Status
- **File:** `app/ui/hooks/useAthleteStatus.ts`
- **Lines:** 36-42
- **Severity:** Medium
- **Description:** Numbers `0`, `3` used to determine athlete status without named constants.
- **Suggested Fix:**
```typescript
const TODAY_THRESHOLD_DAYS = 0;
const RECENT_THRESHOLD_DAYS = 3;
```

#### Issue 8.3: Magic Number for Minimum Qualified Athletes
- **File:** `app/ui/dashboard/HighlightsCard.tsx`
- **Line:** 29
- **Severity:** Low
- **Description:** `athletes.filter((a) => a.runs >= 3)` - the number 3 is magic.
- **Suggested Fix:** Define `const MIN_RUNS_FOR_QUALIFICATION = 3;`

#### Issue 8.4: Magic Numbers in API Routes
- **File:** `app/api/club/stats/route.ts`
- **Lines:** Multiple (1, 365 for days validation)
- **Severity:** Low
- **Description:** Min/max day bounds are magic numbers.
- **Suggested Fix:** Define constants like `MIN_DAYS = 1`, `MAX_DAYS = 365`.

---

### 9. Functions Exceeding 50 Lines

#### Issue 9.1: useWeeklyWinners Hook
- **File:** `lib/hooks/useWeeklyWinners.ts`
- **Lines:** 7-83 (76 lines including useMemo)
- **Severity:** Medium
- **Description:** The useMemo callback spans ~70 lines of complex logic.
- **Suggested Fix:** Extract streak calculation and winner aggregation into separate pure functions.

#### Issue 9.2: InjuryVolumeChart Component
- **File:** `app/ui/injury-insights/InjuryVolumeChart.tsx`
- **Lines:** 76-210 (134 lines)
- **Severity:** Medium
- **Description:** Long component with inline dot rendering function.
- **Suggested Fix:** Extract the custom dot rendering into a separate component.

#### Issue 9.3: TeamPerformanceCard Component
- **File:** `app/ui/team/TeamPerformanceCard.tsx`
- **Lines:** 35-208 (173 lines)
- **Severity:** Medium
- **Description:** Component handles both comparison and breakdown chart rendering.
- **Suggested Fix:** Consider splitting into `TeamComparisonChart` and `TeamBreakdownChart` components.

---

### 10. Missing Null/Undefined Checks

#### Issue 10.1: Potential Null Access in LeaderboardCard
- **File:** `app/ui/common/LeaderboardCard.tsx`
- **Line:** 230
- **Severity:** High
- **Description:** `const streakCount = athlete.streak ?? 0;` - Good use of nullish coalescing, but the line before (`case "streak":`) doesn't have `const` keyword which appears to be an ESLint issue.
- **Suggested Fix:** This is actually fine, but verify ESLint config allows this pattern.

#### Issue 10.2: Unsafe Optional Chaining in DashboardView
- **File:** `app/ui/dashboard/DashboardView.tsx`
- **Line:** 94
- **Severity:** Medium
- **Description:** `badgeValue={stats.overall.totalRuns}` - accesses `stats.overall` without optional chaining, but `stats` could be undefined based on the derived atom's empty state.
- **Suggested Fix:** Use `stats?.overall?.totalRuns ?? 0` or ensure stats always has a default structure.

#### Issue 10.3: Missing Null Check in WeekSelector
- **File:** `app/ui/weekly-winners/WeekSelector.tsx`
- **Lines:** 45-57
- **Severity:** Low
- **Description:** Inline styles are used without null checks, though this is not a runtime issue, it's a pattern concern.

---

## Recommendations Summary

### Immediate Actions (High Priority)
1. Add React Error Boundaries to prevent full app crashes
2. Refactor `TeamsView.tsx` to reduce complexity
3. Extract duplicated chart data processing into reusable functions
4. Ensure all API error logging uses a consistent logger utility

### Short-term Improvements (Medium Priority)
1. Create a `useLastUpdatedText` custom hook to eliminate duplication
2. Add constants for all magic numbers
3. Move hardcoded date cutoffs to configuration
4. Refactor long functions (>50 lines) into smaller units

### Code Cleanup (Low Priority)
1. Remove unused imports and functions
2. Standardize quote styles across codebase
3. Consolidate duplicate timeAgo implementations
4. Rename `getAthleteStatus` return function for clarity

---

## Files with Most Issues

| File | Issue Count |
|------|-------------|
| `app/ui/team/TeamsView.tsx` | 4 |
| `app/ui/dashboard/LatestRunsCard.tsx` | 2 |
| `lib/state/atoms.ts` | 2 |
| `app/api/club/stats/route.ts` | 3 |
