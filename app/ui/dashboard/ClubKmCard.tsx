import { useMemo } from "react";
import { fmtKm } from "@/app/utils/fmtKm";
import { Aggregation, ChartData, TimeFilter } from "../types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "../common/ChartTooltip";
import Card from "../common/Card";

interface ClubKmCardProps {
  aggregation: Aggregation;
  chartData: ChartData[];
  timeFilter: TimeFilter;
  totalKm: number;
}

function generateChartDescription(chartData: ChartData[], aggregation: Aggregation): string {
  if (chartData.length === 0) return "No data available.";
  
  const maxPoint = chartData.reduce((max, d) => d.km > max.km ? d : max, chartData[0]);
  const minPoint = chartData.reduce((min, d) => d.km < min.km ? d : min, chartData[0]);
  
  return `Line chart showing club kilometers per ${aggregation === "daily" ? "day" : "week"}. ` +
    `${chartData.length} data points. ` +
    `Highest: ${fmtKm(maxPoint.km)} km on ${maxPoint.day}. ` +
    `Lowest: ${fmtKm(minPoint.km)} km on ${minPoint.day}.`;
}

export default function ClubKmCard({
  aggregation,
  chartData,
  timeFilter,
  totalKm,
}: ClubKmCardProps) {
  const chartDescription = useMemo(
    () => generateChartDescription(chartData, aggregation),
    [chartData, aggregation]
  );

  return (
    <Card
      fixedTall={true}
      header={
        <>
          <div>
            <div className="bold">
              Club km per {aggregation === "daily" ? "day" : "week"}
            </div>
            <div className="muted">
              Total distance {aggregation === "daily" ? "per day" : "per week"}{" "}
              (this {timeFilter})
            </div>
          </div>
          <div className="badge">Total: {fmtKm(totalKm)} km</div>
        </>
      }
    >
      <div className="flexFill" role="img" aria-label={chartDescription}>
        <span className="sr-only">{chartDescription}</span>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 18, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(231,237,246,0.08)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "rgba(231,237,246,0.7)" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "rgba(231,237,246,0.7)" }}
              width={34}
            />
            <Tooltip content={<ChartTooltip metricLabel="Club km" />} />
            <Line
              type="monotone"
              dataKey="km"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
