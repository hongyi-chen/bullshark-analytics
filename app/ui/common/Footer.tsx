"use client";

import { useEffect, useState } from "react";
import css from "./Footer.module.scss";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className={css.footer} role="contentinfo">
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
            aria-label="Warp careers page (opens in new tab)"
          >
            warp.dev/careers
          </a>
          <span className={css.divider} aria-hidden="true">·</span>
          <span className="muted">© {year} Bullshark Analytics</span>
        </div>
      </div>
    </footer>
  );
}
