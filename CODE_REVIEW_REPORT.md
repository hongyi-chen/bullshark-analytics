# TypeScript and React Code Review Report

**Date:** February 23, 2026  
**Scope:** `/workspace/app/ui/`, `/workspace/lib/hooks/`, `/workspace/lib/types/`, `/workspace/app/api/`

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 5     |
| Medium   | 7     |
| Low      | 4     |

---

## Critical Issues

### 1. Use of `any` type in InjuryVolumeChart.tsx

**File:** `app/ui/injury-insights/InjuryVolumeChart.tsx`  
**Line:** 170  
**Description:** Using `any` type for the recharts `dot` render prop loses all type safety and could lead to runtime errors.

```typescript
// Current code (line 170)
dot={(props: any) => {
  const { cx, cy, payload } = props;
```

**Suggested Fix:**

```typescript
interface DotProps {
  cx: number;
  cy: number;
  payload: ChartDataPoint;
  index: number;
}

// Then use:
dot={(props: DotProps) => {
  const { cx, cy, payload } = props;
```

---

## High Severity Issues

### 2. Missing dependency in useMemo - HighlightsCard.tsx

**File:** `app/ui/dashboard/HighlightsCard.tsx`  
**Line:** 21-59  
**Description:** The `highlights` useMemo computation accesses `stats` (lines 22-23) but `stats` is not included in the dependency array. This could lead to stale data being displayed.

```typescript
// Current code (line 21-59)
const highlights = useMemo(() => {
  const totalRuns = stats?.overall.totalRuns ?? 0;  // Uses stats!
  const totalKm = stats?.overall.totalKm ?? 0;      // Uses stats!
  // ...
}, [athletes, chartData]);  // Missing 'stats' dependency!
```

**Suggested Fix:**

```typescript
const highlights = useMemo(() => {
  const totalRuns = stats?.overall.totalRuns ?? 0;
  const totalKm = stats?.overall.totalKm ?? 0;
  // ...
}, [athletes, chartData, stats]);  // Add 'stats' to dependencies
```

---

### 3. Unsafe type assertion without validation in lib/state/api.ts

**File:** `lib/state/api.ts`  
**Line:** 84-86  
**Description:** The `fetchTeamStats` function uses a type assertion without validating the response structure, which could lead to runtime errors if the API response shape changes.

```typescript
// Current code (line 84-86)
export async function fetchTeamStats(): Promise<TeamStatsData> {
  const endpoint = '/api/team_stats';
  return fetchWithCache<TeamStatsData>(endpoint, (raw) => raw as TeamStatsData);
}
```

**Suggested Fix:**

```typescript
export async function fetchTeamStats(): Promise<TeamStatsData> {
  const endpoint = '/api/team_stats';
  return fetchWithCache<TeamStatsData>(endpoint, (raw) => {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Invalid team stats response: not an object');
    }
    const data = raw as Record<string, unknown>;
    if (!data.bulls || !data.sharks) {
      throw new Error('Invalid team stats response: missing bulls or sharks');
    }
    return raw as TeamStatsData;
  });
}
```

---

### 4. Incomplete tooltip payload interface - ChartTooltip.tsx

**File:** `app/ui/common/ChartTooltip.tsx`  
**Line:** 3-5  
**Description:** The `TooltipPayloadItem` interface only defines `value` but recharts tooltip payloads include additional important properties like `name`, `dataKey`, `color`, etc.

```typescript
// Current code (line 3-5)
interface TooltipPayloadItem {
  value?: number;
}
```

**Suggested Fix:**

```typescript
interface TooltipPayloadItem {
  value?: number;
  name?: string;
  dataKey?: string;
  color?: string;
  payload?: Record<string, unknown>;
}
```

---

### 5. Unhandled null/undefined in activityStatsAtom derived atom

**File:** `lib/state/atoms.ts`  
**Line:** 86-149  
**Description:** The `activityStatsAtom` returns an object that components access directly without null checks. While the empty state handles the case of no runs, the return type should be consistent and explicitly typed.

```typescript
// Current code returns different shapes based on conditions
// This works but could be more explicit
```

