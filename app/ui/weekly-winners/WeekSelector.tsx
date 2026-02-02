import { format, parseISO, addWeeks, subWeeks, startOfWeek, isAfter } from 'date-fns';
import css from '../dashboard/Filters.module.scss';
import weekSelectorCss from './WeekSelector.module.scss';

interface WeekSelectorProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export default function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const weekDate = parseISO(selectedWeek);
  const weekLabel = format(weekDate, 'MMM d, yyyy');

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
    <nav className={css.card} aria-label="Week navigation">
      <div className={css.group}>
        <span className={css.label} id="week-selection-label">Week Selection</span>
        <div className={css.pillRow} role="group" aria-labelledby="week-selection-label">
          <button
            className={css.pill}
            onClick={handlePrevious}
            type="button"
            aria-label={`Go to previous week, before ${weekLabel}`}
          >
            <span aria-hidden="true">←</span> Previous Week
          </button>
          <div 
            className={weekSelectorCss.currentWeek}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className={weekSelectorCss.visuallyHidden}>Currently viewing: </span>
            Week of {weekLabel}
          </div>
          <button
            className={`${css.pill} ${isCurrentWeek ? weekSelectorCss.disabledPill : ''}`}
            onClick={handleNext}
            type="button"
            disabled={isCurrentWeek}
            aria-label={isCurrentWeek ? "Cannot go to next week - already at current week" : `Go to next week, after ${weekLabel}`}
            aria-disabled={isCurrentWeek}
          >
            Next Week <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
