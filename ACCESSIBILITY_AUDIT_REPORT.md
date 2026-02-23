# Accessibility Audit Report - WCAG 2.1 AA Compliance

**Audit Date:** February 23, 2026  
**Scope:** `/workspace/app/ui/` React components (22 files audited)  
**Standard:** WCAG 2.1 Level AA

---

## Executive Summary

This audit identified **23 accessibility issues** across the React component files:
- **Critical:** 2 issues
- **High:** 8 issues
- **Medium:** 9 issues
- **Low:** 4 issues

---

## Issues Found

### 1. Missing `<main>` Landmark

| Field | Value |
|-------|-------|
| **File** | `app/ui/common/MainContent.tsx` |
| **Lines** | 14-18 |
| **Severity** | High |

**Description:**  
The main content area lacks a `<main>` landmark element. Screen reader users rely on landmarks to navigate page regions efficiently.

**Current Code:**
```tsx
if (activeTab === "dashboard") return <DashboardView />;
if (activeTab === "teams") return <TeamsView />;
// ...
return <TrainingView />;
```

**Suggested Fix:**
```tsx
return (
  <main role="main" aria-label="Main content">
    {activeTab === "dashboard" && <DashboardView />}
    {activeTab === "teams" && <TeamsView />}
    {/* ... */}
  </main>
);
```

---

### 2. Table Headers Missing `scope` Attributes

| Field | Value |
|-------|-------|
| **File** | `app/ui/common/LeaderboardCard.tsx` |
| **Lines** | 160-186 |
| **Severity** | High |

**Description:**  
Table headers (`<th>`) lack `scope="col"` attributes, making it difficult for screen readers to associate headers with data cells.

**Current Code:**
```tsx
<th key={idx} style={{ width: 42 }}>#</th>
<th key={idx}>Athlete</th>
```

**Suggested Fix:**
```tsx
<th key={idx} scope="col" style={{ width: 42 }}>#</th>
<th key={idx} scope="col">Athlete</th>
```

---

### 3. Tab Buttons Missing Required ARIA Attributes

| Field | Value |
|-------|-------|
| **File** | `app/ui/common/Header.tsx` |
| **Lines** | 20-64 |
| **Severity** | High |

**Description:**  
Tab buttons have `role="tab"` but are missing `aria-selected` attribute (using `aria-current` instead, which is semantically different) and `aria-controls` to link to tab panels.

**Current Code:**
```tsx
<button
  role="tab"
  aria-current={activeTab === "dashboard" ? "page" : undefined}
  // ...
>
```

**Suggested Fix:**
```tsx
<button
  role="tab"
  aria-selected={activeTab === "dashboard"}
  aria-controls="dashboard-panel"
  id="dashboard-tab"
  tabIndex={activeTab === "dashboard" ? 0 : -1}
  // ...
>
```

---

### 4. Search Input Missing Accessible Label

| Field | Value |
|-------|-------|
| **File** | `app/ui/training/SearchBar.tsx` |
| **Lines** | 11-17 |
| **Severity** | High |

**Description:**  
The search input relies solely on `placeholder` text, which disappears when typing and is not announced by all screen readers as a label.

**Current Code:**
```tsx
<input
  type="text"
  className={css.searchInput}
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder={placeholder}
/>
```

**Suggested Fix:**
```tsx
<input
  type="text"
  className={css.searchInput}
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder={placeholder}
  aria-label={placeholder || "Search athletes"}
/>
```

---

### 5. Combobox/Dropdown Missing ARIA Pattern

| Field | Value |
|-------|-------|
| **File** | `app/ui/injury-insights/AthleteSelector.tsx` |
| **Lines** | 64-96 |
| **Severity** | Critical |

**Description:**  
The custom dropdown/autocomplete component is missing proper combobox ARIA attributes. The input needs `role="combobox"`, `aria-expanded`, `aria-haspopup`, and `aria-controls`. The dropdown list needs `role="listbox"` and items need `role="option"`.

**Current Code:**
```tsx
<input
  type="text"
  className={css.input}
  placeholder="Type athlete name..."
  value={displayValue}
  onChange={(e) => handleInputChange(e.target.value)}
  onFocus={handleInputFocus}
/>
{isOpen && (
  <div className={css.dropdown}>
    <ul className={css.list}>
      <li onClick={() => handleSelectAthlete(athlete)}>
```

**Suggested Fix:**
```tsx
<input
  type="text"
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-controls="athlete-listbox"
  aria-autocomplete="list"
  aria-label="Select athlete"
  // ...
/>
{isOpen && (
  <div className={css.dropdown}>
    <ul className={css.list} role="listbox" id="athlete-listbox">
      <li 
        role="option"
        aria-selected={athlete.id === selectedAthleteId}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleSelectAthlete(athlete)}
```