**Suggested Fix:** Add an explicit return type interface:

```typescript
export interface ActivityStatsResult {
  overall: {
    totalRuns: number;
    totalKm: number;
    longest: { athleteName: string; km: number } | null;
    shortest: { athleteName: string; km: number } | null;
    mostRuns: { athleteName: string; runs: number } | null;
  };
  athletes: Array<{
    athleteName: string;
    runs: number;
    totalKm: number;
    longestKm: number;
    shortestKm: number;
  }>;
  lastFetchedAt: string | null;
}

export const activityStatsAtom = atom<ActivityStatsResult>((get) => {
  // ...existing implementation
});
```

---

### 6. Variable declaration without block scope in switch case - LeaderboardCard.tsx

**File:** `app/ui/common/LeaderboardCard.tsx`  
**Line:** 230  
**Description:** Using `const` declaration directly in a switch case without block scope can lead to confusing behavior and potential issues with variable hoisting.

```typescript
// Current code (line 229-238)
case "streak":
  const streakCount = athlete.streak ?? 0;  // Problematic
  return (
    <td key={colIdx} style={TEXT_ALIGN_RIGHT}>
      // ...
    </td>
  );
```

**Suggested Fix:**

```typescript
case "streak": {
  const streakCount = athlete.streak ?? 0;
  return (
    <td key={colIdx} style={TEXT_ALIGN_RIGHT}>
      <span className={css.streakBadge}>
        <span className={css.streakIcon}>🔥</span>
        {streakCount}
      </span>
    </td>
  );
}
```

---

## Medium Severity Issues

### 7. Missing explicit event type in SearchBar.tsx

**File:** `app/ui/training/SearchBar.tsx`  
**Line:** 15  
**Description:** The `onChange` event handler's event type is inferred but should be explicit for better maintainability.

```typescript
// Current code (line 15)
onChange={(e) => onChange(e.target.value)}
```

**Suggested Fix:**

```typescript
onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
```

---

### 8. Missing event type annotation in AthleteSelector.tsx

**File:** `app/ui/injury-insights/AthleteSelector.tsx`  
**Line:** 35  
**Description:** The `handleClickOutside` function parameter should use a more specific type.

```typescript
// Current code (line 35)
function handleClickOutside(event: MouseEvent) {
```

This is actually correct but the event listener type could be more precise:

**Suggested Fix (optional improvement):**

```typescript
function handleClickOutside(event: globalThis.MouseEvent) {
```

---

### 9. Potential stale closure in TrainingChartCard.tsx

**File:** `app/ui/training/TrainingChartCard.tsx`  
**Line:** 113-117  
**Description:** The useEffect checks if the focused athlete is still present, but the dependency array could lead to unnecessary re-runs.

```typescript
// Current code (line 113-117)
useEffect(() => {
  if (focusedAthleteName == null) return;
  const stillPresent = athletes.some(athlete => athlete.name === focusedAthleteName);
  if (!stillPresent) setFocusedAthleteName(null);
}, [athletes, focusedAthleteName]);
```

**Analysis:** This is actually correct, but it could be optimized by using `useCallback` for the check function. **No immediate fix needed.**

---

### 10. Inconsistent error response structure in API routes

**File:** `app/api/athletes/route.ts`  
**Line:** 9-15  
**Description:** The error response includes `ok: false` but success responses don't include `ok: true`, making the API inconsistent.

```typescript
// Error response (line 11-14)
return NextResponse.json(
  { ok: false, error: 'Failed to fetch athletes from server' },
  { status: 502 }
);

// Success response (line 8)
return NextResponse.json(athletes);  // No 'ok' field
```

**Suggested Fix:** Either add `ok: true` to success responses or remove `ok: false` from error responses for consistency:

```typescript
// Option 1: Add ok to success
return NextResponse.json({ ok: true, data: athletes });

// Option 2: Remove ok from error (simpler)
return NextResponse.json(
  { error: 'Failed to fetch athletes from server' },
  { status: 502 }
);
```

---

### 11. Type cast without narrowing in useWeeklyWinners.ts

