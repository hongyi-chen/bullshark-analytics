import css from "./SkipLink.module.scss";

export default function SkipLink() {
  return (
    <a href="#tabpanel-dashboard" className={css.skipLink}>
      Skip to main content
    </a>
  );
}
