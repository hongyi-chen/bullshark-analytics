import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { AthleteWithTrainingData } from '@/app/ui/types';
import { fmtKm } from '@/app/utils/fmtKm';
import Card from '@/app/ui/cards/Card';
import css from './InjuryVolumeChart.module.scss';

interface InjuryVolumeChartProps {
  athlete: AthleteWithTrainingData;
  loading: boolean;
  riskyWeeks?: Map<string, { riskCount: number; risks: string[] }>; // Map of week dates to risk data
}

interface ChartDataPoint {
  weekStart: string;
  kilometers: number;
  isRisky?: boolean;
  riskData?: { riskCount: number; risks: string[] };
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; color: string; payload?: ChartDataPoint }>;
  label?: string;
}

function VolumeTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length || !label) return null;

  const riskData = payload[0]?.payload?.riskData;

  return (
    <div className={css.tooltip}>
      <div className={css.tooltipWeek}>Week of {new Date(label).toLocaleDateString()}</div>
      <div className={css.tooltipEntry}>
        <div className={css.tooltipLabel}>Volume</div>
        <div className={css.tooltipValue}>
          {fmtKm(payload[0].value ?? 0)} km
        </div>
      </div>
      {riskData && (
        <div className={css.tooltipRisk}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 20h20L12 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 9v4M12 17h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={css.tooltipRiskContent}>
            <span className={css.tooltipRiskTitle}>
              {riskData.riskCount} {riskData.riskCount === 1 ? 'Risk' : 'Risks'} Detected
            </span>
            <ul className={css.tooltipRiskList}>
              {riskData.risks.map((risk, idx) => (
                <li key={idx}>{formatRiskType(risk)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format risk types for display
// This makes it easy to handle new risk types that get added to the API
function formatRiskType(riskType: string): string {
  // Convert snake_case to Title Case
  return riskType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function InjuryVolumeChart({ athlete, loading, riskyWeeks }: InjuryVolumeChartProps) {
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = Object.entries(athlete.trainingData.weeklyKilometers)
      .map(([weekStart, kilometers]) => {
        const riskData = riskyWeeks?.get(weekStart);
        return {
          weekStart,
          kilometers,
          isRisky: riskData !== undefined,
          riskData,
        };
      })
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

    return data;
  }, [athlete, riskyWeeks]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return { average: 0, max: 0, min: 0, totalWeeks: 0 };
    }

    const volumes = chartData.map(d => d.kilometers);
    const total = volumes.reduce((sum, v) => sum + v, 0);
    const average = total / volumes.length;
    const max = Math.max(...volumes);
    const min = Math.min(...volumes);

    return {
      average,
      max,
      min,
      totalWeeks: chartData.length,
    };
  }, [chartData]);

  return (
    <Card fixedTall style={{ height: '500px' }}>
      <div className={css.header}>
        <div>
          <h2>{athlete.name}</h2>
          <p className="muted">Weekly Training Volume</p>
        </div>
        <div className={css.stats}>
          <div className={css.stat}>
            <span className={css.statLabel}>Avg</span>
            <span className={css.statValue}>{fmtKm(stats.average)} km</span>
          </div>
          <div className={css.stat}>
            <span className={css.statLabel}>Max</span>
            <span className={css.statValue}>{fmtKm(stats.max)} km</span>
          </div>
          <div className={css.stat}>
            <span className={css.statLabel}>Weeks</span>
            <span className={css.statValue}>{stats.totalWeeks}</span>
          </div>
        </div>
      </div>
      <div className="flexFill">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              label={{ value: 'km', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'rgba(231,237,246,0.7)' } }}
            />
            <Tooltip content={<VolumeTooltip />} />
            <Area
              type="monotone"
              dataKey="kilometers"
              stroke="none"
              fill="url(#volumeGradient)"
            />
            <Line
              type="monotone"
              dataKey="kilometers"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isRisky = payload.isRisky;

                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={isRisky ? '#ef4444' : 'var(--accent)'}
                      stroke={isRisky ? '#ef4444' : 'var(--accent)'}
                      strokeWidth={2}
                    />
                    {isRisky && (
                      <g transform={`translate(${cx - 10}, ${cy - 24})`}>
                        <path
                          d="M10 1L1 17h18L10 1z"
                          fill="#ef4444"
                          stroke="#1a1a1a"
                          strokeWidth="1"
                        />
                        <path
                          d="M10 6v4M10 13h.01"
                          stroke="#1a1a1a"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </g>
                );
              }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
