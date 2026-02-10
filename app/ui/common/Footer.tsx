"use client";

import css from "./Footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear().toString();

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
          <span className="muted">© {year}</span>
        </div>
      </div>
    </footer>
  );
}
