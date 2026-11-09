import css from "./Footer.module.scss";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <div className={css.brand}>
          <span className={css.shark} aria-hidden="true">🦈</span>
          <span>Bullshark Analytics</span>
        </div>
        <div className={css.links}>
          <span className="muted">Powered by Bullsharks Server</span>
          <span className={css.divider} aria-hidden="true">·</span>
          <a
            className="muted"
            href="https://warp.dev/careers"
            target="_blank"
            rel="noopener noreferrer"
          >
            warp.dev/careers
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <span className={css.divider} aria-hidden="true">·</span>
          <span className="muted">© {CURRENT_YEAR}</span>
        </div>
      </div>
    </footer>
  );
}