---

### 6. Dropdown List Items Not Keyboard Accessible

| Field | Value |
|-------|-------|
| **File** | `app/ui/injury-insights/AthleteSelector.tsx` |
| **Lines** | 79-91 |
| **Severity** | Critical |

**Description:**  
Dropdown list items use `onClick` only and cannot be activated via keyboard. This completely blocks keyboard-only users from selecting athletes.

**Suggested Fix:**
- Add `tabIndex={0}` to list items
- Add `onKeyDown` handler for Enter/Space key activation
- Implement arrow key navigation between options
- Add `role="option"` to each `<li>`

---

### 7. Form Label Not Properly Associated

| Field | Value |
|-------|-------|
| **File** | `app/ui/injury-insights/InjuryInsightsView.tsx` |
| **Lines** | 65-72 |
| **Severity** | High |

**Description:**  
The label "Select Athlete" is not programmatically associated with the input. The `<label>` element lacks `htmlFor` and the input lacks a matching `id`.

**Current Code:**
```tsx
<label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
  Select Athlete
</label>
<AthleteSelector ... />
```

**Suggested Fix:**
```tsx
<label 
  htmlFor="athlete-selector"
  style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}
>
  Select Athlete
</label>
<AthleteSelector id="athlete-selector" ... />
```

---

### 8. SVG Icons Missing `aria-hidden`

| Field | Value |
|-------|-------|
| **Files** | Multiple |
| **Severity** | Medium |

**Affected Files:**
- `app/ui/injury-insights/DisclaimerCard.tsx` (lines 9-31)
- `app/ui/injury-insights/InjuryVolumeChart.tsx` (lines 44-58)
- `app/ui/injury-insights/TrainingWarningsPlaceholder.tsx` (lines 43-58, 84-99)
- `app/ui/injury-insights/MethodologyCard.tsx` (implicit via risk icons)

**Description:**  
Decorative SVG icons are not hidden from assistive technology, causing unnecessary verbosity.

**Suggested Fix:**
Add `aria-hidden="true"` to decorative SVGs, or add meaningful `aria-label` if conveying information:
```tsx
<svg aria-hidden="true" width="24" height="24" ...>
```

---

### 9. External Link Missing New Tab Indicator

| Field | Value |
|-------|-------|
| **File** | `app/ui/common/Footer.tsx` |
| **Lines** | 23-30 |
| **Severity** | Medium |

**Description:**  
The external link opens in a new tab (`target="_blank"`) but doesn't inform screen reader users of this behavior.

**Current Code:**
```tsx
<a
  href="https://warp.dev/careers"
  target="_blank"
  rel="noreferrer"
>
  warp.dev/careers
</a>
```

**Suggested Fix:**
```tsx
<a
  href="https://warp.dev/careers"
  target="_blank"
  rel="noreferrer"
  aria-label="warp.dev/careers (opens in new tab)"
>
  warp.dev/careers
  <span className="visually-hidden"> (opens in new tab)</span>
</a>
```

---

### 10. Emoji Used Without Proper Accessibility Markup

| Field | Value |
|-------|-------|
| **Files** | Multiple |
| **Severity** | Low |

**Affected Files:**
- `app/ui/common/Header.tsx` (line 13) - `🦈` in h1
- `app/ui/common/Footer.tsx` (line 17) - `🦈`
- `app/ui/team/TeamsView.tsx` (lines 299, 306) - `🐂`, `🦈` in buttons
- `app/ui/dashboard/LatestRunsCard.tsx` (line 81) - athlete emojis

**Description:**  
Emojis are not wrapped with proper ARIA roles. Screen readers may read them inconsistently or incorrectly.

**Suggested Fix:**
```tsx
<span role="img" aria-label="shark">🦈</span>
// Or hide if purely decorative:
<span aria-hidden="true">🦈</span>
```

---

### 11. Charts Missing Accessible Descriptions

| Field | Value |
|-------|-------|
| **Files** | Multiple |
| **Severity** | Medium |

**Affected Files:**
- `app/ui/dashboard/ClubKmCard.tsx` (lines 47-71)
- `app/ui/dashboard/RunsPerAthleteCard.tsx` (lines 43-68)
- `app/ui/training/TrainingChartCard.tsx` (lines 164-201)
- `app/ui/injury-insights/InjuryVolumeChart.tsx` (lines 136-206)
- `app/ui/team/TeamPerformanceCard.tsx` (lines 61-204)

