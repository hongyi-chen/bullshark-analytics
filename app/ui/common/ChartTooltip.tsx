import css from "./ChartTooltip.module.scss";

interface TooltipPayloadItem {
  value?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  metricLabel: string;
  payload?: TooltipPayloadItem[];
  labelTitle?: string;
}

export default function ChartTooltip({
  active,
  payload,
  label,
  metricLabel,
  labelTitle = "Date",
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className={css.tooltip} role="tooltip">
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
        {labelTitle}
      </div>
      <div style={{ fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{metricLabel}</div>
        <div style={{ fontSize: 13 }}>{val}</div>
      </div>
    </div>
  );
}
