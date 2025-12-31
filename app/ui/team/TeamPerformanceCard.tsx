import { fmtKm } from "@/app/utils/fmtKm";
import { TeamComparisonChartData, AthleteBreakdownChartData } from "@/lib/types/dashboard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../common/Card";
import { getAthleteColour, getChartColor } from "@/app/utils/athleteStyles";
import css from "./TeamPerformanceCard.module.scss";

interface TooltipPayloadEntry {
  color?: string;
  fill?: string;
  name?: string;
  value?: number;
}

interface TeamPerformanceCardProps {
  viewMode: 'comparison' | 'bulls-breakdown' | 'sharks-breakdown';
  chartData: TeamComparisonChartData[] | AthleteBreakdownChartData[];
  athleteNames?: string[];
  team?: 'bulls' | 'sharks';
  totalBullsKm: number;
  totalSharksKm: number;
}

export default function TeamPerformanceCard({
  viewMode,
  chartData,
  athleteNames,
  team,
  totalBullsKm,
  totalSharksKm,
}: TeamPerformanceCardProps) {
  return (
    <Card
      fixedTall={true}
      className={css.chartContainer}
      header={
        <>
          <div>
            <div className="bold">Team Performance</div>
            <div className="muted">Weekly kilometers by team</div>
          </div>
          <div className={css.badgeContainer}>
            <div className="badge">🐂 Bulls: {fmtKm(totalBullsKm)} km</div>
            <div className="badge">🦈 Sharks: {fmtKm(totalSharksKm)} km</div>
          </div>
        </>
      }
    >
      <div className="flexFill">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'comparison' ? (
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 18, left: 0, bottom: 0 }}
            >
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
                width={34}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length || !label) return null;
                  return (
                    <div className={css.tooltip}>
                      <div className={css.tooltipWeekLabel}>
                        Week
                      </div>
                      <div className={css.tooltipDate}>
                        {new Date(label).toLocaleDateString()}
                      </div>
                      {payload.map((entry: TooltipPayloadEntry, index: number) => (
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
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="line"
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="bullsKm"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={false}
                name="🐂 Bulls"
              />
              <Line
                type="monotone"
                dataKey="sharksKm"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="🦈 Sharks"
              />
            </LineChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 18, left: 0, bottom: 0 }}
            >
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
                width={34}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length || !label) return null;
                  return (
                    <div className={css.tooltip}>
                      <div className={css.tooltipWeekLabel}>
                        Week
                      </div>
                      <div className={css.tooltipDate}>
                        {new Date(label).toLocaleDateString()}
                      </div>
                      {[...payload].reverse().map((entry: TooltipPayloadEntry, index: number) => (
                        <div key={index} className={css.tooltipEntry}>
                          <div className={css.tooltipName} style={{ color: entry.fill }}>
                            {entry.name}
                          </div>
                          <div className={css.tooltipValue}>
                            {fmtKm(entry.value ?? 0)} km
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="square"
                wrapperStyle={{ fontSize: 12 }}
              />
              {/* Assign high-contrast, unique colors for current set of athletes */}
              {athleteNames?.map((name, idx) => {
                const color = getChartColor(idx);
                return (
                  <Area
                    key={name}
                    type="linear"
                    dataKey={name}
                    stackId="1"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.8}
                    strokeWidth={2}
                    name={name}
                  />
                );
              })}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