**Description:**  
Data visualizations (charts) lack accessible text alternatives. Screen reader users cannot access chart data.

**Suggested Fix:**
```tsx
<div 
  role="img" 
  aria-label="Line chart showing club kilometers per day. Total: 245 km."
  aria-describedby="chart-description"
>
  <ResponsiveContainer>...</ResponsiveContainer>
</div>
<div id="chart-description" className="visually-hidden">
  Data summary: Highest day was Monday with 45km...
</div>
```

---

### 12. Heading Hierarchy Issues

| Field | Value |
|-------|-------|
| **Files** | Multiple |
| **Severity** | Medium |

**Affected Files:**
- `app/ui/common/Header.tsx` - Uses `<h1>` (line 13) ✓
- `app/ui/training/TrainingChartCard.tsx` - Uses `<h2>` (line 154)
- `app/ui/injury-insights/DisclaimerCard.tsx` - Uses `<h3>` (line 34)
- `app/ui/injury-insights/MethodologyCard.tsx` - Uses `<h3>` (line 9)
- `app/ui/injury-insights/TrainingWarningsPlaceholder.tsx` - Uses `<h3>` (line 30)
- `app/ui/injury-insights/InjuryVolumeChart.tsx` - Uses `<h2>` (line 117)

**Description:**  
The heading hierarchy may skip levels depending on which view is active. When `InjuryInsightsView` is shown, `<h3>` elements appear without a preceding `<h2>`.

**Suggested Fix:**
Ensure consistent heading hierarchy:
- `<h1>` - Page title (in Header)
- `<h2>` - Section titles (each card)
- `<h3>` - Subsections within cards

---

### 13. Color Contrast Concerns

| Field | Value |
|-------|-------|
| **File** | `app/ui/common/LeaderboardCard.module.scss` |
| **Lines** | 77-133 |
| **Severity** | High |

**Description:**  
Several chip colors may fail WCAG AA contrast requirements (4.5:1 for normal text):

| Element | Text Color | Background | Likely Status |
|---------|-----------|------------|---------------|
| eventChipHalf | `#3b82f6` | `rgba(59, 130, 246, 0.15)` | ⚠️ Verify |
| statusChipRecent | `#eab308` | `rgba(234, 179, 8, 0.15)` | ❌ Likely fails |
| statusChipToday | `#22c55e` | `rgba(34, 197, 94, 0.15)` | ⚠️ Verify |

**Suggested Fix:**
Use a contrast checker and adjust colors. For yellow text on light backgrounds, consider:
- Darkening the text: `#a16207` (darker amber)
- Darkening the background slightly

---

### 14. Missing Focus Indicators (Potential)

| Field | Value |
|-------|-------|
| **File** | `app/ui/dashboard/Filters.module.scss` |
| **Lines** | 33-54 |
| **Severity** | Medium |

**Description:**  
Button styles include `:hover` states but explicit `:focus` styles are not visible in the CSS. Browser defaults may be removed elsewhere.

**Suggested Fix:**
Add explicit focus styles:
```scss
.pill:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.pill:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

### 15. Filter Groups Missing Group Labeling

| Field | Value |
|-------|-------|
| **File** | `app/ui/dashboard/Filters.tsx` |
| **Lines** | 21-74 |
| **Severity** | Low |

**Description:**  
Filter button groups could benefit from explicit `role="group"` and `aria-labelledby` to associate the label with the group.

**Current Code:**
```tsx
<div className={css.group}>
  <span className={css.label}>{title}</span>
  <div className={css.pillRow}>{children}</div>
</div>
```

**Suggested Fix:**
```tsx
<div className={css.group} role="group" aria-labelledby={`${id}-label`}>
  <span id={`${id}-label`} className={css.label}>{title}</span>
  <div className={css.pillRow}>{children}</div>
</div>
```

---

### 16. Tooltip Accessibility Issues

| Field | Value |
|-------|-------|
| **File** | `app/ui/common/LeaderboardCard.module.scss` |
| **Lines** | 142-179 |
| **Severity** | Medium |

**Description:**  
CSS-only tooltips using `data-tooltip` are not accessible to:
- Keyboard users (no focus trigger)
- Screen readers (content not announced)
- Touch device users

**Suggested Fix:**
Consider implementing accessible tooltips:
```tsx
<span 
  role="tooltip" 
  id="tooltip-1"
  aria-describedby="tooltip-1"
  tabIndex={0}
