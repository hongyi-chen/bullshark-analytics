import { useId } from "react";
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
    <section className={css.card} aria-label="Dashboard filters">
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

      <div className={css.divider} aria-hidden="true" />

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

      <div className={css.divider} aria-hidden="true" />

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
    </section>
  );
}

interface FilterGroupProps extends React.PropsWithChildren {
  title: string;
  groupId: string;
}

function FilterGroup({ children, title, groupId }: FilterGroupProps) {
  const labelId = useId();
  return (
    <div className={css.group} role="group" aria-labelledby={`${groupId}-${labelId}`}>
      <span className={css.label} id={`${groupId}-${labelId}`}>{title}</span>
      <div className={css.pillRow}>{children}</div>
    </div>
  );
}
