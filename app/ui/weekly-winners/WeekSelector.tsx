import { useId } from 'react';
import { format, parseISO, addWeeks, subWeeks, startOfWeek, isAfter } from 'date-fns';
import css from '../dashboard/Filters.module.scss';

interface WeekSelectorProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export default function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const weekDate = parseISO(selectedWeek);
  const weekLabel = format(weekDate, 'MMM d, yyyy');
  const labelId = useId();

  const handlePrevious = () => {
    const prev = subWeeks(weekDate, 1);
    onWeekChange(format(prev, 'yyyy-MM-dd'));
  };

  const handleNext = () => {
    const next = addWeeks(weekDate, 1);
    const now = startOfWeek(new Date(), { weekStartsOn: 1 });

    // Don't allow future weeks
    if (isAfter(next, now)) return;

    onWeekChange(format(next, 'yyyy-MM-dd'));
  };

  const isCurrentWeek = selectedWeek === format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );

  return (
    <div className={css.card} role="region" aria-label="Week selection">
      <div className={css.group} role="group" aria-labelledby={labelId}>
        <span id={labelId} className={css.label}>Week Selection</span>
        <div className={css.pillRow}>
          <button
            className={css.pill}
            onClick={handlePrevious}
            type="button"
            aria-label={`Go to previous week, ${format(subWeeks(weekDate, 1), 'MMMM d, yyyy')}`}
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
          >
            Week of {weekLabel}
          </div>
          <button
            className={css.pill}
            onClick={handleNext}
            type="button"
            disabled={isCurrentWeek}
            aria-disabled={isCurrentWeek}
            aria-label={isCurrentWeek ? 'Next week (current week selected)' : `Go to next week, ${format(addWeeks(weekDate, 1), 'MMMM d, yyyy')}`}
            style={{ opacity: isCurrentWeek ? 0.5 : 1, cursor: isCurrentWeek ? 'not-allowed' : 'pointer' }}
          >
            Next Week <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
