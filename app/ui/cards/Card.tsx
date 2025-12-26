import clsx from "clsx";
import css from "./Card.module.scss";
import { CSSProperties } from "react";

interface CardProps extends React.PropsWithChildren {
  fixedTall?: boolean;
  header?: React.JSX.Element;
  highlighted?: boolean;
  style?: CSSProperties;
}

export default function Card({
  children,
  fixedTall = false,
  header,
  highlighted = false,
  style,
}: CardProps) {
  return (
    <div
      className={clsx(css.card, {
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
