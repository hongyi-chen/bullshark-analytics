import css from "./Footer.module.scss";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <div className={css.brand}>
          <span className={css.shark}>🦈</span>
          <span>Bullshark Analytics</span>
        </div>
        <div className={css.links}>
          <span className="muted">Powered by Bullsharks Server</span>
          <span className={css.divider}>·</span>
          <a
            className="muted"
            href="https://warp.dev/careers"
            target="_blank"
            rel="noreferrer"
          >
            warp.dev/careers
          </a>
          <span className={css.divider}>·</span>
          <span className="muted">© {YEAR}</span>
        </div>
      </div>
    </footer>
  );
}
