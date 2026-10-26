import css from "./ChartTooltip.module.scss";

interface TooltipPayloadItem {
  value?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  metricLabel: string;
  payload?: TooltipPayloadItem[];
  dateLabel?: string;
}

export default function ChartTooltip({
  active,
  payload,
  label,
  metricLabel,
  dateLabel = "Date",
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className={css.tooltip} role="tooltip">
      <div className={css.label}>{dateLabel}</div>
      <div className={css.value}>{label}</div>
      <div className={css.metricRow}>
        <div className={css.label}>{metricLabel}</div>
        <div className={css.metricValue}>{val}</div>
      </div>
    </div>
  );
}
