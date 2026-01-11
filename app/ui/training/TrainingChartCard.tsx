import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AthleteWithTrainingData } from '@/app/ui/types';
import { getChartColor } from '@/app/utils/athleteStyles';
import { fmtKm } from '@/app/utils/fmtKm';
import Card from '@/app/ui/common/Card';
import css from './TrainingChartCard.module.scss';

interface TrainingChartCardProps {
  athletes: AthleteWithTrainingData[];
  loading: boolean;
}

interface TrainingChartData {
  weekStart: string;
  [athleteName: string]: string | number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  focusedAthleteName?: string | null;
}

function TrainingTooltip({ active, payload, label, focusedAthleteName }: TooltipProps) {
  if (!active || !payload?.length || !label) return null;

  const filteredPayload =
    focusedAthleteName == null
      ? payload
      : payload.filter(entry => entry.name === focusedAthleteName);

  if (filteredPayload.length === 0) return null;

  return (
    <div className={css.tooltip}>
      <div className={css.tooltipWeek}>Week of {new Date(label).toLocaleDateString()}</div>
      {filteredPayload.map((entry, index) => (
        <div key={index} className={css.tooltipEntry}>
          <div className={css.tooltipName} style={{ color: entry.color }}>
            {entry.name}
          </div>
          <div className={css.tooltipValue}>
            {fmtKm(entry.value ?? 0)} km
          </div>
        </div>
      ))}
    </div>
  );
}

type LegendPayloadItem = {
  value?: unknown;
  dataKey?: unknown;
  color?: unknown;
};

type NameExtraction = {
  name: string | null;
  color: string | undefined;
};

function getLegendNameAndColor(item: LegendPayloadItem): NameExtraction {
  const rawName =
    typeof item.value === 'string'
      ? item.value
      : typeof item.dataKey === 'string'
        ? item.dataKey
        : null;

  const color = typeof item.color === 'string' ? item.color : undefined;

  return { name: rawName, color };
}

function ClickableLegend({
  payload,
  focusedAthleteName,
  onToggle,
  onClear,
}: {
  payload?: ReadonlyArray<LegendPayloadItem>;
  focusedAthleteName: string | null;
  onToggle: (athleteName: string) => void;
  onClear: () => void;
}) { 
  if (!payload?.length) return null;

  return (
    <div className={css.legend}>
      {focusedAthleteName != null && (
        <button
          type="button"
          className={css.legendReset}
          onClick={onClear}
          aria-label="Show all athletes"
        >
          Show all
        </button>
      )}
      {payload.map((item) => {
        const { name, color } = getLegendNameAndColor(item);
        if (name == null) return null;

        const isActive = focusedAthleteName === name;
        const isDimmed = focusedAthleteName != null && !isActive;

        return (
          <button
            key={name}
            type="button"
            className={`${css.legendItem} ${isActive ? css.legendItemActive : ''} ${isDimmed ? css.legendItemDimmed : ''}`}
            onClick={() => onToggle(name)}
            aria-pressed={isActive}
            aria-label={isActive ? `Show all athletes (unfocus ${name})` : `Focus ${name}`}
            title={focusedAthleteName == null ? 'Click to focus' : isActive ? 'Click to show all' : 'Click to focus'}
          >
            <span className={css.legendSwatch} style={{ backgroundColor: color ?? 'var(--text)' }} />
            <span className={css.legendLabel}>{name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function TrainingChartCard({ athletes, loading }: TrainingChartCardProps) {
  const [focusedAthleteName, setFocusedAthleteName] = useState<string | null>(null);

  useEffect(() => {
    if (focusedAthleteName == null) return;
    const stillPresent = athletes.some(athlete => athlete.name === focusedAthleteName);
    if (!stillPresent) setFocusedAthleteName(null);
  }, [athletes, focusedAthleteName]);

  const chartData = useMemo(() => {
    // Collect all unique week dates
    const allWeeks = new Set<string>();
    athletes.forEach(athlete => {
      Object.keys(athlete.trainingData.weeklyKilometers).forEach(date => {
        allWeeks.add(date);
      });
    });

    // Sort chronologically
    const sortedWeeks = Array.from(allWeeks).sort();

    // Build chart data structure
    return sortedWeeks.map(weekStart => {
      const point: TrainingChartData = { weekStart };
      athletes.forEach(athlete => {
        point[athlete.name] = athlete.trainingData.weeklyKilometers[weekStart] || 0;
      });
      return point;
    });
  }, [athletes]);

  if (athletes.length === 0) {
    return (
      <Card fixedTall>
        <div className={css.emptyState}>
          <p>No athletes match your filters</p>
        </div>
      </Card>
    );
  }

  return (
    <Card fixedTall style={{ height: '600px' }}>
      <div className={css.header}>
        <h2>Weekly Training Kilometers</h2>
        <p className="muted">{athletes.length} athlete{athletes.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="flexFill">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(231,237,246,0.08)" vertical={false} />
            <XAxis
              dataKey="weekStart"
              tick={{ fontSize: 12, fill: "rgba(231,237,246,0.7)" }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "rgba(231,237,246,0.7)" }}
              width={40}
            />
             <Tooltip content={<TrainingTooltip focusedAthleteName={focusedAthleteName} />} />
             <Legend
                verticalAlign="top"
                height={focusedAthleteName == null ? 40 : 56}
                content={(props) => (
                  <ClickableLegend
                    payload={props.payload}
                    focusedAthleteName={focusedAthleteName}
                    onToggle={(athleteName) =>
                      setFocusedAthleteName((prev) => (prev === athleteName ? null : athleteName))
                    }
                    onClear={() => setFocusedAthleteName(null)}
                  />
                )}
              />
             {athletes.map((athlete, idx) => {
               const isFocused = focusedAthleteName == null || focusedAthleteName === athlete.name;
               return (
                 <Line
                   key={athlete.name}
                   type="monotone"
                   dataKey={athlete.name}
                   stroke={getChartColor(idx)}
                   strokeWidth={isFocused ? 2.5 : 2}
                   strokeOpacity={isFocused ? 1 : 0.3}
                   dot={false}
                   name={athlete.name}
                 />
               );
             })}

          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
