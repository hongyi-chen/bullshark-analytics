import { useId } from 'react';
import { format, parseISO, addWeeks, subWeeks, startOfWeek, isAfter } from 'date-fns';
import css from '../dashboard/Filters.module.scss';
import selectorCss from './WeekSelector.module.scss';

interface WeekSelectorProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export default function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const weekDate = parseISO(selectedWeek);
  const weekLabel = format(weekDate, 'MMM d, yyyy');
  const headingId = useId();

  const handlePrevious = () => {
    const prev = subWeeks(weekDate, 1);
    onWeekChange(format(prev, 'yyyy-MM-dd'));
  };

  const handleNext = () => {
    const next = addWeeks(weekDate, 1);
    const now = startOfWeek(new Date(), { weekStartsOn: 1 });

    if (isAfter(next, now)) return;

    onWeekChange(format(next, 'yyyy-MM-dd'));
  };

  const isCurrentWeek = selectedWeek === format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );

  return (
    <div className={css.card} role="group" aria-labelledby={headingId}>
      <div className={css.group}>
        <span id={headingId} className={css.label}>Week Selection</span>
        <div className={css.pillRow} role="group" aria-label="Week navigation">
          <button
            className={css.pill}
            onClick={handlePrevious}
            type="button"
            aria-label="Go to previous week"
          >
            <span aria-hidden="true">←</span> Previous Week
          </button>
          <div 
            className={selectorCss.weekDisplay}
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
            aria-label={isCurrentWeek ? "Cannot go to next week (currently viewing the current week)" : "Go to next week"}
            style={{ opacity: isCurrentWeek ? 0.5 : 1, cursor: isCurrentWeek ? 'not-allowed' : 'pointer' }}
          >
            Next Week <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
