# Performance Review Report

This document identifies performance issues in the codebase and provides optimization recommendations.

---

## 1. Components Causing Unnecessary Re-renders

### Issue 1.1: Using `useAtom` instead of `useAtomValue` for read-only values
**File:** `app/ui/dashboard/DashboardView.tsx`
**Lines:** 26-27, 65
**Impact:** Medium

```typescript
const [loading] = useAtom(loadingState);
const [err] = useAtom(errorState);
const [, setLastUpdatedText] = useAtom(lastUpdatedTextState);
```

**Problem:** `useAtom` returns a setter even when not needed, causing unnecessary subscriptions.

**Suggested Fix:**
```typescript
const loading = useAtomValue(loadingState);
const err = useAtomValue(errorState);
const setLastUpdatedText = useSetAtom(lastUpdatedTextState);
```

---

### Issue 1.2: Duplicate function calls in render loop
**File:** `app/ui/dashboard/LatestRunsCard.tsx`
**Lines:** 77-81
**Impact:** Low

```typescript
style={{
  background: getAthleteEmojiAndBackground(run.athleteName).background,
}}
>
  {getAthleteEmojiAndBackground(run.athleteName).emoji}
```

**Problem:** `getAthleteEmojiAndBackground` is called twice per athlete.

**Suggested Fix:**
```typescript
const { emoji, background } = getAthleteEmojiAndBackground(run.athleteName);
// Then use emoji and background separately
```

---

### Issue 1.3: Functions recreated on every render
**File:** `app/ui/common/LeaderboardCard.tsx`
**Lines:** 156-187, 190-241
**Impact:** Medium

**Problem:** `renderHeaders()` and `renderCells()` are defined inside the component and recreated on every render.

**Suggested Fix:** Extract these as memoized components or move outside the component if they don't need closure variables.

---

## 2. Missing useMemo/useCallback Optimizations

### Issue 2.1: Inline onClick handlers in filter buttons
**File:** `app/ui/dashboard/Filters.tsx`
**Lines:** 27, 32, 49, 65
**Impact:** Low

```typescript
onClick={() => setTimeFilter("week")}
onClick={() => setTimeFilter("month")}
onClick={() => setAggregation(agg)}
onClick={() => setMinRuns(m)}
```

**Problem:** New function references created on every render. While React handles this efficiently, it can cause unnecessary re-renders in memoized children.

**Suggested Fix:** Use `useCallback` for handlers or create stable handler references.

---

### Issue 2.2: Inline callbacks in TrainingChartCard
**File:** `app/ui/training/TrainingChartCard.tsx`
**Lines:** 160-161
**Impact:** Medium

```typescript
onToggle={(athleteName) => setFocusedAthleteName(prev => (prev === athleteName ? null : athleteName))}
onClear={() => setFocusedAthleteName(null)}
```

**Problem:** These callbacks are recreated on every render and passed to child component.

**Suggested Fix:**
```typescript
const handleToggle = useCallback((athleteName: string) => {
  setFocusedAthleteName(prev => (prev === athleteName ? null : athleteName));
}, []);

const handleClear = useCallback(() => {
  setFocusedAthleteName(null);
}, []);
```

---

### Issue 2.3: Missing dependency in useMemo
**File:** `app/ui/dashboard/HighlightsCard.tsx`
**Line:** 59
**Impact:** Medium

```typescript
}, [athletes, chartData]);
```

**Problem:** `stats` is used inside the useMemo but not included in dependencies. While this happens to work because `stats` is passed as a prop, it's technically incorrect and could cause stale data.

**Suggested Fix:** Add `stats` to the dependency array:
```typescript
}, [athletes, chartData, stats]);
```

---

### Issue 2.4: Handler functions recreated on every render
**File:** `app/ui/weekly-winners/WeekSelector.tsx`
**Lines:** 13-26
**Impact:** Low

```typescript
const handlePrevious = () => { ... };
const handleNext = () => { ... };
```

**Problem:** These functions are recreated on every render.

**Suggested Fix:** Wrap with `useCallback`:
```typescript
const handlePrevious = useCallback(() => {
  const prev = subWeeks(weekDate, 1);
  onWeekChange(format(prev, 'yyyy-MM-dd'));
}, [weekDate, onWeekChange]);
```

---

