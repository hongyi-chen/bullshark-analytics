import clsx from "clsx";
import css from "./Card.module.scss";
import { CSSProperties } from "react";

interface CardProps extends React.PropsWithChildren {
  fixedTall?: boolean;
  header?: React.JSX.Element;
  highlighted?: boolean;
  style?: CSSProperties;
  className?: string;
  "aria-busy"?: boolean;
}

export default function Card({
  children,
  fixedTall = false,
  header,
  highlighted = false,
  style,
  className,
  "aria-busy": ariaBusy,
}: CardProps) {
  return (
    <div
      className={clsx(css.card, className, {
        [css.fixedTall]: fixedTall,
        [css.highlighted]: highlighted,
      })}
      style={style}
      aria-busy={ariaBusy}
    >
      {header != null && <div className={css.header}>{header}</div>}
      {children}
    </div>
  );
}
