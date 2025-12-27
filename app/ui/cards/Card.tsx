import clsx from "clsx";
import css from "./Card.module.scss";
import { CSSProperties } from "react";

interface CardProps extends React.PropsWithChildren {
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
}: CardProps) {
  return (
    <div
      className={clsx(css.card, className, {
        [css.fixedTall]: fixedTall,
        [css.highlighted]: highlighted,
      })}
      style={style}
    >
      {header != null && <div className={css.header}>{header}</div>}
      {children}
    </div>
  );
}
