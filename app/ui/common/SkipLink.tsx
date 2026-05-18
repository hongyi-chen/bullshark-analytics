import css from "./SkipLink.module.scss";

interface SkipLinkProps {
  href: string;
  children?: React.ReactNode;
}

export default function SkipLink({
  href,
  children = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a href={href} className={css.skipLink}>
      {children}
    </a>
  );
}
