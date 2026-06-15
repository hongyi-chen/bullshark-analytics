import clsx from "clsx";
import css from "./Card.module.scss";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  fixedTall?: boolean;
  header?: React.JSX.Element;
  highlighted?: boolean;
}

export default function Card({
  children,
  fixedTall = false,
  header,
  highlighted = false,
  style,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(css.card, className, {
        [css.fixedTall]: fixedTall,
        [css.highlighted]: highlighted,
      })}
      style={style}
      {...rest}
    >
      {header != null && <div className={css.header}>{header}</div>}
      {children}
    </div>
  );
}
