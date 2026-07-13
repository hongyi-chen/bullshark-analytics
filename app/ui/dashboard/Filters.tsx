import { Aggregation, TimeFilter } from "../types";
import css from "./Filters.module.scss";

interface FiltersProps {
  aggregation: Aggregation;
  minRuns: number;
  setAggregation: (aggregation: Aggregation) => void;
  setMinRuns: (minRuns: number) => void;
  setTimeFilter: (timeFilter: TimeFilter) => void;
  timeFilter: TimeFilter;
}

export default function Filters({
  aggregation,
  minRuns,
  setAggregation,
  setMinRuns,
  setTimeFilter,
  timeFilter,
}: FiltersProps) {
  return (
    <div className={css.card} role="group" aria-label="Dashboard filters">
      <FilterGroup title="Time Period" groupId="time-period">
        <button
          className={css.pill}
          aria-pressed={timeFilter === "week"}
          onClick={() => setTimeFilter("week")}
          type="button"
        >
          This Week
        </button>
        <button
          className={css.pill}
          aria-pressed={timeFilter === "month"}
          onClick={() => setTimeFilter("month")}
          type="button"
        >
          This Month
        </button>
      </FilterGroup>

      <div className={css.divider} role="separator" aria-hidden="true" />

      <FilterGroup title="Chart View" groupId="chart-view">
        {(["daily", "weekly"] as const).map((agg) => (
          <button
            key={agg}
            className={css.pill}
            aria-pressed={aggregation === agg}
            onClick={() => setAggregation(agg)}
            type="button"
          >
            {agg === "daily" ? "Daily" : "Weekly"}
          </button>
        ))}
      </FilterGroup>

      <div className={css.divider} role="separator" aria-hidden="true" />

      <FilterGroup title="Min Runs" groupId="min-runs">
        {[0, 3, 5, 10].map((m) => (
          <button
            key={m}
            className={css.pill}
            aria-pressed={minRuns === m}
            onClick={() => setMinRuns(m)}
            type="button"
          >
            {m === 0 ? "All" : `${m}+`}
          </button>
        ))}
      </FilterGroup>
    </div>
  );
}

interface FilterGroupProps extends React.PropsWithChildren {
  title: string;
  groupId?: string;
}

function FilterGroup({ children, title, groupId }: FilterGroupProps) {
  const labelId = groupId ? `${groupId}-label` : undefined;
  return (
    <fieldset className={css.group} style={{ border: 'none', margin: 0, padding: 0 }}>
      <legend id={labelId} className={css.label}>{title}</legend>
      <div className={css.pillRow} role="group" aria-labelledby={labelId}>{children}</div>
    </fieldset>
  );
}