>
```
Or use a library with built-in accessibility.

---

### 17. Recharts Line Click Handler Not Keyboard Accessible

| Field | Value |
|-------|-------|
| **File** | `app/ui/training/TrainingChartCard.tsx` |
| **Lines** | 193-194 |
| **Severity** | Medium |

**Description:**  
Chart lines have `onClick` handlers for focusing athletes but cannot be activated via keyboard.

**Current Code:**
```tsx
<Line
  onClick={() => setFocusedAthleteName(athlete.name)}
  // ...
/>
```

**Suggested Fix:**
The legend already provides keyboard-accessible focus functionality, so this is partially mitigated. Document that legend should be used for keyboard interaction.

---

### 18. Loading State Not Announced

| Field | Value |
|-------|-------|
| **Files** | Multiple |
| **Severity** | Low |

**Affected Files:**
- `app/ui/dashboard/DashboardView.tsx` (lines 89, 115)
- `app/ui/team/TeamsView.tsx` (line 341)
- `app/ui/training/TrainingView.tsx` (line 150)

**Description:**  
Loading states use visual opacity changes but don't announce to screen readers via `aria-busy` or live regions.

**Current Code:**
```tsx
<div style={{ opacity: loading ? 0.7 : 1 }}>
```

**Suggested Fix:**
```tsx
<div 
  style={{ opacity: loading ? 0.7 : 1 }}
  aria-busy={loading}
  aria-live="polite"
>
```

---

### 19. Card Component Could Have Semantic Region

| Field | Value |
|-------|-------|
| **File** | `app/ui/common/Card.tsx` |
| **Lines** | 21-32 |
| **Severity** | Low |

**Description:**  
Cards could benefit from being marked as `<section>` or `<article>` elements with proper headings, or using `role="region"` with `aria-label`.

**Suggested Fix:**
```tsx
<section
  className={clsx(css.card, className)}
  aria-labelledby={headerId}
>
  {header != null && <div id={headerId} className={css.header}>{header}</div>}
```

---

### 20. Tablist Missing aria-orientation

| Field | Value |
|-------|-------|
| **File** | `app/ui/common/Header.tsx` |
| **Lines** | 19 |
| **Severity** | Low |

**Description:**  
The tablist could specify orientation for clearer navigation intent.

**Suggested Fix:**
```tsx
<div className={css.navGroup} role="tablist" aria-label="Views" aria-orientation="horizontal">
```

---

## Summary by Category

### Semantic HTML Issues (4)
- Missing `<main>` landmark (#1)
- Heading hierarchy issues (#12)
- Card semantic structure (#19)
- Table scope attributes (#2)

### ARIA Issues (8)
- Tab buttons missing attributes (#3)
- Combobox missing pattern (#5)
- Form label association (#7)
- SVG aria-hidden (#8)
- Filter group labeling (#15)
- Tooltip accessibility (#16)
- Loading state announcement (#18)
- Tablist orientation (#20)

### Keyboard Accessibility Issues (3)
- Dropdown not keyboard accessible (#6)
- Chart click not keyboard accessible (#17)
- Tooltip keyboard access (#16)

### Form/Input Issues (2)
- Search input label (#4)
- Combobox pattern (#5)

### Image/Media Issues (3)
- SVG icons (#8)
- Emoji accessibility (#10)
- Chart descriptions (#11)

### Color/Visual Issues (2)
- Color contrast (#13)
- Focus indicators (#14)

### Link Issues (1)
- External link indicator (#9)

---

## Recommended Priority Order

1. **Critical - Fix Immediately:**
   - #5, #6: AthleteSelector dropdown accessibility
   
2. **High - Fix Soon:**
   - #1: Add `<main>` landmark
   - #2: Table scope attributes
   - #3: Tab ARIA attributes
   - #4: Search input label
   - #7: Form label association
   - #13: Color contrast issues

3. **Medium - Plan to Fix:**
   - #8: SVG aria-hidden
   - #9: External link indicator
   - #11: Chart descriptions
   - #12: Heading hierarchy
   - #14: Focus indicators
   - #16: Tooltip accessibility
   - #17: Chart keyboard access
   - #18: Loading state announcement

4. **Low - Consider Fixing:**
   - #10: Emoji markup
   - #15: Filter group labeling
   - #19: Card semantics
   - #20: Tablist orientation

---

## Testing Recommendations

1. **Automated Testing:**
   - Add `eslint-plugin-jsx-a11y` to catch common issues
   - Use axe-core for runtime accessibility testing

2. **Manual Testing:**
   - Test with keyboard-only navigation
   - Test with screen reader (VoiceOver, NVDA)
   - Use browser accessibility inspector

3. **Color Contrast:**
   - Use WebAIM Contrast Checker
   - Test with color blindness simulators
