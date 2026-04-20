import { memo, CSSProperties } from "react";
import clsx from "clsx";
import css from "./Card.module.scss";

interface CardProps extends React.PropsWithChildren {
  fixedTall?: boolean;
  header?: React.JSX.Element;
  highlighted?: boolean;
  style?: CSSProperties;
  className?: string;
}

function Card({
  children,
  fixedTall = false,
  header,
  highlighted = false,
  style,
  className,
}: CardProps) {
  return (
    <section
      className={clsx(css.card, className, {
        [css.fixedTall]: fixedTall,
        [css.highlighted]: highlighted,
      })}
      style={style}
    >
      {header != null && <div className={css.header}>{header}</div>}
      {children}
    </section>
  );
}

export default memo(Card);
