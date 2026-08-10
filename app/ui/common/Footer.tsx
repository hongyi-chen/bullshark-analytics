"use client";

import { useEffect, useState } from "react";
import css from "./Footer.module.scss";
import ExternalLink from "./ExternalLink";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <div className={css.brand}>
          <span className={css.shark} role="img" aria-label="shark">🦈</span>
          <span>Bullshark Analytics</span>
        </div>
        <div className={css.links}>
          <span className="muted">Powered by Bullsharks Server</span>
          <span className={css.divider} aria-hidden="true">·</span>
          <ExternalLink href="https://warp.dev/careers" className="muted">
            warp.dev/careers
          </ExternalLink>
          <span className={css.divider} aria-hidden="true">·</span>
          <span className="muted">© {year}</span>
        </div>
      </div>
    </footer>
  );
}
