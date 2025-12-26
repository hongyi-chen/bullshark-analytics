import { fmtKm } from "@/app/utils/fmtKm";
import { TeamComparisonChartData } from "@/lib/types/dashboard";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import Card from "./Card";

interface TeamPerformanceCardProps {
  chartData: TeamComparisonChartData[];
  totalBullsKm: number;
  totalSharksKm: number;
}

export default function TeamPerformanceCard({
  chartData,
  totalBullsKm,
  totalSharksKm,
}: TeamPerformanceCardProps) {
  return (
    <Card
      fixedTall={true}
      header={
        <>
          <div>
            <div className="bold">Team Performance</div>
            <div className="muted">Weekly kilometers by team</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="badge">Bulls: {fmtKm(totalBullsKm)} km</div>
            <div className="badge">Sharks: {fmtKm(totalSharksKm)} km</div>
          </div>
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
                  <div
                    style={{
                      background: "rgba(15, 22, 32, 0.95)",
                      border: "1px solid rgba(231, 237, 246, 0.12)",
                      borderRadius: 10,
                      padding: "10px 10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        marginBottom: 4,
                      }}
                    >
                      Week
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 8 }}>
                      {new Date(label).toLocaleDateString()}
                    </div>
                    {payload.map((entry: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ fontSize: 12, color: entry.color }}>
                          {entry.name}
                        </div>
                        <div style={{ fontSize: 13 }}>
                          {fmtKm(entry.value)} km
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
              name="Bulls"
            />
            <Line
              type="monotone"
              dataKey="sharksKm"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Sharks"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
