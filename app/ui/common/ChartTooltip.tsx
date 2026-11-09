import css from "./ChartTooltip.module.scss";

interface TooltipPayloadItem {
  value?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  labelTitle?: string;
  metricLabel: string;
  payload?: TooltipPayloadItem[];
}

export default function ChartTooltip({
  active,
  payload,
  label,
  labelTitle = "Date",
  metricLabel,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className={css.tooltip} role="tooltip">
      <div className={css.labelTitle}>
        {labelTitle}
      </div>
      <div className={css.labelValue}>{label}</div>
      <div className={css.metricRow}>
        <div className={css.metricLabel}>{metricLabel}</div>
        <div className={css.metricValue}>{val}</div>
      </div>
    </div>
  );
}
