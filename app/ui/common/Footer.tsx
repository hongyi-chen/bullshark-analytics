import css from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={css.footer} role="contentinfo">
      <div className={css.content}>
        <div className={css.brand}>
          <span className={css.shark} role="img" aria-label="shark">🦈</span>
          <span>Bullshark Analytics</span>
        </div>
        <nav className={css.links} aria-label="Footer navigation">
          <span className="muted">Powered by Bullsharks Server</span>
          <span className={css.divider} aria-hidden="true">·</span>
          <a
            className="muted"
            href="https://warp.dev/careers"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Warp careers (opens in new tab)"
          >
            warp.dev/careers
            <span className={css.visuallyHidden}> (opens in new tab)</span>
          </a>
          <span className={css.divider} aria-hidden="true">·</span>
          <span className="muted">© {new Date().getFullYear()}</span>
        </nav>
      </div>
    </footer>
  );
}
