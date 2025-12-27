import css from "./Header.module.scss";

interface HeaderProps {
  lastUpdatedText: string;
  active?: "dashboard" | "teams";
}

export default function Header({ lastUpdatedText, active = "dashboard" }: HeaderProps) {
  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary">
        <div className={css.navGroup} role="tablist" aria-label="Views">
          <a
            href="/"
            className={`${css.navPill} ${active === "dashboard" ? css.navPillActive : ""}`}
            aria-current={active === "dashboard" ? "page" : undefined}
            role="tab"
          >
            Dashboard
          </a>
          <a
            href="/teams"
            className={`${css.navPill} ${active === "teams" ? css.navPillActive : ""}`}
            aria-current={active === "teams" ? "page" : undefined}
            role="tab"
          >
            Teams
          </a>
        </div>
      </nav>
    </header>
  );
}
