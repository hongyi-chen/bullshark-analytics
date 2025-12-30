import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AthleteWithTrainingData } from '@/app/ui/types';
import { getChartColor } from '@/app/utils/athleteStyles';
import { fmtKm } from '@/app/utils/fmtKm';
import Card from '@/app/ui/cards/Card';
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
}

function TrainingTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className={css.tooltip}>
      <div className={css.tooltipWeek}>Week of {new Date(label).toLocaleDateString()}</div>
      {payload.map((entry, index) => (
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

export default function TrainingChartCard({ athletes, loading }: TrainingChartCardProps) {
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
            <Tooltip content={<TrainingTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              wrapperStyle={{ fontSize: 12 }}
            />
            {athletes.map((athlete, idx) => (
              <Line
                key={athlete.name}
                type="monotone"
                dataKey={athlete.name}
                stroke={getChartColor(idx)}
                strokeWidth={2}
                dot={false}
                name={athlete.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
