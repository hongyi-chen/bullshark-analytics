import css from "./ChartTooltip.module.scss";

interface TooltipPayloadItem {
  value?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  metricLabel: string;
  payload?: TooltipPayloadItem[];
  labelPrefix?: string;
}

export default function ChartTooltip({
  active,
  payload,
  label,
  metricLabel,
  labelPrefix = "Date",
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  
  const formatLabel = (lbl: string | number | undefined): string => {
    if (lbl === undefined) return "";
    if (typeof lbl === "number") return lbl.toString();
    if (lbl.includes("Week of")) return lbl;
    const date = new Date(lbl);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
    return lbl;
  };

  return (
    <div className={css.tooltip} role="tooltip">
      <div className={css.labelHeader}>{labelPrefix}</div>
      <div className={css.labelValue}>{formatLabel(label)}</div>
      <div className={css.metricRow}>
        <div className={css.metricLabel}>{metricLabel}</div>
        <div className={css.metricValue}>{val}</div>
      </div>
    </div>
  );
}
