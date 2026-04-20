import { memo, useId } from 'react';
import css from '@/app/ui/dashboard/Filters.module.scss';

interface FilterOption<T extends string | number> {
  value: T;
  label: string;
}

interface FilterPillGroupProps<T extends string | number> {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
}

function FilterPillGroupInner<T extends string | number>({
  label,
  options,
  value,
  onChange,
  name,
}: FilterPillGroupProps<T>) {
  const groupId = useId();
  const groupName = name || `filter-group-${groupId}`;

  return (
    <div className={css.group} role="group" aria-labelledby={`${groupId}-label`}>
      <span id={`${groupId}-label`} className={css.label}>
        {label}
      </span>
      <div className={css.pillRow} role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={String(option.value)}
              className={css.pill}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              data-selected={isSelected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const FilterPillGroup = memo(FilterPillGroupInner) as typeof FilterPillGroupInner;
