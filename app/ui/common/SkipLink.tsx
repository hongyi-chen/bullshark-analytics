import css from "./SkipLink.module.scss";

export default function SkipLink() {
  return (
    <a href="#main-content" className={css.skipLink}>
      Skip to main content
    </a>
  );
}