**File:** `lib/hooks/useWeeklyWinners.ts`  
**Line:** 14  
**Description:** The filter callback relies on implicit type narrowing that could be made more explicit.

```typescript
// Current code (line 14)
const runs = activities.filter(a => a.sport_type === 'Run');
```

**Suggested Fix (optional, for clarity):**

```typescript
const runs = activities.filter((a): a is ServerActivity & { sport_type: 'Run' } => 
  a.sport_type === 'Run'
);
```

---

### 12. useEffect for static value could use initial state - Footer.tsx

**File:** `app/ui/common/Footer.tsx`  
**Line:** 9-11  
**Description:** The useEffect is used to set the year on mount, but this could be done with initial state or could cause a flash of empty content.

```typescript
// Current code (line 7-11)
const [year, setYear] = useState("");

useEffect(() => {
  setYear(new Date().getFullYear().toString());
}, []);
```

**Suggested Fix:** Since this is for hydration mismatch avoidance (SSR), the current approach is acceptable. However, if SSR isn't a concern:

```typescript
const [year] = useState(() => new Date().getFullYear().toString());
```

---

### 13. Missing null check before accessing nested property

**File:** `app/ui/dashboard/DashboardView.tsx`  
**Line:** 94  
**Description:** Accessing `stats.overall.totalRuns` without null check when `stats` could potentially be in a loading state.

```typescript
// Current code (line 94)
badgeValue={stats.overall.totalRuns}
```

**Suggested Fix:**

```typescript
badgeValue={stats?.overall?.totalRuns ?? 0}
```

---

## Low Severity Issues

### 14. Unused import could be removed - several files

**Analysis:** All imports appear to be used. **No issues found.**

---

### 15. Redundant type assertion in server-api functions

**File:** `lib/server-api.ts`  
**Lines:** 45, 73, 101  
**Description:** Using `as Type` after already validating is redundant but harmless.

```typescript
// Line 45
return data as ServerActivity[];  // After Array.isArray check
```

**Suggested Fix (optional):** The type assertion is fine since TypeScript doesn't narrow based on Array.isArray() to the element type. **No change needed.**

---

### 16. Hardcoded date cutoff in stats route

**File:** `app/api/club/stats/route.ts`  
**Line:** 7  
**Description:** The `DATE_CUTOFF` constant is hardcoded. Consider moving to environment config.

```typescript
// Current code (line 7)
const DATE_CUTOFF = new Date('2025-12-15T00:00:00Z');
```

**Suggested Fix:** Move to environment variable or config file for easier maintenance.

---

### 17. Console.error in production code

**File:** Multiple API routes  
**Description:** API routes use `console.error` for logging, which is appropriate for development but should use a proper logging solution in production.

**Suggested Fix:** Consider using a structured logging library like `pino` or `winston` for production deployments.

---

## Component Composition Improvements

### 18. Header navigation buttons could be extracted

**File:** `app/ui/common/Header.tsx`  
**Lines:** 20-64  
**Description:** The navigation buttons have repeated patterns that could be extracted into a reusable component.

**Suggested Improvement:**

```typescript
interface NavButtonProps {
  tab: 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';
  label: string;
  activeTab: string;
  onClick: () => void;
}

function NavButton({ tab, label, activeTab, onClick }: NavButtonProps) {
  return (
    <button
      className={`${css.navPill} ${activeTab === tab ? css.navPillActive : ""}`}
      aria-current={activeTab === tab ? "page" : undefined}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {label}
    </button>
  );
}
```

---

## Summary of Required Actions

### Must Fix (Critical/High)
1. Replace `any` with proper type in InjuryVolumeChart.tsx
2. Add `stats` to useMemo dependencies in HighlightsCard.tsx
3. Add validation to fetchTeamStats in api.ts
4. Expand TooltipPayloadItem interface
5. Add block scope to switch case in LeaderboardCard.tsx

### Should Fix (Medium)
6. Add explicit event types where missing
7. Standardize API response structures
8. Add null safety checks

### Consider (Low)
9. Extract repeated component patterns
10. Move hardcoded values to configuration
11. Implement structured logging

---

*Report generated by code review agent*
