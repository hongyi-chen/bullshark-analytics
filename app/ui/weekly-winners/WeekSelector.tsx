import { format, parseISO, addWeeks, subWeeks, startOfWeek, isAfter } from 'date-fns';
import css from '../dashboard/Filters.module.scss';

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
    <div className={css.card}>
      <div className={css.group}>
        <span className={css.label}>Week Selection</span>
        <div className={css.pillRow}>
          <button
            className={css.pill}
            onClick={handlePrevious}
            type="button"
          >
            ← Previous Week
          </button>
          <div style={{
            padding: '8px 16px',
            fontWeight: 600,
            color: 'var(--text)'
          }}>
            Week of {weekLabel}
          </div>
          <button
            className={css.pill}
            onClick={handleNext}
            type="button"
            disabled={isCurrentWeek}
            style={{ opacity: isCurrentWeek ? 0.5 : 1, cursor: isCurrentWeek ? 'not-allowed' : 'pointer' }}
          >
            Next Week →
          </button>
        </div>
      </div>
    </div>
  );
}
