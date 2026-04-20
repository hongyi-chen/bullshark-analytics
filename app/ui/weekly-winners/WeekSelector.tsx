import { memo, useCallback, useId } from 'react';
import { format, parseISO, addWeeks, subWeeks, startOfWeek, isAfter } from 'date-fns';
import css from '../dashboard/Filters.module.scss';

interface WeekSelectorProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const groupId = useId();
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
    <div className={css.card} role="group" aria-labelledby={`${groupId}-label`}>
      <div className={css.group}>
        <span id={`${groupId}-label`} className={css.label}>
          Week Selection
        </span>
        <div className={css.pillRow} role="group" aria-label="Week navigation">
          <button
            className={css.pill}
            onClick={handlePrevious}
            type="button"
            aria-label={`Go to previous week from ${weekLabel}`}
          >
            <span aria-hidden="true">←</span> Previous Week
          </button>
          <div
            style={{
              padding: '8px 16px',
              fontWeight: 600,
              color: 'var(--text)'
            }}
            role="status"
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
            aria-disabled={isCurrentWeek}
            aria-label={isCurrentWeek ? 'Cannot go to next week (current week)' : `Go to next week from ${weekLabel}`}
            style={{ opacity: isCurrentWeek ? 0.5 : 1, cursor: isCurrentWeek ? 'not-allowed' : 'pointer' }}
          >
            Next Week <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(WeekSelector);