### Issue 2.5: Inline onClick handlers in Header navigation
**File:** `app/ui/common/Header.tsx`
**Lines:** 23, 34, 44, 50, 59
**Impact:** Low

```typescript
onClick={() => setActiveTab('dashboard')}
onClick={() => setActiveTab('teams')}
// etc.
```

**Suggested Fix:** Create a single handler with parameter:
```typescript
const handleTabChange = useCallback((tab: typeof activeTab) => {
  setActiveTab(tab);
}, [setActiveTab]);
```

---

## 3. Large Inline Functions in Render

### Issue 3.1: Complex inline Tooltip content
**File:** `app/ui/team/TeamPerformanceCard.tsx`
**Lines:** 84-108, 154-178
**Impact:** Medium

**Problem:** Large render functions for Tooltip content are defined inline, creating new component instances on every render.

**Suggested Fix:** Extract to separate memoized components:
```typescript
const ComparisonTooltip = memo(({ active, payload, label }: TooltipProps) => {
  // ... tooltip content
});
```

---

### Issue 3.2: Complex inline dot render function
**File:** `app/ui/injury-insights/InjuryVolumeChart.tsx`
**Lines:** 170-202
**Impact:** Medium

**Problem:** Complex SVG rendering logic in inline `dot` prop function.

**Suggested Fix:** Extract to a separate component:
```typescript
const RiskDot = memo(({ cx, cy, payload }: DotProps) => {
  // ... dot rendering logic
});

// Usage:
dot={<RiskDot />}
```

---

## 4. Missing React.memo for Pure Components

### Issue 4.1: Presentational components without memoization
**Impact:** Medium

The following components are pure (deterministic based on props) and would benefit from `React.memo`:

| File | Component | Why |
|------|-----------|-----|
| `app/ui/common/Card.tsx` | `Card` | Pure presentational, receives only props |
| `app/ui/common/ErrorCard.tsx` | `ErrorCard` | Simple error display |
| `app/ui/common/ChartTooltip.tsx` | `ChartTooltip` | Tooltip component |
| `app/ui/training/SearchBar.tsx` | `SearchBar` | Controlled input |
| `app/ui/weekly-winners/WeeklyLeaderboard.tsx` | `WeeklyLeaderboard` | Wrapper component |
| `app/ui/weekly-winners/WeekSelector.tsx` | `WeekSelector` | Navigation component |
| `app/ui/common/LeaderboardCard.tsx` | `EventChip`, `StatusChip`, `TeamChip` | Small chip components |
| `app/ui/dashboard/Filters.tsx` | `FilterGroup` | Layout component |

**Suggested Fix:**
```typescript
const Card = memo(function Card({ children, ...props }: CardProps) {
  // ...
});
```

---

## 5. Package.json Dependencies Analysis

**File:** `package.json`
**Impact:** High

### Current Dependencies:
```json
{
  "recharts": "^3.6.0",      // ~300KB minified
  "date-fns": "^4.1.0",      // Tree-shakeable, good choice
  "jotai": "^2.16.0",        // ~3KB, excellent choice
  "clsx": "^2.1.1",          // <1KB, excellent
  "zod": "^4.2.1"            // ~50KB
}
```

### Observations:
- **No unused dependencies detected** - All listed dependencies are actively used.
- **recharts is heavy** (~300KB) but necessary for the charts. Consider:
  - Lazy loading chart components
  - Alternative: `lightweight-charts` (~40KB) or `uplot` (~25KB) for simpler needs

### Recommendation:
Add bundle analysis to monitor dependency sizes:
```bash
npm install --save-dev @next/bundle-analyzer
```

---

## 6. Image Optimization Opportunities

**Impact:** Low

### Current State:
- Only 1 image found: `app/icon.svg`
- SVG is already optimized for web delivery

### Recommendations:
- **No issues found** - The app uses emojis for avatars instead of images, which is lightweight.
- If raster images are added in the future, use Next.js `Image` component for automatic optimization.

---

## 7. Code Splitting Opportunities

### Issue 7.1: Eager loading of all view components
**File:** `app/ui/common/MainContent.tsx`
**Lines:** 4-8
**Impact:** High

```typescript
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";
```

**Problem:** All 5 view components (including their chart dependencies) are loaded upfront, even when only one tab is displayed.

