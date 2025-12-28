import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { AthleteStats } from "@/lib/types/dashboard";
import { TimeFilter } from "../types";
import { useMemo } from "react";
import Card from "./Card";
import css from "./RunsPerAthleteCard.module.scss";

interface RunsPerAthleteCardProps {
  athletes: AthleteStats[];
  timeFilter: TimeFilter;
}

export default function RunsPerAthleteCard({
  athletes,
  timeFilter,
}: RunsPerAthleteCardProps) {
  const runsBarData = useMemo(() => {
    return [...athletes]
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 10)
      .map((a) => ({ athlete: a.athleteName, runs: a.runs }));
  }, [athletes]);

  return (
    <Card
      header={
        <div>
          <div className="bold">Runs per athlete</div>
          <div className="muted">Top 10 by run count (this {timeFilter})</div>
        </div>
      }
    >
      <div className={css.chart}>
        <ResponsiveContainer>
          <BarChart
            data={runsBarData}
            layout="vertical"
            margin={{ top: 8, right: 18, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(231,237,246,0.08)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "rgba(231,237,246,0.7)" }}
            />
            <YAxis
              type="category"
              dataKey="athlete"
              width={120}
              tick={{ fontSize: 12, fill: "rgba(231,237,246,0.7)" }}
            />
            <Tooltip content={<ChartTooltip metricLabel="Runs" />} />
            <Bar
              dataKey="runs"
              fill="rgba(34, 197, 94, 0.45)"
              stroke="rgba(34, 197, 94, 0.85)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
