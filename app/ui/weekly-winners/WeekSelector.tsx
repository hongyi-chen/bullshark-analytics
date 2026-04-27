import { useCallback } from 'react';
import { format, parseISO, addWeeks, subWeeks, startOfWeek, isAfter } from 'date-fns';
import css from '../dashboard/Filters.module.scss';

interface WeekSelectorProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export default function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const weekDate = parseISO(selectedWeek);
  const weekLabel = format(weekDate, 'MMM d, yyyy');

  const handlePrevious = useCallback(() => {
    const prev = subWeeks(weekDate, 1);
    onWeekChange(format(prev, 'yyyy-MM-dd'));
  }, [weekDate, onWeekChange]);

  const handleNext = useCallback(() => {
    const next = addWeeks(weekDate, 1);
    const now = startOfWeek(new Date(), { weekStartsOn: 1 });

    if (isAfter(next, now)) return;

    onWeekChange(format(next, 'yyyy-MM-dd'));
  }, [weekDate, onWeekChange]);

  const isCurrentWeek = selectedWeek === format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );

  return (
    <nav className={css.card} aria-label="Week navigation">
      <fieldset className={css.group} role="group" aria-labelledby="week-selection-label">
        <legend id="week-selection-label" className={css.label}>Week Selection</legend>
        <div className={css.pillRow}>
          <button
            className={css.pill}
            onClick={handlePrevious}
            type="button"
            aria-label="Go to previous week"
          >
            <span aria-hidden="true">← </span>Previous Week
          </button>
          <div 
            style={{
              padding: '8px 16px',
              fontWeight: 600,
              color: 'var(--text)'
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            Week of {weekLabel}
          </div>
          <button
            className={css.pill}
            onClick={handleNext}
            type="button"
            disabled={isCurrentWeek}
            aria-label={isCurrentWeek ? "Cannot go to next week (current week)" : "Go to next week"}
            aria-disabled={isCurrentWeek}
            style={{ opacity: isCurrentWeek ? 0.5 : 1, cursor: isCurrentWeek ? 'not-allowed' : 'pointer' }}
          >
            Next Week<span aria-hidden="true"> →</span>
          </button>
        </div>
      </fieldset>
    </nav>
  );
}