**Suggested Fix:** Use dynamic imports with `next/dynamic`:
```typescript
import dynamic from 'next/dynamic';

const DashboardView = dynamic(() => import('../dashboard/DashboardView'), {
  loading: () => <LoadingSkeleton />,
});
const TeamsView = dynamic(() => import('../team/TeamsView'));
const TrainingView = dynamic(() => import('../training/TrainingView'));
const InjuryInsightsView = dynamic(() => import('../injury-insights/InjuryInsightsView'));
const WeeklyWinnersView = dynamic(() => import('../weekly-winners/WeeklyWinnersView'));
```

**Estimated Bundle Size Reduction:** ~40-60% initial JS load

---

### Issue 7.2: Chart components loaded globally
**Impact:** Medium

**Problem:** `recharts` components are imported in multiple files, preventing effective code splitting.

**Suggested Fix:** Create a central lazy-loaded chart wrapper:
```typescript
// lib/charts/index.ts
export const LazyLineChart = dynamic(() => 
  import('recharts').then(mod => mod.LineChart)
);
```

---

## 8. Heavy Computations That Could Be Optimized

### Issue 8.1: Expensive derived atom computation
**File:** `lib/state/atoms.ts`
**Lines:** 86-149
**Impact:** High

**Problem:** `activityStatsAtom` performs heavy computation (iterating all activities, building Maps, sorting) on every activities change.

```typescript
export const activityStatsAtom = atom((get) => {
  const activities = get(activitiesState);
  // ... 60+ lines of computation
});
```

**Suggested Fix:** Consider:
1. Moving computation to the API layer (compute on server)
2. Using a Web Worker for heavy computation
3. Using Jotai's `selectAtom` for partial subscriptions

---

### Issue 8.2: Duplicate Map iteration patterns
**File:** `app/ui/team/TeamsView.tsx`
**Lines:** 36-72, 75-112
**Impact:** Medium

**Problem:** `chartData` and `runningTotalsData` useMemo blocks have nearly identical iteration patterns over `teamStats`.

**Suggested Fix:** Combine into a single computation:
```typescript
const { chartData, runningTotalsData } = useMemo(() => {
  if (!teamStats) return { chartData: [], runningTotalsData: [] };
  
  const combined = new Map<string, { bullsKm: number; sharksKm: number; bullsRunning: number; sharksRunning: number }>();
  // Single iteration to build both datasets
  // ...
}, [teamStats]);
```

---

### Issue 8.3: Complex streak calculation on every render
**File:** `lib/hooks/useWeeklyWinners.ts`
**Lines:** 7-82
**Impact:** Medium

**Problem:** The entire streak calculation (iterating activities, grouping by athlete/week, calculating consecutive weeks) runs in a useMemo that depends on `[activities, weekStart]`.

**Suggested Fix:** 
1. Pre-compute athlete weeks in a separate memoized step
2. Only recalculate streaks when weekStart changes

```typescript
const athleteWeeks = useMemo(() => {
  // Group activities by athlete and week - only recompute when activities change
}, [activities]);

const leaderboard = useMemo(() => {
  // Calculate streaks using pre-computed athleteWeeks
}, [athleteWeeks, weekStart]);
```

---

## Summary of Priority Issues

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| High | Code splitting for views (7.1) | Significant bundle size reduction | Low |
| High | activityStatsAtom computation (8.1) | Reduces main thread blocking | Medium |
| Medium | React.memo for pure components (4.1) | Reduces re-renders | Low |
| Medium | Inline Tooltip functions (3.1) | Reduces component recreation | Low |
| Medium | useAtom → useAtomValue (1.1) | Cleaner subscriptions | Low |
| Medium | Combine duplicate iterations (8.2) | CPU optimization | Medium |
| Low | useCallback for handlers (2.1-2.5) | Minor optimization | Low |
| Low | Extract chart helper functions (3.2) | Code cleanliness | Low |

---

## Quick Wins (< 30 min implementation)

1. **Add React.memo to pure components** - Card, ErrorCard, SearchBar, etc.
2. **Change useAtom to useAtomValue** for read-only atom usage
3. **Extract Tooltip components** from inline functions
4. **Fix HighlightsCard dependency array** - add `stats` to useMemo deps
5. **Cache getAthleteEmojiAndBackground** result in LatestRunsCard loop

---

*Generated: 2026-02-23*
