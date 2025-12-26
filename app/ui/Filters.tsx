import { Aggregation, TimeFilter } from "./types";
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
    <div className={css.card}>
      <FilterGroup title="Time Period">
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

      <div className={css.divider} />

      <FilterGroup title="Chart View">
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

      <div className={css.divider} />

      <FilterGroup title="Min Runs">
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
}

function FilterGroup({ children, title }: FilterGroupProps) {
  return (
    <div className={css.group}>
      <span className={css.label}>{title}</span>
      <div className={css.pillRow}>{children}</div>
    </div>
  );
}
