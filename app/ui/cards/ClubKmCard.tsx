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
import ChartTooltip from "./ChartTooltip";
import { useMemo } from "react";
import Card from "./Card";

interface ClubKmCardProps {
  aggregation: Aggregation;
  chartData: ChartData[];
  timeFilter: TimeFilter;
  totalKm: number;
}

export default function ClubKmCard({
  aggregation,
  chartData,
  timeFilter,
  totalKm,
}: ClubKmCardProps) {
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
      <div className="flexFill">
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
