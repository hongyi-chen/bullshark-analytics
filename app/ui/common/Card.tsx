import clsx from "clsx";
import css from "./Card.module.scss";
import { CSSProperties, HTMLAttributes } from "react";

interface CardProps extends React.PropsWithChildren, Pick<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-labelledby' | 'aria-label' | 'aria-describedby'> {
  fixedTall?: boolean;
  header?: React.JSX.Element;
  highlighted?: boolean;
  style?: CSSProperties;
  className?: string;
}

export default function Card({
  children,
  fixedTall = false,
  header,
  highlighted = false,
  style,
  className,
  role,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: CardProps) {
  return (
    <div
      className={clsx(css.card, className, {
        [css.fixedTall]: fixedTall,
        [css.highlighted]: highlighted,
      })}
      style={style}
      role={role}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {header != null && <div className={css.header}>{header}</div>}
      {children}
    </div>
  );
}
