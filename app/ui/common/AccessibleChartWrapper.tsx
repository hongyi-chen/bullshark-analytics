import { ReactNode } from 'react';

interface AccessibleChartWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
  id: string;
}

export default function AccessibleChartWrapper({
  children,
  title,
  description,
  id,
}: AccessibleChartWrapperProps) {
  const titleId = `${id}-title`;
  const descId = description ? `${id}-desc` : undefined;
  const labelledBy = descId ? `${titleId} ${descId}` : titleId;

  return (
    <div
      role="img"
      aria-labelledby={labelledBy}
      className="chart-wrapper"
    >
      <span id={titleId} className="sr-only">{title}</span>
      {description && <span id={descId} className="sr-only">{description}</span>}
      {children}
    </div>
  );
}
