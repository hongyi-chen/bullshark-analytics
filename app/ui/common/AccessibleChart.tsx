import { ReactNode } from 'react';

interface AccessibleChartProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AccessibleChart({ 
  children, 
  title,
  description 
}: AccessibleChartProps) {
  return (
    <figure
      role="img"
      aria-label={title}
      aria-describedby={description ? "chart-desc" : undefined}
    >
      {description && (
        <figcaption id="chart-desc" className="sr-only">
          {description}
        </figcaption>
      )}
      {children}
    </figure>
  );
}
