import clsx from "clsx";
import css from "./Card.module.scss";
import { CSSProperties, HTMLAttributes } from "react";

interface CardProps extends React.PropsWithChildren {
  fixedTall?: boolean;
  header?: React.JSX.Element;
  highlighted?: boolean;
  style?: CSSProperties;
  className?: string;
  role?: HTMLAttributes<HTMLDivElement>['role'];
  'aria-labelledby'?: string;
  'aria-label'?: string;
}

export default function Card({
  children,
  fixedTall = false,
  header,
  highlighted = false,
  style,
  className,
  role,
  'aria-labelledby': ariaLabelledby,
  'aria-label': ariaLabel,
}: CardProps) {
  return (
    <div
      className={clsx(css.card, className, {
        [css.fixedTall]: fixedTall,
        [css.highlighted]: highlighted,
      })}
      style={style}
      role={role}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
    >
      {header != null && <div className={css.header}>{header}</div>}
      {children}
    </div>
  );
}
