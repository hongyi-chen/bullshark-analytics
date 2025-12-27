import css from "./Header.module.scss";

interface HeaderProps {
  lastUpdatedText: string;
}

export default function Header({ lastUpdatedText }: HeaderProps) {
  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <div className={css.actions}>
        <a href="/teams" className={css.navButton} aria-label="View teams page">
          Teams
        </a>
        <span className="badge">Public club dashboard</span>
      </div>
    </header>
  );
}
