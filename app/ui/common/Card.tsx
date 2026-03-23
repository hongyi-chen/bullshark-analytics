import clsx from "clsx";
import css from "./Card.module.scss";
import { CSSProperties } from "react";

interface CardProps extends React.PropsWithChildren {
  fixedTall?: boolean;
  header?: React.JSX.Element;
  highlighted?: boolean;
  style?: CSSProperties;
  className?: string;
  as?: "section" | "article" | "div";
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export default function Card({
  children,
  fixedTall = false,
  header,
  highlighted = false,
  style,
  className,
  as: Component = "section",
  ariaLabel,
  ariaLabelledBy,
}: CardProps) {
  return (
    <Component
      className={clsx(css.card, className, {
        [css.fixedTall]: fixedTall,
        [css.highlighted]: highlighted,
      })}
      style={style}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {header != null && <div className={css.header}>{header}</div>}
      {children}
    </Component>
  );
}
