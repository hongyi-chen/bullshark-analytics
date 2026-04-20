import { memo, useId } from "react";
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

const TIME_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const AGGREGATION_OPTIONS: { value: Aggregation; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

const MIN_RUNS_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "All" },
  { value: 3, label: "3+" },
  { value: 5, label: "5+" },
  { value: 10, label: "10+" },
];

function Filters({
  aggregation,
  minRuns,
  setAggregation,
  setMinRuns,
  setTimeFilter,
  timeFilter,
}: FiltersProps) {
  return (
    <div className={css.card} role="group" aria-label="Dashboard filters">
      <FilterGroup
        title="Time Period"
        options={TIME_OPTIONS}
        value={timeFilter}
        onChange={setTimeFilter}
      />

      <div className={css.divider} role="separator" aria-hidden="true" />

      <FilterGroup
        title="Chart View"
        options={AGGREGATION_OPTIONS}
        value={aggregation}
        onChange={setAggregation}
      />

      <div className={css.divider} role="separator" aria-hidden="true" />

      <FilterGroup
        title="Min Runs"
        options={MIN_RUNS_OPTIONS}
        value={minRuns}
        onChange={setMinRuns}
      />
    </div>
  );
}

export default memo(Filters);

interface FilterGroupProps<T extends string | number> {
  title: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function FilterGroup<T extends string | number>({
  title,
  options,
  value,
  onChange,
}: FilterGroupProps<T>) {
  const groupId = useId();

  return (
    <fieldset className={css.group}>
      <legend id={`${groupId}-label`} className={css.label}>
        {title}
      </legend>
      <div className={css.pillRow} role="radiogroup" aria-labelledby={`${groupId}-label`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={String(option.value)}
              className={css.pill}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
