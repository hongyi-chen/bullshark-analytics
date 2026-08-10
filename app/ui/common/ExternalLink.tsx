import { ReactNode } from "react";
import css from "./ExternalLink.module.scss";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${css.link} ${className ?? ""}`}
    >
      {children}
      <span className={css.iconWrapper} aria-hidden="true">
        <svg
          className={css.icon}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <path
            d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={css.visuallyHidden}>(opens in new tab)</span>
    </a>
  );
}
